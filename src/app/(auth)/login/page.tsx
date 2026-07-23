"use client";

import { useState, useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { signInWithMagicLink, signInWithPassword, type LoginState } from "./actions";

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<"magic-link" | "password">("magic-link");
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(
    signInWithMagicLink,
    null
  );
  const [passwordState, passwordFormAction, isPasswordPending] = useActionState<LoginState | null, FormData>(
    signInWithPassword,
    null
  );
  const [oauthLoading, setOauthLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleGoogleCredentialResponse = async (response: any) => {
    setOauthLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.credential,
    });
    if (error) {
      setOauthLoading(false);
      window.location.href = "/login?error=oauth_failed";
    } else {
      window.location.href = "/dashboard";
    }
  };

  const initGoogle = () => {
    if (typeof window !== "undefined" && (window as any).google) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "936134964170-sn6epnfotq4s5dfc4vas6qqucqrvveqb.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: 384, text: "continue_with", logo_alignment: "left" }
        );
      } catch (err) {
        console.error("Failed to initialize Google Sign-in:", err);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google) {
      initGoogle();
    }
  }, []);
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
            {loginMode === "magic-link" ? (
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

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setLoginMode("password")}
                    className="text-xs text-primary-600 hover:underline min-h-[44px]"
                  >
                    Sign in with Password instead
                  </button>
                </div>
              </form>
            ) : (
              <form action={passwordFormAction} className="space-y-4" aria-label="Sign in with password">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  error={passwordState?.error}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  error={passwordState?.error ? "" : undefined}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isPasswordPending}
                >
                  Sign In
                </Button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setLoginMode("magic-link")}
                    className="text-xs text-primary-600 hover:underline min-h-[44px]"
                  >
                    Sign in with Magic Link instead
                  </button>
                </div>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">or</span>
              </div>
            </div>

            <div className="w-full flex justify-center min-h-[44px] mt-2">
              <div id="google-signin-button" className="w-full flex justify-center" />
            </div>
            <Script
              src="https://accounts.google.com/gsi/client"
              strategy="afterInteractive"
              onLoad={initGoogle}
            />
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
