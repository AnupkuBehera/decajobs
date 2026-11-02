/**
 * Unified Razorpay Payment Router
 *
 * Directs candidates across all markets to Razorpay:
 * - India (IN): Razorpay (₹299/mo via UPI, RuPay, Netbanking, 7-day trial)
 * - United States & Global: Razorpay ($4.99 USD/mo via International Cards: Visa, MC, Amex)
 * - United Kingdom (GB): Razorpay (£4.99 GBP/mo via International Cards)
 * - UAE & Gulf (AE): Razorpay (19 AED/mo via International Cards)
 */

export interface PaymentConfig {
  provider: "razorpay";
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
    provider: "razorpay",
    countryCode: "ae",
    currency: "AED",
    currencySymbol: "AED ",
    amountMinor: 1900,
    displayPrice: "19 AED",
    interval: "month",
    trialDays: 7,
  },
  gb: {
    provider: "razorpay",
    countryCode: "gb",
    currency: "GBP",
    currencySymbol: "£",
    amountMinor: 499,
    displayPrice: "£4.99",
    interval: "month",
    trialDays: 7,
  },
  global: {
    provider: "razorpay",
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
  const code = (countryCode || "in").toLowerCase().trim();

  // Direct matches
  if (PAYMENT_CONFIGS[code]) {
    return PAYMENT_CONFIGS[code];
  }

  // Common aliases
  if (code === "uk") return PAYMENT_CONFIGS.gb;
  if (code === "sa" || code === "qa" || code === "kw" || code === "bh" || code === "om") {
    return PAYMENT_CONFIGS.ae;
  }
  if (
    code === "us" ||
    code === "ca" ||
    code === "au" ||
    code === "nz" ||
    code === "de" ||
    code === "fr" ||
    code === "es" ||
    code === "it" ||
    code === "nl" ||
    code === "se" ||
    code === "sg" ||
    code === "jp"
  ) {
    return PAYMENT_CONFIGS.global;
  }

  return PAYMENT_CONFIGS.in;
}

/**
 * Resolves the appropriate Razorpay Plan ID for a given currency.
 * Prioritizes currency-specific environment plan variables, falling back to RAZORPAY_PLAN_ID.
 */
export function getRazorpayPlanId(currency: string = "INR"): string | undefined {
  const curr = currency.toUpperCase();
  if (curr === "USD" && process.env.RAZORPAY_PLAN_ID_USD) {
    return process.env.RAZORPAY_PLAN_ID_USD;
  }
  if (curr === "GBP" && process.env.RAZORPAY_PLAN_ID_GBP) {
    return process.env.RAZORPAY_PLAN_ID_GBP;
  }
  if (curr === "AED" && process.env.RAZORPAY_PLAN_ID_AED) {
    return process.env.RAZORPAY_PLAN_ID_AED;
  }
  return process.env.RAZORPAY_PLAN_ID;
}
