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
from typing import Dict, List, Optional, Tuple

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

PASS, FAIL, WARN, UNKNOWN, INFO = 'pass', 'fail', 'warn', 'unknown', 'info'


@dataclass
class Rule:
    status: str
    text: str
    ref: str
    short: str = ''

    def as_dict(self): return {'status': self.status, 'text': self.text, 'ref': self.ref, 'short': self.short}


SHORT = ['leg', 'fresh', 'strong', 'HTF align', 'curve', 'no HTF supply', 'room', 'not sideways', 'no 3rd CP',
         'not used', 'clean', 'near entry', 'earnings']
REGIME = ['SPY', 'QQQ', 'IWM']
INDEX_PARTS = ['SPY', 'QQQ', 'IWM', 'DIA']   # the RFX composite index: equal weight, 100 on the first common date
FV_BARS = 20


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
    fv: Optional[Z.FairValue] = None
    index: Optional[Dict] = None          # the composite index's gauge (set by the caller), None = unknown


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
    an.fv = Z.fair_value(S1, FV_BARS)
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
    # Pinndx-inspired context lines: never FAIL, so they can never block or change a BUY (Raja rules decide)
    fd = fv_dist_atr(an, z)
    if an.fv is not None and fd is not None:
        inside = an.fv.lo <= z.prox <= an.fv.hi
        R.append(Rule(WARN if inside else (PASS if fd >= 1 else INFO),
                      f'Fair value {an.fv.lo:.2f}-{an.fv.hi:.2f} (20-bar value area): ' + ('zone inside it, equilibrium (flag only)' if inside
                      else f'zone {fd:.1f} ATR below it' + (' (+1 Seiden)' if fd >= 1 else '')), 'Seiden L46 · L89', 'FV'))
    ix = an.index
    if ix:
        al = index_aligned(ix)
        R.append(Rule(PASS if al else (WARN if ix['state'] == 'supply' else INFO),
                      'RFX index ' + ('in / near a fresh demand: aligned (+1 Seiden)' if al else 'in a supply: opposite zone, take care (flag only)'
                                      if ix['state'] == 'supply' else 'in the middle: no confirmation'), 'Pinndx-inspired', 'index'))
    return R


def fv_dist_atr(an: Analysis, z: Z.Zone) -> Optional[float]:
    """(fair value low - demand proximal) / ATR14 (D1); positive = the zone sits below fair value."""
    a = an.d1.S.atr(1) if an.d1.ok else 0
    if an.fv is None or a <= 0:
        return None
    return (an.fv.lo - z.prox) / a if z.dir > 0 else (z.prox - an.fv.hi) / a


def nearest_fresh(an: Analysis):
    """(state, nearest fresh demand below + its row index, nearest fresh supply above + its row index) on D1 / W1.
    state = 'demand' / 'supply' when price is inside a fresh zone, else 'middle'."""
    px, dem, sup, state = an.price, None, None, 'middle'
    for r in (an.d1, an.w1):
        if not r.ok:
            continue
        for i, z in enumerate(r.zones):
            if z.leg_bar > RAJA['max_zone_age'] or not Z.fresh_at(r.S, z):
                continue
            if z.lo <= px <= z.hi:
                state = 'demand' if z.dir > 0 else 'supply'
            if z.dir > 0 and z.dist < px and (dem is None or z.prox > dem[0].prox):
                dem = (z, r, i)
            if z.dir < 0 and z.dist > px and (sup is None or z.prox < sup[0].prox):
                sup = (z, r, i)
    return state, dem, sup


def gauge(an: Analysis) -> Dict:
    """Nearest fresh D1 / W1 demand below / supply above, % away, and the state (in demand / in supply / middle)."""
    px = an.price
    state, dm, sp = nearest_fresh(an)
    dem, sup = (dm[0] if dm else None), (sp[0] if sp else None)
    nz = lambda z, pct: None if z is None else {'tf': z.tf, 'proximal': round(z.prox, 2), 'distal': round(z.dist, 2), 'height': round(z.h, 2), 'pct': round(pct, 2)}
    return {'price': round(px, 2), 'state': state, 'date': an.date, 'direction': an.direction.head,
            'demand': nz(dem, (px - dem.prox) / px * 100 if dem else 0), 'supply': nz(sup, (sup.prox - px) / px * 100 if sup else 0)}


def index_aligned(ix: Optional[Dict]) -> bool:
    """The composite index sits in a fresh demand or within the approach distance above one."""
    if not ix:
        return False
    if ix['state'] == 'demand':
        return True
    d = ix.get('demand')
    return bool(d) and ix['state'] != 'supply' and d['pct'] <= max(APPROACH_PCT * 100, d['height'] / ix['price'] * 100 * APPROACH_H)


WATCH_PCT = float(os.environ.get('WATCHLIST_APPROACH_PCT', '3'))   # APPROACH alert: close within X% above a proximal


def watch_alerts(sym: str, an: Analysis, last: Bar, pct: float = WATCH_PCT) -> List[Dict]:
    """Close-based alerts for a watched ticker: APPROACH (close within pct% above a fresh demand proximal),
    IN ZONE (the low reached the proximal and the close held above the distal), IN SUPPLY (price inside a fresh
    supply: Raja vetoes buys there)."""
    g = gauge(an)
    out = []
    d = g['demand']
    if d and last.l <= d['proximal'] and last.c >= d['distal']:
        out.append({'symbol': sym, 'kind': 'IN ZONE', 'zone': d, 'text': f"{sym}: in the {d['tf']} demand {d['distal']:.2f}–{d['proximal']:.2f} (close {last.c:.2f})"})
    elif d and 0 <= d['pct'] <= pct:
        out.append({'symbol': sym, 'kind': 'APPROACH', 'zone': d, 'text': f"{sym}: {d['pct']:.1f}% above the {d['tf']} demand {d['distal']:.2f}–{d['proximal']:.2f}"})
    if g['state'] == 'supply':
        s_ = g['supply'] or {}
        out.append({'symbol': sym, 'kind': 'IN SUPPLY', 'zone': s_, 'text': f'{sym}: inside a fresh supply (no buys there)'})
    return out


