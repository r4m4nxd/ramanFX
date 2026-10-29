"""Deep market-hours study: best Calgary clock times and weekdays for EVERY scanned instrument, full history.

    python deep.py calendar --out cal.json                       # FOMC + NFP dates (federalreserve.gov / bls.gov)
    python deep.py fx --shard 0 --shards 2 --cal cal.json --out out/fx_0.json
    python deep.py stocks --shard 0 --shards 4 --cal cal.json --out out/stocks_0.json
    python deep.py report --in out --cal cal.json                # merge -> JSON, Markdown, heatmaps (report.py)
    python deep.py selftest                                      # synthetic data end to end (no network)

Data (the repo's clients, no new HTTP code: tools/stock_scanner/data.py http_get = budget, breaker, pacing):
  forex / metals / CFDs  OANDA v20 M30 mid candles + tick volume, every instrument the FX scanner covers (account list,
                         CURRENCY + METAL + CFD), from 2005 or the first candle OANDA has. Cached as compact .npz per
                         instrument (actions/cache) and topped up incrementally.
  US stocks              Alpaca /v2/stocks/bars 30Min, feed sip, raw prices (unadjusted: a cache stays valid after a
                         split; the per-month normalisation makes ranges unit-free), pre + regular + post market, from
                         2016 (Alpaca's start), every universe.csv row with a US listing (SPX, NDX, DJI, TSX60 / TSX
                         interlisted, ADR, TOP).

Per instrument (all clock times America/Edmonton, DST per date; New York = Calgary + 2 h all year):
  rel_vol / rel_range = 30-minute bucket volume / high-low divided by the median bucket of the same instrument and
  calendar month (forex: all buckets; stocks: regular-session buckets). activity = sqrt(rel_vol x rel_range).
  Big move = rel_range > 2. Best windows = the 3 strongest peaks of the Mon-Fri median activity profile (48
  half-hours). Weekdays: daily volume and range relative to the month's median day -> median day activity per weekday,
  best / quietest, ratio with a bootstrap 95% CI. Reliability: 'reliable' when the first and second half of the
  sample agree (profile Spearman >= 0.8 and the best half-hour within 10% of the maximum in both halves; weekdays: CI excludes 1 and both
  halves pick the same best day), else 'weak'. Era check: profile of the last 2 years and of pre-2020 vs 2020+.
  NFP / FOMC: range of the event half-hour on event days / the same half-hour on control days.
Descriptive statistics only: no trading-profit claim.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import re
import sys
import threading
import time
import traceback
import urllib.error
import urllib.parse
import zlib
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
FX_DIR = os.path.join(ROOT, 'tools', 'fx_scanner')
STOCK_DIR = os.path.join(ROOT, 'tools', 'stock_scanner')
for _p in (HERE, FX_DIR, STOCK_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import data as SD  # noqa: E402  (stock scanner network layer)

UTC = dt.timezone.utc
MT = ZoneInfo('America/Edmonton')
NY = ZoneInfo('America/New_York')
LDN = ZoneInfo('Europe/London')
WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
SLOT = 1800
NS = 48
BIG_X = 2.0
FX_FROM = dt.datetime(2005, 1, 1, tzinfo=UTC)
STOCK_FROM = dt.datetime(2016, 1, 1, tzinfo=UTC)
CACHE = os.environ.get('MH_CACHE') or os.path.join(HERE, '.cache')
LOCK = threading.Lock()
LOG: List[str] = []


def log(*a):
    s = ' '.join(str(x) for x in a)
    with LOCK:
        LOG.append(s)
    print(s, flush=True)


def slot_name(i: int) -> str:
    return f'{i // 2:02d}:{30 * (i % 2):02d}'


def ny_name(i: int) -> str:
    return slot_name((i + 4) % NS)          # New York = Calgary + 2 h (both on US DST dates)


def shard_of(name: str, n: int) -> int:
    return zlib.crc32(name.encode()) % max(1, n)


# ---- time zones (hourly UTC-offset tables, vectorised) ----------------------------------------------------------------
class Off:
    T0 = int(dt.datetime(2004, 1, 1, tzinfo=UTC).timestamp())
    N = 24 * 366 * 25

    def __init__(self, zone):
        t = self.T0
        out = np.empty(self.N, dtype=np.int32)
        cur = None
        # offsets change only at whole UTC hours for these zones: probe every hour, but via daily steps + refinement
        day = 0
        while day * 24 < self.N:
            a = int(dt.datetime.fromtimestamp(t + day * 86400, zone).utcoffset().total_seconds())
            b = int(dt.datetime.fromtimestamp(t + day * 86400 + 86399, zone).utcoffset().total_seconds())
            lo, hi = day * 24, min(self.N, day * 24 + 24)
            if a == b:
                out[lo:hi] = a
            else:
                for hh in range(lo, hi):
                    out[hh] = int(dt.datetime.fromtimestamp(t + hh * 3600, zone).utcoffset().total_seconds())
            day += 1
            cur = b
        self.off = out
        del cur

    def __call__(self, ts: np.ndarray) -> np.ndarray:
        return self.off[(np.asarray(ts, dtype=np.int64) - self.T0) // 3600]


_OFF: Dict[str, Off] = {}


def off(name: str) -> Off:
    with LOCK:
        if name not in _OFF:
            _OFF[name] = Off({'mt': MT, 'ny': NY, 'ldn': LDN}[name])
        return _OFF[name]


# ---- calendar: FOMC + NFP ---------------------------------------------------------------------------------------------
FOMC_FALLBACK = ['2024-01-31', '2024-03-20', '2024-05-01', '2024-06-12', '2024-07-31', '2024-09-18', '2024-11-07',
                 '2024-12-18', '2025-01-29', '2025-03-19', '2025-05-07', '2025-06-18', '2025-07-30', '2025-09-17',
                 '2025-10-29', '2025-12-10', '2026-01-28', '2026-03-18', '2026-04-29', '2026-06-17', '2026-07-29',
                 '2026-09-16', '2026-10-28', '2026-12-09']
NFP_KNOWN_MOVES = {'2025-10-03': None, '2025-11-07': None, '2025-11-20': True, '2025-12-16': True,
                   '2026-01-02': None, '2026-01-09': True}
BROWSER = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9'}
MONTHS = {m: i + 1 for i, m in enumerate(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'])}


def _get_text(url: str) -> str:
    return SD.http_get(url, headers=BROWSER, accept=BROWSER['Accept'], retries=2).decode('utf-8', 'replace')


def fomc_from_pages(pages: Dict[str, str]) -> List[str]:
    """Statement dates from the Fed's calendar / historical pages: links to the statement press releases
    (/newsevents/pressreleases/monetaryYYYYMMDDa.htm; before 2006 /boarddocs/press/monetary/YYYY/YYYYMMDD/)."""
    out = set()
    for txt in pages.values():
        for m in re.finditer(r'pressreleases/monetary(\d{8})a\.htm', txt):
            out.add(m.group(1))
        for m in re.finditer(r'/press/monetary/(\d{8})a\.htm', txt):
            out.add(m.group(1))
        for m in re.finditer(r'boarddocs/press/monetary/\d{4}/(\d{8})/', txt):
            out.add(m.group(1))
    days = []
    for s in sorted(out):
        try:
            d = dt.date(int(s[:4]), int(s[4:6]), int(s[6:]))
        except ValueError:
            continue
        if d.weekday() < 5:
            days.append(d.isoformat())
    return days


def nfp_from_pages(archive: str, schedule: str, today: dt.date) -> List[str]:
    """Employment Situation release dates: the BLS archive links (empsit_MMDDYYYY.htm) + this year's schedule table."""
    out = set()
    for m in re.finditer(r'empsit_(\d{2})(\d{2})(\d{4})\.htm', archive or ''):
        try:
            out.add(dt.date(int(m.group(3)), int(m.group(1)), int(m.group(2))))
        except ValueError:
            pass
    for m in re.finditer(r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),\s+(\d{4})', schedule or ''):
        try:
            d = dt.date(int(m.group(3)), MONTHS[m.group(1).lower()], int(m.group(2)))
        except ValueError:
            continue
        if d <= today and d.weekday() < 5:
            out.add(d)
    return sorted(d.isoformat() for d in out if d.year >= 2004)


