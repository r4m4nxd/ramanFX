# RamanFX stock scanner

Daily scan of US stocks (S&P 500, Nasdaq-100, Dow 30, Russell 2000) for **BUY setups at fresh demand zones** and
**EXIT warnings near supply**, strictly by the mentors' supply & demand rules: **Raja first, Kevin second**, exactly
as ZoneVision's Raja template implements them. Results go to Telegram (grouped by sector) and to the app at
`/scanner`.

> Rule-based scan, not financial advice. **Untested on stocks until the backtest says otherwise.** The rules were
> taught on forex charts; our own forex research on the mechanical zone rules was negative after costs
> (docs/research/Evidence_Review_2026-10.md). Run the backtest before trusting a single signal.

Standard library only (Python 3.10+). No `pip install`.

## Files

| File | What it does |
|---|---|
| `universe.py` | Index lists → `universe.csv` (symbol, name, sector, cik, indexes). Weekly refresh. |
| `data.py` | Daily OHLCV (10 y) from **Alpaca Market Data** (primary, multi-symbol batches, split + dividend adjusted), Yahoo / Stooq per-ticker fallbacks; incremental updates, cache, rate limit, threads; weekly / monthly bars. |
| `zones.py` | The Python port of the ZoneVision Raja logic (pure functions). |
| `scan.py` | The rules → BUY / WATCH / EXIT, JSON for the app, CLI. |
| `fundamentals.py` | SEC EDGAR XBRL companyfacts → compact table (context only). |
| `notify.py` | Telegram messages (HTML, per sector, split < 4000 UTF-16 units). |
| `backtest.py` | Walk-forward backtest of the same rules. |
| `selftest.py` | Whole pipeline on synthetic fixtures (`scan.py --selftest`). |
| `holdings.json` | Your positions for EXIT warnings (or the `HOLDINGS_JSON` secret, preferred). |
| `fixtures/` | Synthetic price generator, a hand-made SEC companyfacts file, `latest.sample.json` (app demo data). |
| `../../.github/workflows/stock-scan.yml` | Weekdays 21:45 UTC: tests, scan, Telegram, commit `public/scanner/*.json`. |

## Setup (once)

0. **Price data: a free Alpaca account** (required on GitHub Actions: Yahoo answers 429 and Stooq a browser check
   to GitHub runners). Sign up at alpaca.markets (free, no funding needed) → open the **Paper Trading** account →
   **API Keys** → *Generate New Keys* → copy the **Key ID** and the **Secret Key** (shown once). Add them as the
   repository secrets **`ALPACA_KEY_ID`** and **`ALPACA_SECRET_KEY`** (step 2). The free plan's market data is
   enough: the scanner asks for the consolidated `sip` feed (history ending 16 minutes ago, which the free plan
   allows) and switches to the `iex` feed by itself, remembered for a week, if Alpaca refuses `sip` (403).
1. **Telegram bot**: in Telegram open **@BotFather** → `/newbot` → pick a name → copy the **token**.
   Send your new bot any message, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and copy
   `message.chat.id` (a group: add the bot to the group, send a message there, the id starts with `-`).
2. **GitHub secrets** (repo → Settings → Secrets and variables → Actions → New repository secret):
   - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (required for Telegram; without them the scan only prints).
   - optional `HOLDINGS_JSON`: your positions, e.g. `[{"symbol":"AAPL","entry":190,"stop":182,"shares":10,"date":"2026-09-01"}]`
     (keeps positions out of the repository; `holdings.json` is used when the secret is empty).
   - `ALPACA_KEY_ID` and `ALPACA_SECRET_KEY` (step 0).
   - optional `SEC_UA`: a User-Agent with a contact, e.g. "RamanFX-scanner your-contact". SEC companyfacts
     (data.sec.gov, the fundamentals) works without it; `www.sec.gov/files/company_tickers.json` (CIKs the index
     lists do not give, mostly Russell 2000 names) answers 403 without a contact, so without `SEC_UA` that lookup is
     skipped with a one-line hint and those tickers show fundamentals n/a. Read from the secret only, never written.