def index_alert(ix: Optional[Dict]) -> List[Dict]:
    if not ix or ix['state'] == 'middle':
        return []
    z = ix['demand'] if ix['state'] == 'demand' else ix['supply']
    return [{'symbol': 'RFX', 'kind': 'INDEX', 'zone': z or {}, 'text': f"RFX index in {ix['state']} (close {ix['price']:.2f})"}]


def dedupe_alerts(alerts: List[Dict], state: Dict[str, str], today: str, days: int = 5) -> List[Dict]:
    """Drop alerts already sent for the same ticker, kind and zone in the last `days` calendar days; updates state."""
    out = []
    t = dt.date.fromisoformat(today) if today else dt.date.today()
    for a in alerts:
        key = f"{a['symbol']}|{a['kind']}|{(a.get('zone') or {}).get('proximal', '')}"
        prev = state.get(key)
        if prev and (t - dt.date.fromisoformat(prev)).days < days:
            continue
        state[key] = t.isoformat()
        out.append(a)
    return out


def load_watchlist() -> List[str]:
    raw = os.environ.get('WATCHLIST', '')
    return sorted({x.strip().upper() for x in raw.replace(';', ',').replace(' ', ',').split(',') if x.strip()})


def composite_bars(parts: Dict[str, List[Bar]]) -> List[Bar]:
    """Equal-weight composite of the parts on their common dates, 100 on the first one. O/H/L/C = the mean of each
    part's normalised O/H/L/C (an approximation: the composite's true intraday high can be lower)."""
    if not parts or any(not b for b in parts.values()):
        return []
    common = sorted(set.intersection(*({b.d for b in bs} for bs in parts.values())))
    if not common:
        return []
    maps = {k: {b.d: b for b in bs} for k, bs in parts.items()}
    base = {k: maps[k][common[0]].c for k in parts}
    n = len(parts)
    out = []
    for d in common:
        o = h = l = c = 0.0
        for k in parts:
            b, f = maps[k][d], 100.0 / base[k]
            o, h, l, c = o + b.o * f, h + b.h * f, l + b.l * f, c + b.c * f
        out.append(Bar(d, o / n, h / n, l / n, c / n, 0.0))
    return out


def index_context(bars: List[Bar]) -> Optional[Dict]:
    if len(bars) < 250:
        return None
    import data as DATA
    an = analyse(bars, DATA.closed_htf(bars, 'W1'), DATA.closed_htf(bars, 'MN'))
    g = gauge(an)
    g.update({'symbol': 'RFX', 'name': 'RFX index (equal-weight SPY, QQQ, IWM, DIA)', 'w1': an.w1.state_name, 'mn': an.mn.state_name,
              'curve': round(an.curve.value, 1) if an.curve.ok else None, 'bars': compact_bars(bars)})
    g['aligned'] = index_aligned(g)
    return g


def pinndx_fields(an: Analysis, z: Z.Zone, x: Z.DNA, p: Dict) -> Dict:
    """Display-only extras of a signal: fair value, PZ1-3, Seiden odds score, index alignment, the gauge."""
    fv, fd = an.fv, fv_dist_atr(an, z)
    pz = Z.pz_levels(p['entry'], p['stop'], p['target'], fv)
    if pz['pz3'] is not None and p.get('rr') is not None:
        pz['rr_pz3'] = p['rr']                                   # PZ3 = the Raja target: same R:R as the plan
    al = index_aligned(an.index)
    sd = Z.seiden_score(z, x, an.direction, fd, al)
    px = an.price
    sup = p.get('next_supply')
    state = 'demand' if z.lo <= px <= z.hi else ('supply' if sup and px >= sup else 'middle')
    return {'fv_lo': round(fv.lo, 2) if fv else None, 'fv_hi': round(fv.hi, 2) if fv else None, 'fv_method': fv.method if fv else None,
            'fv_dist_atr': round(fd, 2) if fd is not None else None, 'fv_inside': bool(fv and fv.lo <= z.prox <= fv.hi),
            **pz, 'seiden_score': sd['score'], 'seiden_parts': sd['parts'],
            'index_state': an.index['state'] if an.index else None, 'index_aligned': al,
            'gauge_state': state, 'demand_pct_away': round((px - z.prox) / px * 100, 2),
            'supply_pct_away': round((sup - px) / px * 100, 2) if sup else None}


def listing(u: Dict) -> Dict:
    """Where the scanned symbol lives: home listing (e.g. 'TSX:RY' for an interlisted Canadian name, '' for a US
    one), the price currency and the issuer country (a Canadian filer has no SEC fundamentals: the app says so)."""
    home = u.get('home', '') or ''
    return {'home': home, 'currency': u.get('currency') or 'USD', 'country': 'CA' if home.startswith('TSX:') else 'US'}


def _zone_dict(an: Analysis, z: Z.Zone, x: Z.DNA) -> Dict:
    return {'tf': z.tf, 'zone_type': x.code, 'zone_type_text': Z.ZONE_TYPE_TEXT[x.code], 'pattern': z.pattern,
            'proximal': round(z.prox, 2), 'distal': round(z.dist, 2), 'height': round(z.h, 2), 'base_candles': z.base_n,
            'departure_x': round(z.leg_ratio, 2), 'made': z.made, 'base_start': z.base_start, 'touches': x.n_tests,
            'curve': round(x.curve_zone, 1), 'room_r': round(x.room_r, 2) if x.room_r < 99 else None}


