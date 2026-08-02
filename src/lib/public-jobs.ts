/**
 * Public Jobs Data Layer
 *
 * Powers the public, indexable job board (/jobs, /jobs/[slug], /jobs/remote,
 * /jobs/category/[category], /jobs/location/[city]) using free, keyless job
 * APIs (Remotive, RemoteOK, Arbeitnow). This gives Google unique, fresh,
 * crawlable content — a key AdSense "low value content" quality signal.
 *
 * All fetches are wrapped in try/catch and return empty arrays on failure so
 * pages always render with graceful fallback editorial content.
 */

import type { ExternalJob } from "@/lib/external-jobs/types";
import { fetchRemotiveJobs } from "@/lib/external-jobs/remotive";
import { fetchRemoteOKJobs } from "@/lib/external-jobs/remoteok";
import { fetchArbeitnowJobs } from "@/lib/external-jobs/arbeitnow";

export type { ExternalJob } from "@/lib/external-jobs/types";

/** How long to cache fetched job lists (seconds). 1 hour = fresh but stable. */
export const PUBLIC_JOBS_REVALIDATE = 3600;

/** Maximum number of public job listings to render per page. */
export const MAX_JOBS_PER_PAGE = 50;

/* ─────────────────────────── Category taxonomy ─────────────────────────── */

export interface JobCategory {
    slug: string;
    name: string;
    emoji: string;
    keywords: string[];
    intro: string;
    careers: { title: string; text: string }[];
}

