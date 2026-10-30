"""Raja arrival / realignment alerts: the ZoneVision trend-line port (zvtrend.py), arrival detection (1 / 2 opposite
zones removed), the HTF ceiling, weak zones + realignment area, the lower-TF confirmation, the alert state (dedupe,
day cap, bootstrap, mutes), the messages, the stock H4 blocks, and parity with the TypeScript chart port
(tools/telegram_bot/parity/arrival_fixtures.json, when present)."""
import datetime as dt
import json
import os
import tempfile
import unittest
import unittest.mock

import helpers  # noqa: F401 - sys.path
import arrival as A
import arrival_alerts as AA
import stock_arrivals as SA
import zones as Z
import zvtrend as ZV

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
FIXTURE = os.path.join(ROOT, 'tools', 'telegram_bot', 'parity', 'arrival_fixtures.json')
NOW = dt.datetime(2026, 10, 29, 20, 0, tzinfo=dt.timezone.utc)      # 2:00 PM Calgary


# ---- synthetic charts: a down trend of three supply bases (130 / 120 / 110), then a demand base at 80 and a leg out --
def leg(c0, c1, n, out):
    for k in range(1, n + 1):
        o, c = c0 + (c1 - c0) * (k - 1) / n, c0 + (c1 - c0) * k / n
        out.append((o, max(o, c) + 0.4, min(o, c) - 0.4, c))
    return c1


def base(c, n, out, w=0.6):
    for k in range(n):
        out.append((c, c + w, c - w, c + 0.1 * (1 if k % 2 else -1)))
    return out[-1][3]


def down_trend():
    b, c = [], 100.0
    c = leg(c, 130, 8, b)
    c = base(c, 2, b)
    c = leg(c, 100, 8, b)
    c = leg(c, 120, 8, b)
    c = base(c, 2, b)
    c = leg(c, 90, 8, b)
    c = leg(c, 110, 8, b)
    c = base(c, 2, b)
    c = leg(c, 80, 8, b)
    return b, c


def with_arrival(top=115.0, after=3):
    """The down trend, a 2-candle demand base at 80, a 3-candle leg out to `top`, then `after` quiet candles."""
    b, c = down_trend()
    c = base(c, 2, b)
    c = leg(c, top, 3, b)
    for k in range(after):
        b.append((c, c + 0.8, c - 0.8, c + 0.2 * (-1) ** k))
    return b


def series(b, tf='D1', scale=1.0, price=None):
    bars = [Z.Bar(f'2026-{i:04d}', o * scale, h * scale, l * scale, c * scale) for i, (o, h, l, c) in enumerate(b)]
    return Z.Series(bars, bars[-1].c if price is None else price, tf)


def mirror(b, k=200.0):
    """The same chart upside down (a demand arrival becomes a supply arrival)."""
    return [(k - o, k - l, k - h, k - c) for (o, h, l, c) in b]


class TrendLines(unittest.TestCase):
    def test_down_line_through_the_two_most_recent_real_peaks(self):
        b, _ = down_trend()
        S = series(b)
        r = ZV.zv_lines(S)
        self.assertEqual(r.why_dn, 'ok')
        peaks = [p for p in r.pivots if p.t == 1]
        self.assertEqual(r.dn.b, peaks[-1].bar)                      # the newer anchor = the newest real peak (110.6)
        self.assertAlmostEqual(r.dn.pb, 110.6)
        self.assertGreater(r.dn.pa, r.dn.pb)                         # newer peak lower
        self.assertIsNone(r.up)                                      # no two real valleys with the newer higher
        # nothing between the anchors pokes through the final line by more than 0.05 ATR (FitAnchor)
        tol = 0.05 * ZV.zv_atr(S)(1)
        self.assertTrue(all(S.H[j] - r.dn.at(j) <= tol for j in range(r.dn.b + 1, r.dn.a)))
        self.assertEqual(r.dn.cuts, 0)

    def test_wick_poking_through_becomes_the_older_anchor(self):
        b, _ = down_trend()
        S0 = series(b)
        r0 = ZV.zv_lines(S0).dn
        mid = (r0.a + r0.b) // 2                                      # a candle between the anchors (shift)
        i = len(b) - mid                                              # its index in b (shift 1 = the last bar)
        o, h, l, c = b[i]
        b[i] = (o, r0.at(mid) + 3.0, l, c)                            # its wick 3 points above the line
        S = series(b)
        r = ZV.zv_lines(S)
        self.assertIsNotNone(r.dn, r.why_dn)
        self.assertEqual(r.dn.a, mid)                                 # the poking candle's wick is the new older anchor
        self.assertAlmostEqual(r.dn.pa, b[i][1])
        self.assertEqual(r.dn.b, r0.b)
        self.assertEqual(ZV.zv_fit_anchor(S, r0.a, r0.b, r0.pb, -1), mid)

    def test_too_flat_and_broken(self):
        flat = [(100 + 0.01 * (k % 3), 100.5, 99.5, 100.0) for k in range(60)]
        self.assertIsNone(ZV.zv_lines(series(flat)).dn)
        b = with_arrival(125, 3)                                      # the leg closes far above the down line
        r = ZV.zv_lines(series(b))
        self.assertIsNone(r.dn)
        self.assertTrue(r.why_dn.startswith('broken at shift'))
        self.assertIsNotNone(r.broken_dn)

    def test_virtual_tf_atr_is_wilder(self):
        b, _ = down_trend()
        S = series(b, '3M')
        a = ZV.zv_atr(S)
        self.assertGreater(a(1), 0)
        self.assertNotAlmostEqual(a(1), S.atr(1))


