import { createClient } from "@supabase/supabase-js";

/**
 * Candidate with a complete profile, ready for digest generation.
 */
export interface ActiveCandidateWithProfile {
  id: string;
  email: string;
  preferred_delivery_time: string;
  profile: {
    target_titles: string[];
    skills: string[];
    location: string;
  };
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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Fetches all active candidates with complete profiles from the database.
 * A complete profile has non-empty target_titles, skills, and location.
 *
 * Only candidates where is_active = true are included.
 *
 * @returns Array of active candidates with their profile data
 */
export async function fetchActiveCandidates(): Promise<
  ActiveCandidateWithProfile[]
> {
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

  // Filter to only candidates with complete profiles (non-empty target_titles, skills, location)
  const candidates: ActiveCandidateWithProfile[] = [];

  for (const row of data) {
    // candidate_profiles is joined as inner, so it always exists
    // but we cast and validate the shape
    const profile = row.candidate_profiles as unknown as {
      target_titles: string[];
      skills: string[];
      location: string;
    };

    // Skip candidates with incomplete profiles
    if (
      !profile ||
      !Array.isArray(profile.target_titles) ||
      profile.target_titles.length === 0 ||
      !Array.isArray(profile.skills) ||
      profile.skills.length === 0 ||
      !profile.location ||
      profile.location.trim() === ""
    ) {
      continue;
    }

    candidates.push({
      id: row.id,
      email: row.email,
      preferred_delivery_time: row.preferred_delivery_time,
      profile: {
        target_titles: profile.target_titles,
        skills: profile.skills,
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
 * This allows processing candidates incrementally without loading
 * all batch results into memory at once.
 *
 * @param candidates - Full array of active candidates
 * @yields Batches of candidates, each containing up to 50 candidates
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
