# Stock scanner backtest (real data, walk-forward)

Generated 2026-10-26 23:18 UTC by `.github/workflows/stock-backtest.yml` (`tools/stock_scanner/backtest.py`). Tickers 736 of 736.

**Verdict:** NOT ENOUGH TRADES out of sample to judge (need 30+). Do not trust the scanner yet.

## What was tested

- The live rules unchanged: `scan.analyse()` + `scan.symbol_signals()` (W1 / MN / 3M zones, top-down nesting, owner ATH curve rule, 250% projection target, stops W1 5% / MN 3% / 3M 2% of the zone height).
- Walk-forward, no look-ahead: each evaluation sees daily bars up to that day and only CLOSED W1 / MN / 3M candles.
- Weekly cadence (last session of each week). Limit at the proximal, filled only when traded through (at the open on a gap down); cancelled on target-first, a close below the distal or after 40 sessions.
- Exits: target, stop (stop first on the same bar; an open below the stop exits at that open), or time after 52 weeks. Trades still running at the data end are not scored.
- Costs 5.0 bps spread + 5.0 bps slippage per side. Split + dividend adjusted prices (Alpaca adjustment=all), so dividends are in the returns.
- Period: signals 2022-10-28 to 2026-03-27; out of sample = signals from 2025-10-03 (newest 30%).

"wick" = stop order in the market (the live plan). "close" = exit only on a daily close below the stop.

## Orders

Signals 6, filled 3 (fill rate 50.0%), not filled {'expired': 3, 'cancelled_target': 0, 'cancelled_removed': 0, 'pending': 0}, still open 0.

## Current rules, wick stop

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| All | 3 | 33.3% | -0.27 | -1.04 to +0.27 | 0.25 | -1.42% | -4.1% | 17.8 | 1.1 | 2 |
| In sample | 2 | 50.0% | +0.12 | -0.03 to +0.27 | 10.39 | +0.53% | 1.1% | 26.0 | 0.0 | 1 |
| Out of sample | 1 | 0.0% | -1.04 | n/a to n/a | 0.00 | -5.33% | -89.0% | 1.3 | 1.0 | 1 |

Gap through the stop: 1; holding through a 10-Q / 10-K: 1.

Same holding windows in SPY: trades avg -1.42% vs SPY +12.74%; trades beating SPY 0.0%.

### By index

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| SPX | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |
| TSX | 2 | 0.0% | -0.53 | -1.04 to -0.03 | 0.00 | -2.76% | -76.7% | 0.6 | 1.1 | 2 |

### By entry timeframe

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| 3M | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |
| W1 | 2 | 0.0% | -0.53 | -1.04 to -0.03 | 0.00 | -2.76% | -76.7% | 0.6 | 1.1 | 2 |

### By zone type

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| ARR | 1 | 0.0% | -1.04 | n/a to n/a | 0.00 | -5.33% | -89.0% | 1.3 | 1.0 | 1 |
| STR | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |
| WOW | 1 | 0.0% | -0.03 | n/a to n/a | 0.00 | -0.20% | -9.9% | 0.0 | 0.0 | 1 |

### By Raja score

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| 7-8 | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |
| 9-10 | 2 | 0.0% | -0.53 | -1.04 to -0.03 | 0.00 | -2.76% | -76.7% | 0.6 | 1.1 | 2 |

### By nesting status

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| inside | 2 | 0.0% | -0.53 | -1.04 to -0.03 | 0.00 | -2.76% | -76.7% | 0.6 | 1.1 | 2 |
| top | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |

### By target kind

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| projection | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |
| supply | 2 | 0.0% | -0.53 | -1.04 to -0.03 | 0.00 | -2.76% | -76.7% | 0.6 | 1.1 | 2 |

