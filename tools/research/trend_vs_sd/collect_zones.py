"""Variant A, step 1: the scanner's zone entries, collected without look-ahead.

    python tools/research/trend_vs_sd/collect_zones.py --out zones.json [--syms EURUSD,...] [--from 2008-09-01]
                                                      [--h4 standin|real] [--jobs 4]

At every D1 close the SAME functions the live FX scanner runs (fxcore.analyse + fxcore.zone_rules + fxcore.plan, zones.py
underneath) are called on the bars that were closed at that moment (D1 / W1 / MN, capped like the scanner). Every fresh
D1 or W1 zone whose proximal price is within 1x the zone height (the scanner's 'near entry' rule: this is when the
scanner shows a BUY / SELL) is recorded with the result of EVERY scanner rule and the scanner's plan (limit at the
proximal, stop = distal + the stop-rule buffer, target = 7 pips before the nearest opposite zone, else the 250%
projection). sim.py then picks the tier of rules to trade. A zone exists only after its stay-away candle closed (zones.detect
on the closed bars); a record is made on the first close the rules pass, so nothing uses a later bar.

H4: the scanner also hands fxcore the H4 bars (price checks for the HTF 'touched' chain and the forming bar). The
bar files only hold two years of H4, so by default a stand-in is used (the D1 bar as one H4 bar); --h4 real uses the
H4 file from its first bar on (used to check that the stand-in changes nothing for D1 / W1 entries).
"""
from __future__ import annotations

import argparse
import bisect
import json
import multiprocessing as mp
import os
import sys
import time
from typing import Dict, List

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import tvsdlib as L  # noqa: E402

import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
from zones import Bar  # noqa: E402


def run_symbol(job) -> Dict:
    sym, start, h4mode, stop = job
    t0 = time.time()
    inst = L.inst_of(sym)
    cost = L.COST[sym]
    cut = lambda rows: [r for r in rows if r[0][:10] < stop]       # --to: drop every bar from this date on (look-ahead test)
    d1r = L.clean_d1(cut(L.load_rows(sym, 'D1')))
    d1 = [Bar(r[0], r[1], r[2], r[3], r[4]) for r in d1r]
    w1 = [Bar(*r[:5]) for r in cut(L.load_rows(sym, 'W1'))]
    mn = [Bar(*r[:5]) for r in cut(L.load_rows(sym, 'MN'))]
    if h4mode == 'real':
        h4_all = [Bar(*r[:5]) for r in cut(L.load_rows(sym, 'H4'))]
        h4_ends = [L.bar_end(b.d, 'H4') for b in h4_all]
    else:                                        # the D1 bar as the last H4 bar of its day
        h4_all = [Bar(b.d[:10] + 'T20:00', b.o, b.h, b.l, b.c) for b in d1]
        h4_ends = [L.bar_end(b.d, 'D1') for b in d1]
    ends = {'D1': [L.bar_end(b.d, 'D1') for b in d1], 'W1': [L.bar_end(b.d, 'W1') for b in w1],
            'MN': [L.bar_end(b.d, 'MN') for b in mn]}
    recs: List[Dict] = []
    seen_first: Dict[str, int] = {}
    n_eval = 0
    for k, b in enumerate(d1):
        if b.d[:10] < start:
            continue
        t = ends['D1'][k]
        h4k = bisect.bisect_right(h4_ends, t)
        if h4k < 60:
            continue
        bars = {'D1': d1[:k + 1], 'W1': w1[:bisect.bisect_right(ends['W1'], t)], 'MN': mn[:bisect.bisect_right(ends['MN'], t)],
                'H4': h4_all[:h4k]}
        try:
            an = F.analyse(inst, bars, cost)
        except Exception as e:  # noqa: BLE001
            recs.append({'err': f'{b.d} {type(e).__name__}: {e}'[:200]})
            continue
        n_eval += 1
        for tf in ('D1', 'W1'):
            r = an.rows[tf]
            if not r.ok:
                continue
            for z in r.zones:
                x = an.dna.get(z.zid)
                if x is None:
                    continue
                gap = z.dir * (an.price - z.prox)
                if not (0 < gap <= C.APPROACH_H * z.h):
                    continue
                rules = F.zone_rules(an, z, x)
                fails = sorted({q.short for q in rules if q.status == F.FAIL})
                pl = F.plan(an, z, x)
                if pl['target'] is None or pl['entry'] is None:
                    tgt = None
                else:
                    tgt = pl['target'] - (cost if z.dir < 0 else 0.0)
                recs.append({
                    'sym': sym, 't': b.d[:10], 'tf': tf, 'd': z.dir, 'zid': z.zid, 'code': x.code, 'leg': round(z.leg_ratio, 2),
                    'base_n': z.base_n, 'h': z.h, 'prox': z.prox, 'dist': z.dist, 'fails': fails,
                    'entry': z.prox, 'stop': pl['stop'] - (cost if z.dir < 0 else 0.0), 'target': tgt, 'tkind': pl['target_kind'],
                    'rr': pl['rr'], 'score': F.score(x, F.tests(an, z, x), z.dir), 'tests': F.tests(an, z, x),
                    'price': an.price, 'made': z.made})
    return {'sym': sym, 'recs': recs, 'evals': n_eval, 'secs': round(time.time() - t0, 1)}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    ap.add_argument('--syms', default=','.join(L.SYMS))
    ap.add_argument('--from', dest='start', default='2008-09-01')
    ap.add_argument('--h4', default='real', choices=('standin', 'real'))
    ap.add_argument('--jobs', type=int, default=4)
    ap.add_argument('--to', default='9999', help='ignore every bar from this date on (look-ahead test: records must not change)')
    a = ap.parse_args(argv)
    syms = [s for s in a.syms.split(',') if s]
    jobs = [(s, a.start, a.h4, a.to) for s in syms]
    with mp.Pool(min(a.jobs, len(jobs))) as pool:
        res = []
        for r in pool.imap_unordered(run_symbol, jobs):
            print(f"{r['sym']:10s} {r['evals']:5d} evals {len(r['recs']):6d} records {r['secs']:6.1f}s", flush=True)
            res.append(r)
    res.sort(key=lambda r: r['sym'])
    recs = [x for r in res for x in r['recs']]
    errs = [x for x in recs if 'err' in x]
    recs = [x for x in recs if 'err' not in x]
    with open(a.out, 'w') as f:
        json.dump({'start': a.start, 'h4': a.h4, 'errors': errs[:20], 'n_errors': len(errs), 'recs': recs}, f, separators=(',', ':'))
    print(f'{len(recs)} records, {len(errs)} errors -> {a.out}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
