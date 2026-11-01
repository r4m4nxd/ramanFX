"""Statistics for the trend vs supply / demand back-test: trade metrics, equity metrics, cluster bootstrap, risk-size replay
and the Monte Carlo of ruin. Pure numpy / stdlib, deterministic (fixed seeds)."""
from __future__ import annotations

import datetime as dt
import math
import random
from typing import Dict, List, Optional, Sequence, Tuple

import numpy as np

PERIODS = {'2009-now': ('2009-01-01', '9999'), '2009-14': ('2009-01-01', '2015-01-01'), '2015-now': ('2015-01-01', '9999'),
           '2015-20': ('2015-01-01', '2021-01-01'), '2021-now': ('2021-01-01', '9999')}


def in_period(date: str, per: str) -> bool:
    a, b = PERIODS[per]
    return a <= date < b


def streak(rs: Sequence[float]) -> int:
    best = cur = 0
    for r in rs:
        cur = cur + 1 if r <= 0 else 0
        best = max(best, cur)
    return best


def trade_stats(trades: List[Dict], per: Optional[str] = None) -> Dict:
    """Metrics of the CLOSED trades whose ENTRY falls in the period (streak in exit order)."""
    ts = [t for t in trades if per is None or in_period(t['in'], per)]
    ts.sort(key=lambda t: (t['out'], t['in']))
    rs = [t['R'] for t in ts]
    n = len(rs)
    if not n:
        return {'n': 0}
    w = [r for r in rs if r > 0]
    lo = [r for r in rs if r <= 0]
    gw, gl = sum(w), -sum(lo)
    return {'n': n, 'win': len(w) / n, 'avg_win': float(np.mean(w)) if w else 0.0, 'avg_loss': float(np.mean(lo)) if lo else 0.0,
            'exp': float(np.mean(rs)), 'pf': gw / gl if gl > 0 else float('inf'), 'streak': streak(rs), 'sum_r': float(sum(rs)),
            'median_bars': float(np.median([t['bars'] for t in ts]))}


def cluster_ci(trades: List[Dict], per: Optional[str] = None, n: int = 2000, seed: int = 11) -> Optional[Tuple[float, float]]:
    """95% CI of the mean R, resampling whole entry MONTHS (the trades of a month share the market: correlated)."""
    ts = [t for t in trades if per is None or in_period(t['in'], per)]
    if len(ts) < 10:
        return None
    g: Dict[str, List[float]] = {}
    for t in ts:
        g.setdefault(t['in'][:7], []).append(t['R'])
    keys = list(g)
    rnd = random.Random(seed)
    sums = {k: (sum(v), len(v)) for k, v in g.items()}
    out = []
    for _ in range(n):
        s = c = 0
        for _ in keys:
            a, b = sums[keys[rnd.randrange(len(keys))]]
            s += a
            c += b
        out.append(s / c if c else 0.0)
    out.sort()
    return out[int(0.025 * n)], out[int(0.975 * n)]


def equity_stats(equity: Dict[str, float], per: str) -> Dict:
    """CAGR and max drawdown of the mark-to-market equity inside a period (base = the close before it starts)."""
    a, b = PERIODS[per]
    ds = sorted(equity)
    seg = [d for d in ds if a <= d < b]
    if len(seg) < 20:
        return {'cagr': float('nan'), 'maxdd': float('nan'), 'ret': float('nan')}
    prior = [d for d in ds if d < a]
    base = equity[prior[-1]] if prior else 1.0
    vals = np.array([base] + [equity[d] for d in seg])
    peak = np.maximum.accumulate(vals)
    dd = float(np.max(1 - vals / peak))
    yrs = (dt.date.fromisoformat(seg[-1]) - dt.date.fromisoformat(seg[0])).days / 365.25
    ret = vals[-1] / base - 1
    cagr = (vals[-1] / base) ** (1 / yrs) - 1 if yrs > 0 and vals[-1] > 0 else float('nan')
    return {'cagr': cagr, 'maxdd': dd, 'ret': ret, 'years': yrs}


