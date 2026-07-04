import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Checker - Free ATS Resume Scorer | DecaJobs",
  description: "Check your resume score against ATS systems for free. Get detailed analysis and personalized tips to improve your resume instantly.",
  alternates: {
    canonical: "/tools/resume-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
