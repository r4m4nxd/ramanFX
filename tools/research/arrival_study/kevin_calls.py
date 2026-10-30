"""Back-test of Kevin's real daily-breakdown calls (tools/kevin_daily/calls.json, Jul - Oct 2026) on OANDA prices.

Every call with a proximal price = a limit order:
  placed    at the recording time (session 'YYYY-MM-DD_HHMM', read as US Eastern = forex time - 7 h: the LATEST reading
            of the clock, so no call is placed before he made it; if he recorded in London the order is placed ~5 h late)
  entry     his proximal; valid through the plan day + EXPIRY_DAYS more trading days (sensitivity: the plan day only);
            cancelled when a M5 close goes beyond his distal before the fill, or the target trades first
  stop      his distal - / + buffer (buffer = max(0.1 x ATR14 of his zone TF, the median M5 spread) = the stop rule);
            no distal stated: the median zone height of his calls with both prices (in ATR of the zone TF) is used
  target    he states almost none (3 numeric of 880): variants 1R / 2R / 3R, half at 1R + break-even then 3R,
            break-even at 1R + 1R trail, and the nearest opposite zone on his zone TF (our detector, at placement)
  bars      M5 (his finest TF): same-bar stop / target ties are rare and count as the stop
  costs     the median M5 bid/ask spread at placement, in R
  hold      10 trading days after the fill, then out at the close ('time')
Checks: a call whose proximal is > 3% from the price at placement (misread / other feed) or already beyond his
distal (zone gone) is not traded (counted). DXY has no OANDA instrument (skipped). Calls without a price (trend-line
'context' / confirmation calls) get a DIRECTION test instead: from placement, does price travel 1 ATR (his TF) with
the call before 1 ATR against it (within 3 trading days)?

Selection bias: these are the calls he chose to make in a recorded breakdown (he picks the cleanest charts of the
day), and the prices are read from his chart frames / speech (some are rounded). His own reported outcomes
(status_in_later_sessions) are compared with the back-test.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import statistics
import sys
from typing import Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import r2lib as R  # noqa: E402
import oanda_fine as OF  # noqa: E402

A, Z = R.A, R.Z
CALLS = os.path.join(R.ROOT, 'tools', 'kevin_daily', 'calls.json')
OANDA = {'EURUSD': 'EUR_USD', 'AUDUSD': 'AUD_USD', 'XAUUSD': 'XAU_USD', 'SPX500': 'SPX500_USD', 'GBPUSD': 'GBP_USD',
         'USDCHF': 'USD_CHF', 'USDCAD': 'USD_CAD', 'WTICOUSD': 'WTICO_USD', 'NATGAS': 'NATGAS_USD', 'EURGBP': 'EUR_GBP',
         'USDJPY': 'USD_JPY', 'CADJPY': 'CAD_JPY', 'GBPJPY': 'GBP_JPY', 'EURJPY': 'EUR_JPY', 'UK100': 'UK100_GBP'}
TFMAP = {'1H': 'H1', '4H': 'H4', 'D': 'D1', 'W': 'W1', 'M': 'MN', '15m': 'M15', '5m': 'M5'}
HTF = {'M5': 'M15', 'M15': 'H1', 'H1': 'H4', 'H4': 'D1', 'D1': 'W1', 'W1': 'MN', 'MN': None}
EXPIRY_DAYS = 2
HOLD_DAYS = 10
MAX_OFF = 0.03
SPANS = {'M5': '2026-06-15T00:00:00Z', 'M15': '2026-03-01T00:00:00Z', 'H1': '2025-11-01T00:00:00Z',
         'H4': '2024-01-01T00:00:00Z', 'D1': '2019-01-01T00:00:00Z', 'W1': '2008-01-01T00:00:00Z',
         'MN': '2005-01-01T00:00:00Z'}
VARIANTS = ('1R', '2R', '3R', 'partial', 'trail', 'opp', '2R_planday')


def place_time(session: str) -> str:
    """'YYYY-MM-DD_HHMM' (US Eastern) -> forex time (NY + 7 h)."""
    t = dt.datetime.strptime(session, '%Y-%m-%d_%H%M') + dt.timedelta(hours=7)
    return t.strftime('%Y-%m-%dT%H:%M')


def trading_day_end(day: str, extra: int) -> str:
    """Forex-time end of the trading day `day` + `extra` more trading days (Mon - Fri)."""
    d = dt.date.fromisoformat(day)
    while d.weekday() >= 5:
        d += dt.timedelta(days=1)
    k = 0
    while k < extra:
        d += dt.timedelta(days=1)
        if d.weekday() < 5:
            k += 1
    return (d + dt.timedelta(days=1)).isoformat() + 'T00:00'


def load_calls(path: str = CALLS) -> List[Dict]:
    with open(path) as f:
        return json.load(f)


def tf_of(c: Dict) -> str:
    z = c.get('zone_tf')
    if z in TFMAP:
        return TFMAP[z]
    for t in c.get('timeframes') or []:
        if t in TFMAP:
            return TFMAP[t]
    return 'H1'


def bars_of(rows: List[list]) -> List[Z.Bar]:
    return [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in rows]


def fetch(sym: str, log=print) -> Dict[str, R.TF]:
    name = OANDA[sym]
    out = {}
    for tf, start in SPANS.items():
        rows = OF.span(name, tf, start)
        out[tf] = R.TF(tf, bars_of(rows))
        if tf == 'M5':
            out['_spread'] = [r[5] for r in rows]
    log(f"  {sym}: " + ', '.join(f"{tf} {len(out[tf])}" for tf in SPANS))
    return out


def median_heights(calls: List[Dict], data: Dict[str, Dict]) -> Dict[str, float]:
    """Median |proximal - distal| / ATR14 per zone TF over the calls with both prices."""
    hs: Dict[str, List[float]] = {}
    for c in calls:
        if c.get('proximal') is None or c.get('distal') is None or c['symbol'] not in data:
            continue
        tf = tf_of(c)
        T = data[c['symbol']].get(tf)
        if T is None:
            continue
        k = T.closed(place_time(c['session']))
        if k < 30:
            continue
        a = T.series(k, 60).atr(1)
        if a > 0:
            hs.setdefault(tf, []).append(abs(c['proximal'] - c['distal']) / a)
    return {tf: statistics.median(v) for tf, v in hs.items() if v}


def direction_test(d: int, fine: R.TF, t0: str, atr: float, end: str) -> Optional[int]:
    """+1 = price went 1 ATR with the call before 1 ATR against it, -1 = the opposite, 0 = neither, None = no data."""
    i = fine.closed(t0)
    if i >= len(fine) or atr <= 0:
        return None
    p0 = fine.bars[i].o
    up, dn = p0 + d * atr, p0 - d * atr
    while i < len(fine) and fine.ends[i] <= end:
        b = fine.bars[i]
        hit_dn = (b.l <= dn) if d > 0 else (b.h >= dn)
        hit_up = (b.h >= up) if d > 0 else (b.l <= up)
        if hit_dn:
            return -1                 # a tie counts against
        if hit_up:
            return 1
        i += 1
    return 0


def run_call(c: Dict, D: Dict[str, R.TF], med_h: Dict[str, float]) -> Dict:
    d = 1 if c.get('direction') == 'long' else -1 if c.get('direction') == 'short' else 0
    t0 = place_time(c['session'])
    tf = tf_of(c)
    row = {'sym': c['symbol'], 'session': c['session'], 'plan_for': c['plan_for'], 't': t0, 'dir': d, 'tf': tf,
           'zone_tf': c.get('zone_tf'), 'entry_type': c.get('entry_type') or '', 'confidence': c.get('confidence'),
           'kevin_status': [s['status'] for s in c.get('status_in_later_sessions') or []],
           'htf_bias_reason': (c.get('htf_bias') or {}).get('reason'), 'kind': 'zone' if c.get('proximal') is not None else 'context'}
    fine = D['M5']
    T = D.get(tf) or D['H1']
    k = T.closed(t0)
    fi = fine.closed(t0)
    if d == 0 or k < 60 or fi >= len(fine):
        row['status'] = 'no data' if d else 'neutral'
        return row
    S = T.series(k, 420)
    atr = S.atr(1)
    price = fine.bars[fi - 1].c if fi > 0 else S.C[1]
    sp_hist = [x for x in D['_spread'][max(0, fi - 2000):fi] if x > 0]
    spread = statistics.median(sp_hist) if sp_hist else 0.0
    row['direction_test'] = direction_test(d, fine, t0, atr, trading_day_end(c['plan_for'], 2))
    if c.get('proximal') is None:
        row['status'] = 'context'
        return row
    entry = float(c['proximal'])
    if abs(entry - price) / price > MAX_OFF:
        row['status'] = 'price off'
        return row
    dist = c.get('distal')
    row['distal_given'] = dist is not None
    if dist is None:
        dist = entry - d * med_h.get(tf, 0.5) * atr
    dist = float(dist)
    if (dist - entry) * d >= 0:
        row['status'] = 'levels inconsistent'
        return row
    if (price < dist) if d > 0 else (price > dist):
        row['status'] = 'zone already broken'
        return row
    buf = max(A.SL_ATR_FRAC * atr, spread)
    stop = dist - d * buf
    risk = (entry - stop) * d
    hk = None
    H = None
    htf = HTF.get(tf)
    if htf and htf in D:
        hk = D[htf].closed(t0)
        if hk >= 30:
            H = D[htf].series(hk, 420, price)
    zs = Z.detect(S, A.FX_P) if S.n > 12 else []
    hz = Z.detect(H, A.FX_P) if H is not None and H.n > 12 else []
    zone = R.match_zone(zs, d, min(entry, dist), max(entry, dist), atr)
    row['f'] = R.features(S, H, d, entry, stop, dist, price, zone, t0, zs, hz)
    row.update(status='traded', entry=entry, stop=stop, distal=dist, risk=risk, spread=spread, price=price)
    expire = trading_day_end(c['plan_for'], EXPIRY_DAYS)
    hold_end = R.add_time(expire, days=HOLD_DAYS + 4)
    opp = [z for z in zs if z.dir == -d and not z.removed and (z.lo > entry if d > 0 else z.hi < entry)]
    opp_tp = min((z.prox for z in opp), key=lambda v: abs(v - entry)) if opp else None
    res = {}
    ca = entry + d * 2 * risk              # one cancel level (price ran 2R away before the fill) for every variant
    for v in VARIANTS:
        if v in ('1R', '2R', '3R'):
            m = float(v[0])
            res[v] = R.simulate(d, entry, stop, fine, t0, expire, hold_end, dist, spread, 'fixed', entry + d * m * risk, cancel_at=ca)
        elif v == 'partial':
            res[v] = R.simulate(d, entry, stop, fine, t0, expire, hold_end, dist, spread, 'partial', entry + d * 3 * risk, cancel_at=ca)
        elif v == 'trail':
            res[v] = R.simulate(d, entry, stop, fine, t0, expire, hold_end, dist, spread, 'trail', None, cancel_at=ca)
        elif v == 'opp':
            res[v] = (R.simulate(d, entry, stop, fine, t0, expire, hold_end, dist, spread, 'fixed', opp_tp, cancel_at=ca)
                      if opp_tp is not None else {'outcome': 'no target', 'R': None})
        elif v == '2R_planday':
            res[v] = R.simulate(d, entry, stop, fine, t0, trading_day_end(c['plan_for'], 0), hold_end, dist, spread,
                                'fixed', entry + d * 2 * risk, cancel_at=ca)
    row['res'] = res
    row['fill_t'] = res['2R'].get('fill_t')
    row['f']['session'] = R.session_of(row['fill_t'])
    return row


def run(log=print) -> Dict:
    calls = load_calls()
    data: Dict[str, Dict] = {}
    errors = []
    for sym in sorted({c['symbol'] for c in calls}):
        if sym not in OANDA:
            continue
        try:
            data[sym] = fetch(sym, log)
        except Exception as e:  # noqa: BLE001
            errors.append(f'{sym}: {type(e).__name__}: {str(e)[:120]}')
            log('  ' + errors[-1])
    med_h = median_heights(calls, data)
    rows = []
    for c in calls:
        if c['symbol'] not in data:
            rows.append({'sym': c['symbol'], 'status': 'no instrument', 'kind': 'zone' if c.get('proximal') is not None else 'context',
                         'session': c['session'], 'plan_for': c['plan_for']})
            continue
        try:
            rows.append(run_call(c, data[c['symbol']], med_h))
        except Exception as e:  # noqa: BLE001
            errors.append(f"{c['symbol']} {c['session']} {c.get('t')}: {type(e).__name__}: {str(e)[:100]}")
            rows.append({'sym': c['symbol'], 'status': 'error', 'kind': 'zone', 'session': c['session'], 'plan_for': c['plan_for']})
    return {'rows': rows, 'med_h': med_h, 'errors': errors, 'n_calls': len(calls)}


def trades(rows: List[Dict], variant: str = '2R') -> List[Dict]:
    """Flat trade dicts of one variant (for r2lib.stats / table)."""
    out = []
    for r in rows:
        if r.get('status') != 'traded':
            continue
        x = r['res'][variant]
        out.append({**{k: v for k, v in r.items() if k not in ('res',)}, **x})
    return out
