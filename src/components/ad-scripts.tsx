"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdSenseUnit } from "@/components/adsense-unit";

/**
 * Renders ad scripts only for non-Pro users.
 * Pro subscribers get an ad-free experience.
 */
export function AdScripts() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const cachedPro = sessionStorage.getItem("decajobs_is_pro");
      if (cachedPro === "true") {
        setIsPro(true);
        return;
      }
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from("candidates")
            .select("subscription_status")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              const pro = data?.subscription_status === "active";
              setIsPro(pro);
              sessionStorage.setItem("decajobs_is_pro", String(pro));
            })
            .catch(() => {});
        }
      });
    } catch {
      // Safe fallback: show ads
    }
  }, []);

  if (isPro) return null;

  return (
    <>
      {/* Google AdSense official script */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7950314044956492"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Renders the banner ad container only for non-Pro users.
 */
export function AdBanner() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const cachedPro = sessionStorage.getItem("decajobs_is_pro");
      if (cachedPro === "true") {
        setIsPro(true);
        return;
      }
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from("candidates")
            .select("subscription_status")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              const pro = data?.subscription_status === "active";
              setIsPro(pro);
              sessionStorage.setItem("decajobs_is_pro", String(pro));
            })
            .catch(() => {});
        }
      });
    } catch {
      // Safe fallback
    }
  }, []);

  if (isPro) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <AdSenseUnit label="Advertisement" className="my-6" />
    </div>
  );
}

