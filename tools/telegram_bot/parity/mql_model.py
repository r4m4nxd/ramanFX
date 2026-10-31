"""Mechanical Python port of the MQL RFX_MODEL block (public/tools/RFX_ZoneCore.mqh, ZoneVision 2.17): the same functions,
the same loops, the same integer shifts (0 = phantom, 1 = newest closed bar), statement by statement, so the MQL logic can
be replayed without MetaTrader. It reads the MQL text, never the TypeScript (supabase/functions/telegram-bot/zvModel.ts);
src/core/zvModelParity.test.ts compares the two on the acceptance charts and random windows.

    python3 tools/telegram_bot/parity/mql_port.py CASES.json --model [--json]
"""
from __future__ import annotations

from decimal import ROUND_HALF_UP, Decimal

from mql_port import DBL_MAX, RX_Q, RxParams, S_, ser_of, zcDetect


def ZmInner(why): return why >= 10

P = dict(rc=0.45, near=0.25, minLeg=1.25, fitTol=0.02, minRise=0.25, minSlope=0.015, vetoTol=0.05,
         rangeBaseATR=2.5, targetGap=1.0, p1Retrace=0.50, p1Shift=1, vetoBars=8, brokenShow=20, rangeBaseMax=20, q1=0, q2=0,
         lineMode=1, vetoClose=0.5, nestGap=0.8, touchTol=0.15, momShift=0.0, momTol=0.03, momMin=0.15, pivZones=2, zoneSwing=2)
P_DEFAULT = dict(P)


def dts(v, dg):
    """MQL DoubleToString / JS toFixed on the binary value (exact decimal expansion, half away from zero)."""
    d = Decimal(v).quantize(Decimal(1).scaleb(-dg), rounding=ROUND_HALF_UP)
    s = format(d, 'f')
    return '0' + s[2:] if s.startswith('-0') and float(s) == 0 else s


def ZmAt(t, j): return t.pb + ((t.pb - t.pa) / max(1, t.a - t.b)) * (t.b - j)
def ZmMk(dir_, kind, a, b, pa, pb, born, p2, why): return S_(dir=dir_, kind=kind, a=a, b=b, pa=pa, pb=pb, born=born, brokenAt=-1, p2=p2, touches=0, why=why)
def Piv(bar, p, t, conf): return S_(bar=bar, p=p, t=t, conf=conf)


class ZmAtrC:
    def Init(self, S):
        self.v = [0.0] * S.n; self.last = 0
        for i in range(S.n):
            self.v[i] = S.wa[i] if S.virt else S.a[i]
            if i >= 1 and self.v[i] > 0: self.last = i
    def At(self, i): x = min(max(i, 0), self.last); return max(self.v[x], 1e-12)


# ---- 1. real pivots ----
def ZmOrigin(S, A, a, x, d):
    xp = S.H[x] if d > 0 else S.L[x]
    for c in range(x + 1, a + 1):
        gap = S.L[c - 1] > S.H[c] if d > 0 else S.H[c - 1] < S.L[c]
        dep = not S.basing(c - 1) and S.cdir(c - 1) == d
        if not (gap or (S.basing(c) and dep)): continue
        dist = DBL_MAX if d > 0 else -DBL_MAX; prox = -DBL_MAX if d > 0 else DBL_MAX
        i = c
        while i <= a and i - c < 6:
            if i > c and (gap or not S.basing(i)): break
            dist = min(dist, S.L[i]) if d > 0 else max(dist, S.H[i])
            prox = max(prox, max(S.O[i], S.C[i])) if d > 0 else min(prox, min(S.O[i], S.C[i]))
            i += 1
        if abs(xp - dist) >= P['minLeg'] * A.At(x): return True, prox
    return False, 0.0


def PBar(frm, q): return frm - (q >> 1)
def PHigh(S, frm, q): b = PBar(frm, q); lowFirst = S.C[b] >= S.O[b]; return lowFirst if (q & 1) == 1 else not lowFirst
def PVal(S, frm, q): b = PBar(frm, q); return S.H[b] if PHigh(S, frm, q) else S.L[b]
def Better(S, frm, t, r, cur):
    if cur < 0: return True
    return PVal(S, frm, r) < PVal(S, frm, cur) if t > 0 else PVal(S, frm, r) > PVal(S, frm, cur)


def ZmPivots(S, A):
    out, oq = [], []
    frm = S.n - 1; NP = 2 * frm
    if frm < 3: return out
    def push(r, t, conf): out.append(Piv(PBar(frm, r), PVal(S, frm, r), t, conf)); oq.append(r)
    def scanY(to):
        m = len(out) - 1; yq = y2 = -1
        for r in range(oq[m] + 1, to + 1):
            if PHigh(S, frm, r) != (out[m].t < 0): continue
            if Better(S, frm, out[m].t, r, yq): yq = r
            if PBar(frm, r) < out[m].bar and Better(S, frm, out[m].t, r, y2): y2 = r
        return yq, y2
    hq = lq = -1; q = 0
    while q < NP:
        if PHigh(S, frm, q):
            if hq < 0 or PVal(S, frm, q) > PVal(S, frm, hq): hq = q
        elif lq < 0 or PVal(S, frm, q) < PVal(S, frm, lq): lq = q
        if hq >= 0 and lq >= 0 and PVal(S, frm, hq) - PVal(S, frm, lq) >= P['minLeg'] * A.At(PBar(frm, q)): break
        q += 1
    if q >= NP: return out
    if lq < hq: push(lq, -1, PBar(frm, q)); push(hq, 1, -1)
    else: push(hq, 1, PBar(frm, q)); push(lq, -1, -1)
    yq, y2 = scanY(q)
    q += 1
    while q < NP:
        hi = PHigh(S, frm, q); v = PVal(S, frm, q); j = PBar(frm, q)
        m = len(out) - 1
        if hi == (out[m].t > 0) and (v > out[m].p if out[m].t > 0 else v < out[m].p):
            oq[m] = q; out[m].bar = j; out[m].p = v; out[m].conf = -1; yq = y2 = -1; q += 1; continue
        if hi == (out[m].t < 0):
            if Better(S, frm, out[m].t, q, yq): yq = q
            if j < out[m].bar and Better(S, frm, out[m].t, q, y2): y2 = q
        guard = 0
        while guard < 64 and yq >= 0:
            guard += 1
            m = len(out) - 1
            leg = abs(out[m].p - out[m - 1].p)
            legOk = leg >= P['minLeg'] * A.At(out[m].bar)
            if legOk and y2 >= 0:
                yp = PVal(S, frm, y2)
                ok = abs(out[m].p - yp) >= P['rc'] * leg
                if not ok:
                    has, o = ZmOrigin(S, A, out[m - 1].bar, out[m].bar, out[m].t)
                    if has: ok = yp <= o + P['near'] * A.At(out[m].bar) if out[m].t > 0 else yp >= o - P['near'] * A.At(out[m].bar)
                if ok:
                    out[m].conf = j; push(yq, -out[m].t, -1); yq, y2 = scanY(q); continue
            if not legOk and (PVal(S, frm, yq) < out[m - 1].p if out[m].t > 0 else PVal(S, frm, yq) > out[m - 1].p):
                del out[m]; del oq[m]
                x = m - 1
                oq[x] = yq; out[x].bar = PBar(frm, yq); out[x].p = PVal(S, frm, yq)
                if m > 1: out[x].conf = -1
                if m == 1:
                    yq, y2 = scanY(q)
                    if yq >= 0: push(yq, -out[x].t, -1)
                yq, y2 = scanY(q)
                continue
            break
        q += 1
    return out


