# Arrival study, round 2: what is missing vs the mentor?

Generated 2026-10-30 16:11 UTC by `tools/research/arrival_study/round2.py` (GitHub Actions, OANDA practice). 115 FX / CFD instruments (OANDA), runtime 8 min.

The plain-English answer, the recommended rules and the alert changes are in [Round2.md](Round2.md); this file is the generated evidence (every table), rebuilt on each run.

## 1. Kevin's real calls, back-tested

880 calls in `tools/kevin_daily/calls.json` (63 recorded breakdowns, plan days 2026-07-09 … 2026-10-29). 426 name a price (a zone / limit); the rest are trend-line / context calls (direction only). Zone calls: traded 349, price off 56, no instrument 16, zone already broken 5. Median zone height used when he gave no distal (ATR of his zone TF): D1 0.80, H1 0.98, H4 0.96, M5 7.28, W1 0.91.

Rules: limit at his proximal placed at the recording time (read as US Eastern: never early), valid for the plan day + 2 trading days, stop = his distal + the stop-rule buffer, simulated on OANDA **M5** bars, spread charged; he states almost no targets, so the target is a variant.

**Kevin, every zone call, by management**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| fixed 1R | 349 | 116 (33%) | 116 | 50 | -0.09 | -0.28 … +0.09 | -0.28 … +0.07 | 0.83 | -10.7 | 23.8 |
| fixed 2R | 349 | 116 (33%) | 115 | 36 | -0.02 | -0.27 … +0.25 | -0.29 … +0.22 | 0.97 | -2.8 | 21.4 |
| fixed 3R | 349 | 116 (33%) | 114 | 25 | -0.12 | -0.44 … +0.22 | -0.54 … +0.26 | 0.85 | -14.0 | 34.8 |
| half at 1R + break-even, rest 3R | 349 | 116 (33%) | 115 | 48 | -0.11 | -0.31 … +0.12 | -0.33 … +0.09 | 0.81 | -12.2 | 24.9 |
| break-even at 1R, then 1R trail | 349 | 116 (33%) | 116 | 42 | -0.09 | -0.31 … +0.13 | -0.29 … +0.09 | 0.84 | -10.3 | 23.3 |
| nearest opposite zone (his TF) | 349 | 81 (23%) | 79 | 22 | -0.08 | -0.50 … +0.39 | -0.61 … +0.43 | 0.90 | -6.6 | 25.1 |
| fixed 2R, plan day only | 349 | 59 (17%) | 59 | 29 | -0.25 | -0.61 … +0.10 | -0.54 … +0.02 | 0.67 | -14.9 | 21.2 |

**Kevin, fixed 2R, by zone TF**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| M5 | 2 | 2 (100%) | 2 | 0 | -1.06 | n<20 | – | 0.00 | -2.1 | 2.1 |
| M15 | 1 | 1 (100%) | 1 | 100 | +1.79 | n<20 | – | ∞ | +1.8 | 0.0 |
| H1 | 147 | 69 (47%) | 69 | 38 | +0.03 | -0.31 … +0.38 | -0.27 … +0.29 | 1.04 | +1.8 | 12.2 |
| H4 | 190 | 39 (21%) | 38 | 34 | -0.03 | -0.51 … +0.44 | -0.64 … +0.44 | 0.95 | -1.3 | 12.8 |
| D1 | 8 | 4 (50%) | 4 | 0 | -0.80 | n<20 | – | 0.00 | -3.2 | 3.2 |
| W1 | 1 | 1 (100%) | 1 | 100 | +0.25 | n<20 | – | ∞ | +0.2 | 0.0 |

**Kevin, fixed 2R, by direction**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| long | 202 | 66 (33%) | 66 | 35 | -0.05 | -0.38 … +0.27 | -0.46 … +0.43 | 0.92 | -3.6 | 17.8 |
| short | 147 | 50 (34%) | 49 | 37 | +0.02 | -0.36 … +0.39 | -0.35 … +0.35 | 1.03 | +0.8 | 13.0 |

**Kevin, fixed 2R, by instrument**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| AUDUSD | 43 | 12 (28%) | 12 | 50 | +0.40 | n<20 | – | 1.72 | +4.7 | 3.2 |
| CADJPY | 14 | 5 (36%) | 5 | 80 | +1.29 | n<20 | – | 6.51 | +6.5 | 1.2 |
| EURGBP | 26 | 5 (19%) | 5 | 60 | +0.63 | n<20 | – | 2.41 | +3.1 | 2.2 |
| EURJPY | 14 | 7 (50%) | 7 | 29 | -0.27 | n<20 | – | 0.66 | -1.9 | 5.6 |
| EURUSD | 32 | 15 (47%) | 15 | 13 | -0.70 | n<20 | – | 0.26 | -10.5 | 12.5 |
| GBPJPY | 21 | 9 (43%) | 8 | 50 | +0.40 | n<20 | – | 1.75 | +3.2 | 3.3 |
| GBPUSD | 31 | 5 (16%) | 5 | 20 | -0.52 | n<20 | – | 0.42 | -2.6 | 4.5 |
| NATGAS | 8 | 4 (50%) | 4 | 0 | -1.18 | n<20 | – | 0.00 | -4.7 | 4.7 |
| SPX500 | 48 | 12 (25%) | 12 | 42 | +0.23 | n<20 | – | 1.38 | +2.7 | 6.1 |
| UK100 | 1 | 1 (100%) | 1 | 0 | -1.06 | n<20 | – | 0.00 | -1.1 | 1.1 |
| USDCAD | 31 | 15 (48%) | 15 | 27 | -0.36 | n<20 | – | 0.52 | -5.3 | 11.0 |
| USDCHF | 24 | 2 (8%) | 2 | 50 | +0.42 | n<20 | – | 1.78 | +0.8 | 1.1 |
| USDJPY | 17 | 2 (12%) | 2 | 0 | -1.05 | n<20 | – | 0.00 | -2.1 | 2.1 |
| WTICOUSD | 6 | 3 (50%) | 3 | 100 | +1.95 | n<20 | – | ∞ | +5.8 | 0.0 |
| XAUUSD | 33 | 19 (58%) | 19 | 32 | -0.08 | n<20 | – | 0.89 | -1.5 | 4.1 |

**Kevin, fixed 2R, by his confidence**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| high | 268 | 82 (31%) | 81 | 35 | -0.06 | -0.37 … +0.25 | -0.30 … +0.16 | 0.91 | -4.9 | 14.6 |
| med | 72 | 27 (38%) | 27 | 41 | +0.13 | -0.41 … +0.69 | -0.50 … +0.80 | 1.21 | +3.6 | 6.6 |
| low | 9 | 7 (78%) | 7 | 29 | -0.20 | n<20 | – | 0.74 | -1.4 | 3.2 |

**Kevin, fixed 2R, by entry type**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| limit at proximal | 322 | 101 (31%) | 100 | 35 | -0.05 | -0.31 … +0.23 | -0.27 … +0.15 | 0.93 | -4.9 | 18.6 |
| confirmation / other (tested as a limit) | 27 | 15 (56%) | 15 | 40 | +0.14 | n<20 | – | 1.22 | +2.1 | 5.5 |

**Kevin, fixed 2R, distal stated vs estimated**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| distal stated | 223 | 74 (33%) | 74 | 45 | +0.25 | -0.09 … +0.59 | -0.17 … +0.65 | 1.44 | +18.7 | 11.5 |
| distal estimated | 126 | 42 (33%) | 41 | 20 | -0.52 | -0.88 … -0.15 | -0.88 … -0.08 | 0.41 | -21.5 | 26.7 |

**Kevin, fixed 2R, by month of the plan day**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-07 | 45 | 20 (44%) | 20 | 55 | +0.53 | -0.08 … +1.12 | – | 2.23 | +10.7 | 3.2 |
| 2026-08 | 86 | 21 (24%) | 21 | 33 | -0.10 | -0.68 … +0.50 | – | 0.87 | -2.1 | 10.2 |
| 2026-09 | 110 | 37 (34%) | 37 | 38 | +0.04 | -0.37 … +0.53 | – | 1.06 | +1.5 | 12.5 |
| 2026-10 | 108 | 38 (35%) | 37 | 24 | -0.35 | -0.75 … +0.06 | – | 0.57 | -12.9 | 15.6 |

**His own reports in later sessions vs the back-test (fixed 2R)**

| he said | back-test win | loss | flat | open | cancelled / not filled |
|---|---|---|---|---|---|
| won | 15 | 4 | 0 | 0 | 18 |
| lost | 3 | 15 | 0 | 0 | 6 |
| breakeven | 0 | 1 | 0 | 0 | 1 |

He followed up on 116 of 880 calls; wins are mentioned more often than losses (82 won / 38 lost / 7 break-even reported in the transcripts): a reporting bias on top of the selection bias.

**Direction test (every call with a direction): from the recording, 1 ATR (his TF) with the call before 1 ATR against it, within 3 trading days**

| calls | n | with first | against first | neither | hit rate |
|---|---|---|---|---|---|
| all | 826 | 413 | 394 | 19 | 51% |
| zone calls (with a price) | 410 | 215 | 188 | 7 | 53% |
| trend-line / context calls | 416 | 198 | 206 | 12 | 49% |
| his confidence high | 512 | 253 | 250 | 9 | 50% |

## 2. Our arrivals again, on finer bars and with other management

Round-1 rules (live code, re-read at the bar each arrival became true), MN / W1 since 2005, D1 / H4 since 2010 (H4 now full history), simulated on finer bars (H4 -> M15, D1 -> H1, W1 -> H4, MN -> D1). Trades that time out (100 TF bars) are counted at their exit price (round 1 left them out).

**All arrivals by management**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| plan's target on round-1 bars (check) | 2022 | 851 (42%) | 850 | 19 | -0.16 | -0.32 … +0.01 | -0.33 … +0.01 | 0.82 | -139.3 | 179.9 |
| plan's target (round 1) | 2022 | 851 (42%) | 850 | 19 | -0.15 | -0.29 … +0.02 | -0.32 … +0.04 | 0.84 | -123.5 | 164.0 |
| fixed 2R | 2022 | 776 (38%) | 776 | 34 | -0.10 | -0.20 … -0.01 | -0.21 … +0.00 | 0.86 | -78.8 | 96.0 |
| fixed 3R | 2022 | 776 (38%) | 775 | 23 | -0.22 | -0.33 … -0.11 | -0.34 … -0.10 | 0.74 | -172.2 | 198.5 |
| nearest opposite zone | 2022 | 693 (34%) | 693 | 29 | -0.16 | -0.29 … -0.03 | -0.30 … -0.02 | 0.79 | -113.4 | 146.8 |
| half at 1R + break-even, rest 3R | 2022 | 776 (38%) | 775 | 50 | -0.13 | -0.21 … -0.06 | -0.21 … -0.05 | 0.76 | -103.8 | 117.4 |
| break-even at 1R, then 1R trail | 2022 | 776 (38%) | 776 | 43 | -0.20 | -0.27 … -0.12 | -0.27 … -0.11 | 0.65 | -152.3 | 163.9 |

**Arrivals, fixed 2R, by TF**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| MN | 20 | 4 (20%) | 4 | 25 | -0.25 | n<20 | – | 0.66 | -1.0 | 2.0 |
| W1 | 98 | 51 (52%) | 51 | 27 | -0.21 | -0.57 … +0.18 | -0.62 … +0.21 | 0.72 | -10.8 | 19.7 |
| D1 | 356 | 134 (38%) | 134 | 40 | +0.14 | -0.11 … +0.41 | -0.15 … +0.42 | 1.23 | +19.2 | 10.7 |
| H4 | 1548 | 587 (38%) | 587 | 33 | -0.15 | -0.26 … -0.03 | -0.27 … -0.02 | 0.80 | -86.1 | 89.8 |

**Arrivals, fixed 2R, demand vs supply**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| demand | 884 | 320 (36%) | 320 | 37 | -0.01 | -0.17 … +0.15 | -0.19 … +0.15 | 0.98 | -4.5 | 32.8 |
| supply | 1138 | 456 (40%) | 456 | 32 | -0.16 | -0.29 … -0.05 | -0.30 … -0.02 | 0.78 | -74.3 | 76.3 |

