import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchApifyLinkedInJobs } from "./apify";

describe("fetchApifyLinkedInJobs", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should return empty array if APIFY_TOKEN is not set", async () => {
    delete process.env.APIFY_TOKEN;
    const result = await fetchApifyLinkedInJobs("React Developer", "Remote");
    expect(result).toEqual([]);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("should successfully fetch and normalize LinkedIn jobs from Apify API", async () => {
    process.env.APIFY_TOKEN = "test_apify_token";
    process.env.APIFY_LINKEDIN_SCRAPER_ID = "hxnua871g1n/linkedin-jobs-scraper";

    const mockDatasetItems = [
      {
        id: "123456",
        title: "React Developer",
        companyName: "Google",
        description: "Develop cool React apps",
        location: "Mountain View, CA",
        jobUrl: "https://linkedin.com/jobs/view/123456",
        postedAt: "2026-07-04T00:00:00Z"
      },
      {
        jobId: "789012",
        jobTitle: "Senior Frontend Engineer",
        company: "Meta",
        jobDescription: "Build future interfaces",
        jobLocation: "Remote",
        applyUrl: "https://linkedin.com/jobs/view/789012",
        postDate: "2026-07-03T12:00:00Z"
      }
    ];

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDatasetItems,
    } as Response);

    const result = await fetchApifyLinkedInJobs("React Developer", "Remote", 5);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.apify.com/v2/acts/hxnua871g1n~linkedin-jobs-scraper/run-sync-get-dataset-items?token=test_apify_token&timeout=15",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: "React Developer",
          location: "Remote",
          maxItems: 5,
        })
      })
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "apify_123456",
      title: "React Developer",
      company: "Google",
      description: "Develop cool React apps",
      location: "Mountain View, CA",
      applicationLink: "https://linkedin.com/jobs/view/123456",
      postedAt: "2026-07-04T00:00:00Z",
      source: "apify"
    });

    expect(result[1]).toEqual({
      id: "apify_789012",
      title: "Senior Frontend Engineer",
      company: "Meta",
      description: "Build future interfaces",
      location: "Remote",
      applicationLink: "https://linkedin.com/jobs/view/789012",
      postedAt: "2026-07-03T12:00:00Z",
      source: "apify"
    });
  });

  it("should handle scraper API errors gracefully by returning an empty array", async () => {
    process.env.APIFY_TOKEN = "test_apify_token";

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const result = await fetchApifyLinkedInJobs("React Developer", "Remote");
    expect(result).toEqual([]);
  });

  it("should handle parsing failures or invalid dataset structures", async () => {
    process.env.APIFY_TOKEN = "test_apify_token";

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "error", message: "invalid payload" }),
    } as Response);

    const result = await fetchApifyLinkedInJobs("React Developer", "Remote");
    expect(result).toEqual([]);
  });

  it("should handle timeout or network errors gracefully", async () => {
    process.env.APIFY_TOKEN = "test_apify_token";

    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network connection lost"));

    const result = await fetchApifyLinkedInJobs("React Developer", "Remote");
    expect(result).toEqual([]);
  });
});
