"""Stock fundamentals for the scanner universe (public/scanner/index.json, ~1000 US-listed names) from SEC EDGAR's free
APIs, plus earnings dates.

    company_tickers.json   ticker -> CIK (www.sec.gov/files/company_tickers.json; universe.csv's CIK wins)
    companyfacts (XBRL)    revenue / EPS TTM + YoY, net margin, debt / equity, shares outstanding (the stock scanner's
                           tools/stock_scanner/fundamentals.py does the TTM math: base() / compute(), reused here)
    submissions            8-K filings (titles from the item codes), the last earnings release (8-K item 2.02) and the
                           10-Q / 10-K cadence -> an ESTIMATED next earnings date

Market cap = shares outstanding x the latest scan price (ADR ratio applied); P/E = price / TTM EPS (USD EPS only).
Next earnings: Nasdaq's public earnings calendar (api.nasdaq.com, no key) when it answers, else estimated from the
filing cadence (labelled 'estimated'). TSX-only names have no SEC filings: 'n/a'.

SEC requires a User-Agent with a contact: it is the GitHub repository variable SEC_CONTACT (env SEC_CONTACT). Unset:
nothing is requested from SEC (one log line); cached data from earlier runs is still used. The contact is never
printed or written to any output. Requests go through the scanner's data.http_get (SEC host paced at 5 per second,
below SEC's 10 per second; circuit breaker on 403 / 429). Cache (tools/fundamentals/.cache, kept in the Actions
cache): companyfacts bases refreshed weekly, submissions daily, company_tickers weekly.
"""
from __future__ import annotations

import csv
import datetime as dt
import importlib.util
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Dict, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SCANNER = os.path.join(ROOT, 'tools', 'stock_scanner')
CACHE = os.environ.get('FUND_CACHE') or os.path.join(HERE, '.cache')
if SCANNER not in sys.path:
    sys.path.insert(0, SCANNER)
import data as SD  # noqa: E402  (tools/stock_scanner/data.py: http_get with per-host pacing + breaker)

_spec = importlib.util.spec_from_file_location('scanner_fundamentals', os.path.join(SCANNER, 'fundamentals.py'))
SF = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(SF)  # type: ignore[union-attr]

TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'
FACTS_URL = 'https://data.sec.gov/api/xbrl/companyfacts/CIK{}.json'
SUBS_URL = 'https://data.sec.gov/submissions/CIK{}.json'
NASDAQ_URL = 'https://api.nasdaq.com/api/calendar/earnings?date={}'
BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
FACTS_DAYS = 7
SUBS_DAYS = 1
TICKERS_DAYS = 7
ITEMS = {'1.01': 'Material agreement', '1.02': 'Agreement ended', '1.03': 'Bankruptcy', '1.05': 'Cybersecurity incident',
         '2.01': 'Acquisition / sale completed', '2.02': 'Earnings results', '2.03': 'New debt', '2.04': 'Debt acceleration',
         '2.05': 'Restructuring costs', '2.06': 'Impairment', '3.01': 'Listing notice', '3.02': 'Unregistered share sale',
         '3.03': 'Shareholder rights change', '4.01': 'Auditor change', '4.02': 'Restatement', '5.01': 'Change of control',
         '5.02': 'Director / officer change', '5.03': 'Bylaws / fiscal year change', '5.07': 'Shareholder vote',
         '5.08': 'Director nominations', '7.01': 'Investor disclosure (Reg FD)', '8.01': 'Other events'}
PERIODIC = ('10-Q', '10-K', '20-F', '40-F')


def user_agent(contact: str) -> str: return f'RamanFX fundamentals {contact.strip()}'


def _cik(v) -> str:
    d = ''.join(ch for ch in str(v or '') if ch.isdigit())
    return d.zfill(10) if d else ''


def _norm(sym: str) -> str: return re.sub(r'[^A-Z0-9]', '', sym.upper())


# ---- cache --------------------------------------------------------------------------------------------------------
def _path(kind: str, key: str) -> str: return os.path.join(CACHE, kind, f'{key}.json')


def cache_get(kind: str, key: str) -> Tuple[Optional[Dict], float]:
    """(stored value, age in days); (None, inf) when missing."""
    try:
        with open(_path(kind, key)) as f:
            js = json.load(f)
        return js.get('v'), (time.time() - float(js.get('fetched', 0))) / 86400
    except (OSError, ValueError, TypeError):
        return None, float('inf')


def cache_put(kind: str, key: str, v) -> None:
    os.makedirs(os.path.join(CACHE, kind), exist_ok=True)
    with open(_path(kind, key), 'w') as f:
        json.dump({'fetched': time.time(), 'v': v}, f)


def _index() -> Dict:
    with open(os.path.join(ROOT, 'public', 'scanner', 'index.json')) as f:
        return json.load(f)


