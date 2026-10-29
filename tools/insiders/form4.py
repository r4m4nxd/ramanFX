"""SEC Form 4 (ownershipDocument XML) -> the open-market purchases and sales of one filing. Pure, stdlib only.

A filing's full submission text (https://www.sec.gov/Archives/edgar/data/<cik>/<acc no dashes>/<acc>.txt) holds the
SEC header (ACCEPTANCE-DATETIME = the filing time) and the XML between <XML> ... </XML>. parse_submission() reads both.

Kept: nonDerivativeTransaction rows with transactionCode 'P' (open-market or private purchase) and 'S' (open-market
sale, for the per-stock sells summary only). Ignored: A (grant), M (option exercise), F (tax withholding), G (gift),
C, D, J, X ... and every derivative row. A price or share count that is only a footnote reference (no <value>) is
None; footnote texts are kept per row ('weighted average price ...'). One filing can list several transactions (one
per fill or per day) and several reporting owners (joint filers: a fund and its general partner): the filing counts
as ONE insider (the first owner), its rows are summed into one purchase per filing (filing_buys).
"""
from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional

TRUE = {'1', 'true', 'yes', 'y'}
CEO_RE = re.compile(r'\b(ceo|chief executive|principal executive|co-?ceo)\b', re.I)
CFO_RE = re.compile(r'\b(cfo|chief financial|principal financial|treasurer)\b', re.I)
TOP_RE = re.compile(r'\b(president|coo|chief operating|chair(man|woman|person)?|executive chair|founder)\b', re.I)
_XML_RE = re.compile(rb'<XML>\s*(.*?)\s*</XML>', re.S | re.I)
_ACCEPT_RE = re.compile(rb'<ACCEPTANCE-DATETIME>\s*(\d{14})')
_TYPE_RE = re.compile(rb'CONFORMED SUBMISSION TYPE:\s*(\S+)')


def _t(el: Optional[ET.Element], path: str) -> str:
    """Text at path (a <value> child when there is one), stripped; '' when missing."""
    if el is None:
        return ''
    x = el.find(path)
    if x is None:
        return ''
    v = x.find('value')
    s = (v.text if v is not None else x.text) or ''
    return s.strip()


def _num(s: str) -> Optional[float]:
    try:
        v = float(s.replace(',', '').replace('$', ''))
    except (ValueError, AttributeError):
        return None
    return v if v == v else None


def _flag(el: Optional[ET.Element], path: str) -> bool:
    return _t(el, path).lower() in TRUE


def _foot_ids(el: Optional[ET.Element]) -> List[str]:
    return [] if el is None else [f.get('id') or '' for f in el.iter('footnoteId') if f.get('id')]


def role_of(rel: Dict) -> str:
    """'CEO · Director', 'CFO', 'President', 'Director', '10% owner', 'Officer' ... (short, for one Telegram line)."""
    bits: List[str] = []
    title = (rel.get('title') or '').strip()
    if rel.get('ceo'):
        bits.append('CEO')
    if rel.get('cfo'):
        bits.append('CFO')
    if rel.get('officer') and not bits:
        m = TOP_RE.search(title)
        bits.append(m.group(0).title().replace('Coo', 'COO') if m else (title[:28] if title else 'Officer'))
    if rel.get('director'):
        bits.append('Director')
    if rel.get('ten'):
        bits.append('10% owner')
    if not bits:
        bits.append('Other')
    return ' · '.join(bits)


def parse_owner(o: ET.Element) -> Dict:
    rel = o.find('reportingOwnerRelationship')
    title = _t(rel, 'officerTitle')
    r = {'cik': _t(o, 'reportingOwnerId/rptOwnerCik').lstrip('0'), 'name': _t(o, 'reportingOwnerId/rptOwnerName'),
         'director': _flag(rel, 'isDirector'), 'officer': _flag(rel, 'isOfficer') or bool(title),
         'ten': _flag(rel, 'isTenPercentOwner'), 'other': _flag(rel, 'isOther'), 'title': title}
    hay = f"{title} {_t(rel, 'otherText')}"
    r['ceo'] = bool(CEO_RE.search(hay))
    r['cfo'] = bool(CFO_RE.search(hay)) and not re.search(r'assistant|vice president,? treasurer', hay, re.I)
    r['role'] = role_of(r)
    return r


