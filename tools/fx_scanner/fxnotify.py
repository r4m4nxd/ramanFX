"""FX Telegram, calm and glanceable, in plain words for a reader with no trading knowledge (same layout, words and
markers as the stock scanner, see stock_scanner/notify.py):

    instant alert   ONE short message when something NEW happens (deduped with the state in the cache); the only
                    message of an hourly (H1) scan inside an H4 bar, nothing when nothing is new:
                    every instrument: a NEW buy / sell signal, a signal that disappeared (cancel the order);
                    watchlist only: a NEW watch, price newly entering / approaching a located strong area.
                    One item: its card is the message ('<b>Euro vs US dollar</b> (EURUSD) · Buy signal').
    H4 digest       ONE message per new H4 candle (FX_H4_DIGEST, default on; not hourly), <= 4 visible lines when quiet:
                        <b>4-hour check</b>
                        No new trades · nothing close yet
                        ▸ collapsed detail
                        <i>Pepperstone prices · 11:00 PM MT · For learning only, not financial advice</i>
    daily summary   ONE message after the NY close: open setups (max 3 cards), the rest collapsed.

Each message: the answer first, at most 3 trade cards (plain name + one phrase, then a quote with the plan), everything
else in ONE collapsed expandable quote, the italic footer, and an inline keyboard (a TradingView PEPPERSTONE chart per
card, then "Open app"; no emoji). Times on the owner's clock (Calgary, 12-hour). Symbols are Pepperstone names; levels
come from the OANDA feed (check them on the Pepperstone chart).
"""
from __future__ import annotations

import datetime as dt
import os
import sys
from typing import Dict, List, Optional, Sequence

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
import notify as SN  # noqa: E402  (stock scanner Telegram: escape, UTF-16 length, layout, send with 429 retry)

esc, u16, send, pack_cards, Msg = SN.esc, SN.u16, SN.send, SN.pack_cards, SN.Msg
ICON = SN.ICON
SOURCE = 'Pepperstone'
FOOTER = SN.FOOTER
TV = 'https://www.tradingview.com/chart/?symbol='


def foot(when: Optional[str] = None) -> str:
    """'<i>Pepperstone prices · 3:00 PM MT · For learning only, not financial advice</i>' (when=None: now)."""
    return SN.footer(SOURCE, when, C.LOCAL_TZ)


def _px(v, s: Dict) -> str:
    return 'n/a' if v is None else f"{v:.{s.get('digits', 5)}f}"


def chart(s: Dict) -> Dict:
    return SN.button(f"Live {s['sym']}", TV + (s.get('tv') or f"PEPPERSTONE:{s['sym']}"))


def _long(s: Dict) -> bool:
    return s.get('kind') == 'BUY' or (s.get('kind') != 'SELL' and s.get('side') != 'supply')


def _extras(s: Dict) -> List[str]:
    """The plan / news / data-source lines every FX card can carry (escaped HTML)."""
    nw = SN.news_warning(s['sym'])
    fd = feed_line(s)
    return [SN.kevin_line(s), esc(nw) if nw else '', f'● {esc(fd)}' if fd else '']


def signal_card(s: Dict) -> str:
    """<b>Euro vs US dollar</b> (EURUSD) · Buy signal
    <blockquote>▲ Buy at <code>1.20806</code> · Exit if wrong <code>1.20620</code> · Take profit at <code>1.24794</code> · Possible gain 21× the risk
    Why: a 4-hour buy area inside a monthly buy area, the trend is up, first visit to this area, quality score 8/10.</blockquote>
    (a watch says what it still waits for: the price to come closer, or to confirm first)."""
    kind = s['kind']
    lg = _long(s)
    lines = []
    if kind == 'WATCH':
        lines.append('● Not yet: ' + ('the price is still far' if s.get('watch_kind') == 'new' else 'wait for the price to confirm first'))
    ex = _extras(s)
    why = SN.reason_line(s, score=True)
    lines += [ex[0], esc(why) if why else '', ex[1], ex[2]]
    phrase = SN.KIND_WORD.get(kind) if kind in ('BUY', 'SELL') else f"watching for a {'buy' if lg else 'sell'}"
    return SN.card(ICON.get(kind, '●'), s['sym'], kind, _px(s.get('entry'), s),
                   _px(s.get('target'), s) if s.get('target') else '', s.get('rr'), '\n'.join(x for x in lines if x),
                   stop=_px(s.get('stop'), s) if s.get('stop') is not None else '', long=lg, name=s.get('name') or '',
                   phrase=phrase)


