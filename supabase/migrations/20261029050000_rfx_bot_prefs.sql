-- Telegram bot owner preferences (supabase/functions/telegram-bot/prefs.ts): alerts, mutes, watchlist, quiet hours and
-- the hash of the scanners' prefs key. Read / written only by the edge function with the service role (RLS on, no
-- policies, no grants to anon / authenticated). One owner per bot, so no user column.
alter table public.rfx_bot_config
  add column if not exists prefs_key_hash text,       -- sha256(hex key), key = sha256(bot token + ':prefs'); never the key
  add column if not exists quiet_from text check (quiet_from is null or quiet_from ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  add column if not exists quiet_to text check (quiet_to is null or quiet_to ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

create table if not exists public.rfx_bot_alerts (
  id bigint generated always as identity primary key,
  sym text not null check (length(sym) between 1 and 20),
  kind text not null check (kind in ('price', 'zone', 'pct')),
  level double precision,
  dir text check (dir is null or dir in ('above', 'below')),
  pct double precision check (pct is null or (pct > 0 and pct <= 10)),
  created_at timestamptz not null default now(),
  fired_at timestamptz
);
create index if not exists rfx_bot_alerts_open on public.rfx_bot_alerts (id) where fired_at is null;

create table if not exists public.rfx_bot_mutes (
  sym text primary key check (length(sym) between 1 and 20),
  until_utc timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rfx_bot_watch (
  sym text primary key check (length(sym) between 1 and 20),
  created_at timestamptz not null default now()
);

alter table public.rfx_bot_alerts enable row level security;
alter table public.rfx_bot_mutes enable row level security;
alter table public.rfx_bot_watch enable row level security;
revoke all on public.rfx_bot_alerts, public.rfx_bot_mutes, public.rfx_bot_watch from anon, authenticated;
