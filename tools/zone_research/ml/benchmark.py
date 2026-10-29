#!/usr/bin/env python3
"""Leak-free zone ML benchmark (Stage 1 of docs/research/HuggingFace_Opportunities.md).

Usage (CSVs are data; run with python -I, the script adds its own folder to sys.path):
    python -I tools/zone_research/ml/benchmark.py --is IS_DIR --oos OOS_DIR --out OUT_DIR
        [--models lgbm,lr,tabpfn,tabicl,lgbm_s1,lgbm_s1nd,lgbm_age,lgbm_y2,lgbm_y5] [--splits F,Fplus,R]
        [--hf-dir DIR_WITH_CKPTS] [--cap 6000] [--cap-tabpfn 3000] [--tabpfn-feats 40] [--boot 2000]
    lightgbm runs single-threaded (OpenMP threads were 30x slower on a shared 4-core box).

Writes OUT_DIR/results.json, OUT_DIR/tables.md and OUT_DIR/shap_*.csv. Seeds are fixed (SEED = 7).
Pre-registered protocol and pass criteria: docs/research/Zone_ML_Benchmark.md section 0.
"""
import argparse
import json
import os
import sys
import time
import warnings

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

import zml_common as Z  # noqa: E402

warnings.filterwarnings("ignore")
SEED = Z.SEED

LGB_GRID = [
    dict(num_leaves=7, min_child_samples=400, learning_rate=0.03, colsample_bytree=0.6, reg_lambda=10.0),
    dict(num_leaves=15, min_child_samples=200, learning_rate=0.03, colsample_bytree=0.7, reg_lambda=10.0),
    dict(num_leaves=31, min_child_samples=100, learning_rate=0.03, colsample_bytree=0.8, reg_lambda=5.0),
]
LR_GRID = [0.003, 0.03, 0.3]


# ----------------------------------------------------------------------------- splits
def T(s):
    return pd.Timestamp(s)


def purge(df, cut):
    """Keep training trades whose touch-1 trade ended before `cut` (its label was known by then)."""
    end = df["t1_end_dt"]
    return df[(~df["traded"]) | (end.notna() & (end < cut))]


def make_splits(IS, OOS):
    S = {}
    tr = purge(IS[IS.created_dt < T("2025-01-01")], T("2025-01-01"))
    cal = purge(IS[IS.created_dt >= T("2025-01-01")], T("2026-01-01"))
    S["F"] = dict(train=tr, cal=cal, test=OOS, folds=[(T("2023-07-01"), T("2024-01-01")), (T("2024-01-01"), T("2024-07-01")),
                                                      (T("2024-07-01"), T("2025-01-01"))], strat="year")
    S["Fplus"] = dict(train=purge(IS, T("2026-01-01")), cal=None, test=OOS, folds=None, strat="year")
    tr = purge(OOS[OOS.created_dt < T("2026-07-01")], T("2026-07-01"))
    cal = OOS[OOS.created_dt >= T("2026-07-01")]
    S["R"] = dict(train=tr, cal=cal, test=IS, folds=[(T("2026-03-01"), T("2026-05-01")), (T("2026-05-01"), T("2026-07-01"))],
                  strat="month")
    return S


def cv_folds(train, folds):
    out = []
    for a, b in folds:
        f_tr = purge(train[train.created_dt < a], a)
        f_va = train[(train.created_dt >= a) & (train.created_dt < b)]
        out.append((f_tr[f_tr.traded], f_va[f_va.traded]))
    return out


# ----------------------------------------------------------------------------- feature matrices
class Frame(object):
    def __init__(self, num, cat, all_df):
        self.num, self.cat = num, cat
        self.cats = {c: sorted(all_df[c].unique()) for c in cat}

    def lgb(self, d):
        X = d[self.num].copy()
        for c in self.cat:
            X[c] = pd.Categorical(d[c], categories=self.cats[c])
        return X

    def dense(self, d):
        """numeric matrix for TabPFN / TabICL: categories as integer codes, NaN kept."""
        X = d[self.num].to_numpy(float)
        C = np.column_stack([pd.Categorical(d[c], categories=self.cats[c]).codes for c in self.cat]).astype(float) \
            if self.cat else np.zeros((len(d), 0))
        return np.hstack([X, C])


def drop_constant(num, train):
    return [c for c in num if train[c].nunique(dropna=True) > 1]


