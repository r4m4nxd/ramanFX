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

## 1. Bottom line

**No model finds a real out-of-sample edge.** All four models fail the pre-registered gate: LightGBM, logistic regression, and the two Hugging Face challengers TabPFN v2 and TabICL v2. The two non-ML references fail it too. Not one symbol, in either direction, has a top-quintile E with CI_lo > 0 (0 of 5 forward, 0 of 2 reverse, for every model).

| Leak-free, 3R, wick stop | AUC F / R | Brier skill F / R | Top 20% E/trade F [CI] | Top 20% E/trade R [CI] | Top 10% E/trade F [CI] |
|---|---|---|---|---|---|
| All trades (no selection) | – | – | −0.09 | −0.10 | −0.09 |
| LightGBM | 0.532 / 0.513 | +0.46% / +0.05% | −0.03 [−0.09, +0.02] | −0.05 [−0.10, +0.00] | −0.00 [−0.08, +0.07] |
| Logistic regression | 0.530 / 0.518 | +0.27% / +0.04% | −0.04 [−0.09, +0.02] | −0.02 [−0.07, +0.04] | −0.02 [−0.09, +0.05] |
| TabPFN v2 (HF) | 0.524 / 0.526 | +0.01% / +0.22% | −0.06 [−0.10, −0.01] | −0.07 [−0.12, −0.02] | −0.05 [−0.11, +0.01] |
| TabICL v2 (HF) | 0.528 / 0.517 | +0.47% / +0.01% | −0.05 [−0.11, +0.01] | −0.06 [−0.11, −0.01] | −0.07 [−0.15, +0.02] |
| Lowest `spread_R`, one column, no ML | 0.533 / 0.528 | +0.70% / +0.22% | −0.03 [−0.08, +0.02] | −0.06 [−0.11, −0.00] | −0.06 [−0.13, +0.00] |
| *LightGBM + `s1_` (look-ahead, for reference)* | *0.752 (F+)* | *+9.2%* | *+0.74 [+0.67, +0.81]* | – | *+0.95 [+0.85, +1.05]* |

- **The prior finding reproduces.**
  - Without the `s1_` columns, LightGBM trained on 2023-25 and tested on 2026 (F+) gets AUC 0.529 and a top decile of −0.06R [−0.14, +0.02]. The earlier figures were −0.02R and AUC 0.53.
  - With `s1_` the top decile jumps to +0.95R. Without the single column `s1_touch_depth` it is still +0.27R.
  - The earlier "+0.38R" sits between these two runs. It is look-ahead, not edge.
- **A new leak was found:** `s1_touch_depth`, the depth of the touch candle itself, predicts "stopped on the touch candle" with AUC **1.000**. See section 6.
- **The only real, if small, signal is a weak ranking.** The leak-free models pick trades that are about **+0.05R better than average**, with a paired CI_lo > 0 for LightGBM and logistic regression in both directions (C3).
  - Most of that is cost: the models avoid zones where the spread is a large share of 1R (`spread_R`), and the rollover hours.
  - **One column, `spread_R`, does as well as any model**, and its Brier skill (+0.70% forward) is the best of all.
  - The lift moves E from about −0.09 to about −0.03R. It never moves E above zero.
- **The Hugging Face models are slightly worse than LightGBM.** Their training sets were smaller (3k/6k rows, a CPU limit), but the gap matches the prior in `HuggingFace_Opportunities.md` §2.2. The bottleneck is signal, not model capacity.
- **Verdict.** As logged at creation, the Zone DNA does not rank touch-1 trades well enough to make a 3R wick-stop limit entry profitable out of sample. More model choice, HF or otherwise, will not change this. The Stage 1 gate is **FAILED** and is recorded as a result.

---

## 2. Feature allow-list (known at zone creation)

All features come from the columns that `RFX_ZoneVision.mq5` writes **at creation**. This is the closed candle that completes the zone, which is the first moment the chart could show it (HowTo 4, "Create columns", and 5.1). The list lives in code as `ALLOW` in `tools/zone_research/ml/zml_common.py`, and `check_allow_list()` asserts that it does not intersect any post-creation prefix or column. The script uses 123 features; 3 of them (`inherit`, `out_tl`, `raja_live`) are constant in the data and are dropped automatically, which leaves 120.

