"""Network robustness without a network: urlopen is mocked to emulate slow hosts, 429 storms, 401 crumbs and HTML
rate-limit pages. Checks that the time budget and the per-host circuit breakers bound the runtime of a cold run."""
import io
import os
import shutil
import tempfile
import threading
import time
import unittest
import urllib.error
from unittest import mock

import helpers  # noqa: F401 - sys.path
import data as DATA
import fundamentals as F
import synth


class _Resp(io.BytesIO):
    def __enter__(self): return self
    def __exit__(self, *a): self.close()


def http_error(url, code, headers=None):
    return urllib.error.HTTPError(url, code, 'err', headers or {}, io.BytesIO(b'{}'))


class FakeNet:
    """urlopen stand-in: `rules` maps a host substring to fn(url) -> bytes or raises. Counts calls per host."""

    def __init__(self, rules, delay=0.0):
        self.rules, self.delay, self.calls, self.lock = rules, delay, {}, threading.Lock()
        self.reqs = []

    def __call__(self, req, timeout=None):
        url = req.full_url
        for key, fn in self.rules.items():
            if key in url:
                with self.lock:
                    self.calls[key] = self.calls.get(key, 0) + 1
                    self.reqs.append(req)
                if self.delay:
                    time.sleep(self.delay)
                return _Resp(fn(url))
        raise AssertionError(f'unexpected url {url}')


def raise_(e):
    raise e


class NetBase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.patches = [mock.patch.object(DATA, 'CACHE', self.tmp), mock.patch.object(F, 'CACHE', self.tmp),
                        mock.patch.object(DATA, 'PAUSE', 0.0), mock.patch.object(DATA, 'BACKOFF', 0.05),
                        mock.patch.object(DATA, 'BREAKER_N', 5), mock.patch.object(DATA, 'BREAKER_COOLDOWN', 300.0),
                        mock.patch.object(F, 'CACHE', self.tmp), mock.patch.dict(os.environ)]
        for p in self.patches:
            p.start()
        for k in ('ALPACA_KEY_ID', 'ALPACA_SECRET_KEY', 'SEC_UA'):   # no real keys / contact reach a test
            os.environ.pop(k, None)
        DATA.reset_net_state()

    def tearDown(self):
        for p in reversed(self.patches):
            p.stop()
        DATA.reset_net_state()
        shutil.rmtree(self.tmp, ignore_errors=True)

    def net(self, rules, delay=0.0):
        fake = FakeNet(rules, delay)
        p = mock.patch('urllib.request.urlopen', fake)
        p.start()
        self.addCleanup(p.stop)
        return fake


HTML_LIMIT = b'<html><body>Exceeded the daily hits limit</body></html>'


