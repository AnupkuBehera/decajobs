"use client";

import { useEffect, useRef, useState } from "react";

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
  const [hasAdFilled, setHasAdFilled] = useState(false);

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

    const checkFilled = () => {
      if (adRef.current) {
        const isFilled =
          adRef.current.getAttribute("data-ad-status") === "filled" ||
          adRef.current.children.length > 0 ||
          adRef.current.offsetHeight > 20;
        if (isFilled) {
          setHasAdFilled(true);
        }
      }
    };

    const timer = setTimeout(checkFilled, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`text-center overflow-hidden transition-all ${hasAdFilled ? "my-4" : "my-0"} ${className}`}>
      {hasAdFilled && label && (
        <span className="block text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
          {label}
        </span>
      )}
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
  );
}
