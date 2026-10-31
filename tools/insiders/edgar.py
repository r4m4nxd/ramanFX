"""Shared bits of the SEC EDGAR submission readers (form144.py, sched13.py; form4.py has its own copies). Pure, stdlib only.

A full submission (https://www.sec.gov/Archives/edgar/data/<cik>/<acc no dashes>/<acc>.txt) is an SGML envelope:
    <ACCEPTANCE-DATETIME>20261028163005          the filing time, New York time
    CONFORMED SUBMISSION TYPE:  SCHEDULE 13D/A
    SUBJECT COMPANY: / ISSUER:                   COMPANY CONFORMED NAME + CENTRAL INDEX KEY of the company the filing is about
    FILED BY: / FILER: / REPORTING-OWNER:        the same for the person who filed it
    <DOCUMENT> <TYPE>... <TEXT> <XML> ... </XML> </TEXT> </DOCUMENT>   the structured primary document (Form 4, 144,
                                                  SCHEDULE 13D / 13G since Dec 2024) or the old text / HTML
header() reads the envelope, xml_root() the XML with its namespaces stripped, so a reader finds a field by its tag name
wherever the schema version puts it.
"""
from __future__ import annotations

import datetime as dt
import html
import re
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional

_XML_RE = re.compile(rb'<XML>\s*(.*?)\s*</XML>', re.S | re.I)
_ACCEPT_RE = re.compile(rb'<ACCEPTANCE-DATETIME>\s*(\d{14})')
_TYPE_RE = re.compile(rb'CONFORMED SUBMISSION TYPE:\s*([^\r\n]+)')
_BLOCK = re.compile(r'^(SUBJECT COMPANY|FILED BY|FILER|ISSUER|REPORTING-OWNER|FILED FOR)\s*:\s*$', re.M)
_NAME = re.compile(r'COMPANY CONFORMED NAME:\s*([^\r\n]*)')
_CIK = re.compile(r'CENTRAL INDEX KEY:\s*(\d+)')
_SIC = re.compile(r'STANDARD INDUSTRIAL CLASSIFICATION:\s*([^\r\n\[]*)')


def num(s) -> Optional[float]:
    try:
        v = float(str(s).replace(',', '').replace('$', '').replace('%', '').strip())
    except (ValueError, TypeError):
        return None
    return v if v == v else None


def iso_date(s) -> str:
    """'10/30/2026' (SEC forms), '2026-10-30', '20261030' or 'October 30, 2026' -> 'YYYY-MM-DD'; '' when not a date."""
    s = str(s or '').strip()
    for f in ('%m/%d/%Y', '%Y-%m-%d', '%Y%m%d', '%B %d, %Y', '%b %d, %Y', '%m-%d-%Y', '%m/%d/%y'):
        try:
            return dt.datetime.strptime(s[:22].strip(), f).date().isoformat()
        except ValueError:
            continue
    return ''


def header(raw: bytes) -> Dict:
    """The SGML envelope: {accepted ('YYYY-MM-DDTHH:MM:SS', New York), form, subject: {name, cik, sic}, filer: {name, cik}}.
    subject = SUBJECT COMPANY (13D / 13G) or ISSUER (Form 4, 144); filer = FILED BY or the first FILER / REPORTING-OWNER."""
    out: Dict = {'accepted': '', 'form': '', 'subject': {}, 'filer': {}}
    a = _ACCEPT_RE.search(raw)
    if a:
        s = a.group(1).decode()
        out['accepted'] = f'{s[:4]}-{s[4:6]}-{s[6:8]}T{s[8:10]}:{s[10:12]}:{s[12:14]}'
    t = _TYPE_RE.search(raw)
    if t:
        out['form'] = t.group(1).decode('latin-1').strip()
    end = raw.find(b'</SEC-HEADER>')
    head = raw[:end if end > 0 else 20000].decode('latin-1')
    marks = [(m.group(1), m.start(), m.end()) for m in _BLOCK.finditer(head)]
    for i, (kind, _, pos) in enumerate(marks):
        chunk = head[pos:marks[i + 1][1] if i + 1 < len(marks) else len(head)]
        n, c, sic = _NAME.search(chunk), _CIK.search(chunk), _SIC.search(chunk)
        d = {'name': n.group(1).strip() if n else '', 'cik': c.group(1).lstrip('0') if c else ''}
        if sic and sic.group(1).strip():
            d['sic'] = sic.group(1).strip()
        key = 'subject' if kind in ('SUBJECT COMPANY', 'ISSUER') else 'filer'
        if not out[key]:
            out[key] = d
    return out


def xml_root(raw: bytes, want: str = '') -> Optional[ET.Element]:
    """The first <XML> payload of the submission (or the bare XML) parsed, tags without their namespace; `want` = the
    root tag it must have (e.g. 'edgarSubmission'). None when there is none."""
    blocks = [m.group(1) for m in _XML_RE.finditer(raw)] or [raw]
    for b in blocks:
        try:
            root = ET.fromstring(b.strip())
        except ET.ParseError:
            continue
        for el in root.iter():
            if isinstance(el.tag, str) and '}' in el.tag:
                el.tag = el.tag.rsplit('}', 1)[1]
        if not want or root.tag == want:
            return root
    return None


def iter_tag(el: Optional[ET.Element], tag: str):
    """Descendants named `tag`, ignoring case (the 13D schema says issuerCIK where the 13G one says issuerCik)."""
    t = tag.lower()
    return [x for x in (el.iter() if el is not None else []) if isinstance(x.tag, str) and x.tag.lower() == t]


def first(el: Optional[ET.Element], *tags: str) -> str:
    """Text of the first descendant with any of these tags (in this order of preference), stripped; '' when none."""
    for t in tags:
        for x in iter_tag(el, t):
            v = x.find('value')
            s = ''.join((v if v is not None else x).itertext()).strip()
            if s:
                return ' '.join(s.split())
    return ''


def all_text(el: Optional[ET.Element], tag: str) -> List[str]:
    return [t for t in (' '.join(''.join(x.itertext()).split()) for x in iter_tag(el, tag)) if t]


def flat(raw: bytes) -> str:
    """The submission's text documents without markup or the XML payloads: tags removed, entities decoded, whitespace
    collapsed (the old SC 13D / SC 13G text and HTML)."""
    t = _XML_RE.sub(b' ', raw).decode('latin-1')
    t = re.sub(r'<(script|style)\b.*?</\1>', ' ', t, flags=re.S | re.I)
    t = re.sub(r'<[^>]+>', ' ', t)
    return ' '.join(html.unescape(t).replace('\xa0', ' ').split())
