# RamanFX ZoneBot v1.62: supply & demand strategy review

Scope: `public/tools/RamanFX_ZoneBot.mq4` (presets ZONES_3R, BREAKOUT, IMPULSE, KEVIN_BEST), checked against Kevin's material and the Seiden / OTA odds-enhancer framework. This is a read-only review: nothing in the bot was changed. Bot references are function names, with the v1.62 line number where it helps.

Source keys: **VL** = `src/core/videoLessons.ts`, **ZS** = `src/core/zoomSessions.ts`, **CO** = `src/core/coach.ts`, **CL** = `src/core/course.ts`, **ST** = `src/core/strategy.ts`, **PB** = `src/core/playbook.ts`. "Seiden" means the OTA odds enhancers: strength of the move out, time at the level, freshness, profit margin, trend and curve.

What the evidence says. One XAUUSD run had 33 trades, a 21% win rate, PF 0.37 and -14R. With wins of 3R, a 21% win rate would give PF of about 0.80 (0.21 x 3 / 0.79). A PF of 0.37 instead implies an **average win of about 1.2R**. So the real 3R hits were rarer than 21%: break-even scratches (the stop sits at entry + spread, so a scratch closes slightly positive) are probably being counted as wins. 14 of 33 trades were stopped within 5 minutes of the fill, which means the stop sat inside normal 1-5 minute noise on gold. 33 trades also prove almost nothing statistically: the standard error at n = 33 is about 0.3R per trade.

---

## 1. Top 10 reasons a mechanical S&D bot loses to a discretionary trader (ranked by expected impact)

| # | Reason | Where in this bot | Evidence / mechanism | Impact |
|---|---|---|---|---|
| 1 | **Stops sized to the zone, not to the instrument's noise.** A discretionary trader on gold "gives it wiggle room" | `Scan` Z3 block (~1352-1361) overwrites `sl` **after** the `minStop` / `InpMinStopATR` floor (1330-1331), so Zones 3R has no volatility floor at all. The stop is 1.1 x zone height + spread. M15 zones are capped at 1.5 x M15 ATR (`DetectZones` 853), which gives $2-10 stops against a $50-500 daily range. `TfStopPips` / `pip` (1251) equal $0.01 on XAUUSD, so every pip-based buffer is 10-100x too small on metals | 14 of 33 stopped within 5 minutes. ZS:150, ZS:191, ZS:397 ("spread stopped him out of zones that were respected"), ZS:2384, ZS:5676, CL:113 | Very high |
| 2 | **Everything drawn is traded.** Kevin separates drawable from tradable (ZS:1871, ZS:4642); a human takes perhaps 1 in 5 zones | `VNotes` verdict: STRONG = no deal-breaker AND 5 or more pluses. "fresh" and "in the chain" are always true after `VSelect`, and "base <= 3", "with HTF trend" and "clear space" are common, so **STRONG is close to the default**. Z3 also skips the departure test (`Scan` 1391 `!IsProt()`) and the "no pullback yet" test (1403-1412, non-Z3 only) | No real ranking of the move out, departure or location | Very high |
| 3 | **No location / profit-margin check.** The fixed 3R target runs straight into opposing HTF zones | Z3 sets `cappedByHtf = false` (1359) and ignores `hOpp`. `InpCurveFilter` is skipped for Z3 (1384 `!IsZ3()`). `Curve` uses the 100-bar HTF high / low, not the distance between the HTF demand and supply zones (CL:333) | CO:46 (profit margin), CO:19 / CO:45 (curve), VL:505 / VL:575 (counter-HTF trades give only 1:1 to 2:1), VL:1651-1653 | High |
| 4 | **Adverse selection of resting limits.** In momentum, the limits that fill are the ones price runs through. A human waits for departure or confirmation | Z3 arms a zone as soon as the stay-away candle closes and price is within 2 x HTF ATR. There is no minimum number of bars away and no departure distance (`z.departure` is computed in `DetectZones` but only filters Custom). Z3 never uses `ConfirmedBy` | ZS:450 (downgrade a zone that price returns to on the very next candle). The quick stop-outs match this | High |
| 5 | **Break-even at 1R on a target of 3R.** On gold, 1R is about noise size, so price often retraces to entry before running | `EffBeTrig` hard-codes 1.0 for Z3 (no input), then `ManageOpen` sets the stop to open + spread + commission | Implied average win of about 1.2R. Kevin moves to BE at about 2:1 (VL:2388, VL:2480). Early BE on high odds is a mistake (CO:23, ST:218, CL:92) | High |
| 6 | **Trading both sides, and trading sideways HTF** | `IsProt()` allows buys and sells together. In `VNotes`, "against the HTF trend" is a deal-breaker only when `trend == -dir`. With `trend == 0` (unclear), both sides can be STRONG, and `InpZ3Bias = false` | VL:530 (inside HTF demand only buy), VL:2910-2912 (sideways HTF = low odds, no setups in a messy range) | Medium-high |
| 7 | **Blind to news, sessions and rollover in the tester** | `LoadNews` returns early in the tester unless `InpTesterNews`. `InpSkipAsian = false`. `InpTesterGMT` is fixed (no DST). The rollover spread at 21-23 UTC hits tiny stops | VL:1542, ZS:3238, CO:52. The biggest gold candles are USD data releases | Medium |
| 8 | **Arming too far away and hogging the risk budget** | `InpMaxDistATR = 2` HTF ATR. `OpenRiskPct` counts **pending** orders, so six 0.5% pendings fill the 3% cap (`BestBlocked`) and the better, nearer zone that forms later is refused. `ManageOrders` cancels beyond 3 HTF ATR, then re-arms | ZS:2354 ("closer is better") | Medium |
| 9 | **Stacked AND-gates with no funnel → 0 trades** (Kevin best) | Grade A needs `VNotes` R:R >= 3, measured with `InpStopBufferPts` x 2 = $0.20 on gold, which inflates R:R. The Kevin-best ATR widening (1335-1340) then kills it ("best: rr after the wider stop"). On top come `BestKevinRules`, `KCross`, the 1-HTF-ATR wait and `TfOn` (M15-H4 only) | The strict runs had 0 trades. The skip counters (`Count`, `VizTally`) exist but nobody reads the funnel | Medium |
| 10 | **One parameter set for FX and metals, and decisions from tiny samples** | Pip-unit constants (`TfStopPips`, `InpMinStopPips`, `InpStopBufferPts`). `InpMinLegRatio = 1.2` (a weak move out passes, kept for ZoneVision parity). Gold's volatility regime changed in 2024-26 | Kevin: "much of this is experience" (VL:1645). An edge "plays out over hundreds of trades" (CO:24, CL:178) | Medium |

