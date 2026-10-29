# ZoneVision v2: design spec

This is the design for the next version of `public/tools/RamanFX_ZoneVision.mq5` (v1.99). It is built in MT5 first, then ported to MT4 (`.mq4`) and TradingView (`.pine`). ZoneBot reads the same core.

**Thesis.** In supply and demand, what worked historically mostly works again, as long as the higher-timeframe direction is known. So v2 has four jobs:

- **(a)** find the zones every mentor would draw;
- **(b)** know the HTF direction, working top-down;
- **(c)** score each zone through each mentor's lens and through a consensus;
- **(d)** measure itself on history (research mode), so that every score is calibrated by data.

**Sources used** (keys as in `docs/Combined_Rulebook.md`):

| Key | Source |
|---|---|
| VL / ZS | `src/core/videoLessons.ts` (Kevin's course) and `src/core/zoomSessions.ts` (Kevin's Sunday sessions) |
| KM-nn | `src/core/mentors/kevin/media/lessonNN.ts`: corrections taken from his real video frames |
| RJ-A / RJ-B | `src/core/mentors/raja/partA.ts` and `partB.ts` |
| BK | `src/core/mentors/baker/index.ts` |
| S5 / Sp | `docs/Seiden_5Years_Notes.md` and `docs/seiden_parts/*.md` |
| IC | `docs/Indicator_Comparison.md` |
| REV | `docs/SD_Strategy_Review.md` |
| AUD | `docs/ZoneBot_Kevin_Audit.md` |
| RH | `docs/Zone_Research_HowTo.md` and `tools/zone_research/analyze.py` |

---

## 1. Principles, and what must not change

### 1.1 Invariants

The user calls v1's zones and trendlines "perfect", so v1's drawing is frozen.

| # | Invariant | How it is enforced |
|---|---|---|
| I1 | With every v2 input at its default, the chart draws **exactly v1's objects**: same names (`RFXV_*`, `RFXN_*`, `RFXS_*`, `RFXP2_*`), same times, prices, colours, styles, texts and tooltips | Golden-master test (M0, §8). Its object dump must be byte-identical on 6 fixed symbol/TF/date snapshots |
| I2 | These functions keep their logic: `Detect`, `Trendlines` (ZigZag, FitAnchor, Confirmed, TooFlat, RefineOnChart, DedupeTL), `Qualify`, `ZoneNotes` (verdict, grade, shortWhy, plan), `FindTrap`, `TooSmall`, `TLBias`, `CrossNeeded`, `NearTrendline`, `Overextended`, `HtfTrend`, `StepUp`, `HtfOf` and `DrawZones` | They move unchanged into a shared include (M1). New logic only **reads** their outputs |
| I3 | `gTrend` (the bias that drives "with / against the HTF trend" in `ZoneNotes`) is computed as in v1 | The new Direction engine is display-only unless `InpBiasSource = 1` |
| I4 | Every new feature is either a **toggle** (default off when it changes what is drawn) or an **extra label / extra object** with its own prefix `RFXV2_` (default on only when it adds information without moving or hiding a v1 object) | Prefix rule. M0 compares v1 prefixes only |
| I5 | Zone-rule inputs (`InpMinLegRatio`, `InpMaxBase`, `InpMaxZoneATR`, `InpEmoATR`, `InpLookback`, `InpMaxZoneAge`, `InpMinGap`, `InpMinSizeVsMedian`, `InpTLSwing`, `InpTLHistory`, `InpTLBias`) keep their v1 defaults. ZoneBot must keep equal values (the parity rule) | One include, plus a config checksum shared with the bot (§7) |
| I6 | Detection stays closed-candle and has no look-ahead. Research rows record only what was knowable at that candle | As in v1 research (RH §4) |

### 1.2 Known v1 behaviours to keep by default, document, and expose as options

| v1 behaviour | Mentor view | v2 option (default = v1) |
|---|---|---|
| `HtfOf(D1) = MN1` | Kevin's on-screen table (KM-04): D1 → ITF 1M → **HTF 3M** | `InpDirTable` (§2.1). A D1 chart's HTF *band* stays MN1 unless `InpHTFBandTF = 1` |
| `Curve()` = position in the 100-bar HTF high/low range (REV R7) | Raja (RJ-A "High curve and low curve"): measured **proximal to proximal** between the two HTF strong zones, with lines at 25 / 50 / 75 | `InpCurveMode` 0 = v1, 1 = Raja zone curve. Both are always logged |
| Any non-emotional touch of the proximal = tested | Kevin's depth grid 0 / 25 / 50 / 75 / 100 (VL:1642). Seiden: 1st = 2, 2nd = 1, 3rd = 0 points. Raja: 1st touch = set & forget, 2nd and 3rd = confirmation, 4th = breaks | DNA records the count and depth (§3, F16). Drawing still uses v1 `tested` |
| `Panel()` plans CP zones only (`!cont` skipped) | Kevin's NATGAS example: the PV demand held and the CPs failed (KM-04) | Unchanged. The click box shows each lens's plan |
| The verdict depends on the current price and bias (REV R8) | – | DNA splits **static** features (fixed when the zone forms) from **dynamic** ones (change with price). Research logs a snapshot at creation **and** at the first touch (§6.1) |
| In research, chain flags are taken at creation, but `Qualify` looks up to 5 bars after the leg | Under-counts the chain at decision time | The touch snapshot re-runs `Qualify` (§6.1) |

---

## 2. Top-down direction engine

### 2.1 Timeframe stacks

`InpDirTable` (default **1**) picks which stack feeds the Direction readout. `InpBiasSource = 0` keeps v1 `gTrend`, so the default drawing does not change.

| Chart (ETF) | 0 = v1 (`HtfOf` / `StepUp`) | **1 = Kevin lesson 4 table** (ETF → ITF → HTF) | 2 = Kevin lesson 15 slide (Entry → Higher → Higher+1) | Macro (lesson 9, H4 and above) | Confirmation TF (Raja RJ-B; Kevin) |
|---|---|---|---|---|---|
| M1 | M15 | M1 → M5 → M15 | M1 → M15 → H4 | – | – |
| M5 | H1 | M5 → M15 → H1 | M5 → H1 → D1 | – | M1 |
| M15 | H4 | M15 → H1 → H4 | M15 → H4 → W1 | – | M1 / M5 |
| H1 | D1 | H1 → H4 → D1 | H1 → D1 → MN1 | – | M5 / M15 |
| H4 | W1 | H4 → D1 → W1 | H4 → W1 → **3M** | 1M, 3M, 6M, 12M | M15 / H1 |
| D1 | MN1 | D1 → MN1 → **3M** | D1 → MN1 → **6M** | 1M, 3M, 6M, 12M | H1 / H4 |
| MT5-only TF | as v1 `InpExtraTF` | as the standard TF below it | as the standard TF below it | – | – |

The readout always shows ETF, ITF and HTF. `InpDirPlus1 = true` adds the lesson 15 "Higher+1" TF as a fourth row (default **true**). `InpDirMacro = true` (default **false**) adds the macro row on H4 and D1 charts.

**3M, 6M and 12M bars in MT5** (also `InpHTFBandTF` and the research TFs):

- MT5 has no such period, so the core aggregates `PERIOD_MN1` bars into a virtual series.
- Buckets are calendar-aligned, as TradingView draws them: quarters start in Jan / Apr / Jul / Oct, halves in Jan / Jul, years in Jan.
- `Q.open` = open of the first month, `Q.high` = the max high, `Q.low` = the min low, `Q.close` = close of the last month. `Q.time` = the first month's time.
- The current bucket is forming, like bar 0.
- ATR(14) is Wilder's ATR computed on the aggregated series. `iATR` cannot be used there.
- Virtual TF codes: `TFV_3M = 100003`, `TFV_6M = 100006`, `TFV_12M = 100012`. Every series read in the core goes through `SH(tf,i)`, `SL()`, `SO()`, `SC()`, `ST()`, `SBars()` and `SATR()` (M1 refactor). These map to `iHigh` and the rest for real TFs, and to cached arrays for virtual ones.
- Needs at least 60 MN1 bars (20 quarters). With fewer, the TF reads "n/a" and the stack falls back to MN1.

