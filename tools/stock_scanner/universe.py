"""Scan universe -> universe.csv (symbol, name, sector, cik, indexes, home, currency, feed). Committed as a cache;
refreshed weekly.

Indexes (INDEX_META is the one registry: label, short label, country, source; switch some off with env
SCANNER_UNIVERSES, e.g. "SPX,NDX,DJI"; default all):
  SPX    S&P 500        Wikipedia List_of_S%26P_500_companies (GICS sector, CIK)
  NDX    Nasdaq-100     Wikipedia List_of_NASDAQ-100_companies (ICB industry mapped to the GICS sector names)
  DJI    Dow 30         Wikipedia List_of_Dow_Jones_Industrial_Average_companies
  TSX60  S&P/TSX 60     Wikipedia S%26P/TSX_60 (constituents table)
  TSX    S&P/TSX Comp.  Wikipedia S%26P/TSX_Composite_Index ("components" table)
A ticker in several indexes is one row with e.g. indexes "SPX,NDX,DJI".

Canada (interlisted first): a TSX name is scanned through its NYSE / Nasdaq / NYSE American listing (prices in USD,
`home` = "TSX:RY", currency USD). The mapping: tsx_us_map.csv (hand-checked by company name, wins), else the same
symbol when Alpaca's asset list has it active on a US exchange AND its company name matches; without Alpaca keys the
previous refresh's checked mapping is kept. Names without a US listing get symbol "<SYM>.TO", currency CAD and
feed "tsx": they need a TSX data feed (data.tsx_feed(); off by default) and are reported as uncovered until then.

CIKs missing from Wikipedia come from SEC company_tickers.json, only when env SEC_UA (a contact User-Agent; SEC
answers 403 without one) is set; otherwise those CIKs stay empty (= fundamentals n/a).

    python tools/stock_scanner/universe.py            # refresh if older than 7 days
    python tools/stock_scanner/universe.py --force
"""
from __future__ import annotations

import csv
import html
import json
import os
import re
import sys
import time
import unicodedata
from html.parser import HTMLParser
from typing import Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from data import UA, http_get  # noqa: E402

WIKI = 'https://en.wikipedia.org/wiki/'
# The registry: order = the app's index pills. country: where the index lives (the scanned listing may be US).
INDEX_META: Dict[str, Dict[str, str]] = {
    'SPX': {'label': 'S&P 500', 'short': 'S&P', 'country': 'US', 'url': WIKI + 'List_of_S%26P_500_companies'},
    'NDX': {'label': 'Nasdaq-100', 'short': 'NDX', 'country': 'US', 'url': WIKI + 'List_of_NASDAQ-100_companies'},
    'DJI': {'label': 'Dow 30', 'short': 'Dow', 'country': 'US', 'url': WIKI + 'List_of_Dow_Jones_Industrial_Average_companies'},
    'TSX60': {'label': 'TSX 60', 'short': 'TSX60', 'country': 'CA', 'url': WIKI + 'S%26P/TSX_60'},
    'TSX': {'label': 'TSX Composite', 'short': 'TSX', 'country': 'CA', 'url': WIKI + 'S%26P/TSX_Composite_Index'},
}
INDEXES = list(INDEX_META)
SOURCES = {k: v['url'] for k, v in INDEX_META.items()}
MIN_ROWS = {'SPX': 400, 'NDX': 90, 'DJI': 28, 'TSX60': 55, 'TSX': 180}
TABLE_IDS = ('constituents', 'components')
CSV_PATH = os.path.join(HERE, 'universe.csv')
MAP_PATH = os.path.join(HERE, 'tsx_us_map.csv')
FIELDS = ['symbol', 'name', 'sector', 'cik', 'indexes', 'home', 'currency', 'feed']
SEC_TICKERS = 'https://www.sec.gov/files/company_tickers.json'
US_EXCHANGES = {'NYSE', 'NASDAQ', 'AMEX', 'ARCA', 'BATS'}
NAME_MATCH = 0.6

