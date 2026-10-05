"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  COUNTRIES,
  SUPPORTED_COUNTRIES,
  type SupportedCountryCode,
  DEFAULT_COUNTRY,
} from "@/lib/country-config";

interface CountrySelectorProps {
  variant?: "header" | "footer" | "compact";
  className?: string;
}

export function CountrySelector({
  variant = "header",
  className = "",
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountryCode>(DEFAULT_COUNTRY);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Read cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/NEXT_COUNTRY=([a-z]+)/);
    if (match && match[1] && (SUPPORTED_COUNTRIES as readonly string[]).includes(match[1])) {
      setSelectedCountry(match[1] as SupportedCountryCode);
    }
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectCountry = (countryCode: SupportedCountryCode) => {
    setIsOpen(false);
    setSelectedCountry(countryCode);
    document.cookie = `NEXT_COUNTRY=${countryCode}; path=/; max-age=31536000; SameSite=Lax`;

    // Direct routing to dedicated country hubs
    if (countryCode === "ae") {
      router.push("/ae");
    } else if (countryCode === "gb") {
      router.push("/uk");
    } else {
      router.refresh();
    }
  };

  const isFooter = variant === "footer";
  const current = COUNTRIES[selectedCountry] || COUNTRIES[DEFAULT_COUNTRY];

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Country / Market"
        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
          isFooter
            ? "border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            : "border border-neutral-200 bg-white text-neutral-700 shadow-xs hover:bg-neutral-50 hover:text-neutral-900"
        }`}
      >
        <span aria-hidden="true" className="text-sm">
          {current.flag}
        </span>
        <span className="hidden xs:inline">{current.name}</span>
        <span className="text-[11px] text-neutral-400 font-mono">
          ({current.currency.symbol})
        </span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select country or job market"
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 text-xs"
        >
          <div className="px-3 py-2 border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Job Market &amp; Currency
          </div>
          <div className="py-1">
            {SUPPORTED_COUNTRIES.map((code) => {
              const country = COUNTRIES[code];
              const isSelected = code === selectedCountry;
              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectCountry(code)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? "bg-primary-50 text-primary-900 font-semibold"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <div>
                      <div className="font-medium">{country.name}</div>
                      <div className="text-[10px] text-neutral-400">
                        {country.dispatchTimeDisplay} · {country.currency.proMonthlyPrice}/mo
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-primary-600 font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
