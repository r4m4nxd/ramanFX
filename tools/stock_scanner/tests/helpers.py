import datetime as dt
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures')):
    if p not in sys.path:
        sys.path.insert(0, p)

from zones import Bar  # noqa: E402


def bars_from_closes(closes, wick=0.3, start=dt.date(2025, 1, 6)):
    """Business-day bars: open = previous close, wicks `wick` beyond the body."""
    out, d, p = [], start, closes[0]
    for c in closes:
        while d.weekday() >= 5:
            d += dt.timedelta(days=1)
        out.append(Bar(d.isoformat(), p, max(p, c) + wick, min(p, c) - wick, c))
        p = c
        d += dt.timedelta(days=1)
    return out


def path(points, step=1.0):
    """Straight segments between the points, about `step` per bar."""
    cl = [points[0]]
    for a, b in zip(points, points[1:]):
        n = max(2, int(abs(b - a) / step))
        cl += [a + (b - a) * k / n for k in range(1, n + 1)]
    return cl
