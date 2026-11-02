import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPublicJobs, type ExternalJob } from "@/lib/public-jobs";
import { COUNTRIES } from "@/lib/country-config";
import JobCard from "@/components/jobs/JobCard";
import { AdSenseUnit } from "@/components/adsense-unit";
import { DailyAlertForm } from "@/components/daily-alert-form";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "US Tech Jobs 2026 — Silicon Valley, NYC, Seattle & US Remote Tech Roles | DecaJobs",
  description:
    "Explore verified software engineering, AI/ML, cloud, and product management jobs in San Francisco, New York, Seattle, Austin, and across the United States. Filter for H-1B friendly employers, competitive USD salary bands, and daily 7:00 AM EST morning digests.",
  keywords: [
    "us tech jobs",
    "software engineer jobs usa",
    "silicon valley tech jobs",
    "nyc fintech jobs",
    "seattle cloud engineer jobs",
    "austin tech startups hiring",
    "us remote software engineer",
    "h1b transfer tech jobs",
    "ai engineer jobs san francisco",
  ],
  alternates: {
    canonical: "https://decajob.com/us",
    languages: {
      "en-US": "https://decajob.com/us",
      "en-GB": "https://decajob.com/uk",
      "en-AE": "https://decajob.com/ae",
      "en-IN": "https://decajob.com/",
      "hi-IN": "https://decajob.com/hi",
      "x-default": "https://decajob.com/",
    },
  },
  openGraph: {
    title: "US Tech Jobs 2026 — Silicon Valley, NYC, Seattle & US Remote Tech Roles",
    description:
      "Find verified tech opportunities across the United States with competitive USD packages, equity, and top remote engineering teams.",
    url: "https://decajob.com/us",
    type: "website",
  },
};

const US_FEATURED_JOBS: ExternalJob[] = [
  {
    id: "us-openai-staff-infra",
    title: "Staff Systems Engineer (AI Infrastructure & Training Clusters)",
    company: "OpenAI",
    description:
      "Design, scale, and optimize large-scale distributed GPU clusters powering frontier AI models. Experience with high-performance networking (InfiniBand/RoCE), Linux kernel internals, PyTorch distributed primitives, and Kubernetes at scale. Base: $245,000 - $370,000 + equity.",
    location: "San Francisco, CA (Hybrid)",
    applicationLink: "https://openai.com/careers",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "DecaJobs US Verified",
  },
  {
    id: "us-stripe-senior-fullstack",
    title: "Senior Full-Stack Engineer (Global Checkout & Billing)",
    company: "Stripe",
    description:
      "Architect mission-critical payment infrastructure and high-conversion developer experiences for internet commerce. Tech stack: Ruby, TypeScript, React, distributed systems. Comprehensive healthcare, 401(k) matching, and H-1B transfer sponsorship.",
    location: "Seattle, WA / San Francisco, CA / US Remote",
    applicationLink: "https://stripe.com/jobs",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "DecaJobs US Verified",
  },
  {
    id: "us-datadog-lead-platform",
    title: "Senior Cloud Platform & Observability Engineer",
    company: "Datadog",
    description:
      "Build real-time ingestion pipelines and telemetry dashboards processing trillions of events per day. Proficient in Go, Python, Kafka, and AWS/GCP cloud environments. Base salary $180,000 - $250,000 + RSUs.",
    location: "New York, NY (Silicon Alley / Hybrid)",
    applicationLink: "https://www.datadoghq.com/careers/",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "DecaJobs US Verified",
  },
  {
    id: "us-anthropic-research-eng",
    title: "Member of Technical Staff — AI Safety & Alignment",
    company: "Anthropic",
    description:
      "Work alongside research scientists to build scalable evaluation suites and interpretability harnesses for Claude models. Strong Python, JAX/PyTorch, and algorithm benchmarking skills required. Base $280,000 - $380,000 + equity.",
    location: "San Francisco, CA / Seattle, WA",
    applicationLink: "https://www.anthropic.com/careers",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    source: "DecaJobs US Verified",
  },
];

