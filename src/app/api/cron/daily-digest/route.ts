import { NextResponse, type NextRequest } from "next/server";
import { fetchActiveCandidates, type ActiveCandidateWithProfile } from "@/inngest/functions/helpers/fetch-candidates";
import {
  sendDigestForCandidate,
  fetchEligibleJobs,
} from "@/inngest/functions/helpers/send-candidate-digest";
import { verifyAdmin } from "@/lib/admin";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorizedCron = cronSecret && authHeader === `Bearer ${cronSecret}`;

  let isAdmin = false;
  if (!isAuthorizedCron) {
    try {
      const adminUser = await verifyAdmin();
      isAdmin = !!adminUser;
    } catch {
      isAdmin = false;
    }
  }

  const testEmail = request.nextUrl.searchParams.get("test_email");

  // Allow access if authorized via Bearer CRON_SECRET, admin session, or test mode with valid format
  if (!isAuthorizedCron && !isAdmin) {
    if (!testEmail) {
      return NextResponse.json(
        { error: "Unauthorized. Provide Authorization: Bearer <CRON_SECRET> or log in as admin." },
        { status: 401 }
      );
    }
  }

  try {
    // 1. One-click Live Test Mode (Sends an immediate 10-job digest to a specified test address)
    if (testEmail) {
      const emailTrimmed = testEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        return NextResponse.json({ error: "Invalid test_email address" }, { status: 400 });
      }

      console.log(`[daily-digest] Dispatching test digest to: ${emailTrimmed}`);

      const testCandidate: ActiveCandidateWithProfile = {
        id: "test-diagnostic-run",
        email: emailTrimmed,
        preferred_delivery_time: "07:00",
        timeZone: "UTC",
        profile: {
          target_titles: ["Software Engineer", "Full Stack Developer", "AI Engineer"],
          skills: ["TypeScript", "React", "Node.js", "Python", "Cloud"],
          location: "Remote",
        },
      };

      const testResult = await sendDigestForCandidate(testCandidate);
      return NextResponse.json({
        message: `Test daily digest processed for ${emailTrimmed}`,
        recipient: emailTrimmed,
        result: testResult,
      });
    }

    // 2. Production Batch Digest Mode
    const force = request.nextUrl.searchParams.get("force") === "true";
    const candidates = await fetchActiveCandidates(!force);

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        message: "No active candidates in the current delivery window. Skipping.",
        triggered: 0,
        hint: "Use ?force=true to dispatch to all active candidates regardless of local hour.",
      });
    }

    console.log(`[daily-digest] Starting in-process digest run for ${candidates.length} candidates...`);

    // Preload eligible database jobs once to avoid redundant queries across candidate batch
    let preloadedDbJobs: any[] = [];
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        const supabase = createClient(url, key);
        preloadedDbJobs = await fetchEligibleJobs(supabase);
      }
    } catch (preloadErr: any) {
      console.warn("[daily-digest] Job preloading notice:", preloadErr.message);
    }

    // Execute in-process in parallel batches (avoiding external HTTP loopbacks)
    const BATCH_SIZE = 10;
    const results: Array<{ id: string; email: string; success: boolean; error?: string }> = [];

    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
      const batch = candidates.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (candidate) => {
        try {
          const res = await sendDigestForCandidate(candidate, preloadedDbJobs);
          return {
            id: candidate.id,
            email: candidate.email,
            success: res.success,
            error: res.reason,
          };
        } catch (candidateErr: any) {
          return {
            id: candidate.id,
            email: candidate.email,
            success: false,
            error: candidateErr.message,
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const successfulCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      message: `Processed digest generation for ${candidates.length} candidates.`,
      triggered: candidates.length,
      successCount: successfulCount,
      details: results,
    });
  } catch (error: any) {
    console.error("[Cron Orchestrator] Critical failure:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
