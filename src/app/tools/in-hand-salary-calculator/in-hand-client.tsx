"use client";

import { useState, useMemo } from "react";

const CTC_PRESETS = [
  { label: "₹6 LPA", value: 600000 },
  { label: "₹10 LPA", value: 1000000 },
  { label: "₹15 LPA", value: 1500000 },
  { label: "₹25 LPA", value: 2500000 },
  { label: "₹40 LPA", value: 4000000 },
  { label: "₹60 LPA", value: 6000000 },
];

export function InHandSalaryClient() {
  const [ctc, setCtc] = useState<number>(1200000);
  const [taxRegime, setTaxRegime] = useState<"new" | "old">("new");
  const [variablePercent, setVariablePercent] = useState<number>(10);
  const [customVariable, setCustomVariable] = useState<boolean>(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const results = useMemo(() => {
    const annualCTC = Math.max(0, ctc || 0);

    // Standard Indian compensation benchmarks:
    // Basic is usually ~40% of CTC
    const basicAnnual = Math.round(annualCTC * 0.40);
    const basicMonthly = Math.round(basicAnnual / 12);

    // Employer PF (part of CTC) & Employee PF (deducted from gross)
    // 12% of basic
    const employeePFAnnual = Math.round(basicAnnual * 0.12);
    const employerPFAnnual = Math.round(basicAnnual * 0.12);
    const employeePFMonthly = Math.round(employeePFAnnual / 12);

    // Gratuity provision included in CTC (4.81% of basic)
    const gratuityAnnual = Math.round(basicAnnual * 0.0481);

    // Variable Pay / Performance Bonus component (disbursed annually or quarterly)
    const variableAnnual = customVariable ? Math.round(annualCTC * (variablePercent / 100)) : Math.round(annualCTC * 0.10);
    const variableMonthly = Math.round(variableAnnual / 12);

    // Gross Salary (Fixed Pay before employee deductions)
    // Gross = CTC - (Employer PF + Gratuity + Variable Component)
    const grossAnnual = Math.max(0, annualCTC - employerPFAnnual - gratuityAnnual - variableAnnual);
    const grossMonthly = Math.round(grossAnnual / 12);

    // Professional Tax (Fixed in most states: ~₹2,400/yr or ₹200/mo)
    const ptAnnual = annualCTC > 300000 ? 2400 : 0;
    const ptMonthly = Math.round(ptAnnual / 12);

    // Income Tax / TDS Calculation (FY 2025-26 & 2026-27 Slabs)
    let taxAnnual = 0;

    if (taxRegime === "new") {
      // Standard Deduction in New Regime = ₹75,000
      const standardDeduction = 75000;
      const taxableIncome = Math.max(0, grossAnnual + (customVariable ? variableAnnual : 0) - standardDeduction);

      // Section 87A rebate makes income up to ₹7,00,000 tax-free
      if (taxableIncome <= 700000) {
        taxAnnual = 0;
      } else {
        // Slabs:
        // 0 - 3L: 0%
        // 3L - 7L: 5%
        // 7L - 10L: 10%
        // 10L - 12L: 15%
        // 12L - 15L: 20%
        // > 15L: 30%
        let rem = taxableIncome;
        let t = 0;

        // 3L to 7L (4L @ 5%)
        if (rem > 300000) {
          const chunk = Math.min(rem - 300000, 400000);
          t += chunk * 0.05;
        }
        // 7L to 10L (3L @ 10%)
        if (rem > 700000) {
          const chunk = Math.min(rem - 700000, 300000);
          t += chunk * 0.10;
        }
        // 10L to 12L (2L @ 15%)
        if (rem > 1000000) {
          const chunk = Math.min(rem - 1000000, 200000);
          t += chunk * 0.15;
        }
        // 12L to 15L (3L @ 20%)
        if (rem > 1200000) {
          const chunk = Math.min(rem - 1200000, 300000);
          t += chunk * 0.20;
        }
        // > 15L @ 30%
        if (rem > 1500000) {
          const chunk = rem - 1500000;
          t += chunk * 0.30;
        }

        // 4% Health & Education Cess
        taxAnnual = Math.round(t * 1.04);
      }
    } else {
      // Old Regime with standard deduction ₹50,000 & sample 80C
      const standardDeduction = 50000;
      const estimated80C = Math.min(150000, employeePFAnnual + 50000);
      const taxableIncome = Math.max(0, grossAnnual - standardDeduction - estimated80C);

      if (taxableIncome <= 500000) {
        taxAnnual = 0;
      } else {
        let t = 0;
        if (taxableIncome > 250000) {
          t += Math.min(taxableIncome - 250000, 250000) * 0.05;
        }
        if (taxableIncome > 500000) {
          t += Math.min(taxableIncome - 500000, 500000) * 0.20;
        }
        if (taxableIncome > 1000000) {
          t += (taxableIncome - 1000000) * 0.30;
        }
        taxAnnual = Math.round(t * 1.04);
      }
    }

    const taxMonthly = Math.round(taxAnnual / 12);

    // Monthly In-Hand Cash = Monthly Gross - (Employee PF + PT + Monthly TDS)
    const inHandMonthly = Math.max(0, grossMonthly - employeePFMonthly - ptMonthly - taxMonthly);
    const inHandAnnual = inHandMonthly * 12;

    const totalDeductionsMonthly = employeePFMonthly + ptMonthly + taxMonthly;

    return {
      annualCTC,
      basicAnnual,
      basicMonthly,
      grossAnnual,
      grossMonthly,
      employeePFAnnual,
      employeePFMonthly,
      employerPFAnnual,
      gratuityAnnual,
      variableAnnual,
      variableMonthly,
      ptAnnual,
      ptMonthly,
      taxAnnual,
      taxMonthly,
      inHandMonthly,
      inHandAnnual,
      totalDeductionsMonthly,
    };
  }, [ctc, taxRegime, variablePercent, customVariable]);

  const inHandPercent = results.grossMonthly > 0 ? Math.round((results.inHandMonthly / results.grossMonthly) * 100) : 0;
  const taxPercent = results.grossMonthly > 0 ? Math.round((results.taxMonthly / results.grossMonthly) * 100) : 0;
  const pfPercent = results.grossMonthly > 0 ? Math.round((results.employeePFMonthly / results.grossMonthly) * 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Input Form Column */}
      <div className="lg:col-span-5 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <span>⚙️</span> Enter Salary Details
        </h2>

        {/* Annual CTC Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Annual Cost to Company (CTC):
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-base">
              ₹
            </span>
            <input
              type="number"
              value={ctc || ""}
              onChange={(e) => setCtc(Number(e.target.value))}
              placeholder="e.g. 1200000"
              className="w-full rounded-xl border border-neutral-300 py-3.5 pl-9 pr-4 text-base font-bold text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 shadow-xs"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {CTC_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setCtc(p.value)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  ctc === p.value
                    ? "bg-primary-600 text-white font-bold shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tax Regime Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Tax Regime:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTaxRegime("new")}
              className={`rounded-xl border p-3 text-left transition-all ${
                taxRegime === "new"
                  ? "border-primary-600 bg-primary-50/70 ring-2 ring-primary-500/20"
                  : "border-neutral-200 bg-neutral-50 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">New Regime</span>
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                  Recommended
                </span>
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">₹75k Standard Deduction</p>
            </button>

            <button
              type="button"
              onClick={() => setTaxRegime("old")}
              className={`rounded-xl border p-3 text-left transition-all ${
                taxRegime === "old"
                  ? "border-primary-600 bg-primary-50/70 ring-2 ring-primary-500/20"
                  : "border-neutral-200 bg-neutral-50 hover:bg-white"
              }`}
            >
              <span className="text-xs font-bold text-neutral-900">Old Regime</span>
              <p className="mt-1 text-[11px] text-neutral-500">With 80C & HRA exemptions</p>
            </button>
          </div>
        </div>

        {/* Variable Pay Setting */}
        <div className="mb-6 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Variable / Bonus Component:
            </label>
            <span className="text-xs font-bold text-primary-700">{variablePercent}% of CTC</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={variablePercent}
            onChange={(e) => {
              setVariablePercent(Number(e.target.value));
              setCustomVariable(true);
            }}
            className="w-full accent-primary-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
            <span>0% (All Fixed)</span>
            <span>10% (Typical)</span>
            <span>30% (High Variable)</span>
          </div>
        </div>
      </div>

      {/* Output Results Column */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          {/* Main Headline Card */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-6 text-center shadow-xs mb-6">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              Estimated Monthly In-Hand Cash
            </span>
            <div className="text-4xl font-extrabold text-neutral-950 sm:text-5xl">
              {formatINR(results.inHandMonthly)}
            </div>
            <p className="mt-2 text-xs text-neutral-600">
              Net annual take-home: <strong className="text-neutral-900">{formatINR(results.inHandAnnual)}</strong> (excluding yearly bonus)
            </p>
          </div>

          {/* Visual Breakdown Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-600 mb-2">
              <span>Salary Split (% of Monthly Gross)</span>
              <span>In-Hand: <strong>{inHandPercent}%</strong></span>
            </div>
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                style={{ width: `${inHandPercent}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`In-Hand Pay: ${inHandPercent}%`}
              />
              <div
                style={{ width: `${taxPercent}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Income Tax / TDS: ${taxPercent}%`}
              />
              <div
                style={{ width: `${pfPercent}%` }}
                className="bg-blue-500 transition-all duration-500"
                title={`Employee PF: ${pfPercent}%`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Net In-Hand
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Income Tax (TDS)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Employee EPF
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 text-xs">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3">Component</th>
                  <th className="p-3 text-right">Monthly</th>
                  <th className="p-3 text-right">Yearly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr className="hover:bg-neutral-50/50">
                  <td className="p-3 font-medium text-neutral-900">Gross Fixed Salary</td>
                  <td className="p-3 text-right font-semibold text-neutral-900">{formatINR(results.grossMonthly)}</td>
                  <td className="p-3 text-right text-neutral-600">{formatINR(results.grossAnnual)}</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 text-neutral-600">
                  <td className="p-3 pl-6">Basic Pay (~40%)</td>
                  <td className="p-3 text-right">{formatINR(results.basicMonthly)}</td>
                  <td className="p-3 text-right">{formatINR(results.basicAnnual)}</td>
                </tr>
                <tr className="hover:bg-rose-50/30 text-rose-800">
                  <td className="p-3 font-medium">(-) Employee PF (12% of Basic)</td>
                  <td className="p-3 text-right font-semibold">-{formatINR(results.employeePFMonthly)}</td>
                  <td className="p-3 text-right">-{formatINR(results.employeePFAnnual)}</td>
                </tr>
                <tr className="hover:bg-rose-50/30 text-rose-800">
                  <td className="p-3 font-medium">(-) Professional Tax (PT)</td>
                  <td className="p-3 text-right font-semibold">-{formatINR(results.ptMonthly)}</td>
                  <td className="p-3 text-right">-{formatINR(results.ptAnnual)}</td>
                </tr>
                <tr className="hover:bg-rose-50/30 text-rose-800">
                  <td className="p-3 font-medium">(-) Income Tax / TDS ({taxRegime.toUpperCase()} Regime)</td>
                  <td className="p-3 text-right font-semibold">-{formatINR(results.taxMonthly)}</td>
                  <td className="p-3 text-right">-{formatINR(results.taxAnnual)}</td>
                </tr>
                <tr className="bg-emerald-50/60 font-bold text-emerald-950">
                  <td className="p-3 text-sm">(=) Net In-Hand Take-Home Pay</td>
                  <td className="p-3 text-right text-sm text-emerald-700">{formatINR(results.inHandMonthly)}</td>
                  <td className="p-3 text-right text-sm text-emerald-700">{formatINR(results.inHandAnnual)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Subtle note */}
        <p className="mt-4 text-[11px] text-neutral-400 italic">
          *Note: Exact salary slips can vary slightly depending on your company&apos;s specific HRA, gratuity, and medical policy.
        </p>
      </div>
    </div>
  );
}
