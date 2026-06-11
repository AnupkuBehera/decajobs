-- Migration: Create candidate record automatically on new user signup
-- Requirements: 1.5
-- Creates a trigger on auth.users that inserts into candidates table on first login.
-- Also adds an INSERT policy so the auth callback edge-case fallback can create
-- a candidate record if the trigger didn't fire.

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.candidates (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger that fires after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Allow authenticated users to insert their own candidate record (edge-case fallback)
CREATE POLICY "candidates_insert_own"
  ON candidates FOR INSERT
  WITH CHECK (id = auth.uid());
