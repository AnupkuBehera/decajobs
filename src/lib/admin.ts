import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Checks if the current authenticated user is an administrator.
 * Returns the user object if they are authorized, or null if unauthorized.
 */
export async function verifyAdmin() {
  const authClient = await createAuthClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  if (!adminEmails.includes("anup4503@gmail.com")) adminEmails.push("anup4503@gmail.com");
  if (!adminEmails.includes("anupkist@gmail.com")) adminEmails.push("anupkist@gmail.com");

  if (!adminEmails.includes(user.email.toLowerCase())) {
    return null;
  }

  return user;
}

/**
 * Creates a Supabase client using the service role key to bypass RLS policies.
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
