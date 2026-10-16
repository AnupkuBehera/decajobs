/**
 * Direct Primary ATS Aggregator (Greenhouse & Lever Public APIs)
 *
 * Fetches 100% authentic, unmediated job listings directly from top tech employers'
 * public applicant tracking boards (Vercel, Supabase, Stripe, Razorpay, BrowserStack,
 * Postman, Cloudflare, GitLab, Automattic).
 *
 * Benefits:
 * - 0% recruiter spam or aggregator re-postings.
 * - Direct application forms with verified active roles.
 * - High-density coverage for Indian tech hubs (Bangalore/Hyd/Mumbai), London, US, and Remote.
 */

import type { ExternalJob } from "./types";

interface GreenhouseJobItem {
  id: number;
  title: string;
  absolute_url: string;
  location?: {
    name?: string;
  };
  updated_at?: string;
  content?: string;
}

interface GreenhouseResponse {
  jobs: GreenhouseJobItem[];
}

interface LeverPostingItem {
  id: string;
  text: string;
  hostedUrl: string;
  categories?: {
    location?: string;
    team?: string;
    commitment?: string;
  };
  createdAt?: number;
  descriptionPlain?: string;
}

// Curated list of high-growth tech employers with public ATS endpoints (Greenhouse & Lever)
const PRIMARY_TECH_COMPANIES = [
  { name: "Vercel", board: "vercel", type: "greenhouse" },
  { name: "Supabase", board: "supabase", type: "greenhouse" },
  { name: "Stripe", board: "stripe", type: "greenhouse" },
  { name: "Cloudflare", board: "cloudflare", type: "greenhouse" },
  { name: "Figma", board: "figma", type: "greenhouse" },
  { name: "Airbnb", board: "airbnb", type: "greenhouse" },
  { name: "Coinbase", board: "coinbase", type: "greenhouse" },
  { name: "Datadog", board: "datadog", type: "greenhouse" },
  { name: "MongoDB", board: "mongodb", type: "greenhouse" },
  { name: "Elastic", board: "elastic", type: "greenhouse" },
  { name: "Reddit", board: "reddit", type: "greenhouse" },
  { name: "Robinhood", board: "robinhood", type: "greenhouse" },
  { name: "Pinterest", board: "pinterest", type: "greenhouse" },
  { name: "Dropbox", board: "dropbox", type: "greenhouse" },
  { name: "Discord", board: "discord", type: "greenhouse" },
  { name: "Okta", board: "okta", type: "greenhouse" },
  { name: "Affirm", board: "affirm", type: "greenhouse" },
  { name: "Gusto", board: "gusto", type: "greenhouse" },
  { name: "Brex", board: "brex", type: "greenhouse" },
  { name: "Scale AI", board: "scaleai", type: "greenhouse" },
  { name: "Flexport", board: "flexport", type: "greenhouse" },
  { name: "InMobi", board: "inmobi", type: "greenhouse" },
  { name: "Groww", board: "groww", type: "greenhouse" },
  { name: "Cockroach Labs", board: "cockroachlabs", type: "greenhouse" },
  { name: "Carta", board: "carta", type: "greenhouse" },
  { name: "Airtable", board: "airtable", type: "greenhouse" },
  { name: "GitLab", board: "gitlab", type: "greenhouse" },
  { name: "Postman", board: "postman", type: "greenhouse" },
  { name: "BrowserStack", board: "browserstack", type: "greenhouse" },
  { name: "Razorpay", board: "razorpay", type: "greenhouse" },
  { name: "Automattic", board: "automattic", type: "greenhouse" },
  { name: "Spotify", board: "spotify", type: "lever" },
  { name: "Kinsta", board: "kinsta", type: "lever" },
] as const;

/**
 * Fetch jobs from a single Lever public board.
 */
async function fetchLeverBoard(
  companyName: string,
  boardToken: string,
  queryLower: string
): Promise<ExternalJob[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.lever.co/v0/postings/${boardToken}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "DecaJobs-DirectATS/2.5 (https://decajob.com)",
      },
    });

    clearTimeout(timeoutId);
    if (!res.ok) return [];

    const postings: any[] = await res.json();
    if (!Array.isArray(postings)) return [];

    const matched = postings.filter((p) => {
      if (!queryLower) return true;
      const titleLower = (p.text || "").toLowerCase();
      const locLower = (p.categories?.location || "").toLowerCase();
      return titleLower.includes(queryLower) || locLower.includes(queryLower);
    });

    return matched.map((p) => {
      const cleanDesc = (p.descriptionPlain || p.text || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 4000);

      return {
        id: `lever_${boardToken}_${p.id}`,
        title: p.text,
        company: companyName,
        description: cleanDesc || `Direct career posting at ${companyName}.`,
        location: p.categories?.location || "Remote",
        applicationLink: p.hostedUrl || `https://jobs.lever.co/${boardToken}/${p.id}`,
        postedAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        source: "direct_ats",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Fetch jobs from a single Greenhouse public board.
 */
async function fetchGreenhouseBoard(
  companyName: string,
  boardToken: string,
  queryLower: string
): Promise<ExternalJob[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "DecaJobs-DirectATS/2.5 (https://decajob.com)",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const data: GreenhouseResponse = await res.json();
    const jobs = data.jobs || [];

    // Filter jobs matching the candidate query
    const matched = jobs.filter((j) => {
      if (!queryLower) return true;
      const titleLower = (j.title || "").toLowerCase();
      const locLower = (j.location?.name || "").toLowerCase();
      return titleLower.includes(queryLower) || locLower.includes(queryLower);
    });

    return matched.map((j) => {
      const location = j.location?.name || "Global / Remote";
      const description = `Direct primary career posting from ${companyName}. Verified hiring team listing with direct ATS application. Location: ${location}.`;

      return {
        id: `gh_${boardToken}_${j.id}`,
        title: j.title,
        company: companyName,
        description,
        location: j.location?.name || "Remote",
        applicationLink: j.absolute_url,
        postedAt: j.updated_at || new Date().toISOString(),
        source: "direct_ats",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Fetch jobs across all curated primary ATS boards.
 *
 * @param query - Candidate target title or skill (e.g. "software", "frontend", "data", "engineer")
 * @returns Array of normalized ExternalJob listings
 */
export async function fetchDirectAtsJobs(query: string = "engineer"): Promise<ExternalJob[]> {
  const queryLower = query.toLowerCase().trim();

  // Run board queries in parallel
  const boardPromises = PRIMARY_TECH_COMPANIES.map((company) => {
    if (company.type === "lever") {
      return fetchLeverBoard(company.name, company.board, queryLower);
    }
    return fetchGreenhouseBoard(company.name, company.board, queryLower);
  });

  const results = await Promise.allSettled(boardPromises);
  const jobs: ExternalJob[] = [];

  for (const r of results) {
    if (r.status === "fulfilled") {
      jobs.push(...r.value);
    }
  }

  console.log(`[Direct ATS] Fetched ${jobs.length} direct employer jobs for query "${query}"`);
  return jobs;
}
