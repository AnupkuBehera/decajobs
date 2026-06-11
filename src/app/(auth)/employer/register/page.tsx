"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  registerEmployer,
  resendVerificationEmail,
  type EmployerRegisterState,
} from "./actions";

export default function EmployerRegisterPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [state, formAction, isPending] = useActionState<
    EmployerRegisterState | null,
    FormData
  >(registerEmployer, null);

  const [resendState, resendAction, isResending] = useActionState<
    EmployerRegisterState | null,
    FormData
  >(resendVerificationEmail, null);

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Register as an Employer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Expired link error banner */}
          {errorParam === "expired" && !state?.success && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800"
            >
              <p className="font-medium">Verification link expired</p>
              <p className="mt-1 text-sm text-amber-600">
                Your verification link has expired. Please enter your email
                below to request a new one.
              </p>
            </div>
          )}

          {errorParam === "auth_failed" && !state?.success && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
            >
              <p className="font-medium">Verification failed</p>
              <p className="mt-1 text-sm text-red-600">
                Something went wrong during verification. Please try registering
                again.
              </p>
            </div>
          )}
          <p className="mb-6 text-center text-neutral-600">
            Enter your email to get started posting jobs. We&apos;ll send a
            verification link to confirm your account.
          </p>

          {state?.success ? (
            <div className="space-y-4">
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-800"
              >
                <p className="font-medium">Verification email sent!</p>
                <p className="mt-1 text-sm text-green-600">
                  We sent a verification link to your email address. Click it to
                  verify your account and start posting jobs.
                </p>
              </div>

              {/* Resend verification section */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm text-neutral-600">
                  Didn&apos;t receive the email? Check your spam folder or
                  request a new link.
                </p>
                <form action={resendAction} className="mt-3">
                  <input type="hidden" name="email" value={email} />
                  <input type="hidden" name="companyName" value={companyName} />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    isLoading={isResending}
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                </form>
                {resendState?.success && (
                  <p className="mt-2 text-sm text-green-600" role="status">
                    New verification email sent!
                  </p>
                )}
                {resendState?.error && (
                  <p className="mt-2 text-sm text-error-600" role="alert">
                    {resendState.error}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4" aria-label="Employer registration">
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={state?.error}
              />

              <Input
                label="Company name"
                name="companyName"
                type="text"
                placeholder="Acme Inc. (optional)"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                helperText="Optional. You can add this later."
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isPending}
              >
                Send Verification Email
              </Button>

              <p className="text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Sign in
                </a>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