**Arrivals, fixed 2R, train vs test years**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| before 2020-01-01 | 1233 | 474 (38%) | 474 | 35 | -0.07 | -0.19 … +0.06 | -0.20 … +0.06 | 0.90 | -33.0 | 52.1 |
| 2020-01-01 on | 789 | 302 (38%) | 302 | 32 | -0.15 | -0.32 … -0.01 | -0.33 … +0.02 | 0.80 | -45.8 | 57.8 |

## 3. LTF confirmation entries (finally with data)

After price reaches the arrival zone: the first LTF arrival of the same side at the zone (within the TF zone +/- half its height, known after the first touch, within 10 TF bars after the expiry), limit at its proximal, LTF stop rule (tight). "2R, TF stop" keeps the TF arrival's stop with the LTF entry.

**LTF confirmation entries by management**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| plan's target (round 1) | 28 | 10 (36%) | 10 | 0 | -1.39 | n<20 | – | 0.00 | -13.9 | 13.9 |
| fixed 2R | 28 | 8 (29%) | 8 | 25 | -0.58 | n<20 | – | 0.39 | -4.6 | 5.1 |
| fixed 3R | 28 | 8 (29%) | 8 | 25 | -0.33 | n<20 | – | 0.65 | -2.6 | 5.1 |
| nearest opposite zone | 28 | 8 (29%) | 8 | 0 | -1.33 | n<20 | – | 0.00 | -10.6 | 10.6 |
| half at 1R + break-even, rest 3R | 28 | 8 (29%) | 8 | 50 | -0.05 | n<20 | – | 0.84 | -0.4 | 2.4 |
| break-even at 1R, then 1R trail | 28 | 8 (29%) | 8 | 38 | -0.17 | n<20 | – | 0.65 | -1.4 | 2.6 |
| 2R with the TF stop | 28 | 8 (29%) | 8 | 12 | -0.73 | n<20 | – | 0.25 | -5.9 | 6.8 |

**LTF confirmation, fixed 2R, by TF pair**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| D1->H1 | 8 | 2 (25%) | 2 | 50 | +0.30 | n<20 | – | 1.55 | +0.6 | 1.1 |
| H4->M15 | 17 | 5 (29%) | 5 | 20 | -0.83 | n<20 | – | 0.23 | -4.2 | 4.2 |
| W1->H4 | 3 | 1 (33%) | 1 | 0 | -1.05 | n<20 | – | 0.00 | -1.0 | 1.0 |

**LTF confirmation, fixed 3R, by TF pair**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| D1->H1 | 8 | 2 (25%) | 2 | 50 | +0.80 | n<20 | – | 2.46 | +1.6 | 1.1 |
| H4->M15 | 17 | 5 (29%) | 5 | 20 | -0.63 | n<20 | – | 0.41 | -3.2 | 4.0 |
| W1->H4 | 3 | 1 (33%) | 1 | 0 | -1.05 | n<20 | – | 0.00 | -1.0 | 1.0 |

A strict LTF *arrival* (trend-line cross + removal) inside a few TF bars is rare, so a looser, Kevin-style confirmation is tested too: after the touch, the first LTF close that removes an opposite LTF zone (LTF structure breaks back in the trade direction), entry = the newest same-side LTF zone at the TF zone known by then.

**LTF structure-break (CHoCH) entries by management**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| plan's target (round 1) | 502 | 179 (36%) | 179 | 5 | -0.67 | -1.11 … -0.14 | -1.13 … -0.12 | 0.47 | -119.9 | 132.9 |
| fixed 2R | 502 | 145 (29%) | 145 | 37 | -0.22 | -0.45 … +0.02 | -0.48 … +0.03 | 0.73 | -31.9 | 35.3 |
| fixed 3R | 502 | 145 (29%) | 145 | 26 | -0.27 | -0.54 … +0.02 | -0.58 … +0.03 | 0.72 | -38.9 | 51.6 |
| nearest opposite zone | 502 | 129 (26%) | 129 | 9 | -0.74 | -1.09 … -0.27 | -1.08 … -0.31 | 0.39 | -95.8 | 104.5 |
| half at 1R + break-even, rest 3R | 502 | 145 (29%) | 145 | 44 | -0.22 | -0.40 … -0.02 | -0.43 … -0.02 | 0.66 | -31.2 | 34.4 |
| break-even at 1R, then 1R trail | 502 | 145 (29%) | 145 | 41 | -0.21 | -0.42 … +0.02 | -0.43 … +0.02 | 0.68 | -30.4 | 32.1 |
| 2R with the TF stop | 502 | 145 (29%) | 145 | 30 | -0.21 | -0.42 … -0.00 | -0.44 … +0.04 | 0.73 | -29.9 | 42.6 |

**LTF structure-break entries, fixed 2R, by TF pair**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| D1->H1 | 88 | 23 (26%) | 23 | 48 | +0.23 | -0.36 … +0.88 | -0.36 … +0.87 | 1.37 | +5.4 | 4.1 |
| H4->M15 | 382 | 112 (29%) | 112 | 35 | -0.31 | -0.59 … -0.06 | -0.59 … -0.04 | 0.64 | -35.0 | 40.9 |
| W1->H4 | 32 | 10 (31%) | 10 | 30 | -0.23 | n<20 | – | 0.71 | -2.3 | 4.2 |

**LTF structure-break entries, fixed 3R, by TF pair**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| D1->H1 | 88 | 23 (26%) | 23 | 39 | +0.36 | -0.36 … +1.22 | -0.42 … +1.18 | 1.49 | +8.4 | 5.9 |
| H4->M15 | 382 | 112 (29%) | 112 | 25 | -0.36 | -0.65 … -0.05 | -0.69 … -0.01 | 0.65 | -40.0 | 50.9 |
| W1->H4 | 32 | 10 (31%) | 10 | 10 | -0.73 | n<20 | – | 0.28 | -7.3 | 10.2 |

**Realignment + LTF confirmation (round-1 rule, the other side), target = the TF swing**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| D1->H1 | 1 | 1 (100%) | 1 | 0 | -1.04 | n<20 | – | 0.00 | -1.0 | 1.0 |

## 4. Control: every fresh zone (not only arrivals), majors / crosses / gold, D1 + H4 since 2010

65124 zones; 35074 reached (filled) in 20 TF bars. Same stop rule, simulated on H4.

**Every zone, by management**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| fixed 2R | 35074 | 35074 (100%) | 35059 | 33 | -0.09 | -0.10 … -0.07 | -0.11 … -0.07 | 0.88 | -3062.9 | 3075.2 |
| fixed 3R | 35074 | 35074 (100%) | 35050 | 26 | -0.08 | -0.10 … -0.07 | -0.11 … -0.06 | 0.89 | -2971.7 | 2982.3 |
| nearest opposite zone | 35074 | 25383 (72%) | 25370 | 38 | -0.08 | -0.10 … -0.06 | -0.11 … -0.06 | 0.88 | -2106.4 | 2137.5 |
| half at 1R + break-even, rest 3R | 35074 | 35074 (100%) | 35059 | 48 | -0.09 | -0.10 … -0.08 | -0.11 … -0.08 | 0.83 | -3254.0 | 3262.2 |
| break-even at 1R, then 1R trail | 35074 | 35074 (100%) | 35064 | 42 | -0.07 | -0.08 … -0.06 | -0.09 … -0.06 | 0.87 | -2506.7 | 2541.1 |

**Every zone, fixed 2R, Kevin-like filters**

| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |
|---|---|---|---|---|---|---|---|---|---|---|
| all | 35074 | 35074 (100%) | 35059 | 33 | -0.09 | -0.10 … -0.07 | -0.11 … -0.07 | 0.88 | -3062.9 | 3075.2 |
| with HTF structure (HH/HL) | 13604 | 13604 (100%) | 13596 | 33 | -0.10 | -0.13 … -0.08 | -0.13 … -0.07 | 0.86 | -1393.4 | 1436.2 |
| with HTF trend line | 2141 | 2141 (100%) | 2140 | 33 | -0.10 | -0.16 … -0.04 | -0.17 … -0.03 | 0.86 | -217.5 | 221.3 |
| with HTF structure or line | 13882 | 13882 (100%) | 13874 | 33 | -0.10 | -0.13 … -0.08 | -0.13 … -0.07 | 0.86 | -1432.2 | 1477.8 |
| not against HTF (struct >= 0) | 21662 | 21662 (100%) | 21651 | 32 | -0.11 | -0.13 … -0.09 | -0.13 … -0.08 | 0.85 | -2306.9 | 2337.3 |
| HTF discount / premium (loc <= 50) | 17219 | 17219 (100%) | 17213 | 33 | -0.08 | -0.10 … -0.06 | -0.11 … -0.05 | 0.89 | -1389.0 | 1398.3 |
| HTF deep (loc <= 25) | 8568 | 8568 (100%) | 8563 | 34 | -0.05 | -0.08 … -0.02 | -0.09 … -0.01 | 0.93 | -438.6 | 448.2 |
| nested in HTF zone | 3983 | 3983 (100%) | 3982 | 35 | -0.03 | -0.07 … +0.01 | -0.08 … +0.02 | 0.95 | -124.2 | 172.1 |
| strong leg-out (body >= 1.2 ATR) | 12931 | 12931 (100%) | 12924 | 34 | -0.07 | -0.09 … -0.05 | -0.10 … -0.05 | 0.90 | -935.0 | 949.2 |
| small base (<= 2 candles) | 28303 | 28303 (100%) | 28291 | 33 | -0.09 | -0.11 … -0.08 | -0.11 … -0.08 | 0.87 | -2687.1 | 2697.5 |
| room >= 2R to opposite zone | 21089 | 21089 (100%) | 21085 | 33 | -0.11 | -0.13 … -0.09 | -0.13 … -0.09 | 0.85 | -2376.0 | 2389.9 |
| HTF struct + discount | 4208 | 4208 (100%) | 4206 | 32 | -0.13 | -0.17 … -0.09 | -0.18 … -0.08 | 0.82 | -565.3 | 576.0 |
| HTF struct or line + discount | 4255 | 4255 (100%) | 4253 | 32 | -0.13 | -0.18 … -0.10 | -0.18 … -0.08 | 0.82 | -571.7 | 582.4 |
| HTF struct + discount + strong leg | 1598 | 1598 (100%) | 1597 | 33 | -0.09 | -0.15 … -0.02 | -0.16 … -0.01 | 0.88 | -138.6 | 152.8 |
| HTF struct + discount + room 2R | 2512 | 2512 (100%) | 2511 | 31 | -0.16 | -0.22 … -0.11 | -0.22 … -0.11 | 0.78 | -410.5 | 424.7 |

## 5. What does a Kevin setup look like vs ours?

| feature | Kevin zone calls (n=349) | our arrivals (n=2022) | LTF arrival confirmations (n=28) | LTF structure-break entries (n=502) | every zone (control) (n=65124) |
|---|---|---|---|---|---|
| with HTF structure (HH+HL for buys) | 45% | 29% | 18% | 25% | 39% |
| against HTF structure | 30% | 49% | 46% | 51% | 37% |
| with HTF trend line | 8% | 2% | 11% | 3% | 6% |
| against HTF trend line | 3% | 12% | 14% | 12% | 6% |
| with entry-TF structure | 42% | 20% | 11% | 21% | 53% |
| with entry-TF trend line | 12% | 1% | 0% | 1% | 12% |
| against entry-TF trend line | 6% | 11% | 7% | 9% | 2% |
| HTF location (0 = cheap end), median | 45.59 | 29.23 | 22.64 | 26.77 | 50.49 |
| in HTF discount (buys) / premium (sells) | 61% | 69% | 75% | 70% | 49% |
| entry-TF location, median | 27.18 | 17.63 | 18.10 | 18.21 | 51.33 |
| nested in a same-side HTF zone | 34% | 20% | 32% | 23% | 10% |
| room to the opposite TF zone (R), median | 4.85 | 3.02 | 2.91 | 2.53 | 2.02 |
| stop distance (ATR), median | 1.08 | 1.05 | 1.16 | 1.17 | 1.07 |
| zone height (ATR), median | 0.98 | 0.64 | 0.87 | 0.76 | 0.57 |
| zone matched by our detector | 41% | 100% | 100% | 100% | 100% |
| leg-out body (ATR), median | 1.90 | 1.55 | 1.43 | 1.49 | 1.10 |
| base candles, median | 1.00 | 1.00 | 2.00 | 1.00 | 1.00 |
| zone age at placement (bars), median | 32.00 | 2.00 | 2.00 | 2.00 | 2.00 |
| prior run into the base (ATR), median | 2.46 | 5.31 | 5.61 | 5.57 | 2.87 |
| pullback from the 20-bar extreme (ATR), median | 5.74 | 3.57 | 3.49 | 3.43 | 2.20 |
| distance price -> entry at placement (ATR), median | 3.55 | 1.84 | 1.81 | 1.63 | 1.10 |

