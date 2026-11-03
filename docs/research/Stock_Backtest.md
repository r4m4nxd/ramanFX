# Stock scanner backtest (real data, walk-forward)

Generated 2026-11-03 15:27 UTC by `.github/workflows/stock-backtest.yml` (`tools/stock_scanner/backtest.py`). Tickers 736 of 736.

**Verdict:** NOT ENOUGH TRADES out of sample to judge (need 30+). Do not trust the scanner yet.

## What was tested

- The live rules unchanged: `scan.analyse()` + `scan.symbol_signals()` (W1 / MN / 3M zones, top-down nesting, owner ATH curve rule, 250% projection target, stops W1 5% / MN 3% / 3M 2% of the zone height).
- Walk-forward, no look-ahead: each evaluation sees daily bars up to that day and only CLOSED W1 / MN / 3M candles.
- Weekly cadence (last session of each week). Limit at the proximal, filled only when traded through (at the open on a gap down); cancelled on target-first, a close below the distal or after 40 sessions.
- Exits: target, stop (stop first on the same bar; an open below the stop exits at that open), or time after 52 weeks. Trades still running at the data end are not scored.
- Costs 5.0 bps spread + 5.0 bps slippage per side. Split-adjusted prices (Alpaca adjustment=split, the TradingView default chart): dividends are NOT in the returns.
- Period: signals 2017-05-05 to 2026-06-05; out of sample = signals from 2024-06-28 (newest 30%).

"wick" = stop order in the market (the live plan). "close" = exit only on a daily close below the stop.

## Orders

Signals 8, filled 2 (fill rate 25.0%), not filled {'expired': 5, 'cancelled_target': 1, 'cancelled_removed': 0, 'pending': 0}, still open 0.

## Current rules, wick stop

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| All | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |
| In sample | 1 | 100.0% | +2.49 | n/a to n/a | n/a | +49.18% | 6307.4% | 5.0 | 0.0 | 0 |
| Out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

Gap through the stop: 0; holding through a 10-Q / 10-K: 1.

Same holding windows in SPY: trades avg +12.96% vs SPY +3.88%; trades beating SPY 50.0%.

### By index

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| SPX | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| TSX | 1 | 100.0% | +2.49 | n/a to n/a | n/a | +49.18% | 6307.4% | 5.0 | 0.0 | 0 |

### By entry timeframe

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| MN | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |

### By zone type

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| ARR | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| WOW | 1 | 100.0% | +2.49 | n/a to n/a | n/a | +49.18% | 6307.4% | 5.0 | 0.0 | 0 |

### By Raja score

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| 9-10 | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |

### By nesting status

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| top | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |

### By target kind

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| supply | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |

### By sector

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| Industrials | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| Materials | 1 | 100.0% | +2.49 | n/a to n/a | n/a | +49.18% | 6307.4% | 5.0 | 0.0 | 0 |

## Current rules, close stop

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| All | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |
| In sample | 1 | 100.0% | +2.49 | n/a to n/a | n/a | +49.18% | 6307.4% | 5.0 | 0.0 | 0 |
| Out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

Gap through the stop: 0; holding through a 10-Q / 10-K: 1.

Same holding windows in SPY: trades avg +12.96% vs SPY +3.88%; trades beating SPY 50.0%.

## Ablations (wick stop)

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| current: all | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |
| current: out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| no_nesting: all | 23 | 21.7% | -0.14 | -0.99 to +0.84 | 0.85 | +3.50% | 36.0% | 5.8 | 13.0 | 8 |
| no_nesting: out of sample | 7 | 14.3% | -0.85 | -2.89 to +1.50 | 0.45 | -5.07% | -20.4% | 11.9 | 9.8 | 5 |
| no_ath: all | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |
| no_ath: out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| no_nesting, nested (would pass) | 2 | 50.0% | +0.74 | -1.01 to +2.49 | 2.47 | +12.96% | 81.4% | 10.6 | 1.0 | 1 |
| no_nesting, not nested (blocked live) | 21 | 19.0% | -0.22 | -1.21 to +0.87 | 0.77 | +2.60% | 28.3% | 5.4 | 12.0 | 8 |

Old D1 / W1 rules: not run: the old D1 / W1 rules are no longer selectable (D1 zones and the D1 direction were removed from scan.analyse in da14866).

## Random-entry baseline (same stop / target geometry)

random weekly day on the same ticker, next-open entry, same stop / target % and exit rules (3 draws per trade, seeded).

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| random: all | 6 | 66.7% | +2.00 | +0.16 to +3.74 | 6.94 | +43.90% | 436.9% | 11.3 | 1.0 | 1 |
| random: out of sample | 2 | 50.0% | +1.60 | -1.01 to +4.21 | 4.17 | +36.90% | 68663.3% | 2.5 | 1.0 | 1 |

