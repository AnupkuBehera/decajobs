"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleJobStatus } from "./actions";

interface JobToggleButtonProps {
  jobId: string;
  isActive: boolean;
}

export function JobToggleButton({ jobId, isActive }: JobToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const result = await toggleJobStatus(jobId, !isActive);
      if (!result.success) {
        setError(result.error ?? "Failed to update status");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        variant={isActive ? "secondary" : "primary"}
        size="sm"
        isLoading={isPending}
        onClick={handleToggle}
        aria-label={isActive ? "Deactivate this job listing" : "Activate this job listing"}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>
      {error && (
        <p className="text-xs text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
