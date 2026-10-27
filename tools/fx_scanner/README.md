# RamanFX FX scanner

Automated forex (and watchlist CFD) zone scan with **the same Raja rules and the same top-down nesting as the stock
scanner** (`tools/stock_scanner/zones.py` is imported, not copied), on the chain **MN → W1 → D1 → H4** with 3M as
the top context. Runs after every H4 close on GitHub Actions (polled at :17 / :47 each hour; a run with no unscanned
H4 candle stops in seconds, a dropped run is caught up by the next) and sends **instant Telegram alerts when something
new happens**, one compact **H4 digest** after every new H4 candle (`FX_H4_DIGEST`, default `true`: counts, top 5
watchlist instruments in / near located zones, or "No new setups"), plus one daily summary, so you do not have to watch charts during the day job. Results also go to the app
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
- **Watchlist mapping** (`watchlist.py`): `BASEQUOTE` → `BASE_QUOTE` (the reversed pair is **never** used: CHFSGD
  on SGD_CHF would invert every level; it is listed unmapped "only the inverse pair on OANDA"), plus Pepperstone CFD
  names: SPOTCRUDE→WTICO_USD, SPOTBRENT→BCO_USD, NATGAS→NATGAS_USD, COPPER→XCU_USD, US500→SPX500_USD, US30, NAS100,
  US2000, GER40→DE30_EUR, FRA40→FR40_EUR, EUSTX50→EU50_EUR, UK100→UK100_GBP, JPN225→JP225Y_JPY (else JP225_USD), CHINAH→CHINAH_HKD, AUS200→AU200_AUD,
  HK50→HK33_HKD, CN50, NETH25→NL25_EUR, SPA35→ESPIX_EUR, SWI20→CH20_CHF, CORN, WHEAT, SOYBEANS→SOYBN_USD, SUGAR,
  BTCUSD→BTC_USD …, each checked against the account's list. Not on OANDA (CA60, SCI25, VIX, CATTLE, COCOA,
  COFFEE, COTTON, LDSUGAR, GASOLINE, EURX, JPYX, most crypto on OANDA Canada) → `unmapped` in `latest.json` ("not on
  OANDA"). **USDX** is computed from OANDA pairs with the ICE formula
  `50.14348112 × EURUSD^-0.576 × USDJPY^0.136 × GBPUSD^-0.119 × USDCAD^0.091 × USDSEK^0.042 × USDCHF^0.036`
  (open / close exact, wicks = the bound of the parts' extremes; D1 / W1 / MN wicks from the synthetic H4 bars where
  the H4 history covers them). USDX and the futures CFDs are **context only** (see Rules).
- **Gold**: Raja does not trade XAUUSD on the low timeframes and prefers XAUAUD: XAUUSD H4 zones are blocked
  (`FX_GOLD_USD_MIN_TF=D1`), every gold signal carries the note.

## The clock (Pepperstone server time)

Candles are asked with `alignmentTimezone=America/New_York&dailyAlignment=17&weeklyAlignment=Friday`, i.e. the day
closes at 17:00 New York = Pepperstone's MT4 / MT5 server midnight (GMT+2 winter / GMT+3 summer). Every bar is
labelled in server time (`fxcfg.label`, New York + 7 h): H4 bars start at 00/04/08/12/16/20 server time
(= 17/21/01/05/09/13 New York), days at 00:00, weeks on the Sunday-evening open, months on the 1st (server-time
month). Only `complete: true` candles are used. Crypto CFDs trade at weekends: their weekend candles are kept, but the
workflow does not run on Saturdays.

## Rules

Same Raja logic as the stock scanner (`zones.py`), on the FX chain. **Owner: "I don't want any false signals"**: where
a lesson is ambiguous the scanner takes the **stricter** reading (marked *stricter*). Citations: L-numbers of
`src/core/mentors/raja/*` and the checklist `src/core/checklists/raja.ts`; ZV = ZoneVision (`RFX_ZoneCore.mqh`, Raja
template). A BUY / SELL needs **every** rule below to pass; a strong zone that fails only *confirmation-only* rules
(marked **→ WATCH**) becomes a WATCH (confirm one TF lower / wait), any other failure drops it.

**Zones and data**
- Zones are built on **BID** candles (OANDA `price=BA`): Pepperstone MT4 / MT5 charts and ZoneVision plot bid. Base 1-6
  basing candles (body < 50% of the range); **7+ basing candles = not a zone** (L55). Proximal on the bodies, distal on
  the wicks (L55). Removed only by a candle **close** beyond the distal (L4, L50, L54, L106).
- **Departure ≥ 2x the biggest base candle** for set and forget (L55; ZV accepts 1.2x) **→ WATCH**.
- **Fresh = first touch only** (L1, L2, L52). A touch is any bar reaching the proximal on the zone's TF **or by an H4
  bar of the HTF bar that is still forming** (a W1 zone hit on Tuesday is tested, not fresh), price inside the zone
  counts as a touch, and a news (emotional) candle's tap counts too (*stricter*; it is still ignored for removal,
  L2 Apr 30). 2nd / 3rd touch **→ WATCH 'tested'**; more = dropped.
