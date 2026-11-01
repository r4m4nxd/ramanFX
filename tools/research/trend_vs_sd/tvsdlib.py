"""Shared pieces of the trend-following vs supply / demand back-test (docs/research/TREND_VS_SD.md).

Data: the QA bar sets of the `data` branch (qa/bars/<SYM>/<TF>.json, OANDA BID, Pepperstone-aligned labels; built by
qa-bars.yml). Point QA_BARS_ROOT at a folder that holds qa/bars, or leave it unset: the files are then read straight from
`git show origin/data:qa/bars/...` (run `git fetch origin data` first).

Everything here is deterministic and has no network access.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import subprocess
import sys
from typing import Dict, List, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
for _p in (os.path.join(ROOT, 'tools', 'fx_scanner'), os.path.join(ROOT, 'tools', 'stock_scanner')):
    if _p not in sys.path:
        sys.path.insert(0, _p)

SYMS = ['AUDUSD', 'EURUSD', 'GBPJPY', 'GBPUSD', 'NZDUSD', 'USDCAD', 'USDJPY', 'XAGUSD', 'XAUUSD', 'US30', 'NAS100',
        'US500', 'SPOTCRUDE']

# MT5 symbol -> (OANDA name, type, pipLocation, displayPrecision, pip_mode)  (the scanner's instrument dict)
META: Dict[str, Tuple[str, str, int, int, str]] = {
    'AUDUSD': ('AUD_USD', 'CURRENCY', -4, 5, ''), 'EURUSD': ('EUR_USD', 'CURRENCY', -4, 5, ''),
    'GBPJPY': ('GBP_JPY', 'CURRENCY', -2, 3, ''), 'GBPUSD': ('GBP_USD', 'CURRENCY', -4, 5, ''),
    'NZDUSD': ('NZD_USD', 'CURRENCY', -4, 5, ''), 'USDCAD': ('USD_CAD', 'CURRENCY', -4, 5, ''),
    'USDJPY': ('USD_JPY', 'CURRENCY', -2, 3, ''), 'XAGUSD': ('XAG_USD', 'METAL', -4, 5, ''),
    'XAUUSD': ('XAU_USD', 'METAL', -2, 3, ''), 'US30': ('US30_USD', 'CFD', 0, 1, 'atr'),
    'NAS100': ('NAS100_USD', 'CFD', 0, 1, 'atr'), 'US500': ('SPX500_USD', 'CFD', 0, 1, 'atr'),
    'SPOTCRUDE': ('WTICO_USD', 'CFD', -2, 3, 'atr'),
}

# All-in cost of ONE round trip in price units (typical Pepperstone-style spread + raw-account commission, constant over
# the years: older years were wider, so this flatters every variant equally). The bid-side bars are traded at the bid and
# the ask is bid + spread: a long pays the spread when it buys, a short when it buys back.
COST: Dict[str, float] = {
    'EURUSD': 0.00012, 'GBPUSD': 0.00015, 'USDJPY': 0.014, 'USDCAD': 0.00018, 'AUDUSD': 0.00014, 'NZDUSD': 0.00018,
    'GBPJPY': 0.030, 'XAUUSD': 0.40, 'XAGUSD': 0.035, 'US30': 3.0, 'NAS100': 2.0, 'US500': 0.8, 'SPOTCRUDE': 0.05,
}
GROUP = {'EURUSD': 'FX', 'GBPUSD': 'FX', 'USDJPY': 'FX', 'USDCAD': 'FX', 'AUDUSD': 'FX', 'NZDUSD': 'FX', 'GBPJPY': 'FX',
         'XAUUSD': 'Metals', 'XAGUSD': 'Metals', 'US30': 'Indices', 'NAS100': 'Indices', 'US500': 'Indices',
         'SPOTCRUDE': 'Oil'}


def inst_of(sym: str) -> Dict:
    """The scanner's instrument dict of an MT5 symbol."""
    import fxcfg as C
    name, kind, pl, dp, pm = META[sym]
    d = {'name': name, 'type': kind, 'pipLocation': pl, 'displayPrecision': dp}
    if pm:
        d['pip_mode'] = pm
    d['cls'] = C.fx_class(name, kind)
    return d


def _read(sym: str, tf: str) -> dict:
    root = os.environ.get('QA_BARS_ROOT')
    if root:
        for r in (os.path.join(root, 'qa', 'bars'), root):
            p = os.path.join(r, sym, f'{tf}.json')
            if os.path.exists(p):
                with open(p) as f:
                    return json.load(f)
        raise FileNotFoundError(f'{sym}/{tf}.json not under {root}')
    out = subprocess.run(['git', '-C', ROOT, 'show', f'origin/data:qa/bars/{sym}/{tf}.json'], capture_output=True, check=True)
    return json.loads(out.stdout)


def load_rows(sym: str, tf: str) -> List[list]:
    """[[label, o, h, l, c]] closed bars, oldest first."""
    j = _read(sym, tf)
    rows = j['bars']
    return rows[:-1] if j.get('forming') else rows


def clean_d1(rows: List[list]) -> List[list]:
    """Weekend-labelled bars (older OANDA history has a thin Sunday session, flat Saturday bars) are merged into the
    next weekday bar (flat Saturday bars dropped), so every D1 bar is one trading day and the 50 / 100 / 20-day windows
    count trading days. Applied to all three variants alike."""
    out, carry = [], None
    for d, o, h, l, c in rows:
        if dt.date.fromisoformat(d[:10]).weekday() >= 5:
            if h == l and carry is None:
                continue
            carry = [o, h, l] if carry is None else [carry[0], max(carry[1], h), min(carry[2], l)]
            continue
        if carry is not None:
            o, h, l = carry[0], max(h, carry[1]), min(l, carry[2])
            carry = None
        out.append([d, o, h, l, c])
    return out


def bar_end(lbl: str, tf: str) -> str:
    import fx_backtest as BT
    return BT.bar_end(lbl, tf)
