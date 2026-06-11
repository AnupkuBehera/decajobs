import { describe, it, expect } from "vitest";
import {
  generateUnsubscribeToken,
  decodeUnsubscribeToken,
  buildUnsubscribeUrl,
} from "./token";

describe("unsubscribe token utilities", () => {
  const validUuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  describe("generateUnsubscribeToken", () => {
    it("produces a base64url-encoded string from a candidate ID", () => {
      const token = generateUnsubscribeToken(validUuid);
      expect(token).toBeTruthy();
      // base64url should not contain +, /, or = characters
      expect(token).not.toMatch(/[+/=]/);
    });

    it("produces different tokens for different IDs", () => {
      const otherId = "11111111-2222-3333-4444-555555555555";
      const token1 = generateUnsubscribeToken(validUuid);
      const token2 = generateUnsubscribeToken(otherId);
      expect(token1).not.toBe(token2);
    });
  });

  describe("decodeUnsubscribeToken", () => {
    it("round-trips a valid UUID through encode/decode", () => {
      const token = generateUnsubscribeToken(validUuid);
      const decoded = decodeUnsubscribeToken(token);
      expect(decoded).toBe(validUuid);
    });

    it("returns null for a non-UUID payload", () => {
      const token = Buffer.from("not-a-uuid", "utf-8").toString("base64url");
      expect(decodeUnsubscribeToken(token)).toBeNull();
    });

    it("returns null for an empty string", () => {
      expect(decodeUnsubscribeToken("")).toBeNull();
    });

    it("returns null for malformed base64", () => {
      expect(decodeUnsubscribeToken("!!!invalid!!!")).toBeNull();
    });
  });

  describe("buildUnsubscribeUrl", () => {
    it("builds a full URL with the encoded token", () => {
      const url = buildUnsubscribeUrl(validUuid, "https://example.com");
      const expectedToken = generateUnsubscribeToken(validUuid);
      expect(url).toBe(`https://example.com/api/unsubscribe/${expectedToken}`);
    });

    it("uses provided base URL over env variable", () => {
      const url = buildUnsubscribeUrl(validUuid, "https://myapp.dev");
      expect(url).toContain("https://myapp.dev/api/unsubscribe/");
    });
  });
});
