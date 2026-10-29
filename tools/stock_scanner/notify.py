"""Telegram messages for the daily scan: ONE calm message per run, made to be read at a glance on a phone.

    📈 1 BUY · 3 WATCH · nothing to exit             <- the answer first (or "No new setups")
    Stocks · Mon 26 Oct · 6:49 PM

    🟢 XPEV  BUY 8.06 → 16.12 · R:R 5.4              <- at most 3 trade cards, 2 lines each, plain words
    stop 6.56 · monthly demand · score 10/10

    ▸ (collapsed quote) market, more setups, zone lists, why nothing else passed, +N more in the app
    [📈 XPEV] [📈 BXP] [📈 AVGO]                       <- inline keyboard: a chart per card,
    [Open scanner]                                      then the app

Legend (both scanners): 🟢 buy · 🔴 sell · 👀 watch · 🚪 exit · ⏳ approaching. HTML parse mode, <>& escaped, every
message < 4096 UTF-16 units (the collapsed detail is trimmed first). The detail sits in an expandable blockquote
(Bot API 7.4+); if Telegram rejects it, send() retries with a plain blockquote. >= 1.1 s between sends; a 429 waits
retry_after.

Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (unset -> printed instead), TELEGRAM_TOP_N (cards, max 3).
Preview without sending: python tools/stock_scanner/scan.py --preview-telegram (reads the published JSON).
"""
from __future__ import annotations

import datetime as dt
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, List, Optional, Sequence

import lists as L

LIMIT = 4096
SAFE = 4000
FULL_LIST = os.environ.get('SCANNER_APP_URL', 'https://raman-fx.vercel.app/scanner')
LOCAL_TZ = os.environ.get('SCANNER_LOCAL_TZ') or 'America/Edmonton'   # the owner's clock (Calgary)
CLOCK = '%-I:%M %p'                                                   # '3:00 PM', like the phone
MAX_CARDS = 3
QUOTE_LINES = 15
FOOTER = 'not advice'
ICON = {'BUY': '🟢', 'SELL': '🔴', 'WATCH': '👀', 'EXIT': '🚪', 'NEAR': '⏳'}
TF_WORD = {'H1': '1-hour', 'H4': '4-hour', 'D1': 'daily', 'W1': 'weekly', 'MN': 'monthly', '3M': 'quarterly', '6M': '6-month'}
# rule labels / keys -> plain words (the visible text never carries rule jargon)
PLAIN = {'HTF area not reached': 'bigger zone not reached yet', 'location': 'bigger zone not reached yet',
         'high on curve': 'price high in its range', 'curve': 'wrong end of the range',
         'wrong side of the curve': 'wrong end of the range',
         'direction not long': 'trend not up', 'HTF align': 'trend not up', 'direction against': 'trend against it',
         'direction': 'trend against it', 'direction reduced (correction)': 'trend in a pullback', 'reduced': 'trend in a pullback',
         'monthly supply on top': 'monthly supply overhead', 'no HTF supply': 'bigger supply overhead',
         'opposite HTF zone on top': 'bigger opposite zone in the way', 'HTF opposite': 'bigger opposite zone in the way',
         'sideways market': 'sideways market', 'not sideways': 'sideways market', 'sideways': 'sideways market',
         'weak zone type': 'weak zone', 'strong': 'weak zone', 'zone already tested': 'zone used before', 'fresh': 'zone used before',
         'overlap / flip zone': 'messy zone', 'clean': 'messy zone', 'zone already did its job': 'zone already played out',
         'not used': 'zone already played out', '3rd CP in a row': 'third pullback in a row', 'no 3rd CP': 'third pullback in a row',
         'room < 2x the stop (supply or 250% projection)': 'not enough room to the target', 'room': 'not enough room to the target',
         'departure < 2x the base': 'weak move away from the zone', 'departure < 2x': 'weak move away from the zone',
         'leg': 'weak move away from the zone', 'price not near the entry': 'price still far', 'near entry': 'price still far'}
JARGON = ('HTF', 'ARR', 'WOW', ' STR', '1st touch', '2nd touch', '✗', '✓', 'proximal', 'distal', 'Raja', 'Seiden', 'PZ1',
          'L5', 'curve', 'CP ')


