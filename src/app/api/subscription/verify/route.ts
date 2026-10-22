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
  try {
    const authClient = await createAuthClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let paymentId: string | undefined;
    let subscriptionId: string | undefined;
    let signature: string | undefined;

    try {
      const body = await request.json();
      paymentId = body.paymentId;
      subscriptionId = body.subscriptionId;
      signature = body.signature;
    } catch {
      // Body may be empty
    }

    // Verify signature if credentials and signature are present
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret && paymentId && subscriptionId && signature) {
      try {
        const { createHmac } = await import("crypto");
        const payload = `${paymentId}|${subscriptionId}`;
        const expectedSignature = createHmac("sha256", keySecret)
          .update(payload)
          .digest("hex");

        if (signature !== expectedSignature) {
          console.error("[Subscription Verify] Signature mismatch:", {
            received: signature,
            expected: expectedSignature,
          });
          return NextResponse.json(
            { error: "Invalid payment signature" },
            { status: 400 }
          );
        }
      } catch (err) {
        console.warn("[Subscription Verify] Signature check error:", err);
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("[Subscription Verify] Supabase service role keys not configured.");
      return NextResponse.json({ success: true, status: "simulated" });
    }

    // Use service role to bypass RLS
    const supabase = createClient(supabaseUrl, serviceRoleKey);

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
      console.error("[Subscription Verify] Failed to update candidate:", error);
      return NextResponse.json(
        { error: "Failed to activate subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, status: "active" });
  } catch (error: any) {
    console.error("[Subscription Verify] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
