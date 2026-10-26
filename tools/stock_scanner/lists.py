"""Daily zone lists: every stock by where its last close sits against its W1 / MN / 3M zones, per side.

    DEMAND  in      the close is inside a demand (distal <= close <= proximal)
            left    a demand was touched in the last LEFT_SESSIONS sessions (low <= proximal) and the close is back
                    above the proximal: it bounced
            near    the close is at most NEAR_PCT % above a demand proximal (approaching)
    SUPPLY  the mirror (in supply, left = rejected, near = approaching from below)

Zones: fresh or tested (at most MAX_TOUCHES touches), not removed, on W1 / MN / 3M only (owner: stocks never below
W1; D1 bars only give the close). Each stock lands in ONE bucket (in > left > approaching > middle), so the Telegram
lists, latest.json and the app's market map agree. Each row also carries the zone's top-down HTF location
(loc / loc_text: "inside the touched MN demand ..." / "strong MN demand ... still below (-8%)"), from the scan.
Works on the per-ticker detail dicts (t/<k>.json shards), so the same code runs in the scan and on committed files.
"""
from __future__ import annotations

import datetime as dt
import os
from typing import Dict, List, Optional, Sequence, Tuple

NEAR_PCT = float(os.environ.get('SCANNER_NEAR_PCT') or '3')     # approaching: close within X% of the proximal
LEFT_SESSIONS = int(os.environ.get('SCANNER_LEFT_SESSIONS') or '3')
MAX_TOUCHES = 3                                                # fresh, 2nd or 3rd touch (Raja: no 4th)
TFS = ('W1', 'MN', '3M')                                       # owner: nothing below W1 for stocks
STRONG = ('ARR', 'WOW', 'STR')
SECTIONS = ('in', 'left', 'near')
# index.json bucket codes, supply side first (the app's column order)
BUCKET = {('supply', 'in'): 'IS', ('supply', 'near'): 'AS', ('supply', 'left'): 'LS', ('demand', 'left'): 'LD',
          ('demand', 'near'): 'AD', ('demand', 'in'): 'ID'}
BUCKET_ORDER = ['IS', 'AS', 'LS', 'M', 'LD', 'AD', 'ID']

# Veto priority for "the first failing rule": market gates first (curve, direction, HTF supply, sideways), then
# zone quality, then the trade geometry, the calendar and last the distance.
BLOCK_ORDER = ['location', 'curve', 'HTF align', 'no HTF supply', 'not sideways', 'strong', 'fresh', 'clean', 'not used',
               'no 3rd CP', 'room', 'earnings', 'near entry']
BLOCK_LABEL = {'location': 'HTF area not reached', 'curve': 'high on curve', 'HTF align': 'direction not long', 'no HTF supply': 'monthly supply on top',
               'not sideways': 'sideways market', 'strong': 'weak zone type', 'fresh': 'zone already tested',
               'clean': 'overlap / flip zone', 'not used': 'zone already did its job', 'no 3rd CP': '3rd CP in a row',
               'room': 'room < 2x the stop (supply or 250% projection)', 'earnings': 'earnings within 10 days',
               'near entry': 'price not near the entry'}


def first_block_of(rules: Sequence[Dict]) -> Optional[str]:
    """The highest-priority failing rule of rule dicts ({status, short}); None when nothing fails."""
    fails = sorted({r.get('short') or '' for r in rules if r.get('status') == 'fail'} - {''})
    return next((k for k in BLOCK_ORDER if k in fails), fails[0] if fails else None)


def zone_strength(z: Dict) -> float:
    """Raja score when the scan wrote one; else type (ARR / WOW 4, STR 3) + freshness (2, 2nd touch 1)."""
    if isinstance(z.get('score'), (int, float)):
        return float(z['score'])
    t = z.get('type') or ''
    n = int(z.get('touches') or 0)
    return (4 if t in ('ARR', 'WOW') else 3 if t == 'STR' else 0) + (2 if n == 0 else 1 if n == 1 else 0)


def last_bars(detail: Dict, n: int) -> List[Tuple[str, float, float, float, float]]:
    """The last n daily bars of a detail's packed bars as (date, o, h, l, c)."""
    p = detail.get('bars') or {}
    b, dts, t0 = p.get('b') or [], p.get('dt') or [], p.get('t0')
    out = []
    for i in range(max(0, len(b) - n), len(b)):
        d = ''
        if t0:
            try:
                d = (dt.date.fromisoformat(t0) + dt.timedelta(days=dts[i] if i < len(dts) else i)).isoformat()
            except ValueError:
                d = ''
        o, h, l, c = b[i][:4]
        out.append((d, o, h, l, c))
    return out


def _cands(detail: Dict, near_pct: float, left_n: int) -> Dict[Tuple[str, str], List[Tuple[Dict, float]]]:
    """{(side, section): [(zone, pct)]}: pct = % from the close to the proximal (0 inside, > 0 away)."""
    bars = last_bars(detail, left_n)
    if not bars:
        return {}
    c = bars[-1][4]
    lo, hi = min(b[3] for b in bars), max(b[2] for b in bars)
    out: Dict[Tuple[str, str], List[Tuple[Dict, float]]] = {}
    for z in detail.get('zones') or []:
        if z.get('tf') not in TFS or int(z.get('touches') or 0) > MAX_TOUCHES:
            continue
        p, d = float(z['proximal']), float(z['distal'])
        if z.get('side') == 'demand':
            if d <= c <= p:
                out.setdefault(('demand', 'in'), []).append((z, 0.0))
            elif c > p:
                pct = (c - p) / c * 100
                if lo <= p:
                    out.setdefault(('demand', 'left'), []).append((z, pct))
                elif pct <= near_pct:
                    out.setdefault(('demand', 'near'), []).append((z, pct))
        elif z.get('side') == 'supply':
            if p <= c <= d:
                out.setdefault(('supply', 'in'), []).append((z, 0.0))
            elif c < p:
                pct = (p - c) / c * 100
                if hi >= p:
                    out.setdefault(('supply', 'left'), []).append((z, pct))
                elif pct <= near_pct:
                    out.setdefault(('supply', 'near'), []).append((z, pct))
    return out


