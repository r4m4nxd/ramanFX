# Pinndx: feature spec and gap analysis for the RamanFX scanner

Research date 2026-10-26. Purpose: take the **feature and UX ideas** and the **supply & demand rule logic** behind
Sam Seiden's Pinndx product and decide what our own stock scanner (`tools/stock_scanner`, `src/pages/Scanner.tsx`)
should adopt. No Pinndx code, branding, logos or copy is to be reused; the screenshots in `docs/research/pinndx/` are
internal reference only (usernames blacked out) and must not ship in the app.

## Sources and how far to trust them

| Tag | Source | What it gives |
|---|---|---|
| **[V]** | Owner's Drive video "Pinndx Overview_July 27_1080p.mp4" (7:32, 1080p). Transcribed locally with faster-whisper base.en; frames every 10 s. Timestamps below are mm:ss in that video (frame times ±5 s). | A **marketing** video: shows the real UI (gauges, market page, dashboard, global index) but explains **no rule logic**. |
| **[W]** | pinndx.com home page incl. `#demo` (the demo is the same video). Read 2026-10-26. | Feature list, the zone panel (Distal / Proximal / PZ1-PZ2-PZ3), "6 steps" of the trade, pricing. |
| **[S]** | Seiden's own articles already in the repo: `src/core/mentors/seiden/*`, checklist `src/core/checklists/seiden.ts` (L = PDF page). | The odds-enhancer rules (the logic Pinndx says it automates). |
| **[3P]** | Third-party summary the owner pasted (via coordinator). **Unverified**; each claim is marked confirmed / partly / not seen below. | Fair-value concept, zone qualities, alerts. |

Bottom line: Pinndx is a **closed "black box"** (they call the engine proprietary). The UI is fully visible, but
their exact zone rules are not published. The rule section therefore uses Seiden's own published odds enhancers
[S] as the best proxy for what the engine scores.

## 1. What Pinndx is

A browser app (log-in at an `app.` subdomain [W]) that scans "more than 500 markets" (stocks, options, futures,
forex, crypto, even prediction markets [V 01:47]) for institutional supply and demand zones in real time and shows
each market as one **zone gauge**. Sold as a membership with live trading sessions, an education library and a
community [V 05:35-06:38, W]. **No broker execution** seen anywhere (confirms [3P]). The product has two engines:

1. **Zone Intelligence**: per-market supply and demand zones ("where the largest market imbalances are",
   [V 01:19-01:39]).
2. **Global Index (PNDX)**: their own index "of the entire global stock market" with its **own** supply / demand
   zones [V 03:14-03:41, W]. A stock zone + the index in a same-direction zone at the same time = "a second,
   independent confirmation" [V 03:48-04:09].

Marketing promises six steps "right on the chart" [W]: 1 alerts find it first, 2 know when to buy, 3 know where
price is most likely to move, 4 know when to wait, 5 profit-zone targets, 6 know when to sell.

## 2. Screens and workflow (with video timestamps)

