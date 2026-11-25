"""Trend lines by the owner's LINE-CHART rule (2026-11-25; checked against his hand-drawn lines on gold H4 and gold /
AUD weekly). The same rule as the TradingView BotView 1.2 (public/tools/RamanFX_BotView.pine: bvZz, bvZzLine).

    swings      read off the CLOSES (the line chart): a zigzag, a swing counts once price has reversed by K x ATR(14)
    pivot       the wick extreme within 2 candles of the close swing (the line is drawn wick to wick)
    real peak   the fall that follows it CLOSES below the valley before it (a new low) before the next peak forms; real
                valley mirrored. (A spike top whose fall holds above the last valley is not a pivot: the lower peak
                after it, whose fall does break down, is.)
    line        built forward in time, as a trader keeps it: the first two real peaks in a row, the newer one lower,
                no candle close beyond the line between them, not near-level; KEPT until a candle closes beyond it (later, smaller
                peaks do not move it); after a break both pivots of the next line must come after the break

Index convention as zones.Series: shift 0 = the phantom bar, 1 = the newest closed bar, larger = older. Pure.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence

K = 2.0
LOOKBACK = 300
WICK = 2
MIN_RISE = 1.0        # x ATR between the two pivots
MIN_SLOPE = 0.015     # x ATR per bar
KEEP = 360            # bars kept before a zone's move away when the line is read as of that moment


@dataclass
class Piv:
    bar: int
    p: float
    t: int            # +1 peak, -1 valley
    real: bool
    conf: int = -1    # shift of the close that made it real


@dataclass
class Line:
    dir: int          # +1 up line (under two valleys), -1 down line (over two peaks)
    a: int            # shift of the older pivot
    b: int            # shift of the newer pivot
    pa: float
    pb: float
    broken_at: int = -1

    def slope(self) -> float: return (self.pb - self.pa) / max(1, self.a - self.b)
    def at(self, j: float) -> float: return self.pb + self.slope() * (self.b - j)
    @property
    def live(self) -> bool: return self.broken_at < 0


def pivots(S, k: float = K, lookback: int = LOOKBACK) -> List[Piv]:
    """The line-chart swings, oldest first."""
    C = S.C
    bars = min(S.n - 3, lookback)
    if bars <= 20:
        return []
    zz = []
    hi = lo = bars
    d = 0
    for j in range(bars - 1, 0, -1):
        a = S.atr(j) or S.atr(1)
        if C[j] > C[hi]:
            hi = j
        if C[j] < C[lo]:
            lo = j
        if d >= 0 and C[hi] - C[j] >= k * a and hi > j:
            zz.append((hi, 1))
            d, lo, hi = -1, j, j
        elif d <= 0 and C[j] - C[lo] >= k * a and lo > j:
            zz.append((lo, -1))
            d, hi, lo = 1, j, j
    out: List[Piv] = []
    for i, (b, t) in enumerate(zz):
        # real: the swing that FOLLOWS it (up to the next swing of its own kind) closes beyond the swing before it
        real, conf = False, -1
        if i > 0:
            pv = zz[i - 1][0]
            end = zz[i + 2][0] if i + 2 < len(zz) else 0          # the next peak (valley): the following swing ends there
            for q in range(b - 1, end, -1):
                if (C[q] < C[pv]) if t > 0 else (C[q] > C[pv]):
                    real, conf = True, q
                    break
        wb = b
        for w in range(max(1, b - WICK), min(S.n - 1, b + WICK) + 1):
            if (S.H[w] > S.H[wb]) if t > 0 else (S.L[w] < S.L[wb]):
                wb = w
        out.append(Piv(wb, S.H[wb] if t > 0 else S.L[wb], t, real, conf))
    return out


def _broken(S, t: 'Line') -> int:
    return next((j for j in range(t.b - 1, 0, -1) if ((S.C[j] < t.at(j)) if t.dir > 0 else (S.C[j] > t.at(j)))), -1)


def line(S, piv: Sequence[Piv], d: int) -> Optional[Line]:
    """The line of side d (+1 under the valleys, -1 over the peaks), built forward in time as a trader keeps it: the
    first two real peaks in a row with the newer one lower (valleys: higher) and no candle close beyond the line between
    them; KEPT until a candle closes beyond it (later, smaller peaks do not move it); after a break the next line needs
    two real peaks that both come after the break. Live, or the last broken one (broken_at), or None."""
    live: Optional[Line] = None
    last: Optional[Line] = None
    prev: Optional[Piv] = None
    bound = S.n                                   # pivots must be newer than this shift (the last break)
    for p in piv:                                 # oldest first
        if p.t != -d or not p.real:
            continue
        if live is not None:
            if live.broken_at > 0 and live.broken_at > p.bar:      # it broke before this pivot formed: start over
                last, live, prev, bound = live, None, None, live.broken_at
            else:
                continue                                           # the line stands: this pivot does not move it
        if p.bar >= bound:
            continue
        if prev is not None and (p.p > prev.p if d > 0 else p.p < prev.p):
            t = Line(d, prev.bar, p.bar, prev.p, p.p)
            ab = max(S.atr(p.bar) or S.atr(1), 1e-12)
            flat = abs(t.pb - t.pa) < MIN_RISE * ab or abs(t.slope()) < MIN_SLOPE * ab     # a near-level line never breaks
            if not flat and not any((S.C[j] < t.at(j)) if d > 0 else (S.C[j] > t.at(j)) for j in range(prev.bar - 1, p.bar, -1)):
                t.broken_at = _broken(S, t)
                live = t
        prev = p
    return live if live is not None else last


def lines(S, k: float = K) -> Dict[int, Optional[Line]]:
    """{+1: the up line, -1: the down line} (each live, broken or None)."""
    piv = pivots(S, k)
    return {1: line(S, piv, 1), -1: line(S, piv, -1)}


def arrival(S, tf: str, zones, z) -> Optional[Dict]:
    """The arrival rule with the line-chart line, for ONE zone: its move away (the departure candle + up to 2 more
    strong candles) closed beyond the live trend line against it (read on the candles before the move) AND removed at
    least one opposite zone. -> {'n': zones removed, 'known': the shift it became true} or None."""
    import arrival as A
    L, d = z.leg_bar, z.dir
    legs = [L]
    j = L - 1
    while j >= 1 and len(legs) < 3 and S.cdir(j) == d and not S.basing(j):
        legs.append(j)
        j -= 1
    rem = [y for y in zones if y.dir == -d and y.removed and legs[-1] <= y.removed_bar <= L]
    if not rem or S.n - 1 - L < 30:
        return None
    T = A.closed_series(S, L + 1, tf, KEEP)
    t = line(T, pivots(T), -d)
    if t is None or not t.live:
        return None
    cross = next((k for k in legs if ((S.C[k] > t.at(k - L)) if d > 0 else (S.C[k] < t.at(k - L)))), None)
    if cross is None:
        return None
    return {'n': len(rem), 'known': min(cross, max(y.removed_bar for y in rem), z.sa_bar)}
