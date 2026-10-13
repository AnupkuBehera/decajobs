import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSenseUnit } from "@/components/adsense-unit";
import { getAllNews, getBreakingNews } from "@/lib/news/daily-news";
import { NewsFilterClient } from "./news-filter-client";

export const metadata: Metadata = {
  title: "Tech & Hiring News — Daily Labor Market Telemetry, Layoffs, Visas & Salary Reports | DecaJobs",
  description:
    "Real-time tech hiring news, verified AI engineering salary reports, remote work telemetry, visa updates (UAE, UK, US), and daily labor market intelligence from the DecaJobs Newsroom.",
  alternates: {
    canonical: "https://decajob.com/news",
  },
  openGraph: {
    title: "DecaJobs Tech & Hiring Newsroom",
    description: "Daily labor market intelligence, compensation benchmarks, and tech employment trends.",
    url: "https://decajob.com/news",
    siteName: "DecaJobs",
    type: "website",
  },
};

export default function NewsPage() {
  const allNews = getAllNews();
  const breakingNews = getBreakingNews();

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Tech & Hiring News" }]} />

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1 text-xs font-semibold text-red-700 mb-3 border border-red-200">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Live Labor Market Telemetry &amp; Daily Intelligence
          </div>
          <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl lg:text-5xl">
            Tech &amp; Hiring News
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Data-backed reporting on technology compensation, lateral hiring velocity, return-to-office policies, and international work visas.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500">
            <span>Verified by <strong>DecaJobs Newsroom</strong></span>
            <span>·</span>
            <Link href="/blog/editorial-policy" className="hover:text-primary-600 underline">
              Fact-Checking &amp; Editorial Standards
            </Link>
            <span>·</span>
            <Link href="/news/rss.xml" className="hover:text-primary-600 underline flex items-center gap-1">
              <span>📡</span> RSS Feed
            </Link>
          </div>
        </div>

        {/* Breaking / Featured Lead Story */}
        {breakingNews && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-950 p-6 sm:p-10 text-white shadow-xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                Featured Lead Story
              </span>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-neutral-300">
                {breakingNews.category}
              </span>
              <span className="text-xs text-neutral-400">· {breakingNews.readTime}</span>
            </div>

            <Link href={`/news/${breakingNews.slug}`} className="group">
              <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-primary-300 transition-colors leading-tight">
                {breakingNews.title}
              </h2>
            </Link>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
              {breakingNews.summary}
            </p>

            {/* Key Takeaways snippet */}
            {breakingNews.keyTakeaways && breakingNews.keyTakeaways.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/10 max-w-3xl">
                <p className="text-xs font-semibold text-primary-300 mb-2 uppercase tracking-wider">
                  ⚡ Key Intelligence:
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-200">
                  {breakingNews.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary-400 font-bold">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span>{breakingNews.author.avatarEmoji}</span>
                <span className="text-neutral-200 font-medium">{breakingNews.author.name}</span>
                <span>·</span>
                <span>{breakingNews.publishedAt}</span>
              </div>
              <Link
                href={`/news/${breakingNews.slug}`}
                className="inline-flex items-center gap-1 font-bold text-primary-300 hover:text-white transition-colors"
              >
                Read Full Report →
              </Link>
            </div>
          </div>
        )}

        {/* AdSense Display Unit */}
        <AdSenseUnit label="Advertisement" className="mb-10" />

        {/* Interactive Filter & Articles Grid */}
        <NewsFilterClient articles={allNews} />

        {/* AdSense Banner */}
        <AdSenseUnit label="Advertisement" className="my-12" />

        {/* Daily Alerts CTA */}
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-neutral-900">
              Get Daily Job Market Intelligence in Your Inbox
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
              Every morning at 7:00 AM, DecaJobs delivers 10 perfectly matched jobs alongside verified labor market telemetry. Never miss an emerging hiring trend.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/#daily-alert"
              className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
            >
              Subscribe Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
