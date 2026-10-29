"""Walk-forward backtest of the scanner's CURRENT BUY rules on real daily data (Alpaca, split-adjusted; dividends not adjusted, like the TradingView default chart).

    python tools/stock_scanner/backtest.py --offline                     # every cached ticker
    python tools/stock_scanner/backtest.py --tickers AAPL,MSFT --workers 4
    python tools/stock_scanner/backtest.py --years 8 --limit 200 --budget-min 240
    python tools/stock_scanner/backtest.py --fixture                     # synthetic tickers (code path check only)

What it tests: the live rules, unchanged. Every evaluation calls scan.analyse() + scan.symbol_signals(), the exact
functions the daily scan uses (W1 / MN / 3M zones, the owner's top-down nesting, the ATH curve rule, the 250%
projection target, stops W1 5% / MN 3% / 3M 2% of the zone height beyond the distal).

No look-ahead: on an evaluation day d the analysis sees the daily bars up to and including d and only the W1 / MN
(3M / 6M built from closed months) candles that had CLOSED by d. A zone exists only once its stay-away candle closed.

Cadence: weekly. The rules run on the last session of each week (the owner checks once a week). A BUY places a limit
at the proximal from the next session: filled only when the price trades THROUGH it (low < entry), at the entry or at
the open on a gap down. The order is cancelled if the price reaches the target first, closes below the distal, or
after 40 sessions. Exits, both with the stop + target in the market:
  wick  - a low at / below the stop exits at the stop; an open below the stop exits at that open (gap)
  close - only a daily close at / below the stop exits, at that close
Same bar stop + target = the stop (stop first); the fill bar never takes the target. Time exit at the close of the
last session within 52 weeks of the fill. Trades still running when the data ends are reported, not scored.
Costs: --cost-bps (spread) + --slip-bps (slippage) per side. One position per ticker at a time (per variant).

Ablations (same walk-forward, one rule switched off): current, no_nesting (the top-down location rule ignored),
no_ath (the owner's ATH curve exception off: the Raja curve rule as before e49a158). The old D1 / W1 rules cannot be
selected any more (D1 zones were removed from scan.analyse in da14866) and are reported as not run.
Baselines: a random entry (seeded) on the same ticker with the same stop / target distances in %, and SPY buy-and-hold
over the same period and over each trade's own holding window.
"""
from __future__ import annotations

import argparse
import bisect
import contextlib
import csv
import dataclasses
import datetime as dt
import json
import os
import random
import sys
import time
from collections import defaultdict
from multiprocessing import Pool
from typing import Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)

import data as DATA  # noqa: E402
import scan  # noqa: E402
import zones as Z  # noqa: E402
from zones import RAJA, Bar  # noqa: E402

EXTRA_FIELDS = ('seiden_score', 'fv_dist_atr', 'fv_inside', 'index_aligned', 'index_state', 'pz1', 'pz2', 'rr_pz1', 'rr_pz2')
WARMUP = 300          # D1 bars before the first evaluation day
MAX_EVALS = 10        # weekly evaluations per zone
ORDER_LIFE = 40       # sessions a limit order lives
HOLD_DAYS = 364       # 52 weeks in a trade at most
OOS_FRAC = 0.30       # the newest 30% of signal dates = out of sample
VARIANTS = ('current', 'no_nesting', 'no_ath')
LEGACY_NOTE = 'not run: the old D1 / W1 rules are no longer selectable (D1 zones and the D1 direction were removed from scan.analyse in da14866)'
RANDOM_K = 3          # random entries per real trade
NESTED = ('inside', 'top')


def htf_index(bars: List[Bar], tf: str):
    """For each daily index d: the closed W1 / MN bars as of d (list prefix length) + the aggregated bars. A bucket
    counts as closed on its last session (the next session starts a new bucket, or the calendar says so)."""
    agg: List[Bar] = []
    last_idx: List[int] = []
    key = (lambda d: d.isocalendar()[:2]) if tf == 'W1' else (lambda d: Z.period_key(tf, d.isoformat()))
    cur = None
    for i, b in enumerate(bars):
        k = key(dt.date.fromisoformat(b.d))
        if cur != k:
            agg.append(Bar(b.d, b.o, b.h, b.l, b.c, b.v))
            last_idx.append(i)
            cur = k
        else:
            x = agg[-1]
            x.h, x.l, x.c, x.v = max(x.h, b.h), min(x.l, b.l), b.c, x.v + b.v
            last_idx[-1] = i
    closed_upto = [0] * len(bars)
    j = 0
    for d in range(len(bars)):
        while j < len(agg) and (last_idx[j] < d or (last_idx[j] == d and (d + 1 < len(bars) or _calendar_complete(bars[d].d, key)))):
            j += 1
        closed_upto[d] = j
    return agg, closed_upto


def _calendar_complete(d: str, key) -> bool:
    x = dt.date.fromisoformat(d)
    return key(DATA._next_business_day(x)) != key(x)


def week_ends(bars: List[Bar]) -> set:
    """Daily indexes that are the last session of their ISO week (the weekly evaluation days)."""
    wk = lambda b: dt.date.fromisoformat(b.d).isocalendar()[:2]  # noqa: E731
    n = len(bars)
    out = {d for d in range(n - 1) if wk(bars[d + 1]) != wk(bars[d])}
    if n and _calendar_complete(bars[-1].d, lambda x: x.isocalendar()[:2]):
        out.add(n - 1)
    return out


MIN_HTF = {'W1': 60, 'MN': 40, '3M': 20}


def candidates(bars: List[Bar], tfs=None) -> Dict[int, List[str]]:
    """Cheap pre-filter: days where some W1 / MN / 3M demand zone (found on the whole history, known by that day, not
    yet removed or tested by then) is within the approach distance under the daily close. analyse() then decides
    for real on the bars known that day (the pre-filter only skips days that cannot give a BUY)."""
    out: Dict[int, List[str]] = defaultdict(list)
    for tf in tuple(tfs or scan.TRADE_TFS):
        _htf_candidates(bars, tf, out)
    return out


