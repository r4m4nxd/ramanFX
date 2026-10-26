"""Compact fundamentals per ticker from SEC EDGAR XBRL companyfacts, plus price-derived ratios.

CONTEXT ONLY: none of these numbers is part of the supply & demand rules. A signal never depends on them.

SEC asks automated clients to identify themselves in the User-Agent. The default is a generic project string
("RamanFX-scanner/1.0"). If SEC answers 403, set env SEC_UA to "<project> <contact address>" (a contact SEC can
reach); it is read from the environment only and never written to any file or output.

Taxonomies and currencies: US filers (10-K / 10-Q) report us-gaap; foreign private issuers (20-F, Canadian 40-F)
report us-gaap or ifrs-full, often in their own currency (EUR, JPY, TWD, CNY, CAD ...). The reporting currency is
the unit of the newest revenue / profit facts; money values are shown in it with the code ("EUR 12.3B"). 20-F / 40-F
filers report annually: their figures are fiscal-year values (period "FY") and YoY compares two fiscal years.
Currency- and ratio-safe metrics (growth %, margins, debt / equity) are always shown. Price-based ones need the
price and the per-share numbers on the same footing: market cap = price x shares / ADR ratio (ordinary shares per
ADS, from adr_list.csv; 1 for US filers and Canadian interlisted names), P/E additionally needs EPS in USD. An ADR
without a known ratio, or EPS in another currency, gets P/E n/a (with the reason).

A curated CIK (ADR / Canadian interlisted) whose SEC entity name does not match the company name is not used
(guards a wrong committed CIK).

Optional fallback: env FMP_API_KEY (Financial Modeling Prep, free tier 250 requests / day): companies whose SEC
data has no revenue and no EPS get annual statements from FMP (3 requests, cached like the SEC base, at most
FMP_PER_RUN downloads per process), labelled source "FMP". Off without the key.
"""
from __future__ import annotations

import csv
import datetime as dt
import json
import os
import threading
import time
import urllib.parse
from typing import Dict, List, Optional, Tuple

from data import CACHE, HERE, host_open, http_get, looks_json, over_budget

SEC_UA = os.environ.get('SEC_UA') or 'RamanFX-scanner/1.0'
NA = 'n/a'
SEC_FACTS = 'https://data.sec.gov/api/xbrl/companyfacts'
FMP = 'https://financialmodelingprep.com/stable/'
FMP_PER_RUN = int(os.environ.get('FMP_PER_RUN', '60'))
ANNUAL_FORMS = ('10-K', '10-K/A', '20-F', '20-F/A', '40-F', '40-F/A')
FORMS = ANNUAL_FORMS + ('10-Q', '10-Q/A')
NS = ('us-gaap', 'ifrs-full')

# us-gaap tags first, then the ifrs-full ones (each list is searched in both taxonomies; the newest data wins)
REVENUE = ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax', 'RevenueFromContractWithCustomerIncludingAssessedTax',
           'SalesRevenueNet', 'SalesRevenueGoodsNet', 'RevenuesNetOfInterestExpense', 'InterestAndDividendIncomeOperating',
           'Revenue', 'RevenueFromContractsWithCustomers']
NET_INCOME = ['NetIncomeLoss', 'ProfitLoss', 'NetIncomeLossAvailableToCommonStockholdersBasic',
              'ProfitLossAttributableToOwnersOfParent']
EPS = ['EarningsPerShareDiluted', 'EarningsPerShareBasicAndDiluted', 'EarningsPerShareBasic',
       'DilutedEarningsLossPerShare', 'BasicEarningsLossPerShare', 'BasicAndDilutedEarningsLossPerShare']
OCF = ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations',
       'CashFlowsFromUsedInOperatingActivities']
CAPEX = ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsToAcquireProductiveAssets',
         'PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities', 'PurchaseOfPropertyPlantAndEquipment']
EQUITY = ['StockholdersEquity', 'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
          'EquityAttributableToOwnersOfParent', 'Equity']
