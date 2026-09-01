import { describe, it, expect } from "vitest";
import {
    isGenuineJob,
    isJobFresh,
    extractSkillsFromJob,
    getCuratedTop10Jobs,
    COMPANIES,
    getCompanyBySlug,
    jobMatchesCompany,
    SAMPLE_JOBS,
} from "./public-jobs";
import type { ExternalJob } from "./external-jobs/types";

describe("Public Jobs Quality & Anti-Scam Engine", () => {
    describe("isGenuineJob", () => {
        it("should accept valid real job postings", () => {
            const validJob: Partial<ExternalJob> = {
                title: "Senior Full Stack Engineer",
                company: "TechNova",
                description:
                    "We are seeking a Senior Full Stack Engineer to lead our web team. Proficient in React, Node.js, and cloud deployments. Full-time position with competitive benefits.",
                applicationLink: "https://example.com/apply/123",
            };
            expect(isGenuineJob(validJob)).toBe(true);
        });

        it("should reject scam job with telegram link", () => {
            const scamJob: Partial<ExternalJob> = {
                title: "Data Entry Operator",
                company: "Global Services",
                description:
                    "Earn $500 daily. Easy copy paste work. Contact on telegram: t.me/fastmoneyjob for immediate joining.",
                applicationLink: "https://example.com/apply",
            };
            expect(isGenuineJob(scamJob)).toBe(false);
        });

        it("should reject scam job with registration fee or security deposit", () => {
            const feeJob: Partial<ExternalJob> = {
                title: "Typing Executive",
                company: "Home Work Ltd",
                description:
                    "Online typing work from home. Requires a small registration fee of 500 INR before task allocation.",
                applicationLink: "https://example.com/apply",
            };
            expect(isGenuineJob(feeJob)).toBe(false);
        });

        it("should reject jobs with invalid or non-http links", () => {
            const invalidLinkJob: Partial<ExternalJob> = {
                title: "Frontend Developer",
                company: "Valid Co",
                description:
                    "We are hiring a Frontend Developer with React experience to build clean and responsive UI components.",
                applicationLink: "javascript:void(0)",
            };
            expect(isGenuineJob(invalidLinkJob)).toBe(false);
        });
    });

    describe("isJobFresh", () => {
        it("should return true for jobs posted within 14 days", () => {
            const freshJob = { postedAt: new Date(Date.now() - 3 * 86400000).toISOString() };
            expect(isJobFresh(freshJob, 14)).toBe(true);
        });

        it("should return false for expired jobs older than 30 days", () => {
            const oldJob = { postedAt: new Date(Date.now() - 45 * 86400000).toISOString() };
            expect(isJobFresh(oldJob, 30)).toBe(false);
        });
    });

    describe("extractSkillsFromJob", () => {
        it("should extract matching tech skills accurately", () => {
            const text = "We need an engineer experienced with TypeScript, React, Python, PostgreSQL and Docker.";
            const skills = extractSkillsFromJob(text);
            expect(skills).toContain("TypeScript");
            expect(skills).toContain("React");
            expect(skills).toContain("Python");
            expect(skills).toContain("PostgreSQL");
            expect(skills).toContain("Docker");
        });
    });

    describe("getCuratedTop10Jobs", () => {
        it("should return top 10 unique, scored jobs from sample dataset", () => {
            const top10 = getCuratedTop10Jobs(SAMPLE_JOBS);
            expect(top10.length).toBeLessThanOrEqual(10);
            expect(top10.length).toBeGreaterThan(0);
            // Every job in top10 must be genuine
            for (const job of top10) {
                expect(isGenuineJob(job)).toBe(true);
            }
        });
    });

    describe("Company Career Hubs", () => {
        it("should contain 12 top tech employers with complete profiles", () => {
            expect(COMPANIES.length).toBe(12);
            for (const c of COMPANIES) {
                expect(c.slug).toBeTruthy();
                expect(c.name).toBeTruthy();
                expect(c.hq).toBeTruthy();
                expect(c.industry).toBeTruthy();
                expect(c.salaryInsight).toBeTruthy();
                expect(c.techStack.length).toBeGreaterThan(0);
                expect(c.faqs.length).toBeGreaterThan(0);
            }
        });

        it("should find company by slug", () => {
            const google = getCompanyBySlug("google");
            expect(google).toBeDefined();
            expect(google?.name).toBe("Google");

            const stripe = getCompanyBySlug("stripe");
            expect(stripe).toBeDefined();
            expect(stripe?.name).toBe("Stripe");
        });

        it("should match jobs to companies accurately", () => {
            const google = getCompanyBySlug("google")!;
            const googleJob = {
                title: "Software Engineer III",
                company: "Google Cloud LLC",
            } as ExternalJob;
            expect(jobMatchesCompany(googleJob, google)).toBe(true);

            const otherJob = {
                title: "Frontend Developer",
                company: "Acme Startups",
            } as ExternalJob;
            expect(jobMatchesCompany(otherJob, google)).toBe(false);
        });
    });
});
