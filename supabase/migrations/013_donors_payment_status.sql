alter table donors add column if not exists payment_status text not null default 'pledged';
alter table donors add column if not exists paypal_order_id text;
alter table donors add column if not exists paypal_capture_id text;
alter table donors add column if not exists paid_amount text;
alter table donors add column if not exists paid_at timestamptz;
