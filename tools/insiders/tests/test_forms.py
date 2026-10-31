"""The SEC form readers of tools/insiders, offline, on the committed fixtures (tests/fixtures): Form 4 sales with and
without a 10b5-1 plan, a Form 144 XML, a Schedule 13D XML and 13G XML, an old SC 13G text. The fixtures are reconstructions of the
EDGAR schemas (the sandbox that wrote them could not reach www.sec.gov), not copies of real filings; tools/insiders/
grab_fixtures.py replaces them with real, minimised ones when run where SEC answers."""
import datetime as dt
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import edgar as E  # noqa: E402
import grab_fixtures as G  # noqa: E402
import form144 as F144  # noqa: E402
import form4 as F  # noqa: E402
import insiders as I  # noqa: E402
import sched13 as S13  # noqa: E402


def fx(name: str) -> bytes:
    with open(os.path.join(HERE, 'fixtures', name), 'rb') as f:
        return f.read()


def sale_xml(footnote: str = '', box: str = '0', title: str = 'Chief Executive Officer', code: str = 'S', after: str = '9000') -> bytes:
    fid = '<footnoteId id="F1"/>' if footnote else ''
    return f"""<ownershipDocument><documentType>4</documentType><periodOfReport>2026-10-27</periodOfReport>
<issuer><issuerCik>0000111111</issuerCik><issuerName>XYZ Corp</issuerName><issuerTradingSymbol>XYZ</issuerTradingSymbol></issuer>
<reportingOwner><reportingOwnerId><rptOwnerCik>0000222222</rptOwnerCik><rptOwnerName>Doe Jane</rptOwnerName></reportingOwnerId>
<reportingOwnerRelationship><isOfficer>1</isOfficer><officerTitle>{title}</officerTitle></reportingOwnerRelationship></reportingOwner>
<aff10b5One>{box}</aff10b5One>
<nonDerivativeTable><nonDerivativeTransaction><securityTitle><value>Common Stock</value></securityTitle>
<transactionDate><value>2026-10-27</value></transactionDate>
<transactionCoding><transactionCode>{code}</transactionCode>{fid}</transactionCoding>
<transactionAmounts><transactionShares><value>1000</value></transactionShares><transactionPricePerShare><value>50</value></transactionPricePerShare>
<transactionAcquiredDisposedCode><value>D</value></transactionAcquiredDisposedCode></transactionAmounts>
<postTransactionAmounts><sharesOwnedFollowingTransaction><value>{after}</value></sharesOwnedFollowingTransaction></postTransactionAmounts>
<ownershipNature><directOrIndirectOwnership><value>D</value></directOrIndirectOwnership></ownershipNature></nonDerivativeTransaction></nonDerivativeTable>
<footnotes><footnote id="F1">{footnote}</footnote></footnotes></ownershipDocument>""".encode()


