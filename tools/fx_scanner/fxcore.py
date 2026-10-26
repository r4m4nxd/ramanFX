"""FX rules: the stock scanner's Raja logic (tools/stock_scanner/zones.py) on the chain MN -> W1 -> D1 -> H4, both
directions (BUY at a located demand, SELL at a located supply), 3M as the top context.

Top-down (zones.location with strict_chain, the owner's key rule, first in every rule list): an H4 zone counts only
once price has touched, in the current visit, a strong (ARR / WOW / STR, not overlap / flip / done, at most
HOST_MAX_PRIOR earlier visits, penetrated <= 75%) D1 zone of the same side that the H4 zone overlaps; that D1 zone
needs a touched W1 zone, the W1 zone a touched MN zone (every level, no gap in the chain); MN is the top tradeable
level and the 3M level only blocks it when a strong untouched 3M zone is within FX_SOFT_REACH_PCT of price. A strong
untouched HTF zone still in the way -> blocked "HTF area not reached". Supply mirrored for shorts. The H4 bars (the
lowest TF) are the price checks (touches in the current visit and in the forming HTF bar, approach, left).

Direction (Raja table + ZoneVision's +1 row): H4 entry = H4 -> D1 -> W1 (+1 MN), D1 = D1 -> W1 -> MN, W1 = W1 -> MN
-> 3M, MN = MN -> 3M. Only a FULL direction gives BUY / SELL (REDUCED = a correction: WATCH). The curve is measured on
the chain's top row. Stops = distal + % of the zone height (H4 15, D1 10, W1 5, MN 3). Zones are built on BID bars;
entry / stop / target add the spread on the ask side. BUY / SELL limits only on H4 / D1 (W1 / MN = WATCH 'area').
The rules and their lesson citations: README.md "Rules".
"""
from __future__ import annotations

import datetime as dt
import os
import statistics
import sys
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
import zones as Z  # noqa: E402
from zones import RAJA, Bar, Series  # noqa: E402

PASS, FAIL, WARN, UNKNOWN, INFO = 'pass', 'fail', 'warn', 'unknown', 'info'
ROW_TFS = C.ENTRY_TFS + C.CONTEXT_TFS                 # H4, D1, W1, MN, 3M
SIDE = {1: 'demand', -1: 'supply'}
KIND = {1: 'BUY', -1: 'SELL'}

# first failing rule priority (market gates, zone quality, geometry, costs, distance) and its words
BLOCK_ORDER = ['location', 'market TF', 'curve', 'direction', 'reduced', 'HTF opposite', 'sideways', 'strong', 'fresh',
               'leg', 'clean', 'not used', 'no 3rd CP', 'out of TL', 'trendline', 'host tested', 'blind', 'room',
               'gold TF', 'spread', 'context', 'area', 'weekend', 'near entry']
BLOCK_LABEL = {'location': 'HTF area not reached', 'curve': 'wrong side of the curve', 'direction': 'direction against',
               'reduced': 'direction reduced (correction)', 'HTF opposite': 'opposite HTF zone on top',
               'sideways': 'sideways market', 'strong': 'weak zone type', 'fresh': 'zone already tested',
               'leg': 'departure < 2x', 'clean': 'overlap / flip zone', 'not used': 'zone already did its job',
               'no 3rd CP': '3rd CP in a row', 'out of TL': 'out of the trendline', 'trendline': 'trendline far / 4th touch',
               'host tested': 'HTF area tested before', 'blind': 'confirmation entry only', 'room': 'room < 2x the stop',
               'gold TF': 'no XAU_USD on H4 (Raja)', 'spread': 'spread > 10% of the stop', 'market TF': 'not on this TF (Raja)',
               'context': 'context only (levels unreliable)', 'area': 'W1 / MN area: enter on D1 / H4',
               'weekend': 'weekend gap risk', 'near entry': 'price not near the entry'}
# failing rules that turn a strong zone into a WATCH (confirm one TF lower / wait) instead of dropping it
CONFIRM_ONLY = ('fresh', 'leg', 'reduced', 'host tested', 'blind', 'weekend', 'area', 'context', 'near entry')


@dataclass
class Rule:
    status: str
    text: str
    ref: str
    short: str = ''

    def as_dict(self): return {'status': self.status, 'text': self.text, 'ref': self.ref, 'short': self.short}


def params(inst: Dict) -> Dict:
    """RAJA settings for one instrument: the FX stop table, a 3-pip minimum buffer, the curve rule mirrored, and the
    stricter opt-in readings of zones.py: room to every not-removed opposite zone (tested ones too), emotional taps
    count as tests, a 7+ candle base is not a zone (L55)."""
    return {**RAJA, 'sl_pct': dict(C.SL_PCT), 'sl_min': C.SL_MIN_PIPS * C.pip_of(inst), 'mirror_ath': True,
            'room_any': True, 'emo_touch': True, 'base_strict': True}


def context_note(inst: Dict) -> str:
    """Why an instrument never gets a BUY / SELL ('' = it can)."""
    return inst.get('context_only') or C.CONTEXT_ONLY.get(inst.get('name', ''), '')