### 2.2 Per-TF state

For each TF in the stack, the engine runs the **existing** `Trendlines` and `Detect` (+ `Qualify`) on that TF, with no drawing. It then derives five inputs:

| Input | Definition | Source |
|---|---|---|
| **S** swings | v1 `HtfTrend(tf)`: two fractal highs and two fractal lows. HH + HL = +1, LH + LL = −1, else the last close beyond a swing decides, else 0 | ZoneBot/v1 |
| **T** trendline | v1 `TLBias` on that TF: the newest broken line decides (a broken downtrend line = +1). Raja variant `InpDirDepartATR` (default **0** = v1 rule: a full candle beyond the line). When > 0, a cross only counts if the crossing candle **closes** beyond the line with body ≥ `InpDirDepartATR` × ATR (Raja: "a big departure candle, small candles drifting do not count") | v1 / RJ-A, RJ-B |
| **R** removed zones | Opposite-side zones removed (v1 removal rule: a close beyond the distal) **since the newest T break**, counted in order of removal: `rmCount`. With `InpRajaRemoval = true`, removal needs a close beyond the distal **and** the next candle also closing beyond it with body ≥ `InpRajaBigBody` (0.6) × ATR (RJ-B "When is a zone removed") | RJ-A "Change of direction" |
| **L** location | Is price inside a fresh same-side or opposite-side zone of this TF (`InZone`)? Plus `curveZone` (F18) | Kevin VL:530; Raja curve |
| **C** CP run | Consecutive same-side CP zones in a row on this TF (Kevin: stop at the 3rd CP, AUD #34) | AUD |

**TF state** (one word per row):

| State | Rule | Meaning |
|---|---|---|
| `UP` / `DOWN` | T = ±1 and (S = T or S = 0) and the up (down) line is intact | Trend, impulse side |
| `TURNING UP` / `TURNING DOWN` | T just flipped to ±1, but rmCount < `InpDirRemovedN` (default **2**, Raja) | "Perfect but not enough": possibly only a pullback |
| `CHANGED UP` / `CHANGED DOWN` | T flipped and rmCount ≥ `InpDirRemovedN` | Direction has changed on this TF. Target = the opposite HTF strong / arrival zone |
| `PULLBACK` | T = −S (the swings still point the other way) and rmCount < N | Correction against the swing trend |
| `RANGE` | S = 0 and T = 0, or both line directions intact (v1 "mixed trendlines") | Sideways / momentum. Kevin: no setups; Seiden: trade both edges |
| `n/a` | Not enough bars | – |

### 2.3 Combining the stack (conflict resolution)

The rules are evaluated top to bottom. The first rule that fires sets the side; later rules can only downgrade the quality.

| # | Rule | Result | Mentor |
|---|---|---|---|
| 1 | Price is inside a fresh HTF (or Higher+1) zone | Side = that zone's side ("inside H4 demand: buys only"), even when the HTF trend is the other way. Quality = `REDUCED` when it is against the HTF state | Kevin VL:530, KM-04 ("inside the yellow band only buys"); Seiden p.421 (counter-trend only at a fresh HTF level) |
| 2 | Price is in Raja's high curve (≥ `InpCurveHigh` 75) or low curve (≤ `InpCurveLow` 25) of the HTF zone curve | Only supply in the high curve, only demand in the low curve. The other side is `BLOCKED` | RJ-A |
| 3 | HTF state is `UP`, `CHANGED UP` or `TURNING UP` (mirrored for down) | Side = HTF side | All four mentors: the HTF is in control |
| 4 | Higher+1 (or macro) disagrees with the HTF | Quality = `REDUCED`, reason "W1 down vs D1 up: correction, wait for confirmation" | Raja Zoom Q&A ("when monthly and weekly disagree, wait"); Kevin lesson 15 ("tradable but riskier, aggressive management") |
| 5 | ITF is `PULLBACK` / `TURNING` against the HTF | State = `WAIT – REALIGNING` until the ITF reaches `CHANGED` back in the HTF direction, or price reaches a nested HTF zone. Then `FULL` | Raja "Sequence and realignment"; Kevin AUD #23 |
| 6 | ETF is the same side as the side found above | `FULL` (Kevin: 3-TF confluence = full risk, VL:929) | Kevin |
| 7 | HTF is `RANGE` / `n/a` | `WAIT` (Kevin best). The panel also lists both range edges (Seiden) | Kevin / Seiden |
| 8 | ETF CP run ≥ 3 | Quality −1 step ("3rd CP in a row: do not chase") | AUD #34 |

**Readout (single line, panel top):**
`DIRECTION: LONG · FULL` | `LONG · REDUCED` | `SHORT · …` | `WAIT` | `WAIT – REALIGNING`

Up to 4 reason lines follow, for example:

```
HTF D1 UP (downtrend line broken 12 Mar, 2 supplies removed)
ITF H4 PULLBACK (1 of 2 demands removed) -> wait for H4 to realign
Curve 22% (low curve: buys only) | inside D1 demand 1.0712-1.0745
W1 UP agrees | ETF H1 TURNING UP
```

**Outputs** (globals): `gDir` (−1/0/+1), `gDirQ` (0 wait, 1 reduced, 2 full, −1 blocked), `gDirTxt[4]`, `gTFState[5]`.

- With `InpBiasSource = 1`, `gTrend = gDir` before `ZoneNotes` runs. That changes the verdict texts, so it ships **off**.
- `InpAlertDir` (default true) alerts once when `gDir` or `gDirQ` changes on a closed ETF candle.

### 2.4 Raja's WOW trendline ladder (targets)

`InpShowWOW` = **false**. When on, it draws objects with prefix `RFXV2_W`.

**Version 2: ladder by trendline** (RJ-B). On the ITF and HTF the engine keeps **every** confirmed line that `Trendlines` produces, not only the newest `InpTLHistory`, back to `InpWOWLines` = 4 lines each way.

- Each line `ℓ` has an origin: anchor `a`, the older peak for a down line. Its **origin zone** is the fresh, same-TF supply whose base `[B..L]` contains bar `a`, or the nearest one within 3 bars. For an up line, the origin zone is the demand at the older valley.
- A **cross** of `ℓ` uses the T rule (with `InpDirDepartATR`) and makes its origin zone **WOW target 1**. The next older line's origin zone is **WOW target 2**.
- Labels at the right edge: `WOW1 -> 1.0950 (+370 p, 4.1R)` and `WOW2 -> 1.1080 (+1,200 p)`. Pips use `PipSize()` (10 points on 3/5-digit symbols, 1 point otherwise; for gold, `InpPipXAU` = 0.1).

**Version 1: zone to zone** (RJ-B). When a zone's move removes the nearest opposite zone #2, the next opposite zone #1 is the target. The room between them is labelled `WOW zone→zone`.

**Guard: do not trade into an opposite zone.** If a line is crossed while price sits inside an opposite-side zone (the demand price is in when a down line breaks), the label reads `WOW pending: remove 1.0712 demand first`. No WOW alert fires until that zone is removed.

The ladder targets also feed the click box's plan option "TP = WOW1" and the bot field `wowT` (§7).

### 2.5 Panel layout (new box `RFXV2_dir`, default on via `InpShowDirPanel = true`)

- Placed under v1's compact panel and collapsible the same way. With `InpCompactPanel = false`, it is appended to the v1 `Comment` after a blank line, so v1's lines keep their place.
- Rows: the Direction line, then one row per TF (`TF  state  T S R  curve  in-zone`), then up to 4 reasons, then WOW targets when on.

---

## 3. Zone DNA

DNA is computed for **every zone that is drawn** (and for every research zone). It is stored in `struct ZoneDNA` next to v1's `Zone`. Nothing in DNA changes `Zone` fields.

**Notation:**

| Symbol | Meaning |
|---|---|
| tf | The zone's TF |
| L | `legBar` |
| k | `baseN` |
| B = L + k | The oldest base bar |
| sa = L − 1 | The stay-away bar |
| d | +1 demand, −1 supply |
| h = \|prox − dist\| | Zone height |
| A = ATR14(tf, L) | As v1 `Detect` |
| A1 = ATR14(tf, 1) | ATR on the last closed bar |
| `ext(j)` | High(j) for demand and Low(j) for supply, i.e. the favourable extreme |
| `adv(j)` | The adverse extreme: Low(j) for demand, High(j) for supply |

**Kind column:** **S** = static (fixed at creation), **D** = dynamic (recomputed at each redraw), **T** = known only at a touch.

| # | Feature (CSV column) | Kind | Formula | Mentor use |
|---|---|---|---|---|
| F01 | `base_n` | S | k | Kevin 1-3 (up to 5); Seiden fewer = better; Baker reversal short / range 3-6 |
| F02 | `base_rel` | S | k / median(base_n of the last `InpBaseMedianN` = 20 zones on tf) | Seiden "time at level, relative to other bases" |
| F03 | `base_min` | S | k × PeriodSeconds(tf) / 60 | Display |
| F04 | `legin_atr` (v1), `legin_n`, `legin_spd` | S | v1: Rng(B+1)/A. `legin_n` = the number of consecutive non-basing candles from B+1 going back with direction −d (VP) or +d (CP), capped at 10. `legin_spd` = \|Open(B+legin_n) − Close(B+1)\| / (A × legin_n), in ATR per bar | Baker "fast in is even better"; Seiden "strong arrival → strong departure" |
| F05 | `leg_ratio` (v1), `legout_atr` (v1), `legout_body`, `legout_n`, `legout_spd` | S | `legout_body` = Body(L)/Rng(L). `legout_n` = consecutive non-basing candles of direction d from L toward bar 1, capped at 10. `legout_spd` = \|Close(L−legout_n+1) − Open(L)\| / (A × legout_n) | All four; KM-22 "explosive is relative to the candles around it" → also `legout_rel` = Rng(L) / median Rng of the 20 bars before B |
| F06 | `gap_open`, `gap_away` | S | `gap_open` = d × (Open(L) − Close(L+1)) / A. `gap_away` = `gap_open` ≥ `InpGapATR` (0.10), or a window gap d × (adv(sa) − ext-side edge of bar L+1) > 0 | Seiden "gap = ultimate imbalance", Baker; Kevin "no zone there" → conflict C14 |
| F07 | `departure` (0-3) | S | 3 = gap_away; 2 = leg_ratio ≥ 2.5 or legout_atr ≥ 2.0; 1 = leg_ratio ≥ 1.8; 0 = otherwise (gradual) | Seiden p.408 grades; Kevin poor / decent / A+ / gap |
| F08 | `gap` (v1 stay-away space) | S | v1 `z.gap` | Kevin 4th part (KM-18, KM-22: measured from the stay-away candle) |
| F09 | `runout_h`, `runout_atr`, `runout_bars` | D (frozen at the first touch) | max over j ∈ [1, sa], before the first touch, of d × (ext(j) − prox) / h. ATR version: the same move divided by A. Bars = L − (bar of that maximum) | Seiden qualifying run-out ≥ 3h (p.276); IC 4.1 |
| F10 | `rm_opp_n` | S | Opposite zones (any TF-local detected zone) with removedBar ∈ [L−5, L] and legBar > L (the v1 window), **counted** (v1 only flags them) | Raja: strong = removed the opposite zone; 2 removed = change of direction |
| F11 | `rm_opp_move` | D (frozen at the first touch) | The same count over the whole move away, up to the runout extreme | Raja WOW v1 |
| F12 | Chain flags (v1): `chain`, `rm_opp_zone`, `rm_trendline`, `new_high_low`, `rm_prev_high_low`, `arrival`, `leg2` | S | v1 `Qualify` | Kevin chain; Kevin arrival |
| F13 | `ath` | S | The leg extreme (L..L−5) beyond the max high (min low) of all bars older than B, up to `InpATHBars` = 5000 | KM-22 "Makes all time high/low" qualifier |
| F14 | `arrival_raja` | S | rm_trendline AND rm_opp_n ≥ 1 (stricter than v1 `arrival`, which also accepts a new or previous high/low) | Raja arrival zone |
| F15 | `raja_strong` | S | rm_opp_n ≥ 1 (any pattern; Raja names CP / PCP) | Raja strong type 1 |
| F16 | Tests: `n_tests`, `depth_max`, `depth_1`, `emo_depth`, `depth_grade`, `ret_next` | D | A touch starts when adv(j) reaches prox after at least one candle fully outside the proximal, with emotional candles excluded (as v1). `depth` = d × (prox − adv(j)) / h × 100, the max over that touch. `emo_depth` = the deepest emotional wick (REV R16). Grade: `F` fresh / `S` ≤ 25 / `M` ≤ 50 / `D` ≤ 75 / `V` > 75. `ret_next` = the first touch within 2 bars of sa | Kevin grid (VL:1642) + "return on the very next candle = downgrade" (ZS:450); Seiden 2/1/0 and late "≥ 25% = done"; Raja touch count |
| F17 | `nested`, `nest_tf`, `nest_pos`, `in_opp_htf` | D | A fresh same-side zone H on ITF / HTF / Higher+1 with Z ∩ [H.lo − t×H.h, H.hi + t×H.h] ≠ ∅, where t = `InpNestTolH` (1.0, the same as the bot's `AtHtfZone`). `nest_pos` = d × (Z.prox − H.dist) / H.h (0 = at the HTF distal, 1 = at the HTF proximal). `in_opp_htf` as v1 research | Kevin zone within a zone (KM-04, KM-06); Raja location; Seiden HTF trumps LTF |
| F18 | `curve` (v1), `curve_zone` | D | `curve_zone` = 100 × (Z.prox − Pd) / (Ps − Pd). Pd = the proximal of the nearest fresh `raja_strong` (or arrival) HTF demand below price; Ps = the same for supply above (Raja draws proximal to proximal). If one side is missing, fall back to v1 `curve`. Buckets: L ≤ 25, LM ≤ 50, HM < 75, H ≥ 75 | Raja curve; Kevin demand below HTF 50% (best ≤ 33); Seiden curve |
| F19 | `opp_R` (v1), `opp_htf_R`, `room_R`, `wow_pips` | D | `opp_htf_R` = (the nearest opposing ITF/HTF proximal beyond the entry − entry − spread) / (h + spread). `room_R` = min(opp_R, opp_htf_R). `wow_pips` = the distance to WOW1 in pips | Seiden margin ≥ 3:1; Raja 3x (2x acceptable, 1x = sideways); Baker 3:1 to the first exit; Kevin ≥ 2 |
| F20 | `origin_ok`, `left_opp_R` | S | VP only. Walk back from B for up to `InpOriginBars` = 1500 bars. If price traded beyond the distal for ≥ 2 bars before it had sat fully on the proximal side for ≥ 2 bars, `origin_ok = 0` (a retest of older price). `left_opp_R` = the distance to the nearest older opposite level on the left, in R | Baker p.14 (check 5 years back); Seiden "old fresh levels"; IC 4.6 |
| F21 | `emotional` (v1), `novice_n` | S / T | `novice_n` = candles with Rng ≥ 2 × A1 in the last 10 bars of the approach, before the touch | Seiden "bandwagon" candles (p.175, 347) |
| F22 | `height_atr`, `height_pts`, `height_pips`, `height_vs_med`, `too_small` (v1) | S / D | `height_vs_med` = h / the median h of live zones (the v1 `TooSmall` basis) | Kevin similar size; Seiden "wide zone = smaller size" |
| F23 | `session`, `hour`, `weekday` (v1), `min_from_open` | S / T | Minutes since the nearest session open before the event: London 07:00 UTC, NY 12:00 UTC (FX, metals) or 13:30 UTC (indices, `InpIndexOpen`). Uses `InpResearchGMT` | Seiden golden first 45-60 min; FXS breakout timing |
| F24 | Context (v1): `pattern` VP/CP, `trap`, `crowded`, `cross_needed`, `near_tl`, `overext`. New: `cp_run`, `impulse` | D | `cp_run` = consecutive same-side CP zones ending at Z. `impulse` = d equals the HTF trendline direction (`T` of the HTF), i.e. moving with the line | Kevin (3 CPs); Raja "impulse vs correction: H4 and below, impulses only" |
| F25 | Weak types: `inherit`, `overlap`, `flip`, `out_tl` | S / D | **inherit**: the base is a swing extreme (FrHigh / FrLow), `rm_trendline` = 1, `rm_opp_n` = 0, and a newer same-side zone formed before Z's first touch has `rm_opp_n` ≥ 1. **overlap**: Z's [lo, hi] intersects an older opposite zone O that was still live at B (Z formed inside O). **flip**: Z intersects an older opposite zone O removed before B (polarity). **out_tl**: fresh, but the HTF line in Z's direction broke after Z formed | Raja 9 zone types (RJ-B) |
| F26 | `raja_type` | D | Priority: `ARR` (arrival_raja) > `WOW` (Z's move removed the nearest opposite zone and a next opposite zone exists, `wow_pips` > 0) > `STR` (raja_strong) > weak: `OVL` > `INH` > `FLP` > `OTL` > `TST` (n_tests ≥ 1) > `WK` | Raja |
| F27 | Approach (Seiden arrival): `appr_bars`, `appr_spd`, `new_opp_way`, `stair` | T | `appr_bars` = bars from the runout extreme to the touch. `appr_spd` = \|extreme − prox\| / (A1 × appr_bars). `new_opp_way` = opposite zones created between the extreme and the touch. `stair` = basing candles in the last 10 approach bars ≥ 4. Shown live while price approaches (provisional) | Seiden arrival point; Baker "falling knife = best"; Kevin "stair-step / never take" (KM-13) |
| F28 | Direction snapshot: `dir`, `dirq`, `st_etf`, `st_itf`, `st_htf`, `st_p1`, `align_dir` | D / T | From §2 | Thesis: the HTF direction must be known |
| F29 | Size-adjusted plan: `plan_rr` (v1), `stop_atr` | D | `stop_atr` = (entry − SL) / A1 | REV C3 |

**Cost.** F13 and F20 scan up to 5000 / 1500 bars, but only once per zone, cached by zone id (`tf | d | base-start time`). Everything else is O(lookback). Budget: ≤ 150 ms per redraw on H1 with `InpHTFLevels` = 4 and DNA on (§8, M2 check).

---

## 4. Mentor lenses

Every lens reads only DNA plus v1 outputs. Each one returns a **score**, a **pass** flag, an **entry mode** and **reasons**. Lenses never change drawing.

### 4.1 Kevin (primary mentor): the v1 verdict, unchanged, plus extra rules

| Part | Rule |
|---|---|
| Base verdict | **Exactly v1 `ZoneNotes`**: verdict STRONG / OK / WEAK, grade A / B / C, plus / minus / deal-breaker lists. Kevin rejects score sheets (VL:1708), so this lens's "score" is only a mapping for the consensus: `sK = clamp(50 + 8·np − 10·nm − 35·nc, 0, 100)`. STRONG gets +10 and grade A gets +10 |
| Kevin+ notes (display; a gate only with `InpKevinPlus = true`) | (1) `depth_max` > 75% → **void** (VL:1643). (2) `ret_next` → minus (ZS:450). (3) `cp_run` ≥ 3 → minus (AUD #34). (4) `ath` → plus, as a qualifier alongside the chain (KM-22). (5) Nested with `nest_pos` ≥ 0.5 → plus "ETF zone at the HTF proximal: stop can sit 50% into the HTF zone" (ZS:505). (6) An opposing HTF zone inside the target path → minus (Kevin: take profit sooner) |
| Pass | verdict ≠ WEAK, grade ≤ B, and (with Kevin+ on) no void |
| Entry mode | Set & forget limit at the proximal + spread if pass (and `gDirQ` = FULL). Otherwise "confirmation: an ETF opposing zone or trendline removed inside the HTF zone" (Kevin's confirmation) |

### 4.2 Seiden: the 10-point odds-enhancer sheet (S5 §1)

| Enhancer | Points | Rule from DNA |
|---|---|---|
| Departure | 0-2 | `departure` 3 or 2 → 2; 1 → 1; 0 → 0 |
| Profit margin | 0-2 | `room_R` < 3 → **0 and veto "no trade < 3:1"**. `room_R` ≥ 3 and `runout_h` ≥ 3 → 2. `room_R` ≥ 3 only → 1 |
| Big picture | 0-2 | 2 = zone side = D1 state (for intraday, Seiden uses the daily) **and** not `in_opp_htf`. 1 = D1 `RANGE`, or with the D1 but near an opposing HTF zone (`opp_htf_R` < 3). 0 = against the D1 **and** near opposing HTF S/D |
| Tests | 0-2 | Early rule (`InpSeidenDepth = 0`, default): n_tests 0 → 2, 1 → 1, ≥ 2 → 0. Late rule (`= 1`): depth_max ≥ 25% → 0 (p.421) |
| Time at level | 0-1 | `base_rel` ≤ 1.0 (at or below the median of the last 20 bases) → 1 |
| Arrival | 0-1 | `new_opp_way` = 0 and `stair` = 0 → 1. Before a touch, the current approach is used (provisional, shown as `1?`) |
| (Bonus, not counted in the 10) | +1 tag | `min_from_open` ≤ 60 at the touch → "golden hour" tag |

- **Pass and entry mode:** ≥ 9 → limit at the proximal; 8 → confirmation (let price enter, enter as it leaves at a fixed offset of `InpConfOffsetFrac` 0.05 × h; cancel if the stop price trades first); ≤ 7 → no trade.
- **Seiden extras, as reasons:**
  - Stacked same-side zone just beyond (within 0.5 h) → "+ levels on top of levels". Kevin says ~50/50 here: conflict C8, shown.
  - `flip` with margin ≥ 3, a departure ≥ 2 and a good curve → "flip valid (p.334)". Seiden's three conditions.

### 4.3 Raja: zone types, set & forget vs confirmation (RJ-A, RJ-B)

| Part | Rule |
|---|---|
| Type | `raja_type` (F26). Strong types: `ARR`, `WOW`, `STR`. Weak types: `OVL`, `INH`, `FLP`, `OTL`, `TST`, `WK` |
| Touch allowance | Fresh → set & forget. On **MN1 / 3M zones**: 2nd and 3rd touch → confirmation; 4th → "expect a break". On **D1 / W1**: 2nd → confirmation; 3rd → risky (confirmation only). On **≤ H4**: 2nd → confirmation; 3rd → skip |
| Curve | Demand only when `curve_zone` ≤ `InpCurveLow` (25), supply only when ≥ `InpCurveHigh` (75). From 25 to 75 the tag is "middle: confirmation only". From 45 to 55 a demand gets "50% line buy area" (his gold example) |
| Impulse | Zone TF ≤ H4 and `impulse` = 0 → "correction side: short-term only / confirmation" |
| Margin | `room_R` ≥ 3 → good; ≥ 2 → acceptable; < 2 → skip ("1x = sideways") |
| Removal | Raja removal (close + second big close, `InpRajaRemoval`) is shown in the info box: "Raja: still live (1 close only)" when v1 has removed the zone with one close |
| Score `sR` (0-10) | Type: ARR 4, WOW 4, STR 3, weak 0. Plus fresh 2 (2nd touch with confirmation 1). Curve correct side 2 (middle 1). Margin ≥ 3 → 2 (≥ 2 → 1). Total capped at 10 |
| Pass | Strong type, fresh, curve not on the wrong side, margin ≥ 2, and (TF ≤ H4) impulse |
| Entry mode | Strong + fresh → `SET&FORGET`. Otherwise `CONFIRM` = drop to the confirmation TF (§2.1). Wait for an LTF trendline cross **and** removal of the last opposite LTF zone, then use the new LTF CP / valley zone that did it. With `InpConfirmScan = true` (default **false**), v2 scans the confirmation TF live and tags the HTF zone "CONFIRMED on M15 at 10:45" |

### 4.4 Baker: speed, freshness, time (BK "Zone strength")

| Part | Points | Rule |
|---|---|---|
| Speed out | 0-3 | `departure` (0-3) |
| Speed in | 0-2 | `legin_spd` ≥ 1.0 → 2; ≥ 0.6 → 1 |
| Fresh | 0-3 | n_tests = 0 → 3; otherwise 0 and **veto**. `origin_ok = 0` → −2 (the creating candle retested an older zone) |
| Time in zone | 0-2 | Reversal (VP): k ≤ 2 → 2, k ≤ 3 → 1. Range breakout (CP): 3 ≤ k ≤ 6 → 2, k ≤ 2 → 1 |
| Rules (veto) | – | "Don't buy into supply / sell into demand": `in_opp_htf`, or `room_R` < 3 (day trading, zone TF ≤ H4). Swing (D1 and above): `room_R` < 5 |

- **Score:** `sB` 0-10. **Pass:** ≥ 7 and no veto.
- **Entry mode:** with the trend, "pullback + rejection candle" (a candle closes with its wick in the zone; stop a few ticks beyond). Against the trend, strong zones only (≥ 8), entered near the distal (entry = distal − d × 0.25 h) with no confirmation.

### 4.5 Consensus and verdict

**Normalise:** `nK = sK`, `nS = 10·sS`, `nR = 10·sR`, `nB = 10·sB` (all 0-100).

**Consensus:** `C = Σ w_m·n_m / Σ w_m`.

- Default weights: `InpWKevin` **40**, `InpWSeiden` **20**, `InpWRaja` **25**, `InpWBaker` **15**.
- `InpUseCalWeights = true` replaces them with the data-fitted weights from the calibration file (§6.3).

| Verdict | Rule | Colour |
|---|---|---|
| `A+ ALL AGREE` | All 4 lenses pass and C ≥ 75 | Strong green |
| `A` | ≥ 3 pass, Kevin included | Green |
| `B` | 2 pass, or 3 without Kevin | Blue |
| `C` | ≤ 1 pass | Grey |
| `X` | Any hard veto: Kevin deal-breaker (v1 `cr[]`), Seiden margin < 3, or Baker into supply/demand | Muted |

**Conflicts (always listed in the info box, 1 line each):**

| Situation | Text example |
|---|---|
| Shallow 2nd touch | "Seiden: 2nd touch OK (1 pt, depth 18%) · Kevin: tested → skip · Raja: confirmation only" |
| Test > 75% | "Kevin: void (wick 81% deep) · Seiden late rule: done · Baker: not fresh" |
| CP zone | "Kevin: CP 'most powerful' · Seiden: mid-move base is not quality (p.94)" (C6) |
| Counter-trend at HTF zone | "Seiden: OK at fresh HTF level · Kevin: half risk / skip · Baker: strong zones only, deep entry" (C10) |
| Stacked | "Seiden: +1 (two vault doors) · Kevin: ~50/50" (C8) |
| Gap away | "Seiden/Baker: strongest departure · Kevin: no zone there" (C14) |
| Not in chain but Seiden ≥ 9 | "Kevin: not in the chain (hidden by default) · Seiden 9/10" (only visible with `InpOnlyQualified = false`) |
| Raja removal | "v1: removed (1 close) · Raja: needs 2nd big close" |

---

## 5. Display

### 5.1 Zone labels

v1's name label (`id + "n"`) is untouched. v2 adds **one compact tag** per drawn zone as a separate `OBJ_TEXT` `RFXV2_t<id>`. It sits on the opposite edge from the v1 name (the proximal side, anchored left-inner). Font size 7.

| Input | Default | Tag content |
|---|---|---|
| `InpLensTag` | **true** | `A · K✓ S8 R:ARR B7 · 3R 64% n212`. Symbols are ASCII when `InpAsciiTags = true`: `K+ / K-`. Without a calibration file: `A · K+ S8 R:ARR B7 · C78` |
| `InpShowNested` | **true** | Appends `in H4 D` (nested HTF and its side). Appends `in H4 S!` when inside an opposite HTF zone |
| `InpShowSize` | false | Appends `12.4p 0.8ATR` (IC 4.5) |
| `InpShowRunOut` | false | Appends `run 3.2h` (`runout_h`) |
| `InpShowDepth` | false | For tested zones (when drawn): `T2 38%` (touches, max depth) |

The tag is muted (`cMuted`) when the verdict is `X` or `C`. It never moves v1 objects.

### 5.2 Click info box

When `InpRichPopup = true`, v1's box is extended with sections (each collapsible by clicking its header). v1 sections stay first and unchanged.

| # | Section | Rows |
|---|---|---|
| 1 | v1: Grade & trade / Plan / Why / Drills | Unchanged |
| 2 | **Direction** | ETF / ITF / HTF / +1 states and the side this zone needs. "With direction · FULL", or "against: REDUCED / BLOCKED" |
| 3 | **Mentors** | One row per lens: `Kevin  STRONG / A   pass   limit`, `Seiden 8/10   dep 2 mar 1 big 2 tst 2 tim 1 arr 0   confirm`, `Raja   ARR fresh low-curve 3.4R   set&forget`, `Baker  7/10   out 3 in 1 fresh 3 time 0`. Then `Consensus 78 → A`. Then conflict lines (§4.5) |
| 4 | **DNA** | Three lines: departure / base / leg-in / leg-out / gap away; chain (opp removed n, TL, ATH, arrival K/R, type); location (nested, curve %, room R, origin, trap / crowded); tests (n, depth grade) |
| 5 | **History** | `Cell: H1 · DBR · ARR · nested · with-dir · fresh · low-curve (level 4)` · `n 212 · touched 71%` · `hit 1R 68% · 2R 55% · 3R 41% · 5R 22%` · `best target 3R E +0.64R (95% CI +0.31..+0.97)` · `Model p(3R) 44%`. Falls back up the levels and says which (§6.3). Without data: "no calibration file loaded" |
| 6 | **Plans** | v1 plan, plus alternatives: `TP=best hist (3R)`, `TP=WOW1`, `Baker deep entry`, `Seiden confirm trigger`. Drawn dashed when `InpClickPlan = true` (v1 draws only its own plan) |

The box is capped at 40 rows. A row longer than 70 characters is wrapped by v1 `PWrap`.

### 5.3 HTF zones and lines

| Input | Default | Behaviour |
|---|---|---|
| `InpShowHTF` (v1) | true | v1 lavender band: the 2 nearest zones of `HtfOf(CTF)`. Unchanged |
| `InpHTFStack` | **0** | 1 = also draw the ITF and Higher+1 zones (2 nearest each) as **dotted proximal/distal lines** labelled `3m Proximal` / `3m Distal`, exactly as Kevin carries HTF zones onto lower charts (KM-02, KM-10, KM-12, KM-13). Colours: ITF `InpItfLine` C'150,150,200', +1 `InpP1Line` C'230,170,90' |
| `InpHTFBandTF` | 0 | 1 = the band follows the `InpDirTable` HTF (so a D1 chart shows the 3M) |
| `InpCurveLines` | false | Raja's 25 / 50 / 75 curve lines between Pd and Ps (dotted, `RFXV2_c`) |

### 5.4 Merge overlap (IC 4.4)

| Input | Default | Behaviour |
|---|---|---|
| `InpMergeOverlap` | **0** | 0 = off (v1). 1 = keep the older / outer zone (the origin) and draw the other as a thin line inside it. 2 = keep the one nearer price |
| `InpMergeMinPct` | 50 | Same-side drawn zones that overlap by more than this % of the smaller height |

Merge runs after v1's selection. When on, it can free a slot for the next-nearest zone, which changes the picture, so it ships off.

### 5.5 Alerts

v1 has `InpAlertStrong`, `InpAlertTL`, `InpHalfwayAlert` and `InpPush`. v2 adds the following. Every new alert keeps v1's `gArmed` rule: nothing that was already true when the chart loaded is alerted. Each alert key fires once (`Alerted()`).

| Input | Default | Fires when |
|---|---|---|
| `InpAlertBreak` | false | A drawn fresh zone is removed by a **close** (v1 rule), plus a "Raja-confirmed" note on the second big close |
| `InpAlertDepth` | 0 | 0 = off. 25 / 50 / 75 = price reaches that % into a drawn zone |
| `InpAlertDir` | **true** | `gDir` / `gDirQ` changes (§2.3) |
| `InpAlertWOW` | false | A WOW line is crossed with a departure close and the guard is clear |
| `InpAlertConfirm` | false | With `InpConfirmScan`: a weak HTF zone gets its LTF confirmation |
| `InpAlertAtLimit` | false | Alert at the bot's limit price (`InpZ3Front` × h before the proximal) instead of at the proximal |
| Filters (apply to every zone alert, v1 included only when changed from the defaults) | | |
| `InpAlertMinCons` | 0 | Minimum consensus C |
| `InpAlertMinVerdict` | 0 | 0 any / 1 B / 2 A / 3 A+ |
| `InpAlertNestedOnly` | false | Only nested zones |
| `InpAlertWithDir` | false | Only zones on the Direction side |
| `InpAlertMinHistE` | 0.0 | Only zones whose calibrated best E ≥ this (R) |
| `InpAlertEmail` | false | Also `SendMail` |

Alert text format: `ZV EURUSD H1 demand 1.0712 touched · A · K+ S9 R:ARR B8 · 3R 64% n212 · DIR LONG FULL`.

### 5.6 Dark / light

- v1 `ApplyTheme` / `InpAutoTheme` is kept.
- v2 colours are added to the same theme table: tag text, conflict red, WOW cyan C'0,150,170' (dark C'90,200,220'), curve grey, and the HTF stack colours.
- `InpTheme` = 0 auto (v1), 1 light, 2 dark (forces the choice).

---

## 6. Historical calibration

### 6.1 Research mode additions (logger)

v1 research (RH) is kept. Same file, same columns in the same order. v2 **appends** columns, so the analyzer keeps reading old files by column name.

| Addition | Columns | Notes |
|---|---|---|
| All DNA at creation | Every F01-F26 column not already in v1, with prefix `c_` only where a name repeats | Static + dynamic at creation |
| **Snapshot at the first touch** | `s1_*`: chain flags re-run with `Qualify` (fixes the 5-bar under-count, §1.2), `n_tests` = 0, `curve`, `curve_zone`, `nested`, `in_opp_htf`, `room_R`, `opp_R`, `opp_htf_R`, `align`, `dir`, `dirq`, `st_*`, `appr_*`, `novice_n`, `min_from_open`, `raja_type`, the 4 lens scores and passes, `cons`, `verdict` | **The calibration key uses these**, because the decision is made at the touch |
| Lens outputs at creation | `kv`, `kg`, `sK`, `sS`, `sS_parts` (6 digits), `sR`, `raja_type`, `sB`, `cons`, `v2verdict`, `entry_modes` (K/S/R/B codes) | – |
| Extra trade models for touch 1 | `t1f_*` front entry `InpZ3Front` (0.05 h before the proximal). `t1m_*` mid entry (50% into the zone, Kevin split / NATGAS deeper entry, KM-06). `t1d_*` Baker deep entry (distal − 0.25 h). Each has `_fill`, `_mfe`, `_result` | Same stop (wick beyond the distal + spread) and same 5R / opposite-zone end as v1 |
| Further outcomes | `t1_bars_to_1R`, `t1_bars_to_3R`, `t1_mae` (worst R before 1R), `t1_hit_wow1`, `t1_hit_opp_htf`, `t1_hit_runout_ext` (Seiden: the run-out extreme as a target) | – |
| Raja removal | `broken_raja`, `broken_raja_time` | Compares the two removal rules |
| Research TFs | `InpResearchTFs` accepts `3M` | Virtual TF (§2.1) |
| Speed | `InpResearchDNA` = true | false = v1 columns only (faster) |

Every touch-time value is computed on the touch candle's close, with no look-ahead (I6).

### 6.2 Analyzer additions (`tools/zone_research/analyze.py`)

The analyzer stays standard-library only. It gains these flags:

```
--calibrate OUT.csv       # write the lookup table for the indicator
--oos  path...            # out-of-sample files (default: last 25% of dates)
--split-date 2024-01-01   # alternative IS/OOS split
--key-level-max 5         # deepest cell level written
--prior 20                # shrinkage strength a
--pine OUT.pine           # emit a Pine array snippet (top 300 cells)
```

New report sections:

- (1) Lens performance: E and hit rates for pass vs fail, per lens and per TF.
- (2) Consensus bins (0-40, 40-60, 60-75, 75-90, 90+) against E.
- (3) Verdict A+ / A / B / C / X against E.
- (4) Conflict cases, e.g. "Seiden-pass & Kevin-fail" (the shallow 2nd touches).
- (5) Entry model comparison: proximal vs front vs mid vs deep.
- (6) Direction quality (FULL / REDUCED / against) against E.
- (7) Reliability table: predicted p(3R) deciles against observed, on OOS.
- (8) The v1 removal rule against the Raja removal rule.

### 6.3 The calibration table (`RFX_Calib.csv`, loaded from `Terminal\Common\Files`)

**Cells.** The `s1_` snapshot is binned into a hierarchy. Deeper levels are more specific.

| Level | Key fields |
|---|---|
| L0 | (all) |
| L1 | `tf` |
| L2 | L1 + `pattern` (DBR / RBR / RBD / DBD) + `align_dir` (+1 / 0 / −1) |
| L3 | L2 + `raja_type` group (ARR / WOW / STR / weak) + `nested` (0/1) |
| L4 | L3 + `depth_grade` at the touch (F / S / M / D) + `curve_zone` bucket (L / LM / HM / H) |
| L5 | L4 + `symbol` |

**Row format** (header line first):

```
ver,stop_model,level,key,n,touched,p1,p2,p3,p4,p5,p_opp,mfe_med,E1,E2,E3,E5,Eopp,bestT,bestE,ci_lo,ci_hi
2,wick,4,tf=H1|pat=DBR|al=1|rt=ARR|ne=1|dg=F|cz=L,212,0.71,0.68,0.55,0.41,0.30,0.22,0.48,1.9,0.36,0.65,0.64,0.32,0.51,3,0.64,0.31,0.97
```

Other row kinds in the same file (first field):

| Row kind | Content |
|---|---|
| `W,<lens>,<weight>` | Fitted lens weights (§6.4) |
| `B,<feature>,<lo>,<hi>,n,p3,E3` | Single-feature bins, used for the "tells" line |
| `LR,<feature>,<coef>` | Logistic model for p(3R). The feature list is fixed in the core; unknown features are ignored |
| `CS,<bin>,n,E_best,bestT` | Consensus bin → E (the prior when no cell has enough data) |
| `META,generated,<date>,symbols,<list>,from,<date>,to,<date>` | Provenance |

**Lookup in the indicator.**

1. Build the zone's key from its **current** DNA.
2. Walk L5 → L0 and take the first level with `n ≥ InpCalMinN` (30).
3. Shrink toward the parent cell: `p̂ = (n·p + a·p_parent) / (n + a)`, with `a = InpCalPrior` (20). The same is done for each E.
4. Display `Historically: 64% reached 3R (n=212)`, `best 3R E +0.64R`, and the level used.
5. If no level reaches n = 30, use the `CS` row of the zone's consensus bin and label it `prior`.

| Input | Default | Meaning |
|---|---|---|
| `InpCalFile` | `RFX_Calib.csv` | File name |
| `InpCalCommon` | true | Read from Common\Files (false = MQL5\Files) |
| `InpCalMinN` | 30 | Minimum cell size |
| `InpCalPrior` | 20 | Shrinkage a |
| `InpCalTarget` | 3 | The R shown in the tag (0 = the cell's best target) |
| `InpShowHist` | true | Show the history row and the tag part, when a file is loaded |

The file is reloaded when its modify time changes (checked every 60 s by the timer). A malformed row is skipped and counted in the Journal.

### 6.4 Auto-tuning score weights (analyzer, IS → OOS)

- **Lens weights.** For each lens: `lift_m = E_best(pass) − E_best(fail)` on IS touch-1 trades (wick model), with n ≥ 100 on each side. Then `w_m = max(lift_m, 0) / Σ max(lift, 0)`, scaled to sum to 100 and written as `W` rows. A lens is kept only if its OOS lift has the same sign. Otherwise its weight is 0 and the report says "lens X does not predict on this data".
- **Logistic p(3R).**
  - Pure-Python gradient descent with L2 = 1.0.
  - Inputs: ~20 standardised DNA features: departure, base_rel, legin_spd, legout_rel, gap, runout_h, rm_opp_n, arrival_raja, ath, nested, nest_pos, curve_zone, room_R, depth_1, align_dir, dirq, impulse, cp_run, origin_ok, min_from_open ≤ 60.
  - Reported with its OOS Brier score against the base rate. It is written only if it beats the base rate on OOS.
- **Threshold suggestions** (already in v1 `recommend_thresholds`) are extended to the new features. These are suggestions only. Changing a drawing threshold stays a manual, parity-checked decision (I5).

### 6.5 Workflow for the user

| Step | What | Detail |
|---|---|---|
| 1 | Compile v2 and check M0 | Run the golden-master script once (§8) |
| 2 | Symbols | Core: **XAUUSD, EURUSD, GBPUSD, USDJPY**. Breadth: **GBPJPY, AUDUSD, XAGUSD, US30** (or NAS100). 8 in total |
| 3 | TFs | `InpResearchTFs = "M15,H1,H4,D1"`. Add `M5` on XAUUSD and EURUSD only, because it is slow |
| 4 | Periods | **IS** 2019-01-01 → 2023-12-31. **OOS** 2024-01-01 → 2025-06-30. **Holdout** 2025-07-01 → 2026-09-30, run **once**, at the end (as REV §3) |
| 5 | Tester settings | Indicator, visual mode (MT5 requires it), "1 minute OHLC", `InpResearchDraw = false`, speed at max, local agents only |
| 6 | Runs | 8 symbols × 3 periods = **24 runs**. If a run is too slow, split IS into 2019-21 and 2022-23 (32 runs). Expect about 2-6k ZV zones per symbol-year over 4 TFs |
| 7 | Analyse | `python3 tools/zone_research/analyze.py data/IS --oos data/OOS --calibrate RFX_Calib.csv --out docs/Zone_Research_Report.md` |
| 8 | Accept | OOS reliability: each p(3R) decile within ±7 pp of observed. Consensus bins are monotone in E on OOS (allow at most 1 inversion). The A+ / A verdicts have OOS `bestE` > 0 with CI_lo > 0 on at least 2 of the 4 core symbols |
| 9 | Install | Copy `RFX_Calib.csv` to `%APPDATA%\MetaQuotes\Terminal\Common\Files\`. Charts pick it up within 60 s |
| 10 | Holdout | Run the holdout once and append its section to the report. If OOS → holdout E drops by more than 50%, keep `InpUseCalWeights = false` |
| 11 | Refresh | Every quarter, run the last quarter per symbol (8 runs), append it to the data and re-run step 7. Never re-tune on the holdout |

---

## 7. Bot integration (ZoneBot trades exactly ZoneVision's zones)

### 7.1 One core, three readers

**`MQL5\Include\RamanFX\RFX_ZoneCore.mqh`** contains:

- the series accessors (§2.1);
- the v1 functions listed in I2 (moved verbatim, drawing calls stripped behind `gQuiet`);
- DNA, the lenses, the Direction engine and the WOW ladder;
- `RFX_Calib.mqh` (the loader and the lookup).

`RFX_CORE_VER` and `RFX_CfgHash()` give a CRC32 over the zone-rule inputs (I5).

| Reader | How |
|---|---|
| ZoneVision v2 | `#include`, plus its own drawing and UI |
| ZoneBot (tester and live) | `InpZoneSource = 1`: `#include` the same core, so in the tester it computes the identical zones, DNA, lenses and calibration lookup. 0 = v1 internal `DetectZones` (default until M9 passes) |
| Live cross-check | ZoneVision exports global variables (below) when `InpExportGV = true`. With `InpZoneSource = 2`, the bot trades only zones whose `id` and `cfg` match its own core result, and logs every mismatch to `RamanFX_Bot_Signals.csv` (`skip: ZV mismatch`) |
| Tester parity script | ZV `InpExportBuffers = true` writes the nearest `InpExportN` (8) zones into `DRAW_NONE` buffers. Buffer f holds field f, and shift k holds zone k at the last closed bar. A tester script diffs these against the bot core every bar (IC 4.10) |

### 7.2 Global variables (live, per symbol and per TF)

The name pattern is `RFX2|<sym>|<tf>|<k>|<field>` (≤ 63 characters). GVs are doubles. The ZoneVision instance on that chart is the only writer. Stale entries are deleted on redraw and on deinit.

| Header field (`k` = `h`) | Meaning |
|---|---|
| `ts` | Server time of the last redraw. The bot ignores data older than 2 ETF bars |
| `ver` | `RFX_CORE_VER` |
| `cfg` | `RFX_CfgHash()`. The bot requires that it equals its own |
| `n` | Number of zones exported (≤ `InpExportN`) |
| `dir`, `dirq` | §2.3 |
| `wow1`, `wow2` | WOW ladder prices (0 = none) |
| `calv` | Calibration file modify time (0 = none loaded) |

| Zone field (`k` = 0..n−1, nearest first) | Meaning |
|---|---|
| `id` | Base-start time (datetime as double). With d it identifies the zone |
| `d` | +1 / −1 |
| `prox`, `dist` | Edges |
| `st` | 0 fresh, 1 tested, 2 removed |
| `ntest`, `depth` | F16 |
| `kv`, `kg` | Kevin verdict 0 / 1 / 2 and grade 0 A / 1 B / 2 C (v1 `ZoneNotes`) |
| `sS`, `sR`, `rt`, `sB` | Seiden 0-10; Raja 0-10; Raja type code (ARR 1, WOW 2, STR 3, OVL 4, INH 5, FLP 6, OTL 7, TST 8, WK 9); Baker 0-10 |
| `cons`, `v2v` | Consensus 0-100; verdict A+ 4, A 3, B 2, C 1, X 0 |
| `em` | Entry modes, packed: K×1000 + S×100 + R×10 + B (0 none, 1 limit, 2 confirm, 3 deep) |
| `p3`, `pn`, `bt`, `be`, `lvl` | Calibrated p(3R); cell n; best target R; best E; cell level |
| `en`, `sl`, `tp`, `rr` | v1 plan numbers |
| `nest`, `room` | Nested flag (×10 + TF index); `room_R` |

### 7.3 New ZoneBot inputs (defaults keep v1.62 behaviour)

| Input | Default | Effect |
|---|---|---|
| `InpZoneSource` | 0 | 0 v1 internal, 1 shared core, 2 shared core + ZV cross-check |
| `InpMinConsensus` | 0 | Skip a zone with C below this |
| `InpMinVerdict` | 0 | 0 any, 2 = A or better |
| `InpMinHistE`, `InpMinHistN` | 0.0, 30 | Skip when the calibrated best E < x, with at least n samples |
| `InpTPFromHist` | false | TP = the cell's `bestT` × R (clamped by the room check) |
| `InpRiskByHist` | false | Risk = base × clamp(0.5 + p3, 0.5, 1.0) |
| `InpEntryByLens` | 0 | 0 v1; 1 Raja (set & forget only on strong + fresh, else confirmation); 2 Seiden (≥ 9 limit, 8 confirm) |
| `InpUseDirection` | false | Use `gDir` / `gDirQ` instead of the v1 bias. REDUCED = half risk, WAIT / BLOCKED = skip |

Every skip reason is logged with the same field names as the GV table, so a backtest funnel (REV "Funnel first") can be built from the CSV.

---

## 8. Implementation plan

Effort: S ≤ ½ day, M ≈ 1-2 days, L ≈ 3-5 days. "Risk to v1" is the risk to the frozen drawing.

| # | Milestone | Content | Acceptance checks | Effort | Risk to v1 |
|---|---|---|---|---|---|
| **M0** | Golden master | Add a hidden input `InpDumpObjects` (default false) that writes every `RFXV_ / RFXN_ / RFXS_` object (name, type, times, prices, colour, style, width, text, tooltip) to `RFX_Dump_<sym>_<tf>.csv`. Record the v1.99 dumps for 6 snapshots: XAUUSD M15/H1/H4, EURUSD H1/H4/D1, at a fixed tester date | Two v1 runs give identical dumps. Kept as the regression baseline | S | None |
| **M1** | Core extraction | Move the I2 functions into `RFX_ZoneCore.mqh` with no logic change, through the series accessors. ZV includes it. Add virtual TFs (3M / 6M / 12M) and ATR on aggregated bars | All 6 dumps byte-identical to M0. 3M OHLC matches TradingView 3M on EURUSD for 2015-2025 (spot check of 10 quarters). Redraw time within +10% of v1 | M | **Medium** (refactor). Mitigated by M0 |
| **M2** | DNA | `ZoneDNA` F01-F29 for drawn zones, cached by id. A "DNA" section in the click box | Dumps identical (DNA draws nothing yet). Unit fixtures: 12 hand-checked zones from the Kevin / Raja lesson charts (KM-04 NATGAS H4 PV + 2 CP inside the weekly; KM-18 GBPUSD 2011 chain zones; RJ-A EURUSD monthly arrival 2017) have the expected `raja_type`, chain and nested flags. Redraw ≤ 150 ms on H1 | M | Low |
| **M3** | Direction engine | §2 states, conflict rules, `RFXV2_dir` panel, `InpAlertDir`. `InpBiasSource = 0` | Dumps identical except the new `RFXV2_` objects. On 5 frame-verified cases the readout matches the mentor: KM-11 AUDJPY (all TFs up → no short), KM-12 EURUSD (H4 up but in H4 supply → short side), RJ-A gold 2018 (CHANGED UP after 2 supplies removed), RJ-A EURUSD monthly/weekly realignment, KM-15 US30 (H4 up = best case) | L | Low |
| **M4** | Lenses + consensus + tag | §4, the `RFXV2_t` tag, Mentors section, conflict lines | Dumps identical for v1 prefixes. Kevin lens = v1 verdict on 100% of zones (asserted in code). Seiden part sums equal `sS` | M | Low |
| **M5** | Research v2 + analyzer | §6.1 columns, the touch snapshot, extra entry models; §6.2 report sections, `--calibrate`, `--oos` | Old v1 CSVs still analyse unchanged (regression run on one file). A v2 CSV round-trips. No look-ahead test: logging the same week twice with different end dates gives identical creation and snapshot columns | L | None (research only) |
| **M6** | Calibration in the indicator | Loader, lookup, shrinkage, tag `3R 64% n212`, History section, `InpUseCalWeights` | With a synthetic file (known cells), the lookup returns the expected level and values. A missing or bad file degrades gracefully (no tag part, Journal note) | M | None |
| **M7** | User data runs | §6.5 steps 2-10 (the user runs them; analysis is ours) | §6.5 step 8 criteria met. Report published in `docs/Zone_Research_Report.md` | M (wall-clock: days) | None |
| **M8** | WOW ladder + curve lines + HTF stack | §2.4, §5.3 | Off by default, so dumps are identical. With them on: RJ-B EURUSD daily lower-high lines (13:00-15:38) give WOW1 / WOW2 at the origin supplies | M | None (toggles) |
| **M9** | Alerts + merge | §5.5, §5.4 | Each alert fires once per key in a tester replay. No alert fires on load. Merge off = identical dumps | S-M | None (toggles) |
| **M10** | ZoneBot on the core | `InpZoneSource` 1 / 2, GV export, buffer export, parity script, the §7.3 inputs | On 3 symbols × 1 year, the parity script reports 0 zone mismatches between ZV buffers and the bot core. With `InpZoneSource = 1` and all new gates off, the bot's trade list equals v1.62's (same tickets, prices and times) | L | None for ZV. Medium for the bot (gated by trade-list equality) |
| **M11** | MT4 port | Core as `.mqh` with an MQL4 shim (`iATR` direct, no handles; MQL4 `FILE_COMMON` is available). DNA, lenses, Direction, calibration **reader**, tag, alerts. Research stays MT5-only (better tick data) | MT4 dumps for the same 6 snapshots match MT4 v1 (its own golden master) | L | Medium (separate code base). Use the same M0 approach |
| **M12** | Pine parity | DNA subset, lenses, Direction (`request.security`; Pine has native `3M`, `6M`, `12M`), calibration via the analyzer's `--pine` arrays (top 300 cells, L0-L3). Fix the known Pine gaps: `minDep` gate parity and the "fresh" alert firing on re-entries (IC 4.1, 4.3). Keep within 500 boxes / lines / labels | Pine zones on 3 symbols match MT5 (prox / dist within 1 tick) on 50 sampled zones | L | Medium (Pine already differs). Keep its drawing as is unless parity bugs are fixed with `parityFix = false` by default |

**Order rationale.** M0-M1 make the "perfect" drawing provable before anything else. M2-M4 add knowledge without touching pixels. M5-M7 close the data loop (the thesis). M8-M9 are optional visuals. M10 lets the bot trade the calibrated zones. M11-M12 port to MT4 and Pine.

**Parity notes**

| Topic | MT5 | MT4 | Pine |
|---|---|---|---|
| 3M / 6M / 12M | Aggregated MN1 (§2.1) | Same aggregation | Native `"3M"` / `"6M"` / `"12M"` |
| Calibration | CSV in Common\Files | CSV in Common\Files | Arrays generated by the analyzer (`--pine`); regenerate after each refresh |
| Research | Yes | No (reads only) | No |
| GV / bot | GV + buffers + include | GV + buffers (ZoneBot.mq4 reads them) | Alerts with webhook JSON using the §7.2 field names |
| Object limits | Fine | Fine | 500 per type. `InpMaxZones` stays 4; the HTF stack costs 4-8 lines |

---

## Appendix A: new inputs (one place)

| Group | Input = default |
|---|---|
| Direction | `InpDirEngine` = true, `InpDirTable` = 1, `InpDirPlus1` = true, `InpDirMacro` = false, `InpBiasSource` = 0, `InpDirRemovedN` = 2, `InpDirDepartATR` = 0, `InpRajaRemoval` = false, `InpRajaBigBody` = 0.6, `InpCurveMode` = 0, `InpCurveLow` = 25, `InpCurveHigh` = 75, `InpShowDirPanel` = true, `InpAlertDir` = true |
| WOW | `InpShowWOW` = false, `InpWOWLines` = 4, `InpPipXAU` = 0.1, `InpAlertWOW` = false |
| DNA | `InpDNA` = true, `InpBaseMedianN` = 20, `InpGapATR` = 0.10, `InpATHBars` = 5000, `InpOriginBars` = 1500, `InpNestTolH` = 1.0, `InpIndexOpen` = false |
| Lenses | `InpLenses` = true, `InpWKevin` = 40, `InpWSeiden` = 20, `InpWRaja` = 25, `InpWBaker` = 15, `InpUseCalWeights` = false, `InpKevinPlus` = false, `InpSeidenDepth` = 0, `InpConfOffsetFrac` = 0.05, `InpConfirmScan` = false |
| Display | `InpLensTag` = true, `InpAsciiTags` = true, `InpShowNested` = true, `InpShowSize` = false, `InpShowRunOut` = false, `InpShowDepth` = false, `InpHTFStack` = 0, `InpHTFBandTF` = 0, `InpCurveLines` = false, `InpMergeOverlap` = 0, `InpMergeMinPct` = 50, `InpTheme` = 0 |
| Alerts | `InpAlertBreak` = false, `InpAlertDepth` = 0, `InpAlertConfirm` = false, `InpAlertAtLimit` = false, `InpAlertMinCons` = 0, `InpAlertMinVerdict` = 0, `InpAlertNestedOnly` = false, `InpAlertWithDir` = false, `InpAlertMinHistE` = 0, `InpAlertEmail` = false |
| Calibration | `InpCalFile` = "RFX_Calib.csv", `InpCalCommon` = true, `InpCalMinN` = 30, `InpCalPrior` = 20, `InpCalTarget` = 3, `InpShowHist` = true |
| Research | `InpResearchDNA` = true (plus the v1 research inputs; `InpResearchTFs` accepts `3M`) |
| Export | `InpExportGV` = false, `InpExportBuffers` = false, `InpExportN` = 8, `InpDumpObjects` = false (hidden) |
