"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface MarketOption {
  code: "in" | "global" | "gb" | "ae";
  name: string;
  flag: string;
  currency: string;
  price: string;
  provider: "razorpay" | "stripe";
  methodsText: string;
}

const MARKETS: MarketOption[] = [
  {
    code: "in",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    price: "₹299",
    provider: "razorpay",
    methodsText: "UPI (GPay, PhonePe, Paytm), RuPay & Indian Netbanking",
  },
  {
    code: "global",
    name: "Global / US",
    flag: "🌍",
    currency: "USD",
    price: "$4.99",
    provider: "razorpay",
    methodsText: "International Visa, Mastercard & American Express",
  },
  {
    code: "gb",
    name: "UK",
    flag: "🇬🇧",
    currency: "GBP",
    price: "£4.99",
    provider: "razorpay",
    methodsText: "International Visa, Mastercard & UK Cards",
  },
  {
    code: "ae",
    name: "UAE & Gulf",
    flag: "🇦🇪",
    currency: "AED",
    price: "19 AED",
    provider: "razorpay",
    methodsText: "International Visa, Mastercard & Gulf Cards",
  },
];

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingSub, setCheckingSub] = useState(true);
  const [isAlreadyPro, setIsAlreadyPro] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<"in" | "global" | "gb" | "ae">("in");

  useEffect(() => {
    // Read country from cookie if present
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/NEXT_COUNTRY=([a-z]+)/);
      if (match && match[1]) {
        const c = match[1];
        if (c === "ae" || c === "gb" || c === "global") {
          setSelectedMarket(c);
        } else if (c === "us" || c === "ca" || c === "eu") {
          setSelectedMarket("global");
        }
      }
    }

    async function checkExistingSub() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: candidate } = await supabase
            .from("candidates")
            .select("subscription_status, subscription_ends_at")
            .eq("id", user.id)
            .maybeSingle();

          if (candidate?.subscription_status === "active") {
            const endDate = candidate.subscription_ends_at
              ? new Date(candidate.subscription_ends_at)
              : null;
            if (!endDate || endDate > new Date()) {
              setIsAlreadyPro(true);
            }
          }
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      } finally {
        setCheckingSub(false);
      }
    }
    checkExistingSub();
  }, []);

  const currentMarket = MARKETS.find((m) => m.code === selectedMarket) || MARKETS[0];

  const handleMarketChange = (code: "in" | "global" | "gb" | "ae") => {
    setSelectedMarket(code);
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_COUNTRY=${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  async function handleSubscribe() {
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Create subscription on server with selected market
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedMarket }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(
          data.message || data.details || data.error || "Failed to create subscription"
        );
        setIsLoading(false);
        return;
      }

      // If Stripe international checkout, redirect to Stripe Checkout session
      if (data.provider === "stripe" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Open Razorpay checkout for India
      const options = {
        key: data.razorpayKeyId,
        subscription_id: data.subscriptionId,
        name: "DecaJobs",
        description: `DecaJobs Pro - ${data.displayPrice || "₹299/month"}`,
        theme: { color: "#2563eb" },
        handler: async function (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          // Immediately activate Pro status (fast-path verification)
          try {
            await fetch("/api/subscription/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: paymentResponse.razorpay_payment_id,
                subscriptionId:
                  paymentResponse.razorpay_subscription_id || data.subscriptionId,
                signature: paymentResponse.razorpay_signature,
              }),
            });
          } catch {
            // Webhook will also handle it even if client fetch fails
          }
          setStatus("success");
          // Redirect to dashboard after success
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      setErrorMsg("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (checkingSub) {
    return (
      <div className="py-16 text-center">
        <div className="text-neutral-500">Checking subscription status...</div>
      </div>
    );
  }

  if (isAlreadyPro) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">You are already a Pro Member!</h1>
          <p className="mt-2 text-neutral-600">You have full access to all DecaJobs Pro features.</p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 min-h-[44px]"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Subscription Activated!</h1>
          <p className="mt-2 text-neutral-600">You now have full access to DecaJobs Pro. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Upgrade to DecaJobs Pro
          </h1>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base">
            10 AI-matched jobs delivered to your inbox every morning at 7:00 AM.
          </p>

          {/* Currency / Market Selector */}
          <div className="mt-6 inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200">
            {MARKETS.map((market) => {
              const active = market.code === selectedMarket;
              return (
                <button
                  key={market.code}
                  type="button"
                  onClick={() => handleMarketChange(market.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-neutral-900 shadow-xs font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <span>{market.flag}</span>
                  <span>{market.name}</span>
                </button>
              );
            })}
          </div>

          <Card padding="lg" className="mt-6 text-left">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 mb-2">
                {currentMarket.provider === "stripe" ? "🌍 International Subscription" : "🇮🇳 Domestic India Plan"}
              </div>
              <p className="mt-1">
                <span className="text-4xl font-extrabold text-neutral-900">
                  {currentMarket.price}
                </span>
                <span className="text-neutral-500 text-sm"> / month</span>
              </p>
              <p className="mt-2 text-sm text-green-600 font-semibold">
                🎉 First 7 days FREE — cancel anytime with 1 click
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 text-xs text-neutral-600 space-y-1">
              <p className="font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>{currentMarket.provider === "stripe" ? "💳 Stripe Checkout" : "⚡ Razorpay"}</span>
                <span className="text-[10px] text-neutral-400 font-normal">| Accepted Methods</span>
              </p>
              <p>{currentMarket.methodsText}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "10 AI-matched jobs daily in your inbox at 7 AM",
                "Jobs aggregated from LinkedIn, Indeed, Glassdoor & 20+ sources",
                "Full access to all 12+ AI career tools (Resume Scorer, Cover Letter, ATS Scanner)",
                "Priority job ranking matching your exact target skills & salary expectations",
                "Zero commitment — cancel anytime from your account settings",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {errorMsg && (
              <p className="text-sm text-red-600 mb-4 p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
                {errorMsg}
              </p>
            )}

            <Button
              onClick={handleSubscribe}
              isLoading={isLoading}
              size="lg"
              className="w-full text-base font-semibold shadow-md"
            >
              Start 7-Day Free Trial — {currentMarket.price}/mo after trial
            </Button>

            <p className="mt-4 text-center text-xs text-neutral-500">
              {currentMarket.provider === "stripe"
                ? "🔒 256-bit encrypted international checkout via Stripe. Apple Pay & credit/debit cards accepted."
                : "🔒 256-bit encrypted domestic checkout via Razorpay. UPI, RuPay & Netbanking accepted."}
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
