import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards | DecaJobs",
  description:
    "Learn about DecaJobs editorial standards, research methodology, fact-checking policies, and how our career experts curate high-quality job search advice.",
  alternates: {
    canonical: "https://decajob.com/blog/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Editorial Policy & Fact-Checking Standards",
    "url": "https://decajob.com/blog/editorial-policy",
    "description": "DecaJobs editorial standards, content guidelines, and fact-checking principles for career content.",
    "publisher": {
      "@type": "Organization",
      "name": "DecaJobs",
      "url": "https://decajob.com",
    },
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Editorial Policy" }]} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            DecaJobs Editorial Guidelines &amp; Standards
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Our commitment to accuracy, integrity, and actionable career guidance.
          </p>
        </div>

        <div className="prose prose-neutral prose-sm sm:prose-base mx-auto leading-relaxed">
          <h2>Our Editorial Mission</h2>
          <p>
            At DecaJobs, our mission is to simplify job searching for candidates across India and worldwide. Every article, tool, and guide published on DecaJobs is created to provide honest, data-backed, and practical advice that helps candidates make informed career decisions.
          </p>

          <h2>1. Independence &amp; Objectivity</h2>
          <p>
            Our career advice and tool recommendations are entirely independent. We do not accept payment from companies to favor specific job postings or write positive reviews. Sponsored content, if any, is explicitly labeled as such.
          </p>

          <h2>2. Data-Backed Research &amp; Fact-Checking</h2>
          <p>
            Salary statistics, hiring trends, and resume recommendations published in our guides are sourced from verified market data, including official government labor statistics, industry benchmark reports (Levels.fyi, Glassdoor, AmbitionBox), and real job market aggregations analyzed by our engineering team.
          </p>

          <h2>3. Expert Review &amp; Regular Updates</h2>
          <p>
            The job market evolves rapidly. Our editorial team regularly reviews and updates past articles to ensure that salary ranges, tech stack recommendations, and hiring policies reflect current 2026 standards.
          </p>

          <h2>4. Use of AI Technology</h2>
          <p>
            DecaJobs utilizes artificial intelligence (such as Google Gemini) to power interactive tools like our Resume Checker and AI Recruiter Mode. However, all static editorial articles and guides are authored, edited, and verified by human career experts prior to publication.
          </p>

          <h2>5. Transparency &amp; User Feedback</h2>
          <p>
            If you spot an error, outdated salary benchmark, or broken resource link in any of our articles, please reach out to our team at{" "}
            <a href="mailto:editorial@decajob.com" className="text-primary-600 underline">
              editorial@decajob.com
            </a>
            . We review feedback promptly and publish corrections transparently.
          </p>

          <div className="mt-10 rounded-xl bg-neutral-50 border border-neutral-200 p-6 not-prose">
            <h3 className="font-semibold text-neutral-900 text-lg mb-2">Have Questions About Our Content?</h3>
            <p className="text-sm text-neutral-600">
              Read more about our founding story on our{" "}
              <Link href="/about" className="text-primary-600 font-medium hover:underline">
                About Us page
              </Link>{" "}
              or contact our team via the{" "}
              <Link href="/contact" className="text-primary-600 font-medium hover:underline">
                Contact Page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
