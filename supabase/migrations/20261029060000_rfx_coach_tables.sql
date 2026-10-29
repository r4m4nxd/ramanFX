-- Trader coach (supabase/functions/trader-coach): the owner's own discipline rules, sent to Telegram.
-- Every table is service-role only (RLS on, no policies, no grants to anon / authenticated).
--   rfx_coach_config  one row: the random cron secret (sent by pg_cron / the journal trigger in x-coach-secret),
--                     show_amounts (weekly report shows $ only when true; default R multiples), last journal seen.
--   rfx_coach_events  dedupe: one row per sent event ('2026-10-29:stop', 'ask:<trade id>', 'week:2026-10-26', ...).
--   rfx_coach_prompts the "why did you take it?" messages: Telegram message_id -> trade id (the bot matches replies).
--   rfx_coach_writes  journal writes the bot made (notes, /took plans), re-checked by the coach for a day.
create table if not exists public.rfx_coach_config (
  id smallint primary key default 1 check (id = 1),
  cron_secret text not null default encode(extensions.gen_random_bytes(32), 'hex'),
  enabled boolean not null default true,
  show_amounts boolean not null default false,
  last_journal_at timestamptz,
  updated_at timestamptz not null default now()
);
insert into public.rfx_coach_config (id) values (1) on conflict (id) do nothing;

create table if not exists public.rfx_coach_events (
  key text primary key,
  kind text not null,
  sent boolean not null default false,
  message_id bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.rfx_coach_prompts (
  message_id bigint primary key,
  trade_id text not null,
  label text not null,
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

create table if not exists public.rfx_coach_writes (
  id bigserial primary key,
  kind text not null check (kind in ('note', 'plan')),
  trade_id text,
  text text,
  plan jsonb,
  at bigint not null,
  healed int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.rfx_coach_config enable row level security;
alter table public.rfx_coach_events enable row level security;
alter table public.rfx_coach_prompts enable row level security;
alter table public.rfx_coach_writes enable row level security;
revoke all on public.rfx_coach_config, public.rfx_coach_events, public.rfx_coach_prompts, public.rfx_coach_writes from anon, authenticated;
revoke all on sequence public.rfx_coach_writes_id_seq from anon, authenticated;

-- POST to the coach (pg_net, async: never blocks or fails the caller's statement).
create schema if not exists private;
create or replace function private.rfx_coach_ping(reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare s text;
begin
  select cron_secret into s from public.rfx_coach_config where id = 1 and enabled;
  if s is null then return; end if;
  perform net.http_post(
    url := 'https://dqjzufofmblerslcynzr.supabase.co/functions/v1/trader-coach',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-coach-secret', s),
    body := jsonb_build_object('reason', reason),
    timeout_milliseconds := 20000);
exception when others then
  null;   -- the coach is best effort; a journal save must never fail because of it
end $$;
revoke all on function private.rfx_coach_ping(text) from public, anon, authenticated;

-- The owner's journal row changed (app sync, bot note): check the rules now.
create or replace function private.rfx_coach_journal_changed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform private.rfx_coach_ping('journal');
  return null;
end $$;
revoke all on function private.rfx_coach_journal_changed() from public, anon, authenticated;

drop trigger if exists rfx_coach_journal_changed on public.rfx_journal;
create trigger rfx_coach_journal_changed
  after insert or update on public.rfx_journal
  for each row when (new.user_id = '67967f02-d6fb-45f1-9edf-d14c3d3fcf12'::uuid)
  execute function private.rfx_coach_journal_changed();

-- Safety net + the Sunday 6 PM Calgary report (the function decides what is due; it exits early when nothing changed).
select cron.unschedule('rfx-coach-tick') where exists (select 1 from cron.job where jobname = 'rfx-coach-tick');
select cron.schedule('rfx-coach-tick', '*/10 * * * *', $$select private.rfx_coach_ping('tick')$$);
