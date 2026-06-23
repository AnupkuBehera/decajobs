import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | DecaJobs Free Tools",
    default: "Free Career Tools | DecaJobs",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
