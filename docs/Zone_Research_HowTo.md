# Zone Research: how to collect the data in the MT5 Strategy Tester

`public/tools/RamanFX_ZoneVision.mq5` has a **Zone research** mode. In the Strategy Tester it logs **every zone it creates**: why it was made, and what price did afterwards. It writes one CSV row per zone. `tools/zone_research/analyze.py` turns one or more of these CSVs into `docs/Zone_Research_Report.md` and, from version 2.00, into the calibration table `RFX_Calib.csv` that the indicator reads to show **"Historically: 64% reached 3R (n=212)"** on every zone.

**Version 2.00 adds** (all on by default with `InpResearchDNA = true`; section 5 lists the columns):

- the whole Zone DNA, the four mentor lens scores (Kevin, Seiden, Raja, Baker), the consensus and verdict, and the Direction engine's readout, at creation;
- a second snapshot of all of that **at the first touch** (`s1_*` columns), which is what the calibration uses, because the decision is made at the touch;
- three extra entry models for touch 1 (front, mid, Baker deep) and extra outcomes (bars to 1R / 3R, MAE, WOW1 / HTF / run-out targets, Raja's removal rule).

The v1 columns keep their names, order and values. The v2 columns are appended, so an older analyzer still reads the file.

> **Quick path:** section 6 is the full 24-run workflow (8 symbols x 3 periods), from the tester settings to installing `RFX_Calib.csv`.

Zones are detected with the **same functions the chart uses**: `Detect`, `Trendlines`, `TLBias`, `Qualify`, `ZoneNotes` and `FindTrap`. The research pass borrows the chart's detection state, treats each research timeframe as the chart timeframe, draws nothing and alerts nothing, then restores the state. The zone logic itself is unchanged.

---

## 1. Run the test

1. Copy `RamanFX_ZoneVision.mq5` **and `RFX_ZoneCore.mqh`** into the same `MQL5\Indicators\` folder and compile `RamanFX_ZoneVision.mq5` in MetaEditor (F7).
2. Open the Strategy Tester (Ctrl+R) and set these options.
   - **Program type: Indicator.** Pick it in the top-left drop-down, then choose `RamanFX_ZoneVision`.
   - **Symbol**: the pair to study, e.g. EURUSD. Run one test per symbol.
   - **Timeframe (chart period)**: any. M15 is a good choice. The research timeframes come from the `InpResearchTFs` input, not from this setting. The chart period only sets how often the tester calls the indicator and what the visual chart shows.
   - **Dates**: a custom period, e.g. 6 to 12 months. Use one period to find thresholds and a different one to check them (out of sample).
   - **Modelling**: "1 minute OHLC" is the recommended setting. It is much faster, and the research works on **closed candles only**, so ticks add nothing. "Every tick based on real ticks" also works but is slower. Do not use "Open prices only": the M15 / H1 / H4 candles then have no inside detail, and the HTF series are thin.
   - **Visual mode**: in MT5, **indicators can only be tested in visual mode**. With an indicator selected, the tester always opens the visual window. Non-visual and optimisation runs exist only for Expert Advisors. Drag the speed slider to the maximum.
3. On the **Inputs** tab, find the group `-- Zone research (tester) --`.

| Input | Default | Meaning |
|---|---|---|
| `InpResearch` | false | Turns research on outside the tester. **Inside the Strategy Tester it is always on**, so you do not need to change it |
| `InpResearchTFs` | `M15,H1,H4` | Timeframes analysed, whatever the chart timeframe is. Accepted: M1..M30, H1..H12, D1, W1, MN, and (v2) `3M`, `6M`, `12M`, built from monthly bars. The v2 workflow uses `M15,H1,H4,D1` |
| `InpResearchAlt` | true | Also logs the ALT detector, tagged `detector=ALT` (see section 4) |
| `InpResearchMaxBars` | 200 | Follow-up horizon, in candles of the zone's own timeframe |
| `InpResearchFile` | `RFX_ZoneResearch` | CSV name prefix |
| `InpResearchDraw` | true | Set it to **false** for a much faster test. Nothing is drawn on the visual chart, but the data is identical |
| `InpResearchGMT` | 2 | Server time minus GMT, in hours. Used for the `session` and (v2) `min_from_open` columns. Most brokers use 2 in winter and 3 in summer |
| `InpResearchDNA` | true | (v2, group `-- v2 Calibration + research --`) Also log DNA, lens scores, Direction, the touch-1 snapshot and the extra entry models. `false` = v1 columns only, which is faster |

   Leave every other input as you trade it, especially the "Zone rules" group. Those inputs change the zones, and the CSV records what the zones looked like under them.
4. Press **Start**. The Journal shows `ZoneVision research mode ON` and `writing Terminal\Common\Files\...`.
5. Let the test run to the end, or press Stop. On deinit, the indicator writes every zone still being followed (`status=test_end`) and renames the file.

## 2. Where the CSV lands

The file goes to the **common** data folder, which is shared by all terminals and by the local tester agents, not to the agent's sandbox:

`%APPDATA%\MetaQuotes\Terminal\Common\Files\RFX_ZoneResearch_<symbol>_<from>_<to>.csv`

To find it: in MT5 choose File > Open Data Folder, go up two levels to `...\MetaQuotes\Terminal\`, then open `Common\Files`.

- While the test runs, the file is called `..._<from>_running.csv`. Rows are flushed after every candle that resolved a zone, so it is readable mid-test.
- If you only find the `_running.csv` (for example, the visual window was closed before deinit), use it. It is missing only the zones that were still open at the end.
- Running the same symbol from the same start date again overwrites the earlier file.
- Use local agents only. With cloud or remote agents, `FILE_COMMON` writes land on the remote machine.

## 3. Send it back and analyse (v1 report)

Zip the CSV(s) and send them, or attach them in the chat. To analyse them yourself:

```
python3 tools/zone_research/analyze.py path/to/RFX_ZoneResearch_EURUSD_20240101_20241231.csv [more files or a folder]
    --out docs/Zone_Research_Report.md   # default
    --stop wick|close                    # touch-1 stop model (default wick)
    --min-n 30                           # minimum samples for a recommendation
    --detector ZV|ALT|all                # default all
    --only-drawn                         # only zones ZoneVision would actually draw
```

The v2 options are in section 6, step 7. Only the Python 3 standard library is needed. The report covers:

- counts per detector, TF, type and pattern;
- touch rate, respect rate (1R before the stop) and hit rates for 1-5R;
- MFE average and median;
- expectancy for 1R-5R and for the opposing-zone target, with the best target per TF;
- results by touch number;
- ZV vs ALT;
- respect and expectancy by bins of every feature;
- single-feature thresholds that maximise expectancy (at least 30 zones each).

---

## 4. What is measured

### Zone creation (no look-ahead)

- **ZV**: a zone is logged on the closed candle that completes it, i.e. its stay-away candle (shift 1). That is the first moment the chart could show it. Every zone `Detect()` returns is logged, including zones the chart would hide (not in the chain, too small, ...). `would_draw` says whether the chart would draw it.
- **ALT**: re-implements the idea of the user's favourite third-party indicator, II_SupDem, in our own code. Nothing from it is copied (see `docs/Indicator_Comparison.md` section 2).
  - A classic ZigZag (depth 3, deviation 2 pips, backstep 2) runs on closed candles. A turn counts only once a newer turn exists, because the newest turn can still move.
  - Distal = the turn candle's wick. Proximal = the nearest of the turn's body edge and the neighbours' wick and body edges.
  - The zone is logged when a later candle trades fully beyond the proximal (the departure).
  - Turns that were broken before that, or whose wick reaches into an older live ALT zone of the same side, are dropped.
  - `alt_strength` is its look-left STRONG / WEAK test.
  - ALT zones are then judged by the same `Qualify` and `ZoneNotes` as ZV zones, which gives them a ZV verdict and grade too.
- Zones that existed before the test start are not logged. The first candle of each timeframe only sets the start point.

### Trade model for the outcome

- **Entry** when price reaches the proximal. **Stop** at the distal: a wick beyond it fills the stop. **1R = zone height + spread**, where spread is the tester spread at creation.
- **MFE** = the best excursion in R before the stop. On the touch candle only its close counts. A candle that hits the stop never counts its favourable extreme, because the order inside a candle is unknown. Both rules are conservative.
- A touch trade ends at the stop, at max(5R, opposing zone), or at the horizon (`open`).
- 2nd and 3rd touches are new trades. Each one needs a candle fully back outside the proximal after the previous touch trade ended.
- **Broken** = the ZoneVision removal rule: a close beyond the distal, or a normal (not emotional) wick beyond it.
- The zone's row is written when the zone is broken (and no trade is running), after 3 touches, at the horizon, or at test end.
- `t1c_*` columns: touch 1 again, but stopped only by a **close** beyond the distal (the Kevin removal rule). Use `--stop close` to analyse with this model.

### CSV columns

**Create columns**

| Column | Meaning |
|---|---|
| detector | `ZV` (ZoneVision) or `ALT` (ZigZag pivot detector) |
| symbol, tf | Symbol and the zone's timeframe |
| id | detector-tf-D/S-base start (yyyymmddhhmm) |
| created | Open time of the candle after the one that completed the zone (the first moment it is visible) |
| base_start, base_end | First and last base candle. ALT: the turn candle |
| type, pattern | demand / supply; DBR, RBR, RBD, DBD (from the leg-in candle direction) |
| proximal, distal, height, height_pts, height_atr | Zone edges, then height in price, in points and in ATR(14) |
| base_n | Number of base candles (ALT = 1) |
| legin_atr, legout_atr | Range of the leg-in / leg-out candle in ATR |
| leg_ratio | Leg-out range / largest base candle (the `InpMinLegRatio` measure) |
| moveaway_h_create | Move away so far at creation, in zone heights |
| gap | Space under the stay-away candle, as a fraction of the height (the `InpMinGap` measure) |
| emotional | A base or leg candle is emotional (range > `InpEmoATR` x ATR) |
| tested_at_create | ALT only: price came back after the departure but before the turn was confirmed |
| would_draw | ZoneVision would draw it (chain rule, not too small, fresh) |
| verdict, grade, zgrade | ZoneNotes verdict STRONG / OK / WEAK, the plan grade A / B / C, and the structural grade from leg ratio and base |
| score, n_plus, n_minus, n_crit | Score = plus - minus - 2 x critical; the three counts are the ZoneNotes tags |
| tags | All ZoneNotes tags, separated by `\|`. Prefix `+` strength, `-` weakness, `x` deal-breaker |
| alt_strength | ALT look-left strength (STRONG / WEAK) |
| arrival, chain, rm_opp_zone, rm_trendline, new_high_low, rm_prev_high_low, leg2 | Chain flags from `Qualify` |
| too_small, trap, crowded | Smaller than `InpMinSizeVsMedian` x the median zone; liquidity trap in front; sits on an obvious S/R level |
| htf_trend, tl_bias, bias, align | HTF swing trend, HTF trendline-break bias, the bias actually used (`InpTLBias`), and alignment with the zone (+1 with, -1 against, 0 unclear) |
| bigger_trend, bigger_align | Swings of the HTF's own HTF (as in ZoneBot), and alignment with it |
| nested, in_opp_htf | The zone overlaps a live same-side HTF zone / an opposing HTF zone |
| curve | Location in the HTF 100-candle range (0 = low, 100 = high) |
| opp_R | Distance to the nearest opposing zone of the same detector, in R (0 = none) |
| plan_rr | R:R of the ZoneNotes plan (with stop buffer) |
| session, hour, weekday | Session from GMT hour: Asia 0-7, London 7-12, LonNY 12-16, NewYork 16-21, Late 21-24. Hour and weekday are server time |
| atr, spread | ATR(14) of the zone TF and spread at creation |

**Outcome columns**

| Column | Meaning |
|---|---|
| status | `broken`, `touches3`, `horizon` or `test_end` |
| resolved, age_bars | When the row was written, and the zone age in candles of its TF |
| never_touched | 1 = never touched within the horizon |
| runout_h | Move away until the first return, in zone heights |
| broken, broken_time, broken_bars | Whether, when and after how many candles the zone was broken |
| touches | Touch trades started (0 to 3) |
| tN_time, tN_bars | Touch N time and candles since creation |
| tN_depth | Deepest penetration before 1R, as % of the height. Over 100 = through the distal (stopped) |
| tN_mfe | Best R before the stop |
| tN_hit1..tN_hit5, tN_opp | Reached 1-5R / the opposing zone before the stop |
| tN_result | `stop`, `target` (5R or the opposing zone if further) or `open` |
| tN_end_time, tN_end_bars | When the touch trade ended |
| t1c_mfe, t1c_result | Touch 1 with the close-stop model |

### Performance (v1 columns)

Research code runs only when research is on (the tester, or `InpResearch=true`). On a normal chart nothing changes. In the tester:

- each research timeframe is checked once per new candle;
- the full context (HTF trend, trendlines, `Qualify`, notes, nested) is built only on candles where a new zone appears;
- research timeframes never trigger a chart redraw.

With `InpResearchDNA = true` each of those candles also runs the Direction engine on the research timeframe's own stack (for example H1 -> H4 -> D1 -> MN), plus the DNA and the lenses for every new zone and every first touch. Expect a run to take roughly 2-4 times longer. If that is too slow, split the period (section 6) rather than turning the v2 columns off: without them there is nothing to calibrate.

---

## 5. Version 2 columns (appended after `t1c_result`)

### 5.1 At creation: DNA, lenses, Direction

Every DNA feature of `docs/ZoneVision_v2_Spec.md` section 3 that v1 does not already log, then the lens outputs. A name that v1 uses with another meaning gets `c_` (`c_runout_h` = the move away so far at creation; `c_nested` = nested in a fresh ITF / HTF / Higher+1 zone of the Direction stack, within 1 HTF height).

| Group | Columns |
|---|---|
| Base / leg-in / leg-out / gap | `base_rel`, `base_min`, `legin_n`, `legin_spd`, `legout_body`, `legout_n`, `legout_spd`, `legout_rel`, `gap_open`, `gap_away`, `departure` (0-3) |
| Run-out, chain | `c_runout_h`, `runout_atr`, `runout_bars`, `rm_opp_n`, `rm_opp_move`, `ath`, `arrival_raja`, `raja_strong` |
| Tests | `n_tests`, `depth_max`, `depth_1`, `emo_depth`, `depth_grade` (F fresh / S <= 25% / M <= 50% / D <= 75% / V deeper), `ret_next` |
| Location | `c_nested`, `nest_tf`, `nest_pos`, `curve_zone` (Raja curve, proximal to proximal), `curve_bucket` (L / LM / HM / H), `curve_raja`, `opp_htf_R`, `room_R` (99 = nothing opposing in view), `wow_pips`, `origin_ok`, `left_opp_R` |
| Size, time, context | `novice_n`, `height_pips`, `height_vs_med`, `min_from_open`, `cross_needed`, `near_tl`, `overext`, `cp_run`, `impulse`, `stacked` |
| Raja types | `inherit`, `overlap`, `flip`, `out_tl`, `raja_live`, `raja_type` (ARR / WOW / STR / OVL / INH / FLP / OTL / TST / WK) |
| Approach | `appr_bars`, `appr_spd`, `new_opp_way`, `stair`, `appr_prov` (1 = measured to now, no touch yet) |
| Direction | `dir`, `dirq` (0 wait, 1 reduced, 2 full), `st_etf`, `st_itf`, `st_htf`, `st_p1` (state x side: UP 1, TURNING 2, CHANGED 3, PULLBACK 4, RANGE 5, n/a 0; negative = down), `align_dir` (+1 the zone is on the Direction side, -1 against, 0 none) |
| Plan | `stop_atr` |
| Lenses | `kv` (Kevin verdict: WEAK 0, OK 1, STRONG 2), `kg` (grade A 0, B 1, C 2), `sK`, `sS`, `sS_parts` (6 digits: departure, margin, big picture, tests, time, arrival), `sR`, `sB`, `pass_k`, `pass_s`, `pass_r`, `pass_b`, `n_pass`, `cons`, `v2verdict` (A+ / A / B / C / X), `entry_modes` (K x 1000 + S x 100 + R x 10 + B; 0 none, 1 limit / set & forget, 2 confirm, 3 deep entry) |

### 5.2 Snapshot at the first touch (`s1_*`)

Taken on the close of the touch-1 candle (no look-ahead). The zone's own tested / removed state is the one **before** that candle, because the limit order at the proximal is the decision being judged; everything else (the zone list, trendlines, Direction, chain flags re-run with `Qualify`) is as of that close.

| Column | Meaning |
|---|---|
| `s1_ok` | 1 = snapshot taken. 0 = no touch, or the zone could not be found again |
| `s1_lag` | Candles between the touch and the snapshot (0 = normal; > 0 only when the tester skipped candles) |
| `s1_found` | 1 = found in that candle's `Detect`; 0 = the creation zone moved to the current bar numbers (ALT zones, or zones older than `InpLookback`) |
| `s1_time`, `s1_touch_depth` | Touch time; how deep the touch candle went, % of the height (after the entry: describes, never filters) |
| `s1_<every DNA and lens column>` | The same set as 5.1 with the `s1_` prefix, including the ones v1 logs at creation (`s1_chain`, `s1_curve`, `s1_nested`, `s1_verdict`, `s1_align` ...) |

### 5.3 Extra outcomes

| Column | Meaning |
|---|---|
| `t1f_fill`, `t1f_mfe`, `t1f_result` | Front entry, `InpZ3Front` (0.05) x height **before** the proximal (the bot's limit). Fills on the first candle that reaches it after price was fully outside it |
| `t1m_*` | Mid entry, 50% into the zone. Only during the touch-1 trade |
| `t1d_*` | Baker deep entry, 25% of the height inside the zone from the distal. Only during the touch-1 trade |
| `t1_bars_to_1R`, `t1_bars_to_3R` | Candles from touch 1 until the trade first reached 1R / 3R (empty = never) |
| `t1_mae` | Worst R before 1R (the touch candle counts; <= -1 = stopped) |
| `t1_hit_wow1`, `t1_hit_opp_htf`, `t1_hit_runout_ext` | Touch 1 reached WOW1 / the nearest opposing ITF / HTF proximal / the run-out extreme before the stop: 1 / 0; empty = no such target, or the trade ended at 5R / the opposing zone first |
| `broken_raja`, `broken_raja_time` | Raja's removal rule: a close beyond the distal, then the next candle also closing beyond with a body >= `InpRajaBigBody` (0.6) x ATR |

All three models use the same stop as v1 (a wick beyond the distal), the spread in the risk, the same end (5R or the opposing zone, whichever is further, in the model's own R) and the same conservative candle rules. To finish a model trade (or to see Raja's second close), a zone can be followed a little after v1 resolved it. The v1 columns still show v1's own status, time and age.

---

## 6. The v2 workflow: 24 runs to a calibration table

This is spec section 6.5 as a checklist. The tester does the data collection; `analyze.py` does the rest.

### Step 1: compile and check

Compile `RamanFX_ZoneVision.mq5` with `RFX_ZoneCore.mqh` beside it (section 1). Run the golden-master check once (`docs/ZoneVision_v2_Progress.md`, M0) so you know the zones are v1's.

### Step 2: symbols and periods

| | |
|---|---|
| Core symbols | **XAUUSD, EURUSD, GBPUSD, USDJPY** |
| Breadth symbols | **GBPJPY, AUDUSD, XAGUSD, US30** (or NAS100) |
| IS (in-sample) | 2019-01-01 to 2023-12-31 |
| OOS (out-of-sample) | 2024-01-01 to 2025-06-30 |
| Holdout | 2025-07-01 to 2026-09-30, run **once**, at the very end |

8 symbols x 3 periods = **24 runs**. If a run is too slow, split IS into 2019-2021 and 2022-2023 (32 runs). The analyzer merges files and drops a zone that appears twice.

### Step 3: tester settings (the same for every run)

| Setting | Value |
|---|---|
| Program | Indicator `RamanFX_ZoneVision` |
| Chart period | M15 (only sets how often the indicator is called) |
| Modelling | 1 minute OHLC |
| Visual mode | on (MT5 requires it for indicators), speed slider at the maximum |
| Agents | local only (Common\Files must be this PC's) |
| `InpResearchTFs` | `M15,H1,H4,D1` (add `M5` on XAUUSD and EURUSD only: it is slow) |
| `InpResearchDNA` | true |
| `InpResearchDraw` | false |
| `InpResearchGMT` | your broker's offset (2 or 3) |
| Everything else | as you trade it. Do not change the "Zone rules" group between runs |

Save these inputs once as a `.set` file and load it for every run.

### Step 4: run and collect

1. Run each of the 24 tests. Each one ends with `ZoneVision research: N zones saved to Terminal\Common\Files\RFX_ZoneResearch_<symbol>_<from>_<to>.csv` in the Journal.
2. Move the files into three folders by period: `data/IS/`, `data/OOS/`, `data/HOLDOUT/`. Do not open the holdout files yet.
3. Expect about 2-6 thousand ZV zones per symbol and year over the 4 TFs.

### Step 5: analyse and calibrate

```
python3 tools/zone_research/analyze.py data/IS --oos data/OOS --calibrate RFX_Calib.csv --out docs/Zone_Research_Report.md
```

| Option | Default | Meaning |
|---|---|---|
| `--calibrate FILE` | - | Write the calibration table |
| `--oos PATH ...` | last 25% of creation dates | Out-of-sample files or folders |
| `--split-date YYYY-MM-DD` | - | Split the inputs by creation date instead of `--oos` |
| `--key-level-max N` | 5 | Deepest cell level written (L0 all, L1 TF, L2 + pattern + Direction side, L3 + Raja type group + nested, L4 + depth grade + curve bucket, L5 + symbol) |
| `--prior a` | 20 | Shrinkage toward the parent cell, in trades. Keep it equal to `InpCalPrior` |
| `--cell-min N` | 10 | Smallest cell written to the file (the indicator uses `InpCalMinN` = 30) |
| `--cal-min-n N` | 30 | The indicator's `InpCalMinN`, for the reliability table |
| `--min-lens-n N` | 100 | Trades needed on each side (pass / fail) before a lens gets a weight |
| `--lr-max N` | 10000 | Most IS trades used to fit the logistic p(3R) model |
| `--cells-from is / all` | is | Build the cells from IS only (honest OOS check), or from IS + OOS once you accept the result |
| `--pine FILE` | - | Also write Pine arrays (top 300 cells, L0-L3) for the TradingView port |
| `--stop wick / close` | wick | Stop model of the touch-1 trade |

What it does:

- **Cells.** Every zone gets a key from its touch-1 snapshot (creation values if it was never touched). Each level is shrunk toward the level above it: `p = (n x p_cell + a x p_parent) / (n + a)`.
- **Lens weights.** `lift = best E (pass) - best E (fail)` per lens on IS. A lens keeps its weight only if the OOS lift has the same sign. Otherwise the report says "lens X does not predict on this data" and its weight is 0. The weights are scaled to 100.
- **Model.** A logistic p(3R) on about 20 DNA features (L2 = 1). It is written only if its OOS Brier score beats the base rate.
- **Report.** Section 7 of the report has lens pass / fail, consensus bins, verdicts, conflict cases, entry models, Direction quality, OOS reliability, v1 vs Raja removal, the fitted weights, the model and an acceptance summary.

### Step 6: accept or not (read section 7.11 of the report)

| Check | Pass when |
|---|---|
| OOS reliability | Every p(3R) decile within +-7 pp of what was observed |
| Consensus | The consensus bins are monotone in E on OOS (at most 1 inversion) |
| Verdicts | A+ / A have OOS best E > 0 with CI_lo > 0 on at least 2 of the 4 core symbols |

If a check fails, do not install the file. Send the report back instead.

### Step 7: install

1. Copy `RFX_Calib.csv` to `%APPDATA%\MetaQuotes\Terminal\Common\Files\` (or to the terminal's `MQL5\Files\` with `InpCalCommon = false`). The indicator looks in the other folder too if the file is not in the first one.
2. Charts pick it up within 60 seconds. The Journal prints `ZoneVision v2: calibration RFX_Calib.csv (Common\Files): N cells ...`.
3. The tag now ends in `3R 64% n212` (the share of similar zones that reached 3R, and how many there were) instead of `C78`. The click box's **HISTORY** section shows the cell, the level used, the hit rates, the best target with its 95% interval, the model's p(3R) and the strongest "tells".
4. Optional: `InpUseCalWeights = true` uses the fitted lens weights for the consensus. `InpAlertMinHistE` (e.g. 0.2) alerts only zones whose calibrated best E is at least that.

| Input | Default | Meaning |
|---|---|---|
| `InpCalFile` | `RFX_Calib.csv` | File name |
| `InpCalCommon` | true | Common\Files first (false = MQL5\Files first) |
| `InpCalMinN` | 30 | Smallest cell the lookup uses; with less data it moves up a level, and with no level left it uses the consensus-bin prior (labelled `prior`) |
| `InpCalPrior` | 20 | Shrinkage a (keep equal to `--prior`) |
| `InpCalTarget` | 3 | R shown in the tag (0 = the cell's best target) |
| `InpShowHist` | true | Show the tag part and the HISTORY rows |
| `InpUseCalWeights` | false | Consensus with the fitted W weights |

A missing file only means no history: the tag shows `C78` and HISTORY says "no calibration file loaded". A malformed row is skipped and counted in the Journal line.

### Step 8: holdout, once

```
python3 tools/zone_research/analyze.py data/IS --oos data/HOLDOUT --out docs/Zone_Research_Holdout.md
```

Append its section 7 to the report. If best E drops by more than half from OOS to the holdout, keep `InpUseCalWeights = false` and treat the History numbers as optimistic. Never re-tune on the holdout.

### Step 9: refresh every quarter

Run the last quarter for the 8 symbols (8 runs), add the files to `data/OOS/` (or roll the IS window forward), and run step 5 again.

