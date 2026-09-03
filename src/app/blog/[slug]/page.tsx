import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdSenseUnit } from "@/components/adsense-unit";
import { BLOG_ARTICLES } from "@/lib/blog-data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(BLOG_ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES[slug];
  if (!article) return { title: "Article Not Found | DecaJobs" };

  return {
    title: `${article.title} | DecaJobs Career Guide`,
    description: article.excerpt,
    alternates: {
      canonical: `https://decajob.com/blog/${slug}`,
    },
    authors: [{ name: article.author.name, url: `https://decajob.com/blog/author/${article.author.slug}` }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://decajob.com/blog/${slug}`,
      publishedTime: article.dateISO,
      modifiedTime: article.dateISO,
      authors: [article.author.name],
      section: article.category,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = BLOG_ARTICLES[slug];

  if (!article) notFound();

  const wordCount = article.content.split(/\s+/).length;
  const paragraphs = article.content.split("\n\n");

  // Schema for Article and FAQPage
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.dateISO,
    dateModified: article.dateISO,
    wordCount: wordCount,
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://decajob.com/blog/${slug}`,
    },
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `https://decajob.com/blog/author/${article.author.slug}`,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "DecaJobs",
      url: "https://decajob.com",
      logo: {
        "@type": "ImageObject",
        url: "https://decajob.com/web-app-manifest-512x512.png",
      },
    },
    articleSection: article.category,
  };

  const faqSchema = article.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      }
    : null;

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Career Blog", href: "/blog" },
            { label: article.category, href: "/blog" },
            { label: article.title },
          ]}
        />

        <article className="mt-6" itemScope itemType="https://schema.org/Article">
          <header>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
                {article.category}
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Verified &amp; Fact-Checked
              </span>
            </div>

            <h1
              className="text-2xl font-black text-neutral-900 sm:text-3xl lg:text-4xl leading-tight"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Author & E-E-A-T metadata banner */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-3.5 text-sm text-neutral-600">
              <Link
                href={`/blog/author/${article.author.slug}`}
                className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl border border-primary-200">
                  {article.author.avatarEmoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-neutral-500">{article.author.role}</p>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <time dateTime={article.dateISO}>{article.date}</time>
                <span>·</span>
                <span>{article.readingTime}</span>
                <span>·</span>
                <span className="font-medium text-neutral-700">{wordCount.toLocaleString()} words</span>
              </div>
            </div>
          </header>

          {/* In-article Lead Excerpt Box */}
          <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-200 p-5 text-sm sm:text-base text-neutral-700 italic border-l-4 border-l-primary-600">
            {article.excerpt}
          </div>

          {/* Article Body with Responsive Typography */}
          <div className="mt-8 text-neutral-800 space-y-6 text-base leading-relaxed" itemProp="articleBody">
            {paragraphs.map((paragraph, i) => {
              // Inject AdSense unit after paragraph 3 (ideal reading flow)
              const showAdHere = i === 3;

              if (paragraph.startsWith("**") && paragraph.includes("\n")) {
                const lines = paragraph.split("\n");
                const heading = (lines[0] || "").replace(/\*\*/g, "");
                const rest = lines.slice(1).join("\n");
                return (
                  <div key={i} className="pt-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-6 mb-3">
                      {heading}
                    </h2>
                    {rest && <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{rest}</p>}
                    {showAdHere && <AdSenseUnit label="Sponsored Guide Resource" />}
                  </div>
                );
              }

              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <div key={i}>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-3">
                      {paragraph.replace(/\*\*/g, "")}
                    </h2>
                    {showAdHere && <AdSenseUnit label="Sponsored Guide Resource" />}
                  </div>
                );
              }

              if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
                const items = paragraph.split("\n");
                return (
                  <div key={i}>
                    <ul className="list-disc pl-6 space-y-2 text-neutral-700 my-4">
                      {items.map((item, j) => (
                        <li key={j} className="leading-relaxed">
                          {item.replace(/^[-\d.]\s*/, "")}
                        </li>
                      ))}
                    </ul>
                    {showAdHere && <AdSenseUnit label="Sponsored Guide Resource" />}
                  </div>
                );
              }

              return (
                <div key={i}>
                  <p className="leading-relaxed whitespace-pre-line text-neutral-700">
                    {paragraph}
                  </p>
                  {showAdHere && <AdSenseUnit label="Sponsored Guide Resource" />}
                </div>
              );
            })}
          </div>

          {/* Secondary AdSense Unit before FAQs */}
          <AdSenseUnit label="Recommended Career Links" className="my-10" />

          {/* FAQs Section */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <span>❓</span> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
                    <h3 className="text-base font-bold text-neutral-900 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* E-E-A-T Author Card */}
          <section className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-3xl shadow-xs">
                {article.author.avatarEmoji}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-neutral-900">
                    Written by {article.author.name}
                  </h3>
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                    Author &amp; Founder
                  </span>
                </div>
                <p className="text-xs font-medium text-primary-600">
                  {article.author.role}
                </p>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Specialist in algorithmic matching, engineering career navigation, and Applicant Tracking Systems. DecaJobs publishes vetted career blueprints grounded in real-world hiring telemetry.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/blog/author/${article.author.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 underline"
                  >
                    View Full Author Profile &amp; Published Guides →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Conversion CTA */}
          <div className="mt-8 rounded-3xl bg-primary-600 p-8 text-center text-white shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold">
              Stop Scrolling Through 10,000 Unvetted Jobs
            </h3>
            <p className="mt-2 text-sm sm:text-base text-primary-100 max-w-xl mx-auto">
              DecaJobs algorithmically matches your skills with top verified openings and delivers exactly 10 genuine roles to your inbox every morning.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary-700 hover:bg-neutral-100 transition-colors shadow-md min-h-[44px]"
            >
              Get 10 Matched Jobs Daily — Free →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
