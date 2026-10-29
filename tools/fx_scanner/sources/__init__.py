"""Data sources for the watchlist symbols OANDA does not serve (owner 2026-10-29: "we cannot miss those").

Reusable by the scanner, the Telegram bot's charts and the movers: the mapping (Pepperstone symbol -> source,
feed symbols, digits, pip mode, typical spread, context-only note) lives in tools/fx_scanner/instruments.json
`extra`; this package only knows how to fetch and shape bars.

    import sources as SRC
    SRC.spec('BTCUSD')                         # the instruments.json entry (None = not an extra-source symbol)
    SRC.candles('BTCUSD', 'H4', count=200)     # [zones.Bar] closed bars, oldest first, server-time labels
    SRC.candles('EURMXN', 'D1', frm='2026-01-01T00:00', leg=my_oanda_getter)
    SRC.fetch(spec, leg=...)                   # ({'H1','H4','D1','W1','MN': [Bar]}, typical spread in price units)

Sources (`source` field):
    synthetic   OANDA legs (sources/synthetic.py): FX crosses + the EURX / JPYX baskets; needs `leg`, a callable
                OANDA getter name -> ({tf: bars}, spread) (the scanner passes its cached one)
    crypto      Coinbase Exchange -> Kraken (BNB: Binance.US -> OKX), sources/crypto.py: 24/7, UTC days
    yahoo       Yahoo Finance chart API, sources/yahoo.py: UNOFFICIAL feed (indices, VIX, softs, gasoline, cattle)

Bar conventions: sources/bars.py (H1 / H4 on the server-time grid exactly like the FX bars; D1 = the source's day:
UTC for crypto, the exchange's trading date for Yahoo; W1 from Saturday, MN calendar months; closed bars only).
"""
from __future__ import annotations

import json
import os
from typing import Callable, Dict, List, Optional, Tuple

from . import bars as B
from . import crypto, synthetic, yahoo
import fxcfg as C
from zones import Bar

PATH = os.path.join(C.HERE, 'instruments.json')
_REG: Optional[List[Dict]] = None
LegGetter = Callable[[str], Tuple[Dict[str, List[Bar]], Optional[float]]]


def registry() -> List[Dict]:
    """The `extra` entries of instruments.json (one per Pepperstone symbol)."""
    global _REG
    if _REG is None:
        with open(PATH) as f:
            _REG = [dict(x) for x in json.load(f).get('extra') or []]
    return _REG


def spec(sym: str) -> Optional[Dict]:
    s = sym.split(':', 1)[-1].upper()
    return next((x for x in registry() if x['sym'] == s or x['name'] == s), None)


def meta(x: Dict) -> Dict:
    """The instrument dict the scanner uses (OANDA-like keys + the source fields)."""
    keep = ('name', 'type', 'displayName', 'pipLocation', 'displayPrecision', 'cls', 'source', 'pip_mode', 'feed',
            'unofficial', 'approximate', 'context_only', 'sym')
    return {k: x[k] for k in keep if k in x}


def typical_spread(x: Dict, price: Optional[float]) -> Optional[float]:
    """Pepperstone's typical spread from instruments.json: `spread` (price units) or `spread_pct` (% of price)."""
    if x.get('spread') is not None:
        return float(x['spread'])
    if x.get('spread_pct') is not None and price:
        return price * float(x['spread_pct']) / 100
    return None


def fetch(x: Dict, leg: Optional[LegGetter] = None, log=None, get=None) -> Tuple[Dict[str, List[Bar]], Optional[float]]:
    src = x.get('source')
    if src == 'synthetic':
        if leg is None:
            raise ValueError('synthetic instrument needs an OANDA leg getter')
        out, sp = synthetic.bars(x, leg)
        return out, (sp if x.get('spread') is None and x.get('spread_pct') is None else
                     typical_spread(x, (out.get('H4') or [Bar('', 0, 0, 0, 0)])[-1].c))
    if src == 'crypto':
        rec = crypto.update(x, get=get, log=log)
    elif src == 'yahoo':
        rec = yahoo.update(x, get=get, log=log)
    else:
        raise ValueError(f"unknown source {src!r}")
    out = B.chain(rec.get('h1') or [], rec.get('d1') or [])
    px = (out.get('H4') or out.get('D1') or [Bar('', 0, 0, 0, 0)])[-1].c
    return out, typical_spread(x, px)


def candles(symbol: str, granularity: str, count: Optional[int] = None, frm: Optional[str] = None,
            leg: Optional[LegGetter] = None, log=None) -> List[Bar]:
    """Closed bars of one extra-source symbol: granularity H1 / H4 / D1 / W1 / MN; `frm` = first server-time label
    to return ('YYYY-MM-DDTHH:MM', inclusive); `count` = at most the newest N. Raises KeyError for a symbol that is
    not in instruments.json `extra` (use oanda.py for those)."""
    x = spec(symbol)
    if x is None:
        raise KeyError(f'{symbol}: not an extra-source symbol')
    out, _ = fetch(x, leg=leg, log=log)
    bs = out.get(granularity) or []
    if frm:
        bs = [b for b in bs if b.d >= frm]
    return bs[-count:] if count else bs
