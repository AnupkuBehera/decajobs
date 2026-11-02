import { describe, it, expect } from "vitest";
import { getNewsBySlug, getAllNews } from "./daily-news";

describe("daily-news intelligence system", () => {
  it("resolves historical daily news brief URLs like daily-tech-news-2026-10-16 with full metadata", () => {
    const slug = "daily-tech-news-2026-10-16";
    const article = getNewsBySlug(slug);

    expect(article).toBeDefined();
    expect(article?.slug).toBe("daily-tech-news-2026-10-16");
    expect(article?.title).toContain("October 16, 2026");
    expect(article?.publishedAt).toBe("October 16, 2026");
    expect(article?.summary).toBeDefined();
    expect(article?.content).toContain("October 16, 2026");
    expect(article?.isDailyBrief).toBe(true);
    expect(article?.tags).toContain("Daily Brief");
  });

  it("returns undefined for completely invalid non-date news slugs", () => {
    const article = getNewsBySlug("completely-invalid-slug-12345");
    expect(article).toBeUndefined();
  });

  it("lists recent news briefs in getAllNews", () => {
    const all = getAllNews();
    expect(all.length).toBeGreaterThan(10);
  });
});

