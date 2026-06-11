"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resend, FROM_EMAIL } from "@/lib/resend/client";
import { EmployerVerificationEmail } from "@/emails/employer-verification";
import { headers } from "next/headers";

export interface EmployerRegisterState {
  success: boolean;
  error?: string;
}

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function registerEmployer(
  _prevState: EmployerRegisterState | null,
  formData: FormData
): Promise<EmployerRegisterState> {
  const email = formData.get("email") as string;
  const companyName = (formData.get("companyName") as string) || null;

  if (!email || typeof email !== "string") {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const supabase = getServiceClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  // Generate a verification token
  const verificationToken = crypto.randomUUID();
  const verificationExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString(); // 24 hours

  // Check if employer already exists
  const { data: existingEmployer } = await supabase
    .from("employers")
    .select("id, is_verified, email")
    .eq("email", email)
    .single();

  if (existingEmployer) {
    if (existingEmployer.is_verified) {
      return {
        success: false,
        error: "This email is already registered and verified. Please sign in.",
      };
    }

    // Update the existing unverified employer with a new token
    const { error: updateError } = await supabase
      .from("employers")
      .update({
        verification_token: verificationToken,
        verification_expires_at: verificationExpiresAt,
        company_name: companyName || existingEmployer.email,
      })
      .eq("id", existingEmployer.id);

    if (updateError) {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  } else {
    // Create new employer record with verification token
    const { error: insertError } = await supabase.from("employers").insert({
      email,
      company_name: companyName,
      is_verified: false,
      verification_token: verificationToken,
      verification_expires_at: verificationExpiresAt,
    });

    if (insertError) {
      // Handle unique constraint violation
      if (insertError.code === "23505") {
        return {
          success: false,
          error: "This email is already registered. Please try signing in.",
        };
      }
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }

  // Send verification email via Resend
  const verificationUrl = `${origin}/employer/verify?token=${verificationToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your employer account - DecaJobs",
      react: EmployerVerificationEmail({ verificationUrl, companyName: companyName || undefined }),
    });
  } catch {
    return {
      success: false,
      error: "Failed to send verification email. Please try again.",
    };
  }

  return { success: true };
}

export async function resendVerificationEmail(
  _prevState: EmployerRegisterState | null,
  formData: FormData
): Promise<EmployerRegisterState> {
  const email = formData.get("email") as string;
  const companyName = (formData.get("companyName") as string) || null;

  if (!email || typeof email !== "string") {
    return { success: false, error: "Please enter your email address to resend." };
  }

  const supabase = getServiceClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  // Find the employer
  const { data: employer } = await supabase
    .from("employers")
    .select("id, is_verified")
    .eq("email", email)
    .single();

  if (!employer) {
    return { success: false, error: "No account found with this email. Please register first." };
  }

  if (employer.is_verified) {
    return { success: false, error: "This account is already verified. Please sign in." };
  }

  // Generate a new token
  const verificationToken = crypto.randomUUID();
  const verificationExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  const { error: updateError } = await supabase
    .from("employers")
    .update({
      verification_token: verificationToken,
      verification_expires_at: verificationExpiresAt,
    })
    .eq("id", employer.id);

  if (updateError) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  // Send verification email via Resend
  const verificationUrl = `${origin}/employer/verify?token=${verificationToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your employer account - DecaJobs",
      react: EmployerVerificationEmail({ verificationUrl, companyName: companyName || undefined }),
    });
  } catch {
    return {
      success: false,
      error: "Failed to send verification email. Please try again.",
    };
  }

  return { success: true };
}