**Kevin: which features separate his winners from his losers (fixed 2R, closed trades)**

| feature | bucket | closed | win % | avg R | 95% CI |
|---|---|---|---|---|---|
| htf_struct | 0 | 24 | 29 | -0.23 | -0.75 … +0.39 |
| htf_struct | 1 | 49 | 27 | -0.27 | -0.60 … +0.11 |
| htf_struct | -1 | 42 | 50 | +0.38 | -0.06 … +0.81 |
| htf_tl | 0 | 103 | 36 | -0.02 | -0.29 … +0.27 |
| tf_struct | 0 | 35 | 40 | +0.12 | -0.32 … +0.55 |
| tf_struct | 1 | 43 | 33 | -0.16 | -0.56 … +0.26 |
| tf_struct | -1 | 37 | 35 | +0.01 | -0.46 … +0.44 |
| tf_tl | 0 | 94 | 38 | +0.06 | -0.22 … +0.34 |
| tf_tl | 1 | 11 | 18 | -0.56 | n<20 |
| tf_tl | -1 | 10 | 30 | -0.19 | n<20 |
| loc_htf | > 75 | 12 | 42 | +0.17 | n<20 |
| loc_htf | <= 25 | 33 | 30 | -0.21 | -0.66 … +0.33 |
| loc_htf | 25 – 50 | 35 | 29 | -0.20 | -0.61 … +0.23 |
| loc_htf | 50 – 75 | 35 | 46 | +0.25 | -0.25 … +0.69 |
| loc_tf | <= 25 | 56 | 41 | +0.13 | -0.24 … +0.51 |
| loc_tf | 25 – 50 | 33 | 36 | -0.04 | -0.50 … +0.47 |
| loc_tf | 50 – 75 | 24 | 25 | -0.28 | -0.74 … +0.29 |
| nested | no | 78 | 40 | +0.08 | -0.24 … +0.41 |
| nested | yes | 37 | 27 | -0.24 | -0.67 … +0.24 |
| opp_rr | > 4 | 39 | 33 | -0.09 | -0.56 … +0.37 |
| opp_rr | 2 – 4 | 31 | 35 | -0.01 | -0.50 … +0.48 |
| risk_atr | 1 – 2 | 86 | 35 | -0.05 | -0.36 … +0.23 |
| risk_atr | 0.5 – 1 | 23 | 43 | +0.23 | -0.41 … +0.88 |
| zone_h_atr | > 1 | 41 | 41 | +0.19 | -0.24 … +0.65 |
| zone_h_atr | 0.6 – 1 | 71 | 30 | -0.23 | -0.53 … +0.09 |
| matched | no | 61 | 33 | -0.11 | -0.45 … +0.24 |
| matched | yes | 54 | 39 | +0.07 | -0.32 … +0.45 |
| leg_body_atr | > 2 | 27 | 30 | -0.20 | -0.65 … +0.35 |
| leg_body_atr | 1.2 – 2 | 20 | 40 | +0.18 | -0.42 … +0.82 |
| base_n | <= 1 | 32 | 41 | +0.08 | -0.42 … +0.58 |
| base_n | 1 – 2 | 15 | 40 | +0.20 | n<20 |
| approach | > 4 | 84 | 36 | -0.01 | -0.31 … +0.28 |
| approach | 2 – 4 | 27 | 37 | +0.03 | -0.51 … +0.59 |
| dist_now | > 3 | 52 | 35 | -0.06 | -0.45 … +0.35 |
| dist_now | 1 – 3 | 35 | 46 | +0.30 | -0.14 … +0.80 |
| dist_now | <= 0.5 | 19 | 26 | -0.40 | n<20 |
| dist_now | 0.5 – 1 | 9 | 22 | -0.30 | n<20 |
| session | ny | 28 | 21 | -0.42 | -0.85 … +0.07 |
| session | asia | 42 | 36 | -0.01 | -0.43 … +0.42 |
| session | late | 18 | 67 | +0.91 | n<20 |
| session | london | 27 | 30 | -0.25 | -0.72 … +0.34 |
| weekday | 0 | 12 | 25 | -0.32 | n<20 |
| weekday | 1 | 23 | 26 | -0.29 | -0.81 … +0.37 |
| weekday | 2 | 38 | 39 | +0.12 | -0.35 … +0.59 |
| weekday | 3 | 25 | 36 | -0.02 | -0.51 … +0.54 |
| weekday | 4 | 17 | 47 | +0.21 | n<20 |

Kevin, time split: Jul-Aug 41 tr, 44% win, +0.21R; Sep-Oct 74 tr, 31% win, -0.15R.

- filter 'with HTF structure (HH/HL)': Jul-Aug 14 tr, 29% win, -0.16R; Sep-Oct 35 tr, 26% win, -0.31R
- filter 'with HTF trend line': Jul-Aug 2 tr, 0% win, -1.07R; Sep-Oct 3 tr, 33% win, -0.06R
- filter 'with HTF structure or line': Jul-Aug 14 tr, 29% win, -0.16R; Sep-Oct 37 tr, 27% win, -0.27R
- filter 'not against HTF (struct >= 0)': Jul-Aug 24 tr, 25% win, -0.31R; Sep-Oct 48 tr, 29% win, -0.21R
- filter 'HTF discount / premium (loc <= 50)': Jul-Aug 22 tr, 41% win, +0.17R; Sep-Oct 46 tr, 24% win, -0.38R
- filter 'HTF deep (loc <= 25)': Jul-Aug 7 tr, 29% win, -0.30R; Sep-Oct 26 tr, 31% win, -0.18R
- filter 'nested in HTF zone': Jul-Aug 18 tr, 33% win, -0.04R; Sep-Oct 19 tr, 21% win, -0.43R

**Our arrivals: winners vs losers by feature (fixed 2R, all years)**

| feature | bucket | closed | win % | avg R | 95% CI |
|---|---|---|---|---|---|
| htf_struct | 0 | 171 | 37 | -0.00 | -0.22 … +0.23 |
| htf_struct | 1 | 208 | 31 | -0.17 | -0.35 … +0.02 |
| htf_struct | -1 | 397 | 34 | -0.11 | -0.24 … +0.03 |
| htf_tl | 0 | 649 | 33 | -0.12 | -0.22 … -0.00 |
| htf_tl | 1 | 16 | 31 | -0.18 | n<20 |
| htf_tl | -1 | 111 | 38 | +0.01 | -0.26 … +0.25 |
| tf_struct | 0 | 75 | 23 | -0.41 | -0.70 … -0.12 |
| tf_struct | 1 | 154 | 34 | -0.11 | -0.31 … +0.13 |
| tf_struct | -1 | 547 | 35 | -0.06 | -0.17 … +0.05 |
| loc_htf | > 75 | 81 | 33 | -0.10 | -0.42 … +0.22 |
| loc_htf | <= 25 | 346 | 33 | -0.13 | -0.28 … +0.02 |
| loc_htf | 25 – 50 | 191 | 34 | -0.09 | -0.28 … +0.12 |
| loc_htf | 50 – 75 | 155 | 35 | -0.07 | -0.30 … +0.15 |
| loc_tf | <= 25 | 484 | 36 | -0.04 | -0.17 … +0.09 |
| loc_tf | 25 – 50 | 158 | 35 | -0.07 | -0.29 … +0.16 |
| loc_tf | 50 – 75 | 124 | 25 | -0.35 | -0.57 … -0.12 |
| nested | no | 612 | 34 | -0.11 | -0.22 … -0.01 |
| nested | yes | 164 | 34 | -0.08 | -0.29 … +0.15 |
| opp_rr | > 4 | 221 | 38 | +0.00 | -0.19 … +0.21 |
| opp_rr | <= 1 | 88 | 44 | +0.20 | -0.08 … +0.51 |
| opp_rr | 1 – 2 | 153 | 29 | -0.21 | -0.42 … +0.02 |
| opp_rr | 2 – 4 | 231 | 31 | -0.19 | -0.38 … -0.02 |
| leg_body_atr | > 2 | 197 | 34 | -0.11 | -0.31 … +0.09 |
| leg_body_atr | <= 0.8 | 69 | 29 | -0.22 | -0.51 … +0.08 |
| leg_body_atr | 1.2 – 2 | 343 | 31 | -0.18 | -0.32 … -0.03 |
| leg_body_atr | 0.8 – 1.2 | 167 | 40 | +0.11 | -0.11 … +0.33 |
| base_n | > 3 | 64 | 31 | -0.17 | -0.51 … +0.17 |
| base_n | <= 1 | 444 | 32 | -0.17 | -0.30 … -0.04 |
| base_n | 1 – 2 | 190 | 41 | +0.09 | -0.10 … +0.30 |
| base_n | 2 – 3 | 78 | 32 | -0.12 | -0.43 … +0.19 |
| risk_atr | > 2 | 95 | 33 | -0.16 | -0.43 … +0.10 |
| risk_atr | 1 – 2 | 356 | 35 | -0.05 | -0.19 … +0.10 |
| risk_atr | <= 0.5 | 67 | 31 | -0.25 | -0.57 … +0.11 |
| risk_atr | 0.5 – 1 | 258 | 34 | -0.12 | -0.29 … +0.05 |
| approach | > 4 | 263 | 36 | -0.03 | -0.20 … +0.14 |
| approach | 1 – 2 | 52 | 27 | -0.30 | -0.64 … +0.05 |
| approach | 2 – 4 | 461 | 33 | -0.12 | -0.24 … +0.01 |
| prior_run | > 8 | 72 | 39 | +0.02 | -0.30 … +0.35 |
| prior_run | 2 – 4 | 132 | 33 | -0.13 | -0.35 … +0.12 |
| prior_run | 4 – 8 | 561 | 33 | -0.11 | -0.22 … +0.01 |
| age | <= 10 | 776 | 34 | -0.10 | -0.20 … -0.01 |
| session | ny | 257 | 29 | -0.23 | -0.39 … -0.06 |
| session | asia | 171 | 42 | +0.08 | -0.14 … +0.29 |
| session | late | 116 | 33 | -0.16 | -0.40 … +0.11 |
| session | london | 177 | 36 | -0.02 | -0.23 … +0.20 |

**Arrivals: interpretable models, walk-forward** (2R; fit on 474 trades before 2020-01-01, scored on 302 after)

Logistic regression (standardised, L2): AUC train 0.64, **test 0.48** (0.5 = no skill). Largest weights (+ = more wins): leg_body_atr -0.33, loc_tf -0.25, nfp_week +0.18, leg_candles -0.16, approach -0.15, opp_rr +0.14, zone_h_atr +0.13, leg_ratio +0.13.
Test trades the model ranks in its train top third: 94 tr, 29% win, -0.26R; the rest: 208 tr, 34% win, -0.10R.

Depth-2 regression tree on R (train):

