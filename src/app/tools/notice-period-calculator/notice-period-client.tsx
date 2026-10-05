"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface NoticePreset {
  label: string;
  days: number;
  popularFor?: string;
}

const PRESETS: NoticePreset[] = [
  { label: "15 Days", days: 15, popularFor: "Probation Period" },
  { label: "30 Days (1 Mo)", days: 30, popularFor: "Startups & Mid-size" },
  { label: "60 Days (2 Mos)", days: 60, popularFor: "Senior Roles & FinTech" },
  { label: "90 Days (3 Mos)", days: 90, popularFor: "TCS, Infy, Wipro, Indian IT" },
];

export function NoticePeriodClient() {
  // Input states
  const todayIso = new Date().toISOString().split("T")[0];
  const [resignationDate, setResignationDate] = useState<string>(todayIso);
  const [noticeDays, setNoticeDays] = useState<number>(90);
  const [customDays, setCustomDays] = useState<string>("90");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [accruedLeaves, setAccruedLeaves] = useState<number>(0);
  const [adjustLeaves, setAdjustLeaves] = useState<boolean>(true);
  
  // Buyout options
  const [enableBuyout, setEnableBuyout] = useState<boolean>(false);
  const [monthlyGross, setMonthlyGross] = useState<number>(85000);
  const [actualServedDays, setActualServedDays] = useState<number>(30);

  // Email generator state
  const [managerName, setManagerName] = useState<string>("Manager");
  const [companyName, setCompanyName] = useState<string>("Company");
  const [roleTitle, setRoleTitle] = useState<string>("Software Engineer");
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const results = useMemo(() => {
    const resDate = new Date(resignationDate || todayIso);
    if (isNaN(resDate.getTime())) return null;

    const daysTotal = isCustom ? Math.max(1, parseInt(customDays) || 0) : noticeDays;

    // Standard LWD (inclusive of resignation day or counting after resignation day)
    // In India corporate practice, notice period begins the calendar day following resignation
    const standardLwd = new Date(resDate);
    standardLwd.setDate(standardLwd.getDate() + daysTotal);

    // Adjusted LWD if leaves offset
    const effectiveNoticeDays = adjustLeaves ? Math.max(0, daysTotal - Math.max(0, accruedLeaves)) : daysTotal;
    const adjustedLwd = new Date(resDate);
    adjustedLwd.setDate(adjustedLwd.getDate() + effectiveNoticeDays);

    // Calendar days countdown from today
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const targetDate = adjustLeaves ? adjustedLwd : standardLwd;
    const diffTime = targetDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Buyout calculation
    // Shortfall days = total required notice days - actual served days - (leaves if adjusted)
    const shortfallDays = Math.max(0, daysTotal - actualServedDays - (adjustLeaves ? accruedLeaves : 0));
    // Per day salary = Monthly Gross (or Basic) / 30
    const perDaySalary = monthlyGross / 30;
    const estimatedBuyout = Math.round(shortfallDays * perDaySalary);

    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    return {
      standardLwd: formatDate(standardLwd),
      standardLwdShort: standardLwd.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      adjustedLwd: formatDate(adjustedLwd),
      adjustedLwdShort: adjustedLwd.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      daysRemaining,
      daysTotal,
      shortfallDays,
      estimatedBuyout,
      effectiveNoticeDays,
    };
  }, [resignationDate, todayIso, isCustom, customDays, noticeDays, adjustLeaves, accruedLeaves, actualServedDays, monthlyGross]);

  const resignationEmail = useMemo(() => {
    if (!results) return "";
    const effectiveLwd = adjustLeaves && accruedLeaves > 0 ? results.adjustedLwd : results.standardLwd;
    const leaveNote = adjustLeaves && accruedLeaves > 0
      ? `\n\nAs I have ${accruedLeaves} accrued earned leaves remaining, I request you to kindly approve the adjustment of these leaves against my notice period, making my tentative Last Working Day ${results.adjustedLwd}.`
      : "";

    return `Subject: Resignation Notice - ${roleTitle} - [Your Full Name]

Dear ${managerName},

Please accept this email as formal notification that I am resigning from my position as ${roleTitle} at ${companyName}. As per my employment contract, my notice period is ${results.daysTotal} days.${leaveNote}

My proposed last working day with ${companyName} will be ${effectiveLwd}.

During this transition period, I am committed to completing my pending deliverables, documenting ongoing workflows, and assisting in training team members to ensure a seamless handover.

I sincerely thank you and the leadership team for the guidance, growth opportunities, and support provided to me during my tenure at ${companyName}.

Kindly acknowledge receipt of this email and initiate the relieving formalities.

Warm regards,
[Your Full Name]
[Employee ID]
[Phone Number]`;
  }, [results, roleTitle, managerName, companyName, adjustLeaves, accruedLeaves]);

  const copyEmail = () => {
    if (!resignationEmail) return;
    navigator.clipboard.writeText(resignationEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Interactive Tool Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <span>📅</span> Notice Period Details
            </h2>

            {/* Resignation Date */}
            <div>
              <label htmlFor="resignation-date" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Resignation Submission Date
              </label>
              <input
                id="resignation-date"
                type="date"
                value={resignationDate}
                onChange={(e) => setResignationDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-neutral-800 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Notice period in India starts counting from the calendar day following your resignation.
              </p>
            </div>

            {/* Notice Period Presets */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Company Notice Period Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESETS.map((p) => {
                  const active = !isCustom && noticeDays === p.days;
                  return (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => {
                        setIsCustom(false);
                        setNoticeDays(p.days);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        active
                          ? "border-primary-600 bg-primary-50 text-primary-900 shadow-sm ring-1 ring-primary-500"
                          : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 text-neutral-700"
                      }`}
                    >
                      <div className="text-sm font-bold">{p.label}</div>
                      <div className="text-[11px] text-neutral-500 truncate mt-0.5">{p.popularFor}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Notice Days Toggle */}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className={`text-xs font-semibold ${isCustom ? "text-primary-600 underline" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                  {isCustom ? "← Back to presets" : "Need custom days? (e.g., 45 days)"}
                </button>
                {isCustom && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      className="w-24 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Days"
                    />
                    <span className="text-xs text-neutral-500">days</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accrued Earned Leaves Adjustment */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <label htmlFor="accrued-leaves" className="text-sm font-semibold text-neutral-700">
                  Unused Earned / Privilege Leaves (PL/EL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="adjust-leaves"
                    type="checkbox"
                    checked={adjustLeaves}
                    onChange={(e) => setAdjustLeaves(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="adjust-leaves" className="text-xs text-neutral-600 font-medium cursor-pointer">
                    Offset against notice
                  </label>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="accrued-leaves"
                  type="number"
                  min="0"
                  max="120"
                  value={accruedLeaves || ""}
                  onChange={(e) => setAccruedLeaves(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="e.g. 12"
                  className="w-32 rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <span className="text-xs text-neutral-500">
                  {accruedLeaves > 0 && adjustLeaves
                    ? `Leaves will advance your LWD by ${accruedLeaves} days`
                    : "Companies may approve leave adjustment or encash them in F&F settlement"}
                </span>
              </div>
            </div>

            {/* Buyout Calculator Toggle */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setEnableBuyout(!enableBuyout)}
                className="flex items-center justify-between w-full py-1 text-left text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                <span>💰 Calculate Notice Period Buyout Cost?</span>
                <span>{enableBuyout ? "▲ Hide" : "▼ Expand"}</span>
              </button>

              {enableBuyout && (
                <div className="mt-3 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-4 text-xs text-neutral-700">
                  <p className="text-neutral-600">
                    If your new company is buying out your notice period, or your current employer recovers shortfall pay:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Monthly Gross/Basic Salary (₹)</label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={monthlyGross}
                        onChange={(e) => setMonthlyGross(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800"
                      />
                      <span className="text-[11px] text-neutral-500">Check your offer letter (Gross or Basic is used for buyout)</span>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Days You Can Actually Serve</label>
                      <input
                        type="number"
                        min="0"
                        max={results?.daysTotal || 90}
                        value={actualServedDays}
                        onChange={(e) => setActualServedDays(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800"
                      />
                      <span className="text-[11px] text-neutral-500">e.g., 30 days served out of 90</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-700/80 pb-4">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  Calculation Results
                </span>
                <span className="bg-primary-500/20 text-primary-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-primary-500/30">
                  {results?.daysRemaining} days left
                </span>
              </div>

              {/* Main LWD Box */}
              <div className="mt-5 space-y-4">
                <div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {adjustLeaves && accruedLeaves > 0 ? "Adjusted Last Working Day (with Leaves)" : "Official Last Working Day (LWD)"}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight text-primary-400">
                    {adjustLeaves && accruedLeaves > 0 ? results?.adjustedLwd : results?.standardLwd}
                  </div>
                </div>

                {adjustLeaves && accruedLeaves > 0 && (
                  <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700/60 text-xs space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>Standard LWD (without leaves):</span>
                      <span className="text-neutral-200 font-medium">{results?.standardLwdShort}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Leaves Adjusted:</span>
                      <span className="text-green-400 font-medium">-{accruedLeaves} days</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Effective Served Days:</span>
                      <span className="text-neutral-200 font-medium">{results?.effectiveNoticeDays} days</span>
                    </div>
                  </div>
                )}

                {/* Buyout summary if active */}
                {enableBuyout && results && (
                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-600/40 text-xs space-y-1.5">
                    <div className="flex justify-between text-amber-200/90 font-semibold">
                      <span>Shortfall Notice Days:</span>
                      <span>{results.shortfallDays} days</span>
                    </div>
                    <div className="flex justify-between text-amber-300 font-bold text-sm">
                      <span>Estimated Buyout Pay:</span>
                      <span>₹{results.estimatedBuyout.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[11px] text-amber-200/70 pt-1">
                      Payable by new employer or deducted from your Full & Final (F&F) settlement.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-neutral-700/80 space-y-3">
              <a
                href="#resignation-template"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>✍️ Generate Resignation Email Template</span>
              </a>
              <Link
                href="/jobs"
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-700"
              >
                <span>🔍 Find Ready-to-Join Immediate Roles</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resignation Email Template Generator Section */}
      <div id="resignation-template" className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <span>✉️</span> Tailored Resignation Email Template
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Ready to send to your reporting manager and HR with calculated dates pre-filled.
            </p>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              copied
                ? "bg-green-600 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
            }`}
          >
            <span>{copied ? "✓ Copied to Clipboard!" : "📋 Copy Resignation Email"}</span>
          </button>
        </div>

        {/* Quick customization inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Manager&apos;s Name</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="e.g. Ramesh / Sarah"
              className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Infosys / Tech Corp"
              className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Your Job Title</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-800"
            />
          </div>
        </div>

        {/* Email Preview Box */}
        <pre className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-xs text-neutral-800 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {resignationEmail}
        </pre>
      </div>
    </div>
  );
}
