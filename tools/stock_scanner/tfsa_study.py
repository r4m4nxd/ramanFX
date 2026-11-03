"""TFSA "buy at the best price" study (owner 2026-11-02: "for the TFSA I buy at the best price: near, inside or just
left a higher-timeframe zone"). Buy-and-hold, NO stop: what happened after buying a stock at a W1 / MN / 3M demand
zone, against (a) the same stock bought on a random day (seeded, same holding length) and (b) SPY over the same dates.

    python tools/stock_scanner/backtest.py --tfsa-json public/learn/tfsa_study.json ...   (same cached data, same run)

Events, per ticker, per demand zone of the W1 / MN / 3M rows (zones.detect on CLOSED candles, RAJA parameters as the
live scanner draws them; a zone exists from the session after its stay-away candle closed; at most max_zone_age
candles old; its first touch = the first daily low at / below the proximal after that):
  in    first touch: limit buy at the proximal (at the open on a gap down)            - the headline
  near  the first close at most NEAR_PCT % above the proximal before any touch: buy at that close
  left  the first close back above the proximal within LEFT_SESSIONS sessions of the first touch (it bounced): buy at
        that close
(the /tfsa sections of lists.py, taken at the moment each first becomes true). Forward returns at 63 / 126 / 252
sessions (3 / 6 / 12 months) to the close; worst drawdown = the lowest low during the hold vs the entry.
Filters (data up to the decision only: the previous close for an intraday 'in' buy, the entry close otherwise):
market_regime (SPY close above its 200-day average), mom12 (the stock's 12-month return > 0), not_top3 (the entry
below the top third of the last 504 sessions' range, curve_top3), qualified (the rally from the base made a new
high above the 20 zone-timeframe candles before the base, before the event).
Splits: train (entries before 2022) / test (2022 on) and two seeded random halves of the tickers. CI = 95% bootstrap
of the mean, resampling TICKERS (events of one stock are correlated, and hold windows overlap).
"""
from __future__ import annotations

import bisect
import datetime as dt
import hashlib
import random
from collections import defaultdict
from typing import Dict, List, Optional, Sequence

import zones as Z
from zones import RAJA, Bar

HORIZONS = {'3m': 63, '6m': 126, '12m': 252}
NEAR_PCT = 3.0
LEFT_SESSIONS = 3
TFS = ('W1', 'MN', '3M')
TF_RANK = {'3M': 0, 'MN': 1, 'W1': 2}
SECTIONS = ('in', 'near', 'left')
MIN_HTF = {'W1': 60, 'MN': 40, '3M': 20}
SPLIT_DATE = '2022-01-01'
QUAL_LOOKBACK = 20
SMA = 200
BOOT = 1000
FILTERS = ('market_regime', 'mom12', 'not_top3', 'qualified')


def _htf(bars: List[Bar], tf: str):
    import backtest as BT          # one HTF aggregation for the backtest and the study
    return BT.htf_index(bars, tf)


def _ret(a: float, b: float) -> float:
    return (b / a - 1) * 100


def _forward(bars: Sequence[Bar], i: int, entry: float) -> Dict:
    out = {}
    for k, h in HORIZONS.items():
        if i + h < len(bars):
            lo = min(b.l for b in bars[i:i + h + 1])
            out[k] = {'ret': round(_ret(entry, bars[i + h].c), 3), 'dd': round(min(0.0, _ret(entry, lo)), 3), 'exit': bars[i + h].d}
    return out


