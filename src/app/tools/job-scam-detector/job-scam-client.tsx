"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import * as gtag from "@/lib/gtag";

interface ScamPreset {
  label: string;
  country: "IN" | "AE" | "GLOBAL";
  jobTitle: string;
  company: string;
  description: string;
  salary: string;
  contactInfo: string;
}

const SCAM_PRESETS: ScamPreset[] = [
  {
    label: "🇦🇪 UAE Visa Fee Scam",
    country: "AE",
    jobTitle: "IT & Systems Administrator",
    company: "Gulf Grand Hospitality LLC",
    description:
      "Congratulations! Your profile has been shortlisted for our Dubai operations. Salary: 18,000 AED/mo tax-free. To issue your UAE work permit and entry visa, you must wire 1,850 AED for medical clearance and immigration processing to our accredited partner Al-Baraka Travel Services. This fee is reimbursable upon joining.",
    salary: "18,000 AED / month",
    contactInfo: "careers-gulfhospitality@gmail.com, WhatsApp: +971-50-xxx-xxxx",
  },
  {
    label: "🇮🇳 India Laptop Security Deposit",
    country: "IN",
    jobTitle: "Data Entry & Operations Executive",
    company: "InfoTech Solutions India Pvt Ltd",
    description:
      "Work from Home opportunity. You will receive an Apple MacBook and high-speed Wi-Fi router. Before dispatch, candidates must pay a refundable security deposit of ₹3,500 via Google Pay / PhonePe to our courier vendor. No interview required, immediate joining.",
    salary: "₹45,000 / month",
    contactInfo: "hr.infotechrecruitment@yahoo.com",
  },
  {
    label: "🌍 Remote Task / Telegram Scam",
    country: "GLOBAL",
    jobTitle: "Social Media Optimizer & Reviewer",
    company: "Global Digital Metrics Inc.",
    description:
      "Simple online tasks. Like 10 YouTube videos and rate Google Business locations to earn $250 - $400 daily. All communication and instant payouts handled via Telegram. Recharge your task account with $50 crypto to unlock VIP payout tier.",
    salary: "$300 / day",
    contactInfo: "Telegram: @global_hr_task_payouts",
  },
  {
    label: "✅ Verified Legitimate Listing",
    country: "IN",
    jobTitle: "Senior Full Stack Engineer",
    company: "Razorpay Software Private Limited",
    description:
      "We are looking for a Senior Full Stack Engineer with 4+ years experience in React, Node.js, and distributed architectures. You will build merchant payment gateways and scale transaction pipelines. 3 rounds of technical interviews including system design and live coding.",
    salary: "₹28,00,000 - ₹38,00,000 CTC",
    contactInfo: "recruiting@razorpay.com (Official Careers Portal)",
  },
];

