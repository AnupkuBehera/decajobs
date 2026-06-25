import { NextResponse } from "next/server";
import { scoreResume } from "@/lib/gemini/client";

// Public API — no auth required (for free tool)
// Limited: shows score + 2 suggestions. Full analysis requires login.
export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short. Please paste at least 50 characters." }, { status: 400 });
    }

    const truncated = resumeText.slice(0, 3000); // Limit for free
    const result = await scoreResume(truncated);

    // Free tier: limit to score + 2 suggestions only
    const limitedResult = {
      score: result.score,
      sections: result.sections?.slice(0, 3), // Only 3 sections
      suggestions: result.suggestions?.slice(0, 2), // Only 2 suggestions
      isLimited: true,
      upgradeMessage: "Sign up for free to see all suggestions and detailed analysis.",
    };

    return NextResponse.json(limitedResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Resume Check] Error:", message);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
