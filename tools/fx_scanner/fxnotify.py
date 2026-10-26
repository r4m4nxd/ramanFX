"""FX Telegram: instant alerts only when something NEW happens, plus one daily summary after the NY close.

Alerts (deduped with the state kept in the cache, so the owner is not spammed every 4 hours):
    every instrument   a NEW BUY / SELL signal; a signal that disappeared (invalidated: zone removed, stop level hit,
                       a rule failing now, or price ran away)
    watchlist only     a NEW WATCH; price newly ENTERING / APPROACHING a located strong zone (re-sent at most every
                       FX_DEDUPE_HOURS per zone)
Daily summary (the first run after a new D1 candle closed, i.e. ~21:05 UTC in summer / 22:05 UTC in winter): the
signals, then in / approaching / left per side, watchlist groups first, then Majors · Crosses · Exotics · Metals · CFDs.
Symbols are Pepperstone names; levels come from the OANDA feed (check them on the Pepperstone chart).
"""
from __future__ import annotations

import os
import sys
from typing import Dict, List, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
import notify as SN  # noqa: E402  (stock scanner Telegram: escape, UTF-16 length, packing, send with 429 retry)

esc, u16, send, pack_cards = SN.esc, SN.u16, SN.send, SN.pack_cards
FOOTER = ('Levels from the OANDA feed: check them on your Pepperstone chart (ZoneVision MT5) before placing. '
          'Rule-based scan, not financial advice.')
ICON = {'BUY': '🟢', 'SELL': '🔴', 'WATCH': '👀'}
SEC_WORD = {'in': 'In', 'near': 'Approaching', 'left': 'Left'}
LIST_CAP = int(os.environ.get('FX_TELEGRAM_LIST_CAP') or '12')


def _px(v, s: Dict) -> str:
    return 'n/a' if v is None else f"{v:.{s.get('digits', 5)}f}"


def signal_card(s: Dict) -> str:
    kind = s['kind'] + (f" ({s.get('watch_kind')})" if s['kind'] == 'WATCH' else '')
    head = (f"{ICON.get(s['kind'], '•')} <b>{esc(kind)} {esc(s['sym'])}</b> · {esc(s['tf'])} {esc(s['side'])} "
            f"{esc(s['zone_type'])} · score {s['score']}/10" + (' · ⭐' if s.get('wl') else ''))
    lines = [head]
    if s.get('group'):
        lines.append(f"<i>{esc(s['group'])}</i>" + (f" · {C.EXOTIC_TAG}" if s.get('exotic') else ''))
    elif s.get('exotic'):
        lines.append(f'<i>{C.EXOTIC_TAG}</i>')
    rr = f" · R:R {s['rr']:.1f}" if s.get('rr') else ''
    tgt = f" · Target {_px(s.get('target'), s)}" + (f" ({s['target_pips']:.0f} pips)" if s.get('target_pips') else '') if s.get('target') else ''
    lines.append(f"Entry {_px(s['entry'], s)} · Stop {_px(s['stop'], s)} ({s['stop_pips']:.1f} pips){tgt}{rr}")
    sp = f" · spread {s['spread_pips']:.1f} pips" if s.get('spread_pips') is not None else ''
    lines.append(f"Price {_px(s['price'], s)} ({s['to_entry_pips']:+.1f} pips to entry){sp}")
    lines.append('Chain: ' + esc(chain_line(s)))
    lines.append(f"Direction {esc(s.get('direction') or 'n/a')}")
    if s.get('note'):
        lines.append(esc(s['note']))
    if s.get('gold_note'):
        lines.append('🥇 ' + esc(s['gold_note']))
    return '\n'.join(lines)


def chain_line(s: Dict) -> str:
    """The location chain, e.g. 'MN demand 1.07000–1.06000 touched ✓ → W1 demand … touched ✓ → D1 demand … touched ✓
    → H4 entry 1.08340–1.08230'."""
    return s.get('chain_text') or s.get('loc_text') or 'n/a'


