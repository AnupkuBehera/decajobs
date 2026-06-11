"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center font-sans antialiased">
        <div className="mx-auto max-w-md">
          <p className="text-6xl font-bold text-red-600">500</p>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-3 text-neutral-600">
            An unexpected error occurred. Our team has been notified. Please try again.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-neutral-400">
              Error ID: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px]"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[44px]"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
