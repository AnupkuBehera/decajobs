"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const AED_PRESETS = [
  { label: "8k AED", value: 8000, desc: "Junior / Entry" },
  { label: "14k AED", value: 14000, desc: "Mid Engineer" },
  { label: "20k AED", value: 20000, desc: "Senior Dev" },
  { label: "28k AED", value: 28000, desc: "Lead / Manager" },
  { label: "38k AED", value: 38000, desc: "Staff / Director" },
  { label: "50k AED", value: 50000, desc: "Executive / VP" },
];

const LIFESTYLE_OPTIONS = [
  {
    id: "single_budget",
    title: "Single (Budget / Studio)",
    desc: "Studio in JVC / Dubai Silicon Oasis, Dubai Metro user",
    rent: 3600,
    utilities: 750,
    transport: 400,
    food: 1200,
    leisure: 800,
  },
  {
    id: "single_comfortable",
    title: "Single (Comfortable 1BHK)",
    desc: "1BHK in Downtown/Marina/Business Bay, own car + dining",
    rent: 6500,
    utilities: 1100,
    transport: 1200,
    food: 2000,
    leisure: 1500,
  },
  {
    id: "family_expat",
    title: "Family (Couple + Child)",
    desc: "2BHK in Greens/JLT/Hills, family car, weekend activities",
    rent: 9800,
    utilities: 1600,
    transport: 1800,
    food: 3200,
    leisure: 2200,
  },
];

// Current benchmark conversion rates
const AED_TO_INR = 22.65;
const AED_TO_USD = 0.2723;
const AED_TO_GBP = 0.215;

