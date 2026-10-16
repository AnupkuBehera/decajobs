"use client";

import { useState } from "react";
import Link from "next/link";
import * as gtag from "@/lib/gtag";

interface BlogInteractiveBridgeProps {
  category: string;
  articleTitle: string;
}

export function BlogInteractiveBridge({
  category,
  articleTitle,
}: BlogInteractiveBridgeProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isInterview =
    category.toLowerCase().includes("interview") ||
    articleTitle.toLowerCase().includes("interview") ||
    articleTitle.toLowerCase().includes("gap");

  const isResume =
    category.toLowerCase().includes("resume") ||
    articleTitle.toLowerCase().includes("resume") ||
    articleTitle.toLowerCase().includes("cv");

  const isSalary =
    category.toLowerCase().includes("salary") ||
    articleTitle.toLowerCase().includes("salary") ||
    articleTitle.toLowerCase().includes("negotiat");

  let toolConfig = {
    emoji: "🌍",
    badge: "Recommended Tool",
    title: "Browse Curated Remote Jobs for 2026",
    desc: "Discover verified work-from-anywhere openings with real salary ranges and high trust scores.",
    link: "/jobs/remote",
    cta: "Explore Remote Openings →",
  };

  if (isInterview) {
    toolConfig = {
      emoji: "🎯",
      badge: "Interactive AI Simulator",
      title: "Practice Career Gap & Behavioral Questions",
      desc: "Get instant AI feedback on your answers, STAR scripts, and tough questions asked by real recruiters.",
      link: "/tools/interview-questions",
      cta: "Launch AI Interview Practice →",
    };
  } else if (isResume) {
    toolConfig = {
      emoji: "📄",
      badge: "Free ATS Scanner",
      title: "Scan Your Resume for Missing Keywords",
      desc: "Check your resume score out of 100 against real job descriptions and fix ATS disqualifiers.",
      link: "/tools/ats-keyword-scanner",
      cta: "Score My Resume Free →",
    };
  } else if (isSalary) {
    toolConfig = {
      emoji: "💰",
      badge: "Instant Calculator",
      title: "Calculate Exact In-Hand Take Home Salary",
      desc: "Compare New vs Old Tax Regimes in India, EPF deductions, or convert UAE & UK expat salaries.",
      link: "/tools/in-hand-salary-calculator",
      cta: "Calculate Monthly Pay →",
    };
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    gtag.trackLead("email", "blog_in_article_bridge", { article: articleTitle });

    try {
      await fetch("/api/candidate/quick-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: email, channel: "email" }),
      });
    } catch (err) {
      console.warn("[BlogBridge] Subscription network error:", err);
    } finally {
      setLoading(false);
      setSubscribed(true);
    }
  };

  return (
    <div className="my-10 space-y-6">
      {/* Contextual Career Tool Card */}
      <div className="rounded-2xl border-2 border-primary-100 bg-gradient-to-br from-primary-50/80 via-white to-neutral-50 p-6 sm:p-7 shadow-sm transition-all hover:border-primary-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-2xl text-white shadow-md shadow-primary-200">
              {toolConfig.emoji}
            </div>
            <div>
              <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-bold text-primary-800">
                {toolConfig.badge}
              </span>
              <h3 className="mt-1 text-base sm:text-lg font-bold text-neutral-900">
                {toolConfig.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-xl">
                {toolConfig.desc}
              </p>
            </div>
          </div>
          <Link
            href={toolConfig.link}
            onClick={() => gtag.trackToolUse(toolConfig.title)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-primary-700 transition-colors shadow-sm shrink-0 min-h-[44px]"
          >
            {toolConfig.cta}
          </Link>
        </div>
      </div>

      {/* Mid-Article Fast Job Alert Box */}
      <div className="rounded-2xl border border-teal-200/90 bg-teal-950 p-6 sm:p-7 text-white shadow-md">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-teal-200 mb-2">
            <span>✨</span> 7:00 AM Morning Job Delivery
          </div>
          <h4 className="text-lg sm:text-xl font-bold">
            Get 10 Verified Jobs Matched to Your Skills Daily
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-teal-200/80 leading-relaxed">
            Skip the endless job boards. Receive curated matches with verified Job Trust Scores™ directly in your inbox.
          </p>

          {subscribed ? (
            <div className="mt-4 rounded-xl bg-teal-900/80 border border-teal-500/40 p-3 text-xs sm:text-sm text-teal-200">
              🎉 <strong>You&apos;re subscribed!</strong> Your 10 curated morning matches will arrive tomorrow at 7 AM.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for 7 AM alerts..."
                required
                className="flex-1 rounded-xl border border-teal-700 bg-teal-900/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-teal-300/50 outline-none focus:border-teal-400 min-h-[44px]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-teal-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 hover:bg-teal-300 transition-colors shrink-0 disabled:opacity-70 min-h-[44px]"
              >
                {loading ? "Adding..." : "Get 10 Jobs Free →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
