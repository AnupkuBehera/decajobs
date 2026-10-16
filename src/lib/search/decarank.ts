/**
 * DecaRank-10 Search & Ranking Engine
 *
 * Core algorithmic engine that powers DecaJobs's primary USP:
 * "10 jobs. Every morning. That's it."
 *
 * Rather than returning a generic endless list of keyword matches, DecaRank
 * scores every candidate job across 5 key dimensions:
 * 1. Title & Semantic Relevance (0-40 pts)
 * 2. Tech Skills Overlap (0-25 pts)
 * 3. Freshness / Recency Decay (0-20 pts)
 * 4. Job Trust Score™ Integrity (0-15 pts)
 * 5. Experience Level Alignment (±10 pts)
 *
 * It then enforces DecaDiversity (max 2 jobs per company) to curate the
 * absolute 10 Best Jobs for any given search or personalized profile.
 */

import type { ExternalJob } from "@/lib/external-jobs/types";
import {
    daysSincePosted,
    extractSkillsFromJob,
    isRemoteJob,
    isGenuineJob,
    isJobFresh,
} from "@/lib/public-jobs";
import { calculateJobTrustScore } from "@/lib/trust-score";

export type ExperienceLevel = "all" | "fresher" | "mid" | "senior";
export type WorkMode = "all" | "remote" | "hybrid" | "onsite";
export type SortOption = "decarank" | "newest" | "trust";

export interface DecaSearchParams {
    query?: string;
    experience?: ExperienceLevel;
    workMode?: WorkMode;
    category?: string;
    location?: string;
    sort?: SortOption;
}

export interface RankedJob {
    job: ExternalJob;
    rank: number;
    score: number; // 0 to 100
    matchedSkills: string[];
    matchHighlights: string[];
    isTop10: boolean;
}

export interface DecaSearchResult {
    top10: RankedJob[];
    allResults: RankedJob[];
    totalCount: number;
    query: string;
    activeFilters: {
        experience: ExperienceLevel;
        workMode: WorkMode;
        category: string;
        location: string;
        sort: SortOption;
    };
}

/* ────────────────────────── Experience Matchers ────────────────────────── */

const FRESHER_KEYWORDS = [
    "fresher",
    "entry",
    "junior",
    "jr",
    "intern",
    "internship",
    "graduate",
    "trainee",
    "associate",
    "sde 1",
    "sde-1",
    "sde1",
    "0-1",
    "0-2",
];

const SENIOR_KEYWORDS = [
    "senior",
    "sr",
    "lead",
    "principal",
    "staff",
    "architect",
    "head of",
    "director",
    "manager",
    "5+",
    "7+",
    "10+",
];

export function detectExperienceTier(text: string): "fresher" | "senior" | "mid" {
    const lower = text.toLowerCase();
    if (FRESHER_KEYWORDS.some((kw) => lower.includes(kw))) return "fresher";
    if (SENIOR_KEYWORDS.some((kw) => lower.includes(kw))) return "senior";
    return "mid";
}

/* ────────────────────────────── Scorer ─────────────────────────────────── */

