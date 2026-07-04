import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Registration - Post Jobs Free | DecaJobs",
  description: "Register your company on DecaJobs. Post jobs for free and match with top candidate profiles using our AI matching algorithm.",
  alternates: {
    canonical: "/employer/register",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
