import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSenseUnit } from "@/components/adsense-unit";
import { getAllBlogPosts, getLatestDailyUpdate } from "@/lib/blog-data";
import { BlogFilterClient } from "./blog-filter-client";

export const metadata: Metadata = {
  title: "Career Blog & Daily Updates — Job Search Tips, Interview Guides & Salary Playbooks | DecaJobs",
  description:
    "Daily job search updates, in-depth career blueprints, ATS resume optimization strategies, behavioral interview guides (STAR method), and salary negotiation frameworks from Anup Behera and the DecaJobs editorial team.",
  alternates: {
    canonical: "https://decajob.com/blog",
  },
  openGraph: {
    title: "DecaJobs Career Blog & Daily Updates",
    description: "Daily career telemetry, ATS blueprints, and interview playbooks.",
    url: "https://decajob.com/blog",
    siteName: "DecaJobs",
    type: "website",
  },
};

export default function BlogPage() {
  const articles = getAllBlogPosts();
  const latestDaily = getLatestDailyUpdate();

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Career Blog" }]} />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 mb-3 border border-primary-100">
            <span>📚</span> Expert Career Blueprints &amp; Daily Market Telemetry
          </div>
          <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl lg:text-5xl">
            DecaJobs Career Blog
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Data-backed career guides, daily job market updates, ATS parsing secrets, proven salary negotiation scripts, and behavioral interview strategies.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500">
            <span>Editor-in-Chief: <Link href="/blog/author/anup-behera" className="text-primary-600 font-semibold hover:underline">Anup Behera</Link></span>
            <span>·</span>
            <Link href="/blog/editorial-policy" className="hover:text-primary-600 underline">Editorial &amp; Fact-Checking Standards</Link>
            <span>·</span>
            <Link href="/blog/rss.xml" className="hover:text-primary-600 underline flex items-center gap-1">
              <span>📡</span> RSS Feed
            </Link>
          </div>
        </div>

        {/* Today's Daily Update Spotlight Banner */}
        {latestDaily && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50/50 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                📅 Today&apos;s Daily Career Update
              </span>
              <span className="text-xs text-neutral-500">· {latestDaily.readingTime}</span>
              <span className="text-xs text-neutral-500">· {latestDaily.date}</span>
            </div>

            <Link href={`/blog/${latestDaily.slug}`} className="group">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 group-hover:text-primary-700 transition-colors leading-snug">
                {latestDaily.title}
              </h2>
            </Link>

            <p className="mt-2.5 text-sm text-neutral-700 leading-relaxed max-w-3xl">
              {latestDaily.excerpt}
            </p>

            {/* Quick Metrics / Action Callout */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
              {latestDaily.actionItem && (
                <div className="rounded-xl bg-white/80 backdrop-blur-sm p-3.5 border border-amber-200 shadow-2xs">
                  <span className="font-bold text-amber-900">🎯 Daily 10-Minute Action:</span>
                  <p className="mt-1 text-neutral-700 line-clamp-2">{latestDaily.actionItem}</p>
                </div>
              )}
              {latestDaily.hotSkill && (
                <div className="rounded-xl bg-white/80 backdrop-blur-sm p-3.5 border border-amber-200 shadow-2xs">
                  <span className="font-bold text-amber-900">🔥 In-Demand Skill:</span>
                  <p className="mt-1 text-neutral-700">{latestDaily.hotSkill}</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-amber-200/60 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-600">
                <span>{latestDaily.author.avatarEmoji}</span>
                <span className="font-medium text-neutral-800">{latestDaily.author.name}</span>
              </div>
              <Link
                href={`/blog/${latestDaily.slug}`}
                className="font-bold text-primary-700 hover:text-primary-800 transition-colors"
              >
                Read Today&apos;s Briefing →
              </Link>
            </div>
          </div>
        )}

        {/* Top AdSense Display Unit */}
        <AdSenseUnit label="Advertisement" className="mb-10" />

        {/* Interactive Filter & Article Grid */}
        <BlogFilterClient articles={articles} />

        {/* Mid-page AdSense banner */}
        <AdSenseUnit label="Advertisement" className="my-12" />

        {/* E-E-A-T Editorial Commitment Banner */}
        <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-base font-bold text-neutral-900">
              Our Editorial Quality Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every guide and daily brief published on DecaJobs is crafted by experienced technologists and hiring experts. We never publish auto-generated, thin regurgitations. All salary figures and market statistics are cross-referenced with verified compensation disclosures and recruiter feedback.
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