def _best(zs: List[Tuple[Dict, float]]) -> Tuple[Dict, float]:
    return sorted(zs, key=lambda t: (-zone_strength(t[0]), t[1], -float(t[0]['proximal'])))[0]


def status_of(detail: Dict, z: Dict, side: str, row: Optional[Dict] = None) -> Tuple[str, str]:
    """(code, words): 'BUY' / 'WATCH' when today's signal is on this zone, else the first rule that blocks a BUY on
    it (demand); supply: the direction (no buys in a supply, the scanner is long only)."""
    if side == 'supply':
        d = detail.get('direction') or ''
        return 'dir', f'dir {d}' if d else 'no buys'
    chk = detail.get('check') or {}
    cz = chk.get('zone') or {}
    same = cz.get('tf') == z.get('tf') and abs(float(cz.get('proximal') or 0) - float(z['proximal'])) < 1e-6
    if same and chk.get('kind') == 'BUY':
        return 'BUY', 'BUY'
    if same and detail.get('signal') == 'WATCH':
        return 'WATCH', 'WATCH'
    k = z.get('br')
    if k is None and same:
        k = first_block_of(chk.get('rules') or [])
    if k is None and row is not None and row.get('br') and row.get('dz') and row['dz'][0] == z.get('tf'):
        k = row['br']
    if k == '':
        return ('BUY', 'BUY') if detail.get('signal') == 'BUY' else ('ok', 'rules pass')
    if not k:
        return '', ''
    return k, BLOCK_LABEL.get(k, k)


def classify(detail: Dict, near_pct: float = NEAR_PCT, left_n: int = LEFT_SESSIONS, row: Optional[Dict] = None) -> Optional[Dict]:
    """The stock's one bucket and the zone it is shown with; None = middle (or no bars)."""
    cs = _cands(detail, near_pct, left_n)
    if not cs:
        return None
    pick = None
    for sec in SECTIONS:                      # in > left > approaching; across sides the stronger (then nearer) zone
        both = [(side, *_best(cs[(side, sec)])) for side in ('demand', 'supply') if cs.get((side, sec))]
        if both:
            pick = (sec, *sorted(both, key=lambda t: (-zone_strength(t[1]), t[2]))[0])
            break
    if pick is None:
        return None
    sec, side, z, pct = pick
    code, words = status_of(detail, z, side, row)
    return {'s': detail['symbol'], 'n': detail.get('name') or detail['symbol'], 'sec': detail.get('sector') or 'Other',
            'h': detail.get('home') or '', 'cur': detail.get('currency') or 'USD', 'ix': detail.get('indexes') or [],
            'px': detail.get('price'), 'side': side, 'section': sec, 'b': BUCKET[(side, sec)],
            'tf': z['tf'], 'type': z.get('type') or '', 'score': z.get('score'), 'touches': int(z.get('touches') or 0),
            'prox': z['proximal'], 'dist': z['distal'], 'pct': round(pct, 2), 'status': code, 'label': words,
            'loc': z.get('loc') or '', 'loc_text': z.get('loc_text') or ''}


def zone_lists(details: Dict[str, Dict], rows: Optional[Dict[str, Dict]] = None, near_pct: float = NEAR_PCT,
               left_n: int = LEFT_SESSIONS) -> Dict:
    """{near_pct, left_sessions, counts, demand: {in, left, near}, supply: {in, left, near}}; each list strongest zone
    first (score, then nearest)."""
    out = {'near_pct': near_pct, 'left_sessions': left_n, 'tfs': list(TFS),
           'demand': {k: [] for k in SECTIONS}, 'supply': {k: [] for k in SECTIONS}}
    for sym in sorted(details):
        it = classify(details[sym], near_pct, left_n, (rows or {}).get(sym))
        if it:
            out[it['side']][it['section']].append(it)
    for side in ('demand', 'supply'):
        for sec in SECTIONS:
            out[side][sec].sort(key=lambda r: (-zone_strength({'score': r['score'], 'type': r['type'], 'touches': r['touches']}), r['pct'], r['s']))
    out['counts'] = {f'{side}_{sec}': len(out[side][sec]) for side in ('demand', 'supply') for sec in SECTIONS}
    return out


def row_fields(item: Optional[Dict]) -> Dict:
    """index.json fields of a stock's bucket: mb code, mz [tf, type, score, touches, pct, proximal], mr status,
    ml [location code, location text] (new; absent when the zone has no location)."""
    if not item:
        return {'mb': 'M'}
    out = {'mb': item['b'], 'mz': [item['tf'], item['type'], item['score'], item['touches'], item['pct'], item['prox']],
           'mr': item['status'] or None}
    if item.get('loc'):
        out['ml'] = [item['loc'], item.get('loc_text') or '']
    return out
