# RamanFX Malaysian SNR indicator (MT5) v1.00

File: `public/tools/RamanFX_MalaysianSNR.mq5` (standalone, no include file). Preset: `public/tools/MSNR_Default.set`.
Spec: `docs/books/notes/snr1.md`, `docs/books/notes/snr2.md` and `docs/books/Bystra_and_Malaysian_SNR_Guide.md` (sections 3, 6, 7.1, 7.2, 7.4, 7.6).

This is a chart engine for the Malaysian SNR Strategy 2.0 (Pitchou.FX). It **never trades**. The risk plan is display only. The book shows no backtest (see Red flags in the guide), so treat every signal as something to test. Research mode is there for that.

## Install

1. MT5: File → Open Data Folder → MQL5 → Indicators. Put `RamanFX_MalaysianSNR.mq5` there.
2. Open it in MetaEditor (F4), press F7. It must say 0 errors.
3. Drag it onto a chart. XAUUSD M15 or H1 is a good start. Inputs → Load → `MSNR_Default.set`.
4. The first load needs a few seconds while MT5 downloads MN, W1, D1, H4, H1, M30, M15 and M5 history. The panel says "Data: loading ..." until then. It computes with what it has after 15 seconds.

## How it works, step by step

Everything runs on **closed candles only**, on each timeframe's own data (`CopyRates` per TF, cached). A full recalculation runs only when a new candle opens on one of the TFs in use. The chart TF does not matter: the breakout and entry TFs come from the map.

1. **Levels** on MN, W1, D1, H4, H1 (and the chart TF when it is M30 or M15).
2. **Touch events**: the first bar of the level TF that reaches a level while it is fresh.
3. **Breakout search** on the mapped lower TF: the touch bar, the external reference, a strong body close beyond it, the QM check and the rejection close.
4. **Storylines** per level TF, built from the valid breakouts in time order.
5. **QM ladder** of each storyline (RBS/SBR, LS, GAP, APEX, ERS, then C-RBS / C.APEX / C-GAP for each continuation breakout).
6. **Setups**: price comes back to a ladder level.
7. **Entry confirmations** on the entry TFs (M5 / M15), then a **risk plan**.

## Book rule → code

