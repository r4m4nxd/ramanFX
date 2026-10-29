# Market hours study: when do volume and price action spike? (Calgary time)

Generated 2026-10-29 00:22 UTC by `tools/research/market_hours/market_hours.py` (workflow `market-hours.yml`). Sample: 2024-10-29 to 2026-10-28. All times are **Calgary (America/Edmonton)** with New York in brackets; New York is always 2 h ahead of Calgary (both use US daylight-saving dates). Descriptive statistics only - nothing here is a trading signal or a profit claim.

## When to open the charts (Calgary time)

Each row is a peak of activity on a normal weekday (Mon-Fri pooled, 30-minute buckets). Volume and range are the median over instruments, relative to a typical 30-minute bucket of the same instrument and month (1.0x = typical; forex: typical over 24 h; stocks: typical regular-hours bucket). Big moves = share of days on which the peak half-hour's range was more than 2x typical. The window around each peak keeps at least 2/3 of the peak's activity. Listed in clock order of a Calgary trading day (Tokyo evening first).

| Calgary | New York | Market | Peak (Calgary) | What happens then | Volume | Range | Big moves at peak |
|---|---|---|---|---|---|---|---|
| 00:00-04:30 | 02:00-06:30 | Forex + gold | **01:00** | London open (normal weeks) | 1.46x | 1.35x | 15.8% |
| 01:00-02:00 | 03:00-04:00 | Index / oil CFDs | **01:00** | London open (normal weeks) | 1.38x | 1.13x | 11.7% |
| 02:00-03:30 | 04:00-05:30 | Index / oil CFDs | **02:00** | London open (US/UK DST-mismatch weeks) / Frankfurt+London 2nd hour | 1.38x | 1.13x | 11.7% |
| 06:00-10:00 | 08:00-12:00 | Forex + gold | **08:00** | 10:00 ET data (ISM, JOLTS, sentiment) / first stock hour | 2.20x | 1.83x | 41.6% |
| 07:30-08:30 | 09:30-10:30 | Index / oil CFDs | **07:30** | NYSE open 09:30 ET | 6.74x | 3.17x | 86.7% |
| 07:30-08:00 | 09:30-10:00 | US stocks | **07:30** | NYSE open 09:30 ET | 2.61x | 2.83x | 82.2% |
| 11:30-12:30 | 13:30-14:30 | Index / oil CFDs | **12:00** | 14:00 ET: FOMC statement (8 days a year) | 2.40x | 1.40x | 29.0% |
| 12:30-14:00 | 14:30-16:00 | Index / oil CFDs | **13:30** | last regular half-hour (MOC imbalances, index rebalancing) | 2.87x | 1.80x | 41.0% |
| 13:30-14:30 | 15:30-16:30 | US stocks | **13:30** | last regular half-hour (MOC imbalances, index rebalancing) | 2.31x | 1.04x | 6.9% |

**The routine, in plain words** (activity = sqrt(volume x range) vs a typical half-hour; 1.0x = typical):

1. **06:00-10:00 Calgary = the main window, every weekday.** Forex + gold activity climbs from 1.39x at 06:00 to 1.64x at 06:30 (US data at 08:30 ET), 1.94x at 07:30 (NYSE open) and peaks at **08:00 (2.01x; 41.6% of days have a big move in that half-hour)**, then fades through 09:00 (London close / fix, 1.64x) to 1.23x at 10:00. Index CFDs (US500 / US30 / NAS100) explode at **07:30: 4.62x** (86.7% big-move days). Stocks: **07:30 = 2.71x**, 08:00 1.59x, 08:30 1.25x.

2. **00:30-02:00 Calgary = London open (01:00).** A smaller forex peak: 1.41x at 01:00 (15.8% big-move days). In the US/UK DST-mismatch weeks it moves to 02:00 (see the daylight-saving table). Worth an alarm only if you trade the London open.

3. **NFP Fridays (first Friday) at 06:30 Calgary:** the 06:30 half-hour range is **2.75x** the same half-hour on other Fridays (forex + gold, every instrument between 2.09x and 3.15x; big-move days 79.2% vs 31.2%; 24 NFP days). Stocks pre-market at 06:30: 1.8x.

4. **FOMC days (8 a year, Wednesdays) at 12:00-13:00 Calgary:** the 12:00 statement half-hour range is **3.18x** a normal Wednesday and the 12:30 press-conference half-hour **5.52x** (big-move days 100.0% vs 5.3%; 17 FOMC days). On other days 12:00 is quiet (0.88x). Stocks at 12:30 on FOMC days: 2.36x.

5. **13:30-14:00 Calgary = stock close.** The last regular half-hour has 2.31x volume but only 1.04x range: lots of volume (closing orders), not much price travel. The 14:00 bucket's volume (2.84x) is mostly closing-auction prints. Index CFDs at 13:30: 2.27x.

6. **18:00-19:30 Calgary = Asia morning** (Sun-Thu evenings): a mild pickup, 1.08x at 18:00 and 1.09x at 19:00. Measured at 18:00 in both seasons (see the daylight-saving table).

7. **Quiet: 11:30-17:30 Calgary.** Forex drops below typical from 11:30 (0.91x), is lowest at 15:00 (0.24x: the 17:00 ET rollover, when spreads widen - avoid entries then) and stays quiet until the Asian morning.


**Weekdays matter much less than the clock.** Forex + gold day range: Mon 1.0x, Tue 0.98x, Wed 1.03x, Thu 1.02x, Fri 1.0x (busiest Wed / Thu, about 5% between the busiest and the quietest day, against 8x between the busiest and the quietest half-hour of the day). Stocks day volume: Mon 0.98x, Tue 0.99x, Wed 1.0x, Thu 1.01x, Fri 1.03x.

Busiest single weekday x half-hour cells, forex + gold: Fri 08:00 (2.2x, 46.6% big-move days); Thu 08:00 (2.09x, 44.6% big-move days); Fri 08:30 (2.09x, 45.7% big-move days).

## Busiest weekdays

Whole trading day (forex day = 17:00-17:00 New York, i.e. 15:00-15:00 Calgary, Sunday evening counts as Monday; stocks = regular session), relative to the median day of the same instrument and month. IQR = spread across instruments.

**Forex + gold**

