"""Market news headlines for the scheduled Telegram messages (the Python twin of the bot's
supabase/functions/telegram-bot/headlines.ts; the keyword table is shared through headline_terms.json).

Sources (free, no new keys):
    Alpaca News API (Benzinga, real time, tagged per symbol: stocks, ETFs, crypto as BTCUSD) with ALPACA_KEY_ID /
    ALPACA_SECRET_KEY: GET https://data.alpaca.markets/v1beta1/news?symbols=..&limit=50&sort=desc
    RSS: investingLive news, Investing.com forex / economic indicators / stock market, CNBC top news, CoinDesk.
Feed text is UNTRUSTED: tags stripped, entities decoded, clipped, escaped by the formatters; only http(s) links kept.

    pool(get_text)                       -> [Headline]   every RSS feed (one fetch per process, 5 min cache)
    alpaca(symbols, get_json)            -> [Headline]   [] without keys / on error
    top(items, now, n=5)                 -> the n most market-moving headlines of the last hours (deduped)
    for_symbol(items, sym, now, n, hours) / latest_for(items, sym, now, hours=24)
    line_for(h, now) / ago(t, now)       -> Telegram HTML pieces

Headline = dict(id, t (aware UTC datetime), title, summary, url, source, syms). Never raises on network errors.
Import as `from news import headlines` with tools/ on sys.path.
"""
from __future__ import annotations

import datetime as dt
import email.utils
import html
import json
import os
import re
import time
import urllib.parse
import urllib.request
from typing import Callable, Dict, List, Optional, Sequence

UTC = dt.timezone.utc
HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HERE, 'headline_terms.json')) as _f:
    TERMS: Dict[str, List[str]] = json.load(_f)['terms']

ALPACA_NEWS = 'https://data.alpaca.markets/v1beta1/news'
FEEDS = [
    ('https://investinglive.com/feed/news/', 'investingLive'),
    ('https://www.investing.com/rss/news_1.rss', 'Investing.com'),
    ('https://www.investing.com/rss/news_95.rss', 'Investing.com'),
    ('https://www.investing.com/rss/news_25.rss', 'Investing.com'),
    ('https://www.cnbc.com/id/100003114/device/rss/rss.html', 'CNBC'),
    ('https://www.coindesk.com/arc/outboundfeeds/rss/', 'CoinDesk'),
]
UA = 'Mozilla/5.0 (compatible; RamanFX-bot/1.0)'
TTL = 300


# ---- text hygiene ------------------------------------------------------------------------------------------------
def clip(s: str, n: int) -> str:
    if len(s) <= n:
        return s
    cut = s[:n - 1]
    sp = cut.rfind(' ')
    return (cut[:sp] if sp > n * 0.6 else cut).rstrip(' ,;:.–—-') + '…'


_SCRIPT = re.compile(r'<(script|style)[\s\S]*?</\1>', re.I)
_TAG = re.compile(r'<[^>]*>')


def plain(s, n: int = 300) -> str:
    t = re.sub(r'<!\[CDATA\[([\s\S]*?)\]\]>', r'\1', str(s or ''))
    t = _TAG.sub(' ', _SCRIPT.sub(' ', t))
    t = html.unescape(t)
    t = _TAG.sub(' ', _SCRIPT.sub(' ', t))
    t = re.sub(r'[\x00-\x1f\x7f​-‏  ]', ' ', t)
    return clip(re.sub(r'\s+', ' ', t).strip(), n)


def first_sentence(s: str, title: str = '', n: int = 140) -> str:
    t = s.strip()
    if not t:
        return ''
    m = re.match(r'^(.{25,}?[.!?])(\s|$)', t)
    one = clip(m.group(1) if m else t, n)
    k = lambda x: re.sub(r'[^a-z0-9]+', '', x.lower())  # noqa: E731
    return '' if title and k(one).startswith(k(title)[:40]) else one


def safe_url(u) -> str:
    s = str(u or '').strip()
    return s if re.match(r'^https?://[^\s"\'<>]{3,500}$', s, re.I) else ''


def esc(s) -> str:
    return html.escape(str(s), quote=False)


