"""Telegram alerts for the Raja arrival / realignment rules (arrival.py), shared by the FX and the stock scanner.

Three calm alerts, at most DAY_CAP (8) messages a day over every job together (Calgary day), batched per run, in
plain words (owner 2026-11-03: 'new buy area', 'back in an area to watch', 'Buy signal, confirmed'; no emoji):
    New arrival zone         an arrival forms on 3M / MN / W1 / D1 / H4 (FX also H1): the entry zone, the zones it
                             removed (1 or 2+ = strong), the target and the higher-TF line that caps it
    Realignment watch        price ENTERS a realignment area (once per arrival)
    Confirmation             a lower-TF arrival forms inside the area: the A+ trade (entry, stop, target, R:R)
Items are plain dicts (JSON: they live in the state files on the data branch):
    arrival  {kind, sym, tf, dir, lo, hi, prox, dist, n_removed, target, target_kind, target_tf, ceiling, ceiling_tf,
              htf_crossed, area: {tf, dir, lo, hi} | None, price, digits, id, date}
    watch    {kind, sym, tf, dir (the area's side), lo, hi, arr_dir, arr_prox, ltf, htf, price, digits, id}
    confirm  {kind, sym, tf, ltf, dir, entry, stop, target, rr, lo, hi, n_removed, area_lo, area_hi, price, digits, id}
Distances in % of price (never pips), times on the owner's clock (Calgary), the existing card style with the bot's
[Chart] [Areas] buttons. Mutes, quiet hours and the guests' markets through prefs / guests.
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
TFW = dict(SN.TF_WORD)
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
            'entry': _r(pl.entry, nd), 'stop': _r(pl.stop, nd), 'sl_basis': pl.basis, 'sl_tf': r.htf if pl.basis == 'htf' else a.tf,
            'rr': round(pl.rr, 1) if pl.rr else None,
            'price': _r(price, nd), 'digits': nd, 'id': f'{sym}|{a.id}', 'date': a.date, **extra}


def area_record(sym: str, r: A.ArrivalTf, nd: int, spread: float = 0.0, **extra) -> Dict:
    """The open realignment area of a TF's current arrival (state; also the realign job's input)."""
    a, ar = r.current, r.plan.realign
    return {'sym': sym, 'tf': a.tf, 'dir': ar.dir, 'lo': _r(ar.lo, nd), 'hi': _r(ar.hi, nd), 'prox': _r(ar.prox, nd),
            'dist': _r(ar.dist, nd), 'zone': ar.zid, 'arr_dir': a.dir, 'arr_prox': _r(a.zone.prox, nd),
            'arr_lo': _r(a.zone.lo, nd), 'arr_hi': _r(a.zone.hi, nd), 'swing': _r(r.swing, nd), 'ltf': r.ltf,
            'htf': r.htf or '', 'line': _r(r.plan.line_now, nd), 't_leg': a.t_leg, 'digits': nd, 'id': f'{sym}|{a.id}',
            'spread': spread, **extra}


def watch_item(area: Dict, price: float) -> Dict:
    return {**{k: area.get(k) for k in ('sym', 'tf', 'dir', 'lo', 'hi', 'arr_dir', 'arr_prox', 'ltf', 'htf', 'line', 'digits', 'id')},
            'kind': 'watch', 'price': _r(price, area.get('digits', 5))}


def confirm_item(area: Dict, c: A.Arrival, price: float, S: Optional[Z.Series] = None) -> Dict:
    """The ✅ item: entry = the LTF zone's proximal, stop = the stop rule (arrival.ts stopOf on the LTF series S; host =
    the area = the realignment zone: 2 buffers beyond its distal unless the LTF valley stop is further), target = the
    area TF's swing. S None (no LTF series): buffer = the area's spread only."""
    nd = area.get('digits', 5)
    z = c.zone
    tgt = area.get('swing')
    st = (A.stop_of(S, c.dir, c.valley, area.get('dist'), area.get('spread') or 0.0) if S is not None else
          A.stop_of(_NoAtr(), c.dir, c.valley, area.get('dist'), area.get('spread') or 0.0))
    r = A.rr(z.prox, st.stop, tgt)
    return {'kind': 'confirm', 'sym': area['sym'], 'tf': area['tf'], 'ltf': c.tf, 'dir': c.dir, 'entry': _r(z.prox, nd),
            'stop': _r(st.stop, nd), 'sl_basis': st.basis, 'target': tgt, 'rr': round(r, 1) if r else None,
            'lo': _r(z.lo, nd), 'hi': _r(z.hi, nd), 'n_removed': len(c.removed), 'area_lo': area['lo'], 'area_hi': area['hi'],
            'price': _r(price, nd), 'digits': nd, 'id': f"{area['id']}|{z.zid}", 'area_id': area['id'], 'date': c.date}


class _NoAtr:
    def atr(self, i: int) -> float: return 0.0


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
def _area(d: int, n: int = 1) -> str: return SN.area(side(d), n)
def _rng(lo, hi, nd) -> str: return SN.code(f'{_f(lo, nd)}–{_f(hi, nd)}')
def _cap(s: str) -> str: return s[:1].upper() + s[1:]
def _market(market: str) -> str: return 'stock' if market == 'stocks' else 'fx'


def arrival_card(it: Dict, market: str = 'fx') -> str:
    """<b>Euro vs US dollar</b> (EURUSD) · new 4-hour buy area, strong
    <blockquote>▲ Area <code>1.08120–1.08300</code>
    ● It broke through 2 sell areas on the way
    ● Buy at ... · Exit if wrong ... (below the 4-hour low) · Possible gain 2.1× the risk
    ● Take profit at <code>1.09500</code> (+1.2%)
    ● Room is capped below the daily downtrend line</blockquote>"""
    nd, d = it.get('digits', 5), it['dir']
    n = it.get('n_removed', 0)
    phrase = f"new {tfw(it['tf'])} {_area(d)}" + (', strong' if n >= 2 else '')
    lines = [f"{'▲' if d > 0 else '▼'} Area {_rng(it['lo'], it['hi'], nd)}",
             f"● It broke through {n} {_area(-d, n)} on the way {'up' if d > 0 else 'down'}"]
    if it.get('stop') is not None:
        where = (f"{'below' if d > 0 else 'above'} the {tfw(it.get('sl_tf'))} {_area(d)}" if it.get('sl_basis') == 'htf'
                 else f"{'below' if d > 0 else 'above'} the last {tfw(it.get('sl_tf') or it['tf'])} {'low' if d > 0 else 'high'}")
        plan = SN.plan_line(d > 0, _f(it.get('entry'), nd), _f(it['stop'], nd), '', it.get('rr'))
        plan = plan.replace(f"Exit if wrong {SN.code(_f(it['stop'], nd))}", f"Exit if wrong {SN.code(_f(it['stop'], nd))} ({SN.esc(where)})")
        lines.append(f'● {plan}')
    if it.get('target') is not None:
        pc = _pct(it.get('price'), it['target'])
        lines.append(f"● Take profit at {SN.code(_f(it['target'], nd))}" + (f' ({pc})' if pc else ''))
    else:
        lines.append(f"● No strong {_area(-d)} {'above' if d > 0 else 'below'}")
    tk = it.get('target_kind')
    line_word = f"{tfw(it.get('ceiling_tf'))} {'downtrend' if d > 0 else 'uptrend'} line"
    if tk == 'ceiling':
        lines.append(f"● Room is capped {'below' if d > 0 else 'above'} the {SN.esc(line_word)}")
    elif tk == 'htf zone':
        lines.append(f"● No {SN.esc(tfw(it.get('target_tf')))} {'downtrend' if d > 0 else 'uptrend'} line in the way, so take "
                     f"profit at the {SN.esc(tfw(it.get('target_tf')))} {_area(-d)}")
    elif it.get('ceiling') is not None:
        lines.append(f"● {SN.esc(_cap(line_word))} at {SN.code(_f(it['ceiling'], nd))}")
    ar = it.get('area')
    if ar:
        lines.append(f"● The {SN.esc(tfw(it['tf']))} {_area(-d, 2)} {'below' if d < 0 else 'above'} are weak · watch for a "
                     f"{'buy' if ar.get('dir', -d) > 0 else 'sell'} back at {_rng(ar['lo'], ar['hi'], nd)}")
    return f"{SN.title(it['sym'], it.get('name') or '', _market(market))} · {SN.esc(phrase)}\n{SN.block(lines)}"


def watch_card(it: Dict, market: str = 'fx') -> str:
    """<b>...</b> (SYM) · back in a 4-hour sell area / the area, why it matters, what comes next."""
    nd, d = it.get('digits', 5), it['dir']
    lines = [f"{'▲' if d > 0 else '▼'} Area {_rng(it['lo'], it['hi'], nd)}",
             f"● This is the {_area(d)} nearest the {SN.esc(tfw(it.get('htf')))} {'uptrend' if d > 0 else 'downtrend'} line, "
             f"after {SN.esc(SN.a(tfw(it['tf'])))} {_area(-d)} formed at {SN.code(_f(it.get('arr_prox'), nd))}",
             (f"● Next: wait for {SN.esc(SN.a(tfw(it.get('ltf'))))} {_area(d)} to form inside it before {'buying' if d > 0 else 'selling'}"
              if it.get('ltf') else f"● Next: no early {'buy' if d > 0 else 'sell'} orders, wait for it to confirm")]
    return (f"{SN.title(it['sym'], it.get('name') or '', _market(market))} · back in {SN.esc(SN.a(tfw(it['tf'])))} {_area(d)}\n"
            + SN.block(lines))


def confirm_card(it: Dict, market: str = 'fx') -> str:
    nd, d = it.get('digits', 5), it['dir']
    kind = 'BUY' if d > 0 else 'SELL'
    n = it.get('n_removed', 0)
    pc = _pct(it.get('entry'), it.get('target'))
    why = (f"Why: the {tfw(it['ltf'])} trend turned {'up' if d > 0 else 'down'} inside the {tfw(it['tf'])} area to watch "
           f"(its {'downtrend' if d > 0 else 'uptrend'} line broke and {n} {SN.area(side(-d), n)} gave way). Take profit "
           f"is the last {tfw(it['tf'])} swing {'high' if d > 0 else 'low'}" + (f' ({pc})' if pc else '') + '.')
    rng = f" {_rng(it['area_lo'], it['area_hi'], nd)}" if it.get('area_lo') is not None and it.get('area_hi') is not None else ''
    line2 = (f"● A new {SN.esc(tfw(it['ltf']))} {_area(d)} inside the {SN.esc(tfw(it['tf']))} area to watch{rng}"
             f"\n{SN.esc(why)}")
    return SN.card('▲' if d > 0 else '▼', it['sym'], kind, _f(it['entry'], nd),
                   _f(it['target'], nd) if it.get('target') is not None else '', it.get('rr'), line2,
                   stop=_f(it['stop'], nd), long=d > 0, name=it.get('name') or '', market=_market(market),
                   phrase=f"{'Buy' if d > 0 else 'Sell'} signal, confirmed")


CARD = {'arrival': arrival_card, 'watch': watch_card, 'confirm': confirm_card}
TITLE = {'arrival': '<b>New price areas</b>', 'watch': '<b>Back in an area to watch</b>', 'confirm': '<b>Confirmed signals</b>'}
SOURCE = {'fx': 'Pepperstone', 'stocks': ''}


def buttons(syms: Sequence[str]) -> List[List[Dict]]:
    """[Chart SYM] [Areas SYM] per symbol (bot callbacks), at most 3 rows."""
    rows = []
    for s in list(dict.fromkeys(syms))[:3]:
        if SN._cb_ok(f'c:{s}') and SN._cb_ok(f'z:{s}'):
            rows.append([SN.cb(f'Chart {s}', f'c:{s}'), SN.cb(f'Areas {s}', f'z:{s}')])
    return rows


def messages(items: Sequence[Dict], market: str = 'fx', now: Optional[dt.datetime] = None, cards: int = SN.MAX_CARDS) -> List[SN.Msg]:
    """One message per alert kind in the run (confirmations first): the title (a single item: its card is the
    headline), up to `cards` cards, the rest in one collapsed quote, the footer with the Calgary time; buttons for the
    carded symbols."""
    now = now or dt.datetime.now(dt.timezone.utc)
    when = SN.local_time(now.strftime('%Y-%m-%dT%H:%M:%S'), SN.CLOCK)
    out = []
    for kind in sorted({i['kind'] for i in items}, key=lambda k: ORDER[k]):
        its = sort_items([i for i in items if i['kind'] == kind])
        shown, rest = its[:cards], its[cards:]
        head = [TITLE[kind]] if len(its) > 1 else []
        detail = [f"{SN.esc(i['sym'])} · {SN.esc(tfw(i['tf']))} {_area(i['dir'])}" for i in rest]
        out.append(SN.compose(head, [CARD[kind](i, market) for i in shown], detail, buttons([i['sym'] for i in shown]),
                              foot=SN.footer(SOURCE.get(market, ''), when)))
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
    # 2026-11-02 (owner pick 'FX 1'): the confirmation (a lower-TF arrival inside a higher-TF area) is THE trade alert:
    # it is never held back by the day's cap; the cap governs the other kinds
    take = [k for k in kinds if k == 'confirm'] + [k for k in kinds if k != 'confirm'][:max(0, left - (1 if 'confirm' in kinds else 0))]
    for k in take:
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


def reading(views: Dict[str, View], tf: str, price: float, p, spread: float = 0.0) -> Optional[A.ArrivalTf]:
    v = views.get(tf)
    if v is None:
        return None
    h = views.get(A.HIGHER_TF.get(tf) or '')
    return A.arrival_tf(v.S, tf, price, p, h.S if h else None, None, zones=v.zones, htf_zones=h.zones if h else None,
                        spread=spread)


def symbol_pass(sym: str, views: Dict[str, View], alert_tfs: Sequence[str], area_tfs: Sequence[str], nd: int,
                price: float, bar_lo: float, bar_hi: float, st_areas: Dict, now_iso: str, p, wl: bool = False,
                confirm_tfs: Sequence[str] = (), ltf_views=None, extra: Optional[Dict] = None,
                spread: float = 0.0) -> Dict[str, List[Dict]]:
    """One symbol's run: the new arrival candidates (alert_tfs: the TF's current arrival, when it became true on the
    newest closed bar), the open realignment areas of area_tfs (state records, updated: entered / inside), 'watch'
    candidates (price entered an area) and 'confirm' candidates for the areas whose lower TF is in confirm_tfs (its
    view: ltf_views(tf) when callable - built only when needed -, else ltf_views[tf], else views[tf])."""
    out: Dict[str, List[Dict]] = {'arrival': [], 'watch': [], 'confirm': [], 'areas': []}
    for tf in sorted(set(alert_tfs) | set(area_tfs), key=lambda t: list(A.HIGHER_TF).index(t) if t in A.HIGHER_TF else 9):
        r = reading(views, tf, price, p, spread)
        if r is None or r.current is None:
            continue
        if tf in alert_tfs and r.current.known_bar <= A.new_bars(tf):
            out['arrival'].append(arrival_item(sym, r, price, nd, wl=wl))
        if tf not in area_tfs or r.plan.realign is None or not r.ltf:
            continue
        rec = area_record(sym, r, nd, spread, wl=wl, **(extra or {}))
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
                    out['confirm'].append(confirm_item(rec, c, price, lv.S))
    return out


KIND_KEY = {'arrival': 'seen', 'watch': 'watched', 'confirm': 'confirmed'}
LEARN_KEYS = ('kind', 'sym', 'tf', 'ltf', 'dir', 'entry', 'stop', 'target', 'target_kind', 'rr', 'lo', 'hi', 'prox', 'dist',
              'n_removed', 'digits', 'id', 'area_id', 'date', 'price', 'wl')


def learn_items(cands: Dict[str, List[Dict]], now: dt.datetime) -> Dict:
    """This run's ideas with a plan (confirmations + arrivals with entry / stop), whether sent or not: the input of the
    live outcome tracker (tools/learn/outcomes.py), which runs after the scan and dedupes them in its ledger."""
    items = [{k: c[k] for k in LEARN_KEYS if c.get(k) is not None}
             for c in cands.get('confirm', []) + cands.get('arrival', []) if c.get('entry') is not None and c.get('stop') is not None]
    return {'at': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'items': items}


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
    # owner 2026-11-02: every FX arrival on every timeframe, both sides - no daily cap on forex (the cap was ours,
    # not Telegram's); stocks too (their W1 / MN / 3M arrivals are few, and the shared count would let forex use theirs up)
    picked = pick(flat, st, used, cap=10**6, muted=P.muted_set(prefs), now=now)
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
    st['last_items'] = learn_items(cands, now)
    prune(st, now)
    st['updated'] = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    if write:
        save(path, st)
    log(f"arrivals ({own_key}): {len(cands.get('arrival', []))} new arrival(s), {len(cands.get('watch', []))} area "
        f"entry(ies), {len(cands.get('confirm', []))} confirmation(s); {len(st.get('areas') or {})} open area(s), "
        f"{sum(1 for a in (st.get('areas') or {}).values() if a.get('inside'))} inside; "
        + ('first run: state seeded, nothing sent' if boot else f'{len(picked)} picked, {n} message(s) sent, {used} earlier today'))
    return n
