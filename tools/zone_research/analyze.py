#!/usr/bin/env python3
"""Zone Research analysis for RamanFX ZoneVision (MT5) research CSVs.

Usage:
    python3 tools/zone_research/analyze.py FILE_OR_DIR [FILE_OR_DIR ...]
        [--out docs/Zone_Research_Report.md] [--stop wick|close] [--min-n 30]
        [--detector ZV|ALT|all] [--only-drawn]

Input: one or more CSVs written by RamanFX_ZoneVision.mq5 in research mode
(Terminal\\Common\\Files\\RFX_ZoneResearch_<symbol>_<from>_<to>.csv). A directory
loads every *.csv inside it. Files ending in _running.csv are accepted too (the
test was stopped before the indicator could rename the file).

Trade model (as logged by the indicator): entry at the proximal, stop at the
distal, 1R = zone height + spread. A fixed target of kR counts +k when the
touch reached kR before the stop, -1 when it was stopped first, 0 when the
trade was still open at the horizon. Untouched zones count 0 (no fill).
"opp" target = the nearest opposing zone at creation (its distance in R is
opp_R); zones with no opposing zone count 0 for that target.

Only the standard library is required (csv, statistics). pandas is not needed.
"""
import argparse
import csv
import glob
import math
import os
import statistics
import sys
from collections import OrderedDict, defaultdict

TARGETS = [1, 2, 3, 4, 5]
HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUT = os.path.normpath(os.path.join(HERE, "..", "..", "docs", "Zone_Research_Report.md"))


# ----------------------------------------------------------------------------- loading
def fnum(v, default=None):
    try:
        if v is None or v == "":
            return default
        x = float(v)
        if math.isnan(x):
            return default
        return x
    except (TypeError, ValueError):
        return default


def fint(v, default=0):
    x = fnum(v)
    return default if x is None else int(round(x))


def expand_inputs(paths):
    files = []
    for p in paths:
        if os.path.isdir(p):
            files.extend(sorted(glob.glob(os.path.join(p, "*.csv"))))
        else:
            hits = sorted(glob.glob(p))
            files.extend(hits if hits else [p])
    seen, out = set(), []
    for f in files:
        k = os.path.abspath(f)
        if k not in seen:
            seen.add(k)
            out.append(f)
    return out


def load_rows(files):
    rows = []
    for f in files:
        with open(f, newline="", encoding="latin-1") as fh:
            rd = csv.DictReader(fh)
            if rd.fieldnames is None or "detector" not in rd.fieldnames:
                print("skip (not a research CSV): %s" % f, file=sys.stderr)
                continue
            n = 0
            for r in rd:
                if not r.get("detector"):
                    continue
                r["_file"] = os.path.basename(f)
                rows.append(r)
                n += 1
            print("loaded %6d zones from %s" % (n, f), file=sys.stderr)
    # the same zone can appear in two overlapping test runs: keep the first
    uniq, seen = [], set()
    for r in rows:
        k = (r.get("detector"), r.get("symbol"), r.get("tf"), r.get("id"))
        if k in seen:
            continue
        seen.add(k)
        uniq.append(r)
    return uniq


# ----------------------------------------------------------------------------- trades
def touch_trade(r, k, stop_mode):
    """Return a dict for touch k (1..3) or None when that touch did not happen."""
    p = "t%d_" % k
    if not r.get(p + "time"):
        return None
    mfe = fnum(r.get(p + "mfe"), 0.0)
    res = r.get(p + "result", "")
    if stop_mode == "close" and k == 1 and r.get("t1c_result", "") != "":
        mfe = fnum(r.get("t1c_mfe"), 0.0)
        res = r.get("t1c_result", "")
    return {"k": k, "mfe": mfe, "res": res, "depth": fnum(r.get(p + "depth")), "bars": fnum(r.get(p + "bars")),
            "oppR": fnum(r.get("opp_R"), 0.0)}


def outcome_r(t, target):
    """R result of one touch trade for a target (number of R, or 'opp')."""
    if t is None:
        return 0.0
    if target == "opp":
        tr = t["oppR"]
        if not tr or tr <= 0:
            return 0.0
    else:
        tr = float(target)
    if t["mfe"] >= tr:
        return tr
    if t["res"] == "stop":
        return -1.0
    return 0.0


