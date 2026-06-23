import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

// Public — no auth required
export async function POST(request: Request) {
  try {
    const { currentRole, targetRole, skills, experience } = await request.json();
    if (!currentRole && !targetRole) return NextResponse.json({ error: "Role required" }, { status: 400 });

    const result = await callGemini(`Generate 5 optimized LinkedIn headlines.
Current: ${currentRole || "N/A"}, Target: ${targetRole || currentRole}, Skills: ${skills || "N/A"}, Experience: ${experience || "N/A"}
Rules: include job title keyword, 2-3 skills, value prop, under 120 chars.
JSON (no markdown): {"headlines":["h1","h2","h3","h4","h5"],"tips":["tip1","tip2","tip3"]}`);
    return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
  } catch {
    return NextResponse.json({ error: "AI busy. Try again." }, { status: 503 });
  }
}
