import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callGemini } from "@/lib/gemini/client";
import { checkSubscription } from "@/lib/subscription/check";
import { getPersonaById } from "@/lib/interview/personas";

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
    const persona = getPersonaById(params.personaId || "tech-lead");

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
        const prompt = `You are ${persona.name}, a ${persona.role} at a ${persona.companyArchetype}.
Your persona style: ${persona.tone}.
Your probing specialty: ${persona.probeStyle}.

Conducting a ${type} interview for a ${jobTitle} position.

JOB DETAILS:
${jobDescription ? `Description: ${jobDescription.slice(0, 2000)}` : "No description provided"}

CANDIDATE:
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Target roles: ${profile?.target_titles?.join(", ") || jobTitle}

Generate the FIRST interview question in character. Introduce yourself briefly (1 sentence) and ask your opening question.

Respond in this exact JSON format (no markdown, no code blocks):
{
  "greeting": "Hi, I'm ${persona.name}. Thanks for taking the time to speak with me today.",
  "question": "The interview question to ask",
  "questionType": "technical|behavioral|situational",
  "difficulty": "easy|medium|hard",
  "tip": "A brief hint about what the interviewer is looking for",
  "questionNumber": 1,
  "totalQuestions": 5
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

        // Count filler words
        const fillerMatches = answer.match(/\b(um|uh|like|basically|actually|you know|sort of|kind of)\b/gi) || [];
        const fillerCount = fillerMatches.length;

        const prompt = `You are ${persona.name}, a ${persona.role}.
Tone: ${persona.tone}.

Evaluating candidate's response for a ${jobTitle || "software"} role.

QUESTION (${questionType || "general"}): ${question}
CANDIDATE'S SPOKEN/TYPED ANSWER: ${answer.slice(0, 3000)}

Analyze their answer. If it was a behavioral question, assess STAR format (Situation, Task, Action, Result).
If technical, evaluate technical depth and accuracy.
Provide an in-character adaptive follow-up probing question to dig deeper into what they said.

Respond in this exact JSON format (no markdown, no code blocks):
{
  "score": 8,
  "maxScore": 10,
  "strengths": ["Clear communication of the problem", "Specific metrics mentioned"],
  "improvements": ["Elaborate on personal ownership vs team contribution", "Detail trade-offs"],
  "starBreakdown": {
    "situation": "Identified the core problem context",
    "task": "Defined their exact responsibility",
    "action": "Described technical/operational steps taken",
    "result": "Mentioned outcome or metric impact"
  },
  "followupProbe": "A sharp, natural in-character follow-up question digging into a specific detail they mentioned",
  "sampleAnswer": "A concise example of an ideal, punchy response (2-3 sentences)",
  "overallFeedback": "1-2 sentence executive assessment"
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const evaluation = JSON.parse(cleaned);
        evaluation.questionNumber = questionNumber || 1;
        evaluation.fillerCount = fillerCount;
        return NextResponse.json(evaluation);
      }

      case "next": {
        const { jobTitle, jobDescription, interviewType, previousQuestions, questionNumber } = params;

        const prevQuestionsText = (previousQuestions || [])
          .map((q: string, i: number) => `Q${i + 1}: ${q}`)
          .join("\n");

        const type = interviewType || "mixed";
        const qNum = questionNumber || 2;

        const prompt = `You are ${persona.name}, a ${persona.role}.
Tone: ${persona.tone}. Specialty: ${persona.specialty}.

Conducting a ${type} interview for a ${jobTitle} position.
${jobDescription ? `JOB: ${jobDescription.slice(0, 1500)}` : ""}

PREVIOUS QUESTIONS ASKED:
${prevQuestionsText || "None"}

Generate interview question #${qNum} of 5. Progressively test depth.
Respond in this exact JSON format (no markdown, no code blocks):
{
  "question": "The interview question to ask",
  "questionType": "technical|behavioral|situational",
  "difficulty": "medium|hard",
  "tip": "Brief guidance on what to cover",
  "questionNumber": ${qNum},
  "totalQuestions": 5
}`;

        const result = await callGemini(prompt);
        const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return NextResponse.json(JSON.parse(cleaned));
      }

      case "finish": {
        const { jobTitle, completedQuestions } = params;

        const summaryText = (completedQuestions || [])
          .map(
            (item: any, i: number) =>
              `Q${i + 1}: ${item.question?.question}\nAnswer: ${item.answer}\nScore: ${item.evaluation?.score}/10`
          )
          .join("\n\n");

        const prompt = `You are ${persona.name}, hiring lead.
Review this full interview candidate transcript for a ${jobTitle} position and compile a final hire scorecard:

TRANSCRIPT:
${summaryText.slice(0, 4000)}

Respond in this exact JSON format (no markdown, no code blocks):
{
  "readinessScore": 84,
  "hireDecision": "Strong Hire|Hire|Leaning Hire|Needs Practice",
  "radarScores": {
    "technical": 85,
    "starStructure": 80,
    "communication": 90,
    "confidence": 85
  },
  "keyStrengths": ["Technical precision", "Clear architecture articulation"],
  "topActionItems": ["Elaborate on production failure modes", "Quantify revenue or latency impact earlier in answers"],
  "executiveSummary": "Overall strong candidate with clear grasp of fundamentals who will perform well in real screens."
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
