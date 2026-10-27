import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@supabase/supabase-js";
import { GET } from "./route";

describe("Supabase Keep-Alive API (GET /api/cron/keepalive)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    delete process.env.CRON_SECRET;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 401 Unauthorized when CRON_SECRET is set and request lacks valid bearer or public flag", async () => {
    process.env.CRON_SECRET = "secret-token-123";

    const req = new NextRequest("https://decajob.com/api/cron/keepalive", {
      headers: {
        authorization: "Bearer wrong-token",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("allows access when CRON_SECRET is set but request has ?public=1", async () => {
    process.env.CRON_SECRET = "secret-token-123";

    const mockLimit = vi.fn().mockResolvedValue({ data: [{ id: "job-1" }], error: null });
    const mockSelect = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    (createClient as any).mockReturnValue({
      from: mockFrom,
    });

    const req = new NextRequest("https://decajob.com/api/cron/keepalive?public=1");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.message).toContain("Supabase keep-alive ping successful");
    expect(mockFrom).toHaveBeenCalledWith("job_listings");
  });

  it("allows access when valid Bearer CRON_SECRET is supplied", async () => {
    process.env.CRON_SECRET = "secret-token-123";

    const mockLimit = vi.fn().mockResolvedValue({ data: [{ id: "job-1" }], error: null });
    const mockSelect = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

    (createClient as any).mockReturnValue({
      from: mockFrom,
    });

    const req = new NextRequest("https://decajob.com/api/cron/keepalive", {
      headers: {
        authorization: "Bearer secret-token-123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
  });

  it("returns 500 when Supabase env variables are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const req = new NextRequest("https://decajob.com/api/cron/keepalive");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toContain("Supabase environment variables are missing");
  });

  it("handles fallback to candidates table if job_listings fails", async () => {
    const mockLimitJobListings = vi.fn().mockResolvedValue({ data: null, error: { message: "Table not found" } });
    const mockLimitCandidates = vi.fn().mockResolvedValue({ data: [{ id: "cand-1" }], error: null });

    const mockFrom = vi.fn((table: string) => {
      if (table === "job_listings") {
        return { select: vi.fn().mockReturnValue({ limit: mockLimitJobListings }) };
      }
      return { select: vi.fn().mockReturnValue({ limit: mockLimitCandidates }) };
    });

    (createClient as any).mockReturnValue({
      from: mockFrom,
    });

    const req = new NextRequest("https://decajob.com/api/cron/keepalive");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(mockFrom).toHaveBeenCalledWith("candidates");
  });

  it("returns 500 if both tables fail to query", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ data: null, error: { message: "Database offline" } });
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({ limit: mockLimit }),
    });

    (createClient as any).mockReturnValue({
      from: mockFrom,
    });

    const req = new NextRequest("https://decajob.com/api/cron/keepalive");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.status).toBe("error");
    expect(json.error).toContain("Database offline");
  });
});