# ---- universe -----------------------------------------------------------------------------------------------------
def universe() -> List[Dict]:
    """[{s, n, px, cik, tsx_only, currency}] for every scanner stock (index.json), CIK / feed from universe.csv."""
    idx = _index()
    meta = {}
    with open(os.path.join(SCANNER, 'universe.csv'), newline='', encoding='utf-8') as f:
        for r in csv.DictReader(l for l in f if l.strip() and not l.startswith('#')):
            meta[r['symbol']] = r
    out = []
    for t in idx.get('tickers') or []:
        s = str(t.get('s') or '')
        if not s:
            continue
        m = meta.get(s, {})
        out.append({'s': s, 'n': t.get('n') or m.get('name') or '', 'px': t.get('px'), 'cik': _cik(m.get('cik')),
                    'tsx_only': m.get('feed') == 'tsx' or s.endswith('.TO'), 'currency': m.get('currency') or 'USD'})
    return out


def parse_company_tickers(raw: bytes) -> Dict[str, str]:
    """company_tickers.json -> {normalised ticker: 10-digit CIK} ('BRK-B' and 'BRK.B' both -> 'BRKB')."""
    js = json.loads(raw)
    rows = js.values() if isinstance(js, dict) else js
    out = {}
    for r in rows:
        try:
            out.setdefault(_norm(str(r['ticker'])), _cik(r['cik_str']))
        except (KeyError, TypeError):
            continue
    return out


def ticker_ciks(ua: Optional[str], log=print) -> Dict[str, str]:
    v, age = cache_get('meta', 'company_tickers')
    if v and (age < TICKERS_DAYS or not ua):
        return v
    if not ua:
        return v or {}
    try:
        v = parse_company_tickers(SD.http_get(TICKERS_URL, ua=ua, accept='application/json', expect=SD.looks_json))
        cache_put('meta', 'company_tickers', v)
    except Exception as e:  # noqa: BLE001
        log(f'SEC company_tickers.json failed ({type(e).__name__}): {len(v or {})} cached')
    return v or {}


# ---- submissions --------------------------------------------------------------------------------------------------
def parse_submissions(js: Dict) -> Dict:
    """submissions JSON -> {er: [8-K item 2.02 filing dates], periodic: [[filed, form, report]], k8: [[date, title, url]]}."""
    rec = ((js or {}).get('filings') or {}).get('recent') or {}
    cik = str(int(js.get('cik') or 0)) if str(js.get('cik') or '').strip().isdigit() else ''
    n = len(rec.get('form') or [])
    col = lambda k, i: (rec.get(k) or [''] * n)[i] if i < len(rec.get(k) or []) else ''  # noqa: E731
    er, per, k8 = set(), [], []
    for i in range(n):
        form, filed = col('form', i), col('filingDate', i)
        if not filed:
            continue
        if form in ('8-K', '8-K/A', '6-K'):
            items = [x.strip() for x in str(col('items', i) or '').split(',') if x.strip()]
            if '2.02' in items and form != '8-K/A':
                er.add(filed)
            if len(k8) < 6:
                names = [ITEMS[x] for x in items if x in ITEMS]
                title = ' · '.join(names[:2]) if names else (str(col('primaryDocDescription', i) or '').strip() or form)
                acc = str(col('accessionNumber', i) or '').replace('-', '')
                doc = str(col('primaryDocument', i) or '')
                url = f'https://www.sec.gov/Archives/edgar/data/{cik}/{acc}/{doc}' if cik and acc and doc else ''
                k8.append([filed, form.replace('/A', ' amend.'), title[:60], url])
        elif form in PERIODIC:
            per.append([filed, form, col('reportDate', i)])
    return {'er': sorted(er), 'periodic': sorted(per)[-12:], 'k8': k8, 'name': str(js.get('name') or '')}


def _weekday(d: dt.date) -> dt.date:
    while d.weekday() >= 5:
        d += dt.timedelta(days=1)
    return d


def estimate_next(er: Sequence[str], periodic: Sequence[Sequence[str]], today: dt.date) -> Optional[str]:
    """Next earnings date (ISO) from the release cadence: the same quarter a year on (last year's release + 364 days),
    else the last release + 91 days. Releases = 8-K item 2.02 dates, else the 10-Q / 10-K filing dates. None when
    there is no history or the estimate is more than 3 weeks overdue."""
    dates = sorted({dt.date.fromisoformat(d) for d in er if d}) or \
        sorted({dt.date.fromisoformat(p[0]) for p in periodic if p and p[0] and p[1] in ('10-Q', '10-K')})
    if not dates:
        return None
    last = dates[-1]
    cands = [_weekday(d + dt.timedelta(days=364)) for d in dates
             if last + dt.timedelta(days=45) < d + dt.timedelta(days=364) <= last + dt.timedelta(days=140)]
    est = min(cands) if cands else _weekday(last + dt.timedelta(days=91))
    if est < today - dt.timedelta(days=21):
        return None
    return est.isoformat()


