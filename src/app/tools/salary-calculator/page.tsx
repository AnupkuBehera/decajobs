import type { Metadata } from "next";
import { SalaryCalculatorClient } from "./salary-calculator-client";

export const metadata: Metadata = {
  title: "Free Tech Salary Calculator & CTC Benchmarking (2026) | DecaJobs",
  description:
    "Check tech salary benchmarks by job role and city (Bangalore, Mumbai, Delhi, Hyderabad, Remote, USA). Compare entry, mid, and senior level compensation packages.",
  alternates: {
    canonical: "https://decajob.com/tools/salary-calculator",
  },
  openGraph: {
    title: "Free Tech Salary Calculator & CTC Benchmarking (2026) | DecaJobs",
    description:
      "Find out what software engineers, data analysts, product managers, and DevOps engineers earn across tech hubs.",
    url: "https://decajob.com/tools/salary-calculator",
    type: "website",
  },
};

export default function SalaryCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free Tech Salary Calculator",
        "url": "https://decajob.com/tools/salary-calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Interactive CTC benchmarking calculator for software engineering, product, and tech roles in India and remote locations.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is CTC structured in tech roles?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "CTC includes Basic Salary, HRA and allowances, variable/performance bonuses, statutory contributions (PF/Gratuity), and equity/RSUs.",
            },
          },
          {
            "@type": "Question",
            "name": "How can I negotiate a higher salary?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Benchmark your value early, state a realistic range based on market median data, focus on achievements, and leverage competing offers.",
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
            Salary Calculator &amp; CTC Benchmark
          </h1>
          <p className="mt-3 text-neutral-600">
            Compare salaries by role and location. Data based on 2025-2026 market rates.
          </p>
        </div>

        <SalaryCalculatorClient />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Understanding Salary Benchmarking &amp; Negotiation</h2>
          <p className="text-neutral-600 leading-relaxed">
            Knowing your market value is the most powerful tool you have when negotiating a new job offer. Salary benchmarking allows you to compare compensation packages for similar roles, locations, and experience levels, ensuring you are paid fairly.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">How is CTC (Cost to Company) Structured?</h3>
          <p className="text-neutral-600 leading-relaxed">
            In many regions, especially India, compensation is discussed as CTC. It is important to look beyond the total number and understand the component breakdown:
          </p>
          <ul className="list-disc pl-5 text-neutral-600 space-y-2">
            <li><strong>Basic Salary:</strong> The core taxable component, which typically forms 30% to 50% of your CTC.</li>
            <li><strong>Allowances:</strong> House Rent Allowance (HRA), Leave Travel Allowance (LTA), and other special allowances designed to reduce tax liability.</li>
            <li><strong>Variable Pay / Performance Bonus:</strong> A performance-linked component. Ensure you know what percentage is guaranteed vs. conditional.</li>
            <li><strong>Retirements &amp; Benefits:</strong> Provident Fund (PF) contributions, Gratuity, and health insurance premiums paid by the employer (often deducted from gross CTC).</li>
            <li><strong>Stock Options / RSUs:</strong> Equity incentives (common in tech and startups) that vest over multiple years.</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5 Steps to Negotiate a 20-40% Higher Salary</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">1. Benchmarking early</h4>
              <p className="text-sm text-neutral-600 mt-1">Research salaries before your first interview. Use this calculator, along with sources like Levels.fyi and Glassdoor, to find the 25th, 50th (median), and 75th percentiles for the role.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">2. Let the employer make the first offer</h4>
              <p className="text-sm text-neutral-600 mt-1">Avoid disclosing your salary expectations too early. If forced, provide a range based on your research: &quot;Based on the market rate for this role, I expect a package between X and Y.&quot;</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">3. Emphasize value, not your personal expenses</h4>
              <p className="text-sm text-neutral-600 mt-1">When asking for more, frame it around the value you bring to the team, your achievements, and the market benchmark — never mention rent, loans, or personal expenses.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">4. Leverage competing job offers</h4>
              <p className="text-sm text-neutral-600 mt-1">Having another written offer is the strongest leverage. Employers are more willing to stretch their budget if they know you are in demand.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">5. Negotiate the entire package</h4>
              <p className="text-sm text-neutral-600 mt-1">If the base salary is fixed, negotiate sign-on bonuses, relocation assistance, remote flexibility, or learning budgets which can offset a lower base pay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
