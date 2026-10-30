"""Mechanical Python port of the MQL arrival engine block (RFX_ARRIVAL_ENGINE in public/tools/RFX_ZoneCore.mqh, copied
verbatim into RamanFX_ZoneVision.mq4 / RamanFX_ZoneBot.mq4), for checking the MQL logic without MetaTrader.

Every function below is a statement-by-statement transliteration of the MQL function of the same name: the same loops,
the same integer shifts (MQL series index: 0 = the phantom bar at the price, 1 = the newest closed bar, larger = older),
the same comparisons, DBL_MAX for +-Infinity, struct copies as dict / object copies. It deliberately does NOT import the
Python alert port (tools/stock_scanner/arrival.py) or call the TypeScript: it is a second, independent reading of the MQL
text. run_fixtures() replays tools/telegram_bot/parity/arrival_fixtures.json (generated from the canonical
supabase/functions/telegram-bot/arrival.ts) and compares every number with |x - y| <= 1e-9 * max(1, |x|).

    python3 tools/telegram_bot/parity/mql_port.py          # prints one line per case, exit 1 on a mismatch
"""
from __future__ import annotations

import copy
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

DBL_MAX = sys.float_info.max
RX_MAXB, RX_Q, RX_SWING, RX_LOOK, RX_MAXREM, RX_MAXW = 460, 129600, 2, 200, 32, 64
RX_FIT_TOL, RX_MIN_SLOPE, RX_MIN_RISE = 0.05, 0.015, 1.0   # ZV.fitTol / minSlope / minRise (RFX_ZoneCore.mqh RX_*)
RX_SL_ATRFRAC, RX_SL_HTFBUF = 0.1, 2
TF_MIN = {'M15': 15, 'H1': 60, 'H4': 240, 'D1': 1440, 'W1': 10080, 'MN': 43200, '3M': RX_Q}


class Arr(list):
    """MQL array: an index outside 0 .. size - 1 is a critical runtime error ('array out of range'), never a wrap."""
    def __getitem__(self, i):
        if isinstance(i, int) and not (0 <= i < len(self)): raise IndexError(f'array out of range [{i}] of {len(self)}')
        return list.__getitem__(self, i)
    def __setitem__(self, i, v):
        if isinstance(i, int) and not (0 <= i < len(self)): raise IndexError(f'array out of range [{i}] of {len(self)}')
        list.__setitem__(self, i, v)


class RxParams:
    def __init__(self, base_strict: bool):
        self.min_leg_ratio, self.max_base, self.max_zone_atr, self.lookback = 1.2, 6, 1.5, 200
        self.max_zone_age, self.emo_atr, self.removal_mode, self.base_strict = 200, 3.0, 1, base_strict


class RxSer:
    def Alloc(self, nClosed, tfm):
        self.n = nClosed + 1; self.tf = tfm; self.virt = tfm == RX_Q
        self.O = Arr([0.0] * self.n); self.H = Arr([0.0] * self.n); self.L = Arr([0.0] * self.n); self.C = Arr([0.0] * self.n)
        self.T = Arr([0] * self.n); self.a = Arr([0.0] * self.n); self.wa = Arr([0.0] * self.n)

    def Finish(self, p):
        n = self.n
        self.price = p; self.O[0] = p; self.H[0] = p; self.L[0] = p; self.C[0] = p; self.T[0] = self.T[1] if n > 1 else 0
        tr = Arr([0.0] * n)
        for i in range(n): tr[i] = 0.0; self.a[i] = 0.0; self.wa[i] = 0.0
        for i in range(n - 1):
            pc = self.C[i + 1]; tr[i] = max(self.H[i], pc) - min(self.L[i], pc)
        s = 0.0
        for i in range(n - 2, -1, -1):
            s += tr[i]
            if i + 14 <= n - 2: s -= tr[i + 14]
            if i + 14 <= n - 1: self.a[i] = s / 14
        if self.virt:
            sm = 0.0; cnt = 0
            for i in range(n - 1, -1, -1):
                t = self.H[i] - self.L[i]
                if i < n - 1: t = max(t, max(abs(self.H[i] - self.C[i + 1]), abs(self.L[i] - self.C[i + 1])))
                cnt += 1
                if cnt < 14: sm += t; continue
                if cnt == 14: sm += t; self.wa[i] = sm / 14; continue
                self.wa[i] = (self.wa[i + 1] * 13 + t) / 14

    def atr(self, i): return self.a[i] if 0 <= i < self.n else 0.0
    def zvAtr(self, i):
        if not self.virt: return self.atr(i)
        return self.wa[i] if 0 <= i < self.n else 0.0
    def rng(self, i): return self.H[i] - self.L[i]
    def body(self, i): return abs(self.C[i] - self.O[i])
    def basing(self, i): r = self.rng(i); return r > 0 and self.body(i) / r < 0.5
    def cdir(self, i): return 1 if self.C[i] > self.O[i] else (-1 if self.C[i] < self.O[i] else 0)
    def emotional(self, i, emo): x = self.atr(i + 1); return x > 0 and self.rng(i) > emo * x


def RxSlice(src, L, dst):
    dst.Alloc(src.n - 1 - L, src.tf)
    for i in range(1, dst.n):
        dst.O[i] = src.O[i + L]; dst.H[i] = src.H[i + L]; dst.L[i] = src.L[i + L]; dst.C[i] = src.C[i + L]; dst.T[i] = src.T[i + L]
    dst.Finish(dst.C[1] if dst.n > 1 else 0)


class S_: # struct helper
    def __init__(self, **k): self.__dict__.update(k)
    def cp(self): return copy.deepcopy(self)


def ZvLine(): return S_(dir=0, a=0, b=0, pa=0.0, pb=0.0, cuts=0, brokenAt=-1)


def zvSlope(t): return (t.pb - t.pa) / max(1, t.a - t.b)
def zvAt(t, j): return t.pb + zvSlope(t) * (t.b - j)


def RxFrLow(S, i, sw):
    for k in range(1, sw + 1):
        if i - k < 1 or S.L[i] > S.L[i + k] or S.L[i] >= S.L[i - k]: return False
    return True
def RxFrHigh(S, i, sw):
    for k in range(1, sw + 1):
        if i - k < 1 or S.H[i] < S.H[i + k] or S.H[i] <= S.H[i - k]: return False
    return True