@dataclass
class FxAnalysis:
    inst: Dict
    price: float
    date: str                                   # label of the newest closed H4 bar
    rows: Dict[str, Z.Row]
    fine: Series                                # H4 bars: price checks
    dirs: Dict[str, Z.Direction]
    curves: Dict[str, Z.Curve]
    crows: Dict[str, Optional[Z.Row]]
    p: Dict
    spread: Optional[float] = None              # typical H4 close spread, price units
    sideways: Dict[str, bool] = field(default_factory=dict)
    dna: Dict[str, Z.DNA] = field(default_factory=dict)
    memo: Dict = field(default_factory=dict)
    h4_dates: List[str] = field(default_factory=list)

    @property
    def nd(self) -> int: return C.digits_of(self.inst)

    @property
    def pip(self) -> float: return C.pip_of(self.inst)


def typical_spread(sp: List[float], n: int = 50) -> Optional[float]:
    xs = [s for s in sp[-n:] if s is not None and s >= 0]
    return statistics.median(xs) if xs else None


def analyse(inst: Dict, bars: Dict[str, List[Bar]], spread: Optional[float] = None) -> FxAnalysis:
    """Everything the rules need at the newest CLOSED H4 bar. bars = {'H4', 'D1', 'W1', 'MN': closed bars, oldest
    first}; 3M = closed quarters built from MN."""
    p = params(inst)
    h4 = bars['H4'][-C.KEEP_BARS['H4']:]
    px = h4[-1].c
    fine = Series(h4, px, 'H4')

    def row(bs, tf):
        if not bs:
            return Z.Row(tf=tf, S=Series([Bar('', px, px, px, px)], px, tf))
        return Z.eval_row(Series(bs, px, tf), p)
    rows = {'H4': row(h4, 'H4')}
    for tf in ('D1', 'W1', 'MN'):
        rows[tf] = row(bars.get(tf, [])[-C.KEEP_BARS[tf]:], tf)
    rows['3M'] = row(Z.to_quarters(bars.get('MN', [])), '3M')
    dirs, curves, crows = {}, {}, {}
    for tf in C.ENTRY_TFS:
        ch = C.DIR_CHAIN[tf]
        e, i, h = (rows[t] for t in ch[:3])
        p1 = rows[ch[3]] if len(ch) > 3 else None
        crow = h if h.ok else (i if i.ok else None)
        cv = Z.dir_curve(crow, px)
        curves[tf], crows[tf] = cv, crow
        dirs[tf] = Z.dir_combine(e, i, h, cv, p, p1=p1)
    an = FxAnalysis(inst=inst, price=px, date=h4[-1].d, rows=rows, fine=fine, dirs=dirs, curves=curves, crows=crows,
                    p=p, spread=spread, h4_dates=[b.d for b in h4])
    an.sideways = {tf: Z.sideways(r.S, p) if r.ok else False for tf, r in rows.items()}
    for tf in C.ENTRY_TFS:
        r = rows[tf]
        if not r.ok:
            continue
        for i, z in enumerate(r.zones):
            if z.removed or z.leg_bar > p['max_zone_age']:
                continue
            if (z.dir > 0 and z.dist < px) or (z.dir < 0 and z.dist > px):
                an.dna[z.zid] = Z.dna(r.S, r.zones, i, r.tl, other_rows(an, tf), htf_opp(an, tf), curves[tf], crows[tf],
                                      0.0, p, tp_off_abs=tp_off(an))
    return an


def tp_off(an: FxAnalysis) -> float:
    """Target offset before the opposite proximal: 7 pips (ZoneVision InpTpOffsetPips; Raja L7 / L9: 5-10 pips)."""
    return C.TP_OFFSET_PIPS * an.pip


def other_rows(an: FxAnalysis, tf: str) -> List[Z.Row]:
    """Every other row (lower AND higher, 3M included) for the room / target: Raja L9 'the target is the NEAREST
    opposing level', Baker 'never buy with supply directly overhead' (with p['room_any'] tested zones count too)."""
    return [an.rows[t] for t in ROW_TFS if t != tf and an.rows[t].ok]


def htf_opp(an: FxAnalysis, tf: str) -> List[Z.Zone]:
    """The zones of EVERY higher tradeable row (D1 / W1 / MN for an H4 zone; 3M is context) for the 'inside / next to
    an opposite HTF zone' veto (Raja L50 / L52; ZoneVision checks one level up, the stricter reading checks all)."""
    k = ROW_TFS.index(tf)
    return [z for t in ROW_TFS[k + 1:] if t not in C.CONTEXT_TFS and an.rows[t].ok for z in an.rows[t].zones]


def dna_of(an: FxAnalysis, r: Z.Row, i: int) -> Z.DNA:
    z = r.zones[i]
    x = an.dna.get(z.zid) or an.memo.get(('dna', z.zid))
    if x is None:
        cv = an.curves.get(r.tf) or an.curves['MN']
        x = Z.dna(r.S, r.zones, i, r.tl, other_rows(an, r.tf), htf_opp(an, r.tf), cv, an.crows.get(r.tf), 0.0, an.p,
                  tp_off_abs=tp_off(an))
        an.memo[('dna', z.zid)] = x
    return x


def forming_touched(an: FxAnalysis, z: Z.Zone) -> bool:
    """A D1 / W1 / MN zone reached by an H4 bar of its still-forming bar (or price inside it now): zones.dna counts
    only the zone TF's closed bars, so this touch is otherwise invisible (Raja L1 / L2 / L52: fresh = first touch)."""
    if z.tf == 'H4':
        return False
    k = ('ftouch', z.zid)
    if k not in an.memo:
        an.memo[k] = Z.forming_touched(z, an.fine, an.rows[z.tf].S, key=C.period_key)
    return an.memo[k]