def last_release(er: Sequence[str], periodic: Sequence[Sequence[str]], today: dt.date) -> Optional[str]:
    ds = [d for d in er if d <= today.isoformat()] or [p[0] for p in periodic if p and p[0] <= today.isoformat() and p[1] in PERIODIC]
    return max(ds) if ds else None


# ---- Nasdaq earnings calendar ------------------------------------------------------------------------------------
TIME = {'time-pre-market': 'before open', 'time-after-hours': 'after close'}


def parse_nasdaq(raw: bytes, day: str) -> Dict[str, Dict]:
    """One day of api.nasdaq.com/api/calendar/earnings -> {normalised symbol: {date, time, eps_est}}."""
    js = json.loads(raw)
    rows = (((js or {}).get('data') or {}).get('rows')) or []
    out = {}
    for r in rows:
        s = _norm(str(r.get('symbol') or ''))
        if not s:
            continue
        est = r.get('epsForecast')
        m = re.match(r'^\(?\$?(-?[\d.]+)\)?$', str(est or '').strip())
        v = float(m.group(1)) * (-1 if str(est).strip().startswith('(') else 1) if m else None
        out[s] = {'date': day, 'time': TIME.get(str(r.get('time') or ''), ''), 'eps_est': v}
    return out


def nasdaq_calendar(today: dt.date, days_ahead: int = 28, days_back: int = 7, get: Optional[Callable] = None,
                    log=print) -> Optional[Dict[str, Dict]]:
    """{symbol: {date, time, eps_est}} over weekdays [today - days_back, today + days_ahead] (the NEXT date wins for the
    future, the latest for the past: key 'past'). None when Nasdaq refuses / fails every day."""
    get = get or (lambda u: SD.http_get(u, ua=BROWSER, accept='application/json, text/plain, */*', retries=2, timeout=15,
                                        expect=SD.looks_json, headers={'Origin': 'https://www.nasdaq.com', 'Referer': 'https://www.nasdaq.com/'}))
    nxt: Dict[str, Dict] = {}
    past: Dict[str, Dict] = {}
    ok = bad = 0
    for k in range(-days_back, days_ahead + 1):
        d = today + dt.timedelta(days=k)
        if d.weekday() >= 5:
            continue
        try:
            rows = parse_nasdaq(get(NASDAQ_URL.format(d.isoformat())), d.isoformat())
            ok += 1
        except Exception as e:  # noqa: BLE001
            bad += 1
            if bad == 1:
                log(f'Nasdaq earnings {d}: {type(e).__name__}')
            if ok == 0 and bad >= 3:
                break
            continue
        for s, v in rows.items():
            if d >= today:
                nxt.setdefault(s, v)
            else:
                past[s] = v
    log(f'Nasdaq earnings calendar: {ok} days ok, {bad} failed, {len(nxt)} upcoming')
    if ok == 0:
        return None
    return {'next': nxt, 'past': past}   # type: ignore[return-value]


# ---- per company --------------------------------------------------------------------------------------------------
def refresh(ciks: Sequence[str], ua: str, kind: str, max_age: float, cap: int, budget_s: float, log=print) -> int:
    """Download what is older than max_age (oldest first, at most cap), 4 threads, paced by data.http_get."""
    todo = sorted(((cache_get(kind, c)[1], c) for c in set(ciks) if c), reverse=True)
    todo = [c for age, c in todo if age >= max_age][:cap]
    stop = time.time() + budget_s
    n = [0, 0]

    def one(c: str) -> None:
        if time.time() > stop or SD.host_open('https://data.sec.gov/'):
            return
        try:
            if kind == 'facts':
                cf = json.loads(SD.http_get(FACTS_URL.format(c), ua=ua, accept='application/json', expect=SD.looks_json))
                cache_put('facts', c, SF.base(cf))
            else:
                js = json.loads(SD.http_get(SUBS_URL.format(c), ua=ua, accept='application/json', expect=SD.looks_json))
                cache_put('subs', c, parse_submissions(js))
            n[0] += 1
        except Exception as e:  # noqa: BLE001
            n[1] += 1
            if getattr(e, 'code', None) == 404:
                cache_put(kind, c, None)          # no XBRL / no filings: do not ask again until it is stale
    with ThreadPoolExecutor(max_workers=4) as ex:
        list(ex.map(one, todo))
    log(f'SEC {kind}: {n[0]} refreshed, {n[1]} failed, {len(todo) - n[0] - n[1]} not started (of {len(todo)} due)')
    return n[0]


