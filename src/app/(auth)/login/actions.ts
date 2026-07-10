"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { sendMagicLink } from "@/lib/resend/send";
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
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("x-forwarded-host") 
      ? `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("x-forwarded-host")}`
      : headersList.get("host") 
        ? `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("host")}`
        : "http://localhost:3000";

    // 1. Check if candidate already exists in the database
    const { data: candidate } = await adminSupabase
      .from("candidates")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // 2. If candidate doesn't exist, create user account in Supabase auth with auto-confirmed email
    if (!candidate) {
      const { error: createError } = await adminSupabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

      if (createError) {
        console.error("[Login] Admin createUser error:", createError.message);
        return { success: false, error: createError.message };
      }
    }

    // 3. Generate passwordless magic link programmatically
    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (linkError) {
      console.error("[Login] Generate magiclink error:", linkError.message);
      return { success: false, error: linkError.message };
    }

    const loginUrl = linkData?.properties?.action_link;
    if (!loginUrl) {
      return { success: false, error: "Failed to generate login link." };
    }

    // 4. Send the magic link securely via Resend
    await sendMagicLink(email, loginUrl);

    return { success: true };
  } catch (err: any) {
    console.error("[Login] Unexpected error:", err);
    return {
      success: false,
      error: err?.message || "Unable to send magic link. Please check your connection and try again.",
    };
  }
}
