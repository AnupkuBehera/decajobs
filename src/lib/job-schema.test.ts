import { describe, it, expect } from "vitest";
import {
  formatIsoDate,
  parseLocation,
  parseOrEstimateSalary,
  buildJobPostingSchema,
} from "./job-schema";
import type { ExternalJob } from "./external-jobs/types";

describe("JobPosting Schema Generator", () => {
  describe("formatIsoDate", () => {
    it("should format valid ISO string to ISO 8601 string", () => {
      const result = formatIsoDate("2026-08-10T12:00:00Z");
      expect(result).toBe("2026-08-10T12:00:00.000Z");
    });

    it("should convert numeric string timestamp to valid ISO string", () => {
      const timestamp = 1786363200; // unix timestamp in seconds
      const result = formatIsoDate(String(timestamp));
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should fallback to valid current ISO string if input is invalid or missing", () => {
      const resultInvalid = formatIsoDate("invalid-date-string");
      expect(resultInvalid).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      const resultUndefined = formatIsoDate(undefined);
      expect(resultUndefined).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("parseLocation", () => {
    it("should parse remote jobs correctly", () => {
      const res = parseLocation("Remote");
      expect(res.isRemote).toBe(true);
      expect(res.addressCountry).toBe("US");
      expect(res.streetAddress).toBe("Remote / Flexible");
      expect(res.addressRegion).toBe("Remote");
      expect(res.addressLocality).toBe("Remote");
    });

    it("should parse city/country locations like Bangalore, India", () => {
      const res = parseLocation("Bangalore, India");
      expect(res.isRemote).toBe(false);
      expect(res.addressCountry).toBe("IN");
      expect(res.addressRegion).toBe("Karnataka");
      expect(res.addressLocality).toBe("Bangalore");
      expect(res.streetAddress).toBe("City Center");
    });

    it("should parse San Francisco, CA, USA", () => {
      const res = parseLocation("San Francisco, CA, USA");
      expect(res.isRemote).toBe(false);
      expect(res.addressCountry).toBe("US");
      expect(res.addressRegion).toBe("CA");
      expect(res.addressLocality).toBe("San Francisco");
      expect(res.streetAddress).toBe("City Center");
    });
  });

  describe("parseOrEstimateSalary", () => {
    it("should parse salary ranges from description", () => {
      const salary = parseOrEstimateSalary("Frontend Engineer", "Salary range is $100,000 - $140,000 per year.");
      expect(salary.currency).toBe("USD");
      expect(salary.minValue).toBe(100000);
      expect(salary.maxValue).toBe(140000);
      expect(salary.unitText).toBe("YEAR");
    });

    it("should parse shorthand salary ranges like $90k - $120k", () => {
      const salary = parseOrEstimateSalary("Developer", "Compensation: $90k - $120k");
      expect(salary.currency).toBe("USD");
      expect(salary.minValue).toBe(90000);
      expect(salary.maxValue).toBe(120000);
    });

    it("should fallback to role-based salary estimations if not mentioned", () => {
      const salary = parseOrEstimateSalary("Senior Software Engineer", "Great tech stack with React and Node.");
      expect(salary.currency).toBe("USD");
      expect(salary.minValue).toBe(120000);
      expect(salary.maxValue).toBe(180000);
    });
  });

  describe("buildJobPostingSchema", () => {
    const mockJob: ExternalJob = {
      id: "job-123",
      title: "Senior Full Stack Engineer",
      company: "Acme Corp",
      description: "We are looking for a Senior Full Stack Engineer. Pay range is $130,000 - $170,000.",
      location: "Bangalore, India",
      applicationLink: "https://example.com/apply",
      postedAt: "2026-08-01T10:00:00Z",
      source: "remotive",
    };

    it("should build a complete JobPosting schema resolving all Search Console issues", () => {
      const schema = buildJobPostingSchema(mockJob, "senior-full-stack-engineer-job-123");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("JobPosting");
      expect(schema.title).toBe("Senior Full Stack Engineer");
      
      // 1. datePosted in ISO 8601 format
      expect(schema.datePosted).toBe("2026-08-01T10:00:00.000Z");

      // 2. validThrough present in ISO 8601 format
      expect(schema.validThrough).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      // 3, 4, 6. Address fields (addressCountry, streetAddress, addressRegion)
      expect(schema.jobLocation.address.addressCountry).toBe("IN");
      expect(schema.jobLocation.address.addressRegion).toBe("Karnataka");
      expect(schema.jobLocation.address.streetAddress).toBe("City Center");
      expect(schema.jobLocation.address.addressLocality).toBe("Bangalore");

      // 5. baseSalary present
      expect(schema.baseSalary["@type"]).toBe("MonetaryAmount");
      expect(schema.baseSalary.currency).toBe("USD");
      expect(schema.baseSalary.value.minValue).toBe(130000);
      expect(schema.baseSalary.value.maxValue).toBe(170000);
      expect(schema.baseSalary.value.unitText).toBe("YEAR");

      expect(schema.url).toBe("https://decajob.com/jobs/senior-full-stack-engineer-job-123");
    });

    it("should properly configure telecommute properties for remote jobs", () => {
      const remoteJob: ExternalJob = {
        ...mockJob,
        location: "Remote",
      };

      const schema = buildJobPostingSchema(remoteJob, "senior-full-stack-engineer-job-123");

      expect(schema.jobLocationType).toBe("TELECOMMUTE");
      expect(schema.applicantLocationRequirements).toEqual({
        "@type": "Country",
        name: "USA",
      });
      expect(schema.jobLocation.address.addressCountry).toBe("US");
      expect(schema.jobLocation.address.streetAddress).toBe("Remote / Flexible");
    });
  });
});
