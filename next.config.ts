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
};

export default nextConfig;