LT_DEBT = ['LongTermDebt', 'LongTermDebtNoncurrent']
ST_DEBT = ['LongTermDebtCurrent', 'DebtCurrent', 'ShortTermBorrowings', 'CommercialPaper']
IFRS_DEBT_TOTAL = ['Borrowings']
IFRS_LT_DEBT = ['NoncurrentPortionOfNoncurrentBorrowings', 'LongtermBorrowings']
IFRS_ST_DEBT = ['CurrentBorrowingsAndCurrentPortionOfNoncurrentBorrowings', 'CurrentPortionOfNoncurrentBorrowings',
                'ShorttermBorrowings', 'CurrentBorrowings']
SHARES_FALLBACK = ['CommonStockSharesOutstanding', 'NumberOfSharesOutstanding', 'WeightedAverageNumberOfDilutedSharesOutstanding',
                   'WeightedAverageShares']
SYMBOL = {'USD': '$'}


def _is_ccy(u: str) -> bool: return len(u) == 3 and u.isalpha() and u.isupper()


def fetch_companyfacts(cik: str, max_age_days: float = 7, offline: bool = False) -> Optional[dict]:
    """Raw companyfacts (not cached: the files are megabytes each; the scanner caches the small `base()` instead)."""
    if not cik or offline:
        return None
    raw = http_get(f'{SEC_FACTS}/CIK{cik.zfill(10)}.json', ua=SEC_UA, accept='application/json', expect=looks_json)
    return json.loads(raw)


def _lite_path(cik: str) -> str: return os.path.join(CACHE, 'sec_lite', f'CIK{cik.zfill(10)}.json')


def cached_base(cik: str) -> Tuple[Optional[Dict], float]:
    """(price-independent fundamentals, age in days) from the small local cache; (None, inf) when missing."""
    if not cik:
        return None, float('inf')
    p = _lite_path(cik)
    if not os.path.exists(p):
        return None, float('inf')
    try:
        with open(p) as fh:
            js = json.load(fh)
        return js.get('base'), (time.time() - float(js.get('fetched', 0))) / 86400
    except (OSError, ValueError):
        return None, float('inf')


# ---- listing facts: which symbol / company a CIK is in the universe, and its ADR ratio ---------------------------
_LIST_LOCK = threading.Lock()
_LISTINGS: Optional[Dict[str, Dict]] = None


def _read_csv(path: str) -> List[Dict[str, str]]:
    if not os.path.exists(path):
        return []
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(l for l in f if l.strip() and not l.startswith('#')))


def _ratio(v: str) -> Optional[float]:
    try:
        x = float(v)
        return x if x > 0 else None
    except (TypeError, ValueError):
        return None


def listings(reload: bool = False) -> Dict[str, Dict]:
    """{cik (10 digits): {symbol, name, home, adr (True when in adr_list.csv), adr_ratio}} from the committed
    universe.csv + adr_list.csv (and the CIKs committed in adr_list.csv / tsx_us_map.csv)."""
    global _LISTINGS
    with _LIST_LOCK:
        if _LISTINGS is not None and not reload:
            return _LISTINGS
        adr = {r['symbol'].strip().upper(): r for r in _read_csv(os.path.join(HERE, 'adr_list.csv')) if r.get('symbol')}
        out: Dict[str, Dict] = {}
        for r in _read_csv(os.path.join(HERE, 'universe.csv')):
            c = ''.join(ch for ch in (r.get('cik') or '') if ch.isdigit())
            if not c:
                continue
            a = adr.get(r['symbol'])
            out[c.zfill(10)] = {'symbol': r['symbol'], 'name': r.get('name', ''), 'home': r.get('home') or '',
                                'adr': a is not None, 'adr_ratio': _ratio((a or {}).get('adr_ratio', ''))}
        for sym, a in adr.items():           # committed CIKs of the curated ADRs (before the universe has them)
            c = ''.join(ch for ch in (a.get('cik') or '') if ch.isdigit())
            if c and c.zfill(10) not in out:
                out[c.zfill(10)] = {'symbol': sym, 'name': a.get('name', ''), 'home': '', 'adr': True,
                                    'adr_ratio': _ratio(a.get('adr_ratio', ''))}
        _LISTINGS = out
        return out


