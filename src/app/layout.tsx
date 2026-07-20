import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { AdScripts, AdBanner } from "@/components/ad-scripts";
import { AnalyticsTracker } from "@/components/analytics-tracker";
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
  metadataBase: new URL("https://decajob.com"),
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
        <AnalyticsTracker />
        {/* Sitewide JSON-LD structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://decajob.com/#website",
                  url: "https://decajob.com",
                  name: "DecaJobs",
                  description:
                    "AI-powered job portal that delivers 10 perfectly matched jobs to your inbox every morning.",
                  publisher: { "@id": "https://decajob.com/#organization" },
                  inLanguage: "en-US",
                },
                {
                  "@type": "Organization",
                  "@id": "https://decajob.com/#organization",
                  name: "DecaJobs",
                  url: "https://decajob.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://decajob.com/web-app-manifest-512x512.png",
                    width: 512,
                    height: 512,
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "support@decajob.com",
                    contactType: "customer support",
                    availableLanguage: "English",
                  },
                  sameAs: [],
                },
              ],
            }),
          }}
        />
        {/* Ad scripts — only shown to non-Pro users */}
        <AdScripts />
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
          {/* Banner ad — only shown to non-Pro users */}
          <AdBanner />
          <SiteFooter />
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  );
}
