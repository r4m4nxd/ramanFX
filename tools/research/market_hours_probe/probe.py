"""Diagnostic: Alpaca intraday bars outside the regular session (do they carry a high-low range?).
Writes docs/research/market_hours_probe.json. Run by .github/workflows/market-hours-probe.yml."""
import datetime as dt
import json
import os
import sys
import urllib.parse
from zoneinfo import ZoneInfo

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'stock_scanner'))
import data as SD  # noqa: E402

NY = ZoneInfo('America/New_York')
out = {}
for tf in ('15Min', '30Min'):
    for adj in ('raw', 'split'):
        q = {'symbols': 'SPY,AAPL,ITT', 'timeframe': tf, 'start': '2026-10-19T00:00:00Z', 'end': '2026-10-24T00:00:00Z',
             'adjustment': adj, 'feed': 'sip', 'limit': '10000', 'sort': 'asc'}
        url = SD.ALPACA_BARS + '?' + urllib.parse.urlencode(q, safe=',:')
        try:
            js = json.loads(SD._alpaca_get(lambda feed, u=url: u.replace('feed=sip', 'feed=' + feed)))
        except Exception as e:  # noqa: BLE001
            out[f'{tf} {adj}'] = f'{type(e).__name__} {e}'
            continue
        res = {'next_page_token': js.get('next_page_token')}
        for sym, rows in (js.get('bars') or {}).items():
            tab = []
            zero_ext = zero_reg = n_ext = n_reg = 0
            for r in rows:
                t = dt.datetime.fromisoformat(r['t'].replace('Z', '+00:00')).astimezone(NY)
                m = t.hour * 60 + t.minute
                reg = 570 <= m < 960
                rng = r['h'] - r['l']
                if reg:
                    n_reg += 1
                    zero_reg += rng == 0
                else:
                    n_ext += 1
                    zero_ext += rng == 0
                if t.day == 21:
                    tab.append([t.strftime('%H:%M'), r['o'], r['h'], r['l'], r['c'], r['v'], r.get('n')])
            res[sym] = {'n_reg': n_reg, 'zero_range_reg': zero_reg, 'n_ext': n_ext, 'zero_range_ext': zero_ext, 'oct21': tab}
        out[f'{tf} {adj}'] = res
p = os.path.join(ROOT, 'docs', 'research', 'market_hours_probe.json')
with open(p, 'w') as f:
    json.dump(out, f, indent=1)
print(json.dumps({k: {s: (v[s] if isinstance(v, dict) and s in v and isinstance(v[s], dict) else None) and {kk: vv for kk, vv in v[s].items() if kk != 'oct21'} for s in ('SPY', 'AAPL', 'ITT')} if isinstance(v, dict) else v for k, v in out.items()}, indent=1))
