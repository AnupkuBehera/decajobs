-- Add designation and expected_salary fields to candidate_profiles
ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS designation text DEFAULT '',
  ADD COLUMN IF NOT EXISTS expected_salary text DEFAULT '';
