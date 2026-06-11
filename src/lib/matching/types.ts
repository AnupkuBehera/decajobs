/**
 * Matching Engine Types
 *
 * Core interfaces for the DecaJobs matching engine.
 * The engine scores job listings against candidate profiles
 * to produce a ranked list of relevant opportunities.
 */

/**
 * Candidate profile data used for matching.
 * Represents the candidate's job preferences extracted from their profile.
 */
export interface CandidateProfile {
  /** Target job titles the candidate is looking for */
  targetTitles: string[];
  /** Skills the candidate possesses */
  skills: string[];
  /** Preferred work location (city/state, country, or "Remote") */
  location: string;
}

/**
 * Job listing data used for matching.
 * Represents the essential fields of a job posting needed by the scoring engine.
 */
export interface JobListing {
  /** Unique identifier for the job listing */
  id: string;
  /** Job title (5-100 characters) */
  title: string;
  /** Full job description (50-5000 characters) */
  description: string;
  /** Job location (city/state, country, or "Remote") */
  location: string;
}

/**
 * Breakdown of individual score components.
 *
 * Scoring weights:
 * - titleScore: 0-40 (highest weight — title match is most important)
 * - skillScore: 0-35 (skill keyword matches in title + description)
 * - locationScore: 0-15 (exact location or remote match)
 * - descriptionScore: 0-10 (general keyword overlap in description)
 */
export interface ScoreBreakdown {
  /** Title match score (0-40). Candidate target titles vs job title. */
  titleScore: number;
  /** Skill match score (0-35). Candidate skills vs job title + description. */
  skillScore: number;
  /** Location match score (0-15). Exact match or remote = full points. */
  locationScore: number;
  /** Description keyword score (0-10). Candidate keywords found in description. */
  descriptionScore: number;
}

/**
 * Result of matching a single job listing against a candidate profile.
 * Contains the overall score (0-100) and a detailed breakdown by component.
 */
export interface MatchResult {
  /** The ID of the matched job listing */
  jobListingId: string;
  /** Overall match score, normalized to 0-100 */
  score: number;
  /** Detailed breakdown of how the score was calculated */
  breakdown: ScoreBreakdown;
}
