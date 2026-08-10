create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  day text not null,
  date text not null,
  title text not null,
  location text not null,
  time text not null
);

create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  published_date text not null,
  title text not null,
  excerpt text not null,
  featured boolean not null default false,
  sort_order int not null default 0
);

create table if not exists form_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_key text not null check (form_key in ('volunteer', 'join', 'contact'))
);

alter table events enable row level security;
alter table news_posts enable row level security;
alter table form_views enable row level security;

create policy "service role only" on events for all using (false) with check (false);
create policy "service role only" on news_posts for all using (false) with check (false);
create policy "service role only" on form_views for all using (false) with check (false);

insert into events (sort_order, day, date, title, location, time) values
  (1, 'THU', 'AUG 14', 'Community Town Hall', 'South Shore Cultural Center', '6:30 PM'),
  (2, 'SAT', 'AUG 23', 'Neighborhood Cleanup', '79th & Exchange', '9:00 AM'),
  (3, 'SUN', 'AUG 31', 'Meet the Candidate', 'Calumet Heights Library', '2:00 PM');

insert into news_posts (sort_order, published_date, title, excerpt, featured) values
  (0, 'August 6, 2026', 'Sparks Launches Campaign for 7th Ward Alderman', 'The 7th Ward deserves bold leadership focused on action, accountability, and long-term investment in our neighborhoods. Our community is filled with the talent, resilience, and potential to thrive. However, real progress requires leadership that is responsive and committed to delivering results.', true),
  (1, 'Aug 4', 'Sparks outlines small business plan for South Shore', 'Sparks outlines small business plan for South Shore', false),
  (2, 'Aug 1', 'Campaign announces youth mentorship initiative', 'Campaign announces youth mentorship initiative', false),
  (3, 'Jul 28', 'Residents turn out for Calumet Heights town hall', 'Residents turn out for Calumet Heights town hall', false),
  (4, 'Jul 22', 'A commitment to faster city services in the 7th Ward', 'A commitment to faster city services in the 7th Ward', false),
  (5, 'Jul 15', 'Walking the corridors: notes from South Deering', 'Walking the corridors: notes from South Deering', false);
