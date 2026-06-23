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
    return NextResponse.json({ coverLetter: result });
  } catch {
    return NextResponse.json({ error: "AI is busy. Please try again in a minute." }, { status: 503 });
  }
}
