-- E-VARA Worker Immortality Protocol

-- 1. ADD TIMEOUT & HEARTBEAT COLUMNS
ALTER TABLE public.osint_jobs ADD COLUMN lease_expiry_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.osint_jobs ADD COLUMN last_heartbeat_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.osint_jobs ADD COLUMN recovery_count INT DEFAULT 0;

-- 2. DEDUPLICATE RECOVERIES (Poison Job Detection)
-- A job is dead-lettered if recovery_count > 3
-- Add 'dead_letter' to status ENUM implicitly via text check
ALTER TABLE public.osint_jobs DROP CONSTRAINT IF EXISTS osint_jobs_status_check;
ALTER TABLE public.osint_jobs ADD CONSTRAINT osint_jobs_status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter'));

-- 3. THE REAPER FUNCTION (Recovers stuck jobs)
CREATE OR REPLACE FUNCTION reap_stuck_osint_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Identify jobs that have exceeded lease without a heartbeat OR lease fully expired
    -- 2. If recovery_count >= 3, kill it permanently (Poison job)
    UPDATE public.osint_jobs
    SET status = 'dead_letter',
        error_log = 'POISON_JOB: Exceeded maximum recovery attempts.'
    WHERE status = 'processing'
      AND lease_expiry_at < NOW()
      AND recovery_count >= 3;

    -- 3. Recover stuck jobs back to pending, incrementing recovery count and applying backoff
    UPDATE public.osint_jobs
    SET status = 'pending',
        locked_by = NULL,
        locked_at = NULL,
        lease_expiry_at = NULL,
        last_heartbeat_at = NULL,
        recovery_count = recovery_count + 1,
        next_run_at = NOW() + (power(2, recovery_count) * interval '1 minute'),
        error_log = 'RECOVERED: Worker died holding lease.'
    WHERE status = 'processing'
      AND lease_expiry_at < NOW()
      AND recovery_count < 3;
END;
$$;

