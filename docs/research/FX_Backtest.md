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

## Experiments: the current rules with ONE change each

From the next run (`.github/workflows/fx-backtest.yml`, monthly on the 2nd) this report gets a results table per variant (in-sample / out-of-sample n, expectancy, 95% CI, PF, max drawdown, MFE / MAE, bars held) and `public/learn/fx_experiments.json` for the auto-learner (`tools/learn/learner.py`), which adopts a variant only when it beats `current` out of sample. Signals are computed once per H4 close and shared; a variant only filters them / changes the order plan (`tools/fx_scanner/fxexperiments.py`, the same pure functions the live scanner can import) and re-runs the fill / exit simulation with the same bid / ask, spread and stop-first rules.

The matrix runs on three bases in the same run: `current` (the live rules), `no_nesting` (top-down location rule ignored) and `loose` (location + spread rules ignored). The strictest base with >= 150 in-sample trades (else the one with the most trades) becomes the baseline of `public/learn/fx_experiments.json` (`baseline` / `base_rules`, with every base's trade counts under `bases`); all three matrices go to `public/learn/fx_experiments_all.json`. The last real run had 0 trades on `current`, so the baseline is expected to be a looser base until the rules produce trades.

### `current` (baseline)

The live rules unchanged (the baseline every variant is compared with). fxcore.signals unchanged: every rule passes, one BUY / SELL per (TF, side) = the zone nearest to price, limit at the proximal (+ spread on a buy), the scanner's stop and target.

### `be_1r` (exit)

Move the stop to the entry once the trade has been +1R in profit. Once the best exit-side excursion since the fill (bars after the fill bar) reaches +1.0R, the stop moves to the entry (exit at R = 0, a gap through it exits at the open). Checked at each H4 close, applies from the next bar; the bar that reaches +1R cannot also be stopped at break-even (unknown intra-bar order).

### `be_2r` (exit)

Move the stop to the entry once the trade has been +2R in profit. As be_1r with the trigger at +2.0R.

### `be_struct` (exit)

After +1.5R, move the stop to the lowest low (buy) / highest high (sell) since the fill, only ever tightening. Once the excursion reached +1.5R, the stop moves to the lowest bid low (buy) / highest ask high (sell) of the H4 bars since the fill (the fill bar included: its low comes at / after the fill), only ever tightening. The extreme of the entry-TF bars since the fill equals the extreme of their H4 bars, so H4 bars are used for every entry TF.

### `time_stop` (exit)

Close the trade at the bar close if it has not reached +1R within 10 entry-timeframe bars after the fill. If +1R was never reached, the trade closes at the bid (buy) / ask (sell) close of the 10th entry-TF bar after the fill bar (H4 entry 10 H4 bars, D1 entry 60 H4 bars = 10 forex days); stop / target are checked first in that bar.

### `tp_fixed3` (exit)

Target exactly 3R instead of the next opposite zone. Target = entry + 3 x (entry - stop) (sell mirrored); the pending order is "missed" when that target trades first, as for the scanner target.

### `tp_zone` (exit)

Target just before the nearest opposite zone of the entry timeframe or higher; skip the trade if that is under 2.5R. Target = 7 pips (fxcfg.TP_OFFSET_PIPS) before the nearest not-removed opposite zone of the entry TF or higher (H4 entry: H4, D1, W1, MN, 3M; a D1 entry ignores H4 zones) whose proximal is beyond the entry (sell: + spread), from the zones at signal time; no such zone or < 2.5R -> the signal is skipped.

### `fresh_body` (freshness)

A zone counts as used only after a candle body went inside it; wick-only touches keep it fresh. The fresh rule (fxcore "fresh") counts a visit (a run of bars whose wick reaches the proximal) as a test only when a bar of it has its body inside the zone (demand: min(open, close) <= proximal), on the zone TF's closed bars after the stay-away candle plus the H4 bars of its forming bar. Applies to the entry zone only (the HTF host checks keep the scanner's count).

