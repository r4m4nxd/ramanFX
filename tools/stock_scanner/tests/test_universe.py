"""ADR + TOP universes (Alpaca mocked) and the cross-universe dedupe."""
import json
import os
import tempfile
import unittest

import helpers  # noqa: F401  (sys.path)
import universe as U
from zones import Bar


def asset(name, exchange='NYSE', status='active', tradable=True):
    return {'name': name, 'exchange': exchange, 'status': status, 'tradable': tradable}


def bars(dv_per_day, n=21, price=100.0):
    return [Bar(f'2026-10-{d + 1:02d}', price, price, price, price, dv_per_day / price) for d in range(n)]


class AdrTest(unittest.TestCase):
    curated = [{'symbol': 'BABA', 'name': 'Alibaba', 'country': 'CN', 'sector': 'Consumer Discretionary', 'cik': '1577552', 'adr_ratio': '8'},
               {'symbol': 'TCEHY', 'name': 'Tencent', 'country': 'CN', 'sector': 'Communication Services', 'cik': '', 'adr_ratio': ''},
               {'symbol': 'OLD', 'name': 'Delisted', 'country': 'GB', 'sector': 'Energy', 'cik': '', 'adr_ratio': ''},
               {'symbol': 'GONE', 'name': 'Unknown', 'country': 'GB', 'sector': 'Energy', 'cik': '', 'adr_ratio': ''},
               {'symbol': 'NOTR', 'name': 'Halted', 'country': 'JP', 'sector': 'Financials', 'cik': '', 'adr_ratio': ''},
               {'symbol': 'TSM', 'name': 'TSMC', 'country': 'TW', 'sector': 'Information Technology', 'cik': '', 'adr_ratio': '5'}]
    assets = {'BABA': asset('Alibaba Group Holding Limited American Depositary Shares'), 'TCEHY': asset('Tencent ADR', 'OTC'),
              'OLD': asset('Old plc', status='inactive'), 'NOTR': asset('Halted', tradable=False),
              'TSM': asset('Taiwan Semiconductor Manufacturing Company Ltd.')}

    def test_verification_drops_otc_inactive_unknown(self):
        logs = []
        rows = U.build_adr(self.curated, self.assets, log=logs.append)
        self.assertEqual([r['symbol'] for r in rows], ['BABA', 'TSM'])
        b = rows[0]
        self.assertEqual((b['indexes'], b['currency'], b['country'], b['cik'], b['sector']),
                         ('ADR', 'USD', 'CN', '0001577552', 'Consumer Discretionary'))
        self.assertIn('TCEHY (OTC)', logs[0])
        self.assertIn('OLD (NYSE, inactive)', logs[0])
        self.assertIn('GONE (unknown)', logs[0])

    def test_without_assets_previous_rows_win(self):
        prev = [{'symbol': 'BABA', 'name': 'Alibaba', 'indexes': 'ADR'}]
        self.assertEqual(U.build_adr(self.curated, None, prev, log=lambda m: None), prev)
        self.assertEqual(len(U.build_adr(self.curated, None, None, log=lambda m: None)), len(self.curated))

    def test_committed_list(self):
        rows = U.load_adr_list()
        syms = [r['symbol'] for r in rows]
        self.assertGreaterEqual(len(rows), 80)
        self.assertEqual(len(syms), len(set(syms)))
        self.assertIn('BABA', syms)
        for otc in ('TCEHY', 'NSRGY', 'ABBNY'):
            self.assertNotIn(otc, syms)
        for r in rows:
            self.assertIn(r['sector'], U.GICS, r)
            self.assertEqual(len(r['country']), 2, r)
            if r['adr_ratio']:
                self.assertGreater(float(r['adr_ratio']), 0)