| # | Screen | What is on it | Video / image |
|---|---|---|---|
| 1 | **Zone gauge** (the core widget) | Vertical bar per market. **Bottom blue block = demand** ("where you buy"), **top light block = supply** ("where you sell"), price marker (box with the last price, up/down arrow) floats between; **middle = wait**. Each block shows "**x.x% away**" (distance from price to that zone). Price inside a zone = the block lights up / outlined. | [V 02:08-02:35] · `01_gauge_demand_buy.jpg`, `02_gauge_supply_sell.jpg`, `12_site_hero_gauge.jpg` |
| 2 | **All markets / gauge wall** | Gauges side by side, the global-index gauge pinned at the left. Category tabs across the top (read from the frame, approximate): All Markets, Session Picks, Futures, Top Picks, Mag 7, Tech, Sector ETFs, Forex, Crypto, Commodities, Dividends & Income, Semiconductors, AI & Cloud, Financials. Horizontal scroll. Each column header = ticker + **zone source badge** (algorithm vs. "Forum"/session pick; the same ticker can appear twice, once per source). | [V 02:00, 02:41-02:47, 05:05-05:19] · `03_gauge_grid_tabs.jpg`, `04_gauge_grid_closeup.jpg`, `11_multi_market_supply_alignment.jpg` |
| 3 | **Market page** (e.g. GOOG, LLY, NVDA) | Title; market-status pill (Markets Open / Pre-Market / after hours) + date-time; candlestick chart (intraday, roughly hourly bars over ~3 days) with three shaded horizontal bands: **Supply** (grey), **Fair Value** (brown, labelled), **Demand** (blue); price-axis tags for proximal / distal; **ENTRY** and **PZ1 / PZ2** markers on the chart where they were hit; a **zone-source switch** (algorithm vs. "Session picks: Forum"); bookmark (add to watchlist); tab switch **[TICKER] / [INDEX]** for the gauge; right panel: **Supply zone** (Distal, Proximal, Profit zone selector PZ1 PZ2 PZ3) and **Demand zone** (Proximal, Distal, PZ1 PZ2 PZ3); "Key statistics" row (open, market cap, day high / low, 52-week high / low). Only **one supply and one demand** (the nearest pair) is shown per market. | [V 02:30, 03:48, 04:50] · `05_market_detail_fairvalue.jpg`, `10_entry_pz_markers.jpg` |
| 4 | **Dashboard** | Left nav: Home, All Markets, My Watchlist, Online Sessions, Calendar, Education, Community, News, Help. Top cards: latest news; featured markets with an **IN SUPPLY / IN DEMAND** badge (e.g. a forex pair "in supply", a stock "in demand"); next live session. Main: global-index chart with Supply / Fair Value / Demand bands + its gauge + zone panel; Watchlist below. | [V 03:00-03:14] · `06_dashboard_global_index.jpg` |
| 5 | **Global index view** | Same as a market page for the index; "moves into demand" / "into supply" moments. | [V 03:22-03:41] · `07_global_index_into_demand.jpg` |
| 6 | **Alignment view** | Stock page and index page side by side, both in supply at the same time (GOOG on 2026-07-20; claimed −16 %; S&P −130 points; July 1st: many mega caps + index in supply, Nasdaq −5 %). | [V 03:48-05:26] · `08_stock_vs_global_index.jpg`, `09_alignment_example.jpg` |
| 7 | Education / community / live sessions | Course library by market, session calendar, a member feed. Not relevant to the scanner. | [V 05:55-06:38] |

**Workflow implied**: open the dashboard → check the global index (in demand / supply / middle) → scan the gauge
wall or a category tab for markets sitting in or near a zone → open the market page → read proximal / distal,
choose a profit zone (PZ1-3) → act (buy at demand, sell at supply, otherwise wait) → alerts warn when price reaches
a watched zone [W "real-time alerts & market updates"].

## 3. Zone rules and odds enhancers

### 3.1 What Pinndx itself shows (observed)

- **Zones have proximal and distal lines** [W: META panel "Supply zone Distal 668.41 Proximal 660.16"]. Same
  convention as ours.
- **Fair value band** drawn on every chart [V 02:30, 03:30, 04:22, 04:50]. Supply sits **above** it, demand
  **below** it; in every example the band is the recent, wide, two-way-traded range. (Confirms the [3P] claim that
  FV is the recent high-activity range and that zones lie outside it. The claim that zones in the middle of FV are
  filtered out is consistent with every frame (no zone inside FV is ever drawn) but not stated.)
- **Profit zones PZ1, PZ2, PZ3** per zone [W, V 02:30]. In the LLY example [V 04:50] PZ1 is hit inside the fair
  value band and PZ2 at its upper edge, the supply above being the far target. Inferred: PZ1 ≈ the near side /
  middle of FV, PZ2 ≈ the far side of FV, PZ3 ≈ the opposing zone. **Not confirmed**; the definition is not
  published.
- **Distance readout** "x.x % away" from price to each zone [V, W]. Confirmed ([3P]).
- **Entry marker** at the proximal on first return [V 04:15, 04:50]. Confirmed (entry guidance).
- **Both directions**: buy at demand, sell / short at supply [V 02:08-02:28].
- **Intraday zones**: the market pages show intraday bars; zones are refreshed "in real time" [V 00:45-00:58].
  No timeframe selector is visible in the video.
