import React from "react";
import { resend, FROM_EMAIL } from "./client";
import { DailyDigestEmail, type DigestJob } from "@/emails/daily-digest";
import { MagicLinkEmail } from "@/emails/magic-link";
import { EmployerVerificationEmail } from "@/emails/employer-verification";
import { buildUnsubscribeUrl } from "@/lib/unsubscribe/token";

/**
 * Represents a job item in the daily digest email.
 */
export interface JobDigestItem {
  title: string;
  description: string;
  location: string;
  applicationLink: string;
}

/**
 * Sends an email using Resend with exponential backoff retry logic.
 * Retries up to 3 times with delays of 1s, 4s, and 16s.
 *
 * @param params - Resend email send parameters
 * @throws Error after all retries are exhausted
 */
async function sendWithRetry(params: Parameters<typeof resend.emails.send>[0]): Promise<void> {
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 1000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { error } = await resend.emails.send(params);

      if (error) {
        throw new Error(`Resend API error: ${error.message}`);
      }

      return;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.error(
          `[Email] Failed to send email after ${MAX_RETRIES + 1} attempts`,
          { to: params.to, error: err instanceof Error ? err.message : String(err) }
        );
        throw err;
      }

      const delay = BASE_DELAY_MS * Math.pow(4, attempt);
      console.warn(
        `[Email] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        { error: err instanceof Error ? err.message : String(err) }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Sends the daily digest email containing 10 job listings to a candidate.
 *
 * @param to - Recipient email address
 * @param jobs - Array of job listings to include in the digest
 * @param candidateId - The candidate's UUID for generating the unsubscribe token
 */
export async function sendDigestEmail(to: string, jobs: JobDigestItem[], candidateId: string): Promise<void> {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const digestJobs: DigestJob[] = jobs.map((job) => ({
    title: job.title,
    description: job.description,
    location: job.location,
    applicationLink: job.applicationLink,
  }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://decajob.com";

  const subject = jobs.length === 10
    ? `Your DecaJobs Daily 10 — ${date}`
    : `Your DecaJobs Daily Digest — ${date}`;

  await sendWithRetry({
    from: FROM_EMAIL,
    to,
    subject,
    react: React.createElement(DailyDigestEmail, {
      jobs: digestJobs,
      date,
      unsubscribeUrl: buildUnsubscribeUrl(candidateId, appUrl),
      preferencesUrl: `${appUrl}/settings`,
    }),
  });
}

/**
 * Sends a magic link login email to a candidate.
 *
 * @param to - Recipient email address
 * @param link - The magic link URL for authentication
 */
export async function sendMagicLink(to: string, link: string): Promise<void> {
  await sendWithRetry({
    from: FROM_EMAIL,
    to,
    subject: "Log in to DecaJobs",
    react: React.createElement(MagicLinkEmail, { loginUrl: link }),
  });
}

/**
 * Sends an employer verification email.
 *
 * @param to - Recipient email address
 * @param link - The verification URL
 * @param companyName - Optional company name for personalization
 */
export async function sendVerification(to: string, link: string, companyName?: string): Promise<void> {
  await sendWithRetry({
    from: FROM_EMAIL,
    to,
    subject: "Verify your employer account — DecaJobs",
    react: React.createElement(EmployerVerificationEmail, {
      verificationUrl: link,
      companyName,
    }),
  });
}
