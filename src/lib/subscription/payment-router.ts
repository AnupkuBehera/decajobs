/**
 * Multi-Currency Payment Router
 *
 * Directs candidates to the optimal localized payment gateway:
 * - India (IN): Razorpay (₹299/mo with UPI, RuPay, Netbanking, 7-day trial)
 * - United Kingdom (GB): Stripe Checkout (£4.99/mo with Apple Pay / UK cards)
 * - UAE & Gulf (AE): Stripe Checkout (19 AED/mo with Apple Pay / Gulf cards)
 * - Global Remote: Stripe Checkout ($4.99 USD/mo)
 */

export interface PaymentConfig {
  provider: "razorpay" | "stripe";
  countryCode: string;
  currency: string;
  currencySymbol: string;
  amountMinor: number; // e.g. 29900 paise, 1900 fils, 499 pence, 499 cents
  displayPrice: string;
  interval: "month";
  trialDays: number;
}

export const PAYMENT_CONFIGS: Record<string, PaymentConfig> = {
  in: {
    provider: "razorpay",
    countryCode: "in",
    currency: "INR",
    currencySymbol: "₹",
    amountMinor: 29900,
    displayPrice: "₹299",
    interval: "month",
    trialDays: 7,
  },
  ae: {
    provider: "stripe",
    countryCode: "ae",
    currency: "AED",
    currencySymbol: "AED ",
    amountMinor: 1900,
    displayPrice: "19 AED",
    interval: "month",
    trialDays: 7,
  },
  gb: {
    provider: "stripe",
    countryCode: "gb",
    currency: "GBP",
    currencySymbol: "£",
    amountMinor: 499,
    displayPrice: "£4.99",
    interval: "month",
    trialDays: 7,
  },
  global: {
    provider: "stripe",
    countryCode: "global",
    currency: "USD",
    currencySymbol: "$",
    amountMinor: 499,
    displayPrice: "$4.99",
    interval: "month",
    trialDays: 7,
  },
};

/**
 * Returns payment gateway configuration for a candidate based on country code.
 */
export function getPaymentConfig(countryCode?: string): PaymentConfig {
  const code = (countryCode || "in").toLowerCase();
  if (PAYMENT_CONFIGS[code]) {
    return PAYMENT_CONFIGS[code];
  }
  return PAYMENT_CONFIGS.in;
}

/**
 * Creates a Stripe Checkout Session for international subscriptions.
 */
export async function createStripeSubscriptionSession(params: {
  userId: string;
  userEmail: string;
  config: PaymentConfig;
  origin: string;
}): Promise<{ checkoutUrl: string; sessionId: string }> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    // Fallback simulation when STRIPE_SECRET_KEY is not yet provisioned in environment
    console.warn("[Stripe] STRIPE_SECRET_KEY not set. Using simulated session for development.");
    return {
      checkoutUrl: `${params.origin}/dashboard?session_id=mock_stripe_sub_${Date.now()}&trial=started`,
      sessionId: `mock_stripe_${Date.now()}`,
    };
  }

  const body = new URLSearchParams({
    mode: "subscription",
    customer_email: params.userEmail,
    client_reference_id: params.userId,
    "metadata[user_id]": params.userId,
    "metadata[country]": params.config.countryCode,
    "subscription_data[trial_period_days]": String(params.config.trialDays),
    "subscription_data[metadata][user_id]": params.userId,
    "subscription_data[metadata][country]": params.config.countryCode,
    "line_items[0][price_data][currency]": params.config.currency.toLowerCase(),
    "line_items[0][price_data][product_data][name]": `DecaJobs Pro (${params.config.countryCode.toUpperCase()})`,
    "line_items[0][price_data][product_data][description]": "10 AI-matched tech jobs delivered every morning with high Trust Scores",
    "line_items[0][price_data][unit_amount]": String(params.config.amountMinor),
    "line_items[0][price_data][recurring][interval]": params.config.interval,
    "line_items[0][quantity]": "1",
    success_url: `${params.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&subscribed=true`,
    cancel_url: `${params.origin}/subscribe?canceled=true`,
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[Stripe] Failed to create checkout session:", errText);
    throw new Error(`Stripe API error: ${res.statusText}`);
  }

  const session = await res.json();
  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
}