class TopTest(unittest.TestCase):
    def test_is_common(self):
        ok = [('PLTR', 'Palantir Technologies Inc. Class A Common Stock'), ('BRK.B', 'Berkshire Hathaway Inc. Class B'),
              ('NU', 'Nu Holdings Ltd. Class A Ordinary Shares'), ('BABA', 'Alibaba Group Holding Limited American Depositary Shares'),
              ('EPD', 'Enterprise Products Partners L.P. Common Units'), ('VNO', 'Vornado Realty Trust Common Shares'),
              ('NTRS', 'Northern Trust Corporation Common Stock')]
        bad = [('QQQ', 'Invesco QQQ Trust, Series 1'), ('SOXL', 'Direxion Daily Semiconductor Bull 3X Shares'),
               ('TQQQ', 'ProShares UltraPro QQQ'), ('IBIT', 'iShares Bitcoin Trust ETF'), ('GBTC', 'Grayscale Bitcoin Trust'),
               ('ABCDW', 'ABC Acquisition Corp - Warrants'), ('ABCU', 'ABC Acquisition Corp Units'), ('XYZ.U', 'XYZ Corp Unit'),
               ('BAC.PRL', 'Bank of America 7.25% Non-Cumulative Perpetual Preferred'), ('PSAPF', 'Public Storage Depositary Shares each representing 1/1000'),
               ('PTY', 'PIMCO Corporate & Income Opportunity Fund'), ('NVDL', 'GraniteShares 2x Long NVDA Daily ETF'),
               ('SPAC', 'Big Acquisition Corp Class A Ordinary Shares'), ('T.PRA', 'AT&T 5% Notes')]
        for s, n in ok:
            self.assertTrue(U.is_common(s, n), (s, n))
        for s, n in bad:
            self.assertFalse(U.is_common(s, n), (s, n))
        self.assertEqual(U.clean_name('Palantir Technologies Inc. Class A Common Stock'), 'Palantir Technologies Inc.')

    def test_median_and_rank(self):
        b = bars(60e6)
        b[-1] = Bar(b[-1].d, 100, 100, 100, 100, 1e9)          # one huge day does not move the median
        self.assertAlmostEqual(U.median_dv(b), 60e6)
        self.assertIsNone(U.median_dv(bars(60e6, n=10)))        # too new
        dv = {'A': 500e6, 'B': 49e6, 'C': 80e6, 'D': 300e6, 'E': 90e6, 'X': 900e6}
        self.assertEqual(U.rank_top(dv, {'X'}, 50e6, 3), [('A', 500e6), ('D', 300e6), ('E', 90e6)])
        self.assertEqual([s for s, _ in U.rank_top(dv, set(), 50e6, 10)], ['X', 'A', 'D', 'E', 'C'])

    def test_refresh_top(self):
        assets = {'PLTR': asset('Palantir Technologies Inc. Class A Common Stock', 'NASDAQ'),
                  'SOFI': asset('SoFi Technologies, Inc. Common Stock', 'NASDAQ'),
                  'THIN': asset('Thin Corp Common Stock'), 'QQQ': asset('Invesco QQQ Trust, Series 1', 'NASDAQ'),
                  'AAPL': asset('Apple Inc. Common Stock', 'NASDAQ'), 'OTCX': asset('Otc Co', 'OTC'),
                  'ARCX': asset('Arca Co Common Stock', 'ARCA'), 'DEAD': asset('Dead Co', status='inactive')}
        dvs = {'PLTR': 4e9, 'SOFI': 600e6, 'THIN': 10e6, 'QQQ': 20e9, 'AAPL': 9e9, 'OTCX': 1e9, 'ARCX': 1e9, 'DEAD': 1e9}
        asked = []

        def bars_fn(syms, start, end):
            asked.extend(syms)
            return {s: bars(dvs[s]) for s in syms}
        sec = json.dumps({'0': {'ticker': 'PLTR', 'cik_str': 1321655}, '1': {'ticker': 'SOFI', 'cik_str': 1818874}}).encode()
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'top.csv')
            rows = U.refresh_top(assets, {'AAPL'}, bars_fn=bars_fn, sic_fn=lambda c: '7372' if c.endswith('1321655') else '6199',
                                 sec_raw=sec, path=p, log=lambda m: None, today='2026-10-26')
            self.assertEqual(sorted(asked), ['PLTR', 'SOFI', 'THIN'])     # ETF / OTC / ARCA / inactive / excluded never asked
            self.assertEqual([r['symbol'] for r in rows], ['PLTR', 'SOFI'])
            self.assertEqual((rows[0]['name'], rows[0]['sector'], rows[0]['cik'], rows[0]['dv20_musd']),
                             ('Palantir Technologies Inc.', 'Information Technology', '0001321655', '4000.0'))
            self.assertEqual(rows[1]['sector'], 'Financials')
            self.assertEqual([r['symbol'] for r in U.load_top(p)], ['PLTR', 'SOFI'])
            # failure / missing keys: the committed CSV stays (minus symbols now in another universe)
            kept = U.refresh_top(assets, {'SOFI'}, bars_fn=lambda *a: 1 / 0, path=p, log=lambda m: None, today='2026-10-26')
            self.assertEqual([r['symbol'] for r in kept], ['PLTR'])
            self.assertEqual([r['symbol'] for r in U.load_top(p)], ['PLTR', 'SOFI'])
            self.assertEqual([r['symbol'] for r in U.refresh_top(None, set(), path=p, log=lambda m: None)], ['PLTR', 'SOFI'])
            tr = U.top_rows(U.load_top(p))
            self.assertEqual((tr[0]['indexes'], tr[0]['currency']), ('TOP', 'USD'))

    def test_cap(self):
        assets = {f'S{i:03d}'.replace('0', 'A').replace('1', 'B').replace('2', 'C')[:4]: asset('X Common Stock') for i in range(12)}
        syms = sorted(assets)
        old_max = U.TOP_MAX
        U.TOP_MAX = 5
        try:
            with tempfile.TemporaryDirectory() as d:
                rows = U.refresh_top(assets, set(), bars_fn=lambda ss, a, b: {s: bars(100e6 + syms.index(s) * 1e6) for s in ss},
                                     sic_fn=lambda c: '', sec_raw=b'{}', path=os.path.join(d, 't.csv'), log=lambda m: None, today='2026-10-26')
        finally:
            U.TOP_MAX = old_max
        self.assertEqual([r['symbol'] for r in rows], syms[::-1][:5])
        self.assertTrue(all(r['sector'] == 'Other' for r in rows))

    def test_sic(self):
        self.assertEqual(U.sic_sector('3674'), 'Information Technology')
        self.assertEqual(U.sic_sector('2834'), 'Health Care')
        self.assertEqual(U.sic_sector('1311'), 'Energy')
        self.assertEqual(U.sic_sector('6798'), 'Real Estate')
        self.assertEqual(U.sic_sector(''), 'Other')


