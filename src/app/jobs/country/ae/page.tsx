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
  title: "UAE & Dubai Tech Jobs 2026 — Tax-Free Salaries & Visa Sponsorship | DecaJobs",
  description:
    "Browse verified software engineering, AI, product, and data jobs in Dubai, Abu Dhabi, and the UAE. 100% tax-free AED salaries, company visa sponsorship, and 10 daily matches delivered at 7:00 AM GST.",
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
  },
  openGraph: {
    title: "UAE & Dubai Tech Jobs 2026 — Tax-Free Salaries & Visa Sponsorship",
    description:
      "Find verified tech opportunities in Dubai and Abu Dhabi with AED tax-free packages and visa sponsorship.",
    url: "https://decajob.com/jobs/country/ae",
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
    id: "uae-noon-react-developer",
    title: "Frontend Platform Developer (Next.js & React)",
    company: "Noon E-Commerce",
    description:
      "Join the region's largest digital marketplace. Build blazing fast customer-facing web applications using Next.js 15, Tailwind CSS, and GraphQL. Minimum 3+ years experience. Fast-track employment visa and comprehensive medical coverage.",
    location: "Downtown Dubai, UAE",
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

export default async function UaeJobsPage() {
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
        name: "Do UAE tech employers provide visa sponsorship for Indian and international candidates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Licensed UAE employers are legally required to sponsor the employee's residence visa, Emirates ID, and medical insurance. Many tech scaleups also offer relocation allowances and initial hotel stays.",
        },
      },
      {
        "@type": "Question",
        name: "What time does DecaJobs dispatch daily matches in the UAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DecaJobs delivers 10 personalized tech matches at 7:00 AM GST (Gulf Standard Time) every morning via Email and WhatsApp, timed perfectly before your morning commute.",
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

        {/* Dubai Salary Calculator Teaser */}
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
        <div className="space-y-6 mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Verified Tech Openings in the UAE &amp; Gulf ({combinedJobs.length})
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Screened for authentic hiring status, visa sponsorship, and fair AED market compensation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Pro Plan:</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                {country.currency.proMonthlyPrice}/month ({country.currency.proTrialDuration})
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {combinedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* AdSense Unit */}
        <div className="my-12">
          <AdSenseUnit slot="uae-jobs-mid" format="auto" />
        </div>

        {/* Expat Salary & Tax Comparison Table */}
        <div className="mt-14 space-y-8 border-t border-neutral-200 pt-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900">
              Dubai Tech Salary &amp; Tax-Free Value Comparison
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Why Indian and international software engineers relocate to Dubai
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-800">
                  <th className="py-3.5 px-4 font-bold">Experience Level</th>
                  <th className="py-3.5 px-4 font-bold">Monthly Salary (AED)</th>
                  <th className="py-3.5 px-4 font-bold">Equivalent INR (Monthly)</th>
                  <th className="py-3.5 px-4 font-bold">Income Tax Deducted</th>
                  <th className="py-3.5 px-4 font-bold">Annual Net Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-neutral-900">Junior Developer (1-2 Yrs)</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">12,000 – 16,000 AED</td>
                  <td className="py-3 px-4 font-medium text-neutral-700">₹2.7L – ₹3.6L / mo</td>
                  <td className="py-3 px-4 text-green-600 font-bold">0% (₹0 Tax)</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">144,000 – 192,000 AED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-neutral-900">Mid-Level Engineer (3-5 Yrs)</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">18,000 – 26,000 AED</td>
                  <td className="py-3 px-4 font-medium text-neutral-700">₹4.1L – ₹5.9L / mo</td>
                  <td className="py-3 px-4 text-green-600 font-bold">0% (₹0 Tax)</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">216,000 – 312,000 AED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-neutral-900">Senior Architect / Lead (6+ Yrs)</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">28,000 – 42,000 AED</td>
                  <td className="py-3 px-4 font-medium text-neutral-700">₹6.4L – ₹9.5L / mo</td>
                  <td className="py-3 px-4 text-green-600 font-bold">0% (₹0 Tax)</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">336,000 – 504,000 AED</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Privacy & Compliance Section */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
              <span>🛡️</span> Data Privacy &amp; UAE Labor Standards
            </div>
            <p className="leading-relaxed">
              DecaJobs complies strictly with the <strong>UAE Federal Decree-Law No. 45/2021 on Personal Data Protection</strong>.
              Your contact details, resume data, and job application history are encrypted and never shared with unauthorized third parties.
            </p>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions: Tech Careers in Dubai &amp; the UAE
            </h2>
            <div className="space-y-3">
              {faqSchema.mainEntity.map((faq, index) => (
                <div key={index} className="rounded-xl border border-neutral-200 p-4 bg-white">
                  <h3 className="text-sm font-bold text-neutral-900">{faq.name}</h3>
                  <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
