"""Who owns a stock, for the ~1000 scanner stocks, from SEC EDGAR only (official, free): the stock page's Holders card and the
Telegram bot's /holders. Never an alert source (the alerts are tools/insiders/insiders.py); index funds are tagged, not alerted on.

Per stock (public/holders/t/<first letter>.json on the `data` branch, ~27 shards, plus public/holders/index.json):
    h5    5%+ holders: the latest Schedule 13D / 13G (SC 13D / 13G before Dec 2024, SCHEDULE 13D / 13G since) of each filer
          on the company, with percent of class, shares, event date and the change vs that filer's previous filing; filers whose
          latest filing is under 5% (an exit) are listed apart (h5x)
    ins   insiders and 10% owners: shares owned after each person's last Form 4 (sharesOwnedFollowingTransaction, equity lines
          summed) as % of the shares outstanding, with the last move and its date; from the Form 4s filed in the last
          HOLDERS_F4_DAYS (the daily form index, scanner companies only)
    f13   the top 10 institutions of the latest quarter's 13F data set with % of shares outstanding and the change vs the
          quarter before (new / add / cut / same; exited), index funds marked (f13.py); the card says the quarter and the
          45-day filing lag
    so    shares outstanding (SEC XBRL dei:EntityCommonStockSharesOutstanding, all classes summed), refreshed weekly
Data: www.sec.gov and data.sec.gov (a User-Agent with a contact as SEC requires: env SEC_UA, else SEC_CONTACT as
'RamanFX holders <contact>'; neither -> nothing is requested and the published files stay as they are; never printed),
<= 8 requests a second through the scanner's paced data.http_get with its circuit breaker, one host at a time;
OpenFIGI's free tier for CUSIP -> ticker (f13.py). Time budgets per phase [HOLDERS_SO_MIN 6, HOLDERS_G13_MIN 20, HOLDERS_F4_MIN 15]: the first runs fill the history step
by step (everything fetched is cached by accession).
Refresh: daily (the workflow; the 13F data-set page is checked once a week, HOLDERS_F13_EVERY days, or with --f13), so 13D /
13G / Form 4 holdings are at most a day behind (the alerts and the 30-day events come from the 10-minute insiders job).

    python tools/holders/holders.py             # the scheduled run
    python tools/holders/holders.py --f13       # check the 13F data sets now
    python tools/holders/holders.py --no-sec    # rebuild the files from the cache only
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import tempfile
import time
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, Dict, List, Optional, Sequence, Set, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
for p in (HERE, os.path.join(ROOT, 'tools', 'insiders'), os.path.join(ROOT, 'tools', 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import f13 as T  # noqa: E402
import form4 as F  # noqa: E402
import insiders as I  # noqa: E402  (Context, user_agent, http_getter, fetch_many ...)
import sched13 as S13  # noqa: E402

UTC = dt.timezone.utc
NYZ = I.NYZ
CACHE = os.environ.get('HOLDERS_CACHE') or os.path.join(HERE, '.cache')
STATE = os.path.join(CACHE, 'state.json')
DATA_ROOT = I.DATA_ROOT
OUT = os.path.join(DATA_ROOT, 'public', 'holders')
SUBS = 'https://data.sec.gov/submissions/CIK{cik}.json'
CONCEPT = 'https://data.sec.gov/api/xbrl/companyconcept/CIK{cik}/dei/EntityCommonStockSharesOutstanding.json'
G13_FORMS = ('SCHEDULE 13D', 'SCHEDULE 13D/A', 'SCHEDULE 13G', 'SCHEDULE 13G/A', 'SC 13D', 'SC 13D/A', 'SC 13G', 'SC 13G/A')
F4_FORMS = ('4', '4/A')
WORKERS = 8
SEC_PAUSE = 0.125                                    # 8 requests a second (SEC allows 10); one SEC host at a time


def _env(k: str, d: float) -> float:
    try:
        return float(os.environ.get(k) or d)
    except ValueError:
        return d


CFG = {'so_min': _env('HOLDERS_SO_MIN', 6), 'g13_min': _env('HOLDERS_G13_MIN', 20), 'f4_min': _env('HOLDERS_F4_MIN', 15),
       'g13_years': _env('HOLDERS_G13_YEARS', 3), 'g13_max': int(_env('HOLDERS_G13_MAX', 30)),
       'g13_index_days': int(_env('HOLDERS_G13_INDEX_DAYS', 14)), 'f4_days': int(_env('HOLDERS_F4_DAYS', 180)),
       'f13_every': _env('HOLDERS_F13_EVERY', 6), 'so_days': 7, 'h5_n': 8, 'h5x_n': 2, 'ins_n': 8, 'exit_days': 400, 'figi_requests': int(_env('HOLDERS_FIGI_REQUESTS', 150))}


def log(*a) -> None:
    print(*a, flush=True)


# ---- state --------------------------------------------------------------------------------------------------------------
def load_state(path: str = STATE) -> Dict:
    st = I.load_json(path, {}) or {}
    for k, d in (('so', {}), ('g13', {}), ('g13_idx', {}), ('g13_days', []), ('f4_seen', {}), ('f4_holds', {}), ('f4_days', []), ('f13', {})):
        st.setdefault(k, d)
    return st


def save_state(st: Dict, path: str = STATE) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(st, f, separators=(',', ':'))
    os.replace(tmp, path)


def prune(st: Dict, today: dt.date) -> None:
    cut = (today - dt.timedelta(days=CFG['f4_days'] + 30)).strftime('%Y%m%d')
    st['f4_seen'] = {a: d for a, d in st['f4_seen'].items() if d >= cut}
    st['f4_days'] = sorted(d for d in st['f4_days'] if d >= cut)
    st['f4_holds'] = {k: v for k, v in st['f4_holds'].items() if (v.get('d') or '') >= (today - dt.timedelta(days=CFG['f4_days'] + 30)).isoformat()}
    gcut = (today - dt.timedelta(days=int(CFG['g13_years'] * 366) + 60)).isoformat()
    st['g13'] = {a: r for a, r in st['g13'].items() if (r.get('filed') or '9999')[:10] >= gcut}
    st['g13_days'] = sorted(d for d in st['g13_days'] if d >= cut)


# ---- universe -----------------------------------------------------------------------------------------------------------
def universe(ctx: 'I.Context') -> List[Dict]:
    """[{s, n, cik}] for every scanner stock (public/scanner/index.json); cik '' when unknown (no SEC data for it)."""
    sym_cik: Dict[str, str] = {}
    for cik, sym in ctx.cik_map().items():
        sym_cik.setdefault(sym, cik)
    return [{'s': s, 'n': str(r.get('n') or ''), 'cik': sym_cik.get(s, '')} for s, r in sorted(ctx.rows.items())]


def shard_of(sym: str) -> str:
    """The shard file a symbol lives in: its first letter, '_' for anything else (the app and the bot use the same rule)."""
    c = (sym or '')[:1].upper()
    return c if 'A' <= c <= 'Z' else '_'


# ---- shares outstanding -------------------------------------------------------------------------------------------------
def parse_shares(js: Dict) -> Optional[Dict]:
    """companyconcept answer -> {so, end, n}: the latest cover-page figure (dei:EntityCommonStockSharesOutstanding), the values of
    all share classes reported in that one filing summed."""
    rows = [r for r in ((js.get('units') or {}).get('shares') or []) if isinstance(r.get('val'), (int, float)) and r.get('val') > 0 and r.get('end')]
    if not rows:
        return None
    last = max(rows, key=lambda r: (r['end'], r.get('filed', '')))
    same = [r for r in rows if r.get('accn') == last.get('accn') and r['end'] == last['end']] or [last]
    return {'so': float(sum(r['val'] for r in same)), 'end': last['end'], 'n': len(same)}


def phase_shares(st: Dict, uni: Sequence[Dict], get: Callable[[str], bytes], deadline: float, now: float) -> int:
    todo = [u for u in uni if u['cik'] and now - (st['so'].get(u['cik']) or {}).get('at', 0) > CFG['so_days'] * 86400]
    todo.sort(key=lambda u: (st['so'].get(u['cik']) or {}).get('at', 0))

    def one(u):
        if time.time() > deadline:
            return u, None
        try:
            return u, parse_shares(json.loads(get(CONCEPT.format(cik=u['cik'].zfill(10)))))
        except Exception as e:  # noqa: BLE001  (404: no cover-page figure for it)
            return u, False if getattr(e, 'code', None) == 404 else None
    n = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for u, r in ex.map(one, todo):
            if r is None:
                continue
            st['so'][u['cik']] = dict(r or {}, at=now)
            n += 1
    return n


# ---- Schedule 13D / 13G ---------------------------------------------------------------------------------------------------
_IDX = re.compile(r'^(4(?:/A)?|SCHEDULE 13[DG](?:/A)?|SC 13[DG](?:/A)?)\s+.+?\s+(\d{1,10})\s+(\d{8})\s+(edgar/data/\d+/([\d-]{20})\.txt)\s*$')


def parse_index(text: str, forms: Sequence[str]) -> List[Dict]:
    """The daily form index -> one ref per accession of the wanted forms ({acc, cik, ciks, form, day})."""
    out: Dict[str, Dict] = {}
    for line in text.splitlines():
        m = _IDX.match(line)
        if m and m.group(1) in forms:
            r = out.setdefault(m.group(5), {'acc': m.group(5), 'cik': m.group(2), 'ciks': [], 'form': m.group(1), 'day': m.group(3)})
            if m.group(2) not in r['ciks']:
                r['ciks'].append(m.group(2))
    return list(out.values())


def submissions_refs(js: Dict, since: str) -> List[Dict]:
    """The Schedule 13D / 13G filings of a company's submissions answer (data.sec.gov/submissions/CIK##########.json) filed on or
    after `since` (YYYY-MM-DD): [{acc, cik, form, day, filed}]."""
    rec = (js.get('filings') or {}).get('recent') or {}
    cik = str(js.get('cik') or '').lstrip('0')
    out = []
    for i, form in enumerate(rec.get('form') or []):
        d = (rec.get('filingDate') or [''] * (i + 1))[i]
        acc = (rec.get('accessionNumber') or [''] * (i + 1))[i]
        if form in G13_FORMS and d >= since and acc:
            out.append({'acc': acc, 'cik': cik, 'ciks': [cik], 'form': form, 'day': d.replace('-', ''), 'filed': d})
    return out


def phase_g13(st: Dict, uni: Sequence[Dict], get: Callable[[str], bytes], today: dt.date, deadline: float, now: float) -> Dict[str, int]:
    """Schedule 13D / 13G of the scanner stocks into st['g13'] ({accession: record}): the issuers' submissions lists (daily), the
    daily form index of the last g13_index_days (a safety net), then every new filing read and parsed (newest first, at most
    g13_max per company within g13_years)."""
    ciks = {u['cik']: u['s'] for u in uni if u['cik']}
    since = (today - dt.timedelta(days=int(CFG['g13_years'] * 366))).isoformat()
    refs: Dict[str, Dict] = {}
    stats = {'issuers': 0, 'index_days': 0, 'new': 0, 'parsed': 0}

    def sub(cik):
        if time.time() > deadline:
            return cik, None
        try:
            return cik, json.loads(get(SUBS.format(cik=cik.zfill(10))))
        except Exception:  # noqa: BLE001
            return cik, None
    due = [c for c in ciks if now - (st['g13_idx'].get(c) or {}).get('at', 0) > 20 * 3600]
    due.sort(key=lambda c: (st['g13_idx'].get(c) or {}).get('at', 0))
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        for cik, js in ex.map(sub, due):
            if js is None:
                continue
            rs = submissions_refs(js, since)
            st['g13_idx'][cik] = {'at': now, 'accs': [[r['acc'], r['form'], r['filed']] for r in rs]}
            stats['issuers'] += 1
    for cik, e in st['g13_idx'].items():
        if cik in ciks:
            for acc, form, filed in e.get('accs', []):
                refs[acc] = {'acc': acc, 'cik': cik, 'ciks': [cik], 'form': form, 'day': filed.replace('-', ''), 'filed': filed}
    for k in range(1, CFG['g13_index_days'] + 1):                               # the daily index: filings the lists above may lag
        d = today - dt.timedelta(days=k)
        key = d.strftime('%Y%m%d')
        if d.weekday() >= 5 or key in st['g13_days'] or time.time() > deadline:
            continue
        try:
            idx = parse_index(get(I.daily_url(d)).decode('latin-1'), G13_FORMS)
        except Exception as e:  # noqa: BLE001
            if getattr(e, 'code', None) == 404 and k > 1:
                st['g13_days'].append(key)
            continue
        for r in idx:
            hit = next((c for c in r['ciks'] if c.lstrip('0') in ciks), None)
            if hit:
                refs.setdefault(r['acc'], dict(r, cik=hit.lstrip('0'), filed=d.isoformat()))
        st['g13_days'].append(key)
        stats['index_days'] += 1
    per: Dict[str, int] = {}
    todo = []
    for r in sorted(refs.values(), key=lambda r: r['filed'], reverse=True):
        if r['acc'] in st['g13']:
            continue
        per[r['cik']] = per.get(r['cik'], 0) + 1
        if per[r['cik']] <= CFG['g13_max']:
            todo.append(r)
    stats['new'] = len(todo)
    for ref, raw in I.fetch_many(todo, get, deadline):
        if raw is None:
            continue
        try:
            doc = S13.parse_submission(raw)
            rec = S13.record(doc, ref, I.index_url(ref['cik'], ref['acc']), I.accepted_utc(doc.get('accepted') or '') or ref['filed'] + 'T00:00:00Z',
                             ciks.get(ref['cik'], ''))
        except Exception:  # noqa: BLE001
            rec = None
        st['g13'][ref['acc']] = rec or {'bad': True, 'cik': ref['cik'], 'filed': ref['filed']}
        stats['parsed'] += bool(rec)
    return stats


def form_label(form: str) -> str:
    return re.sub(r'^(SCHEDULE|SC) ', '', form or '')


def five_percent(recs: Sequence[Dict], today: dt.date, n: int = CFG['h5_n'], nx: int = CFG['h5x_n']) -> Tuple[List[Dict], List[Dict]]:
    """The latest 13D / 13G per filer on one company with the change vs that filer's previous filing; 5%+ ones biggest first,
    and (apart) filers whose latest filing is under 5% and recent (an exit)."""
    by: Dict[str, List[Dict]] = {}
    for r in recs:
        if r.get('bad') or r.get('pct') is None:
            continue
        by.setdefault(r.get('filer_cik') or re.sub(r'\W+', '', (r.get('filer') or '').lower()), []).append(r)
    rows = []
    for fs in by.values():
        fs.sort(key=lambda r: (r.get('filed') or '', r['acc']), reverse=True)
        a = fs[0]
        row = {'f': T.pretty(a['filer']), 'cik': a.get('filer_cik', ''), 'form': form_label(a['form']), 'd': (a.get('filed') or '')[:10], 'ev': a.get('event', ''),
               'pct': a['pct'], 'sh': a.get('shares'), 'url': a.get('url', '')}
        if T.is_index(a['filer']):
            row['idx'] = True
        if len(fs) > 1 and fs[1].get('pct') is not None:
            b = fs[1]
            row['chg'] = {'pct': round(a['pct'] - b['pct'], 2), 'sh': (round(a['shares'] - b['shares']) if a.get('shares') is not None and b.get('shares') is not None else None),
                          'prev': (b.get('filed') or '')[:10]}
        rows.append(row)
    cut = (today - dt.timedelta(days=CFG['exit_days'])).isoformat()
    h5 = sorted((r for r in rows if r['pct'] >= 5), key=lambda r: -r['pct'])[:n]
    h5x = sorted((r for r in rows if r['pct'] < 5 and r['d'] >= cut), key=lambda r: r['d'], reverse=True)[:nx]
    return h5, h5x


# ---- Form 4 holdings -----------------------------------------------------------------------------------------------------
def phase_f4(st: Dict, uni: Sequence[Dict], get: Callable[[str], bytes], today: dt.date, deadline: float) -> Dict[str, int]:
    """Each insider's shares after their last Form 4 (st['f4_holds'] {issuer cik:owner cik: record}): the daily form index
    (newest day first), Form 4 / 4/A listed under a scanner company, each read once."""
    ciks = {u['cik'] for u in uni if u['cik']}
    stats = {'days': 0, 'read': 0}
    for k in range(1, CFG['f4_days'] + 1):
        d = today - dt.timedelta(days=k)
        key = d.strftime('%Y%m%d')
        if d.weekday() >= 5 or key in st['f4_days'] or time.time() > deadline:
            continue
        try:
            idx = parse_index(get(I.daily_url(d)).decode('latin-1'), F4_FORMS)
        except Exception as e:  # noqa: BLE001
            if getattr(e, 'code', None) == 404 and k > 1:
                st['f4_days'].append(key)
            continue
        todo = [x for x in idx if x['acc'] not in st['f4_seen'] and any(c.lstrip('0') in ciks for c in x['ciks'])]
        for ref, raw in I.fetch_many(todo, get, deadline):
            if raw is None:
                continue
            st['f4_seen'][ref['acc']] = key
            stats['read'] += 1
            try:
                doc = F.parse_submission(raw)
                h = F.holdings(doc)
            except Exception:  # noqa: BLE001
                continue
            if h and doc.get('form') in F4_FORMS:
                add_holding(st, doc['issuer']['cik'], h, ref['acc'], I.accepted_utc(doc.get('accepted') or ''))
        if all(x['acc'] in st['f4_seen'] or not any(c.lstrip('0') in ciks for c in x['ciks']) for x in idx):
            st['f4_days'].append(key)
            stats['days'] += 1
    st['f4_days'] = sorted(set(st['f4_days']))
    return stats


def add_holding(st: Dict, issuer_cik: str, h: Dict, acc: str, filed: str) -> bool:
    """Keep the newest Form 4 of each (company, person): by trade date, then filing time."""
    key = f"{issuer_cik.lstrip('0')}:{h['owner_cik']}"
    rec = {'w': h['owner'], 'ocik': h['owner_cik'], 'role': h['role'], 'ten': h['ten'], 'ceo': h['ceo'], 'cfo': h['cfo'], 'top': h['top'], 'dir': h['director'],
           'own': h['after'], 'd': h['date'], 'code': h['code'], 'mv': h['moved'], 'px': h['price'], 'acc': acc, 'filed': filed}
    old = st['f4_holds'].get(key)
    if old and (old['d'], old.get('filed') or '') >= (rec['d'], rec['filed'] or ''):
        return False
    st['f4_holds'][key] = rec
    return True


def insiders_of(st: Dict, cik: str, so: Optional[float], n: int = CFG['ins_n'], held: Optional[Dict[str, List[Dict]]] = None) -> List[Dict]:
    """The people holding the most shares of a company after their last Form 4, biggest first (`held` = st['f4_holds'] grouped by company)."""
    rows = []
    for r in (held.get(cik, []) if held is not None else [v for k, v in st['f4_holds'].items() if k.split(':')[0] == cik]):
        if (r.get('own') or 0) > 0:
            row = {'w': r['w'], 'role': r['role'], 'own': round(r['own']), 'd': r['d'], 'code': r['code'], 'mv': round(r['mv']) if r.get('mv') else 0}
            if so:
                row['pct'] = round(r['own'] / so * 100, 3)
            if r.get('px'):
                row['px'] = round(r['px'], 2)
            if r.get('ten'):
                row['ten'] = True
            rows.append(row)
    return sorted(rows, key=lambda r: -r['own'])[:n]


# ---- 13F --------------------------------------------------------------------------------------------------------------------
def fetch_file(url: str, dest: str, ua: str, chunk: int = 1 << 20) -> int:
    """Stream a (large) data-set zip to disk; the User-Agent is the SEC one, never printed. Returns the bytes saved."""
    req = urllib.request.Request(url, headers={'User-Agent': ua, 'Accept-Encoding': 'identity', 'Accept': '*/*'})
    n = 0
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, 'wb') as f:
        while True:
            b = r.read(chunk)
            if not b:
                break
            f.write(b)
            n += len(b)
    return n


def build_f13(newer: str, older: str, uni: Sequence[Dict], st: Dict, cm: 'T.CusipMap', post, now: float, seeds: Dict[str, str]) -> Optional[Dict]:
    """Read the two newest data-set zips (paths) and return {sym: block, '_meta': {...}}: top 10 holders of each scanner stock for
    the latest quarter with the change vs the one before. None when the zips hold no 13F-HR for a quarter."""
    with zipfile.ZipFile(newer) as za, zipfile.ZipFile(older) as zb:
        ma, mb = T.read_meta(za), T.read_meta(zb)
        p1, p0 = T.dominant_period(ma), T.dominant_period(mb)
        if p1 is None or p0 is None or p0 >= p1:
            log('13F: the two newest data sets do not hold two different quarters')
            return None
        issuers = T.issuer_names(za)
        res = T.resolve(cm, issuers, uni, seeds, post, now, max_requests=CFG['figi_requests'], log=log)
        log(f"13F: CUSIP map {len(cm.symbols())} mapped ({res['seeded']} from 13D/G, {res['figi']} from OpenFIGI, {res['unmapped']} unmapped, {res['requests']} OpenFIGI request(s))")
        cm.save()
        sym_of = cm.symbols()
        everything = {**mb, **ma}                                   # a quarter's amendments can sit in the next data set
        acc1, acc0 = T.pick_accessions(everything, p1), T.pick_accessions(everything, p0)
        wanted = set(sym_of)
        cur, prev = {}, {}
        for zf in (za, zb):
            got = T.holdings_multi(zf, {'cur': acc1, 'prev': acc0}, wanted)
            for dst, tag in ((cur, 'cur'), (prev, 'prev')):
                for c, d in got[tag].items():
                    t = dst.setdefault(c, {})
                    for cik, (sh, v) in d.items():
                        x = t.get(cik, (0.0, 0.0))
                        t[cik] = (x[0] + sh, x[1] + v)
    names = {m['cik']: m['name'] for m in list(mb.values()) + list(ma.values()) if m['name']}
    filed = set(acc1.values())
    by_sym: Dict[str, Tuple[Dict, Dict]] = {}
    for c, s in sym_of.items():
        a, b = by_sym.setdefault(s, ({}, {}))
        for cik, (sh, v) in (cur.get(c) or {}).items():
            x = a.get(cik, (0.0, 0.0))
            a[cik] = (x[0] + sh, x[1] + v)
        for cik, (sh, v) in (prev.get(c) or {}).items():
            x = b.get(cik, (0.0, 0.0))
            b[cik] = (x[0] + sh, x[1] + v)
    sos = {u['s']: (st['so'].get(u['cik']) or {}).get('so') for u in uni}
    out: Dict = {}
    for s, (a, b) in by_sym.items():
        if a:
            out[s] = T.top_holders(a, b, names, filed, sos.get(s))
    out['_meta'] = {'q': p1.isoformat(), 'pq': p0.isoformat(), 'built': dt.datetime.fromtimestamp(now, UTC).strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'managers': len(filed), 'lag_days': T.LAG_DAYS}
    return out


def phase_f13(st: Dict, uni: Sequence[Dict], get: Callable[[str], bytes], ua: str, now: float, force: bool, post, cm: 'T.CusipMap',
              fetch: Callable[[str, str, str], int] = fetch_file, result_path: str = os.path.join(CACHE, 'f13.json')) -> Optional[Dict]:
    """Weekly: read the data-set page (one request); a new newest zip means a new quarter: download the two newest, build, cache."""
    cache = I.load_json(result_path, None)
    f = st['f13']
    if not force and cache and now - f.get('checked', 0) < CFG['f13_every'] * 86400:
        return cache
    try:
        links = T.zip_links(get(T.PAGE).decode('utf-8', 'replace'))
    except Exception as e:  # noqa: BLE001
        log(f'13F: the data-set page was not read ({type(e).__name__})')
        return cache
    f['checked'] = now
    if len(links) < 2:
        log('13F: no data-set zips found on the page')
        return cache
    name = links[0][0].rsplit('/', 1)[-1]
    if cache and f.get('zip') == name:
        log(f'13F: no new data set ({name})')
        return cache
    seeds = {r['cusip']: r['sym'] for r in st['g13'].values() if r.get('cusip') and r.get('sym')}
    with tempfile.TemporaryDirectory() as d:
        paths = []
        for url, _ in links[:2]:
            dest = os.path.join(d, url.rsplit('/', 1)[-1])
            try:
                n = fetch(url, dest, ua)
            except Exception as e:  # noqa: BLE001
                log(f'13F: {url.rsplit("/", 1)[-1]} not downloaded ({type(e).__name__})')
                return cache
            log(f'13F: {url.rsplit("/", 1)[-1]} {n / 1e6:.0f} MB')
            paths.append(dest)
        res = build_f13(paths[0], paths[1], uni, st, cm, post, now, seeds)
    if res is None:
        return cache
    f['zip'] = name
    os.makedirs(CACHE, exist_ok=True)
    with open(result_path, 'w') as fh:
        json.dump(res, fh, separators=(',', ':'))
    log(f"13F: {len(res) - 1} stocks, quarter {res['_meta']['q']} (vs {res['_meta']['pq']}), {res['_meta']['managers']} managers")
    return res


# ---- assemble the files --------------------------------------------------------------------------------------------------
def build_stock(u: Dict, st: Dict, today: dt.date, f13: Optional[Dict], g13_by: Optional[Dict[str, List[Dict]]] = None,
                held: Optional[Dict[str, List[Dict]]] = None) -> Dict:
    cik = u['cik']
    rec: Dict = {'n': u['n']}
    if cik:
        rec['cik'] = cik
    so = st['so'].get(cik) or {}
    if so.get('so'):
        rec['so'], rec['so_end'] = round(so['so']), so.get('end', '')
        if (so.get('n') or 1) > 1:
            rec['so_n'] = so['n']
    recs = (g13_by.get(cik, []) if g13_by is not None else [r for r in st['g13'].values() if r.get('cik') == cik]) if cik else []
    h5, h5x = five_percent(recs, today) if recs else ([], [])
    if h5:
        rec['h5'] = h5
    if h5x:
        rec['h5x'] = h5x
    ins = insiders_of(st, cik, so.get('so'), CFG['ins_n'], held) if cik else []
    if ins:
        rec['ins'] = ins
    blk = (f13 or {}).get(u['s'])
    if blk:
        rec['f13'] = blk
    return rec


def build_files(uni: Sequence[Dict], st: Dict, today: dt.date, now: dt.datetime, f13: Optional[Dict], sec: bool) -> Dict[str, Dict]:
    """{relative path under public/holders: json} : index.json and one t/<L>.json per first letter."""
    stamp = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    shards: Dict[str, Dict] = {}
    g_by: Dict[str, List[Dict]] = {}
    for r in st['g13'].values():
        g_by.setdefault(r.get('cik', ''), []).append(r)
    held: Dict[str, List[Dict]] = {}
    for k, r in st['f4_holds'].items():
        held.setdefault(k.split(':')[0], []).append(r)
    for u in uni:
        shards.setdefault(shard_of(u['s']), {})[u['s']] = build_stock(u, st, today, f13, g_by, held)
    files: Dict[str, Dict] = {}
    for L, stocks in sorted(shards.items()):
        files[f't/{L}.json'] = {'version': 1, 'generated': stamp, 'stocks': stocks}
    meta = (f13 or {}).get('_meta') or {}
    files['index.json'] = {
        'version': 1, 'generated': stamp, 'sec': sec, 'stocks': len(uni),
        'with': {'h5': sum(1 for s in shards.values() for r in s.values() if r.get('h5')), 'ins': sum(1 for s in shards.values() for r in s.values() if r.get('ins')),
                 'f13': sum(1 for s in shards.values() for r in s.values() if r.get('f13'))},
        'f13': meta or None, 'f4_days': CFG['f4_days'], 'g13_years': CFG['g13_years'],
        'filings': {'g13': sum(1 for r in st['g13'].values() if not r.get('bad')), 'f4': len(st['f4_seen'])},
        'shards': sorted(shards)}
    return files


def write_files(files: Dict[str, Dict], out: str = OUT) -> int:
    """Write what changed (a file equal but for 'generated' is left alone: no empty data commits; index.json is also rewritten on a
    new UTC day: the workflow's 'built today?' check reads its time); stale shards removed."""
    n = 0
    want = {os.path.join(out, p) for p in files}
    t_dir = os.path.join(out, 't')
    if os.path.isdir(t_dir):
        for fn in os.listdir(t_dir):
            if os.path.join(t_dir, fn) not in want:
                os.remove(os.path.join(t_dir, fn))
    for p, js in files.items():
        path = os.path.join(out, p)
        old = I.load_json(path, None)
        if (isinstance(old, dict) and {k: v for k, v in old.items() if k != 'generated'} == json.loads(json.dumps({k: v for k, v in js.items() if k != 'generated'}))
                and (p != 'index.json' or str(old.get('generated'))[:10] == js['generated'][:10])):
            continue
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(js, f, separators=(',', ':'), ensure_ascii=False)
            f.write('\n')
        n += 1
    return n


def published_f13(out: str = OUT) -> Optional[Dict]:
    """The 13F blocks of the published shards (the data branch copy): when the cache was evicted, a new run need not download the
    data sets again just to rebuild the same files."""
    idx = I.load_json(os.path.join(out, 'index.json'), None)
    if not isinstance(idx, dict) or not idx.get('f13'):
        return None
    res: Dict = {'_meta': idx['f13']}
    for L in idx.get('shards') or []:
        for s, r in ((I.load_json(os.path.join(out, 't', f'{L}.json'), {}) or {}).get('stocks') or {}).items():
            if r.get('f13'):
                res[s] = r['f13']
    return res


# ---- run ---------------------------------------------------------------------------------------------------------------------
def run(now: dt.datetime, get: Optional[Callable[[str], bytes]], ua: str = '', ctx: Optional['I.Context'] = None, f13_force: bool = False,
        no_f13: bool = False, state_path: str = STATE, out: str = OUT, post=None, fetch: Callable[[str, str, str], int] = fetch_file,
        cache_dir: str = CACHE) -> Dict[str, Dict]:
    ctx = ctx or I.Context()
    uni = universe(ctx)
    st = load_state(state_path)
    today = now.astimezone(NYZ).date()
    t = now.timestamp()
    f13 = I.load_json(os.path.join(cache_dir, 'f13.json'), None) or published_f13(out)
    cm = T.CusipMap(os.path.join(cache_dir, 'cusip.json'))
    if get is None:
        log('SEC: skipped (no SEC_UA secret and no SEC_CONTACT variable: SEC needs a contact in the User-Agent); rebuilding from the cache')
    else:
        log(f"{len(uni)} scanner stocks, {sum(1 for u in uni if u['cik'])} with a CIK")
        n = phase_shares(st, uni, get, time.time() + CFG['so_min'] * 60, t)
        log(f'shares outstanding: {n} refreshed')
        g = phase_g13(st, uni, get, today, time.time() + CFG['g13_min'] * 60, t)
        log(f"13D / 13G: {g['issuers']} company list(s) refreshed, {g['index_days']} index day(s), {g['new']} new filing(s), {g['parsed']} parsed")
        f4 = phase_f4(st, uni, get, today, time.time() + CFG['f4_min'] * 60)
        log(f"Form 4 holdings: {f4['read']} filing(s) read, {f4['days']} day(s) completed")
        prune(st, today)
        if not no_f13:
            f13 = phase_f13(st, uni, get, ua, t, f13_force, post, cm, fetch, os.path.join(cache_dir, 'f13.json')) or f13
        save_state(st, state_path)
    files = build_files(uni, st, today, now, f13, get is not None)
    log(f"public/holders: {write_files(files, out)} file(s) written of {len(files)}, {sum(len(json.dumps(v, separators=(',', ':'))) for v in files.values()) / 1e6:.2f} MB")
    return files


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--f13', action='store_true', help='check the 13F data-set page now (otherwise once a week)')
    ap.add_argument('--no-f13', action='store_true', help='skip the 13F step')
    ap.add_argument('--no-sec', action='store_true', help='request nothing from SEC: rebuild the files from the cache')
    ap.add_argument('--now', default='', help='pretend it is this UTC time (ISO)')
    a = ap.parse_args(argv)
    now = dt.datetime.fromisoformat(a.now.replace('Z', '+00:00')) if a.now else dt.datetime.now(UTC)
    if now.tzinfo is None:
        now = now.replace(tzinfo=UTC)
    ua_i = None if a.no_sec else I.user_agent()
    ua = ua_i.replace('RamanFX insiders', 'RamanFX holders', 1) if ua_i else ''
    get = None
    if ua:
        import data as SD                            # noqa: WPS433 (tools/stock_scanner/data.py)
        for h in ('www.sec.gov', 'data.sec.gov'):
            SD.HOST_PAUSE[h] = SEC_PAUSE
        get = lambda url: SD.http_get(url, ua=ua, accept='*/*', retries=2, timeout=15)       # noqa: E731
    post = T.openfigi_poster('RamanFX-holders/1.0', os.environ.get('OPENFIGI_API_KEY', '')) if ua else None   # OpenFIGI gets no SEC contact
    run(now, get, ua, f13_force=a.f13, no_f13=a.no_f13, post=post)
    return 0


if __name__ == '__main__':
    sys.exit(main())
