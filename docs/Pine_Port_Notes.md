# Pine Port Notes - ZoneVision 2.00

File: `public/tools/RamanFX_ZoneVision.pine` (Pine Script v6). Port of `public/tools/RamanFX_ZoneVision.mq5` (2.00) and its core `public/tools/RFX_ZoneCore.mqh`. It replaces the older v1 Pine port, whose trendlines were not the MT5 ones. The new file comes from the MQL source, not from the old port.

## How the port is built

The script has three parts:

1. **Inputs and theme.** These keep the MT5 input names (`InpMinLegRatio` and so on), the MT5 defaults and the MT5 groups. Inputs that only make sense in MT5 are left out (see "Not ported"). A small "TradingView only" group is added.
2. **Core.** This part only computes and never draws. The functions are line-by-line translations of the MQL functions and keep the same names: `Detect`, `FindTrap`, `ZigZag`, `FitAnchor`, `Confirmed`, `TooFlat`, `Trendlines`, `TLBias`, `RefineOnChart`, `DedupeTL`, `Qualify`, `ZoneNotes`, `HtfTrend`, `Curve`, `DirTable`, `DirEvalTF`, `DirCurve`, `DirCombine`, `DirWOW`, `DnaCompute`, `LensRun` and the rest. Every function works on `Ser` objects. A `Ser` holds newest-first arrays (`t o h l c a`), exactly like an MQL series: index 0 is the forming bar, index 1 is the last closed bar, and the index grows into the past. The accessors `s.sH(i)`, `s.sL(i)`, `s.sO(i)`, `s.sC(i)`, `s.sT(i)` and `s.atr(i)` return 0 outside the history, like `iHigh` / `iTime` / the MT5 ATR cache. Because the indexing is the same, every bar index in the Pine core is the MQL index, with no conversion. `RunAll()` is MQL `Redraw()` without the drawing calls.
3. **Glue.** This part fills the `Ser` arrays, calls `RunAll()` once per closed candle, draws the result (lines, boxes, labels, one table) and sends the alerts.

### When it runs (the MT5 redraw moment)

MT5 redraws once, at the first tick of a new candle. The port runs once per closed candle: on the last confirmed history bar when the script loads, then on every confirmed realtime bar (`barstate.isconfirmed`). Objects created on a confirmed tick persist, so nothing repaints between candles. The run deletes every object from the previous run and draws them again, as MT5 `ObjectsDeleteAll` does.

### Index conversion: chart

At the close of candle X the glue builds the chart `Ser` like this:

