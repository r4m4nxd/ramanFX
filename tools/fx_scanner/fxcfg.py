"""FX scanner settings, instrument classes, pip maths and the forex clock.

Every number the owner may want to change is an environment variable (repository variable in the workflow) with the
default below. The zone / direction / location logic itself is tools/stock_scanner/zones.py (imported, not copied).

Forex clock: OANDA candles are asked with alignmentTimezone=America/New_York, dailyAlignment=17 and
weeklyAlignment=Friday, so a trading day runs 17:00 -> 17:00 New York. Every bar is labelled in "forex time" = New
York time + 7 h: the day then starts at 00:00, H4 bars at 00 / 04 / 08 / 12 / 16 / 20, a week on Saturday 00:00
(= Friday 17:00 NY, the start of the Sunday session) and a month on the 1st. Labels are 'YYYY-MM-DDTHH:MM' strings,
which sort in time order and keep the month / quarter maths of zones.py (period_key, to_quarters) working.
"""
from __future__ import annotations

import datetime as dt
import json
import os
from typing import Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))


def _f(name: str, default: float) -> float:
    try:
        return float(os.environ.get(name) or default)
    except ValueError:
        return default


def _b(name: str, default: bool) -> bool:
    v = (os.environ.get(name) or '').strip().lower()
    return default if not v else v in ('1', 'true', 'yes', 'on')


# ---- timeframes: the owner's chain (Raja's table H4 -> D1 -> W1 -> MN), 3M = top context built from MN ---------------
ENTRY_TFS = ('H4', 'D1', 'W1', 'MN')                    # zone / entry timeframes, lowest first
CONTEXT_TFS = ('3M',)                                   # context level: blocks only when a strong zone is within reach
HTF_OF = {'H4': 'D1', 'D1': 'W1', 'W1': 'MN', 'MN': '3M', '3M': None}
LOWER_OF = {'MN': 'W1', 'W1': 'D1', 'D1': 'H4', 'H4': None}
# Direction chain per entry TF (entry, intermediate, higher), one level up each: H4 -> D1 -> W1, ..., MN -> 3M -> 3M
DIR_CHAIN = {'H4': ('H4', 'D1', 'W1'), 'D1': ('D1', 'W1', 'MN'), 'W1': ('W1', 'MN', '3M'), 'MN': ('MN', '3M', '3M')}
GRAN = {'H4': 'H4', 'D1': 'D', 'W1': 'W', 'MN': 'M'}   # OANDA granularity
TF_HOURS = {'H4': 4, 'D1': 24, 'W1': 168}
# Stops: distal + % of the zone height per TF (owner's rule, extended to the FX chain)
SL_PCT = {'H4': 15.0, 'D1': 10.0, 'W1': 5.0, 'MN': 3.0, '3M': 2.0}
SL_MIN_PIPS = 3.0                                       # InpSlMinPips=3

# ---- rule knobs ------------------------------------------------------------------------------------------------------
SOFT_REACH_PCT = _f('FX_SOFT_REACH_PCT', 5.0)           # a 3M context zone counts only within X% of price
APPROACH_H = _f('FX_APPROACH_H', 1.0)                   # BUY / SELL: price within 1.0x the zone height of the proximal
NEAR_H = _f('FX_NEAR_H', 1.0)                           # lists: "approaching" = within 1.0x the zone height
LEFT_BARS = int(_f('FX_LEFT_BARS', 6))                  # lists: "left" = touched in the last 6 H4 bars (one day)
NEW_BARS = int(_f('FX_NEW_BARS', 6))                    # WATCH 'new': zone known within the last 6 H4 bars
TP_OFFSET = _f('FX_TP_OFFSET_PCT', 0.05) / 100.0        # target 0.05% of price before the opposite proximal
MAX_SPREAD_FRAC = _f('FX_MAX_SPREAD_FRAC', 0.10)        # skip a signal when spread > 10% of the stop distance
INCLUDE_CFD = _b('FX_INCLUDE_CFD', False)               # OANDA CFDs (indices, commodities, bonds): off
GOLD_USD_MIN_TF = os.environ.get('FX_GOLD_USD_MIN_TF') or 'D1'   # Raja: no XAU_USD on low TFs (H4 blocked)
DEDUPE_HOURS = _f('FX_DEDUPE_HOURS', 24)                # a zone event (enter / approach) is re-sent at most daily
MAX_TOUCHES = 3
STRONG = ('ARR', 'WOW', 'STR')

