"""Crypto candles from public exchange APIs (no key). Each provider returns raw rows (sources/bars.py format):
H1 = complete UTC hours, D1 = complete UTC days, oldest first.

    coinbase   api.exchange.coinbase.com/products/<BASE>-USD/candles?granularity=3600|86400&start&end
               [[time, low, high, open, close, volume], ...] newest first, at most 300 per request
    kraken     api.kraken.com/0/public/OHLC?pair=<PAIR>&interval=60|1440&since=<s>
               {'result': {<pair>: [[time, o, h, l, c, vwap, volume, count], ...], 'last'}}: only the newest 720
               candles (fallback: enough for the scan, a shorter history)
    binanceus  api.binance.us/api/v3/klines?symbol=<SYM>&interval=1h|1d&startTime&endTime&limit=1000
               [[open_ms, o, h, l, c, v, close_ms, ...]] oldest first (BNB: not listed on Coinbase / Kraken USD)
    okx        www.okx.com/api/v5/market/history-candles?instId=<ID>&bar=1H|1Dutc&after=<ms>&limit=100
               {'data': [[ts_ms, o, h, l, c, vol, ..., confirm]]} newest first; '1Dutc' = UTC days ('1D' is UTC+8)

Prices are the exchange's spot trades (BNB: USDT ~ USD). Pepperstone crypto CFDs are priced from exchange feeds, so
levels match closely; the spread is Pepperstone's (instruments.json), not the exchange's (much tighter).
"""
from __future__ import annotations

import datetime as dt
import time
import urllib.parse
from typing import Callable, List, Optional

from . import bars as B
from .net import get_json

STEP = {'H1': 3600, 'D1': 86400}
COLD = {'H1': 4200, 'D1': 4000}           # cold history: 4200 hours (~1050 H4 bars), 4000 days (W1 / MN back to 2015)

Getter = Callable[[str], object]


def _complete(rows: List[list], tf: str, now: float) -> List[list]:
    s = STEP[tf]
    return [r for r in rows if r[0] + s <= now]


def _d1(rows: List[list]) -> List[list]:
    """Epoch-keyed day rows -> 'YYYY-MM-DD' keys (UTC)."""
    return [[dt.datetime.fromtimestamp(r[0], dt.timezone.utc).strftime('%Y-%m-%d')] + r[1:] for r in rows]


