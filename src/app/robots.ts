import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/profile",
          "/settings",
          "/my-daily-10",
          "/mock-interview",
          "/job-prep",
          "/referral",
          "/applications",
          "/career-coach",
          "/ai-tools",
          "/subscribe",
          "/resume-tools",
          "/employer/dashboard",
          "/employer/post",
          "/employer/jobs",
        ],
      },
    ],
    sitemap: "https://decajob.com/sitemap.xml",
  };
}