# ----------------------------------------------------------------------------- models
def lgb_model(params, n_est, mono_feats):
    import lightgbm as lgb
    mono = [Z.MONOTONE.get(c, 0) for c in mono_feats]
    return lgb.LGBMClassifier(objective="binary", n_estimators=n_est, subsample=0.8, subsample_freq=1,
                              max_bin=63, min_split_gain=0.0, random_state=SEED, deterministic=True,
                              force_col_wise=True, n_jobs=1, verbose=-1, monotone_constraints=mono,
                              monotone_constraints_method="advanced", **params)


def tune_lgb(F, folds, ycol):
    import lightgbm as lgb
    cols = F.num + F.cat
    best = None
    log = []
    for gi, p in enumerate(LGB_GRID):
        losses, iters = [], []
        for ftr, fva in folds:
            m = lgb_model(p, 2000, cols)
            m.fit(F.lgb(ftr), ftr[ycol], eval_set=[(F.lgb(fva), fva[ycol])], eval_metric="binary_logloss",
                  callbacks=[lgb.early_stopping(100, verbose=False)])
            losses.append(m.best_score_["valid_0"]["binary_logloss"])
            iters.append(m.best_iteration_ or 2000)
        r = (float(np.mean(losses)), gi, int(max(30, np.median(iters))))
        log.append(dict(config=gi, logloss=r[0], n_est=r[2], fold_iters=iters))
        if best is None or r[0] < best[0]:
            best = r
    return LGB_GRID[best[1]], best[2], log


def lr_pipe(F, C):
    from sklearn.compose import ColumnTransformer
    from sklearn.impute import SimpleImputer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder, QuantileTransformer
    num = Pipeline([("imp", SimpleImputer(strategy="median", add_indicator=True)),
                    ("q", QuantileTransformer(n_quantiles=200, output_distribution="normal", random_state=SEED))])
    ct = ColumnTransformer([("n", num, F.num), ("c", OneHotEncoder(handle_unknown="ignore", min_frequency=50), F.cat)])
    return Pipeline([("ct", ct), ("lr", LogisticRegression(C=C, max_iter=3000))])


def tune_lr(F, folds, ycol):
    from sklearn.metrics import log_loss
    best, log = None, []
    for C in LR_GRID:
        ls = []
        for ftr, fva in folds:
            m = lr_pipe(F, C).fit(ftr[F.num + F.cat], ftr[ycol])
            ls.append(log_loss(fva[ycol], m.predict_proba(fva[F.num + F.cat])[:, 1]))
        log.append(dict(C=C, logloss=float(np.mean(ls))))
        if best is None or np.mean(ls) < best[0]:
            best = (np.mean(ls), C)
    return best[1], log


def cap_sample(d, cap, strat, ycol):
    """Stratified (period x label) subsample for the in-context models."""
    if len(d) <= cap:
        return d
    key = (d.created_dt.dt.year if strat == "year" else d.created_dt.dt.to_period("M")).astype(str) + "_" + d[ycol].astype(str)
    frac = cap / len(d)
    parts = [g.sample(n=max(1, int(round(len(g) * frac))), random_state=SEED) for _, g in d.groupby(key)]
    return pd.concat(parts).sort_values("created_dt")


HF_EST = {"tabpfn": 2, "tabicl": 2}   # ensemble members (CPU time and memory on a shared 4-core / 16 GB box)


def fit_tabpfn(Xtr, ytr, hf_dir):
    """TabPFN v2 (Prior-Labs/TabPFN-v2-clf, Prior Labs License 1.1 = Apache-2.0 + attribution), CPU."""
    import torch
    from tabpfn import TabPFNClassifier
    torch.set_num_threads(4)
    path = os.path.join(hf_dir, "tabpfn-v2-classifier.ckpt")
    m = TabPFNClassifier(model_path=path, device="cpu", n_estimators=HF_EST["tabpfn"], random_state=SEED,
                         ignore_pretraining_limits=True, fit_mode="fit_with_cache")
    m.fit(Xtr, ytr)
    return m


def fit_tabicl(Xtr, ytr, hf_dir):
    """TabICL v2 (jingang/TabICL, BSD-3-Clause), CPU, train context cached."""
    import torch
    from tabicl import TabICLClassifier
    torch.set_num_threads(4)
    ck = "tabicl-classifier-v2-20260212.ckpt"
    m = TabICLClassifier(model_path=os.path.join(hf_dir, ck), allow_auto_download=False, checkpoint_version=ck,
                         device="cpu", n_estimators=HF_EST["tabicl"], random_state=SEED, kv_cache=True)
    m.fit(Xtr, ytr)
    return m