def feed_line(s: Dict) -> str:
    """'Prices from an unofficial source (Yahoo ^VIX)' / 'Prices built from other markets (OANDA EUR_USD x USD_MXN)'
    for the instruments OANDA does not serve; '' for OANDA and crypto exchange feeds (official public APIs)."""
    feed = s.get('feed') or ''
    if s.get('unofficial'):
        return 'Prices from an unofficial source (' + feed.replace(' (unofficial feed)', '') + ')'
    if s.get('src') == 'synthetic':
        return ('Prices approximated from a basket' if s.get('approx') else 'Prices built from other markets') + ' (' + feed.replace('synthetic: ', '') + ')'
    return ''


def gone_reason(reason: str, long: bool = True) -> str:
    r = reason or ''
    if r.startswith('rule failing now:'):
        return 'it no longer qualifies: ' + SN.plain(r.split(':', 1)[1].strip())
    if 'reached the entry' in r:
        return f"the price reached the {'buy' if long else 'sell'} price: manage it in your trading app"
    if 'beyond the stop' in r:
        return 'the price went past the exit-if-wrong level'
    if 'zone removed' in r:
        return 'the price closed through the area, so it no longer holds'
    return SN.plain(r.split(':')[0])


def gone_card(g: Dict) -> str:
    """<b>Euro vs US dollar</b> (EURUSD) · cancel the buy order / ● the planned price / ● why."""
    lg = _long(g)
    word = 'buy' if lg else 'sell'
    phrase = f'cancel the {word} order' if g.get('kind') in ('BUY', 'SELL') else 'no longer watching'
    r = gone_reason(g.get('reason') or '', lg)
    lines = [f"● Planned {word} at {SN.code(_px(g.get('entry'), g))} is off", f'● Why: {esc(r)}']
    return f"{SN.title(g['sym'], g.get('name') or '')} · {phrase}\n{SN.block(lines)}"


def pct(z: Dict) -> float:
    """Distance from price to the zone's entry edge in percent of price (no pips: they mean something different on
    every market)."""
    px, prox = z.get('px'), z.get('prox')
    if not px or prox is None or (z.get('sec') or z.get('section')) == 'in':
        return 0.0
    return abs(px - prox) / px * 100


def zone_line(z: Dict) -> str:
    """<b>Polish zloty ...</b> (EURPLN) · getting close to a monthly buy area / ● 1.9% away, close  —
    <b>US dollar vs Norwegian krone</b> (USDNOK) · now in a monthly buy area / ▲ Area starts at <code>9.26070</code>."""
    sec = z.get('sec') or z.get('section')
    where = f"{SN.tf_word(z.get('tf'))} {SN.area(z.get('side'))}".strip()
    mk = '▲' if z.get('side') == 'demand' else '▼' if z.get('side') == 'supply' else '●'
    if sec == 'near':
        head, first = f'getting close to {SN.a(where)}', f'● Distance: {esc(SN.away(pct(z)))}'
    else:
        head, first = f'now in {SN.a(where)}', f"{mk} Area starts at {SN.code(_px(z.get('prox'), z))}"
    ex = _extras(z)
    why = zone_why(z)
    lines = [first, ex[0], esc(why) if why else '', ex[1], ex[2]]
    return f"{SN.title(z['sym'], z.get('name') or '')} · {esc(head)}\n{SN.block(lines)}"


