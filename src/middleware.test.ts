import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

vi.mock("@/lib/supabase/middleware", () => ({
  updateSessionAndGetUser: vi.fn().mockResolvedValue({
    response: {
      status: 200,
      headers: new Headers(),
      cookies: {
        getAll: () => [],
        set: vi.fn(),
      },
    },
    user: null,
  }),
}));

describe("Middleware - workers.dev domain handling and de-indexing", () => {
  it("permanently redirects *.workers.dev root request to https://decajob.com with X-Robots-Tag: noindex", async () => {
    const req = new NextRequest("https://decajobs.anupkist.workers.dev/", {
      headers: {
        host: "decajobs.anupkist.workers.dev",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://decajob.com/");
    expect(res.headers.get("X-Robots-Tag")).toBe("noindex, nofollow, noarchive");
  });

  it("permanently redirects deep worker.dev paths and query params to canonical decajob.com", async () => {
    const req = new NextRequest("https://decajobs.anupkist.workers.dev/jobs?role=engineer&location=remote", {
      headers: {
        host: "decajobs.anupkist.workers.dev",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://decajob.com/jobs?role=engineer&location=remote");
    expect(res.headers.get("X-Robots-Tag")).toBe("noindex, nofollow, noarchive");
  });

  it("permanently redirects www.decajob.com to decajob.com", async () => {
    const req = new NextRequest("https://www.decajob.com/jobs", {
      headers: {
        host: "www.decajob.com",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://decajob.com/jobs");
  });

  it("does not redirect or add noindex tag to canonical decajob.com public pages", async () => {
    const req = new NextRequest("https://decajob.com/pricing", {
      headers: {
        host: "decajob.com",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("X-Robots-Tag")).toBeNull();
  });

  it("does not redirect workers.dev requests when preview=true is passed", async () => {
    const req = new NextRequest("https://decajobs.anupkist.workers.dev/pricing?preview=true", {
      headers: {
        host: "decajobs.anupkist.workers.dev",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("permanently redirects /mock-interview (including query params) to /tools/mock-interview", async () => {
    const req = new NextRequest(
      "https://decajob.com/mock-interview?title=Software+Engineer&company=Airbnb&desc=Test",
      {
        headers: {
          host: "decajob.com",
        },
      }
    );

    const res = await middleware(req);

    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://decajob.com/tools/mock-interview");
  });

  it("canonicalizes /login?role=Microsoft to clean /login", async () => {
    const req = new NextRequest("https://decajob.com/login?role=Microsoft", {
      headers: {
        host: "decajob.com",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://decajob.com/login");
  });

  it("preserves auth error params on /login without redirecting", async () => {
    const req = new NextRequest("https://decajob.com/login?error=oauth_failed", {
      headers: {
        host: "decajob.com",
      },
    });

    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  // Google Search Console (GSC) Resolution Tests
  describe("GSC Indexing Validation & Canonicalization", () => {
    it("redirects legacy parameterized /resume-tools URLs (119 GSC URLs) to /tools/resume-matcher", async () => {
      const req = new NextRequest(
        "https://decajob.com/resume-tools?tab=builder&role=Engineering+Manager&company=GitLab",
        {
          headers: { host: "decajob.com" },
        }
      );

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/tools/resume-matcher");
    });

    it("redirects unauthenticated root /resume-tools to /tools/resume-matcher", async () => {
      const req = new NextRequest("https://decajob.com/resume-tools", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/tools/resume-matcher");
    });

    it("redirects /jobs?remote=true to canonical /jobs/remote", async () => {
      const req = new NextRequest("https://decajob.com/jobs?remote=true", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/jobs/remote");
    });

    it("redirects /jobs?remote=1 to canonical /jobs/remote", async () => {
      const req = new NextRequest("https://decajob.com/jobs?remote=1", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/jobs/remote");
    });

    it("redirects city search /jobs?q=Bangalore to canonical /jobs/location/bangalore", async () => {
      const req = new NextRequest("https://decajob.com/jobs?q=Bangalore", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/jobs/location/bangalore");
    });

    it("redirects city search /jobs?q=Bengaluru to canonical /jobs/location/bangalore", async () => {
      const req = new NextRequest("https://decajob.com/jobs?q=Bengaluru", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/jobs/location/bangalore");
    });

    it("redirects US city search /jobs?q=Seattle to canonical /jobs/location/seattle", async () => {
      const req = new NextRequest("https://decajob.com/jobs?q=Seattle", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/jobs/location/seattle");
    });

    it("canonicalizes /?ref=producthunt to clean homepage /", async () => {
      const req = new NextRequest("https://decajob.com/?ref=producthunt", {
        headers: { host: "decajob.com" },
      });

      const res = await middleware(req);

      expect(res.status).toBe(301);
      expect(res.headers.get("location")).toBe("https://decajob.com/");
    });
  });
});
