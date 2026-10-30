"""Telegram alerts for the Raja arrival / realignment rules (arrival.py), shared by the FX and the stock scanner.

Three calm alerts, at most DAY_CAP (8) messages a day over every job together (Calgary day), batched per run:
    ⚡ New arrival zone       an arrival forms on 3M / MN / W1 / D1 / H4 (FX also H1): the entry zone, the zones it
                             removed (1 or 2+ = strong), the target and the higher-TF line that caps it
    🔁 Realignment watch     price ENTERS a realignment area (once per arrival)
    ✅ Confirmation           a lower-TF arrival forms inside the area: the A+ trade (entry, stop, target, R:R)
Items are plain dicts (JSON: they live in the state files on the data branch):
    arrival  {kind, sym, tf, dir, lo, hi, prox, dist, n_removed, target, target_kind, target_tf, ceiling, ceiling_tf,
              htf_crossed, area: {tf, dir, lo, hi} | None, price, digits, id, date}
    watch    {kind, sym, tf, dir (the area's side), lo, hi, arr_dir, arr_prox, ltf, htf, price, digits, id}
    confirm  {kind, sym, tf, ltf, dir, entry, stop, target, rr, lo, hi, n_removed, area_lo, area_hi, price, digits, id}
Distances in % of price (never pips), times on the owner's clock (Calgary), the existing card style with the bot's
[📊 Chart] [🔎 Zones] buttons. Mutes, quiet hours and the guests' markets through prefs / guests.
State files (each written by ONE job, read by the others for the shared daily cap):
    public/fx/arrivals.json      fx-scan (hourly): seen arrivals, realignment areas (entered / inside), H4+ confirmations
    public/fx/realign.json       realign.yml (15 min): the M15 / H1 confirmations it sent
    public/scanner/arrivals.json stock-scan (daily): the stock arrivals, areas and confirmations
"""
from __future__ import annotations

import datetime as dt
import json
import os
import sys
from dataclasses import dataclass
from typing import Callable, Dict, Iterable, List, Optional, Sequence

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import arrival as A  # noqa: E402
import notify as SN  # noqa: E402
import zones as Z  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(HERE))
DAY_CAP = int(os.environ.get('RFX_ARRIVAL_DAY_CAP') or 8)
STATE_FILES = {'fx': os.path.join(ROOT, 'public', 'fx', 'arrivals.json'),
               'realign': os.path.join(ROOT, 'public', 'fx', 'realign.json'),
               'stocks': os.path.join(ROOT, 'public', 'scanner', 'arrivals.json')}
KEEP_DAYS = 120
TFW = dict(SN.TF_WORD, M15='15-min')
TFS = dict(SN.TF_SHORT, M15='15m')
ORDER = {'confirm': 0, 'arrival': 1, 'watch': 2}
TF_RANK = {'3M': 0, 'MN': 1, 'W1': 2, 'D1': 3, 'H4': 4, 'H1': 5, 'M15': 6}


# ---- items --------------------------------------------------------------------------------------------------------
def _r(v, nd):
    return None if v is None else round(float(v), nd)


def arrival_item(sym: str, r: A.ArrivalTf, price: float, nd: int, **extra) -> Dict:
    """The ⚡ item of a TF's current arrival (its plan: tp, ceiling, realignment area)."""
    a, pl = r.current, r.plan
    z, ar = a.zone, pl.realign
    kind = 'ceiling' if pl.capped else ('htf zone' if pl.extended else ('zone' if pl.target_px is not None else ''))
    return {'kind': 'arrival', 'sym': sym, 'tf': a.tf, 'dir': a.dir, 'lo': _r(z.lo, nd), 'hi': _r(z.hi, nd),
            'prox': _r(z.prox, nd), 'dist': _r(z.dist, nd), 'n_removed': len(a.removed),
            'target': _r(pl.tp, nd), 'target_kind': kind, 'target_tf': r.htf if kind in ('ceiling', 'htf zone') else a.tf,
            'ceiling': _r(pl.ceiling, nd), 'ceiling_tf': r.htf or '', 'htf_crossed': bool(r.htf) and pl.line_now is None,
            'area': ({'tf': a.tf, 'dir': ar.dir, 'lo': _r(ar.lo, nd), 'hi': _r(ar.hi, nd), 'id': ar.zid} if ar is not None else None),
            'price': _r(price, nd), 'digits': nd, 'id': f'{sym}|{a.id}', 'date': a.date, **extra}


