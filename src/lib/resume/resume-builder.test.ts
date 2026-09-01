import { describe, it, expect } from "vitest";
import { PREFILLED_TEMPLATES, getTemplateBySlug, getTemplateByRole } from "./prefilled-templates";
import { calculateAtsScore } from "./ats-scorer";

describe("Prefilled Templates Library", () => {
  it("contains 8 comprehensive prefilled role templates", () => {
    expect(PREFILLED_TEMPLATES.length).toBe(8);
  });

  it("ensures every template has non-empty contact info, summary, experience, and skills", () => {
    for (const t of PREFILLED_TEMPLATES) {
      expect(t.slug).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.icon).toBeTruthy();
      expect(t.data.personalInfo.fullName).toBeTruthy();
      expect(t.data.personalInfo.email).toContain("@");
      expect(t.data.professionalSummary.length).toBeGreaterThan(50);
      expect(t.data.workExperience.length).toBeGreaterThanOrEqual(2);
      expect(t.data.education.length).toBeGreaterThanOrEqual(1);
      expect(t.data.skillCategories.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("finds templates by slug correctly", () => {
    const swe = getTemplateBySlug("software-engineer");
    expect(swe).toBeDefined();
    expect(swe?.title).toContain("Software");

    const dataAnalyst = getTemplateBySlug("data-analyst");
    expect(dataAnalyst).toBeDefined();
    expect(dataAnalyst?.data.skillCategories.some((sc) => sc.skills.some((s) => s.includes("SQL")))).toBe(true);
  });

  it("finds templates by role keyword fallback", () => {
    const match = getTemplateByRole("Senior React Engineer");
    expect(match.slug).toBe("software-engineer");

    const dataMatch = getTemplateByRole("Business Intelligence Analyst");
    expect(dataMatch.slug).toBe("data-analyst");
  });
});

describe("ATS Scorer", () => {
  it("scores full prefilled templates with an A+ or A grade (85+)", () => {
    for (const t of PREFILLED_TEMPLATES) {
      const result = calculateAtsScore(t.data);
      expect(result.score).toBeGreaterThanOrEqual(85);
      expect(["A+", "A"]).toContain(result.grade);
      expect(result.metricsCount).toBeGreaterThanOrEqual(2);
      expect(result.actionVerbsCount).toBeGreaterThanOrEqual(3);
    }
  });

  it("handles null or empty resume safely", () => {
    const emptyResult = calculateAtsScore(null);
    expect(emptyResult.score).toBe(0);
    expect(emptyResult.grade).toBe("Needs Improvement");
    expect(emptyResult.suggestions.length).toBeGreaterThan(0);
  });

  it("detects missing LinkedIn and warns with a tip", () => {
    const template = PREFILLED_TEMPLATES[0];
    const resumeWithoutLinkedin = {
      ...template.data,
      personalInfo: {
        ...template.data.personalInfo,
        linkedinUrl: "",
      },
    };
    const result = calculateAtsScore(resumeWithoutLinkedin);
    expect(result.suggestions.some((s) => s.includes("LinkedIn"))).toBe(true);
  });

  it("detects lack of quantifiable metrics in bullet points", () => {
    const weakResume = {
      ...PREFILLED_TEMPLATES[0].data,
      workExperience: [
        {
          company: "Acme Corp",
          jobTitle: "Developer",
          location: "Remote",
          startDate: "2022",
          endDate: "2023",
          highlights: [
            "Responsible for writing code and attending meetings",
            "Worked on web application development with team",
          ],
        },
      ],
    };
    const result = calculateAtsScore(weakResume);
    expect(result.metricsCount).toBe(0);
    expect(result.score).toBeLessThan(75);
    expect(result.suggestions.some((s) => s.includes("metrics"))).toBe(true);
  });
});
