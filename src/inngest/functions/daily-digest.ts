import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { inngest } from "@/inngest/client";
import {
  fetchActiveCandidates,
  batchCandidates,
} from "@/inngest/functions/helpers/fetch-candidates";
import {
  getRecentlySentJobIds,
  recordDigestHistory,
  cleanupOldHistory,
} from "@/inngest/functions/helpers/digest-history";
import {
  selectTopJobs,
  type JobListingWithDate,
} from "@/inngest/functions/helpers/select-top-jobs";
import { sendDigestEmail, type JobDigestItem } from "@/lib/resend/send";
import { fetchAllExternalJobs, type ExternalJob } from "@/lib/external-jobs";
import type { CandidateProfile } from "@/lib/matching/types";

/**
 * Extended job listing type with application_link for email formatting.
 */
interface JobListingFull extends JobListingWithDate {
  application_link: string;
}

/**
 * Creates a Supabase client using the service role key to bypass RLS.
 * Used for all DB operations within the cron function.
 */
function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Fetches active, non-expired job listings from the database.
 * Returns jobs with all fields needed for matching and email formatting.
 *
 * @param supabase - Supabase client (service role) for bypassing RLS
 * @returns Array of eligible job listings ordered by newest first
 */
async function fetchEligibleJobs(
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
    throw new Error(`Failed to fetch eligible jobs: ${error.message}`);
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
 * Daily Digest Cron Function
 *
 * Runs every day at 7:00 AM UTC to generate and send personalized
 * job digest emails to all active candidates with complete profiles.
 *
 * Flow:
 * 1. Fetch active candidates with complete profiles
 * 2. For each candidate batch:
 *    a. Fetch eligible job listings (active, non-expired)
 *    b. Exclude recently sent jobs (last 3 days)
 *    c. Score and rank matches via matching engine
 *    d. Select top 10 (with fallback logic)
 *    e. Record in digest_history
 *    f. Send email via Resend
 * 3. Cleanup old digest_history records (older than 7 days)
 * 4. Log timing for monitoring
 *
 * Inngest's built-in retry (3 retries) handles transient failures.
 */
export const dailyDigestFunction = inngest.createFunction(
  {
    id: "daily-digest-cron",
    name: "Daily Digest Email Cron",
    retries: 3,
    triggers: [{ cron: "0 7 * * *" }],
  },
  async ({ step, logger }) => {
    const startTime = Date.now();
    logger.info("Daily digest cron started", {
      timestamp: new Date().toISOString(),
    });

    try {
      // Step 1: Fetch active candidates with complete profiles
      const candidates = await step.run(
        "fetch-active-candidates",
        async () => {
          return await fetchActiveCandidates();
        }
      );

      if (!candidates || candidates.length === 0) {
        logger.info("No eligible candidates found. Skipping digest generation.");
        return { processed: 0, skipped: 0, durationMs: Date.now() - startTime };
      }

      logger.info(
        `Found ${candidates.length} active candidates with complete profiles. Fanning out...`
      );

      // Step 2: Fan-out - send an individual email event for each candidate
      const events = candidates.map((candidate) => ({
        name: "daily-digest/send-candidate-email" as const,
        data: { candidate },
      }));

      await step.sendEvent("fan-out-candidate-digests", events);

      const durationMs = Date.now() - startTime;
      logger.info("Daily digest cron events fanned out successfully", {
        candidateCount: candidates.length,
        durationMs,
      });

      return {
        processed: candidates.length,
        durationMs,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      logger.error("Daily digest cron failed during fan-out", {
        error: error instanceof Error ? error.message : String(error),
        durationMs,
      });
      throw error;
    }
  }
);

/**
 * Individual candidate digest sender.
 * Triggered in parallel for each candidate to avoid serverless execution timeouts.
 */
export const sendCandidateDigestFunction = inngest.createFunction(
  {
    id: "send-candidate-digest",
    name: "Send Candidate Digest Email",
    retries: 3,
    triggers: [{ event: "daily-digest/send-candidate-email" }],
  },
  async ({ event, step, logger }) => {
    const { candidate } = event.data;
    const supabase = createServiceRoleClient();

    logger.info(`Starting digest generation for candidate ${candidate.id} (${candidate.email})`);

    // 1. Fetch eligible jobs once per runner (active, non-expired)
    const allJobs = await step.run("fetch-eligible-jobs", async () => {
      return await fetchEligibleJobs(supabase);
    });

    // 2. Get recently sent job IDs for deduplication
    const recentlySentIds = await step.run("get-recent-jobs", async () => {
      return await getRecentlySentJobIds(supabase, candidate.id);
    });

    // 3. Build candidate profile for matching engine
    const candidateProfile: CandidateProfile = {
      targetTitles: candidate.profile.target_titles,
      skills: candidate.profile.skills,
      location: candidate.profile.location,
    };

    // 4. Filter out recently sent jobs
    const recentSet = new Set(recentlySentIds);
    const deduplicatedJobs = allJobs.filter(
      (job) => !recentSet.has(job.id)
    );

    // 5. Fetch external jobs from all sources (remotely/parallel)
    let externalJobs: ExternalJob[] = [];
    try {
      externalJobs = await step.run("fetch-external-jobs", async () => {
        return await fetchAllExternalJobs(
          candidate.profile.target_titles,
          candidate.profile.skills,
          candidate.profile.location
        );
      });
    } catch (extErr) {
      logger.warn(`Failed to fetch external jobs for candidate ${candidate.id}`, {
        error: extErr instanceof Error ? extErr.message : String(extErr),
      });
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

    if (!selectedJobIds) {
      logger.info(
        `Skipping candidate ${candidate.id}: insufficient eligible jobs after deduplication`
      );
      return { success: false, reason: "insufficient_eligible_jobs" };
    }

    const orderedJobs = selectedJobIds
      .map((id) => allAvailableJobs.find((j) => j.id === id))
      .filter(
        (j): j is JobListingFull => j !== undefined
      );

    // 9. Record selected jobs in digest_history (only internal DB jobs)
    const internalJobIds = selectedJobIds.filter((id) => !id.startsWith("jsearch_"));
    if (internalJobIds.length > 0) {
      await step.run("record-digest-history", async () => {
        await recordDigestHistory(
          supabase,
          candidate.id,
          internalJobIds
        );
      });
    }

    // 10. Send email via Resend
    const digestItems: JobDigestItem[] = orderedJobs.map((job) => ({
      title: job.title,
      description: job.description,
      location: job.location,
      applicationLink: job.application_link,
    }));

    await step.run("send-email", async () => {
      await sendDigestEmail(candidate.email, digestItems, candidate.id);
    });

    // 11. Cleanup old history (older than 7 days)
    await step.run("cleanup-old-history", async () => {
      await cleanupOldHistory(supabase);
    });

    logger.info(`Digest email sent successfully to candidate ${candidate.id}`);
    return { success: true };
  }
);
