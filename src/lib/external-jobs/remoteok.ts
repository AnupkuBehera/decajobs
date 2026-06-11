/**
 * RemoteOK API Client
 * Free, no API key needed. Remote jobs across all industries.
 * Docs: https://remoteok.com/api
 */

import type { ExternalJob } from "./types";

interface RemoteOKJob {
  id: string;
  position: string;
  company: string;
  description: string;
  location: string;
  url: string;
  date: string;
  tags: string[];
}

export async function fetchRemoteOKJobs(tags: string[]): Promise<ExternalJob[]> {
  try {
    // RemoteOK API accepts tag-based filtering
    const tagQuery = tags.slice(0, 3).join(",").toLowerCase();
    const url = tagQuery
      ? `https://remoteok.com/api?tags=${encodeURIComponent(tagQuery)}`
      : "https://remoteok.com/api";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "DecaJobs/1.0",
      },
    });

    if (!response.ok) {
      console.error(`[RemoteOK] API error: ${response.status}`);
      return [];
    }

    const data: RemoteOKJob[] = await response.json();

    // First element is metadata, skip it
    const jobs = Array.isArray(data) ? data.slice(1) : [];
    console.log(`[RemoteOK] Found ${jobs.length} jobs for tags: "${tagQuery}"`);

    return jobs.slice(0, 20).map((job) => ({
      id: `remoteok_${job.id}`,
      title: job.position || "Remote Position",
      company: job.company || "Unknown",
      description: (job.description || "").replace(/<[^>]*>/g, "").slice(0, 500),
      location: "Remote",
      applicationLink: job.url || `https://remoteok.com/l/${job.id}`,
      postedAt: job.date,
      source: "remoteok",
    }));
  } catch (error) {
    console.error("[RemoteOK] Failed:", error);
    return [];
  }
}
