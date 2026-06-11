/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getRecentlySentJobIds,
  recordDigestHistory,
  cleanupOldHistory,
} from "./digest-history";

// Helper to create a mock Supabase client
function createMockSupabase() {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    delete: vi.fn().mockReturnThis(),
  };

  const mockFrom = vi.fn().mockReturnValue(mockChain);

  return {
    from: mockFrom,
    _chain: mockChain,
  };
}

describe("getRecentlySentJobIds", () => {
  let mockSupabase: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T10:00:00Z"));
  });

  it("queries digest_history for the correct candidate and 3-day window", async () => {
    mockSupabase._chain.gte.mockResolvedValue({
      data: [
        { job_listing_id: "job-1" },
        { job_listing_id: "job-2" },
      ],
      error: null,
    });

    const result = await getRecentlySentJobIds(
      mockSupabase as any,
      "candidate-123"
    );

    expect(mockSupabase.from).toHaveBeenCalledWith("digest_history");
    expect(mockSupabase._chain.select).toHaveBeenCalledWith("job_listing_id");
    expect(mockSupabase._chain.eq).toHaveBeenCalledWith(
      "candidate_id",
      "candidate-123"
    );
    // 3 days before 2024-06-15T10:00:00Z is 2024-06-12T10:00:00Z
    expect(mockSupabase._chain.gte).toHaveBeenCalledWith(
      "sent_at",
      "2024-06-12T10:00:00.000Z"
    );
    expect(result).toEqual(["job-1", "job-2"]);
  });

  it("returns empty array when no history exists", async () => {
    mockSupabase._chain.gte.mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await getRecentlySentJobIds(
      mockSupabase as any,
      "candidate-123"
    );

    expect(result).toEqual([]);
  });

  it("returns empty array when data is null", async () => {
    mockSupabase._chain.gte.mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await getRecentlySentJobIds(
      mockSupabase as any,
      "candidate-123"
    );

    expect(result).toEqual([]);
  });

  it("throws an error when the query fails", async () => {
    mockSupabase._chain.gte.mockResolvedValue({
      data: null,
      error: { message: "Connection error" },
    });

    await expect(
      getRecentlySentJobIds(mockSupabase as any, "candidate-123")
    ).rejects.toThrow(
      "Failed to fetch digest history for candidate candidate-123: Connection error"
    );
  });
});

describe("recordDigestHistory", () => {
  let mockSupabase: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T10:00:00Z"));
  });

  it("inserts records for each job listing ID", async () => {
    mockSupabase._chain.insert.mockResolvedValue({ error: null });

    await recordDigestHistory(mockSupabase as any, "candidate-123", [
      "job-1",
      "job-2",
      "job-3",
    ]);

    expect(mockSupabase.from).toHaveBeenCalledWith("digest_history");
    expect(mockSupabase._chain.insert).toHaveBeenCalledWith([
      {
        candidate_id: "candidate-123",
        job_listing_id: "job-1",
        sent_at: "2024-06-15T10:00:00.000Z",
      },
      {
        candidate_id: "candidate-123",
        job_listing_id: "job-2",
        sent_at: "2024-06-15T10:00:00.000Z",
      },
      {
        candidate_id: "candidate-123",
        job_listing_id: "job-3",
        sent_at: "2024-06-15T10:00:00.000Z",
      },
    ]);
  });

  it("does nothing when jobListingIds is empty", async () => {
    await recordDigestHistory(mockSupabase as any, "candidate-123", []);

    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("throws an error when insert fails", async () => {
    mockSupabase._chain.insert.mockResolvedValue({
      error: { message: "Insert failed" },
    });

    await expect(
      recordDigestHistory(mockSupabase as any, "candidate-123", ["job-1"])
    ).rejects.toThrow(
      "Failed to record digest history for candidate candidate-123: Insert failed"
    );
  });
});

describe("cleanupOldHistory", () => {
  let mockSupabase: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T10:00:00Z"));
  });

  it("deletes records older than 7 days", async () => {
    mockSupabase._chain.lt.mockResolvedValue({ error: null });

    await cleanupOldHistory(mockSupabase as any);

    expect(mockSupabase.from).toHaveBeenCalledWith("digest_history");
    expect(mockSupabase._chain.delete).toHaveBeenCalled();
    // 7 days before 2024-06-15T10:00:00Z is 2024-06-08T10:00:00Z
    expect(mockSupabase._chain.lt).toHaveBeenCalledWith(
      "sent_at",
      "2024-06-08T10:00:00.000Z"
    );
  });

  it("throws an error when delete fails", async () => {
    mockSupabase._chain.lt.mockResolvedValue({
      error: { message: "Delete failed" },
    });

    await expect(cleanupOldHistory(mockSupabase as any)).rejects.toThrow(
      "Failed to cleanup old digest history: Delete failed"
    );
  });
});
