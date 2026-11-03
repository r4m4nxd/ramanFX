"""Questrade API: daily bars of TSX-only names for the stock scan (owner 2026-11-03: a free feed for every Canadian
stock; his own Questrade account, a personal app with the read-only market-data scope).

Auth: Questrade refresh tokens are SINGLE-USE. Each exchange (login.questrade.com/oauth2/token) returns a new refresh
token + a 30-min access token + the api_server; the new refresh token is written to Supabase (public.rfx_questrade_token,
service role) BEFORE anything else, and the table must be readable and writable before the old token is spent (the
cTrader lesson of 2026-11-02). The first token comes from the QUESTRADE_REFRESH_TOKEN secret; later ones from the table.
A still-valid access token in the table is reused (no exchange).

    import questrade as Q
    Q.enabled()                       # a token source is configured
    Q.daily('RY.TO', '2006-01-01')    # [Bar] oldest first (unadjusted daily candles)
Tokens are never printed.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import threading
import time
import urllib.parse
import urllib.request
from typing import Dict, List, Optional

from zones import Bar

SB = os.environ.get('SUPABASE_URL') or 'https://dqjzufofmblerslcynzr.supabase.co'
REST = f'{SB}/rest/v1/rfx_questrade_token'
LOGIN = 'https://login.questrade.com/oauth2/token'
PACE = 0.12                                   # s between API calls (market data allows ~20 / s)
_LOCK = threading.Lock()
_S: Dict = {}
_IDS: Dict[str, Optional[int]] = {}


def enabled() -> bool:
    return bool((os.environ.get('QUESTRADE_REFRESH_TOKEN') or '').strip()) and bool(os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))


def _sb(method: str, url: str, body=None):
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or ''
    h = {'apikey': key, 'Content-Type': 'application/json'}
    if key.startswith('eyJ'):
        h['Authorization'] = f'Bearer {key}'
    if method == 'POST':
        h['Prefer'] = 'resolution=merge-duplicates,return=minimal'
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    with urllib.request.urlopen(req, timeout=15) as r:
        raw = r.read()
    return json.loads(raw) if raw else None


def _session() -> Dict:
    """{access, api} valid for at least 2 more minutes; exchanges the refresh token when needed."""
    with _LOCK:
        if _S.get('exp', 0) > time.time() + 120:
            return _S
        rows = _sb('GET', REST + '?id=eq.1&select=refresh_token,access_token,api_server,expires_at')   # raises when unreachable
        row = rows[0] if rows else None
        if row and row.get('access_token') and row.get('expires_at'):
            exp = dt.datetime.fromisoformat(row['expires_at'].replace('Z', '+00:00')).timestamp()
            if exp > time.time() + 120:
                _S.update(access=row['access_token'], api=row['api_server'], exp=exp)
                return _S
        _sb('PATCH', REST + '?id=eq.0', {'updated_at': dt.datetime.now(dt.timezone.utc).isoformat()})   # writable? (no row 0)
        rt = (row or {}).get('refresh_token') or (os.environ.get('QUESTRADE_REFRESH_TOKEN') or '').strip()
        q = urllib.parse.urlencode({'grant_type': 'refresh_token', 'refresh_token': rt})
        with urllib.request.urlopen(f'{LOGIN}?{q}', timeout=20) as r:
            js = json.loads(r.read())
        if not js.get('refresh_token') or not js.get('access_token'):
            raise RuntimeError('Questrade: token refused')
        exp = time.time() + int(js.get('expires_in') or 1800)
        _sb('POST', REST, {'id': 1, 'refresh_token': js['refresh_token'], 'access_token': js['access_token'],
                           'api_server': js['api_server'], 'expires_at': dt.datetime.fromtimestamp(exp, dt.timezone.utc).isoformat(),
                           'updated_at': dt.datetime.now(dt.timezone.utc).isoformat()})
        _S.update(access=js['access_token'], api=js['api_server'], exp=exp)
        return _S


def _get(path: str) -> Dict:
    s = _session()
    req = urllib.request.Request(s['api'].rstrip('/') + '/' + path.lstrip('/'), headers={'Authorization': f"Bearer {s['access']}"})
    with _LOCK:
        wait = _S.get('t', 0) + PACE - time.time()
        if wait > 0:
            time.sleep(wait)
        _S['t'] = time.time()
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def symbol_id(sym: str) -> Optional[int]:
    """'RY.TO' / 'BBD.B.TO' -> Questrade's symbolId (None = not found). Cached per run."""
    if sym in _IDS:
        return _IDS[sym]
    base = sym[:-3] if sym.upper().endswith('.TO') else sym
    got = _get('v1/symbols/search?' + urllib.parse.urlencode({'prefix': base}))
    want = {sym.upper(), f'{base}.TO'.upper(), base.upper()}
    hit = next((x for x in got.get('symbols') or [] if str(x.get('symbol', '')).upper() in want
                and str(x.get('listingExchange', '')).upper() in ('TSX', 'TSXV', '')), None)
    _IDS[sym] = int(hit['symbolId']) if hit else None
    return _IDS[sym]


def daily(sym: str, start: str) -> List[Bar]:
    """Daily candles from `start` (YYYY-MM-DD) to now, oldest first (2000 per request: paged by date)."""
    sid = symbol_id(sym)
    if sid is None:
        raise KeyError(f'{sym}: not on Questrade')
    out: Dict[str, Bar] = {}
    a = dt.datetime.fromisoformat(start).replace(tzinfo=dt.timezone.utc)
    end = dt.datetime.now(dt.timezone.utc)
    while a < end:
        b = min(end, a + dt.timedelta(days=2700))                 # ~1900 trading days < 2000
        q = urllib.parse.urlencode({'startTime': a.strftime('%Y-%m-%dT%H:%M:%S-00:00'), 'endTime': b.strftime('%Y-%m-%dT%H:%M:%S-00:00'), 'interval': 'OneDay'})
        for c in _get(f'v1/markets/candles/{sid}?{q}').get('candles') or []:
            try:
                d = str(c['start'])[:10]
                out[d] = Bar(d, float(c['open']), float(c['high']), float(c['low']), float(c['close']), float(c.get('volume') or 0))
            except (KeyError, TypeError, ValueError):
                continue
        a = b
    today = dt.date.today().isoformat()
    return [out[k] for k in sorted(out) if k < today]                # closed days only
