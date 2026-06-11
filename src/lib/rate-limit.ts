import { SupabaseClient } from "@supabase/supabase-js";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt?: Date;
}

const MAX_POSTS_PER_DAY = 10;

/**
 * Checks whether an employer is allowed to post a new job listing.
 * Employers are limited to 10 job posts within a rolling 24-hour window.
 *
 * @param employerId - The UUID of the employer
 * @param supabase - An authenticated Supabase client
 * @returns RateLimitResult indicating if the post is allowed, remaining quota, and reset time
 */
export async function checkJobPostRateLimit(
  employerId: string,
  supabase: SupabaseClient
): Promise<RateLimitResult> {
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  // Fetch job listings posted by this employer in the last 24 hours
  const { data: recentPosts, error } = await supabase
    .from("job_listings")
    .select("created_at")
    .eq("employer_id", employerId)
    .gte("created_at", twentyFourHoursAgo)
    .order("created_at", { ascending: true });

  if (error) {
    // If we can't verify the rate limit, fail open but log
    console.error("Rate limit check failed:", error.message);
    return { allowed: true, remaining: 0 };
  }

  const count = recentPosts?.length ?? 0;

  if (count >= MAX_POSTS_PER_DAY) {
    // Calculate when the oldest post in the window will expire (24h after it was created)
    const oldestPost = recentPosts![0];
    const oldestPostTime = new Date(oldestPost!.created_at);
    const resetAt = new Date(oldestPostTime.getTime() + 24 * 60 * 60 * 1000);

    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  return {
    allowed: true,
    remaining: MAX_POSTS_PER_DAY - count,
  };
}