# ---- 2. lines ----
def ZmMX(S, d, j): return S.L[j] if d > 0 else S.H[j]
def ZmMUse(S, d, j, xBar, hasQ): return j != xBar or not hasQ or ((S.C[j] >= S.O[j]) if d > 0 else (S.C[j] < S.O[j]))


def ZmMomHull(S, d, a, xBar, hasQ):
    b = -1; sl = 0.0
    for j in range(a - 1, xBar - 1, -1):
        if not ZmMUse(S, d, j, xBar, hasQ): continue
        v = (ZmMX(S, d, j) - ZmMX(S, d, a)) / (a - j)
        if b < 0 or (v < sl if d > 0 else v > sl): b = j; sl = v
    return b, sl


def ZmMomTol(S, A, d, a, xBar, hasQ, b, sl):
    if b < 0: return b, sl
    for j in range(a - 1, xBar - 1, -1):
        if not ZmMUse(S, d, j, xBar, hasQ) or j == b: continue
        v = (ZmMX(S, d, j) - ZmMX(S, d, a)) / (a - j)
        if not (v > sl if d > 0 else v < sl): continue
        ok = True
        h = a - 1
        while h >= xBar and ok:
            if h != j and ZmMUse(S, d, h, xBar, hasQ) and d * (ZmMX(S, d, a) + v * (a - h) - ZmMX(S, d, h)) > P['momTol'] * A.At(h): ok = False
            h -= 1
        if ok and (v > sl if d > 0 else v < sl): b = j; sl = v
    return b, sl


def ZmMomentum(S, A, piv, i):
    hasQ = i + 1 < len(piv)
    d = -piv[i].t; xBar = piv[i + 1].bar if hasQ else 1
    if piv[i].bar - xBar < 1: return None
    a = piv[i].bar
    b, sl = ZmMomHull(S, d, a, xBar, hasQ)
    if b == a - 1 and abs(sl) < P['momShift'] * A.At(a) and a - 1 > xBar:
        a = a - 1; b, sl = ZmMomHull(S, d, a, xBar, hasQ)
    b, sl = ZmMomTol(S, A, d, a, xBar, hasQ, b, sl)
    if b < 0 or d * sl <= 0 or abs(sl) < P['momMin'] * A.At(a): return None
    t = ZmMk(d, 1, a, b, ZmMX(S, d, a), ZmMX(S, d, b), b, piv[i].bar, 5)
    for j in range(b - 1, 0, -1):
        if (S.C[j] < ZmAt(t, j)) if d > 0 else (S.C[j] > ZmAt(t, j)): t.brokenAt = j; break
    return t