def tests(an: FxAnalysis, z: Z.Zone, x: Z.DNA) -> int:
    """Visits so far: the closed-bar tests + 1 for a touch in the forming HTF bar that is not the visit going on."""
    return x.n_tests + (1 if forming_touched(an, z) and not x.in_touch else 0)


def touched_now(an: FxAnalysis, R: Z.Row, o: Z.Zone) -> bool:
    k = ('touch', o.zid)
    if k not in an.memo:
        an.memo[k] = Z.visit_touched(o, an.fine, R.S, key=C.period_key)
    return an.memo[k]


def prior_visits(an: FxAnalysis, R: Z.Row, o: Z.Zone, x: Z.DNA) -> int:
    """Visits BEFORE the current one (the current visit, when price is in it, is not an earlier one)."""
    return max(0, tests(an, o, x) - (1 if touched_now(an, R, o) else 0))


def host_ok(an: FxAnalysis, R: Z.Row, i: int) -> bool:
    """An HTF zone can host (or block as 'in the way'): strong ARR / WOW / STR, not an overlap / flip, has not done
    its job (R11 / R12 / R17), at most HOST_MAX_PRIOR earlier visits (Raja: the 4th touch breaks; D1 / W1 3rd risky;
    forming-bar touches included) and penetrated at most HOST_MAX_DEPTH % (Kevin L13)."""
    o = R.zones[i]
    x = dna_of(an, R, i)
    return (x.code in C.STRONG and not (x.overlap or x.flip or x.did_job) and x.depth_max <= C.HOST_MAX_DEPTH
            and prior_visits(an, R, o, x) <= C.HOST_MAX_PRIOR.get(R.tf, 2))


def loc_of(an: FxAnalysis, z: Z.Zone) -> Z.Loc:
    """zones.location on the FX chain with the strict top-down chain (every level up to MN touched); hosts per
    host_ok; touched = in the current visit (H4 bars first, then the HTF's own older bars)."""
    key = ('loc', z.zid)
    if key in an.memo:
        return an.memo[key]
    lc = Z.location(z, an.rows, an.price, lambda R, i: host_ok(an, R, i), lambda R, o: touched_now(an, R, o), p=an.p,
                    htf_of=C.HTF_OF, soft_tfs=C.CONTEXT_TFS, reach_pct=C.SOFT_REACH_PCT, nd=an.nd, strict_chain=True)
    an.memo[key] = lc
    return lc


def ath_rows(an: FxAnalysis, tf: str) -> List[Z.Row]:
    a = C.HTF_OF.get(tf)
    b = C.HTF_OF.get(a) if a else None
    out = [an.rows[t] for t in (a, b) if t and (an.rows[t].ok or t not in C.CONTEXT_TFS)]
    return out or [an.rows[tf]]


def score(x: Z.DNA, n_tests: int, d: int) -> int:
    """Raja lens score (LensRun), mirrored for supply: type ARR / WOW 4, STR 3; fresh 2 (2nd touch 1); curve on the
    right side 2 (middle 1); room 3x 2, 2x 1. Max 10."""
    sr = 4 if x.code in ('ARR', 'WOW') else (3 if x.code == 'STR' else 0)
    sr += 2 if n_tests == 0 else (1 if n_tests == 1 else 0)
    cz = x.curve_zone if d > 0 else 100 - x.curve_zone
    sr += 2 if cz <= RAJA['curve_low'] else (0 if cz >= RAJA['curve_high'] else 1)
    sr += 2 if x.room_r >= 3 else (1 if x.room_r >= 2 else 0)
    return min(10, sr)


def plan(an: FxAnalysis, z: Z.Zone, x: Z.DNA) -> Dict:
    """Zones are on BID bars (the MT4 / MT5 chart). BUY: limit = proximal + spread (fills on the ask when the bid
    reaches the proximal), stop = distal - % of the zone height (hit by the bid), target = 7 pips before the nearest
    not-removed opposite zone of ANY timeframe (bid). SELL: limit = proximal (bid), stop = distal + % of the height +
    spread and target = 7 pips beyond the opposite proximal + spread (both hit by the ask). No opposite zone ->
    Raja's 250% projection. R:R on these levels (Kevin L6: limit before the proximal + spread)."""
    d, nd, inst = z.dir, an.nd, an.inst
    sp = an.spread or 0.0
    entry = z.prox + (sp if d > 0 else 0.0)
    stop = z.dist - d * x.stop_buf + (sp if d < 0 else 0.0)
    nxt = [(v, dd) for ok, v, dd in ((x.has_opp, x.opp, x.opp_dist), (x.has_opp_htf, x.opp_htf, x.opp_htf_dist))
           if ok and d * (v - z.prox) > 0]
    opp, opp_d = (min(nxt, key=lambda t: d * t[0]) if nxt else (None, None))
    target = opp - d * tp_off(an) + (sp if d < 0 else 0.0) if opp else None
    kind = 'zone' if target else None
    if target is None and x.proj and d * (x.proj - entry) > 0:
        target, kind = x.proj + (sp if d < 0 else 0.0), 'projection'
    if target is not None and d * (target - entry) <= 0:
        target, kind = entry, kind                     # the opposite zone is closer than the offset: no room
    risk = d * (entry - stop)
    rr = d * (target - entry) / risk if target and risk > 0 else None
    r = lambda v: round(v, nd) if v is not None else None  # noqa: E731
    return {'entry': r(entry), 'stop': r(stop), 'target': r(target), 'target_kind': kind, 'rr': round(rr, 2) if rr is not None else None,
            'next_zone': r(opp), 'next_zone_distal': r(opp_d), 'stop_pct_of_height': C.SL_PCT.get(z.tf, 5.0),
            'stop_pips': round(C.pips(entry - stop, inst), 1), 'target_pips': round(C.pips(target - entry, inst), 1) if target else None,
            'height_pips': round(C.pips(z.h, inst), 1)}


