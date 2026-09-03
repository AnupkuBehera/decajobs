"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSenseUnit({
  slot = "default",
  format = "auto",
  responsive = true,
  className = "",
  label = "Advertisement",
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !isLoadedRef.current) {
        if (adRef.current && adRef.current.innerHTML.trim() === "") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoadedRef.current = true;
        }
      }
    } catch {
      // Ignore push errors when AdBlock or AdSense review mode is active
    }
  }, []);

  return (
    <div className={`my-8 text-center overflow-hidden ${className}`}>
      {label && (
        <span className="block text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1.5">
          {label}
        </span>
      )}
      <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-2 transition-all">
        <ins
          ref={adRef}
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7950314044956492"
          data-ad-slot={slot !== "default" ? slot : undefined}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
