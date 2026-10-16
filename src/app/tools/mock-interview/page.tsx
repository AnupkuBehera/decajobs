import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AIInterviewerStudio } from "@/components/interview/AIInterviewerStudio";
import { AdSenseUnit } from "@/components/adsense-unit";

export const metadata: Metadata = {
  title: "Free AI Voice Mock Interviewer - Practice Tech & Behavioral Interviews | DecaJobs",
  description:
    "Practice realistic voice-enabled technical and behavioral mock interviews with AI interviewer personas. Live speech recognition, audio playback, STAR method scoring, and instant feedback. Try Question 1 free.",
  alternates: {
    canonical: "https://decajob.com/tools/mock-interview",
  },
  openGraph: {
    title: "Free AI Voice Mock Interviewer | DecaJobs",
    description:
      "Simulate high-stakes job interviews with AI Tech Leads, HR Directors, and Product Leaders. Speak your answers, get scored on the STAR method, and identify speech fillers.",
    url: "https://decajob.com/tools/mock-interview",
    type: "website",
  },
};

export default function MockInterviewToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "DecaJobs AI Voice Mock Interviewer",
        "url": "https://decajob.com/tools/mock-interview",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Voice-enabled AI mock interview simulator with real-time speech transcription, adaptive follow-up probing, and STAR method evaluation.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I use voice to answer the mock interview questions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. The AI Mock Interviewer uses your browser's microphone with live speech recognition to transcribe your spoken answers in real-time, or you can switch to typing mode.",
            },
          },
          {
            "@type": "Question",
            "name": "How does the AI evaluate my answers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The AI evaluates your answers using the STAR method (Situation, Task, Action, Result) for behavioral questions, checks technical correctness for coding and systems roles, and counts filler words like 'um' and 'basically'.",
            },
          },
          {
            "@type": "Question",
            "name": "What interviewer personas are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "You can practice with Sarah Mitchell (Senior Tech Lead for algorithms & systems architecture), David Chen (HR Director for behavioral & leadership questions), or Priya Sharma (VP of Product for strategy & metrics).",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "AI Mock Interviewer" },
          ]}
        />

        {/* Studio Room */}
        <div className="mt-6">
          <Suspense
            fallback={<div className="h-96 rounded-3xl bg-neutral-100 animate-pulse" />}
          >
            <AIInterviewerStudio />
          </Suspense>
        </div>

        {/* Ad Placement */}
        <div className="mt-12">
          <AdSenseUnit slot="mock-interview-bottom" format="horizontal" />
        </div>

        {/* Informative Guide / FAQs for SEO */}
        <div className="mt-14 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            How to Ace Interviews with the DecaJobs AI Interviewer
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-2xl" aria-hidden="true">🎙️</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-900">Voice-First Practice</h3>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                Speaking aloud activates the muscle memory required for real high-stakes phone and video screen rounds.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-2xl" aria-hidden="true">🎯</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-900">STAR Method Feedback</h3>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                Assess whether you stated a clear Situation, Task, your specific Action, and quantifiable Result with business impact.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-2xl" aria-hidden="true">💬</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-900">Adaptive Follow-Up Probing</h3>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                If your answer is brief, the AI interviewer asks targeted counter-questions just like a real engineering or hiring manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