def own_line(an: FxAnalysis, z: Z.Zone) -> Tuple[Optional[Z.TLine], int, Optional[float]]:
    """(the zone TF's own-side trendline in force (up line for a demand), its touches, the zone's gap to it in pips at
    the newest bar; None when no line is in force)."""
    tl = an.rows[z.tf].tl
    t, n = (tl.up, tl.up_touches) if z.dir > 0 else (tl.dn, tl.dn_touches)
    if t is None or t.removed:
        return None, 0, None
    lv = t.at(1)
    gap = 0.0 if z.lo <= lv <= z.hi else min(abs(lv - z.lo), abs(lv - z.hi))
    return t, n, gap / an.pip


def out_of_trendline(an: FxAnalysis, z: Z.Zone, x: Z.DNA) -> bool:
    """Raja L8 / L52 / L106 'a zone out of the trendline is not usable': (a) an own-side line already in force when
    the zone departed (anchored before it) was crossed after the departure (the trend the zone belonged to ended), or
    (b) the zone was made after the own-side line was crossed, beyond the broken line, and no opposite line was
    crossed since (not an arrival) and no unbroken own-side line holds it."""
    tl, d, L = an.rows[z.tf].tl, z.dir, z.leg_bar
    own = [t for t in tl.lines if t.dir == d]
    if any(t.a > L and 0 < t.cross_bar < L for t in own):
        return True
    crossed = [t for t in own if t.cross_bar > L]
    if not crossed or x.rja_tl:
        return False
    t = min(crossed, key=lambda t: t.cross_bar)              # the most recent own-side cross before the zone
    beyond = d * (t.at(L) - z.prox) > 0
    held = any(o.a >= L and o.cross_bar < 0 and not o.removed for o in own)
    return beyond and not held and not Z.tl_cross_in(tl, -d, L, t.cross_bar)


def opp_inside(an: FxAnalysis, z: Z.Zone) -> Optional[Z.Zone]:
    """A not-removed opposite zone (fresh or tested) of the zone's TF or any higher one (3M included) that price sits
    in: never buy while price sits in a supply (Raja L50, L4 course 3), mirrored for sells."""
    px, k = an.price, ROW_TFS.index(z.tf)
    for t in ROW_TFS[k:]:
        r = an.rows[t]
        if not r.ok:
            continue
        for o in r.zones:
            if o.dir == -z.dir and not o.removed and o.lo <= px <= o.hi:
                return o
    return None


