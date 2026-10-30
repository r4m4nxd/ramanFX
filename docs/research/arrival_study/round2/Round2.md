# Arrival study, round 2: "my mentors are profitable with the same principles. What are we missing?"

Run 2026-10-30 (GitHub Actions run 41086359716, `tools/research/arrival_study/round2.py`, OANDA practice prices).
Every table here comes from the generated evidence file [Round2_data.md](Round2_data.md). It is rebuilt on each run
and holds every table, the feature tables, the models and the full walk-forward grid.

## The answer in plain English

**We could not find a missing rule, because the mentor's own calls show no measurable edge either.**

1. **Kevin's real calls, traded exactly as he called them, roughly break even.** We took his 349 testable zone
   calls (Jul–Oct 2026). Each one became a limit at his proximal with the stop past his distal, on 5-minute bars.
   116 were filled. At a fixed 2R target they won **36%** of the time and averaged **−0.02R per trade**
   (95% CI −0.29 … +0.22). Before costs that is +0.06R; the spread costs about 0.07R per trade. With a 1R or 3R
   target, partials or a trailing stop the result was slightly worse.
2. **The simulator is not the problem.** We compared it with what Kevin himself reported later. Of the trades he
   said he **won**, the back-test also wins 15 and loses 4. Of the trades he said he **lost**, it loses 15 and wins
   3. He followed up on only 116 of his 880 calls, and mentioned wins about twice as often as losses (82 vs 38).
   That reporting bias, plus his choice of which charts to show, explains why his calls *feel* profitable.
3. **His direction calls are a coin flip at our horizon.** For all 826 directional calls (zones and trend-line
   calls), price moved 1 ATR his way before 1 ATR against him **51%** of the time.
4. **His setups do look different from ours, but the differences don't predict wins.** Compared with our
   arrivals, his zones are:
   - more often with the HTF structure (45% vs 29%) and less often against it (30% vs 49%)
   - wider (1.0 vs 0.6 ATR), older (32 bars vs 2) and drawn further from price (3.5 vs 1.8 ATR)
   - more often nested in an HTF zone (34% vs 20%), with more room to the opposite zone (4.9R vs 3.0R)

   Inside his own trades none of these splits winners from losers. His with-HTF-structure trades did *worse*
   (−0.27R, n=49) than his counter-structure ones (+0.38R, n=42). Imposing the same features on 35,000 of our zones
   doesn't create an edge either (section 4).
5. **No filter or management choice holds out of sample.** We tried 15 Raja/Kevin filters × 6 management styles on
   arrivals, LTF-confirmation entries and every zone. Seven variants looked positive in 2010–2019. **All seven were
   negative in 2020–2026.** Simple models fitted on the setup features have no skill on the later years: AUC 0.48
   on arrivals and 0.51 on all zones (0.50 = a coin).

**So what is "missing"?** It is not a measurable principle. It is the discretion that the calls don't record: which
calls he actually takes, how much he risks and when he gets out by hand. It is also the costs: every zone population
we tested is close to zero *before* the spread. Mechanical zone trading on these rules sits at −0.05 … −0.10R per
trade after costs, across 16 years and ~100 instruments.

There is one weak lead, worth a forward test but not money. Kevin's calls where **he drew both edges of the zone**
(74 trades) did +0.25R at 2R with a 45% win rate. That is positive in Jul, Aug and Sep and −0.40R in Oct, and the
CI still includes zero (−0.17 … +0.65). The calls where he gave only one price did −0.52R (41 trades). A precisely
drawn H1/H4 zone may be the closest thing to "the missing piece" this data can show, but four months is not proof.

## Headline numbers

