"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const GBP_PRESETS = [
  { label: "£38.7k", value: 38700, desc: "Visa Threshold" },
  { label: "£55k", value: 55000, desc: "Mid Engineer" },
  { label: "£75k", value: 75000, desc: "Senior Dev" },
  { label: "£95k", value: 95000, desc: "Lead Dev / EM" },
  { label: "£125k", value: 125000, desc: "Staff / Head of" },
  { label: "£150k", value: 150000, desc: "VP / Director" },
];

const UK_LOCATIONS = [
  {
    id: "london",
    city: "London (Zone 2/3)",
    rent: 1950,
    councilTax: 160,
    transport: 180,
    groceries: 380,
    leisure: 450,
    desc: "Higher cost, highest London weighting and tech opportunities",
  },
  {
    id: "manchester",
    city: "Manchester / Leeds",
    rent: 1050,
    councilTax: 140,
    transport: 90,
    groceries: 320,
    leisure: 350,
    desc: "Vibrant tech hub with significantly lower rent and high quality of life",
  },
  {
    id: "cambridge",
    city: "Cambridge / Oxford",
    rent: 1450,
    councilTax: 150,
    transport: 110,
    groceries: 350,
    leisure: 380,
    desc: "Deep tech, AI, and life sciences hub with competitive tech compensation",
  },
];

const GBP_TO_INR = 107.5;
const GBP_TO_USD = 1.28;
const SKILLED_WORKER_THRESHOLD = 38700;

