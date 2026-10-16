/**
 * Working Nomads Remote Jobs Connector
 *
 * Fetches verified remote jobs across software development, data, design,
 * and management from the Working Nomads open JSON feed.
 *
 * Source URL: https://www.workingnomads.com/api/exposed_jobs/
 */

import type { ExternalJob } from "./types";

interface WorkingNomadsJobItem {
  url: string;
  title: string;
  description: string;
  company_name: string;
  category_name?: string;
  tags?: string;
  location?: string;
  pub_date?: string;
}

export async function fetchWorkingNomadsJobs(query?: string): Promise<ExternalJob[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://www.workingnomads.com/api/exposed_jobs/", {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "DecaJobs-Aggregator/2.5 (https://decajob.com)",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[WorkingNomads] HTTP error ${res.status}`);
      return [];
    }

    const data: WorkingNomadsJobItem[] = await res.json();
    if (!Array.isArray(data)) return [];

    const queryLower = (query || "").toLowerCase().trim();

    const filtered = data.filter((item) => {
      if (!queryLower) return true;
      const combined = `${item.title} ${item.description} ${item.tags || ""} ${item.category_name || ""}`.toLowerCase();
      return combined.includes(queryLower);
    });

    const jobs: ExternalJob[] = filtered.slice(0, 50).map((item, idx) => {
      const cleanDesc = (item.description || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 4000);

      return {
        id: `wn_${Buffer.from(item.url || String(idx)).toString("base64").slice(0, 16)}`,
        title: item.title,
        company: item.company_name || "Remote Employer",
        description: cleanDesc,
        location: item.location || "Remote Worldwide",
        applicationLink: item.url,
        postedAt: item.pub_date || new Date().toISOString(),
        source: "working_nomads",
      };
    });

    console.log(`[WorkingNomads] Retrieved ${jobs.length} jobs (filtered from ${data.length})`);
    return jobs;
  } catch (err: any) {
    console.warn(`[WorkingNomads] Failed to fetch: ${err.message || err}`);
    return [];
  }
}
