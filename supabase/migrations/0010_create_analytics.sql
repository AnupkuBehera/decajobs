-- ============================================================
-- Migration: Create Visitor Logs Table for Web Analytics
-- ============================================================

CREATE TABLE IF NOT EXISTS visitor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL, -- unique ID stored in browser session storage
  path text NOT NULL, -- visited route
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for analytics aggregation speed
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON visitor_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON visitor_logs(created_at);

-- Enable RLS
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role client to select and manage logs
CREATE POLICY "service_role_all_visitor_logs" ON visitor_logs
  USING (true)
  WITH CHECK (true);

-- Allow public inserts so that anyone browsing can log their visit
CREATE POLICY "public_insert_visitor_logs" ON visitor_logs
  FOR INSERT
  WITH CHECK (true);
