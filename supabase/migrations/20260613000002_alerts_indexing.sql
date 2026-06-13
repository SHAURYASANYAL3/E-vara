-- feat: Add indexes to speed up alert history queries (Fixes #83)
-- identity_breaches functions as the alerts table.

CREATE INDEX IF NOT EXISTS idx_identity_breaches_created_at
  ON public.identity_breaches (created_at);

CREATE INDEX IF NOT EXISTS idx_identity_breaches_workspace_id
  ON public.identity_breaches (workspace_id);

CREATE INDEX IF NOT EXISTS idx_identity_breaches_workspace_created
  ON public.identity_breaches (workspace_id, created_at);
