# Arrival study, round 3: outside-evidence hypotheses on every zone and every arrival

Generated 2026-11-03 05:37 UTC by `tools/research/arrival_study/round3.py` (GitHub Actions, OANDA practice). 115 instruments, runtime 48 min.

## The answer in plain English

**Nothing survived.** We tested 62 hypotheses with outside evidence behind them (long-horizon trend, zone pattern, volatility regime, session, stop width, exits, second-touch depth and a few pairs). None was positive in the training years, positive in 2020–2026, positive in both random halves of the instruments **and** significant after the false-discovery check.

- Baseline, every fresh zone (D1 + H4) at 2R: train -0.08R (n = 20783), test -0.09R (n = 14284, CI -0.12 … -0.07).
- Baseline, arrivals at 2R: train -0.08R (n = 2174), test -0.11R (n = 1488, CI -0.19 … -0.03).
- Baseline, second-touch zones at 2R: train -0.08R (n = 7127), test -0.07R (n = 5041, CI -0.11 … -0.03).
- **What doesn't work:** 59 of 62 hypotheses lost money (avg R ≤ 0) in 2020–2026: arrival: H4 zone filled in London (07-12 UTC), fixed 2R -0.29R; arrival: every setup, stop at distal + 0.1 ATR, 2R -0.20R; arrival: ATR percentile < 30 (quiet), fixed 2R -0.18R; zone: H4 zone filled in NY (16-21 UTC), fixed 2R -0.18R; arrival: H4 zone filled in the London-NY overlap (12-16 UTC), fixed 2R -0.18R; arrival: 12-month momentum + quiet (ATR pct < 30), fixed 2R -0.17R ….
- 1 hypotheses looked positive in 2010–2019 (≥ 30 trades); 1 of them stayed positive in 2020–2026 (before the halves and the FDR check).
- Best test-period expectancies (≥ 30 trades; the FDR column says whether it is more than luck):
  - arrivals: side agrees with the 12-month return, stop at distal + 1.0 ATR, 2R: +0.07R (n = 678, p = 0.1291, halves +0.05 / +0.10, BH no)
  - arrivals: 12-month momentum + volatile (ATR pct > 70), fixed 2R: +0.03R (n = 188, p = 0.3716, halves +0.01 / +0.06, BH no)
  - arrivals: 12-month momentum + reversal zone, fixed 2R: +0.02R (n = 279, p = 0.3919, halves +0.04 / +0.00, BH no)
  - arrivals: H4 zone filled in Asia (21-07 UTC), fixed 2R: -0.01R (n = 299, p = 0.5537, halves -0.13 / +0.11, BH no)
  - arrivals: side agrees with the 12-month return, trail behind the entry-TF swing after 1.5R: -0.01R (n = 677, p = 0.5627, halves -0.00 / -0.03, BH no)

**How sure:** 62 hypotheses were counted, so about 3 would look 'significant' at p < 0.05 by luck alone. Bonferroni needs p < 0.00081; Benjamini-Hochberg controls the share of false discoveries at 5%. The week-block CI is the honest one (correlated USD pairs fill the same weeks).

## What was tested and why

Each hypothesis was fixed before any result, on the same setups as round 2 (same zones, arrivals, fills, stop rule, spread cost and simulator). Outside evidence behind each:

