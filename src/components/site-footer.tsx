import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              DecaJobs
            </Link>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
              AI-powered online job portal delivering 10 perfectly matched jobs to your inbox every morning.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              For Job Seekers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Sign Up / Sign In
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              For Employers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/employer/register" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Post Jobs Free
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Career Blog
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/resume-checker" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Resume Checker
                </Link>
              </li>
              <li>
                <Link href="/tools/salary-calculator" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Salary Calculator
                </Link>
              </li>
            </ul>
          </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-neutral-800 pt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} DecaJobs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
