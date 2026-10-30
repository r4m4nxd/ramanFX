"""ZoneVision trend lines (the chart rule) in Python: a 1:1 port of supabase/functions/telegram-bot/zvTrend.ts
(zvAtr, zvPivots, zvFitAnchor, zvLines, zvTouches), itself a port of public/tools/RFX_ZoneCore.mqh ZigZag / FitAnchor /
TooFlat / Confirmed / RemovedAt. NOT zones.trendlines() (the scanners' older Kevin construction): the Raja arrival /
realignment alerts (arrival.py) read these lines, so the alert and the bot's chart show the same line.

    real peak   swing high (2 bars each side, wicks) followed by a LOWER LOW before any later high goes above it
    real valley swing low followed by a HIGHER HIGH before any later low goes below it
    down line   the two most recent real peaks (newer lower), wick to wick; a candle between them poking through the
                line by > 0.05 ATR becomes the older anchor (FitAnchor, repeated)
    dropped     too flat (|slope| < 0.015 ATR / bar or < 1.5 ATR between the anchors), not confirmed (no new low below
                everything between the anchors before a full candle crossed it), or broken (a full closed candle beyond it)

Index convention as zones.Series: shift 0 = the phantom forming bar, 1 = the newest closed bar, larger = older. Pure.
Parity: tools/telegram_bot/parity/arrival_fixtures.json (tests/test_arrival.py) against the TypeScript.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Callable, List, Optional

ZV = {'swing': 2, 'lookback': 200, 'tl_history': 3}
VIRTUAL = ('3M', '6M', '12M')


@dataclass
class ZvPivot:
    bar: int
    p: float
    t: int              # -1 real valley, +1 real peak


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
    """MQL ZigZag(bars): real valleys / peaks, oldest first."""
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
                    out.append(ZvPivot(i, Lo[i], -1))
                    break
        if hi and fL > 0:
            for j in range(i - 1, 0, -1):
                if Hi[j] > Hi[i]:
                    break
                if Lo[j] < Lo[fL]:
                    out.append(ZvPivot(i, Hi[i], 1))
                    break
        if lo:
            fL = i
        if hi:
            fH = i
    return out


def zv_fit_anchor(S, A: int, b2: int, p2: float, d: int, atr: Optional[Callable[[int], float]] = None) -> int:
    """MQL FitAnchor(A, b2, p2, d): while a candle strictly between the anchors pokes through the line (A's wick ->
    (b2, p2)) by more than 0.05 x ATR(1), the candle poking furthest becomes the new older anchor; at most 50 rounds."""
    tol = 0.05 * (atr or zv_atr(S))(1)
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


def zv_lines(S) -> ZvResult:
    """The chart's two lines of one timeframe (closed bars + the phantom in S)."""
    res = ZvResult()
    bars = min(ZV['lookback'], S.n - 1 - ZV['swing'])
    if bars <= ZV['swing'] + 2:
        return res
    Lo, Hi = S.L, S.H
    atr = zv_atr(S)
    piv = res.pivots = zv_pivots(S, bars)
    for d in (1, -1):
        def put(why: str, t: Optional[ZvLine] = None, d=d):
            if d > 0:
                res.why_up, res.up = why, t
            else:
                res.why_dn, res.dn = why, t
        ps = [p for p in piv if p.t == (-1 if d > 0 else 1)]
        if len(ps) < 2:
            put(f"fewer than two real {'valleys' if d > 0 else 'peaks'}")
            continue
        o, nw = ps[-2], ps[-1]
        if not (nw.p > o.p if d > 0 else nw.p < o.p):
            put('newer valley not higher' if d > 0 else 'newer peak not lower')
            continue
        a = zv_fit_anchor(S, o.bar, nw.bar, nw.p, d, atr)
        t = ZvLine(d, a, nw.bar, Lo[a] if d > 0 else Hi[a], nw.p)
        if not (t.pb > t.pa if d > 0 else t.pb < t.pa):
            put('newer valley not higher' if d > 0 else 'newer peak not lower')
            continue
        sl = t.slope()
        ab = max(atr(t.b), 1e-12)
        if abs(sl) < 0.015 * ab or abs(t.pb - t.pa) < 1.5 * ab:
            put('too flat')
            continue
        ext = -math.inf if d > 0 else math.inf
        for j in range(t.a - 1, t.b, -1):
            ext = max(ext, Hi[j]) if d > 0 else min(ext, Lo[j])
        conf = False
        if math.isfinite(ext):
            for j in range(t.b - 1, 0, -1):
                lv = t.at(j)
                if (d > 0 and Hi[j] < lv) or (d < 0 and Lo[j] > lv):
                    break
                if (d > 0 and Hi[j] > ext) or (d < 0 and Lo[j] < ext):
                    conf = True
                    break
        if not conf:
            put('not confirmed')
            continue
        rm = -1
        for j in range(t.b - 1, 0, -1):
            lv = t.at(j)
            if (d > 0 and Hi[j] < lv) or (d < 0 and Lo[j] > lv):
                rm = j
                break
        if rm >= 0:
            put(f'broken at shift {rm}')
            t.broken_at = rm
            if d > 0:
                res.broken_up = t
            else:
                res.broken_dn = t
            continue
        tol = 0.05 * atr(1)
        for j in range(t.a - 1, t.b, -1):
            if (t.at(j) - Lo[j] if d > 0 else Hi[j] - t.at(j)) > tol:
                t.cuts += 1
        put('ok', t)
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
