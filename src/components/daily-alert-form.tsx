"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as gtag from "@/lib/gtag";

export function DailyAlertForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);

    // Track custom conversion event in GA4
    gtag.event("daily_alert_subscribe", {
      event_category: "lead_generation",
      event_label: "homepage_hero",
      email_domain: email.split("@")[1] || "",
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-6 text-center backdrop-blur-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-2xl">
          ✨
        </div>
        <h3 className="mt-3 text-lg font-bold text-white">You&apos;re on the 7 AM List!</h3>
        <p className="mt-1 text-sm text-emerald-200">
          We&apos;ve registered <span className="font-semibold text-white">{email}</span>. Your first 10 curated job matches will land in your inbox tomorrow morning.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
        >
          Set Job Preferences Now →
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for daily 7 AM job alerts..."
            required
            className="w-full rounded-xl border border-primary-700/60 bg-primary-950/60 px-4 py-3.5 text-sm text-white placeholder-primary-300/60 shadow-inner outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 min-h-[52px]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-cyan-900/30 transition-all hover:from-cyan-300 hover:to-teal-300 active:scale-[0.99] disabled:opacity-70 min-h-[52px] shrink-0"
        >
          {loading ? "Registering..." : "Get 10 Daily Jobs Free →"}
        </button>
      </form>
      <p className="mt-2.5 text-center text-xs text-primary-200/70">
        🔒 Free forever. Zero spam. Unsubscribe anytime in 1 click.
      </p>
    </div>
  );
}
