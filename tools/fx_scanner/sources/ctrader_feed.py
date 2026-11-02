"""Pepperstone bars from the cTrader Open API (the owner's own broker: the exact prices of his MT5 / cTrader charts).

    import sources.ctrader_feed as CTF
    CTF.enabled()            # CTRADER_* secrets set and FX_FEED != 'oanda'
    CTF.bars('EURUSD')       # {'H1','H4','D1','W1','MN': [zones.Bar]} closed BID bars, server-time labels (fxcfg.label)
                             # raises NotListed when the account has no such symbol (the caller uses the old feed)

One WebSocket session per run (tools/ctrader/ctrader.py, JSON on port 5036), shared by the scanner's threads under a
lock and paced at 5 history requests / s (the API's limit). Cache: <FX_CACHE>/ctrader/<SYM>.<TF>.json, topped up from
the newest cached bar (re-read, so a revised last bar is replaced); a TF is skipped while no newer bar can have closed.
Bars are trendbars (bid), start times in UTC -> fxcfg.label exactly like the OANDA candles (Pepperstone's server
time = New York + 7 h), so labels and the zone engine are unchanged. Only closed bars are kept.
"""
from __future__ import annotations

import calendar
import datetime as dt
import json
import os
import sys
import threading
import time
from typing import Dict, List, Optional, Tuple

import fxcfg as C
from zones import Bar

_CT = os.path.join(os.path.dirname(C.HERE), 'ctrader')
if _CT not in sys.path:
    sys.path.insert(0, _CT)

TFS = ('H1', 'H4', 'D1', 'W1', 'MN')
PERIOD_S = {'M15': 900, 'H1': 3600, 'H4': 14400, 'D1': 86400, 'W1': 7 * 86400, 'MN': 31 * 86400}
WINDOW_D = {'M15': 7, 'H1': 20, 'H4': 90, 'D1': 360, 'W1': 1800, 'MN': 1800}   # days per history request (under the API's caps)
PACE = 0.21                                                            # s between requests (5 / s)
_LOCK = threading.RLock()
_S: Dict = {}
STATS = {'requests': 0, 'skipped': 0, 'errors': 0}


class NotListed(KeyError):
    """The cTrader account has no symbol of this name."""


def enabled() -> bool:
    has_token = bool((os.environ.get('CTRADER_ACCESS_TOKEN') or '').strip() or os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))
    return bool(os.environ.get('CTRADER_CLIENT_ID')) and has_token and (os.environ.get('FX_FEED') or 'ctrader').strip().lower() != 'oanda'


def _connect() -> None:
    import ctrader as CT
    c = CT.CTrader(live=True)
    c.app_auth()
    accs = c.accounts()
    if not accs:
        raise RuntimeError('cTrader: no account on this token')
    a = next((x for x in accs if x.get('isLive')), accs[0])
    if not a.get('isLive'):
        c = CT.CTrader(live=False)
        c.app_auth()
    acc = a['ctidTraderAccountId']
    c.acc_auth(acc)
    syms = {}
    for s in c.symbols(acc):
        if s.get('symbolName') and s.get('enabled', True):
            syms[s['symbolName'].upper()] = s['symbolId']
    _S.clear()
    _S.update(c=c, acc=acc, syms=syms, t=0.0)


def _trendbars(sid: int, tf: str, frm_ms: int, to_ms: int) -> list:
    """One history request, paced; one reconnect on a dropped socket."""
    with _LOCK:
        for attempt in (0, 1):
            if 'c' not in _S:
                _connect()
            wait = _S['t'] + PACE - time.time()
            if wait > 0:
                time.sleep(wait)
            try:
                STATS['requests'] += 1
                out = _S['c'].trendbars(_S['acc'], sid, tf, frm_ms, to_ms)
                _S['t'] = time.time()
                return out
            except (OSError, ConnectionError) as e:            # websocket errors subclass these
                _S.clear()
                if attempt:
                    raise RuntimeError(f'cTrader socket: {e}') from e
            except Exception as e:  # noqa: BLE001  (API errors: e.g. a window too long -> the caller halves it)
                _S['t'] = time.time()
                raise
    return []


def symbol_id(sym: str) -> int:
    with _LOCK:
        if 'c' not in _S:
            _connect()
        sid = _S['syms'].get(sym.split(':', 1)[-1].upper())
    if sid is None:
        raise NotListed(sym)
    return sid