| population (2R target unless stated) | setups | filled | win % | avg R | 95% CI (week blocks) | PF |
|---|---|---|---|---|---|---|
| **Kevin: every zone call** (Jul–Oct 2026, M5 bars) | 349 | 116 (33%) | 36 | **−0.02** | −0.29 … +0.22 | 0.97 |
| Kevin: both zone edges drawn | 223 | 74 | 45 | +0.25 | −0.17 … +0.65 | 1.44 |
| Kevin: proximal only (distal estimated) | 126 | 41 | 20 | −0.52 | −0.88 … −0.08 | 0.41 |
| Kevin: valid on the plan day only | 349 | 59 (17%) | 29 | −0.25 | −0.54 … +0.02 | 0.67 |
| **Our arrivals** (MN/W1 2005+, D1/H4 2010+, finer-bar sim) | 2,022 | 776 (38%) | 34 | **−0.10** | −0.21 … +0.00 | 0.86 |
| Our arrivals, plan target (round-1 rule, now on M15/H1) | 2,022 | 851 | 19 | −0.15 | −0.32 … +0.04 | 0.84 |
| D1 arrivals | 356 | 134 | 40 | +0.14 | −0.15 … +0.42 | 1.23 |
| H4 arrivals | 1,548 | 587 | 33 | −0.15 | −0.27 … −0.02 | 0.80 |
| W1 arrivals | 98 | 51 | 27 | −0.21 | −0.62 … +0.21 | 0.72 |
| **LTF structure-break entries** (H4→M15, D1→H1, W1→H4) | 502 | 145 | 37 | **−0.22** | −0.48 … +0.03 | 0.73 |
| LTF arrival confirmations (strict Raja rule) | 28 | 8 | 25 | −0.58 | n < 20 | 0.39 |
| **Every fresh zone** (29 majors/crosses/gold, D1+H4, 2010+) | 65,124 | 35,074 | 33 | **−0.09** | −0.11 … −0.07 | 0.88 |

"Week blocks" CI resamples whole calendar weeks, because correlated USD pairs fill together. It is the honest one.
The round-1 hints did not survive the bigger sample. FX demand arrivals went from +0.21R (n=100) to −0.01R (n=320).
The fixed-2R baseline went from −0.01R (159 trades) to −0.10R (776 trades).

![Expectancy by population and management](r2_expectancy.png)

## 1. Kevin's calls, back-tested

- **Source:** `tools/kevin_daily/calls.json`: 880 calls from 63 recorded daily breakdowns (plan days 2026-07-09 …
  2026-10-29). 426 name a price. Of those, 349 were testable; 56 more had a proximal over 3% from the OANDA price
  (a chart misread or another feed), 16 were DXY (no OANDA instrument) and 5 were already broken at the recording.
- **Rules:**
  - Limit at his proximal, placed at the recording time read as US Eastern, the latest possible reading, so there
    is no look-ahead.
  - Valid for the plan day + 2 trading days.
  - Stop = his distal + the stop-rule buffer (max(0.1 ATR14, spread)). When he gave no distal, we used the median
    height of his own drawn zones (about 1 ATR of his TF).
  - He names almost no targets (3 of 880), so the target is a variant.
  - Simulated on OANDA M5 bars; stop first inside one 5-minute bar; spread charged.

| management | filled | win % | avg R | 95% CI |
|---|---|---|---|---|
| fixed 1R | 116 | 50 | −0.09 | −0.28 … +0.07 |
| **fixed 2R** | 115 | 36 | **−0.02** | −0.29 … +0.22 |
| fixed 3R | 114 | 25 | −0.12 | −0.54 … +0.26 |
| half at 1R + break-even, rest 3R | 115 | 48 | −0.11 | −0.33 … +0.09 |
| break-even at 1R, then 1R trail | 116 | 42 | −0.09 | −0.29 … +0.09 |
| nearest opposite zone | 79 | 22 | −0.08 | −0.61 … +0.43 |

**By zone TF (2R):**

| zone TF | filled | win % | avg R |
|---|---|---|---|
| H1 | 69 | 38 | +0.03 |
| H4 | 38 | 34 | −0.03 |

**By direction (2R):**

| direction | win % | avg R |
|---|---|---|
| long | 35 | −0.05 |
| short | 37 | +0.02 |

**By plan month (2R):**

| month | trades | avg R |
|---|---|---|
| Jul | 20 | +0.53 |
| Aug | 21 | −0.10 |
| Sep | 37 | +0.04 |
| Oct | 37 | −0.35 |

