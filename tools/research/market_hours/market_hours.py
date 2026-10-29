"""Market-hours study: on which weekdays and at which Calgary clock times do volume and price range spike?

    python tools/research/market_hours/market_hours.py [--years 2] [--budget-min 40] [--synthetic]

Data (re-uses the repo's clients, no new HTTP code):
  forex / metals / CFDs  OANDA v20 M15 mid candles with tick volume (tools/fx_scanner/oanda.py: host, token, http_get
                         with the shared budget / breaker / pacing of tools/stock_scanner/data.py)
  US stocks / ETFs       Alpaca /v2/stocks/bars 15Min, feed sip (iex fallback), split-adjusted, pre + post market
                         (tools/stock_scanner/data.py: _alpaca_get = keys, pacing, sip -> iex fallback)

Method (all clock times are America/Edmonton, DST per date, New York shown alongside):
  * 15-min bars -> 30-min buckets (UTC grid = Calgary grid: the offsets are whole hours).
  * Normalisation per instrument and calendar month: rel_vol = bucket volume / the month's median bucket volume,
    rel_range = bucket (high - low) / the month's median bucket range. Forex: the median over all of the month's
    buckets (24 h); stocks: over the month's REGULAR-session buckets (9:30-16:00 ET), so 1.0 = a typical regular-hours
    bucket. A "big move" = rel_range > 2.
  * Per instrument and cell (Calgary weekday x bucket start): median rel_vol, median rel_range, share of big moves.
    Across instruments: the median of the instrument medians (each instrument counts once), with the inter-quartile
    range across instruments and the number of instruments that have the cell in their own top 10%.
  * Event-aligned windows (each date at its own local time, so DST is exact): Tokyo 09:00, London 08:00, US data 08:30
    ET, NYSE open 09:30 ET, 10:00 ET data, London 16:00 (WM/R fix, London close), NYSE close 16:00 ET, FX rollover
    17:00 ET; NFP (first-Friday rule + known moved dates) and FOMC (statement 14:00 ET, press conference 14:30 ET).
  * Stability: Spearman rank correlation of the cell table of the first half vs the second half of the sample.

Writes docs/research/Market_Hours.md, public/research/market_hours.json, docs/research/market_hours_fx.png and
docs/research/market_hours_stocks.png. Descriptive statistics only: no trading-profit claim.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import random
import statistics as st
import sys
import time
import urllib.error
import urllib.parse
from collections import Counter, defaultdict
from typing import Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
FX_DIR = os.path.join(ROOT, 'tools', 'fx_scanner')
STOCK_DIR = os.path.join(ROOT, 'tools', 'stock_scanner')
for _p in (FX_DIR, STOCK_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import data as SD  # noqa: E402  (stock scanner network layer)
import oanda  # noqa: E402  (OANDA client: host / token / default_get)

MT = ZoneInfo('America/Edmonton')
NY = ZoneInfo('America/New_York')
LDN = ZoneInfo('Europe/London')
TKY = ZoneInfo('Asia/Tokyo')
UTC = dt.timezone.utc
WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

FX = ['EUR_USD', 'GBP_USD', 'USD_JPY', 'AUD_USD', 'USD_CAD', 'XAU_USD']
CFD = ['SPX500_USD', 'US30_USD', 'NAS100_USD', 'WTICO_USD']
ETF = ['SPY', 'QQQ', 'IWM']
STOCKS = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'AVGO', 'AMD', 'NFLX', 'JPM', 'BAC', 'XOM', 'UNH',
          'LLY', 'COST', 'WMT', 'PLTR', 'MU', 'INTC', 'BA', 'ORCL', 'CRM', 'COIN', 'SMCI']
BIG_X = 2.0

# FOMC statement days (14:00 ET), from the Federal Reserve's published schedules for 2024-2026 (hard-coded from memory
# of the Fed calendar: check federalreserve.gov/monetarypolicy/fomccalendars.htm before relying on a single date).
FOMC = ['2024-01-31', '2024-03-20', '2024-05-01', '2024-06-12', '2024-07-31', '2024-09-18', '2024-11-07', '2024-12-18',
        '2025-01-29', '2025-03-19', '2025-05-07', '2025-06-18', '2025-07-30', '2025-09-17', '2025-10-29', '2025-12-10',
        '2026-01-28', '2026-03-18', '2026-04-29', '2026-06-17', '2026-07-29', '2026-09-16', '2026-10-28', '2026-12-09']
# NFP = first Friday of the month (the owner's rule), corrected for releases known to have moved (from memory: the
# 2025 US government shutdown cancelled the Oct / Nov 2025 first-Friday releases; the Sep 2025 report came on
# Thu 2025-11-20, Oct + Nov on Tue 2025-12-16; July 2025's on Thu 2025-07-03 (Independence Day); Dec 2025's on Fri
# 2026-01-09). Both the plain rule and the corrected list are reported.
NFP_DROP = {'2025-10-03', '2025-11-07', '2026-01-02'}
NFP_ADD = {'2025-07-03', '2025-11-20', '2025-12-16', '2026-01-09'}
NFP_DROP_RULE_ONLY = {'2025-07-04'}  # a holiday Friday: no release that day under any reading

# Event clocks: (key, label, tz, hh, mm, applies_to)
EVENTS = [
    ('tokyo_open', 'Tokyo open 09:00 JST', TKY, 9, 0),
    ('london_open', 'London open 08:00 London', LDN, 8, 0),
    ('us_data', 'US data 08:30 ET (NFP, CPI, claims ...)', NY, 8, 30),
    ('ny_open', 'NYSE open 09:30 ET', NY, 9, 30),
    ('us_10am', '10:00 ET data / first hour', NY, 10, 0),
    ('london_fix', 'London 16:00 (WM/R fix, London close)', LDN, 16, 0),
    ('ny_last', 'Last regular half-hour 15:30 ET', NY, 15, 30),
    ('ny_close', 'NYSE close 16:00 ET (after-hours starts)', NY, 16, 0),
    ('fx_rollover', 'FX rollover 17:00 ET', NY, 17, 0),
]


def log(*a):
    print(*a, flush=True)


# ---- data ----------------------------------------------------------------------------------------------------------
Bar = Tuple[int, float, float, float, float, float]   # (utc epoch seconds of the bar start, o, h, l, c, v)


def _epoch(s: str) -> int:
    s = s.replace('Z', '')
    if '.' in s:
        s = s.split('.')[0]
    return int(dt.datetime.fromisoformat(s).replace(tzinfo=UTC).timestamp())


def fetch_oanda(name: str, start: dt.datetime, end: dt.datetime) -> List[Bar]:
    out: Dict[int, Bar] = {}
    frm = start
    end_ts = int(end.timestamp())
    while True:
        q = {'granularity': 'M15', 'price': 'M', 'count': '5000', 'from': frm.strftime('%Y-%m-%dT%H:%M:%SZ')}
        url = f'https://{oanda.host()}/v3/instruments/{urllib.parse.quote(name)}/candles?' + urllib.parse.urlencode(q)
        js = json.loads(oanda.default_get(url))
        cs = js.get('candles') or []
        last = None
        for c in cs:
            t = _epoch(str(c.get('time')))
            last = t
            if not c.get('complete') or t >= end_ts:
                continue
            m = c.get('mid') or {}
            try:
                out[t] = (t, float(m['o']), float(m['h']), float(m['l']), float(m['c']), float(c.get('volume') or 0))
            except (KeyError, TypeError, ValueError):
                continue
        if not cs or last is None or last >= end_ts or len(cs) < 2:
            break
        nxt = dt.datetime.fromtimestamp(last + 1, UTC)
        if nxt <= frm:
            break
        frm = nxt
    return [out[k] for k in sorted(out)]


def fetch_alpaca(symbols: List[str], start: dt.datetime, end: dt.datetime) -> Dict[str, List[Bar]]:
    got: Dict[str, Dict[int, Bar]] = defaultdict(dict)
    for i in range(0, len(symbols), 6):
        batch = [SD.alpaca_symbol(s) for s in symbols[i:i + 6]]
        token = ''
        pages = 0
        while True:
            def url_of(feed, t=token):
                q = {'symbols': ','.join(batch), 'timeframe': '15Min', 'start': start.strftime('%Y-%m-%dT%H:%M:%SZ'),
                     'end': end.strftime('%Y-%m-%dT%H:%M:%SZ'), 'adjustment': 'split', 'feed': feed,
                     'limit': str(SD.ALPACA_LIMIT), 'sort': 'asc'}
                if t:
                    q['page_token'] = t
                return SD.ALPACA_BARS + '?' + urllib.parse.urlencode(q, safe=',:')
            js = json.loads(SD._alpaca_get(url_of, log))
            pages += 1
            for sym, rows in (js.get('bars') or {}).items():
                for r in rows or []:
                    try:
                        t = _epoch(str(r['t']))
                        got[sym][t] = (t, float(r['o']), float(r['h']), float(r['l']), float(r['c']), float(r.get('v') or 0))
                    except (KeyError, TypeError, ValueError):
                        continue
            token = js.get('next_page_token') or ''
            if not token:
                break
        log(f'  alpaca {",".join(batch)}: {pages} pages, feed {SD.alpaca_feed()}')
    return {s: [d[k] for k in sorted(d)] for s, d in got.items()}


def synthetic(names: List[str], start: dt.datetime, end: dt.datetime, stock: bool) -> Dict[str, List[Bar]]:
    """Offline self-test data with a known intraday shape (London / NY peaks for FX, U-shape for stocks)."""
    rnd = random.Random(7)
    out = {}
    for n in names:
        bars = []
        p = 100.0
        t = int(start.timestamp()) // 900 * 900
        while t < int(end.timestamp()):
            u = dt.datetime.fromtimestamp(t, UTC)
            ny = u.astimezone(NY)
            ld = u.astimezone(LDN)
            nym = ny.hour * 60 + ny.minute
            if stock:
                ok = ny.weekday() < 5 and 240 <= nym < 1200
                act = 0.05 if not (570 <= nym < 960) else 1.0 + 3.0 * math.exp(-(nym - 570) / 40) + 1.0 * math.exp(-(960 - nym) / 30)
                if 480 <= nym < 540 and ny.weekday() < 5:
                    act += 0.3
            else:
                fxd = (ny + dt.timedelta(hours=7))
                ok = fxd.weekday() < 5
                ldm = ld.hour * 60 + ld.minute
                act = 0.4 + (1.2 if 480 <= ldm < 960 else 0) + (1.5 if 510 <= nym < 690 else 0)
                if 510 <= nym < 540:
                    act += 1.5
            if ok:
                sd = 0.05 * act
                o = p
                c = o + rnd.gauss(0, sd)
                h, l = max(o, c) + abs(rnd.gauss(0, sd)), min(o, c) - abs(rnd.gauss(0, sd))
                bars.append((t, o, h, l, c, max(0.0, 1000 * act * rnd.lognormvariate(0, 0.3))))
                p = c
            t += 900
        out[n] = bars
    return out


# ---- analysis ------------------------------------------------------------------------------------------------------
def med(xs):
    return st.median(xs) if xs else None


def q(xs, p):
    if not xs:
        return None
    s = sorted(xs)
    k = (len(s) - 1) * p
    f = math.floor(k)
    c = min(f + 1, len(s) - 1)
    return s[f] + (s[c] - s[f]) * (k - f)


def rnd(x, n=2):
    return None if x is None else round(x, n)


def bucketize(bars: List[Bar], minutes: int) -> List[Tuple[int, float, float]]:
    """[(bucket start epoch, volume, high - low)]."""
    step = minutes * 60
    agg: Dict[int, list] = {}
    for t, o, h, l, c, v in bars:
        k = t - t % step
        a = agg.get(k)
        if a is None:
            agg[k] = [h, l, v]
        else:
            a[0] = max(a[0], h)
            a[1] = min(a[1], l)
            a[2] += v
    return [(k, agg[k][2], agg[k][0] - agg[k][1]) for k in sorted(agg)]


def is_regular(ts: int) -> bool:
    n = dt.datetime.fromtimestamp(ts, UTC).astimezone(NY)
    m = n.hour * 60 + n.minute
    return n.weekday() < 5 and 570 <= m < 960


def fill_stock_gaps(bk: List[Tuple[int, float, float]], minutes: int) -> List[Tuple[int, float, float]]:
    """A missing stock bucket between the day's first and last bucket had no trade: volume 0, range 0."""
    step = minutes * 60
    have = {k for k, _, _ in bk}
    byday = defaultdict(list)
    for k, _, _ in bk:
        byday[dt.datetime.fromtimestamp(k, UTC).astimezone(NY).date()].append(k)
    extra = []
    for ks in byday.values():
        for k in range(min(ks), max(ks), step):
            if k not in have:
                extra.append((k, 0.0, 0.0))
    return sorted(bk + extra)


