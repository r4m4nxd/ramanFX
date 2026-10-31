"""SEC Schedule 13D (activist / control stake, within 5 business days of crossing 5%) and Schedule 13G (passive 5% holder)
-> one record each. Pure, stdlib only.

Form names on EDGAR: 'SCHEDULE 13D', 'SCHEDULE 13D/A', 'SCHEDULE 13G', 'SCHEDULE 13G/A' since December 2024 (structured XML
primary document, edgarSubmission); 'SC 13D', 'SC 13D/A', 'SC 13G', 'SC 13G/A' before (plain text / HTML, read here by
patterns). Latest-filings feed type=SCHEDULE 13D / SCHEDULE 13G (the feed matches a type by its prefix, so '/A' comes with
it); daily index form types as above.

XML, by tag name (wherever the schema version nests it): issuerInfo (issuerCik, issuerCusip, issuerName), eventDateRequires
FilingThisStatement (MM/DD/YYYY), per reporting person reportingPersonName + percentOfClass (13D) / classPercent (13G) +
aggregateAmountOwned (13D) / reportingPersonBeneficiallyOwnedAggregateNumberOfShares (13G); 13D Item 4 (purpose of the
transaction): transactionPurpose. The SGML envelope (edgar.header) names the filer and the subject company either way.
The biggest percentage among the reporting persons is the record's (a group's members repeat the group total).
"""
from __future__ import annotations

import re
from typing import Dict, Optional
import xml.etree.ElementTree as ET

import edgar as E

KIND_RE = re.compile(r'13\s*([DG])', re.I)
PCT_TAGS = ('percentOfClass', 'classPercent', 'percentOfClassRepresentedByAmountInRow11')
SH_TAGS = ('aggregateAmountOwned', 'reportingPersonBeneficiallyOwnedAggregateNumberOfShares', 'aggregateAmountBeneficiallyOwned', 'amountBeneficiallyOwned')
PERSON_TAGS = ('reportingPersonInfo', 'coverPageHeaderReportingPersonDetails', 'reportingPerson')
PURPOSE_CHARS = 200
_CUSIP = re.compile(r'(?<![0-9A-Z])([0-9A-Z]{8}[0-9])\s*\(\s*CUSIP|CUSIP\s*(?:No\.?|Number|#)?\s*[:\-]?\s*([0-9A-Z]{8}[0-9])(?![0-9A-Z])', re.I)
_PCT_TXT = re.compile(r'PERCENT\s+OF\s+CLASS\s+REPRESENTED\s+BY\s+AMOUNT\s+IN\s+ROW\s*\(?\s*(?:9|11)\s*\)?\s*:?\s*([\d.]+)\s*%?', re.I)
_SH_TXT = re.compile(r'AGGREGATE\s+AMOUNT\s+BENEFICIALLY\s+OWNED\s+BY\s+EACH\s+REPORTING\s+PERSON\s*:?\s*([\d,]{3,})', re.I)
_EVENT_TXT = re.compile(r'([A-Z][a-z]+\.? \d{1,2}, \d{4}|\d{1,2}/\d{1,2}/\d{2,4})\s*\(?\s*Date of Event Which Requires Filing', re.I)
_ITEM4 = re.compile(r'Item\s*4\.?\s*[:\-–]?\s*Purpose of Transaction\.?\s*(.*?)(?=\s*Item\s*5\b)', re.I | re.S)


def kind_of(form: str) -> str:
    """'D' / 'G' from 'SCHEDULE 13D/A', 'SC 13G' ...; '' for anything else."""
    m = KIND_RE.search(form or '')
    return m.group(1).upper() if m else ''


def purpose_text(s: str, n: int = PURPOSE_CHARS) -> str:
    """The first ~n characters of Item 4 at a word boundary ('…' when cut); the item's own heading is dropped."""
    s = re.sub(r'^\s*(Item\s*4\.?\s*[:\-–]?\s*)?(Purpose of Transaction\.?\s*)?', '', ' '.join((s or '').split()), flags=re.I).strip()
    if len(s) <= n:
        return s
    cut = s[:n]
    return cut[:max(cut.rfind(' '), n - 25)].rstrip(' ,;:.') + '…'