Edge of the zones over random entries: -1.26R per trade (wick), -1.22R (close).

## SPY buy and hold, same period

2017-05-05 to 2026-11-03: total 214.9%, CAGR 12.8%, max drawdown 34.2% (SPY split-adjusted closes (dividends not included, same as the trades), no costs).

## Experiments (auto-learner input, `public/learn/stock_experiments.json`)

Each variant = the base rules with ONE change (`tools/stock_scanner/experiments.py`, the same functions the live scanner will import when a variant is adopted). Same walk-forward, the same signals of each evaluation day (computed once and shared), wick stop (the live plan), the same costs, one position per ticker per variant (free again after its wick exit; the main report's current rules also wait for the close-stop exit, so its trade list can differ slightly). In sample = signals before 2023-08-11 (older 70% of the base's own fills), out of sample = from then on. Expectancy in R after costs, bootstrap 95% CI. MFE / MAE = best / worst price move from the fill to the exit in R.

Bases: the matrix runs on each of current, no_nesting, loose; the learner file holds the strictest base with in-sample n >= 150 (else the one with most trades); every set is in `public/learn/stock_experiments_all.json`.

- `current`: The live rules unchanged.
- `no_nesting`: The live rules without the top-down location rule (a zone need not sit inside a touched higher-timeframe demand).
- `loose`: The live rules without the top-down location rule, the curve rule (and its ATH exception) and the direction rule (HTF align): the three gates that block most live candidates. Zone type, freshness, room, sideways, CP and overlap rules stay.

Chosen base: **`loose`**.

- `current` in sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- `current` out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R
- `no_nesting` in sample: 16 trades, win 25.0%, +0.17R / trade (95% CI -0.70 to +1.24), PF 1.26, MFE 1.11R, MAE 0.66R, 15.4 sessions, max DD 6.1R
- `no_nesting` out of sample: 7 trades, win 14.3%, -0.85R / trade (95% CI -2.89 to +1.50), PF 0.45, MFE 2.46R, MAE 1.57R, 57.4 sessions, max DD 9.8R
- `loose` in sample: 94 trades, win 23.4%, +0.72R / trade (95% CI -0.05 to +1.62), PF 1.93, MFE 2.04R, MAE 0.80R, 24.3 sessions, max DD 16.2R
- `loose` out of sample: 40 trades, win 12.5%, -0.50R / trade (95% CI -1.16 to +0.23), PF 0.54, MFE 1.92R, MAE 1.10R, 25.7 sessions, max DD 23.4R

Current trades' excursions (n 134): MFE p25 / p50 / p75 / p90 = 0.00 / 0.68 / 2.64 / 5.63R; MAE 0.72 / 1.00 / 1.00 / 1.00R.

### `current` (baseline)

The live rules unchanged (the baseline every variant is compared with).

Rule: scan.analyse() + scan.symbol_signals() as live; limit at the proximal, wick stop and target in the market, 52-week time exit, one position per ticker.

- In sample: 94 trades, win 23.4%, +0.72R / trade (95% CI -0.05 to +1.62), PF 1.93, MFE 2.04R, MAE 0.80R, 24.3 sessions, max DD 16.2R
- Out of sample: 40 trades, win 12.5%, -0.50R / trade (95% CI -1.16 to +0.23), PF 0.54, MFE 1.92R, MAE 1.10R, 25.7 sessions, max DD 23.4R

### `be_1r` (exit)

Move the stop to the fill price once a daily high has reached +1R.

Rule: At the close of a session after the fill bar whose high reached fill + 1R, the stop becomes the fill price from the next session on (a gap below it exits at the open).

- In sample: 94 trades, win 17.0%, +0.56R / trade (95% CI -0.11 to +1.35), PF 1.95, MFE 1.83R, MAE 0.66R, 17.6 sessions, max DD 15.0R
- Out of sample: 40 trades, win 5.0%, -0.52R / trade (95% CI -0.91 to -0.03), PF 0.28, MFE 1.52R, MAE 0.80R, 14.6 sessions, max DD 21.0R

### `be_2r` (exit)

Move the stop to the fill price once a daily high has reached +2R.

Rule: As be_1r with the trigger at fill + 2R.

- In sample: 94 trades, win 18.1%, +0.46R / trade (95% CI -0.24 to +1.26), PF 1.62, MFE 1.86R, MAE 0.76R, 20.1 sessions, max DD 15.2R
- Out of sample: 40 trades, win 10.0%, -0.30R / trade (95% CI -0.83 to +0.38), PF 0.60, MFE 1.87R, MAE 0.88R, 21.2 sessions, max DD 16.6R