| Book rule (page) | Code | Notes |
|---|---|---|
| A-shape = bull candle then bear candle, V = bear then bull, Gap = 2 same-colour candles (p17-22) | `PairKind`, `BuildLevels` | One level per candle pair. Dojis make no level. |
| Level at the body junction / line-chart turn (p20-24) | `Junc`, input `InpJunction` | Default: close of the 1st candle (notes canonical). Options: open of the 2nd, or the average. |
| Support when price is above, resistance when below (p17-19) | `side` / role in tooltips | The role shown follows the current price. |
| Fresh = never touched by a wick; a body break makes it fresh again (p23-25, p200) | `BuildLevels` state walk; `InpBreakMode` | A wick touch (range reaches the price) = unfresh. A close on the other side = body break → fresh again, role flipped, touch and use counts reset. |
| Scan starts after the pattern (guide 7.1: bars j > i+1) | `InpFreshSkip = 1` | The bar right after the pattern cannot unfresh the level. |
| CC: the candle after the level pointing the level's way keeps an unfresh level valid (p96, p139) | `InpCCBar = 2`, `InpCCKeeps` | The CC bar (i+2, notes canonical; i+1 as an option) with the right colour does not unfresh the level. It never produces a touch event, because its colour is only known at its close (no look-ahead). |
| Level usable twice: CC, then touch + breakout (p139) | `uses`, `InpMaxUses = 2` | Shown in the tooltip ("uses 1 of 2"). |
| Trendlines through 2+ A or V points on closes, "don't force them" (p28, p115-118) | `BuildTLsDir` | A and V points = line-chart pivots (`InpTLPivot` closes each side). Anchor 1 is the nearest earlier pivot that is higher (falling line) or lower (rising line), with no close cutting the line. One line per new pivot. |
| Up to 5 touches, the 3rd strongest, 4th and 5th need a confirmed breakout (p139) | `touches`, `InpTLMaxTouches` | Anchors count as touches 1 and 2. Touches 3-5 produce events. The line is dead after touch 5 or a close through it. |
| Breakout = strong body close beyond, must form a QM (p34-37) | `FindBO`, `QMParts`, `InpStrongBody`, `InpRequireQM` | Strong = body / range ≥ 0.50 (the book gives no number). Optional body ≥ x ATR. QM bullish: L (V before H) > lowest close after H. Bearish is the mirror. |
| On SNR levels only EXTERNAL breakouts: break of the last A / V formed before the touch (p37-44, p72-79) | `FindBO` (`pA[tb-1]` / `pV[tb-1]`) | Swings after the touch are ignored. |
| On trendlines a QM after the touch is fine (p74-75) | `FindBO` (`allowInternal` for trendlines) | Reference = newest A / V before the breakout bar. |
| Rare case: internal breaks on 4H / 1H / 30M / 15M levels (p126) | `InpLtfInternal` (off) | |
| Rare early breakout on the next higher TF (p121-123) | `InpEarlyBO` (off) | M → W, W → D, D → H4. |
| Rejection close: MN / W none, D / 4H / 30M / 15M own close, **1H needs the 4H close** (p93) | `RejSlot`, `InpRejGate` | If the breakout comes before the rejection candle closes, the signal fires at that close, if price is still beyond the reference. A close through the level = no rejection. |
| TF map M→D, W→4H, D→1H, 4H→1H/30M/15M, 1H→30M/15M, 30M→5M, 15M→1M (p99, p114) | `InpBoMap` (editable string), `ParseMap` | For several TFs the earliest valid breakout wins ("act on the first valid QM", p379). |
| Level fails when its TF closes through it | `failT` in `FindBO` | A breakout signalled after that close is rejected (status `broken`). |
| Classic storyline = fresh level + rejection + breakout (p210-236) | `BuildStories` (type Classic, Mini Classic on H4 and below) | |
| Advanced storyline = trendline + breakout, no rejection step (p237-266) | `BuildStories` (type Advanced) | |
| Classic + Advanced together; Classic priority (p267-290) | merge window `InpMergeBars` | Same TF, same direction, within N breakout bars = one storyline of type Classic+Advanced. |
| Continuation storyline (p291-297); continuation breakout without QM (p179) | `cont`, `noQM` | A same-direction breakout while a storyline is active starts a continuation storyline. Without a QM it is accepted only in that case. |
| Three parts: Start / Middle / End (p334-337) | `StoryPart`, `InpMidFrom`, `InpEndFrom` | The book gives no threshold. Here: fraction of the way from the start price to the target (0.33 / 0.75). Without a target: Start until the first continuation breakout, then Middle. |
| Storyline end: target reached | `StoryEnd` | Also ends on an opposite storyline, a close beyond the APEX (QM failed, p405) or after `InpStoryMaxBars`. |
| MTF alignment, D leads W leads M (p313-323); avoid trading against it (p305, p317) | `AlignTxt`, `AlignedAt` | Panel line "Align" and the ✓ / ✗ in signal cards. Display only, not a filter. |
| Part-1 levels Apex, LS, GAP, SBR/RBS (p368-370); RBS = bullish, SBR = bearish | `BuildLadders` | p368 says SBR for bullish; treated as a typo (p396, p399 and the diagrams agree on RBS = bullish). |
| ERS = last mini V / A before the breakout (p371, p401) | `QMParts` (`ers`) | |
| Continuation levels C.APEX, GAP, RBS/SBR (p369-370, p489-493) | `BuildLadders` continuation scan | C.APEX = the pullback extreme (wick) before each continuation breakout (the diagram reading; the text says "highest point in a retracement" for a bullish trend). |
| GAP QMS alignment: 4H gap needs 1H gap + 1H A/V + 30M A/V; 1H gap needs 30M + 15M A/V (p409-412) | `GapAligned`, `InpGapNeedsAlign` | An unaligned GAP is drawn dotted and gets no setup. |
| No GAP setups for 30M QM and below (p514) | `BuildLadders` | |
| Setup catalogue (p381-388) | `BuildSetups`, `SetupFlags` | Detected: RBS/SBR, LS, GAP, APEX, ERS, Double Apex (two swing extremes within `InpEqualTolPips`), QM-CC (apex candle wick ≥ `InpSpikeWick` × range, neighbours clearly higher / lower), QMC (an alive trendline of the same direction within the proximity of the LS), QM-to-QM (LS setup confirmed by a mini QM), C-RBS / C.APEX / C-GAP. |
| Manual setups | panel "Manual setups [+]" | MISS, Double TL-SBR, SNRC1, SNRC2, Reversal TL QM Failed, QM Failed QM, Dual-side rejection, Refinement, stacked entries. These are drawn-only in the book; the panel lists a one-line hint each. |
| Confirmations (p413-421) | `ConfEMA`, `ConfRej`, `ConfGap`, `ConfTL`, `ConfQM` | EMA: engulfing candle (body covers the previous opposite body) closes across EMA(9, close) on M5 (main trigger). Rejection: M15 wick through, close back, buy = bearish candle (p414-418, the diagram version). Breaking gap: engulfing breaks the newest opposite gap, entry on the pullback to it. Micro TL: line through the last two A (buy) / V (sell) points on M5 broken by an engulfing close. Mini QM: M5 QM, entry on the pullback to its LS. |
| Proximity: the confirmation closest to the level is best (p432) | `InpProxPips` | The confirmation candle (or the one before) must be within N pips of the level. |
| SL ≥ 30 pips or beyond the confirmation extreme (p435, p547) | `BuildSetups` | SL distance = max(min stop, entry − (extreme − buffer)). Gold pip 0.10 (30 pips = 3.00), JPY 0.01 (0.30), other FX 10 points, indices / CFDs = `InpIndexPoint` with `InpIndexMinStop` points (US30 example 50). |
| TP = next fresh level / TL of the storyline TF; ladder D → W → M when aligned (p436-437) | `PlanTP`, `TargetOn`, `InpTPLadder` | Fresh state is replayed at the signal time (no look-ahead). Targets nearer than `InpTPMinR` × stop are skipped. Fixed `InpFallbackRR` when nothing lies ahead. |
| Continuation TP fixed 1:2 / 1:3 (p549-550) | `InpContTP`, `InpContRR = 3` | |
| Risk (p611-617) | `LotsFor` | Lots = balance × risk% ÷ (stop distance ÷ tick size × tick value per lot), rounded down to the volume step, spread added. **The book's own worked lot examples are wrong** and its personal-account phases risk 5-30% per trade; default here is 1%. |

