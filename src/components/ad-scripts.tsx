import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { AdSenseUnit } from "@/components/adsense-unit";

/**
 * Renders ad scripts only for non-Pro users.
 * Pro subscribers get an ad-free experience.
 */
export async function AdScripts() {
  let isPro = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: candidate } = await serviceClient
        .from("candidates")
        .select("subscription_status")
        .eq("id", data.user.id)
        .maybeSingle();

      isPro = candidate?.subscription_status === "active";
    }
  } catch {
    // If check fails, show ads (safe default)
  }

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
export async function AdBanner() {
  let isPro = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: candidate } = await serviceClient
        .from("candidates")
        .select("subscription_status")
        .eq("id", data.user.id)
        .maybeSingle();

      isPro = candidate?.subscription_status === "active";
    }
  } catch {
    // Show ads by default
  }

  if (isPro) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <AdSenseUnit label="Advertisement" className="my-6" />
    </div>
  );
}
