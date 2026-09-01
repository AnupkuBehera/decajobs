import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALES,
  isValidLocale,
  getLocaleFromPath,
} from "./config";
import {
  cleanPathname,
  getTranslatedPath,
  getHreflangAlternates,
  getTranslations,
} from "./utils";
import { scoreLocationMatch } from "../matching/scorer";

describe("i18n Config & Locales", () => {
  it("includes all 8 required languages plus English default", () => {
    const required = ["en", "es", "ja", "fr", "de", "pt", "ko", "it"];
    for (const req of required) {
      expect(SUPPORTED_LOCALES).toContain(req);
      expect(isValidLocale(req)).toBe(true);
      expect(LOCALES[req as keyof typeof LOCALES]).toBeDefined();
    }
  });

  it("identifies invalid locales correctly", () => {
    expect(isValidLocale("xx")).toBe(false);
    expect(isValidLocale("invalid")).toBe(false);
    expect(isValidLocale("")).toBe(false);
  });

  it("extracts locale from pathname", () => {
    expect(getLocaleFromPath("/es")).toBe("es");
    expect(getLocaleFromPath("/es/about")).toBe("es");
    expect(getLocaleFromPath("/ja/jobs")).toBe("ja");
    expect(getLocaleFromPath("/about")).toBe(DEFAULT_LOCALE);
    expect(getLocaleFromPath("/")).toBe(DEFAULT_LOCALE);
  });
});

describe("i18n Path and Hreflang Utilities", () => {
  it("cleans localized pathnames", () => {
    expect(cleanPathname("/es")).toBe("/");
    expect(cleanPathname("/es/about")).toBe("/about");
    expect(cleanPathname("/ja/tools/resume-checker")).toBe(
      "/tools/resume-checker"
    );
    expect(cleanPathname("/about")).toBe("/about");
  });

  it("translates path with hide-default-language rule", () => {
    // English default should NOT have /en prefix
    expect(getTranslatedPath("/", "en")).toBe("/");
    expect(getTranslatedPath("/about", "en")).toBe("/about");

    // Other locales must have /es, /ja, etc. prefix
    expect(getTranslatedPath("/", "es")).toBe("/es");
    expect(getTranslatedPath("/about", "es")).toBe("/es/about");
    expect(getTranslatedPath("/about", "ja")).toBe("/ja/about");
    expect(getTranslatedPath("/about", "ko")).toBe("/ko/about");
  });

  it("generates complete hreflang alternates for SEO", () => {
    const alternates = getHreflangAlternates("/");
    expect(alternates.en).toBe("https://decajob.com");
    expect(alternates.es).toBe("https://decajob.com/es");
    expect(alternates.ja).toBe("https://decajob.com/ja");
    expect(alternates.fr).toBe("https://decajob.com/fr");
    expect(alternates.de).toBe("https://decajob.com/de");
    expect(alternates.pt).toBe("https://decajob.com/pt");
    expect(alternates.ko).toBe("https://decajob.com/ko");
    expect(alternates.it).toBe("https://decajob.com/it");
    expect(alternates["x-default"]).toBe("https://decajob.com");
  });

  it("loads complete translations for every supported language", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const t = getTranslations(locale);
      expect(t).toBeDefined();
      expect(t.meta.title).toBeTruthy();
      expect(t.meta.description).toBeTruthy();
      expect(t.hero.titleLine1).toBeTruthy();
      expect(t.hero.ctaPrimary).toBeTruthy();
      expect(t.globalBanner.title).toBeTruthy();
      expect(t.daily10.eyebrow).toBeTruthy();
      expect(t.faq.q1).toBeTruthy();
    }
  });
});

describe("Global Candidate Location Matching", () => {
  it("matches worldwide and global remote designations for candidates anywhere", () => {
    expect(scoreLocationMatch("Madrid, Spain", "Remote (Worldwide)")).toBe(15);
    expect(scoreLocationMatch("Tokyo, Japan", "Global Remote")).toBe(15);
    expect(scoreLocationMatch("Berlin, Germany", "Remote - Anywhere")).toBe(15);
    expect(scoreLocationMatch("Seoul, South Korea", "Work from home")).toBe(15);
  });

  it("matches international cities and country segments", () => {
    expect(scoreLocationMatch("Madrid, Spain", "Madrid")).toBe(15);
    expect(scoreLocationMatch("Tokyo, Japan", "Tokyo")).toBe(15);
    expect(scoreLocationMatch("Paris, France", "Paris, France")).toBe(15);
    expect(scoreLocationMatch("Sao Paulo, Brazil", "Sao Paulo")).toBe(15);
    expect(scoreLocationMatch("Milan, Italy", "Milan")).toBe(15);
  });

  it("does not false-match different international cities", () => {
    expect(scoreLocationMatch("Madrid, Spain", "Tokyo, Japan")).toBe(0);
    expect(scoreLocationMatch("Berlin, Germany", "Paris, France")).toBe(0);
  });
});
