# Indicator Comparison: "Advanced Supply Demand" guide + II_SupDem v2.32 vs RamanFX ZoneVision / ZoneBot

What the two outside sources do, how they compare with ZoneVision (MT4 / MT5 / Pine) and ZoneBot, and what is worth taking from them. Mentor rule references point to `docs/Combined_Rulebook.md` (Kevin = app video mentor, Seiden = Sam Seiden, Baker = Kevin Baker).

**Main finding:** the PDF and the MQ4 are **two unrelated products**. The PDF is the user manual for Bernhard Schweigert's paid, closed-source "Advanced Supply Demand" indicator. The MQ4 is "II_SupDem" by Bredin (Insanity Industries, 2014), a free zigzag-based indicator. Neither one is the source code of the other. The PDF never discloses its algorithm. Only its inputs and behaviour can be compared.

**Sources read**
- PDF: `3f15cc4b-...pdf`, 7.3 MB. It is a single FireShot web-page capture: **1 PDF page** of 595 x 14,041 pt, built from **23 image strips** (no text layer). All strips were read. Page refs below use **p.1/sN**, meaning strip N of 23, top to bottom. Strips 20-23 are blank or the mql5.com footer.
- MQ4: `e019aabf-II_SupDem_v2.32.mq4`, 835 lines, read in full.
- Ours: `public/tools/RamanFX_ZoneVision.mq4` (read in full), plus `.mq5` and `.pine` (searched for inputs, `Detect`, alerts and departure). `RamanFX_ZoneBot.mq5` v1.62 was searched only.

---

## 1. The PDF: what it is

| Item | Content | Ref |
|---|---|---|
| Product | "Advanced Supply Demand" indicator for MT4 / MT5, sold on the MQL5 Market (USD 128, discounted to 95). "SELECTED Supply/Demand Support/Resistance. Multiple Time-frames and Alerts" | p.1/s1, s19 |
| Author | Bernhard Schweigert (CurrencyStrength28.com). Blog post "Advanced Supply Demand Indicator USER MANUAL", 15 Aug 2018, mql5.com/en/blogs/post/720245. The manual was updated through v4.9; there are about 20 author comments below it | s1, s8, s16 |
| Purpose | A user manual and sales page. It explains the S/D idea, every input, the alerts and the MTF / nested features, gives a few trade examples, and ends with reviews | whole |
| Algorithm | **Not disclosed** ("proprietary features and a new formula"). EA integration code is only available by email to renters | s9, s18 |

### Key concepts and settings (with defaults)

