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

      {/* SEO Content Section */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12 sm:py-16 lg:py-20 px-4">
        <div className="mx-auto max-w-4xl prose prose-neutral prose-sm sm:prose-base">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl text-center mb-8">
            The Smartest AI-Powered Online Job Portal for 2026
          </h2>

          <p>
            Finding the right job in today&apos;s crowded market shouldn&apos;t feel like searching for a needle in a haystack. 
            <strong>DecaJobs</strong> is a next-generation <strong>AI-powered job portal</strong> that cuts through the noise 
            and delivers exactly 10 perfectly matched job opportunities to your inbox every single morning. Unlike traditional 
            <strong>job search websites</strong> that overwhelm you with thousands of irrelevant listings, DecaJobs uses 
            intelligent matching algorithms to find roles that genuinely fit your skills, experience, and career goals.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8">
            Why DecaJobs Is the Best Job Search Site
          </h3>

          <p>
            Most <strong>online job portals</strong> require you to spend hours scrolling, filtering, and applying. 
            DecaJobs flips that model entirely. Simply set up your profile once — add your target job titles, key skills, 
            preferred location, and expected salary — and our AI engine does the rest. Every morning at 7 AM, you receive a 
            beautifully curated email with your top 10 job matches, complete with one-click apply links. Whether you&apos;re 
            a fresher looking for your first role or a senior professional seeking <strong>remote job opportunities</strong>, 
            DecaJobs adapts to your unique career profile.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8">
            Aggregating Jobs from the Best Job Search Engines
          </h3>

          <p>
            DecaJobs doesn&apos;t limit you to a single source. Our platform aggregates listings from the 
            <strong>best job search engines</strong> and <strong>remote job boards</strong> including LinkedIn, Indeed, 
            Glassdoor, Remotive, RemoteOK, and Arbeitnow. This means whether you&apos;re searching for roles on the 
            <strong>Indeed job portal</strong>, exploring opportunities on <strong>remote job sites</strong>, or browsing 
            positions on the <strong>Fresherslive job portal</strong>, DecaJobs brings them all together in one 
            personalized daily digest. No more jumping between multiple <strong>job search apps</strong> and websites.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8">
            Built for Remote Job Seekers and Local Opportunities
          </h3>

          <p>
            The rise of remote work has transformed how we search for jobs. DecaJobs is built as a powerful 
            <strong>remote job finder</strong> that prioritizes remote-friendly positions when that&apos;s what you want. 
            Set your location to &quot;Remote&quot; and our engine will surface the best <strong>remote job opportunities</strong> 
            from across the globe. Prefer local roles? DecaJobs also supports <strong>job search near me</strong> functionality, 
            matching you with positions in your city, state, or country. Our <strong>online job portal India</strong> coverage 
            includes major metros like Bangalore, Mumbai, Delhi, Hyderabad, and Chennai, as well as emerging tech hubs.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8">
            How Our AI Matching Works
          </h3>

          <p>
            Unlike basic keyword search on other <strong>job search sites</strong>, DecaJobs employs a weighted scoring 
            algorithm that considers multiple factors: how well your target titles match the job title (40% weight), 
            skill overlap between your profile and the job requirements (35% weight), location compatibility (15% weight), 
            and description keyword relevance (10% weight). Jobs are scored on a 0-100 scale, and only the top 10 
            highest-scoring matches make it into your daily email. This ensures every job you see is genuinely relevant — 
            no spam, no irrelevant listings, just opportunities that matter.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8">
            Free for Employers, Powerful for Candidates
          </h3>

          <p>
            Employers can post jobs on DecaJobs completely free — no hidden fees, no per-listing charges. Simply verify 
            your email, fill in the job details, and your listing immediately enters our matching pool. For candidates, 
            DecaJobs offers a generous free trial followed by affordable premium access. We believe the 
            <strong>best online job portal</strong> should make job searching effortless, not expensive. With our daily 
            digest model, you spend less than 5 minutes a day reviewing perfectly matched opportunities instead of hours 
            scrolling through endless <strong>job search websites</strong>.
          </p>

          <p>
            Join thousands of professionals who have already discovered the smarter way to find their next role. 
            Whether you&apos;re exploring the <strong>best job search sites 2025</strong> and 2026, looking for 
            <strong>remote job boards</strong>, or simply want an AI that understands your career goals — DecaJobs 
            is the <strong>job portal</strong> built for how you actually want to search for jobs: effortlessly.
          </p>
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
