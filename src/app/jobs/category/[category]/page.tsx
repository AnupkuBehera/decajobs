import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCardGrid } from "@/components/jobs/JobCard";
import {
    getCategoryBySlug,
    getPublicJobsFiltered,
    JOB_CATEGORIES,
} from "@/lib/public-jobs";
import { AdSenseUnit } from "@/components/adsense-unit";

export const revalidate = 3600;

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export function generateStaticParams() {
    return JOB_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    const cat = getCategoryBySlug(category);
    if (!cat) return { title: "Jobs by Category | DecaJobs" };

    return {
        title: `${cat.name} Jobs 2026 - ${cat.name} Careers & Openings | DecaJobs`,
        description: `${cat.name} jobs and career guide. Browse live ${cat.name.toLowerCase()} openings, salaries, skills, and career paths. Sign up free to get matched ${cat.name.toLowerCase()} jobs daily.`,
        alternates: {
            canonical: `https://decajob.com/jobs/category/${cat.slug}`,
        },
        openGraph: {
            title: `${cat.name} Jobs 2026 | DecaJobs`,
            description: `Browse live ${cat.name.toLowerCase()} job openings and career guidance.`,
            url: `https://decajob.com/jobs/category/${cat.slug}`,
            type: "website",
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;
    const cat = getCategoryBySlug(category);
    if (!cat) notFound();

    const jobs = await getPublicJobsFiltered({ category: cat });
    const displayJobs = jobs.slice(0, 24);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: cat.faqs.map((faq) => ({
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
                        { label: cat.name },
                    ]}
                />

                <div className="text-center mb-12">
                    <span className="text-5xl">{cat.emoji}</span>
                    <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                        {cat.name} Jobs 2026
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600 leading-relaxed">{cat.intro}</p>
                </div>

                {/* Salary & Skills Quick Snapshot */}
                <div className="grid gap-6 sm:grid-cols-2 mb-12">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                            <span>💰</span> {cat.name} Salary Benchmarks 2026
                        </h2>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-100 text-sm">
                                <span className="text-neutral-500 font-medium">Junior (0-2 Yrs)</span>
                                <span className="font-semibold text-neutral-900">{cat.salaryRange.junior}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-100 text-sm">
                                <span className="text-neutral-500 font-medium">Mid-Level (3-6 Yrs)</span>
                                <span className="font-semibold text-neutral-900">{cat.salaryRange.mid}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Senior Lead (7+ Yrs)</span>
                                <span className="font-semibold font-bold text-primary-700">{cat.salaryRange.senior}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                            <span>⚡</span> Top In-Demand Skills for {cat.name}
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {cat.topSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live jobs */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">
                        Live {cat.name} Openings ({jobs.length} Found)
                    </h2>
                    <JobCardGrid jobs={displayJobs} />
                </section>

                {/* Industry Outlook & Career Paths */}
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        2026 Industry Outlook & Career Paths in {cat.name}
                    </h2>
                    <p className="mt-3 text-neutral-600 leading-relaxed text-base">
                        {cat.marketOutlook}
                    </p>

                    <h3 className="mt-8 text-xl font-bold text-neutral-900">
                        Core Roles & Specializations
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {cat.careers.map((career) => (
                            <div key={career.title} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                                <h4 className="font-semibold text-neutral-900">{career.title}</h4>
                                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{career.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4 text-neutral-600 leading-relaxed prose prose-neutral max-w-none">
                        <h3 className="text-xl font-bold text-neutral-900">
                            How to Land a {cat.name} Role with DecaJobs
                        </h3>
                        <p>
                            Standing out in {cat.name.toLowerCase()} requires pairing high-demand technical skills with a targeted job application strategy. Rather than applying to hundreds of generic job posts, successful candidates focus on tailored applications with ATS-friendly resumes.
                        </p>
                        <p>
                            DecaJobs simplifies your search. Create a free profile with your target titles, skills, and preferred compensation. Our AI engine delivers 10 perfectly matched {cat.name.toLowerCase()} openings directly to your inbox every morning at 7 AM. Boost your odds using our free{" "}
                            <Link href="/tools/resume-checker" className="text-primary-600 font-medium hover:underline">
                                AI Resume Checker
                            </Link>{" "}
                            and{" "}
                            <Link href="/tools/interview-questions" className="text-primary-600 font-medium hover:underline">
                                AI Interview Prep
                            </Link>{" "}
                            tools.
                        </p>
                    </div>
                </article>

                {/* AdSense In-Category Display Unit */}
                <AdSenseUnit label="Sponsored Career Partner" className="my-8" />

                {/* Frequently Asked Questions */}
                {cat.faqs && cat.faqs.length > 0 && (
                    <section className="mb-12 rounded-2xl border border-neutral-200 bg-white p-8">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                            Frequently Asked Questions — {cat.name} Careers
                        </h2>
                        <div className="space-y-6">
                            {cat.faqs.map((faq) => (
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

                {/* Other categories */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Explore Other Categories</h2>
                    <div className="flex flex-wrap gap-3">
                        {JOB_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                            <Link
                                key={c.slug}
                                href={`/jobs/category/${c.slug}`}
                                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary-200 hover:text-primary-600 transition-colors"
                            >
                                {c.emoji} {c.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
                    <h2 className="text-xl font-bold text-neutral-900">
                        Get {cat.name} Jobs Delivered Every Morning
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 max-w-xl mx-auto">
                        Stop scrolling through thousands of posts. Get 10 AI-matched {cat.name.toLowerCase()} roles delivered to your inbox at 7 AM — free to start.
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </div>
    );
}

