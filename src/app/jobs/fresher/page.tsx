import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCardGrid } from "@/components/jobs/JobCard";
import { getPublicJobs, CITIES, type ExternalJob } from "@/lib/public-jobs";
import { DailyAlertForm } from "@/components/daily-alert-form";
import { AdSenseUnit } from "@/components/adsense-unit";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fresher Jobs 2026 - Top 10 Entry-Level & Graduate Tech Jobs | DecaJobs",
  description:
    "Discover verified fresher jobs 2026, entry-level software engineer roles, QA, data analyst, and graduate trainee openings in India & Remote. Zero fake listings, high Trust Scores, updated daily at 7 AM.",
  alternates: {
    canonical: "https://decajob.com/jobs/fresher",
  },
  openGraph: {
    title: "Fresher Jobs 2026 | DecaJobs Curated Entry-Level Openings",
    description:
      "Find genuine entry-level tech jobs for freshers across India tech hubs and remote. Filtered by verified Job Trust Scores.",
    url: "https://decajob.com/jobs/fresher",
    type: "website",
  },
};

export default async function FresherJobsPage() {
  const allJobs = await getPublicJobs();

  // Filter for fresher / entry-level keywords or backfill with fresh tech jobs
  const fresherJobs = allJobs.filter((job) =>
    /fresher|junior|entry|graduate|associate|trainee|sde-1|sde 1|0-1|beginner/i.test(
      `${job.title} ${job.description}`
    )
  );

  const displayJobs = fresherJobs.length >= 6 ? fresherJobs.slice(0, 24) : allJobs.slice(0, 18);
  const indianCities = CITIES.filter((c) =>
    ["bangalore", "hyderabad", "pune", "delhi", "bhubaneswar", "chennai", "mumbai"].includes(c.slug)
  );

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: "Fresher Jobs 2026" }]} />

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Non-Expired Entry-Level Opportunities
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            Fresher & Entry-Level Tech Jobs 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-neutral-600">
            Cut through fake listings and multi-year experience requirements. Every posting is analyzed with our <span className="font-semibold text-neutral-900">Job Trust Score™</span> so you only apply to legitimate, active hiring teams.
          </p>

          {/* Quick city navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 mr-1">Popular Hubs:</span>
            {indianCities.map((city) => (
              <Link
                key={city.slug}
                href={`/jobs/fresher/${city.slug}`}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:border-primary-400 hover:text-primary-700 transition-colors shadow-2xs"
              >
                📍 {city.name}
              </Link>
            ))}
            <Link
              href="/jobs/remote"
              className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800 hover:bg-green-100 transition-colors"
            >
              🌍 Remote Fresher Jobs
            </Link>
          </div>
        </div>

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Job Listings Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <span>🎓</span> Featured Entry-Level Openings ({displayJobs.length})
            </h2>
            <Link href="/tools/resume-checker" className="text-xs font-semibold text-primary-600 hover:underline">
              Check ATS Resume Score Free →
            </Link>
          </div>

          <JobCardGrid jobs={displayJobs} />
        </div>

        {/* Daily 10 7-AM Alert Callout */}
        <div className="rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-8 sm:p-12 text-white text-center shadow-xl">
          <span className="inline-block rounded-full bg-cyan-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 mb-3">
            Wake Up to Top 10 Fresher Roles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Get 10 Verified Fresher Matches Delivered Daily at 7 AM
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-primary-200 max-w-lg mx-auto">
            Our AI scans overnight and delivers only high-trust entry-level positions directly to your email or WhatsApp.
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <DailyAlertForm />
          </div>
        </div>

        {/* Fresher Career Advice FAQs */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-neutral-900 text-center mb-6">
            Frequently Asked Questions for Freshers
          </h3>
          <div className="space-y-3">
            <details className="group rounded-xl border border-neutral-200 bg-white p-4 open:shadow-xs">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-sm text-neutral-900">
                How do I know if a fresher job listing is genuine and not a scam?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Check DecaJobs&apos; Job Trust Score on every card. Legitimate companies never request registration fees, training deposits, or conduct interviews solely over Telegram. DecaJobs automatically flags and excludes low-trust postings.
              </p>
            </details>
            <details className="group rounded-xl border border-neutral-200 bg-white p-4 open:shadow-xs">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-sm text-neutral-900">
                Can freshers without experience land remote tech jobs in 2026?
                <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Yes. Many startups and scaleups hire Junior and Associate engineers remotely. Having 2–3 full-stack GitHub projects with live deployments and an ATS-tailored resume gives you a significant advantage.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
