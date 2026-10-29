# Stock scanner backtest (real data, walk-forward)

Generated 2026-10-26 23:52 UTC by `.github/workflows/stock-backtest.yml` (`tools/stock_scanner/backtest.py`). Tickers 736 of 736.

**Verdict:** NOT ENOUGH TRADES out of sample to judge (need 30+). Do not trust the scanner yet.

## What was tested

- The live rules unchanged: `scan.analyse()` + `scan.symbol_signals()` (W1 / MN / 3M zones, top-down nesting, owner ATH curve rule, 250% projection target, stops W1 5% / MN 3% / 3M 2% of the zone height).
- Walk-forward, no look-ahead: each evaluation sees daily bars up to that day and only CLOSED W1 / MN / 3M candles.
- Weekly cadence (last session of each week). Limit at the proximal, filled only when traded through (at the open on a gap down); cancelled on target-first, a close below the distal or after 40 sessions.
- Exits: target, stop (stop first on the same bar; an open below the stop exits at that open), or time after 52 weeks. Trades still running at the data end are not scored.
- Costs 5.0 bps spread + 5.0 bps slippage per side. Split-adjusted prices (Alpaca adjustment=split, the TradingView default chart): dividends are NOT in the returns.
- Period: signals 2024-04-26 to 2026-06-05; out of sample = signals from 2024-06-28 (newest 30%).

"wick" = stop order in the market (the live plan). "close" = exit only on a daily close below the stop.

## Orders

Signals 5, filled 1 (fill rate 20.0%), not filled {'expired': 3, 'cancelled_target': 1, 'cancelled_removed': 0, 'pending': 0}, still open 0.

## Current rules, wick stop

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| All | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| In sample | 0 | | | | | | | | | |
| Out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

Gap through the stop: 0; holding through a 10-Q / 10-K: 1.

Same holding windows in SPY: trades avg -23.26% vs SPY +5.99%; trades beating SPY 0.0%.

### By index

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| SPX | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

### By entry timeframe

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| MN | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

### By zone type

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| ARR | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

### By Raja score

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| 9-10 | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

### By nesting status

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| top | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

### By target kind

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| supply | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

### By sector

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| Industrials | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

## Current rules, close stop

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| All | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| In sample | 0 | | | | | | | | | |
| Out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |

Gap through the stop: 0; holding through a 10-Q / 10-K: 1.

Same holding windows in SPY: trades avg -23.26% vs SPY +5.99%; trades beating SPY 0.0%.

## Ablations (wick stop)

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| current: all | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| current: out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| no_nesting: all | 19 | 21.1% | +0.10 | -0.77 to +1.15 | 1.14 | +2.37% | 20.1% | 6.7 | 6.6 | 7 |
| no_nesting: out of sample | 5 | 20.0% | +0.10 | -1.19 to +2.53 | 1.12 | -4.74% | -14.5% | 16.1 | 3.3 | 3 |
| no_ath: all | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| no_ath: out of sample | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| no_nesting, nested (would pass) | 1 | 0.0% | -1.01 | n/a to n/a | 0.00 | -23.26% | -57.1% | 16.3 | 1.0 | 1 |
| no_nesting, not nested (blocked live) | 18 | 22.2% | +0.16 | -0.74 to +1.23 | 1.23 | +3.79% | 37.2% | 6.1 | 5.6 | 7 |

Old D1 / W1 rules: not run: the old D1 / W1 rules are no longer selectable (D1 zones and the D1 direction were removed from scan.analyse in da14866).

## Random-entry baseline (same stop / target geometry)

random weekly day on the same ticker, next-open entry, same stop / target % and exit rules (3 draws per trade, seeded).

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| random: all | 3 | 66.7% | +2.67 | -1.01 to +4.82 | 8.95 | +61.67% | 597.9% | 12.9 | 1.0 | 1 |
| random: out of sample | 2 | 50.0% | +1.60 | -1.01 to +4.21 | 4.17 | +36.90% | 68663.3% | 2.5 | 1.0 | 1 |

Edge of the zones over random entries: -3.68R per trade (wick), -3.62R (close).

## SPY buy and hold, same period

2024-04-26 to 2026-10-26: total 50.6%, CAGR 17.8%, max drawdown 19.0% (SPY split-adjusted closes (dividends not included, same as the trades), no costs).

## How to read this

- Avg R = expectancy per trade in units of the planned risk; trust needs the out-of-sample 95% CI above zero.
- Win rate below 100% means losing signals exist: no rule set gives zero false signals. Plan the size so the losing streak and max drawdown above are survivable.
- Annualised = the average trade return compounded over its average holding time; it is not a portfolio CAGR (positions overlap and cash sits idle between signals). Compare with SPY above.
- Survivorship: the universe is today's index members, which flatters long-only results.
