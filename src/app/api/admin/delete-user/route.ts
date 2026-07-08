import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, createServiceRoleClient } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // 1. Delete candidate record (cascade deletes profile and digest history)
    const { error: candidateDeleteError } = await supabase
      .from("candidates")
      .delete()
      .eq("id", userId);

    if (candidateDeleteError) {
      console.warn("[Admin API] Failed to delete candidate row:", candidateDeleteError);
    }

    // 2. Delete employer record
    const { error: employerDeleteError } = await supabase
      .from("employers")
      .delete()
      .eq("id", userId);

    if (employerDeleteError) {
      console.warn("[Admin API] Failed to delete employer row:", employerDeleteError);
    }

    // 3. Delete auth user (completely deletes from Supabase auth dashboard)
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error("[Admin API] Auth user deletion error:", authDeleteError);
      return NextResponse.json(
        { error: "Failed to delete user auth account", details: authDeleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    console.error("[Admin API] Failed to delete user:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
