alter table admin_users add column if not exists failed_attempts int not null default 0;
alter table admin_users add column if not exists locked_until timestamptz;