class DedupeTest(unittest.TestCase):
    def test_tags_and_fields(self):
        ndx = [{'symbol': 'ASML', 'name': 'ASML Holding N.V.', 'sector': 'Information Technology', 'cik': '', 'indexes': 'NDX'}]
        adr = [{'symbol': 'ASML', 'name': 'ASML Holding', 'sector': 'Information Technology', 'cik': '0000937966', 'indexes': 'ADR',
                'home': '', 'currency': 'USD', 'feed': '', 'country': 'NL'},
               {'symbol': 'BABA', 'name': 'Alibaba', 'sector': 'Consumer Discretionary', 'cik': '', 'indexes': 'ADR', 'country': 'CN'}]
        top = U.top_rows([{'symbol': 'PLTR', 'name': 'Palantir', 'sector': 'Information Technology', 'cik': ''}])
        m = {r['symbol']: r for r in U.merge([ndx, adr, top])}
        self.assertEqual(m['ASML']['indexes'], 'NDX,ADR')
        self.assertEqual((m['ASML']['name'], m['ASML']['cik'], m['ASML']['country']), ('ASML Holding N.V.', '0000937966', 'NL'))
        self.assertEqual(m['PLTR']['indexes'], 'TOP')
        self.assertEqual(U.merge([adr, ndx])[0]['indexes'], 'NDX,ADR')      # pill order, whatever the list order

    def test_committed_universe_has_adr(self):
        rows = U.load(indexes=U.INDEXES)
        syms = [r['symbol'] for r in rows]
        self.assertEqual(len(syms), len(set(syms)))
        adr = [r for r in rows if 'ADR' in r['indexes'].split(',')]
        self.assertGreaterEqual(len(adr), 80)
        self.assertTrue(all(r['currency'] == 'USD' and r['country'] for r in adr))
        self.assertIn('ADR', [m['code'] for m in U.index_meta()])

    def test_curated_cik_corrected(self):
        rows = [{'symbol': 'TSM', 'cik': '0000000001', 'indexes': 'ADR', 'feed': ''},
                {'symbol': 'AAPL', 'cik': '0000000002', 'indexes': 'SPX', 'feed': ''}]
        n = U.fill_ciks(rows, json.dumps({'0': {'ticker': 'TSM', 'cik_str': 1046179}, '1': {'ticker': 'AAPL', 'cik_str': 320193}}).encode())
        self.assertEqual((n, rows[0]['cik'], rows[1]['cik']), (1, '0001046179', '0000000002'))   # Wikipedia CIKs untouched


if __name__ == '__main__':
    unittest.main()
