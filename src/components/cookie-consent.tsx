"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  }

  function reject() {
    localStorage.setItem("cookie-consent", "rejected");
    // Disable GA tracking
    if (typeof window !== "undefined") {
      (window as any)["ga-disable-G-QM60V43CBZ"] = true;
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-neutral-700">
        We use essential cookies for authentication and optional cookies to improve your experience
        and serve personalized ads. See our{" "}
        <a href="/privacy" className="text-primary-600 underline">
          Privacy Policy
        </a>{" "}
        for details.
      </p>
      <div className="mt-3 flex gap-3 sm:mt-0 shrink-0">
        <button
          onClick={reject}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[44px]"
        >
          Reject Non-Essential
        </button>
        <button
          onClick={accept}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px]"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
