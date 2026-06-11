"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TriggerDigestButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleTrigger() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/trigger-digest", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send digest.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleTrigger}
        isLoading={status === "loading"}
        variant="primary"
        size="md"
        className="w-full sm:w-auto"
      >
        {status === "loading" ? "Sending..." : "Send My Daily 10 Now"}
      </Button>
      {message && (
        <p
          className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
