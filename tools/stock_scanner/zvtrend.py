"""ZoneVision trend lines (the chart rule) in Python: a 1:1 port of supabase/functions/telegram-bot/zvTrend.ts
(zvAtr, zvPivots, zvFitAnchor, zvLines, zvTouches), itself a port of public/tools/RFX_ZoneCore.mqh ZigZag / FitAnchor /
TooFlat / Confirmed / RemovedAt. NOT zones.trendlines() (the scanners' older Kevin construction): the Raja arrival /
realignment alerts (arrival.py) read these lines, so the alert and the bot's chart show the same line.

    real peak   swing high (2 bars each side, wicks) followed by a LOWER LOW before any later high goes above it
    real valley swing low followed by a HIGHER HIGH before any later low goes below it
    down line   the owner's state machine (zv_lines): the top is never a pivot; the first lower high after it -> the next
                lower high, FitAnchor re-anchored (clean anchors), not too flat; KEPT until a candle closes above it
    broken      a close beyond it -> broken_dn (stopped there), the structure restarts. Arrivals read the live lines only.

Index convention as zones.Series: shift 0 = the phantom forming bar, 1 = the newest closed bar, larger = older. Pure.
Parity: tools/telegram_bot/parity/arrival_fixtures.json (tests/test_arrival.py) against the TypeScript.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Callable, List, Optional

# the trend-line rule's tunable parameters (= zvTrend.ts ZV; the owner trains them later, keep the ports in step)
ZV = {'swing': 2, 'lookback': 200, 'tl_history': 3, 'fit_tol': 0.05, 'min_slope': 0.015, 'min_rise': 1.0}
VIRTUAL = ('3M', '6M', '12M')


@dataclass
class ZvPivot:
    bar: int
    p: float
    t: int              # -1 real valley, +1 real peak
    conf: int = 0       # shift at which it became known


@dataclass
class ZvLine:
    dir: int            # +1 up line (under two valleys), -1 down line (over two peaks)
    a: int              # shift of the older anchor
    b: int              # shift of the newer pivot
    pa: float
    pb: float
    cuts: int = 0
    broken_at: int = -1  # set only on the 'broken' lines kept in ZvResult.broken (shift of the full candle beyond it)

    def slope(self) -> float: return (self.pb - self.pa) / max(1, self.a - self.b)
    def at(self, j: float) -> float: return self.pb + self.slope() * (self.b - j)


@dataclass
class ZvResult:
    pivots: List[ZvPivot] = field(default_factory=list)
    up: Optional[ZvLine] = None
    dn: Optional[ZvLine] = None
    why_up: str = 'too few bars'
    why_dn: str = 'too few bars'
    # Python extra (not in zvTrend.ts, never changes up / dn): the line that WOULD be up / dn if no full candle had
    # closed beyond it (why = 'broken at shift k'): the alerts' "HTF line crossed too" test.
    broken_up: Optional[ZvLine] = None
    broken_dn: Optional[ZvLine] = None

    def line(self, d: int) -> Optional[ZvLine]: return self.up if d > 0 else self.dn
    def broken(self, d: int) -> Optional[ZvLine]: return self.broken_up if d > 0 else self.broken_dn


def zv_slope(t: ZvLine) -> float: return t.slope()
def zv_at(t: ZvLine, j: float) -> float: return t.at(j)


def zv_atr(S) -> Callable[[int], float]:
    """ATR(tf, shift) as ZoneVision reads it: MT5 iATR(14) (Series.atr) on real TFs, Wilder ATR(14) on 3M / 6M / 12M."""
    if S.tf not in VIRTUAL:
        return S.atr
    n = S.n
    a = [0.0] * n
    s, cnt = 0.0, 0
    for i in range(n - 1, -1, -1):          # oldest first
        tr = S.H[i] - S.L[i]
        if i < n - 1:
            tr = max(tr, abs(S.H[i] - S.C[i + 1]), abs(S.L[i] - S.C[i + 1]))
        cnt += 1
        if cnt < 14:
            s += tr
            continue
        if cnt == 14:
            s += tr
            a[i] = s / 14
            continue
        a[i] = (a[i + 1] * 13 + tr) / 14
    return lambda i: a[i] if 0 <= i < n else 0.0


def zv_pivots(S, bars: int, sw: int = ZV['swing']) -> List[ZvPivot]:
    """zvPivots: real valleys / peaks, oldest first. A swing high is a real PEAK when, before any later high goes above
    it, a later low goes below the most recent swing low before it; valleys mirrored. conf = the shift it became known."""
    Lo, Hi = S.L, S.H
    out: List[ZvPivot] = []

    def fr_low(i):
        for k in range(1, sw + 1):
            if i - k < 1 or Lo[i] > Lo[i + k] or Lo[i] >= Lo[i - k]:
                return False
        return True

    def fr_high(i):
        for k in range(1, sw + 1):
            if i - k < 1 or Hi[i] < Hi[i + k] or Hi[i] <= Hi[i - k]:
                return False
        return True
    fH = fL = -1
    for i in range(bars, sw, -1):
        lo, hi = fr_low(i), fr_high(i)
        if lo and fH > 0:
            for j in range(i - 1, 0, -1):
                if Lo[j] < Lo[i]:
                    break
                if Hi[j] > Hi[fH]:
                    out.append(ZvPivot(i, Lo[i], -1, min(j, i - sw)))
                    break
        if hi and fL > 0:
            for j in range(i - 1, 0, -1):
                if Hi[j] > Hi[i]:
                    break
                if Lo[j] < Lo[fL]:
                    out.append(ZvPivot(i, Hi[i], 1, min(j, i - sw)))
                    break
        if lo:
            fL = i
        if hi:
            fH = i
    return out


def zv_fit_anchor(S, A: int, b2: int, p2: float, d: int, atr: Optional[Callable[[int], float]] = None) -> int:
    """MQL FitAnchor(A, b2, p2, d): while a candle strictly between the anchors pokes through the line (A's wick ->
    (b2, p2)) by more than 0.05 x ATR(1), the candle poking furthest becomes the new older anchor; at most 50 rounds."""
    tol = ZV['fit_tol'] * (atr or zv_atr(S))(1)
    a = A
    for _ in range(50):
        sl = (p2 - (S.L[a] if d > 0 else S.H[a])) / (a - b2)
        worst, ex = -1, tol
        for j in range(a - 1, b2, -1):
            lv = p2 + sl * (b2 - j)
            e = lv - S.L[j] if d > 0 else S.H[j] - lv
            if e > ex:
                ex, worst = e, j
        if worst < 0:
            return a
        a = worst
    return a


def zv_pair(S, o: ZvPivot, n: ZvPivot, d: int, atr=None) -> Optional[ZvLine]:
    """zvPair: the line o (older) -> n (newer), FitAnchor re-anchored (clean anchors); None when in the wrong order or
    too flat (< 0.015 ATR per bar or < ZV['min_rise'] ATR between the anchors, ATR at the newer pivot)."""
    atr = atr or zv_atr(S)
    if not (n.p > o.p if d > 0 else n.p < o.p):
        return None
    a = zv_fit_anchor(S, o.bar, n.bar, n.p, d, atr)
    t = ZvLine(d, a, n.bar, S.L[a] if d > 0 else S.H[a], n.p)
    if not (t.pb > t.pa if d > 0 else t.pb < t.pa):
        return None
    ab = max(atr(t.b), 1e-12)
    if abs(t.slope()) < ZV['min_slope'] * ab or abs(t.pb - t.pa) < ZV['min_rise'] * ab:
        return None
    return t


def zv_lines(S) -> ZvResult:
    """zvLines: the owner's state machine over the real pivots in bar order (down line; up mirrored): the top is never a
    pivot; pivot 1 = the first lower real peak after it (a higher one under the top replaces it, one above the top is
    the new top); pivot 2 = the next peak lower than pivot 1 -> zv_pair. The line is kept until a candle CLOSES beyond
    it -> broken (broken_at; the structure restarts: the next peak is the new top). up / dn = live, broken_up /
    broken_dn = the most recent broken line. Arrivals read the live lines only."""
    res = ZvResult()
    bars = min(ZV['lookback'], S.n - 1 - ZV['swing'])
    if bars <= ZV['swing'] + 2:
        return res
    atr = zv_atr(S)
    C = S.C
    piv = res.pivots = zv_pivots(S, bars)
    for d in (1, -1):
        ps = sorted([p for p in piv if p.t == (-1 if d > 0 else 1)], key=lambda p: -p.bar)

        def beyond(t, j, d=d):
            return C[j] < t.at(j) if d > 0 else C[j] > t.at(j)

        def above(x, y, d=d):
            return x < y if d > 0 else x > y
        st = {'ext': None, 'p1': None, 'live': None, 'brk': None, 'seen': []}
        k = 0
        why = f"no real {'valleys' if d > 0 else 'peaks'}"

        def kill(at, st=st):
            if st['live'] is not None:
                st['live'].broken_at = at
                st['brk'], st['live'] = st['live'], None
        for j in range(bars, 0, -1):
            live = st['live']
            if live is not None and j < live.b and beyond(live, j):
                kill(j)
                why = f'broken at shift {j}'
            xj = S.L[j] if d > 0 else S.H[j]
            if st['ext'] is None or above(xj, st['ext'].p):        # the TOP: the highest high (wick), any candle
                kill(j)
                st['ext'], st['p1'], st['seen'] = ZvPivot(j, xj, -1 if d > 0 else 1, j), None, []
                why = f"no {'higher low' if d > 0 else 'lower high'} after the {'bottom' if d > 0 else 'top'}"
            while k < len(ps) and ps[k].bar >= j:
                p = ps[k]
                k += 1
                if not above(st['ext'].p, p.p):                    # at the top's level (the top itself): never a pivot
                    continue
                p1 = st['p1']
                if p1 is None or not above(p1.p, p.p):               # at / beyond pivot 1: structure change
                    kill(p.bar)
                    st['p1'], st['seen'] = p, []
                    why = f"one {'higher low' if d > 0 else 'lower high'} so far"
                    continue
                st['seen'].append(p)
                if st['live'] is not None:
                    continue
                sl = lambda x, p1=p1: (x.p - p1.p) / (p1.bar - x.bar)  # noqa: E731
                order = sorted(st['seen'], key=lambda x: ((sl(x) if d > 0 else -sl(x)), x.bar))
                t = None
                for q in order:
                    t = zv_pair(S, p1, q, d, atr)
                    if t is not None:
                        break
                if t is None:
                    why = 'too flat'
                    continue
                bj = -1
                for x in range(t.b - 1, j - 1, -1):
                    if beyond(t, x):
                        bj = x
                        break
                if bj >= 0:
                    t.broken_at = bj
                    st['brk'] = t
                    why = f'broken at shift {bj}'
                    continue
                st['live'], why = t, 'ok'
        live, brk = st['live'], st['brk']
        if d > 0:
            res.up, res.broken_up, res.why_up = live, brk, why
        else:
            res.dn, res.broken_dn, res.why_dn = live, brk, why
    return res


def zv_touches(S, t: ZvLine) -> int:
    """RjA_LineTouches: separate visits within 0.1 ATR of the line, from the older anchor to the newest closed bar."""
    tol = 0.1 * zv_atr(S)(1)
    n, in_t = 0, False
    for j in range(t.a, 0, -1):
        lv = t.at(j)
        touch = S.L[j] <= lv + tol if t.dir > 0 else S.H[j] >= lv - tol
        if touch and not in_t:
            n += 1
        in_t = touch
    return n