def area_record(sym: str, r: A.ArrivalTf, nd: int, **extra) -> Dict:
    """The open realignment area of a TF's current arrival (state; also the realign job's input)."""
    a, ar = r.current, r.plan.realign
    return {'sym': sym, 'tf': a.tf, 'dir': ar.dir, 'lo': _r(ar.lo, nd), 'hi': _r(ar.hi, nd), 'prox': _r(ar.prox, nd),
            'dist': _r(ar.dist, nd), 'zone': ar.zid, 'arr_dir': a.dir, 'arr_prox': _r(a.zone.prox, nd),
            'arr_lo': _r(a.zone.lo, nd), 'arr_hi': _r(a.zone.hi, nd), 'swing': _r(r.swing, nd), 'ltf': r.ltf,
            'htf': r.htf or '', 'line': _r(r.plan.line_now, nd), 't_leg': a.t_leg, 'digits': nd, 'id': f'{sym}|{a.id}', **extra}


def watch_item(area: Dict, price: float) -> Dict:
    return {**{k: area.get(k) for k in ('sym', 'tf', 'dir', 'lo', 'hi', 'arr_dir', 'arr_prox', 'ltf', 'htf', 'line', 'digits', 'id')},
            'kind': 'watch', 'price': _r(price, area.get('digits', 5))}


def confirm_item(area: Dict, c: A.Arrival, price: float) -> Dict:
    """The ✅ item: entry = the LTF zone's proximal, stop = its distal (arrival.ts), target = the area TF's swing."""
    nd = area.get('digits', 5)
    z = c.zone
    tgt = area.get('swing')
    r = A.rr(z.prox, z.dist, tgt)
    return {'kind': 'confirm', 'sym': area['sym'], 'tf': area['tf'], 'ltf': c.tf, 'dir': c.dir, 'entry': _r(z.prox, nd),
            'stop': _r(z.dist, nd), 'target': tgt, 'rr': round(r, 1) if r else None,
            'lo': _r(z.lo, nd), 'hi': _r(z.hi, nd), 'n_removed': len(c.removed), 'area_lo': area['lo'], 'area_hi': area['hi'],
            'price': _r(price, nd), 'digits': nd, 'id': f"{area['id']}|{z.zid}", 'area_id': area['id'], 'date': c.date}


# ---- messages -----------------------------------------------------------------------------------------------------
def _f(v, nd: int) -> str:
    if v is None:
        return 'n/a'
    return f'{v:,.{nd}f}' if nd <= 2 else f'{v:.{nd}f}'


def _pct(a, b) -> str:
    if not a or b is None:
        return ''
    p = (b - a) / a * 100
    return f"{'+' if p >= 0 else '−'}{SN.short_pct(p)}"


def side(d: int) -> str: return 'demand' if d > 0 else 'supply'


def sides(d: int, n: int = 2) -> str:
    return side(d) if n == 1 else ('demands' if d > 0 else 'supplies')


def tfw(tf: str) -> str: return TFW.get(tf or '', tf or '')