| Concept | What the guide says | Input(s) = default | Ref |
|---|---|---|---|
| Supply / demand definition | Supply = an area of sell orders, demand = an area of buy orders. Orders sit in a zone, not at one price | - | s1-s2 |
| Use for entry, stop and target | Enter at a strong zone, place the stop beyond it, target the next opposing zone. Know the HTF picture | - | s2 |
| **Zone strength filter "XY"** | "The greater the imbalance, the greater the move." A zone is printed only if price travelled away far enough. Lower values give more zones; higher values give fewer, stronger ones. This is their headline feature ("first indicator where you can modify a filter for zone strength") | `min X-factor of price travel away (ATR)` = 2.0; `min Y-factor of price travel away (zone size)` = 2.0 (one screenshot shows 1.4 / 2.0) | s2, s9, s17 |
| Minimum candles until return | A zone needs time to validate. Price must stay away N candles before the zone is printed | `min candles before a zone is printed` = 7 | s2, s9 |
| Maximum zone size | A very big zone is **sliced** to a max height to cut the stop distance | `limited size of a big zone. Max factor (ATR)` = 4.0 (MTF 3.0 or 4.0) | s2, s5, s16 |
| First hit | The first touch has the best odds. Each touch absorbs orders, so the zone weakens and then breaks. Fresh and used zones get different colours | `color supply / supply used / demand / demand used` | s2-s3 |
| Old (broken) zones | Shown faded. Uses: history study, false breakouts, flip levels ("broken support becomes resistance"). Also used to tune XY per symbol | `show old zones` = true, `show Bars back for old zones` = 1000 (scan 5000) | s3, s6, s11 |
| Alerts (3) | 1) zone entered, 2) zone broken (needs a candle **close** beyond it), 3) reversal candle from a zone (a candle closes back outside the zone; an arrow is drawn on live bars only). Popup, email, push | `alert zone hit`, `room in points for HIT-alert` (v2.80), `alert zone break`, `alert reverse candle from zone`, popup / email / push | s4, s10, s12-s13 |
| Fake-breakout (FBO) alert | v2.70. A bar of minimum size pokes through and closes back in | `FBO min bar Size Point` = 50, `FBO bar close back %` = 50 (20-90), `FBO pattern bar count` = 2 (1-3) | s4 |
| Alert filters | Only new / untouched zones (breaks excluded). Only NESTED zones. Buy-only / sell-only preference (v4.9) | `alert only new zones` = false, `alert only NESTED zones` = false, `Traders preference alerts buy-sell-both` | s4-s6, s15-s16 |
| Multi-timeframe | Chart-TF zones are drawn as filled rectangles. HTF zones are drawn as outlines (optionally filled). The HTF zones get their own XY filter (v2.10) | `ADD higher TF` = true, `higher TF period` = 1 Hour / current (automatic), `min HTF-candles before a zone is printed` = 7, X / Y MTF = 2.0, max ATR MTF = 3.0-4.0, `rectangle style full MTF`, `rectangle width` | s4-s5, s10, s16 |
| **Nested zone** | An LTF zone inside an HTF zone has higher odds (an H1 zone inside an H4 zone). Example: a D1 demand nested in W1 demand bounced strongly on the first touch | `alert only NESTED zones! (within MTF)`; alerts say "nested H1" either way | s5, s13-s15 |
| Don't trade into HTF zones | Don't short into HTF demand. Look for longs. Short only once a candle **closes** below the demand | - | s6 |
| Broken-zone counter | "broken DEM = n / broken SUP = n": zones of one side broken in a row, used as a trend clue | (always on) | s9, s12, s14 |
| Zone size label | Zone height in points, at the right edge of each box (HTF shifted left) | `show zone size (point)`, `show zone size MTF (point)` | s6, s12 |
| Engulfing at the zone start | Optional (2020): require a reversal-colour candle on bar 1 and/or bar 2 of the zone, optionally a true engulfing | `use reversal candle color bar 1`, `... bar 2 (both or either)`, `use true engulfing pattern` (default false) | s7, s9-s10 |
| Include wick in zone width | Optional (v3.5): widen the zone with wick 1. Wider zones may then fail the XY filter | `Include wick 1 for the zone size` = false | s10 |
| Daily levels | Yesterday's high, yesterday's low, today's open and the daily pivot are drawn. Check whether they line up with zones | - | s15, s17 |
| Spread on stop and target | Add the spread to a short's stop, subtract it from a short's target, and leave room for stop hunts | - | s15 |
| Trade example | "Sell at nested supply, SL 15 pip, TP next demand, SL trail" | - | s17 |

**Interpretation (an assumption, since the formula is hidden):** "X-factor (ATR)" and "Y-factor (zone size)" most likely mean that the move away from the zone must reach at least X x ATR **and** Y x zone height before the zone counts. That is the same idea as Seiden's qualifying rule (run-out of at least 3 x zone height, p.276) and the rulebook's `InpMinRunOutR`.

---

## 2. II_SupDem v2.32: how it works

**Header / licence:** `#property copyright "Copyright © 2014, Bredin"`, link insanityindustries.net (forum thread t=10). The description says "Displays Supply and Demand zones more-or-less in accordance with Sam Seiden's teachings". The version is 2.33 ("ZigZag bug fixes, by Big Be 09/2014"), and the zigzag routine is marked "based on code (C) metaquote[s]". **No licence grant** is given, so it is all-rights-reserved by default. None of its code goes into our files. Only the ideas are described here.

### Detection algorithm, step by step

