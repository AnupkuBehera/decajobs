import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Author {
  slug: string;
  name: string;
  role: string;
  avatarEmoji: string;
  bio: string;
  longBio: string[];
  credentials: string[];
  domains: string[];
  socials: { label: string; href: string }[];
  articles: { slug: string; title: string; category: string; date: string }[];
}

const AUTHORS: Record<string, Author> = {
  "anup-behera": {
    slug: "anup-behera",
    name: "Anup Behera",
    role: "Founder & Technology Specialist",
    avatarEmoji: "👨‍💻",
    bio: "Full-stack software architect, career mentor, and founder of DecaJobs. Dedicated to leveraging algorithmic matching and AI to help candidates bypass recruiter black holes.",
    longBio: [
      "Anup Behera is the founder and lead developer of DecaJobs. With over 8 years of engineering and algorithmic systems experience, Anup built DecaJobs after witnessing how traditional hiring platforms prioritize sponsored spam over genuine skill-based merit.",
      "Anup specializes in Applicant Tracking System (ATS) parsing architecture, career growth strategies, and automated data pipelines. His research on candidate rejection patterns and keyword heuristics powers DecaJobs' algorithmic matching engine, delivering 10 verified job opportunities to job seekers daily.",
      "He writes deeply about technical hiring, resume optimization, algorithmic career navigation, and salary negotiation for software engineers and knowledge professionals across India and global remote ecosystems.",
    ],
    credentials: [
      "Founder & Chief Architect, DecaJobs (2025 – Present)",
      "Senior Full-Stack & Systems Engineer (Specializing in Next.js, Supabase, AI API Integrations)",
      "Technical Hiring Advisor & Interview Coach for 500+ Engineering Candidates",
      "Author of the DecaJobs 2026 Remote Engineering & Salary Benchmarking Study",
    ],
    domains: [
      "Software Engineering & System Design",
      "Applicant Tracking Systems (ATS) Optimization",
      "Tech Salary Negotiation & Counter-Offers",
      "Remote Work Architecture & Global Hiring",
      "AI-Assisted Job Search & Portfolio Optimization",
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com/in/anup-behera" },
      { label: "GitHub", href: "https://github.com/AnupkuBehera" },
      { label: "Twitter / X", href: "https://x.com/decajobs" },
      { label: "Email", href: "mailto:support@decajob.com" },
    ],
    articles: [
      {
        slug: "top-10-resume-mistakes",
        title: "Top 10 Resume Mistakes That Get You Rejected (And How to Fix Them)",
        category: "Resume Tips",
        date: "June 12, 2026",
      },
      {
        slug: "ats-resume-secrets",
        title: "How to Beat the ATS (Applicant Tracking System): Secrets from Recruiters",
        category: "Resume Tips",
        date: "May 28, 2026",
      },
      {
        slug: "salary-negotiation-tips",
        title: "Salary Negotiation: How to Get 20-40% More Than the Initial Offer",
        category: "Salary",
        date: "June 5, 2026",
      },
      {
        slug: "how-to-crack-any-interview",
        title: "How to Crack Any Job Interview: The STAR Method + 50 Questions",
        category: "Interview Prep",
        date: "June 10, 2026",
      },
      {
        slug: "remote-jobs-guide-india",
        title: "Complete Guide to Finding Remote Jobs in India (2026)",
        category: "Remote Work",
        date: "June 8, 2026",
      },
      {
        slug: "artificial-intelligence-careers",
        title: "How AI is Changing the Job Market: Top Skills to Learn in 2026",
        category: "Career Growth",
        date: "May 25, 2026",
      },
      {
        slug: "freshers-job-search-guide",
        title: "Job Search Guide for Freshers: Land Your First Job in 30 Days",
        category: "Freshers",
        date: "June 3, 2026",
      },
      {
        slug: "how-to-negotiate-remote-salary",
        title: "How to Negotiate a Remote Salary: Global Pay & Geo-Bands Explained",
        category: "Salary",
        date: "June 19, 2026",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = AUTHORS[slug];

  if (!author) return { title: "Author Not Found | DecaJobs" };

  return {
    title: `${author.name} - ${author.role} | DecaJobs Editorial`,
    description: author.bio,
    alternates: {
      canonical: `https://decajob.com/blog/author/${author.slug}`,
    },
    openGraph: {
      title: `${author.name} | DecaJobs Career & Engineering Author`,
      description: author.bio,
      url: `https://decajob.com/blog/author/${author.slug}`,
      type: "profile",
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = AUTHORS[slug];

  if (!author) notFound();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    worksFor: {
      "@type": "Organization",
      name: "DecaJobs",
      url: "https://decajob.com",
    },
    description: author.bio,
    url: `https://decajob.com/blog/author/${author.slug}`,
    sameAs: author.socials.map((s) => s.href),
    knowsAbout: author.domains,
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Career Blog", href: "/blog" },
            { label: "Authors", href: "/blog" },
            { label: author.name, href: `/blog/author/${author.slug}` },
          ]}
        />

        {/* ── Author Hero Profile ── */}
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-5xl shadow-sm">
              {author.avatarEmoji}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  {author.name}
                </h1>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 border border-primary-200">
                  Verified Contributor &amp; Founder
                </span>
              </div>
              <p className="text-base font-medium text-primary-600">
                {author.role}
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                {author.bio}
              </p>

              {/* Social links */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {author.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-primary-600 transition-colors bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg"
                  >
                    <span>🔗</span> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Detailed Biography & Experience ── */}
          <div className="mt-8 border-t border-neutral-100 pt-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 mb-3">
                About {author.name}
              </h2>
              <div className="space-y-3 text-sm text-neutral-700 leading-relaxed">
                {author.longBio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Credentials & Domains */}
            <div className="grid gap-6 sm:grid-cols-2 pt-4">
              <div className="rounded-2xl bg-neutral-50 p-5 border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  🎖️ Credentials &amp; Background
                </h3>
                <ul className="space-y-2 text-xs text-neutral-700">
                  {author.credentials.map((cred, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">✓</span>
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-5 border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  🎯 Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {author.domains.map((domain, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-neutral-800 border border-neutral-200"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Articles by this Author ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">
              Articles by {author.name}
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {author.articles.length} in-depth guides published
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {author.articles.map((art) => (
              <Link
                key={art.slug}
                href={`/blog/${art.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md hover:border-primary-300"
              >
                <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 mb-2">
                  {art.category}
                </span>
                <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {art.title}
                </h3>
                <p className="mt-3 text-xs text-neutral-400">
                  Published {art.date}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Editorial Standards Note */}
        <div className="mt-12 rounded-2xl border border-primary-200 bg-primary-50/60 p-6 text-center">
          <h3 className="text-sm font-bold text-primary-950">
            DecaJobs Editorial &amp; Fact-Checking Standards
          </h3>
          <p className="mt-2 text-xs text-primary-800 max-w-xl mx-auto leading-relaxed">
            All career advice, salary estimates, and interview questions published on DecaJobs are reviewed for accuracy against industry compensation data, recruiter interviews, and current hiring regulations.
          </p>
          <Link
            href="/blog/editorial-policy"
            className="mt-3 inline-block text-xs font-semibold text-primary-700 hover:text-primary-900 underline"
          >
            Read our complete Editorial &amp; Fact-Checking Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
