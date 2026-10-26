"""Synthetic but realistic daily OHLC series for tests and --selftest (no network).

`series(seed, legs)` builds a business-day calendar and walks through `legs` = [(days, total_return, vol)], with
bases (1-4 small-bodied candles) followed by a departure candle injected at random, so demand / supply zones,
removals and trendline breaks happen the way they do on real charts. Deterministic for a given seed.
"""
from __future__ import annotations

import datetime as dt
import math
import random
from typing import List, Sequence, Tuple

from zones import Bar


def business_days(end: str, n: int) -> List[str]:
    d = dt.date.fromisoformat(end)
    out = []
    while len(out) < n:
        if d.weekday() < 5:
            out.append(d.isoformat())
        d -= dt.timedelta(days=1)
    return list(reversed(out))


def series(seed: int, legs: Sequence[Tuple[int, float, float]], start: float = 50.0, end: str = '2026-10-23',
           p_base: float = 0.06) -> List[Bar]:
    rnd = random.Random(seed)
    n = sum(l[0] for l in legs)
    days = business_days(end, n)
    bars: List[Bar] = []
    px = start
    i = 0
    for (m, ret, vol) in legs:
        mu = math.log(1 + ret) / max(m, 1)
        k = 0
        while k < m:
            if rnd.random() < p_base and k + 6 < m:
                nb = rnd.randint(1, 4)
                rng = vol * px * 0.45
                for _ in range(nb):
                    o = px
                    c = px * (1 + rnd.uniform(-0.15, 0.15) * vol)
                    h = max(o, c) + rng * rnd.uniform(0.3, 0.6)
                    l = min(o, c) - rng * rnd.uniform(0.3, 0.6)
                    bars.append(Bar(days[i], o, h, l, c))
                    px, i, k = c, i + 1, k + 1
                sign = 1 if (mu >= 0) == (rnd.random() < 0.55) else -1
                o = px
                c = px * (1 + sign * vol * rnd.uniform(2.2, 3.5))
                h = max(o, c) + px * vol * rnd.uniform(0.02, 0.15)
                l = min(o, c) - px * vol * rnd.uniform(0.02, 0.15)
                bars.append(Bar(days[i], o, h, l, c))
                px, i, k = c, i + 1, k + 1
                continue
            o = px * (1 + rnd.gauss(0, vol * 0.15))
            c = o * math.exp(mu + rnd.gauss(0, vol))
            h = max(o, c) * (1 + abs(rnd.gauss(0, vol * 0.45)))
            l = min(o, c) * (1 - abs(rnd.gauss(0, vol * 0.45)))
            bars.append(Bar(days[i], o, h, l, c, rnd.randint(1, 9) * 1e6))
            px, i, k = c, i + 1, k + 1
    return bars


def zone_series() -> List[Bar]:
    """Hand-made D1 bars (oldest first) with one textbook drop-base-rally demand that removes an older supply:
    a rally-base-drop supply (base ~ 104.5-106), a drop, a 2-candle base at ~99.5-100.5, a departure that closes above
    the supply's distal (removes it -> STRONG), a run-out, and a pullback that stays above the demand proximal."""
    rows = []
    p = 100.0
    # 30 quiet bars around 100 for ATR history
    for k in range(30):
        o = p
        c = p + (0.3 if k % 2 == 0 else -0.3)
        rows.append((o, max(o, c) + 0.4, min(o, c) - 0.4, c))
        p = c
    # rally to 105
    for c in (101.0, 102.2, 103.4, 104.6):
        rows.append((p, c + 0.3, p - 0.2, c))
        p = c
    # supply base (2 small candles) 104.6-105.0 bodies, wicks to 105.6
    rows.append((104.6, 105.5, 104.3, 104.9))
    rows.append((104.9, 105.6, 104.4, 104.7))
    # drop departure + stay-away
    rows.append((104.7, 104.8, 101.2, 101.4))
    rows.append((101.4, 101.6, 100.0, 100.3))
    # demand base (2 small candles), bodies 99.8-100.3, wicks 99.1
    rows.append((100.3, 100.9, 99.2, 100.0))
    rows.append((100.0, 100.8, 99.1, 99.8))
    # departure up: closes 106.4 > supply distal (105.6) -> removes the supply
    rows.append((99.8, 106.6, 99.6, 106.4))
    rows.append((106.4, 108.0, 106.2, 107.8))   # stay-away
    rows.append((107.8, 109.5, 107.5, 109.2))
    rows.append((109.2, 110.4, 108.6, 110.0))
    # pullback toward the demand (stays above 100.3)
    for c in (108.6, 107.1, 105.9, 104.8, 103.9, 103.2):
        rows.append((p if False else rows[-1][3], rows[-1][3] + 0.3, c - 0.3, c))
    start = dt.date(2026, 1, 5)
    days = []
    d = start
    while len(days) < len(rows):
        if d.weekday() < 5:
            days.append(d.isoformat())
        d += dt.timedelta(days=1)
    return [Bar(days[i], *r) for i, r in enumerate(rows)]


def legs_for(seed: int, n: int = 2520) -> List[Tuple[int, float, float]]:
    """A 10-year path: long rise, a deep correction, a recovery, a short pullback (the selftest tickers)."""
    r = random.Random(seed)
    legs = [(r.randint(900, 1500), r.uniform(0.8, 2.5), 0.016), (r.randint(300, 600), -r.uniform(0.25, 0.45), 0.02),
            (r.randint(150, 400), r.uniform(0.1, 0.35), 0.017), (r.randint(5, 25), -r.uniform(0.02, 0.08), 0.014)]
    tot = sum(l[0] for l in legs)
    legs[0] = (legs[0][0] + n - tot, legs[0][1], legs[0][2])
    return legs


def ticker(seed: int, end: str = '2026-10-23') -> List[Bar]:
    return series(seed, legs_for(seed), end=end)
