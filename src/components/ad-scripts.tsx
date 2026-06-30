import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

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
      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7950314044956492"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* Monetag Ad Network */}
      <Script
        src="https://pl30138876.effectivecpmnetwork.com/eb/65/4d/eb654d3ef5fd7f8105bb7277a3dee19a.js"
        strategy="afterInteractive"
      />
      {/* Monetag Banner Ad */}
      <Script
        src="https://pl30138877.effectivecpmnetwork.com/71208afc22515d4d1e47d44012c8ffdd/invoke.js"
        data-cfasync="false"
        strategy="afterInteractive"
      />
      {/* Monetag Ad 3 */}
      <Script
        src="https://pl30138878.effectivecpmnetwork.com/07/cd/ec/07cdec4bfc87d5dd96a641e55d3a7320.js"
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

  return <div id="container-71208afc22515d4d1e47d44012c8ffdd" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />;
}
