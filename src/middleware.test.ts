import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

vi.mock("@/lib/supabase/middleware", () => ({
  updateSessionAndGetUser: vi.fn().mockResolvedValue({
    response: {
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
});
