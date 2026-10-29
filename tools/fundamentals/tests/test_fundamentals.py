"""Unit tests for tools/fundamentals (no network: every HTTP call is mocked)."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import fx_macro as FX  # noqa: E402
import sec_stocks as ST  # noqa: E402
import build as B  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 29, 23, 0, tzinfo=UTC)


def ev(country, title, date, actual=None, previous=None, forecast=None, period='', indicator='', unit='%'):
    return {'country': country, 'title': title, 'date': date, 'actual': actual, 'previous': previous, 'forecast': forecast,
            'period': period, 'indicator': indicator, 'unit': unit, 'importance': 1}


CAL = [
    ev('US', 'Fed Interest Rate Decision', '2026-09-16T18:00:00.000Z', 4.25, 4.5, indicator='Interest Rate'),
    ev('US', 'Fed Interest Rate Decision', '2026-10-28T18:00:00.000Z', 4.0, 4.25, 4.0, indicator='Interest Rate'),
    ev('US', 'Fed Interest Rate Decision', '2026-12-09T19:00:00.000Z', None, 4.0, 3.75, indicator='Interest Rate'),
    ev('US', 'Inflation Rate YoY', '2026-10-15T12:30:00.000Z', 3.0, 2.9, period='Sep', indicator='Inflation Rate'),
    ev('US', 'Core Inflation Rate YoY', '2026-10-15T12:30:00.000Z', 3.1, 3.1, period='Sep'),
    ev('US', 'Inflation Rate MoM', '2026-10-15T12:30:00.000Z', 0.3, 0.4, period='Sep'),
    ev('US', 'GDP Growth Rate QoQ Adv', '2026-07-30T12:30:00.000Z', 3.8, -0.5, period='Q2'),
    ev('US', 'Unemployment Rate', '2026-10-02T12:30:00.000Z', 4.3, 4.3, period='Sep'),
    ev('US', 'Fed Chair Powell Speech', '2026-10-20T12:30:00.000Z'),
    ev('EU', 'ECB Deposit Facility Rate', '2026-06-05T12:15:00.000Z', 2.0, 2.25),
    ev('EU', 'ECB Deposit Facility Rate', '2026-10-30T12:15:00.000Z', None, 2.0, 2.0),
    ev('EU', 'ECB Deposit Facility Rate', '2026-09-11T12:15:00.000Z', 2.0, 2.0),
    ev('EU', 'ECB Interest Rate Decision', '2026-09-11T12:15:00.000Z', 2.15, 2.15, indicator='Interest Rate'),
    ev('EU', 'Inflation Rate YoY Flash', '2026-10-01T09:00:00.000Z', 2.2, 2.0, period='Sep', indicator='Inflation Rate'),
    ev('EU', 'GDP Growth Rate YoY Flash', '2026-10-30T09:00:00.000Z', None, 1.5, period='Q3'),
    ev('EU', 'GDP Growth Rate YoY 2nd Est', '2026-08-14T09:00:00.000Z', 1.4, 1.5, period='Q2'),
    ev('EU', 'Unemployment Rate', '2026-10-02T09:00:00.000Z', 6.3, 6.2, period='Aug'),
    ev('DE', 'Inflation Rate YoY', '2026-09-29T12:00:00.000Z', 2.4, 2.2),
    ev('JP', 'BoJ Interest Rate Decision', '2026-09-19T03:00:00.000Z', 0.5, 0.5),
    ev('JP', 'Inflation Rate YoY', '2026-10-17T23:30:00.000Z', 2.9, 2.7),
    ev('JP', 'Tokyo CPI YoY', '2026-10-23T23:30:00.000Z', 2.5, 2.4),
    {'country': 'US', 'title': 'bad', 'date': 'nope'},
]
PAGE = json.dumps({'status': 'ok', 'result': CAL})
INSTR = [{'sym': 'EURUSD', 'cls': 'major'}, {'sym': 'USDJPY', 'cls': 'major'}, {'sym': 'XAUUSD', 'cls': 'metal'},
         {'sym': 'US500', 'cls': 'cfd'}, {'sym': 'BTCUSD', 'cls': 'crypto'}, {'sym': 'EURJPY', 'cls': 'cross'},
         {'sym': 'SPOTCRUDE', 'cls': 'cfd'}]


class CalendarTest(unittest.TestCase):
    def setUp(self):
        self.evs = FX.load_events(NOW, lambda u: PAGE, log=lambda *_: None)

    def test_parse_and_windows(self):
        self.assertEqual(len(self.evs), len(CAL) - 1)                  # bad row dropped, windows deduped
        ws = FX.windows(NOW)
        self.assertGreaterEqual(len(ws), 10)
        self.assertIn('countries=', ws[0])
        self.assertIn('US', ws[0])
        self.assertEqual(FX._num('4.25%'), 4.25)
        self.assertIsNone(FX._num(None))

    def test_kinds(self):
        k = lambda t, ind='': FX.kind_of({'title': t, 'indicator': ind})  # noqa: E731
        self.assertEqual(k('Fed Interest Rate Decision'), 'rate')
        self.assertEqual(k('RBA Interest Rate Decision'), 'rate')
        self.assertEqual(k('BoE Interest Rate Decision'), 'rate')
        self.assertIsNone(k('FOMC Minutes'))
        self.assertIsNone(k('Fed Chair Powell Speech'))
        self.assertEqual(k('Inflation Rate YoY'), 'cpi')
        self.assertEqual(k('CPI (YoY)'), 'cpi')
        self.assertIsNone(k('Core Inflation Rate YoY'))
        self.assertIsNone(k('Inflation Rate MoM'))
        self.assertIsNone(k('Tokyo CPI YoY'))
        self.assertEqual(k('GDP Growth Rate YoY 2nd Est'), 'gdp_yoy')
        self.assertEqual(k('GDP Growth Rate QoQ Adv'), 'gdp_qoq')
        self.assertIsNone(k('GDP Price Index QoQ'))
        self.assertEqual(k('Unemployment Rate'), 'unemp')
        self.assertIsNone(k('Unemployment Change'))
        self.assertIsNone(k('Youth Unemployment Rate'))

    def test_currency_blocks(self):
        fomc = FX.fomc_dates({'kinds': {'fomc': {'events': [{'date': '2026-10-28', 'et': '14:00', 'verified': True},
                                                             {'date': '2026-12-09', 'et': '14:00', 'verified': True}]}}})
        self.assertEqual(fomc, ['2026-10-28T18:00:00Z', '2026-12-09T19:00:00Z'])
        us = FX.currency_data('USD', self.evs, NOW, fomc)
        self.assertEqual(us['rate']['v'], 4.0)
        self.assertEqual(us['rate']['chg'], -0.25)
        self.assertEqual(us['rate']['date'], '2026-10-28T18:00:00Z')
        self.assertEqual(us['rate']['move'], {'date': '2026-10-28T18:00:00Z', 'chg': -0.25})
        self.assertEqual(us['next'], {'date': '2026-12-09T19:00:00Z', 'verified': True, 'src': 'federalreserve.gov'})
        self.assertEqual(us['cpi']['v'], 3.0)
        self.assertEqual(us['cpi']['period'], 'Sep')
        self.assertEqual(us['gdp']['basis'], 'q/q ann.')
        self.assertEqual(us['unemp']['v'], 4.3)
        self.assertEqual(us['real'], 1.0)
        eu = FX.currency_data('EUR', self.evs, NOW)
        self.assertEqual(eu['rate']['v'], 2.0)                          # the deposit rate, not the 2.15% refi rate
        self.assertEqual(eu['rate']['chg'], 0.0)                        # held in September
        self.assertEqual(eu['rate']['move']['date'][:10], '2026-06-05')
        self.assertEqual(eu['next']['date'], '2026-10-30T12:15:00Z')
        self.assertEqual(eu['next']['forecast'], 2.0)
        self.assertFalse(eu['next']['verified'])
        self.assertEqual(eu['cpi']['v'], 2.2)                           # EU, not Germany
        self.assertEqual((eu['gdp']['v'], eu['gdp']['basis']), (1.4, 'y/y'))   # the flash has no actual yet
        jp = FX.currency_data('JPY', self.evs, NOW)
        self.assertEqual(jp['cpi']['v'], 2.9)                           # national, not Tokyo
        self.assertNotIn('move', jp['rate'])

    def test_bias(self):
        fx = FX.build(NOW, self.evs, INSTR, [])
        p = fx['pairs']['EURUSD']
        self.assertEqual((p['base'], p['quote'], p['diff']), ('EUR', 'USD', -2.0))
        self.assertEqual(p['carry'], {'earns': 'short', 'ccy': 'USD', 'pct': 2.0})
        self.assertEqual(p['cpi_diff'], -0.8)
        self.assertNotIn('gdp_diff', p)                                 # y/y vs q/q annualised: not compared
        self.assertTrue(p['bias'].startswith('USD stronger: higher rate'), p['bias'])
        self.assertIn('hotter CPI', p['bias'])
        self.assertEqual(p['score'], -3)                                # rate -2, CPI -1; both banks cut this year: no point
        self.assertIn('EURJPY', fx['pairs'])
        self.assertEqual(fx['pairs']['EURJPY']['bias'], 'Mixed: EUR (higher rate) vs JPY (ECB cutting, hotter CPI)')
        self.assertIn('pays no yield', fx['notes']['XAUUSD']['text'])
        self.assertIn('US real rate +1.0%', fx['notes']['XAUUSD']['text'])
        self.assertIn('Fed 4%', fx['notes']['US500']['text'])
        self.assertIn('Crypto', fx['notes']['BTCUSD']['text'])
        self.assertIn('Energy', fx['notes']['SPOTCRUDE']['text'])
        self.assertEqual(fx['notes']['XAUUSD']['ccys'], ['USD'])
        self.assertEqual(FX.ccys_for('XAUEUR'), ['USD', 'EUR'])
        self.assertEqual(FX.ccys_for('GER40'), ['EUR'])
        self.assertTrue(fx['context_only'])
        self.assertTrue(all(isinstance(x, str) for x in FX.summary(fx)))

    def test_bias_lines(self):
        self.assertEqual(FX.bias_line('EUR', 'USD', -3, {'EUR': [], 'USD': ['higher rate', 'hotter CPI']}), 'USD stronger: higher rate, hotter CPI')
        self.assertEqual(FX.bias_line('EUR', 'USD', 0, {'EUR': ['stronger growth'], 'USD': ['hotter CPI']}), 'Mixed: EUR (stronger growth) vs USD (hotter CPI)')
        self.assertTrue(FX.bias_line('EUR', 'USD', 0, {'EUR': [], 'USD': []}).startswith('Balanced'))
        self.assertIsNone(FX.pair_view('EUR', 'GBP', {}, NOW))

    def test_failed_calendar(self):
        def boom(u):
            raise OSError('403')
        self.assertEqual(FX.load_events(NOW, boom, log=lambda *_: None), [])
        self.assertIsNone(B.build_fx(NOW, boom, log=lambda *_: None))


# ---- EDGAR --------------------------------------------------------------------------------------------------------
def fact(start, end, val, form='10-Q', filed=None):
    r = {'end': end, 'val': val, 'form': form, 'filed': filed or end[:8] + '28'}
    if start:
        r['start'] = start
    return r


def series(fy24, h1_24, fy25, h1_25, h1_26, q1_26):
    return [fact('2024-01-01', '2024-12-31', fy24, '10-K', '2025-02-10'), fact('2024-01-01', '2024-06-30', h1_24),
            fact('2025-01-01', '2025-12-31', fy25, '10-K', '2026-02-10'), fact('2025-01-01', '2025-06-30', h1_25),
            fact('2026-01-01', '2026-06-30', h1_26), fact('2026-01-01', '2026-03-31', q1_26)]


FACTS = {'cik': 1234, 'entityName': 'Example Corp', 'facts': {
    'us-gaap': {
        'Revenues': {'units': {'USD': series(360e9, 180e9, 400e9, 200e9, 230e9, 110e9)}},
        'NetIncomeLoss': {'units': {'USD': series(36e9, 18e9, 40e9, 20e9, 23e9, 11e9)}},
        'EarningsPerShareDiluted': {'units': {'USD/shares': series(3.6, 1.8, 4.0, 2.0, 2.3, 1.1)}},
        'StockholdersEquity': {'units': {'USD': [fact(None, '2026-06-30', 100e9)]}},
        'LongTermDebt': {'units': {'USD': [fact(None, '2026-06-30', 50e9)]}},
    },
    'dei': {'EntityCommonStockSharesOutstanding': {'units': {'shares': [fact(None, '2026-07-20', 10e9)]}}},
}}

SUBS = {'cik': '1234', 'name': 'Example Corp', 'filings': {'recent': {
    'form': ['8-K', '10-Q', '8-K', '8-K', '10-Q', '8-K', '10-K', '8-K', '8-K', '10-Q', '8-K'],
    'filingDate': ['2026-10-20', '2026-08-05', '2026-07-30', '2026-06-12', '2026-05-06', '2026-04-30', '2026-02-10',
                   '2026-02-05', '2025-10-30', '2025-11-05', '2025-07-31'],
    'reportDate': ['2026-10-20', '2026-06-30', '2026-07-30', '2026-06-12', '2026-03-31', '2026-04-30', '2025-12-31',
                   '2026-02-05', '2025-10-30', '2025-09-30', '2025-07-31'],
    'items': ['5.02,9.01', '', '2.02,9.01', '5.07', '', '2.02,9.01', '', '2.02', '2.02,9.01', '', '2.02'],
    'accessionNumber': ['0001-26-000010', 'x', '0001-26-000008', '0001-26-000007', 'x', '0001-26-000005', 'x', 'a', 'b', 'x', 'c'],
    'primaryDocument': ['d10.htm', 'q.htm', 'd8.htm', 'd7.htm', 'q.htm', 'd5.htm', 'k.htm', 'a.htm', 'b.htm', 'q.htm', 'c.htm'],
    'primaryDocDescription': ['8-K'] * 11,
}}}


class EdgarTest(unittest.TestCase):
    def test_ttm_math(self):
        b = ST.SF.base(FACTS)
        self.assertAlmostEqual(b['revenue_ttm'], 430e9)                 # FY25 400 + H1'26 230 - H1'25 200
        self.assertAlmostEqual(b['revenue_yoy'], 430 / 380 - 1, places=6)   # vs FY24 360 + 200 - 180
        self.assertAlmostEqual(b['eps_ttm'], 4.3)
        self.assertAlmostEqual(b['net_margin'], 0.1)
        self.assertAlmostEqual(b['debt_to_equity'], 0.5)
        self.assertEqual(b['revenue_end'], '2026-06-30')
        u = {'s': 'EXM', 'n': 'Example Corp', 'px': 100.0, 'cik': '0000001234', 'tsx_only': False}
        r = ST.record(u, b, ST.parse_submissions(SUBS), None, dt.date(2026, 10, 29))
        self.assertEqual(r['mcap'], 1e12)
        self.assertAlmostEqual(r['pe'], 100 / 4.3, places=3)
        self.assertEqual((r['rev'], r['eps'], r['nm'], r['de'], r['src'], r['cur']), (430e9, 4.3, 0.1, 0.5, 'SEC', 'USD'))
        self.assertEqual(r['cik'], '1234')

    def test_submissions_and_earnings(self):
        s = ST.parse_submissions(SUBS)
        self.assertEqual(s['er'], ['2025-07-31', '2025-10-30', '2026-02-05', '2026-04-30', '2026-07-30'])
        self.assertEqual(s['k8'][0][:3], ['2026-10-20', '8-K', 'Director / officer change'])
        self.assertEqual(s['k8'][0][3], 'https://www.sec.gov/Archives/edgar/data/1234/000126000010/d10.htm')
        self.assertEqual(s['k8'][1][2], 'Earnings results')
        self.assertEqual(s['k8'][2][2], 'Shareholder vote')
        today = dt.date(2026, 10, 20)
        self.assertEqual(ST.last_release(s['er'], s['periodic'], today), '2026-07-30')
        self.assertEqual(ST.estimate_next(s['er'], s['periodic'], today), '2026-10-29')   # 2025-10-30 + 364 days
        self.assertEqual(ST.estimate_next(['2026-07-30'], [], today), '2026-10-29')       # + 91 days
        self.assertEqual(ST.estimate_next(['2026-05-01'], [], today), None)               # far overdue
        self.assertEqual(ST.estimate_next([], [['2026-08-05', '10-Q', '2026-06-30']], today), '2026-11-04')
        self.assertIsNone(ST.estimate_next([], [], today))
        self.assertEqual(ST._weekday(dt.date(2026, 10, 31)), dt.date(2026, 11, 2))

    def test_nasdaq(self):
        page = json.dumps({'data': {'rows': [
            {'symbol': 'EXM', 'time': 'time-after-hours', 'epsForecast': '$1.25'},
            {'symbol': 'BRK.B', 'time': 'time-pre-market', 'epsForecast': '($0.10)'},
            {'symbol': 'ZZZ', 'time': 'time-not-supplied', 'epsForecast': ''}]}}).encode()
        rows = ST.parse_nasdaq(page, '2026-11-02')
        self.assertEqual(rows['EXM'], {'date': '2026-11-02', 'time': 'after close', 'eps_est': 1.25})
        self.assertEqual(rows['BRKB']['eps_est'], -0.1)
        self.assertEqual(rows['ZZZ']['time'], '')
        self.assertEqual(ST.parse_nasdaq(b'{"data": {"rows": null}}', '2026-11-03'), {})
        seen = []

        def get(u):
            seen.append(u)
            return page if u.endswith('2026-11-02') else b'{"data": {"rows": []}}'
        cal = ST.nasdaq_calendar(dt.date(2026, 10, 29), days_ahead=7, days_back=2, get=get, log=lambda *_: None)
        self.assertEqual(cal['next']['EXM']['date'], '2026-11-02')
        self.assertTrue(all('api.nasdaq.com/api/calendar/earnings?date=' in u for u in seen))
        self.assertFalse(any(u.endswith(('2026-10-31', '2026-11-01')) for u in seen))   # weekends skipped

        def boom(u):
            raise OSError('blocked')
        self.assertIsNone(ST.nasdaq_calendar(dt.date(2026, 10, 29), get=boom, log=lambda *_: None))
        u = {'s': 'EXM', 'n': 'Example', 'px': 10.0, 'cik': '', 'tsx_only': False}
        r = ST.record(u, None, ST.parse_submissions(SUBS), cal, dt.date(2026, 10, 29))
        self.assertEqual((r['er_next'], r['er_kind'], r['er_time'], r['eps_est']), ('2026-11-02', 'nasdaq', 'after close', 1.25))

    def test_tsx_and_company_tickers(self):
        r = ST.record({'s': 'AC.TO', 'n': 'Air Canada', 'px': 20, 'cik': '', 'tsx_only': True}, None, None, None, dt.date(2026, 10, 29))
        self.assertEqual(r, {'n': 'Air Canada', 'na': 'TSX-only: no SEC filings'})
        m = ST.parse_company_tickers(b'{"0": {"cik_str": 320193, "ticker": "AAPL", "title": "Apple"}, "1": {"cik_str": 1067983, "ticker": "BRK-B", "title": "B"}}')
        self.assertEqual(m, {'AAPL': '0000320193', 'BRKB': '0001067983'})
        self.assertEqual(ST.user_agent(' me@example.org '), 'RamanFX fundamentals me@example.org')

    def test_no_contact_skips_sec(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(ST, 'CACHE', d), \
                mock.patch.object(ST.SD, 'http_get', side_effect=AssertionError('no SEC request without SEC_CONTACT')):
            logs = []
            out = ST.build(NOW, '', earnings=False, log=logs.append)
            self.assertFalse(out['sec'])
            self.assertTrue(any('SEC_CONTACT' in l for l in logs))
            self.assertGreater(len(out['stocks']), 500)

    def test_refresh_with_contact(self):
        calls = []

        def get(url, ua=None, **k):
            calls.append((url, ua))
            return json.dumps(FACTS if 'companyfacts' in url else SUBS).encode()
        with tempfile.TemporaryDirectory() as d, mock.patch.object(ST, 'CACHE', d), mock.patch.object(ST.SD, 'http_get', side_effect=get):
            ST.refresh(['0000001234'], 'RamanFX fundamentals x@y.z', 'facts', 7, 10, 60, log=lambda *_: None)
            ST.refresh(['0000001234'], 'RamanFX fundamentals x@y.z', 'subs', 1, 10, 60, log=lambda *_: None)
            ST.refresh(['0000001234'], 'RamanFX fundamentals x@y.z', 'facts', 7, 10, 60, log=lambda *_: None)   # fresh: no call
            self.assertEqual(len(calls), 2)
            self.assertTrue(all(ua == 'RamanFX fundamentals x@y.z' for _, ua in calls))
            self.assertEqual(calls[0][0], 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000001234.json')
            self.assertAlmostEqual(ST.cache_get('facts', '0000001234')[0]['eps_ttm'], 4.3)
            self.assertEqual(ST.cache_get('subs', '0000001234')[0]['er'][-1], '2026-07-30')


if __name__ == '__main__':
    unittest.main()
