import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
    title: "Free ATS Resume Templates 2026 - Optimized for Tech, Data & Management | DecaJobs",
    description:
        "Download free ATS-friendly resume templates optimized for 2026 hiring algorithms. Tailor software engineer, data analyst, product manager, and designer resumes in 1-click with DecaJobs AI.",
    alternates: {
        canonical: "https://decajob.com/resume-templates",
    },
    openGraph: {
        title: "Free ATS Resume Templates 2026 | DecaJobs",
        description:
            "ATS-tested, recruiter-approved resume templates for tech, data, and management roles. Customize and download in PDF for free.",
        url: "https://decajob.com/resume-templates",
        type: "website",
    },
};

export const TEMPLATE_ROLES = [
    {
        slug: "software-engineer",
        title: "Software Engineer",
        category: "Engineering",
        emoji: "💻",
        experienceLevel: "Junior to Senior",
        atsScore: "98%",
        summary:
            "Full-stack and backend software engineering template focusing on scalable system design, API performance, CI/CD pipelines, and modern stack (TypeScript, Python, React, Go).",
        topSkills: ["TypeScript / React", "Python / Node.js", "System Design", "Docker & Kubernetes", "PostgreSQL"],
    },
    {
        slug: "data-analyst",
        title: "Data Analyst & Scientist",
        category: "Data & AI",
        emoji: "📊",
        experienceLevel: "Entry to Lead",
        atsScore: "96%",
        summary:
            "Tailored for SQL querying, Power BI/Tableau dashboarding, statistical modeling, ETL pipelines, and business impact metrics.",
        topSkills: ["SQL & Window Functions", "Python (Pandas, Scikit-learn)", "Power BI / Tableau", "ETL Pipelines", "A/B Testing"],
    },
    {
        slug: "product-manager",
        title: "Product Manager",
        category: "Product & Management",
        emoji: "🚀",
        experienceLevel: "Associate to Director",
        atsScore: "97%",
        summary:
            "Designed to highlight customer discovery, roadmapping, PRD authoring, cross-functional engineering leadership, and North Star metric growth.",
        topSkills: ["Product Roadmapping", "User Story Mapping", "Agile & Scrum", "Data-Driven Prioritization", "Stakeholder Management"],
    },
    {
        slug: "devops-cloud-engineer",
        title: "DevOps & Cloud Engineer",
        category: "Infrastructure",
        emoji: "☁️",
        experienceLevel: "Mid to Senior",
        atsScore: "99%",
        summary:
            "Emphasizes cloud architectures (AWS/GCP/Azure), Infrastructure as Code (Terraform), Kubernetes orchestration, zero-downtime deployments, and uptime SLAs.",
        topSkills: ["Terraform / IaC", "Kubernetes & Docker", "AWS / GCP", "CI/CD (GitHub Actions)", "Prometheus & Grafana"],
    },
    {
        slug: "ui-ux-designer",
        title: "UI/UX & Product Designer",
        category: "Design",
        emoji: "🎨",
        experienceLevel: "All Levels",
        atsScore: "95%",
        summary:
            "Showcases design system architecture, Figma wireframing, usability testing metrics, accessibility compliance, and developer handoff.",
        topSkills: ["Figma & Design Systems", "User Research & Testing", "Wireframing & Prototyping", "Design Tokens", "WCAG Accessibility"],
    },
    {
        slug: "fresher-developer",
        title: "Fresher / College Graduate",
        category: "Early Career",
        emoji: "🎓",
        experienceLevel: "Entry Level / 0-1 Year",
        atsScore: "96%",
        summary:
            "Optimized for fresh graduates and career switchers without extensive formal work history. Highlights personal projects, hackathons, academic excellence, and core CS fundamentals.",
        topSkills: ["Data Structures & Algorithms", "Full-Stack Project Work", "Git & GitHub", "API Integration", "Problem Solving"],
    },
];

export default function ResumeTemplatesPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What makes a resume ATS-friendly in 2026?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "An ATS-friendly resume uses standard single-column layouts, universal headings (Experience, Education, Skills), no complex graphics or nested tables, and contains industry-standard keywords that match the job description.",
                },
            },
            {
                "@type": "Question",
                name: "Can I edit and download these templates for free?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! DecaJobs allows you to customize every template using our AI Resume Builder and download your ATS-ready resume in high-resolution PDF for free.",
                },
            },
            {
                "@type": "Question",
                name: "How does the AI Resume Builder tailor my template?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our AI scans your experience against target job descriptions, identifies missing skills, and rewires your achievement bullet points using strong action verbs and quantified impact metrics.",
                },
            },
        ],
    };

    return (
        <div className="py-10 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <Breadcrumbs items={[{ label: "Resume Templates" }]} />

                {/* Hero */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 border border-primary-200">
                        ⚡ ATS Approved · 2026 Standards
                    </span>
                    <h1 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                        Free ATS Resume Templates
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-neutral-600">
                        Crafted to pass applicant tracking systems (Workday, Greenhouse, Lever, Taleo).
                        Select your role to customize with AI in 60 seconds.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                    {TEMPLATE_ROLES.map((tpl) => (
                        <div
                            key={tpl.slug}
                            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">{tpl.emoji}</span>
                                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                                        ATS {tpl.atsScore}
                                    </span>
                                </div>
                                <h2 className="mt-4 text-lg font-bold text-neutral-900">
                                    {tpl.title}
                                </h2>
                                <p className="text-xs font-medium text-primary-600 mt-0.5">
                                    {tpl.category} · {tpl.experienceLevel}
                                </p>
                                <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
                                    {tpl.summary}
                                </p>

                                <div className="mt-4 pt-3 border-t border-neutral-100">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                                        Core Keyword Tags
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {tpl.topSkills.map((s) => (
                                            <span
                                                key={s}
                                                className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <Link
                                    href={`/resume-templates/${tpl.slug}`}
                                    className="block text-center rounded-lg bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
                                >
                                    View & Use Template →
                                </Link>
                                <Link
                                    href={`/resume-tools?tab=builder&template=${tpl.slug}&role=${encodeURIComponent(tpl.title)}`}
                                    className="block text-center rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                >
                                    ✨ Customize in AI Builder
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Informational / SEO Section */}
                <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        Why ATS-Friendly Formatting Matters
                    </h2>
                    <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
                        <p>
                            Over 90% of Fortune 500 companies and modern tech startups utilize Applicant
                            Tracking Systems (ATS) to filter candidate resumes before a human recruiter
                            ever reads them. Resumes with multi-column tables, text boxes, non-standard fonts,
                            or graphics often fail parsing algorithms, resulting in immediate rejection.
                        </p>
                        <p>
                            Every template on DecaJobs is engineered specifically to comply with parsing
                            standards:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Standard Hierarchy:</strong> Clear H1 and H2 structures for Experience, Education, and Skills.</li>
                            <li><strong>Machine-Readable Dates:</strong> Consistent ISO month/year notations.</li>
                            <li><strong>Action-Driven Bullets:</strong> Quantified achievements (e.g. &ldquo;Reduced latency by 40%&rdquo;) that score high in semantic matching.</li>
                            <li><strong>Direct Integration with Daily 10 Jobs:</strong> Once built, match your resume against live openings in your daily digest.</li>
                        </ul>
                    </div>
                </section>

                {/* FAQ Schema Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            </div>
        </div>
    );
}
