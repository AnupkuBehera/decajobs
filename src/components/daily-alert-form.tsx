"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as gtag from "@/lib/gtag";

export function DailyAlertForm() {
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [contactValue, setContactValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setLoading(true);

    gtag.event("daily_alert_subscribe", {
      event_category: "lead_generation",
      event_label: `homepage_hero_${channel}`,
      channel,
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-6 text-center backdrop-blur-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-2xl">
          {channel === "whatsapp" ? "💬" : "✨"}
        </div>
        <h3 className="mt-3 text-lg font-bold text-white">
          {channel === "whatsapp" ? "WhatsApp Alerts Activated!" : "You're on the 7 AM List!"}
        </h3>
        <p className="mt-1 text-sm text-emerald-200">
          We&apos;ve registered <span className="font-semibold text-white">{contactValue}</span>. Your 10 daily curated matches with verified Job Trust Scores™ will be delivered every morning.
        </p>

        {channel === "whatsapp" ? (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi DecaJobs! Please activate my daily 10 jobs digest for: ${contactValue}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-[#20b859] transition-colors"
          >
            <span>💬</span> Confirm on WhatsApp Now →
          </a>
        ) : (
          <button
            type="button"
            onClick={() => router.push(`/login?email=${encodeURIComponent(contactValue)}`)}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors"
          >
            Set Job Preferences Now →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Channel Switcher */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => {
            setChannel("email");
            setContactValue("");
          }}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
            channel === "email"
              ? "bg-white text-primary-900 shadow-sm"
              : "bg-primary-900/60 text-primary-200 hover:bg-primary-800/80"
          }`}
        >
          <span>📧</span> Email (7 AM)
        </button>
        <button
          type="button"
          onClick={() => {
            setChannel("whatsapp");
            setContactValue("");
          }}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
            channel === "whatsapp"
              ? "bg-[#25D366] text-neutral-950 shadow-sm font-bold"
              : "bg-primary-900/60 text-primary-200 hover:bg-primary-800/80"
          }`}
        >
          <span>💬</span> WhatsApp Digest
          <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.2 text-[10px] text-emerald-300">
            India Top Pick
          </span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <input
            type={channel === "whatsapp" ? "tel" : "email"}
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={
              channel === "whatsapp"
                ? "Enter WhatsApp number (+91 98765 43210)..."
                : "Enter your email for daily 7 AM job alerts..."
            }
            required
            className="w-full rounded-xl border border-primary-700/60 bg-primary-950/60 px-4 py-3.5 text-sm text-white placeholder-primary-300/60 shadow-inner outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 min-h-[52px]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 min-h-[52px] shrink-0 ${
            channel === "whatsapp"
              ? "bg-[#25D366] text-neutral-950 hover:bg-[#20b859] shadow-emerald-900/30"
              : "bg-gradient-to-r from-cyan-400 to-teal-400 text-neutral-950 hover:from-cyan-300 hover:to-teal-300 shadow-cyan-900/30"
          }`}
        >
          {loading
            ? "Registering..."
            : channel === "whatsapp"
            ? "Get 10 Jobs on WhatsApp →"
            : "Start 7-Day Free Trial →"}
        </button>
      </form>
      <p className="mt-2.5 text-center text-xs text-primary-200/70">
        🔒 7-day all-access free trial · No credit card required · Cancel anytime
      </p>
    </div>
  );
}