def zvPivots(S, bars, out):
    out.clear()
    sw = RX_SWING; fH = -1; fL = -1
    i = bars
    while i > sw:
        lo = RxFrLow(S, i, sw); hi = RxFrHigh(S, i, sw)
        if lo and fH > 0:
            for j in range(i - 1, 0, -1):
                if S.L[j] < S.L[i]: break
                if S.H[j] > S.H[fH]: out.append(S_(bar=i, p=S.L[i], t=-1)); break
        if hi and fL > 0:
            for j in range(i - 1, 0, -1):
                if S.H[j] > S.H[i]: break
                if S.L[j] < S.L[fL]: out.append(S_(bar=i, p=S.H[i], t=1)); break
        if lo: fL = i
        if hi: fH = i
        i -= 1
    return len(out)


def zvFitAnchor(S, A, b2, p2, d):
    tol = RX_FIT_TOL * S.zvAtr(1)
    a = A
    for _ in range(50):
        sl = (p2 - (S.L[a] if d > 0 else S.H[a])) / (a - b2)
        worst = -1; ex = tol
        for j in range(a - 1, b2, -1):
            lv = p2 + sl * (b2 - j); e = lv - S.L[j] if d > 0 else S.H[j] - lv
            if e > ex: ex = e; worst = j
        if worst < 0: return a
        a = worst
    return a


def zvPair(S, o, n, d, t):
    if (not (n.p > o.p)) if d > 0 else (not (n.p < o.p)): return False
    a = zvFitAnchor(S, o.bar, n.bar, n.p, d)
    t.dir = d; t.a = a; t.b = n.bar; t.pa = S.L[a] if d > 0 else S.H[a]; t.pb = n.p; t.cuts = 0; t.brokenAt = -1
    if (not (t.pb > t.pa)) if d > 0 else (not (t.pb < t.pa)): return False
    ab = max(S.zvAtr(t.b), 1e-12)
    if abs(zvSlope(t)) < RX_MIN_SLOPE * ab or abs(t.pb - t.pa) < RX_MIN_RISE * ab: return False
    return True


def RxBeyond(S, t, d, j): return S.C[j] < zvAt(t, j) if d > 0 else S.C[j] > zvAt(t, j)
def RxAbove(d, x, y): return x < y if d > 0 else x > y


def zvLines(S, res, piv):
    res.hasUp = False; res.hasDn = False; res.hasMom = False; res.hasUpX = False; res.hasDnX = False
    res.whyUp = 'too few bars'; res.whyDn = 'too few bars'
    piv.clear()
    bars = min(RX_LOOK, S.n - 1 - RX_SWING)
    if bars <= RX_SWING + 2: return
    zvPivots(S, bars, piv)
    np_ = len(piv)
    for d in (1, -1):
        want = -1 if d > 0 else 1; k = 0; extBar = -1; nSeen = 0; extP = 0.0
        seen = [0] * np_
        hasP1 = False; hasLive = False; hasBrk = False
        p1 = S_(bar=0, p=0.0, t=0); live = ZvLine(); brk = ZvLine()
        why = 'no real valleys' if d > 0 else 'no real peaks'
        for j in range(bars, 0, -1):
            if hasLive and j < live.b and RxBeyond(S, live, d, j):
                live.brokenAt = j; brk = live.cp(); hasBrk = True; hasLive = False; why = 'broken at shift ' + str(j)
            xj = S.L[j] if d > 0 else S.H[j]
            if extBar < 0 or RxAbove(d, xj, extP):
                if hasLive: live.brokenAt = j; brk = live.cp(); hasBrk = True; hasLive = False
                extBar = j; extP = xj; hasP1 = False; nSeen = 0
                why = 'no higher low after the bottom' if d > 0 else 'no lower high after the top'
            while k < np_ and piv[k].bar >= j:
                pk = piv[k]
                if pk.t != want or not RxAbove(d, extP, pk.p): k += 1; continue
                if not hasP1 or not RxAbove(d, p1.p, pk.p):
                    if hasLive: live.brokenAt = pk.bar; brk = live.cp(); hasBrk = True; hasLive = False
                    p1 = pk.cp(); hasP1 = True; nSeen = 0
                    why = 'one higher low so far' if d > 0 else 'one lower high so far'
                    k += 1; continue
                seen[nSeen] = k; nSeen += 1
                if hasLive: k += 1; continue
                tried = [False] * nSeen
                got = False; t = ZvLine()
                for r in range(nSeen):
                    if got: break
                    bi = -1; bs = 0.0
                    for x in range(nSeen):
                        if tried[x]: continue
                        sv = (piv[seen[x]].p - p1.p) / (p1.bar - piv[seen[x]].bar)
                        if bi < 0 or (sv < bs if d > 0 else sv > bs) or (sv == bs and piv[seen[x]].bar < piv[seen[bi]].bar): bi = x; bs = sv
                    tried[bi] = True
                    got = zvPair(S, p1, piv[seen[bi]], d, t)
                if not got: why = 'too flat'; k += 1; continue
                bj = -1
                for x in range(t.b - 1, j - 1, -1):
                    if RxBeyond(S, t, d, x): bj = x; break
                if bj >= 0: t.brokenAt = bj; brk = t.cp(); hasBrk = True; why = 'broken at shift ' + str(bj); k += 1; continue
                live = t.cp(); hasLive = True; why = 'ok'
                k += 1
        if d > 0: res.hasUp = hasLive; res.up = live; res.hasUpX = hasBrk; res.upX = brk; res.whyUp = why
        else: res.hasDn = hasLive; res.dn = live; res.hasDnX = hasBrk; res.dnX = brk; res.whyDn = why
    bestE = -1
    for d in (1, -1):
        if (res.hasUp if d > 0 else res.hasDn): continue
        m = ZvLine(); e = [-1]
        if not zvMomentum(S, piv, bars, d, m, e): continue
        if bestE < 0 or e[0] < bestE: bestE = e[0]; res.mom = m; res.hasMom = True


def RxP(S, d, j): return S.L[j] if d > 0 else S.H[j]
def RxQ(S, d, j): return S.H[j] if d > 0 else S.L[j]
def RxMore(d, x, y): return x > y if d > 0 else x < y


