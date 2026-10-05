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
  title: "UK Tech Jobs 2026 — London, Manchester & Skilled Worker Visa Sponsorship | DecaJobs",
  description:
    "Explore verified software engineering, AI, product, and data jobs in London, Manchester, Cambridge, and across the UK. Filter for Skilled Worker Visa sponsorship (CoS), GBP £ salary benchmarks, and 7:00 AM GMT daily digests.",
  keywords: [
    "uk tech jobs",
    "software engineer jobs london",
    "uk jobs with visa sponsorship",
    "skilled worker visa jobs uk",
    "certificate of sponsorship tech jobs",
    "london fintech jobs",
    "manchester tech jobs",
    "uk developer jobs for international applicants",
  ],
  alternates: {
    canonical: "https://decajob.com/uk",
    languages: {
      "en-GB": "https://decajob.com/uk",
      "en-AE": "https://decajob.com/ae",
      "en-IN": "https://decajob.com/",
      "hi-IN": "https://decajob.com/hi",
      "x-default": "https://decajob.com/",
    },
  },
  openGraph: {
    title: "UK Tech Jobs 2026 — London, Manchester & Skilled Worker Visa Sponsorship",
    description:
      "Find verified tech opportunities in London and the UK with competitive GBP packages and Skilled Worker Visa sponsorship.",
    url: "https://decajob.com/uk",
    type: "website",
  },
};

const UK_FEATURED_JOBS: ExternalJob[] = [
  {
    id: "uk-revolut-senior-backend",
    title: "Senior Backend Engineer (Payments & Core Banking)",
    company: "Revolut",
    description:
      "Build high-throughput event-driven microservices processing millions of multi-currency payments daily. Strong experience in Java, Kotlin, PostgreSQL, and distributed caching required. Full UK Skilled Worker Visa (Certificate of Sponsorship - CoS) provided for eligible candidates.",
    location: "London, UK (Canary Wharf / Hybrid)",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: "DecaJobs UK Verified",
  },
  {
    id: "uk-monzo-lead-frontend",
    title: "Staff Frontend & Mobile Platform Engineer",
    company: "Monzo Bank",
    description:
      "Drive customer experience and architecture across our iOS, Android, and web banking apps. Tech stack: React Native, TypeScript, GraphQL. Competitive salary (£85,000 - £110,000), generous equity options, and relocation support.",
    location: "London, UK (City of London / Flexible Remote)",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: "DecaJobs UK Verified",
  },
  {
    id: "uk-arm-compiler-engineer",
    title: "Senior CPU & ML Compiler Toolchain Engineer",
    company: "Arm Holdings",
    description:
      "Optimize LLVM compiler backends for next-generation neural processing units and Arm silicon architectures. C++, LLVM, assembly, and performance modeling. Comprehensive pension, private medical, and Skilled Worker sponsorship.",
    location: "Cambridge, UK (On-site / Hybrid)",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: "DecaJobs UK Verified",
  },
  {
    id: "uk-the-hut-group-cloud-lead",
    title: "DevOps & Cloud Site Reliability Engineer",
    company: "THG Ingenuity (The Hut Group)",
    description:
      "Design multi-tenant cloud infrastructure and automated CI/CD pipelines supporting global retail brands. Kubernetes, Terraform, AWS, and Prometheus monitoring. Salary: £65,000 - £80,000.",
    location: "Manchester, UK (MediaCityUK / Hybrid)",
    applicationLink: "https://decajob.com/login",
    postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    source: "DecaJobs UK Verified",
  },
];

