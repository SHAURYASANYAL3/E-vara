-- E-VARA Identity OS Upgrade

-- 1. EXTEND EXISTING
ALTER TABLE public.monitored_identities ADD COLUMN executive_defense_score INT DEFAULT 100;
ALTER TABLE public.monitored_identities ADD COLUMN twin_baseline_hash TEXT;

-- 2. TRUSTED DEVICES (Zero-Surveillance)
CREATE TABLE public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    device_hash TEXT NOT NULL,
    platform TEXT,
    timezone TEXT,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_trusted BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, device_hash)
);

ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own devices" ON public.trusted_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own devices" ON public.trusted_devices FOR ALL USING (auth.uid() = user_id);

-- 3. IDENTITY EVENTS (Timeline tracking)
CREATE TABLE public.identity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    event_type TEXT CHECK (event_type IN ('login', 'mfa_change', 'scan_run', 'breach_found', 'device_added')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.identity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own events" ON public.identity_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert events" ON public.identity_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. PRIVACY CONSENTS
CREATE TABLE public.consents (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    continuous_monitoring BOOLEAN DEFAULT FALSE,
    agreed_to_tos_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_processing_region TEXT DEFAULT 'global'
);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own consents" ON public.consents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own consents" ON public.consents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own consents" ON public.consents FOR INSERT WITH CHECK (auth.uid() = user_id);

