-- Migration Version Sync Repair Script
-- Fixes: "Remote migration versions not found in local migrations directory"
-- Run this once against the remote Supabase database via the SQL editor or CLI:
--   psql $DATABASE_URL -f repair_migration_versions.sql

-- Step 1: Remove old non-conforming version entries
DELETE FROM supabase_migrations.schema_migrations
WHERE version IN (
  '20240531_identity_engine',
  '20240611_legacy_migration'
);

-- Step 2: Insert the correctly named versions if not already present
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES
  ('20240531000000'),
  ('20240611000000')
ON CONFLICT (version) DO NOTHING;
