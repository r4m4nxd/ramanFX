"""Run the whole comparison (A supply / demand alone, B trend following alone, C trend filter + supply / demand entry),
write results.json, trades.csv and the two charts. docs/research/TREND_VS_SD.md is then written by make_doc.py from results.json.

    python tools/research/trend_vs_sd/collect_zones.py --out /tmp/zones.json          # variant A's zone records (4 min, 4 cores)
    python tools/research/trend_vs_sd/run_all.py --zones /tmp/zones.json --out docs/research/trend_vs_sd [--png-dir DIR]
    python tools/research/trend_vs_sd/make_doc.py --results docs/research/trend_vs_sd/results.json --out docs/research/TREND_VS_SD.md
"""
from __future__ import annotations

import argparse
import collections
import csv
import json
import os
import sys
import time
from typing import Dict, List

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np  # noqa: E402
import sim as S  # noqa: E402
import stats as ST  # noqa: E402
import tvsdlib as L  # noqa: E402

RISKS = (0.005, 0.02, 0.05)
MAIN = '2009-now'


def clean(x):
    if isinstance(x, dict):
        return {k: clean(v) for k, v in x.items()}
    if isinstance(x, (list, tuple)):
        return [clean(v) for v in x]
    if isinstance(x, (np.floating, float)):
        v = float(x)
        return None if v != v else ('inf' if v == float('inf') else v)
    if isinstance(x, np.integer):
        return int(x)
    if isinstance(x, np.bool_):
        return bool(x)
    return x