def zvMomentum(S, piv, bars, d, out, e):
    lim = min(bars, S.n - 1)
    if lim < 8: return False
    E = 1
    for j in range(2, min(5, lim) + 1):
        if RxMore(d, RxQ(S, d, j), RxQ(S, d, E)): E = j
    k = E + 1
    while k <= lim and not RxMore(d, RxQ(S, d, k), RxQ(S, d, E)): k += 1
    lastPiv = -1
    for q in range(len(piv) - 1, -1, -1):
        if piv[q].t == (-1 if d > 0 else 1): lastPiv = q; break
    frm = piv[lastPiv].bar if (lastPiv >= 0 and piv[lastPiv].bar < k and piv[lastPiv].bar > E) else k - 1
    A = -1
    for j in range(E + 1, frm + 1):
        if A < 0 or RxMore(d, RxP(S, d, A), RxP(S, d, j)): A = j
    if A < 0 or A - E < 3: return False
    tol = 0.25 * S.zvAtr(1)
    b = -1; sl = 0.0
    it = 0
    while it < 10 and A - E >= 3:
        b = -1
        for j in range(A - 3, 0, -1):
            s = (RxP(S, d, j) - RxP(S, d, A)) / (A - j)
            if b < 0 or (s < sl if d > 0 else s > sl): b = j; sl = s
        worst = -1; ex = tol
        for j in range(A - 1, A - 3, -1):
            x = (RxP(S, d, A) + sl * (A - j) - RxP(S, d, j)) if d > 0 else (RxP(S, d, j) - RxP(S, d, A) - sl * (A - j))
            if x > ex: ex = x; worst = j
        if worst < 0: break
        A = worst; b = -1
        it += 1
    if b < 0 or A - E < 3 or d * sl <= 0: return False
    pb = RxP(S, d, A) + sl * (A - b); ab = max(S.zvAtr(b), 1e-12)
    if abs(sl) < 0.015 * ab or abs(sl) * (A - 1) < 1.5 * ab: return False
    out.dir = d; out.a = A; out.b = b; out.pa = RxP(S, d, A); out.pb = pb; out.cuts = 0; out.brokenAt = -1; e[0] = E
    return True


def zcDetect(S, p, out):
    out.clear()
    bars = min(p.lookback, S.n - p.max_base - 3)
    L = bars
    while L > 1:
        lr = S.rng(L)
        if lr <= 0 or S.basing(L): L -= 1; continue
        d = S.cdir(L)
        if d == 0: L -= 1; continue
        k = 0; maxBase = 0.0
        while k < p.max_base and S.basing(L + 1 + k): maxBase = max(maxBase, S.rng(L + 1 + k)); k += 1
        if k == 0 or maxBase <= 0: L -= 1; continue
        if p.base_strict and k == p.max_base and L + 1 + k < S.n and S.basing(L + 1 + k): L -= 1; continue
        ratio = lr / maxBase
        if ratio < p.min_leg_ratio: L -= 1; continue
        cont = S.cdir(L + 1 + k) == d
        if d > 0:
            prox = -DBL_MAX; m = DBL_MAX
            for b in range(L + 1, L + k + 1): prox = max(prox, max(S.O[b], S.C[b])); m = min(m, S.L[b])
            dist = min(m, S.L[L])
        else:
            prox = DBL_MAX; m = -DBL_MAX
            for b in range(L + 1, L + k + 1): prox = min(prox, min(S.O[b], S.C[b])); m = max(m, S.H[b])
            dist = max(m, S.H[L])
        h = abs(prox - dist); atr = S.atr(L)
        if h <= 0: L -= 1; continue
        if atr > 0 and h > p.max_zone_atr * atr: L -= 1; continue
        sa = L - 1
        if (d > 0 and S.L[sa] <= prox) or (d < 0 and S.H[sa] >= prox): L -= 1; continue
        z = S_(dir=d, prox=prox, dist=dist, legBar=L, baseN=k, saBar=sa, legRatio=ratio, cont=cont, tested=False, testedBar=-1,
               removed=False, removedBar=-1, baseStart=S.T[L + k], made=S.T[sa], tLeg=S.T[L])
        wick = p.removal_mode == 0
        for j in range(sa - 1, 0, -1):
            if d > 0:
                if S.C[j] < dist or (wick and S.L[j] < dist and not S.emotional(j, p.emo_atr)): z.removed = True; z.removedBar = j; break
                if not z.tested and S.L[j] <= prox and not S.emotional(j, p.emo_atr): z.tested = True; z.testedBar = j
            else:
                if S.C[j] > dist or (wick and S.H[j] > dist and not S.emotional(j, p.emo_atr)): z.removed = True; z.removedBar = j; break
                if not z.tested and S.H[j] >= prox and not S.emotional(j, p.emo_atr): z.tested = True; z.testedBar = j
        out.append(z)
        L -= 1
    return len(out)


def RxLo(z): return min(z.prox, z.dist)
def RxHi(z): return max(z.prox, z.dist)
def RxGap(v, z): return RxLo(z) - v if v < RxLo(z) else (v - RxHi(z) if v > RxHi(z) else 0.0)
def RxConfirmTf(m): return {60: 15, 240: 15, 1440: 60, 10080: 240, 43200: 1440, RX_Q: 10080}.get(m, 0)
def RxHigherTf(m): return {15: 60, 60: 240, 240: 1440, 1440: 10080, 10080: 43200, 43200: RX_Q}.get(m, 0)


def arrStopOf(S, d, valley, hasHost, host, spread, o):
    atr = S.atr(1); buffer = max(RX_SL_ATRFRAC * atr, spread if spread > 0 else 0)
    vs = valley - d * buffer
    o.buffer = buffer; o.atr = atr; o.valley = valley; o.hasHost = hasHost
    if hasHost: o.host = host.cp()
    if hasHost:
        hs = host.dist - d * RX_SL_HTFBUF * buffer
        if (hs <= vs) if d > 0 else (hs >= vs): o.stop = hs; o.basis = 1; return
    o.stop = vs; o.basis = 0


def arrRrOf(entry, stop, hasTarget, target, rr):
    rr[0] = 0.0
    if not hasTarget or entry == stop: return False
    r = (target - entry) / (entry - stop)
    if r > 0: rr[0] = r; return True
    return False