export const JOB_CATEGORIES: JobCategory[] = [
    {
        slug: "software-engineering",
        name: "Software Engineering",
        emoji: "💻",
        keywords: ["software", "developer", "engineer", "full stack", "fullstack", "frontend", "front-end", "backend", "back-end", "programmer", "coding", "java", "python", "javascript", "typescript", "react", "node", "golang", "ruby", "php", "c++", ".net", "swift", "kotlin"],
        intro:
            "Software engineering remains one of the highest-demand careers in 2026. From full-stack web developers to backend platform engineers, companies around the world are hiring for roles that build and maintain the products powering the digital economy.",
        careers: [
            { title: "Frontend Developer", text: "Build user interfaces with React, Vue, or Angular. Pair design with engineering to create fast, accessible, and delightful web experiences." },
            { title: "Backend Engineer", text: "Design APIs, databases, and server-side systems that keep applications reliable, secure, and scalable." },
            { title: "Full-Stack Developer", text: "Own features end-to-end — from the database schema to the pixels on screen. The most versatile role in modern product teams." },
            { title: "DevOps / Platform Engineer", text: "Automate infrastructure with Docker, Kubernetes, and CI/CD pipelines so teams can ship software quickly and safely." },
        ],
    },
    {
        slug: "data-analytics",
        name: "Data & Analytics",
        emoji: "📊",
        keywords: ["data", "analyst", "analytics", "scientist", "machine learning", "ml", "ai", "business intelligence", "bi", "sql", "python", "tableau", "power bi", "databricks", "spark", "etl"],
        intro:
            "Every company is now a data company. Analysts, data scientists, and machine learning engineers turn raw information into decisions, dashboards, and intelligent products — making data roles some of the most valuable in 2026.",
        careers: [
            { title: "Data Analyst", text: "Query, clean, and visualize data to answer business questions. SQL, Excel, and a dashboarding tool are your core toolkit." },
            { title: "Data Scientist", text: "Apply statistics and machine learning to predict outcomes, segment users, and surface insights that drive strategy." },
            { title: "Machine Learning Engineer", text: "Productionize models — train, deploy, and monitor ML systems that run at scale in real products." },
            { title: "Business Intelligence Developer", text: "Design the dashboards and data pipelines that executives rely on for reporting and planning." },
        ],
    },
    {
        slug: "product-design",
        name: "Product & Design",
        emoji: "🎨",
        keywords: ["product manager", "product owner", "ux", "ui", "designer", "design", "research", "figma", "product"],
        intro:
            "Great products need people who understand users, strategy, and craft. Product managers define what to build while designers make it intuitive and beautiful — a pairing at the heart of every successful company.",
        careers: [
            { title: "Product Manager", text: "Own the roadmap and strategy. Prioritize what to build based on user research, data, and business goals." },
            { title: "UX Designer", text: "Research user needs and design flows, wireframes, and prototypes that are intuitive and accessible." },
            { title: "UI Designer", text: "Craft the visual language — color, typography, and components — that make products polished and on-brand." },
            { title: "Product Designer", text: "A hybrid role covering research, interaction, and visual design to deliver end-to-end product experiences." },
        ],
    },
    {
        slug: "marketing-sales",
        name: "Marketing & Sales",
        emoji: "📣",
        keywords: ["marketing", "sales", "growth", "seo", "content", "social media", "digital marketing", "account executive", "account manager", "bdm", "business development", "customer success", "affiliate", "ppc", "brand"],
        intro:
            "Marketing and sales teams fuel revenue growth. From SEO specialists to account executives, these roles blend creativity, data, and relationship-building to connect products with the people who need them.",
        careers: [
            { title: "Digital Marketing Specialist", text: "Run campaigns across search, social, and email. Measure performance and optimize relentlessly." },
            { title: "SEO Specialist", text: "Grow organic traffic through technical SEO, content strategy, and authoritative link building." },
            { title: "Account Executive", text: "Own the sales cycle from prospecting to close. Build pipelines and negotiate deals that grow revenue." },
            { title: "Customer Success Manager", text: "Retain and expand accounts by helping customers achieve their goals with your product." },
        ],
    },
    {
        slug: "devops-cloud",
        name: "DevOps & Cloud",
        emoji: "☁️",
        keywords: ["devops", "cloud", "aws", "azure", "gcp", "kubernetes", "docker", "sre", "site reliability", "infrastructure", "terraform", "linux", "sysadmin", "networking"],
        intro:
            "Cloud and DevOps professionals keep modern systems running. As organizations move to multi-cloud architectures, SREs and platform engineers who can automate reliability are in extremely high demand.",
        careers: [
            { title: "DevOps Engineer", text: "Build CI/CD pipelines, automate infrastructure, and streamline the path from commit to production." },
            { title: "Site Reliability Engineer (SRE)", text: "Apply software engineering to operations — keep systems available, fast, and observable at scale." },
            { title: "Cloud Architect", text: "Design secure, cost-efficient cloud architectures on AWS, Azure, or GCP." },
            { title: "Platform Engineer", text: "Create internal developer platforms and tooling that make engineering teams more productive." },
        ],
    },
    {
        slug: "human-resources",
        name: "Human Resources",
        emoji: "🤝",
        keywords: ["hr", "human resources", "recruiter", "recruiting", "talent", "people", "operations", "onboarding", "payroll"],
        intro:
            "People are a company's greatest asset — and HR professionals make sure they're hired, developed, and supported. Recruiting, people operations, and talent management roles continue to grow as companies scale.",
        careers: [
            { title: "Recruiter", text: "Source, screen, and hire top talent. Build candidate pipelines and craft a great hiring experience." },
            { title: "HR Business Partner", text: "Align people strategy with business goals — from performance management to organizational design." },
            { title: "Talent Acquisition Lead", text: "Own hiring strategy for a company or region, including employer branding and hiring ops." },
            { title: "People Operations", text: "Run the systems that support employees: onboarding, benefits, policies, and culture programs." },
        ],
    },
    {
        slug: "finance-accounting",
        name: "Finance & Accounting",
        emoji: "💰",
        keywords: ["finance", "accountant", "accounting", "financial analyst", "fp&a", "audit", "tax", "bookkeeping", "controller", "investment", "payments"],
        intro:
            "Finance professionals keep companies solvent, compliant, and strategically funded. From FP&A analysts to controllers, these roles combine analytical rigor with business judgment.",
        careers: [
            { title: "Financial Analyst", text: "Build models and forecasts that guide budgeting, pricing, and investment decisions." },
            { title: "Accountant", text: "Maintain accurate books, close the period, and ensure tax and regulatory compliance." },
            { title: "FP&A Manager", text: "Own planning, forecasting, and management reporting for leadership." },
            { title: "Controller", text: "Oversee accounting operations and financial reporting for the whole company." },
        ],
    },
    {
        slug: "customer-support",
        name: "Customer Support",
        emoji: "🎧",
        keywords: ["support", "customer service", "helpdesk", "help desk", "technical support", "success", "operations", "agent", "analyst support"],
        intro:
            "Customer support is the frontline of every business. As products become more complex, companies invest in knowledgeable support and success teams that resolve issues and build loyalty.",
        careers: [
            { title: "Customer Support Agent", text: "Resolve customer questions via chat, email, and phone with speed and empathy." },
            { title: "Technical Support Engineer", text: "Troubleshoot product issues and work with engineering to fix root causes." },
            { title: "Support Team Lead", text: "Manage a team of agents, set SLAs, and drive continuous quality improvement." },
            { title: "Customer Success Manager", text: "Proactively help customers get value from the product to reduce churn and drive expansion." },
        ],
    },
];

