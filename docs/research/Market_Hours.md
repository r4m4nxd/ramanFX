# Market hours: when does each market move? (Calgary time)

Generated 2026-10-29 07:53 UTC by `tools/research/market_hours/deep.py` + `report.py` (workflow `market-hours.yml`). Coverage: **117 forex / metal / CFD instruments** (OANDA M30, 2005-01-01 to 2026-10-29, median 21.8 years each) and **518 US stocks / ETFs** (Alpaca 30-minute, feed sip, median 10.8 years). Stocks have their own file: [Market_Hours_Stocks.md](Market_Hours_Stocks.md); every symbol is searchable in the app (Market hours page). All times are **Calgary (America/Edmonton)**; New York is always 2 h ahead. Descriptive statistics only - no trading signal, no profit claim.

## In plain words

- **Forex currencies (62 pairs, median 21.8 years):** the strongest half-hours start at 08:00 (1.98x), 06:30 (1.81x), 01:00 (1.60x) Calgary. 06:30 (US data) 1.81x, 07:30 (NYSE open) 1.89x, 08:00 1.98x, London open 01:00 1.60x; quietest around 15:00 (rollover) 0.49x.
- **Each pair's own best half-hour:** 08:00 for 48 pairs, 08:30 for 8 pairs, 09:00 for 2 pairs, 01:00 for 2 pairs. 96.8% of pairs have reliable best times (both halves of the history agree).
- **Metals (23):** peaks at 07:30 (2.37x), 06:30 (2.13x), 01:00 (1.32x).
- **Index / commodity CFDs (32):** peaks at 07:30 (2.37x), 01:00 (1.40x), 12:00 (1.05x) - the cash-market opens dominate.
- **Weekdays, forex currencies:** day activity Mon 0.91x / Tue 0.99x / Wed 1.02x / Thu 1.05x / Fri 1.02x - only 15% between the busiest and the quietest weekday. Best weekday reliable for 66.1% of instruments (mostly Thu 35, Fri 6).
- **NFP Fridays:** the 06:30 Calgary half-hour moves 2.32x as far as on other Fridays (median pair, IQR 2.19-2.75, 259 NFP days). **FOMC days:** 12:00 Calgary 3.48x, press conference 12:30 2.77x vs a normal day.
- **Era check:** last 2 years vs whole history: median rho 0.95 (forex), 0.99 (stocks); 17.7% of pairs and 19.3% of stocks shifted.
- Stocks in short: strongest half-hours 07:30 (2.06x), 13:30 (1.95x) Calgary (details in Market_Hours_Stocks.md).

## When to open the charts (group profiles, Mon-Fri)

Activity = sqrt(volume x range) of a half-hour relative to a typical half-hour of the same instrument and month (1.0x = typical), median over the group's instruments, whole history. The window around each peak keeps at least 2/3 of the peak.

| Calgary window | Market | Peak | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|---|
| 00:00-05:00 | Forex currencies | **01:00** | 03:00 ET | 1.60x | 1.72x | 1.50x | 24.8% | London open 08:00 (normal weeks) |
| 00:00-05:00 | Metals | **01:00** | 03:00 ET | 1.32x | 1.42x | 1.25x | 14.4% | London open 08:00 (normal weeks) |
| 01:00-03:30 | Index / commodity CFDs | **01:00** | 03:00 ET | 1.40x | 1.46x | 1.29x | 15.9% | London open 08:00 (normal weeks) |
| 05:30-07:00 | Forex currencies | **06:30** | 08:30 ET | 1.81x | 2.04x | 1.58x | 32.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| 06:00-07:00 | Metals | **06:30** | 08:30 ET | 2.13x | 2.36x | 1.99x | 49.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| 07:00-10:00 | Forex currencies | **08:00** | 10:00 ET | 1.98x | 2.31x | 1.67x | 34.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| 07:00-09:30 | Metals | **07:30** | 09:30 ET | 2.37x | 2.72x | 2.08x | 53.6% | NYSE open 09:30 ET |
| 07:30-09:30 | Index / commodity CFDs | **07:30** | 09:30 ET | 2.37x | 3.18x | 1.75x | 37.4% | NYSE open 09:30 ET |
| 07:30-08:30 | US stocks | **07:30** | 09:30 ET | 2.06x | 1.62x | 2.63x | 75.3% | NYSE open 09:30 ET |
| 10:30-13:00 | Metals | **11:00** | 13:00 ET | 1.28x | 1.29x | 1.30x | 19.8% |  |
| 13:30-14:00 | US stocks | **13:30** | 15:30 ET | 1.95x | 3.63x | 1.05x | 6.4% | last regular stock half-hour |

![Forex heatmap](market_hours_fx.png)

## Era check: has the pattern drifted?

For every instrument the Mon-Fri half-hour profile of the last 2 years is compared with its whole history, and before 2020 with 2020 and later (Spearman rank correlation of the 48 half-hours; 1.0 = same shape). "Shifted" = rho below 0.8 or the peak half-hour moved by more than 30 minutes.

| Group | Instruments | Median rho last 2 y vs all | Median rho pre vs post 2020 | Shifted | Group peak before 2020 | Group peak since 2020 |
|---|---|---|---|---|---|---|
| Forex currencies | 62 | 0.95 | 0.97 | 17.7% | 08:00 | 08:00 |
| Majors | 4 | 0.97 | 0.96 | 0.0% | 08:00 | 08:00 |
| Crosses | 18 | 0.94 | 0.97 | 11.1% | 08:00 | 08:00 |
| Exotics | 40 | 0.94 | 0.97 | 22.5% | 08:00 | 08:00 |
| Metals | 23 | 0.89 | 0.92 | 8.7% | 08:00 | 07:30 |
| Index / commodity CFDs | 32 | 0.97 | 0.94 | 34.4% | 07:30 | 07:30 |
| Stocks (all) | 518 | 0.99 | 0.99 | 19.3% | 07:30 | 07:30 |
| Sector: Communication Services | 14 | 0.98 | 0.98 | 7.1% | 07:30 | 07:30 |
| Sector: Consumer Discretionary | 34 | 0.98 | 0.97 | 23.5% | 07:30 | 07:30 |
| Sector: Consumer Staples | 21 | 0.97 | 0.98 | 19.0% | 07:30 | 13:30 |
| Sector: Energy | 20 | 0.98 | 0.95 | 5.0% | 07:30 | 07:30 |
| Sector: Financials | 63 | 1.00 | 0.99 | 14.3% | 07:30 | 13:30 |
| Sector: Health Care | 40 | 0.99 | 0.99 | 25.0% | 07:30 | 07:30 |
| Sector: Industrials | 56 | 1.00 | 1.00 | 28.6% | 13:30 | 13:30 |
| Sector: Information Technology | 48 | 0.96 | 0.97 | 18.8% | 07:30 | 07:30 |
| Sector: Materials | 34 | 0.97 | 0.96 | 11.8% | 07:30 | 07:30 |
| Sector: Other (top liquid) | 147 | 0.99 | 0.99 | 18.4% | 07:30 | 07:30 |
| Sector: Real Estate | 18 | 1.00 | 1.00 | 11.1% | 13:30 | 13:30 |
| Sector: Utilities | 23 | 1.00 | 1.00 | 39.1% | 13:30 | 13:30 |

![Era check](market_hours_era.png)

## Daylight saving: what moves on the Calgary clock

New York events never move on the Calgary clock (both follow US DST dates). London does: the London open (08:00 London) is 01:00 Calgary most of the year but 02:00 in the US/UK mismatch weeks (2nd Sunday of March -> last Sunday of March; last Sunday of October -> 1st Sunday of November). Measured volume (forex currencies, median):

| Calgary | Normal weeks | Mismatch weeks |
|---|---|---|
| 01:00 | 1.75x | 1.31x |
| 02:00 | 1.54x | 1.73x |

Asian evening (Sun-Thu) by Calgary season: Calgary on MST (Nov-Mar) vs MDT (Mar-Nov):

| Calgary | MST (winter) | MDT (summer) |
|---|---|---|
| 17:00 | 0.77x | 0.42x |
| 18:00 | 0.86x | 0.83x |

## NFP and FOMC dates

- FOMC statement dates: 140 (federalreserve.gov statement links).
- NFP (Employment Situation) release dates: 273 (BLS release rule (third Friday after the week containing the 12th) + known 2025-26 moves (bls.gov not reachable)).
- Ratio = median range of the event half-hour on event days / the same half-hour on control days (NFP: other Fridays; FOMC: other days of the same weekday). Group medians:

| Group | Event | Median range ratio | IQR over instruments | Instruments | Event days (median) |
|---|---|---|---|---|---|
| Forex currencies | NFP | 2.32x | 2.19x-2.75x | 62 | 259 |
| Forex currencies | FOMC 12:00 | 3.48x | 3.01x-4.66x | 62 | 140 |
| Forex currencies | FOMC 12:30 | 2.77x | 2.42x-3.87x | 62 | 140 |
| Majors | NFP | 2.89x | 2.71x-2.94x | 4 | 259 |
| Majors | FOMC 12:00 | 5.04x | 4.80x-5.09x | 4 | 140 |
| Majors | FOMC 12:30 | 4.12x | 3.89x-4.22x | 4 | 140 |
| Crosses | NFP | 2.27x | 2.21x-2.32x | 18 | 259 |
| Crosses | FOMC 12:00 | 3.00x | 2.84x-3.14x | 18 | 140 |
| Crosses | FOMC 12:30 | 2.32x | 2.10x-2.50x | 18 | 140 |
| Exotics | NFP | 2.50x | 2.17x-2.84x | 40 | 259 |
| Exotics | FOMC 12:00 | 3.99x | 3.21x-4.98x | 40 | 140 |
| Exotics | FOMC 12:30 | 3.17x | 2.52x-4.02x | 40 | 140 |
| Metals | NFP | 2.15x | 2.01x-2.25x | 23 | 240 |
| Metals | FOMC 12:00 | 3.61x | 3.55x-3.86x | 23 | 132 |
| Metals | FOMC 12:30 | 3.25x | 2.98x-3.58x | 23 | 132 |
| Index / commodity CFDs | NFP | 2.37x | 1.86x-2.83x | 32 | 250 |
| Index / commodity CFDs | FOMC 12:00 | 2.65x | 2.36x-2.91x | 30 | 138 |
| Index / commodity CFDs | FOMC 12:30 | 2.41x | 2.21x-3.30x | 30 | 131 |
| Stocks (all) | NFP | 1.08x | 1.03x-1.13x | 517 | 123 |
| Stocks (all) | FOMC 12:00 | 1.85x | 1.68x-2.01x | 516 | 92 |
| Stocks (all) | FOMC 12:30 | 1.94x | 1.79x-2.17x | 516 | 92 |
| Sector: Communication Services | NFP | 1.08x | 1.03x-1.11x | 14 | 123 |
| Sector: Communication Services | FOMC 12:00 | 1.83x | 1.72x-1.96x | 14 | 92 |
| Sector: Communication Services | FOMC 12:30 | 1.98x | 1.82x-2.10x | 14 | 92 |
| Sector: Consumer Discretionary | NFP | 1.08x | 1.01x-1.14x | 34 | 123 |
| Sector: Consumer Discretionary | FOMC 12:00 | 1.85x | 1.70x-2.08x | 34 | 92 |
| Sector: Consumer Discretionary | FOMC 12:30 | 1.92x | 1.81x-2.10x | 34 | 92 |
| Sector: Consumer Staples | NFP | 1.06x | 1.03x-1.10x | 21 | 123 |
| Sector: Consumer Staples | FOMC 12:00 | 1.75x | 1.68x-1.86x | 21 | 92 |
| Sector: Consumer Staples | FOMC 12:30 | 1.70x | 1.63x-1.90x | 21 | 92 |
| Sector: Energy | NFP | 1.14x | 1.08x-1.19x | 20 | 123 |
| Sector: Energy | FOMC 12:00 | 1.67x | 1.54x-1.79x | 20 | 92 |
| Sector: Energy | FOMC 12:30 | 1.79x | 1.69x-1.92x | 20 | 92 |
| Sector: Financials | NFP | 1.07x | 1.04x-1.11x | 63 | 123 |
| Sector: Financials | FOMC 12:00 | 1.99x | 1.78x-2.29x | 63 | 92 |
| Sector: Financials | FOMC 12:30 | 2.08x | 1.82x-2.37x | 63 | 92 |
| Sector: Health Care | NFP | 1.07x | 1.04x-1.10x | 40 | 123 |
| Sector: Health Care | FOMC 12:00 | 1.70x | 1.56x-1.83x | 40 | 92 |
| Sector: Health Care | FOMC 12:30 | 1.77x | 1.66x-1.90x | 40 | 92 |
| Sector: Industrials | NFP | 1.07x | 1.02x-1.12x | 56 | 123 |
| Sector: Industrials | FOMC 12:00 | 1.89x | 1.78x-2.01x | 56 | 92 |
| Sector: Industrials | FOMC 12:30 | 2.00x | 1.88x-2.14x | 56 | 92 |
| Sector: Information Technology | NFP | 1.08x | 1.03x-1.14x | 48 | 123 |
| Sector: Information Technology | FOMC 12:00 | 1.89x | 1.74x-2.02x | 48 | 92 |
| Sector: Information Technology | FOMC 12:30 | 2.00x | 1.87x-2.15x | 48 | 92 |
| Sector: Materials | NFP | 1.08x | 1.04x-1.12x | 34 | 123 |
| Sector: Materials | FOMC 12:00 | 2.06x | 1.85x-2.78x | 33 | 92 |
| Sector: Materials | FOMC 12:30 | 2.53x | 2.01x-3.08x | 33 | 92 |
| Sector: Other (top liquid) | NFP | 1.09x | 1.04x-1.15x | 146 | 123 |
| Sector: Other (top liquid) | FOMC 12:00 | 1.73x | 1.58x-1.92x | 146 | 92 |
| Sector: Other (top liquid) | FOMC 12:30 | 1.92x | 1.71x-2.17x | 146 | 92 |
| Sector: Real Estate | NFP | 1.08x | 1.03x-1.12x | 18 | 123 |
| Sector: Real Estate | FOMC 12:00 | 1.94x | 1.90x-2.06x | 18 | 92 |
| Sector: Real Estate | FOMC 12:30 | 1.98x | 1.89x-2.06x | 18 | 92 |
| Sector: Utilities | NFP | 1.08x | 1.04x-1.12x | 23 | 123 |
| Sector: Utilities | FOMC 12:00 | 2.00x | 1.84x-2.03x | 23 | 92 |
| Sector: Utilities | FOMC 12:30 | 1.87x | 1.83x-1.93x | 23 | 92 |

## Every forex pair, metal and CFD

One table per instrument (watchlist first). "reliable" = the first and second half of the instrument's history agree; "weak" = the difference is within noise, do not lean on it.

