import { Inngest } from "inngest";

// Define event types for the daily digest cron
type Events = {
  "daily-digest/cron": {
    data: Record<string, never>;
  };
  "daily-digest/send-candidate-email": {
    data: {
      candidate: {
        id: string;
        email: string;
        preferred_delivery_time: string;
        profile: {
          target_titles: string[];
          skills: string[];
          location: string;
        };
      };
    };
  };
};

// Create and export the Inngest client
export const inngest = new Inngest({ id: "decajobs" });

export type { Events };
