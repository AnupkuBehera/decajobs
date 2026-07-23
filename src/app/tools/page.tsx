import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Free Career Tools - Resume Checker, Salary Calculator, Interview Prep | DecaJobs",
  description:
    "Free AI-powered career tools: check your resume score, calculate salary by role, prepare for interviews, and generate cover letters. No login required.",
  alternates: {
    canonical: "/tools",
  },
};

const tools = [
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

export default function ToolsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: "Free Tools" }]} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Free Career Tools
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            AI-powered tools to boost your job search. No login required.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-lg hover:border-primary-200"
            >
              {tool.badge && (
                <span className="absolute top-4 right-4 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                  {tool.badge}
                </span>
              )}
              <span className="text-3xl">{tool.emoji}</span>
              <h2 className="mt-4 text-lg font-semibold text-neutral-900 group-hover:text-primary-600">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-600">{tool.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-600">
            Want 10 AI-matched jobs in your inbox every morning?
          </p>
          <Link
            href="/login"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]"
          >
            Sign Up Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