class TestBreaker(NetBase):
    def test_yahoo_429_and_stooq_html_trip_both_breakers(self):
        """Cold cache, Yahoo answers 429 to everything, Stooq serves its HTML limit page: after a handful of calls
        both hosts are skipped and 200 tickers finish in about a second instead of hours."""
        fake = self.net({'yahoo': lambda u: raise_(http_error(u, 429, {'Retry-After': '60'})),
                         'stooq': lambda u: HTML_LIMIT})
        syms = [f'T{i:03d}' for i in range(200)]
        t = time.time()
        out = DATA.fetch_many(syms, workers=6)
        el = time.time() - t
        errs = out.pop('__errors__')
        self.assertEqual(len(errs), 200)
        self.assertFalse(out)
        self.assertLess(el, 5.0)
        # each call to Yahoo makes 2 attempts; the breaker opens after 5 failed calls, a few more were in flight
        self.assertLessEqual(fake.calls['yahoo'], 2 * (5 + 6))
        self.assertLessEqual(fake.calls['stooq'], 5 + 6)
        self.assertTrue(DATA.host_open('query1.finance.yahoo.com'))
        self.assertTrue(DATA.host_open('stooq.com'))
        self.assertIn('circuit breaker open', errs['T199'])

    def test_long_retry_after_fails_at_once(self):
        fake = self.net({'yahoo': lambda u: raise_(http_error(u, 429, {'Retry-After': '120'}))})
        slept = []
        with mock.patch.object(DATA.time, 'sleep', side_effect=lambda s: slept.append(s)):
            with self.assertRaises(urllib.error.HTTPError):
                DATA.http_get(DATA.yahoo_url('AAA'), retries=3)
        self.assertEqual(fake.calls['yahoo'], 1)
        self.assertFalse([s for s in slept if s > 1])
        self.assertEqual(DATA.breaker_state(), {'query1.finance.yahoo.com': 1})

    def test_short_retry_after_is_honoured(self):
        fake = self.net({'yahoo': lambda u: raise_(http_error(u, 429, {'Retry-After': '2'}))})
        slept = []
        with mock.patch.object(DATA.time, 'sleep', side_effect=lambda s: slept.append(s)):
            with self.assertRaises(urllib.error.HTTPError):
                DATA.http_get(DATA.yahoo_url('AAA'))
        self.assertEqual(fake.calls['yahoo'], 2)
        self.assertIn(2, slept)

    def test_401_not_retried_and_counted(self):
        fake = self.net({'yahoo': lambda u: raise_(http_error(u, 401))})
        with self.assertRaises(urllib.error.HTTPError):
            DATA.http_get(DATA.yahoo_url('AAA'), retries=3)
        self.assertEqual(fake.calls['yahoo'], 1)
        self.assertEqual(DATA.breaker_state(), {'query1.finance.yahoo.com': 1})

    def test_404_resets_and_success_closes(self):
        n = [0]

        def yahoo(u):
            n[0] += 1
            if n[0] <= 3:
                raise http_error(u, 503)
            raise http_error(u, 404)
        self.net({'yahoo': yahoo})
        with self.assertRaises(urllib.error.HTTPError):
            DATA.http_get(DATA.yahoo_url('AAA'))           # 503, 503 -> one failure
        self.assertEqual(DATA.breaker_state(), {'query1.finance.yahoo.com': 1})
        with self.assertRaises(urllib.error.HTTPError):
            DATA.http_get(DATA.yahoo_url('AAA'))           # 503, then 404: the host answers -> reset
        self.assertEqual(DATA.breaker_state(), {})

    def test_cooldown_lets_a_probe_through(self):
        self.net({'stooq': lambda u: HTML_LIMIT})
        for _ in range(5):
            with self.assertRaises(DATA.BadBody):
                DATA.http_get('https://stooq.com/q/d/l/?s=a.us&i=d', expect=DATA.looks_stooq)
        with self.assertRaises(DATA.HostDown):
            DATA.http_get('https://stooq.com/q/d/l/?s=a.us&i=d', expect=DATA.looks_stooq)
        with mock.patch.object(DATA, 'BREAKER_COOLDOWN', 0.0):
            DATA._host_open_until['stooq.com'] = 0
            with self.assertRaises(DATA.BadBody):      # the probe goes out (and re-opens the breaker)
                DATA.http_get('https://stooq.com/q/d/l/?s=a.us&i=d', expect=DATA.looks_stooq)

    def test_stooq_no_data_is_not_a_bad_body(self):
        self.net({'stooq': lambda u: b'No data'})
        self.assertEqual(DATA.http_get('https://stooq.com/q/d/l/?s=zz.us&i=d', expect=DATA.looks_stooq), b'No data')
        self.assertEqual(DATA.breaker_state(), {})

    def test_hanging_yahoo_falls_back_to_stooq_quickly(self):
        """Yahoo times out on every call: after the breaker opens, Stooq serves everything."""
        bars = synth.ticker(1)
        csv = 'Date,Open,High,Low,Close,Volume\n' + '\n'.join(f'{b.d},{b.o},{b.h},{b.l},{b.c},1000' for b in bars)

        def hang(u):
            time.sleep(0.05)
            raise TimeoutError('timed out')
        fake = self.net({'yahoo': hang, 'stooq': lambda u: csv.encode()})
        out = DATA.fetch_many([f'T{i}' for i in range(60)], workers=6)
        errs = out.pop('__errors__')
        self.assertEqual(errs, {})
        self.assertEqual({m['source'] for _, m in out.values()}, {'stooq'})
        self.assertLessEqual(fake.calls['yahoo'], 2 * (5 + 6))


