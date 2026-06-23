import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/gemini/client";
import { checkSubscription } from "@/lib/subscription/check";

export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await checkSubscription(authClient, user.id);
  if (!sub.hasAccess) {
    return NextResponse.json({ error: "trial_expired", message: sub.message, subscribeUrl: "/subscribe" }, { status: 403 });
  }

  const { action, ...params } = await request.json();

  try {
    switch (action) {
      case "cold-email": {
        const { recruiterName, recruiterRole, company, jobRole, yourBackground } = params;
        if (!company || !jobRole) return NextResponse.json({ error: "Company and job role required" }, { status: 400 });
        const result = await callGemini(`Write a personalized cold outreach email/LinkedIn message to a recruiter.

Recruiter: ${recruiterName || "Hiring Manager"}
Recruiter Title: ${recruiterRole || "Recruiter"}
Company: ${company}
Role I'm interested in: ${jobRole}
My Background: ${yourBackground || "Not provided"}

Write TWO versions:
1. A short LinkedIn connection message (50-100 words)
2. A cold email (150-200 words)

Both should be: personalized, respectful of their time, mention specific value you bring, not generic/spammy.

Return in JSON (no markdown):
{"linkedinMessage":"...","email":{"subject":"...","body":"..."},"tips":["tip1","tip2","tip3"]}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "scam-detect": {
        const { jobTitle, company, description, salary, contactInfo } = params;
        const result = await callGemini(`You are a job scam detection expert. Analyze this job listing for scam indicators.

Job Title: ${jobTitle || "Not provided"}
Company: ${company || "Not provided"}
Description: ${description?.slice(0, 1500) || "Not provided"}
Salary mentioned: ${salary || "Not mentioned"}
Contact info: ${contactInfo || "Not provided"}

Common scam indicators: asks for upfront payment, unrealistic salary, no company website, personal email (gmail/yahoo) for official communication, too vague description, data harvesting (asks SSN/bank details upfront), "no experience needed" for senior roles.

Respond in JSON (no markdown):
{"safetyScore":85,"verdict":"Safe/Suspicious/Likely Scam","redFlags":["flag1","flag2"],"greenFlags":["flag1","flag2"],"explanation":"Brief explanation","advice":"What to do next"}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "linkedin-headline": {
        const { currentRole, skills, targetRole, experience } = params;
        if (!currentRole && !targetRole) return NextResponse.json({ error: "Role info required" }, { status: 400 });
        const result = await callGemini(`Generate 5 optimized LinkedIn headlines for maximum recruiter visibility.

Current Role: ${currentRole || "Not specified"}
Target Role: ${targetRole || currentRole || "Not specified"}
Key Skills: ${skills || "Not specified"}
Years of Experience: ${experience || "Not specified"}

Rules for great LinkedIn headlines:
- Include primary keyword (job title) recruiters search for
- Add 2-3 top skills separated by | or •
- Include a value proposition or result
- Keep under 120 characters each
- No emojis in the first headline, optional in others

Respond in JSON (no markdown):
{"headlines":["headline1","headline2","headline3","headline4","headline5"],"tips":["Why these work tip1","tip2","tip3"]}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      case "career-path": {
        const { currentRole, experience, skills, interests } = params;
        if (!currentRole) return NextResponse.json({ error: "Current role required" }, { status: 400 });
        const result = await callGemini(`Create a career path visualization for someone currently in this role.

Current Role: ${currentRole}
Experience: ${experience || "2-3 years"}
Skills: ${skills || "Not specified"}
Interests: ${interests || "Not specified"}

Show 3 different career paths they could take in the next 2-5 years. For each path show:
- Next role (1-2 years)
- Advanced role (3-5 years)
- Skills needed to get there
- Estimated salary progression

Respond in JSON (no markdown):
{"currentRole":"${currentRole}","paths":[{"name":"Path name","description":"Brief description","steps":[{"role":"Next Role","timeline":"1-2 years","salary":"₹X-Y LPA","skillsNeeded":["skill1","skill2"]},{"role":"Advanced Role","timeline":"3-5 years","salary":"₹X-Y LPA","skillsNeeded":["skill1","skill2"]}]},{"name":"Path 2","description":"...","steps":[...]},{"name":"Path 3","description":"...","steps":[...]}],"advice":"Overall career advice"}`);
        return NextResponse.json(JSON.parse(result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()));
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error(`[AI Extra] ${action} error:`, error);
    return NextResponse.json({ error: "AI is busy. Please try again in a minute." }, { status: 503 });
  }
}
