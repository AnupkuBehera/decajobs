/**
 * JSearch API Client
 *
 * Fetches jobs from LinkedIn, Indeed, Glassdoor, and other job boards
 * via the JSearch API on RapidAPI.
 *
 * Free tier: 200 requests/month
 * Docs: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 */

const JSEARCH_API_HOST = "jsearch.p.rapidapi.com";
const JSEARCH_API_URL = `https://${JSEARCH_API_HOST}`;

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_is_remote: boolean;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
}

interface JSearchResponse {
  status: string;
  data: JSearchJob[];
}

export interface ExternalJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applicationLink: string;
  postedAt: string;
  source: "jsearch";
}

/**
 * Search for jobs matching a query using JSearch API.
 *
 * @param query - Search query (e.g., "React Developer in San Francisco")
 * @param page - Page number (default 1)
 * @param numPages - Number of pages to fetch (default 1)
 * @returns Array of normalized job listings
 */
export async function searchJobs(
  query: string,
  page: number = 1,
  numPages: number = 1
): Promise<ExternalJob[]> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.warn("[JSearch] RAPIDAPI_KEY not configured. Skipping external job fetch.");
    return [];
  }

  try {
    const params = new URLSearchParams({
      query,
      page: String(page),
      num_pages: String(numPages),
      date_posted: "month", // Jobs from last 30 days for broader results
    });

    console.log(`[JSearch] Searching: "${query}"`);

    const response = await fetch(`${JSEARCH_API_URL}/search?${params}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": JSEARCH_API_HOST,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[JSearch] API error: ${response.status} ${response.statusText}`, errorText);
      return [];
    }

    const data: JSearchResponse = await response.json();
    console.log(`[JSearch] Found ${data.data?.length ?? 0} jobs for query: "${query}"`);

    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((job) => ({
      id: `jsearch_${job.job_id}`,
      title: job.job_title,
      company: job.employer_name,
      description: job.job_description?.slice(0, 500) || "",
      location: job.job_is_remote
        ? "Remote"
        : [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", "),
      applicationLink: job.job_apply_link,
      postedAt: job.job_posted_at_datetime_utc,
      source: "jsearch" as const,
    }));
  } catch (error) {
    console.error("[JSearch] Failed to fetch jobs:", error);
    return [];
  }
}

/**
 * Fetch jobs matching a candidate's profile.
 * Tries multiple search strategies to maximize results.
 *
 * @param targetTitles - Candidate's desired job titles
 * @param skills - Candidate's key skills
 * @param location - Candidate's preferred location
 * @returns Array of matched external jobs
 */
export async function fetchJobsForCandidate(
  targetTitles: string[],
  skills: string[],
  location: string
): Promise<ExternalJob[]> {
  const allResults: ExternalJob[] = [];
  const seenIds = new Set<string>();

  // Strategy 1: Primary title + location
  const primaryTitle = targetTitles[0] || "Developer";
  const query1 = `${primaryTitle} in ${location}`;
  const results1 = await searchJobs(query1);
  for (const job of results1) {
    if (!seenIds.has(job.id)) {
      seenIds.add(job.id);
      allResults.push(job);
    }
  }

  // Strategy 2: If not enough results, try title + top skills (no location filter)
  if (allResults.length < 10) {
    const topSkills = skills.slice(0, 2).join(" ");
    const query2 = `${primaryTitle} ${topSkills}`;
    const results2 = await searchJobs(query2);
    for (const job of results2) {
      if (!seenIds.has(job.id)) {
        seenIds.add(job.id);
        allResults.push(job);
      }
    }
  }

  // Strategy 3: If still not enough, try second title if available
  if (allResults.length < 10 && targetTitles.length > 1) {
    const query3 = `${targetTitles[1]} ${location}`;
    const results3 = await searchJobs(query3);
    for (const job of results3) {
      if (!seenIds.has(job.id)) {
        seenIds.add(job.id);
        allResults.push(job);
      }
    }
  }

  console.log(`[JSearch] Total unique jobs found: ${allResults.length}`);
  return allResults;
}
