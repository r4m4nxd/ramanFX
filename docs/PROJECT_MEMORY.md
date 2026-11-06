# RamanFX: project memory (hand-off for a new Claude Code session)

Written 2026-11-06 from a long cloud session. Read this first, then `docs/Strategy_Summary.md` and
`docs/research/Overnight_Learning_2026-11-03.md`. Repo: `github.com/r4m4nxd/ramanFX` (public). Owner: Raman, Calgary
(America/Edmonton, permanent UTC-6 from Nov 2026), trades forex / metals / indices on Pepperstone (MT5, cTrader),
stocks on Questrade (TFSA) and IBKR demo.

## 1. How the owner likes to work
- Replies short and plain, no long explanations; low token cost. Plain English, no jargon in anything user-facing.
- Says "go" / "done" / "do all" and expects autonomous work; asked for overnight runs "without my permissions".
- Wants everything in BOTH the web app and the Telegram bot.
- Values honesty: overnight research said the mechanical method has no edge; keep reporting results straight.
- Never print / commit secrets; never put model names in commits or repo files; data goes to the `data` branch only.

## 2. The strategy (supply & demand)
Mentors: **Kevin** (video/Zoom course, primary; not Kevin Baker), **Sam Seiden** (OTA), **Kevin Baker** ("No Stinkin'
Indicators"), **Raja** (direction change + arrival / realignment rules). One-page summary: `docs/Strategy_Summary.md`;
full merged rulebook with conflicts C1-C20: `docs/Combined_Rulebook.md`.
- Zone = base (1-3 candles, up to 6) + explosive leg-out; proximal on base bodies, distal on the extreme wick; fresh only.
- Top-down: FX MN→W1→D1→H4→H1 (15m confirm); stocks 3M→MN→W1→D1, long only (supply = take profit).
- Raja direction change: candle CLOSE through trend line → 1st opposite zone removed → 2nd removed = changed.
- Raja arrival / realignment ("A+ trade"): HTF pullback ends in the weak zone nearest the bigger trend line; enter on a
  lower-TF arrival (its trend line breaks + an opposite zone removed) inside it.
- Owner's trend-line rule: anchor only on the best pivot candles inside zones that made the HH / LL (strict pivots).
- TFSA rule: buy at the best price, inside / near / just left a W1 / MN / 3M demand zone; insider buys at the zone on top.

## 3. Research results (Nov 2-3 2026, all after costs, out-of-sample) — the honest baseline
Details: `docs/research/Overnight_Learning_2026-11-03.md`; data branch: `docs/research/arrival_study/round2..4/`,
`docs/research/Stock_Backtest.md`, `public/learn/*.json`.
- **Mechanical zone trading has no edge**: 35k FX zones + 3.7k arrivals, 2010-2026: -0.05..-0.15R/trade in both halves.
  Kevin's own 349 calls ≈ -0.02R. 62 outside-evidence ideas (round 3: momentum, pattern, volatility, session, stop
  width, exits, depth, pairs): none survived (BH-FDR, instrument halves, train/test).
- Loses less (consistent, still negative): continuation > reversal zones; stop ~1 ATR beyond the distal > tight; with the
  12-month trend (arrivals best +0.07R recent, not significant).
- Round 4 benchmarks on the same 115 markets: only TSMOM 12m long-only on indices + metals passed every check, but plain
  vol-targeted buy-and-hold was as good (Sharpe ~1.1 recent). Donchian / RSI(2) ≈ flat; shorts lose.
