-- Migration: Enable Row Level Security and create access policies
-- Requirements: 12.1, 12.2

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Candidates: users can only access their own record
-- ============================================================
CREATE POLICY "candidates_select_own"
  ON candidates FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "candidates_update_own"
  ON candidates FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- Candidate Profiles: accessible only by the owning candidate
-- ============================================================
CREATE POLICY "candidate_profiles_select_own"
  ON candidate_profiles FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "candidate_profiles_insert_own"
  ON candidate_profiles FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "candidate_profiles_update_own"
  ON candidate_profiles FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "candidate_profiles_delete_own"
  ON candidate_profiles FOR DELETE
  USING (candidate_id = auth.uid());

-- ============================================================
-- Employers: users can only access their own record
-- ============================================================
CREATE POLICY "employers_select_own"
  ON employers FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "employers_update_own"
  ON employers FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- Job Listings: employers manage their own; authenticated users
-- can read active listings
-- ============================================================

-- Authenticated users can read active job listings
CREATE POLICY "job_listings_select_active"
  ON job_listings FOR SELECT
  USING (is_active = true AND auth.role() = 'authenticated');

-- Employers can see all their own listings (including inactive)
CREATE POLICY "job_listings_select_own"
  ON job_listings FOR SELECT
  USING (employer_id = auth.uid());

-- Employers can insert their own listings
CREATE POLICY "job_listings_insert_own"
  ON job_listings FOR INSERT
  WITH CHECK (employer_id = auth.uid());

-- Employers can update their own listings
CREATE POLICY "job_listings_update_own"
  ON job_listings FOR UPDATE
  USING (employer_id = auth.uid());

-- Employers can delete their own listings
CREATE POLICY "job_listings_delete_own"
  ON job_listings FOR DELETE
  USING (employer_id = auth.uid());

-- ============================================================
-- Digest History: candidates can read their own history
-- (Service role bypasses RLS automatically for matching engine)
-- ============================================================
CREATE POLICY "digest_history_select_own"
  ON digest_history FOR SELECT
  USING (candidate_id = auth.uid());
