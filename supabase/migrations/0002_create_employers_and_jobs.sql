-- Migration: Create employers and job_listings tables
-- Requirements: 11.3, 11.4, 11.6

-- ============================================================
-- Table: employers
-- ============================================================
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  company_name TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Table: job_listings
-- ============================================================
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  application_link TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),

  CONSTRAINT job_listings_title_length CHECK (char_length(title) BETWEEN 5 AND 100),
  CONSTRAINT job_listings_description_length CHECK (char_length(description) BETWEEN 50 AND 5000)
);
