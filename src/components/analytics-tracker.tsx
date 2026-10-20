"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtag from "@/lib/gtag";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip tracking for admin and api routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    try {
      // Send GA4 pageview on route change (handled by Google Analytics CDN, zero Vercel compute)
      gtag.pageview(pathname);
    } catch (err) {
      console.warn("[Analytics] Tracking error:", err);
    }
  }, [pathname]);

  return null;
}
