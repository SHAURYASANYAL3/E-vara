-- fix: Harden RLS policies for Identity Records (Fixes #82)
-- monitored_identities and identity_breaches had RLS enabled but were
-- missing DELETE policies, allowing potential unauthorized row removal.

ALTER TABLE public.monitored_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_breaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can delete own identities"
  ON public.monitored_identities
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own findings"
  ON public.identity_breaches
  FOR DELETE USING (auth.uid() = user_id);
