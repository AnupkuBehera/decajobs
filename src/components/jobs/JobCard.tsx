import Link from "next/link";
import {
    jobSlug,
    formatPostedDate,
    daysSincePosted,
    truncate,
    extractSkillsFromJob,
    type ExternalJob,
} from "@/lib/public-jobs";

interface JobCardProps {
    job: ExternalJob;
}

/** Compact job card used across the public job board. */
export function JobCard({ job }: JobCardProps) {
    const days = daysSincePosted(job.postedAt);
    const isRemote = job.location.toLowerCase().includes("remote");
    const skills = extractSkillsFromJob(`${job.title} ${job.description}`, 3);

    return (
        <div className="group flex flex-col justify-between h-full rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md hover:border-primary-300">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link href={`/jobs/${jobSlug(job)}`}>
                            <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                {job.title}
                            </h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                            <span className="font-medium text-neutral-700">{job.company}</span>
                            <span className="inline-flex items-center text-[11px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded font-medium" title="Verified Non-Scam Posting">
                                ✓ Verified
                            </span>
                        </div>
                    </div>
                    {isRemote && (
                        <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                            Remote
                        </span>
                    )}
                </div>

                <p className="mt-3 text-sm text-neutral-600 line-clamp-3">
                    {truncate(job.description, 150)}
                </p>

                {skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span className="inline-flex items-center gap-1 truncate max-w-[130px]">
                    <span aria-hidden="true">📍</span>
                    {job.location}
                </span>
                <div className="flex items-center gap-2">
                    {days !== null && days <= 7 && (
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                            New
                        </span>
                    )}
                    <time>{formatPostedDate(job.postedAt)}</time>
                    <Link
                        href={`/resume-tools?tab=builder&role=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                        className="rounded border border-primary-200 bg-primary-50/70 px-2 py-0.5 text-[11px] font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                        title="Generate ATS resume tailored to this role"
                    >
                        Tailor Resume ✨
                    </Link>
                </div>
            </div>
        </div>
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


