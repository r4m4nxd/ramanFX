"""Raja arrival / realignment alerts in the daily stock scan (arrival.py + arrival_alerts.py).

Owner rule: stock zones never below W1. Arrivals, areas and targets are W1 / MN / 3M (HTF chain W1 -> MN -> 3M, as
arrival.ts HIGHER_TF: 3M has no higher TF);
the lower timeframes are read ONLY as confirmation triggers, never shown as zones:
    3M area -> W1 arrival (the scan's W1 row)
    MN area -> D1 arrival (the scan's daily bars, zones detected for the trigger only)
    W1 area -> H4 arrival (Alpaca IEX 1-hour bars of the few tickers whose W1 area price is in, grouped into the two
               regular-session 4-hour blocks 09:30-13:30 / 13:30-16:00 New York; IEX trades only)
D1 -> 1H (the FX chain's D1 area) does not exist on stocks: D1 is never an area there.
State: public/scanner/arrivals.json (data branch, written by stock-scan only).
"""
from __future__ import annotations

import datetime as dt
import os
import sys
from typing import Callable, Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import arrival as A  # noqa: E402
import arrival_alerts as AA  # noqa: E402
import zones as Z  # noqa: E402

STATE = AA.STATE_FILES['stocks']
TFS = ('W1', 'MN', '3M')
ALERT_TFS = ('3M', 'MN', 'W1')
AREA_TFS = ('3M', 'MN', 'W1')


def h4_blocks(h1: List[Z.Bar], eastern: Callable[[dt.datetime], dt.datetime]) -> List[Z.Bar]:
    """1-hour bars (UTC labels) -> regular-session 4-hour bars (New York 09:30-13:30, 13:30-16:00; an Alpaca 1-hour
    bar is labelled with its start: 09:00 holds 09:30-10:00, 13:00 goes to the first block, as TradingView's 4H on a
    session chart starts its second bar at 13:30). Label = New York 'YYYY-MM-DDTHH:MM' of the block start."""
    out: List[Z.Bar] = []
    key = None
    for b in h1:
        t = eastern(dt.datetime.strptime(b.d[:16], '%Y-%m-%dT%H:%M'))
        if not 9 <= t.hour <= 15:
            continue                                       # pre / post market
        k = (t.date(), 0 if t.hour <= 13 else 1)
        lbl = f"{t.date().isoformat()}T{'09:30' if k[1] == 0 else '13:30'}"
        if k != key:
            out.append(Z.Bar(lbl, b.o, b.h, b.l, b.c, b.v))
            key = k
        else:
            a = out[-1]
            out[-1] = Z.Bar(a.d, a.o, max(a.h, b.h), min(a.l, b.l), b.c, a.v + b.v)
    return out


class Collector:
    """Built once per scan; add() per analysed ticker, intraday() for the W1 -> H4 checks, finish() to send."""

    def __init__(self, state_path: str = STATE, now: Optional[dt.datetime] = None):
        self.path = state_path
        self.st = AA.load(state_path)
        self.boot = 'seen' not in self.st
        self.now = now or dt.datetime.now(dt.timezone.utc)
        self.iso = self.now.isoformat()
        self.old = self.st.get('areas') or {}
        self.areas: Dict[str, Dict] = {}
        self.done: set = set()
        self.cands: Dict[str, List[Dict]] = {'arrival': [], 'watch': [], 'confirm': []}
        self.errors = 0

    def add(self, sym: str, an, wl: bool = False, p=Z.RAJA) -> None:
        try:
            rows = {'W1': an.w1, 'MN': an.mn, '3M': an.q3}
            views = AA.views_of(rows, TFS)
            S1 = an.d1.S

            def ltf(tf):
                if tf == 'D1':
                    return AA.view_of(S1, p)                  # daily bars: a trigger only, never shown as a zone
                return views.get(tf)
            lo, hi = (min(S1.L[1], an.price), max(S1.H[1], an.price)) if S1.n > 1 else (an.price, an.price)
            out = AA.symbol_pass(sym, views, ALERT_TFS, AREA_TFS, 2, an.price, lo, hi, self.old, self.iso, p,
                                 wl=wl, confirm_tfs=('D1', 'W1'), ltf_views=ltf, spread=A.stock_spread(an.price))
        except Exception:  # noqa: BLE001
            self.errors += 1
            return
        self.done.add(sym)
        for k in self.cands:
            self.cands[k] += out[k]
        for rec in out['areas']:
            rec['price'] = round(an.price, 2)
            self.areas[rec['id']] = rec

    def need_h4(self) -> List[str]:
        """Tickers with an entered, unconfirmed W1 area price is still in (the only intraday requests)."""
        return sorted({r['sym'] for r in self.areas.values()
                       if r.get('ltf') == 'H4' and r.get('entered') and not r.get('confirmed') and r.get('inside')})

    def intraday(self, fetch: Callable[[List[str]], Dict[str, List[Z.Bar]]], eastern, log=print, p=Z.RAJA) -> int:
        syms = self.need_h4()
        if not syms:
            return 0
        bars = fetch(syms) or {}
        n = 0
        for rec in list(self.areas.values()):
            if rec['sym'] not in bars or rec.get('ltf') != 'H4' or not rec.get('entered') or rec.get('confirmed'):
                continue
            h4 = h4_blocks(bars[rec['sym']], eastern)
            if len(h4) < 40:
                continue
            S = A.series_of(h4, 'H4')
            c = A.confirm_in(S, 'H4', p, rec['dir'], rec['lo'], rec['hi'], rec['t_leg'])
            if c is not None and c.known_bar <= A.new_bars('H4'):
                self.cands['confirm'].append(AA.confirm_item(rec, c, rec.get('price') or h4[-1].c, S))
                n += 1
        if log:
            log(f'arrivals: H4 check of {len(syms)} ticker(s) in a weekly realignment area: {n} confirmation(s)')
        return n

    def finish(self, prefs: Optional[Dict], send, notify: bool = True, write: bool = True, log=print) -> int:
        for k, rec in self.old.items():
            if rec.get('sym') not in self.done and k not in self.areas:
                self.areas[k] = rec
        self.st['areas'] = self.areas
        if self.errors and log:
            log(f'arrivals: {self.errors} ticker(s) skipped (errors)')
        try:
            return AA.finalize(self.st, self.cands, 'stocks', prefs, send, 'stocks', self.path, notify=notify, write=write,
                               guest_filter=AA.stock_guest_filter, log=log, now=self.now, boot=self.boot)
        except Exception as e:  # noqa: BLE001
            if log:
                log(f'arrivals: skipped ({type(e).__name__}: {str(e)[:120]})')
            return 0