def listing_of(cik) -> Optional[Dict]:
    c = ''.join(ch for ch in str(cik or '') if ch.isdigit())
    return listings().get(c.zfill(10)) if c else None


def adr_ratio(cik, form: str = '') -> Optional[float]:
    """Ordinary shares per traded share: the adr_list.csv ratio for a curated ADR (None when blank = unknown), 1 for a
    Canadian interlisted name and for US filers; None for any other 20-F filer (an ADR we have no ratio for)."""
    l = listing_of(cik)
    if l and l['adr']:
        return l['adr_ratio']
    if l and l['home'].startswith('TSX:'):
        return 1.0
    return None if form.startswith('20-F') else 1.0


def same_company(expected: str, entity: str) -> bool:
    import universe as U
    return max(U.name_match(expected, entity), U.name_match(entity, expected)) >= 0.5


# ---- optional FMP fallback ----------------------------------------------------------------------------------------
_FMP_N = [0]


def fmp_key() -> str: return os.environ.get('FMP_API_KEY', '').strip()


def _fmp(endpoint: str, symbol: str) -> List[dict]:
    q = urllib.parse.urlencode({'symbol': symbol.replace('.', '-'), 'limit': '2', 'apikey': fmp_key()})
    js = json.loads(http_get(f'{FMP}{endpoint}?{q}', accept='application/json', expect=looks_json))
    return js if isinstance(js, list) else []


def fmp_base(symbol: str) -> Optional[Dict]:
    """A base() from FMP's annual statements (source "FMP", period FY), or None (no key, quota, nothing)."""
    if not fmp_key() or not symbol or _FMP_N[0] >= FMP_PER_RUN or host_open(FMP) or over_budget():
        return None
    _FMP_N[0] += 1
    try:
        inc = _fmp('income-statement', symbol)
        if not inc:
            return None
        bal = _fmp('balance-sheet-statement', symbol)
        cfs = _fmp('cash-flow-statement', symbol)
    except Exception:  # noqa: BLE001
        return None

    def num(r, *k):
        for x in k:
            v = (r or {}).get(x)
            if isinstance(v, (int, float)):
                return float(v)
        return None

    def g(a, b): return (a - b) / abs(b) if a is not None and b else None
    i0, i1 = inc[0], (inc[1] if len(inc) > 1 else {})
    rev, ni, eps = num(i0, 'revenue'), num(i0, 'netIncome'), num(i0, 'epsDiluted', 'epsdiluted', 'eps')
    b0 = bal[0] if bal else {}
    c0 = cfs[0] if cfs else {}
    debt, eq = num(b0, 'totalDebt'), num(b0, 'totalStockholdersEquity')
    sh = num(i0, 'weightedAverageShsOutDil', 'weightedAverageShsOut')
    sh1 = num(i1, 'weightedAverageShsOutDil', 'weightedAverageShsOut')
    end = str(i0.get('date') or '')
    return {'revenue_ttm': rev, 'revenue_yoy': g(rev, num(i1, 'revenue')), 'revenue_end': end,
            'eps_ttm': eps, 'eps_yoy': g(eps, num(i1, 'epsDiluted', 'epsdiluted', 'eps')), 'eps_end': end,
            'net_margin': ni / rev if ni is not None and rev else None, 'net_income_end': end,
            'ocf_ttm': num(c0, 'operatingCashFlow'), 'fcf_ttm': num(c0, 'freeCashFlow'), 'cash_flow_end': str(c0.get('date') or ''),
            'debt': debt, 'equity': eq, 'debt_to_equity': debt / eq if debt is not None and eq and eq > 0 else None,
            'balance_end': str(b0.get('date') or ''), 'shares': sh, 'shares_yoy': sh / sh1 - 1 if sh and sh1 else None,
            'shares_end': end, 'filings': [], 'currency': str(i0.get('reportedCurrency') or 'USD').upper(),
            'source': 'FMP', 'period': 'FY', 'form': '', 'entity': symbol}