## Book contradictions and how they were resolved

| # | Contradiction | Choice in code | Alternative as input |
|---|---|---|---|
| 1 | External only (p74) vs "after the touch can count" on LTF levels (p126) | External only | `InpLtfInternal` |
| 2 | Weekly / Daily Advanced breakout TF: text (p250-251, p258-259) vs diagrams and summary (p239, p252, p260, p270) | Diagrams: W TL → 4H, D TL → 1H (notes canonical) | Edit `InpBoMap` |
| 3 | 3rd TL touch best "for a breakout" (p139) vs "for entries" (p192) | Touch number is logged and shown; touches 3-5 all produce events | — |
| 4 | SBR / RBS swapped on p368 | RBS = bullish, SBR = bearish | — |
| 5 | C.APEX: text (highest point of a retracement) vs diagram (pullback lows) | Diagram: the pullback extreme against the trend | — |
| 6 | Candle rejection: text p416 (closes above) vs diagrams p418 / p536 (wick through, close back) | Diagram | `InpRejOppColour` for the colour rule |
| 7 | CC = i+2 (notes) or i+1 (count from the 1st pattern candle) | i+2 | `InpCCBar = 1` |
| 8 | Gap level price: close of the 1st candle or open of the 2nd | Close of the 1st | `InpJunction` |
| 9 | Body break: close beyond (notes "body crosses") vs whole body beyond (guide 7.1 literal) | Close beyond | `InpBreakMode` |
| 10 | Rejection colour: "colour does not matter" for HTF rejections (p96) vs opposite colour for entry rejections (p414) | No colour rule for the HTF rejection gate; opposite colour for the entry confirmation | `InpRejOppColour` |
| 11 | Risk: "NEVER exceed 1%" vs 5-30% examples (p611-617) | 1% default, correct formula | `InpRiskPct` |

