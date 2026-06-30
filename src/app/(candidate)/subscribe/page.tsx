"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubscribe() {
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Create subscription on server
      const response = await fetch("/api/subscription/create", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Failed to create subscription");
        setIsLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.razorpayKeyId,
        subscription_id: data.subscriptionId,
        name: "DecaJobs",
        description: "DecaJobs Pro - ₹299/month",
        theme: { color: "#2563eb" },
        handler: async function () {
          // Immediately activate Pro status (fallback for webhook delay)
          try {
            await fetch("/api/subscription/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscriptionId: data.subscriptionId }),
            });
          } catch {
            // Webhook will eventually handle it even if this fails
          }
          setStatus("success");
          // Redirect to dashboard after success
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
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
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Upgrade to DecaJobs Pro
          </h1>
          <p className="mt-4 text-neutral-600">
            Get 10 AI-matched jobs delivered to your inbox every morning.
          </p>

          <Card padding="lg" className="mt-8 text-left">
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-500">Monthly plan</p>
              <p className="mt-1">
                <span className="text-4xl font-bold text-neutral-900">₹299</span>
                <span className="text-neutral-500">/month</span>
              </p>
              <p className="mt-2 text-sm text-green-600 font-medium">
                🎉 First 7 days FREE — cancel anytime
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "10 AI-matched jobs daily in your inbox",
                "Jobs from LinkedIn, Indeed, Glassdoor & 20+ sources",
                "AI Resume Scorer & Optimizer",
                "AI Cover Letter Generator",
                "Priority job matching algorithm",
                "Cancel anytime — no lock-in",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {errorMsg && (
              <p className="text-sm text-red-600 mb-4" role="alert">{errorMsg}</p>
            )}

            <Button
              onClick={handleSubscribe}
              isLoading={isLoading}
              size="lg"
              className="w-full"
            >
              Start Free Trial — ₹299/month after 7 days
            </Button>

            <p className="mt-4 text-center text-xs text-neutral-500">
              Secure payment via Razorpay. Cancel anytime from your dashboard.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
