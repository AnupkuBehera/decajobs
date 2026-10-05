"use client";

import React, { useState } from "react";
import Link from "next/link";

export function SampleDigestMockup() {
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp">("email");

  return (
    <section className="py-16 bg-neutral-900 text-white rounded-3xl overflow-hidden my-12 border border-neutral-800 shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
            <span>👁️</span> Real Digest Preview
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What Your 7:00 AM Morning Digest Looks Like
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            No endless scrolling through 10,000 irrelevant listings. Just your 10 best-matched,
            verified jobs delivered straight to your inbox or WhatsApp before your morning tea.
          </p>

          {/* Channel Selector Toggle */}
          <div className="mt-6 inline-flex p-1.5 bg-neutral-800/90 rounded-2xl border border-neutral-700">
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "email"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>📧</span> Email Digest (7:00 AM)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "whatsapp"
                  ? "bg-[#25D366] text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>💬</span> WhatsApp Digest (Most Popular)
            </button>
          </div>
        </div>

        {/* Tab 1: Email Client Frame */}
        {activeTab === "email" && (
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden">
            {/* Email Chrome Header */}
            <div className="bg-neutral-900/90 px-4 py-3 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="ml-2 font-mono text-[11px] text-neutral-400 truncate">
                  DecaJobs Daily Dispatch · 10 Curated Matches
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                Today, 07:00 AM IST
              </span>
            </div>

            {/* Email Metadata */}
            <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/40 text-xs space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 font-semibold w-16 shrink-0">From:</span>
                <span className="text-neutral-200">
                  DecaJobs Daily Matcher &lt;<span className="text-primary-400">matches@decajob.com</span>&gt;
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 font-semibold w-16 shrink-0">To:</span>
                <span className="text-neutral-300">Rahul Sharma &lt;rahul.sharma@gmail.com&gt;</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 font-semibold w-16 shrink-0">Subject:</span>
                <span className="text-white font-bold">
                  ☕ Your 10 Matched Jobs for Today · 3 in Bengaluru, 2 Remote (94% Avg Match)
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-5 sm:p-8 bg-neutral-950 space-y-6">
              {/* Salutation Box */}
              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">Good morning, Rahul! 👋</p>
                  <p className="mt-0.5 text-neutral-400">
                    We scanned <strong>1,420 new openings</strong> across India. Here are your top 10 matches for <strong>Full Stack Engineer (3-5 Yrs)</strong>.
                  </p>
                </div>
                <span className="shrink-0 bg-primary-600/30 text-primary-300 px-3 py-1 rounded-full font-bold text-[11px] border border-primary-500/40">
                  🎯 10 / 10 Jobs Verified
                </span>
              </div>

              {/* Sample Job Listing Cards inside email */}
              <div className="space-y-3.5">
                {/* Job 1 */}
                <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm sm:text-base">
                          Senior React &amp; Node.js Engineer
                        </span>
                        <span className="bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          96% Match
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Razorpay · Bengaluru (Indiranagar / Hybrid) · 3–5 Yrs Exp
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-primary-400">₹24L – ₹32L / yr</div>
                      <div className="text-[10px] text-neutral-500 font-mono">Posted 4h ago · Direct HR</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["React.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"].map((s) => (
                      <span key={s} className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-green-400 font-medium">🛡️ Trust Score 98/100 · Salary Verified</span>
                    <span className="text-primary-400 font-semibold">1-Click Apply →</span>
                  </div>
                </div>

                {/* Job 2 */}
                <div className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm sm:text-base">
                          Full-Stack Platform Developer
                        </span>
                        <span className="bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          92% Match
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Postman · Remote (India) · 2–4 Yrs Exp
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-primary-400">₹20L – ₹28L / yr</div>
                      <div className="text-[10px] text-neutral-500 font-mono">Posted 6h ago · High Urgency</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Next.js", "GraphQL", "Docker", "System Design"].map((s) => (
                      <span key={s} className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-green-400 font-medium">🛡️ Trust Score 95/100 · 100% Remote</span>
                    <span className="text-primary-400 font-semibold">1-Click Apply →</span>
                  </div>
                </div>
              </div>

              {/* Email Footer indicator */}
              <div className="text-center pt-2">
                <span className="text-xs text-neutral-500 font-mono">
                  + 8 more verified matches included in your daily email dispatch
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp Chat Frame */}
        {activeTab === "whatsapp" && (
          <div className="max-w-md mx-auto bg-[#0b141a] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden">
            {/* WhatsApp App Header */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white text-sm">
                  DJ
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-sm">DecaJobs Verified</span>
                    <span className="text-[#25D366] text-xs">✓</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">Official Daily Job Dispatch</span>
                </div>
              </div>
              <span className="text-neutral-400 text-xs">7:00 AM</span>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#0b141a] space-y-3 min-h-[360px] text-xs">
              {/* WhatsApp Bubble */}
              <div className="bg-[#005c4b] text-white p-4 rounded-2xl rounded-tl-sm max-w-[92%] shadow-md space-y-2.5">
                <p className="font-bold text-sm">
                  ☕ Good morning Rahul!
                </p>
                <p className="text-neutral-200 leading-relaxed text-[11px]">
                  Here are your <strong>Top 3 high-priority job matches</strong> for today (Full Stack / 3–5 Yrs):
                </p>

                <div className="border-t border-emerald-700/80 pt-2 space-y-2 text-[11px]">
                  <div>
                    <div className="font-bold text-white">1️⃣ Senior React / Node Engineer</div>
                    <div className="text-neutral-300">🏢 Razorpay · Indiranagar, Bengaluru</div>
                    <div className="text-neutral-300">💰 ₹24L – ₹32L · 🎯 96% Match</div>
                  </div>

                  <div className="border-t border-emerald-700/50 pt-2">
                    <div className="font-bold text-white">2️⃣ Full Stack Platform Developer</div>
                    <div className="text-neutral-300">🏢 Postman · Remote (India)</div>
                    <div className="text-neutral-300">💰 ₹20L – ₹28L · 🎯 92% Match</div>
                  </div>

                  <div className="border-t border-emerald-700/50 pt-2">
                    <div className="font-bold text-white">3️⃣ Backend Microservices Lead</div>
                    <div className="text-neutral-300">🏢 Swiggy · HSR Layout, Bengaluru</div>
                    <div className="text-neutral-300">💰 ₹28L – ₹38L · 🎯 90% Match</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-700/80 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-200">👉 7 more matches in your full list</span>
                  <span className="text-[10px] text-emerald-300">7:00 AM ✓✓</span>
                </div>
              </div>

              {/* Action Button inside WhatsApp */}
              <div className="pt-1">
                <div className="bg-[#202c33] border border-[#2a3942] rounded-xl p-2.5 text-center text-primary-400 font-bold text-xs hover:bg-[#2a3942] transition-colors cursor-pointer">
                  🔗 Tap here to view &amp; 1-click apply to all 10 jobs
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Guarantee and Trial CTA */}
        <div className="mt-10 text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-neutral-300 bg-neutral-800/80 px-4 py-1.5 rounded-full border border-neutral-700">
            <span>🛡️</span>
            <span>
              <strong>7-Day Free Trial:</strong> Receive 70 curated jobs completely free. No commitment.
            </span>
          </div>

          <div>
            <Link
              href="/login"
              className="inline-block w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all text-center"
            >
              Start Your 7-Day Free Trial (₹0 Today) →
            </Link>
          </div>
          <p className="text-[11px] text-neutral-500">
            ₹299/month thereafter. Cancel anytime with 1 click in your account settings.
          </p>
        </div>
      </div>
    </section>
  );
}