class Inst:
    """One instrument's normalised buckets."""

    def __init__(self, name: str, bars: List[Bar], minutes: int, stock: bool):
        self.name, self.stock, self.minutes = name, stock, minutes
        bk = bucketize(bars, minutes)
        if stock:
            bk = fill_stock_gaps(bk, minutes)
        loc = {}
        month_v, month_r = defaultdict(list), defaultdict(list)
        for k, v, r in bk:
            l = dt.datetime.fromtimestamp(k, UTC).astimezone(MT)
            loc[k] = l
            if stock and not is_regular(k):
                continue
            month_v[(l.year, l.month)].append(v)
            month_r[(l.year, l.month)].append(r)
        mv = {m: med(x) for m, x in month_v.items()}
        mr = {m: med(x) for m, x in month_r.items()}
        self.rows = []      # (ts, local MT datetime, rel_vol, rel_range)
        for k, v, r in bk:
            l = loc[k]
            a, b = mv.get((l.year, l.month)), mr.get((l.year, l.month))
            if not a or not b:
                continue
            self.rows.append((k, l, v / a, r / b))
        self.by_ts = {k: (rv, rr) for k, _, rv, rr in self.rows}
        self.first = self.rows[0][1].date().isoformat() if self.rows else None
        self.last = self.rows[-1][1].date().isoformat() if self.rows else None

    def cells(self, lo: Optional[int] = None, hi: Optional[int] = None) -> Dict[Tuple[int, str], dict]:
        acc = defaultdict(lambda: ([], []))
        for k, l, rv, rr in self.rows:
            if (lo is not None and k < lo) or (hi is not None and k >= hi):
                continue
            a = acc[(l.weekday(), l.strftime('%H:%M'))]
            a[0].append(rv)
            a[1].append(rr)
        out = {}
        for c, (v, r) in acc.items():
            if len(v) < 8:
                continue
            out[c] = {'rv': med(v), 'rr': med(r), 'big': sum(1 for x in r if x > BIG_X) / len(r), 'n': len(v)}
        return out