class ZmDirF:
    """RFX_ZoneCore.mqh ZmDirF (zvModel.ts zmDirF): the forward-time line machine."""
    def __init__(self, S, A, sw, d):
        self.S, self.A, self.d = S, A, d
        self.sideAll = [p for p in sw if p.t == -d]
        side = [p for p in sw if p.t == -d and p.conf >= 0]
        for i in range(1, len(side)):
            v = side[i]; x = i - 1
            while x >= 0 and side[x].bar < v.bar: side[x + 1] = side[x]; x -= 1
            side[x + 1] = v
        self.side = side
        ev = []
        for i in range(1, len(side)):
            h0 = -1
            for h in range(i - 1, -1, -1):
                if self.Out(side[h].p, side[i].p): h0 = h; break
            if h0 < 0 or side[h0].bar - side[i].bar < 2: continue
            ox = self.Y(side[h0].bar - 1)
            for j in range(side[h0].bar - 1, side[i].bar, -1): ox = max(ox, self.Y(j)) if d > 0 else min(ox, self.Y(j))
            kb = -1; sb = side[i].bar
            if ((S.C[sb] >= S.O[sb]) if d > 0 else (S.C[sb] < S.O[sb])) and self.Thru(sb, ox): kb = sb
            j = sb - 1
            while j >= 1 and kb < 0:
                if self.Thru(j, ox): kb = j; break
                j -= 1
            if kb < 0: continue
            ev.append(S_(s=side[i], s0=side[h0], e=min(kb, side[i].conf)))
        for i in range(1, len(ev)):
            v = ev[i]; x = i - 1
            while x >= 0 and (ev[x].e < v.e or (ev[x].e == v.e and ev[x].s.bar < v.s.bar)): ev[x + 1] = ev[x]; x -= 1
            ev[x + 1] = v
        self.ev = ev
        self.hist = []; self.live = []; self.orph = []; self.third = []
        self.hasChain = False; self.chainBar = -1; self.chainBrk = -1; self.chainP = 0.0
        self.hasWait = False; self.waitP = None; self.ei = 0

    def X(self, j): return self.S.L[j] if self.d > 0 else self.S.H[j]
    def Y(self, j): return self.S.H[j] if self.d > 0 else self.S.L[j]
    def Out(self, x, y): return x < y if self.d > 0 else x > y
    def Beyond(self, t, j): return self.S.C[j] < ZmAt(t, j) if self.d > 0 else self.S.C[j] > ZmAt(t, j)
    def Thru(self, j, ox): return self.Y(j) > ox if self.d > 0 else self.Y(j) < ox

    def SlopeOk(self, a, pa, b, pb):
        ab = self.A.At(b); rise = self.d * (pb - pa)
        return rise > 0 and rise >= P['minRise'] * ab and rise / max(1, a - b) >= P['minSlope'] * ab

    def Build(self, a, b, to):
        d = self.d; X = self.X; A = self.A
        pa = X(a); bb = b; sl = (X(b) - pa) / (a - b); poke = False
        for j in range(b - 1, to - 1, -1):
            if d * (pa + sl * (a - j) - X(j)) > P['fitTol'] * A.At(j): poke = True
        if poke:
            for j in range(b - 1, to - 1, -1):
                s2 = (X(j) - pa) / (a - j)
                if s2 < sl if d > 0 else s2 > sl: sl = s2; bb = j
        pb = X(bb); clean = True
        for j in range(a - 1, bb, -1):
            if d * (pa + ((pb - pa) / (a - bb)) * (a - j) - X(j)) > 1e-9 * abs(pa): clean = False; break
        return S_(a=a, b=bb, pa=pa, pb=pb, clean=clean)

    def Slope(self, pa, pb, a, b): return (pb - pa) / max(1, a - b)

    def Veto(self, h, kk):
        d = self.d; S = self.S; A = self.A; t = self.hist[h]
        if kk - 1 < 1 or d * (ZmAt(t, kk) - S.C[kk]) > P['vetoClose'] * A.At(kk): return False
        lv = ZmAt(t, kk - 1)
        back = S.C[kk - 1] >= lv - P['vetoTol'] * A.At(kk - 1) if d > 0 else S.C[kk - 1] <= lv + P['vetoTol'] * A.At(kk - 1)
        if not back: return False
        pv = -1
        for p in self.sideAll:
            if (p.bar == kk or p.bar == kk - 1) and d * (ZmAt(t, p.bar) - p.p) > 0: pv = p.bar; break
        if pv < 0: return False
        ex = self.Y(t.a)
        for j in range(t.a - 1, kk, -1): ex = max(ex, self.Y(j)) if d > 0 else min(ex, self.Y(j))
        r = self.Build(t.a, pv, pv)
        rl = ZmMk(d, 0, r.a, r.b, r.pa, r.pb, 0, pv, 4)
        for x in range(kk - 1, max(1, kk - P['vetoBars']) - 1, -1):
            if x < rl.b and self.Beyond(rl, x): return False
            if self.Y(x) > ex if d > 0 else self.Y(x) < ex:
                t.b = rl.b; t.pb = rl.pb; t.p2 = pv; t.why = 4; t.touches += 1; return True
        return False

    def Has(self, a, b): return any(h.a == a and h.b == b for h in self.hist)

    def Broke(self, h, x):
        self.hist[h].brokenAt = x
        if h not in self.live: return
        self.live.remove(h)
        self.hasChain = True; self.chainBar = self.hist[h].p2; self.chainP = self.X(self.hist[h].p2); self.chainBrk = x

    def Born(self, t, j):
        if self.Has(t.a, t.b): return
        h = len(self.hist); self.hist.append(t); self.third.append(-1)
        for x in range(t.b - 1, j - 1, -1):
            if self.Beyond(t, x) and not self.Veto(h, x):
                t.brokenAt = x; self.hasChain = True; self.chainBar = t.p2; self.chainP = self.X(t.p2); self.chainBrk = x; return
        self.live.append(h)

    def LineFrom(self, a, s, j, why, whyShift, steeper):
        for sh in range(0, P['p1Shift'] + 1):
            if a - sh <= s.bar: return False
            r = self.Build(a - sh, s.bar, j)
            if not r.clean: continue
            if not self.SlopeOk(r.a, r.pa, r.b, r.pb): return False
            if steeper >= 0:
                L = self.hist[steeper]
                s1 = self.Slope(r.pa, r.pb, r.a, r.b); s2 = self.Slope(L.pa, L.pb, L.a, L.b)
                if not (s1 > s2 if self.d > 0 else s1 < s2): return False
            if self.Has(r.a, r.b): return True
            self.Born(ZmMk(self.d, 0, r.a, r.b, r.pa, r.pb, j, s.bar, whyShift if sh > 0 else why), j)
            return True
        return False

    def Step(self, j):
        d = self.d; A = self.A
        confirmed = False
        for h in list(self.live):
            t = self.hist[h]
            if j >= t.b: continue
            if self.Beyond(t, j):
                if not self.Veto(h, j): self.Broke(h, j)
            elif d * (ZmAt(t, j) - self.X(j)) > -P['fitTol'] * A.At(j): t.touches += 1
        for h in self.orph:
            t = self.hist[h]
            if t.brokenAt < 0 and j < t.b and self.Beyond(t, j) and not self.Veto(h, j): t.brokenAt = j
        while self.ei < len(self.ev) and self.ev[self.ei].e >= j:
            sv = self.ev[self.ei].s; s0 = self.ev[self.ei].s0
            self.ei += 1
            if self.hasChain and not self.Out(self.chainP, sv.p): self.hasChain = False
            if self.hasWait and not self.Out(self.waitP.p, sv.p): self.hasWait = False
            if self.hasChain and sv.bar <= self.chainBrk:
                cb = self.chainBar; self.hasChain = False
                if self.LineFrom(cb, sv, j, 3, 9, -1): continue
                if s0.bar < cb and self.LineFrom(s0.bar, sv, j, 0, 1, -1): continue
                self.waitP = sv; self.hasWait = True; continue
            L = -1
            for h in self.live:
                if L < 0 or self.hist[h].born < self.hist[L].born: L = h
            gap = d * (sv.p - ZmAt(self.hist[L], sv.bar)) if L >= 0 else 0.0
            if L >= 0 and sv.bar < self.hist[L].b and gap < P['touchTol'] * A.At(sv.bar):
                if self.third[L] < 0: self.third[L] = sv.bar
                continue
            if L >= 0 and sv.bar < self.hist[L].b and gap > 0:
                if self.third[L] >= 0 and sv.bar < self.third[L] and self.LineFrom(self.third[L], sv, j, 14, 15, -1): self.third[L] = -1; continue
                if gap >= P['nestGap'] * A.At(sv.bar) and self.LineFrom(self.hist[L].p2, sv, j, 10, 11, L): continue
                if s0.bar < self.hist[L].b and self.LineFrom(s0.bar, sv, j, 12, 13, -1): continue
                continue
            if L >= 0: continue
            if self.hasWait and sv.bar < self.waitP.bar:
                w = self.waitP; self.hasWait = False
                if self.LineFrom(w.bar, sv, j, 2, 8, -1): continue
                if s0.bar < w.bar and self.LineFrom(s0.bar, sv, j, 0, 1, -1): continue
                self.waitP = sv; self.hasWait = True; continue
            made = False
            for sh in range(0, P['p1Shift'] + 1):
                if made: break
                a = s0.bar - sh
                if a <= sv.bar: break
                r = self.Build(a, sv.bar, j)
                if not r.clean: continue
                if not self.SlopeOk(r.a, r.pa, r.b, r.pb): break
                self.Born(ZmMk(d, 0, r.a, r.b, r.pa, r.pb, j, sv.bar, 1 if sh > 0 else 0), j)
                made = True
            if not made: self.waitP = sv; self.hasWait = True
            confirmed = True
        return confirmed

    def EndStructure(self):
        self.hasWait = False; self.hasChain = False
        self.orph.extend(self.live); self.live = []


