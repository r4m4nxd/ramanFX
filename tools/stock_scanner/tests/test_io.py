"""data / universe / fundamentals / notify: offline unit tests with small fixtures."""
import json
import os
import unittest

import helpers  # noqa: F401
from helpers import PKG
import data as DATA
import fundamentals as F
import notify
import universe as U
from zones import Bar


class AggregateTest(unittest.TestCase):
    def days(self, start, n):
        import datetime as dt
        d, out = dt.date.fromisoformat(start), []
        while len(out) < n:
            if d.weekday() < 5:
                out.append(Bar(d.isoformat(), 10 + len(out), 11 + len(out), 9 + len(out), 10.5 + len(out)))
            d += dt.timedelta(days=1)
        return out

    def test_weekly(self):
        b = self.days('2026-10-05', 13)                        # Mon 5 Oct .. Wed 21 Oct
        w, complete = DATA.aggregate(b, 'W1')
        self.assertEqual([x.d for x in w], ['2026-10-05', '2026-10-12', '2026-10-19'])
        self.assertEqual((w[0].o, w[0].h, w[0].l, w[0].c), (10, 15, 9, 14.5))
        self.assertFalse(complete)
        self.assertEqual(len(DATA.closed_htf(b, 'W1')), 2)       # the forming week is dropped
        self.assertTrue(DATA.aggregate(self.days('2026-10-05', 10), 'W1')[1])   # ends on a Friday

    def test_monthly(self):
        b = self.days('2026-08-03', 45)
        m, complete = DATA.aggregate(b, 'MN')
        self.assertEqual([x.d[:7] for x in m], ['2026-08', '2026-09', '2026-10'])
        self.assertFalse(complete)

    def test_parse_yahoo_split_only(self):
        """Yahoo quote O/H/L/C are split-adjusted, not dividend-adjusted: kept as they are (the TradingView default
        chart); adjclose (dividends) is ignored."""
        js = {'chart': {'result': [{'meta': {'exchangeName': 'NMS', 'gmtoffset': -14400}, 'timestamp': [1761226200, 1761312600],
                                    'indicators': {'quote': [{'open': [10, 11], 'high': [12, 13], 'low': [9, 10], 'close': [11, 12], 'volume': [5, 6]}],
                                                   'adjclose': [{'adjclose': [5.5, 12]}]}}]}}
        bars, meta = DATA.parse_yahoo(json.dumps(js).encode())
        self.assertEqual(meta['exchange'], 'NMS')
        self.assertEqual(meta['adjustment'], 'split')
        self.assertEqual(len(bars), 2)
        self.assertAlmostEqual(bars[0].o, 10)
        self.assertAlmostEqual(bars[0].h, 12)
        self.assertAlmostEqual(bars[0].c, 11)
        self.assertAlmostEqual(bars[1].c, 12)

    def test_parse_stooq(self):
        raw = b'Date,Open,High,Low,Close,Volume\n2026-10-22,1,2,0.5,1.5,100\n2026-10-23,1.5,2.5,1,2,200\n'
        bars, meta = DATA.parse_stooq(raw)
        self.assertEqual([b.c for b in bars], [1.5, 2])
        with self.assertRaises(ValueError):
            DATA.parse_stooq(b'No data')

    def test_symbols_and_chart(self):
        self.assertEqual(DATA.yahoo_symbol('BRK.B'), 'BRK-B')
        self.assertEqual(DATA.stooq_symbol('BRK.B'), 'brk-b.us')
        self.assertEqual(DATA.tradingview_url('AAPL', 'NMS'), 'https://www.tradingview.com/chart/?symbol=NASDAQ:AAPL')
        self.assertEqual(DATA.tradingview_url('XYZ'), 'https://www.tradingview.com/chart/?symbol=XYZ')

    def test_user_agent_is_generic(self):
        self.assertNotIn('@', DATA.UA)
        self.assertNotIn('@', F.SEC_UA if not os.environ.get('SEC_UA') else 'x')


