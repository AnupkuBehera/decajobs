/**
 * Multi-Country & Market Configuration
 *
 * Separates geographical market (country, currency, jobs, labor laws, payment provider)
 * from linguistic interface (Hindi, English, Spanish, etc.), following international
 * expansion best practices.
 */

export type SupportedCountryCode = "in" | "ae" | "global" | "gb";

export interface CountryMarket {
  code: SupportedCountryCode;
  name: string;
  nativeName: string;
  flag: string;
  currency: {
    code: string;
    symbol: string;
    proMonthlyPrice: string;
    proTrialDuration: string;
  };
  timeZone: string;
  dispatchTimeDisplay: string;
  privacyRegulation: {
    name: string;
    shortName: string;
    authorityUrl: string;
  };
  hubs: {
    name: string;
    slug: string;
    popularIndustries: string[];
  }[];
  visaFilterAvailable: boolean;
  taxNote: string;
  expatFriendly: boolean;
}

export const COUNTRIES: Record<SupportedCountryCode, CountryMarket> = {
  in: {
    code: "in",
    name: "India",
    nativeName: "भारत",
    flag: "🇮🇳",
    currency: {
      code: "INR",
      symbol: "₹",
      proMonthlyPrice: "₹299",
      proTrialDuration: "7-day free trial",
    },
    timeZone: "Asia/Kolkata",
    dispatchTimeDisplay: "7:00 AM IST",
    privacyRegulation: {
      name: "Digital Personal Data Protection (DPDP) Act 2023",
      shortName: "DPDP Act",
      authorityUrl: "https://www.meity.gov.in",
    },
    hubs: [
      { name: "Bengaluru", slug: "bengaluru", popularIndustries: ["FinTech", "SaaS", "AI & ML", "Consumer Tech"] },
      { name: "Hyderabad", slug: "hyderabad", popularIndustries: ["Cloud", "Enterprise Software", "Pharma Tech"] },
      { name: "Pune", slug: "pune", popularIndustries: ["Automotive Tech", "Full Stack", "DevOps"] },
      { name: "Delhi NCR", slug: "delhi-ncr", popularIndustries: ["E-Commerce", "Logistics", "EdTech"] },
      { name: "Mumbai", slug: "mumbai", popularIndustries: ["Banking & FinTech", "Media Tech", "Consulting"] },
      { name: "Bhubaneswar", slug: "bhubaneswar", popularIndustries: ["IT Services", "VLSI & Semiconductor", "GovTech"] },
    ],
    visaFilterAvailable: false,
    taxNote: "New Tax Regime FY 2025-26 & EPF 12% calculation",
    expatFriendly: false,
  },

  ae: {
    code: "ae",
    name: "United Arab Emirates & Gulf",
    nativeName: "الإمارات العربية المتحدة",
    flag: "🇦🇪",
    currency: {
      code: "AED",
      symbol: "د.إ",
      proMonthlyPrice: "19 AED",
      proTrialDuration: "7-day free trial",
    },
    timeZone: "Asia/Dubai",
    dispatchTimeDisplay: "7:00 AM GST",
    privacyRegulation: {
      name: "UAE Federal Decree-Law No. 45/2021 on Personal Data Protection",
      shortName: "UAE PDPL",
      authorityUrl: "https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws",
    },
    hubs: [
      { name: "Dubai", slug: "dubai", popularIndustries: ["FinTech & Web3", "Logistics & Trade", "E-Commerce", "Hospitality Tech"] },
      { name: "Abu Dhabi", slug: "abu-dhabi", popularIndustries: ["Sovereign Tech", "Clean Energy", "AI & Quantum", "Enterprise"] },
      { name: "Dubai Internet City (DIC)", slug: "dubai-internet-city", popularIndustries: ["Global Big Tech", "Software Platforms"] },
      { name: "Sharjah", slug: "sharjah", popularIndustries: ["Media & Creative Tech", "EdTech", "Industrial Services"] },
    ],
    visaFilterAvailable: true,
    taxNote: "0% Personal Income Tax (100% Tax-Free Take-Home Pay)",
    expatFriendly: true,
  },

  global: {
    code: "global",
    name: "Global Remote",
    nativeName: "Worldwide Remote",
    flag: "🌍",
    currency: {
      code: "USD",
      symbol: "$",
      proMonthlyPrice: "$4.99",
      proTrialDuration: "7-day free trial",
    },
    timeZone: "UTC",
    dispatchTimeDisplay: "7:00 AM Local Time",
    privacyRegulation: {
      name: "General Data Protection Regulation (GDPR) Standards",
      shortName: "GDPR / Global",
      authorityUrl: "https://gdpr.eu",
    },
    hubs: [
      { name: "Global Remote (Anywhere)", slug: "remote-anywhere", popularIndustries: ["SaaS", "Open Source", "Distributed AI"] },
      { name: "US & Canada Timezones", slug: "remote-americas", popularIndustries: ["Full Stack", "Product Design", "Cloud Infrastructure"] },
      { name: "EMEA Timezones", slug: "remote-emea", popularIndustries: ["FinTech", "Data Engineering", "Backend Microservices"] },
      { name: "APAC Timezones", slug: "remote-apac", popularIndustries: ["Web3", "Frontend", "Customer Experience"] },
    ],
    visaFilterAvailable: false,
    taxNote: "Cross-border contractor or domestic employer of record (EOR)",
    expatFriendly: true,
  },

  gb: {
    code: "gb",
    name: "United Kingdom",
    nativeName: "United Kingdom",
    flag: "🇬🇧",
    currency: {
      code: "GBP",
      symbol: "£",
      proMonthlyPrice: "£4.99",
      proTrialDuration: "7-day free trial",
    },
    timeZone: "Europe/London",
    dispatchTimeDisplay: "7:00 AM GMT/BST",
    privacyRegulation: {
      name: "United Kingdom General Data Protection Regulation & DPA 2018",
      shortName: "UK GDPR",
      authorityUrl: "https://ico.org.uk",
    },
    hubs: [
      { name: "London", slug: "london", popularIndustries: ["FinTech", "AI Labs", "PropTech", "Cybersecurity"] },
      { name: "Manchester", slug: "manchester", popularIndustries: ["E-Commerce", "Digital Media", "HealthTech"] },
      { name: "Cambridge & Oxford", slug: "cambridge", popularIndustries: ["BioTech", "Deep Tech & Robotics"] },
    ],
    visaFilterAvailable: true,
    taxNote: "PAYE Income Tax & National Insurance contributions",
    expatFriendly: true,
  },
};

export const DEFAULT_COUNTRY: SupportedCountryCode = "in";

export const SUPPORTED_COUNTRIES: SupportedCountryCode[] = ["in", "ae", "global", "gb"];

/**
 * Get country market settings by code with automatic fallback.
 */
export function getCountryMarket(code?: string): CountryMarket {
  const normalized = (code || "").toLowerCase() as SupportedCountryCode;
  if (normalized && COUNTRIES[normalized]) {
    return COUNTRIES[normalized];
  }
  return COUNTRIES[DEFAULT_COUNTRY];
}
