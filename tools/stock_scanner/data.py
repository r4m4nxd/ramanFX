"""Daily OHLCV (~10 years) per ticker: Yahoo chart API (split + dividend adjusted via adjclose), Stooq CSV fallback.
Weekly / monthly bars are built from the daily bars. Local cache under tools/stock_scanner/.cache (gitignored).

Network etiquette: one generic User-Agent, a pause between requests, retries with back-off. Nothing personal is ever
sent (no e-mail in any header or URL).
"""
from __future__ import annotations

import csv
import datetime as dt
import io
import json
import os
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, List, Optional, Tuple

from zones import Bar

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get('SCANNER_CACHE', os.path.join(HERE, '.cache'))
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
PAUSE = float(os.environ.get('SCANNER_PAUSE', '0.15'))   # seconds between two requests to the same host (all threads)
_host_lock = threading.Lock()
_host_next: Dict[str, float] = {}


def _wait_turn(url: str) -> None:
    host = urllib.parse.urlsplit(url).netloc
    with _host_lock:
        now = time.time()
        at = max(now, _host_next.get(host, 0.0))
        _host_next[host] = at + PAUSE
    if at > now:
        time.sleep(at - now)


def http_get(url: str, ua: str = UA, retries: int = 3, timeout: int = 25, accept: str = '*/*') -> bytes:
    """GET, rate-limited per host across threads, exponential back-off on 429 / 5xx / network errors."""
    err: Optional[Exception] = None
    for k in range(retries):
        _wait_turn(url)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': ua, 'Accept': accept, 'Accept-Encoding': 'identity'})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            err = e
            if e.code not in (429, 500, 502, 503, 504):
                raise
            ra = e.headers.get('Retry-After') if e.headers else None
            if ra and ra.isdigit():
                time.sleep(min(60, int(ra)))
        except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as e:
            err = e
        if k + 1 < retries:
            time.sleep(2 ** k * 1.5)
    raise err if err else RuntimeError('request failed')


def yahoo_symbol(sym: str) -> str: return sym.replace('.', '-')
def stooq_symbol(sym: str) -> str: return sym.replace('.', '-').lower() + '.us'


def parse_yahoo(raw: bytes) -> Tuple[List[Bar], Dict]:
    js = json.loads(raw)
    res = (js.get('chart') or {}).get('result') or []
    if not res:
        raise ValueError('no chart result')
    r = res[0]
    ts = r.get('timestamp') or []
    q = (r.get('indicators') or {}).get('quote', [{}])[0]
    adj = ((r.get('indicators') or {}).get('adjclose') or [{}])[0].get('adjclose') or [None] * len(ts)
    meta = r.get('meta') or {}
    off = int(meta.get('gmtoffset') or 0)
    bars: List[Bar] = []
    for i, t in enumerate(ts):
        o, h, l, c, v = (q.get(k, [None] * len(ts))[i] for k in ('open', 'high', 'low', 'close', 'volume'))
        if None in (o, h, l, c) or c <= 0:
            continue
        a = adj[i] if i < len(adj) and adj[i] else c
        f = a / c                                                   # split + dividend factor of that day
        d = dt.datetime.fromtimestamp(t + off, dt.timezone.utc).date().isoformat()
        bars.append(Bar(d, o * f, h * f, l * f, a, float(v or 0)))
    return dedupe(bars), {'exchange': meta.get('exchangeName') or meta.get('fullExchangeName') or '',
                          'currency': meta.get('currency') or 'USD', 'price': meta.get('regularMarketPrice'), 'source': 'yahoo'}


def parse_stooq(raw: bytes) -> Tuple[List[Bar], Dict]:
    txt = raw.decode('utf-8', 'replace')
    if not txt.lower().startswith('date'):
        raise ValueError('stooq: no data')
    bars = []
    for row in csv.DictReader(io.StringIO(txt)):
        try:
            bars.append(Bar(row['Date'], float(row['Open']), float(row['High']), float(row['Low']), float(row['Close']), float(row.get('Volume') or 0)))
        except (KeyError, ValueError):
            continue
    cut = (dt.date.today() - dt.timedelta(days=3660)).isoformat()
    return dedupe([b for b in bars if b.d >= cut]), {'exchange': '', 'currency': 'USD', 'source': 'stooq'}


