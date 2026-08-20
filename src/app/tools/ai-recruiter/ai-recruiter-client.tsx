"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
          <p className={`text-2xl font-bold leading-none ${scoreStyle.text}`}>
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
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-neutral-50 text-neutral-600 border border-neutral-200"
          }`}
        >
          {job.visaFlag === "Flagged" ? "⚠️ Visa restriction detected" : "✓ No visa flag"}
        </span>
      </div>

      {/* Why this score */}
      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
        {job.recommendationReason}
      </p>

      {/* Requirements met / missing grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded-lg bg-green-50/70 border border-green-100 p-3">
          <p className="font-semibold text-green-800 mb-1.5 flex items-center gap-1">
            <span>✓</span> Match Strengths
          </p>
          <ul className="space-y-1 text-green-700">
            {job.requirementsMet.map((req, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="shrink-0 text-green-500">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-amber-50/70 border border-amber-100 p-3">
          <p className="font-semibold text-amber-800 mb-1.5 flex items-center gap-1">
            <span>⚠</span> Skill / Experience Gaps
          </p>
          <ul className="space-y-1 text-amber-700">
            {job.requirementsMissing.map((req, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="shrink-0 text-amber-500">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tailored bullet & cover letter opener (top 3 only) */}
      {isTop3 && (job.tailoredBullet || job.coverLetterOpener) && (
        <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2.5">
          {job.tailoredBullet && (
            <div className="rounded-lg bg-primary-50/60 border border-primary-100 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-primary-900">
                  💡 Tailored Bullet for Resume
                </span>
                <button
                  onClick={() => copy(job.tailoredBullet!, setCopiedBullet)}
                  className="text-xs text-primary-700 hover:underline font-medium"
                >
                  {copiedBullet ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-primary-800 font-mono leading-relaxed">
                {job.tailoredBullet}
              </p>
            </div>
          )}

          {job.coverLetterOpener && (
            <div className="rounded-lg bg-primary-50/60 border border-primary-100 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-primary-900">
                  ✍ Cover Letter Opener
                </span>
                <button
                  onClick={() => copy(job.coverLetterOpener!, setCopiedOpener)}
                  className="text-xs text-primary-700 hover:underline font-medium"
                >
                  {copiedOpener ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-primary-800 italic leading-relaxed">
                &ldquo;{job.coverLetterOpener}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer / Link */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
        <a
          href={job.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          View & Apply on Host Board ↗
        </a>
      </div>
    </Card>
  );
}

export function AIRecruiterClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [datePosted, setDatePosted] = useState<DatePosted>("week");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!jobTitle.trim()) {
      setError("Please enter a target job title.");
      return;
    }
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError("Please paste your resume text (at least 50 characters).");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/ai-recruiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, resumeText, datePosted }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        if (response.status === 504 || response.status === 502) {
          setError("Analysis timed out. Try refining your job title or selecting a shorter date range.");
        } else {
          setError("Server returned an invalid response. Please try again later.");
        }
        return;
      }

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || "Rate limit exceeded. Please wait a minute or try again.");
        } else {
          setError(data.error || "Recruiter mode analysis failed. Please try again.");
        }
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error or connection timeout. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError("");
  }

  return (
    <>
      {!result ? (
        <Card padding="lg" className="shadow-sm border-neutral-200">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                1. Target Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Developer, Data Analyst, Product Manager"
                className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                2. Your Resume Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                placeholder="Paste your resume content here... (Copy from Word or PDF)"
                className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                3. Date Posted Filter
              </label>
              <select
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value as DatePosted)}
                className="w-full sm:w-64 rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="today">Past 24 Hours</option>
                <option value="3days">Past 3 Days</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              isLoading={isLoading}
              size="lg"
              className="w-full py-3.5"
              id="analyze-jobs-btn"
            >
              {isLoading ? "Fetching Live Jobs & Running AI Analysis..." : "Run AI Recruiter Mode — Free"}
            </Button>
            <p className="text-center text-xs text-neutral-500">
              Scans live openings across remote & Indian job boards. No login required.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Analysis Results
                </p>
                <h2 className="text-lg font-bold text-neutral-900">
                  Target: &ldquo;{result.query}&rdquo;
                </h2>
              </div>
              <Badge variant="info">
                {result.jobs.length} roles scored out of {result.totalFetched} live openings
              </Badge>
            </div>
          </div>

          {result.jobs.length === 0 && (
            <Card padding="lg" className="text-center py-10">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-neutral-800">No live listings found</p>
              <p className="text-sm text-neutral-500 mt-2">
                {result.message || "Try broadening your job title or changing the date range."}
              </p>
              <Button onClick={handleReset} size="md" className="mt-5" id="try-again-btn">
                Try Different Search
              </Button>
            </Card>
          )}

          {result.jobs.map((job, index) => (
            <JobCard key={job.jobId} job={job} rank={index + 1} isTop3={index < 3} />
          ))}

          {result.jobs.length > 0 && (
            <Card padding="lg" className="text-center bg-primary-50 border-primary-100">
              <h3 className="font-bold text-neutral-900 text-lg">
                Want 10 AI-matched jobs in your inbox every morning?
              </h3>
              <p className="mt-1 text-sm text-neutral-600 max-w-xl mx-auto">
                Sign up for DecaJobs to get your top 10 personalized job matches sent to your email daily — no searching required.
              </p>
              <Link href="/login" className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
                Get Daily Jobs Free →
              </Link>
            </Card>
          )}

          <button onClick={handleReset} id="new-search-btn" className="w-full text-center text-sm font-medium text-primary-600 hover:underline">
            ← Start a new search
          </button>
        </div>
      )}
    </>
  );
}
