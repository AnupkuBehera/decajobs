import { createClient } from "@supabase/supabase-js";

/**
 * Candidate with a complete profile, ready for digest generation.
 */
export interface ActiveCandidateWithProfile {
  id: string;
  email: string;
  preferred_delivery_time: string;
  timeZone: string;
  profile: {
    target_titles: string[];
    skills: string[];
    location: string;
  };
}

/**
 * Infer regional timezone based on profile location (India, UAE, UK, US, Global).
 */
export function inferCandidateTimeZone(location: string): string {
  const loc = (location || "").toLowerCase();
  if (
    loc.includes("dubai") ||
    loc.includes("uae") ||
    loc.includes("abu dhabi") ||
    loc.includes("sharjah") ||
    loc.includes("gulf") ||
    loc.includes("qatar") ||
    loc.includes("saudi")
  ) {
    return "Asia/Dubai"; // GST (UTC+4)
  }
  if (
    loc.includes("london") ||
    loc.includes("uk") ||
    loc.includes("united kingdom") ||
    loc.includes("manchester") ||
    loc.includes("cambridge") ||
    loc.includes("bristol")
  ) {
    return "Europe/London"; // GMT / BST
  }
  if (
    loc.includes("san francisco") ||
    loc.includes("sf") ||
    loc.includes("california") ||
    loc.includes("seattle") ||
    loc.includes("los angeles") ||
    loc.includes("bay area") ||
    loc.includes("silicon valley")
  ) {
    return "America/Los_Angeles"; // PST / PDT (UTC-8 / -7)
  }
  if (
    loc.includes("austin") ||
    loc.includes("texas") ||
    loc.includes("chicago") ||
    loc.includes("dallas")
  ) {
    return "America/Chicago"; // CST / CDT (UTC-6 / -5)
  }
  if (
    loc.includes("us") ||
    loc.includes("usa") ||
    loc.includes("united states") ||
    loc.includes("new york") ||
    loc.includes("nyc") ||
    loc.includes("boston") ||
    loc.includes("florida") ||
    loc.includes("miami")
  ) {
    return "America/New_York"; // EST / EDT (UTC-5 / -4)
  }
  return "Asia/Kolkata"; // IST (UTC+5:30) default
}

/**
 * Checks if the candidate's current local hour matches the 7:00 AM delivery window.
 */
export function isCandidateInDeliveryWindow(timeZone: string, targetHour: number = 7): boolean {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
    });
    const currentHour = parseInt(formatter.format(new Date()), 10);
    return currentHour === targetHour;
  } catch {
    return true; // Fallback to allow delivery
  }
}

/**
 * Batch size for processing candidates.
 * Keeps memory usage and API rate limits under control.
 */
const BATCH_SIZE = 50;

/**
 * Creates a Supabase client using the service role key to bypass RLS.
 * This is required for the cron job which runs without a user session.
 */
function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials missing in runtime environment");
  }

  return createClient(url, key);
}

/**
 * Fetches all active candidates with complete profiles from the database.
 * Optionally filters to candidates whose local time is currently 7:00 AM.
 *
 * @param filterByLocalTime - When true, only returns candidates where local time is 7:00 AM
 * @returns Array of active candidates with their profile data
 */
export async function fetchActiveCandidates(
  filterByLocalTime: boolean = false
): Promise<ActiveCandidateWithProfile[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("candidates")
    .select(
      `
      id,
      email,
      preferred_delivery_time,
      candidate_profiles!inner (
        target_titles,
        skills,
        location
      )
    `
    )
    .eq("is_active", true);

  if (error) {
    console.error("[daily-digest] Error fetching active candidates:", error);
    throw new Error(`Failed to fetch candidates: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.log("[daily-digest] No active candidates with complete profiles found");
    return [];
  }

  // Filter to candidates with complete profiles and in 7:00 AM local delivery window
  const candidates: ActiveCandidateWithProfile[] = [];

  for (const row of data) {
    const profile = row.candidate_profiles as unknown as {
      target_titles: string[];
      skills: string[];
      location: string;
    };

    // Skip candidates with incomplete profiles (must have at least target titles and location)
    if (
      !profile ||
      !Array.isArray(profile.target_titles) ||
      profile.target_titles.length === 0 ||
      !profile.location ||
      profile.location.trim() === ""
    ) {
      continue;
    }

    const effectiveSkills =
      Array.isArray(profile.skills) && profile.skills.length > 0
        ? profile.skills
        : profile.target_titles;

    const timeZone = inferCandidateTimeZone(profile.location);

    if (filterByLocalTime && !isCandidateInDeliveryWindow(timeZone, 7)) {
      continue;
    }

    candidates.push({
      id: row.id,
      email: row.email,
      preferred_delivery_time: row.preferred_delivery_time,
      timeZone,
      profile: {
        target_titles: profile.target_titles,
        skills: effectiveSkills,
        location: profile.location,
      },
    });
  }

  console.log(
    `[daily-digest] Fetched ${candidates.length} active candidates with complete profiles`
  );

  return candidates;
}

/**
 * Generator that yields candidates in batches of BATCH_SIZE (50).
 */
export function* batchCandidates(
  candidates: ActiveCandidateWithProfile[]
): Generator<ActiveCandidateWithProfile[]> {
  const totalBatches = Math.ceil(candidates.length / BATCH_SIZE);

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const batch = candidates.slice(i, i + BATCH_SIZE);

    console.log(
      `[daily-digest] Processing batch ${batchNumber}/${totalBatches} (${batch.length} candidates)`
    );

    yield batch;
  }
}
