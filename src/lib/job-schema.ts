import type { ExternalJob } from "@/lib/external-jobs/types";

export interface JobPostingSchema {
  "@context": "https://schema.org";
  "@type": "JobPosting";
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: {
    "@type": "Organization";
    name: string;
    sameAs?: string;
  };
  jobLocation: {
    "@type": "Place";
    address: {
      "@type": "PostalAddress";
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  jobLocationType?: string;
  applicantLocationRequirements?: {
    "@type": "Country";
    name: string;
  };
  baseSalary: {
    "@type": "MonetaryAmount";
    currency: string;
    value: {
      "@type": "QuantitativeValue";
      minValue: number;
      maxValue: number;
      unitText: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
    };
  };
  directApply: boolean;
  url: string;
}

/**
 * Format any date input into a valid ISO 8601 date string.
 * Handles ISO strings, timestamps, and invalid/undefined values gracefully.
 */
export function formatIsoDate(dateInput?: string | number): string {
  if (!dateInput) {
    return new Date().toISOString();
  }

  // Handle Unix timestamp in string or number form
  if (typeof dateInput === "number" || /^\d+$/.test(String(dateInput).trim())) {
    const num = Number(dateInput);
    const ms = num > 1e11 ? num : num * 1000;
    const d = new Date(ms);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  const parsed = new Date(dateInput);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

/**
 * 50 US States + DC lookup with canonical 2-letter codes, names, and primary tech/capital ZIP codes.
 */
export const US_STATES: Record<string, { name: string; zip: string }> = {
  AL: { name: "Alabama", zip: "35203" },
  AK: { name: "Alaska", zip: "99501" },
  AZ: { name: "Arizona", zip: "85001" },
  AR: { name: "Arkansas", zip: "72201" },
  CA: { name: "California", zip: "94105" },
  CO: { name: "Colorado", zip: "80202" },
  CT: { name: "Connecticut", zip: "06103" },
  DE: { name: "Delaware", zip: "19801" },
  FL: { name: "Florida", zip: "33101" },
  GA: { name: "Georgia", zip: "30303" },
  HI: { name: "Hawaii", zip: "96813" },
  ID: { name: "Idaho", zip: "83702" },
  IL: { name: "Illinois", zip: "60601" },
  IN: { name: "Indiana", zip: "46204" },
  IA: { name: "Iowa", zip: "50309" },
  KS: { name: "Kansas", zip: "67202" },
  KY: { name: "Kentucky", zip: "40202" },
  LA: { name: "Louisiana", zip: "70112" },
  ME: { name: "Maine", zip: "04101" },
  MD: { name: "Maryland", zip: "21201" },
  MA: { name: "Massachusetts", zip: "02108" },
  MI: { name: "Michigan", zip: "48226" },
  MN: { name: "Minnesota", zip: "55401" },
  MS: { name: "Mississippi", zip: "39201" },
  MO: { name: "Missouri", zip: "63101" },
  MT: { name: "Montana", zip: "59601" },
  NE: { name: "Nebraska", zip: "68102" },
  NV: { name: "Nevada", zip: "89101" },
  NH: { name: "New Hampshire", zip: "03101" },
  NJ: { name: "New Jersey", zip: "07102" },
  NM: { name: "New Mexico", zip: "87102" },
  NY: { name: "New York", zip: "10001" },
  NC: { name: "North Carolina", zip: "27601" },
  ND: { name: "North Dakota", zip: "58102" },
  OH: { name: "Ohio", zip: "43215" },
  OK: { name: "Oklahoma", zip: "73102" },
  OR: { name: "Oregon", zip: "97201" },
  PA: { name: "Pennsylvania", zip: "19102" },
  RI: { name: "Rhode Island", zip: "02903" },
  SC: { name: "South Carolina", zip: "29201" },
  SD: { name: "South Dakota", zip: "57104" },
  TN: { name: "Tennessee", zip: "37201" },
  TX: { name: "Texas", zip: "78701" },
  UT: { name: "Utah", zip: "84101" },
  VT: { name: "Vermont", zip: "05401" },
  VA: { name: "Virginia", zip: "20147" },
  WA: { name: "Washington", zip: "98101" },
  WV: { name: "West Virginia", zip: "25301" },
  WI: { name: "Wisconsin", zip: "53202" },
  WY: { name: "Wyoming", zip: "82001" },
  DC: { name: "District of Columbia", zip: "20001" },
};

/**
 * High-precision mapping for major global tech hubs and cities.
 */
export const CITY_POSTAL_MAP: Record<
  string,
  { locality: string; region: string; country: string; postalCode: string }
> = {
  // US Cities & Hubs
  portland: { locality: "Portland", region: "OR", country: "US", postalCode: "97201" },
  "san francisco": { locality: "San Francisco", region: "CA", country: "US", postalCode: "94105" },
  "san jose": { locality: "San Jose", region: "CA", country: "US", postalCode: "95113" },
  "mountain view": { locality: "Mountain View", region: "CA", country: "US", postalCode: "94043" },
  "palo alto": { locality: "Palo Alto", region: "CA", country: "US", postalCode: "94301" },
  sunnyvale: { locality: "Sunnyvale", region: "CA", country: "US", postalCode: "94086" },
  "santa clara": { locality: "Santa Clara", region: "CA", country: "US", postalCode: "95050" },
  seattle: { locality: "Seattle", region: "WA", country: "US", postalCode: "98101" },
  bellevue: { locality: "Bellevue", region: "WA", country: "US", postalCode: "98004" },
  redmond: { locality: "Redmond", region: "WA", country: "US", postalCode: "98052" },
  austin: { locality: "Austin", region: "TX", country: "US", postalCode: "78701" },
  dallas: { locality: "Dallas", region: "TX", country: "US", postalCode: "75201" },
  houston: { locality: "Houston", region: "TX", country: "US", postalCode: "77002" },
  "new york": { locality: "New York", region: "NY", country: "US", postalCode: "10001" },
  nyc: { locality: "New York", region: "NY", country: "US", postalCode: "10001" },
  manhattan: { locality: "New York", region: "NY", country: "US", postalCode: "10001" },
  brooklyn: { locality: "Brooklyn", region: "NY", country: "US", postalCode: "11201" },
  boston: { locality: "Boston", region: "MA", country: "US", postalCode: "02108" },
  cambridge: { locality: "Cambridge", region: "MA", country: "US", postalCode: "02138" },
  chicago: { locality: "Chicago", region: "IL", country: "US", postalCode: "60601" },
  denver: { locality: "Denver", region: "CO", country: "US", postalCode: "80202" },
  boulder: { locality: "Boulder", region: "CO", country: "US", postalCode: "80301" },
  atlanta: { locality: "Atlanta", region: "GA", country: "US", postalCode: "30303" },
  "los angeles": { locality: "Los Angeles", region: "CA", country: "US", postalCode: "90012" },
  "san diego": { locality: "San Diego", region: "CA", country: "US", postalCode: "92101" },
  washington: { locality: "Washington", region: "DC", country: "US", postalCode: "20001" },
  raleigh: { locality: "Raleigh", region: "NC", country: "US", postalCode: "27601" },
  durham: { locality: "Durham", region: "NC", country: "US", postalCode: "27701" },
  charlotte: { locality: "Charlotte", region: "NC", country: "US", postalCode: "28202" },
  phoenix: { locality: "Phoenix", region: "AZ", country: "US", postalCode: "85001" },
  tempe: { locality: "Tempe", region: "AZ", country: "US", postalCode: "85281" },
  scottsdale: { locality: "Scottsdale", region: "AZ", country: "US", postalCode: "85251" },
  "salt lake city": { locality: "Salt Lake City", region: "UT", country: "US", postalCode: "84101" },
  miami: { locality: "Miami", region: "FL", country: "US", postalCode: "33101" },
  philadelphia: { locality: "Philadelphia", region: "PA", country: "US", postalCode: "19102" },
  pittsburgh: { locality: "Pittsburgh", region: "PA", country: "US", postalCode: "15219" },
  minneapolis: { locality: "Minneapolis", region: "MN", country: "US", postalCode: "55401" },

  // Indian Tech Hubs
  bangalore: { locality: "Bangalore", region: "Karnataka", country: "IN", postalCode: "560001" },
  bengaluru: { locality: "Bengaluru", region: "Karnataka", country: "IN", postalCode: "560001" },
  mumbai: { locality: "Mumbai", region: "Maharashtra", country: "IN", postalCode: "400001" },
  delhi: { locality: "Delhi", region: "Delhi", country: "IN", postalCode: "110001" },
  "new delhi": { locality: "New Delhi", region: "Delhi", country: "IN", postalCode: "110001" },
  gurgaon: { locality: "Gurgaon", region: "Haryana", country: "IN", postalCode: "122001" },
  gurugram: { locality: "Gurugram", region: "Haryana", country: "IN", postalCode: "122001" },
  noida: { locality: "Noida", region: "Uttar Pradesh", country: "IN", postalCode: "201301" },
  hyderabad: { locality: "Hyderabad", region: "Telangana", country: "IN", postalCode: "500081" },
  pune: { locality: "Pune", region: "Maharashtra", country: "IN", postalCode: "411001" },
  chennai: { locality: "Chennai", region: "Tamil Nadu", country: "IN", postalCode: "600001" },
  kolkata: { locality: "Kolkata", region: "West Bengal", country: "IN", postalCode: "700001" },
  bhubaneswar: { locality: "Bhubaneswar", region: "Odisha", country: "IN", postalCode: "751001" },
  bbsr: { locality: "Bhubaneswar", region: "Odisha", country: "IN", postalCode: "751001" },
  ahmedabad: { locality: "Ahmedabad", region: "Gujarat", country: "IN", postalCode: "380001" },
  kochi: { locality: "Kochi", region: "Kerala", country: "IN", postalCode: "682001" },
  chandigarh: { locality: "Chandigarh", region: "Chandigarh", country: "IN", postalCode: "160017" },
  jaipur: { locality: "Jaipur", region: "Rajasthan", country: "IN", postalCode: "302001" },
  indore: { locality: "Indore", region: "Madhya Pradesh", country: "IN", postalCode: "452001" },

  // International Hubs
  london: { locality: "London", region: "Greater London", country: "GB", postalCode: "EC1A 1BB" },
  manchester: { locality: "Manchester", region: "Greater Manchester", country: "GB", postalCode: "M1 1AE" },
  birmingham: { locality: "Birmingham", region: "West Midlands", country: "GB", postalCode: "B1 1BB" },
  edinburgh: { locality: "Edinburgh", region: "Scotland", country: "GB", postalCode: "EH1 1YZ" },
  dublin: { locality: "Dublin", region: "Leinster", country: "IE", postalCode: "D02" },
  berlin: { locality: "Berlin", region: "Berlin", country: "DE", postalCode: "10115" },
  munich: { locality: "Munich", region: "Bavaria", country: "DE", postalCode: "80331" },
  frankfurt: { locality: "Frankfurt", region: "Hesse", country: "DE", postalCode: "60311" },
  amsterdam: { locality: "Amsterdam", region: "North Holland", country: "NL", postalCode: "1012" },
  paris: { locality: "Paris", region: "Île-de-France", country: "FR", postalCode: "75001" },
  toronto: { locality: "Toronto", region: "Ontario", country: "CA", postalCode: "M5H 2N2" },
  vancouver: { locality: "Vancouver", region: "British Columbia", country: "CA", postalCode: "V6B 1A1" },
  montreal: { locality: "Montreal", region: "Quebec", country: "CA", postalCode: "H3B 1A7" },
  sydney: { locality: "Sydney", region: "New South Wales", country: "AU", postalCode: "2000" },
  melbourne: { locality: "Melbourne", region: "Victoria", country: "AU", postalCode: "3000" },
  singapore: { locality: "Singapore", region: "Singapore", country: "SG", postalCode: "018989" },
  dubai: { locality: "Dubai", region: "Dubai", country: "AE", postalCode: "00000" },
  tokyo: { locality: "Tokyo", region: "Tokyo", country: "JP", postalCode: "100-0001" },
  zurich: { locality: "Zurich", region: "Zurich", country: "CH", postalCode: "8001" },
};

export interface ParsedLocation {
  isRemote: boolean;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
  streetAddress: string;
  postalCode: string;
}

/**
 * Helper to parse or infer address components (locality, region, country, street, postalCode)
 * satisfying Google Search Console JobPostings structured data requirements.
 */
export function parseLocation(locationStr?: string): ParsedLocation {
  const loc = (locationStr || "").trim();
  const lower = loc.toLowerCase();

  const isRemote = lower.includes("remote") || lower.includes("anywhere") || loc === "";

  if (isRemote) {
    const isIndia = lower.includes("india") || lower.includes("in");
    const isUk = lower.includes("uk") || lower.includes("london") || lower.includes("united kingdom");
    const isGermany = lower.includes("germany") || lower.includes("deutschland");

    let country = "US";
    let postalCode = "94105";

    if (isIndia) {
      country = "IN";
      postalCode = "560001";
    } else if (isUk) {
      country = "GB";
      postalCode = "EC1A 1BB";
    } else if (isGermany) {
      country = "DE";
      postalCode = "10115";
    }

    return {
      isRemote: true,
      addressLocality: "Remote",
      addressRegion: "Remote",
      addressCountry: country,
      streetAddress: "Remote / Flexible",
      postalCode,
    };
  }

  // 1. Extract explicit postal/ZIP code if present in the string
  let extractedPostalCode = "";
  const zipMatch =
    loc.match(/\b\d{5}(?:-\d{4})?\b/) ||
    loc.match(/\b\d{6}\b/) ||
    loc.match(/\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\b/i) ||
    loc.match(/\b[A-Z]\d[A-Z] ?\d[A-Z]\d\b/i);

  if (zipMatch) {
    extractedPostalCode = zipMatch[0].trim();
  }

  // Remove extracted zip and clean commas
  const cleanedLoc = loc
    .replace(extractedPostalCode, "")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleanedLoc
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  let addressLocality = parts[0] || "City Center";
  let addressRegion = parts[0] || "City Center";
  let addressCountry = "US";
  let streetAddress = "City Center";
  let postalCode = extractedPostalCode;

  // 2. Direct city match in known tech hubs
  const cityKey = addressLocality.toLowerCase();
  const mappedCity = CITY_POSTAL_MAP[cityKey];

  if (mappedCity) {
    addressLocality = mappedCity.locality;
    addressRegion = mappedCity.region;
    addressCountry = mappedCity.country;
    if (!postalCode) {
      postalCode = mappedCity.postalCode;
    }
  }

  // 3. Evaluate multi-part strings (e.g. "Portland, OR" or "San Francisco, CA, USA")
  if (parts.length === 2) {
    const secondPart = parts[1].trim();
    const secondUpper = secondPart.toUpperCase();

    // Check if second part is a US state code (e.g. "OR", "CA", "WA", "NY")
    if (US_STATES[secondUpper]) {
      addressLocality = parts[0];
      addressRegion = secondUpper;
      addressCountry = "US";
      if (!postalCode) {
        postalCode = mappedCity?.postalCode || US_STATES[secondUpper].zip;
      }
    } else {
      // Check full US state name (e.g. "Oregon", "California")
      const foundState = Object.entries(US_STATES).find(
        ([, s]) => s.name.toLowerCase() === secondPart.toLowerCase()
      );
      if (foundState) {
        addressLocality = parts[0];
        addressRegion = foundState[0];
        addressCountry = "US";
        if (!postalCode) {
          postalCode = mappedCity?.postalCode || foundState[1].zip;
        }
      } else {
        // Otherwise, second part is a country or region (e.g. "Bangalore, India")
        addressLocality = parts[0];
        addressRegion = mappedCity?.region || parts[0];
        const secondLower = secondPart.toLowerCase();
        if (
          secondLower.includes("india") ||
          secondLower === "in" ||
          lower.includes("india")
        ) {
          addressCountry = "IN";
          if (!postalCode) postalCode = mappedCity?.postalCode || "560001";
        } else if (
          secondLower.includes("uk") ||
          secondLower.includes("united kingdom") ||
          secondLower.includes("england")
        ) {
          addressCountry = "GB";
          if (!postalCode) postalCode = mappedCity?.postalCode || "EC1A 1BB";
        } else if (secondLower.includes("germany") || secondLower.includes("deutschland")) {
          addressCountry = "DE";
          if (!postalCode) postalCode = mappedCity?.postalCode || "10115";
        } else if (secondLower.includes("canada")) {
          addressCountry = "CA";
          if (!postalCode) postalCode = mappedCity?.postalCode || "M5H 2N2";
        } else if (
          secondLower.includes("us") ||
          secondLower.includes("usa") ||
          secondLower.includes("united states")
        ) {
          addressCountry = "US";
          if (!postalCode) postalCode = mappedCity?.postalCode || "94105";
        }
      }
    }
  } else if (parts.length >= 3) {
    // e.g. "San Francisco, CA, USA" or "Bangalore, Karnataka, India"
    const statePart = parts[1].trim();
    const stateUpper = statePart.toUpperCase();
    const countryPart = parts[2].trim().toLowerCase();

    addressLocality = parts[0];
    addressRegion = statePart;

    if (US_STATES[stateUpper]) {
      addressRegion = stateUpper;
      addressCountry = "US";
      if (!postalCode) {
        postalCode = mappedCity?.postalCode || US_STATES[stateUpper].zip;
      }
    }

    if (countryPart.includes("india") || countryPart === "in") {
      addressCountry = "IN";
      if (!postalCode) postalCode = mappedCity?.postalCode || "560001";
    } else if (
      countryPart.includes("uk") ||
      countryPart.includes("united kingdom") ||
      countryPart.includes("england")
    ) {
      addressCountry = "GB";
      if (!postalCode) postalCode = mappedCity?.postalCode || "EC1A 1BB";
    } else if (countryPart.includes("germany") || countryPart.includes("deutschland")) {
      addressCountry = "DE";
      if (!postalCode) postalCode = mappedCity?.postalCode || "10115";
    } else if (countryPart.includes("canada")) {
      addressCountry = "CA";
      if (!postalCode) postalCode = mappedCity?.postalCode || "M5H 2N2";
    } else if (
      countryPart.includes("us") ||
      countryPart.includes("usa") ||
      countryPart.includes("united states")
    ) {
      addressCountry = "US";
      if (!postalCode) postalCode = mappedCity?.postalCode || "94105";
    }
  }

  // 4. Country/Region normalization for standalone terms
  if (
    lower.includes("bangalore") ||
    lower.includes("bengaluru") ||
    lower.includes("mumbai") ||
    lower.includes("delhi") ||
    lower.includes("hyderabad") ||
    lower.includes("chennai") ||
    lower.includes("pune") ||
    lower.includes("india") ||
    lower.includes("gurgaon") ||
    lower.includes("noida") ||
    lower.includes("bhubaneswar") ||
    lower.includes("bbsr")
  ) {
    addressCountry = "IN";
    if (addressRegion === "Remote" || addressRegion === addressLocality || !addressRegion) {
      if (lower.includes("bangalore") || lower.includes("bengaluru")) addressRegion = "Karnataka";
      else if (lower.includes("mumbai") || lower.includes("pune")) addressRegion = "Maharashtra";
      else if (lower.includes("delhi") || lower.includes("gurgaon") || lower.includes("noida")) addressRegion = "Delhi NCR";
      else if (lower.includes("hyderabad")) addressRegion = "Telangana";
      else if (lower.includes("chennai")) addressRegion = "Tamil Nadu";
      else if (lower.includes("bhubaneswar") || lower.includes("bbsr")) addressRegion = "Odisha";
      else addressRegion = "Karnataka";
    }
    if (!postalCode) {
      postalCode = mappedCity?.postalCode || "560001";
    }
  } else if (
    lower.includes("london") ||
    lower.includes("uk") ||
    lower.includes("united kingdom") ||
    lower.includes("england")
  ) {
    addressCountry = "GB";
    if (addressRegion === "Remote" || addressRegion === addressLocality || !addressRegion) {
      addressRegion = "Greater London";
    }
    if (!postalCode) {
      postalCode = mappedCity?.postalCode || "EC1A 1BB";
    }
  } else if (lower.includes("germany") || lower.includes("berlin") || lower.includes("munich")) {
    addressCountry = "DE";
    if (addressRegion === "Remote" || addressRegion === addressLocality || !addressRegion) {
      addressRegion = "Berlin";
    }
    if (!postalCode) {
      postalCode = mappedCity?.postalCode || "10115";
    }
  } else if (lower.includes("canada") || lower.includes("toronto") || lower.includes("vancouver")) {
    addressCountry = "CA";
    if (!postalCode) {
      postalCode = mappedCity?.postalCode || "M5H 2N2";
    }
  } else if (
    lower.includes("us") ||
    lower.includes("usa") ||
    lower.includes("united states") ||
    lower.includes("san francisco") ||
    lower.includes("new york") ||
    lower.includes("austin") ||
    lower.includes("seattle") ||
    lower.includes("portland")
  ) {
    addressCountry = "US";
    if (!postalCode) {
      postalCode = mappedCity?.postalCode || "94105";
    }
  }

  // 5. Final fallback checks to guarantee non-empty fields
  if (!addressCountry || addressCountry.length < 2) {
    addressCountry = "US";
  }

  if (!postalCode) {
    postalCode = addressCountry === "IN" ? "560001" : "94105";
  }

  return {
    isRemote,
    addressLocality,
    addressRegion: addressRegion || addressLocality,
    addressCountry,
    streetAddress,
    postalCode,
  };
}

/**
 * Helper to parse salary from description/title or generate a realistic fallback base salary.
 */
export function parseOrEstimateSalary(title: string, description: string, locationStr?: string) {
  const text = `${title} ${description}`;
  const loc = (locationStr || "").toLowerCase();
  const isIndia = /india|bangalore|bengaluru|mumbai|pune|delhi|hyderabad|chennai|noida|gurgaon|bhubaneswar|bbsr|kolkata/i.test(loc);

  // Match patterns like $90k - $120k, $90,000 - $120,000, €60k - €80k, ₹10L - ₹15L
  const rangeMatch = text.match(
    /(\$|€|£|₹)?\s?(\d+(?:,\d{3})*|\d+)\s?(k|kilo|thousand|l|lakh)?\s?-\s?(\$|€|£|₹)?\s?(\d+(?:,\d{3})*|\d+)\s?(k|kilo|thousand|l|lakh)?/i
  );

  if (rangeMatch) {
    const symbol = rangeMatch[1] || rangeMatch[4] || (isIndia ? "₹" : "$");
    let currency = isIndia ? "INR" : "USD";
    if (symbol === "€") currency = "EUR";
    else if (symbol === "£") currency = "GBP";
    else if (symbol === "₹" || symbol === "l" || symbol === "lakh") currency = "INR";

    const parseVal = (numStr: string, unitStr?: string) => {
      let val = parseFloat(numStr.replace(/,/g, ""));
      const u = (unitStr || "").toLowerCase();
      if (u === "k" || u === "kilo" || u === "thousand") {
        val *= 1000;
      } else if (u === "l" || u === "lakh") {
        val *= 100000;
      } else if (val < 500) {
        // Shorthand without suffix like 90 - 120 ($90 - $120k / year)
        val *= 1000;
      }
      return val;
    };

    const minStr = rangeMatch[2] ?? "0";
    const maxStr = rangeMatch[5] ?? minStr;
    const min = parseVal(minStr, rangeMatch[3]);
    const max = parseVal(maxStr, rangeMatch[6]);

    if (!isNaN(min) && !isNaN(max) && min > 10000 && max >= min) {
      return { currency, minValue: min, maxValue: max, unitText: "YEAR" as const };
    }
  }

  // India estimation
  if (isIndia) {
    const t = title.toLowerCase();
    let minValue = 600000;
    let maxValue = 1400000;

    if (
      t.includes("senior") ||
      t.includes("lead") ||
      t.includes("principal") ||
      t.includes("architect") ||
      t.includes("manager") ||
      t.includes("head")
    ) {
      minValue = 1800000;
      maxValue = 3500000;
    } else if (t.includes("intern") || t.includes("junior") || t.includes("fresher") || t.includes("entry")) {
      minValue = 400000;
      maxValue = 800000;
    }

    return {
      currency: "INR",
      minValue,
      maxValue,
      unitText: "YEAR" as const,
    };
  }

  // Infer estimated base salary by title level
  const t = title.toLowerCase();
  let minValue = 70000;
  let maxValue = 110000;

  if (
    t.includes("senior") ||
    t.includes("lead") ||
    t.includes("principal") ||
    t.includes("architect") ||
    t.includes("manager") ||
    t.includes("head")
  ) {
    minValue = 120000;
    maxValue = 180000;
  } else if (
    t.includes("engineer") ||
    t.includes("developer") ||
    t.includes("scientist") ||
    t.includes("designer")
  ) {
    minValue = 85000;
    maxValue = 135000;
  } else if (t.includes("intern") || t.includes("junior")) {
    minValue = 45000;
    maxValue = 70000;
  }

  return {
    currency: "USD",
    minValue,
    maxValue,
    unitText: "YEAR" as const,
  };
}

/**
 * Build complete, Search Console-compliant JobPosting JSON-LD object.
 */
export function buildJobPostingSchema(job: ExternalJob, slug: string): JobPostingSchema {
  const postedIso = formatIsoDate(job.postedAt);
  const postedDate = new Date(postedIso);

  // Expiration 60 days after datePosted
  const validThroughDate = new Date(postedDate.getTime() + 60 * 24 * 60 * 60 * 1000);
  const validThroughIso = validThroughDate.toISOString();

  const locInfo = parseLocation(job.location);
  const salary = parseOrEstimateSalary(job.title, job.description, job.location);

  // Infer employment type if specified
  const descLower = `${job.title} ${job.description}`.toLowerCase();
  let employmentType = "FULL_TIME";
  if (descLower.includes("part-time") || descLower.includes("part time")) {
    employmentType = "PART_TIME";
  } else if (descLower.includes("contract") || descLower.includes("freelance")) {
    employmentType = "CONTRACTOR";
  } else if (descLower.includes("internship") || descLower.includes("intern")) {
    employmentType = "INTERN";
  }

  const schema: JobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: postedIso,
    validThrough: validThroughIso,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company || "DecaJobs Partner",
      sameAs: "https://decajob.com",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: locInfo.streetAddress,
        addressLocality: locInfo.addressLocality,
        addressRegion: locInfo.addressRegion,
        postalCode: locInfo.postalCode,
        addressCountry: locInfo.addressCountry,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: salary.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: salary.minValue,
        maxValue: salary.maxValue,
        unitText: salary.unitText,
      },
    },
    directApply: false,
    url: `https://decajob.com/jobs/${slug}`,
  };

  if (locInfo.isRemote) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: locInfo.addressCountry === "IN" ? "India" : "USA",
    };
  }

  return schema;
}