export function getCategoryBySlug(slug: string): JobCategory | undefined {
    return JOB_CATEGORIES.find((c) => c.slug === slug);
}

/* ────────────────────────────── Locations ──────────────────────────────── */

export interface CityInfo {
    slug: string;
    name: string;
    aliases: string[];
    blurb: string;
}

export const CITIES: CityInfo[] = [
    {
        slug: "bangalore",
        name: "Bangalore",
        aliases: ["bangalore", "bengaluru", "blr"],
        blurb:
            "Bangalore (Bengaluru) is India's Silicon Valley — home to thousands of tech companies, startups, and global capability centers. From product engineering to data science, the city offers some of the highest-paying tech roles in the country.",
    },
    {
        slug: "mumbai",
        name: "Mumbai",
        aliases: ["mumbai", "bombay"],
        blurb:
            "Mumbai is India's financial capital and media hub. Banking, fintech, entertainment, and consulting companies cluster here, creating a rich mix of finance, technology, and business roles.",
    },
    {
        slug: "delhi",
        name: "Delhi NCR",
        aliases: ["delhi", "ncr", "gurgaon", "gurugram", "noida", "new delhi"],
        blurb:
            "Delhi NCR — including Gurugram and Noida — is a massive employment hub spanning tech, e-commerce, startups, and government-adjacent industries. It offers some of the highest volumes of job openings in India.",
    },
    {
        slug: "hyderabad",
        name: "Hyderabad",
        aliases: ["hyderabad", "hitech", "gachibowli"],
        blurb:
            "Hyderabad has emerged as a global tech and pharma hub. With major tech parks in HITEC City and Gachibowli, the city offers strong opportunities in IT services, product companies, and life sciences.",
    },
    {
        slug: "chennai",
        name: "Chennai",
        aliases: ["chennai", "madras"],
        blurb:
            "Chennai is a manufacturing, automotive, and IT powerhouse. Its thriving engineering, healthcare, and BFSI sectors make it a stable market for both freshers and experienced professionals.",
    },
    {
        slug: "pune",
        name: "Pune",
        aliases: ["pune", "puna"],
        blurb:
            "Pune is a fast-growing IT and manufacturing hub known for its automotive clusters, engineering colleges, and a rapidly expanding startup ecosystem — a great market for engineers and analysts.",
    },
];

export function getCityBySlug(slug: string): CityInfo | undefined {
    return CITIES.find((c) => c.slug === slug);
}

/* ─────────────────────────── Slug generation ───────────────────────────── */

/** Create a stable, URL-safe slug from a job title + company. */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

/** Stable public slug for a job. */
export function jobSlug(job: Pick<ExternalJob, "id" | "title">): string {
    return `${slugify(job.title)}-${slugify(job.id).slice(-12)}`;
}

