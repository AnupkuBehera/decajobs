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
 * Helper to parse or infer address components (locality, region, country, street).
 */
export function parseLocation(locationStr?: string) {
  const loc = (locationStr || "").trim();
  const lower = loc.toLowerCase();

  const isRemote = lower.includes("remote") || lower.includes("anywhere") || loc === "";

  let addressLocality = "Remote";
  let addressRegion = "Remote";
  let addressCountry = "US";
  let streetAddress = "Remote / Flexible";

  if (!isRemote) {
    const parts = loc.split(",").map((p) => p.trim()).filter(Boolean);
    addressLocality = parts[0] || "City Center";
    streetAddress = "City Center";

    if (parts.length > 2) {
      addressRegion = parts[1] || addressLocality;
      addressCountry = parts[2] || "US";
    } else if (parts.length === 2) {
      addressRegion = parts[0] || addressLocality;
      addressCountry = parts[1] || "US";
    } else {
      addressRegion = parts[0] || addressLocality;
    }
  }

  // Normalize / infer country and state if known
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
    lower.includes("noida")
  ) {
    addressCountry = "IN";
    if (addressRegion === "Remote" || addressRegion === addressLocality) {
      if (lower.includes("bangalore") || lower.includes("bengaluru")) addressRegion = "Karnataka";
      else if (lower.includes("mumbai") || lower.includes("pune")) addressRegion = "Maharashtra";
      else if (lower.includes("delhi") || lower.includes("gurgaon") || lower.includes("noida")) addressRegion = "Delhi NCR";
      else if (lower.includes("hyderabad")) addressRegion = "Telangana";
      else if (lower.includes("chennai")) addressRegion = "Tamil Nadu";
    }
  } else if (
    lower.includes("london") ||
    lower.includes("uk") ||
    lower.includes("united kingdom") ||
    lower.includes("england")
  ) {
    addressCountry = "GB";
    if (addressRegion === "Remote" || addressRegion === addressLocality) addressRegion = "Greater London";
  } else if (lower.includes("germany") || lower.includes("berlin") || lower.includes("munich")) {
    addressCountry = "DE";
    if (addressRegion === "Remote" || addressRegion === addressLocality) addressRegion = "Berlin";
  } else if (lower.includes("canada") || lower.includes("toronto") || lower.includes("vancouver")) {
    addressCountry = "CA";
  } else if (
    lower.includes("us") ||
    lower.includes("usa") ||
    lower.includes("united states") ||
    lower.includes("san francisco") ||
    lower.includes("new york") ||
    lower.includes("austin") ||
    lower.includes("seattle")
  ) {
    addressCountry = "US";
  }

  // Ensure addressCountry is never undefined or empty
  if (!addressCountry || addressCountry.length < 2) {
    addressCountry = "US";
  }

  return {
    isRemote,
    addressLocality,
    addressRegion: addressRegion || addressLocality,
    addressCountry,
    streetAddress,
  };
}

/**
 * Helper to parse salary from description/title or generate a realistic fallback base salary.
 */
export function parseOrEstimateSalary(title: string, description: string) {
  const text = `${title} ${description}`;

  // Match patterns like $90k - $120k, $90,000 - $120,000, €60k - €80k, ₹10L - ₹15L
  const rangeMatch = text.match(
    /(\$|€|£|₹)?\s?(\d+(?:,\d{3})*|\d+)\s?(k|kilo|thousand|l|lakh)?\s?-\s?(\$|€|£|₹)?\s?(\d+(?:,\d{3})*|\d+)\s?(k|kilo|thousand|l|lakh)?/i
  );

  if (rangeMatch) {
    const symbol = rangeMatch[1] || rangeMatch[4] || "$";
    let currency = "USD";
    if (symbol === "€") currency = "EUR";
    else if (symbol === "£") currency = "GBP";
    else if (symbol === "₹") currency = "INR";

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
  const salary = parseOrEstimateSalary(job.title, job.description);

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