- Zone type ARR / WOW / STR (L1, L51); overlap / flip = confirmation only, never set and forget (L2, L52, L104); not
  a zone that already did its job (L5, Feb 18); not the 3rd CP in a row (L8, Kevin L13); never sideways (L8, L101).

**Top-down location (owner + L6, L7)**
- An H4 zone needs a **touched D1 host**, that D1 host a **touched W1 host**, that W1 host a **touched MN host**:
  the **full chain MN → W1 → D1 → H4**, no gap (a host with no strong zone above it blocks; *stricter*,
  `zones.location(strict_chain=True)`). 3M is context: it blocks only with a strong untouched 3M zone within 5%.
- A host must be strong (ARR / WOW / STR), not overlap / flip / done, penetrated ≤ 75% (Kevin L13), and **at most 1
  earlier visit on D1 / W1, 2 on MN** (Raja: MN 2nd / 3rd confirm, 4th breaks; D1 / W1 3rd touch risky, L2, L52,
  L102, Mar 5; ZV cap 2; *stricter*: D1 / W1 1). A host visited before is only confirmed by an **arrival** entry
  zone (L2, L52, L105) **→ WATCH**.
- An untouched strong HTF zone still in the way → "HTF area not reached".

**Direction, curve, opposite zones**
- Raja table with ZV's +1 row (`InpDirTable=3` + `InpDirPlus1`): **H4 → D1 → W1 (+ MN)**, D1 → W1 → MN, W1 → MN → 3M,
  MN → 3M. Only a **FULL** direction trades: REDUCED (the +1 row or the entry TF disagrees = a correction) **→ WATCH**
  (L5, L102: H4 and below impulses only; Kevin: set and forget only when HTF and ETF trends agree).
- Curve: low 25% buys only, high 25% sells only, up to 50% confirmation (L4, Feb 10); owner ATH / ATL rule.
- **Never buy inside / next to a supply** (L50, L4 course 3): the zone must not sit within one zone height of a
  not-removed opposite zone of **any** higher TF (ZV checks one level up; *stricter*: all), and price must not sit
  inside any not-removed opposite zone (fresh **or tested**) of the zone's TF or higher; a fresh HTF opposite zone
  around price locks the side.

**Trendlines (L4, L8, L102-L107)**
- Limit orders only at **a WOW (open run ≥ 3x the stop), a fresh arrival zone, or a zone right at its trendline**
  (L104 "blind entries"); any other strong zone **→ WATCH 'confirm'**.
- The own-side trendline touched 3x already: the next (4th) touch usually breaks (L4, L102, L103) → fail. A zone
  **more than 25 pips** from its trendline often breaks (L4 Jun 25, L107; ZV `InpRjFarFromLinePips=25`; *stricter*:
  25 not 30) → fail (H4 / D1).
- **Out of trendline** (L8, L52, L106): the own-side line the zone was built on was crossed after it formed, or the zone
  formed beyond an already crossed own-side line without an arrival since → fail.

**Room, plan, costs**
- Target = **7 pips** (`FX_TP_OFFSET_PIPS`, ZV `InpTpOffsetPips=7`; Raja 5-10 pips, L7, L9, L106) before the
  **nearest not-removed opposite zone of any TF** (lower and higher, tested ones too: L9 "nearest opposing level",
  Baker "never buy with supply overhead"); none → Raja's 250% projection (L5). **Room ≥ 2x the stop** (L7, L53); no
  target → no trade (L101).
