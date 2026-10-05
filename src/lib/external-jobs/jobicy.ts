/**
 * Jobicy Remote Jobs API Client
 *
 * Free, keyless public API for verified remote tech, product, and engineering jobs.
 * All listings are verified and published within the last 7 days.
 * Docs: https://jobicy.com/api/v2/remote-jobs
 */

import type { ExternalJob } from "./types";

interface JobicyJobItem {
  id: number;
  url: string;
  jobSlug: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  jobIndustry?: string[];
  jobType?: string[];
  jobGeo?: string;
  jobLevel?: string;
  jobExcerpt?: string;
  jobDescription: string;
  pubDate: string;
  annualSalaryMin?: number | string;
  annualSalaryMax?: number | string;
  salaryCurrency?: string;
}

interface JobicyResponse {
  apiVersion: string;
  jobCount: number;
  jobs: JobicyJobItem[];
}

/**
 * Fetch remote jobs from Jobicy API v2.
 *
 * @param query - Optional skill or role keyword to filter by tag (e.g. "react", "python", "developer")
 * @param geo - Optional geographic filter (e.g. "anywhere", "usa", "europe", "apac")
 * @returns Array of normalized ExternalJob listings
 */
export async function fetchJobicyJobs(
  query: string = "developer",
  geo?: string
): Promise<ExternalJob[]> {
  try {
    const params = new URLSearchParams({
      count: "50",
    });

    if (query && query.trim() !== "") {
      // Jobicy tag filter handles single keywords best
      const cleanTag = query.trim().split(" ")[0].toLowerCase();
      params.append("tag", cleanTag);
    }

    if (geo && geo.trim() !== "") {
      params.append("geo", geo.trim().toLowerCase());
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(`https://jobicy.com/api/v2/remote-jobs?${params}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "DecaJobs-Aggregator/2.4 (https://decajob.com)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Jobicy] API returned status ${response.status}`);
      return [];
    }

    const text = await response.text();
    if (!text || text.trim() === "" || text.trim().startsWith("<")) {
      console.warn("[Jobicy] API returned empty or invalid JSON response");
      return [];
    }

    let data: JobicyResponse;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("[Jobicy] Failed to parse JSON response");
      return [];
    }

    const items = data.jobs || [];
    console.log(`[Jobicy] Retrieved ${items.length} jobs for query "${query}"`);

    return items.map((job) => {
      // Strip HTML tags from description
      const rawDesc = job.jobExcerpt || job.jobDescription || "";
      let cleanDesc = rawDesc.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

      // Format salary if present
      let salarySnippet = "";
      if (job.annualSalaryMin && job.annualSalaryMax) {
        const curr = job.salaryCurrency || "USD";
        salarySnippet = ` [Salary: ${curr} ${job.annualSalaryMin.toLocaleString()} - ${job.annualSalaryMax.toLocaleString()}]`;
      }

      const description = `${cleanDesc.slice(0, 450)}${salarySnippet}`;

      return {
        id: `jobicy_${job.id}`,
        title: job.jobTitle,
        company: job.companyName,
        description,
        location: job.jobGeo ? `Remote (${job.jobGeo})` : "Remote",
        applicationLink: job.url,
        postedAt: job.pubDate || new Date().toISOString(),
        source: "jobicy",
      };
    });
  } catch (error: any) {
    if (error?.name === "AbortError") {
      console.warn("[Jobicy] Request timed out after 4000ms");
    } else {
      console.warn("[Jobicy] Failed to fetch jobs:", error?.message || error);
    }
    return [];
  }
}