def zone_rules(an: FxAnalysis, z: Z.Zone, x: Z.DNA) -> List[Rule]:
    px, d, D, inst = an.price, z.dir, an.dirs[z.tf], an.inst
    side, opp_side = SIDE[d], SIDE[-d]
    htf = C.HTF_OF.get(z.tf) or z.tf
    f = lambda v: C.fmt(v, inst)  # noqa: E731
    R: List[Rule] = []
    lx = C.MIN_LEG_X
    R.append(Rule(PASS if z.leg_ratio >= lx else FAIL, f'Zone: {z.base_n}-candle base, departure {z.leg_ratio:.1f}x the biggest base candle'
                  + ('' if z.leg_ratio >= lx else f' (< {lx:g}x: the lesson asks 2x; confirmation only)'), 'L55', 'leg'))
    nt = tests(an, z, x)
    fresh = nt == 0 and not z.removed
    ftxt = ' (incl. this ' + {'D1': 'day', 'W1': 'week', 'MN': 'month'}.get(z.tf, 'bar') + "'s H4 bars)" if forming_touched(an, z) else ''
    R.append(Rule(PASS if fresh else FAIL, 'Fresh: price has not come back yet (first touch = set and forget)' if fresh
                  else f'Tested {nt}x{ftxt}: confirmation only, no set and forget', 'L1 · L2 · L52', 'fresh'))
    strong = x.code in C.STRONG
    R.append(Rule(PASS if strong else FAIL, f'Zone type {x.code}: {Z.ZONE_TYPE_TEXT[x.code]}', 'L1 · L51', 'strong'))
    chain = C.DIR_CHAIN[z.tf]
    states = ', '.join(f'{t} {an.rows[t].state_name}' for t in dict.fromkeys(chain))
    dtxt = f'Direction {D.head} ({states})' + (f"; {'; '.join(D.notes)}" if D.notes else '')
    R.append(Rule(PASS if D.dir == d else FAIL, dtxt, 'L7 · L8 · L3', 'direction'))
    if D.dir == d:
        R.append(Rule(PASS if D.q == 2 else FAIL, 'Direction FULL: every timeframe of the chain agrees' if D.q == 2
                      else 'Direction REDUCED (a correction / a higher TF disagrees): no set and forget below the HTF trend',
                      'L5 · L102 · Kevin S&F', 'reduced'))
    cv = an.curves[z.tf]
    ctf = cv.tf or htf
    cz = x.curve_zone
    hr = ath_rows(an, z.tf)
    ups = ' + '.join(f'{r.tf} {r.state_name}' for r in hr)
    good = cz if d > 0 else 100 - cz              # distance from "our" end of the curve
    if good >= 50 and (Z.ath_curve_ok(cv, *hr) if d > 0 else Z.atl_curve_ok(cv, *hr)):
        R.append(Rule(WARN, f"Curve {cz:.0f}% (100-bar {ctf} range): no {ctf} {opp_side} {'overhead' if d > 0 else 'below'} "
                      f"({'ATH' if d > 0 else 'ATL'} area); {ups} trend {'up' if d > 0 else 'down'} -> allowed (owner rule)", 'L4 · owner', 'curve'))
    else:
        how = f'({ctf} strong zones, proximal to proximal)' if cv.raja else f'(no {ctf} strong pair: 100-bar {ctf} range)'
        words = ((': low curve, buyers only' if d > 0 else ': high curve, sellers only') if good <= RAJA['curve_low']
                 else ': confirmation side' if good < 50 else (': upper half, no buys' if d > 0 else ': lower half, no sells'))
        R.append(Rule(PASS if good <= RAJA['curve_low'] else (WARN if good < 50 else FAIL), f'Curve {cz:.0f}% {how}{words}', 'L4', 'curve'))
    lock_against = D.lock == -d
    inside = opp_inside(an, z)
    R.append(Rule(FAIL if (x.next_opp_htf or lock_against or inside is not None) else PASS,
                  f'Inside / next to a higher-TF {opp_side}: it gets removed, no trade' if x.next_opp_htf
                  else f'Price sits inside a fresh {D.curve.tf or htf} {opp_side}: wait until it is removed' if lock_against
                  else f'Price sits inside the {inside.tf} {opp_side} {f(inside.prox)}–{f(inside.dist)}: wait until it is removed' if inside is not None
                  else f'No higher-TF {opp_side} on top of the zone, price not inside any {opp_side}', 'L50 · L52 · L4', 'HTF opposite'))
    pl = plan(an, z, x)
    if pl['target'] is None:
        R.append(Rule(FAIL, f'No {opp_side} zone ahead and no 250% projection: no known target', 'L101 · L5', 'room'))
    else:
        rr = pl['rr'] or 0
        to = (f"the nearest {opp_side} {f(pl['next_zone'])} (any TF, tested ones too)" if pl['target_kind'] == 'zone'
              else f"the 250% projection {f(pl['target'])} (L5)")
        R.append(Rule(PASS if rr >= 3 else (WARN if rr >= 2 else FAIL), f'Room {rr:.1f}x the stop to {to}, spread included'
                      + (' (3x: good)' if rr >= 3 else ' (2x minimum)' if rr >= 2 else ' (< 2x: skip)'), 'L7 · L9 · L53', 'room'))
    sw_tf = z.tf if an.sideways.get(z.tf) else (htf if an.sideways.get(htf) else None)
    R.append(Rule(FAIL if sw_tf else PASS, f'Sideways on {sw_tf}: never trade a meshing market' if sw_tf
                  else f'Not sideways on {z.tf} or {htf}', 'L8 · L101', 'sideways'))
    R.append(Rule(FAIL if x.cp_run >= 3 else PASS, f'CP x{x.cp_run} in a row: do not trade the next one' if x.cp_run >= 3
                  else 'Not the 3rd CP in a row', 'L8 · Kevin L13', 'no 3rd CP'))
    R.append(Rule(FAIL if x.did_job else PASS, f'Already did its job (reached the next {opp_side} before coming back)' if x.did_job
                  else 'Has not done its job yet', 'L5 · Feb 18', 'not used'))
    weak = x.overlap or x.flip
    R.append(Rule(FAIL if weak else PASS, (f'Overlap: formed inside / next to an old {opp_side}' if x.overlap else 'Flip area')
                  + ': never set and forget' if weak else 'Not an overlap or flip zone', 'L52', 'clean'))
    # trendline rules (Raja L4, L8, L102-L107)
    oot = out_of_trendline(an, z, x)
    R.append(Rule(FAIL if oot else PASS, f'Out of the {z.tf} trendline: the trend it belonged to is broken; use the HTF realignment zone'
                  if oot else 'Not out of its trendline', 'L8 · L52 · L106', 'out of TL'))
    t, ntl, gp = own_line(an, z)
    pips_tf = z.tf in ('H4', 'D1')                       # pips are meaningless on W1 / MN zones
    far = t is not None and pips_tf and gp is not None and gp > C.TL_FAR_PIPS
    worn = t is not None and ntl >= C.TL_MAX_TOUCHES
    line = f"{z.tf} {'up' if d > 0 else 'down'} trendline"
    R.append(Rule(FAIL if (far or worn) else PASS,
                  (f'{gp:.0f} pips from the {line} (> {C.TL_FAR_PIPS:g}): a zone that far often breaks' if far else '')
                  + ('; ' if far and worn else '')
                  + (f'the {line} was touched {ntl}x: the next (4th) touch usually breaks' if worn else '')
                  if (far or worn) else (f'{gp:.0f} pips from the {line}, touch #{ntl + 1}' if t is not None and gp is not None
                                         else f'no {line} in force'), 'L4 · L102 · L103 · L107', 'trendline'))
    near_tl = t is not None and not far and not worn and (gp is not None and gp <= C.TL_FAR_PIPS if pips_tf else True)
    lc = loc_of(an, z)
    if lc.ok and lc.host is not None and lc.host.tf in an.rows:
        H = an.rows[lc.host.tf]
        hi = next((k for k, o in enumerate(H.zones) if o is lc.host), None)
        prior = prior_visits(an, H, lc.host, dna_of(an, H, hi)) if hi is not None else 0
        R.append(Rule(FAIL if prior >= 1 and x.code != 'ARR' else PASS,
                      f'{lc.host.tf} area visited {prior}x before: only an arrival {z.tf} zone (trendline cross + removal) confirms it'
                      if prior >= 1 and x.code != 'ARR' else (f'{lc.host.tf} area visited {prior}x before; the {z.tf} zone is an arrival'
                                                              if prior else f'{lc.host.tf} area: first visit'), 'L2 · L52 · L105', 'host tested'))
    wow = x.code == 'WOW' and x.room_r >= 3
    blind = x.code == 'ARR' or wow or near_tl
    R.append(Rule(PASS if blind else FAIL,
                  ('Limit order allowed: arrival zone (trendline crossed + opposite removed)' if x.code == 'ARR'
                   else 'Limit order allowed: WOW (open run >= 3x the stop)' if wow
                   else f'Limit order allowed: right at the {line}') if blind
                  else f'{x.code} zone not at a WOW / arrival / near-trendline place: confirmation entry only (confirm one TF lower)',
                  'L102 · L104', 'blind'))
    try_pair = 'TRY' in inst['name'].split('_')
    bad_tf = (inst.get('cls') == 'cfd' and z.tf == 'H4') or (try_pair and z.tf in ('H4', 'D1'))
    R.append(Rule(FAIL if bad_tf else PASS, ('Indices / CFDs: daily and above only' if not try_pair else 'TRY pairs: weekly and above only')
                  if bad_tf else f'{z.tf} allowed for this market', 'L53 (Feb 18, Apr 7)', 'market TF'))
    gap = d * (px - z.prox)
    appr = C.APPROACH_H * z.h
    near = 0 < gap <= appr
    R.append(Rule(PASS if near else FAIL, f'Price {C.pips(gap, inst) * (1 if gap >= 0 else -1):+.1f} pips from the entry '
                  f'(approach = {C.pips(appr, inst):.1f} pips, 1x the zone)' + ('; inside the zone = tested, not set and forget' if gap <= 0 else ''),
                  'Scanner', 'near entry'))
    risk = abs(pl['entry'] - pl['stop'])
    if an.spread is None:
        R.append(Rule(UNKNOWN, 'Spread unknown: check it on the platform', 'costs', 'spread'))
    else:
        ok = an.spread <= C.MAX_SPREAD_FRAC * risk
        R.append(Rule(PASS if ok else FAIL, f'Spread {C.pips(an.spread, inst):.1f} pips = {an.spread / risk * 100 if risk else 0:.0f}% of the '
                      f'{C.pips(risk, inst):.1f}-pip stop' + ('' if ok else f' (> {C.MAX_SPREAD_FRAC * 100:.0f}%: skip)'), 'costs', 'spread'))
    if inst['name'] == 'XAU_USD':
        low = C.ENTRY_TFS.index(z.tf) < C.ENTRY_TFS.index(C.GOLD_USD_MIN_TF) if C.GOLD_USD_MIN_TF in C.ENTRY_TFS else False
        R.append(Rule(FAIL if low else INFO, 'Raja: no XAU_USD on the low timeframes; use XAU_AUD' if low else C.GOLD_NOTE, 'Raja', 'gold TF'))
    if z.tf == 'H4' and len(an.date) >= 13:
        wd = dt.date.fromisoformat(an.date[:10]).weekday()
        late = wd == 4 and int(an.date[11:13]) + 4 >= C.WEEKEND_FROM_H
        R.append(Rule(FAIL if late else PASS, 'Friday afternoon: no new H4 set and forget into the weekend gap' if late
                      else 'Not into the weekend', 'L53 (Apr 30) · L7 (Jun 25)', 'weekend'))
    if z.tf not in C.SIGNAL_TFS:
        R.append(Rule(FAIL, f'{z.tf} zone = an area for direction and location: drill down to a D1 / H4 zone inside it',
                      'L6 · L7 · L53', 'area'))
    cn = context_note(inst)
    if cn:
        R.append(Rule(FAIL, cn[:1].upper() + cn[1:], 'data', 'context'))
    R.insert(0, Rule(PASS if lc.ok else FAIL, ('HTF location: ' + lc.text if lc.ok else lc.text)
                     + (f' ({lc.chain_text})' if len(lc.chain) > 1 else ''), 'owner · L6 · L7', 'location'))
    return R


