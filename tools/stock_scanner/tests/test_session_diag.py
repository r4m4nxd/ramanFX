"""Intraday guard (drop today's partial bar while the US market is open), the W1 'known' date of WATCH 'new', and
the "why no signal" diagnostics."""
import datetime as dt
import json
import os
import tempfile
import types
import unittest

import helpers  # noqa: F401
import scan
import selftest
import zones as Z
from zones import Bar

UTC = dt.timezone.utc


def at(y, m, d, hh, mm):
    return dt.datetime(y, m, d, hh, mm, tzinfo=UTC)


def bar(d, c=100.0):
    return Bar(d, c, c + 1, c - 1, c)


class EasternTest(unittest.TestCase):
    def test_dst_boundaries(self):
        self.assertEqual(scan.us_eastern(at(2026, 10, 26, 16, 30)).hour, 12)      # EDT: UTC-4
        self.assertEqual(scan.us_eastern(at(2026, 12, 1, 16, 30)).hour, 11)       # EST: UTC-5
        self.assertEqual(scan.us_eastern(at(2026, 3, 8, 6, 59)).hour, 1)          # still EST
        self.assertEqual(scan.us_eastern(at(2026, 3, 8, 7, 0)).hour, 3)           # 2am EST -> 3am EDT
        self.assertEqual(scan.us_eastern(at(2026, 11, 1, 5, 59)).hour, 1)         # still EDT
        self.assertEqual(scan.us_eastern(at(2026, 11, 1, 6, 0)).hour, 1)          # 2am EDT -> 1am EST


class DropPartialTest(unittest.TestCase):
    bars = [bar('2026-10-22'), bar('2026-10-23'), bar('2026-10-26')]

    def test_market_open_drops_today(self):
        b, cut = scan.drop_partial(self.bars, at(2026, 10, 26, 16, 30))         # the first real scan: 12:30 New York
        self.assertTrue(cut)
        self.assertEqual(b[-1].d, '2026-10-23')

    def test_after_close_keeps_today(self):
        b, cut = scan.drop_partial(self.bars, at(2026, 10, 26, 21, 45))         # the scheduled run: 17:45 New York
        self.assertFalse(cut)
        self.assertEqual(b[-1].d, '2026-10-26')

    def test_settle_window(self):
        self.assertTrue(scan.drop_partial(self.bars, at(2026, 10, 26, 20, 10))[1])    # 16:10: bar not final yet
        self.assertFalse(scan.drop_partial(self.bars, at(2026, 10, 26, 20, 20))[1])   # 16:20: final

    def test_premarket_before_any_bar_keeps_yesterday(self):
        b, cut = scan.drop_partial(self.bars[:2], at(2026, 10, 26, 12, 0))
        self.assertFalse(cut)
        self.assertEqual(b[-1].d, '2026-10-23')

    def test_run_intraday_equals_last_close(self):
        """A scan during the session gives exactly the signals of the last closed session and says so."""
        base = selftest.fixture_bars()
        live = {s: b + [Bar('2026-10-26', b[-1].c, b[-1].c * 1.03, b[-1].c * 0.9, b[-1].c * 0.92)] for s, b in base.items()}
        uni = [{'symbol': fx['symbol'], 'name': fx['name'], 'sector': fx['sector'], 'cik': '', 'indexes': fx['indexes']} for fx in selftest.FIXTURES]

        def go(bars, now):
            return scan.run(uni, lambda s: (bars[s], {}), lambda c: None, lambda s: None, [], log=None, now=now)
        a = go(base, at(2026, 10, 26, 16, 30))
        b = go(live, at(2026, 10, 26, 16, 30))
        key = lambda r: sorted((s['symbol'], s['kind'], s['tf'], s['proximal']) for s in r['signals'])
        self.assertEqual(a['session'], 'closed')
        self.assertEqual(b['session'], 'intraday-dropped')
        self.assertEqual(b['date'], '2026-10-23')
        self.assertEqual(key(a), key(b))
        self.assertTrue(key(b))
        self.assertEqual(scan.public_json(b)['session'], 'intraday-dropped')
        c = go(live, at(2026, 10, 26, 21, 45))                                    # after the close the bar counts
        self.assertEqual(c['session'], 'closed')
        self.assertEqual(c['date'], '2026-10-26')


