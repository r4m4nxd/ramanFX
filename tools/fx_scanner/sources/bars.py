"""Bar plumbing shared by the non-OANDA sources: raw rows -> scanner bars on the scanner's own grid, the raw cache.

Raw rows (what a source returns, oldest first):
    H1  [utc_epoch_seconds, o, h, l, c, v]      the hour that STARTS at utc_epoch (complete hours only)
    D1  ['YYYY-MM-DD', o, h, l, c, v]           one day (crypto: the UTC day; Yahoo: the exchange's trading day)

Scanner bars (zones.Bar, labels in Pepperstone server time = New York + 7 h, like oanda.py):
    H1  C.label(utc, 'H1'): on the hour (a bar starting at :30, e.g. a 09:30 New York cash session, gets the
        nearest hour). The New York fall-back hour repeats a server-time label once a year: the two hours are
        merged into one bar (crypto only; FX is closed then).
    H4  the H1 bars per server-time H4 bucket (00/04/08/12/16/20), only buckets that have closed: identical to the
        H4 bars OANDA builds for FX (the scanner's H1 -> forming-H4 logic stays exact).
    D1  the raw day, labelled 'YYYY-MM-DDT00:00'. NOTE: for crypto this is the UTC day, not the server-time day
        (17:00 New York) of the FX bars: a crypto D1 bar starts 2-3 h after the server-time midnight. Old D1
        history only exists as UTC days, so it is used consistently for every crypto D1 / W1 / MN bar.
    W1  the days of a week that starts on Saturday (the scanner's W1 label = the Saturday, fxcfg.period_key), only
        closed weeks; crypto weeks therefore run Saturday 00:00 -> Friday 24:00 UTC.
    MN  the days of a calendar month, only closed months.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import sys
import time
from typing import Dict, List, Optional, Sequence

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
from zones import Bar  # noqa: E402

KEEP_RAW = {'H1': 6000, 'D1': 6000}           # raw rows cached per instrument (H1 6000 = 1500 H4 bars of a 24/7 market)


def now_utc() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)


def _merge_dupes(out: List[Bar], b: Bar) -> None:
    if out and out[-1].d == b.d:
        x = out[-1]
        out[-1] = Bar(x.d, x.o, max(x.h, b.h), min(x.l, b.l), b.c, x.v + b.v)
    else:
        out.append(b)


def h1_bars(rows: Sequence[list]) -> List[Bar]:
    """Raw H1 rows -> server-time H1 bars (oldest first, duplicate labels merged)."""
    out: List[Bar] = []
    for r in sorted(rows, key=lambda r: r[0]):
        lbl = C.label(str(int(r[0])), 'H1', strict=False)
        _merge_dupes(out, Bar(lbl, float(r[1]), float(r[2]), float(r[3]), float(r[4]), float(r[5] if len(r) > 5 else 0)))
    return out


def h4_bars(h1: Sequence[Bar], now: Optional[dt.datetime] = None) -> List[Bar]:
    """H1 bars -> closed server-time H4 bars (fxcfg.h4_bucket; a bucket is closed once its UTC close has passed)."""
    now = now or now_utc()
    out: List[Bar] = []
    for b in h1:
        _merge_dupes(out, Bar(C.h4_bucket(b.d), b.o, b.h, b.l, b.c, b.v))
    while out and C.h4_close_utc(out[-1].d) > now:
        out.pop()
    return out


def d1_bars(rows: Sequence[list]) -> List[Bar]:
    out: List[Bar] = []
    for r in sorted(rows, key=lambda r: r[0]):
        _merge_dupes(out, Bar(str(r[0])[:10] + 'T00:00', float(r[1]), float(r[2]), float(r[3]), float(r[4]),
                              float(r[5] if len(r) > 5 else 0)))
    return out


def _group(d1: Sequence[Bar], key, closed) -> List[Bar]:
    out: List[Bar] = []
    for b in d1:
        k = key(b.d)
        if out and out[-1].d == k:
            x = out[-1]
            out[-1] = Bar(k, x.o, max(x.h, b.h), min(x.l, b.l), b.c, x.v + b.v)
        else:
            out.append(Bar(k, b.o, b.h, b.l, b.c, b.v))
    return [b for b in out if closed(b.d)]


def w1_bars(d1: Sequence[Bar], today: Optional[dt.date] = None) -> List[Bar]:
    """Closed weeks (Saturday label, the scanner's W1 key)."""
    today = today or now_utc().date()
    return _group(d1, lambda d: C.period_key('W1', d) + 'T00:00',
                  lambda d: dt.date.fromisoformat(d[:10]) + dt.timedelta(days=7) <= today)


def mn_bars(d1: Sequence[Bar], today: Optional[dt.date] = None) -> List[Bar]:
    """Closed calendar months (label the 1st)."""
    today = today or now_utc().date()
    return _group(d1, lambda d: d[:7] + '-01T00:00', lambda d: d[:7] < today.isoformat()[:7])


def chain(h1_rows: Sequence[list], d1_rows: Sequence[list], now: Optional[dt.datetime] = None) -> Dict[str, List[Bar]]:
    """{'H1','H4','D1','W1','MN'} scanner bars from raw H1 + D1 rows (each TF capped at fxcfg.KEEP_BARS)."""
    now = now or now_utc()
    h1 = h1_bars(h1_rows)
    d1 = d1_bars(d1_rows)
    out = {'H1': h1, 'H4': h4_bars(h1, now), 'D1': d1, 'W1': w1_bars(d1, now.date()), 'MN': mn_bars(d1, now.date())}
    return {tf: bs[-C.KEEP_BARS.get(tf, 1500):] for tf, bs in out.items()}


def merge_rows(old: List[list], new: List[list], keep: int) -> List[list]:
    """old + new by key (the newer row wins), oldest first, the last `keep` rows."""
    m = {r[0]: r for r in old}
    for r in new:
        m[r[0]] = r
    return [m[k] for k in sorted(m)][-keep:]


# ---- raw cache: <FX_CACHE>/sources/<name>.json = {'src', 'h1', 'd1', 'at_h1', 'at_d1'} ------------------------------
def _path(name: str) -> str:
    return os.path.join(C.CACHE, 'sources', f'{name}.json')


def load(name: str) -> Dict:
    try:
        with open(_path(name)) as f:
            v = json.load(f)
        return v if isinstance(v, dict) else {}
    except (OSError, ValueError):
        return {}


def save(name: str, rec: Dict) -> None:
    p = _path(name)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp'
    with open(tmp, 'w') as f:
        json.dump({**rec, 'saved': time.time()}, f, separators=(',', ':'))
    os.replace(tmp, p)
