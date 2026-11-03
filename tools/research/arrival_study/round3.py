"""Arrival study, round 3: hypotheses round 2 did not test, each with outside (non-mentor) evidence behind it
(docs/research/arrival_study/round3/Round3.md).

    python tools/research/arrival_study/round3.py               # GitHub Actions (arrival-study.yml, round = 3): OANDA
    python tools/research/arrival_study/round3.py --selftest    # synthetic bars, no network (code-path check only)

Same populations, setups, fills, costs and simulator as round 2 (round2.control_setups / round2.arrival_setups /
r2lib.simulate; imported, not copied):
  zone     every fresh D1 / H4 zone on the 29 majors / crosses / gold since 2010, limit at the proximal, simulated on H4
  arrival  every verified arrival (MN / W1 / D1 / H4), simulated on the finer bars (round-2 OANDA windows, cached)
  second   second-touch trades of the zones: after the first return into the zone (not through the stop, no close
           beyond the distal), a new limit at the proximal placed at the close of the first bar that is back outside
Hypotheses (fixed before looking at any result; the evidence is in Round3.md):
  1 trend      side agrees with the sign of the 12-month return (252 D1 closes) / with close vs the 200-day SMA / both
  2 pattern    reversal (DBR / RBD) vs continuation (RBR / DBD), continuation + 12-month momentum
  3 volatility entry-TF ATR14 percentile over the last 250 bars: < 30, 30-70, > 70, > 90
  4 session    H4 zones only: Asia / London / London-NY overlap / NY, from the UTC hour the fill bar starts
  5 stop width stop at distal + 0.1 / 0.5 / 1.0 x ATR14 (R recomputed, target 2R of the new risk)
  6 exits      time stop (exit at the close when +1R is not reached in 10 TF bars), break-even at 2R (3R target),
               fixed 1.5R / 3R, trail behind the entry-TF swing after 1.5R
  7 freshness  second-touch trades: first-return depth >= 25% vs < 25% of the zone height
  8 pairs      a few pairs of the above (no grid)
Every feature is computed from bars closed at the moment the order is placed (tests/test_round3.py checks that
truncating the future changes nothing). Walk-forward: train < 2020, test 2020+; a second holdout splits the
instruments into two seeded random halves and needs the sign to hold in both halves of the test years; week-block
bootstrap CI and a one-sided p-value per hypothesis on the test years, Benjamini-Hochberg (and Bonferroni) over every
hypothesis counted.

Outputs: --out (Round3.md, summary.json), --json (public/learn/round3_summary.json), --dump (every row, artifact).
"""
from __future__ import annotations

import argparse
import datetime as dt
import gzip
import json
import math
import os
import random
import statistics
import sys
import time
from typing import Callable, Dict, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import r2lib as R  # noqa: E402
import round2 as R2  # noqa: E402
import oanda_fine as OF  # noqa: E402

A, Z, ZVT = R.A, R.Z, R.ZVT

SPLIT = R2.SPLIT
SEED = 20261103                 # instrument halves
MOM_BARS, SMA_BARS = 252, 200   # D1 bars
VOL_WIN = 250                   # entry-TF bars for the ATR percentile
TIME_STOP_TF_BARS = 10
SWING_AFTER = 1.5
STOP_MULTS = (0.1, 0.5, 1.0)
FDR_Q = 0.05
N_BOOT = 1000
MIN_N = 30                      # closed trades needed in train and in test to survive
# fine bars per entry-TF bar (time stop in TF bars -> fine bars); (TF, simulated-on)
FINE_PER = {('H4', 'M15'): 16, ('H4', 'H4'): 1, ('D1', 'H1'): 24, ('D1', 'H4'): 6, ('D1', 'D1'): 1, ('W1', 'H4'): 30,
            ('W1', 'D1'): 5, ('MN', 'D1'): 21}

MGMT3 = ['2R', '1.5R', '3R', 'be2R', 'time10', 'swing'] + [f'stop{m}' for m in STOP_MULTS]
MG_NAMES = {'2R': 'fixed 2R', '1.5R': 'fixed 1.5R', '3R': 'fixed 3R',
            'be2R': 'break-even at 2R, target 3R', 'time10': 'fixed 2R + time stop (+1R in 10 TF bars)',
            'swing': 'trail behind the entry-TF swing after 1.5R',
            **{f'stop{m}': f'stop at distal + {m} ATR, 2R' for m in STOP_MULTS}}


# ---- features at placement (only bars closed by then) -----------------------------------------------------------------
def _sign(x: float) -> int:
    return 1 if x > 0 else (-1 if x < 0 else 0)


class Trend:
    """Long-horizon trend from D1 closes: 12-month (252-bar) return sign and close vs the 200-day SMA, read at a time t
    from the D1 bars CLOSED by t (prefix sums, O(1) a call)."""

    def __init__(self, D1: Optional[R.TF]):
        self.T = D1
        self.c = [b.c for b in D1.bars] if D1 is not None else []
        self.ps = [0.0]
        for x in self.c:
            self.ps.append(self.ps[-1] + x)

    def at(self, t: str, d: int) -> Dict[str, Optional[int]]:
        if self.T is None:
            return {'mom12': None, 'sma200': None}
        k = self.T.closed(t)
        mom = _sign(self.c[k - 1] - self.c[k - 1 - MOM_BARS]) * d if k >= MOM_BARS + 1 else None
        sma = _sign(self.c[k - 1] - (self.ps[k] - self.ps[k - SMA_BARS]) / SMA_BARS) * d if k >= SMA_BARS else None
        return {'mom12': mom, 'sma200': sma}


