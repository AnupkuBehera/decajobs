import type { Metadata } from "next";
import { LinkedInHeadlineClient } from "./linkedin-headline-client";

export const metadata: Metadata = {
  title: "Free AI LinkedIn Headline Generator & Profile Optimizer | DecaJobs",
  description:
    "Generate high-converting LinkedIn headlines designed for LinkedIn SEO. Increase recruiter views and profile clicks with role-tailored headline formulas.",
  alternates: {
    canonical: "https://decajob.com/tools/linkedin-headline",
  },
  openGraph: {
    title: "Free AI LinkedIn Headline Generator & Profile Optimizer | DecaJobs",
    description:
      "Get 5 AI-generated LinkedIn headlines tailored for your target role and tech stack.",
    url: "https://decajob.com/tools/linkedin-headline",
    type: "website",
  },
};

export default function LinkedInHeadlinePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Free AI LinkedIn Headline Generator",
        "url": "https://decajob.com/tools/linkedin-headline",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "AI tool that crafts search-optimized LinkedIn headlines to boost profile views by recruiters.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why is your LinkedIn headline important for recruiters?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "LinkedIn's search algorithm heavily weights keywords in your headline. A clear, keyword-optimized headline ensures your profile appears at the top of recruiter search results.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">LinkedIn Headline Generator</h1>
          <p className="mt-3 text-neutral-600">Get 5 optimized headlines that make recruiters click. Free, instant.</p>
        </div>

        <LinkedInHeadlineClient />

        <div className="mt-16 border-t border-neutral-200 pt-12 prose prose-neutral max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">LinkedIn Profile Optimization &amp; Headline Guide</h2>
          <p className="text-neutral-600 leading-relaxed">
            Your LinkedIn headline is one of the most critical sections of your profile. It is the first thing recruiters see next to your name and profile picture, and it is heavily weighted by the LinkedIn search algorithm (LinkedIn SEO). A generic headline means missing out on organic recruiter visits.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">Why LinkedIn SEO and Keywords Matter</h3>
          <p className="text-neutral-600 leading-relaxed">
            Recruiters search LinkedIn using Boolean strings and specific keywords (e.g., &quot;React Developer Bangalore&quot;). If your headline, summary, and experience sections do not contain these target keywords, your profile will not show up in their search results.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">3 Proven LinkedIn Headline Formulas</h3>
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Formula 1: The Keyword-Centric Split (Best for Technical Roles)</h4>
              <p className="text-sm text-neutral-600 mt-1">Format: <strong>Job Title | Core Skills &amp; Tech Stack | Value Statement</strong></p>
              <p className="text-xs text-neutral-500 mt-1">Example: <em>Data Analyst | SQL • Python • Tableau | Helping SaaS businesses turn customer data into revenue growth</em></p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Formula 2: The Value-Driven Statement (Best for Sales/Growth Roles)</h4>
              <p className="text-sm text-neutral-600 mt-1">Format: <strong>Job Title | Helping [Target Audience] achieve [Desired Outcome]</strong></p>
              <p className="text-xs text-neutral-500 mt-1">Example: <em>Frontend Developer | Crafting beautiful, responsive user interfaces that double website conversion rates</em></p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <h4 className="font-semibold text-neutral-900">Formula 3: The Fresher / Career Starter Split (Best for Grads)</h4>
              <p className="text-sm text-neutral-600 mt-1">Format: <strong>Aspiring [Target Role] | Top Skills | Project Highlight</strong></p>
              <p className="text-xs text-neutral-500 mt-1">Example: <em>Computer Science Graduate &amp; Aspiring DevOps Engineer | AWS, Docker, Kubernetes | Built automated CI/CD pipeline for 5+ projects</em></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