def arr(S, p=Z.RAJA):
    return A.find_arrivals(S, S.tf, p)[1]


class Arrivals(unittest.TestCase):
    def test_one_supply_removed_is_an_arrival(self):
        S = series(with_arrival(115, 3))
        out = arr(S)
        self.assertEqual(len(out), 1)
        a = out[0]
        self.assertEqual(a.dir, 1)
        self.assertEqual(len(a.removed), 1)
        self.assertFalse(a.strong)
        self.assertAlmostEqual(a.removed[0].dist, 110.6)
        self.assertAlmostEqual(a.zone.dist, 79.4)
        self.assertEqual(a.line.dir, -1)
        self.assertEqual(a.legs, [a.zone.leg_bar, a.zone.leg_bar - 1, a.zone.leg_bar - 2])
        self.assertEqual(a.cross_bar, next(j for j in a.legs if S.C[j] > a.line.at(j)))   # the leg closed above the line
        self.assertAlmostEqual(a.cross_px, a.line.at(a.cross_bar))
        self.assertEqual(a.known_bar, min(a.cross_bar, a.removed[0].removed_bar, a.zone.sa_bar))
        self.assertEqual(a.date, S.T[a.known_bar])

    def test_two_supplies_removed_is_strong(self):
        a = arr(series(with_arrival(125, 3)))[0]
        self.assertEqual(len(a.removed), 2)
        self.assertTrue(a.strong)

    def test_no_line_cross_or_no_removal_is_no_arrival(self):
        self.assertEqual([a for a in arr(series(with_arrival(105, 3))) if a.dir > 0], [])   # stops under the supply
        up = [(100 + k, 101 + k, 99 + k, 100.5 + k) for k in range(80)]                      # no down line at all
        self.assertEqual(arr(series(up)), [])

    def test_mirror_supply_arrival(self):
        a = arr(series(mirror(with_arrival(125, 3))))[0]
        self.assertEqual((a.dir, len(a.removed), a.line.dir), (-1, 2, 1))


class Plans(unittest.TestCase):
    def read(self, b, htf_b=None, price=None, htf_scale=1.0, ltf_b=None):
        S = series(b)
        price = S.C[1] if price is None else price
        H = series(htf_b, 'W1', scale=htf_scale, price=price) if htf_b else None
        Lt = series(ltf_b, 'H1') if ltf_b else None
        return A.arrival_tf(S, 'D1', price, Z.RAJA, H, Lt)

    def test_ceiling_caps_the_tp_under_the_htf_down_line(self):
        hb, _ = down_trend()
        r = self.read(with_arrival(115, 3), hb, htf_scale=1.2)            # the W1 down line runs above price
        pl = r.plan
        self.assertIsNotNone(pl.ceiling)
        self.assertGreater(pl.ceiling, r.S.C[1])
        self.assertEqual(pl.tp, min(pl.target_px, pl.ceiling) if pl.target_px is not None else pl.ceiling)
        self.assertEqual(pl.capped, pl.tp == pl.ceiling)
        self.assertEqual((pl.entry, pl.stop), (r.current.zone.prox, r.current.zone.dist))

    def test_weak_zones_and_realign_nearest_the_htf_line(self):
        hb, _ = down_trend()
        r = self.read(mirror(with_arrival(125, 3)), mirror(hb))           # supply arrival, W1 up line below price
        pl = r.plan
        self.assertEqual(r.current.dir, -1)
        self.assertTrue(pl.weak)
        self.assertTrue(all(z.dir > 0 and not z.removed and z.lo < r.S.C[1] for z in pl.weak))   # demands: weak
        self.assertIsNotNone(pl.line_now)
        best = min(pl.weak, key=lambda z: (A.gap(pl.line_now, z), A.gap(r.S.C[1], z)))
        self.assertIs(pl.realign, best)
        self.assertIs(pl.target, pl.realign)
        self.assertTrue(r.pending)                                       # waits for an LTF (1H) arrival demand
        self.assertAlmostEqual(r.swing, 120.6)                           # the last real peak: the confirmation target

    def test_no_htf_no_realign(self):
        r = self.read(mirror(with_arrival(125, 3)))
        self.assertIsNone(r.plan.realign)
        self.assertFalse(r.pending)


