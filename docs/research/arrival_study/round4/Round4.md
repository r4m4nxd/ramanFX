# Arrival study, round 4: do simple published strategies beat the zone method on the same instruments?

Generated 2026-11-03 06:14 UTC by `tools/research/arrival_study/round4.py` (GitHub Actions, OANDA practice). 115 instruments with D1 data (FX 68, indices 16, metals 23, commodities 8), runtime 1.1 min.

## The answer in plain English

**4 of 9 strategy variants made money after spread costs in both 2010–2019 and 2020–2026** (portfolio CAGR > 0 in each period):

- **TSMOM 12-month, long / short**: Sharpe +0.07 (train) / +0.72 (test, CI -0.02 … +1.52); at 10% vol the test years returned +6.9% a year, worst drawdown 15%. Halves +0.70 / +0.70; does not pass every check (see below).
- **TSMOM 6-month, long / short**: Sharpe +0.02 (train) / +0.64 (test, CI -0.02 … +1.37); at 10% vol the test years returned +6.2% a year, worst drawdown 18%. Halves +0.62 / +0.62; does not pass every check (see below).
- **TSMOM 12-month, long-only, indices + metals**: Sharpe +0.63 (train) / +0.96 (test, CI +0.29 … +1.74); at 10% vol the test years returned +12.5% a year, worst drawdown 25%. Halves +0.90 / +0.99; **passes every check**.
- **RSI(2) buy-the-dip (long), indices + metals**: Sharpe +0.14 (train) / +0.29 (test, CI -0.34 … +1.04); at 10% vol the test years returned +2.3% a year, worst drawdown 13%; per trade +0.02R → +0.03R. Halves +0.42 / +0.12; does not pass every check (see below).

**1 passed every check** (positive Sharpe in train and test, positive in both random instrument halves, per-trade R > 0 in both periods where R exists, and a Benjamini-Hochberg discovery at q = 0.05 over 9 variants): TSMOM 12-month, long-only, indices + metals.

- **Lost money in 2020–2026 (net Sharpe ≤ 0):** RSI(2) sell-the-rip (short), indices + metals -0.94; RSI(2) sell-the-rip (short), FX -0.21.
- **Versus the zone method** (round 3, not recomputed: every fresh zone (D1 + H4), fixed 2R: -0.08R train / -0.09R test (n = 14284); arrivals, fixed 2R: -0.08R train / -0.11R test (n = 1488)): Donchian 55 / 20 breakout, long / short -0.06R / +0.04R (n = 3345); RSI(2) buy-the-dip (long), indices + metals +0.02R / +0.03R (n = 1864); RSI(2) buy-the-dip (long), FX -0.01R / -0.00R (n = 2574); RSI(2) sell-the-rip (short), indices + metals -0.11R / -0.14R (n = 852); RSI(2) sell-the-rip (short), FX -0.04R / -0.02R (n = 2357). The momentum strategies (A) have no stop, so no R; compare them on Sharpe: round 3 measured the zone method per trade only (no portfolio Sharpe), and both of its baselines lost money per trade in both periods.

**How sure:** 9 variants were counted (A: 4 = three lookbacks + long-only; B: 1; C: 4 = long / short × indices+metals / FX); the breakdown and reference rows are not counted. By luck alone about 0.5 would look 'significant' at p < 0.05; Bonferroni needs p < 0.0056. The month-block bootstrap keeps each calendar month together (instruments that move together in a month resample together). A test-period Sharpe of 0.3–0.5 over ~7 years has a CI roughly ±0.7 wide, so even a real edge of that size is hard to tell from zero in one period: read the CIs, not only the signs. Literature context: TSMOM's published edge is weaker since ~2012 (e.g. Huang et al. 2020, Hurst-Ooi-Pedersen updates), and these CFD / spot FX results ignore swaps (FX carry can add or subtract ~1–3% a year).

## Comparison

Net of spread costs. Sharpe = annualized daily Sharpe of the equal-weight portfolio (no risk-free rate). "@10% vol" = the portfolio levered so its 2010–2019 volatility was 10% (the same leverage in 2020–2026; Sharpe does not depend on it). R: B = move / (2 × ATR20, the stop); C = move / (2 × ATR20) as a nominal R (C has no stop). Zone rows: round 3 per-trade R (week-block CI), copied from `public/learn/round3_summary.json`.

