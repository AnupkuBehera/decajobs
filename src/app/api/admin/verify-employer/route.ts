import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, createServiceRoleClient } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { employerId, isVerified } = await request.json();

    if (!employerId || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "Missing employerId or invalid isVerified boolean" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("employers")
      .update({ is_verified: isVerified })
      .eq("id", employerId)
      .select("id, email, is_verified")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, employer: data });
  } catch (error: any) {
    console.error("[Admin API] Failed to verify employer:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