def first_block(rules: List[Rule]) -> Optional[str]:
    fails = {r.short for r in rules if r.status == FAIL}
    return next((k for k in BLOCK_ORDER if k in fails), None)


def known_label(an: FxAnalysis, z: Z.Zone) -> str:
    """When the zone became known: the close of its stay-away bar = the start of the next bar of its TF."""
    S = an.rows[z.tf].S
    return S.T[z.sa_bar - 1] if z.sa_bar - 1 >= 1 else an.date


def chain_steps(an: FxAnalysis, lc: Z.Loc) -> str:
    """'MN demand ... touched ✓ → W1 demand ... touched ✓ → D1 ✓ → H4 entry ...' (zones.chain_text)."""
    return lc.chain_text


def zone_dict(an: FxAnalysis, z: Z.Zone, x: Z.DNA) -> Dict:
    nd = an.nd
    return {'tf': z.tf, 'side': SIDE[z.dir], 'zone_type': x.code, 'pattern': z.pattern, 'proximal': round(z.prox, nd),
            'distal': round(z.dist, nd), 'touches': tests(an, z, x), 'made': z.made, 'base_start': z.base_start, 'zid': z.zid,
            'departure_x': round(z.leg_ratio, 2), 'curve': round(x.curve_zone, 1), 'room_r': round(x.room_r, 2) if x.room_r < 99 else None}