def _empty(b: Optional[Dict]) -> bool: return not b or (b.get('revenue_ttm') is None and b.get('eps_ttm') is None)


def fetch_base(cik: str, max_age_days: float = 7, offline: bool = False, log=None) -> Optional[Dict]:
    """Small cached fundamentals for one company, refreshed from SEC when older than max_age_days. A company whose
    SEC entity name does not match the universe's name is stored as None (wrong CIK); with FMP_API_KEY set a company
    without SEC revenue / EPS is filled from FMP."""
    b, age = cached_base(cik)
    if not cik or offline or age < max_age_days:
        return b
    try:
        cf = fetch_companyfacts(cik)
    except Exception:  # noqa: BLE001 - keep the stale copy
        cf = None
        if not fmp_key():
            return b
    nb = base(cf) if cf else None
    l = listing_of(cik)
    mismatch = False
    committed = l is not None and (l['adr'] or l['home'].startswith('TSX:'))     # CIKs we curated, not Wikipedia's
    if nb is not None and committed and l.get('name') and cf.get('entityName') and not same_company(l['name'], cf['entityName']):
        if log:
            log(f"SEC CIK {cik}: entity {cf['entityName']!r} is not {l['name']!r} ({l['symbol']}): fundamentals n/a")
        nb, b, mismatch = None, None, True
    if _empty(nb) and l and fmp_key():
        nb = fmp_base(l['symbol']) or nb
    if nb is not None or mismatch:
        os.makedirs(os.path.dirname(_lite_path(cik)), exist_ok=True)
        with open(_lite_path(cik), 'w') as fh:
            json.dump({'fetched': time.time(), 'base': nb}, fh)
    return nb or b


def refresh_plan(ciks: List[str], urgent: List[str], per_run: int = 600, weekly: float = 7, daily: float = 1,
                 cold_cap: Optional[int] = None) -> List[str]:
    """Which CIKs to download this run: urgent (signalled) ones older than a day, then the others older than a week,
    oldest first, at most per_run in total, of which at most cold_cap never cached before (a cold cache fills over
    a few runs instead of one long one). Spreads the whole universe over the week and keeps SEC traffic polite."""
    out, seen = [], set()
    for c in urgent:
        if c and c not in seen and cached_base(c)[1] >= daily:
            out.append(c)
            seen.add(c)
    rest = sorted(((cached_base(c)[1], c) for c in set(ciks) - seen if c), reverse=True)
    cold = 0
    for age, c in rest:
        if len(out) >= per_run:
            break
        if age == float('inf'):
            if cold_cap is not None and cold >= cold_cap:
                continue
            cold += 1
        if age >= weekly:
            out.append(c)
    return out[:max(per_run, len([c for c in urgent if c]))]


def refresh_bases(ciks: List[str], workers: int = 4, log=None, budget_s: Optional[float] = None) -> int:
    """Refresh the cached bases. Stops starting downloads after budget_s seconds, when the global time budget is
    spent, or while the SEC host's circuit breaker is open (e.g. 403 for a missing SEC_UA): the stale copies stay."""
    from concurrent.futures import ThreadPoolExecutor
    t0 = time.time()
    stop_at = t0 + budget_s if budget_s else float('inf')
    skipped = [0]

    def one(c: str) -> Optional[Dict]:
        if time.time() >= stop_at or over_budget() or host_open(SEC_FACTS):
            skipped[0] += 1
            return None
        return fetch_base(c, max_age_days=0, log=log)
    with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
        n = sum(1 for b in ex.map(one, ciks) if b)
    if log:
        log(f'SEC: refreshed {n}/{len(ciks)} companies in {time.time() - t0:.0f}s ({skipped[0]} skipped: budget / breaker)')
    return n


