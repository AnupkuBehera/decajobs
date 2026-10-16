"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { InterviewerPersona } from "@/lib/interview/personas";

export interface ScorecardData {
  readinessScore: number;
  hireDecision: string;
  radarScores: {
    technical: number;
    starStructure: number;
    communication: number;
    confidence: number;
  };
  keyStrengths: string[];
  topActionItems: string[];
  executiveSummary: string;
}

interface PerformanceScorecardProps {
  scorecard: ScorecardData;
  persona: InterviewerPersona;
  jobTitle: string;
  completedQuestions: any[];
  onRestart: () => void;
}

export function PerformanceScorecard({
  scorecard,
  persona,
  jobTitle,
  completedQuestions,
  onRestart,
}: PerformanceScorecardProps) {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getDecisionBadge = (decision: string) => {
    if (decision.includes("Strong Hire")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
    if (decision.includes("Hire")) {
      return "bg-green-100 text-green-800 border-green-300";
    }
    if (decision.includes("Leaning")) {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    return "bg-rose-100 text-rose-800 border-rose-300";
  };

  const handleCopyReport = () => {
    const text = `DecaJobs AI Mock Interview Scorecard
Role: ${jobTitle}
Interviewer: ${persona.name} (${persona.role})
Readiness Score: ${scorecard.readinessScore}/100 (${scorecard.hireDecision})

Executive Summary:
${scorecard.executiveSummary}

Key Strengths:
${scorecard.keyStrengths.map((s) => `• ${s}`).join("\n")}

Top Action Items for Improvement:
${scorecard.topActionItems.map((a) => `• ${a}`).join("\n")}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 border border-primary-200/60">
              <span>🎯</span> Official AI Mock Interview Scorecard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {jobTitle} Interview Evaluation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Evaluated by {persona.name} · {persona.role} ({persona.companyArchetype})
            </p>
          </div>

          {/* Readiness Score Dial */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-5 shadow-lg min-w-[140px] shrink-0">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {scorecard.readinessScore}%
            </span>
            <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mt-0.5">
              Hire Readiness
            </span>
            <span
              className={`mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full border ${getDecisionBadge(
                scorecard.hireDecision
              )}`}
            >
              {scorecard.hireDecision}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6 rounded-2xl bg-neutral-50 p-5 border border-neutral-150">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
            Interviewer Feedback &amp; Summary
          </h3>
          <p className="text-sm leading-relaxed text-neutral-700">
            &ldquo;{scorecard.executiveSummary}&rdquo;
          </p>
        </div>

        {/* Radar Metrics Breakdown */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-neutral-150 bg-white p-3.5 text-center">
            <div className="text-xl font-bold text-primary-600">
              {scorecard.radarScores.technical}%
            </div>
            <div className="text-xs font-medium text-neutral-600 mt-0.5">Technical Depth</div>
          </div>
          <div className="rounded-xl border border-neutral-150 bg-white p-3.5 text-center">
            <div className="text-xl font-bold text-emerald-600">
              {scorecard.radarScores.starStructure}%
            </div>
            <div className="text-xs font-medium text-neutral-600 mt-0.5">STAR Structure</div>
          </div>
          <div className="rounded-xl border border-neutral-150 bg-white p-3.5 text-center">
            <div className="text-xl font-bold text-indigo-600">
              {scorecard.radarScores.communication}%
            </div>
            <div className="text-xs font-medium text-neutral-600 mt-0.5">Communication</div>
          </div>
          <div className="rounded-xl border border-neutral-150 bg-white p-3.5 text-center">
            <div className="text-xl font-bold text-amber-600">
              {scorecard.radarScores.confidence}%
            </div>
            <div className="text-xs font-medium text-neutral-600 mt-0.5">Confidence &amp; Pace</div>
          </div>
        </div>

        {/* Strengths & Action Items */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5">
              <span>✓</span> Confirmed Strengths
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
              {scorecard.keyStrengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
              <span>⚠️</span> Priority Action Items to Polish
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-amber-950">
              {scorecard.topActionItems.map((a, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transcript & Detailed Q&A Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            Interview Transcript &amp; Answer Breakdown
          </h3>
          <span className="text-xs text-neutral-500">
            {completedQuestions.length} questions completed
          </span>
        </div>

        {completedQuestions.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-neutral-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-700">
                      Q{index + 1}
                    </span>
                    <span className="text-xs font-medium capitalize text-neutral-500">
                      {item.question?.questionType || "General"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-neutral-900">
                    {item.question?.question}
                  </h4>
                </div>

                <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700 border border-primary-200">
                  {item.evaluation?.score}/10
                </span>
              </div>

              {/* Candidate's answer */}
              <div className="mt-3 rounded-xl bg-neutral-50 p-3 text-xs sm:text-sm text-neutral-700 border border-neutral-100">
                <span className="font-semibold text-neutral-900 block mb-1">Your Answer:</span>
                <p className="italic">{item.answer}</p>
                {item.evaluation?.fillerCount > 0 && (
                  <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    {item.evaluation.fillerCount} filler words detected
                  </span>
                )}
              </div>

              {/* Feedback toggle */}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-neutral-600 line-clamp-1">
                  {item.evaluation?.overallFeedback}
                </p>
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="text-xs font-bold text-primary-600 hover:text-primary-800 shrink-0 ml-2"
                >
                  {isExpanded ? "Hide Details ↑" : "View Feedback & Ideal Answer ↓"}
                </button>
              </div>

              {/* Expanded Feedback & Ideal Answer */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 animate-fade-in text-xs sm:text-sm">
                  {item.evaluation?.starBreakdown && (
                    <div className="rounded-xl border border-neutral-200 bg-white p-3 space-y-1.5 text-xs">
                      <span className="font-bold text-neutral-800 uppercase tracking-wider block text-[10px]">
                        STAR Structure Assessment
                      </span>
                      <p>
                        <strong className="text-neutral-900">Situation:</strong>{" "}
                        {item.evaluation.starBreakdown.situation}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Task:</strong>{" "}
                        {item.evaluation.starBreakdown.task}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Action:</strong>{" "}
                        {item.evaluation.starBreakdown.action}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Result:</strong>{" "}
                        {item.evaluation.starBreakdown.result}
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                    <span className="font-bold text-emerald-900 block text-xs mb-1">
                      Ideal Sample Answer:
                    </span>
                    <p className="text-xs text-emerald-950 italic">
                      &ldquo;{item.evaluation?.sampleAnswer}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
        <Button onClick={onRestart} variant="outline" className="text-xs sm:text-sm font-semibold">
          ↺ Practice Another Role
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopyReport}
            variant="outline"
            className="text-xs sm:text-sm font-semibold"
          >
            {copied ? "✓ Copied to Clipboard" : "📋 Copy Scorecard"}
          </Button>
          <Link
            href="/jobs"
            className="rounded-xl bg-primary-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-primary-700"
          >
            Apply to Curated Jobs →
          </Link>
        </div>
      </div>
    </div>
  );
}
