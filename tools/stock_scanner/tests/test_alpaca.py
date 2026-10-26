"""Alpaca Market Data as the primary daily-bars source, without a network: a fake /v2/stocks/bars server that
paginates, batches, leaves unknown symbols out, refuses SIP (403) and rate-limits (429). Plus the scan's
no-data guard, the SEC_UA skip and the (switched-off) TSX feed adapter."""
import datetime as dt
import json
import os
import shutil
import tempfile
import time
import urllib.parse
from unittest import mock

import helpers  # noqa: F401 - sys.path
import data as DATA
import synth
from test_net import NetBase, http_error


def q(url):
    return {k: v[0] for k, v in urllib.parse.parse_qs(urllib.parse.urlsplit(url).query).items()}


def age_cache(sym, fetched):
    p = DATA._cache_path(sym)
    with open(p) as f:
        js = json.load(f)
    js['fetched'] = fetched
    with open(p, 'w') as f:
        json.dump(js, f)


class FakeAlpaca:
    """/v2/stocks/bars over `series` {alpaca symbol: bars}: filters by start, sorts by symbol then date, pages by
    `limit` across symbols. `sip_403`: feed=sip answers 403. `fail_first`: the first N calls answer 429."""

    def __init__(self, series, sip_403=False, fail_first=0, retry_after='1', bad_symbol=None):
        self.series, self.sip_403, self.fail_first, self.retry_after, self.bad = series, sip_403, fail_first, retry_after, bad_symbol
        self.n = 0
        self.urls = []

    def __call__(self, url):
        self.n += 1
        self.urls.append(url)
        p = q(url)
        if self.n <= self.fail_first:
            raise http_error(url, 429, {'Retry-After': self.retry_after})
        if self.sip_403 and p['feed'] == 'sip':
            raise http_error(url, 403)
        syms = p['symbols'].split(',')
        if self.bad and self.bad in syms:
            raise http_error(url, 400)
        rows = [(s, b) for s in sorted(syms) for b in self.series.get(s, []) if b.d >= p['start'][:10]]
        off = int(p.get('page_token') or 0)
        lim = int(p['limit'])
        page = rows[off:off + lim]
        out = {}
        for s, b in page:
            out.setdefault(s, []).append({'t': f'{b.d}T04:00:00Z', 'o': b.o, 'h': b.h, 'l': b.l, 'c': b.c, 'v': 1000, 'n': 10, 'vw': b.c})
        nxt = str(off + lim) if off + lim < len(rows) else None
        return json.dumps({'bars': out, 'next_page_token': nxt}).encode()


class AlpacaBase(NetBase):
    def setUp(self):
        super().setUp()
        for p in (mock.patch.dict(DATA.HOST_PAUSE, clear=True), mock.patch.object(DATA, 'ALPACA_LIMIT', 1000)):
            p.start()
            self.addCleanup(p.stop)
        os.environ['ALPACA_KEY_ID'] = 'kid'
        os.environ['ALPACA_SECRET_KEY'] = 'sec'
        self.series = {s: synth.ticker(i) for i, s in enumerate(['AAA', 'BBB', 'BRK.B', 'SPY'])}

    def serve(self, fake, assets=None):
        return self.net({'data.alpaca.markets': fake,
                         'paper-api.alpaca.markets': lambda u: json.dumps(assets or [{'symbol': 'AAA', 'exchange': 'NASDAQ'}]).encode()})


