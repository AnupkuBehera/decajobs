"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CountrySelector } from "@/components/country-selector";
import { LanguageSwitcher } from "@/components/language-switcher";

interface MobileNavProps {
  user: any;
  isEmployer: boolean;
  isPro: boolean;
  isAdmin: boolean;
}

export function MobileNav({
  user,
  isEmployer,
  isPro,
  isAdmin,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-neutral-950/40 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="flex flex-col h-full max-w-sm ml-auto bg-white border-l border-neutral-200 shadow-2xl p-6 overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <span className="text-sm font-bold text-neutral-900">Navigation</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
              >
                Close ✕
              </button>
            </div>

            {/* Links section */}
            <div className="flex-1 py-4 space-y-1">
              {user ? (
                isEmployer ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Admin 🛠️
                      </Link>
                    )}
                    <Link
                      href="/employer/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/employer/post"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                    >
                      Post a Job ✨
                    </Link>
                  </>
                ) : (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Admin 🛠️
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/my-daily-10"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      My Daily 10
                    </Link>
                    <Link
                      href="/resume-tools"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Resume AI
                    </Link>
                    <Link
                      href="/mock-interview"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100"
                    >
                      Mock Interview 🎙️
                    </Link>
                    <Link
                      href="/career-coach"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Career Coach
                    </Link>
                    <Link
                      href="/applications"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Job Tracker
                    </Link>
                    <Link
                      href="/ai-tools"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      AI Tools Suite
                    </Link>
                    {isPro ? (
                      <div className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg">
                        Pro Member
                      </div>
                    ) : (
                      <Link
                        href="/subscribe"
                        className="flex items-center justify-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                      >
                        Upgrade to Pro ⚡
                      </Link>
                    )}
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/jobs"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>Browse All Jobs</span>
                    <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
                  </Link>
                  <Link
                    href="/mock-interview"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100"
                  >
                    <span>AI Mock Interview</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">🎙️ Free Demo</span>
                  </Link>
                  <Link
                    href="/tools"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>Free AI Tools</span>
                    <span className="text-xs text-neutral-400">ATS, Matcher</span>
                  </Link>
                  <Link
                    href="/resume-templates"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>Resume Templates</span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>Pricing</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>Career Blog</span>
                  </Link>
                  <Link
                    href="/news"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>Daily Hiring News</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                  >
                    <span>How It Works</span>
                  </Link>
                </>
              )}
            </div>

            {/* Utility selectors */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-neutral-500">Market / Currency:</span>
                <CountrySelector variant="compact" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-neutral-500">Language:</span>
                <LanguageSwitcher variant="compact" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-neutral-100 space-y-2.5 mt-auto">
              {user ? (
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-neutral-200 py-2.5 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Sign Out
                  </button>
                </form>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full rounded-lg border border-neutral-300 bg-white py-2.5 text-center text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/employer/register"
                    className="block w-full rounded-lg bg-primary-600 py-2.5 text-center text-xs font-semibold text-white shadow-xs hover:bg-primary-700"
                  >
                    Post a Job Free →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
