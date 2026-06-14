-- chore: Standardize all timestamp columns to TIMESTAMPTZ (Fixes #85)
-- Defensive migration: converts any remaining `timestamp without time zone`
-- columns in the public schema to `timestamp with time zone`, assuming
-- existing naive timestamps were stored in UTC.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type = 'timestamp without time zone'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN %I TYPE timestamptz USING %I AT TIME ZONE ''UTC''',
      r.table_name, r.column_name, r.column_name
    );
    RAISE NOTICE 'Converted %.% to timestamptz', r.table_name, r.column_name;
  END LOOP;
END $$;
