"""Nightly fundamentals for the Telegram bot (/fund SYM): public/fundamentals/fx.json and stocks.json.

    python tools/fundamentals/build.py                 # both files
    python tools/fundamentals/build.py --only fx       # forex only (no SEC, no Nasdaq)
    python tools/fundamentals/build.py --no-earnings   # skip the Nasdaq earnings calendar

fx.json (fx_macro.py): per currency the policy rate / last decision / next meeting / CPI y/y / GDP / unemployment from
TradingView's economic calendar, the FOMC dates of tools/reminders/events.json; per scanner FX pair the rate gap, carry
side and a one-line fundamental bias; short notes for metals, index CFDs, energy and crypto. Needs no secret.

stocks.json (sec_stocks.py): SEC EDGAR fundamentals + earnings dates for every scanner stock. SEC is contacted only
when env SEC_CONTACT (repository variable) is set. Context only: nothing here feeds the scanners' rules.

Env: SEC_CONTACT (optional), FUND_NOW (ISO UTC, tests / dry runs), FUND_SEC_BUDGET_MIN (default 25).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, 'public', 'fundamentals')
sys.path.insert(0, HERE)
import fx_macro as FX  # noqa: E402

UTC = dt.timezone.utc


def _load(path: str, default):
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def write(name: str, obj) -> str:
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, name)
    with open(p, 'w') as f:
        json.dump(obj, f, separators=(',', ':'), ensure_ascii=False, sort_keys=True)
        f.write('\n')
    return p


def build_fx(now: dt.datetime, fetcher=FX.fetch_tv, log=print) -> dict | None:
    evs = FX.load_events(now, fetcher, log)
    if not evs:
        log('fx: calendar unavailable: fx.json kept as it was')
        return None
    inst = _load(os.path.join(ROOT, 'public', 'fx', 'latest.json'), {}).get('map') or []
    fomc = FX.fomc_dates(_load(os.path.join(ROOT, 'tools', 'reminders', 'events.json'), {}))
    fx = FX.build(now, evs, inst, fomc)
    for line in FX.summary(fx):
        log('  ' + line)
    log(f"fx.json: {len(fx['currencies'])} currencies, {len(fx['pairs'])} pairs, {len(fx['notes'])} notes")
    return fx


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--only', choices=['fx', 'stocks'])
    ap.add_argument('--no-earnings', action='store_true')
    a = ap.parse_args(argv)
    now = dt.datetime.strptime(os.environ['FUND_NOW'][:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC) \
        if os.environ.get('FUND_NOW') else dt.datetime.now(UTC)
    ok = True
    if a.only in (None, 'fx'):
        fx = build_fx(now)
        if fx:
            print('wrote', write('fx.json', fx))
        else:
            ok = False
    if a.only in (None, 'stocks'):
        import sec_stocks as ST
        try:
            budget = float(os.environ.get('FUND_SEC_BUDGET_MIN') or 25)
        except ValueError:
            budget = 25.0
        st = ST.build(now, os.environ.get('SEC_CONTACT', ''), earnings=not a.no_earnings, budget_min=budget)
        print('wrote', write('stocks.json', st))
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
