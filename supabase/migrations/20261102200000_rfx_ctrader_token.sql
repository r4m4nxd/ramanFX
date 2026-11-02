-- cTrader Open API token (Pepperstone price feed). One row, written by the ctrader-token workflow (refresh before
-- expiry), read by the FX scanner and the Telegram bot with the service role. Service-role only: RLS on, no policies,
-- no grants to anon / authenticated.
create table if not exists public.rfx_ctrader_token (
  id int primary key default 1 check (id = 1),
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);
alter table public.rfx_ctrader_token enable row level security;
revoke all on public.rfx_ctrader_token from anon, authenticated;
