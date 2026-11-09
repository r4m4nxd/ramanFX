# Project summary: RamanFX

## Project
- **Name:** RamanFX
- **Purpose:** a personal trading-research platform that scans forex, metals, indices and stocks for supply-and-demand
  setups, sends plain-English alerts through a Telegram bot and web app, and tests its own rules on historical data.
- **Who uses it:** the owner (a retail trader) daily, plus invited guest users of the Telegram bot (guest access with
  per-user settings and no access to the owner's data).

## Tech stack
- **Languages:** TypeScript, Python (standard library only for the scanners), Deno (TypeScript) for serverless
  functions, MQL4/MQL5 (MetaTrader indicators and an expert advisor), Pine Script (TradingView), Bash, YAML.
- **Front end:** React + Vite + Tailwind CSS web app (deployed on Vercel).
- **Back end:** Supabase (Postgres tables, Edge Functions on Deno), GitHub Actions as the job scheduler
  (26 workflows), a separate git branch used as the data store for generated files.
- **Image rendering:** SVG generated in code, converted to PNG on the server with resvg (WebAssembly).
- **Testing:** Vitest (about 600 TypeScript tests), Python unittest (about 750 tests across 11 suites),
  TypeScript type checks.
- **Not used:** Power Platform (Power BI, Power Apps, Power Automate), DAX, stored procedures, OpenAI.

## APIs and data sources
- cTrader Open API (Pepperstone prices, 139 symbols, streaming and historical candles) with weekly OAuth token refresh.
- OANDA REST API (forex history back to 2005, used for backtests and as a fallback feed).
- Alpaca Market Data API (US stock daily, hourly and live prices).
- Questrade API (Toronto Stock Exchange prices, rotating single-use refresh tokens).
- SEC EDGAR (insider Form 4 filings, 13F holders, 8-K filings, financial statements in XBRL).
- Telegram Bot API (webhook bot, inline buttons, photo cards, share links).
- StockTwits (public sentiment counts), economic calendar and news headline feeds.

## Data model
- Supabase tables for the cTrader and Questrade OAuth tokens (service-role access only), user alert preferences,
  mutes, quiet hours, watchlists, guest users and a trade journal.
- JSON data files on a dedicated data branch: latest forex and stock scans, per-symbol zone details, arrival and
  direction-change state, insider and holder data, fundamentals, live-outcome ledgers, backtest experiment results and
  the learner's policy file.
- No DAX measures, views or stored procedures (the analysis is done in Python and TypeScript).

## Major features
- **Market scanners:** an hourly forex/metals/indices scan of 154 instruments across six timeframes, and a daily stock
  scan of about 1,100 stocks (US and Toronto), both finding supply-and-demand zones, trend lines, trend changes and
  trade setups.
- **Alerts:**
  - Forex arrival and confirmation alerts.
  - Direction-change alerts in 3 steps.
  - An hourly forex check, a daily summary, stock signals, weekly turns, big price moves, insider buying alerts.
  - Economic-event reminders and a 6 AM morning brief.
  - Quiet hours and per-symbol mutes.
- **Telegram bot** (about 35 commands):
  - Understands plain words ("gold", "should I buy apple") as well as tickers.
  - One-tap buttons on every reply.
  - A shareable summary image card: price, trend, buy and sell areas, a 90-day chart, key points, company numbers,
    sentiment and news.
  - Chart images showing four timeframes.
  - Company and economy pages, insider and holder lookups, a long-term (TFSA) buy list, price alerts, a help menu.
- **Web app screens:** dashboard, forex and stock scanners, chart page, calendar and news, insiders, market hours,
  heatmaps, journal, planner, playbook, checklist, calculators, lessons and an in-app guide.
- **MetaTrader and TradingView tools:**
  - A zone-drawing indicator and an automated trading bot (expert advisor) with presets.
  - A bot-view indicator that draws the scanner's zones on the chart.
  - A parallel-channel tool with a midline.
  - A "draw and measure" tool that annotates the owner's own drawings.
  - A Pine Script port of the strategy.
- **Self-learning system:**
  - Every published trade idea is tracked on later candles: fill, stop, target, best and worst move.
  - Monthly backtests test 17–19 rule changes each, on three rule sets.
  - A learner adopts a change only if it wins on recent data it was not tuned on (minimum sample sizes, at most three
    changes a month) and reports the decision in the bot.
- **Research studies:**
  - Walk-forward backtests with costs.
  - A 62-hypothesis study with false-discovery control.
  - A benchmark study of published strategies (trend following, breakouts, mean reversion).
  - A long-term buy-and-hold study of 38,000 stock purchases against random-day and index benchmarks.

## Hard problems solved
- **Trustworthy backtests:** walk-forward evaluation with no look-ahead (tests that change future bars and check past
  decisions don't move), bid/ask fills, spreads, in-sample vs out-of-sample splits, random instrument halves,
  week- and month-block bootstrap confidence intervals, and Benjamini-Hochberg multiple-testing control.
- **Cost-efficient experiments:** signals are computed once per time step and shared across about 20 rule variants, so
  testing many variants kept runtime at or below the original single-rule backtest.
- **Rotating single-use OAuth tokens** (Questrade, cTrader): the job first checks that the database can be written to
  before spending a token, so a failed save never loses access.
- **Deployment limits:** hosting allows about 100 deploys a day while jobs write 50–100 times a day. Fixed by moving all
  generated files to a separate data branch that never deploys, enforced by automated tests.
- **Concurrent jobs writing shared state:** each job owns its files and retries rebasing pushes, so no updates are lost.
- **Plain-English UX for beginners:**
  - Rewrote every bot and alert message to remove jargon.
  - Added natural-language symbol lookup and buttons on every dead end.
  - Ran a simulated UX stress test (100 scripted inputs across four user skill levels) and fixed the failures it found.
- **Reliable delivery:** alert state is only marked sent after Telegram accepts the message. Failed sends are retried
  on the next run, and duplicate alerts are suppressed across runs.
- **Server-side image generation:** chart and summary cards rendered as SVG and converted to PNG inside a serverless
  function, with font subsetting and caching.

## Documentation produced
- Strategy one-pager with a review prompt for other AI models, and a combined rulebook merging four mentors' rules
  with 20 documented conflicts.
- Research reports: forex and stock backtests, three arrival-study rounds, the benchmark study, the long-term buying
  study and an overnight learning report with recommendations.
- Bot feature guide, an in-app user guide, a workflow/data-branch guide, and a project memory hand-off document for
  new developers.

## Numbers
- 154 forex/metal/index instruments scanned hourly; about 1,100 stocks scanned daily (118 on the Toronto exchange).
- Forex scan runtime about 1–3 minutes; stock scan about 2 minutes; 26 automated workflows, several thousand runs.
- Backtest data: 115 markets back to 2005; 736 stocks over 10 years; about 35,000 zone trades and 3,700 arrival
  trades simulated; 38,000 long-term buy events studied.
- Research runtime: 62-hypothesis study in 48 minutes; benchmark study in about 1 minute of compute.
- About 600 TypeScript tests and about 750 Python tests.
- Bot traffic: about 250 requests on a typical day.
- Time saved for the user was not measured.