### `be_struct` (exit)

After +1.5R, raise the stop to the lowest daily low since the fill (it only ever tightens).

Rule: At the close of a session once a high after the fill bar reached fill + 1.5R, the stop becomes the lowest daily low from the fill bar up to that session, if that is higher than the stop (only tightens), from the next session on.

- In sample: 94 trades, win 19.1%, +0.58R / trade (95% CI -0.14 to +1.40), PF 1.82, MFE 1.90R, MAE 0.71R, 19.7 sessions, max DD 17.1R
- Out of sample: 40 trades, win 12.5%, -0.26R / trade (95% CI -0.84 to +0.46), PF 0.70, MFE 1.92R, MAE 0.85R, 23.6 sessions, max DD 19.1R

### `time_stop` (exit)

Sell at the close of the 20th session after the fill if price has not reached +1R by then.

Rule: If no high of the 20 sessions after the fill bar reached fill + 1R, exit at the close of the 20th session.

- In sample: 94 trades, win 24.5%, +0.74R / trade (95% CI -0.02 to +1.66), PF 1.99, MFE 2.03R, MAE 0.79R, 23.8 sessions, max DD 16.0R
- Out of sample: 40 trades, win 12.5%, -0.52R / trade (95% CI -1.14 to +0.23), PF 0.51, MFE 1.79R, MAE 1.08R, 23.1 sessions, max DD 23.9R

### `tp_fixed3` (exit)

Take profit at exactly 3R instead of the next supply / projection.

Rule: Target = entry + 3 x (entry - stop); the order is also cancelled when that target trades first.

- In sample: 85 trades, win 29.4%, +0.19R / trade (95% CI -0.22 to +0.58), PF 1.27, MFE 1.24R, MAE 0.75R, 13.2 sessions, max DD 16.7R
- Out of sample: 37 trades, win 29.7%, +0.12R / trade (95% CI -0.61 to +0.84), PF 1.14, MFE 1.51R, MAE 0.92R, 14.5 sessions, max DD 8.3R

### `tp_zone` (exit)

Take profit just below the nearest not-removed supply zone above (W1, MN or 3M, tested ones too); skip the trade if that is under 2.5R.

Rule: Target = 0.5% under the nearest proximal above the entry among the not-removed supply zones of the W1, MN and 3M rows of the signal-day analysis (tested ones and lower-TF ones too); no trade when that is < 2.5R; no supply above = the live target (250% projection).

- In sample: 92 trades, win 22.8%, +0.70R / trade (95% CI -0.04 to +1.61), PF 1.91, MFE 2.04R, MAE 0.81R, 24.3 sessions, max DD 16.2R
- Out of sample: 32 trades, win 9.4%, -0.44R / trade (95% CI -1.13 to +0.47), PF 0.58, MFE 2.05R, MAE 1.02R, 24.5 sessions, max DD 24.1R

### `fresh_body` (freshness)

A zone counts as used only once a daily candle CLOSED inside it (wick-only touches keep it fresh).

Rule: The freshness rule (L2 · L52) is replaced: a zone is used only once a daily close <= its proximal happened after its stay-away period. Tested zones (1-2 wick touches, not removed) whose ONLY failed rule is freshness become BUYs; one BUY per timeframe, the nearest.

- In sample: 94 trades, win 23.4%, +0.72R / trade (95% CI -0.05 to +1.62), PF 1.93, MFE 2.04R, MAE 0.80R, 24.3 sessions, max DD 16.2R
- Out of sample: 40 trades, win 12.5%, -0.50R / trade (95% CI -1.16 to +0.23), PF 0.54, MFE 1.92R, MAE 1.10R, 25.7 sessions, max DD 23.4R

### `fresh_depth25` (freshness)

A zone counts as used only once price went at least 25% of the zone height inside it.

Rule: As fresh_body, but used = a daily low <= proximal - 25% of the zone height.

- In sample: 94 trades, win 23.4%, +0.72R / trade (95% CI -0.05 to +1.62), PF 1.93, MFE 2.04R, MAE 0.80R, 24.3 sessions, max DD 16.2R
- Out of sample: 40 trades, win 12.5%, -0.50R / trade (95% CI -1.16 to +0.23), PF 0.54, MFE 1.92R, MAE 1.10R, 25.7 sessions, max DD 23.4R

### `cont_off` (continuation)

Never buy continuation (rally-base-rally) zones.

Rule: No BUY on a zone whose pattern is RBR (rally-base-rally continuation).

