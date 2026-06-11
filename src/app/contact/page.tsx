import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - DecaJobs",
  description:
    "Get in touch with the DecaJobs team. Contact us for support, partnership inquiries, feedback, or any questions about our AI-powered job portal.",
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
                    <a href="mailto:support@decajobs.com" className="text-sm text-primary-600 hover:underline">
                      support@decajobs.com
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
                  <a href="mailto:hello@decajobs.com" className="text-primary-600 hover:underline">hello@decajobs.com</a>
                </li>
                <li>
                  <strong>Employer support:</strong>{" "}
                  <a href="mailto:employers@decajobs.com" className="text-primary-600 hover:underline">employers@decajobs.com</a>
                </li>
                <li>
                  <strong>Privacy concerns:</strong>{" "}
                  <a href="mailto:privacy@decajobs.com" className="text-primary-600 hover:underline">privacy@decajobs.com</a>
                </li>
                <li>
                  <strong>Partnerships:</strong>{" "}
                  <a href="mailto:partners@decajobs.com" className="text-primary-600 hover:underline">partners@decajobs.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Send a Message
            </h2>
            <form className="space-y-4" action="mailto:support@decajobs.com" method="POST" encType="text/plain">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
                  placeholder="Tell us more..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-base font-medium text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 min-h-[44px]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
