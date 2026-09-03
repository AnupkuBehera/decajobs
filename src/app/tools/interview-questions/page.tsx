import type { Metadata } from "next";
import { InterviewQuestionsClient } from "./interview-questions-client";
import { AdSenseUnit } from "@/components/adsense-unit";

export const metadata: Metadata = {
  title: "Free AI Interview Question & Answer Generator | DecaJobs",
  description:
    "Generate role-specific interview questions and answers with expert tips. Master the STAR method for behavioral, technical, and management roles.",
  alternates: {
    canonical: "https://decajob.com/tools/interview-questions",
  },
  openGraph: {
    title: "Free AI Interview Question & Answer Generator | DecaJobs",
    description:
      "Prepare for job interviews with role-tailored questions, expert answering frameworks, and STAR technique tips.",
    url: "https://decajob.com/tools/interview-questions",
    type: "website",
  },
};

export default function InterviewQuestionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI Interview Question Generator",
        "url": "https://decajob.com/tools/interview-questions",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "AI tool that generates role-specific interview questions and recommended answering strategies.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the STAR method for interview questions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "STAR stands for Situation, Task, Action, and Result. It is a structured technique to answer behavioral interview questions with clear examples.",
            },
          },
          {
            "@type": "Question",
            "name": "How do I prepare for role-specific interview questions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Review the core technical and soft skills in the job description, prepare 5-7 STAR stories, and practice answering out loud.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">AI Interview Prep</h1>
          <p className="mt-3 text-neutral-600">Get role-specific interview questions with expert tips. Free, no login.</p>
        </div>

        <InterviewQuestionsClient />

        <AdSenseUnit label="Sponsored Interview Prep Partner" className="my-10" />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Crack Your Next Job Interview</h2>
          <p className="text-neutral-600 leading-relaxed">
            Interviews can be stressful, but preparation is the ultimate antidote to anxiety. By understanding common interview frameworks and practicing your responses, you can demonstrate your fit for the role with clarity and confidence.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Mastering the STAR Method for Behavioral Questions</h3>
          <p className="text-neutral-600 leading-relaxed">
            Behavioral questions (e.g., &quot;Tell me about a time you failed&quot;) are designed to evaluate how you handle real-world challenges. The STAR framework keeps your answers structured and goal-oriented:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Situation:</strong> Describe the context of the story, outlining the project, client, or team setting. Keep it brief.</li>
            <li><strong>Task:</strong> Explain the specific challenge or problem you needed to address. What was your personal responsibility?</li>
            <li><strong>Action:</strong> Detail the actions you took to solve the problem. Use &quot;I&quot; statements rather than &quot;we&quot; to highlight your direct contribution.</li>
            <li><strong>Result:</strong> Share the concrete, measurable outcome. Did you save time, increase sales, or solve a bug? Use numbers wherever possible.</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Steps to Prepare for Any Technical or Management Role</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Research the company &amp; culture</h4>
              <p className="text-sm text-neutral-600 mt-1">Look up the company&apos;s recent news, product offerings, and values. Read their blog or reviews on Glassdoor to understand what they look for in successful candidates.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Prepare 5 core stories</h4>
              <p className="text-sm text-neutral-600 mt-1">Have stories ready covering leadership, conflict resolution, technical problem solving, dealing with tight deadlines, and learning from mistakes.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Practice mock interviews</h4>
              <p className="text-sm text-neutral-600 mt-1">Practice speaking your answers out loud. Recording yourself or practicing with a friend helps eliminate filler words.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
