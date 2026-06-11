-- ============================================================
-- FULL DATABASE MIGRATION FOR DECAJOBS
-- Run this entire script in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- ============================================================
-- Table: candidates
-- ============================================================
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  preferred_delivery_time text NOT NULL DEFAULT '07:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: candidate_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  target_titles text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  location text NOT NULL DEFAULT '',
  resume_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: employers
-- ============================================================
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  company_name text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: job_listings
-- ============================================================
CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  application_link text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  CONSTRAINT job_listings_title_length CHECK (char_length(title) BETWEEN 5 AND 100),
  CONSTRAINT job_listings_description_length CHECK (char_length(description) BETWEEN 50 AND 5000)
);

-- ============================================================
-- Table: digest_history
-- ============================================================
CREATE TABLE IF NOT EXISTS digest_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_listing_id uuid NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  sent_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_digest_history_candidate_sent_at
  ON digest_history (candidate_id, sent_at);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_history ENABLE ROW LEVEL SECURITY;

-- Candidates: users can access their own record
CREATE POLICY "candidates_select_own" ON candidates FOR SELECT USING (id = auth.uid());
CREATE POLICY "candidates_update_own" ON candidates FOR UPDATE USING (id = auth.uid());
CREATE POLICY "candidates_insert_own" ON candidates FOR INSERT WITH CHECK (id = auth.uid());

-- Candidate Profiles: accessible only by owning candidate
CREATE POLICY "candidate_profiles_select_own" ON candidate_profiles FOR SELECT USING (candidate_id = auth.uid());
CREATE POLICY "candidate_profiles_insert_own" ON candidate_profiles FOR INSERT WITH CHECK (candidate_id = auth.uid());
CREATE POLICY "candidate_profiles_update_own" ON candidate_profiles FOR UPDATE USING (candidate_id = auth.uid());
CREATE POLICY "candidate_profiles_delete_own" ON candidate_profiles FOR DELETE USING (candidate_id = auth.uid());

-- Employers: users can access their own record
CREATE POLICY "employers_select_own" ON employers FOR SELECT USING (id = auth.uid());
CREATE POLICY "employers_update_own" ON employers FOR UPDATE USING (id = auth.uid());
CREATE POLICY "employers_insert_own" ON employers FOR INSERT WITH CHECK (id = auth.uid());

-- Job Listings: employers manage their own; authenticated can read active
CREATE POLICY "job_listings_select_active" ON job_listings FOR SELECT USING (is_active = true);
CREATE POLICY "job_listings_select_own" ON job_listings FOR SELECT USING (employer_id = auth.uid());
CREATE POLICY "job_listings_insert_own" ON job_listings FOR INSERT WITH CHECK (employer_id = auth.uid());
CREATE POLICY "job_listings_update_own" ON job_listings FOR UPDATE USING (employer_id = auth.uid());
CREATE POLICY "job_listings_delete_own" ON job_listings FOR DELETE USING (employer_id = auth.uid());

-- Digest History: candidates can read their own
CREATE POLICY "digest_history_select_own" ON digest_history FOR SELECT USING (candidate_id = auth.uid());

-- ============================================================
-- Auto-create candidate record on first auth signup
-- This trigger creates a row in `candidates` when a new user signs up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.candidates (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
