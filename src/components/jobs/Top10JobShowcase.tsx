"use client";

import { useState } from "react";
import Link from "next/link";
import type { RankedJob } from "@/lib/search/decarank";
import { jobSlug, formatPostedDate, daysSincePosted, truncate } from "@/lib/public-jobs";
import { calculateJobTrustScore } from "@/lib/trust-score";
import * as gtag from "@/lib/gtag";

interface Top10JobShowcaseProps {
  rankedJobs: RankedJob[];
  searchQuery?: string;
  totalMatches: number;
}

export function Top10JobShowcase({
  rankedJobs,
  searchQuery = "",
  totalMatches,
}: Top10JobShowcaseProps) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/candidate/quick-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: emailInput.trim(),
          channel: "email",
          query: searchQuery,
        }),
      });
      setSubscribed(true);
      gtag.trackLead("email", "top10_search_alert", { query: searchQuery });
    } catch (err) {
      console.warn("Subscribe error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (rankedJobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Spotlight Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-850 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                DecaRank™ Verified Curation
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                {searchQuery ? (
                  <>
                    The 10 Best Jobs for{" "}
                    <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-200 bg-clip-text text-transparent">
                      &ldquo;{searchQuery}&rdquo;
                    </span>
                  </>
                ) : (
                  <>
                    Today&apos;s{" "}
                    <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-200 bg-clip-text text-transparent">
                      10 Best Curated Jobs
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-primary-200/90 max-w-2xl">
                Precision-ranked from {totalMatches} active listings. Filtered for verified employers, direct ATS applications, and zero spam.
              </p>
            </div>

            {/* Quick Alert Form */}
            <div className="w-full sm:w-auto shrink-0">
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-200">
                  <span>✓</span> Daily 7 AM alert activated for this search!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Get these 10 jobs daily..."
                    required
                    className="w-full sm:w-56 rounded-xl border border-primary-500/40 bg-primary-950/80 px-3 py-2 text-xs text-white placeholder-primary-300/50 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-primary-950 hover:bg-neutral-100 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Set Alert 🔔"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* The 10 Best Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {rankedJobs.map((item) => {
          const { job, rank, score, matchedSkills, matchHighlights } = item;
          const slug = jobSlug(job);
          const days = daysSincePosted(job.postedAt);
          const isRemote = job.location.toLowerCase().includes("remote");
          const trust = calculateJobTrustScore({
            title: job.title,
            company: job.company,
            description: job.description,
            location: job.location,
            postedAt: job.postedAt,
            applicationLink: job.applicationLink,
          });

          // Rank badge styling
          const rankBadge =
            rank === 1
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/20 ring-2 ring-amber-400/30"
              : rank === 2
                ? "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                : rank === 3
                  ? "bg-gradient-to-r from-amber-700 to-amber-800 text-white"
                  : "bg-neutral-100 text-neutral-700 border border-neutral-200";

          return (
            <div
              key={job.id}
              className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all hover:shadow-lg ${
                rank === 1
                  ? "border-amber-300 ring-2 ring-amber-400/20 shadow-md"
                  : rank <= 3
                    ? "border-primary-200 hover:border-primary-400 shadow-xs"
                    : "border-neutral-200 hover:border-primary-300"
              }`}
            >
              <div>
                {/* Card Top: Rank + Match Score + Badges */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold tracking-tight shadow-2xs ${rankBadge}`}
                    >
                      {rank === 1 ? "🏆 #1 Top Match" : `#${rank}`}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-700 border border-primary-200/60">
                      <span>⚡</span> {score}% Match
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isRemote && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        Remote
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold border ${trust.badgeBg} ${trust.badgeBorder} ${trust.badgeText}`}
                      title={trust.reasons.join(" · ")}
                    >
                      <span>{trust.icon}</span> {trust.score}/100
                    </span>
                  </div>
                </div>

                {/* Job Title & Company */}
                <div className="mt-3">
                  <Link
                    href={`/jobs/${slug}`}
                    onClick={() => gtag.trackSelectJob(slug, job.title, job.company)}
                    className="block"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                  </Link>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-neutral-600">
                    {job.company} · <span className="text-neutral-400 font-normal">📍 {job.location}</span>
                  </p>
                </div>

                {/* Match Highlights */}
                {matchHighlights.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {matchHighlights.map((hl) => (
                      <span
                        key={hl}
                        className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600 border border-neutral-150"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description Snippet */}
                <p className="mt-2.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {truncate(job.description, 140)}
                </p>

                {/* Matched Skills */}
                {matchedSkills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {matchedSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-primary-50/70 border border-primary-200/60 px-2 py-0.5 text-[10px] font-semibold text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-400">
                  {days !== null && days <= 2 ? (
                    <span className="font-semibold text-emerald-600">⚡ Fresh {formatPostedDate(job.postedAt)}</span>
                  ) : (
                    formatPostedDate(job.postedAt)
                  )}
                </span>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/mock-interview?title=${encodeURIComponent(
                      job.title
                    )}&company=${encodeURIComponent(job.company)}&desc=${encodeURIComponent(
                      job.description.slice(0, 300)
                    )}`}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    title="Practice realistic mock interview for this role with AI"
                  >
                    Practice 🎙️
                  </Link>

                  <Link
                    href={`/tools/resume-matcher?role=${encodeURIComponent(
                      job.title
                    )}&company=${encodeURIComponent(job.company)}&desc=${encodeURIComponent(
                      job.description.slice(0, 200)
                    )}`}
                    className="rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                    title="Tailor your resume for this role with AI"
                  >
                    Tailor ✨
                  </Link>

                  <Link
                    href={`/jobs/${slug}`}
                    className="rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-2xs"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
