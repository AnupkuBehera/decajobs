import { describe, it, expect } from "vitest";
import { searchAndRankJobs, detectExperienceTier, scoreJob } from "./decarank";
import { SAMPLE_JOBS } from "@/lib/public-jobs";
import type { ExternalJob } from "@/lib/external-jobs/types";

describe("DecaRank-10 Search & Ranking Engine", () => {
    describe("detectExperienceTier", () => {
        it("should detect fresher roles correctly", () => {
            expect(detectExperienceTier("Junior React Developer")).toBe("fresher");
            expect(detectExperienceTier("Graduate SDE-1 Intern")).toBe("fresher");
            expect(detectExperienceTier("Fresher Software Engineer")).toBe("fresher");
        });

        it("should detect senior roles correctly", () => {
            expect(detectExperienceTier("Senior Backend Engineer")).toBe("senior");
            expect(detectExperienceTier("Principal Software Architect")).toBe("senior");
            expect(detectExperienceTier("Lead DevOps Engineer (7+ yrs)")).toBe("senior");
        });

        it("should detect mid roles by default", () => {
            expect(detectExperienceTier("Software Engineer (Python)")).toBe("mid");
        });
    });

    describe("scoreJob", () => {
        const mockJob: ExternalJob = {
            id: "test-react-job",
            title: "Frontend Developer (React & Next.js)",
            company: "Acme Cloud",
            description: "We are seeking a React developer proficient in TypeScript, Tailwind CSS, and API integration. Full-time position.",
            location: "Remote",
            applicationLink: "https://boards.greenhouse.io/acme/jobs/123",
            postedAt: new Date().toISOString(),
            source: "sample",
        };

        it("should assign high score for exact query matches", () => {
            const result = scoreJob(mockJob, { query: "React" });
            expect(result.score).toBeGreaterThanOrEqual(80);
            expect(result.highlights.length).toBeGreaterThan(0);
        });

        it("should grant freshness and ATS bonuses", () => {
            const result = scoreJob(mockJob, {});
            expect(result.highlights.some((h) => h.includes("Fresh"))).toBe(true);
            expect(result.highlights.some((h) => h.includes("ATS"))).toBe(true);
        });
    });

    describe("searchAndRankJobs", () => {
        it("should return exactly up to 10 jobs in top10 array", () => {
            const result = searchAndRankJobs(SAMPLE_JOBS, {});
            expect(result.top10.length).toBeLessThanOrEqual(10);
            expect(result.top10.length).toBeGreaterThanOrEqual(1);
            expect(result.top10[0].rank).toBe(1);
            expect(result.top10[0].isTop10).toBe(true);
        });

        it("should rank relevant query results at the very top", () => {
            const result = searchAndRankJobs(SAMPLE_JOBS, { query: "Frontend React" });
            expect(result.top10[0].job.title.toLowerCase()).toContain("frontend");
            expect(result.top10[0].score).toBeGreaterThanOrEqual(80);
        });

        it("should enforce DecaDiversity with max 2 jobs per company in Top 10", () => {
            // Create mock with 5 jobs from the same company
            const repeatedJobs: ExternalJob[] = Array.from({ length: 6 }).map((_, i) => ({
                id: `dup-${i}`,
                title: `Developer ${i}`,
                company: "SuperCorp",
                description: "Engineering job with React and Node.js",
                location: "Remote",
                applicationLink: "https://example.com/apply",
                postedAt: new Date().toISOString(),
                source: "sample",
            }));

            // Plus other companies
            const otherJobs: ExternalJob[] = [
                {
                    id: "other-1",
                    title: "Developer at OtherCorp",
                    company: "OtherCorp",
                    description: "Engineering job with React",
                    location: "Remote",
                    applicationLink: "https://example.com/apply",
                    postedAt: new Date().toISOString(),
                    source: "sample",
                },
                {
                    id: "other-2",
                    title: "Developer at ThirdCorp",
                    company: "ThirdCorp",
                    description: "Engineering job with React",
                    location: "Remote",
                    applicationLink: "https://example.com/apply",
                    postedAt: new Date().toISOString(),
                    source: "sample",
                },
            ];

            const result = searchAndRankJobs([...repeatedJobs, ...otherJobs], { query: "Developer" });
            const superCorpInTop10 = result.top10.filter((r) => r.job.company === "SuperCorp");
            expect(superCorpInTop10.length).toBeLessThanOrEqual(2);
        });
    });
});
