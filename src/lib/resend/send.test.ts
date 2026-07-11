/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the resend client module
vi.mock("./client", () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
  FROM_EMAIL: "DecaJobs <noreply@decajobs.com>",
}));

// Mock React email templates
vi.mock("@/emails/daily-digest", () => ({
  DailyDigestEmail: vi.fn(() => null),
}));

vi.mock("@/emails/magic-link", () => ({
  MagicLinkEmail: vi.fn(() => null),
}));

vi.mock("@/emails/employer-verification", () => ({
  EmployerVerificationEmail: vi.fn(() => null),
}));

import { resend } from "./client";
import { sendDigestEmail, sendMagicLink, sendVerification } from "./send";

const mockSend = vi.mocked(resend.emails.send);

function mockSuccessResponse(id: string) {
  return { data: { id }, error: null, headers: null } as any;
}

function mockErrorResponse(message: string, name: string) {
  return { data: null, error: { message, name, statusCode: 429 }, headers: null } as any;
}

describe("sendWithRetry (via email functions)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends email successfully on first attempt", async () => {
    mockSend.mockResolvedValueOnce(mockSuccessResponse("msg_123"));

    const promise = sendMagicLink("user@example.com", "https://example.com/login");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "DecaJobs <noreply@decajobs.com>",
        to: "user@example.com",
        subject: "Log in to DecaJobs",
      })
    );
  });

  it("retries on failure and succeeds on second attempt", async () => {
    mockSend
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockSuccessResponse("msg_456"));

    const promise = sendMagicLink("user@example.com", "https://example.com/login");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it("retries on Resend API error response", async () => {
    mockSend
      .mockResolvedValueOnce(mockErrorResponse("Rate limited", "rate_limit_exceeded"))
      .mockResolvedValueOnce(mockSuccessResponse("msg_789"));

    const promise = sendMagicLink("user@example.com", "https://example.com/login");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it("throws after all retries are exhausted (4 total attempts)", async () => {
    mockSend.mockImplementation(() => Promise.reject(new Error("Persistent failure")));

    const promise = sendMagicLink("user@example.com", "https://example.com/login");
    // Attach catch immediately to avoid unhandled rejection
    const caught = promise.catch((e) => e);
    await vi.runAllTimersAsync();

    const error = await caught;
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Persistent failure");
    expect(mockSend).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  it("uses exponential backoff delays (1s, 4s, 16s)", async () => {
    mockSend.mockImplementation(() => Promise.reject(new Error("Fail")));

    const promise = sendMagicLink("user@example.com", "https://example.com/login");
    // Attach catch immediately to avoid unhandled rejection
    const caught = promise.catch((e) => e);

    // After first attempt, 1s delay
    await vi.advanceTimersByTimeAsync(999);
    expect(mockSend).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(mockSend).toHaveBeenCalledTimes(2);

    // After second attempt, 4s delay
    await vi.advanceTimersByTimeAsync(3999);
    expect(mockSend).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(mockSend).toHaveBeenCalledTimes(3);

    // After third attempt, 16s delay
    await vi.advanceTimersByTimeAsync(15999);
    expect(mockSend).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(1);
    expect(mockSend).toHaveBeenCalledTimes(4);

    // Final attempt throws
    const error = await caught;
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Fail");
  });
});

describe("sendDigestEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends a digest email with Daily Digest subject when fewer than 10 jobs are provided", async () => {
    mockSend.mockResolvedValueOnce(mockSuccessResponse("msg_digest"));

    const jobs = [
      {
        title: "Software Engineer",
        description: "Build amazing things",
        location: "Remote",
        applicationLink: "https://example.com/apply",
      },
    ];

    const promise = sendDigestEmail("candidate@example.com", jobs, "a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "DecaJobs <noreply@decajobs.com>",
        to: "candidate@example.com",
        subject: expect.stringContaining("Your DecaJobs Daily Digest"),
      })
    );
  });

  it("sends a digest email with Daily 10 subject when exactly 10 jobs are provided", async () => {
    mockSend.mockResolvedValueOnce(mockSuccessResponse("msg_digest_10"));

    const jobs = Array.from({ length: 10 }, () => ({
      title: "Software Engineer",
      description: "Build amazing things",
      location: "Remote",
      applicationLink: "https://example.com/apply",
    }));

    const promise = sendDigestEmail("candidate@example.com", jobs, "a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "DecaJobs <noreply@decajobs.com>",
        to: "candidate@example.com",
        subject: expect.stringContaining("Your DecaJobs Daily 10"),
      })
    );
  });
});

describe("sendMagicLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends a magic link email with correct subject", async () => {
    mockSend.mockResolvedValueOnce(mockSuccessResponse("msg_ml"));

    const promise = sendMagicLink("user@example.com", "https://example.com/auth/callback?token=abc");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Log in to DecaJobs",
      })
    );
  });
});

describe("sendVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends a verification email with correct subject", async () => {
    mockSend.mockResolvedValueOnce(mockSuccessResponse("msg_v"));

    const promise = sendVerification("employer@example.com", "https://example.com/verify?token=xyz", "Acme Corp");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "employer@example.com",
        subject: "Verify your employer account — DecaJobs",
      })
    );
  });

  it("works without companyName parameter", async () => {
    mockSend.mockResolvedValueOnce(mockSuccessResponse("msg_v2"));

    const promise = sendVerification("employer@example.com", "https://example.com/verify?token=xyz");
    await vi.runAllTimersAsync();
    await promise;

    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