class ZmDir:
    def __init__(self, S, A, piv, d):
        self.S, self.A, self.d = S, A, d
        self.side = [p.cp() for p in piv if p.conf >= 0 and p.t == -d]
        self.opp = [p.cp() for p in piv if p.conf >= 0 and p.t == d]
        side = self.side                                     # conf desc, then bar desc (stable insertion sort)
        for i in range(1, len(side)):
            v = side[i]; x = i - 1
            while x >= 0 and (side[x].conf < v.conf or (side[x].conf == v.conf and side[x].bar < v.bar)): side[x + 1] = side[x]; x -= 1
            side[x + 1] = v
        self.hist, self.dele, self.pends, self.orph = [], [], [], []
        self.prev = None; self.waitA = None; self.waitSkip = 0; self.live = -1; self.major = -1; self.majorE = None
        self.chainR = -1; self.chainP = 0.0; self.brkBar = -1; self.si = 0; self.skip0 = P['q2']

    def X(self, j): return self.S.L[j] if self.d > 0 else self.S.H[j]
    def Y(self, j): return self.S.H[j] if self.d > 0 else self.S.L[j]
    def Out(self, x, y): return x < y if self.d > 0 else x > y
    def Beyond(self, t, j): return self.S.C[j] < ZmAt(t, j) if self.d > 0 else self.S.C[j] > ZmAt(t, j)

    def OppBetween(self, a, b):
        has = False; best = 0.0; d = self.d
        for o in self.opp:
            if b < o.bar < a and (not has or (o.p > best if d > 0 else o.p < best)): best = o.p; has = True
        if not has:
            for j in range(a - 1, b, -1):
                if not has or (self.Y(j) > best if d > 0 else self.Y(j) < best): best = self.Y(j); has = True
        if not has: return DBL_MAX if d > 0 else -DBL_MAX
        return best

    def SlopeOk(self, a, pa, b, pb):
        ab = self.A.At(b); rise = self.d * (pb - pa)
        return rise > 0 and rise >= P['minRise'] * ab and rise / max(1, a - b) >= P['minSlope'] * ab

    def Build(self, a, b, to):
        d = self.d; pa = self.X(a); bb = b; sl = (self.X(b) - pa) / (a - b); poke = False
        for j in range(b - 1, to - 1, -1):
            if d * (pa + sl * (a - j) - self.X(j)) > P['fitTol'] * self.A.At(j): poke = True
        if poke:
            for j in range(b - 1, to - 1, -1):
                s = (self.X(j) - pa) / (a - j)
                if s < sl if d > 0 else s > sl: sl = s; bb = j
        pb = self.X(bb); clean = True
        for j in range(a - 1, bb, -1):
            if d * (pa + ((pb - pa) / (a - bb)) * (a - j) - self.X(j)) > 1e-9 * abs(pa): clean = False; break
        return S_(a=a, b=bb, pa=pa, pb=pb, clean=clean)

    def Push(self, t): self.hist.append(t); self.dele.append(False); return len(self.hist) - 1

    def Veto(self, h, kk):
        S, d, t = self.S, self.d, self.hist[h]
        if kk - 1 < 1: return False
        lv = ZmAt(t, kk - 1)
        back = S.C[kk - 1] >= lv - P['vetoTol'] * self.A.At(kk - 1) if d > 0 else S.C[kk - 1] <= lv + P['vetoTol'] * self.A.At(kk - 1)
        if not back: return False
        pv = -1
        for p in self.side:
            if (p.bar == kk or p.bar == kk - 1) and d * (ZmAt(t, p.bar) - p.p) > 0: pv = p.bar; break
        if pv < 0: return False
        ex = self.Y(t.a)
        for j in range(t.a - 1, kk, -1): ex = max(ex, self.Y(j)) if d > 0 else min(ex, self.Y(j))
        r = self.Build(t.a, pv, pv)
        rl = ZmMk(d, 0, r.a, r.b, r.pa, r.pb, 0, pv, 4)
        for x in range(kk - 1, max(1, kk - P['vetoBars']) - 1, -1):
            if x < rl.b and self.Beyond(rl, x): return False
            if self.Y(x) > ex if d > 0 else self.Y(x) < ex:
                t.b = rl.b; t.pb = rl.pb; t.p2 = pv; t.why = 4; t.touches += 1; return True
        return False

    def FirstBreak(self, h, to):
        for x in range(self.hist[h].b - 1, to - 1, -1):
            if self.Beyond(self.hist[h], x) and not self.Veto(h, x): return x
        return -1

    def MomFrom(self, r, j, p2):
        m = ZmMk(self.d, 1, r.a, r.b, r.pa, r.pb, j, p2, 7)
        for x in range(m.b - 1, 0, -1):
            if self.Beyond(m, x): m.brokenAt = x; break
        self.Push(m)

    def BrokeAt(self, h, x):
        self.hist[h].brokenAt = x
        if h == self.live: self.live = -1; self.chainR = self.hist[h].p2; self.chainP = self.X(self.hist[h].p2); self.brkBar = x

    def Born(self, t, j):
        h = self.Push(t); x = self.FirstBreak(h, j)
        if x < 0: self.live = h
        else: self.BrokeAt(h, x)

    def LineFrom(self, a, b, j, why):
        r = self.Build(a.bar, b.bar, j)
        if not self.SlopeOk(r.a, r.pa, r.b, r.pb): return False
        self.Born(ZmMk(self.d, 0, r.a, r.b, r.pa, r.pb, j, b.bar, why), j)
        return True

    def WaitStep(self, p, j):
        if self.Out(self.waitA.p, p.p):
            if self.waitSkip > 0: self.waitA = p; self.waitSkip -= 1
            else:
                w = self.waitA; self.waitA = None
                if not self.LineFrom(w, p, j, 2): self.waitA = p; self.waitSkip = 0
        else: self.waitA = None

    def Step(self, j):
        S, d = self.S, self.d
        confirmed = False
        if self.live >= 0 and j < self.hist[self.live].b:
            lt = self.hist[self.live]
            if self.Beyond(lt, j):
                if not self.Veto(self.live, j): self.BrokeAt(self.live, j)
            elif d * (ZmAt(lt, j) - self.X(j)) > -P['fitTol'] * self.A.At(j): lt.touches += 1
        if self.major >= 0 and self.hist[self.major].brokenAt < 0 and j < self.hist[self.major].b and self.Beyond(self.hist[self.major], j): self.hist[self.major].brokenAt = j
        for h in self.orph:
            if self.hist[h].brokenAt < 0 and j < self.hist[h].b and self.Beyond(self.hist[h], j) and not self.Veto(h, j): self.hist[h].brokenAt = j
        while self.si < len(self.side) and self.side[self.si].conf >= j:
            p = self.side[self.si]; self.si += 1
            pr = self.prev; self.prev = p
            if self.chainR >= 0 and self.live < 0 and p.bar < self.brkBar:
                R = Piv(self.chainR, self.chainP, -d, j)
                self.chainR = -1
                if self.Out(self.chainP, p.p):
                    if not self.LineFrom(R, p, j, 3): self.waitA = p; self.waitSkip = 0
                    continue
            if self.live >= 0: continue
            if self.waitA is not None: self.WaitStep(p, j); continue
            keep = []
            for c in self.pends:
                k = True
                if self.Out(p.p, c.c1.p):
                    if self.Out(c.e.p, p.p): c.c1 = p
                    else: k = False
                if k: keep.append(c)
            self.pends = keep
            if pr is not None and self.Out(pr.p, p.p): self.pends.append(S_(e=pr, c1=p))
            if P['q1'] == 2 and self.majorE is not None and self.Out(self.majorE.p, p.p) and (self.major < 0 or self.hist[self.major].brokenAt < 0):
                r = self.Build(self.majorE.bar, p.bar, j)
                if self.SlopeOk(r.a, r.pa, r.b, r.pb):
                    t = ZmMk(d, 2, r.a, r.b, r.pa, r.pb, j, p.bar, 6)
                    x = -1
                    for y in range(t.b - 1, j - 1, -1):
                        if self.Beyond(t, y): x = y; break
                    if x < 0:
                        if self.major >= 0: self.dele[self.major] = True
                        self.major = self.Push(t)
        hit = -1
        if self.live < 0:
            for c in range(len(self.pends)):
                if j < self.pends[c].c1.bar:
                    v = self.OppBetween(self.pends[c].e.bar, self.pends[c].c1.bar)
                    if self.Y(j) > v if d > 0 else self.Y(j) < v: hit = c; break
        if hit >= 0:
            e = self.pends[hit].e; b = self.pends[hit].c1.bar; v = self.OppBetween(e.bar, b)
            self.pends = []
            confirmed = True
            if P['q1'] == 2 and (self.majorE is None or self.Out(e.p, self.majorE.p)): self.majorE = e; self.major = -1
            made = False
            if self.skip0 == 0:
                fromExt = True
                if P['q1'] == 1: fromExt = abs(self.X(b) - v) >= P['p1Retrace'] * abs(e.p - v)
                if fromExt:
                    for s in range(0, P['p1Shift'] + 1):
                        if made: break
                        aa = e.bar - s
                        if aa <= b: break
                        r = self.Build(aa, b, j)
                        if not r.clean: continue
                        if not self.SlopeOk(r.a, r.pa, r.b, r.pb): break
                        made = True
                        if P['q1'] == 2: self.MomFrom(r, j, b)
                        else: self.Born(ZmMk(d, 0, r.a, r.b, r.pa, r.pb, j, b, 1 if s > 0 else 0), j)
                else: self.MomFrom(self.Build(e.bar, b, j), j, b)
            if not made or P['q1'] == 2:
                for sp in self.side:
                    if sp.bar == b: self.waitA = sp; break
                self.waitSkip = max(0, self.skip0 - 1)
                known = [sp for sp in self.side if sp.bar < b and sp.conf >= j]
                for i in range(1, len(known)):
                    v2 = known[i]; x = i - 1
                    while x >= 0 and known[x].bar < v2.bar: known[x + 1] = known[x]; x -= 1
                    known[x + 1] = v2
                for kp in known:
                    if self.waitA is None or self.live >= 0: break
                    self.WaitStep(kp, j)
            else: self.waitA = None
        return confirmed

    def EndStructure(self):
        self.waitA = None; self.chainR = -1; self.majorE = None; self.major = -1
        if self.live >= 0: self.orph.append(self.live); self.live = -1


