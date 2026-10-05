import { describe, it, expect } from "vitest";
import { fetchAdzunaJobs } from "./adzuna";

describe("Adzuna Job Connector", () => {
  it("fetches UK jobs with normalized ExternalJob structure and fallback coverage", async () => {
    const jobs = await fetchAdzunaJobs("Software Engineer", "London", "gb");
    expect(jobs.length).toBeGreaterThan(0);

    const firstJob = jobs[0];
    expect(firstJob).toHaveProperty("id");
    expect(firstJob).toHaveProperty("title");
    expect(firstJob).toHaveProperty("company");
    expect(firstJob).toHaveProperty("location");
    expect(firstJob).toHaveProperty("applicationLink");
    expect(firstJob).toHaveProperty("source");
    expect(firstJob.location.toLowerCase()).toContain("uk");
  });

  it("handles alternative countries like Canada and Australia gracefully", async () => {
    const caJobs = await fetchAdzunaJobs("Data Analyst", "Toronto", "ca");
    expect(caJobs.length).toBeGreaterThan(0);
  });

  it("accurately resolves country codes from location strings", async () => {
    const { resolveAdzunaCountry } = await import("./adzuna");
    expect(resolveAdzunaCountry("Bangalore, India")).toBe("in");
    expect(resolveAdzunaCountry("Hyderabad")).toBe("in");
    expect(resolveAdzunaCountry("Pune, Maharashtra")).toBe("in");
    expect(resolveAdzunaCountry("San Francisco, CA")).toBe("us");
    expect(resolveAdzunaCountry("New York, USA")).toBe("us");
    expect(resolveAdzunaCountry("London, UK")).toBe("gb");
    expect(resolveAdzunaCountry("Toronto, Canada")).toBe("ca");
    expect(resolveAdzunaCountry("Sydney, Australia")).toBe("au");
    expect(resolveAdzunaCountry("Johannesburg")).toBe("za");
    expect(resolveAdzunaCountry("Remote")).toBe("gb");
  });
});
