import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, createServiceRoleClient } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { candidateId, isActive } = await request.json();

    if (!candidateId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Missing candidateId or invalid isActive boolean" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("candidates")
      .update({ is_active: isActive })
      .eq("id", candidateId)
      .select("id, email, is_active")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, candidate: data });
  } catch (error: any) {
    console.error("[Admin API] Failed to toggle matching active:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
