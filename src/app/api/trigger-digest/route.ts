import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { fetchAllExternalJobs } from "@/lib/external-jobs";
import { rankJobs } from "@/lib/matching/engine";
import { resend, FROM_EMAIL } from "@/lib/resend/client";
import type { CandidateProfile, JobListing } from "@/lib/matching/types";

/**
 * POST /api/trigger-digest
 *
 * Manually triggers the daily digest for the currently logged-in user.
 * Fetches external jobs from JSearch, scores them, and sends the top 10 via email.
 * For testing purposes — bypasses the Inngest cron.
 */
export async function POST() {
  // Get the authenticated user
  const authClient = await createAuthClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read profile using the authenticated user's session (same RLS context that saved it)
  const { data: profile, error: profileError } = await authClient
    .from("candidate_profiles")
    .select("target_titles, skills, location, designation, expected_salary")
    .eq("candidate_id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[Trigger Digest] Profile query error:", profileError);
    return NextResponse.json(
      { error: `Database error: ${profileError.message}` },
      { status: 500 }
    );
  }

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found. Please go to your Profile page and save your skills, titles, and location first." },
      { status: 404 }
    );
  }

  if (!profile.target_titles?.length || !profile.skills?.length || !profile.location) {
    return NextResponse.json(
      { error: "Profile incomplete. Please add target titles, skills, and location on your Profile page." },
      { status: 400 }
    );
  }

  // Fetch external jobs from all sources (JSearch, Remotive, RemoteOK, Arbeitnow)
  // Include designation in search for better seniority matching
  const searchTitles = profile.designation
    ? [profile.designation, ...profile.target_titles]
    : profile.target_titles;

  let externalJobs = await fetchAllExternalJobs(
    searchTitles,
    profile.skills,
    profile.location
  );

  // Service role client for job listings (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Also fetch any internal database jobs
  const { data: dbJobs } = await supabase
    .from("job_listings")
    .select("id, title, description, location, application_link, created_at")
    .eq("is_active", true)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(50);

  // Combine all jobs into the matching format
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
      { 
        error: "No jobs found matching your profile. Try broadening your skills or location.",
        debug: {
          query: `${profile.target_titles[0]} in ${profile.location}`,
          externalCount: externalJobs.length,
          dbCount: dbJobs?.length ?? 0,
          rapidApiKeySet: !!process.env.RAPIDAPI_KEY,
        }
      },
      { status: 404 }
    );
  }

  // Score and rank
  const candidateProfile: CandidateProfile = {
    targetTitles: profile.target_titles,
    skills: profile.skills,
    location: profile.location,
  };

  const ranked = rankJobs(candidateProfile, allJobs);
  const top10 = ranked.slice(0, 10);

  // Build email content
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isDaily10 = top10.length === 10;
  const brandingName = isDaily10 ? "Daily 10 Jobs" : "Daily Digest";
  const subject = isDaily10
    ? `Your DecaJobs Daily 10 — ${date}`
    : `Your DecaJobs Daily Digest — ${date}`;

  const jobCards = top10
    .map((match, index) => {
      const job = allJobs.find((j) => j.id === match.jobListingId);
      if (!job) return "";
      return `
        <div style="margin-bottom: 16px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px;">
            ${index + 1}. <a href="${job.applicationLink}" style="color: #2563eb; text-decoration: none;">${job.title}</a>
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">📍 ${job.location} · Match score: ${match.score}/100</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">${job.description.slice(0, 150)}${job.description.length > 150 ? "..." : ""}</p>
          <a href="${job.applicationLink}" style="display: inline-block; padding: 8px 16px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px;">Apply Now</a>
        </div>`;
    })
    .join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #2563eb;">DecaJobs</h1>
      <h2 style="font-size: 20px; color: #111827;">Your ${brandingName}</h2>
      <p style="color: #6b7280; font-size: 14px;">${date}</p>
      <p style="color: #374151; font-size: 14px;">Here are your top ${top10.length} job matches based on your profile (${profile.target_titles.join(", ")} · ${profile.location}):</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
      ${jobCards}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        You're receiving this because you signed up for DecaJobs.
      </p>
    </div>
  `;

  // Send email
  try {
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email!,
      subject,
      html,
    });

    if (sendError) {
      console.error("[Trigger Digest] Send error:", sendError);
      return NextResponse.json(
        { error: `Failed to send email: ${sendError.message}` },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[Trigger Digest] Error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Check Resend configuration." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Digest email sent to ${user.email} with ${top10.length} jobs!`,
    jobCount: top10.length,
    topScore: top10[0]?.score ?? 0,
  });
}
