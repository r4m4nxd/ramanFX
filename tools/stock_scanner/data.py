"""Daily OHLCV (~10 years) per ticker. Primary source: Alpaca Market Data (official API, free account; keys from env
ALPACA_KEY_ID / ALPACA_SECRET_KEY; multi-symbol historical bars, split + dividend adjusted). Fallbacks (they may
work locally but not from CI runners): Yahoo chart API (adjusted via adjclose), then Stooq CSV.
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
HOST_PAUSE = {'data.sec.gov': 0.2, 'www.sec.gov': 0.2,   # SEC allows 10 req/s; we stay near 5/s
              'data.alpaca.markets': 0.31, 'paper-api.alpaca.markets': 0.31}  # Alpaca: 200 req/min per account
TIMEOUT = min(15.0, float(os.environ.get('SCANNER_TIMEOUT', '15')))           # per request, seconds (never above 15)
BREAKER_N = int(os.environ.get('SCANNER_BREAKER_N', '5'))                      # consecutive failures that open a host
BREAKER_COOLDOWN = float(os.environ.get('SCANNER_BREAKER_COOLDOWN', '300'))    # seconds an open host is skipped
BREAKER_CODES = (401, 403, 429, 500, 502, 503, 504)
BACKOFF = 1.5                                                                   # first retry pause, seconds
MAX_RETRY_AFTER = 5                                                             # longer Retry-After: fail the call
_host_lock = threading.Lock()
_host_next: Dict[str, float] = {}
_host_fail: Dict[str, int] = {}
_host_open_until: Dict[str, float] = {}
_deadline: Optional[float] = None


class BudgetExceeded(RuntimeError):
    """The run's time budget is spent: no new network request is started."""


class HostDown(RuntimeError):
    """The host's circuit breaker is open (too many consecutive 401 / 403 / 429 / 5xx / timeouts / wrong bodies)."""


class BadBody(ValueError):
    """HTTP 200 but not the expected payload (e.g. an HTML rate-limit page instead of CSV / JSON)."""


# ---- global time budget -------------------------------------------------------------------------------------------
def set_budget(minutes: Optional[float]) -> None:
    """No network request starts later than `minutes` from now (None / <= 0: no budget)."""
    global _deadline
    _deadline = time.time() + minutes * 60 if minutes and minutes > 0 else None


def time_left() -> float:
    return float('inf') if _deadline is None else _deadline - time.time()


def over_budget() -> bool: return time_left() <= 0


# ---- per-host circuit breaker ---------------------------------------------------------------------------------------
def _host(url: str) -> str: return urllib.parse.urlsplit(url).netloc if '://' in url else url


def host_open(url: str) -> bool:
    """True while the host's breaker is open. After the cooldown calls go through again; one more failure re-opens
    it at once (the count is still >= BREAKER_N), a success closes it."""
    h = _host(url)
    with _host_lock:
        return _host_fail.get(h, 0) >= BREAKER_N and time.time() < _host_open_until.get(h, 0.0)


def report_bad(url: str, trip: bool = False) -> None:
    """One more consecutive failure for the host of `url`; trip=True opens its breaker at once."""
    h = _host(url)
    opened = False
    with _host_lock:
        n = max(_host_fail.get(h, 0) + 1, BREAKER_N if trip else 0)
        _host_fail[h] = n
        if n >= BREAKER_N:
            opened = time.time() >= _host_open_until.get(h, 0.0)
            _host_open_until[h] = time.time() + BREAKER_COOLDOWN
    if opened:
        import sys
        print(f'circuit breaker OPEN: {h} after {n} consecutive failures, skipped for {BREAKER_COOLDOWN:.0f}s', file=sys.stderr)


def report_ok(url: str) -> None:
    with _host_lock:
        _host_fail[_host(url)] = 0


def breaker_state() -> Dict[str, int]:
    """{host: consecutive failures} for every host that is failing right now."""
    with _host_lock:
        return {h: n for h, n in _host_fail.items() if n}


def reset_net_state() -> None:
    """Forget breakers, the budget and the request schedule (tests)."""
    global _deadline
    with _host_lock:
        _host_fail.clear()
        _host_open_until.clear()
        _host_next.clear()
    _deadline = None
    reset_alpaca_state()


def _wait_turn(url: str) -> None:
    host = _host(url)
    with _host_lock:
        now = time.time()
        at = max(now, _host_next.get(host, 0.0))
        _host_next[host] = at + HOST_PAUSE.get(host, PAUSE)
    if at > now:
        time.sleep(at - now)


