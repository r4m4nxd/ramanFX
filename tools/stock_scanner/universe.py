"""Scan universe -> universe.csv (symbol, name, sector, cik, indexes). Committed as a cache; refreshed weekly.

Indexes (each can be switched off with env SCANNER_UNIVERSES, e.g. "SPX,NDX,DJI"; default all four):
  SPX  S&P 500       Wikipedia List_of_S%26P_500_companies (GICS sector, CIK)
  NDX  Nasdaq-100    Wikipedia List_of_NASDAQ-100_companies (the table moved off the "Nasdaq-100" article in July
                     2026; ICB industry mapped to the GICS sector names)
  DJI  Dow Jones 30  Wikipedia List_of_Dow_Jones_Industrial_Average_companies
  RUT  Russell 2000  iShares IWM holdings CSV (equity rows, "Sector" column); fallback the committed snapshot
                     russell2000_snapshot.csv (its first line records the snapshot date)
A ticker in several indexes is one row with e.g. indexes "SPX,NDX,DJI". CIKs missing from Wikipedia come from SEC
company_tickers.json (generic project User-Agent, see fundamentals.SEC_UA); missing stays empty (= fundamentals n/a).

    python tools/stock_scanner/universe.py            # refresh if older than 7 days
    python tools/stock_scanner/universe.py --force
"""
from __future__ import annotations

import csv
import datetime as dt
import html
import io
import json
import os
import sys
import time
from html.parser import HTMLParser
from typing import Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from data import UA, http_get  # noqa: E402

WIKI = 'https://en.wikipedia.org/wiki/'
SOURCES = {
    'SPX': WIKI + 'List_of_S%26P_500_companies',
    'NDX': WIKI + 'List_of_NASDAQ-100_companies',
    'DJI': WIKI + 'List_of_Dow_Jones_Industrial_Average_companies',
    'RUT': 'https://www.ishares.com/us/products/239710/ishares-russell-2000-etf/1467271812596.ajax?fileType=csv&fileName=IWM_holdings&dataType=fund',
}
INDEXES = ['SPX', 'NDX', 'DJI', 'RUT']
INDEX_NAME = {'SPX': 'S&P 500', 'NDX': 'Nasdaq-100', 'DJI': 'Dow 30', 'RUT': 'Russell 2000'}
MIN_ROWS = {'SPX': 400, 'NDX': 90, 'DJI': 28, 'RUT': 1500}
CSV_PATH = os.path.join(HERE, 'universe.csv')
RUT_SNAPSHOT = os.path.join(HERE, 'russell2000_snapshot.csv')
FIELDS = ['symbol', 'name', 'sector', 'cik', 'indexes']
SEC_TICKERS = 'https://www.sec.gov/files/company_tickers.json'

# ICB industry (Nasdaq-100 list) -> GICS sector name used everywhere else
ICB_TO_GICS = {'Technology': 'Information Technology', 'Telecommunications': 'Communication Services', 'Health Care': 'Health Care',
               'Financials': 'Financials', 'Real Estate': 'Real Estate', 'Consumer Discretionary': 'Consumer Discretionary',
               'Consumer Staples': 'Consumer Staples', 'Industrials': 'Industrials', 'Basic Materials': 'Materials',
               'Energy': 'Energy', 'Utilities': 'Utilities'}
GICS = ['Communication Services', 'Consumer Discretionary', 'Consumer Staples', 'Energy', 'Financials', 'Health Care',
        'Industrials', 'Information Technology', 'Materials', 'Real Estate', 'Utilities']


def enabled() -> List[str]:
    raw = os.environ.get('SCANNER_UNIVERSES', '')
    want = [x.strip().upper() for x in raw.split(',') if x.strip()] if raw else INDEXES
    return [x for x in INDEXES if x in want]


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
    """Rows of the first table with id="constituents" (all three Wikipedia lists use that id)."""

    def __init__(self):
        super().__init__()
        self.depth = 0
        self.rows: List[List[str]] = []
        self.cell: List[str] = []
        self.row: List[str] = []
        self.in_cell = False
        self.done = False

    def handle_starttag(self, tag, attrs):
        if self.done:
            return
        a = dict(attrs)
        if tag == 'table':
            if self.depth:
                self.depth += 1
            elif a.get('id') == 'constituents':
                self.depth = 1
        elif self.depth == 1 and tag == 'tr':
            self.row = []
        elif self.depth == 1 and tag in ('td', 'th'):
            self.in_cell, self.cell = True, []
        elif self.in_cell and tag in ('sup', 'style'):
            self.cell.append('\x00')                # footnote markers: cut the text there

    def handle_endtag(self, tag):
        if self.done or not self.depth:
            return
        if tag == 'table':
            self.depth -= 1
            if self.depth == 0:
                self.done = True
        elif self.depth == 1 and tag in ('td', 'th') and self.in_cell:
            self.row.append(' '.join(''.join(self.cell).split('\x00')[0].split()))
            self.in_cell = False
        elif self.depth == 1 and tag == 'tr' and self.row:
            self.rows.append(self.row)

    def handle_data(self, data):
        if self.in_cell:
            self.cell.append(data)


def _col(head: List[str], *names) -> int:
    for n in names:
        for i, h in enumerate(head):
            if n in h:
                return i
    return -1


