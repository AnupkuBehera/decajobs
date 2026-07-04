/**
 * Unified External Job Fetcher
 *
 * Queries all configured free job APIs in parallel and returns
 * deduplicated results. Currently sources:
 * - JSearch (LinkedIn, Indeed, Glassdoor via RapidAPI)
 * - Remotive (remote tech jobs)
 * - RemoteOK (remote jobs, all industries)
 * - Arbeitnow (EU + remote jobs)
 */

import { fetchJobsForCandidate as fetchJSearchJobs } from "@/lib/jsearch/client";
import { fetchRemotiveJobs } from "./remotive";
import { fetchRemoteOKJobs } from "./remoteok";
import { fetchArbeitnowJobs } from "./arbeitnow";
import { fetchApifyLinkedInJobs } from "./apify";
import type { ExternalJob } from "./types";

export type { ExternalJob } from "./types";

/**
 * Fetch jobs from all external sources for a candidate's profile.
 * Runs all APIs in parallel for speed, deduplicates by title+company.
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
  const searchQuery = `${primaryTitle} ${skills.slice(0, 2).join(" ")}`;

  // Run all APIs in parallel — each one handles its own errors gracefully
  const [jsearchResults, remotiveResults, remoteokResults, arbeitnowResults, apifyResults] =
    await Promise.all([
      fetchJSearchJobs(targetTitles, skills, location),
      fetchRemotiveJobs(searchQuery),
      fetchRemoteOKJobs(skills.slice(0, 3)),
      fetchArbeitnowJobs(primaryTitle),
      fetchApifyLinkedInJobs(primaryTitle, location),
    ]);

  // Convert JSearch results to common format
  const jsearchJobs: ExternalJob[] = jsearchResults.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    description: j.description,
    location: j.location,
    applicationLink: j.applicationLink,
    postedAt: j.postedAt,
    source: j.source,
  }));

  // Combine all results
  const allJobs = [
    ...jsearchJobs,
    ...remotiveResults,
    ...remoteokResults,
    ...arbeitnowResults,
    ...apifyResults,
  ];

  // Deduplicate by normalized title + company
  const seen = new Set<string>();
  const uniqueJobs: ExternalJob[] = [];

  for (const job of allJobs) {
    const key = `${job.title.toLowerCase().trim()}|${job.company.toLowerCase().trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  console.log(
    `[External Jobs] Total: ${allJobs.length}, Unique: ${uniqueJobs.length} ` +
    `(JSearch: ${jsearchJobs.length}, Remotive: ${remotiveResults.length}, ` +
    `RemoteOK: ${remoteokResults.length}, Arbeitnow: ${arbeitnowResults.length}, ` +
    `Apify: ${apifyResults.length})`
  );

  return uniqueJobs;
}