# ICB industry (Nasdaq-100, TSX 60 lists) -> GICS sector name used everywhere else
ICB_TO_GICS = {'Technology': 'Information Technology', 'Telecommunications': 'Communication Services', 'Health Care': 'Health Care',
               'Financials': 'Financials', 'Real Estate': 'Real Estate', 'Consumer Discretionary': 'Consumer Discretionary',
               'Consumer Staples': 'Consumer Staples', 'Industrials': 'Industrials', 'Basic Materials': 'Materials',
               'Energy': 'Energy', 'Utilities': 'Utilities', 'Communication Services': 'Communication Services',
               'Information Technology': 'Information Technology', 'Materials': 'Materials',
               # Morningstar-style names (the TSX 60 article)
               'Consumer Cyclical': 'Consumer Discretionary', 'Consumer Defensive': 'Consumer Staples',
               'Financial Services': 'Financials', 'Healthcare': 'Health Care', 'Communication': 'Communication Services'}
GICS = ['Communication Services', 'Consumer Discretionary', 'Consumer Staples', 'Energy', 'Financials', 'Health Care',
        'Industrials', 'Information Technology', 'Materials', 'Real Estate', 'Utilities']


def enabled() -> List[str]:
    raw = os.environ.get('SCANNER_UNIVERSES', '')
    want = [x.strip().upper() for x in raw.split(',') if x.strip()] if raw else INDEXES
    return [x for x in INDEXES if x in want]


def index_meta(codes: Optional[List[str]] = None) -> List[Dict[str, str]]:
    """[{code, label, short, country}] in pill order (what the app shows; nothing hard-coded there)."""
    return [{'code': k, 'label': v['label'], 'short': v['short'], 'country': v['country']}
            for k, v in INDEX_META.items() if codes is None or k in codes]


def norm_sector(s: str) -> str:
    s = (s or '').strip()
    if s in GICS:
        return s
    if s in ICB_TO_GICS:
        return ICB_TO_GICS[s]
    low = s.lower()
    for g in GICS:
        if g.lower() == low:
            return g
    return {'information technology': 'Information Technology', 'communication': 'Communication Services'}.get(low, s or 'Other')


class _Tables(HTMLParser):
    """Every top-level table of the page: (attrs, rows of cell texts). Footnote markers are cut off."""

    def __init__(self):
        super().__init__()
        self.depth = 0
        self.tables: List[Tuple[Dict[str, str], List[List[str]]]] = []
        self.cell: Optional[List[str]] = None
        self.row: List[str] = []

    def handle_starttag(self, tag, attrs):
        if tag == 'table':
            self.depth += 1
            if self.depth == 1:
                self.tables.append((dict((k, v or '') for k, v in attrs), []))
        elif self.depth == 1 and tag == 'tr':
            self.row = []
        elif self.depth == 1 and tag in ('td', 'th'):
            self.cell = []
        elif self.cell is not None and tag in ('sup', 'style'):
            self.cell.append('\x00')                # footnote markers: cut the text there

    def handle_endtag(self, tag):
        if tag == 'table' and self.depth:
            self.depth -= 1
        elif self.depth == 1 and tag in ('td', 'th') and self.cell is not None:
            self.row.append(' '.join(''.join(self.cell).split('\x00')[0].split()))
            self.cell = None
        elif self.depth == 1 and tag == 'tr' and self.row:
            self.tables[-1][1].append(self.row)
            self.row = []

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)


def _col(head: List[str], *names) -> int:
    for n in names:
        for i, h in enumerate(head):
            if n in h:
                return i
    return -1


def _pick_table(tables, index: str) -> List[List[str]]:
    """The table with id constituents / components, else the first table with a symbol and a company column and
    enough rows (the TSX 60 article's table has no id)."""
    for a, rows in tables:
        if a.get('id') in TABLE_IDS and rows:
            return rows
    for _, rows in tables:
        if len(rows) > MIN_ROWS[index]:
            head = [h.lower() for h in rows[0]]
            if min(_col(head, 'symbol', 'ticker'), _col(head, 'security', 'company')) >= 0:
                return rows
    return []