class TestAlpacaBars(AlpacaBase):
    def test_pagination_headers_and_params(self):
        fake = FakeAlpaca(self.series)
        net = self.serve(fake)
        got = DATA.alpaca_bars(['AAA', 'BRK.B'], '2016-01-01', '2026-10-26T00:00:00Z')
        self.assertEqual(len(got['AAA']), len(self.series['AAA']))
        self.assertEqual(len(got['BRK.B']), len(self.series['BRK.B']))
        self.assertEqual(got['AAA'][-1].d, self.series['AAA'][-1].d)
        self.assertGreater(fake.n, 4)                                   # ~5000 bars / 1000 per page
        p = q(fake.urls[0])
        self.assertEqual((p['timeframe'], p['adjustment'], p['feed'], p['symbols']), ('1Day', 'all', 'sip', 'AAA,BRK.B'))
        self.assertIn('page_token', q(fake.urls[1]))
        r = net.reqs[0]
        self.assertEqual(r.get_header('Apca-api-key-id'), 'kid')
        self.assertEqual(r.get_header('Apca-api-secret-key'), 'sec')
        self.assertNotIn('kid', r.full_url)

    def test_symbol_mapping(self):
        self.assertEqual(DATA.alpaca_symbol('BRK.B'), 'BRK.B')
        self.assertEqual(DATA.alpaca_symbol('brk-b'), 'BRK.B')
        fake = FakeAlpaca(self.series)
        self.serve(fake)
        got = DATA.alpaca_bars(['BRK-B'], '2026-01-01', '2026-10-26T00:00:00Z')
        self.assertIn('BRK-B', got)                                     # keyed as asked
        self.assertEqual(q(fake.urls[0])['symbols'], 'BRK.B')

    def test_sip_403_falls_back_to_iex_and_is_remembered(self):
        fake = FakeAlpaca(self.series, sip_403=True)
        self.serve(fake)
        got = DATA.alpaca_bars(['AAA'], '2026-01-01', '2026-10-26T00:00:00Z')
        self.assertTrue(got['AAA'])
        self.assertEqual(DATA.alpaca_feed(), 'iex')
        n = fake.n
        DATA.alpaca_bars(['BBB'], '2026-01-01', '2026-10-26T00:00:00Z')
        self.assertEqual(fake.n, n + 1)                                 # straight to iex
        self.assertEqual(q(fake.urls[-1])['feed'], 'iex')
        DATA.reset_alpaca_state()                                       # next run: read back from the cache file
        self.assertEqual(DATA.alpaca_feed(), 'iex')
        self.assertEqual(DATA.breaker_state(), {})

    def test_429_retry_after_is_waited_for(self):
        fake = FakeAlpaca(self.series, fail_first=2, retry_after='30')
        self.serve(fake)
        slept = []
        with mock.patch.object(DATA.time, 'sleep', side_effect=lambda s: slept.append(s)):
            got = DATA.alpaca_bars(['AAA'], '2026-09-01', '2026-10-26T00:00:00Z')
        self.assertTrue(got['AAA'])
        self.assertEqual(slept.count(30), 2)                            # up to ALPACA_MAX_WAIT, not the generic 5 s

    def test_429_too_long_fails(self):
        fake = FakeAlpaca(self.series, fail_first=99, retry_after='600')
        self.serve(fake)
        with self.assertRaises(Exception):
            DATA.alpaca_bars(['AAA'], '2026-09-01', '2026-10-26T00:00:00Z')
        self.assertEqual(fake.n, 1)

    def test_400_splits_the_batch(self):
        fake = FakeAlpaca(self.series, bad_symbol='BAD^')
        self.serve(fake)
        got = DATA.alpaca_bars(['AAA', 'BBB', 'BAD^', 'SPY'], '2026-09-01', '2026-10-26T00:00:00Z')
        self.assertEqual(set(got), {'AAA', 'BBB', 'SPY'})

    def test_401_trips_the_breaker(self):
        self.net({'data.alpaca.markets': lambda u: (_ for _ in ()).throw(http_error(u, 401)),
                  'paper-api': lambda u: b'[]'})
        miss = DATA.alpaca_prefetch(['AAA', 'BBB'])
        self.assertEqual(set(miss), {'AAA', 'BBB'})
        self.assertTrue(DATA.host_open(DATA.ALPACA_BARS))


