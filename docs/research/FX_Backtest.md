# FX backtest: do the live forex rules make money?

Generated 2026-10-27T02:47:18Z by `tools/fx_scanner/fx_backtest.py` on OANDA practice history.

Test period 2005-11-18T12:00 .. 2026-10-26T20:00 (forex time), in-sample = signals before 2020-07-15T15:12 (older 70%), out-of-sample after. 114 instruments, 3554165 H4 evaluations.

## Verdict

**Full rules: not proven: out-of-sample -0.34 R per trade, 95% CI -0.81..+0.25 includes zero.**

R = profit in units of the planned risk (entry to stop). Expectancy = average R per closed trade, after the spread (bid / ask fills). PF = gross win R / gross loss R. A 95% CI that includes 0 means the edge is not proven.

## Ablations (which filters remove false signals)

| variant | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (a) full rules | 230 | 180 | 79% | 14% | -0.21 | 0.76 | 47.6 | 17 | -0.49..+0.10 | -0.16 (133) | -0.34 (47) |
| (b) without top-down nesting | 2421 | 1903 | 79% | 15% | -0.19 | 0.78 | 388.5 | 37 | -0.29..-0.08 | -0.17 (1224) | -0.24 (679) |
| (c) without spread filter | 332 | 264 | 80% | 13% | -0.27 | 0.69 | 75.0 | 21 | -0.52..-0.01 | -0.24 (188) | -0.34 (76) |
| (d) watchlist majors only | 24 | 17 | 71% | 24% | +0.34 | 1.44 | 11.0 | 11 | -0.69..+1.58 | -0.39 (13) | +2.69 (4) |

## Full rules by class

| class | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| commodities | 16 | 12 | 75% | 17% | -0.34 | 0.60 | 6.2 | 6 | -1.03..+0.65 | -0.11 (9) | -1.05 (3) |
| crosses | 32 | 26 | 81% | 15% | -0.06 | 0.92 | 9.0 | 7 | -0.89..+1.11 | +0.16 (21) | -1.00 (5) |
| exotics | 48 | 34 | 74% | 18% | -0.10 | 0.87 | 15.0 | 15 | -0.72..+0.66 | -0.20 (26) | +0.20 (8) |
| indices | 58 | 50 | 86% | 10% | -0.39 | 0.57 | 21.7 | 12 | -0.87..+0.24 | -0.33 (35) | -0.54 (15) |
| majors | 24 | 17 | 71% | 24% | +0.34 | 1.44 | 11.0 | 11 | -0.69..+1.58 | -0.39 (13) | +2.69 (4) |
| metals | 39 | 31 | 80% | 13% | -0.31 | 0.64 | 17.4 | 14 | -0.87..+0.43 | -0.03 (22) | -1.00 (9) |
| minors | 13 | 10 | 77% | 10% | -0.45 | 0.50 | 6.0 | 6 | -1.00..+0.65 | -0.22 (7) | -1.00 (3) |

## Full rules by entry TF

| entry TF | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | 59 | 49 | 83% | 20% | +0.19 | 1.24 | 11.4 | 11 | -0.46..+0.97 | +0.07 (33) | +0.43 (16) |
| H4 | 86 | 71 | 83% | 16% | -0.25 | 0.71 | 31.4 | 16 | -0.64..+0.22 | -0.00 (45) | -0.68 (26) |
| MN | 65 | 44 | 70% | 9% | -0.39 | 0.58 | 22.1 | 21 | -0.92..+0.30 | -0.31 (39) | -1.03 (5) |
| W1 | 20 | 16 | 80% | 6% | -0.73 | 0.22 | 12.0 | 12 | -1.00..-0.19 | -0.73 (16) | - (0) |

## Full rules by zone type

| zone type | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ARR | 129 | 102 | 80% | 17% | -0.18 | 0.78 | 30.0 | 16 | -0.54..+0.22 | -0.23 (73) | -0.07 (29) |
| STR | 17 | 12 | 76% | 17% | +0.56 | 1.67 | 5.0 | 5 | -1.00..+3.02 | +0.87 (10) | -1.00 (2) |
| WOW | 84 | 66 | 79% | 11% | -0.38 | 0.57 | 25.3 | 16 | -0.79..+0.12 | -0.27 (50) | -0.75 (16) |

## Full rules by pattern

| pattern | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DBD | 55 | 42 | 76% | 10% | -0.33 | 0.63 | 25.2 | 25 | -0.89..+0.41 | -0.21 (29) | -0.61 (13) |
| DBR | 56 | 48 | 86% | 17% | -0.06 | 0.93 | 10.6 | 9 | -0.65..+0.60 | -0.01 (40) | -0.33 (8) |
| RBD | 94 | 73 | 80% | 18% | -0.10 | 0.87 | 20.4 | 15 | -0.56..+0.41 | +0.02 (48) | -0.34 (25) |
| RBR | 25 | 17 | 68% | 6% | -0.75 | 0.20 | 16.0 | 16 | -1.00..-0.25 | -1.00 (16) | +3.27 (1) |

## Full rules by Raja score

| Raja score | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6-7 | 5 | 4 | 100% | 25% | +0.66 | 1.88 | 3.0 | 3 | - | +0.66 (4) | - (0) |
| 8-10 | 225 | 176 | 79% | 14% | -0.23 | 0.74 | 52.3 | 18 | -0.51..+0.12 | -0.19 (129) | -0.34 (47) |

## Full rules by side

| side | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BUY | 81 | 65 | 80% | 14% | -0.24 | 0.72 | 20.2 | 12 | -0.69..+0.28 | -0.29 (56) | +0.07 (9) |
| SELL | 149 | 115 | 78% | 15% | -0.19 | 0.78 | 31.9 | 15 | -0.56..+0.22 | -0.07 (77) | -0.43 (38) |

## Method

* Signals: `fxcore.analyse` + `fxcore.signals` (the live scanner code) at every H4 close, on the H4 / D1 / W1 / MN bars closed at that moment (same history caps as the scanner) and the typical spread of the last 50 H4 closes. One order per zone (TF, side, base start), placed at the close of the signal bar.
* Order: limit at the proximal, the scanner's stop (distal + % of height) and target (before the next opposite zone, else the 250% projection). Expiry {'H4': 5, 'D1': 15, 'W1': 45, 'MN': 120} days per entry TF; cancelled when a close removes the zone (beyond the distal) or price reaches the target first.
* Fills on H4 bid / ask: BUY fills when the ask reaches the entry, exits on the bid (SELL mirrored), so the spread is paid. Conservative: fill bar = stop check only, stop before target in one candle, gap through the stop exits at the open, no price improvement on fills.
* Ablation (b) / (c) turn the location (top-down nesting) / spread rule from FAIL into INFO; (d) is the subset of (a) on the watchlist majors (all majors when the watchlist has none).
* Classes: majors = USD vs G8; minors = crosses of EUR / GBP / JPY / CHF; crosses = other G8 crosses; exotics; metals; indices / commodities (CFDs, only with --include-cfd or on the watchlist).
* Bootstrap: 2000 resamples of the closed-trade R list (percentile 95% CI).
* Caveats: OANDA prices, not Pepperstone; no swap / commission; trades still open at the end are excluded (listed as open); early years have shorter D1 history than the live scanner (cache since 2005).

Not financial advice. Past results do not guarantee future results.
