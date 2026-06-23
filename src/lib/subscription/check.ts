import { SupabaseClient } from "@supabase/supabase-js";

export interface SubscriptionStatus {
  hasAccess: boolean;
  status: "trial" | "active" | "expired" | "cancelled";
  trialDaysLeft: number;
  message?: string;
}

/**
 * Check if a user has access to premium features.
 * Returns true if: trial is active OR subscription is active.
 */
export async function checkSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionStatus> {
  const { data: candidate } = await supabase
    .from("candidates")
    .select("subscription_status, trial_ends_at, subscription_ends_at, referral_bonus_days")
    .eq("id", userId)
    .maybeSingle();

  if (!candidate) {
    // No candidate record — treat as new trial user (7 days from now)
    return { hasAccess: true, status: "trial", trialDaysLeft: 7 };
  }

  const now = new Date();
  const trialEnd = candidate.trial_ends_at ? new Date(candidate.trial_ends_at) : null;
  const subEnd = candidate.subscription_ends_at ? new Date(candidate.subscription_ends_at) : null;
  const bonusDays = candidate.referral_bonus_days || 0;

  // Active subscription
  if (candidate.subscription_status === "active" && subEnd && subEnd > now) {
    return { hasAccess: true, status: "active", trialDaysLeft: 0 };
  }

  // Trial period (including referral bonus days)
  if (trialEnd) {
    const effectiveTrialEnd = new Date(trialEnd.getTime() + bonusDays * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((effectiveTrialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft > 0) {
      return { hasAccess: true, status: "trial", trialDaysLeft: daysLeft };
    }
  }

  // Trial expired, no active subscription
  return {
    hasAccess: false,
    status: "expired",
    trialDaysLeft: 0,
    message: "Your 7-day free trial has ended. Subscribe to DecaJobs Pro (₹299/month) to continue using AI tools and daily job alerts.",
  };
}
