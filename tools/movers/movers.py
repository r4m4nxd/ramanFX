"""Big moves on every timeframe: ONE calm Telegram message per hour when something moved a lot on a candle that just
closed (owner 2026-10-29: "group tickers or pairs under each timeframe so that I know. Cannot miss any moves.").

    ⚡ Big moves · 1W · 1D · 4H · 1H
    🟪 1W · week closed Fri 3:00 PM
    Forex & metals
    ▲ GBPJPY +1.2% · 2.6× · into D1 supply
    Stocks · SIP
    ▼ NVDA -6.4% · 2.3× · gap ▼3.1% · broke W1 demand
    +4 more → app
    🟦 1D · day closed Fri 3:00 PM
    ...
    ⬜ 1H · 2:00–3:00 PM
    [📊 GBPJPY] [📊 NVDA] [📊 XAUUSD]

Which candles (movers.py works out itself which timeframes closed: the scheduler only dispatches it every hour)
    FX, metals, indices, commodities (OANDA BID, NY-aligned like the scanner: alignmentTimezone=America/New_York,
        dailyAlignment=17, weeklyAlignment=Friday; synthetic crosses / baskets from their OANDA legs)
        1H every forex-week hour; 4H at 17, 21, 01, 05, 09, 13 New York; 1D at 17:00 New York Mon-Fri; 1W Friday 17:00.
    Crypto (sources/crypto.py providers: Coinbase -> Kraken, BNB Binance.US -> OKX), 24/7:
        1H every hour; 4H on the same New York grid as FX (the scanner's crypto H4); 1D = the UTC day (00:00 UTC);
        1W = Saturday-Friday UTC week (closes Saturday 00:00 UTC), the scanner's conventions.
    Stocks (Alpaca): 1H 7:00 AM-5:00 PM New York weekdays on IEX bars (real time); 1D and Friday 1W on SIP daily /
        weekly bars (IEX when SIP is refused) with the 17:00 New York run, i.e. with the FX daily close, an hour after
        the US close (one message, final bars). No stock 4H: a 9:30-16:00 session makes 4H candles a 4 h + a 2.5 h
        stub that never compare like for like.
    A close is caught by the first run after it (1H: that hour only; 4H within 4 h; 1D / 1W within 20 h), once.

What counts (same on every timeframe): the closed candle's true range against the mean true range of the 20 candles
before it ('2.6×'), >= MIN_X (2.0) AND a range of at least MIN_PCT[group][tf] % of price; stocks 1D also qualify on
a 'big body' (|close-open| >= 2× its 20-day average body and >= the min %) or a gap (|open-prev close| >= 3%).
The % shown is close-to-close (vs the previous candle's close), never pips.

Message: highest timeframe first ('🟪 1W', '🟦 1D', '🟩 4H', '⬜ 1H'), under each 'Forex & metals / Indices &
commodities / Crypto / Stocks', EVERY qualifier one line; past TOP_LINES (8) per group '+N more → app' (the /moves
page lists all from public/movers/latest.json, written by this job). Zone context from the latest scans: 'into W1
demand' (inside), 'broke D1 supply' (the candle closed through it), 'near H4 supply' (within 0.5%), ⭐ = in Kevin's
plan, 'BUY setup' = an open scanner signal. 📰 why: the latest headline in the TF's window (1H 3 h, 4H 8 h, 1D 26 h,
1W 7 days) for the top 3 lines of each timeframe. [📊 SYM] buttons for the top 3 overall (highest TF first).
Bot preferences: muted symbols are left out; quiet hours: a 1H-only message goes out silently, a 4H / 1D / 1W
section is HELD and sent with the first run after quiet hours end (never dropped). Never more than one message an
hour; dedupe per TF close in tools/movers/.cache/state.json (the workflow's actions cache).

    python tools/movers/movers.py            # the hourly run (movers.yml; dispatched by the trader-coach scheduler)
    python tools/movers/movers.py --test     # ONE '🧪 Sample big moves (all timeframes)' from the last closed bars
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
FXDIR = os.path.join(ROOT, 'tools', 'fx_scanner')
if STOCK not in sys.path:
    sys.path.insert(0, STOCK)

import notify as SN  # noqa: E402  (escape, Msg, send with 429 retry, silent sends)
import prefs as P  # noqa: E402    (mutes / quiet hours from the bot)

PUBLIC = os.path.join(ROOT, 'public')
STATE = os.path.join(HERE, '.cache', 'state.json')
LATEST = os.path.join(PUBLIC, 'movers', 'latest.json')
APP = os.environ.get('MOVERS_APP_URL') or 'https://raman-fx.vercel.app/moves'
MIN_X = float(os.environ.get('MOVERS_MIN_X') or 2.0)
ATR_N = 20
BUDGET_S = float(os.environ.get('MOVERS_BUDGET_S') or 300)   # no new request after this (the message still goes out)
NEAR_PCT = 0.5
BUTTONS = 3
TOP_LINES = 8                     # lines per group before '+N more → app'
WHY_TOP = 3                       # '📰 why' lines per timeframe section
GAP_PCT = 3.0                     # stocks 1D gap
LOCAL_TZ = 'America/Edmonton'
FOOT = 'Calgary time · not advice'
UTC = dt.timezone.utc

TFS = ('W1', 'D1', 'H4', 'H1')                                   # highest first
RANK = {'W1': 3, 'D1': 2, 'H4': 1, 'H1': 0}
HEAD = {'W1': '🟪 1W', 'D1': '🟦 1D', 'H4': '🟩 4H', 'H1': '⬜ 1H'}
SHORT = {'W1': '1W', 'D1': '1D', 'H4': '4H', 'H1': '1H'}
SPAN_H = {'H1': 1, 'H4': 4, 'D1': 24, 'W1': 168}
LOOKBACK_H = {'H1': 1, 'H4': 4, 'D1': 20, 'W1': 20}            # a run this long after a close still catches it
WHY_H = {'H1': 3, 'H4': 8, 'D1': 26, 'W1': 168}
GROUPS = ('fx', 'idx', 'crypto', 'stock')
GROUP_NAME = {'fx': 'Forex & metals', 'idx': 'Indices & commodities', 'crypto': 'Crypto', 'stock': 'Stocks'}
# the candle's range as % of price, at least (and >= MIN_X its 20-candle average)
MIN_PCT = {
    'fx': {'H1': float(os.environ.get('MOVERS_FX_MIN_PCT') or 0.15), 'H4': 0.3, 'D1': 0.6, 'W1': 1.2},
    'idx': {'H1': 0.3, 'H4': 0.6, 'D1': 1.2, 'W1': 2.5},
    'crypto': {'H1': 0.8, 'H4': 1.5, 'D1': 3.0, 'W1': 6.0},
    'stock': {'H1': float(os.environ.get('MOVERS_STOCK_MIN_PCT') or 0.8), 'D1': 3.0, 'W1': 6.0},
}
# which timeframes each data family has
PLAN = {'fx': ('W1', 'D1', 'H4', 'H1'), 'crypto': ('W1', 'D1', 'H4', 'H1'), 'stock': ('W1', 'D1', 'H1')}
FX_GROUPS = {'FX MAJORS', 'FX MINORS', 'FX CROSSES', 'FX EXOTICS', 'METALS'}
USDX_PARTS = {'EUR_USD': -0.576, 'USD_JPY': 0.136, 'GBP_USD': -0.119, 'USD_CAD': 0.091, 'USD_SEK': 0.042, 'USD_CHF': 0.036}
USDX_K = 50.14348112
ALIGN = {'alignmentTimezone': 'America/New_York', 'dailyAlignment': '17', 'weeklyAlignment': 'Friday'}
OANDA_GRAN = {'H1': 'H1', 'H4': 'H4', 'D1': 'D', 'W1': 'W'}

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


# ---- clocks --------------------------------------------------------------------------------------------------------
def last_hour(now: dt.datetime) -> Tuple[dt.datetime, dt.datetime]:
    """[start, end) of the last completed hour (UTC)."""
    end = now.astimezone(UTC).replace(minute=0, second=0, microsecond=0)
    return end - dt.timedelta(hours=1), end


def stock_hours(start: dt.datetime) -> bool:
    """The hour starting at `start` (UTC) lies in 7:00 AM-5:00 PM New York on a weekday."""
    if _NY is None:
        return False
    ny = start.astimezone(_NY)
    m = ny.hour * 60 + ny.minute
    return ny.weekday() < 5 and 7 * 60 <= m < 17 * 60


def fx_week(close: dt.datetime) -> bool:
    """An FX candle closing at `close` belongs to the forex week (Sunday 17:00 -> Friday 17:00 New York)."""
    ny = close.astimezone(_NY)
    m = ny.hour * 60 + ny.minute
    wd = ny.weekday()                                    # Mon 0 .. Sun 6
    if wd == 5:
        return False
    if wd == 6:
        return m > 17 * 60
    if wd == 4:
        return m <= 17 * 60
    return True


def is_close(tf: str, fam: str, c: dt.datetime) -> bool:
    """A `tf` candle of the data family `fam` ('fx' | 'crypto' | 'stock') closes at `c` (UTC, on the hour).
    Stocks 1D / 1W 'close' with the 17:00 New York run (the US session ended at 16:00; the bars are final then)."""
    ny = c.astimezone(_NY)
    if ny.minute:
        return False
    if fam == 'fx':
        if not fx_week(c):
            return False
        return {'H1': True, 'H4': ny.hour % 4 == 1, 'D1': ny.hour == 17 and ny.weekday() < 5,
                'W1': ny.hour == 17 and ny.weekday() == 4}[tf]
    if fam == 'crypto':
        cu = c.astimezone(UTC)
        return {'H1': True, 'H4': ny.hour % 4 == 1, 'D1': cu.hour == 0, 'W1': cu.hour == 0 and cu.weekday() == 5}[tf]
    if fam == 'stock':
        if tf == 'H1':
            return stock_hours(c - dt.timedelta(hours=1))
        return ny.hour == 17 and (ny.weekday() < 5 if tf == 'D1' else ny.weekday() == 4)
    return False


def latest_close(tf: str, fam: str, now: dt.datetime) -> Optional[dt.datetime]:
    """The newest close of that candle at or before `now` (searched 9 days back)."""
    h = now.astimezone(UTC).replace(minute=0, second=0, microsecond=0)
    for k in range(24 * 9):
        c = h - dt.timedelta(hours=k)
        if is_close(tf, fam, c):
            return c
    return None


def ekey(tf: str, fam: str, close: dt.datetime) -> str:
    return f"{tf}:{fam}:{close.astimezone(UTC).strftime('%Y-%m-%dT%H')}"


def due_events(now: dt.datetime, sent: Dict, test: bool = False) -> List[Tuple[str, str, dt.datetime]]:
    """(tf, family, close) of every candle that closed since the last run and was not handled yet. test: the last
    closed candle of every timeframe whatever its age."""
    out = []
    for fam, tfs in PLAN.items():
        for tf in tfs:
            c = latest_close(tf, fam, now)
            if c is None:
                continue
            if not test and (now - c >= dt.timedelta(hours=LOOKBACK_H[tf]) or ekey(tf, fam, c) in sent):
                continue
            out.append((tf, fam, c))
    return out


def clock(t: dt.datetime) -> Tuple[str, str]:
    loc = t.astimezone(_CAL) if _CAL is not None else t
    return f'{loc.hour % 12 or 12}:{loc.minute:02d}', 'AM' if loc.hour < 12 else 'PM'


def hour_label(start: dt.datetime, end: dt.datetime) -> str:
    """'7:00–8:00 AM' (Calgary), '11:00 AM–12:00 PM' across noon."""
    (a, pa), (b, pb) = clock(start), clock(end)
    return f'{a}–{b} {pb}' if pa == pb else f'{a} {pa}–{b} {pb}'


def day_clock(t: dt.datetime) -> str:
    """'Fri 3:00 PM' (Calgary)."""
    loc = t.astimezone(_CAL) if _CAL is not None else t
    a, p = clock(t)
    return f"{loc.strftime('%a')} {a} {p}"


def span_label(tf: str, close: dt.datetime, fams: Sequence[str]) -> str:
    if tf in ('H1', 'H4'):
        return hour_label(close - dt.timedelta(hours=SPAN_H[tf]), close)
    word = 'week' if tf == 'W1' else 'day'
    utc = ' (UTC)' if list(fams) == ['crypto'] else ''
    return f'{word}{utc} closed {day_clock(close)}'


# ---- the measure ---------------------------------------------------------------------------------------------------
def _t(s: str) -> dt.datetime:
    return dt.datetime.fromisoformat(str(s)[:19]).replace(tzinfo=UTC)


def measure(bars: Sequence[Dict], close: dt.datetime, span_h: float) -> Optional[Dict]:
    """bars = [{'t': ISO UTC candle start, 'o','h','l','c'}], oldest first, closed candles only. The candle that
    closed at `close` (its start between 1.5 and 0.5 spans before it: OANDA labels its weeks Friday 17:00, Alpaca
    its days at midnight New York) against the ATR_N candles before it; None without it or enough history."""
    lo, hi = close - dt.timedelta(hours=span_h * 1.5), close - dt.timedelta(hours=span_h * 0.5)
    idx = None
    for i in range(len(bars) - 1, -1, -1):
        t = _t(bars[i]['t'])
        if t > hi:
            continue
        if t >= lo:
            idx = i
        break
    if idx is None or idx < ATR_N + 1:
        return None
    b, prev = bars[idx], bars[idx - 1]

    def tr(i):
        x, pc = bars[i], bars[i - 1]['c']
        return max(x['h'], pc) - min(x['l'], pc)
    atr = sum(tr(i) for i in range(idx - ATR_N, idx)) / ATR_N
    body_avg = sum(abs(bars[i]['c'] - bars[i]['o']) for i in range(idx - ATR_N, idx)) / ATR_N
    r = tr(idx)
    if atr <= 0 or prev['c'] <= 0:
        return None
    body = abs(b['c'] - b['o'])
    return {'x': r / atr, 'pct': (b['c'] - prev['c']) / prev['c'] * 100, 'range_pct': r / prev['c'] * 100,
            'close': b['c'], 'o': b['o'], 'h': b['h'], 'l': b['l'], 'body_x': body / body_avg if body_avg > 0 else 0.0,
            'body_pct': body / prev['c'] * 100, 'gap_pct': (b['o'] - prev['c']) / prev['c'] * 100}


def qualifies(m: Dict) -> Tuple[bool, List[str]]:
    """(qualifies, tags) on the group / timeframe thresholds."""
    g, tf = m['group'], m['tf']
    mn = MIN_PCT[g].get(tf, 99.0)
    tags = []
    big = m['x'] >= MIN_X and m['range_pct'] >= mn
    if g == 'stock' and tf == 'D1':
        if abs(m.get('gap_pct') or 0) >= GAP_PCT:
            tags.append(f"gap {'▲' if m['gap_pct'] > 0 else '▼'}{abs(m['gap_pct']):.1f}%")
        if m.get('body_x', 0) >= MIN_X and m.get('body_pct', 0) >= mn:
            tags.append('big body')
    return big or bool(tags), tags


def score(m: Dict) -> float:
    return max(m['x'], m.get('body_x') or 0) if m['group'] == 'stock' and m['tf'] == 'D1' else m['x']


def select(rows: List[Dict], test: bool = False) -> List[Dict]:
    """Every qualifier (tags set), best first. test: a group with none shows its top 2 anyway."""
    keep = []
    for r in rows:
        ok, tags = qualifies(r)
        if ok:
            keep.append({**r, 'tags': tags})
    if test and not keep:
        keep = [{**r, 'tags': []} for r in sorted(rows, key=lambda r: -score(r))[:2]]
    return sorted(keep, key=lambda r: -score(r))


# ---- data ----------------------------------------------------------------------------------------------------------
def load_public(path: str) -> Dict:
    try:
        with open(os.path.join(PUBLIC, path)) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def group_of(r: Dict) -> str:
    cls = r.get('cls') or r.get('k') or ''
    if cls == 'crypto' or r.get('src') == 'crypto':
        return 'crypto'
    if r.get('group') in FX_GROUPS or cls in ('major', 'cross', 'exotic', 'metal'):
        return 'fx'
    return 'idx'


def oanda_bars(name: str, tf: str, get: Getter, token: str) -> List[Dict]:
    host = 'api-fxtrade.oanda.com' if (os.environ.get('OANDA_ENV') or '').lower() == 'live' else 'api-fxpractice.oanda.com'
    q = {'granularity': OANDA_GRAN[tf], 'price': 'B', 'count': str(ATR_N + 6), **ALIGN}
    js = get(f'https://{host}/v3/instruments/{urllib.parse.quote(name)}/candles?' + urllib.parse.urlencode(q),
             {'Authorization': f'Bearer {token}'})
    out = []
    for c in js.get('candles') or []:
        m = c.get('bid') or c.get('mid')
        if not c.get('complete') or not m:
            continue
        out.append({'t': str(c.get('time'))[:19], 'o': float(m['o']), 'h': float(m['h']), 'l': float(m['l']), 'c': float(m['c'])})
    return out


def compose(legs: Dict[str, List[Dict]], weights: Dict[str, float], k: float = 1.0) -> List[Dict]:
    """k x PRODUCT(leg ^ w) per candle start present in every leg (open / close exact, high / low an upper bound,
    like sources/synthetic.py; the bid shift is irrelevant for a range multiple)."""
    maps = {n: {b['t']: b for b in legs.get(n) or []} for n in weights}
    if not maps or any(not m for m in maps.values()):
        return []
    common = sorted(set.intersection(*(set(m) for m in maps.values())))
    out = []
    for t in common:
        def val(pick):
            v = k
            for n, w in weights.items():
                v *= maps[n][t][pick(w)] ** w
            return v
        o, c = val(lambda w: 'o'), val(lambda w: 'c')
        h, lo = val(lambda w: 'h' if w > 0 else 'l'), val(lambda w: 'l' if w > 0 else 'h')
        out.append({'t': t, 'o': o, 'h': max(h, o, c), 'l': min(lo, o, c), 'c': c})
    return out


def _extra_specs() -> Dict[str, Dict]:
    try:
        with open(os.path.join(FXDIR, 'instruments.json')) as f:
            return {x['sym']: x for x in json.load(f).get('extra') or []}
    except (OSError, ValueError):
        return {}


def fx_rows(tfs: Sequence[str], closes: Dict[str, dt.datetime], get: Getter, log=print) -> List[Dict]:
    """Every OANDA-fed / synthetic scanner instrument (forex, metals, indices, commodities) on each due timeframe."""
    token = (os.environ.get('OANDA_API_TOKEN') or '').strip()
    rows = [r for r in load_public('fx/latest.json').get('map') or [] if group_of(r) != 'crypto']
    if not token or not rows or not tfs:
        if tfs:
            log(f"fx: {'no OANDA_API_TOKEN' if not token else 'no public/fx/latest.json'}: skipped")
        return []
    extra = _extra_specs()

    def weights(r) -> Tuple[Dict[str, float], float]:
        if r['sym'] == 'USDX' or r.get('oanda') == 'USDX':
            return USDX_PARTS, USDX_K
        x = extra.get(r['sym']) if r.get('src') == 'synthetic' else None
        if x and x.get('legs'):
            return {n: float(w) for n, w in x['legs'].items()}, float(x.get('k') or 1.0)
        return {r['oanda']: 1.0}, 1.0
    need = {(n, tf) for r in rows for n in weights(r)[0] for tf in tfs}
    cache: Dict[Tuple[str, str], List[Dict]] = {}
    errs = [0]

    def one(nt):
        try:
            return nt, oanda_bars(nt[0], nt[1], get, token)
        except Exception:  # noqa: BLE001
            errs[0] += 1
            return nt, []
    with ThreadPoolExecutor(8) as ex:
        for nt, bs in ex.map(one, sorted(need)):
            cache[nt] = bs
    out = []
    for tf in tfs:
        n_ok = 0
        for r in rows:
            w, k = weights(r)
            bs = cache.get((r['oanda'], tf), []) if len(w) == 1 and k == 1.0 and r['oanda'] in w else \
                compose({n: cache.get((n, tf), []) for n in w}, w, k)
            m = measure(bs, closes[tf], SPAN_H[tf])
            if m:
                n_ok += 1
                out.append({**m, 'sym': r['sym'], 'market': 'fx', 'fam': 'fx', 'group': group_of(r), 'tf': tf,
                            'cls': r.get('cls') or r.get('k'), 'close_t': closes[tf].isoformat()})
        log(f'fx {tf}: {n_ok}/{len(rows)} instruments with the candle closing {closes[tf]:%Y-%m-%d %H:%M}Z')
    if errs[0]:
        log(f'fx: {errs[0]} OANDA requests failed')
    return out


def _crypto_mod():
    if FXDIR not in sys.path:
        sys.path.append(FXDIR)
    from sources import crypto as SC  # noqa: WPS433
    return SC


def h4_from_h1(h1: Sequence[Dict], now: dt.datetime) -> List[Dict]:
    """H1 candles -> closed H4 candles on the New York 17 / 21 / 01 / 05 / 09 / 13 grid (the scanner's crypto H4)."""
    out: List[Dict] = []
    for b in h1:
        ny = _t(b['t']).astimezone(_NY)
        s = (ny - dt.timedelta(hours=(ny.hour - 1) % 4)).replace(minute=0).astimezone(UTC)
        key = s.strftime('%Y-%m-%dT%H:%M:%S')
        if out and out[-1]['t'] == key:
            x = out[-1]
            out[-1] = {**x, 'h': max(x['h'], b['h']), 'l': min(x['l'], b['l']), 'c': b['c'], 'n': x['n'] + 1}
        else:
            out.append({'t': key, 'o': b['o'], 'h': b['h'], 'l': b['l'], 'c': b['c'], 'n': 1})
    return [b for b in out if _t(b['t']) + dt.timedelta(hours=4) <= now]


def w1_from_d1(d1: Sequence[Dict], now: dt.datetime) -> List[Dict]:
    """UTC days -> closed Saturday-Friday weeks (the scanner's crypto W1)."""
    out: List[Dict] = []
    for b in d1:
        d = _t(b['t'])
        s = (d - dt.timedelta(days=(d.weekday() - 5) % 7)).strftime('%Y-%m-%dT00:00:00')
        if out and out[-1]['t'] == s:
            x = out[-1]
            out[-1] = {**x, 'h': max(x['h'], b['h']), 'l': min(x['l'], b['l']), 'c': b['c']}
        else:
            out.append({'t': s, 'o': b['o'], 'h': b['h'], 'l': b['l'], 'c': b['c']})
    return [b for b in out if _t(b['t']) + dt.timedelta(days=7) <= now]


def crypto_rows(tfs: Sequence[str], closes: Dict[str, dt.datetime], now: dt.datetime, get: Getter, log=print) -> List[Dict]:
    """The scanner's crypto (public/fx/latest.json map, instruments.json providers), 24/7."""
    rows = [r for r in load_public('fx/latest.json').get('map') or [] if group_of(r) == 'crypto']
    if not rows or not tfs:
        return []
    try:
        SC = _crypto_mod()
    except Exception as e:  # noqa: BLE001
        log(f'crypto: sources unavailable ({type(e).__name__}): skipped')
        return []
    extra = _extra_specs()
    ts = now.timestamp()
    cget = lambda u: get(u, {})  # noqa: E731
    if get is get_json:                       # live: the sources' polite per-host pacing + circuit breaker
        try:
            from sources import net as SNET  # noqa: WPS433
            cget = SNET.get_json
        except Exception:  # noqa: BLE001
            pass
    want_h1 = any(tf in tfs for tf in ('H1', 'H4'))
    want_d1 = any(tf in tfs for tf in ('D1', 'W1'))
    days = 175 if 'W1' in tfs else 32

    def fetch(prov_list, tf, since):
        last = None
        for prov, pid in prov_list:
            try:
                rs = SC.PROVIDERS[prov](pid, tf, since, ts, cget)
                step = 3600 if tf == 'H1' else 86400
                rs = sorted({int(r[0]): r for r in rs if int(r[0]) + step <= ts}.values(), key=lambda r: r[0])
                if rs:
                    return [{'t': dt.datetime.fromtimestamp(int(r[0]), UTC).strftime('%Y-%m-%dT%H:%M:%S'),
                             'o': float(r[1]), 'h': float(r[2]), 'l': float(r[3]), 'c': float(r[4])} for r in rs]
            except Exception as e:  # noqa: BLE001  (next provider)
                last = e
        raise RuntimeError(type(last).__name__ if last else 'no candles')

    def one(r):
        x = extra.get(r['sym']) or {}
        provs = x.get('providers') or []
        got = {}
        try:
            if want_h1:
                h1 = fetch(provs, 'H1', ts - 110 * 3600)
                got['H1'], got['H4'] = h1, h4_from_h1(h1, now)
            if want_d1:
                d1 = fetch(provs, 'D1', ts - days * 86400)
                got['D1'], got['W1'] = d1, w1_from_d1(d1, now)
        except Exception as e:  # noqa: BLE001
            return r, got, type(e).__name__
        return r, got, None
    with ThreadPoolExecutor(4) as ex:
        res = list(ex.map(one, rows))
    out = []
    for r, got, _ in res:
        for tf in tfs:
            m = measure(got.get(tf) or [], closes[tf], SPAN_H[tf])
            if m:
                out.append({**m, 'sym': r['sym'], 'market': 'fx', 'fam': 'crypto', 'group': 'crypto', 'tf': tf,
                            'cls': 'crypto', 'close_t': closes[tf].isoformat()})
    errs = sum(1 for _, _, e in res if e)
    log(f"crypto {'/'.join(tfs)}: {len(out)} measured over {len(rows)} coins, {errs} failed")
    return out


def alpaca_bars(tick: Sequence[str], timeframe: str, frm: dt.datetime, end: dt.datetime, feed: str, get: Getter,
                hdr: Dict[str, str]) -> Tuple[Dict[str, List[Dict]], int]:
    bars: Dict[str, List[Dict]] = {}
    batches = [list(tick[i:i + 200]) for i in range(0, len(tick), 200)]

    def batch(syms):
        got: Dict[str, List[Dict]] = {}
        token = ''
        for _ in range(40):
            q = {'symbols': ','.join(syms), 'timeframe': timeframe, 'start': frm.strftime('%Y-%m-%dT%H:%M:%SZ'),
                 'end': end.strftime('%Y-%m-%dT%H:%M:%SZ'), 'feed': feed, 'adjustment': 'split', 'limit': '10000', 'sort': 'asc'}
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
    return bars, errs


def stock_rows(tfs: Sequence[str], closes: Dict[str, dt.datetime], now: dt.datetime, get: Getter, log=print) -> Tuple[List[Dict], Dict[str, str]]:
    """Every scanner stock: 1H on IEX (real time), 1D / 1W on SIP (15-min delayed: asked up to now - 16 min; IEX
    when SIP is refused). Returns (rows, {tf: feed label})."""
    kid, sec = (os.environ.get('ALPACA_KEY_ID') or '').strip(), (os.environ.get('ALPACA_SECRET_KEY') or '').strip()
    tick = [t['s'] for t in load_public('scanner/index.json').get('tickers') or [] if t.get('s')]
    if not tfs:
        return [], {}
    if not kid or not sec or not tick:
        log(f"stocks: {'no Alpaca keys' if not (kid and sec) else 'no public/scanner/index.json'}: skipped")
        return [], {}
    hdr = {'APCA-API-KEY-ID': kid, 'APCA-API-SECRET-KEY': sec}
    out, feeds = [], {}
    for tf in tfs:
        c = closes[tf]
        if tf == 'H1':
            start = c - dt.timedelta(hours=1)
            bars, errs = alpaca_bars(tick, '1Hour', start - dt.timedelta(days=10), c, 'iex', get, hdr)
            feed = 'IEX real-time'
        else:
            span = dt.timedelta(days=200 if tf == 'W1' else 45)
            end = min(now - dt.timedelta(minutes=16), c)
            feed = 'SIP'
            bars, errs = alpaca_bars(tick[:1], '1Day', c - span, end, 'sip', get, hdr)
            if errs:
                feed = 'IEX'
            bars, errs = alpaca_bars(tick, '1Week' if tf == 'W1' else '1Day', c - span, end, feed.lower(), get, hdr)
        feeds[tf] = feed
        n = 0
        for s, bs in bars.items():
            m = measure(bs, c, SPAN_H[tf] if tf == 'H1' else (24 if tf == 'D1' else 168))
            if m:
                n += 1
                out.append({**m, 'sym': s, 'market': 'stock', 'fam': 'stock', 'group': 'stock', 'tf': tf, 'close_t': c.isoformat()})
        log(f'stocks {tf}: {n}/{len(tick)} tickers with the candle ({feed}), {errs} failed batches')
    return out, feeds


# ---- zone context from the latest scans -----------------------------------------------------------------------------
TFW = {'H1': '1H', 'H4': '4H'}
ZORDER = ['3M', 'MN', 'W1', 'D1', 'H4', 'H1']


def _zrank(z: Dict) -> int:
    return ZORDER.index(z['tf']) if z.get('tf') in ZORDER else 9


def _zone_hit(px: float, zones: Sequence[Dict], up: bool, o: Optional[float] = None) -> Optional[Tuple[str, Dict]]:
    """('into', zone) when price is inside a zone, ('broke', zone) when the candle opened before a zone and closed
    through it in the direction of the move (highest TF first; inside wins a tie), else ('near', zone) within
    NEAR_PCT ahead of the move."""
    zs = [z for z in zones if z.get('proximal') is not None and z.get('distal') is not None]
    hits = []
    for z in zs:
        lo, hi = min(z['proximal'], z['distal']), max(z['proximal'], z['distal'])
        if lo <= px <= hi:
            hits.append((_zrank(z), 0, 'into', z))
        elif o is not None and up and z.get('side') == 'supply' and o < hi < px:
            hits.append((_zrank(z), 1, 'broke', z))
        elif o is not None and not up and z.get('side') == 'demand' and o > lo > px:
            hits.append((_zrank(z), 1, 'broke', z))
    if hits:
        _, _, how, z = min(hits, key=lambda h: (h[0], h[1]))
        return how, z
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
    hit = _zone_hit(px, zones, up, m.get('o'))
    if hit:
        how, z = hit
        bits.append(f"{how} {TFW.get(z['tf'], z['tf'])} {z['side']}")
        if (z['tf'], z['side'], z.get('proximal')) in kevin:
            bits[-1] += ' ⭐'
    if sig:
        bits.append(f"{sig.get('kind')} setup")
    return ' · '.join(bits)


# ---- headlines: '📰 why: <the latest headline in the TF's window>' (tools/news/headlines.py) ------------------------
def news_why(movers: Sequence[Dict], now: dt.datetime, log=print, hours: float = 3) -> Dict[str, Dict]:
    """{sym: {'line': '   📰 why: <a href>headline</a> · 40m ago', 'title', 'url'}} for movers with a headline in the
    last `hours`. Alpaca News for stocks / crypto / ETF-tagged CFDs, the RSS pool for FX + macro. Never raises."""
    if not movers:
        return {}
    try:
        tools = os.path.join(ROOT, 'tools')
        if tools not in sys.path:
            sys.path.append(tools)
        from news import headlines as NH  # noqa: WPS433
        syms = [m['sym'] for m in movers]
        tags = NH.tags_for(syms)
        items = NH.alpaca(tags, start=now - dt.timedelta(hours=hours), log=log) if tags else []
        if any(m['market'] == 'fx' for m in movers):
            items += NH.pool(log=log)
        out = {}
        for s in syms:
            h = NH.latest_for(items, s, now, hours=hours)
            if h:
                out[s] = {'line': f"   📰 why: {NH.line_for(h, now, 90, source=False)}", 'title': str(h.get('title') or '')[:200],
                          'url': NH.safe_url(h.get('url'))}
        return out
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'headlines: skipped ({type(e).__name__})')
        return {}