def arrival_card(it: Dict) -> str:
    """🟢 EURUSD  4-hour arrival demand 1.08120–1.08300 · strong
    removed 2 supplies · target 1.09500 (+1.2%) · capped under the daily down line"""
    nd, d = it.get('digits', 5), it['dir']
    icon = '🟢' if d > 0 else '🔴'
    head = (f"{icon} <b>{SN.esc(it['sym'])}</b>  {SN.esc(tfw(it['tf']))} arrival {side(d)} "
            f"{_f(it['lo'], nd)}–{_f(it['hi'], nd)}" + (' · <b>strong</b>' if it.get('n_removed', 0) >= 2 else ''))
    n = it.get('n_removed', 0)
    bits = [f"removed {n} {sides(-d, n)}"]
    if it.get('target') is not None:
        bits.append(f"target {_f(it['target'], nd)} ({_pct(it.get('price'), it['target'])})")
    else:
        bits.append(f"no strong {side(-d)} {'above' if d > 0 else 'below'}")
    line2 = ' · '.join(bits)
    tk = it.get('target_kind')
    if tk == 'ceiling':
        cap = f"capped {'under' if d > 0 else 'above'} the {tfw(it.get('ceiling_tf'))} {'down' if d > 0 else 'up'} line"
    elif tk == 'htf zone':
        cap = (f"no {tfw(it.get('target_tf'))} {'down' if d > 0 else 'up'} line in the way: target = the "
               f"{tfw(it.get('target_tf'))} {side(-d)}")
    elif it.get('ceiling') is not None:
        cap = f"{tfw(it.get('ceiling_tf'))} line at {_f(it['ceiling'], nd)}"
    else:
        cap = ''
    out = head + '\n' + SN.esc(line2) + (f'\n{SN.esc(cap)}' if cap else '')
    ar = it.get('area')
    if ar:
        out += (f"\n<i>{SN.esc(tfw(it['tf']))} {sides(-d)} {'below' if d < 0 else 'above'} are weak; realignment area "
                f"{_f(ar['lo'], nd)}–{_f(ar['hi'], nd)}</i>")
    return out


def watch_card(it: Dict) -> str:
    nd, d = it.get('digits', 5), it['dir']
    head = f"👀 <b>{SN.esc(it['sym'])}</b> in the {SN.esc(tfw(it['tf']))} {side(d)} {_f(it['lo'], nd)}–{_f(it['hi'], nd)}"
    why = (f"realignment area: the {side(d)} nearest the {tfw(it.get('htf'))} {'up' if d > 0 else 'down'} line, after the "
           f"{tfw(it['tf'])} {side(-d)} arrival at {_f(it.get('arr_prox'), nd)}")
    nxt = (f"wait for a {tfw(it.get('ltf'))} arrival {side(d)} inside it before {'buying' if d > 0 else 'selling'}"
           if it.get('ltf') else f"no limit {'buys' if d > 0 else 'sells'}: wait for confirmation")
    return head + '\n' + SN.esc(why) + f'\n<i>{SN.esc(nxt)}</i>'


def confirm_card(it: Dict) -> str:
    nd, d = it.get('digits', 5), it['dir']
    kind = 'BUY' if d > 0 else 'SELL'
    c = SN.card('🟢' if d > 0 else '🔴', it['sym'], kind, _f(it['entry'], nd),
                _f(it['target'], nd) if it.get('target') is not None else '', it.get('rr'),
                f"stop {_f(it['stop'], nd)} · {tfw(it['ltf'])} {side(d)} in the {tfw(it['tf'])} realignment area")
    n = it.get('n_removed', 0)
    why = (f"{tfw(it['ltf'])} turned {'up' if d > 0 else 'down'} inside the area: its {'down' if d > 0 else 'up'} line "
           f"broken, {n} {sides(-d, n)} removed · target = the {tfw(it['tf'])} swing "
           f"{'high' if d > 0 else 'low'} ({_pct(it.get('entry'), it.get('target'))})")
    return c + f'\n<i>{SN.esc(why)}</i>'


CARD = {'arrival': arrival_card, 'watch': watch_card, 'confirm': confirm_card}
TITLE = {'arrival': '⚡ <b>New arrival zone</b>', 'watch': '🔁 <b>Realignment watch</b>', 'confirm': '✅ <b>Confirmation</b>'}
FOOT = {'fx': 'check levels on Pepperstone · not advice', 'stocks': 'not advice'}


def buttons(syms: Sequence[str]) -> List[List[Dict]]:
    """[📊 Chart SYM] [🔎 Zones SYM] per symbol (bot callbacks), at most 3 rows."""
    rows = []
    for s in list(dict.fromkeys(syms))[:3]:
        if SN._cb_ok(f'c:{s}') and SN._cb_ok(f'z:{s}'):
            rows.append([SN.cb(f'📊 Chart {s}', f'c:{s}'), SN.cb(f'🔎 Zones {s}', f'z:{s}')])
    return rows


