"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = "", type = "text", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={
            [errorId, helperId].filter(Boolean).join(" ") || undefined
          }
          className={`w-full rounded-lg border px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] ${
            error
              ? "border-error-500 focus:ring-error-500 focus:border-error-500"
              : "border-neutral-300 hover:border-neutral-400"
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-error-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
