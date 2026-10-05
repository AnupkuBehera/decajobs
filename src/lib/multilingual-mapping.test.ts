import { describe, it, expect } from "vitest";
import {
  expandMultilingualQuery,
  MULTILINGUAL_ROLE_MAPPINGS,
  ENGLISH_TO_HINDI_DICTIONARY,
} from "./multilingual-mapping";

describe("Multilingual Mapping Engine", () => {
  it("expands Hindi query for Accounts Assistant (लेखा सहायक)", () => {
    const res = expandMultilingualQuery("लेखा सहायक");
    expect(res.detectedLanguage).toBe("hi");
    expect(res.normalizedQuery).toContain("Accounts Assistant");
    expect(res.normalizedQuery).toContain("Tally");
    expect(res.matchedRole?.standardTitle).toBe("Accounts Assistant / Accountant");
  });

  it("expands Hindi query for Software Engineer (सॉफ्टवेयर इंजीनियर)", () => {
    const res = expandMultilingualQuery("सॉफ्टवेयर इंजीनियर");
    expect(res.detectedLanguage).toBe("hi");
    expect(res.normalizedQuery).toContain("Software Engineer");
    expect(res.matchedRole?.categorySlug).toBe("software-engineering");
  });

  it("expands Bengali query for Accountant (হিসাব সহকারী)", () => {
    const res = expandMultilingualQuery("হিসাব সহকারী");
    expect(res.detectedLanguage).toBe("bn");
    expect(res.normalizedQuery).toContain("Accounts Assistant");
  });

  it("expands Tamil query for Software Engineer (மென்பொருள் பொறியாளர்)", () => {
    const res = expandMultilingualQuery("மென்பொருள் பொறியாளர்");
    expect(res.detectedLanguage).toBe("ta");
    expect(res.normalizedQuery).toContain("Software Engineer");
  });

  it("expands Telugu query for Data Analyst (డేటా అనలిస్ట్)", () => {
    const res = expandMultilingualQuery("డేటా అనలిస్ట్");
    expect(res.detectedLanguage).toBe("te");
    expect(res.normalizedQuery).toContain("Data Analyst");
  });

  it("expands Odia query for Fresher jobs (ଫ୍ରେସର ଚାକିରି)", () => {
    const res = expandMultilingualQuery("ଫ୍ରେସର ଚାକିରି");
    expect(res.detectedLanguage).toBe("or");
    expect(res.normalizedQuery).toContain("Fresher");
  });

  it("handles English and Hinglish correctly", () => {
    const res = expandMultilingualQuery("developer");
    expect(res.detectedLanguage).toBe("en");
    expect(res.normalizedQuery).toBe("Software Engineer");
  });

  it("provides fast inline dictionary translations for UI elements", () => {
    expect(ENGLISH_TO_HINDI_DICTIONARY["Tax-Free Salary"]).toBe("कर-मुक्त वेतन (100% टैक्स फ्री)");
    expect(ENGLISH_TO_HINDI_DICTIONARY["Visa Sponsorship Available"]).toBe("वीज़ा स्पॉन्सरशिप उपलब्ध");
  });
});
