export const GA_TRACKING_ID = "G-QM60V43CBZ";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Log pageviews in Next.js SPA route changes
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific conversion events in GA4
export const event = (
  action: string,
  {
    category,
    label,
    value,
    ...rest
  }: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  } = {}
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
};

/**
 * Standardized Growth & Activation Funnel Event Tracker
 *
 * Tracks candidate progression across the 8 core growth phases:
 * 1. visit -> 2. signup_start -> 3. signup_complete -> 4. profile_complete ->
 * 5. instant_matches_viewed -> 6. digest_opened -> 7. job_clicked ->
 * 8. trial_started -> 9. paid_active
 */
export type FunnelStage =
  | "funnel_visit"
  | "funnel_signup_start"
  | "funnel_signup_complete"
  | "funnel_profile_complete"
  | "funnel_instant_matches_viewed"
  | "funnel_digest_opened"
  | "funnel_job_clicked"
  | "funnel_trial_started"
  | "funnel_paid_active";

export function trackFunnelEvent(
  stage: FunnelStage,
  params: {
    country?: string;
    channel?: string;
    jobId?: string;
    role?: string;
    location?: string;
    value?: number;
    [key: string]: any;
  } = {}
) {
  event(stage, {
    category: "growth_funnel",
    label: stage,
    ...params,
  });
}