def gone_card(g: Dict) -> str:
    return (f"⚪ <b>Cancelled {esc(g['kind'])} {esc(g['sym'])}</b> · {esc(g['tf'])} {esc(g['side'])} "
            f"{_px(g.get('entry'), g)}\n{esc(g['reason'])}")


def zone_card(z: Dict) -> str:
    arrow = '⬇️' if z['side'] == 'demand' else '⬆️'
    word = {'in': 'entered', 'near': 'approaching', 'left': 'left'}[z['sec']]
    return (f"{arrow} <b>{esc(z['sym'])}</b> {word} the {esc(z['tf'])} {esc(z['side'])} {esc(z['type'])} "
            f"{_px(z['prox'], z)}–{_px(z['dist'], z)}" + (f" ({z['pips']:.0f} pips)" if z['sec'] == 'near' else '')
            + f"\n{esc(z.get('label') or '')} · {esc(z.get('chain_text') or z.get('loc_text') or '')}")


def alert_messages(ev: Dict) -> List[str]:
    cards = ([signal_card(s) for s in ev.get('signals', [])] + [gone_card(g) for g in ev.get('gone', [])]
             + [signal_card(s) for s in ev.get('watch', [])] + [zone_card(z) for z in ev.get('zones', [])])
    if not cards:
        return []
    return pack_cards('⚡ <b>FX scanner</b> · ' + esc(ev.get('h4') or '') + ' server time', cards, '<i>' + esc(FOOTER) + '</i>')


def _group_key(r: Dict) -> Tuple[int, str]:
    if r.get('wl'):
        return (0, r.get('group') or 'Watchlist')
    return (1 + C.CLASSES.index(r.get('cls') or 'cfd'), C.CLASS_LABEL.get(r.get('cls') or 'cfd', 'Other'))


def list_lines(items: List[Dict], cap: int = LIST_CAP) -> List[str]:
    """'⭐ FX MAJORS: EURUSD H4 ARR 1.08340 (BUY), …' grouped (watchlist groups first, then classes)."""
    by: Dict[Tuple[int, str], List[Dict]] = {}
    for r in items:
        by.setdefault(_group_key(r), []).append(r)
    out = []
    for k in sorted(by):
        rs = by[k]
        shown = ', '.join(f"{esc(r['sym'])} {esc(r['tf'])} {esc(r['type'])} {_px(r['prox'], r)}"
                          + (f" {r['pips']:.0f}p" if r['sec'] == 'near' else '') + f" ({esc(r.get('label') or '')})" for r in rs[:cap])
        more = f' +{len(rs) - cap} more' if len(rs) > cap else ''
        out.append(('⭐ ' if k[0] == 0 else '') + f'<b>{esc(k[1])}</b>: {shown}{more}')
    return out


def summary_messages(pub: Dict) -> List[str]:
    """The daily summary of a published latest.json."""
    title = f"📊 <b>FX daily summary</b> · {esc(pub.get('h4') or '')} server time"
    sig = sorted(pub.get('signals') or [], key=lambda s: (not s.get('wl'), -(s.get('score') or 0)))
    cards = [signal_card(s) for s in sig] or ['No BUY / SELL signal right now.']
    zl = pub.get('lists') or {}
    for side, icon in (('demand', '🟢'), ('supply', '🔴')):
        for sec in ('in', 'near', 'left'):
            items = (zl.get(side) or {}).get(sec) or []
            if items:
                cards.append(f"{icon} <b>{SEC_WORD[sec]} {side}</b> · {len(items)}\n" + '\n'.join(list_lines(items)))
    c = pub.get('counts') or {}
    tail = (f"{c.get('instruments', 0)} instruments · {c.get('BUY', 0)} BUY · {c.get('SELL', 0)} SELL · {c.get('WATCH', 0)} WATCH"
            f"\n<a href=\"{C.APP_URL}\">Open the app</a>\n<i>{esc(FOOTER)}</i>")
    return pack_cards(title, cards, tail)


def failure_message(reason: str) -> str:
    return f'⚠️ <b>FX scan failed</b>\n{esc(reason)}'
