/**
 * Top-10 Job Selection Helper
 *
 * Selects exactly 10 job listings for a candidate's daily digest.
 *
 * Algorithm:
 * 1. Run the matching engine against eligible jobs (already filtered for
 *    active/non-expired/not-recently-sent).
 * 2. Take the top 10 by Match_Score.
 * 3. If fewer than 10 matches, fill the remainder with newest active jobs
 *    matching the candidate's location OR marked as "Remote", excluding
 *    already-selected jobs.
 * 4. If the total available is still fewer than 10, return null (skip candidate).
 * 5. Return exactly 10 job listing IDs (deduplicated).
 */

import { rankJobs } from "@/lib/matching/engine";
import type { CandidateProfile, JobListing } from "@/lib/matching/types";

/**
 * Extended job listing that includes createdAt for fallback sorting by newest.
 */
export interface JobListingWithDate extends JobListing {
  /** Creation timestamp for sorting fallback jobs by newest first */
  createdAt: string;
}

/**
 * The required count of jobs for a valid digest.
 */
const DIGEST_SIZE = 10;

/**
 * Selects exactly 10 job listings for a candidate's daily digest.
 *
 * @param candidate - The candidate's profile (targetTitles, skills, location)
 * @param eligibleJobs - Jobs already filtered for active/non-expired/not-recently-sent
 * @param allActiveJobs - All active jobs available for fallback (optional, used when
 *                        fewer than 10 matches are found from eligible jobs)
 * @returns Array of exactly 10 job listing IDs, or null if fewer than 10 available
 */
export function selectTopJobs(
  candidate: CandidateProfile,
  eligibleJobs: JobListingWithDate[],
  allActiveJobs?: JobListingWithDate[]
): string[] | null {
  // Step 1: Run matching engine and rank eligible jobs by score
  const rankedResults = rankJobs(candidate, eligibleJobs);

  // Step 2: Select top 10 by score
  const selectedIds: string[] = rankedResults
    .slice(0, DIGEST_SIZE)
    .map((result) => result.jobListingId);

  // If we already have 10, return them
  if (selectedIds.length >= DIGEST_SIZE) {
    return selectedIds;
  }

  // Step 3: Fill remainder with fallback jobs
  const selectedIdSet = new Set(selectedIds);

  // Use allActiveJobs for fallback; if not provided, use eligibleJobs
  const fallbackPool = allActiveJobs ?? eligibleJobs;

  // Filter fallback candidates: match location or remote, exclude already selected
  const fallbackJobs = fallbackPool
    .filter((job) => {
      // Exclude jobs already selected
      if (selectedIdSet.has(job.id)) {
        return false;
      }
      // Include jobs matching candidate's location or marked as "Remote"
      return (
        isLocationMatch(candidate.location, job.location) ||
        isRemote(job.location)
      );
    })
    // Sort by newest first (most recent createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Fill remaining slots from fallback
  for (const job of fallbackJobs) {
    if (selectedIds.length >= DIGEST_SIZE) {
      break;
    }
    // Deduplicate: only add if not already in selectedIds
    if (!selectedIdSet.has(job.id)) {
      selectedIds.push(job.id);
      selectedIdSet.add(job.id);
    }
  }

  // Step 3b: Backup Fallback - If we still have fewer than 10 jobs, fill with ANY remaining active jobs,
  // ranked by their match score first to prioritize relevance.
  if (selectedIds.length < DIGEST_SIZE) {
    const remainingJobs = fallbackPool
      .filter((job) => !selectedIdSet.has(job.id))
      .map((job) => ({
        job,
        score: rankJobs(candidate, [job])[0]?.score ?? 0,
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime();
      });

    for (const item of remainingJobs) {
      if (selectedIds.length >= DIGEST_SIZE) {
        break;
      }
      selectedIds.push(item.job.id);
      selectedIdSet.add(item.job.id);
    }
  }

  // Step 4: If no jobs are available at all, return null (skip candidate).
  // Otherwise, return whatever we have (even if fewer than 10).
  if (selectedIds.length === 0) {
    return null;
  }

  return selectedIds;
}

/**
 * Checks if a job location matches the candidate's location (case-insensitive).
 */
function isLocationMatch(
  candidateLocation: string,
  jobLocation: string
): boolean {
  return (
    candidateLocation.toLowerCase().trim() ===
    jobLocation.toLowerCase().trim()
  );
}

/**
 * Checks if a job location is "Remote" (case-insensitive).
 */
function isRemote(jobLocation: string): boolean {
  return jobLocation.toLowerCase().trim() === "remote";
}
