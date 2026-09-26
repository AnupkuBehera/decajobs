import { NextResponse } from "next/server";
import { scoreResumeFree } from "@/lib/gemini/client";

// Public API — no auth required (for free tool)
// Limited: shows score + 2 suggestions. Full analysis requires login.
export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short. Please paste at least 50 characters." }, { status: 400 });
    }

    try {
      const truncated = resumeText.slice(0, 3000); // Limit for free
      const result = await scoreResumeFree(truncated);

      // Free tier: limit to score + 2 suggestions only (safety fallback)
      return NextResponse.json({
        score: result.score,
        sections: result.sections?.slice(0, 3),
        suggestions: result.suggestions?.slice(0, 2),
        isLimited: true,
        upgradeMessage: "Sign up for free to see all suggestions and detailed analysis.",
      });
    } catch {
      // Graceful algorithmic fallback when Gemini is busy or rate-limited
      const fallbackResult = heuristicScoreResume(resumeText);
      return NextResponse.json(fallbackResult);
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please provide valid resume text." },
      { status: 400 }
    );
  }
}

function heuristicScoreResume(text: string) {
  const lower = text.toLowerCase();
  const wordCount = text.trim().split(/\s+/).length;

  let formatScore = 75;
  let expScore = 70;
  let skillsScore = 75;

  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /[\d+() -]{10,}/.test(text);
  const hasLinkedIn = lower.includes("linkedin") || lower.includes("github");
  if (hasEmail && hasPhone) formatScore += 10;
  if (hasLinkedIn) formatScore += 5;
  if (wordCount >= 250 && wordCount <= 900) formatScore += 5;
  else if (wordCount < 150) formatScore -= 15;

  const actionVerbs = ["led", "developed", "managed", "built", "designed", "created", "increased", "improved", "reduced", "spearheaded", "engineered", "implemented", "delivered", "orchestrated"];
  const actionCount = actionVerbs.filter((v) => lower.includes(v)).length;
  if (actionCount >= 5) expScore += 15;
  else if (actionCount >= 2) expScore += 8;

  const hasMetrics = /[%$₹\d+]/.test(text) && (lower.includes("percent") || lower.includes("%") || lower.includes("revenue") || lower.includes("users") || lower.includes("growth"));
  if (hasMetrics) expScore += 10;

  const techKeywords = ["react", "node", "python", "javascript", "typescript", "sql", "aws", "docker", "figma", "agile", "git", "api", "next.js", "java", "css", "html", "linux"];
  const skillsCount = techKeywords.filter((k) => lower.includes(k)).length;
  if (skillsCount >= 6) skillsScore += 15;
  else if (skillsCount >= 3) skillsScore += 8;

  formatScore = Math.min(95, Math.max(50, formatScore));
  expScore = Math.min(95, Math.max(50, expScore));
  skillsScore = Math.min(95, Math.max(50, skillsScore));

  const overallScore = Math.round(formatScore * 0.3 + expScore * 0.4 + skillsScore * 0.3);

  const suggestions: string[] = [];
  if (!hasMetrics) {
    suggestions.push("Quantify your achievements with numbers (e.g. 'Improved page load speed by 35%' or 'Reduced support ticket response time by 40%').");
  } else {
    suggestions.push("Ensure your strongest quantified metrics appear in the first 2 bullet points under your most recent role.");
  }
  if (actionCount < 4) {
    suggestions.push("Replace passive phrases ('responsible for', 'worked on') with punchy action verbs ('spearheaded', 'orchestrated', 'delivered').");
  } else {
    suggestions.push("Tailor your core technical skills section to mirror the exact keywords found in target job postings.");
  }

  return {
    score: overallScore,
    sections: [
      {
        name: "Format & Layout",
        score: formatScore,
        feedback: formatScore >= 80 ? "Clean structure with identifiable contact information and standard sections." : "Improve standard contact headers and ensure clean single-column readability.",
      },
      {
        name: "Experience & Impact",
        score: expScore,
        feedback: expScore >= 80 ? "Demonstrates strong initiative with actionable project outcomes." : "Add measurable business metrics and quantifiable results to past roles.",
      },
      {
        name: "Skills & Keywords",
        score: skillsScore,
        feedback: skillsScore >= 80 ? "Good density of core industry skills and workflow competencies." : "Group competencies into clear subcategories (Core Languages, Frameworks, Tools).",
      },
    ],
    suggestions: suggestions.slice(0, 2),
    isLimited: true,
    upgradeMessage: "Sign up for free to see all suggestions and detailed analysis.",
  };
}