class VolPct:
    """Entry-TF ATR14 (the MT5 simple average of the true range, = zones.Series.atr) of every bar, and its percentile
    among the last VOL_WIN bars, for k bars closed (bar k-1 the newest)."""

    def __init__(self, T: R.TF):
        b = T.bars
        n = len(b)
        tr = [0.0] * n
        for i in range(1, n):
            pc = b[i - 1].c
            tr[i] = max(b[i].h, pc) - min(b[i].l, pc)
        self.atr: List[Optional[float]] = [None] * n
        s = 0.0
        for i in range(1, n):
            s += tr[i]
            if i > 14:
                s -= tr[i - 14]
            if i >= 14:
                self.atr[i] = s / 14

    def value(self, k: int) -> Optional[float]:
        return self.atr[k - 1] if 0 < k <= len(self.atr) else None

    def pct(self, k: int) -> Optional[float]:
        if k - VOL_WIN < 14 or k > len(self.atr):
            return None
        cur = self.atr[k - 1]
        w = self.atr[k - VOL_WIN:k]
        return 100.0 * sum(1 for a in w if a <= cur) / VOL_WIN


class Swings:
    """Entry-TF swing lows / highs (zvtrend's swing size: lower than the `sw` bars before and not above the `sw` after),
    each with the time it is CONFIRMED (the close of the sw-th bar after it): [(t_known, level)], oldest first."""

    def __init__(self, T: R.TF, sw: int = ZVT.ZV['swing']):
        b, n = T.bars, len(T.bars)
        self.lows: List[Tuple[str, float]] = []
        self.highs: List[Tuple[str, float]] = []
        for i in range(sw, n - sw):
            lo, hi = b[i].l, b[i].h
            if all(lo < b[j].l for j in range(i - sw, i)) and all(lo <= b[j].l for j in range(i + 1, i + sw + 1)):
                self.lows.append((T.ends[i + sw], lo))
            if all(hi > b[j].h for j in range(i - sw, i)) and all(hi >= b[j].h for j in range(i + 1, i + sw + 1)):
                self.highs.append((T.ends[i + sw], hi))

    def side(self, d: int) -> List[Tuple[str, float]]:
        return self.lows if d > 0 else self.highs


def session_utc(bar_start: Optional[str]) -> Optional[str]:
    """Forex-time (NY + 7 h) label of the bar the order filled in -> the session of its UTC start hour: London 07-12,
    London-NY overlap 12-16, NY 16-21, Asia 21-07 (Sydney / Tokyo)."""
    if not bar_start:
        return None
    import fxcfg as C
    h = C.h4_close_utc(bar_start, 0).hour
    return 'london' if 7 <= h < 12 else 'overlap' if 12 <= h < 16 else 'ny' if 16 <= h < 21 else 'asia'


def fill_bar_start(fill_t: Optional[str], gran: str) -> Optional[str]:
    """simulate() gives the fill bar's CLOSE time; its label (start) = close - one bar."""
    if not fill_t or gran not in R.MINUTES:
        return None
    return R.add_time(fill_t, minutes=-R.MINUTES[gran])


def placement_features(trend: Trend, vol: VolPct, zone: Z.Zone, t0: str, k: int, d: int) -> Dict:
    """Round-3 features of an order placed at t0 (k entry-TF bars closed)."""
    return {**trend.at(t0, d), 'pattern': 'cont' if zone.cont else 'rev', 'atr_pct': vol.pct(k)}


# ---- management variants ----------------------------------------------------------------------------------------------
def run3(d: int, entry: float, stop: float, distal: float, atr: float, fine: R.TF, t0: str, expire: str,
         hold_end: Optional[str], cost: float, fine_per_tf: int, swings: Sequence[Tuple[str, float]]) -> Dict[str, Dict]:
    """Every round-3 management of one order. One cancel level (2R of the round-2 stop) for all, so every variant has
    the same fills (as in round 2); the stop-width variants recompute R (and the 2R target) from their own stop."""
    risk = (entry - stop) * d
    ca = entry + d * 2 * risk

    def sim(st=stop, **kw):
        return R.simulate(d, entry, st, fine, t0, expire, hold_end, distal, cost, cancel_at=ca, **kw)

    def tp(x, st=stop):
        return entry + x * (entry - st)          # x R of that stop's risk, on the trade's side

    out = {'2R': sim(mgmt='fixed', tp=tp(2)), '1.5R': sim(mgmt='fixed', tp=tp(1.5)), '3R': sim(mgmt='fixed', tp=tp(3)),
           'be2R': sim(mgmt='fixed', tp=tp(3), be_at=2.0),
           'time10': sim(mgmt='fixed', tp=tp(2), time_bars=TIME_STOP_TF_BARS * fine_per_tf, time_r=1.0),
           'swing': sim(mgmt='swing', tp=None, swings=swings, swing_after=SWING_AFTER)}
    for m in STOP_MULTS:
        st = distal - d * m * atr
        out[f'stop{m}'] = (sim(st, mgmt='fixed', tp=tp(2, st)) if atr > 0 and (entry - st) * d > 0
                           else {'outcome': 'bad levels', 'R': None})
    return out


def slim3(res: Dict[str, Dict]) -> Dict[str, Dict]:
    return {m: {k: v for k, v in r.items() if k in ('outcome', 'R', 'fill_t', 'why')} for m, r in res.items()}


