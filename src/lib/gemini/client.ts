/**
 * Google Gemini AI Client
 * Used for resume scoring, optimization, and cover letter generation.
 */

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.0-flash";
const LAST_RESORT_MODEL = "gemini-2.0-flash-lite";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

/**
 * Call Google Gemini API with a prompt.
 */
export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set. Please add it in Vercel.");

  const models = [PRIMARY_MODEL, FALLBACK_MODEL, LAST_RESORT_MODEL];
  let lastError = "";

  for (const model of models) {
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      });

      if (response.status === 429) {
        lastError = `${model} rate limited`;
        console.warn(`[Gemini] ${model} rate limited, trying fallback...`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        lastError = `${model} returned ${response.status}: ${errText.slice(0, 200)}`;
        console.error(`[Gemini] ${lastError}`);
        continue;
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      lastError = `${model} returned empty response`;
    } catch (err) {
      lastError = `${model} fetch failed: ${err instanceof Error ? err.message : "unknown"}`;
      console.error(`[Gemini] ${lastError}`);
    }
  }

  throw new Error(`AI unavailable: ${lastError}`);
}

/**
 * Score a resume and provide improvement suggestions.
 */
export async function scoreResume(resumeText: string): Promise<{
  score: number;
  sections: { name: string; score: number; feedback: string }[];
  suggestions: string[];
}> {
  const prompt = `You are an expert resume reviewer. Analyze this resume and provide:
1. An overall score out of 100
2. Section-by-section scores (format, content, skills, experience, education)
3. Top 5 actionable suggestions to improve it

Resume:
${resumeText}

Respond in this exact JSON format (no markdown, no code blocks):
{"score":75,"sections":[{"name":"Format & Layout","score":80,"feedback":"..."},{"name":"Professional Summary","score":70,"feedback":"..."},{"name":"Skills","score":85,"feedback":"..."},{"name":"Experience","score":65,"feedback":"..."},{"name":"Education","score":90,"feedback":"..."}],"suggestions":["suggestion1","suggestion2","suggestion3","suggestion4","suggestion5"]}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { score: 0, sections: [], suggestions: ["Failed to parse AI response. Please try again."] };
  }
}

/**
 * Optimize a resume for a specific job description.
 */
export async function optimizeResume(resumeText: string, jobDescription: string): Promise<{
  optimizedResume: string;
  changes: string[];
  matchScore: number;
}> {
  const prompt = `You are an expert resume optimizer. Given this resume and job description, optimize the resume to better match the job requirements.

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond in this exact JSON format (no markdown, no code blocks):
{"optimizedResume":"[full optimized resume text with improvements]","changes":["change1","change2","change3","change4","change5"],"matchScore":85}

The optimizedResume should be the full rewritten resume text. The changes array should list what you modified. matchScore is how well the optimized resume matches the job (0-100).`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { optimizedResume: resumeText, changes: ["Failed to optimize. Please try again."], matchScore: 0 };
  }
}

/**
 * Generate a cover letter for a specific job.
 */
export async function generateCoverLetter(resumeText: string, jobDescription: string, companyName?: string): Promise<string> {
  const prompt = `You are an expert career coach. Write a professional, personalized cover letter based on this resume and job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

${companyName ? `Company: ${companyName}` : ""}

Write a compelling cover letter (300-400 words) that:
- Opens with a strong hook
- Highlights relevant experience from the resume
- Shows enthusiasm for the role
- Connects skills to job requirements
- Ends with a confident call to action

Return ONLY the cover letter text, no JSON, no extra formatting.`;

  return await callGemini(prompt);
}