- In sample: 56 trades, win 25.0%, +1.03R / trade (95% CI -0.10 to +2.37), PF 2.29, MFE 2.29R, MAE 0.84R, 27.1 sessions, max DD 9.2R
- Out of sample: 15 trades, win 20.0%, +0.28R / trade (95% CI -1.22 to +2.02), PF 1.28, MFE 2.35R, MAE 1.05R, 22.1 sessions, max DD 14.0R

### `cont_nested` (continuation)

Buy a rally-base-rally zone only when it sits inside a touched higher-timeframe demand zone.

Rule: An RBR zone gives a BUY only when its top-down location code is "inside" (inside a touched MN demand for W1, a touched 3M demand for MN); "top" (3M, or no HTF in reach) does not count as nested.

- In sample: 57 trades, win 26.3%, +1.10R / trade (95% CI -0.04 to +2.37), PF 2.41, MFE 2.34R, MAE 0.83R, 27.0 sessions, max DD 9.2R
- Out of sample: 15 trades, win 20.0%, +0.28R / trade (95% CI -1.22 to +2.02), PF 1.28, MFE 2.35R, MAE 1.05R, 22.1 sessions, max DD 14.0R

### `stop_atr` (stop)

Stop at the wider of the current stop and the distal minus one weekly ATR14 (R recomputed; under 2R room = no trade).

Rule: Stop = min(live stop, distal - 1.0 x weekly ATR14) with ATR14 = mean true range of the last 14 CLOSED weekly bars; R and R:R use the new stop; no trade when the room falls under 2R (the live room rule).

- In sample: 56 trades, win 44.6%, +0.68R / trade (95% CI +0.19 to +1.16), PF 2.34, MFE 1.58R, MAE 0.70R, 74.9 sessions, max DD 5.4R
- Out of sample: 23 trades, win 39.1%, +0.38R / trade (95% CI -0.39 to +1.21), PF 1.58, MFE 1.67R, MAE 0.88R, 77.0 sessions, max DD 7.3R

### `arrive_stair` (filter)

Skip the trade when the last 10 sessions before the first touch were a slow stair-step approach.

Rule: At the first session that touches the proximal (low <= entry) the order is withdrawn when the 10 sessions before it were a stair-step approach: mean |close - open| < 0.5 x ATR14, or >= 2 small-range bases (runs of >= 2 consecutive bars each with high - low < 0.6 x ATR14); ATR14 = mean true range of the 14 sessions before the touch. A withdrawn first touch ends the setup.

- In sample: 36 trades, win 22.2%, +0.30R / trade (95% CI -0.52 to +1.31), PF 1.36, MFE 1.66R, MAE 0.86R, 16.8 sessions, max DD 17.8R
- Out of sample: 15 trades, win 20.0%, -0.62R / trade (95% CI -1.74 to +0.58), PF 0.50, MFE 2.02R, MAE 1.29R, 27.7 sessions, max DD 15.3R

### `curve_top3` (filter)

No buy when the entry sits in the top third of the last 2 years' range.

Rule: No BUY when the entry >= low + 2/3 x (high - low) of the last 504 daily bars up to the signal day.

- In sample: 78 trades, win 25.6%, +0.99R / trade (95% CI +0.09 to +2.01), PF 2.37, MFE 2.19R, MAE 0.76R, 25.6 sessions, max DD 13.8R
- Out of sample: 37 trades, win 13.5%, -0.46R / trade (95% CI -1.18 to +0.35), PF 0.58, MFE 2.05R, MAE 1.11R, 27.3 sessions, max DD 22.3R

### `cancel_50` (filter)

Cancel the waiting order once price has gone half way to the target without filling it.

Rule: Cancel the waiting order at the close of a session (before any fill) whose high reached entry + 50% of (target - entry).

- In sample: 85 trades, win 24.7%, +0.87R / trade (95% CI +0.04 to +1.81), PF 2.16, MFE 2.22R, MAE 0.79R, 26.6 sessions, max DD 14.1R
- Out of sample: 37 trades, win 10.8%, -0.55R / trade (95% CI -1.27 to +0.27), PF 0.51, MFE 2.01R, MAE 1.13R, 26.9 sessions, max DD 24.1R

### `market_regime` (filter)

No new buy while SPY closes below its 200-day average.

Rule: No BUY when SPY's close on the signal day is below the mean of its last 200 closes (fewer than 200 = allowed).

- In sample: 51 trades, win 17.6%, +0.03R / trade (95% CI -0.62 to +0.85), PF 1.03, MFE 1.58R, MAE 0.90R, 19.0 sessions, max DD 19.9R
- Out of sample: 33 trades, win 9.1%, -0.88R / trade (95% CI -1.42 to -0.33), PF 0.24, MFE 1.60R, MAE 1.14R, 23.8 sessions, max DD 29.1R

