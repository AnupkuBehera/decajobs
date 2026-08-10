import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don't run ESLint during production builds (we run it separately)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail build on type errors (we validate locally)
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/resume-builder",
        destination: "/resume-tools",
        permanent: true,
      },
      {
        source: "/tools/resume-builder",
        destination: "/resume-tools",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/ads.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