# ---- sections + message --------------------------------------------------------------------------------------------
def sections_of(rows: List[Dict], events: Sequence[Tuple[str, str, dt.datetime]], feeds: Dict[str, str]) -> List[Dict]:
    """One section per (timeframe, close): {'tf', 'close', 'fams', 'feed', 'rows': [...]}, highest TF first."""
    by: Dict[Tuple[str, str], Dict] = {}
    for tf, fam, c in events:
        s = by.setdefault((tf, c.isoformat()), {'tf': tf, 'close': c.isoformat(), 'fams': [], 'feed': '', 'rows': []})
        s['fams'].append(fam)
        if fam == 'stock':
            s['feed'] = feeds.get(tf, '')
    for r in rows:
        s = by.get((r['tf'], r['close_t']))
        if s is not None:
            s['rows'].append(r)
    for s in by.values():
        s['fams'] = sorted(set(s['fams']), key=['fx', 'crypto', 'stock'].index)
        s['rows'].sort(key=lambda r: -score(r))
    return sorted(by.values(), key=lambda s: (-RANK[s['tf']], s['close']))


def _pct(p: float) -> str:
    a = abs(p)
    return f"{'+' if p >= 0 else '-'}{a:.2f}%" if a < 1 else f"{'+' if p >= 0 else '-'}{a:.1f}%"


