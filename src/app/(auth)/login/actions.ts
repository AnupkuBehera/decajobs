"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export interface LoginState {
  success: boolean;
  error?: string;
}

export async function signInWithMagicLink(
  _prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;

  if (!email || typeof email !== "string") {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("x-forwarded-host") 
      ? `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("x-forwarded-host")}`
      : headersList.get("host") 
        ? `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("host")}`
        : "http://localhost:3000";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("[Login] Supabase OTP error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Login] Unexpected error:", err);
    return {
      success: false,
      error: "Unable to send magic link. Please check your internet connection and try again.",
    };
  }
}