class Stats(object):
    """Aggregates over a list of zone rows (touch 1 = the trade) or of touch trades."""

    def __init__(self, items, stop_mode, trades=None):
        # items: zone rows; trades: list of trade dicts aligned with items (None = untouched)
        self.n = len(items)
        self.trades = trades if trades is not None else [touch_trade(r, 1, stop_mode) for r in items]
        tt = [t for t in self.trades if t is not None]
        self.nt = len(tt)
        self.touch_rate = self.nt / self.n if self.n else float("nan")
        self.respect = (sum(1 for t in tt if t["mfe"] >= 1) / self.nt) if self.nt else float("nan")
        self.hit = {k: (sum(1 for t in tt if t["mfe"] >= k) / self.nt if self.nt else float("nan")) for k in TARGETS}
        self.stopped = (sum(1 for t in tt if t["res"] == "stop") / self.nt) if self.nt else float("nan")
        mf = [t["mfe"] for t in tt]
        self.mfe_avg = statistics.mean(mf) if mf else float("nan")
        self.mfe_med = statistics.median(mf) if mf else float("nan")
        opp = [t for t in tt if t["oppR"] and t["oppR"] > 0]
        self.opp_hit = (sum(1 for t in opp if t["mfe"] >= t["oppR"]) / len(opp)) if opp else float("nan")
        self.opp_avgR = statistics.mean([t["oppR"] for t in opp]) if opp else float("nan")
        self.E = {}
        self.Et = {}
        for tg in TARGETS + ["opp"]:
            vals = [outcome_r(t, tg) for t in self.trades]
            self.E[tg] = (sum(vals) / self.n) if self.n else float("nan")          # per zone (untouched = 0)
            self.Et[tg] = (sum(vals) / self.nt) if self.nt else float("nan")       # per filled trade

    def best(self):
        cand = [(self.E[k], k) for k in TARGETS + ["opp"] if not math.isnan(self.E[k])]
        if not cand:
            return (float("nan"), None)
        return max(cand, key=lambda x: x[0])


# ----------------------------------------------------------------------------- formatting
def pct(x):
    return "-" if x is None or (isinstance(x, float) and math.isnan(x)) else "%.0f%%" % (100 * x)


def num(x, d=2):
    return "-" if x is None or (isinstance(x, float) and math.isnan(x)) else ("%." + str(d) + "f") % x


def table(headers, rows):
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join(["---"] * len(headers)) + "|"]
    for r in rows:
        out.append("| " + " | ".join(str(c) for c in r) + " |")
    return "\n".join(out)


def summary_row(label, st):
    b = st.best()
    return [label, st.n, st.nt, pct(st.touch_rate), pct(st.respect)] + [pct(st.hit[k]) for k in TARGETS] + [
        num(st.mfe_avg), num(st.mfe_med)] + [num(st.E[k], 3) for k in TARGETS] + [num(st.E["opp"], 3),
                                                                               "%s (%s)" % (b[1], num(b[0], 3)) if b[1] is not None else "-"]


SUMMARY_HEAD = ["group", "zones", "touched", "touch%", "respect(1R)%", "1R%", "2R%", "3R%", "4R%", "5R%",
                "MFE avg", "MFE med", "E 1R", "E 2R", "E 3R", "E 4R", "E 5R", "E opp", "best"]


# ----------------------------------------------------------------------------- features
def numeric_feature(name, cuts):
    def f(r):
        return fnum(r.get(name))
    return (name, f, cuts)


def bin_numeric(v, cuts):
    if v is None:
        return "n/a"
    lo = None
    for c in cuts:
        if v < c:
            return ("< %g" % c) if lo is None else ("%g - %g" % (lo, c))
        lo = c
    return ">= %g" % cuts[-1]


