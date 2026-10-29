"""The network layer of the extra sources: the stock scanner's http_get (tools/stock_scanner/data.py): one generic
browser User-Agent, polite per-host pacing, the run's time budget and the per-host circuit breaker (a blocked host
fails fast for the rest of the run instead of slowing it down). Answers are DATA (JSON parsed, never executed)."""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import data as SD  # noqa: E402

PAUSE = {'api.exchange.coinbase.com': 0.12, 'api.kraken.com': 1.0, 'api.binance.us': 0.1, 'www.okx.com': 0.12,
         'query1.finance.yahoo.com': 0.3, 'query2.finance.yahoo.com': 0.3}
for _h, _s in PAUSE.items():
    SD.HOST_PAUSE.setdefault(_h, _s)


def get_json(url: str, headers=None):
    return json.loads(SD.http_get(url, accept='application/json', expect=SD.looks_json, max_retry_after=10, headers=headers))