def known_date(an: Analysis, z: Z.Zone) -> str:
    """The D1 session on which the zone became known: its stay-away candle's close. z.made is the stay-away bar's
    FIRST trading day, which on W1 is the Monday of that week; the week closes on its last session (usually Friday).
    Comparing the Monday against "5 sessions ago" dropped every W1 zone made last week from WATCH 'new'."""
    if z.tf == 'D1' or not z.made:
        return z.made
    try:
        wk = dt.date.fromisoformat(z.made).isocalendar()[:2]
    except ValueError:
        return z.made
    same = [d for d in an.d1_dates if dt.date.fromisoformat(d).isocalendar()[:2] == wk]
    return same[-1] if same else z.made


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
            base = {**_zone_dict(an, z, x), **p, **pinndx_fields(an, z, x, p), 'price': round(px, 2), 'score': raja_score(x, x.n_tests == 0 and not z.removed),
                    'to_entry_pct': round((px - z.prox) / px * 100, 2), 'direction': an.direction.head,
                    'w1': an.w1.state_name, 'mn': an.mn.state_name, 'rules': [k.as_dict() for k in rules]}
            if not fails:
                out.append({**base, 'kind': 'BUY', 'note': 'Set and forget: limit at the proximal, stop and target in the market.'})
                continue
            strong = x.code in ('ARR', 'WOW', 'STR')
            if not strong:
                continue
            others = [k for k in fails if k is not approach_rule]
            if x.n_tests == 0 and known_date(an, z) >= recent and not others and approach_rule.status == FAIL:
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


SHARDS = 64          # per-ticker details live in 64 shard files (see write_outputs)
DETAIL_BARS = 120


def shard_of(sym: str) -> int:
    import zlib
    return zlib.crc32(sym.encode()) % SHARDS


def pack_bars(bars: List[Bar], n: int = DETAIL_BARS) -> Dict:
    """Compact bars: first date, day offsets, [o, h, l, c] rounded (2 decimals; 4 under $1)."""
    bs = bars[-n:]
    if not bs:
        return {'t0': '', 'dt': [], 'b': []}
    d0 = dt.date.fromisoformat(bs[0].d)
    nd = 2 if bs[-1].c >= 1 else 4
    return {'t0': bs[0].d, 'dt': [(dt.date.fromisoformat(b.d) - d0).days for b in bs],
            'b': [[round(b.o, nd), round(b.h, nd), round(b.l, nd), round(b.c, nd)] for b in bs]}


def ticker_detail(sym: str, u: Dict, an: Analysis, bars: List[Bar], meta: Dict, fund_rows, signals: List[Dict],
                  block: Optional[Dict] = None) -> Tuple[Dict, Dict]:
    """(detail for the stock page, row for the search index). Every active D1 / W1 zone with its Raja type, the
    nearest demand / supply, and the nearest demand checked against every BUY rule as if it were a signal."""
    import data as DATA
    px = an.price
    zl, near_d, near_s = [], None, None
    for r, higher in ((an.d1, [an.w1, an.mn]), (an.w1, [an.mn])):
        if not r.ok:
            continue
        for i, z in enumerate(r.zones):
            if z.removed or z.leg_bar > RAJA['max_zone_age']:
                continue
            x = an.dna.get(z.zid) or Z.dna(r.S, r.zones, i, r.tl, higher, an.mn.zones if an.mn.ok else [], an.curve, an.mn if an.mn.ok else None, TP_OFFSET)
            fresh = x.n_tests == 0
            zl.append({'tf': z.tf, 'side': 'demand' if z.dir > 0 else 'supply', 'proximal': round(z.prox, 2), 'distal': round(z.dist, 2),
                       'type': x.code, 'score': raja_score(x, fresh) if z.dir > 0 else None, 'fresh': fresh, 'touches': x.n_tests,
                       'made': z.made, 'pattern': z.pattern})
            if z.dir > 0 and z.dist < px and (near_d is None or z.prox > near_d[0].prox):
                near_d = (z, x)
            if z.dir < 0 and z.dist > px and Z.fresh_at(r.S, z) and (near_s is None or z.prox < near_s[0].prox):
                near_s = (z, x)
    zl.sort(key=lambda q: -q['proximal'])

    def nz(t):
        if t is None:
            return None
        z = t[0]
        return {'tf': z.tf, 'proximal': round(z.prox, 2), 'distal': round(z.dist, 2), 'type': t[1].code,
                'dist_pct': round((px - z.prox) / px * 100 if z.dir > 0 else (z.prox - px) / px * 100, 2)}
    check = None
    kinds = [x['kind'] for x in signals]
    buy = next((x for x in signals if x['kind'] == 'BUY'), None)
    if buy is not None:                                   # the signal's own zone and rule list
        check = {'zone': {'tf': buy['tf'], 'proximal': buy['proximal'], 'distal': buy['distal'], 'type': buy['zone_type'],
                          'dist_pct': buy['to_entry_pct']}, 'kind': 'BUY', 'score': buy.get('score'),
                 **{k: buy.get(k) for k in ('entry', 'stop', 'target', 'rr', 'next_supply', 'supply_distal', 'stop_pct_of_height')},
                 'rules': buy['rules']}
    elif near_d is not None:
        z, x = near_d
        rules = zone_rules(an, z, x, None)
        check = {'zone': nz(near_d), 'kind': 'BUY' if not any(k.status == FAIL for k in rules) else 'no trade',
                 'score': raja_score(x, x.n_tests == 0), **plan(z, x), 'rules': [k.as_dict() for k in rules]}
    sig = 'BUY' if 'BUY' in kinds else ('WATCH' if 'WATCH' in kinds else None)
    detail = {'symbol': sym, 'name': u.get('name', sym), 'sector': u.get('sector', '') or 'Other',
              'indexes': [i for i in (u.get('indexes') or '').split(',') if i], 'exchange': meta.get('exchange', ''),
              'chart': DATA.tradingview_url(sym, meta.get('exchange', ''), u.get('home', '')), 'date': an.date, 'price': round(px, 2),
              **listing(u), 'signal': sig, 'direction': an.direction.head, 'd1': an.d1.state_name, 'w1': an.w1.state_name,
              'mn': an.mn.state_name, 'curve': round(an.curve.value, 1) if an.curve.ok else None, 'curve_raja': an.curve.raja,
              'zones': zl, 'nearest_demand': nz(near_d), 'nearest_supply': nz(near_s), 'check': check,
              'fundamentals_rows': fund_rows or [], 'bars': pack_bars(bars)}
    g = gauge(an)
    detail['gauge'] = {'state': g['state'], 'demand': g['demand'], 'supply': g['supply']}
    detail['fv'] = {'lo': round(an.fv.lo, 2), 'hi': round(an.fv.hi, 2), 'method': an.fv.method} if an.fv else None
    if detail['check'] is not None and near_d is not None and buy is None:
        z, x = near_d
        detail['check'].update(pinndx_fields(an, z, x, plan(z, x)))
    elif detail['check'] is not None and buy is not None:
        detail['check'].update({k: buy.get(k) for k in ('pz1', 'pz2', 'pz3', 'rr_pz1', 'rr_pz2', 'rr_pz3', 'seiden_score', 'seiden_parts',
                                                         'fv_dist_atr', 'fv_inside', 'index_state', 'index_aligned')})
    row = {'s': sym, 'n': detail['name'], 'st': g['state'][0].upper(), 'sec': detail['sector'], 'ix': detail['indexes'], 'px': detail['price'],
           'dd': g['demand']['pct'] if g['demand'] else None, 'ds': g['supply']['pct'] if g['supply'] else None,
           'sig': sig, 'k': shard_of(sym), **map_fields(an), 'br': block['rule'] if block and not sig else None,
           'h': u.get('home') or None, 'cur': u.get('currency') if u.get('currency') not in (None, '', 'USD') else None}
    return detail, {k: v for k, v in row.items() if v is not None}


