-- Migration: Create file_scan_results table for VirusTotal hash lookups
-- Issue #136

CREATE TABLE IF NOT EXISTS public.file_scan_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  file_size     BIGINT NOT NULL,
  sha256_hash   TEXT NOT NULL,
  malicious     INTEGER NOT NULL DEFAULT 0,
  suspicious    INTEGER NOT NULL DEFAULT 0,
  undetected    INTEGER NOT NULL DEFAULT 0,
  total_engines INTEGER NOT NULL DEFAULT 0,
  verdict       TEXT NOT NULL CHECK (verdict IN ('clean', 'suspicious', 'malicious', 'unknown')),
  vt_link       TEXT,
  scanned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on user_id for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_file_scan_results_user_id ON public.file_scan_results(user_id);

-- Index on hash to avoid redundant VT API calls for the same file
CREATE INDEX IF NOT EXISTS idx_file_scan_results_sha256 ON public.file_scan_results(sha256_hash);

-- Row Level Security: users can only read/write their own scan results
ALTER TABLE public.file_scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own scan results"
  ON public.file_scan_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own scan results"
  ON public.file_scan_results FOR SELECT
  USING (auth.uid() = user_id);
