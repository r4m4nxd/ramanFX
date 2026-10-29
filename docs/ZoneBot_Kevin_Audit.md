# RamanFX ZoneBot v1.61 - audit against Kevin's teachings

Bot: `public/tools/RamanFX_ZoneBot.mq4` (v1.60 audited, fixes shipped as v1.61). Presets checked: **ZONES_3R** (`InpPreset=3`) and **KEVIN_BEST** (`InpPreset=1`).

Sources (line numbers are in those files):

- **VL** = `src/core/videoLessons.ts` (the 23 recorded lessons)
- **ZS** = `src/core/zoomSessions.ts` (Sunday Zoom sessions, incl. their `botRules`)
- **CO** = `src/core/coach.ts` (rule cards), **PB** = `src/core/playbook.ts` (timeframe combos / alignment matrix)
- **Drill** = the user's drill topics (weekly trendline rule, ATR distance / halfway, emotional candles, arrival zones, real peaks / valleys, channel 50%), as also written into `src/pages/BotGuide.tsx`

Bot line numbers refer to v1.61.

Verdicts describe **v1.60** (before this audit). A **Fix applied** entry says what v1.61 changed. **User override (Z3)** means the user's explicit Zones 3R instructions replace Kevin's rule on purpose, so it stays: trade every STRONG zone ZoneVision draws, entry 5% of zone height before the proximal, stop 10% beyond the distal + spread, fixed 1:3, break-even at 1:1, multiple orders + hedging, 0.5% risk, 3% max open risk, 5 trades a day, pause after 2 losses in a row, 2% daily / 4% weekly loss limits.

