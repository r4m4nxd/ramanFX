"""Telegram messages for the daily scan: ONE calm message per run, made to be read at a glance on a phone by someone
with no trading knowledge (owner 2026-11-03: premium, plain words, no jargon, no decorative emoji).

    <b>1 buy signal · 3 watching · nothing to sell</b>           <- the answer first (or "No new trade ideas")
    Stocks · Mon 26 Oct

    <b>XPeng</b> (XPEV) · Buy signal                             <- at most 3 cards: plain name + one phrase,
    <blockquote>▲ Buy at <code>8.06</code> · Exit if wrong <code>6.56</code> · Take profit at <code>16.12</code> · Possible gain 5.4× the risk
    Why: a monthly buy area, the trend is up, first visit to this area, quality score 10/10.</blockquote>

    ▸ (collapsed quote) market mood, more ideas, area lists, +N more in the app
    <i>6:49 PM MT · For learning only, not financial advice</i>    <- the same footer on every message
    [Chart T9] [Chart T19]  /  [Snooze T9] ...  /  [Open app]       <- inline keyboard, no emoji, <= 3 per row

Words: "buy area" / "sell area" (never demand / supply), "weekly" / "monthly" (never W1 / MN), "Buy at", "Exit if
wrong", "Take profit at", "Possible gain 2.9× the risk". Markers only: ▲ up / buy, ▼ down / sell, ● status (at most
one per line). HTML parse mode, <>& escaped, every message < 4096 UTF-16 units (the collapsed detail is trimmed first).
The detail sits in an expandable blockquote (Bot API 7.4+); if Telegram rejects it, send() retries with a plain
blockquote. >= 1.1 s between sends; a 429 waits retry_after.

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
FOOTER = 'For learning only, not financial advice'
# markers only (owner 2026-11-03): ▲ up / buy, ▼ down / sell, ● status; never more than one per line
ICON = {'BUY': '▲', 'SELL': '▼', 'WATCH': '●', 'EXIT': '●', 'NEAR': '●'}
TF_WORD = {'H1': 'hourly', 'H4': '4-hour', 'D1': 'daily', 'W1': 'weekly', 'MN': 'monthly', '3M': '3-month', '6M': '6-month',
           '1H': 'hourly', '4H': '4-hour', 'M15': '15-minute', '15m': '15-minute'}
AREA = {'demand': 'buy area', 'supply': 'sell area'}
AREAS = {'demand': 'buy areas', 'supply': 'sell areas'}
KIND_WORD = {'BUY': 'Buy signal', 'SELL': 'Sell signal', 'WATCH': 'watching', 'EXIT': 'check your position'}
# rule labels / keys -> plain words (the visible text never carries rule jargon). Mirrored in
# supabase/functions/telegram-bot/logic.ts PLAIN.
PLAIN = {'HTF area not reached': 'bigger area not reached yet', 'location': 'bigger area not reached yet',
         'high on curve': 'price high in its range', 'curve': 'wrong end of the range',
         'wrong side of the curve': 'wrong end of the range',
         'direction not long': 'trend not up', 'HTF align': 'trend not up', 'direction against': 'trend against it',
         'direction': 'trend against it', 'direction reduced (correction)': 'trend taking a breather', 'reduced': 'trend taking a breather',
         'monthly supply on top': 'monthly sell area overhead', 'no HTF supply': 'bigger sell area overhead',
         'opposite HTF zone on top': 'bigger opposite area in the way', 'HTF opposite': 'bigger opposite area in the way',
         'sideways market': 'price moving sideways', 'not sideways': 'price moving sideways', 'sideways': 'price moving sideways',
         'weak zone type': 'weak area', 'strong': 'weak area', 'zone already tested': 'area used before', 'fresh': 'area used before',
         'overlap / flip zone': 'messy area', 'clean': 'messy area', 'zone already did its job': 'area already played out',
         'not used': 'area already played out', '3rd CP in a row': 'third dip in a row', 'no 3rd CP': 'third dip in a row',
         'room < 2x the stop (supply or 250% projection)': 'not enough room to take profit', 'room': 'not enough room to take profit',
         'departure < 2x the base': 'weak move away from the area', 'departure < 2x': 'weak move away from the area',
         'leg': 'weak move away from the area', 'price not near the entry': 'price still far', 'near entry': 'price still far'}
JARGON = ('HTF', 'ARR', 'WOW', ' STR', '1st touch', '2nd touch', '✗', '✓', 'proximal', 'distal', 'Raja', 'Seiden', 'PZ1',
          'L5', 'curve', 'CP ', 'R:R', 'demand', 'supply', 'Kevin', 'stop ', 'WATCH', '🟢', '🔴', '👀', '⏳', '🚪', '⚡')
# plain names of the currencies / metals in a 6-letter FX symbol (same table as supabase/functions/telegram-bot/card.ts)
CCY = {'EUR': 'Euro', 'USD': 'US dollar', 'GBP': 'British pound', 'JPY': 'Japanese yen', 'CHF': 'Swiss franc',
       'CAD': 'Canadian dollar', 'AUD': 'Australian dollar', 'NZD': 'New Zealand dollar', 'XAU': 'Gold', 'XAG': 'Silver',
       'XPT': 'Platinum', 'XPD': 'Palladium', 'CNH': 'Chinese yuan', 'HKD': 'Hong Kong dollar', 'SGD': 'Singapore dollar',
       'MXN': 'Mexican peso', 'ZAR': 'South African rand', 'TRY': 'Turkish lira', 'NOK': 'Norwegian krone',
       'SEK': 'Swedish krona', 'DKK': 'Danish krone', 'PLN': 'Polish zloty', 'HUF': 'Hungarian forint',
       'CZK': 'Czech koruna', 'THB': 'Thai baht', 'BTC': 'Bitcoin', 'ETH': 'Ether'}
_PRICED_IN = ('XAU', 'XAG', 'XPT', 'XPD', 'BTC', 'ETH')
CRYPTO = {'BTC': 'Bitcoin', 'ETH': 'Ether', 'SOL': 'Solana', 'XRP': 'XRP', 'ADA': 'Cardano', 'DOGE': 'Dogecoin',
          'AVAX': 'Avalanche', 'LINK': 'Chainlink', 'LTC': 'Litecoin', 'DOT': 'Polkadot', 'UNI': 'Uniswap',
          'BCH': 'Bitcoin Cash', 'BNB': 'BNB', 'XLM': 'Stellar', 'MATIC': 'Polygon', 'TRX': 'Tron', 'SHIB': 'Shiba Inu'}
# plain names of the Pepperstone index / commodity CFDs the FX scanner covers
CFD_NAME = {'US500': 'US 500 index', 'NAS100': 'US tech 100 index', 'US30': 'US Dow 30 index', 'US2000': 'US small companies index',
            'UK100': 'UK 100 index', 'GER40': 'Germany 40 index', 'FRA40': 'France 40 index', 'EUSTX50': 'Euro area 50 index',
            'SPA35': 'Spain 35 index', 'SWI20': 'Swiss 20 index', 'NETH25': 'Netherlands 25 index', 'JPN225': 'Japan 225 index',
            'HK50': 'Hong Kong 50 index', 'CN50': 'China 50 index', 'AUS200': 'Australia 200 index',
            'USDX': 'US dollar index', 'EURX': 'Euro index', 'JPYX': 'Japanese yen index', 'VIX': 'Fear index (VIX)',
            'SPOTBRENT': 'Brent crude oil', 'SPOTCRUDE': 'US crude oil', 'NATGAS': 'Natural gas', 'CORN': 'Corn',
            'WHEAT': 'Wheat', 'SOYBEANS': 'Soybeans', 'SUGAR': 'Sugar', 'COFFEE': 'Coffee', 'COCOA': 'Cocoa',
            'COTTON': 'Cotton', 'COPPER': 'Copper'}
TZ_LABEL = {'America/Edmonton': 'MT', 'America/Denver': 'MT', 'America/Boise': 'MT', 'America/Regina': 'CT',
            'America/Winnipeg': 'CT', 'America/Chicago': 'CT', 'America/Toronto': 'ET', 'America/New_York': 'ET',
            'America/Vancouver': 'PT', 'America/Los_Angeles': 'PT'}


def esc(s) -> str: return html.escape(str(s), quote=False)
def u16(s: str) -> int: return len(s.encode('utf-16-le')) // 2
def _f(v, nd=2) -> str: return 'n/a' if v is None else f'{v:,.{nd}f}'
def tf_word(tf: str) -> str: return TF_WORD.get(tf or '', tf or '')
def area(side: str, n: int = 1) -> str: return (AREA if n == 1 else AREAS).get(side or '', 'price area' if n == 1 else 'price areas')
def code(v: str) -> str: return f'<code>{esc(v)}</code>'
def a(word: str) -> str: return ('an ' if re.match(r'(?i)[aeiou]|hour', word or '') else 'a ') + (word or '')


def plain_name(sym: str, name: str = '', market: str = 'fx') -> str:
    """'EURUSD' -> 'Euro vs US dollar', 'XAUUSD' -> 'Gold (in US dollars)'; a stock -> its company name (legal suffix
    dropped); anything else -> the name when it is a real one, else the symbol (port of card.ts plainName)."""
    sym = sym or ''
    if market == 'stock':
        n = re.sub(r',?\s+(Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|plc|PLC|Co\.|N\.V\.|S\.A\.|SE|AG|'
                   r'Holdings?|Class [A-C]|Common Stock)$', '', (name or '').strip())
        n = re.sub(r',?\s+(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited)$', '', n)
        return (n if n and len(n) <= 40 else '') or sym
    if sym in CFD_NAME:
        return CFD_NAME[sym]
    c = re.fullmatch(r'([A-Z]{3,5})(USD|USDT)', sym)
    if c and c.group(1) in CRYPTO and c.group(1) not in CCY:
        return f'{CRYPTO[c.group(1)]} (in US dollars)'
    m = re.fullmatch(r'([A-Z]{3})([A-Z]{3})', sym)
    if not m or m.group(1) not in CCY or m.group(2) not in CCY:
        return name if name and name not in ('FX', sym) and len(name) <= 40 else sym
    a, b = CCY[m.group(1)], CCY[m.group(2)]
    return f'{a} (in {b}s)' if m.group(1) in _PRICED_IN else f'{a} vs {b}'


def title(sym: str, name: str = '', market: str = 'fx', alt: str = '') -> str:
    """'<b>Euro vs US dollar</b> (EURUSD)', '<b>NVIDIA</b> (NVDA)', '<b>T9</b>' (no better name known)."""
    pn = plain_name(sym, name, market)
    ids = ', '.join(x for x in dict.fromkeys([sym if pn != sym else '', alt]) if x)
    return f'<b>{esc(pn)}</b>' + (f' ({esc(ids)})' if ids else '')


def tz_label(tz: str = '') -> str:
    return TZ_LABEL.get(tz or LOCAL_TZ, '')


def now_clock(tz: str = '') -> str:
    """The time now on the owner's clock ('6:49 PM')."""
    return local_time(dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S'), CLOCK, tz or LOCAL_TZ)


def footer(source: str = '', when: Optional[str] = None, tz: str = '') -> str:
    """The same italic last line on every message: 'Pepperstone prices · 9:00 AM MT · For learning only, not financial
    advice' (the parts not known are left out; when=None: the time now)."""
    when = now_clock(tz) if when is None else when
    if when and not when.endswith('UTC') and tz_label(tz):
        when = f'{when} {tz_label(tz)}'
    parts = [f'{source} prices' if source else '', when or '', FOOTER]
    return '<i>' + esc(' · '.join(p for p in parts if p)) + '</i>'


def gain(rr) -> str:
    """'Possible gain 2.9× the risk' (R:R in plain words)."""
    if not rr:
        return ''
    return f'Possible gain {rr:.0f}× the risk' if round(rr, 1) >= 10 else f'Possible gain {rr:.1f}× the risk'


def plan_line(long: bool, entry: str, stop: str = '', target: str = '', rr=None) -> str:
    """'Buy at <code>1.08420</code> · Exit if wrong <code>1.08190</code> · Take profit at <code>1.09100</code> ·
    Possible gain 2.9× the risk' (values already formatted; empty / 'n/a' parts are left out)."""
    ok = lambda v: v and v != 'n/a'  # noqa: E731
    parts = [f"{'Buy' if long else 'Sell'} at {code(entry)}" if ok(entry) else '',
             f'Exit if wrong {code(stop)}' if ok(stop) else '', f'Take profit at {code(target)}' if ok(target) else '', gain(rr)]
    return ' · '.join(p for p in parts if p)


def block(lines: Sequence[str]) -> str:
    """Lines (HTML) in one Telegram quote; '' when there are none."""
    lines = [x for x in lines if x]
    return '<blockquote>' + '\n'.join(lines) + '</blockquote>' if lines else ''


_WORDS = [(r'\b(H1|H4|D1|W1|MN|3M|6M|1H|4H|M15|15m)\b', lambda m: TF_WORD[m.group(1)]),
          (r'\bdemands\b', lambda m: 'buy areas'), (r'\bsupplies\b', lambda m: 'sell areas'),
          (r'\bdemand\b', lambda m: 'buy area'), (r'\bsupply\b', lambda m: 'sell area'),
          (r'\bR:R\b', lambda m: 'gain vs risk'), (r'\bstop\b', lambda m: 'exit-if-wrong level'),
          (r'\btarget\b', lambda m: 'take-profit level'), (r'\bentry\b', lambda m: 'buy price'),
          (r'\bzones\b', lambda m: 'areas'), (r'\bzone\b', lambda m: 'area')]


def words(text: str) -> str:
    """Free text in plain words ('2.1% above the W1 demand' -> '2.1% above the weekly buy area')."""
    out = text or ''
    for pat, rep in _WORDS:
        out = re.sub(pat, rep, out)
    out = re.sub(r'\b(buy|sell) area area\b', r'\1 area', out)
    return out.replace('HTF', 'bigger')


def plain(label: str) -> str:
    """A rule label or key in plain words; unknown labels pass through in plain words."""
    lab = (label or '').strip()
    if lab.startswith('dir '):
        return 'trend ' + ('down' if 'SHORT' in lab else 'up' if 'LONG' in lab else 'unclear')
    return PLAIN.get(lab) or words(lab)


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
    """A chart link per card (at most 3, labelled 'Live SYM'), then the bot's own buttons for the same symbols
    (callback_data, handled by the Supabase telegram-bot webhook): one row [Areas SYM] per symbol and one row
    [Chart SYM] (4-timeframe image), then the app. No emoji, at most 3 buttons a row, one or two words each."""
    charts = list(charts)[:MAX_CARDS]
    syms = [c['text'].split(' ', 1)[-1] for c in charts if c.get('text')]
    syms = [x for x in syms if len(f'z:{x}'.encode()) <= 64]
    rows = [charts, [cb(f'Areas {x}', f'z:{x}') for x in syms], [cb(f'Chart {x}', f'c:{x}') for x in syms]]
    return [r for r in rows if r] + [[button(open_label, open_url)]]


def cb(text: str, data: str) -> Dict: return {'text': text, 'callback_data': data}


def _cb_ok(data: str) -> bool: return len(data.encode()) <= 64


def alert_keyboard(charts: Sequence[Dict], open_label: str, open_url: str, remind: bool = True) -> List[List[Dict]]:
    """The instant-alert keyboard, at most 3 rows. One symbol: [Live chart (TradingView)] [Chart (4-quarter image)]
    [Areas] / [Snooze] [Remind me] / [Open app]. Two or three symbols: [Chart SYM] per symbol / [Snooze SYM] per
    symbol / [Remind SYM] per symbol (remind=False: [Open app] instead; bot callbacks: c:SYM chart, m:SYM:7 mute 7
    days, r:SYM:0.2 remind at 0.2%)."""
    charts = list(charts)[:MAX_CARDS]
    syms = [c['text'].split(' ', 1)[-1] for c in charts if c.get('text')]
    syms = [x for x in syms if _cb_ok(f'r:{x}:0.2')]
    if not syms:
        return [r for r in [charts] if r] + [[button(open_label, open_url)]]
    if len(syms) == 1:
        x = syms[0]
        live = [button('Live chart', charts[0]['url'])] if charts[0].get('url') else charts[:1]
        return [live + [cb('Chart', f'c:{x}'), cb('Areas', f'z:{x}')],
                [cb('Snooze', f'm:{x}:7'), cb('Remind me', f'r:{x}:0.2')], [button(open_label, open_url)]]
    last = [cb(f'Remind {x}', f'r:{x}:0.2') for x in syms] if remind else [button(open_label, open_url)]
    return [[cb(f'Chart {x}', f'c:{x}') for x in syms], [cb(f'Snooze {x}', f'm:{x}:7') for x in syms], last]


def kevin_line(s: Dict) -> str:
    """'● Also in the trading plan: Oct 28, hourly buy area 4024–4041' when the scan matched the card to the mentor's
    plan (no mentor names in the alert text)."""
    k = s.get('kevin')
    if not k:
        return ''
    return '● Also in the trading plan: ' + esc(words(str(k)).replace(': ', ', ', 1))


def fired_alert_message(f: Dict, market: str = 'fx', bar_word: str = '') -> 'Msg':
    """ONE calm message for a fired user alert: what happened, the price, the why line, the 4-quarter chart button."""
    al, sym, nd = f['alert'], f['sym'], int(f.get('digits') or 2)
    fmt = lambda v: 'n/a' if v is None else f'{v:,.{nd}f}'  # noqa: E731
    lines = []
    if al['kind'] == 'price':
        what = 'reached your price'
        lines.append(f"● Your alert level {code(fmt(al.get('level')))}")
    else:
        z = f.get('zone') or {}
        where = f"{tf_word(z.get('tf'))} {area(z.get('side'))}".strip()
        what = (f'getting close to {a(where)}' if al.get('pct') and z.get('sec') != 'in' else f'now in {a(where)}')
        if z.get('prox') is not None:
            lo, hi = min(z['prox'], z.get('dist', z['prox'])), max(z['prox'], z.get('dist', z['prox']))
            lines.append(f"{'▲' if z.get('side') == 'demand' else '▼' if z.get('side') == 'supply' else '●'} Area {code(f'{fmt(lo)}–{fmt(hi)}')}")
    lines.append(f"● Price now {code(fmt(f.get('price')))}" + (f' · {esc(bar_word)}' if bar_word else ''))
    if f.get('why'):
        why = words(str(f['why']))
        lines.append(f"Why: {esc(why[:1].upper() + why[1:])}")
    lines.append('● This is the alert you set')
    head = f"{title(sym, f.get('name') or '', 'stock' if market == 'stock' else 'fx')} · {what}"
    kb = [[cb('Chart', f'c:{sym}')]] if _cb_ok(f'c:{sym}') else []
    text = head + '\n' + block(lines) + '\n' + footer('Pepperstone' if market == 'fx' else '')
    return Msg(text, kb)


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


def card(icon: str, sym: str, kind: str, entry: str, target: str, rr, line2: str, tag: str = '', *, stop: str = '',
         long: Optional[bool] = None, name: str = '', market: str = 'fx', phrase: str = '') -> str:
    """One trade card: the plain name + one phrase, then a quote with the plan and the lines of `line2` (HTML, one idea
    per line):
        <b>XPeng</b> (XPEV) · Buy signal
        <blockquote>▲ Buy at <code>8.06</code> · Exit if wrong <code>6.56</code> · Take profit at <code>16.12</code> · Possible gain 5.4× the risk
        Why: ...</blockquote>
    tag = another listing of the symbol ('TSX:RY')."""
    lg = (kind != 'SELL') if long is None else long
    head = f"{title(sym, name, market, tag.strip().strip('()'))} · {esc(phrase or KIND_WORD.get(kind, kind))}"
    plan = plan_line(lg, entry, stop, target, rr)
    lines = ([f'{icon} {plan}'.strip()] if plan else []) + [x for x in (line2 or '').split('\n') if x]
    return head + '\n' + block(lines)


TF_SHORT = {'H1': '1H', 'H4': '4H', 'D1': 'D1', 'W1': 'W1', 'MN': 'MN', '3M': '3M', '6M': '6M'}


def away(pct) -> str:
    """Distance in plain words: '0.4% away, very close' (< 0.5%), '1.9% away, close' (< 2%), '3.3% away'."""
    p = abs(float(pct or 0))
    tag = ', very close' if p < 0.5 else ', close' if p < 2 else ''
    return f'{short_pct(p)} away{tag}'


def short_pct(p) -> str:
    """'1.4%', and '<0.1%' rather than a misleading '0.0%'."""
    p = abs(float(p or 0))
    return '<0.1%' if p < 0.05 else f'{p:.1f}%'


def section(title: str, rows: Sequence[Dict], key: str, n: int = 3, extra=None) -> List[str]:
    """Two short lines: a heading 'Inside a buy area (5)' and the items 'USDNOK monthly · AUDCAD 4-hour · EURGBP
    weekly +2'."""
    if not rows:
        return []
    items = [esc(r[key]) + (f" {esc(tf_word(r['tf']))}" if r.get('tf') else '') + (f' {esc(extra(r))}' if extra else '')
             for r in rows[:n]]
    return [f'<b>{esc(title)}</b> ({len(rows)})', ' · '.join(items) + (f' +{len(rows) - n}' if len(rows) > n else '')]


def names(rows: Sequence[Dict], key: str, n: int = 4, extra=None) -> str:
    """'ALB weekly, BURL monthly, PCG 3-month +12' (the first n by the list order, i.e. zone score). Every name carries
    the timeframe of the area it is near / in / left (owner rule)."""
    shown = [esc(r[key]) + (f" {esc(tf_word(r['tf']))}" if r.get('tf') else '') + (f' {esc(extra(r))}' if extra else '')
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
            cap: int = QUOTE_LINES, foot: Optional[str] = None) -> Msg:
    """Headline lines, a blank line, the cards (blank line between), the collapsed detail, then the italic footer
    (foot=None: footer() with the time now; '' none); the detail is trimmed (from the end) until the message fits
    `limit` UTF-16 units."""
    detail = [x for x in detail if x]
    foot = footer() if foot is None else foot
    while True:
        parts = ['\n'.join(head)] + list(cards)
        q = quote(detail, cap=cap) if len(detail) > 1 else ''.join(f'<i>{x}</i>' for x in detail if x)
        if q:
            parts.append(q)
        text = '\n\n'.join(p for p in parts if p) + (f'\n{foot}' if foot else '')
        if u16(text) <= limit or not detail:
            break
        detail = detail[:-2] + ['+ more in the app'] if len(detail) > 1 else []
    if u16(text) > limit:
        text = _cut(text, limit)
    return Msg(text, buttons)


def flat(card: str) -> str:
    """A card without its quote tags, to sit inside the collapsed detail (Telegram quotes do not nest)."""
    return re.sub(r'</?blockquote[^>]*>', '', card or '')


def visible(m: str) -> str:
    """The part of a message shown before tapping the collapsed quote (for tests and previews; the collapsed quote
    itself shows as one empty line)."""
    return re.sub(r'\n{3,}', '\n\n', re.sub(r'<blockquote expandable>.*?</blockquote>', '', m, flags=re.S))


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
    """'● Big news: US inflation report in 20 min' for the symbol (60 min ahead to 15 min after), '' when nothing (or no NEWS
    loaded)."""
    if not NEWS:
        return ''
    try:
        from news import calendar as NC
        w = NC.warning(symbol, NEWS, market=market)
    except Exception:  # noqa: BLE001
        return ''
    w = re.sub(r'^\W+\s*', '', w or '').strip()       # any leading marker: plain text here
    return f'● Big news: {w}' if w else ''


# ---- the 'why' line under every alert card (both scanners) -----------------------------------------------------------
def trend_words(direction: str) -> str:
    """'LONG - FULL' -> 'the trend is up', 'SHORT - REDUCED' -> 'the trend is down but bouncing for now',
    'WAIT ...' -> 'the trend is unclear'."""
    d = (direction or '').upper()
    base = 'the trend is up' if d.startswith('LONG') else 'the trend is down' if d.startswith('SHORT') else 'the trend is unclear'
    if 'REDUCED' in d:
        base += ' but bouncing for now' if d.startswith('SHORT') else ' but dipping for now'
    return base


def reason_line(s: Dict, score: bool = False) -> str:
    """One plain sentence from what the scanner already computed: where the area sits (the nesting chain), the trend,
    first visit or not, optionally the score: 'Why: a 4-hour buy area inside a monthly buy area, the trend is up, first
    visit to this area.'"""
    ch = [c for c in (s.get('chain') or []) if isinstance(c, dict)]
    side = s.get('side') or (ch[-1].get('side') if ch else '') or 'demand'
    tfw = tf_word(s.get('tf'))
    bits = []
    if len(ch) > 1:
        host = ch[0]
        bits.append(f"{a(tfw)} {area(side)} inside {a(tf_word(host.get('tf')))} {area(host.get('side') or side)}")
    elif s.get('loc') == 'top' or ch:
        bits.append(f'{a(tfw)} {area(side)}, the biggest timeframe checked')
    elif s.get('loc_ok') is False:
        bits.append('no bigger area behind it')
    if s.get('direction'):
        bits.append(trend_words(s['direction']))
    t = s.get('touches')
    if t is not None:
        bits.append('first visit to this area' if t == 0 else ('the price came back here once before' if t == 1 else f'the price came back here {t} times before'))
    if score and s.get('score') is not None:
        bits.append(f"quality score {s['score']}/10")
    return ('Why: ' + ', '.join(bits) + '.') if bits else ''


# ---- stocks ------------------------------------------------------------------------------------------------------------
def stock_card(s: Dict) -> str:
    """'<b>XPeng</b> (XPEV) · Buy signal' + the plan quote (a WATCH: 'watching for a buy' + what it waits for)."""
    kind = s['kind']
    lines = []
    if kind != 'BUY':
        lines.append('● Not yet: ' + ('the price is still far' if s.get('watch') == 'new' else 'wait for the price to confirm first'))
    why = reason_line({**s, 'side': 'demand'}, score=kind == 'BUY')
    if why:
        lines.append(esc(why))
    return card(ICON.get(kind, '●'), s['symbol'], kind, _f(s.get('entry')), _f(s.get('target')), s.get('rr'),
                '\n'.join(lines), s.get('home') or '', stop=_f(s.get('stop')), long=True, name=s.get('name') or '',
                market='stock', phrase='Buy signal' if kind == 'BUY' else 'watching for a buy')


EXIT_WORDS = {'stop': 'the price closed below your exit-if-wrong level', 'demand_broken': 'the buy area under your buy price broke',
              'near_supply': 'the price is near the next sell area', 'in_supply': 'the price is inside a sell area',
              'trail': 'time to raise your exit-if-wrong level', 'trail_broken': 'the area you raised it to broke',
              'trend_change': 'the trend turned down', 'currency': 'your holding is in another currency than this listing'}


def exit_card(e: Dict) -> str:
    """'<b>NVIDIA</b> (NVDA) · check your position' / quote: ▼ the reason, ● the position's prices."""
    reasons = [w['reason'] for w in e['warnings']] if 'warnings' in e else list(e.get('reasons') or [])
    said = [EXIT_WORDS.get(r, words(r)) for r in reasons] or ['check the position']
    pos = [f"Price now {code(_f(e.get('price')))}" if e.get('price') is not None else '',
           f"Bought at {code(_f(e.get('entry')))}" if e.get('entry') is not None else '',
           f"Exit if wrong {code(_f(e.get('stop')))}" if e.get('stop') is not None else '']
    lines = [f'▼ {esc(said[0][:1].upper() + said[0][1:])}'] + [f'● Also: {esc(x)}' for x in said[1:2]]
    if any(pos):
        lines.append('● ' + ' · '.join(x for x in pos if x))
    return f"{title(e['symbol'], e.get('name') or '', 'stock')} · {KIND_WORD['EXIT']}\n{block(lines)}"


def _n(n: int, one: str, many: str) -> str:
    return f'{n} {one if n == 1 else many}'


def headline(nb: int, nw: int, ne: int, sell: Optional[int] = None) -> str:
    """'1 buy signal · 3 watching · nothing to sell' (or 'No new trade ideas')."""
    if not (nb or nw or ne or sell):
        return 'No new trade ideas'
    parts = [_n(nb, 'buy signal', 'buy signals') if nb else '', _n(sell, 'sell signal', 'sell signals') if sell else '',
             f'{nw} watching' if nw else '']
    parts.append('nothing to sell' if not ne else f"{_n(ne, 'holding', 'holdings')} to check")
    return ' · '.join(p for p in parts if p)


SECTION_WORD = {('demand', 'in'): 'Inside a buy area', ('demand', 'near'): 'Close to a buy area',
                ('demand', 'left'): 'Bounced from a buy area', ('supply', 'in'): 'Inside a sell area',
                ('supply', 'near'): 'Close to a sell area', ('supply', 'left'): 'Turned down from a sell area'}
SECTION_ORDER = (('demand', 'near'), ('demand', 'in'), ('demand', 'left'), ('supply', 'near'), ('supply', 'in'), ('supply', 'left'))
KIND_SHORT = {'BUY': 'buy signal', 'SELL': 'sell signal', 'WATCH': 'watching', 'EXIT': 'check'}


def regime_line(res: Dict) -> str:
    rg = res.get('regime') or []
    up = [r['symbol'] for r in rg if r.get('above200')]
    dn = [r['symbol'] for r in rg if r.get('above200') is False]
    if not rg:
        return ''
    bits = [f"{', '.join(up)} above the 200-day average" if up else '', f"{', '.join(dn)} below it" if dn else '']
    return 'Market mood: ' + esc(' · '.join(b for b in bits if b))


def why_line(reasons: Sequence[Dict], n: int = 3) -> str:
    if not reasons:
        return ''
    return 'Why not more: ' + esc(', '.join(f"{plain(r.get('label') or r.get('rule') or '')} ({r['count']})" for r in reasons[:n]))


def also_line(items: Sequence[Dict], key: str, n: int = 5) -> str:
    """'Also: T9 (buy signal, weekly), T19 (watching, monthly) +3' (the ideas that did not get a card)."""
    if not items:
        return ''
    out = []
    for x in items[:n]:
        bits = [KIND_SHORT.get(x.get('kind') or 'EXIT', ''), tf_word(x.get('tf')) if x.get('tf') else '']
        b = ', '.join(esc(y) for y in bits if y)
        out.append(esc(x[key]) + (f' ({b})' if b else ''))
    return 'Also: ' + ', '.join(out) + (f' +{len(items) - n}' if len(items) > n else '')


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
    head = [f"<b>{esc(headline(len(buys), len(watch), len(exits)))}</b>",
            'Stocks' + (f' · {esc(day)}' if day else '')]
    if res.get('fixture'):
        head[1] += ' · sample data'
    if res.get('data_warning'):
        head.append('● ' + esc(words(res['data_warning'])))
    nw = news_warning('SPY', 'stock')                     # US events move every US stock: once, under the headline
    if nw:
        head.append(esc(nw))
    detail = [regime_line(res)]
    for a in (res.get('watch_alerts') or [])[:2]:
        detail.append('Your watchlist: ' + esc(words(a['text'])))
    if rest:
        detail.append(also_line(rest, 'symbol'))
    zl = res.get('zone_lists') or L.zone_lists(res.get('details') or {})
    for side, sec in SECTION_ORDER:
        if sec == 'left':
            continue                     # bounced / turned down: in the app only (keeps the message short)
        rows = (zl.get(side) or {}).get(sec) or []
        extra = (lambda r: short_pct(r.get('pct'))) if sec == 'near' else None
        detail += section(SECTION_WORD[(side, sec)], rows, 's', 3, extra)
    if res.get('scanned'):
        detail.append(f"{res['scanned']} stocks checked")
    charts = [button(f"Live {x['symbol']}", x['chart']) for k, x in picked if k == 'SIG' and x.get('chart')]
    return [compose(head, cards, detail, alert_keyboard(charts, 'Open app', FULL_LIST, remind=False), cap=cap,
                    foot=footer('', when))]


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
            cur = title + ' (continued)\n\n' + c
        else:
            cur = cur + '\n\n' + c
    out.append(cur)
    return out


def _cut(card: str, limit: int) -> str:
    """Cut on a line boundary to fit `limit`; a quote left open is closed (the HTML stays valid)."""
    keep = []
    for line in card.split('\n'):
        if u16('\n'.join(keep + [line])) > limit - 16:
            break
        keep.append(line)
    text = '\n'.join(keep) + '\n…'
    if text.count('<blockquote') > text.count('</blockquote>'):
        text += '</blockquote>'
    return text


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


# ---- on-demand scan of one ticker (the bot's /scan SYM and its live-scan button) ---------------------------------------
def plain_trend(w: str) -> str:
    """The scan's trend words, plain (card.ts plainTrend): 'pullback' -> 'dipping', 'up' -> 'rising' ..."""
    s = (w or '').lower()
    if re.search(r'turning up|changed up', s):
        return 'turning up'
    if re.search(r'turning down|changed down', s):
        return 'turning down'
    if 'pullback' in s:
        return 'dipping'
    if re.search(r'\bup\b', s):
        return 'rising'
    if re.search(r'\bdown\b', s):
        return 'falling'
    if re.search(r'range|side', s):
        return 'sideways'
    return words(s)


def trend_text(pairs: Sequence) -> str:
    """'Trend: weekly rising · monthly dipping · 3-month rising' from (TF, scan word) pairs ('' when none known)."""
    t = ' · '.join(f'{tf_word(tf)} {plain_trend(str(v))}' for tf, v in pairs if v and v != 'n/a')
    return f'Trend: {esc(t)}' if t else ''


def _zone_where(px: float, z: Dict) -> str:
    lo, hi = min(z['proximal'], z['distal']), max(z['proximal'], z['distal'])
    if lo <= px <= hi:
        return 'the price is in it'
    return away(abs(px - z['proximal']) / px * 100) if px else ''


def ondemand_card(det: Optional[Dict], sigs: Sequence[Dict], sym: str, why_missing: str = '') -> Msg:
    """ONE card for an on-demand scan of one ticker (every scanner rule, on the last closed session): its buy /
    watching cards (max 3), the nearest buy area below / in and sell area above with the scanner's verdict, the trend.
    Buttons: the chart link, [Chart] [Areas] (bot callbacks)."""
    if not det:
        return Msg(f'{title(sym, "", "stock")} · on-demand check\n'
                   + block([f'● No result: {esc(words(why_missing or "no daily prices"))}']) + '\n' + footer())
    px = det.get('price') or 0
    when = det.get('date') or ''
    try:
        when = 'at the ' + dt.date.fromisoformat(when).strftime('%a %b %-d') + ' close'
    except ValueError:
        pass
    head = [f"{title(sym, det.get('name') or '', 'stock')} · on-demand check",
            f"Price {code(_f(px))}" + (f' · {esc(when)}' if when else '') + ' · every scanner rule checked']
    cards = [stock_card(s) for s in list(sigs)[:MAX_CARDS]] or ['No buy signal or watch on it right now.']
    zs = det.get('zones') or []
    below = sorted([z for z in zs if z['side'] == 'demand' and min(z['proximal'], z['distal']) <= px], key=lambda z: -z['proximal'])[:2]
    above = sorted([z for z in zs if z['side'] == 'supply' and max(z['proximal'], z['distal']) >= px], key=lambda z: z['proximal'])[:2]
    lines: List[str] = []
    if below or above:
        lines.append('<b>Nearest price areas</b>')
    for z in below + above:
        mk = '▲' if z['side'] == 'demand' else '▼'
        bits = [_zone_where(px, z), 'never tested' if z.get('fresh') else f"used {z.get('touches') or 1}x"]
        br = z.get('br')
        if z['side'] == 'demand' and br:
            bits.append('held back by: ' + plain(L.BLOCK_LABEL.get(br, br)))
        w = f"{tf_word(z['tf'])} {area(z['side'])}"
        lines.append(f"{mk} {esc(w[:1].upper() + w[1:])} {code(_f(z['proximal']) + '–' + _f(z['distal']))} · "
                     f"{esc(' · '.join(b for b in bits if b))}")
    trend = trend_text((('W1', det.get('w1')), ('MN', det.get('mn')), ('3M', det.get('m3'))))
    if trend:
        lines.append(trend)
    lines.append('On-demand check · buy ideas only')
    rows = [[button('Live chart', det['chart'])]] if det.get('chart') else []
    if _cb_ok(f'c:{sym}'):
        rows.append([cb('Chart', f'c:{sym}'), cb('Areas', f'z:{sym}')])
    text = '\n'.join(head) + '\n\n' + '\n\n'.join(cards) + ('\n\n' + block(lines) if lines else '') + '\n' + footer()
    return Msg(_cut(text, SAFE) if u16(text) > SAFE else text, rows)
