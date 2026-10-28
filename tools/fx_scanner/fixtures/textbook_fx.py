"""A hand-built textbook Raja setup on the full FX chain (no randomness), for the positive tests and the selftest.

Every timeframe (MN, W1, D1, H4) gets the same shape, scaled to its own zone (oldest -> newest):

    warm-up rise to a top T -> drop to M1 -> rally to Q -> supply base S1 at Q -> drop (lower low than M1)
    -> demand base D (drop-base-rally) -> big departure (>= 3x the base) that crosses the down trendline T -> Q and
    closes above S1 (S1 removed: an arrival / strong zone) -> run-out peak below T -> smooth pullback (no new bases)

The demand zones nest: MN 1.2150-1.1950 > W1 1.2120-1.2000 > D1 1.2100-1.2040 > H4 1.2080-1.2065. The HTF bars stop
just above their zone (untouched on closed bars); the H4 pullback ends 10 pips above the H4 proximal, inside the D1,
W1 and MN zones, so every host is touched in the current visit (by the forming HTF bar) for the first time. The
result is the owner's textbook H4 BUY: MN -> W1 -> D1 touched, H4 arrival zone fresh, departure 3x, direction FULL,
low curve, no supply overhead (target = Raja's 250% projection). side=-1 mirrors every price (a SELL).
"""
from __future__ import annotations

import datetime as dt
import os
import sys
from typing import Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

from zones import Bar  # noqa: E402

END = '2026-10-21T08:00'           # a Wednesday (not into the weekend)
MIRROR = 2.42                      # side -1: price -> MIRROR - price
# tf: (proximal, distal, warm-up bars, last closed bar's close as a fraction of the height above the proximal)
LEVELS = {'MN': (1.2150, 1.1950, 12, 0.3), 'W1': (1.2120, 1.2000, 20, 0.3), 'D1': (1.2100, 1.2040, 20, 0.3),
          'H4': (1.2080, 1.2065, 26, 0.667)}


def shape(prox: float, dist: float, warm: int, end_frac: float, dep_x: float = 3.0) -> List[tuple]:
    """(o, h, l, c) oldest first for one timeframe (demand side); dep_x = the demand departure's body in zone heights."""
    h = prox - dist
    u = h
    out: List[tuple] = []

    def trend(a: float, b: float, n: int) -> None:
        st = (b - a) / n
        p = a
        for _ in range(n):
            c = p + st
            w = 0.1 * abs(st)
            out.append((p, max(p, c) + w, min(p, c) - w, c))
            p = c

    T, M1, Q = prox + 10 * u, prox + 6 * u, prox + 8 * u
    trend(prox + 2 * u, T, warm)
    trend(T, M1, 8)
    trend(M1, Q, 3)
    # S1 supply base at Q (rally-base-drop): prox Q - 0.1u, distal Q + 0.5u
    out.append((Q, Q + 0.5 * u, Q - 0.3 * u, Q - 0.1 * u))
    out.append((Q - 0.1 * u, Q + 0.4 * u, Q - 0.3 * u, Q - 0.05 * u))
    q2 = Q - 0.05 * u
    out.append((q2, q2 + 0.05 * u, Q - 2.6 * u, Q - 2.5 * u))           # departure down (>= 2x the base)
    trend(Q - 2.5 * u, prox - 0.1 * h, 7)                               # down to the demand (lower low than M1)
    # demand base D (drop-base-rally): proximal = prox, distal = dist
    out.append((prox - 0.1 * h, prox + 0.05 * h, dist, prox))
    out.append((prox, prox + 0.05 * h, dist + 0.1 * h, prox - 0.15 * h))
    o = prox - 0.15 * h
    out.append((o, o + (dep_x + 0.1) * h, o - 0.05 * h, o + dep_x * h))  # departure: 3x the base, closes far away
    trend(o + dep_x * h, prox + 9 * u, 4)                                 # crosses the T-Q line, closes above S1
    trend(prox + 9 * u, prox + end_frac * h, 10)                        # pullback, no base
    return out