export function JobScamClient() {
  const [country, setCountry] = useState<"IN" | "AE" | "GLOBAL">("IN");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  function applyPreset(p: ScamPreset) {
    setCountry(p.country);
    setJobTitle(p.jobTitle);
    setCompany(p.company);
    setDescription(p.description);
    setSalary(p.salary);
    setContactInfo(p.contactInfo);
    setError("");
    setResult(null);
  }

  async function handleAnalyze() {
    if (!jobTitle && !company && !description) {
      setError("Please fill in at least the job title or description.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/tools/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          company,
          description,
          salary,
          contactInfo,
          country,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }
      setResult(data);
      gtag.event("tool_scam_check", {
        event_category: "career_tools",
        event_label: data.verdict || "Scam Check",
        safety_score: data.safetyScore,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {!result ? (
        <Card padding="lg">
          <div className="space-y-5">
            {/* Region / Country Context */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Select Country / Hiring Market:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCountry("IN")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    country === "IN"
                      ? "border-primary-600 bg-primary-50/70 text-primary-900 ring-2 ring-primary-500/20"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-white"
                  }`}
                >
                  🇮🇳 India
                </button>
                <button
                  type="button"
                  onClick={() => setCountry("AE")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    country === "AE"
                      ? "border-primary-600 bg-primary-50/70 text-primary-900 ring-2 ring-primary-500/20"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-white"
                  }`}
                >
                  🇦🇪 UAE & Gulf
                </button>
                <button
                  type="button"
                  onClick={() => setCountry("GLOBAL")}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
                    country === "GLOBAL"
                      ? "border-primary-600 bg-primary-50/70 text-primary-900 ring-2 ring-primary-500/20"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-white"
                  }`}
                >
                  🌍 Global / Remote
                </button>
              </div>
            </div>

            {/* Quick Sample Buttons */}
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Or try a real-world example:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SCAM_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/60 px-2.5 py-1 text-xs font-medium text-neutral-700 transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer or IT Administrator"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none min-h-[44px]"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Hiring Entity / Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Gulf Technologies"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none min-h-[44px]"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Job Description / Email Message
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Paste the full job post, message, or offer letter text here..."
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-y"
              />
            </div>

            {/* Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Salary Mentioned (if any)
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹45,000/mo or 20,000 AED/mo"
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none min-h-[44px]"
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Contact Info (Email, Phone, Telegram, WhatsApp)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. hr@company.com or Telegram @recruiter"
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              isLoading={isLoading}
              size="lg"
              className="w-full font-bold shadow-sm"
            >
              Analyze Authenticity &amp; Scam Risks
            </Button>
            <p className="text-center text-xs text-neutral-500">
              100% Free • No registration required • Tested against Indian, UAE, and international labor laws.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card padding="lg" className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Legitimacy &amp; Safety Rating
            </span>
            <p
              className={`text-5xl font-black mt-2 ${
                result.safetyScore >= 75
                  ? "text-emerald-600"
                  : result.safetyScore >= 45
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {result.safetyScore}
              <span className="text-xl font-medium text-neutral-400">/100</span>
            </p>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold ${
                  result.verdict === "Safe"
                    ? "bg-emerald-100 text-emerald-800"
                    : result.verdict === "Caution" || result.verdict === "Suspicious"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {result.verdict === "Safe"
                  ? "✅ High Confidence: Legitimate Listing"
                  : result.verdict === "Caution" || result.verdict === "Suspicious"
                  ? "⚠️ Caution: Exercise Due Diligence"
                  : "🚨 High Risk: Probable Job Scam"}
              </span>
            </div>

            <p className="text-sm text-neutral-700 mt-4 max-w-xl mx-auto leading-relaxed">
              {result.explanation}
            </p>
          </Card>

          {result.redFlags?.length > 0 && (
            <Card padding="md" className="border-red-200 bg-red-50/40">
              <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <span>🚩</span> Detected Red Flags ({result.redFlags.length})
              </h3>
              <ul className="space-y-1.5">
                {result.redFlags.map((f: string, i: number) => (
                  <li key={i} className="text-xs sm:text-sm text-red-700 flex items-start gap-2">
                    <span className="shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.greenFlags?.length > 0 && (
            <Card padding="md" className="border-emerald-200 bg-emerald-50/40">
              <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <span>✅</span> Legitimate Hiring Indicators ({result.greenFlags.length})
              </h3>
              <ul className="space-y-1.5">
                {result.greenFlags.map((f: string, i: number) => (
                  <li key={i} className="text-xs sm:text-sm text-emerald-700 flex items-start gap-2">
                    <span className="shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card padding="md" className="bg-neutral-50 border-neutral-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Safety Advice
            </h4>
            <p className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed">
              {result.advice}
            </p>
          </Card>

          <Card padding="lg" className="text-center bg-primary-50/80 border-primary-200">
            <p className="font-bold text-neutral-900 text-base">
              Avoid fraudulent listings entirely with DecaJobs Verified
            </p>
            <p className="text-xs text-neutral-600 mt-1 max-w-lg mx-auto">
              Every job listing delivered in your morning 10 digest is screened for corporate domains, verified company registrations, and realistic pay bands.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-700 transition-all shadow-xs"
            >
              Get Verified Jobs Daily →
            </Link>
          </Card>

          <button
            onClick={() => setResult(null)}
            className="w-full text-center text-xs font-bold text-primary-600 hover:underline pt-2"
          >
            ← Check another job listing
          </button>
        </div>
      )}
    </>
  );
}