export function DubaiSalaryClient() {
  const [aedMonthly, setAedMonthly] = useState<number>(20000);
  const [basicRatio, setBasicRatio] = useState<number>(60); // 60% Basic, 40% Allowance
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [lifestyleId, setLifestyleId] = useState<string>("single_comfortable");

  const formatAED = (val: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const formatLakhs = (valInr: number) => {
    const lakhs = valInr / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  const selectedLifestyle = useMemo(() => {
    return (
      LIFESTYLE_OPTIONS.find((l) => l.id === lifestyleId) ||
      LIFESTYLE_OPTIONS[1]
    );
  }, [lifestyleId]);

  const calculations = useMemo(() => {
    const monthlyGross = Math.max(0, aedMonthly || 0);
    const annualGross = monthlyGross * 12;

    // Currency Conversions
    const monthlyINR = monthlyGross * AED_TO_INR;
    const annualINR = annualGross * AED_TO_INR;
    const monthlyUSD = monthlyGross * AED_TO_USD;
    const annualUSD = annualGross * AED_TO_USD;

    // Basic Salary vs Allowance (UAE Contracts standard 60:40)
    const basicMonthly = Math.round(monthlyGross * (basicRatio / 100));
    const allowanceMonthly = monthlyGross - basicMonthly;
    const basicDailyWage = basicMonthly / 30;

    // UAE End of Service Gratuity (Article 51 of Federal Decree-Law No. 33 of 2021)
    // 21 days basic per year for first 5 years
    // 30 days basic per year thereafter (capped at 2 years total basic salary)
    let totalGratuityDays = 0;
    if (tenureYears <= 5) {
      totalGratuityDays = tenureYears * 21;
    } else {
      totalGratuityDays = 5 * 21 + (tenureYears - 5) * 30;
    }
    const maxGratuityCap = basicMonthly * 24; // 2 years basic
    const estimatedGratuityAED = Math.min(
      maxGratuityCap,
      Math.round(totalGratuityDays * basicDailyWage)
    );
    const estimatedGratuityINR = estimatedGratuityAED * AED_TO_INR;

    // Projected Indian Tax Savings (What you'd pay in India on same annual INR under New Tax Regime)
    // Up to 7L = 0, 7-10L = 10%, 10-12L = 15%, 12-15L = 20%, >15L = 30% (+4% cess)
    let indianTaxEstimate = 0;
    const taxableINR = Math.max(0, annualINR - 75000);
    if (taxableINR > 700000) {
      let rem = taxableINR;
      let t = 0;
      if (rem > 300000) t += Math.min(rem - 300000, 400000) * 0.05;
      if (rem > 700000) t += Math.min(rem - 700000, 300000) * 0.1;
      if (rem > 1000000) t += Math.min(rem - 1000000, 200000) * 0.15;
      if (rem > 1200000) t += Math.min(rem - 1200000, 300000) * 0.2;
      if (rem > 1500000) t += (rem - 1500000) * 0.3;
      indianTaxEstimate = Math.round(t * 1.04);
    }
    const taxSavedAED = Math.round(indianTaxEstimate / AED_TO_INR);

    // Living Costs Breakdown
    const totalExpensesAED =
      selectedLifestyle.rent +
      selectedLifestyle.utilities +
      selectedLifestyle.transport +
      selectedLifestyle.food +
      selectedLifestyle.leisure;

    const netSavingsMonthlyAED = Math.max(0, monthlyGross - totalExpensesAED);
    const netSavingsMonthlyINR = netSavingsMonthlyAED * AED_TO_INR;
    const netSavingsAnnualINR = netSavingsMonthlyINR * 12;
    const savingsRatio =
      monthlyGross > 0
        ? Math.round((netSavingsMonthlyAED / monthlyGross) * 100)
        : 0;

    return {
      monthlyGross,
      annualGross,
      monthlyINR,
      annualINR,
      monthlyUSD,
      annualUSD,
      basicMonthly,
      allowanceMonthly,
      estimatedGratuityAED,
      estimatedGratuityINR,
      indianTaxEstimate,
      taxSavedAED,
      totalExpensesAED,
      netSavingsMonthlyAED,
      netSavingsMonthlyINR,
      netSavingsAnnualINR,
      savingsRatio,
    };
  }, [aedMonthly, basicRatio, tenureYears, selectedLifestyle]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Input Configuration Column */}
      <div className="lg:col-span-5 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <span>🇦🇪</span> Enter Offer Details
        </h2>

        {/* AED Monthly Salary Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Offered Monthly Salary (AED):
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">
              AED
            </span>
            <input
              type="number"
              value={aedMonthly || ""}
              onChange={(e) => setAedMonthly(Number(e.target.value))}
              placeholder="e.g. 20000"
              className="w-full rounded-xl border border-neutral-300 py-3.5 pl-14 pr-4 text-base font-bold text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 shadow-xs"
            />
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {AED_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setAedMonthly(p.value)}
                className={`rounded-lg px-2 py-1.5 text-xs text-left transition-all ${
                  aedMonthly === p.value
                    ? "bg-primary-600 text-white font-bold shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                <div className="font-bold">{p.label}</div>
                <div
                  className={`text-[10px] ${
                    aedMonthly === p.value ? "text-primary-100" : "text-neutral-500"
                  }`}
                >
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Salary Ratio (MOHRE Contract Standard) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Basic Salary Ratio ({basicRatio}% Basic / {100 - basicRatio}% Allowance)
            </label>
            <span className="text-xs font-bold text-neutral-700">
              {formatAED(calculations.basicMonthly)}/mo
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={80}
            step={5}
            value={basicRatio}
            onChange={(e) => setBasicRatio(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />
          <p className="mt-1.5 text-[11px] text-neutral-500">
            UAE Labour Law gratuity is calculated on Basic Salary. Standard contracts use 60%.
          </p>
        </div>

        {/* Estimated Years of Service for Gratuity */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Planned Stay in UAE:
            </label>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
              {tenureYears} {tenureYears === 1 ? "Year" : "Years"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />
        </div>

        {/* Dubai Lifestyle & Housing Tier */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Dubai Lifestyle & Accommodation:
          </label>
          <div className="space-y-2">
            {LIFESTYLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLifestyleId(opt.id)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  lifestyleId === opt.id
                    ? "border-primary-600 bg-primary-50/70 ring-2 ring-primary-500/20"
                    : "border-neutral-200 bg-neutral-50 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    {opt.title}
                  </span>
                  <span className="text-xs font-semibold text-neutral-600">
                    ~{formatAED(opt.rent + opt.utilities + opt.transport + opt.food + opt.leisure)}/mo
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output & Intelligence Dashboard Column */}
      <div className="lg:col-span-7 space-y-6">
        {/* Primary Take-Home & Conversion Card */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                100% Tax-Free In-Hand Salary
              </span>
              <div className="text-3xl sm:text-4xl font-black text-neutral-900 mt-1">
                {formatAED(calculations.monthlyGross)}{" "}
                <span className="text-base font-semibold text-neutral-500">/ month</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <span>🛡️</span> 0% Income Tax
              </span>
              <div className="text-xs text-neutral-500 mt-1">
                Annual: {formatAED(calculations.annualGross)}
              </div>
            </div>
          </div>

          {/* Currency Conversions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white border border-neutral-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                🇮🇳 Monthly (INR)
              </span>
              <div className="text-base font-bold text-neutral-900 mt-0.5">
                {formatINR(calculations.monthlyINR)}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">
                Annual: {formatLakhs(calculations.annualINR)}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                🇺🇸 Monthly (USD)
              </span>
              <div className="text-base font-bold text-neutral-900 mt-0.5">
                ${Math.round(calculations.monthlyUSD).toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">
                Annual: ${Math.round(calculations.annualUSD).toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-3.5 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                💰 Tax Saved vs India
              </span>
              <div className="text-base font-bold text-emerald-700 mt-0.5">
                {formatLakhs(calculations.indianTaxEstimate)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                ~{formatAED(calculations.taxSavedAED)} saved/yr
              </div>
            </div>
          </div>
        </div>

        {/* Dubai Living Expenses vs Net Savings */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>🏙️</span> Dubai Living Expenses & Net Savings
            </h3>
            <span className="text-xs font-bold text-neutral-500">
              Savings Rate: {calculations.savingsRatio}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden flex mb-6">
            <div
              style={{ width: `${Math.min(100, calculations.savingsRatio)}%` }}
              className="bg-emerald-500 h-full transition-all"
              title="Net Savings"
            />
            <div
              style={{ width: `${Math.min(100, 100 - calculations.savingsRatio)}%` }}
              className="bg-amber-400 h-full transition-all"
              title="Living Expenses"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
              <div className="text-[11px] text-neutral-500">🏠 Rent / Flat</div>
              <div className="font-bold text-neutral-900 text-sm mt-0.5">
                {formatAED(selectedLifestyle.rent)}
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
              <div className="text-[11px] text-neutral-500">⚡ DEWA + Wi-Fi</div>
              <div className="font-bold text-neutral-900 text-sm mt-0.5">
                {formatAED(selectedLifestyle.utilities)}
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
              <div className="text-[11px] text-neutral-500">🚗 Metro / Car</div>
              <div className="font-bold text-neutral-900 text-sm mt-0.5">
                {formatAED(selectedLifestyle.transport)}
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
              <div className="text-[11px] text-neutral-500">🍽️ Food & Fun</div>
              <div className="font-bold text-neutral-900 text-sm mt-0.5">
                {formatAED(selectedLifestyle.food + selectedLifestyle.leisure)}
              </div>
            </div>
          </div>

          {/* Net Projected Monthly In-Hand Savings */}
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-800">
                Estimated Net Cash Saved Every Month:
              </span>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">
                {formatAED(calculations.netSavingsMonthlyAED)}{" "}
                <span className="text-sm font-semibold text-emerald-700">
                  (~{formatINR(calculations.netSavingsMonthlyINR)}/mo)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-700 font-medium">Annual Wealth Accumulated:</span>
              <div className="text-base font-bold text-emerald-900">
                {formatLakhs(calculations.netSavingsAnnualINR)}
              </div>
            </div>
          </div>
        </div>

        {/* UAE End of Service Gratuity Card */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span>💼</span> End of Service Gratuity (UAE Labour Law)
            </h3>
            <span className="text-xs font-bold text-neutral-500">
              {tenureYears} Years Service
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            Under Article 51 of UAE Labour Law, you receive 21 days basic pay/year (first 5 yrs) and 30 days/year thereafter when leaving your employer.
          </p>
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 border border-neutral-200 p-4">
            <div>
              <span className="text-xs text-neutral-500">Projected Lump Sum Payout:</span>
              <div className="text-xl font-black text-neutral-900 mt-0.5">
                {formatAED(calculations.estimatedGratuityAED)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500">Equivalent in INR:</span>
              <div className="text-base font-bold text-emerald-700">
                {formatLakhs(calculations.estimatedGratuityINR)}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action to UAE Tech Jobs Hub */}
        <div className="rounded-3xl border border-primary-200 bg-gradient-to-r from-primary-900 to-indigo-950 p-6 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-sm">
          <div>
            <span className="inline-block rounded-full bg-primary-800/80 border border-primary-700 px-3 py-0.5 text-xs font-semibold text-primary-200 mb-2">
              🇦🇪 Relocate to Dubai
            </span>
            <h4 className="text-lg font-bold text-white">
              Ready to land a tax-free UAE tech offer?
            </h4>
            <p className="text-xs text-primary-200 mt-1">
              Browse verified tech jobs in Dubai & Abu Dhabi with employer visa sponsorship.
            </p>
          </div>
          <Link
            href="/jobs/country/ae"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-all shrink-0 shadow-md"
          >
            Explore UAE Jobs →
          </Link>
        </div>
      </div>
    </div>
  );
}
