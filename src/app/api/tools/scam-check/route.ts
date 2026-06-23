import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

// Public — no auth required
export async function POST(request: Request) {
  try {
    const { jobTitle, company, description, salary, contactInfo } = await request.json();
    const result = await callGemini(`You are a job scam detection expert. Analyze this job listing.

Job Title: ${jobTitle || "Not provided"}
Company: ${company || "Not provided"}
Description: ${description?.slice(0, 1500) || "Not provided"}
Salary: ${salary || "Not mentioned"}
Contact: ${contactInfo || "Not provided"}

Scam indicators: upfront payment, unrealistic salary, personal email, vague description, data harvesting.

Respond in JSON (no markdown):
{"safetyScore":75,"verdict":"Safe","redFlags":[],"greenFlags":[],"explanation":"Brief explanation","advice":"What to do"}`);
    return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
  } catch {
    return NextResponse.json({ error: "AI busy. Try again in a minute." }, { status: 503 });
  }
}