# ---- data ------------------------------------------------------------------------------------------------------------
KEEP_BARS = {'H4': 1500, 'D1': 1500, 'W1': 1500, 'MN': 600}   # cached / analysed history per TF
COLD_COUNT = 5000                                       # OANDA maximum candles per request
CACHE = os.environ.get('FX_CACHE') or os.path.join(HERE, '.cache')
OUT_DIR = os.path.join(ROOT, 'public', 'fx')
APP_URL = os.environ.get('FX_APP_URL', 'https://raman-fx.vercel.app/scanner/fx')
BUDGET_MIN = _f('FX_BUDGET_MIN', 25)
MIN_COVERAGE = _f('FX_MIN_COVERAGE', 0.5)

# ---- instruments -----------------------------------------------------------------------------------------------------
G8 = ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF')
METALS = ('XAU', 'XAG', 'XPT', 'XPD')
CLASSES = ('major', 'cross', 'exotic', 'metal', 'cfd')
CLASS_LABEL = {'major': 'Majors', 'cross': 'Crosses', 'exotic': 'Exotics', 'metal': 'Metals', 'cfd': 'CFDs'}
GOLD_NOTE = 'Gold: Raja trades XAU_AUD rather than XAU_USD on the lower timeframes (XAU_USD is too fast there).'
EXOTIC_TAG = 'exotic · wide spread'


def fx_class(name: str, kind: str = 'CURRENCY') -> str:
    """major (USD vs a G8 currency), cross (two G8 currencies, no USD), exotic (any non-G8 currency), metal, cfd."""
    a, _, b = name.partition('_')
    if kind == 'METAL' or a in METALS:
        return 'metal'
    if kind not in ('CURRENCY', ''):
        return 'cfd'
    if a in G8 and b in G8:
        return 'major' if 'USD' in (a, b) else 'cross'
    return 'exotic'


def digits_of(inst: Dict) -> int:
    """Price decimals: OANDA's displayPrecision; gold 2 (owner); JPY quotes 3, others 5 when unknown."""
    name = inst['name']
    if name.startswith('XAU_'):
        return 2
    dp = inst.get('displayPrecision')
    if isinstance(dp, int) and 0 <= dp <= 8:
        return dp
    return 3 if name.endswith('_JPY') else 5


def pip_of(inst: Dict) -> float:
    """Pip size = 10 ** pipLocation (OANDA): 0.0001 for most pairs, 0.01 for JPY quotes and gold."""
    pl = inst.get('pipLocation')
    if isinstance(pl, int):
        return 10.0 ** pl
    n = inst['name']
    return 0.01 if n.endswith('_JPY') or n.startswith(('XAU_', 'XPT_', 'XPD_')) else 0.0001


def pips(diff: float, inst: Dict) -> float:
    return abs(diff) / pip_of(inst)


def fmt(v: Optional[float], inst: Dict) -> str:
    return 'n/a' if v is None else f'{v:.{digits_of(inst)}f}'


def display(name: str) -> str:
    return name.replace('_', '/')


def load_fallback() -> List[Dict]:
    """The committed instrument list (used when OANDA's account instrument list cannot be read)."""
    with open(os.path.join(HERE, 'instruments.json')) as f:
        return json.load(f)['instruments']


