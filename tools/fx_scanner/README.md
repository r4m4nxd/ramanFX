# RamanFX FX scanner

Automated forex (and watchlist CFD) zone scan with **the same Raja rules and the same top-down nesting as the stock
scanner** (`tools/stock_scanner/zones.py` is imported, not copied), on the chain **MN → W1 → D1 → H4** with 3M as
the top context. Runs every 4 hours on GitHub Actions and sends **Telegram messages only when something new
happens**, plus one daily summary, so you do not have to watch charts during the day job. Results also go to the app
at `/scanner/fx` (Stocks | Forex switch on the scanner page).

**Broker: Pepperstone. Data: OANDA.** Pepperstone has no public REST price API, so prices come from OANDA's free
v20 API (practice account). Every symbol is shown with its **Pepperstone name** (EURUSD, XAUUSD, SPOTCRUDE, US500,
GER40 …) and TradingView links open `PEPPERSTONE:<symbol>`; the OANDA instrument is only a "data: OANDA" note.
OANDA and Pepperstone quotes can differ by a few pips: **check every level on your Pepperstone chart (ZoneVision MT5)
before placing**. An exact Pepperstone feed would need the cTrader Open API (app registration + OAuth, protobuf
messages): a possible later upgrade, not implemented.

> Rule-based scan, not financial advice. Our own forex research on the mechanical zone rules was negative after costs
> (docs/research/Evidence_Review_2026-10.md): treat signals as a shortlist to check, not orders.

Standard library only (Python 3.10+).

## Setup (once)

1. **OANDA demo account** (free; OANDA Canada works): oanda.com → *Open demo account* → log in → *My Account* →
   **Manage API Access** → *Generate* → copy the token.
2. GitHub repo → Settings → Secrets and variables → Actions → New repository secret:
   - **`OANDA_API_TOKEN`** = the token (a live account token: also set the variable `OANDA_ENV=live`).
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`: the same bot as the stock scanner (see its README).
   - optional `FX_WATCHLIST`: your TradingView watchlist export (overrides `watchlist.txt`, keeps it private).
3. **Watchlist** (`tools/fx_scanner/watchlist.txt`): TradingView → the watchlist's **⋯** menu → **Export list** →
   paste the file's content (comma-separated or one per line, `###Section` headers, `PEPPERSTONE:EURUSD`, `OANDA:…`,
   `FX:…`, `TVC:GOLD` all work). Sections become the groups in Telegram and the app.
4. Actions → **FX scan** → *Run workflow* once. The first run downloads the history (one request per instrument and
   timeframe: H4 5,000 bars ≈ 3 years, D1 ≈ 19 years, W1 / MN all); later runs fetch only the new candles.

## What gets scanned

- **Instruments**: at runtime `GET /v3/accounts` (account id from the token) → `/v3/accounts/{id}/instruments`,
  cached weekly (`.cache/instruments.json`); fallback `instruments.json` (committed). Type `CURRENCY` (majors,
  crosses, exotics) and `METAL` are scanned; CFDs (indices, energy, softs, bonds) only with `FX_INCLUDE_CFD=true`, **except
  watchlist CFDs, which are always scanned**. Classes: Majors (USD vs G8) · Crosses (two G8, no USD) · Exotics (any non-G8
  currency, tagged "exotic · wide spread") · Metals · CFDs.
