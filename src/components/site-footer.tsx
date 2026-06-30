import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="text-base font-bold text-white shrink-0">
            DecaJobs
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link>
            <Link href="/employer/register" className="hover:text-white transition-colors">Post Jobs</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-neutral-500 shrink-0">
            &copy; {new Date().getFullYear()} DecaJobs
          </p>
        </div>
      </div>
    </footer>
  );
}
