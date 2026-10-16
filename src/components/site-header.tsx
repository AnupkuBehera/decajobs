import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Link from "next/link";
import { cookies } from "next/headers";
import { checkSubscription } from "@/lib/subscription/check";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CountrySelector } from "@/components/country-selector";
import { MobileNav } from "@/components/mobile-nav";

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
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

      if (!adminEmails.includes("anup4503@gmail.com")) adminEmails.push("anup4503@gmail.com");
      if (!adminEmails.includes("anupkist@gmail.com")) adminEmails.push("anupkist@gmail.com");

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
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold text-base shadow-xs shadow-primary-500/20 group-hover:scale-105 transition-transform">
              D
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
              Deca<span className="text-primary-600">Jobs</span>
            </span>
          </Link>
          <span className="hidden xl:inline-block text-xs font-normal text-neutral-400 border-l border-neutral-200 pl-3">
            10 jobs. Every morning. That&apos;s it.
          </span>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {user ? (
            isEmployer ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Admin 🛠️
                  </Link>
                )}
                <Link
                  href="/employer/dashboard"
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/employer/post"
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Post a Job ✨
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Admin 🛠️
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-daily-10"
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  My Daily 10
                </Link>
                <Link
                  href="/resume-tools"
                  className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  Resume AI
                </Link>
                <Link
                  href="/career-coach"
                  className="hidden xl:inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  Coach
                </Link>
                <Link
                  href="/applications"
                  className="hidden xl:inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  Tracker
                </Link>
                <Link
                  href="/ai-tools"
                  className="hidden 2xl:inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  AI Tools
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                href="/jobs"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Jobs
              </Link>
              <Link
                href="/tools"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Free Tools
              </Link>
              <Link
                href="/resume-templates"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/news"
                className="hidden xl:inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                News
              </Link>
              <Link
                href="/how-it-works"
                className="hidden 2xl:inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                How It Works
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Market & Language Dropdowns */}
          <div className="hidden md:flex items-center gap-1.5">
            <CountrySelector variant="header" />
            <LanguageSwitcher variant="header" />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-4 w-px bg-neutral-200" aria-hidden="true" />

          {/* User state / Auth Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              {isPro ? (
                <span className="hidden sm:inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                  PRO
                </span>
              ) : !isEmployer ? (
                <Link
                  href="/subscribe"
                  className="hidden sm:inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:from-amber-600 hover:to-amber-700 transition-all whitespace-nowrap"
                >
                  Upgrade ⚡
                </Link>
              ) : null}
              <form action="/api/auth/signout" method="POST" className="hidden sm:block">
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/employer/register"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-700 active:scale-98 transition-all"
              >
                Post Jobs
              </Link>
            </div>
          )}

          {/* Mobile / Tablet Drawer toggle */}
          <MobileNav
            user={user}
            isEmployer={isEmployer}
            isPro={isPro}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </header>
  );
}
