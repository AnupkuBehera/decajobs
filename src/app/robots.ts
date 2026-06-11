import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/profile", "/settings", "/employer/dashboard", "/employer/post", "/employer/jobs"],
      },
    ],
    sitemap: "https://decajobs.com/sitemap.xml",
  };
}
