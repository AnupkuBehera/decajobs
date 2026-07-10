import { NextResponse, type NextRequest } from "next/server";
import { fetchActiveCandidates } from "@/inngest/functions/helpers/fetch-candidates";
import { verifyAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Verify auth header if CRON_SECRET is set, OR verify if user is logged-in admin
  const admin = await verifyAdmin();
  if (!admin && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const candidates = await fetchActiveCandidates();

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        message: "No active candidates with complete profiles found. Skipping.",
        triggered: 0,
      });
    }

    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host");
    const origin = `${protocol}://${host}`;

    // Fan out POST requests to the send-single API in parallel
    const triggerPromises = candidates.map(async (candidate) => {
      try {
        const res = await fetch(`${origin}/api/cron/send-single`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cronSecret || ""}`,
          },
          body: JSON.stringify({ candidate }),
        });

        return {
          id: candidate.id,
          email: candidate.email,
          success: res.ok,
          status: res.status,
        };
      } catch (err: any) {
        return {
          id: candidate.id,
          email: candidate.email,
          success: false,
          error: err.message,
        };
      }
    });

    const results = await Promise.all(triggerPromises);
    const successfulCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      message: `Triggered digest generation for ${candidates.length} candidates.`,
      triggered: candidates.length,
      successCount: successfulCount,
      details: results,
    });
  } catch (error: any) {
    console.error("[Cron Orchestrator] Failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