---

## 2. Testable improvements

Principle: **keep ZoneVision's drawing exactly as it is** (the parity rule) and add a separate *trade filter* on top of it. Kevin's own split is "drawable but not tradable". Every new rule below is an input, so it can be switched off and A/B tested. "Z3+" means a Zones 3R variant: the same preset with these inputs set.

| # | Rule (exact) | New input = default | Rationale (source) | Preset |
|---|---|---|---|---|
| 1 | **Volatility stop floor.** risk = max(distal + max(spread, 0.10 x h) + spread, k x ATR14(ETF), m x ATR14(HTF)). The stop moves out beyond the distal and lots shrink to keep 0.5%. TP = entry + 3 x final risk | `InpZ3MinStopATR = 0.75` (ETF ATR). `InpZ3MinStopHTF = 0.25` (metals / oil only) | ZS:150, ZS:191, ZS:397, ZS:2384, ZS:5676; CL:79 ("tighter stop = normal fluctuations can hit it") | Z3, Breakout (`InpBoStopBuf`) |
| 2 | **Stop sanity cap.** Skip when risk > 2.0 x ETF ATR, so a widened stop is not a different trade. Also skip when risk < 0.05 x D1 ATR (about $2.5 for a $50 day) | `InpZ3MaxStopATR = 2.0`, `InpMinStopD1 = 0.05` | The stop must be the zone plus room, not a random number | Z3, Best |
| 3 | **Profit margin.** Room from entry to the nearest live opposing HTF zone (`HtfZones`, `hOpp`) must be >= `InpZ3RR` x risk. Otherwise skip (or cap the TP and require >= 2R) | `InpZ3NeedRoom = true` | CO:46, VL:505, VL:1653 (take 2:1 when under an opposing HTF zone) | Z3 |
| 4 | **Departure / leg-out.** `z.departure` >= 2.0 (price went >= 2 zone heights away within 10 bars) AND >= 3 closed bars between the stay-away candle and arming | `InpZ3MinDep = 2.0`, `InpZ3MinBarsAway = 3` | Seiden: strength of departure. ZS:450 (a return on the next candle = downgrade), ZS:3192 | Z3 |
| 5 | **Odds-enhancer score** (replaces "STRONG" as the Z3 gate and the grade-A gate in Best). Strength: legRatio >= 2.5 or `erc` = 2, >= 1.8 = 1. Second explosive leg (`leg2`) = +1. Time: baseN <= 2 = 1. Freshness: `pen` = 0 → 2, < 0.25 → 1. Departure >= 3 = 1. Trend with bias = 2, unclear = 0. Curve (#6) in the right third = 2, right half = 1. Profit margin >= 5R = 2, >= 3R = 1. Confluence (`KNear` trendline, `AtHtfZone`, trap) = +1 each, max 2. **Total 0-15. Trade at >= 10, half risk at 8-9** | `InpMinScore = 10` | CO:32 (move away), CO:19, CO:45, CO:46, VL:1642-1645 (depth and test count), ZS:440 (second explosive candle), Seiden scorecard | Z3, Best |
| 6 | **HTF curve location.** Measure the curve between the nearest live HTF demand and HTF supply (not the 100-bar high / low). Buy only when depth <= 33% (50% when inside a same-direction HTF zone); supply mirrored | `InpCurveFilter = true` for Z3, `InpCurveMode = zones` | CL:332-336, CO:19, CO:45, ST:176 | Z3, Best |
| 7 | **No trade when the HTF is unclear.** Skip when `trend == 0` (KBias and HtfTrend both flat) | `InpZ3SkipUnclear = true` | VL:2910-2912 | Z3 |
| 8 | **No hedging.** Skip a zone when the symbol has a live order or position in the other direction. Optionally `InpZ3Bias = true` | `InpZ3Hedge = false` | VL:530, VL:561 | Z3, Breakout |
| 9 | **Front-run.** Test entry at 0 / 5 / 15 / 25% of h before the proximal. On gold, reactions often start before the line, but a bigger front raises risk per unit of target. Measure the fill rate and the expectancy per signal (not per fill) | `InpZ3Front` in {0, 0.05, 0.15, 0.25} | VL:792, ZS:2380 ("just a little before") | Z3 |
| 10 | **Break-even timing** (see the formula below). Make it an input: off / 1.0 / 1.5 / 2.0R, plus a variant "half-risk (stop to -0.5R) at 1R, BE at 2R" | `InpZ3BE = 2.0`, `InpZ3HalfRisk1R = false` | VL:2388, VL:2480 (BE after about 2:1), CO:23, ST:218, CL:92-93 | Z3, Breakout, Impulse |
| 11 | **Session window for metals.** New fills only 07:00-17:00 UTC (London + NY overlap). Cancel pendings 20:45-23:15 UTC (rollover spread) | `InpSkipAsian = true`, `InpRolloverCut = true` | VL:1504-1506, VL:1582 (one session) | All |
| 12 | **News.** Tester news CSV holding past USD high-impact events (NFP, CPI, FOMC, PCE, GDP). Cancel M15 / H1 pendings 30 minutes before and after. Also test M15 only, because H1 orders are intraday on gold too | `InpTesterNews = true`, `InpNewsIntradayOnly` applies below H4 | VL:1542, ZS:3238, CO:52 | All |
| 13 | **Minimum zone height.** Skip when h < 0.5 x ATR14(ETF) (absolute, not only relative to the median) and when the spread is > 10% of the risk | `InpMinZoneATR = 0.5`, `InpMaxSpreadPct = 10` | ZS:397 ("bigger the better"), CL:113 | Z3, Best |
| 14 | **Arm distance.** Place the limit only within 1.0 x HTF ATR (the halfway alert stays). Count only *open* risk plus pendings within 0.5 HTF ATR toward `InpMaxOpenRiskPct` | `InpMaxDistATR = 1.0` | ZS:2354, Drill "halfway" | Z3 |
| 15 | **Trendline confluence.** Skip when a respected trendline lies between price and the zone (`KCross < 0`). +1 score when `KNear` (zone within 1 ETF ATR of a respected line in its direction) | `InpZ3NoTLCross = true` | Drill, ZS:2340 | Z3 |
| 16 | **Entry timeframe for gold.** Test H1 entries (D1 HTF) and H4 entries alone before M15 | toggles `InpTF_*` | VL:1464, VL:1474 (his big gold trade: H1 inside H4; he enters H4 / H1) | Z3, Best |
| 17 | **Keep = enter.** Cancel a Z3 pending when its zone stops meeting the entry gate (score < min, overextended, bias flipped) | `InpZ3Recheck = true` | The entry and keep criteria should be symmetric | Z3 |

### Break-even at 1R: the tradeoff, quantified

Take a trade with a 3R target, and define:

- p1 = P(the trade touches +1R).
- Given that it touched +1R: w = P(it reaches +3R before the original stop), and w_be = P(it reaches +3R before it comes back to the entry).

| | Expectancy per trade |
|---|---|
| No BE | E0 = p1 x (4w - 1) - (1 - p1) |
| BE at 1R | E1 = p1 x 3 x w_be - (1 - p1) |

**BE at 1R pays only if w_be > (4w - 1) / 3.** Example: with w = 0.55, BE needs w_be > 0.40. That means more than 73% of the eventual 3R winners must never come back to the entry. On gold M15 with small stops, a 1R pullback is about one ATR, so that is unlikely.

Illustration with p1 = 0.45:

| w | w_be | E0 (no BE) | E1 (BE at 1R) |
|---|---|---|---|
| 0.55 | 0.30 | -0.01R | -0.15R |
| 0.55 | 0.45 | -0.01R | +0.06R |
| 0.40 | 0.30 | -0.28R | -0.15R |

BE helps only when the setup has no edge after +1R anyway (the last row). **The fix:** log the MFE / MAE in R and the "touched entry after +1R" flag for every trade. The bot's `UpdateSims` variant replay does this, but it is switched off in the tester. Then read w and w_be straight from the data.

---

## 3. Evaluation protocol

| Item | Spec |
|---|---|
| Symbols | XAUUSD (primary). Control set: EURUSD, GBPUSD, USDJPY. An edge that exists only on gold after tuning is suspect. XAGUSD as an out-of-family check |
| Timeframes | Test each entry TF **alone** (M15 / H4 HTF, H1 / D1, H4 / W1), then combined |
| Data / model | Real tick data (MT5 "Every tick based on real ticks", or MT4 with Tick Data Suite), variable spread, broker commission, swap on. Check that `InpTesterGMT` matches the broker (and DST) |
| Periods | In-sample (IS) 2019-01 to 2023-12. Out-of-sample (OOS) 2024-01 to 2025-06. **Untouched holdout** 2025-07 to 2026-09 (gold's high-volatility regime), run once at the end |
| Walk-forward | Rolling 24 months IS / 6 months OOS, stepped 6 months (6 or more windows). Report every OOS window. Pick parameters from a **plateau**: neighbours within 25% of the best expectancy, never an isolated peak or a value on the edge of the range |
| Minimum trades | >= 100 trades per preset per symbol in IS before any decision. >= 30 per OOS window. >= 300 in total before going live. (A 1:3 system has an R standard deviation of about 1.8, so proving +0.2R at 2 sigma needs about 330 trades) |
| Funnel first | Before any optimisation, run with `InpLogSkips = true` and tabulate the skip reasons. If a gate removes > 80% of signals, test with it on and off. This is how to fix "0 trades" |
| Optimisation (max 4 params) | `InpZ3MinStopATR` 0.5-1.5 step 0.25. `InpZ3BE` {0 = off, 1.0, 1.5, 2.0}. `InpZ3RR` 2.0-4.0 step 0.5. `InpMinScore` 7-12 step 1. Everything else stays at the defaults above. Genetic optimiser, fitness = custom `OnTester` (needs adding): expectancy R x sqrt(N), 0 when N < 100 |
| Metrics | Primary: **expectancy in R** (with a 95% CI). Then: PF, win rate against the break-even win rate (25% at 1:3), max DD in R and in %, max consecutive losses, trades per month, **% of trades stopped within 15 minutes** (noise gauge, target < 10%), median MAE of winners in R (sets the stop), R by session / weekday / TF, and BE scratches counted separately from wins |
| Pass | OOS expectancy >= +0.15R, PF >= 1.3, max DD <= 15R, OOS / IS expectancy >= 0.5, >= 4 of 6 walk-forward windows positive, positive on at least 2 of the 4 symbols with the same parameters |
| **Stop criteria ("this preset doesn't work")** | (a) After >= 150 IS trades, the upper 95% CI of expectancy is < +0.05R. (b) OOS PF < 1.0 in 2 or more consecutive windows. (c) The best parameters sit on a range edge or need different values per symbol. (d) After the stop fix (#1), > 25% of trades still stop within 15 minutes. (e) Live / forward: after 50 trades, expectancy is below the IS value minus 2 standard errors → pause and re-evaluate. **Drop the preset; do not add filters until it passes**: each new filter is another degree of freedom |
| A/B order | 1) Z3 as it is now (baseline) → 2) + stop floor (#1, #2) → 3) + BE input (#10) → 4) + score (#5) → 5) + curve / room (#3, #6) → 6) + session / news (#11, #12). Change one thing per step and keep every report |

---

## 4. Red flags / bugs (list only, not fixed)

| # | Function | Issue |
|---|---|---|
| R1 | `Scan` (Z3 block ~1352) | The Z3 stop is set **after** the `minStop` / `InpMinStopATR` / `InpMinStopPips` floor, so none of those floors apply to Zones 3R. The only guard is `InpMinStopSpreads` x spread |
| R2 | `Scan` (`pip`, 1251), `TfStopPips`, `StopFor`, `VNotes` | On 2- or 3-digit gold, "pip" = $0.01, so the `InpMinStopPips`, `TfStopPips` and `InpStopBufferPts` (x `InpMetalOilStop`) buffers are cents. `VNotes` R:R is inflated → grade A comes easily → Kevin best then fails on "rr after the wider stop" (one likely cause of the 0-trade runs) |
| R3 | `EffBeTrig` | Z3 break-even is hard-coded to 1.0R. There is no input, so it cannot be tested or optimised |
| R4 | `Work` (`if(!IsTesting()) UpdateSims()`) | The variant replay (TP / BE variants) is off in the tester, so management variants cannot be compared in backtests. `CollectTrades` / the report keeps no per-trade MFE / MAE |
| R5 | (missing) `OnTester` | No custom optimisation criterion. The MT optimiser can only use balance / PF, not expectancy R or the trade count |
| R6 | `HtfZones` | HTF zones are cached per HTF bar, so removed / tested states can be up to a full HTF bar out of date (H4 for M15, **W1 for H4**). `KevinPendings`, the `hOpp` target cap and `BestKevinRules` `InZoneOf` use the stale states |
| R7 | `Curve` | The curve is the 100-bar HTF high / low range. The course defines it as the position between the HTF demand and supply zones (CL:333). The 100-bar range is a different measure |
| R8 | `VNotes` | The verdict depends on the **current** price and bias (the "far" minus, `KCross`, trend), so the same zone flips between STRONG and OK over time. It is not a stable zone attribute |
| R9 | `Scan` (Z3) | An order is placed while the zone is STRONG but is never cancelled when the zone becomes WEAK (overextended, or the bias flipped). Entry and keep criteria are asymmetric |
| R10 | `OpenRiskPct` / `BestBlocked` | Pending orders count fully toward the 3% open-risk cap, so far-away pendings block nearer, newer zones. Hedged buys + sells are summed, not netted |
| R11 | `ManageOrders` ("price moved > 3 x HTF ATR") | This cancel is neither "spent" nor "paused", so the placement is never given back. After two such cancels the zone is "placed twice already" for good |
| R12 | `LoadNews` / `InpTesterNews = false` | Backtests trade through every news release while live trading cancels around them, so backtest and live differ structurally |
| R13 | `NowUTC` / `ToUTC` (tester) | `InpTesterGMT` is a constant: there is no DST, so the Friday cut, Asian window, day boundaries and loss limits are off by one hour for half of each year |
| R14 | `ManageOpen` (`spread > InpMgmtMaxSpreadR * R` return) | With small gold R, a normal spread widening blocks **all** management, including BE and the ladder, until the spread falls |
| R15 | `ManageOpen` BE level | The BE stop = open ± (spread + commission). It locks about +1 spread, which is reported as a small win and inflates the win rate (consistent with an average win of about 1.2R at PF 0.37) |
| R16 | `DetectZones` (tested / removed) | Emotional wicks are ignored for "tested", so a zone that a large spike probed deeply (up to the distal) stays "fresh". Kevin: a test over 75% deep voids the zone (VL:1643) |
| R17 | `ManageOrders` → `FillsToday` per pending, per tick | Scans the full history for every pending on every tick: O(history x pendings), which slows long tick-data tests |
| R18 | `TfOn` | Protected presets silently force M15-H4 regardless of the M1 / M5 / D1 / W1 toggles. That is expected, but nothing in the report or log says so |
