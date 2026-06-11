/**
 * Main Matching Engine
 *
 * Orchestrates the scoring functions to produce a final match score
 * for a candidate-job pair and ranks multiple jobs for a candidate.
 *
 * The engine:
 * 1. Calls each scoring function (title, skill, location, description)
 * 2. Sums all component scores
 * 3. Caps the total at 100
 * 4. Returns a MatchResult with jobListingId, score, and breakdown
 */

import {
  scoreTitleMatch,
  scoreSkillMatch,
  scoreLocationMatch,
  scoreDescriptionMatch,
} from "./scorer";
import type { CandidateProfile, JobListing, MatchResult } from "./types";

/**
 * Calculate the match score between a candidate profile and a job listing.
 *
 * Scoring components:
 * - Title match (0-40): candidate target titles vs job title
 * - Skill match (0-35): candidate skills vs job title + description
 * - Location match (0-15): exact location or remote match
 * - Description match (0-10): candidate keywords in job description
 *
 * The final score is the sum of all components, capped at 100.
 *
 * @param candidate - The candidate's profile with preferences
 * @param job - The job listing to score against
 * @returns MatchResult with score (0-100) and detailed breakdown
 */
export function calculateMatchScore(
  candidate: CandidateProfile,
  job: JobListing
): MatchResult {
  const titleScore = scoreTitleMatch(candidate.targetTitles, job.title);
  const skillScore = scoreSkillMatch(
    candidate.skills,
    job.title,
    job.description
  );
  const locationScore = scoreLocationMatch(candidate.location, job.location);

  // Description match uses combined candidate keywords (titles + skills)
  const candidateKeywords = [...candidate.targetTitles, ...candidate.skills];
  const descriptionScore = scoreDescriptionMatch(
    candidateKeywords,
    job.description
  );

  const rawScore = titleScore + skillScore + locationScore + descriptionScore;
  const score = Math.min(rawScore, 100);

  return {
    jobListingId: job.id,
    score,
    breakdown: {
      titleScore,
      skillScore,
      locationScore,
      descriptionScore,
    },
  };
}

/**
 * Rank multiple job listings for a candidate by match score.
 *
 * Maps over all jobs, calculates the match score for each,
 * and returns the results sorted by score in descending order.
 *
 * @param candidate - The candidate's profile with preferences
 * @param jobs - Array of job listings to rank
 * @returns Array of MatchResults sorted by score descending
 */
export function rankJobs(
  candidate: CandidateProfile,
  jobs: JobListing[]
): MatchResult[] {
  const results = jobs.map((job) => calculateMatchScore(candidate, job));
  results.sort((a, b) => b.score - a.score);
  return results;
}