1. **Run once per new bar** of the chosen `TimeFrame`. It deletes every zone object and recomputes everything over **all** bars of that timeframe (no lookback limit).
2. **Swing detection = the classic MetaQuotes ZigZag** with depth 3, deviation 2 "pips" and backstep 2. Deviation is in points x10 on 3- and 5-digit symbols. Arrays for 4 zigzag settings exist ({3,8,13,34}, ...), but only the first is used. Swing highs become supply candidates; swing lows become demand candidates. It is not a fractal and not an ATR swing.
3. **Clean-up pass 1 (newest to oldest, "remove higher lows and lower highs"):** a supply swing is kept only if its high is at or above every newer kept swing high. Demand works the same way with lows. The result is a "staircase": every surviving supply sits above all later swing highs. This implicitly **deletes broken zones**: any newer swing that went beyond the distal kills the older zone. The test is wick-based and has no close requirement.
4. **Clean-up pass 2 (oldest to newest, "remove re-entries"):** a newer supply swing whose high reaches into the previous kept supply zone (above its proximal) is dropped. Demand is mirrored. This is a **merge / overlap rule**: the older, original zone wins, and lower highs inside it are not drawn as new zones.
5. **Zone edges.** Distal = the swing bar's wick extreme. Proximal (supply) = the **highest** of: the swing bar's body bottom, the lows of the bars before and after it, and the body bottoms of the bars before and after it. Demand is mirrored. So a zone is "pivot wick to the nearest body or neighbour edge". This is a 3-bar pivot. It does not look for a multi-candle base and does not measure the leg-out.
6. **Departure check:** after the pivot, at least one bar must trade fully beyond the proximal (supply: high < proximal). A zone price never left is not drawn.
7. **Retouch (tested):** after leaving, any bar that comes back to the proximal marks the zone "retouched" and recolours it. Retouch is a yes / no flag. Touches are not counted and penetration depth is not measured.
8. **Strength ("strong" / "weak"), look-left:** it walks **back in time** from the pivot. If 2 bars sit fully on the proximal side (supply: highs below the proximal) before 2 bars trade beyond the distal, the zone is STRONG: price arrived from the other side, a reversal / origin zone. Otherwise it is WEAK: older price already traded beyond it, so it is a retest or a lower high inside a range. `NoWeakZones` hides weak zones. **Quirk:** with the default `RecolorRetouch = true`, strength is only evaluated for **retouched** zones, so every fresh zone shows as strong.
9. **Drawing:** a rectangle from the pivot bar to the current bar, filled or outlined, colour-coded strong / weak / retouched, with an optional right-price arrow on the proximal.
10. **Fibs / HUD (mostly dead):** an optional Fibonacci between the nearest supply and demand. The HUD (TF label, direction arrow, nearest prices), bar timer and logo routines are commented out, so those inputs do nothing.

### Multi-TF, merging, broken zones, tested counts

| Feature | Behaviour |
|---|---|
| Multi-TF | One HTF per instance (`TimeFrame`). It draws HTF zones on the chart with `iHigh / iTime` of that TF. Run several instances for several TFs. There is no nested logic and no LTF guard |
| Merge / overlap | Pass 2 keeps the older zone and drops newer same-side swings inside it |
| Broken zones | Never drawn. Removed by the staircase rule as soon as a newer swing wick exceeds the distal. Not kept as "old zones" |
| Tested count | Binary retouched flag only |
| Alerts | One kind: "Supply / Demand Zone Entered" (popup + sound) when the current close crosses the proximal of zone #N. The counter then moves on to zone #N+1. It resets to zone #1 on every new bar |
| Buffers (6, `DRAW_NONE`) | 0 = supply distal, 1 = supply proximal, 2 = supply drawn flag, 3 = demand distal, 4 = demand proximal, 5 = demand drawn flag. Indexed by **HTF** bar shift |
| Global variables (`GlobalVars`) | Per zone: `S.PH / S.PL / S.T` and `D.PL / D.PH / D.T`, plus `GOSHORT` / `GOLONG` = the nearest non-retouched proximal |

### Inputs with defaults

`TimeFrame = PERIOD_CURRENT`, `DrawZones = true`, `SolidZones = true`, `SolidRetouch = false`, `RecolorRetouch = true`, `RecolorWeakRetouch = false`, `ZoneStrength = true`, `NoWeakZones = true`, `DrawEdgePrice = true`, `ZoneWidth = 2` (border width, not zone height), `ZoneFibs = false`, `FibStyle = 0`, `HUDOn = true`, `TimerOn = true`, `LayerZone = 0`, `LayerHUD = 20`, `CornerHUD = 3`, `PosX = 7`, `PosY = 10`, `AlertOn = true`, `AlertPopup = true`, `AlertSound = "alert.wav"`.