def nfp_rule(a: dt.date, b: dt.date) -> List[str]:
    """Fallback: BLS rule = the third Friday after the week (Sun-Sat) that contains the 12th of the reference month,
    plus the releases known to have moved (2025 shutdown, Jan 2026)."""
    out = set()
    y, m = a.year, a.month
    while dt.date(y, m, 1) <= b:
        d12 = dt.date(y, m, 12)
        sat = d12 + dt.timedelta(days=(5 - d12.weekday()) % 7)
        rel = sat + dt.timedelta(days=20)
        if rel.month == 7 and rel.day == 4:
            rel -= dt.timedelta(days=1)
        if a <= rel <= b:
            out.add(rel.isoformat())
        m += 1
        if m == 13:
            y, m = y + 1, 1
    for k, v in NFP_KNOWN_MOVES.items():
        if v:
            out.add(k)
        else:
            out.discard(k)
    return sorted(out)


def cmd_calendar(args) -> int:
    SD.set_budget(10)
    today = dt.datetime.now(UTC).date()
    diag = {}
    pages = {}
    urls = ['https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'] + [
        f'https://www.federalreserve.gov/monetarypolicy/fomchistorical{y}.htm' for y in range(2005, today.year - 3)]
    for u in urls:
        try:
            pages[u] = _get_text(u)
        except Exception as e:  # noqa: BLE001 - diagnostics only
            diag[u] = f'{type(e).__name__} {getattr(e, "code", "")}'
    fomc = fomc_from_pages(pages)
    per_year = {}
    for d in fomc:
        per_year[d[:4]] = per_year.get(d[:4], 0) + 1
    fomc_src = 'federalreserve.gov statement links' if len(fomc) >= 40 else 'hard-coded 2024-2026 (Fed site not reachable)'
    if len(fomc) < 40:
        fomc = sorted(set(fomc) | set(FOMC_FALLBACK))
    arch = sched = ''
    for u, k in (('https://www.bls.gov/bls/news-release/empsit.htm', 'a'), ('https://www.bls.gov/schedule/news_release/empsit.htm', 's')):
        try:
            t = _get_text(u)
            if k == 'a':
                arch = t
            else:
                sched = t
        except Exception as e:  # noqa: BLE001
            diag[u] = f'{type(e).__name__} {getattr(e, "code", "")}'
    nfp = nfp_from_pages(arch, sched, today)
    if len(nfp) >= 100:
        nfp_src = 'bls.gov release archive + schedule'
    else:
        nfp_src = 'BLS release rule (third Friday after the week containing the 12th) + known 2025-26 moves (bls.gov not reachable)'
        nfp = nfp_rule(dt.date(2004, 1, 1), today)
    nper = {}
    for d in nfp:
        nper[d[:4]] = nper.get(d[:4], 0) + 1
    out = {'generated': dt.datetime.now(UTC).isoformat(timespec='seconds'), 'fomc': fomc, 'fomc_source': fomc_src,
           'fomc_per_year': per_year, 'nfp': nfp, 'nfp_source': nfp_src, 'nfp_per_year': nper, 'errors': diag,
           'pages_ok': len(pages)}
    with open(args.out, 'w') as f:
        json.dump(out, f, indent=1)
    log(f'calendar: {len(fomc)} FOMC ({fomc_src}), {len(nfp)} NFP ({nfp_src}); errors {len(diag)}')
    return 0


# ---- caches -----------------------------------------------------------------------------------------------------------
def cache_path(kind: str, name: str) -> str:
    return os.path.join(CACHE, kind, re.sub(r'[^A-Za-z0-9_.-]', '_', name) + '.npz')


