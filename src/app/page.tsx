import type { Metadata } from "next";
import Link from "next/link";
import { DailyAlertForm } from "@/components/daily-alert-form";
import { InstantJobPreview } from "@/components/instant-job-preview";
import { SampleDigestMockup } from "@/components/sample-digest-mockup";
import { getPublicJobs } from "@/lib/public-jobs";
import { getHreflangAlternates } from "@/lib/i18n/utils";

export const metadata: Metadata = {
  title: "DecaJobs — 10 Jobs. Every Morning. That's It. | AI Job Portal",
  description:
    "DecaJobs is the best online job portal powered by AI. Get exactly 10 highly relevant job matches delivered to your inbox every morning. Search jobs from Indeed, LinkedIn, Glassdoor & more. Best job search site 2026 for remote jobs, fresher jobs, and experienced professionals in India & worldwide.",
  keywords: [
    "online job portal",
    "ai powered job portal",
    "indeed job portal",
    "fresherslive job portal",
    "job portal",
    "best online job portal",
    "online job portal india",
    "job search",
    "job search websites",
    "job search sites",
    "best job search engines",
    "best job search sites",
    "best job search websites 2026",
    "best job search sites 2025",
    "job search near me",
    "job search apps",
    "remote job finder",
    "remote job sites",
    "remote job boards",
    "remote job opportunities",
  ],
  openGraph: {
    title: "DecaJobs - AI Powered Online Job Portal | 10 Perfect Jobs Every Morning",
    description:
      "The smartest job search engine that delivers exactly 10 AI-matched jobs to your inbox daily. Aggregates from LinkedIn, Indeed, Glassdoor & 20+ job boards. Free to start.",
    url: "https://decajob.com",
    siteName: "DecaJobs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DecaJobs - AI Powered Online Job Portal",
    description:
      "Get 10 AI-matched jobs delivered to your inbox every morning. The best job search site for 2026.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://decajob.com",
    languages: getHreflangAlternates("/"),
  },
};

