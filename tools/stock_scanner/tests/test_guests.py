"""guests.py: the market-message broadcast to the bot's guests (markets, mutes, quiet hours, 403, rate limits) and the
guest share of each job (FX scan, stock scan, brief, reminders). No network: Telegram is a fake post()."""
import datetime as dt
import hashlib
import os
import sys
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(STOCK))
sys.path.insert(0, STOCK)

import guests as G  # noqa: E402
import notify as SN  # noqa: E402
import prefs as P  # noqa: E402

CLASSES = {'EURUSD': 'fx', 'XAUUSD': 'fx', 'BTCUSD': 'crypto', 'US500': 'indices'}
NOON = dt.datetime(2026, 10, 29, 18, 0, tzinfo=dt.timezone.utc)     # 12:00 Calgary


def raw_guest(chat=222222222, **kw):
    g = {'id': hashlib.sha256(str(chat).encode()).hexdigest()[:12], 'chat_id': chat, 'name': 'Bro', 'mutes': [], 'alerts': [], 'quiet': None, 'watch': []}
    g.update(kw)
    return g


class FakeTg:
    def __init__(self, codes=None):
        self.calls, self.codes = [], list(codes or [])

    def __call__(self, token, fields):
        self.calls.append(dict(fields))
        code = self.codes.pop(0) if self.codes else 200
        return {'ok': code == 200, 'code': code, 'retry': 1 if code == 429 else 0, 'desc': ''}


ENV = {'TELEGRAM_BOT_TOKEN': 'x:test', 'TELEGRAM_CHAT_ID': '111111111'}