class TestTenB5One(unittest.TestCase):
    def test_checkbox_and_footnote_fixtures(self):
        plan = F.parse_submission(fx('form4_sale_plan.txt'))
        self.assertTrue(plan['plan'])                                                 # <aff10b5One>1</aff10b5One>
        self.assertTrue(plan['rows'][0]['plan'])                                      # and the footnote names the plan
        s = F.filing_trades(plan, 'S')
        self.assertEqual((s['code'], s['value'], s['plan'], s['cover'], s['ceo']), ('S', 2_400_000.0, True, False, True))
        open_ = F.parse_submission(fx('form4_sale_open.txt'))
        self.assertFalse(open_['plan'])
        s2 = F.filing_trades(open_, 'S')
        self.assertEqual((s2['plan'], s2['cfo'], s2['n_tx'], s2['shares']), (False, True, 2, 12000))
        self.assertAlmostEqual(s2['value'], 8000 * 125 + 4000 * 126)
        self.assertEqual(plan['accepted'], '2026-10-29T16:12:05')

    def test_footnote_alone_marks_older_filings_and_a_negation_does_not(self):
        f = lambda note, box='0': F.filing_trades(F.parse_xml(sale_xml(note, box)), 'S')['plan']        # noqa: E731
        self.assertTrue(f('Sold pursuant to a Rule 10b5-1 trading plan adopted on March 3, 2026.'))
        self.assertTrue(f('The sale was made under a plan intended to satisfy Rule 10b5-1(c).'))
        self.assertFalse(f('This sale was not made pursuant to a Rule 10b5-1 plan.'))
        self.assertFalse(f('The price is a weighted average price.'))
        self.assertTrue(f('', box='1'))                                                                # the checkbox alone
        self.assertTrue(f('', box='true'))
        self.assertFalse(f('', box='0'))

    def test_sell_to_cover_is_flagged(self):
        d = F.parse_xml(sale_xml('Shares sold to cover tax withholding obligations upon the vesting of restricted stock units.'))
        s = F.filing_trades(d, 'S')
        self.assertTrue(s['cover'])
        self.assertFalse(s['plan'])
        self.assertFalse(F.filing_trades(F.parse_xml(sale_xml('weighted average')), 'S')['cover'])

    def test_roles_for_the_early_and_sale_rules(self):
        top = lambda t: F.parse_xml(sale_xml(title=t))['owners'][0]['top']                             # noqa: E731
        self.assertTrue(top('President and Chief Operating Officer'))
        self.assertTrue(top('Chairman of the Board'))
        self.assertTrue(top('Executive Chair'))
        self.assertTrue(top('COO'))
        self.assertFalse(top('Senior Vice President, Sales'))
        self.assertFalse(top('Vice Chairman'))
        self.assertFalse(top('Chair, Audit Committee'))
        self.assertFalse(top('Chief Financial Officer'))
        o = F.parse_xml(sale_xml(title='Chairman and CEO'))['owners'][0]
        self.assertTrue(o['top'] and o['ceo'])

    def test_holdings_for_the_holders_card(self):
        h = F.holdings(F.parse_submission(fx('form4_sale_open.txt')))
        self.assertEqual((h['owner'], h['role'], h['after'], h['date'], h['code'], h['moved']), ('Roe Richard', 'CFO', 83000.0, '2026-10-28', 'S', -12000.0))   # 68,000 direct + 15,000 by trust
        self.assertAlmostEqual(h['price'], 125.3333, places=3)
        opt = F.parse_xml(sale_xml(after='500').replace(b'Common Stock', b'Stock Option (right to buy)'))
        self.assertIsNone(F.holdings(opt))                                                             # an option line is not shares


class TestForm144(unittest.TestCase):
    def test_fixture(self):
        d = F144.parse_submission(fx('form144.txt'))
        self.assertEqual((d['issuer'], d['seller'], d['rel']), ({'cik': '111111', 'name': 'XYZ Corp'}, 'Doe Jane', 'Officer · Director'))
        self.assertEqual((d['shares'], d['value'], d['outstanding'], d['sale_date']), (50000.0, 6012500.0, 180000000.0, '2026-11-02'))
        self.assertEqual((d['plan_dates'], d['broker'], d['form'], d['accepted']), (['2026-06-12'], 'Example Securities LLC', '144', '2026-10-30T09:45:02'))
        r = F144.record(d, {'acc': '0001234500-26-000010', 'cik': '222222'}, 'https://www.sec.gov/x', '2026-10-30T13:45:02Z', 'XYZ')
        self.assertEqual((r['sym'], r['value'], r['price'], r['plan'], r['date']), ('XYZ', 6012500.0, 120.25, True, '2026-11-02'))

    def test_several_classes_add_up_and_the_envelope_fills_gaps(self):
        raw = fx('form144.txt').replace(b'</securitiesInformation>', b'</securitiesInformation><securitiesInformation><securitiesClassTitle>Class B</securitiesClassTitle>'
                                        b'<noOfUnitsSold>1000</noOfUnitsSold><aggregateMarketValue>100000</aggregateMarketValue><approxSaleDate>11/01/2026</approxSaleDate></securitiesInformation>', 1)
        d = F144.parse_submission(raw)
        self.assertEqual((d['shares'], d['value'], d['sale_date']), (51000.0, 6112500.0, '2026-11-01'))
        bare = fx('form144.txt').replace(b'<issuerCik>0000111111</issuerCik>', b'').replace(b'<issuerName>XYZ Corp</issuerName>', b'')
        e = F144.parse_submission(bare)
        self.assertEqual(e['issuer'], {'cik': '111111', 'name': 'XYZ Corp'})                           # from SUBJECT COMPANY
        with self.assertRaises(ValueError):
            F144.parse_submission(b'<html>rate limited</html>')

    def test_relationships(self):
        self.assertEqual(F144.relation(['Officer']), 'Officer')
        self.assertEqual(F144.relation(['Director', '10% Owner']), 'Director · 10% owner')
        self.assertEqual(F144.relation([]), 'Other')