def line(m: Dict) -> str:
    """'▲ <b>GBPJPY</b> +1.2% · 2.6× · into D1 supply'."""
    arrow = '▲' if m['pct'] >= 0 else '▼'
    bits = [_pct(m['pct']), f"{m['x']:.1f}×"] + list(m.get('tags') or []) + ([m['ctx']] if m.get('ctx') else [])
    return f"{arrow} <b>{SN.esc(m['sym'])}</b> " + SN.esc(' · '.join(bits))


def _render(secs: Sequence[Dict], title: str, cap: int, why: bool, h1_only: bool) -> List[str]:
    if h1_only:
        c = _t(secs[0]['close'])
        lines = [f'<b>{SN.esc(title)} · last hour ({SN.esc(hour_label(c - dt.timedelta(hours=1), c))})</b>']
    else:
        tfs = [SHORT[t] for t in TFS if any(s['tf'] == t for s in secs)]
        lines = [f"<b>{SN.esc(title)} · {' · '.join(tfs)}</b>"]
    for s in secs:
        held = ' · held over quiet hours' if s.get('held') else ''
        lines += ['', f"<b>{HEAD[s['tf']]}</b> · {SN.esc(span_label(s['tf'], _t(s['close']), s['fams']))}{held}"]
        for g in GROUPS:
            rs = [r for r in s['rows'] if r['group'] == g]
            if not rs:
                continue
            feed = f" · {SN.esc(s.get('feed') or '')}" if g == 'stock' and s.get('feed') else ''
            lines.append(f'<i>{GROUP_NAME[g]}</i>{feed}')
            for r in rs[:cap]:
                lines.append(line(r))
                if why and (r.get('why') or {}).get('line'):
                    lines.append(r['why']['line'])
            if len(rs) > cap:
                lines.append(f"+{len(rs) - cap} more → <a href=\"{APP}#{s['tf'].lower()}\">app</a>")
    kev = any('⭐' in (r.get('ctx') or '') for s in secs for r in s['rows'])
    lines += ['', 'Range vs its 20-candle average · ⭐ Kevin zone' if kev else 'Range vs its 20-candle average', FOOT]
    return lines


