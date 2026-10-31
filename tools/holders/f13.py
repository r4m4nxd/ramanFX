"""Institutional holders from the SEC's free quarterly "Form 13F data sets" (bulk zips of every 13F-HR filing) and the
CUSIP -> ticker map they need. Official, free data only: www.sec.gov and OpenFIGI's free tier. Pure apart from the injected
fetchers (tests: tools/holders/tests/test_holders.py).

Data sets (https://www.sec.gov/data-research/sec-markets-data/form-13f-data-sets): zips named by the filing window they
cover ('01sep2025-30nov2025_form13f.zip', older ones '2024q4_form13f.zip'), each holding tab-separated tables:
    SUBMISSION.tsv   ACCESSION_NUMBER, FILING_DATE, SUBMISSIONTYPE (13F-HR, 13F-HR/A ...), CIK, PERIODOFREPORT ('31-MAR-2026')
    COVERPAGE.tsv    ACCESSION_NUMBER, FILINGMANAGER_NAME, ISAMENDMENT, AMENDMENTTYPE (RESTATEMENT / NEW HOLDINGS) ...
    INFOTABLE.tsv    ACCESSION_NUMBER, NAMEOFISSUER, TITLEOFCLASS, CUSIP, VALUE (USD), SSHPRNAMT, SSHPRNAMTTYPE (SH / PRN), PUTCALL ...
The page is read for the zip links (one cheap request; a new quarter is a new link), the two newest zips give the latest
quarter and the one before it. A 13F is filed within 45 days of the quarter end: the data is that old by construction.

A holder is a filing manager (CIK); its rows of one issuer (CUSIP) are summed (shares, SH only, no puts / calls); a restated
filing replaces the original, 'new holdings' amendments add to it. Change vs the previous quarter: new / add / cut / same
(+- 1% is 'same'); 'exited' = a manager that filed this quarter and no longer holds it.

CUSIP -> ticker, cached in tools/holders/.cache (cusip.json): (1) the CUSIP of a Schedule 13D / 13G on the company (exact:
issuer CIK -> scanner symbol), (2) OpenFIGI's free mapping API for the 13F issuer names that match a scanner company name
(10 CUSIPs a request, 25 requests a minute without a key; OPENFIGI_API_KEY raises the limits, never printed or logged). Negative
answers are cached for 30 days. The index giants are tagged 'index' (INDEX_RE) so the card can mark them.
"""
from __future__ import annotations

import csv
import datetime as dt
import io
import json
import os
import re
import time
import urllib.error
import urllib.request
import zipfile
from typing import Callable, Dict, Iterable, List, Optional, Sequence, Set, Tuple

