import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Verify Stripe webhook signature using native crypto (HMAC-SHA256).
 */
function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): boolean {
  try {
    const parts = signatureHeader.split(",").reduce((acc, part) => {
      const [key, value] = part.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {} as Record<string, string>);

    const timestamp = parts["t"];
    const signature = parts["v1"];

    if (!timestamp || !signature) return false;

    // Reject events older than 5 minutes to prevent replay attacks
    const timestampMs = parseInt(timestamp, 10) * 1000;
    if (Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
      console.warn("[Stripe Webhook] Timestamp outside 5-minute replay tolerance");
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");

    return signature === expected;
  } catch (err) {
    console.error("[Stripe Webhook] Error verifying signature:", err);
    return false;
  }
}

/**
 * POST /api/webhooks/stripe
 *
 * Receives lifecycle events from Stripe Checkout and Subscriptions.
 * Handles:
 * - checkout.session.completed (Activates subscription upon successful checkout)
 * - invoice.payment_succeeded (Renews subscription for another 30 days)
 * - customer.subscription.deleted (Marks subscription as cancelled)
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signatureHeader = request.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret) {
    const isValid = verifyStripeSignature(body, signatureHeader, webhookSecret);
    if (!isValid) {
      console.error("[Stripe Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    console.warn(
      "[Stripe Webhook] STRIPE_WEBHOOK_SECRET not set in environment. Skipping signature verification in development."
    );
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const supabase = getSupabase();
  const eventType = event.type;
  const dataObject = event.data?.object;

  console.log(`[Stripe Webhook] Processing event: ${eventType} (ID: ${event.id})`);

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const userId =
          dataObject.client_reference_id ||
          dataObject.metadata?.user_id ||
          dataObject.subscription_data?.metadata?.user_id;

        const customerEmail = dataObject.customer_details?.email || dataObject.customer_email;
        const subscriptionId = dataObject.subscription;

        console.log(`[Stripe Webhook] Checkout completed for user: ${userId || customerEmail}`);

        if (userId) {
          await supabase
            .from("candidates")
            .update({
              subscription_status: "active",
              subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } else if (customerEmail) {
          // Fallback to match by email
          await supabase
            .from("candidates")
            .update({
              subscription_status: "active",
              subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("email", customerEmail);
        }
        break;
      }

      case "invoice.payment_succeeded":
      case "invoice.paid": {
        const customerEmail = dataObject.customer_email;
        const userId = dataObject.lines?.data?.[0]?.metadata?.user_id;

        console.log(`[Stripe Webhook] Invoice paid for user: ${userId || customerEmail}`);

        if (userId) {
          await supabase
            .from("candidates")
            .update({
              subscription_status: "active",
              subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } else if (customerEmail) {
          await supabase
            .from("candidates")
            .update({
              subscription_status: "active",
              subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("email", customerEmail);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const customerEmail = dataObject.customer_email;
        const userId = dataObject.metadata?.user_id;

        console.log(`[Stripe Webhook] Subscription cancelled for user: ${userId || customerEmail}`);

        if (userId) {
          await supabase
            .from("candidates")
            .update({
              subscription_status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } else if (customerEmail) {
          await supabase
            .from("candidates")
            .update({
              subscription_status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("email", customerEmail);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook] Error processing event:", error);
    return NextResponse.json(
      { error: "Internal processing error", details: error.message },
      { status: 500 }
    );
  }
}
