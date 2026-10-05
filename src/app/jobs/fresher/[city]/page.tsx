import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCardGrid } from "@/components/jobs/JobCard";
import {
  getCityBySlug,
  getPublicJobsFiltered,
  getPublicJobs,
  CITIES,
} from "@/lib/public-jobs";
import { DailyAlertForm } from "@/components/daily-alert-form";
import { AdSenseUnit } from "@/components/adsense-unit";

export const revalidate = 3600;

interface FresherCityPageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: FresherCityPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityInfo = getCityBySlug(city);
  if (!cityInfo) return { title: "Fresher Jobs by City | DecaJobs" };

  return {
    title: `Fresher Jobs in ${cityInfo.name} 2026 - Entry Level Tech Openings | DecaJobs`,
    description: `Discover verified entry-level and fresher jobs in ${cityInfo.name}. Software developer, QA, and data analyst roles with verified Job Trust Scores™. Updated daily at 7 AM.`,
    alternates: {
      canonical: `https://decajob.com/jobs/fresher/${cityInfo.slug}`,
    },
    openGraph: {
      title: `Fresher Jobs in ${cityInfo.name} 2026 | DecaJobs`,
      description: `Curated entry-level jobs for freshers in ${cityInfo.name}. No ghost jobs, 100% verified.`,
      url: `https://decajob.com/jobs/fresher/${cityInfo.slug}`,
      type: "website",
    },
  };
}

export default async function FresherCityPage({ params }: FresherCityPageProps) {
  const { city } = await params;
  const cityInfo = getCityBySlug(city);
  if (!cityInfo) notFound();

  const cityJobs = await getPublicJobsFiltered({ city: cityInfo });

  // Filter for fresher / junior roles in this city or backfill with city jobs
  const fresherInCity = cityJobs.filter((job) =>
    /fresher|junior|entry|graduate|associate|trainee|sde-1|sde 1|0-1/i.test(
      `${job.title} ${job.description}`
    )
  );

  let displayJobs = fresherInCity;
  if (displayJobs.length < 6) {
    const remaining = cityJobs.filter((j) => !displayJobs.some((dj) => dj.id === j.id));
    displayJobs = [...displayJobs, ...remaining].slice(0, 18);
  }

  if (displayJobs.length === 0) {
    const allJobs = await getPublicJobs();
    displayJobs = allJobs.slice(0, 12);
  }

  const otherCities = CITIES.filter((c) => c.slug !== cityInfo.slug).slice(0, 7);

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Jobs", href: "/jobs" },
            { label: "Fresher Jobs", href: "/jobs/fresher" },
            { label: `${cityInfo.name}` },
          ]}
        />

        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Non-Expired Openings · {cityInfo.name}
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl">
            Fresher Jobs in {cityInfo.name} 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-neutral-600">
            Entry-level software engineer, graduate analyst, and IT trainee roles in {cityInfo.name}. Filtered for genuine hiring with our algorithmic <span className="font-semibold text-neutral-900">Job Trust Score™</span>.
          </p>

          {/* Quick city navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 mr-1">Other Locations:</span>
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/jobs/fresher/${c.slug}`}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:border-primary-400 hover:text-primary-700 transition-colors shadow-2xs"
              >
                📍 {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Local Insights Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm mb-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Major Tech Parks & Corridors
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-800">
                {cityInfo.techParks ? cityInfo.techParks.slice(0, 2).join(", ") : `${cityInfo.name} Tech Zone`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Typical Fresher Package
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-800">
                {cityInfo.salaryInsight ? cityInfo.salaryInsight.slice(0, 45) + "..." : "₹3.5L - ₹8.5L / annum"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Cost of Living
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-800">
                {cityInfo.costOfLiving ? cityInfo.costOfLiving.slice(0, 45) + "..." : "Moderate"}
              </p>
            </div>
          </div>
        </div>

        {/* AdSense Unit */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Job Listings Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <span>💼</span> Verified Opportunities in {cityInfo.name} ({displayJobs.length})
            </h2>
            <Link href="/tools/resume-checker" className="text-xs font-semibold text-primary-600 hover:underline">
              Test ATS Resume Score Free →
            </Link>
          </div>

          <JobCardGrid jobs={displayJobs} />
        </div>

        {/* Daily Alert Capture */}
        <div className="rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-8 sm:p-12 text-white text-center shadow-xl">
          <span className="inline-block rounded-full bg-cyan-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 mb-3">
            7 AM Daily Digest for {cityInfo.name}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Get {cityInfo.name} Fresher Matches on WhatsApp or Email
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-primary-200 max-w-lg mx-auto">
            Zero endless searching. Receive exactly 10 genuine openings every morning at 7:00 AM.
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <DailyAlertForm />
          </div>
        </div>
      </div>
    </div>
  );
}
