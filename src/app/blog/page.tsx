import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Career Blog - Job Search Tips, Interview Guides & Resume Advice | DecaJobs",
  description: "Expert career advice, job search tips, interview preparation guides, resume writing tips, and salary negotiation strategies. Updated for 2026.",
  alternates: {
    canonical: "/blog",
  },
};

const articles = [
  {
    slug: "top-10-resume-mistakes",
    title: "Top 10 Resume Mistakes That Get You Rejected (And How to Fix Them)",
    excerpt: "Recruiters spend just 7 seconds on your resume. Here are the 10 most common mistakes that get resumes instantly rejected, and exactly how to fix each one.",
    category: "Resume Tips",
    date: "June 2026",
  },
  {
    slug: "how-to-crack-any-interview",
    title: "How to Crack Any Job Interview: The STAR Method + 50 Questions",
    excerpt: "Master the STAR method and practice with the 50 most-asked interview questions across tech, finance, and management roles.",
    category: "Interview Prep",
    date: "June 2026",
  },
  {
    slug: "remote-jobs-guide-india",
    title: "Complete Guide to Finding Remote Jobs in India (2026)",
    excerpt: "Where to find remote jobs, how to stand out, salary expectations, and the best companies hiring remote workers in India right now.",
    category: "Remote Work",
    date: "June 2026",
  },
  {
    slug: "salary-negotiation-tips",
    title: "Salary Negotiation: How to Get 20-40% More Than the Initial Offer",
    excerpt: "Proven scripts and strategies to negotiate a higher salary, backed by data from 10,000+ job offers. Works for freshers and experienced professionals.",
    category: "Salary",
    date: "June 2026",
  },
  {
    slug: "freshers-job-search-guide",
    title: "Job Search Guide for Freshers: Land Your First Job in 30 Days",
    excerpt: "Step-by-step action plan for fresh graduates. Where to apply, how to build a resume with no experience, and the secret to getting callbacks.",
    category: "Freshers",
    date: "June 2026",
  },
  {
    slug: "linkedin-profile-optimization",
    title: "LinkedIn Profile Optimization: Get 10x More Recruiter Views",
    excerpt: "The exact formula used by top candidates to optimize their LinkedIn profile. Includes headline templates, summary examples, and keyword strategies.",
    category: "LinkedIn",
    date: "June 2026",
  },
  {
    slug: "ats-resume-secrets",
    title: "How to Beat the ATS (Applicant Tracking System): Secrets from Recruiters",
    excerpt: "More than 95% of major employers use Applicant Tracking Systems (ATS) to filter resumes. Learn the formatting and keyword secrets to beat the scanners.",
    category: "Resume Tips",
    date: "June 2026",
  },
  {
    slug: "artificial-intelligence-careers",
    title: "How AI is Changing the Job Market: Top Skills to Learn in 2026",
    excerpt: "Artificial Intelligence is reshaping careers. Learn the top AI literacy, prompt engineering, and soft skills needed to remain competitive in 2026.",
    category: "Remote Work",
    date: "June 2026",
  },
  {
    slug: "remote-job-interview-prep",
    title: "Remote Job Interviews: 10 Tips to Ace Your Video and Tech Rounds",
    excerpt: "Remote interviews require different skills. Learn how to optimize your setup, background, lighting, and communication style to stand out.",
    category: "Interview Prep",
    date: "June 2026",
  },
  {
    slug: "career-gaps-explanation",
    title: "How to Explain Career Gaps in a Job Interview (With Examples)",
    excerpt: "Career gaps are common. Learn how to explain career gaps for upskilling, family care, or health reasons with confidence and clear scripts.",
    category: "Interview Prep",
    date: "June 2026",
  },
  {
    slug: "linkedin-networking-guide",
    title: "The Art of LinkedIn Cold Messaging: How to Get Referrals Without Being Annoying",
    excerpt: "Cold outreach on LinkedIn has high leverage. Learn the exact template, strategies, and etiquette to connect with peers and request referrals.",
    category: "LinkedIn",
    date: "June 2026",
  },
  {
    slug: "negotiating-first-salary",
    title: "Fresher Salary Negotiation: Yes, You Can (And Should) Ask For More",
    excerpt: "Many freshers accept their first offer without negotiating. Learn the data, tactics, and scripts to politely ask for a 10-15% increase as a graduate.",
    category: "Salary",
    date: "June 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">Career Blog</h1>
          <p className="mt-3 text-neutral-600">Expert tips to accelerate your job search and career growth.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
              <article className="h-full rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-lg hover:border-primary-200">
                <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 mb-3">
                  {article.category}
                </span>
                <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{article.excerpt}</p>
                <p className="mt-3 text-xs text-neutral-400">{article.date}</p>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-600">Stop searching. Let AI match you with perfect jobs daily.</p>
          <Link href="/login" className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
            Get 10 Matched Jobs Daily — Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
