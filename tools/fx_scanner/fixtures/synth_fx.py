"""Synthetic forex bars for the selftest and the unit tests (no network): an H4 random walk made of trending legs
(Monday-Friday in forex time, 6 bars a day), aggregated into D1 / W1 / MN exactly like the scanner buckets them."""
from __future__ import annotations

import datetime as dt
import os
import random
import sys
from typing import Dict, List

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxcfg as C  # noqa: E402
from zones import Bar  # noqa: E402


def h4_labels(end: str, n: int) -> List[str]:
    """The last n H4 labels (forex time, Mon-Fri) ending with the bar that starts at `end` ('YYYY-MM-DDTHH:MM')."""
    t = dt.datetime.strptime(end, '%Y-%m-%dT%H:%M')
    out = []
    while len(out) < n:
        if t.weekday() < 5:
            out.append(t.strftime('%Y-%m-%dT%H:%M'))
        t -= dt.timedelta(hours=4)
    return out[::-1]


def h4_walk(seed: int, end: str = '2026-10-23T16:00', n: int = 22000, start: float = 1.10, vol: float = 0.0016) -> List[Bar]:
    """Trending legs of random length with basing pauses; open = previous close; positive prices."""
    rnd = random.Random(seed)
    labels = h4_labels(end, n)
    out, p, k = [], start, 0
    while k < n:
        leg = rnd.randint(8, 160)
        drift = rnd.choice((-1, 1)) * rnd.uniform(0.0, 0.35) * vol
        base = rnd.random() < 0.35
        for _ in range(leg):
            if k >= n:
                break
            step = (drift if not base else 0.0) + rnd.gauss(0, vol * (0.35 if base else 1.0))
            c = max(start * 0.2, p * (1 + step))
            w = abs(rnd.gauss(0, vol * 0.6)) * p
            out.append(Bar(labels[k], p, max(p, c) + w, min(p, c) - abs(rnd.gauss(0, vol * 0.6)) * p, c))
            p = c
            k += 1
    return out


def aggregate(h4: List[Bar], tf: str) -> List[Bar]:
    """D1 / W1 / MN from H4 (all buckets closed except the one holding the last H4 bar, which is dropped)."""
    key = (lambda d: C.period_key(tf, d)) if tf in ('D1', 'W1') else (lambda d: d[:7])
    out: List[Bar] = []
    cur = None
    for b in h4:
        k = key(b.d)
        if cur is None or cur[0] != k:
            if cur is not None:
                out.append(cur[1])
            lbl = (k + 'T00:00') if tf in ('D1', 'W1') else (k + '-01T00:00')
            cur = (k, Bar(lbl, b.o, b.h, b.l, b.c, b.v))
        else:
            x = cur[1]
            x.h, x.l, x.c = max(x.h, b.h), min(x.l, b.l), b.c
    return out                                     # the forming bucket (cur) is left out


def instrument(seed: int, start: float = 1.10, end: str = '2026-10-23T16:00', vol: float = 0.0016) -> Dict[str, List[Bar]]:
    h4 = h4_walk(seed, end, start=start, vol=vol)
    return {'H4': h4[-C.KEEP_BARS['H4']:], 'D1': aggregate(h4, 'D1'), 'W1': aggregate(h4, 'W1'), 'MN': aggregate(h4, 'MN')}