```
loc_tf <= 46.95 (474 trades, avg -0.07R)
    leg_body_atr <= 1.55 (379 trades, avg +0.02R)
        -> 190 trades, avg +0.21R
    leg_body_atr > 1.55
        -> 189 trades, avg -0.18R
loc_tf > 46.95
    dist_now <= 1.38 (95 trades, avg -0.41R)
        -> 48 trades, avg -0.57R
    dist_now > 1.38
        -> 47 trades, avg -0.24R
```
Test years, leaves the tree calls positive: 136 tr, 37% win, -0.02R; negative: 166 tr, 28% win, -0.26R.

**Every zone (control): interpretable models, walk-forward** (2R; fit on 20783 trades before 2020-01-01, scored on 14276 after)

Logistic regression (standardised, L2): AUC train 0.53, **test 0.51** (0.5 = no skill). Largest weights (+ = more wins): risk_atr +0.06, htf_tl -0.04, zone_h_atr +0.03, leg_ratio -0.03, loc_htf -0.02, prior_run -0.02, htf_zone_dist -0.02, loc_tf -0.02.
Test trades the model ranks in its train top third: 4841 tr, 33% win, -0.07R; the rest: 9435 tr, 33% win, -0.10R.

Depth-2 regression tree on R (train):

```
risk_atr <= 0.84 (20783 trades, avg -0.08R)
    risk_atr <= 0.60 (6236 trades, avg -0.17R)
        -> 3118 trades, avg -0.23R
    risk_atr > 0.60
        -> 3118 trades, avg -0.12R
risk_atr > 0.84
    loc_htf <= 21.79 (14547 trades, avg -0.05R)
        -> 2910 trades, avg +0.02R
    loc_htf > 21.79
        -> 11637 trades, avg -0.06R
```
Test years, leaves the tree calls positive: 1892 tr, 34% win, -0.03R; negative: 12384 tr, 33% win, -0.10R.

## 6. Candidate filters and management, walk-forward (choose on 2010-2019, judge on 2020-2026)

A variant is "picked" when its train-years expectancy is above 0 with >= 30 closed trades, and "holds" when the same variant is also above 0 in the test years (>= 20 closed). Thresholds are fixed in advance (not fitted); 15 filters x 6 managements are tried, so a few will look good by luck: trust only the ones whose test CI is clearly above 0.

### Arrivals (limit at the zone)

| filter | management | train 2010-19 | test 2020-26 | test 95% CI (week blocks) | test PF | test max DD | picked on train | holds out of sample |
|---|---|---|---|---|---|---|---|---|
| all | plan | 516 tr, 20% win, -0.15R | 334 tr, 18% win, -0.13R | -0.42 … +0.22 | 0.86 | 108.6 | no | no |
| all | 2R | 474 tr, 35% win, -0.07R | 302 tr, 32% win, -0.15R | -0.33 … +0.02 | 0.80 | 57.8 | no | no |
| all | 3R | 474 tr, 24% win, -0.20R | 301 tr, 22% win, -0.25R | -0.43 … -0.06 | 0.71 | 90.7 | no | no |
| all | opp | 412 tr, 31% win, -0.06R | 281 tr, 26% win, -0.31R | -0.50 … -0.11 | 0.62 | 101.0 | no | no |
| all | partial | 474 tr, 50% win, -0.13R | 301 tr, 50% win, -0.14R | -0.27 … -0.01 | 0.74 | 49.1 | no | no |
| all | trail | 474 tr, 42% win, -0.19R | 302 tr, 44% win, -0.20R | -0.34 … -0.07 | 0.64 | 68.9 | no | no |
| with HTF structure (HH/HL) | plan | 122 tr, 16% win, -0.29R | 96 tr, 20% win, -0.00R | -0.51 … +0.66 | 1.00 | 30.3 | no | no |
| with HTF structure (HH/HL) | 2R | 126 tr, 29% win, -0.23R | 82 tr, 34% win, -0.07R | -0.42 … +0.34 | 0.91 | 13.0 | no | no |
| with HTF structure (HH/HL) | 3R | 126 tr, 18% win, -0.39R | 82 tr, 23% win, -0.21R | -0.57 … +0.22 | 0.74 | 26.1 | no | no |
| with HTF structure (HH/HL) | opp | 92 tr, 32% win, -0.18R | 73 tr, 32% win, -0.14R | -0.53 … +0.32 | 0.81 | 24.3 | no | no |
| with HTF structure (HH/HL) | partial | 126 tr, 45% win, -0.19R | 82 tr, 48% win, -0.16R | -0.40 … +0.11 | 0.71 | 17.5 | no | no |
| with HTF structure (HH/HL) | trail | 126 tr, 38% win, -0.32R | 82 tr, 45% win, -0.12R | -0.40 … +0.19 | 0.78 | 15.5 | no | no |
| with HTF trend line | plan | 9 tr, 11% win, -0.74R | 7 tr, 14% win, -0.65R | – | 0.34 | 4.5 | no | no |
| with HTF trend line | 2R | 10 tr, 30% win, -0.19R | 6 tr, 33% win, -0.16R | – | 0.79 | 3.3 | no | no |
| with HTF trend line | 3R | 10 tr, 10% win, -0.69R | 6 tr, 17% win, -0.49R | – | 0.50 | 3.3 | no | no |
| with HTF trend line | opp | 5 tr, 60% win, -0.06R | 3 tr, 0% win, -1.10R | – | 0.00 | 3.3 | no | no |
| with HTF trend line | partial | 10 tr, 50% win, -0.19R | 6 tr, 33% win, -0.16R | – | 0.71 | 2.2 | no | no |
| with HTF trend line | trail | 10 tr, 50% win, -0.08R | 6 tr, 50% win, -0.10R | – | 0.82 | 2.2 | no | no |
| with HTF structure or line | plan | 124 tr, 16% win, -0.28R | 97 tr, 21% win, +0.02R | -0.48 … +0.65 | 1.03 | 30.3 | no | no |
| with HTF structure or line | 2R | 128 tr, 29% win, -0.22R | 83 tr, 35% win, -0.04R | -0.39 … +0.34 | 0.94 | 13.0 | no | no |
| with HTF structure or line | 3R | 128 tr, 18% win, -0.40R | 83 tr, 24% win, -0.18R | -0.55 … +0.25 | 0.79 | 23.2 | no | no |
| with HTF structure or line | opp | 94 tr, 32% win, -0.19R | 73 tr, 32% win, -0.14R | -0.53 … +0.32 | 0.81 | 24.3 | no | no |
| with HTF structure or line | partial | 128 tr, 45% win, -0.19R | 83 tr, 48% win, -0.14R | -0.39 … +0.13 | 0.75 | 17.5 | no | no |
| with HTF structure or line | trail | 128 tr, 38% win, -0.32R | 83 tr, 46% win, -0.11R | -0.37 … +0.20 | 0.80 | 15.5 | no | no |
| not against HTF (struct >= 0) | plan | 242 tr, 19% win, -0.20R | 149 tr, 22% win, +0.18R | -0.30 … +0.75 | 1.21 | 26.6 | no | no |
| not against HTF (struct >= 0) | 2R | 237 tr, 32% win, -0.15R | 133 tr, 36% win, -0.02R | -0.29 … +0.28 | 0.98 | 23.1 | no | no |
| not against HTF (struct >= 0) | 3R | 237 tr, 22% win, -0.24R | 133 tr, 26% win, -0.11R | -0.41 … +0.25 | 0.87 | 32.1 | no | no |
| not against HTF (struct >= 0) | opp | 184 tr, 33% win, -0.05R | 117 tr, 32% win, -0.07R | -0.39 … +0.28 | 0.90 | 27.8 | no | no |
| not against HTF (struct >= 0) | partial | 237 tr, 49% win, -0.09R | 133 tr, 50% win, -0.08R | -0.29 … +0.16 | 0.86 | 16.4 | no | no |
| not against HTF (struct >= 0) | trail | 237 tr, 41% win, -0.21R | 133 tr, 48% win, -0.11R | -0.32 … +0.13 | 0.80 | 19.6 | no | no |
| HTF discount / premium (loc <= 50) | plan | 354 tr, 20% win, -0.08R | 260 tr, 17% win, -0.14R | -0.48 … +0.23 | 0.85 | 103.5 | no | no |
| HTF discount / premium (loc <= 50) | 2R | 308 tr, 36% win, -0.04R | 229 tr, 30% win, -0.22R | -0.43 … -0.01 | 0.72 | 59.8 | no | no |
| HTF discount / premium (loc <= 50) | 3R | 308 tr, 25% win, -0.16R | 229 tr, 21% win, -0.32R | -0.53 … -0.09 | 0.63 | 86.7 | no | no |
| HTF discount / premium (loc <= 50) | opp | 288 tr, 32% win, -0.02R | 224 tr, 24% win, -0.39R | -0.60 … -0.16 | 0.54 | 95.5 | no | no |
| HTF discount / premium (loc <= 50) | partial | 308 tr, 50% win, -0.09R | 229 tr, 51% win, -0.14R | -0.29 … +0.01 | 0.73 | 39.5 | no | no |
| HTF discount / premium (loc <= 50) | trail | 308 tr, 42% win, -0.17R | 229 tr, 45% win, -0.21R | -0.35 … -0.05 | 0.63 | 52.5 | no | no |
| HTF deep (loc <= 25) | plan | 241 tr, 21% win, +0.06R | 157 tr, 15% win, -0.28R | -0.66 … +0.23 | 0.70 | 96.4 | yes | no |
| HTF deep (loc <= 25) | 2R | 206 tr, 35% win, -0.05R | 140 tr, 29% win, -0.25R | -0.50 … +0.01 | 0.68 | 43.1 | no | no |
| HTF deep (loc <= 25) | 3R | 206 tr, 26% win, -0.10R | 140 tr, 16% win, -0.49R | -0.74 … -0.22 | 0.47 | 76.9 | no | no |
| HTF deep (loc <= 25) | opp | 195 tr, 31% win, +0.10R | 137 tr, 22% win, -0.45R | -0.70 … -0.18 | 0.48 | 64.4 | yes | no |
| HTF deep (loc <= 25) | partial | 206 tr, 48% win, -0.14R | 140 tr, 52% win, -0.18R | -0.37 … -0.01 | 0.66 | 30.0 | no | no |
| HTF deep (loc <= 25) | trail | 206 tr, 39% win, -0.22R | 140 tr, 47% win, -0.22R | -0.41 … -0.05 | 0.60 | 35.5 | no | no |
| nested in HTF zone | plan | 90 tr, 32% win, +0.14R | 69 tr, 17% win, -0.47R | -0.82 … -0.07 | 0.47 | 32.6 | yes | no |
| nested in HTF zone | 2R | 96 tr, 38% win, +0.03R | 68 tr, 29% win, -0.24R | -0.54 … +0.09 | 0.69 | 18.3 | yes | no |
| nested in HTF zone | 3R | 96 tr, 29% win, -0.02R | 68 tr, 21% win, -0.38R | -0.71 … -0.01 | 0.56 | 25.8 | no | no |
| nested in HTF zone | opp | 83 tr, 46% win, -0.01R | 63 tr, 30% win, -0.45R | -0.71 … -0.18 | 0.41 | 28.4 | no | no |
| nested in HTF zone | partial | 96 tr, 61% win, +0.07R | 68 tr, 47% win, -0.19R | -0.45 … +0.08 | 0.67 | 14.2 | yes | no |
| nested in HTF zone | trail | 96 tr, 50% win, -0.00R | 68 tr, 43% win, -0.28R | -0.51 … -0.06 | 0.50 | 20.7 | no | no |
| strong leg-out (body >= 1.2 ATR) | plan | 365 tr, 21% win, -0.07R | 225 tr, 16% win, -0.32R | -0.57 … -0.03 | 0.65 | 98.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | 2R | 339 tr, 33% win, -0.13R | 201 tr, 31% win, -0.20R | -0.41 … +0.05 | 0.75 | 49.0 | no | no |
| strong leg-out (body >= 1.2 ATR) | 3R | 339 tr, 24% win, -0.20R | 201 tr, 19% win, -0.39R | -0.62 … -0.13 | 0.57 | 87.1 | no | no |
| strong leg-out (body >= 1.2 ATR) | opp | 298 tr, 30% win, -0.03R | 190 tr, 26% win, -0.36R | -0.59 … -0.11 | 0.57 | 75.7 | no | no |
| strong leg-out (body >= 1.2 ATR) | partial | 339 tr, 48% win, -0.14R | 201 tr, 51% win, -0.14R | -0.31 … +0.02 | 0.73 | 32.9 | no | no |
| strong leg-out (body >= 1.2 ATR) | trail | 339 tr, 40% win, -0.22R | 201 tr, 45% win, -0.21R | -0.37 … -0.04 | 0.61 | 44.4 | no | no |
| small base (<= 2 candles) | plan | 414 tr, 18% win, -0.15R | 275 tr, 18% win, -0.17R | -0.47 … +0.18 | 0.82 | 104.2 | no | no |
| small base (<= 2 candles) | 2R | 384 tr, 35% win, -0.05R | 250 tr, 32% win, -0.15R | -0.34 … +0.03 | 0.80 | 48.9 | no | no |
| small base (<= 2 candles) | 3R | 384 tr, 24% win, -0.20R | 249 tr, 23% win, -0.24R | -0.45 … -0.03 | 0.72 | 71.7 | no | no |
| small base (<= 2 candles) | opp | 334 tr, 30% win, -0.05R | 233 tr, 25% win, -0.33R | -0.53 … -0.11 | 0.61 | 89.9 | no | no |
| small base (<= 2 candles) | partial | 384 tr, 50% win, -0.12R | 249 tr, 48% win, -0.18R | -0.34 … -0.04 | 0.68 | 51.1 | no | no |
| small base (<= 2 candles) | trail | 384 tr, 42% win, -0.18R | 250 tr, 42% win, -0.23R | -0.37 … -0.07 | 0.61 | 63.7 | no | no |
| room >= 2R to opposite zone | plan | 364 tr, 16% win, -0.14R | 230 tr, 16% win, -0.11R | -0.47 … +0.33 | 0.88 | 79.9 | no | no |
| room >= 2R to opposite zone | 2R | 330 tr, 35% win, -0.09R | 205 tr, 32% win, -0.17R | -0.36 … +0.01 | 0.78 | 46.8 | no | no |
| room >= 2R to opposite zone | 3R | 330 tr, 24% win, -0.20R | 204 tr, 22% win, -0.27R | -0.47 … -0.01 | 0.70 | 65.8 | no | no |
| room >= 2R to opposite zone | opp | 268 tr, 21% win, -0.07R | 184 tr, 16% win, -0.40R | -0.64 … -0.14 | 0.58 | 89.8 | no | no |
| room >= 2R to opposite zone | partial | 330 tr, 47% win, -0.17R | 204 tr, 52% win, -0.14R | -0.29 … +0.02 | 0.75 | 35.9 | no | no |
| room >= 2R to opposite zone | trail | 330 tr, 41% win, -0.22R | 205 tr, 46% win, -0.22R | -0.35 … -0.07 | 0.59 | 53.4 | no | no |
| HTF struct + discount | plan | 64 tr, 14% win, -0.19R | 65 tr, 18% win, -0.04R | -0.64 … +0.70 | 0.96 | 27.8 | no | no |
| HTF struct + discount | 2R | 55 tr, 27% win, -0.27R | 52 tr, 38% win, +0.07R | -0.41 … +0.53 | 1.10 | 9.4 | no | no |
| HTF struct + discount | 3R | 55 tr, 16% win, -0.43R | 52 tr, 23% win, -0.20R | -0.66 … +0.28 | 0.75 | 19.0 | no | no |
| HTF struct + discount | opp | 48 tr, 33% win, -0.16R | 50 tr, 30% win, -0.16R | -0.64 … +0.39 | 0.78 | 18.4 | no | no |
| HTF struct + discount | partial | 55 tr, 42% win, -0.22R | 52 tr, 54% win, -0.02R | -0.38 … +0.29 | 0.96 | 8.0 | no | no |
| HTF struct + discount | trail | 55 tr, 35% win, -0.39R | 52 tr, 52% win, +0.05R | -0.34 … +0.44 | 1.10 | 7.3 | no | no |
| HTF struct or line + discount | plan | 65 tr, 15% win, -0.16R | 65 tr, 18% win, -0.04R | -0.64 … +0.70 | 0.96 | 27.8 | no | no |
| HTF struct or line + discount | 2R | 56 tr, 29% win, -0.23R | 52 tr, 38% win, +0.07R | -0.41 … +0.53 | 1.10 | 9.4 | no | no |
| HTF struct or line + discount | 3R | 56 tr, 16% win, -0.45R | 52 tr, 23% win, -0.20R | -0.66 … +0.28 | 0.75 | 19.0 | no | no |
| HTF struct or line + discount | opp | 49 tr, 35% win, -0.15R | 50 tr, 30% win, -0.16R | -0.64 … +0.39 | 0.78 | 18.4 | no | no |
| HTF struct or line + discount | partial | 56 tr, 43% win, -0.21R | 52 tr, 54% win, -0.02R | -0.38 … +0.29 | 0.96 | 8.0 | no | no |
| HTF struct or line + discount | trail | 56 tr, 36% win, -0.37R | 52 tr, 52% win, +0.05R | -0.34 … +0.44 | 1.10 | 7.3 | no | no |
| HTF struct + discount + strong leg | plan | 51 tr, 18% win, +0.02R | 40 tr, 20% win, -0.02R | -0.73 … +0.87 | 0.98 | 20.1 | yes | no |
| HTF struct + discount + strong leg | 2R | 43 tr, 33% win, -0.13R | 33 tr, 42% win, +0.18R | -0.43 … +0.78 | 1.29 | 8.1 | no | no |
| HTF struct + discount + strong leg | 3R | 43 tr, 21% win, -0.27R | 33 tr, 24% win, -0.18R | -0.76 … +0.48 | 0.77 | 16.5 | no | no |
| HTF struct + discount + strong leg | opp | 38 tr, 34% win, -0.11R | 31 tr, 39% win, +0.09R | -0.58 … +0.81 | 1.13 | 9.7 | no | no |
| HTF struct + discount + strong leg | partial | 43 tr, 47% win, -0.09R | 33 tr, 58% win, +0.04R | -0.38 … +0.47 | 1.09 | 6.1 | no | no |
| HTF struct + discount + strong leg | trail | 43 tr, 37% win, -0.31R | 33 tr, 55% win, +0.14R | -0.36 … +0.65 | 1.31 | 5.5 | no | no |
| HTF struct + discount + room 2R | plan | 45 tr, 11% win, -0.26R | 45 tr, 18% win, +0.05R | -0.74 … +1.10 | 1.06 | 24.2 | no | no |
| HTF struct + discount + room 2R | 2R | 38 tr, 29% win, -0.23R | 33 tr, 36% win, +0.00R | -0.50 … +0.54 | 1.00 | 9.0 | no | no |
| HTF struct + discount + room 2R | 3R | 38 tr, 13% win, -0.58R | 33 tr, 24% win, -0.12R | -0.69 … +0.60 | 0.85 | 12.6 | no | no |
| HTF struct + discount + room 2R | opp | 31 tr, 23% win, -0.25R | 31 tr, 19% win, -0.26R | -0.87 … +0.49 | 0.71 | 16.6 | no | no |
| HTF struct + discount + room 2R | partial | 38 tr, 39% win, -0.27R | 33 tr, 52% win, -0.05R | -0.41 … +0.38 | 0.91 | 7.5 | no | no |
| HTF struct + discount + room 2R | trail | 38 tr, 32% win, -0.48R | 33 tr, 52% win, -0.03R | -0.41 … +0.37 | 0.94 | 7.0 | no | no |

