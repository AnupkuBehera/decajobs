import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getRecentlySentJobIds,
  recordDigestHistory,
  cleanupOldHistory,
} from "./digest-history";
import {
  selectTopJobs,
  type JobListingWithDate,
} from "./select-top-jobs";
import { sendDigestEmail, type JobDigestItem } from "@/lib/resend/send";
import { fetchAllExternalJobs } from "@/lib/external-jobs";
import type { CandidateProfile } from "@/lib/matching/types";
import type { ActiveCandidateWithProfile } from "./fetch-candidates";

export interface JobListingFull extends JobListingWithDate {
  application_link: string;
}

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

export async function fetchEligibleJobs(
  supabase: SupabaseClient
): Promise<JobListingFull[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("job_listings")
    .select("id, title, description, location, application_link, created_at")
    .eq("is_active", true)
    .gt("expires_at", now)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn(`[send-candidate-digest] DB job fetch notice: ${error.message}`);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    location: row.location as string,
    application_link: row.application_link as string,
    createdAt: row.created_at as string,
  }));
}

/**
 * Core business logic to match and send the daily 10 digest to a single candidate.
 * Can be called directly in-process or via API routes without HTTP subrequest loopbacks.
 */
export async function sendDigestForCandidate(
  candidate: ActiveCandidateWithProfile,
  preloadedDbJobs?: JobListingFull[]
): Promise<{ success: boolean; reason?: string; jobsSent?: number }> {
  const supabase = createServiceRoleClient();

  // 1. Use preloaded DB jobs if provided, or fetch once
  const allJobs = preloadedDbJobs ?? (await fetchEligibleJobs(supabase));

  // 2. Get recently sent job IDs for deduplication
  const recentlySentIds = await getRecentlySentJobIds(supabase, candidate.id);

  // 3. Build candidate profile for matching engine
  const candidateProfile: CandidateProfile = {
    targetTitles: candidate.profile.target_titles,
    skills: candidate.profile.skills,
    location: candidate.profile.location,
  };

  // 4. Filter out recently sent jobs
  const recentSet = new Set(recentlySentIds);
  const deduplicatedJobs = allJobs.filter((job) => !recentSet.has(job.id));

  // 5. Fetch external jobs from all sources (Greenhouse/Lever ATS, Remotive, etc.)
  let externalJobs: any[] = [];
  try {
    externalJobs = await fetchAllExternalJobs(
      candidate.profile.target_titles,
      candidate.profile.skills,
      candidate.profile.location
    );
  } catch (extErr: any) {
    console.warn(
      `[send-candidate-digest] External jobs fetch warning for ${candidate.id}:`,
      extErr.message || extErr
    );
  }

  // 6. Convert external jobs to internal format
  const externalAsInternal: JobListingFull[] = externalJobs
    .filter((ej) => !recentSet.has(ej.id))
    .map((ej) => ({
      id: ej.id,
      title: ej.title,
      description: ej.description,
      location: ej.location,
      application_link: ej.applicationLink,
      createdAt: ej.postedAt || new Date().toISOString(),
    }));

  // 7. Merge internal + external jobs
  const allAvailableJobs = [...deduplicatedJobs, ...externalAsInternal];

  // 8. Select top 10 jobs (with fallback)
  const selectedJobIds = selectTopJobs(
    candidateProfile,
    allAvailableJobs,
    allAvailableJobs
  );

  if (!selectedJobIds || selectedJobIds.length === 0) {
    console.log(
      `[send-candidate-digest] Skipping ${candidate.email}: insufficient eligible jobs`
    );
    return {
      success: false,
      reason: "insufficient_eligible_jobs",
    };
  }

  const orderedJobs = selectedJobIds
    .map((id) => allAvailableJobs.find((j) => j.id === id))
    .filter((j): j is JobListingFull => j !== undefined);

  // 9. Record selected jobs in digest_history (only internal DB jobs)
  const internalJobIds = selectedJobIds.filter(
    (id) => !id.startsWith("jsearch_") && !id.startsWith("gh_") && !id.startsWith("lever_")
  );
  if (internalJobIds.length > 0) {
    try {
      await recordDigestHistory(supabase, candidate.id, internalJobIds);
    } catch (recErr: any) {
      console.warn("[send-candidate-digest] History record warning:", recErr.message);
    }
  }

  // 10. Send email via Resend
  const digestItems: JobDigestItem[] = orderedJobs.map((job) => ({
    title: job.title,
    description: job.description,
    location: job.location,
    applicationLink: job.application_link,
  }));

  await sendDigestEmail(candidate.email, digestItems, candidate.id);

  // 11. Cleanup old history (older than 7 days) asynchronously
  cleanupOldHistory(supabase).catch(() => {});

  return { success: true, jobsSent: digestItems.length };
}

