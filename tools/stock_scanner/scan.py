"""Daily S&P 500 supply & demand scan, strictly by the Raja rules (Kevin second) as implemented in ZoneVision.

    python tools/stock_scanner/scan.py                      # full universe, writes public/scanner/*.json, notifies
    python tools/stock_scanner/scan.py --tickers AAPL,MSFT  # a few tickers
    python tools/stock_scanner/scan.py --selftest           # synthetic fixtures end to end, prints the Telegram text
    python tools/stock_scanner/scan.py --offline            # cached data only

BUY   price is approaching a FRESH demand zone (D1 or W1) of type ARR / WOW / STR, direction up (D1 -> W1 -> MN),
      demand below 50% of the curve, no HTF supply on top of it, room >= 2x the stop (3x = good), a known target,
      not sideways, no 3rd CP, no earnings in the next 10 trading days (when the date is known).
WATCH new strong zones of the last 5 sessions with price still far, and tested zones (2nd / 3rd touch) that need a
      lower-TF confirmation.
EXIT  holdings (holdings.json or env HOLDINGS_JSON) near the next supply, demand broken by a close, stop hit by close.
Every signal carries the list of rules it was checked against (pass / fail / warn / unknown).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
from dataclasses import dataclass, field
from typing import Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))

import zones as Z  # noqa: E402
from zones import RAJA, Bar, Series  # noqa: E402

D1_WINDOW = 500           # bars of D1 history the rules see (every D1 look-back in the port is <= 420 bars)
APPROACH_H = 1.0          # InpApproach: within 1.0x the zone height ...
APPROACH_PCT = 0.03       # ... or 3% of price (whichever is larger) above the proximal
TP_OFFSET = 0.005         # target 0.5% before the next supply's proximal (Raja: just before the opposite zone)
EARN_DAYS = 10            # no earnings within 10 trading days
NEW_ZONE_SESSIONS = 5     # WATCH: zones made in the last 5 sessions
DISCLAIMER = 'Rule-based scan, not financial advice. Untested on stocks until the backtest says otherwise.'

PASS, FAIL, WARN, UNKNOWN = 'pass', 'fail', 'warn', 'unknown'


@dataclass
class Rule:
    status: str
    text: str
    ref: str
    short: str = ''

    def as_dict(self): return {'status': self.status, 'text': self.text, 'ref': self.ref, 'short': self.short}


SHORT = ['leg', 'fresh', 'strong', 'HTF align', 'curve', 'no HTF supply', 'room', 'not sideways', 'no 3rd CP',
         'not used', 'clean', 'near entry', 'earnings']
MIN_PRICE = float(os.environ.get('SCANNER_MIN_PRICE', '5'))            # Russell 2000 liquidity filter
MIN_DOLLAR_VOL = float(os.environ.get('SCANNER_MIN_DOLLAR_VOL', '5e6'))  # 20-day average dollar volume
REGIME = ['SPY', 'QQQ', 'IWM']


def raja_score(x: Z.DNA, fresh: bool) -> int:
    """Raja lens score (LensRun): type ARR / WOW 4, STR 3; fresh 2 (2nd touch 1); low curve 2, middle 1; room 3x 2, 2x 1. Max 10."""
    sr = 4 if x.code in ('ARR', 'WOW') else (3 if x.code == 'STR' else 0)
    sr += 2 if fresh else (1 if x.n_tests == 1 else 0)
    cz = x.curve_zone
    sr += 2 if cz <= RAJA['curve_low'] else (0 if cz >= RAJA['curve_high'] else 1)
    sr += 2 if x.room_r >= 3 else (1 if x.room_r >= 2 else 0)
    return min(10, sr)


@dataclass
class Analysis:
    price: float
    date: str
    d1: Z.Row
    w1: Z.Row
    mn: Z.Row
    direction: Z.Direction
    curve: Z.Curve
    dna: Dict[str, Z.DNA] = field(default_factory=dict)
    sideways: Dict[str, bool] = field(default_factory=dict)
    d1_dates: List[str] = field(default_factory=list)


def analyse(d1_bars: List[Bar], w1_bars: List[Bar], mn_bars: List[Bar], price: Optional[float] = None,
            row_cache: Optional[dict] = None, p=RAJA) -> Analysis:
    """Everything the rules need at the last closed D1 bar. w1_bars / mn_bars = CLOSED weekly / monthly bars.
    row_cache (backtest): reuses the W1 / MN rows while no new W1 / MN bar has closed (they read closed bars only)."""
    d1_bars = d1_bars[-D1_WINDOW:]
    px = d1_bars[-1].c if price is None else price
    S1 = Series(d1_bars, px, 'D1')
    d1 = Z.eval_row(S1, p)

    def row(bars, tf):
        key = (tf, bars[-1].d if bars else '', len(bars))
        if row_cache is not None and key in row_cache:
            r = row_cache[key]
            Z.set_in_zone(r, px)
            return r
        r = Z.eval_row(Series(bars, px, tf), p) if bars else Z.Row(tf=tf, S=Series([Bar('', px, px, px, px)], px, tf))
        if row_cache is not None:
            row_cache[key] = r
        return r
    w1, mn = row(w1_bars, 'W1'), row(mn_bars, 'MN')
    curve = Z.dir_curve(mn, px)
    direction = Z.dir_combine(d1, w1, mn, curve, p)
    an = Analysis(price=px, date=d1_bars[-1].d, d1=d1, w1=w1, mn=mn, direction=direction, curve=curve,
                  d1_dates=[b.d for b in d1_bars])
    an.sideways = {'D1': Z.sideways(S1, p) if d1.ok else False, 'W1': Z.sideways(w1.S, p) if w1.ok else False,
                   'MN': Z.sideways(mn.S, p) if mn.ok else False}
    # DNA of the demand zones under price (the scanner is long only) on D1 and W1
    for r, higher in ((d1, [w1, mn]), (w1, [mn])):
        if not r.ok:
            continue
        for i, z in enumerate(r.zones):
            if z.dir > 0 and not z.removed and z.dist < px:
                an.dna[z.zid] = Z.dna(r.S, r.zones, i, r.tl, higher, mn.zones if mn.ok else [], curve, mn if mn.ok else None, TP_OFFSET, p)
    return an


def trading_days_until(today: str, date: str) -> int:
    a, b = dt.date.fromisoformat(today), dt.date.fromisoformat(date)
    if b < a:
        return -1
    n, d = 0, a
    while d < b:
        d += dt.timedelta(days=1)
        if d.weekday() < 5:
            n += 1
    return n


def plan(z: Z.Zone, x: Z.DNA) -> Dict:
    """Owner's stop rule: distal - % of the zone height (D1 10%, W1 5%); target just before the next supply."""
    entry = z.prox
    stop = z.dist - x.stop_buf
    nxt = [(v, dd) for v, dd in ((x.opp, x.opp_dist) if x.has_opp else (0, 0), (x.opp_htf, x.opp_htf_dist) if x.has_opp_htf else (0, 0)) if v > entry]
    supply, supply_d = min(nxt) if nxt else (None, None)
    target = supply * (1 - TP_OFFSET) if supply else None
    rr = (target - entry) / (entry - stop) if target and entry > stop else None
    return {'entry': round(entry, 2), 'stop': round(stop, 2), 'target': round(target, 2) if target else None,
            'rr': round(rr, 2) if rr is not None else None, 'next_supply': round(supply, 2) if supply else None,
            'supply_distal': round(supply_d, 2) if supply_d else None,
            'stop_pct_of_height': RAJA['sl_pct'].get(z.tf, 5.0)}


