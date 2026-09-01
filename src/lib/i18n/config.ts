/**
 * Internationalization (i18n) Configuration
 *
 * Defines supported locales, default language, and localization helpers
 * inspired by Astro's i18n specification and adapted for Next.js 15 App Router.
 */

export const SUPPORTED_LOCALES = [
  "en",
  "es",
  "ja",
  "fr",
  "de",
  "pt",
  "ko",
  "it",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

/**
 * When false, the default language (English) has clean URLs without
 * language prefix (e.g. / instead of /en/), exactly as demonstrated
 * in Astro's "Hide default language in the URL" recipe.
 */
export const SHOW_DEFAULT_LANG_IN_URL = false;

export interface LocaleInfo {
  code: SupportedLocale;
  label: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
  hreflang: string;
  defaultCurrency: string;
  country: string;
}

export const LOCALES: Record<SupportedLocale, LocaleInfo> = {
  en: {
    code: "en",
    label: "English",
    nativeName: "English",
    flag: "🇺🇸",
    dir: "ltr",
    hreflang: "en",
    defaultCurrency: "USD",
    country: "Global",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    hreflang: "es",
    defaultCurrency: "EUR",
    country: "España / LATAM",
  },
  ja: {
    code: "ja",
    label: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    dir: "ltr",
    hreflang: "ja",
    defaultCurrency: "JPY",
    country: "日本",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    hreflang: "fr",
    defaultCurrency: "EUR",
    country: "France / Francophonie",
  },
  de: {
    code: "de",
    label: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    dir: "ltr",
    hreflang: "de",
    defaultCurrency: "EUR",
    country: "Deutschland / DACH",
  },
  pt: {
    code: "pt",
    label: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    dir: "ltr",
    hreflang: "pt",
    defaultCurrency: "BRL",
    country: "Brasil / Portugal",
  },
  ko: {
    code: "ko",
    label: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    dir: "ltr",
    hreflang: "ko",
    defaultCurrency: "KRW",
    country: "대한민국",
  },
  it: {
    code: "it",
    label: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    dir: "ltr",
    hreflang: "it",
    defaultCurrency: "EUR",
    country: "Italia",
  },
};

/**
 * Check if a given string is a valid supported locale.
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/**
 * Extract locale from a pathname (e.g., "/es/about" => "es").
 */
export function getLocaleFromPath(pathname: string): SupportedLocale {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LOCALE;
}
