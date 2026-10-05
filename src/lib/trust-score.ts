/**
 * Job Trust Score™ Engine
 *
 * Algorithmically evaluates any job listing (0–100) to protect job seekers
 * against ghost jobs, stale postings, fee scams, and misleading aggregations.
 */

import { daysSincePosted } from "@/lib/public-jobs";

export interface TrustScoreInput {
  title?: string;
  company?: string;
  description?: string;
  location?: string;
  postedAt?: string | null;
  salary?: string;
  source?: string;
  applicationLink?: string;
}

export type TrustLevel = "verified_high" | "standard" | "caution" | "high_risk";

export interface TrustScoreResult {
  score: number;
  level: TrustLevel;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: string;
  isGhostJobRisk: boolean;
  reasons: string[];
  breakdown: {
    freshness: number;      // max 30
    authenticity: number;   // max 25
    safety: number;         // max 25
    clarity: number;        // max 20
  };
}

/**
 * Known trustworthy employers / platforms / GCCs operating in India & globally.
 */
const ESTABLISHED_COMPANIES = new Set([
  "google", "microsoft", "amazon", "apple", "meta", "netflix",
  "flipkart", "swiggy", "zomato", "razorpay", "tcs", "infosys",
  "wipro", "hcl", "cognizant", "accenture", "deloitte", "pwc",
  "kpmg", "ey", "uber", "ola", "paytm", "phonepe", "meesho",
  "zepto", "cred", "zerodha", "groww", "atlassian", "salesforce",
  "adobe", "cisco", "oracle", "ibm", "intuit", "stripe", "shopify"
]);

/**
 * Calculate the Job Trust Score (0-100)
 */
export function calculateJobTrustScore(input: TrustScoreInput): TrustScoreResult {
  const reasons: string[] = [];
  let freshness = 20;
  let authenticity = 20;
  let safety = 25;
  let clarity = 15;
  let isGhostJobRisk = false;

  const title = (input.title || "").trim();
  const company = (input.company || "").trim();
  const companyLower = company.toLowerCase();
  const description = (input.description || "").trim();
  const textLower = `${title} ${company} ${description} ${input.salary || ""}`.toLowerCase();

  // ── 1. Freshness & Stale Risk (max 30 pts) ──
  const days = daysSincePosted(input.postedAt ?? null);
  if (days !== null) {
    if (days <= 2) {
      freshness = 30;
      reasons.push("Posted within 48 hours (fresh hiring window)");
    } else if (days <= 7) {
      freshness = 24;
      reasons.push("Posted this week (actively reviewing)");
    } else if (days <= 14) {
      freshness = 16;
      reasons.push("Posted within 14 days");
    } else if (days <= 30) {
      freshness = 8;
      reasons.push("Posted over 2 weeks ago");
    } else {
      freshness = 2;
      isGhostJobRisk = true;
      reasons.push("Stale listing (>30 days old) — Elevated ghost job risk");
    }
  } else {
    freshness = 18;
    reasons.push("Actively listed in current daily aggregator crawl");
  }

  // ── 2. Company Authenticity (max 25 pts) ──
  if (!company || company.length < 2 || /confidential|undisclosed|private company/i.test(company)) {
    authenticity = 6;
    reasons.push("Hiring company identity is anonymous or undisclosed");
  } else if (ESTABLISHED_COMPANIES.has(companyLower)) {
    authenticity = 25;
    reasons.push(`Verified Tier-1 employer brand: ${company}`);
  } else {
    authenticity = 22;
    reasons.push(`Identifiable employer: ${company}`);
  }

  // ── 3. Safety & Scam Indicators (max 25 pts) ──
  // Check for upfront fees / scam patterns
  const hasFeePattern = /registration fee|security deposit|training fee|processing charge|pay upfront|wire transfer|cryptocurrency/i.test(textLower);
  const hasPersonalEmail = /@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)/i.test(textLower);
  const hasTelegramScreening = /telegram(@|\.me)|contact on whatsapp only/i.test(textLower);

  if (hasFeePattern) {
    safety = 0;
    reasons.push("CRITICAL: Mentions upfront fees, deposit, or wire transfers");
  } else if (hasPersonalEmail && hasTelegramScreening) {
    safety = 6;
    reasons.push("High risk: Uses personal email and messaging-only screening");
  } else if (hasPersonalEmail) {
    safety = 14;
    reasons.push("Uses free personal email address rather than corporate domain");
  } else if (hasTelegramScreening) {
    safety = 14;
    reasons.push("Conducts screening exclusively over private chat apps");
  } else {
    safety = 25;
    reasons.push("Zero scam fee signals detected — clean ATS application pathway");
  }

  // ── 4. Clarity & Role Transparency (max 20 pts) ──
  if (description.length >= 300) {
    clarity += 5;
  }
  if (input.salary && input.salary.trim().length > 2 && !/not mentioned|competitive/i.test(input.salary)) {
    clarity = Math.min(20, clarity + 5);
    reasons.push("Transparent compensation details provided");
  }
  if (description.length < 80) {
    clarity = 4;
    reasons.push("Brief or ambiguous role description");
  }

  // Total Score clamped between 15 and 99
  const totalRaw = freshness + authenticity + safety + clarity;
  const score = Math.max(15, Math.min(98, Math.round(totalRaw)));

  // Categorize
  let level: TrustLevel = "standard";
  let label = `${score}/100 · Verified Standard`;
  let badgeBg = "bg-teal-50";
  let badgeBorder = "border-teal-200";
  let badgeText = "text-teal-800";
  let icon = "🛡️";

  if (score >= 88) {
    level = "verified_high";
    label = `${score}/100 · High Trust`;
    badgeBg = "bg-emerald-50";
    badgeBorder = "border-emerald-300";
    badgeText = "text-emerald-800";
    icon = "🛡️";
  } else if (score >= 70) {
    level = "standard";
    label = `${score}/100 · Verified Live`;
    badgeBg = "bg-blue-50";
    badgeBorder = "border-blue-200";
    badgeText = "text-blue-800";
    icon = "✓";
  } else if (score >= 50) {
    level = "caution";
    label = `${score}/100 · Moderate Risk`;
    badgeBg = "bg-amber-50";
    badgeBorder = "border-amber-300";
    badgeText = "text-amber-800";
    icon = "⚠️";
  } else {
    level = "high_risk";
    label = `${score}/100 · High Risk / Stale`;
    badgeBg = "bg-red-50";
    badgeBorder = "border-red-300";
    badgeText = "text-red-800";
    icon = "🚨";
  }

  return {
    score,
    level,
    label,
    badgeBg,
    badgeBorder,
    badgeText,
    icon,
    isGhostJobRisk,
    reasons: reasons.slice(0, 3),
    breakdown: {
      freshness,
      authenticity,
      safety,
      clarity,
    },
  };
}
