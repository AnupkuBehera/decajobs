/**
 * Arbeitnow API Client
 * Free, no API key needed. EU + Remote jobs.
 * Docs: https://www.arbeitnow.com/api
 */

import type { ExternalJob } from "./types";

interface ArbeitnowJob {
  slug: string;
  title: string;
  company_name: string;
  description: string;
  location: string;
  remote: boolean;
  url: string;
  created_at: string;
  tags: string[];
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
}

export async function fetchArbeitnowJobs(query: string): Promise<ExternalJob[]> {
  try {
    const params = new URLSearchParams({ search: query, page: "1" });
    const response = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?${params}`
    );

    if (!response.ok) {
      console.error(`[Arbeitnow] API error: ${response.status}`);
      return [];
    }

    const data: ArbeitnowResponse = await response.json();
    console.log(`[Arbeitnow] Found ${data.data?.length ?? 0} jobs for "${query}"`);

    return (data.data || []).slice(0, 20).map((job) => ({
      id: `arbeitnow_${job.slug}`,
      title: job.title,
      company: job.company_name,
      description: (job.description || "").replace(/<[^>]*>/g, "").slice(0, 500),
      location: job.remote ? "Remote" : job.location || "EU",
      applicationLink: job.url,
      postedAt: job.created_at,
      source: "arbeitnow",
    }));
  } catch (error) {
    console.error("[Arbeitnow] Failed:", error);
    return [];
  }
}
