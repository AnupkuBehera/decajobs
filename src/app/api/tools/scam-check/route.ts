import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini/client";

// Public — no auth required
// Public — no auth required
export async function POST(request: Request) {
  try {
    const { jobTitle, company, description, salary, contactInfo, country = "IN" } = await request.json();
    try {
      const result = await callGemini(`You are a global job scam detection expert specializing in employment fraud across India, UAE/Gulf, and Western/Remote markets. Analyze this job listing.

Country/Region Context: ${country === "AE" ? "UAE & Gulf" : country === "US" || country === "GB" ? "Global / Remote" : "India"}
Job Title: ${jobTitle || "Not provided"}
Company: ${company || "Not provided"}
Description: ${description?.slice(0, 1500) || "Not provided"}
Salary: ${salary || "Not mentioned"}
Contact: ${contactInfo || "Not provided"}

Key scam indicators by region:
- UAE/Gulf: Demanding fees for visas, work permits, medical fitness tests, or travel agency flight bookings (strictly illegal under UAE Labour Law Article 6).
- India: Demanding laptop courier/security deposits, registration/training fees, or using fake HR templates of TCS/Wipro/Infosys.
- Remote/Global: Overpayment check cashing, Telegram crypto/rating tasks, equipment purchases from "approved vendors".
- Universal: Personal Gmail/Yahoo contacts, no video interview, upfront money requests.

Respond in JSON (no markdown):
{"safetyScore":75,"verdict":"Safe","redFlags":[],"greenFlags":[],"explanation":"Brief explanation","advice":"What to do"}`);
      return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
    } catch {
      // Deterministic heuristic scam detection fallback
      return NextResponse.json(heuristicScamCheck({ jobTitle, company, description, salary, contactInfo, country }));
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
  country?: string;
}) {
  const text = `${input.jobTitle || ""} ${input.company || ""} ${input.description || ""} ${input.salary || ""} ${input.contactInfo || ""}`.toLowerCase();
  const contact = (input.contactInfo || "").toLowerCase();
  const country = input.country || "IN";

  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  let score = 85;

  // UAE / Gulf specific scams: Visa & Travel fees
  if (
    text.includes("visa fee") ||
    text.includes("visa charge") ||
    text.includes("work permit fee") ||
    text.includes("travel agency") ||
    text.includes("air ticket booking fee") ||
    text.includes("medical fitness fee") ||
    text.includes("emirates id fee")
  ) {
    redFlags.push(
      "UAE Labour Law Violation: Under Article 6 of UAE Ministerial Resolution 275/2006, the employer must bear 100% of visa, medical, and relocation costs. Demanding candidate-paid visa fees or flight bookings via designated travel agencies is 100% fraudulent."
    );
    score -= 45;
  }

  // India specific scams: Laptop deposit / Training fees / Courier charges
  if (
    text.includes("laptop deposit") ||
    text.includes("courier charge") ||
    text.includes("gate pass") ||
    text.includes("training fee") ||
    text.includes("registration fee") ||
    text.includes("security deposit") ||
    text.includes("processing charge")
  ) {
    redFlags.push(
      "Indian Corporate Scam Pattern: Legitimate employers (e.g. TCS, Infosys, top startups) never charge laptop courier deposits, registration fees, or onboarding charges."
    );
    score -= 40;
  }

  // Global / Remote check scams & crypto task scams
  if (
    text.includes("cashier check") ||
    text.includes("crypto") ||
    text.includes("wire transfer") ||
    text.includes("pay upfront") ||
    text.includes("like youtube videos") ||
    text.includes("rating task") ||
    text.includes("recharge account")
  ) {
    redFlags.push("Task/Check Fraud Pattern: Mentions cryptocurrency transfers, upfront deposits, or paid tasks (e.g. liking videos/ratings) designed to steal funds.");
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

  score = Math.max(10, Math.min(95, score));

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
