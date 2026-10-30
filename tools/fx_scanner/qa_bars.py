"""Long-history QA bar sets (qa-bars.yml, manual): the bars a chart-QA render needs to show the SAME windows the owner
sees on MT5 (Pepperstone), where the published scan (public/fx/d/*.json) keeps only ~80 bars per timeframe.

    python tools/fx_scanner/qa_bars.py [--out qa/bars] [--syms XAUUSD,US30] [--tfs MN,D1]

Source: OANDA v20 candles (oanda.py: host / token / polite http_get), price=BA and the BID side kept, like the scanner
(Pepperstone MT4 / MT5 charts and ZoneVision plot bid). Clock: the scanner's alignment (oanda.ALIGN:
alignmentTimezone=America/New_York, dailyAlignment=17, weeklyAlignment=Friday) and its labels (fxcfg.label: "forex
time" = New York + 7 h). Pepperstone's MT5 server runs on GMT+2 / GMT+3 with the New York DST switch, so server
00:00 = 17:00 New York all year: forex time IS MT5 server time, and D1 / H4 / H1 / M15 / MN candles cover exactly the
MT5 candles (D1 00:00, H4 00/04/../20, MN the 1st). The one label difference: a week is labelled Saturday 00:00 here
(= Friday 17:00 NY, scanner convention) while MT5 stamps the same week Sunday 00:00 (no trading in between: same OHLC);
scripts/qa-bars.ts loadQaBars(..., { mt5Labels: true }) relabels W1 to the MT5 Sunday. So no second alignment variant
is fetched: no other OANDA alignment matches MT5 better.

Paging: OANDA returns at most 5000 candles per request, so each history is read in from / to windows of 4500 candles
(the newest window: from + count=5000, since `to` may not be in the future); overlapping candles are de-duplicated by
time. Ranges (now = run time): MN since 2005-01, W1 since 2015-01, D1 since 2018-01, H4 the last 730 days, H1 the last
183 days, M15 the last 42 days.

Output (compact JSON, one file per symbol and timeframe, MT5 symbol names):
    <out>/<SYM>/<TF>.json   {"sym","oanda","tf","price":"bid","clock","align","generated","n","first","last",
                             "forming","misaligned","bars":[["YYYY-MM-DDTHH:MM",o,h,l,c],...]}   oldest first; the last
                             bar is the forming (incomplete) candle when "forming" is true
    <out>/index.json        what is there (per symbol / TF: n, first, last, forming, misaligned, pages) + errors;
                            an existing index is updated (a partial --syms / --tfs run keeps the other entries)
Exit 1 when any symbol / TF could not be fetched (the files that were fetched are still written).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import urllib.parse
from typing import Callable, Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import fxcfg as C  # noqa: E402
import oanda as O  # noqa: E402

# MT5 (Pepperstone) symbol -> OANDA instrument
SYMS: Dict[str, str] = {
    'XAUUSD': 'XAU_USD', 'AUDUSD': 'AUD_USD', 'EURUSD': 'EUR_USD', 'GBPUSD': 'GBP_USD', 'GBPJPY': 'GBP_JPY',
    'USDJPY': 'USD_JPY', 'NZDUSD': 'NZD_USD', 'USDCAD': 'USD_CAD', 'XAGUSD': 'XAG_USD', 'US30': 'US30_USD',
    'NAS100': 'NAS100_USD',
}
# TF -> (fixed start date, or None) / look-back days
PLAN: Dict[str, Tuple[Optional[dt.datetime], Optional[int]]] = {
    'MN': (dt.datetime(2005, 1, 1), None),
    'W1': (dt.datetime(2015, 1, 1), None),
    'D1': (dt.datetime(2018, 1, 1), None),
    'H4': (None, 730),
    'H1': (None, 183),
    'M15': (None, 42),
}
SEC = {'M15': 900, 'H1': 3600, 'H4': 4 * 3600, 'D1': 86400, 'W1': 7 * 86400, 'MN': 31 * 86400}
WINDOW = 4500                       # candles per from / to window (OANDA's cap is 5000)
MAX_COUNT = 5000
CLOCK = 'server time = New York + 7 h (Pepperstone MT5 GMT+2 / GMT+3, 00:00 = 17:00 New York)'


def rfc(t: dt.datetime) -> str:
    return t.strftime('%Y-%m-%dT%H:%M:%SZ')


def url(name: str, tf: str, frm: dt.datetime, to: Optional[dt.datetime]) -> str:
    q = {'granularity': C.GRAN[tf], 'price': 'BA', **O.ALIGN, 'from': rfc(frm)}
    if to is None:
        q['count'] = str(MAX_COUNT)
    else:
        q['to'] = rfc(to)
    return f'https://{O.host()}/v3/instruments/{urllib.parse.quote(name)}/candles?' + urllib.parse.urlencode(q)


def fetch(name: str, tf: str, start: dt.datetime, now: dt.datetime, get: Callable[[str], bytes]) -> Tuple[List[dict], int]:
    """Every candle of name / tf from start to now (paged; de-duplicated by time; oldest first), and the page count."""
    seen: Dict[str, dict] = {}
    frm, pages = start, 0
    while frm < now and pages < 200:
        end = frm + dt.timedelta(seconds=SEC[tf] * WINDOW)
        last_window = end >= now - dt.timedelta(minutes=5)
        cs = json.loads(get(url(name, tf, frm, None if last_window else end))).get('candles') or []
        pages += 1
        for c in cs:
            if c.get('time'):
                seen[str(c['time'])[:19]] = c
        if not last_window:
            frm = end
        elif len(cs) >= MAX_COUNT:                         # count-capped: continue after the newest candle
            frm = C.parse_utc(cs[-1]['time']) + dt.timedelta(seconds=1)
        else:
            break
    return [seen[k] for k in sorted(seen)], pages


def to_bars(cs: List[dict], tf: str) -> Tuple[List[list], bool, int]:
    """[[label, o, h, l, c]] (BID; mid when a candle has no bid side), whether the last bar is forming, and how many
    candles were off the server-time grid (kept, labelled to the nearest period start; fxcfg.label)."""
    out: List[list] = []
    forming, off = False, 0
    for i, c in enumerate(cs):
        m = c.get('bid') or c.get('mid') or {}
        try:
            o, h, l, cl = (float(m[k]) for k in ('o', 'h', 'l', 'c'))
        except (KeyError, TypeError, ValueError):
            continue
        if not c.get('complete'):
            if i != len(cs) - 1:
                continue                                   # only the newest candle may be in progress
            forming = True
        try:
            lbl = C.label(c['time'], tf, True)
        except C.Misaligned:
            off += 1
            lbl = C.label(c['time'], tf, False)
        if out and out[-1][0] == lbl:                      # same period twice (a re-aligned candle): keep the newer
            out[-1] = [lbl, o, h, l, cl]
        else:
            out.append([lbl, o, h, l, cl])
    return out, forming, off


def run(out_dir: str, syms: List[str], tfs: List[str], now: Optional[dt.datetime] = None,
        get: Optional[Callable[[str], bytes]] = None) -> Dict:
    now = now or dt.datetime.now(dt.timezone.utc).replace(tzinfo=None, microsecond=0)
    get = get or O.default_get
    index: Dict = {'generated': rfc(now), 'price': 'bid', 'clock': CLOCK, 'align': O.ALIGN, 'source': f'OANDA {O.host()}',
                   'format': '[label, o, h, l, c], oldest first; label = server time YYYY-MM-DDTHH:MM (W1: Saturday 00:00; MT5 shows Sunday)',
                   'symbols': {}, 'errors': []}
    try:                                                   # a partial run (--syms / --tfs) keeps the other entries
        with open(os.path.join(out_dir, 'index.json')) as f:
            index['symbols'] = json.load(f).get('symbols') or {}
    except (OSError, ValueError):
        pass
    for sym in syms:
        name = SYMS[sym]
        ent = index['symbols'].setdefault(sym, {'oanda': name, 'tfs': {}})
        for tf in tfs:
            fixed, days = PLAN[tf]
            start = fixed or (now - dt.timedelta(days=days or 0))
            try:
                cs, pages = fetch(name, tf, start, now, get)
                bars, forming, off = to_bars(cs, tf)
            except Exception as e:  # noqa: BLE001  (one symbol / TF failing never stops the others)
                index['errors'].append(f'{sym} {tf}: {type(e).__name__}: {e}'[:300])
                print(f'::warning::qa-bars {sym} {tf}: {type(e).__name__}: {e}'[:300])
                continue
            if not bars:
                index['errors'].append(f'{sym} {tf}: no candles')
                continue
            rec = {'sym': sym, 'oanda': name, 'tf': tf, 'price': 'bid', 'clock': CLOCK, 'align': O.ALIGN,
                   'generated': rfc(now), 'n': len(bars), 'first': bars[0][0], 'last': bars[-1][0], 'forming': forming,
                   'misaligned': off, 'bars': bars}
            p = os.path.join(out_dir, sym, f'{tf}.json')
            os.makedirs(os.path.dirname(p), exist_ok=True)
            with open(p, 'w') as f:
                json.dump(rec, f, separators=(',', ':'))
            ent['tfs'][tf] = {k: rec[k] for k in ('n', 'first', 'last', 'forming', 'misaligned')} | {'pages': pages}
            print(f'qa-bars {sym:7s} {tf:4s} {len(bars):5d} bars  {bars[0][0]} -> {bars[-1][0]}'
                  f'{"  (forming)" if forming else ""}{f"  misaligned {off}" if off else ""}  [{pages} req]')
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, 'index.json'), 'w') as f:
        json.dump(index, f, indent=1)
    return index


def main(argv: Optional[List[str]] = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--out', default='qa/bars')
    ap.add_argument('--syms', default=','.join(SYMS))
    ap.add_argument('--tfs', default=','.join(PLAN))
    a = ap.parse_args(argv)
    syms = [s.strip().upper() for s in a.syms.split(',') if s.strip()]
    tfs = [t.strip().upper() for t in a.tfs.split(',') if t.strip()]
    bad = [s for s in syms if s not in SYMS] + [t for t in tfs if t not in PLAN]
    if bad:
        print(f'unknown symbol / TF: {bad} (symbols {list(SYMS)}, TFs {list(PLAN)})')
        return 2
    index = run(a.out, syms, tfs)
    got = sum(len(e['tfs']) for e in index['symbols'].values())
    print(f'qa-bars: {got} / {len(syms) * len(tfs)} files, {len(index["errors"])} errors')
    return 1 if index['errors'] else 0


if __name__ == '__main__':
    sys.exit(main())
