# ZoneVision v2: progress log

## 2026-10-23 - M0 (golden master), M1 (core extraction), M2 (Direction engine + location rules)

Note: the task's M2 is the spec's M3 (Direction engine, spec section 2) plus the WOW ladder (spec 2.4, part of the spec's M8) and the curve lines (spec 5.3). The spec's M2 (DNA) is not done yet.

**User decisions applied (override the spec defaults)**
- `InpDirTable = 1`: Kevin lesson 4 table (D1 -> MN -> 3M, built from MN1 bars). `0` = the v1 mapping (`StepUp` / `HtfOf`), `2` = the lesson 15 slide.
- `InpCurveMode = 1` (Raja, proximal to proximal of the HTF strong zones), `InpCurveLines = true` (25 / 50 / 75 lines, `RFXV2_c*`). The curve filter is a toggle, `InpCurveFilter = false`.
- Consensus weights (Raja 40, Kevin 30, Seiden 20, Baker 10) belong to the lenses (M4). No inputs were added yet, so M4 must use these defaults.

### What changed
| File | Change |
|---|---|
| `public/tools/RFX_ZoneCore.mqh` (new) | **M1.** The I2 functions plus their helpers are moved here: `StepUp`, `HtfOf`, `TfName`, `Rng`, `Body`, `Basing`, `CDir`, `Emotional`, `BarTime`, `Reject`, `SwingAt`, `FindTrap`, `Detect`, the trendline set (`ZigZag` ... `Trendlines`, `DedupeTL`, `RefineOnChart`, `Confirmed`, `TooFlat`), `CrossNeeded`, `TLBias`, `NearTrendline`, `Overextended`, `StructureNow`, `Qualify`, `ZoneName`, `PriceTag`, `TooSmall`, `MetalOrOil`, `Push`, `NoteHelp`, `ZoneNotes`, `DrawZones`, `FracUp`, `FracDn`, `HtfTrend` and `Curve`. The text is the same as 1.99, with three exceptions. (1) In `Rng`, `Body`, `CDir`, `Detect`, `Lo` / `Hi`, the three data lines of `Trendlines`, `FracUp`, `FracDn`, `HtfTrend` and `Curve`, the reads `iHigh / iLow / iOpen / iClose / iBars / iHighest / iLowest` are replaced by the accessors `SH / SL / SO / SC / SBars / SHighest / SLowest`. For a real TF these call the same MT5 function, so they return the same values. (2) `TfName` gets one first line for the virtual TFs. (3) `DrawZones` gets one filter line, `V2Hide()`, which always returns false while `InpLockSide` and `InpCurveFilter` are off. Also new in the core: virtual TFs 3M / 6M / 12M (`TFV_3M = 100003` and so on), built from calendar-aligned MN1 buckets with Wilder ATR(14), needing at least 60 MN1 bars; the Direction engine; the WOW ladder. |
| `public/tools/RamanFX_ZoneVision.mq5` | `#include "RFX_ZoneCore.mqh"` after the globals. New input groups "v2 Direction" and "v2 developer" (all at the end, so `.set` files stay valid). `ATR()` sends virtual TFs to `VAtr()`. `OnInit` pre-registers the ATR handles of the Direction stack. `Redraw` calls `DirRun()` after `Qualify()` (with `InpBiasSource = 1`, `gTrend = gDir`). After the v1 drawing it calls `DrawV2Lines()`, `DrawDirBox()`, `DirAlert()` and, when on, `DumpObjects()`. Also new: the Direction box `RFXV2_d*` under the compact panel (click its header to collapse; it follows the v1 panel's collapse); with `InpCompactPanel = false` the Direction lines are appended to the v1 `Comment` after a blank line; a DIRECTION section at the end of the rich click box. `OnDeinit` deletes `RFXV2_*`. `#property version` is now 2.00. |
| `tools/golden_master/RamanFX_ZoneVision_v199_dump.mq5` (new) | **M0 baseline.** The untouched v1.99 file plus only the dump inputs and functions (one call at the end of `Redraw`). It produces the reference dumps. |
| `tools/golden_master/compare_dumps.py` (new) | Byte comparison of two dump files or folders. Prints every object or field that differs. Exit 0 = PASS. |

### M0: golden-master procedure (to run in MT5)
1. Copy `RamanFX_ZoneVision.mq5` and `RFX_ZoneCore.mqh` into the same `MQL5\Indicators` folder. Put `tools/golden_master/RamanFX_ZoneVision_v199_dump.mq5` into the same folder. It is self-contained and does not use the core. Compile all three.
2. Pick 6 snapshots: XAUUSD M15 / H1 / H4 and EURUSD H1 / H4 / D1. Use one fixed end date for all of them, e.g. 2025-06-30.
3. In the Strategy Tester (indicator, visual mode, "1 minute OHLC"), run the **baseline** with `InpDumpObjects = true`, `InpDumpAt = <snapshot bar time>` and `InpResearch = false`. The tester forces research mode on, so also set `InpResearchDraw = true`. All other inputs stay at default. Stop after the snapshot bar. The Journal prints "ZoneVision dump written for bar ...". Move `Terminal\Common\Files\RFX_Dump_<sym>_<tf>.csv` into a folder `baseline/`.
4. Run the baseline a second time into `baseline2/`. Then run `python3 tools/golden_master/compare_dumps.py baseline baseline2`. It must print PASS (the dump is deterministic).
5. Run **v2** with the same settings (the v2 inputs at default) into `v2/`. Then run `compare_dumps.py baseline v2`, which must print PASS. v2 objects are written separately to `RFX_DumpV2_*.csv` and are not compared.
6. 3M spot check: `RFX_DumpVTF_<sym>.csv` lists the 3M / 6M / 12M OHLC and ATR. Compare 10 EURUSD quarters (2015-2025) against TradingView `3M`.

### M2: Direction engine (spec 2.1-2.4), as built
- **Stack.** Rows ETF, ITF, HTF and +1. +1 is the lesson 15 "Higher+1" when it is above the HTF, otherwise one step up the ladder M1 ... MN, 3M, 6M, 12M. The macro rows (MN, 3M, 6M, 12M) are added only with `InpDirMacro` on H4 / D1. A virtual TF with fewer than 40 bars falls back to MN1, and its row says so. MT5-only TFs use the standard TF below them. W1 / MN charts extend the lesson 4 table by steps up (my extension).
- **Per TF.** `HtfTrend` (S), quiet `Trendlines` (T = the newest cross; with `InpDirDepartATR > 0`, Raja's departure close), `Detect` (R = opposite zones removed at or after the cross, v1 or Raja removal; C = CP run; L = price inside a zone that is fresh at entry).
- **State order** (spec 2.2 leaves the precedence open):
  - T = 0: RANGE when S = 0 or both lines are intact, otherwise UP / DOWN from the swings alone.
  - S = -T: CHANGED if rm >= `InpDirRemovedN`, else PULLBACK.
  - A line in T's direction is already respected: UP / DOWN.
  - Otherwise: CHANGED if rm >= N, else TURNING.
- **Conflict rules 1-8** in the spec's order:
  - Rules 1-3 set the side: HTF / +1 zone lock, then the curve, then the HTF state.
  - Rules 4-8 can only downgrade: +1 or macro disagrees -> REDUCED; ITF PULLBACK / TURNING against the side -> WAIT - REALIGNING (unless price is inside the HTF zone of that side); ETF not on the side -> at most REDUCED; ETF 3rd CP in a row -> one step down. With no side: WAIT, plus the HTF range edges.
- **Outputs:** `gDir`, `gDirQ`, `gDirSide`, `gDirBlocked`, `gDirTxt[4]` and `gTFState[5]`.
- **Location.** Raja curve: the nearest fresh `raja_strong` HTF demand below and supply above price. When one side is missing it falls back to the v1 100-bar curve, which also covers `InpCurveMode = 0`. HTF-zone side lock: `gLockSide`. Both are shown in the box and the click box. As filters they are toggles that default off (`InpLockSide`, `InpCurveFilter`).
- **WOW ladder** (`InpShowWOW = false`). Version 2, by trendline, on the HTF then the ITF row. WOW1 = the origin zone of the newest crossed line, WOW2 = the origin zone of the next older line (at most `InpWOWLines`). The label has pips and R (R = against the nearest fresh chart zone on that side). It reads "pending" while price sits in a zone against the move. Not done: WOW version 1 (zone to zone), and `InpAlertWOW`.
- **Alert.** `InpAlertDir`: one alert when `gDir` / `gDirQ` changes. The first redraw only records the starting state.

### Checks run (no MetaEditor here)
- ASCII only: 0 non-ASCII lines in the `.mq5`, the `.mqh` and the baseline `.mq5`.
- `{} () []` balance after stripping strings and comments: all equal for all three files, and the brace depth never goes negative.
- Shadowing (the main file with the core inlined): no local or parameter has the name of a global, and no global has the name of a function. The checker was tested on a fixture.
- Every scalar local has an initialiser. The checker was tested on a fixture.
- Every called function is defined in the files or is an MQL5 built-in. Spot-checked: argument counts of `HLine`, `Txt`, `Box`, `Lbl`, `PRow`, `PWrap`, and `StringFormat` placeholders against their arguments.
- Zero-change proof for M1: mapping the accessors back to `iHigh` and the rest restores every moved line of 1.99 (0 lines missing). Outside the moved blocks only 4 lines of the `.mq5` changed: panel header click, empty-click hit test, light refresh, `Comment`. Each change only adds a v2 call.
- `compare_dumps.py` was tested on identical and changed fixtures.

### Open risks
- **Not compiled.** MetaEditor may still flag something. The likeliest spots are the new code's casts `(ENUM_TIMEFRAMES)100003` in `switch` returns, and the `#ifndef` guard in the include.
- **Dumps not yet recorded.** M0 / M1 byte identity is argued from the code, not measured. The procedure above must be run.
- **Click box.** With `InpShowDirPanel = true` (default), the rich click box (`RFXP2_*`, only while open) gains a DIRECTION section, so its size changes. This follows spec 5.2. Turn `InpShowDirPanel` off for the exact v1 box.
- **Redraw triggers.** The Direction stack's ATR handles are registered in OnInit. With `InpHTFLevels < 4`, a stack TF can be new to the chart, and its candle open then also triggers a redraw. That gives the same v1 objects, at different moments.
- **Speed.** The engine runs `Trendlines` + `Detect` + `HtfTrend` on 4 more TFs per redraw. The +10% redraw budget is not measured. `InpDirEngine = false` restores v1 cost.
- **Interpretations still to confirm** against the frame-verified cases (KM-11, KM-12, RJ-A gold 2018, RJ-A EURUSD, KM-15):
  - the state precedence above;
  - "fresh at entry" (a zone counts as fresh while the touch that is still going on is the only one);
  - Raja strong = removed an opposite zone within 5 bars of the leg (v1 `Qualify` window; arrival zones are not added);
  - the WOW guard direction. The spec's example looks reversed; implemented as "price inside a zone standing against the move".
- **Not done in this step:** DNA (spec M2), lenses / consensus (M4), `InpHTFBandTF` / `InpHTFStack`, the Seiden both-edges plan, and the ZoneBot include path (`MQL5\Include\RamanFX\`). The core still needs host-defined inputs, globals and drawing helpers (see its header).

## 2026-10-23 - M3: Zone DNA, mentor lenses + consensus, display, alerts, theme

This covers the spec's M2 (DNA), M4 (lenses, consensus, tag) and the display / alert / theme parts of M9 (spec 3, 4, 5.1, 5.2, 5.4, 5.5, 5.6). Calibration (spec 6, M5 / M6) is not built, so the History section and `InpAlertMinHistE` have no data yet.

**User decisions applied:** consensus weights `InpWRaja = 40`, `InpWKevin = 30`, `InpWSeiden = 20`, `InpWBaker = 10` (spec default was 40 / 20 / 25 / 15).

### What changed
| File | Change |
|---|---|
| `public/tools/RFX_ZoneCore.mqh` | **New at the end** (after the Direction engine): `struct ZoneDNA` (F01-F29), `struct LensOut`, `DnaPrepare()` (the HtfOf zones for `in_opp_htf`, the D1 side for Seiden), `DnaCompute()`, `DnaTests()` (F16), a per-zone cache for the two long scans (F13 ATH, F20 origin, key = tf / d / base-start time), `LensRun()` (Kevin, Seiden, Raja, Baker, consensus, verdict, conflict lines), `LensConfTF()`, and the merge-overlap selection `V2MergeSelect()` / `V2MergePrepare()`. **Edited:** `V2Hide()` gets one first line (merged zones, only when `InpMergeOverlap > 0`); `DirWOW()` also sets `gWowPend`. The v1-moved part of the core is unchanged (diff = 2 header comment lines). |
| `public/tools/RamanFX_ZoneVision.mq5` | New input groups "v2 Zone DNA + mentor lenses", "v2 Display", "v2 Alerts" (before "v2 developer"). New v2 colours in the theme table. `RegZone` / `ClearReg` also keep the Z index and the ZoneNotes counts per drawn zone. `Redraw` calls `V2MergePrepare()` before `DrawZones(Z)`, `V2Zones()` after it, then `V2BreakAlerts()` / `V2WowAlert()`. New: tags `RFXV2_t<zone>`, merge lines `RFXV2_m*`, alternative plan lines `RFXV2_P*` (only while the click box is open), the click-box sections, the alerts. |

Pre-existing `.mq5` lines that changed (each one neutral at the defaults): `ApplyTheme` gDark line (`InpTheme`), `CheckTouch` hit line (`InpAlertAtLimit`) + message (v2 tail appended) + a filter line, `HidePop` (also deletes `RFXV2_P`), the zone-click test (also accepts the tag), the CHART_CHANGE theme test (`InpTheme == 0`), the halfway alert condition (+ `V2HalfwayOk`, true at default filters), `WowColor()` / curve colour (same values from the theme table), the DIRECTION header (now foldable).

### As built
- **DNA** is computed for every drawn chart zone (not the HTF band zones, not research zones yet). Formulas as spec 3. Choices where the spec is open:
  - F02 `base_rel`: the zone and up to 19 older zones of the same list.
  - F09 run-out stops before the first touch (and before the removal bar).
  - F11 `rm_opp_move`: window from the run-out extreme (or L-5, whichever is older) to L.
  - F17 nested: the HTF row first, then +1, then ITF; the newest matching fresh zone. `in_opp_htf` = overlap with a live opposite `HtfOf` zone (v1 research rule).
  - F19 `room_R` = 99 ("open") when no opposing level is in view.
  - F20 `left_opp_R`: the nearest-in-price older swing level (InpTLSwing fractal) beyond the proximal, within `InpOriginBars`. -1 = none.
  - WOW type (F26) uses the zone-to-zone version: the move removed an opposite zone and a next opposite zone exists. `wow_pips` falls back to the trendline WOW1 when that is on.
  - F23 `min_from_open` is taken at the first touch (provisional: now).
- **Kevin lens** = the v1 `ZoneNotes` verdict and grade, captured in `RegZone` right after `DrawZones` called `ZoneNotes`. `LensRun` re-derives the verdict with the v1 rule and `V2Zones` prints one Journal line if they ever differ (the M4 assertion). Kevin+ notes are shown; they gate / score only with `InpKevinPlus`. Entry mode: limit when pass and Direction FULL on the zone's side, confirm when pass otherwise, none when fail (spec says "otherwise confirmation"; a failing zone gets "no trade").
- **Seiden**: 10-point sheet as spec. Big picture: a D1 row of the stack if present, else the HTF row on D1+ charts, else `HtfTrend(D1)`. Against the D1 scores 0 (spec only names "against and near opposing HTF" for 0: gap filled).
- **Raja**: type, touch allowance by TF class, curve (`curve_zone`), impulse, margin, "still live" note, score, pass and entry as spec.
- **Baker**: as spec. The deep entry is placed **inside** the zone, 25% of the height from the distal (`dist + d x 0.25 h`). The spec formula `distal - d x 0.25 h` would sit outside the zone, which looks like a sign slip.
- **Consensus / verdict** exactly as spec 4.5. X = Kevin deal-breaker, Seiden margin < 3, or Baker into supply / demand (`in_opp_htf` or room < 3, < 5 on D1+).
- **Tag** `RFXV2_t<zone>` (OBJ_TEXT, font 7, at the proximal, inside the zone, muted for X / C): `A | K+ S8 R:ARR B7 | C78` + `in H4 D` / `in W1 S!` (default on) + optional size, run-out, depth. With `InpAsciiTags = false` the separator is a middle dot and the Kevin mark a tick / cross (written as `ShortToString` codes, so the source stays ASCII). Clicking the tag opens the click box.
- **Click box**: after v1's sections and DIRECTION: MENTORS (one row per lens + notes, consensus, conflict lines), DNA (6 lines, **folded by default**), HISTORY ("no calibration file loaded"), PLANS (v1 plan, TP = WOW1, Baker deep entry, Seiden confirmation trigger, Raja confirmation TF). Each v2 header folds / unfolds on click (the box is rebuilt in place). v2 rows are capped so the box stays at 40 rows; v1's rows are never cut. With `InpClickPlan`, the WOW1 TP and the Baker deep entry are drawn dashed (`RFXV2_P*`), removed with the box.
- **Merge overlap** (`InpMergeOverlap`, default 0): replays v1's selection, hides one of two same-side drawn zones overlapping by more than `InpMergeMinPct` % (mode 1 keeps the older, mode 2 the nearer to price), repeats until no overlap (a slot can go to the next zone). Mode 1 draws the merged zone's proximal as a dotted line.
- **Alerts** (all keep `gArmed`, one per key): `InpAlertBreak` (a zone drawn fresh at the last redraw is removed on the last closed candle; then a "Raja-confirmed" alert if the next candle closes beyond with a big body), `InpAlertDepth` (25 / 50 / 75 % into a drawn zone), `InpAlertWOW` (a new WOW1 target with the guard clear), `InpAlertAtLimit` + `InpZ3Front` (v1 touch alert at the bot's limit price), filters `InpAlertMinCons`, `InpAlertMinVerdict`, `InpAlertNestedOnly`, `InpAlertWithDir`, `InpAlertMinHistE` (blocks everything while > 0, no calibration yet), applied to the v1 STRONG-touch and halfway alerts too (they all pass at the defaults), `InpAlertEmail`. The v1 touch alert text gets the v2 tail ` | A | K+ S9 R:ARR B8 C78 | DIR LONG FULL` (text only).
- **Theme**: `InpTheme` 0 = v1 auto, 1 = light, 2 = dark (forces the v1 dark colours too). v2 colours (tag, conflict red, WOW cyan, curve grey, ITF / +1 line colours for the future HTF stack, verdict colours) live in `ApplyTheme`.

### Checks run (no MetaEditor here)
- ASCII only: 0 non-ASCII lines in the `.mq5` and the `.mqh`.
- `{} () []` balance after stripping strings / comments: equal in both files, brace depth never negative.
- Main file with the core inlined: no local or parameter shadows a global (the checker knows `ZoneDNA` / `LensOut`), no global has a function's name, every scalar local has an initialiser (struct locals are `ZeroMemory`-ed), every called function is defined or an MQL5 built-in (new built-ins: `SendMail`, `ShortToString`).
- New: every `StringFormat` has as many arguments as placeholders (0 mismatches), every user function is called with an allowed argument count (0 mismatches). Both checkers were tested on a fixture with one injected fault each. All new `%d` arguments were checked by hand to be ints.
- The v1-moved part of the core is unchanged against the M2 version (diff = header comment only).
- F16 touch counter + F09 run-out ported to Python and run on a hand-made demand zone (2 touches, 40% deep, emotional 80% wick excluded, run-out 6.0 h): as expected.

### Open risks
- **Not compiled.** Likeliest trouble: struct arrays of `ZoneDNA` / `LensOut` (structs with strings) passed by element reference, long `StringFormat` calls, the `ShortToString((ushort)...)` casts.
- **Golden master not re-run.** v1 objects should be identical: the only new v1-path code is `V2MergePrepare` (empty while off) and a `V2Hide` line that is skipped while off. v2 objects (`RFXV2_t*` tags are on by default) go to the separate `RFX_DumpV2_*` file.
- **Click box size changes by default** (MENTORS / HISTORY / PLANS sections). `InpDNA = false` (and `InpShowDirPanel = false`) gives the exact v1 box.
- **Speed not measured.** DNA per drawn zone (<= 4), with the 5000-bar ATH and 1500-bar origin scans cached per zone. `DnaPrepare` adds one `Detect` on `HtfOf(chart)` and one `HtfTrend(D1)` per redraw.
- **Interpretations to confirm** on the M2 / M4 fixtures (KM-04, KM-18, RJ-A): the spec gaps listed above (Seiden against-D1 = 0, Kevin fail = no trade, Baker deep entry inside the zone, nested row order, WOW type = zone to zone).
- **Not done:** DNA columns in research mode and the touch snapshot (M5), calibration loader / History data / `InpUseCalWeights` (M6), `InpConfirmScan` / `InpAlertConfirm`, `InpHTFStack` / `InpHTFBandTF`, DNA for the HTF band zones, GV / buffer export (M10).

## 2026-10-23 - M5 (research v2 + analyzer) and M6 (calibration in the indicator)

Spec 6.1-6.5 and the M6 part of 5.1 / 5.2 / 5.5. Nothing compiled or run in MT5; nothing committed. User decisions from earlier entries are unchanged (Kevin lesson-4 stack, Raja curve, weights Raja 40 / Kevin 30 / Seiden 20 / Baker 10 as the `InpW*` defaults).

### What changed
| File | Change |
|---|---|
| `public/tools/RamanFX_ZoneVision.mq5` | New input group "v2 Calibration + research": `InpCalFile`, `InpCalCommon`, `InpCalMinN`, `InpCalPrior`, `InpCalTarget`, `InpShowHist`, `InpUseCalWeights`, `InpResearchDNA` (true). **Research:** `InpResearchTFs` accepts `3M / 6M / 12M`; with `InpResearchDNA` every new zone also logs DNA + lenses + Direction (`RsV2Cols`), touch 1 asks for a snapshot (`s1Pend`), and `RsCreate` (the same research context as v1, plus `DirStateSave` / `DirRun` / `DnaPrepare` / `DirStateRestore`) takes it in `RsSnap`; three extra touch-1 models (front / mid / Baker deep), bars to 1R / 3R, MAE, WOW1 / HTF / run-out hits and Raja removal run in `RsStep2`. **Indicator:** `CalCheck()` at start and every 60 s in `OnCalculate` (a changed file forces one redraw), `zCal[]` per drawn zone in `V2Zones`, tag part `3R 64% n212` (or `C78 prior 3R +0.21R`) instead of `C78`, HISTORY rows (`V2HistRows`), alert tail, `InpAlertMinHistE` now works (needs a calibrated zone), the consensus row shows the weights in use. |
| `public/tools/RFX_ZoneCore.mqh` | New `SBarShift` accessor. `gDnaTestStop` (DnaTests ignores the touch candle in a snapshot; 0 on the chart). `LensRun` takes its weights from `LensW()` (= `InpW*`, or the W rows with `InpUseCalWeights`). New end section: `DirStateSave` / `DirStateRestore` (the whole Direction + DNA-context state), the calibration reader `CalLoad` / `CalCheck`, `CalKeys`, `CalFeat`, `CalLookup` (struct `CalOut`). |
| `tools/zone_research/analyze.py` | v2 flags `--calibrate --oos --split-date --key-level-max --prior --cell-min --cal-min-n --min-lens-n --lr-max --cells-from --pine`; report section 7 (7.1-7.11: lenses, consensus bins, verdicts, conflicts, entry models, Direction quality, OOS reliability, v1 vs Raja removal, weights, model, acceptance). `load_calib` + `cal_lookup` are line-for-line the core's `CalLoad` / `CalLookup`, and the reliability table uses them. |
| `docs/Zone_Research_HowTo.md` | v2 columns (section 5) and the 24-run workflow with the install step (section 6). |

v1-path lines that changed (each is value-identical on a real TF or a no-op with v2 off):
- `cT / cH / cL / cO / cC / cBars` go through `ST / SH / SL / SO / SC / SBars`.
- In the moved v1 code, `SwingAt`, `FindTrap` and the `Qualify` new-high/low lines read through the accessors (the same M1 swap, needed only for 3M research).
- Research: `RsSlot / RsLog / RsUpdate` reads go through the accessors.
- `RsStep` returns its v1 result through one variable.
- `RsFinish` writes v1's frozen status / time / age when v2 kept the zone open.
- The ALT live-zone loops skip zones v1 has already resolved (`v1St`). This only matters while v2 keeps such a zone in memory.

### As built (choices where the spec is open)
- **v1 columns stay identical with `InpResearchDNA = true`.** A zone that v1 would close (`broken` / `touches3`) while a v2 model trade runs, a snapshot is pending, or Raja's 2nd close is still possible (up to 3 candles) is "frozen": v1 code no longer runs on it and its row keeps v1's status, time and age. Rows can appear in the file in a different order than in 1.99. `horizon` closes everything at once (models open).
- **Snapshot timing.** On the touch-1 candle's close, in the same pass that logs new zones. The zone's own tested / removed state from that candle is reset (the limit order is decided before the touch), and DnaTests ignores bar 1 (`gDnaTestStop`). Everything else is as of the close. `s1_lag` > 0 marks catch-up candles; `s1_found = 0` marks a zone rebuilt from its creation copy (ALT zones, or zones out of `Detect`'s window).
- **Models.**
  - Front fills once price reaches it after being fully outside it.
  - Mid and deep fill only during the touch-1 trade and are cancelled when it ends.
  - A waiting order is cancelled when the zone breaks.
  - All three use v1's stop, spread, end (max(5R, opposing zone) in their own R) and candle rules.
  - Baker deep = 25% of the height inside, from the distal, as in the lens.
- **Calibration cells.**
  - Keys come from the snapshot (creation values for untouched zones): `tf`, `pat`, `al` (= `align_dir`), `rt` (ARR / WOW / STR / weak), `ne`, `dg`, `cz`, `sym`.
  - `n` = zones and `touched` = share touched; p / E / MFE are per touch-1 trade. `bestT` is one of 1, 2, 3, 5 R or the opposing zone (no E4 column).
  - Shrinkage is recursive (each level toward the shrunk parent; weight = trades, zones for `touched`).
  - The lookup goes L0 -> L5 while n >= `InpCalMinN`. With nothing left it uses the CS row of the consensus bin, if that row has n >= `InpCalMinN`.
  - The CI is the raw cell's 95% normal interval.
- **Model.** L2 logistic fitted with Newton steps (pure Python; plain gradient descent was too slow on 10k rows). LR rows carry mean and sd: `LR,<feature>,<coef>,<mean>,<sd>` + `LR,_intercept,<b>`. Unknown features are skipped (= at their mean). `room_R` / `opp_R` / `opp_htf_R` are clipped at 10, `runout_h` at 20 and `curve_zone` at -50..150, the same in the core and the analyzer.
- **Lens weights.** A lens whose OOS lift cannot be measured (fewer than max(30, `--min-lens-n` / 3) trades a side) is dropped, not kept unvalidated. With no lens kept, no W rows are written and the indicator keeps `InpW*`.

### Checks run (no MetaEditor here)
- ASCII only: 0 non-ASCII lines in the `.mq5` and the `.mqh`.
- `{} () []` balance after stripping strings / comments: equal in both files, brace depth never negative.
- Main file with the core inlined: no local / parameter shadows a global (one hit, the parameter `calE` against the core's `calE[]`, was renamed); no global named like a function; every scalar local initialised; every called function defined or a built-in (new: `FileIsExist`, `FileGetInteger`, `MathExp`, `ArrayInitialize`); every `StringFormat` placeholder count matches; every user-function call has an allowed argument count.
- The checkers were re-tested on a copy with 4 injected faults (shadowing local, uninitialised local, `StringFormat` mismatch, a call missing an argument). All 4 were reported.
- The research header was rebuilt from the MQL source by a script (315 columns, no duplicates). The synthetic test data uses exactly that header, so the analyzer reads the names the indicator writes.
- `analyze.py`:
  - **Regression:** on a v1-only CSV, its report is byte-identical to the previous analyzer's. On a v2 file, sections 1-6 are byte-identical, followed by the new section 7.
  - **Synthetic IS / OOS:** 16k IS + 6k OOS zones over 4 symbols, with planted effects. It recovers Kevin 42 / Raja 51 / Seiden 7 / Baker 0 (Baker's OOS lift has the wrong sign: "does not predict"). The LR signs are right, the OOS Brier is 0.200 vs 0.215, and every OOS reliability decile is within 7 pp. 1097 cells were written and re-read with 0 malformed rows.
  - `--split-date`, the default 75 / 25 split, `--stop close`, `--key-level-max 3` and `--pine` all run. A v1 file with `--calibrate` writes L0 / L1 cells only.
- **Lookup (M6 acceptance, on the Python twin of `CalLookup`).** On a hand-made file with known cells, the lookup:
  - picks level 2 when level 3 has n = 20 < 30;
  - matches the hand-shrunk p3 / E3 / touched (1e-9);
  - falls back to level 0 when the TF has no cell;
  - uses the consensus-bin prior when no level qualifies, and refuses a bin with n < 30;
  - returns the raw cell with a = 0;
  - skips an unknown LR feature;
  - counts 2 malformed rows.

  Script: `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/m5test/test_lookup.py`.

### To run in MT5 (M5 / M6 acceptance)
1. **v1 columns unchanged:** run one week with `InpResearchDNA = false`, then with `true`. Sort both files by `id` and compare the first 108 columns: they must be equal.
2. **No look-ahead:** log the same week twice with different end dates. The creation and `s1_` columns of the zones they share must be identical (zones still open at the end differ only in outcome columns).
3. **Calibration:** copy the synthetic `RFX_Calib.csv` (`scratchpad/m5test/out/`) to Common\Files. The Journal line appears within 60 s, the tags change to `3R ..% n..`, and HISTORY shows level, cell and tells. Delete the file: within 60 s the tags fall back to `C..` and the Journal says so.

### Open risks
- **Not compiled.** The likeliest trouble spots:
  - `RZone` now holds a `Zone` and more strings (`ZeroMemory` / struct copy, as v1 already did);
  - array elements passed by reference (`RsTargets(RZ[ri], sx)`, `CalLookup(zDna[k], zLens[k], zCal[k])`);
  - `FileGetInteger(name, FILE_MODIFY_DATE, common)`;
  - `StringToDouble` on plain decimals (the analyzer writes no exponent notation).
- **Research speed.** Every research candle with a new zone or a first touch runs the Direction engine on that TF's stack, and DNA runs per new zone and per touch. Not measured; guess 2-4x the v1 run time. The 5000 / 1500-bar DNA scans are cached, but research churns the 300-entry cache.
- **ATR slots.** Research TFs and their Direction stacks share the 12 ATR slots with the chart. On an M15 chart with `M15,H1,H4,D1` about 7 are used. If they run out, a stack row reads n/a (logged as state 0); nothing breaks.
- **3M research is thin.** About 100 quarters of MN1 history; no ALT detector on virtual TFs. Only `Qualify`, `FindTrap` and `SwingAt` were moved to the accessors. Other chart-only helpers (the HTF line refinement) still read real TFs, but HtfOf(3M) is none, so they are not used there.
- **Snapshot simplifications to check:**
  - The Direction engine at the snapshot uses the current tick's price (the next candle's open), as the chart would.
  - `min_from_open` uses the touch candle's open time.
  - The approach (F27) runs to bar 0.
- **Not done:** `B` rows feed only the "tells" line; the threshold suggestions were not extended to the new features (spec 6.4 last bullet); the History numbers are not exported to the bot (M10). No real-data run yet (M7 is the user's 24 runs).