## 1. Zone identification

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 1 | A zone needs all four parts: basing, a move away, a stay-away candle, and space between the stay-away candle and the proximal | VL:2711, VL:3155, ZS:3187 | `DetectZones`:796 requires basing (body < 50% of range), a move-away candle, and a stay-away candle `L-1` that does not touch the proximal. The space is `z.gap`; less than `InpMinGap` gives a WEAK verdict (`VNotes`:1105) or a skip (`Scan`:1364) | MATCH | - |
| 2 | The first candle after the basing must be explosive. Reject a zone whose basing is about as big as the move away | ZS:435, ZS:896, ZS:1404, ZS:5631 | `DetectZones`: the leg candle is `L`, right after the base, and needs a range of at least `InpMinLegRatio` (1.2) x the largest base candle | MATCH | - |
| 3 | Reject 50% candles and wicky move-away candles | ZS:891, ZS:3197, ZS:4088 | `Basing()`:564 counts a candle with body / range < 0.5 as basing, so it can never be the move-away candle | MATCH | - |
| 4 | Basing of 1 to 3 candles (up to 5) | ZS:2320, ZS:5627, CO:21 | `InpMaxBase` = 6 (same value as ZoneVision). `VNotes` adds a plus for 3 or fewer | DIFFERS (6 allowed instead of 5) | Not changed: the value must stay equal to ZoneVision's, because the bot trades exactly ZoneVision's zones |
| 5 | Distal on the extreme wick of the basing; include every wick; never cut candles | VL:394, ZS:460, ZS:2290 | `DetectZones`: distal = lowest low (highest high) of the base and leg candles | MATCH | - |
| 6 | Proximal on the edge of the basing bodies | VL:430, ZS:4094 | `DetectZones`: proximal = highest body of the base (demand) / lowest body (supply) | MATCH | - |
| 7 | Zones of similar size on a timeframe; about half the usual size is too small | VL:396, ZS:455, ZS:1866 | Height cap `InpMaxZoneATR` = 1.5 x ATR (`DetectZones`). `VTooSmall`:1054 drops zones under 0.5 x the median zone height | MATCH | - |
| 8 | Chain: a zone only counts if it removed an opposing zone, removed a trendline, or made an **all-time** high / low. A swing high / low that is not all-time does not count | ZS:430, ZS:1369-1370, ZS:2345, ZS:5046-5047 | `ChainOf`:1002 (ZoneVision `Qualify`) also accepts a new high / low of the 200-bar lookback (`newHL`) or taking out the previous swing (`rmHL`) | DIFFERS | **KEVIN_BEST:** `BestKevinRules`:1524 requires a removed opposing zone, a removed trendline, or `z.ath` (all-time within the loaded history). **Z3:** user override (every zone ZoneVision draws). ZoneVision's own chain is unchanged |
| 9 | The space under the stay-away candle grades the zone. A small space means drawable but not tradable | ZS:1871, ZS:2334, ZS:5616 | `z.gap` against `InpMinGap` (0.15): WEAK / "drawable only". Zones 3R's STRONG filter excludes these | MATCH | - |
| 10 | Don't trade a tested zone, or one touched before it qualified | ZS:445, ZS:1409, VL:1754 | `VSelect`:1065 skips every tested zone (any return to the proximal) | MATCH (stricter) | - |
| 11 | A body through the zone removes it. A big emotional wick does not | VL:2980-2982, ZS:3228, ZS:3662 | `DetectZones`:840: a close beyond the distal, or a wick beyond it that is not emotional (`Emotional`:795 = range > `InpEmoATR` x ATR) | MATCH (ATR stands in for the wick / body judgement) | - |
| 12 | Old zones are lower odds | ZS:490, ZS:3692, ZS:5661 | `InpMaxZoneAge` = 200 bars (`VSelect`). `PlanScore` gives +4 to zones up to 100 bars old | MATCH | - |
| 13 | Prefer a second explosive candle | ZS:440 | `z.leg2` counts as a plus in `VNotes` | MATCH | - |
| 14 | Be careful of zones on obvious S/R. Prefer the zone beyond where retail stops sit (liquidity) | VL:2293, VL:2295 | `FindTrap`:592 adds a plus for a trap, a minus for a crowded zone | MATCH | - |
| 15 | Arrival zone (broke the trendline AND took out the high / low or a zone) is the strongest | Drill, BotGuide | `VQualify`:1043 / `Arrival`. Always STRONG. Kevin best also accepts grade B on an arrival zone | MATCH | - |
| 16 | Only one zone is credited per removal: the one with the largest move away, closest to the trigger | ZS:1419, ZS:5641 | `ChainOf` credits every zone whose move away removed something | MISSING | Not fixed: changing it would change which zones ZoneVision draws (the parity rule). Needs a matching ZoneVision change |
| 17 | The third zone inside tight ranging price is low odds | ZS:6106 | Not modelled | MISSING | Not fixed: "tight range" is discretionary. Partly covered by rule 34 (3 CPs) and the "HTF trend unclear" skip |