class KnownDateTest(unittest.TestCase):
    def zone(self, tf, made):
        return Z.Zone(tf=tf, dir=1, prox=10, dist=9, leg_bar=3, base_n=1, sa_bar=2, leg_ratio=2, cont=True, gap=1, leg2=False, made=made)

    def test_w1_zone_known_at_the_week_close(self):
        an = types.SimpleNamespace(d1_dates=['2026-10-16', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
                                             '2026-10-26', '2026-10-27', '2026-10-28'])
        self.assertEqual(scan.known_date(an, self.zone('W1', '2026-10-19')), '2026-10-23')
        self.assertEqual(scan.known_date(an, self.zone('D1', '2026-10-21')), '2026-10-21')
        recent = an.d1_dates[-scan.NEW_ZONE_SESSIONS]                          # 2026-10-22
        self.assertLess('2026-10-19', recent)                                  # the old check (z.made) missed it
        self.assertGreaterEqual(scan.known_date(an, self.zone('W1', '2026-10-19')), recent)

    def test_w1_zone_of_the_current_week_is_not_known(self):
        an = types.SimpleNamespace(d1_dates=['2026-10-22', '2026-10-23'])
        self.assertEqual(scan.known_date(an, self.zone('W1', '2026-01-05')), '2026-01-05')   # outside the window: as made


class DiagnosticsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.res = selftest.run_fixture()

    def test_first_block_priority(self):
        R = scan.Rule
        rules = [R('fail', '', '', 'near entry'), R('fail', '', '', 'fresh'), R('fail', '', '', 'curve'), R('pass', '', '', 'room')]
        self.assertEqual(scan.first_block(rules), 'curve')
        self.assertEqual(scan.first_block([R('fail', '', '', 'near entry'), R('fail', '', '', 'HTF align')]), 'HTF align')
        self.assertIsNone(scan.first_block([R('pass', '', '', 'curve'), R('warn', '', '', 'room')]))

    def test_summary_counts_and_closest(self):
        rows = [{'symbol': f'S{i}', 'rule': r, 'to_entry_pct': p, 'fails': [r]} for i, (r, p) in
                enumerate([('curve', 4.0), ('curve', -0.5), ('HTF align', 1.0), ('curve', 2.0), ('room', 0.2)])]
        b, closest = scan.blocked_summary(rows, pct=5, n=3)
        self.assertEqual(b['candidates'], 5)
        self.assertEqual([(r['rule'], r['count']) for r in b['reasons']], [('curve', 3), ('HTF align', 1), ('room', 1)])
        self.assertEqual(b['reasons'][0]['label'], 'high on curve')
        self.assertEqual([r['symbol'] for r in closest], ['S4', 'S1', 'S2'])

    def test_run_writes_blocked(self):
        b = self.res['blocked']
        self.assertEqual(sum(r['count'] for r in b['reasons']), b['candidates'])
        self.assertLessEqual(len(self.res['closest']), scan.CLOSEST_N)
        buys = {s['symbol'] for s in self.res['signals'] if s['kind'] == 'BUY'}
        for c in self.res['closest']:
            self.assertNotIn(c['symbol'], buys)
            self.assertIn(c['rule'], c['fails'])
            self.assertLessEqual(c['to_entry_pct'], b['within_pct'])
            self.assertEqual(c['label'], scan.BLOCK_LABEL[c['rule']])
        with tempfile.TemporaryDirectory() as d:
            with open(scan.write_outputs(self.res, d, fixture=True, history=False)) as f:
                pub = json.load(f)
        self.assertEqual(pub['blocked'], b)
        self.assertEqual(pub['closest'], self.res['closest'])
        self.assertIn(pub['session'], ('closed', 'intraday-dropped'))
        self.assertTrue(os.path.basename(d))

    def test_telegram_lists_reasons_when_no_buy(self):
        import notify
        res = dict(self.res, signals=[s for s in self.res['signals'] if s['kind'] != 'BUY'],
                   blocked={'candidates': 2, 'within_pct': 5, 'reasons': [{'rule': 'curve', 'label': 'high on curve', 'count': 2}]})
        txt = '\n'.join(notify.build_messages(res))
        self.assertIn('Why not more: price high in its range (2)', txt)


class MarketMapTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.res = selftest.run_fixture()

    def test_index_rows_carry_zone_fields(self):
        rows = self.res['index']
        self.assertTrue(rows)
        for r in rows:
            if 'dz' in r:
                tf, typ, score, touches = r['dz']
                self.assertIn(tf, ('W1', 'MN', '3M'))
                self.assertIn(typ, Z.ZONE_TYPE_TEXT)
                self.assertTrue(0 <= score <= 10 and touches >= 0)
                self.assertIn('dd', r)
            if 'sz' in r:
                self.assertEqual(len(r['sz']), 3)
            if 'br' in r:
                self.assertNotIn('sig', r)
                self.assertIn(r['br'], scan.BLOCK_LABEL)
        self.assertLess(len(json.dumps(rows[0])), 400)          # compact

    def test_strong_in_demand(self):
        row = {'s': 'X', 'n': 'X Co', 'sec': 'Energy', 'st': 'D', 'dz': ['W1', 'WOW', 9, 0], 'br': 'curve'}
        si = scan.strong_in_demand(row, {})
        self.assertEqual((si['symbol'], si['label'], si['score']), ('X', 'high on curve', 9))
        self.assertIsNone(scan.strong_in_demand(dict(row, st='M'), {}))
        self.assertIsNone(scan.strong_in_demand(dict(row, dz=['D1', 'WK', 3, 0]), {}))
        self.assertIsNone(scan.strong_in_demand(dict(row, sig='BUY'), {}))

    def test_telegram_zone_lists_in_the_collapsed_detail(self):
        import notify
        msgs = notify.build_messages(self.res)
        self.assertEqual(len(msgs), 1)
        self.assertIn('In demand (', msgs[0].split('<blockquote expandable>')[1])

    def test_universe_meta_and_uncovered(self):
        pub = scan.public_json(self.res)
        self.assertEqual([m['code'] for m in pub['index_meta']], ['SPX', 'NDX', 'DJI', 'TSX60', 'TSX'])
        self.assertEqual(pub['uncovered'], [{'symbol': 'SYI', 'name': 'Synthetic Iota (fixture, TSX only)', 'indexes': ['TSX']}])
        self.assertEqual(pub['coverage']['TSX'], {'covered': 2, 'total': 3})
        self.assertNotIn('filtered_liquidity', pub)
        sig = next(s for s in self.res['signals'] if s['symbol'] == 'SYNE')
        self.assertEqual((sig['home'], sig['currency'], sig['country']), ('TSX:SYE', 'USD', 'CA'))
        self.assertIn('symbol=NYSE:SYNE', sig['chart'])          # the US chart: the levels are its USD prices
        self.assertIn('symbol=TSX:SYE', sig['chart_home'])
        import notify
        card = notify.stock_card(sig)
        self.assertIn('<b>SYNE</b> (TSX:SYE)', card)                # levels are the US listing's (USD)


if __name__ == '__main__':
    unittest.main()


class ListTimeframeTest(unittest.TestCase):
    """Every symbol in the near / in / left lists says which timeframe's zone it is at (owner rule)."""

    def test_names_carry_the_timeframe(self):
        import notify
        rows = [{'s': 'BXP', 'tf': 'MN', 'pct': 1.45}, {'s': 'DAR', 'tf': 'W1', 'pct': 2.82}, {'s': 'CAVA', 'tf': '3M'}]
        self.assertEqual(notify.names(rows, 's', 2, lambda r: f"{r['pct']:.1f}%"), 'BXP MN 1.4%, DAR W1 2.8% +1')
        self.assertEqual(notify.names(rows[2:], 's', 3), 'CAVA 3M')
        self.assertEqual(notify.names([{'s': 'USDJPY', 'tf': 'H4'}], 's'), 'USDJPY 4H')
        self.assertEqual(notify.names([{'s': 'X'}], 's'), 'X')   # rows without a timeframe stay as they were

    def test_published_message_lists_show_timeframes(self):
        import notify
        res = notify.load_published(os.path.join(helpers.PKG, '..', '..', 'public', 'scanner'))
        quote_part = notify.build_messages(res)[0].split('<blockquote expandable>')[1]
        for line in quote_part.split('\n'):
            if line.startswith(('In demand (', '⏳ Close to demand (', 'Bounced off demand (')):
                first = line.split(': ', 1)[1].split(', ')[0]
                self.assertRegex(first, r'^\S+ (W1|MN|3M)\b', line)
