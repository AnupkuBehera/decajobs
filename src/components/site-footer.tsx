import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Multi-column footer grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="text-lg font-bold text-white">
              DecaJobs
            </Link>
            <p className="mt-2 text-sm text-neutral-400 max-w-xs">
              AI-powered job portal that delivers 10 perfectly matched jobs to
              your inbox every morning. Stop scrolling, start applying.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Product
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-neutral-400 hover:text-white transition-colors">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  Career Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Company
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/employer/register" className="text-neutral-400 hover:text-white transition-colors">
                  Post Jobs (Free)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-neutral-400 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-neutral-400 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Tools */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Free Tools
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/tools/resume-checker" className="text-neutral-400 hover:text-white transition-colors">
                  Resume Checker
                </Link>
              </li>
              <li>
                <Link href="/tools/salary-calculator" className="text-neutral-400 hover:text-white transition-colors">
                  Salary Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/interview-questions" className="text-neutral-400 hover:text-white transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link href="/tools/cover-letter-generator" className="text-neutral-400 hover:text-white transition-colors">
                  Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/job-scam-detector" className="text-neutral-400 hover:text-white transition-colors">
                  Job Scam Detector
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-neutral-800 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} DecaJobs. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
