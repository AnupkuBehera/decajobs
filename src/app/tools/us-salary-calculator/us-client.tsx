"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface USStateOption {
  code: string;
  name: string;
  flatRate?: number;
  hasBrackets?: boolean;
  zeroTax?: boolean;
  desc: string;
  defaultCity: string;
  rent: number;
  utilities: number;
  groceries: number;
  transport: number;
  healthcare: number;
}

const US_STATES: USStateOption[] = [
  {
    code: "CA",
    name: "California (Silicon Valley / SF)",
    hasBrackets: true,
    desc: "Epicenter of AI and tech, progressive state tax up to 9.3% - 13.3%",
    defaultCity: "San Francisco Bay Area",
    rent: 3200,
    utilities: 220,
    groceries: 550,
    transport: 400,
    healthcare: 280,
  },
  {
    code: "NY",
    name: "New York (NYC)",
    hasBrackets: true,
    desc: "Wall Street FinTech and media tech capital, State ~6% + NYC local ~3.8%",
    defaultCity: "New York City",
    rent: 3400,
    utilities: 210,
    groceries: 580,
    transport: 135,
    healthcare: 290,
  },
  {
    code: "WA",
    name: "Washington (Seattle / Bellevue)",
    zeroTax: true,
    desc: "Cloud capital (Amazon, Microsoft) with 0% personal state income tax!",
    defaultCity: "Seattle",
    rent: 2350,
    utilities: 190,
    groceries: 500,
    transport: 350,
    healthcare: 270,
  },
  {
    code: "TX",
    name: "Texas (Austin / Dallas)",
    zeroTax: true,
    desc: "Silicon Hills tech hub (Tesla, Apple, Oracle) with 0% state income tax!",
    defaultCity: "Austin",
    rent: 1850,
    utilities: 200,
    groceries: 450,
    transport: 420,
    healthcare: 260,
  },
  {
    code: "MA",
    name: "Massachusetts (Boston / Cambridge)",
    flatRate: 0.05,
    desc: "BioTech, Robotics & MIT/Harvard AI ecosystem, flat 5.0% state tax",
    defaultCity: "Boston / Cambridge",
    rent: 2600,
    utilities: 210,
    groceries: 510,
    transport: 220,
    healthcare: 280,
  },
  {
    code: "IL",
    name: "Illinois (Chicago)",
    flatRate: 0.0495,
    desc: "Quantitative finance & Midwest logistics tech hub, flat 4.95% state tax",
    defaultCity: "Chicago",
    rent: 1950,
    utilities: 180,
    groceries: 460,
    transport: 180,
    healthcare: 260,
  },
  {
    code: "CO",
    name: "Colorado (Denver / Boulder)",
    flatRate: 0.044,
    desc: "Booming aerospace & outdoor tech hub, flat 4.4% state tax",
    defaultCity: "Denver / Boulder",
    rent: 2050,
    utilities: 190,
    groceries: 470,
    transport: 340,
    healthcare: 270,
  },
  {
    code: "FL",
    name: "Florida (Miami / Tampa)",
    zeroTax: true,
    desc: "Sunbelt tech & crypto hub with 0% personal state income tax!",
    defaultCity: "Miami",
    rent: 2300,
    utilities: 210,
    groceries: 480,
    transport: 380,
    healthcare: 270,
  },
];

const SALARY_PRESETS = [
  { label: "$95k", value: 95000, desc: "Associate Dev" },
  { label: "$140k", value: 140000, desc: "Mid Engineer" },
  { label: "$185k", value: 185000, desc: "Senior Dev" },
  { label: "$240k", value: 240000, desc: "Staff / Lead" },
  { label: "$310k", value: 310000, desc: "Principal / EM" },
  { label: "$400k", value: 400000, desc: "VP / Director" },
];