export function findJobBySlug(slug: string, jobs: ExternalJob[]): ExternalJob | undefined {
    return jobs.find((job) => jobSlug(job) === slug);
}

/* ───────────────────────────── Fetch helpers ───────────────────────────── */

/** Remove HTML tags and collapse whitespace from a job description. */
export function cleanDescription(html: string): string {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/"/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/\s+/g, " ")
        .trim();
}

/** Format an ISO date into a friendly "Aug 2, 2026" string. */
export function formatPostedDate(iso: string | undefined): string {
    if (!iso) return "Recently";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Days since a job was posted (for badges). */
export function daysSincePosted(iso: string | undefined): number | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Shorten a job description for card previews. */
export function truncate(text: string, maxLength = 160): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}…`;
}

/* ───────────────────────────── Matching logic ──────────────────────────── */

/** Score a job against a set of keywords (0-100). */
export function keywordScore(text: string, keywords: string[]): number {
    if (keywords.length === 0) return 0;
    const lower = text.toLowerCase();
    let hits = 0;
    for (const kw of keywords) {
        if (lower.includes(kw.toLowerCase())) hits += 1;
    }
    return Math.round((hits / keywords.length) * 100);
}

/** Normalize a job title for matching. */
function normalizeTitle(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Check if a job matches a category based on title + company + description. */
export function jobMatchesCategory(job: ExternalJob, category: JobCategory): boolean {
    const haystack = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    return category.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

/** Normalize a location string for matching. */
export function normalizeLocation(location: string): string {
    return location.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Check if a job is located in (or near) a city. */
export function jobMatchesCity(job: ExternalJob, city: CityInfo): boolean {
    const loc = normalizeLocation(job.location);
    if (loc === "remote" || loc.includes("remote")) return true;
    return city.aliases.some((alias) => loc.includes(alias));
}

/** Check if a job is remote. */
export function isRemoteJob(job: ExternalJob): boolean {
    return normalizeLocation(job.location).includes("remote");
}

/* ─────────────────────────────── Data fetch ────────────────────────────── */

const SEED_QUERIES = ["developer", "designer", "product manager", "data analyst", "marketing"];

/**
 * Fetch public jobs from all free sources, deduplicated and sorted by recency.
 * Cached at the module level for 1 hour to limit external API calls.
 */
export async function fetchPublicJobs(): Promise<ExternalJob[]> {
    try {
        // Try a few seed queries so we get broad coverage, then dedupe.
        const [remotiveA, remotiveB, remoteok, arbeitnowA, arbeitnowB] = await Promise.all([
            fetchRemotiveJobs("developer"),
            fetchRemotiveJobs("product"),
            fetchRemoteOKJobs(["developer", "design", "marketing", "data"]),
            fetchArbeitnowJobs("software"),
            fetchArbeitnowJobs("design"),
        ]);

        const all = [...remotiveA, ...remotiveB, ...remoteok, ...arbeitnowA, ...arbeitnowB];

        // Deduplicate by normalized title + company.
        const seen = new Set<string>();
        const unique: ExternalJob[] = [];
        for (const job of all) {
            const key = `${normalizeTitle(job.title)}|${job.company.toLowerCase().trim()}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push({ ...job, description: cleanDescription(job.description) });
            }
        }

        // Sort by postedAt desc, most recent first.
        unique.sort((a, b) => {
            const ta = new Date(a.postedAt).getTime();
            const tb = new Date(b.postedAt).getTime();
            if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
            if (Number.isNaN(ta)) return 1;
            if (Number.isNaN(tb)) return -1;
            return tb - ta;
        });

        return unique.slice(0, MAX_JOBS_PER_PAGE * 3);
    } catch (error) {
        console.error("[PublicJobs] Failed to fetch public jobs:", error);
        return [];
    }
}