| strategy | train Sharpe | test Sharpe | test Sharpe 95% CI | test CAGR @10% vol | test max DD @10% vol | test years up | train avg R | test avg R | money in both periods | survives |
|---|---|---|---|---|---|---|---|---|---|---|
| TSMOM 12-month, long / short | +0.07 | +0.72 | -0.02 … +1.52 | +6.9% | 15% | 6/7 | n/a | n/a | yes | no |
| TSMOM 6-month, long / short | +0.02 | +0.64 | -0.02 … +1.37 | +6.2% | 18% | 4/7 | n/a | n/a | yes | no |
| TSMOM 3-month, long / short | -0.35 | +0.27 | -0.53 … +0.97 | +2.3% | 22% | 3/7 | n/a | n/a | no | no |
| TSMOM 12-month, long-only, indices + metals | +0.63 | +0.96 | +0.29 … +1.74 | +12.5% | 25% | 5/7 | n/a | n/a | yes | **YES** |
| Donchian 55 / 20 breakout, long / short | -0.13 | +0.10 | -0.55 … +0.65 | +0.4% | 24% | 2/7 | -0.06 | +0.04 | no | no |
| RSI(2) buy-the-dip (long), indices + metals | +0.14 | +0.29 | -0.34 … +1.04 | +2.3% | 13% | 3/7 | +0.02 | +0.03 | yes | no |
| RSI(2) buy-the-dip (long), FX | -0.06 | +0.04 | -0.74 … +0.86 | -0.0% | 23% | 4/7 | -0.01 | -0.00 | no | no |
| RSI(2) sell-the-rip (short), indices + metals | -0.81 | -0.94 | -1.52 … -0.34 | -7.0% | 45% | 1/7 | -0.11 | -0.14 | no | no |
| RSI(2) sell-the-rip (short), FX | -0.47 | -0.21 | -0.88 … +0.51 | -2.0% | 25% | 2/7 | -0.04 | -0.02 | no | no |
| reference: vol-targeted buy and hold, indices + metals | +0.65 | +1.10 | +0.38 … +1.92 | +12.3% | 22% | 5/7 | n/a | n/a | yes | – |
| zone method (round 3): every fresh zone (D1 + H4), fixed 2R | n/a | n/a | – | n/a | n/a | – | -0.08 (n 20783) | -0.09 (n 14284, CI -0.12 … -0.07) | no (per trade) | no (round 3) |
| zone method (round 3): arrivals, fixed 2R | n/a | n/a | – | n/a | n/a | – | -0.08 (n 2174) | -0.11 (n 1488, CI -0.19 … -0.03) | no (per trade) | no (round 3) |

## Strategies (fixed before any result)

- **A. Time-series momentum** (Moskowitz, Ooi & Pedersen 2012, "Time series momentum", JFE): at each month-end close, the sign of the instrument's own 12- (6-, 3-) month return; long when > 0, else short; weight = 10% / the 60-day realized vol (annualized by the bars of the last 365 days), filled at the next D1 open, held to the next month-end. Long-only 12-month on indices + metals (equity / metal risk premia are positive on average, so the short side is the doubtful half there). Three lookbacks are three variants and counted as such.
- **B. Donchian breakout** (Donchian; the Turtle rules, Faith 2007; Clenow 2013): long on a close above the prior 55-day high, exit on a close below the prior 20-day low (short mirrored); fills at the next open; hard stop 2 × ATR20 from the entry (a gap through it fills at the open); size = 1% of the sub-account at that stop.
- **C. RSI(2) mean reversion** (Connors & Alvarez 2008, "Short Term Trading Strategies That Work"): close > 200-day SMA and Wilder RSI(2) < 10 → buy at that close; exit at the close when close > 5-day SMA, or at the 10th close. Short mirrored (close < SMA200, RSI > 90, exit close < SMA5). Indices + metals and FX separately (equity indices are where it was published; FX for completeness). Size = 1% of the sub-account per 2 × ATR20. A next-open-fill version is shown as a non-counted check (the close fill assumes a market-on-close order).
- **D. Zone method**: round 3's baselines (every fresh D1 / H4 zone, limit at the proximal, round-2 stop, fixed 2R; and verified arrivals, fixed 2R), copied from round 3's output.
- **Reference** (not counted): a vol-targeted buy and hold (always long, the same 10% / vol60 sizing, monthly), to show what simply holding the indices + metals did.

## Results: portfolios

