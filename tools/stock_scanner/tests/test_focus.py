"""Focus mode (the owner's /focus): the central sender holds market messages back and keeps the owner's own."""
import os
import sys
import unittest
from unittest import mock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import notify as N  # noqa: E402
import prefs as P  # noqa: E402

ENV = {'TELEGRAM_BOT_TOKEN': 't', 'TELEGRAM_CHAT_ID': '1'}


class Focus(unittest.TestCase):
    def setUp(self):
        N._FOCUS.clear()

    def _send(self, msgs, focus, env=None):
        sent = []
        with mock.patch.dict(os.environ, {**ENV, **(env or {})}), mock.patch.object(P, 'fetch', return_value=focus), \
                mock.patch.object(N, '_post', side_effect=lambda t, f: sent.append(f['text']) or {'ok': True, 'code': 200}), \
                mock.patch.object(N.time, 'sleep'):
            ok = N.send(msgs)
        return ok, sent

    def test_on_holds_market_messages_and_reports_sent(self):
        ok, sent = self._send(['hourly check', N.Msg('arrival')], {'focus': {'on': True, 'syms': ['EURUSD']}})
        self.assertTrue(ok)
        self.assertEqual(sent, [])

    def test_on_keeps_the_owners_alerts_and_failures(self):
        mine = N.fired_alert_message({'alert': {'id': 1, 'kind': 'price', 'level': 1.1}, 'sym': 'EURUSD', 'price': 1.1, 'digits': 5})
        ok, sent = self._send(['digest', mine, N.kept('could not run'), N.silenced(mine)], {'focus': {'on': True}})
        self.assertTrue(ok)
        self.assertEqual(len(sent), 3)
        self.assertTrue(N.silenced(mine).keep)

    def test_off_or_unknown_sends_everything(self):
        self.assertEqual(len(self._send(['a', 'b'], {'focus': {'on': False}})[1]), 2)
        N._FOCUS.clear()
        self.assertEqual(len(self._send(['a', 'b'], None)[1]), 2)          # bot not reachable: nothing is lost

    def test_an_on_demand_check_is_never_held(self):
        self.assertEqual(len(self._send(['your scan'], {'focus': {'on': True}}, {'ONDEMAND': 'true'})[1]), 1)

    def test_prefs_shape(self):
        self.assertEqual(P.normalize({'focus': {'on': 1, 'syms': ['eurusd', '', 'xauusd']}})['focus'], {'on': True, 'syms': ['EURUSD', 'XAUUSD']})
        self.assertNotIn('focus', P.normalize({}))


if __name__ == '__main__':
    unittest.main()