def zone_why(z: Dict) -> str:
    """'Why: it sits inside a bigger area, not a trade yet (trend against it), first visit to this area.' (what the
    scanner already decided)."""
    bits = []
    if z.get('loc_ok'):
        bits.append('an area on the biggest timeframe checked' if z.get('loc') == 'top' else 'it sits inside a bigger area')
    st = z.get('status') or ''
    if st in ('BUY', 'SELL'):
        bits.append(f"a {'buy' if st == 'BUY' else 'sell'} signal is set up")
    elif st:
        bits.append('not a trade yet (' + SN.plain(z.get('label') or st) + ')')
    t = z.get('touches')
    if t is not None:
        bits.append('first visit to this area' if t == 0 else 'the price came back here once before' if t == 1
                    else f'the price came back here {t} times before')
    if not bits:
        return ''
    return 'Why: ' + ', '.join(bits) + '.'


def also(items: Sequence[Dict], n: int = 5) -> str:
    """'Also: EURUSD (watching, daily), GBPUSD (buy signal, weekly)' (the setups that did not get a card)."""
    return SN.also_line(items, 'sym', n)


def charts_of(items: Sequence[Dict]) -> List[Dict]:
    seen, out = set(), []
    for s in items:
        if s['sym'] not in seen:
            seen.add(s['sym'])
            out.append(chart(s))
    return out


def _closes(lbl: str, hours: int):
    try:
        return C.h4_close_utc(lbl, hours)
    except (TypeError, ValueError):
        return None


def _when(h4: str, fmt: str = SN.CLOCK, hours: int = 4) -> str:
    """Local close time of the H4 bar (hours=1: the H1 bar) with label h4."""
    try:
        return SN.local_time(C.h4_close_utc(h4, hours).strftime('%Y-%m-%dT%H:%M:%S'), fmt, C.LOCAL_TZ)
    except (TypeError, ValueError):
        return ''


def _local(close_utc: str, fmt: str = SN.CLOCK) -> str:
    """'2026-10-26T21:00:00Z' -> '3:00 PM' (the owner's clock, C.LOCAL_TZ)."""
    return SN.local_time(close_utc or '', fmt, C.LOCAL_TZ)


def kevin_first(items: Sequence[Dict]) -> List[Dict]:
    """Cards that are also in Kevin's plan first (stable: the scanner's order otherwise)."""
    return sorted(items, key=lambda x: not x.get('kevin'))


def alert_messages(ev: Dict, muted: Optional[set] = None) -> List[Msg]:
    """ONE short message for the new events of a run ([] when nothing is new). muted = symbols muted in the bot: no
    card for them (they stay in the lists and the app). Plan cards first. A single event: its card is the message
    (no summary headline above it)."""
    mu = muted or set()
    keep = lambda xs: kevin_first([x for x in xs or [] if x.get('sym') not in mu])  # noqa: E731
    sig, gone, watch, zones = keep(ev.get('signals')), keep(ev.get('gone')), keep(ev.get('watch')), keep(ev.get('zones'))
    if not (sig or gone or watch or zones):
        return []
    items = [('s', s) for s in sig] + [('g', g) for g in gone] + [('s', s) for s in watch]
    nb = sum(s['kind'] == 'BUY' for s in sig)
    ns = sum(s['kind'] == 'SELL' for s in sig)
    words = [SN._n(nb, 'buy signal', 'buy signals') if nb else '', SN._n(ns, 'sell signal', 'sell signals') if ns else '',
             f'{len(watch)} watching' if watch else '', f'{len(gone)} to cancel' if gone else '']
    words = [w for w in words if w]
    n_in = sum((z.get('sec') or z.get('section')) == 'in' for z in zones)
    zwords = ' · '.join(w for w in (f'{n_in} in a price area' if n_in else '', f'{len(zones) - n_in} getting close' if len(zones) > n_in else '') if w)
    title = ('New: ' + ' · '.join(words)) if words else zwords
    h1, h4 = ev.get('h1') or '', ev.get('h4') or ''
    hourly = bool(h1) and _closes(h1, 1) != _closes(h4, 4)       # an hourly scan: an H1 close inside an H4 bar
    when = _when(h1, hours=1) if hourly else _when(h4)
    head = [f"<b>{esc(title)}</b>", f"Forex · {'hourly' if hourly else '4-hour'} check"]
    shown = items[:SN.MAX_CARDS]
    cards = [signal_card(x) if k == 's' else gone_card(x) for k, x in shown]
    zl = [zone_line(z) for z in zones]
    room = SN.MAX_CARDS - len(cards)
    visible_z, rest_z = (zl[:room], zl[room:]) if not cards else ([], zl)
    if visible_z:
        cards += visible_z
    if len(items) + len(zones) == 1:                             # one event: its card is the headline, the check
        t, _, rest = cards[0].partition('\n')                   # below it
        cards, head = [f'{t}\n{head[1]}\n{rest}'], []
    detail = [also([x if k == 's' else {**x, 'kind': 'EXIT'} for k, x in items[len(shown):]])]
    detail += [SN.flat(z) for z in rest_z]
    charts = charts_of([x for k, x in shown if k == 's'] or zones[:room])
    return [SN.compose(head, cards, detail, SN.alert_keyboard(charts, 'Open app', C.APP_URL), foot=foot(when))]


