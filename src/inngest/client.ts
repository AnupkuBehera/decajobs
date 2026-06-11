import { Inngest } from "inngest";

// Define event types for the daily digest cron
type Events = {
  "daily-digest/cron": {
    data: Record<string, never>;
  };
};

// Create and export the Inngest client
export const inngest = new Inngest({ id: "decajobs" });

export type { Events };
