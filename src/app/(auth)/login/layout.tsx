import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Login - DecaJobs",
  description: "Sign in to DecaJobs using Google or a Magic Link to view your daily matched jobs, resume tools, and career settings.",
  alternates: {
    canonical: "/login",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