export function scoreJob(
    job: ExternalJob,
    params: DecaSearchParams
): { score: number; matchedSkills: string[]; highlights: string[] } {
    let score = 50; // Base score for verified listings
    const highlights: string[] = [];

    const jobTitleLower = job.title.toLowerCase();
    const jobDescLower = job.description.toLowerCase();
    const jobCompLower = job.company.toLowerCase();
    const combinedText = `${jobTitleLower} ${jobDescLower}`;

    const query = (params.query ?? "").trim().toLowerCase();
    const queryTokens = query.split(/\s+/).filter((t) => t.length > 1);

    // 1. Title & Keyword Relevance (0 - 40 pts)
    if (queryTokens.length > 0) {
        if (jobTitleLower.includes(query)) {
            score += 35;
            highlights.push("Exact title match");
        } else {
            let titleTokenMatches = 0;
            for (const token of queryTokens) {
                if (jobTitleLower.includes(token)) titleTokenMatches++;
            }
            if (titleTokenMatches > 0) {
                const bonus = Math.min(30, titleTokenMatches * 15);
                score += bonus;
                highlights.push("Title matches search keywords");
            } else if (jobCompLower.includes(query)) {
                score += 25;
                highlights.push(`Company match: ${job.company}`);
            } else {
                let descMatches = 0;
                for (const token of queryTokens) {
                    if (jobDescLower.includes(token)) descMatches++;
                }
                if (descMatches > 0) {
                    score += Math.min(15, descMatches * 5);
                    highlights.push("Role description keywords match");
                }
            }
        }
    } else {
        // No query: baseline relevance
        score += 20;
    }

    // 2. Tech Skills Overlap (0 - 25 pts)
    const extracted = extractSkillsFromJob(`${job.title} ${job.description}`, 6);
    const matchedSkills: string[] = [];

    if (queryTokens.length > 0) {
        for (const skill of extracted) {
            const skillLower = skill.toLowerCase();
            if (queryTokens.some((token) => skillLower.includes(token) || token.includes(skillLower))) {
                matchedSkills.push(skill);
            }
        }
    } else {
        matchedSkills.push(...extracted.slice(0, 3));
    }

    if (matchedSkills.length > 0) {
        score += Math.min(20, matchedSkills.length * 7);
        highlights.push(`Matches skills: ${matchedSkills.slice(0, 3).join(", ")}`);
    } else if (extracted.length > 0) {
        score += Math.min(10, extracted.length * 3);
    }

    // 3. Freshness / Recency Decay Bonus (0 - 20 pts)
    const days = daysSincePosted(job.postedAt);
    if (days !== null) {
        if (days <= 1) {
            score += 20;
            highlights.push("⚡ Fresh: Posted in last 24h");
        } else if (days <= 3) {
            score += 15;
            highlights.push("Posted in last 3 days");
        } else if (days <= 7) {
            score += 10;
        } else if (days <= 14) {
            score += 5;
        }
    }

    // 4. Job Trust Score™ Integrity (0 - 15 pts)
    const trust = calculateJobTrustScore({
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        postedAt: job.postedAt,
        applicationLink: job.applicationLink,
    });

    if (trust.score >= 90) {
        score += 15;
        highlights.push(`🛡️ Elite Trust Score (${trust.score}/100)`);
    } else if (trust.score >= 80) {
        score += 10;
        highlights.push(`Verified listing (${trust.score}/100)`);
    } else if (trust.score >= 70) {
        score += 5;
    }

    // 5. Experience Level Alignment (±10 pts)
    if (params.experience && params.experience !== "all") {
        const detected = detectExperienceTier(combinedText);
        if (params.experience === detected) {
            score += 15;
            highlights.push(`Matches ${params.experience} experience target`);
        } else if (params.experience === "fresher" && detected === "senior") {
            score -= 30; // Strong penalty: freshers shouldn't see senior director jobs
        } else if (params.experience === "senior" && detected === "fresher") {
            score -= 20;
        }
    }

    // 6. Work Mode Alignment
    const isRemote = isRemoteJob(job);
    if (params.workMode === "remote") {
        if (isRemote) {
            score += 15;
            highlights.push("🌍 100% Remote flexibility");
        } else {
            score -= 40;
        }
    } else if (isRemote) {
        score += 5;
    }

    // Direct ATS bonus
    if (/greenhouse\.io|lever\.co|workday\.com|ashbyhq\.com|smartrecruiters/i.test(job.applicationLink)) {
        score += 8;
        highlights.push("Direct ATS Application");
    }

    // Cap between 15 and 99
    const finalScore = Math.min(99, Math.max(15, Math.round(score)));

    return {
        score: finalScore,
        matchedSkills: extracted,
        highlights: Array.from(new Set(highlights)).slice(0, 4),
    };
}

/* ────────────────────────── DecaRank Main Function ──────────────────────── */

/**
 * Searches and ranks jobs using the DecaRank-10 algorithm.
 * Guarantees a diverse, highest-quality Top 10 while retaining the full ranked list.
 */
