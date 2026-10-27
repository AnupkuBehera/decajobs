/**
 * Diagnostic tool to check Supabase connectivity and trigger an immediate keep-alive ping.
 *
 * Usage:
 *   node scripts/ping-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tpnmxxwplvsbdypxhuys.supabase.co";
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Read .env.local if present
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [k, ...v] = trimmed.split("=");
    const val = v.join("=").trim().replace(/^["']|["']$/g, "");
    if (k === "NEXT_PUBLIC_SUPABASE_URL" && val) supabaseUrl = val;
    if (k === "SUPABASE_SERVICE_ROLE_KEY" && val) supabaseKey = val;
    if (!supabaseKey && k === "NEXT_PUBLIC_SUPABASE_ANON_KEY" && val) {
      supabaseKey = val;
    }
  }
}

console.log("======================================================");
console.log("   DecaJobs — Supabase Keep-Alive & Status Check      ");
console.log("======================================================");
console.log(`Target URL: ${supabaseUrl}`);

if (!supabaseKey) {
  console.log("\nNote: No API key found in environment or .env.local.");
  console.log("Checking base HTTP / DNS reachability...\n");
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, { method: "HEAD" });
    console.log(`[HTTP Response] Status: ${res.status}`);
  } catch (err) {
    console.error(`[Connection Warning] Could not reach ${supabaseUrl}:`, err.message);
    if (err.message.includes("ENOTFOUND") || err.message.includes("fetch failed")) {
      console.log("\n⚠️  The Supabase project domain does not resolve.");
      console.log("This indicates the project is currently PAUSED by Supabase.");
      console.log("Please unpause it in the Supabase Dashboard:");
      console.log("👉 https://supabase.com/dashboard/project/tpnmxxwplvsbdypxhuys\n");
    }
  }
  process.exit(0);
}

console.log(`Key type:   ${supabaseKey.startsWith("eyJ") ? "JWT Token (Present)" : "API Key (Present)"}`);
console.log("Connecting to Supabase...\n");

try {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const startTime = Date.now();
  const { data, error } = await supabase
    .from("job_listings")
    .select("id")
    .limit(1);

  const latencyMs = Date.now() - startTime;

  if (error) {
    console.error(`[Supabase Query Error] (${latencyMs}ms):`, error.message);
    console.log("\nTrying fallback query on 'candidates' table...");
    const fallback = await supabase.from("candidates").select("id").limit(1);
    if (fallback.error) {
      console.error("[Fallback Error]:", fallback.error.message);
    } else {
      console.log(`[SUCCESS] Queried 'candidates' table in ${Date.now() - startTime}ms.`);
      console.log("✅ Supabase activity registered! The 7-day inactivity pause timer has been reset.");
    }
  } else {
    console.log(`[SUCCESS] Database response received in ${latencyMs}ms.`);
    console.log(`Retrieved: ${Array.isArray(data) ? data.length : 0} row(s).`);
    console.log("✅ Supabase activity registered! The 7-day inactivity pause timer has been reset.");
  }
} catch (err) {
  console.error("[ERROR] Connection failed:", err.message);
  if (err.message.includes("ENOTFOUND") || err.message.includes("fetch failed")) {
    console.log("\n⚠️  The project domain could not be resolved (NXDOMAIN).");
    console.log("Your project has likely been paused by Supabase.");
    console.log("To resume it, log in to the dashboard and click 'Resume Project':");
    console.log("👉 https://supabase.com/dashboard/project/tpnmxxwplvsbdypxhuys\n");
  }
}