- **Two zone sources** per market: the algorithm and human "session picks" from the live sessions (badge on the
  gauge, switch on the market page) [V 02:00, 04:50, 05:05].

### 3.2 What the engine most likely scores: Seiden's odds enhancers [S]

Pinndx says it is "built on our proven supply & demand strategy" [V 01:13]. That strategy's published qualifiers
(repo `src/core/checklists/seiden.ts`, Seiden article pages in brackets):

| Odds enhancer | Seiden's rule | Points (classic Seiden / OTA sheet, as commonly cited) |
|---|---|---|
| **Strength of departure** | How price left the base: gap > big candles > gradual (L1 · L335). | 2 / 1 / 0 |
| **Time at level** | Fewer candles in the base = stronger (L331 · L391; L5 says 3-6 ideal, later articles say fewer). | 1 (1-3 candles) / 0.5 (4-6) / 0 |
| **Freshness** | 1st return 2, 2nd 1, 3rd 0 (L1). A level penetrated ≥ 25 % is spent (L418). | 2 / 1 / 0 |
| **Profit margin** | Room to the opposing level ≥ **3:1** (L1 · L163); "empty space with no basing" to the next level (L414). | 2 (≥ 3:1) / 1 (2-3:1) / 0 |
| **Trend** | Uptrend: buy demand only (L410); larger TF for direction, smaller for entry (L97 · L299). | 2 with / 1 sideways / 0 against |
| **Curve (big picture)** | Buy low on the HTF curve, sell high (L9 · L102); never at equilibrium / middle of a range (L46 · L89). | 1 (low for demand) / 0.5 middle / 0 |
| Decision | 9-10 = limit order ("set and forget"); 8 = wait for confirmation; < 7 = no trade (L1). | max 10 |
| Extras | Prefer pivots (DBR / RBD) over continuation bases (L178 · L93); stacked levels stronger (L321); bad news into fresh demand = buy (L150); stand aside before big announcements (L410). | qualitative |

The [3P] list of zone qualities (strong / fresh base, sharp departure incl. gaps, big distance from FV, big profit
zone to the next opposing zone, institutional imbalance footprint) maps one to one onto this table; "distance from
FV" is Pinndx's version of the curve / equilibrium rule.

### 3.3 Signals and alerts

- **Signal states** per market: *in demand* (buy), *in supply* (sell), *middle* (wait) [V 02:08-02:35]; on the
  dashboard cards as **IN DEMAND / IN SUPPLY** badges [V 03:00].
- **Alerts**: "Alerts find it first", "real-time alerts & market updates" [W]. [3P] says alerts fire when price
  approaches a watchlist zone and when the global index reaches a zone; the video shows a bell icon in the header
  but no alert screen, so the trigger rules are **not seen**.
- **Confirmation** = the global index in a same-direction zone at the same time [V 03:48-04:09]; best case = many
  large caps + the index in the same kind of zone at once [V 05:05-05:26].

### 3.4 Watchlist, filters, markets

- **My Watchlist** (nav item, bookmark button on each market page, watchlist strip on the dashboard). [3P]
  "watchlists with filtered zones only": consistent (only the one filtered supply / demand pair is shown) but not
  stated.
- **Category tabs** instead of free filters (see screen 2). No screener-style filters (score, sector, % away) are
  visible.
- **Markets**: 500+, multi-asset, intraday real time. **Timeframes**: not exposed in the UI.

## 4. Gap table vs. our scanner

Ours today (README, `zones.py`, `scan.py`, `Scanner.tsx`): daily run after the US close, ~2,600 US stocks (SPX,
NDX, DJI, RUT), D1 + W1 demand zones with MN context, Raja rule set → **BUY / WATCH / EXIT (holdings)**, Raja lens
score 0-10, plan (entry = proximal, stop = distal − 10 % / 5 % of height, target 0.5 % before the next supply, R:R),
regime row (SPY / QQQ / IWM vs 200-day SMA + curve + direction), mini chart, Telegram by sector, index + sector
filters, walk-forward backtest. Long only.

**Precedence**: Raja's rules win every conflict. Seiden / Pinndx ideas enter only as **optional extras, score
bonuses or display**, never by loosening a Raja veto. Anything that changes which signals are shown must first beat
the current rules **out of sample** in `backtest.py` (our forex evidence for mechanical zones was negative after
costs, `docs/research/Evidence_Review_2026-10.md`).

