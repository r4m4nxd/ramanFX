"""Shared code for the leak-free zone ML benchmark (docs/research/Zone_ML_Benchmark.md).

Loading, the creation-time feature allow-list, targets (mirroring analyze.py outcome_r, wick stop),
the split helpers and the metrics (AUC, Brier, top-bucket E with day-clustered bootstrap CIs).
Research only: nothing here is used by the indicator or the bot.
"""
import glob
import os

import numpy as np
import pandas as pd

SEED = 7

# ----------------------------------------------------------------------------- feature allow-list
# Every column below is written at zone CREATION (docs/Zone_Research_HowTo.md 4 "Create columns" and 5.1).
# Grouped as in the report, section 2. Nothing from s1_*, t1_/t2_/t3_*, t1c_/t1f_/t1m_/t1d_, broken*,
# status, resolved, age_bars, never_touched, runout_h (post-creation run-out), touches.
NUM_FEATURES = [
    # geometry, scale-free (heights in ATR / zone heights / ratios)
    "height_atr", "base_n", "legin_atr", "legout_atr", "leg_ratio", "moveaway_h_create", "gap", "emotional",
    "tested_at_create", "would_draw",
    # ZoneNotes (v1 judgement at creation)
    "score", "n_plus", "n_minus", "n_crit",
    # chain / context flags from Qualify at creation
    "arrival", "chain", "rm_opp_zone", "rm_trendline", "new_high_low", "rm_prev_high_low", "leg2", "too_small", "trap",
    "crowded", "htf_trend", "tl_bias", "bias", "align", "bigger_trend", "bigger_align", "nested", "in_opp_htf", "curve",
    "opp_R", "plan_rr",
    # time of creation (server clock, one broker for all files)
    "hour", "min_from_open",
    # v2 DNA at creation (5.1)
    "base_rel", "base_min", "legin_n", "legin_spd", "legout_body", "legout_n", "legout_spd", "legout_rel", "gap_open",
    "gap_away", "departure", "c_runout_h", "runout_atr", "runout_bars", "rm_opp_n", "rm_opp_move", "ath", "arrival_raja",
    "raja_strong", "n_tests", "depth_max", "depth_1", "emo_depth", "ret_next", "c_nested", "nest_pos", "curve_zone",
    "curve_raja", "opp_htf_R", "room_R", "origin_ok", "left_opp_R", "novice_n", "height_vs_med", "cross_needed",
    "near_tl", "overext", "cp_run", "impulse", "stacked", "inherit", "overlap", "flip", "out_tl", "raja_live",
    "appr_bars", "appr_spd", "new_opp_way", "stair", "appr_prov",
    # Direction engine at creation
    "dir", "dirq", "st_etf", "st_itf", "st_htf", "st_p1", "align_dir",
    # plan / lenses at creation
    "stop_atr", "kv", "kg", "sK", "sS", "sR", "sB", "pass_k", "pass_s", "pass_r", "pass_b", "n_pass", "cons",
    # engineered from creation columns (scale-free versions of price-unit columns)
    "spread_R", "wow_h", "is_demand", "tf_rank", "weekday_n",
    # ordinal encodings of creation-time categories
    "verdict_o", "grade_o", "zgrade_o", "depth_grade_o", "curve_bucket_o", "nest_tf_o", "v2verdict_o",
]
CAT_FEATURES = ["detector", "pattern", "raja_type", "alt_strength"]
ALLOW = NUM_FEATURES + CAT_FEATURES

# monotone priors for LightGBM (+1 better, -1 worse): costlier stop per R is worse; more room to the target is better
MONOTONE = {"spread_R": -1, "room_R": 1}

ORD = {
    "verdict": {"WEAK": 0, "OK": 1, "STRONG": 2},
    "grade": {"C": 0, "B": 1, "A": 2},
    "zgrade": {"C": 0, "B": 1, "A": 2},
    "depth_grade": {"F": 0, "S": 1, "M": 2, "D": 3, "V": 4},
    "curve_bucket": {"L": 0, "LM": 1, "HM": 2, "H": 3},
    "nest_tf": {"M15": 0, "H1": 1, "H4": 2, "D1": 3, "W1": 4, "MN": 5},
    "v2verdict": {"X": 0, "C": 1, "B": 2, "A": 3, "A+": 4},
}
TF_RANK = {"M15": 0, "H1": 1, "H4": 2, "D1": 3}
WEEKDAY = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}

# columns that are measured after creation or describe the outcome (never features). Used by the audit to
# prove that the allow-list does not intersect them.
POST_PREFIXES = ("s1_", "t1_", "t2_", "t3_", "t1c_", "t1f_", "t1m_", "t1d_", "broken")
POST_COLS = {"status", "resolved", "age_bars", "never_touched", "runout_h", "touches"}


def expand(paths):
    out = []
    for p in paths:
        if os.path.isdir(p):
            out += sorted(glob.glob(os.path.join(p, "*.csv")))
        else:
            out += sorted(glob.glob(p))
    return out


def load(paths):
    """Load research CSVs (treated as data), de-duplicate like analyze.py load_rows, add derived columns."""
    frames = []
    for f in expand(paths):
        d = pd.read_csv(f, encoding="latin-1", low_memory=False, dtype={"tags": str})
        d = d[d["detector"].notna() & (d["detector"] != "")]
        frames.append(d)
    df = pd.concat(frames, ignore_index=True)
    df = df.drop_duplicates(["detector", "symbol", "tf", "id"], keep="first").reset_index(drop=True)
    return derive(df)


