import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/gemini/client";

export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, ...params } = await request.json();

  try {
    switch (action) {
      case "skill-gap": {
        const { resumeText, jobDescription } = params;
        if (!resumeText || !jobDescription) return NextResponse.json({ error: "Resume and job description required" }, { status: 400 });
        const result = await callGemini(`Analyze the skill gap between this resume and job description.

Resume: ${resumeText.slice(0, 3000)}

Job Description: ${jobDescription.slice(0, 2000)}

Respond in JSON (no markdown):
{"matchPercentage":75,"matchingSkills":["skill1","skill2"],"missingSkills":["skill1","skill2"],"recommendations":[{"skill":"skill name","course":"course name","platform":"Coursera/Udemy/YouTube","url":"https://...","priority":"high/medium/low"}],"summary":"Brief analysis"}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "follow-up-email": {
        const { context, type, companyName, role, interviewDate } = params;
        const prompt = type === "thank-you"
          ? `Write a professional thank-you email to send within 24 hours after a job interview.
Role: ${role}
Company: ${companyName}
Interview date: ${interviewDate || "today"}
Additional context: ${context || "None"}

Write a concise, warm, professional email (150-200 words). Include: gratitude, reference something specific from the interview, reiterate interest, call to action. Return ONLY the email text with Subject line.`
          : `Write a professional follow-up email for a job application where I haven't heard back.
Role: ${role}
Company: ${companyName}
Context: ${context || "Applied 1 week ago, no response"}

Write a polite, brief follow-up (100-150 words). Be professional, not pushy. Return ONLY the email text with Subject line.`;
        const email = await callGemini(prompt);
        return NextResponse.json({ email });
      }

      case "ats-scan": {
        const { resumeText, jobDescription } = params;
        if (!resumeText || !jobDescription) return NextResponse.json({ error: "Both fields required" }, { status: 400 });
        const result = await callGemini(`You are an ATS (Applicant Tracking System) simulator. Score this resume against the job description.

Resume: ${resumeText.slice(0, 3000)}
Job Description: ${jobDescription.slice(0, 2000)}

Respond in JSON (no markdown):
{"atsScore":72,"keywordsFound":["keyword1","keyword2"],"keywordsMissing":["keyword1","keyword2"],"formatIssues":["issue1","issue2"],"suggestions":["suggestion1","suggestion2","suggestion3"],"willPass":true}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "career-coach": {
        const { question, context } = params;
        if (!question) return NextResponse.json({ error: "Question required" }, { status: 400 });
        const answer = await callGemini(`You are an expert career coach. Answer this career question helpfully and concisely (200-300 words).

${context ? `Context about the user: ${context}` : ""}

Question: ${question}

Give practical, actionable advice. Be supportive but honest.`);
        return NextResponse.json({ answer });
      }

      case "ghost-job-detect": {
        const { jobTitle, company, postedDate, description } = params;
        const result = await callGemini(`Analyze if this job listing might be a "ghost job" (not actively being filled). Consider:
- How old the posting is
- Whether the description is generic vs specific
- Red flags in the listing

Job Title: ${jobTitle}
Company: ${company}
Posted Date: ${postedDate || "Unknown"}
Description: ${description?.slice(0, 1000) || "Not provided"}

Respond in JSON (no markdown):
{"riskLevel":"low/medium/high","score":25,"redFlags":["flag1","flag2"],"greenFlags":["flag1","flag2"],"recommendation":"Apply/Skip/Apply with caution","reasoning":"Brief explanation"}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "culture-fit": {
        const { answers } = params;
        if (!answers) return NextResponse.json({ error: "Answers required" }, { status: 400 });
        const result = await callGemini(`Based on these work preference answers, determine the ideal company culture fit.

Answers: ${JSON.stringify(answers)}

Respond in JSON (no markdown):
{"cultureType":"Startup/Corporate/Remote-first/Agency/Non-profit","traits":["trait1","trait2","trait3"],"idealCompanies":["Company1","Company2","Company3","Company4","Company5"],"workStyle":"Description of ideal work environment","advice":"Career advice based on these preferences"}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "market-trends": {
        const { role, location } = params;
        const result = await callGemini(`Provide current job market trends for 2026.
${role ? `Role: ${role}` : ""}
${location ? `Location: ${location}` : "India"}

Respond in JSON (no markdown):
{"topRoles":[{"title":"role","demand":"high/medium","avgSalary":"₹X LPA","growth":"X%"}],"hotSkills":["skill1","skill2","skill3","skill4","skill5"],"industryTrends":["trend1","trend2","trend3"],"advice":"Brief market advice for job seekers","outlook":"positive/neutral/challenging"}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error(`[AI Tools] ${action} error:`, error);
    return NextResponse.json({ error: "AI is currently busy. Please try again in a minute." }, { status: 503 });
  }
}
