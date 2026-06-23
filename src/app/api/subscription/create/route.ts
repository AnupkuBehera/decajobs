import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  const planId = process.env.RAZORPAY_PLAN_ID!;

  // Create Razorpay subscription
  const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      total_count: 12, // 12 months max
      quantity: 1,
      notes: {
        user_id: user.id,
        email: user.email,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[Razorpay] Subscription creation failed:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }

  const subscription = await response.json();

  return NextResponse.json({
    subscriptionId: subscription.id,
    razorpayKeyId: keyId,
  });
}