| Day | Day volume | IQR | Day range | IQR | Days per instrument | Instruments |
|---|---|---|---|---|---|---|
| Mon | 0.96x | 0.95-0.97 | 1.00x | 0.97-1.0 | 104 | 6 |
| Tue | 0.97x | 0.96-0.99 | 0.98x | 0.95-1.01 | 105 | 6 |
| Wed | 1.01x | 1.0-1.03 | 1.03x | 1.01-1.05 | 103 | 6 |
| Thu | 1.02x | 1.02-1.03 | 1.02x | 1.01-1.03 | 103 | 6 |
| Fri | 1.02x | 1.0-1.02 | 1.00x | 0.98-1.0 | 104 | 6 |

**Index / oil CFDs**

| Day | Day volume | IQR | Day range | IQR | Days per instrument | Instruments |
|---|---|---|---|---|---|---|
| Mon | 0.95x | 0.92-0.97 | 0.99x | 0.98-1.0 | 104 | 4 |
| Tue | 0.97x | 0.96-0.99 | 0.98x | 0.97-0.99 | 105 | 4 |
| Wed | 1.00x | 1.0-1.0 | 1.00x | 0.99-1.0 | 103 | 4 |
| Thu | 1.04x | 1.03-1.05 | 1.04x | 1.03-1.05 | 103 | 4 |
| Fri | 1.04x | 1.02-1.04 | 1.01x | 0.99-1.01 | 103 | 4 |

**US stocks**

| Day | Day volume | IQR | Day range | IQR | Days per instrument | Instruments |
|---|---|---|---|---|---|---|
| Mon | 0.98x | 0.97-1.0 | 0.99x | 0.96-1.0 | 96 | 28 |
| Tue | 0.99x | 0.96-1.0 | 1.00x | 0.98-1.0 | 105 | 28 |
| Wed | 1.00x | 0.98-1.0 | 1.00x | 1.0-1.01 | 103 | 28 |
| Thu | 1.01x | 1.0-1.03 | 1.02x | 1.0-1.04 | 98 | 28 |
| Fri | 1.03x | 1.01-1.06 | 1.00x | 0.99-1.01 | 99 | 28 |

## Session opens and scheduled events

Each event is measured at its own local clock on each date (so daylight-saving shifts are exact): the 30-minute bucket that starts at the event vs the bucket one hour earlier ("lift"). "Calgary clock" = how often the event fell at each Calgary time in the sample.

**Forex + gold**

| Event | Calgary clock | Volume | Vol lift | Range | Range lift | Big moves | Days |
|---|---|---|---|---|---|---|---|
| Tokyo open 09:00 JST | 18:00 (342d), 17:00 (180d) | 0.95x | 2.64x | 1.01x | 1.58x | 7.1% | 517 |
| London open 08:00 London | 01:00 (480d), 02:00 (42d) | 1.48x | 1.20x | 1.36x | 1.09x | 16.1% | 518 |
| US data 08:30 ET (NFP, CPI, claims ...) | 06:30 (522d) | 1.67x | 1.56x | 1.61x | 1.43x | 33.5% | 518 |
| NYSE open 09:30 ET | 07:30 (522d) | 2.23x | 1.34x | 1.69x | 1.05x | 33.2% | 518 |
| 10:00 ET data / first hour | 08:00 (522d) | 2.20x | 1.33x | 1.83x | 1.16x | 41.6% | 518 |
| London 16:00 (WM/R fix, London close) | 09:00 (480d), 10:00 (42d) | 1.77x | 0.82x | 1.47x | 0.82x | 24.7% | 518 |
| Last regular half-hour 15:30 ET | 13:30 (522d) | 0.73x | 0.86x | 0.74x | 0.90x | 4.7% | 518 |
| NYSE close 16:00 ET (after-hours starts) | 14:00 (522d) | 0.41x | 0.54x | 0.63x | 0.80x | 3.3% | 518 |
| FX rollover 17:00 ET | 15:00 (522d) | 0.10x | 0.23x | 0.59x | 0.96x | 1.0% | 410 |

**Index / oil CFDs**

| Event | Calgary clock | Volume | Vol lift | Range | Range lift | Big moves | Days |
|---|---|---|---|---|---|---|---|
| Tokyo open 09:00 JST | 18:00 (342d), 17:00 (180d) | 0.97x | 2.27x | 0.96x | 1.26x | 9.4% | 515 |
| London open 08:00 London | 01:00 (480d), 02:00 (42d) | 1.44x | 1.83x | 1.17x | 1.37x | 11.8% | 516 |
| US data 08:30 ET (NFP, CPI, claims ...) | 06:30 (522d) | 1.40x | 1.48x | 1.37x | 1.37x | 24.1% | 516 |
| NYSE open 09:30 ET | 07:30 (522d) | 6.74x | 4.82x | 3.17x | 2.33x | 86.7% | 515 |
| 10:00 ET data / first hour | 08:00 (522d) | 5.08x | 3.17x | 2.53x | 1.85x | 69.8% | 515 |
| London 16:00 (WM/R fix, London close) | 09:00 (480d), 10:00 (42d) | 3.41x | 0.69x | 1.82x | 0.73x | 44.5% | 515 |
| Last regular half-hour 15:30 ET | 13:30 (522d) | 2.87x | 1.45x | 1.80x | 1.36x | 41.0% | 496 |
| NYSE close 16:00 ET (after-hours starts) | 14:00 (522d) | 0.89x | 0.44x | 1.04x | 0.79x | 15.0% | 496 |

**US stocks**

| Event | Calgary clock | Volume | Vol lift | Range | Range lift | Big moves | Days |
|---|---|---|---|---|---|---|---|
| US data 08:30 ET (NFP, CPI, claims ...) | 06:30 (522d) | 0.05x | 2.72x | 0.63x | 1.45x | 5.0% | 501 |
| NYSE open 09:30 ET | 07:30 (522d) | 2.61x | 57.10x | 2.83x | 4.49x | 82.2% | 501 |
| 10:00 ET data / first hour | 08:00 (522d) | 1.52x | 20.12x | 1.66x | 1.67x | 31.7% | 501 |
| London 16:00 (WM/R fix, London close) | 09:00 (480d), 10:00 (42d) | 1.05x | 0.70x | 1.12x | 0.69x | 9.2% | 501 |
| Last regular half-hour 15:30 ET | 13:30 (522d) | 2.31x | 3.04x | 1.04x | 1.44x | 6.9% | 501 |
| NYSE close 16:00 ET (after-hours starts) | 14:00 (522d) | 2.84x | 3.13x | 0.56x | 0.73x | 5.6% | 501 |

