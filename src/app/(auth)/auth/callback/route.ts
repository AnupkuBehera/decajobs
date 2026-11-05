import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Auth callback route handler.
 * Exchanges the auth code for a session, then redirects based on profile status:
 * - Admin users → /admin
 * - If `redirectTo` param is present and user has a profile → use that redirect
 * - Profile exists → /dashboard (returning user)
 * - No profile → /profile (new user setup)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tpnmxxwplvsbdypxhuys.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    "";

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore errors when called from Server Component context
        }
      },
    },
  });

  // Exchange the code for a session
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  // Check if authenticated user is an administrator
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!adminEmails.includes("anup4503@gmail.com")) adminEmails.push("anup4503@gmail.com");
  if (!adminEmails.includes("anupkist@gmail.com")) adminEmails.push("anupkist@gmail.com");

  const isAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
  if (isAdmin) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  // Edge case: ensure candidate record exists (handles case where auth trigger failed)
  const { data: candidate } = await supabase
    .from("candidates")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!candidate) {
    // Trigger didn't fire — create candidate record as fallback
    await supabase.from("candidates").insert({
      id: user.id,
      email: user.email!,
    });
  }

  // Check if user has a candidate profile (determines new vs returning user)
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("id")
    .eq("candidate_id", user.id)
    .single();

  if (!profile) {
    // New user — always redirect to profile setup regardless of redirectTo
    return NextResponse.redirect(`${origin}/profile`);
  }

  // Returning user with profile
  // Use the redirectTo param if it's a valid relative path, otherwise go to dashboard
  if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