def parse_wiki(page: str, index: str) -> List[Dict[str, str]]:
    p = _Tables()
    p.feed(page)
    if not p.rows:
        raise ValueError(f'{index}: constituents table not found')
    head = [h.lower() for h in p.rows[0]]
    i_sym = _col(head, 'symbol', 'ticker')
    i_name = _col(head, 'security', 'company')
    i_sec = _col(head, 'gics sector', 'icb industry', 'sector', 'industry')
    i_cik = _col(head, 'cik')
    if min(i_sym, i_name) < 0:
        raise ValueError(f'{index}: columns missing: {head}')
    out = []
    for r in p.rows[1:]:
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


def parse_ishares(text: str) -> List[Dict[str, str]]:
    """iShares holdings CSV: some preamble lines, then a header with Ticker,Name,Sector,Asset Class,...; equity rows only."""
    lines = text.splitlines()
    start = next((i for i, l in enumerate(lines) if l.startswith('Ticker,') or l.startswith('"Ticker"')), -1)
    if start < 0:
        raise ValueError('RUT: holdings header not found')
    out = []
    for r in csv.DictReader(io.StringIO('\n'.join(lines[start:]))):
        if (r.get('Asset Class') or '').strip().lower() != 'equity':
            continue
        sym = (r.get('Ticker') or '').strip().upper().replace(' ', '.')
        if not sym or sym == '-' or not sym.replace('.', '').isalnum():
            continue
        out.append({'symbol': sym, 'name': (r.get('Name') or '').strip().title(), 'sector': norm_sector(r.get('Sector') or ''), 'cik': '', 'indexes': 'RUT'})
    if len(out) < MIN_ROWS['RUT']:
        raise ValueError(f'RUT: only {len(out)} equity rows')
    return out


def load_rut_snapshot() -> List[Dict[str, str]]:
    if not os.path.exists(RUT_SNAPSHOT):
        return []
    with open(RUT_SNAPSHOT, newline='') as f:
        first = f.readline()
        if not first.startswith('#'):
            f.seek(0)
        return list(csv.DictReader(f))


def save_rut_snapshot(rows: List[Dict[str, str]]) -> None:
    with open(RUT_SNAPSHOT, 'w', newline='') as f:
        f.write(f'# iShares IWM holdings snapshot {dt.date.today().isoformat()}\n')
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)


def snapshot_date() -> str:
    if not os.path.exists(RUT_SNAPSHOT):
        return ''
    with open(RUT_SNAPSHOT) as f:
        first = f.readline().strip()
    return first.rsplit(' ', 1)[-1] if first.startswith('#') else ''


def merge(lists: List[List[Dict[str, str]]]) -> List[Dict[str, str]]:
    """Dedupe by symbol: the first list's name / sector / CIK win (SPX first), indexes are joined."""
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
            x['indexes'] = ','.join(sorted(idx, key=INDEXES.index))
            for k in ('name', 'sector', 'cik'):
                if not x.get(k) and r.get(k):
                    x[k] = r[k]
    return [by[k] for k in sorted(by)]


def fill_ciks(rows: List[Dict[str, str]], raw: Optional[bytes] = None) -> int:
    """CIKs from SEC company_tickers.json for rows without one. Returns how many were filled."""
    missing = [r for r in rows if not r.get('cik')]
    if not missing:
        return 0
    try:
        if raw is None:
            import fundamentals as F
            raw = http_get(SEC_TICKERS, ua=F.SEC_UA, accept='application/json')
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
        r.setdefault('indexes', 'SPX')
        r['indexes'] = r.get('indexes') or 'SPX'
    want = set(indexes if indexes is not None else enabled())
    return [r for r in rows if want & set(r['indexes'].split(','))]


def refresh(force: bool = False, max_age_days: float = 7, log=print) -> List[Dict[str, str]]:
    if not force and os.path.exists(CSV_PATH) and time.time() - os.path.getmtime(CSV_PATH) < max_age_days * 86400:
        return load()
    old = {}
    if os.path.exists(CSV_PATH):
        for r in load(indexes=INDEXES):
            for i in r['indexes'].split(','):
                old.setdefault(i, []).append(dict(r, indexes=i))
    lists = []
    for idx in INDEXES:
        try:
            if idx == 'RUT':
                try:
                    rows = parse_ishares(http_get(SOURCES[idx], ua=UA, accept='text/csv').decode('utf-8-sig', 'replace'))
                    save_rut_snapshot(rows)
                except Exception as e:  # noqa: BLE001
                    rows = load_rut_snapshot()
                    log(f'RUT: iShares unavailable ({type(e).__name__}); snapshot {snapshot_date() or "missing"} ({len(rows)} rows)')
            else:
                rows = parse_wiki(http_get(SOURCES[idx], ua=UA, accept='text/html').decode('utf-8', 'replace'), idx)
        except Exception as e:  # noqa: BLE001
            rows = old.get(idx, [])
            log(f'{idx}: refresh failed ({e}); kept the previous {len(rows)} rows')
        lists.append(rows)
        log(f'{idx}: {len(rows)} tickers')
    rows = merge(lists)
    n = fill_ciks(rows)
    log(f'CIK filled from SEC: {n}; still missing: {sum(1 for r in rows if not r["cik"])}')
    with open(CSV_PATH, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    return load()


if __name__ == '__main__':
    rows = refresh(force='--force' in sys.argv)
    print(f'{len(rows)} tickers ({",".join(enabled())}) -> {CSV_PATH}')
