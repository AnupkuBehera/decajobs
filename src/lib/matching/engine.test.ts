import { describe, it, expect } from "vitest";
import { calculateMatchScore, rankJobs } from "./engine";
import type { CandidateProfile, JobListing } from "./types";

describe("calculateMatchScore", () => {
  const candidate: CandidateProfile = {
    targetTitles: ["Software Engineer"],
    skills: ["TypeScript", "React", "Node"],
    location: "San Francisco, CA",
  };

  it("returns a MatchResult with jobListingId, score, and breakdown", () => {
    const job: JobListing = {
      id: "job-1",
      title: "Software Engineer",
      description:
        "We are looking for a software engineer with experience in TypeScript and React to build modern web applications.",
      location: "San Francisco, CA",
    };

    const result = calculateMatchScore(candidate, job);

    expect(result).toHaveProperty("jobListingId", "job-1");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("breakdown");
    expect(result.breakdown).toHaveProperty("titleScore");
    expect(result.breakdown).toHaveProperty("skillScore");
    expect(result.breakdown).toHaveProperty("locationScore");
    expect(result.breakdown).toHaveProperty("descriptionScore");
  });

  it("caps score at 100", () => {
    // A highly matching job should still not exceed 100
    const job: JobListing = {
      id: "job-2",
      title: "Software Engineer",
      description:
        "TypeScript React Node software engineer building modern applications with TypeScript and React and Node frameworks",
      location: "San Francisco, CA",
    };

    const result = calculateMatchScore(candidate, job);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("returns score of 0 for completely unrelated job", () => {
    const job: JobListing = {
      id: "job-3",
      title: "Pastry Chef",
      description:
        "We need an experienced pastry chef to create artisan breads and desserts for our bakery location in rural Montana",
      location: "Billings, MT",
    };

    const result = calculateMatchScore(candidate, job);
    expect(result.score).toBe(0);
  });

  it("includes location score when location matches", () => {
    const job: JobListing = {
      id: "job-4",
      title: "Marketing Manager",
      description:
        "Looking for a marketing manager to lead our advertising campaigns across multiple channels and platforms",
      location: "San Francisco, CA",
    };

    const result = calculateMatchScore(candidate, job);
    expect(result.breakdown.locationScore).toBe(15);
  });

  it("gives location score of 15 for remote jobs", () => {
    const job: JobListing = {
      id: "job-5",
      title: "Backend Developer",
      description:
        "Remote backend developer position working with distributed systems and cloud infrastructure",
      location: "Remote",
    };

    const result = calculateMatchScore(candidate, job);
    expect(result.breakdown.locationScore).toBe(15);
  });

  it("sums all component scores correctly", () => {
    const job: JobListing = {
      id: "job-6",
      title: "Software Engineer",
      description:
        "TypeScript React Node developer needed for building scalable web applications in our engineering team",
      location: "San Francisco, CA",
    };

    const result = calculateMatchScore(candidate, job);
    const expectedRaw =
      result.breakdown.titleScore +
      result.breakdown.skillScore +
      result.breakdown.locationScore +
      result.breakdown.descriptionScore;

    expect(result.score).toBe(Math.min(Math.round(expectedRaw), 100));
  });
});

describe("rankJobs", () => {
  const candidate: CandidateProfile = {
    targetTitles: ["Frontend Developer"],
    skills: ["React", "TypeScript", "CSS"],
    location: "New York, NY",
  };

  it("returns results sorted by score descending", () => {
    const jobs: JobListing[] = [
      {
        id: "low-match",
        title: "Data Scientist",
        description:
          "Looking for a data scientist with experience in machine learning and Python to analyze large datasets",
        location: "Chicago, IL",
      },
      {
        id: "high-match",
        title: "Frontend Developer",
        description:
          "We need a frontend developer with React and TypeScript skills to build beautiful user interfaces with CSS",
        location: "New York, NY",
      },
      {
        id: "mid-match",
        title: "Full Stack Engineer",
        description:
          "Full stack engineer with React and TypeScript experience needed for our platform development team",
        location: "Remote",
      },
    ];

    const results = rankJobs(candidate, jobs);

    expect(results).toHaveLength(3);
    expect(results[0]!.jobListingId).toBe("high-match");
    // Scores should be in descending order
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score);
    }
  });

  it("returns empty array for empty jobs list", () => {
    const results = rankJobs(candidate, []);
    expect(results).toHaveLength(0);
  });

  it("returns single result for single job", () => {
    const jobs: JobListing[] = [
      {
        id: "only-job",
        title: "Frontend Developer",
        description:
          "Frontend developer position requiring React TypeScript and CSS skills for modern web applications",
        location: "New York, NY",
      },
    ];

    const results = rankJobs(candidate, jobs);
    expect(results).toHaveLength(1);
    expect(results[0]!.jobListingId).toBe("only-job");
  });

  it("handles jobs with equal scores", () => {
    const jobs: JobListing[] = [
      {
        id: "job-a",
        title: "Frontend Developer",
        description:
          "We need a frontend developer with React and TypeScript skills to build beautiful user interfaces with CSS",
        location: "New York, NY",
      },
      {
        id: "job-b",
        title: "Frontend Developer",
        description:
          "We need a frontend developer with React and TypeScript skills to build beautiful user interfaces with CSS",
        location: "New York, NY",
      },
    ];

    const results = rankJobs(candidate, jobs);
    expect(results).toHaveLength(2);
    expect(results[0]!.score).toBe(results[1]!.score);
  });
});