## NFP Fridays and FOMC days

Same clock bucket on event days vs control days (NFP: other Fridays; FOMC: other days of the same weekday). Ratio = median range on event days / median range on control days, per instrument, then the median across instruments (min-max across instruments in brackets). Few event days: treat as indicative.

| Market | Window | Range ratio | Min-max | Volume ratio | Big moves (event vs control) | Days (event vs control) |
|---|---|---|---|---|---|---|
| Forex + gold | NFP 08:30 ET (06:30 Calgary) | 2.75x | 2.09x-3.15x | 2.84x | 79.2% vs 31.2% | 24 vs 80 |
| Forex + gold | NFP plain first-Friday rule | 2.51x | 2.04x-2.72x | 2.73x | 67.4% vs 31.2% | 23 vs 80 |
| Forex + gold | NFP whole 06:30-08:30 Calgary | 1.74x | 1.31x-1.87x | - | 78.7% vs 36.9% | 24 vs 80 |
| Forex + gold | FOMC 14:00 ET (12:00 Calgary) | 3.18x | 2.93x-3.52x | 3.74x | 88.2% vs 6.9% | 17 vs 188 |
| Forex + gold | FOMC press conf. 14:30 ET (12:30 Calgary) | 5.52x | 4.22x-6.44x | 5.54x | 100.0% vs 5.3% | 17 vs 188 |
| Index / oil CFDs | NFP 08:30 ET (06:30 Calgary) | 2.38x | 1.13x-2.49x | 2.03x | 77.1% vs 23.5% | 24 vs 79 |
| Index / oil CFDs | NFP plain first-Friday rule | 2.31x | 1.14x-2.35x | 1.76x | 65.2% vs 23.5% | 23 vs 79 |
| Index / oil CFDs | NFP whole 06:30-08:30 Calgary | 1.26x | 1.23x-1.32x | - | 91.3% vs 64.6% | 23 vs 79 |
| Index / oil CFDs | FOMC 14:00 ET (12:00 Calgary) | 1.96x | 1.28x-2.63x | 2.00x | 82.4% vs 33.8% | 17 vs 182 |
| Index / oil CFDs | FOMC press conf. 14:30 ET (12:30 Calgary) | 3.93x | 1.33x-4.00x | 2.82x | 97.0% vs 25.0% | 17 vs 182 |
| US stocks | NFP 08:30 ET (06:30 Calgary) | 1.80x | 1.17x-3.77x | 2.20x | 9.1% vs 5.2% | 22 vs 77 |
| US stocks | NFP plain first-Friday rule | 1.66x | 1.03x-3.69x | 2.04x | 9.5% vs 5.2% | 21 vs 77 |
| US stocks | NFP whole 06:30-08:30 Calgary | 1.17x | 0.95x-1.55x | - | 36.4% vs 23.4% | 22 vs 77 |
| US stocks | FOMC 14:00 ET (12:00 Calgary) | 1.49x | 1.06x-3.41x | 1.34x | 17.6% vs 3.5% | 17 vs 184 |
| US stocks | FOMC press conf. 14:30 ET (12:30 Calgary) | 2.36x | 1.47x-4.91x | 1.70x | 29.4% vs 1.9% | 17 vs 184 |

## Daylight-saving: how the Calgary clock moves

Calgary and New York change clocks on the same dates, so **every New York event keeps the same Calgary time all year** (08:30 ET = 06:30, 09:30 ET = 07:30, 14:00 ET = 12:00). London and Tokyo do not:

- **London open** (08:00 London) is **01:00 Calgary** most of the year, but **02:00 Calgary** in the US/UK mismatch weeks (2nd Sunday of March -> last Sunday of March, and last Sunday of October -> 1st Sunday of November). The London close / 16:00 fix moves from 09:00 to 10:00 Calgary in the same weeks.
- **Tokyo open** (09:00 JST, no DST in Japan) is **18:00 Calgary in summer** (Mar-Nov) and **17:00 Calgary in winter** (Nov-Mar).

Measured (forex + gold, Mon-Fri, 480 normal days vs 42 mismatch days):

| Calgary bucket | Volume, normal weeks | Volume, mismatch weeks | Range, normal | Range, mismatch |
|---|---|---|---|---|
| 00:30 | 1.21x | 0.82x | 1.21x | 0.92x |
| 01:00 | 1.48x | 1.13x | 1.37x | 1.18x |
| 01:30 | 1.29x | 1.11x | 1.22x | 1.03x |
| 02:00 | 1.30x | 1.42x | 1.25x | 1.25x |
| 02:30 | 1.14x | 1.15x | 1.05x | 1.05x |
| 09:00 | 1.81x | 1.65x | 1.51x | 1.40x |
| 10:00 | 1.27x | 1.39x | 1.19x | 1.13x |

Tokyo open, Calgary 17:00 vs 18:00 bucket in Japan-winter (Calgary on MST) vs summer (MDT):

| Calgary bucket | Volume, winter (MST) | Volume, summer (MDT) |
|---|---|---|
| 16:30 | 0.32x | 0.27x |
| 17:00 | 0.60x | 0.38x |
| 17:30 | 0.79x | 0.48x |
| 18:00 | 1.19x | 1.11x |
| 18:30 | 1.14x | 0.98x |

## Top weekday x time windows - Forex + gold

Score = sqrt(volume x range), both relative to typical. "Top-10% in" = how many instruments have this cell in their own top 10% of cells (agreement). n = buckets per instrument in the cell (median).

