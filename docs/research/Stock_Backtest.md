# Stock scanner backtest (real data, walk-forward)

Generated 2026-11-03 04:32 UTC by `.github/workflows/stock-backtest.yml` (`tools/stock_scanner/backtest.py`). Tickers 736 of 736.

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

2017-05-05 to 2026-11-02: total 213.8%, CAGR 12.8%, max drawdown 34.2% (SPY split-adjusted closes (dividends not included, same as the trades), no costs).

## Experiments (auto-learner input, `public/learn/stock_experiments.json`)

Each variant = the current rules with ONE change (`tools/stock_scanner/experiments.py`, the same functions the live scanner will import when a variant is adopted). Same walk-forward, the same signals of each evaluation day (computed once and shared), wick stop (the live plan), the same costs, one position per ticker per variant (free again after its wick exit; the main report's current rules also wait for the close-stop exit, so its trade list can differ slightly). In sample = signals before 2024-06-28 (older 70% of the current fills), out of sample = from then on. Expectancy in R after costs, bootstrap 95% CI. MFE / MAE = best / worst price move from the fill to the exit in R.

Current trades' excursions (n 2): MFE p25 / p50 / p75 / p90 = 2.14 / 2.26 / 2.38 / 2.45R; MAE 0.44 / 0.62 / 0.81 / 0.93R.

### `current` (baseline)

The live rules unchanged (the baseline every variant is compared with).

Rule: scan.analyse() + scan.symbol_signals() as live; limit at the proximal, wick stop and target in the market, 52-week time exit, one position per ticker.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `be_1r` (exit)

Move the stop to the fill price once a daily high has reached +1R.

Rule: At the close of a session after the fill bar whose high reached fill + 1R, the stop becomes the fill price from the next session on (a gap below it exits at the open).

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -0.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 0.41R, 23.0 sessions, max DD 0.0R

### `be_2r` (exit)

Move the stop to the fill price once a daily high has reached +2R.

Rule: As be_1r with the trigger at fill + 2R.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -0.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 0.41R, 23.0 sessions, max DD 0.0R

### `be_struct` (exit)

After +1.5R, raise the stop to the lowest daily low since the fill (it only ever tightens).

Rule: At the close of a session once a high after the fill bar reached fill + 1.5R, the stop becomes the lowest daily low from the fill bar up to that session, if that is higher than the stop (only tightens), from the next session on.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -0.42R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 0.41R, 24.0 sessions, max DD 0.4R

### `time_stop` (exit)

Sell at the close of the 20th session after the fill if price has not reached +1R by then.

Rule: If no high of the 20 sessions after the fill bar reached fill + 1R, exit at the close of the 20th session.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `tp_fixed3` (exit)

Take profit at exactly 3R instead of the next supply / projection.

Rule: Target = entry + 3 x (entry - stop); the order is also cancelled when that target trades first.

- In sample: 1 trades, win 100.0%, +2.99R / trade (95% CI n/a to n/a), PF n/a, MFE 3.00R, MAE 0.25R, 45.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `tp_zone` (exit)

Take profit just below the nearest not-removed supply zone above (W1, MN or 3M, tested ones too); skip the trade if that is under 2.5R.

Rule: Target = 0.5% under the nearest proximal above the entry among the not-removed supply zones of the W1, MN and 3M rows of the signal-day analysis (tested ones and lower-TF ones too); no trade when that is < 2.5R; no supply above = the live target (250% projection).

- In sample: 1 trades, win 100.0%, +2.51R / trade (95% CI n/a to n/a), PF n/a, MFE 2.52R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 0 trades

### `fresh_body` (freshness)

A zone counts as used only once a daily candle CLOSED inside it (wick-only touches keep it fresh).

Rule: The freshness rule (L2 · L52) is replaced: a zone is used only once a daily close <= its proximal happened after its stay-away period. Tested zones (1-2 wick touches, not removed) whose ONLY failed rule is freshness become BUYs; one BUY per timeframe, the nearest.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `fresh_depth25` (freshness)

A zone counts as used only once price went at least 25% of the zone height inside it.

Rule: As fresh_body, but used = a daily low <= proximal - 25% of the zone height.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `cont_off` (continuation)

Never buy continuation (rally-base-rally) zones.

Rule: No BUY on a zone whose pattern is RBR (rally-base-rally continuation).

- In sample: 0 trades
- Out of sample: 0 trades

### `cont_nested` (continuation)

Buy a rally-base-rally zone only when it sits inside a touched higher-timeframe demand zone.

Rule: An RBR zone gives a BUY only when its top-down location code is "inside" (inside a touched MN demand for W1, a touched 3M demand for MN); "top" (3M, or no HTF in reach) does not count as nested.

- In sample: 1 trades, win 100.0%, +5.23R / trade (95% CI n/a to n/a), PF n/a, MFE 5.25R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 0 trades

### `stop_atr` (stop)

Stop at the wider of the current stop and the distal minus one weekly ATR14 (R recomputed; under 2R room = no trade).

Rule: Stop = min(live stop, distal - 1.0 x weekly ATR14) with ATR14 = mean true range of the last 14 CLOSED weekly bars; R and R:R use the new stop; no trade when the room falls under 2R (the live room rule).

- In sample: 1 trades, win 100.0%, +2.06R / trade (95% CI n/a to n/a), PF n/a, MFE 2.06R, MAE 0.10R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 100.0%, +2.16R / trade (95% CI n/a to n/a), PF n/a, MFE 2.17R, MAE 0.58R, 97.0 sessions, max DD 0.0R

### `arrive_stair` (filter)

Skip the trade when the last 10 sessions before the first touch were a slow stair-step approach.

Rule: At the first session that touches the proximal (low <= entry) the order is withdrawn when the 10 sessions before it were a stair-step approach: mean |close - open| < 0.5 x ATR14, or >= 2 small-range bases (runs of >= 2 consecutive bars each with high - low < 0.6 x ATR14); ATR14 = mean true range of the 14 sessions before the touch. A withdrawn first touch ends the setup.

- In sample: 0 trades
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `curve_top3` (filter)

No buy when the entry sits in the top third of the last 2 years' range.

Rule: No BUY when the entry >= low + 2/3 x (high - low) of the last 504 daily bars up to the signal day.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `cancel_50` (filter)

Cancel the waiting order once price has gone half way to the target without filling it.

Rule: Cancel the waiting order at the close of a session (before any fill) whose high reached entry + 50% of (target - entry).

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `market_regime` (filter)

No new buy while SPY closes below its 200-day average.

Rule: No BUY when SPY's close on the signal day is below the mean of its last 200 closes (fewer than 200 = allowed).

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `earnings_skip` (filter)

Skip a trade whose fill would hold through an earnings date within 10 sessions.

Rule: Skip a signal whose fill would hold through an earnings date within 10 sessions.

Not run: no historical earnings dates in the cached data: data.fetch_earnings only knows the NEXT date and the fundamentals cache keeps only the last 16 10-Q / 10-K filing dates (filed days to weeks after the release, about 4 years), so most of the test period would have no dates and the rest a proxy.

### `volreg_half` (size)

Half size when the daily ATR14 is in the top 10% of its last 250 values.

Rule: Half size (R x 0.5) when the daily ATR14 on the signal day is higher than at least 90% of its last 250 values.

- In sample: 1 trades, win 100.0%, +2.49R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -1.01R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 1.0R

### `split_entry` (size)

Buy half at the proximal and half at the middle of the zone (same stop and target).

Rule: Half the shares at the proximal, half at the zone middle (proximal - 50% of the height), same stop / target; the second order lives while the first half is open (order life 40 sessions, a close under the distal cancels it). R is in units of the full position at the proximal: 0.5 x R1 + 0.5 x R2 (R2 = 0 when not filled).

- In sample: 1 trades, win 100.0%, +1.24R / trade (95% CI n/a to n/a), PF n/a, MFE 2.50R, MAE 0.25R, 24.0 sessions, max DD 0.0R
- Out of sample: 1 trades, win 0.0%, -0.77R / trade (95% CI n/a to n/a), PF 0.00, MFE 2.02R, MAE 1.00R, 80.0 sessions, max DD 0.8R

## How to read this

- Avg R = expectancy per trade in units of the planned risk; trust needs the out-of-sample 95% CI above zero.
- Win rate below 100% means losing signals exist: no rule set gives zero false signals. Plan the size so the losing streak and max drawdown above are survivable.
- Annualised = the average trade return compounded over its average holding time; it is not a portfolio CAGR (positions overlap and cash sits idle between signals). Compare with SPY above.
- Survivorship: the universe is today's index members, which flatters long-only results.
