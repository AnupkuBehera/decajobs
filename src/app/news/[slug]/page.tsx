import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSenseUnit } from "@/components/adsense-unit";
import { getAllNews, getNewsBySlug } from "@/lib/news/daily-news";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllNews().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return { title: "Article Not Found | DecaJobs News" };

  return {
    title: `${article.title} | DecaJobs Tech & Hiring News`,
    description: article.summary,
    alternates: {
      canonical: `https://decajob.com/news/${slug}`,
    },
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      url: `https://decajob.com/news/${slug}`,
      publishedTime: article.dateISO,
      modifiedTime: article.dateISO,
      authors: [article.author.name],
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
  };
}

function renderFormattedNews(content: string) {
  const paragraphs = content.split("\n\n");

  return paragraphs.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="mt-8 mb-3 text-lg font-bold text-neutral-900">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="mt-10 mb-4 text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-2">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((line) => line.trim().startsWith("- "));
      return (
        <ul key={idx} className="my-4 space-y-2 text-sm sm:text-base text-neutral-700 list-disc pl-5">
          {items.map((item, itemIdx) => {
            const clean = item.replace(/^-\s+/, "");
            return <li key={itemIdx} className="leading-relaxed">{clean}</li>;
          })}
        </ul>
      );
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split("\n").filter((line) => /^\d+\.\s+/.test(line.trim()));
      return (
        <ol key={idx} className="my-4 space-y-2 text-sm sm:text-base text-neutral-700 list-decimal pl-5">
          {items.map((item, itemIdx) => {
            const clean = item.replace(/^\d+\.\s+/, "");
            return <li key={itemIdx} className="leading-relaxed">{clean}</li>;
          })}
        </ol>
      );
    }

    return (
      <p key={idx} className="my-4 text-sm sm:text-base text-neutral-700 leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) notFound();

  const allNews = getAllNews();
  const relatedNews = allNews
    .filter((n) => n.slug !== article.slug && (n.category === article.category || !article.category))
    .slice(0, 3);

  // Schema.org NewsArticle Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.dateISO,
    dateModified: article.dateISO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://decajob.com/news/${slug}`,
    },
    author: [
      {
        "@type": "Person",
        name: article.author.name,
        jobTitle: article.author.role,
      },
    ],
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "DecaJobs Newsroom",
      url: "https://decajob.com",
      logo: {
        "@type": "ImageObject",
        url: "https://decajob.com/icon.png",
      },
    },
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };

  const shareUrl = encodeURIComponent(`https://decajob.com/news/${slug}`);
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Tech & Hiring News", href: "/news" },
            { label: article.category, href: "/news" },
            { label: article.title },
          ]}
        />

        {/* Structured Data Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Article Header */}
        <header className="mb-8 mt-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              {article.category}
            </span>
            <span className="text-xs text-neutral-400">· {article.readTime}</span>
            <span className="text-xs text-neutral-400">· Source: {article.source}</span>
          </div>

          <h1 className="text-2xl font-black text-neutral-900 sm:text-3xl lg:text-4xl leading-tight">
            {article.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            {article.summary}
          </p>

          {/* Author & Publication Byline */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-3.5 text-xs text-neutral-500">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{article.author.avatarEmoji}</span>
              <div>
                <p className="font-semibold text-neutral-800">{article.author.name}</p>
                <p className="text-[11px] text-neutral-500">{article.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <time dateTime={article.dateISO}>{article.publishedAt}</time>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                ✓ Verified Report
              </span>
            </div>
          </div>
        </header>

        {/* Top AdSense Banner */}
        <AdSenseUnit label="Advertisement" className="mb-8" />

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⚡</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary-900">
                Key Intelligence &amp; Takeaways
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-800">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-primary-600 mt-0.5">•</span>
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Formatted Content Body */}
        <article className="prose prose-neutral max-w-none">
          {renderFormattedNews(article.content)}
        </article>

        {/* Contextual Related Jobs Callout */}
        <div className="my-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-neutral-900">
              Looking for {article.relatedJobQuery || article.category} Opportunities?
            </h3>
            <p className="text-xs text-neutral-600">
              Browse verified jobs matching this report with verified trust scores on DecaJobs.
            </p>
          </div>
          <Link
            href={`/jobs?q=${encodeURIComponent(article.relatedJobQuery || "developer")}`}
            className="rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors shrink-0"
          >
            Explore Active Roles →
          </Link>
        </div>

        {/* Social Share Bar */}
        <div className="my-8 rounded-2xl border border-neutral-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-neutral-700">Share this intelligence:</span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              💬 WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              💼 LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-neutral-100 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              🐦 X / Twitter
            </a>
            <a
              href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-sky-50 px-3 py-1.5 font-medium text-sky-700 hover:bg-sky-100 transition-colors"
            >
              ✈️ Telegram
            </a>
          </div>
        </div>

        {/* Bottom AdSense Banner */}
        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <div className="mt-12 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">
              Related Labor Market Intelligence
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedNews.map((n) => (
                <Link
                  key={n.slug}
                  href={`/news/${n.slug}`}
                  className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {n.category}
                    </span>
                    <h3 className="mt-2 text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                      {n.title}
                    </h3>
                  </div>
                  <span className="mt-3 text-[10px] text-neutral-400">
                    {n.publishedAt}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
