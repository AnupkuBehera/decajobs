import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Link from "next/link";
import { cookies } from "next/headers";
import { checkSubscription } from "@/lib/subscription/check";

export async function SiteHeader() {
  let user = null;
  let isPro = false;
  let isEmployer = false;
  let isAdmin = false;

  try {
    await cookies();
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      // Check if user is admin
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase());
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        isAdmin = true;
      }

      // Use service role to reliably read subscription_status (bypasses RLS issues)
      const serviceClient = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Check if user is a verified employer
      if (user.email) {
        const { data: employer } = await serviceClient
          .from("employers")
          .select("is_verified")
          .eq("email", user.email)
          .maybeSingle();
        
        isEmployer = employer?.is_verified ?? false;
      }

      // If not an employer, check candidate subscription
      if (!isEmployer) {
        const sub = await checkSubscription(serviceClient, user.id);
        isPro = sub.hasAccess;
      }
    }
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-primary-600 sm:text-xl">DecaJobs</span>
          <span className="hidden sm:inline text-xs text-neutral-400 border-l border-neutral-200 pl-2">10 jobs. Every morning. That&apos;s it.</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            isEmployer ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Admin 🛠️
                  </Link>
                )}
                <Link
                  href="/employer/dashboard"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/employer/post"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  Post Job
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-red-50 hover:text-error-600 transition-colors min-h-[44px] flex items-center"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Admin 🛠️
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-daily-10"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  My Daily 10
                </Link>
                <Link
                  href="/resume-tools"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  Resume AI
                </Link>
                <Link
                  href="/career-coach"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  Coach
                </Link>
                <Link
                  href="/applications"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  Tracker
                </Link>
                <Link
                  href="/ai-tools"
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
                >
                  AI Tools
                </Link>
                {isPro ? (
                  <span className="rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 min-h-[44px] flex items-center">
                    Pro
                  </span>
                ) : (
                  <Link
                    href="/subscribe"
                    className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Upgrade ⚡
                  </Link>
                )}
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-red-50 hover:text-error-600 transition-colors min-h-[44px] flex items-center"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            )
          ) : (
            <>
              <Link
                href="/tools"
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
              >
                Free Tools
              </Link>
              <Link
                href="/blog"
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
              >
                Blog
              </Link>
              <Link
                href="/login"
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/employer/register"
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px] flex items-center"
              >
                Post Jobs
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
