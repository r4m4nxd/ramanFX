# RamanFX stock scanner

Daily scan of US and Canadian stocks (S&P 500, Nasdaq-100, Dow 30, S&P/TSX 60, S&P/TSX Composite) for **BUY setups at fresh demand zones** and
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
| `universe.py` | Index registry + lists → `universe.csv` (symbol, name, sector, cik, indexes, home, currency, feed, country). Weekly refresh. |
| `adr_list.csv` | Curated US-listed foreign large caps (ADR universe): symbol, name, country, GICS sector, SEC CIK, ADR ratio. |
| `top_liquid.csv` | US top liquid list (TOP universe), rebuilt by the Monday refresh from Alpaca bars. |
| `tsx_us_map.csv` | TSX symbol → its NYSE / Nasdaq listing, hand-checked by company name (`us` empty = TSX-only). |
| `data.py` | Daily OHLCV (20 y asked, Alpaca serves from 2016) from **Alpaca Market Data** (primary, multi-symbol batches, **split-adjusted only**, like the TradingView default chart), Yahoo / Stooq per-ticker fallbacks; incremental updates, cache, rate limit, threads; weekly / monthly bars. |
| `zones.py` | The Python port of the ZoneVision Raja logic (pure functions). |
| `scan.py` | The rules → BUY / WATCH / EXIT, JSON for the app, CLI. |
| `fundamentals.py` | SEC EDGAR XBRL companyfacts → compact table (context only). |
| `notify.py` | Telegram messages (HTML, per sector, split < 4000 UTF-16 units), `--preview-telegram`. |
| `lists.py` | Zone lists (in / approaching / left, per side) shared by Telegram, `latest.json` and the app. |
| `backtest.py` | Walk-forward backtest of the same rules. |
| `selftest.py` | Whole pipeline on synthetic fixtures (`scan.py --selftest`). |
| `holdings.json` | Your positions for EXIT warnings (or the `HOLDINGS_JSON` secret, preferred). |
| `fixtures/` | Synthetic price generator, a hand-made SEC companyfacts file, `latest.sample.json` (app demo data). |
| `../../.github/workflows/stock-scan.yml` | Weekdays 21:37 UTC + backup 23:37 UTC (skipped when today's scan is already published): tests, scan, Telegram, commit `public/scanner/*.json`. |

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
     lists do not give) answers 403 without a contact, so without `SEC_UA` that lookup is
     skipped with a one-line hint and those tickers show fundamentals n/a. Read from the secret only, never written.
3. Optional repository **variables**: `SCANNER_UNIVERSES` (default `SPX,NDX,DJI,TSX60,TSX`), `TELEGRAM_TOP_N` (trade cards, default and max 3),
   `SCANNER_TSX_FEED` (empty; `eodhd` + the secret `EODHD_API_KEY` switches the paid TSX feed on, see Canada).
4. Actions tab → **Stock scan** → *Run workflow* once to test. The first run downloads up to 20 years for every ticker (Alpaca serves from 2016: ~43 quarterly and ~21 half-year bars; MN / 3M zones need the long history)
   from Alpaca in batches of 100 symbols (~10,000 bars per page, a few hundred requests, a few minutes at Alpaca's
   200 requests/min); later runs fetch only the last ~3 weeks in batches of 200 (one request per batch; a ticker
   whose overlap no longer matches after a split / dividend gets its full history again). A cache from the older 10-year
   fetch is extended once with a full fetch (`history_days` in its meta marks it done). Cache via `actions/cache`.

**No data, no output**: when fewer than half of the tickers (`SCANNER_MIN_COVERAGE`, 0.5) have price data, the scan
writes nothing (`latest.json`, `index.json`, the shards and the history stay as they were), sends no signals, sends
at most one short Telegram message per day ("scan failed: no price data" with the reason: missing Alpaca keys,
failing hosts, the most common error) and exits 2 so the run shows red.

Each run commits `public/scanner/latest.json` (signals), `public/scanner/history/<date>.json`,
`public/scanner/index.json` (every ticker, for the app's search) and `public/scanner/t/<0-63>.json` (that redeploys
the app).