def _htf_candidates(bars: List[Bar], tf: str, out) -> None:
    n = len(bars)
    w1, upto = htf_index(bars, tf)
    if len(w1) > MIN_HTF.get(tf, 20):
        Sw = Z.Series(w1, w1[-1].c, tf)
        nw = len(w1)
        pw = dict(RAJA, lookback=nw)
        first_day = {}
        for d in range(n):
            first_day.setdefault(upto[d], d)
        for z in Z.detect(Sw, pw):
            if z.dir < 0:
                continue
            sa_w = nw - z.sa_bar
            dead_w = min(nw - z.removed_bar if z.removed else nw + 1, nw - z.tested_bar if z.tested else nw + 1)
            for d in range(first_day.get(sa_w + 1, n), n):
                if upto[d] - 1 >= dead_w or upto[d] - (nw - z.leg_bar) > RAJA['max_zone_age']:
                    break
                c = bars[d].c
                if d >= WARMUP and z.dist < c and c - z.prox <= max(scan.APPROACH_H * z.h, scan.APPROACH_PCT * c):
                    out[d].append(z.zid)


_IDX_MEMO: Dict[str, Optional[Dict]] = {}


def index_at(index_bars: List[Bar], day: str) -> Optional[Dict]:
    """The composite index's gauge as of `day` (its bars up to and including that day only)."""
    if day not in _IDX_MEMO:
        upto = [b for b in index_bars if b.d <= day]
        g = scan.index_context(upto) if len(upto) >= 250 else None
        _IDX_MEMO[day] = {k: v for k, v in g.items() if k != 'bars'} if g else None
    return _IDX_MEMO[day]


_COMPOSITE: List[Optional[List[Bar]]] = []


def composite_cached(offline: bool) -> Optional[List[Bar]]:
    if not _COMPOSITE:
        try:
            _COMPOSITE.append(scan.composite_bars({k: DATA.fetch_daily(k, offline=offline)[0] for k in scan.INDEX_PARTS}) or None)
        except Exception:  # noqa: BLE001
            _COMPOSITE.append(None)
    return _COMPOSITE[0]


# ---- ablations: one live rule switched off for the duration of an evaluation ----------------------------------------
@contextlib.contextmanager
def rule_variant(variant: str):
    """current = the live rules untouched; no_nesting = the top-down location never blocks (its code is kept, so
    trades can be split by nesting status); no_ath = the owner's ATH curve exception off (direction + curve rule)."""
    saved = []
    if variant == 'no_ath':
        saved.append((Z, 'ath_curve_ok', Z.ath_curve_ok))
        Z.ath_curve_ok = lambda *a, **k: False
    elif variant == 'no_nesting':
        orig = scan.loc_of

        def loose(an, z):
            lc = orig(an, z)
            return lc if lc.ok else dataclasses.replace(lc, ok=True, text='nesting rule off: ' + lc.text)
        saved.append((scan, 'loc_of', orig))
        scan.loc_of = loose
    elif variant != 'current':
        raise ValueError(f'unknown variant {variant}')
    try:
        yield
    finally:
        for mod, name, fn in saved:
            setattr(mod, name, fn)


# ---- order + exit simulation ----------------------------------------------------------------------------------------
def _hold_end(bars: List[Bar], fill_i: int, days: int = HOLD_DAYS) -> int:
    """First index after the holding window (the sessions within `days` calendar days of the fill)."""
    last = (dt.date.fromisoformat(bars[fill_i].d) + dt.timedelta(days=days)).isoformat()
    j = fill_i
    while j < len(bars) and bars[j].d <= last:
        j += 1
    return j


def run_exit(bars: List[Bar], fill_i: int, fill: float, stop: float, target: float, variant: str = 'wick',
             hold_days: int = HOLD_DAYS) -> Tuple[int, float, str, bool]:
    """(exit index, exit price, why, gap) from the fill bar on. Stop before target on the same bar; the fill bar can
    stop out but never takes the target; an open beyond the stop (or the target) exits at that open."""
    n = len(bars)
    end = _hold_end(bars, fill_i, hold_days)
    for i in range(fill_i, end):
        b = bars[i]
        if variant == 'wick':
            if i == fill_i:
                if fill <= stop:
                    return i, fill, 'stop', True              # filled at an open already below the stop
                if b.l <= stop:
                    return i, stop, 'stop', False
                continue
            if b.o <= stop:
                return i, b.o, 'stop', True
            if b.l <= stop:
                return i, stop, 'stop', False
        elif b.c <= stop:
            return i, b.c, 'stop', b.o <= stop
        if i > fill_i:
            if b.o >= target:
                return i, b.o, 'target', False
            if b.h >= target:
                return i, target, 'target', False
    i = end - 1
    still = end >= n and bars[-1].d < (dt.date.fromisoformat(bars[fill_i].d) + dt.timedelta(days=hold_days)).isoformat()
    return i, bars[i].c, 'open' if still else 'time', False


def _score_exit(res: Dict, bars: List[Bar], fill_i: int, fill: float, risk: float, cost_side: float,
                ex_i: int, ex: float, why: str, gap: bool, v: str) -> None:
    res[f'{v}_exit_date'] = bars[ex_i].d
    res[f'{v}_exit'] = round(ex, 4)
    res[f'{v}_why'] = why
    res[f'{v}_gap'] = gap
    res[f'{v}_r'] = round((ex - fill) / risk - 2 * cost_side * fill / risk, 4)
    res[f'{v}_ret'] = round(((ex - fill) / fill - 2 * cost_side) * 100, 3)
    res[f'{v}_bars'] = ex_i - fill_i
    res[f'{v}_weeks'] = round((dt.date.fromisoformat(bars[ex_i].d) - dt.date.fromisoformat(bars[fill_i].d)).days / 7, 2)


