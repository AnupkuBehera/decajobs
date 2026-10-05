"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackFunnelEvent } from "@/lib/gtag";

interface MatchedJob {
  rank: number;
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applicationLink: string;
  matchScore: number;
  isLocked?: boolean;
}

interface PreviewData {
  jobs: MatchedJob[];
  subscription?: {
    hasAccess: boolean;
    status: string;
    trialDaysLeft: number;
  };
}

export default function DashboardMatches({ isProfileComplete }: { isProfileComplete: boolean }) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Instant Activation state (for 2-field rapid Day 0 onboarding)
  const [quickTitle, setQuickTitle] = useState("");
  const [quickLocation, setQuickLocation] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, "relevant" | "irrelevant">>({});

  useEffect(() => {
    // Auto-fetch if profile is marked complete or user already configured basic settings
    fetchMatches();
  }, [isProfileComplete]);

  async function fetchMatches() {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/preview-digest");
      const json = await res.json();

      if (!res.ok) {
        if (json.needsProfile) {
          // Profile needs initial 2-field setup
          setData(null);
        } else {
          setError(json.error || "Failed to load jobs");
        }
        return;
      }

      setData(json);
      if (json.jobs && json.jobs.length > 0) {
        trackFunnelEvent("funnel_instant_matches_viewed", { count: json.jobs.length });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuickActivation(e: React.FormEvent) {
    e.preventDefault();
    if (!quickTitle.trim() || !quickLocation.trim()) return;

    setIsActivating(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_titles: [quickTitle.trim()],
          location: quickLocation.trim(),
          skills: [quickTitle.trim()],
        }),
      });

      if (res.ok) {
        await fetchMatches();
      } else {
        const json = await res.json();
        setError(json.error || "Failed to save preferences. Please try again.");
      }
    } catch {
      setError("Network error saving preferences.");
    } finally {
      setIsActivating(false);
    }
  }

  async function handleFeedback(jobId: string, rating: "relevant" | "irrelevant", title: string, company: string) {
    setFeedbackState((prev) => ({ ...prev, [jobId]: rating }));
    try {
      await fetch("/api/jobs/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, rating, jobTitle: title, company }),
      });
    } catch (err) {
      console.error("Failed to submit match rating:", err);
    }
  }

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-neutral-200 animate-pulse rounded" />
          <div className="h-4 w-24 bg-neutral-200 animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-neutral-100 border border-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Day-0 Rapid Activation Form (if no profile setup yet)
  if (!data || data.jobs.length === 0) {
    return (
      <div className="mt-6">
        <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50/50 via-white to-blue-50/20 p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white font-bold shadow-xs">
              ⚡
            </span>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Unlock Your 10 Instant Job Matches (Day 0)
              </h2>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed max-w-xl">
                No need to wait for tomorrow&apos;s 7:00 AM email or spend 20 minutes formatting a resume. Start with just your target role and city to see immediate matches.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleQuickActivation} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Target Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Developer, Data Analyst, Product Manager"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-neutral-400 font-semibold mr-1">Popular:</span>
                {[
                  "Frontend Developer",
                  "Full Stack Engineer",
                  "Python / Data Analyst",
                  "Fresher SDE",
                  "DevOps Engineer",
                  "Product Manager",
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setQuickTitle(role)}
                    className="text-[11px] bg-white border border-neutral-200 hover:border-primary-400 hover:text-primary-700 px-2.5 py-0.5 rounded-full text-neutral-600 transition-colors shadow-2xs"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Preferred City or Remote *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bangalore, Hyderabad, London, Dubai, Remote"
                value={quickLocation}
                onChange={(e) => setQuickLocation(e.target.value)}
                className="w-full text-sm rounded-lg border border-neutral-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-neutral-400 font-semibold mr-1">Locations:</span>
                {["Remote", "Bangalore", "Hyderabad", "Pune", "Delhi NCR", "London", "Dubai"].map(
                  (loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setQuickLocation(loc)}
                      className="text-[11px] bg-white border border-neutral-200 hover:border-primary-400 hover:text-primary-700 px-2.5 py-0.5 rounded-full text-neutral-600 transition-colors shadow-2xs"
                    >
                      {loc}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isActivating || !quickTitle.trim() || !quickLocation.trim()}
                className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm py-3 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isActivating ? (
                  <span>Scanning 20+ sources for instant matches...</span>
                ) : (
                  <span>🚀 See My 10 Matches Right Now</span>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-neutral-500">
              ⚡ You will also be scheduled for 7:00 AM daily digests automatically.
            </p>
          </form>
        </Card>
      </div>
    );
  }

  // 3. Render Matched Jobs
  const { jobs, subscription } = data;
  const trialDaysLeft = subscription?.trialDaysLeft ?? 0;
  const hasAccess = subscription?.hasAccess ?? false;

  return (
    <div className="space-y-4 mt-6">
      {/* Trial banner */}
      {hasAccess && subscription?.status === "trial" && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 text-sm text-amber-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>⚡ <strong>DecaJobs Pro Trial:</strong> {trialDaysLeft} days remaining. Upgrade to Pro to lock in continuous morning delivery!</span>
          <Link href="/subscribe" className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-md shrink-0 self-start sm:self-auto min-h-[30px] flex items-center">
            Upgrade Pro
          </Link>
        </div>
      )}

      {/* Accuracy Feedback Notice */}
      <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3 flex items-center justify-between gap-3 text-xs text-teal-900">
        <span className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <span>Help train your AI matching engine: Rate any job below with <strong>👍 Relevant</strong> or <strong>👎 Not for me</strong>.</span>
        </span>
        <span className="font-semibold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded text-[11px] shrink-0">
          91% Avg Relevance
        </span>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Your Top Matches Today</h2>
        <Link href="/my-daily-10" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
          View All 10 Full Details →
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.slice(0, 5).map((job) => (
          <Card key={job.id} padding="md" className={`relative overflow-hidden transition-all hover:border-neutral-300 ${job.isLocked ? "border-dashed border-neutral-300 bg-neutral-50/50" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {job.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="text-sm font-semibold text-neutral-800 sm:text-base">
                    {job.isLocked ? (
                      <span>{job.title} at <span className="text-xs font-normal text-neutral-400 bg-neutral-200/50 px-2 py-0.5 rounded">{job.company}</span></span>
                    ) : (
                      <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline">
                        {job.title} <span className="text-xs font-normal text-neutral-500">at {job.company}</span>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">📍 {job.location}</Badge>
                    <Badge variant={job.matchScore >= 60 ? "success" : "warning"} className="text-[10px] px-1.5 py-0">{job.matchScore}% match</Badge>
                  </div>
                </div>

                <p className={`mt-1.5 text-xs leading-relaxed ${job.isLocked ? "text-neutral-400 italic" : "text-neutral-600"}`}>
                  {job.isLocked ? job.description : (job.description.length > 130 ? `${job.description.slice(0, 130)}...` : job.description)}
                </p>

                {/* Card Action Row: Apply + Thumbs Up/Down Feedback */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    {!job.isLocked && (
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackFunnelEvent("funnel_job_clicked", {
                            jobId: job.id,
                            role: job.title,
                            company: job.company,
                          })
                        }
                        className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 shadow-2xs transition-colors"
                      >
                        Apply Now ↗
                      </a>
                    )}
                    {job.isLocked && (
                      <Link href="/subscribe" className="inline-flex items-center rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 min-h-[32px] gap-1">
                        🔓 Unlock Job Details
                      </Link>
                    )}
                  </div>

                  {/* Feedback widget */}
                  <div className="flex items-center gap-1.5">
                    {feedbackState[job.id] ? (
                      <span className="text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                        {feedbackState[job.id] === "relevant" ? "✓ Marked Relevant" : "✓ Feedback Saved"}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleFeedback(job.id, "relevant", job.title, job.company)}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded border border-neutral-200 transition-colors"
                          title="This job is relevant to my goals"
                        >
                          <span>👍</span> Relevant
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(job.id, "irrelevant", job.title, job.company)}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded border border-neutral-200 transition-colors"
                          title="Not relevant for my preferences"
                        >
                          <span>👎</span> Not for me
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
