import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchJobicyJobs } from "./jobicy";

describe("Jobicy Remote Jobs Connector", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes Jobicy API response into ExternalJob objects", async () => {
    const mockResponse = {
      apiVersion: "2.0",
      jobCount: 2,
      jobs: [
        {
          id: 101,
          url: "https://jobicy.com/jobs/101-frontend-engineer",
          jobSlug: "101-frontend-engineer",
          jobTitle: "Senior React Developer",
          companyName: "CloudScale Inc",
          jobDescription: "<p>Build high-performance web applications using Next.js and Tailwind.</p>",
          jobGeo: "Anywhere",
          pubDate: "2026-10-04T12:00:00Z",
          annualSalaryMin: 120000,
          annualSalaryMax: 150000,
          salaryCurrency: "USD",
        },
        {
          id: 102,
          url: "https://jobicy.com/jobs/102-python-engineer",
          jobSlug: "102-python-engineer",
          jobTitle: "Python Backend Architect",
          companyName: "DataFlow Labs",
          jobDescription: "<p>Design distributed microservices with FastAPI and PostgreSQL.</p>",
          jobGeo: "Europe",
          pubDate: "2026-10-03T09:00:00Z",
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockResponse),
    } as any);

    const jobs = await fetchJobicyJobs("react");
    expect(jobs).toHaveLength(2);

    const first = jobs[0];
    expect(first.id).toBe("jobicy_101");
    expect(first.title).toBe("Senior React Developer");
    expect(first.company).toBe("CloudScale Inc");
    expect(first.source).toBe("jobicy");
    expect(first.location).toBe("Remote (Anywhere)");
    expect(first.description).toContain("120,000");
    expect(first.applicationLink).toBe("https://jobicy.com/jobs/101-frontend-engineer");
  });

  it("handles HTTP errors gracefully and returns empty array", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    const jobs = await fetchJobicyJobs("failing-query");
    expect(jobs).toEqual([]);
  });
});
