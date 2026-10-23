import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getPaymentConfig,
  PAYMENT_CONFIGS,
  createStripeSubscriptionSession,
} from "./payment-router";

describe("Unified Payment Router - getPaymentConfig", () => {
  it("routes India correctly to Razorpay with ₹299", () => {
    const config = getPaymentConfig("in");
    expect(config.provider).toBe("razorpay");
    expect(config.currency).toBe("INR");
    expect(config.currencySymbol).toBe("₹");
    expect(config.amountMinor).toBe(29900);
    expect(config.displayPrice).toBe("₹299");
    expect(config.trialDays).toBe(7);
  });

  it("handles case-insensitive country code for India", () => {
    const configUpper = getPaymentConfig("IN");
    const configPadded = getPaymentConfig(" in ");
    expect(configUpper.provider).toBe("razorpay");
    expect(configPadded.provider).toBe("razorpay");
  });

  it("routes United Kingdom (gb / uk) to Razorpay with £4.99 and international card support", () => {
    const configGb = getPaymentConfig("gb");
    const configUk = getPaymentConfig("uk");
    expect(configGb.provider).toBe("razorpay");
    expect(configGb.currency).toBe("GBP");
    expect(configGb.amountMinor).toBe(499);
    expect(configGb.displayPrice).toBe("£4.99");
    expect(configUk).toEqual(configGb);
  });

  it("routes UAE & Gulf countries (ae, sa, qa, kw, bh, om) to Razorpay with 19 AED", () => {
    const gulfCodes = ["ae", "sa", "qa", "kw", "bh", "om"];
    gulfCodes.forEach((code) => {
      const config = getPaymentConfig(code);
      expect(config.provider).toBe("razorpay");
      expect(config.currency).toBe("AED");
      expect(config.amountMinor).toBe(1900);
      expect(config.displayPrice).toBe("19 AED");
    });
  });

  it("routes Global / US / CA / EU / SG to Razorpay USD $4.99", () => {
    const globalCodes = ["global", "us", "ca", "au", "nz", "de", "fr", "sg", "jp"];
    globalCodes.forEach((code) => {
      const config = getPaymentConfig(code);
      expect(config.provider).toBe("razorpay");
      expect(config.currency).toBe("USD");
      expect(config.amountMinor).toBe(499);
      expect(config.displayPrice).toBe("$4.99");
    });
  });

  it("defaults unknown or missing country code to India Razorpay", () => {
    const emptyConfig = getPaymentConfig("");
    const undefinedConfig = getPaymentConfig(undefined);
    const unknownConfig = getPaymentConfig("xyz123");

    expect(emptyConfig.provider).toBe("razorpay");
    expect(undefinedConfig.provider).toBe("razorpay");
    expect(unknownConfig.provider).toBe("razorpay");
  });
});

describe("Payment Router - createStripeSubscriptionSession fallback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.STRIPE_SECRET_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns simulated session URL when STRIPE_SECRET_KEY is not set", async () => {
    const config = PAYMENT_CONFIGS.global;
    const session = await createStripeSubscriptionSession({
      userId: "user_test_123",
      userEmail: "test@decajob.com",
      config,
      origin: "https://decajob.com",
    });

    expect(session.sessionId).toContain("mock_stripe_");
    expect(session.checkoutUrl).toContain("mock_stripe_sub_");
    expect(session.checkoutUrl).toContain("trial=started");
  });
});
