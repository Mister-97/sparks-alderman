create table if not exists movement_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  join_as text not null check (join_as in ('Volunteer', 'Supporter', 'Donor'))
);

alter table movement_signups enable row level security;

create policy "service role only"
  on movement_signups
  for all
  using (false)
  with check (false);

alter table volunteers
  add column if not exists join_as text not null default 'Volunteer'
  check (join_as in ('Volunteer', 'Supporter', 'Donor'));