class UniverseTest(unittest.TestCase):
    def table(self, head, rows):
        return ('<table id="other"><tr><td>x</td></tr></table><table class="wikitable" id="constituents"><tr>'
                + ''.join(f'<th>{h}</th>' for h in head) + '</tr>' + ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows) + '</table>')

    def test_parse_spx(self):
        page = self.table(['Symbol', 'Security', 'GICS Sector', 'GICS Sub-Industry', 'Headquarters Location', 'Date added', 'CIK', 'Founded'],
                          [[f'<a>T{i}</a>', f'Name {i} &amp; Co', 'Industrials', 'Sub', 'HQ', '2000', str(i), '1990'] for i in range(450)])
        out = U.parse_wiki(page, 'SPX')
        self.assertEqual(len(out), 450)
        self.assertEqual(out[3], {'symbol': 'T3', 'name': 'Name 3 & Co', 'sector': 'Industrials', 'cik': '0000000003', 'indexes': 'SPX'})

    def test_parse_ndx_maps_icb(self):
        page = self.table(['Ticker', 'Company', 'ISIN', 'ICB Industry<sup>[2]</sup>', 'ICB Subsector'],
                          [[f'N{i}', f'Co {i}', 'US0', 'Technology' if i % 2 else 'Basic Materials', 'x'] for i in range(100)])
        out = U.parse_wiki(page, 'NDX')
        self.assertEqual({r['sector'] for r in out}, {'Information Technology', 'Materials'})

    def test_parse_tsx60_without_table_id(self):
        page = ('<table class="wikitable sortable"><tr><th>Symbol</th><th>Company</th><th>Sector</th></tr>'
                + ''.join(f'<tr><td>C{i}</td><td>Co {i}</td><td>Basic Materials</td></tr>' for i in range(60)) + '</table>')
        out = U.parse_wiki(page, 'TSX60')
        self.assertEqual(len(out), 60)
        self.assertEqual(out[0]['sector'], 'Materials')

    def test_name_match(self):
        self.assertEqual(U.name_match('Royal Bank of Canada', 'Royal Bank of Canada Common Stock'), 1.0)
        self.assertLess(U.name_match('Boyd Group Services Inc.', 'Boyd Gaming Corporation'), U.NAME_MATCH)
        self.assertLess(U.name_match('Telus Corporation', 'AT&T Inc.'), U.NAME_MATCH)
        self.assertGreaterEqual(U.name_match('AtkinsRéalis Group Inc.', 'AtkinsRealis Group Inc'), U.NAME_MATCH)

    def test_map_tsx(self):
        rows = [{'symbol': s, 'name': n, 'sector': 'Financials', 'cik': '', 'indexes': 'TSX'} for s, n in
                [('RY', 'Royal Bank of Canada'), ('T', 'Telus Corporation'), ('BYD', 'Boyd Group Services Inc.'),
                 ('CNR', 'Canadian National Railway Company'), ('ATD', 'Alimentation Couche-Tard Inc.'), ('BBD.B', 'Bombardier Inc.'),
                 ('EFX', 'Equifax Inc.'), ('XYZ', 'Xyz Mining Ltd.')]]
        ov = {'T': {'us': 'TU', 'note': '', 'name': ''}, 'CNR': {'us': 'CNI', 'note': '', 'name': ''},
              'ATD': {'us': '', 'note': 'OTC', 'name': ''}, 'EFX': {'us': 'EFXT', 'note': '', 'name': 'Enerflex Ltd.'}}
        act = lambda n, ex='NYSE': {'name': n, 'exchange': ex, 'status': 'active', 'tradable': True}
        assets = {'RY': act('Royal Bank of Canada'), 'TU': act('TELUS Corporation'), 'T': act('AT&T Inc.'),
                  'BYD': act('Boyd Gaming Corporation'), 'CNI': act('Canadian National Railway Company'),
                  'EFXT': act('Enerflex Ltd.'), 'XYZ': act('Xyz Mining Ltd', 'OTC')}
        logs = []
        m = {r['home']: r for r in U.map_tsx(rows, ov, assets, log=logs.append)}
        self.assertEqual((m['TSX:RY']['symbol'], m['TSX:RY']['currency'], m['TSX:RY']['feed']), ('RY', 'USD', ''))
        self.assertEqual(m['TSX:T']['symbol'], 'TU')                     # never AT&T
        self.assertEqual(m['TSX:CNR']['symbol'], 'CNI')
        self.assertEqual((m['TSX:EFX']['symbol'], m['TSX:EFX']['name']), ('EFXT', 'Enerflex Ltd.'))
        for k, sym in (('TSX:BYD', 'BYD.TO'), ('TSX:ATD', 'ATD.TO'), ('TSX:BBD.B', 'BBD-B.TO'), ('TSX:XYZ', 'XYZ.TO')):
            self.assertEqual((m[k]['symbol'], m[k]['currency'], m[k]['feed']), (sym, 'CAD', 'tsx'))
        self.assertTrue(any('Boyd Gaming' in l for l in logs))
        # without the asset list: the hand-checked map and the previous checked mapping only
        m2 = {r['home']: r['symbol'] for r in U.map_tsx(rows, ov, None, previous={'RY': 'RY'}, log=logs.append)}
        self.assertEqual((m2['TSX:RY'], m2['TSX:T'], m2['TSX:BYD']), ('RY', 'TU', 'BYD.TO'))
        ok, out = U.split_covered(list(m.values()))
        self.assertEqual(len(out), 4)
        self.assertEqual(len(U.split_covered(list(m.values()), ('tsx',))[1]), 0)
        self.assertEqual(U.coverage(list(m.values()))['TSX'], {'covered': 4, 'total': 8})

    def test_committed_tsx_map(self):
        m = U.load_map()
        self.assertEqual((m['T']['us'], m['CNR']['us'], m['RY']['us'], m['ATD']['us']), ('TU', 'CNI', 'RY', ''))
        self.assertTrue(all(k == k.upper() for k in m))

    def test_merge_dedupes_and_joins_indexes(self):
        a = [{'symbol': 'AAPL', 'name': 'Apple', 'sector': 'Information Technology', 'cik': '1', 'indexes': 'SPX'}]
        b = [{'symbol': 'AAPL', 'name': 'Apple Inc', 'sector': 'Technology', 'cik': '', 'indexes': 'NDX'},
             {'symbol': 'ASML', 'name': 'ASML', 'sector': 'Information Technology', 'cik': '', 'indexes': 'NDX'}]
        c = [{'symbol': 'AAPL', 'name': 'Apple', 'sector': '', 'cik': '', 'indexes': 'DJI'}]
        m = {r['symbol']: r for r in U.merge([a, b, c])}
        self.assertEqual(m['AAPL']['indexes'], 'SPX,NDX,DJI')
        self.assertEqual(m['AAPL']['name'], 'Apple')
        self.assertEqual(m['ASML']['indexes'], 'NDX')

    def test_fill_ciks(self):
        rows = [{'symbol': 'BRK.B', 'cik': ''}, {'symbol': 'ZZZ', 'cik': ''}]
        n = U.fill_ciks(rows, json.dumps({'0': {'ticker': 'BRK-B', 'cik_str': 1067983}}).encode())
        self.assertEqual((n, rows[0]['cik'], rows[1]['cik']), (1, '0001067983', ''))

    def test_committed_universe_and_switches(self):
        rows = U.load(indexes=U.INDEXES)
        self.assertGreater(len(rows), 490)
        self.assertTrue(all(r['symbol'] and r['sector'] and r['indexes'] for r in rows))
        aapl = next(r for r in rows if r['symbol'] == 'AAPL')
        self.assertEqual(aapl['indexes'], 'SPX,NDX,DJI')
        self.assertEqual(len([r for r in U.load(indexes=['DJI'])]), 30)
        os.environ['SCANNER_UNIVERSES'] = 'DJI'
        try:
            self.assertEqual(U.enabled(), ['DJI'])
        finally:
            del os.environ['SCANNER_UNIVERSES']

    def test_merge_update(self):
        old = [Bar(f'2026-10-{d:02d}', 1, 2, 0.5, 1.0 + d / 100) for d in range(1, 20)]
        new = [Bar(f'2026-10-{d:02d}', 1, 2, 0.5, 1.0 + d / 100) for d in range(15, 24)]
        m = DATA.merge_update(old, new)
        self.assertEqual(len(m), 23)
        bad = [Bar(b.d, b.o, b.h, b.l, b.c * 0.97) for b in new]       # history re-adjusted (dividend / split)
        self.assertIsNone(DATA.merge_update(old, bad))
        self.assertIsNone(DATA.merge_update(old, [Bar('2026-11-30', 1, 1, 1, 1)]))