def ZmLines(S, A, piv):
    if P['lineMode'] == 1:
        U = ZmDirF(S, A, piv, 1); D = ZmDirF(S, A, piv, -1)
    else:
        U = ZmDir(S, A, piv, 1); D = ZmDir(S, A, piv, -1)
    for j in range(S.n - 2, 0, -1):
        u = U.Step(j); dn = D.Step(j)
        if u: D.EndStructure()
        if dn: U.EndStructure()
    if P['lineMode'] == 1: out = list(U.hist) + list(D.hist)
    else: out = [t for i, t in enumerate(U.hist) if not U.dele[i]] + [t for i, t in enumerate(D.hist) if not D.dele[i]]
    for i in range(len(piv)):
        t = ZmMomentum(S, A, piv, i)
        if t is not None: out.append(t)
    for i in range(1, len(out)):                            # a desc, b desc, dir asc (stable)
        v = out[i]; x = i - 1
        while x >= 0 and (out[x].a < v.a or (out[x].a == v.a and (out[x].b < v.b or (out[x].b == v.b and out[x].dir > v.dir)))): out[x + 1] = out[x]; x -= 1
        out[x + 1] = v
    return out


# ---- 4. zones ----
def ZmTests(S, z):
    away, inT, n = True, False, 0
    stop = z.removedBar if z.removed else 0
    for j in range(z.saBar - 1, max(stop, 0), -1):
        a = S.L[j] if z.dir > 0 else S.H[j]
        touch = a <= z.prox if z.dir > 0 else a >= z.prox
        if touch:
            if not inT and away: n += 1; inT = True; away = False
        else: away = True; inT = False
    return n


def ZmRunEnd(S, z):
    for j in range(z.legBar - 1, 0, -1):
        if S.L[j] <= z.prox if z.dir > 0 else S.H[j] >= z.prox: return j
    return 1


