import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UsSalaryClient } from "./us-client";
import { AdSenseUnit } from "@/components/adsense-unit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "US Paycheck & Salary Calculator 2026 - Federal, State & 401(k) Take-Home Pay | DecaJobs",
  description:
    "Calculate your exact monthly, bi-weekly, and annual net take-home pay across US states (CA, NY, WA, TX, MA, IL). Accurate breakdown of 2026 Federal tax brackets, FICA (Social Security & Medicare), state taxes, 401(k) pretax savings, and W-2 vs 1099 comparison.",
  keywords: [
    "us salary calculator",
    "us paycheck calculator 2026",
    "california take home pay calculator",
    "new york tech salary after tax",
    "texas zero income tax calculator",
    "washington state tech paycheck",
    "w2 vs 1099 calculator",
    "software engineer us take home salary",
    "fica tax calculator 2026",
    "401k tax savings calculator",
  ],
  alternates: {
    canonical: "https://decajob.com/tools/us-salary-calculator",
  },
  openGraph: {
    title: "US Paycheck & Salary Calculator 2026 - Federal, State & Take-Home Pay",
    description:
      "Accurate US take-home pay calculator with 2026 tax brackets, state rates (CA, NY, WA, TX, MA), FICA, and 401(k) deductions.",
    url: "https://decajob.com/tools/us-salary-calculator",
    type: "website",
  },
};

export default function UsSalaryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is US Federal Income Tax calculated for 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Federal income tax uses progressive marginal brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%). Your gross salary is first reduced by pre-tax deductions like 401(k) and health insurance, followed by either the Standard Deduction ($15,000 for Single filers in 2026) or itemized deductions before tax is applied.",
        },
      },
      {
        "@type": "Question",
        name: "What is FICA tax and how much is withheld from my US paycheck?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FICA consists of Social Security tax (6.2% on income up to the $176,100 wage base limit) and Medicare tax (1.45% on all earnings, plus an additional 0.9% for high earners making over $200,000 single / $250,000 married). Employers match this 7.65% for W-2 employees.",
        },
      },
      {
        "@type": "Question",
        name: "Which US states have 0% state income tax for tech workers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nine US states have no personal state income tax on earned wages: Washington (Seattle/Bellevue tech hub), Texas (Austin/Dallas tech hub), Florida (Miami/Tampa), Nevada, Tennessee, Wyoming, South Dakota, Alaska, and New Hampshire.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between W-2 employment and 1099 contractor income?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "W-2 employees have taxes withheld automatically by their employer, who pays half of FICA taxes (7.65%). 1099 independent contractors are responsible for the entire 15.3% Self-Employment Tax (SECA), though half of that tax is deductible as an adjustment to income on Form 1040.",
        },
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "US Salary Calculator" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-300 px-3.5 py-1 text-xs font-bold text-blue-900 shadow-2xs mb-3">
            <span>🇺🇸</span> IRS 2026 Federal &amp; State Tax Withholding Calculator
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            US Take-Home Pay &amp; Paycheck Calculator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
            Calculate your exact monthly, bi-weekly, and annual net salary in US Dollars ($). Factor in Federal brackets, FICA (Social Security &amp; Medicare), State taxes (CA, NY, WA, TX, MA, IL), 401(k) contributions, and compare W-2 vs 1099 contracts.
          </p>
        </div>

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Interactive Calculator Client Component */}
        <UsSalaryClient />

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* Contextual Career & Tax Insights */}
        <div className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Understanding Your US Tech Compensation Package
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-neutral-900 mb-1.5 text-base">
                Base Salary vs. Total Compensation (TC)
              </h3>
              <p>
                In American tech companies (FAANG, tier-1 tech firms, and high-growth scaleups), Base Salary is only one part of your compensation. Total Compensation usually includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Base Salary:</strong> Guaranteed W-2 bi-weekly cash pay.</li>
                <li><strong>Restricted Stock Units (RSUs):</strong> Public equity that vests quarterly over a 4-year schedule (e.g. 25% per year), taxed as ordinary income upon vesting.</li>
                <li><strong>Performance Bonus:</strong> Annual or semi-annual cash bonuses (typically 10%–25% of base).</li>
                <li><strong>Sign-on Bonus:</strong> One-time cash payment upon joining, often with a 1-year clawback clause.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-1.5 text-base">
                State Income Tax Strategies: Relocating to 0% Tax States
              </h3>
              <p>
                A software engineer earning $200,000 base in California pays approximately $13,500+ in state income taxes annually. In contrast, moving to Seattle, Washington or Austin, Texas reduces state income tax to $0, immediately putting over $1,100+ extra cash into your monthly paycheck while still enjoying world-class tech ecosystems.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <strong>💡 Pro-Tip:</strong> Pre-tax 401(k) contributions (up to $23,500 in 2026) lower your adjusted gross income (AGI), which directly reduces both your Federal and State tax bills.
              </div>
            </div>
          </div>
        </div>

        {/* Internal Cross-Linking Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <div className="text-xs text-neutral-600">
            Looking for jobs in the United States? Browse hundreds of verified tech roles with transparent salary disclosures.
          </div>
          <div className="flex gap-2">
            <Link
              href="/us"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-2xs"
            >
              🇺🇸 Browse US Tech Jobs →
            </Link>
            <Link
              href="/jobs/location/san-francisco"
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              🌉 Silicon Valley Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

