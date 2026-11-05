import { Resend } from "resend";

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  return new Resend(apiKey || "re_dummy_for_build");
}

/**
 * Dynamic proxy that retrieves the Resend client at invocation time.
 * Prevents build-time evaluation from locking in placeholder API keys.
 */
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "DecaJobs <noreply@decajob.com>";