class FundamentalsTest(unittest.TestCase):
    def setUp(self):
        with open(os.path.join(PKG, 'fixtures', 'companyfacts_sample.json')) as f:
            self.cf = json.load(f)

    def test_ttm_and_yoy(self):
        v, g, end = F.ttm_yoy(F.facts(self.cf, F.REVENUE))
        self.assertEqual(end, '2026-06-30')
        self.assertAlmostEqual(v, 44e9 + 24e9 - 21e9)
        self.assertAlmostEqual(g, 47 / 42 - 1)

    def test_table(self):
        f = F.compute(self.cf, 100.0, [80, 120, 125], [70, 75, 79])
        self.assertTrue(f['context_only'])
        self.assertAlmostEqual(f['pe'], 100 / 7.17, places=3)
        self.assertAlmostEqual(f['market_cap'], 100 * 1.02e9)
        self.assertAlmostEqual(f['debt_to_equity'], (11.5e9 + 1e9) / 25e9, places=4)
        self.assertAlmostEqual(f['fcf_ttm'], (9.1 + 4.9 - 4.2 - (2.3 + 1.2 - 1.1)) * 1e9)
        self.assertAlmostEqual(f['shares_yoy'], 1.02 / 1.05 - 1, places=4)
        labels = [k for k, _ in F.rows(f)]
        self.assertEqual(labels[0], 'Revenue TTM')
        self.assertIn('(2026-06)', dict(F.rows(f))['Revenue TTM'])

    def test_missing_is_na(self):
        f = F.compute(None, 50.0, [40, 60], [30, 45])
        d = dict(F.rows(f))
        self.assertEqual(d['Revenue TTM'], 'n/a')
        self.assertEqual(d['P/E'], 'n/a')
        self.assertEqual(d['52w range'], '67% of range')

    def test_negative_eps(self):
        cf = json.loads(json.dumps(self.cf))
        for r in cf['facts']['us-gaap']['EarningsPerShareDiluted']['units']['USD/shares']:
            r['val'] = -abs(r['val'])
        d = dict(F.rows(F.compute(cf, 10.0, [10], [9])))
        self.assertEqual(d['P/E'], 'neg')

    def test_filing_dates(self):
        self.assertIn('2026-07-31', F.filing_dates(self.cf))


