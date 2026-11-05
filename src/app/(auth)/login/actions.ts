"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendMagicLink } from "@/lib/resend/send";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface LoginState {
  success: boolean;
  error?: string;
}

function getAdminEmails(): string[] {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!adminEmails.includes("anup4503@gmail.com")) adminEmails.push("anup4503@gmail.com");
  if (!adminEmails.includes("anupkist@gmail.com")) adminEmails.push("anupkist@gmail.com");
  return adminEmails;
}

export async function signInWithPassword(
  _prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!email || typeof email !== "string") {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password || typeof password !== "string") {
    return { success: false, error: "Please enter your password." };
  }

  const emailTrimmed = email.trim().toLowerCase();
  const isAdmin = getAdminEmails().includes(emailTrimmed);

  let success = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: emailTrimmed,
      password,
    });

    if (error) {
      console.error("[Login] signInWithPassword error:", error.message);
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Invalid email or password. If you haven't set a password yet, please use 'Sign in with Magic Link instead'.",
        };
      }
      return { success: false, error: error.message };
    }
    success = true;
  } catch (err: any) {
    console.error("[Login] Unexpected error in password sign-in:", err);
    return {
      success: false,
      error: err?.message || "Unable to sign in. Please try again.",
    };
  }

  if (success) {
    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      redirect(redirectTo);
    } else if (isAdmin) {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return { success: false };
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

  const emailTrimmed = email.trim().toLowerCase();
  const isAdmin = getAdminEmails().includes(emailTrimmed);

  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tpnmxxwplvsbdypxhuys.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    const adminSupabase = createAdminClient(supabaseUrl, supabaseKey);
    
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("x-forwarded-host") 
      ? `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("x-forwarded-host")}`
      : headersList.get("host") 
        ? `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("host")}`
        : "https://decajob.com";

    // 1. Check if candidate already exists in the database
    const { data: candidate } = await adminSupabase
      .from("candidates")
      .select("id")
      .eq("email", emailTrimmed)
      .maybeSingle();

    // 2. If candidate doesn't exist, create user account in Supabase auth with auto-confirmed email
    if (!candidate) {
      const { error: createError } = await adminSupabase.auth.admin.createUser({
        email: emailTrimmed,
        email_confirm: true,
      });

      if (createError && !createError.message.includes("already exists")) {
        console.error("[Login] Admin createUser error:", createError.message);
        return { success: false, error: createError.message };
      }
    }

    // 3. Generate passwordless magic link programmatically
    const callbackRedirect = isAdmin
      ? `${origin}/auth/callback?redirectTo=/admin`
      : `${origin}/auth/callback`;

    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email: emailTrimmed,
      options: {
        redirectTo: callbackRedirect,
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
    await sendMagicLink(emailTrimmed, loginUrl);

    return { success: true };
  } catch (err: any) {
    console.error("[Login] Unexpected error:", err);
    return {
      success: false,
      error: err?.message || "Unable to send magic link. Please check your connection and try again.",
    };
  }
}
