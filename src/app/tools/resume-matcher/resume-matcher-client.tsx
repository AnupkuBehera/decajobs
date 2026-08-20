"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function ResumeMatcherClient() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleAnalyze() {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError("Please paste your full resume text (at least 50 characters).");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setError("Please paste the job description (at least 30 characters).");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tools/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        if (response.status === 504 || response.status === 502) {
          setError("Analysis timed out. The AI took too long to respond. Please try again with shorter text.");
        } else {
          setError("Server returned an invalid response. Please try again later.");
        }
        return;
      }

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || "Rate limit exceeded. The free AI tool is currently busy. Please wait a minute.");
        } else {
          setError(data.error || "Analysis failed. Please try again.");
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

  function copyBullet(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600 border-green-200 bg-green-50";
    if (score >= 60) return "text-amber-600 border-amber-200 bg-amber-50";
    return "text-red-600 border-red-200 bg-red-50";
  }

  return (
    <>
      {!result ? (
        <Card padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                1. Paste your resume text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste your resume here (Work Experience, Skills, Education)..."
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                2. Paste target job description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                placeholder="Paste the job requirements, responsibilities, and key skills..."
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

          <Button onClick={handleAnalyze} isLoading={isLoading} size="lg" className="mt-6 w-full">
            {isLoading ? "Analyzing Match..." : "Check Resume Match Score — Free"}
          </Button>
          <p className="mt-3 text-center text-xs text-neutral-500">
            ⚡ Instant Analysis • No login required • Your data is not saved
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Score & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="lg" className={`text-center border ${getScoreColor(result.matchScore)}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">ATS Match Score</p>
              <p className="text-5xl font-bold mt-2">{result.matchScore}%</p>
              <p className="text-xs mt-2 font-medium">
                {result.matchScore >= 80 ? "Great Match!" : result.matchScore >= 60 ? "Moderate Match" : "Needs Optimization"}
              </p>
            </Card>

            <Card padding="lg" className="md:col-span-2 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">📊 Match Summary</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">{result.summaryFeedback}</p>
            </Card>
          </div>

          {/* Keyword Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="text-red-500">❌</span> Missing Critical Keywords
              </h3>
              <p className="text-xs text-neutral-500 mb-3">Add these keywords to your resume to pass ATS filters:</p>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="text-green-500">✅</span> Matched Keywords
              </h3>
              <p className="text-xs text-neutral-500 mb-3">Good job! These key skills were found in your resume:</p>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords?.map((kw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Tailored Bullet Points */}
          {result.tailoredBullets?.length > 0 && (
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">✨ Suggested Resume Bullets (Copy & Paste)</h3>
              <p className="text-xs text-neutral-500 mb-4">Use these tailored achievement bullets in your work experience section:</p>
              <div className="space-y-3">
                {result.tailoredBullets.map((bullet: string, i: number) => (
                  <div key={i} className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-between items-start gap-3">
                    <p className="text-xs text-neutral-800 font-mono leading-relaxed">{bullet}</p>
                    <button
                      onClick={() => copyBullet(bullet, i)}
                      className="px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded shrink-0 border border-primary-200"
                    >
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CTA */}
          <Card padding="lg" className="text-center bg-primary-50 border border-primary-200">
            <h3 className="font-bold text-neutral-900">Want daily AI-matched job opportunities?</h3>
            <p className="mt-1 text-sm text-neutral-600">DecaJobs matches your resume against thousands of jobs and sends 10 top matches daily.</p>
            <Link href="/login" className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
              Get Daily Job Matches →
            </Link>
          </Card>

          <button onClick={() => { setResult(null); setResumeText(""); setJobDescription(""); }} className="w-full text-center text-sm font-medium text-primary-600 hover:underline">
            ← Match another resume & job
          </button>
        </div>
      )}
    </>
  );
}
