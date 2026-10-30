-- "Train my eye" (src/pages/Train.tsx): the owner's hand-marked charts (structure pivots, trend lines, zones, notes),
-- used to tune the chart engine (docs/training/README.md) and kept as regression fixtures (src/core/trainingFixtures.test.ts).
-- Owner-only: every row belongs to auth.uid(). Additive; nothing else reads or changes it.
create table if not exists public.rfx_training_marks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  symbol text not null check (length(symbol) between 1 and 24),
  tf text not null check (tf in ('M15', 'H1', 'H4', 'D1', 'W1', 'MN', '3M')),
  as_of text not null,                       -- time of the newest bar of the marked chart
  bars_hash text not null,                   -- hash of the bars marked (the same chart can be rebuilt / checked)
  bars jsonb not null default '[]'::jsonb,   -- the bars marked: [[t, o, h, l, c], ...] (published feeds roll forward)
  marks jsonb not null default '{}'::jsonb,  -- { v, pivots, lines, zones } (src/core/training/types.ts)
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, symbol, tf, as_of)
);
create index if not exists rfx_training_marks_user on public.rfx_training_marks (user_id, updated_at desc);

alter table public.rfx_training_marks enable row level security;
revoke all on public.rfx_training_marks from anon;
grant select, insert, update, delete on public.rfx_training_marks to authenticated;

drop policy if exists rfx_training_marks_select on public.rfx_training_marks;
drop policy if exists rfx_training_marks_insert on public.rfx_training_marks;
drop policy if exists rfx_training_marks_update on public.rfx_training_marks;
drop policy if exists rfx_training_marks_delete on public.rfx_training_marks;
create policy rfx_training_marks_select on public.rfx_training_marks for select to authenticated using ((select auth.uid()) = user_id);
create policy rfx_training_marks_insert on public.rfx_training_marks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy rfx_training_marks_update on public.rfx_training_marks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy rfx_training_marks_delete on public.rfx_training_marks for delete to authenticated using ((select auth.uid()) = user_id);
