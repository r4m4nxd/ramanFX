-- Telegram bot guests (supabase/functions/telegram-bot/guests.ts): up to 5 chats the owner added with /adduser. They
-- get the market commands and the automatic market messages, never the owner's data. Read / written only by the edge
-- function with the service role (RLS on, no policies, no grants to anon / authenticated). prefs = the guest's own
-- alerts / mutes / quiet hours / watch list (guests.ts GuestPrefs), never shared with the owner's tables.
create table if not exists public.rfx_bot_guests (
  chat_id bigint primary key,
  name text check (name is null or length(name) <= 40),
  added_at timestamptz not null default now(),
  active boolean not null default true,
  prefs jsonb not null default '{}'::jsonb
);
alter table public.rfx_bot_guests enable row level security;   -- no policies: anon / authenticated get nothing
revoke all on public.rfx_bot_guests from anon, authenticated;
