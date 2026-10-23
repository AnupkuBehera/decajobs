-- Add Stripe customer and subscription tracking fields to candidates table
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Create indexes for fast webhook lookups
CREATE INDEX IF NOT EXISTS idx_candidates_stripe_sub 
  ON candidates(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_candidates_stripe_cust 
  ON candidates(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_candidates_razorpay_sub 
  ON candidates(razorpay_subscription_id);