NUMERIC_FEATURES = [
    numeric_feature("leg_ratio", [1.5, 2.0, 2.5, 3.0, 4.0]),
    numeric_feature("moveaway_h_create", [1, 2, 3, 5]),
    numeric_feature("runout_h", [1, 2, 3, 5, 8]),
    numeric_feature("base_n", [2, 3, 4, 6]),
    numeric_feature("height_atr", [0.25, 0.5, 0.75, 1.0, 1.5]),
    numeric_feature("legout_atr", [1, 1.5, 2, 3]),
    numeric_feature("legin_atr", [0.5, 1, 1.5, 2]),
    numeric_feature("gap", [0, 0.15, 0.25, 0.5, 1]),
    numeric_feature("score", [0, 2, 4, 6]),
    numeric_feature("curve", [20, 40, 60, 80]),
    numeric_feature("opp_R", [1, 2, 3, 5]),
    numeric_feature("plan_rr", [1, 2, 3, 5]),
    numeric_feature("t1_depth", [10, 25, 50, 75, 100.0001]),
    numeric_feature("t1_bars", [5, 10, 20, 50, 100]),
]

CATEGORICAL_FEATURES = ["verdict", "grade", "zgrade", "pattern", "type", "arrival", "chain", "rm_opp_zone", "rm_trendline",
                        "new_high_low", "rm_prev_high_low", "leg2", "too_small", "trap", "crowded", "emotional",
                        "would_draw", "tested_at_create", "align", "bigger_align", "htf_trend", "tl_bias", "nested",
                        "in_opp_htf", "session", "weekday", "alt_strength"]


def feature_tables(rows, stop_mode, min_n):
    parts = []
    head = ["bin", "zones", "touched", "touch%", "respect%", "E 1R", "E 2R", "E 3R", "E 5R", "E opp", "E/trade 2R"]
    for name, f, cuts in NUMERIC_FEATURES:
        groups = OrderedDict()
        for r in rows:
            b = bin_numeric(f(r), cuts)
            groups.setdefault(b, []).append(r)
        order = sorted(groups.keys(), key=lambda b: _bin_order(b, cuts))
        trs = []
        for b in order:
            st = Stats(groups[b], stop_mode)
            flag = "" if st.n >= min_n else " (few)"
            trs.append([b + flag, st.n, st.nt, pct(st.touch_rate), pct(st.respect), num(st.E[1], 3), num(st.E[2], 3),
                        num(st.E[3], 3), num(st.E[5], 3), num(st.E["opp"], 3), num(st.Et[2], 3)])
        parts.append("#### %s\n\n%s\n" % (name, table(head, trs)))
    for name in CATEGORICAL_FEATURES:
        groups = OrderedDict()
        for r in rows:
            v = r.get(name, "")
            groups.setdefault(v if v != "" else "n/a", []).append(r)
        if len(groups) <= 1 and "n/a" in groups:
            continue
        trs = []
        for b in sorted(groups.keys()):
            st = Stats(groups[b], stop_mode)
            flag = "" if st.n >= min_n else " (few)"
            trs.append([b + flag, st.n, st.nt, pct(st.touch_rate), pct(st.respect), num(st.E[1], 3), num(st.E[2], 3),
                        num(st.E[3], 3), num(st.E[5], 3), num(st.E["opp"], 3), num(st.Et[2], 3)])
        parts.append("#### %s\n\n%s\n" % (name, table(head, trs)))
    return "\n".join(parts)


def _bin_order(b, cuts):
    if b == "n/a":
        return 1e18
    if b.startswith("<"):
        return -1e18
    if b.startswith(">="):
        return 1e17
    try:
        return float(b.split(" - ")[0])
    except ValueError:
        return 0


def touch_number_table(rows, stop_mode):
    head = ["touch", "trades", "respect%", "1R%", "2R%", "3R%", "5R%", "stopped%", "MFE avg", "E/trade 1R", "E/trade 2R",
            "E/trade 3R", "E/trade opp"]
    out = []
    for k in (1, 2, 3):
        trades = [touch_trade(r, k, stop_mode) for r in rows]
        trades = [t for t in trades if t is not None]
        if not trades:
            out.append([k, 0] + ["-"] * (len(head) - 2))
            continue
        fake = [None] * len(trades)
        st = Stats(fake, stop_mode, trades=trades)
        out.append([k, st.nt, pct(st.respect), pct(st.hit[1]), pct(st.hit[2]), pct(st.hit[3]), pct(st.hit[5]),
                    pct(st.stopped), num(st.mfe_avg), num(st.Et[1], 3), num(st.Et[2], 3), num(st.Et[3], 3),
                    num(st.Et["opp"], 3)])
    return table(head, out)


