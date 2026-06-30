-- Add career coach usage tracking fields to candidates table
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS coach_usage_date text,
  ADD COLUMN IF NOT EXISTS coach_usage_count integer DEFAULT 0;

-- coach_usage_date: stores the date (YYYY-MM-DD) of last usage
-- coach_usage_count: number of questions asked today (resets when date changes)
