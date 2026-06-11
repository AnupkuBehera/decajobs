import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Queries digest_history for a candidate's recently sent job listing IDs
 * within the last 3 days. Used to prevent duplicate recommendations.
 *
 * @param supabase - Supabase client (service role) for bypassing RLS
 * @param candidateId - The candidate's UUID
 * @returns Array of job_listing_id strings sent in the last 3 days
 */
export async function getRecentlySentJobIds(
  supabase: SupabaseClient,
  candidateId: string
): Promise<string[]> {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data, error } = await supabase
    .from("digest_history")
    .select("job_listing_id")
    .eq("candidate_id", candidateId)
    .gte("sent_at", threeDaysAgo.toISOString());

  if (error) {
    throw new Error(
      `Failed to fetch digest history for candidate ${candidateId}: ${error.message}`
    );
  }

  return (data ?? []).map((row) => row.job_listing_id);
}

/**
 * Records job listings sent to a candidate in digest_history.
 * Called after successfully generating a digest to track what was sent.
 *
 * @param supabase - Supabase client (service role) for bypassing RLS
 * @param candidateId - The candidate's UUID
 * @param jobListingIds - Array of job listing UUIDs included in the digest
 */
export async function recordDigestHistory(
  supabase: SupabaseClient,
  candidateId: string,
  jobListingIds: string[]
): Promise<void> {
  if (jobListingIds.length === 0) {
    return;
  }

  const records = jobListingIds.map((jobListingId) => ({
    candidate_id: candidateId,
    job_listing_id: jobListingId,
    sent_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("digest_history").insert(records);

  if (error) {
    throw new Error(
      `Failed to record digest history for candidate ${candidateId}: ${error.message}`
    );
  }
}

/**
 * Cleans up old digest_history records that are older than 7 days.
 * Should be called periodically to prevent table bloat.
 *
 * @param supabase - Supabase client (service role) for bypassing RLS
 */
export async function cleanupOldHistory(
  supabase: SupabaseClient
): Promise<void> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { error } = await supabase
    .from("digest_history")
    .delete()
    .lt("sent_at", sevenDaysAgo.toISOString());

  if (error) {
    throw new Error(
      `Failed to cleanup old digest history: ${error.message}`
    );
  }
}
