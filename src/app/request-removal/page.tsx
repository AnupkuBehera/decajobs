import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RequestRemovalClient } from "./removal-client";

export const metadata: Metadata = {
  title: "Request Job or Data Removal — Employer & Candidate Portal | DecaJobs",
  description:
    "Submit a request to remove an expired job posting, de-index an employer careers domain, or exercise your GDPR / DPDP right to erasure. Processed within 24 business hours.",
  alternates: {
    canonical: "https://decajob.com/request-removal",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RequestRemovalPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Request Removal" }]} />

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 mb-3 border border-neutral-200">
            🛡️ Content Integrity &amp; Data Rights
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Content Takedown &amp; Data Erasure Request
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            DecaJobs respects employer intellectual property and candidate privacy. If you are an
            employer whose position has closed or a candidate requesting complete profile deletion,
            submit below for processing within 24 hours.
          </p>
        </div>

        {/* Client Request Form */}
        <RequestRemovalClient />

        {/* Legal & Compliance Notice */}
        <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-xs text-neutral-600 space-y-3 leading-relaxed">
          <h3 className="font-bold text-neutral-900 text-sm">Our Removal &amp; Privacy Policies</h3>
          <p>
            <strong>For Employers &amp; Recruiters:</strong> DecaJobs indexes publicly available job
            postings to connect qualified talent with open roles. If a role is filled, cancelled, or
            your organization prefers not to be indexed, we will promptly delist the listing or
            permanently exclude your corporate domain upon request.
          </p>
          <p>
            <strong>For Candidates (GDPR / UK GDPR / DPDP Act):</strong> You have the absolute right
            to have your email, resume files, and job matching history permanently erased from our
            encrypted databases. You may also self-delete your account anytime via Account Settings.
          </p>
          <p>
            For urgent legal or copyright inquiries, you can also contact our compliance desk directly
            at <a href="mailto:compliance@decajob.com" className="text-primary-600 underline">compliance@decajob.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