def urgent(ev: Dict, muted: Optional[set] = None) -> bool:
    """A new BUY / SELL (not muted) in the events: stays audible in quiet hours."""
    return any(s.get('kind') in ('BUY', 'SELL') and s.get('sym') not in (muted or set()) for s in ev.get('signals') or [])


def fired_messages(fired: Sequence[Dict], hourly: bool = True) -> List[Msg]:
    """One calm message per fired user alert (prefs.evaluate)."""
    return [SN.fired_alert_message(f, 'fx', 'at the last hourly close' if hourly else 'at the last 4-hour close') for f in fired]


SECTION_WORD = dict(SN.SECTION_WORD)


def _lists_detail(pub: Dict) -> List[str]:
    """Per side: 'Close to a buy area (5)' / 'CORN daily 0.1% · GBPCAD daily 0.1% +3', then 'Inside a buy area' etc.
    (watchlist first, then the closest); bounced / turned-down and 'why no trades' stay in the app; scan size."""
    zl = pub.get('lists') or {}
    out: List[str] = []
    for side, sec in SN.SECTION_ORDER:
        if sec == 'left':
            continue
        rows = sorted((zl.get(side) or {}).get(sec) or [], key=lambda r: (not r.get('wl'), pct(r), -(r.get('score') or 0)))
        extra = (lambda r: SN.short_pct(pct(r))) if sec == 'near' else None
        out += SN.section(SECTION_WORD[(side, sec)], rows, 'sym', 3, extra)
    c = pub.get('counts') or {}
    if c.get('instruments'):
        out.append(f"{c['instruments']} markets checked")
    return out


def _close_block(pub: Dict) -> str:
    """The visible 'worth watching' block: up to 3 watchlist markets nearing a located strong area, one per line."""
    close = _close_rows(pub)[:3]
    if not close:
        return ''
    rows = []
    for r in close:
        mk = '▲' if r.get('side') == 'demand' else '▼'
        rows.append(f"{mk} {SN.title(r['sym'], r.get('name') or '')} · {esc(SN.tf_word(r.get('tf')))} {esc(SN.area(r['side']))}"
                    f" · {esc(SN.away(pct(r)))}")
    return '<b>Getting close</b>\n' + SN.block(rows)


def _close_rows(pub: Dict) -> List[Dict]:
    """Watchlist instruments approaching a located strong zone (nearest first, one per symbol)."""
    zl = pub.get('lists') or {}
    rows = sorted(({**r, 'side': side} for side in ('demand', 'supply') for r in ((zl.get(side) or {}).get('near') or [])
                   if r.get('wl') and r.get('loc_ok')), key=pct)
    seen, out = set(), []
    for r in rows:
        if r['sym'] not in seen:
            seen.add(r['sym'])
            out.append(r)
    return out


def _close_count(pub: Dict) -> str:
    """'2 worth watching' (watchlist, located areas, approaching) or 'nothing close yet'."""
    near = {r['sym']: r for r in _close_rows(pub)}
    if not near:
        return 'nothing close yet'
    return f"{len(near)} worth watching"


