# RamanFX FX scanner

Automated forex (and watchlist CFD) zone scan with **the same Raja rules and the same top-down nesting as the stock
scanner** (`tools/stock_scanner/zones.py` is imported, not copied), on the chain **MN → W1 → D1 → H4 → H1** with 3M
as the top context. Runs **after every H1 close** on GitHub Actions (owner 2026-10-28: "catch the moves earlier on
lower time frames"; polled every 10 minutes; a run with no unscanned H1 candle stops in seconds, a dropped run is
caught up by the next) and sends **instant Telegram alerts when something new happens** (the only message of an
hourly scan, nothing when nothing is new), one compact **H4 digest** per new H4 candle (`FX_H4_DIGEST`, default
`true`: counts, top 5 watchlist instruments in / near located zones, or "No new setups"; never hourly), plus one daily summary, so you do not have to watch charts during the day job. Results also go to the app
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
   timeframe: H1 2,000 bars ≈ 4 months, H4 5,000 bars ≈ 3 years, D1 ≈ 19 years, W1 / MN all); later runs fetch only
   the new candles (an hourly run inside an H4 bar: one H1 request per instrument, H4 / D1 / W1 / MN skipped).

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
  BTCUSD→BTC_USD …, each checked against the account's list. **Not on OANDA** (35 symbols of the committed
  watchlist: 9 FX crosses, EURX / JPYX, 15 crypto, CA60, SCI25, VIX, GASOLINE and 5 softs / cattle) → scanned from the
  **extra sources** below (owner 2026-10-29: "we cannot miss those"); only a symbol with no source at all stays in
  `unmapped` ("not on OANDA"; the run logs `0 not on OANDA` when every symbol has a feed). **USDX** is computed from OANDA pairs with the ICE formula
  `50.14348112 × EURUSD^-0.576 × USDJPY^0.136 × GBPUSD^-0.119 × USDCAD^0.091 × USDSEK^0.042 × USDCHF^0.036`
  (open / close exact, wicks = the bound of the parts' extremes; D1 / W1 / MN wicks from the synthetic H4 bars where
  the H4 history covers them). USDX and the futures CFDs are **context only** (see Rules).
- **Gold**: Raja does not trade XAUUSD on the low timeframes and prefers XAUAUD: XAUUSD H4 zones are blocked
  (`FX_GOLD_USD_MIN_TF=D1`), every gold signal carries the note.

## The clock (Pepperstone server time)

Candles are asked with `alignmentTimezone=America/New_York&dailyAlignment=17&weeklyAlignment=Friday`, i.e. the day
closes at 17:00 New York = Pepperstone's MT4 / MT5 server midnight (GMT+2 winter / GMT+3 summer). Every bar is
labelled in server time (`fxcfg.label`, New York + 7 h): H1 bars on the hour, H4 bars start at 00/04/08/12/16/20 server time
(= 17/21/01/05/09/13 New York), days at 00:00, weeks on the Sunday-evening open, months on the 1st (server-time
month). Only `complete: true` candles are used. **Crypto trades 24/7** and is scanned 24/7: with every forex H1 scan,
and on weekends (forex closed) by a **crypto-only run**: `--check` finds the forex H1 candle already scanned, asks
Coinbase for the newest BTC-USD H1 candle (state `last_h1_crypto`) and the workflow runs `fxscan.py --crypto` (the 15
crypto instruments, instant alerts + bot price alerts only, no H4 digest / daily summary; merged into
`public/fx/latest.json`, `d/crypto.json` rewritten, every other row kept). Weekend crons `12,42 6-23 * * 6` /
`12,42 0-20 * * 0` plus the trader-coach dispatch (`fxc:` slots, every weekend H1 close) trigger it; manual: Run
workflow with `crypto` = true.

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
  (for H4 zones: H1) bar of the HTF bar that is still forming** (a W1 zone hit on Tuesday is tested, not fresh), price inside the zone
  counts as a touch, and a news (emotional) candle's tap counts too (*stricter*; it is still ignored for removal,
  L2 Apr 30). 2nd / 3rd touch **→ WATCH 'tested'**; more = dropped.
