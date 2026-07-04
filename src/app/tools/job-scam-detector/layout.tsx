import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Job Scam Detector - Verify Job Postings | DecaJobs",
  description: "Check if a job listing is suspicious or a scam. Paste the job description or email to get a scam risk score and detailed report.",
  alternates: {
    canonical: "/tools/job-scam-detector",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