## Every object explains itself

**Hover.** Every level, trendline, storyline mark, QM level, setup label, entry arrow and plan line has a tooltip with: what it is (for example "Daily A-shape level (resistance) 2345.10"), why it was drawn (the two candles with time and OHLC, the junction rule), its state (fresh / unfresh: wick touched at …, fresh again: body broke at …, CC, uses left), the TF map ("Daily level → watch H1 for an EXTERNAL QM breakout"), the rejection rule, what to do next, what invalidates it, and the book pages. Signals and setups list every condition with ✓ / ✗. Tooltips are cut at `InpTipMax` characters with "… click for the full card".

**Click.** Clicking an object opens a detail card in the top-left corner (one card at a time, away from the latest candles). It holds the full explanation plus "Story so far": the storyline on every TF (direction, type, part, start, target), the D / W / M alignment, the nearest fresh levels above and below on that TF, the open setup, and the last signal with its risk plan. The card text is built only on click. The clicked object's source candles get a gold box for `InpHighlightSec` seconds. Click `[x]`, empty chart, or another object to close or switch. The card refreshes after each recalculation while it is open. Long cards are cut to the chart height.

Fonts: the panel and card use `InpCardFont` (default "Segoe UI Symbol", which has the ✓ / ✗ glyphs). If the marks show as boxes, set `InpUnicodeMarks = false` to get [+] / [-].

## Panel

Top-right, no background (it does not hide candles), click the header to fold. Rows:
- One row per storyline TF: direction, type (Cls / Adv / C+A), continuation, part, target, start date.
- Align: D / W / M directions and whether D led W led M.
- Nearest fresh level above and below per level TF, with the distance in pips.
- Watch: touched levels still waiting for the breakout or the rejection close, with the exact close needed (for example "H1 close > 2331.20 (ext A)").
- Open setups (price at a QM level, waiting for a confirmation).
- Last entry signal and its plan (SL, TP, R:R, lots).
- Manual setups [+]: hints for the discretionary setups.
- Research result line when research ran.

## Alerts

Storyline started, setup armed (off by default), entry signal. Each fires once per signal key. Nothing fires for signals that already exist at load or that are found late (older than 3 bars of their TF). Popup, push and sound are separate inputs. Mini storylines (H4 / H1 / chart TF) alert only with `InpAlertMini`.

## Inputs (groups)