1. **Long-horizon trend (time-series momentum).** Moskowitz, Ooi & Pedersen (2012), "Time series momentum": the 12-month return predicts the next month in 58 futures / FX markets; the 200-day SMA rule (Faber 2007; Brock, Lakonishok & LeBaron 1992). Tested: side agrees with the sign of the 252-D1-bar return, with close vs the 200-day SMA, and both.
2. **Zone pattern.** Continuation vs reversal bases (trend continuation is what momentum predicts; reversal is the short-horizon mean-reversion effect, Lo & MacKinlay 1990). Tested: reversal (DBR / RBD), continuation (RBR / DBD), continuation + 12-month momentum.
3. **Volatility regime.** Volatility clusters (Engle 1982, ARCH) and volatility-managed returns differ by regime (Moreira & Muir 2017). Tested: entry-TF ATR14 percentile over the last 250 bars < 30, 30–70, > 70, > 90.
4. **Session of the fill (H4 only).** FX volume and price discovery concentrate in London and the London–NY overlap (BIS Triennial Survey; Ito & Hashimoto 2006). Tested from the UTC hour the fill bar starts: Asia 21–07, London 07–12, overlap 12–16, NY 16–21.
5. **Stop width.** Tight stops pay the spread on a small R (round 2: stops < 0.6 ATR did −0.23R) and noise stops them out (Kaminski & Lo 2014, "When do stop-loss rules stop losses?"). Tested: stop at distal + 0.1 / 0.5 / 1.0 × ATR14, R and the 2R target recomputed, same fills.
6. **Exits.** Time stops and trailing exits (Kaminski & Lo 2014; trend-following practice, e.g. Clenow 2013). Tested: 2R + time stop (out at the close when +1R was not reached in 10 TF bars), break-even at 2R with a 3R target, fixed 1.5R and 3R, trail behind the newest confirmed entry-TF swing once +1.5R.
7. **Freshness / depth.** Order-flow depletion at a level (Osler 2003, "Currency orders and exchange-rate dynamics": stop / take-profit order clustering at round levels and prior extremes). Tested on second-touch trades: first return ≥ 25% vs < 25% of the zone height.
8. **Pairs.** Only a few pairs of the above (no grid): mom12+rev @ 2R, sma200+rev @ 2R, mom12+vol<30 @ 2R, mom12+vol>70 @ 2R, rev+vol>70 @ 2R, mom12 @ time10, mom12 @ stop1.0, mom12 @ swing.

Rows: arrivals 3,666 filled setups, second-touch zones 12,175 filled setups, every fresh zone (D1 + H4) 35,084 filled setups.

## Results: every fresh zone (D1 + H4)

Train = setups placed 2010–2019, test = 2020–2026. Half A / B = the test-period avg R (trades) in each random half of the instruments. BH = Benjamini-Hochberg discovery at q = 0.05 over all 62 counted hypotheses; Bonf. = p < 0.00081. Rows marked '0 baseline' / '0 reference' are not counted.