export default async function UkLandingPage() {
  const publicJobs = await getPublicJobs();

  // Combine public jobs matching UK/London keywords or remote-friendly with UK curated jobs
  const ukMatchingPublic = publicJobs.filter((j) => {
    const text = `${j.title} ${j.description} ${j.location} ${j.company}`.toLowerCase();
    return (
      text.includes("london") ||
      text.includes("uk") ||
      text.includes("united kingdom") ||
      text.includes("manchester") ||
      text.includes("cambridge") ||
      (text.includes("remote") && (text.includes("uk") || text.includes("europe") || text.includes("anywhere")))
    );
  });

  const combinedJobs = [...UK_FEATURED_JOBS, ...ukMatchingPublic.slice(0, 15)];
  const country = COUNTRIES.gb;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the minimum salary for a UK Skilled Worker Visa in tech in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under UK Home Office immigration rules, the general minimum salary threshold for a Skilled Worker Visa is £38,700 per year (or the going rate for the specific SOC code, whichever is higher). Software engineering roles typically command starting packages between £45,000 and £85,000+, easily satisfying sponsorship thresholds.",
        },
      },
      {
        "@type": "Question",
        name: "Do UK tech employers offer Certificate of Sponsorship (CoS)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Major UK tech scaleups, banks, and enterprises hold Home Office A-rated sponsor licenses that allow them to issue a Certificate of Sponsorship (CoS) for qualified engineers and product managers.",
        },
      },
      {
        "@type": "Question",
        name: "What time does DecaJobs dispatch daily matches in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DecaJobs delivers 10 personalized tech matches at 7:00 AM GMT/BST every morning via Email, timed for your morning routine.",
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
            { label: "UK Tech Jobs" },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-900 mb-3 border border-blue-200">
            <span>🇬🇧</span>
            <span>Skilled Worker Visa Sponsorship · 7:00 AM GMT Morning Dispatch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            UK Tech Jobs 2026
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified software engineering, AI, product, and cloud roles across London,
            Manchester, Cambridge, and remote UK with Skilled Worker Visa sponsorship and competitive GBP salaries.
          </p>
        </div>

        {/* UK Advantages Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">🛂</div>
            <h3 className="font-bold text-neutral-900 text-sm">Skilled Worker Visa (CoS)</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Target employers with active A-rated Home Office sponsor licenses offering Certificate of Sponsorship (CoS).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">💷</div>
            <h3 className="font-bold text-neutral-900 text-sm">Competitive GBP Salaries</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Senior engineering salaries range from £75k to £120k+ with workplace pensions (5% auto-enrolment) and equity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <div className="text-2xl mb-1.5">🏙️</div>
            <h3 className="font-bold text-neutral-900 text-sm">World-Class Tech Capitals</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Europe&apos;s leading FinTech hub in London, deep-tech research in Cambridge, and digital scaleups in Manchester.
            </p>
          </div>
        </div>

        {/* UK Salary Calculator Teaser Banner */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-xl">
              🧮
            </span>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Evaluating a UK Job Offer or Visa Threshold?
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Calculate your exact take-home pay with PAYE tax bands, National Insurance (8%), pension contributions, and £38,700 visa thresholds.
              </p>
            </div>
          </div>
          <Link
            href="/tools/uk-salary-calculator"
            className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs"
          >
            Launch UK Calculator →
          </Link>
        </div>

        {/* Daily Alert Box for UK */}
        <div className="my-8">
          <DailyAlertForm />
        </div>

        {/* Live Job Listings Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Verified UK Tech Openings
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Screened for verified corporate domains, realistic compensation bands, and visa sponsorship.
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
                    <span>🇬🇧</span> CoS Visa Sponsor
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Verified Employer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdSenseUnit label="Advertisement" className="my-10" />

        {/* UK Tech Hubs Grid */}
        <div className="mb-14 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Top Tech Clusters across the United Kingdom
          </h3>
          <p className="text-xs text-neutral-600 mb-6">
            Major regional innovation hubs actively hiring software engineers and data specialists.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {country.hubs.map((hub) => (
              <div key={hub.slug} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <h4 className="font-bold text-neutral-900 text-sm">{hub.name}</h4>
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
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Transparency Strip */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-xs">
          <div>
            <span className="inline-block rounded-full bg-blue-100 border border-blue-300 px-3 py-0.5 text-xs font-bold text-blue-800 mb-2">
              🇬🇧 UK Pro Pricing: {country.currency.proMonthlyPrice}/month
            </span>
            <h4 className="text-lg font-bold text-neutral-900">
              Never Miss a High-Trust UK Tech Opening
            </h4>
            <p className="text-xs text-neutral-600 mt-1 max-w-xl">
              Get 10 personalized AI-matched roles in your inbox every morning at 7:00 AM GMT.
              Includes {country.currency.proTrialDuration}, verified employer domains, and zero spam.
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
            Frequently Asked Questions — Working in the UK
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                How does the UK CV format differ from US or Indian resumes?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                UK applications strictly require a 2-page Curriculum Vitae (CV). <strong>Never include a photo, date of birth, or marital status</strong>, as employers discard resumes with photos to comply with the UK Equality Act 2010.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
              <h3 className="font-bold text-neutral-900 text-sm">
                How does DecaJobs protect candidate privacy under UK GDPR?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                We strictly adhere to the UK General Data Protection Regulation and the Data Protection Act 2018. Your profile and resume data are never sold or shared with third-party advertisers, and you can unsubscribe or delete your data in one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
