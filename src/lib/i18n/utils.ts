import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  SHOW_DEFAULT_LANG_IN_URL,
  type SupportedLocale,
  isValidLocale,
} from "./config";
import { translations, type TranslationDictionary } from "./translations";

const SITE_URL = "https://decajob.com";

/**
 * Get translations dictionary for a given locale, falling back to English.
 */
export function getTranslations(locale?: string): TranslationDictionary {
  if (locale && isValidLocale(locale) && translations[locale]) {
    return translations[locale];
  }
  return translations[DEFAULT_LOCALE];
}

/**
 * Clean a pathname by stripping any leading supported locale prefix.
 * e.g., "/es/about" => "/about", "/ja" => "/", "/jobs" => "/jobs"
 */
export function cleanPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && isValidLocale(firstSegment)) {
    const remaining = segments.slice(1).join("/");
    return remaining ? `/${remaining}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/**
 * Build a localized URL path for a given locale.
 * Inspired directly by Astro's useTranslatedPath utility:
 *
 * If showDefaultLang is false, English stays at "/" or "/about".
 * Other locales get "/es", "/ja", "/es/about", etc.
 */
export function getTranslatedPath(
  path: string,
  targetLocale: SupportedLocale
): string {
  const clean = cleanPathname(path);
  const normalized = clean === "/" ? "" : clean;

  if (!SHOW_DEFAULT_LANG_IN_URL && targetLocale === DEFAULT_LOCALE) {
    return normalized || "/";
  }

  return `/${targetLocale}${normalized}`;
}

/**
 * Higher-order function to translate paths based on a current language,
 * matching Astro's recipe syntax: `const translatePath = useTranslatedPath(lang)`
 */
export function useTranslatedPath(currentLocale: SupportedLocale) {
  return function translatePath(
    path: string,
    targetLocale: SupportedLocale = currentLocale
  ): string {
    return getTranslatedPath(path, targetLocale);
  };
}

/**
 * Generate hreflang alternates mapping for Next.js metadata.alternates.languages
 * and Google SEO compliance.
 *
 * Example output for pathname "/":
 * {
 *   "en": "https://decajob.com/",
 *   "es": "https://decajob.com/es",
 *   "ja": "https://decajob.com/ja",
 *   "fr": "https://decajob.com/fr",
 *   "de": "https://decajob.com/de",
 *   "pt": "https://decajob.com/pt",
 *   "ko": "https://decajob.com/ko",
 *   "it": "https://decajob.com/it",
 *   "x-default": "https://decajob.com/"
 * }
 */
export function getHreflangAlternates(pathname: string = "/") {
  const clean = cleanPathname(pathname);
  const alternates: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    const localizedPath = getTranslatedPath(clean, locale);
    alternates[locale] = `${SITE_URL}${localizedPath === "/" ? "" : localizedPath}`;
  }

  // x-default points to default fallback (English)
  const defaultPath = getTranslatedPath(clean, DEFAULT_LOCALE);
  alternates["x-default"] = `${SITE_URL}${defaultPath === "/" ? "" : defaultPath}`;

  return alternates;
}