class Confirmation(unittest.TestCase):
    def test_ltf_arrival_inside_the_area_after_the_tf_leg(self):
        S = series(with_arrival(115, 0), 'H1')
        a = arr(S, A.FX_P)[0]
        c = A.confirm_in(S, 'H1', A.FX_P, 1, 79.0, 81.0, '2000-01-01')
        self.assertIsNotNone(c)
        self.assertEqual(c.zone.zid, a.zone.zid)
        self.assertIsNone(A.confirm_in(S, 'H1', A.FX_P, 1, 95.0, 97.0, '2000-01-01'))          # formed outside the area
        self.assertIsNone(A.confirm_in(S, 'H1', A.FX_P, -1, 79.0, 81.0, '2000-01-01'))         # wrong side
        self.assertIsNone(A.confirm_in(S, 'H1', A.FX_P, 1, 79.0, 81.0, '2027-01-01'))  # older than the TF's arrival

    def test_confirm_item_entry_stop_target_rr(self):
        S = series(with_arrival(115, 0), 'H1')
        c = arr(S)[0]
        area = {'sym': 'XYZ', 'tf': 'D1', 'lo': 79.0, 'hi': 81.0, 'swing': 120.6, 'digits': 2, 'id': 'XYZ|D1:S:x'}
        it = AA.confirm_item(area, c, 82.0)
        self.assertEqual((it['entry'], it['stop'], it['target']), (round(c.zone.prox, 2), round(c.zone.dist, 2), 120.6))
        self.assertAlmostEqual(it['rr'], round((120.6 - c.zone.prox) / (c.zone.prox - c.zone.dist), 1))
        self.assertEqual(it['ltf'], 'H1')


class SymbolPass(unittest.TestCase):
    def views(self, price=None):
        hb, _ = down_trend()
        S = series(mirror(with_arrival(125, 3)), 'D1', price=price)
        H = series(mirror(hb), 'W1', price=S.price if price is None else price)
        return {'D1': AA.view_of(S, Z.RAJA), 'W1': AA.view_of(H, Z.RAJA)}, S

    def test_area_watch_once(self):
        v, S = self.views()
        out = AA.symbol_pass('XYZ', v, ('D1',), ('D1',), 2, S.price, S.L[1], S.H[1], {}, NOW.isoformat(), Z.RAJA)
        self.assertEqual(out['arrival'], [])                              # the arrival is 4 bars old: not new
        self.assertEqual(len(out['areas']), 1)
        rec = out['areas'][0]
        self.assertEqual((rec['ltf'], rec['htf'], rec['dir'], rec['arr_dir']), ('H1', 'W1', 1, -1))
        self.assertFalse(rec['entered'])
        self.assertEqual(out['watch'], [])
        p = (rec['lo'] + rec['hi']) / 2                                   # price comes down into the area
        v2, _ = self.views(price=p)
        o2 = AA.symbol_pass('XYZ', v2, ('D1',), ('D1',), 2, p, p, p, {rec['id']: rec}, NOW.isoformat(), Z.RAJA)
        self.assertEqual(len(o2['watch']), 1)
        self.assertTrue(o2['areas'][0]['entered'] and o2['areas'][0]['inside'])
        o3 = AA.symbol_pass('XYZ', v2, ('D1',), ('D1',), 2, p, p, p, {rec['id']: o2['areas'][0]}, NOW.isoformat(), Z.RAJA)
        self.assertEqual(o3['watch'], [])

    def test_new_arrival_only_on_the_newest_bar(self):
        for after in (0, 3):
            S = series(with_arrival(125, after), 'W1')
            v = {'W1': AA.view_of(S, Z.RAJA)}
            out = AA.symbol_pass('XYZ', v, ('W1',), (), 2, S.price, S.L[1], S.H[1], {}, NOW.isoformat(), Z.RAJA)
            a = arr(S)[0]
            self.assertEqual(len(out['arrival']), 1 if a.known_bar <= 1 else 0, after)
        self.assertEqual(len(out['arrival']), 0)


