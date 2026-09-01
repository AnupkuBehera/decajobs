"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALES,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  getLocaleFromPath,
} from "@/lib/i18n/config";
import { getTranslatedPath } from "@/lib/i18n/utils";

interface LanguageSwitcherProps {
  variant?: "header" | "footer" | "compact";
  className?: string;
}

export function LanguageSwitcher({
  variant = "header",
  className = "",
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "/";
  const router = useRouter();

  const currentLocale = getLocaleFromPath(pathname);
  const currentLocaleInfo = LOCALES[currentLocale];

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

  const handleSelectLanguage = (targetLocale: SupportedLocale) => {
    setIsOpen(false);
    if (targetLocale === currentLocale) return;

    // Set cookie so middleware and client remember preference
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

    const nextPath = getTranslatedPath(pathname, targetLocale);
    router.push(nextPath);
  };

  const isFooter = variant === "footer";

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
        aria-label="Select language"
        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
          isFooter
            ? "border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            : "border border-neutral-200 bg-white text-neutral-700 shadow-xs hover:bg-neutral-50 hover:text-neutral-900"
        }`}
      >
        <span aria-hidden="true" className="text-sm">
          {currentLocaleInfo.flag}
        </span>
        <span className="hidden xs:inline">{currentLocaleInfo.nativeName}</span>
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
          aria-label="Languages"
          className={`absolute ${
            isFooter ? "bottom-full mb-2" : "top-full mt-1.5"
          } right-0 z-50 w-48 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95`}
        >
          <div className="px-2.5 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
            Select Language
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {SUPPORTED_LOCALES.map((locale) => {
              const info = LOCALES[locale];
              const isSelected = locale === currentLocale;

              return (
                <button
                  key={locale}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(locale)}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs sm:text-sm text-left transition-colors ${
                    isSelected
                      ? "bg-primary-50 font-semibold text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-base">
                      {info.flag}
                    </span>
                    <span>{info.nativeName}</span>
                  </span>
                  {isSelected && (
                    <svg
                      className="h-4 w-4 text-primary-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
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
