import { describe, it, expect } from "vitest";
import {
  scoreTitleMatch,
  scoreSkillMatch,
  scoreLocationMatch,
  scoreDescriptionMatch,
} from "./scorer";

describe("scoreTitleMatch", () => {
  it("returns 0 for empty candidate titles", () => {
    expect(scoreTitleMatch([], "Software Engineer")).toBe(0);
  });

  it("returns 0 for empty job title", () => {
    expect(scoreTitleMatch(["Software Engineer"], "")).toBe(0);
  });

  it("returns max score (40) for exact title match", () => {
    const score = scoreTitleMatch(
      ["Software Engineer"],
      "Software Engineer"
    );
    expect(score).toBe(40);
  });

  it("uses best match among multiple candidate titles", () => {
    const score = scoreTitleMatch(
      ["Data Analyst", "Software Engineer"],
      "Software Engineer"
    );
    expect(score).toBe(40);
  });

  it("returns partial score for partial overlap", () => {
    // "Senior Software Engineer" tokens: [senior, software, engineer]
    // Job title "Software Engineer" tokens: [software, engineer]
    // Overlap: 2/3 of candidate tokens found in job title
    const score = scoreTitleMatch(
      ["Senior Software Engineer"],
      "Software Engineer"
    );
    expect(score).toBeCloseTo((2 / 3) * 40, 1);
  });

  it("is case-insensitive", () => {
    const score = scoreTitleMatch(
      ["SOFTWARE ENGINEER"],
      "software engineer"
    );
    expect(score).toBe(40);
  });

  it("returns score clamped to 40 max", () => {
    const score = scoreTitleMatch(["Engineer"], "Engineer");
    expect(score).toBeLessThanOrEqual(40);
  });
});

describe("scoreSkillMatch", () => {
  it("returns 0 for empty candidate skills", () => {
    expect(scoreSkillMatch([], "Engineer", "Build things")).toBe(0);
  });

  it("returns 0 when no skills match", () => {
    const score = scoreSkillMatch(
      ["Python", "Django"],
      "Accountant",
      "Managing financial records and preparing tax returns"
    );
    expect(score).toBe(0);
  });

  it("returns max score when all skills match", () => {
    const score = scoreSkillMatch(
      ["React", "TypeScript"],
      "React Developer",
      "Must know TypeScript and React"
    );
    expect(score).toBe(35);
  });

  it("returns partial score for partial skill match", () => {
    const score = scoreSkillMatch(
      ["React", "TypeScript", "Python", "Go"],
      "React Developer",
      "Must know TypeScript and React"
    );
    // 2 out of 4 skills match (React, TypeScript)
    expect(score).toBeCloseTo((2 / 4) * 35, 1);
  });

  it("checks skills against both title and description", () => {
    const score = scoreSkillMatch(
      ["React"],
      "React Developer",
      "No relevant keywords here"
    );
    // React appears in title, so it matches
    expect(score).toBe(35);
  });

  it("is case-insensitive", () => {
    const score = scoreSkillMatch(
      ["REACT"],
      "react developer",
      "uses react"
    );
    expect(score).toBe(35);
  });
});

describe("scoreLocationMatch", () => {
  it("returns 15 for remote job location", () => {
    expect(scoreLocationMatch("New York, NY", "Remote")).toBe(15);
  });

  it("returns 15 for remote (case-insensitive)", () => {
    expect(scoreLocationMatch("San Francisco", "REMOTE")).toBe(15);
    expect(scoreLocationMatch("San Francisco", "remote")).toBe(15);
  });

  it("returns 15 for exact location match", () => {
    expect(scoreLocationMatch("New York, NY", "New York, NY")).toBe(15);
  });

  it("returns 15 for case-insensitive exact match", () => {
    expect(scoreLocationMatch("new york, ny", "New York, NY")).toBe(15);
  });

  it("returns 0 for non-matching locations", () => {
    expect(scoreLocationMatch("New York, NY", "San Francisco, CA")).toBe(0);
  });

  it("handles whitespace trimming", () => {
    expect(scoreLocationMatch("  New York, NY  ", "  New York, NY  ")).toBe(15);
  });

  it("returns 15 when candidate is remote and job is remote", () => {
    expect(scoreLocationMatch("Remote", "Remote")).toBe(15);
  });
});

describe("scoreDescriptionMatch", () => {
  it("returns 0 for empty candidate keywords", () => {
    expect(scoreDescriptionMatch([], "Some job description text")).toBe(0);
  });

  it("returns 0 for empty job description", () => {
    expect(scoreDescriptionMatch(["react", "node"], "")).toBe(0);
  });

  it("returns max score when all keywords found in description", () => {
    const score = scoreDescriptionMatch(
      ["react", "typescript"],
      "We use react and typescript daily in our development work"
    );
    expect(score).toBe(10);
  });

  it("returns partial score for partial keyword match", () => {
    const score = scoreDescriptionMatch(
      ["react", "typescript", "python", "go"],
      "We use react and typescript in our projects"
    );
    // 2 out of 4 keywords match
    expect(score).toBeCloseTo((2 / 4) * 10, 1);
  });

  it("deduplicates candidate keywords", () => {
    const score = scoreDescriptionMatch(
      ["react", "react", "react"],
      "We use react daily"
    );
    // Even though "react" appears 3 times, it's deduplicated to 1 unique keyword
    expect(score).toBe(10);
  });

  it("is clamped to max of 10", () => {
    const score = scoreDescriptionMatch(
      ["react"],
      "react react react react"
    );
    expect(score).toBeLessThanOrEqual(10);
  });
});