def select(instruments: List[Dict], include_cfd: Optional[bool] = None) -> List[Dict]:
    """CURRENCY (majors, crosses, exotics) + METAL; CFD only with FX_INCLUDE_CFD. Adds 'cls', sorted by class, name."""
    inc = INCLUDE_CFD if include_cfd is None else include_cfd
    out = []
    for i in instruments:
        kind = i.get('type') or 'CURRENCY'
        if kind == 'CFD' and not inc:
            continue
        if kind not in ('CURRENCY', 'METAL', 'CFD'):
            continue
        out.append({**i, 'type': kind, 'cls': fx_class(i['name'], kind)})
    return sorted(out, key=lambda i: (CLASSES.index(i['cls']), i['name']))


# ---- forex clock -----------------------------------------------------------------------------------------------------
def _nth_sunday(y: int, m: int, n: int) -> dt.date:
    d = dt.date(y, m, 1)
    d += dt.timedelta(days=(6 - d.weekday()) % 7)
    return d + dt.timedelta(weeks=n - 1)


def ny_offset(utc: dt.datetime) -> int:
    """New York's UTC offset in hours (-4 EDT, second Sunday of March 07:00 UTC -> first Sunday of November 06:00 UTC)."""
    y = utc.year
    start = dt.datetime.combine(_nth_sunday(y, 3, 2), dt.time(7))
    end = dt.datetime.combine(_nth_sunday(y, 11, 1), dt.time(6))
    u = utc.replace(tzinfo=None)
    return -4 if start <= u < end else -5


def parse_utc(s: str) -> dt.datetime:
    """OANDA RFC3339 ('2026-10-25T21:00:00.000000000Z') or unix seconds -> naive UTC datetime."""
    s = str(s)
    if s.replace('.', '', 1).isdigit():
        return dt.datetime.fromtimestamp(float(s), dt.timezone.utc).replace(tzinfo=None)
    return dt.datetime.strptime(s[:19], '%Y-%m-%dT%H:%M:%S')


def fx_time(utc: dt.datetime) -> dt.datetime:
    """UTC -> forex time (New York + 7 h)."""
    return utc + dt.timedelta(hours=ny_offset(utc) + 7)


def label(utc_s: str, tf: str) -> str:
    """The bar label of an OANDA candle time: forex time, snapped to the period start (robust to the alignment OANDA
    uses for weeks and months)."""
    t = fx_time(parse_utc(utc_s))
    if tf == 'MN':
        t = t + dt.timedelta(days=3)
        return f'{t.year:04d}-{t.month:02d}-01T00:00'
    if tf == 'W1':
        d = (t + dt.timedelta(hours=12)).date()
        d -= dt.timedelta(days=(d.weekday() - 5) % 7)
        return d.isoformat() + 'T00:00'
    if tf == 'D1':
        return (t + dt.timedelta(hours=12)).date().isoformat() + 'T00:00'
    t = t + dt.timedelta(minutes=30)
    return t.replace(hour=t.hour - t.hour % 4, minute=0).strftime('%Y-%m-%dT%H:%M')


def period_key(tf: str, d: str):
    """The bucket of a forex-time label on tf (for zones.visit_touched): H4 the bar, D1 the day, W1 the Saturday the
    week starts on, MN / 3M / 6M the month / quarter / half (zones.period_key)."""
    import zones as Z
    if tf == 'H4':
        return d[:16]
    if tf == 'D1':
        return d[:10]
    if tf == 'W1':
        day = dt.date.fromisoformat(d[:10])
        return (day - dt.timedelta(days=(day.weekday() - 5) % 7)).isoformat()
    return Z.period_key(tf, d)


def h4_close_utc(lbl: str) -> dt.datetime:
    """UTC close time of the H4 bar with forex-time label lbl."""
    t = dt.datetime.strptime(lbl[:16], '%Y-%m-%dT%H:%M') + dt.timedelta(hours=4)
    for off in (-4, -5):
        u = t - dt.timedelta(hours=off + 7)
        if ny_offset(u) == off:
            return u
    return t - dt.timedelta(hours=3)