POST_ENTRY = ("t1_depth",)   # known only after the entry: shown in the feature tables, never used as a filter


def round2(x):
    """Round to 2 significant digits so quantile cut-offs read cleanly (3.01 -> 3)."""
    if x == 0:
        return 0.0
    return round(x, -int(math.floor(math.log10(abs(x)))) + 1)


def recommend_thresholds(rows, stop_mode, min_n, top=12):
    """Single-feature cut-offs (keep zones with feature >= c, or <= c, or == value) that raise the
    per-zone expectancy the most, with at least min_n zones kept."""
    base = Stats(rows, stop_mode)
    bestE, bestT = base.best()
    res = []
    for name, f, cuts in NUMERIC_FEATURES:
        if name in POST_ENTRY:
            continue
        vals = sorted(v for v in (f(r) for r in rows) if v is not None)
        if len(vals) < min_n:
            continue
        qs = sorted(set([round2(vals[int(len(vals) * q)]) for q in (0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9)] + list(cuts)))
        for c in qs:
            for side in (">=", "<="):
                sub = [r for r in rows if f(r) is not None and ((f(r) >= c) if side == ">=" else (f(r) <= c))]
                if len(sub) < min_n or len(sub) == len(rows):
                    continue
                st = Stats(sub, stop_mode)
                e, t = st.best()
                res.append((e, "%s %s %g" % (name, side, c), st, t))
    for name in CATEGORICAL_FEATURES:
        values = set(r.get(name, "") for r in rows)
        for v in values:
            if v == "":
                continue
            sub = [r for r in rows if r.get(name, "") == v]
            if len(sub) < min_n or len(sub) == len(rows):
                continue
            st = Stats(sub, stop_mode)
            e, t = st.best()
            res.append((e, "%s == %s" % (name, v), st, t))
    res = [x for x in res if not math.isnan(x[0])]
    res.sort(key=lambda x: -x[0])
    head = ["filter", "zones kept", "touched", "respect%", "best target", "E/zone", "E/trade", "vs all zones"]
    out = []
    for e, label, st, t in res[:top]:
        out.append([label, st.n, st.nt, pct(st.respect), t, num(e, 3), num(st.Et[t], 3),
                    "%+.3f" % (e - bestE) if not math.isnan(bestE) else "-"])
    return base, bestE, bestT, table(head, out) if out else "_not enough samples (min %d per filter)_" % min_n


def rr_per_tf(rows, stop_mode, min_n):
    by = defaultdict(list)
    for r in rows:
        by[(r.get("detector"), r.get("tf"))].append(r)
    head = ["detector", "tf", "zones", "touched", "E 1R", "E 2R", "E 3R", "E 4R", "E 5R", "E opp", "recommended R:R"]
    out = []
    for (d, tf) in sorted(by.keys(), key=lambda k: (k[0], tf_rank(k[1]))):
        st = Stats(by[(d, tf)], stop_mode)
        e, t = st.best()
        rec = ("1:%s" % t if t != "opp" else "opposing zone") if (t is not None and st.n >= min_n) else "need >= %d zones" % min_n
        if t is not None and e <= 0 and st.n >= min_n:
            rec += " (still negative: filter first)"
        out.append([d, tf, st.n, st.nt] + [num(st.E[k], 3) for k in TARGETS] + [num(st.E["opp"], 3), rec])
    return table(head, out)


TF_ORDER = ["M1", "M2", "M3", "M4", "M5", "M6", "M10", "M12", "M15", "M20", "M30", "H1", "H2", "H3", "H4", "H6", "H8",
            "H12", "D1", "W1", "MN"]


def tf_rank(tf):
    return TF_ORDER.index(tf) if tf in TF_ORDER else 99