def ticker_events(sym: str, bars: List[Bar], seed: int = 7, start: str = '') -> List[Dict]:
    """Every in / near / left event of one ticker (see the module doc). Each decision reads bars up to the event."""
    n = len(bars)
    out: List[Dict] = []
    if n < 300:
        return out
    dates = [b.d for b in bars]
    for tf in TFS:
        agg, upto = _htf(bars, tf)
        nw = len(agg)
        if nw <= MIN_HTF.get(tf, 20):
            continue
        S = Z.Series(agg, agg[-1].c, tf)
        first_day: Dict[int, int] = {}
        for d in range(n):
            first_day.setdefault(upto[d], d)
        for z in Z.detect(S, dict(RAJA, lookback=nw)):
            if z.dir < 0:
                continue
            sa_w = nw - z.sa_bar
            k0 = first_day.get(sa_w + 1)
            if k0 is None:
                continue
            leg_w = nw - z.leg_bar
            ib = nw - z.base_end                       # agg index of the oldest base candle
            prior_hi = max((x.h for x in agg[max(0, ib - QUAL_LOOKBACK):ib]), default=float('inf'))
            bs_i = bisect.bisect_left(dates, z.base_start) if z.base_start else k0
            run_hi = max((bars[k].h for k in range(bs_i, k0 + 1)), default=0.0)
            near_done = False
            touch = -1
            for d in range(k0 + 1, n):
                if upto[d] - leg_w > RAJA['max_zone_age']:
                    break
                b = bars[d]
                if b.l <= z.prox:
                    touch = d
                    break
                run_hi = max(run_hi, b.h)
                if not near_done and b.c > z.prox and (b.c - z.prox) / b.c * 100 <= NEAR_PCT:
                    near_done = True
                    out.append(_event(sym, tf, 'near', bars, d, d, b.c, z, run_hi > prior_hi))
            if touch < 0:
                continue
            q = run_hi > prior_hi                       # the run-out BEFORE the touch session
            out.append(_event(sym, tf, 'in', bars, touch, touch - 1, min(z.prox, bars[touch].o), z, q))
            for d in range(touch, min(n, touch + LEFT_SESSIONS)):
                if bars[d].c > z.prox:
                    out.append(_event(sym, tf, 'left', bars, d, d, bars[d].c, z, q))
                    break
    out = [e for e in out if e['date'] >= start] if start else out
    rnd = random.Random(f'{seed}|{sym}')
    for e in out:
        e['rnd'] = {}
        for k, h in HORIZONS.items():
            if n - h > 1:
                j = rnd.randrange(0, n - h)
                e['rnd'][k] = round(_ret(bars[j].c, bars[j + h].c), 3)
    return out


def _event(sym, tf, sec, bars, i, ref, entry, z, qualified) -> Dict:
    """One buy at session i (entry price `entry`); filters read bars up to `ref` only."""
    w = bars[max(0, ref - 503):ref + 1]
    lo, hi = min(b.l for b in w), max(b.h for b in w)
    mom = _ret(bars[ref - 252].c, bars[ref].c) if ref >= 252 else None
    return {'sym': sym, 'tf': tf, 'section': sec, 'date': bars[i].d, 'ref_date': bars[ref].d, 'entry': round(entry, 4),
            'prox': round(z.prox, 4), 'dist': round(z.dist, 4), 'qualified': bool(qualified),
            'mom12': round(mom, 2) if mom is not None else None,
            'top3': hi > lo and entry >= lo + 2.0 / 3.0 * (hi - lo), 'fwd': _forward(bars, i, entry)}


# ---- summary --------------------------------------------------------------------------------------------------------
def _half(sym: str, seed: int) -> str:
    return 'A' if int(hashlib.sha1(f'{seed}|{sym}'.encode()).hexdigest(), 16) % 2 == 0 else 'B'


def _spy_tools(spy: Sequence[Bar]):
    ds = [b.d for b in spy]
    cl = [b.c for b in spy]
    sma, s = [None] * len(cl), 0.0
    for k, c in enumerate(cl):
        s += c
        if k >= SMA:
            s -= cl[k - SMA]
        if k + 1 >= SMA:
            sma[k] = s / SMA

    def idx(d: str) -> int:
        return bisect.bisect_right(ds, d) - 1

    def ret(a: str, b: str) -> Optional[float]:
        i, j = idx(a), idx(b)
        return _ret(cl[i], cl[j]) if i >= 0 and j >= 0 else None

    def above(d: str) -> Optional[bool]:
        i = idx(d)
        return None if i < 0 or sma[i] is None else cl[i] > sma[i]
    return ret, above


def cluster_ci(rows: List[tuple], n: int = BOOT, seed: int = 7) -> Optional[List[float]]:
    """95% bootstrap CI of the mean of rows (ticker, value), resampling tickers."""
    by = defaultdict(list)
    for t, v in rows:
        by[t].append(v)
    units = [(sum(v), len(v)) for v in by.values()]
    if len(units) < 2:
        return None
    rnd = random.Random(seed)
    m = len(units)
    means = []
    for _ in range(n):
        s = c = 0
        for _k in range(m):
            a, b = units[rnd.randrange(m)]
            s += a
            c += b
        means.append(s / c)
    means.sort()
    return [round(means[int(0.025 * n)], 3), round(means[int(0.975 * n) - 1], 3)]


def _median(xs: List[float]) -> Optional[float]:
    if not xs:
        return None
    s = sorted(xs)
    m = len(s) // 2
    return round(s[m] if len(s) % 2 else (s[m - 1] + s[m]) / 2, 3)


