import type { ResumeContent } from "@/lib/gemini/client";

export interface AtsScoreResult {
  score: number;
  grade: "A+" | "A" | "B" | "Needs Improvement";
  metricsCount: number;
  actionVerbsCount: number;
  checks: {
    name: string;
    passed: boolean;
    points: number;
    tip?: string;
  }[];
  suggestions: string[];
}

const ACTION_VERBS = new Set([
  "architected", "spearheaded", "engineered", "built", "designed", "led", "developed",
  "orchestrated", "optimized", "managed", "deployed", "scaled", "automated", "delivered",
  "mentored", "achieved", "increased", "decreased", "reduced", "championed", "constructed",
  "revamped", "formulated", "audited", "spearhead", "conducted", "standardized", "migrated",
  "partnered", "negotiated", "established", "structured", "facilitated", "authored", "identified",
  "created", "implemented", "resolved", "executed", "collaborated", "supervised", "directed",
  "improved", "boosted", "accelerated", "streamlined", "maintained", "analyzed", "expanded",
]);

const METRIC_REGEX = /(\d+(\.\d+)?%|\$\d+(\.\d+)?[kKmMbB]?|£\d+|€\d+|₹\d+|\b\d{1,3}(,\d{3})+\b|\b\d+\+?\s*(x|X|users|events|hours|days|weeks|months|years|members|teams|projects|engineers|clients|customers|repos|stars|requests|tickets|mqls|arr|gmv))/i;