def map_fields(an: Analysis) -> Dict:
    """Market map (index.json, compact): the nearest fresh demand dz = [tf, type, Raja score, touches] and supply
    sz = [tf, type, touches]; types are the Raja zone types (ARR / WOW / STR strong)."""
    out: Dict = {}
    _, dm, sp = nearest_fresh(an)
    mn = an.mn if an.mn.ok else None
    for key, t in (('dz', dm), ('sz', sp)):
        if t is None:
            continue
        z, r, i = t
        higher = [an.w1, an.mn] if r is an.d1 else [an.mn]
        x = an.dna.get(z.zid) or Z.dna(r.S, r.zones, i, r.tl, higher, mn.zones if mn else [], an.curve, mn, TP_OFFSET)
        out[key] = [z.tf, x.code, raja_score(x, x.n_tests == 0), x.n_tests] if key == 'dz' else [z.tf, x.code, x.n_tests]
    return out


def regime_line(an: Analysis, sym: str) -> Dict:
    c = [b for b in an.d1.S.C[1:201]]
    sma = sum(c) / len(c) if len(c) >= 200 else None
    return {'symbol': sym, 'close': round(an.price, 2), 'sma200': round(sma, 2) if sma else None,
            'above200': (an.price > sma) if sma else None, 'curve': round(an.curve.value, 1) if an.curve.ok else None,
            'curve_raja': an.curve.raja, 'direction': an.direction.head, 'w1': an.w1.state_name, 'mn': an.mn.state_name}


# ---- intraday guard ------------------------------------------------------------------------------------------------
CLOSE_ET = dt.time(16, 0)        # regular session close, America/New_York
SETTLE_MIN = 20                  # the daily bar is taken as final this many minutes after the close


def _nth_sunday(year: int, month: int, n: int) -> dt.date:
    d = dt.date(year, month, 1)
    d += dt.timedelta(days=(6 - d.weekday()) % 7)
    return d + dt.timedelta(weeks=n - 1)


def us_eastern(now_utc: dt.datetime) -> dt.datetime:
    """UTC -> New York wall time (naive) without tzdata: EDT (UTC-4) from the 2nd Sunday of March 07:00 UTC to the
    1st Sunday of November 06:00 UTC, else EST (UTC-5). A naive input is taken as UTC."""
    u = now_utc.astimezone(dt.timezone.utc).replace(tzinfo=None) if now_utc.tzinfo else now_utc
    start = dt.datetime.combine(_nth_sunday(u.year, 3, 2), dt.time(7))
    end = dt.datetime.combine(_nth_sunday(u.year, 11, 1), dt.time(6))
    return u - dt.timedelta(hours=4 if start <= u < end else 5)


def drop_partial(bars: List[Bar], now_utc: Optional[dt.datetime] = None) -> Tuple[List[Bar], bool]:
    """(bars, dropped): the last daily bar is dropped when it is dated today (New York) or later and the session has
    not closed yet (+ SETTLE_MIN). An intraday bar is not a closed candle and every rule reads closed candles: a
    forming bar became stay-away candles, touches and direction changes out of half a session."""
    if not bars:
        return bars, False
    et = us_eastern(now_utc or dt.datetime.now(dt.timezone.utc))
    settle = (dt.datetime.combine(et.date(), CLOSE_ET) + dt.timedelta(minutes=SETTLE_MIN)).time()
    if bars[-1].d >= et.date().isoformat() and et.time() < settle:
        return bars[:-1], True
    return bars, False


# ---- "why no signal" diagnostics -----------------------------------------------------------------------------------
DIAG_PCT = float(os.environ.get('SCANNER_DIAG_PCT', '5'))   # candidate: nearest fresh demand within X% above, or in it
# Veto priority for "the first failing rule": market gates first (curve, direction, HTF supply, sideways), then
# zone quality, then the trade geometry, the calendar and last the distance. Each candidate counts once.
BLOCK_ORDER = ['curve', 'HTF align', 'no HTF supply', 'not sideways', 'strong', 'fresh', 'clean', 'not used',
               'no 3rd CP', 'room', 'earnings', 'near entry']
BLOCK_LABEL = {'curve': 'high on curve', 'HTF align': 'direction not long', 'no HTF supply': 'monthly supply on top',
               'not sideways': 'sideways market', 'strong': 'weak zone type', 'fresh': 'zone already tested',
               'clean': 'overlap / flip zone', 'not used': 'zone already did its job', 'no 3rd CP': '3rd CP in a row',
               'room': 'room < 2x the stop or no target', 'earnings': 'earnings within 10 days',
               'near entry': 'price not near the entry'}
CLOSEST_N = 10