def item(kind, sym, i=0, **kw):
    return {'kind': kind, 'sym': sym, 'tf': 'H4', 'dir': 1, 'lo': 1.0, 'hi': 1.1, 'id': f'{sym}|{kind}|{i}', 'digits': 4,
            'n_removed': 1, 'price': 1.2, **kw}


class StateAndCap(unittest.TestCase):
    def test_dedupe_and_bootstrap(self):
        st = {'bootstrap_pending': True}
        c = [item('arrival', 'EURUSD')]
        self.assertEqual(AA.pick(c, st, 0, now=NOW), [])              # first run: seeded, nothing sent
        st.pop('bootstrap_pending')
        self.assertEqual(AA.pick(c, st, 0, now=NOW), [])              # already seen
        c2 = [item('arrival', 'GBPUSD')]
        self.assertEqual(len(AA.pick(c2, st, 0, now=NOW)), 1)

    def test_cap_counts_messages_one_per_kind_confirm_first(self):
        st = {'seen': {}}
        c = [item('watch', 'A'), item('arrival', 'B'), item('arrival', 'C'), item('confirm', 'D')]
        got = AA.pick(c, st, AA.DAY_CAP - 2, now=NOW)                 # 2 messages left today
        self.assertEqual(sorted({g['kind'] for g in got}), ['arrival', 'confirm'])
        self.assertEqual(len(got), 3)
        self.assertIn('A|watch|0', st['watched'])                    # capped: marked, never sent late
        self.assertEqual(AA.pick(c, st, 0, now=NOW), [])
        self.assertEqual(AA.pick([item('arrival', 'E')], {'seen': {}}, AA.DAY_CAP, now=NOW), [])

    def test_muted_symbols_never_sent(self):
        got = AA.pick([item('arrival', 'A'), item('arrival', 'B')], {'seen': {}}, 0, muted={'A'}, now=NOW)
        self.assertEqual([g['sym'] for g in got], ['B'])

    def test_shared_day_count_over_the_state_files(self):
        with tempfile.TemporaryDirectory() as d:
            files = {k: os.path.join(d, f'{k}.json') for k in ('fx', 'realign', 'stocks')}
            day = AA.calgary_day(NOW)
            AA.save(files['realign'], {'sent': {day: 2}})
            AA.save(files['stocks'], {'sent': {day: 1, '2026-10-01': 5}})
            own = {'sent': {day: 3}}
            self.assertEqual(AA.sent_today(day, files, own, 'fx'), 6)
            AA.mark_sent(own, 2, NOW)
            self.assertEqual(own['sent'][day], 5)
        self.assertEqual(AA.calgary_day(dt.datetime(2026, 10, 30, 5, 0, tzinfo=dt.timezone.utc)), '2026-10-29')

    def test_prune(self):
        st = {'seen': {'old': '2025-01-01T00:00:00+00:00', 'new': NOW.isoformat()}, 'sent': {'2026-01-01': 3, '2026-10-29': 1}}
        AA.prune(st, NOW)
        self.assertEqual(list(st['seen']), ['new'])
        self.assertEqual(list(st['sent']), ['2026-10-29'])

    def test_finalize_bootstrap_then_send(self):
        sent = []
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'arrivals.json')
            st = {'areas': {}}
            c = {'arrival': [item('arrival', 'EURUSD')], 'watch': [], 'confirm': []}
            files = dict(AA.STATE_FILES)
            try:
                AA.STATE_FILES.update({k: os.path.join(d, f'x{k}.json') for k in files})
                n = AA.finalize(st, c, 'fx', None, lambda m: sent.append(m) or True, 'fx', p, now=NOW, boot=True, log=lambda *_: None)
                self.assertEqual((n, sent), (0, []))
                st = AA.load(p)
                c2 = {'arrival': [item('arrival', 'EURUSD'), item('arrival', 'USDJPY')], 'watch': [], 'confirm': []}
                with unittest.mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': '', 'TELEGRAM_CHAT_ID': ''}):
                    n = AA.finalize(st, c2, 'fx', None, lambda m: sent.extend(m) or True, 'fx', p, now=NOW, log=lambda *_: None)
            finally:
                AA.STATE_FILES.clear()
                AA.STATE_FILES.update(files)
            self.assertEqual(n, 1)
            self.assertEqual(len(sent), 1)
            self.assertIn('USDJPY', sent[0])
            self.assertNotIn('EURUSD', sent[0])
            self.assertEqual(AA.load(p)['sent'][AA.calgary_day(NOW)], 1)