1. **Levels**: TFs on / off, A / V / Gap on / off, junction rule, body-break rule, fresh skip, CC bar, CC keeps fresh, max uses, max age (bars of the level TF, default 300), levels drawn per TF and side (3), unfresh on / off, merge distance, line chart.
2. **Trendlines**: on / off per TF (MN, W1, D1; H4 off), pivot strength 2, min bars between anchors, max touches 5, tolerance 0.10 ATR, life 300 bars, lines drawn per TF and side.
3. **Breakout engine**: TF map string, swing strength (0 = the book's 2-candle A / V), strong body 0.50, body ATR filter, QM required, rejection gate, p126 internal option, p121 early option, max bars after the touch (120).
4. **Storylines**: Classic / Advanced on / off, part thresholds 0.33 / 0.75, merge window, continuation breakouts tracked, max bars, marks, ladder drawing.
5. **QMS setups**: RBS/SBR, LS, GAP, APEX, ERS, continuation setups on / off, GAP alignment rule, wait time, proximity 10 pips, setup break distance 20 pips, Double Apex tolerance 5 pips, QM-CC spike wick 0.60.
6. **Entry confirmations**: entry TF (M5), rejection TF (M15), mini-QM TF (M5), each confirmation on / off, EMA length 9, opposite-colour rule, window 48 bars, pullback 12 bars, swing look-back 10, micro-TL look-back 36.
7. **Risk plan**: risk 1%, balance or equity, min stop 30 pips, index min stop 50 points, index point size, pip override, SL buffer 1 pip, spread in the lot size, TP ladder, continuation TP mode and 3R, fallback 3R, min target distance 1R, plan lines.
8. **Panel / tooltips / card**: position, font size, font, marks, tooltip length, card width, highlight time, colours (MN purple, W red, D green as in the book's charts; H4 orange, H1 blue, LTF grey).
9. **Alerts**: per type, mini storylines, popup / push / sound, sound file.
10. **Research**: on / off, from / to, outcome TF (M5), horizon (4000 bars), spread on / off, touches and setups rows, max bars.
11. **Data**: bars loaded per TF (MN 300, W1 600, D1 1200, H4 2500, H1 3000, M30 / M15 / M5 / M1 3000). Lower them if the chart lags.

## Research mode

Set `InpResearch = true`, `InpRsFrom`, `InpRsTo`. Set Tools → Options → Charts → Max bars in chart = Unlimited. At load the indicator downloads the range (plus a warm-up of `max(level age, TL life) + 100` bars per TF and the outcome horizon after the end), runs the same engine, writes the CSV and then goes back to live mode. The file is `Terminal\Common\Files\RFX_MSNR_<symbol>_<from>_<to>.csv` (dates as yyyymmdd). The Journal prints the row count and the time it took.

**No look-ahead.** Every snapshot column is built from candles closed by `event_time`: level freshness and uses are replayed from the state changes before that time, trendlines exist only from the close of their 2nd anchor's confirmation, storylines count only if they started before the event, and the target is the next level that was fresh at that moment. The CC bar never produces an event. The `bo_*` columns of **touch** rows are outcomes (what happened after the touch). For breakout, setup and entry rows they are part of the snapshot.

**Outcome.** Walked forward on the outcome TF from the bar after the fill. Wick result: SL and TP both by wick; if both are hit in one bar it counts as SL (`same_bar = 1`). Close result: SL only on a close beyond it, TP by wick (limit). Spread: buys fill at price + spread and exit on the bid; sells fill on the bid and exit at the ask (bid + bar spread).

Plans per row type:
- **touch**: limit at the level in the rejection direction, SL = min stop, TP = next fresh level of the level TF (or fixed R).
- **breakout**: market at the signal close, SL beyond the APEX (min stop at least), TP = storyline target (or the next level / fixed R).
- **setup**: limit at the QM level, SL beyond its invalidation price (APEX / C.APEX, min stop at least), TP as for entries.
- **entry**: the plan of the signal.

### CSV columns

S = snapshot (known at `event_time`), O = outcome.

| Column | | Meaning |
|---|---|---|
| row | S | Running row number |
| type | S | touch, breakout, setup, entry |
| symbol | S | Chart symbol |
| event_time | S | When the event is known (server time) |
| level_tf | S | TF of the level / trendline (= storyline TF) |
| level_kind | S | A, V, GAP+, GAP-, TL+ (rising), TL- (falling) |
| level_price | S | Level price (trendline: value at the touch bar) |
| level_formed | S | Open time of the 1st candle of the pair / 1st trendline anchor |
| level_age_bars | S | Level TF bars from formation to the touch |
| cc | S | 1 = confirmation candle present |
| uses_before | S | Uses counted before this touch |
| breaks_before | S | Body breaks (refreshes) before this touch |
| tl_touch_no | S | Trendline touch number (3 = strongest), 0 for levels |
| dir | S | +1 bullish idea, −1 bearish |
| touch_tf | S | Breakout TF used |
| touch_time | S | First breakout-TF bar that reached the level |
| bo_status | O for touch rows, S otherwise | valid, wait_bo, wait_rej, expired, broken, rejfail, noqm, nodata, noref, notouch |
| ref_price | O / S | The A / V the breakout had to close beyond |
| external | O / S | 1 = reference formed before the touch |
| bo_time | O / S | Close time of the breakout candle |
| body_ratio | O / S | Body / range of the breakout candle |
| qm | O / S | 1 = QM formed |
| ls, apex | O / S | Left shoulder and apex (wick extreme) |
| rej_rule | S | none, own TF, or H4 (1H levels) |
| rej_ok | O / S | 1 ok, 0 not needed, −1 failed, 2 pending |
| signal_time | O / S | Storyline start (breakout and rejection done) |
| early | O / S | 1 = breakout on the next higher TF |
| story_type | S | classic, advanced, classic+advanced |
| story_cont | S | 1 = continuation storyline |
| story_part | S | 1 start, 2 middle, 3 end at `event_time` |
| dir_mn, dir_w1, dir_d1, dir_h4, dir_h1 | S | Active storyline direction per TF at the time |
| aligned | S | 1 = D, W and MN storylines share one direction |
| lead_ok | S | 1 = aligned and started in the order D, then W, then MN |
| setup_kind | S | RBS, SBR, LS, GAP, APEX, ERS, C-RBS, C-SBR, C.APEX, C-GAP |
| setup_flags | S | DBLAPEX, QMCC, QMC, QM2QM, GAPNOALIGN |
| conf, conf_tf | S | Confirmation (REJ, GAP, TL, QM, EMA) and its TF |
| entry, sl, tp | S | The plan (price units) |
| tp_src | S | Level TF + kind (for example D1_A), D1_TL, or FIXED |
| sl_pips | S | Stop distance in pips |
| rr | S | Planned reward : risk |
| lots | S | Lot size for `InpRiskPct` (current tick value, so only roughly right for old rows) |
| spread_pts | S | Spread of the fill bar in points |
| res_wick | O | tp, sl, open, nodata |
| r_wick | O | Result in R (spread included); open = marked to the last close |
| bars_wick | O | Outcome-TF bars to the result |
| res_close | O | Close-stop variant: SL on a close, TP by wick |
| r_close | O | Result in R of the close variant (can be worse than −1R) |
| bars_close | O | Bars to the close-variant result |
| mfe_r, mae_r | O | Max favourable / adverse excursion in R until the wick result (or the horizon) |
| same_bar | O | 1 = SL and TP in the same bar |
| end_time | O | Time of the wick result |

## Known limitations

- **No compiler was available** when this was written. The code avoids C++-only syntax and was checked with a bracket / identifier script, but the first MetaEditor compile may still show warnings. See "Compile watch list" below.
- Every candle pair makes a level, so there are many levels. The drawing keeps the nearest 3 per TF and side. The engine uses all of them (that is the book's definition). If the D1 targets look too near, raise `InpTPMinR`.
- "Strong body", the part thresholds, the proximity distance, the trendline tolerance and the QM-CC / Double Apex tolerances are **not in the book**. They are inputs with stated defaults.
- Trendlines are automatic (one line per new pivot, nearest valid anchor). The book draws them by hand ("don't force them") and types them (Reversal, QM, Outer, Break & Retest). Types are not classified.
- For an Advanced storyline the "close beyond both the trendline and the A / V" rule (p45) is read as: close beyond the newest A / V, with the line unbroken.
- Freshness of other levels at a time t uses only fully closed bars of their TF. A touch earlier in the still-open HTF candle is seen only at its close.
- Live mode keeps a limited history per TF (group 11). Setups and entries need M5 data, so live entry history covers about 10 days by default. Storylines older than the loaded breakout-TF history are unknown.
- MTF alignment and the higher-TF agreement are shown (✓ / ✗) but do not filter signals. Dual-side rejection and refinement are manual.
- One setup per QM level and one entry per setup (the book allows stacking up to 4 entries, p423).
- The lot size in research rows uses today's tick value.
- M1 data is loaded only when needed (M15 chart levels or `InpQMTF = M1`). M1 research over long ranges is slow.

## Compile watch list (for the first MetaEditor build)

- `CSlot` is a class with public dynamic arrays (`MqlRates r[]` and derived arrays). `CopyRates` and `ArrayResize` on them run inside class methods (`LoadCount`, `LoadRange`, `Alloc`). Element access from outside is `S[s].r[i].close`.
- Structs are simple (numbers, bools, datetimes only), copied with `=` and cleared with `ZeroMemory` on a local first.
- `ERR_HISTORY_NOT_FOUND`, `SYMBOL_TRADE_TICK_VALUE_LOSS`, `SYMBOL_CALC_MODE_FOREX_NO_LEVERAGE` and `SERIES_SYNCHRONIZED` need a recent MT5 build.
- Ternaries on enum values (`ANCHOR_TOP : ANCHOR_BOTTOM`) and on strings only, never on structs.
- `input group` needs MT5 build 2xxx or later.
- Expected warnings at most: implicit `long` → `int` in a few `ChartGetInteger` / `MathMax` spots.
