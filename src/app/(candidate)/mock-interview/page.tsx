import { Suspense } from "react";
import type { Metadata } from "next";
import { AIInterviewerStudio } from "@/components/interview/AIInterviewerStudio";

export const metadata: Metadata = {
  title: "AI Mock Interview Studio | DecaJobs",
  description:
    "Practice realistic voice-enabled technical and behavioral mock interviews with AI interviewer personas. Real-time feedback, STAR scoring, and performance coaching.",
};

export default function MockInterviewPage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="h-96 rounded-3xl bg-neutral-100 animate-pulse" />}>
        <AIInterviewerStudio />
      </Suspense>
    </div>
  );
}
