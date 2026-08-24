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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (cityInfo.faqs || []).map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
            },
        })),
    };

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
                        Jobs in {cityInfo.name} 2026
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600 leading-relaxed">{cityInfo.blurb}</p>
                </div>

                {/* City Snapshot Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                            <span>🏢</span> Major Tech Parks & Hubs
                        </h2>
                        <ul className="mt-3 space-y-1.5 text-xs text-neutral-600">
                            {cityInfo.techParks?.map((park) => (
                                <li key={park} className="flex items-center gap-1.5">
                                    <span className="text-primary-600 font-bold">•</span> {park}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                            <span>💼</span> Top Hiring Industries
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {cityInfo.topIndustries?.map((ind) => (
                                <span key={ind} className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                                    {ind}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
                        <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                            <span>🏡</span> Cost of Living & Salary
                        </h2>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                            <strong className="text-neutral-900">Compensation:</strong> {cityInfo.salaryInsight}
                        </p>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                            <strong className="text-neutral-900">Housing/Rent:</strong> {cityInfo.costOfLiving}
                        </p>
                    </div>
                </div>

                {/* Live jobs */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">
                        Live Openings in {cityInfo.name} ({jobs.length} Found)
                    </h2>
                    <JobCardGrid jobs={displayJobs} />
                </section>

                {/* City career editorial */}
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        Working in {cityInfo.name}: 2026 Job Market Guide
                    </h2>
                    <div className="mt-5 space-y-5 text-neutral-600 leading-relaxed prose prose-neutral max-w-none">
                        <p>
                            {cityInfo.name} remains one of India&apos;s most dynamic employment hubs in 2026.
                            With a powerful ecosystem of multinational corporations, venture-backed startups, Global Capability Centers (GCCs), and established industrial clusters, job seekers in {cityInfo.name} have access to diverse career paths.
                        </p>
                        <h3 className="text-xl font-bold text-neutral-900 mt-8 mb-3">
                            Strategy for Landing a High-Paying Role in {cityInfo.name}
                        </h3>
                        <div className="space-y-4 my-4">
                            <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                                <h4 className="font-semibold text-neutral-900 text-base">1. Target local tech corridors & skill requirements</h4>
                                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                                    Highlight skills tailored to key employers in {cityInfo.name}. Use our free{" "}
                                    <Link href="/tools/resume-checker" className="text-primary-600 font-medium hover:underline">
                                        AI Resume Checker
                                    </Link>{" "}
                                    to audit your resume format against Applicant Tracking Systems (ATS).
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                                <h4 className="font-semibold text-neutral-900 text-base">2. Benchmark your compensation</h4>
                                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                                    Compare salary offers against regional standards using our free{" "}
                                    <Link href="/tools/salary-calculator" className="text-primary-600 font-medium hover:underline">
                                        Salary Calculator
                                    </Link>{" "}
                                    to negotiate with confidence.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                                <h4 className="font-semibold text-neutral-900 text-base">3. Get automated daily job digests</h4>
                                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                                    Set {cityInfo.name} as your target location on DecaJobs. Our AI algorithm aggregates openings across 20+ sources and delivers 10 tailored matches to your inbox every morning at 7 AM.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Frequently Asked Questions */}
                {cityInfo.faqs && cityInfo.faqs.length > 0 && (
                    <section className="mb-12 rounded-2xl border border-neutral-200 bg-white p-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                            Frequently Asked Questions — Jobs in {cityInfo.name}
                        </h2>
                        <div className="space-y-6">
                            {cityInfo.faqs.map((faq) => (
                                <div key={faq.q} className="border-b border-neutral-100 pb-5 last:border-b-0 last:pb-0">
                                    <h3 className="text-base font-semibold text-neutral-900">
                                        {faq.q}
                                    </h3>
                                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

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
                        Join job seekers in {cityInfo.name} who receive 10 perfectly matched job openings daily at 7 AM.
                    </p>
                    <Link
                        href="/login"
                        className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700 min-h-[48px]"
                    >
                        Get 10 Matched Jobs Free →
                    </Link>
                </div>
            </div>

            {/* FAQPage JSON-LD Structured Data */}
            {cityInfo.faqs && cityInfo.faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </div>
    );
}