### LTF confirmation entries

| filter | management | train 2010-19 | test 2020-26 | test 95% CI (week blocks) | test PF | test max DD | picked on train | holds out of sample |
|---|---|---|---|---|---|---|---|---|
| all | plan | 8 tr, 0% win, -1.33R | 2 tr, 0% win, -1.61R | – | 0.00 | 3.2 | no | no |
| all | 2R | 7 tr, 29% win, -0.47R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| all | 3R | 7 tr, 29% win, -0.18R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| all | opp | 7 tr, 0% win, -1.32R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| all | partial | 7 tr, 57% win, +0.14R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| all | trail | 7 tr, 43% win, -0.01R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| with HTF structure (HH/HL) | plan | 1 tr, 0% win, -1.63R | 1 tr, 0% win, -1.88R | – | 0.00 | 1.9 | no | no |
| with HTF structure (HH/HL) | 2R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure (HH/HL) | 3R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure (HH/HL) | opp | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure (HH/HL) | partial | 1 tr, 0% win, -0.13R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure (HH/HL) | trail | 1 tr, 0% win, -0.55R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | plan | 1 tr, 0% win, -1.79R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | 2R | 1 tr, 100% win, +1.21R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | 3R | 1 tr, 100% win, +2.21R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | opp | 1 tr, 0% win, -1.79R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | partial | 1 tr, 100% win, +1.21R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | trail | 1 tr, 100% win, +2.07R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure or line | plan | 2 tr, 0% win, -1.71R | 1 tr, 0% win, -1.88R | – | 0.00 | 1.9 | no | no |
| with HTF structure or line | 2R | 2 tr, 50% win, -0.21R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure or line | 3R | 2 tr, 50% win, +0.29R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure or line | opp | 2 tr, 0% win, -1.71R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure or line | partial | 2 tr, 50% win, +0.54R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure or line | trail | 2 tr, 50% win, +0.76R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| not against HTF (struct >= 0) | plan | 6 tr, 0% win, -1.42R | 2 tr, 0% win, -1.61R | – | 0.00 | 3.2 | no | no |
| not against HTF (struct >= 0) | 2R | 5 tr, 40% win, -0.22R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| not against HTF (struct >= 0) | 3R | 5 tr, 40% win, +0.18R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| not against HTF (struct >= 0) | opp | 5 tr, 0% win, -1.42R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| not against HTF (struct >= 0) | partial | 5 tr, 60% win, +0.32R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| not against HTF (struct >= 0) | trail | 5 tr, 40% win, +0.16R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF discount / premium (loc <= 50) | plan | 6 tr, 0% win, -1.28R | 2 tr, 0% win, -1.61R | – | 0.00 | 3.2 | no | no |
| HTF discount / premium (loc <= 50) | 2R | 5 tr, 20% win, -0.66R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF discount / premium (loc <= 50) | 3R | 5 tr, 20% win, -0.46R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF discount / premium (loc <= 50) | opp | 5 tr, 0% win, -1.26R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF discount / premium (loc <= 50) | partial | 5 tr, 40% win, -0.11R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF discount / premium (loc <= 50) | trail | 5 tr, 20% win, -0.48R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF deep (loc <= 25) | plan | 2 tr, 0% win, -1.22R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF deep (loc <= 25) | 2R | 1 tr, 0% win, -1.05R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF deep (loc <= 25) | 3R | 1 tr, 0% win, -1.05R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF deep (loc <= 25) | opp | 1 tr, 0% win, -1.05R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF deep (loc <= 25) | partial | 1 tr, 0% win, -1.05R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF deep (loc <= 25) | trail | 1 tr, 0% win, -1.05R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| nested in HTF zone | plan | 5 tr, 0% win, -1.40R | 1 tr, 0% win, -1.88R | – | 0.00 | 1.9 | no | no |
| nested in HTF zone | 2R | 5 tr, 40% win, -0.20R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| nested in HTF zone | 3R | 5 tr, 40% win, +0.20R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| nested in HTF zone | opp | 5 tr, 0% win, -1.40R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| nested in HTF zone | partial | 5 tr, 60% win, +0.10R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| nested in HTF zone | trail | 5 tr, 40% win, +0.10R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| strong leg-out (body >= 1.2 ATR) | plan | 7 tr, 0% win, -1.37R | 2 tr, 0% win, -1.61R | – | 0.00 | 3.2 | no | no |
| strong leg-out (body >= 1.2 ATR) | 2R | 6 tr, 33% win, -0.37R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | 3R | 6 tr, 33% win, -0.04R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | opp | 6 tr, 0% win, -1.37R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | partial | 6 tr, 67% win, +0.33R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | trail | 6 tr, 50% win, +0.17R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| small base (<= 2 candles) | plan | 6 tr, 0% win, -1.37R | 2 tr, 0% win, -1.61R | – | 0.00 | 3.2 | no | no |
| small base (<= 2 candles) | 2R | 6 tr, 33% win, -0.37R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| small base (<= 2 candles) | 3R | 6 tr, 33% win, -0.04R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| small base (<= 2 candles) | opp | 6 tr, 0% win, -1.37R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| small base (<= 2 candles) | partial | 6 tr, 67% win, +0.33R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| small base (<= 2 candles) | trail | 6 tr, 50% win, +0.17R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| room >= 2R to opposite zone | plan | 4 tr, 0% win, -1.19R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| room >= 2R to opposite zone | 2R | 3 tr, 0% win, -1.12R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| room >= 2R to opposite zone | 3R | 3 tr, 0% win, -1.12R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| room >= 2R to opposite zone | opp | 3 tr, 0% win, -1.12R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| room >= 2R to opposite zone | partial | 3 tr, 67% win, -0.12R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| room >= 2R to opposite zone | trail | 3 tr, 67% win, -0.19R | 1 tr, 0% win, -1.34R | – | 0.00 | 1.3 | no | no |
| HTF struct + discount | plan | 1 tr, 0% win, -1.63R | 1 tr, 0% win, -1.88R | – | 0.00 | 1.9 | no | no |
| HTF struct + discount | 2R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount | 3R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount | opp | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount | partial | 1 tr, 0% win, -0.13R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount | trail | 1 tr, 0% win, -0.55R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct or line + discount | plan | 1 tr, 0% win, -1.63R | 1 tr, 0% win, -1.88R | – | 0.00 | 1.9 | no | no |
| HTF struct or line + discount | 2R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct or line + discount | 3R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct or line + discount | opp | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct or line + discount | partial | 1 tr, 0% win, -0.13R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct or line + discount | trail | 1 tr, 0% win, -0.55R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + strong leg | plan | 1 tr, 0% win, -1.63R | 1 tr, 0% win, -1.88R | – | 0.00 | 1.9 | no | no |
| HTF struct + discount + strong leg | 2R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + strong leg | 3R | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + strong leg | opp | 1 tr, 0% win, -1.63R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + strong leg | partial | 1 tr, 0% win, -0.13R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + strong leg | trail | 1 tr, 0% win, -0.55R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + room 2R | plan | 0 tr, –% win, –R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + room 2R | 2R | 0 tr, –% win, –R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + room 2R | 3R | 0 tr, –% win, –R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + room 2R | opp | 0 tr, –% win, –R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + room 2R | partial | 0 tr, –% win, –R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| HTF struct + discount + room 2R | trail | 0 tr, –% win, –R | 0 tr, –% win, –R | – | – | 0.0 | no | no |

