-- E-VARA Identity OS Maturity Upgrades

-- 1. Add severity to identity_events
ALTER TABLE public.identity_events ADD COLUMN severity TEXT CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')) DEFAULT 'info';

-- 2. Add explainability to trusted_devices
ALTER TABLE public.trusted_devices ADD COLUMN trust_reason TEXT;
ALTER TABLE public.trusted_devices ADD COLUMN risk_reason TEXT;
ALTER TABLE public.trusted_devices ADD COLUMN location TEXT;

-- Example backfill for testing
-- UPDATE public.identity_events SET severity = 'critical' WHERE event_type = 'breach_found';

