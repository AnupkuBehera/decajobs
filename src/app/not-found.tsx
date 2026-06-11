import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | DecaJobs",
  description: "The page you're looking for doesn't exist. Return to DecaJobs home page.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-neutral-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px]"
          >
            Go to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[44px]"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
