import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decodeUnsubscribeToken } from "@/lib/unsubscribe/token";

/**
 * Unsubscribe API route handler.
 *
 * When a candidate clicks the unsubscribe link in their daily digest email,
 * this route:
 * 1. Decodes the base64url token to extract the candidate ID
 * 2. Sets the candidate's is_active flag to false using the service role client
 * 3. Redirects to the /unsubscribed confirmation page
 *
 * Uses the Supabase service role client to bypass RLS since this is an
 * unauthenticated request (user clicks from email).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { origin } = new URL(request.url);

  // Decode token to get candidate ID
  const candidateId = decodeUnsubscribeToken(token);

  if (!candidateId) {
    return NextResponse.redirect(
      `${origin}/unsubscribed?error=invalid_token`
    );
  }

  // Use service role client to bypass RLS for unauthenticated unsubscribe
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verify the candidate exists
  const { data: candidate, error: lookupError } = await supabase
    .from("candidates")
    .select("id, is_active")
    .eq("id", candidateId)
    .single();

  if (lookupError || !candidate) {
    return NextResponse.redirect(
      `${origin}/unsubscribed?error=invalid_token`
    );
  }

  // Set candidate as inactive (unsubscribed)
  const { error: updateError } = await supabase
    .from("candidates")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", candidateId);

  if (updateError) {
    console.error("[Unsubscribe] Failed to deactivate candidate:", updateError);
    return NextResponse.redirect(
      `${origin}/unsubscribed?error=server_error`
    );
  }

  // Redirect to confirmation page
  return NextResponse.redirect(`${origin}/unsubscribed`);
}