| # | Day | Calgary | NY | Volume (IQR) | Range (IQR) | Big moves | Score | Top-10% in | n |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Fri | 08:00 | 10:00 | 2.47x (2.34-2.56) | 1.95x (1.85-2.03) | 46.6% | 2.2 | 6/6 | 104 |
| 2 | Thu | 08:00 | 10:00 | 2.29x (2.25-2.46) | 1.90x (1.8-2.0) | 44.6% | 2.09 | 6/6 | 102 |
| 3 | Fri | 08:30 | 10:30 | 2.28x (2.15-2.33) | 1.91x (1.75-1.96) | 45.7% | 2.09 | 6/6 | 104 |
| 4 | Thu | 07:30 | 09:30 | 2.33x (2.26-2.53) | 1.81x (1.68-2.0) | 39.7% | 2.06 | 6/6 | 102 |
| 5 | Tue | 08:00 | 10:00 | 2.21x (2.16-2.37) | 1.88x (1.82-1.95) | 46.2% | 2.04 | 6/6 | 105 |
| 6 | Fri | 07:30 | 09:30 | 2.29x (2.12-2.34) | 1.76x (1.73-2.03) | 42.8% | 2.0 | 6/6 | 104 |
| 7 | Thu | 06:30 | 08:30 | 2.11x (2.02-2.3) | 1.90x (1.75-2.18) | 45.6% | 2.0 | 6/6 | 102 |
| 8 | Wed | 07:30 | 09:30 | 2.28x (2.13-2.36) | 1.71x (1.58-1.9) | 32.5% | 1.98 | 6/6 | 103 |
| 9 | Wed | 08:00 | 10:00 | 2.16x (2.09-2.33) | 1.80x (1.71-1.96) | 41.3% | 1.97 | 6/6 | 103 |
| 10 | Thu | 08:30 | 10:30 | 2.11x (2.07-2.18) | 1.76x (1.57-1.81) | 35.3% | 1.93 | 6/6 | 102 |
| 11 | Tue | 08:30 | 10:30 | 2.10x (2.01-2.22) | 1.75x (1.58-1.83) | 33.8% | 1.92 | 6/6 | 105 |
| 12 | Wed | 08:30 | 10:30 | 2.09x (2.02-2.15) | 1.73x (1.55-1.93) | 36.9% | 1.9 | 6/6 | 103 |
| 13 | Tue | 07:30 | 09:30 | 2.12x (2.01-2.28) | 1.63x (1.59-1.8) | 27.6% | 1.86 | 6/6 | 105 |
| 14 | Mon | 07:30 | 09:30 | 2.00x (1.91-2.14) | 1.64x (1.5-1.75) | 28.8% | 1.81 | 6/6 | 104 |
| 15 | Thu | 09:00 | 11:00 | 1.93x (1.86-1.98) | 1.66x (1.51-1.78) | 31.9% | 1.79 | 6/6 | 102 |
| 16 | Mon | 08:00 | 10:00 | 1.91x (1.86-2.0) | 1.65x (1.52-1.69) | 30.3% | 1.78 | 6/6 | 104 |
| 17 | Fri | 06:30 | 08:30 | 1.84x (1.83-2.06) | 1.70x (1.63-1.76) | 40.9% | 1.77 | 6/6 | 104 |
| 18 | Thu | 07:00 | 09:00 | 1.88x (1.86-2.1) | 1.67x (1.55-1.75) | 32.4% | 1.77 | 6/6 | 102 |
| 19 | Fri | 09:00 | 11:00 | 1.88x (1.84-2.02) | 1.59x (1.53-1.7) | 28.6% | 1.73 | 6/6 | 104 |
| 20 | Fri | 07:00 | 09:00 | 1.78x (1.68-1.89) | 1.67x (1.54-1.7) | 31.6% | 1.72 | 6/6 | 104 |

## Top weekday x time windows - US stocks

Score = sqrt(volume x range), both relative to typical. "Top-10% in" = how many instruments have this cell in their own top 10% of cells (agreement). n = buckets per instrument in the cell (median).

| # | Day | Calgary | NY | Volume (IQR) | Range (IQR) | Big moves | Score | Top-10% in | n |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Mon | 07:30 | 09:30 | 2.70x (2.33-2.9) | 2.97x (2.75-3.15) | 87.5% | 2.83 | 28/28 | 96 |
| 2 | Fri | 07:30 | 09:30 | 2.79x (2.32-2.93) | 2.77x (2.62-2.9) | 80.3% | 2.78 | 28/28 | 99 |
| 3 | Thu | 07:30 | 09:30 | 2.57x (2.34-2.85) | 2.88x (2.6-3.03) | 83.2% | 2.72 | 28/28 | 98 |
| 4 | Tue | 07:30 | 09:30 | 2.50x (2.17-2.63) | 2.74x (2.58-2.89) | 79.0% | 2.62 | 28/28 | 105 |
| 5 | Wed | 07:30 | 09:30 | 2.42x (2.17-2.6) | 2.69x (2.58-2.85) | 79.1% | 2.55 | 28/28 | 103 |
| 6 | Thu | 08:00 | 10:00 | 1.60x (1.47-1.69) | 1.74x (1.64-1.83) | 36.7% | 1.67 | 27/28 | 98 |
| 7 | Fri | 08:00 | 10:00 | 1.57x (1.47-1.77) | 1.73x (1.68-1.8) | 34.3% | 1.65 | 27/28 | 99 |
| 8 | Fri | 13:30 | 15:30 | 2.48x (2.12-2.77) | 1.06x (0.94-1.1) | 8.1% | 1.62 | 25/28 | 99 |
| 9 | Thu | 13:30 | 15:30 | 2.35x (1.97-2.66) | 1.08x (1.03-1.15) | 8.2% | 1.6 | 25/28 | 98 |
| 10 | Wed | 13:30 | 15:30 | 2.26x (1.94-2.67) | 1.07x (1.0-1.11) | 8.7% | 1.56 | 26/28 | 103 |
| 11 | Mon | 08:00 | 10:00 | 1.51x (1.4-1.67) | 1.60x (1.58-1.67) | 28.6% | 1.56 | 22/28 | 96 |
| 12 | Tue | 08:00 | 10:00 | 1.49x (1.42-1.57) | 1.61x (1.57-1.67) | 28.6% | 1.55 | 22/28 | 105 |
| 13 | Wed | 08:00 | 10:00 | 1.49x (1.4-1.6) | 1.61x (1.53-1.67) | 28.6% | 1.55 | 20/28 | 103 |
| 14 | Tue | 13:30 | 15:30 | 2.22x (1.85-2.58) | 1.02x (0.97-1.06) | 5.7% | 1.5 | 17/28 | 105 |
| 15 | Mon | 13:30 | 15:30 | 2.17x (1.86-2.63) | 1.02x (0.96-1.08) | 4.2% | 1.49 | 21/28 | 96 |
| 16 | Wed | 14:00 | 16:00 | 2.78x (1.79-4.11) | 0.67x (0.6-0.75) | 9.7% | 1.36 | 14/28 | 103 |
| 17 | Thu | 14:00 | 16:00 | 2.80x (1.75-3.81) | 0.64x (0.57-0.72) | 6.6% | 1.34 | 11/28 | 98 |
| 18 | Thu | 08:30 | 10:30 | 1.23x (1.21-1.29) | 1.41x (1.32-1.44) | 18.4% | 1.32 | 10/28 | 98 |
| 19 | Fri | 08:30 | 10:30 | 1.26x (1.2-1.35) | 1.36x (1.32-1.41) | 18.2% | 1.31 | 11/28 | 99 |
| 20 | Tue | 14:00 | 16:00 | 2.74x (1.85-3.93) | 0.56x (0.51-0.65) | 4.8% | 1.24 | 5/28 | 105 |

