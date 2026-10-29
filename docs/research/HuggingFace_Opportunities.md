# Hugging Face opportunities for RamanFX, ZoneVision and ZoneBot

Research date: 2026-10-23. Scope: models, datasets, Spaces and libraries on Hugging Face (HF) that could improve the trading journal and learning app, the ZoneVision indicator and the ZoneBot EA, judged against this repo's own research results. No code was changed.

Every HF id below was checked against the HF API (`/api/models|datasets|spaces/<id>`) on 2026-10-23 and returned HTTP 200. The one exception is the fev leaderboard: it redirects to `autogluon/fev-bench`, and that id is the one used here. Licences and sizes come from the API and the model cards on the same day.

---

## Bottom line

Nothing on Hugging Face will turn blind zone trading (about −0.09R per trade) into an edge, and the only "edge" this research found turned out to be a look-ahead bug in our own logger. I ran a quick check: LightGBM on the full Zone DNA, trained on 2023-25 and tested on 2026, looked excellent. The top decile made **+0.38R per trade (95% CI +0.30 to +0.46)** and it held on all five symbols. Then I removed the `s1_*` touch-snapshot columns, which the logger computes **on the close of the touch candle** while the trade fills intrabar at the proximal. The same model fell to **−0.02R (CI −0.09 to +0.05)**, with AUC 0.53, close to a coin flip. `s1_novice_n` alone predicts "stopped on the touch candle" with AUC 0.64, against 0.50 for the same feature taken at creation. So the first job is not a model. It is to fix and re-measure this, because it probably also affects the calibration cells and the consensus grades, which the spec keys on `s1_*` (§6.1). This matches the "A+ looked positive in 2026" pattern.

After that, the realistic gains from HF are small, mostly indirect, and testable:

1. **Volatility / range forecasts** to size stops and judge whether a 3R target fits in the expected move. One small model, IBM TTM, is the only foundation model that narrowly beat a HAR benchmark in an independent realized-volatility study that included FX.
2. **A free economic-calendar dataset** to test a news filter. Macro-announcement jumps in FX are well documented.
3. **Strong wins in the learning app**: in-browser mentor search, natural lesson narration (Kokoro, Apache-2.0, has Hindi voices), and an ASR / translation bake-off for Raja's Hindi/Urdu recordings.

Return-forecasting foundation models (Chronos, TimesFM, Moirai, Kronos), chart-pattern YOLO models, FinBERT-style sentiment and RL agents have weak or negative independent evidence for this use. Treat them as hype until our own walk-forward test passes.

---

## 1. Ranked table (top 15)

"Runs where": **here** = this 4-core CPU container. Note that this container **cannot download HF weight files**: the HF CDN (`us.aws.cdn.hf.co` / xet) is refused by the egress proxy, while the API and READMEs work. **VPS** = the user's free VPS or PC. **browser** = transformers.js / ONNX Runtime Web in the RamanFX app. **MT5** = MQL5 `OnnxCreate` / `OnnxCreateFromBuffer`.

