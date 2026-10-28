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
# Direction chain per entry TF (entry, intermediate, higher[, higher+1]): Raja's table with ZoneVision's +1 row
# (InpDirTable=3 + InpDirPlus1): H4 -> D1 -> W1 -> MN, D1 -> W1 -> MN, W1 -> MN -> 3M, MN -> 3M -> 3M
DIR_CHAIN = {'H4': ('H4', 'D1', 'W1', 'MN'), 'D1': ('D1', 'W1', 'MN'), 'W1': ('W1', 'MN', '3M'), 'MN': ('MN', '3M', '3M')}
# Set-and-forget limit orders only on these TFs (Raja L6 / L7 / L53: HTF zones are areas for direction and
# location; enter on D1 / H4). A W1 / MN zone that passes every rule is a WATCH 'area' (drill down to D1 / H4).
SIGNAL_TFS = ('H4', 'D1')
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
TP_OFFSET_PIPS = _f('FX_TP_OFFSET_PIPS', 7.0)           # target 7 pips before the opposite proximal (ZV InpTpOffsetPips)
MIN_LEG_X = _f('FX_MIN_LEG_X', 2.0)                     # Raja L55: departure >= 2x the base for set and forget
TL_FAR_PIPS = _f('FX_TL_FAR_PIPS', 25.0)                # Raja L4 / L107: a zone > 25 pips from its trendline breaks
TL_MAX_TOUCHES = int(_f('FX_TL_MAX_TOUCHES', 3))        # the own trendline already touched 3x: the next (4th) breaks
# HTF host: earlier visits allowed before the current one (Raja: MN 2nd / 3rd confirm, 4th breaks; D1 / W1 3rd
# risky; ZoneVision RjA_TouchCap 2). Stricter reading: D1 / W1 1 earlier visit, MN / 3M 2.
HOST_MAX_PRIOR = {'D1': 1, 'W1': 1, 'MN': 2, '3M': 2}
HOST_MAX_DEPTH = _f('FX_HOST_MAX_DEPTH', 75.0)          # Kevin L13: a host penetrated > 75% of its height is out
WEEKEND_FROM_H = int(_f('FX_WEEKEND_FROM_H', 12))       # Raja L53 / L7: no new H4 set and forget from Friday 12:00
# Instruments that never get a BUY / SELL (levels not reliable enough vs Pepperstone): WATCH 'context' only
CONTEXT_ONLY = {
    'USDX': 'synthetic spot dollar index (OANDA pairs, wicks are an upper bound): Pepperstone USDX follows the ICE '
            'futures, levels differ by a few tenths: context only',
}
FUTURES_CFD = ('BCO_USD', 'WTICO_USD', 'NATGAS_USD', 'XCU_USD', 'CORN_USD', 'WHEAT_USD', 'SOYBN_USD', 'SUGAR_USD')
FUTURES_NOTE = ('futures-based CFD: OANDA and Pepperstone roll on different dates (and may quote in different units), '
                'so roll gaps make false zones: context only until the levels are checked against Pepperstone')
for _n in FUTURES_CFD:
    CONTEXT_ONLY.setdefault(_n, FUTURES_NOTE)
MAX_SPREAD_FRAC = _f('FX_MAX_SPREAD_FRAC', 0.10)        # skip a signal when spread > 10% of the stop distance
INCLUDE_CFD = _b('FX_INCLUDE_CFD', False)               # OANDA CFDs (indices, commodities, bonds): off
GOLD_USD_MIN_TF = os.environ.get('FX_GOLD_USD_MIN_TF') or 'D1'   # Raja: no XAU_USD on low TFs (H4 blocked)
DEDUPE_HOURS = _f('FX_DEDUPE_HOURS', 24)                # a zone event (enter / approach) is re-sent at most daily
MAX_TOUCHES = 3                                         # lists / detail only (a host uses HOST_MAX_PRIOR)
STRONG = ('ARR', 'WOW', 'STR')

# ---- data ------------------------------------------------------------------------------------------------------------
KEEP_BARS = {'H4': 1500, 'D1': 1500, 'W1': 1500, 'MN': 600}   # cached / analysed history per TF
COLD_COUNT = 5000                                       # OANDA maximum candles per request
CACHE = os.environ.get('FX_CACHE') or os.path.join(HERE, '.cache')
OUT_DIR = os.path.join(ROOT, 'public', 'fx')
APP_URL = os.environ.get('FX_APP_URL', 'https://raman-fx.vercel.app/scanner/fx')
# Committed schedule state (last scanned H4, last daily summary, last digest): survives a lost / evicted actions cache
PUBLIC_STATE = os.path.join(OUT_DIR, 'state.json')
H4_DIGEST = _b('FX_H4_DIGEST', True)                    # one compact Telegram digest after every new H4 scan
LOCAL_TZ = os.environ.get('FX_LOCAL_TZ') or 'America/Edmonton'   # the owner's clock (Calgary)
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


