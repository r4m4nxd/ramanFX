"""fx_backtest tests: synthetic candles, no network."""
import json
import os
import sys
import tempfile
import unittest
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fx_backtest as B  # noqa: E402
import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import synth_fx  # noqa: E402
from zones import Bar  # noqa: E402

EURUSD = {'name': 'EUR_USD', 'type': 'CURRENCY', 'pipLocation': -4, 'displayPrecision': 5, 'sym': 'EURUSD', 'cls': 'major'}
SP = 0.0002                                      # 2-pip spread


def q(d, o, h, l, c, sp=SP):
    return B.quote_from_mid(Bar(d, o, h, l, c), sp)


def buy(**kw):
    o = dict(inst='EUR_USD', sym='EURUSD', cls='majors', wl=True, tf='H4', d=1, entry=1.1000, stop=1.0980, target=1.1060,
             distal=1.0983, signal='2024-01-01T00:00', expires='2024-01-06T00:00')
    o.update(kw)
    return B.Order(**o)


def sell(**kw):
    return buy(d=-1, entry=1.1000, stop=1.1020, target=1.0940, distal=1.1017, **kw)


class Fills(unittest.TestCase):
    def test_buy_fills_only_when_ask_reaches_entry(self):
        o = buy()
        B.step(o, q('2024-01-01T04:00', 1.1010, 1.1015, 1.0999, 1.1005))   # mid low 1.0999 -> ask low 1.1000
        self.assertEqual(o.status, 'open')
        o2 = buy()
        # bid low 1.0995 < entry but ask low 1.1001 > entry: a buy limit is NOT filled
        B.step(o2, B.Q('2024-01-01T04:00', 1.1010, 1.1012, 1.0995, 1.1005, 1.1016, 1.1018, 1.1001, 1.1011))
        self.assertEqual(o2.status, 'pending')

    def test_sell_fill_on_bid(self):
        o = sell()
        B.step(o, q('2024-01-01T04:00', 1.0990, 1.1001, 1.0985, 1.0990))   # bid high 1.1000
        self.assertEqual(o.status, 'open')

    def test_same_bar_stop_first(self):
        o = buy()
        # one candle trades through entry, stop and target: counted as a loss
        B.step(o, q('2024-01-01T04:00', 1.1010, 1.1080, 1.0950, 1.1050))
        self.assertEqual(o.status, 'stop')
        self.assertAlmostEqual(o.r, -1.0)

    def test_open_trade_stop_before_target(self):
        o = buy()
        B.step(o, q('2024-01-01T04:00', 1.1010, 1.1012, 1.0995, 1.1005))
        B.step(o, q('2024-01-01T08:00', 1.1005, 1.1090, 1.0970, 1.1050))
        self.assertEqual(o.status, 'stop')

    def test_fill_bar_does_not_credit_target(self):
        o = buy()
        B.step(o, q('2024-01-01T04:00', 1.1010, 1.1080, 1.0995, 1.1070))
        self.assertEqual(o.status, 'open')
        B.step(o, q('2024-01-01T08:00', 1.1070, 1.1075, 1.1040, 1.1050))
        self.assertEqual(o.status, 'target')
        self.assertAlmostEqual(o.r, 3.0)

    def test_gap_through_stop_exits_at_open(self):
        o = buy()
        B.step(o, q('2024-01-01T04:00', 1.1010, 1.1012, 1.0995, 1.1005))
        B.step(o, q('2024-01-01T08:00', 1.0960, 1.0965, 1.0950, 1.0955))
        self.assertEqual(o.status, 'stop')
        self.assertAlmostEqual(o.r, (1.0960 - SP / 2 - 1.1000) / 0.0020)

    def test_spread_cost(self):
        # target needs the BID at the target: mid touching it is not enough
        o = buy()
        B.step(o, q('2024-01-01T04:00', 1.1010, 1.1012, 1.0995, 1.1005))
        B.step(o, q('2024-01-01T08:00', 1.1005, 1.1060, 1.1004, 1.1050))   # bid high 1.1059
        self.assertEqual(o.status, 'open')
        # SELL stop triggers on the ASK: mid high 1.1019 < stop, ask high 1.1020
        s = sell()
        B.step(s, q('2024-01-01T04:00', 1.0990, 1.1001, 1.0985, 1.0990))
        B.step(s, q('2024-01-01T08:00', 1.0995, 1.1019, 1.0990, 1.1000))
        self.assertEqual(s.status, 'stop')
        self.assertAlmostEqual(s.r, -1.0)

    def test_expiry(self):
        o = buy()
        B.step(o, q('2024-01-05T20:00', 1.1050, 1.1055, 1.1040, 1.1045))
        self.assertEqual(o.status, 'pending')
        B.step(o, q('2024-01-08T00:00', 1.1010, 1.1012, 1.0990, 1.1005))   # would fill, but expired first
        self.assertEqual(o.status, 'expired')
        self.assertIsNone(o.r)

    def test_missed_target_before_fill(self):
        o = sell()
        B.step(o, q('2024-01-01T04:00', 1.0990, 1.0995, 1.0930, 1.0935))
        self.assertEqual(o.status, 'missed')
        self.assertIsNone(o.r)

    def test_gap_beyond_entry_fills_at_limit(self):
        s = sell()
        B.step(s, B.Q('2024-01-01T04:00', 1.1010, 1.1015, 1.1005, 1.1010, 1.1012, 1.1017, 1.1007, 1.1012))
        self.assertEqual(s.status, 'open')
        self.assertEqual(s.fill, '2024-01-01T04:00')


