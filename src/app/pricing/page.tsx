import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getHreflangAlternates } from "@/lib/i18n/utils";

export const metadata: Metadata = {
  title: "Pricing - DecaJobs | Free Trial & Pro Plans for AI Job Matching",
  description:
    "DecaJobs pricing: 7-day free trial with full access, then ₹299/month for Pro. Compare Free Trial vs Pro features. Employers post jobs for free. Cancel anytime.",
  alternates: {
    canonical: "https://decajob.com/pricing",
    languages: getHreflangAlternates("/pricing"),
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
              <span className="text-neutral-500 ml-1"> per month</span>
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
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Free vs Pro Feature Comparison
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              See exactly why serious job seekers upgrade to DecaJobs Pro for ₹299/month
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70">
                  <th className="text-left py-4 px-5 font-bold text-neutral-900">Platform Capabilities</th>
                  <th className="text-center py-4 px-4 font-semibold text-neutral-600">Free Public Tier</th>
                  <th className="text-center py-4 px-4 font-bold text-primary-700 bg-primary-50/60 border-l border-r border-primary-200">
                    DecaJobs Pro (₹299/mo)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[
                  ["Public Job Board Browsing & Search", true, true, "Standard keyword search"],
                  ["Free Public Tools (In-Hand Salary & Notice Calc)", true, true, "No account needed"],
                  ["Daily 10 Curated Jobs Delivered at 7:00 AM", false, true, "Personalized to exact skills & experience"],
                  ["WhatsApp Morning Digest Delivery", false, true, "Read & 1-click apply before morning commute"],
                  ["Email Dispatch with Direct Apply Links", false, true, "Direct to recruiter portal"],
                  ["Urgent 90+ Match Instant Notifications", false, true, "Catch fresh roles before 200+ apply"],
                  ["Job Trust Score™ & Ghost Job Detection", false, true, "Scam filters, salary verified, hiring status"],
                  ["1-Click Resume-to-Job Tailorer & ATS Matcher", false, true, "Customized keywords & bullets per job"],
                  ["Direct Hiring Manager & Recruiter Contact Details", false, true, "Verified LinkedIn & corporate email"],
                  ["Application Tracker CRM with 5-Day Recruiter Nudges", false, true, "Automated follow-up templates"],
                  ["Ad-Free Browsing Experience", false, true, "100% clean interface with no ads"],
                  ["100% Quality Match Guarantee (70 jobs or full refund)", false, true, "Risk-free trial & money-back promise"],
                ].map(([feature, free, pro, note], i) => (
                  <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-5 text-neutral-800">
                      <div className="font-medium">{feature as string}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{note as string}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {free ? <span className="text-green-600 font-bold">✓</span> : <span className="text-neutral-300 font-bold">—</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-primary-50/30 border-l border-r border-primary-100">
                      {pro ? <span className="text-primary-700 font-bold">✓ Yes</span> : <span className="text-neutral-300 font-bold">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 100% Quality Match Guarantee / Trust Box */}
        <div className="mb-16 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-950 p-8 sm:p-12 text-white shadow-xl border border-neutral-800">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <span>🛡️</span> 100% Quality Match Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              No Match, No Pay Guarantee
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              We stand behind our curation algorithm. If DecaJobs does not deliver at least <strong>70 verified, high-relevance jobs</strong> matching your target title and experience during your 30-day Pro membership, simply email us at <span className="text-primary-300 font-mono">support@decajob.com</span> within 30 days and we will refund your ₹299 immediately. No questions asked.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all"
              >
                Claim Your 7-Day Free Trial (₹0 Today) →
              </Link>
            </div>
            <p className="text-xs text-neutral-500 pt-2">
              Cancel anytime with 1 click in your account settings. Zero lock-in contracts.
            </p>
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Frequently Asked Questions
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
