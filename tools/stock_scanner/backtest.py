"""Walk-forward backtest of the BUY rules on the 10-year daily data. This decides whether to trust the scanner.

    python tools/stock_scanner/backtest.py --offline                 # every cached ticker
    python tools/stock_scanner/backtest.py --tickers AAPL,MSFT --workers 4
    python tools/stock_scanner/backtest.py --fixture                 # synthetic tickers (code path check only)

No look-ahead: on each candidate day d the scanner's own analyse() runs on the bars up to and including d (weekly /
monthly = buckets closed by d), exactly as the live scan would have seen them. A zone exists only once its stay-away
candle has closed. A BUY places a limit at the proximal from d+1: filled when the low reaches it (at the open on a
gap down). Cancelled if price reaches the target first (Kevin L10), the zone is removed by a close, or after 40
sessions. Exits: target (limit, at the open on a gap up), or the stop in two variants:
  wick  - a low at / below the stop exits at the stop (at the open if it gapped through)
  close - only a daily close at / below the stop exits, at that close (Raja: a break counts on a close)
Same bar stop + target = the stop (conservative); the fill bar never takes the target. Time exit after 250 sessions.
Costs: --cost-bps per side (default 5). Results are also split per universe (SPX / NDX / DJI / TSX60 / TSX).
 Gap-through-stop trades are flagged (earnings gaps are the usual cause);
with SEC data cached, trades holding through a 10-Q / 10-K filing date are flagged as 'filing'.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import random
import sys
from collections import defaultdict
from multiprocessing import Pool
from typing import Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import data as DATA  # noqa: E402
import scan  # noqa: E402
import zones as Z  # noqa: E402
from zones import RAJA, Bar  # noqa: E402

EXTRA_FIELDS = ('seiden_score', 'fv_dist_atr', 'fv_inside', 'index_aligned', 'index_state', 'pz1', 'pz2', 'rr_pz1', 'rr_pz2')
WARMUP = 300          # D1 bars before the first scan day (the rules look back up to ~420 bars; MN needs 40 months)
MAX_EVALS = 10        # candidate days evaluated per zone
ORDER_LIFE = 40       # sessions a limit order lives
MAX_HOLD = 250        # sessions in a trade
OOS_FRAC = 0.30


def htf_index(bars: List[Bar], tf: str):
    """For each daily index d: the closed W1 / MN / 3M / 6M bars as of d (list prefix length) + the aggregated bars."""
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


MIN_HTF = {'W1': 60, 'MN': 40, '3M': 20}


def candidates(bars: List[Bar], tfs=None) -> Dict[int, List[str]]:
    """Cheap pre-filter: days where some W1 / MN / 3M demand zone (found on the whole history, known by that day, not
    yet removed or tested by then) is within the approach distance under the daily close (D1 bars: the price only).
    analyse() then decides for real. tfs = the zone TFs (default scan.TRADE_TFS; the legacy comparison passes D1)."""
    out: Dict[int, List[str]] = defaultdict(list)
    n = len(bars)
    tfs = tuple(tfs or scan.TRADE_TFS)
    if 'D1' in tfs:
        full = Z.Series(bars, bars[-1].c, 'D1')
        p = dict(RAJA, lookback=n)
        abs_ = lambda s: n - s   # shift -> daily index
        for z in Z.detect(full, p):
            if z.dir < 0:
                continue
            known, L = abs_(z.sa_bar), abs_(z.leg_bar)
            dead = min(abs_(z.removed_bar) if z.removed else n, abs_(z.tested_bar) if z.tested else n)
            for d in range(max(known, WARMUP), min(dead, n)):
                if d - L > RAJA['max_zone_age']:
                    break
                c = bars[d].c
                if z.dist < c and c - z.prox <= max(scan.APPROACH_H * z.h, scan.APPROACH_PCT * c):
                    out[d].append(z.zid)
    # HTF zones: approach test on the daily close, zone known once its stay-away week / month / quarter closed
    for tf in (t for t in tfs if t != 'D1'):
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


def simulate(bars: List[Bar], d: int, sig: Dict, cost_bps: float) -> Optional[Dict]:
    """Order from d+1, then both stop variants. None = never filled."""
    entry, stop, target = sig['entry'], sig['stop'], sig['target']
    risk = entry - stop
    if risk <= 0 or not target:
        return None
    n = len(bars)
    fill_i, fill = -1, 0.0
    for i in range(d + 1, min(n, d + 1 + ORDER_LIFE)):
        b = bars[i]
        if b.h >= target and b.l > entry:          # ran to the target without us: remove the order
            return {'status': 'cancelled_target', 'cancel_date': b.d}
        if b.l <= entry:
            fill_i, fill = i, min(entry, b.o)
            break
        if b.c < sig['distal']:
            return {'status': 'cancelled_removed', 'cancel_date': b.d}
    if fill_i < 0:
        return {'status': 'expired'}
    cost = 2 * cost_bps / 1e4 * fill / risk
    res = {'status': 'filled', 'fill_date': bars[fill_i].d, 'fill': round(fill, 4), 'gap_fill': fill < entry - 1e-9}
    for variant in ('wick', 'close'):
        ex_i, ex, why, gap = -1, 0.0, '', False
        for i in range(fill_i, min(n, fill_i + MAX_HOLD)):
            b = bars[i]
            if variant == 'wick':
                if i == fill_i:
                    if fill <= stop:
                        ex_i, ex, why, gap = i, fill, 'stop', True
                        break
                    if b.l <= stop:
                        ex_i, ex, why = i, stop, 'stop'
                        break
                    continue
                if b.o <= stop:
                    ex_i, ex, why, gap = i, b.o, 'stop', True
                    break
                if b.l <= stop:
                    ex_i, ex, why = i, stop, 'stop'
                    break
            else:
                if b.c <= stop:
                    ex_i, ex, why, gap = i, b.c, 'stop', b.o <= stop
                    break
            if i > fill_i:
                if b.o >= target:
                    ex_i, ex, why = i, b.o, 'target'
                    break
                if b.h >= target:
                    ex_i, ex, why = i, target, 'target'
                    break
        if ex_i < 0:
            ex_i = min(n, fill_i + MAX_HOLD) - 1
            ex, why = bars[ex_i].c, 'time' if fill_i + MAX_HOLD <= n else 'open'
        res[f'{variant}_exit_date'] = bars[ex_i].d
        res[f'{variant}_exit'] = round(ex, 4)
        res[f'{variant}_why'] = why
        res[f'{variant}_gap'] = gap
        res[f'{variant}_r'] = round((ex - fill) / risk - cost, 4)
        res[f'{variant}_bars'] = ex_i - fill_i
        if variant == 'wick':
            # PZ1 / PZ2 reached before the exit bar (the fill bar never counts); "half at PZ1, rest to PZ3"
            hi = max((bars[i].h for i in range(fill_i + 1, ex_i)), default=0.0)
            for k in ('pz1', 'pz2'):
                v = sig.get(k)
                res[f'{k}_hit'] = bool(v) and (hi >= v or (why == 'target' and ex >= v))
            pz1 = sig.get('pz1')
            res['half_pz1_r'] = round(0.5 * ((pz1 - fill) / risk - cost) + 0.5 * res['wick_r'], 4) if pz1 and res['pz1_hit'] else res['wick_r']
    return res


def backtest_ticker(sym: str, bars: List[Bar], sector: str = '', filings: Optional[List[str]] = None, cost_bps: float = 5.0,
                    indexes: str = 'SPX', index_bars: Optional[List[Bar]] = None) -> List[Dict]:
    if len(bars) < WARMUP + 50:
        return []
    w1, w_upto = htf_index(bars, 'W1')
    mn, m_upto = htf_index(bars, 'MN')
    cand = candidates(bars)
    evals: Dict[str, int] = defaultdict(int)
    done = set()
    cache: dict = {}
    trades = []
    busy_until = -1                                   # one position per ticker at a time
    for d in sorted(cand):
        zids = [z for z in cand[d] if z not in done and evals[z] < MAX_EVALS]
        if not zids or d <= busy_until:
            continue
        for z in zids:
            evals[z] += 1
        an = scan.analyse(bars[:d + 1], w1[:w_upto[d]], mn[:m_upto[d]], row_cache=cache)
        an.index = index_at(index_bars, bars[d].d) if index_bars else None
        for s in scan.symbol_signals(an, None):
            zid = f"{s['tf']}:D:{s['base_start']}"
            if s['kind'] != 'BUY' or zid in done:
                continue
            done.add(zid)
            sim = simulate(bars, d, s, cost_bps)
            if sim is None:
                continue
            t = {'symbol': sym, 'sector': sector, 'indexes': indexes, 'signal_date': bars[d].d, 'tf': s['tf'], 'zone_type': s['zone_type'],
                 'pattern': s['pattern'], 'entry': s['entry'], 'stop': s['stop'], 'target': s['target'], 'rr': s['rr'],
                 'curve': s['curve'], 'direction': s['direction'], 'to_entry_pct': s['to_entry_pct'], 'score': s.get('score'),
                 **{k: s.get(k) for k in EXTRA_FIELDS}, **sim}
            if sim['status'] == 'filled' and filings:
                end = t.get('close_exit_date') or t['fill_date']
                t['filing'] = any(t['fill_date'] <= f <= end for f in filings)
            trades.append(t)
            if sim['status'] == 'filled':
                busy_until = max(busy_until, next((i for i in range(d, len(bars)) if bars[i].d >= max(t['wick_exit_date'], t['close_exit_date'])), d))
            break
    return trades


def _worker(args):
    sym, sector, offline, cost, indexes = args
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
    return sym, backtest_ticker(sym, bars, sector, filings, cost, indexes, composite_cached(offline)), ''


# ---- statistics ---------------------------------------------------------------------------------------------------
def bootstrap_ci(xs: List[float], n: int = 2000, seed: int = 7) -> Tuple[Optional[float], Optional[float]]:
    if len(xs) < 2:
        return None, None
    rnd = random.Random(seed)
    m = len(xs)
    means = sorted(sum(xs[rnd.randrange(m)] for _ in range(m)) / m for _ in range(n))
    return means[int(0.025 * n)], means[int(0.975 * n) - 1]


def stats(rs: List[float]) -> Dict:
    if not rs:
        return {'trades': 0}
    w = [r for r in rs if r > 0]
    lo, hi = bootstrap_ci(rs)
    gl = -sum(r for r in rs if r < 0)
    return {'trades': len(rs), 'win_rate': round(len(w) / len(rs), 3), 'avg_r': round(sum(rs) / len(rs), 3),
            'expectancy_ci95': [round(lo, 3), round(hi, 3)] if lo is not None else None,
            'profit_factor': round(sum(w) / gl, 2) if gl > 0 else None, 'total_r': round(sum(rs), 1)}


EXTRA_BUCKETS = [
    ('seiden_score', lambda t: '>=8' if (t.get('seiden_score') or 0) >= 8 else '<8'),
    ('fv_inside', lambda t: 'inside FV' if t.get('fv_inside') else 'outside FV'),
    ('fv_1atr_below', lambda t: '>=1 ATR below FV' if (t.get('fv_dist_atr') or -9) >= 1 else '<1 ATR'),
    ('index_aligned', lambda t: 'aligned' if t.get('index_aligned') else ('index in supply' if t.get('index_state') == 'supply' else 'not aligned')),
]


def summarize(trades: List[Dict]) -> Dict:
    filled = [t for t in trades if t.get('status') == 'filled']
    out = {'signals': len(trades), 'filled': len(filled),
           'not_filled': {k: sum(1 for t in trades if t.get('status') == k) for k in ('expired', 'cancelled_target', 'cancelled_removed')}}
    if not filled:
        return out
    dates = sorted(t['signal_date'] for t in filled)
    split = dates[int(len(dates) * (1 - OOS_FRAC))] if len(dates) > 3 else dates[-1]
    out['oos_from'] = split
    for v in ('wick', 'close'):
        key = f'{v}_r'
        block = {'all': stats([t[key] for t in filled]),
                 'in_sample': stats([t[key] for t in filled if t['signal_date'] < split]),
                 'out_of_sample': stats([t[key] for t in filled if t['signal_date'] >= split]),
                 'gap_through_stop': sum(1 for t in filled if t.get(f'{v}_gap')),
                 'holding_through_filing': sum(1 for t in filled if t.get('filing'))}
        for dim in ('zone_type', 'tf', 'sector'):
            g = defaultdict(list)
            for t in filled:
                g[t.get(dim) or '?'].append(t[key])
            block[f'by_{dim}'] = {k: stats(x) for k, x in sorted(g.items())}
        gi = defaultdict(list)                                       # a trade counts for every index the ticker is in
        for t in filled:
            for i in (t.get('indexes') or '?').split(','):
                gi[i].append(t[key])
        block['by_universe'] = {k: stats(x) for k, x in sorted(gi.items())}
        # Pinndx-inspired fields: reported in and out of sample, none of them is a filter
        bx = {}
        for name, fn in EXTRA_BUCKETS:
            g2 = defaultdict(list)
            for t in filled:
                g2[(fn(t), 'oos' if t['signal_date'] >= split else 'is')].append(t[key])
            bx[name] = {f'{b}|{part}': stats(x) for (b, part), x in sorted(g2.items())}
        block['by_extra'] = bx
        if v == 'wick':
            block['half_at_pz1'] = {'all': stats([t.get('half_pz1_r', t[key]) for t in filled]),
                                    'out_of_sample': stats([t.get('half_pz1_r', t[key]) for t in filled if t['signal_date'] >= split])}
            block['pz_hit_rate'] = {k: round(sum(1 for t in filled if t.get(f'{k}_hit')) / max(1, sum(1 for t in filled if t.get(k))), 3) for k in ('pz1', 'pz2')}
        out[v] = block
    return out


def verdict(summary: Dict) -> str:
    """One honest line: trust needs a positive out-of-sample expectancy whose 95% CI stays above zero."""
    c = summary.get('close', {}).get('out_of_sample', {})
    if not c or c.get('trades', 0) < 30:
        return 'NOT ENOUGH TRADES out of sample to judge (need 30+). Do not trust the scanner yet.'
    ci = c.get('expectancy_ci95') or [0, 0]
    if ci[0] > 0:
        return f"Out-of-sample expectancy {c['avg_r']:+.2f}R (95% CI {ci[0]:+.2f} to {ci[1]:+.2f}) on {c['trades']} trades: positive. Still forward-test small."
    return f"Out-of-sample expectancy {c['avg_r']:+.2f}R (95% CI {ci[0]:+.2f} to {ci[1]:+.2f}) on {c['trades']} trades: NOT proven. Do not trust the scanner with real size."


def write(trades: List[Dict], summary: Dict, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    cols = sorted({k for t in trades for k in t}, key=lambda k: (k not in ('symbol', 'signal_date', 'tf', 'zone_type', 'status'), k))
    with open(os.path.join(out_dir, 'trades.csv'), 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(trades)
    with open(os.path.join(out_dir, 'summary.json'), 'w') as f:
        json.dump({**summary, 'verdict': verdict(summary)}, f, indent=1)


def print_summary(s: Dict) -> None:
    print(f"signals {s['signals']}, filled {s['filled']}, not filled {s['not_filled']}")
    for v in ('wick', 'close'):
        if v not in s:
            continue
        b = s[v]
        print(f"\n[{v}-stop] all {b['all']}\n  in-sample {b['in_sample']}\n  out-of-sample (from {s['oos_from']}) {b['out_of_sample']}")
        print(f"  gap through stop: {b['gap_through_stop']}, holding through a filing: {b['holding_through_filing']}")
        for name, rows in b.get('by_extra', {}).items():
            print(f'  {name}: ' + '; '.join(f"{k} n={x['trades']} avg {x.get('avg_r', 0):+.2f}R" for k, x in rows.items()))
        if 'half_at_pz1' in b:
            print(f"  half at PZ1, rest to PZ3: {b['half_at_pz1']['all']} (OOS {b['half_at_pz1']['out_of_sample']}); PZ hit rate {b['pz_hit_rate']}")
        for dim in ('universe', 'zone_type', 'tf'):
            print(f'  by {dim}: ' + '; '.join(f"{k} n={x['trades']} avg {x.get('avg_r', 0):+.2f}R" for k, x in b[f'by_{dim}'].items()))
    print('\nVERDICT: ' + verdict(s))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--tickers')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--universes', help='e.g. SPX,TSX (default env SCANNER_UNIVERSES or all)')
    ap.add_argument('--offline', action='store_true')
    ap.add_argument('--workers', type=int, default=max(1, (os.cpu_count() or 2) - 1))
    ap.add_argument('--cost-bps', type=float, default=5.0)
    ap.add_argument('--fixture', action='store_true', help='synthetic tickers (code-path check, says nothing about real stocks)')
    ap.add_argument('--out', default=os.path.join(HERE, 'backtest_out'))
    a = ap.parse_args(argv)
    trades: List[Dict] = []
    if a.fixture:
        sys.path.insert(0, os.path.join(HERE, 'fixtures'))
        import synth
        for seed in range(a.limit or 12):
            comp = scan.composite_bars({k: synth.ticker(s_) for k, s_ in zip(scan.INDEX_PARTS, (101, 102, 103, 104))})
            trades += backtest_ticker(f'FX{seed}', synth.ticker(seed), 'Synthetic', None, a.cost_bps, ['SPX', 'NDX', 'DJI', 'TSX'][seed % 4], comp)
    else:
        import universe as U
        if a.universes:
            os.environ['SCANNER_UNIVERSES'] = a.universes
        uni = U.load()
        if a.tickers:
            want = {t.strip().upper() for t in a.tickers.split(',')}
            uni = [u for u in uni if u['symbol'] in want]
        if a.limit:
            uni = uni[:a.limit]
        jobs = [(u['symbol'], u['sector'], a.offline, a.cost_bps, u.get('indexes') or 'SPX') for u in uni]
        with Pool(a.workers) as pool:
            for k, (sym, ts, err) in enumerate(pool.imap_unordered(_worker, jobs)):
                if err:
                    print(f'{sym}: {err}', file=sys.stderr)
                trades += ts
                if (k + 1) % 25 == 0:
                    print(f'{k + 1}/{len(jobs)} tickers, {len(trades)} signals', file=sys.stderr)
    s = summarize(trades)
    write(trades, s, a.out)
    print_summary(s)
    print(f"\n-> {os.path.join(a.out, 'trades.csv')}, summary.json")
    return 0


if __name__ == '__main__':
    sys.exit(main())
