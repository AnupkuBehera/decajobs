"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EmbedResumeCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const iframeSnippet = `<iframe src="https://decajob.com/embed/resume-checker" width="100%" height="650" style="border:1px solid #e5e7eb; border-radius:16px;" title="DecaJobs Free ATS Resume Checker"></iframe>`;

  async function handleAnalyze() {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError("Please paste at least 50 characters of your resume.");
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

  function copyEmbedCode() {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
            DJ
          </span>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 leading-tight">
              Free ATS Resume Checker
            </h1>
            <p className="text-[11px] text-neutral-500">2026 Recruiter Algorithm Audit</p>
          </div>
        </div>

        <button
          onClick={() => setShowEmbedCode(!showEmbedCode)}
          className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-lg transition-colors"
        >
          {showEmbedCode ? "Close Embed Code" : "&lt;/&gt; Embed Widget"}
        </button>
      </div>

      {/* Embed code snippet drawer */}
      {showEmbedCode && (
        <div className="mb-4 rounded-xl bg-neutral-900 p-3.5 text-neutral-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-neutral-400">
              Paste into your blog, portfolio, or bootcamp site:
            </span>
            <button
              onClick={copyEmbedCode}
              className="bg-primary-600 hover:bg-primary-700 text-white px-2.5 py-0.5 rounded text-[10px] font-bold"
            >
              {copiedEmbed ? "Copied!" : "Copy HTML"}
            </button>
          </div>
          <pre className="overflow-x-auto text-[11px] text-primary-300 font-mono p-1 bg-black/40 rounded">
            {iframeSnippet}
          </pre>
        </div>
      )}

      {/* Main Content */}
      {!result ? (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-neutral-700">
            Paste your resume text below:
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={8}
            placeholder="Paste your work experience, summary, and skills here..."
            className="w-full rounded-xl border border-neutral-300 p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}

          <Button
            onClick={handleAnalyze}
            isLoading={isLoading}
            size="md"
            className="w-full text-xs font-bold"
          >
            {isLoading ? "Analyzing Resume…" : "Score My Resume (Instant Free)"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-800">
                Your ATS Score
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-green-700">{result.score}</span>
                <span className="text-xs font-semibold text-green-600">/ 100</span>
              </div>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setResumeText("");
              }}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline"
            >
              Test Another
            </button>
          </div>

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="rounded-xl border border-neutral-200 p-3 space-y-1.5">
              <p className="text-xs font-bold text-neutral-900">💡 Top Optimization Tips</p>
              <ul className="text-xs text-neutral-700 space-y-1 pl-4">
                {result.suggestions.slice(0, 3).map((s: string, i: number) => (
                  <li key={i} className="list-disc">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href="https://decajob.com/resume-tools?tab=builder"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-4 text-xs font-bold transition-colors shadow-xs"
          >
            Fix Gaps with DecaJobs Free AI Resume Builder →
          </a>
        </div>
      )}

      {/* Attribution Footer (High Domain Authority Backlink) */}
      <div className="mt-5 border-t border-neutral-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
        <a
          href="https://decajob.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary-700 hover:underline flex items-center gap-1"
        >
          ⚡ Powered by DecaJobs AI
        </a>
        <span>Get 10 Curated Jobs in Your Inbox Daily</span>
      </div>
    </div>
  );
}
