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
          "/*?q=*",
          "/jobs?*",
          "/admin",
          "/dashboard",
          "/profile",
          "/settings",
          "/resume-tools",
          "/subscribe",
          "/applications",
          "/referral",
          "/ai-tools",
          "/career-path",
          "/cold-email",
          "/employer/dashboard",
          "/employer/post",
          "/employer/jobs",
          "/auth/callback",
          "/_next/static/media/",
        ],
      },
    ],
    sitemap: "https://decajob.com/sitemap.xml",
  };
}