def diag_candidate(an: Analysis, pct: float = DIAG_PCT) -> Optional[Tuple[Z.Zone, Z.DNA]]:
    """The nearest (highest proximal) fresh D1 / W1 demand with price inside it or at most pct% above it."""
    px, best = an.price, None
    for r in (an.d1, an.w1):
        if not r.ok:
            continue
        for z in r.zones:
            if z.dir < 0 or z.leg_bar > RAJA['max_zone_age'] or not Z.fresh_at(r.S, z):
                continue
            x = an.dna.get(z.zid)
            if x is None or (px - z.prox) / px * 100 > pct:
                continue
            if best is None or z.prox > best[0].prox:
                best = (z, x)
    return best


def first_block(rules: List[Rule]) -> Optional[str]:
    """The highest-priority failing rule (BLOCK_ORDER), None when nothing fails."""
    fails = sorted({r.short for r in rules if r.status == FAIL})
    return next((k for k in BLOCK_ORDER if k in fails), fails[0] if fails else None)


def diag_row(sym: str, u: Dict, an: Analysis, earnings: Optional[str] = None) -> Optional[Dict]:
    """One blocked candidate: its zone, distance and first failing rule (None = no candidate, or nothing fails)."""
    c = diag_candidate(an)
    if c is None:
        return None
    z, x = c
    rules = zone_rules(an, z, x, earnings)
    k = first_block(rules)
    if k is None:
        return None
    return {'symbol': sym, 'name': u.get('name', sym), 'sector': u.get('sector', '') or 'Other',
            'indexes': [i for i in (u.get('indexes') or 'SPX').split(',') if i], 'tf': z.tf, 'zone_type': x.code,
            'proximal': round(z.prox, 2), 'distal': round(z.dist, 2), 'price': round(an.price, 2),
            'to_entry_pct': round((an.price - z.prox) / an.price * 100, 2), 'rule': k, 'label': BLOCK_LABEL.get(k, k),
            'fails': [r.short for r in rules if r.status == FAIL], 'direction': an.direction.head,
            'curve': round(x.curve_zone, 1)}


def blocked_summary(rows: List[Dict], pct: float = DIAG_PCT, n: int = CLOSEST_N) -> Tuple[Dict, List[Dict]]:
    """({candidates, within_pct, reasons: [{rule, label, count}] most first}, the n candidates closest to entry)."""
    cnt: Dict[str, int] = {}
    for r in rows:
        cnt[r['rule']] = cnt.get(r['rule'], 0) + 1
    order = {k: i for i, k in enumerate(BLOCK_ORDER)}
    reasons = [{'rule': k, 'label': BLOCK_LABEL.get(k, k), 'count': v}
               for k, v in sorted(cnt.items(), key=lambda kv: (-kv[1], order.get(kv[0], 99)))]
    closest = sorted(rows, key=lambda r: (abs(r['to_entry_pct']), len(r['fails']), r['symbol']))[:n]
    return {'candidates': len(rows), 'within_pct': pct, 'reasons': reasons}, closest


def run(universe: List[Dict], get_bars, get_cf, get_earnings, holdings: List[Dict], today: Optional[str] = None,
        log=print, watchlist: Optional[List[str]] = None, now: Optional[dt.datetime] = None,
        feeds: Tuple[str, ...] = ()) -> Dict:
    """Scan every ticker. get_bars(sym) -> (daily bars, meta); get_cf(cik) -> companyfacts or None;
    get_earnings(sym) -> ISO date or None. Returns the full result (holdings details included)."""
    import data as DATA
    import fundamentals as F
    raw_bars, dropped = get_bars, set()

    def get_bars(sym):                     # noqa: F811 - every caller below sees closed sessions only
        b, m = raw_bars(sym)
        b, cut = drop_partial(b, now)
        if cut:
            dropped.add(sym)
        return b, m
    import universe as U
    universe, uncovered = U.split_covered(universe, feeds)      # TSX-only names wait for a TSX feed
    held = {str(h.get('symbol', '')).upper(): h for h in holdings}
    watch = set(watchlist or [])
    walerts: List[Dict] = []
    syms = {u['symbol'] for u in universe} | set(held) | watch
    info = {u['symbol']: u for u in universe}
    sigs, exits, errors, notes = [], [], [], []
    diag: List[Dict] = []
    strong_in: List[Dict] = []
    chart_bars: Dict[str, list] = {}
    details: Dict[str, Dict] = {}
    index_rows: List[Dict] = []
    regime = []
    last_date = today or ''
    rfx = None
    import time
    t_run = time.time()
    t_earn = [0.0, 0]

    def earnings(sym):
        t = time.time()
        try:
            return get_earnings(sym)
        finally:
            t_earn[0] += time.time() - t
            t_earn[1] += 1
    try:
        rfx = index_context(composite_bars({k: get_bars(k)[0] for k in INDEX_PARTS}))
    except Exception as e:  # noqa: BLE001
        notes.append(f'RFX index: {e}')
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
        an = analyse(bars, DATA.closed_htf(bars, 'W1'), DATA.closed_htf(bars, 'MN'))
        an.index = rfx
        if sym in watch:
            walerts.extend(watch_alerts(sym, an, bars[-1]))
        u = info.get(sym, {'symbol': sym, 'name': sym, 'sector': '', 'cik': ''})
        found, dr = [], None
        if sym in info:
            pre, er = symbol_signals(an, None), None
            if pre and any(s['kind'] == 'BUY' or s['kind'] == 'WATCH' for s in pre):
                er = earnings(sym)
                found = symbol_signals(an, er) if er else pre
                if found:
                    for s in found:
                        s['earnings'] = er
            if not any(s['kind'] == 'BUY' for s in found):
                dr = diag_row(sym, u0 or {}, an, er)
                if dr:
                    diag.append(dr)
        for s in found:
            s.update({'symbol': sym, 'name': u.get('name', sym), 'sector': u.get('sector', '') or 'Other',
                      'indexes': (u.get('indexes') or 'SPX').split(','), 'exchange': meta.get('exchange', ''),
                      'chart': DATA.tradingview_url(sym, meta.get('exchange', ''), u.get('home', '')), **listing(u)})
        try:
            cf = get_cf(u.get('cik', ''))
        except Exception as e:  # noqa: BLE001
            cf = None
            notes.append(f'{sym} SEC: {e}')
        fz = F.compute(cf, an.price, [b.h for b in bars], [b.l for b in bars])
        if sym in info:
            d, row = ticker_detail(sym, u, an, bars, meta, F.rows(fz) if cf else [], found, dr)
            details[sym] = d
            index_rows.append(row)
            si = strong_in_demand(row, u)
            if si:
                strong_in.append(si)
        if found:
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
                              'chart': DATA.tradingview_url(sym, meta.get('exchange', ''), u.get('home', ''))})
        if log and ((n + 1) % 50 == 0 or n + 1 == len(syms)):
            log(f'analyse {n + 1}/{len(syms)} in {time.time() - t_run:.0f}s ({t_earn[0]:.0f}s in {t_earn[1]} earnings calls), '
                f'{len(sigs)} signals, {len(errors)} without data')
    order = {'BUY': 0, 'WATCH': 1}
    sigs.sort(key=lambda s: (order[s['kind']], -s.get('score', 0), -(s.get('rr') or 0), abs(s['to_entry_pct'])))
    blocked, closest = blocked_summary(diag)
    session = 'intraday-dropped' if dropped else 'closed'
    if dropped:
        notes.append(f'US market open at scan time: the partial daily bar of today was dropped for {len(dropped)} tickers (last closed session used)')
    if log:
        if dropped:
            log(notes[-1])
        top = ', '.join(f"{r['label']} ({r['count']})" for r in blocked['reasons'][:5]) or 'none'
        log(f"why no signal: {blocked['candidates']} candidates (fresh demand within {blocked['within_pct']:g}% or in it) "
            f"blocked; top reasons: {top}")
    return {'date': last_date, 'session': session, 'blocked': blocked, 'closest': closest, 'generated_at': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'universe': len(universe), 'scanned': len(syms) - len(errors), 'errors': errors, 'notes': notes, 'signals': sigs, 'exits': exits,
            'bars': chart_bars, 'details': details, 'index': index_rows, 'regime': regime, 'rfx_index': rfx, 'watch_alerts': walerts + index_alert(rfx) if watch else [],
            'strong_in_demand': sorted(strong_in, key=lambda r: (-r['score'], r['symbol'])),
            **universe_meta(universe + uncovered, uncovered, feeds)}


