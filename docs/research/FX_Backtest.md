# FX backtest: do the live forex rules make money?

Generated 2026-10-27T11:01:42Z by `tools/fx_scanner/fx_backtest.py` on OANDA practice history.

Test period 2005-11-18T12:00 .. 2026-10-27T04:00 (forex time), in-sample = signals before 2020-07-15T20:48 (older 70%), out-of-sample after. 115 instruments, 3560220 H4 evaluations.

## Verdict

**Full rules: not enough out-of-sample trades (0) to judge.**

R = profit in units of the planned risk (entry to stop). Expectancy = average R per closed trade, after the spread (bid / ask fills). PF = gross win R / gross loss R. A 95% CI that includes 0 means the edge is not proven.

## Ablations (which filters remove false signals)

| variant | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (a) full rules | 0 | 0 | - | - | - | - | 0.0 | 0 | - | - (0) | - (0) |
| (b) without top-down nesting | 70 | 52 | 74% | 15% | -0.38 | 0.56 | 23.8 | 10 | -0.77..+0.06 | -0.58 (38) | +0.18 (14) |
| (c) without spread filter | 0 | 0 | - | - | - | - | 0.0 | 0 | - | - (0) | - (0) |
| (d) watchlist majors only | 0 | 0 | - | - | - | - | 0.0 | 0 | - | - (0) | - (0) |

## Full rules by class

| class | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Full rules by entry TF

| entry TF | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Full rules by zone type

| zone type | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Full rules by pattern

| pattern | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Full rules by Raja score

| Raja score | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Full rules by side

| side | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Method

* Signals: `fxcore.analyse` + `fxcore.signals` (the live scanner code) at every H4 close, on the H4 / D1 / W1 / MN bars closed at that moment (same history caps as the scanner) and the typical spread of the last 50 H4 closes. One order per zone (TF, side, base start), placed at the close of the signal bar.
* Order: limit at the proximal, the scanner's stop (distal + % of height) and target (before the next opposite zone, else the 250% projection). Expiry {'H4': 5, 'D1': 15, 'W1': 45, 'MN': 120} days per entry TF; cancelled when a close removes the zone (beyond the distal) or price reaches the target first.
* Fills on H4 bid / ask: BUY fills when the ask reaches the entry, exits on the bid (SELL mirrored), so the spread is paid. Conservative: fill bar = stop check only, stop before target in one candle, gap through the stop exits at the open, no price improvement on fills.
* Ablation (b) / (c) turn the location (top-down nesting) / spread rule from FAIL into INFO; (d) is the subset of (a) on the watchlist majors (all majors when the watchlist has none).
* Classes: majors = USD vs G8; minors = crosses of EUR / GBP / JPY / CHF; crosses = other G8 crosses; exotics; metals; indices / commodities (CFDs, only with --include-cfd or on the watchlist).
* Bootstrap: 2000 resamples of the closed-trade R list (percentile 95% CI).
* Caveats: OANDA prices, not Pepperstone; no swap / commission; trades still open at the end are excluded (listed as open); early years have shorter D1 history than the live scanner (cache since 2005).

Not financial advice. Past results do not guarantee future results.
