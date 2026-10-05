import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UkSalaryClient } from "./uk-client";
import { AdSenseUnit } from "@/components/adsense-unit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UK Salary Calculator 2026 - PAYE, National Insurance & Take-Home Pay | DecaJobs",
  description:
    "Calculate your exact monthly and annual take-home pay in the UK. Comprehensive breakdown of HMRC PAYE income tax, Class 1 National Insurance (8%), workplace pension (5%), and Skilled Worker Visa £38,700 threshold comparison.",
  keywords: [
    "uk salary calculator",
    "paye salary calculator",
    "uk take home pay calculator",
    "national insurance calculator 2026",
    "uk skilled worker visa salary threshold",
    "london tech salary take home",
    "gbp to inr salary calculator",
    "uk tax bands 2025 2026",
  ],
  alternates: {
    canonical: "https://decajob.com/tools/uk-salary-calculator",
  },
  openGraph: {
    title: "UK Salary Calculator 2026 - PAYE, NI & Take-Home Pay",
    description:
      "Accurate take-home salary calculator for UK employees and international visa applicants.",
    url: "https://decajob.com/tools/uk-salary-calculator",
    type: "website",
  },
};

export default function UkSalaryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the UK Income Tax bands for 2025/26 and 2026/27?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The standard Personal Allowance is £12,570 (tax-free). Earnings between £12,571 and £50,270 are taxed at the Basic Rate of 20%. Earnings between £50,271 and £125,140 are taxed at the Higher Rate of 40%. Any income above £125,140 is taxed at the Additional Rate of 45%.",
        },
      },
      {
        "@type": "Question",
        name: "How much is National Insurance (NI) in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For employees, Class 1 National Insurance is charged at 8% on earnings between the primary threshold (£12,570/year or £1,048/month) and the upper earnings limit (£50,270/year or £4,189/month). Earnings above £50,270 incur a 2% National Insurance rate.",
        },
      },
      {
        "@type": "Question",
        name: "What is the minimum salary requirement for a UK Skilled Worker Visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The general minimum salary threshold set by the UK Home Office is £38,700 per year (or the going rate for your specific occupation code, whichever is higher). Qualified software development and data roles typically meet and exceed this benchmark.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Personal Allowance taper work above £100,000?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If your adjusted net income exceeds £100,000, your £12,570 Personal Allowance is reduced by £1 for every £2 of income above £100,000. It reaches £0 once your income reaches £125,140, creating an effective marginal tax rate of 60% in that bracket.",
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
            { label: "UK Salary Calculator" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-300 px-3.5 py-1 text-xs font-bold text-blue-900 shadow-2xs mb-3">
            <span>🇬🇧</span> HMRC PAYE &amp; National Insurance 2026/27 Slabs
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            UK Take-Home Salary Calculator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
            Calculate your exact monthly net pay in pounds (£), breakdown PAYE income tax, 8% National Insurance, 5% workplace pension, and check £38,700 Skilled Worker Visa thresholds.
          </p>
        </div>

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Interactive Client Calculator */}
        <UkSalaryClient />

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* Informative Editorial FAQs */}
        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">
            Understanding UK Payslips &amp; Deductions
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                What is the 60% &ldquo;Tax Trap&rdquo; between £100,000 and £125,140?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                When your income reaches £100,000, you lose £1 of your tax-free personal allowance for every £2 earned. In this £25,140 band, you pay 40% income tax plus 20% due to the lost allowance, plus 2% National Insurance, resulting in an effective marginal tax rate of <strong>62%</strong>. Many UK professionals increase their workplace pension salary sacrifice to stay below £100,000.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                How does London Cost of Living compare to other UK cities?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                A software engineer earning £75,000 in London typically spends £1,800–£2,400/month on rent in Zones 2–3, while equivalent housing in Manchester, Leeds, or Birmingham averages £950–£1,300/month, allowing higher discretionary savings on slightly lower gross packages.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                Explore Verified UK Tech Jobs with Certificate of Sponsorship (CoS)
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Looking for UK employers with active Home Office sponsorship licenses?{" "}
                <Link
                  href="/uk"
                  className="font-bold text-primary-600 hover:underline"
                >
                  Browse UK Tech Jobs Hub →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
