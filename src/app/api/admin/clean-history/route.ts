import { NextResponse } from "next/server";
import { verifyAdmin, createServiceRoleClient } from "@/lib/admin";
import { cleanupOldHistory } from "@/inngest/functions/helpers/digest-history";

export async function POST() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const supabase = createServiceRoleClient();
    await cleanupOldHistory(supabase);
    return NextResponse.json({
      success: true,
      message: "Successfully cleaned up database digest history older than 7 days.",
    });
  } catch (error: any) {
    console.error("[Admin API] Failed to clean up digest history:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
