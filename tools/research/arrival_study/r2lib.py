"""Round 2 of the arrival study: the pure parts (no network), shared by round2.py and kevin_calls.py and unit-tested in
tests/test_round2.py.

  simulate()   one limit order on FINE bars (M5 / M15 / H1 / H4 ...) with a choice of trade management:
                 'fixed'    stop / one target (tp)
                 'partial'  half off at +1R, the stop of the rest moves to break-even, the rest runs to tp
                 'trail'    the stop moves to break-even at +1R, then trails 1R behind the best price (no target; tp, if
                            given, is a hard cap)
               Conventions = round 1 (study.py): the limit fills on the first touch (at the limit price, also on a gap)
               before `expire`; before the fill it is cancelled when a close goes beyond the distal (zone removed) or
               the cancel level (the target) trades first. Inside one fine bar the stop comes first (conservative; on
               fine bars this is rare); the fill bar can stop out but never reach a target; a gap through the stop exits
               at the open; a stop moved during a bar applies from the next bar. Cost (spread, price units) is charged
               once, in R. A trade still open at `hold_end` exits at that bar's close ('time', a real exit, counted);
               one still open when the data ends is 'open' (marked to the last close, not counted).
  stats()      n / filled / closed / win rate / avg R / bootstrap CI (trade and WEEK-block) / PF / max drawdown.
  features()   the measurable setup features of a zone trade at the moment it is placed (HTF trend, location, nesting,
               leg-out, base, freshness, approach, R:R room, session ...), the same for Kevin's calls and our arrivals.
  logit_cv() / stump_tree()   tiny interpretable models (pure Python), fit on the older trades, scored on the newer.
"""
from __future__ import annotations

import bisect
import datetime as dt
import math
import random
import statistics
import os
import sys
from typing import Dict, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
for _p in (os.path.join(ROOT, 'tools', 'stock_scanner'), os.path.join(ROOT, 'tools', 'fx_scanner'), HERE):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import arrival as A  # noqa: E402
import zones as Z  # noqa: E402
import zvtrend as ZVT  # noqa: E402

MINUTES = {'M5': 5, 'M15': 15, 'H1': 60, 'H4': 240}


# ---- time-indexed bars -------------------------------------------------------------------------------------------------
def _p(lbl: str) -> dt.datetime:
    return dt.datetime.strptime(lbl[:16], '%Y-%m-%dT%H:%M')