def universe_meta(rows: List[Dict], uncovered: List[Dict], feeds: Tuple[str, ...] = ()) -> Dict:
    """Index registry for the app (labels in pill order, sizes), the Canadian coverage and the uncovered names."""
    import universe as U
    present = [i for i in U.INDEXES if any(i in (u.get('indexes') or 'SPX').split(',') for u in rows)]
    return {'universes': present, 'index_meta': U.index_meta(present),
            'index_sizes': {i: sum(1 for u in rows if i in (u.get('indexes') or 'SPX').split(',')) for i in present},
            'coverage': U.coverage(rows, feeds),
            'uncovered': [{'symbol': (u.get('home') or u['symbol']).split(':')[-1], 'name': u.get('name', ''),
                           'indexes': [i for i in (u.get('indexes') or '').split(',') if i]} for u in sorted(uncovered, key=lambda u: u['symbol'])]}


STRONG = ('ARR', 'WOW', 'STR')


def strong_in_demand(row: Dict, u: Dict) -> Optional[Dict]:
    """A ticker sitting inside a fresh STRONG demand without a BUY (the rules block it): for Telegram and the map."""
    dz = row.get('dz')
    if row.get('st') != 'D' or not dz or dz[1] not in STRONG or row.get('sig') == 'BUY':
        return None
    return {'symbol': row['s'], 'name': row['n'], 'sector': row.get('sec') or 'Other', 'tf': dz[0], 'type': dz[1], 'score': dz[2],
            'rule': row.get('br') or '', 'label': BLOCK_LABEL.get(row.get('br') or '', row.get('sig') or '')}


def public_json(res: Dict, fixture: bool = False) -> Dict:
    """What the app may read: signals + fundamentals; holdings only as symbols and warning kinds (no sizes, no prices)."""
    return {
        'version': 1, 'fixture': fixture, 'date': res['date'], 'generated_at': res['generated_at'],
        'universe': res['universe'], 'scanned': res['scanned'], 'errors': len(res['errors']),
        'rules': 'Raja (ZoneVision Raja template): D1 / W1 zones, direction D1 -> W1 -> MN, curve, room. Kevin second.',
        'disclaimer': DISCLAIMER,
        'counts': {k: sum(1 for s in res['signals'] if s['kind'] == k) for k in ('BUY', 'WATCH')} | {'EXIT': len(res['exits'])},
        'universes': res.get('universes', []), 'index_meta': res.get('index_meta', []), 'index_sizes': res.get('index_sizes', {}),
        'coverage': res.get('coverage', {}), 'uncovered': res.get('uncovered', []),
        'partial': bool(res.get('partial')),
        'session': res.get('session', 'closed'),
        'blocked': res.get('blocked') or {'candidates': 0, 'within_pct': DIAG_PCT, 'reasons': []},
        'closest': res.get('closest') or [],
        'regime': res.get('regime', []),
        'rfx_index': res.get('rfx_index'),
        'signals': res['signals'],
        'bars': res.get('bars', {}),
        'exits': [{'symbol': e['symbol'], 'sector': e.get('sector', ''), 'indexes': e.get('indexes', []),
                   'reasons': sorted({w['reason'] for w in e['warnings']})} for e in res['exits']],
    }