### AUDUSD (AUD_USD) - Majors - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,158 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.94x | 2.26x | 1.67x | 33.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.67x | 1.84x | 1.51x | 28.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.47x | 1.60x | 1.36x | 15.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.21x the quietest (Mon), 95% CI 1.18-1.24, 5660 days - **weak** |
| Day activity Mon-Fri | Mon 0.88x / Tue 1.00x / Wed 1.04x / Thu 1.06x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.9x other Fridays (259 NFP days; big moves 93.1% vs 34.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.02x a normal Wednesday (140 FOMC days; big moves 89.3% vs 5.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.51x a normal Wednesday (140 FOMC days; big moves 82.1% vs 4.4%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.97; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### NZDUSD (NZD_USD) - Majors - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,911 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.89x | 2.19x | 1.63x | 30.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.62x | 1.80x | 1.47x | 28.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.44x | 1.56x | 1.34x | 14.0% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.22x the quietest (Mon), 95% CI 1.18-1.24, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.88x / Tue 1.00x / Wed 1.06x / Thu 1.07x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.88x other Fridays (259 NFP days; big moves 93.1% vs 33.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.19x a normal Wednesday (140 FOMC days; big moves 83.6% vs 5.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.13x a normal Wednesday (140 FOMC days; big moves 76.4% vs 4.8%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.96; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDCAD (USD_CAD) - Majors - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,887 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.35x | 2.69x | 2.05x | 52.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.15x | 2.35x | 1.97x | 48.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.41x | 1.48x | 1.33x | 15.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.19x the quietest (Mon), 95% CI 1.16-1.22, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.89x / Tue 1.00x / Wed 1.03x / Thu 1.03x / Fri 1.06x |
| NFP 08:30 ET (06:30 Calgary) | range 2.2x other Fridays (259 NFP days; big moves 93.8% vs 62.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.13x a normal Wednesday (140 FOMC days; big moves 90.0% vs 9.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.28x a normal Wednesday (140 FOMC days; big moves 78.6% vs 7.7%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.95; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### USDCHF (USD_CHF) - Majors - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,176 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 2.21x | 2.52x | 1.93x | 47.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.00x | 2.20x | 1.82x | 43.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-06:00 (peak **01:00**) | 03:00 ET | 1.76x | 1.89x | 1.63x | 30.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.19x the quietest (Mon), 95% CI 1.16-1.23, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.98x / Wed 1.02x / Thu 1.08x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 3.06x other Fridays (259 NFP days; big moves 94.2% vs 47.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.06x a normal Wednesday (140 FOMC days; big moves 91.4% vs 7.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.1x a normal Wednesday (140 FOMC days; big moves 80.7% vs 5.7%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.97; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### AUDCAD (AUD_CAD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,054 half-hours). Best times: **reliable** (first vs second half rho 0.90).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 1.88x | 2.19x | 1.62x | 29.2% | first stock hour |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.73x | 1.96x | 1.52x | 29.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.33x | 1.48x | 1.20x | 8.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.2x the quietest (Mon), 95% CI 1.18-1.22, 5657 days - **reliable** |
| Day activity Mon-Fri | Mon 0.88x / Tue 0.99x / Wed 1.03x / Thu 1.05x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.25x other Fridays (259 NFP days; big moves 90.0% vs 42.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.54x a normal Wednesday (140 FOMC days; big moves 77.1% vs 3.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.79x a normal Wednesday (140 FOMC days; big moves 65.7% vs 3.0%) |
| Era check | last 2 y vs all rho 0.80; before vs since 2020 rho 0.89; peak 08:30 -> 08:00 (last 2 y 08:00) - **shifted** |

### AUDNZD (AUD_NZD) - Crosses - watchlist

2005-01-01 to 2026-10-29 (21.8 years, 275,013 half-hours). Best times: **reliable** (first vs second half rho 0.87).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.63x | 2.00x | 1.32x | 13.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.41x | 1.64x | 1.20x | 13.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.34x | 1.50x | 1.20x | 8.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.17x the quietest (Mon), 95% CI 1.14-1.2, 5658 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.06x / Thu 1.06x / Fri 0.99x |
| NFP 08:30 ET (06:30 Calgary) | range 2.33x other Fridays (259 NFP days; big moves 78.4% vs 13.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.76x a normal Wednesday (140 FOMC days; big moves 55.7% vs 2.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.06x a normal Wednesday (140 FOMC days; big moves 43.6% vs 2.7%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.92; peak 08:00 -> 07:30 (last 2 y 08:30) - **stable** |

### CADJPY (CAD_JPY) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,315 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.05x | 2.37x | 1.78x | 38.8% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.84x | 2.00x | 1.69x | 37.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.42x | 1.53x | 1.32x | 14.9% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.18x the quietest (Mon), 95% CI 1.15-1.21, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.02x / Thu 1.04x / Fri 1.06x |
| NFP 08:30 ET (06:30 Calgary) | range 2.27x other Fridays (259 NFP days; big moves 92.7% vs 49.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.83x a normal Wednesday (140 FOMC days; big moves 71.4% vs 7.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.12x a normal Wednesday (140 FOMC days; big moves 52.1% vs 5.1%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.95; peak 08:00 -> 07:30 (last 2 y 08:00) - **stable** |

### CHFJPY (CHF_JPY) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,171 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.85x | 2.20x | 1.56x | 28.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.68x | 1.91x | 1.47x | 27.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.59x | 1.68x | 1.50x | 24.0% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.01x / Thu 1.05x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.28x other Fridays (259 NFP days; big moves 86.1% vs 29.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.11x a normal Wednesday (140 FOMC days; big moves 62.9% vs 4.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.23x a normal Wednesday (140 FOMC days; big moves 43.6% vs 3.0%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:30) - **stable** |

### EURAUD (EUR_AUD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,191 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.81x | 2.16x | 1.52x | 24.5% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.59x | 1.82x | 1.39x | 22.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.48x | 1.66x | 1.32x | 15.0% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.17x the quietest (Mon), 95% CI 1.15-1.2, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.02x / Thu 1.06x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.37x other Fridays (259 NFP days; big moves 87.3% vs 25.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.07x a normal Wednesday (140 FOMC days; big moves 68.6% vs 3.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.48x a normal Wednesday (140 FOMC days; big moves 52.1% vs 3.4%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.96; peak 08:00 -> 07:30 (last 2 y 08:30) - **stable** |

### EURCAD (EUR_CAD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,340 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.14x | 2.46x | 1.86x | 42.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.99x | 2.14x | 1.85x | 43.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.53x | 1.66x | 1.41x | 18.0% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.16, 5660 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.02x / Thu 1.04x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.21x other Fridays (259 NFP days; big moves 94.2% vs 57.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.01x a normal Wednesday (140 FOMC days; big moves 82.1% vs 6.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.38x a normal Wednesday (140 FOMC days; big moves 60.7% vs 4.5%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.98; peak 08:00 -> 07:30 (last 2 y 08:00) - **stable** |

### EURCHF (EUR_CHF) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,033 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.99x | 2.38x | 1.67x | 34.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 04:30-07:00 (peak **06:30**) | 08:30 ET | 1.78x | 2.06x | 1.55x | 30.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.74x | 1.89x | 1.61x | 31.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.98x / Wed 1.01x / Thu 1.06x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.01x other Fridays (259 NFP days; big moves 86.5% vs 30.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.87x a normal Wednesday (140 FOMC days; big moves 65.7% vs 5.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.06x a normal Wednesday (140 FOMC days; big moves 47.1% vs 5.5%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.97; peak 08:00 -> 08:30 (last 2 y 08:30) - **stable** |

### EURGBP (EUR_GBP) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,258 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 1.98x | 2.19x | 1.79x | 38.2% | first stock hour |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.82x | 2.05x | 1.61x | 32.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.80x | 1.93x | 1.68x | 32.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.18, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.01x / Thu 1.05x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 1.95x other Fridays (259 NFP days; big moves 89.2% vs 35.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.95x a normal Wednesday (140 FOMC days; big moves 67.1% vs 3.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.1x a normal Wednesday (140 FOMC days; big moves 35.7% vs 2.9%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.97; peak 08:00 -> 08:30 (last 2 y 08:30) - **stable** |

### EURJPY (EUR_JPY) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,336 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.84x | 2.12x | 1.60x | 31.4% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 1.67x | 1.84x | 1.51x | 30.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.62x | 1.70x | 1.54x | 26.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.13x the quietest (Mon), 95% CI 1.1-1.16, 5660 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.00x / Thu 1.06x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.3x other Fridays (259 NFP days; big moves 87.6% vs 34.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.21x a normal Wednesday (140 FOMC days; big moves 68.6% vs 4.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.26x a normal Wednesday (140 FOMC days; big moves 42.9% vs 3.5%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### EURNZD (EUR_NZD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,174 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.83x | 2.24x | 1.49x | 22.8% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.62x | 1.92x | 1.37x | 22.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.49x | 1.69x | 1.32x | 14.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.19x the quietest (Mon), 95% CI 1.17-1.22, 5656 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.04x / Thu 1.07x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.41x other Fridays (259 NFP days; big moves 86.5% vs 25.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.99x a normal Wednesday (140 FOMC days; big moves 62.9% vs 3.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.64x a normal Wednesday (140 FOMC days; big moves 58.6% vs 3.5%) |
| Era check | last 2 y vs all rho 0.89; before vs since 2020 rho 0.95; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### GBPAUD (GBP_AUD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,406 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 1.80x | 2.08x | 1.56x | 26.9% | first stock hour |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.59x | 1.84x | 1.38x | 21.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.50x | 1.67x | 1.35x | 14.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Wed**: 1.16x the quietest (Mon), 95% CI 1.13-1.18, 5660 days - **weak** |
| Day activity Mon-Fri | Mon 0.90x / Tue 1.00x / Wed 1.05x / Thu 1.05x / Fri 0.98x |
| NFP 08:30 ET (06:30 Calgary) | range 2.22x other Fridays (259 NFP days; big moves 84.2% vs 22.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.15x a normal Wednesday (140 FOMC days; big moves 62.9% vs 3.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.45x a normal Wednesday (140 FOMC days; big moves 50.7% vs 2.8%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.97; peak 08:00 -> 08:30 (last 2 y 08:30) - **stable** |

### GBPCAD (GBP_CAD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,036 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 2.11x | 2.33x | 1.92x | 45.6% | first stock hour |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.95x | 2.09x | 1.81x | 42.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.54x | 1.65x | 1.43x | 19.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.16, 5656 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.03x / Thu 1.03x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 1.89x other Fridays (259 NFP days; big moves 90.3% vs 55.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.46x a normal Wednesday (140 FOMC days; big moves 64.3% vs 4.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.99x a normal Wednesday (140 FOMC days; big moves 45.0% vs 3.6%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.98; peak 08:30 -> 08:30 (last 2 y 08:30) - **stable** |

### GBPCHF (GBP_CHF) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,181 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 2.01x | 2.28x | 1.76x | 37.5% | first stock hour |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.81x | 2.07x | 1.59x | 31.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.75x | 1.85x | 1.65x | 32.2% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.13x the quietest (Mon), 95% CI 1.11-1.15, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.02x / Thu 1.04x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.1x other Fridays (259 NFP days; big moves 86.9% vs 33.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.58x a normal Wednesday (140 FOMC days; big moves 57.9% vs 4.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.97x a normal Wednesday (140 FOMC days; big moves 34.3% vs 3.1%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.98; peak 08:00 -> 08:30 (last 2 y 08:30) - **stable** |

### GBPJPY (GBP_JPY) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,262 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.86x | 2.17x | 1.59x | 29.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.66x | 1.88x | 1.47x | 26.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.62x | 1.72x | 1.52x | 25.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.02x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.29x other Fridays (259 NFP days; big moves 84.9% vs 30.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.83x a normal Wednesday (140 FOMC days; big moves 62.1% vs 4.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.15x a normal Wednesday (140 FOMC days; big moves 38.6% vs 3.1%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.99; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### GBPNZD (GBP_NZD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,262 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.82x | 2.23x | 1.48x | 21.8% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.63x | 1.93x | 1.37x | 21.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.52x | 1.71x | 1.35x | 14.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.17x the quietest (Mon), 95% CI 1.14-1.21, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.05x / Thu 1.05x / Fri 0.99x |
| NFP 08:30 ET (06:30 Calgary) | range 2.24x other Fridays (259 NFP days; big moves 85.7% vs 23.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.06x a normal Wednesday (140 FOMC days; big moves 57.9% vs 3.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.42x a normal Wednesday (140 FOMC days; big moves 52.1% vs 3.2%) |
| Era check | last 2 y vs all rho 0.81; before vs since 2020 rho 0.94; peak 08:00 -> 08:30 (last 2 y 08:30) - **stable** |

### NZDCAD (NZD_CAD) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,953 half-hours). Best times: **reliable** (first vs second half rho 0.91).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.92x | 2.38x | 1.54x | 24.9% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.75x | 2.04x | 1.51x | 28.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.35x | 1.50x | 1.21x | 8.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Wed**: 1.18x the quietest (Mon), 95% CI 1.16-1.21, 5656 days - **weak** |
| Day activity Mon-Fri | Mon 0.89x / Tue 0.99x / Wed 1.05x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.3x other Fridays (259 NFP days; big moves 88.4% vs 39.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.37x a normal Wednesday (140 FOMC days; big moves 69.3% vs 3.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.82x a normal Wednesday (140 FOMC days; big moves 66.4% vs 3.3%) |
| Era check | last 2 y vs all rho 0.78; before vs since 2020 rho 0.89; peak 08:00 -> 08:00 (last 2 y 08:00) - **shifted** |

### NZDCHF (NZD_CHF) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,250 half-hours). Best times: **reliable** (first vs second half rho 0.89).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.88x | 2.31x | 1.52x | 23.5% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 1.64x | 1.97x | 1.37x | 22.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.50x | 1.67x | 1.35x | 15.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.19x the quietest (Mon), 95% CI 1.16-1.21, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.04x / Thu 1.07x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.34x other Fridays (259 NFP days; big moves 88.0% vs 24.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.0x a normal Wednesday (140 FOMC days; big moves 61.4% vs 4.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.51x a normal Wednesday (140 FOMC days; big moves 55.7% vs 3.6%) |
| Era check | last 2 y vs all rho 0.84; before vs since 2020 rho 0.93; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### NZDJPY (NZD_JPY) - Crosses - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,164 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.79x | 2.12x | 1.51x | 25.4% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.54x | 1.77x | 1.33x | 20.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.45x | 1.58x | 1.33x | 15.2% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.14-1.21, 5656 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 1.00x / Wed 1.03x / Thu 1.05x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.56x other Fridays (259 NFP days; big moves 87.6% vs 23.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.26x a normal Wednesday (140 FOMC days; big moves 67.9% vs 4.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.61x a normal Wednesday (140 FOMC days; big moves 58.6% vs 4.1%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.97; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### AUDSGD (AUD_SGD) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,166 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.77x | 2.08x | 1.51x | 24.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.55x | 1.78x | 1.36x | 22.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.40x | 1.56x | 1.25x | 10.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.16-1.22, 5660 days - **reliable** |
| Day activity Mon-Fri | Mon 0.89x / Tue 0.99x / Wed 1.04x / Thu 1.06x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.65x other Fridays (259 NFP days; big moves 90.7% vs 27.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.68x a normal Wednesday (140 FOMC days; big moves 85.0% vs 4.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.42x a normal Wednesday (140 FOMC days; big moves 70.7% vs 3.4%) |
| Era check | last 2 y vs all rho 0.86; before vs since 2020 rho 0.95; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### EURCZK (EUR_CZK) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 265,002 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 2.37x | 2.56x | 2.19x | 55.6% | first stock hour |
| Best window 2 | 00:30-06:00 (peak **01:00**) | 03:00 ET | 2.32x | 2.29x | 2.36x | 60.0% | London open 08:00 (normal weeks) |
| Best window 3 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.24x | 2.50x | 2.01x | 50.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.08x the quietest (Tue), 95% CI 1.05-1.11, 5657 days - **reliable** |
| Day activity Mon-Fri | Mon 0.97x / Tue 0.97x / Wed 1.01x / Thu 1.04x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 1.57x other Fridays (259 NFP days; big moves 77.6% vs 48.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.22x a normal Wednesday (140 FOMC days; big moves 37.9% vs 9.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.61x a normal Wednesday (140 FOMC days; big moves 37.9% vs 8.7%) |
| Era check | last 2 y vs all rho 0.72; before vs since 2020 rho 0.92; peak 08:30 -> 01:00 (last 2 y 07:30) - **shifted** |

### EURHUF (EUR_HUF) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 266,647 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 05:00-10:00 (peak **08:00**) | 10:00 ET | 2.40x | 2.74x | 2.09x | 53.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 2.34x | 2.31x | 2.37x | 61.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.1x the quietest (Mon), 95% CI 1.07-1.13, 5641 days - **reliable** |
| Day activity Mon-Fri | Mon 0.95x / Tue 1.00x / Wed 1.00x / Thu 1.04x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 1.93x other Fridays (258 NFP days; big moves 86.8% vs 48.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.19x a normal Wednesday (139 FOMC days; big moves 49.6% vs 9.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.83x a normal Wednesday (139 FOMC days; big moves 43.2% vs 8.0%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.94; peak 08:00 -> 08:00 (last 2 y 08:30) - **stable** |

### EURNOK (EUR_NOK) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 273,305 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-10:00 (peak **08:00**) | 10:00 ET | 2.13x | 2.48x | 1.84x | 42.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 00:00-06:00 (peak **01:00**) | 03:00 ET | 1.87x | 1.92x | 1.82x | 42.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.08x the quietest (Mon), 95% CI 1.05-1.1, 5658 days - **weak** |
| Day activity Mon-Fri | Mon 0.96x / Tue 0.99x / Wed 1.02x / Thu 1.03x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 1.67x other Fridays (259 NFP days; big moves 76.1% vs 33.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.56x a normal Wednesday (140 FOMC days; big moves 55.0% vs 6.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.17x a normal Wednesday (140 FOMC days; big moves 41.4% vs 5.8%) |
| Era check | last 2 y vs all rho 0.92; before vs since 2020 rho 0.93; peak 08:30 -> 08:00 (last 2 y 08:00) - **stable** |

### EURPLN (EUR_PLN) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 269,588 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 03:30-10:00 (peak **08:00**) | 10:00 ET | 2.32x | 2.81x | 1.92x | 47.1% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 2.31x | 2.41x | 2.22x | 58.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.07x the quietest (Mon), 95% CI 1.04-1.11, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.97x / Tue 0.98x / Wed 1.01x / Thu 1.03x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 1.82x other Fridays (259 NFP days; big moves 83.4% vs 44.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.01x a normal Wednesday (140 FOMC days; big moves 48.6% vs 7.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.96x a normal Wednesday (140 FOMC days; big moves 45.0% vs 7.2%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.97; peak 08:00 -> 01:00 (last 2 y 08:30) - **shifted** |

### EURSEK (EUR_SEK) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 273,567 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-09:30 (peak **08:30**) | 10:30 ET | 2.18x | 2.44x | 1.95x | 47.6% | first stock hour |
| Best window 2 | 00:00-06:00 (peak **01:00**) | 03:00 ET | 1.96x | 2.04x | 1.89x | 45.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.08x the quietest (Mon), 95% CI 1.07-1.11, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.95x / Tue 1.00x / Wed 1.01x / Thu 1.03x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 1.7x other Fridays (259 NFP days; big moves 71.8% vs 32.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.49x a normal Wednesday (140 FOMC days; big moves 50.7% vs 5.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.45x a normal Wednesday (140 FOMC days; big moves 49.3% vs 4.8%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.97; peak 08:30 -> 08:30 (last 2 y 08:00) - **stable** |

### EURSGD (EUR_SGD) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,476 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.93x | 2.28x | 1.63x | 32.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 1.77x | 2.00x | 1.57x | 32.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.58x | 1.75x | 1.43x | 19.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.17x the quietest (Mon), 95% CI 1.14-1.2, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.98x / Wed 1.00x / Thu 1.06x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.76x other Fridays (259 NFP days; big moves 93.4% vs 35.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.94x a normal Wednesday (140 FOMC days; big moves 89.3% vs 5.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.11x a normal Wednesday (140 FOMC days; big moves 66.4% vs 3.6%) |
| Era check | last 2 y vs all rho 0.89; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### EURTRY (EUR_TRY) - Exotics - watchlist

2007-02-12 to 2026-10-28 (19.7 years, 237,669 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.11x | 2.80x | 1.60x | 31.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.96x | 2.54x | 1.51x | 29.5% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.89x | 2.36x | 1.52x | 27.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.12x the quietest (Mon), 95% CI 1.09-1.16, 4787 days - **reliable** |
| Day activity Mon-Fri | Mon 0.94x / Tue 1.00x / Wed 1.00x / Thu 1.05x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.41x other Fridays (232 NFP days; big moves 88.8% vs 30.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.7x a normal Wednesday (121 FOMC days; big moves 81.0% vs 8.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.84x a normal Wednesday (121 FOMC days; big moves 65.3% vs 6.2%) |
| Era check | last 2 y vs all rho 0.95; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 09:00) - **stable** |

### EURZAR (EUR_ZAR) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,505 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.02x | 2.44x | 1.66x | 32.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.90x | 2.24x | 1.61x | 33.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.76x | 1.91x | 1.61x | 30.2% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.16, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.98x / Wed 1.01x / Thu 1.05x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.22x other Fridays (259 NFP days; big moves 90.7% vs 36.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.42x a normal Wednesday (140 FOMC days; big moves 71.4% vs 6.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.52x a normal Wednesday (140 FOMC days; big moves 58.6% vs 5.3%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.97; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### GBPSGD (GBP_SGD) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,002 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.86x | 2.16x | 1.61x | 29.6% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.73x | 1.95x | 1.54x | 28.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.61x | 1.74x | 1.50x | 22.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.12x the quietest (Mon), 95% CI 1.09-1.15, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.03x / Thu 1.03x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.26x other Fridays (259 NFP days; big moves 89.2% vs 32.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.63x a normal Wednesday (140 FOMC days; big moves 77.9% vs 3.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.52x a normal Wednesday (140 FOMC days; big moves 50.7% vs 2.3%) |
| Era check | last 2 y vs all rho 0.89; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### SGDJPY (SGD_JPY) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,217 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.76x | 2.06x | 1.51x | 27.1% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.61x | 1.80x | 1.43x | 27.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.45x | 1.59x | 1.32x | 16.2% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.98x / Wed 1.02x / Thu 1.04x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.87x other Fridays (259 NFP days; big moves 92.7% vs 31.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.88x a normal Wednesday (140 FOMC days; big moves 79.3% vs 5.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.52x a normal Wednesday (140 FOMC days; big moves 52.9% vs 4.1%) |
| Era check | last 2 y vs all rho 0.95; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDCNH (USD_CNH) - Exotics - watchlist

2011-02-06 to 2026-10-29 (15.7 years, 179,943 half-hours). Best times: **reliable** (first vs second half rho 0.90).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 18:00-20:30 (peak **19:30**) | 21:30 ET | 1.74x | 1.80x | 1.69x | 37.5% |  |
| Best window 2 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.55x | 1.71x | 1.40x | 23.8% | London open 08:00 (normal weeks) |
| Best window 3 | 06:00-10:00 (peak **07:30**) | 09:30 ET | 1.47x | 1.68x | 1.28x | 18.6% | NYSE open 09:30 ET |

|  |  |
|---|---|
| Best weekday | **Wed**: 1.11x the quietest (Mon), 95% CI 1.07-1.15, 3740 days - **weak** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.98x / Wed 1.03x / Thu 1.03x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.87x other Fridays (149 NFP days; big moves 81.9% vs 25.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.8x a normal Wednesday (128 FOMC days; big moves 68.0% vs 8.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.07x a normal Wednesday (129 FOMC days; big moves 62.0% vs 5.0%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.91; peak 19:30 -> 19:30 (last 2 y 19:30) - **stable** |

### USDCZK (USD_CZK) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,574 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.29x | 2.65x | 1.98x | 49.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 2.10x | 2.34x | 1.89x | 45.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.90x | 1.95x | 1.85x | 43.2% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.19, 5653 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.02x / Thu 1.06x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.67x other Fridays (259 NFP days; big moves 95.0% vs 47.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.15x a normal Wednesday (140 FOMC days; big moves 90.0% vs 7.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.41x a normal Wednesday (140 FOMC days; big moves 81.4% vs 5.5%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.99; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDHKD (USD_HKD) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 268,616 half-hours). Best times: **weak** (first vs second half rho 0.75).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 08:00-10:00 (peak **09:00**) | 11:00 ET | 1.69x | 1.83x | 1.57x | 35.4% | London 16:00 close / WM-R fix (normal weeks) |
| Best window 2 | 00:00-04:30 (peak **02:00**) | 04:00 ET | 1.44x | 1.65x | 1.25x | 23.5% | London 2nd hour / London open in DST-mismatch weeks |
| Best window 3 | 17:30-21:00 (peak **19:00**) | 21:00 ET | 1.43x | 1.43x | 1.43x | 33.1% |  |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.11x the quietest (Mon), 95% CI 1.07-1.14, 5619 days - **reliable** |
| Day activity Mon-Fri | Mon 0.96x / Tue 0.97x / Wed 0.99x / Thu 1.03x / Fri 1.06x |
| NFP 08:30 ET (06:30 Calgary) | range 1.46x other Fridays (258 NFP days; big moves 33.7% vs 18.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 1.73x a normal Wednesday (139 FOMC days; big moves 29.5% vs 11.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.68x a normal Wednesday (138 FOMC days; big moves 28.3% vs 12.3%) |
| Era check | last 2 y vs all rho 0.87; before vs since 2020 rho 0.78; peak 09:00 -> 19:00 (last 2 y 19:00) - **shifted** |

### USDHUF (USD_HUF) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,611 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.32x | 2.61x | 2.05x | 52.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 2.16x | 2.37x | 1.98x | 49.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.99x | 2.00x | 1.98x | 49.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.2, 5653 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.01x / Thu 1.06x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.51x other Fridays (258 NFP days; big moves 95.0% vs 53.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.02x a normal Wednesday (140 FOMC days; big moves 87.1% vs 6.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.34x a normal Wednesday (140 FOMC days; big moves 77.1% vs 5.5%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:30) - **stable** |

### USDMXN (USD_MXN) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 262,993 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:30 (peak **07:30**) | 09:30 ET | 2.53x | 3.17x | 2.02x | 51.2% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.41x | 2.76x | 2.11x | 54.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 10:30-14:00 (peak **12:00**) | 14:00 ET | 1.57x | 1.81x | 1.37x | 23.8% | US 14:00 ET (FOMC days; oil settles 14:30 ET) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.17, 5656 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.03x / Thu 1.05x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.31x other Fridays (259 NFP days; big moves 93.8% vs 58.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.87x a normal Wednesday (140 FOMC days; big moves 85.7% vs 22.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.74x a normal Wednesday (140 FOMC days; big moves 86.4% vs 19.9%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.96; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### USDNOK (USD_NOK) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,532 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.13x | 2.40x | 1.88x | 44.5% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.90x | 2.10x | 1.71x | 38.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.80x | 1.87x | 1.74x | 36.8% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.13x the quietest (Mon), 95% CI 1.11-1.16, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.03x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.51x other Fridays (259 NFP days; big moves 93.4% vs 41.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.37x a normal Wednesday (140 FOMC days; big moves 87.9% vs 6.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.59x a normal Wednesday (140 FOMC days; big moves 77.1% vs 4.4%) |
| Era check | last 2 y vs all rho 0.92; before vs since 2020 rho 0.96; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDPLN (USD_PLN) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 275,128 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 2.37x | 2.79x | 2.02x | 50.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 2.18x | 2.51x | 1.89x | 45.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 2.03x | 2.14x | 1.92x | 45.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.12-1.17, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.02x / Thu 1.05x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.5x other Fridays (259 NFP days; big moves 93.8% vs 51.0%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.13x a normal Wednesday (140 FOMC days; big moves 88.6% vs 6.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.2x a normal Wednesday (140 FOMC days; big moves 79.3% vs 5.4%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.99; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDSEK (USD_SEK) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,687 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.14x | 2.40x | 1.90x | 45.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.92x | 2.11x | 1.74x | 39.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.84x | 1.93x | 1.75x | 36.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5656 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.02x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.66x other Fridays (259 NFP days; big moves 94.6% vs 42.0%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.58x a normal Wednesday (140 FOMC days; big moves 89.3% vs 6.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.8x a normal Wednesday (140 FOMC days; big moves 78.6% vs 4.2%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDSGD (USD_SGD) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 273,459 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.67x | 1.86x | 1.49x | 26.1% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.51x | 1.64x | 1.38x | 26.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.49x | 1.62x | 1.37x | 17.8% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5656 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.97x / Wed 1.03x / Thu 1.04x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.99x other Fridays (259 NFP days; big moves 88.4% vs 29.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 6.12x a normal Wednesday (140 FOMC days; big moves 80.7% vs 5.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.74x a normal Wednesday (140 FOMC days; big moves 74.3% vs 4.6%) |
| Era check | last 2 y vs all rho 0.95; before vs since 2020 rho 0.95; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### USDTHB (USD_THB) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 245,721 half-hours). Best times: **reliable** (first vs second half rho 0.88).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 00:00-04:00 (peak **01:00**) | 03:00 ET | 1.71x | 1.94x | 1.50x | 30.3% | London open 08:00 (normal weeks) |
| Best window 2 | 18:00-21:30 (peak **19:00**) | 21:00 ET | 1.66x | 1.66x | 1.67x | 37.6% |  |
| Best window 3 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.39x | 1.50x | 1.29x | 24.0% | 10:00 ET data (ISM, JOLTS, sentiment) |

|  |  |
|---|---|
| Best weekday | **Wed**: 1.12x the quietest (Mon), 95% CI 1.09-1.15, 5425 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.98x / Wed 1.03x / Thu 1.02x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.77x other Fridays (251 NFP days; big moves 70.9% vs 24.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 6.37x a normal Wednesday (138 FOMC days; big moves 60.9% vs 5.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 5.56x a normal Wednesday (136 FOMC days; big moves 60.3% vs 4.4%) |
| Era check | last 2 y vs all rho 0.83; before vs since 2020 rho 0.85; peak 18:30 -> 07:30 (last 2 y 07:30) - **shifted** |

### USDTRY (USD_TRY) - Exotics - watchlist

2007-02-15 to 2026-10-28 (19.7 years, 230,156 half-hours). Best times: **weak** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 2.27x | 3.10x | 1.67x | 38.1% | London open 08:00 (normal weeks) |
| Best window 2 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.25x | 3.09x | 1.64x | 36.4% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 3 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 2.17x | 3.00x | 1.56x | 33.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.09x the quietest (Mon), 95% CI 1.06-1.14, 4778 days - **weak** |
| Day activity Mon-Fri | Mon 0.95x / Tue 1.00x / Wed 1.01x / Thu 1.04x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.18x other Fridays (232 NFP days; big moves 81.5% vs 34.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.14x a normal Wednesday (121 FOMC days; big moves 68.6% vs 10.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.31x a normal Wednesday (121 FOMC days; big moves 60.3% vs 9.1%) |
| Era check | last 2 y vs all rho 0.75; before vs since 2020 rho 0.90; peak 08:00 -> 00:00 (last 2 y 00:00) - **shifted** |

### USDZAR (USD_ZAR) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 271,909 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.22x | 2.67x | 1.85x | 42.5% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 2.10x | 2.50x | 1.77x | 41.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.89x | 2.04x | 1.75x | 37.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.18, 5654 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.03x / Thu 1.06x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.29x other Fridays (259 NFP days; big moves 93.4% vs 47.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.63x a normal Wednesday (140 FOMC days; big moves 72.9% vs 7.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.79x a normal Wednesday (140 FOMC days; big moves 75.0% vs 6.8%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.97; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### ZARJPY (ZAR_JPY) - Exotics - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 274,536 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.97x | 2.24x | 1.73x | 35.6% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 1.82x | 2.04x | 1.63x | 33.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.70x | 1.74x | 1.66x | 31.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.14-1.21, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.01x / Thu 1.06x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.47x other Fridays (259 NFP days; big moves 92.7% vs 37.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.24x a normal Wednesday (140 FOMC days; big moves 65.7% vs 6.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.73x a normal Wednesday (140 FOMC days; big moves 59.3% vs 5.1%) |
| Era check | last 2 y vs all rho 0.91; before vs since 2020 rho 0.94; peak 08:00 -> 07:30 (last 2 y 08:00) - **stable** |

### XAGAUD (XAG_AUD) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,357 half-hours). Best times: **reliable** (first vs second half rho 0.90).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.38x | 2.66x | 2.13x | 55.4% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.09x | 2.23x | 1.96x | 48.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.33x | 1.44x | 1.22x | 13.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.18, 5329 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.01x / Thu 1.05x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.03x other Fridays (240 NFP days; big moves 90.8% vs 49.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.6x a normal Wednesday (132 FOMC days; big moves 78.8% vs 7.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.13x a normal Wednesday (132 FOMC days; big moves 69.7% vs 5.5%) |
| Era check | last 2 y vs all rho 0.92; before vs since 2020 rho 0.91; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGEUR (XAG_EUR) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,492 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.46x | 2.71x | 2.23x | 59.9% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.21x | 2.36x | 2.07x | 52.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.43x | 1.63x | 1.25x | 15.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.19, 5328 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.00x / Thu 1.07x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.0x other Fridays (240 NFP days; big moves 93.3% vs 55.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.58x a normal Wednesday (132 FOMC days; big moves 78.8% vs 8.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.38x a normal Wednesday (132 FOMC days; big moves 72.7% vs 6.2%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.93; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGUSD (XAG_USD) - Metals - watchlist

2006-03-19 to 2026-10-29 (20.6 years, 247,465 half-hours). Best times: **reliable** (first vs second half rho 0.91).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-09:30 (peak **07:30**) | 09:30 ET | 2.91x | 3.71x | 2.28x | 62.5% | NYSE open 09:30 ET |
| Best window 2 | 10:30-12:00 (peak **11:00**) | 13:00 ET | 1.50x | 1.67x | 1.35x | 22.4% |  |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.31x | 1.36x | 1.27x | 16.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.11x the quietest (Mon), 95% CI 1.08-1.16, 5321 days - **weak** |
| Day activity Mon-Fri | Mon 0.94x / Tue 0.98x / Wed 1.00x / Thu 1.04x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.2x other Fridays (240 NFP days; big moves 93.8% vs 58.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.23x a normal Wednesday (132 FOMC days; big moves 84.8% vs 9.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.33x a normal Wednesday (132 FOMC days; big moves 78.8% vs 6.8%) |
| Era check | last 2 y vs all rho 0.88; before vs since 2020 rho 0.87; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUAUD (XAU_AUD) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,416 half-hours). Best times: **reliable** (first vs second half rho 0.92).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.25x | 2.78x | 1.83x | 40.8% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.00x | 2.36x | 1.69x | 36.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.32x | 1.43x | 1.21x | 10.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.19, 5329 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.01x / Thu 1.05x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.23x other Fridays (240 NFP days; big moves 91.7% vs 38.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.6x a normal Wednesday (132 FOMC days; big moves 75.8% vs 6.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.86x a normal Wednesday (132 FOMC days; big moves 60.6% vs 4.7%) |
| Era check | last 2 y vs all rho 0.91; before vs since 2020 rho 0.94; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUCHF (XAU_CHF) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,407 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.35x | 2.80x | 1.98x | 49.0% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.12x | 2.46x | 1.84x | 43.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.40x | 1.53x | 1.28x | 14.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.18, 5328 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 0.99x / Thu 1.06x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.2x other Fridays (240 NFP days; big moves 93.8% vs 48.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.57x a normal Wednesday (132 FOMC days; big moves 77.3% vs 7.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.06x a normal Wednesday (132 FOMC days; big moves 67.4% vs 5.4%) |
| Era check | last 2 y vs all rho 0.88; before vs since 2020 rho 0.96; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUEUR (XAU_EUR) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,607 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.37x | 2.79x | 2.02x | 51.2% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.13x | 2.41x | 1.88x | 45.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.40x | 1.55x | 1.26x | 14.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.17, 5328 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.98x / Wed 0.99x / Thu 1.06x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.27x other Fridays (240 NFP days; big moves 93.3% vs 47.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.64x a normal Wednesday (132 FOMC days; big moves 76.5% vs 7.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.87x a normal Wednesday (132 FOMC days; big moves 65.9% vs 5.7%) |
| Era check | last 2 y vs all rho 0.89; before vs since 2020 rho 0.96; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUGBP (XAU_GBP) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,365 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.31x | 2.68x | 1.99x | 49.3% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.10x | 2.37x | 1.86x | 43.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.43x | 1.56x | 1.31x | 15.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.12-1.17, 5329 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.01x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.17x other Fridays (240 NFP days; big moves 92.9% vs 45.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.5x a normal Wednesday (132 FOMC days; big moves 77.3% vs 7.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.98x a normal Wednesday (132 FOMC days; big moves 65.9% vs 5.2%) |
| Era check | last 2 y vs all rho 0.88; before vs since 2020 rho 0.96; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUJPY (XAU_JPY) - Metals - watchlist

2006-03-18 to 2026-10-29 (20.6 years, 251,453 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.25x | 2.59x | 1.95x | 47.7% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.03x | 2.30x | 1.80x | 41.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.34x | 1.44x | 1.24x | 12.9% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.16, 5328 days - **weak** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.98x / Wed 1.00x / Thu 1.05x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.29x other Fridays (240 NFP days; big moves 92.1% vs 46.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.62x a normal Wednesday (132 FOMC days; big moves 78.8% vs 8.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.25x a normal Wednesday (132 FOMC days; big moves 67.4% vs 5.5%) |
| Era check | last 2 y vs all rho 0.91; before vs since 2020 rho 0.92; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUUSD (XAU_USD) - Metals - watchlist

2006-03-19 to 2026-10-29 (20.6 years, 248,340 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.70x | 3.32x | 2.20x | 59.2% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.38x | 2.78x | 2.04x | 51.5% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 10:30-12:30 (peak **11:00**) | 13:00 ET | 1.41x | 1.54x | 1.29x | 19.3% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.19, 5323 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.01x / Thu 1.06x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.54x other Fridays (240 NFP days; big moves 94.2% vs 57.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.07x a normal Wednesday (132 FOMC days; big moves 89.4% vs 10.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.73x a normal Wednesday (132 FOMC days; big moves 80.3% vs 6.9%) |
| Era check | last 2 y vs all rho 0.86; before vs since 2020 rho 0.91; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XPDUSD (XPD_USD) - Metals - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 233,966 half-hours). Best times: **weak** (first vs second half rho 0.79).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-10:00 (peak **07:30**) | 09:30 ET | 2.28x | 2.67x | 1.94x | 45.5% | NYSE open 09:30 ET |
| Best window 2 | 10:00-11:30 (peak **10:30**) | 12:30 ET | 1.95x | 2.15x | 1.77x | 40.4% |  |
| Best window 3 | 00:00-02:30 (peak **01:00**) | 03:00 ET | 1.23x | 1.20x | 1.26x | 20.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.1x the quietest (Mon), 95% CI 1.07-1.13, 5260 days - **reliable** |
| Day activity Mon-Fri | Mon 0.94x / Tue 1.00x / Wed 1.01x / Thu 1.03x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 1.44x other Fridays (236 NFP days; big moves 70.8% vs 51.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.18x a normal Wednesday (136 FOMC days; big moves 51.5% vs 16.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.14x a normal Wednesday (134 FOMC days; big moves 49.3% vs 14.4%) |
| Era check | last 2 y vs all rho 0.84; before vs since 2020 rho 0.87; peak 10:30 -> 07:30 (last 2 y 07:30) - **shifted** |

### XPTUSD (XPT_USD) - Metals - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 244,536 half-hours). Best times: **weak** (first vs second half rho 0.73).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-09:30 (peak **07:30**) | 09:30 ET | 2.25x | 2.72x | 1.85x | 43.5% | NYSE open 09:30 ET |
| Best window 2 | 10:00-12:00 (peak **11:00**) | 13:00 ET | 1.41x | 1.49x | 1.33x | 21.0% |  |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.21x | 1.23x | 1.20x | 14.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.12x the quietest (Mon), 95% CI 1.09-1.15, 5344 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.02x / Thu 1.03x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 1.65x other Fridays (246 NFP days; big moves 66.7% vs 42.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.86x a normal Wednesday (138 FOMC days; big moves 63.0% vs 14.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.9x a normal Wednesday (137 FOMC days; big moves 62.8% vs 12.7%) |
| Era check | last 2 y vs all rho 0.91; before vs since 2020 rho 0.90; peak 06:30 -> 07:30 (last 2 y 07:30) - **shifted** |

### AUS200 (AU200_AUD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 205,024 half-hours). Best times: **reliable** (first vs second half rho 0.84).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 16:00-16:30 (peak **16:00**) | 18:00 ET | 2.91x | 3.78x | 2.24x | 59.7% |  |
| Best window 2 | 18:00-19:00 (peak **18:00**) | 20:00 ET | 2.41x | 3.00x | 1.94x | 45.2% | Asia morning (Tokyo 09:00-10:00 JST, Tokyo fix 09:55) |
| Best window 3 | 16:30-18:00 (peak **17:00**) | 19:00 ET | 2.04x | 2.39x | 1.75x | 37.9% | Tokyo 09:00 (winter) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.11-1.18, 4915 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.02x / Thu 1.06x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.37x other Fridays (176 NFP days; big moves 58.0% vs 8.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.72x a normal Wednesday (126 FOMC days; big moves 54.8% vs 5.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.45x a normal Wednesday (126 FOMC days; big moves 48.4% vs 5.7%) |
| Era check | last 2 y vs all rho 0.63; before vs since 2020 rho 0.65; peak 16:00 -> 07:30 (last 2 y 07:30) - **shifted** |

### CHINAH (CHINAH_HKD) - Index / commodity CFDs - watchlist

2021-11-01 to 2026-10-29 (5.0 years, 39,940 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 18:30-19:00 (peak **18:30**) | 20:30 ET | 5.27x | 8.40x | 3.31x | 94.0% |  |
| Best window 2 | 19:30-20:00 (peak **19:30**) | 21:30 ET | 4.57x | 7.10x | 2.95x | 81.4% |  |
| Best window 3 | 07:30-08:00 (peak **07:30**) | 09:30 ET | 2.74x | 3.44x | 2.18x | 59.4% | NYSE open 09:30 ET |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.1x the quietest (Wed), 95% CI 1.04-1.15, 1210 days - **weak** |
| Day activity Mon-Fri | Mon 0.99x / Tue 1.00x / Wed 0.96x / Thu 1.05x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.74x other Fridays (54 NFP days; big moves 51.9% vs 10.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.79x a normal Wednesday (27 FOMC days; big moves 33.3% vs 1.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.49x a normal Wednesday (27 FOMC days; big moves 51.9% vs 1.0%) |
| Era check | last 2 y vs all rho 1.00; before vs since 2020 rho -; peak - -> 18:30 (last 2 y 18:30) - **stable** |

### CN50 (CN50_USD) - Index / commodity CFDs - watchlist

2011-08-29 to 2026-10-29 (15.2 years, 136,413 half-hours). Best times: **reliable** (first vs second half rho 0.90).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 18:30-19:00 (peak **18:30**) | 20:30 ET | 8.45x | 14.60x | 4.89x | 94.4% |  |
| Best window 2 | 19:30-20:30 (peak **19:30**) | 21:30 ET | 7.37x | 12.75x | 4.25x | 89.9% |  |
| Best window 3 | 23:00-00:00 (peak **23:00**) | 01:00 ET | 4.42x | 6.65x | 2.94x | 74.1% |  |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.07x the quietest (Wed), 95% CI 1.04-1.12, 3740 days - **weak** |
| Day activity Mon-Fri | Mon 1.01x / Tue 0.97x / Wed 0.96x / Thu 1.01x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.21x other Fridays (163 NFP days; big moves 39.3% vs 6.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.78x a normal Wednesday (84 FOMC days; big moves 41.7% vs 2.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.25x a normal Wednesday (83 FOMC days; big moves 47.0% vs 2.0%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.92; peak 18:30 -> 18:30 (last 2 y 18:30) - **stable** |

### COPPER (XCU_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 232,326 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-10:00 (peak **07:30**) | 09:30 ET | 2.44x | 3.22x | 1.84x | 43.0% | NYSE open 09:30 ET |
| Best window 2 | 00:00-02:00 (peak **01:00**) | 03:00 ET | 1.57x | 1.63x | 1.51x | 26.4% | London open 08:00 (normal weeks) |
| Best window 3 | 02:00-03:30 (peak **02:00**) | 04:00 ET | 1.44x | 1.44x | 1.43x | 24.5% | London 2nd hour / London open in DST-mismatch weeks |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.11x the quietest (Mon), 95% CI 1.08-1.14, 5087 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 1.00x / Wed 0.99x / Thu 1.03x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 1.76x other Fridays (238 NFP days; big moves 80.7% vs 35.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.95x a normal Wednesday (135 FOMC days; big moves 53.3% vs 6.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.23x a normal Wednesday (135 FOMC days; big moves 45.2% vs 2.8%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.96; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### CORN (CORN_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 176,603 half-hours). Best times: **weak** (first vs second half rho 0.92).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-08:00 (peak **07:30**) | 09:30 ET | 5.97x | 9.37x | 3.80x | 90.7% | NYSE open 09:30 ET |
| Best window 2 | 08:00-10:00 (peak **08:30**) | 10:30 ET | 4.69x | 6.84x | 3.22x | 78.2% | first stock hour |
| Best window 3 | 11:00-13:00 (peak **11:30**) | 13:30 ET | 2.87x | 4.12x | 2.00x | 46.6% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.04x the quietest (Fri), 95% CI 1.02-1.07, 5308 days - **weak** |
| Day activity Mon-Fri | Mon 1.01x / Tue 0.98x / Wed 0.99x / Thu 1.01x / Fri 0.97x |
| NFP 08:30 ET (06:30 Calgary) | range 1.29x other Fridays (160 NFP days; big moves 19.4% vs 11.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 1.0x a normal Wednesday (140 FOMC days; big moves 45.0% vs 51.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 0.55x a normal Wednesday (5 FOMC days; big moves 0.0% vs 50.3%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.94; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### EUSTX50 (EU50_EUR) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 167,796 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-01:30 (peak **01:00**) | 03:00 ET | 2.64x | 3.28x | 2.12x | 52.8% | London open 08:00 (normal weeks) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 2.11x | 2.67x | 1.67x | 33.1% | NYSE open 09:30 ET |
| Best window 3 | 05:30-07:30 (peak **06:30**) | 08:30 ET | 1.25x | 1.34x | 1.17x | 18.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.13-1.22, 5542 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.01x / Thu 1.07x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.22x other Fridays (252 NFP days; big moves 73.4% vs 17.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.09x a normal Wednesday (124 FOMC days; big moves 50.8% vs 5.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.03x a normal Wednesday (122 FOMC days; big moves 42.6% vs 4.3%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.90; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### FRA40 (FR40_EUR) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-28 (21.8 years, 151,723 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-01:30 (peak **01:00**) | 03:00 ET | 2.37x | 2.99x | 1.88x | 43.5% | London open 08:00 (normal weeks) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 1.95x | 2.56x | 1.48x | 22.0% | NYSE open 09:30 ET |
| Best window 3 | 05:30-07:30 (peak **06:30**) | 08:30 ET | 1.12x | 1.16x | 1.07x | 13.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.14-1.22, 5548 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.00x / Thu 1.07x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.18x other Fridays (252 NFP days; big moves 65.9% vs 12.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.67x a normal Wednesday (129 FOMC days; big moves 40.3% vs 2.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.37x a normal Wednesday (129 FOMC days; big moves 35.7% vs 2.2%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.97; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### GER40 (DE30_EUR) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 179,194 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-02:30 (peak **01:00**) | 03:00 ET | 2.22x | 2.55x | 1.93x | 46.3% | London open 08:00 (normal weeks) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 2.10x | 2.68x | 1.64x | 31.6% | NYSE open 09:30 ET |
| Best window 3 | 05:30-07:30 (peak **06:30**) | 08:30 ET | 1.27x | 1.34x | 1.21x | 18.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.13x the quietest (Mon), 95% CI 1.1-1.17, 5540 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.01x / Wed 1.01x / Thu 1.05x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.14x other Fridays (252 NFP days; big moves 75.0% vs 18.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.66x a normal Wednesday (130 FOMC days; big moves 48.5% vs 4.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.31x a normal Wednesday (130 FOMC days; big moves 41.5% vs 3.4%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.98; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### HK50 (HK33_HKD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 121,420 half-hours). Best times: **weak** (first vs second half rho 0.82).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 18:30-19:00 (peak **18:30**) | 20:30 ET | 2.90x | 3.71x | 2.27x | 55.9% |  |
| Best window 2 | 19:00-20:30 (peak **19:30**) | 21:30 ET | 2.24x | 2.56x | 1.95x | 48.8% |  |
| Best window 3 | 07:30-08:30 (peak **07:30**) | 09:30 ET | 1.67x | 1.79x | 1.56x | 28.6% | NYSE open 09:30 ET |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.05x the quietest (Wed), 95% CI 1.01-1.08, 3219 days - **weak** |
| Day activity Mon-Fri | Mon 0.98x / Tue 0.99x / Wed 0.98x / Thu 1.03x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.46x other Fridays (144 NFP days; big moves 38.2% vs 5.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.53x a normal Wednesday (44 FOMC days; big moves 31.8% vs 1.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.32x a normal Wednesday (41 FOMC days; big moves 51.2% vs 1.2%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.90; peak 18:30 -> 18:30 (last 2 y 18:30) - **stable** |

### JPN225 (JP225Y_JPY) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 224,121 half-hours). Best times: **reliable** (first vs second half rho 0.89).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-09:00 (peak **07:30**) | 09:30 ET | 2.27x | 3.10x | 1.67x | 32.1% | NYSE open 09:30 ET |
| Best window 2 | 18:00-19:00 (peak **18:00**) | 20:00 ET | 2.17x | 2.32x | 2.03x | 51.0% | Asia morning (Tokyo 09:00-10:00 JST, Tokyo fix 09:55) |
| Best window 3 | 10:30-14:00 (peak **13:30**) | 15:30 ET | 1.38x | 1.55x | 1.22x | 17.2% | last regular stock half-hour |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.21, 5384 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.01x / Thu 1.06x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.82x other Fridays (249 NFP days; big moves 71.1% vs 12.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.43x a normal Wednesday (138 FOMC days; big moves 61.6% vs 9.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.26x a normal Wednesday (139 FOMC days; big moves 56.8% vs 8.6%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.94; peak 07:30 -> 18:00 (last 2 y 07:30) - **shifted** |

### NAS100 (NAS100_USD) - Index / commodity CFDs - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 258,093 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-08:30 (peak **07:30**) | 09:30 ET | 6.82x | 12.68x | 3.67x | 92.3% | NYSE open 09:30 ET |
| Best window 2 | 10:30-14:00 (peak **13:30**) | 15:30 ET | 3.73x | 6.24x | 2.23x | 58.4% | last regular stock half-hour |
| Best window 3 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 1.58x | 1.83x | 1.36x | 27.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5622 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.02x / Thu 1.05x / Fri 0.98x |
| NFP 08:30 ET (06:30 Calgary) | range 2.86x other Fridays (258 NFP days; big moves 91.1% vs 30.0%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.49x a normal Wednesday (140 FOMC days; big moves 88.6% vs 43.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.17x a normal Wednesday (140 FOMC days; big moves 87.1% vs 41.7%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.97; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### NATGAS (NATGAS_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 247,191 half-hours). Best times: **weak** (first vs second half rho 0.92).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-08:30 (peak **07:00**) | 09:00 ET | 4.46x | 6.64x | 3.00x | 78.5% | US 09:00 ET |
| Best window 2 | 11:30-12:30 (peak **12:00**) | 14:00 ET | 4.29x | 7.15x | 2.57x | 69.4% | US 14:00 ET (FOMC days; oil settles 14:30 ET) |
| Best window 3 | 08:30-11:30 (peak **08:30**) | 10:30 ET | 4.00x | 6.31x | 2.54x | 65.1% | first stock hour |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.23x the quietest (Fri), 95% CI 1.19-1.26, 5610 days - **reliable** |
| Day activity Mon-Fri | Mon 0.99x / Tue 0.99x / Wed 0.98x / Thu 1.14x / Fri 0.93x |
| NFP 08:30 ET (06:30 Calgary) | range 1.12x other Fridays (252 NFP days; big moves 72.6% vs 68.0%) |
| FOMC 14:00 ET (12:00 Calgary) | range 0.98x a normal Wednesday (140 FOMC days; big moves 69.3% vs 69.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.07x a normal Wednesday (132 FOMC days; big moves 15.2% vs 13.4%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.93; peak 08:30 -> 07:00 (last 2 y 07:00) - **shifted** |

### NETH25 (NL25_EUR) - Index / commodity CFDs - watchlist

2008-01-18 to 2026-10-28 (18.8 years, 128,668 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-01:30 (peak **01:00**) | 03:00 ET | 2.41x | 2.90x | 2.00x | 49.2% | London open 08:00 (normal weeks) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 2.08x | 2.69x | 1.61x | 28.8% | NYSE open 09:30 ET |
| Best window 3 | 05:30-07:30 (peak **06:30**) | 08:30 ET | 1.07x | 1.09x | 1.04x | 12.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.17x the quietest (Mon), 95% CI 1.14-1.21, 4768 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.97x / Wed 1.02x / Thu 1.06x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.42x other Fridays (216 NFP days; big moves 66.7% vs 10.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.64x a normal Wednesday (126 FOMC days; big moves 42.1% vs 2.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.43x a normal Wednesday (126 FOMC days; big moves 39.7% vs 2.4%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.94; peak 01:00 -> 01:00 (last 2 y 07:30) - **stable** |

### SOYBEANS (SOYBN_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 187,850 half-hours). Best times: **weak** (first vs second half rho 0.89).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-08:00 (peak **07:30**) | 09:30 ET | 5.18x | 8.34x | 3.21x | 87.0% | NYSE open 09:30 ET |
| Best window 2 | 08:00-10:00 (peak **08:30**) | 10:30 ET | 4.46x | 7.07x | 2.81x | 71.5% | first stock hour |
| Best window 3 | 10:30-13:00 (peak **12:00**) | 14:00 ET | 2.70x | 3.93x | 1.85x | 43.1% | US 14:00 ET (FOMC days; oil settles 14:30 ET) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.03x the quietest (Wed), 95% CI 1.0-1.06, 5433 days - **weak** |
| Day activity Mon-Fri | Mon 1.01x / Tue 1.01x / Wed 0.98x / Thu 1.01x / Fri 0.99x |
| NFP 08:30 ET (06:30 Calgary) | range 1.3x other Fridays (160 NFP days; big moves 15.0% vs 6.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 0.94x a normal Wednesday (140 FOMC days; big moves 38.6% vs 43.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 0.87x a normal Wednesday (7 FOMC days; big moves 28.6% vs 34.6%) |
| Era check | last 2 y vs all rho 0.93; before vs since 2020 rho 0.89; peak 08:30 -> 07:30 (last 2 y 07:30) - **shifted** |

### SPA35 (ESPIX_EUR) - Index / commodity CFDs - watchlist

2016-12-01 to 2026-10-28 (9.9 years, 52,557 half-hours). Best times: **weak** (first vs second half rho 0.78).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-03:00 (peak **01:00**) | 03:00 ET | 1.65x | 1.26x | 2.15x | 57.6% | London open 08:00 (normal weeks) |
| Best window 2 | 04:30-09:30 (peak **07:30**) | 09:30 ET | 1.22x | 1.14x | 1.30x | 15.1% | NYSE open 09:30 ET |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.09x the quietest (Mon), 95% CI 1.07-1.12, 2508 days - **weak** |
| Day activity Mon-Fri | Mon 0.94x / Tue 1.00x / Wed 1.00x / Thu 1.03x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 1.89x other Fridays (114 NFP days; big moves 38.6% vs 7.0%) |
| FOMC 14:00 ET (12:00 Calgary) | range 1.57x a normal Wednesday (9 FOMC days; big moves 0.0% vs 6.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.22x a normal Wednesday (9 FOMC days; big moves 55.6% vs 0.0%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.86; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### SPOTBRENT (BCO_USD) - Index / commodity CFDs - watchlist

2005-01-04 to 2026-10-29 (21.8 years, 235,632 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **09:00**) | 11:00 ET | 2.97x | 4.20x | 2.09x | 54.2% | London 16:00 close / WM-R fix (normal weeks) |
| Best window 2 | 12:00-12:30 (peak **12:00**) | 14:00 ET | 2.81x | 3.88x | 2.03x | 51.3% | US 14:00 ET (FOMC days; oil settles 14:30 ET) |
| Best window 3 | 01:30-06:00 (peak **02:00**) | 04:00 ET | 1.60x | 1.80x | 1.42x | 18.5% | London 2nd hour / London open in DST-mismatch weeks |

|  |  |
|---|---|
| Best weekday | **Wed**: 1.09x the quietest (Mon), 95% CI 1.07-1.11, 5551 days - **reliable** |
| Day activity Mon-Fri | Mon 0.96x / Tue 0.99x / Wed 1.04x / Thu 1.01x / Fri 0.97x |
| NFP 08:30 ET (06:30 Calgary) | range 1.57x other Fridays (248 NFP days; big moves 58.5% vs 24.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 1.15x a normal Wednesday (139 FOMC days; big moves 61.2% vs 51.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.37x a normal Wednesday (138 FOMC days; big moves 18.1% vs 4.6%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.96; peak 09:00 -> 07:30 (last 2 y 07:30) - **shifted** |

### SPOTCRUDE (WTICO_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 258,647 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 3.60x | 5.43x | 2.38x | 63.7% | first stock hour |
| Best window 2 | 12:00-12:30 (peak **12:00**) | 14:00 ET | 3.56x | 5.49x | 2.31x | 61.7% | US 14:00 ET (FOMC days; oil settles 14:30 ET) |
| Best window 3 | 01:30-05:00 (peak **02:00**) | 04:00 ET | 1.48x | 1.65x | 1.33x | 15.9% | London 2nd hour / London open in DST-mismatch weeks |

|  |  |
|---|---|
| Best weekday | **Wed**: 1.1x the quietest (Mon), 95% CI 1.06-1.12, 5619 days - **reliable** |
| Day activity Mon-Fri | Mon 0.96x / Tue 0.99x / Wed 1.06x / Thu 1.02x / Fri 0.97x |
| NFP 08:30 ET (06:30 Calgary) | range 1.59x other Fridays (252 NFP days; big moves 69.8% vs 37.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 1.12x a normal Wednesday (140 FOMC days; big moves 68.6% vs 61.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.4x a normal Wednesday (132 FOMC days; big moves 22.7% vs 6.4%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.94; peak 12:00 -> 07:30 (last 2 y 07:30) - **shifted** |

### SUGAR (SUGAR_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-28 (21.8 years, 103,385 half-hours). Best times: **weak** (first vs second half rho 0.82).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 10:30-11:30 (peak **11:00**) | 13:00 ET | 1.86x | 2.31x | 1.50x | 27.6% |  |
| Best window 2 | 06:00-07:30 (peak **06:00**) | 08:00 ET | 1.68x | 1.87x | 1.51x | 26.4% | US pre-data hour |
| Best window 3 | 07:30-10:30 (peak **07:30**) | 09:30 ET | 1.41x | 1.55x | 1.28x | 16.5% | NYSE open 09:30 ET |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.05x the quietest (Fri), 95% CI 1.02-1.08, 4963 days - **reliable** |
| Day activity Mon-Fri | Mon 0.98x / Tue 1.00x / Wed 1.00x / Thu 1.03x / Fri 0.98x |
| NFP 08:30 ET (06:30 Calgary) | range 1.21x other Fridays (223 NFP days; big moves 30.5% vs 15.9%) |
| Era check | last 2 y vs all rho 0.93; before vs since 2020 rho 0.85; peak 11:00 -> 01:30 (last 2 y 01:30) - **shifted** |

### SWI20 (CH20_CHF) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-28 (21.8 years, 126,227 half-hours). Best times: **reliable** (first vs second half rho 0.87).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-02:00 (peak **01:00**) | 03:00 ET | 2.16x | 2.29x | 2.04x | 51.7% | London open 08:00 (normal weeks) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 1.64x | 1.89x | 1.42x | 19.4% | NYSE open 09:30 ET |
| Best window 3 | 04:30-07:30 (peak **06:30**) | 08:30 ET | 1.04x | 1.05x | 1.04x | 9.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.12-1.18, 5477 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 1.00x / Wed 1.00x / Thu 1.05x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.0x other Fridays (247 NFP days; big moves 51.4% vs 8.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.1x a normal Wednesday (85 FOMC days; big moves 45.9% vs 1.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.96x a normal Wednesday (85 FOMC days; big moves 30.6% vs 1.7%) |
| Era check | last 2 y vs all rho 0.88; before vs since 2020 rho 0.91; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### UK100 (UK100_GBP) - Index / commodity CFDs - watchlist

2005-01-04 to 2026-10-29 (21.8 years, 180,174 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-01:30 (peak **01:00**) | 03:00 ET | 2.55x | 3.08x | 2.11x | 54.7% | London open 08:00 (normal weeks) |
| Best window 2 | 07:30-10:00 (peak **07:30**) | 09:30 ET | 2.13x | 2.77x | 1.64x | 30.7% | NYSE open 09:30 ET |
| Best window 3 | 05:30-07:30 (peak **06:30**) | 08:30 ET | 1.22x | 1.31x | 1.14x | 13.5% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.11x the quietest (Mon), 95% CI 1.08-1.14, 4641 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 1.00x / Wed 1.01x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.02x other Fridays (250 NFP days; big moves 62.4% vs 11.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.35x a normal Wednesday (132 FOMC days; big moves 46.2% vs 4.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.34x a normal Wednesday (132 FOMC days; big moves 38.6% vs 3.4%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.98; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### US2000 (US2000_USD) - Index / commodity CFDs - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 249,351 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-08:30 (peak **07:30**) | 09:30 ET | 8.47x | 17.64x | 4.07x | 95.5% | NYSE open 09:30 ET |
| Best window 2 | 10:30-14:00 (peak **13:30**) | 15:30 ET | 4.26x | 8.01x | 2.27x | 61.0% | last regular stock half-hour |
| Best window 3 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 1.84x | 2.38x | 1.42x | 28.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.1-1.18, 5612 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 1.00x / Wed 1.03x / Thu 1.06x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.94x other Fridays (259 NFP days; big moves 91.9% vs 28.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.39x a normal Wednesday (140 FOMC days; big moves 91.4% vs 44.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.24x a normal Wednesday (140 FOMC days; big moves 85.7% vs 42.4%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.96; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### US30 (US30_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 255,248 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-08:30 (peak **07:30**) | 09:30 ET | 5.77x | 10.20x | 3.26x | 88.5% | NYSE open 09:30 ET |
| Best window 2 | 12:00-14:00 (peak **13:30**) | 15:30 ET | 3.53x | 5.46x | 2.29x | 61.2% | last regular stock half-hour |
| Best window 3 | 10:30-12:00 (peak **11:00**) | 13:00 ET | 2.27x | 3.17x | 1.62x | 33.9% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.19, 5608 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.01x / Thu 1.04x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.85x other Fridays (258 NFP days; big moves 90.3% vs 27.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.53x a normal Wednesday (140 FOMC days; big moves 88.6% vs 40.6%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.2x a normal Wednesday (140 FOMC days; big moves 87.1% vs 39.2%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.98; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### US500 (SPX500_USD) - Index / commodity CFDs - watchlist

2005-01-02 to 2026-10-29 (21.8 years, 258,123 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-09:00 (peak **07:30**) | 09:30 ET | 4.77x | 7.84x | 2.90x | 81.8% | NYSE open 09:30 ET |
| Best window 2 | 12:00-14:00 (peak **13:30**) | 15:30 ET | 3.10x | 4.25x | 2.26x | 59.5% | last regular stock half-hour |
| Best window 3 | 10:30-12:00 (peak **11:00**) | 13:00 ET | 2.06x | 2.65x | 1.60x | 32.3% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.11-1.2, 5622 days - **reliable** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.01x / Thu 1.05x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.94x other Fridays (258 NFP days; big moves 92.2% vs 28.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.71x a normal Wednesday (140 FOMC days; big moves 91.4% vs 39.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.39x a normal Wednesday (140 FOMC days; big moves 86.4% vs 38.4%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.97; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### WHEAT (WHEAT_USD) - Index / commodity CFDs - watchlist

2005-01-03 to 2026-10-29 (21.8 years, 179,047 half-hours). Best times: **weak** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-08:00 (peak **07:30**) | 09:30 ET | 6.32x | 10.95x | 3.65x | 90.8% | NYSE open 09:30 ET |
| Best window 2 | 08:00-09:30 (peak **08:30**) | 10:30 ET | 5.19x | 8.14x | 3.32x | 78.8% | first stock hour |
| Best window 3 | 11:00-13:00 (peak **12:00**) | 14:00 ET | 3.14x | 4.54x | 2.17x | 54.7% | US 14:00 ET (FOMC days; oil settles 14:30 ET) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.04x the quietest (Fri), 95% CI 1.02-1.07, 5128 days - **weak** |
| Day activity Mon-Fri | Mon 1.00x / Tue 0.99x / Wed 1.00x / Thu 1.01x / Fri 0.97x |
| NFP 08:30 ET (06:30 Calgary) | range 1.33x other Fridays (160 NFP days; big moves 15.6% vs 9.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 0.92x a normal Wednesday (138 FOMC days; big moves 50.0% vs 54.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.1x a normal Wednesday (5 FOMC days; big moves 80.0% vs 60.5%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.96; peak 08:30 -> 07:30 (last 2 y 07:30) - **shifted** |

### AUDHKD (AUD_HKD) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,181 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.85x | 2.07x | 1.66x | 32.9% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.60x | 1.70x | 1.50x | 28.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.44x | 1.54x | 1.35x | 15.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.2x the quietest (Mon), 95% CI 1.17-1.23, 5660 days - **reliable** |
| Day activity Mon-Fri | Mon 0.88x / Tue 1.00x / Wed 1.04x / Thu 1.06x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.91x other Fridays (259 NFP days; big moves 93.4% vs 34.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.99x a normal Wednesday (140 FOMC days; big moves 90.0% vs 5.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.46x a normal Wednesday (140 FOMC days; big moves 82.1% vs 4.4%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.97; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### CADHKD (CAD_HKD) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 274,842 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:30**) | 10:30 ET | 2.25x | 2.50x | 2.04x | 52.0% | first stock hour |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.07x | 2.20x | 1.95x | 48.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.40x | 1.48x | 1.32x | 14.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.19x the quietest (Mon), 95% CI 1.16-1.22, 5658 days - **reliable** |
| Day activity Mon-Fri | Mon 0.89x / Tue 0.99x / Wed 1.04x / Thu 1.02x / Fri 1.06x |
| NFP 08:30 ET (06:30 Calgary) | range 2.13x other Fridays (259 NFP days; big moves 93.8% vs 60.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.21x a normal Wednesday (140 FOMC days; big moves 87.9% vs 9.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.23x a normal Wednesday (140 FOMC days; big moves 77.9% vs 7.6%) |
| Era check | last 2 y vs all rho 0.92; before vs since 2020 rho 0.94; peak 08:30 -> 07:30 (last 2 y 08:00) - **shifted** |

### CADSGD (CAD_SGD) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 274,875 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.03x | 2.32x | 1.78x | 38.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.93x | 2.12x | 1.76x | 39.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.33x | 1.47x | 1.21x | 8.8% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.18x the quietest (Mon), 95% CI 1.15-1.21, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.98x / Wed 1.02x / Thu 1.03x / Fri 1.07x |
| NFP 08:30 ET (06:30 Calgary) | range 2.05x other Fridays (259 NFP days; big moves 92.7% vs 53.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.19x a normal Wednesday (140 FOMC days; big moves 78.6% vs 6.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.25x a normal Wednesday (140 FOMC days; big moves 55.7% vs 4.9%) |
| Era check | last 2 y vs all rho 0.76; before vs since 2020 rho 0.95; peak 08:00 -> 07:30 (last 2 y 07:30) - **shifted** |

### CHFHKD (CHF_HKD) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,106 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.05x | 2.19x | 1.92x | 46.5% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.87x | 1.92x | 1.81x | 43.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-06:00 (peak **01:00**) | 03:00 ET | 1.68x | 1.73x | 1.62x | 30.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.15-1.21, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.98x / Wed 1.02x / Thu 1.07x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 3.05x other Fridays (259 NFP days; big moves 94.2% vs 47.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.98x a normal Wednesday (140 FOMC days; big moves 91.4% vs 7.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.0x a normal Wednesday (140 FOMC days; big moves 81.4% vs 5.8%) |
| Era check | last 2 y vs all rho 0.97; before vs since 2020 rho 0.98; peak 08:00 -> 08:30 (last 2 y 08:00) - **stable** |

### CHFZAR (CHF_ZAR) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,181 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.04x | 2.45x | 1.71x | 34.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.90x | 2.22x | 1.62x | 33.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.76x | 1.87x | 1.64x | 31.0% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.12-1.16, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.98x / Wed 1.02x / Thu 1.06x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.23x other Fridays (259 NFP days; big moves 91.5% vs 37.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.09x a normal Wednesday (140 FOMC days; big moves 66.4% vs 6.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.46x a normal Wednesday (140 FOMC days; big moves 55.0% vs 5.7%) |
| Era check | last 2 y vs all rho 0.93; before vs since 2020 rho 0.97; peak 08:00 -> 07:30 (last 2 y 08:00) - **stable** |

### EURDKK (EUR_DKK) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 257,007 half-hours). Best times: **reliable** (first vs second half rho 0.87).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-09:30 (peak **09:00**) | 11:00 ET | 2.43x | 2.70x | 2.19x | 54.8% | London 16:00 close / WM-R fix (normal weeks) |
| Best window 2 | 03:30-07:30 (peak **06:30**) | 08:30 ET | 1.54x | 1.78x | 1.33x | 29.5% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:30-03:30 (peak **01:00**) | 03:00 ET | 1.38x | 1.46x | 1.30x | 30.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.06x the quietest (Mon), 95% CI 1.03-1.09, 5653 days - **reliable** |
| Day activity Mon-Fri | Mon 0.98x / Tue 0.98x / Wed 1.01x / Thu 1.02x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 1.13x other Fridays (259 NFP days; big moves 35.9% vs 31.3%) |
| FOMC 14:00 ET (12:00 Calgary) | range 1.81x a normal Wednesday (140 FOMC days; big moves 42.1% vs 19.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 1.5x a normal Wednesday (140 FOMC days; big moves 27.1% vs 18.4%) |
| Era check | last 2 y vs all rho 0.65; before vs since 2020 rho 0.79; peak 09:00 -> 08:30 (last 2 y 08:30) - **shifted** |

### EURHKD (EUR_HKD) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,498 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.19x | 2.47x | 1.95x | 47.1% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.97x | 2.12x | 1.83x | 43.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.75x | 1.88x | 1.63x | 30.8% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.2x the quietest (Mon), 95% CI 1.17-1.23, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.89x / Tue 0.98x / Wed 1.02x / Thu 1.07x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.94x other Fridays (259 NFP days; big moves 95.4% vs 48.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.68x a normal Wednesday (140 FOMC days; big moves 90.7% vs 7.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.46x a normal Wednesday (140 FOMC days; big moves 81.4% vs 5.6%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.99; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### GBPHKD (GBP_HKD) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,143 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.05x | 2.27x | 1.86x | 42.4% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.87x | 2.01x | 1.74x | 39.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.75x | 1.84x | 1.66x | 31.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.18, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.99x / Wed 1.03x / Thu 1.04x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.5x other Fridays (259 NFP days; big moves 93.1% vs 43.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.43x a normal Wednesday (140 FOMC days; big moves 88.6% vs 5.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.96x a normal Wednesday (140 FOMC days; big moves 75.0% vs 3.9%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.97; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### GBPPLN (GBP_PLN) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,193 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.03x | 2.34x | 1.76x | 37.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 00:00-06:00 (peak **01:00**) | 03:00 ET | 1.95x | 2.01x | 1.89x | 44.1% | London open 08:00 (normal weeks) |
| Best window 3 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.92x | 2.19x | 1.68x | 35.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.12x the quietest (Mon), 95% CI 1.08-1.15, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.02x / Thu 1.05x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 1.91x other Fridays (259 NFP days; big moves 84.9% vs 36.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.98x a normal Wednesday (140 FOMC days; big moves 62.9% vs 4.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.42x a normal Wednesday (140 FOMC days; big moves 43.6% vs 3.9%) |
| Era check | last 2 y vs all rho 0.92; before vs since 2020 rho 0.98; peak 08:00 -> 08:30 (last 2 y 08:00) - **stable** |

### GBPZAR (GBP_ZAR) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,091 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.03x | 2.48x | 1.67x | 31.6% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 03:30-07:00 (peak **06:30**) | 08:30 ET | 1.90x | 2.24x | 1.61x | 32.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-03:30 (peak **01:00**) | 03:00 ET | 1.76x | 1.91x | 1.62x | 30.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.16, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.98x / Wed 1.03x / Thu 1.04x / Fri 1.00x |
| NFP 08:30 ET (06:30 Calgary) | range 2.19x other Fridays (259 NFP days; big moves 88.8% vs 36.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.28x a normal Wednesday (140 FOMC days; big moves 64.3% vs 6.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.4x a normal Wednesday (140 FOMC days; big moves 51.4% vs 4.9%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.98; peak 08:00 -> 07:30 (last 2 y 08:00) - **stable** |

### HKDJPY (HKD_JPY) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,065 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.90x | 2.07x | 1.75x | 36.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.73x | 1.78x | 1.68x | 38.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.48x | 1.59x | 1.38x | 18.8% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.18, 5659 days - **weak** |
| Day activity Mon-Fri | Mon 0.90x / Tue 0.98x / Wed 1.03x / Thu 1.04x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 3.27x other Fridays (259 NFP days; big moves 93.4% vs 42.8%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.01x a normal Wednesday (140 FOMC days; big moves 85.0% vs 8.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.89x a normal Wednesday (140 FOMC days; big moves 74.3% vs 6.2%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.99; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### NZDHKD (NZD_HKD) - Exotics

2008-06-07 to 2026-10-29 (18.4 years, 230,961 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.85x | 2.08x | 1.65x | 32.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.56x | 1.66x | 1.46x | 27.5% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-04:30 (peak **01:00**) | 03:00 ET | 1.43x | 1.52x | 1.35x | 14.5% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.22x the quietest (Mon), 95% CI 1.19-1.25, 4768 days - **weak** |
| Day activity Mon-Fri | Mon 0.88x / Tue 0.99x / Wed 1.06x / Thu 1.07x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.99x other Fridays (217 NFP days; big moves 92.6% vs 33.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.28x a normal Wednesday (132 FOMC days; big moves 84.8% vs 5.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.29x a normal Wednesday (132 FOMC days; big moves 80.3% vs 4.2%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.96; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### NZDSGD (NZD_SGD) - Exotics

2008-06-07 to 2026-10-29 (18.4 years, 231,048 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.79x | 2.11x | 1.51x | 24.3% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.51x | 1.71x | 1.34x | 22.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.39x | 1.52x | 1.27x | 10.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.18x the quietest (Mon), 95% CI 1.16-1.21, 4768 days - **weak** |
| Day activity Mon-Fri | Mon 0.89x / Tue 1.00x / Wed 1.05x / Thu 1.06x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.83x other Fridays (217 NFP days; big moves 90.3% vs 27.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.6x a normal Wednesday (132 FOMC days; big moves 80.3% vs 4.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.63x a normal Wednesday (132 FOMC days; big moves 74.2% vs 3.4%) |
| Era check | last 2 y vs all rho 0.83; before vs since 2020 rho 0.96; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### SGDCHF (SGD_CHF) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 275,218 half-hours). Best times: **reliable** (first vs second half rho 0.97).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.92x | 2.23x | 1.65x | 32.5% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 1.76x | 1.97x | 1.58x | 32.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:30 (peak **01:00**) | 03:00 ET | 1.60x | 1.72x | 1.48x | 21.6% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.18, 5659 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.00x / Thu 1.07x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.71x other Fridays (259 NFP days; big moves 92.3% vs 35.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.93x a normal Wednesday (140 FOMC days; big moves 85.0% vs 5.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.63x a normal Wednesday (140 FOMC days; big moves 60.0% vs 3.9%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.98; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### TRYJPY (TRY_JPY) - Exotics

2007-02-12 to 2026-10-28 (19.7 years, 237,078 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 1.98x | 2.35x | 1.66x | 35.0% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:00-07:00 (peak **06:30**) | 08:30 ET | 1.83x | 2.16x | 1.55x | 32.6% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.77x | 2.01x | 1.56x | 29.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.15x the quietest (Mon), 95% CI 1.12-1.19, 4776 days - **reliable** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.00x / Thu 1.06x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.97x other Fridays (232 NFP days; big moves 90.1% vs 35.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.05x a normal Wednesday (121 FOMC days; big moves 80.2% vs 8.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.1x a normal Wednesday (121 FOMC days; big moves 63.6% vs 6.4%) |
| Era check | last 2 y vs all rho 0.71; before vs since 2020 rho 0.89; peak 08:00 -> 08:00 (last 2 y 08:00) - **shifted** |

### USDDKK (USD_DKK) - Exotics

2005-01-02 to 2026-10-29 (21.8 years, 274,932 half-hours). Best times: **reliable** (first vs second half rho 0.99).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-10:00 (peak **08:00**) | 10:00 ET | 2.19x | 2.46x | 1.95x | 47.6% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 2 | 05:30-07:00 (peak **06:30**) | 08:30 ET | 1.99x | 2.14x | 1.85x | 44.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.76x | 1.87x | 1.64x | 31.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.19x the quietest (Mon), 95% CI 1.16-1.22, 5657 days - **reliable** |
| Day activity Mon-Fri | Mon 0.89x / Tue 0.99x / Wed 1.02x / Thu 1.06x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.94x other Fridays (259 NFP days; big moves 95.4% vs 48.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.76x a normal Wednesday (140 FOMC days; big moves 92.1% vs 7.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.47x a normal Wednesday (140 FOMC days; big moves 82.1% vs 5.6%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.99; peak 08:00 -> 08:00 (last 2 y 08:00) - **stable** |

### XAGCAD (XAG_CAD) - Metals

2006-03-19 to 2026-10-29 (20.6 years, 251,076 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.50x | 2.81x | 2.22x | 58.9% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.27x | 2.44x | 2.11x | 54.0% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 10:30-13:00 (peak **11:00**) | 13:00 ET | 1.37x | 1.39x | 1.35x | 22.0% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.12x the quietest (Mon), 95% CI 1.08-1.15, 5328 days - **weak** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.01x / Thu 1.04x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.02x other Fridays (240 NFP days; big moves 92.5% vs 62.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.64x a normal Wednesday (132 FOMC days; big moves 82.6% vs 8.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.39x a normal Wednesday (132 FOMC days; big moves 75.0% vs 6.2%) |
| Era check | last 2 y vs all rho 0.85; before vs since 2020 rho 0.90; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGCHF (XAG_CHF) - Metals

2006-03-18 to 2026-10-29 (20.6 years, 251,328 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.45x | 2.72x | 2.20x | 58.7% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.19x | 2.37x | 2.02x | 50.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.42x | 1.60x | 1.26x | 15.0% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5328 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.01x / Thu 1.06x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 1.95x other Fridays (240 NFP days; big moves 93.8% vs 53.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.54x a normal Wednesday (132 FOMC days; big moves 80.3% vs 8.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.34x a normal Wednesday (132 FOMC days; big moves 72.0% vs 6.1%) |
| Era check | last 2 y vs all rho 0.88; before vs since 2020 rho 0.92; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGGBP (XAG_GBP) - Metals

2006-03-18 to 2026-10-29 (20.6 years, 251,233 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.33x | 2.49x | 2.19x | 58.0% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.13x | 2.22x | 2.04x | 51.5% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.44x | 1.62x | 1.28x | 15.7% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 5329 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.01x / Thu 1.05x / Fri 1.02x |
| NFP 08:30 ET (06:30 Calgary) | range 2.0x other Fridays (240 NFP days; big moves 92.9% vs 53.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.67x a normal Wednesday (132 FOMC days; big moves 80.3% vs 8.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.46x a normal Wednesday (132 FOMC days; big moves 73.5% vs 6.0%) |
| Era check | last 2 y vs all rho 0.89; before vs since 2020 rho 0.93; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGHKD (XAG_HKD) - Metals

2008-06-07 to 2026-10-29 (18.4 years, 222,044 half-hours). Best times: **reliable** (first vs second half rho 0.89).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-09:30 (peak **07:30**) | 09:30 ET | 2.59x | 2.91x | 2.30x | 62.8% | NYSE open 09:30 ET |
| Best window 2 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.32x | 1.36x | 1.28x | 16.6% | London open 08:00 (normal weeks) |
| Best window 3 | 10:30-12:30 (peak **11:00**) | 13:00 ET | 1.28x | 1.25x | 1.31x | 20.1% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.12x the quietest (Mon), 95% CI 1.09-1.15, 4752 days - **weak** |
| Day activity Mon-Fri | Mon 0.94x / Tue 0.99x / Wed 1.00x / Thu 1.05x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.33x other Fridays (213 NFP days; big moves 93.4% vs 55.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.37x a normal Wednesday (132 FOMC days; big moves 85.6% vs 9.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.27x a normal Wednesday (132 FOMC days; big moves 78.8% vs 7.2%) |
| Era check | last 2 y vs all rho 0.92; before vs since 2020 rho 0.91; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGJPY (XAG_JPY) - Metals

2006-03-18 to 2026-10-29 (20.6 years, 251,347 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.54x | 2.94x | 2.19x | 57.8% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.22x | 2.46x | 2.00x | 49.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.36x | 1.45x | 1.27x | 15.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.1-1.18, 5328 days - **weak** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.98x / Wed 1.01x / Thu 1.05x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.04x other Fridays (240 NFP days; big moves 92.5% vs 52.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.56x a normal Wednesday (132 FOMC days; big moves 81.8% vs 8.4%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.43x a normal Wednesday (132 FOMC days; big moves 71.2% vs 5.9%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.91; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGNZD (XAG_NZD) - Metals

2006-03-19 to 2026-10-29 (20.6 years, 250,660 half-hours). Best times: **reliable** (first vs second half rho 0.89).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.35x | 2.66x | 2.08x | 53.6% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.09x | 2.26x | 1.92x | 46.9% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.30x | 1.40x | 1.21x | 12.9% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.18, 5325 days - **reliable** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.02x / Thu 1.06x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.05x other Fridays (239 NFP days; big moves 92.1% vs 49.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.48x a normal Wednesday (132 FOMC days; big moves 77.3% vs 6.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.16x a normal Wednesday (132 FOMC days; big moves 68.9% vs 5.5%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.89; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### XAGSGD (XAG_SGD) - Metals

2008-06-07 to 2026-10-29 (18.4 years, 222,395 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-09:30 (peak **07:30**) | 09:30 ET | 2.35x | 2.44x | 2.26x | 60.8% | NYSE open 09:30 ET |
| Best window 2 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.34x | 1.42x | 1.25x | 14.9% | London open 08:00 (normal weeks) |
| Best window 3 | 10:30-13:00 (peak **11:00**) | 13:00 ET | 1.21x | 1.12x | 1.31x | 20.2% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.11-1.17, 4752 days - **weak** |
| Day activity Mon-Fri | Mon 0.93x / Tue 0.99x / Wed 1.01x / Thu 1.06x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.15x other Fridays (213 NFP days; big moves 93.9% vs 53.6%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.06x a normal Wednesday (132 FOMC days; big moves 82.6% vs 9.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.75x a normal Wednesday (132 FOMC days; big moves 75.8% vs 7.0%) |
| Era check | last 2 y vs all rho 0.94; before vs since 2020 rho 0.94; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUCAD (XAU_CAD) - Metals

2006-03-19 to 2026-10-29 (20.6 years, 251,188 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.46x | 2.94x | 2.06x | 53.1% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.25x | 2.53x | 2.00x | 49.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 10:30-13:30 (peak **11:00**) | 13:00 ET | 1.34x | 1.42x | 1.26x | 16.7% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.14x the quietest (Mon), 95% CI 1.12-1.17, 5328 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.01x / Thu 1.05x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.06x other Fridays (240 NFP days; big moves 93.8% vs 62.4%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.61x a normal Wednesday (132 FOMC days; big moves 81.8% vs 8.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.98x a normal Wednesday (132 FOMC days; big moves 72.0% vs 6.0%) |
| Era check | last 2 y vs all rho 0.83; before vs since 2020 rho 0.94; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUHKD (XAU_HKD) - Metals

2008-06-07 to 2026-10-29 (18.4 years, 222,132 half-hours). Best times: **reliable** (first vs second half rho 0.93).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.57x | 3.01x | 2.19x | 59.3% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.21x | 2.46x | 1.99x | 49.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.32x | 1.39x | 1.26x | 14.9% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.12-1.19, 4752 days - **weak** |
| Day activity Mon-Fri | Mon 0.91x / Tue 0.99x / Wed 1.00x / Thu 1.06x / Fri 1.05x |
| NFP 08:30 ET (06:30 Calgary) | range 2.71x other Fridays (213 NFP days; big moves 93.9% vs 56.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.2x a normal Wednesday (132 FOMC days; big moves 89.4% vs 10.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.74x a normal Wednesday (132 FOMC days; big moves 80.3% vs 7.0%) |
| Era check | last 2 y vs all rho 0.89; before vs since 2020 rho 0.93; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUNZD (XAU_NZD) - Metals

2006-03-19 to 2026-10-29 (20.6 years, 250,785 half-hours). Best times: **reliable** (first vs second half rho 0.92).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.19x | 2.70x | 1.78x | 38.2% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.94x | 2.29x | 1.65x | 34.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.31x | 1.43x | 1.20x | 10.1% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.19, 5325 days - **reliable** |
| Day activity Mon-Fri | Mon 0.91x / Tue 1.00x / Wed 1.02x / Thu 1.05x / Fri 1.01x |
| NFP 08:30 ET (06:30 Calgary) | range 2.17x other Fridays (239 NFP days; big moves 91.6% vs 36.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.65x a normal Wednesday (132 FOMC days; big moves 75.0% vs 5.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.9x a normal Wednesday (132 FOMC days; big moves 62.1% vs 4.6%) |
| Era check | last 2 y vs all rho 0.88; before vs since 2020 rho 0.92; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUSGD (XAU_SGD) - Metals

2008-06-07 to 2026-10-29 (18.4 years, 222,548 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.35x | 2.66x | 2.08x | 53.2% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.05x | 2.22x | 1.89x | 45.7% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 00:00-05:00 (peak **01:00**) | 03:00 ET | 1.31x | 1.41x | 1.22x | 12.4% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.13x the quietest (Mon), 95% CI 1.1-1.17, 4752 days - **weak** |
| Day activity Mon-Fri | Mon 0.92x / Tue 0.99x / Wed 1.00x / Thu 1.05x / Fri 1.05x |
| NFP 08:30 ET (06:30 Calgary) | range 2.48x other Fridays (213 NFP days; big moves 94.4% vs 49.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.49x a normal Wednesday (132 FOMC days; big moves 86.4% vs 8.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.7x a normal Wednesday (132 FOMC days; big moves 75.0% vs 6.2%) |
| Era check | last 2 y vs all rho 0.91; before vs since 2020 rho 0.95; peak 08:00 -> 07:30 (last 2 y 07:30) - **stable** |

### XAUXAG (XAU_XAG) - Metals

2006-03-19 to 2026-10-29 (20.6 years, 247,700 half-hours). Best times: **reliable** (first vs second half rho 0.91).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:00-09:30 (peak **07:30**) | 09:30 ET | 2.62x | 3.47x | 1.97x | 48.7% | NYSE open 09:30 ET |
| Best window 2 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 2.34x | 2.92x | 1.88x | 45.2% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 3 | 10:30-12:00 (peak **11:00**) | 13:00 ET | 1.49x | 1.64x | 1.35x | 20.7% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.1x the quietest (Mon), 95% CI 1.07-1.13, 5320 days - **weak** |
| Day activity Mon-Fri | Mon 0.95x / Tue 0.99x / Wed 1.01x / Thu 1.04x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 1.92x other Fridays (239 NFP days; big moves 89.5% vs 47.7%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.16x a normal Wednesday (132 FOMC days; big moves 79.5% vs 7.1%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.05x a normal Wednesday (132 FOMC days; big moves 66.7% vs 5.2%) |
| Era check | last 2 y vs all rho 0.87; before vs since 2020 rho 0.89; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### DE10YBEUR (DE10YB_EUR) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 178,790 half-hours). Best times: **reliable** (first vs second half rho 0.98).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 1.84x | 2.12x | 1.60x | 34.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 2 | 07:30-09:30 (peak **08:00**) | 10:00 ET | 1.80x | 2.15x | 1.50x | 26.2% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 3 | 00:30-04:00 (peak **01:00**) | 03:00 ET | 1.77x | 1.93x | 1.62x | 30.3% | London open 08:00 (normal weeks) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.31x the quietest (Mon), 95% CI 1.26-1.34, 5546 days - **reliable** |
| Day activity Mon-Fri | Mon 0.86x / Tue 0.97x / Wed 1.03x / Thu 1.12x / Fri 1.03x |
| NFP 08:30 ET (06:30 Calgary) | range 2.38x other Fridays (252 NFP days; big moves 92.5% vs 37.0%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.28x a normal Wednesday (130 FOMC days; big moves 60.0% vs 2.3%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.56x a normal Wednesday (130 FOMC days; big moves 48.5% vs 1.3%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.98; peak 08:00 -> 01:00 (last 2 y 01:00) - **shifted** |

### JPN225 (JP225_USD) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 225,031 half-hours). Best times: **reliable** (first vs second half rho 0.89).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 07:30-09:00 (peak **07:30**) | 09:30 ET | 2.29x | 3.14x | 1.67x | 32.5% | NYSE open 09:30 ET |
| Best window 2 | 18:00-19:00 (peak **18:00**) | 20:00 ET | 2.15x | 2.27x | 2.04x | 51.2% | Asia morning (Tokyo 09:00-10:00 JST, Tokyo fix 09:55) |
| Best window 3 | 12:00-14:00 (peak **13:30**) | 15:30 ET | 1.42x | 1.64x | 1.22x | 17.2% | last regular stock half-hour |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.16x the quietest (Mon), 95% CI 1.13-1.21, 5406 days - **weak** |
| Day activity Mon-Fri | Mon 0.90x / Tue 1.00x / Wed 1.01x / Thu 1.05x / Fri 1.04x |
| NFP 08:30 ET (06:30 Calgary) | range 2.82x other Fridays (250 NFP days; big moves 70.8% vs 12.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.42x a normal Wednesday (138 FOMC days; big moves 63.0% vs 9.8%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.26x a normal Wednesday (139 FOMC days; big moves 56.8% vs 8.7%) |
| Era check | last 2 y vs all rho 0.90; before vs since 2020 rho 0.94; peak 07:30 -> 07:30 (last 2 y 07:30) - **stable** |

### SG30SGD (SG30_SGD) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 177,843 half-hours). Best times: **reliable** (first vs second half rho 0.81).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 17:30-19:00 (peak **18:00**) | 20:00 ET | 3.29x | 3.94x | 2.75x | 74.6% | Asia morning (Tokyo 09:00-10:00 JST, Tokyo fix 09:55) |
| Best window 2 | 19:00-20:00 (peak **19:00**) | 21:00 ET | 2.68x | 3.14x | 2.28x | 59.2% |  |
| Best window 3 | 07:30-09:00 (peak **07:30**) | 09:30 ET | 1.66x | 1.67x | 1.65x | 36.3% | NYSE open 09:30 ET |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.09x the quietest (Mon), 95% CI 1.05-1.11, 4486 days - **reliable** |
| Day activity Mon-Fri | Mon 0.94x / Tue 0.98x / Wed 1.00x / Thu 1.02x / Fri 0.99x |
| NFP 08:30 ET (06:30 Calgary) | range 2.37x other Fridays (227 NFP days; big moves 45.4% vs 8.5%) |
| FOMC 14:00 ET (12:00 Calgary) | range 2.65x a normal Wednesday (85 FOMC days; big moves 49.4% vs 5.2%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.64x a normal Wednesday (85 FOMC days; big moves 61.2% vs 3.7%) |
| Era check | last 2 y vs all rho 0.74; before vs since 2020 rho 0.68; peak 18:00 -> 18:00 (last 2 y 18:00) - **shifted** |

### UK10YBGBP (UK10YB_GBP) - Index / commodity CFDs

2005-01-04 to 2026-10-28 (21.8 years, 109,756 half-hours). Best times: **reliable** (first vs second half rho 0.96).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 01:00-02:00 (peak **01:00**) | 03:00 ET | 1.67x | 1.78x | 1.56x | 24.9% | London open 08:00 (normal weeks) |
| Best window 2 | 07:00-09:30 (peak **08:00**) | 10:00 ET | 1.35x | 1.47x | 1.24x | 13.6% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 3 | 06:00-07:00 (peak **06:30**) | 08:30 ET | 1.33x | 1.40x | 1.27x | 20.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.27x the quietest (Mon), 95% CI 1.24-1.3, 5473 days - **reliable** |
| Day activity Mon-Fri | Mon 0.86x / Tue 0.98x / Wed 1.01x / Thu 1.09x / Fri 1.05x |
| NFP 08:30 ET (06:30 Calgary) | range 2.37x other Fridays (250 NFP days; big moves 85.6% vs 22.4%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.97; peak 01:00 -> 01:00 (last 2 y 01:00) - **stable** |

### USB02YUSD (USB02Y_USD) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 215,179 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 2.83x | 4.00x | 2.00x | 51.1% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 2 | 07:30-09:30 (peak **08:00**) | 10:00 ET | 2.50x | 3.33x | 1.88x | 38.7% | 10:00 ET data (ISM, JOLTS, sentiment) |
| Best window 3 | 10:30-12:00 (peak **11:00**) | 13:00 ET | 1.58x | 1.88x | 1.33x | 22.3% |  |

|  |  |
|---|---|
| Best weekday | **Fri**: 1.32x the quietest (Mon), 95% CI 1.27-1.38, 5333 days - **reliable** |
| Day activity Mon-Fri | Mon 0.83x / Tue 0.95x / Wed 1.06x / Thu 1.06x / Fri 1.09x |
| NFP 08:30 ET (06:30 Calgary) | range 3.93x other Fridays (257 NFP days; big moves 96.5% vs 58.2%) |
| FOMC 14:00 ET (12:00 Calgary) | range 7.85x a normal Wednesday (140 FOMC days; big moves 88.6% vs 16.0%) |
| FOMC 14:30 ET press conf. (12:30) | range 4.25x a normal Wednesday (136 FOMC days; big moves 83.8% vs 16.5%) |
| Era check | last 2 y vs all rho 0.99; before vs since 2020 rho 0.96; peak 06:30 -> 06:30 (last 2 y 06:30) - **stable** |

### USB05YUSD (USB05Y_USD) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 246,491 half-hours). Best times: **reliable** (first vs second half rho 0.95).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 3.20x | 4.42x | 2.32x | 59.8% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 2.81x | 3.91x | 2.02x | 51.1% | NYSE open 09:30 ET |
| Best window 3 | 10:00-12:30 (peak **11:00**) | 13:00 ET | 1.77x | 2.13x | 1.47x | 28.4% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.3x the quietest (Mon), 95% CI 1.26-1.35, 5597 days - **reliable** |
| Day activity Mon-Fri | Mon 0.83x / Tue 0.96x / Wed 1.06x / Thu 1.08x / Fri 1.06x |
| NFP 08:30 ET (06:30 Calgary) | range 3.56x other Fridays (259 NFP days; big moves 96.1% vs 66.1%) |
| FOMC 14:00 ET (12:00 Calgary) | range 5.72x a normal Wednesday (140 FOMC days; big moves 93.6% vs 17.5%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.91x a normal Wednesday (140 FOMC days; big moves 90.7% vs 18.4%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.95; peak 06:30 -> 06:30 (last 2 y 06:30) - **stable** |

### USB10YUSD (USB10Y_USD) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 250,776 half-hours). Best times: **reliable** (first vs second half rho 0.94).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 3.19x | 4.37x | 2.32x | 58.4% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 2.86x | 4.10x | 2.00x | 50.1% | NYSE open 09:30 ET |
| Best window 3 | 10:30-12:30 (peak **11:00**) | 13:00 ET | 1.73x | 2.03x | 1.47x | 27.0% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.32x the quietest (Mon), 95% CI 1.28-1.36, 5601 days - **weak** |
| Day activity Mon-Fri | Mon 0.82x / Tue 0.96x / Wed 1.06x / Thu 1.08x / Fri 1.06x |
| NFP 08:30 ET (06:30 Calgary) | range 3.38x other Fridays (259 NFP days; big moves 96.1% vs 64.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 4.93x a normal Wednesday (140 FOMC days; big moves 94.3% vs 16.9%) |
| FOMC 14:30 ET press conf. (12:30) | range 3.57x a normal Wednesday (140 FOMC days; big moves 87.9% vs 16.2%) |
| Era check | last 2 y vs all rho 0.98; before vs since 2020 rho 0.95; peak 06:30 -> 07:30 (last 2 y 07:30) - **shifted** |

### USB30YUSD (USB30Y_USD) - Index / commodity CFDs

2005-01-03 to 2026-10-29 (21.8 years, 247,980 half-hours). Best times: **reliable** (first vs second half rho 0.92).

|  | Calgary | Peak NY | Activity | Volume | Range | Big-move days | What happens then |
|---|---|---|---|---|---|---|---|
| Best window 1 | 06:00-07:30 (peak **06:30**) | 08:30 ET | 3.38x | 4.79x | 2.38x | 62.3% | US data 08:30 ET (NFP, CPI, retail sales, claims) |
| Best window 2 | 07:30-09:30 (peak **07:30**) | 09:30 ET | 3.10x | 4.55x | 2.11x | 54.6% | NYSE open 09:30 ET |
| Best window 3 | 10:30-12:30 (peak **11:00**) | 13:00 ET | 1.86x | 2.31x | 1.50x | 29.8% |  |

|  |  |
|---|---|
| Best weekday | **Thu**: 1.28x the quietest (Mon), 95% CI 1.26-1.33, 5597 days - **reliable** |
| Day activity Mon-Fri | Mon 0.84x / Tue 0.97x / Wed 1.05x / Thu 1.08x / Fri 1.05x |
| NFP 08:30 ET (06:30 Calgary) | range 2.93x other Fridays (259 NFP days; big moves 96.1% vs 68.9%) |
| FOMC 14:00 ET (12:00 Calgary) | range 3.76x a normal Wednesday (140 FOMC days; big moves 92.9% vs 19.7%) |
| FOMC 14:30 ET press conf. (12:30) | range 2.76x a normal Wednesday (140 FOMC days; big moves 89.3% vs 20.7%) |
| Era check | last 2 y vs all rho 0.96; before vs since 2020 rho 0.93; peak 06:30 -> 06:30 (last 2 y 07:30) - **stable** |

## Method

- Forex / metals / CFDs: OANDA v20 **M30 mid candles** with tick volume, from 2005 (or the first candle OANDA serves). Stocks: Alpaca **30-minute bars**, unadjusted prices, 04:00-20:00 ET, from 2016; a missing bar inside a trading day = no trade (0 volume, 0 range).
- Each half-hour is labelled by its Calgary start time and Calgary weekday (DST handled per date).
- Normalisation per instrument and calendar month: relative volume = volume / the month's median half-hour, relative range = high-low / the month's median half-hour (forex: all 24 h; stocks: regular session only). Activity = sqrt(relative volume x relative range). Big move = range > 2x typical.
- Best windows = the three strongest peaks of the Mon-Fri median activity profile; each window keeps >= 2/3 of its peak. Reliability: first vs second half of the history (profile Spearman >= 0.8 and the best half-hour within 10% of the maximum in both halves).
- Weekdays: whole trading days (forex 17:00-17:00 New York, stocks regular session; days with less than half the usual bars dropped), day volume and range relative to the month's median day, activity per weekday = median. Best vs quietest weekday ratio with a 400-sample bootstrap 95% CI; "reliable" = CI above 1.0 and both halves of the history pick the same best day.
- Group tables = median over instruments of each instrument's own medians (each instrument counts once).

## Coverage and run log

| Data | Shard | Asked | Analysed | Missing | API requests | Time | Feed |
|---|---|---|---|---|---|---|---|
| fx | 0/2 | 64 | 60 | 4 | 2886 | 7 min | - |
| fx | 1/2 | 59 | 57 | 2 | 2857 | 8 min | - |
| stocks | 0/4 | 248 | 119 | 129 | 11267 | 290 min | sip |
| stocks | 1/4 | 236 | 120 | 116 | 11021 | 290 min | sip |
| stocks | 2/4 | 257 | 139 | 118 | 12082 | 290 min | sip |
| stocks | 3/4 | 275 | 140 | 135 | 12292 | 290 min | sip |

Missing instruments (first 25 per shard):

- fx USD_JPY: fetch HTTPError: 504 HTTP Error 504: Gateway Timeout
- fx GBP_USD: fetch HTTPError: 504 HTTP Error 504: Gateway Timeout
- fx EUR_USD: fetch HTTPError: 504 HTTP Error 504: Gateway Timeout
- fx AUD_JPY: fetch HTTPError: 504 HTTP Error 504: Gateway Timeout
- fx AUD_CHF: fetch HTTPError: 504 HTTP Error 504: Gateway Timeout
- fx CAD_CHF: fetch HTTPError: 504 HTTP Error 504: Gateway Timeout
- stocks FDXF: too little data (1874 bars)
- stocks ITT: fetch BudgetExceeded:  time budget spent
- stocks JBL: fetch BudgetExceeded:  time budget spent
- stocks KEYS: fetch BudgetExceeded:  time budget spent
- stocks KHC: fetch BudgetExceeded:  time budget spent
- stocks KO: fetch BudgetExceeded:  time budget spent
- stocks KOD: fetch BudgetExceeded:  time budget spent
- stocks KTOS: fetch BudgetExceeded:  time budget spent
- stocks KVUE: fetch BudgetExceeded:  time budget spent
- stocks LAC: fetch BudgetExceeded:  time budget spent
- stocks LH: fetch BudgetExceeded:  time budget spent
- stocks NDAQ: fetch BudgetExceeded:  time budget spent
- stocks NI: fetch BudgetExceeded:  time budget spent
- stocks NMR: fetch BudgetExceeded:  time budget spent
- stocks NOC: fetch BudgetExceeded:  time budget spent
- stocks NTES: fetch BudgetExceeded:  time budget spent
- stocks NTR: fetch BudgetExceeded:  time budget spent
- stocks NVS: fetch BudgetExceeded:  time budget spent
- stocks NWG: fetch BudgetExceeded:  time budget spent
- stocks NYT: fetch BudgetExceeded:  time budget spent
- stocks O: fetch BudgetExceeded:  time budget spent
- stocks OKTA: fetch BudgetExceeded:  time budget spent
- stocks ONB: fetch BudgetExceeded:  time budget spent
- stocks ONON: fetch BudgetExceeded:  time budget spent
- stocks ONTO: fetch BudgetExceeded:  time budget spent
- stocks MS: fetch BudgetExceeded:  time budget spent
- stocks MSGS: fetch BudgetExceeded:  time budget spent
- stocks MSTR: fetch BudgetExceeded:  time budget spent
- stocks MTB: fetch BudgetExceeded:  time budget spent
- stocks NEM: fetch BudgetExceeded:  time budget spent
- stocks NET: fetch BudgetExceeded:  time budget spent
- stocks NGG: fetch BudgetExceeded:  time budget spent
- stocks NIO: fetch BudgetExceeded:  time budget spent
- stocks NKE: fetch BudgetExceeded:  time budget spent
- stocks NLY: fetch BudgetExceeded:  time budget spent
- stocks PPL: fetch BudgetExceeded:  time budget spent
- stocks PRIM: fetch BudgetExceeded:  time budget spent
- stocks PWR: fetch BudgetExceeded:  time budget spent
- stocks QCOM: fetch BudgetExceeded:  time budget spent
- stocks RBA: fetch BudgetExceeded:  time budget spent
- stocks RBC: fetch BudgetExceeded:  time budget spent
- stocks RBRK: fetch BudgetExceeded:  time budget spent
- stocks RCL: fetch BudgetExceeded:  time budget spent
- stocks RDDT: fetch BudgetExceeded:  time budget spent
- stocks RDY: fetch BudgetExceeded:  time budget spent
- stocks RELX: fetch BudgetExceeded:  time budget spent
- stocks RIO: fetch BudgetExceeded:  time budget spent
- stocks RIOT: fetch BudgetExceeded:  time budget spent
- stocks RKLB: fetch BudgetExceeded:  time budget spent
- stocks RMD: fetch BudgetExceeded:  time budget spent
- stocks HONA: too little data (1949 bars)
- stocks NTAP: fetch BudgetExceeded:  time budget spent
- stocks NTRA: fetch BudgetExceeded:  time budget spent
- stocks NTRS: fetch BudgetExceeded:  time budget spent
- stocks NUE: fetch BudgetExceeded:  time budget spent
- stocks NVR: fetch BudgetExceeded:  time budget spent
- stocks NVTS: fetch BudgetExceeded:  time budget spent
- stocks NWSA: fetch BudgetExceeded:  time budget spent
- stocks NXPI: fetch BudgetExceeded:  time budget spent
- stocks OKE: fetch BudgetExceeded:  time budget spent
- stocks OKLO: fetch BudgetExceeded:  time budget spent
- stocks PHM: fetch BudgetExceeded:  time budget spent
- stocks PKX: fetch BudgetExceeded:  time budget spent
- stocks PLD: fetch BudgetExceeded:  time budget spent
- stocks PLTR: fetch BudgetExceeded:  time budget spent
- stocks PM: fetch BudgetExceeded:  time budget spent
- stocks PNW: fetch BudgetExceeded:  time budget spent
- stocks POOL: fetch BudgetExceeded:  time budget spent
- stocks PRAX: fetch BudgetExceeded:  time budget spent
- stocks PYPL: fetch BudgetExceeded:  time budget spent
- stocks QSR: fetch BudgetExceeded:  time budget spent
- stocks RCI: fetch BudgetExceeded:  time budget spent
- stocks RJF: fetch BudgetExceeded:  time budget spent
- stocks RL: fetch BudgetExceeded:  time budget spent
- stocks ROK: fetch BudgetExceeded:  time budget spent
- stocks MRSH: fetch BudgetExceeded:  time budget spent
- stocks MRVL: fetch BudgetExceeded:  time budget spent
- stocks MSCI: fetch BudgetExceeded:  time budget spent
- stocks MSFT: fetch BudgetExceeded:  time budget spent
- stocks MTSI: fetch BudgetExceeded:  time budget spent
- stocks MTZ: fetch BudgetExceeded:  time budget spent
- stocks MUFG: fetch BudgetExceeded:  time budget spent
- stocks NEE: fetch BudgetExceeded:  time budget spent
- stocks NFLX: fetch BudgetExceeded:  time budget spent
- stocks NG: fetch BudgetExceeded:  time budget spent
- stocks OXY: fetch BudgetExceeded:  time budget spent
- stocks PAAS: fetch BudgetExceeded:  time budget spent
- stocks PATH: fetch BudgetExceeded:  time budget spent
- stocks PBA: fetch BudgetExceeded:  time budget spent
- stocks PCAR: fetch BudgetExceeded:  time budget spent
- stocks PCG: fetch BudgetExceeded:  time budget spent
- stocks PCVX: fetch BudgetExceeded:  time budget spent
- stocks PKG: fetch BudgetExceeded:  time budget spent
- stocks PNC: fetch BudgetExceeded:  time budget spent
- stocks PNFP: fetch BudgetExceeded:  time budget spent
- stocks PODD: fetch BudgetExceeded:  time budget spent
- stocks PR: fetch BudgetExceeded:  time budget spent
- stocks PRU: fetch BudgetExceeded:  time budget spent
- stocks PSA: fetch BudgetExceeded:  time budget spent
- stocks PSX: fetch BudgetExceeded:  time budget spent

## Caveats

- OANDA volume is **tick volume** (price updates on OANDA's feed), not exchange volume; practice-server prices. It tracks the shape of activity well, not its size.
- Stock volume is consolidated SIP volume (with an IEX fallback the volumes are IEX only - see Feed above).
- Medians describe a typical day; rare shocks do not show in a median (the big-move share is the better guide for those). Differences of 0.1-0.2x between neighbouring half-hours are within noise.
- Holidays and half days are left in (medians limit their pull). Split months add noise to a stock's normalisation for one month (prices are unadjusted).
- High activity means bigger moves in both directions and, at some times (the 15:00 Calgary rollover), wider spreads. It says when to look, not which way to trade.