def combine(per: Dict[str, Dict[Tuple[int, str], dict]], min_inst: int) -> Dict[Tuple[int, str], dict]:
    """Across instruments: the median of instrument medians, IQR, top-10% agreement."""
    tops = {}
    for n, cs in per.items():
        comp = sorted((math.sqrt(max(c['rv'], 1e-9) * max(c['rr'], 1e-9)) for c in cs.values()), reverse=True)
        tops[n] = comp[max(0, len(comp) // 10 - 1)] if comp else float('inf')
    keys = set()
    for cs in per.values():
        keys |= set(cs)
    out = {}
    for k in keys:
        rows = [(n, cs[k]) for n, cs in per.items() if k in cs]
        if len(rows) < min_inst:
            continue
        rv = [c['rv'] for _, c in rows]
        rr = [c['rr'] for _, c in rows]
        bg = [c['big'] for _, c in rows]
        top = sum(1 for n, c in rows if math.sqrt(max(c['rv'], 1e-9) * max(c['rr'], 1e-9)) >= tops[n])
        out[k] = {'rv': med(rv), 'rv_q1': q(rv, .25), 'rv_q3': q(rv, .75), 'rr': med(rr), 'rr_q1': q(rr, .25),
                  'rr_q3': q(rr, .75), 'big': med(bg), 'n_inst': len(rows), 'n_med': med([c['n'] for _, c in rows]),
                  'top10': top}
        out[k]['score'] = math.sqrt(max(out[k]['rv'], 1e-9) * max(out[k]['rr'], 1e-9))
    return out


def ny_label(wd: int, hhmm: str, ref: dt.date) -> str:
    """The New York clock time of a Calgary time (always +2 h: both follow US DST rules)."""
    h, m = map(int, hhmm.split(':'))
    l = dt.datetime(ref.year, ref.month, ref.day, h, m, tzinfo=MT)
    return l.astimezone(NY).strftime('%H:%M')


def by_time(insts: List[Inst], weekdays=(0, 1, 2, 3, 4)) -> List[dict]:
    """Per bucket of the day (Mon-Fri pooled): median across instruments of each instrument's median."""
    per = {}
    for ins in insts:
        acc = defaultdict(lambda: ([], []))
        for k, l, rv, rr in ins.rows:
            if l.weekday() in weekdays:
                a = acc[l.strftime('%H:%M')]
                a[0].append(rv)
                a[1].append(rr)
        per[ins.name] = {b: (med(v), med(r), sum(1 for x in r if x > BIG_X) / len(r), len(v)) for b, (v, r) in acc.items() if len(v) >= 20}
    keys = sorted(set().union(*[set(p) for p in per.values()])) if per else []
    out = []
    for b in keys:
        rows = [p[b] for p in per.values() if b in p]
        if len(rows) < max(1, len(insts) // 2):
            continue
        rv, rr = med([r[0] for r in rows]), med([r[1] for r in rows])
        out.append({'mt': b, 'ny': ny_label(0, b, dt.date(2026, 1, 5)), 'rv': rnd(rv), 'rr': rnd(rr),
                    'big_pct': rnd(100 * med([r[2] for r in rows]), 1), 'score': rnd(math.sqrt(rv * rr)),
                    'n_inst': len(rows), 'n_med': int(med([r[3] for r in rows]))})
    return out


def trading_day(ts: int, stock: bool) -> dt.date:
    u = dt.datetime.fromtimestamp(ts, UTC)
    if stock:
        return u.astimezone(NY).date()
    return (u.astimezone(NY) + dt.timedelta(hours=7)).date()      # the forex day: 17:00 -> 17:00 New York


def day_of_week(insts: List[Inst], bars: Dict[str, List[Bar]]) -> List[dict]:
    per = defaultdict(lambda: defaultdict(lambda: ([], [])))
    for ins in insts:
        days = defaultdict(lambda: [0.0, -1e18, 1e18])
        for t, o, h, l, c, v in bars[ins.name]:
            if ins.stock and not is_regular(t):
                continue
            d = days[trading_day(t, ins.stock)]
            d[0] += v
            d[1] = max(d[1], h)
            d[2] = min(d[2], l)
        mv, mr = defaultdict(list), defaultdict(list)
        for d, (v, h, l) in days.items():
            mv[(d.year, d.month)].append(v)
            mr[(d.year, d.month)].append(h - l)
        mvm = {k: med(x) for k, x in mv.items()}
        mrm = {k: med(x) for k, x in mr.items()}
        for d, (v, h, l) in days.items():
            a, b = mvm[(d.year, d.month)], mrm[(d.year, d.month)]
            if d.weekday() > 4 or not a or not b:
                continue
            per[d.weekday()][ins.name][0].append(v / a)
            per[d.weekday()][ins.name][1].append((h - l) / b)
    out = []
    for wd in range(5):
        rows = per[wd]
        if not rows:
            continue
        rv = [med(v) for v, _ in rows.values()]
        rr = [med(r) for _, r in rows.values()]
        out.append({'weekday': WD[wd], 'rel_day_volume': rnd(med(rv)), 'rel_day_range': rnd(med(rr)),
                    'rv_q1': rnd(q(rv, .25)), 'rv_q3': rnd(q(rv, .75)), 'rr_q1': rnd(q(rr, .25)), 'rr_q3': rnd(q(rr, .75)),
                    'n_days_med': int(med([len(v) for v, _ in rows.values()])), 'n_inst': len(rows)})
    return out


def dates_between(a: dt.date, b: dt.date):
    d = a
    while d <= b:
        yield d
        d += dt.timedelta(days=1)


def event_ts(d: dt.date, tz, hh: int, mm: int) -> int:
    return int(dt.datetime(d.year, d.month, d.day, hh, mm, tzinfo=tz).timestamp())


def event_stats(insts: List[Inst], tz, hh, mm, dates: List[dt.date], pre_min: int = 60) -> dict:
    """The bucket starting at the event (each date at its own local time) vs the bucket pre_min earlier."""
    per = []
    clock = Counter()
    for d in dates:
        clock[dt.datetime.fromtimestamp(event_ts(d, tz, hh, mm), UTC).astimezone(MT).strftime('%H:%M')] += 1
    for ins in insts:
        ev, pre = [], []
        for d in dates:
            t = event_ts(d, tz, hh, mm)
            if t in ins.by_ts and (t - pre_min * 60) in ins.by_ts:
                ev.append(ins.by_ts[t])
                pre.append(ins.by_ts[t - pre_min * 60])
        if len(ev) < 3:
            continue
        per.append({'n': len(ev), 'rv': med([x[0] for x in ev]), 'rr': med([x[1] for x in ev]),
                    'big': sum(1 for x in ev if x[1] > BIG_X) / len(ev),
                    'rv_pre': med([x[0] for x in pre]), 'rr_pre': med([x[1] for x in pre])})
    if not per:
        return {}
    rv, rr = med([p['rv'] for p in per]), med([p['rr'] for p in per])
    rvp, rrp = med([p['rv_pre'] for p in per]), med([p['rr_pre'] for p in per])
    return {'rv': rnd(rv), 'rr': rnd(rr), 'big_pct': rnd(100 * med([p['big'] for p in per]), 1),
            'rv_pre': rnd(rvp), 'rr_pre': rnd(rrp), 'vol_lift': rnd(rv / rvp if rvp else None),
            'range_lift': rnd(rr / rrp if rrp else None), 'n_days_med': int(med([p['n'] for p in per])),
            'n_inst': len(per), 'calgary_clock': dict(clock.most_common())}


def compare_days(insts: List[Inst], tz, hh, mm, ev_dates: List[dt.date], ctrl_dates: List[dt.date]) -> dict:
    """Same clock bucket: event dates vs control dates (per instrument medians, then the median across instruments)."""
    out = {}
    ratios_r, ratios_v, rows = [], [], []
    for ins in insts:
        def take(ds):
            return [ins.by_ts[t] for t in (event_ts(d, tz, hh, mm) for d in ds) if t in ins.by_ts]
        e, c = take(ev_dates), take(ctrl_dates)
        if len(e) < 3 or len(c) < 5:
            continue
        er, cr = med([x[1] for x in e]), med([x[1] for x in c])
        ev_, cv = med([x[0] for x in e]), med([x[0] for x in c])
        rows.append({'name': ins.name, 'n_event': len(e), 'n_ctrl': len(c), 'rr_event': rnd(er), 'rr_ctrl': rnd(cr),
                     'rv_event': rnd(ev_), 'rv_ctrl': rnd(cv),
                     'big_event_pct': rnd(100 * sum(1 for x in e if x[1] > BIG_X) / len(e), 1),
                     'big_ctrl_pct': rnd(100 * sum(1 for x in c if x[1] > BIG_X) / len(c), 1)})
        if cr:
            ratios_r.append(er / cr)
        if cv:
            ratios_v.append(ev_ / cv)
    if not rows:
        return {}
    out['range_ratio_med'] = rnd(med(ratios_r))
    out['vol_ratio_med'] = rnd(med(ratios_v))
    out['range_ratio_min'] = rnd(min(ratios_r)) if ratios_r else None
    out['range_ratio_max'] = rnd(max(ratios_r)) if ratios_r else None
    out['n_event_med'] = int(med([r['n_event'] for r in rows]))
    out['n_ctrl_med'] = int(med([r['n_ctrl'] for r in rows]))
    out['rr_event_med'] = rnd(med([r['rr_event'] for r in rows]))
    out['rr_ctrl_med'] = rnd(med([r['rr_ctrl'] for r in rows]))
    out['big_event_pct_med'] = rnd(med([r['big_event_pct'] for r in rows]), 1)
    out['big_ctrl_pct_med'] = rnd(med([r['big_ctrl_pct'] for r in rows]), 1)
    out['per_instrument'] = rows
    return out


def first_fridays(a: dt.date, b: dt.date) -> List[dt.date]:
    return [d for d in dates_between(a, b) if d.weekday() == 4 and d.day <= 7]


def nfp_dates(a: dt.date, b: dt.date) -> Tuple[List[dt.date], List[dt.date]]:
    rule = [d for d in first_fridays(a, b) if d.isoformat() not in NFP_DROP_RULE_ONLY]
    corr = sorted({d for d in rule if d.isoformat() not in NFP_DROP} |
                  {dt.date.fromisoformat(x) for x in NFP_ADD if a <= dt.date.fromisoformat(x) <= b})
    return rule, corr


def mismatch(d: dt.date) -> bool:
    """US / UK DST mismatch: London is 6 h ahead of Calgary instead of 7 (in a few weeks of March and Oct / Nov)."""
    n = dt.datetime(d.year, d.month, d.day, 12, tzinfo=UTC)
    return (n.astimezone(LDN).utcoffset() - n.astimezone(MT).utcoffset()) != dt.timedelta(hours=7)


def spearman(a: List[float], b: List[float]) -> Optional[float]:
    if len(a) < 5:
        return None

    def ranks(x):
        o = sorted(range(len(x)), key=lambda i: x[i])
        r = [0.0] * len(x)
        i = 0
        while i < len(o):
            j = i
            while j + 1 < len(o) and x[o[j + 1]] == x[o[i]]:
                j += 1
            for k in range(i, j + 1):
                r[o[k]] = (i + j) / 2
            i = j + 1
        return r
    ra, rb = ranks(a), ranks(b)
    ma, mb = st.mean(ra), st.mean(rb)
    num = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    den = math.sqrt(sum((x - ma) ** 2 for x in ra) * sum((y - mb) ** 2 for y in rb))
    return num / den if den else None


def stability(insts: List[Inst], lo: int, mid: int, hi: int) -> dict:
    min_inst = max(1, len(insts) // 2)
    a = combine({i.name: i.cells(lo, mid) for i in insts}, min_inst)
    b = combine({i.name: i.cells(mid, hi) for i in insts}, min_inst)
    ks = sorted(set(a) & set(b))
    top_a = {k for k, _ in sorted(a.items(), key=lambda kv: -kv[1]['score'])[:15]}
    top_b = {k for k, _ in sorted(b.items(), key=lambda kv: -kv[1]['score'])[:15]}
    return {'cells': len(ks), 'spearman_score': rnd(spearman([a[k]['score'] for k in ks], [b[k]['score'] for k in ks]), 3),
            'spearman_vol': rnd(spearman([a[k]['rv'] for k in ks], [b[k]['rv'] for k in ks]), 3),
            'spearman_range': rnd(spearman([a[k]['rr'] for k in ks], [b[k]['rr'] for k in ks]), 3),
            'top15_overlap': len(top_a & top_b),
            'split_utc': dt.datetime.fromtimestamp(mid, UTC).date().isoformat()}


def per_instrument_peaks(insts: List[Inst]) -> List[dict]:
    out = []
    for r in [(i, by_time([i])) for i in insts]:
        ins, bt = r
        if not bt:
            continue
        top = sorted(bt, key=lambda x: -x['score'])[:3]
        quiet = sorted(bt, key=lambda x: x['score'])[:1]
        out.append({'name': ins.name, 'from': ins.first, 'to': ins.last, 'buckets': len(ins.rows),
                    'peaks': [{'mt': t['mt'], 'ny': t['ny'], 'rv': t['rv'], 'rr': t['rr'], 'big_pct': t['big_pct']} for t in top],
                    'quietest': quiet[0]['mt'] if quiet else None})
    return out


def cells_json(c: Dict[Tuple[int, str], dict], keep_order: bool = False) -> List[dict]:
    rows = []
    for (wd, b), v in (c.items() if keep_order else sorted(c.items())):
        rows.append({'weekday': WD[wd], 'mt': b, 'ny': ny_label(wd, b, dt.date(2026, 1, 5)), 'rv': rnd(v['rv']),
                     'rv_iqr': [rnd(v['rv_q1']), rnd(v['rv_q3'])], 'rr': rnd(v['rr']), 'rr_iqr': [rnd(v['rr_q1']), rnd(v['rr_q3'])],
                     'big_pct': rnd(100 * v['big'], 1), 'score': rnd(v['score']), 'n_inst': v['n_inst'],
                     'n_med': int(v['n_med']), 'top10_inst': v['top10']})
    return rows


def windows(bt: List[dict], thr: float) -> List[dict]:
    """Contiguous runs of buckets whose score >= thr (the 'open the charts' windows)."""
    out, cur = [], []
    for r in bt:
        if r['score'] is not None and r['score'] >= thr:
            if cur and _mins(r['mt']) - _mins(cur[-1]['mt']) != 30:
                out.append(cur)
                cur = []
            cur.append(r)
        elif cur:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    res = []
    for w in out:
        pk = max(w, key=lambda x: x['score'])
        res.append({'from_mt': w[0]['mt'], 'to_mt': _hhmm(_mins(w[-1]['mt']) + 30), 'from_ny': w[0]['ny'],
                    'to_ny': _hhmm(_mins(w[-1]['ny']) + 30), 'peak_mt': pk['mt'], 'peak_rv': pk['rv'], 'peak_rr': pk['rr'],
                    'peak_big_pct': pk['big_pct'], 'peak_score': pk['score']})
    return sorted(res, key=lambda x: -x['peak_score'])


def peaks(bt: List[dict], thr: float = 1.25, frac: float = 0.67) -> List[dict]:
    """Local activity peaks (score >= thr) and the window around each one: neighbouring buckets that keep at least
    `frac` of the peak score without rising above it. Strongest first; a bucket belongs to one window only."""
    sc = [r['score'] or 0 for r in bt]
    used = set()
    out = []
    for i in sorted(range(len(bt)), key=lambda k: -sc[k]):
        if sc[i] < thr or i in used:
            continue
        if (i > 0 and sc[i - 1] > sc[i]) or (i + 1 < len(bt) and sc[i + 1] > sc[i]):
            continue
        lo = hi = i
        while lo - 1 >= 0 and lo - 1 not in used and sc[lo - 1] >= frac * sc[i] and sc[lo - 1] <= 1.05 * sc[lo] \
                and _mins(bt[lo]['mt']) - _mins(bt[lo - 1]['mt']) == 30:
            lo -= 1
        while hi + 1 < len(bt) and hi + 1 not in used and sc[hi + 1] >= frac * sc[i] and sc[hi + 1] <= 1.05 * sc[hi] \
                and _mins(bt[hi + 1]['mt']) - _mins(bt[hi]['mt']) == 30:
            hi += 1
        used |= set(range(lo, hi + 1))
        pk = bt[i]
        out.append({'from_mt': bt[lo]['mt'], 'to_mt': _hhmm(_mins(bt[hi]['mt']) + 30), 'from_ny': bt[lo]['ny'],
                    'to_ny': _hhmm(_mins(bt[hi]['ny']) + 30), 'peak_mt': pk['mt'], 'peak_ny': pk['ny'],
                    'peak_rv': pk['rv'], 'peak_rr': pk['rr'], 'peak_big_pct': pk['big_pct'], 'peak_score': pk['score']})
    return out


def _mins(h):
    a, b = map(int, h.split(':'))
    return a * 60 + b


def _hhmm(m):
    m %= 1440
    return f'{m // 60:02d}:{m % 60:02d}'


# ---- heatmaps ------------------------------------------------------------------------------------------------------
def heatmap(cells: Dict[Tuple[int, str], dict], rows: List[int], slots: List[str], title: str, path: str) -> None:
    """Weekday x half-hour grid (30-min cells keep the :30 events - 06:30 data, 07:30 NYSE open - visible)."""
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap
    cmap = LinearSegmentedColormap.from_list('seq', ['#f4f8fd', '#cde2fb', '#86b6ef', '#3987e5', '#1c5cab', '#0d366b'])
    fig, axes = plt.subplots(2, 1, figsize=(max(9, 0.3 * len(slots) + 2), 2 * (0.45 * len(rows) + 1.6)), dpi=130)
    for ax, key, lab in ((axes[0], 'rv', 'Volume vs a typical bucket (median, x)'),
                         (axes[1], 'rr', 'Range (high - low) vs a typical bucket (median, x)')):
        grid = [[(cells.get((wd, sl)) or {}).get(key) for sl in slots] for wd in rows]
        vals = [v for r in grid for v in r if v is not None]
        vmax = max(vals) if vals else 1
        m = [[float('nan') if v is None else v for v in r] for r in grid]
        cmap.set_bad('#e6e6e6')
        im = ax.imshow(m, aspect='auto', cmap=cmap, vmin=0, vmax=vmax)
        ax.set_yticks(range(len(rows)), [WD[w] for w in rows], fontsize=9)
        ticks = [i for i, sl in enumerate(slots) if sl.endswith(':00')]
        ax.set_xticks([i - 0.5 for i in ticks], [f"{slots[i][:2]}\n{(int(slots[i][:2]) + 2) % 24:02d}" for i in ticks],
                      fontsize=7.5)
        ax.set_title(lab, fontsize=10, loc='left', color='#222')
        ax.tick_params(length=0, colors='#444')
        for s in ax.spines.values():
            s.set_visible(False)
        flat = sorted(((v, i, j) for i, r in enumerate(grid) for j, v in enumerate(r) if v is not None), reverse=True)[:10]
        for v, i, j in flat:
            ax.text(j, i, f'{v:.1f}', ha='center', va='center', fontsize=6, color='white' if v > 0.55 * vmax else '#111')
        cb = fig.colorbar(im, ax=ax, fraction=0.025, pad=0.01)
        cb.ax.tick_params(labelsize=7)
        cb.outline.set_visible(False)
    axes[1].set_xlabel('Half-hour cells; ticks at the full hour (top: Calgary time, bottom: New York time)', fontsize=8.5,
                       color='#444')
    fig.suptitle(title, fontsize=11.5, x=0.01, ha='left', color='#111')
    fig.tight_layout()
    fig.savefig(path, facecolor='white')
    plt.close(fig)


# ---- report --------------------------------------------------------------------------------------------------------
def md_table(head: List[str], rows: List[List]) -> str:
    s = '| ' + ' | '.join(head) + ' |\n|' + '|'.join('---' for _ in head) + '|\n'
    for r in rows:
        s += '| ' + ' | '.join('' if x is None else str(x) for x in r) + ' |\n'
    return s


def fx(x, suf='x'):
    return '-' if x is None else f'{x:.2f}{suf}'


EVENT_NOTE = {
    '17:00': 'Tokyo open (winter, Nov-Mar)', '18:00': 'Asia morning: Tokyo 09:00-10:00 JST (Tokyo fix 09:55), China / Australia data',
    '01:00': 'London open (normal weeks)', '02:00': 'London open (US/UK DST-mismatch weeks) / Frankfurt+London 2nd hour',
    '06:30': 'US data 08:30 ET (NFP, CPI, retail sales, claims)', '07:30': 'NYSE open 09:30 ET',
    '08:00': '10:00 ET data (ISM, JOLTS, sentiment) / first stock hour', '09:00': 'London 16:00 close + WM/R fix (normal weeks)',
    '12:00': '14:00 ET: FOMC statement (8 days a year)', '14:00': 'NYSE close 16:00 ET: closing-auction prints (volume, not range)',
    '13:30': 'last regular half-hour (MOC imbalances, index rebalancing)',
    '18:30': 'Asia morning', '19:00': 'Asia morning (Tokyo / China / Australia data)',
    '15:00': 'FX rollover 17:00 ET (spreads widen)', '07:00': 'stock pre-market last half-hour / 09:00 ET',
}


def build_md(R: dict) -> str:
    m = R['meta']
    fxr, sk = R.get('forex') or {}, R.get('stocks') or {}
    L = []
    L.append('# Market hours study: when do volume and price action spike? (Calgary time)\n')
    L.append(f"Generated {m['generated']} by `tools/research/market_hours/market_hours.py` "
             f"(workflow `market-hours.yml`). Sample: {m['start']} to {m['end']}"
             f"{' - SYNTHETIC SELF-TEST DATA, NOT MARKET DATA' if m.get('synthetic') else ''}. "
             'All times are **Calgary (America/Edmonton)** with New York in brackets; New York is always 2 h ahead of '
             'Calgary (both use US daylight-saving dates). Descriptive statistics only - nothing here is a trading '
             'signal or a profit claim.\n')

    # --- schedule
    L.append('## When to open the charts (Calgary time)\n')
    L.append('Each row is a peak of activity on a normal weekday (Mon-Fri pooled, 30-minute buckets). Volume and range '
             'are the median over instruments, relative to a typical 30-minute bucket of the same instrument and month '
             '(1.0x = typical; forex: typical over 24 h; stocks: typical regular-hours bucket). Big moves = share of '
             'days on which the peak half-hour\'s range was more than 2x typical. The window around each peak keeps at '
             'least 2/3 of the peak\'s activity. Listed in clock order of a Calgary trading day (Tokyo evening first).\n')
    rows = []
    for lab, part in (('Forex + gold', fxr), ('Index / oil CFDs', R.get('cfd') or {}), ('US stocks', sk)):
        for w in part.get('peaks') or []:
            rows.append([f"{w['from_mt']}-{w['to_mt']}", f"{w['from_ny']}-{w['to_ny']}", lab, f"**{w['peak_mt']}**",
                         EVENT_NOTE.get(w['peak_mt'], ''), fx(w['peak_rv']), fx(w['peak_rr']), f"{w['peak_big_pct']}%"])
    rows.sort(key=lambda r: _mins(r[0][:5]) if _mins(r[0][:5]) >= 15 * 60 else _mins(r[0][:5]) + 1440)
    L.append(md_table(['Calgary', 'New York', 'Market', 'Peak (Calgary)', 'What happens then', 'Volume', 'Range',
                       'Big moves at peak'], rows))
    L.append(R.get('narrative', '') + '\n')

    # --- weekdays
    L.append('## Busiest weekdays\n')
    L.append('Whole trading day (forex day = 17:00-17:00 New York, i.e. 15:00-15:00 Calgary, Sunday evening counts as '
             'Monday; stocks = regular session), relative to the median day of the same instrument and month. '
             'IQR = spread across instruments.\n')
    for lab, part in (('Forex + gold', fxr), ('Index / oil CFDs', R.get('cfd') or {}), ('US stocks', sk)):
        dw = part.get('day_of_week') or []
        if not dw:
            continue
        L.append(f'**{lab}**\n')
        L.append(md_table(['Day', 'Day volume', 'IQR', 'Day range', 'IQR', 'Days per instrument', 'Instruments'],
                          [[d['weekday'], fx(d['rel_day_volume']), f"{d['rv_q1']}-{d['rv_q3']}", fx(d['rel_day_range']),
                            f"{d['rr_q1']}-{d['rr_q3']}", d['n_days_med'], d['n_inst']] for d in dw]))

    # --- events
    L.append('## Session opens and scheduled events\n')
    L.append('Each event is measured at its own local clock on each date (so daylight-saving shifts are exact): the '
             '30-minute bucket that starts at the event vs the bucket one hour earlier ("lift"). "Calgary clock" = how '
             'often the event fell at each Calgary time in the sample.\n')
    for lab, part in (('Forex + gold', fxr), ('Index / oil CFDs', R.get('cfd') or {}), ('US stocks', sk)):
        ev = part.get('events') or {}
        if not ev:
            continue
        L.append(f'**{lab}**\n')
        rr_ = []
        for k, e in ev.items():
            if not e:
                continue
            clock = ', '.join(f'{c} ({n}d)' for c, n in list(e['calgary_clock'].items())[:3])
            rr_.append([e.get('label', k), clock, fx(e['rv']), fx(e['vol_lift']), fx(e['rr']), fx(e['range_lift']),
                        f"{e['big_pct']}%", e['n_days_med']])
        L.append(md_table(['Event', 'Calgary clock', 'Volume', 'Vol lift', 'Range', 'Range lift', 'Big moves',
                           'Days'], rr_))

    # --- NFP / FOMC
    L.append('## NFP Fridays and FOMC days\n')
    L.append('Same clock bucket on event days vs control days (NFP: other Fridays; FOMC: other days of the same '
             'weekday). Ratio = median range on event days / median range on control days, per instrument, then the '
             'median across instruments (min-max across instruments in brackets). Few event days: treat as indicative.\n')
    rows = []
    for lab, part in (('Forex + gold', fxr), ('Index / oil CFDs', R.get('cfd') or {}), ('US stocks', sk)):
        for k, name in (('nfp_0830', 'NFP 08:30 ET (06:30 Calgary)'), ('nfp_rule_0830', 'NFP plain first-Friday rule'),
                        ('nfp_day', 'NFP whole 06:30-08:30 Calgary'), ('fomc_1400', 'FOMC 14:00 ET (12:00 Calgary)'),
                        ('fomc_1430', 'FOMC press conf. 14:30 ET (12:30 Calgary)')):
            c = (part.get('scheduled') or {}).get(k) or {}
            if not c:
                continue
            rows.append([lab, name, fx(c['range_ratio_med']), f"{fx(c['range_ratio_min'])}-{fx(c['range_ratio_max'])}",
                         fx(c['vol_ratio_med']), f"{c['big_event_pct_med']}% vs {c['big_ctrl_pct_med']}%",
                         f"{c['n_event_med']} vs {c['n_ctrl_med']}"])
    L.append(md_table(['Market', 'Window', 'Range ratio', 'Min-max', 'Volume ratio', 'Big moves (event vs control)',
                       'Days (event vs control)'], rows))

    # --- DST
    L.append('## Daylight-saving: how the Calgary clock moves\n')
    d = R.get('dst') or {}
    L.append('Calgary and New York change clocks on the same dates, so **every New York event keeps the same Calgary '
             'time all year** (08:30 ET = 06:30, 09:30 ET = 07:30, 14:00 ET = 12:00). London and Tokyo do not:\n')
    L.append('- **London open** (08:00 London) is **01:00 Calgary** most of the year, but **02:00 Calgary** in the '
             'US/UK mismatch weeks (2nd Sunday of March -> last Sunday of March, and last Sunday of October -> 1st '
             'Sunday of November). The London close / 16:00 fix moves from 09:00 to 10:00 Calgary in the same weeks.\n'
             '- **Tokyo open** (09:00 JST, no DST in Japan) is **18:00 Calgary in summer** (Mar-Nov) and **17:00 '
             'Calgary in winter** (Nov-Mar).\n')
    if d.get('rows'):
        L.append(f"Measured (forex + gold, Mon-Fri, {d.get('normal_days')} normal days vs {d.get('mismatch_days')} "
                 'mismatch days):\n')
        L.append(md_table(['Calgary bucket', 'Volume, normal weeks', 'Volume, mismatch weeks', 'Range, normal',
                           'Range, mismatch'], [[r['mt'], fx(r['rv_normal']), fx(r['rv_mismatch']), fx(r['rr_normal']),
                                                 fx(r['rr_mismatch'])] for r in d['rows']]))
        tk = R.get('tokyo_dst') or {}
        if tk.get('rows'):
            L.append('Tokyo open, Calgary 17:00 vs 18:00 bucket in Japan-winter (Calgary on MST) vs summer (MDT):\n')
            L.append(md_table(['Calgary bucket', 'Volume, winter (MST)', 'Volume, summer (MDT)'],
                              [[r['mt'], fx(r['rv_mst']), fx(r['rv_mdt'])] for r in tk['rows']]))

    # --- top cells
    for lab, part in (('Forex + gold', fxr), ('US stocks', sk)):
        top = part.get('top_windows') or []
        if not top:
            continue
        L.append(f'## Top weekday x time windows - {lab}\n')
        L.append('Score = sqrt(volume x range), both relative to typical. "Top-10% in" = how many instruments have this '
                 'cell in their own top 10% of cells (agreement). n = buckets per instrument in the cell (median).\n')
        L.append(md_table(['#', 'Day', 'Calgary', 'NY', 'Volume (IQR)', 'Range (IQR)', 'Big moves', 'Score',
                           'Top-10% in', 'n'],
                          [[i + 1, c['weekday'], c['mt'], c['ny'], f"{fx(c['rv'])} ({c['rv_iqr'][0]}-{c['rv_iqr'][1]})",
                            f"{fx(c['rr'])} ({c['rr_iqr'][0]}-{c['rr_iqr'][1]})", f"{c['big_pct']}%", c['score'],
                            f"{c['top10_inst']}/{c['n_inst']}", c['n_med']] for i, c in enumerate(top)]))
    L.append('![Forex heatmap](market_hours_fx.png)\n')
    L.append('![Stocks heatmap](market_hours_stocks.png)\n')

    # --- by time
    for lab, part in (('Forex + gold', fxr), ('Index / oil CFDs', R.get('cfd') or {}), ('US stocks', sk)):
        bt = part.get('by_time') or []
        if not bt:
            continue
        L.append(f'## Hour by hour, Mon-Fri pooled - {lab}\n')
        L.append(md_table(['Calgary', 'NY', 'Volume', 'Range', 'Big moves', 'Score', 'n'],
                          [[b['mt'], b['ny'], fx(b['rv']), fx(b['rr']), f"{b['big_pct']}%", b['score'], b['n_med']] for b in bt]))

    # --- per instrument
    L.append('## Each instrument\'s own peaks (Mon-Fri pooled, 30-minute buckets)\n')
    rows = []
    for lab, part in (('FX', fxr), ('CFD', R.get('cfd') or {}), ('Stock', sk)):
        for p in part.get('instruments') or []:
            pk = '; '.join(f"{x['mt']} ({x['rv']}x vol, {x['rr']}x range)" for x in p['peaks'])
            rows.append([p['name'], lab, f"{p['from']} - {p['to']}", p['buckets'], pk, p['quietest']])
    L.append(md_table(['Instrument', 'Class', 'Data', 'Buckets', 'Top 3 Calgary buckets', 'Quietest'], rows))

    # --- stability + method + caveats
    L.append('## Is the pattern stable?\n')
    srows = []
    for lab, part in (('Forex + gold', fxr), ('US stocks', sk)):
        s = part.get('stability') or {}
        if s:
            srows.append([lab, s['split_utc'], s['cells'], s['spearman_score'], s['spearman_vol'], s['spearman_range'],
                          f"{s['top15_overlap']}/15"])
    L.append('First half vs second half of the sample, same weekday x 30-minute cells. Spearman 1.0 = identical '
             'ordering; top-15 overlap = how many of the 15 busiest cells are the same in both halves.\n')
    L.append(md_table(['Market', 'Split at', 'Cells', 'Spearman (score)', 'Spearman (volume)', 'Spearman (range)',
                       'Top-15 overlap'], srows))
    L.append('## Method\n')
    L.append('- Forex / gold / CFDs: OANDA v20 **M15 mid candles** ('
             + ('practice' if m.get('oanda_env', 'practice') == 'practice' else 'live') + ' server), tick volume. '
             'Stocks: Alpaca **15-minute bars**, feed ' + str(m.get('alpaca_feed')) + ', split-adjusted, pre-market '
             '(04:00 ET) to after-hours (20:00 ET); a missing 15-minute bar inside a trading day = no trade (0 '
             'volume, 0 range).\n'
             '- Bars are summed into 30-minute buckets (tables and heatmaps) and labelled by the '
             'Calgary clock time at which the bucket starts, with the weekday in Calgary.\n'
             '- Normalisation per instrument and calendar month (so a volatile month or a busy instrument does not '
             'dominate): relative volume = bucket volume / the month\'s median bucket volume; relative range = bucket '
             'high-low / the month\'s median bucket high-low. Forex: median over all 24 h; stocks: over the regular '
             'session only. A **big move** = range > 2x that median.\n'
             '- Each instrument first gets its own median per cell; the tables show the median across instruments '
             '(each counts once) and the inter-quartile range across instruments.\n'
             '- Events are measured on each date at their own local time; NFP = first Friday of the month (holiday '
             'Fridays removed), plus a corrected list with releases known to have moved (2025 shutdown, July 4th '
             'week, Jan 2026), from memory - check bls.gov. FOMC statement dates for 2024-2026 are hard-coded from '
             'the Federal Reserve schedule (from memory - check federalreserve.gov).\n')
    L.append('## Caveats\n')
    L.append('- **OANDA volume is tick volume** (number of price updates on OANDA\'s feed), not exchange or '
             'interbank volume. It tracks real activity well in shape but not in size. Practice-server prices.\n'
             '- Stock volume is consolidated (SIP) share volume when feed = sip; with the iex fallback it is IEX only.\n'
             '- Relative numbers are medians: a typical day. The biggest single moves (surprise data, geopolitics) '
             'are rare and do not show in a median - the big-move share is the better guide for those.\n'
             '- About two years of data; each weekday x 30-minute cell holds ~100 buckets per instrument; FOMC days '
             'are ~16 and NFP days ~24, so their ratios are indicative, not precise. Differences of 0.1-0.2x between '
             'neighbouring cells are within noise.\n'
             '- Calendar effects (holidays, half days) are left in; medians limit their pull.\n'
             '- High activity means bigger moves in both directions and wider spreads at some times (the 15:00 '
             'Calgary rollover). It says when to look, not which way to trade.\n')
    return '\n'.join(L)


def _spread(bt: Dict[str, dict]) -> str:
    sc = [b['score'] for b in bt.values() if b.get('score')]
    return f'{max(sc) / min(sc):.0f}' if sc else '-'


def narrative(R: dict) -> str:
    """Plain-English daily routine built from the measured numbers (every number below is computed, not typed)."""
    fxr, cfd, sk = R.get('forex') or {}, R.get('cfd') or {}, R.get('stocks') or {}
    bt = {b['mt']: b for b in fxr.get('by_time') or []}
    cbt = {b['mt']: b for b in cfd.get('by_time') or []}
    sbt = {b['mt']: b for b in sk.get('by_time') or []}

    def g(d, k, f='score'):
        v = (d.get(k) or {}).get(f)
        return '-' if v is None else f'{v:g}x' if isinstance(v, (int, float)) and f != 'big_pct' else f'{v}%'
    sch = lambda part, k: (part.get('scheduled') or {}).get(k) or {}
    nfp, fomc, fpc = sch(fxr, 'nfp_0830'), sch(fxr, 'fomc_1400'), sch(fxr, 'fomc_1430')
    snfp, sfpc = sch(sk, 'nfp_0830'), sch(sk, 'fomc_1430')
    out = ['**The routine, in plain words** (activity = sqrt(volume x range) vs a typical half-hour; 1.0x = typical):']
    if bt:
        out.append(f"1. **06:00-10:00 Calgary = the main window, every weekday.** Forex + gold activity climbs from "
                   f"{g(bt, '06:00')} at 06:00 to {g(bt, '06:30')} at 06:30 (US data at 08:30 ET), {g(bt, '07:30')} at 07:30 "
                   f"(NYSE open) and peaks at **08:00 ({g(bt, '08:00')}; {g(bt, '08:00', 'big_pct')} of days have a "
                   f"big move in that half-hour)**, then fades through 09:00 (London close / fix, {g(bt, '09:00')}) to "
                   f"{g(bt, '10:00')} at 10:00. Index CFDs (US500 / US30 / NAS100) explode at **07:30: "
                   f"{g(cbt, '07:30')}** ({g(cbt, '07:30', 'big_pct')} big-move days). Stocks: **07:30 = {g(sbt, '07:30')}**, "
                   f"08:00 {g(sbt, '08:00')}, 08:30 {g(sbt, '08:30')}.")
        out.append(f"2. **00:30-02:00 Calgary = London open (01:00).** A smaller forex peak: {g(bt, '01:00')} at 01:00 "
                   f"({g(bt, '01:00', 'big_pct')} big-move days). In the US/UK DST-mismatch weeks it moves to 02:00 "
                   f"(see the daylight-saving table). Worth an alarm only if you trade the London open.")
    if nfp:
        out.append(f"3. **NFP Fridays (first Friday) at 06:30 Calgary:** the 06:30 half-hour range is "
                   f"**{nfp['range_ratio_med']}x** the same half-hour on other Fridays (forex + gold, every instrument "
                   f"between {nfp['range_ratio_min']}x and {nfp['range_ratio_max']}x; big-move days "
                   f"{nfp['big_event_pct_med']}% vs {nfp['big_ctrl_pct_med']}%; {nfp['n_event_med']} NFP days)."
                   + (f" Stocks pre-market at 06:30: {snfp['range_ratio_med']}x." if snfp else ''))
    if fomc:
        out.append(f"4. **FOMC days (8 a year, Wednesdays) at 12:00-13:00 Calgary:** the 12:00 statement half-hour range "
                   f"is **{fomc['range_ratio_med']}x** a normal Wednesday and the 12:30 press-conference half-hour "
                   f"**{fpc.get('range_ratio_med')}x** (big-move days {fpc.get('big_event_pct_med')}% vs "
                   f"{fpc.get('big_ctrl_pct_med')}%; {fomc['n_event_med']} FOMC days). On other days 12:00 is quiet "
                   f"({g(bt, '12:00')})." + (f" Stocks at 12:30 on FOMC days: {sfpc['range_ratio_med']}x." if sfpc else ''))
    if sbt:
        out.append(f"5. **13:30-14:00 Calgary = stock close.** The last regular half-hour has {g(sbt, '13:30', 'rv')} "
                   f"volume but only {g(sbt, '13:30', 'rr')} range: lots of volume (closing orders), not much price "
                   f"travel. The 14:00 bucket's volume ({g(sbt, '14:00', 'rv')}) is mostly closing-auction prints. "
                   f"Index CFDs at 13:30: {g(cbt, '13:30')}.")
    if bt:
        out.append(f"6. **18:00-19:30 Calgary = Asia morning** (Sun-Thu evenings): a mild pickup, {g(bt, '18:00')} at "
                   f"18:00 and {g(bt, '19:00')} at 19:00. Measured at 18:00 in both seasons (see the daylight-saving "
                   f"table).")
        out.append(f"7. **Quiet: 11:30-17:30 Calgary.** Forex drops below typical from 11:30 ({g(bt, '11:30')}), is "
                   f"lowest at 15:00 ({g(bt, '15:00')}: the 17:00 ET rollover, when spreads widen - avoid entries "
                   f"then) and stays quiet until the Asian morning.")
    dw = fxr.get('day_of_week') or []
    sd = sk.get('day_of_week') or []
    if dw:
        s = sorted(dw, key=lambda d: -(d['rel_day_range'] or 0))
        out.append('\n**Weekdays matter much less than the clock.** Forex + gold day range: '
                   + ', '.join(f"{d['weekday']} {d['rel_day_range']}x" for d in dw)
                   + f" (busiest {s[0]['weekday']} / {s[1]['weekday']}, about {round(100 * (s[0]['rel_day_range'] - s[-1]['rel_day_range']))}% "
                   f"between the busiest and the quietest day, against {_spread(bt)}x between the busiest and the "
                   'quietest half-hour of the day).'
                   + (' Stocks day volume: ' + ', '.join(f"{d['weekday']} {d['rel_day_volume']}x" for d in sd) + '.' if sd else ''))
    top = (fxr.get('top_windows') or [])[:3]
    if top:
        out.append('Busiest single weekday x half-hour cells, forex + gold: '
                   + '; '.join(f"{c['weekday']} {c['mt']} ({c['score']}x, {c['big_pct']}% big-move days)" for c in top) + '.')
    return '\n\n'.join(out)


# ---- main ----------------------------------------------------------------------------------------------------------
def analyse_group(bars: Dict[str, List[Bar]], stock: bool, start: dt.datetime, end: dt.datetime) -> Tuple[dict, list, dict]:
    names = [n for n in bars if len(bars[n]) > 500]
    if not names:
        return {}, [], {}
    i30 = [Inst(n, bars[n], 30, stock) for n in names]
    min_inst = max(1, len(names) // 2)
    c30 = combine({i.name: i.cells() for i in i30}, min_inst)
    bt = by_time(i30)
    top = sorted(c30.items(), key=lambda kv: -kv[1]['score'])[:20]
    a, b = start.date(), (end - dt.timedelta(days=1)).date()
    wk = [d for d in dates_between(a, b) if d.weekday() < 5]
    ev = {}
    for key, label, tz, hh, mm in EVENTS:
        if stock and key in ('tokyo_open', 'fx_rollover'):
            continue
        e = event_stats(i30, tz, hh, mm, wk)
        if e:
            e['label'] = label
        ev[key] = e
    sched = {}
    fridays = [d for d in wk if d.weekday() == 4]
    rule, corr = nfp_dates(a, b)
    ctrl = [d for d in fridays if d not in set(rule) | set(corr)]
    sched['nfp_0830'] = compare_days(i30, NY, 8, 30, corr, ctrl)
    sched['nfp_rule_0830'] = compare_days(i30, NY, 8, 30, rule, ctrl)
    # 2 h window 06:30-08:30 Calgary via the 60-min buckets would misalign (06:30), so use 30-min buckets summed
    sched['nfp_day'] = compare_window(i30, NY, 8, 30, 4, corr, ctrl)
    fomc = [dt.date.fromisoformat(x) for x in FOMC if a <= dt.date.fromisoformat(x) <= b]
    for k, (hh, mm) in (('fomc_1400', (14, 0)), ('fomc_1430', (14, 30))):
        ctl = [d for d in wk if d.weekday() in {x.weekday() for x in fomc} and d not in fomc]
        sched[k] = compare_days(i30, NY, hh, mm, fomc, ctl)
    sched['nfp_dates'] = [d.isoformat() for d in corr]
    sched['fomc_dates'] = [d.isoformat() for d in fomc]
    lo, hi = int(start.timestamp()), int(end.timestamp())
    part = {
        'instruments': per_instrument_peaks(i30),
        'by_time': bt,
        'windows': windows(bt, 1.5),
        'peaks': peaks(bt),
        'day_of_week': day_of_week(i30, bars),
        'top_windows': cells_json(dict(top), keep_order=True),
        'events': ev,
        'scheduled': sched,
        'stability': stability(i30, lo, (lo + hi) // 2, hi),
        'cells_30m': cells_json(c30),
    }
    return part, i30, c30


def compare_window(insts: List[Inst], tz, hh, mm, nb: int, ev_dates, ctrl_dates) -> dict:
    """nb consecutive 30-min buckets from the event: summed relative range, event vs control days."""
    rat, rows = [], []
    for ins in insts:
        def take(ds):
            out = []
            for d in ds:
                t0 = event_ts(d, tz, hh, mm)
                xs = [ins.by_ts.get(t0 + 1800 * k) for k in range(nb)]
                if all(xs):
                    out.append(sum(x[1] for x in xs))
            return out
        e, c = take(ev_dates), take(ctrl_dates)
        if len(e) < 3 or len(c) < 5:
            continue
        rows.append((len(e), len(c), med(e), med(c), sum(1 for x in e if x > BIG_X * nb) / len(e),
                     sum(1 for x in c if x > BIG_X * nb) / len(c)))
        rat.append(med(e) / med(c) if med(c) else 1)
    if not rows:
        return {}
    return {'range_ratio_med': rnd(med(rat)), 'range_ratio_min': rnd(min(rat)), 'range_ratio_max': rnd(max(rat)),
            'vol_ratio_med': None, 'n_event_med': int(med([r[0] for r in rows])), 'n_ctrl_med': int(med([r[1] for r in rows])),
            'big_event_pct_med': rnd(100 * med([r[4] for r in rows]), 1), 'big_ctrl_pct_med': rnd(100 * med([r[5] for r in rows]), 1)}


def dst_tables(i30: List[Inst], a: dt.date, b: dt.date) -> Tuple[dict, dict]:
    wk = [d for d in dates_between(a, b) if d.weekday() < 5]
    norm = [d for d in wk if not mismatch(d)]
    mis = [d for d in wk if mismatch(d)]
    rows = []
    for hhmm in ('00:30', '01:00', '01:30', '02:00', '02:30', '09:00', '10:00'):
        h, m = map(int, hhmm.split(':'))
        r = {'mt': hhmm}
        for lab, ds in (('normal', norm), ('mismatch', mis)):
            pv, pr = [], []
            for ins in i30:
                xs = [ins.by_ts[t] for t in (event_ts(d, MT, h, m) for d in ds) if t in ins.by_ts]
                if len(xs) >= 3:
                    pv.append(med([x[0] for x in xs]))
                    pr.append(med([x[1] for x in xs]))
            r['rv_' + lab], r['rr_' + lab] = rnd(med(pv)), rnd(med(pr))
        rows.append(r)
    dst = {'rows': rows, 'normal_days': len(norm), 'mismatch_days': len(mis),
           'mismatch_dates': [d.isoformat() for d in mis]}
    # Tokyo: Calgary on MST (winter) vs MDT (summer), Mon-Fri evenings (Sunday evening = Monday in Tokyo)
    trows = []
    for hhmm in ('16:30', '17:00', '17:30', '18:00', '18:30'):
        h, m = map(int, hhmm.split(':'))
        r = {'mt': hhmm}
        for lab, isdst in (('mst', False), ('mdt', True)):
            pv = []
            for ins in i30:
                xs = []
                for d in dates_between(a, b):
                    if d.weekday() not in (6, 0, 1, 2, 3):
                        continue
                    l = dt.datetime(d.year, d.month, d.day, h, m, tzinfo=MT)
                    if bool(l.dst()) != isdst:
                        continue
                    t = int(l.timestamp())
                    if t in ins.by_ts:
                        xs.append(ins.by_ts[t][0])
                if len(xs) >= 3:
                    pv.append(med(xs))
            r['rv_' + lab] = rnd(med(pv))
        trows.append(r)
    return dst, {'rows': trows}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--years', type=float, default=2.0)
    ap.add_argument('--budget-min', type=float, default=40)
    ap.add_argument('--synthetic', action='store_true', help='offline self-test data (no network)')
    ap.add_argument('--out-md', default=os.path.join(ROOT, 'docs', 'research', 'Market_Hours.md'))
    ap.add_argument('--out-json', default=os.path.join(ROOT, 'public', 'research', 'market_hours.json'))
    ap.add_argument('--out-dir', default=os.path.join(ROOT, 'docs', 'research'))
    args = ap.parse_args(argv)
    t0 = time.time()
    SD.set_budget(args.budget_min)
    end = dt.datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
    start = end - dt.timedelta(days=int(round(365.25 * args.years)))
    log(f'sample {start.date()} -> {end.date()} (end exclusive)')
    fxb, cfdb, stb = {}, {}, {}
    errors = {}
    if args.synthetic:
        fxb = synthetic(FX, start, end, False)
        cfdb = synthetic(CFD[:2], start, end, False)
        stb = synthetic(ETF + STOCKS[:5], start, end, True)
    else:
        for n in FX + CFD:
            try:
                bars = fetch_oanda(n, start, end)
                (fxb if n in FX else cfdb)[n] = bars
                log(f'  oanda {n}: {len(bars)} M15 bars')
            except (urllib.error.HTTPError, urllib.error.URLError, SD.HostDown, SD.BudgetExceeded, SD.BadBody,
                    oanda.NoToken, ValueError, OSError) as e:
                errors[n] = f'{type(e).__name__}: {getattr(e, "code", "")} {e}'[:200]
                log(f'  oanda {n}: FAILED {errors[n]}')
        if SD.alpaca_keys():
            try:
                stb = fetch_alpaca(ETF + STOCKS, start, end)
                for s in ETF + STOCKS:
                    log(f'  alpaca {s}: {len(stb.get(s, []))} 15Min bars')
            except (urllib.error.HTTPError, urllib.error.URLError, SD.HostDown, SD.BudgetExceeded, SD.BadBody,
                    ValueError, OSError) as e:
                errors['alpaca'] = f'{type(e).__name__}: {getattr(e, "code", "")} {e}'[:200]
                log(f'  alpaca: FAILED {errors["alpaca"]}')
        else:
            errors['alpaca'] = 'ALPACA_KEY_ID / ALPACA_SECRET_KEY not set'
    log(f'data in {time.time() - t0:.0f}s; analysing')
    R = {'meta': {'generated': dt.datetime.now(UTC).strftime('%Y-%m-%d %H:%M UTC'), 'start': start.date().isoformat(),
                  'end': (end - dt.timedelta(days=1)).date().isoformat(), 'synthetic': args.synthetic,
                  'timezone': 'America/Edmonton', 'bucket_minutes': 30, 'heatmap_minutes': 30, 'big_move_x': BIG_X,
                  'oanda_env': (os.environ.get('OANDA_ENV') or 'practice'), 'alpaca_feed': SD.alpaca_feed() if stb else None,
                  'errors': errors, 'fomc_dates_source': 'hard-coded from the Federal Reserve 2024-2026 schedule (memory)',
                  'nfp_rule': 'first Friday of the month, holiday Fridays removed, plus known moved releases (memory)',
                  'normalisation': 'per instrument and calendar month: / median bucket volume and / median bucket '
                                   'high-low (forex 24 h; stocks regular session)'}}
    fx_part, fx_i30, fx_c60 = analyse_group(fxb, False, start, end)
    cfd_part, cfd_i30, _ = analyse_group(cfdb, False, start, end)
    st_part, st_i30, st_c60 = analyse_group(stb, True, start, end)
    R['forex'], R['cfd'], R['stocks'] = fx_part, cfd_part, st_part
    if fx_i30:
        R['dst'], R['tokyo_dst'] = dst_tables(fx_i30, start.date(), (end - dt.timedelta(days=1)).date())
    R['narrative'] = narrative(R)
    os.makedirs(os.path.dirname(args.out_json), exist_ok=True)
    os.makedirs(args.out_dir, exist_ok=True)
    try:
        half = [f'{m // 60:02d}:{m % 60:02d}' for m in range(0, 1440, 30)]
        if fx_part:
            heatmap({(w, c['mt']): c for c in fx_part['cells_30m'] for w in [WD.index(c['weekday'])]},
                    [6, 0, 1, 2, 3, 4], half,
                    f"Forex + gold ({', '.join(fxb)}): activity by weekday and half-hour, Calgary time ({R['meta']['start']} to {R['meta']['end']})",
                    os.path.join(args.out_dir, 'market_hours_fx.png'))
        if st_part:
            heatmap({(w, c['mt']): c for c in st_part['cells_30m'] for w in [WD.index(c['weekday'])]},
                    [0, 1, 2, 3, 4], half[4:36],
                    f"US stocks ({len(stb)} symbols, pre + regular + post): weekday x half-hour, Calgary time",
                    os.path.join(args.out_dir, 'market_hours_stocks.png'))
    except ImportError as e:
        log(f'heatmaps skipped: {e}')
    with open(args.out_json, 'w') as f:
        json.dump(R, f, separators=(',', ':'))
    with open(args.out_md, 'w') as f:
        f.write(build_md(R))
    log(f'wrote {args.out_md}, {args.out_json} in {time.time() - t0:.0f}s; errors: {errors or "none"}')
    return 0 if (fx_part or st_part) else 1


if __name__ == '__main__':
    sys.exit(main())
