/**
 * Unified External Job Fetcher & Multi-Engine Aggregator
 *
 * Queries up to 10 independent job engines in parallel using resilient
 * Promise.allSettled() and circuit breakers. Deduplicates across providers
 * by normalized title and company name.
 *
 * Sources:
 * 1. Jobicy (verified 7-day remote jobs with structured salaries)
 * 2. Himalayas (OpenAPI remote tech jobs with timezone restrictions)
 * 3. Direct Primary ATS (Greenhouse & Lever public boards: Vercel, Supabase, Stripe, Razorpay, BrowserStack, Postman)
 * 4. Adzuna (Local country jobs routed to India in, UK gb, US us, CA, AU)
 * 5. Remotive (Remote software engineering and devops)
 * 6. RemoteOK (Global remote tech and startup jobs)
 * 7. Arbeitnow (EU, UK, and European tech hubs)
 * 8. JSearch (LinkedIn, Indeed, Glassdoor via RapidAPI when configured)
 * 9. Apify (LinkedIn actor scraper when configured)
 */

import { fetchJobsForCandidate as fetchJSearchJobs } from "@/lib/jsearch/client";
import { fetchRemotiveJobs } from "./remotive";
import { fetchRemoteOKJobs } from "./remoteok";
import { fetchArbeitnowJobs } from "./arbeitnow";
import { fetchApifyLinkedInJobs } from "./apify";
import { fetchAdzunaJobs, resolveAdzunaCountry } from "./adzuna";
import { fetchJobicyJobs } from "./jobicy";
import { fetchHimalayasJobs } from "./himalayas";
import { fetchDirectAtsJobs } from "./ats-boards";
import type { ExternalJob } from "./types";

export type { ExternalJob } from "./types";

/**
 * Fetch jobs from all 10 external sources for a candidate's profile.
 * Runs all APIs concurrently with Promise.allSettled for maximum fault tolerance.
 *
 * @param targetTitles - Candidate's desired job titles
 * @param skills - Candidate's key skills
 * @param location - Candidate's preferred location
 * @returns Array of unique external jobs from all sources
 */
export async function fetchAllExternalJobs(
  targetTitles: string[],
  skills: string[],
  location: string
): Promise<ExternalJob[]> {
  const primaryTitle = targetTitles[0] || "Developer";
  const searchQuery = `${primaryTitle} ${skills.slice(0, 2).join(" ")}`.trim();

  // Intelligent Adzuna Country Routing (India in, US us, UK gb, CA ca, AU au, ZA za)
  const adzunaCountry = resolveAdzunaCountry(location);
  const adzunaCity = location && location.trim() !== "" ? location : "London";

  // Run all 9 external API engines in parallel with individual error resilience
  const results = await Promise.allSettled([
    // 1. Jobicy Remote API (Keyless)
    fetchJobicyJobs(skills[0] || primaryTitle),
    // 2. Himalayas Tech API (Keyless)
    fetchHimalayasJobs(primaryTitle),
    // 3. Direct Primary ATS (Greenhouse / Lever)
    fetchDirectAtsJobs(primaryTitle),
    // 4. Adzuna Local Country Aggregator (Resolved country)
    fetchAdzunaJobs(primaryTitle, adzunaCity, adzunaCountry),
    // 5. Remotive
    fetchRemotiveJobs(searchQuery),
    // 6. RemoteOK
    fetchRemoteOKJobs(skills.slice(0, 3)),
    // 7. Arbeitnow
    fetchArbeitnowJobs(primaryTitle),
    // 8. JSearch (RapidAPI)
    fetchJSearchJobs(targetTitles, skills, location),
    // 9. Apify LinkedIn
    fetchApifyLinkedInJobs(primaryTitle, location),
  ]);

  const allJobs: ExternalJob[] = [];

  // Extract fulfilled jobs safely
  results.forEach((res, idx) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      if (idx === 7) {
        // JSearch format mapping
        const jsearchJobs = res.value.map((j: any) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          description: j.description,
          location: j.location,
          applicationLink: j.applicationLink,
          postedAt: j.postedAt,
          source: j.source || "jsearch",
        }));
        allJobs.push(...jsearchJobs);
      } else {
        allJobs.push(...res.value);
      }
    } else if (res.status === "rejected") {
      console.warn(`[External Jobs] Provider index ${idx} failed:`, res.reason);
    }
  });

  // Deduplicate by normalized title + company
  const seen = new Set<string>();
  const uniqueJobs: ExternalJob[] = [];

  for (const job of allJobs) {
    if (!job.title || !job.company) continue;
    const cleanTitle = job.title.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    const cleanCompany = job.company.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    const key = `${cleanTitle}|${cleanCompany}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  console.log(
    `[Multi-Engine Aggregator] Total raw fetched: ${allJobs.length} -> Unique deduped: ${uniqueJobs.length} ` +
    `(Target: "${primaryTitle}" in "${location}", Adzuna Country: "${adzunaCountry}")`
  );

  return uniqueJobs;
}
