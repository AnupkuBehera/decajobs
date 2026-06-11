/**
 * Unsubscribe token utilities.
 *
 * Tokens are base64url-encoded candidate UUIDs. This provides a simple,
 * URL-safe mechanism for one-click unsubscribe from email digests.
 */

/**
 * Generates an unsubscribe token from a candidate ID.
 * Uses base64url encoding (URL-safe, no padding).
 *
 * @param candidateId - The candidate's UUID
 * @returns A base64url-encoded token
 */
export function generateUnsubscribeToken(candidateId: string): string {
  return Buffer.from(candidateId, "utf-8").toString("base64url");
}

/**
 * Decodes an unsubscribe token back to a candidate ID.
 * Returns null if the token is invalid or cannot be decoded.
 *
 * @param token - The base64url-encoded token
 * @returns The candidate UUID, or null if invalid
 */
export function decodeUnsubscribeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");

    // Basic UUID format validation (8-4-4-4-12 hex characters)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(decoded)) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Builds the full unsubscribe URL for a candidate.
 *
 * @param candidateId - The candidate's UUID
 * @param baseUrl - The application base URL (defaults to NEXT_PUBLIC_APP_URL env var)
 * @returns The full unsubscribe URL
 */
export function buildUnsubscribeUrl(
  candidateId: string,
  baseUrl?: string
): string {
  const appUrl =
    baseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://decajobs.com";
  const token = generateUnsubscribeToken(candidateId);
  return `${appUrl}/api/unsubscribe/${token}`;
}
