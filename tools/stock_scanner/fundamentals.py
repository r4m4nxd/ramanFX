"""Compact fundamentals per ticker from SEC EDGAR XBRL companyfacts, plus price-derived ratios.

CONTEXT ONLY: none of these numbers is part of the supply & demand rules. A signal never depends on them.

SEC asks automated clients to identify themselves in the User-Agent. The default is a generic project string
("RamanFX-scanner/1.0"). If SEC answers 403, set env SEC_UA to "<project> <contact address>" (a contact SEC can
reach); it is read from the environment only and never written to any file or output.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import time
from typing import Dict, List, Optional, Tuple

from data import CACHE, host_open, http_get, looks_json, over_budget

SEC_UA = os.environ.get('SEC_UA') or 'RamanFX-scanner/1.0'
NA = 'n/a'
SEC_FACTS = 'https://data.sec.gov/api/xbrl/companyfacts'

REVENUE = ['Revenues', 'RevenueFromContractWithCustomerExcludingAssessedTax', 'RevenueFromContractWithCustomerIncludingAssessedTax',
           'SalesRevenueNet', 'SalesRevenueGoodsNet', 'RevenuesNetOfInterestExpense', 'InterestAndDividendIncomeOperating']
NET_INCOME = ['NetIncomeLoss', 'ProfitLoss', 'NetIncomeLossAvailableToCommonStockholdersBasic']
EPS = ['EarningsPerShareDiluted', 'EarningsPerShareBasicAndDiluted', 'EarningsPerShareBasic']
OCF = ['NetCashProvidedByUsedInOperatingActivities', 'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations']
CAPEX = ['PaymentsToAcquirePropertyPlantAndEquipment', 'PaymentsToAcquireProductiveAssets']
EQUITY = ['StockholdersEquity', 'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest']
LT_DEBT = ['LongTermDebt', 'LongTermDebtNoncurrent']
ST_DEBT = ['LongTermDebtCurrent', 'DebtCurrent', 'ShortTermBorrowings', 'CommercialPaper']


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


def fetch_base(cik: str, max_age_days: float = 7, offline: bool = False) -> Optional[Dict]:
    """Small cached fundamentals for one company, refreshed from SEC when older than max_age_days."""
    b, age = cached_base(cik)
    if not cik or offline or age < max_age_days:
        return b
    try:
        cf = fetch_companyfacts(cik)
    except Exception:  # noqa: BLE001 - keep the stale copy
        return b
    nb = base(cf) if cf else None
    if nb is not None:
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
        return fetch_base(c, max_age_days=0)
    with ThreadPoolExecutor(max_workers=max(1, workers)) as ex:
        n = sum(1 for b in ex.map(one, ciks) if b)
    if log:
        log(f'SEC: refreshed {n}/{len(ciks)} companies in {time.time() - t0:.0f}s ({skipped[0]} skipped: budget / breaker)')
    return n


# ---- fact helpers -----------------------------------------------------------------------------------------------
def _d(s: str) -> dt.date: return dt.date.fromisoformat(s)


def facts(cf: dict, names: List[str], unit_pref=('USD', 'USD/shares', 'shares'), ns=('us-gaap', 'dei')) -> List[dict]:
    """Facts of the first tag that has data, from 10-K / 10-Q filings, deduped per (start, end) keeping the latest filing."""
    best: List[dict] = []
    best_end = ''
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
                    if r.get('form') not in ('10-K', '10-Q', '10-K/A', '10-Q/A', '20-F', '40-F') or 'val' not in r or 'end' not in r:
                        continue
                    k = (r.get('start', ''), r['end'])
                    if k not in keep or r.get('filed', '') > keep[k].get('filed', ''):
                        keep[k] = r
                vals = sorted(keep.values(), key=lambda r: (r['end'], r.get('start', '')))
                # several tags carry the same concept: use the one with the newest data
                if vals and vals[-1]['end'] > best_end:
                    best, best_end = vals, vals[-1]['end']
                break
    return best


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


def total_debt(cf: dict) -> Optional[Tuple[float, str]]:
    lt = latest_instant(facts(cf, LT_DEBT))
    if not lt:
        return None
    total = lt[0]
    for name in ST_DEBT:
        v = instant_at(facts(cf, [name]), lt[1])
        if v:
            total += v
            break
    return total, lt[1]


def shares_trend(cf: dict) -> Tuple[Optional[float], Optional[float], str]:
    rows = facts(cf, ['EntityCommonStockSharesOutstanding'], unit_pref=('shares',), ns=('dei',))
    if not rows:
        rows = facts(cf, ['CommonStockSharesOutstanding', 'WeightedAverageNumberOfDilutedSharesOutstanding'], unit_pref=('shares',))
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
    """10-Q / 10-K filing dates (a proxy for past earnings releases, used by the backtest's earnings-gap note)."""
    rows = facts(cf, EPS) or facts(cf, NET_INCOME)
    return sorted({r['filed'] for r in rows if r.get('filed')})


# ---- the table ----------------------------------------------------------------------------------------------------
def base(cf: dict) -> Dict:
    """Price-independent fundamentals from companyfacts (what the cache keeps)."""
    rev, rev_g, rev_end = ttm_yoy(facts(cf, REVENUE))
    eps, eps_g, eps_end = ttm_yoy(facts(cf, EPS, unit_pref=('USD/shares',)))
    ni, _, ni_end = ttm_yoy(facts(cf, NET_INCOME))
    ocf, _, ocf_end = ttm_yoy(facts(cf, OCF))
    capex, _, _ = ttm_yoy(facts(cf, CAPEX))
    eq = latest_instant(facts(cf, EQUITY))
    debt = total_debt(cf)
    sh, sh_chg, sh_end = shares_trend(cf)
    return {
        'revenue_ttm': rev, 'revenue_yoy': rev_g, 'revenue_end': rev_end,
        'eps_ttm': eps, 'eps_yoy': eps_g, 'eps_end': eps_end,
        'net_margin': ni / rev if ni is not None and rev else None, 'net_income_end': ni_end,
        'ocf_ttm': ocf, 'fcf_ttm': ocf - capex if ocf is not None and capex is not None else None, 'cash_flow_end': ocf_end,
        'debt': debt[0] if debt else None, 'equity': eq[0] if eq else None,
        'debt_to_equity': debt[0] / eq[0] if debt and eq and eq[0] > 0 else None, 'balance_end': (debt or eq or (None, ''))[1],
        'shares': sh, 'shares_yoy': sh_chg, 'shares_end': sh_end,
        'filings': filing_dates(cf)[-16:],
    }


def compute(cf: Optional[dict], price: float, daily_highs: List[float], daily_lows: List[float]) -> Dict:
    """Fundamentals dict (raw numbers + period end dates). cf = raw companyfacts or a cached base().
    Missing values are None (shown as n/a)."""
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
    out.update(b)
    eps, sh = b.get('eps_ttm'), b.get('shares')
    out['pe'] = price / eps if eps and eps > 0 else None
    out['market_cap'] = price * sh if sh else None
    return {k: (round(v, 4) if abs(v) < 1e4 else round(v)) if isinstance(v, float) else v for k, v in out.items()}


def _money(v: Optional[float]) -> str:
    if v is None:
        return NA
    a = abs(v)
    s = f'{a / 1e12:.2f}T' if a >= 1e12 else f'{a / 1e9:.1f}B' if a >= 1e9 else f'{a / 1e6:.0f}M' if a >= 1e6 else f'{a:,.0f}'
    return ('-' if v < 0 else '') + '$' + s


def _pct(v: Optional[float], sign=True) -> str:
    return NA if v is None else (f'{v * 100:+.0f}%' if sign else f'{v * 100:.0f}%')


def rows(f: Dict) -> List[Tuple[str, str]]:
    """(label, value) lines of the mini-table (Telegram and the app use the same lines)."""
    if not f:
        return []
    def end(k): return f" ({f[k][:7]})" if f.get(k) else ''
    return [
        ('Revenue TTM', f"{_money(f.get('revenue_ttm'))} {_pct(f.get('revenue_yoy'))} YoY{end('revenue_end')}" if f.get('revenue_ttm') is not None else NA),
        ('EPS TTM', f"{f['eps_ttm']:.2f} {_pct(f.get('eps_yoy'))} YoY{end('eps_end')}" if f.get('eps_ttm') is not None else NA),
        ('Net margin', _pct(f.get('net_margin'), sign=False)),
        ('OCF / FCF', f"{_money(f.get('ocf_ttm'))} / {_money(f.get('fcf_ttm'))}{end('cash_flow_end')}" if f.get('ocf_ttm') is not None else NA),
        ('Debt / equity', f"{f['debt_to_equity']:.2f}{end('balance_end')}" if f.get('debt_to_equity') is not None else NA),
        ('Shares', f"{f['shares'] / 1e6:,.0f}M {_pct(f.get('shares_yoy'))} 1y{end('shares_end')}" if f.get('shares') else NA),
        ('P/E', f"{f['pe']:.1f}" if f.get('pe') else (('neg' if f.get('eps_ttm') is not None and f['eps_ttm'] <= 0 else NA))),
        ('Market cap', _money(f.get('market_cap'))),
        ('52w range', f"{f['range52_pos'] * 100:.0f}% of range" if f.get('range52_pos') is not None else NA),
        ('From ATH', _pct(f.get('from_ath'))),
    ]
