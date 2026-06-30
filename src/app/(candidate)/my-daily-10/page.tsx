"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MatchedJob {
  rank: number;
  id: string;
  title: string;
  description: string;
  location: string;
  applicationLink: string;
  matchScore: number;
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
          {data?.jobs.map((job) => (
            <Card key={job.id} className="relative overflow-hidden">
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {job.rank}
                </div>

                {/* Job Info */}
                <div className="min-w-0 flex-1">
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-primary-700 hover:text-primary-800 hover:underline sm:text-lg"
                  >
                    {job.title}
                  </a>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="default">
                      📍 {job.location}
                    </Badge>
                    <Badge variant={job.matchScore >= 60 ? "success" : "warning"}>
                      {job.matchScore}% match
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {job.description.length > 200
                      ? `${job.description.slice(0, 200)}...`
                      : job.description}
                  </p>

                  {/* Score Breakdown (collapsed) */}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-600">
                      Score breakdown
                    </summary>
                    <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-neutral-500 sm:grid-cols-4">
                      <span>Title: {Math.round(job.breakdown.titleScore)}/40</span>
                      <span>Skills: {Math.round(job.breakdown.skillScore)}/35</span>
                      <span>Location: {Math.round(job.breakdown.locationScore)}/15</span>
                      <span>Desc: {Math.round(job.breakdown.descriptionScore)}/10</span>
                    </div>
                  </details>

                  {/* Apply Button */}
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]"
                  >
                    Apply Now →
                  </a>
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