def zone_rules(an: Analysis, z: Z.Zone, x: Z.DNA, earnings: Optional[str]) -> List[Rule]:
    px, D = an.price, an.direction
    approach = max(APPROACH_H * z.h, APPROACH_PCT * px)
    gap = px - z.prox
    R: List[Rule] = []
    R.append(Rule(PASS if z.leg_ratio >= 2.0 else WARN,
                  f'Zone: {z.base_n}-candle base, departure {z.leg_ratio:.1f}x the biggest base candle'
                  + ('' if z.leg_ratio >= 2.0 else ' (ZoneVision accepts 1.2x; the lesson asks 2x)'), 'L55'))
    fresh = x.n_tests == 0 and not z.removed
    R.append(Rule(PASS if fresh else FAIL, 'Fresh: price has not come back yet (first touch = set and forget)' if fresh
                  else f'Tested {x.n_tests}x: confirmation only, no set and forget', 'L2 · L52'))
    strong = x.code in ('ARR', 'WOW', 'STR')
    R.append(Rule(PASS if strong else FAIL, f'Zone type {x.code}: {Z.ZONE_TYPE_TEXT[x.code]}', 'L1 · L51'))
    up = D.dir > 0
    R.append(Rule(PASS if up else FAIL,
                  f'Direction {D.head} (W1 {an.w1.state_name}, MN {an.mn.state_name}, D1 {an.d1.state_name})'
                  + (f"; {'; '.join(D.notes)}" if D.notes else ''), 'L7 · L8 · L3'))
    cz = x.curve_zone
    ctxt = f'Curve {cz:.0f}% ' + ('(MN strong zones, proximal to proximal)' if an.curve.raja else '(no MN strong pair: 100-bar MN range)')
    R.append(Rule(PASS if cz <= RAJA['curve_low'] else (WARN if cz < 50 else FAIL),
                  ctxt + (': low curve, buyers only' if cz <= RAJA['curve_low'] else ': below 50%, confirmation side' if cz < 50 else ': upper half, no buys'), 'L4'))
    in_supply = D.lock < 0
    R.append(Rule(FAIL if (x.next_opp_htf or in_supply) else PASS,
                  'Inside / next to a monthly supply: it gets removed, no trade' if x.next_opp_htf
                  else 'Price sits inside a fresh monthly supply: wait until it is removed' if in_supply
                  else 'No monthly supply on top of the zone', 'L50 · L52'))
    p = plan(z, x)
    if p['target'] is None:
        R.append(Rule(FAIL, 'No supply zone above: no known target (never trade without a WOW target)', 'L101'))
    else:
        rr = p['rr'] or 0
        R.append(Rule(PASS if rr >= 3 else (WARN if rr >= 2 else FAIL),
                      f"Room {rr:.1f}x the stop to the next supply {p['next_supply']:.2f}" + (' (3x: good)' if rr >= 3 else ' (2x minimum)' if rr >= 2 else ' (< 2x: skip)'), 'L7 · L53'))
    sw = an.sideways.get(z.tf, False) or an.sideways.get('MN', False)
    R.append(Rule(FAIL if sw else PASS, f"Sideways on {z.tf if an.sideways.get(z.tf) else 'MN'}: never trade a meshing market" if sw
                  else f'Not sideways on {z.tf} or MN', 'L8 · L101'))
    R.append(Rule(FAIL if x.cp_run >= 3 else PASS, f'CP x{x.cp_run} in a row: do not trade the next one' if x.cp_run >= 3
                  else 'Not the 3rd CP in a row', 'L8 · Kevin L13'))
    R.append(Rule(FAIL if x.did_job else PASS, 'Already did its job (reached the next supply before coming back): confirmation only'
                  if x.did_job else 'Has not done its job yet (run-out stopped short of the next supply)', 'L5 · Feb 18'))
    weak = x.overlap or x.flip
    R.append(Rule(FAIL if weak else PASS, ('Overlap: formed inside / next to an old supply' if x.overlap else 'Flip area') + ': never set and forget'
                  if weak else 'Not an overlap or flip zone', 'L52'))
    near = -0.0001 <= gap <= approach or (z.lo <= px <= z.prox)
    R.append(Rule(PASS if near else FAIL, f'Price {gap / px * 100:+.1f}% from the entry (approach = {approach / px * 100:.1f}%)', 'Scanner'))
    if earnings:
        n = trading_days_until(an.date, earnings)
        ok = n < 0 or n > EARN_DAYS
        R.append(Rule(PASS if ok else FAIL, f'Earnings {earnings} ({n} trading days)' if n >= 0 else 'No upcoming earnings date', 'Kevin L12'))
    else:
        R.append(Rule(UNKNOWN, 'Earnings date unknown: check before the order', 'Kevin L12'))
    for k, r in enumerate(R):
        r.short = SHORT[k] if k < len(SHORT) else ''
    return R