def pack(res: Dict) -> Dict:
    tr = res['trades']
    out = {'skipped': res['skipped'], 'open': res['open'], 'periods': {}, 'exit_reasons': dict(collections.Counter(t['why'] for t in tr)),
           'lev_median': float(np.median([t['lev'] for t in tr])) if tr else None, 'lev_max': float(max(t['lev'] for t in tr)) if tr else None}
    for per in ST.PERIODS:
        d = ST.trade_stats(tr, per)
        d.update(ST.equity_stats(res['equity'], per))
        d['ci'] = ST.cluster_ci(tr, per)
        out['periods'][per] = d
    out['yearly'] = ST.yearly(res['equity'], tr)
    out['symbols'] = ST.by_symbol(tr, MAIN)
    out['tf'] = {tf: ST.trade_stats([t for t in tr if t['tf'] == tf], MAIN) for tf in ('D1', 'W1') if any(t['tf'] == tf for t in tr)}
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--zones', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--png-dir', default='')
    ap.add_argument('--mc-runs', type=int, default=10000)
    a = ap.parse_args(argv)
    os.makedirs(a.out, exist_ok=True)
    t0 = time.time()
    zj = json.load(open(a.zones))
    recs = zj['recs']
    mk = {s: S.build_mkt(s) for s in L.SYMS}
    R: Dict = {'generated': time.strftime('%Y-%m-%d'), 'symbols': L.SYMS, 'cost': L.COST, 'zones_start': zj['start'],
               'last_bar': max(m.dates[-1] for m in mk.values()), 'risk': S.RISK, 'cap': S.CAP}

    # --- zone funnel: how often each scanner rule blocks the fresh zones (at the first close price is near)
    first: Dict = {}
    for r in sorted(recs, key=lambda r: (r['t'], r['sym'], r['zid'])):
        first.setdefault((r['sym'], r['zid']), r)
    fresh_first = [r for r in first.values() if 'fresh' not in r['fails']]
    blocks = collections.Counter(f for r in fresh_first for f in r['fails'])
    R['funnel'] = {'zones_near': len(first), 'fresh_near': len(fresh_first), 'blocked_by': dict(blocks.most_common()),
                   'by_tf': dict(collections.Counter(r['tf'] for r in fresh_first))}

    # --- the three variants, 0.5% risk
    orders = {n: S.orders_from_records(recs, n) for n, _, _ in S.LADDER}
    base = {'A': S.simulate('A', mk, orders['L0']), 'B': S.simulate('B', mk), 'C': S.simulate('C', mk, orders['L0'])}
    R['variants'] = {k: pack(v) for k, v in base.items()}
    R['orders'] = {n: {'all': len(o), 'since2015': sum(1 for x in o if x['sig'] >= '2015'), 'D1': sum(1 for x in o if x['tf'] == 'D1'),
                       'W1': sum(1 for x in o if x['tf'] == 'W1')} for n, o in orders.items()}
    R['ladder'] = {}
    for n, text, _ in S.LADDER:
        if n == 'L6':
            R['ladder'][n] = {'text': text, 'A': {'periods': {MAIN: {'n': 0}}}, 'C': {'periods': {MAIN: {'n': 0}}}}
            continue
        ra = base['A'] if n == 'L0' else S.simulate('A', mk, orders[n])
        rc = base['C'] if n == 'L0' else S.simulate('C', mk, orders[n])
        R['ladder'][n] = {'text': text, 'A': pack(ra), 'C': pack(rc)}

    # --- cost sensitivity (a fixed alternative, not a sweep): no cost, and twice the cost
    R['cost_sens'] = {}
    for m in (0.0, 2.0):
        R['cost_sens'][str(m)] = {k: pack(S.simulate(k, mk, orders['L0'] if k != 'B' else None, cost_mult=m)) for k in 'ABC'}

    # --- which ingredient does what: the 2 x 2 of {trend filter at the fill, no filter} x {A's target exit, B's trailing exit}
    # (A and C are two cells of it; AF / AT are the other two. Exploratory: fixed rules, nothing tuned, but it is a look at 4 cells.)
    R['decomp'] = {'A': R['variants']['A'], 'C': R['variants']['C'],
                   'AF': pack(S.simulate('AF', mk, orders['L0'])), 'AT': pack(S.simulate('AT', mk, orders['L0']))}
    # --- fill convention: the most generous reading (a limit bar may also credit the target when the stop was not touched)
    R['fill_sens'] = {'A_generous': pack(S.simulate('A', mk, orders['L0'], fillbar_target=True))}

    # --- the owner's 11 symbols only (no US500, no oil)
    mk11 = {k: v for k, v in mk.items() if k not in ('US500', 'SPOTCRUDE')}
    o11 = [o for o in orders['L0'] if o['sym'] in mk11]
    R['sub11'] = {k: pack(S.simulate(k, mk11, o11 if k != 'B' else None)) for k in 'ABC'}
    R['equity_end'] = {k: float(base[k]['equity'][max(base[k]['equity'])]) for k in 'ABC'}

    # --- best variant = highest expectancy over the whole period (fixed rule, stated in the report)
    exp_main = {k: R['variants'][k]['periods'][MAIN]['exp'] for k in 'ABC'}
    best = max(exp_main, key=exp_main.get)
    R['best'] = best

    # --- risk size: the closed-trade R sequence (exit order) replayed at 0.5 / 2 / 5% and bootstrapped
    R['risk_sizes'] = {}
    for k in 'ABC':
        tr = sorted(base[k]['trades'], key=lambda t: (t['out'], t['in']))
        rs = [t['R'] for t in tr]
        rows = {}
        for f in RISKS:
            rp = ST.replay(rs, f)
            mc = ST.monte_carlo(rs, f, runs=a.mc_runs, seed=5)
            mcb = ST.monte_carlo(rs, f, runs=a.mc_runs, seed=6, block=10)
            rows[str(f)] = {'replay': rp, 'mc': mc, 'mc_block': mcb}
        R['risk_sizes'][k] = {'n': len(rs), 'rows': rows, 'sum_r': float(sum(rs)), 'rs': rs}
    R['elapsed'] = round(time.time() - t0, 1)

    # --- files
    with open(os.path.join(a.out, 'trades.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['variant', 'symbol', 'zone_tf', 'dir', 'entry_date', 'exit_date', 'entry', 'stop', 'exit', 'R', 'exit_reason', 'bars_held'])
        for k in 'ABC':
            for t in sorted(base[k]['trades'], key=lambda t: (t['in'], t['sym'])):
                w.writerow([k, t['sym'], t['tf'], t['d'], t['in'], t['out'], f"{t['entry']:.6g}", f"{t['stop']:.6g}", f"{t['exit']:.6g}",
                            f"{t['R']:.4f}", t['why'], t['bars']])
    eq = {k: base[k]['equity'] for k in 'ABC'}
    R['equity_curve'] = {k: {d: round(v, 5) for i, (d, v) in enumerate(sorted(eq[k].items())) if i % 5 == 0} for k in eq}
    rs_all = {k: R['risk_sizes'][k].pop('rs') for k in 'ABC'}
    with open(os.path.join(a.out, 'results.json'), 'w') as f:
        json.dump(clean(R), f, separators=(',', ':'))
    print(f'results.json written ({R["elapsed"]} s)')
    import charts
    charts.draw(R, eq, rs_all, a.out)
    if a.png_dir:
        import shutil
        os.makedirs(a.png_dir, exist_ok=True)
        for f in ('equity.png', 'risk.png'):
            shutil.copy(os.path.join(a.out, f), os.path.join(a.png_dir, f))
    return 0


if __name__ == '__main__':
    sys.exit(main())
