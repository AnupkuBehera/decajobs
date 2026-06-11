import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Employer verification callback route.
 *
 * When an employer clicks the verification link in their email,
 * this route:
 * 1. Validates the token from the query string
 * 2. Checks the token hasn't expired (24 hour window)
 * 3. Marks the employer as verified
 * 4. Clears the token and redirects to /employer/dashboard
 *
 * Handles expired links by redirecting to the registration page
 * with an appropriate error message and re-send option.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    // No token provided — link may be malformed
    return NextResponse.redirect(
      `${origin}/employer/register?error=expired`
    );
  }

  // Use service role client to bypass RLS for employer lookup
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find employer by verification token
  const { data: employer, error: lookupError } = await supabase
    .from("employers")
    .select("id, email, is_verified, verification_expires_at")
    .eq("verification_token", token)
    .single();

  if (lookupError || !employer) {
    // Token not found — could be invalid or already used
    return NextResponse.redirect(
      `${origin}/employer/register?error=expired`
    );
  }

  // Check if employer is already verified
  if (employer.is_verified) {
    return NextResponse.redirect(`${origin}/employer/dashboard`);
  }

  // Check if the token has expired (24 hours)
  if (employer.verification_expires_at) {
    const expiresAt = new Date(employer.verification_expires_at);
    if (expiresAt < new Date()) {
      // Token has expired
      return NextResponse.redirect(
        `${origin}/employer/register?error=expired`
      );
    }
  }

  // Mark employer as verified and clear the token
  const { error: updateError } = await supabase
    .from("employers")
    .update({
      is_verified: true,
      verification_token: null,
      verification_expires_at: null,
    })
    .eq("id", employer.id);

  if (updateError) {
    return NextResponse.redirect(
      `${origin}/employer/register?error=auth_failed`
    );
  }

  // Redirect to employer dashboard
  return NextResponse.redirect(`${origin}/employer/dashboard`);
}
