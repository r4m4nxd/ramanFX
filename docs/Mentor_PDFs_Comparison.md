# Mentor PDFs vs. the RamanFX knowledge base

Two PDFs from the user's mentor Raja, compared with what the app and the bots already encode. Read-only review: no code changed.

| Key | File | What it really is |
|---|---|---|
| **SEI** | `dad85e07-Sam_Sieiden_Supply_and_demand.pdf` (54 p.) | FXStreet / IG Markets *Learning Center, Unit A, Chapter 4: "Trade the facts: consider price action"*. It is a general S&R / price-action chapter that **quotes** Sam Seiden (his 3 principles, gaps) next to Mark Douglas, James Chen, Derek Frey, V. Bednarik and Ed Ponsi. It is **not** Seiden's OTA odds-enhancer course |
| **BAK** | `077aea7b-kevin-baker-supply-and-demand-strategy.pdf` (39 p.) | Kevin Baker, *"We Don't Need No Stinkin' Indicators: Supply & Demand Based Trading"*. Written for US stocks / options (TradeStation daily + 5 min charts) |

Page numbers are the PDF page numbers (SEI "p.N/54", BAK "Page | N"). Note on naming: the app's "Kevin" (the video / Zoom mentor in `videoLessons.ts` and `zoomSessions.ts`) is not the same person as **Kevin Baker**, the author of BAK. Below, "Kevin" means the app's mentor and "Baker" means the PDF author.

Repo keys: **VL** `src/core/videoLessons.ts`, **ZS** `src/core/zoomSessions.ts`, **CL** `src/core/course.ts`, **CO** `src/core/coach.ts`, **ST** `src/core/strategy.ts`, **PB** `src/core/playbook.ts`, **AUD** `docs/ZoneBot_Kevin_Audit.md`, **REV** `docs/SD_Strategy_Review.md`, **ZB** `public/tools/RamanFX_ZoneBot.mq5`, **ZV** `public/tools/RamanFX_ZoneVision.mq5`.

> **Up front:** the Seiden / OTA odds-enhancer scorecard (strength of departure, time at the level, freshness, profit margin, big-picture trend, curve) is **not** in either PDF. The repo took it from elsewhere (REV, `ZScore` ZB:1657). The PDFs give partial equivalents: Baker's zone-strength tests (speed out, speed in, fresh, time in the zone) and SEI's "measuring S&R" list (contacts, timeframe, rebound shape, trendline angle).

---

## 1. Summaries

### SEI: FXStreet Learning Center, Ch. 4 (Seiden quoted)

- **Structure:** 4 sections: (1) S&D theory, (2) drawing S&R, (3) trends, pullbacks, breakouts, ranges and gaps, (4) measuring S&R and common mistakes. About 30 annotated charts (EUR/USD, USD/JPY, NZD/USD, USD/CAD, GBP/JPY …). Ends on a summary and link lists (p.53-54).
- **Thesis:** price moves when buyers and sellers are out of balance. Seiden's 3 principles (p.14-15): price is a function of S&D; all influences are already in the price; price moves when one of the two forces "becomes zero" at a price (300 buyers vs 200 sellers: price rises once the last seller is gone).
- **S&R are zones, not lines** (p.26-29). Draw them fat or as rectangles. Zone width grows with timeframe ("10 to 500 pips"). To trade *inside* a big zone, drop "3 or 4 stages" lower to find sub-zones. Round numbers (00/50/000) cluster orders and act as zones (p.28).
- **Top-down timeframes** (p.18-19, p.22-23): higher TFs show the main barriers and lower TFs the tradable intermediate levels. The primary trend comes from "the next bigger chart" (trade H1 → trend on H4 / D1; trade D1 → trend on W1).
- **Polarity, pullbacks and throwbacks** (p.13, p.30, p.34-37): broken resistance becomes support. The pullback to the broken level is the low-risk entry that institutions use, entering gradually. Chasing the breakout is the retail mistake. A chart shows "entry out of greed / exit out of panic / exit at break-even out of fear" next to the planned pullback entry (p.36).
- **Breakout timing** (p.33-34, Ponsi): breakouts around 5 pm ET usually fail (fade them). Breakouts after 3 am ET (London) succeed more often.
- **Gaps** (p.38-43): the "ultimate S&D imbalance". 4 setups by trend. In a downtrend, a gap up into supply is a high-odds short. In an uptrend, a gap down into demand is a buy. Ask "who is on the other side of my trade?"
- **Measuring S&R** (p.48-52): number of contact points, length of time / timeframe, the shape of the rebound (sharp "V"), and the trendline angle (steeper than about 45° breaks more easily, often just by going sideways). Mistakes (p.44-45): selling into demand or buying into supply. The edge must be statistical and tested (p.46).