export function UsSalaryClient() {
  const [grossAnnual, setGrossAnnual] = useState<number>(185000);
  const [selectedStateCode, setSelectedStateCode] = useState<string>("CA");
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");
  const [employmentType, setEmploymentType] = useState<"w2" | "1099">("w2");
  const [retirementPercent, setRetirementPercent] = useState<number>(6); // 6% 401k match default

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const selectedState = useMemo(() => {
    return US_STATES.find((s) => s.code === selectedStateCode) || US_STATES[0];
  }, [selectedStateCode]);

  const calculations = useMemo(() => {
    const gross = Math.max(0, grossAnnual || 0);

    // 1. 401(k) Pre-tax Retirement Contribution (capped at $23,500 IRS limit for 2026)
    const retirementRaw = gross * (retirementPercent / 100);
    const retirementAnnual = Math.min(23500, Math.round(retirementRaw));
    const retirementMonthly = Math.round(retirementAnnual / 12);

    // Adjusted Gross Income (AGI) for Federal & State tax calculations
    const agi = Math.max(0, gross - retirementAnnual);

    // 2. Standard Deduction 2026
    const standardDeduction = filingStatus === "single" ? 15000 : 30000;

    // 3. Federal Income Tax (2026 Brackets)
    let federalTaxable = Math.max(0, agi - standardDeduction);
    let federalTax = 0;

    const fedBracketsSingle = [
      { cap: 11925, rate: 0.10 },
      { cap: 48475, rate: 0.12 },
      { cap: 103350, rate: 0.22 },
      { cap: 197300, rate: 0.24 },
      { cap: 250525, rate: 0.32 },
      { cap: 626350, rate: 0.35 },
      { cap: Infinity, rate: 0.37 },
    ];

    const fedBracketsMarried = [
      { cap: 23850, rate: 0.10 },
      { cap: 96950, rate: 0.12 },
      { cap: 206700, rate: 0.22 },
      { cap: 394600, rate: 0.24 },
      { cap: 501050, rate: 0.32 },
      { cap: 751600, rate: 0.35 },
      { cap: Infinity, rate: 0.37 },
    ];

    const fedBrackets = filingStatus === "single" ? fedBracketsSingle : fedBracketsMarried;
    let prevCap = 0;
    for (const b of fedBrackets) {
      if (federalTaxable > prevCap) {
        const taxableInBracket = Math.min(federalTaxable, b.cap) - prevCap;
        federalTax += taxableInBracket * b.rate;
        prevCap = b.cap;
      } else {
        break;
      }
    }

    // 4. FICA Taxes (Social Security + Medicare)
    // 2026 Social Security wage cap = $176,100
    const ssCap = 176100;
    const ssTaxable = Math.min(gross, ssCap);

    let socialSecurityTax = 0;
    let medicareTax = 0;

    if (employmentType === "w2") {
      socialSecurityTax = ssTaxable * 0.062;
      medicareTax = gross * 0.0145;
      // Additional Medicare tax 0.9% above threshold
      const addMedicareThreshold = filingStatus === "single" ? 200000 : 250000;
      if (gross > addMedicareThreshold) {
        medicareTax += (gross - addMedicareThreshold) * 0.009;
      }
    } else {
      // 1099 Contractor pays full Self-Employment Tax (12.4% SS + 2.9% Medicare)
      // With SECA deduction (92.35% base)
      const seNet = gross * 0.9235;
      socialSecurityTax = Math.min(seNet, ssCap) * 0.124;
      medicareTax = seNet * 0.029;
      const addMedicareThreshold = filingStatus === "single" ? 200000 : 250000;
      if (gross > addMedicareThreshold) {
        medicareTax += (gross - addMedicareThreshold) * 0.009;
      }
    }

    const totalFica = socialSecurityTax + medicareTax;

    // 5. State Income Tax
    let stateTax = 0;
    if (selectedState.zeroTax) {
      stateTax = 0;
    } else if (selectedState.flatRate) {
      // Flat rate states (MA, IL, CO)
      stateTax = Math.max(0, agi - standardDeduction * 0.5) * selectedState.flatRate;
    } else if (selectedState.code === "CA") {
      // California progressive tax brackets (approximate 2026 single brackets)
      const caBrackets = [
        { cap: 10756, rate: 0.01 },
        { cap: 25499, rate: 0.02 },
        { cap: 40245, rate: 0.04 },
        { cap: 55866, rate: 0.06 },
        { cap: 70606, rate: 0.08 },
        { cap: 360659, rate: 0.093 },
        { cap: 432787, rate: 0.103 },
        { cap: 721314, rate: 0.113 },
        { cap: Infinity, rate: 0.123 },
      ];
      let caTaxable = Math.max(0, agi - (filingStatus === "single" ? 5540 : 11080));
      let prevCaCap = 0;
      for (const b of caBrackets) {
        const adjustedCap = filingStatus === "married" ? b.cap * 2 : b.cap;
        if (caTaxable > prevCaCap) {
          const chunk = Math.min(caTaxable, adjustedCap) - prevCaCap;
          stateTax += chunk * b.rate;
          prevCaCap = adjustedCap;
        } else {
          break;
        }
      }
    } else if (selectedState.code === "NY") {
      // NY State + NYC local blended progressive
      const nyTaxable = Math.max(0, agi - (filingStatus === "single" ? 8000 : 16050));
      // Blended ~6.2% state + ~3.4% NYC resident local
      if (nyTaxable > 0) {
        stateTax = nyTaxable * 0.075;
      }
    }

    // 6. Net Take-Home Pay Calculations
    const totalTaxes = Math.round(federalTax + totalFica + stateTax);
    const netAnnual = Math.max(0, gross - totalTaxes - retirementAnnual);
    const netMonthly = Math.round(netAnnual / 12);
    const netBiWeekly = Math.round(netAnnual / 26); // 26 paychecks per year

    const effectiveTaxRate = gross > 0 ? ((totalTaxes / gross) * 100).toFixed(1) : "0.0";
    const federalTaxRate = gross > 0 ? ((federalTax / gross) * 100).toFixed(1) : "0.0";
    const stateTaxRate = gross > 0 ? ((stateTax / gross) * 100).toFixed(1) : "0.0";
    const ficaTaxRate = gross > 0 ? ((totalFica / gross) * 100).toFixed(1) : "0.0";

    // 7. Monthly Cost of Living Breakdown
    const monthlyLiving =
      selectedState.rent +
      selectedState.utilities +
      selectedState.groceries +
      selectedState.transport +
      selectedState.healthcare;

    const monthlySurplus = netMonthly - monthlyLiving;

    return {
      gross,
      retirementAnnual,
      retirementMonthly,
      standardDeduction,
      federalTax: Math.round(federalTax),
      socialSecurityTax: Math.round(socialSecurityTax),
      medicareTax: Math.round(medicareTax),
      totalFica: Math.round(totalFica),
      stateTax: Math.round(stateTax),
      totalTaxes,
      netAnnual,
      netMonthly,
      netBiWeekly,
      effectiveTaxRate,
      federalTaxRate,
      stateTaxRate,
      ficaTaxRate,
      monthlyLiving,
      monthlySurplus,
    };
  }, [grossAnnual, selectedState, filingStatus, employmentType, retirementPercent]);

  return (
    <div className="space-y-8">
      {/* Interactive Controls Card */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Inputs */}
          <div className="space-y-5 lg:col-span-7">
            {/* Gross Salary Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Annual Gross Salary ($ USD)
                </label>
                <span className="text-xs font-semibold text-blue-600">
                  {formatUSD(grossAnnual)} / year
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={grossAnnual || ""}
                  onChange={(e) => setGrossAnnual(Number(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-neutral-300 py-3.5 pl-9 pr-4 text-lg font-bold text-neutral-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                  placeholder="185000"
                />
              </div>

              {/* Quick Presets */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {SALARY_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setGrossAnnual(p.value)}
                    type="button"
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      grossAnnual === p.value
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* US State Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide mb-1.5">
                Work Location / State Tax Jurisdiction
              </label>
              <select
                value={selectedStateCode}
                onChange={(e) => setSelectedStateCode(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 py-3 px-3.5 text-sm font-semibold text-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
              >
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} {s.zeroTax ? "(0% Tax)" : ""}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-neutral-500">
                {selectedState.desc}
              </p>
            </div>

            {/* Filing Status & Employment Type in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide mb-1.5">
                  Tax Filing Status
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
                  <button
                    type="button"
                    onClick={() => setFilingStatus("single")}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      filingStatus === "single"
                        ? "bg-white text-neutral-900 shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Single Filer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilingStatus("married")}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      filingStatus === "married"
                        ? "bg-white text-neutral-900 shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Married Joint
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide mb-1.5">
                  Employment Contract
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
                  <button
                    type="button"
                    onClick={() => setEmploymentType("w2")}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      employmentType === "w2"
                        ? "bg-white text-neutral-900 shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    W-2 Full-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmploymentType("1099")}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      employmentType === "1099"
                        ? "bg-white text-neutral-900 shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    1099 Contractor
                  </button>
                </div>
              </div>
            </div>

            {/* 401(k) Pre-tax Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-neutral-800 uppercase tracking-wide">
                  Pre-Tax 401(k) Contribution ({retirementPercent}%)
                </span>
                <span className="font-semibold text-emerald-600">
                  {formatUSD(calculations.retirementAnnual)} / year ($23,500 max)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={retirementPercent}
                onChange={(e) => setRetirementPercent(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Pre-tax 401(k) contributions reduce taxable income, saving you hundreds in Federal and State taxes.
              </p>
            </div>
          </div>

          {/* Right Column: Hero Take-Home Results */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 p-5 sm:p-6 lg:col-span-5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-300 px-3 py-0.5 text-xs font-bold text-blue-900">
                  <span>🇺🇸</span> Net In-Pocket Pay
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  Tax Rate: {calculations.effectiveTaxRate}%
                </span>
              </div>

              {/* Monthly Pay Highlight */}
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Monthly Net Take-Home
                </div>
                <div className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight mt-1">
                  {formatUSD(calculations.netMonthly)}
                  <span className="text-sm font-medium text-neutral-500"> / mo</span>
                </div>
              </div>

              {/* Bi-Weekly Pay (Standard US Payroll) */}
              <div className="rounded-xl bg-white border border-neutral-200 p-3 mb-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-800">
                      Bi-Weekly Paycheck (Every 2 weeks)
                    </span>
                    <p className="text-[10px] text-neutral-500">26 pay periods per calendar year</p>
                  </div>
                  <span className="text-base font-extrabold text-neutral-900">
                    {formatUSD(calculations.netBiWeekly)}
                  </span>
                </div>
              </div>

              {/* Annual Summary */}
              <div className="rounded-xl bg-white border border-neutral-200 p-3 mb-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 font-medium">Annual Take-Home Pay</span>
                  <span className="font-extrabold text-neutral-900">
                    {formatUSD(calculations.netAnnual)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-neutral-100">
                  <span className="text-neutral-600 font-medium">Total Deductions &amp; Tax</span>
                  <span className="font-bold text-rose-600">
                    -{formatUSD(calculations.totalTaxes + calculations.retirementAnnual)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="pt-2">
              <Link
                href="/us"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-xs"
              >
                View Jobs Paying {formatUSD(grossAnnual)}+ in {selectedState.code} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Breakdown Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Federal Income Tax Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Federal Income Tax
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            {formatUSD(calculations.federalTax)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Effective {calculations.federalTaxRate}% rate with {formatUSD(calculations.standardDeduction)} standard deduction.
          </p>
        </div>

        {/* State Income Tax Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {selectedState.code} State Tax
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            {selectedState.zeroTax ? "$0 (0%)" : formatUSD(calculations.stateTax)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {selectedState.zeroTax
              ? "Zero personal state income tax in " + selectedState.name.split(" ")[0]
              : `Effective ${calculations.stateTaxRate}% state rate.`}
          </p>
        </div>

        {/* FICA Taxes Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            FICA (Social Security &amp; Med)
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-1">
            {formatUSD(calculations.totalFica)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            SS: {formatUSD(calculations.socialSecurityTax)} · Medicare: {formatUSD(calculations.medicareTax)}
          </p>
        </div>

        {/* 401(k) Retirement Card */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-2xs">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Pre-Tax 401(k) Savings
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">
            {formatUSD(calculations.retirementAnnual)}
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            {formatUSD(calculations.retirementMonthly)}/mo invested in your retirement fund tax-free.
          </p>
        </div>
      </div>

      {/* Cost of Living & Remaining Disposable Income Breakdown */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Estimated Monthly Living Expenses: {selectedState.defaultCity}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Based on single professional living costs in modern tech corridors.
            </p>
          </div>
          <div className="rounded-full bg-neutral-100 border border-neutral-200 px-3.5 py-1 text-xs font-bold text-neutral-800">
            Total Living: {formatUSD(calculations.monthlyLiving)}/mo
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <span className="text-lg">🏠</span>
            <div className="text-[11px] font-bold text-neutral-500 uppercase mt-1">Rent (1BHK)</div>
            <div className="text-base font-extrabold text-neutral-900">{formatUSD(selectedState.rent)}</div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <span className="text-lg">⚡</span>
            <div className="text-[11px] font-bold text-neutral-500 uppercase mt-1">Utilities &amp; Net</div>
            <div className="text-base font-extrabold text-neutral-900">{formatUSD(selectedState.utilities)}</div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <span className="text-lg">🛒</span>
            <div className="text-[11px] font-bold text-neutral-500 uppercase mt-1">Groceries</div>
            <div className="text-base font-extrabold text-neutral-900">{formatUSD(selectedState.groceries)}</div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <span className="text-lg">🚗</span>
            <div className="text-[11px] font-bold text-neutral-500 uppercase mt-1">Transit / Auto</div>
            <div className="text-base font-extrabold text-neutral-900">{formatUSD(selectedState.transport)}</div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 col-span-2 sm:col-span-1">
            <span className="text-lg">🩺</span>
            <div className="text-[11px] font-bold text-neutral-500 uppercase mt-1">Health Premium</div>
            <div className="text-base font-extrabold text-neutral-900">{formatUSD(selectedState.healthcare)}</div>
          </div>
        </div>

        {/* Disposable Savings Verdict */}
        <div
          className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            calculations.monthlySurplus >= 0
              ? "bg-emerald-50 border-emerald-200 text-emerald-950"
              : "bg-rose-50 border-rose-200 text-rose-950"
          }`}
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">
              Estimated Monthly Discretionary Cash Flow &amp; Savings
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              {formatUSD(calculations.monthlySurplus)}
              <span className="text-xs font-medium opacity-80"> / month remaining</span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              Available for stock market investing, vacations, emergency savings, and debt payoff after all living costs and taxes.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/tools/salary-calculator"
              className="rounded-xl bg-white border border-neutral-300 px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-all shadow-2xs"
            >
              Compare with India (INR) Slabs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

