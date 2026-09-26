import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

// Public — no auth required
export async function POST(request: Request) {
  try {
    const { jobTitle, company, description, salary, contactInfo } = await request.json();
    try {
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
      // Deterministic heuristic scam detection fallback
      return NextResponse.json(heuristicScamCheck({ jobTitle, company, description, salary, contactInfo }));
    }
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

function heuristicScamCheck(input: {
  jobTitle?: string;
  company?: string;
  description?: string;
  salary?: string;
  contactInfo?: string;
}) {
  const text = `${input.jobTitle || ""} ${input.company || ""} ${input.description || ""} ${input.salary || ""} ${input.contactInfo || ""}`.toLowerCase();
  const contact = (input.contactInfo || "").toLowerCase();

  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  let score = 85;

  // Check upfront money / payment
  if (
    text.includes("registration fee") ||
    text.includes("training fee") ||
    text.includes("security deposit") ||
    text.includes("processing charge") ||
    text.includes("pay upfront") ||
    text.includes("crypto") ||
    text.includes("wire transfer")
  ) {
    redFlags.push("Requests upfront payment, fees, or cryptocurrency — legitimate employers never charge candidates.");
    score -= 40;
  }

  // Check personal email addresses
  if (
    contact.includes("@gmail.com") ||
    contact.includes("@yahoo.com") ||
    contact.includes("@hotmail.com") ||
    contact.includes("@outlook.com")
  ) {
    redFlags.push("Uses free personal email address rather than an official corporate domain.");
    score -= 20;
  } else if (contact.includes("@") && !contact.includes("@gmail")) {
    greenFlags.push("Uses a corporate email address format.");
  }

  // Check instant messenger interviews
  if (text.includes("telegram") || text.includes("whatsapp") || text.includes("signal")) {
    redFlags.push("Conducts screening exclusively over private messaging apps without formal video or company portal interviews.");
    score -= 15;
  }

  // Check vague description
  if ((input.description || "").trim().length < 80) {
    redFlags.push("Job description is extremely vague and lacks concrete role responsibilities.");
    score -= 15;
  } else {
    greenFlags.push("Job description outlines specific workflow responsibilities and competencies.");
  }

  // Check company presence
  if (input.company && input.company.trim().length > 2) {
    greenFlags.push(`Mentions an identifiable hiring entity: ${input.company}.`);
  }

  score = Math.max(15, Math.min(95, score));

  let verdict: "Safe" | "Caution" | "High Risk Scam" = "Safe";
  let explanation = "This listing adheres to standard corporate hiring patterns with no prominent scam indicators detected.";
  let advice = "Verify the employer's official website or careers portal before submitting sensitive personal documents.";

  if (score < 50) {
    verdict = "High Risk Scam";
    explanation = "Critical scam indicators detected. Legitimate companies never request payments, personal banking details, or conduct entire hiring cycles over Telegram.";
    advice = "Do NOT send money, banking details, or copies of government ID. Report this posting immediately.";
  } else if (score < 75) {
    verdict = "Caution";
    explanation = "Some attributes warrant additional verification, such as third-party communication channels or sparse employer details.";
    advice = "Double check the company's verified LinkedIn page or corporate email domain before continuing the interview process.";
  }

  return {
    safetyScore: score,
    verdict,
    redFlags,
    greenFlags,
    explanation,
    advice,
  };
}
