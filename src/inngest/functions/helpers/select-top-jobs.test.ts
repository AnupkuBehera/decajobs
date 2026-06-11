import { describe, it, expect } from "vitest";
import { selectTopJobs, JobListingWithDate } from "./select-top-jobs";
import type { CandidateProfile } from "@/lib/matching/types";

/**
 * Helper to create a job listing with a date for testing.
 */
function createJob(
  id: string,
  title: string,
  location: string,
  createdAt: string = "2024-06-15T10:00:00Z"
): JobListingWithDate {
  return {
    id,
    title,
    description: "A detailed job description that is at least fifty characters long for testing purposes.",
    location,
    createdAt,
  };
}

/**
 * Helper to create a candidate profile.
 */
function createCandidate(overrides?: Partial<CandidateProfile>): CandidateProfile {
  return {
    targetTitles: ["Software Engineer"],
    skills: ["TypeScript", "React", "Node.js"],
    location: "San Francisco, CA",
    ...overrides,
  };
}

describe("selectTopJobs", () => {
  describe("basic top-10 selection", () => {
    it("returns top 10 job IDs when there are more than 10 eligible jobs", () => {
      const candidate = createCandidate();
      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 15 },
        (_, i) =>
          createJob(
            `job-${i + 1}`,
            i < 5 ? "Software Engineer" : "Marketing Manager",
            "San Francisco, CA",
            `2024-06-${String(15 - i).padStart(2, "0")}T10:00:00Z`
          )
      );

      const result = selectTopJobs(candidate, eligibleJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });

    it("returns exactly 10 job IDs when there are exactly 10 eligible jobs", () => {
      const candidate = createCandidate();
      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 10 },
        (_, i) =>
          createJob(
            `job-${i + 1}`,
            "Software Engineer",
            "San Francisco, CA"
          )
      );

      const result = selectTopJobs(candidate, eligibleJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });

    it("selects jobs ordered by match score (highest first)", () => {
      const candidate = createCandidate({
        targetTitles: ["Software Engineer"],
        skills: ["TypeScript", "React"],
        location: "San Francisco, CA",
      });

      // Create jobs with varying relevance
      const highMatchJob = createJob(
        "high-match",
        "Software Engineer",
        "San Francisco, CA"
      );
      const lowMatchJobs = Array.from({ length: 9 }, (_, i) =>
        createJob(`low-${i}`, "Janitor", "Remote")
      );

      const eligibleJobs = [...lowMatchJobs, highMatchJob];
      const result = selectTopJobs(candidate, eligibleJobs);

      expect(result).not.toBeNull();
      // The high-match job should be first due to scoring
      expect(result![0]).toBe("high-match");
    });
  });

  describe("fallback logic", () => {
    it("fills remaining slots with location-matching fallback jobs when fewer than 10 eligible", () => {
      const candidate = createCandidate({ location: "New York, NY" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 5 },
        (_, i) =>
          createJob(`eligible-${i}`, "Software Engineer", "New York, NY")
      );

      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        // Additional jobs matching location
        createJob("fallback-1", "Data Analyst", "New York, NY", "2024-06-14T10:00:00Z"),
        createJob("fallback-2", "Product Manager", "New York, NY", "2024-06-13T10:00:00Z"),
        createJob("fallback-3", "Designer", "New York, NY", "2024-06-12T10:00:00Z"),
        createJob("fallback-4", "QA Engineer", "New York, NY", "2024-06-11T10:00:00Z"),
        createJob("fallback-5", "DevOps", "New York, NY", "2024-06-10T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });

    it("fills remaining slots with Remote jobs as fallback", () => {
      const candidate = createCandidate({ location: "Portland, OR" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 5 },
        (_, i) =>
          createJob(`eligible-${i}`, "Engineer", "Portland, OR")
      );

      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("remote-1", "Remote Dev", "Remote", "2024-06-14T10:00:00Z"),
        createJob("remote-2", "Remote QA", "Remote", "2024-06-13T10:00:00Z"),
        createJob("remote-3", "Remote PM", "Remote", "2024-06-12T10:00:00Z"),
        createJob("remote-4", "Remote Design", "Remote", "2024-06-11T10:00:00Z"),
        createJob("remote-5", "Remote Data", "Remote", "2024-06-10T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });

    it("prefers newest fallback jobs first", () => {
      const candidate = createCandidate({ location: "Austin, TX" });

      // Only 8 eligible jobs
      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 8 },
        (_, i) =>
          createJob(`eligible-${i}`, "Engineer", "Austin, TX")
      );

      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("old-job", "Old Position", "Austin, TX", "2024-01-01T10:00:00Z"),
        createJob("new-job", "New Position", "Austin, TX", "2024-06-14T10:00:00Z"),
        createJob("mid-job", "Mid Position", "Austin, TX", "2024-03-15T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
      // The newest fallback jobs should be selected first
      expect(result).toContain("new-job");
      expect(result).toContain("mid-job");
      expect(result).not.toContain("old-job");
    });
  });

  describe("deduplication", () => {
    it("does not include duplicate job IDs in the result", () => {
      const candidate = createCandidate({ location: "Denver, CO" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 7 },
        (_, i) =>
          createJob(`job-${i}`, "Software Engineer", "Denver, CO")
      );

      // allActiveJobs contains some of the same jobs from eligibleJobs
      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("job-0", "Software Engineer", "Denver, CO", "2024-06-14T10:00:00Z"), // duplicate
        createJob("fallback-1", "New Role 1", "Denver, CO", "2024-06-14T10:00:00Z"),
        createJob("fallback-2", "New Role 2", "Denver, CO", "2024-06-13T10:00:00Z"),
        createJob("fallback-3", "New Role 3", "Denver, CO", "2024-06-12T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
      // Check no duplicates
      const uniqueIds = new Set(result);
      expect(uniqueIds.size).toBe(10);
    });
  });

  describe("skip candidate (return null)", () => {
    it("returns null when fewer than 10 total jobs are available", () => {
      const candidate = createCandidate({ location: "Nowhere, XX" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 5 },
        (_, i) =>
          createJob(`job-${i}`, "Engineer", "Nowhere, XX")
      );

      // No additional fallback jobs that match
      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("other-1", "Manager", "Boston, MA", "2024-06-14T10:00:00Z"),
        createJob("other-2", "Director", "Chicago, IL", "2024-06-13T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).toBeNull();
    });

    it("returns null when no eligible or fallback jobs exist", () => {
      const candidate = createCandidate();
      const result = selectTopJobs(candidate, [], []);
      expect(result).toBeNull();
    });

    it("returns null when eligible jobs are empty and fallback has fewer than 10 matching", () => {
      const candidate = createCandidate({ location: "Seattle, WA" });

      const allActiveJobs: JobListingWithDate[] = Array.from(
        { length: 5 },
        (_, i) =>
          createJob(`fallback-${i}`, "Role", "Seattle, WA", `2024-06-${10 + i}T10:00:00Z`)
      );

      const result = selectTopJobs(candidate, [], allActiveJobs);

      expect(result).toBeNull();
    });
  });

  describe("location matching", () => {
    it("performs case-insensitive location matching for fallback", () => {
      const candidate = createCandidate({ location: "new york, ny" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 7 },
        (_, i) =>
          createJob(`eligible-${i}`, "Engineer", "new york, ny")
      );

      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("upper-1", "Role 1", "New York, NY", "2024-06-14T10:00:00Z"),
        createJob("upper-2", "Role 2", "NEW YORK, NY", "2024-06-13T10:00:00Z"),
        createJob("upper-3", "Role 3", "New York, NY", "2024-06-12T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
      expect(result).toContain("upper-1");
      expect(result).toContain("upper-2");
      expect(result).toContain("upper-3");
    });

    it("includes Remote jobs in fallback regardless of candidate location", () => {
      const candidate = createCandidate({ location: "Rural Town, MT" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 6 },
        (_, i) =>
          createJob(`eligible-${i}`, "Engineer", "Rural Town, MT")
      );

      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("remote-1", "Remote Role 1", "Remote", "2024-06-14T10:00:00Z"),
        createJob("remote-2", "Remote Role 2", "remote", "2024-06-13T10:00:00Z"),
        createJob("remote-3", "Remote Role 3", "REMOTE", "2024-06-12T10:00:00Z"),
        createJob("remote-4", "Remote Role 4", "Remote", "2024-06-11T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });
  });

  describe("edge cases", () => {
    it("uses eligibleJobs as fallback pool when allActiveJobs is not provided", () => {
      const candidate = createCandidate({ location: "Miami, FL" });

      // All 10 jobs match location so they should all be selected
      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 10 },
        (_, i) =>
          createJob(`job-${i}`, "Various Role", "Miami, FL", `2024-06-${10 + i}T10:00:00Z`)
      );

      const result = selectTopJobs(candidate, eligibleJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });

    it("handles a mix of location-match and remote fallback jobs", () => {
      const candidate = createCandidate({ location: "Boston, MA" });

      const eligibleJobs: JobListingWithDate[] = Array.from(
        { length: 6 },
        (_, i) =>
          createJob(`eligible-${i}`, "Engineer", "Boston, MA")
      );

      const allActiveJobs: JobListingWithDate[] = [
        ...eligibleJobs,
        createJob("local-1", "Local Role", "Boston, MA", "2024-06-14T10:00:00Z"),
        createJob("remote-1", "Remote Role", "Remote", "2024-06-13T10:00:00Z"),
        createJob("local-2", "Another Local", "Boston, MA", "2024-06-12T10:00:00Z"),
        createJob("remote-2", "Another Remote", "Remote", "2024-06-11T10:00:00Z"),
      ];

      const result = selectTopJobs(candidate, eligibleJobs, allActiveJobs);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(10);
    });
  });
});
