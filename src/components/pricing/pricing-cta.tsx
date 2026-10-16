"use client";

import { useRouter } from "next/navigation";
import * as gtag from "@/lib/gtag";

interface PricingCtaProps {
  plan: string;
  href: string;
  value?: number;
  currency?: string;
  className?: string;
  children: React.ReactNode;
}

export function PricingCta({
  plan,
  href,
  value = 299,
  currency = "INR",
  className = "",
  children,
}: PricingCtaProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      if (plan === "employer") {
        gtag.trackLead("employer", "pricing_page_card");
      } else {
        gtag.trackBeginCheckout(plan, value, currency);
      }
    } catch (err) {
      console.warn("[PricingCTA] Tracking error:", err);
    }
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
