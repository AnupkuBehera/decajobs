import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InHandSalaryClient } from "./in-hand-client";
import { AdSenseUnit } from "@/components/adsense-unit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "In-Hand Salary Calculator India 2026 - CTC to Take-Home Pay | DecaJobs",
  description:
    "Calculate your exact monthly in-hand take-home salary from Annual CTC in India. Accurate breakdown of Basic, Employee PF, Professional Tax, and Income Tax (New vs Old Tax Regime FY 2025-26/2026-27).",
  keywords: [
    "in hand salary calculator",
    "ctc to in hand salary calculator",
    "ctc to take home calculator",
    "salary calculator india",
    "in hand salary from ctc",
    "new tax regime salary calculator",
    "take home salary calculator india 2026",
  ],
  alternates: {
    canonical: "https://decajob.com/tools/in-hand-salary-calculator",
  },
  openGraph: {
    title: "In-Hand Salary Calculator India 2026 - CTC to Take-Home Pay",
    description:
      "Accurate monthly take-home salary calculator from CTC for Indian tech and corporate employees.",
    url: "https://decajob.com/tools/in-hand-salary-calculator",
    type: "website",
  },
};

export default function InHandSalaryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between CTC, Gross Salary, and In-Hand Salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CTC (Cost to Company) is the total annual expenditure an employer spends on you, including employer PF, gratuity, and insurance. Gross Salary is your earnings before income tax and employee deductions. In-Hand (Take-Home) Salary is the actual cash deposited into your bank account after deducting Employee PF (12%), Professional Tax, and TDS (Income Tax).",
        },
      },
      {
        "@type": "Question",
        name: "How is in-hand salary calculated under the New Tax Regime in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under the New Tax Regime, you receive a flat Standard Deduction of ₹75,000. Income up to ₹7,00,000 (effectively up to ₹7.75L with rebate) incurs zero tax. Deductions for Employee PF (12% of basic) and monthly Professional Tax (₹200) are subtracted from Gross to arrive at net in-hand pay.",
        },
      },
      {
        "@type": "Question",
        name: "Is EPF deducted from both employer and employee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. 12% of your Basic Salary is deducted from your gross pay as Employee PF, while an additional 12% is contributed by your employer (usually factored into your CTC).",
        },
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "In-Hand Salary Calculator" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs mb-3">
            <span>🇮🇳</span> FY 2025-26 & 2026-27 Tax Slabs Updated
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            In-Hand Salary Calculator (CTC to Take-Home)
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
            Convert your annual Cost to Company (CTC) into exact monthly take-home pay with realistic PF, Professional Tax, and Income Tax deductions.
          </p>
        </div>

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Interactive Client Calculator */}
        <InHandSalaryClient />

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* Informative Editorial FAQs */}
        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">
            Understanding Your Indian Salary Slip
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                Why is In-Hand Salary so much lower than CTC?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Indian CTC typically bundles indirect company expenses including:
                Employer PF contribution (12%), Gratuity provision (4.81% of basic), Medical Insurance premiums, and Variable/Performance bonuses that are only disbursed annually. Subtracting these plus mandatory taxes leaves your monthly in-hand cash.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                Which Tax Regime is better for tech professionals?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                For salaries up to ₹15 LPA without heavy home loan interest or large 80C investments, the <strong>New Tax Regime</strong> is typically more beneficial due to lower slab rates and a ₹75,000 standard deduction. For packages exceeding ₹20 LPA with substantial HRA exemptions (high rent in Bangalore, Mumbai, Gurgaon) and 80C/80D deductions, the Old Regime may occasionally yield slightly higher savings.
              </p>
            </div>
          </div>

          {/* Cross Link to Jobs */}
          <div className="mt-10 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-teal-50/50 to-blue-50 p-6 text-center">
            <h3 className="font-bold text-neutral-900 text-lg">Looking for Higher Paying Opportunities?</h3>
            <p className="mt-1 text-sm text-neutral-600 max-w-lg mx-auto">
              DecaJobs scans 20+ boards and delivers the top 10 verified high-paying roles for your skills every morning at 7 AM.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-700 transition-colors shadow-xs"
              >
                Browse Verified Tech Jobs →
              </Link>
              <Link
                href="/tools/resume-checker"
                className="inline-flex items-center rounded-xl border border-primary-300 bg-white px-5 py-2.5 text-xs font-bold text-primary-700 hover:bg-primary-50 transition-colors"
              >
                Score Your Resume ATS Free
              </Link>
            </div>
          </div>
        </div>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </div>
    </div>
  );
}
