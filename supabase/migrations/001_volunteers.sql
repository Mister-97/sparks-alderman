create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  preferred_contact text not null,
  neighborhood text not null,
  home_address text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  availability text[] not null default '{}',
  availability_other text,
  roles text[] not null default '{}',
  roles_other text,
  referral_source text[] not null default '{}',
  referral_other text,
  send_copy boolean not null default false
);

alter table volunteers enable row level security;

create policy "service role only"
  on volunteers
  for all
  using (false)
  with check (false);