def _open_setups(pub: Dict) -> List[Dict]:
    sig = sorted(pub.get('signals') or [], key=lambda s: (not s.get('kevin'), not s.get('wl'), -(s.get('score') or 0)))
    wat = sorted([s for s in pub.get('watch') or [] if s.get('wl')], key=lambda s: (not s.get('kevin'), -(s.get('score') or 0)))
    return sig + wat


def _overview(pub: Dict, head0: str, new: Sequence[Dict], show_close: bool = True, when: Optional[str] = None) -> Msg:
    c = pub.get('counts') or {}
    setups = _open_setups(pub)
    keys = {(s['sym'], s['kind'], s.get('tf')) for s in new or []}
    first = [s for s in setups if (s['sym'], s['kind'], s.get('tf')) in keys]
    order = first + [s for s in setups if s not in first]
    if not setups:
        sub = ('No new trades · ' if new is not None else 'No trades today · ') + _close_count(pub)
    else:
        sub = SN.headline(c.get('BUY', 0), c.get('WATCH', 0), 0, c.get('SELL', 0)).replace(' · nothing to sell', '')
        if new is not None:
            sub += f" · {len(first)} new" if first else ' · nothing new'
    shown = order[:SN.MAX_CARDS]
    detail = [also(order[len(shown):])] + ([] if show_close else [SN.flat(_close_block(pub))]) + _lists_detail(pub)
    if pub.get('fixture'):
        sub += ' · sample data'
    cards = [signal_card(s) for s in shown]
    if show_close and len(cards) < SN.MAX_CARDS and _close_block(pub):
        cards.append(_close_block(pub))
    return SN.compose([head0, esc(sub) if '<' not in sub else sub], cards, detail,
                      SN.keyboard(charts_of(shown), 'Open app', C.APP_URL), foot=foot(when))


def digest_message(pub: Dict, ev: Dict, top: int = SN.MAX_CARDS) -> Msg:
    """The H4 check after every new H4 candle: one message, <= 4 visible lines when nothing new happened."""
    when = _local(pub.get('h4_close_utc') or '') or esc(pub.get('h4') or '')
    new = list((ev or {}).get('signals') or []) + list((ev or {}).get('watch') or [])
    return _overview(pub, '<b>Forex · 4-hour check</b>', new, show_close=False, when=when)


def summary_messages(pub: Dict) -> List[Msg]:
    """The daily summary after the NY close (one message)."""
    try:
        day = dt.datetime.strptime((pub.get('h4') or '')[:10], '%Y-%m-%d').strftime('%a %d %b')
    except ValueError:
        day = ''
    m = _overview(pub, f"<b>Forex · {esc(day)}</b>" if day else "<b>Forex · daily summary</b>", None)
    return [m]


def preview_events(pub: Dict) -> Dict:
    """The alert a run of this published scan would send if everything in it were new (for --preview-telegram)."""
    zl = pub.get('lists') or {}
    zones = [r for side in ('demand', 'supply') for sec in ('in', 'near') for r in ((zl.get(side) or {}).get(sec) or [])
             if r.get('wl') and r.get('loc_ok')]
    return {'signals': list(pub.get('signals') or []), 'watch': [s for s in pub.get('watch') or [] if s.get('wl')],
            'gone': list(pub.get('invalidated') or []), 'zones': zones, 'h4': pub.get('h4') or ''}


def preview_messages(pub: Dict) -> Dict[str, List[Msg]]:
    """{'alert', 'digest (as if new)', 'digest (nothing new)', 'daily summary'} of a published latest.json."""
    ev = preview_events(pub)
    return {'instant alert': alert_messages(ev), 'H4 digest (everything new)': [digest_message(pub, ev)],
            'H4 digest (nothing new)': [digest_message(pub, {})], 'daily summary': summary_messages(pub)}


def failure_message(reason: str) -> str:
    return (f'<b>Forex scanner</b> · could not run\n'
            + SN.block([f'● Reason: {esc(reason)}', '● Nothing new was sent; the app still shows the last results'])
            + '\n' + foot())


