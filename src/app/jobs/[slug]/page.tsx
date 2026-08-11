import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
    getPublicJobs,
    jobSlug,
    formatPostedDate,
    daysSincePosted,
    isRemoteJob,
    JOB_CATEGORIES,
    jobMatchesCategory,
    truncate,
    type ExternalJob,
} from "@/lib/public-jobs";
import { buildJobPostingSchema } from "@/lib/job-schema";

export const revalidate = 3600;

interface JobDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    // Pre-render job detail pages using the sample dataset so pages exist
    // even before the first external fetch. Live jobs are generated on demand.
    const jobs = await getPublicJobs();
    return jobs.slice(0, 40).map((job) => ({ slug: jobSlug(job) }));
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const jobs = await getPublicJobs();
    const job = jobs.find((j) => jobSlug(j) === slug);

    if (!job) {
        return { title: "Job Not Found | DecaJobs" };
    }

    return {
        title: `${job.title} at ${job.company} - Apply Now | DecaJobs`,
        description: `${job.title} at ${job.company} (${job.location}). ${truncate(job.description, 150)} Apply directly or sign up free to get AI-matched jobs daily.`,
        alternates: {
            canonical: `/jobs/${slug}`,
        },
        openGraph: {
            title: `${job.title} at ${job.company} | DecaJobs`,
            description: truncate(job.description, 150),
            url: `https://decajob.com/jobs/${slug}`,
            type: "website",
        },
    };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const { slug } = await params;
    const jobs = await getPublicJobs();
    const job = jobs.find((j) => jobSlug(j) === slug);

    if (!job) notFound();

    const days = daysSincePosted(job.postedAt);
    const remote = isRemoteJob(job);
    const similar = jobs
        .filter((j) => j.id !== job.id)
        .sort((a, b) => {
            // Rank by shared category match score
            const scoreA = JOB_CATEGORIES.reduce(
                (acc, cat) => acc + (jobMatchesCategory(a, cat) ? 1 : 0),
                0
            );
            const scoreB = JOB_CATEGORIES.reduce(
                (acc, cat) => acc + (jobMatchesCategory(b, cat) ? 1 : 0),
                0
            );
            return scoreB - scoreA;
        })
        .slice(0, 6);

    const categoriesForJob = JOB_CATEGORIES.filter((cat) => jobMatchesCategory(job, cat));

    return (
        <div className="py-10 sm:py-16">
            <div className="mx-auto max-w-4xl">
                <Breadcrumbs
                    items={[
                        { label: "Jobs", href: "/jobs" },
                        { label: job.title },
                    ]}
                />

                {/* Job header */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{job.title}</h1>
                            <p className="mt-2 text-lg text-neutral-500">{job.company}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                                <span className="inline-flex items-center gap-1">
                                    <span aria-hidden="true">📍</span>
                                    {job.location}
                                </span>
                                {remote && (
                                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                        Remote Friendly
                                    </span>
                                )}
                                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                    Posted {days !== null ? `${days} day${days === 1 ? "" : "s"} ago` : "recently"}
                                </span>
                                <time className="text-xs text-neutral-400">{formatPostedDate(job.postedAt)}</time>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors min-h-[48px]"
                            >
                                Apply Now →
                            </a>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[48px]"
                            >
                                Get 10 AI-Matched Jobs Free
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Job description */}
                <article className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Job Description</h2>
                    <div className="prose prose-neutral prose-sm sm:prose-base max-w-none leading-relaxed">
                        {job.description.split(/\n{2,}/).map((paragraph, i) => (
                            <p key={i} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="mt-8 rounded-xl bg-neutral-50 border border-neutral-200 p-6">
                        <h3 className="font-semibold text-neutral-900">How to Apply</h3>
                        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                            This listing is aggregated from{" "}
                            <span className="font-medium">{job.source}</span>. Click{" "}
                            <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline font-medium"
                            >
                                Apply Now
                            </a>{" "}
                            to view the full application details on the original platform. Before
                            applying, we recommend running the listing through our free{" "}
                            <Link href="/tools/job-scam-detector" className="text-primary-600 hover:underline">
                                Job Scam Detector
                            </Link>{" "}
                            to stay safe.
                        </p>
                    </div>

                    {/* Related categories */}
                    {categoriesForJob.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm text-neutral-500">More in these categories:</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {categoriesForJob.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/jobs/category/${cat.slug}`}
                                        className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                                    >
                                        {cat.emoji} {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* Similar jobs */}
                {similar.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">Similar Jobs You Might Like</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {similar.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/jobs/${jobSlug(s)}`}
                                    className="group block rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md hover:border-primary-200"
                                >
                                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 line-clamp-2">
                                        {s.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-neutral-500">{s.company}</p>
                                    <p className="mt-2 text-xs text-neutral-500">📍 {s.location}</p>
                                    <p className="mt-3 text-xs text-neutral-400">{formatPostedDate(s.postedAt)}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <div className="mt-10 rounded-2xl bg-primary-50 border border-primary-200 p-6 sm:p-8 text-center">
                    <h2 className="text-lg font-bold text-neutral-900">
                        Tired of scrolling through hundreds of listings?
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 max-w-xl mx-auto">
                        DecaJobs delivers exactly 10 AI-matched jobs to your inbox every morning.
                        Set your profile once — we do the searching for you.
                    </p>
                    <Link
                        href="/login"
                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700 min-h-[48px]"
                    >
                        Get 10 Matched Jobs Free →
                    </Link>
                </div>
            </div>

            {/* JobPosting JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildJobPostingSchema(job, slug)),
                }}
            />
        </div>
    );
}

