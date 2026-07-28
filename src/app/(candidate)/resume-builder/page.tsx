"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ModernCleanTemplate from "@/components/templates/ModernCleanTemplate";
import type { ResumeContent } from "@/lib/gemini/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SavedResume {
  id: string;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}

type BuilderStep = "form" | "loading" | "preview";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  // Form state
  const [targetRole, setTargetRole] = useState("");
  const [rawDetails, setRawDetails] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");

  // Builder step
  const [step, setStep] = useState<BuilderStep>("form");
  const [resumeData, setResumeData] = useState<ResumeContent | null>(null);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Saved resumes list
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadedResume, setLoadedResume] = useState<ResumeContent | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  // ── API Calls ───────────────────────────────────────────────────────────────

  async function fetchSavedResumes() {
    setIsLoadingList(true);
    try {
      const res = await fetch("/api/resume-builder");
      if (res.ok) {
        const data = await res.json();
        setSavedResumes(data.resumes ?? []);
      }
    } catch {
      /* silent */
    } finally {
      setIsLoadingList(false);
    }
  }

  async function handleGenerate() {
    if (!targetRole.trim()) {
      setError("Please enter a target job title.");
      return;
    }
    if (rawDetails.trim().length < 50) {
      setError("Please paste at least 50 characters of your work history and skills.");
      return;
    }

    setError("");
    setStep("loading");
    setSavedResumeId(null);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawDetails: rawDetails.trim(),
          targetRole: targetRole.trim(),
          title: resumeTitle.trim() || `${targetRole.trim()} Resume`,
          save: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.");
        setStep("form");
        return;
      }

      setResumeData(data.data);
      setSavedResumeId(data.resumeId ?? null);
      setSaveStatus(data.resumeId ? "saved" : "idle");
      setStep("preview");
      // Refresh saved list
      fetchSavedResumes();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("form");
    }
  }

  async function handleDeleteResume(id: string) {
    if (!confirm("Delete this saved resume? This cannot be undone.")) return;
    try {
      await fetch(`/api/resume-builder?id=${id}`, { method: "DELETE" });
      setSavedResumes((prev) => prev.filter((r) => r.id !== id));
      if (savedResumeId === id) setSavedResumeId(null);
    } catch {
      /* silent */
    }
  }

  async function handleLoadResume(resumeId: string) {
    setIsLoadingResume(true);
    try {
      // Fetch full content by loading the resume (we store content in the table)
      const res = await fetch(`/api/resume-builder/load?id=${resumeId}`);
      if (res.ok) {
        const data = await res.json();
        setResumeData(data.content);
        setSavedResumeId(resumeId);
        setStep("preview");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      /* silent */
    } finally {
      setIsLoadingResume(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleReset() {
    setStep("form");
    setResumeData(null);
    setError("");
    setSaveStatus("idle");
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Print-only: hide everything except the resume template */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #resume-print-wrapper { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
          #resume-print-area { box-shadow: none !important; }
        }
      `}</style>

      {/* Resume template wrapper — only visible during print */}
      <div id="resume-print-wrapper" style={{ display: "none" }}>
        {resumeData && <ModernCleanTemplate data={resumeData} />}
      </div>

      {/* Main UI */}
      <div className="py-6 sm:py-10">
        <div className="mx-auto max-w-6xl px-4">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                ✨ AI Resume Builder
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                Gemini AI Powered
              </span>
            </div>
            <p className="mt-2 text-neutral-600 max-w-2xl">
              Paste your raw work history and skills. Our AI transforms it into a
              professional, ATS-optimised resume tailored to your target role — ready
              to download as PDF in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Left column: Form / Loading / Preview controls ── */}
            <div className="lg:col-span-2 space-y-6 print:hidden">

              {/* Form */}
              {step !== "preview" && (
                <Card padding="lg">
                  <h2 className="text-base font-semibold text-neutral-900 mb-4">
                    Build Your Resume
                  </h2>

                  <div className="space-y-4">
                    {/* Target role */}
                    <div>
                      <label
                        htmlFor="target-role"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Target Job Title *
                      </label>
                      <input
                        id="target-role"
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Senior Product Manager"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
                        disabled={step === "loading"}
                      />
                    </div>

                    {/* Resume title */}
                    <div>
                      <label
                        htmlFor="resume-title"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Resume Title (for saving)
                      </label>
                      <input
                        id="resume-title"
                        type="text"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        placeholder="e.g. PM Resume – Google 2026"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
                        disabled={step === "loading"}
                      />
                    </div>

                    {/* Raw details */}
                    <div>
                      <label
                        htmlFor="raw-details"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Work History, Skills & Projects *
                      </label>
                      <p className="text-xs text-neutral-500 mb-2">
                        Paste everything — job titles, companies, dates, key metrics, skills,
                        certifications, projects. The more detail, the better.
                      </p>
                      <textarea
                        id="raw-details"
                        value={rawDetails}
                        onChange={(e) => setRawDetails(e.target.value)}
                        rows={12}
                        placeholder={`Example:\nJohn Doe, john@email.com, +91 98765 43210, Bangalore\n\nSoftware Engineer at Infosys (2020–2023)\n- Led team of 5 on microservices migration\n- Reduced API latency by 40% using Redis caching\n- Stack: Node.js, TypeScript, PostgreSQL, Docker\n\nBTech Computer Science, VTU, 2020\n\nSkills: React, AWS, Python, Scrum`}
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                        disabled={step === "loading"}
                      />
                      <p className="mt-1.5 text-xs text-neutral-400 text-right">
                        {rawDetails.length} chars
                        {rawDetails.length < 50 && rawDetails.length > 0 && (
                          <span className="text-red-500 ml-1">(min 50)</span>
                        )}
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                        {error}
                      </p>
                    )}

                    <Button
                      onClick={handleGenerate}
                      isLoading={step === "loading"}
                      size="lg"
                      className="w-full"
                      id="generate-resume-btn"
                      disabled={step === "loading"}
                    >
                      {step === "loading" ? "Generating Resume…" : "✨ Generate AI Resume"}
                    </Button>
                    <p className="text-center text-xs text-neutral-400">
                      ⚡ Takes ~15–25 seconds · Auto-saved to your account
                    </p>
                  </div>
                </Card>
              )}

              {/* Preview controls */}
              {step === "preview" && (
                <Card padding="lg">
                  <h2 className="text-base font-semibold text-neutral-900 mb-4">
                    Your Resume is Ready!
                  </h2>

                  <div className="space-y-3">
                    <Button
                      onClick={handlePrint}
                      size="lg"
                      className="w-full"
                      id="download-pdf-btn"
                    >
                      🖨️ Download as PDF
                    </Button>
                    <p className="text-xs text-neutral-500 text-center">
                      In the print dialog, select &ldquo;Save as PDF&rdquo; and set margins to &ldquo;None&rdquo; or &ldquo;Minimum&rdquo;.
                    </p>

                    {saveStatus === "saved" && savedResumeId && (
                      <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-700 text-center">
                        ✅ Resume saved to your account
                      </div>
                    )}

                    <button
                      onClick={handleReset}
                      id="build-new-resume-btn"
                      className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline py-2"
                    >
                      ← Build another resume
                    </button>
                  </div>

                  {/* Tips */}
                  <div className="mt-5 border-t border-neutral-100 pt-4 space-y-2">
                    <p className="text-xs font-semibold text-neutral-700">💡 PDF Tips</p>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      <li>• Use Chrome or Edge for best PDF quality</li>
                      <li>• Set paper size to A4 or Letter</li>
                      <li>• Disable &ldquo;Headers and footers&rdquo; in print settings</li>
                    </ul>
                  </div>
                </Card>
              )}

              {/* Loading card */}
              {step === "loading" && (
                <Card padding="lg" className="text-center py-10">
                  <div className="flex justify-center mb-4">
                    <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
                  </div>
                  <p className="font-semibold text-neutral-800">AI is writing your resume…</p>
                  <div className="mt-3 space-y-1.5 text-xs text-neutral-500 max-w-xs mx-auto text-left">
                    <p>📝 Crafting professional summary…</p>
                    <p>💼 Writing achievement-focused bullets…</p>
                    <p>🎯 Optimising keywords for {targetRole}…</p>
                  </div>
                </Card>
              )}

              {/* Saved Resumes list */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-neutral-800 mb-3">
                  📁 My Saved Resumes
                </h3>
                {isLoadingList ? (
                  <p className="text-xs text-neutral-500 py-3 text-center">Loading…</p>
                ) : savedResumes.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-3 text-center">
                    No saved resumes yet. Generate one above!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {savedResumes.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 hover:border-primary-200 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 truncate">
                            {r.title}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {new Date(r.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleLoadResume(r.id)}
                            disabled={isLoadingResume}
                            className="text-[10px] font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 bg-white px-2 py-1 rounded min-h-[32px]"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteResume(r.id)}
                            className="text-[10px] font-semibold text-red-500 hover:text-red-700 border border-red-200 bg-white px-2 py-1 rounded min-h-[32px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* ── Right column: Resume preview ── */}
            <div className="lg:col-span-3">
              {step === "preview" && resumeData ? (
                <div className="rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                  {/* Preview toolbar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 print:hidden">
                    <span className="text-xs font-medium text-neutral-600">
                      Preview — Modern Clean Template
                    </span>
                    <Button
                      onClick={handlePrint}
                      size="sm"
                      id="preview-download-btn"
                    >
                      🖨️ Download PDF
                    </Button>
                  </div>
                  <div className="bg-white">
                    <ModernCleanTemplate data={resumeData} />
                  </div>
                </div>
              ) : step === "loading" ? (
                <div className="rounded-xl border border-neutral-200 bg-white min-h-[600px] flex items-center justify-center">
                  <div className="text-center text-neutral-400">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-sm">Resume preview will appear here…</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-white min-h-[600px] flex flex-col items-center justify-center text-center p-10">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-lg font-semibold text-neutral-700">
                    Your AI-generated resume will appear here
                  </p>
                  <p className="text-sm text-neutral-500 mt-2 max-w-sm">
                    Fill in your details and click &ldquo;Generate AI Resume&rdquo; to see a
                    professional, print-ready preview.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-neutral-600 max-w-sm">
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                      <div className="text-lg mb-1">🎯</div>
                      <p>ATS-optimised keywords</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                      <div className="text-lg mb-1">⚡</div>
                      <p>STAR-method bullet points</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                      <div className="text-lg mb-1">🖨️</div>
                      <p>One-click PDF download</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* SEO / Help content */}
          <div className="mt-14 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              How the DecaJobs AI Resume Builder Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-neutral-600">
              <div>
                <p className="font-semibold text-neutral-800 mb-1">1. Paste raw details</p>
                <p>Add your work history, skills, education and metrics in any format — even messy notes work.</p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800 mb-1">2. AI writes your resume</p>
                <p>Gemini AI structures everything into a professional resume with achievement-focused bullet points and ATS keywords for your target role.</p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800 mb-1">3. Download as PDF</p>
                <p>Preview the clean layout in your browser and save it as a print-ready PDF — no account required for download.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