class NotifyTest(unittest.TestCase):
    def sig(self, i, sector='Energy', kind='WATCH'):
        return {'kind': kind, 'watch': 'new', 'symbol': f'T{i}', 'name': 'A<B & Co', 'sector': sector, 'indexes': ['RUT'], 'tf': 'D1',
                'zone_type': 'STR', 'distal': 1.0, 'proximal': 2.0, 'to_entry_pct': 5.0, 'touches': 0, 'entry': 2.0, 'stop': 0.9,
                'target': 9.0, 'rr': 6.4, 'curve': 10.0, 'direction': 'LONG - FULL', 'w1': 'UP', 'mn': 'UP', 'score': i % 10,
                'rules': [{'status': 'pass', 'text': 'x' * 50, 'ref': 'L1', 'short': 'fresh'}] * 13}

    def test_one_calm_message_max_three_cards(self):
        res = {'date': '2026-10-23', 'generated_at': '2026-10-23T21:05:00Z', 'scanned': 500,
               'signals': [dict(self.sig(i, kind='BUY'), chart=f'https://tv/T{i}') for i in range(30)] + [self.sig(i, 'Utilities') for i in range(3)],
               'exits': [], 'blocked': {'reasons': [{'rule': 'location', 'label': 'HTF area not reached', 'count': 9}]}}
        msgs = notify.build_messages(res, top=5)
        self.assertEqual(len(msgs), 1)
        m = msgs[0]
        vis = notify.visible(m)
        self.assertTrue(vis.startswith('📈 <b>30 BUY · 3 WATCH · nothing to exit</b>'))
        self.assertIn('3:05 PM', vis)                                         # 17:05 EDT = 15:05 Calgary
        self.assertEqual(vis.count('</b>  BUY '), 3)                          # max 3 cards even with top=5
        self.assertIn('score 9/10', vis)
        self.assertEqual(m.count('<blockquote expandable>'), 1)
        self.assertIn('Also: ', m)
        self.assertLess(notify.u16(m), 4096)
        for tok in notify.JARGON:
            self.assertNotIn(tok, vis)
        self.assertEqual(len(m.buttons), 4)
        self.assertEqual([b['text'] for b in m.buttons[0]], ['📈 T9', '📈 T19', '📈 T29'])
        self.assertEqual([b['callback_data'] for b in m.buttons[1]], ['z:T9', 'z:T19', 'z:T29'])   # bot: zones
        self.assertEqual([b['callback_data'] for b in m.buttons[2]], ['c:T9', 'c:T19', 'c:T29'])   # bot: 4-TF chart
        self.assertEqual(m.buttons[3][0]['url'], notify.FULL_LIST)

    def test_escaped_and_quote_capped(self):
        rows = [{'s': f'S{i}', 'pct': 1.0} for i in range(9)]
        zl = {'demand': {sec: rows for sec in ('in', 'near', 'left')}, 'supply': {sec: rows for sec in ('in', 'near', 'left')}}
        res = {'date': '2026-10-23', 'scanned': 5, 'exits': [{'symbol': 'A&B', 'reasons': ['stop']}],
               'signals': [dict(self.sig(1), name='A<B & Co', symbol='X<Y')], 'zone_lists': zl,
               'watch_alerts': [{'kind': 'APPROACH', 'text': f'W{i}: near the W1 demand'} for i in range(12)]}
        m = notify.build_messages(res)[0]
        self.assertIn('X&lt;Y', m)
        self.assertIn('🚪 <b>A&amp;B</b>  EXIT · stop hit by the close', m)
        q = m.split('<blockquote expandable>')[1].split('</blockquote>')[0].split('\n')
        self.assertLessEqual(len(q), notify.QUOTE_LINES)
        big = notify.quote([f'line {i}' for i in range(20)]).split('\n')
        self.assertEqual(len(big), notify.QUOTE_LINES)
        self.assertEqual(big[-1], '+6 more in the app</blockquote>')
        self.assertNotIn('W1', ''.join(q))                                   # timeframes in words

    def test_quiet_day_headline(self):
        m = notify.build_messages({'date': '2026-10-23', 'signals': [], 'exits': []})[0]
        self.assertTrue(m.startswith('📈 <b>No new setups</b>'))
        self.assertLessEqual(len(notify.visible(m).strip().split('\n')), 4)

    def test_long_detail_is_trimmed_to_fit(self):
        long = [('x' * 300) for _ in range(40)]
        m = notify.compose(['<b>t</b>'], ['card'], long, cap=40)
        self.assertLessEqual(notify.u16(m), notify.SAFE)
        self.assertIn('</blockquote>', m)

    def test_send_falls_back_to_a_plain_blockquote(self):
        calls = []

        def fake(token, fields):
            calls.append(dict(fields))
            if '<blockquote expandable>' in fields['text']:
                return {'ok': False, 'code': 400, 'desc': "Bad Request: can't parse entities: unsupported start tag"}
            return {'ok': True, 'code': 200}
        old_post, env = notify._post, {k: os.environ.get(k) for k in ('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID')}
        os.environ.update(TELEGRAM_BOT_TOKEN='t', TELEGRAM_CHAT_ID='1')
        notify._post = fake
        try:
            m = notify.Msg('<b>x</b>\n<blockquote expandable>a</blockquote>', [[notify.button('Open', 'https://a')]])
            self.assertTrue(notify.send([m], pause=0))
        finally:
            notify._post = old_post
            for k, v in env.items():
                if v is None:
                    os.environ.pop(k, None)
                else:
                    os.environ[k] = v
        self.assertEqual(len(calls), 2)
        self.assertIn('<blockquote>a</blockquote>', calls[1]['text'])
        self.assertIn('inline_keyboard', calls[1]['reply_markup'])

    def test_messages_fit_and_split_between_cards(self):
        cards = [f'card {i}\n' + 'é' * 300 for i in range(40)]
        msgs = notify.pack_cards('<b>Title</b>', cards)
        self.assertGreater(len(msgs), 1)
        for m in msgs:
            self.assertLess(notify.u16(m), 4000)
            self.assertTrue(m.startswith('<b>Title</b>'))
        self.assertEqual(sum(m.count('card ') for m in msgs), 40)             # no card cut in two

    def test_utf16_length(self):
        self.assertEqual(notify.u16('🟢'), 2)
        self.assertEqual(notify.u16('ab'), 2)

    def test_send_without_env_prints(self):
        old = {k: os.environ.pop(k, None) for k in ('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID')}
        try:
            import contextlib
            import io
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                self.assertFalse(notify.send(['hi']))
            self.assertIn('hi', buf.getvalue())
        finally:
            for k, v in old.items():
                if v is not None:
                    os.environ[k] = v


