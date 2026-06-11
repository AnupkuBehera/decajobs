/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchActiveCandidates, batchCandidates } from "./fetch-candidates";
import type { ActiveCandidateWithProfile } from "./fetch-candidates";

// Mock the @supabase/supabase-js module
vi.mock("@supabase/supabase-js", () => {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  };

  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => mockChain),
      _chain: mockChain,
    })),
  };
});

// Access the mocked createClient to set return values
import { createClient } from "@supabase/supabase-js";

function getMockChain() {
  const mockClient = (createClient as any)();
  return {
    from: mockClient.from,
    chain: mockClient._chain,
  };
}

describe("fetchActiveCandidates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns candidates with complete profiles", async () => {
    const mockData = [
      {
        id: "candidate-1",
        email: "alice@example.com",
        preferred_delivery_time: "07:00",
        candidate_profiles: {
          target_titles: ["Software Engineer", "Full Stack Developer"],
          skills: ["TypeScript", "React"],
          location: "San Francisco, CA",
        },
      },
      {
        id: "candidate-2",
        email: "bob@example.com",
        preferred_delivery_time: "17:00",
        candidate_profiles: {
          target_titles: ["Product Manager"],
          skills: ["Agile", "Data Analysis"],
          location: "Remote",
        },
      },
    ];

    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: mockData, error: null });

    const result = await fetchActiveCandidates();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "candidate-1",
      email: "alice@example.com",
      preferred_delivery_time: "07:00",
      profile: {
        target_titles: ["Software Engineer", "Full Stack Developer"],
        skills: ["TypeScript", "React"],
        location: "San Francisco, CA",
      },
    });
    expect(result[1]).toEqual({
      id: "candidate-2",
      email: "bob@example.com",
      preferred_delivery_time: "17:00",
      profile: {
        target_titles: ["Product Manager"],
        skills: ["Agile", "Data Analysis"],
        location: "Remote",
      },
    });
  });

  it("filters out candidates with empty target_titles", async () => {
    const mockData = [
      {
        id: "candidate-1",
        email: "alice@example.com",
        preferred_delivery_time: "07:00",
        candidate_profiles: {
          target_titles: [],
          skills: ["TypeScript"],
          location: "NYC",
        },
      },
    ];

    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: mockData, error: null });

    const result = await fetchActiveCandidates();
    expect(result).toHaveLength(0);
  });

  it("filters out candidates with empty skills", async () => {
    const mockData = [
      {
        id: "candidate-1",
        email: "alice@example.com",
        preferred_delivery_time: "07:00",
        candidate_profiles: {
          target_titles: ["Engineer"],
          skills: [],
          location: "NYC",
        },
      },
    ];

    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: mockData, error: null });

    const result = await fetchActiveCandidates();
    expect(result).toHaveLength(0);
  });

  it("filters out candidates with empty location", async () => {
    const mockData = [
      {
        id: "candidate-1",
        email: "alice@example.com",
        preferred_delivery_time: "07:00",
        candidate_profiles: {
          target_titles: ["Engineer"],
          skills: ["Python"],
          location: "",
        },
      },
    ];

    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: mockData, error: null });

    const result = await fetchActiveCandidates();
    expect(result).toHaveLength(0);
  });

  it("filters out candidates with whitespace-only location", async () => {
    const mockData = [
      {
        id: "candidate-1",
        email: "alice@example.com",
        preferred_delivery_time: "07:00",
        candidate_profiles: {
          target_titles: ["Engineer"],
          skills: ["Python"],
          location: "   ",
        },
      },
    ];

    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: mockData, error: null });

    const result = await fetchActiveCandidates();
    expect(result).toHaveLength(0);
  });

  it("returns empty array when no data is returned", async () => {
    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: null, error: null });

    const result = await fetchActiveCandidates();
    expect(result).toEqual([]);
  });

  it("returns empty array when data is empty", async () => {
    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({ data: [], error: null });

    const result = await fetchActiveCandidates();
    expect(result).toEqual([]);
  });

  it("throws when supabase query fails", async () => {
    const { chain } = getMockChain();
    chain.eq.mockResolvedValue({
      data: null,
      error: { message: "Connection refused" },
    });

    await expect(fetchActiveCandidates()).rejects.toThrow(
      "Failed to fetch candidates: Connection refused"
    );
  });
});

describe("batchCandidates", () => {
  function makeCandidates(count: number): ActiveCandidateWithProfile[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `candidate-${i}`,
      email: `user${i}@example.com`,
      preferred_delivery_time: "07:00",
      profile: {
        target_titles: ["Engineer"],
        skills: ["TypeScript"],
        location: "Remote",
      },
    }));
  }

  it("yields a single batch when candidates <= 50", () => {
    const candidates = makeCandidates(30);
    const batches = [...batchCandidates(candidates)];

    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(30);
  });

  it("yields multiple batches for more than 50 candidates", () => {
    const candidates = makeCandidates(120);
    const batches = [...batchCandidates(candidates)];

    expect(batches).toHaveLength(3);
    expect(batches[0]).toHaveLength(50);
    expect(batches[1]).toHaveLength(50);
    expect(batches[2]).toHaveLength(20);
  });

  it("yields exactly one batch of 50 for exactly 50 candidates", () => {
    const candidates = makeCandidates(50);
    const batches = [...batchCandidates(candidates)];

    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(50);
  });

  it("yields no batches for empty array", () => {
    const batches = [...batchCandidates([])];
    expect(batches).toHaveLength(0);
  });

  it("preserves candidate order across batches", () => {
    const candidates = makeCandidates(75);
    const batches = [...batchCandidates(candidates)];

    // First batch should have candidates 0-49
    expect(batches[0]![0]!.id).toBe("candidate-0");
    expect(batches[0]![49]!.id).toBe("candidate-49");
    // Second batch should have candidates 50-74
    expect(batches[1]![0]!.id).toBe("candidate-50");
    expect(batches[1]![24]!.id).toBe("candidate-74");
  });

  it("all candidates appear exactly once across all batches", () => {
    const candidates = makeCandidates(130);
    const batches = [...batchCandidates(candidates)];

    const allIds = batches.flatMap((batch) => batch.map((c) => c.id));
    expect(allIds).toHaveLength(130);
    expect(new Set(allIds).size).toBe(130);
  });
});