| family | hypothesis | train n | train win % | train avg R | test n | test win % | test avg R | test 95% CI (week blocks) | p (test, one-sided) | half A | half B | BH | Bonf. | survives |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 baseline | every setup, fixed 2R | 20783 | 33 | -0.08 | 14284 | 33 | -0.09 | -0.12 … -0.07 | 1.0000 | -0.06 (6913) | -0.13 (7371) | – | – | – |
| 1 trend | side agrees with the 12-month return, fixed 2R | 10717 | 33 | -0.08 | 7427 | 33 | -0.09 | -0.14 … -0.05 | 1.0000 | -0.07 (3585) | -0.11 (3842) | no | no | no |
| 1 trend | side agrees with close vs 200-day SMA, fixed 2R | 10863 | 32 | -0.11 | 7644 | 33 | -0.09 | -0.14 … -0.05 | 1.0000 | -0.07 (3686) | -0.12 (3958) | no | no | no |
| 1 trend | 12-month return and 200-day SMA both agree, fixed 2R | 8316 | 32 | -0.11 | 5875 | 33 | -0.10 | -0.15 … -0.05 | 0.9999 | -0.08 (2828) | -0.11 (3047) | no | no | no |
| 2 pattern | reversal zone (DBR / RBD), fixed 2R | 9941 | 33 | -0.12 | 6442 | 32 | -0.15 | -0.18 … -0.11 | 1.0000 | -0.12 (3142) | -0.17 (3300) | no | no | no |
| 2 pattern | continuation zone (RBR / DBD), fixed 2R | 10842 | 34 | -0.05 | 7842 | 34 | -0.05 | -0.09 … -0.01 | 0.9920 | -0.00 (3771) | -0.09 (4071) | no | no | no |
| 2 pattern | continuation zone + 12-month momentum agrees, fixed 2R | 5799 | 33 | -0.06 | 4203 | 34 | -0.04 | -0.10 … +0.02 | 0.9133 | -0.00 (1981) | -0.08 (2222) | no | no | no |
| 3 volatility | ATR percentile < 30 (quiet), fixed 2R | 6598 | 32 | -0.14 | 4452 | 32 | -0.12 | -0.16 … -0.07 | 1.0000 | -0.09 (2151) | -0.14 (2301) | no | no | no |
| 3 volatility | ATR percentile 30-70, fixed 2R | 7603 | 33 | -0.09 | 5391 | 33 | -0.08 | -0.12 … -0.04 | 0.9999 | -0.04 (2623) | -0.12 (2768) | no | no | no |
| 3 volatility | ATR percentile > 70 (volatile), fixed 2R | 6582 | 35 | -0.03 | 4441 | 34 | -0.08 | -0.12 … -0.03 | 0.9996 | -0.04 (2139) | -0.11 (2302) | no | no | no |
| 3 volatility | ATR percentile > 90, fixed 2R | 2545 | 36 | -0.00 | 1662 | 35 | -0.02 | -0.09 … +0.04 | 0.7545 | +0.04 (804) | -0.09 (858) | no | no | no |
| 4 session (H4) | H4 zone filled in Asia (21-07 UTC), fixed 2R | 7441 | 33 | -0.09 | 5599 | 34 | -0.06 | -0.11 … -0.02 | 0.9972 | -0.01 (2686) | -0.11 (2913) | no | no | no |
| 4 session (H4) | H4 zone filled in London (07-12 UTC), fixed 2R | 3484 | 33 | -0.10 | 2359 | 31 | -0.15 | -0.22 … -0.09 | 1.0000 | -0.13 (1185) | -0.17 (1174) | no | no | no |
| 4 session (H4) | H4 zone filled in the London-NY overlap (12-16 UTC), fixed 2R | 4423 | 33 | -0.10 | 3044 | 32 | -0.14 | -0.19 … -0.08 | 1.0000 | -0.12 (1421) | -0.15 (1623) | no | no | no |
| 4 session (H4) | H4 zone filled in NY (16-21 UTC), fixed 2R | 1798 | 33 | -0.09 | 1043 | 31 | -0.18 | -0.27 … -0.08 | 0.9999 | -0.19 (543) | -0.18 (500) | no | no | no |
| 5 stop width | every setup, stop at distal + 0.1 ATR, 2R | 20783 | 32 | -0.15 | 14297 | 33 | -0.14 | -0.17 … -0.11 | 1.0000 | -0.11 (6920) | -0.17 (7377) | no | no | no |
| 5 stop width | every setup, stop at distal + 0.5 ATR, 2R | 20783 | 33 | -0.09 | 14287 | 33 | -0.08 | -0.11 … -0.06 | 1.0000 | -0.06 (6915) | -0.11 (7372) | no | no | no |
| 5 stop width | every setup, stop at distal + 1.0 ATR, 2R | 20783 | 33 | -0.06 | 14272 | 33 | -0.06 | -0.09 … -0.04 | 1.0000 | -0.04 (6909) | -0.08 (7363) | no | no | no |
| 6 exits | every setup, fixed 2R + time stop (+1R in 10 TF bars) | 20783 | 34 | -0.09 | 14288 | 35 | -0.09 | -0.11 … -0.06 | 1.0000 | -0.06 (6916) | -0.12 (7372) | no | no | no |
| 6 exits | every setup, break-even at 2R, target 3R | 20783 | 23 | -0.07 | 14278 | 23 | -0.10 | -0.13 … -0.06 | 1.0000 | -0.05 (6910) | -0.14 (7368) | no | no | no |
| 6 exits | every setup, fixed 1.5R | 20783 | 39 | -0.09 | 14285 | 39 | -0.10 | -0.12 … -0.08 | 1.0000 | -0.07 (6913) | -0.12 (7372) | no | no | no |
| 6 exits | every setup, fixed 3R | 20783 | 26 | -0.08 | 14274 | 26 | -0.10 | -0.13 … -0.07 | 1.0000 | -0.06 (6907) | -0.14 (7367) | no | no | no |
| 6 exits | every setup, trail behind the entry-TF swing after 1.5R | 20783 | 28 | -0.05 | 14276 | 28 | -0.09 | -0.13 … -0.05 | 1.0000 | -0.07 (6909) | -0.11 (7367) | no | no | no |
| 8 pairs | 12-month momentum + reversal zone, fixed 2R | 4918 | 33 | -0.11 | 3224 | 32 | -0.16 | -0.22 … -0.11 | 1.0000 | -0.16 (1604) | -0.16 (1620) | no | no | no |
| 8 pairs | 200-day SMA + reversal zone, fixed 2R | 4912 | 32 | -0.14 | 3146 | 31 | -0.17 | -0.22 … -0.12 | 1.0000 | -0.17 (1540) | -0.17 (1606) | no | no | no |
| 8 pairs | 12-month momentum + quiet (ATR pct < 30), fixed 2R | 3460 | 31 | -0.17 | 2339 | 32 | -0.12 | -0.19 … -0.05 | 0.9997 | -0.08 (1104) | -0.15 (1235) | no | no | no |
| 8 pairs | 12-month momentum + volatile (ATR pct > 70), fixed 2R | 3317 | 35 | -0.01 | 2216 | 34 | -0.07 | -0.15 … +0.01 | 0.9675 | -0.05 (1055) | -0.10 (1161) | no | no | no |
| 8 pairs | reversal zone + volatile (ATR pct > 70), fixed 2R | 3076 | 34 | -0.07 | 2006 | 32 | -0.14 | -0.20 … -0.08 | 1.0000 | -0.12 (968) | -0.16 (1038) | no | no | no |
| 8 pairs | side agrees with the 12-month return, fixed 2R + time stop (+1R in 10 TF bars) | 10717 | 34 | -0.09 | 7428 | 35 | -0.09 | -0.13 … -0.05 | 1.0000 | -0.07 (3586) | -0.11 (3842) | no | no | no |
| 8 pairs | side agrees with the 12-month return, stop at distal + 1.0 ATR, 2R | 10717 | 33 | -0.07 | 7423 | 33 | -0.06 | -0.11 … -0.01 | 0.9934 | -0.05 (3585) | -0.08 (3838) | no | no | no |
| 8 pairs | side agrees with the 12-month return, trail behind the entry-TF swing after 1.5R | 10717 | 28 | -0.06 | 7424 | 29 | -0.07 | -0.14 … +0.00 | 0.9760 | -0.06 (3583) | -0.09 (3841) | no | no | no |
| 0 reference | side against the 12-month return, fixed 2R | 10066 | 33 | -0.09 | 6857 | 33 | -0.09 | -0.13 … -0.05 | 1.0000 | -0.04 (3328) | -0.14 (3529) | – | – | – |
| 0 reference | side against the 200-day SMA, fixed 2R | 9920 | 34 | -0.06 | 6640 | 33 | -0.09 | -0.14 … -0.04 | 0.9999 | -0.04 (3227) | -0.14 (3413) | – | – | – |