# ---- parsing -----------------------------------------------------------------------------------------------------
def _tag(item: str, name: str) -> str:
    m = re.search(rf'<{name}(?:\s[^>]*)?>([\s\S]*?)</{name}>', item, re.I)
    return m.group(1) if m else ''


def parse_date(s: str) -> Optional[dt.datetime]:
    t = s.strip()
    m = re.match(r'^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)$', t)
    if m:                                             # Investing.com: UTC without a zone
        try:
            return dt.datetime.fromisoformat(f'{m.group(1)}T{m.group(2)}').replace(tzinfo=UTC)
        except ValueError:
            return None
    try:
        d = email.utils.parsedate_to_datetime(t)
    except (TypeError, ValueError, IndexError):
        d = None
    if d is None:
        try:
            d = dt.datetime.fromisoformat(t.replace('Z', '+00:00'))
        except ValueError:
            return None
    return (d if d.tzinfo else d.replace(tzinfo=UTC)).astimezone(UTC)


def parse_rss(xml, source: str) -> List[Dict]:
    if not isinstance(xml, str) or not re.search(r'<(rss|feed|channel)[\s>]', xml, re.I):
        return []
    out = []
    for chunk in re.split(r'<item[\s>]|<entry[\s>]', xml, flags=re.I)[1:61]:
        item = re.split(r'</item>|</entry>', chunk, flags=re.I)[0]
        title = plain(_tag(item, 'title'), 220)
        t = parse_date(plain(_tag(item, 'pubDate') or _tag(item, 'dc:date') or _tag(item, 'published') or _tag(item, 'updated'), 60))
        if not title or t is None:
            continue
        link = plain(_tag(item, 'link'), 600)
        if not safe_url(link):
            g = plain(_tag(item, 'guid'), 600)
            link = g if safe_url(g) else link
        url = safe_url(html.unescape(link))
        summary = first_sentence(plain(_tag(item, 'description') or _tag(item, 'summary'), 600), title)
        out.append({'id': f'{source}:{url or title}', 't': t, 'title': title, 'summary': summary, 'url': url,
                    'source': source, 'syms': []})
    return out


def parse_alpaca(js) -> List[Dict]:
    arr = js.get('news') if isinstance(js, dict) else None
    out = []
    for n in arr if isinstance(arr, list) else []:
        if not isinstance(n, dict):
            continue
        title = plain(n.get('headline'), 220)
        t = parse_date(str(n.get('created_at') or n.get('updated_at') or ''))
        if not title or t is None:
            continue
        syms = [re.sub(r'[^A-Z0-9.]', '', str(s).upper()) for s in (n.get('symbols') or [])][:30]
        src = plain(n.get('source'), 30)
        out.append({'id': f"alpaca:{str(n.get('id') or title)[:40]}", 't': t, 'title': title,
                    'summary': first_sentence(plain(n.get('summary'), 600), title), 'url': safe_url(n.get('url')),
                    'source': 'Benzinga' if not src or 'benzinga' in src.lower() else src[:1].upper() + src[1:],
                    'syms': [s for s in syms if s]})
    return out


# ---- symbols -> keywords (same rules as headlines.ts symMap) -------------------------------------------------------
CFD = {'COPPER': (['XCU'], []), 'NATGAS': (['NATGAS'], ['UNG']), 'SPOTBRENT': (['OIL'], ['BNO']), 'SPOTCRUDE': (['OIL'], ['USO']),
       'CORN': (['CORN'], []), 'WHEAT': (['WHEAT'], []), 'SOYBEANS': (['SOYBEANS'], []), 'SUGAR': (['SUGAR'], []),
       'USDX': (['USD'], ['UUP']), 'EURX': (['EUR'], []), 'JPYX': (['JPY'], []),
       'US30': (['US30'], ['DIA']), 'US500': (['US500'], ['SPY']), 'NAS100': (['NAS100'], ['QQQ']), 'US2000': (['US2000'], ['IWM']),
       'GER40': (['GER40', 'EUR'], []), 'UK100': (['UK100', 'GBP'], []), 'JPN225': (['JPN225', 'JPY'], []), 'HK50': (['HK50'], []),
       'CHINAH': (['CHINAH'], []), 'CN50': (['CN50', 'CNH'], []), 'AUS200': (['AUS200', 'AUD'], []), 'FRA40': (['FRA40'], []),
       'EUSTX50': (['EUSTX50', 'EUR'], []), 'SPA35': (['SPA35'], []), 'NETH25': (['NETH25'], []), 'SWI20': (['SWI20', 'CHF'], [])}