3. Optional repository **variables**: `SCANNER_UNIVERSES` (default `SPX,NDX,DJI,RUT`), `TELEGRAM_TOP_N` (default 5).
4. Actions tab → **Stock scan** → *Run workflow* once to test. The first run downloads 10 years for every ticker
   from Alpaca in batches of 100 symbols (~10,000 bars per page, a few hundred requests, a few minutes at Alpaca's
   200 requests/min); later runs fetch only the last ~3 weeks in batches of 200 (one request per batch; a ticker
   whose overlap no longer matches after a split / dividend gets its full history again). Cache via `actions/cache`.

**No data, no output**: when fewer than half of the tickers (`SCANNER_MIN_COVERAGE`, 0.5) have price data, the scan
writes nothing (`latest.json`, `index.json`, the shards and the history stay as they were), sends no signals, sends
at most one short Telegram message per day ("scan failed: no price data" with the reason: missing Alpaca keys,
failing hosts, the most common error) and exits 2 so the run shows red.

Each run commits `public/scanner/latest.json` (signals), `public/scanner/history/<date>.json`,
`public/scanner/index.json` (every ticker, for the app's search) and `public/scanner/t/<0-63>.json` (that redeploys
the app).

**Search any ticker**: every analysed ticker (signal or not, illiquid ones flagged) gets a detail record: last 120
daily bars (packed), all active D1 / W1 zones with type / score / fresh / touches, nearest demand and supply with the
distance, the direction / curve state, the nearest demand checked against every BUY rule as if it were a signal, and
the fundamentals when cached. The app opens it at `/scanner/<TICKER>` (BRK.B -> BRK-B).
Why 64 shard files and not one file per ticker: the daily commit then touches ~67 files instead of ~2,600 (smaller
tree objects, faster checkouts and deploys); each shard is ~0.3 MB raw / ~60 KB gzipped, so a detail view downloads
one small shard; git stores yesterday's shard as a delta. The shard of a ticker is `crc32(symbol) % 64`, written in
index.json (`k`) so the app never has to compute it.

**Fundamentals for every ticker, politely**: SEC companyfacts is fetched at ~5 requests/s (SEC allows 10), each
company at most weekly (oldest first, capped at `SCANNER_SEC_PER_RUN`=600 per run, so the ~2,600 names spread over
the week), and the tickers that signalled get a refresh when older than a day. Only a small price-independent summary
is cached (`.cache/sec_lite`, kept by actions/cache); the multi-megabyte raw files are never stored.
Holdings never reach the JSON beyond the symbol and the warning kind; entries, stops and sizes go only to Telegram.

## Run locally

```bash
python tools/stock_scanner/universe.py --force                  # index lists (needs Wikipedia / iShares / SEC)
python tools/stock_scanner/scan.py --tickers AAPL,MSFT --no-notify
python tools/stock_scanner/scan.py --universes SPX,DJI --workers 6
python tools/stock_scanner/scan.py --offline --no-write --no-notify   # cached data only
python tools/stock_scanner/scan.py --selftest                   # fixtures, prints the Telegram text
python -m unittest discover tools/stock_scanner/tests
```

Env: `ALPACA_KEY_ID`, `ALPACA_SECRET_KEY` (without them: Yahoo / Stooq only, which may work from a home connection),
`ALPACA_BATCH_COLD` (100), `ALPACA_BATCH_UPDATE` (200), `SCANNER_MIN_COVERAGE` (0.5),
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `HOLDINGS_JSON`, `WATCHLIST`, `WATCHLIST_APPROACH_PCT`, `SEC_UA`, `SCANNER_UNIVERSES`, `SCANNER_WORKERS`,
`SCANNER_PAUSE` (seconds between requests per host, default 0.15), `SCANNER_MIN_PRICE` (5), `SCANNER_MIN_DOLLAR_VOL`
(5e6), `TELEGRAM_TOP_N` (5), `SCANNER_APP_URL`.