**Zone lists** (`lists.py`; Telegram, `latest.json` `zone_lists`, the app's Market map: the same lists): every
stock in ONE of seven buckets by where its close sits against its W1 / MN / 3M zones (fresh or tested, ≤ 3 touches):
in supply · approaching supply (close ≤ `SCANNER_NEAR_PCT` 3% below the proximal) · left supply (touched in the last
`SCANNER_LEFT_SESSIONS` 3 sessions, closed back below = rejected) · middle · left demand (bounced) · approaching
demand · in demand; in > left > approaching. Each item: TF, type, score, touches, % to the proximal and the Raja
status (BUY / WATCH, or the first rule that blocks a BUY on that zone; supply: the direction). `index.json` rows carry
`mb` (bucket code IS / AS / LS / M / LD / AD / ID), `mz` ([tf, type, score, touches, %, proximal]), `mr` (status) and `ml` ([location code, location text], the zone's
top-down HTF location; list items carry `loc` / `loc_text`, signals `loc`, `loc_ok`, `loc_text`, `chain`,
`chain_text`, `m3`, `m6`, `ctx6`; details `m3`, `m6`, `ctx6`, `tfs`, `curve_tf`, zones `loc` / `loc_text`);
older files without them fall back to `dz` / `sz` / `br` (nearest fresh zones, no "left" buckets). Telegram sends ONE
calm message a day: the answer first (`1 BUY · 3 WATCH · nothing to exit`), at most 3 two-line trade cards in plain
words, the zone lists / market / "why not more" in one collapsed expandable quote (≤ 15 short lines, "+N more in the
app"), a chart button per card and "Open scanner". Preview without sending:
`python tools/stock_scanner/scan.py --preview-telegram` (reads `public/scanner`, rebuilds the lists from the shards
when the file predates them).

**Search any ticker**: every analysed ticker (signal or not) gets a detail record: last 120
daily bars (packed), all active W1 / MN / 3M zones with type / score / fresh / touches, nearest demand and supply with the
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
python tools/stock_scanner/universe.py --force                  # index lists (needs Wikipedia; Alpaca keys check the TSX map; SEC)
python tools/stock_scanner/scan.py --tickers AAPL,MSFT --no-notify
python tools/stock_scanner/scan.py --universes SPX,DJI --workers 6
python tools/stock_scanner/scan.py --offline --no-write --no-notify   # cached data only
python tools/stock_scanner/scan.py --selftest                   # fixtures, prints the Telegram text
python -m unittest discover tools/stock_scanner/tests
```

Env: `ALPACA_KEY_ID`, `ALPACA_SECRET_KEY` (without them: Yahoo / Stooq only, which may work from a home connection),
`ALPACA_BATCH_COLD` (100), `ALPACA_BATCH_UPDATE` (200), `SCANNER_MIN_COVERAGE` (0.5),
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `HOLDINGS_JSON`, `WATCHLIST`, `WATCHLIST_APPROACH_PCT`, `SEC_UA`, `SCANNER_UNIVERSES`, `SCANNER_WORKERS`,
`SCANNER_PAUSE` (seconds between requests per host, default 0.15), `SCANNER_DIAG_PCT` (5), `SCANNER_TSX_FEED`,
`EODHD_API_KEY`, `TELEGRAM_TOP_N` (3), `SCANNER_APP_URL`.

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
| TSX60 | S&P/TSX 60 | Wikipedia `S%26P/TSX_60` (first symbol + company table; Morningstar sector names mapped to GICS) |
| TSX | S&P/TSX Composite | Wikipedia `S%26P/TSX_Composite_Index` (`components` table) |
| ADR | Global leaders (US-listed ADRs) | `adr_list.csv`, ~107 curated foreign large caps on NYSE / Nasdaq (BABA, TSM, ASML, NVO, TM, SAP, SHEL ...) |
| TOP | US top liquid | `top_liquid.csv`: the most traded other US common stocks / ADRs (see below) |

`universe.INDEX_META` is the one registry (label, short label, country, source): `latest.json` carries it as
`index_meta`, and the app builds its index pills and texts from it, so a new index needs no app change.
Tickers in several indexes are one row (`indexes` = `SPX,NDX,DJI`; an ADR in the Nasdaq-100 is `NDX,ADR`). Missing
CIKs come from SEC `company_tickers.json` (only with `SEC_UA`), which also corrects a curated CIK (ADR list, TSX map)
that SEC lists differently. Default universes (workflow): `SPX,NDX,DJI,TSX60,TSX,ADR,TOP`, ~1,100 tickers (a repository
variable `SCANNER_UNIVERSES` overrides it: add `,ADR,TOP` there if it is set).

### Global leaders (ADR)

`adr_list.csv` is hand-curated (quality, liquid foreign large caps; OTC-only names such as TCEHY, NSRGY, ABBNY,
LVMUY, RHHBY are left out on purpose). Every refresh keeps only the rows Alpaca's asset list has **active, tradable
and on NYSE / NASDAQ / ARCA / AMEX** (dropped ones are logged); without Alpaca keys the previous checked rows stay.
Rows: currency USD, `country` = the issuer's ISO code, sector from the list. `adr_ratio` = ordinary shares per ADS
(blank = unknown), used by the fundamentals for P/E and market cap.

### US top liquid (TOP)

The Monday refresh (`universe.py --force`, Alpaca keys needed) takes every active, tradable Alpaca US equity on NYSE /
Nasdaq that looks like a common stock or ADR. Alpaca has no security-type field, so `universe.is_common` decides by
symbol shape (1-5 letters, optional class letter like `BRK.B`; no `.U` / `.W` / `.R`, no preferred suffixes) and name
(no ETF / ETN / fund / warrant / right / unit / preferred / note / `%` / SPAC wording, no ETF issuer brand such as
iShares / SPDR / ProShares / Direxion, no bitcoin / gold / "Trust, Series 1" product trusts; "Common Units" MLPs and
REIT "Trust" names stay). It fetches one month of daily bars for them (multi-symbol bars, 200 a request: ~30 requests,
well inside the 200 / min limit), ranks them by the **20-day median dollar volume** and keeps those
≥ `SCANNER_TOP_MIN_DV` (default 50e6 USD/day) that are **in no other universe**, at most `SCANNER_TOP_MAX` (300). Sector:
SEC SIC code (submissions API, needs `SEC_UA`) mapped to GICS, else "Other". A failed or unfinished download (budget
`SCANNER_TOP_BUDGET_S`, 420 s) keeps the committed `top_liquid.csv`; the daily scan only reads `universe.csv`. On an
IEX-only Alpaca plan the dollar-volume floor is off (IEX is a few % of the volume) and only the ranking applies.

### Fundamentals of foreign and Canadian filers

`fundamentals.py` reads SEC companyfacts in **us-gaap and ifrs-full** (20-F / 40-F filers) and in the company's
**reporting currency** (the unit of its newest revenue / profit facts: EUR, JPY, TWD, CNY, CAD ...). Money values
show the code (`EUR 44.0B`); annual-only filers show fiscal-year values (`(FY 2025-12)`, YoY = fiscal year vs fiscal
year); a `Source` row names `SEC ifrs` / `FMP`, the currency and FY. Growth, margins and debt / equity are always
safe. Market cap = price × shares ÷ ADR ratio (1 for US and Canadian interlisted filers); P/E also needs EPS in USD,
otherwise `n/a (EPS in EUR)` / `n/a (ADR ratio unknown)`. CIKs are committed in `adr_list.csv` and `tsx_us_map.csv`
(no SEC lookup needed); a curated CIK whose SEC entity name does not match the company is ignored. Optional fallback:
secret `FMP_API_KEY` (Financial Modeling Prep, free tier) fills companies with no SEC revenue / EPS from annual
statements (source FMP, at most `FMP_PER_RUN` = 60 downloads a run). Off without the key.

### Canada (interlisted first)

A TSX name is scanned through its **US listing** (NYSE / Nasdaq / NYSE American, prices in USD, Alpaca data):
`universe.csv` row `symbol` = the US symbol, `home` = `TSX:RY`, `currency` = `USD`. Cards and the stock page say
"TSX: RY · US listing" and the TradingView link opens `TSX:RY`. The mapping, checked at every universe refresh:

1. `tsx_us_map.csv` (hand-checked by company name; `us` empty = no US exchange listing, e.g. OTC only). It wins, and
   catches the traps a symbol match would fall into: TSX `T` (TELUS) is US `TU` (US `T` is AT&T), `CNR` is `CNI`,
   `CCO` is `CCJ`, `ABX` is `B`, `IMG` is `IAG` (TSX `IAG` is iA Financial), `EFX` is Enerflex `EFXT`.
2. Otherwise the same symbol, only when Alpaca's asset list (`/v2/assets`, the paper-trading keys) has it **active on
   a US exchange and its company name matches** (≥ 60% of the TSX name's words); a same symbol with another company
   (TSX `BYD` Boyd Group vs US `BYD` Boyd Gaming) is rejected and logged.
3. Without Alpaca keys the refresh keeps the previous checked mapping.

Names without a US listing get `symbol` `RY.TO`-style, `currency` CAD, `feed` = `tsx`: they need a TSX data feed and
are **not scanned**; `latest.json` lists them (`uncovered`) with the per-index `coverage`, the app says
"N TSX-only names need a TSX data feed". Today (map + Wikipedia, Oct 2026): TSX 60 42/60, Composite 96/220 covered.

**Paid TSX feed (off)**: `data.fetch_tsx` / `parse_eodhd` read EODHD's end-of-day API (`SYMBOL.TO`, adjusted,
CAD). It is used only when `SCANNER_TSX_FEED=eodhd` and `EODHD_API_KEY` are both set; then the TSX-only names are
fetched from it and scanned like the rest (currency CAD), with no app change. Fundamentals: interlisted Canadian
issuers (40-F, IFRS in CAD, or 10-K) are read from SEC's ifrs-full / us-gaap facts (see above); TSX-only names have no
SEC filings and show "n/a (Canadian filer)".

## The rules (each mapped to the lesson / checklist line)

Settings = `public/tools/ZV_Template_Raja.set`. Checklist lines = `src/core/checklists/raja.ts` (L = lesson) and
`kevin.ts`.

**Zones (`zones.detect`, port of `Detect`)**: base of 1-6 basing candles (body < 50% of range) + a departure candle
≥ 1.2x the biggest base candle (InpMinLegRatio, detection only); **a BUY needs a departure ≥ 2x the base (L55, FAIL
below 2x)**; demand proximal = the
highest base body, distal = the lowest wick of base + departure (L55); zone ≤ 1.5 ATR(14) (InpMaxZoneATR); the
stay-away candle must leave space. Removal **only by a close** beyond the distal (InpRemovalMode=1, "never count a
wick", L4 · L50). Tested = a later low at the proximal (emotional > 3 ATR candles ignored). **Forming period counts**:
a D1 session of the week / month / quarter that is still forming and reached the proximal (or price inside the zone
now) is a touch (`zones.forming_touched`, `scan.zone_dna`): the limit at the proximal was filled that day, so the
zone is no longer fresh / set-and-forget (L2 · L52; owner). It never removes a zone (removal = a closed candle of the
zone TF, L52).

**Zone type (`zones.dna`, port of `DnaCompute` with the Raja v2.1 A switches)**: STRONG = an opposite zone removed
anywhere in the run-out (RjA_StrongRun; L1 · L51); ARRIVAL = the run-out also crossed a trendline by a departure
close, body ≥ 0.6 ATR (RjA_ArrDepart, InpDirDepartATR; L1 · L51); WOW = strong with an opposite zone ahead (L50 ·
L101). Trendlines = `Trendlines()` (two latest real valleys / peaks, confirmed by a new high / low, never cut a
candle; L4 · Feb 10).

**Timeframes (owner, TFSA buy-and-hold for weeks to a year): zones only on W1, MN and 3M — for stocks never below
W1.** 3M bars = calendar quarters built from the closed months (`zones.to_quarters`, Jan-Mar, Apr-Jun, …; the
forming quarter and a first partial quarter are dropped); 6M = half-years (`to_halves`, Jan-Jun, Jul-Dec), a
context level above 3M only. D1 bars are used for price checks only (close, approach %, touches in the current
visit, fair value, the intraday guard), never for zones or direction. Rows need 40 bars (W1 / MN), 21 (3M) and 16
(6M, incl. the forming bar; `zones.MIN_ROW_BARS`): with Alpaca from 2016 3M has ~43 and 6M ~21 bars, so 6M is often
"n/a (short history)".

**Top-down location (`zones.location`, the owner's key rule, first in every rule list)**: "show a zone only when
the real strong higher-TF zone has already been touched, then find the location area one TF lower." A W1 zone may
give BUY / WATCH only when the nearest strong (ARR / WOW / STR, ≤ 3 touches, not removed) MN demand that the W1 zone
overlaps (or sits within 25% of the MN zone's height above its proximal, `LOC_TOL`) was **touched in the current
visit** (walking back over the D1 bars, then older MN bars: a low at / under the proximal before any bar more than
2 MN zone heights above it, `LOC_AWAY`); one level further up, no strong untouched 3M demand may still lie below /
around that MN zone. An MN zone needs the same from a 3M demand. A 3M zone is the top tradeable level; the 6M
level only blocks it when a strong 6M demand is within 30% of price (`SOFT_REACH_PCT`) and untouched (below it or
around it), else it is ignored. **Reach and freshness (owner, audit P1)**: an MN zone (traded directly or as a W1
zone's host: one code path, `strict_chain`) is located when its 3M area was touched in the current visit **or no
strong 3M demand is within 25% of price** (`BLOCK_REACH_PCT`; 3M / 6M are reach-limited levels, `LOC_SOFT_TFS`); the
MN level stays hard for a W1 zone (a W1 zone always needs a touched MN area). "An area left to be sold first" =
only a **fresh** (0 touches, forming period included) strong HTF zone within 25% of price; HTF zones tested before
are context, not blockers. A host that is not located itself (`untouched`, `below`, `none`, `unknown`) blocks the
zone it hosts. No 3M history (short listing) = `unknown` for W1 and MN zones = no trade. Blocked cases: `below` ("HTF area not reached: strong MN demand at X–Y still below
(−Z%), price likely sells into it first", plus "the W1 down trendline is not crossed yet" when that line is in
force), `untouched` (the host zone not reached yet), `none` (no strong HTF demand at the zone), `unknown` (no HTF
history). Each signal carries the chain, e.g. `3M demand 80.00–74.00 touched ✓ → MN demand 82.00–79.00 touched ✓ →
W1 entry 81.20–80.10`. Supply mirrored: EXIT warnings near / inside a supply only for a located supply (a strong
untouched HTF supply still above = price likely rallies into it first: hold).

**Direction (`eval_row` + `dir_combine`, port of `DirEvalTF` / `DirCombine`, ZoneVision Raja table,
RFX_ZoneCore.mqh `InpDirTable == 3`)**: W1 entry = W1 → ITF MN → HTF 3M; MN entry = MN → 3M → **6M** (the table's
MN1 row: itf 3M, htf 6M); 3M entry (beyond the table: next steps up) = 3M → 6M → 6M. Without 6M history the MN / 3M
chain falls back to 3M as HTF. Per TF the swings (HH+HL), the newest trendline cross,
opposite zones removed since (Raja 2-close removal); CHANGED = cross + 2 opposite zones removed (L3), one = PULLBACK
/ TURNING (L3). Rules: inside a fresh 3M zone locks the side; the curve blocks the wrong side; the HTF in control;
the ITF pulling back against = WAIT to realign; the entry TF against = REDUCED; 3rd CP = one step down (L7 · L8).
Direction REDUCED (not every row agrees) still passes but is flagged (WARN); the entry TF itself CHANGED DOWN
fails (L3 · L7, stricter reading). 6M context (`ctx6`, `m6`) is shown on every signal / detail.

**Curve (`dir_curve`, port of `DirCurve`, measured on the entry's HTF row like `drH`)**: W1 zones on 3M (MN when
3M is too short), MN zones on 6M (3M fallback), 3M zones on 6M only: a 3M zone is never measured on 3M zones (the
nearest strong 3M demand IS the zone: ~0%, always passes); no 6M history = curve unknown = FAIL. Proximal to
proximal of the nearest fresh STRONG demand below and supply above; without that pair the 100-bar range (v1).
≤ 25% low curve (buyers only), ≥ 75% high curve (L4).

| BUY rule (all must pass) | Source |
|---|---|
| Located: inside a touched strong HTF demand (W1 in MN, MN in 3M; 3M top), nothing strong left below to be sold into first | owner · L7 |
| Fresh: first touch, not removed | L2 · L52 |
| Zone type ARR / WOW / STR (W1, MN or 3M; nothing below W1) | L1 · L51 |
| Direction LONG (FULL or REDUCED) on the entry TF's chain (W1 → MN → 3M) | L7 · L8 · L3 |
| Departure ≥ 2x the base (FAIL below) | L55 |
| Curve below 50% (≤ 25% best; 25-50% flagged), on the entry's HTF (above). Owner ATH rule (`scan.ath_ok`, one helper for the direction and the curve rule): no measurable Raja curve, the **entry TF and its next HTF** TREND UP or CHANGED UP (W1 entry: W1 + MN, owner's words; MN: MN + 3M; 3M: 3M + 6M; `zones.trend_up`; TURNING / PULLBACK / RANGE do not count) **and no strong fresh HTF supply within 30% above price** (then it is not an ATH area: never exempt) → allowed (flagged), and the fallback curve casts no sell vote in the direction | L4 · owner |
| Not inside / next to a supply one TF up (W1: MN, MN: 3M, 3M: 6M within 30% of price), price not inside a fresh HTF supply | L50 · L52 (RjA_OppHtfVeto) |
| Room to the next supply ≥ 2x the stop (≥ 3x good, 2-3x flagged); the supplies of every higher row count (W1: MN, 3M, 6M; MN: 3M, 6M; 3M: 6M) | L7 · L53 |
| A known target: a supply above, else Raja's 250% projection (correction = last higher high before the base down to the zone's distal; target = distal + 2.5x that; only while the run-out has not reached it) | L101 · L5 (Feb 18: "100%, another 100%, then half") |
| Not sideways on the zone TF or one TF up | L8 · L101 (RjB_Sideways, InpRjBChopTF=1) |
| Not the 3rd CP in a row | Raja lens · Kevin L8 · L13 |
| Has not already done its job | L5 · Feb 18 (RjA_Lens8) |
| Not an overlap / flip zone | L52 ("never set and forget" list) |
| Price within max(1.0x zone height, 3% of price) above the proximal | scanner (InpApproach) |
| *Earnings: information only* (next date when known, "unknown" otherwise). Not a mentor rule: the owner holds weeks to months, so the trade crosses earnings anyway; the old "Kevin L12" citation was wrong (that lesson is an FX plan) and is removed | info |

**Plan**: entry = proximal (limit); **stop = distal − 5% of the zone height on W1, 3% on MN, 2% on 3M** (the owner's rule,
ZV 2.10, min 0.03); **target = 0.5% before the next supply's proximal** (the nearest of the zone TF's live supplies
and the fresh supplies of the higher zone TFs; no supply above: the 250% projection, `target_kind: 'projection'`); R:R from those. Score = Raja lens score (`LensRun`): type 4/3 + fresh 2 + curve 2 +
room 2, max 10.

**WATCH**: strong fresh zones made in the last 5 sessions that pass everything but the approach; tested zones
(2nd / 3rd touch, allowance of RjA_TouchCap) that pass everything but freshness → confirm one TF lower, never
below W1 (3M → MN, MN → W1; a W1 zone: a W1 close back above the proximal) (L52 · L101); both need the location
rule to pass. **EXIT** (holdings): stop hit by a close; the demand under the entry broken by a close (since the
holding's `date`, else the last 5 sessions); price within one zone height of the next located supply's proximal or inside it
(L7 · L106 "exit before the opposite zone"); **L3 trail**: a new fresh W1 / MN demand formed above the entry (after
the holding's `date`) → "trail the stop to its distal − buffer"; a demand formed above the entry broken by a close →
"stop behind the next demand", a 2nd one broken → "close" (L3, raja.ts:116-118); **trend change**: W1 / MN / 3M
CHANGED DOWN → warning (L3). **Currency**: the scanned levels are the listing's currency (USD for US and interlisted
names, scanned on the US listing). A holding may carry `"currency"`; a US symbol defaults to USD; an interlisted TSX
holding must say it (`"currency": "USD"` = US-listing entry / stop). Any other currency is never compared raw: the
exit then says so and skips the entry / stop checks (supply / trend warnings still run).

A W1 / MN / 3M zone counts as "made" on the close of its stay-away week / month / quarter (its last session), not on the first day it is dated by.

**Why no signal** (`blocked` / `closest` in latest.json): every ticker without a BUY whose nearest fresh demand is
within `SCANNER_DIAG_PCT` (5) % above price, or holds price, is a candidate; it counts once under its first failing
rule in the order HTF location → curve → direction → monthly supply → sideways → zone type → fresh → overlap / flip → did its job →
3rd CP → room → near entry. The run log, Telegram ("No BUY … Top reasons") and the app's empty state show
the top reasons; `closest` holds the 10 candidates nearest to their entry. Diagnostics only: they never change a signal.

**Intraday guard**: a run while the US market is open (before 16:20 New York) drops the partial daily bar dated today,
so every rule reads closed sessions only; the output then says `"session": "intraday-dropped"` and its date is the
last closed session.

Deliberate differences from the MT5 code: overlap / flip zones are vetoed even when strong (the checklist's never
list; ZoneVision ranks ARR / STR above OVL); the HTF-supply veto reads one TF up (W1: MN, MN: 3M). Not ported: WOW trendline ladder, nested curve, realignment areas, 250% projection,
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
python tools/stock_scanner/backtest.py --universes TSX --offline
python tools/stock_scanner/backtest.py --fixture                      # code-path check on synthetic data only
```

On real data: Actions -> **Stock backtest** -> Run workflow (inputs `years`, `tickers`, `max_tickers`). It restores
the scan's data cache, runs the backtest (budget 4 h 20 min, partial results are still reported), commits
`public/scanner/backtest.json` + `docs/research/Stock_Backtest.md` and prints the summary in the log.

Walk-forward, no look-ahead: on each evaluation day the scanner's own `analyse()` + `symbol_signals()` run on the
bars up to that day (W1 / MN / 3M = buckets closed by then; nesting, ATH rule, 250% projection and the W1 5% / MN 3% /
3M 2% stops exactly as in the scan); a zone exists only after its stay-away candle closed. **Weekly cadence**: the
rules run on the last session of each week. Orders: limit at the proximal from the next session, filled only when
traded through (gap-down fills at the open), cancelled when price reaches the target first, the zone is removed by a
close, or after 40 sessions. Exits: target, or the stop in two variants (`wick` = stop order in the market, an open
below it exits at that open; `close`), same bar = stop, time exit after 52 weeks; trades still open at the data end are
not scored. Costs `--cost-bps` 5 + `--slip-bps` 5 per side.
Reported: trades, fill rate, win rate, avg R (expectancy) with a bootstrap 95% CI, profit factor, average % return per
trade and its annualised form, average holding weeks, max drawdown in R, longest losing streak; by entry TF / zone
type / index / sector / Raja score / nesting status / target kind; in sample vs the newest 30% (out of sample).
Ablations: `no_nesting` (location rule off, split nested vs not), `no_ath` (owner ATH curve exception off); the old D1
rules are no longer selectable. Baselines: a seeded random entry on the same ticker with the same stop / target %,
and SPY buy-and-hold (whole period and each trade's own window). The Pinndx fields (Seiden score, fair value, index
alignment, PZ1 / PZ2, "half at PZ1") are bucketed in and out of sample. The verdict line says trust only when the
out-of-sample CI is above zero with 30+ trades.

## Limitations

- **Earnings gaps**: daily data cannot see the overnight gap risk; the stop can be jumped (the backtest counts it).
  Future earnings dates come from Yahoo best-effort; unknown = "?" (check yourself). `earnings.csv` (symbol,date) overrides.
- **Adjusted prices**: split-adjusted only (Alpaca `adjustment=split`, Yahoo quote O/H/L/C), dividends not adjusted:
  the TradingView default chart. The cache records `adjustment`; a cache written with the old split + dividend
  adjustment is fetched again in full once. The backtest's returns therefore exclude dividends.
- **History from 2016** (Alpaca): ~43 quarters, ~21 half-years. A strong 3M / 6M zone made before 2016 is invisible
  (no blocker, no host, no curve end from it); `data_note` in latest.json says so.
- **IEX feed**: when Alpaca refuses SIP (plan without it) the scan falls back to `feed=iex` and warns loudly: a
  `WARNING` log line, `feed_iex: true` and `data_warning` (banner text, shown in the app and Telegram) in latest.json.
- **Survivorship bias**: the backtest uses today's index members only (companies that left the index are missing),
  which flatters results.
- **No intraday, by design**: zones only on W1, MN and 3M (nothing smaller than W1), so tested zones are WATCH only;
  entries assume a resting limit order.
- Prices come from Alpaca (official API; the free plan's `iex` fallback covers one exchange's trades only, so its
  daily volumes are smaller and highs / lows can differ slightly from the consolidated tape). Yahoo / Stooq / SEC /
  iShares are unofficial or rate-limited sources; a ticker without data is skipped and counted.
- Interlisted TSX names are scanned on their US listing: every level is labelled "US listing · USD", the primary
  chart link is the NYSE / Nasdaq chart and "TSX chart (CAD)" is a secondary link (its zones differ). TSX-only names need the (paid, off) TSX feed.
