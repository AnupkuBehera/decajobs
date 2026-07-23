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

    const truncated = resumeText.slice(0, 3000); // Limit for free
    const result = await scoreResumeFree(truncated);

    // Free tier: limit to score + 2 suggestions only (safety fallback)
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
    
    // Check if error is due to rate limits or quota
    const isRateLimited = message.toLowerCase().includes("rate limit") || 
                          message.toLowerCase().includes("429") || 
                          message.toLowerCase().includes("quota");
    
    const status = isRateLimited ? 429 : 503;
    const userFriendlyMessage = isRateLimited
      ? "Rate limit exceeded. The free AI tool is currently busy. Please wait a minute or sign up for a free account to get immediate access."
      : message;
      
    return NextResponse.json({ error: userFriendlyMessage }, { status });
  }
}
