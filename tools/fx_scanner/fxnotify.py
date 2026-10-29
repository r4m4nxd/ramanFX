"""FX Telegram, calm and glanceable (same layout and legend as the stock scanner, see stock_scanner/notify.py):

    instant alert   ONE short message when something NEW happens (deduped with the state in the cache); the only
                    message of an hourly (H1) scan inside an H4 bar, nothing when nothing is new:
                    every instrument: a NEW BUY / SELL, a signal that disappeared (🚪 cancel the order);
                    watchlist only: a NEW WATCH, price newly entering / approaching a located strong zone
    H4 digest       ONE message per new H4 candle (FX_H4_DIGEST, default on; not hourly), <= 4 visible lines when quiet:
                        🕐 4H check · 11:00 PM
                        No new setups. 2 near a good zone ⏳
                        ▸ collapsed detail
    daily summary   ONE message after the NY close: open setups (max 3 cards), the rest collapsed.

Each message: the answer first, at most 3 two-line trade cards, everything else in ONE collapsed expandable quote,
and an inline keyboard (a TradingView PEPPERSTONE chart per card, then "Open scanner"). Times on the owner's clock (Calgary, 12-hour).
Symbols are Pepperstone names; levels come from the OANDA feed (check them on the Pepperstone chart).
"""
from __future__ import annotations

import datetime as dt
import os
import sys
from typing import Dict, List, Sequence

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
import notify as SN  # noqa: E402  (stock scanner Telegram: escape, UTF-16 length, layout, send with 429 retry)

esc, u16, send, pack_cards, Msg = SN.esc, SN.u16, SN.send, SN.pack_cards, SN.Msg
ICON = SN.ICON
FOOTER = 'check levels on Pepperstone · not advice'
TV = 'https://www.tradingview.com/chart/?symbol='


def _px(v, s: Dict) -> str:
    return 'n/a' if v is None else f"{v:.{s.get('digits', 5)}f}"


def chart(s: Dict) -> Dict:
    return SN.button(f"📈 {s['sym']}", TV + (s.get('tv') or f"PEPPERSTONE:{s['sym']}"))


def signal_card(s: Dict) -> str:
    """🟢 EURUSD  BUY 1.20806 → 1.24794 / stop 1.20620 · R:R 21 · 4-hour demand. Five-digit prices do not leave room
    for the R:R on line 1 of a phone screen, so it moves to line 2 (a WATCH says 'confirm first' instead of the zone
    when the zone was tested)."""
    kind = s['kind']
    rr = s.get('rr')
    bits = [f"stop {_px(s.get('stop'), s)}", (f"R:R {rr:.0f}" if rr >= 10 else f"R:R {rr:.1f}") if rr else '',
            f"{SN.tf_word(s.get('tf'))} {s.get('side', '')}"]
    if kind == 'WATCH':
        bits[-1] = 'price still far' if s.get('watch_kind') == 'new' else 'confirm first'
    c = SN.card(ICON.get(kind, '•'), s['sym'], kind, _px(s.get('entry'), s),
                _px(s.get('target'), s) if s.get('target') else '', None, ' · '.join(b for b in bits if b))
    why = SN.reason_line(s, score=True)
    nw = SN.news_warning(s['sym'])
    return c + (f'\n<i>{esc(why)}</i>' if why else '') + (f'\n{esc(nw)}' if nw else '')


def gone_reason(reason: str) -> str:
    r = reason or ''
    if r.startswith('rule failing now:'):
        return 'no longer valid: ' + SN.plain(r.split(':', 1)[1].strip())
    if 'reached the entry' in r:
        return 'price reached the entry: manage it on the platform'
    if 'beyond the stop' in r:
        return 'price went past the stop'
    if 'zone removed' in r:
        return 'zone broken by a close'
    return SN.plain(r.split(':')[0])


def gone_card(g: Dict) -> str:
    return (f"{ICON['EXIT']} <b>{esc(g['sym'])}</b>  cancel {esc(g['kind'])} {_px(g.get('entry'), g)}\n"
            f"{esc(gone_reason(g.get('reason') or ''))}")


def pct(z: Dict) -> float:
    """Distance from price to the zone's entry edge in percent of price (no pips: they mean something different on
    every market)."""
    px, prox = z.get('px'), z.get('prox')
    if not px or prox is None or (z.get('sec') or z.get('section')) == 'in':
        return 0.0
    return abs(px - prox) / px * 100