def _closed(start_min: int, tf: str, now: float) -> bool:
    s = start_min * 60
    if tf == 'W1':
        return now >= s + 5 * 86400                               # Sunday open -> Friday close
    if tf == 'MN':
        t = dt.datetime.utcfromtimestamp(s) + dt.timedelta(days=3)   # the bar opens on the last day of the month before (server time)
        y, m = (t.year + 1, 1) if t.month == 12 else (t.year, t.month + 1)
        return now >= calendar.timegm((y, m, 1, 0, 0, 0)) - 3 * 3600
    return now >= s + PERIOD_S[tf]


def _rows(raw: list, tf: str, sym: str, now: float) -> List[list]:
    out = []
    for m, o, h, l, c, v in raw:
        if not _closed(m, tf, now):
            continue
        iso = dt.datetime.utcfromtimestamp(m * 60).strftime('%Y-%m-%dT%H:%M:%S') + 'Z'
        try:
            # cTrader weeks open Monday 00:00 server time (Sunday 22:00 UTC); the scanner labels a week from its
            # Saturday 00:00 (OANDA's Friday 17:00 New York alignment): same week, so W1 is snapped, not checked
            lbl = C.label(iso, tf, tf != 'W1')
        except C.Misaligned:
            if now - m * 60 > 730 * 86400:                       # old history: drop the odd candle, as the OANDA reader does
                continue
            raise
        out.append([lbl, o, h, l, c, float(v), m])
    return out


def _path(sym: str, tf: str) -> str:
    return os.path.join(C.CACHE, 'ctrader', f'{sym}.{tf}.json')


def _load(sym: str, tf: str) -> List[list]:
    try:
        with open(_path(sym, tf)) as f:
            return json.load(f).get('bars') or []
    except (OSError, ValueError):
        return []


def _save(sym: str, tf: str, rows: List[list]) -> None:
    p = _path(sym, tf)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p + '.tmp', 'w') as f:
        json.dump({'bars': rows, 'fetched': time.time()}, f, separators=(',', ':'))
    os.replace(p + '.tmp', p)


def _history(sid: int, tf: str, frm_ms: Optional[int], keep: int, now: float, sym: str) -> List[list]:
    """Bars from frm_ms (or, cold, the newest `keep`) to now, paging backwards window by window."""
    to_ms, win = int(now * 1000), WINDOW_D[tf] * 86400 * 1000
    got: Dict[str, list] = {}
    empty = 0
    while True:
        lo = max(frm_ms, to_ms - win) if frm_ms is not None else to_ms - win
        try:
            raw = _trendbars(sid, tf, lo, to_ms)
        except RuntimeError:
            raise
        except Exception:  # noqa: BLE001  (window over the API cap: halve it)
            if win <= 86400 * 1000:
                raise
            win //= 2
            continue
        for r in _rows(raw, tf, sym, now):
            got[r[0]] = r
        empty = 0 if raw else empty + 1
        if frm_ms is not None and lo <= frm_ms:
            break
        if frm_ms is None and (len(got) >= keep or empty >= 2 or lo < 0):
            break
        to_ms = lo - 1
    return [got[k] for k in sorted(got)]


def update(sym: str, tf: str, sid: int, now: Optional[float] = None) -> List[list]:
    now = now or time.time()
    keep = C.KEEP_BARS.get(tf, 1500)
    rows = _load(sym, tf)
    if rows:
        last = rows[-1][6] * 60
        nxt = last + PERIOD_S[tf] + (5 * 86400 if tf == 'W1' else (28 * 86400 if tf == 'MN' else PERIOD_S[tf]))
        if now < nxt - 3600:
            STATS['skipped'] += 1
            return rows
        new = _history(sid, tf, int(last * 1000), keep, now, sym)
        by = {r[0]: r for r in rows}
        by.update({r[0]: r for r in new})
        rows = [by[k] for k in sorted(by)]
    else:
        rows = _history(sid, tf, None, keep, now, sym)
    rows = rows[-keep:]
    _save(sym, tf, rows)
    return rows


def recent(sym: str, tf: str, count: int = 400) -> List[Bar]:
    """The newest `count` closed bars of one TF (M15 / H1 ...), no cache: the 15-minute realignment check (realign.py)."""
    sid = symbol_id(sym)
    rows = _history(sid, tf, None, count, time.time(), sym)
    return [Bar(r[0], r[1], r[2], r[3], r[4], r[5]) for r in rows[-count:]]


def bars(sym: str) -> Dict[str, List[Bar]]:
    sid = symbol_id(sym)
    s = sym.split(':', 1)[-1].upper()
    return {tf: [Bar(r[0], r[1], r[2], r[3], r[4], r[5]) for r in update(s, tf, sid)] for tf in TFS}
