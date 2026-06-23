import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifySignature(body: string, signature: string): Promise<boolean> {
  try {
    const { createHmac } = await import("crypto");
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    return signature === expected;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!await verifySignature(body, signature)) {
    console.error("[Razorpay Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();
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
        await supabase.from("candidates").update({
          subscription_status: "active",
          razorpay_subscription_id: subscriptionId,
          subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", userId);
      }
      break;
    }
    case "subscription.cancelled":
    case "subscription.paused": {
      const userId = payload.subscription?.entity?.notes?.user_id;
      if (userId) {
        await supabase.from("candidates").update({
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        }).eq("id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ status: "ok" });
}