Colours: strong / weak / retouch for supply (DarkGreen / SlateBlue / SteelBlue) and demand (DarkRed / LightCoral / SaddleBrown), plus Fib, HUD, arrows, timer and shadow.

Visibility: `LimitZoneVis = false`, `SameTFVis = true`, `ShowOnM1..MN` (only M5 = true).

Other: `PriceWidth = 1`, `TimeOffset = 0`, `GlobalVars = false`.

Hard-coded: zigzag (3, 2, 2).

---

## 3. Comparison table

| Feature | PDF guide (Adv. S/D) | II_SupDem v2.32 | Our ZoneVision (MT4 / MT5 / Pine) | Better approach and why (Kevin / Seiden) |
|---|---|---|---|---|
| Zone origin | Hidden formula | ZigZag(3,2,2) 3-bar pivot | Base of 1-6 basing candles (body < 50%) + a non-basing leg-out ≥ `InpMinLegRatio` x the largest base candle | **Ours.** Rule 1 (base + explosive move) and rule 2 (few base candles) are modelled directly. A zigzag pivot ignores both |
| Leg-out strength | X / Y "travel away" filter | None (only "price left") | Leg ratio 1.2 (MT) / 1.5 (Pine), `leg2`, grade A/B/C | Ours for the first candle. **Theirs (XY) for the full run-out** (Seiden p.276); see 4.1 |
| Run-out / departure gate | X x ATR and Y x zone height (2.0 / 2.0) | - | Pine `minDep` 1.5 x height **gates**; MT4 / MT5 have **none** (the bot uses `InpMinDeparture` only in Custom / Aggressive) | Add to MT as an option, and fix the Pine / MT parity gap |
| Stay-away / time away | Min 7 candles before printing | ≥ 1 bar beyond the proximal | 1 stay-away candle + gap ≥ 0.15 h (Kevin's 4 parts) | **Ours** (Kevin VL:2711). 7 candles hides young zones and conflicts with Kevin |
| Proximal / distal | Body; optional "include wick 1" | Pivot wick to the nearest neighbour or body edge (often very thin) | Base body edge / extreme wick of base + leg | **Ours** (rule 3). An optional wick proximal is in the rulebook ("body (or wick)", minor) |
| Max zone height | Slice at 4 ATR (stop gets tighter) | None | Reject above 1.5 ATR | Neither slicing nor rejecting is ideal. Kevin / Seiden / Baker say **refine on a lower TF** (rulebook "Oversized zone"). Slicing puts the stop inside the real zone, which breaks rule 10 |
| Min zone size | - | - | < 0.5 x the median zone = too small | Ours (Kevin "similar size") |
| Fresh / tested | Fresh vs used colours, "first hit" | Binary retouch | Binary tested (MT); `pen` depth < 50% (Pine) | Equal on concept. Ours handles emotional wicks. Graded depth is C2 (open A/B) |
| Strength classes | Strong / weak via XY | Strong / weak via look-left (came from the other side vs older price beyond) | STRONG / OK / WEAK verdict from 10+ checks + grade + plan R:R | **Ours** overall. Their look-left test matches the rulebook's "origin freshness" NEW item (Baker p.14), cheaply |
| Removal / broken | Close beyond = break (alert); old zones kept | Any newer swing wick beyond = deleted | Close beyond the distal, or a normal wick; emotional wick ignored. Removed zones optional (faded) | **Ours** (Kevin emotional wick + close rule; the PDF agrees on close) |
| Overlap / merge | Not described | Older zone wins; newer inside it dropped | None: overlapping zones can take 2 of the 4 drawn slots | **Theirs is the useful idea**, as a display option (4.4). Kevin C8 "stacked = 50/50" means don't score it, just tidy it |
| Multi-TF | Filled chart TF + outlined HTF, own XY | One TF per instance | HTF band (2 closest), HTF trendlines up to 4 levels, HTF bias, Kevin's TF map | Ours for structure. Theirs shows more HTF zones (not only the 2 closest) |
| **Nested (LTF inside HTF)** | Yes: flag + alert filter | No | ZV: **no flag**. Bot: `AtHtfZone` (prox within ± 1 HTF height) in score / stop | **Theirs** for visibility. Kevin "stop 50% into HTF zone" + Seiden "HTF trumps LTF". Add a ZV label (4.2) |
| Trend context | Broken-in-a-row counter | HUD arrow (dead code) | HTF fractal swings + Kevin trendlines + TL-break bias + channel 50% | **Ours** (Kevin trendline rule C11). The counter is fine as display only |
| Liquidity / obvious levels | Yesterday H / L, today open, pivot | - | Unswept swing levels within 1 ATR (trap) + "crowded" | Ours. PDH / PDL as an extra obvious-level source is a small win (Seiden Globex-high trap) |
| Alerts | Hit (+ room in points), break, reversal candle, FBO; filters: new-only, nested-only, side; popup / email / push | Zone entered (sound / popup), buggy | MT4: halfway alert only. MT5: fresh STRONG touch + TL break + push. Pine: fresh with-trend touch, halfway, potential trade | **Theirs is richer.** Port touch / break / push to MT4; add filters (4.3). Skip candle-pattern alerts (Kevin C15) |
| Zone size label | Points at the box edge | - | Prices only | Theirs (usability) |
| Spread in SL / TP | Yes | - | Yes (entry + spread, SL + spread) | Equal |
| Trade plan | Manual | - | Entry / SL / TP / R:R, YES / NO + reason | Ours |
| EA export | Sample code on request | 6 buffers + global variables | None (the bot re-implements the logic: parity rule) | Theirs is handy for parity tests; optional |
| Performance | Unknown | Full recompute of all bars every bar | Bounded lookback (200 / 300) | Ours |

---

## 4. Concrete improvements for ZoneVision and ZoneBot

Rules for this list:
- Defaults keep today's picture unchanged wherever a change would alter **which zones are drawn**. The user calls the current ZoneVision "perfect", so those changes ship **off** and are tested A/B.
- Anything that changes drawing goes into ZV (MT4, MT5, Pine) **and** ZoneBot together (parity rule).
- Effort: S < half a day, M about a day, L multi-day.

| # | Improvement (rule / algorithm) | Input(s) = default | Where | Effort | Risk to "perfect" | Mentor fit |
|---|---|---|---|---|---|---|
| 4.1 | **Run-out (XY) filter + label.** After the stay-away candle, measure the farthest price reached before the first return, in zone heights (Y) and ATR (X). Always show it on the label ("run-out 3.2h / 2.1 ATR"). Gate only when the inputs are > 0. The bot already computes `departure`. Also **align Pine**: Pine gates at `minDep` 1.5 while MT does not, which is a parity bug | `InpMinRunOutH` = 0 (A/B 2.0 PDF, 3.0 Seiden); `InpMinRunOutATR` = 0 (A/B 2.0) | ZV MT4 / MT5 / Pine + ZB | S | None while 0; when on it removes zones (A/B) | Seiden p.276 (≥ 3 x height), rulebook #5. Kevin "move away" agrees |
| 4.2 | **Nested tag.** For each drawn LTF zone, if its proximal..distal lies inside a fresh same-side HTF zone (± tolerance), label "nested in H4 demand" and add a "+ nested" note. Use the **same tolerance as the bot's `AtHtfZone`** (± 1 HTF zone height), or tighten both | `InpShowNested` = true; `InpNestTolH` = 1.0 (bot + ZV share it) | ZV all 3; ZB tolerance input | S | None (label only) | Kevin "HTF in control", stop 50% into the HTF zone (ZS:505); Seiden "HTF trumps LTF"; PDF s5, s15 |
| 4.3 | **Alerts on MT4 + filters.** Port MT5's `InpAlertStrong` / `InpPush` to MT4. Add a break alert: a drawn fresh zone is removed by a **close**. Add filters: fresh-only (default), nested-only, with-trend-only, side. Add "room before the proximal": alert at the bot's limit price (`InpZ3Front` x h) instead of at the proximal. Fix the **Pine alert**: it fires on every re-entry while `pen < 0.5` but says "fresh"; fire on the first touch only, or say "2nd touch" | `InpAlertStrong` = true, `InpAlertBreak` = false, `InpAlertNestedOnly` = false, `InpAlertWithTrend` = true, `InpAlertSide` = both, `InpAlertFrontH` = 0.05, `InpPush` = false | ZV MT4 (new), MT5 (filters), Pine (fix) | S | None (alerts only) | Kevin "price comes to you" + fresh only; PDF s4, s12 |
| 4.4 | **Overlap merge (display).** If two same-side drawn zones overlap by more than X% of the smaller height, show one. Mode 1 keeps the older / outer one, the origin (II_SupDem's rule); mode 2 keeps the one nearer price. The other becomes a thin line inside, so the 4 slots show 4 distinct areas | `InpMergeOverlap` = 0 (off), `InpMergeMinPct` = 50 | ZV all 3; ZB only if used as a filter | M | Medium when on (changes the visible set); off by default | Kevin C8: stacked = 50/50, take the extreme only, so mode 1 matches "extreme". Don't score it |
| 4.5 | **Zone size label** in points / pips and in ATR at the right edge (the PDF's most-requested usability item). Helps judge stop size before arming | `InpShowSize` = false | ZV all 3 | S | None | Kevin "similar size", Seiden "wide zone = smaller size" |
| 4.6 | **Origin / look-left check (cheap version from II_SupDem).** Walk back from the base. If price traded beyond the distal (≥ 2 bars) before it sat fully on the proximal side (≥ 2 bars), tag "retest of older price, not an origin". Apply to VP zones only (CP zones always have older price beyond by definition) | `InpOriginCheck` = false (label first; A/B as a gate); `InpOriginBars` = 2 | ZV + ZB | M | Low as a label; medium as a gate | Baker p.14, Seiden "old fresh levels", rulebook #12. **Conflict:** Kevin's CP zones, so exclude CP |
| 4.7 | **Big-zone refine instead of reject.** Above `InpMaxZoneATR`, look for a valid base on the next lower TF inside the zone and use that as the zone. **Do not** copy the PDF's slice at 4 ATR: it moves the stop inside the real zone | `InpRefineBig` = false | ZV + ZB | L | Medium (new zones appear) | Kevin "cut in half / zone in zone" (VL:431), Seiden "X-ray" p.325, Baker p.11 |
| 4.8 | **Broken-in-a-row counter** in the panel ("demand removed 3 in a row"). Display only; never the bias | `InpShowBreakCount` = false | ZV all 3 | S | None | Display only: Kevin's bias stays trendline-based (C11) |
| 4.9 | **Daily obvious levels for the trap / crowded check.** Add yesterday's high / low (and optionally today's open) to the swing levels `FindTrap` scans | `InpTrapDaily` = false | ZV + ZB (`FindTrap` is in both) | M | Low (score / label only) | Seiden Globex-high bull / bear trap p.131, p.381; Kevin liquidity trap (lesson 16) |
| 4.10 | **Data buffers for parity tests.** MT4 / MT5 ZV exposes the nearest N zones (prox, dist, dir, state, nested) as `DRAW_NONE` buffers indexed by **chart** bar. A tester script can then diff ZV against ZB zone lists | `InpExportBuffers` = false | ZV MT4 / MT5 | M | None | Parity rule (rulebook glossary) |
| 4.11 | **Wick proximal option** (PDF v3.5 "include wick") | `InpProxMode` = 0 body (current), 1 base wick | ZV + ZB | S | Changes zones when on | Kevin "body (or wick)"; rulebook "Proximal line" CONFLICT (minor) |
| 4.12 | **"Young zone" tag**: zone printed less than N bars ago. Label only, not the PDF's 7-candle gate | `InpYoungBars` = 0 (off) | ZV | S | None | A gate would conflict with Kevin's 1 stay-away candle |

**Not recommended (conflicts with the mentors):**
- Reversal-candle, engulfing and FBO alerts as entry triggers. Kevin uses no candle patterns (C15). They could only be an off-by-default alert, never part of the zone definition.
- Flip zones from old broken zones. Kevin treats broken zones as void (C13); keep `InpFlipZones` parked as in the rulebook.
- The PDF's 7-candle printing delay.
- Wick-based deletion (II_SupDem). It goes against Kevin's emotional-wick rule.

**Observation (not a change):** MT4 / MT5 `Panel()` and the bot's plan path skip VP zones (`!cont`) and plan **CP only**, while `ZoneNotes` marks VP as "Kevin's favourite". That looks intentional (Kevin calls CP "most powerful", C6), but the two labels can confuse users. Consider wording the VP note as "reversal zone (VP)" only.

---

## 5. II_SupDem weaknesses and bugs we should NOT copy

1. **Dead overlap cull:** the "final sema cull" looks up `TAG+"UPZONE"` / `"DNZONE"` **without** the `lzone` prefix the objects are created with. The lookup always returns 0, so the cull never runs.
2. **GOSHORT bug:** the supply branch checks `c != ColorDemRetouch` (demand colour) instead of the supply retouch colour, so `GOSHORT` can point at a retouched supply.
3. **Global variables not per symbol:** the TAG is `"II_SupDem"+tf` with no symbol. `GOLONG / GOSHORT / S.* / D.*` are terminal-wide, so two charts on different symbols with the same TF overwrite each other.
4. **Buffers indexed by HTF shift** when `TimeFrame` differs from the chart, so `iCustom` readers get misaligned values. A `TimeFrame` lower than the chart is not guarded.
5. **Alert logic:**
   - The demand alert ignores `AlertPopup`.
   - The alert index resets to zone #1 every new bar, so the same zone re-alerts each bar while price stays beyond the proximal.
   - It never checks that price is still inside the zone (below the distal).
   - Zones are ordered by time, not by distance.
6. **Strength only for retouched zones** under the default `RecolorRetouch = true`, so every fresh zone is "strong" by default.
7. **Repaint / live-edge zones:** the zigzag's last leg moves and bar 0 is processed while it is still forming, so zones appear and disappear intrabar.
8. **No base or leg-out logic:** a 3-bar pivot plus neighbour bodies often gives a **very thin zone** that price slices through. Departure strength is not measured at all.
9. **Wick-only invalidation:** any newer swing wick beyond the distal deletes the zone. There is no close rule and no emotional-candle exception.
10. **Point-scaled deviation** (pips x10 on 3- and 5-digit symbols). It is wrong on gold, indices and crypto, where 2-digit pricing is common; ours uses ATR.
11. **Unbounded loops:** a full recompute of all history every bar, strength loops up to 1,000,000 that rely on `iHigh` returning 0 past history, and `i+1` read without a bounds check.
12. **Dead inputs and code:**
    - HUD, timer and logo bodies are commented out, so `HUDOn`, `TimerOn`, the fonts and `CornerHUD` do nothing visible.
    - Three of the four zigzag settings are unused.
    - `ZoneWidth` is the border width, not the zone height (misleading name).
13. **Licence:** copyright Bredin 2014 with no licence grant. Describe ideas only; never paste code.

**From the PDF product, do not copy:**
- Slicing big zones (the stop ends up inside the real zone).
- Marketing claims or reviews as evidence. There are no statistics in the guide.
- The black-box XY formula. Ours would be explicit and labelled.

---

## Summary

**Top 5 improvements**
1. Run-out filter + label (4.1). This is Seiden's ≥ 3 x height rule (the PDF's XY idea), and it fixes the Pine-vs-MT departure parity gap. Off by default in MT.
2. Nested-in-HTF tag on ZoneVision (4.2), sharing the bot's `AtHtfZone` tolerance.
3. MT4 alerts (touch / break / push) with fresh, nested, trend and side filters, alerting at the limit price. Also fix the Pine "fresh" alert that fires on re-entries (4.3).
4. Overlap merge for display (4.4), so the 4 drawn slots show 4 distinct areas. Off by default.
5. Zone size label (4.5) and the look-left origin tag (4.6, VP only).

**Clearly better than ours:**
- Nested-zone flag and alert filters.
- The richer alert set with push / email in MT4.
- Overlap de-duplication (the idea; II_SupDem's code for it is partly broken).
- Configurable run-out strength filter.
- Zone size in points.
- Data export for EAs.

Everything else is weaker than ZoneVision. In particular, ZoneVision is more accurate against Kevin and Seiden in its detection: base, leg-out, stay-away, close-based removal, emotional wicks, chain and trendlines.
