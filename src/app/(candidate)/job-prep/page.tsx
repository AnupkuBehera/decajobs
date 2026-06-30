"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface InterviewPrep {
  companyResearch: {
    overview: string;
    culture: string;
    recentNews: string;
  };
  technicalQuestions: Array<{
    question: string;
    hint: string;
    difficulty: string;
  }>;
  behavioralQuestions: Array<{
    question: string;
    starTip: string;
  }>;
  talkingPoints: string[];
  questionsToAsk: string[];
  salaryRange: string;
}

interface TailoredResume {
  summary: string;
  highlightedSkills: string[];
  experienceBullets: string[];
  keywordsToInclude: string[];
  tailoringTips: string[];
  matchScore: number;
  coverLetterOpener: string;
}

export default function JobPrepPage() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("title") || "";
  const jobDescription = searchParams.get("desc") || "";
  const jobLocation = searchParams.get("location") || "";
  const company = searchParams.get("company") || "";

  const [activeTab, setActiveTab] = useState<"interview" | "resume">("interview");
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrep | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsUpgrade, setNeedsUpgrade] = useState(false);

  async function fetchInterviewPrep() {
    setIsLoading(true);
    setError("");
    setNeedsUpgrade(false);

    try {
      const res = await fetch("/api/job-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "interview-prep",
          jobTitle,
          jobDescription,
          jobLocation,
          company,
        }),
      });

      const data = await res.json();

      if (res.status === 403) {
        setNeedsUpgrade(true);
        setError(data.message || "Pro subscription required");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to generate prep");
        return;
      }

      setInterviewPrep(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTailoredResume() {
    setIsLoading(true);
    setError("");
    setNeedsUpgrade(false);

    try {
      const res = await fetch("/api/job-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tailor-resume",
          jobTitle,
          jobDescription,
          company,
        }),
      });

      const data = await res.json();

      if (res.status === 403) {
        setNeedsUpgrade(true);
        setError(data.message || "Pro subscription required");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to tailor resume");
        return;
      }

      setTailoredResume(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!jobTitle) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Job Prep Tools</h1>
          <p className="mt-4 text-neutral-600">
            Select a job from your{" "}
            <Link href="/my-daily-10" className="text-primary-600 underline">
              Daily 10 matches
            </Link>{" "}
            to prepare for it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/my-daily-10" className="text-sm text-neutral-500 hover:text-primary-600">
            ← Back to My Daily 10
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Prepare for: {jobTitle}
          </h1>
          {company && (
            <p className="mt-1 text-neutral-600">{company} · {jobLocation}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-neutral-200 pb-0">
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
              activeTab === "interview"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            🎤 Interview Prep
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
              activeTab === "resume"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            📄 Tailor Resume
          </button>
        </div>

        {/* Error / Upgrade prompt */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
            {needsUpgrade && (
              <Link
                href="/subscribe"
                className="mt-2 inline-block text-sm font-medium text-primary-600 hover:underline"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>
        )}

        {/* Interview Prep Tab */}
        {activeTab === "interview" && (
          <div>
            {!interviewPrep ? (
              <Card className="text-center py-10">
                <p className="text-neutral-600 mb-4">
                  Generate AI-powered interview prep materials for this role.
                </p>
                <Button onClick={fetchInterviewPrep} isLoading={isLoading} size="lg">
                  {isLoading ? "Generating..." : "Generate Interview Prep 🎤"}
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Company Research */}
                <Card>
                  <CardTitle className="mb-3">🏢 Company Research</CardTitle>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-neutral-900">Overview:</strong> {interviewPrep.companyResearch.overview}</p>
                    <p><strong className="text-neutral-900">Culture:</strong> {interviewPrep.companyResearch.culture}</p>
                    <p><strong className="text-neutral-900">Research tip:</strong> {interviewPrep.companyResearch.recentNews}</p>
                  </div>
                </Card>

                {/* Technical Questions */}
                <Card>
                  <CardTitle className="mb-3">💻 Technical Questions</CardTitle>
                  <div className="space-y-4">
                    {interviewPrep.technicalQuestions.map((q, i) => (
                      <div key={i} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-neutral-900">{q.question}</p>
                          <Badge variant={q.difficulty === "hard" ? "warning" : "default"} className="shrink-0 text-xs">
                            {q.difficulty}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">💡 {q.hint}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Behavioral Questions */}
                <Card>
                  <CardTitle className="mb-3">🗣️ Behavioral Questions</CardTitle>
                  <div className="space-y-4">
                    {interviewPrep.behavioralQuestions.map((q, i) => (
                      <div key={i} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                        <p className="text-sm font-medium text-neutral-900">{q.question}</p>
                        <p className="mt-1 text-xs text-neutral-500">⭐ STAR tip: {q.starTip}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Talking Points */}
                <Card>
                  <CardTitle className="mb-3">🎯 Your Talking Points</CardTitle>
                  <ul className="space-y-2">
                    {interviewPrep.talkingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1 shrink-0 text-green-500">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Questions to Ask */}
                <Card>
                  <CardTitle className="mb-3">❓ Questions to Ask Them</CardTitle>
                  <ul className="space-y-2">
                    {interviewPrep.questionsToAsk.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1 shrink-0">→</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Salary */}
                {interviewPrep.salaryRange && (
                  <Card>
                    <CardTitle className="mb-2">💰 Salary Estimate</CardTitle>
                    <p className="text-sm text-neutral-700">{interviewPrep.salaryRange}</p>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Resume Tailoring Tab */}
        {activeTab === "resume" && (
          <div>
            {!tailoredResume ? (
              <Card className="text-center py-10">
                <p className="text-neutral-600 mb-4">
                  Generate a tailored resume optimized for this specific job listing.
                </p>
                <Button onClick={fetchTailoredResume} isLoading={isLoading} size="lg">
                  {isLoading ? "Tailoring..." : "Tailor My Resume 📄"}
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Match Score */}
                <Card className="border-primary-200 bg-primary-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">Resume Match Score</p>
                      <p className="text-sm text-neutral-600">How well your tailored resume fits this job</p>
                    </div>
                    <div className="text-3xl font-bold text-primary-600">
                      {tailoredResume.matchScore}%
                    </div>
                  </div>
                </Card>

                {/* Professional Summary */}
                <Card>
                  <CardTitle className="mb-3">📝 Tailored Summary</CardTitle>
                  <p className="text-sm leading-relaxed text-neutral-700 bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                    {tailoredResume.summary}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(tailoredResume.summary)}
                    className="mt-2 text-xs text-primary-600 hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </Card>

                {/* Highlighted Skills */}
                <Card>
                  <CardTitle className="mb-3">⚡ Skills to Highlight</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {tailoredResume.highlightedSkills.map((skill, i) => (
                      <Badge key={i} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </Card>

                {/* Experience Bullets */}
                <Card>
                  <CardTitle className="mb-3">💼 Experience Bullets</CardTitle>
                  <p className="text-xs text-neutral-500 mb-3">Use these achievement-oriented bullets in your resume:</p>
                  <ul className="space-y-2">
                    {tailoredResume.experienceBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1 shrink-0 text-neutral-400">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigator.clipboard.writeText(tailoredResume.experienceBullets.join("\n• "))}
                    className="mt-3 text-xs text-primary-600 hover:underline"
                  >
                    Copy all bullets
                  </button>
                </Card>

                {/* ATS Keywords */}
                <Card>
                  <CardTitle className="mb-3">🔑 ATS Keywords to Include</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {tailoredResume.keywordsToInclude.map((kw, i) => (
                      <span key={i} className="rounded-md bg-green-50 border border-green-200 px-2.5 py-1 text-xs font-medium text-green-700">
                        {kw}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Tailoring Tips */}
                <Card>
                  <CardTitle className="mb-3">💡 Tailoring Tips</CardTitle>
                  <ul className="space-y-2">
                    {tailoredResume.tailoringTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1 shrink-0 text-amber-500">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Cover Letter Opener */}
                <Card>
                  <CardTitle className="mb-3">✉️ Cover Letter Opener</CardTitle>
                  <p className="text-sm leading-relaxed text-neutral-700 bg-neutral-50 rounded-lg p-4 border border-neutral-100 italic">
                    &ldquo;{tailoredResume.coverLetterOpener}&rdquo;
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(tailoredResume.coverLetterOpener)}
                    className="mt-2 text-xs text-primary-600 hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