def load_cache(kind: str, name: str):
    try:
        z = np.load(cache_path(kind, name))
        return z['t'].astype(np.int64), z['v'].astype(np.float64), z['h'].astype(np.float64), z['l'].astype(np.float64)
    except (OSError, KeyError, ValueError):
        return None


def save_cache(kind: str, name: str, t, v, h, l) -> None:
    p = cache_path(kind, name)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    np.savez_compressed(p + '.tmp.npz', t=t.astype(np.int32), v=v.astype(np.float32), h=h.astype(np.float32),
                        l=l.astype(np.float32))
    os.replace(p + '.tmp.npz', p)


def merge(old, rows: Dict[int, Tuple[float, float, float]]):
    """old arrays + new {t: (v, h, l)} (new wins) -> sorted arrays."""
    if old is not None:
        t0, v0, h0, l0 = old
        keep = ~np.isin(t0, np.fromiter(rows.keys(), dtype=np.int64, count=len(rows))) if rows else np.ones(len(t0), bool)
        t0, v0, h0, l0 = t0[keep], v0[keep], h0[keep], l0[keep]
    else:
        t0 = v0 = h0 = l0 = np.zeros(0)
    if rows:
        ks = np.fromiter(rows.keys(), dtype=np.int64, count=len(rows))
        arr = np.array(list(rows.values()), dtype=np.float64)
        t = np.concatenate([t0.astype(np.int64), ks])
        v = np.concatenate([v0, arr[:, 0]])
        h = np.concatenate([h0, arr[:, 1]])
        l = np.concatenate([l0, arr[:, 2]])
    else:
        t, v, h, l = t0.astype(np.int64), v0, h0, l0
    o = np.argsort(t, kind='stable')
    return t[o], v[o], h[o], l[o]


def _epoch(s: str) -> int:
    s = s.replace('Z', '')
    if '.' in s:
        s = s.split('.')[0]
    return int(dt.datetime.fromisoformat(s).replace(tzinfo=UTC).timestamp())


# ---- OANDA -----------------------------------------------------------------------------------------------------------
def fx_universe() -> List[Dict]:
    import fxcfg as C
    import oanda
    import watchlist as W
    insts, src = oanda.account_instruments(log=log)
    known = {i['name'] for i in insts}
    wl = W.load(known)
    out = []
    for i in C.select(insts, True):
        n = i['name']
        out.append({'name': n, 'sym': W.pepper_symbol(n), 'cls': i['cls'], 'group': wl['sections'].get(n, ''),
                    'display': i.get('displayName') or n, 'wl': n in wl['sections']})
    log(f'fx universe: {len(out)} instruments ({src}), watchlist {sum(1 for x in out if x["wl"])}')
    return out


def _oanda_get(name: str, frm: dt.datetime, count: int) -> Dict:
    import oanda
    q = {'granularity': 'M30', 'price': 'M', 'count': str(count), 'from': frm.strftime('%Y-%m-%dT%H:%M:%SZ')}
    url = f'https://{oanda.host()}/v3/instruments/{urllib.parse.quote(name)}/candles?' + urllib.parse.urlencode(q)
    return json.loads(oanda.default_get(url))


