import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return signature === expectedSignature;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  // Verify webhook signature
  if (!verifyWebhookSignature(body, signature)) {
    console.error("[Razorpay Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType = event.event;
  const payload = event.payload;

  console.log(`[Razorpay Webhook] Event: ${eventType}`);

  switch (eventType) {
    case "subscription.activated":
    case "subscription.charged": {
      const subscriptionId = payload.subscription?.entity?.id;
      const userId = payload.subscription?.entity?.notes?.user_id;

      if (userId) {
        await supabase
          .from("candidates")
          .update({
            subscription_status: "active",
            razorpay_subscription_id: subscriptionId,
            subscription_ends_at: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }
      break;
    }

    case "subscription.cancelled":
    case "subscription.paused": {
      const userId = payload.subscription?.entity?.notes?.user_id;

      if (userId) {
        await supabase
          .from("candidates")
          .update({
            subscription_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }
      break;
    }

    case "payment.failed": {
      const userId = payload.payment?.entity?.notes?.user_id;
      if (userId) {
        console.warn(`[Razorpay] Payment failed for user: ${userId}`);
      }
      break;
    }
  }

  return NextResponse.json({ status: "ok" });
}
