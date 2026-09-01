"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareScoreModalProps {
  score: number;
  grade?: string;
  role?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareScoreModal({
  score,
  grade = "A+",
  role = "Software Engineer",
  isOpen,
  onClose,
}: ShareScoreModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Just tested my resume against 2026 ATS hiring algorithms on DecaJobs and scored ${score}/100 (Grade ${grade})! 🚀\n\nIt gave me instant feedback on quantifiable metric density and flagged keyword gaps for ${role} positions.\n\nTest your resume for free here 👉 https://decajob.com/tools/resume-checker\n\n#JobSearch #ATS #ResumeTips #CareerGrowth #Hiring #DecaJobs`;

  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-800 uppercase tracking-wider">
            🎉 Top 5% ATS Score Achievement
          </span>
          <h3 className="text-xl font-bold text-neutral-900 mt-2">
            Share Your Scorecard on LinkedIn
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Stand out to recruiters and inspire your professional network with your verified ATS score.
          </p>
        </div>

        {/* Visual Scorecard Preview */}
        <div className="my-5 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-950 p-6 text-white shadow-md relative overflow-hidden">
          {/* Background subtle design */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-primary-600/30 rounded-full blur-2xl" />

          <div className="flex items-center justify-between border-b border-primary-700/60 pb-3 mb-4">
            <span className="text-xs font-bold tracking-wider uppercase text-primary-200 flex items-center gap-1">
              ⚡ DecaJobs ATS Certified 2026
            </span>
            <span className="text-[11px] bg-primary-700/80 px-2 py-0.5 rounded text-white font-mono">
              Tested Today
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-primary-200">Role Target</p>
              <h4 className="text-lg font-black tracking-tight text-white mt-0.5">{role}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full font-semibold">
                  ✓ Recruiter Ready
                </span>
                <span className="text-[11px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                  ✓ High Metric Density
                </span>
              </div>
            </div>

            <div className="text-center shrink-0 bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-3 rounded-2xl">
              <span className="text-4xl font-black text-white">{score}</span>
              <span className="text-xs text-primary-200 font-bold block">/ 100</span>
              <span className="mt-1 inline-block text-[10px] font-bold bg-green-500 text-neutral-950 px-1.5 py-0.2 rounded uppercase">
                {grade}
              </span>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white py-3 px-4 text-sm font-bold transition-colors shadow-xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
            </svg>
            Share Achievement on LinkedIn
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 py-2.5 px-3 text-xs font-semibold transition-colors"
            >
              <span>𝕏</span> Share on X
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 py-2.5 px-3 text-xs font-semibold transition-colors"
            >
              {copied ? "✅ Copied!" : "📋 Copy Post Text"}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-neutral-400 mt-4">
          Each share brings fellow job seekers free access to DecaJobs AI tools and Daily 10 matches.
        </p>
      </div>
    </div>
  );
}
