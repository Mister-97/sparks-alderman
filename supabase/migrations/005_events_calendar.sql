alter table events add column if not exists event_date date;
alter table events add column if not exists description text;

update events set event_date = case
  when date = 'AUG 14' then date '2026-08-14'
  when date = 'AUG 23' then date '2026-08-23'
  when date = 'AUG 31' then date '2026-08-31'
end
where event_date is null;

alter table events alter column event_date set not null;
alter table events drop column if exists day;
alter table events drop column if exists date;
