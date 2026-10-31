"""Dev helper: save REAL SEC filings as test fixtures, minimised, and check the readers against them (run where www.sec.gov
answers; the sandbox that wrote the committed fixtures could not reach it, so those are reconstructions of the EDGAR schemas).

    SEC_UA='RamanFX you@example.com' python tools/insiders/grab_fixtures.py form144.txt=<URL> schedule13d_a.txt=<URL> ...
    SEC_UA=... python tools/insiders/grab_fixtures.py --auto      # pick one real sample of each form from the latest daily index

<URL> is a full submission text: https://www.sec.gov/Archives/edgar/data/<cik>/<acc no dashes>/<acc>.txt. Each file is saved under
tools/insiders/tests/fixtures/ with only the SEC header and the first XML / text document, capped at 60 KB. --auto also prints
every sample between '=====FIXTURE name=====' markers (the insiders workflow's `fixtures` input runs it and keeps the log), the
parsed fields, the 13F data-set page and the first rows of its tables, one company's submissions list and shares-outstanding
answer, and one OpenFIGI answer: what holders.py and f13.py assume, checked against the real thing. The contact in SEC_UA /
SEC_CONTACT is never printed or saved.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import tempfile
import zipfile
from typing import Callable, Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(HERE)), 'tools', 'holders'))
import form144 as F144  # noqa: E402
import form4 as F  # noqa: E402
import insiders as I  # noqa: E402
import sched13 as S13  # noqa: E402

OUT = os.path.join(HERE, 'tests', 'fixtures')
CAP = 60_000
_IDX = re.compile(r'^(4|144|SCHEDULE 13[DG](?:/A)?|SC 13[DG](?:/A)?)\s+.+?\s+(\d{1,10})\s+(\d{8})\s+(edgar/data/\d+/([\d-]{20})\.txt)\s*$')


def minimise(raw: bytes) -> bytes:
    """Header + the first <DOCUMENT> only (exhibits and later documents dropped), at most CAP bytes."""
    docs = list(re.finditer(rb'<DOCUMENT>.*?</DOCUMENT>', raw, re.S))
    head = raw[:docs[0].start()] if docs else raw[:CAP]
    body = docs[0].group(0) if docs else b''
    tail = b'\n</SEC-DOCUMENT>\n' if docs else b''
    return (head + body + tail)[:CAP]


def index_refs(text: str) -> Dict[str, List[Dict]]:
    """{form: [{acc, cik}]} of the wanted forms in a daily form index, in file order (one per accession)."""
    out: Dict[str, List[Dict]] = {}
    seen = set()
    for line in text.splitlines():
        m = _IDX.match(line)
        if m and m.group(5) not in seen:
            seen.add(m.group(5))
            out.setdefault(m.group(1), []).append({'acc': m.group(5), 'cik': m.group(2), 'form': m.group(1)})
    return out


def emit(name: str, raw: bytes, say: Callable[[str], None], out: Optional[str] = None, limit: int = 24_000) -> None:
    data = minimise(raw)
    say(f'=====FIXTURE {name} ({len(data)} bytes)=====')
    say(data[:limit].decode('utf-8', 'replace'))
    say(f'=====END {name}=====')
    if out:
        os.makedirs(out, exist_ok=True)
        with open(os.path.join(out, name), 'wb') as f:
            f.write(data)


def summary(d: Dict) -> str:
    return json.dumps({k: v for k, v in d.items() if k not in ('rows', 'footnotes', 'classes', 'persons', 'owners', 'holds')}, default=str, ensure_ascii=False)[:900]


def auto(get: Callable[[str], bytes], today: dt.date, say: Callable[[str], None] = print, out: Optional[str] = None, post: Optional[Callable] = None) -> None:
    refs: Dict[str, List[Dict]] = {}
    for k in range(1, 9):
        d = today - dt.timedelta(days=k)
        if d.weekday() >= 5:
            continue
        try:
            refs = index_refs(get(I.daily_url(d)).decode('latin-1'))
        except Exception as e:  # noqa: BLE001
            say(f'daily index {d}: not read ({type(e).__name__})')
            continue
        say(f'daily index {d}: ' + ', '.join(f'{f} x{len(v)}' for f, v in sorted(refs.items())))
        break
    fetch = lambda r: get(I.txt_url(r))                                                     # noqa: E731
    for form, name, parse in (('144', 'form144.txt', F144.parse_submission), ('SCHEDULE 13D/A', 'schedule13d_a.txt', S13.parse_submission),
                              ('SCHEDULE 13D', 'schedule13d.txt', S13.parse_submission), ('SCHEDULE 13G/A', 'schedule13g_a.txt', S13.parse_submission),
                              ('SCHEDULE 13G', 'schedule13g.txt', S13.parse_submission)):
        for r in (refs.get(form) or [])[:1]:
            try:
                raw = fetch(r)
                emit(name, raw, say, out)
                say(f'parsed {name}: {summary(parse(raw))}')
            except Exception as e:  # noqa: BLE001
                say(f'{name}: {type(e).__name__}: {str(e)[:120]}')
    want = {'plan': 'form4_sale_plan.txt', 'open': 'form4_sale_open.txt'}
    for r in (refs.get('4') or [])[:150]:
        if not want:
            break
        try:
            raw = fetch(r)
            doc = F.parse_submission(raw)
            s = F.filing_trades(doc, 'S')
        except Exception:  # noqa: BLE001
            continue
        if s is None:
            continue
        key = 'plan' if s['plan'] else 'open'
        if key in want:
            name = want.pop(key)
            emit(name, raw, say, out, 12_000)
            say(f"parsed {name}: plan={s['plan']} box={doc['plan']} cover={s['cover']} value={s['value']} role={s['role']} top={s['top']} holdings={F.holdings(doc)}")
    if want:
        say(f'no Form 4 sale found for: {sorted(want)}')
    try:
        import f13 as T                                                                     # noqa: WPS433 (tools/holders)
        import holders as HD                                                                 # noqa: WPS433
        links = T.zip_links(get(T.PAGE).decode('utf-8', 'replace'))
        say(f'13F data-set page: {len(links)} zip link(s); newest: {[(u.rsplit("/", 1)[-1], str(e)) for u, e in links[:3]]}')
        if links:
            with tempfile.TemporaryDirectory() as d:
                dest = os.path.join(d, 'f.zip')
                n = HD.fetch_file(links[0][0], dest, I.user_agent() or '')
                say(f'13F zip {links[0][0].rsplit("/", 1)[-1]}: {n / 1e6:.0f} MB')
                with zipfile.ZipFile(dest) as z:
                    say(f'13F members: {[(i.filename, i.file_size) for i in z.infolist()]}')
                    for member in z.namelist():
                        if member.upper().endswith(('SUBMISSION.TSV', 'COVERPAGE.TSV', 'INFOTABLE.TSV')):
                            with z.open(member) as f:
                                head = [next(f, b'').decode('utf-8', 'replace').rstrip('\n') for _ in range(6)]
                            say(f'=====FIXTURE {member} (first rows)=====')
                            say('\n'.join(head)[:3000])
                            say(f'=====END {member}=====')
    except Exception as e:  # noqa: BLE001
        say(f'13F check: {type(e).__name__}: {str(e)[:160]}')
    try:
        subs = json.loads(get('https://data.sec.gov/submissions/CIK0000320193.json'))
        rec = (subs.get('filings') or {}).get('recent') or {}
        forms = rec.get('form') or []
        g = [(f, (rec.get('filingDate') or [''] * len(forms))[i], (rec.get('primaryDocument') or [''] * len(forms))[i]) for i, f in enumerate(forms) if '13' in f and ('SC ' in f or 'SCHEDULE' in f)]
        say(f'submissions CIK 320193: {len(forms)} recent filings, {len(g)} Schedule 13D/G listed, e.g. {g[:3]}; other files: {len((subs.get("filings") or {}).get("files") or [])}')
    except Exception as e:  # noqa: BLE001
        say(f'submissions check: {type(e).__name__}')
    try:
        c = json.loads(get('https://data.sec.gov/api/xbrl/companyconcept/CIK0000320193/dei/EntityCommonStockSharesOutstanding.json'))
        say(f'shares outstanding concept: {(c.get("units") or {}).get("shares", [])[-2:]}')
    except Exception as e:  # noqa: BLE001
        say(f'shares concept check: {type(e).__name__}')
    if post is not None:
        try:
            say(f'OpenFIGI 037833100: {json.dumps(post([{"idType": "ID_CUSIP", "idValue": "037833100"}]))[:600]}')
        except Exception as e:  # noqa: BLE001
            say(f'OpenFIGI check: {type(e).__name__}')


def main(argv=None) -> int:
    argv = list(argv if argv is not None else sys.argv[1:])
    ua = I.user_agent()
    if not ua:
        print(__doc__)
        return 0
    get = I.http_getter(ua)
    import data as SD                                                                       # noqa: WPS433
    SD.HOST_PAUSE['data.sec.gov'] = I.SEC_PAUSE
    if '--auto' in argv:
        import f13 as T                                                                     # noqa: WPS433
        auto(get, dt.datetime.now(dt.timezone.utc).astimezone(I.NYZ).date(), out=OUT if '--save' in argv else None, post=T.openfigi_poster('RamanFX-fixtures/1.0'))
        return 0
    os.makedirs(OUT, exist_ok=True)
    for a in [x for x in argv if '=' in x]:
        name, url = a.split('=', 1)
        if not re.fullmatch(r'[A-Za-z0-9_.-]+', name) or not url.startswith('https://www.sec.gov/Archives/'):
            print(f'skipped {name!r}: a plain file name and an https://www.sec.gov/Archives/ URL are needed')
            continue
        data = minimise(get(url))
        with open(os.path.join(OUT, name), 'wb') as f:
            f.write(data)
        print(f'{name}: {len(data)} bytes')
    return 0


if __name__ == '__main__':
    sys.exit(main())