# ---- dry run on the published detail shards (public/scanner/t/*.json: 120 daily bars + the bot's W1 104 / MN 60 /
# 3M 24 chart bars, listed tickers only) --------------------------------------------------------------------------
def _unpack(pb: Dict) -> List[Z.Bar]:
    if not pb or not pb.get('t0'):
        return []
    d0 = dt.date.fromisoformat(pb['t0'])
    return [Z.Bar((d0 + dt.timedelta(days=o)).isoformat(), *b) for o, b in zip(pb['dt'], pb['b'])]


def published(out_dir: str, only: str = '') -> Dict[str, object]:
    """{sym: scan.Analysis} rebuilt from the shards (the forming W1 / MN / 3M chart bar dropped)."""
    import glob
    import json
    import scan as SC
    want = {s.strip().upper() for s in only.split(',') if s.strip()}
    out = {}
    for f in sorted(glob.glob(os.path.join(out_dir, 't', '*.json'))):
        with open(f) as fh:
            tick = json.load(fh).get('tickers') or {}
        for sym, det in tick.items():
            if (want and sym.upper() not in want) or 'hb' not in det:
                continue
            d1 = _unpack(det.get('bars'))
            hb = {tf: _unpack(v)[:-1] for tf, v in det['hb'].items()}
            if len(d1) < 30 or len(hb.get('W1') or []) < 40:
                continue
            try:
                out[sym] = SC.analyse(d1, hb['W1'], hb['MN'], price=det.get('price'), q3_bars=hb.get('3M'))
            except Exception:  # noqa: BLE001
                continue
    return out


def main(argv=None) -> int:
    import argparse
    ap = argparse.ArgumentParser(description='Dry run: the stock arrival alerts on the published shards (sends nothing).')
    ap.add_argument('--dir', default=os.path.join(AA.ROOT, 'public', 'scanner'))
    ap.add_argument('--only', default='')
    a = ap.parse_args(argv)
    ans = published(a.dir, a.only)
    col = Collector(os.devnull)
    col.st, col.boot, col.old = {'seen': {}}, False, {}
    for sym, an in ans.items():
        col.add(sym, an)
    print(f"{len(ans)} tickers: {len(col.cands['arrival'])} arrival(s), {len(col.cands['watch'])} area entry(ies), "
          f"{len(col.cands['confirm'])} confirmation(s), {len(col.areas)} open area(s), {col.errors} errors; "
          f"W1 -> H4 intraday checks would run for: {', '.join(col.need_h4()) or 'none'}\n")
    for k in ('confirm', 'arrival', 'watch'):
        for c in AA.sort_items(col.cands[k]):
            print(k, c['sym'], c['tf'], 'demand' if c['dir'] > 0 else 'supply', c.get('lo'), c.get('hi'),
                  {x: c.get(x) for x in ('n_removed', 'target', 'target_kind', 'ceiling', 'entry', 'stop', 'rr', 'date') if c.get(x) is not None})
    print('\nopen areas:')
    for r in sorted(col.areas.values(), key=lambda r: (r['sym'], r['tf'])):
        print(' ', r['sym'], r['tf'], 'demand' if r['dir'] > 0 else 'supply', r['lo'], r['hi'], 'ltf', r['ltf'],
              'entered' if r.get('entered') else '-', 'inside' if r.get('inside') else '')
    for m in AA.messages(AA.sort_items(col.cands['confirm'] + col.cands['arrival'] + col.cands['watch']), 'stocks'):
        print('-' * 40 + '\n' + m)
    return 0


if __name__ == '__main__':
    sys.exit(main())