def _zone_dict(an: Analysis, z: Z.Zone, x: Z.DNA) -> Dict:
    return {'tf': z.tf, 'zone_type': x.code, 'zone_type_text': Z.ZONE_TYPE_TEXT[x.code], 'pattern': z.pattern,
            'proximal': round(z.prox, 2), 'distal': round(z.dist, 2), 'height': round(z.h, 2), 'base_candles': z.base_n,
            'departure_x': round(z.leg_ratio, 2), 'made': z.made, 'base_start': z.base_start, 'touches': x.n_tests,
            'curve': round(x.curve_zone, 1), 'room_r': round(x.room_r, 2) if x.room_r < 99 else None}


def symbol_signals(an: Analysis, earnings: Optional[str] = None) -> List[Dict]:
    """BUY and WATCH signals of one ticker from its analysis."""
    out: List[Dict] = []
    px = an.price
    recent = an.d1_dates[-NEW_ZONE_SESSIONS] if len(an.d1_dates) >= NEW_ZONE_SESSIONS else an.d1_dates[0]
    for r in (an.d1, an.w1):
        if not r.ok:
            continue
        for z in r.zones:
            x = an.dna.get(z.zid)
            if x is None or z.leg_bar > RAJA['max_zone_age']:
                continue
            rules = zone_rules(an, z, x, earnings)
            fails = [k for k in rules if k.status == FAIL]
            approach_rule = next(k for k in rules if k.ref == 'Scanner')
            p = plan(z, x)
            base = {**_zone_dict(an, z, x), **p, 'price': round(px, 2), 'score': raja_score(x, x.n_tests == 0 and not z.removed),
                    'to_entry_pct': round((px - z.prox) / px * 100, 2), 'direction': an.direction.head,
                    'w1': an.w1.state_name, 'mn': an.mn.state_name, 'rules': [k.as_dict() for k in rules]}
            if not fails:
                out.append({**base, 'kind': 'BUY', 'note': 'Set and forget: limit at the proximal, stop and target in the market.'})
                continue
            strong = x.code in ('ARR', 'WOW', 'STR')
            if not strong:
                continue
            others = [k for k in fails if k is not approach_rule]
            if x.n_tests == 0 and z.made >= recent and not others and approach_rule.status == FAIL:
                out.append({**base, 'kind': 'WATCH', 'watch': 'new', 'note': f'New {z.tf} zone made {z.made}; price still far. Wait for it to come back.'})
            elif (1 <= x.n_tests <= 2 and not z.removed and all(k.ref in ('L2 · L52', 'Scanner') for k in fails)
                  and (px - z.prox) <= 2 * max(APPROACH_H * z.h, APPROACH_PCT * px)):
                word = '2nd' if x.n_tests == 1 else '3rd'
                out.append({**base, 'kind': 'WATCH', 'watch': 'tested',
                            'note': f'{word} touch: needs confirmation one timeframe lower (D1 -> H1: trendline cross + opposite zone removed, or a close back above the proximal).'})
    # one BUY per timeframe: the nearest zone to price (Raja: trade the nearest zone until it is removed)
    best: Dict[str, Dict] = {}
    rest = []
    for s in out:
        if s['kind'] != 'BUY':
            rest.append(s)
            continue
        k = s['tf']
        if k not in best or s['entry'] > best[k]['entry']:
            best[k] = s
    return list(best.values()) + rest