**Bounded runtime**: `SCANNER_BUDGET_MIN` (50) is a global time budget: after it no new download starts, queued
tickers use their stale cache and the scan, write and notify go on with what there is (`latest.json` gets
`"partial": true`). Each host has a circuit breaker: after `SCANNER_BREAKER_N` (5) consecutive 401 / 403 / 429 / 5xx /
timeouts / wrong bodies (e.g. Stooq's HTML limit page instead of CSV) it is skipped for `SCANNER_BREAKER_COOLDOWN`
(300 s) and the next source is used (Alpaca: a 401 / 403 on the `iex` feed, i.e. rejected keys, opens it at once).
Requests time out after `SCANNER_TIMEOUT` (15 s max), a Retry-After above 5 s fails the call instead of waiting
(Alpaca: a 429 waits for its Retry-After / X-RateLimit-Reset up to 65 s, requests are spaced 0.31 s apart), and the Yahoo earnings lookup stops after its first 401 (crumb). SEC downloads are
capped per run at `SCANNER_SEC_PER_RUN` companies, `SCANNER_SEC_COLD_CAP` (150) of them never cached before, and
`SCANNER_SEC_BUDGET_MIN` (8) minutes. The log prints progress every 50 tickers and the time of each phase
(fetch / fundamentals / analyse / write / notify). In the workflow the scan step times out at 70 min (job: 90), and
the cache save and the commit run even when the scan failed, so partial results and downloads are kept.

## Universes

| Code | Index | Source |
|---|---|---|
| SPX | S&P 500 | Wikipedia `List_of_S%26P_500_companies` (GICS sector, CIK) |
| NDX | Nasdaq-100 | Wikipedia `List_of_NASDAQ-100_companies` (the table moved off the `Nasdaq-100` article in July 2026; ICB industry mapped to GICS names) |
| DJI | Dow 30 | Wikipedia `List_of_Dow_Jones_Industrial_Average_companies` |
| RUT | Russell 2000 | iShares IWM holdings CSV (equity rows, `Sector` column; three plain public URL variants); fallback `russell2000_snapshot.csv` |

Tickers in several indexes are one row (`indexes` = `SPX,NDX,DJI`). Missing CIKs come from SEC `company_tickers.json`
(only with `SEC_UA`).

### Russell 2000 snapshot

From GitHub runners iShares returns an HTML page instead of the holdings CSV (every URL variant tried is a plain
public GET; no cookies or browser tricks are used). Then RUT comes from `tools/stock_scanner/russell2000_snapshot.csv`,
and without that file RUT is empty (the refresh and the scan log say so). To add or update the snapshot by hand:

1. Open the iShares Russell 2000 ETF (IWM) page in a browser → *Holdings* → **Detailed Holdings and Analytics** /
   *Download* (CSV).
2. Save the downloaded `IWM_holdings.csv` as `tools/stock_scanner/russell2000_snapshot.csv`, unchanged (the scanner
   reads the raw iShares file: the preamble's "Fund Holdings as of" line becomes the snapshot date, equity rows only).
3. Commit it and run the workflow with *Refresh the index lists* ticked (or `python tools/stock_scanner/universe.py
   --force` locally, which also works when iShares serves the CSV to your connection and then rewrites the snapshot).

Refresh it every month or two; `latest.json` records the snapshot date (`rut_snapshot`).
**Liquidity filter**: names that are only in the Russell 2000 must close ≥ $5 with a 20-day average dollar volume
≥ $5M; the number skipped is reported in Telegram and the app.

## The rules (each mapped to the lesson / checklist line)

Settings = `public/tools/ZV_Template_Raja.set`. Checklist lines = `src/core/checklists/raja.ts` (L = lesson) and
`kevin.ts`.

**Zones (`zones.detect`, port of `Detect`)**: base of 1-6 basing candles (body < 50% of range) + a departure candle
≥ 1.2x the biggest base candle (InpMinLegRatio; the card warns when < 2x because L55 says 2x); demand proximal = the
highest base body, distal = the lowest wick of base + departure (L55); zone ≤ 1.5 ATR(14) (InpMaxZoneATR); the
stay-away candle must leave space. Removal **only by a close** beyond the distal (InpRemovalMode=1, "never count a
wick", L4 · L50). Tested = a later low at the proximal (emotional > 3 ATR candles ignored).

**Zone type (`zones.dna`, port of `DnaCompute` with the Raja v2.1 A switches)**: STRONG = an opposite zone removed
anywhere in the run-out (RjA_StrongRun; L1 · L51); ARRIVAL = the run-out also crossed a trendline by a departure
close, body ≥ 0.6 ATR (RjA_ArrDepart, InpDirDepartATR; L1 · L51); WOW = strong with an opposite zone ahead (L50 ·
L101). Trendlines = `Trendlines()` (two latest real valleys / peaks, confirmed by a new high / low, never cut a
candle; L4 · Feb 10).

**Direction (`eval_row` + `dir_combine`, port of `DirEvalTF` / `DirCombine`, Raja table D1 → W1 → MN)**: per TF the
swings (HH+HL), the newest trendline cross, opposite zones removed since (Raja 2-close removal); CHANGED = cross + 2
opposite zones removed (L3), one = PULLBACK / TURNING (L3). Rules: inside a fresh MN zone locks the side; the curve
blocks the wrong side; MN in control; W1 pulling back against = WAIT to realign; D1 against = REDUCED; 3rd CP = one
step down (L7 · L8).

**Curve (`dir_curve`, port of `DirCurve`)**: proximal to proximal of the nearest fresh STRONG MN demand below and
supply above; without that pair the 100-bar MN range (v1). ≤ 25% low curve (buyers only), ≥ 75% high curve (L4).

| BUY rule (all must pass) | Source |
|---|---|
| Fresh: first touch, not removed | L2 · L52 |
| Zone type ARR / WOW / STR (D1 or W1) | L1 · L51 |
| Direction LONG (FULL or REDUCED) from D1 → W1 → MN | L7 · L8 · L3 |
| Curve below 50% (≤ 25% best; 25-50% flagged) | L4 |
| Not inside / next to a monthly supply, price not inside one | L50 · L52 (RjA_OppHtfVeto) |
| Room to the next supply ≥ 2x the stop (≥ 3x good, 2-3x flagged) | L7 · L53 |
| A known target (a supply above) | L101 ("never without a WOW target") |
| Not sideways on the zone TF or MN | L8 · L101 (RjB_Sideways, InpRjBChopTF=1) |
| Not the 3rd CP in a row | Raja lens · Kevin L8 · L13 |
| Has not already done its job | L5 · Feb 18 (RjA_Lens8) |
| Not an overlap / flip zone | L52 ("never set and forget" list) |
| Price within max(1.0x zone height, 3% of price) above the proximal | scanner (InpApproach) |
| No earnings in the next 10 trading days (when the date is known; unknown = "?") | Kevin L12 |

**Plan**: entry = proximal (limit); **stop = distal − 10% of the zone height on D1, 5% on W1** (the owner's rule,
ZV 2.10, min 0.03); **target = 0.5% before the next supply's proximal** (the nearest of the zone TF's live supplies
and the fresh W1 / MN supplies); R:R from those. Score = Raja lens score (`LensRun`): type 4/3 + fresh 2 + curve 2 +
room 2, max 10.

**WATCH**: strong fresh zones made in the last 5 sessions that pass everything but the approach; tested zones
(2nd / 3rd touch, D1 / W1 allowance of RjA_TouchCap) that pass everything but freshness → confirm one TF lower
(L52 · L101). **EXIT** (holdings): stop hit by a close; the demand under the entry broken by a close (since the
holding's `date`, else the last 5 sessions); price within one zone height of the next supply's proximal or inside it
(L7 · L106 "exit before the opposite zone").

Deliberate differences from the MT5 code: overlap / flip zones are vetoed even when strong (the checklist's never
list; ZoneVision ranks ARR / STR above OVL); W1 zones use the MN zones for the HTF-supply veto (ZoneVision has no
HTF row above W1 on a D1 chart). Not ported: WOW trendline ladder, nested curve, realignment areas, 250% projection,
inheritance / out-of-trendline types, near-trendline pips (pips mean nothing on stocks), Kevin / Seiden / Baker
lenses.

## Pinndx-inspired extras (display only)

From `docs/research/Pinndx_Spec.md` (P1). **None of these changes which BUY / WATCH / EXIT signals appear**; Raja's
rules stay the only gate and win every conflict. Each shows as a line in the rule list (status pass / warn / info,
never fail) and is logged by the backtest so it can be judged out of sample before it ever becomes a filter.

- **Zone gauge** on every card, the stock page and the watchlist: nearest fresh demand below and supply above,
  "% away" each side, state In demand / Middle / In supply.
- **Fair value** (`zones.fair_value`): the value area of the last 20 closed D1 bars (each bar's volume spread over its
  range, the point of control widened until it holds 70%; no volume -> 25th-75th percentile of closes). Drawn as a
  band on the charts. Flag "inside fair value" (Seiden L46 · L89: never at equilibrium); +1 Seiden point when the
  zone is >= 1 ATR below it. The Raja MN curve (25 / 50 / 75) stays the gate.
- **PZ1 / PZ2 / PZ3** (`zones.pz_levels`): PZ3 = the Raja target; PZ1 = the higher of the fair value's near edge and
  2R, PZ2 = the higher of its far edge and 3R, each only below PZ3. Raja's management maps to "close half at PZ1,
  hold the rest to PZ3"; no breakeven stop (Raja L7 · L103 beats Seiden L223).
- **RFX index**: equal-weight composite of SPY, QQQ, IWM, DIA (100 on the first common date) analysed like any
  ticker, with its own zones. Per signal: `index_aligned` (index in, or within the approach above, a fresh demand)
  = +1 Seiden point; `index_state` = supply -> warning flag. Never blocks.
- **Seiden odds score** 0-10 (`zones.seiden_score`) next to the Raja score: departure, time at level, freshness,
  margin, trend (Raja direction), curve, plus the two bonuses. Display and sort only.
- **Watchlist**: star any stock in the app (stored on that device). Telegram alerts use the `WATCHLIST` secret
  (e.g. `AAPL,MSFT,NVDA`): APPROACH = close within `WATCHLIST_APPROACH_PCT` (3) % above a fresh demand proximal,
  IN ZONE = the low reached the proximal and the close held above the distal, IN SUPPLY, and INDEX when the RFX index
  sits in a zone. The same alert for the same zone is sent at most once in 5 days (`.cache/alerts_state.json`).
  The watchlist and its alerts never reach the public JSON.

## Backtest

```bash
python tools/stock_scanner/backtest.py --offline --workers 4          # after one scan filled the cache
python tools/stock_scanner/backtest.py --universes RUT --offline
python tools/stock_scanner/backtest.py --fixture                      # code-path check on synthetic data only
```

Walk-forward, no look-ahead: on each candidate day the scanner's own `analyse()` runs on the bars up to that day
(W1 / MN = buckets closed by then); a zone exists only after its stay-away candle closed (a unit test proves the
pre-filtered walk equals scanning every day). Orders: limit at the proximal from the next day (gap-down fills at the
open), cancelled when price reaches the target first, the zone is removed by a close, or after 40 sessions. Exits:
target, or the stop in two variants (`wick` and `close`), same-bar = stop, time exit 250 sessions, 5 bps per side.
Every trade also logs the Seiden score, fair-value distance / inside flag, index alignment, PZ1 / PZ2 and whether
they were hit; the summary reports each as buckets in and out of sample plus a "half at PZ1, rest to PZ3" variant.
Output `backtest_out/trades.csv` + `summary.json`: trades, win rate, avg R, expectancy with a bootstrap 95% CI,
profit factor, by zone type / TF / sector / **universe**, in-sample vs the last 30% (out of sample), gap-through-
stop count, trades held through a 10-Q / 10-K filing (proxy for earnings, from cached SEC data). The verdict line
says trust only when the out-of-sample CI is above zero with 30+ trades.

## Limitations

- **Earnings gaps**: daily data cannot see the overnight gap risk; the stop can be jumped (the backtest counts it).
  Future earnings dates come from Yahoo best-effort; unknown = "?" (check yourself). `earnings.csv` (symbol,date) overrides.
- **Adjusted prices**: zones are drawn on split + dividend adjusted data; old zones sit slightly lower than on an
  unadjusted TradingView chart.
- **Survivorship bias**: the backtest uses today's index members only (companies that left the index are missing),
  which flatters results, most of all for the Russell 2000.
- **No intraday**: no H1 / H4 confirmation, so tested zones are WATCH only; entries assume a resting limit order.
- Prices come from Alpaca (official API; the free plan's `iex` fallback covers one exchange's trades only, so its
  daily volumes are smaller and highs / lows can differ slightly from the consolidated tape). Yahoo / Stooq / SEC /
  iShares are unofficial or rate-limited sources; a ticker without data is skipped and counted.
- The Russell 2000 list needs the iShares CSV (not served to GitHub runners) or a committed snapshot (see
  "Russell 2000 snapshot"); when both are missing RUT is empty.