### LTF structure-break entries

| filter | management | train 2010-19 | test 2020-26 | test 95% CI (week blocks) | test PF | test max DD | picked on train | holds out of sample |
|---|---|---|---|---|---|---|---|---|
| all | plan | 107 tr, 4% win, -0.66R | 72 tr, 7% win, -0.68R | -1.23 … +0.03 | 0.45 | 64.8 | no | no |
| all | 2R | 91 tr, 33% win, -0.32R | 54 tr, 43% win, -0.05R | -0.46 … +0.35 | 0.94 | 10.1 | no | no |
| all | 3R | 91 tr, 21% win, -0.48R | 54 tr, 35% win, +0.08R | -0.49 … +0.66 | 1.10 | 7.8 | no | no |
| all | opp | 78 tr, 9% win, -0.72R | 51 tr, 10% win, -0.78R | -1.24 … -0.22 | 0.36 | 47.5 | no | no |
| all | partial | 91 tr, 44% win, -0.28R | 54 tr, 44% win, -0.11R | -0.51 … +0.27 | 0.82 | 11.6 | no | no |
| all | trail | 91 tr, 37% win, -0.26R | 54 tr, 46% win, -0.13R | -0.53 … +0.26 | 0.79 | 12.2 | no | no |
| with HTF structure (HH/HL) | plan | 18 tr, 0% win, -1.35R | 20 tr, 5% win, -0.80R | -1.30 … +0.18 | 0.33 | 15.9 | no | no |
| with HTF structure (HH/HL) | 2R | 17 tr, 12% win, -0.97R | 16 tr, 25% win, -0.51R | – | 0.45 | 8.2 | no | no |
| with HTF structure (HH/HL) | 3R | 17 tr, 6% win, -1.09R | 16 tr, 25% win, -0.26R | – | 0.72 | 8.2 | no | no |
| with HTF structure (HH/HL) | opp | 11 tr, 9% win, -0.96R | 13 tr, 8% win, -0.76R | – | 0.36 | 9.9 | no | no |
| with HTF structure (HH/HL) | partial | 17 tr, 41% win, -0.61R | 16 tr, 25% win, -0.42R | – | 0.44 | 8.2 | no | no |
| with HTF structure (HH/HL) | trail | 17 tr, 29% win, -0.67R | 16 tr, 25% win, -0.29R | – | 0.61 | 8.2 | no | no |
| with HTF trend line | plan | 2 tr, 50% win, +4.87R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | 2R | 3 tr, 33% win, -0.43R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | 3R | 3 tr, 33% win, -0.10R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | opp | 2 tr, 50% win, +1.22R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | partial | 3 tr, 33% win, -0.43R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF trend line | trail | 3 tr, 33% win, -0.46R | 0 tr, –% win, –R | – | – | 0.0 | no | no |
| with HTF structure or line | plan | 19 tr, 5% win, -0.70R | 20 tr, 5% win, -0.80R | -1.30 … +0.18 | 0.33 | 15.9 | no | no |
| with HTF structure or line | 2R | 19 tr, 16% win, -0.87R | 16 tr, 25% win, -0.51R | – | 0.45 | 8.2 | no | no |
| with HTF structure or line | 3R | 19 tr, 11% win, -0.92R | 16 tr, 25% win, -0.26R | – | 0.72 | 8.2 | no | no |
| with HTF structure or line | opp | 12 tr, 17% win, -0.57R | 13 tr, 8% win, -0.76R | – | 0.36 | 9.9 | no | no |
| with HTF structure or line | partial | 19 tr, 42% win, -0.54R | 16 tr, 25% win, -0.42R | – | 0.44 | 8.2 | no | no |
| with HTF structure or line | trail | 19 tr, 32% win, -0.60R | 16 tr, 25% win, -0.29R | – | 0.61 | 8.2 | no | no |
| not against HTF (struct >= 0) | plan | 47 tr, 2% win, -1.05R | 30 tr, 3% win, -0.98R | -1.34 … -0.32 | 0.21 | 29.3 | no | no |
| not against HTF (struct >= 0) | 2R | 45 tr, 22% win, -0.64R | 22 tr, 23% win, -0.61R | -1.07 … -0.04 | 0.39 | 13.7 | no | no |
| not against HTF (struct >= 0) | 3R | 45 tr, 16% win, -0.69R | 22 tr, 23% win, -0.38R | -0.98 … +0.37 | 0.62 | 13.7 | no | no |
| not against HTF (struct >= 0) | opp | 34 tr, 3% win, -1.16R | 19 tr, 11% win, -0.88R | – | 0.25 | 16.8 | no | no |
| not against HTF (struct >= 0) | partial | 45 tr, 38% win, -0.49R | 22 tr, 27% win, -0.47R | -0.89 … +0.02 | 0.41 | 12.5 | no | no |
| not against HTF (struct >= 0) | trail | 45 tr, 27% win, -0.55R | 22 tr, 27% win, -0.26R | -0.87 … +0.54 | 0.68 | 12.5 | no | no |
| HTF discount / premium (loc <= 50) | plan | 68 tr, 6% win, -0.28R | 61 tr, 7% win, -0.62R | -1.24 … +0.24 | 0.50 | 54.1 | no | no |
| HTF discount / premium (loc <= 50) | 2R | 55 tr, 38% win, -0.15R | 47 tr, 45% win, +0.00R | -0.42 … +0.42 | 1.00 | 6.7 | no | no |
| HTF discount / premium (loc <= 50) | 3R | 55 tr, 22% win, -0.42R | 47 tr, 38% win, +0.19R | -0.37 … +0.79 | 1.24 | 7.1 | no | no |
| HTF discount / premium (loc <= 50) | opp | 53 tr, 13% win, -0.42R | 45 tr, 9% win, -0.78R | -1.32 … -0.07 | 0.37 | 43.7 | no | no |
| HTF discount / premium (loc <= 50) | partial | 55 tr, 45% win, -0.21R | 47 tr, 47% win, -0.03R | -0.44 … +0.36 | 0.94 | 6.7 | no | no |
| HTF discount / premium (loc <= 50) | trail | 55 tr, 42% win, -0.18R | 47 tr, 49% win, -0.11R | -0.50 … +0.32 | 0.81 | 10.1 | no | no |
| HTF deep (loc <= 25) | plan | 50 tr, 6% win, -0.17R | 40 tr, 8% win, -0.45R | -1.28 … +0.82 | 0.63 | 38.7 | no | no |
| HTF deep (loc <= 25) | 2R | 40 tr, 40% win, -0.10R | 32 tr, 44% win, +0.02R | -0.54 … +0.59 | 1.03 | 8.5 | no | no |
| HTF deep (loc <= 25) | 3R | 40 tr, 22% win, -0.40R | 32 tr, 34% win, +0.08R | -0.67 … +0.80 | 1.10 | 7.5 | no | no |
| HTF deep (loc <= 25) | opp | 39 tr, 15% win, -0.24R | 32 tr, 9% win, -0.71R | -1.30 … +0.29 | 0.40 | 32.9 | no | no |
| HTF deep (loc <= 25) | partial | 40 tr, 42% win, -0.22R | 32 tr, 50% win, -0.03R | -0.55 … +0.46 | 0.94 | 8.5 | no | no |
| HTF deep (loc <= 25) | trail | 40 tr, 42% win, -0.13R | 32 tr, 50% win, -0.20R | -0.64 … +0.24 | 0.64 | 8.3 | no | no |
| nested in HTF zone | plan | 21 tr, 0% win, -1.37R | 18 tr, 6% win, -0.70R | – | 0.47 | 23.8 | no | no |
| nested in HTF zone | 2R | 18 tr, 44% win, -0.00R | 13 tr, 46% win, -0.03R | – | 0.96 | 3.8 | no | no |
| nested in HTF zone | 3R | 18 tr, 11% win, -0.89R | 13 tr, 38% win, +0.13R | – | 1.15 | 5.7 | no | no |
| nested in HTF zone | opp | 17 tr, 6% win, -1.12R | 12 tr, 17% win, +0.18R | – | 1.15 | 12.8 | no | no |
| nested in HTF zone | partial | 18 tr, 39% win, -0.36R | 13 tr, 38% win, -0.14R | – | 0.78 | 5.0 | no | no |
| nested in HTF zone | trail | 18 tr, 33% win, -0.35R | 13 tr, 46% win, -0.16R | – | 0.75 | 5.5 | no | no |
| strong leg-out (body >= 1.2 ATR) | plan | 68 tr, 6% win, -0.32R | 48 tr, 6% win, -0.78R | -1.34 … -0.15 | 0.38 | 47.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | 2R | 59 tr, 32% win, -0.38R | 39 tr, 46% win, +0.05R | -0.43 … +0.50 | 1.07 | 7.8 | no | no |
| strong leg-out (body >= 1.2 ATR) | 3R | 59 tr, 22% win, -0.46R | 39 tr, 36% win, +0.10R | -0.55 … +0.75 | 1.12 | 11.0 | no | no |
| strong leg-out (body >= 1.2 ATR) | opp | 50 tr, 12% win, -0.47R | 37 tr, 11% win, -0.65R | -1.29 … +0.18 | 0.46 | 34.1 | no | no |
| strong leg-out (body >= 1.2 ATR) | partial | 59 tr, 42% win, -0.31R | 39 tr, 49% win, -0.03R | -0.46 … +0.41 | 0.95 | 9.6 | no | no |
| strong leg-out (body >= 1.2 ATR) | trail | 59 tr, 39% win, -0.27R | 39 tr, 51% win, -0.13R | -0.51 … +0.27 | 0.76 | 9.3 | no | no |
| small base (<= 2 candles) | plan | 86 tr, 3% win, -0.65R | 60 tr, 7% win, -0.71R | -1.30 … +0.07 | 0.43 | 59.5 | no | no |
| small base (<= 2 candles) | 2R | 73 tr, 32% win, -0.37R | 44 tr, 50% win, +0.17R | -0.31 … +0.62 | 1.27 | 5.9 | no | no |
| small base (<= 2 candles) | 3R | 73 tr, 19% win, -0.55R | 44 tr, 41% win, +0.31R | -0.27 … +0.89 | 1.40 | 5.9 | no | no |
| small base (<= 2 candles) | opp | 64 tr, 9% win, -0.67R | 42 tr, 12% win, -0.67R | -1.22 … +0.08 | 0.44 | 36.8 | no | no |
| small base (<= 2 candles) | partial | 73 tr, 42% win, -0.30R | 44 tr, 52% win, +0.10R | -0.32 … +0.50 | 1.22 | 5.4 | no | no |
| small base (<= 2 candles) | trail | 73 tr, 36% win, -0.29R | 44 tr, 55% win, +0.05R | -0.37 … +0.51 | 1.09 | 7.0 | no | no |
| room >= 2R to opposite zone | plan | 75 tr, 3% win, -0.61R | 50 tr, 8% win, -0.46R | -1.18 … +0.63 | 0.62 | 43.5 | no | no |
| room >= 2R to opposite zone | 2R | 64 tr, 28% win, -0.46R | 34 tr, 50% win, +0.16R | -0.40 … +0.62 | 1.25 | 5.4 | no | no |
| room >= 2R to opposite zone | 3R | 64 tr, 19% win, -0.56R | 34 tr, 38% win, +0.19R | -0.53 … +0.85 | 1.23 | 6.8 | no | no |
| room >= 2R to opposite zone | opp | 52 tr, 6% win, -0.74R | 31 tr, 6% win, -0.79R | -1.38 … +0.20 | 0.38 | 31.9 | no | no |
| room >= 2R to opposite zone | partial | 64 tr, 45% win, -0.30R | 34 tr, 47% win, -0.02R | -0.50 … +0.38 | 0.96 | 5.4 | no | no |
| room >= 2R to opposite zone | trail | 64 tr, 41% win, -0.29R | 34 tr, 47% win, -0.00R | -0.50 … +0.54 | 1.00 | 6.8 | no | no |
| HTF struct + discount | plan | 6 tr, 0% win, -1.33R | 19 tr, 5% win, -0.78R | – | 0.35 | 14.8 | no | no |
| HTF struct + discount | 2R | 5 tr, 20% win, -0.77R | 15 tr, 27% win, -0.47R | – | 0.49 | 7.1 | no | no |
| HTF struct + discount | 3R | 5 tr, 20% win, -0.57R | 15 tr, 27% win, -0.21R | – | 0.78 | 7.0 | no | no |
| HTF struct + discount | opp | 5 tr, 20% win, -0.58R | 13 tr, 8% win, -0.76R | – | 0.36 | 9.9 | no | no |
| HTF struct + discount | partial | 5 tr, 60% win, -0.17R | 15 tr, 27% win, -0.37R | – | 0.48 | 7.0 | no | no |
| HTF struct + discount | trail | 5 tr, 60% win, -0.26R | 15 tr, 27% win, -0.24R | – | 0.68 | 7.0 | no | no |
| HTF struct or line + discount | plan | 7 tr, 14% win, +0.44R | 19 tr, 5% win, -0.78R | – | 0.35 | 14.8 | no | no |
| HTF struct or line + discount | 2R | 6 tr, 33% win, -0.40R | 15 tr, 27% win, -0.47R | – | 0.49 | 7.1 | no | no |
| HTF struct or line + discount | 3R | 6 tr, 33% win, -0.06R | 15 tr, 27% win, -0.21R | – | 0.78 | 7.0 | no | no |
| HTF struct or line + discount | opp | 6 tr, 33% win, +0.14R | 13 tr, 8% win, -0.76R | – | 0.36 | 9.9 | no | no |
| HTF struct or line + discount | partial | 6 tr, 67% win, +0.10R | 15 tr, 27% win, -0.37R | – | 0.48 | 7.0 | no | no |
| HTF struct or line + discount | trail | 6 tr, 67% win, +0.02R | 15 tr, 27% win, -0.24R | – | 0.68 | 7.0 | no | no |
| HTF struct + discount + strong leg | plan | 4 tr, 0% win, -1.44R | 14 tr, 7% win, -0.60R | – | 0.49 | 10.7 | no | no |
| HTF struct + discount + strong leg | 2R | 4 tr, 25% win, -0.69R | 12 tr, 25% win, -0.51R | – | 0.46 | 7.0 | no | no |
| HTF struct + discount + strong leg | 3R | 4 tr, 25% win, -0.44R | 12 tr, 25% win, -0.26R | – | 0.72 | 7.0 | no | no |
| HTF struct + discount + strong leg | opp | 4 tr, 25% win, -0.45R | 10 tr, 10% win, -0.59R | – | 0.48 | 5.9 | no | no |
| HTF struct + discount + strong leg | partial | 4 tr, 75% win, +0.06R | 12 tr, 25% win, -0.39R | – | 0.45 | 7.0 | no | no |
| HTF struct + discount + strong leg | trail | 4 tr, 75% win, -0.05R | 12 tr, 25% win, -0.43R | – | 0.40 | 7.0 | no | no |
| HTF struct + discount + room 2R | plan | 5 tr, 0% win, -1.27R | 13 tr, 8% win, -0.56R | – | 0.52 | 7.6 | no | no |
| HTF struct + discount + room 2R | 2R | 4 tr, 0% win, -1.31R | 9 tr, 33% win, -0.29R | – | 0.65 | 3.3 | no | no |
| HTF struct + discount + room 2R | 3R | 4 tr, 0% win, -1.31R | 9 tr, 33% win, +0.04R | – | 1.05 | 2.6 | no | no |
| HTF struct + discount + room 2R | opp | 4 tr, 0% win, -1.31R | 7 tr, 0% win, -1.30R | – | 0.00 | 9.1 | no | no |
| HTF struct + discount + room 2R | partial | 4 tr, 50% win, -0.56R | 9 tr, 33% win, -0.29R | – | 0.57 | 3.4 | no | no |
| HTF struct + discount + room 2R | trail | 4 tr, 50% win, -0.55R | 9 tr, 22% win, +0.07R | – | 1.10 | 3.9 | no | no |

