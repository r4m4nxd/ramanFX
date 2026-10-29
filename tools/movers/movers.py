"""Hourly big moves: ONE calm Telegram message when something moved a lot in the last completed hour.

    ⚡ Big moves · last hour (7:00–8:00 AM)
    FX
    XAUUSD 1H · 2.6× normal · ▲0.9% · into W1 demand ⭐
    Stocks · IEX real-time
    NVDA 1H · 3.1× normal · ▼2.4% · near W1 demand · BUY setup
    [📊 XAUUSD] [📊 NVDA]

What counts: the last COMPLETED 1-hour candle's true range against the average true range of the 20 hourly candles
before it ("2.6× normal"), and its change from the previous hour's close. A symbol qualifies at >= MOVERS_MIN_X (2.0×)
and a range of at least MOVERS_FX_MIN_PCT (0.15%) / MOVERS_STOCK_MIN_PCT (0.8%) of price; the top MOVERS_TOP (5) per
market by multiple are listed. Nothing qualifies -> no message.

Markets
    FX      every FX scanner instrument (public/fx/latest.json map: majors, crosses, exotics, metals, CFDs when the scan
            has them), OANDA practice H1 BID candles (OANDA_API_TOKEN), every hour of the forex week.
    Stocks  every scanner stock (public/scanner/index.json), Alpaca 1-hour bars on the free IEX feed (real time, IEX
            trades only: thinner than the consolidated tape, so the multiples are measured on IEX bars against IEX
            bars), weekdays when the hour lies in 7:00 AM-5:00 PM New York (pre-market from 7:00, the session, the
            first hour after the close).
Zone context from the latest scans (public files): 'into W1 demand' = price inside that zone now, 'near D1 supply' =
within 0.5% of its proximal; ⭐ = the zone is in Kevin's plan; 'BUY setup' = an open scanner signal on the symbol.
Bot preferences (stock_scanner/prefs.py): muted symbols are left out; quiet hours send the message silently.
Dedupe: one message per hour (tools/movers/.cache/state.json, kept by the workflow's actions cache).
--test: '🧪 Sample big moves': the top 3 of the hour whatever their size (sample lines when no data at all); no
dedupe state is touched.

    python tools/movers/movers.py            # the hourly run (movers.yml; the trader-coach scheduler dispatches it at :05)
    python tools/movers/movers.py --test     # one sample message
    python tools/movers/movers.py --no-notify --test   # print instead of sending
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Dict, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
STOCK = os.path.join(ROOT, 'tools', 'stock_scanner')
if STOCK not in sys.path:
    sys.path.insert(0, STOCK)

import notify as SN  # noqa: E402  (escape, Msg, send with 429 retry, silent sends)
import prefs as P  # noqa: E402    (mutes / quiet hours from the bot)

PUBLIC = os.path.join(ROOT, 'public')
STATE = os.path.join(HERE, '.cache', 'state.json')
MIN_X = float(os.environ.get('MOVERS_MIN_X') or 2.0)
TOP = int(os.environ.get('MOVERS_TOP') or 5)
FX_MIN_PCT = float(os.environ.get('MOVERS_FX_MIN_PCT') or 0.15)
STOCK_MIN_PCT = float(os.environ.get('MOVERS_STOCK_MIN_PCT') or 0.8)
ATR_N = 20
BUDGET_S = float(os.environ.get('MOVERS_BUDGET_S') or 300)   # no new request after this (the message still goes out)
NEAR_PCT = 0.5
BUTTONS = 3
LOCAL_TZ = 'America/Edmonton'
FOOT = 'Calgary time · not advice'

try:
    from zoneinfo import ZoneInfo
    _NY, _CAL = ZoneInfo('America/New_York'), ZoneInfo(LOCAL_TZ)
except Exception:  # noqa: BLE001
    _NY = _CAL = None

Getter = Callable[[str, Dict[str, str]], Dict]


# ---- network (tokens only in headers, never logged) --------------------------------------------------------------
_T0 = [0.0]


def get_json(url: str, headers: Dict[str, str], timeout: float = 15.0) -> Dict:
    import time
    if not _T0[0]:
        _T0[0] = time.time()
    if time.time() - _T0[0] > BUDGET_S:
        raise RuntimeError('time budget spent')
    req = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'RamanFX-movers/1.0', **headers})
    last: Optional[Exception] = None
    for _ in range(2):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read() or b'{}')
        except urllib.error.HTTPError as e:
            last = e
            if e.code in (400, 401, 403, 404, 422):
                break
        except (urllib.error.URLError, OSError, ValueError) as e:
            last = e
    raise RuntimeError(f'{type(last).__name__}: {getattr(last, "code", "")}'.strip())


# ---- the hour ------------------------------------------------------------------------------------------------------
def last_hour(now: dt.datetime) -> Tuple[dt.datetime, dt.datetime]:
    """[start, end) of the last completed hour (UTC)."""
    end = now.astimezone(dt.timezone.utc).replace(minute=0, second=0, microsecond=0)
    return end - dt.timedelta(hours=1), end


def stock_hours(start: dt.datetime) -> bool:
    """The hour starting at `start` (UTC) lies in 7:00 AM-5:00 PM New York on a weekday."""
    if _NY is None:
        return False
    ny = start.astimezone(_NY)
    m = ny.hour * 60 + ny.minute
    return ny.weekday() < 5 and 7 * 60 <= m < 17 * 60


def clock(t: dt.datetime) -> Tuple[str, str]:
    loc = t.astimezone(_CAL) if _CAL is not None else t
    return f'{loc.hour % 12 or 12}:{loc.minute:02d}', 'AM' if loc.hour < 12 else 'PM'


def hour_label(start: dt.datetime, end: dt.datetime) -> str:
    """'7:00–8:00 AM' (Calgary), '11:00 AM–12:00 PM' across noon."""
    (a, pa), (b, pb) = clock(start), clock(end)
    return f'{a}–{b} {pb}' if pa == pb else f'{a} {pa}–{b} {pb}'


# ---- the measure ---------------------------------------------------------------------------------------------------
def measure(bars: Sequence[Dict], start_iso: str) -> Optional[Dict]:
    """bars = [{'t': ISO UTC hour start, 'o','h','l','c'}], oldest first. The bar starting at start_iso against the
    mean true range of the ATR_N bars before it; None without that bar or enough history."""
    idx = next((i for i, b in enumerate(bars) if b['t'][:13] == start_iso[:13]), None)
    if idx is None or idx < ATR_N + 1:
        return None
    b, prev = bars[idx], bars[idx - 1]

    def tr(i):
        x, pc = bars[i], bars[i - 1]['c']
        return max(x['h'], pc) - min(x['l'], pc)
    atr = sum(tr(i) for i in range(idx - ATR_N, idx)) / ATR_N
    r = tr(idx)
    if atr <= 0 or prev['c'] <= 0:
        return None
    return {'x': r / atr, 'pct': (b['c'] - prev['c']) / prev['c'] * 100, 'range_pct': r / prev['c'] * 100, 'close': b['c']}


def qualify(rows: List[Dict], min_pct: float, top: int = TOP, test: bool = False) -> List[Dict]:
    keep = rows if test else [r for r in rows if r['x'] >= MIN_X and r['range_pct'] >= min_pct]
    return sorted(keep, key=lambda r: -r['x'])[:3 if test else top]


# ---- data ----------------------------------------------------------------------------------------------------------
def load_public(path: str) -> Dict:
    try:
        with open(os.path.join(PUBLIC, path)) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def oanda_bars(name: str, get: Getter, token: str) -> List[Dict]:
    host = 'api-fxtrade.oanda.com' if (os.environ.get('OANDA_ENV') or '').lower() == 'live' else 'api-fxpractice.oanda.com'
    js = get(f'https://{host}/v3/instruments/{urllib.parse.quote(name)}/candles?granularity=H1&price=B&count={ATR_N + 6}',
             {'Authorization': f'Bearer {token}'})
    out = []
    for c in js.get('candles') or []:
        m = c.get('bid') or c.get('mid')
        if not c.get('complete') or not m:
            continue
        out.append({'t': str(c.get('time'))[:19], 'o': float(m['o']), 'h': float(m['h']), 'l': float(m['l']), 'c': float(m['c'])})
    return out


def fx_moves(start: dt.datetime, get: Getter, log=print) -> List[Dict]:
    token = (os.environ.get('OANDA_API_TOKEN') or '').strip()
    rows = load_public('fx/latest.json').get('map') or []
    if not token or not rows:
        log(f"fx: {'no OANDA_API_TOKEN' if not token else 'no public/fx/latest.json'}: skipped")
        return []
    iso = start.strftime('%Y-%m-%dT%H')

    def one(r):
        try:
            m = measure(oanda_bars(r['oanda'], get, token), iso)
        except Exception as e:  # noqa: BLE001
            return None, type(e).__name__
        return ({**m, 'sym': r['sym'], 'market': 'fx', 'cls': r.get('cls') or r.get('k'), 'digits': r.get('digits', 5)} if m else None), None
    with ThreadPoolExecutor(8) as ex:
        res = list(ex.map(one, rows))
    errs = sum(1 for _, e in res if e)
    out = [m for m, _ in res if m]
    log(f'fx: {len(out)}/{len(rows)} instruments with the {iso}:00Z candle, {errs} errors')
    return out


def alpaca_moves(start: dt.datetime, get: Getter, log=print) -> List[Dict]:
    kid, sec = (os.environ.get('ALPACA_KEY_ID') or '').strip(), (os.environ.get('ALPACA_SECRET_KEY') or '').strip()
    tick = [t['s'] for t in load_public('scanner/index.json').get('tickers') or [] if t.get('s')]
    if not kid or not sec or not tick:
        log(f"stocks: {'no Alpaca keys' if not (kid and sec) else 'no public/scanner/index.json'}: skipped")
        return []
    hdr = {'APCA-API-KEY-ID': kid, 'APCA-API-SECRET-KEY': sec}
    end = start + dt.timedelta(hours=1)
    frm = (start - dt.timedelta(days=10)).strftime('%Y-%m-%dT%H:%M:%SZ')
    bars: Dict[str, List[Dict]] = {}
    batches = [tick[i:i + 200] for i in range(0, len(tick), 200)]

    def batch(syms):
        got: Dict[str, List[Dict]] = {}
        token = ''
        for _ in range(40):
            q = {'symbols': ','.join(syms), 'timeframe': '1Hour', 'start': frm, 'end': end.strftime('%Y-%m-%dT%H:%M:%SZ'),
                 'feed': 'iex', 'adjustment': 'split', 'limit': '10000', 'sort': 'asc'}
            if token:
                q['page_token'] = token
            js = get('https://data.alpaca.markets/v2/stocks/bars?' + urllib.parse.urlencode(q, safe=',:'), hdr)
            for s, rs in (js.get('bars') or {}).items():
                got.setdefault(s, []).extend({'t': str(r['t'])[:19], 'o': float(r['o']), 'h': float(r['h']), 'l': float(r['l']),
                                              'c': float(r['c'])} for r in rs or [])
            token = js.get('next_page_token') or ''
            if not token:
                break
        return got
    errs = 0
    with ThreadPoolExecutor(3) as ex:
        for fut in [ex.submit(batch, b) for b in batches]:
            try:
                bars.update(fut.result())
            except Exception:  # noqa: BLE001
                errs += 1
    iso = start.strftime('%Y-%m-%dT%H')
    out = []
    for s, bs in bars.items():
        m = measure(bs, iso)
        if m:
            out.append({**m, 'sym': s, 'market': 'stock', 'digits': 2})
    log(f'stocks: {len(out)}/{len(tick)} tickers with an IEX {iso}:00Z bar, {errs} failed batches')
    return out


# ---- zone context from the latest scans -----------------------------------------------------------------------------
TFW = {'H1': '1H', 'H4': '4H'}


def _zone_hit(px: float, zones: Sequence[Dict], up: bool) -> Optional[Tuple[str, Dict]]:
    """('into', zone) when price is inside a zone (highest TF first), else ('near', zone) within NEAR_PCT in the
    direction of the move."""
    order = ['3M', 'MN', 'W1', 'D1', 'H4', 'H1']
    zs = [z for z in zones if z.get('proximal') is not None and z.get('distal') is not None]
    inside = [z for z in zs if min(z['proximal'], z['distal']) <= px <= max(z['proximal'], z['distal'])]
    if inside:
        return 'into', min(inside, key=lambda z: order.index(z['tf']) if z['tf'] in order else 9)
    ahead = [z for z in zs if (z['side'] == 'supply') == up and abs(z['proximal'] - px) / px * 100 <= NEAR_PCT
             and ((z['proximal'] >= px) if up else (z['proximal'] <= px))]
    if ahead:
        return 'near', min(ahead, key=lambda z: abs(z['proximal'] - px))
    return None


def context(m: Dict, fx_pub: Dict, st_pub: Dict, shard: Callable[[str], Dict]) -> str:
    px, up = m['close'], m['pct'] >= 0
    if m['market'] == 'fx':
        d = (shard(f"fx/d/{m.get('cls')}.json").get('instruments') or {}).get(m['sym']) or {}
        zones = list(d.get('zones') or []) + [{**h, 'proximal': h.get('prox'), 'distal': h.get('dist')} for h in d.get('hits') or []]
        sig = next((s for s in (fx_pub.get('signals') or []) + (fx_pub.get('watch') or []) if s.get('sym') == m['sym']), None)
        kevin = {(h.get('tf'), h.get('side'), h.get('prox')) for h in d.get('hits') or [] if h.get('kevin')}
    else:
        row = (st_pub.get('_ix') or {}).get(m['sym'])
        d = ((shard(f"scanner/t/{row['k']}.json").get('tickers') or {}).get(m['sym']) or {}) if row else {}
        zones = d.get('zones') or []
        sig = next((s for s in st_pub.get('signals') or [] if s.get('symbol') == m['sym']), None)
        kevin = set()
    bits = []
    hit = _zone_hit(px, zones, up)
    if hit:
        how, z = hit
        bits.append(f"{how} {TFW.get(z['tf'], z['tf'])} {z['side']}")
        if (z['tf'], z['side'], z.get('proximal')) in kevin:
            bits[-1] += ' ⭐'
    if sig:
        bits.append(f"{sig.get('kind')} setup")
    return ' · '.join(bits)


# ---- message -------------------------------------------------------------------------------------------------------
def line(m: Dict, ctx: str) -> str:
    arrow = '▲' if m['pct'] >= 0 else '▼'
    bits = [f"{m['x']:.1f}× normal", f"{arrow}{abs(m['pct']):.1f}%"] + ([ctx] if ctx else [])
    return f"<b>{SN.esc(m['sym'])}</b> 1H · " + SN.esc(' · '.join(bits))


def build(fx: List[Dict], st: List[Dict], start: dt.datetime, end: dt.datetime, ctx_of: Callable[[Dict], str],
          test: bool = False, stock_feed: str = 'IEX real-time', silent: bool = False) -> Optional[SN.Msg]:
    if not fx and not st:
        return None
    title = '🧪 Sample big moves' if test else '⚡ Big moves'
    lines = [f'<b>{title} · last hour ({SN.esc(hour_label(start, end))})</b>']
    if fx:
        lines += ['', '<b>FX</b>'] + [line(m, ctx_of(m)) for m in fx]
    if st:
        lines += ['', f'<b>Stocks</b> · {SN.esc(stock_feed)}'] + [line(m, ctx_of(m)) for m in st]
    lines += ['', 'Hour range vs its 20-hour average · ⭐ Kevin zone' if any('⭐' in x for x in lines) else 'Hour range vs its 20-hour average', FOOT]
    top = sorted(fx + st, key=lambda m: -m['x'])[:BUTTONS]
    btn = [[SN.cb(f"📊 {m['sym']}", f"c:{m['sym']}") for m in top if SN._cb_ok(f"c:{m['sym']}")]]
    return SN.Msg('\n'.join(lines)[:4000], btn, silent=silent)


SAMPLE = [{'sym': 'XAUUSD', 'market': 'fx', 'x': 2.6, 'pct': 0.9, 'range_pct': 1.1, 'close': 0.0},
          {'sym': 'GBPJPY', 'market': 'fx', 'x': 2.2, 'pct': -0.4, 'range_pct': 0.5, 'close': 0.0},
          {'sym': 'NVDA', 'market': 'stock', 'x': 3.1, 'pct': -2.4, 'range_pct': 2.8, 'close': 0.0}]


# ---- state ---------------------------------------------------------------------------------------------------------
def load_state(path: str = STATE) -> Dict:
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def save_state(st: Dict, path: str = STATE) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sent = dict(sorted((st.get('sent') or {}).items())[-72:])
    with open(path, 'w') as f:
        json.dump({**st, 'sent': sent}, f)


# ---- main ----------------------------------------------------------------------------------------------------------
def run(now: dt.datetime, get: Getter = get_json, test: bool = False, notify: bool = True, prefs: Optional[Dict] = None,
        state_path: str = STATE, send: Callable[[List], bool] = SN.send, log=print) -> Optional[SN.Msg]:
    start, end = last_hour(now)
    key = start.strftime('%Y-%m-%dT%H')
    st = load_state(state_path)
    if not test and key in (st.get('sent') or {}):
        log(f'{key}: already sent, nothing to do')
        return None
    fx = fx_moves(start, get, log)
    stocks_on = stock_hours(start) or test
    st_rows = alpaca_moves(start, get, log) if stocks_on else []
    if not stocks_on:
        log('stocks: outside 7:00 AM-5:00 PM New York (weekdays): skipped')
    muted = P.muted_set(prefs, now)
    fx_q = qualify([m for m in fx if m['sym'] not in muted], FX_MIN_PCT, test=test)
    st_q = qualify([m for m in st_rows if m['sym'] not in muted], STOCK_MIN_PCT, test=test)
    if test and not fx_q and not st_q:
        fx_q, st_q = [m for m in SAMPLE if m['market'] == 'fx'], [m for m in SAMPLE if m['market'] == 'stock']
        log('test: no live data, sample lines')
    fx_pub, st_pub = load_public('fx/latest.json'), load_public('scanner/latest.json')
    st_pub['_ix'] = {t['s']: t for t in load_public('scanner/index.json').get('tickers') or [] if t.get('s')}
    shards: Dict[str, Dict] = {}

    def shard(p):
        if p not in shards:
            shards[p] = load_public(p)
        return shards[p]

    def ctx_of(m):
        if not m.get('close'):
            return 'into W1 demand ⭐' if m['sym'] == 'XAUUSD' else ''
        try:
            return context(m, fx_pub, st_pub, shard)
        except Exception:  # noqa: BLE001
            return ''
    quiet = P.in_quiet(prefs, now)
    msg = build(fx_q, st_q, start, end, ctx_of, test=test, silent=quiet)
    if msg is None:
        log(f'{key}: nothing qualifies (>= {MIN_X:g}x the 20-hour average): no message')
        return None
    log(f"{key}: {len(fx_q)} FX + {len(st_q)} stock line(s){' (quiet hours: silent)' if quiet else ''}")
    if not notify:
        print(msg)
        return msg
    ok = send([msg])
    if ok and not test:
        st.setdefault('sent', {})[key] = now.astimezone(dt.timezone.utc).isoformat()
        save_state(st, state_path)
    log('sent' if ok else 'NOT sent (Telegram not configured or refused)')
    return msg


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--test', action='store_true', help="send ONE '🧪 Sample big moves' message (top 3 whatever their size)")
    ap.add_argument('--no-notify', action='store_true', help='print the message instead of sending it')
    ap.add_argument('--now', default='', help='pretend it is this UTC time (ISO), for a re-run')
    a = ap.parse_args(argv)
    now = dt.datetime.fromisoformat(a.now.replace('Z', '+00:00')) if a.now else dt.datetime.now(dt.timezone.utc)
    if now.tzinfo is None:
        now = now.replace(tzinfo=dt.timezone.utc)
    prefs = P.fetch(log=print)
    run(now, test=a.test, notify=not a.no_notify, prefs=prefs)
    return 0


if __name__ == '__main__':
    sys.exit(main())
