import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - DecaJobs",
  description: "Read the DecaJobs disclaimer regarding job listings, AI tools, and career advice provided on our platform.",
};

export default function DisclaimerPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl prose prose-neutral prose-sm sm:prose-base">
        <h1>Disclaimer</h1>
        <p className="text-neutral-500 text-sm">Last updated: June 2026</p>

        <h2>General Information</h2>
        <p>
          The information provided by DecaJobs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) on decajob.com is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.
        </p>

        <h2>Job Listings Disclaimer</h2>
        <p>
          DecaJobs aggregates job listings from external sources including LinkedIn, Indeed, Glassdoor, Remotive, RemoteOK, and Arbeitnow. We do not verify, endorse, or guarantee the accuracy of these third-party listings. Job seekers should independently verify all job opportunities before applying or providing personal information.
        </p>

        <h2>AI-Generated Content</h2>
        <p>
          Our AI tools (resume scoring, career coaching, cover letter generation, skill analysis) use artificial intelligence to provide suggestions and recommendations. These are provided for guidance purposes only and should not be considered professional career counseling. AI responses may contain inaccuracies and should be reviewed and personalized by the user before use.
        </p>

        <h2>No Employment Guarantee</h2>
        <p>
          DecaJobs does not guarantee employment or job placement. Our matching algorithms provide recommendations based on skill and preference alignment, but hiring decisions are solely made by employers. Results may vary based on market conditions, individual qualifications, and other factors.
        </p>

        <h2>Salary Information</h2>
        <p>
          Salary data provided through our tools is based on publicly available market research and estimates. Actual compensation may vary significantly based on company, location, experience, negotiation, and other factors. This data should be used as a general reference only.
        </p>

        <h2>External Links</h2>
        <p>
          DecaJobs may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility for their privacy policies or content.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Under no circumstances shall DecaJobs be liable for any direct, indirect, special, incidental, or consequential damages arising from the use of our service, including but not limited to loss of employment opportunities, financial loss, or damage to reputation.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this disclaimer, contact us at{" "}
          <a href="mailto:legal@decajob.com">legal@decajob.com</a>.
        </p>
      </div>
    </div>
  );
}
