"""Forex fundamentals per currency and per scanner pair, from TradingView's public economic calendar JSON (the same
endpoint and headers as tools/reminders/reminders.py fetch_tv / tools/news/calendar.py), which carries actual /
forecast / previous values, plus the verified FOMC dates of tools/reminders/events.json.

Per currency: central-bank policy rate (latest decision: value, date, change vs the previous rate; the last actual
move; the next scheduled decision), latest CPI y/y, GDP growth (y/y when published, else q/q), unemployment rate.
Per FX pair: the rate differential (which side earns the carry), the inflation / growth comparison and a one-line
"fundamental bias" (context, never a signal). Metals, index / energy CFDs and crypto get a short note (US real rate,
the index's own central bank, USD liquidity).

Pure functions + one fetcher (injectable: tests mock it). Never raises on bad rows.
"""
from __future__ import annotations

import datetime as dt
import json
import re
import urllib.request
from typing import Callable, Dict, List, Optional, Sequence, Tuple

UTC = dt.timezone.utc
TV = 'https://economic-calendar.tradingview.com/events'

# currency -> (TradingView country code, central bank)
CCY: Dict[str, Tuple[str, str]] = {
    'USD': ('US', 'Fed'), 'EUR': ('EU', 'ECB'), 'GBP': ('GB', 'BoE'), 'JPY': ('JP', 'BoJ'), 'AUD': ('AU', 'RBA'),
    'NZD': ('NZ', 'RBNZ'), 'CAD': ('CA', 'BoC'), 'CHF': ('CH', 'SNB'), 'CNH': ('CN', 'PBoC'), 'CNY': ('CN', 'PBoC'),
    'SEK': ('SE', 'Riksbank'), 'NOK': ('NO', 'Norges Bank'), 'MXN': ('MX', 'Banxico'), 'ZAR': ('ZA', 'SARB'),
    'SGD': ('SG', 'MAS'), 'PLN': ('PL', 'NBP'), 'HUF': ('HU', 'MNB'), 'CZK': ('CZ', 'CNB'), 'TRY': ('TR', 'CBRT'),
    'DKK': ('DK', 'Nationalbanken'), 'HKD': ('HK', 'HKMA'), 'THB': ('TH', 'BoT'),
}
MAJORS = ('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF')
COUNTRIES = sorted({c for c, _ in CCY.values()})
# index / commodity CFDs (Pepperstone names) -> the currency whose central bank / data moves them (as tools/news/calendar.py)
CFD_CCY = {'US500': 'USD', 'US30': 'USD', 'NAS100': 'USD', 'US2000': 'USD', 'USDX': 'USD', 'GER40': 'EUR', 'FRA40': 'EUR',
           'EUSTX50': 'EUR', 'SPA35': 'EUR', 'NETH25': 'EUR', 'EURX': 'EUR', 'UK100': 'GBP', 'JPN225': 'JPY', 'JPYX': 'JPY',
           'AUS200': 'AUD', 'SWI20': 'CHF', 'CN50': 'CNH', 'CHINAH': 'CNH', 'HK50': 'HKD'}
ENERGY = ('SPOTCRUDE', 'SPOTBRENT', 'NATGAS')
SOFTS = ('CORN', 'WHEAT', 'SOYBEANS', 'SUGAR', 'COPPER')
METALS = ('XAU', 'XAG', 'XPT', 'XPD')
METAL_NAME = {'XAU': 'Gold', 'XAG': 'Silver', 'XPT': 'Platinum', 'XPD': 'Palladium'}

LOOKBACK_DAYS = 400       # a year+ of decisions: the last actual rate move
AHEAD_DAYS = 200          # next decisions
CHUNK_DAYS = 60           # one calendar request per 60 days (the JSON of 21 countries stays a few MB)
RATE_STEP = 0.25          # a rate gap below this is "about equal"
CPI_STEP = 0.3
GDP_STEP = 0.3
MOVE_FRESH_DAYS = 270     # a rate move this recent says which way the bank is going


