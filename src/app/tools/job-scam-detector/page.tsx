import type { Metadata } from "next";
import { JobScamClient } from "./job-scam-client";
import { AdSenseUnit } from "@/components/adsense-unit";

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

        <AdSenseUnit label="Advertisement" className="my-10" />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">How to Identify and Avoid Online Job Scams</h2>
          <p className="text-neutral-600 leading-relaxed">
            As the number of remote job opportunities has grown, so has the incidence of fraudulent job listings. Scammers use sophisticated tactics to trick job seekers into revealing personal information, transferring money, or performing unpaid work under the guise of a real job opening.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Common Scam Patterns by Region</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                <span>🇦🇪</span> UAE &amp; Gulf Visa &amp; Relocation Scams
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                The most prevalent Gulf scam involves a lavish offer letter (e.g. 20,000+ AED/month) without a proper technical interview, followed by an urgent request to pay 1,500 - 3,000 AED to a specific &quot;approved travel agency&quot; for visa processing or medical insurance. <strong>Under UAE Labour Law (Ministerial Resolution 275/2006, Article 6), the employer is legally mandated to bear 100% of all visa, medical, and Emirates ID costs.</strong> Any demand for payment from the candidate is 100% fraudulent.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                <span>🇮🇳</span> India Laptop Deposit &amp; Registration Fee Scams
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                Targeting freshers and remote job seekers, scammers pose as HR from TCS, Cognizant, or fast-growing startups. After an automated email &quot;selection,&quot; candidates are asked to transfer ₹2,000 to ₹5,000 via UPI as a refundable courier fee or security deposit for a company MacBook/laptop. Legitimate corporate entities in India never request money before or after onboarding.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                <span>🌍</span> Remote Task &amp; Telegram Crypto Schemes
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                Common in US, UK, and international remote positions, these scams offer $200–$500/day for minimal work like rating apps or liking videos. They pay a small nominal reward at first to build trust, then lock the funds behind a &quot;VIP recharge&quot; requiring you to deposit cryptocurrency into their wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
