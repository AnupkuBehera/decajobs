import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/subscription/verify
 *
 * Called after a successful Razorpay payment to immediately mark the
 * user as a Pro subscriber. This acts as a fallback in case the
 * Razorpay webhook hasn't fired yet (or isn't configured).
 *
 * Expects JSON body: { subscriptionId: string }
 */
export async function POST(request: Request) {
  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let subscriptionId: string | undefined;
  try {
    const body = await request.json();
    subscriptionId = body.subscriptionId;
  } catch {
    // subscriptionId is optional — we can still activate without it
  }

  // Use service role to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const updateData: Record<string, unknown> = {
    subscription_status: "active",
    subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (subscriptionId) {
    updateData.razorpay_subscription_id = subscriptionId;
  }

  const { error } = await supabase
    .from("candidates")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("[Subscription Verify] Failed to update:", error);
    return NextResponse.json(
      { error: "Failed to activate subscription" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, status: "active" });
}