def messages(items: Sequence[Dict], market: str = 'fx', now: Optional[dt.datetime] = None, cards: int = SN.MAX_CARDS) -> List[SN.Msg]:
    """One message per alert kind in the run (confirmations first): the title + Calgary time, up to `cards` cards,
    the rest in one collapsed quote; buttons for the carded symbols."""
    now = now or dt.datetime.now(dt.timezone.utc)
    when = SN.local_time(now.strftime('%Y-%m-%dT%H:%M:%S'), SN.CLOCK)
    out = []
    for kind in sorted({i['kind'] for i in items}, key=lambda k: ORDER[k]):
        its = sort_items([i for i in items if i['kind'] == kind])
        shown, rest = its[:cards], its[cards:]
        head = [TITLE[kind] + (f' · {SN.esc(when)}' if when else '')]
        detail = [f"{SN.esc(i['sym'])} {TFS.get(i['tf'], i['tf'])} {side(i['dir'])}" for i in rest]
        detail.append(FOOT.get(market, 'not advice'))
        out.append(SN.compose(head, [CARD[kind](i) for i in shown], detail, buttons([i['sym'] for i in shown])))
    return out


def sort_items(items: Iterable[Dict]) -> List[Dict]:
    return sorted(items, key=lambda i: (ORDER[i['kind']], not i.get('wl'), -(i.get('n_removed') or 0),
                                        TF_RANK.get(i.get('tf'), 9), i['sym']))


# ---- state ----------------------------------------------------------------------------------------------------------
def calgary_day(now: Optional[dt.datetime] = None) -> str:
    now = now or dt.datetime.now(dt.timezone.utc)
    try:
        from zoneinfo import ZoneInfo
        return now.astimezone(ZoneInfo(SN.LOCAL_TZ)).date().isoformat()
    except Exception:  # noqa: BLE001
        return (now - dt.timedelta(hours=6)).date().isoformat()


def load(path: str) -> Dict:
    try:
        with open(path) as f:
            js = json.load(f)
        return js if isinstance(js, dict) else {}
    except (OSError, ValueError):
        return {}


