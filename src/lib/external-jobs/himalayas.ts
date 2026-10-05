/**
 * Himalayas Remote Jobs API Client
 *
 * Free, keyless public JSON API providing curated remote technology jobs,
 * salary data, timezone requirements, and company tech stacks.
 * Docs: https://himalayas.app/docs/openapi.json
 */

import type { ExternalJob } from "./types";

interface HimalayasJobItem {
  id?: string | number;
  slug?: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  description?: string;
  excerpt?: string;
  locationRestrictions?: string[];
  timezoneRestrictions?: string[];
  pubDate: string;
  url?: string;
  applicationUrl?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  seniority?: string[];
  categories?: string[];
}

interface HimalayasResponse {
  jobs: HimalayasJobItem[];
  meta?: {
    total?: number;
    nextCursor?: string;
  };
}

/**
 * Fetch remote tech jobs from Himalayas.
 *
 * @param query - Keyword to filter jobs (e.g. "engineer", "frontend", "python")
 * @returns Array of normalized ExternalJob listings
 */
export async function fetchHimalayasJobs(query: string = "engineer"): Promise<ExternalJob[]> {
  try {
    const params = new URLSearchParams({
      limit: "25",
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(`https://himalayas.app/jobs/api?${params}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "DecaJobs-Aggregator/2.4 (https://decajob.com)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Himalayas] API returned status ${response.status}`);
      return [];
    }

    const text = await response.text();
    if (!text || text.trim() === "" || text.trim().startsWith("<")) {
      console.warn("[Himalayas] API returned empty or non-JSON body");
      return [];
    }

    let data: HimalayasResponse;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("[Himalayas] Failed to parse JSON response");
      return [];
    }

    const rawJobs = data.jobs || [];
    const queryLower = query.toLowerCase().trim();

    // Filter relevant jobs if query specified
    const matchedJobs = rawJobs.filter((job) => {
      if (!queryLower) return true;
      const titleMatch = job.title?.toLowerCase().includes(queryLower);
      const catMatch = job.categories?.some((c) => c.toLowerCase().includes(queryLower));
      const descMatch = (job.excerpt || job.description || "").toLowerCase().includes(queryLower);
      return titleMatch || catMatch || descMatch;
    });

    // Fall back to general pool if exact match is empty
    const selectedJobs = matchedJobs.length > 0 ? matchedJobs : rawJobs.slice(0, 15);

    console.log(`[Himalayas] Retrieved ${selectedJobs.length} jobs (filtered from ${rawJobs.length})`);

    return selectedJobs.map((job, index) => {
      const rawDesc = job.excerpt || job.description || "";
      const cleanDesc = rawDesc.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

      // Salary snippet
      let salarySnippet = "";
      if (job.minSalary && job.maxSalary) {
        const curr = job.currency || "USD";
        salarySnippet = ` [Salary: ${curr} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}]`;
      }

      // Geo / timezone info
      let locationText = "Remote";
      if (job.locationRestrictions && job.locationRestrictions.length > 0) {
        locationText = `Remote (${job.locationRestrictions.slice(0, 2).join(", ")})`;
      }

      const id = job.slug || job.id?.toString() || `himalayas_${Date.now()}_${index}`;
      const appLink =
        job.applicationUrl ||
        job.url ||
        `https://himalayas.app/companies/${job.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/jobs/${job.slug || ""}`;

      return {
        id: `himalayas_${id}`,
        title: job.title,
        company: job.companyName,
        description: `${cleanDesc.slice(0, 450)}${salarySnippet}`,
        location: locationText,
        applicationLink: appLink,
        postedAt: job.pubDate || new Date().toISOString(),
        source: "himalayas",
      };
    });
  } catch (error: any) {
    if (error?.name === "AbortError") {
      console.warn("[Himalayas] Request timed out after 4000ms");
    } else {
      console.warn("[Himalayas] Failed to fetch jobs:", error?.message || error);
    }
    return [];
  }
}