def hstats(evs: List[Dict], k: str) -> Dict:
    rows = [e for e in evs if k in e['fwd'] and e['fwd'][k].get('spy') is not None]
    if not rows:
        return {'n': 0}
    r = [e['fwd'][k]['ret'] for e in rows]
    x = [e['fwd'][k]['ret'] - e['fwd'][k]['spy'] for e in rows]
    xr = [(e['sym'], e['fwd'][k]['ret'] - e['rnd'][k]) for e in rows if k in e.get('rnd', {})]
    dd = [e['fwd'][k]['dd'] for e in rows]
    m = len(rows)
    return {'n': m, 'tickers': len({e['sym'] for e in rows}),
            'mean_ret': round(sum(r) / m, 3), 'median_ret': _median(r),
            'mean_excess_spy': round(sum(x) / m, 3), 'median_excess_spy': _median(x),
            'ci_excess_spy': cluster_ci([(e['sym'], v) for e, v in zip(rows, x)]),
            'beat_spy': round(sum(1 for v in x if v > 0) / m, 3),
            'mean_excess_random': round(sum(v for _, v in xr) / len(xr), 3) if xr else None,
            'ci_excess_random': cluster_ci(xr) if xr else None,
            'worst_dd': round(min(dd), 2), 'median_dd': _median(dd)}


def _group(evs: List[Dict]) -> Dict:
    return {k: hstats(evs, k) for k in HORIZONS}


def dedupe(evs: List[Dict]) -> List[Dict]:
    """One event per (ticker, section, day): the biggest timeframe (a W1 and an MN zone touched together = one buy)."""
    best: Dict[tuple, Dict] = {}
    for e in evs:
        key = (e['sym'], e['section'], e['date'])
        if key not in best or TF_RANK[e['tf']] < TF_RANK[best[key]['tf']]:
            best[key] = e
    return sorted(best.values(), key=lambda e: (e['date'], e['sym']))


def summarize(evs: List[Dict], spy: Optional[Sequence[Bar]], seed: int = 7, fixture: bool = False) -> Dict:
    spy_ret, spy_above = _spy_tools(spy or [])
    for e in evs:
        e['regime'] = spy_above(e['ref_date']) if spy else None
        for k, f in e['fwd'].items():
            f['spy'] = round(spy_ret(e['date'], f['exit']), 3) if spy and spy_ret(e['date'], f['exit']) is not None else None
    uniq = dedupe(evs)
    main = [e for e in uniq if e['section'] == 'in']
    filt = {'market_regime': lambda e: e.get('regime') is True, 'mom12': lambda e: (e.get('mom12') or 0) > 0,
            'not_top3': lambda e: not e['top3'], 'qualified': lambda e: e['qualified']}
    out = {'schema': 1, 'market': 'stock', 'generated_at': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
           'fixture': fixture,
           'period': {'start': uniq[0]['date'] if uniq else None, 'end': uniq[-1]['date'] if uniq else None, 'split': SPLIT_DATE},
           'params': {'horizons_sessions': HORIZONS, 'near_pct': NEAR_PCT, 'left_sessions': LEFT_SESSIONS, 'tfs': list(TFS),
                      'max_zone_age': RAJA['max_zone_age'], 'bootstrap': f'{BOOT} draws, resampling tickers', 'stop': None},
           'events': {'raw': len(evs), 'unique': len(uniq), 'tickers': len({e['sym'] for e in uniq})},
           'by_section': {s: _group([e for e in uniq if e['section'] == s]) for s in SECTIONS},
           'by_tf': {tf: _group([e for e in evs if e['section'] == 'in' and e['tf'] == tf]) for tf in TFS},
           'filters': {}, 'splits': {}}
    for name, f in filt.items():
        out['filters'][name] = {'pass': _group([e for e in main if f(e)]), 'fail': _group([e for e in main if not f(e)])}
    allf = [e for e in main if all(f(e) for f in filt.values())]
    out['filters']['all_four'] = {'pass': _group(allf)}
    out['splits'] = {'train': _group([e for e in main if e['date'] < SPLIT_DATE]), 'test': _group([e for e in main if e['date'] >= SPLIT_DATE]),
                     'tickers_A': _group([e for e in main if _half(e['sym'], seed) == 'A']),
                     'tickers_B': _group([e for e in main if _half(e['sym'], seed) == 'B'])}
    out['verdict'] = verdict(out)
    return out


