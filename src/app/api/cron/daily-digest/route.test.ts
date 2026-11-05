import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/inngest/functions/helpers/fetch-candidates", () => ({
  fetchActiveCandidates: vi.fn(),
}));

vi.mock("@/inngest/functions/helpers/send-candidate-digest", () => ({
  sendDigestForCandidate: vi.fn(),
  fetchEligibleJobs: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({
  verifyAdmin: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

import { fetchActiveCandidates } from "@/inngest/functions/helpers/fetch-candidates";
import { sendDigestForCandidate } from "@/inngest/functions/helpers/send-candidate-digest";
import { verifyAdmin } from "@/lib/admin";
import { GET } from "./route";

describe("Daily Digest Cron API (GET /api/cron/daily-digest)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.CRON_SECRET;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-project.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    (verifyAdmin as any).mockResolvedValue(null);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 500 when CRON_SECRET is not configured on the server", async () => {
    const req = new NextRequest("https://decajob.com/api/cron/daily-digest");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toContain("CRON_SECRET is not configured");
  });

  it("returns 401 Unauthorized when invalid Bearer token is provided", async () => {
    process.env.CRON_SECRET = "test-secret-123";

    const req = new NextRequest("https://decajob.com/api/cron/daily-digest", {
      headers: {
        authorization: "Bearer wrong-secret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain("Unauthorized");
  });

  it("returns 503 when Supabase database credentials are not configured", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const req = new NextRequest("https://decajob.com/api/cron/daily-digest", {
      headers: {
        authorization: "Bearer test-secret-123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.authenticated).toBe(true);
    expect(json.status).toBe("misconfigured");
    expect(json.error).toContain("Database credentials missing");
  });

  it("authorizes successfully with valid Bearer token and runs batch digest", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    (fetchActiveCandidates as any).mockResolvedValue([
      {
        id: "cand-1",
        email: "cand1@example.com",
        preferred_delivery_time: "07:00",
        timeZone: "Asia/Kolkata",
        profile: {
          target_titles: ["Developer"],
          skills: ["React"],
          location: "Bangalore",
        },
      },
    ]);
    (sendDigestForCandidate as any).mockResolvedValue({
      success: true,
      jobsSent: 10,
    });

    const req = new NextRequest("https://decajob.com/api/cron/daily-digest?force=true", {
      headers: {
        authorization: "Bearer test-secret-123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.triggered).toBe(1);
    expect(json.successCount).toBe(1);
    expect(sendDigestForCandidate).toHaveBeenCalledTimes(1);
  });

  it("authorizes successfully with ?secret= query parameter", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    (fetchActiveCandidates as any).mockResolvedValue([]);

    const req = new NextRequest("https://decajob.com/api/cron/daily-digest?secret=test-secret-123");

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.triggered).toBe(0);
    expect(json.message).toContain("No active candidates in the current delivery window");
  });

  it("authorizes successfully with ?key= query parameter", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    (fetchActiveCandidates as any).mockResolvedValue([]);

    const req = new NextRequest("https://decajob.com/api/cron/daily-digest?key=test-secret-123");

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.triggered).toBe(0);
  });

  it("rejects invalid test_email format with 400", async () => {
    process.env.CRON_SECRET = "test-secret-123";

    const req = new NextRequest("https://decajob.com/api/cron/daily-digest?test_email=notanemail", {
      headers: {
        authorization: "Bearer test-secret-123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid test_email address");
  });

  it("processes valid test_email without requiring active candidates from DB", async () => {
    process.env.CRON_SECRET = "test-secret-123";
    (sendDigestForCandidate as any).mockResolvedValue({
      success: true,
      jobsSent: 10,
    });

    const req = new NextRequest(
      "https://decajob.com/api/cron/daily-digest?test_email=test@example.com",
      {
        headers: {
          authorization: "Bearer test-secret-123",
        },
      }
    );

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.recipient).toBe("test@example.com");
    expect(json.result.success).toBe(true);
    expect(sendDigestForCandidate).toHaveBeenCalledTimes(1);
  });
});
