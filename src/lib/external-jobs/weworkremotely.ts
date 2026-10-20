/**
 * We Work Remotely (WWR) Jobs Connector
 *
 * Fetches verified remote tech jobs from We Work Remotely RSS feeds
 * covering Programming, DevOps & Sysadmin, and Design.
 */

import type { ExternalJob } from "./types";

const WWR_FEEDS = [
  "https://weworkremotely.com/categories/remote-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
  "https://weworkremotely.com/categories/remote-design-jobs.rss",
];

export async function fetchWeWorkRemotelyJobs(query?: string): Promise<ExternalJob[]> {
  try {
    const fetchPromises = WWR_FEEDS.map(async (feedUrl) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(feedUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/rss+xml, application/xml, text/xml",
            "User-Agent": "DecaJobs-Aggregator/2.5 (https://decajob.com)",
          },
          next: { revalidate: 3600 },
        });

        clearTimeout(timeoutId);
        if (!res.ok) return "";
        return await res.text();
      } catch {
        return "";
      }
    });

    const feedTexts = await Promise.all(fetchPromises);
    const allRawItems: string[] = [];

    for (const xml of feedTexts) {
      if (!xml) continue;
      const parts = xml.split("<item>");
      if (parts.length > 1) {
        allRawItems.push(...parts.slice(1));
      }
    }

    const queryLower = (query || "").toLowerCase().trim();
    const jobs: ExternalJob[] = [];
    const seenLinks = new Set<string>();

    for (const raw of allRawItems) {
      const titleMatch = raw.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || "";
      const linkMatch = raw.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)?.[1] || "";
      const regionMatch = raw.match(/<region>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/region>/)?.[1] || "Remote Worldwide";
      const descMatch = raw.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || "";
      const pubDateMatch = raw.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/)?.[1] || "";

      if (!titleMatch || !linkMatch || seenLinks.has(linkMatch)) continue;
      seenLinks.add(linkMatch);

      // Extract company and title: "Company Name: Job Title"
      let company = "Remote Employer";
      let title = titleMatch.trim();

      if (titleMatch.includes(": ")) {
        const colonIdx = titleMatch.indexOf(": ");
        company = titleMatch.slice(0, colonIdx).trim();
        title = titleMatch.slice(colonIdx + 2).trim();
      }

      // Filter by query if provided
      if (queryLower) {
        const combined = `${title} ${company} ${descMatch}`.toLowerCase();
        if (!combined.includes(queryLower)) continue;
      }

      const cleanDesc = descMatch
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 4000);

      const id = `wwr_${Buffer.from(linkMatch).toString("base64").slice(0, 16)}`;

      let postedIso = new Date().toISOString();
      if (pubDateMatch) {
        const parsed = new Date(pubDateMatch).toISOString();
        if (!Number.isNaN(Date.parse(parsed))) {
          postedIso = parsed;
        }
      }

      jobs.push({
        id,
        title,
        company,
        description: cleanDesc || `Remote role at ${company}. Apply via We Work Remotely.`,
        location: regionMatch.trim() || "Remote",
        applicationLink: linkMatch.trim(),
        postedAt: postedIso,
        source: "weworkremotely",
      });

      if (jobs.length >= 60) break;
    }

    console.log(`[WeWorkRemotely] Retrieved ${jobs.length} jobs`);
    return jobs;
  } catch (err: any) {
    console.warn(`[WeWorkRemotely] Fetch error: ${err.message || err}`);
    return [];
  }
}
