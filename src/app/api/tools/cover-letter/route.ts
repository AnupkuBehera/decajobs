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

    let letter = "";
    try {
      letter = await callGemini(prompt);
    } catch {
      // High-quality deterministic fallback letter
      letter = generateFallbackCoverLetter(role, company, skills);
    }

    const words = letter.split(" ");
    const preview = words.slice(0, 150).join(" ");
    const isTruncated = words.length > 150;

    return NextResponse.json({
      coverLetter: isTruncated ? preview + "..." : letter,
      isLimited: isTruncated,
      fullLength: words.length,
      upgradeMessage: isTruncated ? "Sign up free to see the full cover letter and download as PDF." : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function generateFallbackCoverLetter(role: string, company?: string, skills?: string): string {
  const targetCompany = company?.trim() || "your organization";
  const cleanSkills = skills?.trim() || "software engineering and modern technology workflows";

  return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${role} position at ${targetCompany}. With a dedicated background in ${cleanSkills}, I have developed a strong foundation of practical execution, collaborative problem-solving, and measurable business delivery.

Throughout my experience, I have focused on solving real-world operational challenges by applying best practices in ${cleanSkills}. Whether optimizing core workflows, leading project milestones, or collaborating across engineering, product, and business stakeholders, I prioritize quality, speed, and continuous improvement. I am particularly impressed by ${targetCompany}'s industry leadership and reputation for high standards, and I am excited about the opportunity to contribute directly to your team's upcoming initiatives.

What sets my approach apart is a commitment to combining technical discipline with proactive communication. I am confident that my background, enthusiasm, and focus on delivering business value will make an immediate and meaningful addition to your team.

Thank you very much for your time and consideration. I look forward to the possibility of discussing how my skills and experience align with ${targetCompany}'s hiring goals.

Sincerely,
Applicant`;
}