def dedupe(bars: List[Bar]) -> List[Bar]:
    seen: Dict[str, Bar] = {}
    for b in bars:
        seen[b.d] = b
    return [seen[k] for k in sorted(seen)]


def _cache_path(sym: str) -> str: return os.path.join(CACHE, 'daily', f'{sym}.json')


def load_cached(sym: str) -> Optional[Tuple[List[Bar], Dict, float]]:
    p = _cache_path(sym)
    if not os.path.exists(p):
        return None
    with open(p) as f:
        js = json.load(f)
    return [Bar(*b) for b in js['bars']], js.get('meta', {}), js.get('fetched', 0)


def save_cached(sym: str, bars: List[Bar], meta: Dict) -> None:
    os.makedirs(os.path.dirname(_cache_path(sym)), exist_ok=True)
    with open(_cache_path(sym), 'w') as f:
        json.dump({'fetched': time.time(), 'meta': meta, 'bars': [[b.d, round(b.o, 4), round(b.h, 4), round(b.l, 4), round(b.c, 4), b.v] for b in bars]}, f)


def yahoo_url(sym: str, rng: str = '10y') -> str:
    return (f'https://query1.finance.yahoo.com/v8/finance/chart/{yahoo_symbol(sym)}?range={rng}&interval=1d'
            '&includeAdjustedClose=true&events=div%2Csplit')


def merge_update(old: List[Bar], new: List[Bar], tol: float = 0.002) -> Optional[List[Bar]]:
    """Append a short update to the cached history. None when the overlap disagrees (a split / dividend changed
    the adjustment of the whole history) or does not connect: then the full 10 years are fetched again."""
    if not old or not new:
        return None
    by = {b.d: b for b in old}
    common = [b for b in new if b.d in by]
    if not common:
        return None
    for b in common[:-1]:                                       # the newest common bar may have been intraday
        o = by[b.d]
        if abs(o.c - b.c) > tol * max(abs(o.c), 1e-9):
            return None
    return dedupe(old + new)


def fetch_daily(sym: str, max_age_h: float = 12.0, offline: bool = False) -> Tuple[List[Bar], Dict]:
    """10y daily bars for one ticker: a fresh cache as is; a stale cache updated with the last month (Yahoo);
    else the full 10 years from Yahoo, else Stooq, else the stale cache."""
    cached = load_cached(sym)
    if cached and (offline or time.time() - cached[2] < max_age_h * 3600):
        return cached[0], cached[1]
    if offline:
        raise FileNotFoundError(f'{sym}: not cached (offline)')
    errs = []
    if cached and cached[1].get('source') == 'yahoo':
        try:
            new, meta = parse_yahoo(http_get(yahoo_url(sym, '1mo')))
            merged = merge_update(cached[0], new)
            if merged:
                meta = {**cached[1], **{k: v for k, v in meta.items() if v}}
                cut = (dt.date.fromisoformat(merged[-1].d) - dt.timedelta(days=3660)).isoformat()
                merged = [b for b in merged if b.d >= cut]
                save_cached(sym, merged, meta)
                return merged, meta
        except Exception as e:  # noqa: BLE001 - fall back to a full download
            errs.append(f'update: {e}')
    for name, url, parse in (
        ('yahoo', yahoo_url(sym), parse_yahoo),
        ('stooq', f'https://stooq.com/q/d/l/?s={stooq_symbol(sym)}&i=d', parse_stooq),
    ):
        try:
            bars, meta = parse(http_get(url))
            if len(bars) < 60:
                raise ValueError('too few bars')
            if cached and not meta.get('exchange'):
                meta['exchange'] = cached[1].get('exchange', '')
            save_cached(sym, bars, meta)
            return bars, meta
        except Exception as e:  # noqa: BLE001 - try the next source
            errs.append(f'{name}: {e}')
    if cached:
        return cached[0], {**cached[1], 'stale': True}
    raise RuntimeError(f'{sym}: ' + '; '.join(errs))