# ---- calendar -----------------------------------------------------------------------------------------------------
def fetch_tv(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; RamanFX-fundamentals/1.0)',
                                               'Accept': 'application/json', 'Origin': 'https://www.tradingview.com',
                                               'Referer': 'https://www.tradingview.com/'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(40_000_000).decode('utf-8', 'replace')


def windows(now: dt.datetime, back: int = LOOKBACK_DAYS, ahead: int = AHEAD_DAYS, step: int = CHUNK_DAYS) -> List[str]:
    d0 = now.astimezone(UTC).date() - dt.timedelta(days=back)
    end = now.astimezone(UTC).date() + dt.timedelta(days=ahead)
    out = []
    while d0 < end:
        d1 = min(end, d0 + dt.timedelta(days=step))
        out.append(f"{TV}?from={d0}T00:00:00.000Z&to={d1}T00:00:00.000Z&countries={','.join(COUNTRIES)}")
        d0 = d1
    return out


def _num(v) -> Optional[float]:
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        m = re.match(r'^\s*([-+]?\d+(?:\.\d+)?)', v.replace(',', ''))
        return float(m.group(1)) if m else None
    return None


def parse_events(text: str) -> List[Dict]:
    """TradingView JSON -> [{t (aware UTC), country, title, indicator, ticker, actual, previous, forecast, period, unit}]."""
    try:
        rows = json.loads(text).get('result') or []
    except (ValueError, AttributeError):
        return []
    out = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        try:
            t = dt.datetime.strptime(str(r.get('date') or '')[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)
        except ValueError:
            continue
        title = re.sub(r'\s+', ' ', str(r.get('title') or '')).strip()
        if not title:
            continue
        out.append({'t': t, 'country': str(r.get('country') or '').upper(), 'title': title,
                    'indicator': str(r.get('indicator') or ''), 'ticker': str(r.get('ticker') or ''),
                    'actual': _num(r.get('actual')), 'previous': _num(r.get('previous')), 'forecast': _num(r.get('forecast')),
                    'period': str(r.get('period') or ''), 'unit': str(r.get('unit') or '')})
    return out


def load_events(now: dt.datetime, fetcher: Callable[[str], str] = fetch_tv, log=print) -> List[Dict]:
    """Every window of the lookback / ahead span, deduped (country, title, time). [] when nothing loaded."""
    seen, out, bad = set(), [], 0
    for u in windows(now):
        try:
            evs = parse_events(fetcher(u))
        except Exception as e:  # noqa: BLE001
            bad += 1
            log(f'calendar: window failed ({type(e).__name__})')
            continue
        for e in evs:
            k = (e['country'], e['title'], e['t'])
            if k not in seen:
                seen.add(k)
                out.append(e)
    log(f'calendar: {len(out)} events, {bad} failed windows')
    return sorted(out, key=lambda e: e['t'])


# ---- classification -----------------------------------------------------------------------------------------------
RATE_RE = re.compile(r'interest rate decision|rate decision|policy rate|cash rate|bank rate|refinancing rate|deposit facility|'
                     r'deposit rate|overnight rate|repo rate|benchmark rate|base rate|loan prime rate|fed funds|monetary policy rate|'
                     r'one-week repo|1-week repo|interest rate$', re.I)
RATE_NOT = re.compile(r'5[- ]?y|minutes|statement|press|speech|projection|expectation|swap|mortgage|lending facility|marginal|'
                      r'bank lending|loan growth|household|corporate|meeting', re.I)
CPI_RE = re.compile(r'(inflation rate|cpi|consumer price)', re.I)
CPI_NOT = re.compile(r'core|mom|m/m|qoq|q/q|tokyo|harmoni|hicp|ppi|producer|trimmed|weighted|median|food|services|expect|'
                     r'ex[ -]|excl|wholesale|import|export|rpi|cpif|underlying|sticky|cleveland|nationwide|index$', re.I)
YOY_RE = re.compile(r'yoy|y/y|annual|year', re.I)
GDP_RE = re.compile(r'gdp growth rate|\bgdp\b', re.I)
GDP_NOT = re.compile(r'deflator|price|capex|per capita|nowcast|gdpnow|consumption|index|sales|private|external|'
                     r'business|monthly|m/m|mom|3m', re.I)
UNEMP_RE = re.compile(r'^unemployment rate', re.I)
UNEMP_NOT = re.compile(r'youth|u-?6|claimant|change|harmoni|nsa|non[- ]seasonal|registered|insured', re.I)


def kind_of(e: Dict) -> Optional[str]:
    """'rate' | 'cpi' | 'gdp_yoy' | 'gdp_qoq' | 'unemp' | None."""
    title, ind = e['title'], e['indicator'].lower()
    if (ind == 'interest rate' or RATE_RE.search(title)) and not RATE_NOT.search(title):
        return 'rate'
    if (ind == 'inflation rate' or CPI_RE.search(title)) and not CPI_NOT.search(title) and (YOY_RE.search(title) or ind == 'inflation rate' and 'mom' not in title.lower()):
        return 'cpi'
    if GDP_RE.search(title) and not GDP_NOT.search(title):
        return 'gdp_yoy' if YOY_RE.search(title) else 'gdp_qoq'
    if UNEMP_RE.search(title) and not UNEMP_NOT.search(title):
        return 'unemp'
    return None


def _rate_pref(country: str, title: str) -> int:
    """Lower = preferred among several policy-rate series of one country (ECB: the deposit rate; China: the 1-year LPR)."""
    t = title.lower()
    if country == 'EU':
        return 0 if 'deposit' in t else 1 if 'refinanc' in t or 'interest rate' in t else 2
    if country == 'CN':
        return 0 if 'loan prime' in t else 1
    return 0 if ('decision' in t or 'interest rate' in t) else 1


def _plausible(kind: str, v: Optional[float]) -> bool:
    if v is None:
        return False
    lim = {'rate': (-2, 80), 'cpi': (-20, 150), 'gdp_yoy': (-40, 40), 'gdp_qoq': (-40, 40), 'unemp': (0, 50)}[kind]
    return lim[0] <= v <= lim[1]


def _iso(t: dt.datetime) -> str: return t.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')


def _r(v: Optional[float], n: int = 2) -> Optional[float]: return None if v is None else round(v, n)


def currency_data(ccy: str, evs: Sequence[Dict], now: dt.datetime, fomc: Sequence[str] = ()) -> Dict:
    """One currency's block. fomc: verified FOMC decision instants (ISO UTC), US only."""
    country, bank = CCY[ccy]
    mine = [e for e in evs if e['country'] == country]
    by: Dict[str, List[Dict]] = {}
    for e in mine:
        k = kind_of(e)
        if k:
            by.setdefault(k, []).append(e)
    out: Dict = {'country': country, 'bank': bank}

    rates = by.get('rate') or []
    if rates:
        pref = min(_rate_pref(country, e['title']) for e in rates)
        rates = [e for e in rates if _rate_pref(country, e['title']) == pref]
    past = [e for e in rates if e['t'] <= now and _plausible('rate', e['actual'])]
    if past:
        last = past[-1]
        prev = last['previous'] if _plausible('rate', last['previous']) else (past[-2]['actual'] if len(past) > 1 else None)
        chg = last['actual'] - prev if prev is not None else None
        rate = {'v': _r(last['actual']), 'date': _iso(last['t']), 'chg': _r(chg), 'title': last['title']}
        for e in reversed(past):              # the last decision that changed the rate
            p = e['previous'] if _plausible('rate', e['previous']) else None
            if p is not None and abs(e['actual'] - p) >= 0.005:
                rate['move'] = {'date': _iso(e['t']), 'chg': _r(e['actual'] - p)}
                break
        out['rate'] = rate
    nxt = [e['t'] for e in rates if e['t'] > now]
    if ccy == 'USD' and fomc:
        f = sorted(t for t in fomc if t > _iso(now))
        if f:
            out['next'] = {'date': f[0], 'verified': True, 'src': 'federalreserve.gov'}
    if 'next' not in out and nxt:
        n = min(nxt)
        fc = next((e['forecast'] for e in rates if e['t'] == n and _plausible('rate', e['forecast'])), None)
        out['next'] = {'date': _iso(n), 'verified': False, 'src': 'calendar', **({'forecast': _r(fc)} if fc is not None else {})}

    def latest(kind: str, max_age: int = 200) -> Optional[Dict]:
        rows = [e for e in by.get(kind) or [] if e['t'] <= now and _plausible(kind, e['actual'])
                and (now - e['t']).days <= max_age]
        if not rows:
            return None
        e = rows[-1]
        d = {'v': _r(e['actual'], 1), 'date': _iso(e['t']), 'period': e['period'], 'title': e['title']}
        if _plausible(kind, e['previous']):
            d['prev'] = _r(e['previous'], 1)
        return d
    cpi = latest('cpi', 120)
    if cpi:
        out['cpi'] = cpi
    g = latest('gdp_yoy')
    if g:
        out['gdp'] = {**g, 'basis': 'y/y'}
    else:
        g = latest('gdp_qoq')
        if g:
            ann = 'annual' in g['title'].lower() or country == 'US'
            out['gdp'] = {**g, 'basis': 'q/q ann.' if ann else 'q/q'}
    u = latest('unemp', 150)
    if u:
        out['unemp'] = u
    if out.get('rate') and out.get('cpi'):
        out['real'] = _r(out['rate']['v'] - out['cpi']['v'], 2)
    return out


# ---- pairs --------------------------------------------------------------------------------------------------------
def split_pair(sym: str) -> Optional[Tuple[str, str]]:
    s = sym.upper()
    if len(s) == 6 and s[:3] in CCY and s[3:] in CCY:
        return s[:3], s[3:]
    return None


def _move_dir(c: Dict, now: dt.datetime) -> int:
    m = (c.get('rate') or {}).get('move')
    if not m:
        return 0
    t = dt.datetime.strptime(m['date'][:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)
    if (now - t).days > MOVE_FRESH_DAYS:
        return 0
    return 1 if m['chg'] > 0 else -1 if m['chg'] < 0 else 0


def pair_view(base: str, quote: str, cur: Dict[str, Dict], now: dt.datetime) -> Optional[Dict]:
    """Rate gap / carry / inflation / growth comparison and the one-line bias for BASE/QUOTE. None without both rates."""
    a, b = cur.get(base) or {}, cur.get(quote) or {}
    ra, rb = (a.get('rate') or {}).get('v'), (b.get('rate') or {}).get('v')
    out: Dict = {'base': base, 'quote': quote}
    pts: Dict[str, List[str]] = {base: [], quote: []}
    score = 0                                  # > 0 favours the base currency
    if ra is not None and rb is not None:
        diff = round(ra - rb, 2)
        out['diff'] = diff
        if abs(diff) >= RATE_STEP:
            hi = base if diff > 0 else quote
            score += 2 if diff > 0 else -2
            pts[hi].append('higher rate')
            out['carry'] = {'earns': 'long' if diff > 0 else 'short', 'ccy': hi, 'pct': abs(diff)}
        else:
            out['carry'] = {'earns': None, 'ccy': None, 'pct': abs(diff)}
    da, db = _move_dir(a, now), _move_dir(b, now)
    if da != db:                               # the more hawkish bank's currency gets the point
        hawk, dove = (base, quote) if da > db else (quote, base)
        dh, dd = (da, db) if da > db else (db, da)
        score += 1 if da > db else -1
        pts[hawk].append(f'{CCY[hawk][1]} hiking' if dh > 0 else f'{CCY[dove][1]} cutting')
    ca, cb = (a.get('cpi') or {}).get('v'), (b.get('cpi') or {}).get('v')
    if ca is not None and cb is not None:
        out['cpi_diff'] = round(ca - cb, 1)
        if abs(ca - cb) >= CPI_STEP:
            hot = base if ca > cb else quote
            score += 1 if ca > cb else -1
            pts[hot].append('hotter CPI')
    ga, gb = a.get('gdp') or {}, b.get('gdp') or {}
    if ga.get('v') is not None and gb.get('v') is not None and ga.get('basis') == gb.get('basis'):
        out['gdp_diff'] = round(ga['v'] - gb['v'], 1)
        if abs(ga['v'] - gb['v']) >= GDP_STEP:
            strong = base if ga['v'] > gb['v'] else quote
            score += 1 if ga['v'] > gb['v'] else -1
            pts[strong].append('stronger growth')
    if ra is None or rb is None:
        if not (pts[base] or pts[quote]):
            return None
    out['score'] = score
    out['bias'] = bias_line(base, quote, score, pts)
    return out


def bias_line(base: str, quote: str, score: int, pts: Dict[str, List[str]]) -> str:
    """'USD stronger: higher rate, hotter CPI' | 'Mixed: EUR stronger growth · USD higher rate' | 'Balanced: ...'."""
    if score >= 2 or score <= -2:
        w = base if score > 0 else quote
        return f"{w} stronger: {', '.join(pts[w])}"
    bits = [f"{c} ({', '.join(p)})" for c, p in ((base, pts[base]), (quote, pts[quote])) if p]
    return ('Mixed: ' + ' vs '.join(bits)) if bits else 'Balanced: rates, inflation and growth about level'


# ---- non-FX notes -------------------------------------------------------------------------------------------------
def _pct(v: Optional[float]) -> str: return 'n/a' if v is None else f'{v:.2f}%'.replace('.00%', '%')


def note_for(sym: str, cls: str, cur: Dict[str, Dict]) -> Optional[str]:
    us = cur.get('USD') or {}
    usr, usc = (us.get('rate') or {}).get('v'), (us.get('cpi') or {}).get('v')
    real = f"US real rate {us['real']:+.1f}% (Fed {_pct(usr)} − CPI {usc:.1f}%)" if us.get('real') is not None and usc is not None else \
        f"Fed {_pct(usr)}" if usr is not None else 'US rates n/a'
    s = sym.upper()
    if s[:3] in METALS:
        q = s[3:]
        extra = f" · priced in {q}: {q} strength lowers it" if q not in ('USD', '') and q in CCY else ''
        return (f"{METAL_NAME[s[:3]]} pays no yield: higher real rates and a firmer USD usually weigh on it, falling real "
                f"rates support it. {real}{extra}")
    if s in CFD_CCY:
        c = CFD_CCY[s]
        d = cur.get(c) or {}
        r, i = (d.get('rate') or {}).get('v'), (d.get('cpi') or {}).get('v')
        if s in ('USDX', 'EURX', 'JPYX'):
            return f"{c} index: follows {CCY[c][1]} policy vs the others ({CCY[c][1]} {_pct(r)}, CPI {'n/a' if i is None else f'{i:.1f}%'})"
        return (f"Index: cheaper money helps stocks. {CCY[c][1]} {_pct(r)}"
                f"{'' if i is None else f', CPI {i:.1f}%'}{_move_txt(d)}; hot inflation keeps rates high")
    if cls == 'crypto':
        return f"Crypto: no central bank or cash flows; trades on USD liquidity and risk appetite. {real}"
    if s in ENERGY:
        return f"Energy: supply news (OPEC, inventories) first; priced in USD, so a firmer USD weighs on it. {real}"
    if s in SOFTS:
        return f"Commodity: weather / supply first; priced in USD, so a firmer USD weighs on it. {real}"
    return None


def ccys_for(sym: str) -> List[str]:
    """The currencies whose data a non-FX instrument's card shows (metals / energy / crypto: USD + the quote currency)."""
    s = sym.upper()
    if s in CFD_CCY:
        return [CFD_CCY[s]]
    q = s[3:] if s[:3] in METALS else ''
    return ['USD'] + ([q] if q in CCY and q != 'USD' else [])


def _move_txt(d: Dict) -> str:
    m = (d.get('rate') or {}).get('move')
    if not m:
        return ''
    when = dt.date.fromisoformat(m['date'][:10]).strftime('%b %Y')
    return f" (last move {m['chg']:+.2f} in {when})"


# ---- the file -----------------------------------------------------------------------------------------------------
def fomc_dates(events_json: Dict) -> List[str]:
    """Verified FOMC decision instants (ISO UTC) from tools/reminders/events.json ({kinds: {fomc: {events: [{date, et}]}}})."""
    from zoneinfo import ZoneInfo
    et = ZoneInfo('America/New_York')
    out = []
    for e in (((events_json or {}).get('kinds') or {}).get('fomc') or {}).get('events') or []:
        try:
            if e.get('verified') is False:
                continue
            h, m = (e.get('et') or '14:00').split(':')
            d = dt.date.fromisoformat(e['date'])
            out.append(_iso(dt.datetime(d.year, d.month, d.day, int(h), int(m), tzinfo=et)))
        except (KeyError, ValueError, AttributeError):
            continue
    return sorted(out)


def build(now: dt.datetime, evs: Sequence[Dict], instruments: Sequence[Dict], fomc: Sequence[str] = ()) -> Dict:
    """fx.json: {generated_at, source, currencies, pairs, notes}. instruments = fx/latest.json map rows ({sym, cls})."""
    wanted = list(MAJORS)
    for r in instruments:
        p = split_pair(str(r.get('sym') or ''))
        for c in p or ():
            if c not in wanted:
                wanted.append(c)
        q = str(r.get('sym') or '')[3:]
        if str(r.get('sym') or '')[:3] in METALS and q in CCY and q not in wanted:
            wanted.append(q)
    for c in CFD_CCY.values():
        if c not in wanted:
            wanted.append(c)
    cur = {c: currency_data(c, evs, now, fomc if c == 'USD' else ()) for c in wanted}
    cur = {c: v for c, v in cur.items() if any(k in v for k in ('rate', 'cpi', 'gdp', 'unemp'))}
    pairs, notes = {}, {}
    for r in instruments:
        sym, cls = str(r.get('sym') or ''), str(r.get('cls') or '')
        p = split_pair(sym)
        if p and cls not in ('metal', 'crypto', 'cfd'):
            v = pair_view(p[0], p[1], cur, now)
            if v:
                pairs[sym] = v
            continue
        n = note_for(sym, cls, cur)
        if n:
            notes[sym] = {'text': n, 'ccys': [c for c in ccys_for(sym) if c in cur]}
    return {'version': 1, 'generated_at': _iso(now), 'context_only': True,
            'source': 'TradingView economic calendar (actual / previous / forecast); FOMC dates: federalreserve.gov',
            'currencies': cur, 'pairs': pairs, 'notes': notes}


def summary(fx: Dict) -> List[str]:
    """Log lines: what each currency got (titles included, so a wrong match shows in the run log)."""
    out = []
    for c, d in fx.get('currencies', {}).items():
        bits = []
        for k in ('rate', 'cpi', 'gdp', 'unemp'):
            if d.get(k):
                bits.append(f"{k} {d[k]['v']} ({d[k].get('title', '')}, {d[k]['date'][:10]})")
        if d.get('next'):
            bits.append(f"next {d['next']['date'][:10]}")
        out.append(f"{c}: " + ' · '.join(bits))
    return out