def labels(tf: str, n: int, end: str = END) -> List[str]:
    """n CLOSED bar labels of tf before the bar holding the H4 bar `end` (H4 / H1: ending with `end`)."""
    t = dt.datetime.strptime(end, '%Y-%m-%dT%H:%M')
    out: List[str] = []
    if tf == 'H1':
        while len(out) < n:
            if t.weekday() < 5:
                out.append(t.strftime('%Y-%m-%dT%H:%M'))
            t -= dt.timedelta(hours=1)
    elif tf == 'H4':
        while len(out) < n:
            if t.weekday() < 5:
                out.append(t.strftime('%Y-%m-%dT%H:%M'))
            t -= dt.timedelta(hours=4)
    elif tf == 'D1':
        d = t.date() - dt.timedelta(days=1)
        while len(out) < n:
            if d.weekday() < 5:
                out.append(d.isoformat() + 'T00:00')
            d -= dt.timedelta(days=1)
    elif tf == 'W1':
        d = t.date() - dt.timedelta(days=(t.date().weekday() - 5) % 7) - dt.timedelta(days=7)
        while len(out) < n:
            out.append(d.isoformat() + 'T00:00')
            d -= dt.timedelta(days=7)
    else:
        y, m = t.year, t.month
        while len(out) < n:
            m -= 1
            if m == 0:
                y, m = y - 1, 12
            out.append(f'{y:04d}-{m:02d}-01T00:00')
    return out[::-1]


def to_bars(tf: str, rows: List[tuple], side: int = 1, end: str = END) -> List[Bar]:
    lb = labels(tf, len(rows), end)
    if side > 0:
        return [Bar(d, o, h, l, c) for d, (o, h, l, c) in zip(lb, rows)]
    return [Bar(d, MIRROR - o, MIRROR - l, MIRROR - h, MIRROR - c) for d, (o, h, l, c) in zip(lb, rows)]


def textbook(side: int = 1, end: str = END, levels: Optional[Dict] = None, dep_x: Optional[Dict[str, float]] = None
             ) -> Dict[str, List[Bar]]:
    """{'H4', 'D1', 'W1', 'MN': closed bars, oldest first} of the textbook setup (side -1 = the mirrored SELL).
    dep_x = {tf: departure body in zone heights} to weaken one timeframe's zone (tests)."""
    out = {}
    for tf, (px, ds, warm, ef) in (levels or LEVELS).items():
        rows = shape(px, ds, warm, ef, (dep_x or {}).get(tf, 3.0))
        out[tf] = to_bars(tf, rows, side, end)
    return out


# H1 on top of the H4 textbook (tests of the H1 nesting): an H1 demand inside the H4 demand 1.2080-1.2065
H1_IN = (1.2078, 1.2071, 30, 0.667)
H1_OUT = (1.2098, 1.2092, 30, 0.667)                # above the H4 zone (inside the D1 zone only)


def with_h1(side: int = 1, level: tuple = H1_IN, touch_h4: bool = True, end: str = END) -> Dict[str, List[Bar]]:
    """The textbook + H1 bars of the same shape on `level`, ending in the H4 bar after `end` (two H1 bars of the
    forming H4 bar: mid-H4, the hourly scan). touch_h4: the last H1 bar's wick reaches the H4 proximal (the H4 host is
    touched in the current visit), staying above the H1 proximal."""
    out = textbook(side, end)
    t = dt.datetime.strptime(end, '%Y-%m-%dT%H:%M') + dt.timedelta(hours=5)       # the 2nd H1 bar of the next H4 bar
    rows = shape(*level)
    if touch_h4:
        o, h, l, c = rows[-1]
        rows[-1] = (o, h, min(l, LEVELS['H4'][0] - 0.00002), c)
    out['H1'] = to_bars('H1', rows, side, t.strftime('%Y-%m-%dT%H:%M'))
    return out
