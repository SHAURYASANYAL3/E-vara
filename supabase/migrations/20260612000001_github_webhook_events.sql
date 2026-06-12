create table if not exists public.github_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  repository text,
  sender text,
  action text,
  payload jsonb not null,
  received_at timestamptz not null default now()
);

alter table public.github_webhook_events enable row level security;

create policy "Service role can manage github webhook events"
  on public.github_webhook_events
  for all
  using (auth.role() = 'service_role');
