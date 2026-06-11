/**
 * Core Scoring Functions
 *
 * Individual scoring components for the matching engine.
 * Each function scores one aspect of the candidate-job match
 * and returns a value within its defined range.
 *
 * Scoring weights:
 * - Title match: 0-40 points
 * - Skill match: 0-35 points
 * - Location match: 0-15 points
 * - Description match: 0-10 points
 */

import { tokenize, normalizeTokens, calculateOverlap } from "./tokenizer";

/**
 * Score how well a job title matches the candidate's target titles.
 *
 * Uses token-based matching: tokenizes and normalizes both the candidate's
 * target titles and the job title, then calculates the best overlap ratio.
 * The best match among all candidate target titles is used.
 *
 * @param candidateTitles - Array of target job titles the candidate wants
 * @param jobTitle - The job listing's title
 * @returns Score from 0 to 40
 */
export function scoreTitleMatch(
  candidateTitles: string[],
  jobTitle: string
): number {
  if (candidateTitles.length === 0 || !jobTitle.trim()) {
    return 0;
  }

  const jobTokens = normalizeTokens(tokenize(jobTitle));

  if (jobTokens.length === 0) {
    return 0;
  }

  let bestOverlap = 0;

  for (const title of candidateTitles) {
    const titleTokens = normalizeTokens(tokenize(title));
    if (titleTokens.length === 0) continue;

    // Calculate overlap: proportion of candidate title tokens found in job title
    const overlap = calculateOverlap(titleTokens, jobTokens);

    if (overlap > bestOverlap) {
      bestOverlap = overlap;
    }
  }

  return bestOverlap * 40;
}

/**
 * Score how well a candidate's skills match the job listing.
 *
 * Compares candidate skills against tokens found in both the job title
 * and job description. Formula: matched skills / total candidate skills × 35.
 *
 * @param candidateSkills - Array of skills the candidate has
 * @param jobTitle - The job listing's title
 * @param jobDescription - The job listing's full description
 * @returns Score from 0 to 35
 */
export function scoreSkillMatch(
  candidateSkills: string[],
  jobTitle: string,
  jobDescription: string
): number {
  if (candidateSkills.length === 0) {
    return 0;
  }

  const jobText = `${jobTitle} ${jobDescription}`;
  const jobTokens = normalizeTokens(tokenize(jobText));

  if (jobTokens.length === 0) {
    return 0;
  }

  const jobTokenSet = new Set(jobTokens);
  let matchedSkills = 0;

  for (const skill of candidateSkills) {
    const skillTokens = normalizeTokens(tokenize(skill));
    // A skill matches if any of its tokens appear in the job text
    const hasMatch = skillTokens.some((token) => jobTokenSet.has(token));
    if (hasMatch) {
      matchedSkills++;
    }
  }

  const ratio = matchedSkills / candidateSkills.length;
  return ratio * 35;
}

/**
 * Score how well the job location matches the candidate's preference.
 *
 * Scoring:
 * - Exact location match (case-insensitive): 15 points
 * - Job is "Remote": 15 points (matches all candidates)
 * - No match: 0 points
 *
 * @param candidateLocation - The candidate's preferred location
 * @param jobLocation - The job listing's location
 * @returns Score: 0 or 15
 */
export function scoreLocationMatch(
  candidateLocation: string,
  jobLocation: string
): number {
  if (!candidateLocation.trim() || !jobLocation.trim()) {
    return 0;
  }

  const normalizedCandidate = candidateLocation.trim().toLowerCase();
  const normalizedJob = jobLocation.trim().toLowerCase();

  // Remote jobs match all candidates
  if (normalizedJob === "remote") {
    return 15;
  }

  // Exact location match
  if (normalizedCandidate === normalizedJob) {
    return 15;
  }

  return 0;
}

/**
 * Score keyword overlap between candidate keywords and job description.
 *
 * Combines candidate target titles and skills into a keyword set,
 * then measures how many unique keywords appear in the job description.
 * Formula: unique matches / total keywords × 10.
 *
 * @param candidateKeywords - Combined array of candidate's title and skill keywords
 * @param jobDescription - The job listing's full description
 * @returns Score from 0 to 10
 */
export function scoreDescriptionMatch(
  candidateKeywords: string[],
  jobDescription: string
): number {
  if (candidateKeywords.length === 0 || !jobDescription.trim()) {
    return 0;
  }

  const keywordTokens = new Set(
    candidateKeywords.flatMap((kw) => normalizeTokens(tokenize(kw)))
  );

  if (keywordTokens.size === 0) {
    return 0;
  }

  const descriptionTokens = new Set(normalizeTokens(tokenize(jobDescription)));
  let matchCount = 0;

  for (const token of keywordTokens) {
    if (descriptionTokens.has(token)) {
      matchCount++;
    }
  }

  const ratio = matchCount / keywordTokens.size;
  return ratio * 10;
}
