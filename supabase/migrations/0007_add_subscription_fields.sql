-- Add subscription fields to candidates table
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + interval '7 days'),
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;

-- subscription_status values: 'trial', 'active', 'expired', 'cancelled'
