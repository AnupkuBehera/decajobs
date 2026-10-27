import { describe, it, expect, vi, beforeEach } from "vitest";
import JobDetailPage, { generateMetadata } from "./page";

// Mock next/navigation
const mockPermanentRedirect = vi.fn();
vi.mock("next/navigation", () => ({
    permanentRedirect: (url: string) => {
        mockPermanentRedirect(url);
        throw new Error(`NEXT_REDIRECT: ${url}`);
    },
}));

// Mock public jobs
vi.mock("@/lib/public-jobs", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/public-jobs")>();
    return {
        ...actual,
        getPublicJobs: vi.fn().mockResolvedValue([
            {
                id: "live-job-1",
                title: "Senior Full Stack Engineer",
                company: "Acme Corp",
                location: "Remote, US",
                description: "Building modern full-stack web applications with React and TypeScript.",
                salary: "$150,000 - $180,000",
                applicationLink: "https://example.com/apply/1",
                postedAt: new Date().toISOString(),
                source: "greenhouse",
            },
        ]),
        jobSlug: (job: any) =>
            `${job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${job.company.toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
    };
});

describe("Jobs Detail Page - Expired Job Redirection (GSC Fix)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("triggers permanentRedirect to devops-cloud category for expired kubernetes job slug in generateMetadata", async () => {
        await expect(
            generateMetadata({
                params: Promise.resolve({
                    slug: "manager-ii-engineering-kubernetes-platform-erest8139439",
                }),
            })
        ).rejects.toThrow("NEXT_REDIRECT: /jobs/category/devops-cloud");

        expect(mockPermanentRedirect).toHaveBeenCalledWith("/jobs/category/devops-cloud");
    });

    it("triggers permanentRedirect to devops-cloud category for expired kubernetes job slug in JobDetailPage", async () => {
        await expect(
            JobDetailPage({
                params: Promise.resolve({
                    slug: "manager-ii-engineering-kubernetes-platform-erest8139439",
                }),
            })
        ).rejects.toThrow("NEXT_REDIRECT: /jobs/category/devops-cloud");

        expect(mockPermanentRedirect).toHaveBeenCalledWith("/jobs/category/devops-cloud");
    });

    it("triggers permanentRedirect to marketing-sales for expired sales job slug", async () => {
        await expect(
            generateMetadata({
                params: Promise.resolve({
                    slug: "senior-named-account-executive-saudi-arabia-flare8258771",
                }),
            })
        ).rejects.toThrow("NEXT_REDIRECT: /jobs/category/marketing-sales");

        expect(mockPermanentRedirect).toHaveBeenCalledWith("/jobs/category/marketing-sales");
    });

    it("triggers permanentRedirect to product-design for expired product manager job slug", async () => {
        await expect(
            generateMetadata({
                params: Promise.resolve({
                    slug: "staff-product-manager-sail-core-tripe7913698",
                }),
            })
        ).rejects.toThrow("NEXT_REDIRECT: /jobs/category/product-design");

        expect(mockPermanentRedirect).toHaveBeenCalledWith("/jobs/category/product-design");
    });

    it("triggers permanentRedirect to data-analytics for expired data engineer job slug", async () => {
        await expect(
            generateMetadata({
                params: Promise.resolve({
                    slug: "senior-data-engineer-payments-irbnb8300926",
                }),
            })
        ).rejects.toThrow("NEXT_REDIRECT: /jobs/category/data-analytics");

        expect(mockPermanentRedirect).toHaveBeenCalledWith("/jobs/category/data-analytics");
    });

    it("returns active indexable metadata without redirect for a live job", async () => {
        const metadata = await generateMetadata({
            params: Promise.resolve({
                slug: "senior-full-stack-engineer-acmecorp",
            }),
        });

        expect(mockPermanentRedirect).not.toHaveBeenCalled();
        expect(metadata.robots).toEqual(
            expect.objectContaining({
                index: true,
                follow: true,
            })
        );
        expect(metadata.title).toContain("Senior Full Stack Engineer");
    });
});