| Ser index | Value | MT5 equivalent |
|---|---|---|
| 0 | synthetic bar: time = `time_close` of X, open = high = low = close = close of X | bar 0 at its first tick (open = first tick, the same as X's close when there is no gap) |
| i >= 1 | Pine history `[i - 1]`: `time[i-1]`, `open[i-1]`, ..., `atrS[i-1]` | bar i |

`atrS = ta.sma(ta.tr(true), 14)`. MT5 `iATR` is the simple average of the true range, not Wilder's average, so the port does not use `ta.atr`. `Mid()` is `close` (Pine has no bid / ask), and the spread is the `TvSpreadPts` input (default 0).

Lines and boxes use `xloc.bar_time` with the exact times from the arrays: `s.sT(i)` of the bar the MQL code uses. For example, a line's anchor `x1 = s.sT(t.a)`, its right end `s.sT(0) + 3 periods`, and a zone's left side `s.sT(legBar + baseN)`. No `bar_index` arithmetic is used anywhere.

### Index conversion: higher timeframes

MT5 reads the HTF series directly (`iHigh(_Symbol, tf, i)`). The port calls `request.security(..., f_pack(...), lookahead = barmerge.lookahead_on)`. `f_pack` runs on the HTF and keeps a `var` array of the CLOSED HTF candles, built from `[1]` values (time, OHLC and SMA-14 ATR, or Wilder ATR for 3M / 6M / 12M, as MT5 `VBuild` uses). It also returns the current HTF candle. `lookahead_on` together with `[1]` is the documented form that does not repaint. With `lookahead_off` plus `[1]`, the history would lag by one extra HTF candle.

`serFromPack()` turns the pack into the `Ser`:

| Case | Ser index 0 | Ser index 1 | Ser index >= 2 |
|---|---|---|---|
| this chart candle does not close the HTF candle k | placeholder (time = open of k) | closed k-1 | k-2 ... |
| this chart candle also closes HTF candle k (`time_close(k) <= time_close(chart)`) | placeholder (time = close of k = the new HTF bar) | k (now closed) | k-1 ... |

In both cases the result is what MT5 sees at the first tick of the next chart candle. The placeholder's OHLC is the chart close. MT5 holds the partial forming HTF bar there, but no core function reads HTF bar 0's prices: every HTF loop stops at index 1 or 2, and only its time is used. The synthetic test below checks this.

The big array is only returned for the HTF candle(s) at the end of the chart (`time_close >= last_bar_time`), so memory stays small. Each pack keeps 330 closed bars (`TvHtfCap`). That covers every MT5 HTF scan: HtfTrend reads up to bar 306, and Trendlines and Detect read up to about bar 210 (Lookback 200 plus the base). With 330 or more bars, every `SBars(tf)` formula gives the same result as MT5's longer history. The test checks this too.

### Timeframes used (request.security calls: 14 of the 40 allowed)

These are the slots, the same TFs MT5 loads in `OnInit`: HtfOf, StepUp 1..InpHTFLevels (the HTF trendline levels), the Direction stack ITF / HTF / Higher+1, the macro rows (off by default), MN1 when a virtual TF is in the stack, and D1 for Seiden's big picture. A slot whose TF is not above the chart TF, or is the same as an earlier slot, is not requested. 3M / 6M / 12M use TradingView's native `3M` / `6M` / `12M`, which are calendar-aligned like MT5's `VBuild` buckets.

TFs are handled in seconds, as MT5 `PeriodSeconds` does (MN1 = 30 days, 3M = 90 days and so on). The ordering comparisons in the core (`tf <= htf`, `x.tf >= PERIOD_D1` ...) therefore keep the MT5 enum order.

## Function mapping MQL -> Pine

| MQL (RFX_ZoneCore.mqh / .mq5) | Pine | Notes |
|---|---|---|
| `SH SL SO SC ST ATR(tf,i)`, `SBars` | `s.sH s.sL s.sO s.sC s.sT s.atr`, `s.n` | 0 outside the history, like MT5 |
| `iHighest / iLowest / SHighest / SLowest` | `SHighestH / SLowestL` | first strict extreme from `start` into the past; on equal values the newer bar wins (the core's own virtual-TF version does the same) |
| `iBarShift(exact=false)` | `BarShift` | bar whose open <= t (binary search on the newest-first times); -1 = older than the history |
| `StepUp HtfOf TfName DirStd DirUp DirL15Top DirTable` | same names | TF in seconds; MT5-only TFs map like `InpExtraTF` (M2-M4 -> M15, H2/H3 -> D1 ...) |
| `Rng Body Basing CDir Emotional` | same | `Emotional(i)` reads `ATR(i + 1)` |
| `SwingAt FindTrap` | same | returns `[level, trapBar, crowded]` instead of reference parameters |
| `Detect(s, tf, out, draw)` + `Reject` | `Detect(s, wantRej, rej)` | rejected candidates are returned as records; the glue draws them |
| `FrLow FrHigh ZigZag AddPiv` | `FrLow FrHigh ZigZag` | ZigZag returns `[pvBar, pvP, pvT]`, oldest first |
| `LineAt FitAnchor RemovedAt AddTL Confirmed TooFlat` | same | FitAnchor returns `[anchor, slope]` |
| `Trendlines(s, tf)` compute part + the channel block | `Trendlines(s)` -> `TLCtx` | `tl`, `upOn ... dnW` (MQL `gUp* gDn*`), newest index per direction |
| `Trendlines` drawing loop, `RefineOnChart`, `ChartBarIn`, `RegTL` | `tlPlan`, `RefineOnChart`, `ChartBarIn` -> `TLDraw` records | same keep rule, same `InpTLHistory`, same refine and break-end logic |
| `TLPrice DedupeTL` | same | marks `alive = false` instead of `ObjectDelete` |
| `TLBias StructureNow CrossNeeded NearTrendline Overextended` | same | the MQL globals `gUp* / gHUp* / gHTF` live in `St` (`g.tlc`, `g.htl`, `g.htf`, `g.H`) |
| `Qualify ZoneName TooSmall MetalOrOil ZoneNotes` | same | ZoneNotes returns `[text, verdict, shortWhy, grade, np, nm, nc, en, sl, tp, rr]` (MQL `gN*` exports) |
| `DrawZones` selection + trap + notes | `ZoneSelect` + the picks loop in `RunAll` | same filters, same "nearest first" order |
| `FracUp FracDn HtfTrend Curve` | same | |
| `DirRow drRow ... gWowPx` globals | `Dir` object | |
| `DirCrossBar DirRajaRemoved DirFreshAt DirRajaStrong DirEvalTF DirCurve DirCurveAt DirCurveWord DirRowDetail DirRowLine DirCombine DirOrigin DirWOW DirRun` | same | each Ser's Trendlines / Detect is computed once (`Ctx` cache); MQL recomputes it on the same data, with the same result |
| `V2Hide V2MergeSelect V2MergePrepare` | `V2Hide ZoneSelect V2MergePrepare` | |
| `DnaFrac DnaRmOpp DnaTests DnaMinFromOpen DnaCompute LensW LensRun` | same | the MQL per-zone cache (dcKey) is left out; it only stores the same values |
| `V2TagText V2Em V2Room V2YN` | same | tag without calibration: `A \| K+ S8 R:ARR B7 \| C78` |
| `Redraw()` | `RunAll()` + glue | same order: HtfTrend, Detect, HTF lines (top level first) + TLBias, chart lines, DedupeTL, Qualify, DirRun, HTF band, merge, DrawZones, V2Zones, Panel |
| `Panel DrawCompact DrawDirBox` | the plan part of `RunAll` + one `table` | same rows and texts |
| `MarkEmotional` | `plotshape` on the last 200 closed candles | same rule: range > InpEmoATR x ATR(i+1) |
| `CheckTouch V2CheckAlerts` | the per-tick block after the run | `alert()` + `alertcondition()` |
| `Trendlines` break alert, `DirAlert V2BreakAlerts V2WowAlert` | the alert block inside the run | same keys (stored in a `varip` string) |

## Deliberate differences

- **Bid / ask.** Pine has none. Price = `close`, spread = `TvSpreadPts` (default 0). Plan entries, stops and R:R match MT5 only when you enter your broker's spread there. At 0, buy entries sit exactly at the proximal.
- **Redraw moment.** The run happens at the candle close, with a synthetic bar 0, instead of at the first tick of the next candle. On a gap (the weekend open), MT5's bar 0 opens at the gap price and at the real new bar time, while the port uses the last close and `time_close`. That only moves the right end of the extended lines and boxes, plus DedupeTL's comparison point `cT(0)`, which can rarely keep the other one of two overlapping lines. This lasts until the first candle after the gap closes.
- **History depth.** MT5 reads the whole chart (often 100k bars). Pine reads at most 5000 chart bars (`TvHistory`, the `max_bars_back` limit). Only two things can reach further: the DNA all-time-high check (InpATHBars 5000 bars back from the base) and RefineOnChart on very old HTF pivots. When the chart history does not reach a pivot, both MT5 and Pine draw the unrefined HTF line.
- **HTF data source.** TradingView's own HTF candles are used (D1 sessions 17:00 New York for FX, the W1 week starting Monday). MT5 uses its broker's server-time candles. On brokers whose server day is not New-York-close aligned, the D1 / W1 candles themselves differ, and every HTF result can differ with them.
- **3M / 6M / 12M ATR.** Wilder ATR on TradingView's native bars. MT5 builds the buckets from at most 1500 MN1 bars and drops a partial first bucket. Wilder converges, so the values match after the first few dozen buckets.
- **Ties in iHighest / iLowest.** On exactly equal highs / lows the newer bar is taken, the same choice as the core's own `SHighest` for virtual TFs.
- **Click box.** Pine has no clicks. The MT5 click box (GRADE & TRADE, PLAN, WHY, DRILLS, DIRECTION, MENTORS, DNA, PLANS) is the tooltip of the zone name label and of the tag. Hover over them to see it. There is no collapse button; the panel and Direction box are one table.
- **Drawing style.** TradingView draws boxes over the candles, so the zone fills are semi-transparent (`TvFillTransp`). Emotional candles show as small crosses (plotshape) instead of the Wingdings star. Lines have no hover tooltip (Pine lines cannot have one); the HTF line label carries it.
- **OBJPROP_TIMEFRAMES (VisUpTo).** Pine objects belong to the chart they are on, so this does not apply.
- **Halfway alert filters.** The halfway alert does not run the v2 alert filters (`V2HalfwayOk`). All filters are off by default, so the default behaviour is the same.
- **Calibration.** Not ported (see below), so the tag always ends with the consensus `Cnn`. The MT5 tag shows `3R 64% n212` instead when an `RFX_Calib.csv` file is loaded.

## Not ported (MT5 only)

Zone research and CSV logging (`InpResearch*`, `RsRun`, the ALT detector), RFX_Calib.csv (Pine cannot read files: no History section, no `InpCal*`, no `InpAlertMinHistE`, no calibrated weights), the GV export for ZoneBot, the golden-master object dump, the ZoneBot order notes (`BotNotes`, which reads a file), push and e-mail (TradingView alerts carry the notifications), `InpRedrawOnHTF` (the port runs on every closed candle anyway), `InpCompactPanel=false` (Comment), `InpRichPopup`, `InpClickPlan`, `InpPanelSeeThru`, and the CoreEval export.

## Pine limits and how they are met

| Limit | Use |
|---|---|
| 500 lines / boxes / labels | a few dozen of each: 4 chart zones (box, 2 lines, 2 price tags, name, tag, trap box), 2 HTF zones, up to 3 lines per direction per TF (chart + 4 HTF levels), curve lines, plan lines. Rejected candidates (debug) are capped at 120 |
| 40 `request.*` calls | 14 |
| `max_bars_back` 5000 | the chart Ser reads `[0 .. TvHistory-1]` |
| loop / execution time | the heavy run happens once on load and once per closed candle. The biggest loops are ZigZag (200 x 200 worst case), FitAnchor (50 x 200 per pivot) and DnaCompute's origin scan (1500 bars per drawn zone). If TradingView ever stops with "loop takes too long", lower `InpLookback` or `InpOriginBars`. Neither changes the zones near price on normal charts |

## Verification

TradingView cannot be run here, so the port was checked another way. The Pine core is not re-typed into Python. The real `.pine` source is executed by a small Pine interpreter and compared with an independent Python translation of the MQL. The scripts are in `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/pine/`:

- `mql_ref.py` and `mql_ref_dna.py`: a Python translation of the MQL, made from the `.mqh` / `.mq5` text. It uses Python's own loop style (`range`, early `return`), not the Pine while-loops, so a loop-bound mistake in one shows up as a difference against the other. It covers Detect, FindTrap, ZigZag / FitAnchor / Confirmed / TooFlat / Trendlines (including the channel), the drawing loop with RefineOnChart / ChartBarIn, DedupeTL, TLBias, CrossNeeded / NearTrendline / Overextended, Qualify, TooSmall, ZoneNotes (verdict, grade, counts, plan), FracUp / FracDn / HtfTrend / Curve, the whole Direction engine (DirTable, DirEvalTF, DirCurve, DirCombine, DirWOW), V2Hide and merge overlap, DnaCompute and LensRun (the tag text).
- `pine_interp.py`: an interpreter for the Pine subset the core uses (UDTs, methods, arrays, while / for / switch, tuples). It runs on the AST of the actual `RamanFX_ZoneVision.pine` (parsed with `pynescript`).
- `test_port.py`: makes synthetic FX-like OHLC (24x5, a random walk that switches regimes, with basing and explosive candles; 7 to 30 years per seed). For each check point it builds (a) what MT5 sees at the first tick of candle N: chart bar 0 at its open, and the HTF series aggregated up to that tick with the forming HTF bar partly filled, then runs the MQL reference on it; and (b) what the Pine glue builds at the close of candle N-1: the chart arrays with the synthetic bar 0, and the HTF packs as `f_pack` + `lookahead_on` return them, decoded by the real `serFromPack`. It then runs the real Pine `RunAll` on (b) and compares everything:
  - the decoded series (every bar >= 1, and bar 0's time)
  - the chart zones with every field, including Qualify's `qual` text
  - the zones of every TF and the trendline set of every TF (`dir, a, b, pa, pb, removed, removedBar, conf`)
  - the channel values
  - every drawn line after RefineOnChart and DedupeTL (anchor time / price, end time / price, touch time, alive)
  - gTrend, the HTF bias, the picked zones, ZoneNotes (verdict, grade, counts, entry / SL / TP / R:R), the HTF band, merge overlap
  - the Direction rows (S, T, R, state, side, CP, in-zone, cross bar), the header text, the curve, WOW1
  - the zone tags (`A | K+ S8 R:ARR B7 | C78 | in H4 D`)

Coverage: chart TFs M15, H1, H4 and D1 (D1 runs the virtual 3M / 6M / 12M rows, and H4 runs the "3M n/a: MN used" fallback). The input sets were the defaults plus four variants: Raja cross, Raja removal and the v1 curve; tested / removed zones shown with merge mode 1; DirTable 0 with merge mode 2, side lock, curve filter, TLHistory 5, TLSwing 3 and Lookback 150; DirTable 2 with refine off, TLBias off, BiasSource 1 and WOW on. The check points were random candles plus candles that open a new D1, W1 and MN1 candle (the HTF boundary cases, most of them after a weekend gap).

Result: 28,085 checks. 28,077 are identical. The 8 that differ are all the same thing: one M15 check point right after a weekend gap. There, DedupeTL keeps a different one of two near-identical H1 lines, because it compares the lines at `cT(0)`, which is the known bar-0 time difference after a gap (see Deliberate differences). It lasts until the first candle after the gap closes, when both sides compute on the same bars again. Along the way, the test showed that TradingView's HTF `time_close` (the end of the last session) decides when an HTF candle counts as closed. That is now how `serFromPack` treats it.

Not covered by this test, so check these on TradingView: the Pine compiler itself (types, v6 rules; the file was syntax-parsed with pynescript, and every function is defined before it is used), the runtime behaviour of `request.security` that the pack relies on (arrays from `var` state, `lookahead_on`, `last_bar_time` in the HTF context, `time_close` of W / M bars), and the drawing / alert glue.

## TradingView test checklist (compare with MT5 on the same symbol and TF)

Use the same symbol and timeframe on both (for example EURUSD H1, a broker whose server day ends at 17:00 New York). Wait for a candle to close, and set `TvSpreadPts` to the broker's spread.

1. **Zone prices.** Hover the price tags on the right of each drawn zone. The proximal and distal must match the MT5 tags exactly (`(1.08345)`), and so must the zone name and verdict (for example `Drop Base Rally Demand (PV) | STRONG: ...`). The HTF lavender zones' prices must match too.
2. **Trendline anchors.** For the chart TF lines and each gold HTF line, compare the anchor candle (the first point's time and price) and the touch / end. In MT5, the trend line properties show both points. In TradingView, hover the line ends, or read them in the HTF line's label tooltip and from the candle times. Broken lines must end on the same candle (the first full candle beyond the line). Respected lines must extend 3 candles past the last one.
3. **Bias text.** The panel lines `Bias:`, `why:` (for example `D1 downtrend trendline broken on 2026.10.14`), `Structure:` and the Direction header (`DIRECTION: LONG - REDUCED | sells BLOCKED`) must match. So must the ETF / ITF / HTF / +1 rows (`HTF D1  CHANGED UP  T+1 S-1 R2  curve 31%`) and the zone tags (`A | K+ S8 R:ARR B7 | C78`).

If 1 matches but 2 does not, check that the HTF candles are the same (point 4 under Deliberate differences). If the HTF candles differ, the HTF lines will differ too.