class TestBudget(NetBase):
    def test_budget_stops_fetching_and_uses_stale_cache(self):
        """Every request takes 0.2 s; budget 1 s: fetching stops, cached tickers come back stale, the rest error."""
        bars = synth.ticker(2)
        for s in ('C0', 'C1', 'C2'):
            DATA.save_cached(s, bars, {'source': 'stooq', 'exchange': 'NYQ'})
            p = DATA._cache_path(s)
            os.utime(p)
        # make the cache stale (older than 12 h)
        import json
        for s in ('C0', 'C1', 'C2'):
            p = DATA._cache_path(s)
            with open(p) as fh:
                js = json.load(fh)
            js['fetched'] = time.time() - 86400
            with open(p, 'w') as fh:
                json.dump(js, fh)
        self.net({'yahoo': lambda u: raise_(http_error(u, 404)), 'stooq': lambda u: b'No data'}, delay=0.2)
        DATA.set_budget(1 / 60)
        syms = [f'T{i:03d}' for i in range(300)] + ['C0', 'C1', 'C2']
        t = time.time()
        out = DATA.fetch_many(syms, workers=4)
        el = time.time() - t
        errs = out.pop('__errors__')
        self.assertLess(el, 3.0)
        self.assertTrue(any('time budget' in e for e in errs.values()))
        for s in ('C0', 'C1', 'C2'):
            self.assertIn(s, out)
            self.assertTrue(out[s][1].get('stale'))

    def test_no_request_after_budget(self):
        fake = self.net({'yahoo': lambda u: b'{}'})
        DATA.set_budget(1e-9)
        time.sleep(0.01)
        with self.assertRaises(DATA.BudgetExceeded):
            DATA.http_get(DATA.yahoo_url('AAA'))
        self.assertEqual(fake.calls, {})
        self.assertIsNone(DATA.fetch_earnings('AAA'))


class TestEarningsAndSec(NetBase):
    def test_earnings_401_trips_at_once(self):
        fake = self.net({'quoteSummary': lambda u: raise_(http_error(u, 401))})
        self.assertIsNone(DATA.fetch_earnings('AAA'))
        self.assertIsNone(DATA.fetch_earnings('BBB'))
        self.assertIsNone(DATA.fetch_earnings('CCC'))
        self.assertEqual(fake.calls['quoteSummary'], 1)

    def test_sec_403_stops_refresh(self):
        fake = self.net({'data.sec.gov': lambda u: raise_(http_error(u, 403))})
        n = F.refresh_bases([str(i) for i in range(100)], workers=4)
        self.assertEqual(n, 0)
        self.assertLessEqual(fake.calls['data.sec.gov'], 5 + 4)

    def test_sec_budget(self):
        self.net({'data.sec.gov': lambda u: b'{"facts": {}}'}, delay=0.1)
        t = time.time()
        F.refresh_bases([str(i) for i in range(200)], workers=4, budget_s=0.5)
        self.assertLess(time.time() - t, 2.0)

    def test_refresh_plan_cold_cap(self):
        ciks = [str(i) for i in range(500)]
        self.assertEqual(len(F.refresh_plan(ciks, [], per_run=600)), 500)
        plan = F.refresh_plan(ciks, ['7', '8'], per_run=600, cold_cap=100)
        self.assertEqual(len(plan), 102)          # urgent ones on top of the cold cap
        self.assertEqual(plan[:2], ['7', '8'])


class TestMainNeverFailsOnNotify(NetBase):
    def test_notify_exception_is_swallowed(self):
        import notify
        import scan
        DATA.save_cached('SYNQ', synth.ticker(5), {'source': 'stooq', 'exchange': 'NYQ'})
        out = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, out, True)
        with mock.patch.object(notify, 'send', side_effect=RuntimeError('telegram down')), \
                mock.patch.object(scan, 'load_holdings', return_value=[]):
            rc = scan.main(['--tickers', 'SYNQ', '--offline', '--out', out])
        self.assertEqual(rc, 0)
        self.assertTrue(os.path.exists(os.path.join(out, 'latest.json')))


if __name__ == '__main__':
    unittest.main()