class TestSchedule13(unittest.TestCase):
    def test_13d_xml(self):
        d = S13.parse_submission(fx('schedule13d_a.txt'))
        self.assertEqual((d['form'], d['kind'], d['amend']), ('SCHEDULE 13D/A', 'D', True))
        self.assertEqual(d['subject'], {'cik': '111111', 'name': 'XYZ Corp', 'cusip': '98765A103'})
        self.assertEqual((d['filer'], d['filer_cik'], d['pct'], d['shares'], d['event']), ('Activist Capital LP', '1555555', 7.0, 12_600_000.0, '2026-10-28'))
        self.assertTrue(d['purpose'].startswith('The Reporting Persons acquired the Shares because they believe the Issuer is undervalued.'))
        self.assertLessEqual(len(d['purpose']), 201)                                                   # ~200 characters, cut at a word
        self.assertTrue(d['purpose'].endswith('…'))
        r = S13.record(d, {'acc': 'a'}, 'https://www.sec.gov/x', '2026-10-30T12:30:12Z', 'XYZ')
        self.assertEqual((r['type'], r['sym'], r['cusip']), ('d13', 'XYZ', '98765A103'))

    def test_13g_xml_has_no_purpose(self):
        d = S13.parse_submission(fx('schedule13g.txt'))
        self.assertEqual((d['kind'], d['filer'], d['pct'], d['shares'], d['event'], d['purpose']), ('G', 'Example Index Group Inc', 9.57, 17_220_000.0, '2026-09-30', ''))
        self.assertEqual(S13.record(d, {'acc': 'g'}, 'u', 'f')['type'], 'g13')

    def test_old_sc_13g_text(self):
        d = S13.parse_submission(fx('sc13g_old.txt'))
        self.assertEqual((d['form'], d['kind'], d['amend']), ('SC 13G/A', 'G', True))
        self.assertEqual((d['pct'], d['shares'], d['event'], d['subject']['cusip']), (9.2, 16_540_000.0, '2023-12-29', '98765A103'))
        self.assertEqual((d['filer'], d['subject']['cik']), ('Example Index Group Inc', '111111'))      # the envelope names them

    def test_old_sc_13d_item_4(self):
        raw = fx('sc13g_old.txt').replace(b'SC 13G/A', b'SC 13D').replace(b'Item 4. Ownership.', b'Item 4. Purpose of Transaction. The Reporting Persons intend to seek board '
                                                                                         b'representation and may propose a merger. Item 5. Interest in Securities.')
        d = S13.parse_submission(raw)
        self.assertEqual(d['kind'], 'D')
        self.assertEqual(d['purpose'], 'The Reporting Persons intend to seek board representation and may propose a merger.')

    def test_an_amendments_boilerplate_lead_in_is_dropped(self):
        self.assertEqual(S13.purpose_text('of the Original 13D is hereby amended and supplemented as follows: On October 28, 2026, the Company agreed to merge.'), 'On October 28, 2026, the Company agreed to merge.')
        self.assertEqual(S13.purpose_text('Item 4 is hereby amended and supplemented by the addition of the following: The Reporting Persons sold shares.'), 'The Reporting Persons sold shares.')
        self.assertEqual(S13.purpose_text('The Reporting Persons acquired the Shares for investment.'), 'The Reporting Persons acquired the Shares for investment.')

    def test_not_a_schedule(self):
        with self.assertRaises(ValueError):
            S13.parse_submission(fx('form144.txt'))
        self.assertEqual(S13.kind_of('SCHEDULE 13D'), 'D')
        self.assertEqual(S13.kind_of('SC 13G/A'), 'G')
        self.assertEqual(S13.kind_of('SCHEDULE 13E3'), '')


