import { NextResponse, type NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getRecentlySentJobIds,
  recordDigestHistory,
  cleanupOldHistory,
} from "@/inngest/functions/helpers/digest-history";
import {
  selectTopJobs,
  type JobListingWithDate,
} from "@/inngest/functions/helpers/select-top-jobs";
import { sendDigestEmail, type JobDigestItem } from "@/lib/resend/send";
import { fetchAllExternalJobs } from "@/lib/external-jobs";
import type { CandidateProfile } from "@/lib/matching/types";
import type { ActiveCandidateWithProfile } from "@/inngest/functions/helpers/fetch-candidates";

interface JobListingFull extends JobListingWithDate {
  application_link: string;
}

function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function fetchEligibleJobs(
  supabase: SupabaseClient
): Promise<JobListingFull[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("job_listings")
    .select("id, title, description, location, application_link, created_at")
    .eq("is_active", true)
    .gt("expires_at", now)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch eligible jobs: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    location: row.location as string,
    application_link: row.application_link as string,
    createdAt: row.created_at as string,
  }));
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Verify auth header if CRON_SECRET is set
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { candidate } = (await request.json()) as {
      candidate: ActiveCandidateWithProfile;
    };

    if (!candidate || !candidate.id || !candidate.email || !candidate.profile) {
      return NextResponse.json({ error: "Invalid candidate payload" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // 1. Fetch eligible jobs once per runner (active, non-expired)
    const allJobs = await fetchEligibleJobs(supabase);

    // 2. Get recently sent job IDs for deduplication
    const recentlySentIds = await getRecentlySentJobIds(supabase, candidate.id);

    // 3. Build candidate profile for matching engine
    const candidateProfile: CandidateProfile = {
      targetTitles: candidate.profile.target_titles,
      skills: candidate.profile.skills,
      location: candidate.profile.location,
    };

    // 4. Filter out recently sent jobs
    const recentSet = new Set(recentlySentIds);
    const deduplicatedJobs = allJobs.filter((job) => !recentSet.has(job.id));

    // 5. Fetch external jobs from all sources (remotely/parallel)
    let externalJobs: any[] = [];
    try {
      externalJobs = await fetchAllExternalJobs(
        candidate.profile.target_titles,
        candidate.profile.skills,
        candidate.profile.location
      );
    } catch (extErr: any) {
      console.warn(
        `Failed to fetch external jobs for candidate ${candidate.id}:`,
        extErr.message || extErr
      );
    }

    // 6. Convert external jobs to internal format
    const externalAsInternal: JobListingFull[] = externalJobs
      .filter((ej) => !recentSet.has(ej.id))
      .map((ej) => ({
        id: ej.id,
        title: ej.title,
        description: ej.description,
        location: ej.location,
        application_link: ej.applicationLink,
        createdAt: ej.postedAt || new Date().toISOString(),
      }));

    // 7. Merge internal + external jobs
    const allAvailableJobs = [...deduplicatedJobs, ...externalAsInternal];

    // 8. Select top 10 jobs (with fallback)
    const selectedJobIds = selectTopJobs(
      candidateProfile,
      allAvailableJobs,
      allAvailableJobs
    );

    if (!selectedJobIds) {
      console.log(
        `[Cron Worker] Skipping candidate ${candidate.id}: insufficient eligible jobs after deduplication`
      );
      return NextResponse.json({
        success: false,
        reason: "insufficient_eligible_jobs",
      });
    }

    const orderedJobs = selectedJobIds
      .map((id) => allAvailableJobs.find((j) => j.id === id))
      .filter((j): j is JobListingFull => j !== undefined);

    // 9. Record selected jobs in digest_history (only internal DB jobs)
    const internalJobIds = selectedJobIds.filter((id) => !id.startsWith("jsearch_"));
    if (internalJobIds.length > 0) {
      await recordDigestHistory(supabase, candidate.id, internalJobIds);
    }

    // 10. Send email via Resend
    const digestItems: JobDigestItem[] = orderedJobs.map((job) => ({
      title: job.title,
      description: job.description,
      location: job.location,
      applicationLink: job.application_link,
    }));

    await sendDigestEmail(candidate.email, digestItems, candidate.id);

    // 11. Cleanup old history (older than 7 days)
    await cleanupOldHistory(supabase);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Cron Worker] Error processing candidate:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
