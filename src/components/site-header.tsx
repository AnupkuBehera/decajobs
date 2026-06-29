import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function SiteHeader() {
  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // If auth check fails, treat as unauthenticated
    user = null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-primary-600 sm:text-xl shrink-0">
          DecaJobs
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
              >
                Dashboard
              </Link>
              <Link
                href="/resume-tools"
                className="rounded-md px-2.5 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors min-h-[44px] flex items-center"
              >
                Resume AI
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
              <Link
                href="/subscribe"
                className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px] flex items-center"
              >
                Upgrade ⚡
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