### `earnings_skip` (filter)

Skip a trade whose fill would hold through an earnings date within 10 sessions.

Rule: Skip a signal whose fill would hold through an earnings date within 10 sessions.

Not run: no historical earnings dates in the cached data: data.fetch_earnings only knows the NEXT date and the fundamentals cache keeps only the last 16 10-Q / 10-K filing dates (filed days to weeks after the release, about 4 years), so most of the test period would have no dates and the rest a proxy.

### `volreg_half` (size)

Half size when the daily ATR14 is in the top 10% of its last 250 values.

Rule: Half size (R x 0.5) when the daily ATR14 on the signal day is higher than at least 90% of its last 250 values.

- In sample: 94 trades, win 23.4%, +0.44R / trade (95% CI -0.09 to +1.01), PF 1.66, MFE 2.04R, MAE 0.80R, 24.3 sessions, max DD 13.8R
- Out of sample: 40 trades, win 12.5%, -0.44R / trade (95% CI -0.99 to +0.25), PF 0.55, MFE 1.92R, MAE 1.10R, 25.7 sessions, max DD 21.9R

### `split_entry` (size)

Buy half at the proximal and half at the middle of the zone (same stop and target).

Rule: Half the shares at the proximal, half at the zone middle (proximal - 50% of the height), same stop / target; the second order lives while the first half is open (order life 40 sessions, a close under the distal cancels it). R is in units of the full position at the proximal: 0.5 x R1 + 0.5 x R2 (R2 = 0 when not filled).

- In sample: 94 trades, win 23.4%, +0.62R / trade (95% CI -0.08 to +1.47), PF 2.03, MFE 2.04R, MAE 0.80R, 24.3 sessions, max DD 13.7R
- Out of sample: 40 trades, win 12.5%, -0.24R / trade (95% CI -0.86 to +0.49), PF 0.71, MFE 1.92R, MAE 1.10R, 25.7 sessions, max DD 15.9R

## TFSA study: buy at a demand zone and hold (no stop)

**Verdict:** Buying at the first touch of a W1 / MN / 3M demand zone and holding 12 months (no stop): +2.8% vs buying the same stock on a random day (95% CI by calendar month -3.7 to +10.5), +4.6% vs SPY (46% of 13561 buys beat SPY, 108 entry months); worst drop during a hold -98%. NOT proven: the edge over a random day is not clearly above zero (calendar-month CI) in both the train (before 2022) and the test (2022 on) period. No filter or combination holds in both periods. Survivorship: the universe is today's index members (stocks that later fell out or went bust are missing), which flatters every buy-and-hold result here.

Every first touch of a W1 / MN / 3M demand zone (drawn on closed candles, as the live scanner does) on every ticker: limit buy at the proximal and hold 3 / 6 / 12 months, no stop (the stop column: out at the first monthly close below the zone distal). Compared with the same stock bought on a random day (seeded) for the same length and with SPY over the same dates (close to close). One buy per stock and day (the biggest timeframe). "Holds" = the 95% CI of the excess over a random day, bootstrapped by CALENDAR MONTH (market-wide drops cluster in time), is above zero in BOTH train (entries before 2022) and test (2022 on). Buys / months = buys and distinct entry months (the effective sample). Survivorship: today's index members.

Events: 38226 unique (39896 raw) on 718 tickers, 2016-11-03 to 2026-11-03.

### 12m hold

