"""Kevin cross-check: does a scanner zone / signal sit on a level from Kevin's latest daily plans?

Source: tools/kevin_daily/calls.json (in the repo; one row per call of a daily breakdown: session 'YYYY-MM-DD_HHMM'
= the recording, plan_for = the trading day it is for, symbol, direction long / short, zone_type, zone_tf, proximal,
distal). Only calls with a price, from the newest 3 plan days (trading days), are used. A scanner zone matches a call
of the same instrument and side when the price ranges overlap within ±0.1% of price (a call with only a proximal is a
single price). The newest matching call wins; the card then says
    ⭐ also in Kevin's plan (Oct 28: 1H demand 4024–4041)
(the recording day, his zone timeframe, side, his levels) and such cards come first.
"""
from __future__ import annotations

import datetime as dt
import json
import os
from typing import Dict, Iterable, List, Optional

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
CALLS = os.path.join(ROOT, 'tools', 'kevin_daily', 'calls.json')
DAYS = 3
TOL = 0.001                                      # ±0.1% of price
SYM = {'DXY': 'USDX', 'SPX500': 'US500', 'SPX500USD': 'US500', 'WTICOUSD': 'SPOTCRUDE', 'WTI': 'SPOTCRUDE',
       'BCOUSD': 'SPOTBRENT', 'NAS100USD': 'NAS100', 'US30USD': 'US30', 'GOLD': 'XAUUSD'}   # Kevin -> Pepperstone
TF = {'1H': '1H', '4H': '4H', 'D': 'D1', 'W': 'W1', 'M': 'MN', '15m': '15m', '5m': '5m'}


def _side(c: Dict) -> Optional[str]:
    zt = (c.get('zone_type') or '').lower()
    if zt in ('demand', 'supply'):
        return zt
    d = (c.get('direction') or '').lower()
    return 'demand' if d == 'long' else 'supply' if d == 'short' else None


def _f(v) -> Optional[float]:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def levels(calls: Iterable[Dict], today: Optional[dt.date] = None, days: int = DAYS) -> List[Dict]:
    """Priced calls of the newest `days` plan days (plan days from a week back to a few days ahead of today: a plan
    recorded this evening for tomorrow counts), newest first."""
    today = today or dt.datetime.now(dt.timezone.utc).date()
    lo_d, hi_d = (today - dt.timedelta(days=10)).isoformat(), (today + dt.timedelta(days=4)).isoformat()
    rows = [c for c in calls if isinstance(c, dict) and lo_d <= str(c.get('plan_for') or '') <= hi_d]
    plan_days = sorted({c['plan_for'] for c in rows})[-days:]
    out = []
    for c in rows:
        if c['plan_for'] not in plan_days:
            continue
        p, d, side = _f(c.get('proximal')), _f(c.get('distal')), _side(c)
        if p is None or side is None:
            continue
        sym = str(c.get('symbol') or '').upper().replace('/', '').replace('_', '')
        out.append({'sym': SYM.get(sym, sym), 'side': side, 'lo': min(p, d if d is not None else p),
                    'hi': max(p, d if d is not None else p), 'prox': p, 'dist': d, 'tf': TF.get(c.get('zone_tf') or '', c.get('zone_tf') or ''),
                    'session': str(c.get('session') or ''), 'plan_for': c['plan_for']})
    out.sort(key=lambda r: (r['session'], r['plan_for']), reverse=True)
    return out


def load(path: str = CALLS, today: Optional[dt.date] = None, log=None) -> List[Dict]:
    """levels() of the calls file; [] when it is missing or unreadable (never raises)."""
    try:
        with open(path, encoding='utf-8') as f:
            calls = json.load(f)
        out = levels(calls if isinstance(calls, list) else [], today)
    except (OSError, ValueError, TypeError, KeyError) as e:
        if log:
            log(f'kevin: calls unavailable ({type(e).__name__})')
        return []
    if log:
        log(f"kevin: {len(out)} priced levels from the newest {DAYS} plan days")
    return out


def num(v: float) -> str:
    """4024.665 -> '4024' (no decimals from 1000 up, as on his chart labels), 1.3137 -> '1.3137'."""
    if abs(v) >= 1000:
        return str(int(v))
    return f'{v:.5f}'.rstrip('0').rstrip('.')


def label(lv: Dict) -> str:
    """'Oct 28: 1H demand 4024–4041'."""
    try:
        day = dt.date.fromisoformat(lv['session'][:10])
        day_s = day.strftime('%b ') + str(day.day)
    except ValueError:
        day_s = lv.get('plan_for') or ''
    rng = num(lv['lo']) if lv['lo'] == lv['hi'] else f"{num(lv['lo'])}–{num(lv['hi'])}"
    return f"{day_s}: " + ' '.join(x for x in (lv.get('tf') or '', lv['side'], rng) if x)


def match(lvls: List[Dict], sym: str, side: str, a: Optional[float], b: Optional[float], px: Optional[float] = None) -> Optional[Dict]:
    """The newest level of sym / side whose range overlaps [a, b] (the zone's proximal / distal) within ±TOL of price."""
    a, b = _f(a), _f(b)
    if a is None and b is None:
        return None
    a = b if a is None else a
    b = a if b is None else b
    lo, hi = min(a, b), max(a, b)
    tol = TOL * (px or (lo + hi) / 2)
    for lv in lvls:
        if lv['sym'] == sym and lv['side'] == side and lv['lo'] <= hi + tol and lv['hi'] >= lo - tol:
            return lv
    return None


def annotate(items: Iterable[Dict], lvls: List[Dict], a_key: str = 'proximal', b_key: str = 'distal', px_key: str = 'price') -> int:
    """Sets item['kevin'] = label(...) on every item that matches (sym, side, a_key / b_key); returns the count."""
    n = 0
    if not lvls:
        return 0
    for it in items:
        lv = match(lvls, it.get('sym') or '', it.get('side') or '', it.get(a_key), it.get(b_key), it.get(px_key))
        if lv:
            it['kevin'] = label(lv)
            n += 1
    return n
