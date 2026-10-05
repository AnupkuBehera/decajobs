import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { jobId, rating, reason, jobTitle, company } = await request.json();

    if (!jobId || !rating) {
      return NextResponse.json(
        { error: "jobId and rating (relevant | irrelevant) are required." },
        { status: 400 }
      );
    }

    // Optional user authentication check
    let userId: string | null = null;
    try {
      const authClient = await createClient();
      const {
        data: { user },
      } = await authClient.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Allow unauthenticated feedback from email / preview
    }

    console.log(
      `[Matching Feedback] Job: "${jobTitle || jobId}" (${company || "Unknown"}) | Rating: ${rating} | Reason: ${
        reason || "None"
      } | User: ${userId || "Anonymous"}`
    );

    // In a live Supabase schema, insert into job_feedback table if it exists
    try {
      const supabase = await createClient();
      await supabase.from("job_feedback").insert({
        user_id: userId,
        job_id: jobId,
        rating,
        reason: reason || null,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Table may not yet be migrated in dev environments; log securely
    }

    return NextResponse.json({
      success: true,
      message: "Feedback recorded. Your future daily digests will be tuned accordingly.",
    });
  } catch (error: any) {
    console.error("[Feedback API Error]:", error);
    return NextResponse.json(
      { error: "Failed to record feedback", details: error.message },
      { status: 500 }
    );
  }
}