| Feature | Pinndx | Ours | Proposal | Pri | Raja conflict? |
|---|---|---|---|---|---|
| **Zone gauge** (supply top, demand bottom, price marker, % away each side) | Core widget [V 02:08] | Mini candle chart + numbers per card; no supply side shown | `ZoneGauge` component on every card: nearest demand (our zone) and nearest supply (`next_supply`, `supply_distal`), price marker, "% away" both sides, state In demand / Middle / In supply. Data already in `latest.json` except a `supply_proximal` naming tidy-up. Our own visual style. | **P1** | None (display) |
| **Gauge wall / watchlist view** | Side-by-side gauges + category tabs [V 02:41] | Card list; index + sector filters | "Wall" toggle on `/scanner` showing gauges for the current filter, sorted by % to demand; SPY / QQQ / IWM / DIA composite pinned left. Sector filter = our "category tabs". | **P2** | None |
| **% away readout + sort** | Yes | `to_entry_pct` exists, not sortable | Sort by % to entry, score, R:R; show "% to supply" too. | **P1** | None |
| **Fair value band** | Drawn on every chart; zones lie outside it | None | `fair_value(S)`: value area of the last N = 20 D1 bars (70 % of volume, volume spread evenly over each bar's range; fall back to 25th-75th percentile of closes). Output `fv_lo`, `fv_hi`, and `fv_dist_atr` = (fv_lo − proximal) / ATR14 for demand. Draw the band on the mini chart. **Filter**: zone proximal inside FV → flag "inside fair value" (Seiden "never at equilibrium", L46 · L89). **Bonus**: +1 Seiden point when the zone is ≥ 1 ATR below FV. Keep it a flag, not a veto, until backtested. | **P1** (compute + draw), P2 (bonus) | Raja's curve (MN, 25 / 50 / 75 %) stays the gate; FV is short-term only. No veto → no conflict |
| **PZ1 / PZ2 / PZ3 profit targets** | Per zone [W] | One target (0.5 % before next supply) + R:R | `pz1` = near edge of FV or 2R (whichever is higher but below target), `pz2` = far edge of FV or 3R, `pz3` = our Raja target. Show as chips + chart lines; R:R per PZ. Raja's own management (two positions, close one at the near target, hold the other; L7 · L103) maps to "close half at PZ1, hold to PZ3". Backtest each PZ as an exit variant. | **P1** | Raja target = PZ3 stays primary. **Conflict**: Seiden moves the stop to breakeven at 3:1 (L223); Raja says breakeven gets hunted (L7 · L103) → do **not** add a breakeven rule. |
| **Global index + alignment** | Own global index with its own zones; same-direction zone = confirmation [V 03:14-04:09] | Regime row only (SPY / QQQ / IWM above 200 SMA, curve, direction); no zones on the index | Build `RFX index`: equal-weight composite of SPY, QQQ, IWM, DIA (normalised to 100 on a start date; option: equal-weight of our universe for breadth). Run `zones.detect` + `dna` on its D1 / W1 / MN bars like any ticker. Per signal add `index_state` (in demand / middle / in supply) and `index_aligned` (index at or within approach of a fresh demand when we BUY). Score: +1 bonus when aligned; flag "index in supply" (no veto). Show the index gauge pinned at the top of `/scanner`. | **P1** | Raja has no index rule; Raja MN direction per stock stays the gate. Bonus + flag only. |
| **Breadth alignment ("July 1" view)** | Many mega caps + index in supply together | Not computed | Daily count: % of universe in demand / in supply / middle (per sector too). Show as a bar in the regime row; Telegram header line. | P2 | None |
| **Seiden odds score** | Implied (proprietary engine) | Raja lens 0-10 only; `departure_x`, `base_candles`, `touches`, `room_r`, `curve` already computed | Add `seiden_score` 0-10 from fields we have: departure (gap open beyond the base = 2, `departure_x` ≥ 2 = 1), time (1-3 base candles = 1, 4-6 = 0.5), freshness (2 / 1 / 0), margin (`room_r` ≥ 3 = 2, ≥ 2 = 1), trend (Raja direction FULL = 2, REDUCED = 1), curve (≤ 25 % = 1, ≤ 50 % = 0.5). Show next to the Raja score with a tooltip breakdown; sort option. Does **not** gate BUY. | **P1** | Raja score stays the headline and the BUY gate. Differences to note in the tooltip: Raja requires departure ≥ 1.2x (L55 says 2x), Raja uses the zone **before** a gap (L55) while Seiden scores the gap as the strongest departure; Raja's minimum room is 2x (Seiden 3x). |
| Pivot vs continuation base | Seiden prefers DBR / RBD (L178) | We trade STRONG / ARR / WOW incl. continuation (CP / PCP) zones | Show `pattern` badge (already in JSON); +0.5 Seiden bonus for DBR. Never drop Raja CP zones. | P3 | **Conflict**: Seiden does not count DBD / RBR as real zones; Raja trades PCP / strong CP. Raja wins. |
| 25 % penetration rule | Seiden: level penetrated ≥ 25 % is spent (L418) | Removal only by a close beyond the distal; tested = a low at the proximal | Compute `max_penetration_pct` of later touches; display only; optional filter "hide > 25 % penetrated" default off. | P3 | **Conflict**: Raja removes a zone only by a close beyond the distal (L4 · L50). Raja wins; info only. |
| **Watchlist** | My Watchlist, bookmark per market | None (holdings only for EXIT) | Star button on cards; watchlist stored per viewer (localStorage for the UI); for alerts a `WATCHLIST_JSON` secret like `HOLDINGS_JSON`. Watchlist tab shows the gauge for every starred ticker even without a BUY. | **P1** | None |
| **Approach / in-zone alerts** | "Alerts find it first", real time | Daily Telegram digest (BUY / WATCH / EXIT) | Daily (close-based) alerts: **APPROACH** when a watched ticker's close is within max(1 zone height, X % = 3 %) of a fresh demand proximal (reuse `APPROACH_H` / `APPROACH_PCT`); **IN ZONE** when the low touched the proximal and no close below the distal; **INDEX** when the RFX index enters / leaves a zone. Dedupe via a small state file. Real intraday alerts would need intraday data (Yahoo 60 m is limited to ~730 days and rate-limited) and a non-cron runner; note as P3. | **P1** (daily), P3 (intraday) | None |
| Supply side / short signals | Sell at supply | EXIT warnings for holdings only | Show supply zones in the gauge (P1, above); an "Avoid: in supply" flag on any card where price is inside a fresh W1 / MN supply (already a Raja veto, just surface it). No short signals (cash account). | P2 | Raja vetoes buys at HTF supply (L50 · L52); consistent |
| Zone source: algorithm vs. mentor picks | "Session picks / Forum" zones | Algorithm only | Manual "mentor picks" JSON (owner enters zones from Raja / Kevin sessions, e.g. `tools/kevin_zoom/` notes) shown with a source badge and the same gauge. | P3 | None; mentor picks are Raja / Kevin by definition |
| Intraday zones / LTF confirmation | Intraday charts, real time | D1 / W1 only; tested zones need H1 confirmation (WATCH) | Optional H1 data for WATCH tickers only to automate the Raja H1 confirmation (trendline cross + opposite zone removed). | P3 | Implements Raja L52 · L101 |
| Market status, key stats | Status pill, key statistics row | Scan date + "ago"; fundamentals table exists (SEC) | Card footer: 52-week high / low, market cap (from cached data / SEC). | P3 | None |
| Multi-asset (forex, futures, crypto) | 500+ markets | US stocks | Out of scope for the stock scanner; ZoneVision covers forex. ETFs (sector SPDRs) as a category could be added cheaply. | P3 | None |
| Rule transparency | Black box | Every rule with lesson reference, pass / fail per card | **Keep**: our advantage. Every new bonus gets a line in the rule list with its source (Seiden L-page or "Pinndx-inspired"). | — | — |
| Backtest / evidence | Testimonials only | Walk-forward backtest with OOS CI | Add the new fields to `trades.csv` (fv_dist_atr, seiden_score, index_aligned, pz hit) and report win rate / expectancy by bucket before any becomes a filter. | **P1** | — |

## 5. Implementation notes (for the build)

- **Python** (`zones.py` / `scan.py`): `fair_value(S, n=20)`, `seiden_score(z, x, an)`, `pz_levels(z, x, fv, plan)`,
  `index_series()` (composite from cached SPY / QQQ / IWM / DIA bars, same `Bar` type) analysed with the existing
  `analyse()`; per-signal fields `fv_lo`, `fv_hi`, `fv_dist_atr`, `fv_inside`, `seiden_score`, `seiden_parts`,
  `pz1..3`, `rr_pz1..3`, `index_state`, `index_aligned`, `supply_pct_away`; top-level `index` block (gauge data) and
  `breadth` counts; `alerts` list for watchlist tickers. Pure functions + unit tests on fixtures, no look-ahead (FV
  and index use bars up to the signal day only).
- **App** (`Scanner.tsx`, `src/core/scanner.ts`, `src/ui/`): `ZoneGauge` (vertical, accessible: text equivalent
  "Demand 2.4 % below, supply 8.1 % above, price in the middle"), FV band + PZ lines in `ZoneMiniChart`, star /
  watchlist tab, wall view, index gauge in the regime area, sort control, Seiden score chip with breakdown.
- **Telegram** (`notify.py`): index line + breadth in the header; APPROACH / IN ZONE section for watchlist tickers.
- Default behaviour of BUY / WATCH / EXIT must not change until the backtest supports it.

## 6. Reference images (internal only, from [V] unless noted)

| File | Time | Shows |
|---|---|---|
| `pinndx/01_gauge_demand_buy.jpg` | 02:10 | Gauge, price in demand ("buy here") |
| `pinndx/02_gauge_supply_sell.jpg` | 02:20 | Gauge, supply highlighted ("sell here") |
| `pinndx/03_gauge_grid_tabs.jpg` | 02:00 | Gauge wall, nav, category tabs (username blacked out) |
| `pinndx/04_gauge_grid_closeup.jpg` | 02:40 | Gauges side by side, % away labels |
| `pinndx/05_market_detail_fairvalue.jpg` | 02:30 | Market page: supply / fair value / demand bands, zone panel, PZ selector (username blacked out) |
| `pinndx/06_dashboard_global_index.jpg` | 03:00 | Dashboard with IN SUPPLY / IN DEMAND cards and the index |
| `pinndx/07_global_index_into_demand.jpg` | 03:30 | Index entering demand |
| `pinndx/08_stock_vs_global_index.jpg` | 03:50 | Stock zone vs index zone side by side |
| `pinndx/09_alignment_example.jpg` | 04:20 | Entry at stock supply while the index is in supply |
| `pinndx/10_entry_pz_markers.jpg` | 04:50 | ENTRY, PZ1, PZ2 markers vs the fair value band |
| `pinndx/11_multi_market_supply_alignment.jpg` | 05:00 | Many markets + index in supply at once |
| `pinndx/12_site_hero_gauge.jpg` | [W] | Chart + gauge with % away |
| `pinndx/13_site_trade_steps.jpg` | [W] | The 6 trade steps |

![Gauge](../../../pinndx_frames_local/01_gauge_demand_buy.jpg)
![Gauge wall](../../../pinndx_frames_local/04_gauge_grid_closeup.jpg)
![Market page](../../../pinndx_frames_local/05_market_detail_fairvalue.jpg)
![Dashboard](../../../pinndx_frames_local/06_dashboard_global_index.jpg)
![Alignment](../../../pinndx_frames_local/09_alignment_example.jpg)
![Entry and PZ markers](../../../pinndx_frames_local/10_entry_pz_markers.jpg)
![Breadth alignment](../../../pinndx_frames_local/11_multi_market_supply_alignment.jpg)

## 7. Open questions

- Exact PZ1 / PZ2 / PZ3 and fair-value definitions are proprietary; the proposals above are our own definitions to
  be validated by backtest, not a reconstruction.
- Pinndx's performance claims (GOOG −16 %, Nasdaq −5 %, testimonials) are marketing, unverified, and cherry-picked;
  the site itself says testimonials are unverified.
- Which timeframe(s) Pinndx zones come from is not shown; their charts are intraday.