![Forex heatmap](market_hours_fx.png)

![Stocks heatmap](market_hours_stocks.png)

## Hour by hour, Mon-Fri pooled - Forex + gold

| Calgary | NY | Volume | Range | Big moves | Score | n |
|---|---|---|---|---|---|---|
| 00:00 | 02:00 | 1.20x | 1.21x | 10.7% | 1.2 | 518 |
| 00:30 | 02:30 | 1.18x | 1.19x | 9.6% | 1.18 | 518 |
| 01:00 | 03:00 | 1.46x | 1.35x | 15.8% | 1.41 | 518 |
| 01:30 | 03:30 | 1.27x | 1.20x | 12.5% | 1.24 | 518 |
| 02:00 | 04:00 | 1.32x | 1.25x | 14.0% | 1.28 | 518 |
| 02:30 | 04:30 | 1.14x | 1.05x | 8.1% | 1.09 | 518 |
| 03:00 | 05:00 | 1.07x | 1.00x | 6.1% | 1.03 | 518 |
| 03:30 | 05:30 | 0.97x | 0.95x | 4.7% | 0.96 | 518 |
| 04:00 | 06:00 | 0.94x | 0.97x | 5.7% | 0.96 | 518 |
| 04:30 | 06:30 | 0.91x | 0.91x | 5.3% | 0.91 | 518 |
| 05:00 | 07:00 | 1.03x | 1.05x | 6.8% | 1.04 | 518 |
| 05:30 | 07:30 | 1.07x | 1.12x | 9.5% | 1.1 | 518 |
| 06:00 | 08:00 | 1.40x | 1.37x | 18.8% | 1.39 | 518 |
| 06:30 | 08:30 | 1.67x | 1.61x | 33.5% | 1.64 | 518 |
| 07:00 | 09:00 | 1.66x | 1.57x | 29.2% | 1.61 | 518 |
| 07:30 | 09:30 | 2.23x | 1.69x | 33.2% | 1.94 | 518 |
| 08:00 | 10:00 | 2.20x | 1.83x | 41.6% | 2.01 | 518 |
| 08:30 | 10:30 | 2.11x | 1.74x | 35.9% | 1.91 | 518 |
| 09:00 | 11:00 | 1.79x | 1.50x | 25.7% | 1.64 | 518 |
| 09:30 | 11:30 | 1.49x | 1.28x | 15.5% | 1.38 | 518 |
| 10:00 | 12:00 | 1.28x | 1.18x | 10.4% | 1.23 | 518 |
| 10:30 | 12:30 | 1.11x | 1.02x | 7.6% | 1.06 | 518 |
| 11:00 | 13:00 | 1.03x | 0.98x | 7.5% | 1.0 | 518 |
| 11:30 | 13:30 | 0.92x | 0.91x | 5.9% | 0.91 | 518 |
| 12:00 | 14:00 | 0.91x | 0.86x | 8.0% | 0.88 | 518 |
| 12:30 | 14:30 | 0.86x | 0.82x | 8.2% | 0.84 | 518 |
| 13:00 | 15:00 | 0.74x | 0.79x | 7.3% | 0.77 | 518 |
| 13:30 | 15:30 | 0.73x | 0.74x | 4.7% | 0.74 | 518 |
| 14:00 | 16:00 | 0.41x | 0.63x | 3.3% | 0.5 | 518 |
| 14:30 | 16:30 | 0.43x | 0.59x | 2.3% | 0.5 | 518 |
| 15:00 | 17:00 | 0.10x | 0.59x | 1.0% | 0.24 | 414 |
| 15:30 | 17:30 | 0.26x | 0.53x | 0.7% | 0.37 | 414 |
| 16:00 | 18:00 | 0.27x | 0.65x | 3.4% | 0.42 | 414 |
| 16:30 | 18:30 | 0.26x | 0.51x | 2.5% | 0.37 | 414 |
| 17:00 | 19:00 | 0.40x | 0.64x | 2.9% | 0.51 | 414 |
| 17:30 | 19:30 | 0.50x | 0.70x | 3.0% | 0.59 | 414 |
| 18:00 | 20:00 | 1.09x | 1.06x | 6.9% | 1.08 | 414 |
| 18:30 | 20:30 | 0.99x | 0.96x | 6.3% | 0.97 | 414 |
| 19:00 | 21:00 | 1.12x | 1.06x | 8.9% | 1.09 | 414 |
| 19:30 | 21:30 | 1.02x | 0.99x | 6.8% | 1.01 | 414 |
| 20:00 | 22:00 | 0.89x | 0.88x | 3.7% | 0.88 | 414 |
| 20:30 | 22:30 | 0.80x | 0.80x | 3.3% | 0.8 | 414 |
| 21:00 | 23:00 | 0.74x | 0.76x | 2.4% | 0.75 | 414 |
| 21:30 | 23:30 | 0.67x | 0.69x | 1.7% | 0.68 | 414 |
| 22:00 | 00:00 | 0.66x | 0.66x | 2.5% | 0.66 | 414 |
| 22:30 | 00:30 | 0.67x | 0.72x | 2.3% | 0.69 | 414 |
| 23:00 | 01:00 | 0.76x | 0.86x | 3.5% | 0.81 | 414 |
| 23:30 | 01:30 | 0.87x | 0.92x | 5.0% | 0.9 | 414 |

## Hour by hour, Mon-Fri pooled - Index / oil CFDs

