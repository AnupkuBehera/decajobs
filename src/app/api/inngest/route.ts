import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { dailyDigestFunction } from "@/inngest/functions/daily-digest";

// Serve the Inngest API route with GET and POST handlers.
// Functions will be registered here as they are created.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [dailyDigestFunction],
});