def esc(s) -> str: return html.escape(str(s), quote=False)
def u16(s: str) -> int: return len(s.encode('utf-16-le')) // 2
def _f(v, nd=2) -> str: return 'n/a' if v is None else f'{v:,.{nd}f}'
def tf_word(tf: str) -> str: return TF_WORD.get(tf or '', tf or '')


def words(text: str) -> str:
    """Free text with the timeframe codes spelled out ('2.1% above the W1 demand' -> '... the weekly demand')."""
    return re.sub(r'\b(H1|H4|D1|W1|MN|3M|6M)\b', lambda m: TF_WORD[m.group(1)], text or '').replace('HTF', 'bigger-timeframe')


def plain(label: str) -> str:
    """A rule label or key in plain words; unknown labels pass through with 'HTF' spelled out."""
    lab = (label or '').strip()
    if lab.startswith('dir '):
        return 'trend ' + ('down' if 'SHORT' in lab else 'up' if 'LONG' in lab else 'unclear')
    return PLAIN.get(lab) or lab.replace('HTF', 'bigger-timeframe')


class Msg(str):
    """A message text that also carries its inline keyboard (rows of {'text', 'url'} buttons)."""
    buttons: List[List[Dict]]

    silent: bool

    def __new__(cls, text: str, buttons: Optional[List[List[Dict]]] = None, silent: bool = False):
        m = super().__new__(cls, text)
        m.buttons = [r for r in (buttons or []) if r][:5]
        m.silent = silent                   # disable_notification (quiet hours, non-urgent)
        return m


def silenced(m: str, silent: bool = True) -> 'Msg':
    """The same message (text + buttons), sent silently when `silent`."""
    return Msg(str(m), getattr(m, 'buttons', None), silent=silent or bool(getattr(m, 'silent', False)))


def button(text: str, url: str) -> Dict: return {'text': text, 'url': url}


def keyboard(charts: Sequence[Dict], open_label: str, open_url: str) -> List[List[Dict]]:
    """A chart link per card (at most 3), then the bot's own buttons for the same symbols (callback_data, handled by
    the Supabase telegram-bot webhook): one row [🔎 Zones SYM] per symbol and one row [📊 Chart SYM] (4-timeframe
    image), then the app."""
    charts = list(charts)[:MAX_CARDS]
    syms = [c['text'].split(' ', 1)[-1] for c in charts if c.get('text')]
    syms = [x for x in syms if len(f'z:{x}'.encode()) <= 64]
    rows = [charts, [cb(f'🔎 {x}', f'z:{x}') for x in syms], [cb(f'📊 {x}', f'c:{x}') for x in syms]]
    return [r for r in rows if r] + [[button(open_label, open_url)]]


def cb(text: str, data: str) -> Dict: return {'text': text, 'callback_data': data}


def _cb_ok(data: str) -> bool: return len(data.encode()) <= 64


def alert_keyboard(charts: Sequence[Dict], open_label: str, open_url: str, remind: bool = True) -> List[List[Dict]]:
    """The instant-alert keyboard, at most 3 rows. One symbol: [📈 SYM (TradingView)] [📊 4Q chart] [🔎 Zones] /
    [🔕 Mute 1w] [⏰ 0.2%] / [Open scanner]. Two or three symbols: [📊 SYM] per symbol / [🔕 SYM] per symbol /
    [⏰ SYM] per symbol (remind=False: [Open scanner] instead; bot callbacks: c:SYM chart, m:SYM:7 mute 7 days,
    r:SYM:0.2 remind at 0.2%)."""
    charts = list(charts)[:MAX_CARDS]
    syms = [c['text'].split(' ', 1)[-1] for c in charts if c.get('text')]
    syms = [x for x in syms if _cb_ok(f'r:{x}:0.2')]
    if not syms:
        return [r for r in [charts] if r] + [[button(open_label, open_url)]]
    if len(syms) == 1:
        x = syms[0]
        return [charts[:1] + [cb('📊 4Q chart', f'c:{x}'), cb('🔎 Zones', f'z:{x}')],
                [cb('🔕 Mute 1w', f'm:{x}:7'), cb('⏰ 0.2%', f'r:{x}:0.2')], [button(open_label, open_url)]]
    last = [cb(f'⏰ {x} 0.2%', f'r:{x}:0.2') for x in syms] if remind else [button(open_label, open_url)]
    return [[cb(f'📊 {x}', f'c:{x}') for x in syms], [cb(f'🔕 {x} 1w', f'm:{x}:7') for x in syms], last]


