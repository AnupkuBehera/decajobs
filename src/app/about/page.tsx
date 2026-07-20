import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "About Us - DecaJobs | AI-Powered Online Job Portal",
  description:
    "Learn about DecaJobs, the AI-powered job portal that delivers 10 perfectly matched jobs to your inbox every morning. Our mission, team, technology, and values.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "About Us" }]} />

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
            Job searching is broken. Traditional job portals overwhelm you with thousands of
            irrelevant listings, forcing you to spend hours scrolling and filtering. The average job
            seeker spends 11 hours per week just searching — and most of that time is wasted on
            roles that don&apos;t match their skills or aspirations.
          </p>
          <p>
            We built DecaJobs to fix that. Our mission is simple:{" "}
            <strong>
              deliver exactly 10 perfectly matched jobs to your inbox every morning
            </strong>{" "}
            — so you spend less than 5 minutes a day on your job search instead of hours.
          </p>

          <h2>Who We Are</h2>
          <p>
            DecaJobs was founded by <strong>Anup Behera</strong>, a technology professional based in
            India who experienced firsthand the frustration of traditional job portals. After spending
            hours every day sifting through irrelevant job listings and receiving no meaningful
            matches, Anup decided to build a better solution — one that uses artificial intelligence
            to do the searching for you.
          </p>
          <p>
            What started as a personal project in 2025 has grown into a platform trusted by
            thousands of job seekers across India. DecaJobs is built on the belief that technology
            should simplify your life, not complicate it. Every feature we build is designed to
            save you time and reduce the stress of finding your next role.
          </p>

          <h2>Our Values</h2>
          <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
              <p className="text-base font-semibold text-neutral-900">🎯 Quality Over Quantity</p>
              <p className="mt-1 text-sm text-neutral-600">
                10 perfectly matched jobs are worth more than 10,000 irrelevant listings. We
                prioritize precision in every match we deliver.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
              <p className="text-base font-semibold text-neutral-900">⏱️ Respect Your Time</p>
              <p className="mt-1 text-sm text-neutral-600">
                Five minutes a day instead of two hours. Every feature is designed to reduce time
                spent searching and increase time spent applying.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
              <p className="text-base font-semibold text-neutral-900">🔒 Privacy First</p>
              <p className="mt-1 text-sm text-neutral-600">
                We never sell your data. Your resume, preferences, and profile are encrypted and
                secured with enterprise-grade Row Level Security.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5">
              <p className="text-base font-semibold text-neutral-900">🌐 Accessible to All</p>
              <p className="mt-1 text-sm text-neutral-600">
                Whether you&apos;re a fresher or a senior professional, in a metro city or a small
                town — DecaJobs is built to serve every job seeker equally.
              </p>
            </div>
          </div>

          <h2>How We&apos;re Different</h2>
          <ul>
            <li>
              <strong>AI-Powered Matching:</strong> Our weighted scoring algorithm analyzes your
              skills, target titles, location, and experience level to find the most relevant
              opportunities from over 20 sources.
            </li>
            <li>
              <strong>Multi-Source Aggregation:</strong> We pull jobs from LinkedIn, Indeed,
              Glassdoor, Remotive, RemoteOK, Arbeitnow, and employer-posted listings — all in one
              curated daily digest.
            </li>
            <li>
              <strong>Quality Over Quantity:</strong> Instead of 10,000 results, you get exactly 10.
              Each one hand-picked by AI to match your career profile and scored on a 0-100 scale.
            </li>
            <li>
              <strong>Zero Effort:</strong> Set up your profile once. We do the searching for you,
              every single day, automatically at 7 AM.
            </li>
            <li>
              <strong>12+ AI Career Tools:</strong> Beyond job matching, access a full suite of tools
              — resume optimizer, interview prep, salary calculator, career coach, cover letter
              generator, and more.
            </li>
          </ul>

          <h2>Our Technology</h2>
          <p>
            DecaJobs is built with modern, scalable technology designed for reliability and speed:
          </p>
          <ul>
            <li>
              <strong>Next.js</strong> for fast, SEO-friendly server-rendered pages with excellent
              Core Web Vitals performance
            </li>
            <li>
              <strong>Supabase</strong> for secure PostgreSQL database, authentication, and
              encrypted file storage with Row Level Security (RLS)
            </li>
            <li>
              <strong>Custom AI Matching Engine</strong> with weighted scoring across four dimensions:
              title relevance (40%), skill match (35%), location compatibility (15%), and description
              keywords (10%)
            </li>
            <li>
              <strong>Automated Daily Cron Jobs</strong> that fetch, deduplicate, score, and deliver
              personalized job digests at 7 AM IST every day
            </li>
            <li>
              <strong>React Email</strong> for beautifully formatted, mobile-responsive daily digest
              emails
            </li>
          </ul>

          <h2>For Candidates</h2>
          <p>
            Whether you&apos;re a fresher looking for your first role, a mid-career professional
            exploring new opportunities, or a senior leader seeking remote positions — DecaJobs
            adapts to your unique profile and delivers relevant matches every morning. We support
            job seekers across all major Indian cities (Bangalore, Mumbai, Delhi, Hyderabad, Chennai,
            Pune) as well as international remote positions.
          </p>

          <h2>For Employers</h2>
          <p>
            Post your job listings for free — no hidden charges, no per-listing fees. Our AI ensures
            your listings are shown to the most relevant professionals based on genuine skill match,
            not just keyword stuffing. More relevant candidates means faster hiring and better
            retention.
          </p>

          <h2>Get Started</h2>
          <p>
            Ready to transform your job search?{" "}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Sign up for free
            </Link>{" "}
            and receive your first daily digest tomorrow morning. Or{" "}
            <Link href="/how-it-works" className="text-primary-600 font-medium hover:underline">
              learn how our AI matching works
            </Link>
            .
          </p>

          <h2>Contact Us</h2>
          <p>
            We&apos;d love to hear from you. Reach us at{" "}
            <a href="mailto:hello@decajob.com">hello@decajob.com</a> or visit our{" "}
            <Link href="/contact" className="text-primary-600 font-medium hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Organization JSON-LD for About page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DecaJobs",
            url: "https://decajob.com",
            logo: "https://decajob.com/web-app-manifest-512x512.png",
            description:
              "AI-powered job portal that delivers 10 perfectly matched jobs to your inbox every morning.",
            founder: {
              "@type": "Person",
              name: "Anup Behera",
            },
            foundingDate: "2025",
            areaServed: "India",
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@decajob.com",
              contactType: "customer support",
            },
          }),
        }}
      />
    </div>
  );
}
