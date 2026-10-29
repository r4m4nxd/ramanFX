"""Insider cluster buys: SEC EDGAR Form 4 open-market purchases (code P) by several insiders of the same company, or one
big CEO / CFO buy, with the stock scanner's zone context. Official, free data; no third-party insider sites.

Data (www.sec.gov, a User-Agent with a contact as SEC requires, <= 8 requests a second, the scanner's paced
data.http_get with its circuit breaker):
    latest filings   the "latest filings" Atom feed, type 4 (cgi-bin/browse-edgar?action=getcurrent&type=4&output=atom),
                     newest first, 100 a page, paged until a page holds nothing new (max FEED_PAGES)
    backfill         the daily form index (Archives/edgar/daily-index/<y>/QTR<q>/form.<yyyymmdd>.idx), Form 4 and 4/A
                     lines, newest day first, for the last DAYS calendar days, within a per-run time budget (a day is
                     'done' once every filing of it was read; the first runs fill the 30 days step by step)
    each filing      the full submission text (Archives/edgar/data/<cik>/<acc>/<acc>.txt): ACCEPTANCE-DATETIME + the
                     ownershipDocument XML (form4.py)
User-Agent: env SEC_UA (GitHub secret, as used as-is by tools/stock_scanner) first, else env SEC_CONTACT (repository
variable, tools/fundamentals/sec_stocks.py) as 'RamanFX insiders <contact>'; neither -> nothing is requested from SEC
(one log line) and the published file is rebuilt from the cache. The UA is never printed.

Rules (env overrides in brackets):
    qualifying buy   one filing's P rows summed (one insider per filing), value >= $10k [INSIDERS_MIN_VALUE], price
                     >= $2 [INSIDERS_MIN_PRICE], market cap >= $50M when known [INSIDERS_MIN_MCAP]; a 4/A replaces the
                     original's rows of the same owner and trade date
    cluster          >= 2 [INSIDERS_MIN_N] distinct insiders buying the same issuer within 14 days [INSIDERS_WINDOW];
                     >= 3 [INSIDERS_STRONG_N] = strong
    big solo buy     no cluster, but one CEO / CFO filing >= $250k [INSIDERS_SOLO_MIN]
    repeat buyer     the same insider bought on two or more filings with different trade dates in the 30 days
Score (simple, additive; documented in the app and the guide):
    size             solo 1 · 2 insiders 2 · 3 insiders 3.5 · 4+ 4.5
    roles            CEO or CFO among the buyers +2 (both +3); another top officer (President / COO / Chair) +0.5
    $ vs market cap  >= 0.5% +2 · >= 0.1% +1.5 · >= 0.02% +0.5; market cap unknown: >= $5M +1.5 · >= $1M +1 · >= $250k +0.5
    holdings         the biggest holdings increase >= 50% (or a new position) +1.5 · >= 20% +1 · >= 5% +0.5
    zone             price inside a W1 / MN / 3M demand zone of the scanner +2 · within 5% above one +1
    repeat buyer     +0.5
    ⭐               strong cluster (3+) AND inside / near a W1 or MN demand zone
Telegram: only NEW clusters / big solo buys (a buy first read this run, filed within NEW_HOURS) with score >= 5
[INSIDERS_SCORE_BAR]; re-sent only when the cluster grows; at most 6 a Calgary day [INSIDERS_MAX_PER_DAY]; several in ONE
message; owner mutes, quiet hours silent; the bot's guests who have stocks on (tools/stock_scanner/guests.py).

Output public/insiders/latest.json on the `data` branch (INSIDERS_DATA_ROOT; the app's /insiders page, the bot's /insiders, /fund and zone lines, the morning
brief): the clusters of the last 30 days, the recent qualifying buys, a per-ticker 30-day buys / sells summary.
State tools/insiders/.cache/state.json (actions cache): seen accession numbers, parsed buys / sells, days done, alerts.

    python tools/insiders/insiders.py                 # the scheduled run
    python tools/insiders/insiders.py --sample        # ONE '🧪 Sample insider buys' message (top clusters), no alerts
    python tools/insiders/insiders.py --no-notify     # print instead of sending
    python tools/insiders/insiders.py --backfill-min 50   # a longer backfill (one-time fill of the 30 days)
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Dict, Iterable, List, Optional, Sequence, Set, Tuple
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SCANNER = os.path.join(ROOT, 'tools', 'stock_scanner')
for p in (HERE, SCANNER):
    if p not in sys.path:
        sys.path.insert(0, p)

import form4 as F  # noqa: E402
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
SCAN_DIR = _data_path('public', 'scanner')
FUND = _data_path('public', 'fundamentals', 'stocks.json')
APP = os.environ.get('INSIDERS_APP_URL', 'https://raman-fx.vercel.app/insiders')

FEED = ('https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&company=&dateb=&owner=include'
        '&start={start}&count=100&output=atom')
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
       'new_hours': _env('INSIDERS_NEW_HOURS', 36), 'near_pct': 5.0, 'recent_days': 14, 'max_buys': 300}


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
    """Atom entries -> [{acc, cik, form, updated}], one per accession (the feed lists a filing for the issuer AND each
    reporting owner)."""
    out: Dict[str, Dict] = {}
    for e in _ENTRY.findall(text):
        acc = re.search(r'accession-number=([\d-]{20})', e)
        link = re.search(r'/Archives/edgar/data/(\d+)/', e)
        form = re.search(r'term="([^"]+)"', e)
        upd = re.search(r'<updated>([^<]+)</updated>', e)
        if not acc or not link:
            continue
        f = (form.group(1) if form else '4').strip()
        if f not in ('4', '4/A'):
            continue
        out.setdefault(acc.group(1), {'acc': acc.group(1), 'cik': link.group(1), 'form': f, 'updated': upd.group(1) if upd else ''})
    return list(out.values())


_IDX = re.compile(r'^(4(?:/A)?)\s+.+?\s+(\d{1,10})\s+(\d{8})\s+(edgar/data/\d+/([\d-]{20})\.txt)\s*$')


def parse_daily_index(text: str) -> List[Dict]:
    out: Dict[str, Dict] = {}
    for line in text.splitlines():
        m = _IDX.match(line)
        if m:
            out.setdefault(m.group(5), {'acc': m.group(5), 'cik': m.group(2), 'form': m.group(1), 'day': m.group(3)})
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


def ingest(st: Dict, ref: Dict, raw: bytes, universe: Set[str]) -> int:
    """Parse one filing into the state; returns the number of buy records added."""
    try:
        doc = F.parse_submission(raw)
    except Exception:  # noqa: BLE001  (malformed XML: skip that filing)
        return 0
    if doc.get('form') not in ('4', '4/A'):
        return 0
    recs = records_of(doc, ref)
    if doc.get('form') == '4/A' and not recs:
        amend_without_trades(st['buys'], doc)
    n = 0
    for r in recs:
        if r['code'] == 'P':
            n += add_record(st['buys'], r)
        elif r['sym'] in universe or alt_sym(r['sym']) in universe:
            add_record(st['sells'], r)
    return n


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
    for k, d in (('seen', {}), ('buys', []), ('sells', []), ('days_done', []), ('alerted', {}), ('sent_day', {})):
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


def read_feed(get: Callable[[str], bytes], seen: Dict[str, str], pages: int = FEED_PAGES) -> List[Dict]:
    refs: List[Dict] = []
    have: Set[str] = set()
    for p in range(pages):
        try:
            text = get(FEED.format(start=p * 100)).decode('utf-8', 'replace')
        except Exception as e:  # noqa: BLE001
            log(f'latest-filings feed page {p + 1}: not read ({type(e).__name__})')
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


def process(st: Dict, pairs: Iterable[Tuple[Dict, Optional[bytes]]], universe: Set[str], new: Set[str], fresh: bool) -> Tuple[int, int]:
    """Ingest fetched filings; mark them seen. Returns (read, buys added)."""
    read = buys = 0
    for ref, raw in pairs:
        if raw is None:
            continue
        read += 1
        day = (ref.get('day') or (ref.get('updated') or '')[:10].replace('-', '') or time.strftime('%Y%m%d'))
        st['seen'][ref['acc']] = day
        k = ingest(st, ref, raw, universe)
        buys += k
        if k and fresh is not None:
            new.add(ref['acc'])
    return read, buys


def collect(st: Dict, get: Callable[[str], bytes], today: dt.date, universe: Set[str], feed_s: float, backfill_s: float,
            days: int) -> Tuple[Set[str], Dict]:
    """Latest feed first, then the daily-index backfill. Returns (accessions read this run that added buys, stats)."""
    new: Set[str] = set()
    stats = {'feed': 0, 'backfill': 0, 'buys': 0, 'days_done': 0}
    t0 = time.time()
    refs = read_feed(get, st['seen'])
    r, b = process(st, fetch_many(refs, get, t0 + feed_s), universe, new, True)
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
        todo = [x for x in idx if x['acc'] not in st['seen']]
        r, b = process(st, fetch_many(todo, get, deadline), universe, new, True)
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

    def __init__(self, scan_dir: str = SCAN_DIR, fund_path: str = FUND):
        self.scan_dir = scan_dir
        idx = load_json(os.path.join(scan_dir, 'index.json'), {}) or {}
        self.rows = {str(t.get('s')).upper(): t for t in idx.get('tickers') or [] if t.get('s')}
        self.fund = (load_json(fund_path, {}) or {}).get('stocks') or {}
        self._shards: Dict[int, Dict] = {}

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
                          'director': b['director'], 'ten': b['ten'], 'value': 0.0, 'shares': 0.0, 'date': b['date'],
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
            'insiders': [{k: v for k, v in i.items() if k not in ('ceo', 'cfo', 'officer', 'director', 'ten')} for i in ins]}


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
    if c['kind'] == 'solo':
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


def enrich(cls: List[Dict], ctx: Context, cfg: Dict = CFG) -> List[Dict]:
    """Scanner zone context, trend, signal, fundamentals, score and ⭐ for each cluster; best first (⭐, score, $)."""
    for c in cls:
        s = ctx.sym(c['sym'])
        c['universe'] = bool(s)
        zone = None
        if s:
            c['sym'] = s
            d = ctx.detail(s)
            row = ctx.rows.get(s) or {}
            px = d.get('price') if isinstance(d.get('price'), (int, float)) else row.get('px')
            if isinstance(px, (int, float)):
                c['px'] = px
            zone = zone_at(c.get('px'), d.get('zones') or [], cfg['near_pct'])
            trend = [f"{t} {str(d.get(k)).lower()}" for t, k in (('W1', 'w1'), ('MN', 'mn')) if d.get(k) and d.get(k) != 'n/a']
            if trend:
                c['trend'] = ' · '.join(trend)
            if d.get('signal'):
                c['signal'] = str(d['signal'])
            f = ctx.fund.get(s) or {}
            for k in ('pe', 'rev_g', 'de', 'mcap', 'er_next', 'er_kind'):
                if f.get(k) is not None:
                    c[k] = f[k]
        c['zone'] = zone
        c['score'], c['why'] = score(c, c.get('mcap'), zone)
        c['star'] = bool(c['strong'] and zone and zone['tf'] in ('W1', 'MN'))
    cls.sort(key=lambda c: (not c['star'], -c['score'], -(c['value'] or 0)))
    return cls


# ---- per-ticker summary / recent buys -----------------------------------------------------------------------------
def by_symbol(buys: Sequence[Dict], sells: Sequence[Dict], ctx: Context, today: dt.date, cfg: Dict = CFG) -> Dict[str, Dict]:
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


def line(c: Dict, today: Optional[dt.date] = None) -> str:
    """'🕵️ Insider cluster buy · XYZ $12.40 · 3 insiders · $2.1M · CEO +18% holdings · ⭐ inside W1 demand 11.9–12.6 ·
    P/E 9 · earnings Nov 12' (HTML)."""
    head = 'Insider cluster buy' if c['kind'] == 'cluster' else 'Big solo buy'
    bits = [f"{'🕵️'} {head} · <b>{SN.esc(c['sym'] or c['name'])}</b> {price_s(c.get('px') or c.get('price'))}"]
    bits.append(f"{c['n']} insiders" if c['kind'] == 'cluster' else '1 insider')
    bits.append(money(c['value']))
    h = holdings_s(c['lead'])
    bits.append(SN.esc(f"{c['lead']['role']} {h}".strip()))
    if c.get('repeat'):
        bits.append('repeat buyer')
    z = zone_s(c.get('zone'), c.get('star', False))
    if z:
        bits.append(SN.esc(z))
    if isinstance(c.get('pe'), (int, float)) and c['pe'] > 0:
        bits.append(f"P/E {c['pe']:.0f}")
    er = c.get('er_next')
    if er and today and 0 <= (dt.date.fromisoformat(er) - today).days <= 45:
        bits.append(f"earnings {md(er)}{'?' if c.get('er_kind') == 'estimated' else ''}")
    return ' · '.join(bits)