Inst. = instruments with that stream. Half A / B = the test-period Sharpe in each of round 3's seeded random halves of the instruments. p = one-sided month-block bootstrap p of the test mean monthly return (H0 ≤ 0). BH = Benjamini-Hochberg discovery at q = 0.05 over the 9 counted variants. Breakdown / reference rows are not counted.

| family | variant | inst. | period | Sharpe (net) | Sharpe gross | Sharpe 95% CI | raw vol | raw CAGR | CAGR @10% | max DD @10% | years up | mean month @10% (95% CI) | cost drag / yr @10% | p (one-sided) | half A / B Sharpe | BH | survives |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A momentum | TSMOM 12-month, long / short | 115 | train 2010–2019 | +0.07 | +0.11 | -0.51 … +0.67 | 3.3% | +0.2% | +0.2% | 29% | 5/10 | +0.06% (-0.47 … +0.59%) | 0.4% | – |  |  |  |
| A momentum | TSMOM 12-month, long / short | 115 | test 2020–2026 | +0.72 | +0.74 | -0.02 … +1.52 | 3.6% | +2.4% | +6.9% | 15% | 6/7 | +0.60% (-0.02 … +1.28%) | 0.3% | 0.0340 | +0.70 / +0.70 | no | no |
| A momentum | TSMOM 6-month, long / short | 115 | train 2010–2019 | +0.02 | +0.07 | -0.60 … +0.60 | 3.3% | +0.0% | -0.3% | 27% | 5/10 | +0.02% (-0.51 … +0.54%) | 0.5% | – |  |  |  |
| A momentum | TSMOM 6-month, long / short | 115 | test 2020–2026 | +0.64 | +0.67 | -0.02 … +1.37 | 3.6% | +2.1% | +6.2% | 18% | 4/7 | +0.54% (-0.02 … +1.18%) | 0.4% | 0.0434 | +0.62 / +0.62 | no | no |
| A momentum | TSMOM 3-month, long / short | 115 | train 2010–2019 | -0.35 | -0.28 | -0.91 … +0.19 | 3.4% | -1.3% | -4.1% | 47% | 3/10 | -0.31% (-0.79 … +0.16%) | 0.6% | – |  |  |  |
| A momentum | TSMOM 3-month, long / short | 115 | test 2020–2026 | +0.27 | +0.32 | -0.53 … +0.97 | 3.9% | +0.9% | +2.3% | 22% | 3/7 | +0.23% (-0.42 … +0.89%) | 0.5% | 0.2399 | +0.17 / +0.36 | no | no |
| A momentum | TSMOM 12-month, long-only, indices + metals | 39 | train 2010–2019 | +0.63 | +0.65 | +0.03 … +1.26 | 4.4% | +2.8% | +6.1% | 16% | 6/10 | +0.53% (+0.03 … +1.07%) | 0.2% | – |  |  |  |
| A momentum | TSMOM 12-month, long-only, indices + metals | 39 | test 2020–2026 | +0.96 | +0.97 | +0.29 … +1.74 | 6.5% | +5.6% | +12.5% | 25% | 5/7 | +1.04% (+0.30 … +1.86%) | 0.1% | 0.0041 | +0.90 / +0.99 | yes | **YES** |
| B breakout | Donchian 55 / 20 breakout, long / short | 115 | train 2010–2019 | -0.13 | -0.03 | -0.71 … +0.44 | 1.5% | -0.2% | -1.9% | 24% | 5/10 | -0.12% (-0.63 … +0.40%) | 1.0% | – |  |  |  |
| B breakout | Donchian 55 / 20 breakout, long / short | 115 | test 2020–2026 | +0.10 | +0.15 | -0.55 … +0.65 | 1.9% | +0.2% | +0.4% | 24% | 2/7 | +0.07% (-0.48 … +0.67%) | 0.7% | 0.4024 | +0.14 / +0.05 | no | no |
| C mean reversion | RSI(2) buy-the-dip (long), indices + metals | 39 | train 2010–2019 | +0.14 | +0.35 | -0.34 … +0.67 | 1.0% | +0.1% | +0.9% | 23% | 7/10 | +0.11% (-0.31 … +0.53%) | 2.1% | – |  |  |  |
| C mean reversion | RSI(2) buy-the-dip (long), indices + metals | 39 | test 2020–2026 | +0.29 | +0.39 | -0.34 … +1.04 | 1.0% | +0.3% | +2.3% | 13% | 3/7 | +0.22% (-0.30 … +0.75%) | 1.2% | 0.2076 | +0.42 / +0.12 | no | no |
| C mean reversion | RSI(2) buy-the-dip (long), FX | 68 | train 2010–2019 | -0.06 | +0.43 | -0.57 … +0.46 | 0.4% | -0.0% | -1.2% | 26% | 3/10 | -0.07% (-0.51 … +0.38%) | 5.0% | – |  |  |  |
| C mean reversion | RSI(2) buy-the-dip (long), FX | 68 | test 2020–2026 | +0.04 | +0.38 | -0.74 … +0.86 | 0.4% | +0.0% | -0.0% | 23% | 4/7 | +0.03% (-0.53 … +0.56%) | 3.2% | 0.4503 | -0.15 / +0.19 | no | no |
| C mean reversion | RSI(2) sell-the-rip (short), indices + metals | 39 | train 2010–2019 | -0.81 | -0.56 | -1.39 … -0.22 | 0.6% | -0.5% | -8.4% | 60% | 1/10 | -0.67% (-1.22 … -0.17%) | 2.5% | – |  |  |  |
| C mean reversion | RSI(2) sell-the-rip (short), indices + metals | 39 | test 2020–2026 | -0.94 | -0.82 | -1.52 … -0.34 | 0.5% | -0.4% | -7.0% | 45% | 1/7 | -0.58% (-0.97 … -0.20%) | 0.9% | 0.9981 | -0.63 / -1.15 | no | no |
| C mean reversion | RSI(2) sell-the-rip (short), FX | 68 | train 2010–2019 | -0.47 | -0.01 | -1.01 … +0.10 | 0.4% | -0.2% | -5.3% | 48% | 2/10 | -0.41% (-0.86 … +0.07%) | 4.6% | – |  |  |  |
| C mean reversion | RSI(2) sell-the-rip (short), FX | 68 | test 2020–2026 | -0.21 | +0.16 | -0.88 … +0.51 | 0.4% | -0.1% | -2.0% | 25% | 2/7 | -0.14% (-0.60 … +0.32%) | 3.2% | 0.7263 | -0.14 / -0.24 | no | no |
| reference | reference: vol-targeted buy and hold, indices + metals | 39 | train 2010–2019 | +0.65 | +0.66 | +0.08 … +1.29 | 6.1% | +4.0% | +6.4% | 14% | 7/10 | +0.55% (+0.07 … +1.06%) | 0.1% | – |  |  |  |
| reference | reference: vol-targeted buy and hold, indices + metals | 39 | test 2020–2026 | +1.10 | +1.10 | +0.38 … +1.92 | 7.5% | +7.5% | +12.3% | 22% | 5/7 | +1.00% (+0.34 … +1.66%) | 0.0% | 0.0010 | +1.12 / +1.04 | – | – |
| reference | reference: vol-targeted buy and hold, all instruments | 115 | train 2010–2019 | +0.65 | +0.66 | +0.08 … +1.20 | 2.5% | +1.7% | +6.5% | 13% | 8/10 | +0.56% (+0.06 … +1.02%) | 0.2% | – |  |  |  |
| reference | reference: vol-targeted buy and hold, all instruments | 115 | test 2020–2026 | +1.43 | +1.44 | +0.70 … +2.28 | 3.0% | +4.0% | +16.4% | 22% | 7/7 | +1.30% (+0.66 … +1.95%) | 0.1% | <0.0001 | +1.48 / +1.28 | – | – |
| A breakdown | TSMOM 12-month L/S, FX only | 68 | train 2010–2019 | -0.10 | -0.06 | -0.71 … +0.51 | 3.6% | -0.4% | -1.5% | 24% | 3/10 | -0.08% (-0.66 … +0.44%) | 0.4% | – |  |  |  |
| A breakdown | TSMOM 12-month L/S, FX only | 68 | test 2020–2026 | +0.45 | +0.48 | -0.25 … +1.21 | 4.1% | +1.6% | +4.1% | 23% | 5/7 | +0.38% (-0.21 … +1.11%) | 0.3% | 0.1303 | +0.58 / +0.28 | – | – |
| A breakdown | TSMOM 12-month L/S, indices + metals only | 39 | train 2010–2019 | +0.29 | +0.32 | -0.34 … +0.87 | 5.2% | +1.4% | +2.5% | 25% | 6/10 | +0.25% (-0.28 … +0.74%) | 0.3% | – |  |  |  |
| A breakdown | TSMOM 12-month L/S, indices + metals only | 39 | test 2020–2026 | +0.64 | +0.65 | -0.03 … +1.37 | 6.4% | +3.6% | +6.6% | 27% | 3/7 | +0.58% (-0.04 … +1.27%) | 0.2% | 0.0446 | +0.48 / +0.77 | – | – |
| A breakdown | TSMOM 12-month L/S, commodities only | 8 | train 2010–2019 | -0.15 | -0.12 | -0.81 … +0.48 | 5.1% | -0.9% | -1.9% | 37% | 3/10 | -0.12% (-0.65 … +0.39%) | 0.3% | – |  |  |  |
| A breakdown | TSMOM 12-month L/S, commodities only | 8 | test 2020–2026 | +0.40 | +0.43 | -0.33 … +1.14 | 5.5% | +1.9% | +3.4% | 16% | 4/7 | +0.32% (-0.25 … +0.94%) | 0.3% | 0.1598 | +0.26 / +0.36 | – | – |
| B breakdown | Donchian L/S, FX only | 68 | train 2010–2019 | -0.17 | -0.07 | -0.72 … +0.38 | 1.7% | -0.3% | -2.2% | 25% | 4/10 | -0.15% (-0.63 … +0.35%) | 1.0% | – |  |  |  |
| B breakdown | Donchian L/S, FX only | 68 | test 2020–2026 | -0.24 | -0.17 | -0.99 … +0.38 | 1.8% | -0.4% | -2.7% | 26% | 2/7 | -0.20% (-0.71 … +0.30%) | 0.7% | 0.7834 | -0.01 / -0.46 | – | – |
| B breakdown | Donchian L/S, indices + metals only | 39 | train 2010–2019 | -0.09 | -0.04 | -0.69 … +0.49 | 2.6% | -0.3% | -1.5% | 36% | 3/10 | -0.09% (-0.55 … +0.44%) | 0.6% | – |  |  |  |
| B breakdown | Donchian L/S, indices + metals only | 39 | test 2020–2026 | +0.33 | +0.35 | -0.37 … +0.91 | 3.5% | +1.0% | +3.2% | 25% | 3/7 | +0.31% (-0.34 … +1.01%) | 0.3% | 0.1766 | +0.26 / +0.38 | – | – |
| B breakdown | Donchian L/S, commodities only | 8 | train 2010–2019 | +0.30 | +0.37 | -0.30 … +0.92 | 2.2% | +0.6% | +2.4% | 19% | 5/10 | +0.24% (-0.24 … +0.76%) | 0.7% | – |  |  |  |
| B breakdown | Donchian L/S, commodities only | 8 | test 2020–2026 | +0.33 | +0.38 | -0.42 … +1.06 | 2.7% | +0.8% | +2.9% | 28% | 3/7 | +0.29% (-0.35 … +1.02%) | 0.6% | 0.2036 | -0.15 / +0.48 | – | – |
| B breakdown | Donchian, long side only | 115 | train 2010–2019 | +0.21 | +0.30 | -0.38 … +0.77 | 0.9% | +0.2% | +1.7% | 14% | 7/10 | +0.18% (-0.32 … +0.69%) | 0.9% | – |  |  |  |
| B breakdown | Donchian, long side only | 115 | test 2020–2026 | +0.71 | +0.75 | +0.05 … +1.31 | 1.3% | +0.8% | +8.5% | 19% | 6/7 | +0.73% (+0.05 … +1.46%) | 0.6% | 0.0222 | +0.77 / +0.62 | – | – |
| B breakdown | Donchian, short side only | 115 | train 2010–2019 | -0.46 | -0.38 | -1.06 … +0.12 | 0.9% | -0.4% | -5.3% | 44% | 3/10 | -0.41% (-0.91 … +0.11%) | 0.8% | – |  |  |  |
| B breakdown | Donchian, short side only | 115 | test 2020–2026 | -0.75 | -0.70 | -1.71 … -0.16 | 1.0% | -0.7% | -8.1% | 58% | 1/7 | -0.68% (-1.13 … -0.25%) | 0.6% | 0.9986 | -0.67 / -0.79 | – | – |
| C breakdown | RSI(2) long, commodities | 8 | train 2010–2019 | -0.44 | -0.26 | -1.03 … +0.18 | 0.8% | -0.4% | -4.6% | 44% | 3/10 | -0.35% (-0.87 … +0.12%) | 1.8% | – |  |  |  |
| C breakdown | RSI(2) long, commodities | 8 | test 2020–2026 | -0.41 | -0.25 | -1.15 … +0.29 | 0.8% | -0.3% | -3.6% | 35% | 1/7 | -0.28% (-0.81 … +0.18%) | 1.4% | 0.8586 | -0.20 / -0.42 | – | – |
| C breakdown | RSI(2) short, commodities | 8 | train 2010–2019 | -0.02 | +0.30 | -0.62 … +0.59 | 0.8% | -0.0% | -0.7% | 24% | 2/10 | -0.02% (-0.51 … +0.45%) | 3.2% | – |  |  |  |
| C breakdown | RSI(2) short, commodities | 8 | test 2020–2026 | +0.05 | +0.31 | -0.54 … +0.68 | 0.7% | +0.0% | +0.0% | 17% | 3/7 | +0.02% (-0.42 … +0.41%) | 2.4% | 0.4641 | -0.01 / +0.06 | – | – |
| C breakdown | RSI(2) long, indices + metals, filled at the next open | 39 | train 2010–2019 | +0.10 | +0.31 | -0.38 … +0.64 | 1.0% | +0.1% | +0.5% | 24% | 6/10 | +0.07% (-0.35 … +0.50%) | 2.1% | – |  |  |  |
| C breakdown | RSI(2) long, indices + metals, filled at the next open | 39 | test 2020–2026 | +0.22 | +0.33 | -0.39 … +0.96 | 1.0% | +0.2% | +1.6% | 14% | 4/7 | +0.16% (-0.34 … +0.67%) | 1.1% | 0.2663 | +0.36 / +0.06 | – | – |
| C breakdown | RSI(2) long, FX, filled at the next open | 68 | train 2010–2019 | -0.10 | +0.40 | -0.61 … +0.42 | 0.4% | -0.0% | -1.5% | 27% | 3/10 | -0.10% (-0.55 … +0.36%) | 4.9% | – |  |  |  |
| C breakdown | RSI(2) long, FX, filled at the next open | 68 | test 2020–2026 | -0.13 | +0.20 | -0.89 … +0.67 | 0.4% | -0.1% | -1.5% | 24% | 3/7 | -0.09% (-0.66 … +0.44%) | 3.2% | 0.6271 | -0.34 / +0.05 | – | – |
| C breakdown | RSI(2) short, indices + metals, filled at the next open | 39 | train 2010–2019 | -0.82 | -0.58 | -1.40 … -0.25 | 0.6% | -0.5% | -8.5% | 61% | 1/10 | -0.68% (-1.25 … -0.18%) | 2.5% | – |  |  |  |
| C breakdown | RSI(2) short, indices + metals, filled at the next open | 39 | test 2020–2026 | -0.95 | -0.84 | -1.55 … -0.34 | 0.5% | -0.4% | -7.0% | 45% | 1/7 | -0.58% (-0.97 … -0.21%) | 0.9% | 0.9984 | -0.64 / -1.17 | – | – |
| C breakdown | RSI(2) short, FX, filled at the next open | 68 | train 2010–2019 | -0.50 | -0.04 | -1.05 … +0.10 | 0.5% | -0.2% | -5.5% | 49% | 3/10 | -0.43% (-0.89 … +0.07%) | 4.6% | – |  |  |  |
| C breakdown | RSI(2) short, FX, filled at the next open | 68 | test 2020–2026 | -0.47 | -0.10 | -1.15 … +0.26 | 0.4% | -0.2% | -3.9% | 32% | 2/7 | -0.31% (-0.76 … +0.16%) | 3.2% | 0.9074 | -0.38 / -0.47 | – | – |