| First-touch buys | Buys / months | Vs random day | Train vs random (month CI) | Test vs random (month CI) | Vs SPY | Avg return | With monthly-close stop | Holds |
|---|---|---|---|---|---|---|---|---|
| in | 13561 / 108 | +2.8% | +4.3% (-6.5 to +17.5) | +1.1% (-5.3 to +7.7) | +4.6% (46% beat) | +20.7% | +11.9% (64% stopped) | no |
| tf_W1 | 10697 / 108 | +1.6% | +2.1% (-6.8 to +12.8) | +1.1% (-4.9 to +7.5) | +4.5% (46% beat) | +19.7% | +10.5% (68% stopped) | no |
| tf_MN | 2347 / 102 | +6.5% | +11.4% (-5.3 to +28.2) | +1.4% (-6.1 to +7.7) | +4.3% (47% beat) | +22.7% | +15.2% (53% stopped) | no |
| tf_3M | 517 / 75 | +10.2% | +24.4% (-18.8 to +46.4) | +1.3% (-18.1 to +16.9) | +7.5% (48% beat) | +31.5% | +25.5% (38% stopped) | no |
| market_regime | 9453 / 97 | -2.8% | -5.7% (-10.3 to -0.8) | +1.2% (-5.0 to +7.1) | +3.2% (46% beat) | +15.9% | +7.7% (69% stopped) | no |
| market_regime_fail | 4108 / 33 | +15.5% | +37.7% (+9.8 to +54.4) | +0.9% (-8.7 to +12.3) | +7.7% (48% beat) | +31.8% | +21.4% (54% stopped) | no |
| mom12 | 8226 / 108 | -0.8% | -2.1% (-9.0 to +5.7) | +0.9% (-6.1 to +8.3) | +4.0% (47% beat) | +17.7% | +9.5% (66% stopped) | no |
| mom12_fail | 5335 / 108 | +8.2% | +16.1% (-3.8 to +36.7) | +1.4% (-5.1 to +9.5) | +5.5% (46% beat) | +25.2% | +15.5% (61% stopped) | no |
| not_top3 | 8859 / 108 | +7.6% | +12.1% (-4.0 to +28.1) | +3.4% (-3.8 to +10.6) | +5.7% (46% beat) | +25.1% | +15.1% (62% stopped) | no |
| not_top3_fail | 4702 / 108 | -6.3% | -7.5% (-12.1 to -3.0) | -4.6% (-10.2 to +2.1) | +2.6% (48% beat) | +12.4% | +5.8% (69% stopped) | no |
| qualified | 9184 / 108 | +3.7% | +5.2% (-7.9 to +19.7) | +1.7% (-5.8 to +9.4) | +5.5% (47% beat) | +22.0% | +12.9% (63% stopped) | no |
| qualified_fail | 4377 / 108 | +0.8% | +1.8% (-6.4 to +12.0) | +0.0% (-4.9 to +5.7) | +2.7% (44% beat) | +17.8% | +9.8% (67% stopped) | no |
| all_four | 1604 / 93 | -0.5% | -4.7% (-9.7 to +0.2) | +4.0% (-7.4 to +13.2) | +6.8% (46% beat) | +19.8% | +10.6% (68% stopped) | no |
| tf_MN_3M | 2864 / 102 | +7.1% | +13.3% (-6.3 to +31.6) | +1.4% (-7.7 to +9.4) | +4.9% (47% beat) | +24.2% | +17.1% (51% stopped) | no |
| tf_MN_3M+not_top3 | 2370 / 102 | +9.9% | +18.9% (-4.1 to +37.1) | +1.9% (-8.2 to +11.2) | +5.4% (47% beat) | +27.0% | +19.3% (49% stopped) | no |
| tf_MN_3M+not_top3+regime_fail | 1212 / 29 | +20.8% | +39.3% (+3.1 to +53.6) | +3.4% (-11.1 to +17.7) | +9.6% (50% beat) | +38.8% | +29.0% (41% stopped) | no |
| W1+not_top3 | 6489 / 108 | +6.7% | +9.7% (-4.6 to +24.2) | +4.0% (-2.6 to +11.1) | +5.8% (45% beat) | +24.4% | +13.6% (66% stopped) | no |
| tf_MN_3M+mom12_fail | 1286 / 99 | +13.9% | +27.3% (-3.0 to +51.4) | +3.4% (-6.1 to +14.0) | +8.0% (49% beat) | +30.2% | +21.9% (48% stopped) | no |
| any+not_top3+qualified | 5368 / 105 | +10.6% | +15.9% (-5.1 to +33.5) | +5.1% (-4.4 to +14.3) | +7.3% (47% beat) | +28.5% | +17.7% (59% stopped) | no |

### 6m hold

