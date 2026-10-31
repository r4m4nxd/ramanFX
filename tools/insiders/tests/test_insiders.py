"""Insider activity (tools/insiders), offline: Form 4 XML parsing, clusters, early buys, score, dedupe / amendments, big
sales, planned sales (Form 144), 13D, alerts, the Telegram message and full runs on fake SEC answers. The parsers and
the committed fixtures: test_forms.py."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import form4 as F  # noqa: E402
import insiders as I  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 29, 20, 0, tzinfo=UTC)      # Thu 4 PM New York
TODAY = dt.date(2026, 10, 29)


def xml(sym='XYZ', cik='0000111111', owner='Doe Jane', ocik='0000222222', title='Chief Executive Officer', director='1',
        rows=(('2026-10-27', 'P', '10000', '12.10', '60000'),), doc='4', extra_owner=False, foot_price=False, period=None):
    tx = []
    for d, code, sh, pr, after in rows:
        price = (f'<transactionPricePerShare><value>{pr}</value><footnoteId id="F1"/></transactionPricePerShare>' if pr is not None
                 else '<transactionPricePerShare><footnoteId id="F2"/></transactionPricePerShare>')
        ad = 'A' if code == 'P' else 'D'
        tx.append(f"""<nonDerivativeTransaction><securityTitle><value>Common Stock</value></securityTitle>
<transactionDate><value>{d}</value></transactionDate>
<transactionCoding><transactionFormType>4</transactionFormType><transactionCode>{code}</transactionCode><equitySwapInvolved>0</equitySwapInvolved></transactionCoding>
<transactionAmounts><transactionShares><value>{sh}</value></transactionShares>{price}
<transactionAcquiredDisposedCode><value>{ad}</value></transactionAcquiredDisposedCode></transactionAmounts>
<postTransactionAmounts><sharesOwnedFollowingTransaction><value>{after}</value></sharesOwnedFollowingTransaction></postTransactionAmounts>
<ownershipNature><directOrIndirectOwnership><value>D</value></directOrIndirectOwnership></ownershipNature></nonDerivativeTransaction>""")
    owner2 = """<reportingOwner><reportingOwnerId><rptOwnerCik>0000333333</rptOwnerCik><rptOwnerName>Doe Family Trust</rptOwnerName></reportingOwnerId>
<reportingOwnerRelationship><isTenPercentOwner>1</isTenPercentOwner></reportingOwnerRelationship></reportingOwner>""" if extra_owner else ''
    return f"""<?xml version="1.0"?>
<ownershipDocument><schemaVersion>X0508</schemaVersion><documentType>{doc}</documentType><periodOfReport>{period or rows[0][0]}</periodOfReport>
<issuer><issuerCik>{cik}</issuerCik><issuerName>XYZ Corp</issuerName><issuerTradingSymbol>{sym}</issuerTradingSymbol></issuer>
<reportingOwner><reportingOwnerId><rptOwnerCik>{ocik}</rptOwnerCik><rptOwnerName>{owner}</rptOwnerName></reportingOwnerId>
<reportingOwnerRelationship><isDirector>{director}</isDirector><isOfficer>{'1' if title else '0'}</isOfficer><officerTitle>{title}</officerTitle><isTenPercentOwner>0</isTenPercentOwner><isOther>0</isOther></reportingOwnerRelationship></reportingOwner>
{owner2}<aff10b5One>0</aff10b5One>
<nonDerivativeTable>{''.join(tx)}</nonDerivativeTable>
<derivativeTable><derivativeTransaction><securityTitle><value>Option</value></securityTitle><transactionCoding><transactionCode>P</transactionCode></transactionCoding></derivativeTransaction></derivativeTable>
<footnotes><footnote id="F1">The price reported is a weighted average price. Prices ranged from $12.00 to $12.20.</footnote><footnote id="F2">Price not determinable.</footnote></footnotes>
</ownershipDocument>""".encode()


def submission(body: bytes, form='4', accepted='20261028163005') -> bytes:
    return (f"""<SEC-DOCUMENT>0000111111-26-000001.txt : 20261028
<SEC-HEADER>0000111111-26-000001.hdr.sgml : 20261028
<ACCEPTANCE-DATETIME>{accepted}
ACCESSION NUMBER:		0000111111-26-000001
CONFORMED SUBMISSION TYPE:	{form}
</SEC-HEADER>
<DOCUMENT>
<TYPE>{form}
<SEQUENCE>1
<FILENAME>wf-form4.xml
<TEXT>
<XML>
""").encode() + body + b"\n</XML>\n</TEXT>\n</DOCUMENT>\n</SEC-DOCUMENT>\n"


def buy(owner, date, value, cik='111', sym='XYZ', ceo=False, cfo=False, officer=False, director=True, price=12.0, pct=10.0,
        acc=None, filed='2026-10-28T20:30:00Z', form='4', new=False):
    role = 'CEO' if ceo else 'CFO' if cfo else 'Director'
    return {'code': 'P', 'cik': cik, 'sym': sym, 'name': f'{sym} Corp', 'owner': owner, 'owner_cik': owner.lower(), 'role': role,
            'ceo': ceo, 'cfo': cfo, 'officer': officer or ceo or cfo, 'director': director, 'ten': False, 'joint': False,
            'shares': value / price, 'price': price, 'value': value, 'date': date, 'first': date, 'after': None, 'pct': pct,
            'new': new, 'n_tx': 1, 'plan': False, 'note': '', 'form': form, 'acc': acc or f'acc-{owner}-{date}',
            'url': f'https://www.sec.gov/x/{owner}', 'filed': filed}


class FakeCtx(I.Context):
    def __init__(self, rows=None, details=None, fund=None):
        self.rows = rows or {}
        self._d = details or {}
        self.fund = fund or {}

    def detail(self, sym):
        return self._d.get(sym, {})


class TestForm4(unittest.TestCase):
    def test_purchase_rows_footnotes_and_roles(self):
        doc = F.parse_submission(submission(xml(rows=(('2026-10-27', 'P', '10000', '12.10', '60000'),
                                                      ('2026-10-28', 'P', '5,000', '12.40', '65000'),
                                                      ('2026-10-28', 'M', '3000', '4.00', '68000'),
                                                      ('2026-10-28', 'F', '1000', '12.40', '67000')))))
        self.assertEqual(doc['form'], '4')
        self.assertEqual(doc['accepted'], '2026-10-28T16:30:05')
        self.assertEqual(doc['issuer'], {'cik': '111111', 'name': 'XYZ Corp', 'sym': 'XYZ'})
        self.assertEqual(len(doc['rows']), 4)                          # the derivative P row is not a stock row
        self.assertIn('weighted average', doc['rows'][0]['notes'][0])
        o = doc['owners'][0]
        self.assertTrue(o['ceo'] and o['director'] and not o['cfo'])
        self.assertEqual(o['role'], 'CEO · Director')
        p = F.filing_trades(doc, 'P')
        self.assertEqual(p['shares'], 15000)
        self.assertAlmostEqual(p['value'], 10000 * 12.10 + 5000 * 12.40)
        self.assertAlmostEqual(p['price'], round((121000 + 62000) / 15000, 4))
        self.assertEqual((p['first'], p['date'], p['n_tx']), ('2026-10-27', '2026-10-28', 2))
        self.assertAlmostEqual(p['pct'], round(15000 / (65000 - 15000) * 100, 1))   # +30% holdings
        self.assertIn('weighted average', p['note'])
        self.assertIsNone(F.filing_trades(doc, 'S'))

    def test_only_code_p_counts(self):
        doc = F.parse_xml(xml(rows=(('2026-10-27', 'A', '10000', '0', '60000'), ('2026-10-27', 'G', '100', '0', '59900'),
                                    ('2026-10-27', 'S', '2000', '15.00', '57900'))))
        self.assertIsNone(F.filing_trades(doc, 'P'))
        s = F.filing_trades(doc, 'S')
        self.assertEqual((s['shares'], s['value']), (2000, 30000.0))
        self.assertLess(s['pct'], 0)

    def test_price_only_in_a_footnote_and_new_position(self):
        doc = F.parse_xml(xml(rows=(('2026-10-27', 'P', '1000', None, '1000'),)))
        p = F.filing_trades(doc, 'P')
        self.assertIsNone(p['price'])
        self.assertIsNone(p['value'])
        self.assertTrue(p['new'])
        self.assertIn('not determinable', p['note'])

    def test_joint_filers_are_one_insider_and_cfo_title(self):
        doc = F.parse_xml(xml(title='EVP &amp; Chief Financial Officer', director='0', extra_owner=True))
        self.assertEqual(len(doc['owners']), 2)
        p = F.filing_trades(doc, 'P')
        self.assertTrue(p['joint'] and p['cfo'] and not p['ceo'])
        self.assertEqual(p['owner'], 'Doe Jane')
        self.assertEqual(F.parse_xml(xml(title='', director='1'))['owners'][0]['role'], 'Director')
        self.assertEqual(F.parse_xml(xml(title='President and COO', director='0'))['owners'][0]['role'], 'President')

    def test_amendment_form_and_bare_xml(self):
        d = F.parse_submission(submission(xml(doc='4/A'), form='4/A'))
        self.assertEqual(d['form'], '4/A')
        self.assertEqual(F.parse_submission(xml())['form'], '4')
        with self.assertRaises(Exception):
            F.parse_submission(b'<html>rate limited</html>')


class TestFeedIndex(unittest.TestCase):
    FEED = """<feed><entry><title>4 - Doe Jane (0000222222) (Reporting)</title>
