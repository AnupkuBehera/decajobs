import type { MetadataRoute } from "next";
import {
  getPublicJobs,
  jobSlug,
  type ExternalJob,
  CITIES,
  JOB_CATEGORIES,
  COMPANIES,
} from "@/lib/public-jobs";
import { BLOG_ARTICLES } from "@/lib/blog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://decajob.com";
  let jobs: ExternalJob[] = [];
  try {
    jobs = await getPublicJobs();
  } catch (error) {
    console.error("[Sitemap] Failed to fetch public jobs for sitemap:", error);
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-08-12"),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          "en-IN": baseUrl,
          "en-GB": `${baseUrl}/uk`,
          "en-AE": `${baseUrl}/ae`,
          hi: `${baseUrl}/hi`,
          "hi-IN": `${baseUrl}/hi`,
          es: `${baseUrl}/es`,
          ja: `${baseUrl}/ja`,
          fr: `${baseUrl}/fr`,
          de: `${baseUrl}/de`,
          pt: `${baseUrl}/pt`,
          ko: `${baseUrl}/ko`,
          it: `${baseUrl}/it`,
        },
      },
    },
    // Country Expansion Hubs
    { url: `${baseUrl}/ae`, lastModified: new Date(), changeFrequency: "daily", priority: 0.96 },
    { url: `${baseUrl}/uk`, lastModified: new Date(), changeFrequency: "daily", priority: 0.96 },
    // Localized Landing Pages for International Indexing
    { url: `${baseUrl}/hi`, lastModified: new Date(), changeFrequency: "daily", priority: 0.98 },
    { url: `${baseUrl}/es`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/ja`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/fr`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/de`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/pt`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/ko`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/it`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.95 },

    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/request-removal`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/accessibility`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    // Resume Templates & Tools
    { url: `${baseUrl}/tools`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/resume-templates`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/resume-templates/software-engineer`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/resume-templates/data-analyst`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/resume-templates/product-manager`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/resume-templates/devops-cloud-engineer`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/resume-templates/ui-ux-designer`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/resume-templates/fresher-developer`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/ai-recruiter`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/resume-matcher`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/resume-checker`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/salary-calculator`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/interview-questions`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/cover-letter-generator`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/job-scam-detector`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/in-hand-salary-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/tools/dubai-salary-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/tools/uk-salary-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/tools/notice-period-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/tools/ats-keyword-scanner`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/tools/linkedin-headline`, lastModified: new Date("2026-08-28"), changeFrequency: "weekly", priority: 0.8 },
    // Jobs
    { url: `${baseUrl}/jobs`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/jobs/remote`, lastModified: new Date("2026-08-28"), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/jobs/fresher`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/jobs/country/ae`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    // Fresher Job Hubs by City
    ...CITIES.map((city) => ({
      url: `${baseUrl}/jobs/fresher/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
    // Category Job Hubs
    ...JOB_CATEGORIES.map((cat) => ({
      url: `${baseUrl}/jobs/category/${cat.slug}`,
      lastModified: new Date("2026-08-28"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Location Job Hubs (India & Global Tech Capitals)
    ...CITIES.map((city) => ({
      url: `${baseUrl}/jobs/location/${city.slug}`,
      lastModified: new Date("2026-08-28"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Company Career Hubs
    ...COMPANIES.map((company) => ({
      url: `${baseUrl}/jobs/company/${company.slug}`,
      lastModified: new Date("2026-08-28"),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // Blog Hub & Core
    { url: `${baseUrl}/blog`, lastModified: new Date("2026-08-12"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/editorial-policy`, lastModified: new Date("2026-08-12"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/author/anup-behera`, lastModified: new Date("2026-09-03"), changeFrequency: "monthly", priority: 0.7 },
    // All 24 in-depth career guides dynamically included
    ...Object.values(BLOG_ARTICLES).map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.dateISO),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${jobSlug(job)}`,
    lastModified: job.postedAt ? new Date(job.postedAt) : new Date("2026-08-12"),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticEntries, ...jobEntries];
}