# ---- fact helpers -----------------------------------------------------------------------------------------------
def _d(s: str) -> dt.date: return dt.date.fromisoformat(s)


def pick(cf: dict, names: List[str], unit_pref=('USD', 'USD/shares', 'shares'), ns=NS + ('dei',)) -> Tuple[List[dict], str, str]:
    """(facts, taxonomy, unit) of the tag with the newest data among `names` (searched in every taxonomy of `ns`),
    from 10-K / 10-Q / 20-F / 40-F filings, deduped per (start, end) keeping the latest filing."""
    best: List[dict] = []
    best_end, best_ns, best_unit = '', '', ''
    for n in names:
        for space in ns:
            tag = ((cf.get('facts') or {}).get(space) or {}).get(n)
            if not tag:
                continue
            for u in unit_pref:
                rows = (tag.get('units') or {}).get(u)
                if not rows:
                    continue
                keep: Dict[Tuple[str, str], dict] = {}
                for r in rows:
                    if r.get('form') not in FORMS or 'val' not in r or 'end' not in r:
                        continue
                    k = (r.get('start', ''), r['end'])
                    if k not in keep or r.get('filed', '') > keep[k].get('filed', ''):
                        keep[k] = r
                vals = sorted(keep.values(), key=lambda r: (r['end'], r.get('start', '')))
                # several tags carry the same concept: use the one with the newest data
                if vals and vals[-1]['end'] > best_end:
                    best, best_end, best_ns, best_unit = vals, vals[-1]['end'], space, u
                break
    return best, best_ns, best_unit


def facts(cf: dict, names: List[str], unit_pref=('USD', 'USD/shares', 'shares'), ns=NS + ('dei',)) -> List[dict]:
    """Facts of the tag with the newest data (see pick)."""
    return pick(cf, names, unit_pref, ns)[0]


def reporting_currency(cf: dict) -> str:
    """The currency unit of the newest revenue / profit / equity facts (USD when there are none)."""
    best, cur = '', 'USD'
    for names in (REVENUE, NET_INCOME, EQUITY):
        for n in names:
            for space in NS:
                for u, rows in ((((cf.get('facts') or {}).get(space) or {}).get(n) or {}).get('units') or {}).items():
                    if not _is_ccy(u):
                        continue
                    e = max((r.get('end', '') for r in rows if r.get('form') in FORMS), default='')
                    if e > best or (e == best and e and u == 'USD'):
                        best, cur = e, u
    return cur


def _days(r: dict) -> int: return (_d(r['end']) - _d(r['start'])).days if r.get('start') else 0


def ttm(rows: List[dict], end: Optional[str] = None) -> Optional[Tuple[float, str]]:
    """Trailing twelve months ending at `end` (default the newest period): an annual value, or
    YTD + prior fiscal year - prior-year YTD, or the sum of four discrete quarters."""
    dur = [r for r in rows if r.get('start')]
    if not dur:
        return None
    if end is None:
        end = max(r['end'] for r in dur)
    at = [r for r in dur if r['end'] == end]
    ann = [r for r in at if 350 <= _days(r) <= 380]
    if ann:
        return float(ann[0]['val']), end
    ytd = sorted((r for r in at if 80 <= _days(r) < 350), key=_days, reverse=True)
    for y in ytd:
        start = _d(y['start'])
        fy = [r for r in dur if 350 <= _days(r) <= 380 and abs((_d(r['end']) - (start - dt.timedelta(days=1))).days) <= 10]
        pe = _d(end) - dt.timedelta(days=364)
        prior = [r for r in dur if abs((_d(r['end']) - pe).days) <= 10 and abs(_days(r) - _days(y)) <= 12]
        if fy and prior:
            return float(fy[0]['val']) + float(y['val']) - float(prior[0]['val']), end
    q = sorted({r['end']: r for r in dur if 80 <= _days(r) <= 100}.values(), key=lambda r: r['end'])
    q = [r for r in q if r['end'] <= end]
    if len(q) >= 4 and (_d(q[-1]['end']) - _d(q[-4]['end'])).days <= 300 and q[-1]['end'] == end:
        return sum(float(r['val']) for r in q[-4:]), end
    return None


