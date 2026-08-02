import Link from "next/link";
import {
    jobSlug,
    formatPostedDate,
    daysSincePosted,
    truncate,
    type ExternalJob,
} from "@/lib/public-jobs";

interface JobCardProps {
    job: ExternalJob;
}

/** Compact job card used across the public job board. */
export function JobCard({ job }: JobCardProps) {
    const days = daysSincePosted(job.postedAt);
    const isRemote = job.location.toLowerCase().includes("remote");

    return (
        <Link
            href={`/jobs/${jobSlug(job)}`}
            className="group block h-full rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md hover:border-primary-200"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">{job.company}</p>
                </div>
                {isRemote && (
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        Remote
                    </span>
                )}
            </div>

            <p className="mt-3 text-sm text-neutral-600 line-clamp-3">
                {truncate(job.description, 160)}
            </p>

            <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 pt-3">
                <span className="inline-flex items-center gap-1">
                    <span aria-hidden="true">📍</span>
                    {job.location}
                </span>
                <span className="flex items-center gap-2">
                    {days !== null && days <= 7 && (
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                            New
                        </span>
                    )}
                    <time>{formatPostedDate(job.postedAt)}</time>
                </span>
            </div>
        </Link>
    );
}

/** Grid wrapper for job cards. */
export function JobCardGrid({ jobs }: { jobs: ExternalJob[] }) {
    if (jobs.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
                <p className="text-neutral-500">
                    No jobs match this filter right now. Check back soon — new listings are added daily.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}

