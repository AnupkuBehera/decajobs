import { NextResponse } from "next/server";
import { scoreResume } from "@/lib/gemini/client";

// Public API — no auth required (for free tool)
export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short. Please paste at least 50 characters." }, { status: 400 });
    }

    const truncated = resumeText.slice(0, 5000);
    const result = await scoreResume(truncated);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Resume Check] Error:", message);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