def zone_line(z: Dict) -> str:
    """⏳ EURPLN 1.9% away · close / from monthly demand  —  👀 USDNOK entered monthly demand / at 9.26070."""
    sec = z.get('sec') or z.get('section')
    where = f"{SN.tf_word(z.get('tf'))} {z['side']}"
    if sec == 'near':
        out = f"{ICON['NEAR']} <b>{esc(z['sym'])}</b> near {esc(where)}\n{esc(SN.away(pct(z)))}"
    else:
        out = f"{ICON['WATCH']} <b>{esc(z['sym'])}</b> entered {esc(where)}\nat {_px(z.get('prox'), z)}"
    why = zone_why(z)
    nw = SN.news_warning(z['sym'])
    return out + (f'\n<i>{esc(why)}</i>' if why else '') + (f'\n{esc(nw)}' if nw else '')


def zone_why(z: Dict) -> str:
    """'why: sits inside a bigger zone · not a trade yet: trend against it' (what the scanner already decided)."""
    bits = []
    if z.get('loc_ok'):
        bits.append('top-timeframe zone' if z.get('loc') == 'top' else 'sits inside a bigger zone')
    st = z.get('status') or ''
    if st in ('BUY', 'SELL'):
        bits.append(f'{st} setup')
    elif st:
        bits.append('not a trade yet: ' + SN.plain(z.get('label') or st))
    t = z.get('touches')
    if t is not None:
        bits.append('untouched zone' if t == 0 else f'zone touched {t}x')
    return ('why: ' + ' · '.join(bits)) if bits else ''


def also(items: Sequence[Dict], n: int = 5) -> str:
    """'Also: 👀 EURUSD daily, 👀 GBPUSD weekly' (the setups that did not get a card)."""
    if not items:
        return ''
    out = [f"{ICON.get(s.get('kind'), '•')} {esc(s['sym'])} {SN.tf_word(s.get('tf'))}".rstrip() for s in items[:n]]
    return 'Also: ' + ', '.join(out) + (f' +{len(items) - n}' if len(items) > n else '')


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


def alert_messages(ev: Dict) -> List[Msg]:
    """ONE short message for the new events of a run ([] when nothing is new)."""
    sig, gone, watch, zones = ev.get('signals') or [], ev.get('gone') or [], ev.get('watch') or [], ev.get('zones') or []
    if not (sig or gone or watch or zones):
        return []
    items = [('s', s) for s in sig] + [('g', g) for g in gone] + [('s', s) for s in watch]
    nb = sum(s['kind'] == 'BUY' for s in sig)
    ns = sum(s['kind'] == 'SELL' for s in sig)
    words = [f'{nb} BUY' if nb else '', f'{ns} SELL' if ns else '', f'{len(watch)} WATCH' if watch else '',
             f'{len(gone)} to cancel' if gone else '']
    words = [w for w in words if w]
    n_in = sum((z.get('sec') or z.get('section')) == 'in' for z in zones)
    zwords = ' · '.join(w for w in (f'{n_in} in a zone' if n_in else '', f'{len(zones) - n_in} getting close' if len(zones) > n_in else '') if w)
    title = ('New: ' + ' · '.join(words)) if words else zwords
    h1, h4 = ev.get('h1') or '', ev.get('h4') or ''
    hourly = bool(h1) and _closes(h1, 1) != _closes(h4, 4)       # an hourly scan: an H1 close inside an H4 bar
    when = _when(h1, hours=1) if hourly else _when(h4)
    head = [f"⚡ <b>{esc(title)}</b>", f"FX · {'1H' if hourly else '4H'} candle" + (f" closed {esc(when)}" if when else '')]
    shown = items[:SN.MAX_CARDS]
    cards = [signal_card(x) if k == 's' else gone_card(x) for k, x in shown]
    zl = [zone_line(z) for z in zones]
    room = SN.MAX_CARDS - len(cards)
    visible_z, rest_z = (zl[:room], zl[room:]) if not cards else ([], zl)
    if visible_z:
        cards += visible_z
    detail = [also([x if k == 's' else {**x, 'kind': 'EXIT'} for k, x in items[len(shown):]])]
    detail += rest_z + [FOOTER]
    charts = charts_of([x for k, x in shown if k == 's'] or zones[:room])
    return [SN.compose(head, cards, detail, SN.keyboard(charts, 'Open scanner', C.APP_URL))]


SECTION_WORD = {k: v.replace('⏳ ', '') for k, v in SN.SECTION_WORD.items()}   # ⏳ marks the good zones line


