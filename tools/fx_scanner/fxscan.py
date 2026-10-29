"""Automated FX zone scanner (Raja rules, top-down MN -> W1 -> D1 -> H4 -> H1, 3M context), Pepperstone symbols, OANDA data.

    python tools/fx_scanner/fxscan.py                    # scan if a new H1 candle closed, write public/fx, Telegram
    python tools/fx_scanner/fxscan.py --force            # scan even without a new H1 candle
    python tools/fx_scanner/fxscan.py --check            # seconds: is there an unscanned complete H1 candle?
    python tools/fx_scanner/fxscan.py --only EURUSD,XAUAUD --no-notify
    python tools/fx_scanner/fxscan.py --selftest         # synthetic data end to end, prints the Telegram text
    python tools/fx_scanner/fxscan.py --preview-telegram # alert / H4 digest / daily summary of public/fx/latest.json

Outputs (contract: tools/fx_scanner/SCHEMA.md): public/fx/latest.json and public/fx/d/<class>.json (per-instrument
detail with bars for the charts). Dedupe state for Telegram: <cache>/state.json (actions/cache); the schedule state
(last scanned H1 / H4, last daily summary, last H4 digest) is also committed as public/fx/state.json.

Hourly: every new H1 candle is a full scan; Telegram then gets ONLY the instant alert when something is new. The H4
digest goes out once per new H4 candle, the daily summary once per new D1 candle (as before H1 was added).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK, os.path.join(HERE, 'fixtures')):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import data as SD  # noqa: E402
import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import fxnotify as N  # noqa: E402
import kevin as K  # noqa: E402
import oanda as O  # noqa: E402
import prefs as P  # noqa: E402  (stock_scanner/prefs.py: the owner's bot preferences)
import watchlist as W  # noqa: E402
import zones as Z  # noqa: E402
from zones import Bar  # noqa: E402

DISCLAIMER = ('Rule-based scan, not financial advice. Levels come from the OANDA feed; Pepperstone quotes can differ by '
              'a few pips: check on your Pepperstone chart (ZoneVision MT5) before placing.')
CHART_BARS = {'H1': 80, 'H4': 80, 'D1': 80, 'W1': 52, 'MN': 60}   # MN: the bot's 4-quarter chart (not built from W1)
USDX_PARTS = {'EUR_USD': -0.576, 'USD_JPY': 0.136, 'GBP_USD': -0.119, 'USD_CAD': 0.091, 'USD_SEK': 0.042, 'USD_CHF': 0.036}
USDX_K = 50.14348112
USDX_META = {'name': 'USDX', 'type': 'INDEX', 'displayName': 'US Dollar Index (synthetic)', 'pipLocation': -2, 'displayPrecision': 3}


def now_utc() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc).replace(tzinfo=None)


# ---- universe --------------------------------------------------------------------------------------------------------
def universe(instruments: List[Dict], wl: Dict, include_cfd: Optional[bool] = None) -> List[Dict]:
    """CURRENCY + METAL (+ CFD with FX_INCLUDE_CFD) + every watchlist instrument (CFDs included), each with sym
    (Pepperstone name), cls, group (watchlist section) and wl."""
    by = {i['name']: i for i in instruments}
    pick = {i['name']: i for i in C.select(instruments, include_cfd)}
    for n in wl['names']:
        if n == 'USDX':
            pick[n] = {**USDX_META, 'cls': 'cfd'}
        elif n in by and n not in pick:
            i = by[n]
            pick[n] = {**i, 'cls': C.fx_class(n, i.get('type') or 'CFD')}
        elif n not in by and n not in pick and not by:
            pick[n] = {'name': n, 'type': 'CFD', 'cls': C.fx_class(n, 'CFD')}
    sym_of = {it['instrument']: W.tv_ticker(it['symbol']) for it in wl['items'] if it['instrument']}
    out = []
    for n, i in pick.items():
        sym = sym_of.get(n) or W.pepper_symbol(n)
        out.append({**i, 'sym': sym, 'tv': f'PEPPERSTONE:{sym}', 'group': wl['sections'].get(n, ''), 'wl': n in wl['sections']})
    order = {n: k for k, n in enumerate(wl['names'])}
    return sorted(out, key=lambda i: (not i['wl'], order.get(i['name'], 0), C.CLASSES.index(i['cls']), i['sym']))


def synth_usdx(parts: Dict[str, Dict[str, List[Bar]]]) -> Dict[str, List[Bar]]:
    """ICE dollar index from OANDA pairs: 50.14348112 x EURUSD^-0.576 x USDJPY^0.136 x GBPUSD^-0.119 x USDCAD^0.091
    x USDSEK^0.042 x USDCHF^0.036, per bar label present in every part. Open / close exact; high / low the bound of
    the parts' extremes (each part's high or low, by the sign of its weight). D1 / W1 / MN bars that the H4 history
    covers from their start take the high / low of their synthetic H4 bars instead (a much tighter bound: the parts'
    extremes rarely fall in the same 4 hours). Still an approximation: USDX is context only (fxcfg.CONTEXT_ONLY)."""
    out: Dict[str, List[Bar]] = {}
    for tf in ('H1', 'H4', 'D1', 'W1', 'MN'):
        maps = {n: {b.d: b for b in parts[n].get(tf, [])} for n in USDX_PARTS}
        common = sorted(set.intersection(*(set(m) for m in maps.values()))) if maps else []
        bars = []
        for lbl in common:
            def val(pick):
                v = USDX_K
                for n, w in USDX_PARTS.items():
                    v *= getattr(maps[n][lbl], pick(w)) ** w
                return v
            o, c = val(lambda w: 'o'), val(lambda w: 'c')
            h, l = val(lambda w: 'h' if w > 0 else 'l'), val(lambda w: 'l' if w > 0 else 'h')
            bars.append(Bar(lbl, o, max(h, o, c), min(l, o, c), c))
        out[tf] = bars
    h4 = out.get('H4') or []
    if h4:
        first = h4[0].d
        for tf in ('D1', 'W1', 'MN'):
            groups: Dict = {}
            for b in h4:
                groups.setdefault(C.period_key(tf, b.d), []).append(b)
            fixed = []
            for b in out[tf]:
                g = groups.get(C.period_key(tf, b.d))
                if g and b.d >= first:
                    hh, ll = max(x.h for x in g), min(x.l for x in g)
                    b = Bar(b.d, b.o, max(hh, b.o, b.c), min(ll, b.o, b.c), b.c)
                fixed.append(b)
            out[tf] = fixed
    return out


# ---- the scan --------------------------------------------------------------------------------------------------------
BarsGetter = Callable[[Dict], Tuple[Dict[str, List[Bar]], Optional[float]]]


def run(uni: List[Dict], get_bars: BarsGetter, workers: int = 4, log=print) -> Dict:
    """Fetch + analyse every instrument. Returns {'analyses': {sym: FxAnalysis}, 'signals', 'watch', 'hits', 'errors',
    'uni'}."""
    bars: Dict[str, Dict[str, List[Bar]]] = {}
    spread: Dict[str, Optional[float]] = {}
    errors: Dict[str, str] = {}
    lock = threading.Lock()

    def one(i):
        if i['name'] == 'USDX':
            return
        try:
            b, sp = get_bars(i)
            with lock:
                bars[i['name']], spread[i['name']] = b, sp
        except Exception as e:  # noqa: BLE001
            with lock:
                errors[i['sym']] = f'{type(e).__name__}: {str(e)[:120]}'
    with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
        list(ex.map(one, uni))
    if any(i['name'] == 'USDX' for i in uni):
        missing = [n for n in USDX_PARTS if n not in bars]
        for n in missing:                                   # parts outside the universe: fetch them too
            try:
                bars[n], _ = get_bars({'name': n, 'type': 'CURRENCY', 'sym': n.replace('_', '')})
            except Exception as e:  # noqa: BLE001
                errors['USDX'] = f'part {n}: {type(e).__name__}'
        if all(n in bars for n in USDX_PARTS):
            bars['USDX'], spread['USDX'] = synth_usdx(bars), None
    analyses, sigs, watch, hits = {}, [], [], {}
    for i in uni:
        b = bars.get(i['name'])
        if not b or len(b.get('H4') or []) < 60:
            if i['sym'] not in errors and i['name'] in bars:
                errors[i['sym']] = 'too little H4 history'
            continue
        try:
            an = F.analyse(i, b, spread.get(i['name']))
            ss = F.signals(an)
            hh = F.zone_hits(an)
        except Exception as e:  # noqa: BLE001
            errors[i['sym']] = f'analysis: {type(e).__name__}: {e}'
            continue
        analyses[i['sym']] = an
        meta = inst_fields(i)
        for s in ss:
            s.update(meta)
            s['ctx3'] = F.six(an.rows['3M'], an.price, an.nd)
            (sigs if s['kind'] in ('BUY', 'SELL') else watch).append(s)
        hits[i['sym']] = [{**h, **meta, 'px': round(an.price, an.nd)} for h in hh]
    sigs.sort(key=lambda s: (not s['wl'], -s['score'], abs(s['to_entry_pips'])))
    watch.sort(key=lambda s: (not s['wl'], -s['score']))
    return {'analyses': analyses, 'signals': sigs, 'watch': watch, 'hits': hits, 'errors': errors, 'uni': uni}


def inst_fields(i: Dict) -> Dict:
    return {'sym': i['sym'], 'oanda': i['name'], 'cls': i['cls'], 'group': i.get('group') or '', 'wl': bool(i.get('wl')),
            'tv': i.get('tv') or f"PEPPERSTONE:{i['sym']}", 'digits': C.digits_of(i), 'pip': C.pip_of(i),
            'exotic': i['cls'] == 'exotic'}


def pack(bars: List[Bar], n: int, nd: int) -> List[list]:
    return [[b.d, round(b.o, nd), round(b.h, nd), round(b.l, nd), round(b.c, nd)] for b in bars[-n:]]


def detail(an: F.FxAnalysis, hits: List[Dict], sigs: List[Dict]) -> Dict:
    i, nd = an.inst, an.nd
    zs = []
    for tf in C.ENTRY_TFS + C.CONTEXT_TFS:
        r = an.rows[tf]
        if not r.ok:
            continue
        for z in r.zones:
            x = an.dna.get(z.zid)
            if x is None or F.tests(an, z, x) > C.MAX_TOUCHES:
                continue
            lc = F.loc_of(an, z) if tf in C.ENTRY_TFS else None
            zs.append({**F.zone_dict(an, z, x), 'pips': round(abs(an.price - z.prox) / an.pip, 1),
                       'loc': lc.code if lc else 'context', 'loc_ok': lc.ok if lc else None, 'loc_text': lc.text if lc else '3M context level'})
    zs.sort(key=lambda z: z['pips'])
    return {**inst_fields(i), 'price': round(an.price, nd), 'date': an.asof, 'h4': an.date,
            'spread_pips': round(an.spread / an.pip, 1) if an.spread is not None else None,
            'states': {t: an.rows[t].state_name for t in F.ROW_TFS}, 'dirs': {t: an.dirs[t].head for t in C.ENTRY_TFS},
            'curves': {t: round(an.curves[t].value, 1) for t in C.ENTRY_TFS if an.curves[t].ok},
            'ctx3': F.six(an.rows['3M'], an.price, nd), 'zones': zs[:16], 'hits': hits, 'checks': F.nearest_checks(an),
            'signals': [s['kind'] + ' ' + s['tf'] for s in sigs],
            'bars': {tf: pack(_closed(an, tf), n, nd) for tf, n in CHART_BARS.items() if an.rows[tf].S.T[-1]},
            'tls': {tf: Z.tl_export(an.rows[tf], nd) for tf in ('H1', 'H4', 'D1', 'W1', 'MN') if an.rows[tf].ok}}


def _closed(an: F.FxAnalysis, tf: str) -> List[Bar]:
    S = an.rows[tf].S
    return [Bar(S.T[j], S.O[j], S.H[j], S.L[j], S.C[j]) for j in range(S.n - 1, 0, -1)]


def lists(res: Dict) -> Dict:
    out = {'demand': {k: [] for k in F.SECTIONS}, 'supply': {k: [] for k in F.SECTIONS}}
    for sym, hh in res['hits'].items():
        b = F.bucket_of(hh)
        if b:
            out[b['side']][b['section']].append(_item(b))
    for side in out:
        for sec in out[side]:
            out[side][sec].sort(key=lambda r: (not r['wl'], not r['loc_ok'], -r['score'], r['pips']))
    return out


def _item(h: Dict) -> Dict:
    keep = ('sym', 'oanda', 'cls', 'group', 'wl', 'px', 'digits', 'tf', 'side', 'type', 'touches', 'score', 'prox', 'dist',
            'pips', 'loc', 'loc_ok', 'loc_text', 'chain_text', 'status', 'label', 'b')
    return {**{k: h.get(k) for k in keep}, 'sec': h['section'], **({'kevin': h['kevin']} if h.get('kevin') else {})}


def public(res: Dict, h4: str, fixture: bool = False, partial: bool = False, extra: Optional[Dict] = None,
           h1: Optional[str] = None) -> Tuple[Dict, Dict[str, Dict]]:
    """(latest.json, {class: detail shard}). h1 = the newest closed H1 bar (the scan's base; None = the H4 bar)."""
    zl = lists(res)
    sig_of = {}
    for s in res['signals'] + res['watch']:
        sig_of.setdefault(s['sym'], s['kind'])
    rows, shards = [], {c: {} for c in C.CLASSES}
    for i in res['uni']:
        an = res['analyses'].get(i['sym'])
        if an is None:
            continue
        hh = res['hits'].get(i['sym'], [])
        b = F.bucket_of(hh)
        rows.append({**{k: v for k, v in inst_fields(i).items() if k not in ('tv',)}, 'px': round(an.price, an.nd),
                     'b': b['b'] if b else 'M', 'z': _item(b) if b else None, 'dir': {t: an.dirs[t].head for t in C.ENTRY_TFS},
                     'states': {t: an.rows[t].state_name for t in F.ROW_TFS},
                     'sp': round(an.spread / an.pip, 1) if an.spread is not None else None, 'sig': sig_of.get(i['sym']), 'k': i['cls']})
        shards[i['cls']][i['sym']] = detail(an, hh, [s for s in res['signals'] + res['watch'] if s['sym'] == i['sym']])
    blocked: Dict[str, int] = {}
    for hh in res['hits'].values():
        for h in hh:
            if h['status'] not in ('BUY', 'SELL'):
                blocked[h['status']] = blocked.get(h['status'], 0) + 1
    groups = []
    for i in res['uni']:
        if i.get('wl') and i['sym'] in res['analyses']:
            if not groups or groups[-1]['name'] != i['group']:
                groups.append({'name': i['group'], 'symbols': []})
            groups[-1]['symbols'].append(i['sym'])
    cls_n = {c: sum(1 for r in rows if r['cls'] == c) for c in C.CLASSES}
    pub = {
        'version': 1, 'generated': now_utc().strftime('%Y-%m-%dT%H:%M:%SZ'), 'h4': h4,
        'h4_close_utc': C.h4_close_utc(h4).strftime('%Y-%m-%dT%H:%M:%SZ') if h4 else None,
        'h1': h1 or None, 'h1_close_utc': C.h1_close_utc(h1).strftime('%Y-%m-%dT%H:%M:%SZ') if h1 else None,
        'fixture': fixture, 'partial': partial, 'broker': 'Pepperstone', 'feed': 'OANDA ' + (os.environ.get('OANDA_ENV') or 'practice'),
        'clock': 'Pepperstone server time (GMT+2 winter / GMT+3 summer, day closes 17:00 New York)',
        'config': {'chain': ['MN', 'W1', 'D1', 'H4', 'H1'], 'context': '3M', 'sl_pct': C.SL_PCT, 'approach_h': C.APPROACH_H,
                   'near_h': C.NEAR_H, 'left_bars': C.LEFT_BARS, 'max_spread_frac': C.MAX_SPREAD_FRAC,
                   'soft_reach_pct': C.SOFT_REACH_PCT, 'gold_usd_min_tf': C.GOLD_USD_MIN_TF,
                   'tp_offset_pips': C.TP_OFFSET_PIPS, 'signal_tfs': list(C.SIGNAL_TFS)},
        'counts': {'instruments': len(rows), 'BUY': sum(s['kind'] == 'BUY' for s in res['signals']),
                   'SELL': sum(s['kind'] == 'SELL' for s in res['signals']), 'WATCH': len(res['watch']), 'errors': len(res['errors'])},
        'classes': [{'id': c, 'label': C.CLASS_LABEL[c], 'n': cls_n[c]} for c in C.CLASSES if cls_n[c]],
        'groups': groups, 'signals': res['signals'], 'watch': res['watch'], 'invalidated': [], 'lists': zl,
        'map': rows, 'blocked': dict(sorted(blocked.items(), key=lambda kv: -kv[1])),
        'block_labels': F.BLOCK_LABEL, 'unmapped': [], 'errors': res['errors'], 'disclaimer': DISCLAIMER,
    }
    pub.update(extra or {})
    gen = pub['generated']
    return pub, {c: {'generated': gen, 'instruments': v} for c, v in shards.items() if v}


def write(pub: Dict, shards: Dict[str, Dict], out_dir: str = C.OUT_DIR) -> str:
    os.makedirs(os.path.join(out_dir, 'd'), exist_ok=True)
    for c, js in shards.items():
        _dump(os.path.join(out_dir, 'd', f'{c}.json'), js)
    for c in C.CLASSES:
        if c not in shards and os.path.exists(os.path.join(out_dir, 'd', f'{c}.json')):
            os.remove(os.path.join(out_dir, 'd', f'{c}.json'))
    path = os.path.join(out_dir, 'latest.json')
    _dump(path, pub)
    return path


def _dump(path: str, obj) -> None:
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(obj, f, separators=(',', ':'), ensure_ascii=False, allow_nan=False, default=_json_default)
    os.replace(tmp, path)


def _json_default(o):
    if isinstance(o, float) and not math.isfinite(o):
        return None
    raise TypeError(type(o).__name__)


# ---- Telegram events + dedupe state ----------------------------------------------------------------------------------
def sig_key(s: Dict) -> str:
    return f"{s['sym']}|{s['kind']}|{s['tf']}|{s['side']}|{s['base_start']}"


def zone_key(h: Dict) -> str:
    return f"{h['sym']}|{h['section']}|{h['zid']}"


def gone_reason(res: Dict, old: Dict) -> str:
    an = res['analyses'].get(old['sym'])
    if an is None:
        return 'no data this run'
    r = an.rows.get(old['tf'])
    z = next((z for z in (r.zones if r and r.ok else []) if z.base_start == old['base_start'] and F.SIDE[z.dir] == old['side']), None)
    px, d = an.price, 1 if old['side'] == 'demand' else -1
    if old.get('stop') is not None and d * (px - old['stop']) <= 0:
        return f"price {px:.{an.nd}f} beyond the stop {old['stop']:.{an.nd}f}: invalidated"
    if z is None or z.removed:
        return 'zone removed by a close: invalidated'
    x = an.dna.get(z.zid)
    if x is None:
        return 'zone no longer on the right side of price'
    if F.tests(an, z, x) > 0:
        return 'price reached the entry (zone tested): limit filled or touched — manage the trade on the platform'
    fb = F.first_block(F.zone_rules(an, z, x))
    return f"rule failing now: {F.BLOCK_LABEL.get(fb, fb)}" if fb else 'replaced by a nearer zone'


KEEP_WHEN_FAILING = ('near entry',)     # a limit order stays valid while price drifts away: no cancel / re-send churn


def still_pending(res: Dict, old: Dict) -> bool:
    """The old signal's zone is still there and only KEEP_WHEN_FAILING rules fail (price moved away from the entry,
    on the right side): keep the order quietly instead of 'Cancelled' now and 'NEW' again at the next approach."""
    an = res['analyses'].get(old['sym'])
    if an is None:
        return False
    r = an.rows.get(old['tf'])
    z = next((z for z in (r.zones if r and r.ok else []) if z.base_start == old['base_start'] and F.SIDE[z.dir] == old['side']), None)
    if z is None or z.removed or z.zid not in an.dna:
        return False
    x = an.dna[z.zid]
    if F.tests(an, z, x) > 0 or z.dir * (an.price - z.prox) <= 0:
        return False
    fails = {k.short for k in F.zone_rules(an, z, x) if k.status == F.FAIL}
    return bool(fails) and fails <= set(KEEP_WHEN_FAILING)


def events(res: Dict, state: Dict, now: dt.datetime) -> Tuple[Dict, Dict]:
    """(events, new_state). New BUY / SELL (all), cancelled signals (all), new WATCH and zone in / near of LOCATED
    strong zones (watchlist only, re-sent per zone at most every DEDUPE_HOURS).
    Instruments without an analysis this run (fetch error, time budget, --only) are carried over silently: no
    'Cancelled' for missing data. A signal whose only failing rule is 'near entry' stays (hysteresis). A cancelled
    signal is not re-announced as NEW for DEDUPE_HOURS (cooldown)."""
    prev_sig = state.get('signals') or {}
    prev_watch = set(state.get('watch') or [])
    prev_zone = set(state.get('zones_now') or [])
    sent = dict(state.get('zones_sent') or {})
    cancelled = dict(state.get('cancelled') or {})
    have = set(res['analyses'])
    cutoff = (now - dt.timedelta(hours=C.DEDUPE_HOURS)).isoformat()
    cur = {sig_key(s): s for s in res['signals']}
    held = {k for k in cur if k not in prev_sig and cancelled.get(k, '') >= cutoff}
    for k in held:
        cur.pop(k)
    ev = {'signals': [s for k, s in cur.items() if k not in prev_sig], 'gone': [], 'watch': [], 'zones': []}
    carry: Dict[str, Dict] = {}
    for k, old in prev_sig.items():
        if k in cur:
            continue
        if old.get('sym') not in have or still_pending(res, old):
            carry[k] = old                                  # no data this run / only drifted away: say nothing
            continue
        ev['gone'].append({**old, 'reason': gone_reason(res, old)})
        cancelled[k] = now.isoformat()
    wkeys = {sig_key(s): s for s in res['watch'] if s.get('wl')}
    ev['watch'] = [s for k, s in wkeys.items() if k not in prev_watch]
    sym_of = lambda key: key.split('|', 1)[0]  # noqa: E731
    wcarry = [k for k in prev_watch if sym_of(k) not in have]
    zkeys = {}
    for sym, hh in res['hits'].items():
        for h in hh:
            if h.get('wl') and h['loc_ok'] and h['section'] in ('in', 'near'):
                zkeys[zone_key(h)] = h
    for k, h in zkeys.items():
        if k not in prev_zone and sent.get(k, '') < cutoff:
            ev['zones'].append({**h, 'sec': h['section']})
            sent[k] = now.isoformat()
    sent = {k: v for k, v in sent.items() if v >= (now - dt.timedelta(days=7)).isoformat()}
    keep = ('sym', 'kind', 'tf', 'side', 'base_start', 'entry', 'stop', 'digits')
    week = (now - dt.timedelta(days=7)).isoformat()
    new = {**state, 'signals': {**carry, **{k: {f: s.get(f) for f in keep} for k, s in cur.items()}},
           'watch': sorted(set(wkeys) | set(wcarry)),
           'zones_now': sorted(set(zkeys) | {k for k in prev_zone if sym_of(k) not in have}), 'zones_sent': sent,
           'cancelled': {k: v for k, v in cancelled.items() if v >= week}}
    return ev, new


ALERT_KEYS = ('signals', 'watch', 'zones_now', 'zones_sent', 'cancelled', 'fired_alerts')


# ---- the owner's bot preferences (stock_scanner/prefs.py) and Kevin's plan ---------------------------------------------
def merge_watch(wl: Dict, syms, known: Optional[set]) -> List[str]:
    """Adds the bot's extra watch symbols (Pepperstone names) to the watchlist (section 'BOT WATCH'); returns the
    OANDA names added. Only instruments on the account (known); stock tickers and unknown names are ignored."""
    added = []
    if not known:
        return added
    for sym in syms or []:
        inst = W.map_symbol(f'PEPPERSTONE:{sym}', known)
        if inst and inst not in wl['sections']:
            wl['sections'][inst] = 'BOT WATCH'
            wl['names'].append(inst)
            wl['items'].append({'section': 'BOT WATCH', 'symbol': f'PEPPERSTONE:{sym}', 'instrument': inst})
            added.append(inst)
    return added


def mark_kevin(res: Dict, lvls: List[Dict]) -> int:
    """'kevin' on every signal / watch / zone hit that overlaps a level of Kevin's newest plans (kevin.py)."""
    n = K.annotate(res['signals'] + res['watch'], lvls)
    for hh in res['hits'].values():
        n += K.annotate(hh, lvls, 'prox', 'dist', 'px')
    return n


def alert_inputs(res: Dict) -> Dict[str, Dict]:
    """Per analysed symbol: the latest closed bar (H1, else H4), the located strong zones with their section, the
    price: what prefs.evaluate needs."""
    out = {}
    for sym, an in res['analyses'].items():
        S = an.rows['H1'].S if an.rows.get('H1') is not None and an.rows['H1'].S.n > 1 else an.fine
        bar = {'h': S.H[1], 'l': S.L[1], 'c': S.C[1]} if S.n > 1 else None
        zones = [{'tf': h['tf'], 'side': h['side'], 'prox': h['prox'], 'dist': h['dist'], 'sec': h['section'],
                  'loc_ok': h.get('loc_ok')} for h in res['hits'].get(sym, []) if h.get('loc_ok')]
        out[sym] = {'bar': bar, 'zones': zones, 'price': an.price, 'digits': an.nd}
    return out


def telegram_configured() -> bool:
    return bool(os.environ.get('TELEGRAM_BOT_TOKEN') and os.environ.get('TELEGRAM_CHAT_ID'))


def unsent_state(new_state: Dict, old_state: Dict) -> Dict:
    """The state to save when the Telegram send failed: the alert keys of the OLD state (so the next run sends the
    same events again), everything else (last_h4, summary day) from the new one."""
    out = {k: v for k, v in new_state.items() if k not in ALERT_KEYS and k != 'summary_d1'}
    for k in ALERT_KEYS + ('summary_d1',):
        if k in old_state:
            out[k] = old_state[k]
    return out


def state_path() -> str:
    return os.path.join(C.CACHE, 'state.json')


SCHEDULE_KEYS = ('last_h1', 'last_h4', 'summary_d1', 'digest_h4')


def _read(path: str) -> Dict:
    try:
        with open(path) as f:
            v = json.load(f)
        return v if isinstance(v, dict) else {}
    except (OSError, ValueError):
        return {}


def load_state(public_path: Optional[str] = None) -> Dict:
    """The cache state (alert dedupe) merged with the committed schedule state (public/fx/state.json): for each of
    SCHEDULE_KEYS the newer value wins, so a lost or evicted actions cache never re-scans / re-sends a summary."""
    st = _read(state_path())
    pub = _read(public_path or C.PUBLIC_STATE)
    for k in SCHEDULE_KEYS:
        if isinstance(pub.get(k), str) and pub[k] > str(st.get(k) or ''):
            st[k] = pub[k]
    return st


def save_public_state(st: Dict, path: Optional[str] = None) -> None:
    """The small committed schedule state (no alert data)."""
    path = path or C.PUBLIC_STATE
    os.makedirs(os.path.dirname(path), exist_ok=True)
    _dump(path, {**{k: st.get(k) for k in SCHEDULE_KEYS}, 'updated': now_utc().strftime('%Y-%m-%dT%H:%M:%SZ')})


def needs_scan(bar: Optional[str], state: Dict, key: str = 'last_h4') -> bool:
    """True when the newest complete candle (H1 for the hourly scan: key 'last_h1') has not been scanned yet
    (catch-up: a late or dropped cron run is picked up by the next one)."""
    return bool(bar) and bar != state.get(key)


def needs_digest(h4: Optional[str], state: Dict, force: bool = False) -> bool:
    """The H4 digest: once per new H4 candle (an hourly scan inside the same H4 bar sends none)."""
    return bool(h4) and (force or h4 != state.get('digest_h4'))


def gh_output(**kv) -> None:
    p = os.environ.get('GITHUB_OUTPUT')
    if p:
        with open(p, 'a') as f:
            for k, v in kv.items():
                f.write(f'{k}={v}\n')


def save_state(st: Dict) -> None:
    os.makedirs(C.CACHE, exist_ok=True)
    _dump(state_path(), st)


def notify_failure(reason: str, state: Dict, notify: bool, log=print) -> None:
    """At most one failure message per day."""
    day = now_utc().date().isoformat()
    log(f'FX scan failed: {reason}')
    if notify and state.get('fail_day') != day:
        N.send([N.failure_message(reason)])
        state['fail_day'] = day
        save_state(state)


# ---- OANDA getter ----------------------------------------------------------------------------------------------------
def oanda_bars(i: Dict) -> Tuple[Dict[str, List[Bar]], Optional[float]]:
    out, sp = {}, None
    for tf in C.ENTRY_TFS:
        bars, rec = O.update(i['name'], tf)
        out[tf] = bars
        if tf == 'H4':
            sp = F.typical_spread(O.spreads(rec))
    return out, sp


# ---- selftest --------------------------------------------------------------------------------------------------------
SELFTEST = [  # (Pepperstone symbol, OANDA name, type, start price, vol, seed, watchlist group); seed 'tb+' / 'tb-' = the
    # hand-built textbook BUY / SELL (fixtures/textbook_fx.py), the others random walks (seeds found by a search)
    ('EURUSD', 'EUR_USD', 'CURRENCY', 1.10, 0.0016, 'tb+', 'FX MAJORS'), ('GBPUSD', 'GBP_USD', 'CURRENCY', 1.2, 0.0016, 'tb-', 'FX MAJORS'),
    ('GBPJPY', 'GBP_JPY', 'CURRENCY', 185.0, 0.0016, 827, 'FX CROSSES'),
    ('AUDUSD', 'AUD_USD', 'CURRENCY', 0.68, 0.0016, 63, ''), ('EURCAD', 'EUR_CAD', 'CURRENCY', 1.48, 0.0016, 506, ''),
    ('USDZAR', 'USD_ZAR', 'CURRENCY', 18.2, 0.0016, 72, ''), ('XAUAUD', 'XAU_AUD', 'METAL', 3900.0, 0.0016, 636, 'METALS'),
    ('XAUUSD', 'XAU_USD', 'METAL', 2600.0, 0.0016, 1077, 'METALS'), ('US500', 'SPX500_USD', 'CFD', 5600.0, 0.0016, 4, 'INDICES'),
]


def selftest_universe(seeds: Optional[Dict[str, int]] = None):
    import synth_fx
    import textbook_fx
    insts, data = [], {}
    for sym, name, kind, start, vol, seed, grp in SELFTEST:
        seed = (seeds or {}).get(sym, seed)
        i = {'name': name, 'type': kind, 'pipLocation': -2 if name.endswith('JPY') or name.startswith('XAU') else (0 if kind == 'CFD' else -4),
             'displayPrecision': 3 if name.endswith('JPY') else (2 if name.startswith('XAU') or kind == 'CFD' else 5)}
        insts.append(i)
        data[name] = (textbook_fx.textbook(1 if seed == 'tb+' else -1) if isinstance(seed, str)
                      else synth_fx.instrument(seed, start=start, vol=vol))
    wl = {'names': [n for (_, n, *_r, g) in SELFTEST if g], 'sections': {n: g for (_, n, *_r, g) in SELFTEST if g},
          'items': [{'symbol': f'PEPPERSTONE:{s}', 'instrument': n, 'section': g} for (s, n, *_r, g) in SELFTEST if g],
          'unmapped': [{'symbol': 'PEPPERSTONE:VIX', 'section': 'INDICES', 'note': 'not on OANDA'}], 'source': 'selftest'}
    uni = universe(insts, wl, include_cfd=False)
    return uni, data, wl


def selftest(out_dir: Optional[str] = None, send: bool = False) -> int:
    uni, data, wl = selftest_universe()
    res = run(uni, lambda i: (data[i['name']], 0.6 * C.pip_of(i)), log=None)
    h4 = max(b['H4'][-1].d for b in data.values())
    h1 = max((b['H1'][-1].d for b in data.values() if b.get('H1')), default=None)
    pub, shards = public(res, h4, fixture=True, extra={'unmapped': wl['unmapped'], 'watchlist_source': 'selftest'}, h1=h1)
    if out_dir:
        write(pub, shards, out_dir)
    ev, st = events(res, {'signals': {}}, now_utc())
    msgs = N.alert_messages({**ev, 'h4': h4, 'h1': h1}) + N.summary_messages(pub)
    for m in msgs:
        print(m)
        print('\n' + '-' * 40 + '\n')
    if send:
        N.send(msgs)
    c = pub['counts']
    print(f"selftest: {c['instruments']} instruments, {c['BUY']} BUY, {c['SELL']} SELL, {c['WATCH']} WATCH, "
          f"{sum(len(v) for v in pub['lists']['demand'].values()) + sum(len(v) for v in pub['lists']['supply'].values())} listed, "
          f"{len(msgs)} message(s), max {max(N.u16(m) for m in msgs)} UTF-16 units")
    ok = c['instruments'] == len(uni) and not res['errors'] and all(N.u16(m) <= 4096 for m in msgs)
    return 0 if ok else 1


# ---- on-demand (bot /scan SYM) -----------------------------------------------------------------------------------------
def ondemand_messages(res: Dict, uni: List[Dict], only: str, h1: Optional[str], h4: str) -> List:
    """One card per asked symbol (at most 3): the full rule set on the newest closed candle, nothing written."""
    if not uni:
        return [N.ondemand_missing(only.split(',')[0].strip().upper() or '?', 'not an instrument the FX scanner covers')]
    out = []
    for i in uni[:3]:
        an = res['analyses'].get(i['sym'])
        if an is None:
            out.append(N.ondemand_missing(i['sym'], res['errors'].get(i['sym']) or 'no candles from OANDA'))
            continue
        sigs = [s for s in res['signals'] + res['watch'] if s['sym'] == i['sym']]
        out.append(N.ondemand_card(detail(an, res['hits'].get(i['sym'], []), sigs), sigs, h1 or '', h4))
    return out


def ondemand(res: Dict, uni: List[Dict], only: str, h1: Optional[str], h4: str, notify: bool) -> int:
    msgs = ondemand_messages(res, uni, only, h1, h4)
    if notify and telegram_configured():
        ok = N.send(msgs)
        print(f'on-demand: {len(msgs)} card(s) ' + ('sent' if ok else 'NOT sent'))
        return 0 if ok else 1
    for m in msgs:
        print(m + '\n' + '-' * 40)
    return 0


# ---- main ------------------------------------------------------------------------------------------------------------
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--force', action='store_true', help='scan even when no new H1 candle closed')
    ap.add_argument('--only', default='', help='comma-separated Pepperstone symbols or OANDA names')
    ap.add_argument('--no-notify', action='store_true')
    ap.add_argument('--no-write', action='store_true')
    ap.add_argument('--ondemand', action='store_true',
                    help='with --only: the bot asked for this scan (/scan SYM): send ONE result card per symbol, write and '
                         'mark nothing (no public files, no alert state, no prefs alerts)')
    ap.add_argument('--summary', action='store_true', help='send the daily summary now')
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--preview-telegram', action='store_true',
                    help='print the alert, H4 digest and daily summary of the published public/fx/latest.json; sends nothing')
    ap.add_argument('--preview-from', default='', help='--preview-telegram: another latest.json (e.g. fixtures/sample)')
    ap.add_argument('--workers', type=int, default=int(os.environ.get('FX_WORKERS') or 4))
    ap.add_argument('--notify-failure', default='', help='send one "FX scan failed" Telegram message (workflow steps)')
    ap.add_argument('--check', action='store_true',
                    help='only check whether a new H1 candle needs scanning (prints it, sets the GitHub output scan=true/false)')
    a = ap.parse_args(argv)
    if a.check:
        try:
            O.token()
            h1 = O.latest_h1()
        except Exception as e:  # noqa: BLE001  (no token / OANDA down: let the full run report it, once a day)
            print(f'check failed ({type(e).__name__}): running the scan step to report it')
            gh_output(scan='true')
            return 0
        st = load_state()
        need = needs_scan(h1, st, 'last_h1')
        print(f"newest H1 {h1} server time, last scanned {st.get('last_h1')}: " + ('scan' if need else 'nothing to do'))
        gh_output(scan='true' if need else 'false', h1=h1 or '')
        return 0
    if a.notify_failure:
        notify_failure(a.notify_failure, load_state(), True)
        return 0
    if a.selftest:
        return selftest(os.path.join(HERE, 'fixtures', 'sample'))
    if a.preview_telegram:
        src = a.preview_from or os.path.join(C.OUT_DIR, 'latest.json')
        if not os.path.exists(src):
            src = os.path.join(HERE, 'fixtures', 'sample', 'latest.json')
        with open(src) as f:
            pub = json.load(f)
        print(f'(from {os.path.relpath(src)})')
        for kind, msgs in N.preview_messages(pub).items():
            print(f'===== {kind} =====')
            N.SN.print_messages(msgs) if msgs else print('(nothing to send)')
        return 0
    t0 = time.time()
    SD.set_budget(C.BUDGET_MIN)
    state = load_state()
    notify = not a.no_notify
    try:
        O.token()
        h4 = O.latest_h4()
        h1 = O.latest_h1()
    except O.NoToken as e:
        notify_failure(str(e), state, notify)
        return 2
    except Exception as e:  # noqa: BLE001
        notify_failure(f'OANDA not reachable ({type(e).__name__}: {str(e)[:100]})', state, notify)
        return 2
    if not h4:
        print('no complete H4 candle returned')
        return 0
    if h1 and C.h4_bucket(h1) < h4:
        h1 = None                                           # an H1 answer older than the H4 one: scan on H4
    if not needs_scan(h1 or h4, state, 'last_h1' if h1 else 'last_h4') and not (a.force or a.summary or a.only):
        print(f'no new H1 candle since {h1 or h4} (server time): nothing to do')
        return 0
    instruments, src = O.account_instruments(log=print)
    known = {i['name'] for i in instruments} if src != 'fallback' else None
    wl = W.load(known)
    prefs = P.fetch(log=print)                           # once per run; None = exactly as without the bot prefs
    added = merge_watch(wl, P.watch_syms(prefs), known)
    if added:
        print(f"prefs: {len(added)} extra watch symbol(s) merged: {', '.join(added)}")
    if wl['unmapped']:
        print(f"watchlist ({wl['source']}): {len(wl['unmapped'])} not on OANDA: " + ', '.join(u['symbol'] for u in wl['unmapped']))
    uni = universe(instruments, wl)
    if a.only:
        want = {s.strip().upper() for s in a.only.split(',') if s.strip()}
        uni = [i for i in uni if i['sym'].upper() in want or i['name'].upper() in want]
    print(f'{len(uni)} instruments ({src} list, watchlist {len(wl["names"])} from {wl["source"]}), newest H1 {h1}, H4 {h4} server time')
    res = run(uni, oanda_bars, workers=a.workers)
    have = len(res['analyses'])
    print(f'analysed {have}/{len(uni)} in {time.time() - t0:.0f}s; {len(res["errors"])} errors')
    if O.DROPPED:
        print(f'warning: dropped {sum(O.DROPPED.values())} misaligned candle(s) older than {O.STRICT_DAYS} days: '
              + ', '.join(f'{k} x{v}' for k, v in sorted(O.DROPPED.items())[:5]))
    if C.MISALIGNED_MN:
        print(f'warning: {len(C.MISALIGNED_MN)} MN candle(s) not at the 1st 00:00 server time (accepted within 12 h), e.g. '
              + ', '.join(sorted(C.MISALIGNED_MN)[:3]))
    for s, e in list(res['errors'].items())[:15]:
        print(f'  {s}: {e}')
    if a.ondemand:
        return ondemand(res, uni, a.only, h1, h4, notify)
    if have < max(1, C.MIN_COVERAGE * len(uni)):
        notify_failure(f'only {have}/{len(uni)} instruments have data; nothing published', state, notify)
        return 2
    nk = mark_kevin(res, K.load(log=print))
    if nk:
        print(f"kevin: {nk} scanner zone(s) / signal(s) also in Kevin's plan")
    pub, shards = public(res, h4, partial=SD.over_budget(), extra={
        'unmapped': wl['unmapped'], 'watchlist_source': wl['source'], 'instrument_source': src}, h1=h1)
    bootstrap = 'signals' not in state
    ev, new_state = events(res, state, now_utc())
    pub['invalidated'] = [{k: g.get(k) for k in ('sym', 'kind', 'tf', 'side', 'entry', 'reason')} for g in ev['gone']]
    if not a.no_write and not a.only:
        print('wrote', write(pub, shards))
    eur = res['analyses'].get('EURUSD') or next(iter(res['analyses'].values()))
    d1 = eur.rows['D1'].S.T[1] if eur.rows['D1'].S.n > 1 else ''
    msgs = []
    if notify and telegram_configured():
        N.SN.NEWS = N.SN.load_news('fx')                 # '⚠️ US CPI in 20 min' on the cards of affected pairs
    muted, quiet = P.muted_set(prefs), P.in_quiet(prefs)
    if prefs is not None:
        print(f"prefs applied: {len(muted)} muted now{' (' + ', '.join(sorted(muted)[:8]) + ')' if muted else ''}, "
              f"quiet hours {'ON (non-urgent messages silent)' if quiet else 'off'}")
    hush = lambda ms, loud=False: [N.SN.silenced(m, quiet and not loud) for m in ms]  # noqa: E731
    fired_before = dict(state.get('fired_alerts') or {})
    fired = [] if a.only else P.evaluate(prefs, alert_inputs(res), fired_before)
    if bootstrap:
        msgs += hush([f"✅ <b>FX scanner started</b>: {len(uni)} instruments, {pub['counts']['BUY']} BUY / "
                      f"{pub['counts']['SELL']} SELL now. From here on only new events are sent, plus a daily summary."])
    else:
        msgs += hush(N.alert_messages({**ev, 'h4': h4, 'h1': h1}, muted), N.urgent(ev, muted))
    for f in fired:                                      # one calm message per fired user alert
        msgs += hush(N.fired_messages([f], hourly=bool(h1)), f['alert']['kind'] == 'price')
        fired_before[str(f['alert']['id'])] = now_utc().isoformat()
    if fired:
        print(f"prefs: {len(fired)} alert(s) fired: " + ', '.join(f"{f['sym']} {f['alert']['kind']}" for f in fired))
    month = (now_utc() - dt.timedelta(days=30)).isoformat()
    new_state['fired_alerts'] = {k: v for k, v in fired_before.items() if v >= month}
    summary = a.summary or (not a.only and (bootstrap or (d1 and d1 != state.get('summary_d1'))))
    if summary:
        msgs += hush(N.summary_messages(pub))
        new_state['summary_d1'] = d1
    # hourly scans inside the same H4 bar: the instant alert only (above, [] when nothing is new); the digest once
    # per new H4 candle, the daily summary once per new D1 candle
    if C.H4_DIGEST and not a.only and needs_digest(h4, state, a.force):
        if not summary:                                    # the daily summary already is this candle's overview
            msgs += hush([N.digest_message(pub, ev if not bootstrap else {})])
        new_state['digest_h4'] = h4
    ok = True
    if notify and msgs:
        ok = N.send(msgs) or not telegram_configured()
    elif msgs:
        for m in msgs:
            print(m + '\n' + '-' * 40)
    if not ok:
        print('Telegram send failed: alert state kept, the events are sent again next run')
        new_state = unsent_state(new_state, state)
    elif notify and telegram_configured():
        for f in fired:
            P.alert_fired(f['alert']['id'], log=print)
    if a.only:
        new_state['last_h4'] = state.get('last_h4')        # a partial run never marks the H1 / H4 bar as scanned
        new_state['last_h1'] = state.get('last_h1')
    else:
        new_state['last_h4'] = h4
        new_state['last_h1'] = h1 or state.get('last_h1')
    save_state(new_state)
    if not a.no_write and not a.only:
        save_public_state(new_state)
    print(f'done in {time.time() - t0:.0f}s: {len(ev["signals"])} new signals, {len(ev["gone"])} cancelled, '
          f'{len(ev["zones"])} zone alerts, {len(msgs)} message(s)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