| First-touch buys | Buys / months | Vs random day | Train vs random (month CI) | Test vs random (month CI) | Vs SPY | Avg return | With monthly-close stop | Holds |
|---|---|---|---|---|---|---|---|---|
| in | 14378 / 115 | +1.6% | +2.2% (-4.7 to +9.6) | +1.0% (-4.0 to +5.6) | +1.9% (48% beat) | +10.8% | +7.1% (56% stopped) | no |
| tf_W1 | 11323 / 115 | +0.7% | +1.3% (-4.7 to +7.5) | +0.0% (-4.5 to +4.2) | +1.8% (48% beat) | +10.0% | +6.1% (60% stopped) | no |
| tf_MN | 2490 / 109 | +4.2% | +4.9% (-6.7 to +15.9) | +3.5% (-2.1 to +9.1) | +2.2% (48% beat) | +12.9% | +9.9% (44% stopped) | no |
| tf_3M | 565 / 81 | +8.0% | +10.3% (-14.4 to +22.5) | +6.7% (-3.8 to +17.5) | +2.2% (46% beat) | +16.2% | +14.2% (31% stopped) | no |
| market_regime | 10178 / 104 | -1.7% | -3.2% (-7.0 to +0.3) | +0.2% (-3.5 to +4.0) | +1.0% (47% beat) | +7.9% | +4.7% (59% stopped) | no |
| market_regime_fail | 4200 / 35 | +9.4% | +20.4% (+2.4 to +30.4) | +2.5% (-6.6 to +12.5) | +4.1% (49% beat) | +17.7% | +12.9% (48% stopped) | no |
| mom12 | 8693 / 115 | -0.4% | -0.8% (-6.5 to +5.1) | -0.0% (-5.2 to +4.7) | +2.1% (48% beat) | +9.8% | +6.3% (57% stopped) | no |
| mom12_fail | 5685 / 115 | +4.6% | +7.7% (-2.0 to +17.6) | +2.2% (-2.8 to +7.6) | +1.7% (47% beat) | +12.2% | +8.2% (54% stopped) | no |
| not_top3 | 9450 / 115 | +3.7% | +5.6% (-3.9 to +15.6) | +2.1% (-3.2 to +7.5) | +2.1% (47% beat) | +12.7% | +8.6% (54% stopped) | no |
| not_top3_fail | 4928 / 115 | -2.4% | -2.9% (-8.0 to +0.8) | -1.8% (-6.7 to +2.8) | +1.6% (49% beat) | +7.1% | +4.1% (59% stopped) | no |
| qualified | 9756 / 115 | +2.3% | +3.0% (-6.1 to +11.6) | +1.6% (-4.3 to +7.2) | +2.5% (48% beat) | +12.0% | +8.0% (54% stopped) | no |
| qualified_fail | 4622 / 115 | -0.0% | +0.2% (-4.5 to +5.6) | -0.2% (-4.2 to +3.2) | +0.7% (46% beat) | +8.2% | +5.1% (58% stopped) | no |
| all_four | 1757 / 100 | -3.0% | -7.2% (-12.4 to -2.8) | +0.7% (-5.9 to +6.6) | +2.5% (47% beat) | +9.9% | +6.7% (57% stopped) | no |
| tf_MN_3M | 3055 / 109 | +4.9% | +5.7% (-7.2 to +17.0) | +4.2% (-2.4 to +10.8) | +2.2% (48% beat) | +13.5% | +10.7% (41% stopped) | no |
| tf_MN_3M+not_top3 | 2540 / 109 | +6.3% | +7.8% (-8.4 to +19.6) | +5.0% (-1.9 to +12.7) | +2.3% (48% beat) | +14.9% | +11.8% (41% stopped) | no |
| tf_MN_3M+not_top3+regime_fail | 1236 / 31 | +14.5% | +22.2% (-1.2 to +30.4) | +7.5% (-4.5 to +21.1) | +4.6% (50% beat) | +22.0% | +17.7% (36% stopped) | no |
| W1+not_top3 | 6910 / 115 | +2.7% | +4.8% (-3.1 to +13.3) | +1.0% (-4.0 to +5.8) | +2.0% (47% beat) | +11.9% | +7.4% (59% stopped) | no |
| tf_MN_3M+mom12_fail | 1389 / 106 | +8.1% | +11.2% (-6.0 to +23.2) | +5.9% (-0.4 to +13.3) | +2.0% (47% beat) | +14.6% | +11.4% (41% stopped) | no |
| any+not_top3+qualified | 5759 / 112 | +5.5% | +8.1% (-5.0 to +19.7) | +3.1% (-4.1 to +10.3) | +3.0% (48% beat) | +15.2% | +10.6% (51% stopped) | no |

### 3m hold