export function searchAndRankJobs(
    allJobs: ExternalJob[],
    params: DecaSearchParams = {}
): DecaSearchResult {
    const experience = params.experience ?? "all";
    const workMode = params.workMode ?? "all";
    const category = params.category ?? "all";
    const location = (params.location ?? "all").toLowerCase().trim();
    const sort = params.sort ?? "decarank";
    const rawQuery = (params.query ?? "").trim();

    // Step 1: Pre-filter invalid/scam jobs
    let filtered = allJobs.filter((job) => isGenuineJob(job) && isJobFresh(job, 30));

    // Step 2: Apply Hard Filters
    if (workMode === "remote") {
        filtered = filtered.filter((j) => isRemoteJob(j));
    } else if (workMode === "onsite") {
        filtered = filtered.filter((j) => !isRemoteJob(j));
    }

    if (experience !== "all") {
        filtered = filtered.filter((j) => {
            const tier = detectExperienceTier(`${j.title} ${j.description}`);
            if (experience === "fresher") return tier === "fresher" || tier === "mid";
            if (experience === "senior") return tier === "senior";
            return tier === "mid" || tier === "fresher";
        });
    }

    if (location !== "all" && location.length > 0) {
        filtered = filtered.filter((j) =>
            j.location.toLowerCase().includes(location)
        );
    }

    if (category !== "all" && category.length > 0) {
        filtered = filtered.filter((j) => {
            const text = `${j.title} ${j.description}`.toLowerCase();
            if (category === "software") return /software|developer|engineer|frontend|backend|fullstack|react|python|node|go|java/i.test(text);
            if (category === "data") return /data|analyst|analytics|scientist|sql|machine learning|ai|bi/i.test(text);
            if (category === "design") return /design|ui|ux|figma|product design/i.test(text);
            if (category === "devops") return /devops|cloud|aws|kubernetes|docker|infrastructure/i.test(text);
            if (category === "product") return /product manager|product management|scrum|agile|roadmap/i.test(text);
            return true;
        });
    }

    // Step 3: Score each remaining job
    const scoredList: {
        job: ExternalJob;
        score: number;
        matchedSkills: string[];
        highlights: string[];
    }[] = filtered.map((job) => {
        const { score, matchedSkills, highlights } = scoreJob(job, params);
        return { job, score, matchedSkills, highlights };
    });

    // Step 4: Sort
    if (sort === "newest") {
        scoredList.sort((a, b) => {
            const ta = new Date(a.job.postedAt).getTime() || 0;
            const tb = new Date(b.job.postedAt).getTime() || 0;
            return tb - ta;
        });
    } else if (sort === "trust") {
        scoredList.sort((a, b) => {
            const ta = calculateJobTrustScore({
                title: a.job.title,
                company: a.job.company,
                description: a.job.description,
                location: a.job.location,
                postedAt: a.job.postedAt,
                applicationLink: a.job.applicationLink,
            }).score;
            const tb = calculateJobTrustScore({
                title: b.job.title,
                company: b.job.company,
                description: b.job.description,
                location: b.job.location,
                postedAt: b.job.postedAt,
                applicationLink: b.job.applicationLink,
            }).score;
            return tb - ta;
        });
    } else {
        // Default DecaRank
        scoredList.sort((a, b) => b.score - a.score);
    }

    // Step 5: Enforce DecaDiversity for the Top 10
    // Max 2 jobs per company in the Top 10 so a single aggregator doesn't flood the curated list
    const top10: RankedJob[] = [];
    const companyCounts = new Map<string, number>();
    const usedIds = new Set<string>();

    for (const item of scoredList) {
        const comp = item.job.company.toLowerCase().trim();
        const currentCount = companyCounts.get(comp) ?? 0;

        if (currentCount < 2) {
            companyCounts.set(comp, currentCount + 1);
            usedIds.add(item.job.id);
            top10.push({
                job: item.job,
                rank: top10.length + 1,
                score: item.score,
                matchedSkills: item.matchedSkills,
                matchHighlights: item.highlights,
                isTop10: true,
            });
        }

        if (top10.length === 10) break;
    }

    // If fewer than 10 unique, fill with remaining scored jobs
    if (top10.length < 10) {
        for (const item of scoredList) {
            if (!usedIds.has(item.job.id)) {
                usedIds.add(item.job.id);
                top10.push({
                    job: item.job,
                    rank: top10.length + 1,
                    score: item.score,
                    matchedSkills: item.matchedSkills,
                    matchHighlights: item.highlights,
                    isTop10: true,
                });
            }
            if (top10.length === 10) break;
        }
    }

    // Map all results with rank numbers
    const allRanked: RankedJob[] = scoredList.map((item, idx) => ({
        job: item.job,
        rank: idx + 1,
        score: item.score,
        matchedSkills: item.matchedSkills,
        matchHighlights: item.highlights,
        isTop10: idx < 10,
    }));

    return {
        top10,
        allResults: allRanked,
        totalCount: allRanked.length,
        query: rawQuery,
        activeFilters: {
            experience,
            workMode,
            category,
            location: params.location ?? "all",
            sort,
        },
    };
}
