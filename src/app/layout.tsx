import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "DecaJobs - AI Powered Online Job Portal | 10 Perfect Jobs Every Morning",
  description:
    "DecaJobs is the best online job portal powered by AI. Get exactly 10 highly relevant job matches delivered to your inbox every morning. Search jobs from Indeed, LinkedIn, Glassdoor & more. Best job search site 2026 for remote jobs, fresher jobs, and experienced professionals in India & worldwide.",
  keywords: [
    "online job portal",
    "ai powered job portal",
    "indeed job portal",
    "fresherslive job portal",
    "job portal",
    "best online job portal",
    "online job portal india",
    "job search",
    "job search websites",
    "job search sites",
    "best job search engines",
    "best job search sites",
    "best job search websites 2026",
    "best job search sites 2025",
    "job search near me",
    "job search apps",
    "remote job finder",
    "remote job sites",
    "remote job boards",
    "remote job opportunities",
  ],
  openGraph: {
    title: "DecaJobs - AI Powered Online Job Portal | 10 Perfect Jobs Every Morning",
    description:
      "The smartest job search engine that delivers exactly 10 AI-matched jobs to your inbox daily. Aggregates from LinkedIn, Indeed, Glassdoor & 20+ job boards. Free to start.",
    url: "https://decajob.com",
    siteName: "DecaJobs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DecaJobs - AI Powered Online Job Portal",
    description:
      "Get 10 AI-matched jobs delivered to your inbox every morning. The best job search site for 2026.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://decajob.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Decajobs",
  },
};

/*
 * Accessibility note: Full WCAG 2.1 AA compliance requires manual testing
 * with assistive technologies (VoiceOver, NVDA) and expert accessibility review.
 * Automated checks (axe-core, Lighthouse) cover structure and ARIA usage,
 * but cannot verify real-world screen reader behavior or cognitive accessibility.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased overflow-x-hidden">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QM60V43CBZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QM60V43CBZ');
          `}
        </Script>
        {/* Skip navigation link for keyboard users (WCAG 2.4.1) */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <ToastProvider>
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
