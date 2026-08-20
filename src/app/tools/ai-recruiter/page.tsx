import type { Metadata } from "next";
import { AIRecruiterClient } from "./ai-recruiter-client";

export const metadata: Metadata = {
  title: "Free AI Recruiter Mode & Job Match Scanner | DecaJobs",
  description:
    "Analyze live job postings from LinkedIn & Indeed against your resume using Google Gemini AI. Get brutally honest match scores, skill gap analysis, and visa flags.",
  alternates: {
    canonical: "/tools/ai-recruiter",
  },
  openGraph: {
    title: "Free AI Recruiter Mode & Job Match Scanner | DecaJobs",
    description:
      "Scan live jobs against your resume with AI. Get honest match scores, missing skill alerts, and tailored resume bullet points.",
    url: "https://decajob.com/tools/ai-recruiter",
    type: "website",
  },
};

export default function AIRecruiterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI Recruiter Mode & Job Match Scanner",
        "url": "https://decajob.com/tools/ai-recruiter",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "AI tool that fetches live job postings and evaluates candidate resume suitability, producing match scores, skill gap analysis, and ATS bullet points.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What makes AI Recruiter Mode different from a normal search?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Instead of simple keyword matching, AI Recruiter Mode analyzes full job descriptions against your resume context, highlighting skill gaps, visa flags, and recommendation scores.",
            },
          },
          {
            "@type": "Question",
            "name": "How is the match score calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The score is calculated using Google Gemini AI evaluating key skills, years of experience, domain knowledge, and job responsibilities.",
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
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 border border-primary-100 mb-3">
            <span className="h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
            AI Recruiter Mode — Live Job Matcher
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            See how recruiters evaluate your resume for live jobs
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            Paste your target title &amp; resume. Our AI fetches live job openings from top boards and scores your fit with zero bias.
          </p>
        </div>

        <AIRecruiterClient />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            How AI Recruiter Mode Works
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Unlike static job boards, AI Recruiter Mode pulls <strong>live job listings</strong> from
            LinkedIn, Indeed, Glassdoor, and other boards in real time, then uses Google Gemini
            AI to score every single posting against your actual resume — not just keywords.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
            What makes this different from a normal job search?
          </h3>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li>
              <strong>Brutally honest scores:</strong> The AI deliberately avoids inflating match
              percentages. A 70+ score means you are genuinely competitive for that role.
            </li>
            <li>
              <strong>Skill gap analysis:</strong> For every job, you see the exact 3 requirements
              you meet and the 3 most important gaps — so you know exactly what to address.
            </li>
            <li>
              <strong>Visa flag detection:</strong> Sponsorship restrictions and work authorization
              requirements are automatically flagged so you don&apos;t waste time on roles you can&apos;t pursue.
            </li>
            <li>
              <strong>ATS-ready resume bullets:</strong> Your top 3 matches include AI-generated
              bullet points using exact keywords from each job description.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
