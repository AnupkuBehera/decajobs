"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface EditJobFormProps {
  jobId: string;
  title: string;
  location: string;
  description: string;
  applicationLink: string;
}

interface FieldErrors {
  description?: string;
  application_link?: string;
  general?: string;
}

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

export function EditJobForm({
  jobId,
  title,
  location,
  description: initialDescription,
  applicationLink: initialApplicationLink,
}: EditJobFormProps) {
  const router = useRouter();
  const [description, setDescription] = useState(initialDescription);
  const [applicationLink, setApplicationLink] = useState(initialApplicationLink);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    if (description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    } else if (description.length > 5000) {
      newErrors.description = "Description must be at most 5000 characters";
    }

    if (!applicationLink) {
      newErrors.application_link = "Application link is required";
    } else if (!isValidUrl(applicationLink)) {
      newErrors.application_link = "Application link must be a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          application_link: applicationLink,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if (data.details) {
          const fieldErrors: FieldErrors = {};
          if (data.details.description) {
            fieldErrors.description = data.details.description[0];
          }
          if (data.details.application_link) {
            fieldErrors.application_link = data.details.application_link[0];
          }
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error || "Failed to update job listing" });
        }
        return;
      }

      router.push("/employer/dashboard");
    } catch {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Edit Job Listing</CardTitle>
      </CardHeader>

      {errors.general && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Edit job listing">
        {/* Live region for form-level error announcements */}
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
          {Object.keys(errors).length > 0
            ? `Form has errors. Please review and correct the highlighted fields.`
            : ""}
        </div>
        {/* Job Title (read-only) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="title"
            className="text-sm font-medium text-neutral-700"
          >
            Job Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            disabled
            aria-readonly="true"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-600 cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500">Title cannot be edited</p>
        </div>

        {/* Location (read-only) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="location"
            className="text-sm font-medium text-neutral-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            disabled
            aria-readonly="true"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-600 cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500">Location cannot be edited</p>
        </div>

        {/* Description (editable) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="description"
              className="text-sm font-medium text-neutral-700"
            >
              Description
            </label>
            <CharacterCount
              current={description.length}
              min={50}
              max={5000}
            />
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            required
            placeholder="Describe the role, responsibilities, and requirements..."
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            maxLength={5000}
            className={`w-full resize-y rounded-lg border px-3 py-2 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.description
                ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                : "border-neutral-300 hover:border-neutral-400"
            }`}
          />
          {errors.description && (
            <p
              id="description-error"
              role="alert"
              className="text-sm text-error-600"
            >
              {errors.description}
            </p>
          )}
        </div>

        {/* Application Link (editable) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="applicationLink"
            className="text-sm font-medium text-neutral-700"
          >
            Application Link
          </label>
          <input
            id="applicationLink"
            type="url"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            required
            placeholder="https://example.com/apply"
            aria-invalid={!!errors.application_link}
            aria-describedby="applicationLink-hint applicationLink-error"
            className={`w-full rounded-lg border px-3 py-2 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.application_link
                ? "border-error-500 focus:ring-error-500 focus:border-error-500"
                : "border-neutral-300 hover:border-neutral-400"
            }`}
          />
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
          {errors.application_link && (
            <p
              id="applicationLink-error"
              role="alert"
              className="text-sm text-error-600"
            >
              {errors.application_link}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/employer/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
