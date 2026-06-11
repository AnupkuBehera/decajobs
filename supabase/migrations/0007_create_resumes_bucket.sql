-- Migration: Create "resumes" storage bucket with RLS policies
-- Requirements: 2.4, 2.5

-- ============================================================
-- Create the "resumes" storage bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB in bytes
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage RLS policies for the "resumes" bucket
-- ============================================================

-- Candidates can upload resumes to their own folder ({user_id}/*)
CREATE POLICY "candidates_upload_own_resume"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can read their own resumes
CREATE POLICY "candidates_read_own_resume"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can update (overwrite) their own resumes
CREATE POLICY "candidates_update_own_resume"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can delete their own resumes
CREATE POLICY "candidates_delete_own_resume"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
