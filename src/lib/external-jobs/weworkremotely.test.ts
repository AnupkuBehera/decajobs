import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWeWorkRemotelyJobs } from "./weworkremotely";

describe("We Work Remotely RSS Jobs Connector", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("parses RSS XML feed and normalizes job cards", async () => {
    const mockRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>We Work Remotely: Programming Jobs</title>
    <item>
      <title><![CDATA[Basecamp: Senior Rails Developer]]></title>
      <link><![CDATA[https://weworkremotely.com/remote-jobs/basecamp-senior-rails-developer]]></link>
      <region><![CDATA[Anywhere in the World]]></region>
      <description><![CDATA[<p>Join Basecamp building high quality web applications with Ruby on Rails and Hotwire.</p>]]></description>
      <pubDate>Mon, 12 Oct 2026 14:00:00 +0000</pubDate>
    </item>
  </channel>
</rss>`;

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () => mockRssXml,
    } as any);

    const jobs = await fetchWeWorkRemotelyJobs("Rails");
    expect(jobs.length).toBeGreaterThan(0);

    const first = jobs[0]!;
    expect(first).toBeDefined();
    expect(first.title).toBe("Senior Rails Developer");
    expect(first.company).toBe("Basecamp");
    expect(first.location).toBe("Anywhere in the World");
    expect(first.source).toBe("weworkremotely");
    expect(first.applicationLink).toBe("https://weworkremotely.com/remote-jobs/basecamp-senior-rails-developer");
    expect(first.description).toContain("Join Basecamp");
  });

  it("handles feed network failure gracefully", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("RSS feed unreachable"));

    const jobs = await fetchWeWorkRemotelyJobs("developer");
    expect(jobs).toEqual([]);
  });
});
