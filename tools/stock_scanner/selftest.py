"""End-to-end selftest on synthetic fixtures (no network): universe -> bars -> zones -> rules -> fundamentals ->
JSON -> Telegram text. Prints the message; writes fixtures/latest.sample.json (the app's demo / screenshot data).

    python tools/stock_scanner/scan.py --selftest
    python tools/stock_scanner/selftest.py --send     # also send it to Telegram (needs the two env vars)
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, 'fixtures'))

import notify  # noqa: E402
import scan  # noqa: E402
import synth  # noqa: E402

# seeds found by searching fixtures/synth.ticker(): each produces the case named (see tests/test_selftest.py)
FIXTURES = [
    {'symbol': 'SYNA', 'seed': 474, 'name': 'Synthetic Alpha (fixture)', 'sector': 'Information Technology', 'indexes': 'SPX,NDX'},
    {'symbol': 'SYNB', 'seed': 693, 'name': 'Synthetic Beta (fixture)', 'sector': 'Health Care', 'indexes': 'SPX'},
    {'symbol': 'SYNC', 'seed': 771, 'name': 'Synthetic Gamma (fixture)', 'sector': 'Industrials', 'indexes': 'SPX,DJI'},
    {'symbol': 'SYND', 'seed': 648, 'name': 'Synthetic Delta (fixture)', 'sector': 'Information Technology', 'indexes': 'NDX'},
    {'symbol': 'SYNE', 'seed': 275, 'name': 'Synthetic Epsilon (fixture, interlisted)', 'sector': 'Consumer Staples', 'indexes': 'TSX60,TSX', 'home': 'TSX:SYE'},
    {'symbol': 'SYNF', 'seed': 512, 'name': 'Synthetic Zeta (fixture, interlisted)', 'sector': 'Energy', 'indexes': 'TSX', 'home': 'TSX:SYZ'},
    {'symbol': 'SYNG', 'seed': 16, 'name': 'Synthetic Eta (fixture)', 'sector': 'Utilities', 'indexes': 'SPX'},
    {'symbol': 'SYNH', 'seed': 3, 'name': 'Synthetic Theta (fixture)', 'sector': 'Materials', 'indexes': 'SPX'},
    {'symbol': 'SYI.TO', 'seed': 857, 'name': 'Synthetic Iota (fixture, TSX only)', 'sector': 'Financials', 'indexes': 'TSX', 'home': 'TSX:SYI', 'feed': 'tsx'},
]
REGIME_SEEDS = {'SPY': 101, 'QQQ': 102, 'IWM': 103, 'DIA': 104}
WATCHLIST = ['SYNB', 'SYND', 'SYNE', 'SYNF']
END = '2026-10-23'


def holdings_fixture(bars_by_sym):
    g = bars_by_sym['SYNG'][-1].c
    h = bars_by_sym['SYNH'][-1].c
    return [{'symbol': 'SYNG', 'entry': round(g * 0.92, 2), 'stop': round(g * 0.85, 2), 'shares': 10},
            {'symbol': 'SYNH', 'entry': round(h * 1.04, 2), 'stop': round(h * 1.01, 2)}]


def fixture_bars():
    bars = {fx['symbol']: synth.ticker(fx['seed'], END) for fx in FIXTURES if not fx.get('feed')}
    for sym, seed in REGIME_SEEDS.items():
        bars[sym] = synth.ticker(seed, END)
    return bars


def run_fixture():
    with open(os.path.join(HERE, 'fixtures', 'companyfacts_sample.json')) as f:
        cf = json.load(f)
    bars = fixture_bars()
    uni = [{'symbol': fx['symbol'], 'name': fx['name'], 'sector': fx['sector'], 'cik': '0001234567', 'indexes': fx['indexes'],
            'home': fx.get('home', ''), 'currency': 'CAD' if fx.get('feed') else 'USD', 'feed': fx.get('feed', '')} for fx in FIXTURES]
    exch = {'SYNA': 'NMS', 'SYNB': 'NYQ', 'SYND': 'NMS'}
    res = scan.run(uni, lambda s: (bars[s], {'exchange': exch.get(s, 'NYQ'), 'source': 'fixture'}), lambda c: cf,
                   lambda s: '2026-11-19' if s == 'SYNB' else None, holdings_fixture(bars), log=None, watchlist=WATCHLIST)
    res['fixture'] = True
    return res


SAMPLE_DIR = os.path.join(HERE, 'fixtures', 'sample')


def main(out_dir=None, send=False) -> int:
    res = run_fixture()
    path = scan.write_outputs(res, out_dir or SAMPLE_DIR, fixture=True, history=False)
    with open(path) as f:
        pub = json.load(f)
    msgs = notify.build_messages(res)
    if send:
        notify.send(msgs)
    else:
        for m in msgs:
            print(m)
            print('\n' + '-' * 40 + '\n')
    c = pub['counts']
    print(f"selftest: {c['BUY']} BUY, {c['WATCH']} WATCH, {c['EXIT']} EXIT, {len(pub['uncovered'])} uncovered (TSX feed off), {len(msgs)} message(s), max {max(notify.u16(m) for m in msgs)} UTF-16 units -> {path}")
    return 0 if c['BUY'] and c['WATCH'] and c['EXIT'] and pub['uncovered'] else 1


if __name__ == '__main__':
    sys.exit(main(send='--send' in sys.argv))
