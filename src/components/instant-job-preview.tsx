"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ExternalJob } from "@/lib/public-jobs";
import { jobSlug, formatPostedDate, extractSkillsFromJob } from "@/lib/public-jobs";
import { calculateJobTrustScore } from "@/lib/trust-score";
import * as gtag from "@/lib/gtag";

interface InstantJobPreviewProps {
  jobs: ExternalJob[];
}

const ROLE_PRESETS = [
  { id: "all", label: "🌟 All Roles", query: "" },
  { id: "frontend", label: "💻 Frontend / React", query: "react frontend developer web" },
  { id: "fullstack", label: "⚡ Full Stack", query: "full stack fullstack typescript node" },
  { id: "data", label: "📊 Data & AI", query: "data analyst analytics python sql machine learning" },
  { id: "fresher", label: "🎓 Fresher / SDE-1", query: "junior fresher entry graduate associate" },
  { id: "devops", label: "☁️ DevOps & Cloud", query: "devops cloud aws kubernetes docker" },
];

const LOCATION_PRESETS = [
  { id: "all", label: "🇮🇳 All India & Remote", query: "" },
  { id: "bangalore", label: "Bangalore", query: "bangalore bengaluru" },
  { id: "hyderabad", label: "Hyderabad", query: "hyderabad" },
  { id: "pune", label: "Pune", query: "pune" },
  { id: "delhi", label: "Delhi NCR", query: "delhi gurgaon noida ncr" },
  { id: "remote", label: "Remote", query: "remote" },
];