def _proven(g: Dict) -> Optional[bool]:
    ci = (g or {}).get('ci_excess_spy')
    return None if not ci or (g.get('n') or 0) < 30 else ci[0] > 0


def verdict(s: Dict) -> str:
    """Plain English, first line of the report: buying at the first touch, 12 months, vs SPY and vs a random day."""
    g = (s.get('by_section') or {}).get('in', {}).get('12m') or {}
    if (g.get('n') or 0) < 30:
        return 'Not enough first-touch buys with 12 months of data to judge (need 30+).'
    tr, te = s['splits']['train'].get('12m', {}), s['splits']['test'].get('12m', {})
    ci = g.get('ci_excess_spy') or [None, None]
    both = _proven(tr) and _proven(te)
    word = ('beat' if g['mean_excess_spy'] > 0 else 'lagged')
    line = (f"Buying at the first touch of a W1 / MN / 3M demand zone and holding 12 months (no stop) {word} SPY by "
            f"{abs(g['mean_excess_spy']):.1f}% on average (median {g['median_excess_spy']:+.1f}%, 95% CI {ci[0]:+.1f} to {ci[1]:+.1f}); "
            f"{g['beat_spy'] * 100:.0f}% of {g['n']} buys beat SPY")
    if g.get('mean_excess_random') is not None:
        line += f"; vs buying the same stock on a random day: {g['mean_excess_random']:+.1f}%"
    line += f". Worst drop during a hold {g['worst_dd']:.0f}% (median {g['median_dd']:.0f}%). "
    if both:
        line += 'The edge over SPY holds in both the train (before 2022) and the test (2022 on) period.'
    else:
        line += 'NOT proven: the edge over SPY is not clearly above zero in both the train (before 2022) and the test (2022 on) period.'
    return line


def _cell(m: Dict) -> str:
    if not m or not m.get('n'):
        return '| 0 | | | | | | |'
    ci = m.get('ci_excess_spy') or [None, None]
    f = lambda v: 'n/a' if v is None else f'{v:+.1f}%'  # noqa: E731
    return (f"| {m['n']} | {f(m['mean_ret'])} | {f(m['mean_excess_spy'])} ({f(ci[0])} to {f(ci[1])}) | {f(m['median_excess_spy'])} | "
            f"{m['beat_spy'] * 100:.0f}% | {f(m.get('mean_excess_random'))} | {m['worst_dd']:.0f}% |")


def render_md(s: Optional[Dict]) -> List[str]:
    if not s:
        return []
    L = ['## TFSA study: buy at a demand zone and hold (no stop)', '', f"**Verdict:** {s.get('verdict')}", '']
    if s.get('fixture'):
        L += ['> SYNTHETIC FIXTURE RUN: checks the code path only.', '']
    L += ['Every first touch of a W1 / MN / 3M demand zone (drawn on closed candles, as the live scanner does) on every '
          'ticker: buy and hold 3 / 6 / 12 months, no stop. "in" = limit at the proximal on the first touch; "near" = the '
          f"first close within {NEAR_PCT:g}% above it before a touch; \"left\" = the first close back above it within "
          f"{LEFT_SESSIONS} sessions of the touch (the /tfsa sections). Compared with SPY over the same dates (close to close) "
          'and with the same stock bought on a random day (seeded) for the same length. One buy per stock, section and day '
          '(the biggest timeframe). CI = 95% bootstrap resampling tickers. Survivorship: today\'s index members.', '',
          f"Events: {s['events']['unique']} unique ({s['events']['raw']} raw) on {s['events']['tickers']} tickers, "
          f"{s['period'].get('start')} to {s['period'].get('end')}.", '']
    hdr = ['| | Buys | Avg return | Avg vs SPY (95% CI) | Median vs SPY | Beat SPY | Vs random day | Worst drop |',
           '|---|---|---|---|---|---|---|---|']
    for k in HORIZONS:
        L += [f'### {k} hold', ''] + hdr
        L += [f'| section: {sec} ' + _cell(s['by_section'][sec].get(k)) for sec in SECTIONS]
        L += [f'| in, {tf} ' + _cell(s['by_tf'][tf].get(k)) for tf in TFS]
        for name, g in s['filters'].items():
            L.append(f'| in, {name} ' + _cell(g['pass'].get(k)))
            if 'fail' in g:
                L.append(f'| in, not {name} ' + _cell(g['fail'].get(k)))
        L += [f'| in, {name} ' + _cell(g.get(k)) for name, g in s['splits'].items()] + ['']
    return L
