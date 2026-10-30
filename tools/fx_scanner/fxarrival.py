"""Raja arrival / realignment alerts inside the hourly FX scan (tools/stock_scanner/arrival.py + arrival_alerts.py).

Per analysed instrument, on the rows the scan already built (no extra OANDA calls):
    arrivals      3M / MN / W1 / D1 / H4 / H1 (new = known within the newest 3 closed bars of that TF)
    areas         the open realignment area of 3M / MN / W1 / D1 / H4 / H1 (arrival.ts: the TF's current arrival, its
                  weak zone nearest the higher-TF line); 'entered' when the newest closed H1 bar or the price reaches it
    confirmations the areas whose lower TF the scan has: W1 -> H4, MN -> D1, 3M -> W1. H1 / H4 -> M15 and D1 -> H1
                  are checked every 15 min by realign.py (realign.yml) for the areas flagged 'inside' here.
State: public/fx/arrivals.json (data branch, written only by this job; realign.py reads it).
Never raises into the scan: run() catches everything and logs one line.
"""
from __future__ import annotations

import datetime as dt
import os
import sys
import time
from typing import Dict, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import arrival as A  # noqa: E402
import arrival_alerts as AA  # noqa: E402
import fxcfg as C  # noqa: E402

STATE = os.path.join(C.OUT_DIR, 'arrivals.json')
TFS = ('H1', 'H4', 'D1', 'W1', 'MN', '3M')
ALERT_TFS = ('3M', 'MN', 'W1', 'D1', 'H4', 'H1')
AREA_TFS = ('3M', 'MN', 'W1', 'D1', 'H4', 'H1')     # H1 -> M15 and H4 -> M15, D1 -> H1: realign.py
CONFIRM_TFS = ('H4', 'D1', 'W1')            # lower TFs the hourly scan holds (W1 / MN / 3M areas)
BUDGET_S = float(os.environ.get('FX_ARRIVAL_BUDGET_S') or 240)


def scan(res: Dict, st: Dict, now: Optional[dt.datetime] = None, log=print, budget_s: float = BUDGET_S) -> Dict:
    """Candidates of one run + the new areas map (st['areas'] is replaced). Pure apart from the clock."""
    now = now or dt.datetime.now(dt.timezone.utc)
    iso = now.isoformat()
    t0 = time.time()
    old = st.get('areas') or {}
    done_rt = AA.load(AA.STATE_FILES['realign']).get('area_confirmed') or {}   # realign.py's M15 / H1 confirmations
    for k, t in done_rt.items():
        if k in old and not old[k].get('confirmed'):
            old[k]['confirmed'] = t
    areas: Dict[str, Dict] = {}
    done = set()
    cands = {'arrival': [], 'watch': [], 'confirm': []}
    for sym, an in res['analyses'].items():
        if time.time() - t0 > budget_s:
            log(f'arrivals: time budget ({budget_s:.0f}s) spent after {len(done)} instruments; the rest next run')
            break
        try:
            views = AA.views_of(an.rows, TFS)
            S1 = an.rows['H1'].S if an.rows.get('H1') is not None and an.rows['H1'].S.n > 1 else an.fine
            lo, hi = (min(S1.L[1], an.price), max(S1.H[1], an.price)) if S1.n > 1 else (an.price, an.price)
            out = AA.symbol_pass(sym, views, ALERT_TFS, AREA_TFS, an.nd, an.price, lo, hi, old, iso, A.FX_P,
                                 wl=bool(an.inst.get('wl')), confirm_tfs=CONFIRM_TFS,
                                 extra={'oanda': an.inst.get('name') or '', 'src': an.inst.get('source') or '',
                                        'pip': an.pip, 'price': round(an.price, an.nd)},
                                 spread=float(getattr(an, 'spread', None) or 0.0))
        except Exception as e:  # noqa: BLE001
            log(f'arrivals: {sym} skipped ({type(e).__name__}: {str(e)[:80]})')
            continue
        done.add(sym)
        for k in cands:
            cands[k] += out[k]
        for rec in out['areas']:
            areas[rec['id']] = rec
    for k, rec in old.items():                       # instruments not analysed this run keep their areas
        if rec.get('sym') not in done and k not in areas:
            areas[k] = rec
    st['areas'] = areas
    return cands