def ZmReasons(S, zs, lines, piv):
    for z in zs:
        end = max(1, min(ZmRunEnd(S, z), z.legBar))
        z.reasons = 0; z.nRemoved = 0; z.brokePivot = -1
        sw = -1
        for k, p in enumerate(piv):
            if p.conf >= 0 and p.t == z.dir and p.bar > z.base1 and p.conf >= z.legBar and (sw < 0 or p.bar < piv[sw].bar): sw = k
        if sw < 0:
            for k, p in enumerate(piv):
                if p.t == z.dir and p.bar > z.base1 and (sw < 0 or p.bar < piv[sw].bar): sw = k
        hasSw = sw >= 0; swP = piv[sw].p if hasSw else 0.0; swBar = piv[sw].bar if hasSw else -1
        if P['zoneSwing'] > 0:
            hasSw = False; N = P['zoneSwing']
            for j in range(z.base1 + 1, S.n - 1 - N):
                ok = True
                h = 1
                while h <= N and ok:
                    xj = S.H[j] if z.dir > 0 else S.L[j]; xa = S.H[j - h] if z.dir > 0 else S.L[j - h]; xb = S.H[j + h] if z.dir > 0 else S.L[j + h]
                    if (xa > xj or xb > xj) if z.dir > 0 else (xa < xj or xb < xj): ok = False
                    h += 1
                if ok: hasSw = True; swBar = j; swP = S.H[j] if z.dir > 0 else S.L[j]; break
        if hasSw:
            for j in range(z.legBar, end - 1, -1):
                if S.C[j] > swP if z.dir > 0 else S.C[j] < swP: z.reasons |= 1; z.brokePivot = swBar; break
        for t in lines:
            if t.kind == 0 and t.dir == -z.dir and t.b > z.legBar and end <= t.brokenAt <= z.legBar: z.reasons |= 2; break
        for o in zs:
            if o.dir == -z.dir and o.legBar > z.legBar and o.removed and end <= o.removedBar <= z.legBar: z.nRemoved += 1
        if z.nRemoved > 0: z.reasons |= 4
        z.strong = z.nRemoved > 0
        z.arrival = z.reasons == 7


def ZmZones(S, A, lines, piv):
    zs = []
    if S.n > 12 and S.atr(1) > 0:
        bz = []; zcDetect(S, RxParams(True), bz)
        for b in bz:
            zs.append(S_(dir=b.dir, prox=b.prox, dist=b.dist, base0=b.legBar + 1, base1=b.legBar + b.baseN, legBar=b.legBar,
                         pattern=(0 if b.cont else 1) if b.dir > 0 else (2 if b.cont else 3), range=False, strong=False, arrival=False,
                         touches=ZmTests(S, b), removed=b.removed, removedBar=b.removedBar if b.removed else -1, reasons=0, nRemoved=0, brokePivot=-1, pivot=False))
    if S.tf in (10080, 43200, RX_Q):
        lastL = -1
        for L in range(S.n - 2, 0, -1):
            for d in (1, -1):
                top, bot, cnt = -DBL_MAX, DBL_MAX, 0
                i = L + 1
                while i < S.n - 1 and cnt < P['rangeBaseMax']:
                    t2 = max(top, max(S.O[i], S.C[i])); b2 = min(bot, min(S.O[i], S.C[i]))
                    if t2 - b2 > P['rangeBaseATR'] * A.At(L + 1): break
                    top, bot = t2, b2; cnt += 1; i += 1
                if cnt < 3: continue
                if not (S.C[L] > top and S.C[L + 1] <= top if d > 0 else S.C[L] < bot and S.C[L + 1] >= bot): continue
                if L == lastL: continue
                z = S_(dir=d, prox=top if d > 0 else bot, dist=bot if d > 0 else top, base0=L + 1, base1=L + cnt, legBar=L,
                       pattern=(0 if S.cdir(L + cnt + 1) > 0 else 1) if d > 0 else (2 if S.cdir(L + cnt + 1) < 0 else 3), range=True,
                       strong=False, arrival=False, touches=0, removed=False, removedBar=-1, reasons=0, nRemoved=0, brokePivot=-1, pivot=False)
                away, inT = True, False
                for j in range(L - 1, 0, -1):
                    if S.C[j] < z.dist if d > 0 else S.C[j] > z.dist: z.removed = True; z.removedBar = j; break
                    touch = S.L[j] <= z.prox if d > 0 else S.H[j] >= z.prox
                    if touch:
                        if not inT and away: z.touches += 1; inT = True; away = False
                    else: away = True; inT = False
                zs.append(z); lastL = L
    if P['pivZones'] > 0:
        for pv in piv:
            b = pv.bar; d = -pv.t
            if b < 2 or pv.conf < 0: continue
            if any(q.dir == d and q.base1 >= b and q.base0 <= b for q in zs): continue
            b0 = b; b1 = b
            if P['pivZones'] > 1:
                while b1 + 1 < S.n - 1 and S.basing(b1 + 1) and b1 - b0 < 5: b1 += 1
                while b0 - 1 >= 2 and S.basing(b0 - 1) and b1 - b0 < 5: b0 -= 1
            prox = -DBL_MAX if d > 0 else DBL_MAX
            for i in range(b0, b1 + 1): prox = max(prox, max(S.O[i], S.C[i])) if d > 0 else min(prox, min(S.O[i], S.C[i]))
            dist = S.L[b] if d > 0 else S.H[b]
            if abs(prox - dist) <= 0: continue
            z = S_(dir=d, prox=prox, dist=dist, base0=b0, base1=b1, legBar=b0 - 1, pattern=1 if d > 0 else 3, range=False,
                   strong=False, arrival=False, touches=0, removed=False, removedBar=-1, reasons=0, nRemoved=0, brokePivot=-1, pivot=True)
            away, inT = False, False
            for j in range(b0 - 1, 0, -1):
                if S.C[j] < z.dist if d > 0 else S.C[j] > z.dist: z.removed = True; z.removedBar = j; break
                touch = S.L[j] <= z.prox if d > 0 else S.H[j] >= z.prox
                if touch:
                    if not inT and away: z.touches += 1; inT = True; away = False
                else: away = True; inT = False
            zs.append(z)
    ZmReasons(S, zs, lines, piv)
    for i in range(1, len(zs)):
        v = zs[i]; x = i - 1
        while x >= 0 and zs[x].legBar < v.legBar: zs[x + 1] = zs[x]; x -= 1
        zs[x + 1] = v
    return zs


# ---- 5. trend state ----
def ZmLastBefore(seen, t, bar):
    for i in range(len(seen) - 1, -1, -1):
        if seen[i].t == t and seen[i].bar > bar: return i
    return -1


