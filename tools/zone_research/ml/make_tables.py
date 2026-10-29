#!/usr/bin/env python3
"""Render the markdown tables of docs/research/Zone_ML_Benchmark.md from benchmark.py / leak_audit.py output.

    python -I tools/zone_research/ml/make_tables.py --runs OUT_DIR [OUT_DIR ...] --audit AUDIT_DIR > tables.md
Later run directories override earlier ones for the same model|split key.
"""
import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import pandas as pd  # noqa: E402

import zml_common as Z  # noqa: E402

LABEL = {"lgbm": "LightGBM", "lr": "Logistic regression", "tabpfn": "TabPFN v2 (HF)", "tabicl": "TabICL v2 (HF)",
         "cons": "`cons` score (no ML)", "lowspread": "lowest `spread_R` (no ML)", "random": "random", "lgbm_age": "LightGBM + age at touch (`t1_bars`)",
         "lgbm_y2": "LightGBM trained on 2R (E at 2R)", "lgbm_y5": "LightGBM trained on 5R (E at 5R)",
         "lgbm_s1": "LightGBM + all `s1_` (LEAK)", "lgbm_s1nd": "LightGBM + `s1_` minus `s1_touch_depth` (LEAK)"}
ORDER = ["lgbm", "lr", "tabpfn", "tabicl", "cons", "lowspread", "random", "lgbm_age", "lgbm_y2", "lgbm_y5", "lgbm_s1", "lgbm_s1nd"]
GATED = ["lgbm", "lr", "tabpfn", "tabicl"]
SPLIT = {"F": "F: 23-24 -> 26", "Fplus": "F+: 23-25 -> 26", "R": "R: 26H1 -> 23-25"}


def c(t, d=2):
    return Z.fmt_ci(tuple(t), d)