def build(secs: Sequence[Dict], test: bool = False, silent: bool = False) -> Optional[SN.Msg]:
    """ONE message for every section that has a line; None when nothing qualifies."""
    secs = [s for s in secs if s['rows']]
    if not secs:
        return None
    title = '🧪 Sample big moves (all timeframes)' if test else '⚡ Big moves'
    h1_only = not test and all(s['tf'] == 'H1' for s in secs) and len(secs) == 1
    text = ''
    for cap in (TOP_LINES, 5, 3, 2, 1):
        for why in (True, False):
            text = '\n'.join(_render(secs, title, cap, why, h1_only))
            if SN.u16(text) <= SN.SAFE:
                break
        if SN.u16(text) <= SN.SAFE:
            break
    seen, top = set(), []
    for r in sorted((r for s in secs for r in s['rows']), key=lambda r: (-RANK[r['tf']], -score(r))):
        if r['sym'] not in seen and SN._cb_ok(f"c:{r['sym']}"):
            seen.add(r['sym'])
            top.append(r)
        if len(top) == BUTTONS:
            break
    btn = [[SN.cb(f"📊 {m['sym']}", f"c:{m['sym']}") for m in top]]
    return SN.Msg(text[:4000], btn, silent=silent)


SAMPLE = [{'sym': 'XAUUSD', 'market': 'fx', 'group': 'fx', 'tf': 'W1', 'x': 2.4, 'pct': 3.1, 'range_pct': 4.2, 'ctx': 'into W1 demand ⭐'},
          {'sym': 'GBPJPY', 'market': 'fx', 'group': 'fx', 'tf': 'D1', 'x': 2.6, 'pct': 1.2, 'range_pct': 1.6, 'ctx': 'into D1 supply'},
          {'sym': 'NAS100', 'market': 'fx', 'group': 'idx', 'tf': 'H4', 'x': 2.2, 'pct': -0.9, 'range_pct': 1.1, 'ctx': ''},
          {'sym': 'BTCUSD', 'market': 'fx', 'group': 'crypto', 'tf': 'H4', 'x': 2.9, 'pct': -2.1, 'range_pct': 2.6, 'ctx': ''},
          {'sym': 'NVDA', 'market': 'stock', 'group': 'stock', 'tf': 'H1', 'x': 3.1, 'pct': -2.4, 'range_pct': 2.8, 'ctx': ''}]


