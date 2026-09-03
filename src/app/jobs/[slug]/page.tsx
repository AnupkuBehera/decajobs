import type { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StickyApplyBar } from "@/components/sticky-apply-bar";
import {
    getPublicJobs,
    jobSlug,
    formatPostedDate,
    daysSincePosted,
    isRemoteJob,
    JOB_CATEGORIES,
    jobMatchesCategory,
    extractSkillsFromJob,
    truncate,
    type ExternalJob,
} from "@/lib/public-jobs";
import { buildJobPostingSchema } from "@/lib/job-schema";
import { AdSenseUnit } from "@/components/adsense-unit";

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

/** Parse a human-readable title from a job slug (e.g. senior-software-engineer-erlin-119055 -> Senior Software Engineer Erlin). */
function parseTitleFromSlug(slug: string): string {
    const parts = slug.split("-").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (parts.length > 1 && lastPart && (/^\d+$/.test(lastPart) || /^otive/i.test(lastPart))) {
        parts.pop();
    }
    if (parts.length === 0) return "Job Position";
    return parts
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const jobs = await getPublicJobs();
    const job = jobs.find((j) => jobSlug(j) === slug);

    if (!job) {
        const title = parseTitleFromSlug(slug);
        return {
            title: `${title} (Job Expired) | DecaJobs`,
            description: `This job posting for ${title} has expired or is no longer accepting applications. Browse hundreds of active tech, remote, and engineering job openings on DecaJobs.`,
            robots: {
                index: false,
                follow: true,
            },
            alternates: {
                canonical: `https://decajob.com/jobs/${slug}`,
            },
        };
    }

    return {
        title: `${job.title} at ${job.company} - Apply Now | DecaJobs`,
        description: `${job.title} at ${job.company} (${job.location}). ${truncate(job.description, 150)} Apply directly or sign up free to get AI-matched jobs daily.`,
        alternates: {
            canonical: `https://decajob.com/jobs/${slug}`,
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

    if (!job) {
        const expiredTitle = parseTitleFromSlug(slug);
        const activeJobs = jobs.slice(0, 6);

        return (
            <div className="py-10 sm:py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <Breadcrumbs
                        items={[
                            { label: "Jobs", href: "/jobs" },
                            { label: "Expired Job" },
                        ]}
                    />

                    {/* Expired Job Notice Card */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                            <span className="text-3xl" role="img" aria-label="warning">⚡</span>
                            <div>
                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                    Listing Expired
                                </span>
                                <h1 className="mt-2 text-xl font-bold text-neutral-900 sm:text-2xl">
                                    {expiredTitle}
                                </h1>
                                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                                    This job posting is no longer active or accepting new applications. Don't worry — we have hundreds of active job openings waiting for you!
                                </p>
                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <Link
                                        href="/jobs"
                                        className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors min-h-[44px]"
                                    >
                                        Browse All Active Jobs →
                                    </Link>
                                    <Link
                                        href="/jobs/remote"
                                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[44px]"
                                    >
                                        Explore Remote Jobs
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Recommended Jobs */}
                    {activeJobs.length > 0 && (
                        <section className="mt-10">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">
                                Active Opportunities You Might Like
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {activeJobs.map((s) => (
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
                </div>
            </div>
        );
    }

    const days = daysSincePosted(job.postedAt);
    const remote = isRemoteJob(job);
    const skills = extractSkillsFromJob(`${job.title} ${job.description}`, 8);
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

    const tailorResumeUrl = `/tools/resume-matcher?role=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&desc=${encodeURIComponent(job.description.slice(0, 1200))}`;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://decajob.com",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Jobs",
                item: "https://decajob.com/jobs",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: job.title,
                item: `https://decajob.com/jobs/${slug}`,
            },
        ],
    };

    return (
        <div className="pt-10 pb-24 sm:pt-16 sm:pb-28">
            <div className="mx-auto max-w-4xl">
                <Breadcrumbs
                    items={[
                        { label: "Jobs", href: "/jobs" },
                        { label: job.title },
                    ]}
                />

                {/* Job header */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
                                    ✓ Genuine & Verified
                                </span>
                                {remote && (
                                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                        🌍 Remote Friendly
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">{job.title}</h1>
                            <p className="mt-1 text-lg font-medium text-neutral-600">{job.company}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                                <span className="inline-flex items-center gap-1">
                                    <span aria-hidden="true">📍</span>
                                    {job.location}
                                </span>
                                <span>•</span>
                                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                                    Posted {days !== null ? `${days} day${days === 1 ? "" : "s"} ago` : "recently"}
                                </span>
                                <span>•</span>
                                <time className="text-xs text-neutral-400">{formatPostedDate(job.postedAt)}</time>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 shadow-sm transition-colors min-h-[48px]"
                            >
                                Apply on Company Site →
                            </a>
                            <Link
                                href={tailorResumeUrl}
                                className="inline-flex items-center justify-center rounded-lg border border-primary-300 bg-primary-50 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors min-h-[48px]"
                            >
                                ✨ Tailor Resume for this Job (AI)
                            </Link>
                        </div>
                    </div>

                    {/* Extracted Key Skills */}
                    {skills.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-neutral-100">
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                Key Skills Detected for this Role
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s) => (
                                    <span
                                        key={s}
                                        className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 border border-neutral-200"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Resume Matcher Hook Banner */}
                <div className="mt-6 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 via-teal-50/50 to-blue-50/60 p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white text-xl">
                                ⚡
                            </span>
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                                    Increase your interview chances at {job.company}
                                </h2>
                                <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                                    Our AI will analyze your resume against this job description and optimize it for ATS algorithms.
                                </p>
                            </div>
                        </div>
                        <Link
                            href={tailorResumeUrl}
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                        >
                            Tailor Resume Free →
                        </Link>
                    </div>
                </div>

                {/* Job description */}
                <article className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
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
                            This listing is verified from{" "}
                            <span className="font-medium">{job.source}</span>. Click{" "}
                            <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline font-medium"
                            >
                                Apply Now
                            </a>{" "}
                            to view the official application on the employer platform.
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

                {/* Unique Editorial Content: Application & Interview Strategy */}
                <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">
                        Application &amp; Interview Strategy for {job.title}
                    </h2>
                    <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                        To maximize your interview callback rate for this position at {job.company}, align your resume and screening answers with current 2026 hiring benchmarks:
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                            <h3 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                                <span>🎯</span> ATS Keyword Optimization
                            </h3>
                            <p className="text-xs text-neutral-700 leading-relaxed mb-3">
                                Recruiters screening for {job.title} prioritize candidates with verified hands-on proficiency in core workflow tools. Ensure your resume explicitly highlights relevant technical competencies and measurable outcomes.
                            </p>
                            <Link
                                href={`/tools/resume-checker?role=${encodeURIComponent(job.title)}`}
                                className="text-xs font-semibold text-primary-600 hover:text-primary-800 underline"
                            >
                                Run ATS Resume Check for this role →
                            </Link>
                        </div>

                        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
                            <h3 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                                <span>💡</span> Behavioral Interview Tip
                            </h3>
                            <p className="text-xs text-neutral-700 leading-relaxed mb-3">
                                When interviewing for roles like this, use the STAR framework (Situation, Task, Action, Result). Quantify your past business results with concrete metrics (percentage efficiency gained, latency reduced, or revenue driven).
                            </p>
                            <Link
                                href={`/tools/interview-questions?role=${encodeURIComponent(job.title)}`}
                                className="text-xs font-semibold text-primary-600 hover:text-primary-800 underline"
                            >
                                Practice interview questions for {job.title} →
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-neutral-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                        <span>Curated by DecaJobs Career Research Team</span>
                        <Link href="/blog/editorial-policy" className="hover:text-primary-600 underline">
                            Editorial Standards
                        </Link>
                    </div>
                </section>

                {/* In-job listing AdSense display banner */}
                <AdSenseUnit label="Sponsored Job Partner" className="my-8" />

                {/* Similar jobs */}
                {similar.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">Similar Verified Jobs</h2>
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

                {/* Daily 10 CTA */}
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

            {/* BreadcrumbList JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />

            {/* Sticky Mobile & Desktop Apply Bar */}
            <StickyApplyBar
                jobTitle={job.title}
                company={job.company}
                applicationLink={job.applicationLink}
                slug={slug}
                jobDescription={job.description}
            />
        </div>
    );
}