export default async function Home() {
  const jobs = await getPublicJobs();

  return (
    <div className="flex flex-1 flex-col -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero Section — gradient background with premium feel */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4 py-16 sm:py-24 lg:py-28">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-700/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Trust badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-800/50 px-4 py-1.5 text-xs sm:text-sm text-primary-200 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by 5,000+ tech job seekers across Bangalore, Hyderabad, Pune, Delhi NCR & Remote India
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            10 perfect jobs,
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              every morning
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100/80 sm:text-xl">
            AI scans 20+ top job boards overnight and delivers your curated Top 10 matches
            by 7:00 AM with verified Job Trust Scores™. No noise, no endless scrolling.
          </p>

          <div className="mt-8">
            <DailyAlertForm />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-200">
            <Link
              href="/jobs"
              className="hover:text-white underline underline-offset-4 font-medium transition-colors"
            >
              Browse Active Jobs List →
            </Link>
            <span>•</span>
            <Link
              href="/tools"
              className="hover:text-white underline underline-offset-4 font-medium transition-colors"
            >
              Free Career & Resume AI Tools
            </Link>
            <span>•</span>
            <Link
              href="/employer/register"
              className="hover:text-white underline underline-offset-4 font-medium transition-colors"
            >
              For Employers: Post Jobs Free
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-primary-700/50 pt-8 sm:gap-12">
            <div>
              <p className="text-2xl font-bold text-white sm:text-3xl">20+</p>
              <p className="mt-1 text-xs text-primary-300 sm:text-sm">Job Sources</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white sm:text-3xl">10</p>
              <p className="mt-1 text-xs text-primary-300 sm:text-sm">Daily Matches</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white sm:text-3xl">5 min</p>
              <p className="mt-1 text-xs text-primary-300 sm:text-sm">Not 2 Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Source Strip */}
      <section className="border-b border-neutral-200 bg-white px-4 py-6 sm:py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
          Curated & Verified from 20+ Leading Job Platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 text-neutral-500 max-w-4xl mx-auto">
          <span className="text-sm font-bold sm:text-base text-neutral-700">LinkedIn</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Naukri</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Indeed</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Glassdoor</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Foundit</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Wellfound</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Cutshort</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Hirist</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Instahyre</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Remotive</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">RemoteOK</span>
          <span className="text-sm font-bold sm:text-base text-neutral-700">Arbeitnow</span>
        </div>
      </section>

      {/* Live Interactive Instant Preview (No-Login) */}
      <section className="bg-neutral-100/70 px-4 py-14 sm:py-20 border-b border-neutral-200">
        <div className="mx-auto max-w-5xl">
          <InstantJobPreview jobs={jobs} />
        </div>
      </section>

      {/* Real Digest Sample Preview (Email & WhatsApp) */}
      <div className="px-4 sm:px-6">
        <SampleDigestMockup />
      </div>

      {/* How It Works — premium cards */}
      <section className="bg-white px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary-600">
            Simple & Effective
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            How DecaJobs Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-neutral-500">
            Three steps. Five minutes a day. That&apos;s all it takes.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-2xl border border-neutral-100 bg-gradient-to-b from-neutral-50 to-white p-8 shadow-sm transition-all hover:shadow-md hover:border-primary-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold shadow-lg shadow-primary-200">
                1
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                Create Account
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Sign up in seconds with Google or a magic link. No passwords to remember.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl border border-neutral-100 bg-gradient-to-b from-neutral-50 to-white p-8 shadow-sm transition-all hover:shadow-md hover:border-primary-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold shadow-lg shadow-primary-200">
                2
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                Set Preferences
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Add your target titles, skills, and location. Upload a resume for smarter matching.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl border border-neutral-100 bg-gradient-to-b from-neutral-50 to-white p-8 shadow-sm transition-all hover:shadow-md hover:border-primary-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold shadow-lg shadow-primary-200">
                3
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                Get Matches
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Every morning at 7 AM, receive 10 curated jobs ranked by relevance. Apply in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid — premium cards with icons */}
      <section className="bg-neutral-50 px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary-600">
            Everything You Need
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            Why Professionals Choose DecaJobs
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="⏱️"
              title="Save 2+ Hours Daily"
              description="No more scrolling thousands of irrelevant listings. We deliver only 10 jobs that actually match your skills and experience."
            />
            <FeatureCard
              icon="🎯"
              title="AI-Powered Precision"
              description="Weighted scoring: title relevance (40%), skill match (35%), location (15%), description (10%). Only the best make the cut."
            />
            <FeatureCard
              icon="🌐"
              title="20+ Job Sources"
              description="We aggregate from LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, and Arbeitnow — one inbox, every opportunity."
            />
            <FeatureCard
              icon="🤖"
              title="12+ AI Career Tools"
              description="Resume optimizer, interview prep, salary calculator, cover letter generator, career coaching — all included with Pro."
            />
            <FeatureCard
              icon="💼"
              title="Remote & Local Jobs"
              description="Whether you want remote work or roles in Bangalore, Mumbai, Delhi, or anywhere — the engine adapts to you."
            />
            <FeatureCard
              icon="💰"
              title="Free for Employers"
              description="Companies post jobs at zero cost. More listings means better matches for everyone. No hidden fees, ever."
            />
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="bg-white px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
            What Users Say
          </p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Loved by Job Seekers
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <TestimonialCard
              quote="I was spending 3 hours daily on job boards. Now I spend 5 minutes with my DecaJobs 7 AM digest and apply to verified, high-trust roles."
              name="Priya Sharma"
              role="Frontend Developer, Bangalore"
              verified={true}
            />
            <TestimonialCard
              quote="The Job Trust Score is a game-changer. No more ghost jobs or 60-day-old listings. 8 out of 10 matches are genuine openings I'd interview for."
              name="Rahul Mukherjee"
              role="Data Analyst, Remote India"
              verified={true}
            />
            <TestimonialCard
              quote="As a fresher, finding non-fake entry-level openings was exhausting. DecaJobs cut through the noise and helped me land my first SDE role in 3 weeks."
              name="Sneha Kulkarni"
              role="Associate QA Engineer, Pune"
              verified={true}
            />
          </div>
        </div>
      </section>

      {/* The Problem We Solve — editorial section */}
      <section className="bg-neutral-50 px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl text-center">
            The Problem We Solve
          </h2>
          <div className="mt-8 space-y-4 text-neutral-600 text-base leading-relaxed">
            <p>
              The average job seeker spends 11 hours per week searching for work. They check multiple platforms daily, sift through hundreds of irrelevant listings, and often apply to roles they&apos;re not qualified for — simply because the sheer volume makes careful evaluation impossible.
            </p>
            <p>
              <strong className="text-neutral-900">DecaJobs eliminates that frustration.</strong> Set up your profile once. Every morning at 7 AM, receive exactly 10 hand-picked jobs, ranked by how well they fit your career goals. Five minutes a day instead of two hours.
            </p>
          </div>

          <h3 className="mt-10 text-xl font-semibold text-neutral-900 text-center">
            Built For
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <AudienceCard title="Freshers" description="Find entry-level roles without drowning in senior listings" />
            <AudienceCard title="Experienced Pros" description="Explore new opportunities discreetly, without public job searching" />
            <AudienceCard title="Remote Workers" description="Get curated remote-only positions from global companies" />
            <AudienceCard title="Career Changers" description="AI identifies transferable-skill matches you might miss" />
          </div>

          <div className="mt-8 text-center">
            <Link href="/how-it-works" className="text-primary-600 font-medium hover:underline text-sm">
              Learn how our AI matching works →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary-600">
            Got Questions?
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-4">
            <FaqItem
              question="What is DecaJobs and how does it work?"
              answer="DecaJobs is an AI-powered job portal that delivers exactly 10 personalized job matches to your inbox every morning. Create a profile with your target titles, skills, and location. Our matching engine scores thousands of jobs from 20+ sources and sends you only the 10 most relevant."
            />
            <FaqItem
              question="Is DecaJobs free to use?"
              answer="Yes! Start with a free 7-day trial with full access to daily job digests, AI matching, and all tools. After the trial, Pro is ₹299/month. Employers post jobs completely free."
            />
            <FaqItem
              question="Where does DecaJobs source jobs from?"
              answer="We aggregate from LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings. 20+ sources, one inbox."
            />
            <FaqItem
              question="Can I find remote jobs?"
              answer="Absolutely. Set your location to &quot;Remote&quot; and our engine prioritizes remote opportunities from dedicated remote job boards and global listings."
            />
            <FaqItem
              question="How does the AI matching work?"
              answer="Weighted scoring: title relevance (40%), skill match (35%), location compatibility (15%), and description keywords (10%). Each job scores 0-100, and only the top 10 make it to your email."
            />
            <FaqItem
              question="Does it work for freshers?"
              answer="Yes! Set target titles to entry-level roles and our AI will match you with fresher-friendly positions from all sources."
            />
            <FaqItem
              question="Is DecaJobs available in India?"
              answer="Fully available. We source jobs from Indian platforms and global sites. Set your location to any Indian city — Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, or any other."
            />
            <FaqItem
              question="Can employers post jobs for free?"
              answer="Yes, completely free. Register, verify your email, and start posting. Jobs are immediately available for matching with relevant candidates. No hidden fees."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-950 px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to transform your job search?
          </h2>
          <p className="mt-4 text-lg text-primary-200">
            Join thousands of professionals who wake up to their perfect 10 jobs every morning.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg transition-colors hover:bg-neutral-100 min-h-[52px]"
            >
              Get Started Free →
            </Link>
          </div>
          <p className="mt-4 text-sm text-primary-300">
            7-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* JSON-LD Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is DecaJobs and how does it work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DecaJobs is an AI-powered online job portal that delivers exactly 10 personalized job matches to your inbox every morning. You create a profile with your target job titles, skills, location, and salary expectations. Our matching engine then scores thousands of jobs from LinkedIn, Indeed, Glassdoor, and other top job boards, and sends you only the 10 most relevant ones.",
                },
              },
              {
                "@type": "Question",
                name: "Is DecaJobs free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! DecaJobs offers a free 7-day trial with full access to all features. After the trial, Pro is available for ₹299/month. Employers can post jobs completely free.",
                },
              },
              {
                "@type": "Question",
                name: "Where does DecaJobs source its job listings from?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DecaJobs aggregates jobs from over 20 sources including LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings.",
                },
              },
              {
                "@type": "Question",
                name: "Can I find remote jobs on DecaJobs?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. Set your location preference to Remote and our engine will prioritize remote job opportunities from dedicated remote job boards and global listings.",
                },
              },
              {
                "@type": "Question",
                name: "How does the AI matching algorithm work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our AI uses a weighted scoring system: job title relevance (40%), skill match (35%), location compatibility (15%), and description keyword match (10%). Each job is scored 0-100, and only the top 10 make it to your daily email.",
                },
              },
              {
                "@type": "Question",
                name: "Does DecaJobs work for freshers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! DecaJobs works for all experience levels. Set your target titles to entry-level roles and our AI will match you with appropriate fresher-friendly positions.",
                },
              },
              {
                "@type": "Question",
                name: "Is DecaJobs available in India?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, DecaJobs is fully available in India. Set your location to any Indian city and receive relevant local opportunities alongside remote positions.",
                },
              },
              {
                "@type": "Question",
                name: "Can employers post jobs for free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, employers can post job listings on DecaJobs completely free. No hidden fees or per-listing charges.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}

/* ─── Sub-components ─── */

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-100">
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, verified }: { quote: string; name: string; role: string; verified?: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-left flex flex-col justify-between">
      <div>
        <div className="mb-3 text-primary-500 text-2xl font-serif">&ldquo;</div>
        <p className="text-sm leading-relaxed text-neutral-700">{quote}</p>
      </div>
      <div className="mt-4 border-t border-neutral-200/80 pt-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{role}</p>
        </div>
        {verified && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
            ✓ Verified
          </span>
        )}
      </div>
    </div>
  );
}

function AudienceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-white p-4">
      <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-500" />
      <div>
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm transition-all">
      <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
        {question}
        <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform text-sm">▼</span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{answer}</p>
    </details>
  );
}