# ---- state + the app file ------------------------------------------------------------------------------------------
def load_state(path: str = STATE) -> Dict:
    try:
        with open(path) as f:
            v = json.load(f)
        return v if isinstance(v, dict) else {}
    except (OSError, ValueError):
        return {}


def save_state(st: Dict, path: str = STATE) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sent = dict(sorted((st.get('sent') or {}).items(), key=lambda kv: kv[1])[-400:])
    with open(path, 'w') as f:
        json.dump({**st, 'sent': sent}, f)


KEEP = {'H1': 72, 'H4': 18, 'D1': 21, 'W1': 3}               # sections per timeframe kept in latest.json
KEEP_DAYS = {'H1': 3, 'H4': 3, 'D1': 21, 'W1': 21}             # 1H / 4H: 3 days, 1D / 1W: 3 weeks


def _app_row(r: Dict) -> Dict:
    out = {k: r[k] for k in ('sym', 'group', 'market') if k in r}
    out.update({'pct': round(r['pct'], 3), 'x': round(r['x'], 2), 'range_pct': round(r.get('range_pct', 0), 3)})
    for k in ('ctx',):
        if r.get(k):
            out[k] = r[k]
    if r.get('tags'):
        out['tags'] = list(r['tags'])
    w = r.get('why') or {}
    if w.get('title'):
        out['why'] = {'title': w['title'], 'url': w.get('url') or ''}
    return out


