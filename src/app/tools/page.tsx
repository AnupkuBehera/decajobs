import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSenseUnit } from "@/components/adsense-unit";

export const metadata: Metadata = {
  title: "Free AI Career Tools - Resume Checker, Salary Calculator & Interview Prep | DecaJobs",
  description:
    "Free AI-powered career tools: check your ATS resume score, calculate salary benchmarks by title and location, prepare behavioral interview questions with STAR tips, and generate cover letters. 100% free, no login required.",
  alternates: {
    canonical: "https://decajob.com/tools",
  },
};

const tools = [
  {
    href: "/tools/ai-recruiter",
    title: "AI Recruiter Mode",
    description:
      "Search live job listings, get brutally-honest AI match scores, skill gap analysis, visa flags, and tailored resume bullets for your top matches.",
    emoji: "🤖",
    badge: "New",
  },
  {
    href: "/tools/resume-matcher",
    title: "AI Resume-to-Job Matcher",
    description: "Compare your resume against any job description. Get your match score, missing ATS keywords, and AI bullet suggestions.",
    emoji: "🎯",
    badge: "Hot Feature",
  },
  {
    href: "/tools/resume-checker",
    title: "AI Resume Checker",
    description: "Get your resume scored out of 100 with section-by-section feedback and improvement tips.",
    emoji: "📄",
    badge: "Most Popular",
  },
  {
    href: "/tools/salary-calculator",
    title: "Salary Calculator",
    description: "Compare salaries by job title, location, and experience level across India and globally.",
    emoji: "💰",
    badge: null,
  },
  {
    href: "/tools/interview-questions",
    title: "AI Interview Prep",
    description: "Get role-specific interview questions with suggested answers. Practice for any job.",
    emoji: "🎯",
    badge: "AI Powered",
  },
  {
    href: "/tools/cover-letter-generator",
    title: "Cover Letter Generator",
    description: "Generate a professional, personalized cover letter in seconds using AI.",
    emoji: "✉️",
    badge: null,
  },
  {
    href: "/tools/job-scam-detector",
    title: "Job Scam Detector",
    description: "Check if a job listing is real or a scam. Protect yourself from fake postings.",
    emoji: "🚨",
    badge: "New",
  },
  {
    href: "/tools/linkedin-headline",
    title: "LinkedIn Headline Generator",
    description: "Get 5 optimized LinkedIn headlines that make recruiters click on your profile.",
    emoji: "💼",
    badge: "New",
  },
];

const faqs = [
  {
    q: "Are DecaJobs career tools truly free to use?",
    a: "Yes. All public career tools — including the Resume Checker, Salary Calculator, Interview Prep, and Cover Letter Generator — are 100% free with no credit card or account registration required."
  },
  {
    q: "How does the AI Resume Checker calculate an ATS score?",
    a: "Our algorithm assesses your resume across keyword density, section organization, quantifiable metrics, contact hygiene, and single-column formatting against modern Applicant Tracking System (ATS) heuristics."
  },
  {
    q: "Where does the Salary Calculator get its compensation data?",
    a: "Our data model cross-references official labor reports, verified public employer filings, Glassdoor, Levels.fyi, and real-time job listings aggregated by DecaJobs across India and global remote markets."
  }
];

export default function ToolsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Free Tools" }]} />

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 border border-primary-200">
            ⚡ 100% Free · No Sign-in Required
          </span>
          <h1 className="mt-3 text-3xl font-black text-neutral-900 sm:text-4xl lg:text-5xl">
            Free AI Career Tools
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Data-backed career acceleration utilities designed to optimize your resume, benchmark compensation, and sharpen your interview readiness.
          </p>
        </div>

        {/* Top AdSense Display Unit */}
        <AdSenseUnit label="Sponsored Career Tools Partner" className="mb-10" />

        {/* Tool Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-lg hover:border-primary-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-3xl">{tool.emoji}</span>
                  {tool.badge && (
                    <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {tool.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                <span>Launch Tool</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Educational Content Section to eliminate "thin utility" classification */}
        <section className="mt-16 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            How to Use AI to Supercharge Your Job Search
          </h2>
          <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
            <p>
              In 2026, modern technical recruiting relies heavily on automated applicant filtering. Over 75% of submitted resumes are parsed and ranked by Applicant Tracking Systems before a human recruiter ever sees them.
            </p>
            <p>
              By leveraging our suite of free tools, job seekers can systematically diagnose resume weaknesses, benchmark market salaries, and practice STAR-method behavioral interview responses:
            </p>
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <h3 className="font-bold text-neutral-900 text-sm mb-1">1. Optimize ATS Keywords</h3>
                <p className="text-xs text-neutral-600">Ensure your resume contains the exact hard and soft skill keywords required by employer job descriptions.</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <h3 className="font-bold text-neutral-900 text-sm mb-1">2. Benchmark Fair Pay</h3>
                <p className="text-xs text-neutral-600">Know your market range before entering salary discussions to negotiate from a position of data-backed confidence.</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <h3 className="font-bold text-neutral-900 text-sm mb-1">3. Rehearse STAR Stories</h3>
                <p className="text-xs text-neutral-600">Prepare structured Situation-Task-Action-Result examples to ace behavioral and leadership interviews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mid-page AdSense banner */}
        <AdSenseUnit label="Sponsored Educational Resources" className="my-10" />

        {/* Frequently Asked Questions */}
        <section className="mt-10 rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <span>❓</span> Frequently Asked Questions About DecaJobs Tools
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Daily 10 CTA */}
        <div className="mt-12 rounded-3xl bg-primary-600 p-8 text-center text-white shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold">
            Tired of Searching Across Multiple Job Portals?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-primary-100 max-w-xl mx-auto">
            DecaJobs delivers 10 AI-matched, verified jobs directly to your inbox every morning at 7 AM. Completely free to start.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary-700 hover:bg-neutral-100 transition-colors shadow-md min-h-[44px]"
          >
            Get 10 Matched Jobs Daily — Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
