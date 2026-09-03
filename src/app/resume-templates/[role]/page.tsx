import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TEMPLATE_ROLES } from "@/lib/resume/template-roles";

interface Props {
    params: Promise<{ role: string }>;
}

export async function generateStaticParams() {
    return TEMPLATE_ROLES.map((t) => ({ role: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { role } = await params;
    const template = TEMPLATE_ROLES.find((t) => t.slug === role);
    if (!template) return {};

    return {
        title: `${template.title} ATS Resume Template 2026 - Free Download & AI Generator | DecaJobs`,
        description: `Download the recruiter-approved ${template.title} ATS resume template for 2026. Includes battle-tested achievement bullets, top industry keywords, and 1-click AI customization.`,
        alternates: {
            canonical: `https://decajob.com/resume-templates/${template.slug}`,
        },
        openGraph: {
            title: `${template.title} Resume Template (ATS 98% Score) | DecaJobs`,
            description: `ATS-tested resume template for ${template.title}. Free download & AI builder.`,
            url: `https://decajob.com/resume-templates/${template.slug}`,
            type: "website",
        },
    };
}

export default async function RoleResumeTemplatePage({ params }: Props) {
    const { role } = await params;
    const template = TEMPLATE_ROLES.find((t) => t.slug === role);

    if (!template) {
        notFound();
    }

    const builderUrl = `/resume-tools?tab=builder&template=${template.slug}&role=${encodeURIComponent(template.title)}`;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://decajob.com" },
            { "@type": "ListItem", position: 2, name: "Resume Templates", item: "https://decajob.com/resume-templates" },
            { "@type": "ListItem", position: 3, name: template.title, item: `https://decajob.com/resume-templates/${template.slug}` },
        ],
    };

    return (
        <div className="py-10 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <Breadcrumbs
                    items={[
                        { label: "Resume Templates", href: "/resume-templates" },
                        { label: template.title },
                    ]}
                />

                {/* Hero Header */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl">{template.emoji}</span>
                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                                    ATS Compatibility: {template.atsScore}
                                </span>
                                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                                    {template.experienceLevel}
                                </span>
                            </div>
                            <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
                                {template.title} ATS Resume Template
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">
                                {template.summary}
                            </p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <Link
                                href={builderUrl}
                                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors min-h-[48px]"
                            >
                                ✨ Customize with AI (Free) →
                            </Link>
                        </div>
                    </div>

                    {/* Skill Pills */}
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                            High-Weight ATS Keywords Included in this Template
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {template.topSkills.map((s) => (
                                <span
                                    key={s}
                                    className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 border border-neutral-200"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sample Resume Preview Card */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm mb-10 font-sans">
                    <div className="border-b border-neutral-200 pb-4 text-center">
                        <h2 className="text-xl font-bold text-neutral-900">ALEX MORGAN</h2>
                        <p className="text-xs text-neutral-600 mt-1">
                            alex.morgan@email.com · +91 98765 43210 · Bangalore, India · linkedin.com/in/alexmorgan
                        </p>
                        <p className="text-xs font-semibold text-primary-700 mt-1">
                            {template.title.toUpperCase()}
                        </p>
                    </div>

                    {/* Summary */}
                    <div className="mt-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                            Professional Summary
                        </h3>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                            Results-driven {template.title} with 3+ years of experience delivering scalable,
                            high-impact solutions. Proven track record in optimizing workflow latency, architecting
                            robust systems, and collaborating cross-functionally with engineering, product, and data teams.
                        </p>
                    </div>

                    {/* Experience */}
                    <div className="mt-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-3">
                            Work Experience
                        </h3>
                        <div className="space-y-4 text-xs">
                            <div>
                                <div className="flex justify-between font-semibold text-neutral-900">
                                    <span>Senior {template.title} — TechNova Inc.</span>
                                    <span className="text-neutral-500">2023 – Present</span>
                                </div>
                                <ul className="list-disc pl-4 mt-1 space-y-1 text-neutral-700">
                                    <li>Architected core microservices reducing system response latency by 35% across 2M daily requests.</li>
                                    <li>Spearheaded implementation of automated CI/CD deployment pipelines, cutting release cycle time by 4 days.</li>
                                    <li>Mentored 4 junior team members in technical best practices and automated testing coverage (&gt;85%).</li>
                                </ul>
                            </div>
                            <div>
                                <div className="flex justify-between font-semibold text-neutral-900">
                                    <span>{template.title} — CloudScale Systems</span>
                                    <span className="text-neutral-500">2021 – 2023</span>
                                </div>
                                <ul className="list-disc pl-4 mt-1 space-y-1 text-neutral-700">
                                    <li>Built REST and GraphQL APIs powering real-time data streaming and dashboard analytics.</li>
                                    <li>Collaborated with design and product teams to launch 6 new customer-facing features on schedule.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                            Technical Skills & Competencies
                        </h3>
                        <p className="text-xs text-neutral-700 leading-relaxed">
                            <strong>Core Skills:</strong> {template.topSkills.join(", ")} · Git · Agile / Scrum · System Architecture · Unit Testing
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-neutral-500">
                            Ready to replace placeholder details with your personal experience?
                        </p>
                        <Link
                            href={builderUrl}
                            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
                        >
                            Load into AI Builder ✨
                        </Link>
                    </div>
                </div>

                {/* Related Career Resources & Live Jobs internal linking block */}
                <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-neutral-900">
                        Next Steps: Supercharge Your {template.title} Job Search
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">
                        Use our free AI tools and explore active openings tailored to your target career path.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <Link
                            href="/tools/resume-checker"
                            className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-sm"
                        >
                            <span className="text-xl mb-1">📄</span>
                            <span className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                                Check ATS Score
                            </span>
                            <span className="mt-1 text-xs text-neutral-500">
                                Score your customized resume out of 100 with free instant feedback.
                            </span>
                        </Link>

                        <Link
                            href="/tools/salary-calculator"
                            className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-sm"
                        >
                            <span className="text-xl mb-1">💰</span>
                            <span className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                                Salary Benchmarks
                            </span>
                            <span className="mt-1 text-xs text-neutral-500">
                                Explore compensation for {template.title} roles across global markets.
                            </span>
                        </Link>

                        <Link
                            href="/jobs"
                            className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-sm"
                        >
                            <span className="text-xl mb-1">💼</span>
                            <span className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                                Browse Active Jobs
                            </span>
                            <span className="mt-1 text-xs text-neutral-500">
                                Discover curated live openings and get 10 matched jobs daily.
                            </span>
                        </Link>
                    </div>

                    {/* Other templates */}
                    <div className="mt-6 pt-5 border-t border-neutral-200">
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                            Other Popular Resume Templates:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {TEMPLATE_ROLES.filter((t) => t.slug !== template.slug).map((t) => (
                                <Link
                                    key={t.slug}
                                    href={`/resume-templates/${t.slug}`}
                                    className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
                                >
                                    {t.title} Resume
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Google Search Breadcrumbs */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            </div>
        </div>
    );
}