def write_latest(secs: Sequence[Dict], now: dt.datetime, path: str = LATEST) -> None:
    """public/movers/latest.json: the newest sections of each timeframe (EVERY qualifier, also empty closes)."""
    try:
        with open(path) as f:
            old = json.load(f)
    except (OSError, ValueError):
        old = {}
    keep: Dict[Tuple[str, str], Dict] = {(s['tf'], s['close']): s for s in old.get('sections') or [] if isinstance(s, dict) and s.get('tf') in SPAN_H}
    for s in secs:
        prev = keep.get((s['tf'], s['close']))
        rows = [_app_row(r) for r in s['rows']]
        if prev:                                             # a held section re-sent: merge, newest wins
            have = {(r['sym'], r.get('group')) for r in rows}
            rows += [r for r in prev.get('rows') or [] if (r.get('sym'), r.get('group')) not in have]
            fams = sorted(set(prev.get('fams') or []) | set(s['fams']), key=['fx', 'crypto', 'stock'].index)
        else:
            fams = list(s['fams'])
        keep[(s['tf'], s['close'])] = {'tf': s['tf'], 'close': s['close'], 'fams': fams, 'feed': s.get('feed') or (prev or {}).get('feed', ''),
                                       'label': span_label(s['tf'], _t(s['close']), fams), 'rows': rows}
    out = []
    for tf in TFS:                                           # older than the app's window: dropped
        cutoff = now - dt.timedelta(days=KEEP_DAYS[tf])
        out += sorted((s for s in keep.values() if s['tf'] == tf and _t(s['close']) >= cutoff), key=lambda s: s['close'], reverse=True)[:KEEP[tf]]
    os.makedirs(os.path.dirname(path), exist_ok=True)
    body = {'version': 1, 'generated': now.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ'), 'min_x': MIN_X, 'min_pct': MIN_PCT,
            'gap_pct': GAP_PCT, 'groups': GROUP_NAME, 'sections': out}
    with open(path, 'w') as f:
        json.dump(body, f, separators=(',', ':'), ensure_ascii=False)