## Results: arrivals

Train = setups placed 2010–2019, test = 2020–2026. Half A / B = the test-period avg R (trades) in each random half of the instruments. BH = Benjamini-Hochberg discovery at q = 0.05 over all 62 counted hypotheses; Bonf. = p < 0.00081. Rows marked '0 baseline' / '0 reference' are not counted.

| family | hypothesis | train n | train win % | train avg R | test n | test win % | test avg R | test 95% CI (week blocks) | p (test, one-sided) | half A | half B | BH | Bonf. | survives |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 baseline | every setup, fixed 2R | 2174 | 35 | -0.08 | 1488 | 33 | -0.11 | -0.19 … -0.03 | 0.9974 | -0.16 (738) | -0.07 (750) | – | – | – |
| 1 trend | side agrees with the 12-month return, fixed 2R | 1004 | 36 | -0.03 | 678 | 35 | -0.05 | -0.15 … +0.06 | 0.7953 | -0.07 (351) | -0.02 (327) | no | no | no |
| 1 trend | side agrees with close vs 200-day SMA, fixed 2R | 1025 | 36 | -0.05 | 702 | 34 | -0.08 | -0.20 … +0.04 | 0.9100 | -0.17 (349) | +0.00 (353) | no | no | no |
| 1 trend | 12-month return and 200-day SMA both agree, fixed 2R | 765 | 37 | -0.01 | 510 | 35 | -0.04 | -0.17 … +0.10 | 0.7313 | -0.11 (261) | +0.04 (249) | no | no | no |
| 2 pattern | reversal zone (DBR / RBD), fixed 2R | 923 | 34 | -0.14 | 588 | 35 | -0.09 | -0.21 … +0.04 | 0.9244 | -0.11 (301) | -0.08 (287) | no | no | no |
| 2 pattern | continuation zone (RBR / DBD), fixed 2R | 1251 | 35 | -0.04 | 900 | 31 | -0.13 | -0.24 … -0.02 | 0.9886 | -0.20 (437) | -0.06 (463) | no | no | no |
| 2 pattern | continuation zone + 12-month momentum agrees, fixed 2R | 615 | 36 | -0.01 | 399 | 33 | -0.10 | -0.24 … +0.06 | 0.8937 | -0.16 (199) | -0.04 (200) | no | no | no |
| 3 volatility | ATR percentile < 30 (quiet), fixed 2R | 623 | 35 | -0.08 | 403 | 31 | -0.18 | -0.33 … -0.04 | 0.9932 | -0.37 (206) | +0.01 (197) | no | no | no |
| 3 volatility | ATR percentile 30-70, fixed 2R | 852 | 34 | -0.11 | 610 | 34 | -0.07 | -0.19 … +0.05 | 0.8545 | -0.06 (294) | -0.07 (316) | no | no | no |
| 3 volatility | ATR percentile > 70 (volatile), fixed 2R | 656 | 35 | -0.07 | 469 | 33 | -0.11 | -0.23 … +0.03 | 0.9449 | -0.09 (233) | -0.12 (236) | no | no | no |
| 3 volatility | ATR percentile > 90, fixed 2R | 249 | 36 | -0.03 | 183 | 32 | -0.13 | -0.33 … +0.09 | 0.8832 | -0.18 (99) | -0.07 (84) | no | no | no |
| 4 session (H4) | H4 zone filled in Asia (21-07 UTC), fixed 2R | 394 | 36 | -0.08 | 299 | 36 | -0.01 | -0.18 … +0.16 | 0.5537 | -0.13 (149) | +0.11 (150) | no | no | no |
| 4 session (H4) | H4 zone filled in London (07-12 UTC), fixed 2R | 437 | 35 | -0.09 | 293 | 27 | -0.29 | -0.47 … -0.14 | 0.9997 | -0.35 (130) | -0.25 (163) | no | no | no |
| 4 session (H4) | H4 zone filled in the London-NY overlap (12-16 UTC), fixed 2R | 567 | 34 | -0.11 | 482 | 31 | -0.18 | -0.31 … -0.05 | 0.9966 | -0.17 (243) | -0.19 (239) | no | no | no |
| 4 session (H4) | H4 zone filled in NY (16-21 UTC), fixed 2R | 306 | 33 | -0.15 | 148 | 34 | -0.06 | -0.29 … +0.20 | 0.6696 | -0.18 (76) | +0.08 (72) | no | no | no |
| 5 stop width | every setup, stop at distal + 0.1 ATR, 2R | 2174 | 34 | -0.20 | 1491 | 32 | -0.20 | -0.28 … -0.12 | 1.0000 | -0.21 (740) | -0.19 (751) | no | no | no |
| 5 stop width | every setup, stop at distal + 0.5 ATR, 2R | 2174 | 35 | -0.07 | 1489 | 33 | -0.10 | -0.18 … -0.01 | 0.9854 | -0.13 (738) | -0.07 (751) | no | no | no |
| 5 stop width | every setup, stop at distal + 1.0 ATR, 2R | 2174 | 34 | -0.07 | 1487 | 35 | -0.01 | -0.10 … +0.07 | 0.6255 | -0.05 (737) | +0.02 (750) | no | no | no |
| 6 exits | every setup, fixed 2R + time stop (+1R in 10 TF bars) | 2174 | 36 | -0.08 | 1491 | 34 | -0.10 | -0.18 … -0.02 | 0.9965 | -0.13 (740) | -0.08 (751) | no | no | no |
| 6 exits | every setup, break-even at 2R, target 3R | 2174 | 25 | -0.07 | 1487 | 23 | -0.11 | -0.20 … -0.01 | 0.9875 | -0.15 (737) | -0.07 (750) | no | no | no |
| 6 exits | every setup, fixed 1.5R | 2174 | 42 | -0.07 | 1489 | 39 | -0.11 | -0.18 … -0.03 | 0.9982 | -0.14 (739) | -0.07 (750) | no | no | no |
| 6 exits | every setup, fixed 3R | 2174 | 27 | -0.08 | 1486 | 25 | -0.13 | -0.22 … -0.02 | 0.9936 | -0.16 (736) | -0.10 (750) | no | no | no |
| 6 exits | every setup, trail behind the entry-TF swing after 1.5R | 2174 | 31 | -0.08 | 1485 | 28 | -0.10 | -0.21 … +0.03 | 0.9544 | -0.14 (736) | -0.07 (749) | no | no | no |
| 8 pairs | 12-month momentum + reversal zone, fixed 2R | 389 | 37 | -0.07 | 279 | 38 | +0.02 | -0.14 … +0.19 | 0.3919 | +0.04 (152) | +0.00 (127) | no | no | no |
| 8 pairs | 200-day SMA + reversal zone, fixed 2R | 414 | 36 | -0.09 | 297 | 37 | -0.02 | -0.18 … +0.16 | 0.5717 | -0.05 (149) | +0.02 (148) | no | no | no |
| 8 pairs | 12-month momentum + quiet (ATR pct < 30), fixed 2R | 301 | 34 | -0.09 | 197 | 31 | -0.17 | -0.38 … +0.03 | 0.9469 | -0.28 (105) | -0.05 (92) | no | no | no |
| 8 pairs | 12-month momentum + volatile (ATR pct > 70), fixed 2R | 283 | 41 | +0.11 | 188 | 38 | +0.03 | -0.17 … +0.23 | 0.3716 | +0.01 (99) | +0.06 (89) | no | no | no |
| 8 pairs | reversal zone + volatile (ATR pct > 70), fixed 2R | 282 | 38 | -0.04 | 183 | 36 | -0.08 | -0.31 … +0.16 | 0.7600 | +0.05 (91) | -0.22 (92) | no | no | no |
| 8 pairs | side agrees with the 12-month return, fixed 2R + time stop (+1R in 10 TF bars) | 1004 | 38 | -0.04 | 679 | 36 | -0.07 | -0.17 … +0.03 | 0.9310 | -0.07 (351) | -0.08 (328) | no | no | no |
| 8 pairs | side agrees with the 12-month return, stop at distal + 1.0 ATR, 2R | 1004 | 36 | -0.02 | 678 | 38 | +0.07 | -0.05 … +0.19 | 0.1291 | +0.05 (351) | +0.10 (327) | no | no | no |
| 8 pairs | side agrees with the 12-month return, trail behind the entry-TF swing after 1.5R | 1004 | 32 | -0.03 | 677 | 30 | -0.01 | -0.18 … +0.16 | 0.5627 | -0.00 (350) | -0.03 (327) | no | no | no |
| 0 reference | side against the 12-month return, fixed 2R | 1166 | 33 | -0.13 | 808 | 31 | -0.17 | -0.29 … -0.04 | 0.9963 | -0.25 (387) | -0.09 (421) | – | – | – |
| 0 reference | side against the 200-day SMA, fixed 2R | 1146 | 34 | -0.11 | 785 | 32 | -0.14 | -0.26 … -0.03 | 0.9937 | -0.16 (389) | -0.12 (396) | – | – | – |