| Group | Features | Why it is known at creation |
|---|---|---|
| Identity of the setup | `detector` (ZV/ALT), `tf_rank` (M15 0 … D1 3), `is_demand`, `pattern` (DBR/RBR/RBD/DBD) | Fixed by how the zone was detected |
| Geometry (scale-free) | `height_atr`, `base_n`, `legin_atr`, `legout_atr`, `leg_ratio`, `moveaway_h_create`, `gap`, `emotional`, `tested_at_create`, `would_draw`, `height_vs_med`, `stop_atr` | Candles up to and including the stay-away candle. `moveaway_h_create` is "move away **so far at creation**" |
| Spread cost | `spread_R` = spread / (height + spread), built from `spread` and `height` at creation | The tester spread at creation; it is the share of 1R that is pure cost |
| ZoneNotes judgement (v1) | `verdict_o`, `grade_o`, `zgrade_o`, `score`, `n_plus`, `n_minus`, `n_crit`, `alt_strength` | Computed by `ZoneNotes` when the zone is logged |
| Chain / context flags | `arrival`, `chain`, `rm_opp_zone`, `rm_trendline`, `new_high_low`, `rm_prev_high_low`, `leg2`, `too_small`, `trap`, `crowded`, `htf_trend`, `tl_bias`, `bias`, `align`, `bigger_trend`, `bigger_align`, `nested`, `in_opp_htf`, `curve`, `opp_R`, `plan_rr` | `Qualify` and the HTF context on the creation candle |
| Time | `hour`, `weekday_n`, `min_from_open` | Clock time of creation (one broker's server time for every file) |
| v2 DNA: base, legs, departure | `base_rel`, `base_min`, `legin_n`, `legin_spd`, `legout_body`, `legout_n`, `legout_spd`, `legout_rel`, `gap_open`, `gap_away`, `departure` | Spec F1-F10, measured on the formation candles |
| v2 DNA: run-out, chain | `c_runout_h`, `runout_atr`, `runout_bars`, `rm_opp_n`, `rm_opp_move`, `ath`, `arrival_raja`, `raja_strong` | `c_` = the creation copy (the v1 `runout_h` is measured later and is **excluded**) |
| v2 DNA: tests so far | `n_tests`, `depth_max`, `depth_1`, `emo_depth`, `depth_grade_o`, `ret_next` | Tests between formation and creation (ALT zones can be tested before their turn is confirmed). Not touch 1 |
| v2 DNA: location | `c_nested`, `nest_tf_o`, `nest_pos`, `curve_zone`, `curve_bucket_o`, `curve_raja`, `opp_htf_R`, `room_R`, `wow_h` (= `wow_pips` / `height_pips`), `origin_ok`, `left_opp_R` | Zone lists and HTF ranges at creation |
| v2 DNA: context | `novice_n`, `cross_needed`, `near_tl`, `overext`, `cp_run`, `impulse`, `stacked`, `overlap`, `flip` (`inherit`, `out_tl`, `raja_live` constant → dropped) | At creation |
| v2 approach | `appr_bars`, `appr_spd`, `new_opp_way`, `stair`, `appr_prov` | At creation these are **provisional**: measured up to creation (`appr_prov` = 1 means no touch yet). They are not the `s1_appr_*` measured at the touch |
| Direction engine | `dir`, `dirq`, `st_etf`, `st_itf`, `st_htf`, `st_p1`, `align_dir` | Direction stack on the creation candle |
| Lenses | `kv`, `kg`, `sK`, `sS`, `sR`, `sB`, `pass_k`, `pass_s`, `pass_r`, `pass_b`, `n_pass`, `cons`, `v2verdict_o` | Lens scores at creation |

**Excluded on purpose:**
- **Every `s1_*` column.** The snapshot is taken on the **close** of the touch candle, after the limit filled.
- **The outcome columns:** `t1_*`, `t2_*`, `t3_*`, `t1c_*`, `t1f_*`, `t1m_*`, `t1d_*`, `broken*`, `status`, `resolved`, `age_bars`, `never_touched`, `runout_h` and `touches`.
- **Raw price-unit columns** (`proximal`, `distal`, `height`, `height_pts`, `height_pips`, `atr`, `spread`, `wow_pips`). They encode the symbol and the price level, not the setup, and their scale-free versions are kept.
- **`symbol`.** The IS has 2 symbols and the OOS has 5, so a symbol feature cannot transfer.
- **Identity and time stamps** (`id`, `created`, `base_start`, `base_end`).
- **Redundant codes and free text** (`tags`, `sS_parts`, `entry_modes`, `session`). These are already present as flags, scores or `hour`.

**One labelled sensitivity run** goes outside the allow-list. `lgbm_age` adds `t1_bars`, the zone's age when touch 1 happens. It is known when the order fills, not at creation, and it stands for a "cancel the pending order after N bars" rule. It is reported but not gated.

---

## 3. Setup

| | F (gated) | F+ (reported only) | R (gated) |
|---|---|---|---|
| Fit | 2023-24, 21,915 trades | 2023-25, 32,627 trades | 2026 Jan-Jun, 13,452 trades |
| Tune | time-ordered CV: 2023H1→H2, 2023→2024H1, 2023-24H1→2024H2 | F's hyper-parameters | 2026 Jan-Feb→Mar-Apr, Jan-Apr→May-Jun |
| Calibrate + fix thresholds | 2025 (10,677 trades) | none (test-rank buckets) | 2026 Jul-Oct (8,434 trades) |
| Test | 2026, 5 symbols, 21,970 trades / 23,980 zones | same | 2023-25, EURUSD + XAUUSD, 32,627 trades / 35,757 zones |

- **Outcome check.** `zml_common.derive()` reproduces `analyze.py` exactly. On IS, E/trade at 3R is −0.0975 (`analyze.Stats` gives −0.09750), at 2R −0.1081 and at 5R −0.0730; P(3R) is 0.2251 and E/zone is −0.0890. For 2026 the figures are −0.0880 / −0.1010 / −0.0866, P(3R) 0.2272, and E/zone −0.0806.
- **Purging.** A training trade is kept only if its touch-1 trade ended before the next period starts, so its label was known by then. This removed 35 trades in F.
- **LightGBM.** Settings: `num_leaves` 7/15/31, `min_child_samples` 400/200/100, learning rate 0.03, feature fraction 0.6-0.8, L2 5-10, bagging 0.8, `max_bin` 63, monotone constraints `spread_R` −1 and `room_R` +1, and early stopping in the CV with a floor of 30 trees. CV picked the most conservative configuration (7 leaves, 400 per leaf). For the 3R model the best iteration was only 10-47 trees in every fold, which is itself a sign of very little signal.
- **Logistic regression.** Pipeline: median impute + missing flags, quantile → normal transform, one-hot categoricals, and L2 with C ∈ {0.003, 0.03, 0.3}. CV picked C = 0.003, the strongest shrinkage, in both directions.
- **Hugging Face challengers**, on CPU, with licences checked on 2026-10-23:
  - **TabPFN v2** (`Prior-Labs/TabPFN-v2-clf`, file `tabpfn-v2-classifier.ckpt`). Licence: Prior Labs License 1.1, which is Apache-2.0 plus an attribution clause that applies only on distribution; internal benchmarking needs no attribution. It is usable for this personal research. TabPFN 2.5/3 are gated and non-commercial, so they were not used.
  - **TabICL v2** (`jingang/TabICL`, file `tabicl-classifier-v2-20260212.ckpt`, BSD-3-Clause).
  - Both use the `tabpfn` 9.2.0 and `tabicl` 2.2.0 pip packages on `torch` 2.14 for CPU.
- **Bootstrap.** 2,000 resamples of whole creation days, seed 7. Lift is paired: the top bucket and all trades are measured on the same resampled days.

**Deviations from the pre-registration** (compute only; all decided before any HF result was seen):
- **TabPFN v2** had 3,000 training rows (stratified by period × label), the top 40 features by LightGBM gain on **that split's training trades**, and 2 ensemble members. On this shared 4-core box it needed about 27 s per 1,000 test rows even with the training context cached, and about 70 s for 1,000 rows with all 120 features.
- **TabICL v2** had 6,000 training rows, all features, and 2 ensemble members. A first run with 10,000 rows and 4 members was killed by the out-of-memory killer, while another job was running on the box.
- **TabICL weights:** I used `jingang/TabICL`, checkpoint `tabicl-classifier-v2-20260212.ckpt`, BSD-3. The pre-registration names `jingang/TabICL-clf`, but that repo holds only the v1/v1.1 checkpoints, and the current `tabicl` package expects the newer file names. Both repos have the same author and licence.
- **Single-threaded LightGBM.** OpenMP with 4 threads was about 35× slower on the loaded machine. This does not change the results, because `deterministic=True` is set.
- **A second non-ML reference**, "lowest `spread_R`", was added after the first fast-model run. That run showed `spread_R` as the dominant feature, and the reference tests whether the ML adds anything beyond it. It is not gated.

---

## 4. Results

How to read the tables:
- "Top 20%" means trades whose raw score clears the 80th percentile of the **calibration-period** trade scores (F, R). That is why its share of the test set is not exactly 20%. For F+ it is the 80th percentile inside the test set.
- E is in R per touch-1 trade (wick stop, 3R target) unless the row says otherwise.
- CIs are 95%, from a bootstrap clustered by creation day.
- "Lift" is the paired difference between the top 20% and all test trades.

### 4.1 Headline: touch-1 trades, wick stop

For `lgbm_y2` the E columns are at 2R, and for `lgbm_y5` at 5R; every other row is at 3R. The top bucket uses thresholds fixed on the calibration period (F, R) or ranks inside the test set (F+).

| Model | Split | Trades | P(3R) | AUC | Brier skill | Top 10% E/trade [95% CI] | Top 20% E/trade [95% CI] | Top 20% lift vs all [CI] | Top 20% share | All trades E |
|---|---|---|---|---|---|---|---|---|---|---|
| LightGBM | F: 23-24 -> 26 | 21970 | 0.227 | 0.532 | +0.46% | -0.00 [-0.08, +0.07] | -0.03 [-0.09, +0.02] | +0.06 [+0.01, +0.10] | 22% | -0.088 |
| Logistic regression | F: 23-24 -> 26 | 21970 | 0.227 | 0.530 | +0.27% | -0.02 [-0.09, +0.05] | -0.04 [-0.09, +0.02] | +0.05 [+0.01, +0.09] | 23% | -0.088 |
| TabPFN v2 (HF) | F: 23-24 -> 26 | 21970 | 0.227 | 0.524 | +0.01% | -0.05 [-0.11, +0.01] | -0.06 [-0.10, -0.01] | +0.03 [-0.01, +0.07] | 27% | -0.088 |
| TabICL v2 (HF) | F: 23-24 -> 26 | 21970 | 0.227 | 0.528 | +0.47% | -0.07 [-0.15, +0.02] | -0.05 [-0.11, +0.01] | +0.04 [-0.01, +0.09] | 17% | -0.088 |
| `cons` score (no ML) | F: 23-24 -> 26 | 21970 | 0.227 | 0.515 | +0.01% | -0.04 [-0.12, +0.05] | -0.03 [-0.10, +0.03] | +0.05 [+0.00, +0.11] | 19% | -0.088 |
| lowest `spread_R` (no ML) | F: 23-24 -> 26 | 21970 | 0.227 | 0.533 | +0.70% | -0.06 [-0.13, +0.00] | -0.03 [-0.08, +0.02] | +0.06 [+0.02, +0.10] | 25% | -0.088 |
| random | F: 23-24 -> 26 | 21970 | 0.227 | 0.497 | n/a | -0.14 [-0.21, -0.07] | -0.10 [-0.15, -0.06] | -0.01 [-0.06, +0.03] | 20% | -0.088 |
| LightGBM + age at touch (`t1_bars`) | F: 23-24 -> 26 | 21970 | 0.227 | 0.537 | +0.64% | +0.07 [-0.01, +0.16] | -0.01 [-0.07, +0.05] | +0.08 [+0.03, +0.13] | 21% | -0.088 |
| LightGBM trained on 2R (E at 2R) | F: 23-24 -> 26 | 21970 | 0.299 | 0.549 | +1.05% | +0.06 [-0.01, +0.13] | +0.02 [-0.03, +0.07] | +0.12 [+0.08, +0.16] | 20% | -0.101 |
| LightGBM trained on 5R (E at 5R) | F: 23-24 -> 26 | 21970 | 0.151 | 0.523 | +0.31% | +0.03 [-0.08, +0.14] | -0.03 [-0.12, +0.05] | +0.05 [-0.02, +0.13] | 17% | -0.087 |
| LightGBM | F+: 23-25 -> 26 | 21970 | 0.227 | 0.529 | +0.39% | -0.06 [-0.14, +0.02] | -0.07 [-0.13, -0.00] | +0.02 [-0.04, +0.08] | 20% | -0.088 |
| Logistic regression | F+: 23-25 -> 26 | 21970 | 0.227 | 0.529 | +0.17% | -0.03 [-0.11, +0.05] | -0.03 [-0.08, +0.02] | +0.06 [+0.01, +0.10] | 20% | -0.088 |
| `cons` score (no ML) | F+: 23-25 -> 26 | 21970 | 0.227 | 0.515 | n/a | -0.04 [-0.13, +0.05] | -0.04 [-0.10, +0.02] | +0.05 [-0.00, +0.10] | 20% | -0.088 |
| lowest `spread_R` (no ML) | F+: 23-25 -> 26 | 21970 | 0.227 | 0.533 | n/a | -0.09 [-0.18, -0.01] | -0.05 [-0.11, -0.00] | +0.03 [-0.02, +0.08] | 20% | -0.088 |
| random | F+: 23-25 -> 26 | 21970 | 0.227 | 0.497 | n/a | -0.04 [-0.12, +0.03] | -0.09 [-0.14, -0.03] | +0.00 [-0.04, +0.05] | 20% | -0.088 |
| LightGBM + age at touch (`t1_bars`) | F+: 23-25 -> 26 | 21970 | 0.227 | 0.532 | +0.42% | -0.06 [-0.14, +0.02] | -0.06 [-0.11, -0.00] | +0.03 [-0.02, +0.08] | 20% | -0.088 |
| LightGBM trained on 2R (E at 2R) | F+: 23-25 -> 26 | 21970 | 0.299 | 0.549 | +0.92% | +0.03 [-0.03, +0.10] | -0.00 [-0.04, +0.04] | +0.10 [+0.06, +0.14] | 20% | -0.101 |
| LightGBM trained on 5R (E at 5R) | F+: 23-25 -> 26 | 21970 | 0.151 | 0.511 | +0.17% | -0.11 [-0.21, +0.00] | -0.11 [-0.20, -0.03] | -0.03 [-0.10, +0.05] | 20% | -0.087 |
| LightGBM + all `s1_` (LEAK) | F+: 23-25 -> 26 | 21970 | 0.227 | 0.752 | +9.21% | +0.95 [+0.85, +1.05] | +0.74 [+0.67, +0.81] | +0.82 [+0.77, +0.88] | 20% | -0.088 |
| LightGBM + `s1_` minus `s1_touch_depth` (LEAK) | F+: 23-25 -> 26 | 21970 | 0.227 | 0.588 | +1.29% | +0.27 [+0.19, +0.35] | +0.17 [+0.11, +0.23] | +0.26 [+0.21, +0.31] | 20% | -0.088 |
| LightGBM | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.513 | +0.05% | -0.09 [-0.16, -0.02] | -0.05 [-0.10, +0.00] | +0.05 [+0.00, +0.10] | 17% | -0.097 |
| Logistic regression | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.518 | +0.04% | -0.01 [-0.09, +0.08] | -0.02 [-0.07, +0.04] | +0.08 [+0.03, +0.14] | 14% | -0.097 |
| TabPFN v2 (HF) | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.526 | +0.22% | -0.04 [-0.11, +0.04] | -0.07 [-0.12, -0.02] | +0.03 [-0.02, +0.07] | 15% | -0.097 |
| TabICL v2 (HF) | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.517 | +0.01% | -0.05 [-0.12, +0.03] | -0.06 [-0.11, -0.01] | +0.04 [-0.01, +0.09] | 16% | -0.097 |
| `cons` score (no ML) | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.495 | -0.26% | -0.17 [-0.23, -0.10] | -0.14 [-0.19, -0.09] | -0.04 [-0.08, +0.00] | 20% | -0.097 |
| lowest `spread_R` (no ML) | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.528 | +0.22% | -0.01 [-0.09, +0.07] | -0.06 [-0.11, -0.00] | +0.04 [-0.01, +0.09] | 14% | -0.097 |
| random | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.499 | n/a | -0.11 [-0.16, -0.05] | -0.12 [-0.15, -0.08] | -0.02 [-0.05, +0.02] | 20% | -0.097 |
| LightGBM + age at touch (`t1_bars`) | R: 26H1 -> 23-25 | 32627 | 0.225 | 0.512 | +0.02% | -0.05 [-0.12, +0.01] | -0.07 [-0.11, -0.02] | +0.03 [-0.02, +0.07] | 17% | -0.097 |

### 4.2 Other targets and per zone (top 20% chosen by the 3R model)

| Model | Split | Top 20% P(3R) | E at 2R | E at 5R | E/zone top 20% [CI] | E/zone, all zones |
|---|---|---|---|---|---|---|
| LightGBM | F: 23-24 -> 26 | 0.241 | -0.017 | -0.030 | -0.03 [-0.08, +0.02] | -0.081 |
| Logistic regression | F: 23-24 -> 26 | 0.239 | -0.024 | -0.067 | -0.04 [-0.09, +0.01] | -0.081 |
| TabPFN v2 (HF) | F: 23-24 -> 26 | 0.234 | -0.064 | -0.071 | -0.05 [-0.09, -0.01] | -0.081 |
| TabICL v2 (HF) | F: 23-24 -> 26 | 0.236 | -0.063 | -0.045 | -0.05 [-0.10, +0.01] | -0.081 |
| `cons` score (no ML) | F: 23-24 -> 26 | 0.241 | -0.073 | -0.037 | -0.03 [-0.09, +0.03] | -0.081 |
| lowest `spread_R` (no ML) | F: 23-24 -> 26 | 0.241 | -0.015 | -0.073 | -0.03 [-0.07, +0.02] | -0.081 |
| random | F: 23-24 -> 26 | 0.224 | -0.122 | -0.097 | -0.09 [-0.13, -0.05] | -0.081 |
| LightGBM + age at touch (`t1_bars`) | F: 23-24 -> 26 | 0.247 | -0.004 | -0.046 | -0.01 [-0.06, +0.04] | -0.081 |
| LightGBM | F+: 23-25 -> 26 | 0.231 | -0.042 | -0.098 | -0.06 [-0.12, -0.00] | -0.081 |
| Logistic regression | F+: 23-25 -> 26 | 0.240 | +0.001 | -0.084 | -0.03 [-0.08, +0.02] | -0.081 |
| `cons` score (no ML) | F+: 23-25 -> 26 | 0.239 | -0.075 | -0.048 | -0.04 [-0.09, +0.02] | -0.081 |
| lowest `spread_R` (no ML) | F+: 23-25 -> 26 | 0.234 | -0.037 | -0.107 | -0.05 [-0.10, -0.00] | -0.081 |
| random | F+: 23-25 -> 26 | 0.228 | -0.114 | -0.105 | -0.08 [-0.13, -0.02] | -0.081 |
| LightGBM + age at touch (`t1_bars`) | F+: 23-25 -> 26 | 0.234 | -0.036 | -0.068 | -0.06 [-0.10, -0.00] | -0.081 |
| LightGBM + all `s1_` (LEAK) | F+: 23-25 -> 26 | 0.434 | +0.656 | +0.784 | +0.74 [+0.67, +0.81] | -0.081 |
| LightGBM + `s1_` minus `s1_touch_depth` (LEAK) | F+: 23-25 -> 26 | 0.292 | +0.152 | +0.183 | +0.17 [+0.11, +0.23] | -0.081 |
| LightGBM | R: 26H1 -> 23-25 | 0.237 | -0.068 | -0.039 | -0.04 [-0.09, +0.00] | -0.089 |
| Logistic regression | R: 26H1 -> 23-25 | 0.245 | -0.031 | -0.006 | -0.01 [-0.06, +0.03] | -0.089 |
| TabPFN v2 (HF) | R: 26H1 -> 23-25 | 0.232 | -0.056 | -0.081 | -0.06 [-0.11, -0.02] | -0.089 |
| TabICL v2 (HF) | R: 26H1 -> 23-25 | 0.235 | -0.074 | -0.050 | -0.05 [-0.10, -0.01] | -0.089 |
| `cons` score (no ML) | R: 26H1 -> 23-25 | 0.215 | -0.160 | -0.140 | -0.12 [-0.16, -0.08] | -0.089 |
| lowest `spread_R` (no ML) | R: 26H1 -> 23-25 | 0.233 | -0.055 | -0.031 | -0.05 [-0.10, -0.00] | -0.089 |
| random | R: 26H1 -> 23-25 | 0.221 | -0.119 | -0.078 | -0.11 [-0.14, -0.07] | -0.089 |
| LightGBM + age at touch (`t1_bars`) | R: 26H1 -> 23-25 | 0.232 | -0.072 | -0.069 | -0.06 [-0.11, -0.02] | -0.089 |

### 4.3 Top-20% E/trade at 3R by symbol [95% CI] (n in the bucket; AUC inside the group)

| Model | Split | AUDUSD | EURUSD | GBPUSD | USDJPY | XAUUSD |
|---|---|---|---|---|---|---|
| LightGBM | F: 23-24 -> 26 | +0.02 [-0.09, +0.14] (n 954, AUC 0.536; all -0.06) | -0.06 [-0.20, +0.09] (n 531, AUC 0.563; all -0.18) | -0.03 [-0.15, +0.09] (n 1071, AUC 0.525; all -0.08) | -0.01 [-0.11, +0.10] (n 1068, AUC 0.519; all -0.04) | -0.09 [-0.19, +0.02] (n 1125, AUC 0.507; all -0.07) |
| LightGBM | R: 26H1 -> 23-25 | - | -0.02 [-0.09, +0.05] (n 2956, AUC 0.528; all -0.10) | - | - | -0.08 [-0.15, -0.01] (n 2549, AUC 0.496; all -0.09) |
| Logistic regression | F: 23-24 -> 26 | -0.01 [-0.14, +0.13] (n 737, AUC 0.537; all -0.06) | -0.25 [-0.39, -0.09] (n 495, AUC 0.539; all -0.18) | -0.01 [-0.12, +0.10] (n 1046, AUC 0.537; all -0.08) | +0.00 [-0.10, +0.10] (n 1345, AUC 0.520; all -0.04) | -0.04 [-0.13, +0.05] (n 1511, AUC 0.510; all -0.07) |
| Logistic regression | R: 26H1 -> 23-25 | - | +0.04 [-0.04, +0.11] (n 2531, AUC 0.529; all -0.10) | - | - | -0.08 [-0.16, -0.01] (n 1992, AUC 0.505; all -0.09) |
| TabPFN v2 (HF) | F: 23-24 -> 26 | -0.09 [-0.21, +0.03] (n 897, AUC 0.516; all -0.06) | -0.12 [-0.22, -0.00] (n 919, AUC 0.559; all -0.18) | -0.09 [-0.19, +0.01] (n 1200, AUC 0.512; all -0.08) | -0.02 [-0.12, +0.08] (n 1160, AUC 0.519; all -0.04) | -0.02 [-0.10, +0.07] (n 1753, AUC 0.513; all -0.07) |
| TabPFN v2 (HF) | R: 26H1 -> 23-25 | - | -0.02 [-0.09, +0.05] (n 3056, AUC 0.537; all -0.10) | - | - | -0.15 [-0.22, -0.08] (n 1988, AUC 0.515; all -0.09) |
| TabICL v2 (HF) | F: 23-24 -> 26 | +0.06 [-0.06, +0.20] (n 750, AUC 0.536; all -0.06) | -0.08 [-0.24, +0.08] (n 471, AUC 0.560; all -0.18) | -0.07 [-0.20, +0.06] (n 756, AUC 0.530; all -0.08) | -0.05 [-0.16, +0.07] (n 913, AUC 0.509; all -0.04) | -0.12 [-0.22, +0.00] (n 823, AUC 0.493; all -0.07) |
| TabICL v2 (HF) | R: 26H1 -> 23-25 | - | -0.06 [-0.13, +0.01] (n 3113, AUC 0.527; all -0.10) | - | - | -0.06 [-0.13, +0.02] (n 2071, AUC 0.506; all -0.09) |
| `cons` score (no ML) | F: 23-24 -> 26 | +0.09 [-0.04, +0.24] (n 849, AUC 0.528; all -0.06) | -0.18 [-0.31, -0.05] (n 823, AUC 0.506; all -0.18) | -0.01 [-0.14, +0.11] (n 864, AUC 0.509; all -0.08) | -0.02 [-0.15, +0.12] (n 840, AUC 0.514; all -0.04) | -0.05 [-0.17, +0.07] (n 882, AUC 0.514; all -0.07) |
| `cons` score (no ML) | R: 26H1 -> 23-25 | - | -0.11 [-0.18, -0.05] (n 3454, AUC 0.498; all -0.10) | - | - | -0.16 [-0.22, -0.10] (n 3232, AUC 0.493; all -0.09) |
| lowest `spread_R` (no ML) | F: 23-24 -> 26 | -0.08 [-0.23, +0.06] (n 693, AUC 0.535; all -0.06) | -0.03 [-0.23, +0.17] (n 354, AUC 0.573; all -0.18) | -0.02 [-0.13, +0.09] (n 1326, AUC 0.522; all -0.08) | -0.01 [-0.09, +0.08] (n 1548, AUC 0.511; all -0.04) | -0.03 [-0.12, +0.05] (n 1603, AUC 0.512; all -0.07) |
| lowest `spread_R` (no ML) | R: 26H1 -> 23-25 | - | -0.06 [-0.13, +0.01] (n 3081, AUC 0.529; all -0.10) | - | - | -0.05 [-0.14, +0.04] (n 1523, AUC 0.525; all -0.09) |

### 4.4 Top-20% E/trade at 3R by timeframe [95% CI] (n in the bucket; AUC inside the group)

| Model | Split | M15 | H1 | H4 | D1 |
|---|---|---|---|---|---|
| LightGBM | F: 23-24 -> 26 | -0.00 [-0.07, +0.06] (n 3438, AUC 0.535; all -0.08) | -0.07 [-0.18, +0.05] (n 1059, AUC 0.522; all -0.06) | -0.26 [-0.48, -0.03] (n 247, AUC 0.490; all -0.21) | -1.00 [-1.00, -1.00] (n 5, AUC 0.598; all -0.57) |
| LightGBM | R: 26H1 -> 23-25 | -0.02 [-0.08, +0.05] (n 3543, AUC 0.518; all -0.09) | -0.07 [-0.16, +0.02] (n 1503, AUC 0.503; all -0.11) | -0.23 [-0.38, -0.06] (n 459, AUC 0.486; all -0.12) | n/a (n 0, AUC 0.399; all -0.19) |
| Logistic regression | F: 23-24 -> 26 | -0.03 [-0.08, +0.02] (n 3879, AUC 0.533; all -0.08) | -0.01 [-0.13, +0.12] (n 930, AUC 0.520; all -0.06) | -0.24 [-0.45, -0.03] (n 316, AUC 0.499; all -0.21) | -0.56 [-1.00, +0.33] (n 9, AUC 0.548; all -0.57) |
| Logistic regression | R: 26H1 -> 23-25 | +0.01 [-0.05, +0.07] (n 3339, AUC 0.522; all -0.09) | -0.05 [-0.17, +0.06] (n 864, AUC 0.511; all -0.11) | -0.19 [-0.37, +0.00] (n 312, AUC 0.492; all -0.12) | -1.00 [-1.00, -1.00] (n 8, AUC 0.382; all -0.19) |
| TabPFN v2 (HF) | F: 23-24 -> 26 | -0.05 [-0.10, -0.00] (n 5177, AUC 0.525; all -0.08) | -0.03 [-0.16, +0.12] (n 602, AUC 0.519; all -0.06) | -0.31 [-0.58, -0.01] (n 135, AUC 0.479; all -0.21) | -0.73 [-1.00, -0.08] (n 15, AUC 0.583; all -0.57) |
| TabPFN v2 (HF) | R: 26H1 -> 23-25 | -0.07 [-0.12, -0.01] (n 3603, AUC 0.529; all -0.09) | -0.07 [-0.17, +0.02] (n 1270, AUC 0.524; all -0.11) | -0.06 [-0.34, +0.24] (n 171, AUC 0.503; all -0.12) | n/a (n 0, AUC 0.504; all -0.19) |
| TabICL v2 (HF) | F: 23-24 -> 26 | -0.03 [-0.09, +0.04] (n 2706, AUC 0.535; all -0.08) | +0.03 [-0.11, +0.19] (n 640, AUC 0.515; all -0.06) | -0.30 [-0.48, -0.11] (n 321, AUC 0.481; all -0.21) | -0.74 [-1.00, -0.38] (n 46, AUC 0.540; all -0.57) |
| TabICL v2 (HF) | R: 26H1 -> 23-25 | -0.03 [-0.09, +0.04] (n 3868, AUC 0.522; all -0.09) | -0.16 [-0.27, -0.06] (n 1016, AUC 0.504; all -0.11) | -0.12 [-0.33, +0.11] (n 300, AUC 0.487; all -0.12) | n/a (n 0, AUC 0.483; all -0.19) |
| `cons` score (no ML) | F: 23-24 -> 26 | -0.04 [-0.11, +0.03] (n 3181, AUC 0.513; all -0.08) | +0.06 [-0.09, +0.20] (n 823, AUC 0.521; all -0.06) | -0.14 [-0.39, +0.12] (n 204, AUC 0.524; all -0.21) | -0.76 [-1.00, -0.50] (n 50, AUC 0.470; all -0.57) |
| `cons` score (no ML) | R: 26H1 -> 23-25 | -0.10 [-0.15, -0.04] (n 4940, AUC 0.501; all -0.09) | -0.22 [-0.32, -0.13] (n 1299, AUC 0.480; all -0.11) | -0.34 [-0.51, -0.17] (n 381, AUC 0.470; all -0.12) | -0.33 [-0.65, +0.05] (n 66, AUC 0.454; all -0.19) |
| lowest `spread_R` (no ML) | F: 23-24 -> 26 | +0.02 [-0.04, +0.09] (n 2811, AUC 0.542; all -0.08) | -0.02 [-0.10, +0.07] (n 1965, AUC 0.518; all -0.06) | -0.24 [-0.38, -0.08] (n 713, AUC 0.508; all -0.21) | -0.43 [-0.87, +0.06] (n 35, AUC 0.606; all -0.57) |
| lowest `spread_R` (no ML) | R: 26H1 -> 23-25 | -0.04 [-0.12, +0.04] (n 1912, AUC 0.532; all -0.09) | -0.05 [-0.13, +0.03] (n 1770, AUC 0.528; all -0.11) | -0.07 [-0.20, +0.06] (n 846, AUC 0.532; all -0.12) | -0.47 [-0.75, -0.13] (n 76, AUC 0.463; all -0.19) |

### 4.5 Top-20% E/trade at 3R by detector [95% CI] (n in the bucket; AUC inside the group)

| Model | Split | ALT | ZV |
|---|---|---|---|
| LightGBM | F: 23-24 -> 26 | -0.05 [-0.11, +0.02] (n 2996, AUC 0.528; all -0.08) | -0.01 [-0.09, +0.07] (n 1753, AUC 0.537; all -0.10) |
| LightGBM | R: 26H1 -> 23-25 | -0.01 [-0.08, +0.06] (n 2999, AUC 0.513; all -0.09) | -0.09 [-0.16, -0.03] (n 2506, AUC 0.514; all -0.11) |
| Logistic regression | F: 23-24 -> 26 | -0.08 [-0.14, -0.02] (n 3108, AUC 0.523; all -0.08) | +0.02 [-0.05, +0.10] (n 2026, AUC 0.540; all -0.10) |
| Logistic regression | R: 26H1 -> 23-25 | -0.02 [-0.09, +0.05] (n 2580, AUC 0.518; all -0.09) | -0.01 [-0.08, +0.06] (n 1943, AUC 0.518; all -0.11) |
| TabPFN v2 (HF) | F: 23-24 -> 26 | -0.05 [-0.11, +0.01] (n 3640, AUC 0.525; all -0.08) | -0.07 [-0.14, -0.01] (n 2289, AUC 0.523; all -0.10) |
| TabPFN v2 (HF) | R: 26H1 -> 23-25 | -0.06 [-0.12, +0.00] (n 3024, AUC 0.525; all -0.09) | -0.09 [-0.16, -0.02] (n 2020, AUC 0.528; all -0.11) |
| TabICL v2 (HF) | F: 23-24 -> 26 | -0.07 [-0.13, -0.00] (n 2230, AUC 0.528; all -0.08) | -0.02 [-0.11, +0.06] (n 1483, AUC 0.527; all -0.10) |
| TabICL v2 (HF) | R: 26H1 -> 23-25 | -0.02 [-0.09, +0.06] (n 2305, AUC 0.520; all -0.09) | -0.09 [-0.15, -0.03] (n 2879, AUC 0.515; all -0.11) |
| `cons` score (no ML) | F: 23-24 -> 26 | -0.01 [-0.11, +0.09] (n 1335, AUC 0.519; all -0.08) | -0.04 [-0.11, +0.02] (n 2923, AUC 0.519; all -0.10) |
| `cons` score (no ML) | R: 26H1 -> 23-25 | -0.10 [-0.17, -0.02] (n 2096, AUC 0.500; all -0.09) | -0.16 [-0.20, -0.11] (n 4590, AUC 0.490; all -0.11) |
| lowest `spread_R` (no ML) | F: 23-24 -> 26 | -0.05 [-0.10, -0.00] (n 3908, AUC 0.526; all -0.08) | +0.03 [-0.05, +0.12] (n 1616, AUC 0.543; all -0.10) |
| lowest `spread_R` (no ML) | R: 26H1 -> 23-25 | -0.01 [-0.07, +0.05] (n 3386, AUC 0.532; all -0.09) | -0.18 [-0.27, -0.09] (n 1218, AUC 0.520; all -0.11) |

---

## 5. Pass/fail against the pre-registered criteria

### 5.1 Criteria table (pre-registered; gated models, F and R)

| Model | F: C1 symbols with CI_lo > 0 (need 3/5) | F: C2 Brier skill >= 0.5% | F: C3 lift CI_lo > 0 | R: C1 (need 2/2) | R: C2 | R: C3 | PASS |
|---|---|---|---|---|---|---|---|
| LightGBM | 0 (none) | no | yes | 0 (none) | no | yes | **FAIL** |
| Logistic regression | 0 (none) | no | yes | 0 (none) | no | yes | **FAIL** |
| TabPFN v2 (HF) | 0 (none) | no | no | 0 (none) | no | no | **FAIL** |
| TabICL v2 (HF) | 0 (none) | no | no | 0 (none) | no | no | **FAIL** |
| `cons` score (no ML) | 0 (none) | no | yes | 0 (none) | no | no | **FAIL** |
| lowest `spread_R` (no ML) | 0 (none) | yes | yes | 0 (none) | no | no | **FAIL** |

- **C1 (edge on ≥ 3/5 symbols forward and 2/2 reverse):** failed by every model and reference. The best single cells were LightGBM AUDUSD F at +0.02 [−0.09, +0.14], TabICL AUDUSD F at +0.06 [−0.06, +0.20], `cons` AUDUSD F at +0.09 [−0.04, +0.24] and logistic regression EURUSD R at +0.04 [−0.04, +0.11]. All of them include zero, and none repeats in the other direction.
- **C2 (Brier skill ≥ +0.5% in both directions):** failed by every model. LightGBM F reached +0.46% and TabICL F +0.47%, and no model gets above +0.22% in R. Only the one-column `spread_R` reference passes forward (+0.70%), and it fails R (+0.22%).
- **C3 (lift CI_lo > 0 in both directions):** LightGBM and logistic regression pass. TabPFN and TabICL do not. This is the only criterion any model meets, and on its own it is not an edge: the selected trades still lose.
- **Ungated variants:** none passes either. For the 2R target, LightGBM trained on 2R gives a forward top decile of +0.06 [−0.01, +0.13] at 2R and +0.03 in F+; it has the best AUC (0.549), which is still low. The age-at-touch variant gives a forward top decile of +0.07 [−0.01, +0.16], but −0.06 in F+ and −0.05 in R, so it is not stable. Per zone (untouched = 0) the picture is the same: the best top quintile is LightGBM F at −0.03 [−0.08, +0.02] against −0.08 for all zones.
- **By timeframe:** The H4 and D1 top buckets are negative in every model: H4 is about −0.25R forward and −0.06 to −0.23R in reverse. M15 is the only TF near zero, at −0.05 to +0.01 depending on the model.

---

## 6. Leak audit and the `s1_` reproduction

### 6.1 What leaks and why

The `s1_` snapshot is taken on the **close** of the touch-1 candle, but the limit order filled intrabar at the proximal. Any `s1_` value that depends on that candle's own range therefore knows part of the outcome.
- **`s1_touch_depth`** is the touch candle's own penetration in % of the height. A value over 100 means the candle went through the distal, i.e. it was stopped. Its AUC for "stopped on the touch candle" (`stop_tc`, 27% of trades) is **1.000** in both IS and OOS, and its AUC for reaching 3R is 0.71. HowTo 5.2 says it "describes, never filters", and it must never be a feature or a calibration key.
- **`s1_novice_n`** counts the candles of ≥ 2 ATR in the last 10 approach bars. At the touch close that window includes the touch candle itself, which is often the big candle that runs the stop. Its AUC for `stop_tc` is 0.632, against **0.500** for the creation copy. At creation `novice_n` is 1 in only 9 of 30,173 IS trades.
- **`s1_stop_atr`, `s1_height_atr`, `s1_runout_h`, `s1_height_vs_med`** have `stop_tc` AUCs of 0.67-0.70, against 0.63-0.65 for their creation copies. The ATR at the touch close includes the touch candle's range.

### 6.2 Reproduction of the earlier result (F+: 2023-25 → 2026, LightGBM, same hyper-parameters)

| Feature set | AUC | Top 10% E | Top 20% E |
|---|---|---|---|
| Creation allow-list (leak-free) | 0.529 | −0.06 [−0.14, +0.02] | −0.07 [−0.13, −0.00] |
| + all numeric `s1_` | 0.752 | **+0.95 [+0.85, +1.05]** | +0.74 [+0.67, +0.81] |
| + `s1_` except `s1_touch_depth` | 0.588 | **+0.27 [+0.19, +0.35]** | +0.17 [+0.11, +0.23] |

The earlier quick check (+0.38R top decile, CI +0.30 to +0.46) falls between the last two rows. Without `s1_touch_depth`, the leaky model's top feature is `s1_novice_n` (section 7.1), the same mechanism as above. **Any `s1_`-keyed statistic is suspect.** This includes calibration cells, consensus grades and the "A+ looked positive in 2026" pattern.

### 6.3 Creation features: none looks too good

- **For reaching 3R:** no allowed creation feature has a univariate AUC above **0.533** (OOS) or 0.527 (IS). The values are close in IS and OOS, so nothing collapses out of sample the way a leak would.
- **What the > 0.58 flags are:** they fire only for `stop_tc`, and only on size and cost features (`spread_R`, `stop_atr`, `height_vs_med`, `height_atr`, `room_R`, `gap`, `moveaway_h_create`, `leg_ratio`, `c_runout_h`). A zone that is small against ATR is more often run through by one candle. It is also more often carried to 3R, which is why the same features have y3 AUCs of only 0.51-0.53.
- **Why they are not leaks:** this is the ordinary volatility-against-size effect. It is the same in IS and OOS, it is known at creation, and it nets out in E.
- **No dominant feature in the trained models:** `spread_R` leads, and it is explained in section 7.

### 6.4 Leak audit: univariate AUC (direction-free) on trades

`stop_tc` = stopped on the touch candle itself.

| Feature | Kind | AUC y3 IS | AUC y3 OOS | AUC stop_tc IS | AUC stop_tc OOS |
|---|---|---|---|---|---|
| `spread_R` | creation | 0.527 | 0.533 | 0.620 | 0.613 |
| `opp_R` | creation | 0.509 | 0.524 | 0.556 | 0.536 |
| `hour` | creation | 0.515 | 0.523 | 0.547 | 0.534 |
| `plan_rr` | creation | 0.506 | 0.520 | 0.541 | 0.522 |
| `left_opp_R` | creation | 0.508 | 0.520 | 0.539 | 0.531 |
| `stop_atr` | creation | 0.507 | 0.516 | 0.644 | 0.634 |
| `sR` | creation | 0.507 | 0.516 | 0.551 | 0.537 |
| `is_demand` | creation | 0.513 | 0.514 | 0.515 | 0.519 |
| `opp_htf_R` | creation | 0.507 | 0.512 | 0.561 | 0.550 |
| `height_vs_med` | creation | 0.516 | 0.511 | 0.653 | 0.651 |
| `tl_bias` | creation | 0.502 | 0.511 | 0.503 | 0.511 |
| `origin_ok` | creation | 0.509 | 0.511 | 0.526 | 0.521 |
| `s1_touch_depth` | s1 (look-ahead) | 0.713 | 0.712 | 1.000 | 1.000 |
| `s1_stop_atr` | s1 (look-ahead) | 0.527 | 0.510 | 0.724 | 0.697 |
| `s1_height_atr` | s1 (look-ahead) | 0.518 | 0.509 | 0.676 | 0.682 |
| `s1_runout_h` | s1 (look-ahead) | 0.515 | 0.501 | 0.687 | 0.671 |
| `s1_height_vs_med` | s1 (look-ahead) | 0.520 | 0.518 | 0.674 | 0.670 |
| `s1_novice_n` | s1 (look-ahead) | 0.539 | 0.540 | 0.640 | 0.631 |
| `s1_height_pips` | s1 (look-ahead) | 0.512 | 0.510 | 0.600 | 0.603 |
| `s1_gap` | s1 (look-ahead) | 0.510 | 0.504 | 0.604 | 0.596 |

The largest creation-feature AUC for y3 is 0.527 in IS and 0.533 in OOS.

---

## 7. Do the important features make trading sense?

### 7.1 Feature importance (mean |SHAP| on the test trades, LightGBM)

| Rank | lgbm_F | lgbm_R | lgbm_s1nd_Fplus |
|---|---|---|---|
| 1 | spread_R (0.0436) | spread_R (0.0621) | s1_novice_n (0.0646) |
| 2 | leg_ratio (0.0106) | is_demand (0.0225) | spread_R (0.0261) |
| 3 | opp_R (0.0083) | hour (0.0154) | s1_appr_spd (0.0181) |
| 4 | hour (0.0073) | pattern (0.0125) | s1_stop_atr (0.0181) |
| 5 | moveaway_h_create (0.0072) | plan_rr (0.0095) | s1_cross_needed (0.0145) |
| 6 | appr_spd (0.0046) | appr_spd (0.0092) | pattern (0.0097) |
| 7 | legin_atr (0.0039) | sS (0.0083) | s1_runout_bars (0.0086) |
| 8 | runout_atr (0.0035) | sR (0.0082) | s1_runout_atr (0.0060) |
| 9 | gap_open (0.0033) | bigger_align (0.0081) | is_demand (0.0056) |
| 10 | curve_zone (0.0031) | height_vs_med (0.0081) | s1_near_tl (0.0053) |
| 11 | cons (0.0031) | leg_ratio (0.0076) | s1_appr_bars (0.0048) |
| 12 | height_vs_med (0.0030) | cons (0.0051) | s1_room_R (0.0041) |
| 13 | zgrade_o (0.0028) | stop_atr (0.0051) | s1_height_vs_med (0.0032) |
| 14 | gap (0.0028) | runout_atr (0.0051) | s1_stair (0.0030) |
| 15 | score (0.0027) | legout_rel (0.0048) | left_opp_R (0.0028) |

Spearman rank correlation of importances, F vs R: 0.60. Top-10 overlap: 3 of 10 (appr_spd, hour, spread_R).

### 7.2 Reading the features

- **`spread_R` (rank 1 in both directions): yes, it makes sense, and it is a cost rather than an edge.**
  - The spread is paid on every trade and is part of 1R, so on tiny zones most of the risk is spread.
  - E/trade by `spread_R` quintile (cuts from IS):

    | Period | Q1 | Q2 | Q3 | Q4 | Q5 |
    |---|---|---|---|---|---|
    | IS | −0.04 | −0.05 | −0.04 | −0.13 | −0.22 |
    | OOS | −0.04 | +0.00 | −0.07 | −0.08 | −0.35 |

  - The top quintile has a median `spread_R` of 0.17 in IS and 0.28 in OOS. It holds on all 5 symbols.
  - **Server hours 0-2 (rollover)** carry a median `spread_R` of 0.10 and the worst E in both periods: −0.20 in IS, −0.29 in OOS.
- **`opp_R` / `plan_rr` / `room_R`: yes.** An opposing zone close in front is worse: the lowest quintile of `opp_R` is −0.16 in IS and −0.17 in OOS. This is the mentors' "room to the target" rule, but the effect is small.
- **`is_demand` (rank 2 in R): regime, not edge.**
  - Demand beat supply in 2023-25: −0.09 vs −0.11 in 2023, −0.07 vs −0.16 in 2024, −0.01 vs −0.13 in 2025.
  - In 2026 it reversed: supply −0.05, demand −0.13.
  - The reverse model learned "supply is better" from 2026 and applied it to the years where demand was better. That is one reason R fails.
- **`leg_ratio`, `moveaway_h_create`, `legin_atr` (forward model): not stable.**
  - In 2023-25 the biggest departures were the worst trades: the top quintile was −0.18 for `leg_ratio` and −0.19 for `moveaway_h_create`. That is the opposite of the "strong departure" rule.
  - In 2026 the same quintiles are flat (−0.09 and −0.12).
- **Mentor-derived scores are minor features:** `cons`, `sS`, `sR`, `score`, `zgrade` sit at importance rank 10+ with a small effect. On its own, `cons` has AUC 0.515 forward and **0.495 reverse**, and its top quintile is −0.14R in reverse, worse than random.
- **Stability:** the Spearman correlation of F and R importances is 0.60. The top-10 overlap is only 3 of 10 (`spread_R`, `hour`, `appr_spd`). What the two directions share is cost and time of day, not zone quality.

---

## 8. Next step

1. **Do not spend more effort on model choice for this question.** Specifically:
   - no TabPFN 2.5/3 on the VPS;
   - no Mitra;
   - no bigger ensembles.

   At AUC ≈ 0.52-0.53 with E < 0 in every top bucket, a model that is 0.01 AUC better cannot reach E > 0. The scripts accept any new columns, so the gate can be rerun cheaply whenever the data changes.
2. **Fix the measurement first (Stage 0):** this is a logger change, not part of this research task, and the user decides it.
   - Add an `s0_*` snapshot on the close of the candle **before** the touch. That is what is known while the limit order rests.
   - Mark `s1_touch_depth` and the other touch-candle values as outcome-only.
   - Re-key the calibration cells and consensus grades away from `s1_`.
   - Then rerun this benchmark with `s0_*` added to the allow-list. The criteria stay unchanged, and they must hold in both directions.
3. **If the zone DNA cannot rank trades, look elsewhere for an edge**, using the same pre-registered protocol:
   - **Execution and trade model:** the front, mid or deep entry (`t1f_`/`t1m_`/`t1d_`), the close stop (`t1c_`), and 2R targets. The 2R model had the best AUC (0.549), and its top decile was +0.06 [−0.01, +0.13] forward. Any such test must count spread and slippage.
   - **Costs:** as a research question for the bot, a `spread_R` cap, roughly the worst 20-40% of zones, plus avoiding the rollover hours. It reliably cuts losses (−0.09 → about −0.03R), but on its own it is **not** an edge.
   - **The news-window filter** (`HuggingFace_Opportunities.md` #3). 27% of trades are stopped on the touch candle itself, and news candles are the obvious candidate.
4. **More out-of-sample data would help C1.** For example, AUD/GBP/JPY for 2023-25, which would allow a reverse test on all 5 symbols. With about 1,000 top-quintile trades per symbol per year, the per-symbol CI half-width is about ±0.11R. An edge smaller than about 0.1R per trade cannot pass C1 on 10 months of data.

---

## 9. Reproduce

```bash
python3 -m venv venv && venv/bin/pip install numpy pandas scikit-learn lightgbm torch tabpfn tabicl
# weights (Hugging Face): Prior-Labs/TabPFN-v2-clf/tabpfn-v2-classifier.ckpt, jingang/TabICL/tabicl-classifier-v2-20260212.ckpt -> HF_DIR
IS=.../research2/is  OOS=.../research1/in
OMP_NUM_THREADS=1 venv/bin/python -I tools/zone_research/ml/leak_audit.py --is $IS --oos $OOS --out out/audit
OMP_NUM_THREADS=1 venv/bin/python -I tools/zone_research/ml/benchmark.py --is $IS --oos $OOS --out out/fast \
    --models lgbm,lr,lgbm_s1,lgbm_s1nd,lgbm_age,lgbm_y2,lgbm_y5 --splits F,Fplus,R
venv/bin/python -I tools/zone_research/ml/benchmark.py --is $IS --oos $OOS --out out/tabicl --models lgbm,tabicl --splits F,R --hf-dir $HF_DIR
venv/bin/python -I tools/zone_research/ml/benchmark.py --is $IS --oos $OOS --out out/tabpfn --models lgbm,tabpfn --splits F,R --hf-dir $HF_DIR
venv/bin/python -I tools/zone_research/ml/make_tables.py --runs out/fast out/tabicl out/tabpfn --audit out/audit > tables.md
```

The seeds are fixed (`SEED = 7`) and LightGBM is deterministic. Runtimes on a shared 4-core box: fast models about 3 min, TabICL about 23 min (F + R), TabPFN about 53 min (F + R).