def _sleep_capped(s: float) -> None:
    left = time_left()
    if left <= 0:
        raise BudgetExceeded('time budget spent')
    time.sleep(max(0.0, min(s, left)))


def looks_json(b: bytes) -> bool: return b.lstrip()[:1] in (b'{', b'[')
def looks_stooq(b: bytes) -> bool: return b[:4].lower() == b'date' or b.strip()[:7].lower() == b'no data'


def _retry_wait(e: urllib.error.HTTPError, k: int) -> float:
    """Seconds to wait before retrying a 429 / 5xx: Retry-After, else X-RateLimit-Reset (epoch seconds, Alpaca), else
    exponential back-off."""
    h = e.headers if e.headers else {}
    ra = h.get('Retry-After')
    if ra and ra.strip().isdigit():
        return int(ra)
    rs = h.get('X-RateLimit-Reset') or h.get('X-Ratelimit-Reset')
    if rs and rs.strip().isdigit() and int(rs) > 1e9:
        return max(1.0, int(rs) - time.time())
    return BACKOFF * 2 ** k


def http_get(url: str, ua: str = UA, retries: int = 2, timeout: Optional[float] = None, accept: str = '*/*',
             expect=None, headers: Optional[Dict[str, str]] = None, max_retry_after: Optional[float] = None) -> bytes:
    """GET, rate-limited per host across threads, failing fast: nothing starts once the time budget is spent or while
    the host's breaker is open; 401 / 403 are not retried; 429 / 5xx / network errors get one short retry (a
    Retry-After above MAX_RETRY_AFTER (or `max_retry_after`) seconds is not waited for: the call fails at once).
    `headers` are extra request headers (API keys: never logged). `expect(body) -> bool` rejects wrong payloads (BadBody). Each final failure (and each
    rejected body) counts towards the host's breaker; a good answer, or a 404, resets it."""
    timeout = min(timeout or TIMEOUT, TIMEOUT)
    err: Optional[Exception] = None
    for k in range(max(1, retries)):
        if over_budget():
            raise BudgetExceeded('time budget spent')
        if host_open(url):
            raise HostDown(f'{_host(url)}: circuit breaker open')
        _wait_turn(url)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': ua, 'Accept': accept, 'Accept-Encoding': 'identity',
                                                       **(headers or {})})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                body = r.read()
        except urllib.error.HTTPError as e:
            err = e
            if e.code not in BREAKER_CODES:
                report_ok(url)              # e.g. 404 for an unknown ticker: the host itself answers
                raise
            if e.code in (401, 403):
                report_bad(url)
                raise
            wait = _retry_wait(e, k)
            if wait > (MAX_RETRY_AFTER if max_retry_after is None else max_retry_after):
                # "come back in a minute": give up on this call, let the breaker count it
                break
            if k + 1 < retries:
                _sleep_capped(wait)
            continue
        except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as e:
            err = e
            if k + 1 < retries:
                _sleep_capped(BACKOFF * 2 ** k)
            continue
        if expect is not None and not expect(body):
            report_bad(url)
            raise BadBody(f'{_host(url)}: unexpected body {body[:40]!r}')
        report_ok(url)
        return body
    report_bad(url)
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


# ---- Alpaca Market Data (primary) ------------------------------------------------------------------------------------
ALPACA_BARS = 'https://data.alpaca.markets/v2/stocks/bars'
ALPACA_ASSETS = 'https://paper-api.alpaca.markets/v2/assets?status=active&asset_class=us_equity'
ALPACA_BATCH_COLD = int(os.environ.get('ALPACA_BATCH_COLD', '100'))     # symbols per request, full 10-year history
ALPACA_BATCH_UPDATE = int(os.environ.get('ALPACA_BATCH_UPDATE', '200'))  # symbols per request, incremental update
ALPACA_LIMIT = 10000                                                    # bars per page (the API maximum)
ALPACA_MAX_WAIT = 65.0                                                  # a 429 waits at most this long (1 min window)
ALPACA_FEED_RECHECK_DAYS = 7                                            # a remembered iex fallback re-tries sip weekly
HISTORY_DAYS = 3660
UPDATE_OVERLAP_DAYS = 20                                                # incremental: re-read ~3 weeks to verify
_feed_lock = threading.Lock()
_feed: Optional[str] = None


def alpaca_keys() -> Optional[Tuple[str, str]]:
    k, s = os.environ.get('ALPACA_KEY_ID', '').strip(), os.environ.get('ALPACA_SECRET_KEY', '').strip()
    return (k, s) if k and s else None


