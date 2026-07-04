import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed - DecaJobs",
  robots: {
    index: false,
    follow: false,
  },
};

interface UnsubscribedPageProps {
  searchParams: Promise<{ error?: string }>;
}

/**
 * Unsubscribe confirmation page.
 *
 * Shown after a candidate clicks the unsubscribe link in their daily digest email.
 * Confirms the unsubscribe was successful and provides a link to re-subscribe
 * via the dashboard.
 */
export default async function UnsubscribedPage({
  searchParams,
}: UnsubscribedPageProps) {
  const { error } = await searchParams;

  if (error === "invalid_token") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invalid Unsubscribe Link
            </h1>
            <p className="text-gray-600 mt-2">
              This unsubscribe link is invalid or has expired. If you&apos;d like
              to manage your email preferences, please log in to your dashboard.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error === "server_error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mt-2">
              We couldn&apos;t process your unsubscribe request right now. Please
              try again later or manage your preferences from the dashboard.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Success state
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            You&apos;ve Been Unsubscribed
          </h1>
          <p className="text-gray-600 mt-2">
            You will no longer receive daily job digest emails. You can
            re-subscribe at any time from your dashboard settings.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Re-subscribe on Dashboard
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Changed your mind?{" "}
            <Link href="/settings" className="text-blue-600 hover:underline">
              Manage email preferences
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
