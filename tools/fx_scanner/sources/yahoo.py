"""Yahoo Finance chart API (UNOFFICIAL feed: no contract, may be throttled or change without notice).

    query1.finance.yahoo.com/v8/finance/chart/<sym>?interval=1h&range=720d   (cold; update: range=5d)
    query1.finance.yahoo.com/v8/finance/chart/<sym>?interval=1d&range=max    (cold; update: range=1mo)
    (query2.finance.yahoo.com when query1 refuses)

Same client and headers as the stock scanner's Yahoo fallback (tools/stock_scanner/data.py http_get: generic UA,
polite pacing, time budget, circuit breaker). H1 rows = the hour starting at the bar's UTC timestamp (complete hours
only); D1 rows = the exchange's trading date (Yahoo's gmtoffset), today's bar dropped while its session is open.
Each instrument has a list of candidate symbols (instruments.json `yahoo`): the first one that answers is used and
remembered; a different symbol later re-fetches cold (no splice of two series).
"""
from __future__ import annotations

import datetime as dt
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Callable, List, Optional

from . import bars as B
from .net import SD, get_json

Getter = Callable[[str], object]
HOSTS = ('query1.finance.yahoo.com', 'query2.finance.yahoo.com')


_SESSION: dict = {}
_LOCK = threading.Lock()


def session() -> dict:
    """Yahoo's consent cookie + crumb, once per run (GitHub runners get 429 on a bare request: the stock scanner's
    README). fc.yahoo.com answers 404 with the A3 cookie; /v1/test/getcrumb then gives the crumb. Any failure: {} and
    the plain request is tried (it may still work from other networks)."""
    with _LOCK:
        if 'done' in _SESSION:
            return _SESSION
        _SESSION['done'] = True
        try:
            jar = []
            try:
                urllib.request.urlopen(urllib.request.Request('https://fc.yahoo.com/', headers={'User-Agent': SD.UA}), timeout=10)
            except urllib.error.HTTPError as e:
                jar = e.headers.get_all('Set-Cookie') or []
            cookie = '; '.join(c.split(';', 1)[0] for c in jar if c)
            if cookie:
                req = urllib.request.Request('https://query1.finance.yahoo.com/v1/test/getcrumb',
                                             headers={'User-Agent': SD.UA, 'Cookie': cookie})
                with urllib.request.urlopen(req, timeout=10) as r:
                    crumb = r.read().decode('utf-8', 'replace').strip()
                if crumb and len(crumb) < 64 and '<' not in crumb:
                    _SESSION.update(cookie=cookie, crumb=crumb)
        except Exception:  # noqa: BLE001
            pass
        return _SESSION


def yget(u: str):
    """The default getter: the chart request with Yahoo's cookie + crumb when the session bootstrap worked."""
    s = session()
    if s.get('crumb'):
        return get_json(u + '&crumb=' + urllib.parse.quote(s['crumb'], safe=''), headers={'Cookie': s['cookie']})
    return get_json(u)


def url(sym: str, tf: str, cold: bool, host: str = HOSTS[0]) -> str:
    iv, rng = ('1h', '720d' if cold else '5d') if tf == 'H1' else ('1d', 'max' if cold else '1mo')
    return f'https://{host}/v8/finance/chart/{urllib.parse.quote(sym)}?' + urllib.parse.urlencode(
        {'interval': iv, 'range': rng, 'includePrePost': 'false'})


def parse(js, tf: str, now: float) -> List[list]:
    """Raw rows (bars.py format) of a chart answer: complete bars only, null bars skipped."""
    res = ((js or {}).get('chart') or {}).get('result') or []
    if not res:
        err = ((js or {}).get('chart') or {}).get('error') or {}
        raise ValueError(f"yahoo: no chart result ({err.get('code') or 'empty'})")
    r = res[0]
    ts = r.get('timestamp') or []
    q = ((r.get('indicators') or {}).get('quote') or [{}])[0]
    meta = r.get('meta') or {}
    off = int(meta.get('gmtoffset') or 0)
    reg = ((meta.get('currentTradingPeriod') or {}).get('regular') or {})
    out: List[list] = []
    for i, t in enumerate(ts):
        try:
            o, h, l, c = (q[k][i] for k in ('open', 'high', 'low', 'close'))
        except (KeyError, IndexError, TypeError):
            continue
        if None in (o, h, l, c) or c <= 0:
            continue
        v = float((q.get('volume') or [0] * len(ts))[i] or 0)
        if tf == 'H1':
            t0 = int(t) // 60 * 60
            if t0 + 3600 > now:
                continue                                    # the forming hour
            out.append([t0, float(o), max(float(h), o, c), min(float(l), o, c), float(c), v])
        else:
            day = dt.datetime.fromtimestamp(int(t) + off, dt.timezone.utc).strftime('%Y-%m-%d')
            out.append([day, float(o), max(float(h), o, c), min(float(l), o, c), float(c), v])
    if tf == 'D1' and out and reg.get('start') and reg.get('end') and now < float(reg['end']):
        open_day = dt.datetime.fromtimestamp(int(reg['start']) + off, dt.timezone.utc).strftime('%Y-%m-%d')
        if out[-1][0] >= open_day:
            out.pop()                                       # today's session is still trading
    return out


def _fetch(sym: str, tf: str, cold: bool, get: Getter, now: float) -> List[list]:
    err: Optional[Exception] = None
    for host in HOSTS:
        try:
            return parse(get(url(sym, tf, cold, host)), tf, now)
        except Exception as e:  # noqa: BLE001  (the other host)
            err = e
    raise err if err else RuntimeError('yahoo: no host')


def update(spec: dict, get: Optional[Getter] = None, now: Optional[float] = None, log=None) -> dict:
    """Cached raw rows of one instrument topped up from Yahoo (spec['yahoo'] = candidate symbols). Raises when Yahoo
    gives nothing and nothing is cached (the scanner then logs it and skips the instrument: never a failed scan)."""
    get = get or yget
    now = now or time.time()
    name = spec['name']
    rec = B.load(name)
    errors = []
    cands = sorted(spec.get('yahoo') or [], key=lambda s: s != rec.get('src'))
    for sym in cands:
        same = rec.get('src') == sym
        new = {'src': sym, 'h1': (rec.get('h1') or []) if same else [], 'd1': (rec.get('d1') or []) if same else []}
        try:
            for tf, key in (('H1', 'h1'), ('D1', 'd1')):
                rows = new[key]
                if rows and time.time() - float(rec.get(f'at_{key}') or 0) < (1800 if tf == 'H1' else 4 * 3600) and same:
                    continue                                # fetched recently enough (hourly runs: H1 each run)
                got = _fetch(sym, tf, not rows, get, now)
                if not rows and not got:
                    raise ValueError(f'{sym} {tf}: no bars')
                new[key] = B.merge_rows(rows, got, B.KEEP_RAW[tf])
                new[f'at_{key}'] = time.time()
            for key in ('at_h1', 'at_d1'):
                new.setdefault(key, rec.get(key) if same else 0)
            B.save(name, new)
            return new
        except Exception as e:  # noqa: BLE001
            errors.append(f'{sym}: {type(e).__name__}: {str(e)[:80]}')
            if log:
                log(f'{spec.get("sym", name)}: Yahoo {errors[-1]}')
    if rec.get('h1') and rec.get('d1'):
        if log:
            log(f'{spec.get("sym", name)}: Yahoo unavailable, using the cached bars')
        return rec
    raise RuntimeError('Yahoo unavailable: ' + '; '.join(errors))

