import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JobCardGrid } from "@/components/jobs/JobCard";
import { getPublicJobsFiltered } from "@/lib/public-jobs";

export const metadata: Metadata = {
    title: "Remote Jobs 2026 - Work From Anywhere | DecaJobs",
    description:
        "Browse the latest remote jobs in software engineering, design, marketing, data, and more. Curated work-from-anywhere opportunities with salary insights and tips to land remote roles.",
    alternates: {
        canonical: "/jobs/remote",
    },
    openGraph: {
        title: "Remote Jobs 2026 | DecaJobs",
        description:
            "Curated remote job openings across tech, design, marketing, and more. Work from anywhere in the world.",
        url: "https://decajob.com/jobs/remote",
        type: "website",
    },
};

export const revalidate = 3600;

export default async function RemoteJobsPage() {
    const jobs = await getPublicJobsFiltered({ remoteOnly: true });
    const displayJobs = jobs.slice(0, 24);

    return (
        <div className="py-10 sm:py-16">
            <div className="mx-auto max-w-6xl">
                <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: "Remote Jobs" }]} />

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                        Remote Jobs 🌍
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
                        Work from anywhere. These are live remote-friendly openings from our
                        partner job sources — new ones added every day.
                    </p>
                </div>

                {/* Live remote jobs */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">
                        Latest Remote Openings
                    </h2>
                    <JobCardGrid jobs={displayJobs} />
                </section>

                {/* Long-form editorial */}
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        The Complete Guide to Finding Remote Jobs in 2026
                    </h2>
                    <div className="mt-5 space-y-5 text-neutral-600 leading-relaxed prose prose-neutral max-w-none">
                        <p>
                            Remote work has moved from a pandemic-era experiment to a permanent
                            fixture of the global economy. In 2026, more than 40% of tech
                            professionals work remotely at least part of the time, and companies
                            across every industry now hire across cities, states, and even
                            countries. If you&apos;re looking for a remote job, the opportunity
                            has never been better — but the competition has also never been
                            tougher.
                        </p>

                        <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-3">
                            Where to Find Genuine Remote Jobs
                        </h3>
                        <p>
                            Not all job boards are created equal. The best places to find real,
                            high-quality remote roles include dedicated remote job platforms like
                            Remotive and RemoteOK, which only list remote-friendly positions, and
                            larger aggregators where you can filter by location. DecaJobs combines
                            these sources into one constantly updated feed — exactly what you&apos;re
                            browsing on this page.
                        </p>

                        <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-3">
                            How to Stand Out as a Remote Candidate
                        </h3>
                        <div className="space-y-4 my-4">
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">1. Highlight async communication skills</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    Remote teams live and die by written communication. Show that you
                                    can write clear updates, document decisions, and collaborate
                                    across time zones using tools like Slack, Notion, and Jira.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">2. Prove self-management</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    Employers want people who can deliver without constant supervision.
                                    Mention projects you owned end-to-end, deadlines you met
                                    independently, and outcomes you drove.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">3. Optimize your profile for remote keywords</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    Recruiters search for "remote", "distributed", and
                                    "work from home" plus your core skills. Make sure your LinkedIn
                                    headline and resume summary include these terms naturally.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-white border border-neutral-200">
                                <h4 className="font-semibold text-neutral-900">4. Mention timezone flexibility</h4>
                                <p className="text-sm text-neutral-600 mt-1">
                                    If you&apos;re open to overlapping with a team in another timezone,
                                    say so. Flexibility is a major advantage for distributed companies.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-3">
                            Remote Job Red Flags to Avoid
                        </h3>
                        <p>
                            Remote job scams are common. Be suspicious of listings that require
                            upfront fees, communicate only over WhatsApp or Telegram, use personal
                            email domains, or promise unrealistically high pay for simple tasks.
                            Always verify a company on its official website before sharing your
                            Aadhaar, PAN, or bank details. You can paste any listing into our free{" "}
                            <Link href="/tools/job-scam-detector" className="text-primary-600 hover:underline">
                                Job Scam Detector
                            </Link>{" "}
                            to get an instant AI safety score.
                        </p>

                        <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-3">
                            Remote Salary Expectations
                        </h3>
                        <p>
                            Remote salaries vary widely by role, seniority, and whether the company
                            pays local or global rates. International companies often pay
                            location-adjusted salaries — a "geo-band" — which can be
                            significantly higher than local market rates for the same work. Use our{" "}
                            <Link href="/tools/salary-calculator" className="text-primary-600 hover:underline">
                                Salary Calculator
                            </Link>{" "}
                            to benchmark remote pay for your role and location before negotiating.
                        </p>
                    </div>
                </article>

                {/* FAQ */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
                        Remote Work FAQ
                    </h2>
                    <div className="mx-auto max-w-3xl space-y-4">
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                Are remote jobs really full-time?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                Yes. Many of the remote roles on this page are full-time positions
                                from real companies. Some are contract or freelance opportunities.
                                Always review the listing details and the company&apos;s careers page
                                to confirm employment type and location requirements.
                            </p>
                        </details>
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                Can freshers get remote jobs?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                Absolutely. Many companies hire remote interns and junior roles.
                                Highlight transferable skills, projects, and your ability to work
                                independently. Follow our{" "}
                                <Link href="/blog/freshers-job-search-guide" className="text-primary-600 hover:underline">
                                    30-day fresher job search guide
                                </Link>{" "}
                                for a step-by-step plan.
                            </p>
                        </details>
                        <details className="group rounded-xl border border-neutral-200 bg-white p-5 open:shadow-sm">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-neutral-900 min-h-[44px]">
                                How do I get remote jobs delivered to my inbox?
                                <span className="ml-4 shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                                Create a free DecaJobs profile, set your location to "Remote",
                                and our AI will send you 10 matched remote jobs every morning at 7 AM.
                                No scrolling required.
                            </p>
                        </details>
                    </div>
                </section>

                {/* CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-primary-900 to-primary-950 p-8 sm:p-10 text-center">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Get Remote Jobs Delivered Every Morning
                    </h2>
                    <p className="mt-3 text-primary-200 max-w-xl mx-auto">
                        Join thousands of professionals who wake up to 10 perfectly matched
                        remote opportunities — no endless scrolling.
                    </p>
                    <Link
                        href="/login"
                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary-700 hover:bg-neutral-100 transition-colors min-h-[52px]"
                    >
                        Start Free →
                    </Link>
                    <p className="mt-3 text-xs text-primary-300">
                        Free 7-day trial · No credit card required
                    </p>
                </div>
            </div>
        </div>
    );
}