class TestAlpacaPrefetch(AlpacaBase):
    def test_cold_batches_and_missing_symbols_fall_back(self):
        """250 cold symbols in batches of 100 -> 3 batches; unknown ones go on to Yahoo."""
        syms = [f'S{i:03d}' for i in range(250)]
        base = synth.ticker(7)[-200:]
        series = {s: base for s in syms[:240]}                     # the last 10 are unknown to Alpaca
        fake = FakeAlpaca(series)
        y = synth.ticker(8)[-200:]
        yahoo = json.dumps({'chart': {'result': [{'timestamp': [int(dt.datetime.fromisoformat(b.d).replace(tzinfo=dt.timezone.utc).timestamp()) for b in y],
                                                  'meta': {'exchangeName': 'NYQ', 'gmtoffset': 0},
                                                  'indicators': {'quote': [{'open': [b.o for b in y], 'high': [b.h for b in y], 'low': [b.l for b in y],
                                                                            'close': [b.c for b in y], 'volume': [1] * len(y)}]}}]}}).encode()
        net = self.net({'data.alpaca.markets': fake, 'paper-api': lambda u: b'[]', 'yahoo': lambda u: yahoo})
        with mock.patch.object(DATA, 'ALPACA_LIMIT', 10000), mock.patch.object(DATA, 'ALPACA_BATCH_COLD', 100):
            out = DATA.fetch_many(syms, workers=3)
        errs = out.pop('__errors__')
        self.assertEqual(errs, {})
        src = {s: m['source'] for s, (_, m) in out.items()}
        self.assertEqual({src[s] for s in syms[:240]}, {'alpaca'})
        self.assertEqual({src[s] for s in syms[240:]}, {'yahoo'})
        first_pages = [u for u in fake.urls if 'page_token' not in u]
        self.assertEqual(len(first_pages), 3)
        self.assertTrue(all(len(q(u)['symbols'].split(',')) <= 100 for u in fake.urls))
        self.assertEqual(net.calls['yahoo'], 10)
        self.assertEqual(len(out['S000'][0]), len(base))

    def test_incremental_update(self):
        full = self.series['AAA']
        DATA.save_cached('AAA', full[:-5], {'source': 'alpaca', 'exchange': 'NASDAQ', 'history_days': DATA.HISTORY_DAYS})
        age_cache('AAA', time.time() - 86400)
        fake = FakeAlpaca(self.series)
        self.serve(fake)
        miss = DATA.alpaca_prefetch(['AAA'])
        self.assertEqual(miss, {})
        self.assertEqual(fake.n, 1)
        start = q(fake.urls[0])['start'][:10]
        self.assertEqual(start, (dt.date.fromisoformat(full[-6].d) - dt.timedelta(days=DATA.UPDATE_OVERLAP_DAYS)).isoformat())
        bars, meta = DATA.load_cached('AAA')[:2]
        self.assertEqual(bars[-1].d, full[-1].d)
        self.assertEqual(len(bars), len(full))
        self.assertEqual((meta['source'], meta['exchange']), ('alpaca', 'NASDAQ'))

    def test_short_cache_is_extended_once(self):
        """A cache from the old 10-year fetch (no history_days) gets one full fetch from the 20-year start (MN zones);
        after that only incremental updates, even though the source has less history."""
        full = self.series['AAA']
        DATA.save_cached('AAA', full[:-5], {'source': 'alpaca', 'exchange': 'NASDAQ'})
        age_cache('AAA', time.time() - 86400)
        self.assertTrue(DATA.needs_extend(full[:-5], {}))
        fake = FakeAlpaca(self.series)
        self.serve(fake)
        self.assertEqual(DATA.alpaca_prefetch(['AAA']), {})
        start = q(fake.urls[0])['start'][:10]
        self.assertEqual(start, (dt.date.today() - dt.timedelta(days=DATA.HISTORY_DAYS)).isoformat())
        self.assertEqual(DATA.load_cached('AAA')[1]['history_days'], DATA.HISTORY_DAYS)
        age_cache('AAA', time.time() - 86400)
        n = fake.n
        self.assertEqual(DATA.alpaca_prefetch(['AAA']), {})
        start2 = q(fake.urls[n])['start'][:10]
        self.assertGreater(start2, (dt.date.today() - dt.timedelta(days=60)).isoformat())   # an update, not a full fetch

    def test_twenty_years_asked(self):
        self.assertGreaterEqual(DATA.HISTORY_DAYS, 20 * 365)
        long = [DATA.Bar((dt.date(2000, 1, 3) + dt.timedelta(days=i)).isoformat(), 1, 1, 1, 1) for i in range(0, 9500, 1)]
        kept = DATA.keep_history(long)
        self.assertGreaterEqual((dt.date.fromisoformat(kept[-1].d) - dt.date.fromisoformat(kept[0].d)).days, DATA.HISTORY_DAYS - 1)
        self.assertLess(len(kept), len(long))

    def test_readjusted_history_is_fetched_again(self):
        full = self.series['AAA']
        old = [DATA.Bar(b.d, b.o * 0.97, b.h * 0.97, b.l * 0.97, b.c * 0.97, b.v) for b in full[:-5]]
        DATA.save_cached('AAA', old, {'source': 'alpaca'})
        age_cache('AAA', 0)
        fake = FakeAlpaca(self.series)
        self.serve(fake)
        self.assertEqual(DATA.alpaca_prefetch(['AAA']), {})
        self.assertAlmostEqual(DATA.load_cached('AAA')[0][0].c, full[0].c, places=3)    # the full, re-adjusted history

    def test_fresh_cache_and_no_keys_make_no_request(self):
        DATA.save_cached('AAA', self.series['AAA'], {'source': 'alpaca'})
        fake = FakeAlpaca(self.series)
        net = self.serve(fake)
        self.assertEqual(DATA.alpaca_prefetch(['AAA']), {})
        os.environ.pop('ALPACA_KEY_ID')
        self.assertEqual(DATA.alpaca_prefetch(['BBB']), {'BBB': 'alpaca: no keys'})
        self.assertEqual(net.calls, {})

    def test_budget_spent_serves_nothing(self):
        fake = FakeAlpaca(self.series)
        self.serve(fake)
        DATA.set_budget(1e-9)
        time.sleep(0.01)
        miss = DATA.alpaca_prefetch(['AAA'])
        self.assertIn('time budget', miss['AAA'])
        self.assertEqual(fake.n, 0)