# ---- main ----------------------------------------------------------------------------------------------------------
def collect(events, now, get, log):
    """Measured rows of every due event + the stock feed labels."""
    closes = {fam: {tf: c for tf, f, c in events if f == fam} for fam in PLAN}
    rows: List[Dict] = []
    rows += fx_rows([tf for tf in TFS if tf in closes['fx']], closes['fx'], get, log)
    rows += crypto_rows([tf for tf in TFS if tf in closes['crypto']], closes['crypto'], now, get, log)
    st, feeds = stock_rows([tf for tf in TFS if tf in closes['stock']], closes['stock'], now, get, log)
    return rows + st, feeds


def run(now: dt.datetime, get: Getter = get_json, test: bool = False, notify: bool = True, prefs: Optional[Dict] = None,
        state_path: str = STATE, send: Callable[[List], bool] = SN.send, log=print, latest_path: str = LATEST) -> Optional[SN.Msg]:
    now = now.astimezone(UTC)
    st = load_state(state_path)
    sent = st.get('sent') or {}
    events = due_events(now, sent, test)
    log('due: ' + (', '.join(ekey(*e) for e in events) or 'nothing new'))
    held = [s for s in st.get('held') or [] if now - _t(s['close']) < dt.timedelta(hours=48)]
    if not events and not held:
        return None
    rows, feeds = collect(events, now, get, log) if events else ([], {})
    muted = P.muted_set(prefs, now)
    rows = [r for r in rows if r['sym'] not in muted]
    measured = {(r['tf'], r['fam']) for r in rows}
    secs = sections_of([], events, feeds)
    for s in secs:
        pool = [r for r in rows if r['tf'] == s['tf'] and r['close_t'] == s['close']]
        s['rows'] = [q for g in GROUPS for q in select([r for r in pool if r['group'] == g], test)]
        s['rows'].sort(key=lambda r: -score(r))
    if test and not any(s['rows'] for s in secs):
        log('test: no live data, sample lines')
        secs = []
        for tf in TFS:
            c = latest_close(tf, 'fx', now) or now
            rs = [{**m, 'close': 0.0, 'tags': []} for m in SAMPLE if m['tf'] == tf]
            secs.append({'tf': tf, 'close': c.isoformat(), 'fams': ['fx'], 'feed': 'IEX real-time', 'rows': rs})
    else:
        fx_pub, st_pub = load_public('fx/latest.json'), load_public('scanner/latest.json')
        st_pub['_ix'] = {t['s']: t for t in load_public('scanner/index.json').get('tickers') or [] if t.get('s')}
        shards: Dict[str, Dict] = {}

        def shard(p):
            if p not in shards:
                shards[p] = load_public(p)
            return shards[p]
        for s in secs:
            for r in s['rows']:
                try:
                    r['ctx'] = context(r, fx_pub, st_pub, shard)
                except Exception:  # noqa: BLE001
                    r['ctx'] = ''
            if s['rows'] and get is get_json:                          # offline tests: no news
                why = news_why(s['rows'][:WHY_TOP], now, log, hours=WHY_H[s['tf']])
                for r in s['rows']:
                    if r['sym'] in why:
                        r['why'] = why[r['sym']]
    quiet = P.in_quiet(prefs, now) and not test
    hour = now.strftime('%Y-%m-%dT%H')
    hold_new: List[Dict] = []
    if test:
        out = secs
    else:
        higher = [s for s in secs if s['tf'] != 'H1' and s['rows']]
        h1 = [s for s in secs if s['tf'] == 'H1']
        if quiet or st.get('last_msg_hour') == hour:
            hold_new = [{**s, 'held': True} for s in higher]
            out = h1 if st.get('last_msg_hour') != hour else []
            if hold_new:
                log(f"{len(hold_new)} higher-timeframe section(s) held ({'quiet hours' if quiet else 'already one message this hour'})")
        else:
            out = [{**s, 'held': True} for s in held] + higher + h1
            out.sort(key=lambda s: (-RANK[s['tf']], s['close']))
    msg = build(out, test=test, silent=quiet)

    def done(ok_events):
        if test:
            return
        for tf, fam, c in ok_events:
            sent[ekey(tf, fam, c)] = now.isoformat()
        st['sent'] = sent
        st['held'] = (held if (quiet or st.get('last_msg_hour') == hour) else []) + hold_new
        if msg is not None:
            st['last_msg_hour'] = hour
        save_state(st, state_path)
        okset = {(e[0], e[1]) for e in ok_events}
        app = [s for s in secs if any((s['tf'], f) in okset for f in s['fams'])]
        if any(s['rows'] or s['tf'] != 'H1' for s in app):         # quiet 1H-only hours: no file change, no commit
            try:
                write_latest(app, now, latest_path)
            except OSError as e:
                log(f'latest.json not written ({type(e).__name__})')
    # an event with no measured candle at all (data not there yet) is tried again by the next run in its window
    ok_events = [e for e in events if (e[0], e[1]) in measured or test]
    for e in events:
        if e not in ok_events:
            log(f'{ekey(*e)}: no candle measured yet: retried next run')
    if msg is None:
        log('nothing qualifies (>= %gx the 20-candle average + the minimum %%): no message' % MIN_X)
        done(ok_events)
        return None
    n = sum(len(s['rows']) for s in out if s['rows'])
    log(f"{n} line(s) in {sum(1 for s in out if s['rows'])} section(s){' (quiet hours: silent)' if quiet else ''}")
    if not notify:
        print(msg)
        return msg
    ok = send([msg])
    log('sent' if ok else 'NOT sent (Telegram not configured or refused)')
    if ok:
        done(ok_events)
        if not test:
            to_guests(out, prefs, now, log)
    return msg