- **Instruments:** too few trades each to rank (5–19 fills). EURUSD (−0.70R, 15) and USDCAD (−0.36R, 15) were the
  worst, AUDUSD (+0.40R, 12) the best.
- **His confidence:** "high" did −0.06R (81 trades) and "med" did +0.13R (27); confidence did not rank the trades.
- **Fill rate:** only 33% of his limits were reached within 3 days (17% on the plan day). Most of his zones are
  3.5 ATR away when he names them.

**Selection bias, said plainly.** These are the charts he chose to present, and prices were read off his video frames.
His follow-ups favour wins. Four months is one market regime. So this sample, if anything, flatters him. The result
is still break-even.

## 2. What differs between his setups and ours (at the moment the order is placed)

| feature | Kevin calls | our arrivals | every zone |
|---|---|---|---|
| with the HTF structure (HH+HL for buys) | 45% | 29% | 39% |
| against the HTF structure | 30% | **49%** | 37% |
| against the entry-TF trend line | 6% | 11% | 2% |
| in HTF discount (buys) / premium (sells) | 61% | 69% | 49% |
| nested in a same-side HTF zone | 34% | 20% | 10% |
| room to the opposite zone (median, R) | 4.9 | 3.0 | 2.0 |
| zone height (median, ATR) | 1.0 | 0.6 | 0.6 |
| zone age when placed (median, bars) | 32 | 2 | 2 |
| distance price → entry when placed (median, ATR) | 3.5 | 1.8 | 1.1 |
| zone also found by our detector | 41% | 100% | 100% |

The structural difference is real. **An arrival is a counter-trend trade by construction:** the leg-out has to
break the trend line against it. Kevin mostly trades pullbacks to older, wider zones in the direction of the
structure. Only 41% of his zones are zones our detector would draw at all.

None of it explains the outcomes, though:

- Within Kevin's trades, every univariate split has a CI that spans zero, and several go the "wrong" way:
  with-HTF-structure −0.27R vs against +0.38R, and nested −0.24R vs not nested +0.08R.
- Within our arrivals, no bucket is reliably positive.
- Among the 35,000 control zones, the best single filter ("nested in an HTF zone") is −0.03R. "With HTF structure"
  is −0.10R and "HTF structure + discount" is −0.13R.

![Setup profile](r2_profile.png)

## 3. LTF confirmation, finally with data

This time we fetched M15 / H1 windows from OANDA, one window per setup and cached.

- **The strict Raja confirmation is too rare to trade.** It needs an LTF arrival (LTF trend-line cross + an
  opposite LTF zone removed) at the zone within a few TF bars. That happened only 28 times in 2,002 checked
  arrivals (8 fills).
- **We also tested a looser, Kevin-style "15m longs off the 4H zone" entry.** After the touch, the first LTF close
  that removes an opposite LTF zone triggers it; entry is a limit at the newest same-side LTF zone, with an LTF stop.
  It found 502 setups and 145 fills: **−0.22R** at 2R (37% win).

| TF pair | fills | avg R (2R) | 95% CI |
|---|---|---|---|
| H4→M15 | 112 | −0.31 | −0.59 … −0.04 |
| D1→H1 | 23 | +0.23 | n small |
| W1→H4 | 10 | −0.23 | n small |

- **Tight LTF stops make the cost drag worse, not better.** At the arrival zone, the confirmation entry pays the
  spread on a much smaller R.
- **The round-1 realignment confirmation (the other side) happened once.**

## 4. Walk-forward: choose on 2010–2019, judge on 2020–2026

We tried 15 filters fixed in advance × 6 managements on each population; the full grid is in Round2_data.md
section 6. A variant was "picked" when its train-years expectancy was > 0 with ≥ 30 trades:

| picked on train (avg R, trades) | train | test 2020–26 |
|---|---|---|
| arrivals, nested in HTF zone, plan target | +0.14 (90) | −0.47 (69) |
| arrivals, HTF deep (loc ≤ 25), opposite-zone target | +0.10 (195) | −0.45 (137) |
| arrivals, nested, half at 1R + BE | +0.07 (96) | −0.19 (68) |
| arrivals, HTF deep, plan target | +0.06 (241) | −0.28 (157) |
| arrivals, nested, 2R | +0.03 (96) | −0.24 (68) |
| every zone, nested in HTF zone, 3R | +0.02 (2,418) | −0.04 (1,562) |
| arrivals, HTF structure + discount + strong leg, plan target | +0.02 (51) | −0.02 (40) |