## Results: second-touch zones

Train = setups placed 2010–2019, test = 2020–2026. Half A / B = the test-period avg R (trades) in each random half of the instruments. BH = Benjamini-Hochberg discovery at q = 0.05 over all 62 counted hypotheses; Bonf. = p < 0.00081. Rows marked '0 baseline' / '0 reference' are not counted.

| family | hypothesis | train n | train win % | train avg R | test n | test win % | test avg R | test 95% CI (week blocks) | p (test, one-sided) | half A | half B | BH | Bonf. | survives |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 baseline | every setup, fixed 2R | 7127 | 33 | -0.08 | 5041 | 33 | -0.07 | -0.11 … -0.03 | 0.9998 | -0.03 (2439) | -0.12 (2602) | – | – | – |
| 7 freshness | second touch, first return >= 25% deep, fixed 2R | 4803 | 33 | -0.09 | 3394 | 33 | -0.08 | -0.12 … -0.03 | 0.9986 | -0.01 (1637) | -0.13 (1757) | no | no | no |
| 7 freshness | second touch, first return < 25% deep, fixed 2R | 2324 | 33 | -0.06 | 1647 | 33 | -0.07 | -0.14 … +0.00 | 0.9776 | -0.05 (802) | -0.09 (845) | no | no | no |

