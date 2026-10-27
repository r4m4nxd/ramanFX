"""OANDA v20 REST client (candles + account instruments) with a local cache and incremental updates.

    host      api-fxpractice.oanda.com (OANDA_ENV=practice, default) or api-fxtrade.oanda.com (OANDA_ENV=live)
    auth      Authorization: Bearer <OANDA_API_TOKEN>  (never logged, never written)
    candles   GET /v3/instruments/{name}/candles?granularity=H4|D|W|M&price=BA (BID bars, like the owner's MT4 / MT5
              chart, which plots bid; ask - bid at the close = the spread)
              &alignmentTimezone=America/New_York&dailyAlignment=17&weeklyAlignment=Friday
              cold: count=5000; update: from=<newest cached candle>&count=5000 (re-reads it to verify the overlap)
    accounts  GET /v3/accounts -> the first account id; GET /v3/accounts/{id}/instruments (cached weekly)

Only complete candles (complete=true) are kept. Network etiquette, the time budget and the per-host circuit breaker
come from tools/stock_scanner/data.py (http_get): 401 / 403 open the breaker at once, 429 / 5xx get one short retry.
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.parse
from typing import Callable, Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import data as SD  # noqa: E402  (stock scanner network layer: budget, breaker, polite pacing)
import fxcfg as C  # noqa: E402
from zones import Bar  # noqa: E402

HOSTS = {'practice': 'api-fxpractice.oanda.com', 'live': 'api-fxtrade.oanda.com'}
for _h in HOSTS.values():
    SD.HOST_PAUSE.setdefault(_h, 0.06)          # ~16 requests/s; OANDA allows far more (be polite)
ALIGN = {'alignmentTimezone': 'America/New_York', 'dailyAlignment': '17', 'weeklyAlignment': 'Friday'}
INSTRUMENTS_MAX_AGE_D = 7
STRICT_DAYS = 730                               # a misaligned candle older than this is dropped (logged), newer ones fail
DROPPED: Dict[str, int] = {}                    # 'name tf' -> old misaligned candles dropped this run
PRICE = 'B'                                     # cache format: bars are BID (older caches held mid: re-fetched cold)


class NoToken(RuntimeError):
    """OANDA_API_TOKEN is not set."""


def host() -> str:
    return HOSTS.get((os.environ.get('OANDA_ENV') or 'practice').strip().lower(), HOSTS['practice'])


def token() -> str:
    t = (os.environ.get('OANDA_API_TOKEN') or '').strip()
    if not t:
        raise NoToken('OANDA_API_TOKEN is not set (create a demo account, Manage API Access -> Generate, add the secret)')
    return t


def _headers() -> Dict[str, str]:
    return {'Authorization': f'Bearer {token()}', 'Accept-Datetime-Format': 'RFC3339', 'Content-Type': 'application/json'}


Getter = Callable[[str], bytes]


def default_get(url: str) -> bytes:
    return SD.http_get(url, accept='application/json', expect=SD.looks_json, headers=_headers(), max_retry_after=10)


def candles_url(name: str, tf: str, count: int = C.COLD_COUNT, frm: Optional[str] = None) -> str:
    q = {'granularity': C.GRAN[tf], 'price': 'BA', 'count': str(count), **ALIGN}
    if frm:
        q['from'] = frm
    return f'https://{host()}/v3/instruments/{urllib.parse.quote(name)}/candles?' + urllib.parse.urlencode(q)


def parse_candles(raw: bytes, tf: str, strict: bool = True, name: str = '') -> List[Tuple[str, Bar, Optional[float], str]]:
    """[(label, Bar(bid), spread or None, utc time)] of the COMPLETE candles, oldest first. The bars are BID prices
    (Pepperstone MT4 / MT5 charts and ZoneVision plot bid); a candle with no bid side falls back to mid. A candle off
    the server-time grid raises fxcfg.Misaligned (the instrument is dropped this run, never silently relabelled)."""
    js = json.loads(raw)
    out = []
    for c in js.get('candles') or []:
        if not c.get('complete'):
            continue
        m = c.get('bid') or c.get('mid') or {}
        try:
            o, h, l, cl = (float(m[k]) for k in ('o', 'h', 'l', 'c'))
        except (KeyError, TypeError, ValueError):
            continue
        sp = None
        if c.get('bid') and c.get('ask'):
            try:
                sp = float(c['ask']['c']) - float(c['bid']['c'])
            except (KeyError, TypeError, ValueError):
                sp = None
        t = str(c.get('time') or '')
        try:
            lbl = C.label(t, tf, strict)
        except C.Misaligned:
            # history: drop only the offending old candle (never fail an instrument for it); recent ones still fail
            import datetime as dt
            age = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None) - C.parse_utc(t)
            if age.days <= STRICT_DAYS:
                raise
            k = f'{name} {tf}'.strip()
            DROPPED[k] = DROPPED.get(k, 0) + 1
            continue
        out.append((lbl, Bar(lbl, o, h, l, cl, float(c.get('volume') or 0)), sp, t[:19] + 'Z'))
    return out


# ---- cache ---------------------------------------------------------------------------------------------------------
def _path(name: str, tf: str) -> str:
    return os.path.join(C.CACHE, 'candles', f'{name}.{tf}.json')


def load(name: str, tf: str) -> Optional[Dict]:
    try:
        with open(_path(name, tf)) as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def save(name: str, tf: str, rec: Dict) -> None:
    p = _path(name, tf)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(rec, f, separators=(',', ':'))
    os.replace(tmp, p)


def to_bars(rec: Optional[Dict]) -> List[Bar]:
    return [Bar(r[0], r[1], r[2], r[3], r[4], r[5]) for r in (rec or {}).get('bars') or []]


def spreads(rec: Optional[Dict]) -> List[float]:
    return [r[6] for r in (rec or {}).get('bars') or [] if len(r) > 6 and r[6] is not None]


def _merge(old: List[list], new: List[list], tol: float) -> Optional[List[list]]:
    """old + new; None when the overlapping candle disagrees (re-fetch cold)."""
    if not old:
        return new
    if not new:
        return old
    idx = {r[0]: r for r in old}
    first = new[0]
    if first[0] in idx and abs(idx[first[0]][4] - first[4]) > tol:
        return None
    keep = [r for r in old if r[0] < first[0]]
    return keep + new


def _rows(raw: bytes, tf: str, name: str = '') -> Tuple[List[list], List[str]]:
    pc = parse_candles(raw, tf, name=name)
    return [[lbl, b.o, b.h, b.l, b.c, b.v] + ([round(sp, 6)] if sp is not None else []) for lbl, b, sp, _ in pc], [u for *_, u in pc]


def update(name: str, tf: str, get: Getter = None, log=None) -> Tuple[List[Bar], Dict]:
    """Bars of one instrument / TF from the cache, topped up from OANDA (only when a newer candle can exist)."""
    get = get or default_get
    rec = load(name, tf)
    if rec is not None and rec.get('price') != PRICE:
        rec = None                                  # an old mid-price cache: re-fetch bid bars cold
    rows = (rec or {}).get('bars') or []
    frm = (rec or {}).get('last_utc') if rows else None
    if frm and tf in C.TF_HOURS:
        # nothing new can have completed yet: skip the request. -1 h: the week (or day) in which New York changes
        # its clock is an hour shorter, so the next close can come 1 h before start + 2 x the bar length.
        import datetime as dt
        nxt = C.parse_utc(frm) + dt.timedelta(hours=2 * C.TF_HOURS[tf] - 1)
        if dt.datetime.now(dt.timezone.utc).replace(tzinfo=None) < nxt:
            return to_bars(rec), rec
    got, utc = _rows(get(candles_url(name, tf, C.COLD_COUNT, frm)), tf, name)
    merged = _merge(rows, got, tol=max(1e-9, (rows[-1][4] if rows else 1) * 2e-4)) if frm else got
    if merged is None:
        if log:
            log(f'{name} {tf}: overlap mismatch, full re-fetch')
        got, utc = _rows(get(candles_url(name, tf)), tf, name)
        merged = got
    merged = merged[-C.KEEP_BARS.get(tf, 1500):]
    rec = {'bars': merged, 'last_utc': utc[-1] if utc else (rec or {}).get('last_utc'), 'fetched': time.time(), 'price': PRICE}
    save(name, tf, rec)
    return to_bars(rec), rec


# ---- account instruments -------------------------------------------------------------------------------------------
def account_instruments(get: Getter = None, max_age_days: float = INSTRUMENTS_MAX_AGE_D, log=None) -> Tuple[List[Dict], str]:
    """(instruments, source): the account's tradeable instruments (cached weekly), 'oanda' / 'cache' / 'fallback'."""
    get = get or default_get
    p = os.path.join(C.CACHE, 'instruments.json')
    try:
        with open(p) as f:
            js = json.load(f)
        if time.time() - js.get('at', 0) < max_age_days * 86400 and js.get('instruments'):
            return js['instruments'], 'cache'
    except (OSError, ValueError):
        js = None
    try:
        acc = json.loads(get(f'https://{host()}/v3/accounts'))
        aid = (acc.get('accounts') or [{}])[0].get('id')
        if not aid:
            raise ValueError('no account id')
        ins = json.loads(get(f'https://{host()}/v3/accounts/{urllib.parse.quote(aid)}/instruments')).get('instruments') or []
        keep = [{k: i.get(k) for k in ('name', 'type', 'displayName', 'pipLocation', 'displayPrecision')} for i in ins if i.get('name')]
        if not keep:
            raise ValueError('empty instrument list')
        os.makedirs(C.CACHE, exist_ok=True)
        with open(p, 'w') as f:
            json.dump({'at': time.time(), 'instruments': keep}, f)
        return keep, 'oanda'
    except NoToken:
        raise
    except (urllib.error.URLError, OSError, ValueError, SD.HostDown, SD.BudgetExceeded, SD.BadBody) as e:
        if log:
            log(f'instrument list: {type(e).__name__}; using the ' + ('cached' if js else 'committed fallback') + ' list')
        if js and js.get('instruments'):
            return js['instruments'], 'cache'
        return C.load_fallback(), 'fallback'


def latest_h4(get: Getter = None, name: str = 'EUR_USD') -> Optional[str]:
    """Label of the newest complete H4 candle of `name` (the skip check: no new H4 candle -> nothing to do)."""
    get = get or default_get
    rows = parse_candles(get(candles_url(name, 'H4', 3)), 'H4')
    return rows[-1][0] if rows else None
