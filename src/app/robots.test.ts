import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots.txt configuration", () => {
  it("allows Googlebot and AdSense crawlers while disallowing strictly backend API paths", () => {
    const config = robots();

    expect(config.sitemap).toBe("https://decajob.com/sitemap.xml");
    expect(config.rules).toBeDefined();

    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];

    // AdSense crawler must have explicit access to /
    const mediaPartnersRule = rules.find((r) => r?.userAgent === "Mediapartners-Google");
    expect(mediaPartnersRule).toBeDefined();
    expect(mediaPartnersRule?.allow).toBe("/");

    // General search crawler rules
    const wildcardRule = rules.find((r) => r?.userAgent === "*");
    expect(wildcardRule).toBeDefined();
    expect(wildcardRule?.allow).toBe("/");

    const disallowed = (wildcardRule as any)?.disallow;
    expect(disallowed).toBeDefined();
    const disallowList = Array.isArray(disallowed) ? disallowed : [disallowed];

    // Backend APIs & auth callback that have no HTML representation
    expect(disallowList).toContain("/api/");
    expect(disallowList).toContain("/auth/callback");
    expect(disallowList).toContain("/_next/static/media/");

    // CRITICAL for GSC validation: MUST NOT disallow URLs that redirect or carry noindex headers.
    // Googlebot must be able to crawl these URLs to see the 301 redirect or X-Robots-Tag!
    expect(disallowList).not.toContain("/resume-tools");
    expect(disallowList).not.toContain("/jobs?*");
    expect(disallowList).not.toContain("/*?q=*");
    expect(disallowList).not.toContain("/employer/dashboard");
    expect(disallowList).not.toContain("/dashboard");
    expect(disallowList).not.toContain("/profile");
    expect(disallowList).not.toContain("/settings");
  });
});
