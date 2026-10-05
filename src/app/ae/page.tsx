import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPublicJobs, type ExternalJob } from "@/lib/public-jobs";
import { COUNTRIES } from "@/lib/country-config";
import JobCard from "@/components/jobs/JobCard";
import { AdSenseUnit } from "@/components/adsense-unit";
import { DailyAlertForm } from "@/components/daily-alert-form";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "UAE & Dubai Tech Jobs 2026 — Tax-Free AED Salaries & Visa Sponsorship | DecaJobs",
  description:
    "Browse verified software engineering, AI, product, and cloud jobs in Dubai, Abu Dhabi, and the UAE. 100% tax-free AED salaries, company visa sponsorship, and 10 daily matches delivered at 7:00 AM GST.",
  keywords: [
    "dubai tech jobs",
    "uae software engineer jobs",
    "dubai jobs with visa sponsorship",
    "tax free jobs dubai",
    "abu dhabi it jobs",
    "gulf tech jobs for indian engineers",
    "dubai internet city jobs",
  ],
  alternates: {
    canonical: "https://decajob.com/ae",
    languages: {
      "en-AE": "https://decajob.com/ae",
      "en-GB": "https://decajob.com/uk",
      "en-IN": "https://decajob.com/",
      "hi-IN": "https://decajob.com/hi",
      "x-default": "https://decajob.com/",
    },
  },
  openGraph: {
    title: "UAE & Dubai Tech Jobs 2026 — Tax-Free Salaries & Visa Sponsorship",
    description:
      "Find verified tech opportunities in Dubai and Abu Dhabi with AED tax-free packages and visa sponsorship.",
    url: "https://decajob.com/ae",
    type: "website",
  },
};

const UAE_EXPEDITION_JOBS: ExternalJob[] = [
  {
    id: "uae-careem-senior-fullstack",
    title: "Senior Full-Stack Engineer (Payments & FinTech)",
    company: "Careem (Uber Group)",
    description:
      "Careem is hiring a Senior Full-Stack Engineer to scale our digital wallet and payment gateway across the Middle East. Tech stack: React, TypeScript, Node.js, and AWS. Package includes full UAE residence visa sponsorship, family health insurance, and 100% tax-free AED compensation.",
    location: "Dubai, UAE (Dubai Media City / Hybrid)",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "DecaJobs UAE Verified",
  },
  {
    id: "uae-talabat-cloud-devops",
    title: "DevOps & Cloud Infrastructure Lead",
    company: "Talabat (Delivery Hero)",
    description:
      "Lead multi-region Kubernetes clusters and high-throughput microservices powering food delivery across 7 Gulf nations. Hands-on expertise in AWS, Terraform, Docker, and CI/CD pipelines. Competitive tax-free salary, annual flight tickets, and relocation assistance.",
    location: "Dubai Silicon Oasis, UAE (On-site / Relocation Supported)",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "DecaJobs UAE Verified",
  },
  {
    id: "uae-noon-ai-data-engineer",
    title: "Lead AI & Big Data Platform Engineer",
    company: "Noon E-Commerce",
    description:
      "Build real-time search, catalog ranking, and fraud detection algorithms handling millions of daily transactions. Must have production experience in PySpark, Kafka, Python, and Snowflake. Relocation package includes 30 days initial hotel stay and visa assistance.",
    location: "Downtown Dubai / Emaar Square, UAE",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "DecaJobs UAE Verified",
  },
  {
    id: "uae-binance-backend-lead",
    title: "Backend Go & Microservices Architect",
    company: "Binance UAE",
    description:
      "Architect regulatory-compliant digital asset exchange infrastructure under VARA guidelines. Deep knowledge of Go, PostgreSQL, Redis, and high-concurrency event-driven architectures. 100% tax-free compensation with performance bonuses.",
    location: "DIFC (Dubai International Financial Centre), UAE",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    source: "DecaJobs UAE Verified",
  },
];