def simulate(bars: List[Bar], d: int, sig: Dict, cost_bps: float, slip_bps: float = 0.0) -> Optional[Dict]:
    """Limit order at the proximal from d+1, then both stop variants. None = no valid plan."""
    entry, stop, target = sig['entry'], sig['stop'], sig['target']
    risk = entry - stop
    if risk <= 0 or not target or target <= entry:
        return None
    n = len(bars)
    fill_i, fill = -1, 0.0
    for i in range(d + 1, min(n, d + 1 + ORDER_LIFE)):
        b = bars[i]
        if b.h >= target and b.l >= entry:         # ran to the target without us: remove the order
            return {'status': 'cancelled_target', 'cancel_date': b.d}
        if b.l < entry:                            # traded through the limit (a touch is not a fill)
            fill_i, fill = i, min(entry, b.o)
            break
        if b.c < sig['distal']:
            return {'status': 'cancelled_removed', 'cancel_date': b.d}
    if fill_i < 0:
        return {'status': 'expired' if d + ORDER_LIFE < n else 'pending'}
    cost_side = (cost_bps + slip_bps) / 1e4
    res = {'status': 'filled', 'fill_date': bars[fill_i].d, 'fill': round(fill, 4), 'gap_fill': fill < entry - 1e-9}
    for v in ('wick', 'close'):
        ex_i, ex, why, gap = run_exit(bars, fill_i, fill, stop, target, v)
        _score_exit(res, bars, fill_i, fill, risk, cost_side, ex_i, ex, why, gap, v)
        if v == 'wick':
            hi = max((bars[i].h for i in range(fill_i + 1, ex_i)), default=0.0)
            for k in ('pz1', 'pz2'):
                pv = sig.get(k)
                res[f'{k}_hit'] = bool(pv) and (hi >= pv or (why == 'target' and ex >= pv))
            pz1 = sig.get('pz1')
            res['half_pz1_r'] = (round(0.5 * ((pz1 - fill) / risk - 2 * cost_side * fill / risk) + 0.5 * res['wick_r'], 4)
                                 if pz1 and res['pz1_hit'] else res['wick_r'])
    return res


def random_entries(sym: str, bars: List[Bar], t: Dict, days: List[int], cost_bps: float, slip_bps: float = 0.0,
                   k: int = RANDOM_K, seed: int = 7) -> List[Dict]:
    """Baseline: k random weekly evaluation days on the same ticker (seeded by symbol + signal date), bought at the
    next open with the real trade's stop and target distances in % of the entry. Same exit engine and costs."""
    if not days or t.get('status') != 'filled':
        return []
    sp = (t['entry'] - t['stop']) / t['entry']
    tp = (t['target'] - t['entry']) / t['entry']
    rnd = random.Random(f"{seed}|{sym}|{t['signal_date']}")
    cost_side = (cost_bps + slip_bps) / 1e4
    out = []
    for j in range(k):
        d = days[rnd.randrange(len(days))]
        if d + 1 >= len(bars):
            continue
        fill_i = d + 1
        fill = bars[fill_i].o
        stop, target = fill * (1 - sp), fill * (1 + tp)
        res = {'variant': 'random', 'symbol': sym, 'signal_date': bars[d].d, 'status': 'filled', 'fill_date': bars[fill_i].d,
               'fill': round(fill, 4), 'tf': t.get('tf'), 'of_signal': t['signal_date'], 'draw': j}
        for v in ('wick', 'close'):
            ex_i, ex, why, gap = run_exit(bars, fill_i, fill, stop, target, v)
            _score_exit(res, bars, fill_i, fill, fill - stop, cost_side, ex_i, ex, why, gap, v)
        out.append(res)
    return out


def backtest_ticker(sym: str, bars: List[Bar], sector: str = '', filings: Optional[List[str]] = None, cost_bps: float = 5.0,
                    indexes: str = 'SPX', index_bars: Optional[List[Bar]] = None, variants=('current',), start: str = '',
                    slip_bps: float = 0.0, random_k: int = RANDOM_K, seed: int = 7) -> List[Dict]:
    """Every BUY of one ticker per variant, evaluated weekly. Trades carry 'variant'; random baseline rows too."""
    if len(bars) < WARMUP + 50:
        return []
    w1, w_upto = htf_index(bars, 'W1')
    mn, m_upto = htf_index(bars, 'MN')
    cand = candidates(bars)
    ends = week_ends(bars)
    eval_days = sorted(d for d in ends if d >= WARMUP and bars[d].d >= start)
    st = {v: {'evals': defaultdict(int), 'done': set(), 'busy': -1} for v in variants}
    cache: dict = {}
    trades = []
    for d in sorted(cand):
        if d not in ends or bars[d].d < start:
            continue
        ans: Dict[str, scan.Analysis] = {}
        for v in variants:
            S = st[v]
            zids = [z for z in cand[d] if z not in S['done'] and S['evals'][z] < MAX_EVALS]
            if not zids or d <= S['busy']:
                continue
            for z in zids:
                S['evals'][z] += 1
            akey = 'no_ath' if v == 'no_ath' else 'base'
            with rule_variant(v):
                if akey not in ans:
                    an = scan.analyse(bars[:d + 1], w1[:w_upto[d]], mn[:m_upto[d]], row_cache=cache)
                    an.index = index_at(index_bars, bars[d].d) if index_bars else None
                    ans[akey] = an
                sigs = scan.symbol_signals(ans[akey], None)
            for s in sigs:
                zid = f"{s['tf']}:D:{s['base_start']}"
                if s['kind'] != 'BUY' or zid in S['done']:
                    continue
                S['done'].add(zid)
                sim = simulate(bars, d, s, cost_bps, slip_bps)
                if sim is None:
                    continue
                t = {'variant': v, 'symbol': sym, 'sector': sector, 'indexes': indexes, 'signal_date': bars[d].d, 'tf': s['tf'],
                     'zone_type': s['zone_type'], 'pattern': s['pattern'], 'entry': s['entry'], 'stop': s['stop'],
                     'target': s['target'], 'target_kind': s.get('target_kind'), 'rr': s['rr'], 'curve': s['curve'],
                     'direction': s['direction'], 'to_entry_pct': s['to_entry_pct'], 'score': s.get('score'),
                     'loc': s.get('loc'), 'nested': s.get('loc') in NESTED, **{k: s.get(k) for k in EXTRA_FIELDS}, **sim}
                if sim['status'] == 'filled' and filings:
                    end = t.get('close_exit_date') or t['fill_date']
                    t['filing'] = any(t['fill_date'] <= f <= end for f in filings)
                trades.append(t)
                if sim['status'] == 'filled':
                    last = max(t['wick_exit_date'], t['close_exit_date'])
                    S['busy'] = max(S['busy'], next((i for i in range(d, len(bars)) if bars[i].d >= last), d))
                    if v == 'current' and random_k:
                        trades += random_entries(sym, bars, t, eval_days, cost_bps, slip_bps, random_k, seed)
                break
    return trades


