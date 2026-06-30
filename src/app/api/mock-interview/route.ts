import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/gemini/client";
import { checkSubscription } from "@/lib/subscription/check";

/**
 * POST /api/mock-interview
 *
 * AI Mock Interview API. Supports three actions:
 * - "start": Generate initial interview questions for a role
 * - "evaluate": Score the user's answer and provide feedback
 * - "next": Get the next question based on conversation context
 */
export async function POST(request: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      case "start": {
        const { jobTitle, jobDescription, interviewType } = params;
        if (!jobTitle) return NextResponse.json({ error: "Job title required" }, { status: 400 });

        // Fetch profile for context
        const { data: profile } = await authClient
          .from("candidate_profiles")
          .select("target_titles, skills, location")
          .eq("candidate_id", user.id)
          .maybeSingle();

        const type = interviewType || "mixed";
        const prompt = `You are a senior hiring manager conducting a ${type} interview for a ${jobTitle} position.

JOB DETAILS:
${jobDescription ? `Description: ${jobDescription.slice(0, 2000)}` : "No description provided"}

CANDIDATE:
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Target roles: ${profile?.target_titles?.join(", ") || jobTitle}

Generate the FIRST interview question. This should be an opening question appropriate for a ${type} interview (technical, behavioral, or mixed).

Respond in this exact JSON format (no markdown, no code blocks):
{
  "question": "The interview question to ask",
  "questionType": "technical|behavioral|situational",
  "difficulty": "easy|medium|hard",
  "tip": "A brief hint about what the interviewer is looking for",
  "questionNumber": 1,
  "totalQuestions": 6
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return NextResponse.json(JSON.parse(cleaned));
      }

      case "evaluate": {
        const { question, answer, jobTitle, questionType, questionNumber } = params;
        if (!question || !answer) {
          return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
        }

        const prompt = `You are a senior hiring manager evaluating a candidate's interview answer for a ${jobTitle || "software"} role.

QUESTION (${questionType || "general"}): ${question}

CANDIDATE'S ANSWER: ${answer.slice(0, 3000)}

Evaluate their answer and provide detailed feedback. Be encouraging but honest.

Respond in this exact JSON format (no markdown, no code blocks):
{
  "score": 7,
  "maxScore": 10,
  "strengths": ["What they did well - point 1", "What they did well - point 2"],
  "improvements": ["How they could improve - point 1", "How they could improve - point 2"],
  "sampleAnswer": "A brief example of an ideal answer (2-3 sentences showing the key points they should hit)",
  "overallFeedback": "1-2 sentence summary of their performance on this question"
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const evaluation = JSON.parse(cleaned);
        evaluation.questionNumber = questionNumber || 1;
        return NextResponse.json(evaluation);
      }

      case "next": {
        const { jobTitle, jobDescription, interviewType, previousQuestions, questionNumber } = params;

        const prevQuestionsText = (previousQuestions || [])
          .map((q: string, i: number) => `Q${i + 1}: ${q}`)
          .join("\n");

        const type = interviewType || "mixed";
        const qNum = questionNumber || 2;

        const prompt = `You are a senior hiring manager conducting a ${type} interview for a ${jobTitle} position.

${jobDescription ? `JOB: ${jobDescription.slice(0, 1500)}` : ""}

PREVIOUS QUESTIONS ASKED:
${prevQuestionsText || "None"}

Generate question #${qNum} of 6. Make it progressively harder. Don't repeat topics from previous questions. Mix technical and behavioral if type is "mixed".

Respond in this exact JSON format (no markdown, no code blocks):
{
  "question": "The next interview question",
  "questionType": "technical|behavioral|situational",
  "difficulty": "easy|medium|hard",
  "tip": "Brief hint about what to include in the answer",
  "questionNumber": ${qNum},
  "totalQuestions": 6
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return NextResponse.json(JSON.parse(cleaned));
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[Mock Interview] Error:", err);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