- FX scanner's own live rules: **0 trades in 21 years** (gates never align); loose base 88 trades, -0.51R / -0.06R.
- Stock swing rules: 8 signals in 9 years on 736 stocks; loose base 134 trades (+0.72R old, -0.50R recent).
- TFSA study (38k first touches, 12m hold, no stop): +2.8% vs a random day, +4.6% vs SPY on average but median lags SPY;
  calendar-month CI includes 0 → not proven. Consistent: avoid the top third of the 2-year range (+12%/+3% vs -7.5%/-4.2%).
  MN / 3M zones stronger than W1 (mostly older years). A stop roughly halves returns. Survivorship bias (today's tickers).
- Owner was advised: alerts = watchlist, not signals; trade small, journal; core money in index funds.

## 4. Architecture
- **Web app**: Vite + React + TS + Tailwind in `src/` (pages in `src/pages`, logic in `src/core`, content in
  `src/content`, guide `src/content/guide.ts`), deployed on Vercel (`https://raman-fx.vercel.app`) from `main` only.
- **Telegram bot**: Supabase edge function `telegram-bot` (Deno), project `dqjzufofmblerslcynzr`, code in
  `supabase/functions/telegram-bot/`. Key files: `logic.ts` (commands, replies), `index.ts` (webhook, images via
  resvg-wasm, data loading from the data branch), `card.ts` (summary share card SVG + caption), `understand.ts` (plain
  names → symbols: gold→XAUUSD, apple→AAPL, greetings), `chart.ts`, `fundamentals.ts`, `ctrader.ts`, `questrade.ts`,
  `live.ts`, `zonecore.ts`, `zvTrend.ts`, `arrival.ts`, `insiders.ts`, `insiderLive.ts`, `holders.ts`, `news.ts`.
  **Deploy**: commit → put the commit SHA in `tools/telegram_bot/deploy_entry.ts` → push main → Supabase MCP
  `deploy_edge_function` (name telegram-bot, verify_jwt false, index.ts = one import of the raw GitHub URL at that SHA).
  Last deployed version 61+. Other functions: `trader-coach` (health watchdog, rule guard), `lesson-audio`.
- **Scanners (Python, stdlib)** run in GitHub Actions: `tools/fx_scanner/` (fxscan, fxcore, fxnotify, fxarrival,
  fxtrend, realign, sources/ctrader_feed.py — cTrader Open API is the main FX feed, 139 Pepperstone symbols; OANDA
  fallback / history) and `tools/stock_scanner/` (scan, notify, arrival_alerts, stock_arrivals, data, questrade for TSX;
  1112 stocks incl. 118 TSX). Shared Telegram text helpers: `tools/stock_scanner/notify.py`.
- **Other jobs**: briefing (6 AM brief + lesson), movers (big moves), insiders (SEC Form 4, every 10 min US hours),
  holders, fundamentals, reminders (NFP/CPI/FOMC), news, market-hours study, kevin_daily (mentor plan notes).
- **Data branch rule**: no automated job commits to `main`; every generated file goes to the `data` branch via
  `scripts/data-branch.sh push` (DATA_PATHS list; keep `scripts/vercel-ignore.sh` and
  `supabase/functions/trader-coach/appPaths.ts` in sync; `src/core/vercelGuard.test.ts` enforces it).
- Workflows are mostly triggered by an external pinger as `workflow_dispatch` (GitHub cron is unreliable). Artifacts
  expire after 7 days.
- **MT5 / TradingView tools** in `public/tools/` (every file must be listed in `src/core/tools/manifest.ts`):
  RamanFX_ZoneVision (v2.21), RamanFX_ZoneBot (EA, presets .set), RamanFX_BotView (draws the bot's zones from
  `public/fx/mt5/<SYM>.txt`), RamanFX_ChannelMid (parallel channel with dotted 50% line), RamanFX_DrawReader (owner
  draws, tool measures and annotates), Pine port.

## 5. Bot features (current)
- Bare ticker or plain name (`gold`, `apple stock`, `should i buy tesla`, `is nvda a buy?`) → one-stop **summary card**
  image (1080×~1850): price, trend tiles (this week / month / big picture), buy & sell areas, daily chart (90 candles,
  areas, live trend lines, price tag), key points, company numbers, StockTwits, news; caption + buttons + Share.
- Commands: /zones (only the areas that matter, ≤3 per side), /chart (TF words ok: weekly, 4 hour), /fx, /stocks,
  /signals, /near, /tfsa (top 5 + Show more; /tfsa ca), /turns, /areas, /fund, /holders, /insiders SYM (live SEC),
  /news, /times, /next, /hours, /alert, /alerts, /mute, /quiet, /watch, /scan, /ask, /learn, /guide, /help (menu with
  section buttons). Shortcuts /z /c /f /i /sig. Greetings → welcome with buttons; every dead end has buttons.
- Style rules: plain English ("buy area" not "demand zone", "this week" not "W1", "possible gain 2.9× the risk" not
  R:R), ▲ ▼ ● markers only, blockquotes, ≤3 buttons per row, footer "For learning only, not financial advice".
  `polishButtons` / `polishText` in logic.ts strip decorative emoji at send time.
- Alerts (from the scanners): FX arrivals / confirmations (uncapped, every TF, both sides), direction changes, FX
  **hourly check** (`FX_DIGEST_EVERY=H1`, default since 2026-11-04; guests keep 4-hour), daily summary, stock scan,
  weekly turns, big moves, insider alerts, reminders, morning brief. Quiet hours 22:00-06:00 = silent, not skipped.
- Guests: /adduser etc.; guests get market messages, never owner data.

## 6. Auto-learning system (built 2026-11-03)
- `tools/learn/outcomes.py`: every published idea → ledger (`public/learn/ledger-fx.json`, `ledger-stock.json`),
  followed on later candles (fill, stop-first, target, MFE/MAE in R) → `public/learn/outcomes.json`. Runs after each scan.
- Backtests with experiment variants: `tools/fx_scanner/fx_backtest.py` + `fxexperiments.py` (19 variants × bases
  current / no_nesting / loose), `tools/stock_scanner/backtest.py` + `experiments.py` (17 variants × 3 bases) +
  `tfsa_study.py`. Monthly (fx 2nd, stocks 3rd) → `public/learn/*_experiments*.json`, `tfsa_study.json`.
- `tools/learn/learner.py` + `learn.yml` (5th of each month): adopts a variant only if better in-sample AND
  out-of-sample by ≥0.05R, n ≥100/40, keeps ≥80% of total R, drawdown ≤1.25×, strong (CI) → now, else after a second
  run; ≤3 per month; drops when it stops qualifying; live 90-day losses → "half size". `LEARN_MODE=off` repo variable.
  Output `public/learn/policy.json` + report.md; bot `/learn`. **Not yet wired**: scanners do not apply adopted
  variants live (filters / exit plan text / half-size label) — a natural next step.
- Research rounds: `tools/research/arrival_study/round2.py`, `round3.py`, `round4.py` (`arrival-study.yml`, input round).

## 7. Data sources and secrets (names only)
- GitHub secrets: OANDA_API_TOKEN, CTRADER_CLIENT_ID / SECRET / ACCESS_TOKEN, ALPACA_KEY_ID / SECRET_KEY,
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SUPABASE_SERVICE_ROLE_KEY, WATCHLIST, HOLDINGS_JSON, Questrade refresh token.
- Supabase tables (service role only): rfx_ctrader_token (weekly refresh, ctrader-token.yml), rfx_questrade_token
  (rotating). Always do a writable no-op PATCH before spending a single-use refresh token. sb_secret keys go in the
  apikey header only.
- Supabase function secrets include SEC_UA (SEC user agent). **Known issue**: the OANDA token stored in Supabase returns
  401 (bot health shows OANDA error); the GitHub copy works. Owner should rotate it.
- Yahoo returns 429 to runners and FMP 401: TSX comes from Questrade. Do not circumvent bot protections (no spoofed UAs).

## 8. Testing
- `npx vitest run` (≈604 tests, includes vercelGuard, manifest, guide, bot tests in `src/core/telegram*.test.ts`),
  `npx tsc --noEmit -p .`.
- Python: `python -m unittest discover -s tools/<dir>/tests` for stock_scanner, fx_scanner, learn, briefing, movers,
  insiders, reminders, news, holders, fundamentals, research/arrival_study.
- Command descriptions ≤40 chars; `commands.json` order must match `COMMANDS` in logic.ts; every command needs a guide row.

## 9. Open items / ideas to explore
- Wire `policy.json` into the live scanners (once something is adopted); show learned rules in alerts.
- Make the scanner rules trade often enough to be measurable (current FX rules 0 trades / 21 years).
- Owner's own discretionary picks vs the alerts: journal (`/took`) + live tracker comparison after a few months.
- CHKP / LHX / STN stock arrivals were seeded on Oct 30 and possibly never sent.
- Unanswered: must both trend-line anchors be strict pivots? (both AIs said yes).
- Not built: M1/M5 charts, non-US/Canada exchanges (Tokyo, London, India), /settings, /export, /backtest, languages.
- Options trading lessons (Baker-style S&D on options, IBKR demo) were discussed; no tooling yet.
- Grok / Gemini reviews of the strategy and the merged test plan are summarised in the chat history, not in the repo.
