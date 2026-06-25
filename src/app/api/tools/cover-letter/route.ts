import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

export async function POST(request: Request) {
  try {
    const { role, company, skills } = await request.json();
    if (!role || !skills) return NextResponse.json({ error: "Role and skills required" }, { status: 400 });

    const prompt = `Write a professional cover letter (300-400 words) for a "${role}" position${company ? ` at ${company}` : ""}. 

The candidate's background: ${skills}

The cover letter should:
- Open with a strong, personalized hook
- Highlight relevant experience and skills
- Show enthusiasm for the role
- End with a confident call to action

Return ONLY the cover letter text. No JSON, no markdown formatting.`;

    const result = await callGemini(prompt);

    // Free tier: show only first 150 words, blur the rest
    const words = result.split(" ");
    const preview = words.slice(0, 150).join(" ");
    const isTruncated = words.length > 150;

    return NextResponse.json({
      coverLetter: isTruncated ? preview + "..." : result,
      isLimited: isTruncated,
      fullLength: words.length,
      upgradeMessage: isTruncated ? "Sign up free to see the full cover letter and download as PDF." : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI busy";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
