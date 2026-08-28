import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobSearchFilter } from "@/components/jobs/JobSearchFilter";
import {
    getPublicJobs,
    getCuratedTop10Jobs,
    JOB_CATEGORIES,
    CITIES,
    formatPostedDate,
} from "@/lib/public-jobs";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Latest Verified Jobs 2026 - Top 10 Curated Daily & Search | DecaJobs",
    description:
        "Search genuine, non-expired job openings across software engineering, data analytics, design, marketing, DevOps, and more. Top 10 curated jobs daily, remote and India tech hubs. Updated daily.",
    alternates: {
        canonical: "/jobs",
    },
    openGraph: {
        title: "Latest Verified Jobs 2026 | DecaJobs Curated Job Board",
        description:
            "Browse genuine, verified job openings across tech, data, design, marketing, and more. 10 fresh matches curated daily.",
        url: "https://decajob.com/jobs",
        type: "website",
    },
};

export default async function JobsPage() {
    const jobs = await getPublicJobs();
    const curatedTop10 = getCuratedTop10Jobs(jobs);
    const firstJob = jobs[0];
    const newestDate = firstJob ? formatPostedDate(firstJob.postedAt) : "today";

    return (
        <div className="py-10 sm:py-16">
            <div className="mx-auto max-w-6xl">
                <Breadcrumbs items={[{ label: "Jobs" }]} />

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                        Genuine & Curated Job Openings
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
                        Zero spam, zero expired links. Verified opportunities from top tech companies
                        around the world — updated daily with our algorithmic Top 10 curated matches.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1.5 text-xs font-semibold text-green-800 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            {jobs.length} genuine active listings · Verified {newestDate}
                        </span>
                        <Link
                            href="/resume-tools"
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                            <span>✨</span> Build ATS Resume For Free
                        </Link>
                    </div>
                </div>

                {/* Search & Filter Component */}
                <section className="mb-12">
                    <JobSearchFilter allJobs={jobs} curatedTop10={curatedTop10} />
                </section>

                {/* Category quick links */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Browse Jobs by Category</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {JOB_CATEGORIES.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/jobs/category/${cat.slug}`}
                                className="group rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md hover:border-primary-200"
                            >
                                <span className="text-2xl">{cat.emoji}</span>
                                <p className="mt-2 text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                                    {cat.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* City quick links */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Jobs by Location</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        <Link
                            href="/jobs/remote"
                            className="group rounded-xl border border-green-200 bg-green-50 p-4 transition-all hover:shadow-md hover:border-green-300"
                        >
                            <span className="text-2xl">🌍</span>
                            <p className="mt-2 text-sm font-semibold text-neutral-900 group-hover:text-green-700">
                                Remote Jobs
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">Work from anywhere</p>
                        </Link>
                        {CITIES.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/jobs/location/${city.slug}`}
                                className="group rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md hover:border-primary-200"
                            >
                                <span className="text-2xl">🏙️</span>
                                <p className="mt-2 text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                                    {city.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Editorial section */}
                <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        How to Get More Relevant Job Matches
                    </h2>
                    <div className="mt-4 space-y-4 text-neutral-600 leading-relaxed prose prose-neutral max-w-none">
                        <p>
                            Most job seekers lose hours every week scrolling through irrelevant
                            listings on traditional portals. DecaJobs flips that model. Instead of
                            showing you thousands of jobs and expecting you to filter them yourself,
                            our AI engine scores every available listing against your profile — your
                            target titles, skills, location, and experience — and delivers only the{" "}
                            <strong>10 best matches</strong> to your inbox every morning at 7 AM.
                        </p>
                        <p>
                            The public job board you&apos;re browsing right now is just a sample of the
                            live opportunities our engine tracks across 20+ sources, including
                            LinkedIn, Indeed, Glassdoor, Remotive, and RemoteOK. When you create a free
                            profile, we handle the searching, deduplication, and ranking for you —
                            so you spend 5 minutes a day applying instead of 2 hours filtering.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 min-h-[48px]"
                        >
                            Get 10 Matched Jobs Free →
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 min-h-[48px]"
                        >
                            How Our AI Matching Works
                        </Link>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
                        Job Search Questions
                    </h2>
                    <div className="mx-auto max-w-3xl space-y-4">
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                How often are new jobs added?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                Our system pulls fresh listings from multiple job APIs throughout the
                                day. The public board refreshes every hour, and active jobs expire
                                automatically after 30 days.
                            </p>
                        </details>
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                Is it free to apply for jobs on DecaJobs?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                Yes. Browsing the job board is free, and applying to jobs is free. You
                                can also create a free account to receive 10 AI-matched jobs in your
                                inbox every morning — no credit card required.
                            </p>
                        </details>
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                Can I find remote jobs?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                Absolutely. Visit our dedicated{" "}
                                <Link href="/jobs/remote" className="text-primary-600 hover:underline">
                                    remote jobs page
                                </Link>{" "}
                                or set your location preference to "Remote" on your profile and
                                our AI will prioritize remote-friendly positions.
                            </p>
                        </details>
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                Are these jobs verified?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                We aggregate from reputable platforms like Remotive, RemoteOK, and
                                Arbeitnow, and we strip out listings with common scam indicators. For
                                extra safety, use our free{" "}
                                <Link href="/tools/job-scam-detector" className="text-primary-600 hover:underline">
                                    Job Scam Detector
                                </Link>{" "}
                                before sharing personal information with any employer.
                            </p>
                        </details>
                    </div>
                </section>
            </div>

            {/* JSON-LD for the jobs index */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            name: "Latest Job Openings 2026",
                            url: "https://decajob.com/jobs",
                            description:
                                "Browse fresh job listings across software engineering, data analytics, design, marketing, and more. Updated daily.",
                            isPartOf: {
                                "@type": "WebSite",
                                name: "DecaJobs",
                                url: "https://decajob.com",
                            },
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: [
                                {
                                    "@type": "Question",
                                    name: "How does DecaJobs aggregate jobs?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "DecaJobs fetches job listings directly from free APIs (Remotive, RemoteOK, Arbeitnow) and employer-posted roles. We deduplicate results, clean descriptions, and score them against your candidate profile.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Is it free to apply for jobs on DecaJobs?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Yes. Browsing the job board is free, and applying to jobs is free. You can also create a free account to receive 10 AI-matched jobs in your inbox every morning at 7 AM.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Can I find remote jobs?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Yes. DecaJobs features hundreds of remote job listings across software engineering, marketing, design, analytics, and support.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Are these jobs verified?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "We aggregate from verified platforms and filter out common scam signals. Candidates can also use our free Job Scam Detector tool to check any suspicious listing before applying.",
                                    },
                                },
                            ],
                        },
                    ]),
                }}
            />
        </div>
    );
}