# ---- providers: fetch(pid, tf, since_epoch, now, get) -> epoch-keyed rows [t, o, h, l, c, v] ------------------------
def coinbase(pid: str, tf: str, since: float, now: float, get: Getter) -> List[list]:
    s = STEP[tf]
    out: List[list] = []
    end = int(now // s * s)
    since = int(since) // s * s                           # candle starts are on the hour / UTC midnight
    while end > since:
        start = max(since, end - 300 * s)
        q = urllib.parse.urlencode({'granularity': s, 'start': _iso(start), 'end': _iso(end)})
        js = get(f'https://api.exchange.coinbase.com/products/{urllib.parse.quote(pid)}/candles?{q}')
        if not isinstance(js, list):
            raise ValueError(f'coinbase {pid}: unexpected answer')
        page = [[int(r[0]), float(r[3]), float(r[2]), float(r[1]), float(r[4]), float(r[5])] for r in js if len(r) >= 6]
        if not page:
            break                                         # before the listing date: nothing older exists
        out.extend(page)
        end = start
    return out


def kraken(pair: str, tf: str, since: float, now: float, get: Getter) -> List[list]:
    iv = {'H1': 60, 'D1': 1440}[tf]
    js = get(f'https://api.kraken.com/0/public/OHLC?pair={urllib.parse.quote(pair)}&interval={iv}&since={int(since)}')
    if not isinstance(js, dict) or js.get('error'):
        raise ValueError(f'kraken {pair}: {(js or {}).get("error") if isinstance(js, dict) else "bad answer"}')
    res = js.get('result') or {}
    key = next((k for k in res if k != 'last'), None)
    return [[int(r[0]), float(r[1]), float(r[2]), float(r[3]), float(r[4]), float(r[6])] for r in res.get(key) or []]


def binanceus(sym: str, tf: str, since: float, now: float, get: Getter) -> List[list]:
    s = STEP[tf]
    iv = {'H1': '1h', 'D1': '1d'}[tf]
    out: List[list] = []
    start = int(since)
    while start < now - s:
        q = urllib.parse.urlencode({'symbol': sym, 'interval': iv, 'startTime': start * 1000, 'limit': 1000})
        js = get(f'https://api.binance.us/api/v3/klines?{q}')
        if not isinstance(js, list):
            raise ValueError(f'binanceus {sym}: unexpected answer')
        page = [[int(r[0]) // 1000, float(r[1]), float(r[2]), float(r[3]), float(r[4]), float(r[5])] for r in js]
        if not page:
            break
        out.extend(page)
        start = page[-1][0] + s
        if len(page) < 1000:
            break
    return out


def okx(inst: str, tf: str, since: float, now: float, get: Getter) -> List[list]:
    bar = {'H1': '1H', 'D1': '1Dutc'}[tf]
    out: List[list] = []
    after = int(now * 1000)
    for _ in range(80):
        js = get('https://www.okx.com/api/v5/market/history-candles?'
                 + urllib.parse.urlencode({'instId': inst, 'bar': bar, 'after': after, 'limit': 100}))
        if not isinstance(js, dict) or str(js.get('code')) != '0':
            raise ValueError(f'okx {inst}: {js.get("msg") if isinstance(js, dict) else "bad answer"}')
        page = [[int(r[0]) // 1000, float(r[1]), float(r[2]), float(r[3]), float(r[4]), float(r[5])] for r in js.get('data') or []]
        if not page:
            break
        out.extend(page)
        after = min(r[0] for r in page) * 1000
        if after / 1000 <= since:
            break
    return [r for r in out if r[0] >= since]


PROVIDERS = {'coinbase': coinbase, 'kraken': kraken, 'binanceus': binanceus, 'okx': okx}


def _iso(t: float) -> str:
    return dt.datetime.fromtimestamp(t, dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def update(spec: dict, get: Optional[Getter] = None, now: Optional[float] = None, log=None) -> dict:
    """The cached raw H1 / D1 rows of one coin, topped up from the first provider that answers (spec['providers'] =
    [[provider, product id], ...]; the cached provider is tried first). A switch of provider re-fetches cold (no
    mixing of two exchanges' prices). Raises when no provider answers and nothing is cached."""
    get = get or get_json
    now = now or time.time()
    name = spec['name']
    rec = B.load(name)
    provs = [p for p in spec.get('providers') or []]
    provs.sort(key=lambda p: p[0] != rec.get('src'))
    errors = []
    for prov, pid in provs:
        same = rec.get('src') == prov
        new = {'src': prov, 'h1': (rec.get('h1') or []) if same else [], 'd1': (rec.get('d1') or []) if same else []}
        try:
            for tf, key in (('H1', 'h1'), ('D1', 'd1')):
                rows = new[key]
                last = (rows[-1][0] if tf == 'H1' else _epoch(rows[-1][0])) if rows else None
                if last is not None and last + 2 * STEP[tf] > now:
                    continue                                  # nothing new can have completed yet
                since = last if last is not None else now - COLD[tf] * STEP[tf]
                got = _complete(PROVIDERS[prov](pid, tf, since, now, get), tf, now)
                if tf == 'D1':
                    got = _d1(got)
                if not rows and not got:
                    raise ValueError(f'{prov} {pid} {tf}: no candles')
                new[key] = B.merge_rows(rows, got, B.KEEP_RAW[tf])
            B.save(name, new)
            return new
        except Exception as e:  # noqa: BLE001  (next provider)
            errors.append(f'{prov}: {type(e).__name__}: {str(e)[:80]}')
            if log:
                log(f'{spec.get("sym", name)}: {prov} failed ({errors[-1]}), trying the next source')
    if rec.get('h1') and rec.get('d1'):
        if log:
            log(f'{spec.get("sym", name)}: every source failed, using the cached candles')
        return rec
    raise RuntimeError('; '.join(errors) or 'no provider')


def _epoch(day: str) -> float:
    return dt.datetime.strptime(day[:10], '%Y-%m-%d').replace(tzinfo=dt.timezone.utc).timestamp()


def latest_h1(spec: dict, get: Optional[Getter] = None, now: Optional[float] = None) -> Optional[int]:
    """UTC start (epoch) of the newest complete H1 candle of the first provider (the weekend crypto check)."""
    get = get or get_json
    now = now or time.time()
    for prov, pid in spec.get('providers') or []:
        try:
            rows = _complete(PROVIDERS[prov](pid, 'H1', now - 6 * 3600, now, get), 'H1', now)
            if rows:
                return max(r[0] for r in rows)
        except Exception:  # noqa: BLE001
            continue
    return None