def _worker(args):
    sym, sector, offline, cost, indexes, variants, start, slip, random_k = args
    try:
        bars, _ = DATA.fetch_daily(sym, offline=offline)
    except Exception as e:  # noqa: BLE001
        return sym, [], str(e)
    filings = None
    try:
        import fundamentals as F
        import universe as U
        cik = next((u['cik'] for u in U.load(indexes=U.INDEXES) if u['symbol'] == sym), '')
        b, _ = F.cached_base(cik)
        filings = (b or {}).get('filings') or None
    except Exception:  # noqa: BLE001
        filings = None
    try:
        return sym, backtest_ticker(sym, bars, sector, filings, cost, indexes, composite_cached(offline), variants, start, slip, random_k), ''
    except Exception as e:  # noqa: BLE001
        return sym, [], f'backtest error: {e!r}'


# ---- statistics ---------------------------------------------------------------------------------------------------
def bootstrap_ci(xs: List[float], n: int = 2000, seed: int = 7) -> Tuple[Optional[float], Optional[float]]:
    if len(xs) < 2:
        return None, None
    rnd = random.Random(seed)
    m = len(xs)
    means = sorted(sum(xs[rnd.randrange(m)] for _ in range(m)) / m for _ in range(n))
    return means[int(0.025 * n)], means[int(0.975 * n) - 1]


def max_drawdown(rs: List[float]) -> float:
    peak = cum = dd = 0.0
    for r in rs:
        cum += r
        peak = max(peak, cum)
        dd = max(dd, peak - cum)
    return dd


def losing_streak(rs: List[float]) -> int:
    best = cur = 0
    for r in rs:
        cur = cur + 1 if r < 0 else 0
        best = max(best, cur)
    return best


def stats(rs: List[float]) -> Dict:
    if not rs:
        return {'trades': 0}
    w = [r for r in rs if r > 0]
    lo, hi = bootstrap_ci(rs)
    gl = -sum(r for r in rs if r < 0)
    return {'trades': len(rs), 'win_rate': round(len(w) / len(rs), 3), 'avg_r': round(sum(rs) / len(rs), 3),
            'expectancy_ci95': [round(lo, 3), round(hi, 3)] if lo is not None else None,
            'profit_factor': round(sum(w) / gl, 2) if gl > 0 else None, 'total_r': round(sum(rs), 1)}


def metrics(trades: List[Dict], v: str) -> Dict:
    """stats() of the R multiples + per-trade % return, its annualised form, holding weeks, the max drawdown in R
    and the longest losing streak (both in exit-date order)."""
    tt = sorted(trades, key=lambda t: (t.get(f'{v}_exit_date') or '', t.get('symbol', '')))
    rs = [t[f'{v}_r'] for t in tt]
    out = stats(rs)
    if not rs:
        return out
    rets = [t[f'{v}_ret'] for t in tt if t.get(f'{v}_ret') is not None]
    wk = [t[f'{v}_weeks'] for t in tt if t.get(f'{v}_weeks') is not None]
    out['max_dd_r'] = round(max_drawdown(rs), 1)
    out['losing_streak'] = losing_streak(rs)
    if rets:
        m = sum(rets) / len(rets)
        out['avg_ret_pct'] = round(m, 2)
        if wk:
            aw = sum(wk) / len(wk)
            out['avg_weeks'] = round(aw, 1)
            out['annualised_pct'] = round(((1 + m / 100) ** (52 / max(aw, 1)) - 1) * 100, 1) if m > -100 else None
    out['why'] = {k: sum(1 for t in tt if t.get(f'{v}_why') == k) for k in ('target', 'stop', 'time')}
    return out


def score_bucket(t: Dict) -> str:
    s = t.get('score')
    return '?' if s is None else ('9-10' if s >= 9 else '7-8' if s >= 7 else '<=6')


EXTRA_BUCKETS = [
    ('seiden_score', lambda t: '>=8' if (t.get('seiden_score') or 0) >= 8 else '<8'),
    ('fv_inside', lambda t: 'inside FV' if t.get('fv_inside') else 'outside FV'),
    ('fv_1atr_below', lambda t: '>=1 ATR below FV' if (t.get('fv_dist_atr') or -9) >= 1 else '<1 ATR'),
    ('index_aligned', lambda t: 'aligned' if t.get('index_aligned') else ('index in supply' if t.get('index_state') == 'supply' else 'not aligned')),
]
SPLITS = [('tf', lambda t: t.get('tf') or '?'), ('zone_type', lambda t: t.get('zone_type') or '?'),
          ('sector', lambda t: t.get('sector') or '?'), ('score', score_bucket),
          ('nesting', lambda t: t.get('loc') or '?'), ('target_kind', lambda t: t.get('target_kind') or '?')]


def _scored(trades: List[Dict], v: str) -> List[Dict]:
    return [t for t in trades if t.get('status') == 'filled' and t.get(f'{v}_why') != 'open' and f'{v}_r' in t]


def _counts(trades: List[Dict]) -> Dict:
    filled = [t for t in trades if t.get('status') == 'filled']
    decided = [t for t in trades if t.get('status') != 'pending']
    return {'signals': len(trades), 'filled': len(filled),
            'fill_rate': round(len(filled) / len(decided), 3) if decided else None,
            'not_filled': {k: sum(1 for t in trades if t.get('status') == k) for k in ('expired', 'cancelled_target', 'cancelled_removed', 'pending')},
            'still_open': sum(1 for t in filled if t.get('wick_why') == 'open')}