| First-touch buys | Buys / months | Vs random day | Train vs random (month CI) | Test vs random (month CI) | Vs SPY | Avg return | With monthly-close stop | Holds |
|---|---|---|---|---|---|---|---|---|
| in | 14786 / 118 | +0.6% | +0.1% (-7.0 to +6.5) | +1.0% (-1.7 to +3.5) | +1.3% (49% beat) | +5.8% | +4.2% (44% stopped) | no |
| tf_W1 | 11639 / 118 | -0.2% | -0.8% (-8.0 to +5.4) | +0.4% (-2.0 to +2.7) | +1.1% (49% beat) | +5.2% | +3.6% (48% stopped) | no |
| tf_MN | 2558 / 112 | +3.2% | +4.1% (-3.9 to +11.6) | +2.4% (-0.9 to +5.4) | +1.7% (52% beat) | +7.7% | +5.9% (31% stopped) | no |
| tf_3M | 589 / 85 | +4.8% | +2.0% (-30.2 to +14.5) | +6.3% (-0.8 to +13.1) | +2.0% (50% beat) | +10.1% | +9.2% (22% stopped) | no |
| market_regime | 10586 / 107 | -2.1% | -4.1% (-9.9 to +0.8) | -0.1% (-2.2 to +2.3) | +0.4% (48% beat) | +3.4% | +2.5% (47% stopped) | no |
| market_regime_fail | 4200 / 35 | +7.4% | +14.1% (-1.4 to +21.6) | +3.2% (-1.9 to +9.4) | +3.3% (53% beat) | +12.0% | +8.6% (37% stopped) | no |
| mom12 | 8954 / 118 | +0.4% | +0.3% (-3.1 to +4.2) | +0.5% (-2.2 to +3.1) | +1.2% (49% beat) | +5.0% | +3.7% (44% stopped) | no |
| mom12_fail | 5832 / 118 | +0.9% | -0.3% (-18.4 to +11.2) | +1.7% (-1.2 to +4.6) | +1.3% (50% beat) | +7.1% | +5.1% (43% stopped) | no |
| not_top3 | 9738 / 118 | +1.6% | +1.2% (-11.2 to +10.2) | +1.9% (-1.2 to +4.7) | +1.6% (50% beat) | +7.3% | +5.3% (43% stopped) | no |
| not_top3_fail | 5048 / 118 | -1.3% | -1.5% (-3.9 to +0.9) | -1.0% (-3.2 to +1.2) | +0.7% (49% beat) | +3.1% | +2.3% (47% stopped) | no |
| qualified | 10016 / 118 | +1.0% | +0.5% (-9.2 to +8.4) | +1.5% (-1.9 to +4.8) | +1.5% (50% beat) | +6.5% | +4.7% (43% stopped) | no |
| qualified_fail | 4770 / 118 | -0.2% | -0.8% (-4.5 to +3.2) | +0.1% (-1.9 to +2.1) | +0.7% (48% beat) | +4.4% | +3.2% (46% stopped) | no |
| all_four | 1852 / 103 | +0.0% | -1.9% (-5.2 to +1.6) | +1.6% (-1.8 to +4.6) | +1.4% (48% beat) | +4.6% | +3.3% (45% stopped) | no |
| tf_MN_3M | 3147 / 112 | +3.5% | +3.8% (-5.9 to +11.9) | +3.3% (-0.6 to +6.8) | +1.8% (51% beat) | +8.1% | +6.5% (29% stopped) | no |
| tf_MN_3M+not_top3 | 2619 / 112 | +4.2% | +5.3% (-7.1 to +14.0) | +3.4% (-0.8 to +7.1) | +1.9% (51% beat) | +8.9% | +7.1% (30% stopped) | no |
| tf_MN_3M+not_top3+regime_fail | 1236 / 31 | +10.0% | +13.7% (-15.2 to +21.1) | +6.6% (-0.6 to +13.6) | +3.6% (55% beat) | +15.2% | +12.2% (26% stopped) | no |
| W1+not_top3 | 7119 / 118 | +0.6% | -0.3% (-13.7 to +8.9) | +1.3% (-1.6 to +4.1) | +1.4% (49% beat) | +6.6% | +4.6% (47% stopped) | no |
| tf_MN_3M+mom12_fail | 1431 / 109 | +4.6% | +5.7% (-10.3 to +16.5) | +3.9% (+0.3 to +8.4) | +1.9% (51% beat) | +9.1% | +7.1% (30% stopped) | no |
| any+not_top3+qualified | 5931 / 115 | +2.5% | +2.0% (-20.2 to +12.8) | +3.0% (-1.3 to +7.0) | +2.1% (50% beat) | +8.8% | +6.4% (41% stopped) | no |

### By section (12m, all years)

| Section | Buys | Vs random day | Vs SPY | Beat SPY | Worst drop |
|---|---|---|---|---|---|
| in | 13561 | +2.8% | +4.6% | 46% | -98% |
| near | 10439 | -2.7% | -0.1% | 44% | -94% |
| left | 10011 | +1.8% | +4.3% | 46% | -98% |

## How to read this

- Avg R = expectancy per trade in units of the planned risk; trust needs the out-of-sample 95% CI above zero.
- Win rate below 100% means losing signals exist: no rule set gives zero false signals. Plan the size so the losing streak and max drawdown above are survivable.
- Annualised = the average trade return compounded over its average holding time; it is not a portfolio CAGR (positions overlap and cash sits idle between signals). Compare with SPY above.
- Survivorship: the universe is today's index members, which flatters long-only results.
