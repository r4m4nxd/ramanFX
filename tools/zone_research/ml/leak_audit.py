#!/usr/bin/env python3
"""Leak audit for the zone ML benchmark.

For every allow-listed creation feature, and for every numeric s1_ column, the univariate AUC
(direction-free: max(AUC, 1 - AUC)) against
  y3        = touch 1 reached 3R before the stop, and
  stop_tc   = touch 1 stopped ON the touch candle (the event the s1_ snapshot "sees"),
on IS trades and on OOS trades. A creation feature that looks too good (> 0.58) would be investigated
like the s1_ bug. Missing values are imputed with the median (missingness is not used as a signal).

    python -I tools/zone_research/ml/leak_audit.py --is IS_DIR --oos OOS_DIR --out OUT_DIR
"""
import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

import zml_common as Z  # noqa: E402


def uauc(y, x):
    x = pd.to_numeric(x, errors="coerce")
    if x.notna().sum() < 50 or x.nunique() < 2:
        return float("nan")
    x = x.fillna(x.median()).to_numpy()
    a = Z.auc(y, x)
    return max(a, 1 - a)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--is", dest="is_dir", required=True)
    ap.add_argument("--oos", dest="oos_dir", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    IS = Z.load([a.is_dir])
    OOS = Z.load([a.oos_dir])
    Z.check_allow_list(IS.columns)
    rows = []
    for d in (IS, OOS):
        d["stop_tc"] = ((d["t1_result"].astype(str) == "stop") & (d["t1_end_time"].astype(str) == d["t1_time"].astype(str))).astype(int)
    for nm, d in (("IS", IS), ("OOS", OOS)):
        t = d[d.traded]
        print("%s: trades %d, P(3R) %.3f, P(stopped on the touch candle) %.3f" % (nm, len(t), t.y3.mean(), t.stop_tc.mean()))
    cat_codes = {c: {v: i for i, v in enumerate(sorted(pd.concat([IS[c], OOS[c]]).unique()))} for c in Z.CAT_FEATURES}
    feats = [(c, "creation") for c in Z.ALLOW] + [(c, "s1 (look-ahead)") for c in Z.s1_features(IS.columns)]
    for c, kind in feats:
        r = dict(feature=c, kind=kind)
        for nm, d in (("IS", IS), ("OOS", OOS)):
            t = d[d.traded]
            x = t[c].map(cat_codes[c]) if c in cat_codes else t[c]
            r["auc_y3_" + nm] = uauc(t.y3.to_numpy(), x)
            r["auc_stoptc_" + nm] = uauc(t.stop_tc.to_numpy(), x)
            r["na_" + nm] = float(pd.to_numeric(x, errors="coerce").isna().mean())
        rows.append(r)
    R = pd.DataFrame(rows).sort_values("auc_y3_OOS", ascending=False)
    R.to_csv(os.path.join(a.out, "leak_audit.csv"), index=False, float_format="%.4f")
    pd.set_option("display.width", 200)
    print("\nTop creation features by OOS univariate AUC (y3):")
    print(R[R.kind == "creation"].head(15).to_string(index=False, float_format="%.3f"))
    print("\nTop s1_ features by OOS univariate AUC (stopped on the touch candle):")
    print(R[R.kind != "creation"].sort_values("auc_stoptc_OOS", ascending=False).head(10).to_string(index=False, float_format="%.3f"))
    flag = R[(R.kind == "creation") & ((R.auc_y3_IS > 0.58) | (R.auc_y3_OOS > 0.58) | (R.auc_stoptc_OOS > 0.58))]
    print("\nCreation features flagged (> 0.58): %s" % (", ".join(flag.feature) if len(flag) else "none"))
    # the paired comparison from the HF doc: creation value vs its s1_ twin
    pairs = []
    for c in Z.ALLOW:
        base = {"c_runout_h": "runout_h", "c_nested": "nested"}.get(c, c)
        s1 = "s1_" + base
        if s1 in IS.columns:
            r1 = R[R.feature == c].iloc[0]
            r2 = R[R.feature == s1]
            if len(r2):
                r2 = r2.iloc[0]
                pairs.append(dict(feature=c, create_stoptc_OOS=r1.auc_stoptc_OOS, s1_stoptc_OOS=r2.auc_stoptc_OOS,
                                  create_y3_OOS=r1.auc_y3_OOS, s1_y3_OOS=r2.auc_y3_OOS))
    P = pd.DataFrame(pairs)
    P["gap"] = P.s1_stoptc_OOS - P.create_stoptc_OOS
    P = P.sort_values("gap", ascending=False)
    P.to_csv(os.path.join(a.out, "leak_pairs.csv"), index=False, float_format="%.4f")
    print("\nCreation vs s1_ twin, AUC for 'stopped on the touch candle' (OOS), biggest gaps:")
    print(P.head(10).to_string(index=False, float_format="%.3f"))


if __name__ == "__main__":
    main()
