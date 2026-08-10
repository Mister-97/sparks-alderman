create table if not exists donors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  street_address text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  occupation text not null,
  employer text not null,
  frequency text not null,
  amount text not null
);

alter table donors enable row level security;

create policy "service role only"
  on donors
  for all
  using (false)
  with check (false);
