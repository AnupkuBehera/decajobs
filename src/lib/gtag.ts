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

/**
 * Standard GA4 Recommended Key Events (Conversions)
 * Automatically populates GA4 standard acquisition, e-commerce, and conversion reports.
 */

// 1. Lead Generation (Newsletter alert, WhatsApp alert, Employer signup lead)
export function trackLead(channel: "email" | "whatsapp" | "employer", source: string, meta: Record<string, any> = {}) {
  event("generate_lead", {
    category: "leads",
    label: `${channel}_from_${source}`,
    value: 1,
    currency: "USD",
    channel,
    source,
    ...meta,
  });
}

// 2. User Sign Up (Candidate or Employer)
export function trackSignUp(method: string, userType: "candidate" | "employer" = "candidate") {
  event("sign_up", {
    category: "auth",
    label: `${userType}_${method}`,
    method,
    user_type: userType,
  });
  trackFunnelEvent("funnel_signup_complete", { channel: method });
}

// 3. User Login
export function trackLogin(method: string) {
  event("login", {
    category: "auth",
    label: method,
    method,
  });
}

// 4. Job Search
export function trackJobSearch(query: string, location?: string) {
  event("search", {
    category: "job_search",
    search_term: query,
    job_location: location || "any",
  });
}

// 5. Job Item Selected / Clicked
export function trackSelectJob(jobSlug: string, title: string, company: string) {
  event("select_item", {
    category: "job_interaction",
    label: title,
    item_list_name: "job_board",
    items: [
      {
        item_id: jobSlug,
        item_name: title,
        item_brand: company,
        item_category: "job_listing",
      },
    ],
  });
  trackFunnelEvent("funnel_job_clicked", { jobId: jobSlug, role: title });
}

// 6. Job Item Viewed (Job Detail Page)
export function trackViewJob(jobSlug: string, title: string, company: string) {
  event("view_item", {
    category: "job_interaction",
    label: title,
    items: [
      {
        item_id: jobSlug,
        item_name: title,
        item_brand: company,
        item_category: "job_listing",
      },
    ],
  });
}

// 7. Begin Checkout / Start Trial
export function trackBeginCheckout(
  planName: string,
  value: number = 299,
  currency: string = "INR"
) {
  event("begin_checkout", {
    category: "ecommerce",
    label: planName,
    value,
    currency,
    items: [
      {
        item_name: planName,
        price: value,
        quantity: 1,
      },
    ],
  });
  trackFunnelEvent("funnel_trial_started", { value });
}

// 8. Tool Engagement
export function trackToolUse(toolName: string, meta: Record<string, any> = {}) {
  event("tool_engagement", {
    category: "tools",
    label: toolName,
    tool_name: toolName,
    ...meta,
  });
}

