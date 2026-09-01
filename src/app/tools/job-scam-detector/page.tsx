import type { Metadata } from "next";
import { JobScamClient } from "./job-scam-client";

export const metadata: Metadata = {
  title: "Free AI Job Scam Detector & Legitimacy Checker | DecaJobs",
  description:
    "Check if a job posting or offer is legitimate or a scam. Detect fake job offers, phishing attempts, upfront payment demands, and suspicious communications.",
  alternates: {
    canonical: "https://decajob.com/tools/job-scam-detector",
  },
  openGraph: {
    title: "Free AI Job Scam Detector & Legitimacy Checker | DecaJobs",
    description:
      "Protect yourself from online job scams. Analyze job descriptions and contact info for red flags in real time.",
    url: "https://decajob.com/tools/job-scam-detector",
    type: "website",
  },
};

export default function JobScamDetectorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI Job Scam Detector",
        "url": "https://decajob.com/tools/job-scam-detector",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "AI tool to check job offer authenticity and identify fraudulent job listings.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are common signs of a fake job scam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Red flags include demands for upfront payment, communication restricted to messaging apps like Telegram, unrealistically high pay for basic work, and fake company domains.",
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
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Job Scam Detector</h1>
          <p className="mt-3 text-neutral-600">Paste a job listing and our AI will check if it&apos;s legitimate or a potential scam. Free, no login.</p>
        </div>

        <JobScamClient />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Identify and Avoid Online Job Scams</h2>
          <p className="text-neutral-600 leading-relaxed">
            As the number of remote job opportunities has grown, so has the incidence of fraudulent job listings. Scammers use sophisticated tactics to trick job seekers into revealing personal information, transferring money, or performing unpaid work under the guise of a real job opening.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Major Red Flags of a Fake Job Posting</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Asking for money or fees up front</h4>
              <p className="text-sm text-neutral-600 mt-1">Legitimate employers will never charge you for applying, training, training materials, laptop fees, or system setup. If they ask you to send money via UPI, wire transfer, or crypto, it is 100% a scam.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Communications via messaging apps only</h4>
              <p className="text-sm text-neutral-600 mt-1">Be highly suspicious if the entire recruitment process (including interviews and offers) happens strictly over Telegram, WhatsApp, or Signal. Real companies schedule video interviews via Zoom, Teams, or Google Meet.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Unrealistic pay for minimal work</h4>
              <p className="text-sm text-neutral-600 mt-1">If a job promises ₹5,000/day for 1 hour of &quot;data entry&quot; or &quot;liking videos,&quot; it is almost certainly a task-scam designed to drain your bank account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