def write_outputs(res: Dict, out_dir: str, fixture: bool = False, history: bool = True) -> str:
    """latest.json (signals, the app's list), history/<date>.json, index.json (every ticker, for search) and the
    per-ticker details in SHARDS shard files t/<n>.json. Shards, not one file per ticker: the daily commit touches ~67
    files instead of ~2,600, each shard stays ~0.3 MB raw (~60 KB gzipped) and git packs yesterday's shard as a delta."""
    pub = public_json(res, fixture)
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, 'latest.json')
    with open(path, 'w') as f:
        json.dump(pub, f, separators=(',', ':'))
        f.write('\n')
    if history and res.get('date'):         # no date = no bars at all: never a history file without a date
        os.makedirs(os.path.join(out_dir, 'history'), exist_ok=True)
        with open(os.path.join(out_dir, 'history', f"{res['date']}.json"), 'w') as f:
            json.dump({k: v for k, v in pub.items() if k != 'bars'}, f, separators=(',', ':'))
            f.write('\n')
    details = res.get('details') or {}
    if details:
        tdir = os.path.join(out_dir, 't')
        os.makedirs(tdir, exist_ok=True)
        shards: Dict[int, Dict] = {}
        for sym, d in details.items():
            shards.setdefault(shard_of(sym), {})[sym] = d
        keep = set()
        for k, m in shards.items():
            name = f'{k}.json'
            keep.add(name)
            with open(os.path.join(tdir, name), 'w') as f:
                json.dump({'date': res['date'], 'tickers': dict(sorted(m.items()))}, f, separators=(',', ':'))
                f.write('\n')
        for name in os.listdir(tdir):
            if name.endswith('.json') and name not in keep:
                os.remove(os.path.join(tdir, name))
        idx = {'version': 1, 'date': res['date'], 'generated_at': res['generated_at'], 'fixture': fixture, 'shards': SHARDS,
               'tickers': sorted(res.get('index') or [], key=lambda r: r['s'])}
        with open(os.path.join(out_dir, 'index.json'), 'w') as f:
            json.dump(idx, f, separators=(',', ':'))
            f.write('\n')
    return path


def refresh_signal_fundamentals(res: Dict, ciks: Dict[str, str], bars: Dict, budget_s: Optional[float] = None, log=None) -> None:
    """Today's signalled tickers get fundamentals at most a day old (the rest refresh weekly)."""
    import fundamentals as F
    syms = sorted({s['symbol'] for s in res['signals']})
    todo = F.refresh_plan([], [ciks.get(s, '') for s in syms], per_run=0)
    if not todo:
        return
    F.refresh_bases(todo, workers=4, budget_s=budget_s, log=log)
    for s in res['signals']:
        b = F.cached_base(ciks.get(s['symbol'], ''))[0]
        if b and s['symbol'] in bars:
            bb = bars[s['symbol']][0]
            fz = F.compute(b, s['price'], [x.h for x in bb], [x.l for x in bb])
            s['fundamentals'], s['fundamentals_rows'] = fz, F.rows(fz)
            if s['symbol'] in res.get('details', {}):
                res['details'][s['symbol']]['fundamentals_rows'] = s['fundamentals_rows']


MIN_COVERAGE = float(os.environ.get('SCANNER_MIN_COVERAGE', '0.5'))   # below this share of tickers with data: no output


def coverage(universe: List[Dict], pre: Dict) -> Tuple[int, int]:
    """(tickers of the universe with daily bars, universe size)."""
    syms = {u['symbol'] for u in universe}
    return sum(1 for s in syms if s in pre and pre[s][0]), len(syms)


def failure_reason(fetch_err: Dict[str, str], have: int, total: int) -> str:
    """One line: how many tickers had data, whether the Alpaca keys are missing, which hosts failed, the most
    common error."""
    import data as DATA
    parts = [f'{have}/{total} tickers with data']
    if not DATA.alpaca_keys():
        parts.append('ALPACA_KEY_ID / ALPACA_SECRET_KEY not set')
    if DATA.breaker_state():
        parts.append('failing hosts ' + ', '.join(sorted(DATA.breaker_state())))
    counts: Dict[str, int] = {}
    for sym, e in fetch_err.items():
        e = (e[len(sym) + 2:] if e.startswith(sym + ': ') else e)[:120]
        counts[e] = counts.get(e, 0) + 1
    if counts:
        top = max(counts.items(), key=lambda kv: kv[1])
        parts.append(f'most common error ({top[1]}x): {top[0]}')
    return '; '.join(parts)