class Stats(unittest.TestCase):
    def test_drawdown_streak_ci(self):
        rs = [2, -1, -1, -1, 3, -1, 2]
        self.assertEqual(B.max_drawdown(rs), 3)
        self.assertEqual(B.longest_losing(rs), 3)
        self.assertEqual(B.bootstrap_ci(rs), B.bootstrap_ci(rs))
        lo, hi = B.bootstrap_ci(rs)
        self.assertLess(lo, sum(rs) / len(rs))
        self.assertGreater(hi, sum(rs) / len(rs))
        self.assertIsNone(B.bootstrap_ci([1, 2]))

    def test_stats_and_split(self):
        os_ = []
        for k, r in enumerate([3.0, -1.0, -1.0, 3.0]):
            o = buy(signal=f'2024-0{k + 1}-01T00:00')
            o.status, o.r, o.exit_t = ('target' if r > 0 else 'stop'), r, f'2024-0{k + 1}-02T00:00'
            os_.append(o)
        os_.append(buy(status='expired'))
        s = B.stats(os_)
        self.assertEqual((s['signals'], s['trades'], s['win_rate'], s['expectancy_r'], s['profit_factor']), (5, 4, 0.5, 1.0, 3.0))
        self.assertEqual(s['fill_rate'], 0.8)
        sm = B.summarise(os_, '2024-03-01T00:00')
        self.assertEqual(sm['is']['trades'], 2)
        self.assertEqual(sm['oos']['trades'], 2)
        self.assertIn('majors', sm['by']['class'])

    def test_classes(self):
        self.assertEqual(B.bt_class({'name': 'EUR_USD'}), 'majors')
        self.assertEqual(B.bt_class({'name': 'EUR_JPY'}), 'minors')
        self.assertEqual(B.bt_class({'name': 'AUD_NZD'}), 'crosses')
        self.assertEqual(B.bt_class({'name': 'USD_ZAR'}), 'exotics')
        self.assertEqual(B.bt_class({'name': 'XAU_AUD', 'type': 'METAL'}), 'metals')
        self.assertEqual(B.bt_class({'name': 'NAS100_USD', 'type': 'CFD'}), 'indices')
        self.assertEqual(B.bt_class({'name': 'WTICO_USD', 'type': 'CFD'}), 'commodities')

    def test_bar_end(self):
        self.assertEqual(B.bar_end('2024-01-05T20:00', 'H4'), '2024-01-06T00:00')
        self.assertEqual(B.bar_end('2024-12-01T00:00', 'MN'), '2025-01-01T00:00')
        self.assertEqual(B.bar_end('2024-01-06T00:00', 'W1'), '2024-01-13T00:00')


def synth(n=2400, seed=15):
    h4 = synth_fx.h4_walk(seed, n=n)
    return [B.quote_from_mid(b, SP) for b in h4], {tf: synth_fx.aggregate(h4, tf) for tf in ('D1', 'W1', 'MN')}