- Entry / stop / target are on the bid chart with the spread on the ask side: **BUY limit = proximal + spread**,
  buy stop = distal − % of the height; **SELL limit = proximal**, sell stop = distal + % + spread, sell target + spread
  (Kevin L6). Stop % of the zone height: H4 15, D1 10, W1 5, MN 3 (min 3 pips). R:R on these levels.
- Spread ≤ 10% of the stop (`FX_MAX_SPREAD_FRAC`).
- **Pips as on Pepperstone MT5**: gold / platinum / palladium 0.1, silver 0.01 (ZV `InpPipXAU=0.1`), JPY 0.01, else
  0.0001 (OANDA `pipLocation`).

**Markets and timeframes**
- **BUY / SELL limits only on H4 and D1**: W1 / MN zones are areas for direction and location (L6, L7, L53 seven-step
  board: "a monthly zone with a 1,000-pip stop is a mistake") **→ WATCH 'area'** (drill down).
- No XAU_USD on H4 (L53, L107: use XAU_AUD). Indices / CFDs daily and above, TRY pairs weekly and above (L53 Feb 18,
  Apr 7) → fail on lower TFs.
- **Context only (WATCH 'context', never an order)**: USDX (synthetic spot DXY; Pepperstone USDX follows the ICE futures,
  wicks are an upper bound) and the futures-based CFDs (BCO, WTICO, NATGAS, XCU, CORN, WHEAT, SOYBN, SUGAR: OANDA and
  Pepperstone roll on different dates and may quote in different units).
- No new H4 set and forget from Friday 12:00 server time (weekend gap; L53 Apr 30, L7 Jun 25) **→ WATCH**.

**Not implemented (documented gaps)**: news calendar (L2 Apr 30, L103, Kevin L12), the P-vs-CP and stacked-zone
choice (L102, L104, L6), the gap rule (L6, L55), nested curves (L4 Feb 10), the MN → 3M → 6M direction chain. These
can only make the scanner stricter later; none of them can create a signal today.

**Positive test**: `tests/test_fx_rules.py` builds the textbook chain by hand (`fixtures/textbook_fx.py`: MN, W1 and D1
demands nested and touched for the first time, an H4 arrival zone 10 pips below price) and requires exactly one H4
BUY (and the mirrored SELL); each fix above has a negative test.

- Outputs: **BUY** at a located demand, **SELL** at a located supply, **WATCH** (`watch_kind`: `new` = new located zone
  with price still away, `tested` = 2nd / 3rd touch, `confirm` = confirmation entry only, `area` = W1 / MN area,
  `context` = context-only instrument). Lists per side: **in / approaching / left** (left = touched
  in the last 6 H4 bars and closed back out).

## Telegram (only news)

- Every instrument: a **new BUY / SELL**; a **cancelled** signal with the reason (zone removed, stop level hit, entry
  touched, a rule failing now). No "Cancelled" for an instrument without data this run (fetch error, time budget,
  `--only`): it is carried over silently. A signal whose only failing rule is "price not near the entry" stays
  (a limit order does not expire with distance), and a cancelled signal is not re-announced for `FX_DEDUPE_HOURS`.
- When Telegram fails, the alert state is not advanced: the same events are sent again by the next run.
- Watchlist instruments also: a **new WATCH**, and price newly **entering / approaching a located strong zone**
  (each zone at most every `FX_DEDUPE_HOURS`, 24 h).
- **Daily summary** with the first run after the D1 close (21:05 UTC summer / 22:05 UTC winter): signals (entry /
  stop / target / R:R / pips / chain), then in / approaching / left per side, watchlist sections first, then classes.
- The dedupe state lives in `.cache/state.json` (actions/cache). With no state (first run, lost cache) one "started"
  message + the summary is sent instead of replaying every event.
- Failures (no token, OANDA unreachable, < 50% of the instruments with data, **a failing unit test**): at most one
  message per day, nothing published, the run is red. A candle off the server-time grid (H4 / D1 / W1 not on a
  boundary, MN more than 12 h off the 1st) drops that instrument for the run (`fxcfg.Misaligned`).

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
`FX_APPROACH_H` (1.0), `FX_NEAR_H` (1.0), `FX_LEFT_BARS` (6), `FX_NEW_BARS` (6), `FX_TP_OFFSET_PIPS` (7),
`FX_MIN_LEG_X` (2), `FX_TL_FAR_PIPS` (25), `FX_TL_MAX_TOUCHES` (3), `FX_HOST_MAX_DEPTH` (75), `FX_WEEKEND_FROM_H` (12),
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