def detail(c: Dict) -> str:
    who = ', '.join(f"{SN.esc(i['name'])} ({SN.esc(short_role(i) if i.get('role') else 'insider')})" for i in c['insiders'][:3])
    more = f" +{len(c['insiders']) - 3}" if len(c['insiders']) > 3 else ''
    span = md(c['first']) if c['first'] == c['last'] else f"{md(c['first'])}–{md(c['last'])}"
    name = SN.esc(c['name'][:40]) if c.get('name') else ''
    return f"<i>{name} · {who}{more} · {span} · score {c['score']:g}</i>"


def buttons_for(cs: Sequence[Dict]) -> List[List[Dict]]:
    rows = []
    for c in cs[:6]:
        r = []
        s = c['sym']
        if c.get('universe') and SN._cb_ok(f'c:{s}'):
            r += [SN.cb(f'📊 {s}', f'c:{s}'), SN.cb('📑 Fundamentals', f'f:{s}')]
        r.append(SN.button(f"🔗 SEC filing{'' if r else ' · ' + s}", c['url']))
        rows.append(r)
    rows.append([SN.button('Open insiders', APP)])
    return rows


def build_message(cs: Sequence[Dict], today: dt.date, sample: bool = False, silent: bool = False) -> Optional[SN.Msg]:
    if not cs:
        return None
    parts = []
    if sample:
        parts.append('🧪 <b>Sample insider buys</b> · the top clusters of the last 30 days')
    elif len(cs) > 1:
        parts.append(f'🕵️ <b>{len(cs)} new insider buys</b>')
    for c in cs:
        parts.append(line(c, today) + '\n' + detail(c))
    parts.append('<i>SEC Form 4 open-market buys · context, not a signal · not advice</i>')
    text = '\n\n'.join(parts)
    while SN.u16(text) > SN.SAFE and len(cs) > 1:
        return build_message(cs[:-1], today, sample, silent)
    return SN.Msg(text, buttons_for(cs), silent=silent)