def parse_xml(xml: bytes) -> Dict:
    """One ownershipDocument -> {doc_type, period, issuer: {cik, name, sym}, owners: [...], plan, rows: [...],
    footnotes}. rows: every non-derivative transaction {code, date, shares, price, ad, after, direct, title, notes}."""
    root = ET.fromstring(xml)
    if root.tag != 'ownershipDocument':
        d = root.find('.//ownershipDocument')
        if d is None:
            raise ValueError('not an ownershipDocument')
        root = d
    foot = {f.get('id') or '': ' '.join(''.join(f.itertext()).split()) for f in root.iter('footnote')}
    iss = root.find('issuer')
    out = {'doc_type': _t(root, 'documentType'), 'period': _t(root, 'periodOfReport'),
           'issuer': {'cik': _t(iss, 'issuerCik').lstrip('0'), 'name': _t(iss, 'issuerName'),
                      'sym': re.sub(r'[^A-Z0-9.\-]', '', _t(iss, 'issuerTradingSymbol').upper())},
           'owners': [parse_owner(o) for o in root.findall('reportingOwner')],
           'plan': _flag(root, 'aff10b5One'), 'footnotes': foot, 'rows': []}
    for tx in root.findall('nonDerivativeTable/nonDerivativeTransaction'):
        amt = tx.find('transactionAmounts')
        ids = _foot_ids(tx)
        out['rows'].append({
            'code': _t(tx, 'transactionCoding/transactionCode').upper(),
            'date': _t(tx, 'transactionDate')[:10],
            'shares': _num(_t(amt, 'transactionShares')),
            'price': _num(_t(amt, 'transactionPricePerShare')),
            'ad': _t(amt, 'transactionAcquiredDisposedCode').upper(),
            'after': _num(_t(tx, 'postTransactionAmounts/sharesOwnedFollowingTransaction')),
            'direct': _t(tx, 'ownershipNature/directOrIndirectOwnership').upper() or 'D',
            'title': _t(tx, 'securityTitle'),
            'notes': [foot[i] for i in dict.fromkeys(ids) if i in foot],
        })
    return out


def parse_submission(raw: bytes) -> Dict:
    """The full submission .txt (or the bare XML) -> parse_xml() + 'accepted' ('YYYY-MM-DDTHH:MM:SS', New York time as
    SEC writes it) + 'form' ('4' / '4/A')."""
    m = _XML_RE.search(raw)
    xml = m.group(1) if m else raw
    doc = parse_xml(xml.strip())
    a = _ACCEPT_RE.search(raw)
    if a:
        s = a.group(1).decode()
        doc['accepted'] = f'{s[:4]}-{s[4:6]}-{s[6:8]}T{s[8:10]}:{s[10:12]}:{s[12:14]}'
    t = _TYPE_RE.search(raw)
    doc['form'] = t.group(1).decode() if t else (doc['doc_type'] or '4')
    if doc['doc_type'] and doc['form'] not in ('4', '4/A'):
        doc['form'] = doc['doc_type']
    return doc


def _sum(rows: List[Dict]) -> Dict:
    sh = sum(r['shares'] or 0 for r in rows)
    priced = [r for r in rows if r['shares'] and r['price']]
    val = sum(r['shares'] * r['price'] for r in priced)
    psh = sum(r['shares'] for r in priced)
    return {'shares': sh, 'value': round(val, 2) if priced else None, 'price': round(val / psh, 4) if psh else None}


def filing_trades(doc: Dict, code: str = 'P') -> Optional[Dict]:
    """The filing's rows of one code summed into one trade, or None when it has none. Holdings change: shares bought /
    (shares owned after the last such row - shares bought on that ownership line) in percent; None = unknown, 'new'
    position = nothing held before (pct None, new True)."""
    rows = [r for r in doc['rows'] if r['code'] == code and (r['shares'] or 0) > 0]
    if code == 'P':
        rows = [r for r in rows if r['ad'] in ('A', '')]
    if not rows:
        return None
    s = _sum(rows)
    owner = (doc['owners'] or [{}])[0]
    last = rows[-1]
    line = [r for r in rows if r['direct'] == last['direct']]
    moved = sum(r['shares'] or 0 for r in line)
    after = last['after']
    pct, new = None, False
    if after is not None and code == 'P':
        before = after - moved
        if before <= 0.5:
            new = True
        else:
            pct = round(moved / before * 100, 1)
    elif after is not None and code == 'S':
        before = after + moved
        pct = round(-moved / before * 100, 1) if before > 0 else None
    notes = list(dict.fromkeys(n for r in rows for n in r['notes']))
    dates = sorted(r['date'] for r in rows if r['date'])
    return {'code': code, 'cik': doc['issuer']['cik'], 'sym': doc['issuer']['sym'], 'name': doc['issuer']['name'],
            'owner': owner.get('name', ''), 'owner_cik': owner.get('cik', ''), 'role': owner.get('role', 'Other'),
            'ceo': bool(owner.get('ceo')), 'cfo': bool(owner.get('cfo')), 'officer': bool(owner.get('officer')),
            'director': bool(owner.get('director')), 'ten': bool(owner.get('ten')),
            'joint': len(doc['owners']) > 1, 'shares': s['shares'], 'price': s['price'], 'value': s['value'],
            'date': dates[-1] if dates else doc.get('period', ''), 'first': dates[0] if dates else doc.get('period', ''),
            'after': after, 'pct': pct, 'new': new, 'n_tx': len(rows), 'plan': bool(doc.get('plan')),
            'note': notes[0][:160] if notes else '', 'form': doc.get('form', '4'), 'accepted': doc.get('accepted', '')}
