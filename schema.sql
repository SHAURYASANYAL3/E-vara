-- E-VARA IDENTITY DEFENSE OS
-- DATABASE SCHEMA V4.0 (Absolute Sovereign Hardening)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Identity Monitoring Table
CREATE TABLE monitored_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_type TEXT NOT NULL CHECK (identity_type IN ('email', 'username', 'domain')), 
    identity_value_encrypted TEXT NOT NULL, 
    identity_hash CHAR(64) UNIQUE NOT NULL, -- Strictly enforced SHA-256
    full_name TEXT,
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    is_active BOOLEAN DEFAULT true,
    last_scanned_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Breach History Table (Redundant user_id removed for data-flow integrity)
CREATE TABLE identity_breaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_id UUID NOT NULL REFERENCES monitored_identities(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    leak_date DATE,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    data_types TEXT[] NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Billing & Operational Tiers
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT DEFAULT 'tactical' CHECK (tier IN ('tactical', 'executive', 'omni')),
    security_clearance TEXT DEFAULT 'UNCLASSIFIED' CHECK (security_clearance IN ('UNCLASSIFIED', 'SECRET', 'TOP_SECRET')),
    node_id_stable TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    billing_status TEXT DEFAULT 'inactive',
    metadata JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT null
);

-- 4. Secure Audit & Events
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ABSOLUTE RLS ENFORCEMENT
ALTER TABLE monitored_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Shared Policy: Ownership Handshake
CREATE POLICY "Identity_Isolation" ON monitored_identities FOR ALL USING (auth.uid() = user_id);

-- Relational RLS: Derive ownership securely from the parent table
CREATE POLICY "Breach_Isolation" ON identity_breaches FOR ALL USING (
    identity_id IN (SELECT id FROM monitored_identities WHERE user_id = auth.uid())
);

CREATE POLICY "Profile_Isolation" ON user_profiles FOR ALL USING (auth.uid() = id AND deleted_at IS NULL);
CREATE POLICY "Audit_Isolation" ON security_audit_logs FOR SELECT USING (auth.uid() = user_id);

-- DATABASE INTEGRITY ENFORCEMENT
CREATE OR REPLACE FUNCTION validate_identity_hash()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.identity_hash !~ '^[a-f0-9]{64}$' THEN
        RAISE EXCEPTION 'Cryptographic Integrity Violation: identity_hash must be a valid SHA-256 hex string.';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_enforce_hashing_integrity
BEFORE INSERT OR UPDATE ON monitored_identities
FOR EACH ROW EXECUTE PROCEDURE validate_identity_hash();

-- DETERMINISTIC NODE ID GENERATION (Cryptographically Secure)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, node_id_stable, billing_status)
    VALUES (
        NEW.id, 
        'NODE-' || upper(encode(gen_random_bytes(8), 'hex')),
        'active'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 5. Account Deletion Requests
CREATE TABLE account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT now(),
    scheduled_for TIMESTAMPTZ GENERATED ALWAYS AS (requested_at + interval '30 days') STORED,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed'))
);

CREATE UNIQUE INDEX uq_account_deletion_requests_user_pending
ON account_deletion_requests (user_id)
WHERE status = 'pending';

-- RLS: Only allow the requesting user to see their own deletion request
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deletion_Isolation" ON account_deletion_requests
FOR ALL USING (auth.uid() = user_id);


create or replace function cleanup_deletions()
returns void as $$
begin
  delete from monitored_identities
  where user_id in (
    select user_id from account_deletion_requests
    where scheduled_for <= now() and status = 'pending'
  );

  delete from user_profiles
  where id in (
    select user_id from account_deletion_requests
    where scheduled_for <= now() and status = 'pending'
  );

  update account_deletion_requests
  set status = 'completed'
  where scheduled_for <= now() and status = 'pending';
end;
$$ language plpgsql;