def is_new(c: Dict, new_accs: Set[str], now: dt.datetime, hours: float) -> bool:
    lim = (now - dt.timedelta(hours=hours)).strftime('%Y-%m-%dT%H:%M:%SZ')
    return any(a in new_accs and (i.get('filed') or '') >= lim for i in c['insiders'] for a in i.get('accs', []))


def to_alert(cls: Sequence[Dict], new_accs: Set[str], alerted: Dict, now: dt.datetime, cfg: Dict = CFG) -> List[Dict]:
    """New clusters / big solo buys at or above the score bar, not sent before (or grown since)."""
    out = []
    for c in cls:
        if c['score'] < cfg['score_bar'] or not is_new(c, new_accs, now, cfg['new_hours']):
            continue
        prev = alerted.get(c['cik'])
        if prev and prev.get('last', '') >= (dt.date.fromisoformat(c['last']) - dt.timedelta(days=cfg['window'])).isoformat():
            grew = c['kind'] == 'cluster' and (prev.get('kind') == 'solo' or c['n'] > int(prev.get('n') or 0))
            if not grew:
                continue
        out.append(c)
    return out


def guest_message(g: Dict, cs: Sequence[Dict], today: dt.date, now: dt.datetime) -> List:
    import guests as G                                   # noqa: WPS433
    if not G.wants(g, 'stocks'):
        return []
    mu = G.muted(g, now=now)
    mine = [c for c in cs if c['sym'] not in mu]
    m = build_message(mine, today, silent=P.in_quiet(g, now))
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
            out.append(line(c, today).replace('🕵️ Insider cluster buy · ', '⭐ ' if c.get('star') else '').replace('🕵️ Big solo buy · ', 'solo · '))
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