class Messages(unittest.TestCase):
    def test_arrival_card(self):
        it = {**item('arrival', 'EURUSD', digits=5), 'lo': 1.0812, 'hi': 1.083, 'price': 1.085, 'n_removed': 2,
              'target': 1.095, 'target_kind': 'ceiling', 'target_tf': 'D1', 'ceiling': 1.095, 'ceiling_tf': 'D1',
              'area': {'tf': 'H4', 'dir': -1, 'lo': 1.1, 'hi': 1.102}}
        m = AA.messages([it], 'fx', NOW)[0]
        self.assertIn('⚡ <b>New arrival zone</b> · 2:00 PM', m)            # Calgary clock
        self.assertIn('4-hour arrival demand 1.08120–1.08300 · <b>strong</b>', m)
        self.assertIn('removed 2 supplies', m)
        self.assertIn('target 1.09500 (+0.9%)', m)                       # % of price, never pips
        self.assertIn('capped under the daily down line', m)
        self.assertNotIn('pip', m)
        self.assertEqual(m.buttons, [[{'text': '📊 Chart EURUSD', 'callback_data': 'c:EURUSD'},
                                      {'text': '🔎 Zones EURUSD', 'callback_data': 'z:EURUSD'}]])

    def test_batched_per_kind_rest_collapsed(self):
        its = [item('arrival', s) for s in ('A', 'B', 'C', 'D', 'E')] + [item('watch', 'F', arr_prox=1.3, ltf='M15', htf='D1')]
        ms = AA.messages(its, 'fx', NOW)
        self.assertEqual(len(ms), 2)
        self.assertIn('<blockquote expandable>', ms[0])
        self.assertEqual(len(ms[0].buttons), 3)
        self.assertIn('🔁 <b>Realignment watch</b>', ms[1])
        self.assertIn('wait for a 15-min arrival demand inside it before buying', ms[1])

    def test_confirmation_card(self):
        it = {**item('confirm', 'GBPUSD', digits=5), 'tf': 'H4', 'ltf': 'M15', 'entry': 1.2621, 'stop': 1.2598,
              'target': 1.278, 'rr': 6.9, 'n_removed': 1}
        m = AA.messages([it], 'fx', NOW)[0]
        self.assertIn('✅ <b>Confirmation</b>', m)
        self.assertIn('🟢 <b>GBPUSD</b>  BUY 1.26210 → 1.27800 · R:R 6.9', m)
        self.assertIn('stop 1.25980 · 15-min demand in the 4-hour realignment area', m)
        self.assertTrue(AA.is_loud([it]))
        self.assertFalse(AA.is_loud([item('arrival', 'X')]))


class StockH4(unittest.TestCase):
    def test_h4_blocks_regular_session(self):
        import scan as SC
        day = '2026-10-28'                                            # EDT: 13:30 UTC = 09:30 New York
        h1 = [Z.Bar(f'{day}T{h:02d}:00', 10 + h, 10.5 + h, 9.5 + h, 10.2 + h) for h in range(11, 22)]
        out = SA.h4_blocks(h1, SC.us_eastern)
        self.assertEqual([b.d for b in out], [f'{day}T09:30', f'{day}T13:30'])
        self.assertEqual(out[0].o, h1[2].o)                           # 13:00 UTC = 09:00 NY bar (holds 09:30-10:00)
        self.assertEqual(out[0].h, max(b.h for b in h1[2:7]))         # 09:00-13:00 NY
        self.assertEqual(out[1].c, h1[8].c)                           # 15:00 NY = the last regular bar


def _close(a, b) -> bool:
    if a is None or b is None:
        return a is None and b is None
    return abs(float(a) - float(b)) <= 1e-9 * max(1.0, abs(float(a)))


def zone_js(S, z):
    return {'dir': z.dir, 'prox': z.prox, 'dist': z.dist, 'legBar': z.leg_bar, 'saBar': z.sa_bar, 'removed': z.removed,
            'removedBar': z.removed_bar if z.removed else -1, 'tLeg': S.T[z.leg_bar], 't0': z.base_start, 'made': z.made}


