create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  password_hash text not null
);

alter table admin_users enable row level security;

create policy "service role only"
  on admin_users
  for all
  using (false)
  with check (false);
