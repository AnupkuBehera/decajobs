import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Recruiter Mode - Free Job Match & Resume Analysis | DecaJobs",
  description:
    "Analyze live job listings with AI. Get match scores, missing skill gap analysis, visa flag checks, and tailored resume bullet points.",
  alternates: {
    canonical: "/tools/ai-recruiter",
  },
};

export default function AIRecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
