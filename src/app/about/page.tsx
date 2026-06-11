import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - DecaJobs | AI-Powered Online Job Portal",
  description:
    "Learn about DecaJobs, the AI-powered job portal that delivers 10 perfectly matched jobs to your inbox every morning. Our mission, team, and technology.",
};

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            About DecaJobs
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            The smarter way to find your next role.
          </p>
        </div>

        <div className="prose prose-neutral prose-sm sm:prose-base mx-auto">
          <h2>Our Mission</h2>
          <p>
            Job searching is broken. Traditional job portals overwhelm you with thousands of irrelevant listings, forcing you to spend hours scrolling and filtering. We built DecaJobs to fix that.
          </p>
          <p>
            Our mission is simple: <strong>deliver exactly 10 perfectly matched jobs to your inbox every morning</strong> — so you spend less than 5 minutes a day on your job search instead of hours.
          </p>

          <h2>How We&apos;re Different</h2>
          <ul>
            <li><strong>AI-Powered Matching:</strong> Our weighted scoring algorithm analyzes your skills, target titles, location, and experience level to find the most relevant opportunities.</li>
            <li><strong>Multi-Source Aggregation:</strong> We pull jobs from LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings — all in one curated digest.</li>
            <li><strong>Quality Over Quantity:</strong> Instead of 10,000 results, you get exactly 10. Each one hand-picked by AI to match your career profile.</li>
            <li><strong>Zero Effort:</strong> Set up your profile once. We do the searching for you, every single day.</li>
          </ul>

          <h2>Our Technology</h2>
          <p>
            DecaJobs is built with modern, scalable technology:
          </p>
          <ul>
            <li>Next.js for fast, SEO-friendly server-rendered pages</li>
            <li>Supabase for secure database and authentication</li>
            <li>Custom AI matching engine with weighted scoring (title, skills, location, description)</li>
            <li>Automated daily cron jobs that fetch, score, and deliver jobs at 7 AM</li>
            <li>React Email for beautifully formatted daily digests</li>
          </ul>

          <h2>For Candidates</h2>
          <p>
            Whether you&apos;re a fresher looking for your first role, a mid-career professional exploring new opportunities, or a senior leader seeking remote positions — DecaJobs adapts to your unique profile and delivers relevant matches every morning.
          </p>

          <h2>For Employers</h2>
          <p>
            Post your job listings for free and reach highly targeted candidates. Our AI ensures your listings are shown to the most relevant professionals based on skill match, not just keywords.
          </p>

          <h2>Get Started</h2>
          <p>
            Ready to transform your job search?{" "}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Sign up for free
            </Link>{" "}
            and receive your first daily digest tomorrow morning.
          </p>
        </div>
      </div>
    </div>
  );
}