LOWER_CONFIRM = {'MN': 'MN -> W1: trendline cross + opposite zone removed', 'W1': 'W1 -> D1: trendline cross + opposite zone removed',
                 'D1': 'D1 -> H4: trendline cross + opposite zone removed', 'H4': 'an H4 close back beyond the proximal'}


def signals(an: FxAnalysis) -> List[Dict]:
    """BUY / SELL / WATCH of one instrument (one BUY / SELL per TF and side: the zone nearest to price).
    BUY / SELL = every rule passes (H4 / D1 only). WATCH = a strong zone whose only failing rules are confirmation-only
    (CONFIRM_ONLY): 'tested' (2nd / 3rd touch, price near), 'new' (just made, price away), 'confirm' (departure < 2x,
    REDUCED direction, tested HTF area, no WOW / arrival / trendline place, weekend), 'area' (a W1 / MN zone that
    passes: drill down) or 'context' (an instrument whose levels are not reliable enough for orders)."""
    out: List[Dict] = []
    px, inst = an.price, an.inst
    recent = an.h4_dates[-C.NEW_BARS] if len(an.h4_dates) >= C.NEW_BARS else an.h4_dates[0]
    for tf in C.ENTRY_TFS:
        r = an.rows[tf]
        if not r.ok:
            continue
        for z in r.zones:
            x = an.dna.get(z.zid)
            if x is None:
                continue
            d = z.dir
            rules = zone_rules(an, z, x)
            fails = [k for k in rules if k.status == FAIL]
            nt = tests(an, z, x)
            lc = loc_of(an, z)
            pl = plan(an, z, x)
            base = {**zone_dict(an, z, x), **pl, 'price': round(px, an.nd), 'score': score(x, nt, d),
                    'to_entry_pips': round(d * (px - z.prox) / an.pip, 1), 'direction': an.dirs[tf].head,
                    'states': {t: an.rows[t].state_name for t in ROW_TFS}, 'loc': lc.code, 'loc_ok': lc.ok,
                    'loc_text': lc.text, 'chain': lc.chain, 'chain_text': lc.chain_text,
                    'spread_pips': round(an.spread / an.pip, 1) if an.spread is not None else None,
                    'rules': [k.as_dict() for k in rules]}
            if not fails:
                out.append({**base, 'kind': KIND[d], 'note': 'Set and forget: limit at the proximal (+ spread on a buy), '
                            'stop and target in the market.'})
                continue
            if x.code not in C.STRONG:
                continue
            fs = {k.short for k in fails}
            if not fs <= set(CONFIRM_ONLY):
                continue
            why = '; '.join(k.text for k in fails if k.short not in ('fresh', 'near entry'))
            why = f' ({why})' if why else ''
            dist_ok = d * (px - z.prox) <= 2 * C.APPROACH_H * z.h
            if 'fresh' in fs:
                if 1 <= nt <= 2 and dist_ok and 'context' not in fs:
                    word = '2nd' if nt == 1 else '3rd'
                    out.append({**base, 'kind': 'WATCH', 'watch_kind': 'tested',
                                'note': f'{word} touch: confirm one timeframe lower ({LOWER_CONFIRM[tf]}).{why}'})
            elif 'near entry' in fs:
                if known_label(an, z) >= recent and fs <= {'near entry', 'area'}:
                    out.append({**base, 'kind': 'WATCH', 'watch_kind': 'new', 'note': f'New {tf} {SIDE[d]} made {z.made}; price still away. Wait for it to come back.{why}'})
            elif 'context' in fs:
                out.append({**base, 'kind': 'WATCH', 'watch_kind': 'context', 'note': f'Context only, no order: {context_note(inst)}.'})
            elif fs == {'area'}:
                out.append({**base, 'kind': 'WATCH', 'watch_kind': 'area',
                            'note': f'{tf} area passes every rule: wait for a D1 / H4 zone inside it (no limit on a {tf} zone).'})
            else:
                out.append({**base, 'kind': 'WATCH', 'watch_kind': 'confirm',
                            'note': f'Confirmation entry only ({LOWER_CONFIRM[tf]}){why}.'})
    best: Dict[Tuple[str, str], Dict] = {}
    rest = []
    for s in out:
        if s['kind'] == 'WATCH':
            rest.append(s)
            continue
        k = (s['tf'], s['side'])
        if k not in best or abs(s['to_entry_pips']) < abs(best[k]['to_entry_pips']):
            best[k] = s
    for s in list(best.values()) + rest:
        if inst['name'].startswith('XAU_'):
            s['gold_note'] = C.GOLD_NOTE
    return list(best.values()) + rest


