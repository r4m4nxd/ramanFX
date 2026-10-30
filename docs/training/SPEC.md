# RamanFX chart-reading SPEC (single source of truth)

Status: v1, 2026-10-30. Every engine and port (zvReal.ts, zvTrend.ts, arrival.ts, RFX_ZoneCore.mqh, RamanFX_ZoneVision.mq5,
Pine, Python) is built from this file **line by line**. When code and this file disagree, the code is wrong. When this
file and the owner disagree, this file is wrong: fix it here first, then the code.

How to read it:

- **Sources.** `[O]` = the owner (chat notes in `docs/training/LEARNED.md`, his marked charts in Supabase
  `rfx_training_marks` = `src/core/training/fixtures/marks.json`, his MT5 2.15 feedback). `[R]` = Raja
  (`src/core/mentors/raja/partA.ts`, `partB.ts`, `private.ts`; lesson numbers L1-L9, L50-L55, L101-L107 as in
  `src/core/checklists/raja.ts`). `[K]` = Kevin (`src/core/videoLessons.ts` lesson n, `src/core/mentors/kevin/media/lessonNN.ts`,
  `zoomMedia/sNN_*.ts`). `file:line` points at the exact sentence.
- **Precedence.** Owner > Raja > Kevin. Each conflict is written out in section 9 with the reason.
- **Tunable** numbers are marked `{name = value}` and are listed in one table (section 8). Nothing else is a knob.
- **Evidence tags** in the tests: **V** = verified fact (the owner marked or said it, or it is a plain fact of the
  bars), **I** = my inference from the rules (computed on the bars), **Q#** = waits for an open question (section 11).
- **Bars.** AUDUSD: the owner's fixture `src/core/training/fixtures/marks.json` (MN Oct 2021-Sep 2026, W1
  2025-10-25..2026-10-17, D1 2026-07-10..10-29, H4 2026-10-13 12:00..10-30 16:00). XAUUSD: `origin/data:qa/bars/XAUUSD/*.json`
  (Pepperstone server time) and `tools/telegram_bot/parity/xauusd_d1_2026-10-29.json` (80 D1 bars). Gold tests are pinned
  to the **D1 close of 2026-10-29 (price 4020.10)**, the state the owner's MT5 screenshots showed.
  **W1 dates are the bar labels in those files: the Saturday before the trading week** (W1 `2026-02-28` = the week of
  Mar 2-6 2026). MN dates are the month. D1/H4/H1 are server-time bar opens.
- **ATR** = the 14-bar simple true-range average at the bar in question (MT5 `iATR(14)`, `zonecore.ts Series.atr`).

---

## 1. Definitions

Each entry: the rule (precise), where it comes from, an owner-chart example, and a counter-example (what it is NOT).

### 1.1 Basing candle, departure candle, base

- **Rule.** Basing candle: body < 50% of its range. Departure (leg) candle: body >= 50% of its range. A base = 1-6
  consecutive basing candles followed by a departure that travels at least 2x the base's size and has CLOSED.
  HTF exception (section 1.10): a *range base* of up to {rangeBaseMax = 20} candles on W1/MN/3M.
- **Sources.** [R] partB.ts:1245 "Base count: 1-6 candles inside the box range is tradable; more than 6 is a weak
  zone"; partB.ts:1243 "The departure must travel at least twice the base area away. No departure, no zone." [R]
  private.ts:52 "With one very long base candle, box only its body ... With small base candles, take the whole group
  including wicks in one box". [R] partB.ts L54 "Long, lengthy candles are not considered basing".
