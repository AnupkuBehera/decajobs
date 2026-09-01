import Link from "next/link";

interface InstantAlertsBannerProps {
  className?: string;
}

export function InstantAlertsBanner({ className = "" }: InstantAlertsBannerProps) {
  return (
    <div
      className={`rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-sky-50/60 to-indigo-50/80 p-5 sm:p-6 shadow-xs ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
              ⚡ Instant Notifications
            </span>
            <span className="text-xs text-blue-800 font-medium hidden sm:inline">
              18,000+ Active Tech Subscribers
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
            Receive the Daily 10 on Telegram & WhatsApp
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Never miss high-priority hiring windows. Wake up to 10 curated remote and tech jobs delivered directly to your messaging app every morning at 8:00 AM.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            href="https://t.me/decajobs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .661-.21.916-.457l2.199-2.138 4.573 3.378c.843.465 1.45.226 1.66-.782l2.997-14.125c.308-1.233-.472-1.792-1.276-1.427z" />
            </svg>
            Join Telegram Channel
          </a>

          <Link
            href="/login?alert=whatsapp"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20b859] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29" />
            </svg>
            WhatsApp Digest
          </Link>
        </div>
      </div>
    </div>
  );
}