def _split_date(trades: List[Dict]) -> str:
    dates = sorted(t['signal_date'] for t in trades if t.get('status') == 'filled')
    if not dates:
        return ''
    return dates[int(len(dates) * (1 - OOS_FRAC))] if len(dates) > 3 else dates[-1]


def _is_oos(trades: List[Dict], v: str, split: str) -> Dict:
    sc = _scored(trades, v)
    return {'all': metrics(sc, v), 'in_sample': metrics([t for t in sc if t['signal_date'] < split], v),
            'out_of_sample': metrics([t for t in sc if t['signal_date'] >= split], v)}


def spy_window_returns(trades: List[Dict], spy: List[Bar], v: str = 'wick') -> Dict:
    """SPY's % return over each trade's own fill -> exit window (close to close) and the share of trades beating it."""
    if not spy:
        return {}
    ds = [b.d for b in spy]

    def close_on(d: str) -> Optional[float]:
        i = bisect.bisect_right(ds, d) - 1
        return spy[i].c if i >= 0 else None
    rows = []
    for t in _scored(trades, v):
        a, b = close_on(t['fill_date']), close_on(t[f'{v}_exit_date'])
        if a and b:
            rows.append((t[f'{v}_ret'], (b / a - 1) * 100))
    if not rows:
        return {}
    return {'trades': len(rows), 'avg_trade_ret_pct': round(sum(r for r, _ in rows) / len(rows), 2),
            'avg_spy_same_window_pct': round(sum(s for _, s in rows) / len(rows), 2),
            'beat_spy_share': round(sum(1 for r, s in rows if r > s) / len(rows), 3)}


def spy_buy_hold(spy: List[Bar], start: str, end: str) -> Dict:
    b = [x for x in spy if start <= x.d <= end]
    if len(b) < 2:
        return {}
    yrs = max((dt.date.fromisoformat(b[-1].d) - dt.date.fromisoformat(b[0].d)).days / 365.25, 1e-9)
    peak, dd = b[0].c, 0.0
    for x in b:
        peak = max(peak, x.c)
        dd = max(dd, 1 - x.c / peak)
    tot = b[-1].c / b[0].c
    return {'from': b[0].d, 'to': b[-1].d, 'total_pct': round((tot - 1) * 100, 1), 'cagr_pct': round((tot ** (1 / yrs) - 1) * 100, 1),
            'max_dd_pct': round(dd * 100, 1), 'note': 'SPY split-adjusted closes (dividends not included, same as the trades), no costs'}


def summarize(trades: List[Dict], spy: Optional[List[Bar]] = None) -> Dict:
    cur = [t for t in trades if t.get('variant', 'current') == 'current']
    out = _counts(cur)
    filled = [t for t in cur if t.get('status') == 'filled']
    if not filled:
        return out
    split = _split_date(cur)
    out['oos_from'] = split
    out['period'] = [min(t['signal_date'] for t in cur), max(t['signal_date'] for t in cur)]
    for v in ('wick', 'close'):
        sc = _scored(cur, v)
        key = f'{v}_r'
        block = {**_is_oos(cur, v, split),
                 'gap_through_stop': sum(1 for t in sc if t.get(f'{v}_gap')),
                 'holding_through_filing': sum(1 for t in sc if t.get('filing'))}
        for dim, fn in SPLITS:
            g = defaultdict(list)
            for t in sc:
                g[fn(t)].append(t)
            block[f'by_{dim}'] = {k: metrics(x, v) for k, x in sorted(g.items())}
        gi = defaultdict(list)                                       # a trade counts for every index the ticker is in
        for t in sc:
            for i in (t.get('indexes') or '?').split(','):
                gi[i].append(t)
        block['by_universe'] = {k: metrics(x, v) for k, x in sorted(gi.items())}
        bx = {}
        for name, fn in EXTRA_BUCKETS:
            g2 = defaultdict(list)
            for t in sc:
                g2[(fn(t), 'oos' if t['signal_date'] >= split else 'is')].append(t[key])
            bx[name] = {f'{b}|{part}': stats(x) for (b, part), x in sorted(g2.items())}
        block['by_extra'] = bx
        if v == 'wick':
            block['half_at_pz1'] = {'all': stats([t.get('half_pz1_r', t[key]) for t in sc]),
                                    'out_of_sample': stats([t.get('half_pz1_r', t[key]) for t in sc if t['signal_date'] >= split])}
            block['pz_hit_rate'] = {k: round(sum(1 for t in sc if t.get(f'{k}_hit')) / max(1, sum(1 for t in sc if t.get(k))), 3) for k in ('pz1', 'pz2')}
        if spy:
            block['vs_spy_same_window'] = spy_window_returns(cur, spy, v)
        out[v] = block
    ab = {}
    for name in VARIANTS[1:]:
        tv = [t for t in trades if t.get('variant') == name]
        if tv:
            ab[name] = {**_counts(tv), **{v: _is_oos(tv, v, split) for v in ('wick', 'close')}}
            if name == 'no_nesting':
                for v in ('wick', 'close'):
                    sc = _scored(tv, v)
                    ab[name][v]['by_nested'] = {'nested (would pass)': metrics([t for t in sc if t.get('nested')], v),
                                                'not nested (blocked live)': metrics([t for t in sc if not t.get('nested')], v)}
    ab['old_d1_w1'] = {'note': LEGACY_NOTE}
    out['ablations'] = ab
    rnd = [t for t in trades if t.get('variant') == 'random']
    if rnd:
        out['random_baseline'] = {'entries': len(rnd), 'per_trade': RANDOM_K,
                                  'note': 'random weekly day on the same ticker, next-open entry, same stop / target % and exit rules',
                                  **{v: _is_oos(rnd, v, split) for v in ('wick', 'close')}}
        for v in ('wick', 'close'):
            a, b = out[v]['all'].get('avg_r'), out['random_baseline'][v]['all'].get('avg_r')
            out['random_baseline'][v]['edge_r_vs_random'] = round(a - b, 3) if a is not None and b is not None else None
    if spy:
        out['benchmark_spy'] = spy_buy_hold(spy, out['period'][0], spy[-1].d)
    return out