def save(path: str, st: Dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(st, f, indent=1, sort_keys=True)
    os.replace(tmp, path)


def sent_today(day: str, files: Optional[Dict[str, str]] = None, own: Optional[Dict] = None, own_key: str = '') -> int:
    """Messages sent today by every arrival job (the shared cap); `own` = this job's state in memory (its file is stale)."""
    n = 0
    for k, p in (files or STATE_FILES).items():
        st = own if (own is not None and k == own_key) else load(p)
        n += int(((st or {}).get('sent') or {}).get(day) or 0)
    return n


def prune(st: Dict, now: Optional[dt.datetime] = None) -> Dict:
    now = now or dt.datetime.now(dt.timezone.utc)
    cut = (now - dt.timedelta(days=KEEP_DAYS)).isoformat()
    day_cut = (now - dt.timedelta(days=14)).date().isoformat()
    for k in ('seen', 'confirmed', 'watched'):
        st[k] = {i: t for i, t in (st.get(k) or {}).items() if str(t) >= cut}
    st['sent'] = {d: n for d, n in (st.get('sent') or {}).items() if d >= day_cut}
    return st


def pick(cands: Sequence[Dict], st: Dict, used_today: int, cap: int = DAY_CAP, muted: Optional[set] = None,
         now: Optional[dt.datetime] = None, max_msgs: Optional[int] = None) -> List[Dict]:
    """The new items of a run that fit the day's cap. Every candidate is marked in the state (seen / watched /
    confirmed) whether sent or not, so a capped or muted alert never comes back late. One message per kind: kinds are
    taken in order (confirmations first) while messages are left today."""
    now = now or dt.datetime.now(dt.timezone.utc)
    iso = now.isoformat()
    key = {'arrival': 'seen', 'watch': 'watched', 'confirm': 'confirmed'}
    fresh = [c for c in cands if c['id'] not in (st.get(key[c['kind']]) or {})]
    for c in fresh:
        st.setdefault(key[c['kind']], {})[c['id']] = iso
    if st.get('bootstrap_pending'):
        return []
    left = max(0, cap - used_today)
    if max_msgs is not None:
        left = min(left, max_msgs)
    out: List[Dict] = []
    kinds = sorted({c['kind'] for c in fresh if c['sym'] not in (muted or set())}, key=lambda k: ORDER[k])
    for k in kinds[:left]:
        out += [c for c in fresh if c['kind'] == k and c['sym'] not in (muted or set())]
    return out


def mark_sent(st: Dict, n: int, now: Optional[dt.datetime] = None) -> None:
    if n:
        d = calgary_day(now)
        sent = st.setdefault('sent', {})
        sent[d] = int(sent.get(d) or 0) + n


def is_loud(items: Sequence[Dict]) -> bool:
    """Confirmations (the A+ trade) stay audible in quiet hours, like a new BUY / SELL."""
    return any(i['kind'] == 'confirm' for i in items)


def deliver(items: List[Dict], market: str, prefs: Optional[Dict], send: Callable[[List], bool], st: Dict,
            guest_filter: Optional[Callable[[Dict, Dict], bool]] = None, log=print, notify: bool = True,
            now: Optional[dt.datetime] = None) -> int:
    """Send the picked items to the owner (quiet hours honoured, confirmations loud), then to the guests (their
    mutes / markets / quiet hours via guests.py). Returns the owner messages counted against the cap (also when only
    printed: notify=False). Never raises."""
    if not items:
        return 0
    import prefs as P
    msgs = messages(items, market, now)
    quiet = P.in_quiet(prefs)
    loud = is_loud(items)
    msgs = [SN.silenced(m, quiet and not loud) for m in msgs]
    if not notify:
        for m in msgs:
            print(m + '\n' + '-' * 40)
        return 0
    ok = False
    try:
        ok = bool(send(msgs))
    except Exception as e:  # noqa: BLE001
        log(f'arrivals: send failed ({type(e).__name__})')
    if ok:
        mark_sent(st, len(msgs), now)
        try:
            import guests as G

            def build(g):
                mine = [i for i in items if (guest_filter(g, i) if guest_filter else True)]
                return G.hush(messages(mine, market, now), g, is_loud(mine)) if mine else []
            G.broadcast(build, prefs, log=log, what='arrival alerts')
        except Exception as e:  # noqa: BLE001
            log(f'arrivals: guests skipped ({type(e).__name__})')
    return len(msgs) if ok else 0


def fx_guest_filter(g: Dict, it: Dict) -> bool:
    import guests as G
    return it['sym'] not in G.muted(g)


def stock_guest_filter(g: Dict, it: Dict) -> bool:
    import guests as G
    import prefs as P
    return G.wants(g, 'stocks') and it['sym'] not in P.muted_set(g)


@dataclass
class View:
    """One timeframe as a scanner row holds it: its series (phantom = the live price) and its zones (zones.detect with
    the market's parameters: the scanners' rows use the same ones as arrival.ts)."""
    tf: str
    S: Z.Series
    zones: List[Z.Zone]


def views_of(rows: Dict[str, object], tfs: Sequence[str]) -> Dict[str, View]:
    """View per TF from scanner rows (zones.Row: .ok, .S, .zones)."""
    out = {}
    for tf in tfs:
        r = rows.get(tf)
        if r is not None and getattr(r, 'ok', False):
            out[tf] = View(tf, r.S, list(r.zones))
    return out


def view_of(S: Z.Series, p) -> View:
    return View(S.tf, S, Z.detect(S, p) if S.n > p['max_base'] + 4 else [])


def reading(views: Dict[str, View], tf: str, price: float, p) -> Optional[A.ArrivalTf]:
    v = views.get(tf)
    if v is None:
        return None
    h = views.get(A.HIGHER_TF.get(tf) or '')
    return A.arrival_tf(v.S, tf, price, p, h.S if h else None, None, zones=v.zones, htf_zones=h.zones if h else None)


def symbol_pass(sym: str, views: Dict[str, View], alert_tfs: Sequence[str], area_tfs: Sequence[str], nd: int,
                price: float, bar_lo: float, bar_hi: float, st_areas: Dict, now_iso: str, p, wl: bool = False,
                confirm_tfs: Sequence[str] = (), ltf_views=None, extra: Optional[Dict] = None) -> Dict[str, List[Dict]]:
    """One symbol's run: the new arrival candidates (alert_tfs: the TF's current arrival, when it became true on the
    newest closed bar), the open realignment areas of area_tfs (state records, updated: entered / inside), 'watch'
    candidates (price entered an area) and 'confirm' candidates for the areas whose lower TF is in confirm_tfs (its
    view: ltf_views(tf) when callable - built only when needed -, else ltf_views[tf], else views[tf])."""
    out: Dict[str, List[Dict]] = {'arrival': [], 'watch': [], 'confirm': [], 'areas': []}
    for tf in sorted(set(alert_tfs) | set(area_tfs), key=lambda t: list(A.HIGHER_TF).index(t) if t in A.HIGHER_TF else 9):
        r = reading(views, tf, price, p)
        if r is None or r.current is None:
            continue
        if tf in alert_tfs and r.current.known_bar <= A.new_bars(tf):
            out['arrival'].append(arrival_item(sym, r, price, nd, wl=wl))
        if tf not in area_tfs or r.plan.realign is None or not r.ltf:
            continue
        rec = area_record(sym, r, nd, wl=wl, **(extra or {}))
        old = st_areas.get(rec['id']) or {}
        rec['opened'] = old.get('opened') or now_iso
        rec['entered'] = old.get('entered')
        rec['confirmed'] = old.get('confirmed')
        if A.touches_area(rec['lo'], rec['hi'], bar_lo, bar_hi) and not rec['entered']:
            rec['entered'] = now_iso
            out['watch'].append(watch_item(rec, price))
        rec['inside'] = bool(rec['entered']) and A.touches_area(rec['lo'], rec['hi'], price, price, A.INSIDE_NEAR)
        out['areas'].append(rec)
        ltf = rec['ltf']
        if rec['entered'] and not rec['confirmed'] and ltf in confirm_tfs:
            lv = ltf_views(ltf) if callable(ltf_views) else ((ltf_views or {}).get(ltf) or views.get(ltf))
            if lv is not None:
                c = A.confirm_in(lv.S, ltf, p, rec['dir'], rec['lo'], rec['hi'], rec['t_leg'], lv.zones)
                if c is not None and c.known_bar <= A.new_bars(ltf):
                    out['confirm'].append(confirm_item(rec, c, price))
    return out


KIND_KEY = {'arrival': 'seen', 'watch': 'watched', 'confirm': 'confirmed'}


def finalize(st: Dict, cands: Dict[str, List[Dict]], market: str, prefs: Optional[Dict], send, own_key: str, path: str,
             notify: bool = True, write: bool = True, guest_filter=None, log=print, now: Optional[dt.datetime] = None,
             boot: bool = False) -> int:
    """Pick the run's new items within the shared day cap, send them (owner + guests), mark the areas confirmed, save
    the state. boot = the first run (no state yet): everything current is marked seen, nothing sent."""
    import prefs as P
    now = now or dt.datetime.now(dt.timezone.utc)
    if boot:
        st['bootstrap_pending'] = True
    flat = cands.get('confirm', []) + cands.get('arrival', []) + cands.get('watch', [])
    used = sent_today(calgary_day(now), own=st, own_key=own_key)
    picked = pick(flat, st, used, muted=P.muted_set(prefs), now=now)
    st.pop('bootstrap_pending', None)
    for c in cands.get('confirm', []):
        if c.get('area_id') in (st.get('areas') or {}):
            st['areas'][c['area_id']]['confirmed'] = now.isoformat()
    n = deliver(picked, market, prefs, send, st, guest_filter, log=log, notify=notify, now=now)
    if picked and notify and n == 0 and os.environ.get('TELEGRAM_BOT_TOKEN'):
        for c in picked:                                  # not delivered: offered again next run
            (st.get(KIND_KEY[c['kind']]) or {}).pop(c['id'], None)
            if c['kind'] == 'confirm' and c.get('area_id') in (st.get('areas') or {}):
                st['areas'][c['area_id']]['confirmed'] = None
    prune(st, now)
    st['updated'] = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    if write:
        save(path, st)
    log(f"arrivals ({own_key}): {len(cands.get('arrival', []))} new arrival(s), {len(cands.get('watch', []))} area "
        f"entry(ies), {len(cands.get('confirm', []))} confirmation(s); {len(st.get('areas') or {})} open area(s), "
        f"{sum(1 for a in (st.get('areas') or {}).values() if a.get('inside'))} inside; "
        + ('first run: state seeded, nothing sent' if boot else f'{len(picked)} picked, {n} message(s) sent, {used} earlier today'))
    return n