# Metal pips as on Pepperstone MT4 / MT5 and ZoneVision (InpPipXAU=0.1): OANDA's pipLocation says 0.01 for gold
# and 0.0001 for silver, which made the 3-pip minimum stop $0.03 on gold and the "pips" 10x / 100x the chart's.
PIP_OVERRIDE = {'XAU': 0.1, 'XAG': 0.01, 'XPT': 0.1, 'XPD': 0.1}


def pip_of(inst: Dict) -> float:
    """Pip size: metals as on Pepperstone MT5 (gold 0.1, silver 0.01, XAU_JPY = 10 ** pipLocation); otherwise
    10 ** pipLocation (OANDA): 0.0001 for most pairs, 0.01 for JPY quotes."""
    n = inst['name']
    a, _, b = n.partition('_')
    if a in PIP_OVERRIDE and b not in ('JPY',):
        return PIP_OVERRIDE[a]
    pl = inst.get('pipLocation')
    if isinstance(pl, int):
        return 10.0 ** pl
    return 0.01 if n.endswith('_JPY') else 0.0001


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


def _last_sunday(y: int, m: int) -> dt.date:
    d = dt.date(y + (m == 12), m % 12 + 1, 1) - dt.timedelta(days=1)
    return d - dt.timedelta(days=(d.weekday() + 1) % 7)


try:
    from zoneinfo import ZoneInfo
    _NY = ZoneInfo('America/New_York')
except Exception:  # noqa: BLE001  (no tz database: the rule-based fallback below)
    _NY = None


def ny_offset(utc: dt.datetime) -> int:
    """New York's UTC offset in hours (-4 EDT / -5 EST) with the HISTORICAL rules (tz database America/New_York):
    since 2007 second Sunday of March -> first Sunday of November; 1987-2006 first Sunday of April -> last Sunday of
    October (02:00 local). Without a tz database the same rules are applied by hand."""
    u = utc.replace(tzinfo=None)
    if _NY is not None:
        off = u.replace(tzinfo=dt.timezone.utc).astimezone(_NY).utcoffset()
        return int(off.total_seconds() // 3600)
    y = u.year
    if y >= 2007:
        start = dt.datetime.combine(_nth_sunday(y, 3, 2), dt.time(7))
        end = dt.datetime.combine(_nth_sunday(y, 11, 1), dt.time(6))
    else:
        start = dt.datetime.combine(_nth_sunday(y, 4, 1), dt.time(7))
        end = dt.datetime.combine(_last_sunday(y, 10), dt.time(6))
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


class Misaligned(ValueError):
    """An OANDA candle that does not start on a Pepperstone server-time boundary (its content would differ)."""


MISALIGNED_MN: set = set()          # MN candle times seen off the 1st 00:00 (accepted within 12 h, logged once)


def label(utc_s: str, tf: str, strict: bool = True) -> str:
    """The bar label of an OANDA candle time: forex time, snapped to the period start. strict (default): H4 / D1 / W1
    candles must start exactly on a server-time boundary (H4 00/04/../20, D1 00:00, W1 Saturday 00:00 = Friday 17:00
    New York) and MN within 12 h of the 1st 00:00, else Misaligned is raised (the bar would not match the Pepperstone
    bar; the caller drops the instrument). An MN start off by less than 12 h is accepted and remembered in
    MISALIGNED_MN."""
    t = fx_time(parse_utc(utc_s))
    if strict:
        off = None
        if tf == 'H4' and (t.minute or t.second or t.hour % 4):
            off = 'H4'
        elif tf == 'D1' and (t.hour or t.minute or t.second):
            off = 'D1'
        elif tf == 'W1' and (t.weekday() != 5 or t.hour or t.minute or t.second):
            off = 'W1'
        elif tf == 'MN':
            s = t + dt.timedelta(hours=12)
            start = dt.datetime(s.year, s.month, 1)
            gap = abs((t - start).total_seconds())
            if gap > 12 * 3600:
                off = 'MN'
            elif gap:
                MISALIGNED_MN.add(str(utc_s)[:19])
        if off:
            raise Misaligned(f'{tf} candle at {str(utc_s)[:19]}Z = server time {t:%Y-%m-%d %H:%M} is not on a {tf} boundary')
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
