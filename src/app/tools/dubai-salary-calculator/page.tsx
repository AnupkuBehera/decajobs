import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DubaiSalaryClient } from "./dubai-client";
import { AdSenseUnit } from "@/components/adsense-unit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dubai & UAE Salary Calculator 2026 - AED to INR, 0% Tax & Cost of Living | DecaJobs",
  description:
    "Calculate your monthly take-home pay in Dubai & UAE. Compare AED to INR/USD, calculate UAE End-of-Service Gratuity, estimate Dubai living costs (rent, DEWA, Metro), and compare with Bangalore/Mumbai CTC.",
  keywords: [
    "dubai salary calculator",
    "uae salary calculator",
    "aed to inr salary calculator",
    "dubai take home pay",
    "dubai cost of living calculator",
    "uae end of service gratuity calculator",
    "bangalore ctc to dubai salary equivalent",
    "tax free salary dubai 2026",
  ],
  alternates: {
    canonical: "https://decajob.com/tools/dubai-salary-calculator",
  },
  openGraph: {
    title: "Dubai & UAE Salary & Cost of Living Calculator 2026",
    description:
      "Convert your AED salary offer into real purchasing power, 0% tax savings, and realistic Dubai living expenses.",
    url: "https://decajob.com/tools/dubai-salary-calculator",
    type: "website",
  },
};

export default function DubaiSalaryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is salary in Dubai 100% tax-free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The United Arab Emirates levies 0% personal income tax on employment salaries, bonuses, and gratuities. The entire gross monthly salary agreed upon in your MOHRE contract is deposited into your bank account without income tax deductions.",
        },
      },
      {
        "@type": "Question",
        name: "What is the End of Service Gratuity in UAE Labour Law?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under UAE Federal Decree-Law No. 33 of 2021, full-time employees completing at least one year of continuous service are entitled to End of Service Gratuity: 21 days of basic wage for each year of service for the first 5 years, and 30 days of basic wage for each subsequent year, capped at 2 years of total basic pay.",
        },
      },
      {
        "@type": "Question",
        name: "What AED salary in Dubai equals ₹25 LPA in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Due to housing and lifestyle costs in Dubai, a general rule of thumb for software engineers moving from Tier-1 Indian cities (Bangalore, Mumbai, Gurgaon) is that a ₹25 LPA in-hand lifestyle with equal or greater savings requires approximately 16,000 to 20,000 AED per month.",
        },
      },
      {
        "@type": "Question",
        name: "Can an employer deduct UAE visa fees from my salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Under UAE Labour Law (Article 6 of Ministerial Resolution No. 275 of 2006), the employer is legally obligated to bear 100% of recruitment, residency visa, medical fitness test, and Emirates ID costs. Any employer asking a candidate to pay for their visa is committing an illegal act.",
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
            { label: "Dubai & UAE Salary Calculator" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs mb-3">
            <span>🇦🇪</span> 0% Personal Income Tax • UAE Labour Law 2026
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            Dubai & UAE Salary & Take-Home Calculator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
            Convert your AED job offer into INR/USD, project your UAE End-of-Service Gratuity, estimate Dubai living expenses (housing, DEWA, Metro), and compare with Indian tech CTCs.
          </p>
        </div>

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Interactive Client Calculator */}
        <DubaiSalaryClient />

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* Informative Editorial FAQs */}
        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">
            Essential Guide to Relocating to Dubai & UAE
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                How does the Basic vs Allowance split work in UAE?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Most UAE employment contracts divide your total monthly package into <strong>Basic Salary (typically 60%)</strong> and <strong>Allowances (Housing & Transport, typically 40%)</strong>. 
                This distinction is crucial because your <em>End of Service Gratuity</em> is calculated exclusively on your Basic Salary, not your total gross package.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                How much can an Indian tech engineer save in Dubai?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                A single engineer earning 18,000 AED/month (~₹4.07 Lakh/mo) typically spends 5,500 AED on a private 1BHK in Silicon Oasis or JVC, 1,500 AED on food, and 1,000 AED on transport/utilities, leaving approximately <strong>9,000 to 10,000 AED (~₹2.0L to ₹2.25L) in net monthly savings</strong> completely tax-free.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-base">
                Looking for verified tech jobs in Dubai & Abu Dhabi?
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Browse our dedicated hub for verified listings with visa sponsorship and tax-free packages:{" "}
                <Link
                  href="/jobs/country/ae"
                  className="font-bold text-primary-600 hover:underline"
                >
                  Explore UAE & Dubai Tech Jobs →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
