import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us - DecaJobs",
  description:
    "Get in touch with the DecaJobs team. Contact us for support, partnership inquiries, feedback, or any questions about our AI-powered job portal.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Get In Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Email</p>
                    <a href="mailto:support@decajob.com" className="text-sm text-primary-600 hover:underline">
                      support@decajob.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Response Time</p>
                    <p className="text-sm text-neutral-600">We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Quick Links
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>General inquiries:</strong>{" "}
                  <a href="mailto:hello@decajob.com" className="text-primary-600 hover:underline">hello@decajob.com</a>
                </li>
                <li>
                  <strong>Employer support:</strong>{" "}
                  <a href="mailto:employers@decajob.com" className="text-primary-600 hover:underline">employers@decajob.com</a>
                </li>
                <li>
                  <strong>Privacy concerns:</strong>{" "}
                  <a href="mailto:privacy@decajob.com" className="text-primary-600 hover:underline">privacy@decajob.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