### Every zone (control)

| filter | management | train 2010-19 | test 2020-26 | test 95% CI (week blocks) | test PF | test max DD | picked on train | holds out of sample |
|---|---|---|---|---|---|---|---|---|
| all | 2R | 20783 tr, 33% win, -0.08R | 14276 tr, 33% win, -0.09R | -0.12 … -0.07 | 0.87 | 1316.0 | no | no |
| all | 3R | 20783 tr, 26% win, -0.08R | 14267 tr, 26% win, -0.10R | -0.13 … -0.06 | 0.88 | 1402.5 | no | no |
| all | opp | 15025 tr, 38% win, -0.08R | 10345 tr, 38% win, -0.09R | -0.13 … -0.06 | 0.86 | 941.8 | no | no |
| all | partial | 20783 tr, 48% win, -0.09R | 14276 tr, 48% win, -0.10R | -0.12 … -0.08 | 0.82 | 1404.9 | no | no |
| all | trail | 20783 tr, 42% win, -0.06R | 14281 tr, 42% win, -0.08R | -0.11 … -0.06 | 0.85 | 1214.7 | no | no |
| with HTF structure (HH/HL) | 2R | 8015 tr, 33% win, -0.10R | 5581 tr, 33% win, -0.10R | -0.15 … -0.06 | 0.86 | 593.3 | no | no |
| with HTF structure (HH/HL) | 3R | 8015 tr, 25% win, -0.09R | 5575 tr, 25% win, -0.11R | -0.17 … -0.05 | 0.87 | 604.4 | no | no |
| with HTF structure (HH/HL) | opp | 4069 tr, 39% win, -0.09R | 2929 tr, 40% win, -0.11R | -0.17 … -0.05 | 0.83 | 320.8 | no | no |
| with HTF structure (HH/HL) | partial | 8015 tr, 48% win, -0.10R | 5580 tr, 48% win, -0.10R | -0.14 … -0.07 | 0.82 | 580.7 | no | no |
| with HTF structure (HH/HL) | trail | 8015 tr, 42% win, -0.08R | 5584 tr, 42% win, -0.08R | -0.13 … -0.04 | 0.86 | 467.2 | no | no |
| with HTF trend line | 2R | 1313 tr, 31% win, -0.14R | 827 tr, 35% win, -0.05R | -0.15 … +0.07 | 0.93 | 77.3 | no | no |
| with HTF trend line | 3R | 1313 tr, 25% win, -0.09R | 827 tr, 26% win, -0.08R | -0.21 … +0.05 | 0.89 | 119.5 | no | no |
| with HTF trend line | opp | 387 tr, 42% win, -0.04R | 261 tr, 45% win, -0.01R | -0.21 … +0.18 | 0.98 | 32.9 | no | no |
| with HTF trend line | partial | 1313 tr, 48% win, -0.12R | 827 tr, 49% win, -0.09R | -0.18 … +0.01 | 0.84 | 97.1 | no | no |
| with HTF trend line | trail | 1313 tr, 42% win, -0.09R | 827 tr, 43% win, -0.02R | -0.13 … +0.10 | 0.96 | 61.7 | no | no |
| with HTF structure or line | 2R | 8176 tr, 32% win, -0.10R | 5698 tr, 33% win, -0.10R | -0.15 … -0.06 | 0.86 | 601.2 | no | no |
| with HTF structure or line | 3R | 8176 tr, 25% win, -0.09R | 5692 tr, 25% win, -0.11R | -0.16 … -0.06 | 0.86 | 631.2 | no | no |
| with HTF structure or line | opp | 4156 tr, 39% win, -0.09R | 2986 tr, 40% win, -0.11R | -0.17 … -0.04 | 0.83 | 325.6 | no | no |
| with HTF structure or line | partial | 8176 tr, 48% win, -0.10R | 5697 tr, 48% win, -0.10R | -0.14 … -0.07 | 0.81 | 599.3 | no | no |
| with HTF structure or line | trail | 8176 tr, 42% win, -0.08R | 5701 tr, 42% win, -0.08R | -0.12 … -0.04 | 0.86 | 481.1 | no | no |
| not against HTF (struct >= 0) | 2R | 12822 tr, 32% win, -0.10R | 8829 tr, 33% win, -0.11R | -0.15 … -0.07 | 0.85 | 981.4 | no | no |
| not against HTF (struct >= 0) | 3R | 12822 tr, 25% win, -0.09R | 8821 tr, 25% win, -0.12R | -0.16 … -0.08 | 0.85 | 1067.7 | no | no |
| not against HTF (struct >= 0) | opp | 7911 tr, 38% win, -0.09R | 5516 tr, 40% win, -0.11R | -0.15 … -0.06 | 0.83 | 586.5 | no | no |
| not against HTF (struct >= 0) | partial | 12822 tr, 48% win, -0.10R | 8828 tr, 48% win, -0.11R | -0.14 … -0.08 | 0.81 | 965.5 | no | no |
| not against HTF (struct >= 0) | trail | 12822 tr, 42% win, -0.08R | 8833 tr, 42% win, -0.10R | -0.13 … -0.06 | 0.83 | 873.6 | no | no |
| HTF discount / premium (loc <= 50) | 2R | 10267 tr, 34% win, -0.07R | 6946 tr, 33% win, -0.10R | -0.14 … -0.05 | 0.86 | 708.1 | no | no |
| HTF discount / premium (loc <= 50) | 3R | 10267 tr, 27% win, -0.05R | 6941 tr, 25% win, -0.10R | -0.15 … -0.05 | 0.87 | 711.0 | no | no |
| HTF discount / premium (loc <= 50) | opp | 9045 tr, 37% win, -0.05R | 6214 tr, 36% win, -0.08R | -0.13 … -0.03 | 0.88 | 530.3 | no | no |
| HTF discount / premium (loc <= 50) | partial | 10267 tr, 48% win, -0.08R | 6945 tr, 48% win, -0.10R | -0.14 … -0.07 | 0.82 | 719.1 | no | no |
| HTF discount / premium (loc <= 50) | trail | 10267 tr, 42% win, -0.05R | 6948 tr, 41% win, -0.09R | -0.13 … -0.05 | 0.84 | 650.9 | no | no |
| HTF deep (loc <= 25) | 2R | 5128 tr, 35% win, -0.04R | 3435 tr, 34% win, -0.07R | -0.14 … -0.01 | 0.90 | 267.3 | no | no |
| HTF deep (loc <= 25) | 3R | 5128 tr, 27% win, -0.03R | 3432 tr, 26% win, -0.08R | -0.15 … -0.00 | 0.90 | 273.6 | no | no |
| HTF deep (loc <= 25) | opp | 4909 tr, 36% win, -0.04R | 3293 tr, 35% win, -0.08R | -0.15 … -0.00 | 0.89 | 264.7 | no | no |
| HTF deep (loc <= 25) | partial | 5128 tr, 48% win, -0.07R | 3435 tr, 49% win, -0.08R | -0.13 … -0.03 | 0.85 | 293.8 | no | no |
| HTF deep (loc <= 25) | trail | 5128 tr, 43% win, -0.03R | 3438 tr, 42% win, -0.06R | -0.11 … +0.01 | 0.90 | 205.4 | no | no |
| nested in HTF zone | 2R | 2418 tr, 35% win, -0.02R | 1564 tr, 34% win, -0.05R | -0.13 … +0.03 | 0.93 | 121.9 | no | no |
| nested in HTF zone | 3R | 2418 tr, 29% win, +0.02R | 1562 tr, 28% win, -0.04R | -0.14 … +0.05 | 0.94 | 104.7 | yes | no |
| nested in HTF zone | opp | 2179 tr, 46% win, -0.04R | 1444 tr, 46% win, -0.04R | -0.11 … +0.04 | 0.92 | 107.4 | no | no |
| nested in HTF zone | partial | 2418 tr, 50% win, -0.02R | 1563 tr, 49% win, -0.04R | -0.10 … +0.02 | 0.92 | 94.5 | no | no |
| nested in HTF zone | trail | 2418 tr, 45% win, -0.03R | 1564 tr, 45% win, -0.07R | -0.14 … +0.00 | 0.88 | 127.9 | no | no |
| strong leg-out (body >= 1.2 ATR) | 2R | 7868 tr, 34% win, -0.07R | 5056 tr, 34% win, -0.08R | -0.12 … -0.03 | 0.89 | 435.8 | no | no |
| strong leg-out (body >= 1.2 ATR) | 3R | 7868 tr, 26% win, -0.06R | 5052 tr, 26% win, -0.08R | -0.14 … -0.03 | 0.89 | 477.9 | no | no |
| strong leg-out (body >= 1.2 ATR) | opp | 5516 tr, 36% win, -0.07R | 3560 tr, 37% win, -0.10R | -0.15 … -0.03 | 0.86 | 350.3 | no | no |
| strong leg-out (body >= 1.2 ATR) | partial | 7868 tr, 49% win, -0.08R | 5054 tr, 48% win, -0.09R | -0.13 … -0.06 | 0.83 | 497.2 | no | no |
| strong leg-out (body >= 1.2 ATR) | trail | 7868 tr, 43% win, -0.05R | 5056 tr, 42% win, -0.08R | -0.13 … -0.05 | 0.85 | 474.2 | no | no |
| small base (<= 2 candles) | 2R | 16635 tr, 33% win, -0.09R | 11656 tr, 33% win, -0.10R | -0.13 … -0.07 | 0.86 | 1145.9 | no | no |
| small base (<= 2 candles) | 3R | 16635 tr, 26% win, -0.08R | 11650 tr, 26% win, -0.10R | -0.14 … -0.07 | 0.87 | 1184.7 | no | no |
| small base (<= 2 candles) | opp | 12041 tr, 36% win, -0.08R | 8479 tr, 37% win, -0.10R | -0.14 … -0.06 | 0.85 | 855.5 | no | no |
| small base (<= 2 candles) | partial | 16635 tr, 47% win, -0.10R | 11656 tr, 48% win, -0.11R | -0.13 … -0.09 | 0.81 | 1260.7 | no | no |
| small base (<= 2 candles) | trail | 16635 tr, 42% win, -0.07R | 11660 tr, 42% win, -0.09R | -0.12 … -0.06 | 0.84 | 1066.9 | no | no |
| room >= 2R to opposite zone | 2R | 12631 tr, 32% win, -0.12R | 8454 tr, 33% win, -0.10R | -0.14 … -0.07 | 0.86 | 880.6 | no | no |
| room >= 2R to opposite zone | 3R | 12631 tr, 25% win, -0.11R | 8449 tr, 25% win, -0.11R | -0.15 … -0.07 | 0.87 | 930.4 | no | no |
| room >= 2R to opposite zone | opp | 6873 tr, 21% win, -0.10R | 4518 tr, 21% win, -0.11R | -0.18 … -0.04 | 0.87 | 538.0 | no | no |
| room >= 2R to opposite zone | partial | 12631 tr, 47% win, -0.12R | 8455 tr, 48% win, -0.11R | -0.14 … -0.09 | 0.80 | 969.4 | no | no |
| room >= 2R to opposite zone | trail | 12631 tr, 41% win, -0.09R | 8456 tr, 41% win, -0.09R | -0.12 … -0.06 | 0.84 | 779.2 | no | no |
| HTF struct + discount | 2R | 2556 tr, 32% win, -0.12R | 1650 tr, 31% win, -0.16R | -0.23 … -0.08 | 0.79 | 266.4 | no | no |
| HTF struct + discount | 3R | 2556 tr, 25% win, -0.10R | 1646 tr, 24% win, -0.13R | -0.22 … -0.04 | 0.84 | 214.4 | no | no |
| HTF struct + discount | opp | 1888 tr, 38% win, -0.06R | 1277 tr, 37% win, -0.13R | -0.23 … -0.04 | 0.81 | 178.1 | no | no |
| HTF struct + discount | partial | 2556 tr, 47% win, -0.12R | 1648 tr, 46% win, -0.13R | -0.19 … -0.07 | 0.77 | 216.9 | no | no |
| HTF struct + discount | trail | 2556 tr, 41% win, -0.10R | 1650 tr, 41% win, -0.13R | -0.19 … -0.06 | 0.78 | 219.4 | no | no |
| HTF struct or line + discount | 2R | 2589 tr, 32% win, -0.12R | 1664 tr, 31% win, -0.16R | -0.23 … -0.08 | 0.79 | 269.4 | no | no |
| HTF struct or line + discount | 3R | 2589 tr, 25% win, -0.10R | 1660 tr, 24% win, -0.13R | -0.22 … -0.04 | 0.84 | 220.0 | no | no |
| HTF struct or line + discount | opp | 1908 tr, 38% win, -0.06R | 1286 tr, 37% win, -0.13R | -0.22 … -0.04 | 0.81 | 181.3 | no | no |
| HTF struct or line + discount | partial | 2589 tr, 47% win, -0.12R | 1662 tr, 46% win, -0.13R | -0.19 … -0.07 | 0.77 | 222.9 | no | no |
| HTF struct or line + discount | trail | 2589 tr, 41% win, -0.10R | 1664 tr, 41% win, -0.13R | -0.20 … -0.07 | 0.77 | 225.4 | no | no |
| HTF struct + discount + strong leg | 2R | 983 tr, 34% win, -0.05R | 614 tr, 31% win, -0.14R | -0.25 … -0.03 | 0.80 | 107.4 | no | no |
| HTF struct + discount + strong leg | 3R | 983 tr, 27% win, -0.03R | 611 tr, 25% win, -0.11R | -0.25 … +0.02 | 0.86 | 86.9 | no | no |
| HTF struct + discount + strong leg | opp | 686 tr, 38% win, -0.02R | 456 tr, 34% win, -0.17R | -0.31 … -0.01 | 0.76 | 80.8 | no | no |
| HTF struct + discount + strong leg | partial | 983 tr, 49% win, -0.06R | 612 tr, 47% win, -0.12R | -0.21 … -0.04 | 0.79 | 84.0 | no | no |
| HTF struct + discount + strong leg | trail | 983 tr, 43% win, -0.06R | 613 tr, 40% win, -0.15R | -0.24 … -0.05 | 0.74 | 108.6 | no | no |
| HTF struct + discount + room 2R | 2R | 1549 tr, 30% win, -0.17R | 962 tr, 32% win, -0.15R | -0.24 … -0.06 | 0.80 | 148.1 | no | no |
| HTF struct + discount + room 2R | 3R | 1549 tr, 24% win, -0.13R | 959 tr, 24% win, -0.16R | -0.27 … -0.04 | 0.81 | 160.7 | no | no |
| HTF struct + discount + room 2R | opp | 881 tr, 21% win, -0.06R | 588 tr, 20% win, -0.16R | -0.33 … +0.01 | 0.82 | 122.1 | no | no |
| HTF struct + discount + room 2R | partial | 1549 tr, 44% win, -0.16R | 961 tr, 46% win, -0.15R | -0.22 … -0.08 | 0.74 | 145.7 | no | no |
| HTF struct + discount + room 2R | trail | 1549 tr, 38% win, -0.14R | 962 tr, 40% win, -0.14R | -0.23 … -0.05 | 0.76 | 140.0 | no | no |