METAL_TAG = {'XAU': 'GLD', 'XAG': 'SLV', 'XPT': 'PPLT', 'XPD': 'PALL'}
CRYPTO = {'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'BNB', 'DOT', 'LTC', 'BCH', 'UNI', 'XLM', 'XTZ'}
ALIAS = {'CNY': 'CNH'}


def clean_sym(s) -> str:
    return re.sub(r'[^A-Z0-9.]', '', str(s or '').upper())[:20]


def sym_map(sym: str) -> Dict:
    s = clean_sym(sym)
    names = [re.compile(rf'\b{re.escape(s)}\b', re.I)]
    if s in CFD:
        k, tags = CFD[s]
        return {'kind': 'cfd', 'main': k[:1], 'side': k[1:], 'tags': tags, 'names': names}
    m = re.match(r'^([A-Z]{3,4})([A-Z]{3})$', s)
    if m:
        b, q = ALIAS.get(m.group(1), m.group(1)), ALIAS.get(m.group(2), m.group(2))
        pair = re.compile(rf'\b{m.group(1)}\s?/?\s?{m.group(2)}\b', re.I)
        if b in METAL_TAG:
            return {'kind': 'metal', 'main': [b], 'side': [q] if q in TERMS else [],
                    'tags': [METAL_TAG[b]] if q == 'USD' else [], 'names': [pair]}
        if b in TERMS and q in TERMS and len(b) == 3 and b not in CRYPTO:
            return {'kind': 'fx', 'main': [b], 'side': [q], 'tags': [], 'names': [pair]}
        if b in TERMS and q == 'USD':
            return {'kind': 'crypto', 'main': [b], 'side': [], 'tags': [f'{m.group(1)}USD'], 'names': [pair]}
    return {'kind': 'stock', 'main': [], 'side': [], 'tags': [s] if re.match(r'^[A-Z][A-Z0-9.]{0,9}$', s) else [], 'names': names}


_GRE: Dict[str, re.Pattern] = {}


def _group(g: str) -> re.Pattern:
    if g not in _GRE:
        alt = '|'.join(re.escape(t).replace(r'\ ', r'\s+') for t in TERMS.get(g, []))
        _GRE[g] = re.compile(rf'(?:^|[^a-z0-9&])(?:{alt})(?![a-z0-9])', re.I)
    return _GRE[g]


def relevance(h: Dict, m: Dict) -> float:
    if m['tags'] and any(s in m['tags'] for s in h['syms']) and len(h['syms']) <= 6:
        return 3
    if any(r.search(h['title']) for r in m['names']):
        return 3
    if m['kind'] == 'stock':
        return 0
    text = f"{h['title']} {h['summary']}"
    if any(_group(g).search(h['title']) for g in m['main']):
        return 2.5
    if any(_group(g).search(text) for g in m['main']):
        return 2
    if any(_group(g).search(h['title']) for g in m['side']):
        return 1
    return 0


# ---- ranking -----------------------------------------------------------------------------------------------------
MACRO = re.compile(r'\b(fed|fomc|powell|rate (cut|hike|decision)|cuts? rates|hikes? rates|holds? rates|interest rates?|cpi|inflation|pce|gdp|payrolls|nonfarm|nfp|jobs report|unemployment|ecb|lagarde|boj|bank of japan|boe|bank of england|rba|boc|bank of canada|snb|rbnz|pboc|tariffs?|trade war|treasury yields|recession|opec\+?|sanctions?|shutdown|default|stimulus|intervention|war|ceasefire|election)\b', re.I)
MARKET = re.compile(r'\b(stocks?|s&p|nasdaq|dow|wall street|dollar|yen|euro|sterling|pound|gold|silver|oil|crude|bitcoin|ether(eum)?|crypto|yields?|bonds?|earnings|guidance|forecast|record|plunge[sd]?|surge[sd]?|soar(s|ed)?|tumble[sd]?|crash(es|ed)?|rall(y|ies|ied)|slump(s|ed)?|sell-?off|rout|jumps?|slides?|sinks?|spikes?)\b', re.I)
MEGA = re.compile(r'\b(apple|microsoft|nvidia|alphabet|google|amazon|meta|tesla|broadcom|berkshire|jpmorgan|openai|netflix)\b', re.I)
MEGA_TAGS = {'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA', 'AVGO', 'BRK.B', 'JPM', 'NFLX', 'SPY', 'QQQ'}
NOISE = re.compile(r"(price prediction|should you buy|stocks? to (watch|buy)|analyst ratings?|options? activity|unusual options|whale|short interest|price target|insider (buy|sell)|here'?s why|what'?s going on|top (gainers|losers|movers)|mid-?day movers|pre-?market movers|shares are trading|these \d+ stocks|stocks moving|earnings preview|ratings? (update|change)|\bETF\b.*\b(inflows|outflows)\b|sponsored|podcast|webinar|newsletter|quiz|how to|explained|\bvs\.? \d|cramer)", re.I)
SRC_W = {'investingLive': 1.2, 'Investing.com': 1, 'CNBC': 1, 'CoinDesk': 0.4, 'Benzinga': 0}


def importance(h: Dict, now: dt.datetime) -> float:
    s = SRC_W.get(h['source'], 0.5)
    if MACRO.search(h['title']):
        s += 3
    if MARKET.search(h['title']):
        s += 1.5
    if MEGA.search(h['title']) or any(x in MEGA_TAGS for x in h['syms']):
        s += 1.5
    if NOISE.search(h['title']):
        s -= 4
    if len(h['syms']) > 6:
        s -= 1.5
    if len(h['title']) < 25:
        s -= 1
    return s - max(0.0, (now - h['t']).total_seconds() / 3600) * 0.35


def _words(t: str) -> set:
    return {w for w in re.sub(r'[^a-z0-9% ]+', ' ', t.lower()).split() if len(w) > 2}


def similar(a: str, b: str) -> bool:
    A, B = _words(a), _words(b)
    return bool(A and B) and len(A & B) / min(len(A), len(B)) >= 0.6


def dedupe(items: Sequence[Dict]) -> List[Dict]:
    out, ids = [], set()
    for h in items:
        if h['id'] in ids or any(similar(o['title'], h['title']) for o in out):
            continue
        ids.add(h['id'])
        out.append(h)
    return out


def _fresh(items, now, hours):
    return [h for h in items if h['t'] <= now + dt.timedelta(minutes=10) and (now - h['t']).total_seconds() <= hours * 3600]


def top(items: Sequence[Dict], now: dt.datetime, n: int = 5, hours: float = 6) -> List[Dict]:
    pool_ = _fresh(items, now, hours)
    if len(pool_) < n * 2:
        pool_ = _fresh(items, now, max(hours, 18))
    ranked = dedupe([h for s, h in sorted(((importance(h, now), h) for h in pool_), key=lambda x: -x[0]) if s > 0.5])
    per: Dict[str, int] = {}
    out = []
    for h in ranked:
        if per.get(h['source'], 0) >= 3:
            continue
        per[h['source']] = per.get(h['source'], 0) + 1
        out.append(h)
        if len(out) >= n:
            break
    return out


def for_symbol(items: Sequence[Dict], sym: str, now: dt.datetime, n: int = 6, hours: float = 72) -> List[Dict]:
    m = sym_map(sym)
    scored = [(relevance(h, m), h) for h in _fresh(items, now, hours)]
    scored = [x for x in scored if x[0] > 0]
    strong = sorted([x for x in scored if x[0] >= 2], key=lambda x: x[1]['t'], reverse=True)
    weak = [] if len(strong) >= 3 else sorted([x for x in scored if x[0] < 2], key=lambda x: x[1]['t'], reverse=True)
    merged = [h for _, h in strong + weak if m['kind'] == 'stock' or not NOISE.search(h['title'])]
    return dedupe(merged)[:n]


def latest_for(items: Sequence[Dict], sym: str, now: dt.datetime, hours: float = 24) -> Optional[Dict]:
    m = sym_map(sym)
    hit = [h for h in for_symbol(items, sym, now, 1, hours) if relevance(h, m) >= 2]
    return hit[0] if hit else None


# ---- formatting --------------------------------------------------------------------------------------------------
def ago(t: dt.datetime, now: dt.datetime) -> str:
    m = max(0, round((now - t).total_seconds() / 60))
    if m < 1:
        return 'just now'
    if m < 60:
        return f'{m}m ago'
    return f'{m // 60}h ago' if m < 1440 else f'{m // 1440}d ago'


def linked(h: Dict, n: int = 140) -> str:
    t = esc(clip(h['title'], n))
    return f'<a href="{html.escape(h["url"], quote=True)}">{t}</a>' if h.get('url') else t


def line_for(h: Dict, now: dt.datetime, n: int = 110, source: bool = True) -> str:
    """'<a href>Title</a> · 2h ago · CNBC' (escaped)."""
    return f"{linked(h, n)} · {esc(ago(h['t'], now))}" + (f" · {esc(h['source'])}" if source else '')


# ---- network -----------------------------------------------------------------------------------------------------
def get_text(url: str, headers: Dict[str, str], timeout: float = 10.0) -> Optional[str]:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': UA, **headers})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read(600_000).decode('utf-8', 'replace')
    except Exception:  # noqa: BLE001
        return None


_POOL: Dict[str, object] = {}


def pool(fetch: Callable[[str, Dict[str, str]], Optional[str]] = get_text, log=print) -> List[Dict]:
    """Every RSS feed's items (cached TTL in this process)."""
    if _POOL.get('t') and time.time() - _POOL['t'] < TTL:  # type: ignore[operator]
        return list(_POOL['v'])  # type: ignore[arg-type]
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(len(FEEDS)) as ex:
        got = list(ex.map(lambda f: parse_rss(fetch(f[0], {'Accept': 'application/rss+xml, application/xml, text/xml'}), f[1]), FEEDS))
    out = [h for g in got for h in g]
    bad = [src for (_, src), g in zip(FEEDS, got) if not g]
    if log:
        log(f'headlines: {len(out)} RSS items' + (f' (no items from {", ".join(sorted(set(bad)))})' if bad else ''))
    _POOL.update(t=time.time(), v=out)
    return out


def alpaca(symbols: Sequence[str] = (), fetch: Callable[[str, Dict[str, str]], Optional[str]] = get_text,
           log=print, limit: int = 50, start: Optional[dt.datetime] = None) -> List[Dict]:
    kid, sec = (os.environ.get('ALPACA_KEY_ID') or '').strip(), (os.environ.get('ALPACA_SECRET_KEY') or '').strip()
    if not kid or not sec:
        if log:
            log('headlines: no Alpaca keys, Alpaca news skipped')
        return []
    q = {'limit': str(limit), 'sort': 'desc', 'include_content': 'false', 'exclude_contentless': 'true'}
    if symbols:
        q['symbols'] = ','.join(sorted(set(symbols)))
    if start:
        q['start'] = start.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')
    raw = fetch(f'{ALPACA_NEWS}?{urllib.parse.urlencode(q)}', {'APCA-API-KEY-ID': kid, 'APCA-API-SECRET-KEY': sec,
                                                                 'Accept': 'application/json'})
    try:
        items = parse_alpaca(json.loads(raw)) if raw else []
    except ValueError:
        items = []
    if log:
        log(f'headlines: {len(items)} Alpaca items' + ('' if raw else ' (request failed)'))
    return items


def tags_for(syms: Sequence[str]) -> List[str]:
    return sorted({t for s in syms for t in sym_map(s)['tags']})