class GuestsTest(unittest.TestCase):
    def test_of_normalizes_and_defaults_to_stocks(self):
        gs = G.of({'guests': [raw_guest(), raw_guest(333333333, markets=['crypto', 'bogus']), {'chat_id': 'nope'}, 'x']})
        self.assertEqual([g['chat'] for g in gs], ['222222222', '333333333'])
        self.assertEqual(gs[0]['markets'], ['stocks'])
        self.assertEqual(gs[1]['markets'], ['crypto'])
        self.assertEqual(gs[0]['id'], G.key(222222222))
        self.assertEqual(G.of(None), [])
        self.assertEqual(G.of({'mutes': []}), [])

    def test_owner_prefs_unchanged_by_guests(self):
        base = {'mutes': [{'sym': 'EURUSD', 'until_utc': '2099-01-01T00:00:00Z'}], 'alerts': [], 'quiet': None, 'watch': ['NVDA'], 'open': ['TSLA']}
        a, b = P.normalize(base), P.normalize({**base, 'guests': [raw_guest()]})
        self.assertNotIn('guests', a)
        self.assertEqual({k: v for k, v in b.items() if k != 'guests'}, a)
        self.assertEqual(P.muted_set(a), P.muted_set(b))
        self.assertEqual(P.watch_syms(a), P.watch_syms(b))

    def test_markets_filter(self):
        stocks = G.of({'guests': [raw_guest()]})[0]
        allm = G.of({'guests': [raw_guest(markets=list(G.MARKETS), mutes=[{'sym': 'NVDA', 'until_utc': '2099-01-01T00:00:00Z'}])]})[0]
        crypto = G.of({'guests': [raw_guest(markets=['stocks', 'crypto'])]})[0]
        self.assertEqual(G.muted(stocks, CLASSES), {'EURUSD', 'XAUUSD', 'BTCUSD', 'US500'})
        self.assertEqual(G.muted(allm, CLASSES), {'NVDA'})
        self.assertEqual(G.muted(crypto, CLASSES), {'EURUSD', 'XAUUSD', 'US500'})
        self.assertEqual(G.market_of('NVDA', CLASSES), 'stocks')
        self.assertEqual(G.market_of('btcusd', CLASSES), 'crypto')
        self.assertFalse(G.wants_fx_scanner(stocks))
        self.assertTrue(G.wants_fx_scanner(crypto))
        cls = G.fx_classes(os.path.join(ROOT, 'public', 'fx', 'latest.json'))
        if cls:
            self.assertEqual(cls.get('EURUSD'), 'fx')
            self.assertEqual(cls.get('XAUUSD'), 'fx')
            self.assertEqual(cls.get('BTCUSD'), 'crypto')
            self.assertEqual(cls.get('US500'), 'indices')

    def test_broadcast_quiet_mutes_and_403(self):
        prefs = {'guests': [raw_guest(quiet={'from': '00:00', 'to': '23:59'}), raw_guest(333333333), raw_guest(444444444)]}
        tg = FakeTg([200, 403, 200])
        with mock.patch.dict(os.environ, ENV), mock.patch.object(G, 'mark_inactive') as gone, mock.patch.object(P, 'in_quiet', wraps=P.in_quiet):
            n = G.broadcast(lambda g: G.hush([SN.Msg('hello', [[SN.button('a', 'https://x')]])], g, now=NOON) if g['chat'] != '444444444' else [],
                            prefs, log=None, post=tg, sleep=lambda s: None)
        self.assertEqual(n, {'sent': 1, 'blocked': 1, 'failed': 0, 'skipped': 1})
        self.assertEqual([c['chat_id'] for c in tg.calls], ['222222222', '333333333'])
        self.assertEqual(tg.calls[0].get('disable_notification'), 'true')        # their quiet hours
        self.assertNotIn('disable_notification', tg.calls[1])
        self.assertIn('reply_markup', tg.calls[0])
        gone.assert_called_once_with(G.key(333333333), log=None)
        self.assertNotIn('111111111', [c['chat_id'] for c in tg.calls])       # never the owner

    def test_broadcast_off_without_owner_telegram_or_with_kill_switch(self):
        tg = FakeTg()
        with mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': '', 'TELEGRAM_CHAT_ID': ''}):
            G.broadcast(G.same(['x']), {'guests': [raw_guest()]}, log=None, post=tg)
        with mock.patch.dict(os.environ, {**ENV, 'RFX_NO_GUESTS': '1'}):
            G.broadcast(G.same(['x']), {'guests': [raw_guest()]}, log=None, post=tg)
        self.assertEqual(tg.calls, [])

    def test_send_retries_429_and_never_raises(self):
        tg = FakeTg([429, 200, 200])
        with mock.patch.dict(os.environ, ENV):
            self.assertEqual(G.send_to('5', ['a', 'b'], post=tg, sleep=lambda s: None), 'ok')
        self.assertEqual(len(tg.calls), 3)

        def boom(token, fields):
            raise OSError('down')
        with mock.patch.dict(os.environ, ENV):
            self.assertEqual(G.send_to('5', ['a'], post=boom, sleep=lambda s: None), 'fail')
            n = G.broadcast(lambda g: 1 / 0, {'guests': [raw_guest()]}, log=None, post=FakeTg())
        self.assertEqual(n['failed'], 1)

    def test_same_builder_and_market(self):
        g = G.of({'guests': [raw_guest()]})[0]
        self.assertEqual(G.same(['x'])(g), ['x'])
        self.assertEqual(G.same(['x'], 'fx')(g), [])

    def test_fired_own_alerts_only_and_keys(self):
        g = G.of({'guests': [raw_guest(alerts=[{'id': 3, 'sym': 'NVDA', 'kind': 'price', 'level': 100, 'dir': 'above'}])]})[0]
        per = {'NVDA': {'bar': {'h': 101, 'l': 95, 'c': 100}, 'zones': [], 'price': 100, 'digits': 2}}
        f = G.fired(g, per, {})
        self.assertEqual([x['alert']['id'] for x in f], [3])
        self.assertEqual(G.fired(g, per, {G.fired_key(g, 3): 'x'}), [])
        self.assertEqual(G.fired(g, per, {'3': 'owner alert 3 fired'}), f)     # the owner's ids never collide

    def test_ondemand_target(self):
        prefs = {'guests': [raw_guest()]}
        tg = FakeTg()
        with mock.patch.dict(os.environ, {**ENV, 'RFX_TO': G.key(222222222)}), mock.patch.object(G, 'send_to', side_effect=lambda c, m: tg(None, {'chat_id': c}) and 'ok'):
            self.assertTrue(G.ondemand_send(['card'], log=None, prefs=prefs))
        self.assertEqual(tg.calls, [{'chat_id': '222222222'}])
        with mock.patch.dict(os.environ, {**ENV, 'RFX_TO': 'ffffffffffff'}):
            self.assertFalse(G.ondemand_send(['card'], log=None, prefs=prefs))     # gone guest: not the owner either
        with mock.patch.dict(os.environ, {**ENV, 'RFX_TO': ''}):
            self.assertIsNone(G.ondemand_send(['card'], log=None, prefs=prefs))   # the owner's own scan


