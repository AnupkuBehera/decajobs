import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSenseUnit } from "@/components/adsense-unit";
import { BLOG_ARTICLES } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Career Blog - Job Search Tips, Interview Guides & Salary Playbooks | DecaJobs",
  description:
    "In-depth career blueprints, ATS resume optimization strategies, behavioral interview guides (STAR method), and salary negotiation frameworks from Anup Behera and the DecaJobs editorial team.",
  alternates: {
    canonical: "https://decajob.com/blog",
  },
};

export default function BlogPage() {
  const articles = Object.values(BLOG_ARTICLES);

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Career Blog" }]} />

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 mb-3 border border-primary-100">
            <span>📚</span> Expert Career Blueprints &amp; Hiring Telemetry
          </div>
          <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl lg:text-5xl">
            DecaJobs Career Blog
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Data-backed career guides, ATS parsing secrets, proven salary negotiation scripts, and behavioral interview strategies to accelerate your career.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500">
            <span>Editor-in-Chief: <Link href="/blog/author/anup-behera" className="text-primary-600 font-semibold hover:underline">Anup Behera</Link></span>
            <span>·</span>
            <Link href="/blog/editorial-policy" className="hover:text-primary-600 underline">Editorial &amp; Fact-Checking Standards</Link>
          </div>
        </div>

        {/* Top AdSense Display Unit */}
        <AdSenseUnit label="Featured Career Resources" className="mb-10" />

        {/* Article Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-lg hover:border-primary-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                    {article.category}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {article.readingTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="mt-2.5 text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{article.author.avatarEmoji}</span>
                  <span className="font-medium text-neutral-700">{article.author.name}</span>
                </div>
                <time dateTime={article.dateISO}>{article.date}</time>
              </div>
            </Link>
          ))}
        </div>

        {/* Mid-page AdSense banner */}
        <AdSenseUnit label="Sponsored Educational Links" className="my-12" />

        {/* E-E-A-T Editorial Commitment Banner */}
        <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-base font-bold text-neutral-900">
              Our Editorial Quality Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every guide published on DecaJobs is crafted by experienced technologists and hiring experts. We never publish auto-generated, thin regurgitations. All salary figures and market statistics are cross-referenced with verified compensation disclosures and recruiter feedback.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/blog/author/anup-behera"
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors text-center"
            >
              Meet the Author →
            </Link>
            <Link
              href="/blog/editorial-policy"
              className="rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors text-center"
            >
              Editorial Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