def predict_batched(m, X, bs=4000):
    out = []
    for i in range(0, len(X), bs):
        out.append(m.predict_proba(X[i:i + bs])[:, 1])
    return np.concatenate(out) if out else np.zeros(0)


# ----------------------------------------------------------------------------- evaluation
def calibrate(p_cal, y_cal, p):
    from sklearn.isotonic import IsotonicRegression
    iso = IsotonicRegression(out_of_bounds="clip", y_min=0.0, y_max=1.0).fit(p_cal, y_cal)
    return iso.predict(p)


def evaluate(test, s_all, p_cal_test, thr, B, rcol="R3", ycol="y3", base_cal=None):
    """test: all test zones; s_all: raw score for every test zone; p_cal_test: calibrated p for every zone."""
    tr = test.traded.to_numpy()
    tt = test[tr]
    s = s_all[tr]
    y = tt[ycol].to_numpy()
    R = tt[rcol].to_numpy()
    days = tt["day"].to_numpy()
    res = dict(n_trades=int(len(tt)), base_rate=float(y.mean()), E_all=Z.day_boot(R, days, B))
    res["auc"] = Z.auc(y, s)
    if p_cal_test is not None:
        p = p_cal_test[tr]
        b = Z.brier(y, p)
        b0 = Z.brier(y, np.full(len(y), y.mean()))
        res["brier"] = b
        res["brier_base_test"] = b0
        res["bss_test"] = 1 - b / b0
        if base_cal is not None:
            b1 = Z.brier(y, np.full(len(y), base_cal))
            res["bss_calrate"] = 1 - b / b1
        res["mean_p"] = float(p.mean())
    res["E2_all"] = float(tt["R2"].mean())
    res["E5_all"] = float(tt["R5"].mean())
    for name, q in (("top10", thr[0]), ("top20", thr[1])):
        sel = s >= q
        d = dict(share=float(sel.mean()), n=int(sel.sum()))
        d["E3"] = Z.day_boot(R[sel], days[sel], B)
        d["lift"] = Z.day_boot(R[sel], days[sel], B, values2=R, days2=days)
        d["E2"] = float(tt["R2"].to_numpy()[sel].mean()) if sel.any() else float("nan")
        d["E5"] = float(tt["R5"].to_numpy()[sel].mean()) if sel.any() else float("nan")
        d["P3"] = float(y[sel].mean()) if sel.any() else float("nan")
        # per zone (untouched = 0): all test zones whose score clears the threshold
        zsel = s_all >= q
        d["E3_zone"] = Z.day_boot(test[rcol].to_numpy()[zsel], test["day"].to_numpy()[zsel], B)
        d["E3_zone_all"] = float(test[rcol].mean())
        if name == "top20":
            for grp in ("symbol", "tf", "detector"):
                g = {}
                for k in sorted(tt[grp].unique()):
                    m = (tt[grp].to_numpy() == k)
                    g[k] = dict(E3=Z.day_boot(R[m & sel], days[m & sel], B), E_all=float(R[m].mean()),
                                auc=Z.auc(y[m], s[m]), n=int((m & sel).sum()), share=float(sel[m].mean()))
                d["by_" + grp] = g
        res[name] = d
    # secondary: quintile by rank inside the test set
    q20 = np.quantile(s, 0.8)
    sel = s >= q20
    res["top20_testrank"] = dict(E3=Z.day_boot(R[sel], days[sel], B), n=int(sel.sum()))
    q10 = np.quantile(s, 0.9)
    sel = s >= q10
    res["top10_testrank"] = dict(E3=Z.day_boot(R[sel], days[sel], B), n=int(sel.sum()))
    return res


def criteria(res, split):
    t = res["top20"]
    need = 3 if split == "F" else 2
    sym_ok = [k for k, v in t["by_symbol"].items() if v["E3"][3] > 0 and v["E3"][1] > 0 and v["E3"][0] > 0]
    c1 = len(sym_ok) >= need
    c2 = res.get("bss_test", float("-inf")) >= 0.005
    c3 = t["lift"][1] > 0
    return dict(C1=c1, C1_symbols=sym_ok, C1_need=need, C2=c2, C3=c3)


