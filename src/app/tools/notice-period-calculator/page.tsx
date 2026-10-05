import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NoticePeriodClient } from "./notice-period-client";
import { AdSenseUnit } from "@/components/adsense-unit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notice Period Calculator India 2026 - Last Working Day & Buyout | DecaJobs",
  description:
    "Calculate your exact Last Working Day (LWD) in India based on 30, 60, or 90 days notice period, unused earned leaves, and buyout cost. Free resignation email template included.",
  keywords: [
    "notice period calculator",
    "last working day calculator",
    "lwd calculator india",
    "90 days notice period calculator",
    "notice buyout calculator",
    "resignation date calculator",
    "notice period leave adjustment",
  ],
  alternates: {
    canonical: "https://decajob.com/tools/notice-period-calculator",
  },
  openGraph: {
    title: "Notice Period & Last Working Day Calculator India 2026",
    description:
      "Calculate your Last Working Day (LWD), leave adjustments, and notice period buyout for Indian tech companies.",
    url: "https://decajob.com/tools/notice-period-calculator",
    type: "website",
  },
};

export default function NoticePeriodPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is the Last Working Day (LWD) calculated in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In Indian corporate practice, the notice period begins on the calendar day immediately following your formal resignation submission. If your notice period is 90 calendar days and you resign on October 1st, your LWD is December 30th (90 calendar days later), unless public holidays or leave adjustments are agreed upon in writing with your employer.",
        },
      },
      {
        "@type": "Question",
        name: "Can I adjust earned leaves (PL/EL) against my notice period?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, subject to management and HR approval. Under Indian labor policies, an employee can request to adjust unavailed Privilege Leaves (PL) or Earned Leaves (EL) to advance their Last Working Day. If the company denies leave adjustment, they are legally required to encash all accumulated earned leaves in your Full & Final (F&F) settlement.",
        },
      },
      {
        "@type": "Question",
        name: "How does notice period buyout work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Notice buyout occurs when an employee leaves earlier than their mandatory notice period. Either the new prospective employer compensates the current company for the shortfall days, or the shortfall amount (calculated as Shortfall Days × [Monthly Basic or Gross / 30]) is deducted from the employee's final settlement. Both parties must mutually consent to the buyout.",
        },
      },
      {
        "@type": "Question",
        name: "Why do Indian IT companies like TCS, Infosys, and Wipro have 90-day notice periods?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Indian service-based IT companies institute 90-day notice periods primarily for client project stability, knowledge transfer, and backfill hiring cycles. However, mid-size startups and product companies in Bengaluru, Pune, and Hyderabad frequently negotiate 30-day early releases with partial buyout.",
        },
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      {/* Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Free Tools", href: "/tools" },
            { label: "Notice Period Calculator" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            📅 India Corporate Standard 2026
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            Notice Period &amp; Last Working Day Calculator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Find your exact Last Working Day (LWD), adjust earned leaves, calculate notice buyout
            costs, and generate a professional resignation email in seconds.
          </p>
        </div>

        {/* Interactive Calculator Client */}
        <NoticePeriodClient />

        {/* AdSense Unit */}
        <div className="my-12">
          <AdSenseUnit slot="notice-period-calculator-mid" format="auto" />
        </div>

        {/* Deep SEO & Educational Guide */}
        <div className="mt-14 space-y-12 border-t border-neutral-200 pt-12">
          <section className="prose max-w-none text-neutral-700">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              How Notice Periods Work in Indian Tech &amp; Corporate Companies
            </h2>
            <p className="leading-relaxed">
              Resigning from an organization in India involves navigating standard contractual notice periods that
              vary from <strong>15 days</strong> (during probation) to <strong>30 days</strong> (startups and product firms)
              and <strong>90 days (3 months)</strong> at major Indian IT firms like TCS, Infosys, Wipro, HCL, Cognizant, and Accenture.
            </p>
            <p className="leading-relaxed mt-3">
              Calculating your Last Working Day correctly prevents payroll confusion, disputes over Full &amp; Final
              (F&amp;F) settlements, and delays in obtaining your official Relieving Letter and Service Certificate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-2xl mb-2">🗓️</div>
                <h3 className="font-bold text-neutral-900 text-sm">Calendar Days Rule</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  Notice periods are calculated using <strong>calendar days</strong>, not working days. Weekends and
                  national holidays count towards your notice period unless explicitly stated in your offer letter.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-2xl mb-2">🏖️</div>
                <h3 className="font-bold text-neutral-900 text-sm">Earned Leaves (EL/PL)</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  You have the right to request leave adjustment against your notice. If the employer needs you to serve
                  the full duration for project handover, all accrued leaves must be encashed in your F&amp;F.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-2xl mb-2">🤝</div>
                <h3 className="font-bold text-neutral-900 text-sm">Notice Buyout Rights</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  A buyout allows you to pay salary in lieu of notice. Most companies calculate buyout on <strong>Basic Salary</strong>,
                  while some calculate on <strong>Gross Salary</strong>. Confirm your contract clause before agreeing.
                </p>
              </div>
            </div>
          </section>

          {/* Related Tools Callout */}
          <div className="rounded-2xl bg-gradient-to-r from-primary-900 to-neutral-900 p-8 text-white">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-white">Planning your next career step?</h3>
              <p className="mt-2 text-sm text-neutral-300">
                Check your take-home pay with our In-Hand Salary Calculator or test your resume against ATS bots before applying to immediate joiner roles.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tools/in-hand-salary-calculator"
                  className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  💰 In-Hand Salary Calculator →
                </Link>
                <Link
                  href="/tools/resume-checker"
                  className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-500 transition-colors"
                >
                  📄 Check ATS Resume Score →
                </Link>
                <Link
                  href="/jobs"
                  className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-700 transition-colors"
                >
                  🔍 Browse Immediate Joiner Jobs →
                </Link>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq, index) => (
                <div key={index} className="rounded-xl border border-neutral-200 p-5 bg-white">
                  <h3 className="text-base font-semibold text-neutral-900">{faq.name}</h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