def notify_failure(reason: str, today: str, log=print) -> bool:
    """One short Telegram message per day at most (state in .cache/fail_notice.json). Never raises."""
    import data as DATA
    import notify
    sp = os.path.join(DATA.CACHE, 'fail_notice.json')
    try:
        with open(sp) as fh:
            if json.load(fh).get('date') == today:
                log('scan failed: Telegram notice already sent today')
                return False
    except (OSError, ValueError):
        pass
    try:
        notify.send(['<b>RamanFX scanner: scan failed: no price data</b>\n' + notify.esc(reason) +
                     '\nNothing was published; the previous results stay in the app.'])
        os.makedirs(DATA.CACHE, exist_ok=True)
        with open(sp, 'w') as fh:
            json.dump({'date': today}, fh)
        return True
    except Exception as e:  # noqa: BLE001
        log(f'failure notice not sent: {type(e).__name__}')
        return False


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--tickers', help='comma-separated subset (default: every enabled universe in universe.csv)')
    ap.add_argument('--universes', help='e.g. SPX,NDX,DJI,TSX60,TSX (default env SCANNER_UNIVERSES or all)')
    ap.add_argument('--limit', type=int, default=0, help='first N tickers only')
    ap.add_argument('--workers', type=int, default=int(os.environ.get('SCANNER_WORKERS', '6')), help='download threads')
    ap.add_argument('--top', type=int, default=int(os.environ.get('TELEGRAM_TOP_N', '5')), help='Telegram: top N per sector')
    ap.add_argument('--offline', action='store_true', help='use cached data only')
    ap.add_argument('--no-sec', action='store_true', help='skip the SEC fundamentals refresh (use the cache)')
    ap.add_argument('--sec-per-run', type=int, default=int(os.environ.get('SCANNER_SEC_PER_RUN', '600')),
                    help='max companies refreshed from SEC per run (each at most weekly; signalled daily)')
    ap.add_argument('--budget-min', type=float, default=float(os.environ.get('SCANNER_BUDGET_MIN', '50')),
                    help='global time budget (minutes): after it no new download starts and the scan goes on with what it has')
    ap.add_argument('--sec-budget-min', type=float, default=float(os.environ.get('SCANNER_SEC_BUDGET_MIN', '8')),
                    help='at most this many minutes of SEC downloads per run')
    ap.add_argument('--sec-cold-cap', type=int, default=int(os.environ.get('SCANNER_SEC_COLD_CAP', '150')),
                    help='max never-cached companies fetched from SEC per run (a cold cache fills over a few runs)')
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
    DATA.set_budget(a.budget_min)
    phases: Dict[str, float] = {}

    def log(m: str) -> None:
        print(f'[{time.time() - t0:6.0f}s] {m}', file=sys.stderr, flush=True)

    def phase(name: str, since: float) -> float:
        now = time.time()
        phases[name] = phases.get(name, 0.0) + now - since
        log(f'phase {name}: {now - since:.1f}s (budget left {max(0.0, DATA.time_left()) / 60:.1f} min)')
        return now
    if a.universes:
        os.environ['SCANNER_UNIVERSES'] = a.universes
    uni = U.load()
    if a.tickers:
        want = {t.strip().upper() for t in a.tickers.split(',') if t.strip()}
        uni = [u for u in U.load(indexes=U.INDEXES) if u['symbol'] in want] + [
            {'symbol': t, 'name': t, 'sector': '', 'cik': '', 'indexes': ''} for t in want - {u['symbol'] for u in U.load(indexes=U.INDEXES)}]
    if a.limit:
        uni = uni[:a.limit]
    feeds = DATA.feeds_on()
    uni_all = uni
    uni, uncov = U.split_covered(uni, feeds)
    if uncov:
        log(f'{len(uncov)} TSX-only names need a TSX data feed (SCANNER_TSX_FEED=eodhd + EODHD_API_KEY): not scanned')
    holdings = load_holdings()
    syms =sorted({u['symbol'] for u in uni} | {str(h.get('symbol', '')).upper() for h in holdings} | set(REGIME) | set(INDEX_PARTS))
    log(f'{len(syms)} tickers, {a.workers} download threads, budget {a.budget_min:g} min')
    tp = time.time()
    pre = DATA.fetch_many(syms, workers=a.workers, offline=a.offline, log=log, tsx={u['symbol'] for u in uni if u.get('feed') == 'tsx'})
    fetch_err = pre.pop('__errors__', {})
    tp = phase('fetch', tp)
    have, total = coverage(uni, pre)
    if total and have < MIN_COVERAGE * total:
        # A data outage, not a market without signals: the published files (latest / index / shards / history) stay
        # as they are, no signal is sent, the run fails so it shows red.
        reason = failure_reason(fetch_err, have, total)
        log(f'SCAN FAILED: no price data ({reason}); below {MIN_COVERAGE:.0%} coverage: nothing written, no signals sent')
        if not a.no_notify:
            notify_failure(reason, dt.date.today().isoformat(), log=log)
        return 2

    def get_bars(s):
        if s in pre:
            return pre[s]
        raise RuntimeError(fetch_err.get(s, 'no data'))
    if not a.offline and not a.no_sec:
        # weekly per company (oldest first, capped per run), daily for the tickers that signalled yesterday
        prev = set()
        try:
            with open(os.path.join(a.out, 'latest.json')) as fh:
                prev = {s['symbol'] for s in json.load(fh).get('signals', [])}
        except (OSError, ValueError):
            pass
        cik = {u['symbol']: u.get('cik', '') for u in uni}
        todo = F.refresh_plan([c for c in cik.values() if c], [cik.get(s, '') for s in prev], per_run=a.sec_per_run,
                              cold_cap=a.sec_cold_cap)
        log(f'SEC: {len(todo)} companies to refresh (cap {a.sec_per_run}, cold cap {a.sec_cold_cap})')
        F.refresh_bases(todo, workers=4, log=log, budget_s=a.sec_budget_min * 60)
        tp = phase('fundamentals', tp)
    watchlist = load_watchlist()
    res = run(uni_all, get_bars, lambda c: F.cached_base(c)[0] if c else None,
              (lambda s: None) if a.offline else DATA.fetch_earnings, holdings, log=log, watchlist=watchlist, feeds=feeds)
    tp = phase('analyse', tp)
    if DATA.over_budget() or any('time budget' in str(e) for e in fetch_err.values()):
        res['partial'] = True
        res['notes'].append('time budget spent: some tickers were not refreshed (stale cache) or are missing')
    if DATA.breaker_state():
        res['notes'].append(f'failing hosts: {DATA.breaker_state()}')
        log(f'failing hosts at the end of the scan: {DATA.breaker_state()}')
    if res.get('watch_alerts'):
        sp = os.path.join(DATA.CACHE, 'alerts_state.json')
        try:
            with open(sp) as fh:
                st = json.load(fh)
        except (OSError, ValueError):
            st = {}
        res['watch_alerts'] = dedupe_alerts(res['watch_alerts'], st, res['date'])
        os.makedirs(DATA.CACHE, exist_ok=True)
        with open(sp, 'w') as fh:
            json.dump(st, fh)
    if not a.offline and not a.no_sec and not DATA.over_budget():
        refresh_signal_fundamentals(res, {u['symbol']: u.get('cik', '') for u in uni}, pre,
                                    budget_s=min(120.0, max(0.0, DATA.time_left())), log=log)
        tp = phase('fundamentals', tp)
    if not a.no_write:
        log(f'wrote {write_outputs(res, a.out)}')
        tp = phase('write', tp)
    try:                      # a Telegram problem never fails the run (the results are already written)
        msgs = notify.build_messages(res, top=a.top)
        if a.no_notify:
            print('\n\n'.join(msgs))
        else:
            notify.send(msgs)
    except Exception as e:  # noqa: BLE001
        log(f'notify failed: {type(e).__name__}')
    tp = phase('notify', tp)
    log(f"done in {time.time() - t0:.0f}s: {res['scanned']} scanned, {len(res.get('uncovered') or [])} uncovered (TSX feed off), "
        f"{len(res['errors'])} without data{' (PARTIAL: time budget spent)' if res.get('partial') else ''}; "
        f"phases {', '.join(f'{k} {v:.0f}s' for k, v in phases.items())}")
    return 0 if res['scanned'] > 0 else 1


if __name__ == '__main__':
    sys.exit(main())
