import { render } from "@react-email/components";
import { createElement } from "react";
import { describe, it, expect } from "vitest";
import { DailyDigestEmail, DigestJob } from "./daily-digest";

const sampleJobs: DigestJob[] = Array.from({ length: 10 }, (_, i) => ({
  title: `Software Engineer ${i + 1}`,
  description: `This is a job description for position ${i + 1} that is long enough to test truncation when it exceeds one hundred and fifty characters in length to verify the excerpt logic works properly.`,
  location: i % 2 === 0 ? "Remote" : "New York, NY",
  applicationLink: `https://example.com/jobs/${i + 1}`,
}));

function renderDigest(props: {
  jobs: DigestJob[];
  date?: string;
  unsubscribeUrl: string;
  preferencesUrl?: string;
}) {
  return render(createElement(DailyDigestEmail, props));
}

describe("DailyDigestEmail", () => {
  it("renders without errors", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
      preferencesUrl: "https://example.com/settings",
    });

    expect(html).toBeDefined();
    expect(html.length).toBeGreaterThan(0);
  });

  it("includes header with title and date", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).toContain("Your DecaJobs Daily 10");
    expect(html).toContain("Monday, January 15, 2024");
  });

  it("renders all 10 job cards with titles and application links", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    for (let i = 0; i < 10; i++) {
      expect(html).toContain(`Software Engineer ${i + 1}`);
      expect(html).toContain(`https://example.com/jobs/${i + 1}`);
    }
    expect(html).toContain("Apply Now");
  });

  it("renders location badges", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).toContain("Remote");
    expect(html).toContain("New York, NY");
  });

  it("truncates descriptions longer than 150 characters", async () => {
    const longDescription =
      "A".repeat(200) + " this text should not appear in the output";
    const jobs: DigestJob[] = [
      {
        title: "Test Job",
        description: longDescription,
        location: "Remote",
        applicationLink: "https://example.com/apply",
      },
    ];

    const html = await renderDigest({
      jobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).not.toContain("this text should not appear in the output");
  });

  it("does not truncate descriptions of 150 characters or fewer", async () => {
    const shortDescription = "This is a short job description.";
    const jobs: DigestJob[] = [
      {
        title: "Test Job",
        description: shortDescription,
        location: "Remote",
        applicationLink: "https://example.com/apply",
      },
    ];

    const html = await renderDigest({
      jobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).toContain(shortDescription);
  });

  it("includes unsubscribe link in footer", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).toContain("https://example.com/unsubscribe/token123");
    expect(html).toContain("Unsubscribe");
  });

  it("includes preferences link when provided", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
      preferencesUrl: "https://example.com/settings",
    });

    expect(html).toContain("https://example.com/settings");
    expect(html).toContain("Email Preferences");
  });

  it("omits preferences link when not provided", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).not.toContain("Email Preferences");
  });

  it("uses the brand blue color #2563eb", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).toContain("#2563eb");
  });

  it("has max-width of 600px for responsive layout", async () => {
    const html = await renderDigest({
      jobs: sampleJobs,
      date: "Monday, January 15, 2024",
      unsubscribeUrl: "https://example.com/unsubscribe/token123",
    });

    expect(html).toContain("600px");
  });
});