## Method

- **No look-ahead.** Every feature reads only bars closed when the order is placed: the 12-month return and the 200-day SMA from D1 bars closed by then (a D1 zone: the stay-away candle's close), the ATR percentile from the entry-TF bars closed by then, the pattern from the zone as it was formed. The session uses the fill bar (known at the fill). The swing trail only uses swings confirmed by the bar's close. The second-touch depth is measured before the second order is placed. `tests/test_round3.py` checks that cutting off the future changes none of them.
- **Costs** as round 2: the median bid/ask spread of the instrument, charged once per trade in R (the spread is the round trip: buy at the ask, sell at the bid).
- **Fills** as round 2: one cancel level (2R of the round-2 stop) for every management, so every variant has the same fills; the stop-width variants recompute R from their own stop.
- **Walk-forward:** nothing is fitted; each hypothesis is a fixed rule. Train 2010–2019, test 2020–2026. A hypothesis **survives** only when it has ≥ 30 closed trades in train and in test, train avg R > 0, test avg R > 0, both random instrument halves are > 0 in the test years (≥ 10 trades each), and the test p-value is a Benjamini-Hochberg discovery.
- **Instrument halves** (seed 20261103): A = AUDCAD, AUDCHF, AUDHKD, AUDNZD, AUS200, CADCHF, CHFHKD, EURAUD, EURDKK, EURNOK, EURPLN, EURUSD, EURZAR, FRA40, GBPAUD, GBPJPY, GBPPLN, GBPSGD, GBPZAR, HK50, JPN225, NAS100, NATGAS, NETH25, NZDCAD, NZDCHF, NZDSGD, NZDUSD, SOYBEANS, SWI20, TRYJPY, US2000, US30, US500, USDCAD, USDCHF, USDCNH, USDHUF, USDJPY, USDNOK, USDPLN, USDSEK, USDSGD, USDTRY, WHEAT, XAGAUD, XAGCAD, XAGGBP, XAGSGD, XAUAUD, XAUCHF, XAUHKD, XAUNZD, XAUSGD, XAUXAG, XPTUSD, ZARJPY; B = AUDJPY, AUDSGD, AUDUSD, CADHKD, CADJPY, CADSGD, CHFJPY, CHFZAR, CHINAH, CN50, COPPER, CORN, EURCAD, EURCHF, EURCZK, EURGBP, EURHKD, EURHUF, EURJPY, EURNZD, EURSEK, EURSGD, EURTRY, EUSTX50, GBPCAD, GBPCHF, GBPHKD, GBPNZD, GBPUSD, GER40, HKDJPY, NZDHKD, NZDJPY, SGDCHF, SGDJPY, SPA35, SPOTBRENT, SPOTCRUDE, SUGAR, UK100, USDCZK, USDDKK, USDHKD, USDMXN, USDTHB, USDZAR, XAGCHF, XAGEUR, XAGHKD, XAGJPY, XAGNZD, XAGUSD, XAUCAD, XAUEUR, XAUGBP, XAUJPY, XAUUSD, XPDUSD.
- **p-values:** one-sided (H0: avg R ≤ 0) from the week-block bootstrap of the test trades (normal approximation with the bootstrap standard error).
- **Stocks:** round 2 ran on OANDA FX / CFD instruments only (no stock zones), so round 3 does the same.
- **Second touch:** after the first return into the zone (not through the stop, no close beyond the distal), a new limit at the proximal is placed at the close of the first H4 bar fully back outside the zone; same stop, 2R. A trade that was stopped on the first touch has no second touch.
- **Not modelled:** swaps, slippage, news.

## Data / counts

Requests 22732, cached 0, fine-window errors 73.

Reproduce: Actions → "Arrival study" with round = 3. Outputs: `docs/research/arrival_study/round3/` and `public/learn/round3_summary.json` on the `data` branch; the per-setup rows are in the run artifact.