## Results: per trade (B and C)

Trades by entry date. win = R > 0.05. CI / p: calendar-week block bootstrap (as round 3). Trades still open at the data end are left out here (their P&L is in the portfolio).

| variant | train trades | train win % | train avg R | test trades | test win % | test avg R | test 95% CI (week blocks) | p (test) | avg bars held (test) | test exits |
|---|---|---|---|---|---|---|---|---|---|---|
| Donchian 55 / 20 breakout, long / short | 5307 | 26 | -0.06 | 3345 | 25 | +0.04 | -0.12 … +0.23 | 0.3116 | 29.0 | exit signal 1409, stop 1936 |
| RSI(2) buy-the-dip (long), indices + metals | 2614 | 62 | +0.02 | 1864 | 62 | +0.03 | -0.03 … +0.10 | 0.1736 | 4.0 | SMA5 exit 1824, time exit 40 |
| RSI(2) buy-the-dip (long), FX | 4377 | 58 | -0.01 | 2574 | 60 | -0.00 | -0.06 … +0.04 | 0.5692 | 4.0 | SMA5 exit 2456, time exit 118 |
| RSI(2) sell-the-rip (short), indices + metals | 1762 | 53 | -0.11 | 852 | 54 | -0.14 | -0.25 … -0.04 | 0.9955 | 4.5 | SMA5 exit 797, time exit 55 |
| RSI(2) sell-the-rip (short), FX | 4397 | 56 | -0.04 | 2357 | 60 | -0.02 | -0.06 … +0.03 | 0.7708 | 4.0 | SMA5 exit 2235, time exit 122 |
| Donchian L/S, FX only | 3183 | 26 | -0.09 | 2006 | 25 | -0.11 | -0.26 … +0.07 | 0.9057 | 28.8 | exit signal 850, stop 1156 |
| Donchian L/S, indices + metals only | 1774 | 25 | -0.04 | 1104 | 26 | +0.29 | -0.06 … +0.72 | 0.0769 | 29.1 | exit signal 454, stop 650 |
| Donchian L/S, commodities only | 350 | 30 | +0.12 | 235 | 29 | +0.19 | -0.22 … +0.63 | 0.2003 | 29.4 | exit signal 105, stop 130 |
| Donchian, long side only | 2762 | 27 | +0.07 | 1811 | 29 | +0.37 | +0.11 … +0.69 | 0.0051 | 32.5 | exit signal 817, stop 994 |
| Donchian, short side only | 2545 | 25 | -0.19 | 1534 | 21 | -0.35 | -0.47 … -0.21 | 1.0000 | 24.8 | exit signal 592, stop 942 |
| RSI(2) long, commodities | 425 | 59 | -0.06 | 266 | 58 | -0.06 | -0.16 … +0.04 | 0.8509 | 4.4 | SMA5 exit 249, time exit 17 |
| RSI(2) short, commodities | 512 | 59 | -0.00 | 294 | 60 | +0.01 | -0.07 … +0.08 | 0.4059 | 3.9 | SMA5 exit 288, time exit 6 |
| RSI(2) long, indices + metals, filled at the next open | 2614 | 61 | +0.01 | 1866 | 61 | +0.02 | -0.06 … +0.10 | 0.2703 | 3.9 | SMA5 exit 1826, time exit 40 |
| RSI(2) long, FX, filled at the next open | 4380 | 58 | -0.02 | 2574 | 59 | -0.02 | -0.07 … +0.03 | 0.7652 | 4.0 | SMA5 exit 2456, time exit 118 |
| RSI(2) short, indices + metals, filled at the next open | 1762 | 53 | -0.11 | 852 | 53 | -0.14 | -0.24 … -0.04 | 0.9962 | 4.5 | SMA5 exit 797, time exit 55 |
| RSI(2) short, FX, filled at the next open | 4396 | 56 | -0.04 | 2358 | 58 | -0.04 | -0.08 … +0.01 | 0.9397 | 4.0 | SMA5 exit 2236, time exit 122 |

