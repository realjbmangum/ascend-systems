-- Migration: capture which pricing tier the client chose at sign time.
--
-- selected_tier is a short letter ('a', 'b', …) referencing the Option in
-- the proposal's tier definition (Option A = Bucket, Option B = Unlimited,
-- etc.). Nullable — older proposals + non-tiered proposals leave it NULL.
--
-- Apply with:
--   wrangler d1 execute ascend-db --remote --file=./worker/db/migrations/2026-06-07-proposals-selected-tier.sql

ALTER TABLE proposals ADD COLUMN selected_tier TEXT;
