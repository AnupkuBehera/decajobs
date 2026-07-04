import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - DecaJobs | AI Job Portal",
  description: "Get answers to common questions about DecaJobs. Learn how our AI job matching works, pricing, features, and how to get started finding your perfect job.",
  alternates: {
    canonical: "/faq",
  },
};

const faqs = [
  { q: "What is DecaJobs?", a: "DecaJobs is an AI-powered online job portal that delivers exactly 10 personalized job matches to your inbox every morning. Instead of scrolling through thousands of irrelevant listings, you get a curated daily digest of jobs that genuinely match your skills, experience, and location preferences." },
  { q: "How does DecaJobs find jobs for me?", a: "Our AI matching engine searches across 20+ job sources including LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, and Arbeitnow. It scores each job against your profile using a weighted algorithm: job title relevance (40%), skill match (35%), location compatibility (15%), and description keywords (10%). Only the top 10 highest-scoring jobs make it to your daily email." },
  { q: "Is DecaJobs free to use?", a: "Yes! New users get a 7-day free trial with full access to all features including daily job digests, AI resume tools, career coaching, and more. After the trial, you can subscribe to DecaJobs Pro for ₹299/month to continue receiving daily matches. Our free public tools (resume checker, salary calculator, interview prep) are always free with no login required." },
  { q: "How do I get started?", a: "Simply sign up with your email (magic link) or Google account. Then set up your profile by adding your target job titles, key skills, and preferred location. That's it — our AI starts matching you with relevant jobs immediately. You'll receive your first daily digest the next morning." },
  { q: "What AI tools are included?", a: "DecaJobs Pro includes: AI Resume Scorer & Optimizer, Cover Letter Generator, Skill Gap Analyzer, ATS Resume Scanner, AI Career Coach, Follow-up Email Generator, Cold Email to Recruiter tool, Job Scam Detector, Company Culture Fit Quiz, Career Path Visualizer, Job Market Trends dashboard, and LinkedIn Headline Generator." },
  { q: "Can I find remote jobs on DecaJobs?", a: "Absolutely. Set your location preference to 'Remote' and our AI will prioritize remote-friendly positions from specialized remote job boards (Remotive, RemoteOK) alongside remote listings from LinkedIn and Indeed. You'll only see jobs that match your remote preference." },
  { q: "Does DecaJobs work for freshers?", a: "Yes! DecaJobs works for all experience levels. Freshers can set target titles like 'Junior Developer', 'Associate Analyst', or 'Trainee Engineer' and our AI will match them with entry-level positions. We source from platforms that specialize in fresher hiring." },
  { q: "Is DecaJobs available in India?", a: "Yes, DecaJobs fully supports the Indian job market. We source jobs from Indian cities (Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and more) as well as international remote positions. Salary data in our tools is available in INR." },
  { q: "Can employers post jobs for free?", a: "Yes, employers can post job listings on DecaJobs completely free with no hidden charges. Simply register with your company email, verify it, and start posting. Your listings immediately enter our AI matching pool and get shown to relevant candidates." },
  { q: "How do I cancel my subscription?", a: "You can cancel anytime from your dashboard settings or by contacting us at support@decajob.com. After cancellation, you'll continue to have access until the end of your current billing period. There are no cancellation fees or lock-in contracts." },
  { q: "Is my data safe?", a: "Yes. We use Supabase with Row Level Security (RLS) to ensure you can only access your own data. Resumes are stored in encrypted private storage. We never sell your personal data to third parties. Read our full Privacy Policy for details." },
  { q: "How is DecaJobs different from Naukri or Indeed?", a: "Traditional job portals show you thousands of results and expect you to scroll. DecaJobs flips that model — we use AI to search across 20+ platforms and deliver only 10 perfectly matched jobs daily. Plus, we include 12+ AI career tools (resume optimizer, interview prep, career coaching) that other portals charge separately for." },
];

export default function FAQPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-neutral-600">
            Everything you need to know about DecaJobs. Can&apos;t find your answer? <Link href="/contact" className="text-primary-600 hover:underline">Contact us</Link>.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                {faq.q}
                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Still have questions?</h2>
          <p className="mt-2 text-neutral-600">Our team is happy to help.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 min-h-[44px]">
              Contact Us
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