def _alpaca_headers() -> Dict[str, str]:
    k = alpaca_keys()
    return {'APCA-API-KEY-ID': k[0], 'APCA-API-SECRET-KEY': k[1]} if k else {}


def alpaca_symbol(sym: str) -> str:
    """Alpaca keeps the class dot (BRK.B, BF.B, MOG.A); Yahoo-style dashes are turned back into dots."""
    return sym.strip().upper().replace('-', '.').replace('/', '.')


def _feed_path() -> str: return os.path.join(CACHE, 'alpaca_feed.json')


def alpaca_feed() -> str:
    """'sip' (all US exchanges) unless an earlier call / run found the plan limited to 'iex' (remembered a week)."""
    global _feed
    with _feed_lock:
        if _feed is None:
            _feed = 'sip'
            try:
                with open(_feed_path()) as f:
                    js = json.load(f)
                if js.get('feed') == 'iex' and time.time() - float(js.get('at', 0)) < ALPACA_FEED_RECHECK_DAYS * 86400:
                    _feed = 'iex'
            except (OSError, ValueError):
                pass
        return _feed


def _set_feed(feed: str) -> None:
    global _feed
    with _feed_lock:
        _feed = feed
    try:
        os.makedirs(CACHE, exist_ok=True)
        with open(_feed_path(), 'w') as f:
            json.dump({'feed': feed, 'at': time.time()}, f)
    except OSError:
        pass


def reset_alpaca_state() -> None:
    global _feed
    with _feed_lock:
        _feed = None


def alpaca_url(symbols: List[str], start: str, end: str, feed: str, page_token: str = '') -> str:
    q = {'symbols': ','.join(symbols), 'timeframe': '1Day', 'start': start, 'end': end, 'adjustment': 'all',
         'feed': feed, 'limit': str(ALPACA_LIMIT), 'sort': 'asc'}
    if page_token:
        q['page_token'] = page_token
    return ALPACA_BARS + '?' + urllib.parse.urlencode(q, safe=',:')


def parse_alpaca(raw: bytes) -> Tuple[Dict[str, List[Bar]], str]:
    """({symbol: bars}, next_page_token) of one page of /v2/stocks/bars."""
    js = json.loads(raw)
    out: Dict[str, List[Bar]] = {}
    for sym, rows in (js.get('bars') or {}).items():
        for r in rows or []:
            try:
                o, h, l, c = float(r['o']), float(r['h']), float(r['l']), float(r['c'])
            except (KeyError, TypeError, ValueError):
                continue
            if c <= 0:
                continue
            out.setdefault(sym, []).append(Bar(str(r['t'])[:10], o, h, l, c, float(r.get('v') or 0)))
    return out, js.get('next_page_token') or ''


def _alpaca_get(url_of, log=None) -> bytes:
    """One page; sip -> iex fallback when the plan refuses SIP (403), remembered for later calls and runs."""
    feed = alpaca_feed()
    try:
        return http_get(url_of(feed), headers=_alpaca_headers(), accept='application/json', expect=looks_json,
                        retries=4, max_retry_after=ALPACA_MAX_WAIT)
    except urllib.error.HTTPError as e:
        if e.code == 403 and feed == 'sip':
            _set_feed('iex')
            if log:
                log('alpaca: feed=sip refused (403, plan without SIP): using feed=iex from now on')
            return http_get(url_of('iex'), headers=_alpaca_headers(), accept='application/json', expect=looks_json,
                            retries=4, max_retry_after=ALPACA_MAX_WAIT)
        raise


def alpaca_bars(symbols: List[str], start: str, end: str, log=None) -> Dict[str, List[Bar]]:
    """Daily bars for many symbols, all pages (the limit applies to the whole multi-symbol answer), keyed by the
    symbols as asked. A 400 / 422 (e.g. one malformed symbol) splits the batch in halves; a symbol that still fails
    alone is left out. Symbols Alpaca does not know are simply missing from the result."""
    back = {alpaca_symbol(s): s for s in symbols}
    asked = sorted(back)
    got: Dict[str, List[Bar]] = {}
    try:
        token = ''
        while True:
            raw = _alpaca_get(lambda feed, t=token: alpaca_url(asked, start, end, feed, t), log)
            page, token = parse_alpaca(raw)
            for k, v in page.items():
                got.setdefault(k, []).extend(v)
            if not token:
                break
    except urllib.error.HTTPError as e:
        if e.code in (400, 422):
            if len(symbols) == 1:
                return {}
            mid = len(symbols) // 2
            return {**alpaca_bars(symbols[:mid], start, end, log), **alpaca_bars(symbols[mid:], start, end, log)}
        if e.code in (401, 403):            # keys rejected (or no data permission at all): stop using Alpaca now
            report_bad(ALPACA_BARS, trip=True)
        raise
    return {back[k]: dedupe(v) for k, v in got.items() if k in back}


