"""Trend lines by the owner's LINE-CHART rule (2026-11-25; checked against his hand-drawn lines on gold H4 and gold /
AUD weekly). The same rule as the TradingView BotView 1.2 (public/tools/RamanFX_BotView.pine: bvZz, bvZzLine).

    swings      read off the CLOSES (the line chart): a zigzag, a swing counts once price has reversed by K x ATR(14)
    pivot       the wick extreme within 2 candles of the close swing (the line is drawn wick to wick)
    real peak   price then CLOSED below the valley before it (a new low); real valley: closed above the peak before it
    line        the newest real peak (valley) + the nearest older real one above (below) it, with no candle close
                beyond the line between the two (else the next older one); live until a candle closes beyond it

Index convention as zones.Series: shift 0 = the phantom bar, 1 = the newest closed bar, larger = older. Pure.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence

K = 2.0
LOOKBACK = 300
WICK = 2
KEEP = 360            # bars kept before a zone's move away when the line is read as of that moment


@dataclass
class Piv:
    bar: int
    p: float
    t: int            # +1 peak, -1 valley
    real: bool


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
        pv = next((zz[x][0] for x in range(i - 1, -1, -1) if zz[x][1] == -t), -1)
        real = False
        if pv > 0:
            for q in range(b - 1, 0, -1):
                if (C[q] > C[b]) if t > 0 else (C[q] < C[b]):
                    break
                if (C[q] < C[pv]) if t > 0 else (C[q] > C[pv]):
                    real = True
                    break
        wb = b
        for w in range(max(1, b - WICK), min(S.n - 1, b + WICK) + 1):
            if (S.H[w] > S.H[wb]) if t > 0 else (S.L[w] < S.L[wb]):
                wb = w
        out.append(Piv(wb, S.H[wb] if t > 0 else S.L[wb], t, real))
    return out


def line(S, piv: Sequence[Piv], d: int) -> Optional[Line]:
    """The line of side d (+1 under the valleys, -1 over the peaks), live or broken (broken_at); None when there is none."""
    ni = next((i for i in range(len(piv) - 1, -1, -1) if piv[i].t == -d and piv[i].real), -1)
    if ni < 0:
        return None
    n = piv[ni]
    for i in range(ni - 1, -1, -1):
        o = piv[i]
        if not (o.t == -d and o.real and o.bar > n.bar and (n.p > o.p if d > 0 else n.p < o.p)):
            continue
        t = Line(d, o.bar, n.bar, o.p, n.p)
        if any((S.C[j] < t.at(j)) if d > 0 else (S.C[j] > t.at(j)) for j in range(o.bar - 1, n.bar, -1)):
            continue
        t.broken_at = next((j for j in range(n.bar - 1, 0, -1) if ((S.C[j] < t.at(j)) if d > 0 else (S.C[j] > t.at(j)))), -1)
        return t
    return None


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