def _dt(s):
    return pd.to_datetime(s, format="%Y.%m.%d %H:%M", errors="coerce")


def derive(df):
    df = df.copy()
    df["created_dt"] = _dt(df["created"])
    df["t1_end_dt"] = _dt(df["t1_end_time"])
    df["day"] = df["created_dt"].dt.floor("D")
    df["year"] = df["created_dt"].dt.year
    # --- targets (analyze.py outcome_r, stop_mode = wick: stopR = -1)
    df["traded"] = df["t1_time"].notna() & (df["t1_time"].astype(str) != "")
    mfe = pd.to_numeric(df["t1_mfe"], errors="coerce").fillna(0.0)
    stop = df["t1_result"].astype(str) == "stop"
    for k in (1, 2, 3, 5):
        r = np.where(mfe >= k, float(k), np.where(stop, -1.0, 0.0))
        df["R%d" % k] = np.where(df["traded"], r, 0.0)
        df["y%d" % k] = ((mfe >= k) & df["traded"]).astype(int)
    # --- engineered creation features
    h = pd.to_numeric(df["height"], errors="coerce")
    sp = pd.to_numeric(df["spread"], errors="coerce")
    df["spread_R"] = sp / (h + sp)
    hp = pd.to_numeric(df["height_pips"], errors="coerce")
    df["wow_h"] = np.where(hp > 0, pd.to_numeric(df["wow_pips"], errors="coerce") / hp, np.nan)
    df["is_demand"] = (df["type"] == "demand").astype(int)
    df["tf_rank"] = df["tf"].map(TF_RANK)
    df["weekday_n"] = df["weekday"].map(WEEKDAY)
    for c, m in ORD.items():
        df[c + "_o"] = df[c].map(m)
    for c in NUM_FEATURES:
        df[c] = pd.to_numeric(df[c], errors="coerce").astype(float)
    for c in CAT_FEATURES:
        df[c] = df[c].fillna("NA").astype(str)
    return df


def check_allow_list(columns):
    bad = [c for c in ALLOW if c.startswith(POST_PREFIXES) or c in POST_COLS]
    assert not bad, "post-creation column in the allow-list: %s" % bad
    raw = [c for c in ALLOW if c not in columns and c not in
           ("spread_R", "wow_h", "is_demand", "tf_rank", "weekday_n") and not c.endswith("_o")]
    assert not raw, "allow-list column missing from the CSV: %s" % raw


def s1_features(columns):
    """The look-ahead set used ONLY to reproduce the earlier result: numeric s1_ columns."""
    skip = {"s1_time", "s1_ok", "s1_lag", "s1_found"}
    return [c for c in columns if c.startswith("s1_") and c not in skip]


# ----------------------------------------------------------------------------- metrics
def auc(y, s):
    from sklearn.metrics import roc_auc_score
    y = np.asarray(y)
    if len(np.unique(y)) < 2:
        return float("nan")
    return float(roc_auc_score(y, s))


def brier(y, p):
    y = np.asarray(y, float)
    p = np.asarray(p, float)
    return float(np.mean((p - y) ** 2))


def day_boot(values, days, B=2000, seed=SEED, values2=None, days2=None):
    """Mean of `values` with a 95% CI from a bootstrap that resamples whole creation days.

    With values2/days2 it returns the paired difference mean(values) - mean(values2) where both are
    computed on the SAME resampled days (values must be a subset of values2's trades for a lift)."""
    v = np.asarray(values, float)
    if len(v) == 0:
        return (float("nan"), float("nan"), float("nan"), 0)
    d = pd.Index(days)
    if values2 is None:
        allday = pd.Index(sorted(set(d)))
    else:
        allday = pd.Index(sorted(set(d) | set(pd.Index(days2))))
    di = allday.get_indexer(d)
    D = len(allday)
    s1 = np.bincount(di, weights=v, minlength=D)
    c1 = np.bincount(di, minlength=D).astype(float)
    rng = np.random.default_rng(seed)
    idx = rng.integers(0, D, size=(B, D))
    m1 = s1[idx].sum(1) / np.maximum(c1[idx].sum(1), 1)
    point = v.mean()
    if values2 is None:
        lo, hi = np.percentile(m1, [2.5, 97.5])
        return (float(point), float(lo), float(hi), len(v))
    v2 = np.asarray(values2, float)
    di2 = allday.get_indexer(pd.Index(days2))
    s2 = np.bincount(di2, weights=v2, minlength=D)
    c2 = np.bincount(di2, minlength=D).astype(float)
    m2 = s2[idx].sum(1) / np.maximum(c2[idx].sum(1), 1)
    diff = m1 - m2
    lo, hi = np.percentile(diff, [2.5, 97.5])
    return (float(point - v2.mean()), float(lo), float(hi), len(v))


def fmt_ci(t, d=3):
    m, lo, hi, n = t
    if n == 0 or np.isnan(m):
        return "n/a"
    return ("%+." + str(d) + "f [%+." + str(d) + "f, %+." + str(d) + "f]") % (m, lo, hi)
