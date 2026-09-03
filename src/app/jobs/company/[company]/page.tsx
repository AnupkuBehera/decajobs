import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCardGrid } from "@/components/jobs/JobCard";
import {
    getCompanyBySlug,
    getPublicJobsFiltered,
    COMPANIES,
} from "@/lib/public-jobs";
import { AdSenseUnit } from "@/components/adsense-unit";

export const revalidate = 3600;

interface CompanyPageProps {
    params: Promise<{ company: string }>;
}

export function generateStaticParams() {
    return COMPANIES.map((c) => ({ company: c.slug }));
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
    const { company } = await params;
    const companyInfo = getCompanyBySlug(company);
    if (!companyInfo) return { title: "Company Jobs & Careers | DecaJobs" };

    return {
        title: `${companyInfo.name} Jobs 2026 - Careers, Remote Openings & Salaries | DecaJobs`,
        description: `Explore ${companyInfo.name} careers, tech stack, salary benchmarks, and interview tips. Browse verified ${companyInfo.name} openings and get 10 curated jobs matched to your profile daily.`,
        alternates: {
            canonical: `https://decajob.com/jobs/company/${companyInfo.slug}`,
        },
        openGraph: {
            title: `${companyInfo.name} Jobs & Careers 2026 | DecaJobs`,
            description: `Browse live openings, salaries, and interview guides for ${companyInfo.name}.`,
            url: `https://decajob.com/jobs/company/${companyInfo.slug}`,
            type: "website",
        },
    };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
    const { company } = await params;
    const companyInfo = getCompanyBySlug(company);
    if (!companyInfo) notFound();

    const jobs = await getPublicJobsFiltered({ company: companyInfo });
    const displayJobs = jobs.slice(0, 24);

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://decajob.com" },
            { "@type": "ListItem", position: 2, name: "Jobs", item: "https://decajob.com/jobs" },
            { "@type": "ListItem", position: 3, name: "Companies", item: "https://decajob.com/jobs#companies" },
            { "@type": "ListItem", position: 4, name: companyInfo.name, item: `https://decajob.com/jobs/company/${companyInfo.slug}` },
        ],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (companyInfo.faqs || []).map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
            },
        })),
    };

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: companyInfo.name,
        description: companyInfo.blurb,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
            />

            <main className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <Breadcrumbs
                        items={[
                            { label: "Jobs", href: "/jobs" },
                            { label: "Companies", href: "/jobs#companies" },
                            { label: companyInfo.name },
                        ]}
                    />

                    {/* ── Hero & Company Header ── */}
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="space-y-3 max-w-3xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl sm:text-5xl">{companyInfo.logoEmoji}</span>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
                                                {companyInfo.name} Jobs & Careers 2026
                                            </h1>
                                            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-800">
                                                Verified Employer
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            📍 HQ: {companyInfo.hq} · 🏢 {companyInfo.industry}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed pt-2">
                                    {companyInfo.blurb}
                                </p>
                            </div>

                            {/* 1-Click Alert Box */}
                            <div className="rounded-2xl border border-primary-200 bg-primary-50/70 p-5 sm:max-w-xs shrink-0 space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-primary-800">
                                    ⚡ Instant Job Alerts
                                </p>
                                <p className="text-xs text-primary-900 font-medium">
                                    Get notified the moment {companyInfo.name} posts a new opening matching your skills.
                                </p>
                                <Link
                                    href={`/login?company=${encodeURIComponent(companyInfo.name)}`}
                                    className="block w-full text-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 text-xs font-bold transition-colors shadow-xs"
                                >
                                    Get 10 Jobs Daily →
                                </Link>
                            </div>
                        </div>

                        {/* ── Key Highlights Grid ── */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-100 pt-6">
                            <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                                    💰 Salary Benchmarks
                                </h2>
                                <p className="text-xs text-neutral-800 leading-relaxed">
                                    {companyInfo.salaryInsight}
                                </p>
                            </div>

                            <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                                    💻 Primary Tech Stack
                                </h2>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {companyInfo.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-700"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                                    🌟 Culture & Benefits
                                </h2>
                                <ul className="text-xs text-neutral-700 space-y-1 mt-1">
                                    {companyInfo.cultureHighlights.slice(0, 3).map((c, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <span className="text-primary-600 font-bold">✓</span>
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── Openings Section ── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Live {companyInfo.name} Openings & Tech Roles ({displayJobs.length})
                            </h2>
                            <span className="text-xs text-neutral-500">Updated hourly</span>
                        </div>

                        {displayJobs.length > 0 ? (
                            <JobCardGrid jobs={displayJobs} />
                        ) : (
                            <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-10 text-center space-y-3">
                                <span className="text-4xl">📬</span>
                                <h3 className="text-base font-bold text-neutral-800">
                                    No Direct Public Listings for {companyInfo.name} Today
                                </h3>
                                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                                    {companyInfo.name} roles fill quickly through automated pipelines. Sign up below to get top matching roles delivered directly to your inbox every morning at 8:00 AM.
                                </p>
                                <Link
                                    href={`/login?role=${encodeURIComponent(companyInfo.name)}`}
                                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-6 text-xs font-bold transition-colors shadow-xs"
                                >
                                    Track {companyInfo.name} Jobs Free →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* AdSense In-Company Display Unit */}
                    <AdSenseUnit label="Sponsored Employer Partner" className="my-8" />

                    {/* ── FAQ Section ── */}
                    {companyInfo.faqs && companyInfo.faqs.length > 0 && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-4">
                            <h2 className="text-lg font-bold text-neutral-900">
                                Frequently Asked Questions About Working at {companyInfo.name}
                            </h2>
                            <div className="space-y-3">
                                {companyInfo.faqs.map((faq, i) => (
                                    <div key={i} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                                        <h3 className="text-sm font-bold text-neutral-900 mb-1">
                                            {faq.q}
                                        </h3>
                                        <p className="text-xs text-neutral-700 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Browse Other Top Companies ── */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                            Explore Careers at Other Top Tech Employers
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {COMPANIES.filter((c) => c.slug !== companyInfo.slug).map((c) => (
                                <Link
                                    key={c.slug}
                                    href={`/jobs/company/${c.slug}`}
                                    className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-primary-50 hover:border-primary-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors"
                                >
                                    <span>{c.logoEmoji}</span>
                                    <span>{c.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