def run(res: Dict, prefs: Optional[Dict], send, notify: bool = True, write: bool = True, now: Optional[dt.datetime] = None,
        log=print, state_path: str = STATE) -> int:
    """The arrival alerts of an hourly scan: compute, pick within the day's cap, send (owner + guests), save the state.
    Returns the number of owner messages sent."""
    try:
        now = now or dt.datetime.now(dt.timezone.utc)
        st = AA.load(state_path)
        boot = 'seen' not in st
        cands = scan(res, st, now, log)
        return AA.finalize(st, cands, 'fx', prefs, send, 'fx', state_path, notify=notify, write=write,
                           guest_filter=AA.fx_guest_filter, log=log, now=now, boot=boot)
    except Exception as e:  # noqa: BLE001
        log(f'arrivals: skipped ({type(e).__name__}: {str(e)[:120]})')
        return 0


# ---- dry run on the published bars (public/fx/d/*.json: the newest 80 H1 / H4 / D1, 52 W1, 60 MN bars) --------------
class _Row:
    def __init__(self, S, zones):
        self.S, self.zones, self.ok = S, zones, S.n > (16 if S.tf == "3M" else 30)


class _An:
    def __init__(self, det: Dict, rows: Dict, price: float):
        self.inst = {'sym': det['sym'], 'wl': det.get('wl'), 'name': det.get('oanda'), 'source': det.get('src')}
        self.rows, self.price, self.fine = rows, price, rows['H4'].S
        self.nd, self.pip = int(det.get('digits') or 5), float(det.get('pip') or 0.0001)
        self.spread = float(det.get('spread_pips') or 0.0) * self.pip


def published(out_dir: str = C.OUT_DIR, only: str = '') -> Dict:
    """res-like {'analyses': {sym: _An}} rebuilt from the published detail shards (bars only: the rows' zones are
    re-detected with the FX parameters). Short history: lines / zones older than the shard's window are not seen."""
    import glob
    import json
    import zones as Z
    p = {**Z.RAJA, 'base_strict': True, 'emo_touch': True}
    want = {s.strip().upper() for s in only.split(',') if s.strip()}
    out = {}
    for f in sorted(glob.glob(os.path.join(out_dir, 'd', '*.json'))):
        with open(f) as fh:
            ins = json.load(fh).get('instruments') or {}
        for sym, det in ins.items():
            if want and sym.upper() not in want:
                continue
            price = det.get('price')
            bars = {tf: [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in rows] for tf, rows in (det.get('bars') or {}).items()}
            if 'MN' in bars:
                bars['3M'] = Z.to_quarters(bars['MN'])
            rows = {}
            for tf in TFS:
                b = bars.get(tf) or []
                S = Z.Series(b, price, tf) if b else Z.Series([Z.Bar('', price, price, price, price)], price, tf)
                rows[tf] = _Row(S, Z.detect(S, p) if len(b) > 12 else [])
            out[sym] = _An(det, rows, price)
    return {'analyses': out}


def main(argv=None) -> int:
    import argparse
    ap = argparse.ArgumentParser(description='Dry run: the arrival alerts on the published FX bars (sends nothing).')
    ap.add_argument('--dir', default=C.OUT_DIR)
    ap.add_argument('--only', default='')
    ap.add_argument('--state', default='', help='a state file to start from (default: none = every current item)')
    a = ap.parse_args(argv)
    res = published(a.dir, a.only)
    st = AA.load(a.state) if a.state else {'seen': {}}
    cands = scan(res, st, log=print)
    print(f"{len(res['analyses'])} instruments: {len(cands['arrival'])} arrival(s), {len(cands['watch'])} area entry(ies), "
          f"{len(cands['confirm'])} confirmation(s), {len(st['areas'])} open area(s)\n")
    for k in ('confirm', 'arrival', 'watch'):
        for c in AA.sort_items(cands[k]):
            print(k, c['sym'], c['tf'], 'demand' if c['dir'] > 0 else 'supply', c.get('lo'), c.get('hi'),
                  {x: c.get(x) for x in ('n_removed', 'target', 'target_kind', 'ceiling', 'entry', 'stop', 'rr', 'date') if c.get(x) is not None})
    print('\nopen areas:')
    for r in sorted(st['areas'].values(), key=lambda r: (r['sym'], r['tf'])):
        print(' ', r['sym'], r['tf'], 'demand' if r['dir'] > 0 else 'supply', r['lo'], r['hi'], 'ltf', r['ltf'],
              'entered' if r.get('entered') else '-', 'inside' if r.get('inside') else '')
    for m in AA.messages(AA.sort_items(cands['confirm'] + cands['arrival'] + cands['watch']), 'fx'):
        print('-' * 40 + '\n' + m)
    return 0


if __name__ == '__main__':
    sys.exit(main())
