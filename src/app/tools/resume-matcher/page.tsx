"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ResumeMatcherPage() {
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
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-3">
            Free ATS Keyword Tool
          </span>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            AI Resume-to-Job Matcher
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            Find out how well your resume matches any job posting. Get your match score, missing ATS keywords, and AI-tailored bullet points instantly.
          </p>
        </div>

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
              {/* Missing Keywords */}
              <Card padding="lg">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Missing Keywords in Resume
                </h3>
                <p className="text-xs text-neutral-500 mb-3">Add these keywords to pass ATS screening filters:</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      + {kw}
                    </span>
                  ))}
                  {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                    <p className="text-xs text-neutral-500">No major missing keywords detected!</p>
                  )}
                </div>
              </Card>

              {/* Matching Keywords */}
              <Card padding="lg">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Found Keywords
                </h3>
                <p className="text-xs text-neutral-500 mb-3">Great job! These skills match the job description:</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Tailored Bullet Suggestions */}
            <Card padding="lg">
              <h3 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <span>💡</span> AI-Tailored Bullet Points for This Job
              </h3>
              <p className="text-xs text-neutral-600 mb-4">
                Copy and insert these bullet points into your resume to immediately boost your ATS score:
              </p>

              <div className="space-y-3">
                {result.tailoredBullets?.map((bullet: string, i: number) => (
                  <div key={i} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex items-start justify-between gap-3">
                    <p className="text-sm text-neutral-800 leading-relaxed font-mono text-xs">{bullet}</p>
                    <button
                      onClick={() => copyBullet(bullet, i)}
                      className="shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 bg-white px-2.5 py-1 rounded-md min-h-[36px] flex items-center"
                    >
                      {copiedIndex === i ? "Copied! ✓" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA Box */}
            <Card padding="lg" className="text-center bg-primary-50 border-primary-200">
              <h3 className="font-bold text-neutral-900 text-lg">Want 10 tailored jobs matched to your profile daily?</h3>
              <p className="mt-1 text-sm text-neutral-600 max-w-xl mx-auto">
                Sign up for DecaJobs to get your top 10 personalized job matches sent to your email every morning.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]"
              >
                Get 10 Daily Jobs Free →
              </Link>
            </Card>

            <button
              onClick={() => {
                setResult(null);
                setResumeText("");
                setJobDescription("");
              }}
              className="w-full text-center text-sm font-medium text-primary-600 hover:underline"
            >
              ← Match another job description
            </button>
          </div>
        )}

        {/* Complete Guide & SEO Content */}
        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Complete Guide: How to Tailor Your Resume for Any Job</h2>
          <p className="text-neutral-600 leading-relaxed">
            Applicant Tracking Systems (ATS) scan and rank your resume against specific keywords in the job description. If your resume lacks the exact hard skills, job titles, or tools mentioned in the posting, your application may be filtered out before a human recruiter ever sees it.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">How the DecaJobs AI Resume Matcher Works</h3>
          <p className="text-neutral-600 leading-relaxed">
            Our AI resume analyzer compares your resume against target job requirements in 3 key steps:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Keyword Extraction:</strong> Identifies core hard skills, certifications, and technical terms in the job description.</li>
            <li><strong>Gap Analysis:</strong> Highlights critical missing terms you should include in your skills or experience sections.</li>
            <li><strong>Impact Bullet Generation:</strong> Creates STAR-formatted (Situation, Task, Action, Result) accomplishment bullets matching the role.</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">3 Best Practices to Boost Your Resume Match Score</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Mirror the job title exactly</h4>
              <p className="text-sm text-neutral-600 mt-1">If the posting asks for "Senior Frontend Engineer," make sure your resume summary or title section includes that exact phrase rather than generic titles like "Developer."</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Include both acronyms and full terms</h4>
              <p className="text-sm text-neutral-600 mt-1">Write out both versions of key terms, e.g., "Search Engine Optimization (SEO)" or "AWS (Amazon Web Services)" so older and newer parsers catch it.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Quantify your accomplishments</h4>
              <p className="text-sm text-neutral-600 mt-1">Pair missing keywords with measurable outcomes (e.g., "Implemented CI/CD pipelines, reducing deployment times by 45%").</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
