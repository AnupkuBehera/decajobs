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

    const truncatedResume = resumeText.slice(0, 3000);
    const truncatedJob = jobDescription.slice(0, 3000);

    const result = await matchResumeToJob(truncatedResume, truncatedJob);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Resume Match] Error:", message);

    const isRateLimited =
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("429") ||
      message.toLowerCase().includes("quota");

    const status = isRateLimited ? 429 : 503;
    const userFriendlyMessage = isRateLimited
      ? "Rate limit exceeded. The free AI tool is currently busy. Please wait a minute or sign up for a free account to get immediate access."
      : message;

    return NextResponse.json({ error: userFriendlyMessage }, { status });
  }
}