def ttm_yoy(rows: List[dict]) -> Tuple[Optional[float], Optional[float], str]:
    """(TTM now, YoY growth vs the TTM one year earlier, period end)."""
    now = ttm(rows)
    if not now:
        return None, None, ''
    pe = _d(now[1]) - dt.timedelta(days=364)
    ends = sorted({r['end'] for r in rows if r.get('start') and abs((_d(r['end']) - pe).days) <= 10})
    prev = None
    for e in ends:
        prev = ttm(rows, e)
        if prev:
            break
    g = (now[0] - prev[0]) / abs(prev[0]) if prev and prev[0] else None
    return now[0], g, now[1]


def latest_instant(rows: List[dict]) -> Optional[Tuple[float, str]]:
    inst = [r for r in rows if not r.get('start')]
    if not inst:
        return None
    r = max(inst, key=lambda r: r['end'])
    return float(r['val']), r['end']


def instant_at(rows: List[dict], end: str) -> Optional[float]:
    for r in rows:
        if not r.get('start') and r['end'] == end:
            return float(r['val'])
    return None


def total_debt(cf: dict, cur: str = 'USD') -> Optional[Tuple[float, str]]:
    """us-gaap long-term + current debt; else ifrs-full Borrowings, or non-current + current borrowings."""
    u = (cur,)
    lt = latest_instant(facts(cf, LT_DEBT, u, ns=('us-gaap',)))
    st_names = ST_DEBT
    if not lt:
        tot = latest_instant(facts(cf, IFRS_DEBT_TOTAL, u, ns=('ifrs-full',)))
        if tot:
            return tot
        lt = latest_instant(facts(cf, IFRS_LT_DEBT, u, ns=('ifrs-full',)))
        st_names = IFRS_ST_DEBT
    if not lt:
        return None
    total = lt[0]
    for name in st_names:
        v = instant_at(facts(cf, [name], u), lt[1])
        if v:
            total += v
            break
    return total, lt[1]


def shares_trend(cf: dict) -> Tuple[Optional[float], Optional[float], str]:
    rows = facts(cf, ['EntityCommonStockSharesOutstanding'], unit_pref=('shares',), ns=('dei',))
    if not rows:
        rows = facts(cf, SHARES_FALLBACK, unit_pref=('shares',), ns=NS)
    if not rows:
        return None, None, ''
    last = max(rows, key=lambda r: r['end'])
    target = _d(last['end']) - dt.timedelta(days=365)
    older = [r for r in rows if _d(r['end']) <= target + dt.timedelta(days=45)]
    chg = None
    if older:
        o = max(older, key=lambda r: r['end'])
        if float(o['val']):
            chg = float(last['val']) / float(o['val']) - 1
    return float(last['val']), chg, last['end']


def filing_dates(cf: dict) -> List[str]:
    """10-Q / 10-K (20-F / 40-F) filing dates (a proxy for past earnings releases, used by the backtest's earnings-gap
    note)."""
    cur = reporting_currency(cf)
    rows = facts(cf, EPS, (cur + '/shares',)) or facts(cf, NET_INCOME, (cur,))
    return sorted({r['filed'] for r in rows if r.get('filed')})


def period_kind(rows: List[dict], end: str) -> str:
    """"FY" when the value is a fiscal-year figure (an annual period ends there), else "TTM"."""
    return 'FY' if any(r.get('end') == end and r.get('start') and 350 <= _days(r) <= 380 for r in rows) else 'TTM'


def filer_form(rows: List[dict]) -> str:
    """The annual form of the newest annual filing (10-K / 20-F / 40-F), '' when unknown."""
    ann = [r for r in rows if r.get('form') in ANNUAL_FORMS]
    return max(ann, key=lambda r: r.get('filed', ''))['form'].split('/')[0] if ann else ''