class JobShareTest(unittest.TestCase):
    """What each job sends a guest."""

    def test_fx_scan_share(self):
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'fx_scanner'))
        import fxscan as FS
        seen = []
        with mock.patch.object(FS.N, 'alert_messages', side_effect=lambda ev, mu: seen.append(set(mu)) or ([] if 'EURUSD' in mu else ['ALERT'])), \
                mock.patch.object(FS.N, 'summary_messages', return_value=['SUMMARY']), mock.patch.object(FS.N, 'digest_message', return_value='DIGEST'), \
                mock.patch.object(G, 'fx_classes', return_value=CLASSES):
            stocks = G.of({'guests': [raw_guest()]})[0]
            fxg = G.of({'guests': [raw_guest(markets=['fx', 'stocks'])]})[0]
            ev = {'signals': [{'sym': 'EURUSD', 'kind': 'BUY'}]}
            self.assertEqual(FS.guest_messages(stocks, ev, 'h4', 'h1', {}, {}, {}, [], summary=True), [])
            out = FS.guest_messages(fxg, ev, 'h4', 'h1', {}, {}, {}, [], summary=True)
            self.assertEqual([str(m) for m in out], ['ALERT', 'SUMMARY'])
            self.assertEqual([str(m) for m in FS.guest_messages(fxg, ev, 'h4', 'h1', {}, {}, {}, [], digest=True)], ['ALERT', 'DIGEST'])
            self.assertEqual([str(m) for m in FS.guest_messages(fxg, ev, 'h4', 'h1', {}, {}, {}, [], bootstrap=True)], [])
        self.assertIn('EURUSD', seen[0])

    def test_stock_scan_share_has_no_owner_exits_or_watchlist(self):
        import scan as S
        got = {}

        class N:
            @staticmethod
            def build_messages(res, top=3, muted=None):
                got.update(res=res, muted=muted)
                return ['STOCKS']

            @staticmethod
            def fired_alert_message(f, market, word):
                return 'FIRED'
        res = {'signals': [{'symbol': 'NVDA', 'kind': 'BUY'}], 'exits': [{'symbol': 'HELD'}], 'watch_alerts': [{'text': 'owner watch'}]}
        with mock.patch.object(G, 'fx_classes', return_value=CLASSES):
            g = G.of({'guests': [raw_guest()]})[0]
            out = S.guest_messages(g, res, 3, {}, {}, [], N)
            self.assertEqual([str(m) for m in out], ['STOCKS'])
            self.assertEqual(got['res']['exits'], [])
            self.assertEqual(got['res']['watch_alerts'], [])
            self.assertEqual(res['exits'], [{'symbol': 'HELD'}])               # the owner's result untouched
            crypto_only = G.of({'guests': [raw_guest(markets=['crypto'])]})[0]
            self.assertEqual(S.guest_messages(crypto_only, res, 3, {}, {}, [], N), [])

    def test_brief_share(self):
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'briefing'))
        import brief as B
        day = dt.date(2026, 10, 29)
        mv = lambda s: {'sym': s, 'tf': 'D1', 'pct': 1.2, 'ratio': 2.5, 'tv': 'https://x/' + s}  # noqa: E731
        parts = {'day': day, 'fx': [mv('EURUSD'), mv('BTCUSD')], 'stocks': [mv('NVDA')], 'evs': [], 'sample': False,
                 'plan': {'planFor': '2026-10-29', 'summary': 'Kevin likes gold.', 'n': 3},
                 'block': '📰 <b>Overnight headlines</b>\n• Top story\n<b>Your symbols</b>\n<b>TSLA</b> · owner position news',
                 'lesson': SN.Msg('📘 lesson')}
        fund = {'stocks': {'NVDA': {'er_next': '2026-10-29'}, 'TSLA': {'er_next': '2026-10-29'}}}
        mine = {'NVDA': 'listed', 'TSLA': 'held'}
        with mock.patch.object(G, 'fx_classes', return_value=CLASSES):
            g = G.of({'guests': [raw_guest()]})[0]
            out = B.guest_brief(g, parts, mine, fund)
            text = str(out[0])
            self.assertIn('NVDA', text)
            self.assertNotIn('EURUSD', text)
            self.assertNotIn('BTCUSD', text)
            self.assertNotIn("Kevin's plan", text)
            self.assertIn('Top story', text)
            self.assertNotIn('Your symbols', text)
            self.assertNotIn('owner position', text)
            self.assertNotIn('held', text)
            self.assertEqual(str(out[1]), '📘 lesson')
            c = G.of({'guests': [raw_guest(markets=['crypto', 'fx'])]})[0]
            text = str(B.guest_brief(c, parts, mine, fund)[0])
            self.assertIn('BTCUSD', text)
            self.assertIn('EURUSD', text)
            self.assertNotIn('NVDA', text)
            self.assertIn("Kevin's plan", text)
        self.assertEqual(B.guest_brief(g, {}), [])

    def test_movers_share(self):
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'movers'))
        import movers as M
        close = '2026-10-29T17:00:00+00:00'
        rows = [{'sym': 'XAUUSD', 'group': 'fx', 'tf': 'H1', 'x': 2.4, 'pct': 1.1, 'ctx': ''},
                {'sym': 'NVDA', 'group': 'stock', 'tf': 'H1', 'x': 3.1, 'pct': -2.4, 'ctx': ''},
                {'sym': 'BTCUSD', 'group': 'crypto', 'tf': 'H1', 'x': 2.2, 'pct': 3.0, 'ctx': ''}]
        secs = [{'tf': 'H1', 'close': close, 'fams': ['fx', 'stock'], 'feed': 'IEX real-time', 'rows': rows}]
        g = G.of({'guests': [raw_guest()]})[0]
        out = M.guest_message(g, secs, NOON)
        self.assertEqual(len(out), 1)
        self.assertIn('NVDA', out[0])
        self.assertNotIn('XAUUSD', out[0])
        self.assertNotIn('BTCUSD', out[0])
        self.assertNotIn('Forex', out[0])
        muted = G.of({'guests': [raw_guest(mutes=[{'sym': 'NVDA', 'until_utc': '2099-01-01T00:00:00Z'}])]})[0]
        self.assertEqual(M.guest_message(muted, secs, NOON), [])                  # nothing left for them: no message
        quiet = G.of({'guests': [raw_guest(markets=['crypto'], quiet={'from': '00:00', 'to': '23:59'})]})[0]
        q = M.guest_message(quiet, secs, NOON)
        self.assertIn('BTCUSD', q[0])
        self.assertTrue(q[0].silent)
        self.assertEqual(len(secs[0]['rows']), 3)                                 # the owner's sections untouched

    def test_movers_owner_message_identical_with_guests(self):
        import tempfile
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'movers'))
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'movers', 'tests'))
        import movers as M
        import test_movers as TM
        outs, guest = [], []
        for prefs in (None, {'guests': [raw_guest()]}):
            with tempfile.TemporaryDirectory() as d:
                sent = []
                get, mod = TM.fake(TM.FRI)
                with mock.patch.object(M, '_crypto_mod', lambda: mod), mock.patch.dict(os.environ, {**ENV, **TM.ENV}), \
                        mock.patch.object(G, 'send_to', side_effect=lambda c, ms, **k: guest.append([str(m) for m in ms]) or 'ok'):
                    M.run(TM.FRI, get=get, prefs=prefs, state_path=os.path.join(d, 's.json'), latest_path=os.path.join(d, 'l.json'),
                          send=lambda ms: sent.extend(ms) or True, log=lambda *_: None)
                outs.append([(str(m), m.buttons, m.silent) for m in sent])
        self.assertEqual(outs[0], outs[1])                       # byte-identical for the owner
        self.assertEqual(len(guest), 1)
        self.assertIn('NVDA', guest[0][0])
        self.assertNotIn('XAUUSD', guest[0][0])                  # stocks-only guest

    def test_reminders_go_to_every_guest(self):
        sys.path.insert(0, os.path.join(ROOT, 'tools', 'reminders'))
        import reminders as R
        calls = []
        R._GUEST_PREFS.clear()
        with mock.patch.dict(os.environ, ENV), mock.patch.object(P, 'fetch', return_value={'guests': [raw_guest()]}), \
                mock.patch.object(G, 'send_to', side_effect=lambda c, m, **k: calls.append((c, [str(x) for x in m])) or 'ok'):
            R.to_guests(SN.Msg('⏰ CPI in 30 min'))
        R._GUEST_PREFS.clear()
        self.assertEqual(calls, [('222222222', ['⏰ CPI in 30 min'])])


if __name__ == '__main__':
    unittest.main()