# ---- on-demand scan of one symbol (the bot's /scan SYM and its live-scan button) --------------------------------------
STATE_WORD = {'UP': 'up', 'DOWN': 'down'}


def _zpct(price: float, prox: float, dist: float) -> str:
    lo, hi = min(prox, dist), max(prox, dist)
    if lo <= price <= hi:
        return 'the price is in it'
    return SN.away(abs(price - prox) / price * 100)


def _zone_row(side: str, tf: str, lo: str, hi: str, rest: str) -> str:
    w = f'{SN.tf_word(tf)} {SN.area(side)}'
    return (f"{'▲' if side == 'demand' else '▼'} {esc(w[:1].upper() + w[1:])} {SN.code(f'{lo}–{hi}')}"
            + (f' · {esc(rest)}' if rest else ''))


def ondemand_card(det: Dict, sigs: Sequence[Dict], h1: str = '', h4: str = '') -> Msg:
    """ONE card for an on-demand scan of one instrument (every scanner rule, on the newest closed candle): its open
    buy / sell / watch cards (max 3), the strong areas the scanner located for it and their verdict, the nearest other
    areas, the trend per timeframe. Buttons: TradingView, [Chart] [Areas] (bot callbacks)."""
    sym, nd = det['sym'], det.get('digits', 5)
    f = lambda v: 'n/a' if v is None else f'{v:.{nd}f}'  # noqa: E731
    when = _when(h1, hours=1) if h1 else _when(h4)
    head = [f"{SN.title(sym, det.get('name') or '')} · on-demand check",
            f"Price {SN.code(f(det.get('price')))} · at the last {'hourly' if h1 else '4-hour'} close · every scanner rule checked"]
    cards = [signal_card(s) for s in list(sigs)[:SN.MAX_CARDS]]
    if not cards:
        cards = ['No buy signal, sell signal or watch on it right now.']
    px = det.get('price') or 0
    hits = det.get('hits') or []
    lines: List[str] = []
    if hits:
        lines.append('<b>Price areas the scanner found</b>')
        for h in hits[:5]:
            why = zone_why(h).replace('Why: ', '')
            lines.append(_zone_row(h['side'], h['tf'], f(h.get('prox')), f(h.get('dist')), _zpct(px, h['prox'], h['dist']) if px else ''))
            if why:
                lines.append(f'Why: {esc(why)}')
    seen = {(h['tf'], h['side'], h.get('prox')) for h in hits}
    other = [z for z in det.get('zones') or [] if (z['tf'], z['side'], z['proximal']) not in seen][:4]
    if other:
        lines.append('<b>Nearest other areas</b>')
        for z in other:
            t = z.get('touches') or 0
            rest = ' · '.join(b for b in [_zpct(px, z['proximal'], z['distal']) if px else '',
                                          'never tested' if not t else f'tested {t}x'] if b)
            lines.append(_zone_row(z['side'], z['tf'], f(z['proximal']), f(z['distal']), rest))
    st = det.get('states') or {}
    trend = SN.trend_text([(t, st[t]) for t in ('MN', 'W1', 'D1', 'H4', 'H1') if st.get(t)])
    if trend:
        lines.append(trend)
    lines.append('On-demand check')
    rows = [[SN.button('Live chart', TV + (det.get('tv') or f'PEPPERSTONE:{sym}'))]]
    if SN._cb_ok(f'c:{sym}'):
        rows.append([SN.cb('Chart', f'c:{sym}'), SN.cb('Areas', f'z:{sym}')])
    text = '\n'.join(head) + '\n\n' + '\n\n'.join(cards) + '\n\n' + SN.block(lines) + '\n' + foot(when)
    if u16(text) > SN.SAFE:
        text = SN._cut(text, SN.SAFE)
    return Msg(text, rows)


def ondemand_missing(sym: str, why: str) -> Msg:
    return Msg(f'{SN.title(sym)} · on-demand check\n' + SN.block([f'● No result: {esc(SN.words(why))}']) + '\n' + foot())
