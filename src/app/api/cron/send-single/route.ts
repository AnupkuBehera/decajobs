import { NextResponse, type NextRequest } from "next/server";
import { sendDigestForCandidate } from "@/inngest/functions/helpers/send-candidate-digest";
import type { ActiveCandidateWithProfile } from "@/inngest/functions/helpers/fetch-candidates";

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

    const result = await sendDigestForCandidate(candidate);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Cron Worker] Error processing candidate:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