- Zone type ARR / WOW / STR (L1, L51); overlap / flip = confirmation only, never set and forget (L2, L52, L104); not
  a zone that already did its job (L5, Feb 18); not the 3rd CP in a row (L8, Kevin L13); never sideways (L8, L101).

**Top-down location (owner + L6, L7)**
- An H1 zone needs a **touched H4 host**, an H4 zone a **touched D1 host**, that D1 host a **touched W1 host**, that
  W1 host a **touched MN host**: the **full chain MN → W1 → D1 → H4 → H1**, no gap (a host with no strong zone above it blocks; *stricter*,
  `zones.location(strict_chain=True)`). 3M is context: it blocks only with a strong untouched 3M zone within 5%.
- A host must be strong (ARR / WOW / STR), not overlap / flip / done, penetrated ≤ 75% (Kevin L13), and **at most 1
  earlier visit on H4 / D1 / W1, 2 on MN** (Raja: MN 2nd / 3rd confirm, 4th breaks; D1 / W1 3rd touch risky, L2, L52,
  L102, Mar 5; ZV cap 2; *stricter*: D1 / W1 1). A host visited before is only confirmed by an **arrival** entry
  zone (L2, L52, L105) **→ WATCH**.
- An untouched strong HTF zone still in the way → "HTF area not reached".

**Direction, curve, opposite zones**
- Raja table with ZV's +1 row (`InpDirTable=3` + `InpDirPlus1`): **H1 → H4 → D1 (+ W1)**, **H4 → D1 → W1 (+ MN)**,
  D1 → W1 → MN, W1 → MN → 3M, MN → 3M. Only a **FULL** direction trades: REDUCED (the +1 row or the entry TF disagrees = a correction) **→ WATCH**
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
  25 not 30) → fail (H1 / H4 / D1).
- **Out of trendline** (L8, L52, L106): the own-side line the zone was built on was crossed after it formed, or the zone
  formed beyond an already crossed own-side line without an arrival since → fail.

**Room, plan, costs**
- Target = **7 pips** (`FX_TP_OFFSET_PIPS`, ZV `InpTpOffsetPips=7`; Raja 5-10 pips, L7, L9, L106) before the
  **nearest not-removed opposite zone of any TF** (lower and higher, tested ones too: L9 "nearest opposing level",
  Baker "never buy with supply overhead"); none → Raja's 250% projection (L5). **Room ≥ 2x the stop** (L7, L53); no
  target → no trade (L101).
- Entry / stop / target are on the bid chart with the spread on the ask side: **BUY limit = proximal + spread**,
  buy stop = distal − % of the height; **SELL limit = proximal**, sell stop = distal + % + spread, sell target + spread
  (Kevin L6). Stop % of the zone height: **H1 20** (config value, one step looser than H4: owner to confirm),
  H4 15, D1 10, W1 5, MN 3 (min 3 pips). R:R on these levels.
- Spread ≤ 10% of the stop (`FX_MAX_SPREAD_FRAC`). For the extra sources the spread is **Pepperstone's typical spread**
  (instruments.json `spread` / `spread_pct`; an exchange's own spread is far tighter than Pepperstone's CFD spread), see
  the table below.
- **Pips as on Pepperstone MT5**: gold / platinum / palladium 0.1, silver 0.01 (ZV `InpPipXAU=0.1`), JPY 0.01, else
  0.0001 (OANDA `pipLocation`). **Where a pip means nothing** (crypto, the Yahoo indices / VIX / softs, EURX / JPYX:
  `pip_mode: atr`) one pip = **D1 ATR(14) / 70** (`FX_ATR_PIP_REF`: a pip's share of EURUSD's ~70-pip day), recomputed
  every scan, so every pip rule scales with the market: the 25-pip trendline rule = 0.36 D1 ATR, the 7-pip target
  offset = 0.1 ATR, the 3-pip minimum stop = 0.04 ATR (the spread rule is already a % of the stop). `pip` / `*_pips` in
  latest.json are these units for those instruments.

