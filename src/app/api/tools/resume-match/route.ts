import { NextResponse } from "next/server";
import { matchResumeToJob } from "@/lib/gemini/client";

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Please paste your full resume text (at least 50 characters)." },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json(
        { error: "Please paste the target job description (at least 30 characters)." },
        { status: 400 }
      );
    }

    try {
      const truncatedResume = resumeText.slice(0, 3000);
      const truncatedJob = jobDescription.slice(0, 3000);
      const result = await matchResumeToJob(truncatedResume, truncatedJob);
      return NextResponse.json(result);
    } catch {
      // Deterministic ATS keyword intersection fallback
      return NextResponse.json(heuristicMatchResumeToJob(resumeText, jobDescription));
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function heuristicMatchResumeToJob(resumeText: string, jobDescription: string) {
  const rLower = resumeText.toLowerCase();
  const jLower = jobDescription.toLowerCase();

  const commonKeywords = [
    "react", "next.js", "node.js", "python", "javascript", "typescript",
    "sql", "postgresql", "mysql", "mongodb", "aws", "azure", "gcp",
    "docker", "kubernetes", "ci/cd", "git", "rest apis", "graphql",
    "agile", "scrum", "microservices", "system design", "linux",
    "figma", "tableau", "power bi", "pandas", "data modeling",
    "seo", "b2b", "crm", "analytics", "cross-functional"
  ];

  const presentInJob = commonKeywords.filter((k) => jLower.includes(k));
  const effectiveJobKeywords = presentInJob.length >= 3 ? presentInJob : commonKeywords.slice(0, 8);

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of effectiveJobKeywords) {
    if (rLower.includes(kw)) {
      matchingKeywords.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    } else {
      missingKeywords.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  const matchRatio = effectiveJobKeywords.length > 0 ? matchingKeywords.length / effectiveJobKeywords.length : 0.65;
  const matchScore = Math.min(92, Math.max(58, Math.round(55 + matchRatio * 35)));

  const missing1 = missingKeywords[0] || "System Design";
  const missing2 = missingKeywords[1] || "Automated Testing";
  const topMatch = matchingKeywords[0] || "Core Technologies";

  return {
    matchScore,
    matchingKeywords: matchingKeywords.slice(0, 5),
    missingKeywords: missingKeywords.slice(0, 5),
    tailoredBullets: [
      `Leveraged ${topMatch} to optimize workflow performance, reducing latency and operational friction by 25%.`,
      `Integrated ${missing1} best practices within cross-functional sprint cycles to ensure reliability and scalable architecture.`,
      `Collaborated with stakeholders to deploy scalable solutions, ensuring adherence to modern ${missing2} benchmarks.`,
    ],
    summaryFeedback: `Your resume demonstrates good fundamental alignment with ${matchingKeywords.length} key competencies detected in this role. Incorporating explicit experience with ${missingKeywords.slice(0, 2).join(" and ")} will significantly boost your ATS match score.`,
  };
}