| Calgary | NY | Volume | Range | Big moves | Score | n |
|---|---|---|---|---|---|---|
| 00:00 | 02:00 | 0.77x | 0.84x | 3.8% | 0.81 | 516 |
| 00:30 | 02:30 | 0.68x | 0.81x | 3.9% | 0.75 | 516 |
| 01:00 | 03:00 | 1.38x | 1.13x | 11.7% | 1.25 | 516 |
| 01:30 | 03:30 | 1.07x | 0.95x | 8.7% | 1.01 | 516 |
| 02:00 | 04:00 | 1.38x | 1.13x | 11.7% | 1.25 | 516 |
| 02:30 | 04:30 | 0.98x | 0.90x | 6.4% | 0.94 | 516 |
| 03:00 | 05:00 | 0.89x | 0.87x | 4.1% | 0.88 | 516 |
| 03:30 | 05:30 | 0.78x | 0.79x | 4.0% | 0.79 | 516 |
| 04:00 | 06:00 | 0.82x | 0.87x | 5.3% | 0.85 | 516 |
| 04:30 | 06:30 | 0.79x | 0.90x | 6.7% | 0.85 | 516 |
| 05:00 | 07:00 | 1.02x | 1.06x | 10.2% | 1.04 | 516 |
| 05:30 | 07:30 | 0.95x | 1.00x | 7.7% | 0.97 | 516 |
| 06:00 | 08:00 | 1.22x | 1.12x | 11.4% | 1.17 | 516 |
| 06:30 | 08:30 | 1.40x | 1.37x | 24.1% | 1.38 | 517 |
| 07:00 | 09:00 | 1.60x | 1.37x | 19.1% | 1.48 | 517 |
| 07:30 | 09:30 | 6.74x | 3.17x | 86.7% | 4.62 | 515 |
| 08:00 | 10:00 | 5.08x | 2.53x | 69.8% | 3.59 | 515 |
| 08:30 | 10:30 | 4.03x | 2.22x | 57.6% | 2.99 | 515 |
| 09:00 | 11:00 | 3.40x | 1.82x | 43.9% | 2.49 | 515 |
| 09:30 | 11:30 | 2.93x | 1.73x | 39.9% | 2.25 | 515 |
| 10:00 | 12:00 | 2.54x | 1.59x | 33.0% | 2.01 | 515 |
| 10:30 | 12:30 | 2.29x | 1.50x | 30.6% | 1.85 | 515 |
| 11:00 | 13:00 | 2.23x | 1.51x | 29.1% | 1.84 | 501 |
| 11:30 | 13:30 | 2.14x | 1.43x | 27.9% | 1.75 | 496 |
| 12:00 | 14:00 | 2.40x | 1.40x | 29.0% | 1.83 | 496 |
| 12:30 | 14:30 | 1.97x | 1.32x | 24.8% | 1.61 | 496 |
| 13:00 | 15:00 | 2.03x | 1.31x | 24.8% | 1.63 | 496 |
| 13:30 | 15:30 | 2.87x | 1.80x | 41.0% | 2.27 | 496 |
| 14:00 | 16:00 | 0.89x | 1.04x | 15.0% | 0.96 | 496 |
| 14:30 | 16:30 | 0.42x | 0.58x | 4.6% | 0.49 | 496 |
| 16:00 | 18:00 | 0.47x | 0.84x | 5.9% | 0.63 | 413 |
| 16:30 | 18:30 | 0.38x | 0.63x | 3.8% | 0.49 | 413 |
| 17:00 | 19:00 | 0.46x | 0.68x | 4.8% | 0.56 | 413 |
| 17:30 | 19:30 | 0.48x | 0.65x | 3.0% | 0.56 | 413 |
| 18:00 | 20:00 | 0.93x | 0.93x | 7.9% | 0.93 | 413 |
| 18:30 | 20:30 | 0.76x | 0.74x | 5.3% | 0.75 | 413 |
| 19:00 | 21:00 | 0.82x | 0.79x | 5.4% | 0.8 | 413 |
| 19:30 | 21:30 | 0.67x | 0.73x | 3.8% | 0.7 | 413 |
| 20:00 | 22:00 | 0.54x | 0.65x | 2.7% | 0.59 | 412 |
| 20:30 | 22:30 | 0.48x | 0.60x | 1.9% | 0.54 | 412 |
| 21:00 | 23:00 | 0.42x | 0.57x | 0.8% | 0.49 | 412 |
| 21:30 | 23:30 | 0.39x | 0.52x | 0.7% | 0.45 | 412 |
| 22:00 | 00:00 | 0.38x | 0.52x | 1.7% | 0.45 | 412 |
| 22:30 | 00:30 | 0.37x | 0.53x | 1.3% | 0.44 | 412 |
| 23:00 | 01:00 | 0.49x | 0.63x | 2.7% | 0.56 | 412 |
| 23:30 | 01:30 | 0.58x | 0.70x | 2.4% | 0.64 | 412 |

## Hour by hour, Mon-Fri pooled - US stocks

| Calgary | NY | Volume | Range | Big moves | Score | n |
|---|---|---|---|---|---|---|
| 02:00 | 04:00 | 0.02x | 0.88x | 10.7% | 0.12 | 500 |
| 02:30 | 04:30 | 0.01x | 0.37x | 0.7% | 0.05 | 501 |
| 03:00 | 05:00 | 0.01x | 0.34x | 0.5% | 0.04 | 501 |
| 03:30 | 05:30 | 0.01x | 0.32x | 0.4% | 0.04 | 501 |
| 04:00 | 06:00 | 0.01x | 0.34x | 1.3% | 0.05 | 501 |
| 04:30 | 06:30 | 0.01x | 0.36x | 1.5% | 0.05 | 501 |
| 05:00 | 07:00 | 0.02x | 0.55x | 3.1% | 0.11 | 501 |
| 05:30 | 07:30 | 0.02x | 0.43x | 2.0% | 0.09 | 501 |
| 06:00 | 08:00 | 0.06x | 1.34x | 27.8% | 0.29 | 501 |
| 06:30 | 08:30 | 0.05x | 0.63x | 5.0% | 0.17 | 501 |
| 07:00 | 09:00 | 0.08x | 0.99x | 10.8% | 0.27 | 501 |
| 07:30 | 09:30 | 2.61x | 2.83x | 82.2% | 2.71 | 501 |
| 08:00 | 10:00 | 1.52x | 1.66x | 31.7% | 1.59 | 501 |
| 08:30 | 10:30 | 1.19x | 1.31x | 15.2% | 1.25 | 501 |
| 09:00 | 11:00 | 1.07x | 1.14x | 9.4% | 1.1 | 501 |
| 09:30 | 11:30 | 0.91x | 1.00x | 5.6% | 0.95 | 501 |
| 10:00 | 12:00 | 0.82x | 0.92x | 3.9% | 0.87 | 501 |
| 10:30 | 12:30 | 0.75x | 0.85x | 3.1% | 0.8 | 501 |
| 11:00 | 13:00 | 0.73x | 0.82x | 3.1% | 0.77 | 501 |
| 11:30 | 13:30 | 0.71x | 0.78x | 2.3% | 0.74 | 501 |
| 12:00 | 14:00 | 0.75x | 0.78x | 2.8% | 0.77 | 501 |
| 12:30 | 14:30 | 0.76x | 0.73x | 2.5% | 0.74 | 501 |
| 13:00 | 15:00 | 0.91x | 0.77x | 3.2% | 0.84 | 501 |
| 13:30 | 15:30 | 2.31x | 1.04x | 6.9% | 1.55 | 501 |
| 14:00 | 16:00 | 2.84x | 0.56x | 5.6% | 1.26 | 501 |
| 14:30 | 16:30 | 0.04x | 0.34x | 3.0% | 0.12 | 501 |
| 15:00 | 17:00 | 0.02x | 0.26x | 2.0% | 0.06 | 496 |
| 15:30 | 17:30 | 0.01x | 0.22x | 1.5% | 0.05 | 496 |
| 16:00 | 18:00 | 0.01x | 0.28x | 1.5% | 0.05 | 496 |
| 16:30 | 18:30 | 0.01x | 0.23x | 0.6% | 0.04 | 496 |
| 17:00 | 19:00 | 0.01x | 0.23x | 0.2% | 0.04 | 496 |
| 17:30 | 19:30 | 0.01x | 0.26x | 0.2% | 0.05 | 496 |