# ---- the table ----------------------------------------------------------------------------------------------------
def base(cf: dict) -> Dict:
    """Price-independent fundamentals from companyfacts (what the cache keeps), in the reporting currency."""
    cur = reporting_currency(cf)
    money, per = (cur,), (cur + '/shares',)
    rev_rows, rev_ns, _ = pick(cf, REVENUE, money, ns=NS)
    eps_rows, eps_ns, _ = pick(cf, EPS, per, ns=NS)
    ni_rows, ni_ns, _ = pick(cf, NET_INCOME, money, ns=NS)
    rev, rev_g, rev_end = ttm_yoy(rev_rows)
    eps, eps_g, eps_end = ttm_yoy(eps_rows)
    ni, _, ni_end = ttm_yoy(ni_rows)
    ocf, _, ocf_end = ttm_yoy(facts(cf, OCF, money, ns=NS))
    capex, _, _ = ttm_yoy(facts(cf, CAPEX, money, ns=NS))
    eq = latest_instant(facts(cf, EQUITY, money, ns=NS))
    debt = total_debt(cf, cur)
    sh, sh_chg, sh_end = shares_trend(cf)
    spaces = {x for x in (rev_ns, eps_ns, ni_ns) if x}
    lead = (rev_rows, rev_end) if rev_end else (eps_rows, eps_end) if eps_end else (ni_rows, ni_end)
    return {
        'revenue_ttm': rev, 'revenue_yoy': rev_g, 'revenue_end': rev_end,
        'eps_ttm': eps, 'eps_yoy': eps_g, 'eps_end': eps_end,
        'net_margin': ni / rev if ni is not None and rev else None, 'net_income_end': ni_end,
        'ocf_ttm': ocf, 'fcf_ttm': ocf - capex if ocf is not None and capex is not None else None, 'cash_flow_end': ocf_end,
        'debt': debt[0] if debt else None, 'equity': eq[0] if eq else None,
        'debt_to_equity': debt[0] / eq[0] if debt and eq and eq[0] > 0 else None, 'balance_end': (debt or eq or (None, ''))[1],
        'shares': sh, 'shares_yoy': sh_chg, 'shares_end': sh_end,
        'filings': filing_dates(cf)[-16:],
        'currency': cur, 'source': 'SEC ifrs' if 'ifrs-full' in spaces else 'SEC us-gaap',
        'period': period_kind(lead[0], lead[1]) if lead[1] else '', 'form': filer_form(rev_rows or ni_rows or eps_rows),
        'cik': str(cf.get('cik') or ''), 'entity': str(cf.get('entityName') or ''),
    }


def compute(cf: Optional[dict], price: float, daily_highs: List[float], daily_lows: List[float]) -> Dict:
    """Fundamentals dict (raw numbers + period end dates). cf = raw companyfacts or a cached base().
    Missing values are None (shown as n/a). Money values are in `currency` (the reporting currency); price-based
    ratios follow the module doc (ADR ratio, USD EPS)."""
    out: Dict = {'context_only': True, 'source': 'SEC EDGAR XBRL companyfacts' if cf else None}
    last252_h, last252_l = (max(daily_highs[-252:]), min(daily_lows[-252:])) if daily_highs else (None, None)
    ath = max(daily_highs) if daily_highs else None
    out['range52_pos'] = (price - last252_l) / (last252_h - last252_l) if last252_h and last252_h > last252_l else None
    out['from_ath'] = price / ath - 1 if ath else None
    out['price'] = round(price, 2)
    if not cf:
        return {k: round(v, 4) if isinstance(v, float) else v for k, v in out.items()}
    b = base(cf) if 'facts' in cf else dict(cf)
    b.pop('filings', None)
    b.setdefault('currency', 'USD')
    b.setdefault('source', 'SEC us-gaap')
    out.update(b)
    eps, sh, cur = b.get('eps_ttm'), b.get('shares'), b['currency']
    ratio = adr_ratio(b.get('cik') or (cf.get('cik') if isinstance(cf, dict) else ''), b.get('form') or '')
    out['adr_ratio'] = ratio
    out['pe'], out['pe_note'] = None, ''
    if eps is not None and eps > 0:
        if cur != 'USD':
            out['pe_note'] = f'EPS in {cur}'
        elif ratio is None:
            out['pe_note'] = 'ADR ratio unknown'
        else:
            out['pe'] = price / (eps * ratio)
    out['market_cap'] = price * sh / ratio if sh and ratio else None
    return {k: (round(v, 4) if abs(v) < 1e4 else round(v)) if isinstance(v, float) else v for k, v in out.items()}