def alpaca_exchanges(max_age_days: float = 7, log=None) -> Dict[str, str]:
    """{symbol: exchange} (NASDAQ / NYSE / ARCA / AMEX / BATS) from the trading API's asset list (paper-trading keys
    work for it), cached a week, best effort: only used for the TradingView links and the exchange shown in the app."""
    p = os.path.join(CACHE, 'alpaca_assets.json')
    old: Dict[str, str] = {}
    try:
        with open(p) as f:
            js = json.load(f)
        old = js.get('ex') or {}
        if time.time() - float(js.get('at', 0)) < max_age_days * 86400:
            return old
    except (OSError, ValueError):
        pass
    if not alpaca_keys() or host_open(ALPACA_ASSETS) or over_budget():
        return old
    try:
        rows = json.loads(http_get(ALPACA_ASSETS, headers=_alpaca_headers(), accept='application/json', expect=looks_json))
        ex = {str(r['symbol']).upper(): str(r.get('exchange') or '') for r in rows if r.get('symbol')}
        os.makedirs(CACHE, exist_ok=True)
        with open(p, 'w') as f:
            json.dump({'at': time.time(), 'ex': ex}, f)
        return ex
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'alpaca assets unavailable ({_why(e)}): exchange names from the cache only')
        return old


def _why(e: Exception) -> str:
    if isinstance(e, urllib.error.HTTPError):
        return f'HTTP {e.code}'
    return f'{type(e).__name__}: {str(e)[:80]}'


def _alpaca_end() -> str:
    """Free plans may not query the last 15 minutes of SIP data: end 16 minutes ago (RFC 3339, UTC)."""
    return (dt.datetime.now(dt.timezone.utc) - dt.timedelta(minutes=16)).strftime('%Y-%m-%dT%H:%M:%SZ')


