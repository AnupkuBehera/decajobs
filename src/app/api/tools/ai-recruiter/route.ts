import { NextResponse } from "next/server";
import { searchJobsWithFilter } from "@/lib/jsearch/client";
import { analyzeJobsAgainstResume, type RecruiterJobInput } from "@/lib/gemini/client";

/**
 * POST /api/tools/ai-recruiter
 *
 * Public endpoint (no login required) for the AI Recruiter job search tool.
 * Searches for live job postings and analyzes them against the candidate's resume.
 *
 * Request body:
 *   - resumeText: string   (min 100 chars)
 *   - jobTitle: string
 *   - location: string     (default: "Remote")
 *   - datePosted: "today" | "3days" | "week" | "month" (default: "week")
 *
 * Response:
 *   - jobs: AnalyzedJob[]  sorted by matchScore descending
 *   - totalFetched: number
 *   - query: string        the search query used
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      resumeText,
      jobTitle,
      location = "Remote",
      datePosted = "week",
    } = body as {
      resumeText: string;
      jobTitle: string;
      location?: string;
      datePosted?: "today" | "3days" | "week" | "month";
    };

    // --- Input validation ---
    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json(
        { error: "Please paste your full resume text (at least 100 characters)." },
        { status: 400 }
      );
    }

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a job title to search for." },
        { status: 400 }
      );
    }

    const validDateFilters = ["today", "3days", "week", "month"];
    if (!validDateFilters.includes(datePosted)) {
      return NextResponse.json(
        { error: "Invalid datePosted value. Use: today, 3days, week, or month." },
        { status: 400 }
      );
    }

    // --- Search for live jobs ---
    const locationPart = location.trim() || "Remote";
    const query = `${jobTitle.trim()} ${locationPart}`;

    console.log(`[AI Recruiter] Searching: "${query}" | date_posted=${datePosted}`);

    const rawJobs = await searchJobsWithFilter(query, datePosted, 1);

    if (rawJobs.length === 0) {
      return NextResponse.json({
        jobs: [],
        totalFetched: 0,
        query,
        message: "No live job listings found for your search. Try broadening your title or changing the date range.",
      });
    }

    // Cap at 10 jobs to keep Gemini token usage manageable and UX fast
    const jobsToAnalyze = rawJobs.slice(0, 10);

    // Shape into RecruiterJobInput
    const recruiterInputs: RecruiterJobInput[] = jobsToAnalyze.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      description: j.description,
      location: j.location,
      applicationLink: j.applicationLink,
      postedAt: j.postedAt,
    }));

    // --- Run AI analysis ---
    console.log(`[AI Recruiter] Analyzing ${recruiterInputs.length} jobs against resume...`);
    const analyses = await analyzeJobsAgainstResume(resumeText, recruiterInputs);

    // Build enriched result by merging job data + analysis
    const jobMap = new Map(jobsToAnalyze.map((j) => [j.id, j]));

    const enrichedJobs = analyses
      .map((analysis) => {
        const job = jobMap.get(analysis.jobId);
        if (!job) return null;
        return {
          ...analysis,
          title: job.title,
          company: job.company,
          location: job.location,
          applicationLink: job.applicationLink,
          postedAt: job.postedAt,
        };
      })
      .filter(Boolean);

    // Sort by matchScore descending
    enrichedJobs.sort((a, b) => (b!.matchScore ?? 0) - (a!.matchScore ?? 0));

    console.log(`[AI Recruiter] Returning ${enrichedJobs.length} analyzed jobs`);

    return NextResponse.json({
      jobs: enrichedJobs,
      totalFetched: rawJobs.length,
      query,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[AI Recruiter] Error:", message);

    const isRateLimited =
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("429") ||
      message.toLowerCase().includes("quota");

    const status = isRateLimited ? 429 : 503;
    const userMessage = isRateLimited
      ? "The AI service is currently busy. Please wait a minute and try again."
      : "AI analysis temporarily unavailable. Please try again shortly.";

    return NextResponse.json({ error: userMessage }, { status });
  }
}