def parse_wiki(page: str, index: str) -> List[Dict[str, str]]:
    p = _Tables()
    p.feed(page)
    rows = _pick_table(p.tables, index)
    if not rows:
        raise ValueError(f'{index}: constituents table not found')
    head = [h.lower() for h in rows[0]]
    i_sym = _col(head, 'symbol', 'ticker')
    i_name = _col(head, 'security', 'company')
    i_sec = _col(head, 'gics sector', 'icb industry', 'sector', 'industry')
    i_cik = _col(head, 'cik')
    if min(i_sym, i_name) < 0:
        raise ValueError(f'{index}: columns missing: {head}')
    out = []
    for r in rows[1:]:
        if len(r) <= max(i_sym, i_name, i_sec):
            continue
        sym = html.unescape(r[i_sym]).strip().upper().replace(' ', '')
        if not sym or not sym.replace('.', '').replace('-', '').isalnum():
            continue
        cik = ''.join(ch for ch in r[i_cik] if ch.isdigit()) if i_cik >= 0 and i_cik < len(r) else ''
        out.append({'symbol': sym, 'name': html.unescape(r[i_name]).strip(), 'sector': norm_sector(r[i_sec]) if i_sec >= 0 else '',
                    'cik': cik.zfill(10) if cik else '', 'indexes': index})
    if len(out) < MIN_ROWS[index]:
        raise ValueError(f'{index}: only {len(out)} rows parsed')
    return out


# ---- TSX -> US listing ---------------------------------------------------------------------------------------------
_STOP = {'inc', 'corp', 'corporation', 'ltd', 'limited', 'company', 'co', 'the', 'plc', 'lp', 'l', 'p', 'of', 'and', 'sa',
         'nv', 'common', 'stock', 'shares', 'share', 'class', 'a', 'b', 'subordinate', 'voting', 'ordinary', 'units', 'unit',
         'new', 'ads', 'adr', 'depositary', 'non', 'variable', 'restricted', 'partnership', 'partners', 'trust', 'holdings'}


def name_tokens(s: str) -> set:
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower().replace('&', ' and ')
    return {t for t in re.split(r'[^a-z0-9]+', s) if t and t not in _STOP}


def name_match(tsx_name: str, us_name: str) -> float:
    """Share of the TSX company's significant name words found in the US asset's name (1.0 = all)."""
    a, b = name_tokens(tsx_name), name_tokens(us_name)
    return len(a & b) / len(a) if a else 0.0


def tsx_feed_symbol(tsx: str) -> str:
    """The symbol a TSX feed uses (Yahoo / EODHD style): BBD.B -> BBD-B.TO, AP.UN -> AP-UN.TO, RY -> RY.TO."""
    return tsx.replace('.', '-') + '.TO'


def load_map(path: str = MAP_PATH) -> Dict[str, Dict[str, str]]:
    """{tsx: {us, note, name}} from the hand-checked map (comment lines start with #)."""
    if not os.path.exists(path):
        return {}
    with open(path, newline='', encoding='utf-8') as f:
        lines = [l for l in f if l.strip() and not l.startswith('#')]
    return {r['tsx'].strip().upper(): {'us': (r.get('us') or '').strip().upper(), 'note': (r.get('note') or '').strip(),
                                        'name': (r.get('name') or '').strip()} for r in csv.DictReader(lines) if r.get('tsx')}


