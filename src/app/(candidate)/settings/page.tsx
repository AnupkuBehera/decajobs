"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardTitle } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "./actions";

export default function SettingsPage() {
  const [isActive, setIsActive] = useState(true);
  const [deliveryTime, setDeliveryTime] = useState("07:00");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("trial");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsFetching(false);
          return;
        }

        const { data: candidate } = await supabase
          .from("candidates")
          .select("is_active, preferred_delivery_time, subscription_status")
          .eq("id", user.id)
          .single();

        if (candidate) {
          setIsActive(candidate.is_active ?? true);
          setDeliveryTime(candidate.preferred_delivery_time ?? "07:00");
          setSubscriptionStatus(candidate.subscription_status ?? "trial");
        }
      } catch {
        // Candidate record may not exist yet
      } finally {
        setIsFetching(false);
      }
    }

    fetchSettings();
  }, []);

  const handleVerifySubscription = async () => {
    setIsVerifying(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscription/verify", { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubscriptionStatus("active");
        setSuccessMessage("Subscription verified! You now have Pro access.");
        // Reload page to update layout header Pro state immediately
        window.location.reload();
      } else {
        setErrorMessage(data.error || "Failed to verify subscription.");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await updateSettings(isActive, deliveryTime);

      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-neutral-500">Loading your settings...</div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Email Preferences
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your daily digest delivery settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Daily Digest Toggle */}
          <Card>
            <CardTitle className="mb-4">Daily Digest</CardTitle>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Receive daily job matches
                </p>
                <p className="text-sm text-neutral-500">
                  Get 10 curated jobs delivered to your inbox every day.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label="Toggle daily digest emails"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] ${
                  isActive ? "bg-primary-600" : "bg-neutral-300"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                    isActive ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {!isActive && (
              <p className="mt-3 text-sm text-amber-600">
                Your daily digest is paused. You won&apos;t receive job match emails until you re-enable it.
              </p>
            )}
          </Card>

          {/* Delivery Time Preference */}
          <Card>
            <CardTitle className="mb-4">Delivery Time</CardTitle>
            <p className="mb-4 text-sm text-neutral-500">
              Choose when you&apos;d like to receive your daily job digest.
            </p>
            <fieldset>
              <legend className="sr-only">Preferred delivery time</legend>
              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                    deliveryTime === "07:00"
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryTime"
                    value="07:00"
                    checked={deliveryTime === "07:00"}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-neutral-900">
                      Morning — 7:00 AM UTC
                    </span>
                    <p className="text-sm text-neutral-500">
                      Start your day with fresh opportunities.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                    deliveryTime === "17:00"
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryTime"
                    value="17:00"
                    checked={deliveryTime === "17:00"}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-neutral-900">
                      Evening — 5:00 PM UTC
                    </span>
                    <p className="text-sm text-neutral-500">
                      Review jobs at the end of the work day.
                    </p>
                  </div>
                </label>
              </div>
            </fieldset>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardTitle className="mb-4">Subscription</CardTitle>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Plan:{" "}
                  <span
                    className={
                      subscriptionStatus === "active"
                        ? "text-green-600"
                        : "text-neutral-600"
                    }
                  >
                    {subscriptionStatus === "active" ? "Pro" : "Free / Trial"}
                  </span>
                </p>
                <p className="text-sm text-neutral-500">
                  {subscriptionStatus === "active"
                    ? "You have full access to all Pro features."
                    : "Already paid? Click verify to activate your Pro subscription."}
                </p>
              </div>
              {subscriptionStatus !== "active" && (
                <Button
                  onClick={handleVerifySubscription}
                  isLoading={isVerifying}
                  variant="secondary"
                  size="sm"
                >
                  {isVerifying ? "Verifying..." : "Verify Payment"}
                </Button>
              )}
            </div>
          </Card>

          {/* Success/Error Messages */}
          <div aria-live="polite" aria-atomic="true">
            {successMessage && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
              >
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div>
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