**Markets and timeframes**
- **BUY / SELL limits only on H1, H4 and D1**: W1 / MN zones are areas for direction and location (L6, L7, L53 seven-step
  board: "a monthly zone with a 1,000-pip stop is a mistake") **→ WATCH 'area'** (drill down).
- No XAU_USD on H1 / H4 (L53, L107: use XAU_AUD). Indices / CFDs daily and above, TRY pairs weekly and above (L53
  Feb 18, Apr 7) → fail on lower TFs. Crypto (class `crypto`) is not an index CFD here: H1 / H4 / D1 like FX, and the
  Friday-afternoon weekend-gap rule does not apply to it (no weekend gap; owner to confirm).
- **Context only (WATCH 'context', never an order)**: USDX (synthetic spot DXY; Pepperstone USDX follows the ICE futures,
  wicks are an upper bound) and the futures-based CFDs (BCO, WTICO, NATGAS, XCU, CORN, WHEAT, SOYBN, SUGAR: OANDA and
  Pepperstone roll on different dates and may quote in different units).
- No new H1 / H4 set and forget from Friday 12:00 server time (weekend gap; L53 Apr 30, L7 Jun 25) **→ WATCH**.

**H1 (hourly scan)**
- The analysis base is the **newest closed H1 bar**. Its H1 bars after the last closed H4 bar form the forming H4 bar
  of the price checks: an H4 zone hit by this 4-hour bar's H1 bars is tested (not fresh), and a D1 / W1 / MN touch
  this hour counts at once. **At an H4 close the H4 / D1 / W1 / MN results are exactly the pre-H1 ones** (regression
  test `tests/test_fx_h1.py`); H1 zones are not used as room / target of H4+ trades.
- H1 zones are listed (in / approaching / left, Telegram zone alerts) only once located inside a touched H4 zone.
- H1 config (owner to confirm): stop 20% of the zone height, history 1,500 H1 bars (≈ 3 months), host H4 at most 1
  earlier visit, approach / near / left / new as for H4 (1x the zone height; 6 H4 bars), XAU_USD / CFDs / TRY blocked.
- The backtest (`fx_backtest.py`) stays H4-based (an H1 walk-forward is 4x the evaluations; not added).

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

## Extra sources (symbols OANDA does not serve)

Code: `sources/` (Python package, reusable by the bot / movers): `sources.candles(symbol, granularity, count=None,
frm=None, leg=None) -> [zones.Bar]` (closed bars, oldest first, server-time labels; `granularity` H1 / H4 / D1 / W1 /
MN; `frm` = first label; `leg` = an OANDA getter, only for synthetic symbols) and `sources.fetch(spec)` (all TFs + the
typical spread). The **mapping is data**: `instruments.json` → `extra` (one entry per Pepperstone symbol: `name`,
`source`, `legs` / `providers` / `yahoo` symbols, `displayPrecision`, `pipLocation` or `pip_mode`, `cls`, `spread` /
`spread_pct` + `spread_ref`, `feed`, `unofficial`, `context_only`). The TradingView link stays `PEPPERSTONE:<SYM>`.

| Group | Symbols | Source | Signals |
|---|---|---|---|
| FX crosses (9) | CHFSGD, EURMXN, GBPMXN, GBPNOK, GBPSEK, GBPTRY, NOKJPY, NOKSEK, SEKJPY | synthetic from OANDA legs (CHFSGD = 1 / SGD_CHF, EURMXN = EUR_USD x USD_MXN, NOKJPY = USD_JPY / USD_NOK ...) | yes (exotic rules; GBPTRY weekly+) |
| Currency indices (2) | EURX, JPYX | synthetic basket from OANDA legs, **approximate** | context only |
| Crypto (15) | BTC, ETH, ADA, AVAX, BCH, BNB, DOGE, DOT, LINK, LTC, SOL, UNI, XLM, XRP, XTZ (USD) | Coinbase Exchange public candles → Kraken; BNB: Binance.US → OKX (BNB-USDT) | yes, 24/7 |
| Yahoo (9) | VIX, CA60, SCI25, GASOLINE, COCOA, COFFEE, COTTON, LDSUGAR, CATTLE | Yahoo chart API, **unofficial feed** | context only |