export function InstantJobPreview({ jobs }: InstantJobPreviewProps) {
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [contactValue, setContactValue] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Filter jobs dynamically
  const filteredJobs = useMemo(() => {
    let result = jobs;

    const rolePreset = ROLE_PRESETS.find((r) => r.id === selectedRole);
    if (rolePreset && rolePreset.query) {
      const keywords = rolePreset.query.split(" ");
      result = result.filter((j) => {
        const text = `${j.title} ${j.description}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    }

    const locPreset = LOCATION_PRESETS.find((l) => l.id === selectedLocation);
    if (locPreset && locPreset.query) {
      const locKeywords = locPreset.query.split(" ");
      result = result.filter((j) => {
        const loc = (j.location || "").toLowerCase();
        return locKeywords.some((kw) => loc.includes(kw));
      });
    }

    // Always guarantee up to 10 jobs
    if (result.length < 10) {
      // Backfill with other quality jobs from the pool
      const ids = new Set(result.map((j) => j.id));
      const remaining = jobs.filter((j) => !ids.has(j.id));
      result = [...result, ...remaining].slice(0, 10);
    }

    return result.slice(0, 10);
  }, [jobs, selectedRole, selectedLocation]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setIsSubmitting(true);
    gtag.event("instant_preview_subscribe", {
      event_category: "lead_generation",
      event_label: `instant_preview_widget_${channel}`,
      channel,
      role: selectedRole,
      location: selectedLocation,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
    }, 500);
  };

  return (
    <section className="relative rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:p-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-xs mb-3">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          Live Interactive Preview · No Login Required
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
          Test-Drive Today&apos;s Top 10 Digest
        </h2>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          This is exactly what DecaJobs members receive at 7:00 AM every morning. Select your target role to preview today&apos;s curated openings with live <span className="font-semibold text-neutral-900">Job Trust Scores™</span>.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mt-8 space-y-4">
        {/* Role Presets */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Target Role:
          </label>
          <div className="flex flex-wrap gap-2">
            {ROLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedRole(preset.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  selectedRole === preset.id
                    ? "bg-primary-600 text-white shadow-sm ring-2 ring-primary-600/30"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Presets */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Location:
          </label>
          <div className="flex flex-wrap gap-2">
            {LOCATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedLocation(preset.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedLocation === preset.id
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10 Jobs Preview Grid */}
      <div className="mt-8 space-y-3.5">
        {filteredJobs.map((job, idx) => {
          const trust = calculateJobTrustScore({
            title: job.title,
            company: job.company,
            description: job.description,
            location: job.location,
            postedAt: job.postedAt,
            applicationLink: job.applicationLink,
          });

          const skills = extractSkillsFromJob(`${job.title} ${job.description}`, 3);

          return (
            <div
              key={job.id}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 sm:p-5 transition-all hover:bg-white hover:border-primary-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {/* Rank Number */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-800 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  #{idx + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/jobs/${jobSlug(job)}`}
                      className="text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1 hover:underline"
                    >
                      {job.title}
                    </Link>
                    <span className="text-sm font-medium text-neutral-600">
                      at <span className="text-neutral-900">{job.company}</span>
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1 font-medium text-neutral-700">
                      📍 {job.location || "Remote"}
                    </span>
                    <span>•</span>
                    <time>{formatPostedDate(job.postedAt)}</time>
                    <span>•</span>
                    {/* Job Trust Score Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold text-[11px] border ${trust.badgeBg} ${trust.badgeBorder} ${trust.badgeText}`}
                      title={trust.reasons.join(" · ")}
                    >
                      <span>{trust.icon}</span>
                      Trust Score {trust.score}/100
                    </span>
                  </div>

                  {skills.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                <Link
                  href={`/jobs/${jobSlug(job)}`}
                  className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors min-h-[40px] flex items-center justify-center"
                >
                  View Details
                </Link>
                <a
                  href={job.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 shadow-xs transition-colors min-h-[40px] flex items-center justify-center gap-1"
                >
                  Apply Directly →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Banner: Get these 10 every morning */}
      <div className="mt-10 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 mb-3">
            Never Miss High-Priority Hiring Windows
          </span>
          <h3 className="text-xl font-bold sm:text-2xl">
            Want 10 verified matches like these delivered tomorrow morning?
          </h3>
          <p className="mt-2 text-xs text-primary-200 sm:text-sm">
            AI matches your skills against 20+ job boards and delivers your personalized Top 10 by 7:00 AM.
          </p>

          {/* Channel Selector */}
          <div className="flex items-center justify-center gap-2 mt-4 mb-1">
            <button
              type="button"
              onClick={() => {
                setChannel("email");
                setContactValue("");
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                channel === "email"
                  ? "bg-white text-primary-900 shadow-sm"
                  : "bg-primary-900/60 text-primary-200 hover:bg-primary-800"
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
                  ? "bg-[#25D366] text-neutral-950 font-bold shadow-sm"
                  : "bg-primary-900/60 text-primary-200 hover:bg-primary-800"
              }`}
            >
              <span>💬</span> WhatsApp Digest
              <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.2 text-[10px] text-emerald-300">
                Top Pick
              </span>
            </button>
          </div>

          {subscribed ? (
            <div className="mt-6 rounded-xl border border-emerald-400/50 bg-emerald-950/60 p-5 text-center">
              <p className="text-sm font-bold text-white">
                {channel === "whatsapp" ? "💬 WhatsApp Alerts Activated!" : "✨ You're on tomorrow morning's digest!"}
              </p>
              <p className="mt-1 text-xs text-emerald-200">
                We&apos;ve registered <span className="font-semibold text-white">{contactValue}</span>. Your 10 daily curated matches will arrive tomorrow morning.
              </p>
              {channel === "whatsapp" ? (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi DecaJobs! Please activate my daily 10 jobs digest for: ${contactValue}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-[#20b859] transition-colors"
                >
                  Confirm on WhatsApp Now →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(`/login?email=${encodeURIComponent(contactValue)}`)}
                  className="mt-3 inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-300 transition-colors"
                >
                  Complete Profile Preferences →
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-5 flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto">
              <input
                type={channel === "whatsapp" ? "tel" : "email"}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={
                  channel === "whatsapp"
                    ? "Enter WhatsApp number (+91...)..."
                    : "Enter your email for daily 7 AM job alerts..."
                }
                required
                className="flex-1 rounded-xl border border-primary-700 bg-primary-950/80 px-4 py-3 text-sm text-white placeholder-primary-300/60 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 min-h-[48px]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-xl px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-60 min-h-[48px] shrink-0 ${
                  channel === "whatsapp"
                    ? "bg-[#25D366] text-neutral-950 hover:bg-[#20b859]"
                    : "bg-gradient-to-r from-cyan-400 to-teal-400 text-neutral-950 hover:from-cyan-300 hover:to-teal-300"
                }`}
              >
                {isSubmitting
                  ? "Starting..."
                  : channel === "whatsapp"
                  ? "Get WhatsApp Alerts →"
                  : "Start 7-Day Free Trial →"}
              </button>
            </form>
          )}

          <p className="mt-3 text-[11px] text-primary-300/70">
            🔒 7-day all-access free trial · No credit card required · Then ₹299/month · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
