#!/usr/bin/env python3
"""Zone Research analysis for RamanFX ZoneVision (MT5) research CSVs.

Usage:
    python3 tools/zone_research/analyze.py FILE_OR_DIR [FILE_OR_DIR ...]
        [--out docs/Zone_Research_Report.md] [--stop wick|close] [--min-n 30]
        [--detector ZV|ALT|all] [--only-drawn]
        v2 (ZoneVision 2.00 research files, spec 6.2):
        [--calibrate RFX_Calib.csv] [--oos FILE_OR_DIR ...] [--split-date 2024-01-01]
        [--key-level-max 5] [--prior 20] [--cell-min 10] [--cal-min-n 30]
        [--min-lens-n 100] [--lr-max 10000] [--cells-from is|all] [--pine OUT.pine]

v2: the positional inputs are the in-sample (IS) data. --oos gives the
out-of-sample files; without it --split-date splits the inputs by the
creation date, and without that the last 25% of creation dates are OOS.
--calibrate writes the lookup table the indicator reads (hierarchical cells
L0..L5 with shrinkage toward the parent, lens weights W tuned on IS and kept
only when the OOS lift has the same sign, a logistic p(3R) model written
only when it beats the base rate on OOS, single-feature bins B, consensus
priors CS, META). The v2 report sections are added when the files have v2
columns (or with --calibrate / --oos / --split-date).

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
    stop_r = -1.0
    mfe = fnum(r.get(p + "mfe"), 0.0)
    res = r.get(p + "result", "")
    if stop_mode == "close" and k == 1 and r.get("t1c_result", "") != "":
        mfe = fnum(r.get("t1c_mfe"), 0.0)
        res = r.get("t1c_result", "")
        loss = fnum(r.get("t1c_loss"), None) if r.get("t1c_loss", "") != "" else None
        if res == "stop" and loss is not None:
            stop_r = min(-1.0, loss)                     # the real close-stop loss (close beyond the distal)
        elif res == "stop":
            stop_r = -1.0                                # older CSV without t1c_loss: optimistic -1R
    return {"k": k, "mfe": mfe, "res": res, "stopR": stop_r, "depth": fnum(r.get(p + "depth")), "bars": fnum(r.get(p + "bars")),
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
        return t.get("stopR", -1.0)
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


# ============================================================================= v2 (spec 6.2 - 6.4)
# Decision values come from the creation columns (default). With --decision touch they come from the touch-1
# snapshot (s1_ columns), which is taken on the touch candle's CLOSE, after the limit filled: look-ahead. The calibration cell key, the lens passes, the LR features and
# the bins all read through gv(), so the indicator (which builds the key from a zone's CURRENT DNA) and
# the table agree on what a field means.
CAL_TARGETS = [1, 2, 3, 5, "opp"]            # the E columns of a cell row: E1, E2, E3, E5, Eopp
LENSES = [("Kevin", "pass_k"), ("Seiden", "pass_s"), ("Raja", "pass_r"), ("Baker", "pass_b")]
CONS_BINS = [(0, 40), (40, 60), (60, 75), (75, 90), (90, 100)]
# the logistic p(3R) inputs (spec 6.4); names = RFX_ZoneCore.mqh CalFeat()
LR_FEATURES = ["departure", "base_rel", "legin_spd", "legout_rel", "gap", "runout_h", "rm_opp_n", "arrival_raja", "ath",
               "nested", "nest_pos", "curve_zone", "room_R", "depth_1", "align_dir", "dirq", "impulse", "cp_run",
               "origin_ok", "golden"]
# single-feature bins (B rows, the "tells" line)
BIN_FEATURES = LR_FEATURES + ["base_n", "legout_atr", "leg_ratio", "height_atr", "opp_R", "opp_htf_R", "stacked", "trap",
                              "crowded", "cons", "sK", "sS", "sR", "sB", "n_pass"]
# creation column of a feature when v1 already writes it under another name / v2 adds "c_"
CREATE_COL = {"runout_h": "c_runout_h", "nested": "c_nested"}
CLIPS = {"runout_h": (0, 20), "curve_zone": (-50, 150), "room_R": (0, 10), "opp_R": (0, 10), "opp_htf_R": (0, 10)}


def has_v2(rows):
    return any(r.get("s1_ok") not in (None, "") for r in rows[:2000])


USE_S1 = False   # --decision touch: read the s1_ snapshot (taken on the touch candle's CLOSE = after the fill: look-ahead)


def s1ok(r):
    return USE_S1 and r.get("s1_ok") == "1"


def gv(r, name, cname=None):
    """Decision value: the touch-1 snapshot when taken, else the creation column."""
    if s1ok(r):
        v = r.get("s1_" + name, "")
        if v not in (None, ""):
            return v
    return r.get(cname or CREATE_COL.get(name, name), "") or ""


def feat(r, name):
    """Feature value with the same names / clipping as CalFeat() in the core. None = missing."""
    if name == "golden":
        m = fnum(gv(r, "min_from_open"))
        return None if m is None else (1.0 if 0 <= m <= 60 else 0.0)
    v = fnum(gv(r, name))
    if v is None:
        return None
    if name == "nest_pos" and fnum(gv(r, "nested"), 0) == 0:
        v = 0.0
    if name in CLIPS:
        lo, hi = CLIPS[name]
        v = max(lo, min(hi, v))
    return v


def raja_group(t):
    return t if t in ("ARR", "WOW", "STR") else ("weak" if t else "")


def cal_keys(r):
    """Cell keys L0..L5 (spec 6.3), the same strings as CalKeys() in the core. A missing field ends the chain."""
    keys = ["all"]
    tf = r.get("tf", "")
    if not tf:
        return keys
    keys.append("tf=" + tf)
    al = fnum(gv(r, "align_dir"))
    pat = r.get("pattern", "")
    if al is None or not pat:
        return keys
    keys.append(keys[-1] + "|pat=%s|al=%d" % (pat, int(round(al))))
    rt = raja_group(gv(r, "raja_type"))
    ne = gv(r, "nested")
    if not rt or ne == "":
        return keys
    keys.append(keys[-1] + "|rt=%s|ne=%s" % (rt, "1" if fnum(ne, 0) else "0"))
    dg, cz = gv(r, "depth_grade"), gv(r, "curve_bucket")
    if not dg or not cz:
        return keys
    keys.append(keys[-1] + "|dg=%s|cz=%s" % (dg, cz))
    sym = r.get("symbol", "")
    if sym:
        keys.append(keys[-1] + "|sym=" + sym)
    return keys


def created_day(r):
    return (r.get("created", "") or "")[:10].replace(".", "-")


def split_is_oos(rows, oos_rows, split_date):
    if oos_rows is not None:
        return rows, oos_rows, "OOS = the --oos files"
    days = sorted(set(created_day(r) for r in rows if r.get("created")))
    if not days:
        return rows, [], "no creation dates: everything in-sample"
    if split_date:
        cut = split_date.replace(".", "-")
        how = "split at %s (--split-date)" % cut
    else:
        cut = days[int(len(days) * 0.75)] if len(days) > 1 else days[0] + "~"
        how = "split at %s (last 25%% of creation dates = OOS)" % cut
    return [r for r in rows if created_day(r) < cut], [r for r in rows if created_day(r) >= cut], how


def t1(r, stop_mode):
    return touch_trade(r, 1, stop_mode)


def model_trade(r, pfx):
    """t1f_ / t1m_ / t1d_ model trade (or None when it never filled)."""
    if r.get(pfx + "fill") != "1":
        return None
    return {"k": 1, "mfe": fnum(r.get(pfx + "mfe"), 0.0), "res": r.get(pfx + "result", ""), "oppR": 0.0}


def mean(v):
    return sum(v) / len(v) if v else float("nan")


def tstats(trades):
    """Per-trade figures of a list of touch trades: n, hit rates, E per CAL target, best target."""
    n = len(trades)
    out = {"n": n, "hit": {}, "E": {}, "ci": {}}
    for k in TARGETS:
        out["hit"][k] = sum(1 for t in trades if t["mfe"] >= k) / n if n else float("nan")
    for tg in CAL_TARGETS:
        vals = [outcome_r(t, tg) for t in trades]
        m = mean(vals)
        out["E"][tg] = m
        if n >= 2:
            sd = statistics.pstdev(vals)
            out["ci"][tg] = (m - 1.96 * sd / math.sqrt(n), m + 1.96 * sd / math.sqrt(n))
        else:
            out["ci"][tg] = (m, m)
    cand = [(out["E"][tg], tg) for tg in CAL_TARGETS if not math.isnan(out["E"][tg])]
    out["best"] = max(cand, key=lambda x: x[0]) if cand else (float("nan"), None)
    return out


def tcode(tg):
    return "opp" if tg == "opp" else str(tg)


# ----------------------------------------------------------------------------- calibration cells
def mql_round(x):
    """MQL5 MathRound: half away from zero (Python's round() rounds half to even)."""
    return math.floor(x + 0.5) if x >= 0 else -math.floor(-x + 0.5)


def shr(v, w, par, a):
    return (w * v + a * par) / (w + a) if (w + a) > 0 else par


def build_cells(rows, stop_mode, level_max, prior):
    """Raw cell rows (rounded as written to the file) + the shrunk best target / E for each cell."""
    groups = {}
    for r in rows:
        ks = cal_keys(r)
        for lv, k in enumerate(ks[:level_max + 1]):
            groups.setdefault((lv, k), []).append(r)
    raw = {}
    for (lv, k), rs in groups.items():
        trades = [t for t in (t1(r, stop_mode) for r in rs) if t is not None]
        n, nt = len(rs), len(trades)
        st = tstats(trades)
        opp = [t for t in trades if t["oppR"] and t["oppR"] > 0]
        p = [st["hit"][j] if nt else 0.0 for j in TARGETS] + [
            (sum(1 for t in opp if t["mfe"] >= t["oppR"]) / len(opp)) if opp else 0.0]
        e = [st["E"][tg] if nt else 0.0 for tg in CAL_TARGETS]
        mf = statistics.median([t["mfe"] for t in trades]) if trades else 0.0
        raw[(lv, k)] = {"lv": lv, "key": k, "n": n, "touched": round(nt / n, 4) if n else 0.0,
                        "p": [round(x, 4) for x in p], "e": [round(x, 4) for x in e], "mfe": round(mf, 3), "st": st}
    # shrink every cell toward its parent (recursive), as the indicator does
    for lv in range(0, level_max + 1):
        for (l2, k), c in raw.items():
            if l2 != lv:
                continue
            if lv == 0:
                c["s_t"], c["s_p"], c["s_e"], c["s_m"] = c["touched"], list(c["p"]), list(c["e"]), c["mfe"]
            else:
                par = raw.get((lv - 1, parent_key(lv, k)))
                if par is None:
                    c["s_t"], c["s_p"], c["s_e"], c["s_m"] = c["touched"], list(c["p"]), list(c["e"]), c["mfe"]
                else:
                    nt = mql_round(c["n"] * c["touched"])
                    c["s_t"] = shr(c["touched"], c["n"], par["s_t"], prior)
                    c["s_m"] = shr(c["mfe"], nt, par["s_m"], prior)
                    c["s_p"] = [shr(c["p"][j], nt, par["s_p"][j], prior) for j in range(6)]
                    c["s_e"] = [shr(c["e"][j], nt, par["s_e"][j], prior) for j in range(5)]
            j = max(range(5), key=lambda q: (c["s_e"][q], -q))
            c["bestT"], c["bestE"] = CAL_TARGETS[j], c["s_e"][j]
            ci = c["st"]["ci"].get(CAL_TARGETS[j], (float("nan"), float("nan")))
            c["ci"] = (0.0 if math.isnan(ci[0]) else ci[0], 0.0 if math.isnan(ci[1]) else ci[1])
    return raw


def parent_key(lv, k):
    if lv <= 0:
        return None
    if lv == 1:
        return "all"
    if lv == 5:
        return k.rsplit("|", 1)[0]
    return k.rsplit("|", 2)[0]


# ----------------------------------------------------------------------------- calibration file (format = the core's reader)
def load_calib(path):
    """Parse RFX_Calib.csv exactly as CalLoad() in RFX_ZoneCore.mqh does. Returns a table dict."""
    T = {"cells": {}, "W": {}, "B": [], "LR": [], "LRb": None, "CS": [], "META": "", "bad": 0}
    with open(path, encoding="latin-1") as fh:
        for ln in fh:
            ln = ln.strip()
            if not ln:
                continue
            f = ln.split(",")
            if len(f) < 2:
                T["bad"] += 1
                continue
            k0 = f[0]
            if k0 == "ver":
                continue
            if k0 == "META":
                T["META"] = ln
                continue
            if k0 == "W":
                if len(f) < 3 or f[1].lower() not in ("kevin", "seiden", "raja", "baker"):
                    T["bad"] += 1
                    continue
                T["W"][f[1].lower()] = float(f[2])
                continue
            if k0 == "B":
                if len(f) < 7:
                    T["bad"] += 1
                    continue
                T["B"].append((f[1], float(f[2]), float(f[3]), int(f[4]), float(f[5]), float(f[6])))
                continue
            if k0 == "LR":
                if len(f) >= 3 and f[1] == "_intercept":
                    T["LRb"] = float(f[2])
                    continue
                if len(f) < 5 or float(f[4]) <= 0:
                    T["bad"] += 1
                    continue
                T["LR"].append((f[1], float(f[2]), float(f[3]), float(f[4])))
                continue
            if k0 == "CS":
                bb = f[1].split("-")
                if len(f) < 5 or len(bb) != 2:
                    T["bad"] += 1
                    continue
                T["CS"].append((f[1], float(bb[0]), float(bb[1]), int(f[2]), float(f[3]), 0 if f[4].strip().lower() == "opp" else int(f[4])))
                continue
            try:
                ok = len(f) >= 22 and int(k0) > 0
            except ValueError:
                ok = False
            if not ok:
                T["bad"] += 1
                continue
            lv, n = int(f[2]), int(f[4])
            if lv < 0 or lv > 5 or n <= 0 or f[3] == "":
                T["bad"] += 1
                continue
            T["cells"][(lv, f[3])] = {"n": n, "t": float(f[5]), "p": [float(x) for x in f[6:12]], "m": float(f[12]),
                                      "e": [float(x) for x in f[13:18]], "lo": float(f[20]), "hi": float(f[21])}
    return T


def table_from_cells(raw, cs_rows=None, lr=None, lrb=None, b_rows=None):
    T = {"cells": {}, "W": {}, "B": b_rows or [], "LR": lr or [], "LRb": lrb, "CS": cs_rows or [], "META": "", "bad": 0}
    for (lv, k), c in raw.items():
        T["cells"][(lv, k)] = {"n": c["n"], "t": c["touched"], "p": c["p"], "m": c["mfe"], "e": c["e"],
                               "lo": round(c["ci"][0], 4), "hi": round(c["ci"][1], 4)}
    return T


def cal_lookup(T, keys, cons, min_n, a):
    """CalLookup() of RFX_ZoneCore.mqh: walk L0 -> L5 while the cell has n >= min_n, shrinking each level
    toward the one above; else the consensus-bin prior. Returns None when there is nothing."""
    tch = mfe = 0.0
    pp, ee = [0.0] * 6, [0.0] * 5
    last, level = None, -1
    for lv in range(0, 6):
        if lv >= len(keys):
            break
        c = T["cells"].get((lv, keys[lv]))
        if c is None or c["n"] < max(1, min_n):
            break
        n, nt = float(c["n"]), float(mql_round(c["n"] * c["t"]))
        if lv == 0:
            tch, mfe, pp, ee = c["t"], c["m"], list(c["p"]), list(c["e"])
        else:
            tch = shr(c["t"], n, tch, a)
            mfe = shr(c["m"], nt, mfe, a)
            pp = [shr(c["p"][j], nt, pp[j], a) for j in range(6)]
            ee = [shr(c["e"][j], nt, ee[j], a) for j in range(5)]
        last, level = c, lv
    if last is not None:
        tg = [1, 2, 3, 5, 0]
        bj = 0
        for j in range(1, 5):
            if ee[j] > ee[bj]:
                bj = j
        return {"prior": False, "level": level, "key": keys[level], "n": last["n"], "touched": tch, "mfe": mfe, "p": pp,
                "e": ee, "bestT": tg[bj], "bestE": ee[bj], "ci": (last["lo"], last["hi"])}
    if cons is None:
        return None
    for (txt, lo, hi, n, e, bt) in T["CS"]:
        if n >= max(1, min_n) and cons >= lo and (cons < hi or hi >= 100):
            return {"prior": True, "level": -1, "key": txt, "n": n, "bestT": bt, "bestE": e, "p": None}
    return None


def lr_predict(T, r):
    if T.get("LRb") is None:
        return None
    z = T["LRb"]
    for (name, c, m, s) in T["LR"]:
        v = feat(r, name)
        if v is None:
            continue
        z += c * (v - m) / s
    z = max(-30.0, min(30.0, z))
    return 1.0 / (1.0 + math.exp(-z))


# ----------------------------------------------------------------------------- lens weights (spec 6.4)
def lens_lift(rows, stop_mode, col, min_n):
    pas, fai = [], []
    for r in rows:
        t = t1(r, stop_mode)
        if t is None:
            continue
        v = gv(r, col)
        if v == "1":
            pas.append(t)
        elif v == "0":
            fai.append(t)
    sp, sf = tstats(pas), tstats(fai)
    if len(pas) < min_n or len(fai) < min_n:
        return None, sp, sf
    return sp["best"][0] - sf["best"][0], sp, sf


def tune_weights(is_rows, oos_rows, stop_mode, min_n, min_oos):
    res = []
    for name, col in LENSES:
        li, spi, sfi = lens_lift(is_rows, stop_mode, col, min_n)
        lo, spo, sfo = lens_lift(oos_rows, stop_mode, col, min_oos)
        keep = li is not None and lo is not None and (li > 0) == (lo > 0) and li > 0
        if li is None:
            why = "IS: fewer than %d trades on a side" % min_n
        elif lo is None:
            why = "OOS: fewer than %d trades on a side (not validated)" % min_oos
        elif (li > 0) != (lo > 0):
            why = "OOS lift has the other sign: lens %s does not predict on this data" % name
        elif li <= 0:
            why = "no positive lift"
        else:
            why = "kept"
        res.append({"lens": name, "lift_is": li, "lift_oos": lo, "keep": keep, "why": why, "is": (spi, sfi), "oos": (spo, sfo)})
    tot = sum(x["lift_is"] for x in res if x["keep"])
    for x in res:
        x["w"] = round(100.0 * x["lift_is"] / tot, 1) if (x["keep"] and tot > 0) else 0.0
    return res


# ----------------------------------------------------------------------------- logistic p(3R), Newton steps with L2
def solve(A, b):
    n = len(b)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        if abs(M[p][c]) < 1e-12:
            return None
        M[c], M[p] = M[p], M[c]
        for r in range(n):
            if r != c and M[r][c] != 0:
                f = M[r][c] / M[c][c]
                for j in range(c, n + 1):
                    M[r][j] -= f * M[c][j]
    return [M[i][n] / M[i][i] for i in range(n)]


def lr_data(rows, stop_mode, feats):
    X, y = [], []
    for r in rows:
        t = t1(r, stop_mode)
        if t is None or not s1ok(r):
            continue
        vals = [feat(r, f) for f in feats]
        if any(v is None for v in vals):
            continue
        X.append(vals)
        y.append(1.0 if t["mfe"] >= 3 else 0.0)
    return X, y


def fit_lr(is_rows, oos_rows, stop_mode, lr_max, l2=1.0):
    X, y = lr_data(is_rows, stop_mode, LR_FEATURES)
    if len(X) < 50:
        return None, "fewer than 50 IS trades with a snapshot"
    if len(X) > lr_max:
        step = len(X) / float(lr_max)
        idx = [int(i * step) for i in range(lr_max)]
        X, y = [X[i] for i in idx], [y[i] for i in idx]
    nf = len(LR_FEATURES)
    mu = [mean([x[j] for x in X]) for j in range(nf)]
    sd = [statistics.pstdev([x[j] for x in X]) for j in range(nf)]
    use = [j for j in range(nf) if sd[j] > 1e-9]
    Z = [[1.0] + [(x[j] - mu[j]) / sd[j] for j in use] for x in X]
    d = len(use) + 1
    w = [0.0] * d
    for _ in range(30):
        g = [0.0] * d
        H = [[0.0] * d for _ in range(d)]
        for zi, yi in zip(Z, y):
            s = sum(wj * zj for wj, zj in zip(w, zi))
            s = max(-30.0, min(30.0, s))
            p = 1.0 / (1.0 + math.exp(-s))
            q = p * (1 - p)
            e = p - yi
            for a_ in range(d):
                g[a_] += e * zi[a_]
                za = q * zi[a_]
                Ha = H[a_]
                for b_ in range(a_, d):
                    Ha[b_] += za * zi[b_]
        for a_ in range(1, d):
            g[a_] += l2 * w[a_]
            H[a_][a_] += l2
        for a_ in range(d):
            for b_ in range(a_):
                H[a_][b_] = H[b_][a_]
        step = solve(H, g)
        if step is None:
            break
        w = [wj - sj for wj, sj in zip(w, step)]
        if max(abs(sj) for sj in step) < 1e-7:
            break
    model = {"b": w[0], "coef": [(LR_FEATURES[j], w[k + 1], mu[j], sd[j]) for k, j in enumerate(use)],
             "base": mean(y), "n_is": len(y)}
    T = {"LRb": model["b"], "LR": model["coef"]}
    Xo, yo = [], []
    for r in oos_rows:
        t = t1(r, stop_mode)
        if t is None or not s1ok(r):
            continue
        p = lr_predict(T, r)
        if p is None:
            continue
        Xo.append(p)
        yo.append(1.0 if t["mfe"] >= 3 else 0.0)
    model["n_oos"] = len(yo)
    if yo:
        model["brier"] = mean([(p - yy) ** 2 for p, yy in zip(Xo, yo)])
        model["brier_base"] = mean([(model["base"] - yy) ** 2 for yy in yo])
        model["ok"] = model["brier"] < model["brier_base"]
    else:
        model["brier"] = model["brier_base"] = float("nan")
        model["ok"] = False
    return model, ""


# ----------------------------------------------------------------------------- B and CS rows
def bin_rows(rows, stop_mode, cell_min):
    out = []
    trades = [(r, t1(r, stop_mode)) for r in rows]
    trades = [(r, t) for r, t in trades if t is not None]
    for name in BIN_FEATURES:
        vals = [(feat(r, name), t) for r, t in trades]
        vals = [(v, t) for v, t in vals if v is not None]
        if len(vals) < cell_min:
            continue
        xs = sorted(v for v, _ in vals)
        cuts = sorted(set(round(xs[int(len(xs) * q)], 4) for q in (0.2, 0.4, 0.6, 0.8)))
        cuts = [c for c in cuts if c > xs[0]]
        if not cuts:
            continue
        edges = [-1e9] + cuts + [1e9]
        for lo, hi in zip(edges[:-1], edges[1:]):
            sub = [t for v, t in vals if lo <= v < hi]
            if len(sub) < cell_min:
                continue
            st = tstats(sub)
            out.append((name, lo, hi, len(sub), st["hit"][3], st["E"][3]))
    return out


def cons_rows(rows, stop_mode):
    out = []
    for lo, hi in CONS_BINS:
        sub = []
        for r in rows:
            c = fnum(gv(r, "cons"))
            t = t1(r, stop_mode)
            if c is None or t is None:
                continue
            if lo <= c < hi or (hi >= 100 and c >= lo):
                sub.append(t)
        if not sub:
            continue
        st = tstats(sub)
        out.append(("%d-%d" % (lo, hi), float(lo), float(hi), len(sub), st["best"][0], 0 if st["best"][1] == "opp" else st["best"][1]))
    return out


def plain(x):
    """A number without exponent notation (MQL5 StringToDouble reads plain decimals)."""
    return ("%.6f" % x).rstrip("0").rstrip(".") if x != int(x) else "%d" % int(x)


def write_calib(path, raw, stop_mode, cell_min, weights, model, b_rows, cs_rows, meta):
    d = os.path.dirname(os.path.abspath(path))
    if d and not os.path.isdir(d):
        os.makedirs(d)
    n_cells = 0
    with open(path, "w", newline="") as fh:
        fh.write("ver,stop_model,level,key,n,touched,p1,p2,p3,p4,p5,p_opp,mfe_med,E1,E2,E3,E5,Eopp,bestT,bestE,ci_lo,ci_hi\n")
        for (lv, k) in sorted(raw.keys(), key=lambda x: (x[0], -raw[x]["n"], x[1])):
            c = raw[(lv, k)]
            if c["n"] < cell_min:
                continue
            fh.write("2,%s,%d,%s,%d,%.4f,%s,%.3f,%s,%s,%.4f,%.4f,%.4f\n" % (
                stop_mode, lv, k, c["n"], c["touched"], ",".join("%.4f" % x for x in c["p"]), c["mfe"],
                ",".join("%.4f" % x for x in c["e"]), tcode(c["bestT"]), c["bestE"], c["ci"][0], c["ci"][1]))
            n_cells += 1
        for x in weights or []:
            if x["w"] > 0:
                fh.write("W,%s,%.1f\n" % (x["lens"], x["w"]))
        if model and model.get("ok"):
            fh.write("LR,_intercept,%.6f\n" % model["b"])
            for (f, c, m, s) in model["coef"]:
                fh.write("LR,%s,%.6f,%.6f,%.6f\n" % (f, c, m, s))
        for (f, lo, hi, n, p3, e3) in b_rows:
            fh.write("B,%s,%s,%s,%d,%.4f,%.4f\n" % (f, plain(lo), plain(hi), n, p3, e3))
        for (txt, lo, hi, n, e, bt) in cs_rows:
            if n >= cell_min:
                fh.write("CS,%s,%d,%.4f,%s\n" % (txt, n, e, "opp" if bt == 0 else bt))
        fh.write(meta + "\n")
    return n_cells


def write_pine(path, raw, cell_min):
    cells = sorted([c for (lv, k), c in raw.items() if lv <= 3 and c["n"] >= cell_min], key=lambda c: -c["n"])[:300]
    L = ["// RamanFX ZoneVision calibration cells (analyze.py --pine): top %d cells, levels L0-L3" % len(cells),
         "// key format: all | tf=H1 | tf=H1|pat=DBR|al=1 | ...|rt=ARR|ne=1 (same as RFX_Calib.csv)",
         "var string[] rfxCalKey = array.from(%s)" % ", ".join('"%s"' % c["key"] for c in cells),
         "var int[] rfxCalN = array.from(%s)" % ", ".join(str(c["n"]) for c in cells),
         "var float[] rfxCalP3 = array.from(%s)" % ", ".join("%.4f" % c["s_p"][2] for c in cells),
         "var float[] rfxCalBestE = array.from(%s)" % ", ".join("%.4f" % c["bestE"] for c in cells),
         "var int[] rfxCalBestT = array.from(%s)" % ", ".join(str(0 if c["bestT"] == "opp" else c["bestT"]) for c in cells)]
    with open(path, "w") as fh:
        fh.write("\n".join(L) + "\n")
    return len(cells)


# ----------------------------------------------------------------------------- v2 report
def trade_row(label, trades):
    st = tstats(trades)
    b = st["best"]
    return [label, st["n"], pct(st["hit"][1]), pct(st["hit"][3]), pct(st["hit"][5])] + [num(st["E"][tg], 3) for tg in CAL_TARGETS] + [
        "%s (%s)" % (tcode(b[1]), num(b[0], 3)) if b[1] is not None else "-"]


TRADE_HEAD = ["group", "trades", "1R%", "3R%", "5R%", "E 1R", "E 2R", "E 3R", "E 5R", "E opp", "best"]


def group_trades(rows, stop_mode, keyf):
    g = OrderedDict()
    for r in rows:
        t = t1(r, stop_mode)
        if t is None:
            continue
        k = keyf(r)
        if k is None:
            continue
        g.setdefault(k, []).append(t)
    return g


def reliability(T, oos_rows, stop_mode, min_n, prior, which):
    pts = []
    for r in oos_rows:
        t = t1(r, stop_mode)
        if t is None:
            continue
        if which == "cell":
            c = cal_lookup(T, cal_keys(r), fnum(gv(r, "cons")), min_n, prior)
            if c is None or c["prior"]:
                continue
            p = c["p"][2]
        else:
            p = lr_predict(T, r) if s1ok(r) else None
            if p is None:
                continue
        pts.append((p, 1.0 if t["mfe"] >= 3 else 0.0))
    pts.sort()
    rows_out, ok = [], True
    if len(pts) < 10:
        return rows_out, None
    for dcl in range(10):
        part = pts[int(len(pts) * dcl / 10.0): int(len(pts) * (dcl + 1) / 10.0)]
        if not part:
            continue
        pr, ob = mean([p for p, _ in part]), mean([y for _, y in part])
        good = abs(pr - ob) <= 0.07
        ok = ok and good
        rows_out.append([dcl + 1, len(part), pct(pr), pct(ob), "%+.0f pp" % (100 * (ob - pr)), "ok" if good else "OFF"])
    return rows_out, ok


def build_v2_report(is_rows, oos_rows, how, stop_mode, args, raw, T_is, weights, model, n_cells):
    L = ["", "## 7. v2: lenses, consensus, entry models and calibration", ""]
    L.append("- In-sample (IS): **%d** zones, out-of-sample (OOS): **%d** zones; %s." % (len(is_rows), len(oos_rows), how))
    L.append("- Decision values come from the touch-1 snapshot (`s1_*`, on the touch candle's close) when it was taken, "
             "else from the creation columns. E is **per touch-1 trade** in R (stop model: %s)." % stop_mode)
    L.append("- Calibration: shrinkage a = %g, cells written with n >= %d, the indicator uses n >= %d (InpCalMinN)." % (
        args.prior, args.cell_min, args.cal_min_n))
    L.append("")
    for tag, rows in (("IS", is_rows), ("OOS", oos_rows)):
        if not rows:
            continue
        L.append("### 7.1 Lens performance, pass vs fail (%s)" % tag)
        L.append("")
        out = []
        for name, col in LENSES:
            for val, lab in (("1", "pass"), ("0", "fail")):
                g = [t for t in (t1(r, stop_mode) for r in rows if gv(r, col) == val) if t is not None]
                out.append(trade_row("%s %s" % (name, lab), g))
        L.append(table(TRADE_HEAD, out))
        L.append("")
    if is_rows:
        L.append("Per TF (IS, best E pass / fail):")
        L.append("")
        out = []
        for tf in sorted(set(r.get("tf") for r in is_rows), key=tf_rank):
            sub = [r for r in is_rows if r.get("tf") == tf]
            cells = [tf]
            for name, col in LENSES:
                p = tstats([t for t in (t1(r, stop_mode) for r in sub if gv(r, col) == "1") if t is not None])
                f = tstats([t for t in (t1(r, stop_mode) for r in sub if gv(r, col) == "0") if t is not None])
                cells.append("%s (%d) / %s (%d)" % (num(p["best"][0], 2), p["n"], num(f["best"][0], 2), f["n"]))
            out.append(cells)
        L.append(table(["tf"] + [n for n, _ in LENSES], out))
        L.append("")
    L.append("### 7.2 Consensus bins")
    L.append("")
    mono = None
    for tag, rows in (("IS", is_rows), ("OOS", oos_rows)):
        if not rows:
            continue
        out, es = [], []
        for lo, hi in CONS_BINS:
            g = [t for t in (t1(r, stop_mode) for r in rows if fnum(gv(r, "cons")) is not None and (
                lo <= fnum(gv(r, "cons")) < hi or (hi >= 100 and fnum(gv(r, "cons")) >= lo))) if t is not None]
            out.append(trade_row("%s %d-%d" % (tag, lo, hi), g))
            st = tstats(g)
            if st["n"] >= args.min_n:
                es.append(st["best"][0])
        L.append(table(TRADE_HEAD, out))
        L.append("")
        if tag == "OOS":
            inv = sum(1 for a_, b_ in zip(es[:-1], es[1:]) if b_ < a_)
            mono = inv <= 1 if len(es) >= 2 else None
            L.append("OOS monotonicity: %d inversion(s) over %d bins with n >= %d -> %s" % (
                inv, len(es), args.min_n, "ok" if mono else ("not enough bins" if mono is None else "FAIL")))
            L.append("")
    L.append("### 7.3 Verdict A+ / A / B / C / X")
    L.append("")
    verdict_ok = {}
    for tag, rows in (("IS", is_rows), ("OOS", oos_rows)):
        if not rows:
            continue
        g = group_trades(rows, stop_mode, lambda r: gv(r, "verdict", "v2verdict") or None)
        out = [trade_row("%s %s" % (tag, k), g[k]) for k in ("A+", "A", "B", "C", "X") if k in g]
        L.append(table(TRADE_HEAD, out))
        L.append("")
        if tag == "OOS":
            for sym in sorted(set(r.get("symbol") for r in rows)):
                sub = [t for t in (t1(r, stop_mode) for r in rows if r.get("symbol") == sym and gv(r, "verdict", "v2verdict") in ("A+", "A")) if t is not None]
                st = tstats(sub)
                b = st["best"]
                verdict_ok[sym] = (st["n"], b[0], st["ci"].get(b[1], (float("nan"),))[0] if b[1] is not None else float("nan"))
    L.append("### 7.4 Conflict cases (IS)")
    L.append("")
    conf = [("Seiden pass & Kevin fail (shallow 2nd touches)", lambda r: gv(r, "pass_s") == "1" and gv(r, "pass_k") == "0"),
            ("Kevin pass & Seiden fail", lambda r: gv(r, "pass_k") == "1" and gv(r, "pass_s") == "0"),
            ("Raja pass & Kevin fail", lambda r: gv(r, "pass_r") == "1" and gv(r, "pass_k") == "0"),
            ("Kevin pass & Raja fail", lambda r: gv(r, "pass_k") == "1" and gv(r, "pass_r") == "0"),
            ("Baker pass & Kevin fail", lambda r: gv(r, "pass_b") == "1" and gv(r, "pass_k") == "0"),
            ("all four pass", lambda r: gv(r, "n_pass") == "4"),
            ("none pass", lambda r: gv(r, "n_pass") == "0")]
    L.append(table(TRADE_HEAD, [trade_row(lab, [t for t in (t1(r, stop_mode) for r in is_rows if f(r)) if t is not None]) for lab, f in conf]))
    L.append("")
    L.append("### 7.5 Entry models for touch 1 (IS)")
    L.append("")
    L.append("Each model is measured in its own R (entry to the same stop beyond the distal, + spread). Front = %s, "
             "mid = 50%% into the zone, deep = Baker (25%% of the height inside, from the distal)." % "InpZ3Front x height before the proximal")
    L.append("")
    head = ["model", "zones", "fills", "fill%", "E/fill 1R", "E/fill 2R", "E/fill 3R", "E/fill 5R", "E/zone 2R", "E/zone 3R"]
    out = []
    nz = len(is_rows)
    for lab, pf in (("proximal (v1)", None), ("front", "t1f_"), ("mid 50%", "t1m_"), ("deep (Baker)", "t1d_")):
        tr = [t1(r, stop_mode) if pf is None else model_trade(r, pf) for r in is_rows]
        tr = [t for t in tr if t is not None]
        st = tstats(tr)
        e2 = sum(outcome_r(t, 2) for t in tr) / nz if nz else float("nan")
        e3 = sum(outcome_r(t, 3) for t in tr) / nz if nz else float("nan")
        out.append([lab, nz, len(tr), pct(len(tr) / nz if nz else float("nan"))] + [num(st["E"][k], 3) for k in (1, 2, 3, 5)] + [num(e2, 3), num(e3, 3)])
    L.append(table(head, out))
    L.append("")
    L.append("### 7.6 Direction quality (IS)")
    L.append("")
    qn = {"2": "FULL", "1": "REDUCED", "0": "WAIT"}
    an = {"1": "with", "-1": "against", "0": "no side"}
    g = group_trades(is_rows, stop_mode, lambda r: ("%s %s" % (qn.get(gv(r, "dirq"), "?"), an.get(gv(r, "align_dir"), "?"))) if gv(r, "dirq") != "" else None)
    L.append(table(TRADE_HEAD, [trade_row(k, g[k]) for k in sorted(g.keys())]))
    L.append("")
    L.append("### 7.7 Reliability on OOS: predicted p(3R) deciles vs observed")
    L.append("")
    rel_ok = None
    if oos_rows and T_is is not None:
        for which, lab in (("cell", "calibration cells (IS table, the indicator's lookup)"), ("lr", "logistic model")):
            if which == "lr" and not (model and model.get("coef")):
                continue
            tab, ok = reliability(T_is if which == "cell" else {"LRb": model["b"], "LR": model["coef"]}, oos_rows, stop_mode,
                                  args.cal_min_n, args.prior, which)
            L.append("**%s**" % lab)
            L.append("")
            if tab:
                L.append(table(["decile", "trades", "predicted", "observed", "diff", "+-7 pp"], tab))
                L.append("")
                if which == "cell":
                    rel_ok = ok
            else:
                L.append("_fewer than 10 OOS trades with a prediction_")
                L.append("")
    else:
        L.append("_no OOS data_")
        L.append("")
    L.append("### 7.8 v1 removal rule vs Raja removal")
    L.append("")
    out = []
    for tag, rows in (("IS", is_rows), ("OOS", oos_rows)):
        if not rows:
            continue
        b1 = [r for r in rows if r.get("broken") == "1"]
        br = [r for r in rows if r.get("broken_raja") == "1"]
        both = [r for r in b1 if r.get("broken_raja") == "1"]
        out.append([tag, len(rows), len(b1), len(br), pct(len(both) / len(b1) if b1 else float("nan"))])
    L.append(table(["data", "zones", "v1 broken (close or normal wick)", "Raja broken (2 closes, 2nd big)", "v1 breaks Raja-confirmed"], out))
    L.append("")
    L.append("### 7.9 Fitted lens weights (IS lift, kept if the OOS lift has the same sign)")
    L.append("")
    if weights:
        L.append(table(["lens", "lift IS (best E pass - fail)", "lift OOS", "weight", "note"],
                       [[x["lens"], num(x["lift_is"], 3) if x["lift_is"] is not None else "-",
                         num(x["lift_oos"], 3) if x["lift_oos"] is not None else "-", "%.1f" % x["w"], x["why"]] for x in weights]))
        if not any(x["w"] > 0 for x in weights):
            L.append("")
            L.append("_No lens kept: no W rows written; the indicator keeps InpWKevin ... InpWBaker even with InpUseCalWeights._")
    L.append("")
    L.append("### 7.10 Logistic p(3R)")
    L.append("")
    if model:
        L.append("IS trades %d (base rate %s), OOS trades %d: Brier %s vs base rate %s -> %s." % (
            model["n_is"], pct(model["base"]), model["n_oos"], num(model["brier"], 4), num(model["brier_base"], 4),
            "written (beats the base rate)" if model["ok"] else "NOT written"))
        L.append("")
        L.append(table(["feature", "coef (standardised)", "mean", "sd"], [[f, num(c, 3), num(m, 3), num(s, 3)] for f, c, m, s in model["coef"]]))
    else:
        L.append("_not fitted: %s_" % (args._lr_why or "no data"))
    L.append("")
    L.append("### 7.11 Acceptance (spec 6.5 step 8)")
    L.append("")
    core = [s_ for s_ in verdict_ok if any(c in s_.upper() for c in ("XAUUSD", "EURUSD", "GBPUSD", "USDJPY"))]
    good = [s_ for s_ in core if verdict_ok[s_][0] >= args.min_n and verdict_ok[s_][1] > 0 and verdict_ok[s_][2] > 0]
    L.append("- OOS reliability (cells), each decile within +-7 pp: **%s**" % ("-" if rel_ok is None else ("PASS" if rel_ok else "FAIL")))
    L.append("- Consensus bins monotone in E on OOS (<= 1 inversion): **%s**" % ("-" if mono is None else ("PASS" if mono else "FAIL")))
    L.append("- A+ / A: OOS best E > 0 with CI_lo > 0 on >= 2 of the 4 core symbols: **%s** (%s)" % (
        "PASS" if len(good) >= 2 else "FAIL", ", ".join("%s n %d E %s lo %s" % (s_, verdict_ok[s_][0], num(verdict_ok[s_][1], 2), num(verdict_ok[s_][2], 2))
                                                      for s_ in sorted(verdict_ok)) or "no OOS data"))
    if n_cells is not None:
        L.append("- Calibration file: %d cells written to `%s`." % (n_cells, args.calibrate))
    L.append("")
    return "\n".join(L)


def run_v2(rows, oos_rows, args, files):
    """IS / OOS split, calibration table, lens weights, model, v2 report. Returns the report text."""
    is_rows, oos, how = split_is_oos(rows, oos_rows, args.split_date)
    cells_src = is_rows if args.cells_from == "is" else is_rows + oos
    raw = build_cells(cells_src, args.stop, args.key_level_max, args.prior)
    v2 = has_v2(rows)
    weights = tune_weights(is_rows, oos, args.stop, args.min_lens_n, max(30, args.min_lens_n // 3)) if v2 else []
    model, why = (fit_lr(is_rows, oos, args.stop, args.lr_max) if v2 else (None, "v1 file (no snapshot columns)"))
    args._lr_why = why
    b_rows = bin_rows(is_rows, args.stop, args.cell_min) if v2 else []
    cs = cons_rows(is_rows, args.stop) if v2 else []
    T_is = table_from_cells(raw if args.cells_from == "is" else build_cells(is_rows, args.stop, args.key_level_max, args.prior), cs)
    n_cells = None
    if args.calibrate:
        syms = sorted(set(r.get("symbol", "") for r in cells_src))
        days = sorted(created_day(r) for r in cells_src if r.get("created"))
        meta = "META,generated,%s,symbols,%s,from,%s,to,%s,stop,%s,prior,%g,is_zones,%d,oos_zones,%d" % (
            __import__("datetime").date.today().isoformat(), ";".join(syms), days[0] if days else "", days[-1] if days else "",
            args.stop, args.prior, len(is_rows), len(oos))
        n_cells = write_calib(args.calibrate, raw, args.stop, args.cell_min, weights, model, b_rows, cs, meta)
        print("calibration written to %s (%d cells)" % (args.calibrate, n_cells), file=sys.stderr)
    if args.pine:
        k = write_pine(args.pine, raw, args.cell_min)
        print("pine arrays written to %s (%d cells)" % (args.pine, k), file=sys.stderr)
    if not v2:
        return "\n\n## 7. v2\n\n_The input has no v2 columns (ZoneVision 1.99 file, or InpResearchDNA = false): only the L0 / L1 " \
               "cells could be built.%s_\n" % (" %d cells written to `%s`." % (n_cells, args.calibrate) if n_cells is not None else "")
    return build_v2_report(is_rows, oos, how, args.stop, args, raw, T_is, weights, model, n_cells)


def main(argv=None):
    ap = argparse.ArgumentParser(description="Analyse RamanFX ZoneVision zone-research CSVs.")
    ap.add_argument("inputs", nargs="+", help="CSV files, globs or directories")
    ap.add_argument("--out", default=DEFAULT_OUT, help="markdown report path (default docs/Zone_Research_Report.md)")
    ap.add_argument("--stop", choices=["wick", "close"], default="wick", help="stop model for touch 1 (default wick)")
    ap.add_argument("--min-n", type=int, default=30, help="minimum samples for a recommendation (default 30)")
    ap.add_argument("--detector", default="all", help="ZV, ALT or all (default)")
    ap.add_argument("--only-drawn", action="store_true", help="ZV: only zones ZoneVision would draw (would_draw=1)")
    ap.add_argument("--calibrate", default=None, help="v2: write the calibration table (RFX_Calib.csv) for the indicator")
    ap.add_argument("--oos", nargs="+", default=None, help="v2: out-of-sample files / dirs (default: last 25%% of creation dates)")
    ap.add_argument("--split-date", default=None, help="v2: IS / OOS split by creation date, e.g. 2024-01-01")
    ap.add_argument("--key-level-max", type=int, default=5, help="v2: deepest cell level written (0-5, default 5)")
    ap.add_argument("--prior", type=float, default=20.0, help="v2: shrinkage strength a toward the parent cell (default 20)")
    ap.add_argument("--cell-min", type=int, default=10, help="v2: smallest cell written to the file (default 10 zones)")
    ap.add_argument("--cal-min-n", type=int, default=30, help="v2: the indicator's InpCalMinN, for the reliability table (default 30)")
    ap.add_argument("--min-lens-n", type=int, default=100, help="v2: trades needed on each side for a lens weight (default 100)")
    ap.add_argument("--lr-max", type=int, default=10000, help="v2: most IS trades used to fit the logistic model (default 10000)")
    ap.add_argument("--cells-from", choices=["is", "all"], default="is", help="v2: cells from IS only (default) or IS + OOS")
    ap.add_argument("--decision", choices=["creation", "touch"], default="creation",
                    help="v2 decision values: creation columns (default, no look-ahead) or the s1_ touch snapshot (closes after the fill: look-ahead, kept only for comparison)")
    ap.add_argument("--pine", default=None, help="v2: also write a Pine array snippet (top 300 cells, L0-L3)")
    a = ap.parse_args(argv)
    global USE_S1
    USE_S1 = a.decision == "touch"
    files = expand_inputs(a.inputs)
    if not files:
        print("no input files", file=sys.stderr)
        return 2
    rows = load_rows(files)
    oos_rows = None
    if a.oos:
        oos_files = expand_inputs(a.oos)
        oos_rows = load_rows(oos_files)
    def keep(rs):
        if a.detector.upper() != "ALL":
            rs = [r for r in rs if r.get("detector", "").upper() == a.detector.upper()]
        if a.only_drawn:
            rs = [r for r in rs if r.get("would_draw") == "1"]
        return rs
    rows = keep(rows)
    if oos_rows is not None:
        oos_rows = keep(oos_rows)
    if not rows:
        print("no zones in the input", file=sys.stderr)
        return 1
    rep = build_report(rows, files, a.stop, a.min_n, a.detector, a.only_drawn)
    if has_v2(rows) or a.calibrate or a.oos or a.split_date or a.pine:
        rep += run_v2(rows, oos_rows, a, files)
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
