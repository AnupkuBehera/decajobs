import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculator - Industry Salary Comparison | DecaJobs",
  description: "Calculate and compare industry salaries across different locations and roles. Get insights into average salaries for software developer, product manager, UI/UX, and data analyst roles.",
  alternates: {
    canonical: "/tools/salary-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