def ZmTrendState(S, piv):
    conf = [p for p in piv if p.conf >= 0]
    for i in range(1, len(conf)):
        v = conf[i]; x = i - 1
        while x >= 0 and (conf[x].conf < v.conf or (conf[x].conf == v.conf and conf[x].bar < v.bar)): conf[x + 1] = conf[x]; x -= 1
        conf[x + 1] = v
    st = S_(trend=0, ext=0.0, extBar=-1, sl=0.0, slBar=-1, lo=0.0, hi=0.0, frm=0)
    tr = 0; broke = beyondSl = hasExt = hasSl = False
    ext = sl = Piv(-1, 0.0, 0, -1)
    seen = []; ci = 0
    for j in range(S.n - 2, 0, -1):
        while ci < len(conf) and conf[ci].conf >= j:
            p = conf[ci]; ci += 1
            x = len(seen) - 1; seen.append(None)
            while x >= 0 and seen[x].bar < p.bar: seen[x + 1] = seen[x]; x -= 1
            seen[x + 1] = p
            if tr == 0:
                pk = [-1, -1]; vl = [-1, -1]; np_ = nv = 0
                for i in range(len(seen)):
                    if seen[i].t > 0: pk[0] = pk[1]; pk[1] = i; np_ += 1
                    else: vl[0] = vl[1]; vl[1] = i; nv += 1
                if np_ >= 2 and nv >= 2:
                    if seen[pk[1]].p > seen[pk[0]].p and seen[vl[1]].p > seen[vl[0]].p and p.t > 0:
                        tr = 1; ext = p; hasExt = True; k = ZmLastBefore(seen, -1, p.bar); hasSl = k >= 0
                        if hasSl: sl = seen[k]
                        broke = beyondSl = False
                    elif seen[pk[1]].p < seen[pk[0]].p and seen[vl[1]].p < seen[vl[0]].p and p.t < 0:
                        tr = -1; ext = p; hasExt = True; k = ZmLastBefore(seen, 1, p.bar); hasSl = k >= 0
                        if hasSl: sl = seen[k]
                        broke = beyondSl = False
                continue
            d = tr
            if p.t == d and (p.p > ext.p if d > 0 else p.p < ext.p):
                ext = p; k = ZmLastBefore(seen, -d, p.bar); hasSl = k >= 0
                if hasSl: sl = seen[k]
                broke = beyondSl = False
                continue
            if broke and p.t == -d and hasSl and (p.p < sl.p if d > 0 else p.p > sl.p): beyondSl = True
            if broke and beyondSl and p.t == d and (p.p < ext.p if d > 0 else p.p > ext.p):
                lll = -1
                for i in range(len(seen)):
                    if seen[i].t == -d and p.bar < seen[i].bar < ext.bar and (lll < 0 or (seen[i].p < seen[lll].p if d > 0 else seen[i].p > seen[lll].p)): lll = i
                if lll < 0: continue
                tr = -d; ext = seen[lll]
                k = ZmLastBefore(seen, d, ext.bar)
                sl = seen[k] if k >= 0 else p
                hasSl = True; broke = beyondSl = False
        if tr != 0 and not broke and hasSl and (S.C[j] < sl.p if tr > 0 else S.C[j] > sl.p): broke = True
    st.frm = tr
    if tr == 0 or not hasExt or not hasSl: return st
    st.ext = ext.p; st.extBar = ext.bar; st.sl = sl.p; st.slBar = sl.bar
    lo, hi = min(ext.p, sl.p), max(ext.p, sl.p)
    if broke: st.trend = 0; st.lo = lo; st.hi = hi; return st
    extZone = min(S.O[ext.bar], S.C[ext.bar]) if tr > 0 else max(S.O[ext.bar], S.C[ext.bar])
    slZone = max(S.O[sl.bar], S.C[sl.bar]) if tr > 0 else min(S.O[sl.bar], S.C[sl.bar])
    lh = reExt = reSl = False
    for c in conf:
        if c.bar >= ext.bar: continue
        if c.t == tr:
            lh = True
            if c.p >= extZone if tr > 0 else c.p <= extZone: reExt = True
        if c.t == -tr and (c.p <= slZone if tr > 0 else c.p >= slZone): reSl = True
    st.trend = 0 if (lh and reExt and reSl) else tr
    if st.trend == 0: st.lo = lo; st.hi = hi
    return st


