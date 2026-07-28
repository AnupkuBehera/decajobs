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
 * Score a resume and provide brief improvements for free users (optimized for speed under 10s).
 */
export async function scoreResumeFree(resumeText: string): Promise<{
  score: number;
  sections: { name: string; score: number; feedback: string }[];
  suggestions: string[];
}> {
  const prompt = `You are an expert resume reviewer. Analyze this resume and provide:
1. An overall score out of 100
2. Section scores for 3 sections only (Format & Layout, Experience, Skills) with short 1-sentence feedback
3. Top 2 actionable suggestions to improve it

Resume:
${resumeText}

Respond in this exact JSON format (no markdown, no code blocks):
{"score":75,"sections":[{"name":"Format & Layout","score":80,"feedback":"Short sentence."},{"name":"Experience","score":65,"feedback":"Short sentence."},{"name":"Skills","score":85,"feedback":"Short sentence."}],"suggestions":["suggestion1","suggestion2"]}`;

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

/**
 * Job input shape for batch AI recruiter analysis.
 */
export interface RecruiterJobInput {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applicationLink: string;
  postedAt?: string;
}

/**
 * Per-job analysis result from the AI recruiter.
 */
export interface JobAnalysis {
  jobId: string;
  matchScore: number;
  requirementsMet: string[];
  requirementsMissing: string[];
  recommendation: "Apply Now" | "Apply with Tweaks" | "Skip";
  recommendationReason: string;
  visaFlag: "Flagged" | "None Detected";
  tailoredBullet?: string;
  coverLetterOpener?: string;
}

/**
 * Analyze multiple live job listings against a candidate resume in one AI call.
 *
 * Instructs Gemini to be brutally honest — no score inflation. Produces:
 * - matchScore (0-100) strictly based on experience, tools, and domain alignment
 * - Top 3 requirements met / missing
 * - Recommendation + 1-sentence rationale
 * - Visa/sponsorship flag
 * - For top 3 by score: tailored ATS resume bullet + 2-sentence cover letter opener
 *
 * @param resumeText  - Candidate's resume as plain text
 * @param jobs        - Array of live job listings to analyze (max 15 recommended)
 * @returns Array of per-job analysis results, unsorted
 */
export async function analyzeJobsAgainstResume(
  resumeText: string,
  jobs: RecruiterJobInput[]
): Promise<JobAnalysis[]> {
  if (jobs.length === 0) return [];

  // Trim each description to keep token usage manageable
  const jobsList = jobs
    .map(
      (j, i) =>
        `JOB_${i + 1} id="${j.id}" title="${j.title}" company="${j.company}" location="${j.location}"\nDescription: ${j.description.slice(0, 600)}`
    )
    .join("\n\n---\n\n");

  // Identify top 3 index placeholders so Gemini enriches them
  const top3Note =
    "For the 3 jobs you score highest, also provide a 'tailoredBullet' (one ATS-optimized impact-driven resume bullet, ≤30 words, using keywords from that job) and 'coverLetterOpener' (exactly 2 compelling sentences referencing the company name and key value proposition). Leave these fields null for all other jobs.";

  const prompt = `You are a brutally honest AI recruiter and career advisor. Your job is to assess job fit without flattery.

CANDIDATE RESUME:
${resumeText.slice(0, 4000)}

---

LIVE JOB LISTINGS TO ANALYZE:
${jobsList}

---

INSTRUCTIONS:
- Assign a matchScore (0-100) strictly based on: years of experience alignment, technical tool overlap, domain/industry match. DO NOT inflate scores. A score of 80+ should only appear when there is very strong alignment.
- List exactly 3 requirementsMet: the top 3 specific qualifications from the job the candidate clearly satisfies.
- List exactly 3 requirementsMissing: the top 3 important qualifications from the job the candidate lacks or has weak evidence for.
- recommendation must be one of: "Apply Now" (score ≥70, strong fit), "Apply with Tweaks" (score 50-69, fixable gaps), or "Skip" (score <50, significant mismatch).
- recommendationReason: exactly 1 concise sentence explaining your recommendation.
- visaFlag: "Flagged" if the description mentions visa sponsorship, work authorization, citizenship requirements, or employment restrictions; otherwise "None Detected".
- ${top3Note}

Respond with ONLY a JSON array (no markdown, no code fences):
[
  {
    "jobId": "exact id string from the listing",
    "matchScore": 72,
    "requirementsMet": ["met requirement 1", "met requirement 2", "met requirement 3"],
    "requirementsMissing": ["missing requirement 1", "missing requirement 2", "missing requirement 3"],
    "recommendation": "Apply with Tweaks",
    "recommendationReason": "One sentence rationale here.",
    "visaFlag": "None Detected",
    "tailoredBullet": null,
    "coverLetterOpener": null
  }
]`;

  const result = await callGemini(prompt);

  try {
    const cleaned = result
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed: JobAnalysis[] = JSON.parse(cleaned);

    // Sanitize: ensure all required fields exist
    return parsed.map((item) => ({
      jobId: item.jobId ?? "",
      matchScore: Math.min(100, Math.max(0, Number(item.matchScore) || 0)),
      requirementsMet: Array.isArray(item.requirementsMet) ? item.requirementsMet.slice(0, 3) : [],
      requirementsMissing: Array.isArray(item.requirementsMissing) ? item.requirementsMissing.slice(0, 3) : [],
      recommendation: (["Apply Now", "Apply with Tweaks", "Skip"].includes(item.recommendation)
        ? item.recommendation
        : "Skip") as JobAnalysis["recommendation"],
      recommendationReason: item.recommendationReason ?? "",
      visaFlag: item.visaFlag === "Flagged" ? "Flagged" : "None Detected",
      tailoredBullet: item.tailoredBullet ?? undefined,
      coverLetterOpener: item.coverLetterOpener ?? undefined,
    }));
  } catch {
    console.error("[Gemini] analyzeJobsAgainstResume parse failed:", result.slice(0, 500));
    return [];
  }
}

/**
 * Analyze resume against a target job description for free matching tool.
 */
export async function matchResumeToJob(resumeText: string, jobDescription: string): Promise<{
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  tailoredBullets: string[];
  summaryFeedback: string;
}> {
  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume against the job description and return:
1. matchScore: 0-100 match percentage
2. matchingKeywords: top 5 relevant skills/keywords present in both
3. missingKeywords: top 5 important skills/keywords in the job description that are missing from the resume
4. tailoredBullets: top 3 optimized bullet points the candidate should add to their resume to match this role
5. summaryFeedback: 2-sentence summary of overall fit and main recommendation

Resume:
${resumeText}

Job Description:
${jobDescription}

Respond in this exact JSON format (no markdown, no code blocks):
{"matchScore":82,"matchingKeywords":["React","TypeScript","Node.js","REST APIs","Git"],"missingKeywords":["Docker","Kubernetes","CI/CD","GraphQL","Jest"],"tailoredBullets":["Engineered scalable web applications using React and TypeScript, optimizing render performance by 30%.","Integrated CI/CD pipelines and unit testing with Jest to ensure high code quality.","Architected GraphQL & REST APIs to handle microservice communications."],"summaryFeedback":"Your resume shows strong frontend development experience matching the core requirements. Adding containerization (Docker) and testing skills will make your application stand out."}`;

  const result = await callGemini(prompt);
  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      matchScore: 0,
      matchingKeywords: [],
      missingKeywords: [],
      tailoredBullets: [],
      summaryFeedback: "Failed to analyze resume match. Please check your inputs and try again.",
    };
  }
}

// ─── AI Resume Builder ────────────────────────────────────────────────────────

export interface ResumePersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface ResumeWorkExperience {
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  completionDate: string;
}

export interface ResumeSkillCategory {
  categoryName: string;
  skills: string[];
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  professionalSummary: string;
  workExperience: ResumeWorkExperience[];
  education: ResumeEducation[];
  skillCategories: ResumeSkillCategory[];
  certifications: ResumeCertification[];
}

/**
 * Transform raw candidate details into a structured, ATS-optimised resume JSON.
 *
 * Uses Gemini to produce every resume section from unformatted input.
 * Returns a validated ResumeContent object ready for rendering.
 *
 * @param rawDetails - The candidate's unformatted work history, skills, metrics
 * @param targetRole - The job title to tailor the resume toward
 */
export async function generateResumeFromRaw(
  rawDetails: string,
  targetRole: string
): Promise<ResumeContent> {
  const prompt = `You are an expert resume writer and ATS optimization specialist.
Transform the candidate's raw information into a professional, ATS-optimised resume tailored for the role: "${targetRole}".

RAW CANDIDATE INFO:
${rawDetails.slice(0, 5000)}

INSTRUCTIONS:
- Write a compelling professional headline for the exact target role.
- Write a 3-4 sentence professional summary packed with relevant keywords for "${targetRole}".
- For each work experience, write 3-5 strong STAR-method achievement bullet points with quantifiable metrics where possible.
- Group skills into logical categories (e.g., "Technical Skills", "Management", "Tools & Platforms").
- If personal info (name, email, phone, location) is not found in the raw text, use realistic placeholder values.
- Make every bullet point action-verb led and impact-driven.
- Optimise for ATS keyword matching for "${targetRole}".

Output ONLY raw JSON matching this exact schema (no markdown, no code fences, no extra text):
{
  "personalInfo": {
    "fullName": "",
    "headline": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedinUrl": "",
    "portfolioUrl": ""
  },
  "professionalSummary": "",
  "workExperience": [
    {
      "company": "",
      "jobTitle": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "highlights": ["", "", ""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "completionDate": ""
    }
  ],
  "skillCategories": [
    {
      "categoryName": "",
      "skills": ["", ""]
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "year": ""
    }
  ]
}`;

  const result = await callGemini(prompt);

  try {
    const cleaned = result
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as ResumeContent;
  } catch {
    console.error("[Gemini] generateResumeFromRaw parse failed:", result.slice(0, 300));
    // Return a graceful empty skeleton so the UI can still render
    return {
      personalInfo: {
        fullName: "Your Name",
        headline: targetRole,
        email: "email@example.com",
        phone: "+1 (555) 000-0000",
        location: "Your Location",
      },
      professionalSummary: "AI generation failed. Please try again with more detailed input.",
      workExperience: [],
      education: [],
      skillCategories: [],
      certifications: [],
    };
  }
}