def fetch_many(symbols: List[str], workers: int = 6, offline: bool = False, log=None) -> Dict[str, Tuple[List[Bar], Dict]]:
    """Daily bars for many tickers with a small thread pool (requests stay rate-limited per host)."""
    from concurrent.futures import ThreadPoolExecutor, as_completed
    out: Dict[str, Tuple[List[Bar], Dict]] = {}
    errors: Dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
        futs = {ex.submit(fetch_daily, s, 12.0, offline): s for s in symbols}
        for k, f in enumerate(as_completed(futs)):
            s = futs[f]
            try:
                out[s] = f.result()
            except Exception as e:  # noqa: BLE001
                errors[s] = str(e)[:200]
            if log and (k + 1) % 200 == 0:
                log(f'data {k + 1}/{len(symbols)}')
    out['__errors__'] = errors  # type: ignore[assignment]
    return out


def liquidity(bars: List[Bar], days: int = 20) -> Tuple[float, float]:
    """(last close, average dollar volume of the last `days` sessions)."""
    if not bars:
        return 0.0, 0.0
    last = bars[-days:]
    return bars[-1].c, sum(b.c * b.v for b in last) / len(last)


def fetch_earnings(sym: str) -> Optional[str]:
    """Next earnings date (ISO) from Yahoo quoteSummary calendarEvents, best effort (Yahoo may demand a cookie /
    crumb; then this returns None and the rule shows '? unknown'). Owner overrides: tools/stock_scanner/earnings.csv
    with rows symbol,date."""
    override = os.path.join(HERE, 'earnings.csv')
    if os.path.exists(override):
        with open(override) as f:
            for row in csv.reader(f):
                if len(row) >= 2 and row[0].strip().upper() == sym.upper():
                    return row[1].strip()
    try:
        raw = http_get(f'https://query2.finance.yahoo.com/v10/finance/quoteSummary/{yahoo_symbol(sym)}?modules=calendarEvents', retries=1)
        js = json.loads(raw)
        ev = js['quoteSummary']['result'][0]['calendarEvents']['earnings']['earningsDate']
        if ev:
            return dt.datetime.fromtimestamp(ev[0]["raw"], dt.timezone.utc).date().isoformat()
    except Exception:  # noqa: BLE001
        return None
    return None


# ---- weekly / monthly bars --------------------------------------------------------------------------------------
def _next_business_day(d: dt.date) -> dt.date:
    n = d + dt.timedelta(days=1)
    while n.weekday() >= 5:
        n += dt.timedelta(days=1)
    return n


def aggregate(bars: List[Bar], tf: str) -> Tuple[List[Bar], bool]:
    """Weekly (ISO week) or monthly bars. Returns (bars, last_complete): the newest bucket is complete when the next
    business day after the last daily bar starts a new bucket (holidays aside)."""
    key = (lambda d: d.isocalendar()[:2]) if tf == 'W1' else (lambda d: (d.year, d.month))
    out: List[Bar] = []
    cur = None
    for b in bars:
        k = key(dt.date.fromisoformat(b.d))
        if cur is None or k != cur[0]:
            if cur is not None:
                out.append(cur[1])
            cur = (k, Bar(b.d, b.o, b.h, b.l, b.c, b.v))
        else:
            x = cur[1]
            x.h, x.l, x.c, x.v = max(x.h, b.h), min(x.l, b.l), b.c, x.v + b.v
    if cur is not None:
        out.append(cur[1])
    complete = False
    if bars:
        last = dt.date.fromisoformat(bars[-1].d)
        complete = key(_next_business_day(last)) != key(last)
    return out, complete


def closed_htf(bars: List[Bar], tf: str) -> List[Bar]:
    """Closed weekly / monthly bars only (the forming bucket is dropped; the rules read closed bars)."""
    agg, complete = aggregate(bars, tf)
    return agg if complete else agg[:-1]


TV_EXCHANGE = {'NMS': 'NASDAQ', 'NGM': 'NASDAQ', 'NCM': 'NASDAQ', 'NasdaqGS': 'NASDAQ', 'NasdaqGM': 'NASDAQ', 'NasdaqCM': 'NASDAQ',
               'NYQ': 'NYSE', 'NYSE': 'NYSE', 'ASE': 'AMEX', 'PCX': 'AMEX', 'NYSEArca': 'AMEX', 'BTS': 'CBOE'}


def tradingview_url(sym: str, exchange: str = '') -> str:
    ex = TV_EXCHANGE.get(exchange, '')
    return f"https://www.tradingview.com/chart/?symbol={ex + ':' if ex else ''}{sym}"
