"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function JobsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Jobs directory error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <span className="text-2xl" aria-hidden="true">💼</span>
        </div>
        <h2 className="mb-2 text-xl font-bold text-neutral-900">
          Job Board Temporary Interruption
        </h2>
        <p className="mb-6 text-sm text-neutral-600">
          We experienced a temporary issue loading this job listing. You can try again or browse thousands of live verified openings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} variant="primary" size="md">
            Try again
          </Button>
          <Link
            href="/jobs"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
          >
            Browse All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