def map_tsx(rows: List[Dict[str, str]], overrides: Dict[str, Dict[str, str]], assets: Optional[Dict[str, Dict]],
            previous: Optional[Dict[str, str]] = None, log=print) -> List[Dict[str, str]]:
    """TSX index rows -> universe rows: the US listing when checked (see the module doc), else the TSX-feed row.
    assets = data.alpaca_assets() ({symbol: {name, exchange, status, tradable}}) or None when unavailable;
    previous = {tsx: us} of the last refresh (used only without assets)."""
    out = []
    for r in rows:
        tsx = r['symbol']
        ov = overrides.get(tsx)
        name = (ov or {}).get('name') or r['name']
        us, why = '', ''
        if ov is not None:
            us = ov['us']
            if us and assets is not None:
                a = assets.get(us)
                if not a or a.get('status') != 'active' or a.get('exchange') not in US_EXCHANGES:
                    why, us = f'override {us} not an active US-exchange asset', ''
                elif name_match(name, a.get('name', '')) < NAME_MATCH:
                    log(f'TSX {tsx} -> {us}: name check low ({name!r} vs {a.get("name")!r}); kept (hand-checked map)')
        elif assets is not None:
            a = assets.get(tsx) if '.' not in tsx else None
            if a and a.get('status') == 'active' and a.get('exchange') in US_EXCHANGES and name_match(name, a.get('name', '')) >= NAME_MATCH:
                us = tsx
            elif a:
                why = f'same symbol {tsx} on {a.get("exchange")} is {a.get("name")!r}: not the same company'
        elif previous and previous.get(tsx):
            us = previous[tsx]
        if why:
            log(f'TSX {tsx} ({name}): {why}')
        base = {'name': name, 'sector': r.get('sector', ''), 'cik': '', 'indexes': r['indexes'], 'home': f'TSX:{tsx}'}
        if us:
            out.append({'symbol': us, **base, 'currency': 'USD', 'feed': ''})
        else:
            out.append({'symbol': tsx_feed_symbol(tsx), **base, 'currency': 'CAD', 'feed': 'tsx'})
    return out


def coverage(rows: List[Dict[str, str]], feeds_on: Tuple[str, ...] = ()) -> Dict[str, Dict[str, int]]:
    """{index: {covered, total}} for the Canadian indexes (covered = a feed that is on serves it)."""
    out: Dict[str, Dict[str, int]] = {}
    for r in rows:
        for i in (r.get('indexes') or '').split(','):
            if INDEX_META.get(i, {}).get('country') != 'CA':
                continue
            c = out.setdefault(i, {'covered': 0, 'total': 0})
            c['total'] += 1
            c['covered'] += 1 if not r.get('feed') or r['feed'] in feeds_on else 0
    return out


def split_covered(rows: List[Dict[str, str]], feeds_on: Tuple[str, ...] = ()) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
    """(rows the scan can fetch, rows that need a feed that is off)."""
    ok = [r for r in rows if not r.get('feed') or r['feed'] in feeds_on]
    return ok, [r for r in rows if r.get('feed') and r['feed'] not in feeds_on]


def merge(lists: List[List[Dict[str, str]]]) -> List[Dict[str, str]]:
    """Dedupe by symbol: the first list's name / sector / CIK win (SPX first), indexes are joined, an empty home /
    currency / feed is filled from a later row."""
    by: Dict[str, Dict[str, str]] = {}
    for rows in lists:
        for r in rows:
            s = r['symbol']
            if s not in by:
                by[s] = dict(r)
                continue
            x = by[s]
            idx = x['indexes'].split(',')
            for i in r['indexes'].split(','):
                if i not in idx:
                    idx.append(i)
            x['indexes'] = ','.join(sorted(idx, key=lambda i: INDEXES.index(i) if i in INDEXES else 99))
            for k in ('name', 'sector', 'cik', 'home', 'currency', 'feed'):
                if not x.get(k) and r.get(k):
                    x[k] = r[k]
    return [by[k] for k in sorted(by)]


