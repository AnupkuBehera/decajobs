import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

export async function POST(request: Request) {
  try {
    const { role } = await request.json();
    if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 });

    const prompt = `Generate 3 common interview questions for a "${role}" position. For each question, provide a brief answering tip (1-2 sentences).

Respond in this exact JSON format (no markdown):
{"questions":[{"question":"...","tip":"..."},{"question":"...","tip":"..."},{"question":"...","tip":"..."}],"isLimited":true,"upgradeMessage":"Sign up to get 8+ questions with detailed answers."}`;

    const result = await callGemini(prompt);
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: "AI is busy. Please try again in a minute." }, { status: 503 });
  }
}