GUEST_MARKET = {'fx': 'fx', 'idx': 'indices', 'crypto': 'crypto', 'stock': 'stocks'}   # GROUPS -> guests.py MARKETS


def guest_message(g: Dict, secs: Sequence[Dict], now: Optional[dt.datetime] = None) -> List:
    """One guest's big moves (stock_scanner/guests.py): only the lines of their markets, not their mutes, silent in their
    quiet hours (sent right away, never held)."""
    import guests as G                                   # noqa: WPS433
    mu = G.muted(g, now=now)
    mine = [{**s, 'rows': [r for r in s['rows'] if r['sym'] not in mu and G.wants(g, GUEST_MARKET.get(r.get('group'), G.market_of(r['sym'])))]} for s in secs if s.get('rows')]
    m = build(mine, silent=P.in_quiet(g, now))
    return [m] if m is not None else []


def to_guests(secs: Sequence[Dict], prefs: Optional[Dict], now: dt.datetime, log=print) -> None:
    try:
        import guests as G                               # noqa: WPS433
        G.broadcast(lambda g: guest_message(g, secs, now), prefs, log=log, what='big moves')
    except Exception as e:  # noqa: BLE001
        log(f'guests: big moves skipped ({type(e).__name__})')


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--test', action='store_true', help="send ONE '🧪 Sample big moves (all timeframes)' message")
    ap.add_argument('--no-notify', action='store_true', help='print the message instead of sending it')
    ap.add_argument('--now', default='', help='pretend it is this UTC time (ISO), for a re-run')
    a = ap.parse_args(argv)
    now = dt.datetime.fromisoformat(a.now.replace('Z', '+00:00')) if a.now else dt.datetime.now(UTC)
    if now.tzinfo is None:
        now = now.replace(tzinfo=UTC)
    prefs = P.fetch(log=print)
    run(now, test=a.test, notify=not a.no_notify, prefs=prefs)
    return 0


if __name__ == '__main__':
    sys.exit(main())
