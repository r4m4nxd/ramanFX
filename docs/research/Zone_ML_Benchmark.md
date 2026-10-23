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

<<BOTTOMLINE>>

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
- **LightGBM.** Settings: `num_leaves` 7/15/31, `min_child_samples` 400/200/100, learning rate 0.03, feature fraction 0.6-0.8, L2 5-10, bagging 0.8, `max_bin` 63, monotone constraints `spread_R` −1 and `room_R` +1, and early stopping in the CV with a floor of 30 trees. CV picked the most conservative configuration (7 leaves, 400 per leaf). The best iteration was only 4-47 trees in every fold, which is itself a sign of very little signal.
- **Logistic regression.** Pipeline: median impute + missing flags, quantile → normal transform, one-hot categoricals, and L2 with C ∈ {0.003, 0.03, 0.3}. CV picked C = 0.003, the strongest shrinkage, in both directions.
- **Hugging Face challengers**, on CPU, with licences checked on 2026-10-23:
  - **TabPFN v2** (`Prior-Labs/TabPFN-v2-clf`, file `tabpfn-v2-classifier.ckpt`). Licence: Prior Labs License 1.1, which is Apache-2.0 plus an attribution clause that applies only on distribution; internal benchmarking needs no attribution. It is usable for this personal research. TabPFN 2.5/3 are gated and non-commercial, so they were not used.
  - **TabICL v2** (`jingang/TabICL`, file `tabicl-classifier-v2-20260212.ckpt`, BSD-3-Clause).
  - Both use the `tabpfn` 9.2.0 and `tabicl` 2.2.0 pip packages on `torch` 2.14 for CPU.
- **Bootstrap.** 2,000 resamples of whole creation days, seed 7. Lift is paired: the top bucket and all trades are measured on the same resampled days.

**Deviations from the pre-registration** (compute only; all decided before any HF result was seen):
- **TabPFN v2** had 3,000 training rows (stratified by period × label), the top 40 features by LightGBM gain on **that split's training trades**, and 2 ensemble members. On this shared 4-core box it needed about 27 s per 1,000 test rows even with the training context cached, and about 70 s for 1,000 rows with all 120 features.
- **TabICL v2** had 6,000 training rows, all features, and 2 ensemble members. A first run with 10,000 rows and 4 members was killed by the out-of-memory killer, while another job was running on the box.
- **Single-threaded LightGBM.** OpenMP with 4 threads was about 35× slower on the loaded machine. This does not change the results, because `deterministic=True` is set.
- **A second non-ML reference**, "lowest `spread_R`", was added after the first fast-model run. That run showed `spread_R` as the dominant feature, and the reference tests whether the ML adds anything beyond it. It is not gated.

---

## 4. Results

<<TABLES>>

---

## 5. Pass/fail against the pre-registered criteria

<<PASSFAIL>>

---

## 6. Leak audit and the `s1_` reproduction

<<LEAK>>

---

## 7. Do the important features make trading sense?

<<SENSE>>

---

## 8. Next step

<<NEXT>>

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

The seeds are fixed (`SEED = 7`) and LightGBM is deterministic. Runtimes on a shared 4-core box: fast models about 3 min, TabICL about <<TICL>>, TabPFN about <<TPFN>>.
