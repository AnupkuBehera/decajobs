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
          "/auth/callback",
          "/_next/static/media/",
        ],
      },
    ],
    sitemap: "https://decajob.com/sitemap.xml",
  };
}
