-- Migration: Create digest_history table
-- Tracks which job listings have been sent to candidates in daily digests
-- to prevent duplicate recommendations within a 3-day window.

CREATE TABLE IF NOT EXISTS digest_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL,
  job_listing_id uuid NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fk_digest_history_candidate
    FOREIGN KEY (candidate_id)
    REFERENCES candidates (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_digest_history_job_listing
    FOREIGN KEY (job_listing_id)
    REFERENCES job_listings (id)
    ON DELETE CASCADE
);

-- Index for efficient lookups of recent digest history per candidate
CREATE INDEX idx_digest_history_candidate_sent_at
  ON digest_history (candidate_id, sent_at);