### By sector

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| Energy | 1 | 0.0% | -0.03 | n/a to n/a | 0.00 | -0.20% | -9.9% | 0.0 | 0.0 | 1 |
| Health Care | 1 | 100.0% | +0.27 | n/a to n/a | n/a | +1.26% | 1.3% | 52.0 | 0.0 | 0 |
| Materials | 1 | 0.0% | -1.04 | n/a to n/a | 0.00 | -5.33% | -89.0% | 1.3 | 1.0 | 1 |

## Current rules, close stop

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| All | 3 | 33.3% | -0.52 | -1.09 to +0.27 | 0.15 | -3.37% | -9.5% | 17.8 | 1.8 | 2 |
| In sample | 2 | 50.0% | -0.24 | -0.75 to +0.27 | 0.36 | -2.25% | -4.4% | 26.1 | 0.7 | 1 |
| Out of sample | 1 | 0.0% | -1.09 | n/a to n/a | 0.00 | -5.61% | -90.2% | 1.3 | 1.1 | 1 |

Gap through the stop: 0; holding through a 10-Q / 10-K: 1.

Same holding windows in SPY: trades avg -3.37% vs SPY +12.22%; trades beating SPY 0.0%.

## Ablations (wick stop)

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| current: all | 3 | 33.3% | -0.27 | -1.04 to +0.27 | 0.25 | -1.42% | -4.1% | 17.8 | 1.1 | 2 |
| current: out of sample | 1 | 0.0% | -1.04 | n/a to n/a | 0.00 | -5.33% | -89.0% | 1.3 | 1.0 | 1 |
| no_nesting: all | 71 | 29.6% | +0.86 | +0.12 to +1.69 | 2.13 | +6.16% | 35.2% | 10.3 | 15.9 | 13 |
| no_nesting: out of sample | 15 | 26.7% | +0.93 | -0.62 to +2.64 | 2.28 | +4.65% | 37.3% | 7.5 | 5.1 | 5 |
| no_ath: all | 3 | 33.3% | -0.27 | -1.04 to +0.27 | 0.25 | -1.42% | -4.1% | 17.8 | 1.1 | 2 |
| no_ath: out of sample | 1 | 0.0% | -1.04 | n/a to n/a | 0.00 | -5.33% | -89.0% | 1.3 | 1.0 | 1 |
| no_nesting, nested (would pass) | 3 | 33.3% | -0.27 | -1.04 to +0.27 | 0.25 | -1.42% | -4.1% | 17.8 | 1.1 | 2 |
| no_nesting, not nested (blocked live) | 68 | 29.4% | +0.91 | +0.12 to +1.79 | 2.17 | +6.49% | 38.8% | 10.0 | 15.9 | 13 |

Old D1 / W1 rules: not run: the old D1 / W1 rules are no longer selectable (D1 zones and the D1 direction were removed from scan.analyse in da14866).

## Random-entry baseline (same stop / target geometry)

random weekly day on the same ticker, next-open entry, same stop / target % and exit rules (3 draws per trade, seeded).

| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |
|---|---|---|---|---|---|---|---|---|---|---|
| random: all | 9 | 0.0% | -1.04 | -1.04 to -1.03 | 0.00 | -5.75% | -57.1% | 3.6 | 9.3 | 9 |
| random: out of sample | 0 | | | | | | | | | |

Edge of the zones over random entries: +0.77R per trade (wick), +0.70R (close).

## SPY buy and hold, same period

2022-10-28 to 2026-10-26: total 107.3%, CAGR 20.0%, max drawdown 18.8% (SPY adjusted closes (dividends reinvested), no costs).

## How to read this

- Avg R = expectancy per trade in units of the planned risk; trust needs the out-of-sample 95% CI above zero.
- Win rate below 100% means losing signals exist: no rule set gives zero false signals. Plan the size so the losing streak and max drawdown above are survivable.
- Annualised = the average trade return compounded over its average holding time; it is not a portfolio CAGR (positions overlap and cash sits idle between signals). Compare with SPY above.
- Survivorship: the universe is today's index members, which flatters long-only results.
