import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator - Free Tailored Cover Letters | DecaJobs",
  description: "Generate professional, tailored cover letters in seconds using AI. Customize by job title, description, and your skills.",
  alternates: {
    canonical: "/tools/cover-letter-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