- **Watchlist mapping** (`watchlist.py`): `BASEQUOTE` → `BASE_QUOTE` (reversed pair tried), plus Pepperstone CFD
  names: SPOTCRUDE→WTICO_USD, SPOTBRENT→BCO_USD, NATGAS→NATGAS_USD, COPPER→XCU_USD, US500→SPX500_USD, US30, NAS100,
  US2000, GER40→DE30_EUR, FRA40→FR40_EUR, EUSTX50→EU50_EUR, UK100→UK100_GBP, JPN225→JP225_USD, AUS200→AU200_AUD,
  HK50→HK33_HKD, CN50, NETH25→NL25_EUR, SPA35→ESPIX_EUR, SWI20→CH20_CHF, CORN, WHEAT, SOYBEANS→SOYBN_USD, SUGAR,
  BTCUSD→BTC_USD …, each checked against the account's list. Not on OANDA (CA60, CHINAH, SCI25, VIX, CATTLE, COCOA,
  COFFEE, COTTON, LDSUGAR, GASOLINE, EURX, JPYX, most crypto on OANDA Canada) → `unmapped` in `latest.json` ("not on
  OANDA"). **USDX** is computed from OANDA pairs with the ICE formula
  `50.14348112 × EURUSD^-0.576 × USDJPY^0.136 × GBPUSD^-0.119 × USDCAD^0.091 × USDSEK^0.042 × USDCHF^0.036`
  (open / close exact, wicks = the bound of the parts' extremes).
- **Gold**: Raja does not trade XAUUSD on the low timeframes and prefers XAUAUD: XAUUSD H4 zones are blocked
  (`FX_GOLD_USD_MIN_TF=D1`), every gold signal carries the note.

## The clock (Pepperstone server time)

Candles are asked with `alignmentTimezone=America/New_York&dailyAlignment=17&weeklyAlignment=Friday`, i.e. the day
closes at 17:00 New York = Pepperstone's MT4 / MT5 server midnight (GMT+2 winter / GMT+3 summer). Every bar is
labelled in server time (`fxcfg.label`, New York + 7 h): H4 bars start at 00/04/08/12/16/20 server time
(= 17/21/01/05/09/13 New York), days at 00:00, weeks on the Sunday-evening open, months on the 1st (server-time
month). Only `complete: true` candles are used. Crypto CFDs trade at weekends: their weekend candles are kept, but the
workflow does not run on Saturdays.

## The rules (same as the stock scanner, FX chain)

- **Top-down location (first rule)**: an H4 zone counts only once price has touched (in the current visit, H4 bars
  first) a strong D1 zone (ARR / WOW / STR, ≤ 3 touches, not removed) of the same side that it overlaps; a D1 zone
  needs a touched W1 zone, a W1 zone a touched MN zone, and so on up to MN, the top tradeable level. The 3M level is
  context: it blocks only when a strong untouched 3M zone is within `FX_SOFT_REACH_PCT` (5%) of price. An untouched
  strong HTF zone still in the way → blocked **"HTF area not reached"**. Supply mirrored for shorts. Each signal
  carries the chain, e.g. `MN demand … touched ✓ → W1 demand … touched ✓ → D1 demand … touched ✓ → H4 entry …`.
- **Direction** (Raja table one level up): H4 = H4 → D1 → W1, D1 = D1 → W1 → MN, W1 = W1 → MN → 3M, MN = MN → 3M;
  the curve on the chain's top row; the owner's ATH curve rule, mirrored for shorts (ATL).
- Fresh, zone type ARR / WOW / STR, no opposite HTF zone on top, room ≥ 2x the stop to the next opposite zone (else
  the 250% projection), not sideways, no 3rd CP, has not done its job, not overlap / flip, price within 1x the zone
  height of the proximal, **spread ≤ 10% of the stop** (`FX_MAX_SPREAD_FRAC`; typical spread = median H4 close
  spread from OANDA bid / ask candles).
- **Plan**: entry = proximal; **stop = distal + % of the zone height: H4 15%, D1 10%, W1 5%, MN 3%** (min 3 pips);
  target = 0.05% of price before the next opposite proximal. Pips via OANDA's `pipLocation` / `displayPrecision`
  (JPY pairs 0.01, gold 2 decimals).
- **BUY** at a located demand, **SELL** at a located supply, **WATCH** (new located zone with price still away, or a
  2nd / 3rd touch that needs a confirmation one TF lower). Lists per side: **in / approaching / left** (left = touched
  in the last 6 H4 bars and closed back out).

## Telegram (only news)

- Every instrument: a **new BUY / SELL**; a **cancelled** signal with the reason (zone removed, stop level hit, entry
  touched, a rule failing now).
- Watchlist instruments also: a **new WATCH**, and price newly **entering / approaching a located strong zone**
  (each zone at most every `FX_DEDUPE_HOURS`, 24 h).
- **Daily summary** with the first run after the D1 close (21:05 UTC summer / 22:05 UTC winter): signals (entry /
  stop / target / R:R / pips / chain), then in / approaching / left per side, watchlist sections first, then classes.
- The dedupe state lives in `.cache/state.json` (actions/cache). With no state (first run, lost cache) one "started"
  message + the summary is sent instead of replaying every event.
- Failures (no token, OANDA unreachable, < 50% of the instruments with data): at most one message per day, nothing
  published, the run is red.

Preview without sending: `python3 tools/fx_scanner/fxscan.py --preview-telegram`.

## Files

| File | What it does |
|---|---|
| `fxcfg.py` | settings (env), chain, stop table, classes, pips, the server-time clock |
| `oanda.py` | OANDA v20 client: candles (cold 5000 / incremental `from=`), account instruments; cache in `.cache/candles` |
| `watchlist.py`, `watchlist.txt` | TradingView export → OANDA instruments, Pepperstone names |
| `fxcore.py` | the rules (zones.py on the FX chain), signals, lists, checks |
| `fxnotify.py` | Telegram cards, alerts, the daily summary (uses the stock scanner's sender) |
| `fxscan.py` | CLI, run, outputs, events / dedupe, USDX, `--selftest`, `--preview-telegram` |
| `SCHEMA.md` | the `public/fx/*.json` contract used by the app |
| `instruments.json` | fallback instrument list |
| `fixtures/` | synthetic H4 generator, `sample/` = selftest output (app demo data) |
| `../../.github/workflows/fx-scan.yml` | the schedule |

Outputs: `public/fx/latest.json`, `public/fx/d/<class>.json` (per-instrument detail with H4 / D1 / W1 bars).

## Run locally

```bash
export OANDA_API_TOKEN=...            # never commit it
python3 tools/fx_scanner/fxscan.py --force --no-notify
python3 tools/fx_scanner/fxscan.py --only EURUSD,XAUAUD --no-notify
python3 tools/fx_scanner/fxscan.py --selftest
python3 -m unittest discover -s tools/fx_scanner/tests
```

Env (defaults): `OANDA_ENV` (practice), `FX_INCLUDE_CFD` (false), `FX_WATCHLIST`, `FX_SOFT_REACH_PCT` (5),
`FX_APPROACH_H` (1.0), `FX_NEAR_H` (1.0), `FX_LEFT_BARS` (6), `FX_NEW_BARS` (6), `FX_TP_OFFSET_PCT` (0.05),
`FX_MAX_SPREAD_FRAC` (0.10), `FX_GOLD_USD_MIN_TF` (D1), `FX_DEDUPE_HOURS` (24), `FX_BUDGET_MIN` (25),
`FX_MIN_COVERAGE` (0.5), `FX_WORKERS` (4), `FX_TELEGRAM_LIST_CAP` (12), `FX_APP_URL`, `FX_CACHE`.
Network: OANDA allows ~120 requests/s; we pace ~16/s per host, with the stock scanner's time budget and circuit
breaker (401 / 403 open it at once; 429 / 5xx one short retry).

MT5 users can cross-check any signal with ZoneVision (`public/tools/RamanFX_ZoneVision.mq5`, Raja template) on the
Pepperstone chart.

## Backtest (do the rules make money?)

`fx_backtest.py` replays the live rules walk-forward on real OANDA history: at every H4 close it calls the scanner's
own `fxcore.analyse` + `fxcore.signals` on the bars closed at that moment (no look-ahead), turns each new BUY / SELL
into a limit order at the proximal with the scanner's stop and target, and simulates it on H4 bid / ask (spread paid;
stop first when one candle hits both; the fill candle cannot hit the target; expiry H4 5 / D1 15 / W1 45 / MN 120
days; cancelled when price reaches the target first). Stats per class, entry TF, zone type, pattern, Raja score and
side: fill rate, win rate, expectancy R, profit factor, max drawdown R, longest losing streak, bootstrap 95% CI,
in-sample (older 70%) vs out-of-sample (recent 30%). Ablations: (a) full rules, (b) without the top-down nesting
rule, (c) without the spread filter, (d) watchlist majors only.

Run it from GitHub: Actions -> **FX backtest** -> Run workflow (inputs `years` = `max` or a number, `instruments` =
names or `watchlist`, `max_instruments`). It caches the full history (`fx-bt-*`), stops evaluating after 270 minutes
(results then say `partial`) and commits `public/fx/backtest.json` + `docs/research/FX_Backtest.md`.

```bash
python3 tools/fx_scanner/fx_backtest.py --selftest                   # synthetic, no network
python3 tools/fx_scanner/fx_backtest.py --instruments EURUSD --years 3
python3 -m unittest tools/fx_scanner/tests/test_fx_backtest.py
```
