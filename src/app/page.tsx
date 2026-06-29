import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20 lg:py-28 text-center">
        <p className="mb-4 text-lg font-bold text-primary-600 sm:text-xl">DecaJobs</p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl max-w-3xl">
          10 perfect jobs, every morning
        </h1>
        <p className="mt-4 text-base text-neutral-600 sm:text-lg lg:text-xl max-w-2xl">
          Get exactly 10 highly relevant job matches delivered to your inbox
          every day. No noise, just opportunities that matter.
        </p>
        <div className="mt-8 flex flex-col gap-3 w-full sm:flex-row sm:w-auto sm:gap-4">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/employer/register" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Post Jobs Free
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-neutral-200 bg-white py-12 sm:py-16 lg:py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-center text-neutral-600 text-sm sm:text-base">
            Three simple steps to your daily job matches.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-lg font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Sign up
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Create your account in seconds with a magic link or Google
                sign-in.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-lg font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Set preferences
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Tell us your target titles, skills, and preferred location.
                We&apos;ll handle the rest.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-lg font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                Get matches
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Receive 10 curated jobs every morning, ranked by how well they
                fit your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12 sm:py-16 lg:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl text-center mb-8">
            Why Thousands of Professionals Choose DecaJobs
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <span className="text-2xl">⏱️</span>
              <h3 className="mt-3 text-base font-semibold text-neutral-900">Save 2+ Hours Daily</h3>
              <p className="mt-2 text-sm text-neutral-600">No more scrolling through thousands of irrelevant listings. We deliver only 10 jobs that actually match your skills.</p>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <span className="text-2xl">🎯</span>
              <h3 className="mt-3 text-base font-semibold text-neutral-900">AI-Powered Precision</h3>
              <p className="mt-2 text-sm text-neutral-600">Our scoring algorithm weighs title relevance, skill match, location, and job description to find truly relevant opportunities.</p>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <span className="text-2xl">🌐</span>
              <h3 className="mt-3 text-base font-semibold text-neutral-900">20+ Job Sources</h3>
              <p className="mt-2 text-sm text-neutral-600">We aggregate from LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, and Arbeitnow — so you never miss an opportunity.</p>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <span className="text-2xl">🤖</span>
              <h3 className="mt-3 text-base font-semibold text-neutral-900">12+ AI Career Tools</h3>
              <p className="mt-2 text-sm text-neutral-600">Resume optimizer, interview prep, salary calculator, cover letter generator, career coaching, and more — all included.</p>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <span className="text-2xl">💼</span>
              <h3 className="mt-3 text-base font-semibold text-neutral-900">Remote & Local Jobs</h3>
              <p className="mt-2 text-sm text-neutral-600">Whether you want remote work or roles in Bangalore, Mumbai, Delhi, or any city — our engine adapts to your preference.</p>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <span className="text-2xl">💰</span>
              <h3 className="mt-3 text-base font-semibold text-neutral-900">Free for Employers</h3>
              <p className="mt-2 text-sm text-neutral-600">Companies post jobs at no cost. More listings means better matches for job seekers. Everyone wins.</p>
            </div>
          </div>

          <div className="prose prose-neutral prose-sm sm:prose-base mx-auto">
            <h3 className="text-xl font-semibold text-neutral-900">The Problem We Solve</h3>
            <p>
              The average job seeker spends 11 hours per week searching for work. They check multiple platforms daily, sift through hundreds of irrelevant listings, and often apply to jobs they&apos;re not even qualified for — simply because the sheer volume makes it impossible to evaluate each one carefully.
            </p>
            <p>
              DecaJobs was built to eliminate that frustration. Set up your profile once with your target titles, skills, and location. Every morning at 7 AM, you receive exactly 10 hand-picked jobs, ranked by how well they fit your career goals. That&apos;s it — 5 minutes a day instead of 2 hours.
            </p>

            <h3 className="text-xl font-semibold text-neutral-900 mt-8">Who Is DecaJobs For?</h3>
            <ul>
              <li><strong>Freshers</strong> looking for their first job without drowning in irrelevant senior-level listings</li>
              <li><strong>Experienced professionals</strong> exploring new opportunities without publicly announcing their job search</li>
              <li><strong>Remote workers</strong> who want curated remote-only positions from global companies</li>
              <li><strong>Career changers</strong> who need AI to identify transferable-skill matches they might miss</li>
              <li><strong>Passive candidates</strong> who want to stay informed about opportunities without actively searching</li>
            </ul>

            <p>
              <Link href="/how-it-works" className="text-primary-600 font-medium hover:underline">Learn how our AI matching works →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-neutral-200 bg-white py-12 sm:py-16 lg:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                What is DecaJobs and how does it work?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                DecaJobs is an AI-powered online job portal that delivers exactly 10 personalized job matches to your inbox every morning. You create a profile with your target job titles, skills, location, and salary expectations. Our matching engine then scores thousands of jobs from LinkedIn, Indeed, Glassdoor, and other top job boards, and sends you only the 10 most relevant ones — saving you hours of manual searching.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                Is DecaJobs free to use?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                Yes! DecaJobs offers a free 7-day trial with full access to all features including daily job digests, AI matching, and access to jobs from all sources. After the trial, a premium subscription is available for continued daily job matching. Employers can post jobs completely free with no limits.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                Where does DecaJobs source its job listings from?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                DecaJobs aggregates jobs from over 20 sources including LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings on our platform. This gives you access to remote jobs, local opportunities, fresher positions, and senior roles all in one place — no need to check multiple job search websites.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                Can I find remote jobs on DecaJobs?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                Absolutely. DecaJobs is one of the best remote job finders available. Simply set your location preference to &quot;Remote&quot; and our engine will prioritize remote job opportunities from dedicated remote job boards and global listings. We source from specialized remote job sites like Remotive and RemoteOK alongside mainstream platforms.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                How does the AI matching algorithm work?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                Our AI uses a weighted scoring system: job title relevance (40%), skill match (35%), location compatibility (15%), and description keyword match (10%). Each job is scored 0-100, and only the top 10 make it to your daily email. The algorithm also considers your current designation and expected salary to find the right seniority level.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                Does DecaJobs work for freshers and entry-level candidates?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                Yes! DecaJobs works for all experience levels — from freshers to senior professionals. Set your target titles to entry-level roles (e.g., &quot;Junior Developer&quot;, &quot;Associate Analyst&quot;) and our AI will match you with appropriate fresher-friendly positions. We aggregate from platforms like Fresherslive and other entry-level job portals.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                Is DecaJobs available in India?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                Yes, DecaJobs is fully available as an online job portal in India. We source jobs from Indian platforms and global sites with India-based listings. Set your location to any Indian city (Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, etc.) and receive relevant local opportunities alongside remote positions.
              </p>
            </details>

            <details className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:p-6 open:bg-white open:shadow-sm transition-all">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 sm:text-lg min-h-[44px]">
                Can employers post jobs for free?
                <span className="ml-4 shrink-0 text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
                Yes, employers can post job listings on DecaJobs completely free. Simply register with your company email, verify it, and start posting. Your jobs will be immediately available for matching with relevant candidates. There are no hidden fees or per-listing charges.
              </p>
            </details>
          </div>
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
                  text: "DecaJobs is an AI-powered online job portal that delivers exactly 10 personalized job matches to your inbox every morning. You create a profile with your target job titles, skills, location, and salary expectations. Our matching engine then scores thousands of jobs from LinkedIn, Indeed, Glassdoor, and other top job boards, and sends you only the 10 most relevant ones — saving you hours of manual searching.",
                },
              },
              {
                "@type": "Question",
                name: "Is DecaJobs free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! DecaJobs offers a free 7-day trial with full access to all features including daily job digests, AI matching, and access to jobs from all sources. After the trial, a premium subscription is available for continued daily job matching. Employers can post jobs completely free with no limits.",
                },
              },
              {
                "@type": "Question",
                name: "Where does DecaJobs source its job listings from?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DecaJobs aggregates jobs from over 20 sources including LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings on our platform. This gives you access to remote jobs, local opportunities, fresher positions, and senior roles all in one place.",
                },
              },
              {
                "@type": "Question",
                name: "Can I find remote jobs on DecaJobs?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. DecaJobs is one of the best remote job finders available. Set your location preference to Remote and our engine will prioritize remote job opportunities from dedicated remote job boards and global listings. We source from specialized remote job sites like Remotive and RemoteOK alongside mainstream platforms.",
                },
              },
              {
                "@type": "Question",
                name: "How does the AI matching algorithm work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our AI uses a weighted scoring system: job title relevance (40%), skill match (35%), location compatibility (15%), and description keyword match (10%). Each job is scored 0-100, and only the top 10 make it to your daily email. The algorithm also considers your current designation and expected salary to find the right seniority level.",
                },
              },
              {
                "@type": "Question",
                name: "Does DecaJobs work for freshers and entry-level candidates?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! DecaJobs works for all experience levels — from freshers to senior professionals. Set your target titles to entry-level roles and our AI will match you with appropriate fresher-friendly positions. We aggregate from platforms like Fresherslive and other entry-level job portals.",
                },
              },
              {
                "@type": "Question",
                name: "Is DecaJobs available in India?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, DecaJobs is fully available as an online job portal in India. We source jobs from Indian platforms and global sites with India-based listings. Set your location to any Indian city (Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, etc.) and receive relevant local opportunities alongside remote positions.",
                },
              },
              {
                "@type": "Question",
                name: "Can employers post jobs for free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, employers can post job listings on DecaJobs completely free. Simply register with your company email, verify it, and start posting. Your jobs will be immediately available for matching with relevant candidates. There are no hidden fees or per-listing charges.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
