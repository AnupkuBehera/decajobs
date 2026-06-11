/**
 * Text Tokenization and Normalization Utilities
 *
 * Provides functions for splitting text into tokens, normalizing them
 * (removing stop words, basic stemming), and calculating overlap between
 * token sets. Used by the scoring module to compare candidate profiles
 * against job listings.
 */

/**
 * Common English stop words to remove during normalization.
 * These are high-frequency words that add little semantic value for matching.
 */
const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "and",
  "or",
  "but",
  "not",
  "for",
  "in",
  "on",
  "to",
  "of",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "about",
  "that",
  "this",
  "it",
  "its",
  "we",
  "you",
  "they",
  "he",
  "she",
  "our",
  "your",
  "their",
  "has",
  "have",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "shall",
]);

/**
 * Tokenize a text string into an array of lowercase words.
 *
 * - Converts text to lowercase
 * - Removes punctuation and special characters
 * - Splits on whitespace
 * - Filters out empty strings
 *
 * @param text - The input text to tokenize
 * @returns Array of lowercase word tokens
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

/**
 * Normalize an array of tokens by removing stop words and applying basic stemming.
 *
 * Stemming rules (applied in order, first match wins):
 * - Words ending in "-tion" → remove "-tion" (if remaining length >= 3)
 * - Words ending in "-ing" → remove "-ing" (if remaining length >= 3)
 * - Words ending in "-ed" → remove "-ed" (if remaining length >= 3)
 * - Words ending in "-ly" → remove "-ly" (if remaining length >= 3)
 * - Words ending in "-ment" → remove "-ment" (if remaining length >= 3)
 * - Words ending in "-ness" → remove "-ness" (if remaining length >= 3)
 *
 * @param tokens - Array of tokens to normalize
 * @returns Array of normalized tokens with stop words removed and basic stemming applied
 */
export function normalizeTokens(tokens: string[]): string[] {
  return tokens
    .filter((token) => !STOP_WORDS.has(token))
    .map((token) => stem(token));
}

/**
 * Apply basic suffix-based stemming to a single word.
 * Returns the stemmed form if the remaining root is at least 3 characters long.
 */
function stem(word: string): string {
  const suffixes = ["tion", "ing", "ed", "ly", "ment", "ness"];

  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      return word.slice(0, -suffix.length);
    }
  }

  return word;
}

/**
 * Calculate the overlap ratio between two arrays of tokens.
 *
 * Returns the proportion of tokens in `tokensA` that also appear in `tokensB`.
 * Formula: intersection size / tokensA length
 *
 * Handles edge cases:
 * - If `tokensA` is empty, returns 0 (no tokens to match)
 * - If `tokensB` is empty, returns 0 (no possible matches)
 *
 * @param tokensA - The reference token set (denominator)
 * @param tokensB - The comparison token set
 * @returns A number between 0 and 1 representing the overlap ratio
 */
export function calculateOverlap(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0;
  }

  const setB = new Set(tokensB);
  const matchCount = tokensA.filter((token) => setB.has(token)).length;

  return matchCount / tokensA.length;
}
