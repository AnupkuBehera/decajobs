import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/gemini/client";
import { checkSubscription } from "@/lib/subscription/check";

/**
 * POST /api/career-coach
 *
 * AI Career Coach API.
 * Free users: 3 questions per day
 * Pro users: Unlimited
 *
 * Expects: { message: string, history: Array<{role, content}> }
 */
export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, history } = await request.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Check subscription for rate limiting
  const sub = await checkSubscription(authClient, user.id);
  const isPro = sub.status === "active";

  // Rate limit free users to 3 questions per day
  if (!isPro) {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = `coach_${user.id}_${today}`;

    // Use a simple counter in the candidates table metadata
    const { data: candidate } = await authClient
      .from("candidates")
      .select("coach_usage_date, coach_usage_count")
      .eq("id", user.id)
      .maybeSingle();

    const usageDate = candidate?.coach_usage_date;
    const usageCount = usageDate === today ? (candidate?.coach_usage_count || 0) : 0;

    if (usageCount >= 3) {
      return NextResponse.json({
        error: "daily_limit",
        message: "You've used your 3 free questions today. Upgrade to Pro for unlimited coaching.",
        remaining: 0,
      }, { status: 429 });
    }

    // Increment usage
    await authClient
      .from("candidates")
      .update({
        coach_usage_date: today,
        coach_usage_count: usageCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  // Fetch profile for personalized coaching
  const { data: profile } = await authClient
    .from("candidate_profiles")
    .select("target_titles, skills, location, designation")
    .eq("candidate_id", user.id)
    .maybeSingle();

  // Build conversation context
  const conversationHistory = (history || [])
    .slice(-6) // Keep last 6 messages for context
    .map((msg: { role: string; content: string }) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.content}`)
    .join("\n");

  const prompt = `You are an expert AI Career Coach on DecaJobs. You provide personalized, actionable career advice. You are warm, encouraging, and direct.

CANDIDATE PROFILE:
- Target roles: ${profile?.target_titles?.join(", ") || "Not specified"}
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Location: ${profile?.location || "Not specified"}
- Current role: ${profile?.designation || "Not specified"}

CONVERSATION HISTORY:
${conversationHistory || "None (first message)"}

USER'S QUESTION: ${message}

INSTRUCTIONS:
- Give specific, actionable advice tailored to their profile
- If they ask about career transitions, suggest concrete steps
- If they ask about skills, recommend specific learning resources
- If they ask about salary, provide realistic ranges based on their market
- Keep responses concise (2-4 paragraphs max)
- Use bullet points for actionable items
- Be encouraging but honest — don't sugarcoat reality
- If you don't have enough context, ask a clarifying question
- Never say you're an AI or can't help — always provide value

Respond naturally as a career coach. No JSON, no formatting codes — just helpful advice.`;

  try {
    const response = await callGemini(prompt);

    // Calculate remaining for free users
    let remaining: number | undefined;
    if (!isPro) {
      const { data: updated } = await authClient
        .from("candidates")
        .select("coach_usage_count")
        .eq("id", user.id)
        .maybeSingle();
      remaining = 3 - (updated?.coach_usage_count || 0);
    }

    return NextResponse.json({
      reply: response,
      remaining: isPro ? undefined : remaining,
      isPro,
    });
  } catch (err) {
    console.error("[Career Coach] Error:", err);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
