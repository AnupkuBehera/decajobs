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
            canonical: `/jobs/category/${cat.slug}`,
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
                        {cat.name} Jobs
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">{cat.intro}</p>
                </div>

                {/* Live jobs */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">
                        Live {cat.name} Openings
                    </h2>
                    <JobCardGrid jobs={displayJobs} />
                </section>

                {/* Career paths editorial */}
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        Careers in {cat.name}
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {cat.careers.map((career) => (
                            <div key={career.title} className="rounded-xl border border-neutral-200 bg-white p-5">
                                <h3 className="font-semibold text-neutral-900">{career.title}</h3>
                                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{career.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 space-y-4 text-neutral-600 leading-relaxed prose prose-neutral max-w-none">
                        <p>
                            Whether you&apos;re just starting out or looking to take the next step,
                            a career in {cat.name.toLowerCase()} offers strong growth potential in
                            2026. The key to standing out is a combination of in-demand skills,
                            a well-optimized resume, and a targeted job search strategy.
                        </p>
                        <p>
                            DecaJobs helps you find the right {cat.name.toLowerCase()} roles without
                            the noise. Create a free profile with your target titles and skills, and
                            our AI engine will deliver 10 highly relevant matches to your inbox every
                            morning. You can also use our free{" "}
                            <Link href="/tools/resume-checker" className="text-primary-600 hover:underline">
                                AI Resume Checker
                            </Link>{" "}
                            and{" "}
                            <Link href="/tools/interview-questions" className="text-primary-600 hover:underline">
                                AI Interview Prep
                            </Link>{" "}
                            tools to get interview-ready.
                        </p>
                    </div>
                </article>

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
                        Stop scrolling. Get 10 AI-matched {cat.name.toLowerCase()} roles in your
                        inbox at 7 AM — free to start.
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

