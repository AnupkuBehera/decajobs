import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreResume, optimizeResume, generateCoverLetter } from "@/lib/gemini/client";
import { checkSubscription } from "@/lib/subscription/check";

export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription/trial status
  const sub = await checkSubscription(authClient, user.id);
  if (!sub.hasAccess) {
    return NextResponse.json({
      error: "trial_expired",
      message: sub.message,
      subscribeUrl: "/subscribe",
    }, { status: 403 });
  }

  const body = await request.json();
  const { action, resumeText, jobDescription, companyName } = body;

  if (!resumeText) {
    return NextResponse.json({ error: "Resume text is required" }, { status: 400 });
  }

  try {
    switch (action) {
      case "score": {
        const result = await scoreResume(resumeText);
        return NextResponse.json(result);
      }
      case "optimize": {
        if (!jobDescription) {
          return NextResponse.json({ error: "Job description is required for optimization" }, { status: 400 });
        }
        const result = await optimizeResume(resumeText, jobDescription);
        return NextResponse.json(result);
      }
      case "cover-letter": {
        if (!jobDescription) {
          return NextResponse.json({ error: "Job description is required for cover letter" }, { status: 400 });
        }
        const letter = await generateCoverLetter(resumeText, jobDescription, companyName);
        return NextResponse.json({ coverLetter: letter });
      }
      default:
        return NextResponse.json({ error: "Invalid action. Use: score, optimize, or cover-letter" }, { status: 400 });
    }
  } catch (error) {
    console.error("[Resume Tools] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI processing failed" },
      { status: 500 }
    );
  }
}
