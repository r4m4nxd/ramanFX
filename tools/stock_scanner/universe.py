"""Scan universe -> universe.csv (symbol, name, sector, cik, indexes, home, currency, feed). Committed as a cache;
refreshed weekly.

Indexes (INDEX_META is the one registry: label, short label, country, source; switch some off with env
SCANNER_UNIVERSES, e.g. "SPX,NDX,DJI"; default all):
  SPX    S&P 500        Wikipedia List_of_S%26P_500_companies (GICS sector, CIK)
  NDX    Nasdaq-100     Wikipedia List_of_NASDAQ-100_companies (ICB industry mapped to the GICS sector names)
  DJI    Dow 30         Wikipedia List_of_Dow_Jones_Industrial_Average_companies
  TSX60  S&P/TSX 60     Wikipedia S%26P/TSX_60 (constituents table)
  TSX    S&P/TSX Comp.  Wikipedia S%26P/TSX_Composite_Index ("components" table)
  ADR    Global leaders adr_list.csv: curated foreign large caps on NYSE / Nasdaq, each checked against Alpaca's asset
                        list at refresh (active, tradable, exchange NYSE / NASDAQ / ARCA / AMEX; OTC and inactive are
                        dropped). Without Alpaca keys the previous refresh's checked rows are kept.
  TOP    US top liquid  top_liquid.csv: every active, tradable Alpaca US equity on NYSE / Nasdaq that looks like a
                        common stock or ADR (see is_common: ETFs / ETNs / funds / warrants / rights / units / preferreds /
                        notes / SPACs are dropped by symbol shape + name), ranked by the 20-day median dollar volume
                        (close x volume) of one month of daily bars (Alpaca multi-symbol bars, 200 symbols a request);
                        kept when >= SCANNER_TOP_MIN_DV (default 50e6 USD/day) and not in any other universe, at most
                        SCANNER_TOP_MAX (default 300). Rebuilt on the weekly refresh (needs Alpaca keys; otherwise the
                        committed top_liquid.csv is kept); the daily scan only reads universe.csv. Sector from the SEC
                        SIC code (submissions API, needs SEC_UA; "Other" without it).
A ticker in several indexes is one row with e.g. indexes "SPX,NDX,DJI" (an ADR in the Nasdaq-100: "NDX,ADR").
`country` = issuer country for the ADR rows (ISO code), empty otherwise.

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
    'ADR': {'label': 'Global leaders (US-listed ADRs)', 'short': 'ADR', 'country': 'INTL', 'url': ''},
    'TOP': {'label': 'US top liquid', 'short': 'TOP', 'country': 'US', 'url': ''},
}
CURATED = ('ADR', 'TOP')                 # built from committed CSVs, not Wikipedia
INDEXES = list(INDEX_META)
SOURCES = {k: v['url'] for k, v in INDEX_META.items()}
MIN_ROWS = {'SPX': 400, 'NDX': 90, 'DJI': 28, 'TSX60': 55, 'TSX': 180}
TABLE_IDS = ('constituents', 'components')
CSV_PATH = os.path.join(HERE, 'universe.csv')
MAP_PATH = os.path.join(HERE, 'tsx_us_map.csv')
FIELDS = ['symbol', 'name', 'sector', 'cik', 'indexes', 'home', 'currency', 'feed', 'country']
ADR_PATH = os.path.join(HERE, 'adr_list.csv')
TOP_PATH = os.path.join(HERE, 'top_liquid.csv')
TOP_FIELDS = ['symbol', 'name', 'sector', 'cik', 'exchange', 'dv20_musd']
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
                                        'name': (r.get('name') or '').strip(), 'cik': _cik(r.get('cik'))}
            for r in csv.DictReader(lines) if r.get('tsx')}


def _cik(v) -> str:
    d = ''.join(ch for ch in str(v or '') if ch.isdigit())
    return d.zfill(10) if d else ''


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
            base['cik'] = (ov or {}).get('cik', '') if (ov or {}).get('us') == us else ''
            out.append({'symbol': us, **base, 'currency': 'USD', 'feed': ''})
        else:
            out.append({'symbol': tsx_feed_symbol(tsx), **base, 'currency': 'CAD', 'feed': 'tsx'})
    return out


# ---- ADR: curated foreign large caps, checked against Alpaca ------------------------------------------------------
ADR_EXCHANGES = {'NYSE', 'NASDAQ', 'ARCA', 'AMEX'}


def load_adr_list(path: str = ADR_PATH) -> List[Dict[str, str]]:
    """The curated list: [{symbol, name, country, sector, cik, adr_ratio}] (comment lines start with #)."""
    if not os.path.exists(path):
        return []
    with open(path, newline='', encoding='utf-8') as f:
        lines = [l for l in f if l.strip() and not l.startswith('#')]
    return [{k: (v or '').strip() for k, v in r.items()} for r in csv.DictReader(lines) if (r.get('symbol') or '').strip()]


def tradable_us(a: Optional[Dict], exchanges=ADR_EXCHANGES) -> bool:
    return bool(a) and a.get('status') == 'active' and a.get('tradable', True) is not False and a.get('exchange') in exchanges


def build_adr(curated: List[Dict[str, str]], assets: Optional[Dict[str, Dict]], previous: Optional[List[Dict[str, str]]] = None,
              log=print) -> List[Dict[str, str]]:
    """Universe rows of the curated ADRs that Alpaca lists as active + tradable on NYSE / Nasdaq / ARCA / AMEX (OTC,
    inactive and unknown symbols are dropped and logged). assets None (no keys): the previous refresh's checked rows,
    or the curated list unchecked when there is no previous refresh."""
    def row(c):
        return {'symbol': c['symbol'].upper(), 'name': c['name'], 'sector': norm_sector(c.get('sector', '')), 'cik': _cik(c.get('cik')),
                'indexes': 'ADR', 'home': '', 'currency': 'USD', 'feed': '', 'country': c.get('country', '').upper()}
    if assets is None:
        if previous:
            return [dict(r, indexes='ADR') for r in previous]
        log('ADR: no Alpaca asset list and no previous refresh: curated list used unchecked')
        return [row(c) for c in curated]
    out, dropped = [], []
    for c in curated:
        a = assets.get(c['symbol'].upper())
        if tradable_us(a):
            out.append(row(c))
        else:
            dropped.append(f"{c['symbol']} ({(a or {}).get('exchange') or 'unknown'}"
                           f"{'' if not a or a.get('status') == 'active' else ', ' + str(a.get('status'))})")
    if dropped:
        log(f'ADR: dropped {len(dropped)} not active / tradable on a US exchange: {", ".join(dropped)}')
    return out


# ---- TOP: the most liquid other US common stocks / ADRs -----------------------------------------------------------
TOP_EXCHANGES = {'NYSE', 'NASDAQ'}
TOP_MIN_DV = float(os.environ.get('SCANNER_TOP_MIN_DV', '50e6'))
TOP_MAX = int(os.environ.get('SCANNER_TOP_MAX', '300'))
TOP_BATCH = int(os.environ.get('SCANNER_TOP_BATCH', '200'))           # 200 symbols x ~22 bars: one page per request
TOP_BUDGET_S = float(os.environ.get('SCANNER_TOP_BUDGET_S', '420'))   # bars download; unfinished -> keep the old CSV
TOP_SIC_MAX = int(os.environ.get('SCANNER_TOP_SIC_MAX', '400'))       # SEC submissions lookups per refresh
SEC_SUBMISSIONS = 'https://data.sec.gov/submissions/CIK{}.json'
_SYM_OK = re.compile(r'^[A-Z]{1,5}(\.[A-Z])?$')
_NOT_COMMON = re.compile(
    r'\b(etf|etn|etp|fund|funds|warrants?|rights?|preferred|pfd|notes?|debentures?|bonds?|index|leveraged|inverse|'
    r'2x|3x|exchange traded|closed[- ]end|acquisition (corp|corporation|co|company|limited|ltd|inc))\b'
    r'|%|(?<!common )\bunits?\b'
    r'|^(ishares|spdr|proshares|direxion|vaneck|wisdomtree|global x|graniteshares|grayscale|first trust|vanguard|xtrackers|'
    r'roundhill|yieldmax|defiance|microsectors|tidal|t-rex|leverage shares|amplify|simplify|pacer|invesco (qqq|db)|ark |tuttle)',
    re.I)
_TRUST_PRODUCT = re.compile(r'\btrust\b.*\b(series|bitcoin|ether|ethereum|gold|silver|crypto)\b|\b(bitcoin|ethereum|gold|silver) trust\b', re.I)
_NAME_TAIL = re.compile(r'[\s,]+(class [a-z]\s+)?(common stock|ordinary shares|common shares|american depositary shares?|'
                        r'american depository shares?|sponsored adr|adrs?|ads|subordinate voting shares|common units).*$', re.I)


def is_common(symbol: str, name: str) -> bool:
    """A common stock / ADR by Alpaca symbol + name (Alpaca's asset list has no security-type field): plain 1-5
    letter symbols with an optional class letter (BRK.B; not .U / .W / .R units, warrants, rights), and no fund /
    ETF / ETN / warrant / right / unit / preferred / note / SPAC wording, no ETF issuer brand, no '%' (preferreds,
    notes), no product trust (bitcoin / gold / '... Trust, Series 1'); a preferred-style "Depositary Shares" is out,
    an "American Depositary Shares" ADR is in."""
    s, n = (symbol or '').upper(), (name or '').strip()
    if not _SYM_OK.match(s) or s[-2:] in ('.U', '.W', '.R'):
        return False
    low = n.lower()
    if _NOT_COMMON.search(n) or _TRUST_PRODUCT.search(n):
        return False
    if 'depositary' in low and 'american depositary' not in low and 'american depository' not in low:
        return False
    return True


def clean_name(name: str) -> str:
    """'Palantir Technologies Inc. Class A Common Stock' -> 'Palantir Technologies Inc.'"""
    return _NAME_TAIL.sub('', (name or '').strip()).strip(' ,-') or (name or '').strip()


def top_candidates(assets: Dict[str, Dict], exclude: set) -> List[str]:
    return sorted(s for s, a in assets.items()
                  if s not in exclude and tradable_us(a, TOP_EXCHANGES) and is_common(s, a.get('name', '')))


def median_dv(bars, n: int = 20, min_bars: int = 15) -> Optional[float]:
    """Median close x volume of the last n daily bars (None with fewer than min_bars: too new / too thin)."""
    last = bars[-n:]
    if len(last) < min_bars:
        return None
    v = sorted(b.c * b.v for b in last)
    m = len(v) // 2
    return v[m] if len(v) % 2 else (v[m - 1] + v[m]) / 2


def rank_top(dv: Dict[str, float], exclude: set, min_dv: float = TOP_MIN_DV, cap: int = TOP_MAX) -> List[Tuple[str, float]]:
    """[(symbol, dv)] highest first, >= min_dv, not excluded, at most cap."""
    ok = sorted(((s, d) for s, d in dv.items() if d is not None and d >= min_dv and s not in exclude), key=lambda x: (-x[1], x[0]))
    return ok[:max(0, cap)]


# SIC code ranges -> GICS sector (coarse; first match wins)
SIC_GICS = [((1311, 1389), 'Energy'), ((2830, 2836), 'Health Care'), ((2840, 2844), 'Consumer Staples'), ((2900, 2999), 'Energy'),
            ((3570, 3579), 'Information Technology'), ((3630, 3639), 'Consumer Discretionary'), ((3651, 3652), 'Consumer Discretionary'),
            ((3661, 3679), 'Information Technology'), ((3710, 3716), 'Consumer Discretionary'), ((3751, 3751), 'Consumer Discretionary'),
            ((3841, 3851), 'Health Care'), ((3812, 3812), 'Industrials'), ((3800, 3899), 'Information Technology'),
            ((4955, 4955), 'Industrials'), ((5120, 5129), 'Health Care'), ((5140, 5149), 'Consumer Staples'), ((5400, 5499), 'Consumer Staples'),
            ((5912, 5912), 'Consumer Staples'), ((6500, 6599), 'Real Estate'), ((6798, 6798), 'Real Estate'), ((7370, 7379), 'Information Technology'),
            ((7800, 7899), 'Communication Services'), ((8731, 8731), 'Health Care'), ((100, 999), 'Consumer Staples'),
            ((1000, 1499), 'Materials'), ((1500, 1799), 'Industrials'), ((2000, 2199), 'Consumer Staples'),
            ((2200, 2399), 'Consumer Discretionary'), ((2400, 2499), 'Materials'), ((2500, 2599), 'Consumer Discretionary'),
            ((2600, 2699), 'Materials'), ((2700, 2799), 'Communication Services'), ((2800, 2899), 'Materials'),
            ((3100, 3199), 'Consumer Discretionary'), ((3000, 3399), 'Materials'), ((3400, 3699), 'Industrials'),
            ((3700, 3799), 'Industrials'), ((3900, 3999), 'Consumer Discretionary'), ((4000, 4799), 'Industrials'),
            ((4800, 4899), 'Communication Services'), ((4900, 4999), 'Utilities'), ((5000, 5199), 'Industrials'),
            ((5200, 5999), 'Consumer Discretionary'), ((6000, 6799), 'Financials'), ((7000, 7299), 'Consumer Discretionary'),
            ((7300, 7399), 'Industrials'), ((7500, 7599), 'Consumer Discretionary'), ((7900, 7999), 'Consumer Discretionary'),
            ((8000, 8099), 'Health Care'), ((8200, 8299), 'Consumer Discretionary'), ((8700, 8799), 'Industrials')]


def sic_sector(sic) -> str:
    try:
        n = int(str(sic).strip())
    except (TypeError, ValueError):
        return 'Other'
    return next((g for (a, b), g in SIC_GICS if a <= n <= b), 'Other')


def load_top(path: str = TOP_PATH) -> List[Dict[str, str]]:
    if not os.path.exists(path):
        return []
    with open(path, newline='', encoding='utf-8') as f:
        return [r for r in csv.DictReader(l for l in f if l.strip() and not l.startswith('#')) if r.get('symbol')]


def top_rows(top: List[Dict[str, str]]) -> List[Dict[str, str]]:
    return [{'symbol': r['symbol'], 'name': r.get('name', ''), 'sector': r.get('sector') or 'Other', 'cik': _cik(r.get('cik')),
             'indexes': 'TOP', 'home': '', 'currency': 'USD', 'feed': '', 'country': ''} for r in top]


def _sec_sic(cik: str) -> str:
    js = json.loads(http_get(SEC_SUBMISSIONS.format(cik), ua=os.environ['SEC_UA'].strip(), accept='application/json'))
    return str(js.get('sic') or '')


def refresh_top(assets: Optional[Dict[str, Dict]], exclude: set, bars_fn=None, sic_fn=None, sec_raw: Optional[bytes] = None,
                path: str = TOP_PATH, log=print, today: Optional[str] = None) -> List[Dict[str, str]]:
    """Rebuild top_liquid.csv (see the module doc) and return its rows; on missing keys / a failed or unfinished
    download the committed CSV is kept (minus the symbols now in another universe). bars_fn(symbols, start, end) ->
    {symbol: [Bar]} (default data.alpaca_bars); sic_fn(cik) -> SIC code (default SEC submissions, needs SEC_UA)."""
    import datetime as dt
    old = load_top(path)
    keep_old = [r for r in old if r['symbol'] not in exclude]
    if not assets:
        log(f'TOP: no Alpaca asset list: kept the previous {len(keep_old)} rows')
        return keep_old
    import data as DATA
    if bars_fn is None:
        if not DATA.alpaca_keys():
            log(f'TOP: no Alpaca keys: kept the previous {len(keep_old)} rows')
            return keep_old
        bars_fn = lambda syms, a, b: DATA.alpaca_bars(syms, a, b)  # noqa: E731
    cands = top_candidates(assets, exclude)
    end_d = dt.date.fromisoformat(today) if today else dt.date.today()
    start, end = (end_d - dt.timedelta(days=40)).isoformat(), DATA._alpaca_end() if not today else end_d.isoformat()
    t0, dv = time.time(), {}
    try:
        for i in range(0, len(cands), TOP_BATCH):
            if time.time() - t0 > TOP_BUDGET_S:
                log(f'TOP: bars budget ({TOP_BUDGET_S:.0f}s) spent after {i}/{len(cands)} candidates: kept the previous {len(keep_old)} rows')
                return keep_old
            for s, bars in bars_fn(cands[i:i + TOP_BATCH], start, end).items():
                dv[s] = median_dv(bars)
    except Exception as e:  # noqa: BLE001
        log(f'TOP: bars download failed ({type(e).__name__}: {e}): kept the previous {len(keep_old)} rows')
        return keep_old
    min_dv = TOP_MIN_DV
    if bars_fn is not None and DATA.alpaca_feed() == 'iex':
        min_dv = 0.0
        log('TOP: Alpaca feed is iex (a few % of the volume): dollar-volume threshold off, ranking only')
    top = rank_top(dv, exclude, min_dv, TOP_MAX)
    prev = {r['symbol']: r for r in old}
    rows = [{'symbol': s, 'name': clean_name(assets[s].get('name', '')), 'sector': (prev.get(s) or {}).get('sector', ''),
             'cik': _cik((prev.get(s) or {}).get('cik')), 'exchange': assets[s].get('exchange', ''), 'dv20_musd': f'{d / 1e6:.1f}'}
            for s, d in top]
    fill_ciks(rows, sec_raw)
    if sic_fn is None and os.environ.get('SEC_UA', '').strip():
        sic_fn = _sec_sic
    n_sic = 0
    for r in rows:
        if r['sector'] and r['sector'] != 'Other':
            continue
        if sic_fn and r['cik'] and n_sic < TOP_SIC_MAX:
            n_sic += 1
            try:
                r['sector'] = sic_sector(sic_fn(r['cik']))
            except Exception:  # noqa: BLE001
                r['sector'] = 'Other'
        r['sector'] = r['sector'] or 'Other'
    with open(path, 'w', newline='', encoding='utf-8') as f:
        f.write(f'# US top liquid (universe TOP): built by universe.py refresh_top; {len(cands)} candidates, '
                f'>= {min_dv / 1e6:.0f}M USD/day 20-day median, cap {TOP_MAX}, other universes excluded\n')
        w = csv.DictWriter(f, fieldnames=TOP_FIELDS)
        w.writeheader()
        w.writerows(rows)
    log(f'TOP: {len(cands)} candidates, {sum(1 for v in dv.values() if v)} with bars, {len(rows)} kept '
        f'({time.time() - t0:.0f}s, {n_sic} SIC lookups)')
    return rows


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
            for k in ('name', 'sector', 'cik', 'home', 'currency', 'feed', 'country'):
                if not x.get(k) and r.get(k):
                    x[k] = r[k]
    return [by[k] for k in sorted(by)]


def fill_ciks(rows: List[Dict[str, str]], raw: Optional[bytes] = None, log=None) -> int:
    """CIKs from SEC company_tickers.json for rows without one (US listings only); a curated CIK (ADR list, TSX map)
    that SEC lists differently for that ticker is corrected. Returns how many were filled or corrected."""
    missing = [r for r in rows if not r.get('cik') and r.get('feed', '') == '']
    curated = [r for r in rows if r.get('cik') and r.get('feed', '') == '' and
               ('ADR' in (r.get('indexes') or '').split(',') or (r.get('home') or '').startswith('TSX:'))]
    if not missing and not curated:
        return 0
    if raw is None and not os.environ.get('SEC_UA', '').strip():
        if missing:
            print(f'SEC company_tickers.json skipped: set env SEC_UA ("<project> <contact>") to fill {len(missing)} '
                  'missing CIKs (fundamentals n/a for them until then)', file=sys.stderr)
        return 0
    try:
        if raw is None:
            raw = _SEC_RAW.get('t') or http_get(SEC_TICKERS, ua=os.environ['SEC_UA'].strip(), accept='application/json')
            _SEC_RAW['t'] = raw
        js = json.loads(raw)
        m = {str(v['ticker']).upper(): str(v['cik_str']).zfill(10) for v in js.values()}
    except Exception as e:  # noqa: BLE001
        print(f'SEC company_tickers.json unavailable ({type(e).__name__}): CIK n/a for {len(missing)} tickers', file=sys.stderr)
        return 0
    n = 0
    for r in missing + curated:
        c = m.get(r['symbol']) or m.get(r['symbol'].replace('.', '-'))
        if c and c != r.get('cik'):
            if r.get('cik') and log:
                log(f"{r['symbol']}: committed CIK {r['cik']} -> SEC {c}")
            r['cik'] = c
            n += 1
    return n


_SEC_RAW: Dict[str, bytes] = {}


def load(path: str = CSV_PATH, indexes: Optional[List[str]] = None) -> List[Dict[str, str]]:
    with open(path, newline='') as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        r['indexes'] = r.get('indexes') or 'SPX'
        for k in ('home', 'feed', 'country'):
            r[k] = r.get(k) or ''
        r['currency'] = r.get('currency') or 'USD'
    want = set(indexes if indexes is not None else enabled())
    return [r for r in rows if want & set(r['indexes'].split(','))]


def _previous_tsx(rows: List[Dict[str, str]]) -> Dict[str, str]:
    return {r['home'][4:]: r['symbol'] for r in rows if r.get('home', '').startswith('TSX:') and not r.get('feed')}


def refresh(force: bool = False, max_age_days: float = 7, log=print, assets=None, bars_fn=None,
            fetch=None) -> List[Dict[str, str]]:
    """Rebuild universe.csv: the Wikipedia indexes, the checked ADR list, then the TOP list (which excludes every
    symbol of the others). fetch(url) -> page text (default: an HTTP GET); bars_fn see refresh_top."""
    if not force and os.path.exists(CSV_PATH) and time.time() - os.path.getmtime(CSV_PATH) < max_age_days * 86400:
        return load()
    old: Dict[str, List[Dict[str, str]]] = {}
    prev_rows: List[Dict[str, str]] = []
    if os.path.exists(CSV_PATH):
        prev_rows = load(indexes=INDEXES)
        for r in prev_rows:
            for i in r['indexes'].split(','):
                old.setdefault(i, []).append(dict(r, indexes=i))
    if assets is None:
        import data as DATA
        assets = DATA.alpaca_assets(log=log) or None
        if assets is None:
            log('Alpaca asset list unavailable (no keys?): TSX hand-checked map + previous mapping, previous ADR / TOP rows')
    fetch = fetch or (lambda url: http_get(url, ua=UA, accept='text/html').decode('utf-8', 'replace'))
    overrides = load_map()
    lists = []
    for idx in INDEXES:
        if idx in CURATED:
            continue
        try:
            rows = parse_wiki(fetch(SOURCES[idx]), idx)
            if INDEX_META[idx]['country'] == 'CA':
                rows = map_tsx(rows, overrides, assets, _previous_tsx(prev_rows), log=log)
        except Exception as e:  # noqa: BLE001
            rows = old.get(idx, [])
            log(f'{idx}: refresh failed ({e}); kept the previous {len(rows)} rows')
        lists.append(rows)
        n_us = sum(1 for r in rows if not r.get('feed'))
        log(f'{idx}: {len(rows)} tickers' + (f' ({n_us} with a US listing)' if INDEX_META[idx]['country'] == 'CA' else ''))
    adr = build_adr(load_adr_list(), assets, old.get('ADR'), log=log)
    lists.append(adr)
    log(f'ADR: {len(adr)} tickers')
    exclude = {r['symbol'] for rows in lists for r in rows}
    if 'TOP' in enabled():
        top = refresh_top(assets, exclude, bars_fn=bars_fn, log=log)
    else:
        top = [r for r in load_top() if r['symbol'] not in exclude]
    lists.append(top_rows(top))
    log(f'TOP: {len(top)} tickers')
    rows = merge(lists)
    n = fill_ciks(rows, log=log)
    log(f'CIK filled / corrected from SEC: {n}; still missing: {sum(1 for r in rows if not r["cik"] and not r.get("feed"))}')
    with open(CSV_PATH, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    return load()


if __name__ == '__main__':
    rows = refresh(force='--force' in sys.argv)
    print(f'{len(rows)} tickers ({",".join(enabled())}) -> {CSV_PATH}')
