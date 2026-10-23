# Zone ML benchmark (Stage 1): can a model rank zones out of sample?

## 0. Pre-registration (written 2026-10-23, before any model was evaluated on the 2026 data)

**Question.** Using only what is known when a zone is created, does any model rank touch-1 trades well enough that the top-ranked trades earn a positive expectancy out of sample?

**Data.** One row per zone, from the ZoneVision v2 research CSVs. Both detectors (ZV and ALT) and all timeframes (M15, H1, H4, D1) are used, the same population that `analyze.py` uses by default.
- 2023-25 (IS): EURUSD and XAUUSD.
- 2026 Jan-Oct (OOS): AUDUSD, EURUSD, GBPUSD, USDJPY and XAUUSD.

**Trade and target.** This mirrors `analyze.py` `outcome_r` with the wick stop. A trade is a zone with a touch 1 (`t1_time` set). R at target k is +k if `t1_mfe` >= k, otherwise -1 if `t1_result == stop`, otherwise 0 (still open). The models learn y = 1[`t1_mfe` >= 3] on trades and rank by p(3R). E is reported per trade at 3R (primary), 2R and 5R, and per zone (untouched = 0).

**Features.** A fixed allow-list of creation-time columns (section 2). All `s1_*` columns are excluded, as is every outcome or post-creation column. Raw price levels and the symbol name are also excluded.

**Splits.**
- **Forward (F):** fit on 2023-24 and tune with time-ordered CV inside 2023-24. Calibrate (isotonic) and fix the top-decile/quintile score thresholds on 2025. Test on 2026. Training rows whose touch-1 trade ended at or after the start of the calibration year are purged.
- **Forward-full (F+):** fit on all of 2023-25 with the same hyper-parameters, uncalibrated, with the quintile and decile taken as ranks inside the test set (the same convention as the earlier quick check). Test on 2026. This variant is reported only, not gated, and it is the one that reproduces the earlier `s1_` result.
- **Reverse (R):** fit on 2026 Jan-Jun (5 symbols) and calibrate and fix thresholds on 2026 Jul-Oct. Test on 2023-25 (EURUSD, XAUUSD).

**Models.**
1. LightGBM, regularised, with two monotone constraints (more spread per R is worse; more room to the opposing zone is better). Hyper-parameters come from a 3-config grid chosen by time-ordered CV log-loss.
2. Logistic regression (L2, standardised, one-hot categoricals) as the baseline.
3. Hugging Face tabular foundation models on CPU: TabPFN v2 (`Prior-Labs/TabPFN-v2-clf`) and TabICL (`jingang/TabICL-clf`). The training set is capped (stratified by year and label) at the size those models handle.

Non-ML references: take every trade; the indicator's own consensus score `cons`; and a random ranking.

**Metrics.** AUC; Brier score and Brier skill against the constant base rate; and E per trade in the top decile and top quintile, with a 95% bootstrap CI (2,000 resamples, clustered by creation day, seed 7). These are given overall, per symbol, per TF and per detector.

**Pass criteria** (from `HuggingFace_Opportunities.md` row #1, made concrete):
- **C1 (edge, both directions):** top-quintile E/trade at 3R > 0 with CI_lo > 0 on at least 3 of 5 symbols in F. R has only 2 test symbols, so there it needs both (2 of 2). The quintile is defined by the score threshold fixed on the calibration period.
- **C2 (calibration):** Brier skill vs the test-period base rate >= +0.5% in both F and R.
- **C3 (lift):** top-quintile E minus all-trades E > 0 with paired CI_lo > 0, pooled, in both F and R.
- A model **passes** only if C1, C2 and C3 all hold. A failed gate is recorded as a result and is not tuned away. If no model passes, the conclusion is that the logged Zone DNA does not rank touch-1 trades out of sample.

**Leak audit.** I check every allowed feature's univariate AUC in IS and in OOS. Any feature with AUC > 0.58, or one that dominates importance, is investigated the way `s1_` was. For reference only, I also rerun the leaky `s1_` feature set.

---
