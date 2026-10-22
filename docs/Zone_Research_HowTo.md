# Zone Research: how to collect the data in the MT5 Strategy Tester

`public/tools/RamanFX_ZoneVision.mq5` has a **Zone research** mode. In the Strategy Tester it logs **every zone it creates**: why it was made, and what price did afterwards. It writes one CSV row per zone. `tools/zone_research/analyze.py` turns one or more of these CSVs into `docs/Zone_Research_Report.md`.

Zones are detected with the **same functions the chart uses**: `Detect`, `Trendlines`, `TLBias`, `Qualify`, `ZoneNotes` and `FindTrap`. The research pass borrows the chart's detection state, treats each research timeframe as the chart timeframe, draws nothing and alerts nothing, then restores the state. The zone logic itself is unchanged.

---

## 1. Run the test

1. Copy `RamanFX_ZoneVision.mq5` to `MQL5\Indicators\` and compile it in MetaEditor (F7).
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
| `InpResearchTFs` | `M15,H1,H4` | Timeframes analysed, whatever the chart timeframe is. Accepted: M1..M30, H1..H12, D1, W1, MN |
| `InpResearchAlt` | true | Also logs the ALT detector, tagged `detector=ALT` (see section 4) |
| `InpResearchMaxBars` | 200 | Follow-up horizon, in candles of the zone's own timeframe |
| `InpResearchFile` | `RFX_ZoneResearch` | CSV name prefix |
| `InpResearchDraw` | true | Set it to **false** for a much faster test. Nothing is drawn on the visual chart, but the data is identical |
| `InpResearchGMT` | 2 | Server time minus GMT, in hours. Only used for the `session` column. Most brokers use 2 in winter and 3 in summer |

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

## 3. Send it back and analyse

Zip the CSV(s) and send them, or attach them in the chat. To analyse them yourself:

```
python3 tools/zone_research/analyze.py path/to/RFX_ZoneResearch_EURUSD_20240101_20241231.csv [more files or a folder]
    --out docs/Zone_Research_Report.md   # default
    --stop wick|close                    # touch-1 stop model (default wick)
    --min-n 30                           # minimum samples for a recommendation
    --detector ZV|ALT|all                # default all
    --only-drawn                         # only zones ZoneVision would actually draw
```

Only the Python 3 standard library is needed. The report covers:

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

### Performance

Research code runs only when research is on (the tester, or `InpResearch=true`). On a normal chart nothing changes. In the tester:

- each research timeframe is checked once per new candle;
- the full context (HTF trend, trendlines, `Qualify`, notes, nested) is built only on candles where a new zone appears;
- research timeframes never trigger a chart redraw.
