import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy - DecaJobs",
  description:
    "Read the DecaJobs privacy policy. Learn how we collect, use, and protect your personal data on our AI-powered job portal.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <div className="prose prose-neutral prose-sm sm:prose-base">
          <h1>Privacy Policy</h1>
        <p className="text-neutral-500 text-sm">Last updated: June 10, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          DecaJobs (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered online job portal at decajobs.com.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
          <li>Email address (for account creation and communication)</li>
          <li>Name (if provided via Google OAuth)</li>
          <li>Job preferences: target titles, skills, location, designation, expected salary</li>
          <li>Resume/CV files uploaded to your profile</li>
        </ul>
        <h3>Automatically Collected Information</h3>
        <ul>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>IP address</li>
          <li>Pages visited and time spent</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide personalized job matching and daily digest emails</li>
          <li>To create and manage your account</li>
          <li>To improve our AI matching algorithms</li>
          <li>To send transactional emails (magic links, verifications, digest emails)</li>
          <li>To communicate updates about our service</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell your personal data. We may share information with:
        </p>
        <ul>
          <li><strong>Service providers:</strong> Supabase (database/auth), Resend (email delivery), Inngest (job scheduling), RapidAPI (job sourcing)</li>
          <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
        </ul>

        <h2>5. Data Storage and Security</h2>
        <p>
          Your data is stored on Supabase servers with encryption at rest. We use Row Level Security (RLS) to ensure users can only access their own data. Resume files are stored in encrypted private storage buckets.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and all associated data</li>
          <li>Unsubscribe from daily digest emails at any time</li>
          <li>Export your data</li>
        </ul>

        <h2>7. Cookies and Advertising</h2>
        <p>
          We use cookies to help analyze traffic, remember your preferences, and optimize your user experience. Essential cookies are required for authentication and session management.
        </p>
        <p>
          <strong>Google AdSense & Third-Party Cookies:</strong>
        </p>
        <ul>
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to DecaJobs or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to DecaJobs and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
        </ul>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@decajobs.com">privacy@decajobs.com</a>.
        </p>
        </div>
      </div>
    </div>
  );
}