# ---- second touch -----------------------------------------------------------------------------------------------------
def second_touch(d: int, prox: float, dist: float, stop: float, sim: R.TF, t0: str, expire: str,
                 leave_by: str) -> Optional[Tuple[str, float]]:
    """The first return into the zone after t0 (by `expire`), then the first bar fully back outside it (by `leave_by`):
    (that bar's close time = when the second-touch order is placed, depth of the first return as a share of the zone
    height). None when price never returned, closed beyond the distal or traded through the stop meanwhile."""
    h = abs(prox - dist)
    if h <= 0:
        return None
    i = sim.closed(t0)
    touch = None
    while i < len(sim) and sim.ends[i] <= expire:
        b = sim.bars[i]
        if (b.l <= prox) if d > 0 else (b.h >= prox):
            touch = i
            break
        if (b.c < dist) if d > 0 else (b.c > dist):
            return None
        i += 1
    if touch is None:
        return None
    deep = prox
    for j in range(touch, len(sim)):
        if sim.ends[j] > leave_by:
            return None
        b = sim.bars[j]
        if j > touch and ((b.l > prox) if d > 0 else (b.h < prox)):
            return sim.ends[j], abs(prox - deep) / h
        if ((b.l <= stop) if d > 0 else (b.h >= stop)) or ((b.c < dist) if d > 0 else (b.c > dist)):
            return None
        deep = min(deep, b.l) if d > 0 else max(deep, b.h)
    return None


