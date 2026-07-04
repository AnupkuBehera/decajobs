import type { ExternalJob } from "./types";

/**
 * Fetch LinkedIn job listings using Apify LinkedIn Jobs Scraper.
 * Uses synchronous run API with a fallback timeout guard.
 *
 * @param targetTitle - Primary job title query (e.g., "React Developer")
 * @param location - Desired job location (e.g., "Remote", "New York")
 * @param limit - Maximum number of items to fetch (default 10)
 * @returns Array of normalized external jobs
 */
export async function fetchApifyLinkedInJobs(
  targetTitle: string,
  location: string,
  limit: number = 10
): Promise<ExternalJob[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    console.log("[Apify] APIFY_TOKEN not configured. Skipping Apify LinkedIn search.");
    return [];
  }

  const actorId = process.env.APIFY_LINKEDIN_SCRAPER_ID || "hxnua871g1n/linkedin-jobs-scraper";
  // Apify API endpoints require replacing '/' with '~' in Actor IDs
  const normalizedActorId = actorId.replace("/", "~");
  const url = `https://api.apify.com/v2/acts/${normalizedActorId}/run-sync-get-dataset-items?token=${token}&timeout=15`;

  console.log(`[Apify] Triggering LinkedIn Scraper run for keywords: "${targetTitle}" in "${location}"`);

  // Setup abort controller for 18 seconds total timeout guard (just above Apify API timeout parameter)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: targetTitle,
        location: location,
        maxItems: limit,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`[Apify] Scraper run failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const items = await res.json();
    if (!Array.isArray(items)) {
      console.error("[Apify] Invalid response data format from dataset:", items);
      return [];
    }

    console.log(`[Apify] Successfully scraped ${items.length} jobs`);

    return items.map((item: any, idx: number) => {
      const id = item.id || item.jobId || `idx_${idx}_${Date.now()}`;
      const title = item.title || item.jobTitle || item.positionName || targetTitle;
      const company = item.companyName || item.company || item.employer || "Unknown Company";
      const description = item.description || item.jobDescription || item.body || "";
      const locationName = item.location || item.jobLocation || location;
      const applicationLink = item.jobUrl || item.applyUrl || item.url || `https://www.linkedin.com/jobs/view/${id}`;
      const postedAt = item.postedAt || item.postDate || item.time || new Date().toISOString();

      return {
        id: `apify_${id}`,
        title,
        company,
        description: description.slice(0, 500),
        location: locationName,
        applicationLink,
        postedAt,
        source: "apify",
      };
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error("[Apify] Error running LinkedIn scraper:", err.name === "AbortError" ? "Request timed out" : err.message || err);
    return [];
  }
}
