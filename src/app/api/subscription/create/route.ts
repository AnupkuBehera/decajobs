import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getPaymentConfig,
  createStripeSubscriptionSession,
} from "@/lib/subscription/payment-router";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let countryCode: string | undefined;
    try {
      const body = await request.json();
      if (body?.country) countryCode = String(body.country).toLowerCase().trim();
    } catch {
      // Body may be empty if called without parameters
    }

    // Check cookie fallback if not in body
    if (!countryCode) {
      const cookieCountry = request.cookies.get("NEXT_COUNTRY")?.value;
      if (cookieCountry) countryCode = cookieCountry.toLowerCase().trim();
    }

    // Default to "in" if neither body nor cookie specified
    if (!countryCode) {
      countryCode = "in";
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
      console.warn(
        `[Razorpay] Missing credentials: keyId=${!!keyId}, keySecret=${!!keySecret}, planId=${!!planId}`
      );
      return NextResponse.json(
        {
          error: "Razorpay Not Configured",
          message:
            "Razorpay live keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) or Plan ID (RAZORPAY_PLAN_ID) have not been provisioned in the environment.",
        },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: 60, // 60 monthly cycles (5 years)
        quantity: 1,
        customer_notify: 1, // Razorpay notifies candidate via SMS/Email
        notes: {
          user_id: user.id,
          email: user.email || "",
          country: config.countryCode,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Razorpay] Subscription creation failed:", errorData);
      return NextResponse.json(
        {
          error: "Razorpay Subscription Creation Failed",
          details: errorData?.error?.description || "Unable to create subscription with Razorpay.",
        },
        { status: response.status || 500 }
      );
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