## Data / counts

| instrument TF | candidates | verified | not current | fine bars missing (fallback) | LTF checked | LTF arrival conf. | LTF structure-break | realign areas | realign confirmations | control zones | control unfilled |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | 356 | 356 | 0 | 0 | 356 | 8 | 88 | 45 | 1 | 0 | 0 |
| H4 | 1556 | 1548 | 8 | 0 | 1548 | 17 | 382 | 181 | 0 | 0 | 0 |
| MN | 20 | 20 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| W1 | 98 | 98 | 0 | 0 | 98 | 3 | 32 | 18 | 0 | 0 | 0 |
| ctrl D1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10806 | 4920 |
| ctrl H4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 54318 | 25130 |

OANDA fine-bar requests: 105 (cached 0, errors 0). Errors: 0.

## Caveats

- Kevin: ~4 months of calls, one market regime; prices read off his chart frames / speech; he chooses which charts to show (selection) and mentions wins more than losses (reporting). OANDA prices differ slightly from his feed (indices / oil / gas most). Targets are ours (he names almost none). Treat his numbers as a sample of ~1 quarter.
- FX instruments are correlated (USD pairs fill the same week): the "week blocks" CI resamples whole weeks and is the honest one; the trade CI is optimistic.
- Fine bars: one 5000-candle OANDA window per setup; a trade still open at the window end is "open" (not counted). Inside one fine bar the stop still comes first. Spread = the median of the last ~3000 H4 spreads (constant).
- Walk-forward: one split; the filters were chosen from Raja / Kevin principles before looking, but many were tried.

## Charts

![r2_expectancy.png](r2_expectancy.png)
![r2_profile.png](r2_profile.png)
![r2_walkforward.png](r2_walkforward.png)
![r2_equity_test.png](r2_equity_test.png)
