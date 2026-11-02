/**
 * Test Email Dispatch & Resend Diagnostic Tool
 *
 * Usage:
 *   node scripts/test-email-dispatch.mjs --to="youremail@example.com"
 */

import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

// Load .env.local if present
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const targetEmail = process.argv.find((a) => a.startsWith("--to="))?.split("=")[1] ||
  process.env.TEST_EMAIL ||
  "anup4503@gmail.com";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "DecaJobs <noreply@decajob.com>";

console.log("==================================================");
console.log("   DecaJobs - Email Deliverability Diagnostic     ");
console.log("==================================================");
console.log(`Target Recipient : ${targetEmail}`);
console.log(`From Address     : ${fromEmail}`);
console.log(`API Key set?     : ${apiKey ? "YES (" + apiKey.slice(0, 7) + "...)" : "NO"}`);
console.log("");

if (!apiKey || apiKey.includes("dummy")) {
  console.error("ERROR: RESEND_API_KEY is not set in environment or .env.local.");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function runDiagnostic() {
  try {
    console.log("1. Verifying API Key with Resend...");
    const { data: apiKeys, error: keyErr } = await resend.apiKeys.list();
    if (keyErr) {
      console.warn("Notice checking apiKeys:", keyErr.message);
    } else {
      console.log("   [OK] Resend API Key is active and authorized.");
    }

    console.log("\n2. Dispatching sample DecaJobs Daily 10 email...");
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { data: sendData, error: sendErr } = await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject: `Your DecaJobs Daily 10 [Test] — ${dateStr}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h1 style="color: #2563eb; margin: 0 0 8px;">DecaJobs</h1>
          <h2 style="color: #0f172a; margin: 0 0 16px;">Daily 10 Curated Tech Jobs (Test Verification)</h2>
          <p style="color: #475569; font-size: 14px;">This is a live diagnostic test verifying that the email delivery pipeline, Resend credentials, and SMTP headers are working perfectly.</p>
          <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px; color: #334155;"><strong>Recipient:</strong> ${targetEmail}</p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #334155;"><strong>Status:</strong> Delivered via Resend API</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">DecaJobs Automated Dispatcher</p>
        </div>
      `,
    });

    if (sendErr) {
      console.error("\n[FAILED] Resend rejected outgoing email:");
      console.error(`Error Message: ${sendErr.message}`);
      if (sendErr.message.includes("domain")) {
        console.error("\nTip: Domain 'decajob.com' must be verified with DNS records on resend.com/domains.");
      }
      process.exit(1);
    }

    console.log("\n[SUCCESS] Email sent successfully!");
    console.log(`Message ID: ${sendData?.id}`);
    console.log(`Please check your inbox at: ${targetEmail}`);
  } catch (err) {
    console.error("\n[CRITICAL ERROR]:", err.message);
    process.exit(1);
  }
}

runDiagnostic();

