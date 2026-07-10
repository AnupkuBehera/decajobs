"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip tracking for admin and api routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    try {
      // Get or create session ID in sessionStorage
      let sessionId = sessionStorage.getItem("decajobs_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("decajobs_session_id", sessionId);
      }

      // Log the page view
      fetch("/api/analytics/log-visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          path: pathname,
        }),
      }).catch((err) => {
        console.warn("[Analytics] Track call failed:", err);
      });
    } catch (err) {
      console.warn("[Analytics] Tracking error:", err);
    }
  }, [pathname]);

  return null;
}