class TestFeedAndIndex(unittest.TestCase):
    ENT = ('<entry><title>{t}</title><link rel="alternate" href="https://www.sec.gov/Archives/edgar/data/{cik}/{n}/{acc}-index.htm"/>'
           '<updated>2026-10-30T09:45:02-04:00</updated><category scheme="https://www.sec.gov/" label="form type" term="{form}"/>'
           '<id>urn:tag:sec.gov,2008:accession-number={acc}</id></entry>')

    def test_feed_forms_and_ciks(self):
        feed = '<feed>' + ''.join([
            self.ENT.format(t='144 - Doe Jane (0000222222) (Subject)', cik='222222', n='000123450026000010', acc='0001234500-26-000010', form='144'),
            self.ENT.format(t='144 - XYZ Corp (0000111111) (Filed by)', cik='111111', n='000123450026000010', acc='0001234500-26-000010', form='144'),
            self.ENT.format(t='SCHEDULE 13D/A - XYZ Corp', cik='111111', n='000987650026000007', acc='0009876500-26-000007', form='SCHEDULE 13D/A'),
            self.ENT.format(t='SCHEDULE 13G/A - XYZ Corp', cik='111111', n='000010290926000200', acc='0000102909-26-000200', form='SCHEDULE 13G/A'),
            self.ENT.format(t='424B2 - Bank', cik='5', n='000000000526000003', acc='0000000005-26-000003', form='424B2'),
            self.ENT.format(t='4 - Roe', cik='333333', n='000111111126000102', acc='0001111111-26-000102', form='4')]) + '</feed>'
        refs = {r['acc']: r for r in I.parse_feed(feed)}
        self.assertEqual(set(refs), {'0001234500-26-000010', '0009876500-26-000007', '0001111111-26-000102'})   # 13G and 424B2 are not read here
        self.assertEqual(refs['0001234500-26-000010']['ciks'], ['222222', '111111'])
        self.assertEqual(refs['0009876500-26-000007']['form'], 'SCHEDULE 13D/A')

    def test_feed_urls(self):
        urls = []
        I.read_feed(lambda u: urls.append(u) or b'<feed></feed>', {}, 1, 'SCHEDULE 13D')
        self.assertIn('type=SCHEDULE+13D&', urls[0])
        self.assertTrue(urls[0].startswith('https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&'))
        self.assertEqual(I.FEED_TYPES, ('4', '144', 'SCHEDULE 13D'))

    def test_daily_index_new_forms(self):
        text = """Form Type   Company Name                                                  CIK         Date Filed  File Name
---------------------------------------------------------------------------------------------------------------------------------------------
144         XYZ Corp                                                      111111      20261030    edgar/data/111111/0001234500-26-000010.txt
144         Doe Jane                                                      222222      20261030    edgar/data/222222/0001234500-26-000010.txt
SCHEDULE 13D/A XYZ Corp                                                   111111      20261030    edgar/data/111111/0009876500-26-000007.txt
SCHEDULE 13G/A XYZ Corp                                                   111111      20261030    edgar/data/111111/0000102909-26-000200.txt
SC 13D      OLD CO                                                        777         20261030    edgar/data/777/0000000777-26-000001.txt
4           XYZ Corp                                                      111111      20261030    edgar/data/111111/0001111111-26-000102.txt
424B2       BANK                                                          5           20261030    edgar/data/5/0000000005-26-000003.txt
"""
        refs = I.parse_daily_index(text)
        self.assertEqual([(r['acc'], r['form']) for r in refs], [('0001234500-26-000010', '144'), ('0009876500-26-000007', 'SCHEDULE 13D/A'),
                                                                  ('0000000777-26-000001', 'SC 13D'), ('0001111111-26-000102', '4')])
        self.assertEqual(refs[0]['ciks'], ['111111', '222222'])

    def test_form_144_of_other_companies_are_not_read(self):
        ciks = {'111111': 'XYZ'}
        self.assertTrue(I.relevant({'form': '144', 'cik': '222222', 'ciks': ['222222', '111111']}, ciks))
        self.assertFalse(I.relevant({'form': '144', 'cik': '222222', 'ciks': ['222222', '999']}, ciks))
        self.assertTrue(I.relevant({'form': '144', 'cik': '222222', 'ciks': ['222222']}, {}))          # universe unknown: read all
        self.assertTrue(I.relevant({'form': '4', 'cik': '5', 'ciks': ['5']}, ciks))
        self.assertTrue(I.relevant({'form': 'SCHEDULE 13D', 'cik': '5', 'ciks': ['5']}, ciks))

    def test_144_amendment_replaces_the_original(self):
        st = I.load_state('/nonexistent')
        ciks = {'111111': 'XYZ'}
        I.ingest(st, {'acc': '0001234500-26-000010', 'cik': '222222', 'form': '144'}, fx('form144.txt'), {'XYZ'}, ciks)
        raw = fx('form144.txt').replace(b'0001234500-26-000010', b'0001234500-26-000011').replace(b'<noOfUnitsSold>50000', b'<noOfUnitsSold>40000').replace(b'20261030094502', b'20261030101502')
        I.ingest(st, {'acc': '0001234500-26-000011', 'cik': '222222', 'form': '144/A'}, raw.replace(b'CONFORMED SUBMISSION TYPE:	144', b'CONFORMED SUBMISSION TYPE:	144/A'), {'XYZ'}, ciks)
        self.assertEqual([(x['acc'], x['shares']) for x in st['f144']], [('0001234500-26-000011', 40000.0)])
        self.assertEqual(I.ingest(st, {'acc': 'x', 'cik': '1', 'form': '144'}, fx('form144.txt').replace(b'0000111111', b'0000999999'), {'XYZ'}, ciks), 0)   # not a scanner stock


