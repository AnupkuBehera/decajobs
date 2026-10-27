import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Supabase Keep-Alive & Database Health Endpoint
 *
 * Runs a minimal query against Supabase to ensure active incoming API traffic
 * is registered with Supabase's PostgREST engine, preventing free-tier projects
 * from being auto-paused due to 7 days of inactivity.
 *
 * Supports authentication via:
 * 1. Bearer token matching CRON_SECRET
 * 2. Public health check query param: ?public=1
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isPublicPing = request.nextUrl.searchParams.get("public") === "1";

  // Verify auth if CRON_SECRET is configured, unless explicitly invoked as public ping
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && !isPublicPing) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase environment variables are missing",
      },
      { status: 500 }
    );
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Query 1 row from job_listings to generate PostgREST database activity
    const { data, error } = await supabase
      .from("job_listings")
      .select("id")
      .limit(1);

    if (error) {
      // Fallback query to candidates if job_listings table is inaccessible
      const { error: fallbackError } = await supabase
        .from("candidates")
        .select("id")
        .limit(1);

      if (fallbackError) {
        throw new Error(error.message || fallbackError.message);
      }
    }

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      latencyMs,
      message: "Supabase keep-alive ping successful. Inactivity timer refreshed.",
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        latencyMs,
        error: err.message || "Failed to query Supabase database",
      },
      { status: 500 }
    );
  }
}