### BAK: Kevin Baker, "We Don't Need No Stinkin' Indicators"

- **Structure:** 9 chapters: indicators (1), candlesticks (2), S&D zones (3, "most important"), trading the zones for long-term, swing and day trading (4), risk management (5), zones applied to stops and targets (6), the trading plan (7), options (8), outro (9).
- **Thesis:** indicators lag or give false signals and make you predictable to stop hunters. Plot excess supply and demand from past price instead. A stop beyond a zone "makes you more immune to stop hunters" (p.4).
- **Candles** (p.5-7): he uses only doji (balance), hammer and shooting star. Any multi-candle reversal (engulfing, morning / evening star) adds up to a hammer or shooting star (open of the first candle, close of the last, extreme high and low). "The faster the price moves in and out of a pivot point, the stronger the imbalance."
- **4 ways to plot zones** (p.10-13): (1) the pivot candle of an obvious trend change, with lines at the top and bottom of that candle; (2) a tight sideways range of several bars followed by a dramatic move (example: 6 bars); (3) a doji / indecision area "roughly halfway" through a strong trend; (4) gaps, treating the gap as one big candle. Oversized daily candle: rebuild the zone from that day's **hourly** candle. The distal (extreme) edge stays.
- **Zone strength** (p.13-15): fast out (and ideally fast in), **fresh** (never retested), and a short time in the zone (reversal: the shorter the better; range breakout: 3-6 candles is fine). More bounces make a level **weaker**, not stronger. Check freshness by looking left (he goes back at least 5 years) to make sure the candle that created the zone was not itself a retest of an older zone.
- **3 rules** (p.15): don't buy into supply, don't sell into demand, and put the stop a few pennies beyond the nearest zone. Skip the trade if that risk is too large.
- **Strategies** (p.17-25). Long-term: weekly zones for entries, exits and hedges. Swing with the trend: a bearish candle whose top wick is in a supply zone, enter after it closes. Swing against the trend: strong zones only, enter as close as possible to the far edge, no confirmation candle. Day trading: zones from the **daily** chart for entries, **5 min / H1** for exits, trail the stop at every retrace, take the "second chance" bounce, and trade pre-market gaps through a zone after a small pullback (stop beyond the day's low / high). At an all-time high or low: wait for a new strong zone and trade its first return.
- **Risk** (p.26-31): risk 0.5-2% per trade (he uses 1%). Min R:R 3:1 measured to the **first** of three exits (day 3:1, swing 5:1, p.34). Size = risk $ / (entry − stop + commission + slippage). Worked trade: ATR-based stops cut the position from 1875 to 185 shares and pushed the R:R below 2:1, so he rejects them. Two entries: in the zone (best R:R) or after price breaks back through the proximal (more conservative). No more than 2-3 positions at once (p.21). The trading-plan checklist is on p.33-34. Options for capping overnight / gap risk (p.35-38) do not apply to the FX bots.

---

## 2. Concept table

Repo status: **YES** = already encoded (file:line), **PARTIAL** = encoded differently or only in part, **NEW** = absent.

| # | Concept | PDF (page) | In repo? | Differences (short quotes) |
|---|---|---|---|---|
| 1 | Zone = base + explosive move away | BAK p.10-14; SEI p.29 | YES: CO:7, CL:35, ZV:738-745 (`Basing` = body < 50% of range, ZV:661) | Same idea. Baker: "areas where price has moved away quickly". No ratio in either PDF |
| 2 | Formations RBR / DBR / RBD / DBD | none (neither PDF uses these names) | YES: CL:44-46, VL:60 | Baker uses *pivot*, *tight range*, *mid-trend doji* and *gap* zones instead |
| 3 | Mid-trend indecision (doji) zone = continuation | BAK p.12 | YES (as CP): CO:28, CL:45; ZV `cont` | Baker: "roughly halfway through a strong downtrend". Kevin: doji basing "not my favourite" (CL:68) |
| 4 | Leg-in strength (fast INTO the zone) | BAK p.14, p.25 (AMZN fast vs BWLD slow) | **NEW**: only the leg-in *direction* (`cont`, ZB:1234) | Baker: "If price moved into the area quickly that is even better". The slow approach (BWLD) failed |
| 5 | Leg-out strength / departure | BAK p.14-15; SEI p.51 ("V" rebound) | YES: `legRatio` ZB:1232 (min 1.2), `erc`, `departure` ZB:1287, `ZScore` cMove ZB:1660 | PDFs: qualitative ("dramatically shoots away"). 1.2x is weaker than either PDF implies |
| 6 | Time at the level / number of base candles | BAK p.15 | YES: `InpMaxBase`=6 ZV:35; CO:8 (1-4); ST:144 (blocks > 6); `ZScore` cTime base ≤ 2 | Baker: reversal "the shorter, the better"; range breakout "three to six candles … acceptable". **Baker supports 6**; Kevin says 1-3, up to 5 (AUD #4) |
| 7 | Pivot-candle zone drawn on the whole candle | BAK p.10 | PARTIAL: proximal on the base **body** (ZV:752, VL:327) | Baker: "a horizontal line on the top and the bottom of the candle that forms the pivot". Kevin: "proximal on a basing candle body or wick" (VL:429) |
| 8 | Distal at the extreme | BAK p.11 ("always … at the extreme price point") | YES: ZV:752, VL:394 | Same |
| 9 | Oversized zone → refine on a lower TF | BAK p.11 (daily → hourly candle); SEI p.29 (3-4 TFs lower) | PARTIAL: VL:431 ("cut it in half"), VL:743 (zone within a zone); bots **reject** zones > 1.5 ATR (ZV:764) | Bots throw away what Baker would refine |
| 10 | Zones scale with timeframe; higher TF = stronger | SEI p.17, p.29, p.50; BAK p.22 | YES: CO:31, CL:130 | SEI: "10 to 500 pips" depending on TF |
| 11 | Freshness: first return only | BAK p.14-15, p.24-25; SEI p.49 | YES: CO:9, ST:152, ZV:780 (any touch of the proximal = tested), ZB `pen` | Matches |
| 12 | Origin freshness ("look left": the zone's own base must not be a retest of an older zone) | BAK p.14-15 (AKAM example; "at least five years") | **NEW** | Not modelled. ZB `z.ath` looks 2000 bars back, but only for the highs / lows |
| 13 | More touches = weaker | BAK p.13; SEI p.49 (mixed) | YES (implicitly, via freshness) | SEI first calls more contacts "more significant", then says each reaction consumes orders and the best sell is "the first time the price comes back". Baker: "The opposite is actually true" |
| 14 | Qualification (removed an opposing zone / trendline / all-time high) | none | YES: CO:10, CL:147-150, VL:2624, ZB `ChainOf` | Neither PDF requires it. Baker trades any strong fresh zone |
| 15 | Polarity / flip zone (broken supply → demand, first pullback) | BAK p.13, p.19 (MTH), p.20 (AKAM), p.23 (BBY); SEI p.8, p.13, p.30, p.35, p.45, p.47 | **NEW**: the repo treats a broken zone as void (AUD #11, #48) | Kevin trades the *new* zone that did the breaking; Baker / SEI trade the *old* zone flipped |
| 16 | Round numbers (00/50/000) as S&R zones | SEI p.28 | **NEW** | Liquidity traps exist (CO:33, `FindTrap`), but only from swings |
| 17 | Gaps as zones / gap setups | BAK p.13, p.23-24; SEI p.38-43 | PARTIAL: CL:62 ("gap move away"); ZS:117 ("a gap zone … no zone there") | Baker: "look at the chart as if the gap was one big candle". SEI: 4 trend-relative gap setups |
| 18 | Big-picture trend / HTF trend | SEI p.22-23, p.30-31; BAK p.18 | YES: PB:4-10, CO:44, ZB `KBias` | SEI: primary trend = "the following bigger chart" (H1 → H4 or D1). The repo maps H1 → D1, 15m → H4 |
| 19 | Trend definition | SEI p.21, p.30-31 (successive higher highs / lows; bias change when the sequence reverts) | YES, stricter: CO:20 ("a trend needs a trendline"), VL:663 | Kevin needs a confirmed trendline. SEI is happy with swing sequencing |
| 20 | Trendline angle (> 45° breaks easily, break ≠ reversal) | SEI p.51-52 | PARTIAL: VL:663 / ZS:570 (must be angled, not flat); ZS:548 (end overextended lines) | SEI adds: breaking a **steep** line often means sideways; breaking the second, shallower line confirms the trend |
| 21 | Curve / location; "don't buy into supply" | BAK p.15; SEI p.44-45 | YES (curve vs HTF zones): CL:332-335, ST:176, ZB:1336 (100-bar range), `ZoneCurve` ZB:1641; HTF room `InpZ3NeedRoom` ZB:187 | Baker's rule is about the **nearest** zone of either TF directly in the path. Z3 checks only the HTF room |
| 22 | Profit margin / R:R minimum | BAK p.27-28, p.31, p.34 | PARTIAL: `InpMinRR`=2 (ZB:80, ZV:40), Z3 fixed 3R, ST:236 (warn < 2), CO:46 | Baker: ≥ 3:1 to the **first** exit (day 3:1, swing 5:1), "with a probability … of at least 75%" |
| 23 | Multi-TF ratios | SEI p.29 (3-4 stages lower), p.22 (next bigger TF); BAK p.22, p.33 (W = long term, D = swing, D + 5m/H1 = day) | YES: PB:4-10 (ETF / ITF / HTF), ZONE_CONFIRM PB:14 | Baker day trading: **zone TF = D1, execution TF = 5m / H1**, close to the repo's confirmation map (1D → H1) |
| 24 | Entry: set & forget limit | BAK p.20 (counter-trend: "do not wait for a confirmation candle") | YES: CO:12, CL:72-73, Z3 ZB:1796 | Baker enters **"as close as possible to the bottom of a demand zone"** (deep). Repo / Kevin: just before the proximal (+5% front in Z3) |
| 25 | Entry: confirmation | BAK p.18-19 (with-trend: rejection candle, top wick in supply); p.31 (wait until price breaks back through the top of the zone); p.23 (second bounce) | PARTIAL: Kevin's confirmation = opposing zone / trendline removed on the ETF (CO:16, `ConfirmedBy`) | Kevin: "does not use candlestick patterns" (VL:1954). Baker's trigger is a candle |
| 26 | Entry: breakout | SEI p.20, p.32-37 (reactive; pullback preferred; timing 5 pm vs 3 am ET); BAK p.23-24 (gap through a zone, then pullback) | YES: CO:42, CL:241-244, Breakout preset (AUD #68) | SEI: breakouts "fizzle" near the NY close, succeed after the London open. Not modelled |
| 27 | Stop placement | BAK p.4, p.15, p.18, p.30 ("a few pennies" / 1 tick beyond the zone), p.31 (ATR stop rejected) | YES: CO:13, CL:79, ZB `StopFor` ZB:2570; Z3 10% + spread ZB:1796; REV #1 ATR floor `InpZ3MinStopATR`=0.75 (ZB:183) | Baker: tight structural stop; "If doing this creates too much risk, then do not take the trade". Kevin: wider stops on gold / oil (ZS:150-152) |
| 28 | Targets | BAK p.28, p.30-31 (3 exits: pivot wick, 1 tick before the next zone, 1 tick before the major zone; R:R from exit 1) | PARTIAL: CO:36 (4 TP methods), VL:750 (25% at 3:1, runner to the HTF zone), `PickTarget` ZB:2480 | Exits placed **1 tick in front of** the opposing zone are not explicit in the repo |
| 29 | Trade management | BAK p.22-23 (move the stop at every retrace / new pivot on 5 min), p.34 ("move your stop to a small profit after a certain percentage move"); SEI p.36 (BE out of fear = mistake), p.48 (Ponsi: trail manually under a trendline) | YES: CO:37, CL:89-94, `InpLiveBE` 2R / Z3 1R ZB:917, `InpTrailZones` ZB:136, `InpPartialAt3R` ZB:137 | Neither PDF uses a fixed-R break-even |
| 30 | Risk % / position size | BAK p.26, p.31 (size = risk $ / risk per unit incl. commission and slippage) | YES: CL:106 (1%), VL:929 (0.25-1% tiers), ZB `Lots` ZB:2588, `InpBestRiskPct` 0.5 | Baker 1% (0.5-2% range). Commission / slippage are in the BE level (ZB:2871) but not in the sizing |
| 31 | Max concurrent positions | BAK p.21 ("no more than two or three at the same time") | PARTIAL: `InpMaxPerSymbol` 3, `InpMaxOrders` 40, `InpMaxOpenRiskPct` 3%, hedging allowed (AUD #50) | Repo allows many more |
| 32 | Instrument selection by ATR % | BAK p.21, p.33 | **NEW** | Low value for a fixed FX / gold list |
| 33 | All-time high / low: no zone above | BAK p.24-25; SEI p.32-33 ("free rise") | PARTIAL: ATH is a chain qualifier (VL:2624, ZB:1290) | Baker: wait for a new strong zone to form, then trade its first return |
| 34 | News / sessions | SEI p.33-34 (session timing); BAK p.28 (stop orders always in) | YES: CO:52, VL:1505, VL:1514, `InpSkipAsian`, news window | Session-specific *breakout* timing is NEW |
| 35 | Psychology | SEI p.3, p.26-27 (Douglas), p.36-37 ("if … you find yourself hoping or wishing, you are … following the herd"), p.46 (edge); BAK p.4 (superstition), p.26-27 (emotional trading, cut losses) | YES: CO:24-25, CO:53-57 | Same message. "Hoping / wishing" and "who is on the other side" are good extra cards |
| 36 | Formulas | BAK p.27 (BE win rate: 50% wins → any R:R > 1:1), p.31 (size, R:R) | YES: ST:389 `breakevenWinRate`, CO:98 BE table | Same |
| 37 | Trading plan | BAK p.33-34 | YES (Planner, ST), but no instrument / trading-hours section | See §5 |
| 38 | Options hedge | BAK p.17-18, p.35-38 | n/a | Stocks only; not relevant to the FX bots |

---

## 3. NEW concepts, ranked by value for ZoneVision / ZoneBot

**Parity rule:** anything that changes *which zones are drawn* must go into ZV and ZB together. Everything else should be a ZB trade filter or `ZScore` term, so it can be A/B tested.

| Rank | Concept (source) | Proposal: rule, input = default | Where |
|---|---|---|---|
| 1 | **Room to the nearest ETF obstacle: "don't buy into supply"** (BAK p.15; SEI p.44-45) | Skip when a fresh, unremoved opposing **ETF** zone's proximal lies between the entry and the first target, *or* the R:R to that proximal is < `InpMinRR`. `InpRoomETF = true`. Extends `InpZ3NeedRoom` (HTF only) | ZB trade filter (Z3, Best) |
| 2 | **Origin freshness ("look left")** (BAK p.14-15) | For each zone, search `InpOriginBars = 1500` bars older than the base for a same-direction zone (or untested opposing zone) whose [distal, proximal] overlaps the new base by ≥ 30%. If one is found, flag `z.retest = true`: `ZScore` freshness 0 and never STRONG. `InpOriginCheck = true` | ZV + ZB (it changes the STRONG verdict) |
| 3 | **Leg-in speed** (BAK p.14, p.25) | `legIn` = range of the candle before the base (bar `L+1+k`) / largest base candle. ≥ `InpLegInRatio = 1.5` and in the opposite direction to the leg out (PV) or the same direction (CP) → `ZScore` +1 (new term "in"; the max becomes 16). Score only, never a drawing filter | ZB `ZScore`; ZV label |
| 4 | **Refine an oversized zone on a lower TF instead of rejecting it** (BAK p.11; SEI p.29) | When h > `InpMaxZoneATR` x ATR: load the TF/4 chart (H4 → H1, D1 → H4, H1 → M15). Within the base's time span, the lower-TF zone is distal = the same extreme, proximal = the body edge of the lower-TF base / pivot candle at that extreme. Keep it if the refined h ≤ the cap. `InpRefineBig = false` (A/B) | ZV + ZB `DetectZones` |
| 5 | **Flip (polarity) zones** (BAK p.13, p.19-20, p.23; SEI p.13, p.35, p.45) | When a zone is removed by a **close** beyond its distal with an explosive candle (`legRatio` ≥ 1.8), create a flipped zone with the same [proximal, distal] and the opposite direction. Fresh until its first return. Skip it if it overlaps the new chain zone by > 50% (same trade). `InpFlipZones = false`, separate preset or flag | ZB only (draw in ZV only if enabled) |
| 6 | **Confirmation-candle entry** (BAK p.18-19, p.31) | `InpEntryTrigger` = {0 off, 1 wick-reject: an ETF candle trades into the zone and closes back beyond the proximal in the trade direction → enter at market at the close, stop 1 spread + `InpZ3StopBuf` beyond the distal; 2 break-back: buy-stop 1 spread beyond the proximal after the zone was touched}. Default 0. Compare its expectancy per signal with the limit entry | ZB entry mode |
| 7 | **Obstacle-based targets, 3 exits** (BAK p.28, p.30-31) | `InpTPMode = TP_OBSTACLE`: T1 = 1 spread before the nearest obstacle (last pivot wick or opposing ETF proximal), T2 = the next opposing zone, T3 = the opposing HTF zone. Split 1/3 each. R:R gate on T1 ≥ `InpMinRR`. `InpTPFrontSpreads = 1` | ZB `PickTarget` / partials |
| 8 | **Breakout session timing** (SEI p.33-34) | Breakout preset: place / keep stop orders only 07:00-16:00 UTC; cancel 20:00-23:30 UTC (NY close, rollover). `InpBoStartUTC = 7`, `InpBoEndUTC = 16` | ZB Breakout |
| 9 | **Round numbers as traps / confluence** (SEI p.28) | A round level (FX 50 pips, JPY 50 pips, XAU $10, XAG $0.5) within `InpTrapATR` in front of the proximal counts as a liquidity trap (`FindTrap` +1). `InpRoundTrap = true`, `InpRoundStepPips = 50` | ZB `FindTrap` (score only) |
| 10 | **Steep trendline = momentum; its break does not flip the bias** (SEI p.51-52) | If the line's slope > `InpTLSteepATR = 0.5` x ATR per bar, its break does not set `KBias`; wait for the next shallower line. Default 0 (off) until tested | ZV + ZB (bias = drawing parity) |
| 11 | **Max concurrent positions** (BAK p.21) | `InpMaxOpenPos = 3` filled positions across all symbols (pendings excluded) | ZB capital protection |
| 12 | **Gap counted in the leg out** (BAK p.13; SEI p.38) | When \|open(L) − close(L+1)\| > 0.5 ATR, add the gap to the leg-out range for the ratio. `InpGapAsLeg = false`. Kevin rejects gap zones (ZS:117), so test it only | ZV + ZB |
| 13 | Second-chance re-entry (BAK p.23) | After a fill is stopped at break-even, allow one re-arm on the same zone if it is not removed. `InpReArmAfterBE = false` | ZB |
| 14 | ATR % instrument ranking (BAK p.21, p.33) | Report column only: D1 ATR / price | ZB report |

---

## 4. CONFLICTS: PDF advice vs. current bot rules

| # | Bot rule now | What the PDFs say | Recommendation |
|---|---|---|---|
| C1 | **Break-even at 1R** (Z3 `EffBeTrig` ZB:917; `InpBoBE` = 1; `InpImpBE` = 1) | Neither PDF has a fixed-R break-even. Baker trails the stop at each new pivot / retrace on the lower TF (p.22-23) or moves it "to a small profit after a certain percentage move" (p.34). SEI p.36 shows the "exit at break even, out of fear" during the post-break pullback as a novice error | Agrees with REV #10: make BE ≥ 2R or off for Z3, and test a trail behind LTF pivots (`InpTrailPivots`) as Baker does |
| C2 | **Entry 5% of h before the proximal** (`InpZ3Front` = 0.05, ZB:1796) | Baker counter-trend: enter "as close as possible to the bottom of a demand zone" (p.20). With the trend: after a rejection candle closes (p.18). Conservative: after price breaks back through the top of the zone (p.31). None front-runs the proximal | Test `InpZ3Front` ∈ {0.05, 0, −0.25, −0.5} (negative = inside the zone) and the `InpEntryTrigger` modes. Judge by expectancy per *signal*, not per fill |
| C3 | **Stop 10% of h beyond the distal + ATR floor 0.75 x ETF ATR** (`InpZ3StopBuf`, `InpZ3MinStopATR`, ZB:183; REV #1) | Baker: "a few pennies" / 1 tick beyond the zone. He tests the ATR stop and rejects it: the size drops 10x and the R:R falls below 2:1 (p.31). If the zone stop means too much risk, skip the trade (p.15). Caveat: his zones are wider (whole pivot candle, see C9) and on the daily chart | Conflict with the REV ATR floor. A/B test: (a) floor (REV), (b) Baker: structural buffer + **skip** when the stop is < `InpMinStopD1` or the R:R to T1 is < 3, instead of widening. Kevin backs wider stops on gold (ZS:150), so keep the floor for metals only if (b) loses |
| C4 | **Min R:R 2** (`InpMinRR` ZB:80 / ZV:40; grade B at ≥ 2; ST:236 warns only below 2); **Breakout 1.5** (`InpBoMinRR`) | Baker: ≥ 3:1 measured to the **first** target (p.27-28, p.31), day 3:1 and swing 5:1 (p.34) | Raise `InpMinRR` to 3 for Best / Custom and measure it to the nearest obstacle (concept #1), not to a fixed multiple. Breakout keeps 1.5 only if the data shows a higher win rate (Kevin's own trade-off, CL:244) |
| C5 | **Fixed 3R target** (Z3) | Baker's targets are structural (pivot wick, 1 tick before the next zone) and the R:R uses exit 1 (p.30-31). Don't buy into supply (p.15) | Add obstacle targets (`TP_OBSTACLE`, #7) or at least the ETF room check (#1) |
| C6 | **Max base 6** (`InpMaxBase` ZV:35) | Baker: range breakout "three to six candles … acceptable"; reversal "the shorter, the better" (p.15) | **No conflict with the PDFs** (6 matches Baker). The only conflict is with Kevin (1-3, up to 5). Keep it at 6 for drawing and let `ZScore` cTime reward ≤ 2 |
| C7 | **Leg ratio 1.2** (`InpMinLegRatio` ZV:34) | Both PDFs require price to leave "quickly", "dramatically" or in a "V". Baker's slow-in / slow-out example failed (p.25). No number given | Keep 1.2 for drawing (parity). Gate trades on cMove ≥ 1 (ratio ≥ 1.8) plus the new leg-in term (#3) |
| C8 | **Oversized zone rejected** (`InpMaxZoneATR` 1.5, ZV:764) | Baker refines it with the hourly candle; the distal stays at the extreme (p.11). SEI: drop 3-4 TFs to find sub-zones (p.29) | Concept #4 (`InpRefineBig`) |
| C9 | **Proximal on the base body** (ZV:752) | Baker's pivot zone spans the full candle, top to bottom (p.10) | Keep the body (Kevin, VL:429). Note: Baker's tick-wide stop assumes his wider box, so don't copy his stop without his box |
| C10 | **Broken zone = void** (AUD #11, #48) | Baker and SEI trade the broken zone **flipped** on its first pullback (BAK p.19-20, p.23; SEI p.35, p.45) | Concept #5 as an opt-in A/B (`InpFlipZones`) |
| C11 | **No candlestick triggers** (Kevin VL:1954) | Baker: the hammer / shooting star *is* the pivot zone (p.6-7), and a rejection candle triggers with-trend entries (p.18) | Concept #6, opt-in |
| C12 | **Many orders + hedging; up to 40 orders** (`InpMaxOrders`, `IsProt`, AUD #50) | Baker: "no more than two or three at the same time" (p.21) | `InpMaxOpenPos` = 3 (#11); keep REV #8 (no hedging) |
| C13 | **Counter-trend / sideways HTF = low odds or skip** (PB:20-25, ST:173-176, `Scan` "against HTF trend") | Baker trades counter-trend at **strong** zones with a deep entry and no confirmation (p.20), and calls fast moves into a zone "the best trades" (p.22) | Not worth changing for Z3 / Best. Possible separate A/B "counter-trend, strong only, deep entry, half risk" |
| C14 | **Gap zones rejected** (ZS:117) | Baker: plot the gap as one big candle; a gap's origin is strong S/R (p.13). SEI: gaps are the "ultimate" imbalance (p.39, p.43) | Opt-in `InpGapAsLeg` (#12). FX gaps are rare (weekend only) |
| C15 | **HTF = next-but-one TF** (H1 → D1, 15m → H4; PB:4-10) | SEI (Bednarik): the primary trend comes from "the following bigger chart" (H1 → H4 or D1) (p.22-23) | No change; within the PDF's range. Optional test: `InpRequireITF` (ZB:106) = the PDF's H1 → H4 check |
| C16 | **Risk 0.5%** (`InpBestRiskPct`) | Baker 1%, range 0.5-2% (p.26) | No conflict |

---

## 5. Checklists from the PDFs (paraphrased)

**Baker: zone-strength check** (p.13-15, p.25)
1. Price left the zone fast (better still: it also arrived fast).
2. Fresh: never retested. Look left to make sure the creating candle is not itself a retest of an older zone.
3. Short time in the zone: a reversal pivot should be brief; a range breakout can have 3-6 candles.
4. Against the trend, trade only strong zones.

**Baker: the 3 rules to keep even without his method** (p.15)
1. Don't buy into supply: with a supply zone directly above, wait for the break or skip.
2. Don't sell into demand (mirror).
3. Stop a few ticks beyond the nearest zone; if that risk is too big, no trade.

**Baker: trade setup steps** (p.30-31)
1. Stop = 1 tick beyond the zone.
2. Three exits: last pivot wick, 1 tick before the next zone, 1 tick before the major zone.
3. Risk per unit = entry − stop + commission + slippage.
4. Size = account risk $ / risk per unit.
5. R:R = (exit 1 − entry) / risk per unit; it must be ≥ 3.
6. Choose: enter in the zone (best R:R) or after the break back through the proximal (safer).

**Baker: trading plan** (p.33-34)
- Instruments, the symbol list (liquidity and ATR % filter) and the timeframes per style.
- The exact setup conditions.
- Risk per trade.
- Minimum R:R (day 3:1, swing 5:1).
- How the trade is monitored (stop at each new pivot / to a small profit after X%).
- Exit conditions (price, trailing stop or time of day).
- Trading hours.
- Post-trade review: "did I follow the plan?"

**Baker: risk rules** (p.26-28)
- Preserve capital and plan for the worst case.
- Define the risk as a % (0.5-2%; he uses 1%).
- Avoid emotional trading and cut losses fast.
- Think in reward-to-risk: a higher win rate allows a lower R:R.
- Always place the stop order together with the entry.

**SEI: judging an S&R level** (p.48-52)
1. Contact points: more contacts are watched more, but each reaction uses up orders, so the first return is the best trade.
2. Timeframe: higher means stronger.
3. Rebound shape: sharp "V" reversals count.
4. Trendline angle: steeper than about 45° breaks easily; a break may only be a move sideways.

**SEI: avoid** (p.36-37, p.44-45)
- Buying into supply or selling into demand.
- Chasing breakouts: wait for the pullback.
- Exiting in panic or at break-even out of fear.
- Hoping or wishing during a trade: that means following the herd, not a plan.

**SEI: gaps by trend** (p.39-42)
- Downtrend: gap up into supply → short. Gap down into demand → skip the buy; short from the next supply.
- Uptrend: gap up through supply → buy the pullback to it. Gap down into demand → buy.
