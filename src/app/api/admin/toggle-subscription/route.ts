import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, createServiceRoleClient } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { candidateId, status } = await request.json();

    if (!candidateId || !status) {
      return NextResponse.json(
        { error: "Missing candidateId or status" },
        { status: 400 }
      );
    }

    if (status !== "active" && status !== "expired") {
      return NextResponse.json(
        { error: "Invalid status value. Must be 'active' or 'expired'" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Determine ends_at based on status
    const endsAt =
      status === "active"
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        : new Date().toISOString(); // Now (effectively expired)

    const { data, error } = await supabase
      .from("candidates")
      .update({
        subscription_status: status,
        subscription_ends_at: endsAt,
      })
      .eq("id", candidateId)
      .select("id, email, subscription_status, subscription_ends_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, candidate: data });
  } catch (error: any) {
    console.error("[Admin API] Failed to toggle subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
