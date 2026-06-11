-- Migration: Ensure candidate record creation on new user signup (idempotent)
-- Requirements: 1.5
-- This migration ensures the trigger and function exist for creating a candidate
-- record when a new user signs up via auth.users. It is safe to re-run.

-- Function to handle new user creation (create candidate record)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.candidates (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop and re-create trigger to ensure it's properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure the fallback INSERT policy exists for edge-case handling
-- (user exists in auth but not in candidates, callback creates the record)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'candidates'
      AND policyname = 'candidates_insert_own'
  ) THEN
    CREATE POLICY "candidates_insert_own"
      ON candidates FOR INSERT
      WITH CHECK (id = auth.uid());
  END IF;
END
$$;