def holding_exits(an: Analysis, h: Dict) -> List[Dict]:
    """EXIT warnings for one holding: stop hit by close, the demand under the entry broken by a close, price within
    one zone height of the next supply's proximal (or inside it)."""
    px, out = an.price, []
    entry, stop = float(h.get('entry') or 0), h.get('stop')
    if stop is not None and px <= float(stop):
        out.append({'reason': 'stop', 'text': f'Stop hit by the close ({px:.2f} <= {float(stop):.2f}): close the position.'})
    since = str(h.get('date') or '') or (an.d1_dates[-NEW_ZONE_SESSIONS] if len(an.d1_dates) >= NEW_ZONE_SESSIONS else '')
    for r in (an.d1, an.w1):
        if not r.ok:
            continue
        for z in sorted(r.zones, key=lambda z: -z.prox):
            if z.dir < 0 or not (z.lo <= entry <= z.prox + z.h) or (h.get('date') and z.made > str(h['date'])):
                continue
            when = r.S.T[z.removed_bar] if z.removed else ''
            if z.removed and when >= since:
                out.append({'reason': 'demand_broken', 'text': f'{z.tf} demand {z.dist:.2f}-{z.prox:.2f} under the entry broken by a close on {when}.'})
                break
    sup = []
    for r in (an.d1, an.w1, an.mn):
        if not r.ok:
            continue
        for z in r.zones:
            if z.dir < 0 and Z.fresh_at(r.S, z) and z.dist > px:
                sup.append(z)
    if sup:
        z = min(sup, key=lambda z: z.prox)
        if z.prox <= px:
            out.append({'reason': 'in_supply', 'tf': z.tf, 'lo': round(z.prox, 2), 'hi': round(z.dist, 2), 'dist_pct': 0.0,
                        'text': f'Inside the {z.tf} supply {z.prox:.2f}-{z.dist:.2f}: take profit (exit before the opposite zone).'})
        elif z.prox - px <= z.h:
            out.append({'reason': 'near_supply', 'tf': z.tf, 'lo': round(z.prox, 2), 'hi': round(z.dist, 2), 'dist_pct': round((z.prox - px) / px * 100, 2), 'text': f'{(z.prox - px) / px * 100:.1f}% below the {z.tf} supply at {z.prox:.2f}: exit before the opposite zone.'})
    return out


