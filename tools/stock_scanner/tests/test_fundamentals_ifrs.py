"""IFRS / foreign-currency / annual-only filers, ADR ratios, the CIK name guard and the FMP fallback."""
import json
import os
import tempfile
import unittest
from unittest import mock

import helpers  # noqa: F401
import fundamentals as F


def annual(vals, unit, form='20-F', fy_end='12-31'):
    """{year: value} -> annual duration facts (calendar years)."""
    return {unit: [{'start': f'{y}-01-01', 'end': f'{y}-{fy_end}', 'val': v, 'form': form, 'filed': f'{y + 1}-03-01'}
                   for y, v in vals.items()]}


def inst(vals, unit, form='20-F'):
    return {unit: [{'end': f'{y}-12-31', 'val': v, 'form': form, 'filed': f'{y + 1}-03-01'} for y, v in vals.items()]}


def ifrs_cf(cur, cik=999001, name='Euro Widgets SE', scale=1.0, form='20-F'):
    s = scale
    return {'cik': cik, 'entityName': name, 'facts': {
        'ifrs-full': {
            'Revenue': {'units': annual({2024: 40e9 * s, 2025: 44e9 * s}, cur, form)},
            'ProfitLossAttributableToOwnersOfParent': {'units': annual({2024: 4e9 * s, 2025: 5.5e9 * s}, cur, form)},
            'BasicEarningsLossPerShare': {'units': annual({2024: 2.0 * s, 2025: 2.75 * s}, cur + '/shares', form)},
            'CashFlowsFromUsedInOperatingActivities': {'units': annual({2024: 6e9 * s, 2025: 7e9 * s}, cur, form)},
            'PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities': {'units': annual({2024: 2e9 * s, 2025: 2.5e9 * s}, cur, form)},
            'EquityAttributableToOwnersOfParent': {'units': inst({2024: 30e9 * s, 2025: 32e9 * s}, cur, form)},
            'NoncurrentPortionOfNoncurrentBorrowings': {'units': inst({2025: 10e9 * s}, cur, form)},
            'CurrentBorrowingsAndCurrentPortionOfNoncurrentBorrowings': {'units': inst({2025: 2e9 * s}, cur, form)},
        },
        'dei': {'EntityCommonStockSharesOutstanding': {'units': inst({2024: 2.05e9, 2025: 2.0e9}, 'shares', form)}}}}


class IfrsTest(unittest.TestCase):
    def setUp(self):
        F._LISTINGS = {}

    def tearDown(self):
        F._LISTINGS = None

    def test_eur_annual(self):
        cf = ifrs_cf('EUR')
        b = F.base(cf)
        self.assertEqual((b['currency'], b['source'], b['period'], b['form']), ('EUR', 'SEC ifrs', 'FY', '20-F'))
        self.assertAlmostEqual(b['revenue_ttm'], 44e9)
        self.assertAlmostEqual(b['revenue_yoy'], 0.1)
        self.assertAlmostEqual(b['eps_yoy'], 0.375)
        self.assertAlmostEqual(b['net_margin'], 5.5 / 44)
        self.assertAlmostEqual(b['debt_to_equity'], 12 / 32)
        self.assertAlmostEqual(b['fcf_ttm'], 4.5e9)
        f = F.compute(cf, 100.0, [90, 110], [80, 95])
        self.assertIsNone(f['pe'])                       # EPS in EUR, price in USD: no mixed ratio
        self.assertEqual(f['pe_note'], 'EPS in EUR')
        self.assertIsNone(f['market_cap'])               # a 20-F filer without a known ADR ratio
        d = dict(F.rows(f))
        self.assertEqual(d['Revenue TTM'], 'EUR 44.0B +10% YoY (FY 2025-12)')
        self.assertEqual(d['EPS TTM'], '2.75 EUR +38% YoY (FY 2025-12)')
        self.assertEqual(d['P/E'], 'n/a (EPS in EUR)')
        self.assertEqual(d['Source'], 'SEC ifrs · EUR · FY')
        self.assertEqual(d['Net margin'], '12%')

    def test_jpy_with_adr_ratio(self):
        F._LISTINGS = {'0000999002': {'symbol': 'JPX', 'name': 'Nippon Widgets', 'home': '', 'adr': True, 'adr_ratio': 10.0}}
        cf = ifrs_cf('JPY', cik=999002, name='Nippon Widgets Corp', scale=150.0)
        f = F.compute(cf, 200.0, [150, 210], [140, 190])
        self.assertEqual(f['currency'], 'JPY')
        self.assertAlmostEqual(f['revenue_yoy'], 0.1)
        self.assertIsNone(f['pe'])
        self.assertAlmostEqual(f['market_cap'], 200.0 * 2.0e9 / 10)     # price per ADS x ordinary shares / ratio
        self.assertTrue(dict(F.rows(f))['Revenue TTM'].startswith('JPY 6.60T'))

    def test_usd_ifrs_adr_pe_uses_ratio(self):
        F._LISTINGS = {'0000999003': {'symbol': 'GBX', 'name': 'British Widgets', 'home': '', 'adr': True, 'adr_ratio': 2.0}}
        f = F.compute(ifrs_cf('USD', cik=999003, name='British Widgets plc'), 55.0, [50, 60], [40, 50])
        self.assertAlmostEqual(f['pe'], 55.0 / (2.75 * 2))
        self.assertAlmostEqual(f['market_cap'], 55.0 * 2.0e9 / 2)
        F._LISTINGS['0000999003']['adr_ratio'] = None            # in the list, ratio blank: P/E n/a
        f = F.compute(ifrs_cf('USD', cik=999003), 55.0, [50, 60], [40, 50])
        self.assertEqual((f['pe'], f['pe_note'], f['market_cap']), (None, 'ADR ratio unknown', None))

    def test_canadian_40f_cad(self):
        F._LISTINGS = {'0000999004': {'symbol': 'RYX', 'name': 'Royal Widgets', 'home': 'TSX:RYX', 'adr': False, 'adr_ratio': None}}
        f = F.compute(ifrs_cf('CAD', cik=999004, form='40-F'), 100.0, [90, 110], [80, 95])
        self.assertEqual((f['form'], f['period'], f['adr_ratio']), ('40-F', 'FY', 1.0))
        self.assertAlmostEqual(f['market_cap'], 100.0 * 2.0e9)
        self.assertEqual(f['pe_note'], 'EPS in CAD')

    def test_us_filer_unchanged(self):
        with open(os.path.join(helpers.PKG, 'fixtures', 'companyfacts_sample.json')) as fh:
            cf = json.load(fh)
        f = F.compute(cf, 100.0, [80, 120], [70, 79])
        self.assertEqual((f['currency'], f['source'], f['adr_ratio']), ('USD', 'SEC us-gaap', 1.0))
        self.assertNotIn('Source', dict(F.rows(f)))
        self.assertAlmostEqual(f['pe'], 100 / 7.17, places=3)

    def test_old_cached_base_defaults(self):
        f = F.compute({'eps_ttm': 2.0, 'shares': 1e9}, 40.0, [40], [30])
        self.assertEqual((f['currency'], f['pe'], f['market_cap']), ('USD', 20.0, 40e9))


class FetchTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.p = mock.patch.object(F, 'CACHE', self.tmp.name)
        self.p.start()
        F._FMP_N[0] = 0

    def tearDown(self):
        self.p.stop()
        self.tmp.cleanup()
        F._LISTINGS = None

    def test_wrong_curated_cik_is_ignored(self):
        F._LISTINGS = {'0000999005': {'symbol': 'TSM', 'name': 'Taiwan Semiconductor Manufacturing', 'home': '', 'adr': True, 'adr_ratio': 5.0}}
        logs = []
        with mock.patch.object(F, 'fetch_companyfacts', return_value=ifrs_cf('TWD', cik=999005, name='Some Other Bank Ltd')):
            self.assertIsNone(F.fetch_base('999005', max_age_days=0, log=logs.append))
        self.assertIn('not', logs[0])
        b, age = F.cached_base('999005')
        self.assertIsNone(b)
        self.assertLess(age, 1)                       # remembered: not re-downloaded every run
        with mock.patch.object(F, 'fetch_companyfacts', return_value=ifrs_cf('TWD', cik=999005, name='TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD')):
            self.assertEqual(F.fetch_base('999005', max_age_days=0)['currency'], 'TWD')

    def test_fmp_fallback(self):
        F._LISTINGS = {'0000999006': {'symbol': 'ABC', 'name': 'Abc Holdings', 'home': '', 'adr': True, 'adr_ratio': 1.0}}
        pages = {'income-statement': [{'date': '2025-12-31', 'revenue': 11e9, 'netIncome': 1.1e9, 'epsDiluted': 1.5, 'reportedCurrency': 'EUR',
                                       'weightedAverageShsOutDil': 7e8},
                                      {'date': '2024-12-31', 'revenue': 10e9, 'epsDiluted': 1.2, 'weightedAverageShsOutDil': 7e8}],
                 'balance-sheet-statement': [{'date': '2025-12-31', 'totalDebt': 3e9, 'totalStockholdersEquity': 6e9}],
                 'cash-flow-statement': [{'date': '2025-12-31', 'operatingCashFlow': 2e9, 'freeCashFlow': 1e9}]}
        seen = []

        def get(url, **kw):
            seen.append(url)
            return json.dumps(pages[url.split('/stable/')[1].split('?')[0]]).encode()
        with mock.patch.dict(os.environ, {'FMP_API_KEY': 'k'}), mock.patch.object(F, 'http_get', side_effect=get), \
                mock.patch.object(F, 'fetch_companyfacts', return_value={'cik': 999006, 'entityName': 'Abc Holdings', 'facts': {}}):
            b = F.fetch_base('999006', max_age_days=0)
        self.assertEqual((b['source'], b['currency'], b['period']), ('FMP', 'EUR', 'FY'))
        self.assertAlmostEqual(b['revenue_yoy'], 0.1)
        self.assertAlmostEqual(b['debt_to_equity'], 0.5)
        self.assertEqual(len(seen), 3)
        self.assertIn('symbol=ABC', seen[0])
        self.assertEqual(dict(F.rows(F.compute(b, 10.0, [10], [9])))['Source'], 'FMP · EUR · FY')

    def test_fmp_off_without_key(self):
        with mock.patch.dict(os.environ, {'FMP_API_KEY': ''}):
            self.assertIsNone(F.fmp_base('ABC'))

if __name__ == '__main__':
    unittest.main()
