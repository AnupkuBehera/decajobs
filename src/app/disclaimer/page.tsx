import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Disclaimer - DecaJobs",
  description: "Read the DecaJobs disclaimer regarding job listings, AI tools, career advice, editorial content, and external links on our platform.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Disclaimer" }]} />

        <div className="prose prose-neutral prose-sm sm:prose-base">
          <h1>Disclaimer</h1>
          <p className="text-neutral-500 text-sm">Last updated: July 15, 2026</p>

          <h2>General Information</h2>
          <p>
            The information provided by DecaJobs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
            on decajob.com (the &quot;Site&quot;) is for general informational purposes only. All
            information on the Site is provided in good faith; however, we make no representation or
            warranty of any kind, express or implied, regarding the accuracy, adequacy, validity,
            reliability, availability, or completeness of any information on the Site.
          </p>
          <p>
            Under no circumstance shall we have any liability to you for any loss or damage of any
            kind incurred as a result of the use of the Site or reliance on any information provided
            on the Site. Your use of the Site and your reliance on any information on the Site is
            solely at your own risk.
          </p>

          <h2>Job Listings Disclaimer</h2>
          <p>
            DecaJobs aggregates job listings from multiple external sources including, but not
            limited to, LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, and Arbeitnow. We also
            display job listings posted directly by employers on our platform.
          </p>
          <p>
            We do not verify, endorse, or guarantee the accuracy, legitimacy, or completeness of
            these third-party listings. Job seekers should independently verify all job opportunities
            before applying, sharing personal information, or accepting any offers. We strongly
            recommend that users:
          </p>
          <ul>
            <li>Research the company independently before applying</li>
            <li>Never pay money to apply for a job or as a condition of employment</li>
            <li>Verify the company&apos;s legitimacy through official websites and business registries</li>
            <li>Be cautious of requests for sensitive personal information early in the process</li>
            <li>Use our free Job Scam Detector tool to evaluate suspicious listings</li>
          </ul>

          <h2>AI-Generated Content</h2>
          <p>
            DecaJobs uses artificial intelligence technology to power several features on our
            platform, including but not limited to:
          </p>
          <ul>
            <li>Resume scoring and optimization suggestions</li>
            <li>Cover letter generation</li>
            <li>Career coaching responses</li>
            <li>Interview question preparation</li>
            <li>Skill gap analysis</li>
            <li>Salary estimation and comparison</li>
            <li>Job matching and scoring algorithms</li>
          </ul>
          <p>
            These AI-generated outputs are provided for guidance purposes only and should not be
            considered professional career counseling, legal advice, or financial advice. AI
            responses may contain inaccuracies, outdated information, or suggestions that may not
            be appropriate for your specific situation. Users should review, verify, and personalize
            all AI-generated content before using it in professional contexts.
          </p>

          <h2>No Employment Guarantee</h2>
          <p>
            DecaJobs does not guarantee employment, job placement, or any specific outcome from
            using our service. Our matching algorithms provide recommendations based on skill and
            preference alignment, but hiring decisions are solely made by employers. Results may
            vary significantly based on market conditions, individual qualifications, competition,
            geographic factors, and other variables beyond our control.
          </p>

          <h2>Salary Information</h2>
          <p>
            Salary data provided through our Salary Calculator and other tools is based on publicly
            available market research, aggregated survey data, and algorithmic estimates. Actual
            compensation may vary significantly based on company size, industry, location, experience
            level, negotiation outcomes, economic conditions, and other factors. This data should be
            used as a general reference only and not as a guarantee of what any specific role will
            pay.
          </p>

          <h2>Editorial Content</h2>
          <p>
            Blog articles, guides, and career advice published on DecaJobs are created by our
            editorial team for informational purposes. While we strive to provide accurate,
            up-to-date, and helpful content, we cannot guarantee that all information is current or
            applicable to every individual&apos;s circumstances. Career advice should be considered
            alongside your own research and, where appropriate, consultation with qualified career
            professionals.
          </p>

          <h2>External Links</h2>
          <p>
            The Site may contain links to external websites that are not provided or maintained by
            or in any way affiliated with DecaJobs. Please note that we do not guarantee the
            accuracy, relevance, timeliness, or completeness of any information on these external
            websites. We have no control over the content, privacy policies, or practices of
            third-party sites and cannot accept responsibility or liability for their content.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall DecaJobs, its
            founders, employees, or affiliates be liable for any direct, indirect, incidental,
            special, consequential, or punitive damages arising from or related to:
          </p>
          <ul>
            <li>Your use of or inability to use the Site or its features</li>
            <li>The accuracy or availability of external job listings</li>
            <li>Any employment decisions made based on our recommendations or AI tools</li>
            <li>Service interruptions, data loss, or technical failures</li>
            <li>Actions of employers, recruiters, or third-party job platforms</li>
            <li>Loss of employment opportunities, financial loss, or damage to reputation</li>
          </ul>

          <h2>Changes to This Disclaimer</h2>
          <p>
            We reserve the right to modify this Disclaimer at any time. Changes will be posted on
            this page with an updated &quot;Last updated&quot; date. Your continued use of the Site
            after any changes constitutes acceptance of those changes.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this Disclaimer, please contact us at{" "}
            <a href="mailto:legal@decajob.com">legal@decajob.com</a> or visit our{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              contact page
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
