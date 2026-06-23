import { NextResponse } from "next/server";
import { scoreResume } from "@/lib/gemini/client";

// Public API — no auth required (for free tool)
export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short" }, { status: 400 });
    }

    // Limit text to prevent abuse (max 5000 chars for free tier)
    const truncated = resumeText.slice(0, 5000);
    const result = await scoreResume(truncated);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Resume Check] Error:", error);
    return NextResponse.json(
      { error: "AI is currently busy. Please try again in a minute." },
      { status: 503 }
    );
  }
}
