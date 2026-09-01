import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SUPPORTED_LOCALES,
  LOCALES,
  isValidLocale,
  type SupportedLocale,
} from "@/lib/i18n/config";
import { getTranslations, getHreflangAlternates } from "@/lib/i18n/utils";
import { DailyAlertForm } from "@/components/daily-alert-form";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== "en").map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) {
    return {};
  }

  const t = getTranslations(lang);
  const info = LOCALES[lang as SupportedLocale];
  const url = `https://decajob.com/${lang}`;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords.split(",").map((k) => k.trim()),
    alternates: {
      canonical: url,
      languages: getHreflangAlternates(`/${lang}`),
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url,
      siteName: "DecaJobs",
      type: "website",
      locale: info.hreflang,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang) || lang === "en") {
    notFound();
  }

  const locale = lang as SupportedLocale;
  const t = getTranslations(locale);
  const info = LOCALES[locale];

  return (
    <div className="flex flex-1 flex-col -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero Section — high aesthetic gradient with international trust badge */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4 py-16 sm:py-24 lg:py-32">
        {/* Background decorative elements */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-700/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Country / Global Trust Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-800/50 px-4 py-1.5 text-xs sm:text-sm text-primary-200 backdrop-blur-sm">
            <span aria-hidden="true">{info.flag}</span>
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.hero.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>{" "}
            {t.hero.titleLine2}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-primary-100/85 sm:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="mt-8">
            <DailyAlertForm />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-primary-200">
            <Link
              href="/jobs"
              className="hover:text-white underline underline-offset-4 font-medium transition-colors"
            >
              {t.hero.ctaSecondary} →
            </Link>
            <span>•</span>
            <Link
              href="/tools"
              className="hover:text-white underline underline-offset-4 font-medium transition-colors"
            >
              {t.nav.tools} →
            </Link>
            <span>•</span>
            <span className="text-primary-300">{t.hero.guarantee}</span>
          </div>
        </div>
      </section>

      {/* Global Audience Banner — Core Promise of 10 curated jobs from ANYWHERE in the world */}
      <section className="border-y border-neutral-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/70 via-white to-blue-50/50 p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  🌍 {t.globalBanner.badge}
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                  {t.globalBanner.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-neutral-600">
                  {t.globalBanner.description}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 text-center shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-primary-600">
                    {t.globalBanner.stat1Value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-neutral-500">
                    {t.globalBanner.stat1Label}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 text-center shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-600">
                    {t.globalBanner.stat2Value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-neutral-500">
                    {t.globalBanner.stat2Label}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 text-center shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                    {t.globalBanner.stat3Value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-neutral-500">
                    {t.globalBanner.stat3Label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Daily 10 Engine Showcase */}
      <section className="bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              {t.daily10.eyebrow}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              {t.daily10.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-neutral-600">
              {t.daily10.subtitle}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-xs border border-neutral-200">
                ✓ {t.daily10.badge1}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-xs border border-neutral-200">
                ✓ {t.daily10.badge2}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-xs border border-neutral-200">
                ✓ {t.daily10.badge3}
              </span>
            </div>
          </div>

          {/* Interactive Digest Mockup */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
            <div className="border-b border-neutral-200 bg-neutral-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-400">
                  DecaJobs Daily 10 Digest • 8:00 AM
                </span>
              </div>
              <span className="rounded-md bg-primary-600/30 px-2 py-0.5 text-[11px] font-semibold text-primary-300">
                {info.nativeName} ({info.code.toUpperCase()})
              </span>
            </div>

            <div className="divide-y divide-neutral-100 p-4 sm:p-6">
              {[
                {
                  title: "Senior Full Stack Engineer (TypeScript / Next.js)",
                  company: "Stripe",
                  location: "Remote (Worldwide)",
                  salary: "$140,000 - $185,000 / yr",
                  match: "98%",
                  tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
                },
                {
                  title: "AI Solutions Architect & Cloud Systems",
                  company: "Datadog",
                  location: `${info.country} / Remote`,
                  salary: "Competitive Local Benchmark",
                  match: "96%",
                  tags: ["Python", "AWS", "LLMs", "Microservices"],
                },
                {
                  title: "Lead Product Designer (Design Systems)",
                  company: "Figma",
                  location: "Global Remote",
                  salary: "$130,000 - $170,000 / yr",
                  match: "94%",
                  tags: ["Figma", "UI/UX", "Design Systems", "Accessibility"],
                },
              ].map((sample, idx) => (
                <div
                  key={idx}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                        {sample.title}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {sample.match}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {sample.company} • {sample.location} • {sample.salary}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sample.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors shrink-0"
                  >
                    View Role →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              {t.howItWorks.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-600">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-900">
                {t.howItWorks.step1Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-900">
                {t.howItWorks.step2Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-900">
                {t.howItWorks.step3Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-200">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              {t.features.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-600">
              {t.features.subtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="text-2xl">📬</div>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">
                {t.features.f1Title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {t.features.f1Desc}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="text-2xl">🌐</div>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">
                {t.features.f2Title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {t.features.f2Desc}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="text-2xl">📄</div>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">
                {t.features.f3Title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {t.features.f3Desc}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="text-2xl">⚡</div>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">
                {t.features.f4Title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                {t.features.f4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Localized FAQ */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-200">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              {t.faq.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-600">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {[
              { q: t.faq.q1, a: t.faq.a1 },
              { q: t.faq.q2, a: t.faq.a2 },
              { q: t.faq.q3, a: t.faq.a3 },
              { q: t.faq.q4, a: t.faq.a4 },
            ].map((faqItem, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-5"
              >
                <h3 className="text-base font-bold text-neutral-900">
                  {faqItem.q}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {faqItem.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 py-16 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {t.ctaSection.title}
          </h2>
          <p className="mt-3 text-primary-200 text-base sm:text-lg">
            {t.ctaSection.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary-950 hover:bg-primary-50 transition-colors shadow-md"
            >
              {t.ctaSection.button} →
            </Link>
            <Link
              href="/jobs"
              className="w-full sm:w-auto rounded-lg border border-primary-300/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-4 text-xs text-primary-300">
            {t.ctaSection.noCreditCard}
          </p>
        </div>
      </section>
    </div>
  );
}