# ---- one TF + top-down ----
CHAIN = ['3M', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15']


def ZmTf(rows, tf, price):
    S = ser_of(rows, tf, price, {})
    A = ZmAtrC(); A.Init(S)
    piv = ZmPivots(S, A)
    lines = ZmLines(S, A, piv)
    zones = ZmZones(S, A, lines, piv)
    st = ZmTrendState(S, piv)
    return S_(name=tf, S=S, A=A, piv=piv, lines=lines, zones=zones, st=st, leg=piv[-1].t if piv else 0, price=S.price)


def Lo(z): return min(z.prox, z.dist)
def Hi(z): return max(z.prox, z.dist)
def Gap(v, z): return Lo(z) - v if v < Lo(z) else (v - Hi(z) if v > Hi(z) else 0.0)
def ZoneOk(z, dirP): return z.dir == dirP and not z.removed and z.touches <= 1
def LiveLine(t, d):
    best = -1; anyl = -1
    for i, l in enumerate(t.lines):
        if l.kind != 0 or l.dir != d or l.brokenAt >= 0: continue
        if anyl < 0 or l.born < t.lines[anyl].born: anyl = i
        if not ZmInner(l.why) and (best < 0 or l.born < t.lines[best].born): best = i
    return best if best >= 0 else anyl


def TargetLine(t, d, slT, hasSl):
    best = -1
    if hasSl:
        for i, l in enumerate(t.lines):
            if l.kind != 0 or l.dir != d or l.brokenAt >= 0 or t.S.T[l.a] < slT: continue
            if best < 0 or l.born > t.lines[best].born: best = i
    return best if best >= 0 else LiveLine(t, d)


def FindTarget(T, ci):
    c, p = T[ci], T[ci - 1]
    dirP = p.st.trend
    if dirP == 0: return None
    atrC = c.A.At(1)
    hasSl = p.st.slBar >= 0; slT = p.S.T[p.st.slBar] if hasSl else 0
    for lt in (c, p):
        li = TargetLine(lt, dirP, slT, hasSl)
        if li < 0: continue
        v = ZmAt(lt.lines[li], 0)
        for zt in (c, p):
            best = -1
            for k, z in enumerate(zt.zones):
                if not ZoneOk(z, dirP) or Gap(v, z) != 0: continue
                if best < 0 or Hi(z) - Lo(z) < Hi(zt.zones[best]) - Lo(zt.zones[best]): best = k
            if best >= 0: return S_(tf=zt, zone=zt.zones[best], lineTf=lt, line=lt.lines[li], value=v)
        for zt in (c, p):
            best = -1
            for k, z in enumerate(zt.zones):
                if not ZoneOk(z, dirP) or Gap(v, z) > P['targetGap'] * atrC: continue
                if best < 0 or Gap(v, z) < Gap(v, zt.zones[best]): best = k
            if best >= 0: return S_(tf=zt, zone=zt.zones[best], lineTf=lt, line=lt.lines[li], value=v)
    px = c.price; best = -1
    for k, z in enumerate(c.zones):
        if not ZoneOk(z, dirP) or not (Hi(z) <= px if dirP > 0 else Lo(z) >= px): continue
        if best < 0 or Gap(px, z) < Gap(px, c.zones[best]): best = k
    return S_(tf=c, zone=c.zones[best], lineTf=None, line=None, value=0.0) if best >= 0 else None


def ZmModel(sym, chart, bars, price, dg):
    """bars: {tf: rows (closed, oldest first)} incl. '3M'; the chain 3M .. H1 (+ M15 when given)."""
    chartPos = CHAIN.index(chart)
    last = 6 if 'M15' in bars and len(bars['M15']) >= 20 else 5
    T = []
    for c in range(0, last + 1):
        tf = CHAIN[c]
        if tf in bars and len(bars[tf]) >= 20: T.append(ZmTf(bars[tf], tf, price))
    n = len(T)
    phase = []
    B = Sd = C = -1
    for i, t in enumerate(T):
        pt = t.st.trend if i == 0 else T[i - 1].st.trend
        phase.append(0 if pt == 0 else (1 if t.leg == pt else 2))
        if B < 0 and t.st.trend != 0: B = i
    if B >= 0:
        for i in range(B + 1, max(B + 1, n - 1)):
            if T[i].st.trend == 0: Sd = i; break
    for i in range(1, n):
        a, b = T[i].st.trend, T[i - 1].st.trend
        if a != 0 and b != 0 and a != b: C = i; break
    if C < 0:
        for i in range(1, n):
            if phase[i] == 2: C = i; break
    tg = FindTarget(T, C) if C >= 1 else None
    bias = 0 if Sd >= 0 else (T[B].st.trend if B >= 0 else 0)
    xau = 'XAU' in sym
    inTarget = tg is not None and Gap(price, tg.zone) == 0
    allowed = []
    for i in range(n):
        side = 0; cd = T[C].st.trend if C >= 0 else 0
        if xau and T[i].name == 'M15': side = 0
        elif Sd >= 0 and i > Sd: side = 0
        elif C >= 0 and i >= C: side = 0 if inTarget else (cd if phase[i] == 1 else 0)
        elif C < 0 and bias != 0 and phase[i] == 1: side = bias
        allowed.append(side)
    f = lambda v: dts(v, dg)
    tw = lambda t: 'UP' if t > 0 else ('DOWN' if t < 0 else 'SIDEWAYS')
    segs = []
    for i, t in enumerate(T):
        if CHAIN.index(t.name) > chartPos: continue
        if t.st.trend == 0: seg = f'{t.name} SIDEWAYS {f(t.st.lo)}-{f(t.st.hi)}'
        else:
            w = f'in {T[0 if i == 0 else i - 1].name} range' if phase[i] == 0 else ('impulse' if phase[i] == 1 else 'correction')
            seg = f'{t.name} {tw(t.st.trend)} {w}'
            if i == C and tg is not None: seg += f' -> {f(Lo(tg.zone))}-{f(Hi(tg.zone))}'
        segs.append(seg)
    have = {t.name for t in T}
    for c in range(0, chartPos + 1):
        if CHAIN[c] not in have: segs.append(f'{CHAIN[c]} loading')
    structure = '  |  '.join(segs)
    names = lambda idx: '/'.join(T[i].name for i in idx)
    up = []
    if B >= 0 and bias != 0:
        i = B
        while i < n and T[i].st.trend == bias: up.append(i); i += 1
    word = 'LONG' if bias > 0 else ('SHORT' if bias < 0 else 'NONE')
    if Sd >= 0: biasTxt = f'NONE ({T[Sd].name} sideways {f(T[Sd].st.lo)}-{f(T[Sd].st.hi)})'
    elif B >= 0: biasTxt = f"{word} ({names(up if up else [B])} {'up' if bias > 0 else 'down'})"
    else: biasTxt = 'NONE (no trend)'
    now, tgt, then, flip = '', '-', '-', '-'
    buyW = 'BUY' if bias > 0 else 'SELL'
    if Sd >= 0:
        s = T[Sd]
        ltf = [i for i in range(Sd + 1, n) if not (xau and T[i].name == 'M15')]
        now = f'WAIT - zone to zone on {names(ltf) if ltf else s.name} only'
        below = above = -1
        for k, z in enumerate(s.zones):
            if z.dir > 0 and not z.removed and Hi(z) < s.st.lo and (below < 0 or Hi(z) > Hi(s.zones[below])): below = k
            if z.dir < 0 and not z.removed and Lo(z) > s.st.hi and (above < 0 or Lo(z) < Lo(s.zones[above])): above = k
        then = (f'{s.name} close < {f(s.st.lo)} -> SELL' + (f' to {f(Hi(s.zones[below]))} (WOW)' if below >= 0 else '')
                + f'; {s.name} close > {f(s.st.hi)} -> BUY' + (f' to {f(Lo(s.zones[above]))} (WOW)' if above >= 0 else ''))
        flip = f'a {s.name} close outside {f(s.st.lo)}-{f(s.st.hi)}'
    elif C >= 0 and tg is not None:
        z = tg.zone; cd = T[C].st.trend
        edge = Hi(z) if cd < 0 else Lo(z)
        corr = [i for i in range(C, n) if allowed[i] == cd]
        conf = list(range(C + 2, min(n, C + 4)))
        if not conf: conf = list(range(C + 1, n))
        zt = f'{f(Lo(z))}-{f(Hi(z))}'
        cdW = 'BUY' if cd > 0 else 'SELL'
        if inTarget: now = f"WAIT at {zt}: {buyW} on {names(conf)} confirmation (no {'buy' if bias > 0 else 'sell'} limits)"
        else: now = f"{cdW} correction trades only on {names(corr) if corr else '-'} ({'sell limits at supply, no buy limits' if cd < 0 else 'buy limits at demand, no sell limits'}), TP before {f(edge)}"
        pat = ['RBR', 'DBR', 'DBD', 'RBD'][z.pattern]
        tgt = (f"{zt} ({tg.tf.name} {pat}{' base' if z.range else ''}"
               + (f" at the {tg.lineTf.name} {'up' if tg.line.dir > 0 else 'down'} line {f(tg.value)}" if tg.line is not None else f' at the {T[C].name} structure') + ')')
        then = f'{buyW} at {zt} on {names(conf) if conf else T[C].name} confirmation'
    elif B >= 0:
        imp = [i for i in range(n) if allowed[i] == bias]
        now = f'{buyW} impulse on {names(imp)}' if imp else f"WAIT - no TF in a {'buy' if bias > 0 else 'sell'} impulse"
        then = f"{buyW} on {T[B].name} pullbacks to fresh {'demand' if bias > 0 else 'supply'}"
    else: now = 'WAIT - no trend'
    if Sd < 0 and B >= 0:
        fi = up[-1] if up else B
        flip = f"{T[fi].name} close {'<' if bias > 0 else '>'} {f(T[fi].st.sl)}"
    direction = f'DIRECTION: {biasTxt} | NOW: {now} | TARGET: {tgt} | THEN: {then} | FLIP: {flip}'
    return S_(T=T, structure=structure, direction=direction, allowed=allowed, B=B, Sd=Sd, C=C, tg=tg)
