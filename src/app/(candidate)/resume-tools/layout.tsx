import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Suite & Builder | DecaJobs",
  description:
    "Build, score, optimize, and generate cover letters for your resume using AI. Everything you need to land interviews.",
  alternates: {
    canonical: "/resume-tools",
  },
};

export default function ResumeToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