<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/222222/000011111126000001/0000111111-26-000001-index.htm"/>
<updated>2026-10-28T16:30:05-04:00</updated><category scheme="https://www.sec.gov/" label="form type" term="4"/>
<id>urn:tag:sec.gov,2008:accession-number=0000111111-26-000001</id></entry>
<entry><title>4 - XYZ Corp (0000111111) (Issuer)</title>
<link rel="alternate" type="text/html" href="https://www.sec.gov/Archives/edgar/data/111111/000011111126000001/0000111111-26-000001-index.htm"/>
<updated>2026-10-28T16:30:05-04:00</updated><category scheme="https://www.sec.gov/" label="form type" term="4"/>
<id>urn:tag:sec.gov,2008:accession-number=0000111111-26-000001</id></entry>
<entry><title>3 - Someone</title><link href="https://www.sec.gov/Archives/edgar/data/9/x"/><category term="3"/>
<id>urn:tag:sec.gov,2008:accession-number=0000000009-26-000009</id></entry></feed>"""

    def test_feed_one_ref_per_accession(self):
        refs = I.parse_feed(self.FEED)
        self.assertEqual(len(refs), 1)
        self.assertEqual(refs[0]['acc'], '0000111111-26-000001')
        self.assertEqual(I.txt_url(refs[0]), 'https://www.sec.gov/Archives/edgar/data/222222/000011111126000001/0000111111-26-000001.txt')

    def test_daily_index(self):
        text = """Form Type   Company Name                                                  CIK         Date Filed  File Name
