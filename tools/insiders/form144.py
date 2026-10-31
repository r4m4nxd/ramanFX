"""SEC Form 144 (notice of proposed sale of restricted or control securities, filed BEFORE the sale; structured XML on
EDGAR since April 2023) -> one record. Pure, stdlib only.

Latest-filings feed type=144 (cgi-bin/browse-edgar?action=getcurrent&type=144&output=atom), daily index form type '144'
(and '144/A'). The primary document (edgarSubmission, X0101 schema) carries, by tag name (read by name, wherever the
schema version nests it):
    issuerInfo               issuerCik, issuerName, secFileNumber, nameOfPersonForWhoseAccountTheSecuritiesAreToBeSold (the
                             SELLER), relationshipsToIssuer / relationshipToIssuer (Officer, Director, 10% Owner ...)
    securitiesInformation    one block per security class: securitiesClassTitle, brokerOrMarketmakerDetails/name, noOfUnitsSold,
                             aggregateMarketValue (USD), noOfUnitsOutstanding, approxSaleDate (MM/DD/YYYY), securitiesExchangeName
    noticeSignature          noticeDate, planAdoptionDates / planAdoptionDate (a Rule 10b5-1 plan), signature
A 144 is a plan to sell, not a sale: the sale may be smaller, later or never. Context, not a signal.
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional
import xml.etree.ElementTree as ET

import edgar as E

REL_RE = [('Officer', re.compile(r'officer', re.I)), ('Director', re.compile(r'director', re.I)),
          ('10% owner', re.compile(r'10|ten|percent|%|owner|holder', re.I))]


def relation(texts: List[str]) -> str:
    """'Officer · Director', '10% owner', 'Other' ... from the relationshipToIssuer values."""
    out: List[str] = []
    for t in texts:
        hit = next((name for name, rx in REL_RE if rx.search(t)), t[:24] if t else '')
        if hit and hit not in out:
            out.append(hit)
    return ' · '.join(out) or 'Other'


def parse_xml(root: ET.Element) -> Dict:
    """The edgarSubmission of a Form 144 -> {issuer: {cik, name}, seller, rel, rel_list, classes: [...], shares, value,
    outstanding, sale_date (the earliest approxSaleDate), broker, plan_dates, notice_date}."""
    classes = []
    for si in E.iter_tag(root, 'securitiesInformation'):
        bk = next(iter(E.iter_tag(si, 'brokerOrMarketmakerDetails')), None)
        classes.append({'title': E.first(si, 'securitiesClassTitle'), 'units': E.num(E.first(si, 'noOfUnitsSold')),
                        'value': E.num(E.first(si, 'aggregateMarketValue')), 'outstanding': E.num(E.first(si, 'noOfUnitsOutstanding')),
                        'date': E.iso_date(E.first(si, 'approxSaleDate')), 'exchange': E.first(si, 'securitiesExchangeName'),
                        'broker': E.first(bk, 'name') if bk is not None else ''})
    iss = next(iter(E.iter_tag(root, 'issuerInfo')), None)
    rels = E.all_text(iss if iss is not None else root, 'relationshipToIssuer')
    dates = sorted(c['date'] for c in classes if c['date'])
    units = [c['units'] for c in classes if c['units']]
    values = [c['value'] for c in classes if c['value']]
    outs = [c['outstanding'] for c in classes if c['outstanding']]
    return {'issuer': {'cik': E.first(iss, 'issuerCik').lstrip('0'), 'name': E.first(iss, 'issuerName')},
            'seller': E.first(iss, 'nameOfPersonForWhoseAccountTheSecuritiesAreToBeSold') or E.first(root, 'nameOfPersonForWhoseAccountTheSecuritiesAreToBeSold'),
            'rel': relation(rels), 'rel_list': rels, 'classes': classes, 'shares': sum(units) if units else None,
            'value': round(sum(values), 2) if values else None, 'outstanding': max(outs) if outs else None,
            'sale_date': dates[0] if dates else '', 'broker': next((c['broker'] for c in classes if c['broker']), ''),
            'plan_dates': sorted({d for d in (E.iso_date(x) for x in E.all_text(root, 'planAdoptionDate')) if d}),
            'notice_date': E.iso_date(E.first(root, 'noticeDate'))}


def parse_submission(raw: bytes) -> Dict:
    """The full submission .txt (or the bare XML) -> parse_xml() + 'accepted' (New York time as SEC writes it), 'form'
    ('144' / '144/A') and the envelope's names as a fallback (issuer = ISSUER / SUBJECT COMPANY, seller = the filer)."""
    root = E.xml_root(raw, 'edgarSubmission')
    if root is None:
        raise ValueError('not a Form 144')
    doc = parse_xml(root)
    h = E.header(raw)
    doc['accepted'] = h['accepted']
    doc['form'] = h['form'] or E.first(root, 'submissionType') or '144'
    if not doc['issuer']['cik']:
        doc['issuer']['cik'] = (h['subject'] or {}).get('cik', '')
    if not doc['issuer']['name']:
        doc['issuer']['name'] = (h['subject'] or {}).get('name', '')
    if not doc['seller']:
        doc['seller'] = (h['filer'] or {}).get('name', '')
    return doc


def record(doc: Dict, ref: Dict, url: str, filed: str, sym: str = '') -> Optional[Dict]:
    """The stored record of a planned sale (insiders.py state): None when it names no seller or no issuer."""
    if not doc.get('seller') or not doc['issuer'].get('cik'):
        return None
    sh, val = doc.get('shares'), doc.get('value')
    return {'type': 'f144', 'acc': ref['acc'], 'form': doc.get('form', '144'), 'cik': doc['issuer']['cik'], 'sym': sym,
            'name': doc['issuer']['name'], 'seller': doc['seller'], 'rel': doc['rel'], 'shares': sh, 'value': val,
            'price': round(val / sh, 4) if sh and val else None, 'outstanding': doc.get('outstanding'),
            'date': doc.get('sale_date') or doc.get('notice_date') or '', 'plan': bool(doc.get('plan_dates')),
            'plan_dates': doc.get('plan_dates', [])[:2], 'broker': (doc.get('broker') or '')[:40], 'url': url, 'filed': filed}
