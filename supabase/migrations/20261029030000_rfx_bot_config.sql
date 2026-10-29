-- Telegram bot webhook config (supabase/functions/telegram-bot): ONE row, read / written only by the edge function
-- with the service role. secret_hash = sha256(webhook secret S), owner_hash = sha256(TELEGRAM_CHAT_ID) (the ?o= param).
-- rotate_until opens a short window in which the next request may set (first claim) or replace (rotation) the hashes:
--   update public.rfx_bot_config set rotate_until = now() + interval '15 minutes' where id = 1;
create table if not exists public.rfx_bot_config (
  id smallint primary key default 1 check (id = 1),
  secret_hash text,
  owner_hash text,
  rotate_until timestamptz,
  pinned_message_id bigint,
  commands_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rfx_bot_config enable row level security;   -- no policies: anon / authenticated get nothing
revoke all on public.rfx_bot_config from anon, authenticated;
-- First setup (done once, by hand, right before the first workflow run):
--   insert into public.rfx_bot_config (id, rotate_until) values (1, now() + interval '30 minutes') on conflict (id) do nothing;
