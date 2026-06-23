-- Application Tracker table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  company text NOT NULL,
  job_url text,
  status text NOT NULL DEFAULT 'applied',
  notes text DEFAULT '',
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- status values: 'applied', 'interview', 'offer', 'rejected', 'saved'
CREATE INDEX idx_job_applications_candidate ON job_applications(candidate_id, applied_at DESC);

-- RLS for application tracker
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_applications" ON job_applications FOR ALL USING (candidate_id = auth.uid());

-- Referral system
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES candidates(id),
  ADD COLUMN IF NOT EXISTS referral_bonus_days integer DEFAULT 0;

-- Create unique referral codes for existing users
UPDATE candidates SET referral_code = substr(md5(id::text || now()::text), 1, 8) WHERE referral_code IS NULL;
