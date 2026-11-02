import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getPaymentConfig,
  PAYMENT_CONFIGS,
  getRazorpayPlanId,
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

describe("Unified Payment Router - getRazorpayPlanId", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.RAZORPAY_PLAN_ID = "plan_default_inr_123";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns currency-specific plan ID when configured", () => {
    process.env.RAZORPAY_PLAN_ID_USD = "plan_usd_456";
    process.env.RAZORPAY_PLAN_ID_GBP = "plan_gbp_789";

    expect(getRazorpayPlanId("USD")).toBe("plan_usd_456");
    expect(getRazorpayPlanId("GBP")).toBe("plan_gbp_789");
  });

  it("falls back to default RAZORPAY_PLAN_ID when currency plan is not set", () => {
    delete process.env.RAZORPAY_PLAN_ID_USD;
    expect(getRazorpayPlanId("USD")).toBe("plan_default_inr_123");
    expect(getRazorpayPlanId("INR")).toBe("plan_default_inr_123");
  });
});
