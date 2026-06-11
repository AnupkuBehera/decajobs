-- Migration: Add verification_token and verification_expires_at to employers table
-- Requirements: 3.1, 3.2, 3.3, 3.4
-- These columns support custom email verification flow for employers
-- with token-based verification and 24-hour expiration.

ALTER TABLE employers
  ADD COLUMN verification_token UUID,
  ADD COLUMN verification_expires_at TIMESTAMPTZ;

-- Index on verification_token for fast lookups during verification
CREATE INDEX idx_employers_verification_token
  ON employers (verification_token)
  WHERE verification_token IS NOT NULL;