# ---- pipeline -----------------------------------------------------------------------------------------------------
def load_holdings() -> List[Dict]:
    raw = os.environ.get('HOLDINGS_JSON')
    if raw:
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            print('HOLDINGS_JSON is not valid JSON; ignored', file=sys.stderr)
            return []
    path = os.path.join(HERE, 'holdings.json')
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return []


CHART_BARS = 126   # about 6 months of daily bars per signalled ticker (the card shows the last 60)


def compact_bars(bars: List[Bar], n: int = CHART_BARS) -> list:
    """[[date, o, h, l, c], ...] rounded, for the app's mini chart (only signalled tickers)."""
    nd = 2 if bars and bars[-1].c >= 1 else 4
    return [[b.d, round(b.o, nd), round(b.h, nd), round(b.l, nd), round(b.c, nd)] for b in bars[-n:]]


def regime_line(an: Analysis, sym: str) -> Dict:
    c = [b for b in an.d1.S.C[1:201]]
    sma = sum(c) / len(c) if len(c) >= 200 else None
    return {'symbol': sym, 'close': round(an.price, 2), 'sma200': round(sma, 2) if sma else None,
            'above200': (an.price > sma) if sma else None, 'curve': round(an.curve.value, 1) if an.curve.ok else None,
            'curve_raja': an.curve.raja, 'direction': an.direction.head, 'w1': an.w1.state_name, 'mn': an.mn.state_name}


def liquid(u: Dict, bars: List[Bar]) -> bool:
    """Russell 2000 only names (not in SPX / NDX / DJI) must trade >= $5 with >= $5M average dollar volume (20 days)."""
    idx = set((u.get('indexes') or 'SPX').split(','))
    if idx - {'RUT'}:
        return True
    import data as DATA
    px, dv = DATA.liquidity(bars)
    return px >= MIN_PRICE and dv >= MIN_DOLLAR_VOL


