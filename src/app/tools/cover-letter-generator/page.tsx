import type { Metadata } from "next";
import { CoverLetterClient } from "./cover-letter-client";
import { AdSenseUnit } from "@/components/adsense-unit";

export const metadata: Metadata = {
  title: "Free AI Cover Letter Generator & Writer | DecaJobs",
  description:
    "Generate tailored professional cover letters in seconds. Simply input your job role, company name, and key skills to generate high-converting application letters.",
  alternates: {
    canonical: "https://decajob.com/tools/cover-letter-generator",
  },
  openGraph: {
    title: "Free AI Cover Letter Generator & Writer | DecaJobs",
    description:
      "Write customized, ATS-friendly cover letters tailored to any job application instantly.",
    url: "https://decajob.com/tools/cover-letter-generator",
    type: "website",
  },
};

export default function CoverLetterGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI Cover Letter Generator",
        "url": "https://decajob.com/tools/cover-letter-generator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "AI tool for generating customized, role-tailored application letters for job seekers.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are cover letters still required in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Over 50% of recruiters state that a tailored cover letter sets candidates apart, especially when applying to competitive tech and management roles.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">AI Cover Letter Generator</h1>
          <p className="mt-3 text-neutral-600">Generate a professional cover letter in seconds. Free, no login.</p>
        </div>

        <CoverLetterClient />

        <AdSenseUnit label="Sponsored Career Tools Partner" className="my-10" />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Write a Professional Cover Letter</h2>
          <p className="text-neutral-600 leading-relaxed">
            A great cover letter isn&apos;t just a summary of your resume — it&apos;s your chance to tell a compelling story, connect your skills directly to the employer&apos;s goals, and show genuine enthusiasm for the role.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">4 Key Sections of an Effective Cover Letter</h3>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Hook / Opener:</strong> Mention the specific role and company, and state why you are excited about their mission.</li>
            <li><strong>Core Value Proposition:</strong> Detail 2-3 specific accomplishments that prove you can solve their challenges.</li>
            <li><strong>Culture &amp; Fit:</strong> Demonstrate that you understand their products, values, and market positioning.</li>
            <li><strong>Call to Action:</strong> Politeness with a clear request for an interview or conversation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
