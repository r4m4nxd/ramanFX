"""Economic calendar (TradingView's public calendar JSON, same endpoint / headers as tools/reminders/reminders.py
fetch_tv), shared by the scanners (news warnings on alert cards), the Telegram bot (/news) and the morning brief.

    events(now, hours_ahead, countries=None, min_importance='high') -> [{time_utc, country, title, importance, currency}]

time_utc = 'YYYY-MM-DDTHH:MM:SSZ'; importance = 'high' | 'medium' | 'low'; country = TradingView code (US, EU, GB, JP,
AU, NZ, CA, CH, CN). One fetch per process per window (in-memory cache, 30 min) plus an optional file cache
(NEWS_CACHE_DIR, default tools/news/.cache) so several steps of one run share it. Never raises: a failed fetch gives [].

    warning(symbol, evs, now, market='fx') -> '⚠️ US CPI in 20 min' | ''   (FX: the pair's currencies, index CFDs their
    country, metals USD; stocks: US events) for a high-impact event in the next 60 min or the last 15.

Import as `from news import calendar` with tools/ on sys.path (never put tools/news itself on sys.path: this module
would shadow the standard library calendar).
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import time
import urllib.request
from typing import Callable, Dict, List, Optional, Sequence

TV = 'https://economic-calendar.tradingview.com/events'
UTC = dt.timezone.utc
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.environ.get('NEWS_CACHE_DIR') or os.path.join(HERE, '.cache')
TTL = 30 * 60
LEVEL = {'low': -1, 'medium': 0, 'high': 1}
NAME = {-1: 'low', 0: 'medium', 1: 'high'}
CCY_COUNTRY = {'USD': 'US', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP', 'AUD': 'AU', 'NZD': 'NZ', 'CAD': 'CA', 'CHF': 'CH', 'CNY': 'CN', 'CNH': 'CN'}
FX_COUNTRIES = sorted(set(CCY_COUNTRY.values()))
# index / commodity CFDs (Pepperstone names) -> the country whose news moves them
CFD_COUNTRY = {'US500': 'US', 'US30': 'US', 'NAS100': 'US', 'US2000': 'US', 'USDX': 'US', 'SPOTCRUDE': 'US', 'SPOTBRENT': 'US', 'NATGAS': 'US',
               'CORN': 'US', 'WHEAT': 'US', 'SOYBEANS': 'US', 'SUGAR': 'US', 'COPPER': 'US', 'GER40': 'EU', 'FRA40': 'EU', 'EUSTX50': 'EU',
               'SPA35': 'EU', 'NETH25': 'EU', 'UK100': 'GB', 'JPN225': 'JP', 'AUS200': 'AU', 'SWI20': 'CH', 'CN50': 'CN', 'CHINAH': 'CN', 'HK50': 'CN'}
METALS = ('XAU', 'XAG', 'XPT', 'XPD')
_mem: Dict[str, tuple] = {}


def _ua() -> str:
    c = os.environ.get('REMINDER_CONTACT') or ''
    return 'Mozilla/5.0 (compatible; RamanFX-calendar/1.0' + (f'; +mailto:{c}' if c else '') + ')'


def fetch_tv(url: str, timeout: int = 25) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': _ua(), 'Accept': 'application/json',
                                               'Origin': 'https://www.tradingview.com', 'Referer': 'https://www.tradingview.com/'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(5_000_000).decode('utf-8', 'replace')


def parse(text: str) -> List[Dict]:
    """TradingView JSON -> [{time_utc, country, title, importance, currency}] (bad rows dropped), sorted by time."""
    try:
        rows = json.loads(text).get('result') or []
    except (ValueError, AttributeError):
        return []
    out = []
    for r in rows:
        try:
            t = dt.datetime.strptime((r.get('date') or '')[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)
            imp = int(r.get('importance'))
        except (TypeError, ValueError):
            continue
        title = re.sub(r'\s+', ' ', str(r.get('title') or '')).strip()
        if not title:
            continue
        out.append({'time_utc': t.strftime('%Y-%m-%dT%H:%M:%SZ'), 'country': str(r.get('country') or '').upper(), 'title': title,
                    'importance': NAME.get(max(-1, min(1, imp)), 'low'), 'currency': str(r.get('currency') or '').upper()})
    return sorted(out, key=lambda e: e['time_utc'])


def _window(now: dt.datetime) -> tuple:
    """A fixed fetch window around now (whole UTC days: yesterday .. +3 days) so one cached fetch serves a whole run."""
    d = now.astimezone(UTC).date()
    return d - dt.timedelta(days=1), d + dt.timedelta(days=3)


def _load(now: dt.datetime, fetcher: Optional[Callable[[str], str]]) -> List[Dict]:
    a, b = _window(now)
    key = f'{a}_{b}'
    hit = _mem.get(key)
    if hit and time.time() - hit[0] < TTL:
        return hit[1]
    path = os.path.join(CACHE_DIR, f'calendar_{key}.json')
    if fetcher is None:
        try:
            if time.time() - os.path.getmtime(path) < TTL:
                with open(path) as f:
                    evs = json.load(f)
                _mem[key] = (time.time(), evs)
                return evs
        except (OSError, ValueError):
            pass
    url = f"{TV}?from={a}T00:00:00.000Z&to={b}T00:00:00.000Z&countries={','.join(FX_COUNTRIES)}"
    try:
        evs = parse((fetcher or fetch_tv)(url))
    except Exception:  # noqa: BLE001 - never break a scan over the calendar
        evs = []
    _mem[key] = (time.time(), evs)
    if evs and fetcher is None:
        try:
            os.makedirs(CACHE_DIR, exist_ok=True)
            with open(path, 'w') as f:
                json.dump(evs, f)
        except OSError:
            pass
    return evs


def events(now: Optional[dt.datetime] = None, hours_ahead: float = 24, countries: Optional[Sequence[str]] = None,
           min_importance: str = 'high', hours_back: float = 0, fetcher: Optional[Callable[[str], str]] = None) -> List[Dict]:
    """Calendar events from now - hours_back to now + hours_ahead (max ~2 days ahead), optionally for some countries
    (TradingView codes, e.g. ['US', 'EU']), at least min_importance. [] when the calendar cannot be fetched."""
    now = (now or dt.datetime.now(UTC)).astimezone(UTC)
    lo, hi = now - dt.timedelta(hours=hours_back), now + dt.timedelta(hours=hours_ahead)
    want = {c.upper() for c in countries} if countries else None
    lvl = LEVEL.get(min_importance, 1)
    out = []
    for e in _load(now, fetcher):
        t = dt.datetime.strptime(e['time_utc'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=UTC)
        if lo <= t <= hi and LEVEL[e['importance']] >= lvl and (want is None or e['country'] in want):
            out.append(dict(e))
    return out


def countries_of(symbol: str, market: str = 'fx') -> List[str]:
    """The countries whose news moves a symbol: FX pair -> both currencies, metals -> US (+ the quote currency),
    index / commodity CFDs -> their country, stocks -> US."""
    s = (symbol or '').upper().replace('_', '').replace('/', '')
    if market != 'fx':
        return ['US']
    if s in CFD_COUNTRY:
        return [CFD_COUNTRY[s]]
    if s[:3] in METALS:
        return sorted({'US', CCY_COUNTRY.get(s[3:6], 'US')})
    return sorted({CCY_COUNTRY[c] for c in (s[:3], s[3:6]) if c in CCY_COUNTRY})


def short_title(title: str, country: str) -> str:
    t = re.sub(r'\s*\((?:[A-Z]{3}|YoY|MoM|QoQ)\)\s*', ' ', title).strip()
    t = {'Non Farm Payrolls': 'jobs report (NFP)', 'Nonfarm Payrolls': 'jobs report (NFP)', 'Fed Interest Rate Decision': 'Fed decision'}.get(t, t)
    return f'{country} {t}'


def warning(symbol: str, evs: Sequence[Dict], now: Optional[dt.datetime] = None, market: str = 'fx',
            before_min: int = 60, after_min: int = 15) -> str:
    """'⚠️ US CPI in 20 min' / '⚠️ EU ECB Rate Decision 5 min ago' for the soonest high-impact event that moves the
    symbol, from 60 min ahead to 15 min after; '' when none."""
    now = (now or dt.datetime.now(UTC)).astimezone(UTC)
    want = set(countries_of(symbol, market))
    best = None
    for e in evs:
        if e.get('importance') != 'high' or e.get('country') not in want:
            continue
        t = dt.datetime.strptime(e['time_utc'], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=UTC)
        mins = (t - now).total_seconds() / 60
        if -after_min <= mins <= before_min and (best is None or abs(mins) < abs(best[0])):
            best = (mins, e)
    if not best:
        return ''
    mins, e = best
    m = int(round(mins))
    when = 'now' if m == 0 else f'in {m} min' if m > 0 else f'{-m} min ago'
    return f"⚠️ {short_title(e['title'], e['country'])} {when}"
