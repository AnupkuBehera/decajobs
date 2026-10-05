import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchHimalayasJobs } from "./himalayas";

describe("Himalayas Remote Jobs Connector", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes Himalayas OpenAPI response into ExternalJob objects", async () => {
    const mockResponse = {
      jobs: [
        {
          id: "him-01",
          slug: "staff-platform-engineer",
          title: "Staff Platform Engineer",
          companyName: "Supabase",
          excerpt: "<p>Lead our multi-cloud Kubernetes infrastructure and Postgres orchestration.</p>",
          locationRestrictions: ["Worldwide", "India"],
          pubDate: "2026-10-04T10:00:00Z",
          url: "https://himalayas.app/companies/supabase/jobs/staff-platform-engineer",
          minSalary: 140000,
          maxSalary: 180000,
          currency: "USD",
          categories: ["Engineering", "DevOps"],
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockResponse),
    } as any);

    const jobs = await fetchHimalayasJobs("platform");
    expect(jobs).toHaveLength(1);

    const first = jobs[0];
    expect(first.id).toBe("himalayas_staff-platform-engineer");
    expect(first.title).toBe("Staff Platform Engineer");
    expect(first.company).toBe("Supabase");
    expect(first.source).toBe("himalayas");
    expect(first.location).toBe("Remote (Worldwide, India)");
    expect(first.description).toContain("140,000");
    expect(first.applicationLink).toContain("himalayas.app");
  });

  it("gracefully catches timeouts and network rejections", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network timeout"));

    const jobs = await fetchHimalayasJobs("engineer");
    expect(jobs).toEqual([]);
  });
});