def fetch_oanda(name: str, end: dt.datetime):
    """M30 candles from the cached last bar (or 2005). A 5xx / timeout / open breaker is retried with a back-off and
    a smaller page; whatever arrived is saved to the cache even when the instrument finally fails (the next run
    continues from there)."""
    old = load_cache('fx', name)
    frm = dt.datetime.fromtimestamp(int(old[0][-1]) + 1, UTC) if old is not None and len(old[0]) else FX_FROM
    end_ts = int(end.timestamp())
    rows: Dict[int, Tuple[float, float, float]] = {}
    req = 0
    count = 5000
    try:
        while frm.timestamp() < end_ts:
            for k in range(7):
                try:
                    js = _oanda_get(name, frm, count)
                    break
                except urllib.error.HTTPError as e:
                    if e.code not in (429, 500, 502, 503, 504) or k == 6:
                        raise
                except (SD.HostDown, urllib.error.URLError, TimeoutError, ConnectionError) as e:
                    if k == 6:
                        raise
                    del e
                count = max(500, count // 2)
                time.sleep(min(90, 10 * (k + 1)))
            req += 1
            cs = js.get('candles') or []
            last = None
            for c in cs:
                t = _epoch(str(c.get('time')))
                last = t
                if not c.get('complete') or t >= end_ts:
                    continue
                m = c.get('mid') or {}
                try:
                    rows[t] = (float(c.get('volume') or 0), float(m['h']), float(m['l']))
                except (KeyError, TypeError, ValueError):
                    continue
            if last is None:
                frm = frm + dt.timedelta(seconds=count * SLOT)          # before the instrument's history: jump ahead
            else:
                nxt = dt.datetime.fromtimestamp(last + 1, UTC)
                if nxt <= frm:
                    break
                frm = nxt
                if last >= end_ts:
                    break
            count = min(5000, count * 2)
    finally:
        t, v, h, l = merge(old, rows)
        if len(t):
            save_cache('fx', name, t, v, h, l)
    return (t, v, h, l), req


# ---- Alpaca ----------------------------------------------------------------------------------------------------------
def stock_universe() -> List[Dict]:
    import universe as U
    rows = U.load(indexes=list(U.INDEX_META))
    out = []
    for r in rows:
        if r.get('feed') == 'tsx' or r['symbol'].endswith('.TO'):
            continue
        sec = r.get('sector') or 'Other'
        out.append({'name': r['symbol'], 'sym': r['symbol'], 'cls': 'stock', 'group': sec if sec != 'Other' else 'Other (top liquid)',
                    'display': r.get('name') or r['symbol'], 'idx': r.get('indexes', ''), 'wl': False})
    for e in ('SPY', 'QQQ', 'IWM', 'DIA'):
        if not any(x['name'] == e for x in out):
            out.append({'name': e, 'sym': e, 'cls': 'etf', 'group': 'ETF', 'display': e, 'idx': 'ETF', 'wl': False})
    log(f'stock universe: {len(out)} symbols')
    return out


def fetch_alpaca(names: List[str], end: dt.datetime) -> Tuple[Dict[str, tuple], int]:
    """30Min bars for a batch of symbols, from each one's cached last bar (or 2016)."""
    olds = {n: load_cache('stk', n) for n in names}
    starts = [dt.datetime.fromtimestamp(int(o[0][-1]) + 1, UTC) if o is not None and len(o[0]) else STOCK_FROM for o in olds.values()]
    start = min(starts)
    asked = {SD.alpaca_symbol(n): n for n in names}
    rows: Dict[str, Dict[int, Tuple[float, float, float]]] = {n: {} for n in names}
    token = ''
    pages = 0

    def flush():
        out = {}
        for n in names:
            t, v, h, l = merge(olds[n], rows[n])
            if len(t) and rows[n]:
                save_cache('stk', n, t, v, h, l)
            out[n] = (t, v, h, l)
        return out
    try:
        pages = _alpaca_pages(asked, start, end, rows)
    except Exception:
        flush()              # keep what arrived: the next run resumes each symbol from its last bar
        raise
    return flush(), pages


def _alpaca_pages(asked: Dict[str, str], start: dt.datetime, end: dt.datetime, rows) -> int:
    token = ''
    pages = 0
    while True:
        def url_of(feed, t=token):
            q = {'symbols': ','.join(sorted(asked)), 'timeframe': '30Min', 'start': start.strftime('%Y-%m-%dT%H:%M:%SZ'),
                 'end': end.strftime('%Y-%m-%dT%H:%M:%SZ'), 'adjustment': 'raw', 'feed': feed,
                 'limit': str(SD.ALPACA_LIMIT), 'sort': 'asc'}
            if t:
                q['page_token'] = t
            return SD.ALPACA_BARS + '?' + urllib.parse.urlencode(q, safe=',:')
        js = json.loads(SD._alpaca_get(url_of, log))
        pages += 1
        for sym, rs in (js.get('bars') or {}).items():
            n = asked.get(sym)
            if n is None:
                continue
            d = rows[n]
            for r in rs or []:
                try:
                    d[_epoch(str(r['t']))] = (float(r.get('v') or 0), float(r['h']), float(r['l']))
                except (KeyError, TypeError, ValueError):
                    continue
        token = js.get('next_page_token') or ''
        if not token:
            break
    return pages


# ---- statistics helpers ----------------------------------------------------------------------------------------------
def gmed(keys: np.ndarray, nk: int, *vals: np.ndarray):
    """Per key: medians of each value array + counts (keys 0..nk-1)."""
    o = np.argsort(keys, kind='stable')
    k = keys[o]
    b = np.searchsorted(k, np.arange(nk + 1))
    cnt = np.diff(b)
    outs = []
    for x in vals:
        xs = x[o]
        m = np.full(nk, np.nan)
        for i in range(nk):
            if cnt[i]:
                m[i] = np.median(xs[b[i]:b[i + 1]])
        outs.append(m)
    return outs, cnt


def gmean(keys: np.ndarray, nk: int, x: np.ndarray) -> np.ndarray:
    s = np.bincount(keys, weights=x, minlength=nk)
    c = np.bincount(keys, minlength=nk)
    with np.errstate(invalid='ignore', divide='ignore'):
        return np.where(c > 0, s / np.maximum(c, 1), np.nan)


def spearman(a, b) -> Optional[float]:
    a, b = np.asarray(a, float), np.asarray(b, float)
    ok = np.isfinite(a) & np.isfinite(b)
    if ok.sum() < 8:
        return None

    def rank(x):
        o = np.argsort(x, kind='stable')
        r = np.empty(len(x))
        r[o] = np.arange(len(x))
        # average ties
        _, inv, cnt = np.unique(x, return_inverse=True, return_counts=True)
        s = np.bincount(inv, weights=r)
        return (s / cnt)[inv]
    ra, rb = rank(a[ok]), rank(b[ok])
    if ra.std() == 0 or rb.std() == 0:
        return None
    c = np.corrcoef(ra, rb)[0, 1]
    return None if not np.isfinite(c) else float(c)


def r2(x, n=2):
    return None if x is None or not np.isfinite(x) else round(float(x), n)


def peaks(score: np.ndarray, thr: float = 1.0, frac: float = 0.67, k: int = 3) -> List[Dict]:
    """The k strongest local peaks of a 48-slot activity profile (score >= thr), each with its window: neighbouring
    half-hours that keep >= frac of the peak while falling away from it (5% tolerance). Falls back to the top slots
    when there are fewer peaks."""
    sc = np.nan_to_num(np.asarray(score, float), nan=0.0)
    used = set()
    out = []
    for i in np.argsort(-sc, kind='stable'):
        i = int(i)
        if len(out) >= k or sc[i] <= 0:
            break
        if i in used:
            continue
        if (i > 0 and sc[i - 1] > sc[i]) or (i + 1 < NS and sc[i + 1] > sc[i]):
            continue
        if sc[i] < thr and out:
            break
        lo = hi = i
        while lo - 1 >= 0 and lo - 1 not in used and sc[lo - 1] >= frac * sc[i] and sc[lo - 1] <= 1.05 * sc[lo] and sc[lo - 1] > 0:
            lo -= 1
        while hi + 1 < NS and hi + 1 not in used and sc[hi + 1] >= frac * sc[i] and sc[hi + 1] <= 1.05 * sc[hi] and sc[hi + 1] > 0:
            hi += 1
        used |= set(range(lo, hi + 1))
        out.append({'slot': i, 'lo': lo, 'hi': hi})
    return out


# ---- per-instrument analysis -----------------------------------------------------------------------------------------
class Events:
    """Event bucket timestamps for every date 2004 -> today (computed once, looked up per instrument)."""

    def __init__(self, cal: Dict, today: dt.date):
        a = dt.date(2004, 1, 1)
        days = [a + dt.timedelta(days=i) for i in range((today - a).days + 1)]
        fomc = {dt.date.fromisoformat(x) for x in cal.get('fomc') or []}
        nfp = {dt.date.fromisoformat(x) for x in cal.get('nfp') or []}

        def ts(ds, hh, mm, tz=NY):
            return np.array([int(dt.datetime(d.year, d.month, d.day, hh, mm, tzinfo=tz).timestamp()) for d in ds], dtype=np.int64)
        fri = [d for d in days if d.weekday() == 4]
        self.nfp_days = sorted(nfp)
        self.nfp_ctrl = [d for d in fri if d not in nfp]
        fwd = {d.weekday() for d in fomc}
        self.fomc_days = sorted(fomc)
        self.fomc_ctrl = [d for d in days if d.weekday() in fwd and d not in fomc]
        self.t = {}
        for k, ds in (('nfp', self.nfp_days), ('nfpc', self.nfp_ctrl)):
            self.t[k + '0830'] = ts(ds, 8, 30)
            self.t[k + '0930'] = ts(ds, 9, 30)
        for k, ds in (('fomc', self.fomc_days), ('fomcc', self.fomc_ctrl)):
            self.t[k + '1400'] = ts(ds, 14, 0)
            self.t[k + '1430'] = ts(ds, 14, 30)


def _lookup(t: np.ndarray, x: np.ndarray, want: np.ndarray) -> np.ndarray:
    if not len(t) or not len(want):
        return np.zeros(0)
    i = np.searchsorted(t, want)
    i = np.clip(i, 0, len(t) - 1)
    ok = t[i] == want
    return x[i[ok]]


def ratio(t, rr, ev, ctrl) -> Optional[Dict]:
    e, c = _lookup(t, rr, ev), _lookup(t, rr, ctrl)
    e, c = e[np.isfinite(e)], c[np.isfinite(c)]
    if len(e) < 5 or len(c) < 10:
        return None
    me, mc = float(np.median(e)), float(np.median(c))
    if mc <= 0:
        return None
    return {'x': r2(me / mc), 'n': int(len(e)), 'nc': int(len(c)), 'big': r2(100 * float(np.mean(e > BIG_X)), 1),
            'bigc': r2(100 * float(np.mean(c > BIG_X)), 1)}


def fill_stock_gaps(t, v, h, l, ny_day):
    """Missing 30-min bars inside a stock's trading day (first -> last bar) had no trade: volume 0, range 0."""
    if not len(t):
        return t, v, h, l
    u, first = np.unique(ny_day, return_index=True)
    last = np.r_[first[1:], len(t)] - 1
    lens = (t[last] - t[first]) // SLOT + 1
    full = np.repeat(t[first], lens) + SLOT * (np.arange(lens.sum()) - np.repeat(np.cumsum(lens) - lens, lens))
    miss = full[~np.isin(full, t)]
    if not len(miss):
        return t, v, h, l
    mid = np.zeros(len(miss))
    t2 = np.concatenate([t, miss])
    o = np.argsort(t2, kind='stable')
    hv = np.concatenate([h, mid])
    lv = np.concatenate([l, mid])
    return t2[o], np.concatenate([v, mid])[o], hv[o], lv[o]


def profile(keys_slot: np.ndarray, rv, rr, mask) -> np.ndarray:
    (mv, mr), cnt = gmed(keys_slot[mask], NS, rv[mask], rr[mask])
    sc = np.sqrt(np.maximum(mv, 0) * np.maximum(mr, 0))
    sc[cnt < 20] = np.nan
    return sc


def analyse(meta: Dict, t, v, h, l, stock: bool, ev: Events) -> Optional[Dict]:
    t = np.asarray(t, np.int64)
    if len(t) < 2000:
        return None
    oy = off('ny')(t)
    if stock:
        ny_day = (t + oy) // 86400
        t, v, h, l = fill_stock_gaps(t, v, h, l, ny_day)
        oy = off('ny')(t)
    rng = np.maximum(h - l, 0)
    om = off('mt')(t)
    loc = t + om
    wd = ((loc // 86400) + 3) % 7
    slot = (loc % 86400) // SLOT
    month = (loc.astype('datetime64[s]').astype('datetime64[M]')).astype(np.int64)
    nym = (t + oy) % 86400 // 60
    nywd = (((t + oy) // 86400) + 3) % 7
    regular = (nywd < 5) & (nym >= 570) & (nym < 960)
    norm_mask = regular if stock else np.ones(len(t), bool)
    mu, minv = np.unique(month, return_inverse=True)
    (mv, mr), _ = gmed(minv[norm_mask], len(mu), v[norm_mask], rng[norm_mask])
    nv, nr = mv[minv], mr[minv]
    ok = (nv > 0) & (nr > 0)
    t, v, rng, wd, slot, loc, month, regular, om, oy = (x[ok] for x in (t, v, rng, wd, slot, loc, month, regular, om, oy))
    rv, rr = v / nv[ok], rng / nr[ok]
    if len(t) < 2000:
        return None
    # cells (Calgary weekday x half-hour)
    cell = wd * NS + slot
    (cv, cr), cn = gmed(cell, 7 * NS, rv, rr)
    cb = gmean(cell, 7 * NS, (rr > BIG_X).astype(float))
    wk = wd < 5
    full = profile(slot, rv, rr, wk)
    (pv, pr), pn = gmed(slot[wk], NS, rv[wk], rr[wk])
    pb = gmean(slot[wk], NS, (rr[wk] > BIG_X).astype(float))
    # halves / eras
    mid = (int(t[0]) + int(t[-1])) // 2
    h1, h2 = profile(slot, rv, rr, wk & (t < mid)), profile(slot, rv, rr, wk & (t >= mid))
    end = int(t[-1])
    cut2020 = int(dt.datetime(2020, 1, 1, tzinfo=UTC).timestamp())
    rec = profile(slot, rv, rr, wk & (t >= end - 730 * 86400))
    pre = profile(slot, rv, rr, wk & (t < cut2020)) if (t < cut2020).sum() > 0.25 * 365 * 20 else None
    post = profile(slot, rv, rr, wk & (t >= cut2020)) if (t >= cut2020).sum() > 0.25 * 365 * 20 else None
    pk = peaks(full)
    top = []
    for p in pk:
        s = p['slot']
        top.append({'mt': slot_name(s), 'ny': ny_name(s), 'from': slot_name(p['lo']), 'to': slot_name((p['hi'] + 1) % NS),
                    'a': r2(full[s]), 'v': r2(pv[s]), 'r': r2(pr[s]), 'big': r2(100 * pb[s], 1)})
    sp_h = spearman(h1, h2)
    best = pk[0]['slot'] if pk else int(np.nanargmax(full))

    def near_top(p):
        # the best half-hour is still within 10% of the half's own maximum (a plateau of equal half-hours counts)
        if p is None or not np.isfinite(p).any() or not np.isfinite(p[best]):
            return False
        return bool(p[best] >= 0.9 * np.nanmax(p))
    wrel = 'reliable' if (sp_h is not None and sp_h >= 0.8 and near_top(h1) and near_top(h2)) else 'weak'

    def top_slot(p):
        if p is None or not np.isfinite(p).any():
            return None
        return slot_name(int(np.nanargmax(p)))
    sp_r = spearman(rec, full)
    sp_pp = spearman(pre, post) if pre is not None and post is not None else None
    tpre, tpost, trec = top_slot(pre), top_slot(post), top_slot(rec)

    def sdist(a, b):
        if a is None or b is None:
            return 0
        ia = int(a[:2]) * 2 + int(a[3:]) // 30
        ib = int(b[:2]) * 2 + int(b[3:]) // 30
        d = abs(ia - ib)
        return min(d, NS - d)
    def lost(pa, pb, ta):
        # the earlier era's peak half-hour is now clearly below the new maximum (not a near-tie between two peaks)
        if pa is None or pb is None or ta is None:
            return False
        i = int(ta[:2]) * 2 + int(ta[3:]) // 30
        return bool(np.isfinite(pb[i]) and pb[i] < 0.9 * np.nanmax(pb))
    drift = bool((sp_pp is not None and sp_pp < 0.8) or (sp_r is not None and sp_r < 0.8)
                 or (sdist(tpre, tpost) > 1 and lost(pre, post, tpre)))
    # weekdays (trading days; forex day = 17:00 -> 17:00 New York, stocks = regular session)
    if stock:
        dmask = regular
        dkey = (t + oy) // 86400
    else:
        dmask = np.ones(len(t), bool)
        dkey = (t + oy + 7 * 3600) // 86400
    dk = dkey[dmask]
    hh, ll, vv = (h[ok])[dmask], (l[ok])[dmask], v[dmask]
    days = {}
    wres = None
    if len(dk):
        u, first = np.unique(dk, return_index=True)
        dv = np.add.reduceat(vv, first)
        dh = np.maximum.reduceat(hh, first)
        dl = np.minimum.reduceat(ll, first)
        cntd = np.diff(np.r_[first, len(dk)])
        dwd = (u + 3) % 7
        dmon = (u.astype('datetime64[D]').astype('datetime64[M]')).astype(np.int64)
        typical = np.median(cntd)
        keep = (dwd < 5) & (cntd >= 0.5 * typical)
        u, dv, dr, dwd, dmon = u[keep], dv[keep], (dh - dl)[keep], dwd[keep], dmon[keep]
        mm, minv2 = np.unique(dmon, return_inverse=True)
        (mdv, mdr), _ = gmed(minv2, len(mm), dv, dr)
        with np.errstate(invalid='ignore', divide='ignore'):
            ds = np.sqrt((dv / mdv[minv2]) * (dr / mdr[minv2]))
        good = np.isfinite(ds)
        u, ds, dwd = u[good], ds[good], dwd[good]
        meds = {}
        for w in range(5):
            x = ds[dwd == w]
            if len(x) >= 20:
                meds[w] = float(np.median(x))
                days[WD[w]] = r2(meds[w])
        if len(meds) >= 4:
            bw = max(meds, key=meds.get)
            qw = min(meds, key=meds.get)
            gen = np.random.default_rng(zlib.crc32(meta['name'].encode()))
            xb, xq = ds[dwd == bw], ds[dwd == qw]
            boot = np.median(gen.choice(xb, (400, len(xb))), axis=1) / np.median(gen.choice(xq, (400, len(xq))), axis=1)
            lo_ci, hi_ci = np.percentile(boot, [2.5, 97.5])
            midd = (u[0] + u[-1]) // 2
            agree = True
            for part in (u < midd, u >= midd):
                pm = {w: float(np.median(ds[part & (dwd == w)])) for w in range(5) if (part & (dwd == w)).sum() >= 10}
                if len(pm) >= 4 and max(pm, key=pm.get) != bw:
                    agree = False
            wres = {'best': WD[bw], 'quiet': WD[qw], 'x': r2(meds[bw] / meds[qw]), 'ci': [r2(lo_ci), r2(hi_ci)],
                    'rel': 'reliable' if (lo_ci > 1.0 and agree) else 'weak', 'halves_agree': agree,
                    'n_days': int(len(u))}
    # NFP / FOMC
    nfp = ratio(t, rr, ev.t['nfp0930'] if stock else ev.t['nfp0830'], ev.t['nfpc0930'] if stock else ev.t['nfpc0830'])
    nfp_pre = ratio(t, rr, ev.t['nfp0830'], ev.t['nfpc0830']) if stock else None
    f12 = ratio(t, rr, ev.t['fomc1400'], ev.t['fomcc1400'])
    f1230 = ratio(t, rr, ev.t['fomc1430'], ev.t['fomcc1430'])
    # DST (forex): London open at 01:00 vs 02:00 Calgary in normal vs US/UK mismatch weeks; Tokyo evening by season
    dst = None
    if not stock:
        ol = off('ldn')(t)
        mis = (ol - om) != 7 * 3600
        dst = {}
        for nm, m in (('normal', ~mis), ('mismatch', mis)):
            for s in (2, 4):          # 01:00, 02:00
                x = rv[m & wk & (slot == s)]
                dst[f'{nm}_{slot_name(s)}'] = r2(float(np.median(x))) if len(x) >= 10 else None
        mdt = om == -6 * 3600
        for nm, m in (('mst', ~mdt), ('mdt', mdt)):
            for s in (34, 36):        # 17:00, 18:00
                x = rv[m & (wd != 4) & (wd != 5) & (slot == s)]
                dst[f'{nm}_{slot_name(s)}'] = r2(float(np.median(x))) if len(x) >= 10 else None
    y0 = dt.datetime.fromtimestamp(int(t[0]), UTC).date()
    y1 = dt.datetime.fromtimestamp(int(t[-1]), UTC).date()

    def rl(a, n=2):
        return [None if not np.isfinite(x) else round(float(x), n) for x in a]
    res = {
        'name': meta['name'], 'sym': meta['sym'], 'cls': meta['cls'], 'group': meta.get('group', ''),
        'display': meta.get('display', ''), 'idx': meta.get('idx', ''), 'wl': meta.get('wl', False),
        'from': y0.isoformat(), 'to': y1.isoformat(), 'years': round((y1 - y0).days / 365.25, 1), 'buckets': int(len(t)),
        'top': top, 'win_rel': wrel, 'win_halves_spearman': r2(sp_h), 'days': days, 'weekday': wres,
        'era': {'recent2y_vs_all': r2(sp_r), 'pre_vs_post2020': r2(sp_pp), 'top_pre2020': tpre, 'top_post2020': tpost,
                'top_recent2y': trec, 'drift': drift},
        'nfp': nfp, 'nfp_premarket': nfp_pre, 'fomc_1200': f12, 'fomc_1230': f1230,
        'profile': rl(full),
        'heavy': {'cell_rv': rl(cv), 'cell_rr': rl(cr), 'cell_big': rl(cb, 3), 'cell_n': cn.tolist(),
                  'prof_v': rl(pv), 'prof_r': rl(pr), 'prof_big': rl(pb, 3), 'prof_n': pn.tolist(),
                  'pre2020': rl(pre) if pre is not None else None, 'post2020': rl(post) if post is not None else None,
                  'recent2y': rl(rec), 'dst': dst},
    }
    return res


# ---- shard commands ----------------------------------------------------------------------------------------------------
def run_shard(kind: str, args) -> int:
    t0 = time.time()
    SD.set_budget(args.budget_min)
    with open(args.cal) as f:
        cal = json.load(f)
    end = dt.datetime.now(UTC) - dt.timedelta(minutes=30)
    end = end.replace(minute=0 if end.minute < 30 else 30, second=0, microsecond=0)
    ev = Events(cal, end.date())
    for z in ('mt', 'ny', 'ldn'):
        off(z)
    uni = fx_universe() if kind == 'fx' else stock_universe()
    if args.only:
        want = {x.strip().upper() for x in args.only.split(',')}
        uni = [u for u in uni if u['name'].upper() in want or u['sym'].upper() in want]
    mine = [u for u in uni if shard_of(u['name'], args.shards) == args.shard]
    if args.max:
        mine = mine[:args.max]
    log(f'{kind} shard {args.shard}/{args.shards}: {len(mine)} of {len(uni)}')
    results, errors, stats = [], {}, {'requests': 0}
    lock = threading.Lock()

    def work_one(meta, arrays):
        try:
            r = analyse(meta, *arrays, stock=(kind == 'stocks'), ev=ev)
            with lock:
                if r:
                    results.append(r)
                else:
                    errors[meta['name']] = f'too little data ({len(arrays[0])} bars)'
        except Exception as e:  # noqa: BLE001 - one instrument never stops the shard
            with lock:
                errors[meta['name']] = f'analyse {type(e).__name__}: {e} | {traceback.format_exc(limit=3)[-400:]}'

    if kind == 'fx':
        def job(meta):
            try:
                arrays, n = fetch_oanda(meta['name'], end)
                with lock:
                    stats['requests'] += n
            except Exception as e:  # noqa: BLE001
                with lock:
                    errors[meta['name']] = f'fetch {type(e).__name__}: {getattr(e, "code", "")} {e}'[:300]
                arrays = load_cache('fx', meta['name'])
                if arrays is None:
                    return
            work_one(meta, arrays)
            log(f'  {meta["name"]}: {len(arrays[0])} bars')
        with ThreadPoolExecutor(args.workers) as ex:
            list(ex.map(job, mine))
    else:
        SD.HOST_PAUSE['data.alpaca.markets'] = 0.31 * max(1, args.shards)     # all shards share 200 req/min
        warm = [m for m in mine if os.path.exists(cache_path('stk', m['name']))]
        cold = [m for m in mine if not os.path.exists(cache_path('stk', m['name']))]
        batches = [warm[i:i + 50] for i in range(0, len(warm), 50)] + [cold[i:i + args.batch] for i in range(0, len(cold), args.batch)]
        log(f'stocks: {len(warm)} cached (incremental), {len(cold)} cold')

        def job(batch):
            names = [m['name'] for m in batch]
            try:
                got, pages = fetch_alpaca(names, end)
                with lock:
                    stats['requests'] += pages
            except Exception as e:  # noqa: BLE001
                with lock:
                    for n in names:
                        errors[n] = f'fetch {type(e).__name__}: {getattr(e, "code", "")} {e}'[:300]
                got = {n: load_cache('stk', n) for n in names}
            for m in batch:
                arr = got.get(m['name'])
                if arr is None or not len(arr[0]):
                    errors.setdefault(m['name'], 'no bars')
                    continue
                work_one(m, arr)
            log(f'  batch {names[0]}..{names[-1]}: done ({time.time() - t0:.0f}s)')
        with ThreadPoolExecutor(args.workers) as ex:
            list(ex.map(job, batches))
    out = {'kind': kind, 'shard': args.shard, 'shards': args.shards, 'asked': len(mine), 'ok': len(results),
           'errors': errors, 'requests': stats['requests'], 'seconds': round(time.time() - t0),
           'alpaca_feed': SD.alpaca_feed() if kind == 'stocks' else None, 'end': end.isoformat(),
           'results': sorted(results, key=lambda r: r['name']), 'log_tail': LOG[-40:]}
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, 'w') as f:
        json.dump(out, f, separators=(',', ':'))
    log(f'{kind} shard {args.shard}: {len(results)} ok, {len(errors)} errors, {stats["requests"]} requests, {time.time() - t0:.0f}s')
    return 0


# ---- synthetic self-test ---------------------------------------------------------------------------------------------
def synth(name: str, stock: bool, years: float = 3.0, seed: int = 1):
    gen = np.random.default_rng(seed)
    end = int(dt.datetime(2026, 10, 1, tzinfo=UTC).timestamp())
    t = np.arange(end - int(years * 365 * 86400), end, SLOT, dtype=np.int64)
    oy = off('ny')(t)
    ny = t + oy
    m = ny % 86400 // 60
    nwd = ((ny // 86400) + 3) % 7
    if stock:
        keep = (nwd < 5) & (m >= 240) & (m < 1200)
        act = np.where((m >= 570) & (m < 960), 1.0 + 3.0 * np.exp(-(m - 570) / 40.0) + np.exp(-(960 - m) / 30.0), 0.05)
    else:
        fxd = ((ny + 7 * 3600) // 86400 + 3) % 7
        keep = fxd < 5
        ldn = (t + off('ldn')(t)) % 86400 // 60
        act = 0.4 + np.where((ldn >= 480) & (ldn < 960), 1.2, 0) + np.where((m >= 510) & (m < 690), 1.5, 0)
    act = act * np.where(nwd == 2, 1.1, 1.0)
    t, act = t[keep], act[keep]
    sd = 0.05 * act
    h = 100 + np.abs(gen.normal(0, 1, len(t))) * sd
    l = 100 - np.abs(gen.normal(0, 1, len(t))) * sd
    v = 1000 * act * gen.lognormal(0, 0.3, len(t))
    return t, v, h, l


def cmd_selftest(args) -> int:
    import report
    out = args.out or os.path.join(HERE, '.selftest')
    os.makedirs(out, exist_ok=True)
    today = dt.date(2026, 10, 1)
    cal = {'fomc': FOMC_FALLBACK, 'fomc_source': 'test', 'nfp': nfp_rule(dt.date(2023, 1, 1), today), 'nfp_source': 'test'}
    with open(os.path.join(out, 'cal.json'), 'w') as f:
        json.dump(cal, f)
    ev = Events(cal, today)
    shards = {'fx': [], 'stocks': []}
    for i, n in enumerate(['EUR_USD', 'GBP_USD', 'XAU_USD', 'SPX500_USD']):
        meta = {'name': n, 'sym': n.replace('_', ''), 'cls': 'cfd' if n.startswith('SPX') else ('metal' if n.startswith('XAU') else 'major'),
                'group': 'FX MAJORS', 'display': n, 'wl': True}
        shards['fx'].append(analyse(meta, *synth(n, False, seed=i), stock=False, ev=ev))
    for i, n in enumerate(['AAPL', 'MSFT', 'JPM', 'SPY']):
        meta = {'name': n, 'sym': n, 'cls': 'stock', 'group': 'Financials' if n == 'JPM' else 'Information Technology',
                'display': n, 'idx': 'SPX'}
        shards['stocks'].append(analyse(meta, *synth(n, True, seed=10 + i), stock=True, ev=ev))
    for k, rs in shards.items():
        with open(os.path.join(out, f'{k}_0.json'), 'w') as f:
            json.dump({'kind': k, 'shard': 0, 'shards': 1, 'asked': len(rs), 'ok': len(rs), 'errors': {}, 'requests': 0,
                       'seconds': 0, 'alpaca_feed': 'sip' if k == 'stocks' else None, 'end': '2026-10-01T00:00:00+00:00',
                       'results': rs, 'log_tail': []}, f)
    return report.main(['--in', out, '--cal', os.path.join(out, 'cal.json'), '--root', out, '--synthetic'])


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    c = sub.add_parser('calendar')
    c.add_argument('--out', default='cal.json')
    for k in ('fx', 'stocks'):
        s = sub.add_parser(k)
        s.add_argument('--shard', type=int, default=0)
        s.add_argument('--shards', type=int, default=1)
        s.add_argument('--cal', default='cal.json')
        s.add_argument('--out', required=True)
        s.add_argument('--only', default='')
        s.add_argument('--max', type=int, default=0)
        s.add_argument('--workers', type=int, default=4)
        s.add_argument('--batch', type=int, default=10)
        s.add_argument('--budget-min', type=float, default=300)
    t = sub.add_parser('selftest')
    t.add_argument('--out', default='')
    args = ap.parse_args(argv)
    if args.cmd == 'calendar':
        return cmd_calendar(args)
    if args.cmd in ('fx', 'stocks'):
        return run_shard(args.cmd, args)
    return cmd_selftest(args)


if __name__ == '__main__':
    sys.exit(main())
