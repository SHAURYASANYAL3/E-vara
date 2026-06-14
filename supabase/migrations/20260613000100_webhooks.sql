create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  url text not null,
  secret text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.webhooks enable row level security;

create policy "Service role can manage webhooks"
  on public.webhooks
  for all
  using (auth.role() = 'service_role');

-- Allow users to manage their own webhooks
create policy "Users can CRUD their own webhooks"
  on public.webhooks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
