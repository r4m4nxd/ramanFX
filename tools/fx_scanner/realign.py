"""15-minute realignment check (realign.yml): the ✅ Confirmation alerts of the 4-hour and daily realignment areas.

The hourly FX scan (fxarrival.py) keeps the open realignment areas in public/fx/arrivals.json and flags the ones price
is in ('inside'). This job reads that file and ONLY for those areas whose lower TF is 15-min (H4 areas) or 1-hour (D1
areas) asks OANDA for the newest 400 candles of that TF (one request per area: cheap), looks for a lower-TF arrival
zone inside the area (arrival.confirm_in, as the bot chart: arrival.ts) and sends the A+ trade (entry = the LTF zone's
proximal, stop = its distal, target = the area TF's newest real pivot, R:R). Nothing inside -> no OANDA call at all.
State: public/fx/realign.json (data branch, this job only): the confirmations sent + the day's message count (the
shared 8-a-day cap with the FX and stock arrival alerts).

    python tools/fx_scanner/realign.py             run (sends; saves the state)
    python tools/fx_scanner/realign.py --dry-run   print the would-be messages, send / write nothing
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import sys
from typing import Callable, Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import arrival as A  # noqa: E402
import arrival_alerts as AA  # noqa: E402
import zones as Z  # noqa: E402

LTFS = ('M15', 'H1')
COUNT = 400


def open_inside(areas: Dict[str, Dict], done: Dict[str, str]) -> List[Dict]:
    """The areas to check: entered, flagged inside by the hourly scan, not confirmed (here or there), lower TF M15 / H1,
    an OANDA instrument (extra-source instruments have no OANDA candles)."""
    return [a for k, a in sorted(areas.items()) if a.get('ltf') in LTFS and a.get('entered') and a.get('inside')
            and not a.get('confirmed') and k not in done and a.get('oanda') and not a.get('src')]


def fetch_bars(name: str, tf: str, get: Optional[Callable[[str], bytes]] = None) -> List[Z.Bar]:
    import oanda as O
    get = get or O.default_get
    return [b for _, b, _, _ in O.parse_candles(get(O.candles_url(name, tf, COUNT)), tf, strict=False, name=name)]


def check(areas: List[Dict], bars_of: Callable[[str, str], List[Z.Bar]], log=print) -> List[Dict]:
    """Confirmation items for the areas (pure apart from bars_of)."""
    out = []
    for a in areas:
        try:
            bars = bars_of(a['oanda'], a['ltf'])
        except Exception as e:  # noqa: BLE001
            log(f"realign: {a['sym']} {a['ltf']} candles unavailable ({type(e).__name__})")
            continue
        if len(bars) < 40:
            continue
        S = A.series_of(bars, a['ltf'])
        c = A.confirm_in(S, a['ltf'], A.FX_P, a['dir'], a['lo'], a['hi'], a.get('t_leg') or '')
        if c is not None and c.known_bar <= A.new_bars(a['ltf']):
            out.append(AA.confirm_item(a, c, bars[-1].c))
    return out


def run(argv=None, bars_of=None, send=None, prefs=None, now: Optional[dt.datetime] = None, log=print,
        fx_state: str = AA.STATE_FILES['fx'], path: str = AA.STATE_FILES['realign']) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--dry-run', action='store_true', help='print the would-be messages; send and write nothing')
    a = ap.parse_args(argv)
    now = now or dt.datetime.now(dt.timezone.utc)
    st = AA.load(path)
    done = st.setdefault('area_confirmed', {})
    todo = open_inside((AA.load(fx_state).get('areas') or {}), done)
    log(f"realign: {len(todo)} area(s) to check" + (': ' + ', '.join(f"{x['sym']} {x['tf']}->{x['ltf']}" for x in todo) if todo else ''))
    if not todo:
        return 0
    if bars_of is None:
        import oanda as O
        O.token()
        bars_of = fetch_bars
    cands = {'confirm': check(todo, bars_of, log), 'arrival': [], 'watch': []}
    if send is None:
        import fxnotify as N
        send = N.send
    if prefs is None and not a.dry_run:
        import prefs as P
        prefs = P.fetch(log=log)
    AA.finalize(st, cands, 'fx', prefs, send, 'realign', path, notify=not a.dry_run, write=False,
                guest_filter=AA.fx_guest_filter, log=log, now=now, boot=False)
    for c in cands['confirm']:                         # sent (or muted / capped): never again for this area
        if c['id'] in (st.get('confirmed') or {}):
            done[c['area_id']] = now.isoformat()
    cut = (now - dt.timedelta(days=AA.KEEP_DAYS)).isoformat()
    st['area_confirmed'] = {k: v for k, v in done.items() if v >= cut}
    if not a.dry_run:
        AA.save(path, st)
    return 0


if __name__ == '__main__':
    sys.exit(run())
