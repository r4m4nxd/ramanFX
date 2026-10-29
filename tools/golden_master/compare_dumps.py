#!/usr/bin/env python3
"""ZoneVision v2 golden master (M0): compare object dumps.

Usage:
  python3 compare_dumps.py BASELINE_DIR CANDIDATE_DIR      # every RFX_Dump_*.csv present in both
  python3 compare_dumps.py baseline.csv candidate.csv

A dump is written by RamanFX_ZoneVision with InpDumpObjects = true (and
InpDumpAt = the snapshot bar time) to Terminal\\Common\\Files\\RFX_Dump_<sym>_<tf>.csv.
Only v1 prefixes (RFXV_, RFXN_, RFXS_, RFXP2_) are in that file; v2 objects go to
RFX_DumpV2_*.csv and are not compared. Pass = byte-identical files.
Exit code 0 = all identical, 1 = a difference, 2 = usage / missing files.
Standard library only.
"""
import os
import sys


def rows(path):
    with open(path, "rb") as f:
        data = f.read()
    lines = data.decode("latin-1").splitlines()
    out = {}
    for ln in lines[2:]:
        name = ln.split("\t", 1)[0]
        out[name] = ln
    return data, lines[:2], out


def compare(a, b):
    da, ha, ra = rows(a)
    db, hb, rb = rows(b)
    if da == db:
        print("IDENTICAL  %s" % os.path.basename(b))
        return True
    print("DIFFERENT  %s" % os.path.basename(b))
    if ha != hb:
        print("  header: %r -> %r" % (ha[:1], hb[:1]))
    only_a = sorted(set(ra) - set(rb))
    only_b = sorted(set(rb) - set(ra))
    for n in only_a[:20]:
        print("  - missing in candidate: %s" % n)
    for n in only_b[:20]:
        print("  + extra in candidate:   %s" % n)
    cols = ha[1].split("\t") if len(ha) > 1 else []
    shown = 0
    for n in sorted(set(ra) & set(rb)):
        if ra[n] == rb[n]:
            continue
        fa, fb = ra[n].split("\t"), rb[n].split("\t")
        for k in range(max(len(fa), len(fb))):
            va = fa[k] if k < len(fa) else ""
            vb = fb[k] if k < len(fb) else ""
            if va != vb:
                col = cols[k] if k < len(cols) else str(k)
                print("  ~ %s.%s: %r -> %r" % (n, col, va[:80], vb[:80]))
        shown += 1
        if shown >= 30:
            print("  ... (more differences)")
            break
    return False


def main(argv):
    if len(argv) != 3:
        print(__doc__)
        return 2
    a, b = argv[1], argv[2]
    pairs = []
    if os.path.isdir(a) and os.path.isdir(b):
        for fn in sorted(os.listdir(a)):
            if fn.startswith("RFX_Dump_") and fn.endswith(".csv"):
                if os.path.exists(os.path.join(b, fn)):
                    pairs.append((os.path.join(a, fn), os.path.join(b, fn)))
                else:
                    print("MISSING    %s (not in candidate dir)" % fn)
    elif os.path.isfile(a) and os.path.isfile(b):
        pairs.append((a, b))
    if not pairs:
        print("no dump pairs found")
        return 2
    ok = all([compare(x, y) for x, y in pairs])
    print("PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
