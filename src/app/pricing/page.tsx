import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Pricing - DecaJobs | Free Trial & Pro Plans for AI Job Matching",
  description:
    "DecaJobs pricing: 7-day free trial with full access, then ₹299/month for Pro. Compare Free Trial vs Pro features. Employers post jobs for free. Cancel anytime.",
  alternates: {
    canonical: "/pricing",
  },
};

const freeFeatures = [
  "7-day full access to all features",
  "10 AI-matched jobs delivered daily at 7 AM",
  "Access to all 12+ AI career tools",
  "Resume Checker, Cover Letter Generator",
  "AI Interview Prep & Career Coach",
  "Salary Calculator & Job Scam Detector",
  "No credit card required to start",
];

const proFeatures = [
  "Everything in Free Trial, forever",
  "10 AI-matched jobs delivered daily at 7 AM",
  "Full access to all 12+ AI career tools",
  "Priority job matching with latest listings",
  "Ad-free experience across the platform",
  "Resume Optimizer tailored to specific job descriptions",
  "Skill Gap Analyzer for targeted upskilling",
  "Career Path Visualizer (2-5 year projections)",
  "Cold Email Generator for recruiter outreach",
  "LinkedIn Headline Generator",
  "Email support with 24-hour response time",
  "Cancel anytime — no lock-in contracts",
];

const pricingFaqs = [
  {
    q: "What happens after the 7-day free trial?",
    a: "After your free trial ends, you can upgrade to Pro for ₹299/month to continue receiving daily job matches and access to all AI tools. If you don't upgrade, your account remains active but you won't receive daily job emails or have access to Pro-only tools. Our free public tools (Resume Checker, Salary Calculator, Interview Prep) remain available without any login.",
  },
  {
    q: "Do I need a credit card to start the free trial?",
    a: "No, you do not need a credit card to start your free trial. Simply sign up with your email or Google account and you get instant access to all features for 7 days.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes, you can cancel your Pro subscription at any time from your dashboard settings or by emailing support@decajob.com. After cancellation, you'll continue to have access until the end of your current billing period. There are no cancellation fees, exit charges, or lock-in contracts.",
  },
  {
    q: "Is there a yearly plan with a discount?",
    a: "We are currently working on an annual plan that will offer a significant discount over monthly billing. Stay tuned for updates, or contact us at support@decajob.com to be notified when it launches.",
  },
  {
    q: "Do employers have to pay to post jobs?",
    a: "No, employers can post job listings on DecaJobs completely free of charge. There are no per-listing fees, no hidden charges, and no premium tiers for employers. Register with your company email, verify it, and start posting immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major payment methods including UPI, credit cards, debit cards, and net banking through our secure payment partner. All transactions are encrypted and PCI-DSS compliant.",
  },
  {
    q: "Can I get a refund?",
    a: "Subscription fees are non-refundable once charged. However, since we offer a generous 7-day free trial with full access, you can evaluate all features before committing. If you cancel before the trial ends, you will not be charged.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[{ label: "Pricing" }]} />

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Start with a free 7-day trial. No credit card required.
            Upgrade to Pro when you&apos;re ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Free Trial */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">
              Free Trial
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Full access for 7 days
            </p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-neutral-900">₹0</span>
              <span className="text-neutral-500 ml-1">/7 days</span>
            </p>
            <Link
              href="/login"
              className="mt-6 block w-full rounded-lg border-2 border-primary-600 px-4 py-3 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors min-h-[48px] flex items-center justify-center"
            >
              Start Free Trial
            </Link>
            <ul className="mt-8 space-y-3">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-primary-600 bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-semibold text-white">
              Most Popular
            </span>
            <h2 className="text-lg font-semibold text-neutral-900">
              Pro
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              For serious job seekers
            </p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-neutral-900">₹299</span>
              <span className="text-neutral-500 ml-1">/month</span>
            </p>
            <Link
              href="/login"
              className="mt-6 block w-full rounded-lg bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-700 transition-colors min-h-[48px] flex items-center justify-center"
            >
              Start Free Trial →
            </Link>
            <ul className="mt-8 space-y-3">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-neutral-900">
              For Employers
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Post jobs and reach candidates
            </p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-neutral-900">Free</span>
              <span className="text-neutral-500 ml-1">forever</span>
            </p>
            <Link
              href="/employer/register"
              className="mt-6 block w-full rounded-lg border-2 border-neutral-300 px-4 py-3 text-center text-sm font-semibold text-neutral-700 hover:bg-white transition-colors min-h-[48px] flex items-center justify-center"
            >
              Register as Employer
            </Link>
            <ul className="mt-8 space-y-3">
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                Post unlimited job listings
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                Jobs matched to relevant candidates via AI
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                Employer dashboard to manage all listings
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                No hidden fees, no per-listing charges
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                Email verification for trust and quality
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-900">Free Trial (7 days)</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-600">Pro (₹299/mo)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Daily 10 AI-Matched Jobs", true, true],
                  ["AI Resume Checker", true, true],
                  ["Salary Calculator", true, true],
                  ["AI Interview Prep", true, true],
                  ["Cover Letter Generator", true, true],
                  ["Job Scam Detector", true, true],
                  ["LinkedIn Headline Generator", true, true],
                  ["Resume Optimizer (Job-Specific)", true, true],
                  ["AI Career Coach", true, true],
                  ["Skill Gap Analyzer", true, true],
                  ["Career Path Visualizer", true, true],
                  ["Cold Email Generator", true, true],
                  ["Ad-Free Experience", true, true],
                  ["Priority Support", false, true],
                ].map(([feature, free, pro], i) => (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="py-3 px-4 text-neutral-700">{feature as string}</td>
                    <td className="py-3 px-4 text-center">
                      {free ? <span className="text-green-500">✓</span> : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pro ? <span className="text-green-500">✓</span> : <span className="text-neutral-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Pricing Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {pricingFaqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm transition-all"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Money-back guarantee / Trust signals */}
        <div className="text-center rounded-2xl bg-primary-50 border border-primary-200 p-8">
          <h2 className="text-xl font-bold text-neutral-900">
            Risk-Free Guarantee
          </h2>
          <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
            Try DecaJobs Pro completely free for 7 days. No credit card required.
            If it doesn&apos;t transform your job search, simply don&apos;t subscribe.
            Cancel anytime with zero hassle.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-primary-700 transition-colors min-h-[52px]"
          >
            Start Your Free Trial →
          </Link>
          <p className="mt-3 text-xs text-neutral-500">
            Join 5,000+ job seekers already using DecaJobs
          </p>
        </div>
      </div>

      {/* JSON-LD for Pricing FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: pricingFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
