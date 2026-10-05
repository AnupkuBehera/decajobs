import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_for_build");

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "DecaJobs <noreply@decajob.com>";