def arrArrivals(S, p, zones, out):
    out.clear(); zones.clear()
    if S.n > p.max_base + 4: zcDetect(S, p, zones)
    nz = len(zones); nb = S.n - 1
    for zi in range(nz):
        L = zones[zi].legBar; d = zones[zi].dir
        legs = [L]
        j = L - 1
        while j >= 1 and len(legs) < 3 and S.cdir(j) == d and not S.basing(j): legs.append(j); j -= 1
        if nb - L < 2 * RX_SWING + 6: continue
        newest = legs[-1]
        A = S_(nRem=0, rem=[])
        for y in range(nz):
            if zones[y].dir == -d and zones[y].removed and zones[y].removedBar <= L and zones[y].removedBar >= newest:
                if A.nRem < RX_MAXREM: A.rem.append(y)
                A.nRem += 1
        if A.nRem == 0: continue
        T = RxSer(); RxSlice(S, L, T)
        r = S_(); pv = []
        zvLines(T, r, pv)
        if (not r.hasDn) if d > 0 else (not r.hasUp): continue
        t = r.dn if d > 0 else r.up
        cross = -1
        for q in range(len(legs)):
            j = legs[q]
            if (S.C[j] > zvAt(t, j - L)) if d > 0 else (S.C[j] < zvAt(t, j - L)): cross = j; break
        if cross < 0: continue
        valley = DBL_MAX if d > 0 else -DBL_MAX
        j1 = min(L + zones[zi].baseN + RX_SWING, S.n - 1)
        for j in range(L, j1 + 1): valley = min(valley, S.L[j]) if d > 0 else max(valley, S.H[j])
        A.zone = zones[zi].cp()
        A.line = S_(dir=t.dir, a=t.a + L, b=t.b + L, pa=t.pa, pb=t.pb, ta=T.T[t.a], tb=T.T[t.b])
        A.legs = legs[:]; A.nLegs = len(legs); A.crossBar = cross; A.crossPx = zvAt(t, cross - L); A.strong = A.nRem >= 2; A.valley = valley
        out.append(A)
    m = len(out)
    for i in range(1, m):
        x = out[i]; j = i - 1
        while j >= 0 and out[j].zone.legBar > x.zone.legBar: out[j + 1] = out[j]; j -= 1
        out[j + 1] = x
    return m


class RxReading:
    def __init__(self):
        self.S, self.H, self.LS = RxSer(), RxSer(), RxSer()
        self.hasH = self.hasL = False
        self.zones, self.hz, self.lz, self.arr, self.larr = [], [], [], [], []