class TestNoDataGuard(NetBase):
    def test_no_data_writes_nothing_and_fails(self):
        import notify
        import scan
        out = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, out, True)
        sent = []
        with mock.patch.object(notify, 'send', side_effect=lambda m: sent.append(m)), \
                mock.patch.object(scan, 'load_holdings', return_value=[]):
            rc = scan.main(['--tickers', 'NOPE1,NOPE2', '--offline', '--out', out, '--no-sec'])
            rc2 = scan.main(['--tickers', 'NOPE1,NOPE2', '--offline', '--out', out, '--no-sec'])
        self.assertEqual((rc, rc2), (2, 2))
        self.assertEqual(os.listdir(out), [])
        self.assertEqual(len(sent), 1)                                  # one notice per day, no signals
        self.assertIn('scan failed: no price data', sent[0][0])
        self.assertIn('0/2 tickers with data', sent[0][0])

    def test_no_history_file_without_a_date(self):
        import scan
        out = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, out, True)
        res = {'date': '', 'generated_at': '', 'universe': 0, 'scanned': 0, 'errors': [], 'notes': [], 'signals': [],
               'exits': [], 'bars': {}, 'details': {}, 'index': [], 'regime': []}
        scan.write_outputs(res, out)
        self.assertFalse(os.path.exists(os.path.join(out, 'history')))


class TestSecAndTsxFeed(NetBase):
    def test_company_tickers_skipped_without_sec_ua(self):
        import universe as U
        fake = self.net({'sec.gov': lambda u: b'{}'})
        rows = [{'symbol': 'AAA', 'cik': ''}]
        self.assertEqual(U.fill_ciks(rows), 0)
        self.assertEqual(fake.calls, {})
        os.environ['SEC_UA'] = 'proj contact'
        self.net({'www.sec.gov': lambda u: json.dumps({'0': {'ticker': 'AAA', 'cik_str': 5}}).encode()})
        self.assertEqual(U.fill_ciks(rows), 1)

    def test_eodhd_adapter_off_by_default_and_parses(self):
        self.assertEqual(DATA.tsx_feed(), '')
        self.assertEqual(DATA.feeds_on(), ())
        with mock.patch.dict(os.environ, {'SCANNER_TSX_FEED': 'eodhd'}):
            self.assertEqual(DATA.tsx_feed(), '')                       # no key: still off
        with mock.patch.dict(os.environ, {'SCANNER_TSX_FEED': 'eodhd', 'EODHD_API_KEY': 'k'}):
            self.assertEqual(DATA.feeds_on(), ('tsx',))
            self.assertIn('/eod/RY.TO?', DATA.eodhd_url('RY.TO', '2020-01-01'))
        raw = json.dumps([{'date': '2026-10-22', 'open': 10, 'high': 12, 'low': 9, 'close': 11, 'adjusted_close': 5.5, 'volume': 7},
                          {'date': 'bad'}]).encode()
        bars, meta = DATA.parse_eodhd(raw)
        self.assertEqual(len(bars), 1)
        self.assertEqual((bars[0].o, bars[0].h, bars[0].c), (5.0, 6.0, 5.5))
        self.assertEqual(meta['currency'], 'CAD')
        with self.assertRaises(RuntimeError):
            DATA.fetch_tsx('ZZZ.TO')                                    # feed off, no cache


if __name__ == '__main__':
    import unittest
    unittest.main()
