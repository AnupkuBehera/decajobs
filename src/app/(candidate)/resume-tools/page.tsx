"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

type Tab = "score" | "optimize" | "cover-letter";

interface ScoreResult {
  score: number;
  sections: { name: string; score: number; feedback: string }[];
  suggestions: string[];
}

interface OptimizeResult {
  optimizedResume: string;
  changes: string[];
  matchScore: number;
}

export default function ResumeToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("score");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Results
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  async function handleSubmit() {
    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    if ((activeTab === "optimize" || activeTab === "cover-letter") && !jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/resume-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: activeTab,
          resumeText,
          jobDescription,
          companyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      switch (activeTab) {
        case "score":
          setScoreResult(data);
          break;
        case "optimize":
          setOptimizeResult(data);
          break;
        case "cover-letter":
          setCoverLetter(data.coverLetter);
          break;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function downloadAsPdf(content: string, filename: string) {
    // Create a printable HTML document and trigger print/save as PDF
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>${filename}</title>
      <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;white-space:pre-wrap;}</style>
      </head><body>${content.replace(/\n/g, "<br>")}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            AI Resume Tools
          </h1>
          <p className="mt-2 text-neutral-600">
            Score your resume, optimize it for a job, or generate a cover letter.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-neutral-200">
          {[
            { id: "score" as Tab, label: "Resume Score" },
            { id: "optimize" as Tab, label: "Optimize for Job" },
            { id: "cover-letter" as Tab, label: "Cover Letter" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(""); }}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors min-h-[44px] ${
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-700 border-b-2 border-primary-600"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Paste Your Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                placeholder="Paste your full resume text here..."
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>

            {(activeTab === "optimize" || activeTab === "cover-letter") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Paste Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    placeholder="Paste the full job description here..."
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  />
                </div>
                {activeTab === "cover-letter" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Company Name (optional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google, Infosys"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
                    />
                  </div>
                )}
              </>
            )}

            {error && (
              error === "trial_expired" ? (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 space-y-2" role="alert">
                  <p className="font-semibold flex items-center gap-1">🔒 Pro Features Locked</p>
                  <p>Your 7-day free trial has expired. Subscribe to DecaJobs Pro to get unlimited access to all AI tools (Resume Analyzer, Job Optimizer, Cover Letter Generator) and daily morning job matches.</p>
                  <div>
                    <Link href="/subscribe" className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 min-h-[36px]">
                      Subscribe to Pro →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-600" role="alert">{error}</p>
              )
            )}

            <Button onClick={handleSubmit} isLoading={isLoading} size="lg" className="w-full sm:w-auto">
              {activeTab === "score" && "Analyze Resume"}
              {activeTab === "optimize" && "Optimize Resume"}
              {activeTab === "cover-letter" && "Generate Cover Letter"}
            </Button>
          </div>
        </Card>

        {/* Score Results */}
        {activeTab === "score" && scoreResult && (
          <Card padding="lg">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-neutral-600">Overall Resume Score</p>
                <p className={`text-5xl font-bold ${getScoreColor(scoreResult.score)}`}>
                  {scoreResult.score}/100
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {scoreResult.sections.map((section) => (
                  <div key={section.name} className="rounded-lg border border-neutral-200 p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{section.name}</span>
                      <span className={`text-sm font-bold ${getScoreColor(section.score)}`}>
                        {section.score}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">{section.feedback}</p>
                  </div>
                ))}
              </div>

              <div>
                <CardTitle className="mb-3">Suggestions to Improve</CardTitle>
                <ul className="space-y-2">
                  {scoreResult.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-2 text-sm text-neutral-700">
                      <span className="text-primary-600 shrink-0">💡</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Optimize Results */}
        {activeTab === "optimize" && optimizeResult && (
          <Card padding="lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Optimized Resume</CardTitle>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${getScoreColor(optimizeResult.matchScore)}`}>
                    Match: {optimizeResult.matchScore}%
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadAsPdf(optimizeResult.optimizedResume, "Optimized_Resume")}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">Changes Made:</p>
                <ul className="space-y-1">
                  {optimizeResult.changes.map((change, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-green-600">✓</span> {change}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-neutral-200 p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-neutral-800 whitespace-pre-wrap font-sans">
                  {optimizeResult.optimizedResume}
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* Cover Letter Results */}
        {activeTab === "cover-letter" && coverLetter && (
          <Card padding="lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Your Cover Letter</CardTitle>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => downloadAsPdf(coverLetter, "Cover_Letter")}
                >
                  Download PDF
                </Button>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <pre className="text-sm text-neutral-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {coverLetter}
                </pre>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