export function UkSalaryClient() {
  const [grossAnnual, setGrossAnnual] = useState<number>(75000);
  const [pensionPercent, setPensionPercent] = useState<number>(5); // 5% standard auto-enrolment
  const [selectedLocationId, setSelectedLocationId] = useState<string>("london");

  const formatGBP = (val: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const formatINR = (valInr: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(valInr));
  };

  const formatLakhs = (valInr: number) => {
    const lakhs = valInr / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  const selectedLoc = useMemo(() => {
    return UK_LOCATIONS.find((l) => l.id === selectedLocationId) || UK_LOCATIONS[0];
  }, [selectedLocationId]);

  const calculations = useMemo(() => {
    const gross = Math.max(0, grossAnnual || 0);

    // 1. Workplace Pension (Salary Sacrifice reduces taxable gross)
    const pensionAnnual = Math.round(gross * (pensionPercent / 100));
    const pensionMonthly = Math.round(pensionAnnual / 12);
    const adjustedGross = Math.max(0, gross - pensionAnnual);

    // 2. Personal Allowance with £100k taper
    // Base: £12,570. Reduced by £1 for every £2 over £100k.
    let personalAllowance = 12570;
    if (adjustedGross > 100000) {
      const taper = Math.min(12570, Math.floor((adjustedGross - 100000) / 2));
      personalAllowance = Math.max(0, 12570 - taper);
    }

    // 3. HMRC Income Tax (England & Wales PAYE Slabs 2025/26 & 2026/27)
    // Basic Rate: 20% on income between personal allowance and £50,270
    // Higher Rate: 40% on income between £50,271 and £125,140
    // Additional Rate: 45% on income above £125,140
    let incomeTax = 0;
    const taxableIncome = Math.max(0, adjustedGross - personalAllowance);

    const basicBandMax = Math.max(0, 50270 - personalAllowance);
    const higherBandMax = 125140 - 50270;

    if (taxableIncome > 0) {
      const basicChunk = Math.min(taxableIncome, basicBandMax);
      incomeTax += basicChunk * 0.20;

      if (taxableIncome > basicBandMax) {
        const higherChunk = Math.min(taxableIncome - basicBandMax, higherBandMax);
        incomeTax += higherChunk * 0.40;

        if (taxableIncome > basicBandMax + higherBandMax) {
          const additionalChunk = taxableIncome - basicBandMax - higherBandMax;
          incomeTax += additionalChunk * 0.45;
        }
      }
    }
    incomeTax = Math.round(incomeTax);
    const incomeTaxMonthly = Math.round(incomeTax / 12);

    // 4. Class 1 National Insurance (Employee 2025/2026: 8% main, 2% higher)
    // £0 up to £12,570
    // 8% on £12,570 to £50,270 (Max: (50270 - 12570) * 0.08 = £3,016)
    // 2% on excess above £50,270
    let niAnnual = 0;
    if (gross > 12570) {
      const niMainChunk = Math.min(gross - 12570, 50270 - 12570);
      niAnnual += niMainChunk * 0.08;

      if (gross > 50270) {
        const niExcess = gross - 50270;
        niAnnual += niExcess * 0.02;
      }
    }
    niAnnual = Math.round(niAnnual);
    const niMonthly = Math.round(niAnnual / 12);

    // 5. Net In-Hand Take Home Pay
    const totalDeductionsAnnual = pensionAnnual + incomeTax + niAnnual;
    const netAnnual = Math.max(0, gross - totalDeductionsAnnual);
    const netMonthly = Math.round(netAnnual / 12);

    // 6. International Conversions
    const netMonthlyINR = netMonthly * GBP_TO_INR;
    const netAnnualINR = netAnnual * GBP_TO_INR;
    const netMonthlyUSD = netMonthly * GBP_TO_USD;

    // 7. Living Expenses & Savings
    const totalExpensesMonthly =
      selectedLoc.rent +
      selectedLoc.councilTax +
      selectedLoc.transport +
      selectedLoc.groceries +
      selectedLoc.leisure;

    const netSavingsMonthlyGBP = Math.max(0, netMonthly - totalExpensesMonthly);
    const netSavingsMonthlyINR = netSavingsMonthlyGBP * GBP_TO_INR;
    const netSavingsAnnualINR = netSavingsMonthlyINR * 12;
    const savingsRate = netMonthly > 0 ? Math.round((netSavingsMonthlyGBP / netMonthly) * 100) : 0;

    // 8. Skilled Worker Visa Assessment
    const qualifiesVisa = gross >= SKILLED_WORKER_THRESHOLD;

    return {
      gross,
      pensionAnnual,
      pensionMonthly,
      personalAllowance,
      incomeTax,
      incomeTaxMonthly,
      niAnnual,
      niMonthly,
      totalDeductionsAnnual,
      netAnnual,
      netMonthly,
      netMonthlyINR,
      netAnnualINR,
      netMonthlyUSD,
      totalExpensesMonthly,
      netSavingsMonthlyGBP,
      netSavingsMonthlyINR,
      netSavingsAnnualINR,
      savingsRate,
      qualifiesVisa,
    };
  }, [grossAnnual, pensionPercent, selectedLoc]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Input Configuration Column */}
      <div className="lg:col-span-5 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <span>🇬🇧</span> Enter UK Salary Details
        </h2>

        {/* Gross Annual Salary Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Annual Gross Salary (£ GBP):
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-base">
              £
            </span>
            <input
              type="number"
              value={grossAnnual || ""}
              onChange={(e) => setGrossAnnual(Number(e.target.value))}
              placeholder="e.g. 75000"
              className="w-full rounded-xl border border-neutral-300 py-3.5 pl-9 pr-4 text-base font-bold text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-xs"
            />
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {GBP_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setGrossAnnual(p.value)}
                className={`rounded-lg px-2 py-1.5 text-xs text-left transition-all ${
                  grossAnnual === p.value
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                <div className="font-bold">{p.label}</div>
                <div
                  className={`text-[10px] ${
                    grossAnnual === p.value ? "text-blue-100" : "text-neutral-500"
                  }`}
                >
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workplace Pension Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Workplace Pension ({pensionPercent}% Employee)
            </label>
            <span className="text-xs font-bold text-neutral-800">
              {formatGBP(calculations.pensionAnnual)}/yr
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={1}
            value={pensionPercent}
            onChange={(e) => setPensionPercent(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <p className="mt-1 text-[11px] text-neutral-500">
            Auto-enrolment standard is 5% employee + 3% employer. Lowers your taxable PAYE gross.
          </p>
        </div>

        {/* Location & Housing Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            UK City &amp; Living Costs:
          </label>
          <div className="space-y-2">
            {UK_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocationId(loc.id)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  selectedLocationId === loc.id
                    ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                    : "border-neutral-200 bg-neutral-50 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{loc.city}</span>
                  <span className="text-xs font-semibold text-neutral-600">
                    ~{formatGBP(loc.rent + loc.councilTax + loc.transport + loc.groceries + loc.leisure)}/mo
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">{loc.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output & Tax Intelligence Column */}
      <div className="lg:col-span-7 space-y-6">
        {/* Primary Take-Home Card */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-4 mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Monthly Net In-Hand Salary
              </span>
              <div className="text-3xl sm:text-4xl font-black text-neutral-900 mt-1">
                {formatGBP(calculations.netMonthly)}{" "}
                <span className="text-base font-semibold text-neutral-500">/ month</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
                <span>💷</span> Annual Net: {formatGBP(calculations.netAnnual)}
              </span>
              <div className="text-xs text-neutral-500 mt-1">
                Total Deductions: {formatGBP(calculations.totalDeductionsAnnual)}/yr
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
                {formatINR(calculations.netMonthlyINR)}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">
                Annual: {formatLakhs(calculations.netAnnualINR)}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                🇺🇸 Monthly (USD)
              </span>
              <div className="text-base font-bold text-neutral-900 mt-0.5">
                ${Math.round(calculations.netMonthlyUSD).toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">
                Annual: ${Math.round(calculations.netAnnual * GBP_TO_USD).toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-3.5 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                🛡️ Visa Status
              </span>
              <div
                className={`text-xs font-bold mt-1 ${
                  calculations.qualifiesVisa ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {calculations.qualifiesVisa ? "Eligible for CoS" : "Below £38.7k Baseline"}
              </div>
              <div className="text-[10px] text-neutral-500 font-medium mt-0.5">
                Home Office threshold
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown of Deductions */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <span>📊</span> Monthly Deduction Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500">
                🏛️ HMRC Income Tax (PAYE)
              </span>
              <div className="text-base font-bold text-neutral-900 mt-1">
                {formatGBP(calculations.incomeTaxMonthly)}/mo
              </div>
              <div className="text-[10px] text-neutral-500">
                Annual: {formatGBP(calculations.incomeTax)}
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500">
                🏥 National Insurance (8%)
              </span>
              <div className="text-base font-bold text-neutral-900 mt-1">
                {formatGBP(calculations.niMonthly)}/mo
              </div>
              <div className="text-[10px] text-neutral-500">
                Annual: {formatGBP(calculations.niAnnual)}
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-3.5 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500">
                💰 Workplace Pension ({pensionPercent}%)
              </span>
              <div className="text-base font-bold text-neutral-900 mt-1">
                {formatGBP(calculations.pensionMonthly)}/mo
              </div>
              <div className="text-[10px] text-neutral-500">
                Annual: {formatGBP(calculations.pensionAnnual)}
              </div>
            </div>
          </div>

          {/* Living Costs & Net Savings */}
          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-neutral-600">
                  Estimated Net Cash Left After Rent &amp; Expenses in {selectedLoc.city}:
                </span>
                <div className="text-2xl font-black text-neutral-900 mt-0.5">
                  {formatGBP(calculations.netSavingsMonthlyGBP)}{" "}
                  <span className="text-sm font-semibold text-emerald-700">
                    (~{formatINR(calculations.netSavingsMonthlyINR)}/mo)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500">Projected Annual Savings:</span>
                <div className="text-base font-bold text-emerald-700">
                  {formatLakhs(calculations.netSavingsAnnualINR)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action to UK Tech Jobs Hub */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-sm">
          <div>
            <span className="inline-block rounded-full bg-blue-800/80 border border-blue-700 px-3 py-0.5 text-xs font-semibold text-blue-200 mb-2">
              🇬🇧 UK Tech Opportunities
            </span>
            <h4 className="text-lg font-bold text-white">
              Looking for UK roles with Certificate of Sponsorship?
            </h4>
            <p className="text-xs text-blue-200 mt-1">
              Browse verified tech jobs in London, Manchester, and Cambridge with Skilled Worker Visa support.
            </p>
          </div>
          <Link
            href="/uk"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-all shrink-0 shadow-md"
          >
            Explore UK Jobs →
          </Link>
        </div>
      </div>
    </div>
  );
}