def run(universe: List[Dict], get_bars, get_cf, get_earnings, holdings: List[Dict], today: Optional[str] = None,
        log=print) -> Dict:
    """Scan every ticker. get_bars(sym) -> (daily bars, meta); get_cf(cik) -> companyfacts or None;
    get_earnings(sym) -> ISO date or None. Returns the full result (holdings details included)."""
    import data as DATA
    import fundamentals as F
    held = {str(h.get('symbol', '')).upper(): h for h in holdings}
    syms = {u['symbol'] for u in universe} | set(held)
    info = {u['symbol']: u for u in universe}
    sigs, exits, errors, notes = [], [], [], []
    filtered: List[str] = []
    chart_bars: Dict[str, list] = {}
    regime = []
    last_date = today or ''
    for sym in REGIME:
        try:
            rb, _ = get_bars(sym)
            if len(rb) >= 250:
                regime.append(regime_line(analyse(rb, DATA.closed_htf(rb, 'W1'), DATA.closed_htf(rb, 'MN')), sym))
        except Exception as e:  # noqa: BLE001
            notes.append(f'regime {sym}: {e}')
    for n, sym in enumerate(sorted(syms)):
        try:
            bars, meta = get_bars(sym)
        except Exception as e:  # noqa: BLE001
            errors.append(f'{sym}: {e}')
            continue
        if len(bars) < 250:
            errors.append(f'{sym}: only {len(bars)} bars')
            continue
        last_date = max(last_date, bars[-1].d)
        u0 = info.get(sym)
        if u0 is not None and sym not in held and not liquid(u0, bars):
            filtered.append(sym)
            continue
        an = analyse(bars, DATA.closed_htf(bars, 'W1'), DATA.closed_htf(bars, 'MN'))
        u = info.get(sym, {'symbol': sym, 'name': sym, 'sector': '', 'cik': ''})
        found = []
        if sym in info:
            pre = symbol_signals(an, None)
            if pre and any(s['kind'] == 'BUY' or s['kind'] == 'WATCH' for s in pre):
                er = get_earnings(sym)
                found = symbol_signals(an, er) if er else pre
                if found:
                    for s in found:
                        s['earnings'] = er
        for s in found:
            s.update({'symbol': sym, 'name': u.get('name', sym), 'sector': u.get('sector', '') or 'Other',
                      'indexes': (u.get('indexes') or 'SPX').split(','), 'exchange': meta.get('exchange', ''),
                      'chart': DATA.tradingview_url(sym, meta.get('exchange', ''))})
        if found:
            try:
                cf = get_cf(u.get('cik', ''))
            except Exception as e:  # noqa: BLE001
                cf = None
                notes.append(f'{sym} SEC: {e}')
            fz = F.compute(cf, an.price, [b.h for b in bars], [b.l for b in bars])
            for s in found:
                s['fundamentals'] = fz
                s['fundamentals_rows'] = F.rows(fz)
            sigs.extend(found)
            chart_bars[sym] = compact_bars(bars)
        if sym in held:
            ex = holding_exits(an, held[sym])
            if ex:
                exits.append({'symbol': sym, 'name': u.get('name', sym), 'sector': u.get('sector', '') or 'Other',
                              'indexes': (u.get('indexes') or '').split(',') if u.get('indexes') else [], 'price': round(an.price, 2), 'warnings': ex,
                              'entry': held[sym].get('entry'), 'stop': held[sym].get('stop'), 'shares': held[sym].get('shares'),
                              'chart': DATA.tradingview_url(sym, meta.get('exchange', ''))})
        if log and (n + 1) % 50 == 0:
            log(f'{n + 1}/{len(syms)} scanned')
    order = {'BUY': 0, 'WATCH': 1}
    sigs.sort(key=lambda s: (order[s['kind']], -s.get('score', 0), -(s.get('rr') or 0), abs(s['to_entry_pct'])))
    return {'date': last_date, 'generated_at': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'universe': len(universe), 'scanned': len(syms) - len(errors) - len(filtered), 'errors': errors, 'notes': notes, 'signals': sigs, 'exits': exits,
            'filtered_liquidity': len(filtered), 'bars': chart_bars, 'regime': regime, 'universes': sorted({i for u in universe for i in (u.get('indexes') or 'SPX').split(',')}),
            'index_sizes': {i: sum(1 for u in universe if i in (u.get('indexes') or 'SPX').split(',')) for i in ('SPX', 'NDX', 'DJI', 'RUT')}}


def public_json(res: Dict, fixture: bool = False) -> Dict:
    """What the app may read: signals + fundamentals; holdings only as symbols and warning kinds (no sizes, no prices)."""
    return {
        'version': 1, 'fixture': fixture, 'date': res['date'], 'generated_at': res['generated_at'],
        'universe': res['universe'], 'scanned': res['scanned'], 'errors': len(res['errors']),
        'rules': 'Raja (ZoneVision Raja template): D1 / W1 zones, direction D1 -> W1 -> MN, curve, room. Kevin second.',
        'disclaimer': DISCLAIMER,
        'counts': {k: sum(1 for s in res['signals'] if s['kind'] == k) for k in ('BUY', 'WATCH')} | {'EXIT': len(res['exits'])},
        'universes': res.get('universes', []), 'index_sizes': res.get('index_sizes', {}),
        'filtered_liquidity': res.get('filtered_liquidity', 0),
        'liquidity_rule': f'Russell 2000-only names need price >= ${MIN_PRICE:g} and 20-day average dollar volume >= ${MIN_DOLLAR_VOL / 1e6:g}M',
        'rut_snapshot': res.get('rut_snapshot', ''),
        'regime': res.get('regime', []),
        'signals': res['signals'],
        'bars': res.get('bars', {}),
        'exits': [{'symbol': e['symbol'], 'sector': e.get('sector', ''), 'indexes': e.get('indexes', []),
                   'reasons': sorted({w['reason'] for w in e['warnings']})} for e in res['exits']],
    }


