"""Look-ahead tests (docs/research/TREND_VS_SD.md, "Checks"): cut the data at a date and show that nothing before the cut changes.

    python tools/research/trend_vs_sd/validate.py --zones zones.json
  1. B / A / C: simulate on bars cut at CUT; every trade that exited before CUT, and the equity curve up to CUT, must equal the
     full-data run (no indicator, order or fill uses a later bar).
  2. Zone records: re-run the zone collection with every bar from CUT on removed (collect_zones.py --to) for three symbols; every record
     dated before the cut must be identical to the full-data record.
"""
from __future__ import annotations

import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import collect_zones as CZ  # noqa: E402
import sim as S  # noqa: E402
import tvsdlib as L  # noqa: E402

CUT = '2019-12-15'


def same(a, b, keys=('sym', 'd', 'in', 'out', 'entry', 'stop', 'exit', 'R', 'why')):
    return len(a) == len(b) and all(all(abs(x[k] - y[k]) < 1e-9 if isinstance(x[k], float) else x[k] == y[k] for k in keys) for x, y in zip(a, b))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--zones', required=True)
    ap.add_argument('--cut', default=CUT)
    a = ap.parse_args(argv)
    recs = json.load(open(a.zones))['recs']
    full = {s: S.build_mkt(s) for s in L.SYMS}
    cut = {s: S.build_mkt(s, a.cut) for s in L.SYMS}
    ok = True
    for kind in ('A', 'B', 'C'):
        orders = S.orders_from_records([r for r in recs], 'L0') if kind != 'B' else None
        orders_cut = [o for o in orders if o['sig'] < a.cut] if orders else None
        f = S.simulate(kind, full, orders)
        c = S.simulate(kind, cut, orders_cut)
        tf = sorted([t for t in f['trades'] if t['out'] < a.cut], key=lambda t: (t['out'], t['sym'], t['in']))
        tc = sorted([t for t in c['trades'] if t['out'] < a.cut], key=lambda t: (t['out'], t['sym'], t['in']))
        eq = all(abs(f['equity'][d] - c['equity'][d]) < 1e-9 for d in c['equity'])
        res = same(tf, tc) and eq
        ok &= res
        print(f'{kind}: {len(tf)} trades exited before {a.cut}: identical with future bars removed = {same(tf, tc)}; equity identical = {eq}')
    key = lambda r: (r['sym'], r['t'], r['zid'])  # noqa: E731
    for sym in ('EURUSD', 'XAUUSD', 'US30'):
        cutrecs = CZ.run_symbol((sym, '2008-09-01', 'real', a.cut))['recs']
        mine = {key(r): r for r in recs if r['sym'] == sym and r['t'] < a.cut}
        theirs = {key(r): r for r in cutrecs}
        res = mine == theirs
        ok &= res
        print(f'zones {sym}: {len(mine)} records before {a.cut}; identical with the later bars removed = {res}')
    print('PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
