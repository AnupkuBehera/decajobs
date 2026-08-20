"use client";

import { useState } from "react";
import Link from "next/link";
import * as gtag from "@/lib/gtag";

interface StickyApplyBarProps {
  jobTitle: string;
  company: string;
  applicationLink: string;
  slug: string;
}

export function StickyApplyBar({
  jobTitle,
  company,
  applicationLink,
  slug,
}: StickyApplyBarProps) {
  const [copied, setCopied] = useState(false);

  const handleApplyClick = () => {
    gtag.event("job_apply_click", {
      event_category: "job_engagement",
      event_label: jobTitle,
      company: company,
      slug: slug,
    });
  };

  const handleShareClick = async () => {
    gtag.event("job_share", {
      event_category: "job_engagement",
      event_label: jobTitle,
      slug: slug,
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${jobTitle} at ${company} | DecaJobs`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard if share dialog is cancelled/unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy link:", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 p-3 sm:p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-2 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-neutral-900 sm:text-sm">
            {jobTitle}
          </p>
          <p className="truncate text-[11px] text-neutral-500 sm:text-xs">
            {company} • <span className="text-primary-600 font-medium">Verified Posting</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShareClick}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[40px]"
            title="Share job link"
          >
            {copied ? "Link Copied! ✨" : "Share 🔗"}
          </button>

          <Link
            href="/login"
            className="hidden md:inline-flex items-center justify-center rounded-lg border border-primary-300 bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors min-h-[40px]"
          >
            Get Daily 10 Jobs 📩
          </Link>

          <a
            href={applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors min-h-[40px] sm:px-6 sm:text-sm"
          >
            Apply Now →
          </a>
        </div>
      </div>
    </div>
  );
}