## Method

- **Data:** the round-2 / round-3 universe and cache (`round2.fx_jobs` → `fx_backtest.fetch_history`, `tools/fx_scanner/.cache/bt`), D1 bid bars (forex day, NY 17:00 close) since 2005; warm-up before 2010 where the history has it. Instruments: fx = AUDCAD, AUDCHF, AUDHKD, AUDJPY, AUDNZD, AUDSGD, AUDUSD, CADCHF, CADHKD, CADJPY, CADSGD, CHFHKD, CHFJPY, CHFZAR, EURAUD, EURCAD, EURCHF, EURCZK, EURDKK, EURGBP, EURHKD, EURHUF, EURJPY, EURNOK, EURNZD, EURPLN, EURSEK, EURSGD, EURTRY, EURUSD, EURZAR, GBPAUD, GBPCAD, GBPCHF, GBPHKD, GBPJPY, GBPNZD, GBPPLN, GBPSGD, GBPUSD, GBPZAR, HKDJPY, NZDCAD, NZDCHF, NZDHKD, NZDJPY, NZDSGD, NZDUSD, SGDCHF, SGDJPY, TRYJPY, USDCAD, USDCHF, USDCNH, USDCZK, USDDKK, USDHKD, USDHUF, USDJPY, USDMXN, USDNOK, USDPLN, USDSEK, USDSGD, USDTHB, USDTRY, USDZAR, ZARJPY, index = AUS200, CHINAH, CN50, EUSTX50, FRA40, GER40, HK50, JPN225, NAS100, NETH25, SPA35, SWI20, UK100, US2000, US30, US500, metal = XAGAUD, XAGCAD, XAGCHF, XAGEUR, XAGGBP, XAGHKD, XAGJPY, XAGNZD, XAGSGD, XAGUSD, XAUAUD, XAUCAD, XAUCHF, XAUEUR, XAUGBP, XAUHKD, XAUJPY, XAUNZD, XAUSGD, XAUUSD, XAUXAG, XPDUSD, XPTUSD, commodity = COPPER, CORN, NATGAS, SOYBEANS, SPOTBRENT, SPOTCRUDE, SUGAR, WHEAT.
- **No look-ahead:** every signal uses bars closed by its close; A and B fill at the NEXT open, C at the signal close (as published) with a next-open check. The month-end is known at the next bar's date. `tests/test_round4.py` checks that changing / cutting the future changes no earlier fill.
- **Costs** as rounds 2 / 3: the instrument's median bid / ask spread (the last 3000 H4 candles) is the round trip; half of it is charged on every unit of notional traded (an entry, an exit, every TSMOM rebalance). In R: spread / risk once per trade. **Swaps / financing are ignored** (they matter: holding a CFD index long pays financing, FX positions earn or pay carry; TSMOM in futures earns the excess return, here the spot move). No slippage, no commission.
- **Sizing / portfolio:** each instrument is a sub-account; the portfolio is the equal-weight average of the sub-accounts active that day (from the first bar a stream can trade). Notional per sub-account is capped at 5× (pegged pairs such as USDHKD would need 20× and more for 10% vol); weights are held constant between fills. Daily returns are counted on every date any instrument has a bar (291 a year: the Sharpe annualization).
- **Walk-forward:** nothing is fitted (every rule and number above is from the literature, fixed before running). Train = 2010–2019, test = 2020–2026. A variant **survives** when its net Sharpe is > 0 in train and in test, both random instrument halves have a test Sharpe > 0, per-trade avg R > 0 in both periods (≥ 30 trades) where R exists, and its test p is a BH discovery. "Money in both periods" = net raw CAGR > 0 in train and in test.
- **Instrument halves** (round 3's seed 20261103): A = AUDCAD, AUDCHF, AUDHKD, AUDNZD, AUS200, CADCHF, CHFHKD, EURAUD, EURDKK, EURNOK, EURPLN, EURUSD, EURZAR, FRA40, GBPAUD, GBPJPY, GBPPLN, GBPSGD, GBPZAR, HK50, JPN225, NAS100, NATGAS, NETH25, NZDCAD, NZDCHF, NZDSGD, NZDUSD, SOYBEANS, SWI20, TRYJPY, US2000, US30, US500, USDCAD, USDCHF, USDCNH, USDHUF, USDJPY, USDNOK, USDPLN, USDSEK, USDSGD, USDTRY, WHEAT, XAGAUD, XAGCAD, XAGGBP, XAGSGD, XAUAUD, XAUCHF, XAUHKD, XAUNZD, XAUSGD, XAUXAG, XPTUSD, ZARJPY; B = AUDJPY, AUDSGD, AUDUSD, CADHKD, CADJPY, CADSGD, CHFJPY, CHFZAR, CHINAH, CN50, COPPER, CORN, EURCAD, EURCHF, EURCZK, EURGBP, EURHKD, EURHUF, EURJPY, EURNZD, EURSEK, EURSGD, EURTRY, EUSTX50, GBPCAD, GBPCHF, GBPHKD, GBPNZD, GBPUSD, GER40, HKDJPY, NZDHKD, NZDJPY, SGDCHF, SGDJPY, SPA35, SPOTBRENT, SPOTCRUDE, SUGAR, UK100, USDCZK, USDDKK, USDHKD, USDMXN, USDTHB, USDZAR, XAGCHF, XAGEUR, XAGHKD, XAGJPY, XAGNZD, XAGUSD, XAUCAD, XAUEUR, XAUGBP, XAUJPY, XAUUSD, XPDUSD.
- **Multiple testing:** the counted variants are listed in the answer; the breakdown rows reuse the same trades and are descriptive only.

## Data / counts

Instruments run: 115; with D1 results: 115.

Reproduce: Actions → "Arrival study" with round = 4. Outputs: `docs/research/arrival_study/round4/` and `public/learn/round4_summary.json` on the `data` branch.