def parse_xml(root: ET.Element) -> Dict:
    persons = []
    for tag in PERSON_TAGS:
        for p in E.iter_tag(root, tag):
            persons.append({'name': E.first(p, 'reportingPersonName', 'nameOfReportingPerson'), 'pct': E.num(E.first(p, *PCT_TAGS)),
                            'shares': E.num(E.first(p, *SH_TAGS))})
        if persons:
            break
    top = max(persons, key=lambda p: (p['pct'] or 0, p['shares'] or 0)) if persons else {}
    pct = top.get('pct') if top else E.num(E.first(root, *PCT_TAGS))
    sh = top.get('shares') if top else E.num(E.first(root, *SH_TAGS))
    item4 = next(iter(E.iter_tag(root, 'item4')), None)
    purpose = E.first(root, 'transactionPurpose') or (' '.join(''.join(item4.itertext()).split()) if item4 is not None else '')
    return {'subject': {'cik': E.first(root, 'issuerCik').lstrip('0'), 'name': E.first(root, 'issuerName'),
                        'cusip': E.first(root, 'issuerCusip', 'issuerCUSIP', 'cusip').replace(' ', '').upper()},
            'persons': persons, 'filer': (top.get('name') if top else '') or (persons[0]['name'] if persons else ''),
            'pct': pct, 'shares': sh, 'event': E.iso_date(E.first(root, 'eventDateRequiresFilingThisStatement', 'dateOfEvent')),
            'purpose': purpose_text(purpose)}


def parse_text(raw: bytes) -> Dict:
    """The old SC 13D / SC 13G (text or HTML): cover-page patterns on the flattened document text."""
    t = E.flat(raw)
    cusip, pct, sh, ev, i4 = _CUSIP.search(t), _PCT_TXT.search(t), _SH_TXT.search(t), _EVENT_TXT.search(t), _ITEM4.search(t)
    return {'subject': {'cik': '', 'name': '', 'cusip': (cusip.group(1) or cusip.group(2)).upper() if cusip else ''}, 'persons': [], 'filer': '',
            'pct': E.num(pct.group(1)) if pct else None, 'shares': E.num(sh.group(1)) if sh else None,
            'event': E.iso_date(ev.group(1)) if ev else '', 'purpose': purpose_text(i4.group(1)) if i4 else ''}


def parse_submission(raw: bytes) -> Dict:
    """The full submission .txt -> {form, kind ('D' / 'G'), amend, subject: {cik, name, cusip}, filer, filer_cik, pct, shares,
    event, purpose (13D only), accepted}. Raises ValueError for anything that is not a Schedule 13D / 13G."""
    h = E.header(raw)
    form = h['form']
    kind = kind_of(form)
    if not kind:
        raise ValueError(f'not a Schedule 13D / 13G: {form[:20]!r}')
    root = E.xml_root(raw, 'edgarSubmission')
    doc = parse_xml(root) if root is not None else parse_text(raw)
    doc['form'], doc['kind'], doc['amend'], doc['accepted'] = form, kind, form.upper().endswith('/A'), h['accepted']
    sub, fl = h['subject'] or {}, h['filer'] or {}
    doc['subject']['cik'] = doc['subject']['cik'] or sub.get('cik', '')
    doc['subject']['name'] = doc['subject']['name'] or sub.get('name', '')
    doc['filer'] = fl.get('name') or doc['filer']
    doc['filer_cik'] = fl.get('cik', '')
    if kind == 'G':
        doc['purpose'] = ''
    return doc


def record(doc: Dict, ref: Dict, url: str, filed: str, sym: str = '') -> Optional[Dict]:
    """The stored record of one 13D / 13G (insiders.py state, the holders tool): None when it names no filer or subject."""
    s = doc['subject']
    if not doc.get('filer') or not (s.get('cik') or s.get('cusip')):
        return None
    return {'type': 'd13' if doc['kind'] == 'D' else 'g13', 'acc': ref['acc'], 'form': doc['form'], 'cik': s.get('cik', ''), 'cusip': s.get('cusip', ''),
            'sym': sym, 'name': s.get('name', ''), 'filer': doc['filer'], 'filer_cik': doc.get('filer_cik', ''), 'pct': doc.get('pct'),
            'shares': doc.get('shares'), 'event': doc.get('event', ''), 'purpose': doc.get('purpose', ''), 'url': url, 'filed': filed}