## 2. Timeframe alignment (HTF / ITF / ETF)

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 18 | Use the correct HTF for the ETF (1m->15m, 5m->H1, 15m->H4, H1->D, H4->W) | VL:529, ZS:1429, ZS:5101, PB:4-10 | `TF_H`:143 | MATCH | - |
| 19 | ITF of each combo (5m->15m->H1 ...) | PB:4-10, VL:1276 | `TF_I`:144 | MATCH | - |
| 20 | Inside a HTF demand only buys, inside a HTF supply only sells | VL:530, VL:561, VL:1579 | v1.60 only scored it (`PlanScore` `nearOpp`) | DIFFERS | **KEVIN_BEST:** `BestKevinRules` skips a zone whose proximal is inside a live opposing HTF zone (`InZoneOf`:1492). **Z3:** user override (every STRONG zone, hedging allowed) |
| 21 | Entry inside a HTF zone: hold toward the opposing HTF zone, not a quick 1:1 | VL:531, VL:562, VL:741-757 | v1.60 targeted the nearest swing / opposing ETF zone (`PickTarget`:1716), capped by the HTF zone | MISSING | **KEVIN_BEST:** `Scan`:1302: a zone inside a same-direction HTF zone targets the opposing HTF zone (`hOpp`). **Z3:** user override (fixed 1:3) |
| 22 | Top-down: HTF trend first. HTF sideways = low odds. Trade with the HTF trend | VL:1541, VL:2910-2913, ZS:4662 | `Scan`:1347 skips "HTF trend unclear" / "against HTF trend" (swings, replaced by the newest HTF trendline break, `KBias`:750) | MATCH | **Z3:** user override (`InpZ3Bias=false`) |
| 23 | HTF and ETF trend must point the same way. Once the nearest ETF zone is removed, the next zone is valid only inside an ITF zone (with the ITF trend line holding) | VL:1039-1041, VL:1070-1072, VL:1755 | v1.60 had only `InpRequireITF` (off by default, swing-based) | MISSING | **KEVIN_BEST:** `BestKevinRules`: when the ETF trendline in the trade direction is broken (`KUse(gKE)` < 0) or a nearer same-direction chain zone was removed after this zone formed, the zone must sit inside a same-direction ITF zone with the ITF trendline holding (`TfSupport`:1503, ITF lines `gKI` built in `Scan`), or the same at the HTF. **Z3:** user override |
| 24 | Full risk only with three-timeframe confluence. Without a HTF / MSA zone, risk 0.25-0.5% | VL:929, VL:957 | Both presets risk 0.5% per trade (`BestRiskPct`:2712), halved in a 6% drawdown | MATCH (inside Kevin's reduced band; user capital rule) | - |

## 3. Trend and trendlines

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 25 | A trendline exists only after an obvious peak + valley + a higher high (lower low). No new extreme = no trendline | VL:662, VL:1886, ZS:911, ZS:4617 | `Zz`:631 (real valley = a higher high follows before it breaks) + `KConf`:667 | MATCH | - |
| 26 | Never cut candles: move the anchor to the next point | VL:1888, ZS:470, ZS:4622 | `KFit`:645 (0.05 ATR tolerance) | MATCH | - |
| 27 | A near-flat line is momentum: fall back to the original start, else no line | VL:663, ZS:475, ZS:921 | `KFlat`:660 + the fallbacks in `KLines`:688 | MATCH | - |
| 28 | Removed only by the FIRST candle whose body and wick are fully beyond the line | VL:2716, VL:2719, ZS:1374 | `KAdd`:680 | MATCH | - |
| 29 | Weekly trendline rule: use the most recent line. A weekly-sized line stays on the weekly (unless it is the only one) | ZS:2365, ZS:2948, ZS:2980, ZS:3217 | `KUse`:741: the newest line first, the overall (window) line only as a fallback | MATCH | - |
| 30 | End a trendline when price overextends far away from it, or leaves it for a long time | VL:2828, VL:2831, ZS:926, ZS:3672 | Lines are never ended; overextension only blocks entries (`ChannelState`:780) | DIFFERS | Not fixed: the bias / trendline-cross logic must stay identical to the lines ZoneVision draws. Needs a matching ZoneVision change |
| 31 | Channel: from the line to 50% = golden area, beyond 50% = overextended | ZS:4657, ZS:4593 | `ChannelState` / `VOverext`:1098. Kevin best skips (`Scan`:1363). In Zones 3R, an overextended zone is WEAK, so the STRONG filter drops it | MATCH | - |
| 32 | Bias from the trendline break (broken downtrend line = bullish) | Drill, BotGuide `InpTLBias` | `KBias`:750 | MATCH | - |
| 33 | A zone that price can reach only by crossing a respected trendline is lower odds | Drill, ZS:2340 | `KCross`:758. Kevin best skips "tl cross" (`Scan`:1354) | MATCH | **Z3:** user override (still traded) |
| 34 | After three CPs in a row, stop (or cut risk and manage aggressively). Do not chase | VL:1042, VL:1073, VL:1807 | Not modelled in v1.60 | MISSING | **KEVIN_BEST:** `CpRun`:1510 + `BestKevinRules` skip the 3rd+ continuation chain zone in a row ("best: 3rd CP in a row"). **Z3:** user override |

## 4. Entry, stop, target, R:R

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 35 | Enter just before the proximal, with the spread added | VL:792, VL:818, ZS:2379, ZS:6116 | Buy at proximal + spread (fills on the Ask), sell at the proximal (`Scan`:1282-1289) | MATCH | **Z3:** 5% of the zone height before the proximal (user, also "a little before") |
| 36 | Stop just beyond the distal, a few pips / spread, set visually | VL:791, VL:819, ZS:495, ZS:5676 | `StopFor`:1743: a timeframe pip buffer beyond the distal, + spread on sells (the Ask side) | MATCH | **Z3:** max(spread, 10% of the zone height) beyond the distal, + spread on sells (user) |
| 37 | Wider stops on gold / oil and in volatile conditions | ZS:500, ZS:2385 | `InpMetalOilStop`. Kevin best: stop >= 0.5 x ETF ATR (0.35 x HTF ATR on metals / oil) | MATCH | - |
| 38 | Entry zone at the proximal of a HTF zone: stop about 50% into the HTF zone (not below the whole HTF zone) | ZS:505 | Not modelled | MISSING | **KEVIN_BEST:** `Scan`:1315: when the ETF distal is within 25% of a same-direction HTF zone's proximal, the stop goes 50% into that HTF zone (+ spread on sells). R:R is re-checked and lots follow. **Z3:** user override |
| 39 | Always a hard stop. Never widen the stop | VL:2713, CO:13 | `ManageOrders`:1979 closes a stopless trade. `ManageOpen`:1997 only moves stops in favour. `BestModify`:2678 never widens | MATCH | - |
| 40 | TP options: recent high / pivot, fixed R:R, opposing (HTF) zone. Take profit sooner when an opposing zone is close | VL:741-757, VL:821, CO:31 | `PickTarget` (nearest of swing / opposing ETF zone) capped before the opposing HTF zone (`Scan`:1300) | MATCH | **Z3:** fixed 1:3 (user; one of Kevin's listed methods) |
| 41 | R:R by opportunity: about 3:1 when the structure offers it | ZS:1444, VL:959 | `InpMinRR` = 2. Kevin best needs ZoneVision grade A, which requires 1:3 | MATCH | - |

## 5. Trade management

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 42 | His plan: move the stop to break-even after about 2:1 | VL:2480, VL:2521 | `EffBeTrig`:504: Kevin best = 2R, then `ManageOpen` moves the stop to entry + spread + commission | MATCH | **Z3:** BE at 1R (user; also CO:16 for lower-odds trades) |
| 43 | Four ways to manage the stop (don't touch / BE at a set R:R / half risk / trail under new zones), and his 25% off at 3:1. Pick one by testing | VL:750-757, CO:32 | Kevin best: BE only. Custom: half risk, zone trail and partial are options (`ManageOpen`). Every variant is replayed in `UpdateSims` | MATCH | - |
| 44 | Break-even must actually work when the bot's state file is missing | (bug) | `ManageOpen` returned early when `stRpts` was missing, so BE never happened | DIFFERS (bug) | `ManageOpen`:2004: falls back to the stop distance while the stop is still on the loss side |

## 6. Limit order placement and removal

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 45 | No time-based or candle-count removal | VL:1277 | Both presets: no expiry (`InpPendingBars` applies to Custom only, `ManageOrders`:1964) | MATCH | - |
| 46 | Remove if price hits the opposing HTF zone before pulling back to the entry | VL:1274, VL:1313 | `KevinPendings`:1546 rule 1 | MATCH | - |
| 47 | Remove when the move already happened (target reached without us) | VL:1192 sections ("the move already happened") | `ManageOrders` "ran" (`InpCancelRunFrac`) + `Scan` "price already ran" | MATCH | - |
| 48 | A broken zone is void: remove the order | VL:791, VL:2292 | `ManageOrders`:1943 (close beyond the distal) | MATCH | - |
| 49 | After the nearest ETF zone fails (or the trend line breaks), lower orders stay only if they sit inside an **ITF** zone with the **ITF** trend line still holding (HTF even better) | VL:1276, VL:1315, VL:1317 | v1.60: only the ETF trendline break triggered it, and it checked the HTF zone + HTF line, not the ITF | DIFFERS | `KevinPendings`: the trigger is now an ETF trendline break OR a nearer same-direction chain zone removed after the order was placed. The order stays if it sits inside a same-direction ITF zone with the ITF trendline holding (`TfSupport` + `gKI`), or the same at the HTF |
| 50 | Set & forget: keep only the order at the nearest zone; move it when a newer nearer zone forms | VL:1275, VL:1314 | Both presets keep one order per zone, so several zones give several orders | DIFFERS | Kept: the user's "multiple orders + hedging" instruction (v1.60; shared by both presets via `IsProt()`). Flagged for the user if Kevin best should go back to nearest-only |
| 51 | Intraday: do not leave limit orders through scheduled high-impact news. Daily swing orders need no filter | ZS:3238, VL:1542 | v1.60 kept both presets' pendings through news (news only blocked new orders) | DIFFERS | `ManageOrders`: intraday pendings (below H4 with `InpNewsIntradayOnly`) are cancelled in the news window (`NewsNow`:1667) for every preset and re-armed after it. The cancel does not use up a zone placement (`UnplaceZone`:2660) |
| 52 | Confirmation forms within about one HTF zone height of the HTF zone | VL:1316, VL:1192 sections | `ConfirmedBy`:1596 had no distance check | MISSING | `ConfirmedBy` now requires it |
| 53 | Confirmation = an opposing zone AND/OR an opposing trendline removed on the ETF after the HTF zone was contacted | VL:2074-2075, VL:2119 | `ConfirmedBy` counted only removed zones | DIFFERS | `ConfirmedBy` also accepts an opposing ETF trendline removed after the touch |
| 54 | Confirmation only while the HTF zone is intact | ZS:1424 | `HtfZones`:1630 stores only live (not removed) HTF zones | MATCH | - |

## 7. When NOT to trade

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 55 | Don't day-trade the news; wait for the release and for spreads to settle | VL:1542, VL:1580-1581, ZS:3712 | `BlockedNow`:1651 / `NewsNow` window (30 / 30 min, intraday only), `InpMaxSpreadPct` gate, `InpMgmtMaxSpreadR` for stop moves | MATCH | Refactored into `NewsNow` so an Asian / Friday answer can no longer hide a news window from the pending check |
| 56 | Chosen session; day-trading limits | VL:1582, ZS:4672 | `InpSkipAsian` (optional); a symbol list per chart | MATCH (configurable) | - |
| 57 | No time-based limit removal (Friday) | VL:1277 | The Friday cut-off cancels pendings at 19 UTC (weekend-gap safety, not a Kevin rule) | DIFFERS | Kept as a safety rule (set `InpFridayCutUTC=24` to disable the Friday part). v1.61 makes it not overwrite "zone removed" / "ran", and the cancel no longer uses up a zone placement |
| 58 | Overextended (beyond the channel 50%) | ZS:4657 | See rule 31 | MATCH | - |
| 59 | Too far: ATR distance / halfway (wait, alert at halfway) | Drill, BotGuide `InpMaxDistATR` / `InpHalfwayAlert` | `Scan`:1374/1383 (2 x HTF ATR; Kevin best arms within 1 x HTF ATR, `Scan`:1415), `SetWatch`:290 / `CheckWatches`:319 halfway alert | MATCH | - |
| 60 | Crossing a respected trendline to reach the zone | Drill | See rule 33 | MATCH | - |
| 61 | Sideways HTF / big messy range: no setups | VL:2910, VL:2912 | `Scan`:1347 "HTF trend unclear" | MATCH | **Z3:** user override |
| 62 | Summer / August and major all-pairs news days are low odds | ZS:1906, ZS:2389 | Not modelled (except through the news file) | MISSING | Not fixed: discretionary low-odds flag, and the user's capital rules already set the risk |
| 63 | Don't force trades; being flat is valid | VL:1404, VL:2718 | The bot only trades zones that pass every gate | MATCH | - |

## 8. Risk per trade and capital protection

| # | Kevin rule | Source | Bot behaviour (function : line) | Verdict | Fix applied |
|---|---|---|---|---|---|
| 64 | Risk 1% per trade, always | VL:2712 | Custom 1% (`InpRiskPct`). Both presets 0.5% (`BestRiskPct`) | DIFFERS | User override (capital protection 0.5%) |
| 65 | Riskier setups get half risk | VL:2481, VL:1803 | Grade C half risk (Custom, `Place`:1787). Half risk in a drawdown (`ProtectUpdate`:2766) | MATCH | **Z3:** user override (full risk on every grade) |
| 66 | Consecutive losses: pause only if tilted ("two losses = -2% should not matter") | ZS:4682 | 2-loss pause, 3% max open risk, 5 fills a day, 2% daily / 4% weekly limits (`BestBlocked`:2792, `ProtectUpdate`) | DIFFERS | User override (capital protection rules) |
| 67 | A pause must stop new fills (bug: the streak pause left pendings that could still fill) | (bug) | `ManageOrders` cancelled pendings on the daily / weekly stop but not on the loss-streak pause | DIFFERS (bug) | `ManageOrders`: the loss-streak pause now cancels pendings for the rest of the UTC day (re-armed next day, no placement used up) |

## 9. Plain bugs found in the bot's logic

| # | Bug | Where | Fix applied |
|---|---|---|---|
| B1 | `BestModify` could move an order of ANOTHER timeframe's overlapping zone (an H1 limit) to this timeframe's levels (M15 entry / stop / target) | `Scan` -> `BestModify`:2678 | `BestModify` takes `k` and leaves orders of another entry timeframe alone |
| B2 | Without saved state, a Zones 3R order (entry 5% in front of the proximal) was not recognised as the zone's order by `ZoneOrder`, so a duplicate order could be placed | `ZoneOrder`:2616 | The tolerance includes the Zones 3R front |
| B3 | `FillsToday` counted a partial-close remainder ("from #") as a second fill (the original ticket is already in history) | `FillsToday`:2731 | The open-order loop skips "from #" too |
| B4 | The Friday cut-off and the 4% daily-loss branch overwrote "zone removed" / "ran", so a spent zone could be treated as merely paused | `ManageOrders`:1962-1963 | They apply only when no other reason was found |
| B5 | Pauses (news, Friday, daily / weekly / streak, trades-per-day) used up one of the zone's two placements, so a good zone could never be re-armed after two pauses | `ManageOrders` / `UnplaceZone`:2660 | Pause cancels give the placement back; "zone removed", "ran" and Kevin's context cancels still spend the zone |
| B6 | Break-even / management silently off when the state file is missing (R = 0) | `ManageOpen`:2004 | Falls back to the stop distance (rule 44) |
| B7 | The 4% daily loss limit reset on the broker's day of year, while every other day rule uses the UTC day (in the tester: test time - `InpTesterGMT`) | `DailyLossHit`:1620 | Uses `DayOf()` (UTC day) |
| B8 | The loss-streak pause did not cancel pendings (rule 67) | `ManageOrders` | Fixed |

Checked with no bug found:

- Sell-side signs: stop + spread on sells, TP +/- spread, `dir * (...)` comparisons.
- The break-even stop only ever moves in the trade's favour (`ManageOpen`: `dir * (newSl - sl) > point`).
- Lot sizing and the risk re-check (`Lots`:1767, `Place`:1782).
- R in the scan, at placement and in management (all use the same entry-to-stop distance).
- Open risk, buys and sells summed (`OpenRiskPct`, even order types = buy).
- Tester UTC (`NowUTC`, `ToUTC`, `DayOf` use `InpTesterGMT`).
- The scan gate order in `Scan` (the one-order-per-zone check sits after the price / protection gates, and "already traded" still updates the pending).

## 10. v1.62: Breakout and Impulse presets (A/B tests against Zones 3R)

Added in v1.62. Line numbers refer to v1.62. **CL** = `src/core/course.ts`.

| # | Rule | Source | Bot behaviour (function : line) | Verdict | Notes |
|---|---|---|---|---|---|
| 68 | Breakout method: price contacts the HTF zone; on the ETF an opposing zone must be removed; if a zone in your direction (a proper basing structure) forms below it, place a buy stop just beyond the opposing zone's distal, stop safely beyond your zone; no basing structure = no trade. Breakout = higher win rate, smaller R:R (~1.5R vs ~10R for the pullback to the same target) | VL:1944-1952, VL:2076, VL:2106, VL:2125, VL:2144, CL:241-246, CO:42 | `PRESET_BREAKOUT` (4): `ScanBreakout`:1481. HTF zone contact within `InpConfTouchBars` (`InpBoNeedHTF`), basing zone = a zone ZoneVision draws, formed after the contact and within one HTF zone height of it; OP_BUYSTOP / OP_SELLSTOP `InpBoBuffer` x opposing zone height beyond its distal; stop `InpBoStopBuf` x basing height + spread beyond the basing distal; target = nearer of the next opposing ETF zone beyond the broken one and the opposing HTF zone, else `InpBoRRCap` x risk; skip below `InpBoMinRR`. Cancelled (`ManageOrders`:2204, `KevinPendings`:1790) when the basing zone is removed, the target is reached unfilled, the ETF trendline / nearer zone is lost without ITF / HTF support, news / Friday / loss limits; no time rule. One order per basing zone (`ZoneOrder`:2945 keys on it), capital protection, hedge, BE at `InpBoBE` R | MATCH | CO:42 words it as "stop order just beyond the new zone after the opposing zone is removed"; the bot follows CL:241-246 / VL:1945 (order beyond the opposing zone, fills on the break). Kevin gives no fixed target or BE rule for it: target and BE are the user's choice |
| 69 | Impulse market entry: impulse candle (body >= 1.5 x ATR, close in the outer 25%) that breaks structure (previous swing high / low, or an opposing zone removed) -> market order, big stop beyond the candle / base extreme, BE at 1R, half closed at every 2R with the stop locked 1R behind, optional fixed 3R target | The user's own method | `PRESET_IMPULSE` (5): `ScanImpulse`:1594, `ImpTaken`:1586 (one trade per impulse candle), ladder in `ManageOpen`:2331, remainder state `StCarry`:2133, partial parts merged into one trade in `CollectTrades`:3502 | n/a (not Kevin's) | Kevin advises against market orders (strategy.ts flags them) and enters with limits at zones; this preset exists only to A/B test the user's idea |

## Counts (v1.60, rules 1-67)

| Verdict | Count |
|---|---|
| MATCH | 46 |
| DIFFERS | 13 |
| MISSING | 8 |

The bugs (B1-B8) are listed separately; B6 and B8 are also rows 44 and 67.

- **Fixed in v1.61:** 8, 20, 21, 23, 34, 38, 44, 49, 51, 52, 53, 67 (+ B1-B7; part of 57).
- **Not fixed: kept for ZoneVision parity:** 4, 16, 30. Changing these needs the same change in ZoneVision.
- **Not fixed: discretionary:** 17, 62.
- **Not fixed: user override / user decision:** 50, 64, 66; 57 (safety).

No inputs were added or removed in v1.61. v1.62 adds 16 inputs (Breakout + Impulse groups), so all four .set files (`KevinBest`, `Zones3R`, `Breakout`, `Impulse`; 113 inputs each) were regenerated.