def yes(b):
    return "yes" if b else "no"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--runs", nargs="+", required=True)
    ap.add_argument("--audit", default=None)
    a = ap.parse_args()
    res, shap = {}, {}
    for d in a.runs:
        j = json.load(open(os.path.join(d, "results.json")))
        res.update(j["results"])
        for f in os.listdir(d):
            if f.startswith("shap_") and f.endswith(".csv"):
                shap[f[5:-4]] = pd.read_csv(os.path.join(d, f), index_col=0)["mean_abs_shap"]
    keys = [(m, s) for s in ("F", "Fplus", "R") for m in ORDER if "%s|%s" % (m, s) in res]
    P = print

    P("### Headline: touch-1 trades, wick stop\n")
    P("For `lgbm_y2` the E columns are at 2R, and for `lgbm_y5` at 5R; every other row is at 3R. "
      "The top bucket uses thresholds fixed on the calibration period (F, R) or ranks inside the test set (F+).\n")
    P("| Model | Split | Trades | P(3R) | AUC | Brier skill | Top 10% E/trade [95% CI] | Top 20% E/trade [95% CI] | Top 20% lift vs all [CI] | Top 20% share | All trades E |")
    P("|---|---|---|---|---|---|---|---|---|---|---|")
    for m, s in keys:
        r = res["%s|%s" % (m, s)]
        bss = ("%+.2f%%" % (100 * r["bss_test"])) if "bss_test" in r else "n/a"
        P("| %s | %s | %d | %.3f | %.3f | %s | %s | %s | %s | %.0f%% | %+.3f |" % (
            LABEL[m], SPLIT[s], r["n_trades"], r["base_rate"], r["auc"], bss, c(r["top10"]["E3"]), c(r["top20"]["E3"]),
            c(r["top20"]["lift"]), 100 * r["top20"]["share"], r["E_all"][0]))

    P("\n### Other targets and per zone (top 20% chosen by the 3R model)\n")
    P("| Model | Split | Top 20% P(3R) | E at 2R | E at 5R | E/zone top 20% [CI] | E/zone, all zones |")
    P("|---|---|---|---|---|---|---|")
    for m, s in keys:
        if m in ("lgbm_y2", "lgbm_y5"):
            continue
        r = res["%s|%s" % (m, s)]
        t = r["top20"]
        P("| %s | %s | %.3f | %+.3f | %+.3f | %s | %+.3f |" % (LABEL[m], SPLIT[s], t["P3"], t["E2"], t["E5"], c(t["E3_zone"]),
                                                           t["E3_zone_all"]))

    P("\n### Pass/fail (pre-registered; gated models, F and R)\n")
    P("| Model | F: C1 symbols with CI_lo > 0 (need 3/5) | F: C2 Brier skill >= 0.5% | F: C3 lift CI_lo > 0 | R: C1 (need 2/2) | R: C2 | R: C3 | PASS |")
    P("|---|---|---|---|---|---|---|---|")
    for m in GATED + ["cons", "lowspread"]:
        if "%s|F" % m not in res or "%s|R" % m not in res:
            continue
        f, r = res["%s|F" % m]["criteria"], res["%s|R" % m]["criteria"]
        ok = all([f["C1"], f["C2"], f["C3"], r["C1"], r["C2"], r["C3"]])
        P("| %s | %d (%s) | %s | %s | %d (%s) | %s | %s | **%s** |" % (
            LABEL[m], len(f["C1_symbols"]), ", ".join(f["C1_symbols"]) or "none", yes(f["C2"]), yes(f["C3"]),
            len(r["C1_symbols"]), ", ".join(r["C1_symbols"]) or "none", yes(r["C2"]), yes(r["C3"]), "PASS" if ok else "FAIL"))

    for grp, title in (("symbol", "symbol"), ("tf", "timeframe"), ("detector", "detector")):
        P("\n### Top-20%% E/trade at 3R by %s [95%% CI] (n in the bucket; AUC inside the group)\n" % title)
        cols = None
        rows = []
        for m in GATED + ["cons", "lowspread"]:
            for s in ("F", "R"):
                k = "%s|%s" % (m, s)
                if k not in res:
                    continue
                g = res[k]["top20"]["by_" + grp]
                cols = cols or sorted(g)
                rows.append((m, s, g))
        if not rows:
            continue
        allc = sorted(set(x for _, _, g in rows for x in g), key=lambda x: Z.TF_RANK.get(x, 0) if grp == "tf" else x)
        P("| Model | Split | " + " | ".join(allc) + " |")
        P("|---|---|" + "---|" * len(allc))
        for m, s, g in rows:
            cells = []
            for x in allc:
                if x in g:
                    v = g[x]
                    cells.append("%s (n %d, AUC %.3f; all %+.2f)" % (c(v["E3"]), v["n"], v["auc"], v["E_all"]))
                else:
                    cells.append("-")
            P("| %s | %s | %s |" % (LABEL[m], SPLIT[s], " | ".join(cells)))

    P("\n### Feature importance (mean |SHAP| on the test trades, LightGBM)\n")
    names = [k for k in ("lgbm_F", "lgbm_R", "lgbm_s1nd_Fplus") if k in shap]
    if names:
        P("| Rank | " + " | ".join(names) + " |")
        P("|---|" + "---|" * len(names))
        for i in range(15):
            P("| %d | %s |" % (i + 1, " | ".join("%s (%.4f)" % (shap[n].index[i], shap[n].iloc[i]) for n in names)))
        if "lgbm_F" in shap and "lgbm_R" in shap:
            j = pd.concat([shap["lgbm_F"], shap["lgbm_R"]], axis=1, keys=["F", "R"]).fillna(0)
            rho = j.rank().corr().iloc[0, 1]
            topF, topR = set(shap["lgbm_F"].index[:10]), set(shap["lgbm_R"].index[:10])
            P("\nSpearman rank correlation of importances, F vs R: %.2f. Top-10 overlap: %d of 10 (%s)." % (
                rho, len(topF & topR), ", ".join(sorted(topF & topR))))

    if a.audit:
        A = pd.read_csv(os.path.join(a.audit, "leak_audit.csv"))
        P("\n### Leak audit: univariate AUC (direction-free) on trades\n")
        P("`stop_tc` = stopped on the touch candle itself.\n")
        P("| Feature | Kind | AUC y3 IS | AUC y3 OOS | AUC stop_tc IS | AUC stop_tc OOS |")
        P("|---|---|---|---|---|---|")
        cr = A[A.kind == "creation"].sort_values("auc_y3_OOS", ascending=False).head(12)
        s1 = A[A.kind != "creation"].sort_values("auc_stoptc_OOS", ascending=False).head(8)
        for _, r in pd.concat([cr, s1]).iterrows():
            P("| `%s` | %s | %.3f | %.3f | %.3f | %.3f |" % (r.feature, r.kind, r.auc_y3_IS, r.auc_y3_OOS, r.auc_stoptc_IS,
                                                         r.auc_stoptc_OOS))
        mx = A[A.kind == "creation"][["auc_y3_IS", "auc_y3_OOS"]].max()
        P("\nThe largest creation-feature AUC for y3 is %.3f in IS and %.3f in OOS." % (mx.auc_y3_IS, mx.auc_y3_OOS))


if __name__ == "__main__":
    main()
