-- 1. Create Identity monitoring table
CREATE TABLE public.monitored_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    identity_type TEXT NOT NULL CHECK (identity_type IN ('email', 'username', 'phone', 'domain')),
    identity_value_encrypted TEXT NOT NULL, -- AES-256 encrypted
    identity_hash TEXT NOT NULL, -- SHA-256 for lookup
    full_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_scanned_at TIMESTAMP WITH TIME ZONE
);

-- 2. Create Threat Findings table
CREATE TABLE public.identity_breaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    identity_id UUID REFERENCES public.monitored_identities ON DELETE CASCADE,
    source_name TEXT NOT NULL, -- e.g., 'dark_web', 'github_leak'
    leak_date DATE,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    data_types JSONB,
    description TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX idx_identities_user ON public.monitored_identities(user_id);
CREATE INDEX idx_breaches_user_severity ON public.identity_breaches(user_id, severity);
CREATE INDEX idx_identities_hash ON public.monitored_identities(identity_hash);

-- 4. RLS Policies
ALTER TABLE public.monitored_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_breaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own identities" ON public.monitored_identities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own identities" ON public.monitored_identities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own identities" ON public.monitored_identities
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own findings" ON public.identity_breaches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert findings" ON public.identity_breaches
    FOR INSERT WITH CHECK (true); -- Restricted to service_role in Edge Function