def verdict(summary: Dict) -> str:
    """One honest line: trust needs a positive out-of-sample expectancy whose 95% CI stays above zero (live plan =
    the wick stop in the market), and an edge over random entries with the same geometry."""
    mode = 'wick' if 'wick' in summary else 'close'
    c = summary.get(mode, {}).get('out_of_sample', {})
    if not c or c.get('trades', 0) < 30:
        return 'NOT ENOUGH TRADES out of sample to judge (need 30+). Do not trust the scanner yet.'
    ci = c.get('expectancy_ci95') or [0, 0]
    edge = (summary.get('random_baseline') or {}).get(mode, {}).get('edge_r_vs_random')
    tail = '' if edge is None else f" Edge over random entries {edge:+.2f}R per trade."
    if ci[0] > 0:
        return (f"Out-of-sample expectancy {c['avg_r']:+.2f}R (95% CI {ci[0]:+.2f} to {ci[1]:+.2f}) on {c['trades']} trades: "
                f"positive. Still forward-test small.{tail}")
    return (f"Out-of-sample expectancy {c['avg_r']:+.2f}R (95% CI {ci[0]:+.2f} to {ci[1]:+.2f}) on {c['trades']} trades: "
            f"NOT proven. Do not trust the scanner with real size.{tail}")


# ---- output -------------------------------------------------------------------------------------------------------
LITE = ('symbol', 'signal_date', 'tf', 'zone_type', 'score', 'loc', 'entry', 'stop', 'target', 'target_kind', 'rr', 'status',
        'fill_date', 'fill', 'wick_exit_date', 'wick_why', 'wick_r', 'wick_ret', 'close_why', 'close_r')


