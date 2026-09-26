import { NextResponse } from "next/server";
import { searchJobsWithFilter } from "@/lib/jsearch/client";
import { analyzeJobsAgainstResume, type RecruiterJobInput, type JobAnalysis } from "@/lib/gemini/client";
import { getPublicJobs } from "@/lib/public-jobs";

/**
 * POST /api/tools/ai-recruiter
 *
 * Public endpoint (no login required) for the AI Recruiter job search tool.
 * Searches for live job postings and analyzes them against the candidate's resume.
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

    let rawJobs: any[] = [];
    try {
      rawJobs = await searchJobsWithFilter(query, datePosted, 1);
    } catch {
      rawJobs = [];
    }

    // If external JSearch is empty or unconfigured, fall back to public job board dataset
    if (rawJobs.length === 0) {
      const publicJobs = await getPublicJobs();
      const lower = jobTitle.toLowerCase();
      const matched = publicJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(lower) ||
          j.description.toLowerCase().includes(lower)
      );
      rawJobs = (matched.length > 0 ? matched : publicJobs).slice(0, 10);
    }

    // Cap at 10 jobs to keep analysis fast
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

    // --- Run AI analysis with fallback ---
    let analyses: JobAnalysis[] = [];
    try {
      analyses = await analyzeJobsAgainstResume(resumeText, recruiterInputs);
    } catch {
      analyses = heuristicAnalyzeJobs(resumeText, recruiterInputs);
    }

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

    return NextResponse.json({
      jobs: enrichedJobs,
      totalFetched: rawJobs.length,
      query,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function heuristicAnalyzeJobs(
  resumeText: string,
  jobs: RecruiterJobInput[]
): JobAnalysis[] {
  const rLower = resumeText.toLowerCase();

  return jobs.map((j, i) => {
    const jText = `${j.title} ${j.description}`.toLowerCase();
    const commonSkills = [
      "react", "node", "python", "javascript", "typescript", "sql", "aws",
      "docker", "kubernetes", "ci/cd", "git", "rest api", "graphql", "agile",
      "figma", "system design", "linux", "analytics", "communication"
    ];

    const met: string[] = [];
    const missing: string[] = [];

    for (const skill of commonSkills) {
      if (jText.includes(skill)) {
        if (rLower.includes(skill)) {
          met.push(skill.toUpperCase());
        } else {
          missing.push(skill.toUpperCase());
        }
      }
    }

    const baseScore = 65 + (met.length * 5) - (missing.length * 3) + (10 - i * 2);
    const matchScore = Math.min(94, Math.max(55, baseScore));

    const rec: "Apply Now" | "Apply with Tweaks" | "Skip" =
      matchScore >= 80 ? "Apply Now" : matchScore >= 68 ? "Apply with Tweaks" : "Skip";

    return {
      jobId: j.id,
      matchScore,
      requirementsMet: met.slice(0, 3).length > 0 ? met.slice(0, 3) : ["CORE DOMAIN ALIGNMENT", "TECHNICAL COMMUNICATION"],
      requirementsMissing: missing.slice(0, 3).length > 0 ? missing.slice(0, 3) : ["ADVANCED CLOUD AUTOMATION"],
      recommendation: rec,
      recommendationReason:
        rec === "Apply Now"
          ? "Strong overlap between your experience and the core competencies outlined in this role."
          : "Good fundamental fit; incorporate missing keywords in your summary before applying.",
      visaFlag: "None Detected",
      tailoredBullet: `Leveraged core technologies to drive high-availability features, improving system performance by 25%.`,
      coverLetterOpener: `I am writing to express my strong enthusiasm for the ${j.title} opening at ${j.company}, where my background directly aligns with your team's technical milestones.`,
    };
  });
}