def kevin_line(s: Dict) -> str:
    """'⭐ also in Kevin's plan (Oct 28: 1H demand 4024–4041)' when the scan matched the card to Kevin's plan."""
    k = s.get('kevin')
    return f"⭐ also in Kevin's plan ({esc(k)})" if k else ''


def fired_alert_message(f: Dict, market: str = 'fx', bar_word: str = '') -> 'Msg':
    """ONE calm message for a fired user alert: what happened, the price, the why line, the 4-quarter chart button."""
    a, sym, nd = f['alert'], f['sym'], int(f.get('digits') or 2)
    fmt = lambda v: 'n/a' if v is None else f'{v:,.{nd}f}'  # noqa: E731
    if a['kind'] == 'price':
        what = f"reached your level {fmt(a.get('level'))}"
    else:
        z = f.get('zone') or {}
        what = (f"near the {tf_word(z.get('tf'))} {z.get('side', 'zone')}" if a.get('pct') and z.get('sec') != 'in'
                else f"in the {tf_word(z.get('tf'))} {z.get('side', 'zone')}")
        if z.get('prox') is not None:
            what += f" {fmt(min(z['prox'], z.get('dist', z['prox'])))}–{fmt(max(z['prox'], z.get('dist', z['prox'])))}"
    lines = [f"🔔 <b>{esc(sym)}</b> {esc(what)}",
             f"price {fmt(f.get('price'))}" + (f" · {esc(bar_word)}" if bar_word else '') + ' · your alert']
    if f.get('why'):
        lines.append(f"<i>why: {esc(f['why'])}</i>")
    kb = [[cb(f'📊 {sym} chart', f'c:{sym}')]] if _cb_ok(f'c:{sym}') else []
    return Msg('\n'.join(lines), kb)


