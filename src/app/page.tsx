import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero Section — gradient background with premium feel */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4 py-16 sm:py-24 lg:py-32">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-700/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Trust badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-800/50 px-4 py-1.5 text-sm text-primary-200 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by 5,000+ job seekers across India
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            10 perfect jobs,
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              every morning
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100/80 sm:text-xl">
            AI scans 20+ job boards overnight and delivers your top 10 matches
            by 7 AM. No noise, no endless scrolling — just opportunities that matter.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg shadow-primary-900/30 transition-colors hover:bg-neutral-100 min-h-[52px]"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/employer/register"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white hover:text-primary-800 min-h-[52px]"
            >
              Post Jobs Free
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
        <p className="text-center text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
          Jobs sourced from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-neutral-400">
          <span className="text-sm font-semibold sm:text-base">LinkedIn</span>
          <span className="text-sm font-semibold sm:text-base">Indeed</span>
          <span className="text-sm font-semibold sm:text-base">Glassdoor</span>
          <span className="text-sm font-semibold sm:text-base">Remotive</span>
          <span className="text-sm font-semibold sm:text-base">RemoteOK</span>
          <span className="text-sm font-semibold sm:text-base">Arbeitnow</span>
        </div>
      </section>

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
              quote="I was spending 3 hours daily on job sites. Now I spend 5 minutes with my DecaJobs email and apply to better roles."
              name="Priya S."
              role="Frontend Developer, Bangalore"
            />
            <TestimonialCard
              quote="The AI matching is genuinely good. 8 out of 10 jobs in my daily email are roles I'd actually consider applying for."
              name="Rahul M."
              role="Data Analyst, Remote"
            />
            <TestimonialCard
              quote="As a fresher, I was overwhelmed. DecaJobs cut through the noise and helped me land my first job in 3 weeks."
              name="Sneha K."
              role="Junior QA Engineer, Pune"
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

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-left">
      <div className="mb-3 text-primary-400 text-2xl">&ldquo;</div>
      <p className="text-sm leading-relaxed text-neutral-700">{quote}</p>
      <div className="mt-4 border-t border-neutral-200 pt-3">
        <p className="text-sm font-semibold text-neutral-900">{name}</p>
        <p className="text-xs text-neutral-500">{role}</p>
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