# ---- one instrument ---------------------------------------------------------------------------------------------------
def zone_rows(job: Dict, data: Dict[str, R.TF], tf: str, htf: str, cnt: Dict, trend: Trend) -> List[Dict]:
    T = data.get(tf)
    if T is None or 'H4' not in data:
        return []
    vol, sw = VolPct(T), Swings(T)
    per = FINE_PER.get((tf, 'H4'), 1)
    out = []
    for x in R2.control_setups(job, data, tf, htf, cnt):
        z, zt, St, d, t0, k, sim, sp = x['z'], x['zt'], x['St'], x['d'], x['t0'], x['k'], x['sim'], x['sp']
        stop = x['st'].stop
        f = placement_features(trend, vol, zt, t0, k, d)
        res = run3(d, z.prox, stop, z.dist, St.atr(1), sim, t0, x['expire'], x['hold_end'], sp, per, sw.side(d))
        fill_t = res['2R'].get('fill_t')
        if fill_t is None:
            cnt['r3_unfilled'] = cnt.get('r3_unfilled', 0) + 1
        else:
            f['session'] = session_utc(fill_bar_start(fill_t, 'H4')) if tf == 'H4' else None
            out.append({'pop': 'zone', 'sym': job['sym'], 'tf': tf, 'dir': d, 't': t0, 'fill_t': fill_t, 'f': f,
                        'res': slim3(res)})
        # second touch (H4 bars), placed after the first return has left the zone
        n = len(T)
        leave_by = T.ends[min(k - 1 + 2 * R2.EXPIRY, n - 1)]
        s2 = second_touch(d, z.prox, z.dist, stop, sim, t0, x['expire'], leave_by) if fill_t else None
        if s2 is None:
            continue
        t2, depth = s2
        k2 = T.closed(t2)
        exp2 = T.ends[min(k2 - 1 + R2.EXPIRY, n - 1)]
        hold2 = T.ends[k2 - 1 + R2.HOLD + R2.EXPIRY // 2] if k2 - 1 + R2.HOLD + R2.EXPIRY // 2 < n else None
        risk = (z.prox - stop) * d
        r2 = R.simulate(d, z.prox, stop, sim, t2, exp2, hold2, z.dist, sp, 'fixed', z.prox + d * 2 * risk)
        cnt['r3_second'] = cnt.get('r3_second', 0) + 1
        if r2.get('fill_t'):
            f2 = {**placement_features(trend, vol, zt, t2, k2, d), 'depth': depth}
            out.append({'pop': 'second', 'sym': job['sym'], 'tf': tf, 'dir': d, 't': t2, 'fill_t': r2['fill_t'], 'f': f2,
                        'res': slim3({'2R': r2})})
    return out


def arrival_rows(job: Dict, data: Dict[str, R.TF], fine: R2.Fine, cnt: Dict, trend: Trend) -> List[Dict]:
    out = []
    for tf, (start, htf) in R2.FX_TFS.items():
        T = data.get(tf)
        if T is None:
            continue
        vol, sw = VolPct(T), Swings(T)
        for x in R2.arrival_setups(job, data, fine, tf, start, htf, cnt):
            pl, d, cur, St, fz, t0, k = x['pl'], x['d'], x['cur'], x['St'], x['fz'], x['t0'], x['k']
            f = placement_features(trend, vol, cur.zone, t0, k, d)
            res = run3(d, pl.entry, pl.stop, cur.zone.dist, St.atr(1), fz, t0, x['expire'], x['hold_end'], x['sp'],
                       FINE_PER.get((tf, fz.tf), 1), sw.side(d))
            fill_t = res['2R'].get('fill_t')
            if fill_t is None:
                continue
            f['session'] = session_utc(fill_bar_start(fill_t, fz.tf)) if tf == 'H4' else None
            out.append({'pop': 'arrival', 'sym': job['sym'], 'tf': tf, 'dir': d, 't': t0, 'fill_t': fill_t, 'f': f,
                        'res': slim3(res)})
    return out


def study_instrument3(job: Dict) -> Dict:
    t0 = time.time()
    out = {'sym': job['sym'], 'rows': [], 'counts': {}, 'error': None}
    try:
        data = R2.load_job(job)
        trend = Trend(data.get('D1'))
        if not job.get('no_arrivals'):
            fine = R2.Fine(job['name'], {k: v for k, v in data.items() if k in ('H4', 'D1')}, job.get('fine'))
            cnt: Dict = {}
            out['rows'] += arrival_rows(job, data, fine, cnt, trend)
            out['counts']['arrivals'] = cnt
            out['fine_fail'] = fine.fail
        if job.get('ctrl'):
            for tf, htf in R2.CTRL_TFS.items():
                cnt = {}
                out['rows'] += zone_rows(job, data, tf, htf, cnt, trend)
                out['counts'][f'zone {tf}'] = cnt
        out['requests'] = OF.STATS['requests']
    except Exception as e:  # noqa: BLE001
        import traceback
        out['error'] = f'{type(e).__name__}: {str(e)[:160]} | {traceback.format_exc()[-400:]}'
    out['secs'] = round(time.time() - t0, 1)
    return out


# ---- statistics -------------------------------------------------------------------------------------------------------
def p_one_sided(mean: float, means: Optional[List[float]]) -> Optional[float]:
    """One-sided p-value of H0 'expectancy <= 0' from the bootstrap distribution of the mean (normal approximation with
    the bootstrap standard error, so small p-values are resolved beyond 1 / N_BOOT)."""
    if means is None:
        return None
    se = statistics.pstdev(means)
    if se <= 0:
        return 0.0 if mean > 0 else 1.0
    return 0.5 * math.erfc(mean / se / math.sqrt(2))


def sstats(ts: List[Dict], boot: bool = True) -> Dict:
    """Closed trades only: n, win rate, expectancy (avg R), week-block 95% CI and one-sided p."""
    c = [t for t in ts if t.get('outcome') in R.CLOSED and t.get('R') is not None]
    rs = [t['R'] for t in c]
    out = {'n': len(c), 'win': (sum(1 for r in rs if r > 0.05) / len(rs)) if rs else None,
           'exp_r': (sum(rs) / len(rs)) if rs else None, 'ci': None, 'p': None}
    if boot and rs:
        ms = R._block_means(c, 'R', N_BOOT)
        if ms is not None:
            out['ci'] = [ms[int(0.025 * N_BOOT)], ms[int(0.975 * N_BOOT) - 1]]
            out['p'] = p_one_sided(out['exp_r'], ms)
    return out


def bh(pvals: Sequence[Optional[float]], q: float = FDR_Q) -> List[bool]:
    """Benjamini-Hochberg step-up: True = discovery at false-discovery rate q (None = not testable, never a discovery
    but counted in m)."""
    m = len(pvals)
    order = sorted((p if p is not None else 1.0, i) for i, p in enumerate(pvals))
    kmax = 0
    for rank, (p, _) in enumerate(order, 1):
        if p <= q * rank / m:
            kmax = rank
    out = [False] * m
    for rank, (p, i) in enumerate(order, 1):
        if rank <= kmax and pvals[i] is not None:
            out[i] = True
    return out


def bonferroni(pvals: Sequence[Optional[float]], alpha: float = 0.05) -> List[bool]:
    m = len(pvals) or 1
    return [p is not None and p <= alpha / m for p in pvals]


def halves(syms: Sequence[str], seed: int = SEED) -> Tuple[set, set]:
    """Two random halves of the instruments (seeded, reproducible)."""
    s = sorted(set(syms))
    random.Random(seed).shuffle(s)
    h = len(s) // 2
    return set(s[:h]), set(s[h:])


# ---- hypotheses -------------------------------------------------------------------------------------------------------
def _pat(v): return lambda f: f.get('pattern') == v
def _vol(lo, hi): return lambda f: f.get('atr_pct') is not None and lo <= f['atr_pct'] < hi
def _ses(v): return lambda f: f.get('session') == v
def _and(*fs): return lambda f: all(g(f) for g in fs)


F3: Dict[str, Tuple[str, Callable[[Dict], bool]]] = {
    'all': ('every setup', lambda f: True),
    'mom12': ('side agrees with the 12-month return', lambda f: f.get('mom12') == 1),
    'sma200': ('side agrees with close vs 200-day SMA', lambda f: f.get('sma200') == 1),
    'mom12+sma200': ('12-month return and 200-day SMA both agree', lambda f: f.get('mom12') == 1 and f.get('sma200') == 1),
    'rev': ('reversal zone (DBR / RBD)', _pat('rev')),
    'cont': ('continuation zone (RBR / DBD)', _pat('cont')),
    'cont+mom12': ('continuation zone + 12-month momentum agrees', lambda f: f.get('pattern') == 'cont' and f.get('mom12') == 1),
    'vol<30': ('ATR percentile < 30 (quiet)', _vol(-1, 30)),
    'vol30-70': ('ATR percentile 30-70', _vol(30, 70.000001)),
    'vol>70': ('ATR percentile > 70 (volatile)', _vol(70.000001, 101)),
    'vol>90': ('ATR percentile > 90', _vol(90.000001, 101)),
    'asia': ('H4 zone filled in Asia (21-07 UTC)', _ses('asia')),
    'london': ('H4 zone filled in London (07-12 UTC)', _ses('london')),
    'overlap': ('H4 zone filled in the London-NY overlap (12-16 UTC)', _ses('overlap')),
    'ny': ('H4 zone filled in NY (16-21 UTC)', _ses('ny')),
    'mom12+rev': ('12-month momentum + reversal zone', lambda f: f.get('mom12') == 1 and f.get('pattern') == 'rev'),
    'sma200+rev': ('200-day SMA + reversal zone', lambda f: f.get('sma200') == 1 and f.get('pattern') == 'rev'),
    'mom12+vol<30': ('12-month momentum + quiet (ATR pct < 30)', lambda f: f.get('mom12') == 1 and _vol(-1, 30)(f)),
    'mom12+vol>70': ('12-month momentum + volatile (ATR pct > 70)', lambda f: f.get('mom12') == 1 and _vol(70.000001, 101)(f)),
    'rev+vol>70': ('reversal zone + volatile (ATR pct > 70)', lambda f: f.get('pattern') == 'rev' and _vol(70.000001, 101)(f)),
    'depth>=25': ('second touch, first return >= 25% deep', lambda f: f.get('depth') is not None and f['depth'] >= 0.25),
    'depth<25': ('second touch, first return < 25% deep', lambda f: f.get('depth') is not None and f['depth'] < 0.25),
    # reference rows (not counted as hypotheses)
    'anti-mom12': ('side against the 12-month return', lambda f: f.get('mom12') == -1),
    'anti-sma200': ('side against the 200-day SMA', lambda f: f.get('sma200') == -1),
}

FAMILY_FILTERS = [('1 trend', ['mom12', 'sma200', 'mom12+sma200']),
                  ('2 pattern', ['rev', 'cont', 'cont+mom12']),
                  ('3 volatility', ['vol<30', 'vol30-70', 'vol>70', 'vol>90']),
                  ('4 session (H4)', ['asia', 'london', 'overlap', 'ny'])]
FAMILY_MGMT = [('5 stop width', [f'stop{m}' for m in STOP_MULTS]), ('6 exits', ['time10', 'be2R', '1.5R', '3R', 'swing'])]
PAIRS = [('mom12+rev', '2R'), ('sma200+rev', '2R'), ('mom12+vol<30', '2R'), ('mom12+vol>70', '2R'), ('rev+vol>70', '2R'),
         ('mom12', 'time10'), ('mom12', 'stop1.0'), ('mom12', 'swing')]
POP_NAMES = {'zone': 'every fresh zone (D1 + H4)', 'arrival': 'arrivals', 'second': 'second-touch zones'}


def hypotheses() -> List[Dict]:
    """The fixed list (decided before any result). counted = enters the multiple-testing correction."""
    H = []
    for pop in ('zone', 'arrival'):
        H.append({'pop': pop, 'family': '0 baseline', 'filter': 'all', 'mgmt': '2R', 'counted': False})
        for fam, fl in FAMILY_FILTERS:
            for x in fl:
                H.append({'pop': pop, 'family': fam, 'filter': x, 'mgmt': '2R', 'counted': True,
                          'h4_only': fam.startswith('4')})
        for fam, ml in FAMILY_MGMT:
            for m in ml:
                H.append({'pop': pop, 'family': fam, 'filter': 'all', 'mgmt': m, 'counted': True})
        for x, m in PAIRS:
            H.append({'pop': pop, 'family': '8 pairs', 'filter': x, 'mgmt': m, 'counted': True})
        for x in ('anti-mom12', 'anti-sma200'):
            H.append({'pop': pop, 'family': '0 reference', 'filter': x, 'mgmt': '2R', 'counted': False})
    H.append({'pop': 'second', 'family': '0 baseline', 'filter': 'all', 'mgmt': '2R', 'counted': False})
    for x in ('depth>=25', 'depth<25'):
        H.append({'pop': 'second', 'family': '7 freshness', 'filter': x, 'mgmt': '2R', 'counted': True})
    for h in H:
        h['key'] = f"{h['pop']}:{h['filter']}:{h['mgmt']}"
        h['label'] = f"{F3[h['filter']][0]}, {MG_NAMES[h['mgmt']]}"
    return H


def trades_of(rows: List[Dict], h: Dict) -> List[Dict]:
    F = F3[h['filter']][1]
    out = []
    for r in rows:
        if r['pop'] != h['pop'] or (h.get('h4_only') and r['tf'] != 'H4') or not F(r.get('f') or {}):
            continue
        x = (r.get('res') or {}).get(h['mgmt'])
        if x is None or x.get('outcome') not in R.CLOSED or x.get('R') is None:
            continue
        out.append({'sym': r['sym'], 't': r['t'], 'fill_t': x.get('fill_t') or r.get('fill_t'), 'R': x['R'],
                    'outcome': x['outcome']})
    return out


def evaluate(rows: List[Dict], q: float = FDR_Q) -> Tuple[List[Dict], Dict]:
    """Every hypothesis: train / test / test-by-half stats, BH + Bonferroni over the counted ones, survives."""
    half_a, half_b = halves([r['sym'] for r in rows])
    H = hypotheses()
    for h in H:
        ts = trades_of(rows, h)
        tr = [t for t in ts if t['t'] < SPLIT]
        te = [t for t in ts if t['t'] >= SPLIT]
        h['train'] = sstats(tr)
        h['test'] = sstats(te)
        h['halves'] = [sstats([t for t in te if t['sym'] in half], boot=False) for half in (half_a, half_b)]
    counted = [h for h in H if h['counted']]
    ps = [h['test']['p'] for h in counted]
    for h, b_, bf in zip(counted, bh(ps, q), bonferroni(ps, 0.05)):
        h['bh'], h['bonf'] = b_, bf
    for h in H:
        h.setdefault('bh', None)
        h.setdefault('bonf', None)
        tr, te = h['train'], h['test']
        h['halves_ok'] = all(x['n'] >= 10 and (x['exp_r'] or 0) > 0 for x in h['halves'])
        h['survives'] = bool(h['counted'] and tr['n'] >= MIN_N and te['n'] >= MIN_N and (tr['exp_r'] or -1) > 0
                             and (te['exp_r'] or -1) > 0 and h['halves_ok'] and h['bh'])
    meta = {'n_hypotheses': len(counted), 'fdr_q': q, 'bonferroni_alpha': 0.05 / max(1, len(counted)),
            'half_a': sorted(half_a), 'half_b': sorted(half_b), 'split': SPLIT, 'seed': SEED}
    return H, meta


# ---- report -----------------------------------------------------------------------------------------------------------
def _e(s: Dict) -> str:
    return R.fmt(s.get('exp_r'), '{:+.2f}')


def _ci(s: Dict) -> str:
    return f"{s['ci'][0]:+.2f} … {s['ci'][1]:+.2f}" if s.get('ci') else '–'


def _w(s: Dict) -> str:
    return R.fmt(s['win'] and 100 * s['win'], '{:.0f}') if s.get('win') is not None else '–'


def _p(p: Optional[float]) -> str:
    if p is None:
        return '–'
    return f'{p:.4f}' if p >= 0.0001 else '<0.0001'


def result_table(H: List[Dict]) -> List[str]:
    L = ['| family | hypothesis | train n | train win % | train avg R | test n | test win % | test avg R | test 95% CI (week blocks) | '
         'p (test, one-sided) | half A | half B | BH | Bonf. | survives |',
         '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    for h in H:
        tr, te = h['train'], h['test']
        ha, hb = h['halves']
        yes = lambda v: '–' if v is None else ('yes' if v else 'no')  # noqa: E731
        L.append(f"| {h['family']} | {h['label']} | {tr['n']} | {_w(tr)} | {_e(tr)} | {te['n']} | {_w(te)} | {_e(te)} | {_ci(te)} | "
                 f"{_p(te['p'])} | {_e(ha)} ({ha['n']}) | {_e(hb)} ({hb['n']}) | {yes(h['bh'])} | {yes(h['bonf'])} | "
                 f"{'**YES**' if h['survives'] else ('–' if not h['counted'] else 'no')} |")
    return L + ['']


def plain_answer(H: List[Dict], meta: Dict, selftest: bool) -> List[str]:
    counted = [h for h in H if h['counted']]
    surv = [h for h in counted if h['survives']]
    base = {h['pop']: h for h in H if h['filter'] == 'all' and h['mgmt'] == '2R'}
    tr_pos = [h for h in counted if (h['train']['exp_r'] or -1) > 0 and h['train']['n'] >= 30]
    tr_pos_held = [h for h in tr_pos if (h['test']['exp_r'] or -1) > 0]
    best = sorted([h for h in counted if h['test']['n'] >= 30], key=lambda h: -(h['test']['exp_r'] or -9))[:5]
    L = ['## The answer in plain English', '']
    if selftest:
        L += ['> **SELFTEST on synthetic random-walk bars.** These numbers only show that the code runs; they say nothing '
              'about real markets. Run the workflow (round = 3) for the real answer.', '']
    if surv:
        L.append(f"**{len(surv)} of {len(counted)} hypotheses survived** every check (positive in 2010–2019, positive in "
                 f"2020–2026, positive in both random halves of the instruments, and significant after the "
                 f"Benjamini-Hochberg false-discovery check at q = {meta['fdr_q']}):")
        L.append('')
        for h in surv:
            L.append(f"- **{POP_NAMES[h['pop']]}: {h['label']}**: test {_e(h['test'])}R per trade "
                     f"(n = {h['test']['n']}, {_w(h['test'])}% win, CI {_ci(h['test'])}); train {_e(h['train'])}R. "
                     f"Bonferroni: {'passes' if h['bonf'] else 'does not pass'}.")
        L += ['', 'Treat a survivor as a candidate for a forward (paper) test, not as proof: it is one regime of '
              '2020–2026, and the halves share the same weeks.', '']
    else:
        L.append(f"**Nothing survived.** We tested {len(counted)} hypotheses with outside evidence behind them (long-horizon "
                 f"trend, zone pattern, volatility regime, session, stop width, exits, second-touch depth and a few pairs). "
                 f"None was positive in the training years, positive in 2020–2026, positive in both random halves of the "
                 f"instruments **and** significant after the false-discovery check.")
        L.append('')
    for pop in ('zone', 'arrival', 'second'):
        b = base.get(pop)
        if b is not None and b['test']['n']:
            L.append(f"- Baseline, {POP_NAMES[pop]} at 2R: train {_e(b['train'])}R (n = {b['train']['n']}), "
                     f"test {_e(b['test'])}R (n = {b['test']['n']}, CI {_ci(b['test'])}).")
    neg = [h for h in counted if h['test']['n'] and (h['test']['exp_r'] or 0) <= 0]
    L.append(f"- **What doesn't work:** {len(neg)} of {len(counted)} hypotheses lost money (avg R ≤ 0) in 2020–2026"
             + (': ' + '; '.join(f"{h['pop']}: {h['label']} {_e(h['test'])}R" for h in sorted(neg, key=lambda h: h['test']['exp_r'])[:6])
                + (' …' if len(neg) > 6 else '') if neg else '') + '.')
    L.append(f"- {len(tr_pos)} hypotheses looked positive in 2010–2019 (≥ 30 trades); {len(tr_pos_held)} of them stayed "
             f"positive in 2020–2026 (before the halves and the FDR check).")
    if best:
        L.append('- Best test-period expectancies (≥ 30 trades; the FDR column says whether it is more than luck):')
        for h in best:
            L.append(f"  - {POP_NAMES[h['pop']]}: {h['label']}: {_e(h['test'])}R (n = {h['test']['n']}, p = {_p(h['test']['p'])}, "
                     f"halves {_e(h['halves'][0])} / {_e(h['halves'][1])}, BH {'yes' if h['bh'] else 'no'})")
    L += ['', f"**How sure:** {len(counted)} hypotheses were counted, so about {len(counted) * 0.05:.0f} would look "
          f"'significant' at p < 0.05 by luck alone. Bonferroni needs p < {meta['bonferroni_alpha']:.5f}; Benjamini-Hochberg "
          f"controls the share of false discoveries at {int(meta['fdr_q'] * 100)}%. The week-block CI is the honest one "
          f"(correlated USD pairs fill the same weeks).", '']
    return L


def report(rows: List[Dict], H: List[Dict], meta: Dict, run_meta: Dict) -> str:
    L = ['# Arrival study, round 3: outside-evidence hypotheses on every zone and every arrival', '',
         f"Generated {run_meta['generated']} by `tools/research/arrival_study/round3.py` ({run_meta['how']}). "
         f"{run_meta['n_fx']} instruments, runtime {run_meta['minutes']:.0f} min"
         + (' (**partial: time budget reached**)' if run_meta.get('partial') else '') + '.', '']
    L += plain_answer(H, meta, run_meta.get('selftest', False))
    n_by = {}
    for r in rows:
        n_by[r['pop']] = n_by.get(r['pop'], 0) + 1
    L += ['## What was tested and why', '',
          'Each hypothesis was fixed before any result, on the same setups as round 2 (same zones, arrivals, fills, stop '
          'rule, spread cost and simulator). Outside evidence behind each:', '',
          '1. **Long-horizon trend (time-series momentum).** Moskowitz, Ooi & Pedersen (2012), "Time series momentum": the '
          '12-month return predicts the next month in 58 futures / FX markets; the 200-day SMA rule (Faber 2007; Brock, '
          'Lakonishok & LeBaron 1992). Tested: side agrees with the sign of the 252-D1-bar return, with close vs the '
          '200-day SMA, and both.',
          '2. **Zone pattern.** Continuation vs reversal bases (trend continuation is what momentum predicts; reversal is '
          'the short-horizon mean-reversion effect, Lo & MacKinlay 1990). Tested: reversal (DBR / RBD), continuation '
          '(RBR / DBD), continuation + 12-month momentum.',
          '3. **Volatility regime.** Volatility clusters (Engle 1982, ARCH) and volatility-managed returns differ by '
          'regime (Moreira & Muir 2017). Tested: entry-TF ATR14 percentile over the last 250 bars < 30, 30–70, > 70, > 90.',
          '4. **Session of the fill (H4 only).** FX volume and price discovery concentrate in London and the London–NY '
          'overlap (BIS Triennial Survey; Ito & Hashimoto 2006). Tested from the UTC hour the fill bar starts: Asia '
          '21–07, London 07–12, overlap 12–16, NY 16–21.',
          '5. **Stop width.** Tight stops pay the spread on a small R (round 2: stops < 0.6 ATR did −0.23R) and noise '
          'stops them out (Kaminski & Lo 2014, "When do stop-loss rules stop losses?"). Tested: stop at distal + 0.1 / '
          '0.5 / 1.0 × ATR14, R and the 2R target recomputed, same fills.',
          '6. **Exits.** Time stops and trailing exits (Kaminski & Lo 2014; trend-following practice, e.g. Clenow 2013). '
          'Tested: 2R + time stop (out at the close when +1R was not reached in 10 TF bars), break-even at 2R with a 3R '
          'target, fixed 1.5R and 3R, trail behind the newest confirmed entry-TF swing once +1.5R.',
          '7. **Freshness / depth.** Order-flow depletion at a level (Osler 2003, "Currency orders and exchange-rate '
          'dynamics": stop / take-profit order clustering at round levels and prior extremes). Tested on second-touch '
          'trades: first return ≥ 25% vs < 25% of the zone height.',
          '8. **Pairs.** Only a few pairs of the above (no grid): ' + ', '.join(f'{x} @ {m}' for x, m in PAIRS) + '.', '',
          f"Rows: " + ', '.join(f'{POP_NAMES.get(k, k)} {v:,} filled setups' for k, v in sorted(n_by.items())) + '.', '']
    for pop in ('zone', 'arrival', 'second'):
        hs = [h for h in H if h['pop'] == pop]
        if not hs:
            continue
        L += [f"## Results: {POP_NAMES[pop]}", '', 'Train = setups placed 2010–2019, test = 2020–2026. Half A / B = '
              'the test-period avg R (trades) in each random half of the instruments. BH = Benjamini-Hochberg discovery '
              f"at q = {meta['fdr_q']} over all {meta['n_hypotheses']} counted hypotheses; Bonf. = p < "
              f"{meta['bonferroni_alpha']:.5f}. Rows marked '0 baseline' / '0 reference' are not counted.", '']
        L += result_table(hs)
    L += ['## Method', '',
          '- **No look-ahead.** Every feature reads only bars closed when the order is placed: the 12-month return and '
          'the 200-day SMA from D1 bars closed by then (a D1 zone: the stay-away candle\'s close), the ATR percentile from '
          'the entry-TF bars closed by then, the pattern from the zone as it was formed. The session uses the fill bar '
          '(known at the fill). The swing trail only uses swings confirmed by the bar\'s close. The second-touch depth is '
          'measured before the second order is placed. `tests/test_round3.py` checks that cutting off the future '
          'changes none of them.',
          '- **Costs** as round 2: the median bid/ask spread of the instrument, charged once per trade in R (the spread '
          'is the round trip: buy at the ask, sell at the bid).',
          '- **Fills** as round 2: one cancel level (2R of the round-2 stop) for every management, so every variant has '
          'the same fills; the stop-width variants recompute R from their own stop.',
          '- **Walk-forward:** nothing is fitted; each hypothesis is a fixed rule. Train 2010–2019, test 2020–2026. A '
          'hypothesis **survives** only when it has ≥ 30 closed trades in train and in test, train avg R > 0, test avg R > 0, both random instrument halves are > 0 in '
          'the test years (≥ 10 trades each), and the test p-value is a Benjamini-Hochberg discovery.',
          f"- **Instrument halves** (seed {meta['seed']}): A = {', '.join(meta['half_a']) or '–'}; "
          f"B = {', '.join(meta['half_b']) or '–'}.",
          '- **p-values:** one-sided (H0: avg R ≤ 0) from the week-block bootstrap of the test trades (normal '
          'approximation with the bootstrap standard error).',
          '- **Stocks:** round 2 ran on OANDA FX / CFD instruments only (no stock zones), so round 3 does the same.',
          '- **Second touch:** after the first return into the zone (not through the stop, no close beyond the distal), '
          'a new limit at the proximal is placed at the close of the first H4 bar fully back outside the zone; same '
          'stop, 2R. A trade that was stopped on the first touch has no second touch.',
          '- **Not modelled:** swaps, slippage, news.', '']
    L += ['## Data / counts', '', f"Requests {run_meta.get('requests', 0)}, cached {run_meta.get('cached', 0)}, "
          f"fine-window errors {run_meta.get('fine_errors', 0)}.", '']
    if run_meta.get('errors'):
        L += ['Errors:', ''] + [f'- {e}' for e in run_meta['errors'][:30]] + ['']
    L += ['Reproduce: Actions → "Arrival study" with round = 3. Outputs: `docs/research/arrival_study/round3/` and '
          '`public/learn/round3_summary.json` on the `data` branch; the per-setup rows are in the run artifact.', '']
    return '\n'.join(L)


def learn_json(H: List[Dict]) -> Dict:
    """public/learn/round3_summary.json: {hypothesis: {train, test, halves, survives, ...}}."""
    def s(x):
        return {k: x.get(k) for k in ('n', 'win', 'exp_r', 'ci', 'p') if k in x}
    return {h['key']: {'label': h['label'], 'population': h['pop'], 'family': h['family'], 'filter': h['filter'],
                       'mgmt': h['mgmt'], 'counted': h['counted'], 'train': s(h['train']), 'test': s(h['test']),
                       'halves': [s(x) for x in h['halves']], 'bh': h['bh'], 'bonferroni': h['bonf'],
                       'survives': h['survives']} for h in H}


# ---- driver -----------------------------------------------------------------------------------------------------------
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--fx', type=int, default=0, help='first N FX instruments (0 = all)')
    ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
    ap.add_argument('--budget-min', type=float, default=0)
    ap.add_argument('--out', default=os.path.join(R.ROOT, 'docs', 'research', 'arrival_study', 'round3'))
    ap.add_argument('--json', default=None, help='the learner summary (default public/learn/round3_summary.json; '
                    'none with --selftest unless given)')
    ap.add_argument('--dump', default='', help='write every setup row here (.json.gz)')
    a = ap.parse_args(argv)
    if a.json is None and not a.selftest:
        a.json = os.path.join(R.ROOT, 'public', 'learn', 'round3_summary.json')
    t0 = time.time()
    errors: List[str] = []
    if a.selftest:
        jobs = R2.synthetic_jobs()
        how = 'SELFTEST on synthetic random-walk bars: says nothing about real markets'
    else:
        jobs, errors = R2.fx_jobs(a.fx)
        how = 'GitHub Actions, OANDA practice'
    print(f'{len(jobs)} instruments ready in {time.time() - t0:.0f}s', flush=True)
    rows, counts, partial = R2.run(jobs, a.workers, a.budget_min, log=print, fn=study_instrument3)
    errors += [f"{c['sym']}: {c['error'][:160]}" for c in counts if c['error']]
    rows.sort(key=lambda r: (r['sym'], r['pop'], r['tf'], r['t'], r['dir']))      # deterministic bootstrap input
    print(f'{len(rows)} rows; evaluating ...', flush=True)
    H, meta = evaluate(rows)
    run_meta = {'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), 'how': how, 'partial': partial,
                'selftest': a.selftest, 'n_fx': len(jobs), 'minutes': (time.time() - t0) / 60, 'errors': errors,
                'requests': OF.STATS['requests'] + sum(c.get('requests', 0) for c in counts), 'cached': OF.STATS['cached'],
                'fine_errors': sum(c.get('fine_fail', 0) for c in counts)}
    md = report(rows, H, meta, run_meta)
    os.makedirs(a.out, exist_ok=True)
    with open(os.path.join(a.out, 'Round3.md'), 'w') as f:
        f.write(md)
    with open(os.path.join(a.out, 'summary.json'), 'w') as f:
        json.dump({'meta': {**meta, **run_meta, 'counts': counts}, 'hypotheses': learn_json(H)}, f, indent=1, default=str)
    if a.json:
        os.makedirs(os.path.dirname(os.path.abspath(a.json)), exist_ok=True)
        with open(a.json, 'w') as f:
            json.dump(learn_json(H), f, indent=1, default=str)
    if a.dump:
        with gzip.open(a.dump, 'wt') as f:
            json.dump(rows, f, separators=(',', ':'), default=str)
    print(md[:6000])
    return 0


if __name__ == '__main__':
    sys.exit(main())
