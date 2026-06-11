/**
 * Matching Module
 *
 * Public API for the DecaJobs matching engine.
 * Exports types, scoring functions, tokenizer utilities, and the main engine.
 */

// Types
export type {
  CandidateProfile,
  JobListing,
  MatchResult,
  ScoreBreakdown,
} from "./types";

// Engine (primary API)
export { calculateMatchScore, rankJobs } from "./engine";

// Scoring functions (for direct access or testing)
export {
  scoreTitleMatch,
  scoreSkillMatch,
  scoreLocationMatch,
  scoreDescriptionMatch,
} from "./scorer";

// Tokenizer utilities
export { tokenize, normalizeTokens, calculateOverlap } from "./tokenizer";
