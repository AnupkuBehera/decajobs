import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { JobToggleButton } from "./job-toggle-button";

export const metadata = {
  title: "Employer Dashboard - DecaJobs",
  description: "Manage your job listings, view status, and post new positions.",
};

interface JobListing {
  id: string;
  title: string;
  location: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

function getJobStatus(job: JobListing): "active" | "inactive" | "expired" {
  if (new Date(job.expires_at) < new Date()) {
    return "expired";
  }
  return job.is_active ? "active" : "inactive";
}

function getStatusBadgeVariant(status: "active" | "inactive" | "expired") {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "default";
    case "expired":
      return "warning";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EmployerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch all job listings for this employer
  const { data: jobs, error: jobsError } = await supabase
    .from("job_listings")
    .select("id, title, location, is_active, created_at, expires_at")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  if (jobsError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          Failed to load your job listings. Please try again later.
        </div>
      </div>
    );
  }

  const jobListings: JobListing[] = jobs ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Your Job Listings
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage your posted positions
          </p>
        </div>
        <Link
          href="/employer/post"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-base font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px]"
        >
          Post New Job
        </Link>
      </div>

      {/* Empty state */}
      {jobListings.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            <svg
              className="h-6 w-6 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            No jobs posted yet
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Post your first job listing to start matching with candidates.
          </p>
          <Link
            href="/employer/post"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px]"
          >
            Post Your First Job
          </Link>
        </Card>
      ) : (
        /* Job listings */
        <div className="space-y-4">
          {jobListings.map((job) => {
            const status = getJobStatus(job);
            return (
              <Card key={job.id} padding="md" hoverable>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left section: Title, location, dates */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-neutral-900 truncate">
                        {job.title}
                      </h2>
                      <Badge variant={getStatusBadgeVariant(status)}>
                        {status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">
                      {job.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                      <span>Posted: {formatDate(job.created_at)}</span>
                      <span>Expires: {formatDate(job.expires_at)}</span>
                    </div>
                  </div>

                  {/* Right section: Actions */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {status !== "expired" && (
                      <JobToggleButton
                        jobId={job.id}
                        isActive={job.is_active}
                      />
                    )}
                    <Link
                      href={`/employer/jobs/${job.id}/edit`}
                      className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