| # | Idea | Component | HF ids (verified) | Licence | Runs where | Evidence | Effort | First experiment, and its pass criterion |
|---|---|---|---|---|---|---|---|---|
| 1 | **Leak-free zone scorer benchmark.** Fix the touch-snapshot look-ahead, then compare tabular models with the current `RFX_Calib.csv` cells | ZoneVision research, `analyze.py`, ZoneBot v2 gates | Baseline LightGBM (pip, not HF). Challengers: [Prior-Labs/tabpfn_2_5](https://huggingface.co/Prior-Labs/tabpfn_2_5), [autogluon/mitra-classifier](https://huggingface.co/autogluon/mitra-classifier), [jingang/TabICL-clf](https://huggingface.co/jingang/TabICL-clf) | LightGBM MIT. TabPFN 2.5/3: **non-commercial / no production use**. Mitra Apache-2.0. TabICL BSD-3 | here (LightGBM); VPS (TabPFN/Mitra, CPU is slow) | Our own run (§2.1): with the leak, +0.38R top decile; without it, −0.02R. TabPFN: vendor benchmarks only, none on trading data | S (after the logger fix) | Add an `s0_*` snapshot on the close of the candle **before** the touch, then train 2023-25 → test 2026 and 2026 → 2023-25. **Pass:** top-quintile E/trade > 0 with bootstrap CI_lo > 0 on ≥ 3 of 5 symbols **in both directions**, and Brier below the base rate by ≥ 0.5% |
| 2 | **Expected-range feature** ("does 3R fit?"): forecast the next-N-bar high-low range or realized volatility and compare it with zone height | ZoneVision DNA, ZoneBot target / skip rule | [ibm-granite/granite-timeseries-ttm-r2](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2) (about 1-5M params, 3.2 MB), [ibm-granite/granite-timeseries-ttm-r3](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r3) | Apache-2.0 | VPS; MT5 via ONNX (tiny MLP-mixer, fixed shapes) | HF paper 2607.05291: over 50 assets including FX, TTM is the **only** TSFM that beats Log-HAR at every horizon, and only narrowly. Equal-weight TTM+HAR is best | M | Stage 0 first: `range_need = 3R / (ATR × √bars)` from ATR alone, no model. Then TTM vs HAR on next-24-H1-bar log range, 2026 hold-out. **Pass:** QLIKE ratio vs HAR ≤ 0.97 **and** adding the forecast lifts zone E in the top bucket (CI_lo > 0) over the ATR-only feature |
| 3 | **News-window filter** (avoid touches near high-impact events) | ZoneBot gate, ZoneVision panel, journal tags | [datasets/Ehsanrs2/Forex_Factory_Calendar](https://huggingface.co/datasets/Ehsanrs2/Forex_Factory_Calendar) (2007 → 2025-04-07, impact levels, UTC offsets), [datasets/ZipLime/us-economic-events](https://huggingface.co/datasets/ZipLime/us-economic-events) | MIT / Apache-2.0 | here (join on the CSVs). Live: MQL5's built-in `Calendar*` functions (free in MT5) | Andersen, Bollerslev, Diebold & Vega (AER 2003): announcement surprises cause FX jumps. 26.9% of our touched trades are stopped **on the touch candle** | S | Join zone touches to high-impact events of either currency of the pair (±15/30/60 min), 2023-25. **Pass:** the in-window touches have worse E with CI separated from out-of-window, and this replicates in 2026 using MT5 calendar history (the HF dump ends in April 2025) |
| 4 | **"Ask your mentors" semantic search** in the browser | Learn page | [Xenova/multilingual-e5-small](https://huggingface.co/Xenova/multilingual-e5-small) (int8 118 MB; Hindi/Urdu + English), [Xenova/bge-small-en-v1.5](https://huggingface.co/Xenova/bge-small-en-v1.5) (int8 34 MB, English only), [Supabase/gte-small](https://huggingface.co/Supabase/gte-small) | MIT | browser (query only; passages embedded at build time) | MTEB-class models with mature transformers.js ports. Low risk | S | 50 real questions, each with the lesson(s) that answer it, written by the user. **Pass:** recall@5 ≥ 80% and ≥ 15 pp better than plain keyword search; query latency < 300 ms on a mid phone |
| 5 | **Natural lesson narration (TTS)**, pre-rendered offline | Listen player (`src/ui/listen/`) | [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), [onnx-community/Kokoro-82M-v1.0-ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX) (q8 86-92 MB; voices include Hindi `hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi`) | Apache-2.0 | VPS/here at build time → static MP3/Opus. Browser possible but a 90 MB download | Most-liked open TTS on HF (7k likes), widely used; quality is subjective | M | Render 10 lesson passages (with "DBR", "RBR", "proximal", "1:3 R") and do a blind A/B with the current Web Speech voices. **Pass:** the user prefers Kokoro ≥ 8/10, real-time factor < 1 on 4 CPU cores, and ≤ 1 mispronounced term per 1,000 words after a pronunciation lexicon |
| 6 | **Raja ASR bake-off** (Hindi/Urdu with English trading words) | `tools/raja_hindi` (after the current run finishes) | Current: [Systran/faster-whisper-large-v3](https://huggingface.co/Systran/faster-whisper-large-v3). Challengers: [ai4bharat/indic-conformer-600m-multilingual](https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual), [ARTPARK-IISc/whisper-large-v3-vaani-hindi](https://huggingface.co/ARTPARK-IISc/whisper-large-v3-vaani-hindi), [Oriserve/Whisper-Hindi2Hinglish-Prime](https://huggingface.co/Oriserve/Whisper-Hindi2Hinglish-Prime), [kingabzpro/whisper-large-v3-urdu](https://huggingface.co/kingabzpro/whisper-large-v3-urdu) | MIT / Apache-2.0 | here/VPS CPU (int8) | Vistaar (AI4Bharat): fine-tuned Indic models beat vanilla Whisper on Hindi. Urdu benchmark (arXiv 2409.11252): Whisper-large is best on conversational Urdu, Seamless on read speech. No study on code-mixed trading talk | M | Hand-correct 10 minutes of Raja (3 clips), then score WER/CER plus "term accuracy" on 40 trading terms. **Pass:** ≥ 15% relative lower WER, or ≥ 90% term accuracy vs the current baseline. Keep large-v3 otherwise |
| 7 | **Hindi/Urdu → English translation** of transcripts | Raja lessons (`src/core/mentors/raja`) | [ai4bharat/indictrans2-indic-en-1B](https://huggingface.co/ai4bharat/indictrans2-indic-en-1B), [ai4bharat/indictrans2-indic-en-dist-200M](https://huggingface.co/ai4bharat/indictrans2-indic-en-dist-200M); alternatives [facebook/nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M), [facebook/seamless-m4t-v2-large](https://huggingface.co/facebook/seamless-m4t-v2-large) | IndicTrans2 MIT. NLLB / Seamless CC-BY-NC-4.0 (personal use only) | here/VPS CPU | IndicTrans2 (TMLR 2023) is the reference open model for the 22 Indic languages, including Urdu | S-M | 30 segments: Whisper `task=translate` vs IndicTrans2 on the Hindi transcript vs NLLB. The user rates them blind on a 1-5 scale for meaning and trading terms. **Pass:** mean ≥ 4 and better than Whisper-translate on ≥ 20/30 |
| 8 | **Second, independent price source** for replicating zone statistics (broker-feed and timezone robustness) | ZoneVision research | [datasets/Yllvar/fx-historical-data](https://huggingface.co/datasets/Yllvar/fx-historical-data) (Dukascopy, UTC, M1-D1, 28 FX + XAU/XAG), [datasets/qleap/dukascopy-ticks-ohlcv](https://huggingface.co/datasets/qleap/dukascopy-ticks-ohlcv), [datasets/fokan/xauusd-2009-2026](https://huggingface.co/datasets/fokan/xauusd-2009-2026) | CC-BY-4.0 / MIT / none stated | MT5 custom symbol on the VPS | Data quality is not peer-reviewed. Check gaps and session alignment | M | Import EURUSD/XAUUSD H1+M15 as an MT5 custom symbol and re-run research mode. **Pass:** headline E per TF within the CI of the broker run. A large gap means our stats depend on the broker feed |
| 9 | **Conformal / calibrated probabilities** on whatever scorer survives #1 | ZoneVision grades, ZoneBot risk sizing | (library: MAPIE / crepes, not HF) | BSD | here | Online and adaptive conformal methods keep near-nominal coverage on EUR/USD minute data (preprints). Only useful if #1 finds signal | S | Split-conformal on 2026 walk-forward. **Pass:** each decile's observed p(3R) within ±5 pp (the current spec uses ±7 pp) |
| 10 | **Journal screenshot reader** (MT5/TradingView screenshots → entry, SL, TP, symbol, time) | Journal import | [microsoft/Florence-2-base-ft](https://huggingface.co/microsoft/Florence-2-base-ft) / [onnx-community/Florence-2-base-ft](https://huggingface.co/onnx-community/Florence-2-base-ft) (OCR, about 250 MB q4), [Qwen/Qwen3-VL-2B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct) (VPS) | MIT / Apache-2.0 | browser (Florence) or VPS (Qwen-VL) | OCR is mature. Chart understanding of candles is weak (see §5) | M | 30 of the user's own screenshots. **Pass:** ≥ 95% exact-field accuracy for prices and symbol; otherwise keep manual entry |
| 11 | **Zero-shot range forecasts from larger TSFMs** (alternatives to #2) | ZoneVision DNA | [amazon/chronos-bolt-tiny](https://huggingface.co/amazon/chronos-bolt-tiny) (ONNX: [bakshinghampalace/chronos-bolt-tiny-onnx](https://huggingface.co/bakshinghampalace/chronos-bolt-tiny-onnx), 10 MB quantised), [amazon/chronos-2](https://huggingface.co/amazon/chronos-2), [Datadog/Toto-2.0-4m](https://huggingface.co/Datadog/Toto-2.0-4m), [google/timesfm-2.5-200m-pytorch](https://huggingface.co/google/timesfm-2.5-200m-pytorch) | Apache-2.0 (TimesFM **3.0** is non-commercial) | VPS; Chronos-Bolt-tiny possibly MT5 | 2607.05291: Chronos-Bolt and TimesFM-2.5 lose to Log-HAR on the equal-weight average; gains are concentrated in outlier assets | M | Same protocol as #2. **Pass:** beats HAR **and** TTM on QLIKE on ≥ 3/5 symbols |
| 12 | **Kronos K-line model** as a candle-aware feature (zero-shot predicted range/direction at the touch) | ZoneVision research only | [NeoQuasar/Kronos-mini](https://huggingface.co/NeoQuasar/Kronos-mini) (4.1M, 16 MB), [NeoQuasar/Kronos-small](https://huggingface.co/NeoQuasar/Kronos-small) (24.7M), [NeoQuasar/Kronos-Tokenizer-2k](https://huggingface.co/NeoQuasar/Kronos-Tokenizer-2k) | MIT | VPS CPU (sampling is slow); not practical in MT5 (tokenizer + sampling loop) | The authors' AAAI-26 paper claims big RankIC gains; an informal review questions their ensembling protocol. Independent study of 5,000 A-shares: zero-shot Kronos volatility error is **2.4-2.6× HAR**. Likely saw our test years in pre-training | M | Kronos-mini predicted 24-bar range at each touch, 2026 only. **Pass:** same as #2. Expect failure; it costs only one VPS evening |
| 13 | **Small in-browser LLM** to phrase answers over retrieved lesson text | Learn page | [onnx-community/Qwen3-0.6B-ONNX](https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX) (q4 about 0.9 GB), [mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC](https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC) (WebLLM), [Qwen/Qwen3.5-0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B) | Apache-2.0 / Llama 3.2 licence | browser (WebGPU), heavy first load | Sub-1B models paraphrase but hallucinate. Risk of wrong trading rules attributed to a mentor | M | Same 50 questions as #4. **Pass:** ≥ 90% of answers judged faithful to the retrieved quotes, zero invented rules. Otherwise ship retrieval + quotes only (#4) |
| 14 | **Spread / slippage model** for execution quality | ZoneBot | No useful HF model or dataset (searched "slippage", "order book", "LOB") | – | here (on our own logs) | Our CSVs already log `spread`. Our own tick data is the right source | S | Quantile regression of spread by hour × weekday × news window on MT5 tick history. **Pass:** the bot's "skip if spread > p90" rule changes E/trade by more than its CI half-width |
| 15 | **Economic-text sentiment** (FOMC hawkish/dovish, FinBERT) | Journal context only | [gtfintechlab/FOMC-RoBERTa](https://huggingface.co/gtfintechlab/FOMC-RoBERTa), [ProsusAI/finbert](https://huggingface.co/ProsusAI/finbert), [mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis) | CC-BY-NC-4.0 / **CC-BY-NC-SA-4.0** / Apache-2.0 | browser / here | Trained on headline/phrase sentiment, not on FX reaction. No free live news feed. Timing matters more than tone for wick stops | S | Only if #3 passes: does FOMC statement tone predict the sign of the post-statement EURUSD move in 2018-25? **Pass:** hit rate > 60% over ≥ 40 meetings. Otherwise drop |

Not in the table (see §8): chart-pattern YOLO models, FinRL/SB3 trading agents, "Forex-LLM" fine-tunes, Moirai (non-commercial and no better), TimesFM 3.0 (non-commercial).

---

## 2. Zone scoring (ZoneVision research, ZoneBot gates)

### 2.1 What I measured here (quick check, not a feature)

Data: the existing research CSVs in the session scratchpad. In-sample (IS) = `research2/is` (EURUSD + XAUUSD, 2023-01 → 2025-12, 32,628 touched zones). Out-of-sample (OOS) = `research1/in` (AUDUSD, EURUSD, GBPUSD, USDJPY, XAUUSD, 2026-01 → 10, 21,970 touched zones).

Setup:

- **Label:** touch 1 reaches 3R before the wick stop (the logged trade model). E3 = +3 / −1 / 0.
- **Model:** LightGBM (15 leaves, min 200 per leaf, L2 = 10, early stopping on the last 20% of IS by date).
- **Excluded columns:** every outcome column (`status`, `broken*`, `touches`, `t1*`, `t2*`, `t3*`, `ret_next`) and `symbol`.

| Feature set | IS-late AUC | OOS-2026 AUC | OOS Brier (base 0.17537) | OOS top decile E3 (95% CI) | OOS bottom decile E3 |
|---|---|---|---|---|---|
| All DNA incl. `s1_*` touch snapshot (232 cols) | 0.581 | **0.593** | 0.17115 | **+0.379 (+0.303 … +0.461)**, positive on all 5 symbols | −0.596 |
| Creation-time only: no `s1_*` and no fields frozen at the touch (115 cols) | 0.542 | **0.529** | 0.17500 | **−0.021 (−0.094 … +0.051)** | −0.303 |

**Why the first row is not real.** Spec §6.1 says *"Every touch-time value is computed on the touch candle's close."* The logged trade, however, is a limit order at the proximal that fills **during** the touch candle. So `s1_*` can see the candle that stops the trade. 26.9% of touched trades are stopped on the touch candle itself (54,598 touched, both periods). The touch-close versions of the features predict exactly those same-candle stops, while their creation-time twins do not:

| Feature | AUC for "stopped on the touch candle" |
|---|---|
| `s1_novice_n` (counts big candles in the last 10 bars, so it includes the touch candle) | **0.637** |
| `novice_n` (at creation) | 0.500 |
| `s1_stop_atr` (ATR includes the touch candle) | 0.287 (i.e. 0.713 inverted) |
| `stop_atr` (at creation) | 0.352 |

The features the LightGBM ranked highest were `s1_novice_n`, `s1_stop_atr`, `s1_cross_needed`, `s1_appr_spd` and `s1_runout_atr`, which is the signature of leakage.

**Implications to check before any modelling:**

- The calibration cells (L0-L5), the lens weights, the logistic p(3R) and the consensus/A+ grades are keyed on the `s1_` snapshot (spec §6.1/§6.3). Any OOS "A+ is positive" result that uses `s1_cons` may carry the same bias.
- Live, ZoneBot cannot know the touch candle's close when its limit fills, so the backtest cannot be reproduced live.
- **Fix options:**
  - (a) Log an `s0_*` snapshot on the close of the candle **before** the touch. This is legal for a resting limit order.
  - (b) Keep `s1_*` but pair it only with a trade model that enters **at the touch candle's close** (confirmation entry), and log that model's outcome.
  - Add a regression test to M5's "no look-ahead" check: truncate the history at the touch bar minus 1 and assert the `s0_` columns are identical.
- With creation-time features only, the best tabular model barely ranks zones (AUC 0.53) and finds no positive bucket. That agrees with the analyzer's own logistic, which did not beat the base rate (Brier 0.1759 vs 0.1756).

Scripts (ephemeral scratchpad, not committed): `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/hfr/scripts/gbm_zones.py` (`all` / `create` modes) and `/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/hfr/scripts/leak_check.py`.

### 2.2 Tabular foundation models (TabPFN, Mitra, TabICL)

- [Prior-Labs/TabPFN-v2-clf](https://huggingface.co/Prior-Labs/TabPFN-v2-clf) is licensed under the Prior Labs License (Apache-2.0 plus attribution). [Prior-Labs/tabpfn_2_5](https://huggingface.co/Prior-Labs/tabpfn_2_5) and [Prior-Labs/tabpfn_3](https://huggingface.co/Prior-Labs/tabpfn_3) are gated and *"cannot be used for any commercial or production purpose"*. They are fine for research on the VPS; to use one in ZoneBot, use v2 or buy a licence.
  - Limits: v2.5 is "not tested > 50,000 samples". v3 claims up to 1M rows. Our IS (about 33k touched zones) fits.
  - CPU inference on 30k × 100 features is slow but workable overnight on a VPS.
- [autogluon/mitra-classifier](https://huggingface.co/autogluon/mitra-classifier) (72M, Apache-2.0) and [jingang/TabICL-clf](https://huggingface.co/jingang/TabICL-clf) (BSD-3; ONNX port [bakshinghampalace/tabicl-classifier-v2-onnx](https://huggingface.co/bakshinghampalace/tabicl-classifier-v2-onnx)) are the licence-clean alternatives.
- **Evidence:** vendor benchmarks show wins on generic tables. An ICML 2025 study found TabPFN more robust to label noise than boosting. Nothing tests them on low-signal trading outcomes. **The prior:** if a tuned LightGBM finds AUC 0.53 with a leak-free feature set, a foundation model may add about 0.01 AUC, which is not enough to turn E positive.
- **Deployment:** in MT5, an in-context model (TabPFN/TabICL) needs the training set at inference time, so it does not fit `OnnxCreate`. If anything passes, either distil it into a LightGBM (exportable via `onnxmltools`; MQL5 articles show LightGBM/CatBoost classifiers running with `OnnxCreate` and `target_opset {"":12, "ai.onnx.ml":2}`), or keep the existing **lookup-table** approach (`RFX_Calib.csv`), which is simpler and auditable.

### 2.3 Chart-image models (vision transformers, YOLO)

- [foduucom/stockmarket-pattern-detection-yolov8](https://huggingface.co/foduucom/stockmarket-pattern-detection-yolov8) (440 likes) has **no licence** on its card. It detects textbook patterns (head and shoulders, triangles, "W bottom") on screenshots, not supply/demand bases, and publishes no out-of-sample trading results. Same for [foduucom/stockmarket-future-prediction](https://huggingface.co/foduucom/stockmarket-future-prediction) and its Space. **Avoid.**
- Academic precedent: Jiang, Kelly & Xiu, "(Re-)Imag(in)ing Price Trends" (J. Finance 2023). CNNs on 5/20/60-day stock chart images predict cross-sectional US equity returns. That is a different problem (ranking thousands of stocks, daily) from timing touches on five FX/gold symbols. ZoneVision already computes the geometry a CNN would have to rediscover from pixels, so images add noise and look-ahead risk (rendering the touch candle) without adding information.

### 2.4 Conformal prediction

Use it only on a scorer that has passed #1. Split or adaptive conformal on a walk-forward split gives calibrated per-zone p(3R) intervals for risk sizing. Preprints report near-nominal coverage on EUR/USD minute data. Libraries: MAPIE or crepes (pip). No HF model is needed.

---

## 3. Time-series foundation models (volatility, range, returns)

| Model | Params / size | Licence | CPU / ONNX | Independent financial evidence |
|---|---|---|---|---|
| [ibm-granite/granite-timeseries-ttm-r2](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r2), [-ttm-r3](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r3) | about 1-5M (r3: an MoE of 1-35M experts); 3.2 MB | Apache-2.0 | Excellent on CPU; an MLP-mixer that exports cleanly to ONNX with fixed shapes, so it is a realistic MT5 candidate | **Best of the TSFMs on realized volatility**, beating Log-HAR at h = 1/5/22, but narrowly (HF paper [2607.05291](https://huggingface.co/papers/2607.05291), 50 assets incl. FX) |
| [ibm-granite/granite-timeseries-tspulse-r1](https://huggingface.co/ibm-granite/granite-timeseries-tspulse-r1) | 1M | Apache-2.0 | CPU | Anomaly detection / classification / regime-like embeddings; no trading evidence |
| [amazon/chronos-bolt-tiny](https://huggingface.co/amazon/chronos-bolt-tiny) / [-small](https://huggingface.co/amazon/chronos-bolt-small) | 9M / 48M | Apache-2.0 | CPU fine; ONNX ports exist ([bakshinghampalace/chronos-bolt-tiny-onnx](https://huggingface.co/bakshinghampalace/chronos-bolt-tiny-onnx), [TSFM-ai/chronos-bolt-tiny-onnx-browser](https://huggingface.co/TSFM-ai/chronos-bolt-tiny-onnx-browser)) | Loses to Log-HAR on the equal-weight average (2607.05291) |
| [amazon/chronos-2](https://huggingface.co/amazon/chronos-2), [autogluon/chronos-2-small](https://huggingface.co/autogluon/chronos-2-small) | 120M / small | Apache-2.0 | CPU OK in batch; supports covariates (session, news flags) | Returns: wins few tasks vs random walk; DM test significant on 1 of 5 stocks for Chronos ([2606.27100](https://huggingface.co/papers/2606.27100)) |
| [google/timesfm-2.5-200m-pytorch](https://huggingface.co/google/timesfm-2.5-200m-pytorch) | 200M | Apache-2.0 | CPU slow-ish | Loses to Log-HAR on the equal-weight average; returns near random walk |
| [google/timesfm-3.0-pytorch](https://huggingface.co/google/timesfm-3.0-pytorch) | about 1B-class | **TimesFM Non-Commercial v1.0** | – | None independent yet |
| [Salesforce/moirai-2.0-R-small](https://huggingface.co/Salesforce/moirai-2.0-R-small) | small | **CC-BY-NC-4.0** | CPU | Returns: best average rank with TimesFM-2.5 in 2606.27100, but still only 1 significant DM win vs random walk |
| [Datadog/Toto-2.0-4m](https://huggingface.co/Datadog/Toto-2.0-4m), [-22m](https://huggingface.co/Datadog/Toto-2.0-22m) | 4M / 22M | Apache-2.0 | CPU fine | Observability-focused; GIFT-Eval leader claims; no finance test found |
| [time-series-foundation-models/Lag-Llama](https://huggingface.co/time-series-foundation-models/Lag-Llama) | about 2.5M | Apache-2.0 | CPU | Superseded; no finance evidence |
| [thuml/sundial-base-128m](https://huggingface.co/thuml/sundial-base-128m) | 128M | Apache-2.0 | CPU | None in finance |
| [NeoQuasar/Kronos-mini](https://huggingface.co/NeoQuasar/Kronos-mini) / [-small](https://huggingface.co/NeoQuasar/Kronos-small) / [-base](https://huggingface.co/NeoQuasar/Kronos-base) | 4.1M / 24.7M / 102M | MIT | CPU feasible for mini/small; autoregressive token sampling, so not an MT5 fit | Authors (AAAI-26, [2508.02739](https://huggingface.co/papers/2508.02739)): +93% RankIC, −9% vol MAE. Independent: on 5,000 Chinese stocks, HAR-RV beats zero-shot Kronos (error 2.4-2.6× HAR; Finance Research Letters 2026). A GitHub user test on A-shares: "not usable for short-term trading". Pre-trained on 12B K-lines from 45 exchanges, so our test years are likely in its pre-training set |

**Consensus of the independent evidence:**

- [2511.18578](https://huggingface.co/papers/2511.18578), "Re(Visiting) TSFMs in Finance": off-the-shelf TSFMs *"perform poorly in zero-shot and fine-tuning settings"* on daily returns across 94 countries. Only models pre-trained from scratch on financial data helped.
- [2606.27100](https://huggingface.co/papers/2606.27100): gains over random walk are *"small and sparse"*.
- [2607.05291](https://huggingface.co/papers/2607.05291): for volatility, *"only one small model, TTM, beats the benchmark at every horizon, and by a narrow margin"*. Much of the short-horizon edge is scaling, not dynamics.

**So, for this system:** never use a TSFM to forecast direction. The plausible use is a **range / volatility feature** for stops, targets and "skip, the market is too quiet for 3R". Even then, the ATR-only version (Stage 0) has to be beaten first.

Benchmarks and Spaces for checking claims: [Salesforce/GIFT-Eval](https://huggingface.co/spaces/Salesforce/GIFT-Eval), [autogluon/fev-bench](https://huggingface.co/spaces/autogluon/fev-bench) (neither contains FX trading tasks); datasets [autogluon/chronos_datasets](https://huggingface.co/datasets/autogluon/chronos_datasets), [Salesforce/GiftEval](https://huggingface.co/datasets/Salesforce/GiftEval).

---

## 4. Regime, sessions and news

- **Economic calendar (free):**
  - [Ehsanrs2/Forex_Factory_Calendar](https://huggingface.co/datasets/Ehsanrs2/Forex_Factory_Calendar): MIT; 83k rows; impact low/medium/high; actual/forecast/previous; ISO times with offset (originally collected in Asia/Tehran display time, so normalise to UTC). It is a **snapshot ending 2025-04-07**, so it covers our 2023-25 IS but not the 2026 OOS.
  - [ZipLime/us-economic-events](https://huggingface.co/datasets/ZipLime/us-economic-events) (Apache-2.0, point-in-time US releases) and [ZipLime/fomc-events](https://huggingface.co/datasets/ZipLime/fomc-events).
  - Live and for 2026: MT5's built-in `CalendarValueHistory` / `CalendarEventById` (free and broker-independent) is the production source, and it avoids scraping.
- **Why it matters:** scheduled announcements produce jumps in FX conditional means (Andersen, Bollerslev, Diebold & Vega, AER 2003). Our wick stop sits at the distal, and 26.9% of touched trades are stopped on the touch candle. A news spike through the zone is exactly that failure mode, so this is a cheap, theory-backed filter to test (rank #3).
- **Sessions:** the CSVs already log `session`, `hour`, `min_from_open`. No model is needed; the calendar join plus the existing session bins cover it.
- **Regime models on HF** (e.g. "market-regime-classifier" XGBoost repos) are tiny personal projects with no evaluation, so they were not cited. A regime proxy we can test ourselves: TTM/HAR forecast volatility percentile, and the Direction engine state.
- **Sentiment:**
  - [ProsusAI/finbert](https://huggingface.co/ProsusAI/finbert) is now **CC-BY-NC-SA-4.0**. [yiyanghkust/finbert-tone](https://huggingface.co/yiyanghkust/finbert-tone) has no licence tag.
  - [mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis) (Apache-2.0; browser port [Xenova/distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/Xenova/distilroberta-finetuned-financial-news-sentiment-analysis)).
  - [gtfintechlab/FOMC-RoBERTa](https://huggingface.co/gtfintechlab/FOMC-RoBERTa) (CC-BY-NC-4.0), with dataset [gtfintechlab/fomc_communication](https://huggingface.co/datasets/gtfintechlab/fomc_communication). [Moritz-Pfeifer/CentralBankRoBERTa-sentiment-classifier](https://huggingface.co/Moritz-Pfeifer/CentralBankRoBERTa-sentiment-classifier) (MIT).
  - These classify headline tone, not the market reaction. Without a free real-time news feed they cannot run live, and **timing** (is there an event in the window?) beats **tone** for a wick-stop strategy. Low priority (#15).

---

## 5. Learning app (RamanFX Learn, Listen, Journal)

### 5.1 Speech recognition for Raja (Hindi/Urdu, code-mixed with English trading terms)

The current pipeline is faster-whisper `large-v3`, int8, beam 5, VAD, with an initial prompt (`tools/raja_hindi/transcribe.py`, read only, not touched). Candidates:

- [ai4bharat/indic-conformer-600m-multilingual](https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual): MIT; 22 Indic languages; CTC/RNNT. There is a Hindi ONNX int8 build at [OpenVoiceOS/ai4bharat-indicconformer-hi-onnx](https://huggingface.co/OpenVoiceOS/ai4bharat-indicconformer-hi-onnx) (138 MB). It outputs Devanagari and handles English words poorly, which is a problem for "demand zone", "proximal" and similar terms.
- [ARTPARK-IISc/whisper-large-v3-vaani-hindi](https://huggingface.co/ARTPARK-IISc/whisper-large-v3-vaani-hindi) (Apache-2.0): Whisper large-v3 fine-tuned on Vaani, a dataset of diverse Indian accents.
- [Oriserve/Whisper-Hindi2Hinglish-Prime](https://huggingface.co/Oriserve/Whisper-Hindi2Hinglish-Prime) (Apache-2.0) writes **Hinglish in Latin script**, which may suit code-mixed trading talk best and makes English terms searchable.
- Urdu: [kingabzpro/whisper-large-v3-urdu](https://huggingface.co/kingabzpro/whisper-large-v3-urdu) (Apache-2.0; CT2 build available). The Urdu ASR benchmark (arXiv 2409.11252) found Whisper-large best on conversational Urdu.
- Speed: [openai/whisper-large-v3-turbo](https://huggingface.co/openai/whisper-large-v3-turbo) is about 3-4× faster on CPU with a slight accuracy loss, so it is useful for quick re-runs.
- Evidence gap: no published benchmark on Hindi-Urdu-English trading lectures exists, so our own 10-minute hand-corrected test set (rank #6) is the only reliable judge.

### 5.2 Translation

- [ai4bharat/indictrans2-indic-en-1B](https://huggingface.co/ai4bharat/indictrans2-indic-en-1B) (MIT; the distilled 200M version for CPU) is the open state of the art for Indic → English, including Urdu.
- [facebook/nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M) and [facebook/seamless-m4t-v2-large](https://huggingface.co/facebook/seamless-m4t-v2-large) (speech → English text directly) are **CC-BY-NC-4.0**: fine for a private personal app, not for selling.
- [sarvamai/sarvam-translate](https://huggingface.co/sarvamai/sarvam-translate) is GPL-3.0 and 4B (VPS only).
- Keep the human in the loop: trading terms must be checked against the glossary.

### 5.3 Text-to-speech for lesson narration

- [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M): Apache-2.0, 82M parameters. ONNX q8 is 86-92 MB ([onnx-community/Kokoro-82M-v1.0-ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX)). English US/UK voices are very natural, and there are **four Hindi voices**. A browser demo exists: [webml-community/kokoro-webgpu](https://huggingface.co/spaces/webml-community/kokoro-webgpu).
- **Recommendation:** pre-render at build time on CPU, store Opus/MP3 per lesson section, and keep Web Speech as the fallback and for user-typed text. This avoids a 90 MB first-load download on phones and gives identical audio for every user.
- Lighter: [KittenML/kitten-tts-nano-0.8-int8](https://huggingface.co/KittenML/kitten-tts-nano-0.8-int8) (Apache-2.0, very small, English only, lower quality).
- Other options:
  - [ai4bharat/indic-parler-tts](https://huggingface.co/ai4bharat/indic-parler-tts) (Apache-2.0): Hindi/Urdu-quality voices, too large for the browser, fine for offline pre-rendering of Raja's lessons in Hindi.
  - [parler-tts/parler-tts-mini-v1](https://huggingface.co/parler-tts/parler-tts-mini-v1) (Apache-2.0) and [myshell-ai/MeloTTS-English](https://huggingface.co/myshell-ai/MeloTTS-English) (MIT).
  - [ResembleAI/chatterbox](https://huggingface.co/ResembleAI/chatterbox) (MIT, expressive, heavier).
  - [Supertone/supertonic-3](https://huggingface.co/Supertone/supertonic-3) (OpenRAIL).
- **Avoid** [coqui/XTTS-v2](https://huggingface.co/coqui/XTTS-v2): Coqui Public Model Licence, non-commercial. Also, voice-cloning the real mentors without their consent is an impersonation risk.

### 5.4 "Ask your mentors" (semantic search, optional LLM)

- Embed every lesson paragraph, glossary entry and transcript chunk **at build time** in Python, ship a small `Float32`/int8 vector file, and embed only the query in the browser with transformers.js.
- Choice of model:
  - [Xenova/multilingual-e5-small](https://huggingface.co/Xenova/multilingual-e5-small) (int8 118 MB): one index for English and Hindi/Urdu text.
  - [Xenova/bge-small-en-v1.5](https://huggingface.co/Xenova/bge-small-en-v1.5) (int8 34 MB): English-only content.
  - [onnx-community/embeddinggemma-300m-ONNX](https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX): stronger but 200-300 MB, under the Gemma licence.
- Generation: sub-1B browser LLMs ([onnx-community/Qwen3-0.6B-ONNX](https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX), [Qwen/Qwen3.5-0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B), [mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC](https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC)) need a 0.6-1 GB download and WebGPU, and they will occasionally invent rules and attribute them to a mentor. Ship **retrieval with verbatim quotes and links** first. Add an LLM only if test #13 passes.

### 5.5 Screenshots and chart reading

- OCR of MT5 / TradingView screenshots for journal import:
  - [microsoft/Florence-2-base-ft](https://huggingface.co/microsoft/Florence-2-base-ft) (MIT, 0.23B; browser port [onnx-community/Florence-2-base-ft](https://huggingface.co/onnx-community/Florence-2-base-ft)).
  - [ibm-granite/granite-docling-258M](https://huggingface.co/ibm-granite/granite-docling-258M) (Apache-2.0) for documents and PDFs.
- Chart understanding:
  - [google/deplot](https://huggingface.co/google/deplot) and [ahmed-masry/chartgemma](https://huggingface.co/ahmed-masry/chartgemma) were trained on bar, line and pie charts with labelled axes, not candlesticks. Expect poor results on candles.
  - [Qwen/Qwen3-VL-2B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct) (Apache-2.0, VPS) can describe a screenshot, but it must not grade trades. The trade grade should come from ZoneVision's own deterministic logic on the bar data, not from pixels.

---

## 6. Datasets

| Dataset | What | Licence | Quality notes |
|---|---|---|---|
| [Yllvar/fx-historical-data](https://huggingface.co/datasets/Yllvar/fx-historical-data) | Dukascopy-derived OHLCV, 28 FX + XAUUSD/XAGUSD, M1-D1, parquet | CC-BY-4.0 | UTC timestamps; tick volume; M1 covers only about 6 months; check weekend/rollover gaps |
| [qleap/dukascopy-ticks-ohlcv](https://huggingface.co/datasets/qleap/dukascopy-ticks-ohlcv) | 1-min bars from 2020, majors and crosses (380 MB) | MIT | Monthly parquet; good for a second-source replication |
| [bunqi/OANDA_EURUSD_EURUSD](https://huggingface.co/datasets/bunqi/OANDA_EURUSD_EURUSD), [bunqi/OANDA_XAUUSD_Gold](https://huggingface.co/datasets/bunqi/OANDA_XAUUSD_Gold) | OANDA candles from 2002 | none stated | Licence unclear; OANDA terms apply |
| [fokan/xauusd-2009-2026](https://huggingface.co/datasets/fokan/xauusd-2009-2026) | HistData-style XAUUSD M1 2009-2026 | none stated | HistData uses EST without DST; check before mixing with broker time |
| [paperswithbacktest/Forex-Daily-Price](https://huggingface.co/datasets/paperswithbacktest/Forex-Daily-Price) | Daily FX 1970-2026, 166 symbols | other (gated) | Daily only. Its card is a useful honesty check: across 260 replicated strategies, the median replicated Sharpe is +0.21 |
| [Ehsanrs2/Forex_Factory_Calendar](https://huggingface.co/datasets/Ehsanrs2/Forex_Factory_Calendar) | Economic calendar 2007 → 2025-04 | MIT | Normalise the timezone; a snapshot, not live |
| [ZipLime/us-economic-events](https://huggingface.co/datasets/ZipLime/us-economic-events), [ZipLime/fomc-events](https://huggingface.co/datasets/ZipLime/fomc-events) | US release calendar, point-in-time values; FOMC dates | Apache-2.0 | US only |
| [gtfintechlab/fomc_communication](https://huggingface.co/datasets/gtfintechlab/fomc_communication) | Labelled hawkish/dovish FOMC sentences | CC-BY-NC-4.0 | For test #15 only |
| [rohanjain2312/candlestick-pattern-recognition-system-data](https://huggingface.co/datasets/rohanjain2312/candlestick-pattern-recognition-system-data) | Labelled candlestick-pattern images | MIT | Classic patterns, not S/D zones; no use beyond quiz images |

No HF dataset has labelled supply/demand zones. **Our own research CSVs (about 60k zones with outcomes) are a more valuable dataset than anything on HF for this purpose.**

---

## 7. Bot and automation

- **MQL5 ONNX:** MT5 loads `.onnx` via `OnnxCreate` (file) or `OnnxCreateFromBuffer` (an embedded `#resource`, which forces a recompile whenever the model changes). Inference runs on CPU inside the terminal.
  - MQL5's own articles demonstrate LightGBM and CatBoost classifiers exported with `onnxmltools` / `skl2onnx` (`target_opset {"": 12, "ai.onnx.ml": 2}`), plus small Keras/PyTorch nets.
  - Input shapes must be fixed or set with `OnnxSetInputShape`.
  - Tokenized autoregressive models (Kronos) and in-context tabular models (TabPFN) do not fit. A TTM or Chronos-Bolt-tiny ONNX with a fixed context **may** fit; it has to be verified in MetaEditor with a dummy model first (Stage 2 task).
  - The official docs pages (mql5.com) could not be fetched from this container, so verify the operator set against the terminal build in use.
- **RL agents:** HF hosts FinRL / SB3 checkpoints ([Adilbai/stock-trading-rl-agent](https://huggingface.co/Adilbai/stock-trading-rl-agent), 187 likes, Dow-30 equities). The FinRL group's own paper (Gort et al., arXiv 2209.05559) states that DRL trading results *"may suffer from the false positive issue due to overfitting"* and proposes rejecting agents by probability of backtest overfitting (Bailey, Borwein, López de Prado & Zhu). An RL agent here would relearn "when to take a zone" with far more parameters than our 60k noisy outcomes can support. **Avoid.**
- **Execution quality:** nothing useful on HF. Use our own MT5 tick history: spread quantiles by hour, weekday and news window (rank #14).

---

## 8. Tried-and-false / hype to avoid

| Claim / item | Why to avoid it |
|---|---|
| "Our zone model has +0.38R in the top decile OOS" (our own LightGBM with `s1_*`) | **Look-ahead**: touch-candle-close features vs an intrabar limit fill. It collapses to −0.02R without them (§2.1) |
| Zero-shot price/return forecasts from Chronos, TimesFM, Moirai, Toto, Lag-Llama, Sundial | Independent studies: poor zero-shot results on returns ([2511.18578](https://huggingface.co/papers/2511.18578)); "small and sparse" gains vs random walk ([2606.27100](https://huggingface.co/papers/2606.27100)) |
| Kronos "+93% RankIC" | Authors' own benchmark; ensembling-protocol concern; independent volatility test 2.4-2.6× worse than HAR; pre-training probably overlaps our test years |
| `foduucom/stockmarket-pattern-detection-yolov8` and similar candlestick YOLO / BEiT classifiers | No licence, textbook patterns, no OOS trading evidence; ZoneVision's geometry is already exact |
| "ForexAI" / "XAUUSD-LLM" / "SMC-EURUSD" fine-tunes ([mjmanashti/gemma-2b-ForexAI](https://huggingface.co/mjmanashti/gemma-2b-ForexAI), [lvizcaya/forex-eurusd-direction](https://huggingface.co/lvizcaya/forex-eurusd-direction), many `xauusd-*` LSTM repos) | Single-author repos with no evaluation protocol; often direction classifiers tested on shuffled splits |
| RL trading agents (FinRL, SB3 checkpoints on HF) | Backtest overfitting is documented even by the FinRL authors; not enough independent decisions in our data |
| FinBERT-style sentiment as a trade signal | Tone ≠ reaction; NC licences; no free live feed; timing matters more than tone for wick stops |
| TimesFM 3.0, Moirai, TabPFN 2.5/3, XTTS-v2, NLLB/Seamless in anything sold or used "in production" | Non-commercial licences. Research use is fine; use the licence-clean alternatives listed above |
| Chart-QA models (DePlot, ChartGemma, MatCha) for reading candle charts | Trained on labelled business charts, not OHLC candles |

---

## 9. Staged roadmap (each stage gated by a test)

Rule for every stage: **pre-register** the feature set, the split and the pass criterion in this folder before running. Test IS → OOS **and** OOS → IS, and require ≥ 3 of 5 symbols. A failed gate is recorded as a result, not tuned away.

### Stage 0: measurement hygiene (no HF; 1-2 weeks)

1. **Fix the touch snapshot look-ahead:**
   - Add `s0_*` (computed on the close of the candle before the touch) or a touch-close entry model.
   - Extend M5's no-look-ahead test: truncate the history at touch − 1 and require identical `s0_` columns.
   - Re-run the IS/OOS reports and the calibration with `s0_`.
   - **Gate:** the analyzer's A+/consensus OOS tables recomputed on `s0_`. Whatever survives is the real baseline.
2. Finish re-measuring the close-beyond-distal stop (already in progress), including the touch-candle stop share (26.9% under the wick model).
3. **Leak-free LightGBM benchmark** (scripts exist in the scratchpad).
   - **Gate:** positive top-quintile E with CI_lo > 0 in both directions. If it fails, the Zone DNA as logged does not rank touches, and no HF model is likely to change that.
4. **Cheap features with no model:** the news-window join (FF calendar), an ATR-based "range needed for 3R" ratio, and spread at the touch.
   - **Gate:** each must show separated CIs in IS and replicate in OOS.

### Stage 1: offline research on the VPS (models, still no product change)

- Trading side:
  - TTM-r2/r3 and Chronos-Bolt-tiny range forecasts vs HAR/EWMA.
  - Kronos-mini as a long shot.
  - TabPFN-v2 / Mitra / TabICL vs LightGBM on the Stage 0 feature set.
  - **Gate:** the pre-registered criteria in table rows #1, #2, #11, #12. Also, the incremental lift over the Stage 0 cheap features must be > 0 with CI_lo > 0.
- Learning side, which can run in parallel with no trading risk:
  - The ASR bake-off (#6), the translation rating (#7), the Kokoro A/B (#5) and embeddings retrieval (#4).
  - **Gates** as in the table.

### Stage 2: shadow mode (display and log only; at least 3 months forward)

- ZoneVision shows the new feature (expected range, news flag, calibrated p(3R)) in the click box and logs it with `RFXV2_` objects, without changing the v1 drawing (invariant I1). ZoneBot logs "would skip / would take" but trades as before, or trades only on demo.
- Verify the MQL5 ONNX path with a dummy model of the exact shape before relying on it. Prefer a lookup table (like `RFX_Calib.csv`) when it performs within the CI of the model.
- In the app: ship semantic search (#4) and the pre-rendered narration (#5) behind a toggle and collect the user's feedback.
- **Gate:** forward E/trade of "would take" minus "would skip" > 0, and live calibration within ±5 pp per decile on ≥ 100 forward trades. Live slippage and spread must be within the backtest assumptions.

### Stage 3: production (small and reversible)

- ZoneBot v2 gate uses the feature at reduced risk (e.g. 0.25% per trade) for another 100 trades, then normal risk.
- Kill-switch: disable automatically if the rolling 50-trade E falls below the Stage 2 lower CI bound, or calibration drifts by more than 7 pp.
- Re-calibrate quarterly with walk-forward only. Never re-tune on the period being reported.
- App: make narration and search the default; add the LLM answer layer only if test #13 passed.

---

## Sources

Papers (abstracts via the HF papers API; arXiv itself was not reachable from this container):

- Brini et al., *Forecasting Realized Volatility with Time Series Foundation Models: A Comparison with Econometric Benchmarks*, [hf.co/papers/2607.05291](https://huggingface.co/papers/2607.05291), code [github.com/Alessiobrini/tsfm-rv](https://github.com/Alessiobrini/tsfm-rv)
- *Pretrained Time-Series Foundation Models for Financial Return Forecasting*, [hf.co/papers/2606.27100](https://huggingface.co/papers/2606.27100)
- Rahimikia et al., *Re(Visiting) Time Series Foundation Models in Finance*, [hf.co/papers/2511.18578](https://huggingface.co/papers/2511.18578)
- Shi et al., *Kronos: A Foundation Model for the Language of Financial Markets* (AAAI-26), [hf.co/papers/2508.02739](https://huggingface.co/papers/2508.02739); user test [Kronos issue #319](https://github.com/shiyu-coder/Kronos/issues/319); informal review [pith.science/paper/2508.02739](https://pith.science/paper/2508.02739)
- *Foundation models do not beat simple volatility benchmarks: Evidence from 5000 Chinese stocks*, Finance Research Letters 2026, [sciencedirect.com/science/article/abs/pii/S1544612326011347](https://www.sciencedirect.com/science/article/abs/pii/S1544612326011347)
- Ansari et al., *Chronos-2*, [hf.co/papers/2510.15821](https://huggingface.co/papers/2510.15821)
- Andersen, Bollerslev, Diebold & Vega, *Micro Effects of Macro Announcements: Real-Time Price Discovery in Foreign Exchange*, AER 2003, [nber.org/papers/w8959](https://www.nber.org/system/files/working_papers/w8959/w8959.pdf)
- Jiang, Kelly & Xiu, *(Re-)Imag(in)ing Price Trends*, J. Finance 2023, [SSRN 3756587](https://papers.ssrn.com/abstract=3756587)
- Gort et al., *Deep Reinforcement Learning for Cryptocurrency Trading: Practical Approach to Address Backtest Overfitting*, [hf.co/papers/2209.05559](https://huggingface.co/papers/2209.05559); Bailey et al. PBO demo [datagrid.lbl.gov/backtest](https://datagrid.lbl.gov/backtest/)
- Bhogale et al., *Vistaar: Diverse Benchmarks and Training Sets for Indian Language ASR*, [github.com/AI4Bharat/vistaar](https://github.com/AI4Bharat/vistaar); *WER We Stand: Benchmarking Urdu ASR Models*, arXiv 2409.11252
- TabPFN robustness (ICML 2025), [icml.cc/virtual/2025/47490](https://icml.cc/virtual/2025/47490); TabPFN-2.5 report, arXiv 2511.08667
- Conformal time-series reviews: arXiv 2511.13608, 2601.18509
- MQL5 ONNX: [mql5.com/en/docs/onnx](https://www.mql5.com/en/docs/onnx), articles [12373](https://www.mql5.com/en/articles/12373), [15013](https://www.mql5.com/en/articles/15013) (LightGBM via onnxmltools), [16017](https://www.mql5.com/en/articles/16017) (CatBoost)
- transformers.js releases: [github.com/huggingface/transformers.js/releases](https://github.com/huggingface/transformers.js/releases); kokoro-js: [npm kokoro-js](https://cdn.jsdelivr.net/npm/kokoro-js@1.2.0/README.md)