def _lists_detail(pub: Dict) -> List[str]:
    """Per side: 'Close to demand (5)' / 'CORN D1 0.1% · GBPCAD D1 0.1% +3', then 'In demand' etc. (watchlist first,
    then the closest); bounced / turned-down and 'why no trades' stay in the app; scan size + footer."""
    zl = pub.get('lists') or {}
    out: List[str] = []
    for side, sec in SN.SECTION_ORDER:
        if sec == 'left':
            continue
        rows = sorted((zl.get(side) or {}).get(sec) or [], key=lambda r: (not r.get('wl'), pct(r), -(r.get('score') or 0)))
        extra = (lambda r: SN.short_pct(pct(r))) if sec == 'near' else None
        out += SN.section(SECTION_WORD[(side, sec)], rows, 'sym', 3, extra)
    c = pub.get('counts') or {}
    out.append((f"{c['instruments']} markets · " if c.get('instruments') else '') + FOOTER)
    return out


def _close_block(pub: Dict) -> str:
    """The visible 'worth watching' block: up to 3 watchlist markets nearing a located strong zone, one per line."""
    close = _close_rows(pub)[:3]
    if not close:
        return ''
    return f"{ICON['NEAR']} <b>Getting close</b>\n" + '\n'.join(
        f"<b>{esc(r['sym'])}</b> · {esc(SN.TF_SHORT.get(r.get('tf'), r.get('tf') or ''))} {esc(r['side'])} · {esc(SN.away(pct(r)))}"
        for r in close)


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
    """'2 near a good zone ⏳' (watchlist, located zones, approaching) or 'Nothing close yet.'."""
    near = {r['sym']: r for r in _close_rows(pub)}
    if not near:
        return 'nothing close yet'
    return f"{len(near)} worth watching"


def _open_setups(pub: Dict) -> List[Dict]:
    sig = sorted(pub.get('signals') or [], key=lambda s: (not s.get('wl'), -(s.get('score') or 0)))
    wat = sorted([s for s in pub.get('watch') or [] if s.get('wl')], key=lambda s: -(s.get('score') or 0))
    return sig + wat


def _overview(pub: Dict, head0: str, new: Sequence[Dict], show_close: bool = True) -> Msg:
    c = pub.get('counts') or {}
    setups = _open_setups(pub)
    keys = {(s['sym'], s['kind'], s.get('tf')) for s in new or []}
    first = [s for s in setups if (s['sym'], s['kind'], s.get('tf')) in keys]
    order = first + [s for s in setups if s not in first]
    if not setups:
        sub = ('No new trades · ' if new is not None else 'No trades today · ') + _close_count(pub)
    else:
        sub = SN.headline(c.get('BUY', 0), c.get('WATCH', 0), 0, c.get('SELL', 0)).replace(' · nothing to exit', '')
        if new is not None:
            sub += f" · {len(first)} new" if first else ' · nothing new'
    shown = order[:SN.MAX_CARDS]
    detail = [also(order[len(shown):])] + ([] if show_close else [_close_block(pub)]) + _lists_detail(pub)
    if pub.get('fixture'):
        sub += ' · sample data'
    cards = [signal_card(s) for s in shown]
    if show_close and len(cards) < SN.MAX_CARDS and _close_block(pub):
        cards.append(_close_block(pub))
    return SN.compose([head0, esc(sub) if '<' not in sub else sub], cards, detail,
                      SN.keyboard(charts_of(shown), 'Open scanner', C.APP_URL))


def digest_message(pub: Dict, ev: Dict, top: int = SN.MAX_CARDS) -> Msg:
    """The H4 check after every new H4 candle: one message, <= 4 visible lines when nothing new happened."""
    when = _local(pub.get('h4_close_utc') or '') or esc(pub.get('h4') or '')
    new = list((ev or {}).get('signals') or []) + list((ev or {}).get('watch') or [])
    return _overview(pub, f"🕐 <b>4H check · {esc(when)}</b>", new, show_close=False)


def summary_messages(pub: Dict) -> List[Msg]:
    """The daily summary after the NY close (one message)."""
    try:
        day = dt.datetime.strptime((pub.get('h4') or '')[:10], '%Y-%m-%d').strftime('%a %d %b')
    except ValueError:
        day = ''
    m = _overview(pub, f"📊 <b>FX · {esc(day)}</b>" if day else "📊 <b>FX daily</b>", None)
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
    return f'⚠️ <b>FX scan failed</b>\n{esc(reason)}'
