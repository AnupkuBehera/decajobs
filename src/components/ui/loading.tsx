"use client";

import { forwardRef, type HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const spinnerSizes: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", label = "Loading", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={`inline-flex items-center justify-center ${className}`}
        {...props}
      >
        <svg
          className={`animate-spin text-primary-600 ${spinnerSizes[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);

Spinner.displayName = "Spinner";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedStyles: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, rounded = "md", className = "", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading content"
        className={`animate-pulse bg-neutral-200 ${roundedStyles[rounded]} ${className}`}
        style={{ width, height, ...style }}
        {...props}
      >
        <span className="sr-only">Loading content</span>
      </div>
    );
  },
);

Skeleton.displayName = "Skeleton";