**Synthetic crosses** (`sources/synthetic.py`): `value = k x PRODUCT(leg ^ w)` per bar label present in every leg
(OANDA BID candles, same server-time grid). Open / close are exact. High / low are an **upper bound** (each leg's high
or low by the sign of its weight): the legs' extremes rarely fall in the same minute, so the wick is overstated by at
most the smaller leg's range in that bar, never understated (the distal sits a little further out = a slightly wider
stop, the proximal on the bodies is exact). To keep it small, H4 bars take the extremes of their four synthetic H1 bars
and D1 / W1 / MN the extremes of their synthetic H4 bars wherever every leg has all the finer bars (typical
overstatement on H1: 0.01-0.05% of price). Bid: a product of bids is the cross's bid; a division gives bid / bid, one
divisor spread too high, so crosses are multiplied by (1 - the divisor's typical relative spread). Spread = the
combined legs: value x SUM(|w| x leg spread / leg price). The legs are fetched once per run (shared with the legs' own
scan).

**EURX / JPYX**: Pepperstone's product pages (not reachable from here; their spread page lists EURX / JPYX with a
1.0 average spread and pip size 1) do not publish the basket. EURX uses the NYBOT / ICE Euro Currency Index (2006)
weights `34.38805726 x EURUSD^0.3155 x EURGBP^0.3056 x EURJPY^0.1891 x EURCHF^0.1113 x EURSEK^0.0785`; JPYX an
equal-weight yen basket `10000 x (USDJPY x EURJPY x AUDJPY x NZDJPY)^-0.25` (FXCM / Dow Jones style; rises when the
yen strengthens; level normalised). Both **approximate** (shape, not Pepperstone's level): **context only**.

**Crypto** (`sources/crypto.py`): H1 = complete UTC hours (Coinbase 300 candles per request, 4,200 hours cold ≈ 1,050
H4 bars; Kraken returns only the newest 720); H4 = the H1 bars per server-time H4 bucket (exactly the FX grid, so the
H1 → forming-H4 logic is unchanged; the New York fall-back hour, which repeats a server-time label, is merged into one
bar); **D1 = UTC days** (the exchanges' daily candles: older history only exists that way), i.e. a crypto day starts
2-3 h after the server-time midnight of the FX bars; W1 = Saturday-Friday UTC weeks (the scanner's W1 key), MN =
calendar months; closed bars only. A provider switch re-fetches cold (no splice of two exchanges). Exchange prices ≈
Pepperstone's crypto CFD prices (exchange-fed); BNB is quoted in USDT (≈ USD).

**Yahoo** (`sources/yahoo.py`, the stock scanner's client: same UA, pacing, budget and circuit breaker):
`v8/finance/chart/<sym>?interval=1h&range=720d` and `interval=1d&range=max` (updates `5d` / `1mo`; query2 when query1
refuses). VIX → `^VIX` (the SPOT index; Pepperstone VIX follows the VIX futures), CA60 → `^TX60` (else the XIU.TO
ETF, another scale), SCI25 (Pepperstone's Singapore 25 index) → closest `^STI` (Straits Times, 30 stocks), GASOLINE →
`RB=F`, COCOA → `CC=F`, COFFEE → `KC=F`, COTTON → `CT=F`, CATTLE → `LE=F` (front-month continuous futures), LDSUGAR →
**proxy** `SB=F` (NY raw sugar #11, cents/lb: London white sugar #5 is not on Yahoo). Labelled **unofficial feed** in
latest.json (`unofficial`, `feed`), the app and Telegram (`data: unofficial feed (Yahoo ^VIX)`), and **context only**
(levels differ from the Pepperstone CFDs: futures rolls, spot vs futures, proxies). Yahoo blocked → that instrument is
skipped with a log line (`VIX: Yahoo ...`), the cached bars are used when there are any; a scan never fails for it.
Exchange-hours series (VIX, CA60, SCI25) have H1 bars at :30 (labelled the nearest hour) and partial H4 buckets; they
are daily-and-above instruments anyway (index rule).

**Typical spreads used by the spread rule** (Pepperstone where a figure was found, else conservative per class):
BTCUSD 34 (Pepperstone average 33.74), ETHUSD 3.0 (average 3.02), other crypto 0.25% of price, synthetic crosses =
combined OANDA legs, EURX / JPYX 0.02%, CA60 0.05%, SCI25 0.1%, VIX 0.5%, GASOLINE 0.15%, softs / cattle 0.3%.

Network per run: crypto ≈ 2 requests per coin (H1 every hour, D1 once a day; cold ≈ 28 per coin, once), Yahoo 1-2
per instrument (H1 at most every 30 min, D1 every 4 h), synthetic none (legs already fetched).

## Telegram (only news)

- Every instrument: a **new BUY / SELL**; a **cancelled** signal with the reason (zone removed, stop level hit, entry
  touched, a rule failing now). No "Cancelled" for an instrument without data this run (fetch error, time budget,
  `--only`): it is carried over silently. A signal whose only failing rule is "price not near the entry" stays
  (a limit order does not expire with distance), and a cancelled signal is not re-announced for `FX_DEDUPE_HOURS`.
- When Telegram fails, the alert state is not advanced: the same events are sent again by the next run.
- Watchlist instruments also: a **new WATCH**, and price newly **entering / approaching a located strong zone**
  (each zone at most every `FX_DEDUPE_HOURS`, 24 h).
- **Layout** (calm, one message per event; same as the stock scanner): the answer first, at most 3 two-line trade
  cards (`🟢 EURUSD  BUY 1.20806 → 1.24794 · R:R 21` / `stop 1.20620 · 4-hour demand · score 10/10`),
  everything else in one collapsed expandable quote, a chart button per card + "Open scanner". Legend 🟢 buy ·
  🔴 sell · 👀 watch · 🚪 cancel / exit · ⏳ approaching. Times in Toronto.
- **Hourly (H1) scans**: only the instant alert above, and only when something is new. **H4 check** once per new H4
  candle (≤ 4 visible lines when nothing is new) and a **daily summary** with the first run after the D1 close (21:05 UTC summer / 22:05 UTC winter; that run sends no H4 check).
- **Bot preferences** (`stock_scanner/prefs.py`, read once per run from the telegram-bot function `?op=prefs`, header
  `X-RFX-Key` = sha256(bot token + ':prefs'), 10 s timeout; any failure logs `prefs unavailable` and the run is
  exactly as without them): a **muted** symbol gets no instant-alert card (it stays in the lists, digest detail and
  app); **quiet hours** send the non-urgent messages silently (`disable_notification`), never drop them; a new BUY /
  SELL and a fired price alert stay audible; the bot's extra **watch** symbols join the watchlist (section
  `BOT WATCH`, account instruments only); **alerts**: price = the newest closed H1 bar's high / low crossed the level
  (dir up / down / either; pct = within pct%), zone = price inside a located strong zone of that symbol (any TF),
  zone + pct (the bot's `pct` kind) = within pct% of the nearest located zone's proximal. One calm 🔔 message per
  fired alert with a [📊 SYM chart] button (`c:SYM`) and a why line, then `?op=alert-fired` (fired ids are also kept
  in the state for 30 days, so a lost acknowledgement never repeats the message).
- **Alert keyboard** (≤ 3 rows): one symbol `[📈 SYM] [📊 4Q chart] [🔎 Zones]` / `[🔕 Mute 1w] [⏰ 0.2%]` /
  `[Open scanner]`; two or three: `[📊 SYM]…` / `[🔕 SYM 1w]…` / `[⏰ SYM 0.2%]…` (callbacks `c:SYM`, `m:SYM:7`,
  `r:SYM:0.2`, handled by the bot).
- **Kevin cross-check** (`kevin.py`): a signal / zone that overlaps a priced level of Kevin's newest 3 daily plans
  (`tools/kevin_daily/calls.json`, same instrument and side, ranges overlapping within ±0.1% of price; DXY = USDX,
  SPX500 = US500, WTICOUSD = SPOTCRUDE) gets `⭐ also in Kevin's plan (Oct 28: 1H demand 4024–4041)` on its card
  (and `kevin` in latest.json) and comes first.
- The dedupe state lives in `.cache/state.json` (actions/cache). With no state (first run, lost cache) one "started"
  message + the summary is sent instead of replaying every event.
- Failures (no token, OANDA unreachable, < 50% of the instruments with data, **a failing unit test**): at most one
  message per day, nothing published, the run is red. A candle off the server-time grid (H4 / D1 / W1 not on a
  boundary, MN more than 12 h off the 1st) drops that instrument for the run (`fxcfg.Misaligned`).

Preview without sending: `python3 tools/fx_scanner/fxscan.py --preview-telegram` (alert, H4 check, daily summary of
`public/fx/latest.json`; `--preview-from tools/fx_scanner/fixtures/sample/latest.json` for a busy day).

## Files

| File | What it does |
|---|---|
| `fxcfg.py` | settings (env), chain, stop table, classes, pips, the server-time clock |
| `oanda.py` | OANDA v20 client: candles (cold 5000 / incremental `from=`), account instruments; cache in `.cache/candles` |
| `watchlist.py`, `watchlist.txt` | TradingView export → OANDA instruments, Pepperstone names (+ `attach_extra`: extra sources) |
| `sources/` | extra data sources: `synthetic.py` (OANDA legs), `crypto.py` (Coinbase / Kraken / Binance.US / OKX), `yahoo.py`, `bars.py` (grid + cache), `candles()` |
| `fxcore.py` | the rules (zones.py on the FX chain), signals, lists, checks |
| `fxnotify.py` | Telegram cards, alerts, the daily summary (uses the stock scanner's sender) |
| `fxscan.py` | CLI, run, outputs, events / dedupe, USDX, `--selftest`, `--preview-telegram` |
| `SCHEMA.md` | the `public/fx/*.json` contract used by the app |
| `instruments.json` | fallback instrument list (`instruments`) + the extra-source mapping (`extra`) |
| `fixtures/` | synthetic H4 generator (+ H1 split), textbook chain, `sample/` = selftest output (app demo data) |
| `../../.github/workflows/fx-scan.yml` | the schedule |

Outputs: `public/fx/latest.json`, `public/fx/d/<class>.json` (per-instrument detail with H1 / H4 / D1 / W1 bars).

## Run locally

```bash
export OANDA_API_TOKEN=...            # never commit it
python3 tools/fx_scanner/fxscan.py --force --no-notify
python3 tools/fx_scanner/fxscan.py --only EURUSD,XAUAUD --no-notify
python3 tools/fx_scanner/fxscan.py --crypto --force --no-notify     # crypto-only (weekend) scan
python3 -c "import sys; sys.path[:0]=['tools/fx_scanner','tools/stock_scanner']; import sources; print(sources.candles('BTCUSD','H4',count=3))"
python3 tools/fx_scanner/fxscan.py --selftest
python3 -m unittest discover -s tools/fx_scanner/tests
```

Env (defaults): `OANDA_ENV` (practice), `FX_INCLUDE_CFD` (false), `FX_WATCHLIST`, `FX_SOFT_REACH_PCT` (5),
`FX_APPROACH_H` (1.0), `FX_NEAR_H` (1.0), `FX_LEFT_BARS` (6), `FX_NEW_BARS` (6), `FX_TP_OFFSET_PIPS` (7),
`FX_MIN_LEG_X` (2), `FX_TL_FAR_PIPS` (25), `FX_TL_MAX_TOUCHES` (3), `FX_HOST_MAX_DEPTH` (75), `FX_WEEKEND_FROM_H` (12),
`FX_MAX_SPREAD_FRAC` (0.10), `FX_GOLD_USD_MIN_TF` (D1), `FX_DEDUPE_HOURS` (24), `FX_BUDGET_MIN` (25),
`FX_MIN_COVERAGE` (0.5), `FX_WORKERS` (4), `FX_APP_URL`, `FX_CACHE`.
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
