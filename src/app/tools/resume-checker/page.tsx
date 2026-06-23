"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ResumeCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError("Please paste your full resume text (at least 50 characters).");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/resume-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Analysis failed. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Free AI Resume Checker
          </h1>
          <p className="mt-3 text-neutral-600">
            Get your resume scored instantly. Find out what&apos;s working and what needs improvement.
          </p>
        </div>

        {!result ? (
          <Card padding="lg">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Paste your resume text below
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              placeholder="Paste your full resume here... (Copy from your resume document)"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <Button onClick={handleAnalyze} isLoading={isLoading} size="lg" className="mt-4 w-full">
              {isLoading ? "Analyzing..." : "Check My Resume — Free"}
            </Button>
            <p className="mt-3 text-center text-xs text-neutral-500">
              No login required. Your data is not stored.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Score */}
            <Card padding="lg" className="text-center">
              <p className="text-sm text-neutral-600">Your Resume Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
              <p className="text-neutral-500">/100</p>
            </Card>

            {/* Sections */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold mb-4">Section Breakdown</h2>
              <div className="space-y-3">
                {result.sections?.map((s: any) => (
                  <div key={s.name} className="rounded-lg border border-neutral-200 p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{s.name}</span>
                      <span className={`text-sm font-bold ${getScoreColor(s.score)}`}>{s.score}/100</span>
                    </div>
                    <p className="text-xs text-neutral-600">{s.feedback}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Suggestions */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold mb-4">💡 Top Suggestions</h2>
              <ul className="space-y-2">
                {result.suggestions?.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-neutral-700 flex gap-2">
                    <span className="text-primary-600 shrink-0">{i + 1}.</span> {s}
                  </li>
                ))}
              </ul>
            </Card>

            {/* CTA */}
            <Card padding="lg" className="text-center bg-primary-50 border-primary-200">
              <p className="font-semibold text-neutral-900">Want AI-optimized job matches daily?</p>
              <p className="mt-1 text-sm text-neutral-600">Sign up for DecaJobs and get 10 jobs matched to your profile every morning.</p>
              <Link href="/login" className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
                Get Started Free →
              </Link>
            </Card>

            <button onClick={() => { setResult(null); setResumeText(""); }} className="w-full text-center text-sm text-primary-600 hover:underline">
              Check another resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
