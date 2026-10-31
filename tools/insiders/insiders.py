"""Insider activity from SEC EDGAR, with the stock scanner's zone context: Form 4 open-market buys (code P, clusters and early
big buys) and big non-plan sales (code S), Form 144 planned sales, Schedule 13D activists. Official, free data; no third-party
insider sites.

Data (www.sec.gov, a User-Agent with a contact as SEC requires, <= 8 requests a second, the scanner's paced
data.http_get with its circuit breaker):
    latest filings   the "latest filings" Atom feed (cgi-bin/browse-edgar?action=getcurrent&type=<T>&output=atom), newest first,
                     100 a page, paged until a page holds nothing new (max FEED_PAGES), for T = 4 (Form 4), 144 (Form 144),
                     SCHEDULE 13D (13D and 13D/A: the feed matches a type by its prefix); Schedule 13G is not alerted and is
                     read by the holders job (tools/holders)
    backfill         the daily form index (Archives/edgar/daily-index/<y>/QTR<q>/form.<yyyymmdd>.idx), those form types, newest
                     day first, for the last DAYS calendar days, within a per-run time budget (a day is 'done' once every
                     filing of it was read; the first runs fill the 30 days step by step)
    each filing      the full submission text (Archives/edgar/data/<cik>/<acc>/<acc>.txt): ACCEPTANCE-DATETIME + the structured
                     XML (form4.py, form144.py, sched13.py)
User-Agent: env SEC_UA (GitHub secret, as used as-is by tools/stock_scanner) first, else env SEC_CONTACT (repository
variable, tools/fundamentals/sec_stocks.py) as 'RamanFX insiders <contact>'; neither -> nothing is requested from SEC
(one log line) and the published file is rebuilt from the cache. The UA is never printed.

Rules (env overrides in brackets):
    qualifying buy   one filing's P rows summed (one insider per filing), value >= $10k [INSIDERS_MIN_VALUE], price
                     >= $2 [INSIDERS_MIN_PRICE], market cap >= $50M when known [INSIDERS_MIN_MCAP]; a 4/A replaces the
                     original's rows of the same owner and trade date
    cluster          >= 2 [INSIDERS_MIN_N] distinct insiders buying the same issuer within 14 days [INSIDERS_WINDOW];
                     >= 3 [INSIDERS_STRONG_N] = strong
    early buy        the FIRST big buy, before anyone else joins: one filing by a CEO / CFO / President / COO / Chair >= $100k
                     [INSIDERS_EARLY_TOP_MIN], or by any insider or 10% owner >= $500k [INSIDERS_EARLY_ANY_MIN]; alerts at once
                     (no score bar), labelled 'early · 1 insider so far'; the cluster alert follows as others join
    big solo buy     (older rule, kept) no cluster, but one CEO / CFO filing >= $250k [INSIDERS_SOLO_MIN]; an early buy covers it
    repeat buyer     the same insider bought on two or more filings with different trade dates in the 30 days
    big sale         a Form 4 open-market sale (code S) that is NOT a Rule 10b5-1 plan sale (the filing's 10b5-1 checkbox, or
                     a footnote naming the plan: form4.py) and not a tax-withholding 'sell to cover' [INSIDERS_SELL_COVER=1
                     keeps those], by a CEO / CFO / President / COO / Chair or a 10% owner, of >= $1M [INSIDERS_SELL_MIN] or
                     >= 0.1% of the market cap [INSIDERS_SELL_PCT]; scanner stocks
    planned sale     a Form 144 (notice of a proposed sale, filed before it) of a scanner stock for >= $1M [INSIDERS_144_MIN] or
                     >= 0.1% of the market cap [INSIDERS_144_PCT] (the form's own shares outstanding when the cap is unknown)
    activist         a Schedule 13D or 13D/A on a scanner stock (percent of class, shares, Item 4 purpose, change vs the
                     filer's previous filing when known)
Score of a buy cluster (simple, additive; documented in the app and the guide):
    size             solo / early 1 · 2 insiders 2 · 3 insiders 3.5 · 4+ 4.5
    roles            CEO or CFO among the buyers +2 (both +3); another top officer (President / COO / Chair) +0.5
    $ vs market cap  >= 0.5% +2 · >= 0.1% +1.5 · >= 0.02% +0.5; market cap unknown: >= $5M +1.5 · >= $1M +1 · >= $250k +0.5
    holdings         the biggest holdings increase >= 50% (or a new position) +1.5 · >= 20% +1 · >= 5% +0.5
    zone             price inside a W1 / MN / 3M demand zone of the scanner +2 · within 5% above one +1
    repeat buyer     +0.5
    ⭐               strong cluster (3+) AND inside / near a W1 or MN demand zone (buys only; the other alerts carry the same zone text)
Telegram: only NEW items (read this run, filed within NEW_HOURS): clusters / big solo buys with score >= 5
[INSIDERS_SCORE_BAR], early buys, big sales, planned sales, 13D filings; a cluster is re-sent only when it grows; at most 6
alerts a Calgary day in all [INSIDERS_MAX_PER_DAY]; several in ONE message, every line with the trade date and 'filed 35m ago';
owner mutes, quiet hours silent; the bot's guests who have stocks on (tools/stock_scanner/guests.py).

Output public/insiders/latest.json on the `data` branch (INSIDERS_DATA_ROOT; the app's /insiders page, the bot's /insiders,
/holders, /fund and zone lines, the morning brief): the clusters / early buys of the last 30 days, the recent qualifying buys,
the recent big-ish sales, planned sales (Form 144), 13D filings, a per-ticker 30-day summary.
State tools/insiders/.cache/state.json (actions cache): seen accession numbers, parsed buys / sells / 144 / 13D, days done, alerts.
The first run on a latest.json written by the older job alerts only sales / 144 / 13D filed after it (`events_since` in the file).

    python tools/insiders/insiders.py                 # the scheduled run
    python tools/insiders/insiders.py --sample        # ONE '🧪 Sample insider buys' message (top clusters), no alerts
    python tools/insiders/insiders.py --no-notify     # a dry run: print instead of sending, alert state untouched
    python tools/insiders/insiders.py --backfill-min 50   # a longer backfill (one-time fill of the 30 days)
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Dict, Iterable, List, Optional, Sequence, Set, Tuple
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SCANNER = os.path.join(ROOT, 'tools', 'stock_scanner')
for p in (HERE, SCANNER):
    if p not in sys.path:
        sys.path.insert(0, p)

import form144 as F144  # noqa: E402
import form4 as F  # noqa: E402
import sched13 as S13  # noqa: E402
import notify as SN  # noqa: E402  (escape, Msg, send with 429 retry, silent sends)
import prefs as P  # noqa: E402    (mutes / quiet hours)

UTC = dt.timezone.utc
NYZ = ZoneInfo('America/New_York')
CAL = ZoneInfo('America/Edmonton')
STATE = os.path.join(HERE, '.cache', 'state.json')
# Scheduled data lives on the `data` branch (no Vercel deploys): the workflow checks it out into a folder and passes
# it as INSIDERS_DATA_ROOT; the output goes there, the scanner / fundamentals files are read from there when present.
DATA_ROOT = os.environ.get('INSIDERS_DATA_ROOT') or ROOT


def _data_path(*parts: str) -> str:
    p = os.path.join(DATA_ROOT, *parts)
    return p if DATA_ROOT == ROOT or os.path.exists(p) else os.path.join(ROOT, *parts)


LATEST = os.path.join(DATA_ROOT, 'public', 'insiders', 'latest.json')
UNIVERSE_CSV = _data_path('tools', 'stock_scanner', 'universe.csv')
SCAN_DIR = _data_path('public', 'scanner')
FUND = _data_path('public', 'fundamentals', 'stocks.json')
APP = os.environ.get('INSIDERS_APP_URL', 'https://raman-fx.vercel.app/insiders')

FEED = ('https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type={type}&company=&dateb=&owner=include'
        '&start={start}&count=100&output=atom')
FEED_TYPES = ('4', '144', 'SCHEDULE 13D')                  # Form 4, Form 144, Schedule 13D (+ 13D/A by prefix)
F4_FORMS = ('4', '4/A')
F144_FORMS = ('144', '144/A')
D13_FORMS = ('SCHEDULE 13D', 'SCHEDULE 13D/A', 'SC 13D', 'SC 13D/A')
FORMS = F4_FORMS + F144_FORMS + D13_FORMS
DAILY = 'https://www.sec.gov/Archives/edgar/daily-index/{y}/QTR{q}/form.{ymd}.idx'
TXT = 'https://www.sec.gov/Archives/edgar/data/{cik}/{nodash}/{acc}.txt'
INDEX = 'https://www.sec.gov/Archives/edgar/data/{cik}/{nodash}/{acc}-index.htm'
FEED_PAGES = 10
WORKERS = 8
SEC_PAUSE = 0.125                                    # 8 requests a second (SEC allows 10)


def _env(k: str, d: float) -> float:
    try:
        return float(os.environ.get(k) or d)
    except ValueError:
        return d


CFG = {'min_n': int(_env('INSIDERS_MIN_N', 2)), 'strong_n': int(_env('INSIDERS_STRONG_N', 3)),
       'window': int(_env('INSIDERS_WINDOW', 14)), 'solo_min': _env('INSIDERS_SOLO_MIN', 250_000),
       'min_value': _env('INSIDERS_MIN_VALUE', 10_000), 'min_price': _env('INSIDERS_MIN_PRICE', 2.0),
       'min_mcap': _env('INSIDERS_MIN_MCAP', 50e6), 'score_bar': _env('INSIDERS_SCORE_BAR', 5.0),
       'max_per_day': int(_env('INSIDERS_MAX_PER_DAY', 6)), 'days': int(_env('INSIDERS_DAYS', 30)),
       'new_hours': _env('INSIDERS_NEW_HOURS', 36), 'near_pct': 5.0, 'recent_days': 14, 'max_buys': 300,
       'early_top_min': _env('INSIDERS_EARLY_TOP_MIN', 100_000), 'early_any_min': _env('INSIDERS_EARLY_ANY_MIN', 500_000),
       'sell_min': _env('INSIDERS_SELL_MIN', 1_000_000), 'sell_pct': _env('INSIDERS_SELL_PCT', 0.1),
       'sell_cover': int(_env('INSIDERS_SELL_COVER', 0)), 'sell_list_min': 250_000, 'max_sells': 300,
       'p144_min': _env('INSIDERS_144_MIN', 1_000_000), 'p144_pct': _env('INSIDERS_144_PCT', 0.1), 'max_plans': 300,
       'd13_days': 60, 'max_acts': 150}


def log(*a) -> None:
    print(*a, flush=True)


# ---- User-Agent ---------------------------------------------------------------------------------------------------
def user_agent(env=os.environ) -> Optional[str]:
    """SEC_UA (secret) as-is, else 'RamanFX insiders <SEC_CONTACT>', else None (= skip SEC). Never invents a contact."""
    ua = (env.get('SEC_UA') or '').strip()
    if ua:
        return ua
    c = (env.get('SEC_CONTACT') or '').strip()
    return f'RamanFX insiders {c}' if c else None


def http_getter(ua: str) -> Callable[[str], bytes]:
    import data as SD                                 # noqa: WPS433 (tools/stock_scanner/data.py)
    SD.HOST_PAUSE['www.sec.gov'] = SEC_PAUSE
    return lambda url: SD.http_get(url, ua=ua, accept='*/*', retries=2, timeout=15)


# ---- feed / index parsing -----------------------------------------------------------------------------------------
_ENTRY = re.compile(r'<entry>(.*?)</entry>', re.S)


def parse_feed(text: str) -> List[Dict]:
    """Atom entries -> [{acc, cik, ciks, form, updated}], one per accession (the feed lists a filing for the issuer AND each
    reporting owner / filer); `ciks` = every CIK the filing is listed under. Only the forms this job reads (FORMS)."""
    out: Dict[str, Dict] = {}
    for e in _ENTRY.findall(text):
        acc = re.search(r'accession-number=([\d-]{20})', e)
        link = re.search(r'/Archives/edgar/data/(\d+)/', e)
        form = re.search(r'term="([^"]+)"', e)
        upd = re.search(r'<updated>([^<]+)</updated>', e)
        if not acc or not link:
            continue
        f = (form.group(1) if form else '4').strip()
        if f not in FORMS:
            continue
        r = out.setdefault(acc.group(1), {'acc': acc.group(1), 'cik': link.group(1), 'ciks': [], 'form': f, 'updated': upd.group(1) if upd else ''})
        if link.group(1) not in r['ciks']:
            r['ciks'].append(link.group(1))
    return list(out.values())


_IDX = re.compile(r'^(4(?:/A)?|144(?:/A)?|SCHEDULE 13D(?:/A)?|SC 13D(?:/A)?)\s+.+?\s+(\d{1,10})\s+(\d{8})\s+(edgar/data/\d+/([\d-]{20})\.txt)\s*$')


def parse_daily_index(text: str) -> List[Dict]:
    """The form index -> one ref per accession of the forms this job reads (an index lists a filing once per company it is
    filed for: `ciks` collects them)."""
    out: Dict[str, Dict] = {}
    for line in text.splitlines():
        m = _IDX.match(line)
        if m:
            r = out.setdefault(m.group(5), {'acc': m.group(5), 'cik': m.group(2), 'ciks': [], 'form': m.group(1), 'day': m.group(3)})
            if m.group(2) not in r['ciks']:
                r['ciks'].append(m.group(2))
    return list(out.values())


def txt_url(ref: Dict) -> str:
    return TXT.format(cik=int(ref['cik']), nodash=ref['acc'].replace('-', ''), acc=ref['acc'])


def index_url(cik, acc: str) -> str:
    return INDEX.format(cik=int(cik), nodash=acc.replace('-', ''), acc=acc)


def accepted_utc(s: str) -> str:
    """SEC's ACCEPTANCE-DATETIME (New York) -> ISO UTC 'Z'; '' when missing."""
    try:
        t = dt.datetime.strptime(s[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=NYZ)
    except (ValueError, TypeError):
        return ''
    return t.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')


# ---- records ------------------------------------------------------------------------------------------------------
def records_of(doc: Dict, ref: Dict) -> List[Dict]:
    """One parsed filing -> its P and S trade (filing_trades), with accession, filing URL and UTC filing time."""
    out = []
    for code in ('P', 'S'):
        r = F.filing_trades(doc, code)
        if not r:
            continue
        r['acc'] = ref['acc']
        r['url'] = index_url(r['cik'] or ref['cik'], ref['acc'])
        r['filed'] = accepted_utc(r.get('accepted') or '') or ref.get('filed', '')
        r.pop('accepted', None)
        out.append(r)
    return out


def _same(a: Dict, b: Dict) -> bool:
    return a['cik'] == b['cik'] and a['owner_cik'] == b['owner_cik'] and a['code'] == b['code'] and a['date'] == b['date']


def add_record(lst: List[Dict], rec: Dict) -> bool:
    """Dedupe by accession; an amendment (4/A) replaces the same owner's rows of the same issuer and trade date (an
    original read after its amendment is dropped). True when the list changed."""
    if any(x['acc'] == rec['acc'] and x['code'] == rec['code'] for x in lst):
        return False
    if rec.get('form') == '4/A':
        lst[:] = [x for x in lst if not (_same(x, rec) and (x.get('form') != '4/A' or x['filed'] <= rec['filed']))]
    elif any(_same(x, rec) and x.get('form') == '4/A' for x in lst):
        return False
    lst.append(rec)
    return True


def amend_without_trades(lst: List[Dict], doc: Dict) -> None:
    """A 4/A with no P / S rows left: the original's rows of that owner and report date are withdrawn."""
    own = (doc.get('owners') or [{}])[0].get('cik', '')
    per = doc.get('period', '')
    cik = doc['issuer']['cik']
    lst[:] = [x for x in lst if not (x['cik'] == cik and x['owner_cik'] == own and x['date'] == per and x.get('form') != '4/A')]


def filed_utc(doc: Dict, ref: Dict) -> str:
    return accepted_utc(doc.get('accepted') or '') or ref.get('filed', '')


def ingest(st: Dict, ref: Dict, raw: bytes, universe: Set[str], ciks: Optional[Dict[str, str]] = None) -> int:
    """Parse one filing into the state; returns the number of records added (buys, big-ish sales of scanner stocks, Form 144
    notices of scanner stocks, Schedule 13D filings). `ciks` = {issuer CIK: scanner symbol}."""
    form = (ref.get('form') or '').strip()
    try:
        if form in F144_FORMS:
            return ingest_144(st, ref, raw, ciks or {})
        if form in D13_FORMS:
            return ingest_13d(st, ref, raw, ciks or {})
        doc = F.parse_submission(raw)
    except Exception:  # noqa: BLE001  (malformed XML: skip that filing)
        return 0
    if doc.get('form') not in F4_FORMS:
        return 0
    recs = records_of(doc, ref)
    if doc.get('form') == '4/A' and not recs:
        amend_without_trades(st['buys'], doc)
    n = 0
    for r in recs:
        if r['code'] == 'P':
            n += add_record(st['buys'], r)
        elif r['sym'] in universe or alt_sym(r['sym']) in universe:
            n += add_record(st['sells'], r)
    return n


def sym_of(ciks: Dict[str, str], cik) -> str:
    return (ciks or {}).get(str(cik or '').lstrip('0'), '')


def add_event(lst: List[Dict], rec: Dict, same: Callable[[Dict, Dict], bool]) -> bool:
    """Dedupe by accession; an amendment ('/A') replaces an earlier filing of the same thing. True when the list changed."""
    if any(x['acc'] == rec['acc'] for x in lst):
        return False
    if rec['form'].upper().endswith('/A'):
        lst[:] = [x for x in lst if not (same(x, rec) and x['filed'] <= rec['filed'])]
    lst.append(rec)
    return True


def ingest_144(st: Dict, ref: Dict, raw: bytes, ciks: Dict[str, str]) -> int:
    """A Form 144 of a scanner stock (its issuer CIK is in `ciks`; every CIK when `ciks` is empty = unknown universe)."""
    doc = F144.parse_submission(raw)
    sym = sym_of(ciks, doc['issuer']['cik'])
    if ciks and not sym:
        return 0
    rec = F144.record(doc, ref, index_url(ref['cik'], ref['acc']), filed_utc(doc, ref), sym)
    if rec is None:
        return 0
    return int(add_event(st['f144'], rec, lambda a, b: a['cik'] == b['cik'] and a['seller'] == b['seller'] and a['date'] == b['date']))


def ingest_13d(st: Dict, ref: Dict, raw: bytes, ciks: Dict[str, str]) -> int:
    """A Schedule 13D / 13D/A (any company; `sym` is set for scanner stocks). `prev` = the same filer's previous filing
    on that company already in the state (percent change)."""
    doc = S13.parse_submission(raw)
    if doc['kind'] != 'D':
        return 0
    rec = S13.record(doc, ref, index_url(ref['cik'], ref['acc']), filed_utc(doc, ref), sym_of(ciks, doc['subject']['cik']))
    if rec is None:
        return 0
    prev = [x for x in st['d13'] if x['cik'] == rec['cik'] and x['filer'] == rec['filer'] and x['acc'] != rec['acc'] and x['filed'] < rec['filed']]
    if prev:
        p = max(prev, key=lambda x: x['filed'])
        rec['prev_pct'], rec['prev_filed'] = p.get('pct'), p['filed'][:10]
    return int(add_event(st['d13'], rec, lambda a, b: a['cik'] == b['cik'] and a['filer'] == b['filer'] and a['event'] == b['event']))


def alt_sym(s: str) -> str:
    return s.replace('-', '.') if '-' in s else s.replace('.', '-')


# ---- state --------------------------------------------------------------------------------------------------------
def load_json(path: str, default):
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def load_state(path: str = STATE) -> Dict:
    st = load_json(path, {}) or {}
    for k, d in (('seen', {}), ('buys', []), ('sells', []), ('f144', []), ('d13', []), ('days_done', []), ('alerted', {}), ('sent_day', {})):
        st.setdefault(k, d)
    return st


def save_state(st: Dict, path: str = STATE) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(st, f, separators=(',', ':'))
    os.replace(tmp, path)


def prune(st: Dict, today: dt.date, days: int) -> None:
    keep = (today - dt.timedelta(days=days + 10)).strftime('%Y%m%d')
    st['seen'] = {a: d for a, d in st['seen'].items() if d >= keep}
    cut = (today - dt.timedelta(days=days + 15)).isoformat()
    st['buys'] = [b for b in st['buys'] if (b.get('date') or '') >= cut]
    st['sells'] = [b for b in st['sells'] if (b.get('date') or '') >= cut]
    st['f144'] = [b for b in st['f144'] if (b.get('filed') or '')[:10] >= cut]
    st['d13'] = [b for b in st['d13'] if (b.get('filed') or '')[:10] >= (today - dt.timedelta(days=CFG['d13_days'] + 15)).isoformat()]
    st['days_done'] = sorted(d for d in st['days_done'] if d >= keep)
    c2 = (today - dt.timedelta(days=days + 5)).isoformat()
    st['alerted'] = {k: v for k, v in st['alerted'].items() if (v.get('at') or '')[:10] >= c2}
    st['sent_day'] = {k: v for k, v in st['sent_day'].items() if k >= (today - dt.timedelta(days=7)).isoformat()}


# ---- fetching -----------------------------------------------------------------------------------------------------
def fetch_many(refs: Sequence[Dict], get: Callable[[str], bytes], deadline: float, workers: int = WORKERS) -> List[Tuple[Dict, Optional[bytes]]]:
    """Fetch the submissions (paced by data.http_get per host); none starts after `deadline` (time.time())."""
    def one(ref):
        if time.time() > deadline:
            return ref, None, 'late'
        try:
            return ref, get(txt_url(ref)), ''
        except Exception as e:  # noqa: BLE001
            return ref, None, type(e).__name__
    out = []
    errs: Dict[str, int] = {}
    with ThreadPoolExecutor(max_workers=workers) as ex:
        for ref, raw, err in ex.map(one, refs):
            out.append((ref, raw))
            if err and err != 'late':
                errs[err] = errs.get(err, 0) + 1
    if errs:
        log(f'filings not read: {errs}')
    return out


def read_feed(get: Callable[[str], bytes], seen: Dict[str, str], pages: int = FEED_PAGES, ftype: str = '4',
              have: Optional[Set[str]] = None) -> List[Dict]:
    refs: List[Dict] = []
    have = set() if have is None else have
    for p in range(pages):
        try:
            text = get(FEED.format(type=urllib.parse.quote_plus(ftype), start=p * 100)).decode('utf-8', 'replace')
        except Exception as e:  # noqa: BLE001
            log(f'latest-filings feed {ftype} page {p + 1}: not read ({type(e).__name__})')
            break
        ents = parse_feed(text)
        fresh = [e for e in ents if e['acc'] not in seen and e['acc'] not in have]
        for e in fresh:
            have.add(e['acc'])
            refs.append(e)
        if not ents or not fresh:
            break
    return refs


def business_days(today: dt.date, days: int) -> List[dt.date]:
    """Weekdays from yesterday back `days` calendar days, newest first (SEC holidays simply have no index: 404)."""
    out = []
    for k in range(1, days + 1):
        d = today - dt.timedelta(days=k)
        if d.weekday() < 5:
            out.append(d)
    return out


def daily_url(d: dt.date) -> str:
    return DAILY.format(y=d.year, q=(d.month - 1) // 3 + 1, ymd=d.strftime('%Y%m%d'))


def relevant(ref: Dict, ciks: Dict[str, str]) -> bool:
    """A Form 144 is read only when one of the CIKs it is listed under is a scanner stock (the issuer): the feed and the
    index list every notice of the market. Everything else is read; no scanner CIKs known = read all."""
    if ref.get('form') not in F144_FORMS or not ciks:
        return True
    return any(str(c).lstrip('0') in ciks for c in ref.get('ciks') or [ref['cik']])


def process(st: Dict, pairs: Iterable[Tuple[Dict, Optional[bytes]]], universe: Set[str], new: Set[str], fresh: bool,
            ciks: Optional[Dict[str, str]] = None) -> Tuple[int, int]:
    """Ingest fetched filings; mark them seen. Returns (read, records added)."""
    read = buys = 0
    for ref, raw in pairs:
        if raw is None:
            continue
        read += 1
        day = (ref.get('day') or (ref.get('updated') or '')[:10].replace('-', '') or time.strftime('%Y%m%d'))
        st['seen'][ref['acc']] = day
        k = ingest(st, ref, raw, universe, ciks)
        buys += k
        if k and fresh is not None:
            new.add(ref['acc'])
    return read, buys


def collect(st: Dict, get: Callable[[str], bytes], today: dt.date, universe: Set[str], feed_s: float, backfill_s: float,
            days: int, ciks: Optional[Dict[str, str]] = None) -> Tuple[Set[str], Dict]:
    """Latest feeds first, then the daily-index backfill. Returns (accessions read this run that added records, stats)."""
    new: Set[str] = set()
    stats = {'feed': 0, 'backfill': 0, 'buys': 0, 'days_done': 0}
    t0 = time.time()
    refs: List[Dict] = []
    have: Set[str] = set()
    for ft in FEED_TYPES:
        refs += read_feed(get, st['seen'], FEED_PAGES, ft, have)
    for r in refs:                                    # a Form 144 of another company is never read: mark it seen
        if not relevant(r, ciks or {}):
            st['seen'][r['acc']] = (r.get('updated') or '')[:10].replace('-', '') or time.strftime('%Y%m%d')
    refs = [r for r in refs if relevant(r, ciks or {})]
    r, b = process(st, fetch_many(refs, get, t0 + feed_s), universe, new, True, ciks)
    stats['feed'], stats['buys'] = r, b
    deadline = time.time() + backfill_s
    for d in business_days(today, days):
        key = d.strftime('%Y%m%d')
        if key in st['days_done']:
            continue
        if time.time() > deadline:
            break
        try:
            idx = parse_daily_index(get(daily_url(d)).decode('latin-1'))
        except Exception as e:  # noqa: BLE001
            code = getattr(e, 'code', None)
            if code == 404 and d < today - dt.timedelta(days=1):
                st['days_done'].append(key)            # market holiday: no index
            elif code != 404:
                log(f'daily index {key}: not read ({type(e).__name__})')
            continue
        for x in idx:
            if x['acc'] not in st['seen'] and not relevant(x, ciks or {}):
                st['seen'][x['acc']] = key
        todo = [x for x in idx if x['acc'] not in st['seen']]
        r, b = process(st, fetch_many(todo, get, deadline), universe, new, True, ciks)
        stats['backfill'] += r
        stats['buys'] += b
        if all(x['acc'] in st['seen'] for x in idx):
            st['days_done'].append(key)
            stats['days_done'] += 1
    st['days_done'] = sorted(set(st['days_done']))
    return new, stats


# ---- scanner / fundamentals context ---------------------------------------------------------------------------------
class Context:
    """Scanner universe (public/scanner/index.json + shards) and fundamentals (public/fundamentals/stocks.json)."""

    def __init__(self, scan_dir: str = SCAN_DIR, fund_path: str = FUND, universe_csv: str = UNIVERSE_CSV):
        self.scan_dir = scan_dir
        idx = load_json(os.path.join(scan_dir, 'index.json'), {}) or {}
        self.rows = {str(t.get('s')).upper(): t for t in idx.get('tickers') or [] if t.get('s')}
        self.fund = (load_json(fund_path, {}) or {}).get('stocks') or {}
        self._shards: Dict[int, Dict] = {}
        self._ck: Optional[Dict[str, str]] = None
        self._csv = universe_csv

    def cik_map(self) -> Dict[str, str]:
        """{issuer CIK (no leading zeros): scanner symbol} from the fundamentals file and universe.csv (a Form 144 and a
        Schedule 13D name the company by CIK only)."""
        if getattr(self, '_ck', None) is None:
            m: Dict[str, str] = {}
            try:
                with open(getattr(self, '_csv', '') or UNIVERSE_CSV, newline='', encoding='utf-8') as f:
                    for r in csv.DictReader(l for l in f if l.strip() and not l.startswith('#')):
                        if r.get('cik') and r.get('symbol'):
                            m[str(r['cik']).lstrip('0')] = r['symbol'].upper()
            except OSError:
                pass
            for sym, v in (getattr(self, 'fund', None) or {}).items():
                if isinstance(v, dict) and v.get('cik'):
                    m[str(v['cik']).lstrip('0')] = str(sym).upper()
            rows = getattr(self, 'rows', None) or {}
            self._ck = {c: s for c, s in m.items() if not rows or s in rows}
        return self._ck

    def sym(self, s: str) -> Optional[str]:
        s = (s or '').upper()
        for c in (s, alt_sym(s), s.replace('.', ''), s.replace('-', '')):
            if c in self.rows:
                return c
        return None

    def detail(self, sym: str) -> Dict:
        row = self.rows.get(sym) or {}
        k = row.get('k')
        if k is None:
            return {}
        if k not in self._shards:
            self._shards[k] = (load_json(os.path.join(self.scan_dir, 't', f'{k}.json'), {}) or {}).get('tickers') or {}
        return self._shards[k].get(sym) or {}

    def mcap(self, sym: str) -> Optional[float]:
        s = self.sym(sym)
        v = (self.fund.get(s) or {}).get('mcap') if s else None
        return float(v) if isinstance(v, (int, float)) and v > 0 else None


def zone_at(price: Optional[float], zones: Sequence[Dict], near_pct: float = 5.0) -> Optional[Dict]:
    """The W1 / MN / 3M demand zone price is inside (best) or within near_pct above (nearest); None otherwise."""
    if not price:
        return None
    best = None
    for z in zones or []:
        if z.get('side') != 'demand' or z.get('tf') not in ('W1', 'MN', '3M'):
            continue
        hi, lo = z.get('proximal'), z.get('distal')
        if not isinstance(hi, (int, float)) or not isinstance(lo, (int, float)):
            continue
        hi, lo = max(hi, lo), min(hi, lo)
        if lo <= price <= hi:
            c = {'tf': z['tf'], 'where': 'inside', 'lo': lo, 'hi': hi, 'dist': 0.0}
            rank = (0, ('MN', 'W1', '3M').index(z['tf']))
        elif hi < price <= hi * (1 + near_pct / 100):
            d = round((price - hi) / hi * 100, 1)
            c = {'tf': z['tf'], 'where': 'near', 'lo': lo, 'hi': hi, 'dist': d}
            rank = (1, d)
        else:
            continue
        if best is None or rank < best[0]:
            best = (rank, c)
    return best[1] if best else None


# ---- clusters -----------------------------------------------------------------------------------------------------
def qualifying(buys: Sequence[Dict], today: dt.date, cfg: Dict = CFG, mcap_of: Callable[[str], Optional[float]] = lambda s: None) -> List[Dict]:
    cut = (today - dt.timedelta(days=cfg['days'])).isoformat()
    out = []
    for b in buys:
        if b.get('code', 'P') != 'P' or (b.get('date') or '') < cut:
            continue
        if b.get('value') is None or b['value'] < cfg['min_value']:
            continue
        if b.get('price') is None or b['price'] < cfg['min_price']:
            continue
        mc = mcap_of(b.get('sym') or '')
        if mc is not None and mc < cfg['min_mcap']:
            continue
        out.append(b)
    return out


def _who(b: Dict) -> str:
    return b.get('owner_cik') or (b.get('owner') or '').lower()


def repeat_buyers(buys: Sequence[Dict]) -> Set[Tuple[str, str]]:
    """(issuer cik, insider) that bought on two or more filings with different trade dates."""
    dates: Dict[Tuple[str, str], Set[str]] = {}
    for b in buys:
        dates.setdefault((b['cik'], _who(b)), set()).add(b['date'])
    return {k for k, v in dates.items() if len(v) >= 2}


def _d(s: str) -> dt.date:
    return dt.date.fromisoformat(s[:10])


def find_clusters(buys: Sequence[Dict], today: dt.date, cfg: Dict = CFG, mcap_of=lambda s: None) -> List[Dict]:
    """Clusters (>= min_n distinct insiders within `window` days; the window with the most insiders, latest on a tie)
    and big CEO / CFO solo buys, from the qualifying buys of the last `days`."""
    q = qualifying(buys, today, cfg, mcap_of)
    reps = repeat_buyers(q)
    by: Dict[str, List[Dict]] = {}
    for b in q:
        by.setdefault(b['cik'], []).append(b)
    out = []
    for cik, bs in by.items():
        bs.sort(key=lambda b: (b['date'], b.get('filed') or ''))
        best: Optional[List[Dict]] = None
        for b in bs:
            lo = _d(b['date'])
            win = [x for x in bs if lo <= _d(x['date']) <= lo + dt.timedelta(days=cfg['window'])]
            n = len({_who(x) for x in win})
            if best is None or n >= len({_who(x) for x in best}):
                best = win
        n = len({_who(x) for x in best or []})
        if n >= cfg['min_n']:
            members, kind = best, 'cluster'
        else:
            solo = [x for x in bs if (x.get('ceo') or x.get('cfo')) and x['value'] >= cfg['solo_min']]
            if not solo:
                continue
            members, kind = [max(solo, key=lambda x: (x['value'], x['date']))], 'solo'
            n = 1
        out.append(make_cluster(cik, members, kind, n, reps, cfg))
    return out


def is_early(b: Dict, cfg: Dict = CFG) -> bool:
    """One filing big enough to alert before anyone else joins: a CEO / CFO / President / COO / Chair >= early_top_min, or any
    insider or 10% owner >= early_any_min."""
    v = b.get('value') or 0
    return v >= cfg['early_any_min'] or (bool(b.get('ceo') or b.get('cfo') or b.get('top')) and v >= cfg['early_top_min'])


def find_early(buys: Sequence[Dict], today: dt.date, cfg: Dict = CFG, mcap_of=lambda s: None) -> List[Dict]:
    """Per issuer, the biggest early-qualifying buy of the last `days` as a one-insider item (kind 'early', n 1), whether or
    not a cluster exists too: the alert logic (to_alert) sends it only while nothing was sent for the issuer."""
    q = qualifying(buys, today, cfg, mcap_of)
    reps = repeat_buyers(q)
    by: Dict[str, List[Dict]] = {}
    for b in q:
        if is_early(b, cfg):
            by.setdefault(b['cik'], []).append(b)
    return [make_cluster(cik, [max(bs, key=lambda x: (x['value'], x['date'], x.get('filed') or ''))], 'early', 1, reps, cfg) for cik, bs in by.items()]


ROLE_RANK = ('CEO', 'CFO')


def _lead(ins: Sequence[Dict]) -> Dict:
    """The buyer to name first: CEO, then CFO, then another officer, then a director, biggest $ first."""
    def rk(x):
        return (0 if x['ceo'] else 1 if x['cfo'] else 2 if x['officer'] else 3 if x['director'] else 4, -(x['value'] or 0))
    return sorted(ins, key=rk)[0]


def make_cluster(cik: str, members: Sequence[Dict], kind: str, n: int, reps: Set[Tuple[str, str]], cfg: Dict = CFG) -> Dict:
    per: Dict[str, Dict] = {}
    for b in members:                                   # one row per insider: their filings in the window summed
        w = _who(b)
        p = per.get(w)
        if p is None:
            per[w] = p = {'name': b['owner'], 'role': b['role'], 'ceo': b['ceo'], 'cfo': b['cfo'], 'officer': b['officer'],
                          'top': bool(b.get('top')), 'director': b['director'], 'ten': b['ten'], 'value': 0.0, 'shares': 0.0, 'date': b['date'],
                          'pct': b.get('pct'), 'new': b.get('new', False), 'plan': b.get('plan', False), 'url': b['url'],
                          'filed': b.get('filed') or '', 'repeat': (cik, w) in reps, 'filings': 0, 'accs': []}
        p['value'] += b['value'] or 0
        p['shares'] += b['shares'] or 0
        p['filings'] += 1
        p['accs'].append(b['acc'])
        if b['date'] >= p['date']:
            p['date'], p['url'] = b['date'], b['url']
        if (b.get('filed') or '') > p['filed']:
            p['filed'] = b['filed']
        if b.get('new'):
            p['new'] = True
        if b.get('pct') is not None and (p['pct'] is None or b['pct'] > p['pct']):
            p['pct'] = b['pct']
        p['price'] = round(p['value'] / p['shares'], 4) if p['shares'] else None
    ins = sorted(per.values(), key=lambda x: -x['value'])
    last = max(members, key=lambda b: (b['date'], b.get('filed') or ''))
    lead = _lead(ins)
    m0 = members[0]
    return {'key': f"{cik}:{kind}", 'cik': cik, 'sym': last['sym'] or m0['sym'], 'name': last['name'] or m0['name'],
            'kind': kind, 'n': n, 'strong': kind == 'cluster' and n >= cfg['strong_n'],
            'value': round(sum(i['value'] for i in ins), 2), 'shares': sum(i['shares'] for i in ins),
            'price': last.get('price'), 'first': min(b['date'] for b in members), 'last': last['date'],
            'filed': max((b.get('filed') or '') for b in members), 'url': last['url'],
            'ceo': any(i['ceo'] for i in ins), 'cfo': any(i['cfo'] for i in ins),
            'lead': {'role': short_role(lead), 'pct': lead.get('pct'), 'new': lead.get('new', False), 'name': lead['name']},
            'repeat': any(i['repeat'] for i in ins),
            'insiders': [{k: v for k, v in i.items() if k not in ('ceo', 'cfo', 'officer', 'top', 'director', 'ten')} for i in ins]}


def short_role(i: Dict) -> str:
    if i.get('ceo'):
        return 'CEO'
    if i.get('cfo'):
        return 'CFO'
    r = (i.get('role') or '').split(' · ')[0]
    return r or 'Insider'


def score(c: Dict, mcap: Optional[float], zone: Optional[Dict]) -> Tuple[float, List[str]]:
    """The documented score (module docstring) and its parts in words."""
    s, why = 0.0, []
    if c['kind'] in ('solo', 'early'):
        s += 1
        why.append('solo 1')
    else:
        v = 2 if c['n'] == 2 else 3.5 if c['n'] == 3 else 4.5
        s += v
        why.append(f"{c['n']} insiders {v:g}")
    ins = c['insiders']
    names = [i.get('role', '') for i in ins]
    ceo, cfo = c.get('ceo'), c.get('cfo')
    if ceo or cfo:
        v = 3 if (ceo and cfo) else 2
        s += v
        why.append(f"{'CEO+CFO' if ceo and cfo else 'CEO' if ceo else 'CFO'} {v:g}")
    if any(re.search(r'President|COO|Chair|Founder', n or '') for n in names):
        s += 0.5
        why.append('top officer 0.5')
    val = c['value'] or 0
    if mcap:
        r = val / mcap * 100
        v = 2 if r >= 0.5 else 1.5 if r >= 0.1 else 0.5 if r >= 0.02 else 0
        c['of_mcap'] = round(r, 3)
    else:
        v = 1.5 if val >= 5e6 else 1 if val >= 1e6 else 0.5 if val >= 250e3 else 0
    if v:
        s += v
        why.append(f'size {v:g}')
    top = max([i['pct'] for i in ins if i.get('pct') is not None] or [0])
    v = 1.5 if (top >= 50 or any(i.get('new') for i in ins)) else 1 if top >= 20 else 0.5 if top >= 5 else 0
    if v:
        s += v
        why.append(f'holdings {v:g}')
    if zone:
        v = 2 if zone['where'] == 'inside' else 1
        s += v
        why.append(f"{zone['tf']} demand {v:g}")
    if c.get('repeat'):
        s += 0.5
        why.append('repeat 0.5')
    return round(s, 1), why


def ctx_fields(ctx: Context, sym: str, cfg: Dict = CFG) -> Dict:
    """What the scanner and the fundamentals know about a symbol: canonical `sym`, `universe`, price `px`, the demand `zone`
    the price is inside / near, `trend`, `signal`, and pe / rev_g / de / mcap / er_next / er_kind."""
    s = ctx.sym(sym)
    out: Dict = {'universe': bool(s), 'zone': None}
    if not s:
        return out
    out['sym'] = s
    d = ctx.detail(s)
    row = ctx.rows.get(s) or {}
    px = d.get('price') if isinstance(d.get('price'), (int, float)) else row.get('px')
    if isinstance(px, (int, float)):
        out['px'] = px
    out['zone'] = zone_at(out.get('px'), d.get('zones') or [], cfg['near_pct'])
    trend = [f"{t} {str(d.get(k)).lower()}" for t, k in (('W1', 'w1'), ('MN', 'mn')) if d.get(k) and d.get(k) != 'n/a']
    if trend:
        out['trend'] = ' · '.join(trend)
    if d.get('signal'):
        out['signal'] = str(d['signal'])
    f = ctx.fund.get(s) or {}
    for k in ('pe', 'rev_g', 'de', 'mcap', 'er_next', 'er_kind'):
        if f.get(k) is not None:
            out[k] = f[k]
    return out


def enrich(cls: List[Dict], ctx: Context, cfg: Dict = CFG) -> List[Dict]:
    """Scanner zone context, trend, signal, fundamentals, score and ⭐ for each cluster; best first (⭐, score, $)."""
    for c in cls:
        c.update(ctx_fields(ctx, c['sym'], cfg))
        zone = c['zone']
        c['score'], c['why'] = score(c, c.get('mcap'), zone)
        c['star'] = bool(c['strong'] and zone and zone['tf'] in ('W1', 'MN'))
    cls.sort(key=lambda c: (not c['star'], -c['score'], -(c['value'] or 0)))
    return cls


# ---- big sales / planned sales (Form 144) / activists (Schedule 13D) -------------------------------------------------
def sell_check(r: Dict, cfg: Dict = CFG, mcap_of: Callable[[str], Optional[float]] = lambda s: None) -> Optional[Dict]:
    """The big-sale test of one Form 4 sale record: {'of_mcap': % of the market cap or None} when it is an open-market
    sale (not a 10b5-1 plan sale, not a tax-withholding sell to cover), by a CEO / CFO / President / COO / Chair or a 10%
    owner, of >= sell_min dollars or >= sell_pct percent of the market cap; else None."""
    if r.get('code') != 'S' or r.get('plan') or (r.get('cover') and not cfg['sell_cover']):
        return None
    if not (r.get('ceo') or r.get('cfo') or r.get('top') or r.get('ten')):
        return None
    v, px = r.get('value'), r.get('price')
    if v is None or (px is not None and px < cfg['min_price']):
        return None
    mc = mcap_of(r.get('sym') or '')
    pct = round(v / mc * 100, 3) if mc else None
    if v >= cfg['sell_min'] or (pct is not None and pct >= cfg['sell_pct']):
        return {'of_mcap': pct}
    return None


def sell_item(r: Dict, why: Dict) -> Dict:
    return {'kind': 'sell', 'key': f"S:{r['acc']}", 'acc': r['acc'], 'cik': r['cik'], 'sym': r.get('sym') or '', 'name': r.get('name', ''),
            'who': r['owner'], 'role': short_role(r), 'value': r['value'], 'shares': r['shares'], 'price': r.get('price'), 'date': r['date'],
            'filed': r.get('filed') or '', 'pct': r.get('pct'), 'of_mcap': why['of_mcap'], 'url': r['url'], 'plan': False}


def big_sells(sells: Sequence[Dict], today: dt.date, cfg: Dict = CFG, mcap_of=lambda s: None) -> List[Dict]:
    """Alert-eligible sales (sell_check) of the last `days`, newest filing first."""
    cut = (today - dt.timedelta(days=cfg['days'])).isoformat()
    out = []
    for r in sells:
        w = sell_check(r, cfg, mcap_of) if (r.get('date') or '') >= cut else None
        if w is not None:
            out.append(sell_item(r, w))
    return sorted(out, key=lambda x: (x['filed'], x['value'] or 0), reverse=True)


def recent_sells(sells: Sequence[Dict], ctx: Context, today: dt.date, cfg: Dict = CFG) -> List[Dict]:
    """The app's Sells tab: open-market sales of scanner stocks, $250k+ [cfg sell_list_min], last recent_days, each with
    `big` (meets the alert rules) / `plan` (10b5-1) / `cover` (tax withholding)."""
    cut = (today - dt.timedelta(days=cfg['recent_days'])).isoformat()
    q = [r for r in sells if (r.get('date') or '') >= cut and (r.get('value') or 0) >= cfg['sell_list_min']]
    q.sort(key=lambda r: (r.get('filed') or '', r['value']), reverse=True)
    out = []
    for r in q[:cfg['max_sells']]:
        w = sell_check(r, cfg, ctx.mcap)
        mc = ctx.mcap(r.get('sym') or '')
        out.append({'sym': ctx.sym(r['sym']) or r['sym'], 'name': r['name'], 'who': r['owner'], 'role': r['role'], 'value': r['value'],
                    'shares': r['shares'], 'price': r.get('price'), 'date': r['date'], 'filed': r.get('filed', ''), 'pct': r.get('pct'),
                    'of_mcap': round(r['value'] / mc * 100, 3) if mc and r.get('value') else None, 'plan': bool(r.get('plan')),
                    'cover': bool(r.get('cover')), 'big': w is not None, 'url': r['url']})
    return out


def plan_pct(r: Dict, mcap_of=lambda s: None) -> Optional[float]:
    """% of the market cap a Form 144 would sell: dollars / market cap, else shares / the form's own shares outstanding."""
    mc = mcap_of(r.get('sym') or '')
    if mc and r.get('value'):
        return round(r['value'] / mc * 100, 3)
    if r.get('outstanding') and r.get('shares'):
        return round(r['shares'] / r['outstanding'] * 100, 3)
    return None


def plan_items(f144: Sequence[Dict], today: dt.date, cfg: Dict = CFG, mcap_of=lambda s: None) -> List[Dict]:
    """Form 144 notices of scanner stocks of the last `days` that are big: >= p144_min dollars or >= p144_pct percent."""
    cut = (today - dt.timedelta(days=cfg['days'])).isoformat()
    out = []
    for r in f144:
        if not r.get('sym') or (r.get('filed') or '')[:10] < cut or r.get('value') is None:
            continue
        pct = plan_pct(r, mcap_of)
        if r['value'] >= cfg['p144_min'] or (pct is not None and pct >= cfg['p144_pct']):
            out.append({'kind': 'plan', 'key': f"F:{r['acc']}", 'acc': r['acc'], 'cik': r['cik'], 'sym': r['sym'], 'name': r.get('name', ''),
                        'who': r['seller'], 'role': r.get('rel', ''), 'value': r['value'], 'shares': r.get('shares'), 'price': r.get('price'),
                        'date': r.get('date', ''), 'filed': r.get('filed') or '', 'of_mcap': pct, 'plan': bool(r.get('plan')),
                        'plan_dates': r.get('plan_dates', []), 'url': r['url']})
    return sorted(out, key=lambda x: (x['filed'], x['value'] or 0), reverse=True)


def act_items(d13: Sequence[Dict], today: dt.date, cfg: Dict = CFG, universe_only: bool = True) -> List[Dict]:
    """Schedule 13D / 13D/A filings of the last d13_days (scanner stocks only when `universe_only`), newest first."""
    cut = (today - dt.timedelta(days=cfg['d13_days'])).isoformat()
    out = []
    for r in d13:
        if (universe_only and not r.get('sym')) or (r.get('filed') or '')[:10] < cut:
            continue
        out.append({'kind': 'act', 'key': f"D:{r['acc']}", 'acc': r['acc'], 'cik': r['cik'], 'sym': r.get('sym') or '', 'name': r.get('name', ''),
                    'who': r['filer'], 'form': r['form'], 'amend': r['form'].upper().endswith('/A'), 'pct': r.get('pct'), 'shares': r.get('shares'),
                    'prev_pct': r.get('prev_pct'), 'event': r.get('event', ''), 'purpose': r.get('purpose', ''), 'filed': r.get('filed') or '',
                    'url': r['url']})
    return sorted(out, key=lambda x: x['filed'], reverse=True)


def enrich_events(items: List[Dict], ctx: Context, cfg: Dict = CFG) -> List[Dict]:
    """The scanner's zone context, price, trend and P/E on each sale / planned sale / 13D (no ⭐: that is a buy-cluster rule)."""
    for c in items:
        c.update(ctx_fields(ctx, c['sym'], cfg) if c['sym'] else {'universe': False, 'zone': None})
    return items


# ---- per-ticker summary / recent buys -----------------------------------------------------------------------------
def by_symbol(buys: Sequence[Dict], sells: Sequence[Dict], ctx: Context, today: dt.date, cfg: Dict = CFG,
              f144: Sequence[Dict] = (), d13: Sequence[Dict] = ()) -> Dict[str, Dict]:
    cut = (today - dt.timedelta(days=cfg['days'])).isoformat()
    out: Dict[str, Dict] = {}
    q = {id(b) for b in qualifying(buys, today, cfg, ctx.mcap)}
    for b in list(buys) + list(sells):
        if (b.get('date') or '') < cut or not b.get('sym'):
            continue
        if b['code'] == 'P' and id(b) not in q:
            continue
        s = ctx.sym(b['sym']) or b['sym']
        e = out.setdefault(s, {'buys': 0, 'buy_value': 0.0, 'buyers': set(), 'sells': 0, 'sell_value': 0.0, 'sellers': set(),
                               'last_buy': '', 'last_sell': '', 'rows': []})
        if b['code'] == 'P':
            e['buys'] += 1
            e['buy_value'] += b['value'] or 0
            e['buyers'].add(_who(b))
            e['last_buy'] = max(e['last_buy'], b['date'])
        else:
            e['sells'] += 1
            e['sell_value'] += b['value'] or 0
            e['sellers'].add(_who(b))
            e['last_sell'] = max(e['last_sell'], b['date'])
        e['rows'].append({'d': b['date'], 'who': b['owner'], 'role': short_role(b), 'code': b['code'], 'value': b['value'],
                          'price': b['price'], 'pct': b.get('pct'), 'plan': b.get('plan', False), 'url': b['url']})
    for r in f144:                                       # Form 144 notices of scanner stocks, last `days`
        if r.get('sym') and (r.get('filed') or '')[:10] >= cut:
            e = out.setdefault(ctx.sym(r['sym']) or r['sym'], {'buys': 0, 'buy_value': 0.0, 'buyers': set(), 'sells': 0, 'sell_value': 0.0,
                                                               'sellers': set(), 'last_buy': '', 'last_sell': '', 'rows': []})
            e['p144'] = e.get('p144', 0) + 1
            e['p144_value'] = round(e.get('p144_value', 0) + (r.get('value') or 0))
    for r in d13:                                        # Schedule 13D filings on scanner stocks, last `days`
        if r.get('sym') and (r.get('filed') or '')[:10] >= cut:
            e = out.setdefault(ctx.sym(r['sym']) or r['sym'], {'buys': 0, 'buy_value': 0.0, 'buyers': set(), 'sells': 0, 'sell_value': 0.0,
                                                               'sellers': set(), 'last_buy': '', 'last_sell': '', 'rows': []})
            e['d13'] = e.get('d13', 0) + 1
    for s, e in out.items():
        e['buyers'], e['sellers'] = len(e['buyers']), len(e['sellers'])
        e['buy_value'], e['sell_value'] = round(e['buy_value']), round(e['sell_value'])
        e['rows'] = sorted(e['rows'], key=lambda r: r['d'], reverse=True)[:6]
        e['universe'] = bool(ctx.sym(s))
    return out


def recent_buys(buys: Sequence[Dict], ctx: Context, today: dt.date, cfg: Dict = CFG) -> List[Dict]:
    cut = (today - dt.timedelta(days=cfg['recent_days'])).isoformat()
    q = [b for b in qualifying(buys, today, cfg, ctx.mcap) if b['date'] >= cut]
    q.sort(key=lambda b: (b.get('filed') or '', b['value']), reverse=True)
    return [{'sym': ctx.sym(b['sym']) or b['sym'], 'name': b['name'], 'who': b['owner'], 'role': b['role'],
             'value': b['value'], 'shares': b['shares'], 'price': b['price'], 'date': b['date'], 'filed': b.get('filed', ''),
             'pct': b.get('pct'), 'new': b.get('new', False), 'plan': b.get('plan', False), 'url': b['url'],
             'universe': bool(ctx.sym(b['sym']))} for b in q[:cfg['max_buys']]]


# ---- Telegram -----------------------------------------------------------------------------------------------------
def money(v) -> str:
    if v is None:
        return 'n/a'
    a = abs(v)
    s = f'{a / 1e9:.1f}B' if a >= 1e9 else f'{a / 1e6:.1f}M' if a >= 1e6 else f'{a / 1e3:.0f}K' if a >= 1e3 else f'{a:.0f}'
    return f"{'-' if v < 0 else ''}${s}"


def price_s(v) -> str:
    return 'n/a' if v is None else f'${v:,.2f}'


def md(iso: str) -> str:
    try:
        d = dt.date.fromisoformat(str(iso)[:10])
    except ValueError:
        return ''
    return f"{d.strftime('%b')} {d.day}"


def holdings_s(lead: Dict) -> str:
    if lead.get('new'):
        return 'new position'
    p = lead.get('pct')
    return f'+{p:.0f}% holdings' if isinstance(p, (int, float)) and p >= 0.5 else ''


def zone_s(z: Optional[Dict], star: bool) -> str:
    if not z:
        return ''
    rng = f"{z['lo']:,.2f}–{z['hi']:,.2f}" if z['hi'] < 100 else f"{z['lo']:,.0f}–{z['hi']:,.0f}"
    t = f"inside {z['tf']} demand {rng}" if z['where'] == 'inside' else f"{z['dist']:.1f}% above {z['tf']} demand {rng}"
    return ('⭐ ' if star else '') + t


def ago(iso: str, now: Optional[dt.datetime]) -> str:
    """'35m ago', '3h ago', '2d ago' for an ISO UTC time ('just now' under a minute); '' when either is unknown."""
    if now is None:
        return ''
    try:
        t = dt.datetime.strptime(str(iso)[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)
    except ValueError:
        return ''
    m = int((now - t).total_seconds() // 60)
    if m < 1:
        return 'just now'
    return f'{m}m ago' if m < 60 else f'{m // 60}h ago' if m < 48 * 60 else f'{m // 1440}d ago'


def fresh_s(what: str, date: str, filed_label: str, filed: str, now: Optional[dt.datetime]) -> str:
    """'bought Oct 27 · filed 35m ago': the trade date and how long ago the filing was accepted (just the date part when
    `now` is unknown, e.g. the morning brief)."""
    a = ago(filed, now)
    bits = [f'{what} {md(date)}'.strip() if date else '']
    if a:
        bits.append(f'{filed_label} {a}' if a != 'just now' else f'{filed_label} just now')
    return ' · '.join(b for b in bits if b)


def sh_s(v) -> str:
    if v is None:
        return 'n/a'
    a = abs(v)
    return f'{a / 1e9:.1f}B' if a >= 1e9 else f'{a / 1e6:.1f}M' if a >= 1e6 else f'{a / 1e3:.0f}K' if a >= 1e3 else f'{a:.0f}'


def pct_s(v: Optional[float]) -> str:
    return '' if v is None else '<0.01' if v < 0.01 else f'{v:.2f}' if v < 1 else f'{v:.1f}'


def tail(c: Dict, today: Optional[dt.date]) -> List[str]:
    """The zone text (⭐ only on a strong buy cluster at a W1 / MN demand), P/E and the earnings date."""
    bits = []
    z = zone_s(c.get('zone'), c.get('star', False))
    if z:
        bits.append(SN.esc(z))
    if c['kind'] in ('cluster', 'solo', 'early'):
        if isinstance(c.get('pe'), (int, float)) and c['pe'] > 0:
            bits.append(f"P/E {c['pe']:.0f}")
        er = c.get('er_next')
        if er and today and 0 <= (dt.date.fromisoformat(er) - today).days <= 45:
            bits.append(f"earnings {md(er)}{'?' if c.get('er_kind') == 'estimated' else ''}")
    return bits


def line(c: Dict, today: Optional[dt.date] = None, now: Optional[dt.datetime] = None) -> str:
    """'🕵️ Insider cluster buy · XYZ $12.40 · 3 insiders · $2.1M · CEO +18% holdings · latest trade Oct 28 · newest filing 35m ago ·
    ⭐ inside W1 demand 11.9–12.6 · P/E 9 · earnings Nov 12' (HTML). An early buy reads 'Insider buy · XYZ $12.40 · early ·
    1 insider so far · $300K · CEO new position · bought Oct 27 · filed 35m ago'. Sales, planned sales and 13D have their own."""
    if c['kind'] in ('sell', 'plan', 'act'):
        return event_line(c, today, now)
    head = 'Insider cluster buy' if c['kind'] == 'cluster' else 'Insider buy' if c['kind'] == 'early' else 'Big solo buy'
    bits = [f"{'🕵️'} {head} · <b>{SN.esc(c['sym'] or c['name'])}</b> {price_s(c.get('px') or c.get('price'))}"]
    bits.append(f"{c['n']} insiders" if c['kind'] == 'cluster' else 'early · 1 insider so far' if c['kind'] == 'early' else '1 insider')
    bits.append(money(c['value']))
    h = holdings_s(c['lead'])
    bits.append(SN.esc(f"{c['lead']['role']} {h}".strip()))
    if c['kind'] == 'cluster':
        f = fresh_s('latest trade', c['last'], 'newest filing', c.get('filed', ''), now)
    else:
        f = fresh_s('bought', c['last'], 'filed', c.get('filed', ''), now)
    if f:
        bits.append(f)
    if c.get('repeat'):
        bits.append('repeat buyer')
    return ' · '.join(bits + tail(c, today))


def event_line(c: Dict, today: Optional[dt.date], now: Optional[dt.datetime]) -> str:
    sym = f"<b>{SN.esc(c['sym'] or c['name'])}</b> {price_s(c.get('px') or c.get('price'))}"
    who = SN.esc(f"{c['role']} {c['who']}".strip() if c['kind'] == 'sell' else c['who'])
    if c['kind'] == 'sell':
        bits = [f'🔻 Insider sale · {sym}', f"{who} sold {money(c['value'])}"]
        if c.get('of_mcap') is not None:
            bits.append(f"{pct_s(c['of_mcap'])}% of market cap")
        if isinstance(c.get('pct'), (int, float)) and c['pct'] <= -0.5:
            bits.append(f"{abs(c['pct']):.0f}% of holdings")
        bits += ['open market, not a 10b5-1 plan sale', fresh_s('sold', c['date'], 'filed', c['filed'], now)]
    elif c['kind'] == 'plan':
        bits = [f'📋 Planned sale (Form 144) · {sym}', f"{SN.esc(c['who'])}{SN.esc(' (' + c['role'] + ')' if c.get('role') else '')} plans to sell {money(c['value'])}"]
        if c.get('shares'):
            bits[-1] += f" ({sh_s(c['shares'])} sh)"
        if c.get('of_mcap') is not None:
            bits.append(f"{pct_s(c['of_mcap'])}% of market cap")
        if c.get('plan'):
            bits.append(f"10b5-1 plan adopted {md(c['plan_dates'][0])}" if c.get('plan_dates') else '10b5-1 plan')
        bits.append(fresh_s('sale about', c['date'], 'filed', c['filed'], now))
    else:
        verb = 'now holds' if c.get('amend') else 'reports'
        bits = [f"📣 Activist · {sym}", f"{who} {verb} {c['pct']:.1f}%" if c.get('pct') is not None else f'{who} filed']
        if c.get('shares'):
            bits[-1] += f" ({sh_s(c['shares'])} sh)"
        if c.get('prev_pct') is not None and c.get('pct') is not None and abs(c['pct'] - c['prev_pct']) >= 0.05:
            bits.append(f"from {c['prev_pct']:.1f}%")
        bits += [f"{'13D/A' if c.get('amend') else 'new 13D'}", fresh_s('event', c['event'], 'filed', c['filed'], now)]
    return ' · '.join([b for b in bits if b] + tail(c, today))


def detail(c: Dict) -> str:
    if c['kind'] == 'sell':
        return f"<i>{SN.esc((c.get('name') or '')[:40])} · {SN.esc(c['who'])} ({SN.esc(c['role'])}) · {sh_s(c['shares'])} sh{' @ ' + price_s(c['price']) if c.get('price') else ''} · {md(c['date'])}</i>"
    if c['kind'] == 'plan':
        return f"<i>{SN.esc((c.get('name') or '')[:40])} · {SN.esc(c['who'])} · a notice of a proposed sale: it may be smaller, later or never</i>"
    if c['kind'] == 'act':
        why = f" · Item 4: “{SN.esc(c['purpose'])}”" if c.get('purpose') else ''
        return f"<i>{SN.esc((c.get('name') or '')[:40])} · {SN.esc(c['who'])}{why}</i>"
    who = ', '.join(f"{SN.esc(i['name'])} ({SN.esc(short_role(i) if i.get('role') else 'insider')})" for i in c['insiders'][:3])
    more = f" +{len(c['insiders']) - 3}" if len(c['insiders']) > 3 else ''
    span = md(c['first']) if c['first'] == c['last'] else f"{md(c['first'])}–{md(c['last'])}"
    name = SN.esc(c['name'][:40]) if c.get('name') else ''
    return f"<i>{name} · {who}{more} · {span} · score {c['score']:g}</i>"


def buttons_for(cs: Sequence[Dict]) -> List[List[Dict]]:
    """One row per stock (the first four): [📊 SYM] [📑 Fundamentals] [👥 Holders] [🔗 SEC], then the app."""
    rows, seen = [], set()
    for c in cs:
        s = c['sym']
        if s in seen or len(rows) >= 4:
            continue
        seen.add(s)
        r = []
        if c.get('universe') and SN._cb_ok(f'c:{s}'):
            r += [SN.cb(f'📊 {s}', f'c:{s}'), SN.cb('📑 Fundamentals', f'f:{s}')]
            if SN._cb_ok(f'h:{s}'):
                r.append(SN.cb('👥 Holders', f'h:{s}'))
        r.append(SN.button('🔗 SEC' if r else f'🔗 SEC filing · {s}', c['url']))
        rows.append(r)
    rows.append([SN.button('Open insiders', APP)])
    return rows


BUY_KINDS = ('cluster', 'solo', 'early')
FOOT_BUYS = 'SEC Form 4 open-market buys · context, not a signal · not advice'
FOOT_ALL = 'SEC Form 4 / Form 144 / Schedule 13D filings · context, not a signal · not advice'


def build_message(cs: Sequence[Dict], today: dt.date, sample: bool = False, silent: bool = False,
                  now: Optional[dt.datetime] = None) -> Optional[SN.Msg]:
    if not cs:
        return None
    buys = all(c['kind'] in BUY_KINDS for c in cs)
    parts = []
    if sample:
        parts.append('🧪 <b>Sample insider buys</b> · the top clusters of the last 30 days')
    elif len(cs) > 1:
        parts.append(f"🕵️ <b>{len(cs)} new insider {'buys' if buys else 'alerts'}</b>")
    for c in cs:
        parts.append(line(c, today, now) + '\n' + detail(c))
    parts.append(f"<i>{FOOT_BUYS if buys else FOOT_ALL}</i>")
    text = '\n\n'.join(parts)
    while SN.u16(text) > SN.SAFE and len(cs) > 1:
        return build_message(cs[:-1], today, sample, silent, now)
    m = SN.Msg(text, buttons_for(cs), silent=silent)
    m.n_alerts = len(cs)                                 # how many made it into the text (the rest wait for the app)
    return m


def is_new(c: Dict, new_accs: Set[str], now: dt.datetime, hours: float) -> bool:
    lim = (now - dt.timedelta(hours=hours)).strftime('%Y-%m-%dT%H:%M:%SZ')
    if 'insiders' not in c:                              # a sale / planned sale / 13D: one filing
        return c['acc'] in new_accs and (c.get('filed') or '') >= lim
    return any(a in new_accs and (i.get('filed') or '') >= lim for i in c['insiders'] for a in i.get('accs', []))


def to_alert(cls: Sequence[Dict], new_accs: Set[str], alerted: Dict, now: dt.datetime, cfg: Dict = CFG) -> List[Dict]:
    """New clusters / big solo buys at or above the score bar, and early buys (no bar), not sent before (or grown since).
    Give it the clusters first, then the early items: an early buy is dropped when a cluster alert of the same issuer goes
    out in the same run, or when anything was sent for the issuer within the window (the cluster alert follows later as
    others join: it counts as grown)."""
    out: List[Dict] = []
    for c in cls:
        early = c['kind'] == 'early'
        if (not early and c['score'] < cfg['score_bar']) or not is_new(c, new_accs, now, cfg['new_hours']):
            continue
        if early and any(o['cik'] == c['cik'] for o in out):
            continue
        prev = alerted.get(c['cik'])
        if prev and prev.get('last', '') >= (dt.date.fromisoformat(c['last']) - dt.timedelta(days=cfg['window'])).isoformat():
            grew = c['kind'] == 'cluster' and (prev.get('kind') in ('solo', 'early') or c['n'] > int(prev.get('n') or 0))
            if not grew:
                continue
        out.append(c)
    return out


def events_to_alert(items: Sequence[Dict], new_accs: Set[str], alerted: Dict, now: dt.datetime, cfg: Dict = CFG, since: str = '') -> List[Dict]:
    """New big sales, planned sales and 13D filings (read this run, filed within new_hours and after `since`) not sent before."""
    return [c for c in items if c['key'] not in alerted and (c.get('filed') or '') >= since and is_new(c, new_accs, now, cfg['new_hours'])]


RANK = {'cluster': 0, 'solo': 0, 'early': 0, 'act': 1, 'sell': 2, 'plan': 3}


def order_alerts(items: Sequence[Dict]) -> List[Dict]:
    """Buys first (⭐, score, $ as sorted by enrich), then activists, sales, planned sales (biggest $ first)."""
    idx = {id(c): k for k, c in enumerate(items)}
    return sorted(items, key=lambda c: (RANK[c['kind']], idx[id(c)] if RANK[c['kind']] == 0 else -(c.get('value') or 0)))


def guest_message(g: Dict, cs: Sequence[Dict], today: dt.date, now: dt.datetime) -> List:
    import guests as G                                   # noqa: WPS433
    if not G.wants(g, 'stocks'):
        return []
    mu = G.muted(g, now=now)
    mine = [c for c in cs if c['sym'] not in mu]
    m = build_message(mine, today, silent=P.in_quiet(g, now), now=now)
    return [m] if m is not None else []


RAW_DATA = 'https://raw.githubusercontent.com/r4m4nxd/ramanFX/data/public/insiders/latest.json'


def load_published(now: dt.datetime, path: Optional[str] = None, fetch: Optional[Callable[[str], bytes]] = None) -> Optional[Dict]:
    """The published file for other jobs (the morning brief): the data-branch checkout (INSIDERS_DATA_ROOT) when
    present, else raw.githubusercontent.com (data branch), else this checkout. None when missing or older than 4 days."""
    js = load_json(path, None) if path else None
    if js is None and os.path.exists(LATEST) and DATA_ROOT != ROOT:
        js = load_json(LATEST, None)
    if js is None:
        try:
            if fetch is None:
                import urllib.request                      # noqa: WPS433
                fetch = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'RamanFX-brief/1.0'}), timeout=10).read()  # noqa: E731
            js = json.loads(fetch(RAW_DATA))
        except Exception:  # noqa: BLE001
            js = None
    if js is None:
        js = load_json(os.path.join(ROOT, 'public', 'insiders', 'latest.json'), None)
    if not isinstance(js, dict):
        return None
    try:
        t = dt.datetime.strptime(str(js.get('generated'))[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)
    except ValueError:
        return None
    return js if dt.timedelta(hours=-1) <= now - t <= dt.timedelta(days=4) else None


def brief_lines(js: Optional[Dict], today: dt.date, n: int = 3, days: int = 7) -> List[str]:
    """The morning brief's '🕵️ Insider buys': the top n clusters / big solo buys of the last `days`, ⭐ first."""
    cut = (today - dt.timedelta(days=days)).isoformat()
    cs = [c for c in (js or {}).get('clusters') or [] if isinstance(c, dict) and str(c.get('last') or '') >= cut]
    out = []
    for c in cs[:n]:
        try:
            out.append(line(c, today).replace('🕵️ Insider cluster buy · ', '⭐ ' if c.get('star') else '').replace('🕵️ Big solo buy · ', 'solo · ')
                       .replace('🕵️ Insider buy · ', 'early · '))
        except Exception:  # noqa: BLE001
            continue
    if len(cs) > n:
        out.append(f'+{len(cs) - n} more (/insiders)')
    return out


# ---- output -------------------------------------------------------------------------------------------------------
def _clean(c: Dict) -> Dict:
    c = dict(c)
    c['insiders'] = [{k: v for k, v in i.items() if k != 'accs'} for i in c['insiders']]
    return c


def recent_plans(f144: Sequence[Dict], ctx: Context, today: dt.date, cfg: Dict = CFG) -> List[Dict]:
    """The app's Planned sales tab: every Form 144 of a scanner stock in the last `days`, each with `big` (meets the alert rule)."""
    cut = (today - dt.timedelta(days=cfg['days'])).isoformat()
    big = {x['acc'] for x in plan_items(f144, today, cfg, ctx.mcap)}
    out = []
    for r in sorted((x for x in f144 if (x.get('filed') or '')[:10] >= cut), key=lambda x: (x.get('filed') or '', x.get('value') or 0), reverse=True)[:cfg['max_plans']]:
        out.append({'sym': ctx.sym(r['sym']) or r['sym'], 'name': r['name'], 'who': r['seller'], 'role': r.get('rel', ''), 'shares': r.get('shares'),
                    'value': r.get('value'), 'price': r.get('price'), 'date': r.get('date', ''), 'filed': r.get('filed', ''), 'of_mcap': plan_pct(r, ctx.mcap),
                    'plan': bool(r.get('plan')), 'plan_dates': r.get('plan_dates', []), 'big': r['acc'] in big, 'url': r['url']})
    return out


def recent_acts(d13: Sequence[Dict], ctx: Context, today: dt.date, cfg: Dict = CFG) -> List[Dict]:
    """The app's Activists tab: Schedule 13D / 13D/A of the last d13_days on any company (`universe` = a scanner stock)."""
    return [{'sym': ctx.sym(x['sym']) or x['sym'] if x['sym'] else '', 'name': x['name'], 'who': x['who'], 'form': x['form'], 'pct': x['pct'], 'prev_pct': x['prev_pct'],
             'shares': x['shares'], 'event': x['event'], 'purpose': x['purpose'], 'filed': x['filed'], 'universe': bool(x['sym']), 'url': x['url']}
            for x in act_items(d13, today, cfg, universe_only=False)[:cfg['max_acts']]]


def build_latest(now: dt.datetime, st: Dict, cls: Sequence[Dict], ctx: Context, sec: bool, cfg: Dict = CFG) -> Dict:
    today = now.astimezone(NYZ).date()
    days = business_days(today, cfg['days'])
    done = set(st['days_done'])
    return {'version': 1, 'generated': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'source': 'SEC EDGAR Form 4 (open-market buys and sales), Form 144, Schedule 13D', 'sec': sec, 'days': cfg['days'],
            'rules': {k: cfg[k] for k in ('min_n', 'strong_n', 'window', 'solo_min', 'min_value', 'min_price', 'min_mcap', 'score_bar', 'early_top_min',
                                          'early_any_min', 'sell_min', 'sell_pct', 'p144_min', 'p144_pct')},
            'coverage': {'days': len(days), 'done': sum(1 for d in days if d.strftime('%Y%m%d') in done), 'filings': len(st['seen'])},
            'clusters': [_clean(c) for c in cls], 'buys': recent_buys(st['buys'], ctx, today, cfg),
            'sells': recent_sells(st['sells'], ctx, today, cfg), 'plans': recent_plans(st['f144'], ctx, today, cfg),
            'activists': recent_acts(st['d13'], ctx, today, cfg),
            'by_sym': by_symbol(st['buys'], st['sells'], ctx, today, cfg, st['f144'], st['d13']),
            'alerted': {k: v for k, v in st['alerted'].items()}}


def write_latest(js: Dict, path: str = LATEST) -> bool:
    """Write when anything but 'generated' changed (no empty data commits). True when written."""
    old = load_json(path, None)
    if isinstance(old, dict) and {k: v for k, v in old.items() if k != 'generated'} == json.loads(json.dumps({k: v for k, v in js.items() if k != 'generated'})):
        return False
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(js, f, separators=(',', ':'), ensure_ascii=False)
        f.write('\n')
    return True


# ---- run ----------------------------------------------------------------------------------------------------------
def run(now: dt.datetime, get: Optional[Callable[[str], bytes]], sample: bool = False, notify: bool = True,
        prefs: Optional[Dict] = None, feed_s: float = 120, backfill_s: float = 240, state_path: str = STATE,
        latest_path: str = LATEST, ctx: Optional[Context] = None, send: Callable[[List], bool] = SN.send,
        cfg: Dict = CFG) -> Optional[SN.Msg]:
    ctx = ctx or Context()
    st = load_state(state_path)
    prev = load_json(latest_path, {}) or {}
    for k, v in (prev.get('alerted') or {}).items():             # the committed file outlives an evicted cache
        st['alerted'].setdefault(k, v)
    # The first run of a file written by the older job (no 'plans' list yet): sales, Form 144 and 13D filings accepted before it were
    # never alerted and must not flood the first message; only newer ones are. Kept in latest.json as `events_since`.
    since = str(prev.get('events_since') or ('' if not prev or 'plans' in prev else now.strftime('%Y-%m-%dT%H:%M:%SZ')))
    today = now.astimezone(NYZ).date()
    new: Set[str] = set()
    if get is None:
        log('SEC: skipped (no SEC_UA secret and no SEC_CONTACT variable: SEC needs a contact in the User-Agent); '
            'rebuilding from the cache')
    else:
        new, stats = collect(st, get, today, set(ctx.rows), feed_s, backfill_s, cfg['days'], ctx.cik_map())
        log(f"SEC: {stats['feed']} new filing(s) from the latest feeds, {stats['backfill']} from the daily index "
            f"({stats['days_done']} day(s) completed), {stats['buys']} record(s) added (buys, sales, Form 144, 13D)")
    prune(st, today, cfg['days'])
    cls = enrich(find_clusters(st['buys'], today, cfg, ctx.mcap), ctx, cfg)
    early = enrich(find_early(st['buys'], today, cfg, ctx.mcap), ctx, cfg)
    shown = cls + [e for e in early if e['cik'] not in {c['cik'] for c in cls}]
    sells = enrich_events(big_sells(st['sells'], today, cfg, ctx.mcap), ctx, cfg)
    plans = enrich_events(plan_items(st['f144'], today, cfg, ctx.mcap), ctx, cfg)
    acts = enrich_events(act_items(st['d13'], today, cfg), ctx, cfg)
    log(f"{len(cls)} cluster(s) / big solo buys, {len(shown) - len(cls)} early buy(s) in the last {cfg['days']} days, "
        f"{sum(1 for c in cls if c['star'])} ⭐, {sum(1 for c in cls if c['strong'])} strong; "
        f"{len(sells)} big sale(s), {len(plans)} big planned sale(s), {len(acts)} 13D filing(s) of scanner stocks")
    msg = None
    if sample:
        msg = build_message(cls[:5], today, sample=True, now=now)
        if msg is None:
            msg = SN.Msg('🧪 <b>Sample insider buys</b>\nNo insider cluster buys in the data yet (the 30-day backfill '
                         'fills in over the first runs).', [[SN.button('Open insiders', APP)]])
        if notify:
            log('sample ' + ('sent' if send([msg]) else 'NOT sent'))
        else:
            print(msg)
    else:
        day = now.astimezone(CAL).date().isoformat()
        left = max(0, cfg['max_per_day'] - int(st['sent_day'].get(day, 0)))
        muted = P.muted_set(prefs, now)
        found = to_alert(cls + early, new, st['alerted'], now, cfg) + events_to_alert(sells + plans + acts, new, st['alerted'], now, cfg, since)
        cand = [c for c in order_alerts(found) if c['sym'] not in muted]
        if len(cand) > left:
            log(f'{len(cand) - left} alert(s) over the daily cap ({cfg["max_per_day"]}): app only')
        cand = cand[:left]
        msg = build_message(cand, today, silent=P.in_quiet(prefs, now), now=now)
        if msg is not None:
            cand = cand[:getattr(msg, 'n_alerts', len(cand))]
            ok = send([msg]) if notify else (print(msg) or True)
            log(f'{len(cand)} alert(s) ' + ('sent' if ok else 'NOT sent') + ('' if notify else ' (dry run: alert state untouched)'))
            if ok and notify:
                at = now.strftime('%Y-%m-%dT%H:%M:%SZ')
                for c in cand:
                    if c['kind'] in BUY_KINDS:
                        st['alerted'][c['cik']] = {'n': c['n'], 'kind': c['kind'], 'last': c['last'], 'at': at}
                    else:
                        st['alerted'][c['key']] = {'kind': c['kind'], 'sym': c['sym'], 'at': at}
                st['sent_day'][day] = int(st['sent_day'].get(day, 0)) + len(cand)
                try:
                    import guests as G                       # noqa: WPS433
                    G.broadcast(lambda g: guest_message(g, cand, today, now), prefs, log=log, what='insider alerts')
                except Exception as e:  # noqa: BLE001
                    log(f'guests: insider alerts skipped ({type(e).__name__})')
        else:
            log('no new insider alert at or above the bars: no message')
    save_state(st, state_path)
    js = build_latest(now, st, shown, ctx, get is not None, cfg)
    if since:
        js['events_since'] = since
    wrote = write_latest(js, latest_path)
    log('public/insiders/latest.json ' + ('written' if wrote else 'unchanged'))
    return msg


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--sample', action='store_true', help="send ONE '🧪 Sample insider buys' message (top clusters), no alerts")
    ap.add_argument('--no-notify', action='store_true', help='a dry run: print the message instead of sending it, alert state untouched')
    ap.add_argument('--backfill-min', type=float, default=4.0, help='minutes for the daily-index backfill (default 4)')
    ap.add_argument('--now', default='', help='pretend it is this UTC time (ISO)')
    a = ap.parse_args(argv)
    now = dt.datetime.fromisoformat(a.now.replace('Z', '+00:00')) if a.now else dt.datetime.now(UTC)
    if now.tzinfo is None:
        now = now.replace(tzinfo=UTC)
    ua = user_agent()
    prefs = None if a.sample else P.fetch(log=log)
    run(now, http_getter(ua) if ua else None, sample=a.sample, notify=not a.no_notify, prefs=prefs,
        backfill_s=max(0.0, a.backfill_min) * 60)
    return 0


if __name__ == '__main__':
    sys.exit(main())