PAGE = 'https://www.sec.gov/data-research/sec-markets-data/form-13f-data-sets'
BASE = 'https://www.sec.gov'
FIGI = 'https://api.openfigi.com/v3/mapping'
TOP_N = 10
SAME_PCT = 1.0                                       # +- 1% of the previous quarter's shares is 'same'
LAG_DAYS = 45                                        # the 13F filing deadline after the quarter end
NEG_DAYS = 30                                        # a CUSIP OpenFIGI could not map is asked again after this
MONTHS = {m: i + 1 for i, m in enumerate(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'])}

# Funds that track an index (or mostly do): shown on the card, marked 'index'. FMR / Fidelity files one 13F for its active and
# index funds together, so it is not tagged; Geode runs Fidelity's index funds and is.
INDEX_RE = re.compile(r'\b(vanguard|blackrock|ishares|state street|ssga|geode|northern trust|charles schwab|schwab investment|'
                      r'dimensional fund|fidelity[^,]*\bindex)\b', re.I)
SMALL = {'LLC': 'LLC', 'LP': 'LP', 'LLP': 'LLP', 'PLC': 'PLC', 'NA': 'NA', 'USA': 'USA', 'FMR': 'FMR', 'UBS': 'UBS', 'AG': 'AG', 'SA': 'SA',
         'NV': 'NV', 'AB': 'AB', 'II': 'II', 'III': 'III', 'LTD': 'Ltd', 'CO': 'Co', 'INC': 'Inc', 'CORP': 'Corp', 'ETF': 'ETF', 'TD': 'TD',
         'JPMORGAN': 'JPMorgan', 'BLACKROCK': 'BlackRock', 'SSGA': 'SSgA', 'HSBC': 'HSBC', 'BNP': 'BNP', 'AQR': 'AQR', 'T': 'T'}


def pretty(name: str) -> str:
    """'VANGUARD GROUP INC' -> 'Vanguard Group Inc'; a name that is not all capitals is left alone."""
    n = ' '.join((name or '').split())
    if not n or n != n.upper():
        return n
    return ' '.join(SMALL.get(w.strip('.,'), w.title()) if w.strip('.,') in SMALL else w.title() for w in n.split())


def is_index(name: str) -> bool:
    return bool(INDEX_RE.search(name or ''))


# ---- the data-set page ----------------------------------------------------------------------------------------------------
_LINK = re.compile(r'href="([^"]*form-13f-data-sets/[^"]+_form13f\.zip)"', re.I)
_SPAN = re.compile(r'(\d{2})([a-z]{3})(\d{4})-(\d{2})([a-z]{3})(\d{4})', re.I)
_QTR = re.compile(r'(\d{4})q([1-4])', re.I)


def zip_end(name: str) -> Optional[dt.date]:
    """The last day a data-set zip covers, from its name; None when the name is not a known pattern."""
    m = _SPAN.search(name)
    if m and m.group(5).lower() in MONTHS:
        try:
            return dt.date(int(m.group(6)), MONTHS[m.group(5).lower()], int(m.group(4)))
        except ValueError:
            return None
    q = _QTR.search(name)
    if q:
        y, n = int(q.group(1)), int(q.group(2))
        return dt.date(y, n * 3, 31 if n in (1, 4) else 30)
    return None


def zip_links(page: str) -> List[Tuple[str, dt.date]]:
    """[(absolute URL, end date)] of the data-set zips on the page, newest first."""
    out = {}
    for h in _LINK.findall(page or ''):
        e = zip_end(h)
        if e:
            out[(BASE + h) if h.startswith('/') else h] = e
    return sorted(out.items(), key=lambda kv: kv[1], reverse=True)


# ---- one data-set zip -----------------------------------------------------------------------------------------------------
def _rows(zf: zipfile.ZipFile, name: str) -> Iterable[Dict[str, str]]:
    member = next((n for n in zf.namelist() if n.upper().endswith(name)), None)
    if member is None:
        return
    with zf.open(member) as raw:
        rd = csv.DictReader(io.TextIOWrapper(raw, encoding='utf-8', errors='replace', newline=''), delimiter='\t', quoting=csv.QUOTE_NONE)
        for r in rd:
            yield r


def _date(s: str) -> Optional[dt.date]:
    for f in ('%d-%b-%Y', '%Y-%m-%d', '%m/%d/%Y'):
        try:
            return dt.datetime.strptime((s or '').strip().title(), f).date()
        except ValueError:
            continue
    return None


def read_meta(zf: zipfile.ZipFile) -> Dict[str, Dict]:
    """{accession: {cik, period (date), filed (date), type, name, amend ('' / 'RESTATEMENT' / 'NEW HOLDINGS')}} of the 13F-HR
    filings (original and amended) in the zip."""
    meta: Dict[str, Dict] = {}
    for r in _rows(zf, 'SUBMISSION.TSV'):
        t = (r.get('SUBMISSIONTYPE') or '').strip().upper()
        if t not in ('13F-HR', '13F-HR/A'):
            continue
        p, f = _date(r.get('PERIODOFREPORT', '')), _date(r.get('FILING_DATE', ''))
        if p and r.get('ACCESSION_NUMBER'):
            meta[r['ACCESSION_NUMBER']] = {'cik': (r.get('CIK') or '').lstrip('0'), 'period': p, 'filed': f or p, 'type': t, 'name': '', 'amend': ''}
    for r in _rows(zf, 'COVERPAGE.TSV'):
        m = meta.get(r.get('ACCESSION_NUMBER', ''))
        if m:
            m['name'] = (r.get('FILINGMANAGER_NAME') or '').strip()
            if (r.get('ISAMENDMENT') or '').strip().upper() in ('Y', 'YES', 'TRUE', '1'):
                m['amend'] = (r.get('AMENDMENTTYPE') or 'RESTATEMENT').strip().upper()
    return meta


def dominant_period(meta: Dict[str, Dict]) -> Optional[dt.date]:
    """The quarter most filings in the zip report (stragglers and amendments of older quarters are the minority)."""
    n: Dict[dt.date, int] = {}
    for m in meta.values():
        n[m['period']] = n.get(m['period'], 0) + 1
    return max(n, key=lambda p: (n[p], p)) if n else None


def pick_accessions(meta: Dict[str, Dict], period: dt.date) -> Dict[str, str]:
    """{accession: manager cik} to count for one quarter: per manager, the newest restating filing (or the original) and every
    'new holdings' amendment filed after it."""
    by: Dict[str, List[Tuple[dt.date, str, Dict]]] = {}
    for acc, m in meta.items():
        if m['period'] == period and m['cik']:
            by.setdefault(m['cik'], []).append((m['filed'], acc, m))
    out: Dict[str, str] = {}
    for cik, fs in by.items():
        fs.sort(key=lambda x: (x[0], x[1]))
        base = max((i for i, (_, _, m) in enumerate(fs) if m['amend'] != 'NEW HOLDINGS'), default=0)
        # the base: the last filing that is not a 'new holdings' addendum (the original or the newest restatement)
        for _, acc, m in fs[base:]:
            out[acc] = cik
    return out


def scan_infotable(zf: zipfile.ZipFile) -> Iterable[Tuple[str, str, str, str, float, float]]:
    """(accession, cusip, issuer name, class title, shares, value USD) of every share row (SH, no put / call)."""
    for r in _rows(zf, 'INFOTABLE.TSV'):
        if (r.get('PUTCALL') or '').strip() or (r.get('SSHPRNAMTTYPE') or 'SH').strip().upper() != 'SH':
            continue
        try:
            sh = float((r.get('SSHPRNAMT') or '0').replace(',', ''))
            val = float((r.get('VALUE') or '0').replace(',', ''))
        except ValueError:
            continue
        c = (r.get('CUSIP') or '').strip().upper()
        if sh > 0 and len(c) == 9:
            yield r.get('ACCESSION_NUMBER', ''), c, (r.get('NAMEOFISSUER') or '').strip(), (r.get('TITLEOFCLASS') or '').strip(), sh, val


def issuer_names(zf: zipfile.ZipFile) -> Dict[str, Dict]:
    """Pass 1: {cusip: {name, title, val}} (the biggest row's names, the dollars summed): what the map step matches against."""
    out: Dict[str, Dict] = {}
    for _, c, name, title, _, val in scan_infotable(zf):
        e = out.get(c)
        if e is None:
            out[c] = {'name': name, 'title': title, 'val': val}
        else:
            e['val'] += val
    return out


def holdings_of(zf: zipfile.ZipFile, accs: Dict[str, str], cusips: Set[str]) -> Dict[str, Dict[str, Tuple[float, float]]]:
    """Pass 2: {cusip: {manager cik: (shares, value)}} for the wanted CUSIPs and accessions."""
    out: Dict[str, Dict[str, Tuple[float, float]]] = {}
    for acc, c, _, _, sh, val in scan_infotable(zf):
        cik = accs.get(acc)
        if cik is None or c not in cusips:
            continue
        d = out.setdefault(c, {})
        a, b = d.get(cik, (0.0, 0.0))
        d[cik] = (a + sh, b + val)
    return out


def top_holders(cur: Dict[str, Tuple[float, float]], prev: Dict[str, Tuple[float, float]], names: Dict[str, str], filed_cur: Set[str],
                so: Optional[float], n: int = TOP_N) -> Dict:
    """One stock's 13F block: the top n managers by shares with % of shares outstanding and the change vs the previous quarter,
    the managers that exited (filed this quarter, hold none now; the biggest 3 of the previous top), the totals."""
    ranked = sorted(cur.items(), key=lambda kv: -kv[1][0])
    top = []
    for cik, (sh, val) in ranked[:n]:
        p = prev.get(cik)
        if p is None:
            ch, dsh = 'new', sh
        else:
            dsh = sh - p[0]
            r = dsh / p[0] * 100 if p[0] else 0.0
            ch = 'same' if abs(r) <= SAME_PCT else 'add' if dsh > 0 else 'cut'
        row = {'f': pretty(names.get(cik, cik)), 'cik': cik, 'sh': round(sh), 'v': round(val), 'ch': ch, 'dsh': round(dsh)}
        if so:
            row['pct'] = round(sh / so * 100, 3)
        if is_index(names.get(cik, '')):
            row['idx'] = True
        top.append(row)
    gone = [(cik, v) for cik, v in sorted(prev.items(), key=lambda kv: -kv[1][0])[:n] if cik not in cur and cik in filed_cur][:3]
    tot = sum(v[0] for v in cur.values())
    out = {'top': top, 'n': len(cur), 'tot': round(tot)}
    if so:
        out['tot_pct'] = round(tot / so * 100, 2)
    if gone:
        out['ex'] = [{'f': pretty(names.get(cik, cik)), 'cik': cik, 'sh': round(v[0])} for cik, v in gone]
    return out


# ---- CUSIP -> ticker ------------------------------------------------------------------------------------------------------
_SUFFIX = re.compile(r'\b(inc|incorporated|corp|corporation|co|company|ltd|limited|llc|plc|holdings?|group|the|del|new|sa|nv|ag|lp|cl|class|common|stock|com|ord|shs|adr|ads|sponsored|n v|s a)\b')


def norm_name(s: str) -> str:
    """'APPLE INC' / 'Apple Inc.' -> 'apple': lower case, punctuation and company-form words removed."""
    t = re.sub(r'[^a-z0-9 ]+', ' ', (s or '').lower().replace('&', ' and '))
    return ' '.join(_SUFFIX.sub(' ', t).split())


def norm_sym(s: str) -> str:
    return re.sub(r'[^A-Z0-9]', '', (s or '').upper())


def name_candidates(issuers: Dict[str, Dict], universe: Sequence[Dict], skip: Set[str]) -> List[str]:
    """CUSIPs whose 13F issuer name equals (or starts with / is the start of) a scanner company name, biggest dollars first:
    the only ones worth an OpenFIGI question."""
    names = [norm_name(u.get('n', '')) for u in universe]
    names = sorted({n for n in names if len(n) >= 3})
    firsts = {n.split()[0] for n in names}
    out = []
    for c, e in issuers.items():
        if c in skip:
            continue
        m = norm_name(e['name'])
        if not m or m.split()[0] not in firsts:
            continue
        if any(m == n or m.startswith(n + ' ') or n.startswith(m + ' ') for n in names):
            out.append(c)
    return sorted(out, key=lambda c: -issuers[c]['val'])


def figi_ticker(item: Dict, universe_syms: Set[str]) -> str:
    """The scanner symbol an OpenFIGI mapping answer names, '' when none of its listings is one."""
    for d in (item or {}).get('data') or []:
        if d.get('marketSector') not in (None, 'Equity'):
            continue
        t = norm_sym(d.get('ticker', ''))
        if t in universe_syms:
            return t
    return ''


def figi_batch(post: Callable[[List[Dict]], List[Dict]], cusips: Sequence[str]) -> Dict[str, Optional[Dict]]:
    """Ask OpenFIGI about up to 10 CUSIPs (one request); {cusip: its answer item or None}."""
    res = post([{'idType': 'ID_CUSIP', 'idValue': c} for c in cusips])
    return {c: (res[i] if i < len(res) else None) for i, c in enumerate(cusips)}


def openfigi_poster(ua: str, key: str = '', timeout: float = 20) -> Callable[[List[Dict]], List[Dict]]:
    """POST to the free OpenFIGI v3 mapping API (the optional key goes in a header and is never printed)."""
    def post(jobs: List[Dict]) -> List[Dict]:
        h = {'Content-Type': 'application/json', 'User-Agent': ua, 'Accept': 'application/json'}
        if key:
            h['X-OPENFIGI-APIKEY'] = key
        req = urllib.request.Request(FIGI, data=json.dumps(jobs).encode(), headers=h, method='POST')
        with urllib.request.urlopen(req, timeout=timeout) as r:
            js = json.loads(r.read())
        return js if isinstance(js, list) else []
    return post


class CusipMap:
    """{cusip: symbol} with the evidence and a timestamp, persisted as json. A symbol '' = asked, nothing found (retried after NEG_DAYS)."""

    def __init__(self, path: str = ''):
        self.path = path
        self.m: Dict[str, Dict] = {}
        try:
            with open(path) as f:
                self.m = json.load(f)
        except (OSError, ValueError, TypeError):
            self.m = {}

    def get(self, cusip: str) -> str:
        return (self.m.get(cusip) or {}).get('s', '')

    def known(self, cusip: str, now: float) -> bool:
        e = self.m.get(cusip)
        return bool(e) and (bool(e.get('s')) or now - e.get('t', 0) < NEG_DAYS * 86400)

    def put(self, cusip: str, sym: str, src: str, now: float) -> None:
        self.m[cusip] = {'s': sym, 'src': src, 't': int(now)}

    def save(self) -> None:
        if not self.path:
            return
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        tmp = self.path + '.tmp'
        with open(tmp, 'w') as f:
            json.dump(self.m, f, separators=(',', ':'))
        os.replace(tmp, self.path)

    def symbols(self) -> Dict[str, str]:
        return {c: e['s'] for c, e in self.m.items() if e.get('s')}


def resolve(cm: CusipMap, issuers: Dict[str, Dict], universe: Sequence[Dict], seeds: Dict[str, str], post: Optional[Callable[[List[Dict]], List[Dict]]],
            now: float, max_requests: int = 150, pause: float = 2.5, sleep: Callable[[float], None] = time.sleep, log: Callable[..., None] = print) -> Dict[str, int]:
    """Fill the map: the 13D / 13G seeds ({cusip: symbol}, exact), then OpenFIGI for the name candidates (a budget of requests,
    paced under the free tier's 25 a minute). Returns counts."""
    n = {'seeded': 0, 'figi': 0, 'asked': 0, 'requests': 0, 'unmapped': 0}
    syms = {norm_sym(u['s']): u['s'] for u in universe}
    for c, s in seeds.items():
        if s and cm.get(c) != s:
            cm.put(c, s, 'g13', now)
            n['seeded'] += 1
    todo = [c for c in name_candidates(issuers, universe, {c for c in cm.m if cm.known(c, now)})]
    fails = 0
    for i in range(0, len(todo), 10):
        if n['requests'] >= max_requests or post is None or fails >= 3:
            break
        batch = todo[i:i + 10]
        try:
            ans = figi_batch(post, batch)
        except urllib.error.HTTPError as e:
            fails += 1
            log(f'OpenFIGI: HTTP {e.code}' + (' (rate limited: stopping for now)' if e.code == 429 else ''))
            if e.code == 429:
                break
            sleep(pause * 2)
            continue
        except Exception as e:  # noqa: BLE001
            fails += 1
            log(f'OpenFIGI: not reached ({type(e).__name__})')
            sleep(pause * 2)
            continue
        fails = 0
        n['requests'] += 1
        for c in batch:
            t = figi_ticker(ans.get(c) or {}, set(syms))
            cm.put(c, syms[t] if t else '', 'figi', now)
            n['asked'] += 1
            n['figi' if t else 'unmapped'] += 1
        sleep(pause)
    return n