def _money(v: Optional[float], cur: str = 'USD') -> str:
    if v is None:
        return NA
    a = abs(v)
    s = f'{a / 1e12:.2f}T' if a >= 1e12 else f'{a / 1e9:.1f}B' if a >= 1e9 else f'{a / 1e6:.0f}M' if a >= 1e6 else f'{a:,.0f}'
    sym = SYMBOL.get(cur)
    return ('-' if v < 0 else '') + (sym + s if sym else f'{cur} {s}')


def _pct(v: Optional[float], sign=True) -> str:
    return NA if v is None else (f'{v * 100:+.0f}%' if sign else f'{v * 100:.0f}%')


def rows(f: Dict) -> List[Tuple[str, str]]:
    """(label, value) lines of the mini-table (Telegram and the app use the same lines). Labels stay fixed (the app's
    glossary keys on them); a fiscal-year figure says "FY" in its value, a non-USD one carries the currency code, and
    the last line names the source."""
    if not f:
        return []
    cur = f.get('currency') or 'USD'
    fy = 'FY ' if f.get('period') == 'FY' else ''
    def end(k): return f" ({fy}{f[k][:7]})" if f.get(k) else ''
    eps_s = f"{f['eps_ttm']:.2f}" + ('' if cur == 'USD' else f' {cur}') if f.get('eps_ttm') is not None else ''
    pe = f"{f['pe']:.1f}" if f.get('pe') else ('neg' if f.get('eps_ttm') is not None and f['eps_ttm'] <= 0
                                               else f"{NA} ({f['pe_note']})" if f.get('pe_note') else NA)
    out = [
        ('Revenue TTM', f"{_money(f.get('revenue_ttm'), cur)} {_pct(f.get('revenue_yoy'))} YoY{end('revenue_end')}" if f.get('revenue_ttm') is not None else NA),
        ('EPS TTM', f"{eps_s} {_pct(f.get('eps_yoy'))} YoY{end('eps_end')}" if f.get('eps_ttm') is not None else NA),
        ('Net margin', _pct(f.get('net_margin'), sign=False)),
        ('OCF / FCF', f"{_money(f.get('ocf_ttm'), cur)} / {_money(f.get('fcf_ttm'), cur)}{end('cash_flow_end')}" if f.get('ocf_ttm') is not None else NA),
        ('Debt / equity', f"{f['debt_to_equity']:.2f}{end('balance_end')}" if f.get('debt_to_equity') is not None else NA),
        ('Shares', f"{f['shares'] / 1e6:,.0f}M {_pct(f.get('shares_yoy'))} 1y{end('shares_end')}" if f.get('shares') else NA),
        ('P/E', pe),
        ('Market cap', _money(f.get('market_cap'))),
        ('52w range', f"{f['range52_pos'] * 100:.0f}% of range" if f.get('range52_pos') is not None else NA),
        ('From ATH', _pct(f.get('from_ath'))),
    ]
    src = f.get('source') if f.get('source') in ('SEC us-gaap', 'SEC ifrs', 'FMP') else ''
    if src and (src != 'SEC us-gaap' or cur != 'USD' or fy):
        out.append(('Source', ' · '.join(x for x in (src, cur, f.get('period') or '') if x)))
    return out
