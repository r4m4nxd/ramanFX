# trader-coach

Enforces the owner's own discipline rules from his journal (`public.rfx_journal`, owner row only) and talks to him on
Telegram. Edge function, `verify_jwt: false`: it checks its own secret (`x-coach-secret` header =
`rfx_coach_config.cron_secret`, a random value generated in the database, never in code).

| File | What |
| --- | --- |
| `index.ts` | HTTP, secret check, database, Telegram sending, dedupe |
| `core.ts` | the rules and messages (pure; also imported by `../telegram-bot/journal.ts` and the tests) |
| `app-core.js` | GENERATED: the app's own `src/core` (enrich, riskStatus, rule score, plans) bundled by `scripts/build-coach-core.mjs`. Re-run `node scripts/build-coach-core.mjs` after changing those files; `src/core/traderCoach.test.ts` fails while it is stale. |
| `app-core.d.ts` | types for tsc only |
| `scheduler.ts` | which GitHub workflow slots are due (pure) |
| `deploy_entry.ts` | the deployed file: imports `index.ts` from raw GitHub at one commit SHA |

## What it sends

1. **Rule guard** (Calgary day, `risk_rules` from the journal with the app's defaults):
   - daily loss limit or max trades → `🛑 Stop trading today — daily loss limit reached ($X / $Y). Next session tomorrow.` once per day;
   - 70% of the loss limit or of the trade cap → one `⚠️ Close to your daily limit`;
   - `maxConsecutiveLosses` in a row inside `cooldownMinutes` → `⏸ 30-min pause (your rule). Next look at 9:15 AM.` once per streak.
   Stop / heads-up only while the day is live (latest trade today closed within 3 h), so an evening import stays quiet.
2. **Why did you take it?** A trade or open position opened in the last 24 h without note text →
   `📝 EURUSD buy 1.0850 — why did you take it? Reply to this message.` (force-reply, at most 3 per run, once per trade id).
   The bot (`telegram-bot/journal.ts`) saves the reply as the trade's note.
3. **Weekly report card**, Sunday 6 PM Calgary (Mon–Sun): trades · win rate · net R, rules followed %, most expensive
   habit (the app's rule score), best / worst setup tag, [Open journal]. R multiples only; `$` only when
   `update public.rfx_coach_config set show_amounts = true where id = 1;` (the app's privacy toggle lives in the browser
   only, so the coach cannot read it and defaults to hidden).
4. **Self-heal**: a bot journal write (note, `/took` plan) that a concurrent app sync overwrote is re-applied (24 h, 3 tries).

5. **GitHub workflow scheduler** (GitHub's own cron drops most scheduled runs). With the optional secret
   `GITHUB_DISPATCH_TOKEN`, each tick dispatches (`POST /repos/r4m4nxd/ramanFX/actions/workflows/<file>/dispatches`, ref main):
   - `fx-scan.yml` once per H1 close at :05-:25 past the hour, forex week Sunday 17:00 → Friday 17:00 New York, input
     `scheduled=true` (its `--check` decides; no `--force`, digest only on a new H4);
   - `stock-scan.yml` weekdays 30 min after the US close (20:30 UTC summer / 21:30 UTC winter) plus a retry 3 h later,
     `scheduled=true` (its "already scanned today" check decides);
   - `briefing.yml` weekdays 5:55-6:30 AM Calgary, `test=false` (its decide() + state dedupe);
   - `reminders.yml` every 30 min, 4:00 AM-2:00 PM Calgary weekdays (its window logic decides).
   One dispatch per slot (`rfx_coach_events` `dispatch:<slot>`, last one per workflow in `rfx_coach_config.dispatch`);
   a slot is skipped when the workflow's latest GitHub run was created inside it. A failed dispatch is retried next tick.
   Without the token: nothing, and `dispatch token not set` is logged once per day. The token is never logged.

## Triggers

- `rfx_coach_journal_changed` trigger on `public.rfx_journal` (owner row, insert / update) → `pg_net` POST `{"reason":"journal"}`.
- pg_cron `rfx-coach-tick` every 10 min → `{"reason":"tick"}`: the Sunday report and a safety net; exits early when the
  journal has not changed and nothing is due.
- Both go through `private.rfx_coach_ping()` (security definer; reads the secret; never fails the caller).
- Dedupe: `rfx_coach_events` (key per day / event / trade / week, claimed before sending).

## Owner setup

1. Apply the migration `supabase/migrations/20261029060000_rfx_coach_tables.sql` (SQL editor, or approve the
   apply_migration prompt). It creates the `rfx_coach_*` tables, `private.rfx_coach_ping`, the journal trigger and the
   10-min pg_cron job `rfx-coach-tick`. Until then the coach is deployed but never called.
2. Supabase function secrets (Dashboard → Edge Functions → Secrets), all optional:
   - `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`: every push message (stop / heads-up / pause, the "why" prompts, the weekly
     report). Without them the coach logs `telegram secrets not set` and only records events (nothing floods in later).
   - `GITHUB_DISPATCH_TOKEN`: a fine-grained GitHub token, repository r4m4nxd/ramanFX only, permission
     **Actions: Read and write**. Turns the workflow scheduler on (the bot's /scan uses the same secret).

Sample report (after adding the secrets), in the SQL editor:

```sql
select net.http_post(
  url := 'https://dqjzufofmblerslcynzr.supabase.co/functions/v1/trader-coach',
  headers := jsonb_build_object('Content-Type','application/json','x-coach-secret',(select cron_secret from public.rfx_coach_config where id = 1)),
  body := '{"dry":"report"}'::jsonb);
```

Pause everything: `update public.rfx_coach_config set enabled = false where id = 1;`

## Time

Journal times are wall-clock strings on the owner's clock (America/Edmonton). The app code runs in the UTC edge
runtime and gets "now" as the Calgary wall clock read as UTC, so day keys and minute gaps match the app (parity tests).
Alberta stays on UTC-6 from 2026-11-01; `core.ts` patches runtimes whose ICU still has the old rule.
