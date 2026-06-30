import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/gemini/client";
import { checkSubscription } from "@/lib/subscription/check";

/**
 * POST /api/job-tools
 *
 * Pro-only API for per-job AI tools:
 * - "interview-prep": Generate interview questions, company research, talking points
 * - "tailor-resume": Generate a tailored resume for a specific job listing
 */
export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check Pro subscription
  const sub = await checkSubscription(authClient, user.id);
  if (!sub.hasAccess) {
    return NextResponse.json({
      error: "trial_expired",
      message: sub.message,
    }, { status: 403 });
  }

  const { action, ...params } = await request.json();

  try {
    switch (action) {
      case "interview-prep": {
        const { jobTitle, jobDescription, jobLocation, company } = params;
        if (!jobTitle || !jobDescription) {
          return NextResponse.json({ error: "Job title and description required" }, { status: 400 });
        }

        // Fetch user profile for context
        const { data: profile } = await authClient
          .from("candidate_profiles")
          .select("target_titles, skills, location")
          .eq("candidate_id", user.id)
          .maybeSingle();

        const prompt = `You are a senior interview coach. Generate comprehensive interview preparation materials for this candidate and job.

JOB DETAILS:
- Title: ${jobTitle}
- Company: ${company || "Unknown"}
- Location: ${jobLocation || "Not specified"}
- Description: ${jobDescription.slice(0, 3000)}

CANDIDATE PROFILE:
- Target roles: ${profile?.target_titles?.join(", ") || "Not specified"}
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Location: ${profile?.location || "Not specified"}

Generate interview prep in this exact JSON format (no markdown, no code blocks):
{
  "companyResearch": {
    "overview": "2-3 sentence company summary",
    "culture": "What the company values based on the job description",
    "recentNews": "Suggest what to research about this company"
  },
  "technicalQuestions": [
    {"question": "...", "hint": "How to approach this answer", "difficulty": "easy|medium|hard"},
    {"question": "...", "hint": "...", "difficulty": "..."},
    {"question": "...", "hint": "...", "difficulty": "..."},
    {"question": "...", "hint": "...", "difficulty": "..."},
    {"question": "...", "hint": "...", "difficulty": "..."}
  ],
  "behavioralQuestions": [
    {"question": "...", "starTip": "Situation-Task-Action-Result guidance"},
    {"question": "...", "starTip": "..."},
    {"question": "...", "starTip": "..."}
  ],
  "talkingPoints": [
    "Key point to emphasize based on your skills matching this role",
    "Another strength to highlight",
    "Experience that directly maps to their requirements"
  ],
  "questionsToAsk": [
    "Smart question to ask the interviewer",
    "Another thoughtful question",
    "Question showing genuine interest"
  ],
  "salaryRange": "Estimated range for this role/location if determinable, or 'Research needed'"
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return NextResponse.json(JSON.parse(cleaned));
      }

      case "tailor-resume": {
        const { jobTitle, jobDescription, company } = params;
        if (!jobTitle || !jobDescription) {
          return NextResponse.json({ error: "Job title and description required" }, { status: 400 });
        }

        // Fetch user profile
        const { data: profile } = await authClient
          .from("candidate_profiles")
          .select("target_titles, skills, location, resume_url")
          .eq("candidate_id", user.id)
          .maybeSingle();

        if (!profile?.skills?.length) {
          return NextResponse.json({ error: "Please complete your profile with skills first" }, { status: 400 });
        }

        const prompt = `You are an expert resume writer. Create a tailored resume optimized for this specific job listing.

JOB DETAILS:
- Title: ${jobTitle}
- Company: ${company || "Unknown"}
- Description: ${jobDescription.slice(0, 3000)}

CANDIDATE INFORMATION:
- Target roles: ${profile.target_titles?.join(", ") || jobTitle}
- Skills: ${profile.skills.join(", ")}
- Location: ${profile.location || "Not specified"}

Generate a tailored resume in this exact JSON format (no markdown, no code blocks):
{
  "summary": "3-4 sentence professional summary tailored to this exact role, highlighting the most relevant skills and experience",
  "highlightedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "experienceBullets": [
    "Achievement-oriented bullet point using metrics where possible, tailored to match job requirements",
    "Another bullet demonstrating relevant capability",
    "Third bullet showing transferable skills",
    "Fourth bullet with quantified impact",
    "Fifth bullet showing leadership or initiative"
  ],
  "keywordsToInclude": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tailoringTips": [
    "Specific suggestion for how to customize further",
    "Another tip for maximizing match",
    "ATS optimization advice for this job"
  ],
  "matchScore": 85,
  "coverLetterOpener": "A compelling 2-sentence opening for a cover letter to this specific company/role"
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return NextResponse.json(JSON.parse(cleaned));
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[Job Tools] Error:", err);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
