import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots.txt configuration", () => {
  it("includes rules for Googlebot and disallows private authenticated routes", () => {
    const config = robots();

    expect(config.sitemap).toBe("https://decajob.com/sitemap.xml");
    expect(config.rules).toBeDefined();

    const wildcardRule = Array.isArray(config.rules)
      ? config.rules.find((r) => r.userAgent === "*")
      : config.rules;

    expect(wildcardRule).toBeDefined();
    const disallowed = (wildcardRule as any)?.disallow;
    expect(disallowed).toBeDefined();

    const disallowList = Array.isArray(disallowed) ? disallowed : [disallowed];

    // Protected app routes that must never be crawled
    expect(disallowList).toContain("/dashboard");
    expect(disallowList).toContain("/profile");
    expect(disallowList).toContain("/settings");
    expect(disallowList).toContain("/resume-tools");
    expect(disallowList).toContain("/subscribe");
    expect(disallowList).toContain("/applications");
    expect(disallowList).toContain("/employer/dashboard");

    // Search query parameters that must not be crawled per Google Webmaster Guidelines
    expect(disallowList).toContain("/*?q=*");
    expect(disallowList).toContain("/jobs?*");
  });
});