def fill_ciks(rows: List[Dict[str, str]], raw: Optional[bytes] = None) -> int:
    """CIKs from SEC company_tickers.json for rows without one (US listings only). Returns how many were filled."""
    missing = [r for r in rows if not r.get('cik') and r.get('feed', '') == '']
    if not missing:
        return 0
    if raw is None and not os.environ.get('SEC_UA', '').strip():
        print(f'SEC company_tickers.json skipped: set env SEC_UA ("<project> <contact>") to fill {len(missing)} '
              'missing CIKs (fundamentals n/a for them until then)', file=sys.stderr)
        return 0
    try:
        if raw is None:
            raw = http_get(SEC_TICKERS, ua=os.environ['SEC_UA'].strip(), accept='application/json')
        js = json.loads(raw)
        m = {str(v['ticker']).upper(): str(v['cik_str']).zfill(10) for v in js.values()}
    except Exception as e:  # noqa: BLE001
        print(f'SEC company_tickers.json unavailable ({type(e).__name__}): CIK n/a for {len(missing)} tickers', file=sys.stderr)
        return 0
    n = 0
    for r in missing:
        c = m.get(r['symbol']) or m.get(r['symbol'].replace('.', '-'))
        if c:
            r['cik'] = c
            n += 1
    return n


def load(path: str = CSV_PATH, indexes: Optional[List[str]] = None) -> List[Dict[str, str]]:
    with open(path, newline='') as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        r['indexes'] = r.get('indexes') or 'SPX'
        for k in ('home', 'feed'):
            r[k] = r.get(k) or ''
        r['currency'] = r.get('currency') or 'USD'
    want = set(indexes if indexes is not None else enabled())
    return [r for r in rows if want & set(r['indexes'].split(','))]


def _previous_tsx(rows: List[Dict[str, str]]) -> Dict[str, str]:
    return {r['home'][4:]: r['symbol'] for r in rows if r.get('home', '').startswith('TSX:') and not r.get('feed')}


def refresh(force: bool = False, max_age_days: float = 7, log=print, assets=None) -> List[Dict[str, str]]:
    if not force and os.path.exists(CSV_PATH) and time.time() - os.path.getmtime(CSV_PATH) < max_age_days * 86400:
        return load()
    old: Dict[str, List[Dict[str, str]]] = {}
    prev_rows: List[Dict[str, str]] = []
    if os.path.exists(CSV_PATH):
        prev_rows = load(indexes=INDEXES)
        for r in prev_rows:
            for i in r['indexes'].split(','):
                old.setdefault(i, []).append(dict(r, indexes=i))
    if assets is None and any(INDEX_META[i]['country'] == 'CA' for i in INDEXES):
        import data as DATA
        assets = DATA.alpaca_assets(log=log) or None
        if assets is None:
            log('TSX: Alpaca asset list unavailable (no keys?): hand-checked map + the previous checked mapping only')
    overrides = load_map()
    lists = []
    for idx in INDEXES:
        try:
            rows = parse_wiki(http_get(SOURCES[idx], ua=UA, accept='text/html').decode('utf-8', 'replace'), idx)
            if INDEX_META[idx]['country'] == 'CA':
                rows = map_tsx(rows, overrides, assets, _previous_tsx(prev_rows), log=log)
        except Exception as e:  # noqa: BLE001
            rows = old.get(idx, [])
            log(f'{idx}: refresh failed ({e}); kept the previous {len(rows)} rows')
        lists.append(rows)
        n_us = sum(1 for r in rows if not r.get('feed'))
        log(f'{idx}: {len(rows)} tickers' + (f' ({n_us} with a US listing)' if INDEX_META[idx]['country'] == 'CA' else ''))
    rows = merge(lists)
    n = fill_ciks(rows)
    log(f'CIK filled from SEC: {n}; still missing: {sum(1 for r in rows if not r["cik"] and not r.get("feed"))}')
    with open(CSV_PATH, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    return load()


if __name__ == '__main__':
    rows = refresh(force='--force' in sys.argv)
    print(f'{len(rows)} tickers ({",".join(enabled())}) -> {CSV_PATH}')