**0 of 7 hold out of sample.** The logistic regression and the depth-2 tree tell the same story: they fit the
2010–2019 trades (train AUC 0.64) and are useless on 2020–2026 (0.48).

![Walk-forward](r2_walkforward.png)

![Out-of-sample equity](r2_equity_test.png)

## Recommended rule set

**None of the tested rules earned a "trade this" label.** The brief was to keep only filters that hold out of
sample, and no filter did. What the evidence supports:

1. **Treat arrival / zone alerts as watch-list items, not signals.** As a population they lose about 0.1R per trade
   after costs at every target style.
2. **Cost hygiene.** In the 35k-zone control (2010–2019 fit), stops under 0.6 ATR did −0.23R vs −0.05R for stops over 0.84 ATR.
   Most of that gap is the spread eating a small R. A rule like "skip when the spread is more than ~5% of the
   risk" reduces losses; it does not create an edge.
3. **One hypothesis to forward-test, not to trade:** Kevin-style precisely drawn H1/H4 zones (both edges), limit at
   the proximal, stop past the distal, fixed 2R. That was +0.25R over 74 trades with the CI still spanning 0. Keep
   a journal for ~3 months and promote it only with ≥ 50 new trades and a CI above zero. D1 arrivals at 2R
   (+0.14R, n=134, CI spans 0) are a second, weaker candidate.

## What to change in the live alerts (proposal: not applied; needs approval)

1. **Tag every alert with its tested numbers** for its TF / kind, e.g. "H4 arrival: tested 2010–2026, 33% win at
   2R, −0.15R/trade (n=587)". Then nobody reads an alert as a proven edge.
2. **No alert kind currently qualifies to be sent as "trade"** under the rule "only variants with positive
   out-of-sample expectancy". Send them as "watch" (or not at all) until a forward test qualifies one.
3. **Don't add LTF-confirmation trade alerts** (structure-break: −0.22R; the strict version is too rare).
4. **Don't rank cards higher for "⭐ also in Kevin's plan".** His zones, traded mechanically, did −0.02R. Keep the
   star as information only.
5. **Add a cost guard** to the stop rule's output: flag or skip when spread / risk > 5%.
6. **Start a paper forward test of the two candidates above, logged automatically**, so the next round has
   out-of-sample evidence instead of opinions.

## Method notes and caveats

- **Arrivals:** the live rule (`arrival.py`), with each candidate re-read at the bar it became true. H4 now uses
  full history since 2010; trades are simulated on finer bars (H4→M15, D1→H1, W1→H4, MN→D1). Re-simulating the
  round-1 plan target on the finer bars gives −0.15R vs −0.16R on round-1 bars, so round 1's "stop first on daily
  bars" did not cause the losses.
- **Time exits:** trades that time out (100 TF bars) are now counted at their exit price.
- **Fills:** the limit fills at its price, and the fill bar can only stop out. One cancel level (price ran 2R away
  before the fill) applies to every management, so variants compare the same fills. A far limit is not cancelled
  by a level price had already passed when the order was placed.
- **Correlation:** many FX pairs move together. Use the week-block CI.
- **Kevin's timing:** his recording time is read as US Eastern. If he records in London, the orders are placed
  about 5 hours late, so a few early fills are missed.
- **Kevin's prices:** OANDA's feed differs slightly from his, most for indices, oil and gas.
- **Not modelled:** swaps, slippage, news. Only NFP week is a feature; the TradingView calendar in the repo has too
  little history for 2010–2026.
- **Many variants were tried** (15 filters × 6 managements × 4 populations), so some winners on train are luck; this
  is exactly what the out-of-sample column shows.
- **Reproduce:** run Actions → "Arrival study" with round = 2. The outputs go to
  `docs/research/arrival_study/round2/` on the `data` branch. The per-setup rows are in the run's artifact
  (`round2_rows.json.gz`).
