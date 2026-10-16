/**
 * Unified External Job Fetcher & Multi-Engine Aggregator
 *
 * Queries 11+ independent job engines and 33+ direct ATS boards in parallel using resilient
 * Promise.allSettled() and circuit breakers. Deduplicates across providers
 * by normalized title and company name.
 *
 * Sources:
 * 1. Jobicy (verified 7-day remote jobs with structured salaries)
 * 2. Himalayas (OpenAPI remote tech jobs with timezone restrictions)
 * 3. Direct Primary ATS (Greenhouse & Lever: Figma, Stripe, Airbnb, Spotify, Coinbase, etc. - 33+ tech leaders)
 * 4. We Work Remotely (Remote programming, devops, design RSS feeds)
 * 5. Working Nomads (Remote developer, tech and management careers)
 * 6. Adzuna (Local country jobs routed to India in, UK gb, US us, CA, AU)
 * 7. Remotive (Remote software engineering and devops)
 * 8. RemoteOK (Global remote tech and startup jobs)
 * 9. Arbeitnow (EU, UK, and European tech hubs)
 * 10. JSearch (LinkedIn, Indeed, Glassdoor via RapidAPI when configured)
 * 11. Apify (LinkedIn actor scraper when configured)
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
import { fetchWorkingNomadsJobs } from "./workingnomads";
import { fetchWeWorkRemotelyJobs } from "./weworkremotely";
import type { ExternalJob } from "./types";

export type { ExternalJob } from "./types";

/**
 * Fetch jobs from all external sources for a candidate's profile.
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

  // Run all external API engines in parallel with individual error resilience
  const results = await Promise.allSettled([
    // 1. Jobicy Remote API (Keyless)
    fetchJobicyJobs(skills[0] || primaryTitle),
    // 2. Himalayas Tech API (Keyless)
    fetchHimalayasJobs(primaryTitle),
    // 3. Direct Primary ATS (Greenhouse / Lever - 33+ Tech Leaders)
    fetchDirectAtsJobs(primaryTitle),
    // 4. We Work Remotely (Keyless RSS)
    fetchWeWorkRemotelyJobs(primaryTitle),
    // 5. Working Nomads (Keyless Open API)
    fetchWorkingNomadsJobs(primaryTitle),
    // 6. Adzuna Local Country Aggregator (Resolved country)
    fetchAdzunaJobs(primaryTitle, adzunaCity, adzunaCountry),
    // 7. Remotive
    fetchRemotiveJobs(searchQuery),
    // 8. RemoteOK
    fetchRemoteOKJobs(skills.slice(0, 3)),
    // 9. Arbeitnow
    fetchArbeitnowJobs(primaryTitle),
    // 10. JSearch (RapidAPI)
    fetchJSearchJobs(targetTitles, skills, location),
    // 11. Apify LinkedIn
    fetchApifyLinkedInJobs(primaryTitle, location),
  ]);

  const allJobs: ExternalJob[] = [];

  // Extract fulfilled jobs safely
  results.forEach((res, idx) => {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      for (const j of res.value) {
        if (!j) continue;
        allJobs.push({
          id: j.id,
          title: j.title,
          company: j.company,
          description: j.description,
          location: j.location,
          applicationLink: j.applicationLink,
          postedAt: j.postedAt,
          source: j.source || "external",
        });
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
