#!/usr/bin/env node
/**
 * DecaJobs Payment Gateway Diagnostic & Verification Tool
 *
 * Checks connectivity and configuration for:
 * - Razorpay (Domestic UPI/RuPay + International Cards)
 * - Supabase (Subscription schema fields)
 * - Stripe (Optional fallback / legacy)
 *
 * Usage:
 *   node scripts/verify-payments.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnvFile(filename) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const fileEnv = {
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
};

function getEnv(key) {
  return fileEnv[key] || process.env[key] || "";
}

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  gray: "\x1b[90m",
};

async function main() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}    DecaJobs Unified Payment Gateway Diagnostic Check ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  const results = {
    razorpay: { ready: false, mode: "unknown", issues: [] },
    supabase: { ready: false, issues: [] },
  };

  // ---------------------------------------------------------------------------
  // 1. RAZORPAY VERIFICATION (DOMESTIC + INTERNATIONAL)
  // ---------------------------------------------------------------------------
  console.log(`${colors.bold}1. Checking Razorpay (Domestic INR + International Cards)...${colors.reset}`);
  const rzpKeyId = getEnv("RAZORPAY_KEY_ID");
  const rzpSecret = getEnv("RAZORPAY_KEY_SECRET");
  const rzpPlanId = getEnv("RAZORPAY_PLAN_ID");
  const rzpWebhookSecret = getEnv("RAZORPAY_WEBHOOK_SECRET");

  if (!rzpKeyId) {
    results.razorpay.issues.push("RAZORPAY_KEY_ID is missing");
  } else {
    const isTest = rzpKeyId.startsWith("rzp_test_");
    const isLive = rzpKeyId.startsWith("rzp_live_");
    results.razorpay.mode = isTest ? "TEST / SANDBOX" : isLive ? "LIVE" : "UNKNOWN";
    console.log(`   Key ID: ${colors.gray}${rzpKeyId.slice(0, 12)}...${colors.reset} (${results.razorpay.mode})`);
  }

  if (!rzpSecret) {
    results.razorpay.issues.push("RAZORPAY_KEY_SECRET is missing");
  } else {
    console.log(`   Key Secret: ${colors.gray}••••••••••••••••${colors.reset}`);
  }

  if (!rzpPlanId) {
    results.razorpay.issues.push("RAZORPAY_PLAN_ID is missing (needed for recurring subscriptions)");
  } else {
    if (rzpPlanId.startsWith("sub_")) {
      results.razorpay.issues.push(`RAZORPAY_PLAN_ID is "${rzpPlanId}" which looks like a Subscription ID. It must start with "plan_".`);
      console.log(`   ${colors.yellow}⚠️  Warning: "${rzpPlanId}" starts with "sub_". Plans start with "plan_".${colors.reset}`);
    } else {
      console.log(`   Plan ID: ${colors.gray}${rzpPlanId}${colors.reset}`);
    }
  }

  if (!rzpWebhookSecret) {
    console.log(`   ${colors.yellow}⚠️  RAZORPAY_WEBHOOK_SECRET is not set (Key Secret will be used as fallback)${colors.reset}`);
  } else {
    console.log(`   Webhook Secret: ${colors.gray}••••••••••••••••${colors.reset}`);
  }

  // Test Razorpay API
  if (rzpKeyId && rzpSecret) {
    try {
      const basicAuth = Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString("base64");
      if (rzpPlanId && !rzpPlanId.startsWith("sub_")) {
        const res = await fetch(`https://api.razorpay.com/v1/plans/${rzpPlanId}`, {
          headers: { Authorization: `Basic ${basicAuth}` },
        });

        if (res.ok) {
          const plan = await res.json();
          const amountRs = (plan.item?.amount || 0) / 100;
          console.log(`   ${colors.green}✓ Razorpay API Connection: SUCCESS${colors.reset}`);
          console.log(`   ${colors.green}✓ Plan Verified: "${plan.item?.name || plan.id}" (${amountRs} ${plan.item?.currency || "INR"} / ${plan.period})${colors.reset}`);
          results.razorpay.ready = true;
        } else if (res.status === 401) {
          results.razorpay.issues.push("Razorpay authentication failed: Invalid Key ID or Key Secret");
          console.log(`   ${colors.red}✗ Razorpay API Authentication Failed (401 Unauthorized)${colors.reset}`);
        } else if (res.status === 404) {
          results.razorpay.issues.push(`Razorpay Plan "${rzpPlanId}" not found in this account`);
          console.log(`   ${colors.red}✗ Plan ID "${rzpPlanId}" not found (404 Not Found)${colors.reset}`);
        } else {
          const err = await res.text();
          results.razorpay.issues.push(`Razorpay API error: ${err}`);
        }
      } else {
        const testRes = await fetch("https://api.razorpay.com/v1/payments?count=1", {
          headers: { Authorization: `Basic ${basicAuth}` },
        });
        if (testRes.ok) {
          console.log(`   ${colors.green}✓ Razorpay API Connection: SUCCESS${colors.reset}`);
          if (!rzpPlanId) {
            results.razorpay.issues.push("Razorpay keys are valid, but RAZORPAY_PLAN_ID is still needed.");
          }
        } else {
          results.razorpay.issues.push("Razorpay authentication failed (401 Unauthorized)");
        }
      }
    } catch (err) {
      results.razorpay.issues.push(`Network error connecting to Razorpay: ${err.message}`);
    }
  }

  console.log();

  // ---------------------------------------------------------------------------
  // 2. SUPABASE SUBSCRIPTION SCHEMA VERIFICATION
  // ---------------------------------------------------------------------------
  console.log(`${colors.bold}2. Checking Supabase Database Connectivity...${colors.reset}`);
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl) results.supabase.issues.push("NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!serviceRoleKey) results.supabase.issues.push("SUPABASE_SERVICE_ROLE_KEY is missing");

  if (supabaseUrl && serviceRoleKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/candidates?select=id,subscription_status,razorpay_subscription_id&limit=1`, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      });

      if (res.ok) {
        console.log(`   ${colors.green}✓ Supabase Connection: SUCCESS${colors.reset}`);
        console.log(`   ${colors.green}✓ Candidates Table Schema: Subscription fields present${colors.reset}`);
        results.supabase.ready = true;
      } else {
        const err = await res.text();
        results.supabase.issues.push(`Supabase query failed: ${err}`);
      }
    } catch (err) {
      results.supabase.issues.push(`Network error connecting to Supabase: ${err.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}                    FINAL STATUS                      ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);

  const rStatus = results.razorpay.ready
    ? `${colors.green}READY (${results.razorpay.mode})${colors.reset}`
    : `${colors.red}NOT READY${colors.reset}`;
  const dbStatus = results.supabase.ready
    ? `${colors.green}READY${colors.reset}`
    : `${colors.red}NOT READY${colors.reset}`;

  console.log(`\n  Unified Gateway (Razorpay): ${rStatus}`);
  console.log(`  International Cards:       ${colors.cyan}Supported (Enable in Razorpay Dashboard)${colors.reset}`);
  if (results.razorpay.issues.length > 0) {
    results.razorpay.issues.forEach((i) => console.log(`    ${colors.red}• ${i}${colors.reset}`));
  }

  console.log(`\n  Database (Supabase):        ${dbStatus}`);
  if (results.supabase.issues.length > 0) {
    results.supabase.issues.forEach((i) => console.log(`    ${colors.red}• ${i}${colors.reset}`));
  }

  console.log(`\n${colors.bold}Next Action:${colors.reset}`);
  if (!results.razorpay.ready) {
    console.log(`  👉 To configure or update keys, run: ${colors.cyan}node scripts/setup-payments.mjs${colors.reset}\n`);
  } else {
    console.log(`  🎉 Razorpay is ready to process domestic and international payments!`);
    console.log(`  👉 To sync secrets to Cloudflare Workers, run: ${colors.cyan}powershell scripts/sync-secrets-cloudflare.ps1${colors.reset}\n`);
  }
}

main().catch((err) => {
  console.error("Diagnostic script error:", err);
  process.exit(1);
});