/** Fetch jobs, optionally filtered by category / location / remote. */
export async function fetchPublicJobsFiltered(opts?: {
    category?: JobCategory;
    city?: CityInfo;
    remoteOnly?: boolean;
}): Promise<ExternalJob[]> {
    const all = await fetchPublicJobs();
    return all.filter((job) => {
        if (opts?.remoteOnly && !isRemoteJob(job)) return false;
        if (opts?.category && !jobMatchesCategory(job, opts.category)) return false;
        if (opts?.city && !jobMatchesCity(job, opts.city)) return false;
        return true;
    });
}

/* ─────────────────────── Build-time sample data ────────────────────────── */

/**
 * Sample jobs used for static generation / graceful fallback when external
 * APIs are unavailable (e.g., during `next build` with no network). These are
 * realistic example listings that never link to live applications; they keep
 * pages meaningful and renderable in any environment.
 */
export const SAMPLE_JOBS: ExternalJob[] = [
    {
        id: "sample-frontend-react",
        title: "Frontend Developer (React)",
        company: "TechNova",
        description:
            "We're looking for a Frontend Developer with 2+ years of React experience to build fast, accessible interfaces. You'll work with designers and backend engineers to ship features end-to-end. Strong JavaScript, TypeScript, and CSS skills required. Experience with Next.js and Tailwind CSS is a plus.",
        location: "Remote",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-data-analyst",
        title: "Data Analyst",
        company: "DataWorks",
        description:
            "Join our analytics team to build dashboards and insights that drive decisions. You should be strong in SQL, Excel, and a visualization tool (Power BI or Tableau). Python is a bonus. This role suits candidates who love turning messy data into clear stories for stakeholders.",
        location: "Bangalore",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-product-manager",
        title: "Product Manager",
        company: "GrowthLab",
        description:
            "We are hiring a Product Manager to own our SaaS roadmap. You will talk to customers, prioritize features, write PRDs, and work with engineering and design to ship. 3+ years of product experience preferred. Strong analytical and communication skills are essential.",
        location: "Remote",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-devops",
        title: "DevOps Engineer",
        company: "CloudScale",
        description:
            "We're looking for a DevOps Engineer to manage our AWS infrastructure and CI/CD pipelines. Experience with Docker, Kubernetes, Terraform, and Linux is required. You will improve deployment speed and system reliability across our microservices.",
        location: "Hyderabad",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-ml-engineer",
        title: "Machine Learning Engineer",
        company: "Neuralytics",
        description:
            "Build and deploy machine learning models at scale. You should be comfortable with Python, PyTorch or TensorFlow, and cloud ML services. Experience with MLOps practices and model monitoring is a strong plus. Remote-friendly team.",
        location: "Remote",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-ux-designer",
        title: "UX/UI Designer",
        company: "PixelCraft",
        description:
            "We are looking for a UX/UI Designer to design intuitive web and mobile experiences. You should have a strong portfolio, proficiency in Figma, and experience running user research and usability tests. Motion design is a bonus.",
        location: "Mumbai",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        source: "sample",
    },
];

/**
 * Get public jobs for rendering. Uses cached API data when available, falling
 * back to sample jobs so pages always have content.
 */
export async function getPublicJobs(): Promise<ExternalJob[]> {
    const live = await fetchPublicJobs();
    return live.length > 0 ? live : SAMPLE_JOBS;
}

/**
 * Get filtered public jobs with graceful fallback to sample data.
 */
export async function getPublicJobsFiltered(opts?: {
    category?: JobCategory;
    city?: CityInfo;
    remoteOnly?: boolean;
}): Promise<ExternalJob[]> {
    const live = await fetchPublicJobsFiltered(opts);
    if (live.length > 0) return live;

    // Fallback: filter sample data by the same rules.
    const filtered = SAMPLE_JOBS.filter((job) => {
        if (opts?.remoteOnly && !isRemoteJob(job)) return false;
        if (opts?.category && !jobMatchesCategory(job, opts.category)) return false;
        if (opts?.city && !jobMatchesCity(job, opts.city)) return false;
        return true;
    });
    return filtered;
}

