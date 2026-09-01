"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ModernCleanTemplate from "@/components/templates/ModernCleanTemplate";
import TechMinimalistTemplate from "@/components/templates/TechMinimalistTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import CompactTemplate from "@/components/templates/CompactTemplate";
import {
  PREFILLED_TEMPLATES,
  getTemplateBySlug,
  getTemplateByRole,
} from "@/lib/resume/prefilled-templates";
import { calculateAtsScore } from "@/lib/resume/ats-scorer";
import { ShareScoreModal } from "@/components/share-score-modal";
import type { ResumeContent } from "@/lib/gemini/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SavedResume {
  id: string;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
}

type ResumeTheme = "modern" | "tech" | "executive" | "compact";
type ActiveEditTab = "customize" | "ai-prompt";

// ── Main Component ────────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  // Active template role
  const [selectedSlug, setSelectedSlug] = useState<string>("software-engineer");

  // Selected visual theme
  const [selectedTheme, setSelectedTheme] = useState<ResumeTheme>("modern");

  // Edit mode tab
  const [editTab, setEditTab] = useState<ActiveEditTab>("customize");

  // Resume state - pre-initialized with the default template
  const [resumeData, setResumeData] = useState<ResumeContent>(
    PREFILLED_TEMPLATES[0].data
  );

  // Form fields for AI generation prompt
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [rawDetails, setRawDetails] = useState("");
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [tailoringInfo, setTailoringInfo] = useState<{ role?: string; company?: string } | null>(null);

  // Status & saving
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Saved resumes list
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingResume, setIsLoadingResume] = useState(false);

  // Real-time ATS score calculation
  const atsScore = useMemo(() => calculateAtsScore(resumeData), [resumeData]);

  // Initial load from URL query params
  useEffect(() => {
    fetchSavedResumes();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const templateParam = params.get("template");
      const roleParam = params.get("role");
      const companyParam = params.get("company");
      const descParam = params.get("desc");

      if (templateParam) {
        const found = getTemplateBySlug(templateParam);
        if (found) {
          loadPrefilledTemplate(found.slug);
          return;
        }
      }

      if (roleParam) {
        setTargetRole(roleParam);
        setResumeTitle(`${roleParam}${companyParam ? ` – ${companyParam}` : ""} Resume`);
        setTailoringInfo({ role: roleParam, company: companyParam || undefined });

        const matched = getTemplateByRole(roleParam);
        loadPrefilledTemplate(matched.slug);

        if (descParam) {
          setRawDetails(
            `Target Role Requirements (${roleParam} at ${companyParam || "Company"}):\n${descParam}\n\nCandidate Experience & Skills:\n`
          );
        }
      }
    }
  }, []);

  // ── Template Loading ────────────────────────────────────────────────────────

  function loadPrefilledTemplate(slug: string) {
    const template = getTemplateBySlug(slug);
    if (!template) return;

    setSelectedSlug(slug);
    // Deep clone data to allow local mutations without modifying constant
    setResumeData(JSON.parse(JSON.stringify(template.data)));
    setTargetRole(template.title);
    setResumeTitle(`${template.title} Resume 2026`);
    setError("");
  }

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

  async function handleAIGenerate() {
    if (!targetRole.trim()) {
      setError("Please enter a target job title.");
      return;
    }
    if (rawDetails.trim().length < 50) {
      setError("Please paste at least 50 characters of your work history, skills, or job description.");
      return;
    }

    setError("");
    setIsGenerating(true);
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
        return;
      }

      setResumeData(data.data);
      setSavedResumeId(data.resumeId ?? null);
      setSaveStatus(data.resumeId ? "saved" : "idle");
      setEditTab("customize");
      fetchSavedResumes();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleLoadResume(resumeId: string) {
    setIsLoadingResume(true);
    try {
      const res = await fetch(`/api/resume-builder/load?id=${resumeId}`);
      if (res.ok) {
        const data = await res.json();
        setResumeData(data.content);
        setSavedResumeId(resumeId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      /* silent */
    } finally {
      setIsLoadingResume(false);
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

  // ── Actions ─────────────────────────────────────────────────────────────────

  function handlePrint() {
    window.print();
  }

  function handleCopyPlainText() {
    if (!resumeData) return;
    const p = resumeData.personalInfo;
    const lines: string[] = [
      p.fullName.toUpperCase(),
      p.headline,
      [p.email, p.phone, p.location, p.linkedinUrl].filter(Boolean).join(" | "),
      "",
      "PROFESSIONAL SUMMARY",
      "----------------------------------------",
      resumeData.professionalSummary,
      "",
      "WORK EXPERIENCE",
      "----------------------------------------",
      ...resumeData.workExperience.flatMap((exp) => [
        `${exp.jobTitle} - ${exp.company} (${exp.startDate} - ${exp.endDate})`,
        ...exp.highlights.map((h) => `• ${h}`),
        "",
      ]),
      "TECHNICAL SKILLS",
      "----------------------------------------",
      ...resumeData.skillCategories.map((sc) => `${sc.categoryName}: ${sc.skills.join(", ")}`),
      "",
      "EDUCATION & CERTIFICATIONS",
      "----------------------------------------",
      ...resumeData.education.map((e) => `${e.degree}, ${e.institution} (${e.completionDate})`),
      ...resumeData.certifications.map((c) => `${c.name} - ${c.issuer} (${c.year})`),
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  }

  // ── Helper to render the active theme ───────────────────────────────────────

  function renderTemplate(theme: ResumeTheme, data: ResumeContent) {
    switch (theme) {
      case "tech":
        return <TechMinimalistTemplate data={data} />;
      case "executive":
        return <ExecutiveTemplate data={data} />;
      case "compact":
        return <CompactTemplate data={data} />;
      case "modern":
      default:
        return <ModernCleanTemplate data={data} />;
    }
  }

  return (
    <>
      {/* Print-only wrapper: hides all UI elements during window.print() */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #resume-print-wrapper { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
          #resume-print-area { box-shadow: none !important; }
        }
      `}</style>

      <div id="resume-print-wrapper" style={{ display: "none" }}>
        {renderTemplate(selectedTheme, resumeData)}
      </div>

      <div className="space-y-6 print:hidden">

        {/* ── 1. Role Templates Horizontal Pill Carousel ── */}
        <div className="rounded-2xl border border-primary-200/80 bg-gradient-to-r from-primary-50/70 via-white to-blue-50/70 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                  ⚡ 1-Click Starter Templates
                </span>
                <span className="text-xs text-neutral-500 hidden sm:inline">
                  Recruiter-tested & ATS 95%+ prefilled
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 mt-1">
                Select Your Role to Pre-fill Instant ATS-Optimized Content
              </h2>
            </div>
            <span className="text-xs font-semibold text-primary-700 bg-white border border-primary-200 px-3 py-1.5 rounded-lg shrink-0">
              8 Professional Roles Ready
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
            {PREFILLED_TEMPLATES.map((t) => {
              const isSelected = selectedSlug === t.slug;
              return (
                <button
                  key={t.slug}
                  onClick={() => loadPrefilledTemplate(t.slug)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-primary-600 text-white shadow-sm ring-2 ring-primary-600 ring-offset-1"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50"
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span>{t.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? "bg-primary-700 text-white" : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {t.atsScoreEstimate}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Studio Layout: Form/Editor on Left, Sticky Live Preview on Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Left Column: Edit Controls & ATS Scoring (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* ATS Score & Health Gauge Card */}
            <Card padding="md" className="border-green-200 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white font-black text-lg shadow-sm">
                    {atsScore.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-800">
                        ATS Health Score
                      </span>
                      <span className="rounded bg-green-200/80 px-1.5 py-0.5 text-[10px] font-bold text-green-900">
                        Grade {atsScore.grade}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {atsScore.metricsCount} metrics (%, $, #) · {atsScore.actionVerbsCount} power action verbs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="rounded-lg bg-primary-600 hover:bg-primary-700 text-white px-2.5 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    title="Share your ATS score on LinkedIn"
                  >
                    <span>🚀</span> Share
                  </button>
                  <button
                    onClick={handlePrint}
                    className="rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 py-1.5 text-xs font-semibold transition-colors"
                  >
                    🖨️ PDF
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-green-100">
                <div
                  className="h-full bg-green-600 transition-all duration-500 rounded-full"
                  style={{ width: `${atsScore.score}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="mt-3.5 space-y-1.5 border-t border-green-100 pt-3">
                {atsScore.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      <span>{check.passed ? "✅" : "⚠️"}</span>
                      <span>{check.name}</span>
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500 font-medium">
                      +{check.points} pts
                    </span>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              {atsScore.suggestions.length > 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800">
                  <span className="font-bold">Pro Tip: </span>
                  {atsScore.suggestions[0]}
                </div>
              )}
            </Card>

            {/* Editor Mode Tabs */}
            <div className="flex rounded-xl bg-neutral-100 p-1 border border-neutral-200">
              <button
                onClick={() => setEditTab("customize")}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  editTab === "customize"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                ✏️ Customize Content (Live)
              </button>
              <button
                onClick={() => setEditTab("ai-prompt")}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  editTab === "ai-prompt"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                ✨ AI Tailor / Rewrite
              </button>
            </div>

            {/* ── Tab 1: Live Interactive Section Customizer ── */}
            {editTab === "customize" && (
              <Card padding="md" className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Edit Your Details (Real-time Preview)
                  </h3>
                  <span className="text-[11px] text-neutral-400">Updates live ⚡</span>
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    1. Contact & Identity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Professional Headline</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.headline}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, headline: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedinUrl || ""}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedinUrl: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    2. Professional Summary
                  </h4>
                  <textarea
                    rows={4}
                    value={resumeData.professionalSummary}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        professionalSummary: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-2.5 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-primary-500 leading-relaxed"
                  />
                </div>

                {/* Experience Highlights Quick Edit */}
                <div className="space-y-3 border-t border-neutral-100 pt-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      3. Recent Work Experience
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      {resumeData.workExperience.length} positions
                    </span>
                  </div>

                  {resumeData.workExperience.map((exp, expIdx) => (
                    <div key={expIdx} className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const updated = [...resumeData.workExperience];
                              updated[expIdx].jobTitle = e.target.value;
                              setResumeData({ ...resumeData, workExperience: updated });
                            }}
                            className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...resumeData.workExperience];
                              updated[expIdx].company = e.target.value;
                              setResumeData({ ...resumeData, workExperience: updated });
                            }}
                            className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900"
                          />
                        </div>
                      </div>

                      {/* Highlight bullets */}
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-1">
                          Key Achievements (Include %, $, numbers)
                        </label>
                        <div className="space-y-1.5">
                          {exp.highlights.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="flex items-center gap-1.5">
                              <span className="text-neutral-400 text-xs">•</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const updatedExp = [...resumeData.workExperience];
                                  updatedExp[expIdx].highlights[bulletIdx] = e.target.value;
                                  setResumeData({ ...resumeData, workExperience: updatedExp });
                                }}
                                className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills categories preview */}
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    4. Technical & Core Skills
                  </h4>
                  {resumeData.skillCategories.map((sc, scIdx) => (
                    <div key={scIdx} className="rounded-lg border border-neutral-200 bg-white p-2.5">
                      <span className="block text-[11px] font-bold text-neutral-800 mb-1">
                        {sc.categoryName}
                      </span>
                      <input
                        type="text"
                        value={sc.skills.join(", ")}
                        onChange={(e) => {
                          const updatedSc = [...resumeData.skillCategories];
                          updatedSc[scIdx].skills = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          setResumeData({ ...resumeData, skillCategories: updatedSc });
                        }}
                        className="w-full rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Tab 2: AI Tailor & Generator ── */}
            {editTab === "ai-prompt" && (
              <Card padding="md" className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">
                    AI Resume Tailoring Engine
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Paste a target job description or your unformatted notes to rewrite achievements with Gemini AI.
                  </p>
                </div>

                {tailoringInfo && (
                  <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3 text-xs text-teal-800 flex items-start gap-2">
                    <span className="text-base">🎯</span>
                    <div>
                      <p className="font-semibold">
                        Tailoring for {tailoringInfo.role} {tailoringInfo.company ? `at ${tailoringInfo.company}` : ""}
                      </p>
                      <p className="text-teal-700 mt-0.5">
                        Our AI prioritizes keywords, action verbs, and quantify achievements for this job.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Target Job Title *
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Architect"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Paste Job Description or Work Experience Notes *
                  </label>
                  <textarea
                    rows={8}
                    value={rawDetails}
                    onChange={(e) => setRawDetails(e.target.value)}
                    placeholder="Paste job posting requirements or raw notes from your work history..."
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400 text-right">
                    {rawDetails.length} characters (min 50)
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleAIGenerate}
                  isLoading={isGenerating}
                  size="md"
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Rewriting with AI…" : "✨ Generate AI-Tailored Resume"}
                </Button>
              </Card>
            )}

            {/* Saved Resumes List */}
            <Card padding="md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                📁 Saved Resumes ({savedResumes.length})
              </h3>
              {isLoadingList ? (
                <p className="text-xs text-neutral-400 text-center py-2">Loading saved resumes…</p>
              ) : savedResumes.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-2">
                  No saved resumes yet. Sign in or save above to access anytime.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {savedResumes.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs hover:border-primary-300 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-800 truncate">{r.title}</p>
                        <p className="text-[10px] text-neutral-400">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleLoadResume(r.id)}
                          disabled={isLoadingResume}
                          className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 bg-white border border-neutral-200 px-2 py-0.5 rounded"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteResume(r.id)}
                          className="text-[11px] font-semibold text-red-500 hover:text-red-700 bg-white border border-neutral-200 px-1.5 py-0.5 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── Right Column: Sticky Live Preview & Theme Toolbar (7 cols) ── */}
          <div className="lg:col-span-7 space-y-4">

            {/* Daily 10 Matching Conversion Banner */}
            <div className="rounded-2xl border border-primary-300 bg-gradient-to-r from-primary-600 to-indigo-700 p-4 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full mb-1">
                  🎯 Guaranteed Daily 10 Matches
                </span>
                <h3 className="text-sm sm:text-base font-bold">
                  Your resume matches 80+ live jobs today
                </h3>
                <p className="text-xs text-primary-100 mt-0.5">
                  Wake up to 10 curated matches tailored to {resumeData.personalInfo.headline.split("|")[0].trim() || "your role"} at 8:00 AM.
                </p>
              </div>
              <Link
                href={`/login?role=${encodeURIComponent(targetRole)}`}
                className="shrink-0 rounded-xl bg-white text-primary-700 hover:bg-neutral-100 font-bold px-4 py-2 text-xs text-center transition-colors shadow-xs"
              >
                Receive Daily 10 Jobs →
              </Link>
            </div>

            {/* Theme Selector & Export Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-600 mr-1 hidden sm:inline">Theme:</span>
                <button
                  onClick={() => setSelectedTheme("modern")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedTheme === "modern"
                      ? "bg-white text-primary-700 shadow-xs border border-primary-200 font-bold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Modern Clean
                </button>
                <button
                  onClick={() => setSelectedTheme("tech")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedTheme === "tech"
                      ? "bg-white text-primary-700 shadow-xs border border-primary-200 font-bold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Tech Minimal
                </button>
                <button
                  onClick={() => setSelectedTheme("executive")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedTheme === "executive"
                      ? "bg-white text-primary-700 shadow-xs border border-primary-200 font-bold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Executive
                </button>
                <button
                  onClick={() => setSelectedTheme("compact")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedTheme === "compact"
                      ? "bg-white text-primary-700 shadow-xs border border-primary-200 font-bold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Compact (1-Page)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPlainText}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {copySuccess ? "✅ Copied!" : "📋 Copy Plain Text"}
                </button>
                <Button
                  onClick={handlePrint}
                  size="sm"
                  id="preview-download-btn"
                  className="shadow-xs"
                >
                  🖨️ Download PDF
                </Button>
              </div>
            </div>

            {/* Live Interactive Paper Rendering */}
            <div className="rounded-2xl border border-neutral-300/80 bg-white shadow-md overflow-hidden">
              <div className="border-b border-neutral-200 bg-neutral-100/80 px-4 py-2 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Live Preview: {selectedTheme.toUpperCase()} Layout
                </span>
                <span>Paper Size: A4 / US Letter Ready</span>
              </div>

              <div className="p-2 sm:p-4 bg-neutral-100/50">
                <div className="bg-white rounded shadow-xs">
                  {renderTemplate(selectedTheme, resumeData)}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <ShareScoreModal
        score={atsScore.score}
        grade={atsScore.grade}
        role={targetRole}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
