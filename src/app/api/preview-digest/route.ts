import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { fetchAllExternalJobs } from "@/lib/external-jobs";
import { rankJobs } from "@/lib/matching/engine";
import type { CandidateProfile, JobListing } from "@/lib/matching/types";

/**
 * GET /api/preview-digest
 *
 * Returns the top 10 matched jobs for the current user WITHOUT sending an email.
 * Used by the "My Daily 10" preview page so users can see their matches first.
 */
export async function GET() {
  const authClient = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read profile
  const { data: profile, error: profileError } = await authClient
    .from("candidate_profiles")
    .select("target_titles, skills, location, designation")
    .eq("candidate_id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: `Database error: ${profileError.message}` },
      { status: 500 }
    );
  }

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found. Please set up your profile first.", needsProfile: true },
      { status: 404 }
    );
  }

  if (!profile.target_titles?.length || !profile.skills?.length || !profile.location) {
    return NextResponse.json(
      { error: "Profile incomplete. Please add target titles, skills, and location.", needsProfile: true },
      { status: 400 }
    );
  }

  // Fetch external jobs
  const searchTitles = profile.designation
    ? [profile.designation, ...profile.target_titles]
    : profile.target_titles;

  let externalJobs = await fetchAllExternalJobs(
    searchTitles,
    profile.skills,
    profile.location
  );

  // Fetch internal DB jobs
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: dbJobs } = await supabase
    .from("job_listings")
    .select("id, title, description, location, application_link, created_at")
    .eq("is_active", true)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(50);

  // Combine all jobs
  const allJobs: (JobListing & { applicationLink: string; company?: string })[] = [
    ...(dbJobs || []).map((j) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      location: j.location,
      applicationLink: j.application_link,
    })),
    ...externalJobs.map((j) => ({
      id: j.id,
      title: `${j.title} at ${j.company}`,
      description: j.description,
      location: j.location,
      applicationLink: j.applicationLink,
      company: j.company,
    })),
  ];

  if (allJobs.length === 0) {
    return NextResponse.json(
      { error: "No jobs found matching your profile. Try broadening your skills or location.", jobs: [] },
      { status: 200 }
    );
  }

  // Check subscription/trial status
  const sub = await checkSubscription(authClient, user.id);

  // Score and rank
  const candidateProfile: CandidateProfile = {
    targetTitles: profile.target_titles,
    skills: profile.skills,
    location: profile.location,
  };

  const ranked = rankJobs(candidateProfile, allJobs);
  const top10 = ranked.slice(0, 10);

  // Map to response format
  let jobs = top10.map((match, index) => {
    const job = allJobs.find((j) => j.id === match.jobListingId);
    
    // Separate title and company
    const rawTitle = job?.title ?? "Unknown";
    let title = rawTitle;
    let company = job?.company || "Unknown Company";
    
    if (rawTitle.includes(" at ")) {
      const parts = rawTitle.split(" at ");
      title = parts[0];
      if (!job?.company) {
        company = parts[1];
      }
    }

    return {
      rank: index + 1,
      id: match.jobListingId,
      title,
      company,
      description: job?.description ?? "",
      location: job?.location ?? "",
      applicationLink: job?.applicationLink ?? "#",
      matchScore: Math.round(match.score),
      breakdown: match.breakdown,
      isLocked: false,
    };
  });

  // Lock matches 4+ if candidate doesn't have active subscription or trial
  if (!sub.hasAccess) {
    jobs = jobs.map((job, index) => {
      if (index >= 3) {
        return {
          ...job,
          company: "🔒 Locked",
          description: "This job listing is locked. Upgrade to DecaJobs Pro to see the company name, details, and apply.",
          applicationLink: "/subscribe",
          isLocked: true,
        };
      }
      return job;
    });
  }

  return NextResponse.json({
    jobs,
    profile: {
      titles: profile.target_titles,
      skills: profile.skills,
      location: profile.location,
    },
    subscription: {
      hasAccess: sub.hasAccess,
      status: sub.status,
      trialDaysLeft: sub.trialDaysLeft,
    },
    generatedAt: new Date().toISOString(),
  });
}
