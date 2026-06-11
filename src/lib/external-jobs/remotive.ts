/**
 * Remotive API Client
 * Free, no API key needed. Remote tech jobs only.
 * Docs: https://remotive.com/api/remote-jobs
 */

import type { ExternalJob } from "./types";

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  description: string;
  category: string;
  url: string;
  publication_date: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

export async function fetchRemotiveJobs(query: string): Promise<ExternalJob[]> {
  try {
    const params = new URLSearchParams({ search: query, limit: "20" });
    const response = await fetch(
      `https://remotive.com/api/remote-jobs?${params}`
    );

    if (!response.ok) {
      console.error(`[Remotive] API error: ${response.status}`);
      return [];
    }

    const data: RemotiveResponse = await response.json();
    console.log(`[Remotive] Found ${data.jobs?.length ?? 0} jobs for "${query}"`);

    return (data.jobs || []).map((job) => ({
      id: `remotive_${job.id}`,
      title: job.title,
      company: job.company_name,
      description: job.description.replace(/<[^>]*>/g, "").slice(0, 500),
      location: "Remote",
      applicationLink: job.url,
      postedAt: job.publication_date,
      source: "remotive",
    }));
  } catch (error) {
    console.error("[Remotive] Failed:", error);
    return [];
  }
}