# ----------------------------------------------------------------------------- report
def build_report(rows, files, stop_mode, min_n, detector, only_drawn):
    L = []
    L.append("# Zone Research Report")
    L.append("")
    L.append("Generated by `tools/zone_research/analyze.py` from %d file(s): %s." % (len(files), ", ".join(
        "`%s`" % os.path.basename(f) for f in files)))
    L.append("")
    syms = sorted(set(r.get("symbol", "") for r in rows))
    created = sorted(r.get("created", "") for r in rows if r.get("created"))
    L.append("- Zones: **%d** | symbols: %s | created from %s to %s" % (
        len(rows), ", ".join(syms) or "-", created[0] if created else "-", created[-1] if created else "-"))
    L.append("- Stop model: **%s** (%s)" % (stop_mode, "stop order at the distal, a wick fills it" if stop_mode == "wick"
                                             else "touch 1 stopped only by a candle CLOSE beyond the distal"))
    L.append("- Filters: detector = %s%s; min samples for recommendations = %d" % (
        detector, ", only zones ZoneVision would draw" if only_drawn else "", min_n))
    L.append("- Expectancy (E) is in R. **E/zone** counts untouched zones as 0 (a limit order never filled); **E/trade** "
             "is per filled touch. Target kR: +k if reached before the stop, -1 if stopped first, 0 if still open at "
             "the horizon. \"opp\" = the nearest opposing zone at creation.")
    L.append("- Respect = touch 1 reached 1R before the stop. Hit rates are per touched zone.")
    L.append("")

    L.append("## 1. Counts")
    L.append("")
    for key in ("detector", "tf", "type", "pattern", "verdict", "status"):
        c = defaultdict(int)
        for r in rows:
            c[r.get(key, "") or "n/a"] += 1
        items = sorted(c.items(), key=lambda kv: (tf_rank(kv[0]) if key == "tf" else 0, kv[0]))
        L.append("**%s**: " % key + ", ".join("%s %d" % (k, v) for k, v in items))
        L.append("")
    cross = defaultdict(int)
    for r in rows:
        cross[(r.get("detector"), r.get("tf"), r.get("type"), r.get("pattern"))] += 1
    L.append(table(["detector", "tf", "type", "pattern", "zones"],
                   [list(k) + [v] for k, v in sorted(cross.items(), key=lambda kv: (kv[0][0], tf_rank(kv[0][1]), kv[0][2], kv[0][3]))]))
    L.append("")

    L.append("## 2. Touch, respect, hit rates and expectancy")
    L.append("")
    srows = [summary_row("ALL", Stats(rows, stop_mode))]
    for key in ("detector", "tf", "type", "pattern"):
        groups = defaultdict(list)
        for r in rows:
            groups[r.get(key, "")].append(r)
        for g in sorted(groups.keys(), key=lambda x: (tf_rank(x) if key == "tf" else 0, x)):
            srows.append(summary_row("%s=%s" % (key, g), Stats(groups[g], stop_mode)))
    groups = defaultdict(list)
    for r in rows:
        groups[(r.get("detector"), r.get("tf"))].append(r)
    for g in sorted(groups.keys(), key=lambda k: (k[0], tf_rank(k[1]))):
        srows.append(summary_row("%s %s" % g, Stats(groups[g], stop_mode)))
    L.append(table(SUMMARY_HEAD, srows))
    L.append("")

    L.append("### Best R target by expectancy per TF (recommended global R:R)")
    L.append("")
    L.append(rr_per_tf(rows, stop_mode, min_n))
    L.append("")

    L.append("### By touch number (each touch is its own trade)")
    L.append("")
    L.append(touch_number_table(rows, stop_mode))
    L.append("")

    L.append("## 3. ZV vs ALT")
    L.append("")
    dets = sorted(set(r.get("detector") for r in rows))
    if len(dets) > 1:
        cmp_rows = []
        for tf in sorted(set(r.get("tf") for r in rows), key=tf_rank):
            for d in dets:
                sub = [r for r in rows if r.get("detector") == d and r.get("tf") == tf]
                if sub:
                    cmp_rows.append(summary_row("%s %s" % (d, tf), Stats(sub, stop_mode)))
        L.append(table(SUMMARY_HEAD, cmp_rows))
        L.append("")
        # ALT judged by ZoneVision rules
        alt = [r for r in rows if r.get("detector") == "ALT"]
        if alt:
            g = defaultdict(list)
            for r in alt:
                g["%s / ZV verdict %s" % (r.get("alt_strength", "") or "-", r.get("verdict", "") or "-")].append(r)
            L.append("ALT zones by their own strength (look-left) and by the ZoneVision verdict they would get:")
            L.append("")
            L.append(table(SUMMARY_HEAD, [summary_row(k, Stats(v, stop_mode)) for k, v in sorted(g.items())]))
            L.append("")
    else:
        L.append("_Only one detector in the data (%s)._" % ", ".join(dets))
        L.append("")

    L.append("## 4. Feature importance")
    L.append("")
    for d in dets:
        sub = [r for r in rows if r.get("detector") == d]
        L.append("### %s (%d zones)" % (d, len(sub)))
        L.append("")
        L.append("Respect rate and expectancy by bin. Bins with fewer than %d zones are marked (few)." % min_n)
        L.append("")
        L.append(feature_tables(sub, stop_mode, min_n))
        L.append("")

    L.append("## 5. Recommended thresholds")
    L.append("")
    L.append("Single-feature filters that raise the per-zone expectancy the most (each keeps at least %d zones). "
             "Check that a filter makes sense before using it: with few zones the top line is often noise. "
             "Re-run on a different period (out of sample) before changing the indicator." % min_n)
    L.append("")
    for d in dets:
        for tf in sorted(set(r.get("tf") for r in rows if r.get("detector") == d), key=tf_rank):
            sub = [r for r in rows if r.get("detector") == d and r.get("tf") == tf]
            base, bestE, bestT, tab = recommend_thresholds(sub, stop_mode, min_n)
            L.append("### %s %s - all zones: best target %s, E/zone %s (n=%d)" % (d, tf, bestT, num(bestE, 3), base.n))
            L.append("")
            L.append(tab)
            L.append("")
        sub = [r for r in rows if r.get("detector") == d]
        base, bestE, bestT, tab = recommend_thresholds(sub, stop_mode, min_n)
        L.append("### %s all timeframes - all zones: best target %s, E/zone %s (n=%d)" % (d, bestT, num(bestE, 3), base.n))
        L.append("")
        L.append(tab)
        L.append("")

    L.append("## 6. Column notes")
    L.append("")
    L.append("See `docs/Zone_Research_HowTo.md` for every CSV column. Touch depth (t1_depth) and touch number are only "
             "known after the touch; they describe what a good reaction looks like, not an entry filter.")
    L.append("")
    return "\n".join(L)


