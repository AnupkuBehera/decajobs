import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker Widget | DecaJobs",
  description: "Embeddable ATS resume checker widget powered by DecaJobs AI.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        header, footer, nav, .skip-nav, [data-cookie-consent], aside { display: none !important; }
        body { background: transparent !important; }
        #main-content { padding: 0 !important; margin: 0 !important; max-width: none !important; width: 100% !important; }
        #main-content > div { max-width: none !important; padding: 0 !important; width: 100% !important; }
      `}</style>
      <div className="w-full bg-white antialiased">
        {children}
      </div>
    </>
  );
}
