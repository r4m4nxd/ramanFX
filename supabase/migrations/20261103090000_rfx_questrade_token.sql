-- Questrade API token (TSX daily bars for the stock scan). Questrade refresh tokens are SINGLE-USE: every exchange
-- returns a new one, stored here at once (tools/stock_scanner/questrade.py). Service-role only: RLS on, no policies,
-- no grants to anon / authenticated.
create table if not exists public.rfx_questrade_token (
  id int primary key default 1 check (id = 1),
  refresh_token text not null,
  access_token text,
  api_server text,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.rfx_questrade_token enable row level security;
revoke all on public.rfx_questrade_token from anon, authenticated;