def _r(v, n=4):
    return None if v is None else round(v, n) if abs(v) < 1e4 else round(v)


def record(u: Dict, base: Optional[Dict], subs: Optional[Dict], cal: Optional[Dict], today: dt.date) -> Dict:
    """One stock's entry in stocks.json."""
    out: Dict = {'n': u['n']}
    if u['tsx_only']:
        out['na'] = 'TSX-only: no SEC filings'
        return out
    if u['cik']:
        out['cik'] = u['cik'].lstrip('0')
    px = u.get('px')
    if base and isinstance(px, (int, float)) and px > 0:
        f = SF.compute(dict(base), float(px), [], [])
        out.update({'cur': f.get('currency') or 'USD', 'px': px, 'mcap': f.get('market_cap'), 'pe': f.get('pe'),
                    'rev': f.get('revenue_ttm'), 'rev_g': f.get('revenue_yoy'), 'eps': f.get('eps_ttm'), 'eps_g': f.get('eps_yoy'),
                    'nm': f.get('net_margin'), 'de': f.get('debt_to_equity'), 'end': f.get('revenue_end') or f.get('eps_end') or '',
                    'per': f.get('period') or 'TTM', 'src': 'SEC'})
        if f.get('pe_note'):
            out['pe_note'] = f['pe_note']
    elif not u['cik']:
        out['na'] = 'no SEC filer found for this ticker'
    if subs:
        out['er_last'] = last_release(subs.get('er') or [], subs.get('periodic') or [], today)
        est = estimate_next(subs.get('er') or [], subs.get('periodic') or [], today)
        if est:
            out['er_next'], out['er_kind'] = est, 'estimated'
        out['filings'] = [f[:4] for f in (subs.get('k8') or [])[:4]]
    nk = _norm(u['s'])
    if cal:
        n = (cal.get('next') or {}).get(nk)
        if n:
            out['er_next'], out['er_kind'] = n['date'], 'nasdaq'
            if n.get('time'):
                out['er_time'] = n['time']
            if n.get('eps_est') is not None:
                out['eps_est'] = n['eps_est']
        p = (cal.get('past') or {}).get(nk)
        if p and (not out.get('er_last') or p['date'] > out['er_last']):
            out['er_last'] = p['date']
    return {k: (_r(v) if isinstance(v, float) else v) for k, v in out.items() if v is not None and v != ''}


def build(now: dt.datetime, contact: str = '', earnings: bool = True, log=print, facts_cap: int = 400,
          budget_min: float = 25, nasdaq_get: Optional[Callable] = None) -> Dict:
    today = now.date()
    uni = universe()
    ua = user_agent(contact) if contact.strip() else None
    if not ua:
        log('SEC: skipped (repository variable SEC_CONTACT is not set: SEC needs a contact in the User-Agent); '
            'cached SEC data from earlier runs is used')
    tk = ticker_ciks(ua, log)
    for u in uni:
        if not u['cik'] and not u['tsx_only']:
            u['cik'] = tk.get(_norm(u['s']), '')
    ciks = [u['cik'] for u in uni if u['cik'] and not u['tsx_only']]
    log(f'universe: {len(uni)} stocks, {len(ciks)} with a CIK, {sum(u["tsx_only"] for u in uni)} TSX-only')
    if ua:
        t0 = time.time()
        refresh(ciks, ua, 'subs', SUBS_DAYS, cap=len(ciks), budget_s=budget_min * 60 * 0.4, log=log)
        refresh(ciks, ua, 'facts', FACTS_DAYS, cap=facts_cap, budget_s=max(60, budget_min * 60 - (time.time() - t0)), log=log)
    cal = nasdaq_calendar(today, get=nasdaq_get, log=log) if earnings else None
    stocks = {}
    for u in uni:
        b = cache_get('facts', u['cik'])[0] if u['cik'] else None
        s = cache_get('subs', u['cik'])[0] if u['cik'] else None
        stocks[u['s']] = record(u, b, s, cal, today)
    n_f = sum(1 for v in stocks.values() if v.get('src'))
    n_e = sum(1 for v in stocks.values() if v.get('er_next'))
    log(f'stocks.json: {len(stocks)} stocks, {n_f} with SEC numbers, {n_e} with a next earnings date '
        f'({sum(1 for v in stocks.values() if v.get("er_kind") == "nasdaq")} from Nasdaq)')
    return {'version': 1, 'generated_at': now.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'context_only': True,
            'sec': bool(ua), 'earnings_source': 'Nasdaq earnings calendar' if cal else 'estimated from SEC filing cadence',
            'price_date': _index().get('date'),
            'source': 'SEC EDGAR (companyfacts XBRL, submissions); price: latest scanner close', 'stocks': stocks}