def build_latest(now: dt.datetime, st: Dict, cls: Sequence[Dict], ctx: Context, sec: bool, cfg: Dict = CFG) -> Dict:
    today = now.astimezone(NYZ).date()
    days = business_days(today, cfg['days'])
    done = set(st['days_done'])
    return {'version': 1, 'generated': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'source': 'SEC EDGAR Form 4 (open-market purchases, code P)',
            'sec': sec, 'days': cfg['days'],
            'rules': {k: cfg[k] for k in ('min_n', 'strong_n', 'window', 'solo_min', 'min_value', 'min_price', 'min_mcap', 'score_bar')},
            'coverage': {'days': len(days), 'done': sum(1 for d in days if d.strftime('%Y%m%d') in done), 'filings': len(st['seen'])},
            'clusters': [_clean(c) for c in cls], 'buys': recent_buys(st['buys'], ctx, today, cfg),
            'by_sym': by_symbol(st['buys'], st['sells'], ctx, today, cfg),
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
    today = now.astimezone(NYZ).date()
    new: Set[str] = set()
    if get is None:
        log('SEC: skipped (no SEC_UA secret and no SEC_CONTACT variable: SEC needs a contact in the User-Agent); '
            'rebuilding from the cache')
    else:
        new, stats = collect(st, get, today, set(ctx.rows), feed_s, backfill_s, cfg['days'])
        log(f"SEC: {stats['feed']} new filing(s) from the latest feed, {stats['backfill']} from the daily index "
            f"({stats['days_done']} day(s) completed), {stats['buys']} purchase record(s) added")
    prune(st, today, cfg['days'])
    cls = enrich(find_clusters(st['buys'], today, cfg, ctx.mcap), ctx, cfg)
    log(f"{len(cls)} cluster(s) / big solo buys in the last {cfg['days']} days, "
        f"{sum(1 for c in cls if c['star'])} ⭐, {sum(1 for c in cls if c['strong'])} strong")
    msg = None
    if sample:
        msg = build_message(cls[:5], today, sample=True)
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
        cand = [c for c in to_alert(cls, new, st['alerted'], now, cfg) if c['sym'] not in muted]
        if len(cand) > left:
            log(f'{len(cand) - left} alert(s) over the daily cap ({cfg["max_per_day"]}): app only')
        cand = cand[:left]
        msg = build_message(cand, today, silent=P.in_quiet(prefs, now))
        if msg is not None:
            ok = send([msg]) if notify else (print(msg) or True)
            log(f'{len(cand)} alert(s) ' + ('sent' if ok else 'NOT sent'))
            if ok:
                for c in cand:
                    st['alerted'][c['cik']] = {'n': c['n'], 'kind': c['kind'], 'last': c['last'], 'at': now.strftime('%Y-%m-%dT%H:%M:%SZ')}
                st['sent_day'][day] = int(st['sent_day'].get(day, 0)) + len(cand)
                if notify:
                    try:
                        import guests as G                   # noqa: WPS433
                        G.broadcast(lambda g: guest_message(g, cand, today, now), prefs, log=log, what='insider buys')
                    except Exception as e:  # noqa: BLE001
                        log(f'guests: insider buys skipped ({type(e).__name__})')
        else:
            log('no new insider cluster at or above the score bar: no message')
    save_state(st, state_path)
    wrote = write_latest(build_latest(now, st, cls, ctx, get is not None, cfg), latest_path)
    log('public/insiders/latest.json ' + ('written' if wrote else 'unchanged'))
    return msg


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--sample', action='store_true', help="send ONE '🧪 Sample insider buys' message (top clusters), no alerts")
    ap.add_argument('--no-notify', action='store_true', help='print the message instead of sending it')
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
