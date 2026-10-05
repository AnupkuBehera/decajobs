import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AtsScannerClient } from "./ats-scanner-client";
import { AdSenseUnit } from "@/components/adsense-unit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free ATS Keyword Scanner for Job Descriptions 2026 | DecaJobs",
  description:
    "Free ATS keyword scanner and resume checker. Paste any job description to instantly find missing keywords, hard skills, and boost your ATS resume match score.",
  keywords: [
    "ats keyword scanner",
    "ats resume scanner",
    "job description keyword scanner",
    "ats keyword matcher",
    "resume keyword checker",
    "resume ats score calculator",
    "free ats checker online",
  ],
  alternates: {
    canonical: "https://decajob.com/tools/ats-keyword-scanner",
  },
  openGraph: {
    title: "Free ATS Keyword Scanner for Job Descriptions",
    description:
      "Find missing skills and keywords between your resume and any job description to beat the ATS bots.",
    url: "https://decajob.com/tools/ats-keyword-scanner",
    type: "website",
  },
};

export default function AtsKeywordScannerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do ATS (Applicant Tracking Systems) scan resumes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ATS software (such as Workday, Greenhouse, Lever, and Taleo) parses resumes into structured text fields and calculates a relevance score by matching keywords, job titles, and hard skills from the employer's job description against your resume content. Resumes falling below an internal match threshold are often filtered out before a human recruiter reviews them.",
        },
      },
      {
        "@type": "Question",
        name: "What is a good ATS match score?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An ATS match score of 75% or higher is considered strong. It signifies that your resume covers the core hard skills, frameworks, and job titles required by the hiring manager without keyword stuffing.",
        },
      },
      {
        "@type": "Question",
        name: "Is this ATS Keyword Scanner completely free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The DecaJobs ATS Keyword Scanner is 100% free with no account creation, credit card, or resume upload required. All text parsing happens directly in your browser session.",
        },
      },
      {
        "@type": "Question",
        name: "Should I include exact keyword phrasing from the job description?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. While modern ATS systems recognize some synonyms, hiring managers configure automated filters searching for exact acronyms and spellings (e.g., 'React' vs 'ReactJS', 'AWS' vs 'Amazon Web Services'). Including both the spelled-out form and common acronym is best practice.",
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
            { label: "Free Tools", href: "/tools" },
            { label: "ATS Keyword Scanner" },
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 mb-3">
            🎯 100% Free · No Login Required
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            ATS Keyword Scanner &amp; Matcher
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Scan your target job description against your resume. Pinpoint missing skills,
            check your match percentage, and beat automated screening filters.
          </p>
        </div>

        {/* Interactive Scanner Client */}
        <AtsScannerClient />

        {/* AdSense Unit */}
        <div className="my-12">
          <AdSenseUnit slot="ats-keyword-scanner-mid" format="auto" />
        </div>

        {/* Educational Content & Guidelines */}
        <div className="mt-14 space-y-12 border-t border-neutral-200 pt-12">
          <section className="prose max-w-none text-neutral-700">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              How to Beat Applicant Tracking Systems in 2026
            </h2>
            <p className="leading-relaxed">
              Over 90% of Fortune 500 companies and growing tech startups filter job applicants through
              Applicant Tracking Systems (ATS). When an opening receives 200+ applicants, hiring teams rely on
              automated algorithms to sort and rank candidates based on keyword frequency, technical skills, and job title alignment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-2xl mb-2">🏷️</div>
                <h3 className="font-bold text-neutral-900 text-sm">Target Exact Keywords</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  If the job post mentions &quot;TypeScript&quot; 4 times and &quot;Kubernetes&quot; 2 times, make sure those exact words appear in your experience bullets, not just a comma-separated skills list.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold text-neutral-900 text-sm">Contextualize with Metrics</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  ATS parsers look for action verbs paired with quantifiable results (e.g. &quot;Reduced latency by 40%&quot;). Avoid empty buzzwords without measurable impact.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-2xl mb-2">📑</div>
                <h3 className="font-bold text-neutral-900 text-sm">Clean Formatting</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  Avoid multi-column tables, complex graphics, or text boxes that confuse ATS parsers. Standard single-column PDF or docx is parsed accurately 99% of the time.
                </p>
              </div>
            </div>
          </section>

          {/* Related Tools Callout */}
          <div className="rounded-2xl bg-neutral-900 p-8 text-white">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-white">Automate your entire job hunt</h3>
              <p className="mt-2 text-sm text-neutral-300">
                Instead of manually tailoring resumes to hundreds of jobs, DecaJobs matches your exact skills to 10 verified openings every morning at 7:00 AM.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-500 transition-colors"
                >
                  ⚡ Start 7-Day Free Trial →
                </Link>
                <Link
                  href="/tools/resume-matcher"
                  className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-700 transition-colors"
                >
                  🎯 AI Resume-to-Job Matcher →
                </Link>
                <Link
                  href="/tools/notice-period-calculator"
                  className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 hover:bg-neutral-700 transition-colors"
                >
                  📅 Notice Period Calculator →
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
