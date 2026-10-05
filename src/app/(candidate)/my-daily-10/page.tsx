"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateJobTrustScore } from "@/lib/trust-score";
import { extractSkillsFromJob } from "@/lib/public-jobs";
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
  breakdown: {
    titleScore: number;
    skillScore: number;
    locationScore: number;
    descriptionScore: number;
  };
}

interface PreviewData {
  jobs: MatchedJob[];
  profile: {
    titles: string[];
    skills: string[];
    location: string;
  };
  generatedAt: string;
}

export default function MyDaily10Page() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, "relevant" | "irrelevant">>({});

  async function handleFeedback(
    jobId: string,
    rating: "relevant" | "irrelevant",
    jobTitle: string,
    company: string
  ) {
    setFeedbackState((prev) => ({ ...prev, [jobId]: rating }));
    try {
      await fetch("/api/jobs/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, rating, jobTitle, company }),
      });
    } catch (err) {
      console.error("Feedback failed:", err);
    }
  }

  useEffect(() => {
    fetchPreview();
  }, []);

  async function fetchPreview() {
    setIsLoading(true);
    setError("");
    setNeedsProfile(false);

    try {
      const res = await fetch("/api/preview-digest");
      const json = await res.json();

      if (!res.ok) {
        if (json.needsProfile) {
          setNeedsProfile(true);
        }
        setError(json.error || "Failed to load jobs");
        return;
      }

      if (json.jobs?.length === 0) {
        setError(json.error || "No matching jobs found right now.");
        return;
      }

      setData(json);
      if (json.jobs?.length > 0) {
        trackFunnelEvent("funnel_instant_matches_viewed", { count: json.jobs.length });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendDigest() {
    setIsSending(true);
    setSendSuccess(false);

    try {
      const res = await fetch("/api/trigger-digest", { method: "POST" });
      const json = await res.json();

      if (res.ok && json.success) {
        setSendSuccess(true);
      } else {
        setError(json.error || "Failed to send digest email.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            My Daily 10
          </h1>
          <p className="mt-2 text-neutral-600">Finding your best job matches...</p>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-lg bg-neutral-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            My Daily 10
          </h1>
          <p className="mt-4 text-neutral-600">{error}</p>
          <Link
            href="/profile"
            className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Set Up Profile →
          </Link>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            My Daily 10
          </h1>
          <p className="mt-4 text-neutral-600">{error}</p>
          <Button onClick={fetchPreview} className="mt-6">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            My Daily 10
          </h1>
          <p className="mt-2 text-neutral-600">
            Your top {data?.jobs.length ?? 10} job matches based on your profile
            ({data?.profile.titles.join(", ")} · {data?.profile.location}).
          </p>
        </div>

        {/* Send Daily Email CTA */}
        <Card className="mb-6 border-primary-200 bg-primary-50">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-neutral-900">
                Like these matches?
              </p>
              <p className="text-sm text-neutral-600">
                Get these jobs delivered to your inbox every morning.
              </p>
            </div>
            {sendSuccess ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                ✓ Email sent!
              </span>
            ) : (
              <Button
                onClick={handleSendDigest}
                isLoading={isSending}
                size="md"
              >
                {isSending ? "Sending..." : "Send Me Daily 10 📧"}
              </Button>
            )}
          </div>
        </Card>

        {/* Job List */}
        <div className="space-y-4">
          {data?.jobs.map((job) => {
            const trust = calculateJobTrustScore({
              title: job.title,
              company: job.company,
              description: job.description,
              location: job.location,
              applicationLink: job.applicationLink,
            });

            return (
              <Card key={job.id} className={`relative overflow-hidden ${job.isLocked ? "border-dashed border-neutral-300 bg-neutral-50/50" : ""}`}>
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {job.rank}
                  </div>

                  {/* Job Info */}
                  <div className="min-w-0 flex-1">
                    {job.isLocked ? (
                      <div className="text-base font-semibold text-neutral-700 sm:text-lg flex items-center gap-2">
                        <span>{job.title}</span>
                        <span className="text-sm font-normal text-neutral-400 bg-neutral-200/60 px-2 py-0.5 rounded">
                          {job.company}
                        </span>
                      </div>
                    ) : (
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-primary-700 hover:text-primary-800 hover:underline sm:text-lg"
                      >
                        {job.title} <span className="text-sm font-normal text-neutral-500">at {job.company}</span>
                      </a>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="default">
                        📍 {job.location}
                      </Badge>
                      <Badge variant={job.matchScore >= 60 ? "success" : "warning"}>
                        {job.matchScore}% match
                      </Badge>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${trust.badgeBg} ${trust.badgeBorder} ${trust.badgeText}`}
                        title={trust.reasons.join(" · ")}
                      >
                        <span>{trust.icon}</span>
                        Trust {trust.score}/100
                      </span>
                    </div>

                  <p className={`mt-2 text-sm leading-relaxed ${job.isLocked ? "text-neutral-400 italic" : "text-neutral-600"}`}>
                    {job.isLocked ? job.description : (job.description.length > 200
                      ? `${job.description.slice(0, 200)}...`
                      : job.description)}
                  </p>

                  {/* Why this matched & Skill Breakdown */}
                  {!job.isLocked && (() => {
                    const jobSkills = extractSkillsFromJob(`${job.title} ${job.description}`, 8);
                    const candidateSkills = (data?.profile?.skills || []).map((s) => s.toLowerCase());
                    const matchedSkills = jobSkills.filter((s) =>
                      candidateSkills.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
                    );
                    const missingSkills = jobSkills
                      .filter((s) => !candidateSkills.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs)))
                      .slice(0, 3);

                    return (
                      <div className="mt-3 rounded-xl border border-primary-200/80 bg-primary-50/50 p-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-primary-950 mb-1.5">
                          <span className="flex items-center gap-1">🎯 Why this matched ({job.matchScore}%)</span>
                          <span className="text-[11px] font-normal text-primary-700">
                            Title: {Math.round(job.breakdown.titleScore)}/40 · Skills: {Math.round(job.breakdown.skillScore)}/35
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {matchedSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-emerald-700 font-semibold">Matched:</span>
                              {matchedSkills.map((s) => (
                                <span key={s} className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
                                  ✓ {s}
                                </span>
                              ))}
                            </div>
                          )}
                          {missingSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-amber-800 font-medium">Skill Gap:</span>
                              {missingSkills.map((s) => (
                                <span key={s} className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                                  + {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Buttons */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {job.isLocked ? (
                      <Link
                        href="/subscribe"
                        className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 min-h-[44px] gap-1"
                      >
                        🔓 Upgrade to Unlock Job Details
                      </Link>
                    ) : (
                      <>
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
                          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]"
                        >
                          Apply Now →
                        </a>
                        <Link
                          href={`/tools/resume-matcher?role=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&desc=${encodeURIComponent(job.description.slice(0, 1500))}`}
                          className="inline-flex items-center rounded-md border border-primary-300 bg-primary-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-700 hover:bg-primary-100 min-h-[44px] gap-1"
                          title="Generate targeted ATS resume & cover letter tailored to this specific job"
                        >
                          ✨ 1-Click Tailor Application
                        </Link>
                        <a
                          href={`/job-prep?title=${encodeURIComponent(job.title)}&desc=${encodeURIComponent(job.description.slice(0, 1500))}&location=${encodeURIComponent(job.location)}&company=`}
                          className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-primary-200 min-h-[44px]"
                        >
                          🎤 Prep
                        </a>
                        <a
                          href={`/mock-interview?title=${encodeURIComponent(job.title)}&desc=${encodeURIComponent(job.description.slice(0, 1500))}`}
                          className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-primary-200 min-h-[44px]"
                        >
                          🤖 Mock
                        </a>

                        {/* Thumbs up / down feedback */}
                        <div className="flex items-center gap-1.5 ml-auto border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                          <span className="text-[11px] text-neutral-400 font-medium">Was this match relevant?</span>
                          <button
                            type="button"
                            onClick={() => handleFeedback(job.id, "relevant", job.title, job.company)}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                              feedbackState[job.id] === "relevant"
                                ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300"
                                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            }`}
                            title="Relevant match"
                          >
                            👍 {feedbackState[job.id] === "relevant" ? "Relevant ✓" : "Yes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(job.id, "irrelevant", job.title, job.company)}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                              feedbackState[job.id] === "irrelevant"
                                ? "bg-red-100 text-red-800 font-bold border border-red-300"
                                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            }`}
                            title="Not relevant for me"
                          >
                            👎 {feedbackState[job.id] === "irrelevant" ? "Tuned ✓" : "No"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        {data && data.jobs.length > 0 && (
          <Card className="mt-8 border-primary-200 bg-primary-50 text-center">
            <p className="font-medium text-neutral-900">
              Want these delivered every morning?
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Enable daily digest and never miss a match.
            </p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {sendSuccess ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                  ✓ Email sent to your inbox!
                </span>
              ) : (
                <Button
                  onClick={handleSendDigest}
                  isLoading={isSending}
                >
                  {isSending ? "Sending..." : "Send Me Daily 10 📧"}
                </Button>
              )}
              <Link
                href="/settings"
                className="text-sm text-neutral-500 hover:text-neutral-700 underline"
              >
                Manage delivery preferences
              </Link>
            </div>
          </Card>
        )}

        {/* Refresh */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchPreview}
            className="text-sm text-neutral-500 hover:text-primary-600 underline"
          >
            Refresh matches
          </button>
        </div>
      </div>
    </div>
  );
}
