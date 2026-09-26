import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

// Public — no auth required
export async function POST(request: Request) {
  try {
    const { currentRole, targetRole, skills, experience } = await request.json();
    if (!currentRole && !targetRole) return NextResponse.json({ error: "Role required" }, { status: 400 });

    try {
      const result = await callGemini(`Generate 5 optimized LinkedIn headlines.
Current: ${currentRole || "N/A"}, Target: ${targetRole || currentRole}, Skills: ${skills || "N/A"}, Experience: ${experience || "N/A"}
Rules: include job title keyword, 2-3 skills, value prop, under 120 chars.
JSON (no markdown): {"headlines":["h1","h2","h3","h4","h5"],"tips":["tip1","tip2","tip3"]}`);
      return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch {
      // Deterministic LinkedIn headline formulas fallback
      return NextResponse.json(generateFallbackHeadlines({ currentRole, targetRole, skills, experience }));
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function generateFallbackHeadlines(input: {
  currentRole?: string;
  targetRole?: string;
  skills?: string;
  experience?: string;
}) {
  const role = input.targetRole || input.currentRole || "Professional";
  const skillList = (input.skills || "Scalable Systems, Agile, Team Leadership")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const s1 = skillList[0] || "Architecture";
  const s2 = skillList[1] || "Execution";
  const exp = input.experience?.trim() ? ` | ${input.experience} YOE` : "";

  return {
    headlines: [
      `${role} | Specializing in ${s1} & ${s2} | Delivering High-Impact Business Solutions`,
      `Aspiring ${role} | Passionate About ${s1}, ${s2} & Modern Engineering`,
      `${role}${exp} | Building Resilient Systems with ${s1} & ${s2}`,
      `Results-Driven ${role} | Helping Fast-Growing Teams Scale ${s1} & ${s2}`,
      `${role} | Exceeding Goals in ${s1} | Open to Opportunities`,
    ],
    tips: [
      "Keep your target job title in the first 40 characters so mobile search snippets show your primary role.",
      "Incorporate 2-3 specific technical keywords that recruiters actively search for.",
      "End with a short value proposition or specific business outcome rather than generic buzzwords.",
    ],
  };
}
