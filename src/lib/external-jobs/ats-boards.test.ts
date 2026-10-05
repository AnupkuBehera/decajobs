import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchDirectAtsJobs } from "./ats-boards";

describe("Direct Primary ATS Aggregator", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and maps Greenhouse public boards to ExternalJob format", async () => {
    const mockGreenhouseResponse = {
      jobs: [
        {
          id: 501,
          title: "Full Stack Engineer, Developer Experience",
          absolute_url: "https://boards.greenhouse.io/vercel/jobs/501",
          location: { name: "Remote (Global)" },
          updated_at: "2026-10-04T08:00:00Z",
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockGreenhouseResponse,
    } as any);

    const jobs = await fetchDirectAtsJobs("developer");
    expect(jobs.length).toBeGreaterThan(0);

    const first = jobs[0];
    expect(first.id).toContain("gh_");
    expect(first.title).toBe("Full Stack Engineer, Developer Experience");
    expect(first.source).toBe("direct_ats");
    expect(first.applicationLink).toContain("greenhouse.io");
  });

  it("safely handles individual board failures without stopping execution", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Board offline"));

    const jobs = await fetchDirectAtsJobs("engineer");
    expect(jobs).toEqual([]);
  });
});