def alpaca_prefetch(symbols: List[str], max_age_h: float = 12.0, workers: int = 3, log=None) -> Dict[str, str]:
    """Fill the cache from Alpaca for every symbol whose cache is older than max_age_h, in multi-symbol batches: a
    stale cache gets the last ~3 weeks (the overlap must agree, else a new split / dividend changed the adjustment and
    the full history is fetched again), a cold one the full 10 years. Returns {symbol: why} for the symbols Alpaca
    did not serve (they go on to the per-ticker fallbacks). Honours the time budget and the breaker; without keys
    it does nothing."""
    from concurrent.futures import ThreadPoolExecutor
    if not alpaca_keys():
        return {s: 'alpaca: no keys' for s in symbols}
    t0 = time.time()
    end = _alpaca_end()
    today = dt.date.today()
    cold_start = (today - dt.timedelta(days=HISTORY_DAYS)).isoformat()
    cached: Dict[str, Tuple[List[Bar], Dict, float]] = {}
    upd: List[str] = []
    cold: List[str] = []
    for s in symbols:
        c = load_cached(s)
        if c and t0 - c[2] < max_age_h * 3600:
            continue
        if c and c[0] and (today - dt.date.fromisoformat(c[0][-1].d)).days < 300:
            cached[s] = c
            upd.append(s)
        else:
            cold.append(s)
    miss: Dict[str, str] = {}
    if not upd and not cold:
        return miss
    ex = alpaca_exchanges(log=log)
    stats = {'updated': 0, 'full': 0}
    lock = threading.Lock()

    def meta_of(s: str, bars: List[Bar], prev: Optional[Dict]) -> Dict:
        m = {**(prev or {}), 'source': 'alpaca', 'feed': alpaca_feed(), 'currency': 'USD', 'price': bars[-1].c}
        m.pop('stale', None)
        m['exchange'] = ex.get(alpaca_symbol(s)) or (prev or {}).get('exchange', '')
        return m

    def run_batches(names: List[str], size: int, fn) -> None:
        batches = [names[i:i + size] for i in range(0, len(names), max(1, size))]
        if not batches:
            return
        with ThreadPoolExecutor(max_workers=max(1, min(workers, len(batches)))) as pool:
            for b, err in zip(batches, pool.map(fn, batches)):
                if err:
                    with lock:
                        for s in b:
                            miss.setdefault(s, f'alpaca: {err}')

    def gate() -> Optional[str]:
        if over_budget():
            return 'time budget spent'
        if host_open(ALPACA_BARS):
            return 'circuit breaker open'
        return None

    def do_update(batch: List[str]) -> Optional[str]:
        g = gate()
        if g:
            return g
        start = (min(dt.date.fromisoformat(cached[s][0][-1].d) for s in batch) - dt.timedelta(days=UPDATE_OVERLAP_DAYS)).isoformat()
        try:
            got = alpaca_bars(batch, start, end, log)
        except Exception as e:  # noqa: BLE001
            return _why(e)
        for s in batch:
            old = cached[s]
            merged = merge_update(old[0], got.get(s) or [])
            if not merged:
                with lock:
                    cold.append(s)          # re-adjusted (split / dividend) or no overlap: full history again
                continue
            cut = (dt.date.fromisoformat(merged[-1].d) - dt.timedelta(days=HISTORY_DAYS)).isoformat()
            merged = [b for b in merged if b.d >= cut]
            save_cached(s, merged, meta_of(s, merged, old[1]))
            with lock:
                stats['updated'] += 1
        return None

    def do_full(batch: List[str]) -> Optional[str]:
        g = gate()
        if g:
            return g
        try:
            got = alpaca_bars(batch, cold_start, end, log)
        except Exception as e:  # noqa: BLE001
            return _why(e)
        for s in batch:
            bars = got.get(s) or []
            if len(bars) < 60:
                with lock:
                    miss[s] = f'alpaca: too few bars ({len(bars)})' if bars else 'alpaca: no data'
                continue
            prev = cached.get(s) or load_cached(s)
            save_cached(s, bars, meta_of(s, bars, prev[1] if prev else None))
            with lock:
                stats['full'] += 1
        return None
    if log:
        log(f'alpaca: {len(upd)} to update, {len(cold)} cold (feed {alpaca_feed()})')
    run_batches(upd, ALPACA_BATCH_UPDATE, do_update)
    run_batches(sorted(set(cold)), ALPACA_BATCH_COLD, do_full)
    if log:
        log(f'alpaca done in {time.time() - t0:.0f}s: {stats["updated"]} updated, {stats["full"]} full histories, '
            f'{len(miss)} not served (feed {alpaca_feed()}, failing hosts {breaker_state()})')
    return miss


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


def fetch_daily(sym: str, max_age_h: float = 12.0, offline: bool = False, alpaca: bool = True) -> Tuple[List[Bar], Dict]:
    """10y daily bars for one ticker: a fresh cache as is; else Alpaca (when keys are set and alpaca=True; fetch_many
    has already asked Alpaca for the whole batch and passes False); else a stale cache updated with the last month
    (Yahoo); else the full 10 years from Yahoo, else Stooq, else the stale cache."""
    cached = load_cached(sym)
    if cached and (offline or time.time() - cached[2] < max_age_h * 3600):
        return cached[0], cached[1]
    if offline:
        raise FileNotFoundError(f'{sym}: not cached (offline)')
    errs: List[str] = []
    if alpaca and alpaca_keys() and not host_open(ALPACA_BARS) and not over_budget():
        why = alpaca_prefetch([sym], max_age_h, workers=1).get(sym)
        if why:
            errs.append(why)
        else:
            c = load_cached(sym)
            if c:
                return c[0], c[1]
        cached = load_cached(sym) or cached

    def stale(why: str):
        if cached:
            return cached[0], {**cached[1], 'stale': True}
        raise RuntimeError(f'{sym}: {why}')
    if over_budget():
        return stale('time budget spent')
    if cached and cached[1].get('source') == 'yahoo' and not host_open(yahoo_url(sym)):
        try:
            new, meta = parse_yahoo(http_get(yahoo_url(sym, '1mo'), expect=looks_json))
            merged = merge_update(cached[0], new)
            if merged:
                meta = {**cached[1], **{k: v for k, v in meta.items() if v}}
                cut = (dt.date.fromisoformat(merged[-1].d) - dt.timedelta(days=3660)).isoformat()
                merged = [b for b in merged if b.d >= cut]
                save_cached(sym, merged, meta)
                return merged, meta
        except BudgetExceeded:
            return stale('time budget spent')
        except Exception as e:  # noqa: BLE001 - fall back to a full download
            errs.append(f'update: {e}')
    for name, url, parse, expect in (
        ('yahoo', yahoo_url(sym), parse_yahoo, looks_json),
        ('stooq', f'https://stooq.com/q/d/l/?s={stooq_symbol(sym)}&i=d', parse_stooq, looks_stooq),
    ):
        if host_open(url):
            errs.append(f'{name}: circuit breaker open')
            continue
        try:
            bars, meta = parse(http_get(url, expect=expect))
            if len(bars) < 60:
                raise ValueError('too few bars')
            if cached and not meta.get('exchange'):
                meta['exchange'] = cached[1].get('exchange', '')
            save_cached(sym, bars, meta)
            return bars, meta
        except BudgetExceeded:
            return stale('time budget spent')
        except Exception as e:  # noqa: BLE001 - try the next source
            errs.append(f'{name}: {e}')
    return stale('; '.join(errs))


