"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

interface AnalyzedJob {
  jobId: string;
  title: string;
  company: string;
  location: string;
  applicationLink: string;
  postedAt?: string;
  matchScore: number;
  requirementsMet: string[];
  requirementsMissing: string[];
  recommendation: "Apply Now" | "Apply with Tweaks" | "Skip";
  recommendationReason: string;
  visaFlag: "Flagged" | "None Detected";
  tailoredBullet?: string;
  coverLetterOpener?: string;
}

interface ApiResponse {
  jobs: AnalyzedJob[];
  totalFetched: number;
  query: string;
  message?: string;
}

type DatePosted = "today" | "3days" | "week" | "month";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getScoreStyle(score: number) {
  if (score >= 75) return { badge: "success" as const, ring: "ring-green-200", bg: "bg-green-50", text: "text-green-700" };
  if (score >= 50) return { badge: "warning" as const, ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700" };
  return { badge: "error" as const, ring: "ring-red-200", bg: "bg-red-50", text: "text-red-700" };
}

function getRecommendationStyle(rec: AnalyzedJob["recommendation"]) {
  switch (rec) {
    case "Apply Now":
      return { emoji: "🚀", cls: "bg-green-100 text-green-800 border border-green-200" };
    case "Apply with Tweaks":
      return { emoji: "🔧", cls: "bg-amber-100 text-amber-800 border border-amber-200" };
    case "Skip":
      return { emoji: "⏭", cls: "bg-neutral-100 text-neutral-600 border border-neutral-200" };
  }
}

function formatPostedDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  } catch {
    return null;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function JobCard({
  job,
  rank,
  isTop3,
}: {
  job: AnalyzedJob;
  rank: number;
  isTop3: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copiedBullet, setCopiedBullet] = useState(false);
  const [copiedOpener, setCopiedOpener] = useState(false);

  const scoreStyle = getScoreStyle(job.matchScore);
  const recStyle = getRecommendationStyle(job.recommendation);
  const postedLabel = formatPostedDate(job.postedAt);

  function copy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  return (
    <Card
      padding="lg"
      className={`ring-1 ${scoreStyle.ring} transition-shadow hover:shadow-md relative`}
    >
      {/* Rank badge */}
      <div className="absolute -top-3 -left-3 h-7 w-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shadow">
        #{rank}
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-neutral-900 leading-snug">
              {job.title}
            </h3>
            {isTop3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 shrink-0">
                ⭐ Top Match
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-600 mt-0.5">
            {job.company}
            <span className="mx-1.5 text-neutral-300">•</span>
            {job.location}
            {postedLabel && (
              <>
                <span className="mx-1.5 text-neutral-300">•</span>
                <span className="text-neutral-400">{postedLabel}</span>
              </>
            )}
          </p>
        </div>

        {/* Match score */}
        <div
          className={`shrink-0 text-center px-4 py-2 rounded-xl ${scoreStyle.bg} ring-1 ${scoreStyle.ring}`}
        >
          <p className="text-2xl font-bold leading-none ${scoreStyle.text}">
            {job.matchScore}
          </p>
          <p className={`text-xs font-medium mt-0.5 ${scoreStyle.text}`}>/100</p>
        </div>
      </div>

      {/* Recommendation + Visa */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${recStyle.cls}`}
        >
          {recStyle.emoji} {job.recommendation}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            job.visaFlag === "Flagged"
              ? "bg-orange-50 text-orange-700 border border-orange-200"
              : "bg-neutral-50 text-neutral-500 border border-neutral-200"
          }`}
        >
          {job.visaFlag === "Flagged" ? "🚩 Visa/Auth Flagged" : "✅ No Visa Restrictions Detected"}
        </span>
        <a
          href={job.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          id={`apply-job-${rank}`}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors min-h-[36px]"
        >
          Apply →
        </a>
      </div>

      {/* Rationale */}
      <p className="mt-3 text-sm text-neutral-600 italic leading-relaxed">
        &ldquo;{job.recommendationReason}&rdquo;
      </p>

      {/* Requirements met / missing */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
            ✅ Top Requirements Met
          </p>
          <ul className="space-y-1.5">
            {job.requirementsMet.map((req, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-neutral-700"
              >
                <span className="mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  ✓
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">
            ❌ Top Requirements Missing
          </p>
          <ul className="space-y-1.5">
            {job.requirementsMissing.map((req, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-neutral-700"
              >
                <span className="mt-0.5 h-4 w-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  ✗
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top 3: Tailored bullet + cover letter */}
      {isTop3 && (job.tailoredBullet || job.coverLetterOpener) && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            id={`toggle-ai-extras-${rank}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            >
              ▶
            </span>
            {expanded ? "Hide" : "Show"} AI Resume & Cover Letter Tips for This Role
          </button>

          {expanded && (
            <div className="mt-3 space-y-3">
              {job.tailoredBullet && (
                <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
                  <p className="text-xs font-semibold text-primary-700 mb-2">
                    💡 Tailored ATS Resume Bullet
                  </p>
                  <p className="text-sm text-neutral-800 font-mono leading-relaxed">
                    {job.tailoredBullet}
                  </p>
                  <button
                    onClick={() => copy(job.tailoredBullet!, setCopiedBullet)}
                    id={`copy-bullet-${rank}`}
                    className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 bg-white px-2.5 py-1 rounded-md min-h-[32px]"
                  >
                    {copiedBullet ? "Copied! ✓" : "Copy Bullet"}
                  </button>
                </div>
              )}
              {job.coverLetterOpener && (
                <div className="rounded-lg border border-violet-100 bg-violet-50 p-4">
                  <p className="text-xs font-semibold text-violet-700 mb-2">
                    ✉️ Cover Letter Opening (2 sentences)
                  </p>
                  <p className="text-sm text-neutral-800 leading-relaxed italic">
                    &ldquo;{job.coverLetterOpener}&rdquo;
                  </p>
                  <button
                    onClick={() => copy(job.coverLetterOpener!, setCopiedOpener)}
                    id={`copy-opener-${rank}`}
                    className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-700 border border-violet-200 bg-white px-2.5 py-1 rounded-md min-h-[32px]"
                  >
                    {copiedOpener ? "Copied! ✓" : "Copy Opener"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const DATE_OPTIONS: { label: string; value: DatePosted }[] = [
  { label: "Today", value: "today" },
  { label: "Last 3 Days", value: "3days" },
  { label: "Last 7 Days", value: "week" },
  { label: "Last 30 Days", value: "month" },
];

export default function AiRecruiterPage() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("Remote");
  const [datePosted, setDatePosted] = useState<DatePosted>("week");

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    const trimmedResume = resumeText.trim();
    const trimmedTitle = jobTitle.trim();

    if (trimmedResume.length < 100) {
      setError("Please paste your full resume (at least 100 characters).");
      return;
    }
    if (!trimmedTitle) {
      setError("Please enter a job title to search for.");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const res = await fetch("/api/tools/ai-recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: trimmedResume,
          jobTitle: trimmedTitle,
          location: location.trim() || "Remote",
          datePosted,
        }),
      });

      let data: ApiResponse;
      try {
        data = await res.json();
      } catch {
        setError(
          res.status >= 500
            ? "Server error. Please try again in a moment."
            : "Unexpected response from server. Please try again."
        );
        setStep("form");
        return;
      }

      if (!res.ok) {
        setError(
          data.message ??
            (res.status === 429
              ? "The AI is currently busy. Please wait a minute and try again."
              : "Analysis failed. Please try again.")
        );
        setStep("form");
        return;
      }

      setResult(data);
      setStep("results");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("form");
    }
  }

  function handleReset() {
    setStep("form");
    setResult(null);
    setError("");
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-3">
            Live Job Search · AI Powered
          </span>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            AI Recruiter Mode
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            Paste your resume, define your search, and get brutally-honest AI
            match scores for real live job postings — sorted from best fit to
            worst, with tailored resume bullets and cover letter openers for
            your top matches.
          </p>
        </div>

        {/* ── Form ── */}
        {step === "form" && (
          <div className="space-y-6">
            {/* Resume */}
            <Card padding="lg">
              <label
                htmlFor="resume-input"
                className="block text-sm font-semibold text-neutral-800 mb-2"
              >
                1. Paste your resume
              </label>
              <p className="text-xs text-neutral-500 mb-3">
                Include your work experience, skills, and education. The more
                detail, the more accurate the match scores.
              </p>
              <textarea
                id="resume-input"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste your resume here — work experience, skills, education, certifications..."
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
              <p className="mt-1.5 text-xs text-neutral-400 text-right">
                {resumeText.length} characters{" "}
                {resumeText.length < 100 && (
                  <span className="text-red-500">(min 100)</span>
                )}
              </p>
            </Card>

            {/* Search params */}
            <Card padding="lg">
              <p className="text-sm font-semibold text-neutral-800 mb-4">
                2. Define your job search
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="job-title-input"
                    className="block text-xs font-medium text-neutral-600 mb-1.5"
                  >
                    Job Title *
                  </label>
                  <input
                    id="job-title-input"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location-input"
                    className="block text-xs font-medium text-neutral-600 mb-1.5"
                  >
                    Location
                  </label>
                  <input
                    id="location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Remote, New York, etc."
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date-filter"
                    className="block text-xs font-medium text-neutral-600 mb-1.5"
                  >
                    Date Posted
                  </label>
                  <select
                    id="date-filter"
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value as DatePosted)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    {DATE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </p>
            )}

            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full"
              id="run-ai-recruiter"
            >
              🤖 Analyze Live Jobs — Free
            </Button>
            <p className="text-center text-xs text-neutral-400">
              ⚡ Searches live job boards · AI scores every listing against
              your resume · Takes ~20–40 seconds
            </p>
          </div>
        )}

        {/* ── Loading ── */}
        {step === "loading" && (
          <Card padding="lg" className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Your AI Recruiter is working…
            </h2>
            <div className="mt-4 space-y-2 text-sm text-neutral-500 max-w-xs mx-auto">
              <p>🔍 Searching live job boards for &ldquo;{jobTitle}&rdquo;</p>
              <p>📊 Analyzing each posting against your resume</p>
              <p>✍️ Generating tailored bullets for top matches</p>
            </div>
            <p className="mt-6 text-xs text-neutral-400">
              This typically takes 20–40 seconds. Please don&apos;t close this page.
            </p>
          </Card>
        )}

        {/* ── Results ── */}
        {step === "results" && result && (
          <div className="space-y-6">
            {/* Summary bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-neutral-900 text-white px-6 py-4">
              <div>
                <p className="text-sm font-semibold">
                  {result.jobs.length === 0
                    ? "No matches found"
                    : `${result.jobs.length} jobs analyzed · sorted by match score`}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Search: &ldquo;{result.query}&rdquo;
                  {result.totalFetched > result.jobs.length &&
                    ` · Fetched ${result.totalFetched}, analyzed top ${result.jobs.length}`}
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  ≥75 Strong
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  50–74 Moderate
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  &lt;50 Weak
                </span>
              </div>
            </div>

            {/* No jobs */}
            {result.jobs.length === 0 && (
              <Card padding="lg" className="text-center py-10">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-neutral-800">
                  No live listings found
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                  {result.message ||
                    "Try broadening your job title or changing the date range."}
                </p>
                <Button
                  onClick={handleReset}
                  size="md"
                  className="mt-5"
                  id="try-again-btn"
                >
                  Try Different Search
                </Button>
              </Card>
            )}

            {/* Job cards */}
            {result.jobs.map((job, index) => (
              <JobCard
                key={job.jobId}
                job={job}
                rank={index + 1}
                isTop3={index < 3}
              />
            ))}

            {/* CTA */}
            {result.jobs.length > 0 && (
              <Card
                padding="lg"
                className="text-center bg-primary-50 border-primary-100"
              >
                <h3 className="font-bold text-neutral-900 text-lg">
                  Want 10 AI-matched jobs in your inbox every morning?
                </h3>
                <p className="mt-1 text-sm text-neutral-600 max-w-xl mx-auto">
                  Sign up for DecaJobs to get your top 10 personalized job
                  matches sent to your email daily — no searching required.
                </p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]"
                >
                  Get Daily Jobs Free →
                </Link>
              </Card>
            )}

            <button
              onClick={handleReset}
              id="new-search-btn"
              className="w-full text-center text-sm font-medium text-primary-600 hover:underline"
            >
              ← Start a new search
            </button>
          </div>
        )}

        {/* ── SEO content ── */}
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