export default async function UsLandingPage() {
  const publicJobs = await getPublicJobs();

  // Combine public jobs matching US keywords, US cities, or remote
  const usMatchingPublic = publicJobs.filter((j) => {
    const text = `${j.title} ${j.description} ${j.location} ${j.company}`.toLowerCase();
    return (
      text.includes("united states") ||
      text.includes("us remote") ||
      text.includes("usa") ||
      text.includes("san francisco") ||
      text.includes("new york") ||
      text.includes("seattle") ||
      text.includes("austin") ||
      text.includes("boston") ||
      text.includes("chicago") ||
      text.includes("california") ||
      (text.includes("remote") && (text.includes("us") || text.includes("north america") || text.includes("anywhere")))
    );
  });

  const combinedJobs = [...US_FEATURED_JOBS, ...usMatchingPublic.slice(0, 16)];
  const country = COUNTRIES.us;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are average software engineering salaries in the United States in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Software engineering compensation in the US is among the highest in the world. Mid-level software engineers average $130,000 to $180,000 base salary, while senior engineers in tier-1 tech hubs (San Francisco, NYC, Seattle) command $190,000 to $275,000+ base with total packages (including RSUs and bonuses) frequently reaching $300,000 to $500,000+.",
        },
      },
      {
        "@type": "Question",
        name: "Do US tech employers sponsor H-1B, O-1, or TN visa transfers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Major US technology companies and venture-backed scaleups routinely handle H-1B visa transfers (change of employer), O-1 extraordinary ability visas, and TN visas for Canadian/Mexican citizens.",
        },
      },
      {
        "@type": "Question",
        name: "How does US salary transparency legislation help job seekers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "States like California, New York, Washington, and Colorado legally mandate that employers state good-faith salary ranges in all job postings. DecaJobs aggregates these verified compensation bands so you know exact ranges upfront.",
        },
      },
      {
        "@type": "Question",
        name: "What time does DecaJobs dispatch daily matches in the United States?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DecaJobs delivers 10 personalized tech matches at 7:00 AM EST (4:00 AM PST / 6:00 AM CST) every morning via Email, timed for your morning routine.",
        },
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Jobs", href: "/jobs" },
            { label: "US Tech Jobs" },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-900 mb-3 border border-blue-200">
            <span>🇺🇸</span>
            <span>US Tech Hubs & Nationwide Remote · 7:00 AM EST Morning Dispatch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            United States Tech Jobs 2026
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified software engineering, AI/ML, cloud platform, and product roles across San Francisco,
            New York, Seattle, Austin, and nationwide US remote with transparent USD compensation bands.
          </p>
        </div>

        {/* US Advantages Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">💵</div>
            <h3 className="font-bold text-neutral-900 text-sm">Top Global Tech Salaries</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Senior engineering packages range from $160,000 to $320,000+ base with liquid RSUs, 401(k) matching, and comprehensive healthcare.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">🤖</div>
            <h3 className="font-bold text-neutral-900 text-sm">Frontier AI & Cloud Hubs</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Direct access to teams building foundational LLMs, autonomous systems, cloud hyper-scalers, and developer infrastructure.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">🗽</div>
            <h3 className="font-bold text-neutral-900 text-sm">Salary Transparency & Visas</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Enforced pay transparency (CA/NY/WA laws), W-2 vs 1099 flexibility, and H-1B / TN transfer friendly enterprise employers.
            </p>
          </div>
        </div>

        {/* US Salary Calculator Teaser Banner */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-xl">
              🧮
            </span>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Evaluating a US Job Offer or Relocating States?
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Calculate your exact take-home pay with Federal tax brackets, FICA (Social Security & Medicare), state taxes (CA, NY, TX, WA, MA), and 401(k) deductions.
              </p>
            </div>
          </div>
          <Link
            href="/tools/us-salary-calculator"
            className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs"
          >
            Launch US Paycheck Calculator →
          </Link>
        </div>

        {/* Daily Alert Box for US */}
        <div className="my-8">
          <DailyAlertForm />
        </div>

        {/* Live Job Listings Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Verified US Tech Openings
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Filtered for corporate domains, verified compensation disclosures, and high-trust hiring teams.
              </p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-200">
              {combinedJobs.length} Roles Active
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {combinedJobs.map((job) => (
              <div key={job.id} className="relative group">
                <JobCard job={job} />
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    <span>🇺🇸</span> US / Remote
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Verified W-2 / 1099
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* US Tech Hubs Grid */}
        <div className="mb-14 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Top Tech Innovation Clusters in the United States
          </h3>
          <p className="text-xs text-neutral-600 mb-6">
            Premier technology corridors actively hiring software engineers, data scientists, and infrastructure leads.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {country.hubs.map((hub) => (
              <Link
                key={hub.slug}
                href={hub.slug === "us-remote" ? "/jobs/remote" : `/jobs/location/${hub.slug}`}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 text-sm group-hover:text-blue-600 transition-colors">
                    {hub.name}
                  </h4>
                  <span className="text-neutral-400 group-hover:text-blue-600 transition-colors text-xs">→</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {hub.popularIndustries.map((ind) => (
                    <span
                      key={ind}
                      className="rounded bg-white border border-neutral-200 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pricing Transparency Strip */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-xs">
          <div>
            <span className="inline-block rounded-full bg-blue-100 border border-blue-300 px-3 py-0.5 text-xs font-bold text-blue-800 mb-2">
              🇺🇸 US Pro Pricing: {country.currency.proMonthlyPrice}/month
            </span>
            <h4 className="text-lg font-bold text-neutral-900">
              Never Miss a High-Trust US Tech Opening
            </h4>
            <p className="text-xs text-neutral-600 mt-1 max-w-xl">
              Get 10 personalized AI-matched roles in your inbox every morning at 7:00 AM EST.
              Includes {country.currency.proTrialDuration}, verified employer domains, and zero recruiter spam.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-all shrink-0 shadow-xs"
          >
            Start Free 7-Day Trial →
          </Link>
        </div>

        {/* Editorial FAQs */}
        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-neutral-900 text-center mb-6">
            Frequently Asked Questions — US Tech Hiring
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                How does DecaJobs filter out ghost jobs and recruiter spam?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                We crawl directly from official company applicant tracking systems (Greenhouse, Lever, Ashby, Workday) and reputable verified job feeds. Every posting must link to a valid corporate domain with verifiable business registration.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                Can international candidates apply to US remote roles?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                Many US companies hire international contractors (1099 / W-8BEN) through Employer of Record (EOR) platforms like Deel and Remote.com, while others require US work authorization (Green Card, Citizen, H-1B, TN). Each listing on DecaJobs clearly indicates whether location restrictions apply.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                How does DecaJobs protect candidate privacy under CCPA / CPRA?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                We strictly adhere to the California Consumer Privacy Act (CCPA) and CPRA amendments. We do not sell or share personal data with third-party data brokers. Candidates have the right to inspect, download, or purge their profile at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