def fetch_many(symbols: List[str], workers: int = 6, offline: bool = False, log=None, every: int = 50) -> Dict[str, Tuple[List[Bar], Dict]]:
    """Daily bars for many tickers with a small thread pool (requests stay rate-limited per host). Logs progress
    every `every` tickers; once the time budget is spent the queued tickers get their stale cache (or an error)."""
    from concurrent.futures import ThreadPoolExecutor, as_completed
    out: Dict[str, Tuple[List[Bar], Dict]] = {}
    errors: Dict[str, str] = {}
    src: Dict[str, int] = {}
    t0 = time.time()
    if not offline:
        if alpaca_keys():
            alpaca_prefetch(symbols, 12.0, workers=min(3, max(1, workers)), log=log)
        elif log:
            log('data: ALPACA_KEY_ID / ALPACA_SECRET_KEY not set: Alpaca skipped, trying Yahoo / Stooq per ticker')

    def tally(meta: Dict) -> None:
        k = 'stale' if meta.get('stale') else meta.get('source', '?')
        src[k] = src.get(k, 0) + 1
    with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
        futs = {ex.submit(fetch_daily, s, 12.0, offline, False): s for s in symbols}
        stopped = False
        for k, f in enumerate(as_completed(futs)):
            s = futs[f]
            if f.cancelled():
                continue
            try:
                out[s] = f.result()
                tally(out[s][1])
            except Exception as e:  # noqa: BLE001
                errors[s] = str(e)[:200]
            if not stopped and over_budget():
                stopped = True
                n = sum(1 for g in futs if g.cancel())
                if log:
                    log(f'data: time budget spent after {time.time() - t0:.0f}s, {n} tickers not fetched (stale cache used)')
            if log and (k + 1) % every == 0:
                log(f'data {k + 1}/{len(symbols)} in {time.time() - t0:.0f}s, sources {src}, {len(errors)} errors, '
                    f'failing hosts {breaker_state()}')
    for f, s in futs.items():
        if f.cancelled():
            c = load_cached(s)
            if c:
                out[s] = (c[0], {**c[1], 'stale': True})
                tally(out[s][1])
            else:
                errors[s] = 'time budget spent'
    if log:
        log(f'data done: {len(out)}/{len(symbols)} in {time.time() - t0:.0f}s, sources {src}, {len(errors)} errors')
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
    url = f'https://query2.finance.yahoo.com/v10/finance/quoteSummary/{yahoo_symbol(sym)}?modules=calendarEvents'
    if over_budget() or host_open(url):
        return None
    try:
        raw = http_get(url, retries=1, timeout=8, expect=looks_json)
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):        # crumb / cookie demanded: every further call would fail the same way
            report_bad(url, trip=True)
        return None
    except Exception:  # noqa: BLE001
        return None
    try:
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


TV_EXCHANGE = {'NASDAQ': 'NASDAQ', 'ARCA': 'AMEX', 'AMEX': 'AMEX', 'BATS': 'CBOE', 'NMS': 'NASDAQ', 'NGM': 'NASDAQ', 'NCM': 'NASDAQ', 'NasdaqGS': 'NASDAQ', 'NasdaqGM': 'NASDAQ', 'NasdaqCM': 'NASDAQ',
               'NYQ': 'NYSE', 'NYSE': 'NYSE', 'ASE': 'AMEX', 'PCX': 'AMEX', 'NYSEArca': 'AMEX', 'BTS': 'CBOE'}


def tradingview_url(sym: str, exchange: str = '') -> str:
    ex = TV_EXCHANGE.get(exchange, '')
    return f"https://www.tradingview.com/chart/?symbol={ex + ':' if ex else ''}{sym}"