## Each instrument's own peaks (Mon-Fri pooled, 30-minute buckets)

| Instrument | Class | Data | Buckets | Top 3 Calgary buckets | Quietest |
|---|---|---|---|---|---|
| EUR_USD | FX | 2024-10-28 - 2026-10-28 | 24864 | 08:00 (2.39x vol, 1.87x range); 08:30 (2.38x vol, 1.77x range); 07:30 (2.33x vol, 1.72x range) | 15:00 |
| GBP_USD | FX | 2024-10-28 - 2026-10-28 | 24864 | 08:00 (2.09x vol, 1.93x range); 08:30 (2.01x vol, 1.84x range); 07:30 (2.07x vol, 1.65x range) | 15:00 |
| USD_JPY | FX | 2024-10-28 - 2026-10-28 | 24864 | 08:00 (2.09x vol, 1.6x range); 07:30 (2.06x vol, 1.52x range); 08:30 (1.94x vol, 1.51x range) | 15:00 |
| AUD_USD | FX | 2024-10-28 - 2026-10-28 | 24864 | 08:00 (2.18x vol, 1.71x range); 07:30 (2.21x vol, 1.64x range); 08:30 (2.06x vol, 1.7x range) | 15:00 |
| USD_CAD | FX | 2024-10-28 - 2026-10-28 | 24864 | 07:30 (2.25x vol, 2.0x range); 08:00 (2.23x vol, 1.99x range); 08:30 (2.16x vol, 1.94x range) | 15:00 |
| XAU_USD | FX | 2024-10-28 - 2026-10-28 | 23642 | 07:30 (2.9x vol, 1.95x range); 08:00 (2.66x vol, 1.79x range); 08:30 (2.16x vol, 1.49x range) | 14:30 |
| SPX500_USD | CFD | 2024-10-28 - 2026-10-28 | 23585 | 07:30 (5.97x vol, 2.94x range); 08:00 (4.23x vol, 2.46x range); 08:30 (3.23x vol, 2.23x range) | 14:30 |
| US30_USD | CFD | 2024-10-28 - 2026-10-28 | 23584 | 07:30 (9.59x vol, 3.96x range); 08:00 (6.73x vol, 2.82x range); 08:30 (5.42x vol, 2.37x range) | 22:00 |
| NAS100_USD | CFD | 2024-10-28 - 2026-10-28 | 23583 | 07:30 (7.5x vol, 3.4x range); 08:00 (5.92x vol, 2.61x range); 08:30 (4.82x vol, 2.21x range) | 14:30 |
| WTICO_USD | CFD | 2024-10-28 - 2026-10-28 | 23614 | 07:30 (2.8x vol, 1.84x range); 07:00 (2.56x vol, 1.79x range); 09:00 (2.68x vol, 1.71x range) | 16:30 |
| AAPL | Stock | 2024-10-29 - 2026-10-28 | 16001 | 07:30 (2.7x vol, 2.75x range); 14:00 (4.8x vol, 0.65x range); 13:30 (2.28x vol, 1.19x range) | 02:30 |
| IWM | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.16x vol, 2.12x range); 08:00 (1.43x vol, 1.64x range); 13:30 (2.29x vol, 0.92x range) | 16:30 |
| MSFT | Stock | 2024-10-29 - 2026-10-28 | 16000 | 07:30 (2.63x vol, 2.81x range); 14:00 (5.06x vol, 0.72x range); 13:30 (2.45x vol, 1.17x range) | 03:30 |
| NVDA | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.75x vol, 2.51x range); 08:00 (1.65x vol, 1.58x range); 13:30 (1.65x vol, 1.13x range) | 16:30 |
| QQQ | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.15x vol, 2.03x range); 08:00 (1.51x vol, 1.53x range); 13:30 (2.05x vol, 1.0x range) | 15:30 |
| SPY | Stock | 2024-10-29 - 2026-10-28 | 16014 | 13:30 (2.98x vol, 1.08x range); 07:30 (1.86x vol, 1.69x range); 08:00 (1.32x vol, 1.41x range) | 02:30 |
| AMD | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.99x vol, 2.92x range); 08:00 (1.71x vol, 1.8x range); 08:30 (1.32x vol, 1.36x range) | 03:30 |
| AMZN | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.7x vol, 2.69x range); 08:00 (1.51x vol, 1.61x range); 13:30 (2.14x vol, 1.07x range) | 03:30 |
| AVGO | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.72x vol, 2.83x range); 14:00 (4.61x vol, 0.62x range); 08:00 (1.53x vol, 1.68x range) | 03:30 |
| GOOGL | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.85x vol, 2.82x range); 08:00 (1.58x vol, 1.65x range); 13:30 (2.33x vol, 1.04x range) | 17:00 |
| META | Stock | 2024-10-29 - 2026-10-28 | 15997 | 07:30 (2.91x vol, 2.92x range); 08:00 (1.63x vol, 1.65x range); 13:30 (2.07x vol, 1.08x range) | 02:30 |
| TSLA | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.61x vol, 2.56x range); 08:00 (1.74x vol, 1.69x range); 08:30 (1.36x vol, 1.3x range) | 03:30 |
| BAC | Stock | 2024-10-29 - 2026-10-28 | 15868 | 07:30 (2.2x vol, 2.89x range); 13:30 (2.7x vol, 1.07x range); 08:00 (1.38x vol, 1.67x range) | 03:30 |
| JPM | Stock | 2024-10-29 - 2026-10-28 | 15267 | 07:30 (2.26x vol, 2.83x range); 13:30 (2.83x vol, 1.04x range); 14:00 (5.14x vol, 0.52x range) | 02:30 |
| LLY | Stock | 2024-10-29 - 2026-10-28 | 14957 | 07:30 (2.48x vol, 3.07x range); 13:30 (2.65x vol, 1.06x range); 08:00 (1.45x vol, 1.71x range) | 02:30 |
| NFLX | Stock | 2024-10-29 - 2026-10-28 | 15371 | 07:30 (2.6x vol, 3.02x range); 08:00 (1.52x vol, 1.67x range); 13:30 (2.35x vol, 1.05x range) | 03:00 |
| UNH | Stock | 2024-10-29 - 2026-10-28 | 15242 | 07:30 (2.29x vol, 3.16x range); 13:30 (2.51x vol, 1.07x range); 08:00 (1.38x vol, 1.61x range) | 02:30 |
| XOM | Stock | 2024-10-29 - 2026-10-28 | 15737 | 07:30 (2.07x vol, 2.85x range); 13:30 (3.68x vol, 1.13x range); 14:00 (4.5x vol, 0.53x range) | 02:30 |
| BA | Stock | 2024-10-29 - 2026-10-28 | 15820 | 07:30 (2.3x vol, 2.65x range); 08:00 (1.49x vol, 1.64x range); 13:30 (2.48x vol, 0.97x range) | 02:30 |
| COST | Stock | 2024-10-29 - 2026-10-28 | 13853 | 07:30 (2.35x vol, 2.78x range); 13:30 (3.06x vol, 1.12x range); 08:00 (1.58x vol, 1.71x range) | 02:30 |
| INTC | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.77x vol, 2.99x range); 08:00 (1.71x vol, 1.68x range); 13:30 (1.85x vol, 1.0x range) | 16:30 |
| MU | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (3.18x vol, 2.92x range); 08:00 (1.89x vol, 1.79x range); 13:30 (1.9x vol, 0.99x range) | 15:30 |
| PLTR | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.9x vol, 2.96x range); 08:00 (1.79x vol, 1.79x range); 08:30 (1.31x vol, 1.33x range) | 16:30 |
| WMT | Stock | 2024-10-29 - 2026-10-28 | 15854 | 07:30 (2.24x vol, 2.86x range); 13:30 (2.9x vol, 1.13x range); 14:00 (4.34x vol, 0.65x range) | 03:30 |
| COIN | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.73x vol, 2.53x range); 08:00 (1.64x vol, 1.64x range); 13:30 (1.93x vol, 0.93x range) | 15:30 |
| CRM | Stock | 2024-10-29 - 2026-10-28 | 15510 | 07:30 (2.42x vol, 3.13x range); 13:30 (2.75x vol, 1.02x range); 08:00 (1.49x vol, 1.82x range) | 03:00 |
| ORCL | Stock | 2024-10-29 - 2026-10-28 | 15904 | 07:30 (2.43x vol, 2.95x range); 08:00 (1.56x vol, 1.68x range); 13:30 (2.14x vol, 0.96x range) | 03:00 |
| SMCI | Stock | 2024-10-29 - 2026-10-28 | 16002 | 07:30 (2.82x vol, 2.53x range); 08:00 (1.73x vol, 1.65x range); 13:30 (1.78x vol, 0.97x range) | 03:30 |

