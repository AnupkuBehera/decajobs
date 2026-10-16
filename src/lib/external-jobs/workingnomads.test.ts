import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWorkingNomadsJobs } from "./workingnomads";

describe("Working Nomads Remote Jobs Connector", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes Working Nomads JSON response into ExternalJob objects", async () => {
    const mockResponse = [
      {
        url: "https://www.workingnomads.com/jobs/senior-full-stack-engineer-techcorp",
        title: "Senior Full Stack Engineer",
        description: "<p>We are seeking a <strong>Full Stack Engineer</strong> proficient in TypeScript and React.</p>",
        company_name: "TechCorp Global",
        category_name: "Development",
        tags: "react, typescript, node",
        location: "Remote Worldwide",
        pub_date: "2026-10-10T12:00:00Z",
      },
      {
        url: "https://www.workingnomads.com/jobs/lead-devops-engineer-cloudworks",
        title: "Lead DevOps Engineer",
        description: "<p>Manage Kubernetes clusters on AWS and Terraform pipelines.</p>",
        company_name: "CloudWorks Inc",
        category_name: "DevOps",
        tags: "aws, kubernetes",
        location: "Remote US/EU",
        pub_date: "2026-10-11T09:00:00Z",
      },
    ];

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const jobs = await fetchWorkingNomadsJobs("React");
    expect(jobs).toHaveLength(1);

    const first = jobs[0]!;
    expect(first).toBeDefined();
    expect(first.title).toBe("Senior Full Stack Engineer");
    expect(first.company).toBe("TechCorp Global");
    expect(first.source).toBe("working_nomads");
    expect(first.location).toBe("Remote Worldwide");
    expect(first.description).toContain("Full Stack Engineer proficient in TypeScript");
    expect(first.applicationLink).toBe("https://www.workingnomads.com/jobs/senior-full-stack-engineer-techcorp");
  });

  it("handles network errors or aborts safely without crashing", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network timeout"));

    const jobs = await fetchWorkingNomadsJobs("developer");
    expect(jobs).toEqual([]);
  });
});
