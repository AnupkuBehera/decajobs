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
        `Found ${candidates.length} active candidates with complete profiles`
      );

      // Step 2: Process candidates in batches of 50
      let totalProcessed = 0;
      let totalSkipped = 0;
      let totalEmails = 0;
      let batchNumber = 0;

      for (const batch of batchCandidates(candidates)) {
        batchNumber++;

        const batchResult = await step.run(
          `process-batch-${batchNumber}`,
          async () => {
            const supabase = createServiceRoleClient();

            // Fetch eligible jobs once per batch (active, non-expired)
            const allJobs = await fetchEligibleJobs(supabase);

            logger.info(
              `Batch ${batchNumber}: ${batch.length} candidates, ${allJobs.length} eligible jobs`
            );

            let processed = 0;
            let skipped = 0;
            let emailsSent = 0;

            for (const candidate of batch) {
              try {
                // 2a. Get recently sent job IDs for deduplication
                const recentlySentIds = await getRecentlySentJobIds(
                  supabase,
                  candidate.id
                );

                // 2b. Build candidate profile for matching engine
                const candidateProfile: CandidateProfile = {
                  targetTitles: candidate.profile.target_titles,
                  skills: candidate.profile.skills,
                  location: candidate.profile.location,
                };

                // 2c. Filter out recently sent jobs
                const recentSet = new Set(recentlySentIds);
                const deduplicatedJobs = allJobs.filter(
                  (job) => !recentSet.has(job.id)
                );

                // 2c-ext. Fetch external jobs from all sources
                let externalJobs: ExternalJob[] = [];
                try {
                  externalJobs = await fetchAllExternalJobs(
                    candidate.profile.target_titles,
                    candidate.profile.skills,
                    candidate.profile.location
                  );
                } catch (extErr) {
                  logger.warn(`Failed to fetch external jobs for ${candidate.id}`, {
                    error: extErr instanceof Error ? extErr.message : String(extErr),
                  });
                }

                // 2c-ext. Convert external jobs to internal format for matching
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

                // 2c-ext. Merge internal + external jobs
                const allAvailableJobs = [...deduplicatedJobs, ...externalAsInternal];

                // 2d. Select top 10 jobs (with fallback)
                const selectedJobIds = selectTopJobs(
                  candidateProfile,
                  allAvailableJobs,
                  allAvailableJobs
                );

                // 2e. If null (fewer than 10 available), skip candidate
                if (!selectedJobIds) {
                  logger.info(
                    `Skipping candidate ${candidate.id}: insufficient eligible jobs after deduplication`
                  );
                  skipped++;
                  continue;
                }

                // 2f. Get full job data for the selected IDs, preserving order
                const orderedJobs = selectedJobIds
                  .map((id) => allAvailableJobs.find((j) => j.id === id))
                  .filter(
                    (j): j is JobListingFull => j !== undefined
                  );

                // 2g. Record the selected jobs in digest_history (only internal DB jobs)
                const internalJobIds = selectedJobIds.filter((id) => !id.startsWith("jsearch_"));
                if (internalJobIds.length > 0) {
                  await recordDigestHistory(
                    supabase,
                    candidate.id,
                    internalJobIds
                  );
                }

                // 2g. Send email via Resend with retry logic
                const digestItems: JobDigestItem[] = orderedJobs.map((job) => ({
                  title: job.title,
                  description: job.description,
                  location: job.location,
                  applicationLink: job.application_link,
                }));

                await sendDigestEmail(candidate.email, digestItems, candidate.id);

                emailsSent++;
                processed++;

                logger.info(`Digest sent to candidate ${candidate.id}`, {
                  candidateId: candidate.id,
                  jobCount: orderedJobs.length,
                });
              } catch (error) {
                logger.error(
                  `Failed to process candidate ${candidate.id}`,
                  {
                    error:
                      error instanceof Error ? error.message : String(error),
                  }
                );
                skipped++;
              }
            }

            return { processed, skipped, emailsSent };
          }
        );

        totalProcessed += batchResult.processed;
        totalSkipped += batchResult.skipped;
        totalEmails += batchResult.emailsSent;
      }

      // Step 3: Cleanup old digest_history records (older than 7 days)
      await step.run("cleanup-old-history", async () => {
        const supabase = createServiceRoleClient();
        await cleanupOldHistory(supabase);
        logger.info("Old digest history records cleaned up");
      });

      // Step 4: Track completion time
      const durationMs = Date.now() - startTime;

      logger.info("Daily digest cron completed", {
        totalProcessed,
        totalSkipped,
        totalEmails,
        durationMs,
        timestamp: new Date().toISOString(),
      });

      return {
        processed: totalProcessed,
        skipped: totalSkipped,
        emailsSent: totalEmails,
        durationMs,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      logger.error("Daily digest cron failed", {
        error: error instanceof Error ? error.message : String(error),
        durationMs,
        timestamp: new Date().toISOString(),
      });
      throw error; // Re-throw to trigger Inngest retry
    }
  }
);