def yearly(equity: Dict[str, float], trades: List[Dict]) -> List[Dict]:
    ds = sorted(equity)
    out = []
    for y in range(int(ds[0][:4]), int(ds[-1][:4]) + 1):
        seg = [d for d in ds if d.startswith(str(y))]
        if not seg:
            continue
        prior = [d for d in ds if d < f'{y}']
        base = equity[prior[-1]] if prior else 1.0
        vals = np.array([base] + [equity[d] for d in seg])
        peak = np.maximum.accumulate(vals)
        ts = [t for t in trades if t['in'].startswith(str(y))]
        rs = [t['R'] for t in ts]
        out.append({'year': y, 'ret': float(vals[-1] / base - 1), 'maxdd': float(np.max(1 - vals / peak)), 'n': len(ts),
                    'exp': float(np.mean(rs)) if rs else float('nan'), 'sum_r': float(sum(rs))})
    return out


def by_symbol(trades: List[Dict], per: Optional[str] = None) -> List[Dict]:
    g: Dict[str, List[float]] = {}
    for t in trades:
        if per is None or in_period(t['in'], per):
            g.setdefault(t['sym'], []).append(t['R'])
    out = []
    for s, rs in sorted(g.items()):
        w = [r for r in rs if r > 0]
        gl = -sum(r for r in rs if r <= 0)
        out.append({'sym': s, 'n': len(rs), 'win': len(w) / len(rs), 'exp': float(np.mean(rs)), 'sum_r': float(sum(rs)),
                    'pf': sum(w) / gl if gl > 0 else float('inf')})
    return out


# ---- risk-size replay and Monte Carlo ----------------------------------------------------------------------------------------
def replay(rs: Sequence[float], f: float, start: float = 1.0) -> Dict:
    """Compound the R sequence at risk fraction f per trade, one after the other (trade order = exit order)."""
    e = peak = start
    mdd = 0.0
    low = e
    for r in rs:
        e *= max(0.0, 1 + f * r)
        peak = max(peak, e)
        mdd = max(mdd, 1 - e / peak)
        low = min(low, e)
        if e <= 0:
            break
    return {'final': e, 'maxdd': mdd, 'low': low, 'half_lost': mdd >= 0.5 or low <= 0.5 * start}


def monte_carlo(rs: Sequence[float], f: float, n_trades: Optional[int] = None, runs: int = 10000, seed: int = 5,
                block: int = 1) -> Dict:
    """Bootstrap the R list (with replacement; blocks of `block` consecutive trades keep losing streaks) into `runs` paths of
    n_trades trades at risk fraction f. P(lose 50%) = the share of paths whose equity falls to <= 50% of its start at any
    time; also the share with a peak-to-trough drawdown >= 50%."""
    rs = np.asarray(rs, dtype=float)
    N = n_trades or len(rs)
    rng = np.random.default_rng(seed)
    if block <= 1:
        idx = rng.integers(0, len(rs), size=(runs, N))
    else:
        nb = math.ceil(N / block)
        st = rng.integers(0, len(rs) - block + 1, size=(runs, nb))
        idx = (st[:, :, None] + np.arange(block)[None, None, :]).reshape(runs, -1)[:, :N]
    paths = np.cumprod(np.maximum(0.0, 1 + f * rs[idx]), axis=1)
    peak = np.maximum.accumulate(np.maximum(paths, 1.0), axis=1)
    dd = np.max(1 - paths / peak, axis=1)
    low = paths.min(axis=1)
    fin = paths[:, -1]
    return {'p_half_start': float(np.mean(low <= 0.5)), 'p_dd50': float(np.mean(dd >= 0.5)), 'p_dd80': float(np.mean(dd >= 0.8)),
            'median_final': float(np.median(fin)), 'p5_final': float(np.percentile(fin, 5)), 'p95_final': float(np.percentile(fin, 95)),
            'median_dd': float(np.median(dd)), 'p_loss': float(np.mean(fin < 1.0)), 'mean_final': float(np.mean(fin))}
