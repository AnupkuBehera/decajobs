import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "Google-adstxt",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/callback",
          "/_next/static/media/",
          "/*opengraph-image*",
        ],
      },
    ],
    sitemap: "https://decajob.com/sitemap.xml",
  };
}
