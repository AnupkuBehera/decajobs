import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Job Matcher - Match Resume Against Job Descriptions | DecaJobs",
  description:
    "Compare your resume against any job description. Get instant ATS keyword match scores, skill gap breakdown, and AI bullet point recommendations.",
  alternates: {
    canonical: "/tools/resume-matcher",
  },
};

export default function ResumeMatcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