export function calculateAtsScore(resume: ResumeContent | null | undefined): AtsScoreResult {
  if (!resume) {
    return {
      score: 0,
      grade: "Needs Improvement",
      metricsCount: 0,
      actionVerbsCount: 0,
      checks: [],
      suggestions: ["Add your contact details, work history, and skills to get started."],
    };
  }

  const checks: AtsScoreResult["checks"] = [];
  const suggestions: string[] = [];

  const p = resume.personalInfo || {};
  const hasName = Boolean(p.fullName && p.fullName.trim().length > 2);
  const hasEmail = Boolean(p.email && p.email.includes("@"));
  const hasPhone = Boolean(p.phone && p.phone.trim().length >= 7);
  const hasLocation = Boolean(p.location && p.location.trim().length > 2);
  const hasLinkedIn = Boolean(p.linkedinUrl && p.linkedinUrl.includes("linkedin.com"));

  // 1. Contact Information (15 pts)
  let contactPts = 0;
  if (hasName) contactPts += 3;
  if (hasEmail) contactPts += 4;
  if (hasPhone) contactPts += 3;
  if (hasLocation) contactPts += 3;
  if (hasLinkedIn) contactPts += 2;

  checks.push({
    name: "Complete Contact Information",
    passed: contactPts >= 13,
    points: contactPts,
    tip: hasLinkedIn ? undefined : "Adding a LinkedIn profile link boosts recruiter response rates by 40%.",
  });
  if (!hasLinkedIn) {
    suggestions.push("Add your LinkedIn profile link in personal details.");
  }
  if (!hasEmail || !hasPhone) {
    suggestions.push("Provide both email and phone number for recruiter screening.");
  }

  // 2. Professional Summary (15 pts)
  const summary = resume.professionalSummary || "";
  const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length;
  let summaryPts = 0;
  if (summaryWords >= 15) summaryPts += 5;
  if (summaryWords >= 30 && summaryWords <= 120) summaryPts += 5;
  if (summary.toLowerCase().includes("experience") || summary.toLowerCase().includes("proven") || summary.toLowerCase().includes("specialized") || summaryWords >= 40) {
    summaryPts += 5;
  }

  checks.push({
    name: "Keyword-Optimized Summary (30-100 words)",
    passed: summaryPts >= 10,
    points: summaryPts,
    tip: summaryWords < 30 ? "Expand your summary to at least 30-50 words highlighting key skills." : undefined,
  });
  if (summaryWords < 25) {
    suggestions.push("Write a 3-4 sentence professional summary packed with target job keywords.");
  }

  // 3. Work Experience & Quantifiable Metrics (35 pts)
  const experiences = resume.workExperience || [];
  const allHighlights = experiences.flatMap((exp) => exp.highlights || []);
  let experiencePts = 0;

  if (experiences.length >= 1) experiencePts += 8;
  if (experiences.length >= 2) experiencePts += 7;
  if (allHighlights.length >= 4) experiencePts += 5;

  // Metric detection
  const highlightsWithMetrics = allHighlights.filter((h) => METRIC_REGEX.test(h));
  const metricsCount = highlightsWithMetrics.length;
  const metricRatio = allHighlights.length > 0 ? metricsCount / allHighlights.length : 0;

  if (metricRatio >= 0.4 || metricsCount >= 4) {
    experiencePts += 15;
  } else if (metricRatio >= 0.2 || metricsCount >= 2) {
    experiencePts += 10;
  } else if (metricsCount >= 1) {
    experiencePts += 5;
  }

  checks.push({
    name: "Quantifiable Metrics in Experience (%, $, #)",
    passed: metricsCount >= 3,
    points: experiencePts,
    tip: metricsCount < 3 ? "Quantify achievements using percentages, dollar amounts, or team sizes." : undefined,
  });

  if (metricsCount < 3) {
    suggestions.push("Include concrete metrics in at least 3 bullet points (e.g. 'reduced latency by 40%', 'managed team of 6').");
  }

  // 4. Action Verbs (20 pts)
  const textLower = allHighlights.join(" ").toLowerCase();
  const matchedVerbs = new Set<string>();
  for (const verb of ACTION_VERBS) {
    if (new RegExp(`\\b${verb}\\b`, "i").test(textLower)) {
      matchedVerbs.add(verb);
    }
  }
  const actionVerbsCount = matchedVerbs.size;
  let actionVerbPts = 0;
  if (actionVerbsCount >= 5) {
    actionVerbPts = 20;
  } else if (actionVerbsCount >= 3) {
    actionVerbPts = 14;
  } else if (actionVerbsCount >= 1) {
    actionVerbPts = 7;
  }

  checks.push({
    name: "Strong Action Verbs (Led, Built, Optimized)",
    passed: actionVerbsCount >= 4,
    points: actionVerbPts,
    tip: actionVerbsCount < 4 ? "Start experience bullet points with strong power verbs rather than 'Responsible for'." : undefined,
  });

  if (actionVerbsCount < 3) {
    suggestions.push("Start bullet points with strong action verbs (e.g. Architected, Spearheaded, Built, Optimized).");
  }

  // 5. Categorized Skills & Education (15 pts)
  const education = resume.education || [];
  const skillCategories = resume.skillCategories || [];
  const totalSkills = skillCategories.flatMap((sc) => sc.skills || []).length;
  let skillsEduPts = 0;

  if (education[0]?.degree) skillsEduPts += 5;
  if (skillCategories.length >= 1 && totalSkills >= 5) skillsEduPts += 5;
  if (skillCategories.length >= 2 || totalSkills >= 10) skillsEduPts += 5;

  checks.push({
    name: "Categorized Skills & Education Credentials",
    passed: skillsEduPts >= 12,
    points: skillsEduPts,
    tip: totalSkills < 8 ? "Add at least 8-12 relevant hard and soft skills grouped by category." : undefined,
  });

  if (totalSkills < 6) {
    suggestions.push("Add more skills relevant to your target role grouped into clear categories.");
  }

  const rawScore = contactPts + summaryPts + experiencePts + actionVerbPts + skillsEduPts;
  const score = Math.min(100, Math.max(0, rawScore));

  let grade: AtsScoreResult["grade"] = "Needs Improvement";
  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 65) grade = "B";

  return {
    score,
    grade,
    metricsCount,
    actionVerbsCount,
    checks,
    suggestions,
  };
}
