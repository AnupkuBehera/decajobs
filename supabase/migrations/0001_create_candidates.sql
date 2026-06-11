-- Migration: Create candidates and candidate_profiles tables
-- Requirements: 11.1, 11.2, 11.6

-- Create candidates table
CREATE TABLE candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  preferred_delivery_time text NOT NULL DEFAULT '07:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create candidate_profiles table
CREATE TABLE candidate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  target_titles text[] NOT NULL,
  skills text[] NOT NULL,
  location text NOT NULL,
  resume_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
