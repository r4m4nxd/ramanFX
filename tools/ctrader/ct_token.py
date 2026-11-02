"""cTrader access token: stored in Supabase (public.rfx_ctrader_token, service role only) and refreshed before it expires.

    python tools/ctrader/ct_token.py refresh [--force]   # the ctrader-token workflow: refresh when < 10 days are left
    import ct_token; ct_token.access_token()              # the newest token (the table, else CTRADER_ACCESS_TOKEN)

Env: CTRADER_CLIENT_ID, CTRADER_CLIENT_SECRET, CTRADER_REFRESH_TOKEN / CTRADER_ACCESS_TOKEN (the first ones, from the
Playground), SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL (default: the project). Tokens are never printed.
"""
import datetime as dt
import json
import os
import sys
import urllib.parse
import urllib.request

SB = os.environ.get('SUPABASE_URL') or 'https://dqjzufofmblerslcynzr.supabase.co'
REST = f'{SB}/rest/v1/rfx_ctrader_token'
_CACHE = {}


def _sb(method, url, body=None):
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or ''
    h = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}
    if method == 'POST':
        h['Prefer'] = 'resolution=merge-duplicates,return=minimal'
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, headers=h, method=method)
    with urllib.request.urlopen(req, timeout=15) as r:
        raw = r.read()
    return json.loads(raw) if raw else None


def row():
    if not os.environ.get('SUPABASE_SERVICE_ROLE_KEY'):
        return None
    try:
        rows = _sb('GET', REST + '?id=eq.1&select=access_token,refresh_token,expires_at')
        return rows[0] if rows else None
    except Exception as e:  # noqa: BLE001
        print(f'cTrader token: table read failed ({type(e).__name__})', file=sys.stderr)
        return None


def access_token():
    if 'a' not in _CACHE:
        r = row()
        _CACHE['a'] = (r or {}).get('access_token') or (os.environ.get('CTRADER_ACCESS_TOKEN') or '').strip()
    return _CACHE['a']


def _refresh(rt):
    q = urllib.parse.urlencode({'grant_type': 'refresh_token', 'refresh_token': rt,
                                'client_id': os.environ['CTRADER_CLIENT_ID'], 'client_secret': os.environ['CTRADER_CLIENT_SECRET']})
    with urllib.request.urlopen(f'https://openapi.ctrader.com/apps/token?{q}', timeout=20) as r:
        js = json.loads(r.read())
    if not js.get('accessToken') or not js.get('refreshToken'):
        raise RuntimeError(f"refresh refused: {js.get('errorCode')} {js.get('description', '')}")
    return js


def refresh(force=False):
    r = row()
    now = dt.datetime.now(dt.timezone.utc)
    if r and not force:
        exp = dt.datetime.fromisoformat(r['expires_at'].replace('Z', '+00:00'))
        if exp - now > dt.timedelta(days=10):
            print(f'cTrader token valid until {exp:%Y-%m-%d} - nothing to do')
            return 0
    cands = [x for x in ((r or {}).get('refresh_token'), (os.environ.get('CTRADER_REFRESH_TOKEN') or '').strip()) if x]
    last = None
    for rt in dict.fromkeys(cands):
        try:
            js = _refresh(rt)
            break
        except Exception as e:  # noqa: BLE001
            last = e
    else:
        print(f'cTrader token refresh FAILED: {last}')
        return 1
    exp = now + dt.timedelta(seconds=int(js.get('expiresIn') or 2_592_000))
    _sb('POST', REST, {'id': 1, 'access_token': js['accessToken'], 'refresh_token': js['refreshToken'],
                       'expires_at': exp.isoformat(), 'updated_at': now.isoformat()})
    print(f'cTrader token refreshed, valid until {exp:%Y-%m-%d}')
    return 0


if __name__ == '__main__':
    if sys.argv[1:2] == ['refresh']:
        sys.exit(refresh('--force' in sys.argv))
    sys.exit(2)