class TestGrabFixtures(unittest.TestCase):
    def test_auto_picks_one_of_each_and_never_crashes_on_failures(self):
        idx = ('144   XYZ Corp   111111   20261029   edgar/data/111111/0001234500-26-000010.txt\n'
               'SCHEDULE 13D/A   XYZ Corp   111111   20261029   edgar/data/111111/0009876500-26-000007.txt\n'
               'SCHEDULE 13G/A   XYZ Corp   111111   20261029   edgar/data/111111/0000102909-26-000200.txt\n'
               '4   XYZ Corp   111111   20261029   edgar/data/111111/0001111111-26-000101.txt\n4   XYZ Corp   111111   20261029   edgar/data/111111/0001111111-26-000102.txt\n')
        files = {'0001234500-26-000010': 'form144.txt', '0009876500-26-000007': 'schedule13d_a.txt', '0000102909-26-000200': 'schedule13g.txt',
                 '0001111111-26-000101': 'form4_sale_plan.txt', '0001111111-26-000102': 'form4_sale_open.txt'}

        def get(url):
            if 'daily-index' in url and 'form.20261029' in url:
                return idx.encode()
            if url.endswith('.txt') and url.rsplit('/', 1)[1][:-4] in files:
                return fx(files[url.rsplit('/', 1)[1][:-4]])
            raise OSError('offline')
        lines = []
        with tempfile.TemporaryDirectory() as d:
            G.auto(get, dt.date(2026, 10, 30), say=lines.append, out=d)
            saved = sorted(os.listdir(d))
        self.assertEqual(saved, ['form144.txt', 'form4_sale_box.txt', 'form4_sale_open.txt', 'schedule13d_a.txt', 'schedule13g_a.txt'])
        text = '\n'.join(lines)
        self.assertIn('=====FIXTURE form144.txt', text)
        self.assertIn('parsed form4_sale_box.txt: plan=True box=True', text)
        self.assertIn('parsed form4_sale_open.txt: plan=False', text)
        self.assertIn('13F check:', text)                                            # the offline parts say so instead of raising
        self.assertEqual(sorted(G.index_refs(idx)), ['144', '4', 'SCHEDULE 13D/A', 'SCHEDULE 13G/A'])
        self.assertLessEqual(len(G.minimise(b'<SEC-HEADER>x</SEC-HEADER><DOCUMENT>' + b'a' * 100_000 + b'</DOCUMENT><DOCUMENT>exhibit</DOCUMENT>')), G.CAP)


class TestEdgarHelpers(unittest.TestCase):
    def test_header_and_dates(self):
        h = E.header(fx('schedule13d_a.txt'))
        self.assertEqual(h['form'], 'SCHEDULE 13D/A')
        self.assertEqual(h['accepted'], '2026-10-30T08:30:12')
        self.assertEqual((h['subject']['cik'], h['subject']['name']), ('111111', 'XYZ Corp'))
        self.assertEqual((h['filer']['cik'], h['filer']['name']), ('1555555', 'Activist Capital LP'))
        h4 = E.header(fx('form4_sale_plan.txt'))
        self.assertEqual((h4['subject']['name'], h4['filer']['name']), ('XYZ Corp', 'Doe Jane'))          # ISSUER / REPORTING-OWNER
        for s, want in (('10/30/2026', '2026-10-30'), ('2026-10-30', '2026-10-30'), ('20261030', '2026-10-30'), ('October 30, 2026', '2026-10-30'), ('n/a', ''), ('', '')):
            self.assertEqual(E.iso_date(s), want)
        self.assertEqual(E.num('1,234.5'), 1234.5)
        self.assertIsNone(E.num('x'))


if __name__ == '__main__':
    unittest.main()
