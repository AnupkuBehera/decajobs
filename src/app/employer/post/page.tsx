"use client";

import { useActionState, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createJobPosting, type JobPostState } from "./actions";

function CharacterCount({
  current,
  min,
  max,
}: {
  current: number;
  min: number;
  max: number;
}) {
  const isTooShort = current > 0 && current < min;
  const isTooLong = current > max;
  const isValid = current >= min && current <= max;

  let colorClass = "text-neutral-500";
  if (isTooShort) colorClass = "text-amber-600";
  if (isTooLong) colorClass = "text-error-600";
  if (isValid) colorClass = "text-green-600";

  return (
    <span className={`text-xs ${colorClass}`} aria-live="polite">
      {current}/{max}
      {isTooShort && ` (min ${min})`}
    </span>
  );
}

export default function PostJobPage() {
  const [state, formAction, isPending] = useActionState<
    JobPostState | null,
    FormData
  >(createJobPosting, null);

  const [titleLength, setTitleLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [applicationLink, setApplicationLink] = useState("");

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitleLength(e.target.value.length);
    },
    []
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescriptionLength(e.target.value.length);
    },
    []
  );

  const handleApplicationLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setApplicationLink(e.target.value);
    },
    []
  );

  const isValidUrl = useCallback((value: string): boolean | null => {
    if (!value) return null;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }, []);

  const urlValid = isValidUrl(applicationLink);

  if (state?.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Job Posted Successfully!
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Your job listing is now active and will be included in candidate
            matching.
          </p>
          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => window.location.reload()}
          >
            Post Another Job
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-0">
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Post a Job</CardTitle>
        </CardHeader>

        {state?.errors?.general && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {state.errors.general}
          </div>
        )}

        <form action={formAction} className="space-y-6" aria-label="Post a job">
          {/* Live region for form-level error announcements */}
          <div aria-live="assertive" aria-atomic="true" className="sr-only">
            {state?.errors
              ? `Form has errors. Please review and correct the highlighted fields.`
              : ""}
          </div>
          {/* Job Title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="title"
                className="text-sm font-medium text-neutral-700"
              >
                Job Title
              </label>
              <CharacterCount current={titleLength} min={5} max={100} />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g., Senior Frontend Engineer"
              aria-invalid={!!state?.errors?.title}
              aria-describedby={
                state?.errors?.title ? "title-error" : undefined
              }
              onChange={handleTitleChange}
              maxLength={100}
              className={`w-full rounded-lg border px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px] ${
                state?.errors?.title
                  ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            />
            {state?.errors?.title && (
              <p id="title-error" role="alert" className="text-sm text-error-600">
                {state.errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="text-sm font-medium text-neutral-700"
              >
                Description
              </label>
              <CharacterCount
                current={descriptionLength}
                min={50}
                max={5000}
              />
            </div>
            <textarea
              id="description"
              name="description"
              required
              rows={8}
              placeholder="Describe the role, responsibilities, and requirements..."
              aria-invalid={!!state?.errors?.description}
              aria-describedby={
                state?.errors?.description ? "description-error" : undefined
              }
              onChange={handleDescriptionChange}
              maxLength={5000}
              className={`w-full resize-y rounded-lg border px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px] ${
                state?.errors?.description
                  ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            />
            {state?.errors?.description && (
              <p
                id="description-error"
                role="alert"
                className="text-sm text-error-600"
              >
                {state.errors.description}
              </p>
            )}
          </div>

          {/* Location */}
          <Input
            label="Location"
            name="location"
            type="text"
            required
            placeholder='e.g., San Francisco, CA or "Remote"'
            error={state?.errors?.location}
          />

          {/* Application Link */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="applicationLink"
              className="text-sm font-medium text-neutral-700"
            >
              Application Link
            </label>
            <input
              id="applicationLink"
              name="applicationLink"
              type="url"
              required
              placeholder="https://example.com/apply"
              aria-invalid={!!state?.errors?.applicationLink}
              aria-describedby="applicationLink-hint applicationLink-error"
              onChange={handleApplicationLinkChange}
              className={`w-full rounded-lg border px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px] ${
                state?.errors?.applicationLink
                  ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            />
            {/* URL validation hint */}
            {applicationLink && (
              <p
                id="applicationLink-hint"
                className={`text-xs ${
                  urlValid === true
                    ? "text-green-600"
                    : urlValid === false
                      ? "text-amber-600"
                      : "text-neutral-500"
                }`}
              >
                {urlValid === true
                  ? "✓ Valid URL"
                  : urlValid === false
                    ? "Please enter a valid URL starting with http:// or https://"
                    : ""}
              </p>
            )}
            {state?.errors?.applicationLink && (
              <p
                id="applicationLink-error"
                role="alert"
                className="text-sm text-error-600"
              >
                {state.errors.applicationLink}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isPending}
          >
            Post Job
          </Button>
        </form>
      </Card>
    </div>
  );
}