def write_outputs(res: Dict, out_dir: str, fixture: bool = False) -> str:
    pub = public_json(res, fixture)
    os.makedirs(os.path.join(out_dir, 'history'), exist_ok=True)
    path = os.path.join(out_dir, 'latest.json')
    with open(path, 'w') as f:
        json.dump(pub, f, separators=(',', ':'))
        f.write('\n')
    with open(os.path.join(out_dir, 'history', f"{res['date'] or 'unknown'}.json"), 'w') as f:
        json.dump(pub, f, separators=(',', ':'))
        f.write('\n')
    return path


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--tickers', help='comma-separated subset (default: every enabled universe in universe.csv)')
    ap.add_argument('--universes', help='e.g. SPX,NDX,DJI,RUT (default env SCANNER_UNIVERSES or all four)')
    ap.add_argument('--limit', type=int, default=0, help='first N tickers only')
    ap.add_argument('--workers', type=int, default=int(os.environ.get('SCANNER_WORKERS', '6')), help='download threads')
    ap.add_argument('--top', type=int, default=int(os.environ.get('TELEGRAM_TOP_N', '5')), help='Telegram: top N per sector')
    ap.add_argument('--offline', action='store_true', help='use cached data only')
    ap.add_argument('--no-notify', action='store_true')
    ap.add_argument('--no-write', action='store_true')
    ap.add_argument('--out', default=os.path.join(ROOT, 'public', 'scanner'))
    ap.add_argument('--selftest', action='store_true', help='run the whole pipeline on synthetic fixtures')
    a = ap.parse_args(argv)
    import notify
    if a.selftest:
        import selftest
        return selftest.main(a.out if '--out' in (argv or sys.argv) else None)
    import time
    import data as DATA
    import fundamentals as F
    import universe as U
    t0 = time.time()
    if a.universes:
        os.environ['SCANNER_UNIVERSES'] = a.universes
    uni = U.load()
    if a.tickers:
        want = {t.strip().upper() for t in a.tickers.split(',') if t.strip()}
        uni = [u for u in U.load(indexes=U.INDEXES) if u['symbol'] in want] + [
            {'symbol': t, 'name': t, 'sector': '', 'cik': '', 'indexes': ''} for t in want - {u['symbol'] for u in U.load(indexes=U.INDEXES)}]
    if a.limit:
        uni = uni[:a.limit]
    holdings = load_holdings()
    syms = sorted({u['symbol'] for u in uni} | {str(h.get('symbol', '')).upper() for h in holdings} | set(REGIME))
    print(f'{len(syms)} tickers, {a.workers} download threads', file=sys.stderr)
    pre = DATA.fetch_many(syms, workers=a.workers, offline=a.offline, log=lambda m: print(m, file=sys.stderr))
    fetch_err = pre.pop('__errors__', {})

    def get_bars(s):
        if s in pre:
            return pre[s]
        raise RuntimeError(fetch_err.get(s, 'no data'))
    res = run(uni, get_bars, lambda c: F.fetch_companyfacts(c, offline=a.offline),
              (lambda s: None) if a.offline else DATA.fetch_earnings, holdings, log=lambda m: print(m, file=sys.stderr))
    res['rut_snapshot'] = U.snapshot_date()
    if not a.no_write:
        print('wrote', write_outputs(res, a.out))
    msgs = notify.build_messages(res, top=a.top)
    if a.no_notify:
        print('\n\n'.join(msgs))
    else:
        notify.send(msgs)
    print(f"done in {time.time() - t0:.0f}s: {res['scanned']} scanned, {res['filtered_liquidity']} filtered (liquidity), "
          f"{len(res['errors'])} without data", file=sys.stderr)
    return 0 if res['scanned'] > 0 else 1


if __name__ == '__main__':
    sys.exit(main())
