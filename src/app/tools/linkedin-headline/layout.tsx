import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI LinkedIn Headline Generator - Free Profile Optimizer | DecaJobs",
  description: "Generate professional, keyword-optimized LinkedIn headlines using AI to stand out to recruiters and increase profile visibility.",
  alternates: {
    canonical: "/tools/linkedin-headline",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
