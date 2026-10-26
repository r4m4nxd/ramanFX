"""Python port of the ZoneVision Raja-template logic (public/tools/RFX_ZoneCore.mqh + RamanFX_ZoneVision.mq5,
settings from public/tools/ZV_Template_Raja.set) for daily stock data.

Only what the stock scanner needs is ported: zone detection (D1 / W1 / MN), Kevin-style trendlines (used by
Raja's arrival and direction rules), HtfTrend swings, the Direction engine rows for the Raja table D1 -> W1 -> MN,
the Raja curve, the zone DNA fields behind Raja's zone types (ARR / WOW / STR / OVL / FLP / TST / WK), the Raja lens
vetoes and the sideways check.

Index convention (kept from MQL so the port reads line by line against the source): a Series is indexed by SHIFT,
0 = the forming bar (here a phantom bar at the current price), 1 = the newest CLOSED bar, larger = older. Every loop
that the MQL runs "j >= 1" runs over closed bars only, so no forming data leaks into the rules.

All functions are pure: they take a Series (and lists built from it) and return values / small objects.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Sequence, Tuple

# ---- settings: ZV_Template_Raja.set (only the inputs the ported functions read) -------------------------------
RAJA = {
    'min_leg_ratio': 1.2,      # InpMinLegRatio
    'max_base': 6,             # InpMaxBase
    'max_zone_atr': 1.5,       # InpMaxZoneATR
    'lookback': 200,           # InpLookback
    'max_zone_age': 200,       # InpMaxZoneAge
    'emo_atr': 3.0,            # InpEmoATR
    'tl_swing': 2,             # InpTLSwing
    'removal_mode': 1,         # InpRemovalMode=1 (Raja: removed only by a candle close)
    'dir_removed_n': 2,        # InpDirRemovedN (direction changed = 2 opposite zones removed)
    'dir_depart_atr': 0.6,     # InpDirDepartATR (trendline cross = departure close, body >= 0.6 ATR)
    'raja_removal': True,      # InpRajaRemoval (direction counts a zone removed after a 2nd big close)
    'raja_big_body': 0.6,      # InpRajaBigBody
    'curve_low': 25,           # InpCurveLow
    'curve_high': 75,          # InpCurveHigh
    'chop_swings': 3,          # InpRjBChopSwings
    'chop_tf_htf': True,       # InpRjBChopTF=1 (zone TF or the Direction HTF)
    'sl_pct': {'D1': 10.0, 'W1': 5.0, 'MN': 3.0},   # InpSlPctD1 / InpSlPctW1 / MN (owner's stop rule)
    'sl_min': 0.03,            # InpSlMinPips=3 with a 0.01 point on stocks
    'atr_period': 14,          # iATR(_Symbol, tf, 14)
}

DST_NA, DST_TREND, DST_TURN, DST_CHG, DST_PULL, DST_RANGE = 0, 1, 2, 3, 4, 5
STATE_NAME = {DST_NA: 'n/a', DST_TREND: 'TREND', DST_TURN: 'TURNING', DST_CHG: 'CHANGED', DST_PULL: 'PULLBACK', DST_RANGE: 'RANGE'}
TF_CLASS = {'D1': 2, 'W1': 2, 'MN': 3}


@dataclass
class Bar:
    d: str          # ISO date of the bar's first trading day
    o: float
    h: float
    l: float
    c: float
    v: float = 0.0


class Series:
    """Closed bars (oldest first) re-indexed by shift; shift 0 = a phantom forming bar at `price`."""

    def __init__(self, bars: Sequence[Bar], price: Optional[float] = None, tf: str = 'D1', atr_period: int = 14):
        p = bars[-1].c if price is None and bars else (price or 0.0)
        rb = list(reversed(bars))
        self.tf = tf
        self.price = p
        self.O = [p] + [b.o for b in rb]
        self.H = [p] + [b.h for b in rb]
        self.L = [p] + [b.l for b in rb]
        self.C = [p] + [b.c for b in rb]
        self.T = [rb[0].d if rb else ''] + [b.d for b in rb]
        self.V = [0.0] + [float(b.v or 0) for b in rb]
        self.n = len(self.C)            # SBars (includes the forming bar, like MQL)
        n = self.n
        tr = [0.0] * n
        for i in range(n - 1):
            pc = self.C[i + 1]
            tr[i] = max(self.H[i], pc) - min(self.L[i], pc)
        # MT5 iATR(14): simple average of the true range over 14 bars ending at the shift
        self._atr = [0.0] * n
        s = 0.0
        for i in range(n - 2, -1, -1):
            s += tr[i]
            if i + atr_period <= n - 2:
                s -= tr[i + atr_period]
            if i + atr_period <= n - 1:
                self._atr[i] = s / atr_period

    def atr(self, i: int) -> float:
        return self._atr[i] if 0 <= i < self.n else 0.0

    def rng(self, i): return self.H[i] - self.L[i]
    def body(self, i): return abs(self.C[i] - self.O[i])
    def basing(self, i): r = self.rng(i); return r > 0 and self.body(i) / r < 0.5
    def cdir(self, i): return 1 if self.C[i] > self.O[i] else (-1 if self.C[i] < self.O[i] else 0)

    def emotional(self, i, emo_atr=RAJA['emo_atr']):
        a = self.atr(i + 1)
        return a > 0 and self.rng(i) > emo_atr * a

    def highest(self, count: int, start: int) -> int:
        """SHighest(MODE_HIGH, count, start): shift of the highest high (newest on ties); -1 if empty."""
        end = min(self.n, start + count)
        if start >= end:
            return -1
        best = start
        for i in range(start + 1, end):
            if self.H[i] > self.H[best]:
                best = i
        return best

    def lowest(self, count: int, start: int) -> int:
        end = min(self.n, start + count)
        if start >= end:
            return -1
        best = start
        for i in range(start + 1, end):
            if self.L[i] < self.L[best]:
                best = i
        return best


# ---- zones ---------------------------------------------------------------------------------------------------
@dataclass
class Zone:
    tf: str
    dir: int            # +1 demand, -1 supply
    prox: float
    dist: float
    leg_bar: int        # L (shift of the departure candle)
    base_n: int         # k
    sa_bar: int         # stay-away candle (L - 1)
    leg_ratio: float
    cont: bool          # CP (RBR / DBD) vs PV (DBR / RBD)
    gap: float
    leg2: bool
    tested: bool = False
    tested_bar: int = -1
    removed: bool = False
    removed_bar: int = -1
    base_start: str = ''   # date of the oldest base candle (stable id)
    made: str = ''         # date of the stay-away candle (the zone is known when it closes)

    @property
    def h(self) -> float: return abs(self.prox - self.dist)
    @property
    def lo(self) -> float: return min(self.prox, self.dist)
    @property
    def hi(self) -> float: return max(self.prox, self.dist)
    @property
    def base_end(self) -> int: return self.leg_bar + self.base_n
    @property
    def zid(self) -> str: return f"{self.tf}:{'D' if self.dir > 0 else 'S'}:{self.base_start}"
    @property
    def pattern(self) -> str:
        return ('RBR' if self.cont else 'DBR') if self.dir > 0 else ('DBD' if self.cont else 'RBD')


def detect(S: Series, p=RAJA) -> List[Zone]:
    """Detect(): base 1-6 basing candles + a departure >= 1.2x the biggest base candle, proximal on the base bodies,
    distal on the wicks (base + departure), zone <= 1.5 ATR, stay-away candle leaves space. Removal by a close only
    (InpRemovalMode=1). Oldest zone first."""
    out: List[Zone] = []
    bars = min(p['lookback'], S.n - p['max_base'] - 3)
    for L in range(bars, 1, -1):
        lr = S.rng(L)
        if lr <= 0 or S.basing(L):
            continue
        d = S.cdir(L)
        if d == 0:
            continue
        k = 0
        max_base = 0.0
        while k < p['max_base'] and S.basing(L + 1 + k):
            max_base = max(max_base, S.rng(L + 1 + k))
            k += 1
        if k == 0 or max_base <= 0:
            continue
        ratio = lr / max_base
        if ratio < p['min_leg_ratio']:
            continue
        cont = S.cdir(L + 1 + k) == d
        if d > 0:
            prox = max(max(S.O[b], S.C[b]) for b in range(L + 1, L + k + 1))
            dist = min(min(S.L[b] for b in range(L + 1, L + k + 1)), S.L[L])
        else:
            prox = min(min(S.O[b], S.C[b]) for b in range(L + 1, L + k + 1))
            dist = max(max(S.H[b] for b in range(L + 1, L + k + 1)), S.H[L])
        h = abs(prox - dist)
        atr = S.atr(L)
        if h <= 0:
            continue
        if atr > 0 and h > p['max_zone_atr'] * atr:
            continue
        sa = L - 1
        if (d > 0 and S.L[sa] <= prox) or (d < 0 and S.H[sa] >= prox):
            continue
        z = Zone(tf=S.tf, dir=d, prox=prox, dist=dist, leg_bar=L, base_n=k, sa_bar=sa, leg_ratio=ratio, cont=cont,
                 gap=((S.L[sa] - prox) / h if d > 0 else (prox - S.H[sa]) / h),
                 leg2=(sa >= 1 and not S.basing(sa) and S.cdir(sa) == d and S.rng(sa) >= max_base * p['min_leg_ratio']),
                 base_start=S.T[L + k], made=S.T[sa])
        wick = p['removal_mode'] == 0
        for j in range(sa - 1, 0, -1):
            if d > 0:
                if S.C[j] < dist or (wick and S.L[j] < dist and not S.emotional(j)):
                    z.removed, z.removed_bar = True, j
                    break
                if not z.tested and S.L[j] <= prox and not S.emotional(j):
                    z.tested, z.tested_bar = True, j
            else:
                if S.C[j] > dist or (wick and S.H[j] > dist and not S.emotional(j)):
                    z.removed, z.removed_bar = True, j
                    break
                if not z.tested and S.H[j] >= prox and not S.emotional(j):
                    z.tested, z.tested_bar = True, j
        out.append(z)
    return out


def fresh_at(S: Series, z: Zone) -> bool:
    """DirFreshAt: not removed, and untested or touched only by the visit still going on."""
    if z.removed:
        return False
    if not z.tested:
        return True
    for j in range(z.tested_bar, 0, -1):
        if S.L[j] > z.hi or S.H[j] < z.lo:
            return False
    return True


def raja_removed(S: Series, z: Zone, p=RAJA) -> int:
    """DirRajaRemoved: a close beyond the distal and the next candle also closing beyond it with a big body."""
    for j in range(z.sa_bar - 1, 1, -1):
        c1 = S.C[j] < z.dist if z.dir > 0 else S.C[j] > z.dist
        if not c1:
            continue
        k = j - 1
        c2 = S.C[k] < z.dist if z.dir > 0 else S.C[k] > z.dist
        a = S.atr(k)
        if c2 and a > 0 and S.body(k) >= p['raja_big_body'] * a:
            return k
    return -1


# ---- trendlines (Kevin's construction, used by the Raja rules) ---------------------------------------------------
@dataclass
class TLine:
    dir: int            # +1 up line (valleys), -1 down line (peaks)
    a: int
    b: int
    pa: float
    pb: float
    removed: bool
    removed_bar: int
    conf: bool
    cross_bar: int = -1  # DirCrossBar (Raja departure close), -1 = not crossed

    def slope(self) -> float: return (self.pb - self.pa) / max(1, self.a - self.b)
    def at(self, j: int) -> float: return self.pb + self.slope() * (self.b - j)


@dataclass
class TLState:
    lines: List[TLine] = field(default_factory=list)
    up_on: bool = False
    dn_on: bool = False
    up: Optional[TLine] = None
    dn: Optional[TLine] = None
    up_w: float = 0.0
    dn_w: float = 0.0
    up_touches: int = 0
    dn_touches: int = 0


def _line_at(p2, b, sl, j): return p2 + sl * (b - j)


def trendlines(S: Series, p=RAJA) -> TLState:
    sw = p['tl_swing']
    Lo, Hi = S.L, S.H
    st = TLState()
    bars = min(p['lookback'], S.n - 20)
    if bars <= sw + 2:
        return st

    def fr_low(i):
        for k in range(1, sw + 1):
            if i - k < 1 or i + k >= S.n or Lo[i] > Lo[i + k] or Lo[i] >= Lo[i - k]:
                return False
        return True

    def fr_high(i):
        for k in range(1, sw + 1):
            if i - k < 1 or i + k >= S.n or Hi[i] < Hi[i + k] or Hi[i] <= Hi[i - k]:
                return False
        return True

    # ZigZag: real valleys / peaks, oldest first
    piv = []  # (bar, price, type) type -1 valley, +1 peak
    fH = fL = -1
    for i in range(bars, sw, -1):
        lo, hi = fr_low(i), fr_high(i)
        if lo and fH > 0:
            for j in range(i - 1, 0, -1):
                if Lo[j] < Lo[i]:
                    break
                if Hi[j] > Hi[fH]:
                    piv.append((i, Lo[i], -1))
                    break
        if hi and fL > 0:
            for j in range(i - 1, 0, -1):
                if Hi[j] > Hi[i]:
                    break
                if Lo[j] < Lo[fL]:
                    piv.append((i, Hi[i], 1))
                    break
        if lo:
            fL = i
        if hi:
            fH = i

    atr1 = S.atr(1)

    def fit_anchor(A, b2, p2, d):
        a = A
        tol = 0.05 * atr1
        sl = 0.0
        for _ in range(50):
            sl = (p2 - (Lo[a] if d > 0 else Hi[a])) / (a - b2)
            worst, ex = -1, tol
            for j in range(a - 1, b2, -1):
                lv = _line_at(p2, b2, sl, j)
                e = lv - Lo[j] if d > 0 else Hi[j] - lv
                if e > ex:
                    ex, worst = e, j
            if worst < 0:
                return a, sl
            a = worst
        sl = (p2 - (Lo[a] if d > 0 else Hi[a])) / (a - b2)
        return a, sl

    def removed_at(b2, p2, sl, d):
        for j in range(b2 - 1, 0, -1):
            lv = _line_at(p2, b2, sl, j)
            if (d > 0 and Hi[j] < lv) or (d < 0 and Lo[j] > lv):
                return j
        return -1

    def confirmed(a, b2, p2, sl, d):
        if a - 1 <= b2:
            return False
        ext = max(Hi[j] for j in range(a - 1, b2, -1)) if d > 0 else min(Lo[j] for j in range(a - 1, b2, -1))
        for j in range(b2 - 1, 0, -1):
            lv = _line_at(p2, b2, sl, j)
            if (d > 0 and Hi[j] < lv) or (d < 0 and Lo[j] > lv):
                return False
            if (d > 0 and Hi[j] > ext) or (d < 0 and Lo[j] < ext):
                return True
        return False

    def too_flat(a, b2, p2, sl):
        atr = max(S.atr(b2), 1e-9)
        return abs(sl) < 0.015 * atr or abs(p2 - _line_at(p2, b2, sl, a)) < 1.5 * atr

    def add(d, a, b2, p2, sl, overall):
        rb = removed_at(b2, p2, sl, d)
        st.lines.append(TLine(dir=d, a=a, b=b2, pb=p2, pa=_line_at(p2, b2, sl, a), removed=rb >= 0, removed_bar=rb, conf=not overall))

    for d in (-1, 1):
        want = -1 if d > 0 else 1
        prevB, prevP, lastA = -1, 0.0, -1
        for (b2, p2, t) in piv:
            if t != want:
                continue
            pb, pp = prevB, prevP
            prevB, prevP = b2, p2
            a = -1
            sl = 0.0
            A = S.lowest(bars - b2, b2 + 1) if d > 0 else S.highest(bars - b2, b2 + 1)
            if A > b2 and (Lo[A] < p2 if d > 0 else Hi[A] > p2):
                a, sl = fit_anchor(A, b2, p2, d)
                if too_flat(a, b2, p2, sl):
                    a = -1
            if a < 0 and pb > 0 and (pp < p2 if d > 0 else pp > p2):
                a, sl = fit_anchor(pb, b2, p2, d)
                if too_flat(a, b2, p2, sl):
                    a = -1
            if a < 0 and lastA > b2 and (Lo[lastA] < p2 if d > 0 else Hi[lastA] > p2):
                a, sl = fit_anchor(lastA, b2, p2, d)
                if too_flat(a, b2, p2, sl):
                    a = -1
            if a < 0:
                continue
            if not confirmed(a, b2, p2, sl, d):
                continue
            if st.lines and st.lines[-1].dir == d and st.lines[-1].a == a:
                st.lines.pop()
            add(d, a, b2, p2, sl, False)
            lastA = a
        # overall line from the very bottom / top of the window
        O = S.lowest(bars, 1) if d > 0 else S.highest(bars, 1)
        if O < 0:
            continue
        ov = Lo[O] if d > 0 else Hi[O]
        bs, bk = 0.0, -1
        for k, (pbar, pprice, t) in enumerate(piv):
            if t != want or pbar >= O - 1:
                continue
            s0 = (pprice - ov) / (O - pbar)
            if (d > 0 and s0 <= 0) or (d < 0 and s0 >= 0):
                continue
            if bk < 0 or (s0 < bs if d > 0 else s0 > bs):
                bk, bs = k, s0
        if bk >= 0:
            b2, p2 = piv[bk][0], piv[bk][1]
            a, sl = fit_anchor(O, b2, p2, d)
            dup = any(x.dir == d and (x.a == a or x.b == b2) for x in st.lines)
            if not dup and not too_flat(a, b2, p2, sl) and confirmed(a, b2, p2, sl, d):
                add(d, a, b2, p2, sl, True)
                if st.lines[-1].removed:
                    st.lines.pop()
    # the newest respected line each way (gUpOn / gDnOn) and its channel width
    for d in (-1, 1):
        newest = -1
        for i, x in enumerate(st.lines):
            if x.dir == d and x.conf and (newest < 0 or x.b < st.lines[newest].b):
                newest = i
        use = newest if newest >= 0 and not st.lines[newest].removed else -1
        if use < 0:
            for i, x in enumerate(st.lines):
                if x.dir == d and not x.conf and not x.removed:
                    use = i
        if use >= 0:
            t = st.lines[use]
            w = 0.0
            for j in range(t.a, 0, -1):
                w = max(w, Hi[j] - t.at(j) if d > 0 else t.at(j) - Lo[j])
            if d > 0:
                st.up_on, st.up, st.up_w, st.up_touches = True, t, w, line_touches(S, t)
            else:
                st.dn_on, st.dn, st.dn_w, st.dn_touches = True, t, w, line_touches(S, t)
    for t in st.lines:
        t.cross_bar = cross_bar(S, t, p)
    return st


def line_touches(S: Series, t: TLine) -> int:
    """RjA_LineTouches: separate visits within 0.1 ATR of the line, from the anchor to the break / last closed bar."""
    tol = 0.1 * S.atr(1)
    end = t.removed_bar + 1 if t.removed else 1
    n, in_t = 0, False
    for j in range(t.a, max(end, 1) - 1, -1):
        lv = t.at(j)
        touch = S.L[j] <= lv + tol if t.dir > 0 else S.H[j] >= lv - tol
        if touch and not in_t:
            n += 1
        in_t = touch
    return n


def cross_bar(S: Series, t: TLine, p=RAJA) -> int:
    """DirCrossBar with InpDirDepartATR > 0 (Raja): a close beyond the line by a candle in the break direction whose
    body is >= 0.6 ATR. -1 = not crossed."""
    if p['dir_depart_atr'] <= 0:
        return t.removed_bar if t.removed else -1
    for j in range(t.b - 1, 0, -1):
        lv, a, c = t.at(j), S.atr(j), S.C[j]
        beyond = c < lv if t.dir > 0 else c > lv
        if beyond and S.cdir(j) == -t.dir and a > 0 and S.body(j) >= p['dir_depart_atr'] * a:
            return j
    return -1


def tl_cross_in(tl: TLState, ldir: int, lo: int, hi: int) -> bool:
    """RjA_TLCrossIn: a line of direction ldir crossed (Raja departure close) on a bar in [lo, hi]."""
    return any(t.dir == ldir and t.cross_bar >= 0 and lo <= t.cross_bar <= hi for t in tl.lines)


# ---- swings ----------------------------------------------------------------------------------------------------
def frac_up(S: Series, i: int) -> float:
    n = S.n
    if i < 2 or i + 2 > n - 1:
        return 0.0
    H = S.H
    c = H[i]
    if not (c > H[i - 1] and c > H[i - 2]):
        return 0.0
    p1, p2 = H[i + 1], H[i + 2]
    if c > p1 and c > p2:
        return c
    r = n - i - 1
    if r >= 3 and c == p1 and c > p2 and c > H[i + 3]:
        return c
    if r >= 4 and c >= p1 and c == p2 and c > H[i + 3] and c > H[i + 4]:
        return c
    if r >= 5 and c >= p1 and c == p2 and c == H[i + 3] and c > H[i + 4] and c > H[i + 5]:
        return c
    if r >= 6 and c >= p1 and c == p2 and c >= H[i + 3] and c == H[i + 4] and c > H[i + 5] and c > H[i + 6]:
        return c
    return 0.0


def frac_dn(S: Series, i: int) -> float:
    n = S.n
    if i < 2 or i + 2 > n - 1:
        return 0.0
    L = S.L
    c = L[i]
    if not (c < L[i - 1] and c < L[i - 2]):
        return 0.0
    p1, p2 = L[i + 1], L[i + 2]
    if c < p1 and c < p2:
        return c
    r = n - i - 1
    if r >= 3 and c == p1 and c < p2 and c < L[i + 3]:
        return c
    if r >= 4 and c <= p1 and c == p2 and c < L[i + 3] and c < L[i + 4]:
        return c
    if r >= 5 and c <= p1 and c == p2 and c == L[i + 3] and c < L[i + 4] and c < L[i + 5]:
        return c
    if r >= 6 and c <= p1 and c == p2 and c <= L[i + 3] and c == L[i + 4] and c < L[i + 5] and c < L[i + 6]:
        return c
    return 0.0


def htf_trend(S: Series) -> int:
    """HtfTrend: HH + HL = +1, LH + LL = -1, mixed: the close beyond the latest swing decides."""
    hi, lo = [], []
    i = 3
    while i < 300 and (len(hi) < 2 or len(lo) < 2):
        u, d = frac_up(S, i), frac_dn(S, i)
        if u > 0 and len(hi) < 2:
            hi.append(u)
        if d > 0 and len(lo) < 2:
            lo.append(d)
        i += 1
    if len(hi) < 2 or len(lo) < 2:
        return 0
    if hi[0] > hi[1] and lo[0] > lo[1]:
        return 1
    if hi[0] < hi[1] and lo[0] < lo[1]:
        return -1
    c = S.C[1]
    if c > hi[0]:
        return 1
    if c < lo[0]:
        return -1
    return 0


def dna_frac(S: Series, i: int, side: int, p=RAJA) -> bool:
    for j in range(1, p['tl_swing'] + 1):
        if i - j < 1 or i + j >= S.n:
            return False
        if side > 0 and (S.L[i] > S.L[i + j] or S.L[i] >= S.L[i - j]):
            return False
        if side < 0 and (S.H[i] < S.H[i + j] or S.H[i] <= S.H[i - j]):
            return False
    return True


def sideways(S: Series, p=RAJA) -> bool:
    """RjB_Sideways (L8 'never trade sideways'): the last K swing highs / lows overlap in one band, no HH+HL or
    LL+LH, and the last close is still inside the swings."""
    K = max(2, min(8, p['chop_swings']))
    hs, ls = [], []
    lim = min(S.n - p['tl_swing'] - 1, 400)
    j = p['tl_swing'] + 1
    while j < lim and (len(hs) < K or len(ls) < K):
        if len(hs) < K and dna_frac(S, j, -1, p):
            hs.append(S.H[j])
        if len(ls) < K and dna_frac(S, j, 1, p):
            ls.append(S.L[j])
        j += 1
    if len(hs) < K or len(ls) < K:
        return False
    up = hs[0] > hs[1] and ls[0] > ls[1]
    dn = hs[0] < hs[1] and ls[0] < ls[1]
    if up or dn:
        return False
    c = S.C[1]
    return min(hs[:K]) > max(ls[:K]) and max(hs[:K]) >= c >= min(ls[:K])


def curve_v1(S: Series, price: float) -> float:
    hi_i, lo_i = S.highest(100, 1), S.lowest(100, 1)
    if hi_i < 0 or lo_i < 0:
        return 50.0
    hi, lo = S.H[hi_i], S.L[lo_i]
    return 100.0 * (price - lo) / (hi - lo) if hi > lo else 50.0


# ---- Direction engine rows (DirEvalTF) -------------------------------------------------------------------------
@dataclass
class Row:
    tf: str
    S: Series
    ok: bool = False
    swings: int = 0           # S (HtfTrend)
    T: int = 0                # newest trendline cross side (+1 = a down line crossed up)
    t_bar: int = -1
    rm: int = 0               # opposite zones removed (Raja 2-close) since the cross
    st: int = DST_NA
    side: int = 0
    cp: int = 0
    cp_dir: int = 0
    in_z: int = 0
    in_lo: float = 0.0
    in_hi: float = 0.0
    zones: List[Zone] = field(default_factory=list)
    tl: TLState = field(default_factory=TLState)

    @property
    def state_name(self) -> str:
        if not self.ok:
            return 'n/a'
        if self.st in (DST_RANGE, DST_PULL, DST_NA):
            return STATE_NAME[self.st]
        word = 'UP' if self.side > 0 else 'DOWN'
        return word if self.st == DST_TREND else f'{STATE_NAME[self.st]} {word}'


def eval_row(S: Series, p=RAJA) -> Row:
    """DirEvalTF: S, T, R, C, L and the state of one timeframe. The price-dependent L part (in_z) uses S.price."""
    r = Row(tf=S.tf, S=S)
    if S.n < 40 or S.atr(1) <= 0:
        return r
    r.ok = True
    r.swings = htf_trend(S)
    r.tl = trendlines(S, p)
    tb, td = -1, 0
    for t in r.tl.lines:
        if t.cross_bar < 0:
            continue
        if tb < 0 or t.cross_bar < tb:
            tb, td = t.cross_bar, -t.dir
    r.T, r.t_bar = td, tb
    r.zones = detect(S, p)
    zz = r.zones
    rm = 0
    if td != 0:
        for z in zz:
            if z.dir != -td or not z.removed:
                continue
            rb = raja_removed(S, z, p) if p['raja_removal'] else z.removed_bar
            if 1 <= rb <= tb:
                rm += 1
    r.rm = rm
    if zz:
        cd, cp = zz[-1].dir, 0
        for z in reversed(zz):
            if z.dir != cd or not z.cont:
                break
            cp += 1
        r.cp, r.cp_dir = cp, cd
    set_in_zone(r, S.price)
    Sg, T, N = r.swings, td, max(1, p['dir_removed_n'])
    est = r.tl.up_on if T > 0 else (r.tl.dn_on if T < 0 else False)
    mixed = r.tl.up_on and r.tl.dn_on
    if T == 0:
        if Sg == 0 or mixed:
            r.st, r.side = DST_RANGE, 0
        else:
            r.st, r.side = DST_TREND, Sg
    elif Sg == -T:
        r.st, r.side = (DST_CHG if rm >= N else DST_PULL), T
    elif est:
        r.st, r.side = DST_TREND, T
    else:
        r.st, r.side = (DST_CHG if rm >= N else DST_TURN), T
    return r


def set_in_zone(r: Row, price: float) -> None:
    r.in_z, r.in_lo, r.in_hi = 0, 0.0, 0.0
    for z in reversed(r.zones):
        if price < z.lo or price > z.hi or not fresh_at(r.S, z):
            continue
        r.in_z, r.in_lo, r.in_hi = z.dir, z.lo, z.hi
        break


def row_side(r: Optional[Row]) -> int:
    if r is None or not r.ok or r.st in (DST_RANGE, DST_NA):
        return 0
    return r.side


def trend_side(r: Optional[Row]) -> int:
    if r is None or not r.ok:
        return 0
    return r.side if r.st in (DST_TREND, DST_CHG, DST_TURN) else 0


def trend_up(r: Optional[Row]) -> bool:
    """Strict 'trend up' of one row for the owner's ATH curve rule: TREND UP (swings up and the up trendline in force)
    or CHANGED UP (down line crossed up + 2 opposite zones removed: Raja's 'direction clear', L3 / Feb 18). TURNING UP
    (crossed, not yet confirmed), PULLBACK, RANGE and n/a do not count."""
    return r is not None and r.ok and r.side > 0 and r.st in (DST_TREND, DST_CHG)


def ath_curve_ok(curve: 'Curve', w1: Optional[Row], mn: Optional[Row]) -> bool:
    """Owner rule: no MN strong supply above (near all-time highs), so the Raja curve cannot be measured (fallback
    100-bar MN range curve), and W1 + MN both trend up -> the curve does not block a buy."""
    return curve.ok and not curve.raja and trend_up(w1) and trend_up(mn)


def run_end(z: Zone) -> int:
    return z.tested_bar if z.tested else (z.removed_bar if z.removed else 1)


def raja_strong_row(zones: List[Zone], z: Zone) -> bool:
    """DirRajaStrong with RjA_StrongRun: an opposite zone removed anywhere in the run-out (or within 5 bars)."""
    lo = min(z.leg_bar - 5, run_end(z))
    for o in zones:
        if o.dir != -z.dir or not o.removed:
            continue
        if o.leg_bar > z.leg_bar and lo <= o.removed_bar <= z.leg_bar:
            return True
    return False


@dataclass
class Curve:
    ok: bool = False
    raja: bool = False
    value: float = 50.0
    pd: float = 0.0
    ps: float = 0.0
    tf: str = ''

    def at(self, price: float, htf_S: Optional[Series] = None) -> float:
        if not self.ok:
            return 50.0
        if self.raja:
            return 100.0 * (price - self.pd) / (self.ps - self.pd)
        return curve_v1(htf_S, price) if htf_S is not None else self.value


def dir_curve(h: Optional[Row], price: float) -> Curve:
    """DirCurve (InpCurveMode=1): proximal to proximal of the nearest fresh STRONG HTF demand below price and
    supply above; without both, the v1 curve (position in the 100-bar HTF range)."""
    cv = Curve()
    if h is None or not h.ok:
        return cv
    pd = ps = 0.0
    for z in h.zones:
        if not fresh_at(h.S, z) or not raja_strong_row(h.zones, z):
            continue
        if z.dir > 0 and z.dist < price and (pd == 0 or z.prox > pd):
            pd = z.prox
        if z.dir < 0 and z.dist > price and (ps == 0 or z.prox < ps):
            ps = z.prox
    cv.tf = h.tf
    if pd > 0 and ps > pd:
        cv.raja, cv.pd, cv.ps, cv.value = True, pd, ps, 100.0 * (price - pd) / (ps - pd)
    else:
        cv.value = curve_v1(h.S, price)
    cv.ok = True
    return cv


@dataclass
class Direction:
    side: int = 0          # side found by the rules (also while waiting)
    q: int = 0             # 0 wait, 1 reduced, 2 full
    dir: int = 0           # side when q > 0
    blocked: int = 0       # side blocked by the curve
    realign: bool = False
    lock: int = 0
    curve: Curve = field(default_factory=Curve)
    notes: List[str] = field(default_factory=list)

    @property
    def head(self) -> str:
        if self.side == 0:
            return 'WAIT'
        s = 'long' if self.side > 0 else 'short'
        if self.realign:
            return f'WAIT - realigning ({s} side)'
        if self.q == 0:
            return f'WAIT ({s} side)'
        return ('LONG' if self.side > 0 else 'SHORT') + (' - FULL' if self.q == 2 else ' - REDUCED')


def dir_combine(e: Row, i: Row, h: Row, curve: Curve, p=RAJA) -> Direction:
    """DirCombine for the Raja table (InpDirTable=3) on a D1 chart: ETF D1, ITF W1, HTF MN (no Higher+1 row)."""
    D = Direction(curve=curve)
    side, q, realign = 0, 2, False
    h_side = trend_side(h)
    if h is not None and h.ok and h.in_z != 0:
        D.lock = h.in_z
        side = h.in_z
        if h_side == -side:
            q = 1
        D.notes.append(f"inside a fresh {h.tf} {'demand' if h.in_z > 0 else 'supply'}")
    if curve.ok:
        cv = -1 if curve.value >= p['curve_high'] else (1 if curve.value <= p['curve_low'] else 0)
        if cv < 0 and ath_curve_ok(curve, i, h):
            cv = 0                                  # owner rule: no MN supply overhead + W1 / MN up, no sell vote
            D.notes.append('no MN supply overhead (ATH area), W1 + MN up: curve not used')
        if cv != 0:
            D.blocked = -cv
            if side == 0:
                side = cv
                if h_side == -side:
                    q = 1
            elif side != cv:
                q = min(q, 1)
                D.notes.append('curve disagrees')
    if side == 0:
        side = h_side
    if side != 0:
        if i is not None and i.ok and i.st in (DST_PULL, DST_TURN) and i.side == -side and D.lock != side:
            realign, q = True, 0
            D.notes.append(f'{i.tf} {i.state_name}: wait for it to realign')
        if q > 0 and row_side(e) != side:
            q = min(q, 1)
        if e is not None and e.cp >= 3 and e.cp_dir == side and q > 0:
            q -= 1
            D.notes.append(f'{e.tf} CP x{e.cp} in a row: do not chase')
    D.side, D.q, D.realign = side, (0 if side == 0 else q), realign
    D.dir = side if D.q > 0 else 0
    return D


# ---- zone DNA (the Raja-relevant subset of DnaCompute + RjA_DnaExtra) ---------------------------------------------
@dataclass
class DNA:
    n_tests: int = 0
    touch1_bar: int = -1
    in_touch: bool = False
    depth_max: float = 0.0
    runout_bar: int = 0
    runout_px: float = 0.0
    rm_opp_n: int = 0
    rm_opp_move: int = 0
    rja_tl: bool = False
    strong: bool = False
    arrival: bool = False
    has_opp: bool = False
    opp: float = 0.0
    opp_dist: float = 0.0
    has_opp_htf: bool = False
    opp_htf: float = 0.0
    opp_htf_dist: float = 0.0
    opp_htf_tf: str = ''
    room_r: float = 99.0
    wow: bool = False
    overlap: bool = False
    adjacent: bool = False
    flip: bool = False
    cp_run: int = 0
    did_job: bool = False
    next_opp_htf: bool = False
    curve_zone: float = 50.0
    impulse: bool = False
    code: str = 'WK'
    stop_buf: float = 0.0
    risk: float = 0.0
    tp_off: float = 0.0
    gap_away: bool = False
    proj: float = 0.0          # 250% projection target (L5 / Feb 18), 0 = none
    proj_hh: float = 0.0       # the correction's start (last higher high) the projection is measured on


PROJ_X = 2.5          # Raja L5 (Feb 18): impulse = 100% + 100% + 50% of the correction
PROJ_LOOKBACK = 100   # bars searched before the base for the correction's start


def projection(S: Series, z: 'Zone', lookback: int = PROJ_LOOKBACK) -> Tuple[float, float]:
    """(target, correction start) of Raja's 250% projection for zone z (L5, Feb 18 private session 02:05-03:50:
    'measure the correction from the last higher high to its low; the market goes 100% of it, another 100%, then
    half (= 250%). When there is no supply above to target, use this projection.').
    Demand: the correction low = the zone's distal (lowest wick of base + departure); its start = the highest high of
    the bars before the base, walking back until a low under that distal (where the earlier up move began) or
    `lookback` bars. Target = low + 2.5 x (high - low). Supply mirrored. (0, 0) when there is no correction."""
    d, lo = z.dir, z.dist
    best = 0.0
    for j in range(z.base_end + 1, min(S.n, z.base_end + 1 + lookback)):
        if d * (S.L[j] if d > 0 else S.H[j]) < d * lo:
            break
        v = S.H[j] if d > 0 else S.L[j]
        if best == 0.0 or d * (v - best) > 0:
            best = v
    if best == 0.0 or d * (best - z.prox) <= 0:
        return 0.0, 0.0
    return lo + d * PROJ_X * abs(best - lo), best


def stop_buffer(h: float, tf: str, p=RAJA) -> float:
    """RjC_StopBuf with InpSlMode=1: a % of the zone height beyond the distal (D1 10%, W1 5%, MN 3%), min 3 points."""
    return max(p['sl_pct'].get(tf, 5.0) / 100.0 * h, p['sl_min'])


def dna(S: Series, zs: List[Zone], i: int, tl: TLState, higher: List[Row], htf_opp_zones: List[Zone], curve: Curve,
        htf_row: Optional[Row], tp_off_frac: float = 0.005, p=RAJA) -> DNA:
    """DNA of zs[i] on its own timeframe (treated as the chart TF, so the Raja arrival uses its own trendlines).
    higher = the rows above it in the stack (opposing fresh zones for the room), htf_opp_zones = the HtfOf zones for
    the 'strong zone inside / next to an opposite HTF zone' veto."""
    z = zs[i]
    x = DNA()
    d, L, h, sa = z.dir, z.leg_bar, z.h, z.sa_bar
    ext = (lambda j: S.H[j]) if d > 0 else (lambda j: S.L[j])
    adv = (lambda j: S.L[j]) if d > 0 else (lambda j: S.H[j])
    # F16 tests
    away, in_t = True, False
    stop = z.removed_bar if z.removed else 0
    for j in range(sa - 1, max(stop, 0), -1):
        a = adv(j)
        touch = a <= z.prox if d > 0 else a >= z.prox
        dep = d * (z.prox - a) / h * 100.0 if h > 0 else 0.0
        if touch and S.emotional(j, p['emo_atr']):
            continue
        if touch:
            if not in_t and away:
                x.n_tests += 1
                in_t, away = True, False
                if x.n_tests == 1:
                    x.touch1_bar = j
            x.depth_max = max(x.depth_max, dep)
        else:
            away, in_t = True, False
    x.in_touch = in_t
    # F09 run-out before the first touch
    last = x.touch1_bar + 1 if x.touch1_bar >= 0 else 1
    if z.removed:
        last = max(last, z.removed_bar + 1)
    best, bb = 0.0, sa
    for j in range(sa, max(last, 1) - 1, -1):
        v = d * (ext(j) - z.prox)
        if v > best:
            best, bb = v, j
    x.runout_bar, x.runout_px = bb, z.prox + d * best

    def rm_opp(newest):
        return sum(1 for o in zs if o.dir == -d and o.removed and o.leg_bar > L and newest <= o.removed_bar <= L)
    x.rm_opp_n = rm_opp(L - 5)
    x.rm_opp_move = rm_opp(min(bb, L - 5))
    x.strong = x.rm_opp_move >= 1                                         # RjA_StrongRun
    x.rja_tl = tl_cross_in(tl, -d, min(bb, L - 5), L)                     # RjA_ArrDepart
    x.arrival = x.rja_tl and x.rm_opp_move >= 1
    # curve of the zone (entry)
    x.curve_zone = curve.at(z.prox, htf_row.S if htf_row is not None else None)
    # F19 room: nearest opposing zone of this TF (live) and the fresh ones of the higher rows
    risk = h + stop_buffer(h, z.tf, p)
    x.stop_buf, x.risk = stop_buffer(h, z.tf, p), risk
    opp, opp_d = 0.0, 0.0
    for o in zs:
        if o.dir == d or o.removed:
            continue
        if d > 0 and o.prox > z.prox and (opp == 0 or o.prox < opp):
            opp, opp_d = o.prox, o.dist
        if d < 0 and o.prox < z.prox and (opp == 0 or o.prox > opp):
            opp, opp_d = o.prox, o.dist
    x.has_opp, x.opp, x.opp_dist = opp > 0, opp, opp_d
    oh, oh_tf, oh_d = 0.0, '', 0.0
    for r in higher:
        if r is None or not r.ok:
            continue
        for o in r.zones:
            if o.dir == d or not fresh_at(r.S, o):
                continue
            if d * (o.prox - z.prox) <= 0:
                continue
            if oh == 0 or d * (o.prox - oh) < 0:
                oh, oh_tf, oh_d = o.prox, r.tf, o.dist
    x.has_opp_htf, x.opp_htf, x.opp_htf_tf, x.opp_htf_dist = oh > 0, oh, oh_tf, oh_d

    def room(target):
        off = tp_off_frac * target
        return max(0.0, (d * (target - z.prox) - off) / risk)
    x.room_r = 99.0
    if x.has_opp:
        x.room_r = room(opp)
    if x.has_opp_htf:
        x.room_r = min(x.room_r, room(oh))
    x.wow = x.rm_opp_move >= 1 and x.has_opp
    # RjA_OppHtfVeto: strong zone inside / right next to an opposite HTF zone
    for o in htf_opp_zones:
        if o.removed or o.dir == d:
            continue
        if max(z.lo, o.lo) - min(z.hi, o.hi) <= h:
            x.next_opp_htf = True
            break
    # Lens8: CP run, 'already did its job'
    for j in range(i, -1, -1):
        if zs[j].dir != d or not zs[j].cont:
            break
        x.cp_run += 1
    tg = 0.0
    for o in zs:
        if o.dir == d or o.leg_bar <= L:
            continue
        if o.removed and o.removed_bar >= x.runout_bar:
            continue
        if d * (o.prox - z.prox) <= 0:
            continue
        if tg == 0 or d * (o.prox - tg) < 0:
            tg = o.prox
    x.did_job = tg != 0 and d * (x.runout_px - tg) >= 0
    # F25 weak types: overlap (RjA_Adjacent), flip (RjA_FlipTL)
    B = z.base_end
    for o in zs:
        if o.dir == d or o.leg_bar <= L:
            continue
        if max(z.lo, o.lo) > min(z.hi, o.hi):
            if (not o.removed or o.removed_bar < B) and max(z.lo, o.lo) - min(z.hi, o.hi) <= 0.1 * h:
                x.overlap = x.adjacent = True
            continue
        if not o.removed or o.removed_bar < B:
            x.overlap = True
        elif tl_cross_in(tl, -d, B, 10 ** 9):
            x.flip = True
    hsd = 0
    if htf_row is not None and htf_row.ok:
        hsd = htf_row.T if htf_row.T != 0 else htf_row.swings
    x.impulse = hsd == d
    x.code = ('ARR' if x.arrival else 'WOW' if x.wow else 'STR' if x.strong else 'OVL' if x.overlap
              else 'FLP' if x.flip else 'TST' if x.n_tests >= 1 else 'WK')
    x.tp_off = tp_off_frac
    # 250% projection (L5): only a target while the run-out has not reached it yet (after ~2.5x price corrects again)
    pj, hh = projection(S, z)
    if pj and d * (x.runout_px - pj) < 0:
        x.proj, x.proj_hh = pj, hh
    # F06 gap away (DnaCompute): the departure opened beyond the last base close by >= 0.10 ATR, or a window between
    # the last base candle and the stay-away candle
    a = S.atr(L) or S.atr(1)
    if a > 0:
        gap_open = d * (S.O[L] - S.C[L + 1]) / a
        win = sa >= 1 and d * (adv(sa) - ext(L + 1)) > 0
        x.gap_away = gap_open >= 0.10 or win
    return x


ZONE_TYPE_TEXT = {
    'ARR': 'Arrival (crossed the trendline + removed an opposite zone)',
    'WOW': 'WOW (strong, open run to the next opposite zone)',
    'STR': 'Strong (removed an opposite zone in its run-out)',
    'OVL': 'Overlap (inside / next to an old opposite zone)',
    'FLP': 'Flip area',
    'TST': 'Tested',
    'WK': 'Weak (removed nothing)',
}


# ---- Pinndx-inspired extras (display / score only; Raja rules stay the gate) -------------------------------------
@dataclass
class FairValue:
    lo: float
    hi: float
    poc: float
    method: str          # 'volume' (70% value area) or 'closes' (25th-75th percentile fallback)


def fair_value(S: Series, n: int = 20, area: float = 0.70, bins: int = 48) -> Optional[FairValue]:
    """Value area of the last n CLOSED bars: each bar's volume spread evenly over its high-low range on a price grid,
    then the point of control widened bin by bin (the larger neighbour first) until it holds `area` of the volume.
    No volume -> the 25th-75th percentile of the closes. Uses shifts 1..n only (no forming bar, no look-ahead)."""
    idx = [i for i in range(1, min(n, S.n - 1) + 1)]
    if len(idx) < 5:
        return None
    lo, hi = min(S.L[i] for i in idx), max(S.H[i] for i in idx)
    vol = sum(S.V[i] for i in idx)
    if vol <= 0 or hi <= lo:
        cs = sorted(S.C[i] for i in idx)
        q = lambda p: cs[min(len(cs) - 1, max(0, int(round(p * (len(cs) - 1)))))]
        return FairValue(q(0.25), q(0.75), q(0.5), 'closes')
    w = (hi - lo) / bins
    hist = [0.0] * bins
    for i in idx:
        bl, bh, v = S.L[i], S.H[i], S.V[i]
        if v <= 0:
            continue
        if bh <= bl:
            hist[min(bins - 1, int((bl - lo) / w))] += v
            continue
        for k in range(int((bl - lo) / w), min(bins, int((bh - lo) / w) + 1)):
            a0, a1 = lo + k * w, lo + (k + 1) * w
            ov = min(a1, bh) - max(a0, bl)
            if ov > 0:
                hist[k] += v * ov / (bh - bl)
    poc = max(range(bins), key=lambda k: hist[k])
    a, b, got, total = poc, poc, hist[poc], sum(hist)
    while got < area * total and (a > 0 or b < bins - 1):
        left = hist[a - 1] if a > 0 else -1
        right = hist[b + 1] if b < bins - 1 else -1
        if right >= left:
            b += 1
            got += hist[b]
        else:
            a -= 1
            got += hist[a]
    return FairValue(lo + a * w, lo + (b + 1) * w, lo + (poc + 0.5) * w, 'volume')


def pz_levels(entry: float, stop: float, target: Optional[float], fv: Optional[FairValue]) -> dict:
    """PZ1 / PZ2 / PZ3 (our own definitions, Pinndx-inspired): PZ3 = the Raja target (just before the next supply);
    PZ1 = the higher of the fair value's near edge and 2R, PZ2 = the higher of its far edge and 3R, in each case the
    highest candidate that still lies below PZ3 (PZ2 also above PZ1). R:R per level."""
    risk = entry - stop
    out = {'pz1': None, 'pz2': None, 'pz3': target, 'rr_pz1': None, 'rr_pz2': None, 'rr_pz3': None}
    if risk <= 0 or not target:
        return out
    near = fv.lo if fv and fv.lo > entry else (fv.hi if fv and fv.hi > entry else None)
    far = fv.hi if fv and fv.hi > entry else None
    c1 = [v for v in (near, entry + 2 * risk) if v is not None and v < target]
    c2 = [v for v in (far, entry + 3 * risk) if v is not None and v < target]
    out['pz1'] = max(c1) if c1 else None
    p2 = max(c2) if c2 else None
    if p2 is not None and (out['pz1'] is None or p2 > out['pz1']):
        out['pz2'] = p2
    for k in ('pz1', 'pz2', 'pz3'):
        if out[k] is not None:
            out[k] = round(out[k], 2)
            out['rr_' + k] = round((out[k] - entry) / risk, 2)
    return out


def seiden_score(z: Zone, x: 'DNA', direction: 'Direction', fv_dist_atr: Optional[float], index_aligned: bool) -> dict:
    """Seiden odds-enhancer score 0-10 (display only, never a gate): departure (gap 2, >= 2x the base 1), time at
    level (1-3 base candles 1, 4-6 0.5), freshness (2 / 1 / 0), profit margin (room >= 3R 2, >= 2R 1), trend (Raja
    direction with the zone FULL 2, REDUCED 1), curve (<= 25% 1, <= 50% 0.5); bonuses +1 when the zone is >= 1 ATR
    below fair value, +1 when the composite index is aligned. Capped at 10."""
    d = z.dir
    parts = {
        'departure': 2.0 if x.gap_away else (1.0 if z.leg_ratio >= 2 else 0.0),
        'time': 1.0 if z.base_n <= 3 else (0.5 if z.base_n <= 6 else 0.0),
        'fresh': 2.0 if x.n_tests == 0 else (1.0 if x.n_tests == 1 else 0.0),
        'margin': 2.0 if x.room_r >= 3 else (1.0 if x.room_r >= 2 else 0.0),
        'trend': (2.0 if direction.q == 2 else 1.0) if direction.dir == d else 0.0,
        'curve': (1.0 if x.curve_zone <= 25 else (0.5 if x.curve_zone <= 50 else 0.0)) if d > 0 else (1.0 if x.curve_zone >= 75 else (0.5 if x.curve_zone >= 50 else 0.0)),
        'fv_bonus': 1.0 if fv_dist_atr is not None and fv_dist_atr >= 1 else 0.0,
        'index_bonus': 1.0 if index_aligned else 0.0,
    }
    return {'score': min(10.0, sum(parts.values())), 'parts': parts}
