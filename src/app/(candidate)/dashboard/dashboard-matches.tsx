"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    if (isProfileComplete) {
      fetchMatches();
    }
  }, [isProfileComplete]);

  async function fetchMatches() {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/preview-digest");
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to load jobs");
        return;
      }

      setData(json);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isProfileComplete) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-bold text-neutral-900">Your Top Job Matches</h2>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card padding="md" className="text-center text-neutral-500 mt-6">
        <p className="text-sm">{error}</p>
        <button onClick={fetchMatches} className="mt-2 text-sm text-primary-600 underline">
          Try refreshing
        </button>
      </Card>
    );
  }

  if (!data || data.jobs.length === 0) {
    return null;
  }

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

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Your Top Matches Today</h2>
        <Link href="/my-daily-10" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
          View All 10 →
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.slice(0, 4).map((job) => (
          <Card key={job.id} padding="md" className={`relative overflow-hidden ${job.isLocked ? "border-dashed border-neutral-300 bg-neutral-50/50" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {job.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-neutral-800 sm:text-base">
                  {job.isLocked ? (
                    <span>{job.title} at <span className="text-xs font-normal text-neutral-400 bg-neutral-200/50 px-2 py-0.5 rounded">{job.company}</span></span>
                  ) : (
                    <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline">
                      {job.title} <span className="text-xs font-normal text-neutral-500">at {job.company}</span>
                    </a>
                  )}
                </div>
                <div className="mt-1 flex gap-2">
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">📍 {job.location}</Badge>
                  <Badge variant={job.matchScore >= 60 ? "success" : "warning"} className="text-[10px] px-1.5 py-0">{job.matchScore}% match</Badge>
                </div>
                <p className={`mt-1.5 text-xs leading-relaxed ${job.isLocked ? "text-neutral-400 italic" : "text-neutral-600"}`}>
                  {job.isLocked ? job.description : (job.description.length > 120 ? `${job.description.slice(0, 120)}...` : job.description)}
                </p>
                {job.isLocked && (
                  <div className="mt-2.5">
                    <Link href="/subscribe" className="inline-flex items-center rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 min-h-[32px] gap-1">
                      🔓 Upgrade to Unlock Job Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
