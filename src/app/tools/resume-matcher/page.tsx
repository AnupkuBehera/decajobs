import type { Metadata } from "next";
import { ResumeMatcherClient } from "./resume-matcher-client";

export const metadata: Metadata = {
  title: "Free AI Resume-to-Job Matcher & Keyword Compare | DecaJobs",
  description:
    "Compare your resume against any job description. Get an instant match percentage score, missing ATS keywords list, and custom bullet recommendations.",
  alternates: {
    canonical: "/tools/resume-matcher",
  },
  openGraph: {
    title: "Free AI Resume-to-Job Matcher & Keyword Compare | DecaJobs",
    description:
      "Match your resume to any job description. Uncover missing ATS keywords and optimize your CV before submitting your application.",
    url: "https://decajob.com/tools/resume-matcher",
    type: "website",
  },
};

export default function ResumeMatcherPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI Resume-to-Job Matcher",
        "url": "https://decajob.com/tools/resume-matcher",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "AI keyword comparison tool that measures alignment between candidate resume and specific job descriptions.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the AI Resume Matcher calculate match percentage?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The tool compares the skill keywords, domain experience, and core qualifications in your resume against the target job posting.",
            },
          },
          {
            "@type": "Question",
            "name": "Why are missing keywords important for ATS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Applicant Tracking Systems scan for exact matches of terms listed in the job description. Including missing keywords helps pass initial ATS filters.",
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
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-3">
            Free ATS Keyword Tool
          </span>
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            AI Resume-to-Job Matcher
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">
            Find out how well your resume matches any job posting. Get your match score, missing ATS keywords, and AI-tailored bullet points instantly.
          </p>
        </div>

        <ResumeMatcherClient />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Why Matching Your Resume to the Job Description Matters
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Recruiters set up automated ATS filters that rank applications by how closely their text matches the target job description. Submitting a generic resume results in low match scores and immediate rejection.
          </p>
          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">
            3 Steps to Optimize Your Application
          </h3>
          <ol className="list-decimal pl-5 text-neutral-600 space-y-2">
            <li><strong>Paste both texts:</strong> Copy your resume and the full job description into the fields above.</li>
            <li><strong>Review missing keywords:</strong> Incorporate the missing technical and soft skills into your experience bullets naturally.</li>
            <li><strong>Use tailored bullet points:</strong> Copy our AI-suggested bullet points directly into your CV to boost your ATS score.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