# ---- zone lists (in / approaching / left per side), one bucket per instrument -------------------------------------
BUCKET = {('supply', 'in'): 'IS', ('supply', 'near'): 'AS', ('supply', 'left'): 'LS', ('demand', 'left'): 'LD',
          ('demand', 'near'): 'AD', ('demand', 'in'): 'ID'}
SECTIONS = ('in', 'left', 'near')


def zone_hits(an: FxAnalysis) -> List[Dict]:
    """Every strong (ARR / WOW / STR), <= 3 touches (forming-bar touches included), not removed entry-TF zone that price is in, has just left (touched
    in the last LEFT_BARS H4 bars, closed back beyond the proximal) or is approaching (within NEAR_H x its height)."""
    px, S = an.price, an.fine
    n = min(C.LEFT_BARS, S.n - 1)
    lo = min(S.L[1:n + 1]) if n > 0 else px
    hi = max(S.H[1:n + 1]) if n > 0 else px
    out = []
    for tf in C.ENTRY_TFS:
        r = an.rows[tf]
        if not r.ok:
            continue
        for i, z in enumerate(r.zones):
            x = an.dna.get(z.zid)
            if x is None or x.code not in C.STRONG or z.removed:
                continue
            nt = tests(an, z, x)
            if nt > C.MAX_TOUCHES:
                continue
            d = z.dir
            if z.lo <= px <= z.hi:
                sec, dist = 'in', 0.0
            elif d * (px - z.prox) > 0:
                dist = d * (px - z.prox)
                if (lo <= z.prox) if d > 0 else (hi >= z.prox):
                    sec = 'left'
                elif dist <= C.NEAR_H * z.h:
                    sec = 'near'
                else:
                    continue
            else:
                continue
            lc = loc_of(an, z)
            rules = zone_rules(an, z, x)
            fb = first_block(rules)
            out.append({'tf': tf, 'side': SIDE[d], 'section': sec, 'zid': z.zid, 'type': x.code, 'touches': nt,
                        'score': score(x, nt, d), 'prox': round(z.prox, an.nd), 'dist': round(z.dist, an.nd),
                        'pips': round(dist / an.pip, 1), 'loc': lc.code, 'loc_ok': lc.ok, 'loc_text': lc.text,
                        'chain_text': lc.chain_text, 'status': KIND[d] if fb is None else fb,
                        'label': KIND[d] if fb is None else BLOCK_LABEL.get(fb, fb)})
    return out


def bucket_of(hits: List[Dict]) -> Optional[Dict]:
    """in > left > approaching; then located first, stronger, nearer."""
    for sec in SECTIONS:
        hs = [h for h in hits if h['section'] == sec]
        if hs:
            h = sorted(hs, key=lambda h: (not h['loc_ok'], -h['score'], h['pips']))[0]
            return {**h, 'b': BUCKET[(h['side'], sec)]}
    return None


def six(r: Z.Row, px: float, nd: int) -> str:
    """3M context line: where price sits against the nearest fresh 3M zones + the 3M trend."""
    if r is None or not r.ok:
        return '3M: n/a (short history)'
    dem = [z for z in r.zones if z.dir > 0 and Z.fresh_at(r.S, z) and z.dist < px]
    sup = [z for z in r.zones if z.dir < 0 and Z.fresh_at(r.S, z) and z.dist > px]
    dz = max(dem, key=lambda z: z.prox) if dem else None
    sz = min(sup, key=lambda z: z.prox) if sup else None
    where, zz = 'middle', None
    if dz is not None and px <= dz.prox:
        where, zz = 'in demand', dz
    elif sz is not None and px >= sz.prox:
        where, zz = 'in supply', sz
    elif dz is not None and (px - dz.prox) / px * 100 <= C.SOFT_REACH_PCT:
        where, zz = 'approaching demand', dz
    elif sz is not None and (sz.prox - px) / px * 100 <= C.SOFT_REACH_PCT:
        where, zz = 'approaching supply', sz
    return f'3M: {where}' + (f' {zz.prox:.{nd}f}–{zz.dist:.{nd}f}' if zz is not None else '') + f' · trend {r.state_name}'


def nearest_checks(an: FxAnalysis) -> List[Dict]:
    """The nearest demand below and supply above (any type, entry TFs) checked against every rule, as if signals:
    the 'why no signal' view of the app."""
    px, out = an.price, []
    for d in (1, -1):
        best = None
        for tf in C.ENTRY_TFS:
            r = an.rows[tf]
            if not r.ok:
                continue
            for z in r.zones:
                if z.zid not in an.dna or z.dir != d:
                    continue
                dist = d * (px - z.prox)
                if best is None or dist < best[0]:
                    best = (dist, z)
        if best is None:
            continue
        z = best[1]
        x = an.dna[z.zid]
        rules = zone_rules(an, z, x)
        fb = first_block(rules)
        out.append({**zone_dict(an, z, x), **plan(an, z, x), 'pips': round(max(0.0, best[0]) / an.pip, 1),
                    'block': fb, 'label': BLOCK_LABEL.get(fb, fb) if fb else KIND[d], 'rules': [k.as_dict() for k in rules],
                    'chain_text': loc_of(an, z).chain_text})
    return out
