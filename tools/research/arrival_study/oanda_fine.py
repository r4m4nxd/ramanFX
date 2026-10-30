"""OANDA candles for round 2: any granularity (M5 / M15 / H1 / H4 / D ...), BID bars + the bid/ask spread, labelled in
forex (server) time like the rest of the tools, cached on disk (tools/fx_scanner/.cache/r2, saved by actions/cache).

  window(name, gran, start_utc)       5000 candles from start_utc (one request; cached by name / gran / start day)
  span(name, gran, start_utc, end)    every candle between two UTC times (pages of 5000; cached as one file)
"""
from __future__ import annotations

import datetime as dt
import json
import os
import sys
import urllib.parse
from typing import List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
for _p in (os.path.join(ROOT, 'tools', 'stock_scanner'), os.path.join(ROOT, 'tools', 'fx_scanner')):
    if _p not in sys.path:
        sys.path.insert(0, _p)

CACHE = os.path.join(ROOT, 'tools', 'fx_scanner', '.cache', 'r2')
GRAN = {'M5': 'M5', 'M15': 'M15', 'H1': 'H1', 'H4': 'H4', 'D1': 'D', 'W1': 'W', 'MN': 'M'}
STATS = {'requests': 0, 'cached': 0, 'errors': 0}


def _label(utc_s: str) -> str:
    import fxcfg as C
    return C.fx_time(C.parse_utc(utc_s)).strftime('%Y-%m-%dT%H:%M')


def parse(raw: bytes) -> List[list]:
    """[[label, o, h, l, c, spread]] of the complete candles (bid; mid when there is no bid side)."""
    out = []
    for c in json.loads(raw).get('candles') or []:
        if not c.get('complete'):
            continue
        m = c.get('bid') or c.get('mid') or {}
        try:
            o, h, l, cl = (float(m[k]) for k in 'ohlc')
        except (KeyError, TypeError, ValueError):
            continue
        sp = 0.0
        try:
            sp = float(c['ask']['c']) - float(c['bid']['c'])
        except (KeyError, TypeError, ValueError):
            pass
        out.append([_label(str(c['time'])), o, h, l, cl, round(sp, 8)])
    return out


def url(name: str, gran: str, start_utc: str, count: int = 5000) -> str:
    import oanda as O
    q = {'granularity': GRAN[gran], 'price': 'BA', 'count': str(count), 'from': start_utc, **O.ALIGN}
    return f'https://{O.host()}/v3/instruments/{urllib.parse.quote(name)}/candles?' + urllib.parse.urlencode(q)


def _get(u: str) -> bytes:
    import oanda as O
    STATS['requests'] += 1
    return O.default_get(u)


def _load(path: str) -> Optional[List[list]]:
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def _save(path: str, rows: List[list]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(rows, f, separators=(',', ':'))
    os.replace(tmp, path)


def window(name: str, gran: str, start_utc: dt.datetime, get=None) -> List[list]:
    """5000 candles from start_utc (rounded down to the day: windows of nearby setups share a file)."""
    day = start_utc.strftime('%Y-%m-%d')
    path = os.path.join(CACHE, 'win', f'{name}.{gran}.{day}.json')
    rows = _load(path)
    if rows is not None:
        STATS['cached'] += 1
        return rows
    try:
        rows = parse((get or _get)(url(name, gran, day + 'T00:00:00Z')))
    except Exception:  # noqa: BLE001
        STATS['errors'] += 1
        raise
    if rows:
        _save(path, rows)
    return rows


def span(name: str, gran: str, start_utc: str, end_utc: Optional[str] = None, get=None, max_pages: int = 400) -> List[list]:
    """Every candle from start_utc ('YYYY-MM-DDTHH:MM:SSZ') on, topped up from the cached copy."""
    path = os.path.join(CACHE, 'span', f'{name}.{gran}.{start_utc[:10]}.json')
    rows = _load(path) or []
    frm = start_utc
    if rows:
        import fxcfg as C  # noqa: F401
        frm = None
    have = {r[0] for r in rows}
    nxt = frm
    if nxt is None:
        # restart from the newest cached candle (as UTC: label = NY + 7 h; going back 12 h is safe, dupes dropped)
        t = dt.datetime.strptime(rows[-1][0], '%Y-%m-%dT%H:%M') - dt.timedelta(hours=12)
        nxt = t.strftime('%Y-%m-%dT%H:%M:00Z')
    for _ in range(max_pages):
        raw = (get or _get)(url(name, gran, nxt))
        got = parse(raw)
        new = [r for r in got if r[0] not in have]
        for r in new:
            rows.append(r)
            have.add(r[0])
        cs = json.loads(raw).get('candles') or []
        if len(cs) < 5000 or not new:
            break
        nxt = str(cs[-1]['time'])[:19] + 'Z'
        if end_utc and nxt >= end_utc:
            break
    rows.sort(key=lambda r: r[0])
    if rows:
        _save(path, rows)
    return rows