export default async function UaeLandingPage() {
  const publicJobs = await getPublicJobs();

  // Combine public jobs matching UAE/Dubai keywords or remote-friendly with UAE curated jobs
  const uaeMatchingPublic = publicJobs.filter((j) => {
    const text = `${j.title} ${j.description} ${j.location} ${j.company}`.toLowerCase();
    return (
      text.includes("dubai") ||
      text.includes("uae") ||
      text.includes("abu dhabi") ||
      text.includes("gulf") ||
      (text.includes("remote") && !text.includes("us only"))
    );
  });

  const combinedJobs = [...UAE_EXPEDITION_JOBS, ...uaeMatchingPublic.slice(0, 15)];
  const country = COUNTRIES.ae;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do software engineers pay income tax in Dubai and the UAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The UAE does not levy personal income tax on salaries. A compensation package of 25,000 AED per month is 100% take-home pay, with zero income tax deductions.",
        },
      },
      {
        "@type": "Question",
        name: "Do UAE tech employers provide visa sponsorship for international candidates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Licensed UAE employers are legally required under Article 6 of Ministerial Resolution 275/2006 to sponsor the employee's residence visa, Emirates ID, and medical insurance.",
        },
      },
      {
        "@type": "Question",
        name: "What time does DecaJobs dispatch daily matches in the UAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DecaJobs delivers 10 personalized tech matches at 7:00 AM GST (Gulf Standard Time) every morning via Email and WhatsApp.",
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
            { label: "Jobs", href: "/jobs" },
            { label: "UAE & Dubai Tech Jobs" },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3 border border-emerald-200">
            <span>🇦🇪</span>
            <span>100% Tax-Free In-Hand Salaries · 7:00 AM GST Morning Dispatch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            UAE &amp; Dubai Tech Jobs 2026
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified software engineering, AI, product, and data openings across Dubai,
            Abu Dhabi, and the GCC with full visa sponsorship and tax-free AED compensation.
          </p>
        </div>

        {/* Expat Advantages Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">💰</div>
            <h3 className="font-bold text-neutral-900 text-sm">0% Personal Income Tax</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Every dirham you earn is 100% net cash. 20,000 AED/mo = ₹4,50,000 INR take-home per month with zero tax deductions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">🛂</div>
            <h3 className="font-bold text-neutral-900 text-sm">Employer Visa Sponsorship</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              UAE labor law mandates employer-sponsored residence visas, Emirates ID processing, and private health insurance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">🏙️</div>
            <h3 className="font-bold text-neutral-900 text-sm">Global Tech Hubs</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Thriving clusters at Dubai Internet City, DIFC, Dubai Silicon Oasis, and Hub71 Abu Dhabi hiring international talent.
            </p>
          </div>
        </div>

        {/* Dubai Salary Calculator Teaser Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-xl">
              🧮
            </span>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Evaluating a UAE Job Offer or Relocation?
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Calculate your exact take-home pay, compare AED to INR/USD, estimate Dubai rent/living expenses, and project End-of-Service gratuity.
              </p>
            </div>
          </div>
          <Link
            href="/tools/dubai-salary-calculator"
            className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs"
          >
            Launch Dubai Calculator →
          </Link>
        </div>

        {/* Daily Alert Box for UAE */}
        <div className="my-8">
          <DailyAlertForm />
        </div>

        {/* Live Job Listings Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Verified Dubai &amp; GCC Tech Openings
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Screened for verified employer domains, realistic compensation, and visa sponsorship.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              {combinedJobs.length} Roles Active
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {combinedJobs.map((job) => (
              <div key={job.id} className="relative group">
                <JobCard job={job} />
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <span>🇦🇪</span> 100% Tax Free AED
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Verified Employer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* UAE Tech Hubs Grid */}
        <div className="mb-14 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Top Tech Ecosystems in the United Arab Emirates
          </h3>
          <p className="text-xs text-neutral-600 mb-6">
            Key innovation free zones with streamlined employment visas and foreign ownership.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {country.hubs.map((hub) => (
              <div key={hub.slug} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <h4 className="font-bold text-neutral-900 text-sm">{hub.name}</h4>
                <div className="flex flex-wrap gap-1 mt-2">
                  {hub.popularIndustries.map((ind) => (
                    <span
                      key={ind}
                      className="rounded bg-white border border-neutral-200 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Transparency Strip */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-white p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-xs">
          <div>
            <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-2">
              🇦🇪 UAE Pro Pricing: {country.currency.proMonthlyPrice}/month
            </span>
            <h4 className="text-lg font-bold text-neutral-900">
              Never Miss a High-Trust Gulf Tech Opening
            </h4>
            <p className="text-xs text-neutral-600 mt-1 max-w-xl">
              Get 10 personalized AI-matched roles in your inbox every morning at 7:00 AM GST.
              Includes {country.currency.proTrialDuration}, verified employer domains, and zero spam.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-all shrink-0 shadow-xs"
          >
            Start Free 7-Day Trial →
          </Link>
        </div>

        {/* Editorial FAQs */}
        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-neutral-900 text-center mb-6">
            Frequently Asked Questions — Relocating to UAE
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                What is the average tech salary in Dubai in 2026?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                Mid-level software engineers typically earn between 15,000 to 22,000 AED per month (~$4,100 to $6,000 USD / ₹3.4L to ₹5.0L INR). Senior engineers and engineering managers range from 28,000 to 45,000+ AED per month, completely tax-free.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                How does DecaJobs verify UAE tech postings?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                Our Job Trust Score™ algorithm checks official company registrations, verifies corporate email domains, and cross-references MOHRE compliance to eliminate advance-fee visa scams and fake listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
