import { describe, it, expect } from "vitest";
import { tokenize, normalizeTokens, calculateOverlap } from "./tokenizer";

describe("tokenize", () => {
  it("splits text into lowercase words", () => {
    expect(tokenize("Hello World")).toEqual(["hello", "world"]);
  });

  it("removes punctuation", () => {
    expect(tokenize("React.js, Node.js, and TypeScript!")).toEqual([
      "react",
      "js",
      "node",
      "js",
      "and",
      "typescript",
    ]);
  });

  it("handles multiple spaces and tabs", () => {
    expect(tokenize("  senior   engineer  ")).toEqual(["senior", "engineer"]);
  });

  it("returns empty array for empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(tokenize("   ")).toEqual([]);
  });

  it("preserves numbers in tokens", () => {
    expect(tokenize("Web3 Developer with 5 years")).toEqual([
      "web3",
      "developer",
      "with",
      "5",
      "years",
    ]);
  });

  it("handles special characters like hyphens and slashes", () => {
    expect(tokenize("full-stack CI/CD")).toEqual(["full", "stack", "ci", "cd"]);
  });
});

describe("normalizeTokens", () => {
  it("removes common stop words", () => {
    expect(normalizeTokens(["the", "senior", "in", "a", "team"])).toEqual([
      "senior",
      "team",
    ]);
  });

  it("applies basic stemming for -ing suffix", () => {
    expect(normalizeTokens(["developing", "coding"])).toEqual([
      "develop",
      "cod",
    ]);
  });

  it("applies basic stemming for -tion suffix", () => {
    expect(normalizeTokens(["application", "creation"])).toEqual([
      "applica",
      "crea",
    ]);
  });

  it("applies basic stemming for -ed suffix", () => {
    expect(normalizeTokens(["experienced", "skilled"])).toEqual([
      "experienc",
      "skill",
    ]);
  });

  it("applies basic stemming for -ly suffix", () => {
    expect(normalizeTokens(["quickly", "remotely"])).toEqual([
      "quick",
      "remote",
    ]);
  });

  it("does not stem short words where root would be less than 3 chars", () => {
    expect(normalizeTokens(["bed", "red", "led"])).toEqual([
      "bed",
      "red",
      "led",
    ]);
  });

  it("returns empty array when all tokens are stop words", () => {
    expect(normalizeTokens(["the", "a", "an", "is", "and"])).toEqual([]);
  });

  it("handles empty input", () => {
    expect(normalizeTokens([])).toEqual([]);
  });
});

describe("calculateOverlap", () => {
  it("returns 1 when all tokens in A appear in B", () => {
    expect(
      calculateOverlap(["react", "node"], ["react", "node", "python"]),
    ).toBe(1);
  });

  it("returns 0 when no tokens in A appear in B", () => {
    expect(calculateOverlap(["react", "node"], ["python", "java"])).toBe(0);
  });

  it("returns correct ratio for partial overlap", () => {
    expect(
      calculateOverlap(["react", "node", "python"], ["react", "python"]),
    ).toBeCloseTo(2 / 3);
  });

  it("returns 0 when tokensA is empty", () => {
    expect(calculateOverlap([], ["react", "node"])).toBe(0);
  });

  it("returns 0 when tokensB is empty", () => {
    expect(calculateOverlap(["react", "node"], [])).toBe(0);
  });

  it("returns 0 when both arrays are empty", () => {
    expect(calculateOverlap([], [])).toBe(0);
  });

  it("handles duplicate tokens in A correctly", () => {
    // "react" appears twice in A, both match B => 2/3
    expect(
      calculateOverlap(["react", "react", "node"], ["react", "python"]),
    ).toBeCloseTo(2 / 3);
  });
});