def write(trades: List[Dict], summary: Dict, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    cols = sorted({k for t in trades for k in t}, key=lambda k: (k not in ('variant', 'symbol', 'signal_date', 'tf', 'zone_type', 'status'), k))
    with open(os.path.join(out_dir, 'trades.csv'), 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(trades)
    with open(os.path.join(out_dir, 'summary.json'), 'w') as f:
        json.dump({**summary, 'verdict': verdict(summary)}, f, indent=1)


def public_json(trades: List[Dict], summary: Dict, params: Dict, n_recent: int = 150) -> Dict:
    cur = [t for t in trades if t.get('variant', 'current') == 'current' and t.get('status') == 'filled']
    cur.sort(key=lambda t: t['signal_date'], reverse=True)
    return {'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%MZ'), 'params': params, 'verdict': verdict(summary),
            'summary': summary, 'recent_trades': [{k: t.get(k) for k in LITE} for t in cur[:n_recent]],
            'disclaimer': 'Backtest on adjusted daily data; past results do not predict future results. Not financial advice.'}


def _fmt(x, nd=2, pct=False, sign=False):
    if x is None:
        return 'n/a'
    if isinstance(x, (int,)) and not pct:
        return str(x)
    s = f'{x:+.{nd}f}' if sign else f'{x:.{nd}f}'
    return s + ('%' if pct else '')


def _row(name: str, m: Dict) -> str:
    if not m or not m.get('trades'):
        return f'| {name} | 0 | | | | | | | | | |'
    ci = m.get('expectancy_ci95') or [None, None]
    return (f"| {name} | {m['trades']} | {_fmt(m.get('win_rate', 0) * 100, 1)}% | {_fmt(m.get('avg_r'), sign=True)} | "
            f"{_fmt(ci[0], sign=True)} to {_fmt(ci[1], sign=True)} | {_fmt(m.get('profit_factor'))} | "
            f"{_fmt(m.get('avg_ret_pct'), sign=True, pct=True)} | {_fmt(m.get('annualised_pct'), 1, pct=True)} | "
            f"{_fmt(m.get('avg_weeks'), 1)} | {_fmt(m.get('max_dd_r'), 1)} | {m.get('losing_streak', 'n/a')} |")


HDR = ('| | Trades | Win | Avg R | 95% CI (R) | PF | Avg trade | Annualised | Weeks | Max DD (R) | Losing streak |\n'
       '|---|---|---|---|---|---|---|---|---|---|---|')


def render_md(summary: Dict, params: Dict) -> str:
    s = summary
    L = ['# Stock scanner backtest (real data, walk-forward)', '',
         f"Generated {dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M')} UTC by `.github/workflows/stock-backtest.yml` "
         f"(`tools/stock_scanner/backtest.py`). Tickers {params.get('tickers_done')} of {params.get('tickers_asked')}"
         + (' (time budget reached: PARTIAL run)' if params.get('partial') else '') + '.', '',
         f"**Verdict:** {verdict(s)}", '']
    if params.get('fixture'):
        L += ['> SYNTHETIC FIXTURE RUN: checks the code path only, says nothing about real stocks.', '']
    L += [
         '## What was tested', '',
         '- The live rules unchanged: `scan.analyse()` + `scan.symbol_signals()` (W1 / MN / 3M zones, top-down nesting, '
         'owner ATH curve rule, 250% projection target, stops W1 5% / MN 3% / 3M 2% of the zone height).',
         '- Walk-forward, no look-ahead: each evaluation sees daily bars up to that day and only CLOSED W1 / MN / 3M candles.',
         '- Weekly cadence (last session of each week). Limit at the proximal, filled only when traded through '
         '(at the open on a gap down); cancelled on target-first, a close below the distal or after 40 sessions.',
         '- Exits: target, stop (stop first on the same bar; an open below the stop exits at that open), or time after 52 weeks. '
         'Trades still running at the data end are not scored.',
         f"- Costs {params.get('cost_bps')} bps spread + {params.get('slip_bps')} bps slippage per side. "
         'Split-adjusted prices (Alpaca adjustment=split, the TradingView default chart): dividends are NOT in the returns.',
         f"- Period: signals {(s.get('period') or ['?', '?'])[0]} to {(s.get('period') or ['?', '?'])[1]}; "
         f"out of sample = signals from {s.get('oos_from', '?')} (newest 30%).", '',
         '"wick" = stop order in the market (the live plan). "close" = exit only on a daily close below the stop.', '',
         '## Orders', '',
         f"Signals {s.get('signals')}, filled {s.get('filled')} (fill rate {_fmt((s.get('fill_rate') or 0) * 100, 1)}%), "
         f"not filled {s.get('not_filled')}, still open {s.get('still_open')}.", '']
    for v in ('wick', 'close'):
        b = s.get(v)
        if not b:
            continue
        L += [f'## Current rules, {v} stop', '', HDR, _row('All', b['all']), _row('In sample', b['in_sample']),
              _row('Out of sample', b['out_of_sample']), '',
              f"Gap through the stop: {b.get('gap_through_stop')}; holding through a 10-Q / 10-K: {b.get('holding_through_filing')}.", '']
        if b.get('vs_spy_same_window'):
            x = b['vs_spy_same_window']
            L += [f"Same holding windows in SPY: trades avg {_fmt(x.get('avg_trade_ret_pct'), sign=True, pct=True)} vs SPY "
                  f"{_fmt(x.get('avg_spy_same_window_pct'), sign=True, pct=True)}; trades beating SPY {_fmt(x.get('beat_spy_share', 0) * 100, 1)}%.", '']
        if v == 'wick':
            for dim, title in (('universe', 'index'), ('tf', 'entry timeframe'), ('zone_type', 'zone type'), ('score', 'Raja score'),
                               ('nesting', 'nesting status'), ('target_kind', 'target kind'), ('sector', 'sector')):
                L += [f'### By {title}', '', HDR] + [_row(k, m) for k, m in b.get(f'by_{dim}', {}).items()] + ['']
    ab = s.get('ablations') or {}
    if ab:
        L += ['## Ablations (wick stop)', '', HDR, _row('current: all', (s.get('wick') or {}).get('all')),
              _row('current: out of sample', (s.get('wick') or {}).get('out_of_sample'))]
        for name in VARIANTS[1:]:
            if name in ab:
                L += [_row(f'{name}: all', ab[name]['wick']['all']), _row(f'{name}: out of sample', ab[name]['wick']['out_of_sample'])]
        if 'no_nesting' in ab:
            for k, m in ab['no_nesting']['wick'].get('by_nested', {}).items():
                L.append(_row(f'no_nesting, {k}', m))
        L += ['', f"Old D1 / W1 rules: {ab.get('old_d1_w1', {}).get('note', LEGACY_NOTE)}.", '']
    rb = s.get('random_baseline')
    if rb:
        L += ['## Random-entry baseline (same stop / target geometry)', '', rb['note'] + f" ({rb['per_trade']} draws per trade, seeded).", '',
              HDR, _row('random: all', rb['wick']['all']), _row('random: out of sample', rb['wick']['out_of_sample']), '',
              f"Edge of the zones over random entries: {_fmt(rb['wick'].get('edge_r_vs_random'), sign=True)}R per trade (wick), "
              f"{_fmt(rb['close'].get('edge_r_vs_random'), sign=True)}R (close).", '']
    bm = s.get('benchmark_spy')
    if bm:
        L += ['## SPY buy and hold, same period', '',
              f"{bm['from']} to {bm['to']}: total {_fmt(bm['total_pct'], 1, pct=True)}, CAGR {_fmt(bm['cagr_pct'], 1, pct=True)}, "
              f"max drawdown {_fmt(bm['max_dd_pct'], 1, pct=True)} ({bm['note']}).", '']
    L += ['## How to read this', '',
          '- Avg R = expectancy per trade in units of the planned risk; trust needs the out-of-sample 95% CI above zero.',
          '- Win rate below 100% means losing signals exist: no rule set gives zero false signals. Plan the size so the '
          'losing streak and max drawdown above are survivable.',
          '- Annualised = the average trade return compounded over its average holding time; it is not a portfolio CAGR '
          '(positions overlap and cash sits idle between signals). Compare with SPY above.',
          '- Survivorship: the universe is today\'s index members, which flatters long-only results.', '']
    return '\n'.join(L)


def print_summary(s: Dict) -> None:
    print(f"signals {s['signals']}, filled {s['filled']} (fill rate {s.get('fill_rate')}), not filled {s['not_filled']}, still open {s.get('still_open')}")
    for v in ('wick', 'close'):
        if v not in s:
            continue
        b = s[v]
        print(f"\n[{v}-stop] all {b['all']}\n  in-sample {b['in_sample']}\n  out-of-sample (from {s['oos_from']}) {b['out_of_sample']}")
        print(f"  gap through stop: {b['gap_through_stop']}, holding through a filing: {b['holding_through_filing']}")
        if b.get('vs_spy_same_window'):
            print(f"  vs SPY same window: {b['vs_spy_same_window']}")
        for dim in ('universe', 'tf', 'zone_type', 'score', 'nesting'):
            print(f'  by {dim}: ' + '; '.join(f"{k} n={x['trades']} avg {x.get('avg_r', 0):+.2f}R" for k, x in b.get(f'by_{dim}', {}).items()))
    for name, a in (s.get('ablations') or {}).items():
        if 'wick' in a:
            print(f"\n[ablation {name}] filled {a['filled']}: wick all {a['wick']['all']}\n  wick OOS {a['wick']['out_of_sample']}")
        else:
            print(f"\n[ablation {name}] {a.get('note')}")
    if s.get('random_baseline'):
        rb = s['random_baseline']
        print(f"\n[random baseline] wick all {rb['wick']['all']}; edge {rb['wick'].get('edge_r_vs_random')}R")
    if s.get('benchmark_spy'):
        print(f"\n[SPY buy and hold] {s['benchmark_spy']}")
    print('\nVERDICT: ' + verdict(s))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--tickers')
    ap.add_argument('--limit', type=int, default=0, help='at most this many tickers (0 = all)')
    ap.add_argument('--years', type=float, default=0, help='only signals of the last N years (0 = the whole history after warm-up)')
    ap.add_argument('--universes', help='e.g. SPX,TSX (default env SCANNER_UNIVERSES or all)')
    ap.add_argument('--offline', action='store_true')
    ap.add_argument('--workers', type=int, default=max(1, (os.cpu_count() or 2) - 1))
    ap.add_argument('--cost-bps', type=float, default=5.0, help='spread cost per side, bps')
    ap.add_argument('--slip-bps', type=float, default=5.0, help='slippage per side, bps')
    ap.add_argument('--variants', default=','.join(VARIANTS), help=f'comma list of {VARIANTS}')
    ap.add_argument('--random-k', type=int, default=RANDOM_K, help='random baseline entries per real trade (0 = off)')
    ap.add_argument('--budget-min', type=float, default=0, help='stop starting tickers after N minutes and report what is done')
    ap.add_argument('--fixture', action='store_true', help='synthetic tickers (code-path check, says nothing about real stocks)')
    ap.add_argument('--out', default=os.path.join(HERE, 'backtest_out'))
    ap.add_argument('--public', help='also write the public JSON here (e.g. public/scanner/backtest.json)')
    ap.add_argument('--md', help='also write the Markdown report here (e.g. docs/research/Stock_Backtest.md)')
    a = ap.parse_args(argv)
    t0 = time.time()
    variants = tuple(v for v in (x.strip() for x in a.variants.split(',')) if v)
    if 'current' not in variants:
        variants = ('current',) + variants
    start = (dt.date.today() - dt.timedelta(days=int(a.years * 365.25))).isoformat() if a.years else ''
    trades: List[Dict] = []
    spy: List[Bar] = []
    asked = done = 0
    partial = False
    if a.fixture:
        sys.path.insert(0, os.path.join(HERE, 'fixtures'))
        import synth
        comp = scan.composite_bars({k: synth.ticker(s_) for k, s_ in zip(scan.INDEX_PARTS, (101, 102, 103, 104))})
        spy = synth.ticker(101)
        asked = done = a.limit or 12
        for seed in range(asked):
            trades += backtest_ticker(f'FX{seed}', synth.ticker(seed), 'Synthetic', None, a.cost_bps, ['SPX', 'NDX', 'DJI', 'TSX'][seed % 4],
                                      comp, variants, start, a.slip_bps, a.random_k)
    else:
        import universe as U
        if a.universes:
            os.environ['SCANNER_UNIVERSES'] = a.universes
        uni = U.load()
        if a.tickers:
            want = {t.strip().upper() for t in a.tickers.split(',') if t.strip()}
            uni = [u for u in uni if u['symbol'] in want]
        if a.limit:
            uni = uni[:a.limit]
        asked = len(uni)
        offline = a.offline
        if not offline:
            # one batched download into the cache (Alpaca multi-symbol requests), then every worker reads the cache
            syms = sorted({u['symbol'] for u in uni} | set(scan.INDEX_PARTS) | {'SPY'})
            DATA.set_budget(float(os.environ.get('SCANNER_BUDGET_MIN', '0') or 0) or None)
            DATA.fetch_many(syms, workers=6, offline=False, log=lambda m: print(m, file=sys.stderr),
                            tsx={u['symbol'] for u in uni if u.get('feed') == 'tsx'})
            offline = True
        try:
            spy = DATA.fetch_daily('SPY', offline=offline)[0]
        except Exception as e:  # noqa: BLE001
            print(f'SPY: {e}', file=sys.stderr)
        jobs = [(u['symbol'], u['sector'], offline, a.cost_bps, u.get('indexes') or 'SPX', variants, start, a.slip_bps, a.random_k)
                for u in uni]
        pool = Pool(a.workers)
        try:
            for k, (sym, ts, err) in enumerate(pool.imap_unordered(_worker, jobs)):
                done = k + 1
                if err:
                    print(f'{sym}: {err}', file=sys.stderr)
                trades += ts
                if done % 25 == 0:
                    print(f'{done}/{len(jobs)} tickers, {len(trades)} rows, {(time.time() - t0) / 60:.0f} min', file=sys.stderr, flush=True)
                if a.budget_min and time.time() - t0 > a.budget_min * 60 and done < len(jobs):
                    partial = True
                    print(f'time budget {a.budget_min} min reached after {done} tickers: reporting what is done', file=sys.stderr)
                    break
        finally:
            pool.terminate() if partial else pool.close()
            pool.join()
    s = summarize(trades, spy or None)
    params = {'variants': list(variants), 'years': a.years or None, 'start': start or None, 'cost_bps': a.cost_bps, 'slip_bps': a.slip_bps,
              'cadence': 'weekly', 'order_life_sessions': ORDER_LIFE, 'hold_weeks': 52, 'random_k': a.random_k,
              'tickers_asked': asked, 'tickers_done': done, 'partial': partial, 'fixture': a.fixture,
              'runtime_min': round((time.time() - t0) / 60, 1)}
    write(trades, s, a.out)
    if a.public:
        os.makedirs(os.path.dirname(os.path.abspath(a.public)), exist_ok=True)
        with open(a.public, 'w') as f:
            json.dump(public_json(trades, s, params), f, separators=(',', ':'))
    if a.md:
        os.makedirs(os.path.dirname(os.path.abspath(a.md)), exist_ok=True)
        with open(a.md, 'w') as f:
            f.write(render_md(s, params))
    print_summary(s)
    print(f"\n{done}/{asked} tickers in {params['runtime_min']} min -> {os.path.join(a.out, 'trades.csv')}, summary.json"
          + (f', {a.public}' if a.public else '') + (f', {a.md}' if a.md else ''))
    return 0


if __name__ == '__main__':
    sys.exit(main())
