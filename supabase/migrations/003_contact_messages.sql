create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text,
  last_name text,
  address text not null,
  email text not null,
  message text
);

alter table contact_messages enable row level security;

create policy "service role only"
  on contact_messages
  for all
  using (false)
  with check (false);
