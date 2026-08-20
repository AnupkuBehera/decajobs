import type { Metadata } from "next";
import { ResumeCheckerClient } from "./resume-checker-client";

export const metadata: Metadata = {
  title: "Free AI Resume Checker & ATS Score Calculator | DecaJobs",
  description:
    "Check your resume ATS score instantly for free. Get detailed feedback on formatting, keyword density, section readability, and action verbs to pass recruiter screeners.",
  alternates: {
    canonical: "/tools/resume-checker",
  },
  openGraph: {
    title: "Free AI Resume Checker & ATS Score Calculator | DecaJobs",
    description:
      "Score your resume instantly with AI. Find out why your resume is getting rejected and fix formatting, keywords, and achievements before applying.",
    url: "https://decajob.com/tools/resume-checker",
    type: "website",
  },
};

export default function ResumeCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI Resume Checker & ATS Score Calculator",
        "url": "https://decajob.com/tools/resume-checker",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "An AI-powered tool that analyzes resumes for ATS compliance, keyword optimization, and formatting best practices.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a good ATS resume score?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "A score of 80 or above is considered excellent. It means your resume has good formatting, uses strong action verbs, includes relevant keywords, and contains quantifiable achievements.",
            },
          },
          {
            "@type": "Question",
            "name": "Will a creative resume format help pass ATS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Unless you are applying for a highly visual role where a portfolio is sent separately, creative layouts often scramble ATS parsers. Single-column clean layouts work best.",
            },
          },
          {
            "@type": "Question",
            "name": "How often should I update my resume?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "You should tailor your resume for every single job application to match that job's specific keywords. Keep a master resume and extract customized versions.",
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
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Free AI Resume Checker & ATS Scanner
          </h1>
          <p className="mt-3 text-neutral-600">
            Get your resume scored instantly. Find out what&apos;s working and what needs improvement.
          </p>
        </div>

        <ResumeCheckerClient />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Complete Guide: How to Pass the ATS Resume Test</h2>
          <p className="text-neutral-600 leading-relaxed">
            Over 95% of Fortune 500 companies use an Applicant Tracking System (ATS) to filter resumes before a recruiter ever looks at them. If your resume isn&apos;t formatted and optimized for these scanners, your application might be rejected automatically.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">What is an Applicant Tracking System (ATS)?</h3>
          <p className="text-neutral-600 leading-relaxed">
            An ATS is a software application that handles the recruitment process, including sorting and ranking job applications. It scans resumes for specific keywords, job titles, education, and skills. Resumes that match the job description closely are passed to the hiring manager, while low-scoring resumes are filtered out.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">How DecaJobs AI Resume Checker Works</h3>
          <p className="text-neutral-600 leading-relaxed">
            Our AI Resume Checker simulates how modern ATS scanners read your CV. It evaluates:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Keyword Density:</strong> Checks for essential skills and industry terms that match common job postings.</li>
            <li><strong>Structure & Readability:</strong> Ensures sections (Education, Experience, Skills) are clearly demarcated.</li>
            <li><strong>Impact Metrics:</strong> Looks for action verbs and quantifiable results (e.g., percentages, revenue, time saved).</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Essential Tips to Optimize Your Resume</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Use standard section headings</h4>
              <p className="text-sm text-neutral-600 mt-1">Stick to simple titles like &quot;Work Experience,&quot; &quot;Education,&quot; &quot;Skills,&quot; and &quot;Summary.&quot; Creative titles like &quot;My Professional Journey&quot; confuse the parser.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Tailor keywords for every job</h4>
              <p className="text-sm text-neutral-600 mt-1">Read the target job description carefully. Integrate the exact phrases and skills mentioned (e.g., if it says &quot;SQL Database Management,&quot; don&apos;t just write &quot;SQL&quot;).</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Avoid graphs, images, and tables</h4>
              <p className="text-sm text-neutral-600 mt-1">Many older ATS systems cannot parse text inside tables, text boxes, or images. Stick to a single-column clean layout.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">4. Focus on measurable achievements</h4>
              <p className="text-sm text-neutral-600 mt-1">Instead of listing responsibilities, write about accomplishments. Use the formula: <strong>Action Verb + Task + Measurable Outcome</strong>.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">5. Choose the right file format</h4>
              <p className="text-sm text-neutral-600 mt-1">A PDF is generally best to preserve formatting, but check the job portal guidelines. Some legacy systems prefer Microsoft Word (.docx).</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4">
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                What is a good ATS resume score?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                A score of 80 or above is considered excellent. It means your resume has good formatting, uses strong action verbs, includes relevant keywords, and contains quantifiable achievements.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                Will a creative resume format help?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                Unless you are applying for a highly visual role (like graphic designer or artist) where a portfolio is sent separately, creative layouts often do more harm than good because they scramble ATS parsers. Simplicity wins.
              </p>
            </details>
            <details className="group border-b border-neutral-200 pb-4">
              <summary className="flex cursor-pointer justify-between items-center font-medium text-neutral-900">
                How often should I update my resume?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-neutral-600 mt-2">
                You should tailor your resume for every single job application to match that job&apos;s specific keywords. Keep a &quot;master resume&quot; containing all your projects, and pull from it to construct tailored versions.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