def main(argv=None):
    ap = argparse.ArgumentParser(description="Analyse RamanFX ZoneVision zone-research CSVs.")
    ap.add_argument("inputs", nargs="+", help="CSV files, globs or directories")
    ap.add_argument("--out", default=DEFAULT_OUT, help="markdown report path (default docs/Zone_Research_Report.md)")
    ap.add_argument("--stop", choices=["wick", "close"], default="wick", help="stop model for touch 1 (default wick)")
    ap.add_argument("--min-n", type=int, default=30, help="minimum samples for a recommendation (default 30)")
    ap.add_argument("--detector", default="all", help="ZV, ALT or all (default)")
    ap.add_argument("--only-drawn", action="store_true", help="ZV: only zones ZoneVision would draw (would_draw=1)")
    a = ap.parse_args(argv)
    files = expand_inputs(a.inputs)
    if not files:
        print("no input files", file=sys.stderr)
        return 2
    rows = load_rows(files)
    if a.detector.upper() != "ALL":
        rows = [r for r in rows if r.get("detector", "").upper() == a.detector.upper()]
    if a.only_drawn:
        rows = [r for r in rows if r.get("would_draw") == "1"]
    if not rows:
        print("no zones in the input", file=sys.stderr)
        return 1
    rep = build_report(rows, files, a.stop, a.min_n, a.detector, a.only_drawn)
    print(rep)
    d = os.path.dirname(os.path.abspath(a.out))
    if d and not os.path.isdir(d):
        os.makedirs(d)
    with open(a.out, "w") as fh:
        fh.write(rep + "\n")
    print("\nreport written to %s" % a.out, file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