- **Example.** AUDUSD D1 2026-08-10..08-11 (owner demand 0.70380-0.70737, note "these basing candles also made an
  explosive move, and left some imbalance which market respected").
- **Not a base.** A single doji (L55), more than 6 candles on D1 and below, stair-stepping candles.

### 1.2 RBD / DBR (reversal) and RBR / DBD (continuation = CP level)

- **Rule.** Name a base by the candle before it (leg-in) and after it (leg-out): rally-base-drop **RBD** = supply at a
  PEAK; drop-base-rally **DBR** = demand at a VALLEY; rally-base-rally **RBR** and drop-base-drop **DBD** = **CP levels**
  (continuation). A leg-in/leg-out candle must be a departure candle (1.1); basing candles on either side belong to the
  base. A **PCP** = a CP (or any departure) that removed the opposite zone.
- **Sources.** [O] LEARNED.md:44-47 "Rally-Base-Drop (RBD) = the actual PEAK. Drop-Base-Rally (DBR) = the proper
  VALLEY. Rally-Base-Rally (RBR) and Drop-Base-Drop (DBD) are CP levels ... With RBR / DBD the MOMENTUM lines happen;
  with RBD / DBR the TREND lines happen." [R] partB.ts:1252-1253 "Valleys and peaks: a V shape is a demand
  (drop-base-rally) ... CP = continuation pattern: drop-base-drop or rally-base-rally. Like a bus stopping at a station";
  partA.ts:24 "a PCP is a CP level, or any departure, that removed the opposite zone".
- **Examples.** DBR valley: AUDUSD W1 `2025-11-15` demand 0.64206-0.65315 (owner: "the actual swing low ... responsible
  to create the reversal"). RBD peak: AUDUSD W1 `2026-05-02` supply 0.72088-0.72770. CP (RBR): AUDUSD W1
  `2025-12-13..12-20` demand 0.65918-0.67101 (owner: "CP demand ... but this is not the valley, this is a strong zone").
  CP (DBD): AUDUSD MN May-Jun 2022 supply 0.69036-0.72823 (owner: "a CP supply"); gold W1 RBR range base Apr-Aug 2025
  (the owner's purple zone, 1.10).
- **Not a pivot.** A CP base is never a trend-line anchor by itself: AUDUSD D1 Aug 10-11 (RBR inside the Jul 29 -> Aug 17
  rally) is a zone, not a valley; the owner's D1 pivot list has no Aug 11 point.

### 1.3 Real pivot (= the end of a real correction)

A pivot is not "a swing low". It is the end of a REAL correction of the leg before it.

- **Rule.** Walk the bars as a zig-zag. A leg runs from the last real pivot `A` to its extreme `X` (the highest high of
  an up leg, the lowest low of a down leg, extended bar by bar while no real correction has happened). The counter-move
  from `X` is a **real correction**, and its extreme `Y` becomes a real pivot, when all of these hold:
  1. **Leg size.** `|X - A| >= {minLeg = 1.25} x ATR(X)`.
  2. **Depth OR origin.** (R1) the counter-move retraces `>= {RC = 0.45}` of `|X - A|`, **or** (R2) it trades back to
     the **origin zone** of the leg: the last base on the leg `A -> X` from which the final run into `X` departed (the
     pre-gap candle when the run started with a gap, [R] partB.ts L55 "Use the zone before the gap"); for an up leg the
     counter-move low must reach `<= that base's proximal + {near = 0.25} x ATR(X)`, mirrored for a down leg.
  3. **Done.** `Y` is fixed (confirmed) once price has moved away from `Y` by `>= RC` of the counter-move `X -> Y`.
     Until then `Y` follows the counter-move's extreme. If price goes beyond `X` before `Y` qualifies, the leg simply
     extends (`X` moves) and nothing is a pivot.
  When `Y` is confirmed, `X` is a real pivot too (the impulse end). Internal swings of a leg or of a correction are
  never pivots of this TF (they belong to the LTF).
- **Sources.** [O] LEARNED.md:37-41 "After a fast momentum move, the real correction comes back NEAR THE ZONE THAT
  STARTED THE MOMENTUM, or about HALFWAY (~50%) of the impulse. It can come right away, or after a base / sideways
  section first. The END of that correction is the real peak (in a down move) / valley (in an up move) ... Small pullbacks
  inside the impulse are NOT pivots." [K] videoLessons.ts:1862 (L14) "Price stepping up with small shallow pullbacks is a
  momentum line, not a trendline"; [K] L14 "Anchor only to an obvious peak and an obvious valley".
- **Owner evidence for the numbers** (each owner pivot, the depth of its correction, and which test passes):

  | owner pivot | correction depth | R1 (0.45) | R2 (origin zone) |
  |---|---|---|---|
  | D1 2026-09-02 V 0.71209 (leg Aug 19 -> Aug 28) | 61% | yes | yes (Aug 20 CP 0.71016-0.71321) |
  | D1 2026-09-21 P 0.71397 (leg Sep 9 -> Sep 16) | 40% | no | yes (Sep 15 supply 0.71165-0.71407) |
  | D1 2026-10-14 P 0.70126 (leg Sep 21 -> Oct 1) | 46% | yes | - |
  | D1 2026-08-19 V 0.70662 (leg Jul 29 -> Aug 17) | 30% | no | yes (Aug 10-11 base 0.70380-0.70737) |
  | W1 2026-01-17 V 0.66675 (leg Nov 15 -> Jan 3) | 28% | no | yes (Dec 13-20 CP 0.65918-0.67101) |
  | W1 2026-03-28 V 0.68328 | 68% | yes | - |
  | W1 2026-09-19 P 0.71397 (leg Sep 5 -> Sep 12) | 40% | no | yes (the Sep 12-week base) |
  | MN 2025-11 V 0.64206 (leg Apr -> Sep 2025) | 36% | no | yes (May 2025 demand 0.63558-0.64278) |
  | MN 2023-02 P 0.71571 | 66% | yes | - |
  | H4 2026-10-20 04:00 V 0.69701 | 23% | no | yes (Oct 19 00:00 base, prox 0.69672) |
  | H4 2026-10-15 00:00 P 0.69798 | 48% | yes | - |
  | gold D1 2026-09-03 P 4510.64 / 09-18 P 4399.48 | 55% / 60% | yes | - |
  | gold W1 `2026-02-28` P 5419.41 / `2026-08-22` P 4696.81 | 85% / 51% | yes | - |

- **Counter-examples (must NOT be pivots).**
  - AUDUSD H4 2026-10-16 20:00 low 0.69358: 42% of the Oct 15 16:00 -> Oct 16 12:00 leg, and 15 pips above the origin
    base (Oct 15 demand, prox 0.69209). Fails R1 and R2. The owner has no pivot there (the 0.38 engine makes one,
    LEARNED.md:85).
  - AUDUSD D1 2026-10-06 high 0.69893: only 36% of the Sep 21 -> Oct 1 leg and below the Sep 24-28 base. Not a pivot;
    the correction runs on to the real lower high Oct 14 0.70126 (owner pivot).
  - AUDUSD D1 2026-08-11 low 0.70380: a 25% dip that is an RBR base (1.2), not a correction end.

### 1.4 First lower high after a top / first higher low after a bottom

- **Rule.** `C1` = the first real pivot (1.3) of the opposite kind after the extreme `E`: the end of the first real
  correction of the leg out of `E`.
- **Sources.** [O] LEARNED.md:25-26 "Down line after a higher high: starts at the first lower high right after the top
  (W1: May 9 2026 0.72711 ...)"; LEARNED.md:20 "gold D1: top Aug 25 skipped, line from the first lower high Sep 3 ->
  Sep 18"; owner MT5 2.15 feedback: "D1 down line started at the top instead of the first lower high" (wrong).
- **Examples.** Gold D1: `E` = 2026-08-25 4696.81, `C1` = 2026-09-03 4510.64 (55% correction), `C2` = 2026-09-18
  4399.48. Gold W1: `E` = `2026-01-24` 5599.73, `C1` = `2026-02-28` 5419.41 (not the `2026-02-07` high 5119.02: that
  bounce's pullback reached only 39% before price went above it, so the pending peak moved up to 5419.41).
- **Not C1.** The bars of the impulse itself (gold D1 Aug 26-28 highs 4673-4631): they sit above any line from the top
  to Sep 3, which is exactly why the top cannot anchor the line (2.2 step 2).

### 1.5 Trend line

- **Rule.** A straight line through two anchors, for a down line over highs (rests on/above every high between its
  anchors), for an up line under lows. Anchor 1 = the structure extreme or the first real counter-pivot (2.2), anchor 2
  = a CONFIRMED real counter-pivot (1.3 + Kevin's confirmation: a down line needs peak -> valley -> lower peak and then
  a break below that valley; up mirrored). It must slope: rise `>= {minRise = 0.25} x ATR` between the anchors and
  `>= {minSlope = 0.015} x ATR` per bar. Full life cycle in 2.2.
- **Sources.** [K] videoLessons.ts:603 (L5) "Downtrend line: you need peak -> valley -> lower peak, then price must
  BREAK BELOW the valley low. Only then do you connect the peaks"; :607 "The line must slope. A near-flat line is not a
  trend."; [R] partA.ts:706 "Draw it through the two most recent valleys (uptrend) or peaks (downtrend) ... Do not keep
  redrawing it with every new swing; keep the old one"; [R] private.ts:27 "an ascending trendline joins at least two
  higher lows"; [O] LEARNED.md:15-17 "TREND line: both anchors are REAL pivots with a proper correction between them".
- **Examples.** AUDUSD MN 2023-02 0.71571 -> 2023-07 0.68944 (down, broken 2023-12); AUDUSD W1 `2025-11-22` 0.64356
  -> `2026-01-17` 0.66675 (up, broken `2026-03-21`); gold W1 `2023-09-30` 1810.32 -> `2024-02-10` 1984.11 (up, live,
  3273.81 at the `2026-10-24` bar).
- **Not a trend line.** A line whose anchor 2 is a pullback inside the impulse (that is a momentum line, 1.6); a line
  before the swing point is broken ([K] L5, media/lesson05.ts:28-29 "The second push never broke the first peak ...
  you cannot draw a trend line yet"); AUDUSD D1 2026-07-13 0.69126 -> 07-29 0.69216 (rise 0.02 ATR: flat, so the newer
  low is the base and the line starts at Jul 29).

### 1.6 Momentum line

- **Rule.** From the extreme `E` of an impulse: anchor 2 = the touch of the steepest line that no high (down) / low
  (up) of the next {momBars = 4} bars crosses (the hull over those bars). Drawn only when the leg out of `E` is an
  impulse: it travels `>= {momEff = 0.6} x momBars x ATR(E)` within those bars. Its break (first close beyond) ends the
  IMPULSE, not the trend. It is never used for direction change, arrival or confirmation.
- **Sources.** [O] LEARNED.md:11-14 "MOMENTUM line: drawn from the EXTREME of a leg along the very next bars of the
  same one-way impulse (anchor 2 is a bar 1-4 bars later, NOT a real pivot), steep ... Its break ends the impulse, not
  the trend." [K] media/lesson05.ts:23 "red = momentum line, black = trend line"; :38 "The Feb 13-14 rally breaks the
  red momentum line but stops at the black trend line. The momentum-line break was false"; [K] videoLessons.ts:632 (L5)
  "The real signal is the break of the proper trend line from further back". [R] partA.ts:706 "add an aggressive line
  only for impulses".
- **Examples (owner, MN).** 2022-04 0.76607 -> 2022-08 0.71362, broken 2022-11 (the first close above). 2022-10 0.61695
  -> 2022-11 0.62717, broken **2023-04** (first close below; LEARNED.md:14 says "Mar 2023", which is one bar off: the
  owner's mark and the bars both say Apr 2023).
- **Not a momentum line.** The black/trend line of the same move (AUDUSD MN 2023-02 -> 2023-07); a line whose anchor 2
  is the end of a real correction (then it is a trend line, unless Q1 says otherwise).

### 1.7 Break

- **Rule.** A line is broken by the **first candle that CLOSES beyond it** (any body size). One exception, the
  **fake-cross veto**: the close at bar `k` does not break the line when (a) bar `k+1` closes back inside the line or
  within `{vetoTol = 0.05} x ATR` of it, (b) bar `k` or `k+1` is a new real pivot of the line's kind whose extreme lies
  beyond the line, and (c) price then makes a new trend extreme (new HH for an up line) within `{vetoBars = 8}` bars
  without another close beyond the line rotated to that pivot (2.2 step 3b). A wick beyond the line is never a break.
- **Sources.** [O] LEARNED.md:7-8 "A line is broken by the FIRST candle that CLOSES beyond it. The owner's break marks
  match the first close exactly". [R] partA.ts:675 "The cross must be by a candle that closes beyond the line"; [R]
  private.ts L107 "The market often crosses the trendline with a wick only; do not worry unless it closes inside the
  departure". [K] videoLessons.ts:2970 (L21) "A candle body closing through the zone = removed".
- **Example.** Every owner break is the first close beyond (computed on the fixture): MN 2025-12, 2022-11, 2023-04,
  2023-12, 2024-12, 2026-06; W1 `2026-03-21`, `06-13`, `09-19`, `09-12`, `10-17`, `07-25`; D1 Oct 9, Oct 20; H4 Oct 16
  00:00, Oct 29 12:00. Two owner marks sit one bar before the first close (D1 up line: mark Sep 9, close Sep 10; H4 up
  line: mark Oct 22 00:00, close Oct 22 04:00): tests allow +-1 bar.
- **Not a break.** The AUDUSD W1 `2026-10-10` week high 0.70126 pokes 19 pips (0.20 ATR) above the
  Sep 5 -> Sep 19 line and closes below: a fake cross, the owner keeps the line until `2026-10-17`. AUDUSD D1 Sep 1
  closes 0.22 ATR under the Jul 29 -> Aug 19 line, Sep 2 closes back above and is the real higher low, Sep 4 makes the
  higher high: vetoed, the line rotates to Jul 29 -> Sep 2 (the owner's line).

### 1.8 Impulse and correction (on one TF)

- **Rule.** The current **leg** of a TF = the move from its last real pivot. Its **phase** is judged against the
  PARENT TF's trend (2.4): a leg in the parent's trend direction is an **impulse**, a leg against it is a
  **correction**. The top TF (3M) is judged against its own trend.
- **Sources.** [O] LEARNED.md:56 "classify each TF's current leg as impulse / correction relative to its HTF"; [R]
  partA.ts:893 (L5) "With a descending HTF trendline, the moves down along it are impulses. The pullbacks up ... are
  corrections"; partB.ts:351 (L51) "Moves with the trendline are impulses (trend trading). Moves against the
  high-timeframe trendline are corrections (counter-trades)"; partA.ts:936 "How to recognise an impulse: (1) a
  structure break and (2) a strong move with big departure candles".
- **Example.** Gold: W1 falls since Jan 2026 while MN is UP, so W1 is a **correction** (owner: "with 3M/MN uptrend,
  W1's fall is a CORRECTION"). D1 falls with W1 (DOWN), so D1 is an **impulse**.
- **Not this.** "Impulse" because the leg goes with the TF's OWN last two swings (the 2.15 rule that printed
  "MN impulse down | W1 impulse down").

### 1.9 Trend of a TF (UP / DOWN / SIDEWAYS)

- **Rule (state machine, up described, down mirrored).**
  - `HHH` = the highest real peak of the current up structure; `SL` (structure low) = the real valley that launched
    `HHH` (the last real valley before it). Each new real peak above `HHH` moves both.
  - **UP** holds while no candle CLOSES below `SL`. Real pivots formed after `HHH` (lower highs, lower lows inside the
    pullback) do NOT change the trend: they are the correction.
  - **SIDEWAYS** (from UP, no close below `SL`): after `HHH` a real lower high formed, the newest real valley is still
    above `SL`, AND both the supply at `HHH` and the demand at `SL` have been touched again since `HHH` (price runs
    between two used zones).
  - After a close below `SL`: **DOWN** once a real valley below `SL` and a real lower high (below `HHH`) have formed
    (Kevin), or once the TF's live up line has been closed below and 2 fresh demands of the TF were removed (Raja L3).
    Until one of these, **SIDEWAYS**. A DOWN structure then keeps `LLL` / `SH` the same way.
- **Sources.** [O] AUDUSD W1 note: "the weekly trend at current price is sideways, as no HH or LL is forming. but the
  market is running in between"; [O] LEARNED.md:50-52 "The HTF keeps making HH/HL ... Its CORRECTIONS, seen on the LTF,
  are themselves a full opposite trend ..., while on the HTF they look like a sideways pause". [R] partA.ts:467 (L3)
  "If it crosses the trendline and removes the #1 AND #2 opposite zones, direction has changed on that particular
  timeframe"; partA.ts:491 "One opposite zone removed with the trendline crossed is still the same trend". [R] L53/L102
  "When supply and demand are close together and both have been used, the market is sideways". [K] L5 "You can have a
  trend (for example a lower low) without a valid trend line".
- **Examples.** Gold MN: `HHH` 2026-01 5599.73, `SL` 2025-10 low 3819.08; lowest MN close since = 4006.86 (2026-06):
  **UP** (the 2026 lower highs 4891 / 4697 and lows 4098 / 3942 are the correction). Gold W1: `HHH` `2026-01-24`
  5599.73, `SL` `2025-12-27` 4273.31, closed below on `2026-06-06` (4217.96); then low `2026-06-27` 3941.55 < SL and
  lower high `2026-08-22` 4696.81: **DOWN**. AUDUSD W1: `HHH` `2026-05-02` 0.72770, `SL` `2026-03-28` 0.68328; lower
  high `2026-09-05` 0.72374 (inside the May supply), valley `2026-06-27` 0.68647 (inside the Mar 28 demand), no close
  below 0.68328: **SIDEWAYS** (owner).
- **Not this.** "DOWN" from the last two peaks and valleys alone (gold MN would read DOWN, the owner says UP).

### 1.10 Zones: strong, arrival, weak, touches, range bases

- **Strong zone** = its leg-out closed beyond the opposite zone. [R] partA.ts:23 "If that zone's leg-out closes below
  the opposite (earlier) demand, the supply becomes a strong zone". Owner example: AUDUSD D1 Sep 15 supply
  0.71165-0.71407 "supply zone which removed the previous two demands".
- **Arrival zone** = its leg-out (a) crossed the trend line by a close AND (b) removed >= 1 opposite zone. [R]
  partA.ts:33 "An 'arrival zone' is a zone whose move away (a) crosses the trendline and (b) removes the opposite
  zone"; partA.ts:35 "Arrival zones usually form at the peak or valley". Owner examples: AUDUSD MN Nov-Dec 2025 demand
  0.64206-0.66716 (owner: "the bearish trendline was broken with the demand i drew"; its leg-out closed above the line in
  2025-12 and removed the Sep 2024 supply 0.67619-0.69419 in 2026-01, owner: "got removed by a strong arrival demand CP
  zone"). AUDUSD H4 Oct 15 16:00-Oct 16 00:00 demand 0.68935-0.69209 (owner: "swing low ... which removed the bearish
  trendline"; the rally also closed above the Oct 14 supply 0.69900-0.70113 on Oct 21 00:00).
- **Not arrival = inheritance** (crossed the line, removed nothing). [R] partB.ts L51 "If price only crosses the
  trendline but does not remove the opposite zone, the zone is an inheritance zone, which is weak".
- **Weak zones** (confirmation only, never a limit order): removed nothing, tested/retested, inheritance, overlap
  (formed inside an old opposite zone, no gap), flip, out-of-trendline. [R] partB.ts L52 "Strong (pending order, set &
  forget): simple strong zone, wow trade zone, arrival zone. Weak (confirmation only): weak zone that removed nothing,
  inheritance zone, flip zone, out-of-trendline zone, overlap zone, tested / retested zone." Owner example: AUDUSD D1
  Sep 2 demand 0.71209-0.71694 "last cp demand on bullish leg, and may be near to the high curve area, broken" (a demand
  in the high curve, [R] partA.ts L4 "a demand found in the high curve cannot be used").
- **Touches.** [R] partA.ts:218 "Monthly zones: 1st touch set and forget, 2nd confirmation, 3rd confirmation, and the
  4th touch usually breaks the zone. Daily and weekly zones: 1st set and forget, 2nd confirmation, and the 3rd is
  risky"; private.ts L105/L52 "an H1 zone often breaks on the 2nd tap". Owner: AUDUSD MN May-Jun 2022 supply "still in
  play, with multiple touches". Output: the touch number on every zone label (`T1`, `T2`...).
- **Removed** = a candle CLOSE beyond the distal ([K] L21, [R] partB.ts L50 "A zone is removed when a candle closes
  beyond it").
- **Range base (HTF only, for the realignment target).** On W1 / MN / 3M also build a zone from a sideways run of
  `>= 3` and `<= rangeBaseMax` candles whose bodies stay inside a band `<= {rangeBaseATR = 2.5} x ATR`, left by a close
  beyond the band's far side in the leg direction. Box = the bodies (proximal = the band's top for a demand, distal =
  the lowest body; option: the lowest wick). Gold W1 `2025-04-19`..`2025-08-23`: bodies 3203.62-3439.89, wicks
  3120.40-3499.92, left by the `2025-08-30` week. The owner's purple box is about 3250-3480 (V); the detector must
  return a demand overlapping it by `>= 50%` of its height.

### 1.11 Realignment area (the target of a correction)

- **Rule.** For the correcting TF `C` and its parent `P` (2.5): the fresh (or once-touched) `P`-direction zone, on `C`
  first and then on `P`, CP levels and range bases included, whose box contains the current value of the live
  `P`-direction trend line drawn on `C` (else on `P`); if none contains it, the one with the smallest gap to that value
  within {targetGap = 1.0} x ATR(C). If no such line is live: the zone at `C`'s structure extreme (the `SL` demand of an
  UP parent, 1.9).
- **Sources.** [O] LEARNED.md:54-55 "Correction trades are allowed only on the LTF of that HTF, and only until price
  reaches the HTF trend line or the HTF zone near the trend line (where the HTF impulse is expected to resume)"; owner:
  the purple W1 zone "= the realignment TARGET for shorts because it sits near the W1 up trend line". [R] partA.ts:1256
  (L8) "The alignment (realignment) area is where a weekly strong zone and a daily strong zone come together"; :1275
  "when H4 crosses its trendline, the market realigns with the daily zone; a daily cross goes to the weekly zone; a
  weekly cross goes to the monthly"; :1277 "two trendlines, and the realignment area is where they point". [R]
  private.ts:182 "The real zone is the one nearest the trendline"; private.ts:42 "prefer the zone nearest the
  trendline".
- **Example.** Gold: `C` = W1, `P` = MN. The live W1 up line `2023-09-30` 1810.32 -> `2024-02-10` 1984.11 is at
  **3273.81** at the `2026-10-24` bar (the MN up line 2023-10 -> 2024-02 is at 3374.43). The W1 range base 3203.62-3439.89
  contains 3273.81: **target = the W1 demand ~3250-3480 (purple), entry side for the resumed impulse; shorts stop there.**
  AUDUSD: `C` = MN; its up line 2025-04 -> 2025-11 broke in 2026-06, so the fallback is the `SL` demand: **0.64206-0.66716**
  (owner MN note: "now the potential HL will be formed near above or inside the demand i have drawn").
- **Not the target.** The zone nearest PRICE (the 2.14 HTF band), a same-TF opposite "weak" zone (arrival.ts
  `realign`), or the old MN 2015 -> 2018 line value (~1508).
- **Use.** Once tapped, confirmation only ([R] partA.ts L8 "After the realignment area has been retested once, he does
  not use it again"; :1283 "A realignment area can be tapped again ... once tapped use confirmation").

### 1.12 WOW area

- **Rule.** When a zone is removed (close beyond its distal), the room from its distal to the proximal of the next
  zone of the same side is the WOW area: price is drawn there. A proper trend-line break (close) with no opposite zone in
  the way opens a WOW area from the break to the next zone. Part 2 starts only when the zone at the end of part 1 is
  removed.
- **Sources.** [R] partB.ts:18 "The room between supply #2 and supply #1 is the wow trade area"; partB.ts:29 "Each
  swing gets its own trendline ... A close above the newest line targets the supply at that line's origin"; private.ts
  L101 "Without an identified wow area you do not trade at all".
- **Example (owner, V).** AUDUSD W1: "if this demand [`2026-03-28` 0.68328-0.68875] gets broken, a new down trend will
  start, which will go near the demand zone drawn under neath this [`2025-12-13..20` CP 0.65918-0.67101] ... WOW zone
  will start from distal line of this zone [0.68328] to proximal line of next demand zone under it [0.67101]."
- **Not WOW.** Room into a zone that has not been removed ([R] partB.ts L50 "Never sell while price sits in a demand").

### 1.13 Curve

- **Rule.** Between the two HTF strong zones that bound price (MN or W1), measured **proximal to proximal**: bottom
  0-25% = low curve (buys only), top 75-100% = high curve (sells only), 50% line; the owner's sheet: demand below 50%,
  best in the low curve.
- **Sources.** [R] partA.ts:649 "so the curve is measured proximal to proximal"; partA.ts:656 "High curve (top 0-25%)
  is for sellers only; low curve (bottom 0-25%) is for buyers only"; [K] zoomMedia/s10_2026-09-27.ts:86 "Between the
  trendline and the 50% line is the 'golden area' ... Above 50% is the danger zone"; [O] checklists/raja.ts notes
  "The sheet says below 50%, best in the low curve".
- **Example (I).** AUDUSD W1 between demand prox 0.68875 and supply prox 0.72088: the `2026-10-17` close 0.70321 sits
  at 45% = middle, confirmation only. Gold: between the purple prox ~3480 and the Aug 2026 supply (~4600, its exact
  box is Q-free but unmarked): 4020 sits near 48% = middle.
- **Not this.** A curve measured wick to wick or across one zone.

### 1.14 Zone reasons (owner 2026-10-30)

- **Rule.** Every zone the owner draws has a reason; a zone without one is not drawn. A supply / demand zone qualifies only
  when its leg-out (from the leg-out candle until price first comes back to the proximal) does at least one of:
  (R1) **BREAK**: closes beyond the previous swing (for a demand: the newest confirmed real peak before the base; supply
  mirrored) = break of structure; (R2) **DIRECTION**: closes through a live opposite trend line of the TF (or flips the
  trend state of an intermediate TF; ZoneVision 2.16 implements the trend-line part); (R3) **REMOVAL**: closes through at
  least one older opposite zone (the Raja arrival "removes" test). The reasons are stored on the zone (break / direction /
  removal + the broken pivot and the removed zones); MT5 shows them compactly (`BOS`, `CHoCH`, `x2 removed`). Strength
  ranks by the number of reasons; all three = the arrival zone (the strongest).
- **Sources.** [O] 2026-10-30 (owner, stated directly); owner SpotCrude MN examples (MT5 screenshot): the 2026 demand
  61-68 (broke the down line, removed 3 supplies, broke the previous highs: all three), the 2022 supply 107-123 (broke the
  2020-22 up line: direction), the Jan 2025 supply 72-80 (closed through the 2021 demand and made a lower low: removal +
  break).

---

## 2. The top-down algorithm

Run it on every redraw, for the chart's symbol, on **all** loaded history (never a sliding window: the result for a
given bar must not depend on how many older bars are loaded; section 10 test X1). The TF chain is fixed:

`3M -> MN -> W1 -> D1 -> H4 -> H1 -> M15` (3M is built from MN bars: Jan / Apr / Jul / Oct quarters). `parent(TF)` =
the TF before it. Every chart shows the whole chain from 3M down to the chart's TF.

### 2.1 Step 1, per TF: real pivots

Section 1.3. Output per pivot: bar, price, kind (peak / valley), role (impulse end / correction end), confirm bar.

### 2.2 Step 2, per TF: trend lines (the life cycle)

Down lines described; up lines mirrored (lows, higher lows, closes below).

1. **Structure start.** A down structure exists once a confirmed real lower high `C1` is followed by a break below the
   real valley between the top and `C1` (Kevin L5). `E` = the highest high before `C1` (the top).
2. **Line 1 (G1).** Anchor 1 = `E`, or a bar at most {p1Shift = 1} bar after `E`, whichever makes the line clean (no high
   between the anchors above the line). Anchor 2 = `C1`, moved to another bar between `C1` and its confirmation bar
   only if that bar's high is more than {fitTol = 0.10} x ATR above the line through `C1` (the hull touch; when the
   difference is within fitTol keep the pivot bar).
   - If no anchor-1 candidate gives a clean line, **the top is skipped**: Line 1 = `C1 -> C2` (the next confirmed real
     lower high). This is gold D1 (Aug 26-28 highs cut every Aug 25 -> Sep 3 line).
   - If the line is too flat (1.5), the newer pivot is the base: Line 1 starts at `C1`.
3. **While live, each closed bar:**
   - a) a CLOSE beyond -> **broken** at this bar (1.7), unless the fake-cross veto holds (then b).
   - b) a bar whose high pokes above the line and that is (or, within the veto, becomes) a new real lower high, followed
     by a new lower low within vetoBars -> **rotate about anchor 1**: anchor 2 = that pivot (hull touch as in step 2).
   - c) any other poke above without a close: a **fake cross**, count it as a touch, change nothing.
   Never redraw a live line for a new swing (Raja L4).
4. **After a break.** If the structure continues (the next confirmed real lower high `C'` formed after the break is
   below the broken line's REAL anchor-2 pivot), the next line = **that pivot -> `C'`** (chain from pivot 2, never from
   the old anchor 1). If the next real peak is at/above that pivot, the chain ends; a new down structure starts from
   its own top (step 1).
5. **Touches.** Count touches (a high within fitTol of the line, or a fake cross). Label `T<n>`; the 4th touch shows
   "4th touch - break likely" ([R] partA.ts:708, private.ts:726).
6. **History.** Broken lines are kept in the model (for tests) and drawn per section 3.

Worked through the owner's lines (all reproduce, except Q1/Q2):

| line | how it comes out of 2.2 |
|---|---|
| AUDUSD D1 Sep 9 -> Sep 23 (V) | G1 from the window top; anchor 2 = Sep 21 (Sep 23 is 0.05 ATR off: same line); broken Oct 9 |
| AUDUSD D1 Sep 21 -> Oct 14 (V) | chain from G1's pivot Sep 21 (not the Sep 23 touch) to the next lower high; broken Oct 20 |
| AUDUSD D1 Jul 29 -> Sep 2 (V) | Jul 13 -> Jul 29 too flat, so Jul 29 is anchor 1; Jul 29 -> Aug 19, Sep 1 close vetoed, rotated to Sep 2; broken Sep 10 |
| AUDUSD W1 Nov 22 -> Jan 17 -> Mar 28 (V) | G1 (anchor 1 shifted 1 bar off the Nov 15 low); broken Mar 21 (Mar 28 does not reclaim); chain from Jan 17 |
| AUDUSD W1 Jun 27 -> Jul 25 (V) | the May 9 -> May 30 down structure ended the old up chain; new up structure from the Jun 27 low |
| AUDUSD W1 May 9 -> May 30 (V) | top May 2: a May 2 -> May 23 line is cut by May 9, so anchor 1 = May 9 (p1Shift); anchor 2 = hull touch May 30 |
| AUDUSD W1 Jul 25 -> Sep 5, Sep 5 -> Sep 19 (V) | hull touch inside the confirmation window (Sep 5 low 0.13 ATR under the Aug 29-week line); Sep 19 = C1 of the Sep 5 top, kept through the Oct 10-week fake cross |
| AUDUSD H4 Oct 14 12:00 -> Oct 15 00:00 (V) | G1 from the window top, C1 within 3 bars |
| AUDUSD H4 Oct 15 16:00 -> Oct 21 00:00 (V) | G1 from the bottom, C1 = Oct 20 04:00 (Oct 21 00:00 = touch, 0.07 ATR); broken Oct 22 04:00 |
| AUDUSD H4 Oct 20 04:00 -> Oct 27 08:00 (V) | chain from Oct 20 04:00 to Oct 22 12:00; the Oct 27 00:00 close (0.12 ATR) vetoed (Oct 27 04:00 back at the line, HH Oct 28 00:00): rotated to the Oct 27 08:00 touch; broken Oct 29 12:00 |
| AUDUSD MN 2023-02 -> 2023-07, 2023-10 -> 2024-08, 2025-04 -> 2025-11 (V) | new structures from each extreme; anchors at confirmed real pivots |
| AUDUSD MN 2022-04 -> 2024-10 (V) | **not produced** (Q1) |
| gold W1 `2026-02-28` -> `2026-08-22` (V) | G1 top -> `2026-02-28` broken `2026-08-15` (veto fails: no LL within 8 bars); chain from `2026-02-28` to the first lower high after the break; passes above the `2026-04-11` lower high 4891.03 |
| gold D1 Sep 3 -> Sep 18 (V) | top skipped (not clean); C1 -> C2 |
| gold D1 up from Jul 29 (V) | G1 would be Jul 17 -> Jul 29 (rise 0.43 ATR, clean): **Q2** |

### 2.3 Step 3, per TF: momentum line

Section 1.6, for the newest impulse only. If it coincides with that TF's Line 1 (same anchor 1, anchor 2 within
fitTol), draw it once as the trend line.

### 2.4 Step 4, per TF: trend state

Section 1.9. Output: `UP` / `DOWN` / `SIDEWAYS`, `SL`/`SH`, `HHH`/`LLL`, the range edges for SIDEWAYS (the zones at
`HHH` and `SL`).

### 2.5 Step 5, top-down phases, the correcting TF and its target

1. For each TF from 3M down: `leg` (1.8), `phase` = impulse / correction against `trend(parent)`; when the parent is
   SIDEWAYS the phase is `in <P> range`; the 3M is judged against its own trend.
2. **Bias TF `B`** = the highest TF whose trend is UP or DOWN. Bias = LONG / SHORT. If a TF between `B` and the chart TF
   is SIDEWAYS, the highest such TF `S` controls the message (2.6).
3. **Correcting TF `C`** = the highest TF whose TREND is opposite to its parent's TREND (both not sideways). If none:
   the highest TF below 3M whose phase is `correction`. `P = parent(C)`.
4. **Target** = the realignment area of `C` (1.11). Its edge facing price is the **stop line for correction trades**.
5. A correction ends (`C` back with `P`) when `C`'s counter line (the gold W1 down line, 4436.67 now) is closed beyond
   AND 2 of `C`'s opposite zones are removed ([R] partA.ts:467), or when `C`'s trend flips by 1.9.

### 2.6 Step 6, allowed trades per TF

| situation | allowed | not allowed | source |
|---|---|---|---|
| no correction, no sideways between B and the TF | trades in the bias direction on any TF whose leg goes with its parent (impulse) | any counter trade on H4 and below | [R] partA.ts:927 "On H4 and below, catch only impulses"; [O] LEARNED.md:54 |
| correction `C` active, price outside the target | **correction trades** (in `C`'s direction) on `C` and its LTFs, only where the TF's leg goes with its own parent (impulse), TP before the target edge | bias-direction trades on `C` and below (except the next row) | [O] LEARNED.md:54-55; [R] partA.ts:902 "Corrections are risky ... Use them only on the monthly, weekly or daily"; [R] partA.ts:938 "the target is the demand, or the trendline if that is closer ... take profit before it" |
| price inside the target zone | bias-direction trades only after LTF confirmation (LTF trend line crossed by a close AND the last opposite LTF zone removed), or a close back across the proximal line | correction trades | [R] partA.ts L2 "Confirmation = on a lower timeframe, the trendline is crossed AND the last opposite zone is removed"; private.ts:520 "Two kinds of confirmation" |
| a TF `S` SIDEWAYS between B and the chart TF | zone to zone on the LTFs of `S` only, short-term, no holds | swing holds, limit orders at the range middle | [R] partA.ts:1265 "Never trade sideways"; [R] partB.ts L53 "In a range you cannot hold long term" |
| XAUUSD M15 and below | nothing (analysis only) | entries | [R] partB.ts L53/private.ts L107 "No XAUUSD on the low timeframes; use XAUAUD" |

### 2.7 Step 7, outputs

**A. STRUCTURE line** (bottom-left; one line; highest TF first; segments joined by `  |  `):

```
<TF> <TREND> <PHASE>[ -> <lo>-<hi>]
TREND  = UP | DOWN | SIDEWAYS
PHASE  = impulse | correction | in <P> range        (SIDEWAYS TFs print their range instead: SIDEWAYS <lo>-<hi>)
-> <lo>-<hi>  only on the correcting TF C: the target zone (prices at the symbol's digits; gold 2 dp, FX 5 dp)
```

**B. DIRECTION panel** (one message; every chart TF of the symbol shows the same text):

```
DIRECTION: <BIAS> | NOW: <NOW> | TARGET: <zone> (<why>) | THEN: <THEN> | FLIP: <condition>
BIAS   = LONG (<TFs> up) | SHORT (<TFs> down) | NONE (<S> sideways <lo>-<hi>)
NOW    = BUY impulse on <TFs>
       | SELL correction trades only on <TFs>, TP before <edge>          (LONG bias; mirrored for SHORT)
       | WAIT at <zone>: BUY on <LTF> confirmation
       | WAIT - zone to zone on <TFs> only
THEN   = what is allowed after the target / the range break
FLIP   = the close that changes BIAS (B's SL / SH) or ends the range
```

Rules: exactly one DIRECTION message; no quality words (FULL / REDUCED) on a correction trade; the NOW side must equal
the side 2.6 allows on the chart TF; the STRUCTURE line has at most one `->` and it sits on `C`; nothing in A or B may
contradict the other (tests I1-I5).

---

## 3. Drawing rules

| object | when | style |
|---|---|---|
| live trend line (this TF) | max 1 up + 1 down | solid, InpTrend colour, width 2 for the line used by `C`'s target, else 1; extends 3 bars past the last bar |
| broken trend line (this TF) | max 1 per direction, only if broken within the last {brokenShow = 20} bars | dotted, InpMuted, ends AT the break candle (the first close beyond) |
| momentum line | the newest impulse only; hidden 5 bars after its break | red, dashed, label `momentum` ([K] red = momentum) |
| HTF target line | on every LTF chart of `C` (the `P`-direction line of 1.11) | purple dashed, label `<TF> up line <value>` |
| real pivots | every confirmed real pivot of this TF | small dot: supply colour above peaks, demand colour below valleys |
| zones | as now (proximal/distal box), label `<pattern> <type> T<n>` e.g. `RBR CP T1`, `DBR arrival T2`, `DBD weak-overlap` | weak zones dashed |
| realignment target | on all TFs of the chain | purple box, label `REALIGN <TF> <lo>-<hi> (<TF> up line <value>)` |
| WOW area | after a removal, until filled or the next zone is removed | light band from the removed distal to the next proximal, label `WOW <pips>` |
| curve | HTF only, optional | thin dotted 25 / 50 / 75% lines |

Total lines per chart <= 6 (2 live, 2 broken, 1 momentum, 1 HTF target line). Swing lines that price has left for
`>= 30` bars and `>= 3 ATR` away are removed ([K] videoLessons.ts:2811 L19 "Price action must be seen around the
trendline for it to be considered valid"); the line that defines a realignment target is never removed this way (the
gold W1 2023 up line, section 9 C11).

---

## 4. Acceptance tests: AUDUSD (owner-marked; fixture `src/core/training/fixtures/marks.json`)

Matching rules for every row: pivot = same kind, bar +-1, price = that bar's high/low. Line = engine line value at the
owner's two anchor bars and at the break bar within 0.15 ATR of the owner's line, and break bar +-1. Zone = same side,
base bar +-1, box overlap >= 50% of the owner's box. Labels = exact strings (as of the chart's last bar).

### 4.1 AUDUSD MN (as of 2026-09)

| ID | item | expected | tag |
|---|---|---|---|
| A-MN-P | real pivots | 2022-04 P 0.76607; 2022-10 V 0.61695; 2023-02 P 0.71571; 2025-04 V 0.59130; 2026-05 P 0.72770 (owner list; other engine pivots allowed) | V |
| A-MN-L1 | down trend line | 2023-02 0.71571 -> 2023-07 0.68944, broken 2023-12 | V |
| A-MN-L2 | up trend line | 2023-10 0.62698 -> 2024-08 0.63478, broken 2024-12 | V |
| A-MN-L3 | up trend line | 2025-04 0.59130 -> 2025-11 0.64206, broken 2026-06 | V |
| A-MN-L4 | momentum line (up) | 2022-10 0.61695 -> 2022-11 0.62717, broken 2023-04 | V |
| A-MN-L5 | line 2022-04 0.76607 -> 2022-08 0.71362, broken 2022-11 | geometry required; label momentum (owner) vs trend (rule) | V / Q1 |
| A-MN-L6 | long down line 2022-04 0.76607 -> 2024-10 0.69341, broken 2025-12 | required only if Q1 = "major" | V / Q1 |
| A-MN-Z | zones | supply 2022-05..06 0.69036-0.72823 (CP/DBD, multi-touch); demand 2022-10 0.61695-0.63992; supply 2023-01 0.68139-0.71420; demand 2023-10 0.62698-0.64193; supply 2024-09 0.67619-0.69419 (pivot zone, removed 2026-01); supply 2024-11 0.65095-0.66873; demand 2025-05 0.63558-0.64278; demand 2025-11..12 0.64206-0.66716 typed **arrival** | V |
| A-MN-S | STRUCTURE segment | `MN UP correction -> 0.64206-0.66716` | I (owner note V: HL expected at that demand) |

### 4.2 AUDUSD W1 (as of `2026-10-17`)

| ID | item | expected | tag |
|---|---|---|---|
| A-W1-P | real pivots | `2025-10-25` P 0.66171; `2025-11-15` V 0.64206; `2026-01-03` P 0.67659; `2026-01-17` V 0.66675; `2026-03-07` P 0.71868; `2026-03-28` V 0.68328; `2026-05-02` P 0.72770; `2026-06-27` V 0.68647; `2026-09-05` P 0.72374 | V |
| A-W1-L1 | up | `2025-11-22` 0.64356 -> `2026-01-17` 0.66675, broken `2026-03-21` | V |
| A-W1-L2 | up (chain) | `2026-01-17` 0.66675 -> `2026-03-28` 0.68328, broken `2026-06-13` | V |
| A-W1-L3 | down | `2026-05-09` 0.72711 -> `2026-05-30` 0.71896, broken `2026-07-25` | V |
| A-W1-L4 | up | `2026-06-27` 0.68647 -> `2026-07-25` 0.69216, broken `2026-09-19` | V |
| A-W1-L5 | up | `2026-07-25` 0.69216 -> `2026-09-05` 0.71485 (touch), broken `2026-09-12` | V |
| A-W1-L6 | down | `2026-09-05` 0.72374 -> `2026-09-19` 0.71397, broken `2026-10-17` (NOT re-anchored to the `2026-10-10` wick) | V |
| A-W1-X | must NOT exist | an up line `2026-03-28` -> `2026-06-27` (the down structure in between ends the chain) | I |
| A-W1-Z | zones | demand `2025-11-15` 0.64206-0.65315 (DBR valley); demand `2025-12-13..20` 0.65918-0.67101 (RBR CP, strong); demand `2026-03-28` 0.68328-0.68875 (valley); supply `2026-05-02` 0.72088-0.72770 (RBD peak) | V |
| A-W1-W | WOW (conditional) | when a W1 close goes below 0.68328: WOW 0.68328 -> 0.67101, target the Dec 2025 CP demand | V |
| A-W1-S | STRUCTURE segment | `W1 SIDEWAYS 0.68328-0.72770` | V (owner: sideways) |

### 4.3 AUDUSD D1 (as of 2026-10-29)

| ID | item | expected | tag |
|---|---|---|---|
| A-D1-P | real pivots (all 13) | Jul 13 V 0.69126; Jul 21 P 0.70262; Jul 29 V 0.69216; Aug 17 P 0.71289; Aug 19 V 0.70662; Aug 28 P 0.72074; Sep 2 V 0.71209; Sep 9 P 0.72374; Sep 16 V 0.70744; Sep 21 P 0.71397; Oct 1 V 0.69033; Oct 14 P 0.70126; Oct 15 V 0.68935 | V |
| A-D1-N | must NOT be pivots | Aug 11 low 0.70380; Oct 6 high 0.69893; Oct 8 low 0.69322 | I |
| A-D1-L1 | up | Jul 29 0.69216 -> Sep 2 0.71209, broken Sep 10 (owner mark Sep 9) | V |
| A-D1-L2 | down | Sep 9 0.72374 -> Sep 23 0.71174 (Sep 21 anchor equivalent), broken Oct 9 | V |
| A-D1-L3 | down (chain) | Sep 21 0.71397 -> Oct 14 0.70126, broken Oct 20 | V |
| A-D1-X | must NOT exist | a line starting at Jul 13 (flat); a down line re-anchored Sep 9 -> Oct 14 | I |
| A-D1-Z | zones | demand Jul 13 0.69126-0.69469 (swing-low DBR, tested); demand Aug 10-11 0.70380-0.70737 (RBR); demand Aug 20 0.71016-0.71321 (3rd CP, respected once); demand Sep 2 0.71209-0.71694 (last CP, high curve, broken); supply Sep 15 0.71165-0.71407 (strong: removed two demands); supply Sep 21-22 0.70919-0.71397 (CP / PCP, high probability); demand Oct 16 0.69118-0.69430 | V |
| A-D1-S | STRUCTURE segment | `D1 UP in W1 range` (down structure broken by the Oct 21 close above SH 0.70126; HL Oct 22 0.69935, HH Oct 28/29) | I |

### 4.4 AUDUSD H4 (as of 2026-10-30 16:00)

| ID | item | expected | tag |
|---|---|---|---|
| A-H4-P | real pivots | Oct 13 12:00 V 0.69687 (window edge, optional); Oct 14 12:00 P 0.70126; Oct 15 16:00 V 0.68935; Oct 19 16:00 P 0.69924; Oct 20 04:00 V 0.69701; Oct 21 12:00 P 0.70354; Oct 22 12:00 V 0.69935; Oct 26 00:00 P 0.70392; Oct 27 00:00 V 0.70090; Oct 28 00:00 P 0.70542; Oct 28 12:00 V 0.70229; Oct 29 04:00 P 0.70675; Oct 29 16:00 V 0.70140; Oct 30 04:00 P 0.70425 | V |
| A-H4-N | must NOT be a pivot | Oct 16 20:00 low 0.69358 | V (owner omitted it) |
| A-H4-L1 | down | Oct 14 12:00 0.70126 -> Oct 15 00:00 0.69798, broken Oct 16 00:00; drawn as TREND (owner) | V |
| A-H4-L2 | up | Oct 15 16:00 0.68935 -> Oct 21 00:00 0.69945 (Oct 20 04:00 equivalent), broken Oct 22 04:00 (owner mark 00:00) | V |
| A-H4-L3 | up (chain + veto rotation) | Oct 20 04:00 0.69701 -> Oct 27 08:00 0.70114, broken Oct 29 12:00 | V |
| A-H4-Z | zones | supply Oct 14 04:00-08:00 0.69900-0.70113 (strong, later removed); demand Oct 15 16:00-Oct 16 00:00 0.68935-0.69209 (arrival: removed the down line, untapped); demand Oct 20 00:00-04:00 0.69701-0.69945; demand Oct 23 08:00 0.70043-0.70132; demand Oct 27 20:00 0.70229-0.70295; supply Oct 29 08:00 0.70374-0.70555 | V |
| A-H4-S | STRUCTURE segment | `H4 UP <phase>` with phase against D1 UP; no assertion on the phase word | I |

### 4.5 AUDUSD DIRECTION (all AUDUSD charts, as of 2026-10-30)

`DIRECTION: NONE (W1 sideways 0.68328-0.72770) | NOW: WAIT - zone to zone on D1/H4 only | TARGET: - | THEN: W1 close
< 0.68328 -> SELL to 0.67101 (WOW); W1 close > 0.72770 -> BUY | FLIP: a W1 close outside 0.68328-0.72770` (I; the
W1 sideways call and the WOW are V). The MN bias (UP, HL expected at 0.64206-0.66716) is shown in the STRUCTURE line.

---

## 5. Acceptance tests: XAUUSD (owner's TradingView / MT5 examples; qa/bars; pinned to the D1 close 2026-10-29, 4020.10)

**Owner gold marks 2026-10-30 (MN / W1 / D1 / H4 / H1 on the Train page, now in `src/core/training/fixtures/marks.json`)
override the rows below where they differ** (the executable rows are `src/core/structure/rows.ts`):
- MN: the live up line is **2022-10 1617.14 -> 2023-10 1810.32** (replaces G-MN-L's 2023-10 -> 2024-02); a live down line
  2026-01 5599.73 -> 2026-03 5419.41; the purple realignment zone is the **MN demand 2025-06..08 3241.91-3453.63**; momentum
  lines 2025-01 -> 2025-08, 2025-09 -> 2026-01, 2026-03 -> 2026-06.
- W1: down 2026-01-24 5599.73 -> 2026-02-28 5419.41 broken 2026-08-15; **down 2026-02-28 -> 2026-05-09 4773.23 broken
  2026-08-01** (the next line chains from pivot 2 while the first is still live; replaces G-W1-L1's live Feb 28 -> Aug 22);
  up 2026-07-11 3959.48 -> 2026-08-01 4018.97 broken 2026-09-26; live momentum 2026-08-29 -> 2026-09-19. The W1 window of the
  marks starts 2025-10-25, so the 2023 W1 up line (G-W1-L2) stays as written.
- D1: **a down TREND line from the top exists: Aug 25 4696.81 -> Sep 10 4434.80, broken Sep 17** (replaces G-D1-X1); the live
  line is Sep 3 -> Sep 18 (G-D1-L1); up Jul 17 -> Jul 29 broken Sep 28 (Q2 = a); a second up line Aug 4 4042.42 -> Aug 19
  4324.24 broken Aug 28; owner pivots P 07-10, V 07-17, P 07-22, V 07-29, P 08-13, V 08-14, P 08-25, V 09-02, P 09-03,
  V 09-16, P 09-18, **V 10-07 4066.16**, P 10-12, V 10-23, P 10-28 (replaces G-D1-P's V Sep 28); many momentum lines, one per
  impulse leg (all kept in the model for scoring; MT5 shows the live one + the one broken within 5 bars).
- H4: live down Oct 16 16:00 4198.96 -> Oct 19 08:00 4190.21 (nearly flat); up Oct 27 08:00 -> Oct 28 20:00 broken Oct 29
  08:00. H1: up Oct 27 13:00 -> Oct 28 22:00 broken Oct 29 08:00; live down Oct 28 23:00 4082.47 -> Oct 29 23:00 4032.40.
- H1 note: "when the bullish trendline crosses and the 1-2 demand zones are removed, we don't look to buy with limit order,
  we wait for confirmation for trend reversal, however we can sell as limit order on short side from potential supply
  zones" -> the DIRECTION NOW of a correction reads `SELL correction trades only on <TFs> (sell limits at supply, no buy
  limits), TP before <edge>`, and at the target `WAIT at <zone>: BUY on <LTF> confirmation (no buy limits)`.

### 5.1 Gold MN / 3M

| ID | item | expected | tag |
|---|---|---|---|
| G-3M-S | STRUCTURE segment | `3M UP correction` | V (owner: 3M up) / I (phase word) |
| G-MN-T | trend | UP: HHH 2026-01 5599.73, SL 2025-10 3819.08, no MN close below (lowest 4006.86) | V (owner: MN uptrend) / I (SL) |
| G-MN-L | live up line | 2023-10 1810.32 -> 2024-02 1984.11, value 3374.43 at 2026-10, unbroken | I |
| G-MN-X | must NOT exist live | the MN 2015-12 -> 2018-08 up line (stale); `MN impulse down` | V (owner) |
| G-MN-S | STRUCTURE segment | `MN UP correction` | V |

### 5.2 Gold W1

| ID | item | expected | tag |
|---|---|---|---|
| G-W1-T | trend | DOWN: SL `2025-12-27` 4273.31 closed below `2026-06-06`; then V `2026-06-27` 3941.55 and lower high `2026-08-22` 4696.81 | I |
| G-W1-P | real pivots | P `2026-01-24` 5599.73; V `2026-01-31` 4401.10; P `2026-02-28` 5419.41; V `2026-03-21` 4098.50; P `2026-04-11` 4891.03; V `2026-06-27` 3941.55; P `2026-08-22` 4696.81 | I |
| G-W1-L1 | live down line | `2026-02-28` 5419.41 -> `2026-08-22` 4696.81 (first lower high after the top -> the Aug lower high at the supply), passes above `2026-04-11` 4891.03; value 4436.67 at `2026-10-24`; unbroken | V (owner) |
| G-W1-L1x | broken down line | `2026-01-24` 5599.73 -> `2026-02-28` 5419.41, broken `2026-08-15` (close 4602.22); hidden (broken > 20 bars ago) | I |
| G-W1-L2 | live up line (the target line) | `2023-09-30` 1810.32 -> `2024-02-10` 1984.11, value **3273.81** at `2026-10-24`, unbroken; drawn width 2 and projected on D1/H4/H1 | V (owner: "long W1 up trend line from the Sep 2023 low") / I (anchor 2) |
| G-W1-X | must NOT exist | a live down line from the `2026-01-24` top (e.g. top -> `2026-08-22`) | V (owner) |
| G-W1-Z | realignment zone | W1 demand overlapping 3250-3480 by >= 50% (the `2025-04-19`..`2025-08-23` range base, bodies 3203.62-3439.89), pattern RBR / CP, fresh, label `REALIGN W1 ...` purple | V (owner purple ~3250-3480) |
| G-W1-S | STRUCTURE segment | `W1 DOWN correction -> 3250.00-3480.00` (the detector's own box edges are acceptable within the overlap rule) | V |

### 5.3 Gold D1

| ID | item | expected | tag |
|---|---|---|---|
| G-D1-P | real pivots | P Aug 25 4696.81; V Sep 2 4282.18; P Sep 3 4510.64; V Sep 16 4234.78; P Sep 18 4399.48; V Sep 28 4110.61; P Oct 28 4082.47 (pending/confirmed by Oct 29 low 4005.12); V Oct 23 3975.45 | I (Aug 25, Sep 3, Sep 18 = V) |
| G-D1-L1 | live down line | Sep 3 4510.64 -> Sep 18 4399.48 (the Sep 23 high is 0.002 ATR off: same line), respected by the Oct 12 (4217.14) / Oct 16 (4198.96) highs, value 4106.42 at Oct 29, unbroken | V (owner) |
| G-D1-X1 | must NOT exist | any down line anchored at Aug 25 4696.81 (e.g. Aug 25 -> Oct 16, the full-history 2.15 output); the top's momentum line Aug 25 -> Aug 28 (broken Sep 17) may exist in history only | V (owner: top skipped) |
| G-D1-L2 | up line | anchor 1 = Jul 29 3995.86 ("the first higher low after the July bottom" Jul 17 3959.48) | V / Q2 |
| G-D1-S | STRUCTURE segment | `D1 DOWN impulse` (LLL Oct 23 3975.45, SH Oct 16 4198.96 not closed above) | I |

### 5.4 Gold H4 / H1

| ID | item | expected | tag |
|---|---|---|---|
| G-H4-S | STRUCTURE segment | `H4 DOWN impulse` (LLL Oct 23 3975.45; SH Oct 21 4142.00 not closed above; last real pivot P Oct 28 4082.47) | I |
| G-H1-S | STRUCTURE segment | `H1 DOWN impulse` (lower highs 4082.47, 4064.69, 4039.14; lower lows to 4005.12) | I |
| G-H4-T | target shown | the purple REALIGN box and the W1 up line (3273.81) projected | V |
| G-M15 | M15 | analysis only; DIRECTION never offers an M15 entry on XAUUSD | V (Raja) |

### 5.5 Gold full outputs (every chart TF)

- STRUCTURE on the H1 chart:
  `3M UP correction  |  MN UP correction  |  W1 DOWN correction -> 3250.00-3480.00  |  D1 DOWN impulse  |  H4 DOWN impulse  |  H1 DOWN impulse` (V for 3M/MN/W1 words, I for the rest).
- DIRECTION (same on MN/W1/D1/H4/H1):
  `DIRECTION: LONG (3M/MN up) | NOW: SELL correction trades only on D1/H4/H1, TP before 3480.00 | TARGET: 3250.00-3480.00 (W1 RBR at the W1 up line 3273.81) | THEN: BUY at 3250.00-3480.00 on H4/H1 confirmation | FLIP: MN close < 3819.08` (V: the side logic; I: the exact numbers of FLIP).
- Must NOT appear anywhere: `LONG - FULL`, `with direction - FULL`, `MN impulse down`, `W1 impulse down`, a second
  direction readout (the 2.14 `Bias:` row or the old DIRECTION box), `correction trades only on H4 until 4106.42`.

---

## 6. Invariant tests (every chart, every symbol)

| ID | invariant |
|---|---|
| I1 | DIRECTION NOW side == the side 2.6 allows for the chart TF |
| I2 | no FULL / REDUCED / "with direction" wording on a correction trade; one DIRECTION message per symbol |
| I3 | STRUCTURE has at most one `->`, on the correcting TF; `impulse` never on a TF whose leg opposes its parent's trend |
| I4 | the chain always starts at 3M (an H1 chart prints 6 segments; none dropped when an HTF loads late: retry, never skip) |
| I5 | a line ends at its first close beyond (or veto); no live line has a close beyond it; no live line from an older anchor after a break (chain only) |
| X1 | window invariance: lines, pivots and labels for the last 80 bars are identical with 80, 200, 460 or all bars loaded (gold D1: 80-bar fixture and full qa/bars both give Sep 3 -> Sep 18) |
| X2 | port parity: zvReal.ts, RFX_ZoneCore.mqh (via `tools/telegram_bot/parity/mql_port.py`) and the Python ports give the same model on the fixtures |
| X3 | the score on the four AUDUSD charts (src/core/training scorer): pivot recall 100% (+-1 bar), trend-line recall 100% except Q-tagged rows, break bars exact or +-1 |

---

## 7. Why the code drifted (concrete, from the code at d9c90e4 / main c4e370b)

The full replay-backed audit is `docs/training/AUDIT_ZV215.md` (defects D1-D10). The short list, each with the spec
rule it breaks:

1. **Rules travelled as summaries.** LEARNED.md compresses the owner's marks into sentences, the code compresses the
   sentences again. Example: LEARNED.md:14 says the MN up momentum line "broke Mar 2023"; the owner's mark and the bars
   say Apr 2023. The 0.38 RC was tuned on four charts and then shipped as the definition (`ZR.rc`, zvReal.ts:36;
   `RS_RC`, RFX_ZoneCore.mqh:4091) although the owner said "about halfway" and his shallow pivots pass by the origin zone,
   not by depth (1.3).
2. **Three line engines.** zvTrend.ts (structure method, "the TOP is never a pivot", zvTrend.ts:12) feeds arrival.ts,
   the bot and the MT5 Direction/arrival code; zvReal.ts (`zrLines`, "pivot 1 = the bottom when ... its leg out is no
   impulse", zvReal.ts:13-14) feeds the 2.15 STRUCTURE drawing; the v1 MQL lines feed bias/Direction. On gold D1 (full
   qa/bars) they give three different down lines (zvTrend `2026-03-02 5419.41 -> 2026-08-25 4696.81`, zvReal
   `2026-08-25 4696.81 -> 2026-10-16 4198.96`, owner `Sep 3 -> Sep 18`). Spec: one model (2.2).
3. **Re-anchor from pivot 1 after a break.** zvReal.ts:17 / :190 "the next one re-anchors from pivot 1 and REPLACES the
   broken one" generalised one owner case (D1 Jul 29 -> Sep 2, which is really a vetoed fake cross). It produces the
   gold D1 line from the top. Spec: after a real break, chain from pivot 2 (2.2 step 4); rotation only under the veto.
4. **P1 by an impulse threshold.** `zrImpulse` (momEff 0.6 ATR/bar over 4 bars, zvReal.ts:135-142) decides whether the
   extreme anchors the line; it flips with broker data and with the window (the 200-bar window's extreme is the Jan 2026
   top, AUDIT D4). Spec: the clean-line test (2.2 step 2), no speed threshold.
5. **Window dependence.** `ZR.lookback = 200` and a path-dependent state machine started 200 bars back: the 80-bar gold
   D1 gives Sep 3 -> Sep 18, the full history gives Aug 25 -> Oct 16. Spec X1.
6. **Phase without the HTF.** `zrPhase` (zvReal.ts:210-224, RFX_ZoneCore.mqh:4289-4311) takes the trend from the TF's
   last two peaks and valleys and calls the leg impulse when it matches that. Gold today: `MN impulse down`,
   `W1 impulse down`, `D1 correction (up) -> D1 down trend 4081.05`, `H4 range` (replayed). Spec: 1.8 + 1.9 (structure
   low, phase vs parent).
7. **Truncated chain.** `RamanFX_ZoneVision.mq5:771` `while(nt < 4 && x > 0)`: an H4 chart never sees 3M, an H1 chart
   never sees MN. Spec I4.
8. **Two direction engines.** `DirCombine` (RFX_ZoneCore.mqh:1652-1702) builds `DIRECTION: LONG - FULL` from the v1
   swing/line states ("inside a fresh HTF zone" -> side; ETF agrees -> FULL) and knows nothing of the correction that
   RFX_STRUCT prints next to it. Spec 2.7 B (one message from the one model) + I1/I2.
9. **No realignment target.** arrival.ts:173-174 `realign` = the SAME-TF opposite weak zone nearest the HTF zvLines line
   (gold W1 has no zvTrend line at all, so nothing); `RjB_Realign` is off by default (`InpRjBRealign`) and pairs LTF
   zones; `zrPhaseText` targets the TF's own line. Spec 1.11 / 2.5.
10. **The zone engine cannot see the purple base.** `detect()` (zonecore.ts:62, `max_base 6`, `max_zone_atr 1.5`,
    `base_strict`, leg-out >= 1.2 x the biggest base candle): gold W1 demands between 3000 and 3600 = only
    `RBR 2025-03-29 2956-3093` (replayed). Spec 1.10 range bases.
11. **Stale lines.** zvReal draws the gold MN 2015-12 -> 2018-08 up line as live; nothing removes lines price left
    years ago, while the one old line that matters (W1 2023 up line) is never shown on lower TFs. Spec section 3.
12. **Momentum everywhere / nowhere.** zvReal adds a momentum line to every impulse pivot (`hist`), MT5 draws only the
    newest pivot's (AUDIT D5). Spec: the newest impulse, max one.

---

## 8. Tunables (the only knobs; defaults and evidence)

| name | default | evidence / range to test |
|---|---|---|
| RC | 0.45 | owner "about halfway"; owner pivots that pass by depth retrace 46-85%; 40% ones pass by R2. Try 0.40-0.50 |
| near | 0.25 ATR | R2 tolerance; H4 Oct 20 04:00 needs <= 0.16 ATR, H4 Oct 16 20:00 must fail at 0.8 ATR |
| minLeg | 1.25 ATR | as zvReal |
| p1Shift | 1 bar | W1 Nov 22 vs Nov 15, W1 May 9 vs May 2 |
| fitTol | 0.10 ATR | D1 Sep 23 (0.05) kept on the pivot; W1 Sep 5 (0.13) moves the anchor |
| minRise / minSlope | 0.25 ATR / 0.015 ATR per bar | MN Oct 2023 -> Aug 2024 rises 0.30 ATR (must pass); AUDUSD D1 Jul 13 -> Jul 29 0.02 (must fail); gold D1 Jul 17 -> Jul 29 0.43 (Q2) |
| vetoTol / vetoBars | 0.05 ATR / 8 bars | H4 Oct 27 04:00 at 0.03 ATR; HH after 6 H4 bars; gold W1 LL after 10 bars must NOT veto |
| momBars / momEff | 4 / 0.6 ATR per bar | owner "anchor 2 within 1-4 bars" |
| brokenShow | 20 bars | gold D1/W1 old top lines hidden |
| rangeBaseMax / rangeBaseATR | 20 candles / 2.5 ATR | gold W1 Apr-Aug 2025 base (18 candles, ~1.6 ATR by bodies) |
| targetGap | 1.0 ATR of C | target zone search around the line value |
| p1Retrace | 0.50 | Q1 "retrace" option only (2.16 input InpZmP1Retrace); fit counts at 0.38 / 0.45 / 0.50 / 0.60 in ZV216.md |

---

## 9. Conflicts and how they are resolved

| # | conflict | resolution |
|---|---|---|
| C1 | Where a line starts. [K] draws from the top (media/lesson05.ts:20 "From the Feb 2 top ... a shallower BLACK line"; zoomMedia/s06:19 "The first downtrend line from the top, slid down ... so wicks do not poke above it"). [O] gold: "from the first lower high". | Both, by geometry: the top anchors Line 1 only when the line is clean (Kevin's "slid so wicks do not poke"); otherwise, and after any real break, the line starts at the first lower high (owner). |
| C2 | A real pivot poking through a live line. [K] L5 redraws from the newer valley (media/lesson05.ts:150, chain). [O] AUDUSD D1 keeps pivot 1 (Jul 29 -> Sep 2). | Owner: rotate about anchor 1 under the veto (2.2 step 3b). Kevin's chain is used after a real break. |
| C3 | Wick re-anchoring. [K] L14 (videoLessons.ts:1870) re-anchors to a lone wick. [O] W1 Sep 5 -> Sep 19 kept through a 0.20 ATR wick. | Owner + [R] private.ts L107: after confirmation a wick is a fake cross; only fitTol touches inside the confirmation window move anchor 2. |
| C4 | What breaks a line. [R] L4/L54: a big departure candle. [O]: any first close (bodies 0.16-0.25 ATR count: MN 2023-04, W1 06-13, W1 07-25). | Owner: first close, plus the veto. |
| C5 | Direction change. [R] L3: line crossed + 2 opposite zones. [O] AUDUSD W1: sideways without either. | 1.9: structure low/high decides UP vs not; Kevin's LH+LL or Raja's line+2 zones decides DOWN; else SIDEWAYS. |
| C6 | Correction trades. [R] L5: only MN/W1/D1, impulses only on H4 and below. [O]: correction trades on the LTF of the correcting HTF, until its line/zone. | 2.6: correction trades on C and its LTFs only where each TF's own leg is an impulse relative to its parent; TP before the target. Both rules hold at once. |
| C7 | Momentum lines. [K] L5 "Do not draw momentum lines". [K] zoom s01:134, [R] L4 and [O] draw them. | Draw one (newest impulse), dashed red, never used for decisions. |
| C8 | Correction depth. [O] "about halfway". Marks 23-85%. zvReal 0.38. | RC 0.45 OR the origin zone (R2): the owner's two clauses as written. |
| C9 | Curve. [R] 0-25% bands; [K] golden area to 50%; [O] sheet "below 50%, best in the low curve". | Owner's sheet. |
| C10 | Base length. [R] L55: > 6 candles = weak. [O] uses an 18-week base as the realignment target. | Range bases allowed on W1/MN/3M for targets only (1.10); they are still "weak" for limit orders. |
| C11 | Stale lines. [K] L19 removes lines price left far behind. [O] the 2023 W1 up line is the target line. | Kevin for swing lines; never remove the line that defines a target. |
| C12 | Target after a correction. [R] L3 ("goes to the zone on the descending side, not to the nearby CP", partA.ts:136 area) vs [O] (the zone at the HTF line, CP included). | Owner for the realignment target; Raja's opposite arrival zone is the next target only after the realignment zone is removed (WOW, 1.12). |

---

## 10. Implementation notes (non-normative)

- One model object per symbol (`StructModel`: pivots, lines, momentum, trend, phases, C, target, allowed sides),
  computed once per redraw from all TFs; every drawing, label, alert and the bot read only this object. AUDIT_ZV215.md
  section 9 sketches the same design.
- Build 3M from MN in every port the same way (calendar quarters).
- Keep the fixtures: AUDUSD marks (V rows), the gold 80-bar D1 parity file and qa/bars (gold rows). Add the gold rows
  of section 5 as a fixture when the owner confirms Q2.

---

## 11. Open questions (few, concrete; the default applies until answered)

- **Q1. AUDUSD MN, the 2022 top.** The spec makes Aug 2022 (0.71362; a 46% pullback into the May-Jun 2022 CP supply) a
  real lower high, so Apr 2022 -> Aug 2022 is a trend line, and it draws no long line from the top. You labelled Apr ->
  Aug 2022 "momentum" and drew Apr 2022 -> Oct 2024 (0.69341, broken Dec 2025). By your gold rule the long line would
  start at the first lower high instead: Feb 2023 0.71571 -> Oct 2024, broken Jan 2026. Answer **"spec"** (keep the
  gold rule everywhere; A-MN-L5 is a trend line, A-MN-L6 dropped) or **"major"** (add one major line per TF from the
  absolute extreme to the newest confirmed lower high, and label the steep first-leg line momentum). Default: spec.
  A third option was added for testing (coordinator, 2026-10-30, not yet owner-confirmed): **"retrace"** = the extreme anchors
  Line 1 only when the first correction after it retraces >= {p1Retrace = 0.50} of the first leg, else extreme -> C1 is a
  momentum line and the trend line starts at C1 (gold MN 85% / gold D1 55% from the top, AUDUSD MN Apr -> Aug 2022 46% =
  momentum). The SPEC's own rule (2.2 step 2) decides by the clean-line test, not by depth. On the owner's AUDUSD + gold line
  rows it fits fewer rows than "spec" (docs/training/ZV216.md), so the default stays "spec".
- **Q2. Gold D1 up line. ANSWERED (owner gold marks 2026-10-30): option (a), Jul 17 3959.48 -> Jul 29 3995.86, broken
  Sep 28; G-D1-L2 is enabled.** The original question: The July bottom is Jul 17 3959.48; the first higher low Jul 29 3995.86 (82% pullback). A
  line Jul 17 -> Jul 29 is clean and rises 0.43 ATR, so the spec draws it (it breaks Sep 28). You said the up line starts
  at the first higher low. From Jul 29 the only clean line touches Aug 3 4018.97 (nearly flat; breaks Sep 16 by 1.5
  points); the clean line of the August rally is Aug 3 -> Aug 19 4324.24 (breaks Aug 28). Which one is your up line:
  (a) Jul 17 -> Jul 29, (b) Jul 29 -> Aug 3, (c) Aug 3 -> Aug 19? Default: (a), with G-D1-L2 disabled until answered.