def arrArrivalTf(R, price, p, spread):
    R.nArr = 0; R.cur = -1; R.hasPlan = False; R.hasConfirm = False; R.pending = False
    R.arr = []; R.zones = []; R.hz = []; R.larr = []; R.lz = []
    R.lines = S_(); R.piv = []
    zvLines(R.S, R.lines, R.piv)
    if R.S.n - 1 < 20: return
    R.nArr = arrArrivals(R.S, p, R.zones, R.arr)
    for i in range(R.nArr):
        if not R.arr[i].zone.removed: R.cur = i; break
    if R.cur < 0: return
    cz = R.arr[R.cur].zone.cp()
    d = cz.dir
    hasCeil = hasLN = Hon = False; ceiling = lineNow = 0.0
    cl = S_(dir=0, a=0, b=0, pa=0.0, pb=0.0, ta=0, tb=0)
    if R.htf > 0 and R.hasH and R.H.n - 1 >= 10:
        Hon = True
        hr = S_(); hp = []
        zvLines(R.H, hr, hp)
        if hr.hasDn if d > 0 else hr.hasUp:
            t = hr.dn if d > 0 else hr.up
            lineNow = zvAt(t, 0); hasLN = True
            cl = S_(dir=t.dir, a=t.a, b=t.b, pa=t.pa, pb=t.pb, ta=R.H.T[t.a], tb=R.H.T[t.b])
            if (lineNow > price) if d > 0 else (lineNow < price): ceiling = lineNow; hasCeil = True
        if R.H.n > p.max_base + 4: zcDetect(R.H, p, R.hz)
    P = S_(nWeak=0, weak=[], realign=-1, target=-1)
    nz = len(R.zones)
    for i in range(nz):
        z = R.zones[i]
        if z.dir == -d and not z.removed and z.legBar <= p.max_zone_age and ((RxHi(z) > price) if d > 0 else (RxLo(z) < price)):
            if P.nWeak < RX_MAXW: P.weak.append(i); P.nWeak += 1
    if hasLN and P.nWeak > 0:
        for q in range(P.nWeak):
            i = P.weak[q]
            if P.realign < 0: P.realign = i; continue
            g1 = RxGap(lineNow, R.zones[i]); g0 = RxGap(lineNow, R.zones[P.realign])
            if g1 < g0 or (g1 == g0 and RxGap(price, R.zones[i]) < RxGap(price, R.zones[P.realign])): P.realign = i
    P.target = P.realign
    if P.target < 0:
        for q in range(P.nWeak):
            i = P.weak[q]
            if P.target < 0 or RxGap(price, R.zones[i]) < RxGap(price, R.zones[P.target]): P.target = i
    P.hasTargetPx = P.target >= 0; P.targetPx = R.zones[P.target].prox if P.hasTargetPx else 0.0
    P.hasTp = P.hasTargetPx; P.tp = P.targetPx; P.capped = False; P.extended = False; P.hasHtfZone = False
    if hasCeil:
        P.tp = ceiling if not P.hasTargetPx else (min(P.targetPx, ceiling) if d > 0 else max(P.targetPx, ceiling))
        P.hasTp = True; P.capped = P.tp == ceiling
    elif Hon:
        c = -1; nh = len(R.hz)
        for i in range(nh):
            z = R.hz[i]
            if not (z.dir == -d and not z.removed and z.legBar <= p.max_zone_age and ((RxLo(z) > price) if d > 0 else (RxHi(z) < price))): continue
            if c < 0 or RxGap(price, z) < RxGap(price, R.hz[c]): c = i
        if c >= 0:
            P.htfZone = R.hz[c].cp(); P.hasHtfZone = True
            if not P.hasTargetPx or ((R.hz[c].prox > P.targetPx) if d > 0 else (R.hz[c].prox < P.targetPx)): P.tp = R.hz[c].prox; P.hasTp = True; P.extended = True
    hostI = -1
    for i in range(len(R.hz)):
        z = R.hz[i]
        if not (z.dir == d and not z.removed and RxLo(z) <= RxHi(cz) and RxHi(z) >= RxLo(cz)): continue
        if hostI < 0 or z.legBar < R.hz[hostI].legBar: hostI = i
    st = S_(); hz0 = R.hz[hostI].cp() if hostI >= 0 else cz.cp()
    arrStopOf(R.S, d, R.arr[R.cur].valley, hostI >= 0 and Hon, hz0, spread, st)
    P.dir = d; P.entry = cz.prox; P.stop = st.stop; P.buffer = st.buffer; P.atr = st.atr; P.basis = st.basis; P.valley = st.valley; P.hasHost = st.hasHost
    if st.hasHost: P.host = st.host.cp()
    rr = [0.0]; P.hasRR = arrRrOf(cz.prox, st.stop, P.hasTp, P.tp, rr); P.rr = rr[0]
    P.hasCeiling = hasCeil; P.ceiling = ceiling; P.hasLineNow = hasLN; P.lineNow = lineNow; P.ceilingLine = cl
    R.plan = P; R.hasPlan = True
    if P.realign >= 0 and R.ltf > 0:
        R.pending = True
        if R.hasL and R.LS.n - 1 >= 20:
            nl = arrArrivals(R.LS, p, R.lz, R.larr)
            rz = R.zones[P.realign]
            t0 = (cz.tLeg // 60) * 60
            c = -1
            for i in range(nl):
                a = R.larr[i].zone
                if a.dir == -d and not a.removed and RxLo(a) <= RxHi(rz) and RxHi(a) >= RxLo(rz) and (a.tLeg // 60) * 60 >= t0: c = i; break
            if c >= 0:
                ap = []; np_ = zvPivots(R.S, min(RX_LOOK, R.S.n - 1 - RX_SWING), ap)
                want = 1 if d < 0 else -1; last = -1
                for q in range(np_):
                    if ap[q].t == want: last = q
                cs = S_(); arrStopOf(R.LS, -d, R.larr[c].valley, True, rz, spread, cs)
                K = S_(zone=R.larr[c].zone.cp(), arr=c, hasTarget=last >= 0, target=ap[last].p if last >= 0 else 0.0, inArea=RxGap(price, rz) == 0)
                K.entry = K.zone.prox; K.stop = cs.stop; K.buffer = cs.buffer; K.atr = cs.atr; K.basis = cs.basis
                rr2 = [0.0]; K.hasRR = arrRrOf(K.zone.prox, cs.stop, K.hasTarget, K.target, rr2); K.rr = rr2[0]
                R.conf = K; R.hasConfirm = True; R.pending = False


# ---- harness: fixture bars -> RxSer (as RxLoad fills it from iOpen / iHigh ... shift 1..), output in the TS shape ----
def epoch(s: str) -> int:
    fmt = '%Y-%m-%dT%H:%M' if len(s) >= 16 else '%Y-%m-%d'
    return int(datetime.strptime(s[:16] if len(s) >= 16 else s[:10], fmt).replace(tzinfo=timezone.utc).timestamp())


def ser_of(rows, tf, price, names):
    S = RxSer(); S.Alloc(len(rows), TF_MIN[tf])
    for i in range(1, S.n):
        d, o, h, l, c = rows[len(rows) - i]
        S.O[i], S.H[i], S.L[i], S.C[i] = float(o), float(h), float(l), float(c); S.T[i] = epoch(d); names.setdefault(tf, {})[S.T[i]] = d
    S.Finish(S.C[1] if price is None else float(price))
    return S


def run_case(c):
    names: dict[str, dict[int, str]] = {}
    p = RxParams(c['market'] == 'fx')
    R = RxReading(); R.tf = TF_MIN[c['tf']]; R.htf = TF_MIN[c['htf']] if c['htf'] else 0; R.ltf = TF_MIN[c['ltf']] if c['ltf'] else 0
    R.S = ser_of(c['bars'][c['tf']], c['tf'], None, names)
    if c['htf']: R.H = ser_of(c['bars'][c['htf']], c['htf'], c['price'], names); R.hasH = True
    if c['ltf']: R.LS = ser_of(c['bars'][c['ltf']], c['ltf'], None, names); R.hasL = True
    arrArrivalTf(R, float(c['price']), p, float(c.get('spread') or 0))
    nm = lambda t, k='S': names.get({'S': c['tf'], 'H': c['htf'], 'L': c['ltf']}[k], {}).get(t, '')
    Z = lambda z, k='S': {'dir': z.dir, 'prox': z.prox, 'dist': z.dist, 'legBar': z.legBar, 'saBar': z.saBar, 'removed': z.removed,
                   'removedBar': z.removedBar if z.removed else -1, 'tLeg': nm(z.tLeg, k), 't0': nm(z.baseStart, k), 'made': nm(z.made, k)}
    Ln = lambda t, k='S': {'dir': t.dir, 'a': t.a, 'b': t.b, 'pa': t.pa, 'pb': t.pb, 'ta': nm(t.ta, k), 'tb': nm(t.tb, k)}
    Ar = lambda a, zs, k='S': {'zone': Z(a.zone, k), 'line': Ln(a.line, k), 'legs': a.legs, 'crossBar': a.crossBar, 'crossPx': a.crossPx,
                        'removed': [Z(zs[y], k) for y in a.rem], 'strong': a.strong, 'valley': a.valley}
    lines = {'up': ({'a': R.lines.up.a, 'b': R.lines.up.b, 'pa': R.lines.up.pa, 'pb': R.lines.up.pb} if R.lines.hasUp else None),
             'dn': ({'a': R.lines.dn.a, 'b': R.lines.dn.b, 'pa': R.lines.dn.pa, 'pb': R.lines.dn.pb} if R.lines.hasDn else None),
             'upX': ({'a': R.lines.upX.a, 'b': R.lines.upX.b, 'pa': R.lines.upX.pa, 'pb': R.lines.upX.pb} if R.lines.hasUpX else None),
             'dnX': ({'a': R.lines.dnX.a, 'b': R.lines.dnX.b, 'pa': R.lines.dnX.pa, 'pb': R.lines.dnX.pb} if R.lines.hasDnX else None),
             'why': {'up': R.lines.whyUp, 'dn': R.lines.whyDn}}
    plan = None
    if R.hasPlan:
        P = R.plan
        plan = {'dir': P.dir, 'entry': P.entry, 'stop': P.stop, 'buffer': P.buffer, 'atr': P.atr, 'basis': 'htf' if P.basis == 1 else 'valley',
                'valley': P.valley, 'host': Z(P.host, 'H') if P.hasHost else None, 'rr': P.rr if P.hasRR else None,
                'ceiling': P.ceiling if P.hasCeiling else None, 'lineNow': P.lineNow if P.hasLineNow else None,
                'ceilingLine': Ln(P.ceilingLine, 'H') if P.hasLineNow else None, 'weak': [Z(R.zones[i]) for i in P.weak],
                'realign': Z(R.zones[P.realign]) if P.realign >= 0 else None, 'target': Z(R.zones[P.target]) if P.target >= 0 else None,
                'targetPx': P.targetPx if P.hasTargetPx else None, 'htfZone': Z(P.htfZone, 'H') if P.hasHtfZone else None,
                'tp': P.tp if P.hasTp else None, 'capped': P.capped, 'extended': P.extended}
    conf = None
    if R.hasConfirm:
        K = R.conf
        conf = {'tf': c['ltf'], 'zone': Z(K.zone, 'L'), 'arrival': Ar(R.larr[K.arr], R.lz, 'L'), 'target': K.target if K.hasTarget else None,
                'inArea': K.inArea, 'entry': K.entry, 'stop': K.stop, 'buffer': K.buffer, 'atr': K.atr,
                'basis': 'htf' if K.basis == 1 else 'valley', 'rr': K.rr if K.hasRR else None}
    return {'lines': lines, 'arrivals': [Ar(a, R.zones) for a in R.arr], 'current': R.cur, 'plan': plan, 'confirm': conf, 'pending': R.pending}, R


def close(a, b, path='$'):
    if isinstance(a, bool) or isinstance(b, bool):
        if a is not b: raise AssertionError(f'{path}: {a!r} != {b!r}')
        return
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if abs(a - b) > 1e-9 * max(1, abs(a)): raise AssertionError(f'{path}: {a} != {b}')
        return
    if isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b): raise AssertionError(f'{path}: length {len(a)} != {len(b)}')
        for i, (x, y) in enumerate(zip(a, b)): close(x, y, f'{path}[{i}]')
        return
    if isinstance(a, dict) and isinstance(b, dict):
        if sorted(a) != sorted(b): raise AssertionError(f'{path}: keys {sorted(a)} != {sorted(b)}')
        for k in a: close(a[k], b[k], f'{path}.{k}')
        return
    if a != b: raise AssertionError(f'{path}: {a!r} != {b!r}')


def run_fixtures(path: str | None = None, out_json: bool = False) -> int:
    fx = json.loads(Path(path or Path(__file__).with_name('arrival_fixtures.json')).read_text())
    bad, moms, errs = 0, {}, []
    for c in fx['cases']:
        got, R = run_case(c)
        m = R.lines.mom if getattr(R.lines, 'hasMom', False) else None
        moms[c['name']] = {'a': m.a, 'b': m.b, 'pa': m.pa, 'pb': m.pb, 'dir': m.dir} if m else None
        try:
            close(got, c['expected']); msg = 'ok'
        except AssertionError as e:
            bad += 1; msg = f'MISMATCH {e}'; errs.append(f"{c['name']}: {e}")
        if out_json: continue
        cur = got['arrivals'][got['current']] if got['current'] >= 0 else None
        print(f"{c['name']:<12} {c['tf']:<3} arrivals {len(got['arrivals'])}  current {('strong ' if cur and cur['strong'] else '') + ('demand' if cur and cur['zone']['dir'] > 0 else 'supply') if cur else '-':<14} {msg}")
    if out_json: print(json.dumps({'bad': bad, 'errors': errs[:5], 'momentum': moms}))
    else: print(f"{len(fx['cases']) - bad}/{len(fx['cases'])} fixture cases match the MQL port")
    return bad


# ==== RFX_STRUCT (RFX_ZoneCore.mqh, MT5 only; mirror of zvReal.ts) ====
RS_RC, RS_Near, RS_MinLeg, RS_MinSlope, RS_MinRise, RS_MomEff = 0.38, 0.25, 1.25, 0.015, 0.25, 0.6
RS_Osw, RS_MomBars, RS_Look = 2, 4, 200


def ZrPivot(): return S_(bar=0, p=0.0, t=0, conf=0)
def ZrLine(): return S_(dir=0, a=0, b=0, pa=0.0, pb=0.0, brokenAt=-1, kind=0)
def zrSlope(t): return (t.pb - t.pa) / max(1, t.a - t.b)
def zrAt(t, j): return t.pb + zrSlope(t) * (t.b - j)
def zrAtrLast(S):
    last = 0
    for i in range(1, S.n):
        if S.zvAtr(i) > 0: last = i
    return last
def zrA(S, i, al): return max(S.zvAtr(min(i, al)), 1e-12)
def zrOut(d, x, y): return x < y if d > 0 else x > y
def zrBeyond(S, t, d, j): return S.C[j] < zrAt(t, j) if d > 0 else S.C[j] > zrAt(t, j)


def zrOrigin(S, x, f, up):
    o = x
    for j in range(x + 1, f + 1):
        if (S.L[j] < S.L[o]) if up else (S.H[j] > S.H[o]): o = j
        if o != j: continue
        sw = True
        k = 1
        while k <= RS_Osw and sw:
            if j + k <= f and ((S.L[j] > S.L[j + k]) if up else (S.H[j] < S.H[j + k])): sw = False
            if j - k >= 1 and ((S.L[j] >= S.L[j - k]) if up else (S.H[j] <= S.H[j - k])): sw = False
            k += 1
        if sw: return j
    return o


def zrAddPiv(out, b, p, t, c): out.append(S_(bar=b, p=p, t=t, conf=c))


def zrPivots(S, bars, al, out):
    del out[:]
    if bars < 3: return 0
    d, hi, lo = 0, bars, bars
    for j in range(bars - 1, 0, -1):
        if d >= 0 and S.H[j] > S.H[hi]: hi = j
        if d <= 0 and S.L[j] < S.L[lo]: lo = j
        m0 = len(out)
        f = out[m0 - 1].bar if m0 > 0 else bars
        if d >= 0 and hi > j:
            o = zrOrigin(S, hi, f, True)
            leg = S.H[hi] - S.L[o]; m = DBL_MAX
            for k in range(hi - 1, j - 1, -1): m = min(m, S.L[k])
            need = max(0.0, min(RS_RC * leg, S.H[hi] - max(S.O[o], S.C[o]) - RS_Near * zrA(S, hi, al)))
            if leg >= RS_MinLeg * zrA(S, hi, al) and S.H[hi] - m >= need:
                if m0 == 0 and o > hi: zrAddPiv(out, o, S.L[o], -1, j)
                zrAddPiv(out, hi, S.H[hi], 1, j); d = -1; lo = hi - 1
                for k in range(hi - 1, j - 1, -1):
                    if S.L[k] <= S.L[lo]: lo = k
                continue
        if d <= 0 and lo > j:
            o = zrOrigin(S, lo, f, False)
            leg = S.H[o] - S.L[lo]; m = -DBL_MAX
            for k in range(lo - 1, j - 1, -1): m = max(m, S.H[k])
            need = max(0.0, min(RS_RC * leg, min(S.O[o], S.C[o]) - S.L[lo] - RS_Near * zrA(S, lo, al)))
            if leg >= RS_MinLeg * zrA(S, lo, al) and m - S.L[lo] >= need:
                if m0 == 0 and o > lo: zrAddPiv(out, o, S.H[o], 1, j)
                zrAddPiv(out, lo, S.L[lo], -1, j); d = 1; hi = lo - 1
                for k in range(lo - 1, j - 1, -1):
                    if S.H[k] >= S.H[hi]: hi = k
                continue
        m1 = len(out)
        if d == -1 and m1 > 0 and S.H[j] > out[m1 - 1].p: del out[m1 - 1]; d = 1; hi = j
        elif d == 1 and m1 > 0 and S.L[j] < out[m1 - 1].p: del out[m1 - 1]; d = -1; lo = j
    return len(out)


def zrPair(S, o, n, d, al, t):
    if (not (n.p > o.p)) if d > 0 else (not (n.p < o.p)): return False
    a = zvFitAnchor(S, o.bar, n.bar, n.p, d)
    t.dir = d; t.a = a; t.b = n.bar; t.pa = S.L[a] if d > 0 else S.H[a]; t.pb = n.p; t.brokenAt = -1; t.kind = 0
    if (not (t.pb > t.pa)) if d > 0 else (not (t.pb < t.pa)): return False
    ab = zrA(S, t.b, al)
    if abs(zrSlope(t)) < RS_MinSlope * ab or abs(t.pb - t.pa) < RS_MinRise * ab: return False
    return True


def zrImpulse(S, pb, pt, al):
    e = pb - RS_MomBars
    if e < 1: return False
    d = -pt
    r0 = S.H[pb] if d < 0 else S.L[pb]; fx = r0
    for j in range(pb - 1, e - 1, -1): fx = min(fx, S.L[j]) if d < 0 else max(fx, S.H[j])
    return d * (fx - r0) >= RS_MomEff * RS_MomBars * zrA(S, pb, al)


def zrMomentum(S, pb, pt, al, t):
    if not zrImpulse(S, pb, pt, al): return False
    d = -pt; A = pb; e = A - RS_MomBars; b = -1
    sl = 0.0; pA = S.L[A] if d > 0 else S.H[A]
    for j in range(A - 1, e - 1, -1):
        s = ((S.L[j] if d > 0 else S.H[j]) - pA) / (A - j)
        if b < 0 or ((s < sl) if d > 0 else (s > sl)): b = j; sl = s
    if b < 0 or d * sl <= 0: return False
    t.dir = d; t.a = A; t.b = b; t.pa = pA; t.pb = S.L[b] if d > 0 else S.H[b]; t.brokenAt = -1; t.kind = 1
    for j in range(e - 1, 0, -1):
        if zrBeyond(S, t, d, j): t.brokenAt = j; break
    return True


def zrLines(S, res, piv, hist):
    res.hasUp = res.hasDn = res.hasUpX = res.hasDnX = res.hasMom = False
    res.up = ZrLine(); res.dn = ZrLine(); res.upX = ZrLine(); res.dnX = ZrLine(); res.mom = ZrLine()
    del piv[:]; del hist[:]
    bars = min(RS_Look, S.n - 1 - RS_Osw)
    if bars <= RS_Osw + 2: return
    al = zrAtrLast(S)
    zrPivots(S, bars, al, piv)
    np_ = len(piv)
    for d in (1, -1):
        want = -1 if d > 0 else 1; k = 0; extBar = -1; nSeen = 0; liveIdx = -1; brkIdx = -1
        extP = 0.0
        seen = Arr([0] * (np_ + 1))
        hasP1 = hasPend = hasLast = hasBrk = False
        p1 = ZrPivot(); pend = ZrPivot(); lastB = ZrPivot(); brk = ZrLine()
        for j in range(bars, 0, -1):
            if liveIdx >= 0 and j < hist[liveIdx].b and zrBeyond(S, hist[liveIdx], d, j):
                hist[liveIdx].brokenAt = j; brk = hist[liveIdx].cp(); hasBrk = True; brkIdx = liveIdx; liveIdx = -1
            xj = S.L[j] if d > 0 else S.H[j]
            if extBar < 0 or zrOut(d, xj, extP):
                if liveIdx >= 0: hist[liveIdx].brokenAt = j; brk = hist[liveIdx].cp(); hasBrk = True; brkIdx = liveIdx; liveIdx = -1
                extBar = j; extP = xj; hasP1 = False; nSeen = 0; hasLast = False; hasPend = False
            if hasPend and not hasP1 and pend.bar - RS_MomBars >= j:
                if not zrImpulse(S, pend.bar, pend.t, al): p1 = pend.cp(); hasP1 = True; nSeen = 0; hasLast = False
                hasPend = False
            while k < np_ and piv[k].conf >= j:
                pk = piv[k]
                if pk.t != want: k += 1; continue
                if pk.bar == extBar: pend = pk.cp(); hasPend = True; k += 1; continue
                if not zrOut(d, extP, pk.p): k += 1; continue
                if not hasP1 or not zrOut(d, p1.p, pk.p) or (hasLast and liveIdx < 0 and zrOut(d, pk.p, lastB.p)):
                    if liveIdx >= 0: hist[liveIdx].brokenAt = pk.bar; brk = hist[liveIdx].cp(); hasBrk = True; brkIdx = liveIdx; liveIdx = -1
                    p1 = pk.cp(); hasP1 = True; nSeen = 0; hasLast = False
                    k += 1; continue
                seen[nSeen] = k; nSeen += 1
                if liveIdx >= 0: k += 1; continue
                tried = Arr([0] * nSeen)
                got = False; q = -1; t = ZrLine()
                r = 0
                while r < nSeen and not got:
                    bi = -1; bs = 0.0
                    for x in range(nSeen):
                        if tried[x] != 0: continue
                        s = (piv[seen[x]].p - p1.p) / (p1.bar - piv[seen[x]].bar)
                        if bi < 0 or ((s < bs) if d > 0 else (s > bs)) or (s == bs and piv[seen[x]].bar < piv[seen[bi]].bar): bi = x; bs = s
                    tried[bi] = 1; q = seen[bi]
                    got = zrPair(S, p1, piv[q], d, al, t)
                    r += 1
                if not got:
                    if nSeen == 1: p1 = piv[k].cp(); nSeen = 0
                    k += 1; continue
                if brkIdx >= 0 and brk.a == t.a: del hist[brkIdx]; brkIdx = -1
                lastB = piv[q].cp(); hasLast = True
                bj = -1
                for x in range(t.b - 1, j - 1, -1):
                    if zrBeyond(S, t, d, x): bj = x; break
                hist.append(t.cp())
                if bj >= 0:
                    hist[len(hist) - 1].brokenAt = bj; brk = hist[len(hist) - 1].cp(); hasBrk = True; brkIdx = len(hist) - 1
                    k += 1; continue
                liveIdx = len(hist) - 1
                k += 1
        if d > 0:
            res.hasUp = liveIdx >= 0
            if liveIdx >= 0: res.up = hist[liveIdx].cp()
            res.hasUpX = hasBrk; res.upX = brk.cp()
        else:
            res.hasDn = liveIdx >= 0
            if liveIdx >= 0: res.dn = hist[liveIdx].cp()
            res.hasDnX = hasBrk; res.dnX = brk.cp()
    for i in range(np_):
        m = ZrLine()
        if zrMomentum(S, piv[i].bar, piv[i].t, al, m): hist.append(m)
    nh = len(hist)
    for i in range(1, nh):
        v = hist[i]; x = i - 1
        while x >= 0 and (hist[x].a > v.a or (hist[x].a == v.a and hist[x].b > v.b)): hist[x + 1] = hist[x]; x -= 1
        hist[x + 1] = v
    for i in range(nh // 2): hist[i], hist[nh - 1 - i] = hist[nh - 1 - i], hist[i]
    if np_ > 0:
        for i in range(nh):
            if hist[i].kind == 1 and hist[i].a == piv[np_ - 1].bar: res.mom = hist[i].cp(); res.hasMom = True; break


def zrPhase(S, r, piv, ph):
    np_ = len(piv); pk1 = pk2 = vl1 = vl2 = -1
    for i in range(np_ - 1, -1, -1):
        if piv[i].t > 0:
            if pk1 < 0: pk1 = i
            elif pk2 < 0: pk2 = i
        else:
            if vl1 < 0: vl1 = i
            elif vl2 < 0: vl2 = i
    trend = 0
    if pk2 >= 0 and vl2 >= 0:
        if piv[pk1].p > piv[pk2].p and piv[vl1].p > piv[vl2].p: trend = 1
        elif piv[pk1].p < piv[pk2].p and piv[vl1].p < piv[vl2].p: trend = -1
    if trend > 0 and S.C[1] < piv[vl1].p: trend = 0
    if trend < 0 and S.C[1] > piv[pk1].p: trend = 0
    leg = -piv[np_ - 1].t if np_ > 0 else 0
    ph.trend = trend; ph.leg = leg; ph.phase = 0 if (trend == 0 or leg == 0) else (1 if leg == trend else 2); ph.hasTarget = False; ph.target = 0.0
    if ph.phase != 2: return
    if trend > 0 and r.hasUp: ph.hasTarget = True; ph.target = zrAt(r.up, 0)
    elif trend < 0 and r.hasDn: ph.hasTarget = True; ph.target = zrAt(r.dn, 0)
    elif trend > 0: ph.hasTarget = True; ph.target = piv[vl1].p
    else: ph.hasTarget = True; ph.target = piv[pk1].p


def run_struct(path: str, out_json: bool = False) -> int:
    """Replay struct cases ({cases: [{name, tf, bars, expected}]}, scripts/struct-cases.ts) through the RFX_STRUCT port."""
    fx = json.loads(Path(path).read_text())
    bad, errs = 0, []
    L = lambda t: {'dir': t.dir, 'a': t.a, 'b': t.b, 'pa': t.pa, 'pb': t.pb, 'brokenAt': t.brokenAt, 'kind': 'momentum' if t.kind == 1 else 'trend'}
    for c in fx['cases']:
        S = ser_of(c['bars'], c['tf'], c.get('price'), {})
        res = S_(); piv = []; hist = []; ph = S_()
        try:
            zrLines(S, res, piv, hist); zrPhase(S, res, piv, ph)
            got = {'pivots': [{'bar': p.bar, 'p': p.p, 't': p.t, 'conf': p.conf} for p in piv], 'hist': [L(t) for t in hist],
                   'up': L(res.up) if res.hasUp else None, 'dn': L(res.dn) if res.hasDn else None,
                   'upX': L(res.upX) if res.hasUpX else None, 'dnX': L(res.dnX) if res.hasDnX else None, 'mom': L(res.mom) if res.hasMom else None,
                   'phase': {'trend': ph.trend, 'leg': ph.leg, 'phase': ['range', 'impulse', 'correction'][ph.phase], 'target': ph.target if ph.hasTarget else None}}
            close(got, c['expected']); msg = 'ok'
        except (AssertionError, IndexError) as e:
            bad += 1; msg = f'MISMATCH {e}'; errs.append(f"{c['name']}: {e}")
        if not out_json: print(f"{c['name']:<14} {c['tf']:<3} {msg}")
    if out_json: print(json.dumps({'bad': bad, 'errors': errs[:5], 'cases': len(fx['cases'])}))
    else: print(f"{len(fx['cases']) - bad}/{len(fx['cases'])} struct cases match the RFX_STRUCT port")
    return bad


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if '--struct' in sys.argv: sys.exit(1 if run_struct(args[0], out_json='--json' in sys.argv) else 0)
    sys.exit(1 if run_fixtures(args[0] if args else None, out_json='--json' in sys.argv) else 0)
