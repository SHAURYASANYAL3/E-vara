-- E-VARA Architecture Correction: Risk Snapshots

-- 1. Remove stale stored score
ALTER TABLE public.monitored_identities DROP COLUMN IF EXISTS executive_defense_score;

-- 2. Create Risk Snapshots table
CREATE TABLE public.risk_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    score INT NOT NULL,
    confidence INT NOT NULL,
    factors JSONB DEFAULT '[]'::jsonb,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour'
);

ALTER TABLE public.risk_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own risk snapshots" ON public.risk_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert risk snapshots" ON public.risk_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Throttle Identity Events
CREATE OR REPLACE FUNCTION public.log_identity_event(p_user_id UUID, p_event_type TEXT, p_metadata JSONB)
RETURNS void AS $$
DECLARE
    v_recent_event_id UUID;
BEGIN
    -- Check if exact same event happened in the last hour
    SELECT id INTO v_recent_event_id
    FROM public.identity_events
    WHERE user_id = p_user_id
      AND event_type = p_event_type
      AND created_at > NOW() - INTERVAL '1 hour'
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_recent_event_id IS NOT NULL THEN
        -- Optionally update a 'count' or 'last_seen_at' in metadata here
        -- For now, we just skip insertion to throttle the noise
        RETURN;
    ELSE
        INSERT INTO public.identity_events (user_id, event_type, metadata)
        VALUES (p_user_id, p_event_type, p_metadata);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove the old trigger that was overly aggressive
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.log_identity_event();
