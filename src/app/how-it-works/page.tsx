import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How DecaJobs Works - AI Job Matching Explained | DecaJobs",
  description: "Learn exactly how DecaJobs finds and delivers 10 perfect job matches to your inbox every morning. Step-by-step guide to our AI matching technology.",
};

export default function HowItWorksPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            How DecaJobs Works
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            A detailed look at how we find and deliver your perfect job matches every morning.
          </p>
        </div>

        <div className="prose prose-neutral prose-sm sm:prose-base mx-auto">
          <h2>Step 1: Create Your Profile (2 minutes)</h2>
          <p>
            When you sign up, we ask you four simple things that help our AI understand what you&apos;re looking for:
          </p>
          <ul>
            <li><strong>Target Job Titles</strong> — What roles are you interested in? (e.g., &quot;Data Analyst&quot;, &quot;Frontend Developer&quot;, &quot;Product Manager&quot;)</li>
            <li><strong>Key Skills</strong> — What are your strongest skills? (e.g., Python, SQL, React, Project Management)</li>
            <li><strong>Location Preference</strong> — Where do you want to work? A specific city, or &quot;Remote&quot;</li>
            <li><strong>Expected Salary</strong> — What salary range are you targeting? (optional but helps with matching)</li>
          </ul>
          <p>
            You can also upload your resume for additional context, and update your profile anytime as your goals change.
          </p>

          <h2>Step 2: AI Scans 20+ Job Sources (Automated, Every Day)</h2>
          <p>
            Every morning at 7 AM, our system springs into action. Here&apos;s what happens behind the scenes:
          </p>
          <ol>
            <li>Our engine connects to LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings on our platform</li>
            <li>It pulls all active job listings posted in the last 30 days that could potentially match your profile</li>
            <li>Duplicate listings (same job posted on multiple sites) are automatically removed</li>
            <li>Jobs you&apos;ve already been sent in the last 3 days are filtered out — no repeats</li>
          </ol>

          <h2>Step 3: AI Scoring — Finding Your Top 10</h2>
          <p>
            This is where the magic happens. Each remaining job is scored against your profile using four weighted factors:
          </p>
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>Weight</th>
                <th>How It Works</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Title Match</td>
                <td>40%</td>
                <td>How closely does the job title match your target titles?</td>
              </tr>
              <tr>
                <td>Skill Match</td>
                <td>35%</td>
                <td>How many of your skills appear in the job requirements?</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>15%</td>
                <td>Does the job location match yours? Remote jobs get full marks for everyone.</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>10%</td>
                <td>Do your keywords appear in the full job description?</td>
              </tr>
            </tbody>
          </table>
          <p>
            Each job gets a score from 0-100. Only the top 10 highest-scoring jobs make it into your daily email. If fewer than 10 strong matches exist, we fill remaining slots with the newest relevant jobs in your location.
          </p>

          <h2>Step 4: Beautiful Daily Email (7 AM)</h2>
          <p>
            You receive a clean, mobile-friendly email every morning containing:
          </p>
          <ul>
            <li>10 job cards, each with the job title, company name, location, and a brief description</li>
            <li>One-click &quot;Apply Now&quot; buttons that take you directly to the application page</li>
            <li>Match scores so you can prioritize the best fits</li>
            <li>An unsubscribe link if you ever want to pause</li>
          </ul>

          <h2>Bonus: 12+ AI Career Tools</h2>
          <p>
            Beyond daily job matching, DecaJobs Pro subscribers get access to a full suite of AI-powered career tools:
          </p>
          <ul>
            <li><strong>AI Resume Scorer</strong> — Get your resume rated out of 100 with improvement suggestions</li>
            <li><strong>Resume Optimizer</strong> — Paste a job description and AI tailors your resume to match</li>
            <li><strong>Cover Letter Generator</strong> — Professional cover letters in seconds</li>
            <li><strong>ATS Scanner</strong> — Check if your resume passes Applicant Tracking Systems</li>
            <li><strong>Skill Gap Analyzer</strong> — Find what skills you&apos;re missing for a specific role</li>
            <li><strong>AI Career Coach</strong> — Ask any career question and get expert advice</li>
            <li><strong>Interview Prep</strong> — Role-specific questions with answer tips</li>
            <li><strong>Career Path Visualizer</strong> — See where your career can go in 2-5 years</li>
            <li><strong>Cold Email Generator</strong> — Personalized outreach messages to recruiters</li>
            <li><strong>Job Scam Detector</strong> — Verify if a listing is legitimate</li>
          </ul>

          <h2>Pricing</h2>
          <p>
            DecaJobs offers a generous free trial so you can experience the full platform before committing:
          </p>
          <ul>
            <li><strong>Free Trial:</strong> 7 days of full access to all features</li>
            <li><strong>Pro Plan:</strong> ₹299/month after trial — cancel anytime</li>
            <li><strong>Free Public Tools:</strong> Resume Checker, Salary Calculator, Interview Prep, and more are always free with no login</li>
            <li><strong>Employers:</strong> Post jobs for free, no charges ever</li>
          </ul>

          <h2>Get Started in 30 Seconds</h2>
          <p>
            Ready to stop scrolling and start getting matched? Sign up takes less than a minute — just your email and a few preferences. Your first daily digest arrives tomorrow morning.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700 min-h-[44px]">
            Start Your Free Trial →
          </Link>
        </div>
      </div>
    </div>
  );
}