## Is the pattern stable?

First half vs second half of the sample, same weekday x 30-minute cells. Spearman 1.0 = identical ordering; top-15 overlap = how many of the 15 busiest cells are the same in both halves.

| Market | Split at | Cells | Spearman (score) | Spearman (volume) | Spearman (range) | Top-15 overlap |
|---|---|---|---|---|---|---|
| Forex + gold | 2025-10-29 | 240 | 0.983 | 0.978 | 0.968 | 12/15 |
| US stocks | 2025-10-29 | 160 | 0.986 | 0.99 | 0.957 | 14/15 |

## Method

- Forex / gold / CFDs: OANDA v20 **M15 mid candles** (practice server), tick volume. Stocks: Alpaca **15-minute bars**, feed sip, split-adjusted, pre-market (04:00 ET) to after-hours (20:00 ET); a missing 15-minute bar inside a trading day = no trade (0 volume, 0 range).
- Bars are summed into 30-minute buckets (tables and heatmaps) and labelled by the Calgary clock time at which the bucket starts, with the weekday in Calgary.
- Normalisation per instrument and calendar month (so a volatile month or a busy instrument does not dominate): relative volume = bucket volume / the month's median bucket volume; relative range = bucket high-low / the month's median bucket high-low. Forex: median over all 24 h; stocks: over the regular session only. A **big move** = range > 2x that median.
- Each instrument first gets its own median per cell; the tables show the median across instruments (each counts once) and the inter-quartile range across instruments.
- Events are measured on each date at their own local time; NFP = first Friday of the month (holiday Fridays removed), plus a corrected list with releases known to have moved (2025 shutdown, July 4th week, Jan 2026), from memory - check bls.gov. FOMC statement dates for 2024-2026 are hard-coded from the Federal Reserve schedule (from memory - check federalreserve.gov).

## Caveats

- **OANDA volume is tick volume** (number of price updates on OANDA's feed), not exchange or interbank volume. It tracks real activity well in shape but not in size. Practice-server prices.
- Stock volume is consolidated (SIP) share volume when feed = sip; with the iex fallback it is IEX only.
- Relative numbers are medians: a typical day. The biggest single moves (surprise data, geopolitics) are rare and do not show in a median - the big-move share is the better guide for those.
- About two years of data; each weekday x 30-minute cell holds ~100 buckets per instrument; FOMC days are ~16 and NFP days ~24, so their ratios are indicative, not precise. Differences of 0.1-0.2x between neighbouring cells are within noise.
- Calendar effects (holidays, half days) are left in; medians limit their pull.
- High activity means bigger moves in both directions and wider spreads at some times (the 15:00 Calgary rollover). It says when to look, not which way to trade.
