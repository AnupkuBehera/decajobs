import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getPaymentConfig,
  createStripeSubscriptionSession,
} from "@/lib/subscription/payment-router";

export async function POST(request: NextRequest) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let countryCode = "in";
    try {
      const body = await request.json();
      if (body?.country) countryCode = body.country;
    } catch {
      // Body may be empty if called without parameters
    }

    // Check cookie fallback if not in body
    const cookieCountry = request.cookies.get("NEXT_COUNTRY")?.value;
    if (!countryCode && cookieCountry) {
      countryCode = cookieCountry;
    }

    const config = getPaymentConfig(countryCode);
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "decajob.com";
    const origin = `${protocol}://${host}`;

    // Handle International (Stripe)
    if (config.provider === "stripe") {
      const { checkoutUrl, sessionId } = await createStripeSubscriptionSession({
        userId: user.id,
        userEmail: user.email || "",
        config,
        origin,
      });

      return NextResponse.json({
        provider: "stripe",
        checkoutUrl,
        sessionId,
        currency: config.currency,
        displayPrice: config.displayPrice,
      });
    }

    // Handle Domestic India (Razorpay)
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!keyId || !keySecret || !planId) {
      // Mock / Dev response if credentials not set
      console.warn("[Razorpay] Keys not configured in environment. Returning mock subscription.");
      return NextResponse.json({
        provider: "razorpay",
        subscriptionId: `sub_mock_${Date.now()}`,
        razorpayKeyId: keyId || "rzp_test_mock",
        currency: config.currency,
        displayPrice: config.displayPrice,
      });
    }

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
          country: config.countryCode,
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
      provider: "razorpay",
      subscriptionId: subscription.id,
      razorpayKeyId: keyId,
      currency: config.currency,
      displayPrice: config.displayPrice,
    });
  } catch (error: any) {
    console.error("[Subscription Create] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
