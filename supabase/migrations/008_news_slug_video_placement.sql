alter table news_posts add column if not exists slug text;
alter table news_posts add column if not exists video_url text;
alter table news_posts add column if not exists show_on_homepage boolean not null default true;

-- backfill slugs for existing rows from title
update news_posts
set slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
where slug is null;

-- de-duplicate any collisions from backfill by appending row id fragment
update news_posts a
set slug = a.slug || '-' || left(a.id::text, 8)
where exists (
  select 1 from news_posts b
  where b.slug = a.slug and b.id <> a.id
);

alter table news_posts add constraint news_posts_slug_unique unique (slug);
alter table news_posts alter column slug set not null;