# ----------------------------------------------------------------------------- main
def run(args):
    t0 = time.time()
    IS = Z.load([args.is_dir])
    OOS = Z.load([args.oos_dir])
    Z.check_allow_list(IS.columns)
    s1 = Z.s1_features(IS.columns)
    for d in (IS, OOS):
        for c in s1:
            d[c] = pd.to_numeric(d[c], errors="coerce").astype(float)
        d["t1_bars_f"] = pd.to_numeric(d["t1_bars"], errors="coerce").astype(float)
    ALL = pd.concat([IS, OOS], ignore_index=True)
    splits = make_splits(IS, OOS)
    models = args.models.split(",")
    out = dict(meta=dict(seed=SEED, boot=args.boot, cap=args.cap, n_is=len(IS), n_oos=len(OOS), allow=Z.ALLOW,
                         monotone=Z.MONOTONE), results={}, tuning={}, shap={})
    os.makedirs(args.out, exist_ok=True)
    rng = np.random.default_rng(SEED)
    for sp in args.splits.split(","):
        S = splits[sp]
        train, cal, test = S["train"], S["cal"], S["test"]
        trT = train[train.traded]
        calT = cal[cal.traded] if cal is not None else None
        print("[%s] train trades %d, cal trades %s, test zones %d (%.0fs)" %
              (sp, len(trT), len(calT) if calT is not None else "-", len(test), time.time() - t0), flush=True)
        num = drop_constant(Z.NUM_FEATURES, trT)
        base_F = Frame(num, Z.CAT_FEATURES, ALL)
        # references
        # non-ML references: random, the indicator's consensus score, and the cheapest feature (low spread per R)
        refs = {"random": rng.random(len(test)), "cons": test["cons"].fillna(-1).to_numpy(),
                "lowspread": -test["spread_R"].to_numpy()}
        refs_cal = {"random": rng.random(len(cal)) if cal is not None else None,
                    "cons": cal["cons"].fillna(-1).to_numpy() if cal is not None else None,
                    "lowspread": -cal["spread_R"].to_numpy() if cal is not None else None}
        for name in models + ["cons", "lowspread", "random"]:
            ycol, rcol = "y3", "R3"
            if name == "lgbm_y2":
                ycol, rcol = "y2", "R2"
            if name == "lgbm_y5":
                ycol, rcol = "y5", "R5"
            if name in ("lgbm_s1", "lgbm_s1nd") and sp != "Fplus":
                continue
            if name in ("lgbm_y2", "lgbm_y5") and sp == "R":
                continue
            if name == "lgbm_s1":
                F = Frame(num + drop_constant(s1, trT), Z.CAT_FEATURES, ALL)
            elif name == "lgbm_s1nd":       # s1_ set without s1_touch_depth (the touch candle's own depth)
                F = Frame(num + drop_constant([c for c in s1 if c != "s1_touch_depth"], trT), Z.CAT_FEATURES, ALL)
            elif name == "lgbm_age":
                F = Frame(num + ["t1_bars_f"], Z.CAT_FEATURES, ALL)
            else:
                F = base_F
            tt = time.time()
            p_cal_raw = None
            if name in ("cons", "lowspread", "random"):
                s_test = refs[name]
                p_cal_raw = refs_cal[name]
            elif name.startswith("lgbm"):
                base = "lgbm" if name in ("lgbm_s1", "lgbm_s1nd") else name
                if sp == "Fplus":       # same hyper-parameters as F (pre-registered)
                    prm, nest = out["tuning"][base + "_F"]["params"], out["tuning"][base + "_F"]["n_est"]
                else:
                    prm, nest, log = tune_lgb(F, cv_folds(train, S["folds"]), ycol)
                    out["tuning"][name + "_" + sp] = dict(params=prm, n_est=nest, log=log)
                m = lgb_model(prm, nest, F.num + F.cat).fit(F.lgb(trT), trT[ycol])
                s_test = m.predict_proba(F.lgb(test))[:, 1]
                if cal is not None:
                    p_cal_raw = m.predict_proba(F.lgb(cal))[:, 1]
                if name in ("lgbm", "lgbm_s1", "lgbm_s1nd", "lgbm_age"):
                    tst = test[test.traded]
                    contrib = m.booster_.predict(F.lgb(tst), pred_contrib=True)[:, :-1]
                    imp = pd.Series(np.abs(contrib).mean(0), index=F.num + F.cat).sort_values(ascending=False)
                    imp.to_csv(os.path.join(args.out, "shap_%s_%s.csv" % (name, sp)), header=["mean_abs_shap"])
                    out["shap"]["%s_%s" % (name, sp)] = imp.head(25).round(5).to_dict()
            elif name == "lr":
                key = "lr_" + sp
                if sp == "Fplus":
                    C = out["tuning"]["lr_F"]["C"]
                else:
                    C, log = tune_lr(F, cv_folds(train, S["folds"]), ycol)
                    out["tuning"][key] = dict(C=C, log=log)
                m = lr_pipe(F, C).fit(trT[F.num + F.cat], trT[ycol])
                s_test = m.predict_proba(test[F.num + F.cat])[:, 1]
                if cal is not None:
                    p_cal_raw = m.predict_proba(cal[F.num + F.cat])[:, 1]
            elif name in ("tabpfn", "tabicl"):
                cap = args.cap if name == "tabicl" else args.cap_tabpfn
                sub = cap_sample(trT, cap, S["strat"], ycol)
                if name == "tabpfn":
                    # CPU cost grows with rows x features: keep the top-k features by LightGBM gain on THIS split's
                    # training trades (no test information), the rest of the allow-list is dropped
                    k2 = "lgbm_F" if sp == "Fplus" else "lgbm_" + sp
                    g = lgb_model(out["tuning"][k2]["params"], out["tuning"][k2]["n_est"], base_F.num + base_F.cat)
                    g.fit(base_F.lgb(trT), trT[ycol])
                    gain = pd.Series(g.booster_.feature_importance("gain"), index=base_F.num + base_F.cat)
                    keep = list(gain.sort_values(ascending=False).index[:args.tabpfn_feats])
                    F = Frame([c for c in keep if c in base_F.num], [c for c in keep if c in base_F.cat], ALL)
                    out["tuning"]["tabpfn_features_" + sp] = keep
                fit = fit_tabpfn if name == "tabpfn" else fit_tabicl
                m = fit(F.dense(sub), sub[ycol].to_numpy(), args.hf_dir)
                bs = 1000
                s_test = predict_batched(m, F.dense(test), bs)
                if cal is not None:
                    p_cal_raw = predict_batched(m, F.dense(cal), bs)
                out["tuning"]["%s_%s" % (name, sp)] = dict(train_rows=int(len(sub)))
            else:
                raise SystemExit("unknown model " + name)
            # thresholds and calibration (pre-registered: from the calibration period)
            if cal is not None:
                ctr = cal.traded.to_numpy()
                thr = (np.quantile(p_cal_raw[ctr], 0.9), np.quantile(p_cal_raw[ctr], 0.8))
                p_test = calibrate(p_cal_raw[ctr], cal[ycol].to_numpy()[ctr], s_test) if name not in ("random",) else None
                base_cal = float(cal[ycol].to_numpy()[ctr].mean())
            else:
                tr_ = test.traded.to_numpy()
                thr = (np.quantile(s_test[tr_], 0.9), np.quantile(s_test[tr_], 0.8))
                p_test = s_test if name not in ("cons", "lowspread", "random") else None
                base_cal = None
            res = evaluate(test, s_test, p_test, thr, args.boot, rcol=rcol, ycol=ycol, base_cal=base_cal)
            res["criteria"] = criteria(res, sp)
            res["seconds"] = round(time.time() - tt, 1)
            out["results"]["%s|%s" % (name, sp)] = res
            print("  %-9s %-6s AUC %.3f  BSS %s  top20 E3 %s  top10 E3 %s  (%.0fs)" % (
                name, sp, res["auc"], ("%+.4f" % res["bss_test"]) if "bss_test" in res else "  n/a  ",
                Z.fmt_ci(res["top20"]["E3"]), Z.fmt_ci(res["top10"]["E3"]), res["seconds"]), flush=True)
            with open(os.path.join(args.out, "results.json"), "w") as fh:
                json.dump(out, fh, indent=1, default=float)
    print("done in %.0fs" % (time.time() - t0))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--is", dest="is_dir", required=True)
    ap.add_argument("--oos", dest="oos_dir", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--models", default="lgbm,lr")
    ap.add_argument("--splits", default="F,Fplus,R")
    ap.add_argument("--hf-dir", default=None)
    ap.add_argument("--cap", type=int, default=6000, help="TabICL training rows")
    ap.add_argument("--cap-tabpfn", type=int, default=3000, help="TabPFN training rows (CPU)")
    ap.add_argument("--tabpfn-feats", type=int, default=40, help="TabPFN: top-k features by LightGBM gain")
    ap.add_argument("--boot", type=int, default=2000)
    run(ap.parse_args())


if __name__ == "__main__":
    main()
