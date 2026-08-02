import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCardGrid } from "@/components/jobs/JobCard";
import {
    getCityBySlug,
    getPublicJobsFiltered,
    CITIES,
} from "@/lib/public-jobs";

export const revalidate = 3600;

interface LocationPageProps {
    params: Promise<{ city: string }>;
}

export function generateStaticParams() {
    return CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
    const { city } = await params;
    const cityInfo = getCityBySlug(city);
    if (!cityInfo) return { title: "Jobs by Location | DecaJobs" };

    return {
        title: `Jobs in ${cityInfo.name} 2026 - ${cityInfo.name} Job Openings | DecaJobs`,
        description: `${cityInfo.blurb} Browse live job openings in ${cityInfo.name}, plus career insights. Sign up free to get ${cityInfo.name} jobs matched to your profile daily.`,
        alternates: {
            canonical: `/jobs/location/${cityInfo.slug}`,
        },
        openGraph: {
            title: `Jobs in ${cityInfo.name} 2026 | DecaJobs`,
            description: `Browse live job openings and career guidance for ${cityInfo.name}.`,
            url: `https://decajob.com/jobs/location/${cityInfo.slug}`,
            type: "website",
        },
    };
}

export default async function LocationPage({ params }: LocationPageProps) {
    const { city } = await params;
    const cityInfo = getCityBySlug(city);
    if (!cityInfo) notFound();

    const jobs = await getPublicJobsFiltered({ city: cityInfo });
    const displayJobs = jobs.slice(0, 24);

    return (
        <div className="py-10 sm:py-16">
            <div className="mx-auto max-w-6xl">
                <Breadcrumbs
                    items={[
                        { label: "Jobs", href: "/jobs" },
                        { label: `Jobs in ${cityInfo.name}` },
                    ]}
                />

                <div className="text-center mb-12">
                    <span className="text-5xl">🏙️</span>
                    <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                        Jobs in {cityInfo.name}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">{cityInfo.blurb}</p>
                </div>

                {/* Live jobs */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">
                        Live Openings in {cityInfo.name}
                    </h2>
                    <JobCardGrid jobs={displayJobs} />
                </section>

                {/* City career editorial */}
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        Working in {cityInfo.name}: A 2026 Job Market Guide
                    </h2>
                    <div className="mt-5 space-y-5 text-neutral-600 leading-relaxed prose prose-neutral max-w-none">
                        <p>
                            {cityInfo.name} remains one of India&apos;s most dynamic job markets in
                            2026. With a mix of multinational companies, fast-growing startups, and
                            established industries, professionals here have access to a wide range of
                            opportunities across technology, finance, operations, and more.
                        </p>
                        <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-3">
                            Tips for Landing a Job in {cityInfo.name}
                        </h3>
                        <div className="space-y-4 my-4">
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">1. Tailor your resume to local demand</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    Research which skills are most in demand in {cityInfo.name} and make
                                    sure they appear prominently in your resume. Our free{" "}
                                    <Link href="/tools/resume-checker" className="text-primary-600 hover:underline">
                                        Resume Checker
                                    </Link>{" "}
                                    can score your resume out of 100 in seconds.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">2. Set a realistic salary expectation</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    Use our{" "}
                                    <Link href="/tools/salary-calculator" className="text-primary-600 hover:underline">
                                        Salary Calculator
                                    </Link>{" "}
                                    to benchmark roles in {cityInfo.name} so you negotiate from a position
                                    of knowledge.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">3. Get AI-matched openings daily</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    Set {cityInfo.name} as your location on DecaJobs and receive 10 highly
                                    relevant job matches every morning at 7 AM — free for 7 days.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Other cities */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Explore Other Cities</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/jobs/remote"
                            className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:border-green-300 transition-colors"
                        >
                            🌍 Remote
                        </Link>
                        {CITIES.filter((c) => c.slug !== cityInfo.slug).map((c) => (
                            <Link
                                key={c.slug}
                                href={`/jobs/location/${c.slug}`}
                                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary-200 hover:text-primary-600 transition-colors"
                            >
                                🏙️ {c.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
                    <h2 className="text-xl font-bold text-neutral-900">
                        Get {cityInfo.name} Jobs Delivered Every Morning
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 max-w-xl mx-auto">
                        Join professionals in {cityInfo.name} who wake up to their perfect 10
                        job matches daily. Free to start, cancel anytime.
                    </p>
                    <Link
                        href="/login"
                        className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700 min-h-[48px]"
                    >
                        Get 10 Matched Jobs Free →
                    </Link>
                </div>
            </div>
        </div>
    );
}