def local_time(iso_utc: str, fmt: str = '%H:%M', tz: str = LOCAL_TZ) -> str:
    """'2026-10-27T00:49:18Z' -> '6:49 PM' on the owner's clock with CLOCK (fmt is strftime); '' when unparsable."""
    try:
        t = dt.datetime.strptime((iso_utc or '')[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=dt.timezone.utc)
    except ValueError:
        return ''
    try:
        from zoneinfo import ZoneInfo
        return t.astimezone(ZoneInfo(tz)).strftime(fmt)
    except Exception:  # noqa: BLE001
        return t.strftime(fmt) + ' UTC'


def card(icon: str, sym: str, kind: str, entry: str, target: str, rr, line2: str, tag: str = '') -> str:
    """🟢 <b>XPEV</b>  BUY 8.06 → 16.12 · R:R 5.4 / stop 6.56 · monthly demand · score 10/10."""
    top = f"{icon} <b>{esc(sym)}</b>{esc(tag)}  {esc(kind)} {esc(entry)}" + (f" → {esc(target)}" if target else '')
    if rr:
        top += f" · R:R {rr:.0f}" if rr >= 10 else f" · R:R {rr:.1f}"
    return top + '\n' + esc(line2)


TF_SHORT = {'H1': '1H', 'H4': '4H', 'D1': 'D1', 'W1': 'W1', 'MN': 'MN', '3M': '3M', '6M': '6M'}


def away(pct) -> str:
    """Distance in plain words: '0.4% away · very close' (< 0.5%), '1.9% away · close' (< 2%), '3.3% away'."""
    p = abs(float(pct or 0))
    tag = ' · very close' if p < 0.5 else ' · close' if p < 2 else ''
    return f'{short_pct(p)} away{tag}'


def short_pct(p) -> str:
    """'1.4%', and '<0.1%' rather than a misleading '0.0%'."""
    p = abs(float(p or 0))
    return '<0.1%' if p < 0.05 else f'{p:.1f}%'


def section(title: str, rows: Sequence[Dict], key: str, n: int = 3, extra=None) -> List[str]:
    """Two short lines: a heading 'In demand (5)' and the items 'USDNOK MN · AUDCAD 4H · EURGBP W1 +2'."""
    if not rows:
        return []
    items = [esc(r[key]) + (f" {TF_SHORT.get(r['tf'], r['tf'])}" if r.get('tf') else '') + (f' {esc(extra(r))}' if extra else '')
             for r in rows[:n]]
    return [f'<b>{esc(title)}</b> ({len(rows)})', ' · '.join(items) + (f' +{len(rows) - n}' if len(rows) > n else '')]


def names(rows: Sequence[Dict], key: str, n: int = 4, extra=None) -> str:
    """'ALB W1, BURL MN, PCG 3M +12' (the first n by the list order, i.e. zone score). Every name carries the
    timeframe of the zone it is near / in / left (owner rule)."""
    shown = [esc(r[key]) + (f" {TF_SHORT.get(r['tf'], r['tf'])}" if r.get('tf') else '') + (f' {esc(extra(r))}' if extra else '')
             for r in rows[:n]]
    return ', '.join(shown) + (f' +{len(rows) - n}' if len(rows) > n else '')


def quote(lines: Sequence[str], cap: int = QUOTE_LINES) -> str:
    """One collapsed expandable blockquote; past `cap` lines: '+N more in the app'."""
    lines = [x for x in lines if x]
    if not lines:
        return ''
    if len(lines) > cap:
        lines = lines[:cap - 1] + [f'+{len(lines) - cap + 1} more in the app']
    return '<blockquote expandable>' + '\n'.join(lines) + '</blockquote>'


def compose(head: Sequence[str], cards: Sequence[str], detail: Sequence[str], buttons=None, limit: int = SAFE,
            cap: int = QUOTE_LINES) -> Msg:
    """Headline lines, a blank line, the cards (blank line between), then the collapsed detail; the detail is trimmed
    (from the end) until the message fits `limit` UTF-16 units."""
    detail = [x for x in detail if x]
    while True:
        parts = ['\n'.join(head)] + list(cards)
        q = quote(detail, cap=cap) if len(detail) > 1 else ''.join(f'<i>{x}</i>' for x in detail if x)
        if q:
            parts.append(q)
        text = '\n\n'.join(p for p in parts if p)
        if u16(text) <= limit or not detail:
            break
        detail = detail[:-2] + ['+ more in the app'] if len(detail) > 1 else []
    if u16(text) > limit:
        text = _cut(text, limit)
    return Msg(text, buttons)


def visible(m: str) -> str:
    """The part of a message shown before tapping the collapsed quote (for tests and previews)."""
    return re.sub(r'<blockquote expandable>.*?</blockquote>', '', m, flags=re.S)


# ---- news (tools/news/calendar.py): high-impact events near the alert ------------------------------------------------
NEWS: List[Dict] = []          # set once per run by the scanner (load_news); empty in tests / previews


def load_news(market: str = 'fx') -> List[Dict]:
    """High-impact calendar events from 30 min ago to 70 min ahead (FX: every major currency; stocks: US). Never raises."""
    try:
        tools = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if tools not in sys.path:
            sys.path.append(tools)
        from news import calendar as NC
        return NC.events(None, hours_ahead=70 / 60, hours_back=0.5, countries=NC.FX_COUNTRIES if market == 'fx' else ['US'])
    except Exception:  # noqa: BLE001
        return []


def news_warning(symbol: str, market: str = 'fx') -> str:
    """'⚠️ US CPI in 20 min' for the symbol (60 min ahead to 15 min after), '' when nothing (or no NEWS loaded)."""
    if not NEWS:
        return ''
    try:
        from news import calendar as NC
        return NC.warning(symbol, NEWS, market=market)
    except Exception:  # noqa: BLE001
        return ''


# ---- the 'why' line under every alert card (both scanners) -----------------------------------------------------------
def trend_words(direction: str) -> str:
    """'LONG - FULL' -> 'trend up', 'SHORT - REDUCED' -> 'trend down, pulling back', 'WAIT ...' -> 'trend unclear'."""
    d = (direction or '').upper()
    base = 'trend up' if d.startswith('LONG') else 'trend down' if d.startswith('SHORT') else 'trend unclear'
    return base + (', pulling back' if 'REDUCED' in d else '')


def reason_line(s: Dict, score: bool = False) -> str:
    """One short plain line from what the scanner already computed: where the zone sits (the nesting chain), the trend,
    first touch or not, optionally the score: 'why: 4-hour zone inside monthly demand · trend up · untouched zone'."""
    ch = [c for c in (s.get('chain') or []) if isinstance(c, dict)]
    side = s.get('side') or (ch[-1].get('side') if ch else '') or 'demand'
    tfw = tf_word(s.get('tf'))
    bits = []
    if len(ch) > 1:
        host = ch[0]
        bits.append(f"{tfw} zone inside {tf_word(host.get('tf'))} {host.get('side') or side}")
    elif s.get('loc') == 'top' or ch:
        bits.append(f'{tfw} {side} is the top zone')
    elif s.get('loc_ok') is False:
        bits.append('no bigger zone behind it')
    if s.get('direction'):
        bits.append(trend_words(s['direction']))
    t = s.get('touches')
    if t is not None:
        bits.append('untouched zone' if t == 0 else f'zone touched {t}x')
    if score and s.get('score') is not None:
        bits.append(f"score {s['score']}/10")
    return ('why: ' + ' · '.join(bits)) if bits else ''


# ---- stocks ------------------------------------------------------------------------------------------------------------
def stock_card(s: Dict) -> str:
    kind = s['kind']
    tag = f" ({s['home']})" if s.get('home') else ''
    zone = f"{tf_word(s.get('tf'))} demand"
    if kind == 'BUY':
        extra = f"score {s.get('score', 0)}/10"
    else:
        extra = 'price still far' if s.get('watch') == 'new' else 'confirm first'
    c = card(ICON[kind], s['symbol'], kind, _f(s.get('entry')), _f(s.get('target')), s.get('rr'),
             f"stop {_f(s.get('stop'))} · {zone} · {extra}", tag)
    why = reason_line({**s, 'side': 'demand'})
    return c + (f'\n<i>{esc(why)}</i>' if why else '')


EXIT_WORDS = {'stop': 'stop hit by the close', 'demand_broken': 'demand under the entry broke',
              'near_supply': 'near the next supply', 'in_supply': 'inside a supply',
              'trail': 'trail the stop up', 'trail_broken': 'trail zone broke',
              'trend_change': 'trend turned down', 'currency': 'holding currency differs from the listing'}


def exit_card(e: Dict) -> str:
    reasons = [w['reason'] for w in e['warnings']] if 'warnings' in e else list(e.get('reasons') or [])
    words = [EXIT_WORDS.get(r, r) for r in reasons] or ['check the position']
    pos = [f"price {_f(e.get('price'))}" if e.get('price') is not None else '',
           f"entry {_f(e.get('entry'))}" if e.get('entry') is not None else '',
           f"stop {_f(e.get('stop'))}" if e.get('stop') is not None else '']
    line2 = ' · '.join([x for x in pos if x] + words[1:2]) or 'check the position'
    return f"{ICON['EXIT']} <b>{esc(e['symbol'])}</b>  EXIT · {esc(words[0])}\n{esc(line2)}"


def headline(nb: int, nw: int, ne: int, sell: Optional[int] = None) -> str:
    if not (nb or nw or ne or sell):
        return 'No new setups'
    parts = [f'{nb} BUY'] + ([f'{sell} SELL'] if sell is not None else []) + [f'{nw} WATCH']
    return ' · '.join(parts) + (' · nothing to exit' if not ne else f' · {ne} to exit')


SECTION_WORD = {('demand', 'in'): 'In demand', ('demand', 'near'): '⏳ Close to demand', ('demand', 'left'): 'Bounced off demand',
                ('supply', 'in'): 'In supply', ('supply', 'near'): '⏳ Close to supply', ('supply', 'left'): 'Turned down at supply'}
SECTION_ORDER = (('demand', 'near'), ('demand', 'in'), ('demand', 'left'), ('supply', 'near'), ('supply', 'in'), ('supply', 'left'))


def regime_line(res: Dict) -> str:
    rg = res.get('regime') or []
    up = [r['symbol'] for r in rg if r.get('above200')]
    dn = [r['symbol'] for r in rg if r.get('above200') is False]
    if not rg:
        return ''
    bits = [f"{', '.join(up)} above 200-day" if up else '', f"{', '.join(dn)} below" if dn else '']
    return 'Market: ' + esc(', '.join(b for b in bits if b))


def why_line(reasons: Sequence[Dict], n: int = 3) -> str:
    if not reasons:
        return ''
    return 'Why not more: ' + esc(', '.join(f"{plain(r.get('label') or r.get('rule') or '')} ({r['count']})" for r in reasons[:n]))


def build_messages(res: Dict, top: int = MAX_CARDS, cap: int = QUOTE_LINES, muted: Optional[set] = None) -> List[Msg]:
    """The daily scan as ONE message (a list, for send()). muted = symbols muted in the bot: no card (they stay in
    the lists below)."""
    muted = muted or set()
    sigs = [s for s in res.get('signals', []) if s.get('symbol') not in muted]
    key = lambda s: (-s.get('score', 0), -(s.get('rr') or 0))  # noqa: E731
    buys = sorted([s for s in sigs if s['kind'] == 'BUY'], key=key)
    watch = sorted([s for s in sigs if s['kind'] == 'WATCH'], key=key)
    exits = [e for e in res.get('exits', []) if e.get('symbol') not in muted]
    n = max(0, min(top, MAX_CARDS))
    picked = ([('EXIT', e) for e in exits] + [('SIG', s) for s in buys] + [('SIG', s) for s in watch])[:n]
    cards = [exit_card(x) if k == 'EXIT' else stock_card(x) for k, x in picked]
    rest = [x for k, x in ([('EXIT', e) for e in exits] + [('SIG', s) for s in buys + watch])[n:]]
    day = ''
    try:
        day = dt.date.fromisoformat(res.get('date') or '').strftime('%a %d %b')
    except ValueError:
        day = res.get('date') or ''
    when = local_time(res.get('generated_at') or '', CLOCK)
    icon = '🧪' if res.get('fixture') else '📈'
    head = [f"{icon} <b>{esc(headline(len(buys), len(watch), len(exits)))}</b>",
            f"Stocks · {esc(day)}" + (f" · {esc(when)}" if when else '')]
    if res.get('fixture'):
        head[1] += ' · sample data'
    if res.get('data_warning'):
        head.append('⚠️ ' + esc(res['data_warning']))
    nw = news_warning('SPY', 'stock')                     # US events move every US stock: once, under the headline
    if nw:
        head.append(esc(nw))
    detail = [regime_line(res)]
    for a in (res.get('watch_alerts') or [])[:2]:
        detail.append('Watchlist: ' + esc(words(a['text'])))
    if rest:
        detail.append('Also: ' + ', '.join(f"{ICON.get(x.get('kind') or 'EXIT', '•')} {esc(x['symbol'])}"
                                         + (f" {TF_SHORT.get(x['tf'], x['tf'])}" if x.get('tf') else '') for x in rest[:5])
                      + (f' +{len(rest) - 5}' if len(rest) > 5 else ''))
    zl = res.get('zone_lists') or L.zone_lists(res.get('details') or {})
    for side, sec in SECTION_ORDER:
        if sec == 'left':
            continue                     # bounced / turned down: in the app only (keeps the message short)
        rows = (zl.get(side) or {}).get(sec) or []
        extra = (lambda r: short_pct(r.get('pct'))) if sec == 'near' else None
        detail += section(SECTION_WORD[(side, sec)].replace('⏳ ', ''), rows, 's', 3, extra)
    if res.get('scanned'):
        detail.append(f"{res['scanned']} stocks · {FOOTER}")
    charts = [button(f"📈 {x['symbol']}", x['chart']) for k, x in picked if k == 'SIG' and x.get('chart')]
    return [compose(head, cards, detail, alert_keyboard(charts, 'Open scanner', FULL_LIST, remind=False), cap=cap)]


def load_published(out_dir: str) -> Dict:
    """The committed scan as a result dict for build_messages: latest.json + the ticker details of the shards (the
    zone lists come from latest.json when it has them, else they are rebuilt from the shards and index.json)."""
    with open(os.path.join(out_dir, 'latest.json')) as f:
        res = json.load(f)
    rows: Dict[str, Dict] = {}
    try:
        with open(os.path.join(out_dir, 'index.json')) as f:
            rows = {r['s']: r for r in json.load(f).get('tickers') or []}
    except (OSError, ValueError):
        pass
    if not res.get('zone_lists'):
        details: Dict[str, Dict] = {}
        tdir = os.path.join(out_dir, 't')
        for name in sorted(os.listdir(tdir)) if os.path.isdir(tdir) else []:
            if name.endswith('.json'):
                with open(os.path.join(tdir, name)) as f:
                    details.update(json.load(f).get('tickers') or {})
        res['zone_lists'] = L.zone_lists(details, rows)
    return res


def print_messages(msgs: Sequence[str], out=sys.stdout) -> None:
    for k, m in enumerate(msgs):
        print(f'----- message {k + 1}/{len(msgs)} · {u16(m)} UTF-16 units -----', file=out)
        print(m, file=out)
        for row in getattr(m, 'buttons', None) or []:
            print('  ' + '  '.join(f"[{b['text']}]({b.get('url') or 'tap: ' + b.get('callback_data', '')})" for b in row), file=out)


def preview(out_dir: str, top: int = MAX_CARDS, cap: int = QUOTE_LINES, out=sys.stdout) -> List[Msg]:
    """Print the exact message of the published scan (and its buttons), never sending."""
    msgs = build_messages(load_published(out_dir), top=top, cap=cap)
    print_messages(msgs, out)
    return msgs


def pack_cards(title: str, cards: List[str], tail: str = '', limit: int = SAFE) -> List[str]:
    """Cards into messages under `limit` UTF-16 units; a split happens only between cards (a single card longer
    than the limit is cut on a line boundary as a last resort)."""
    out, cur = [], title
    for c in cards + ([tail] if tail else []):
        if u16(c) + u16(title) + 2 > limit:
            c = _cut(c, limit - u16(title) - 2)
        if u16(cur) + 2 + u16(c) > limit:
            out.append(cur)
            cur = title + ' (cont.)\n\n' + c
        else:
            cur = cur + '\n\n' + c
    out.append(cur)
    return out


def _cut(card: str, limit: int) -> str:
    keep = []
    for line in card.split('\n'):
        if u16('\n'.join(keep + [line])) > limit - 2:
            break
        keep.append(line)
    return '\n'.join(keep) + '\n…'


def _post(token: str, fields: Dict) -> Dict:
    """One sendMessage call: {'ok': bool, 'code': http code, 'retry': seconds, 'desc': description}."""
    body = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(f'https://api.telegram.org/bot{token}/sendMessage', data=body)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return {'ok': bool(json.loads(r.read()).get('ok', False)), 'code': 200}
    except urllib.error.HTTPError as e:
        info: Dict = {}
        try:
            info = json.loads(e.read())
        except Exception:  # noqa: BLE001
            pass
        return {'ok': False, 'code': e.code, 'retry': int((info.get('parameters') or {}).get('retry_after') or 0),
                'desc': str(info.get('description') or '')}


def send(messages: List[str], pause: float = 1.1) -> bool:
    token, chat = os.environ.get('TELEGRAM_BOT_TOKEN'), os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat:
        print('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set: printing instead\n')
        for m in messages:
            print(m)
            print('\n' + '-' * 40 + '\n')
        return False
    ok = True
    for k, m in enumerate(messages):
        if k:
            time.sleep(pause)
        fields = {'chat_id': chat, 'text': str(m), 'parse_mode': 'HTML', 'disable_web_page_preview': 'true'}
        rows = getattr(m, 'buttons', None)
        if getattr(m, 'silent', False):
            fields['disable_notification'] = 'true'
        if rows:
            fields['reply_markup'] = json.dumps({'inline_keyboard': rows})
        sent = False
        for attempt in range(5):
            try:
                r = _post(token, fields)
            except Exception as e:  # noqa: BLE001
                print(f'Telegram send failed: {type(e).__name__}', file=sys.stderr)
                break
            if r['ok']:
                sent = True
                break
            if r['code'] == 429 and attempt < 4:
                time.sleep(min(max(r.get('retry', 0), 1), 30) + 0.5)
                continue
            desc = r.get('desc', '').lower()
            if r['code'] == 400 and '<blockquote expandable>' in fields['text'] and ('parse' in desc or 'entit' in desc or 'tag' in desc):
                fields['text'] = fields['text'].replace('<blockquote expandable>', '<blockquote>')   # older clients / API
                continue
            if r['code'] == 400 and 'reply_markup' in fields and ('button' in desc or 'markup' in desc or 'url' in desc):
                fields.pop('reply_markup')
                continue
            print(f"Telegram send failed: HTTP {r['code']}", file=sys.stderr)   # never print the token / URL
            break
        ok = ok and sent
    return ok
