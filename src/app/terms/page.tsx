import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - DecaJobs",
  description:
    "Read the DecaJobs terms and conditions. Understand your rights and responsibilities when using our AI-powered job portal.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl prose prose-neutral prose-sm sm:prose-base">
        <h1>Terms &amp; Conditions</h1>
        <p className="text-neutral-500 text-sm">Last updated: June 10, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using DecaJobs (&quot;the Service&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you may not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          DecaJobs is an AI-powered online job portal that provides personalized daily job recommendations via email. The Service aggregates job listings from multiple external sources and matches them to user profiles using intelligent algorithms.
        </p>

        <h2>3. User Accounts</h2>
        <ul>
          <li>You must provide a valid email address to create an account</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must be at least 16 years old to use the Service</li>
          <li>One account per person; duplicate accounts may be terminated</li>
        </ul>

        <h2>4. For Candidates</h2>
        <ul>
          <li>Profile information must be accurate and truthful</li>
          <li>Job matches are recommendations only; DecaJobs does not guarantee employment</li>
          <li>We are not responsible for the accuracy of external job listings</li>
          <li>You may unsubscribe from daily emails at any time</li>
        </ul>

        <h2>5. For Employers</h2>
        <ul>
          <li>Job postings must be for legitimate, real positions</li>
          <li>Listings must not contain discriminatory language</li>
          <li>Spam, misleading, or fraudulent job posts will be removed</li>
          <li>Maximum 10 job posts per 24-hour period</li>
          <li>Job listings expire after 30 days unless renewed</li>
        </ul>

        <h2>6. Subscription and Payments</h2>
        <ul>
          <li>New users receive a 7-day free trial</li>
          <li>After the trial, a paid subscription is required for continued daily job matching</li>
          <li>Subscription fees are billed monthly and are non-refundable</li>
          <li>You may cancel your subscription at any time; access continues until the end of the billing period</li>
        </ul>

        <h2>7. Intellectual Property</h2>
        <p>
          The Service, including its design, algorithms, code, and content, is the intellectual property of DecaJobs. You may not copy, modify, distribute, or reverse-engineer any part of the Service.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          DecaJobs is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
        </p>
        <ul>
          <li>The accuracy or availability of external job listings</li>
          <li>Any employment decisions made based on our recommendations</li>
          <li>Service interruptions or data loss</li>
          <li>Actions of employers or third-party job platforms</li>
        </ul>

        <h2>9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms, post fraudulent content, or abuse the Service.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes shall be resolved in the courts of competent jurisdiction.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:legal@decajobs.com">legal@decajobs.com</a>.
        </p>
      </div>
    </div>
  );
}