### `fresh_depth25` (freshness)

A zone counts as used only after price went at least 25% of the zone height inside it. As fresh_body, but a visit counts only when a bar of it went >= 25% of the zone height beyond the proximal (demand: low <= proximal - 0.25 x height).

### `cont_off` (continuation)

Never trade continuation zones (rally-base-rally / drop-base-drop). Signals on RBR / DBD (continuation) zones are dropped before the one-per-TF-and-side choice.

### `cont_nested` (continuation)

Trade a continuation zone only when its proximal lies inside a same-side zone of the next higher timeframe. An RBR / DBD zone is kept only when its proximal lies inside (low..high) a not-removed same-side zone of the next higher TF (H4 -> D1, D1 -> W1), stricter than the location rule's overlap with a tolerance band.

### `cont_htf` (continuation)

Trade continuation zones only on the daily timeframe and higher. RBR / DBD zones are kept only on D1 and higher (H1 / H4 continuation zones dropped).

### `stop_atr` (stop)

Stop at the wider of the current stop and the distal plus 1x the 14-bar ATR of the zone timeframe. Stop = the wider of the scanner's stop and distal -/+ 1.0 x ATR14 of the zone TF at signal time (sell: + spread). The target price is kept; 1R = the new entry-to-stop distance, and the scanner's room rule (target >= 2x the stop) is re-applied to the wider stop (else skipped).

### `stop_tight` (stop)

Remove the volatility floor of the stop. Skipped: the scanner has no volatility floor on the stop.

Not run: no volatility floor to remove: the stop is distal +/- fxcfg.SL_PCT % of the zone height with a fixed 3-pip minimum (fxcfg.SL_MIN_PIPS), no ATR term (zones.stop_buffer).

### `arrive_stair` (filter)

Skip the trade when price crawled into the zone (small candles or two or more basing pauses in the last 10 bars). At the H4 bar that would fill, the entry-TF bars closed BEFORE that bar are checked (H4 bars for an H4 entry, D1 bars for a D1 entry): over the last 10, mean |close - open| < 0.5 x ATR14 (ATR of the 14 bars before those 10), or >= 2 bases, a base = >= 2 consecutive basing candles (body < 50% of the range) or inside bars. If so the order is cancelled instead of filled. Equivalent to a trader pulling the order while the approach is a stair and cancelling once price traded through it: the decision uses closed bars only.

### `curve_top3` (filter)

No buys in the top third and no sells in the bottom third of the last 2 years of monthly range. No BUY when price is in the top third (> 2/3) and no SELL in the bottom third (< 1/3) of the high-low range of the last 24 closed MN bars at signal time (fewer than 6 MN bars: no filter).

### `cancel_50` (filter)

Cancel the pending order once price has moved half way from the entry to the target without filling. A pending order is cancelled after an H4 bar in which the target-side quote (bid high on a buy, ask low on a sell) moved >= 50% of the way from the entry to the target without filling (a bar that fills counts as a fill, like the scanner's "missed" rule).

### `volreg_half` (size)

Half size when the entry-timeframe ATR is in the top 10% of its last 250 values. Half size (R x 0.5) when the entry TF's ATR14 at signal time is >= the 90th percentile (nearest rank) of its last 250 ATR14 values (fewer than 50 values: full size). MFE / MAE stay in price R.

### `ct_half` (size)

Half size when the trade goes against the trend of the next higher timeframe. Half size (R x 0.5) when the next higher TF row's trend (zones.trend_side: TREND / CHANGED / TURN side of the D1 row for an H4 entry, W1 for D1) is against the signal.

### `split_entry` (size)

Half the position at the proximal, half at the middle of the zone, same stop and target. Two limit orders of half size: the scanner's entry and the zone middle (+ spread on a buy), same stop, target and expiry. Trade R = sum(0.5 x leg PnL) / sum(0.5 x leg risk) over both legs (1R = the loss when both fill and stop); a trade exists when the first leg filled. MFE / MAE / bars from the proximal leg.
