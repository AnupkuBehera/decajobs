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

      let data: any;
      try {
        data = await response.json();
      } catch {
        if (response.status === 504 || response.status === 502) {
          setError("Analysis timed out. The AI took too long to respond. Please try again with a shorter resume text, or sign up for a free account.");
        } else {
          setError("Server returned an invalid response. Please try again later.");
        }
        return;
      }

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || "Rate limit exceeded. The free AI tool is currently busy. Please wait a minute or sign up for a free account to get immediate access.");
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

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Complete Guide: How to Pass the ATS Resume Test</h2>
          <p className="text-neutral-600 leading-relaxed">
            Over 95% of Fortune 500 companies use an Applicant Tracking System (ATS) to filter resumes before a recruiter ever looks at them. If your resume isn&apos;t formatted and optimized for these scanners, your application might be rejected automatically.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">What is an Applicant Tracking System (ATS)?</h3>
          <p className="text-neutral-600 leading-relaxed">
            An ATS is a software application that handles the recruitment process, including sorting and ranking job applications. It scans resumes for specific keywords, job titles, education, and skills. Resumes that match the job description closely are passed to the hiring manager, while low-scoring resumes are filtered out.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">How DecaJobs AI Resume Checker Works</h3>
          <p className="text-neutral-600 leading-relaxed">
            Our AI Resume Checker simulates how modern ATS scanners read your CV. It evaluates:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Keyword Density:</strong> Checks for essential skills and industry terms that match common job postings.</li>
            <li><strong>Structure & Readability:</strong> Ensures sections (Education, Experience, Skills) are clearly demarcated.</li>
            <li><strong>Impact Metrics:</strong> Looks for action verbs and quantifiable results (e.g., percentages, revenue, time saved).</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Essential Tips to Optimize Your Resume</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Use standard section headings</h4>
              <p className="text-sm text-neutral-600 mt-1">Stick to simple titles like &quot;Work Experience,&quot; &quot;Education,&quot; &quot;Skills,&quot; and &quot;Summary.&quot; Creative titles like &quot;My Professional Journey&quot; confuse the parser.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Tailor keywords for every job</h4>
              <p className="text-sm text-neutral-600 mt-1">Read the target job description carefully. Integrate the exact phrases and skills mentioned (e.g., if it says &quot;SQL Database Management,&quot; don&apos;t just write &quot;SQL&quot;).</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Avoid graphs, images, and tables</h4>
              <p className="text-sm text-neutral-600 mt-1">Many older ATS systems cannot parse text inside tables, text boxes, or images. Stick to a single-column clean layout.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">4. Focus on measurable achievements</h4>
              <p className="text-sm text-neutral-600 mt-1">Instead of listing responsibilities, write about accomplishments. Use the formula: <strong>Action Verb + Task + Measurable Outcome</strong>.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">5. Choose the right file format</h4>
              <p className="text-sm text-neutral-600 mt-1">A PDF is generally best to preserve formatting, but check the job portal guidelines. Some legacy systems prefer Microsoft Word (.docx).</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4">
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                What is a good ATS resume score?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                A score of 80 or above is considered excellent. It means your resume has good formatting, uses strong action verbs, includes relevant keywords, and contains quantifiable achievements.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                Will a creative resume format help?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                Unless you are applying for a highly visual role (like graphic designer or artist) where a portfolio is sent separately, creative layouts often do more harm than good because they scramble ATS parsers. Simplicity wins.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How often should I update my resume?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                You should tailor your resume for every single job application to match that job&apos;s specific keywords. Keep a &quot;master resume&quot; containing all your projects, and pull from it to construct tailored versions.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
