#!/usr/bin/env node
/**
 * DecaJobs Unified Razorpay Setup & Configuration Tool
 *
 * Sets up Razorpay for domestic (India ₹299/mo) and international payments
 * (USD $4.99, GBP £4.99, AED 19) via international credit/debit cards.
 *
 * Usage:
 *   node scripts/setup-payments.mjs
 */

import fs from "fs";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const envLocalPath = path.join(rootDir, ".env.local");
const envExamplePath = path.join(rootDir, ".env.example");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  gray: "\x1b[90m",
};

function readExistingEnv() {
  if (!fs.existsSync(envLocalPath)) {
    if (fs.existsSync(envExamplePath)) {
      return fs.readFileSync(envExamplePath, "utf-8");
    }
    return "";
  }
  return fs.readFileSync(envLocalPath, "utf-8");
}

function updateEnvContent(content, keyValues) {
  let lines = content.split(/\r?\n/);
  const updatedKeys = new Set();

  lines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed.includes("=")) return line;
    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    if (keyValues.hasOwnProperty(key)) {
      updatedKeys.add(key);
      return `${key}=${keyValues[key]}`;
    }
    return line;
  });

  for (const [key, value] of Object.entries(keyValues)) {
    if (!updatedKeys.has(key)) {
      lines.push(`${key}=${value}`);
    }
  }

  return lines.join("\n");
}

async function validateRazorpay(keyId, secret, planId) {
  if (!keyId || !secret) return { ok: false, message: "Key ID or Secret missing" };
  try {
    const basicAuth = Buffer.from(`${keyId}:${secret}`).toString("base64");
    if (planId) {
      const res = await fetch(`https://api.razorpay.com/v1/plans/${planId}`, {
        headers: { Authorization: `Basic ${basicAuth}` },
      });
      if (res.ok) {
        const plan = await res.json();
        return {
          ok: true,
          planName: plan.item?.name,
          amount: (plan.item?.amount || 0) / 100,
          currency: plan.item?.currency || "INR",
        };
      } else if (res.status === 401) {
        return { ok: false, message: "Authentication failed: Key ID or Secret is incorrect" };
      } else if (res.status === 404) {
        return { ok: false, message: `Plan ID "${planId}" not found in this Razorpay account` };
      }
    }
    const testRes = await fetch("https://api.razorpay.com/v1/payments?count=1", {
      headers: { Authorization: `Basic ${basicAuth}` },
    });
    if (testRes.ok) return { ok: true };
    return { ok: false, message: "Invalid credentials (HTTP 401)" };
  } catch (err) {
    return { ok: false, message: `Connection failed: ${err.message}` };
  }
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}    DecaJobs - Unified Razorpay Setup Wizard          ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.gray}Configures Razorpay to handle Domestic + International Payments${colors.reset}\n`);

  console.log(`${colors.bold}Step 1: Razorpay API Keys${colors.reset}`);
  console.log(`${colors.gray}Dashboard: https://dashboard.razorpay.com/app/keys${colors.reset}`);
  console.log(`${colors.gray}Live keys start with 'rzp_live_' | Test keys start with 'rzp_test_'${colors.reset}\n`);

  const rzpKeyId = (await rl.question(`Enter RAZORPAY_KEY_ID: `)).trim();
  const rzpKeySecret = (await rl.question(`Enter RAZORPAY_KEY_SECRET: `)).trim();

  console.log(`\n${colors.bold}Step 2: Subscription Plan ID${colors.reset}`);
  console.log(`${colors.gray}Dashboard: https://dashboard.razorpay.com/app/subscriptions/plans${colors.reset}`);
  console.log(`${colors.gray}Note: Must start with 'plan_' (NOT 'sub_' which is a customer subscription)${colors.reset}\n`);

  const rzpPlanId = (await rl.question(`Enter RAZORPAY_PLAN_ID (e.g. plan_...): `)).trim();

  console.log(`\n${colors.bold}Step 3: Webhook Secret (Optional for local testing)$${colors.reset}`);
  console.log(`${colors.gray}Dashboard: https://dashboard.razorpay.com/app/webhooks${colors.reset}`);
  const rzpWebhook = (await rl.question(`Enter RAZORPAY_WEBHOOK_SECRET (press Enter to skip): `)).trim();

  const keysToSave = {};

  if (rzpKeyId && rzpKeySecret) {
    process.stdout.write(`\nValidating credentials with Razorpay API... `);
    const check = await validateRazorpay(rzpKeyId, rzpKeySecret, rzpPlanId);

    if (check.ok) {
      console.log(`${colors.green}✓ SUCCESS!${colors.reset}`);
      if (check.planName) {
        console.log(`   ${colors.green}Verified Plan: "${check.planName}" (${check.amount} ${check.currency}/mo)${colors.reset}`);
      }
      keysToSave.RAZORPAY_KEY_ID = rzpKeyId;
      keysToSave.RAZORPAY_KEY_SECRET = rzpKeySecret;
      if (rzpPlanId) keysToSave.RAZORPAY_PLAN_ID = rzpPlanId;
      if (rzpWebhook) keysToSave.RAZORPAY_WEBHOOK_SECRET = rzpWebhook;
    } else {
      console.log(`${colors.red}✗ FAILED: ${check.message}${colors.reset}`);
      const proceed = (await rl.question(`Save credentials anyway? (y/n): `)).toLowerCase().trim();
      if (proceed === "y") {
        keysToSave.RAZORPAY_KEY_ID = rzpKeyId;
        keysToSave.RAZORPAY_KEY_SECRET = rzpKeySecret;
        if (rzpPlanId) keysToSave.RAZORPAY_PLAN_ID = rzpPlanId;
        if (rzpWebhook) keysToSave.RAZORPAY_WEBHOOK_SECRET = rzpWebhook;
      }
    }
  }

  if (Object.keys(keysToSave).length > 0) {
    const existingContent = readExistingEnv();
    const newContent = updateEnvContent(existingContent, keysToSave);
    fs.writeFileSync(envLocalPath, newContent, "utf-8");
    console.log(`\n${colors.green}${colors.bold}✓ Saved configuration to .env.local!${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}No keys were provided. .env.local was not modified.${colors.reset}`);
  }

  rl.close();

  // Run verify script to show summary
  console.log(`\nRunning automated diagnostic verification...\n`);
  const { execSync } = await import("child_process");
  try {
    execSync(`node "${path.join(__dirname, "verify-payments.mjs")}"`, { stdio: "inherit" });
  } catch {}
}

main().catch((err) => {
  console.error("Setup script error:", err);
  process.exit(1);
});
