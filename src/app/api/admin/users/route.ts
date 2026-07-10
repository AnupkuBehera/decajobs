import { NextResponse } from "next/server";
import { verifyAdmin, createServiceRoleClient } from "@/lib/admin";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = createServiceRoleClient();

    // 1. Fetch candidates with their subscription data
    const { data: candidates, error: candidatesError } = await supabase
      .from("candidates")
      .select("id, email, is_active, preferred_delivery_time, created_at, subscription_status, subscription_ends_at")
      .order("created_at", { ascending: false });

    if (candidatesError) {
      throw candidatesError;
    }

    // 2. Fetch employers with their verification data
    const { data: employers, error: employersError } = await supabase
      .from("employers")
      .select("id, email, company_name, is_verified, created_at")
      .order("created_at", { ascending: false });

    if (employersError) {
      throw employersError;
    }

    // 3. Fetch count of total job listings
    const { count: jobListingsCount, error: countError } = await supabase
      .from("job_listings")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw countError;
    }

    // 4. Fetch visitor page views and unique sessions (up to 10k limit for memory efficiency)
    let totalPageViews = 0;
    let totalUniqueVisitors = 0;
    try {
      const { count: pageViewsCount } = await supabase
        .from("visitor_logs")
        .select("*", { count: "exact", head: true });
      
      const { data: sessionLogs } = await supabase
        .from("visitor_logs")
        .select("session_id")
        .limit(10000);

      totalPageViews = pageViewsCount ?? 0;
      totalUniqueVisitors = new Set(sessionLogs?.map((l) => l.session_id) ?? []).size;
    } catch (e) {
      console.warn("[Admin API] visitor_logs table may not exist yet:", e);
    }

    // Calculate metrics
    const totalCandidates = candidates?.length ?? 0;
    const totalEmployers = employers?.length ?? 0;
    const totalJobs = jobListingsCount ?? 0;
    const activePro = candidates?.filter(
      (c) => c.subscription_status === "active"
    ).length ?? 0;

    return NextResponse.json({
      metrics: {
        totalCandidates,
        totalEmployers,
        totalJobs,
        activePro,
        totalPageViews,
        totalUniqueVisitors,
      },
      candidates: candidates ?? [],
      employers: employers ?? [],
      debug: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
        isServiceKeyPrefixValid: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("sb_") ?? false,
      }
    });
  } catch (error: any) {
    console.error("[Admin API] Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
