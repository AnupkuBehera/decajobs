import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://decajob.com";

  return [
    { url: baseUrl, lastModified: new Date("2026-07-15"), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-07-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date("2026-06-10"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date("2026-07-15"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: new Date("2026-06-10"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-06-10"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date("2026-06-10"), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date("2026-06-10"), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date("2026-07-15"), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/accessibility`, lastModified: new Date("2026-07-15"), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/login`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/employer/register`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.6 },
    // Tools
    { url: `${baseUrl}/tools`, lastModified: new Date("2026-06-15"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/resume-checker`, lastModified: new Date("2026-06-15"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/salary-calculator`, lastModified: new Date("2026-06-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/interview-questions`, lastModified: new Date("2026-06-15"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/cover-letter-generator`, lastModified: new Date("2026-06-15"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/job-scam-detector`, lastModified: new Date("2026-06-15"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/linkedin-headline`, lastModified: new Date("2026-06-15"), changeFrequency: "weekly", priority: 0.8 },
    // Blog
    { url: `${baseUrl}/blog`, lastModified: new Date("2026-06-12"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/top-10-resume-mistakes`, lastModified: new Date("2026-06-12"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/how-to-crack-any-interview`, lastModified: new Date("2026-06-10"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/remote-jobs-guide-india`, lastModified: new Date("2026-06-08"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/salary-negotiation-tips`, lastModified: new Date("2026-06-05"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/freshers-job-search-guide`, lastModified: new Date("2026-06-03"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/linkedin-profile-optimization`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/ats-resume-secrets`, lastModified: new Date("2026-05-28"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/artificial-intelligence-careers`, lastModified: new Date("2026-05-25"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/remote-job-interview-prep`, lastModified: new Date("2026-05-22"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/career-gaps-explanation`, lastModified: new Date("2026-05-20"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/linkedin-networking-guide`, lastModified: new Date("2026-05-18"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog/negotiating-first-salary`, lastModified: new Date("2026-05-15"), changeFrequency: "monthly", priority: 0.7 },
  ];
}
