"use client";

import { useState, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { signInWithMagicLink, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(
    signInWithMagicLink,
    null
  );
  const [oauthLoading, setOauthLoading] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    missing_code: "Authentication failed. Please try logging in again.",
    auth_failed: "The login link has expired or is invalid. Please request a new one.",
    oauth_failed: "Google sign-in failed. Please try again or use a magic link.",
    no_user: "Could not verify your identity. Please try again.",
  };

  const displayError = errorParam ? errorMessages[errorParam] || "An error occurred." : null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Sign in to DecaJobs
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Get 10 perfectly matched jobs in your inbox every morning.
          </p>
        </div>

        {displayError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-800"
          >
            <p className="text-sm">{displayError}</p>
          </div>
        )}

        {state?.success ? (
          <Card padding="lg">
            <div role="status" className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="font-medium text-neutral-900">Check your email!</p>
              <p className="mt-1 text-sm text-neutral-600">
                We sent a magic link to your email address. Click it to sign in.
                The link expires in 15 minutes.
              </p>
            </div>
          </Card>
        ) : (
          <Card padding="lg">
            <form action={formAction} className="space-y-4" aria-label="Sign in with email link">
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                error={state?.error}
              />

              <p className="text-xs text-neutral-500 leading-relaxed">
                If you already have an account, this will log you in. If you are new, this will create a free account. No password required.
              </p>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isPending}
              >
                Send Sign-In Link
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              isLoading={oauthLoading}
              onClick={async () => {
                setOauthLoading(true);
                const supabase = createClient();
                const callbackUrl = `${window.location.origin}/auth/callback`;

                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: callbackUrl,
                  },
                });

                if (error) {
                  setOauthLoading(false);
                  // Redirect to login with error param to display the error
                  window.location.href = "/login?error=oauth_failed";
                }
                // If successful, browser is redirected to Google's OAuth page
              }}
            >
              {!oauthLoading && (
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
          </Card>
        )}

        <p className="text-center text-xs text-neutral-500">
          Are you an employer?{" "}
          <a
            href="/employer/register"
            className="text-primary-600 hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