def line_js(t, S=None):
    if t is None:
        return None
    out = {'dir': t.dir, 'a': t.a, 'b': t.b, 'pa': t.pa, 'pb': t.pb}
    if S is not None:
        out.update(ta=S.T[t.a], tb=S.T[t.b])
    return out


def arrival_js(S, a):
    return {'zone': zone_js(S, a.zone), 'line': {**line_js(a.line), 'ta': S.T[a.line.a], 'tb': S.T[a.line.b]},
            'legs': a.legs, 'crossBar': a.cross_bar, 'crossPx': a.cross_px, 'removed': [zone_js(S, y) for y in a.removed],
            'strong': a.strong}


def case_js(c):
    """The Python reading of one fixture case, shaped like its 'expected'."""
    p = A.FX_P if c['market'] == 'fx' else Z.RAJA
    bars = {tf: [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in rows] for tf, rows in c['bars'].items()}
    tf, htf, ltf = c['tf'], c.get('htf'), c.get('ltf')
    S = A.series_of(bars[tf], tf)
    H = A.series_of(bars[htf], htf, c['price']) if htf and htf in bars else None
    Lt = A.series_of(bars[ltf], ltf) if ltf and ltf in bars else None
    r = ZV.zv_lines(S)
    res = A.arrival_tf(S, tf, c['price'], p, H, Lt, htf=htf, ltf=ltf)
    ab = lambda t: {k: getattr(t, k) for k in ('a', 'b', 'pa', 'pb')} if t is not None else None  # noqa: E731
    out = {'lines': {'up': ab(r.up), 'dn': ab(r.dn), 'why': {'up': r.why_up, 'dn': r.why_dn}},
           'arrivals': [arrival_js(S, a) for a in res.arrivals],
           'current': res.arrivals.index(res.current) if res.current is not None else -1,
           'plan': None, 'confirm': None, 'pending': res.pending}
    pl = res.plan
    if pl is not None:
        zj = lambda z, s=S: zone_js(s, z) if z is not None else None  # noqa: E731
        out['plan'] = {'dir': pl.dir, 'entry': pl.entry, 'stop': pl.stop, 'ceiling': pl.ceiling, 'lineNow': pl.line_now,
                       'ceilingLine': line_js(pl.ceiling_line, H), 'weak': [zj(z) for z in pl.weak], 'realign': zj(pl.realign),
                       'target': zj(pl.target), 'targetPx': pl.target_px, 'htfZone': zone_js(H, pl.htf_zone) if pl.htf_zone else None,
                       'tp': pl.tp, 'capped': pl.capped, 'extended': pl.extended}
    if res.confirm is not None:
        cf = res.confirm
        out['confirm'] = {'tf': cf.tf, 'zone': zone_js(Lt, cf.zone), 'arrival': arrival_js(Lt, cf.arrival), 'target': cf.target,
                          'inArea': cf.in_area}
    return out


def same(tc, got, want, path):
    """Deep compare: numbers within 1e-9 relative, everything else equal."""
    if isinstance(want, dict):
        tc.assertIsInstance(got, dict, path)
        tc.assertEqual(sorted(got), sorted(want), path)
        for k in want:
            same(tc, got[k], want[k], f'{path}.{k}')
    elif isinstance(want, list):
        tc.assertIsInstance(got, list, path)
        tc.assertEqual(len(got), len(want), path)
        for i, (g, w) in enumerate(zip(got, want)):
            same(tc, g, w, f'{path}[{i}]')
    elif isinstance(want, bool) or want is None or isinstance(want, str):
        tc.assertEqual(got, want, path)
    elif isinstance(want, (int, float)):
        tc.assertTrue(isinstance(got, (int, float)) and not isinstance(got, bool) and _close(got, want), f'{path}: {got} != {want}')
    else:
        tc.assertEqual(got, want, path)


@unittest.skipUnless(os.path.exists(FIXTURE), 'arrival_fixtures.json not on this checkout')
class Parity(unittest.TestCase):
    """tools/telegram_bot/parity/arrival_fixtures.json (bars + the TypeScript outputs of arrival.ts / zvTrend.ts): the
    Python port must give the same lines, arrivals, plan, confirmation and pending flag on every case."""

    def test_fixture_cases(self):
        with open(FIXTURE) as f:
            cases = json.load(f)['cases']
        self.assertGreaterEqual(len(cases), 10)
        for c in cases:
            with self.subTest(case=c['name']):
                same(self, case_js(c), c['expected'], c['name'])


if __name__ == '__main__':
    unittest.main()