def bar_end(lbl: str, tf: str) -> str:
    """Close time of a bar labelled `lbl` (forex / server time, 'YYYY-MM-DDTHH:MM')."""
    t = _p(lbl if len(lbl) > 10 else lbl + 'T00:00')
    if tf in MINUTES:
        t += dt.timedelta(minutes=MINUTES[tf])
    elif tf == 'D1':
        t += dt.timedelta(days=1)
    elif tf == 'W1':
        t += dt.timedelta(days=7)
    elif tf in ('MN', '3M'):
        k = 1 if tf == 'MN' else 3
        m = t.month - 1 + k
        t = t.replace(year=t.year + m // 12, month=m % 12 + 1, day=1)
    return t.strftime('%Y-%m-%dT%H:%M')


class TF:
    """Bars of one TF, oldest first, with each bar's close time (comparable strings)."""

    def __init__(self, tf: str, bars: List[Z.Bar], ends: Optional[List[str]] = None):
        self.tf, self.bars = tf, bars
        self.ends = ends if ends is not None else [bar_end(b.d, tf) for b in bars]

    def __len__(self): return len(self.bars)

    def closed(self, t: str) -> int:
        """Number of bars closed by time t."""
        return bisect.bisect_right(self.ends, t)

    def series(self, k: int, win: int = 420, price: Optional[float] = None) -> Z.Series:
        """The `win` newest bars closed when bar k-1 closed (k bars closed)."""
        return A.series_of(self.bars[max(0, k - win):k], self.tf, price)


def add_time(t: str, **kw) -> str:
    return (_p(t) + dt.timedelta(**kw)).strftime('%Y-%m-%dT%H:%M')


# ---- simulation ------------------------------------------------------------------------------------------------------
def simulate(d: int, entry: float, stop: float, fine: TF, t0: str, expire: str, hold_end: Optional[str], distal: float,
             cost: float = 0.0, mgmt: str = 'fixed', tp: Optional[float] = None, cancel_at: Optional[float] = None,
             trail_r: float = 1.0) -> Dict:
    """One limit order placed at time t0 on the fine bars (module doc). cancel_at: the level whose trade before the fill
    cancels the order (default tp)."""
    risk = (entry - stop) * d
    out = {'outcome': 'cancelled', 'why': 'expired', 'R': None, 'fill_t': None, 'exit_t': None, 'mfe': None, 'mae': None}
    if risk <= 0 or (tp is not None and (tp - entry) * d <= 0):
        out['why'] = 'bad levels'
        return out
    if mgmt in ('fixed', 'partial') and tp is None:
        out['why'] = 'no target'
        return out
    cancel_at = tp if cancel_at is None else cancel_at
    i = fine.closed(t0)
    if cancel_at is not None and i > 0 and (cancel_at - fine.bars[i - 1].c) * d <= 0:
        cancel_at = None              # price is already beyond the cancel level when the order is placed (far limit)
    fill_i = None
    while i < len(fine):
        if fine.ends[i] > expire:
            return out
        b = fine.bars[i]
        if (b.l <= entry) if d > 0 else (b.h >= entry):
            fill_i = i
            break
        if cancel_at is not None and ((b.h >= cancel_at) if d > 0 else (b.l <= cancel_at)):
            out['why'] = 'missed (target first)'
            return out
        if (b.c < distal) if d > 0 else (b.c > distal):
            out['why'] = 'zone removed'
            return out
        i += 1
    if fill_i is None:
        out['why'] = 'no data'
        return out
    out['fill_t'] = fine.ends[fill_i]
    c = cost / risk
    one_r = entry + d * risk
    sl = stop
    banked, size = 0.0, 1.0           # partial: R already banked, open fraction
    best = 0.0                        # best favourable excursion so far (R), for the trail
    mfe = mae = 0.0
    be_moved = False
    for j in range(fill_i, len(fine)):
        b = fine.bars[j]
        if hold_end is not None and j > fill_i and fine.ends[j - 1] >= hold_end:
            pb = fine.bars[j - 1]
            return _done(out, 'time', banked + size * (pb.c - entry) * d / risk - c, fine.ends[j - 1], mfe, mae)
        fav = 0.0 if j == fill_i else ((b.h - entry) if d > 0 else (entry - b.l)) / risk
        adv = ((entry - b.l) if d > 0 else (b.h - entry)) / risk
        mae = max(mae, adv)
        # 1) the stop (first: conservative)
        if (b.l <= sl) if d > 0 else (b.h >= sl):
            px = sl if j == fill_i else (min(b.o, sl) if d > 0 else max(b.o, sl))
            r = banked + size * (px - entry) * d / risk - c
            why = 'stop' if not be_moved else ('break-even' if sl == entry else 'trail')
            return _done(out, why, r, fine.ends[j], mfe, mae)
        mfe = max(mfe, fav)
        if j == fill_i:
            continue
        # 2) targets
        if tp is not None and ((b.h >= tp) if d > 0 else (b.l <= tp)):
            if mgmt == 'partial' and not be_moved and size == 1.0 and (tp - one_r) * d > 0:
                banked += 0.5 * (one_r - entry) * d / risk   # the 1R half fills on the way to the target
                size = 0.5
            r = banked + size * (tp - entry) * d / risk - c
            return _done(out, 'target', r, fine.ends[j], mfe, mae)
        # 3) management for the next bar
        if mgmt == 'partial' and size == 1.0 and fav >= 1.0:
            banked, size, sl, be_moved = 0.5 * 1.0, 0.5, entry, True
        elif mgmt == 'trail':
            best = max(best, fav)
            if best >= 1.0:
                be_moved = True
                sl_new = entry + d * max(0.0, best - trail_r) * risk
                sl = max(sl, sl_new) if d > 0 else min(sl, sl_new)
    b = fine.bars[-1]
    out.update(outcome='open', why='end of data', R=banked + size * (b.c - entry) * d / risk - c, exit_t=fine.ends[-1],
               mfe=round(mfe, 3), mae=round(min(mae, 99.0), 3))
    return out


def _done(out: Dict, why: str, r: float, t: str, mfe: float, mae: float) -> Dict:
    oc = 'win' if r > 0.05 else ('loss' if r < -0.05 else 'flat')
    out.update(outcome=oc, why=why, R=r, exit_t=t, mfe=round(mfe, 3), mae=round(min(mae, 99.0), 3))
    return out


CLOSED = ('win', 'loss', 'flat')


# ---- statistics ------------------------------------------------------------------------------------------------------
def _boot(rs: List[float], n: int = 1000, seed: int = 7) -> Optional[Tuple[float, float]]:
    if len(rs) < 20:
        return None
    rnd = random.Random(seed)
    ms = sorted(sum(rnd.choice(rs) for _ in rs) / len(rs) for _ in range(n))
    return ms[int(0.025 * n)], ms[int(0.975 * n) - 1]


def week_of(t: str) -> str:
    y, w, _ = _p(t if len(t) > 10 else t + 'T00:00').isocalendar()
    return f'{y}-{w:02d}'


def _block_boot(ts: List[Dict], key: str, n: int = 1000, seed: int = 11) -> Optional[Tuple[float, float]]:
    """Bootstrap by calendar week of the fill (correlated USD pairs filled the same week resample together)."""
    if len(ts) < 20:
        return None
    blocks: Dict[str, List[float]] = {}
    for t in ts:
        blocks.setdefault(week_of(t.get('fill_t') or t['t']), []).append(t[key])
    bl = list(blocks.values())
    if len(bl) < 8:
        return None
    rnd = random.Random(seed)
    ms = []
    for _ in range(n):
        s = c = 0
        for _ in bl:
            x = rnd.choice(bl)
            s += sum(x)
            c += len(x)
        ms.append(s / c)
    ms.sort()
    return ms[int(0.025 * n)], ms[int(0.975 * n) - 1]


def max_dd(ts: List[Dict], key: str = 'R') -> float:
    s = peak = dd = 0.0
    for t in sorted(ts, key=lambda x: x.get('exit_t') or ''):
        s += t[key]
        peak = max(peak, s)
        dd = max(dd, peak - s)
    return dd


def stats(ts: List[Dict], key: str = 'R', okey: str = 'outcome') -> Dict:
    filled = [t for t in ts if t.get(okey) in CLOSED + ('open',) and t.get(key) is not None]
    closed = [t for t in filled if t[okey] in CLOSED]
    rs = [t[key] for t in closed]
    wins = [r for r in rs if r > 0.05]
    gw, gl = sum(r for r in rs if r > 0), -sum(r for r in rs if r < 0)
    return {'n': len(ts), 'filled': len(filled), 'closed': len(closed), 'fill_rate': len(filled) / len(ts) if ts else None,
            'win_rate': len(wins) / len(closed) if closed else None, 'avg_R': sum(rs) / len(rs) if rs else None,
            'sum_R': sum(rs), 'pf': gw / gl if gl > 0 else (None if not gw else math.inf), 'ci': _boot(rs),
            'ci_week': _block_boot([dict(t, **{key: t[key]}) for t in closed], key), 'dd': max_dd(closed, key) if closed else 0.0,
            'avg_win': sum(wins) / len(wins) if wins else None}


def fmt(v, f='{:.2f}') -> str:
    if v is None:
        return '–'
    if isinstance(v, float) and math.isinf(v):
        return '∞'
    return f.format(v)


def row(name: str, s: Dict) -> str:
    ci = f"{s['ci'][0]:+.2f} … {s['ci'][1]:+.2f}" if s['ci'] else 'n<20'
    cw = f"{s['ci_week'][0]:+.2f} … {s['ci_week'][1]:+.2f}" if s['ci_week'] else '–'
    return (f"| {name} | {s['n']} | {s['filled']} ({fmt(s['fill_rate'] and 100 * s['fill_rate'], '{:.0f}')}%) | {s['closed']} | "
            f"{fmt(s['win_rate'] and 100 * s['win_rate'], '{:.0f}')} | {fmt(s['avg_R'], '{:+.2f}')} | {ci} | {cw} | {fmt(s['pf'])} | "
            f"{fmt(s['sum_R'], '{:+.1f}')} | {fmt(s['dd'], '{:.1f}')} |")


HEAD = ['| variant | setups | filled | closed | win % | avg R | 95% CI | 95% CI (week blocks) | PF | sum R | max DD (R) |',
        '|---|---|---|---|---|---|---|---|---|---|---|']


def table(title: str, groups: Sequence[Tuple[str, List[Dict]]], key: str = 'R', okey: str = 'outcome') -> List[str]:
    out = ([f'**{title}**', ''] if title else []) + HEAD
    for name, ts in groups:
        out.append(row(name, stats(ts, key, okey)))
    return out + ['']


# ---- features --------------------------------------------------------------------------------------------------------
def tl_state(S: Z.Series, d: int) -> int:
    """+1 = only the trend line of side d is live (up line for a buy), -1 = only the opposite one, 0 = both / none."""
    if S is None or S.n < 30:
        return 0
    r = ZVT.zv_lines(S)
    same = r.up if d > 0 else r.dn
    opp = r.dn if d > 0 else r.up
    return (1 if same is not None else 0) - (1 if opp is not None else 0)


def location(S: Z.Series, price: float, d: int, n: int = 100) -> Optional[float]:
    """Position of price in the last n bars' range, oriented so that 0 = the cheap end for the trade (discount for a
    buy, premium for a sell) and 100 = the expensive end."""
    if S is None or S.n < 10:
        return None
    m = min(n, S.n - 1)
    hi = max(S.H[1:m + 1])
    lo = min(S.L[1:m + 1])
    if hi <= lo:
        return 50.0
    c = 100.0 * (price - lo) / (hi - lo)
    return c if d > 0 else 100.0 - c


def session_of(t: Optional[str]) -> Optional[str]:
    """Forex (server, NY + 7 h) time -> session: Asia 00-09, London 10-14, NY overlap 15-18, late NY 19-23."""
    if not t:
        return None
    h = _p(t).hour
    return 'asia' if h < 10 else 'london' if h < 15 else 'ny' if h < 19 else 'late'


def nfp_day(t: str) -> bool:
    x = _p(t if len(t) > 10 else t + 'T00:00').date()
    return x.weekday() == 4 and x.day <= 7


def match_zone(zs: List[Z.Zone], d: int, lo: float, hi: float, atr: float) -> Optional[Z.Zone]:
    """The detected zone of side d that best overlaps [lo, hi] (proximal within 0.5 ATR), else None."""
    best, bd = None, None
    for z in zs:
        if z.dir != d or z.removed:
            continue
        if z.lo > hi + 0.25 * atr or z.hi < lo - 0.25 * atr:
            continue
        pz = hi if d > 0 else lo
        g = abs(z.prox - pz)
        if g > 0.5 * atr:
            continue
        if bd is None or g < bd:
            best, bd = z, g
    return best


def features(S: Z.Series, H: Optional[Z.Series], d: int, entry: float, stop: float, distal: float, price: float,
             zone: Optional[Z.Zone], t: str, zones: Optional[List[Z.Zone]] = None,
             htf_zones: Optional[List[Z.Zone]] = None) -> Dict:
    """Setup features at placement. S = entry-TF closed bars (shift 1 = newest closed), H = the next higher TF, zone = the
    entry zone as detected on S (None when the setup's zone was not found by the detector)."""
    atr = S.atr(1) or 1e-12
    risk = abs(entry - stop) or 1e-12
    f: Dict = {}
    f['htf_struct'] = Z.htf_trend(H) * d if H is not None and H.n > 30 else 0          # HH+HL with the trade = +1
    f['tf_struct'] = Z.htf_trend(S) * d if S.n > 30 else 0
    f['htf_tl'] = tl_state(H, d) if H is not None else 0
    f['tf_tl'] = tl_state(S, d)
    f['loc_htf'] = location(H, entry, d) if H is not None else None
    f['loc_tf'] = location(S, entry, d)
    lo_, hi_ = min(entry, distal), max(entry, distal)
    hz = htf_zones if htf_zones is not None else (Z.detect(H, A.FX_P) if H is not None and H.n > 12 else [])
    same = [z for z in hz if z.dir == d and not z.removed]
    f['nested'] = any(z.lo <= hi_ and z.hi >= lo_ for z in same)
    hatr = (H.atr(1) if H is not None else 0) or atr
    f['htf_zone_dist'] = (min(0.0 if z.lo <= entry <= z.hi else min(abs(entry - z.lo), abs(entry - z.hi)) for z in same) / hatr
                          if same else None)
    zs = zones if zones is not None else Z.detect(S, A.FX_P)
    opp = [z for z in zs if z.dir == -d and not z.removed and (z.lo > entry if d > 0 else z.hi < entry)]
    f['opp_rr'] = (min(abs(z.prox - entry) for z in opp) / risk) if opp else None
    oph = [z for z in hz if z.dir == -d and not z.removed and (z.lo > entry if d > 0 else z.hi < entry)]
    f['opp_rr_htf'] = (min(abs(z.prox - entry) for z in oph) / risk) if oph else None
    f['risk_atr'] = risk / atr
    f['zone_h_atr'] = abs(entry - distal) / atr
    f['matched'] = zone is not None
    if zone is not None:
        L = zone.leg_bar
        f['leg_ratio'] = zone.leg_ratio
        f['leg_body_atr'] = S.body(L) / (S.atr(L + 1) or atr) if L < S.n else None
        n_leg = 1
        j = L - 1
        while j >= 1 and n_leg < 4 and S.cdir(j) == d and not S.basing(j):
            n_leg += 1
            j -= 1
        f['leg_candles'] = n_leg
        f['base_n'] = zone.base_n
        f['gap'] = bool(zone.gap)
        f['fresh'] = not zone.tested
        f['age'] = L
        f['pattern'] = 'cont' if zone.cont else 'rev'
        # prior run: how far price travelled into the base (ATR multiples over the 30 bars before it)
        b0 = L + zone.base_n
        pre = range(b0 + 1, min(b0 + 31, S.n))
        if len(pre) >= 5:
            ext = max(S.H[j] for j in pre) if d > 0 else min(S.L[j] for j in pre)
            base_ext = min(S.L[j] for j in range(L, min(b0 + 1, S.n))) if d > 0 else max(S.H[j] for j in range(L, min(b0 + 1, S.n)))
            f['prior_run'] = abs(ext - base_ext) / atr
    # approach: how far price has come back towards the zone (from the extreme of the last 20 bars), ATR multiples
    m = min(20, S.n - 1)
    ext = max(S.H[1:m + 1]) if d > 0 else min(S.L[1:m + 1])
    f['approach'] = (ext - entry) * d / atr
    f['dist_now'] = (price - entry) * d / atr
    f['weekday'] = _p(t if len(t) > 10 else t + 'T00:00').weekday()
    f['nfp_week'] = any(nfp_day(add_time(t if len(t) > 10 else t + 'T00:00', days=k)) for k in range(0, 5))
    return f


# ---- tiny models -----------------------------------------------------------------------------------------------------
def _vec(f: Dict, keys: List[str], med: Dict[str, float]) -> List[float]:
    out = []
    for k in keys:
        v = f.get(k)
        if v is None:
            v = med.get(k, 0.0)
        out.append(float(v))
    return out


def logit_fit(X: List[List[float]], y: List[int], l2: float = 1.0, iters: int = 400, lr: float = 0.1):
    """L2 logistic regression, standardised features, batch gradient descent. Returns (w, b, mu, sd)."""
    k = len(X[0]) if X else 0
    mu = [statistics.mean(r[i] for r in X) for i in range(k)]
    sd = [statistics.pstdev([r[i] for r in X]) or 1.0 for i in range(k)]
    Xs = [[(r[i] - mu[i]) / sd[i] for i in range(k)] for r in X]
    w, b = [0.0] * k, 0.0
    n = len(Xs)
    for _ in range(iters):
        gw, gb = [0.0] * k, 0.0
        for r, t in zip(Xs, y):
            z = b + sum(wi * xi for wi, xi in zip(w, r))
            p = 1 / (1 + math.exp(-max(-30, min(30, z))))
            e = p - t
            gb += e
            for i in range(k):
                gw[i] += e * r[i]
        b -= lr * gb / n
        w = [wi - lr * (g / n + l2 * wi / n) for wi, g in zip(w, gw)]
    return w, b, mu, sd


def logit_prob(model, x: List[float]) -> float:
    w, b, mu, sd = model
    z = b + sum(wi * (xi - m) / s for wi, xi, m, s in zip(w, x, mu, sd))
    return 1 / (1 + math.exp(-max(-30, min(30, z))))


def auc(p: List[float], y: List[int]) -> Optional[float]:
    pos = [a for a, t in zip(p, y) if t]
    neg = [a for a, t in zip(p, y) if not t]
    if not pos or not neg:
        return None
    s = 0.0
    for a in pos:
        for b_ in neg:
            s += 1.0 if a > b_ else 0.5 if a == b_ else 0.0
    return s / (len(pos) * len(neg))


def stump_tree(rows: List[Dict], keys: List[str], ykey: str, depth: int = 2, min_leaf: int = 15) -> Dict:
    """A shallow regression tree on the trade R (split = the one cut that most separates avg R, min_leaf trades a side).
    Thresholds = quantiles of the training rows."""
    def node(rs: List[Dict], dep: int) -> Dict:
        ys = [r[ykey] for r in rs]
        nd = {'n': len(rs), 'avg': sum(ys) / len(ys) if ys else 0.0}
        if dep == 0 or len(rs) < 2 * min_leaf:
            return nd
        best = None
        tot = sum(ys)
        for k in keys:
            vals = sorted({float(r[k]) for r in rs if r.get(k) is not None})
            if len(vals) < 2:
                continue
            qs = sorted({vals[int(q * (len(vals) - 1))] for q in (0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8)})
            for th in qs:
                L = [r for r in rs if r.get(k) is not None and float(r[k]) <= th]
                R = [r for r in rs if r.get(k) is not None and float(r[k]) > th]
                if len(L) < min_leaf or len(R) < min_leaf:
                    continue
                sl, sr = sum(r[ykey] for r in L), sum(r[ykey] for r in R)
                gain = sl * sl / len(L) + sr * sr / len(R) - tot * tot / len(rs)
                if best is None or gain > best[0]:
                    best = (gain, k, th, L, R)
        if best is None:
            return nd
        nd.update(key=best[1], th=best[2], le=node(best[3], dep - 1), gt=node(best[4], dep - 1))
        return nd
    return node(rows, depth)


def tree_text(nd: Dict, ind: str = '') -> List[str]:
    if 'key' not in nd:
        return [f"{ind}-> {nd['n']} trades, avg {nd['avg']:+.2f}R"]
    out = [f"{ind}{nd['key']} <= {nd['th']:.2f} ({nd['n']} trades, avg {nd['avg']:+.2f}R)"]
    out += tree_text(nd['le'], ind + '    ')
    out += [f"{ind}{nd['key']} > {nd['th']:.2f}"]
    out += tree_text(nd['gt'], ind + '    ')
    return out


def tree_apply(nd: Dict, r: Dict) -> float:
    while 'key' in nd:
        v = r.get(nd['key'])
        nd = nd['le'] if (v is not None and float(v) <= nd['th']) else nd['gt']
    return nd['avg']


# ---- univariate tables -----------------------------------------------------------------------------------------------
def buckets(v, cuts: Sequence[float]) -> Optional[str]:
    if v is None:
        return None
    if isinstance(v, bool):
        return 'yes' if v else 'no'
    prev = None
    for c in cuts:
        if v <= c:
            return f'<= {c:g}' if prev is None else f'{prev:g} – {c:g}'
        prev = c
    return f'> {cuts[-1]:g}'


FEATURE_CUTS = {
    'htf_struct': None, 'tf_struct': None, 'htf_tl': None, 'tf_tl': None,
    'loc_htf': (25, 50, 75), 'loc_tf': (25, 50, 75), 'nested': None, 'htf_zone_dist': (0, 1, 3),
    'opp_rr': (1, 2, 4), 'opp_rr_htf': (2, 4, 8), 'risk_atr': (0.5, 1, 2), 'zone_h_atr': (0.3, 0.6, 1.0),
    'leg_ratio': (1.5, 2.5, 4), 'leg_body_atr': (0.8, 1.2, 2), 'leg_candles': (1, 2), 'base_n': (1, 2, 3), 'gap': None,
    'fresh': None, 'age': (10, 30, 80), 'prior_run': (2, 4, 8), 'approach': (1, 2, 4), 'dist_now': (0.5, 1, 3),
    'weekday': None, 'nfp_week': None, 'session': None, 'matched': None, 'pattern': None,
}


def bucket_of(k: str, v):
    cuts = FEATURE_CUTS.get(k)
    if cuts is None:
        if v is None:
            return None
        return ('yes' if v else 'no') if isinstance(v, bool) else str(v)
    return buckets(v, cuts)