if __name__ == '__main__':
    unittest.main()


class SecCacheTest(unittest.TestCase):
    def test_refresh_plan_weekly_daily_and_cap(self):
        import tempfile
        import time
        old = F.CACHE
        F.CACHE = tempfile.mkdtemp()
        try:
            def put(cik, days):
                os.makedirs(os.path.join(F.CACHE, 'sec_lite'), exist_ok=True)
                with open(F._lite_path(cik), 'w') as f:
                    json.dump({'fetched': time.time() - days * 86400, 'base': {'eps_ttm': 1.0}}, f)
            put('1', 0.5); put('2', 3); put('3', 8); put('4', 30)
            plan = F.refresh_plan(['1', '2', '3', '4', '5'], urgent=['2'], per_run=3)
            self.assertEqual(plan, ['2', '5', '4'])          # urgent first, then missing / oldest; '1' fresh, cap 3
            self.assertEqual(F.refresh_plan(['1'], urgent=['1'], per_run=5), [])
            self.assertEqual(F.cached_base('3')[0], {'eps_ttm': 1.0})
            self.assertEqual(F.fetch_base('3', offline=True), {'eps_ttm': 1.0})
        finally:
            F.CACHE = old

    def test_base_round_trip(self):
        with open(os.path.join(PKG, 'fixtures', 'companyfacts_sample.json')) as f:
            cf = json.load(f)
        b = json.loads(json.dumps(F.base(cf)))
        self.assertIn('2026-07-31', b['filings'])
        self.assertEqual(F.compute(cf, 100, [90, 110], [80, 95]), F.compute(b, 100, [90, 110], [80, 95]))

    def test_sec_pace(self):
        self.assertGreaterEqual(DATA.HOST_PAUSE['data.sec.gov'], 0.2)   # <= 5 requests a second