class NoLookAhead(unittest.TestCase):
    def test_signal_function_sees_only_closed_bars(self):
        h4, htf = synth()
        calls = []

        def spy(inst, bars, spread, variants):
            calls.append({tf: (bars[tf][-1].d if bars[tf] else None) for tf in bars})
            now = B.bar_end(bars['H4'][-1].d, 'H4')
            for tf in ('D1', 'W1', 'MN'):
                for b in bars[tf][-3:]:
                    self.assertLessEqual(B.bar_end(b.d, tf), now, (tf, b.d, now))
            # the next HTF bar (if any) must not be closed yet, i.e. nothing closed is withheld either
            for tf in ('D1', 'W1', 'MN'):
                full = htf[tf]
                k = len([b for b in full if B.bar_end(b.d, tf) <= now])
                self.assertEqual(bars[tf][-1].d if bars[tf] else None, full[k - 1].d if k else None)
            return {v: [] for v in variants}
        start = h4[2000].d
        B.run_instrument(EURUSD, h4, htf, start, variants={'full': ()}, signal_fn=spy, warmup=300)
        self.assertEqual(len(calls), len(h4) - 2000)

    def test_future_bars_do_not_change_inputs(self):
        h4, htf = synth()
        seen = {}

        def rec(tag):
            def f(inst, bars, spread, variants):
                seen.setdefault(tag, []).append((bars['H4'][-1].d, [b.c for b in bars['H4'][-5:]], spread,
                                                 [b.c for b in bars['D1'][-3:]]))
                return {v: [] for v in variants}
            return f
        start, cut = h4[2000].d, 2200
        B.run_instrument(EURUSD, h4, htf, start, variants={'full': ()}, signal_fn=rec('a'), warmup=300)
        h4b = h4[:cut] + [B.quote_from_mid(Bar(x.d, 9, 9, 9, 9), 0.01) for x in h4[cut:]]
        htfb = {tf: [b if B.bar_end(b.d, tf) <= B.bar_end(h4[cut - 1].d, 'H4') else Bar(b.d, 9, 9, 9, 9) for b in bs]
                for tf, bs in htf.items()}
        B.run_instrument(EURUSD, h4b, htfb, start, variants={'full': ()}, signal_fn=rec('b'), warmup=300)
        n = cut - 2000
        self.assertEqual(seen['a'][:n], seen['b'][:n])

    def test_order_starts_after_signal_bar(self):
        h4, htf = synth()
        j = 2100
        sig = {'kind': 'BUY', 'tf': 'H4', 'side': 'demand', 'base_start': 'x', 'entry': h4[j].bc + 10,
               'stop': h4[j].bc - 0.01, 'target': h4[j].bc + 20, 'distal': h4[j].bc - 0.009, 'zone_type': 'ARR', 'pattern': 'DBR', 'score': 8}

        def once(inst, bars, spread, variants):
            return {'full': [sig] if bars['H4'][-1].d == h4[j].d else []}
        res = B.run_instrument(EURUSD, h4, htf, h4[2000].d, variants={'full': ()}, signal_fn=once, warmup=300)
        (v, o), = res['orders']
        self.assertEqual(o.signal, h4[j].d)
        self.assertEqual(o.fill, h4[j + 1].d)          # entry above the market: filled on the NEXT bar, not the signal bar

    def test_live_signal_function_and_ablation_switch(self):
        h4, htf = synth(n=2000)
        orig = F.zone_rules
        res = B.run_instrument(EURUSD, h4, htf, h4[1900].d, warmup=300, step_n=10)
        self.assertIs(F.zone_rules, orig)              # the rule switch is undone
        self.assertEqual(res['evals'], 10)
        an = F.analyse(EURUSD, {'H4': [x.mid for x in h4], **htf}, SP)
        self.assertEqual(B.signals_with(an), F.signals(an))
        loose = B.signals_with(an, ('location', 'spread', 'near entry', 'fresh', 'room', 'curve', 'direction'))
        self.assertGreaterEqual(sum(s['kind'] in ('BUY', 'SELL') for s in loose),
                                sum(s['kind'] in ('BUY', 'SELL') for s in F.signals(an)))


class History(unittest.TestCase):
    def test_paging_and_cache(self):
        def cnd(i):
            t = f'2024-01-{1 + i // 6:02d}T{(i % 6) * 4:02d}:00:00.000000000Z'
            return {'time': t, 'complete': True, 'bid': {k: '1.1' for k in 'ohlc'}, 'ask': {k: '1.1002' for k in 'ohlc'}}
        pages = []

        def get(url):
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
            pages.append(qs)
            self.assertEqual(qs['price'], ['BA'])
            k = len(pages) - 1
            n = C.COLD_COUNT if k == 0 else 3
            return json.dumps({'candles': [cnd(i) for i in range(k * (C.COLD_COUNT - 1), k * (C.COLD_COUNT - 1) + n)][:n]}).encode()
        with tempfile.TemporaryDirectory() as td:
            old = B.BT_CACHE
            B.BT_CACHE = td
            try:
                C_COUNT = C.COLD_COUNT
                C.COLD_COUNT = 20
                try:
                    rows = B.fetch_history('EUR_USD', 'H4', get=get)
                finally:
                    C.COLD_COUNT = C_COUNT
                self.assertEqual(len(pages), 2)
                self.assertEqual(len(rows), 20 + 2)     # second page repeats the last candle of the first
                self.assertEqual(len({r[0] for r in rows}), len(rows))
                h4, _ = B.load_cached('EUR_USD')
                self.assertAlmostEqual(h4[0].spread, 0.0002)
                again = B.fetch_history('EUR_USD', 'H4', get=lambda u: self.fail('cached'))
                self.assertEqual(again, rows)
            finally:
                B.BT_CACHE = old


if __name__ == '__main__':
    unittest.main()