---------------------------------------------------------------------------------------------------------------------------------------------
3           SOMEONE                                                       999         20261028    edgar/data/999/0000000999-26-000001.txt
4           XYZ Corp                                                      111111      20261028    edgar/data/111111/0000111111-26-000001.txt
4           Doe Jane                                                      222222      20261028    edgar/data/222222/0000111111-26-000001.txt
4/A         ABC Inc                                                       444         20261028    edgar/data/444/0000000444-26-000002.txt
424B2       BANK                                                          5           20261028    edgar/data/5/0000000005-26-000003.txt
"""
        refs = I.parse_daily_index(text)
        self.assertEqual([(r['acc'], r['form']) for r in refs], [('0000111111-26-000001', '4'), ('0000000444-26-000002', '4/A')])
        self.assertEqual(I.daily_url(dt.date(2026, 10, 28)), 'https://www.sec.gov/Archives/edgar/daily-index/2026/QTR4/form.20261028.idx')

    def test_accepted_is_new_york_time(self):
        self.assertEqual(I.accepted_utc('2026-10-28T16:30:05'), '2026-10-28T20:30:05Z')   # EDT
        self.assertEqual(I.accepted_utc('2026-11-03T16:30:05'), '2026-11-03T21:30:05Z')   # EST
        self.assertEqual(I.accepted_utc(''), '')

    def test_user_agent_sources(self):
        self.assertEqual(I.user_agent({'SEC_UA': ' RamanFX x@y ', 'SEC_CONTACT': 'z'}), 'RamanFX x@y')
        self.assertEqual(I.user_agent({'SEC_CONTACT': 'z@w'}), 'RamanFX insiders z@w')
        self.assertIsNone(I.user_agent({}))
        self.assertIsNone(I.user_agent({'SEC_UA': ' ', 'SEC_CONTACT': ''}))


class TestDedupe(unittest.TestCase):
    def test_accession_dedupe_and_amendments(self):
        lst = []
        a = buy('A', '2026-10-27', 50000, acc='1')
        self.assertTrue(I.add_record(lst, a))
        self.assertFalse(I.add_record(lst, dict(a)))                 # same accession again
        amend = buy('A', '2026-10-27', 80000, acc='2', form='4/A', filed='2026-10-29T12:00:00Z')
        self.assertTrue(I.add_record(lst, amend))
        self.assertEqual([x['acc'] for x in lst], ['2'])             # the 4/A replaced the original
        self.assertFalse(I.add_record(lst, buy('A', '2026-10-27', 50000, acc='3')))   # an original read after its 4/A
        self.assertTrue(I.add_record(lst, buy('A', '2026-10-20', 50000, acc='4')))    # another date: kept
        self.assertEqual(len(lst), 2)

    def test_amendment_without_purchases_withdraws_the_original(self):
        st = I.load_state('/nonexistent')
        ref = {'acc': '0000111111-26-000001', 'cik': '111111'}
        I.ingest(st, ref, submission(xml()), set())
        self.assertEqual(len(st['buys']), 1)
        ref2 = {'acc': '0000111111-26-000002', 'cik': '111111'}
        I.ingest(st, ref2, submission(xml(doc='4/A', rows=(('2026-10-27', 'A', '10000', '0', '60000'),)), form='4/A'), set())
        self.assertEqual(st['buys'], [])

    def test_sells_kept_for_the_scanner_universe_only(self):
        st = I.load_state('/nonexistent')
        s = xml(rows=(('2026-10-27', 'S', '1000', '20', '5000'),))
        I.ingest(st, {'acc': '1', 'cik': '1'}, submission(s), {'XYZ'})
        I.ingest(st, {'acc': '2', 'cik': '1'}, submission(xml(sym='ZZZ', rows=(('2026-10-27', 'S', '1000', '20', '5000'),))), {'XYZ'})
        self.assertEqual([x['sym'] for x in st['sells']], ['XYZ'])
        self.assertEqual(I.ingest(st, {'acc': '3', 'cik': '1'}, b'garbage', set()), 0)


class TestClusters(unittest.TestCase):
    def test_cluster_window_distinct_insiders(self):
        bs = [buy('A', '2026-10-01', 50000), buy('B', '2026-10-10', 50000), buy('C', '2026-10-14', 50000),
              buy('A', '2026-10-20', 50000), buy('D', '2026-10-28', 50000)]
        cl = I.find_clusters(bs, TODAY)
        self.assertEqual(len(cl), 1)
        c = cl[0]
        self.assertEqual((c['kind'], c['n'], c['strong']), ('cluster', 3, True))
        # windows: 10-01..10-15 = A B C (3), 10-10..10-24 = B C A (3, later wins), 10-14..10-28 = C A D (3, latest)
        self.assertEqual((c['first'], c['last']), ('2026-10-14', '2026-10-28'))
        self.assertTrue(c['repeat'])                                    # A bought on 10-01 and 10-20

    def test_one_insider_twice_is_no_cluster(self):
        self.assertEqual(I.find_clusters([buy('A', '2026-10-20', 50000), buy('A', '2026-10-22', 50000)], TODAY), [])

    def test_micro_penny_tiny_cap_and_old_buys_dropped(self):
        bs = [buy('A', '2026-10-20', 9000), buy('B', '2026-10-21', 50000, price=1.5), buy('C', '2026-10-22', 50000),
              buy('D', '2026-09-01', 50000)]
        self.assertEqual(I.find_clusters(bs, TODAY), [])
        two = [buy('A', '2026-10-20', 50000), buy('B', '2026-10-21', 50000)]
        self.assertEqual(len(I.find_clusters(two, TODAY)), 1)
        self.assertEqual(I.find_clusters(two, TODAY, mcap_of=lambda s: 20e6), [])   # tiny cap

    def test_big_solo_buy_ceo_cfo_only(self):
        self.assertEqual(I.find_clusters([buy('A', '2026-10-20', 900000)], TODAY), [])          # a director
        c = I.find_clusters([buy('A', '2026-10-20', 300000, ceo=True)], TODAY)[0]
        self.assertEqual((c['kind'], c['n'], c['lead']['role']), ('solo', 1, 'CEO'))
        self.assertEqual(I.find_clusters([buy('A', '2026-10-20', 200000, cfo=True)], TODAY), [])  # under $250k


class TestScore(unittest.TestCase):
    def test_score_parts(self):
        c = I.find_clusters([buy('A', '2026-10-20', 1_500_000, ceo=True, pct=18), buy('B', '2026-10-21', 300000),
                             buy('C', '2026-10-22', 300000)], TODAY)[0]
        s, why = I.score(c, 1e9, {'tf': 'W1', 'where': 'inside', 'lo': 11.9, 'hi': 12.6, 'dist': 0})
        # 3 insiders 3.5 + CEO 2 + $2.1M / $1B = 0.21% -> 1.5 + holdings 18% -> 0.5 + inside W1 2
        self.assertEqual(s, 9.5)
        self.assertEqual(why[0], '3 insiders 3.5')
        s2, _ = I.score(c, None, None)                                  # $2.1M absolute -> 1, no zone
        self.assertEqual(s2, 7.0)
        solo = I.find_clusters([buy('A', '2026-10-20', 300000, ceo=True, pct=None, new=True)], TODAY)[0]
        self.assertEqual(I.score(solo, None, None)[0], 1 + 2 + 0.5 + 1.5)

    def test_zone_at(self):
        zs = [{'tf': 'W1', 'side': 'demand', 'proximal': 12.6, 'distal': 11.9}, {'tf': 'D1', 'side': 'demand', 'proximal': 13, 'distal': 12},
              {'tf': 'MN', 'side': 'demand', 'proximal': 10, 'distal': 9}, {'tf': 'MN', 'side': 'supply', 'proximal': 12, 'distal': 13}]
        self.assertEqual(I.zone_at(12.4, zs)['tf'], 'W1')
        self.assertEqual(I.zone_at(12.4, zs)['where'], 'inside')
        n = I.zone_at(10.3, zs)
        self.assertEqual((n['tf'], n['where'], n['dist']), ('MN', 'near', 3.0))
        self.assertIsNone(I.zone_at(11.0, zs))                          # 10% above the MN demand
        self.assertIsNone(I.zone_at(None, zs))

    def test_enrich_star_and_order(self):
        strong = I.find_clusters([buy('A', '2026-10-20', 100000, cik='1'), buy('B', '2026-10-21', 100000, cik='1'),
                                  buy('C', '2026-10-22', 100000, cik='1')], TODAY)
        weak = I.find_clusters([buy('A', '2026-10-20', 5_000_000, cik='2', sym='BIG', ceo=True), buy('B', '2026-10-21', 5_000_000, cik='2', sym='BIG')], TODAY)
        ctx = FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}, 'BIG': {'s': 'BIG', 'k': 2}},
                      details={'XYZ': {'price': 12.4, 'zones': [{'tf': 'W1', 'side': 'demand', 'proximal': 12.6, 'distal': 11.9}], 'w1': 'UP'}},
                      fund={'XYZ': {'pe': 9.2, 'er_next': '2026-11-12', 'mcap': 500e6}})
        out = I.enrich(strong + weak, ctx)
        self.assertEqual(out[0]['sym'], 'XYZ')
        self.assertTrue(out[0]['star'])
        self.assertFalse(out[1]['star'])
        self.assertEqual(out[0]['trend'], 'W1 up')


class TestAlerts(unittest.TestCase):
    def cl(self, owners='ABC', filed='2026-10-29T19:00:00Z'):
        bs = [buy(o, f'2026-10-2{k}', 400000, ceo=(o == 'A'), filed=filed) for k, o in enumerate(owners)]
        return I.enrich(I.find_clusters(bs, TODAY), FakeCtx()), {b['acc'] for b in bs}

    def test_only_new_and_above_the_bar(self):
        cs, accs = self.cl()
        self.assertEqual(len(I.to_alert(cs, accs, {}, NOW)), 1)
        self.assertEqual(I.to_alert(cs, set(), {}, NOW), [])                     # nothing read this run
        old, accs2 = self.cl(filed='2026-10-20T19:00:00Z')
        self.assertEqual(I.to_alert(old, accs2, {}, NOW), [])                    # backfilled, filed days ago
        weak = I.enrich(I.find_clusters([buy('X', '2026-10-27', 20000), buy('Y', '2026-10-28', 20000)], TODAY), FakeCtx())
        self.assertLess(weak[0]['score'], I.CFG['score_bar'])
        self.assertEqual(I.to_alert(weak, {b for c in weak for i in c['insiders'] for b in i['accs']}, {}, NOW), [])

    def test_sent_once_again_only_when_it_grows(self):
        cs, accs = self.cl('AB')
        sent = {cs[0]['cik']: {'n': 2, 'kind': 'cluster', 'last': cs[0]['last'], 'at': '2026-10-29T15:00:00Z'}}
        self.assertEqual(I.to_alert(cs, accs, sent, NOW), [])
        cs3, accs3 = self.cl('ABC')
        self.assertEqual(len(I.to_alert(cs3, accs3, sent, NOW)), 1)

    def test_message_format(self):
        c = I.find_clusters([buy('A', '2026-10-24', 1_500_000, ceo=True, pct=18), buy('B', '2026-10-27', 300000),
                             buy('C', '2026-10-28', 300000, filed='2026-10-29T19:25:00Z')], TODAY)
        ctx = FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}},
                      details={'XYZ': {'price': 12.4, 'zones': [{'tf': 'W1', 'side': 'demand', 'proximal': 12.6, 'distal': 11.9}]}},
                      fund={'XYZ': {'pe': 9.2, 'er_next': '2026-11-12'}})
        cs = I.enrich(c, ctx)
        m = I.build_message(cs, TODAY, now=NOW)
        # the cluster span stays in the detail line; the head line names the latest trade and calls out the newest filing
        self.assertTrue(str(m).startswith('🕵️ Insider cluster buy · <b>XYZ</b> $12.40 · 3 insiders · $2.1M · CEO +18% holdings · '
                                          'latest trade Oct 28 · newest filing 35m ago · '
                                          '⭐ inside W1 demand 11.90–12.60 · P/E 9 · earnings Nov 12'), str(m))
        self.assertIn('Oct 24–Oct 28', str(m))
        self.assertEqual([b.get('callback_data') for b in m.buttons[0][:3]], ['c:XYZ', 'f:XYZ', 'h:XYZ'])
        self.assertEqual(m.buttons[0][3]['text'], '🔗 SEC')
        self.assertTrue(m.buttons[0][3]['url'].startswith('https://www.sec.gov/'))
        self.assertEqual(m.n_alerts, 1)
        self.assertIn('latest trade Oct 28', I.line(cs[0], TODAY))                  # the brief has no clock: the date only
        self.assertNotIn('ago', I.line(cs[0], TODAY))
        two = I.build_message(cs + I.enrich(I.find_clusters([buy('Q', '2026-10-28', 300000, cik='9', sym='OTC1', cfo=True)], TODAY), FakeCtx()), TODAY, now=NOW)
        self.assertTrue(str(two).startswith('🕵️ <b>2 new insider buys</b>'))
        self.assertIn('Big solo buy · <b>OTC1</b>', str(two))
        self.assertEqual(len(two.buttons[1]), 1)                                  # not in the scanner: SEC link only
        s = I.build_message(cs, TODAY, sample=True)
        self.assertTrue(str(s).startswith('🧪 <b>Sample insider buys</b>'))
        self.assertIsNone(I.build_message([], TODAY))

    def test_ago(self):
        self.assertEqual(I.ago('2026-10-29T19:59:30Z', NOW), 'just now')
        self.assertEqual(I.ago('2026-10-29T19:25:00Z', NOW), '35m ago')
        self.assertEqual(I.ago('2026-10-29T16:50:00Z', NOW), '3h ago')
        self.assertEqual(I.ago('2026-10-26T20:00:00Z', NOW), '3d ago')
        self.assertEqual(I.ago('', NOW), '')
        self.assertEqual(I.ago('2026-10-29T19:25:00Z', None), '')
        self.assertEqual(I.fresh_s('bought', '2026-10-27', 'filed', '2026-10-29T16:50:00Z', NOW), 'bought Oct 27 · filed 3h ago')
        self.assertEqual(I.fresh_s('bought', '2026-10-27', 'filed', '', None), 'bought Oct 27')


class TestRun(unittest.TestCase):
    def test_full_run_feed_backfill_alert_cap_and_output(self):
        feed_xml = TestFeedIndex.FEED
        subs = {}
        owners = [('A', 'Chief Executive Officer', '2026-10-27', '20261029120000'), ('B', '', '2026-10-28', '20261029130000'),
                  ('C', '', '2026-10-28', '20261029140000')]
        entries, idx = [], []
        for k, (o, t, d, acc_t) in enumerate(owners):
            acc = f'0000111111-26-00000{k + 1}'
            subs[acc] = submission(xml(owner=o, ocik=f'00009{k}', title=t, rows=((d, 'P', '20000', '20.00', '100000'),)), accepted=acc_t)
            entries.append(feed_xml.split('<entry>')[1].replace('0000111111-26-000001', acc).replace('000011111126000001', acc.replace('-', '')))
        feed = '<feed>' + ''.join(f'<entry>{e}' for e in entries) + '</feed>'
        idx_text = '4           XYZ Corp     111111      20261028    edgar/data/111111/0000111111-26-000009.txt\n'
        subs['0000111111-26-000009'] = submission(xml(owner='D', ocik='000099', title='', rows=(('2026-10-20', 'P', '1000', '20', '5000'),)))
        calls = []

        def get(url):
            calls.append(url)
            if 'getcurrent' in url:
                if 'start=0&' in url:
                    return feed.encode()
                return b'<feed></feed>'
            if 'daily-index' in url:
                if 'form.20261028' in url:
                    return idx_text.encode()
                import urllib.error
                raise urllib.error.HTTPError(url, 404, 'nf', {}, None)
            acc = url.rsplit('/', 1)[1][:-4]
            return subs[acc]
        ctx = FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}},
                      details={'XYZ': {'price': 20.5, 'zones': [{'tf': 'MN', 'side': 'demand', 'proximal': 21, 'distal': 19}]}},
                      fund={'XYZ': {'mcap': 300e6}})
        sent = []
        with tempfile.TemporaryDirectory() as d:
            sp, lp = os.path.join(d, 'state.json'), os.path.join(d, 'latest.json')
            msg = I.run(NOW, get, prefs=None, state_path=sp, latest_path=lp, ctx=ctx, send=lambda m: sent.append(m) or True,
                        feed_s=60, backfill_s=60)
            self.assertIsNotNone(msg)
            self.assertEqual(len(sent), 1)
            self.assertIn('4 insiders', str(sent[0]))
            self.assertIn('⭐ inside MN demand', str(sent[0]))
            js = I.load_json(lp, {})
            self.assertEqual(js['clusters'][0]['sym'], 'XYZ')
            self.assertEqual(js['by_sym']['XYZ']['buyers'], 4)
            self.assertEqual(len(js['buys']), 4)
            self.assertIn(js['clusters'][0]['cik'], js['alerted'])
            st = I.load_json(sp, {})
            self.assertEqual(len(st['seen']), 4)
            self.assertIn('20261028', st['days_done'])
            # second run: nothing new -> no message, no refetch of seen filings, file unchanged
            n_calls = len(calls)
            sent.clear()
            self.assertIsNone(I.run(NOW + dt.timedelta(minutes=30), get, state_path=sp, latest_path=lp, ctx=ctx,
                                    send=lambda m: sent.append(m) or True))
            self.assertEqual(sent, [])
            self.assertFalse(any(u.endswith('.txt') for u in calls[n_calls:]))
            # cache evicted: the committed file's 'alerted' still prevents a repeat
            os.remove(sp)
            I.run(NOW + dt.timedelta(minutes=60), get, state_path=sp, latest_path=lp, ctx=ctx, send=lambda m: sent.append(m) or True)
            self.assertEqual(sent, [])
            # sample: ONE message, whatever was sent before
            m = I.run(NOW, None, sample=True, state_path=sp, latest_path=lp, ctx=ctx, send=lambda m: sent.append(m) or True)
            self.assertEqual(len(sent), 1)
            self.assertTrue(str(m).startswith('🧪 <b>Sample insider buys</b>'))

    def test_daily_cap(self):
        cs = []
        for k in range(8):
            cs += I.find_clusters([buy('A', '2026-10-27', 400000, cik=str(k), sym=f'S{k}', ceo=True), buy('B', '2026-10-28', 400000, cik=str(k), sym=f'S{k}')], TODAY)
        accs = {a for c in cs for i in c['insiders'] for a in i['accs']}
        with tempfile.TemporaryDirectory() as d, mock.patch.object(I, 'find_clusters', return_value=cs), \
                mock.patch.object(I, 'collect', return_value=(accs, {'feed': 0, 'backfill': 0, 'buys': 0, 'days_done': 0})):
            sent = []
            I.run(NOW, lambda u: b'', state_path=os.path.join(d, 's.json'), latest_path=os.path.join(d, 'l.json'), ctx=FakeCtx(),
                  send=lambda m: sent.append(m) or True)
            self.assertEqual(str(sent[0]).count('Insider cluster buy'), 6)

    def test_no_user_agent_skips_sec(self):
        with tempfile.TemporaryDirectory() as d, mock.patch('builtins.print') as pr:
            self.assertIsNone(I.run(NOW, None, state_path=os.path.join(d, 's.json'), latest_path=os.path.join(d, 'l.json'),
                                    ctx=FakeCtx(), send=lambda m: True))
            self.assertTrue(any('SEC: skipped' in str(c) for c in pr.call_args_list))


class TestPublished(unittest.TestCase):
    def test_brief_lines_and_staleness(self):
        cs = I.enrich(I.find_clusters([buy('A', '2026-10-27', 400000, ceo=True), buy('B', '2026-10-28', 400000), buy('C', '2026-10-28', 50000)], TODAY),
                      FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}}, details={'XYZ': {'price': 12.4, 'zones': [{'tf': 'W1', 'side': 'demand', 'proximal': 12.6, 'distal': 11.9}]}}))
        js = {'generated': '2026-10-29T19:00:00Z', 'clusters': [I._clean(c) for c in cs]}
        ls = I.brief_lines(js, TODAY)
        self.assertEqual(len(ls), 1)
        self.assertTrue(ls[0].startswith('⭐ <b>XYZ</b> $12.40 · 3 insiders'), ls[0])
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'l.json')
            with open(p, 'w') as f:
                json.dump(js, f)
            self.assertIsNotNone(I.load_published(NOW, p))
            self.assertIsNone(I.load_published(NOW + dt.timedelta(days=5), p))          # stalled job: not quoted
        self.assertEqual(I.brief_lines(None, TODAY), [])


if __name__ == '__main__':
    unittest.main()


FIX = os.path.join(HERE, 'fixtures')


def fixture(name: str) -> bytes:
    with open(os.path.join(FIX, name), 'rb') as f:
        return f.read()


NOW2 = dt.datetime(2026, 10, 30, 14, 0, tzinfo=UTC)        # Fri 10:00 New York, after every fixture filing
TODAY2 = dt.date(2026, 10, 30)


def sale(owner, date, value, cik='111', sym='XYZ', ceo=False, cfo=False, top=False, ten=False, plan=False, cover=False, price=100.0,
         acc=None, filed='2026-10-29T20:12:05Z', pct=-5.0):
    return {'code': 'S', 'cik': cik, 'sym': sym, 'name': f'{sym} Corp', 'owner': owner, 'owner_cik': owner.lower(), 'role': 'CEO' if ceo else 'CFO' if cfo else 'Director',
            'ceo': ceo, 'cfo': cfo, 'top': top, 'officer': ceo or cfo or top, 'director': not (ceo or cfo or top), 'ten': ten, 'joint': False,
            'shares': value / price, 'price': price, 'value': value, 'date': date, 'first': date, 'after': 1000.0, 'pct': pct, 'new': False, 'n_tx': 1,
            'plan': plan, 'cover': cover, 'note': '', 'form': '4', 'acc': acc or f'sell-{owner}-{date}', 'url': f'https://www.sec.gov/x/{owner}', 'filed': filed}


class TestEarly(unittest.TestCase):
    def test_thresholds(self):
        e = I.is_early
        self.assertTrue(e(buy('A', '2026-10-27', 100_000, ceo=True)))
        self.assertFalse(e(buy('A', '2026-10-27', 99_999, ceo=True)))
        self.assertTrue(e(buy('A', '2026-10-27', 150_000, cfo=True)))
        top = dict(buy('A', '2026-10-27', 100_000), top=True)               # President / COO / Chair
        self.assertTrue(e(top))
        self.assertFalse(e(dict(top, value=99_000)))
        self.assertFalse(e(buy('A', '2026-10-27', 499_999)))                # a director under $500k
        self.assertTrue(e(buy('A', '2026-10-27', 500_000)))
        self.assertTrue(e(dict(buy('A', '2026-10-27', 500_000), ten=True)))
        self.assertFalse(e(dict(buy('A', '2026-10-27', 400_000), ten=True)))
        self.assertTrue(e(buy('A', '2026-10-27', 60_000, ceo=True), dict(I.CFG, early_top_min=50_000)))   # env override

    def test_find_early_one_item_per_issuer(self):
        bs = [buy('A', '2026-10-20', 120_000, ceo=True), buy('B', '2026-10-21', 700_000), buy('C', '2026-10-22', 50_000, cik='2', sym='ABC', ceo=True)]
        out = I.find_early(bs, TODAY)
        self.assertEqual([(c['cik'], c['kind'], c['n'], c['value']) for c in out], [('111', 'early', 1, 700_000)])    # the biggest; ABC too small
        self.assertEqual(I.find_early([buy('A', '2026-10-20', 900_000, price=1.5)], TODAY), [])                  # penny stock
        self.assertEqual(I.find_early([buy('A', '2026-10-20', 900_000)], TODAY, mcap_of=lambda s: 20e6), [])      # tiny cap

    def alerts(self, bs, new, alerted=None, now=NOW):
        cls = I.enrich(I.find_clusters(bs, TODAY), FakeCtx())
        early = I.enrich(I.find_early(bs, TODAY), FakeCtx())
        return I.to_alert(cls + early, new, alerted or {}, now)

    def test_alerts_at_once_without_the_score_bar(self):
        a = buy('A', '2026-10-28', 120_000, ceo=True, filed='2026-10-29T19:25:00Z', acc='a1')
        out = self.alerts([a], {'a1'})
        self.assertEqual([c['kind'] for c in out], ['early'])
        self.assertLess(out[0]['score'], I.CFG['score_bar'])                 # a lone $120k CEO buy scores 4: no cluster / solo alert
        self.assertEqual(I.to_alert(I.enrich(I.find_clusters([a], TODAY), FakeCtx()), {'a1'}, {}, NOW), [])
        m = I.build_message(out, TODAY, now=NOW)
        self.assertTrue(str(m).startswith('🕵️ Insider buy · <b>XYZ</b> $12.00 · early · 1 insider so far · $120K · CEO +10% holdings · '
                                          'bought Oct 28 · filed 35m ago'), str(m))
        self.assertEqual(self.alerts([a], set()), [])                         # not read this run
        self.assertEqual(self.alerts([a], {'a1'}, now=NOW + dt.timedelta(days=3)), [])   # filed days ago (a backfill): silent

    def test_not_repeated_then_the_cluster_follows_when_others_join(self):
        a = buy('A', '2026-10-27', 300_000, ceo=True, acc='a1')
        sent = {'111': {'n': 1, 'kind': 'early', 'last': '2026-10-27', 'at': '2026-10-28T20:40:00Z'}}
        self.assertEqual(self.alerts([a], {'a1'}, sent), [])                  # the same early buy again: nothing
        a2 = buy('A', '2026-10-28', 500_000, ceo=True, acc='a2')              # the same insider buys more: still one insider
        self.assertEqual(self.alerts([a, a2], {'a2'}, sent), [])
        b = buy('B', '2026-10-29', 400_000, acc='b1', filed='2026-10-29T19:00:00Z')
        out = self.alerts([a, a2, b], {'b1'}, sent)                           # a second insider: the cluster follows (existing growth rule)
        self.assertEqual([(c['kind'], c['n']) for c in out], [('cluster', 2)])
        sent2 = {'111': {'n': 2, 'kind': 'cluster', 'last': '2026-10-29', 'at': '2026-10-29T19:30:00Z'}}
        self.assertEqual(self.alerts([a, a2, b], {'b1'}, sent2), [])          # no repeat at the same size
        c = buy('C', '2026-10-29', 100_000, acc='c1', filed='2026-10-29T19:40:00Z')
        self.assertEqual([(x['kind'], x['n']) for x in self.alerts([a, a2, b, c], {'c1'}, sent2)], [('cluster', 3)])

    def test_cluster_and_early_in_one_run_send_the_cluster_only(self):
        bs = [buy('A', '2026-10-28', 400_000, ceo=True, acc='a1'), buy('B', '2026-10-28', 400_000, acc='b1')]
        out = self.alerts(bs, {'a1', 'b1'})
        self.assertEqual([c['kind'] for c in out], ['cluster'])
        # a cluster under the bar that holds an early buy still alerts as the early buy
        bs2 = [buy('A', '2026-10-28', 120_000, ceo=True, acc='a1'), buy('B', '2026-10-28', 15_000, acc='b1')]
        cl = I.enrich(I.find_clusters(bs2, TODAY), FakeCtx())
        self.assertLess(cl[0]['score'], I.CFG['score_bar'])
        self.assertEqual([c['kind'] for c in self.alerts(bs2, {'a1', 'b1'})], ['early'])

    def test_env_overrides_exist(self):
        import importlib.util
        env = {'INSIDERS_EARLY_TOP_MIN': '5000', 'INSIDERS_EARLY_ANY_MIN': '7000', 'INSIDERS_SELL_MIN': '9', 'INSIDERS_SELL_PCT': '0.5',
               'INSIDERS_144_MIN': '8', 'INSIDERS_144_PCT': '0.7', 'INSIDERS_SELL_COVER': '1'}
        with mock.patch.dict(os.environ, env):                       # a fresh copy of the module reads them (the shared one is left alone)
            spec = importlib.util.spec_from_file_location('insiders_env_copy', I.__file__)
            m = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(m)
        self.assertEqual((m.CFG['early_top_min'], m.CFG['early_any_min'], m.CFG['sell_min'], m.CFG['sell_pct'], m.CFG['p144_min'], m.CFG['p144_pct'], m.CFG['sell_cover']),
                         (5000, 7000, 9, 0.5, 8, 0.7, 1))
        self.assertEqual((I.CFG['early_top_min'], I.CFG['early_any_min'], I.CFG['sell_min'], I.CFG['p144_min']), (100_000, 500_000, 1_000_000, 1_000_000))


class TestSells(unittest.TestCase):
    def test_who_size_plan_and_cover(self):
        ok = lambda r, mc=None, cfg=I.CFG: I.sell_check(r, cfg, lambda s: mc)           # noqa: E731
        self.assertEqual(ok(sale('A', '2026-10-27', 1_200_000, ceo=True)), {'of_mcap': None})
        self.assertIsNone(ok(sale('A', '2026-10-27', 900_000, ceo=True)))                   # under $1M, cap unknown
        self.assertEqual(ok(sale('A', '2026-10-27', 400_000, cfo=True), 300e6), {'of_mcap': 0.133})    # >= 0.1% of the cap
        self.assertIsNone(ok(sale('A', '2026-10-27', 400_000, cfo=True), 3e9))              # 0.013%
        self.assertIsNotNone(ok(sale('A', '2026-10-27', 2_000_000, top=True)))              # President / COO / Chair
        self.assertIsNotNone(ok(sale('A', '2026-10-27', 2_000_000, ten=True)))              # a 10% owner
        self.assertIsNone(ok(sale('A', '2026-10-27', 9_000_000)))                           # a director: not one of the roles
        self.assertIsNone(ok(sale('A', '2026-10-27', 5_000_000, ceo=True, plan=True)))      # 10b5-1 plan sale
        self.assertIsNone(ok(sale('A', '2026-10-27', 5_000_000, ceo=True, cover=True)))     # sell to cover taxes
        self.assertIsNotNone(ok(sale('A', '2026-10-27', 5_000_000, ceo=True, cover=True), cfg=dict(I.CFG, sell_cover=1)))
        self.assertIsNone(ok(sale('A', '2026-10-27', 5_000_000, ceo=True, price=1.5)))      # penny stock
        self.assertIsNotNone(ok(sale('A', '2026-10-27', 600_000, ceo=True), cfg=dict(I.CFG, sell_min=500_000)))   # env override
        b = dict(buy('A', '2026-10-27', 5_000_000, ceo=True))
        self.assertIsNone(ok(b))                                                            # a buy is not a sale

    def test_items_alerts_and_the_line(self):
        rs = [sale('A', '2026-10-27', 2_400_000, ceo=True, acc='s1', filed='2026-10-29T19:40:00Z'),
              sale('B', '2026-10-27', 5_000_000, ceo=True, plan=True, acc='s2'), sale('C', '2026-10-27', 300_000, cfo=True, acc='s3'),
              sale('D', '2026-08-01', 9_000_000, ceo=True, acc='s4')]
        items = I.enrich_events(I.big_sells(rs, TODAY), FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}},
                                details={'XYZ': {'price': 100.0, 'zones': [{'tf': 'MN', 'side': 'demand', 'proximal': 101, 'distal': 95}]}}))
        self.assertEqual([i['acc'] for i in items], ['s1'])                                 # plan, small and old ones are out
        self.assertEqual(I.events_to_alert(items, {'s1'}, {}, NOW), items)
        self.assertEqual(I.events_to_alert(items, set(), {}, NOW), [])
        self.assertEqual(I.events_to_alert(items, {'s1'}, {'S:s1': {'at': 'x'}}, NOW), [])  # sent once
        self.assertEqual(I.events_to_alert(items, {'s1'}, {}, NOW + dt.timedelta(days=2)), [])
        t = str(I.build_message(items, TODAY, now=NOW))
        self.assertTrue(t.startswith('🔻 Insider sale · <b>XYZ</b> $100.00 · CEO A sold $2.4M · 5% of holdings'), t)
        self.assertIn('open market, not a 10b5-1 plan sale · sold Oct 27 · filed 20m ago · inside MN demand 95–101', t)
        self.assertNotIn('⭐', t)                                                            # the ⭐ rule is a buy-cluster rule
        self.assertIn('SEC Form 4 / Form 144 / Schedule 13D filings', t)

    def test_recent_sells_for_the_app(self):
        rs = [sale('A', '2026-10-27', 2_400_000, ceo=True, acc='s1'), sale('B', '2026-10-27', 5_000_000, ceo=True, plan=True, acc='s2'), sale('C', '2026-10-27', 100_000, ceo=True, acc='s3')]
        out = I.recent_sells(rs, FakeCtx(), TODAY)
        self.assertEqual([(x['who'], x['big'], x['plan']) for x in out], [('B', False, True), ('A', True, False)])    # $100k is under the list floor


class TestPlannedSales(unittest.TestCase):
    def rec(self, value, shares=50_000, outstanding=180e6, sym='XYZ', acc='f1', filed='2026-10-30T13:45:02Z'):
        return {'type': 'f144', 'acc': acc, 'form': '144', 'cik': '111111', 'sym': sym, 'name': 'XYZ Corp', 'seller': 'Doe Jane', 'rel': 'Officer', 'shares': shares,
                'value': value, 'price': value / shares if shares else None, 'outstanding': outstanding, 'date': '2026-11-02', 'plan': False, 'plan_dates': [],
                'broker': '', 'url': 'https://www.sec.gov/f', 'filed': filed}

    def test_dollar_or_percent_of_the_cap(self):
        mc = lambda s: 4e9                                                                   # noqa: E731
        self.assertEqual(len(I.plan_items([self.rec(1_200_000)], TODAY2, I.CFG, mc)), 1)
        self.assertEqual(I.plan_items([self.rec(900_000)], TODAY2, I.CFG, mc), [])           # 0.02% of $4B
        self.assertEqual(len(I.plan_items([self.rec(900_000)], TODAY2, I.CFG, lambda s: 500e6)), 1)    # 0.18% of $500M
        # market cap unknown: the form's own shares outstanding decide (0.0278% here; 0.25% with 20M outstanding)
        self.assertEqual(I.plan_items([self.rec(900_000)], TODAY2, I.CFG), [])
        self.assertEqual(len(I.plan_items([self.rec(900_000, outstanding=20e6)], TODAY2, I.CFG)), 1)
        self.assertEqual(I.plan_items([self.rec(5_000_000, sym='')], TODAY2, I.CFG), [])      # not a scanner stock
        self.assertEqual(I.plan_items([self.rec(5_000_000, filed='2026-08-01T13:00:00Z')], TODAY2, I.CFG), [])

    def test_line_says_planned_sale(self):
        it = I.enrich_events(I.plan_items([self.rec(6_012_500)], TODAY2, I.CFG, lambda s: 4e9), FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}}, details={'XYZ': {'price': 120.4}}))
        t = str(I.build_message(it, TODAY2, now=NOW2))
        self.assertTrue(t.startswith('📋 Planned sale (Form 144) · <b>XYZ</b> $120.40 · Doe Jane (Officer) plans to sell $6.0M (50K sh) · 0.15% of market cap · '
                                     'sale about Nov 2 · filed 14m ago'), t)
        self.assertIn('may be smaller, later or never', t)


class TestActivists(unittest.TestCase):
    def test_13d_alert_and_13g_never(self):
        st = I.load_state('/nonexistent')
        ciks = {'111111': 'XYZ'}
        ref = {'acc': '0009876500-26-000007', 'cik': '1555555', 'form': 'SCHEDULE 13D/A'}
        self.assertEqual(I.ingest(st, ref, fixture('schedule13d_a.txt'), {'XYZ'}, ciks), 1)
        r = st['d13'][0]
        self.assertEqual((r['sym'], r['filer'], r['pct'], r['event'], r['form']), ('XYZ', 'Activist Capital LP', 7.0, '2026-10-28', 'SCHEDULE 13D/A'))
        self.assertTrue(r['filed'].startswith('2026-10-30T12:30'))                           # 08:30 New York (EDT)
        self.assertEqual(I.ingest(st, {'acc': 'g', 'cik': '1', 'form': 'SCHEDULE 13G/A'}, fixture('schedule13g.txt'), {'XYZ'}, ciks), 0)
        self.assertEqual(len(st['d13']), 1)                                                  # 13G is not an alert, not stored here
        items = I.enrich_events(I.act_items(st['d13'], TODAY2), FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}}, details={'XYZ': {'price': 120.4}}))
        self.assertEqual(I.events_to_alert(items, {ref['acc']}, {}, NOW2), items)
        t = str(I.build_message(items, TODAY2, now=NOW2))
        self.assertTrue(t.startswith('📣 Activist · <b>XYZ</b> $120.40 · Activist Capital LP now holds 7.0% (12.6M sh) · 13D/A · event Oct 28 · filed 1h ago'), t)
        self.assertIn('Item 4: “The Reporting Persons acquired the Shares because they believe the Issuer is undervalued.', t)
        self.assertEqual(I.act_items([dict(r, sym='')], TODAY2), [])                         # not a scanner stock: no alert
        self.assertEqual(len(I.act_items([dict(r, sym='')], TODAY2, universe_only=False)), 1)    # but listed in the app
        # the same filer's next filing carries the change
        later = dict(r, acc='z', filed='2026-11-02T12:00:00Z', pct=8.4)
        st['d13'].append(later)
        ref2 = {'acc': 'q', 'cik': '1555555', 'form': 'SCHEDULE 13D/A'}
        raw = fixture('schedule13d_a.txt').replace(b'0009876500-26-000007', b'q').replace(b'20261030083012', b'20261104083012')
        I.ingest(st, ref2, raw, {'XYZ'}, ciks)
        self.assertEqual([x.get('prev_pct') for x in st['d13'] if x['acc'] == 'q'], [8.4])


class TestRunAllForms(unittest.TestCase):
    def feed(self, accs, form):
        ents = ''.join(f'<entry><title>x</title><link rel="alternate" href="https://www.sec.gov/Archives/edgar/data/111111/{a.replace("-", "")}/{a}-index.htm"/>'
                       f'<updated>2026-10-30T09:45:02-04:00</updated><category scheme="https://www.sec.gov/" label="form type" term="{form}"/>'
                       f'<id>urn:tag:sec.gov,2008:accession-number={a}</id></entry>' for a in accs)
        return f'<feed>{ents}</feed>'.encode()

    def get_fn(self, calls):
        subs = {'0001111111-26-000101': fixture('form4_sale_plan.txt'), '0001111111-26-000102': fixture('form4_sale_open.txt'),
                '0001234500-26-000010': fixture('form144.txt'), '0009876500-26-000007': fixture('schedule13d_a.txt')}

        def get(url):
            calls.append(url)
            if 'getcurrent' in url:
                if 'start=0&' not in url:
                    return b'<feed></feed>'
                if 'type=144&' in url:
                    return self.feed(['0001234500-26-000010'], '144')
                if 'type=SCHEDULE+13D&' in url:
                    return self.feed(['0009876500-26-000007'], 'SCHEDULE 13D/A')
                return self.feed(['0001111111-26-000101', '0001111111-26-000102'], '4')
            if 'daily-index' in url:
                import urllib.error
                raise urllib.error.HTTPError(url, 404, 'nf', {}, None)
            return subs[url.rsplit('/', 1)[1][:-4]]
        return get

    def ctx(self):
        return FakeCtx(rows={'XYZ': {'s': 'XYZ', 'k': 1}}, details={'XYZ': {'price': 121.0, 'zones': [{'tf': 'MN', 'side': 'demand', 'proximal': 125, 'distal': 118}]}},
                       fund={'XYZ': {'mcap': 4e9, 'cik': '111111'}})

    def test_one_message_with_every_alert_type_and_a_dry_run(self):
        calls, sent = [], []
        with tempfile.TemporaryDirectory() as d:
            sp, lp = os.path.join(d, 'state.json'), os.path.join(d, 'latest.json')
            with mock.patch.object(I.Context, 'cik_map', lambda self: {'111111': 'XYZ'}):
                # a dry run first: prints, sends nothing, leaves the alert state alone
                with mock.patch('builtins.print') as pr:
                    I.run(NOW2, self.get_fn(calls), notify=False, state_path=sp, latest_path=lp, ctx=self.ctx(), send=lambda m: sent.append(m) or True, feed_s=60, backfill_s=1)
                self.assertEqual(sent, [])
                self.assertTrue(any('Activist' in str(c) for c in pr.call_args_list))
                self.assertEqual(I.load_json(sp, {})['alerted'], {})
                os.remove(sp)
                msg = I.run(NOW2, self.get_fn(calls), state_path=sp, latest_path=lp, ctx=self.ctx(), send=lambda m: sent.append(m) or True, feed_s=60, backfill_s=1)
            self.assertEqual(len(sent), 1)
            t = str(sent[0][0])
            self.assertTrue(t.startswith('🕵️ <b>3 new insider alerts</b>'), t)
            self.assertLess(t.index('Activist'), t.index('Insider sale'))
            self.assertLess(t.index('Insider sale'), t.index('Planned sale'))
            self.assertIn('Roe Richard sold $1.5M', t.replace('CFO ', ''))
            self.assertNotIn('Doe Jane sold', t)                                           # the 10b5-1 plan sale is not alerted
            self.assertEqual(msg.n_alerts, 3)
            self.assertEqual([b.get('callback_data') for b in msg.buttons[0][:3]], ['c:XYZ', 'f:XYZ', 'h:XYZ'])
            self.assertEqual(len(msg.buttons), 2)                                           # ONE row for XYZ (3 alerts), then the app
            st = I.load_json(sp, {})
            self.assertEqual({k for k in st['alerted']}, {'S:0001111111-26-000102', 'F:0001234500-26-000010', 'D:0009876500-26-000007'})
            self.assertEqual(st['sent_day']['2026-10-30'], 3)                              # the daily cap counts every type
            js = I.load_json(lp, {})
            self.assertEqual([x['who'] for x in js['sells']], ['Roe Richard', 'Doe Jane'])
            self.assertEqual([(x['big'], x['plan']) for x in js['sells']], [(True, False), (False, True)])
            self.assertEqual((js['plans'][0]['sym'], js['plans'][0]['big'], js['plans'][0]['of_mcap']), ('XYZ', True, 0.15))
            self.assertEqual((js['activists'][0]['who'], js['activists'][0]['universe'], js['activists'][0]['pct']), ('Activist Capital LP', True, 7.0))
            self.assertEqual((js['by_sym']['XYZ']['p144'], js['by_sym']['XYZ']['d13']), (1, 1))
            self.assertEqual(js['rules']['sell_min'], 1_000_000)
            # next run: nothing new, nothing sent
            sent.clear()
            with mock.patch.object(I.Context, 'cik_map', lambda self: {'111111': 'XYZ'}):
                self.assertIsNone(I.run(NOW2 + dt.timedelta(minutes=10), self.get_fn(calls), state_path=sp, latest_path=lp, ctx=self.ctx(), send=lambda m: sent.append(m) or True, backfill_s=1))
            self.assertEqual(sent, [])

    def test_mute_quiet_and_daily_cap_apply_to_every_type(self):
        calls = []
        with tempfile.TemporaryDirectory() as d, mock.patch.object(I.Context, 'cik_map', lambda self: {'111111': 'XYZ'}):
            sp, lp = os.path.join(d, 'state.json'), os.path.join(d, 'latest.json')
            sent = []
            until = (NOW2 + dt.timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
            I.run(NOW2, self.get_fn(calls), prefs={'mutes': [{'sym': 'XYZ', 'until_utc': until}], 'alerts': [], 'quiet': None, 'watch': []}, state_path=sp, latest_path=lp,
                  ctx=self.ctx(), send=lambda m: sent.append(m) or True, feed_s=60, backfill_s=1)
            self.assertEqual(sent, [])                                                      # muted symbol: app only
            os.remove(sp)
            I.run(NOW2, self.get_fn(calls), state_path=sp, latest_path=lp, ctx=self.ctx(), send=lambda m: sent.append(m) or True, feed_s=60, backfill_s=1,
                  cfg=dict(I.CFG, max_per_day=2))
            self.assertEqual(str(sent[0][0]).count('Activist ·') + str(sent[0][0]).count('Insider sale ·') + str(sent[0][0]).count('Planned sale'), 2)   # capped at 2 in all
            self.assertFalse(sent[0][0].silent)
            os.remove(sp)
            sent.clear()
            quiet = {'mutes': [], 'alerts': [], 'quiet': {'from': '00:00', 'to': '23:59', 'tz': 'America/Edmonton'}, 'watch': []}
            I.run(NOW2, self.get_fn(calls), prefs=quiet, state_path=sp, latest_path=lp, ctx=self.ctx(), send=lambda m: sent.append(m) or True, feed_s=60, backfill_s=1)
            self.assertTrue(sent[0][0].silent)

    def test_guests_with_stocks_get_the_same_alerts(self):
        item = I.enrich_events(I.big_sells([sale('A', '2026-10-27', 2_400_000, ceo=True, acc='s1', filed='2026-10-30T13:00:00Z')], TODAY2), self.ctx())
        g = {'markets': ['stocks'], 'mutes': [], 'alerts': [], 'quiet': None, 'watch': [], 'id': 'a' * 12, 'chat': '1'}
        self.assertEqual(len(I.guest_message(g, item, TODAY2, NOW2)), 1)
        self.assertEqual(I.guest_message(dict(g, markets=['fx']), item, TODAY2, NOW2), [])      # stocks off
        self.assertEqual(I.guest_message(dict(g, mutes=[{'sym': 'XYZ', 'until_utc': '2030-01-01T00:00:00Z'}]), item, TODAY2, NOW2), [])
