"""Arrival study, round 4: a benchmark of simple, published strategies on the SAME instruments, D1 data and cost model as
rounds 2 / 3, to compare with the supply / demand zone method (docs/research/arrival_study/round4/Round4.md).

    python tools/research/arrival_study/round4.py               # GitHub Actions (arrival-study.yml, round = 4): OANDA
    python tools/research/arrival_study/round4.py --selftest    # synthetic bars, no network (code-path check only)

Strategies (fixed in advance; the only variants are the ones listed, nothing is searched):
  A  time-series momentum (Moskowitz, Ooi & Pedersen 2012): at each month-end close, long when the 12- (6-, 3-) month
     return is > 0, else short; weight = 10% / the 60-day realized vol (annualized); filled at the next D1 open.
     Plus a long-only 12-month variant on indices + metals.
  B  Donchian breakout (Turtle system 2 style): long on a close above the prior 55-day high, exit on a close below the
     prior 20-day low (short mirrored), fills at the next open; hard stop 2 x ATR20 from the entry; size = 1% risk at
     that stop. Per-trade R = move / (2 x ATR20).
  C  Connors buy-the-dip: close > 200-day SMA and RSI(2) < 10 -> buy at that close; exit at the close when close >
     5-day SMA or after 10 days. Short mirrored (close < SMA200, RSI(2) > 90, exit close < SMA5) reported separately;
     indices + metals and FX separately. Size = 1% of the sub-account per 2 x ATR20 (no stop; R* = move / 2 ATR20).
  D  zone method reference: round 3's 'every fresh zone, fixed 2R' and 'arrivals, fixed 2R' baselines, read from round
     3's published output (public/learn/round3_summary.json), never recomputed.
Costs as rounds 2 / 3: the instrument's median bid / ask spread (round2.fx_jobs) is the round trip; half of it is
charged on every unit of notional traded. Swaps / financing ignored (noted). Data: round2.fx_jobs ->
fx_backtest.fetch_history (.cache), D1 bars via round2.load_job. Every signal reads only bars closed at that moment.
Portfolio = equal-weight average of per-instrument sub-accounts; Sharpe from daily returns; CAGR / max drawdown also
shown at a 10% vol (leverage fixed from the 2010-2019 vol, so the test years are scaled out of sample). Train
2010-2019, test 2020-2026; month-block bootstrap CI for the Sharpe and the mean monthly return; one-sided p of the test
mean monthly return; Benjamini-Hochberg / Bonferroni over the counted variants; round 3's seeded instrument halves.

Outputs: --out (Round4.md, summary.json), --json (public/learn/round4_summary.json).
"""
from __future__ import annotations

import argparse
import bisect
import datetime as dt
import json
import math
import os
import random
import statistics
import sys
import time
from typing import Dict, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import r2lib as R  # noqa: E402
import round2 as R2  # noqa: E402
import round3 as R3  # noqa: E402
import fxcfg as C  # noqa: E402  (on sys.path via r2lib)

Z = R.Z

START = '2010-01-01'
SPLIT = R2.SPLIT                # '2020-01-01'
SEED = R3.SEED                  # the same instrument halves as round 3
VOL_TARGET = 0.10               # A: annual vol per instrument
VOL_DAYS = 60
RISK = 0.01                     # B / C: risk per trade (fraction of the sub-account)
ATR_N, STOP_ATR = 20, 2.0
DON_IN, DON_OUT = 55, 20
SMA_LONG, SMA_EXIT, RSI_N, RSI_LO, RSI_HI, MAX_HOLD = 200, 5, 2, 10.0, 90.0, 10
LEV_CAP = 5.0                   # max notional per sub-account (pegged pairs: 10% / 0.5% vol would be 20x); fixed, not searched
N_BOOT = 1000
MIN_N = 30
FDR_Q = R3.FDR_Q


# ---- instruments ------------------------------------------------------------------------------------------------------
def asset_group(name: str) -> str:
    """fx / metal / commodity / index from the OANDA name (XAU_USD metal, BCO_USD commodity, SPX500_USD index)."""
    a, _, b = name.partition('_')
    if name in C.FUTURES_CFD:
        return 'commodity'
    if a in C.METALS:
        return 'metal'
    if len(a) == 3 and a.isalpha() and len(b) == 3 and b.isalpha():
        return 'fx'
    return 'index'


GROUPS = {'all': None, 'fx': {'fx'}, 'idxmet': {'index', 'metal'}, 'commodity': {'commodity'}}
GROUP_NAMES = {'all': 'all instruments', 'fx': 'FX', 'idxmet': 'indices + metals', 'commodity': 'commodities'}


# ---- indicators (value at bar i uses bars <= i only) ------------------------------------------------------------------
def sma(xs: Sequence[float], n: int) -> List[Optional[float]]:
    out: List[Optional[float]] = [None] * len(xs)
    s = 0.0
    for i, x in enumerate(xs):
        s += x
        if i >= n:
            s -= xs[i - n]
        if i >= n - 1:
            out[i] = s / n
    return out


def rsi(c: Sequence[float], n: int = RSI_N) -> List[Optional[float]]:
    """Wilder's RSI: first average = the simple mean of the first n changes, then avg = (avg * (n - 1) + x) / n."""
    out: List[Optional[float]] = [None] * len(c)
    ag = al = 0.0
    for i in range(1, len(c)):
        ch = c[i] - c[i - 1]
        g, lo = max(ch, 0.0), max(-ch, 0.0)
        if i <= n:
            ag += g / n
            al += lo / n
            if i < n:
                continue
        else:
            ag = (ag * (n - 1) + g) / n
            al = (al * (n - 1) + lo) / n
        out[i] = 100.0 if al == 0 and ag > 0 else (50.0 if al == 0 else 100.0 - 100.0 / (1 + ag / al))
    return out


def atr(bars: Sequence[Z.Bar], n: int = ATR_N) -> List[Optional[float]]:
    """Simple mean of the true range of the last n bars (bar 0 has no previous close: not used)."""
    out: List[Optional[float]] = [None] * len(bars)
    tr = [0.0] * len(bars)
    s = 0.0
    for i in range(1, len(bars)):
        pc = bars[i - 1].c
        tr[i] = max(bars[i].h, pc) - min(bars[i].l, pc)
        s += tr[i]
        if i > n:
            s -= tr[i - n]
        if i >= n:
            out[i] = s / n
    return out


def realized_vol(c: Sequence[float], dates: Sequence[str], i: int, n: int = VOL_DAYS) -> Optional[float]:
    """Annualized sample stdev of the n daily simple returns ending at bar i; the year = the bars of the last 365
    calendar days (FX ~ 260, an index ~ 252), at least 200."""
    if i < n:
        return None
    rs = [c[k] / c[k - 1] - 1 for k in range(i - n + 1, i + 1)]
    sd = statistics.stdev(rs)
    d0 = (dt.date.fromisoformat(dates[i]) - dt.timedelta(days=365)).isoformat()
    ppy = max(200, i + 1 - bisect.bisect_right(dates, d0, 0, i + 1))
    return sd * math.sqrt(ppy)


def vol_weight(sig: int, vol: Optional[float], target: float = VOL_TARGET, cap: float = LEV_CAP) -> float:
    if not vol or vol <= 0:
        return 0.0
    return sig * min(cap, target / vol)


def risk_weight(d: int, price: float, risk_px: float, risk: float = RISK, cap: float = LEV_CAP) -> float:
    """Notional / capital so that a move of risk_px costs `risk` of the capital: units = risk * E / risk_px."""
    if risk_px <= 0:
        return 0.0
    return d * min(cap, risk * price / risk_px)


# ---- position -> daily returns ----------------------------------------------------------------------------------------
Events = Dict[int, List[Tuple[float, float]]]      # bar index -> [(fill price, new weight)] in time order


def stream(bars: Sequence[Z.Bar], events: Events, spread: float) -> List[Tuple[float, float]]:
    """(net, gross) return of every bar for a position given as weights (notional / capital) changed at fill prices.
    Bar j: from the previous close through each fill to the close; a fill of |dw| notional at px costs |dw| * spread /
    2 / px (half the round-trip spread a side). The weight is held constant between fills."""
    out = [(0.0, 0.0)] * len(bars)
    w = 0.0
    hs = spread / 2
    for j in range(len(bars)):
        prev = bars[j - 1].c if j else None
        g = cost = 0.0
        for px, nw in events.get(j, ()):
            if prev is not None:
                g += w * (px / prev - 1)
            cost += abs(nw - w) * hs / px
            prev, w = px, nw
        if prev is not None:
            g += w * (bars[j].c / prev - 1)
        out[j] = (g - cost, g)
    return out


def _trade(sym, bars, d, ei, entry, xi, exitp, risk_px, spread, why, outcome=None) -> Dict:
    r = d * (exitp - entry) / risk_px - spread / risk_px
    return {'sym': sym, 't': bars[ei].d[:10], 'exit_t': bars[xi].d[:10], 'dir': d, 'entry': entry, 'exit': exitp,
            'R': r, 'why': why, 'outcome': outcome or ('win' if r > 0 else 'loss'), 'bars': xi - ei}


# ---- A: time-series momentum ------------------------------------------------------------------------------------------
def month_ends(dates: Sequence[str]) -> List[int]:
    """Bars that are the last of their calendar month (the newest bar never: its month may not be over)."""
    return [i for i in range(len(dates) - 1) if dates[i][:7] != dates[i + 1][:7]]


def tsmom(bars: Sequence[Z.Bar], months: int, long_only: bool = False, hold: bool = False) -> Tuple[Events, Optional[int]]:
    """Events of TSMOM: at month-end close i the sign of c[i] / c[month-end k - months] - 1 (> 0 long, else short;
    long-only: else flat; hold: always long = vol-targeted buy and hold), weight = sign x 10% / vol60, filled at the
    open of bar i + 1. Returns (events, first event bar)."""
    c = [b.c for b in bars]
    dates = [b.d[:10] for b in bars]
    me = month_ends(dates)
    ev: Events = {}
    first = None
    for k in range(len(me)):
        i = me[k]
        if not hold and k < months:
            continue
        vol = realized_vol(c, dates, i)
        if vol is None:
            continue
        if hold:
            sig = 1
        else:
            sig = 1 if c[i] / c[me[k - months]] - 1 > 0 else -1
            if long_only:
                sig = max(sig, 0)
        ev[i + 1] = [(bars[i + 1].o, vol_weight(sig, vol))]
        first = i + 1 if first is None else first
    return ev, first


# ---- B: Donchian breakout ---------------------------------------------------------------------------------------------
def donchian(bars: Sequence[Z.Bar], spread: float, sym: str = '', sides: Tuple[int, ...] = (1, -1)
             ) -> Tuple[Events, List[Dict], Optional[int]]:
    """Signals at the close of bar i (prior 55 / 20 bars, today excluded), fills at the open of i + 1; stop = entry -/+
    2 x ATR20 (the ATR at the signal close), checked on every bar from the entry bar (a gap through it exits at the
    open). An exit and a reversal on the same close fill together at the next open."""
    n = len(bars)
    A20 = atr(bars, ATR_N)
    ev: Events = {}
    trades: List[Dict] = []
    pos = 0
    w = entry = stop = rpx = 0.0
    ei = 0
    pend_exit = False
    pend_entry: Optional[Tuple[int, float, float]] = None      # (side, atr at signal, close at signal)
    for i in range(n):
        b = bars[i]
        if pend_exit:
            ev.setdefault(i, []).append((b.o, 0.0))
            trades.append(_trade(sym, bars, pos, ei, entry, i, b.o, rpx, spread, 'exit signal'))
            pos, w, pend_exit = 0, 0.0, False
        if pend_entry is not None:
            d, a, cs = pend_entry
            pos, entry, rpx, ei = d, b.o, STOP_ATR * a, i
            stop = entry - d * rpx
            w = risk_weight(d, cs, rpx)
            ev.setdefault(i, []).append((b.o, w))
            pend_entry = None
        if pos and ((b.l <= stop) if pos > 0 else (b.h >= stop)):
            px = min(b.o, stop) if pos > 0 else max(b.o, stop)
            ev.setdefault(i, []).append((px, 0.0))
            trades.append(_trade(sym, bars, pos, ei, entry, i, px, rpx, spread, 'stop'))
            pos, w = 0, 0.0
        if i < DON_IN or i + 1 >= n or A20[i] is None or A20[i] <= 0:
            continue
        if pos > 0 and b.c < min(x.l for x in bars[i - DON_OUT:i]):
            pend_exit = True
        elif pos < 0 and b.c > max(x.h for x in bars[i - DON_OUT:i]):
            pend_exit = True
        if pos == 0 or pend_exit:
            if 1 in sides and b.c > max(x.h for x in bars[i - DON_IN:i]) and pos <= 0:
                pend_entry = (1, A20[i], b.c)
            elif -1 in sides and b.c < min(x.l for x in bars[i - DON_IN:i]) and pos >= 0:
                pend_entry = (-1, A20[i], b.c)
    if pos:
        trades.append(_trade(sym, bars, pos, ei, entry, n - 1, bars[-1].c, rpx, spread, 'open at data end', 'open'))
    return ev, trades, (DON_IN if n > DON_IN else None)


# ---- C: Connors RSI(2) ------------------------------------------------------------------------------------------------
def connors(bars: Sequence[Z.Bar], spread: float, d: int, sym: str = '', at_open: bool = False
            ) -> Tuple[Events, List[Dict], Optional[int]]:
    """d = 1: close > SMA200 and RSI(2) < 10 -> buy; exit when close > SMA5 or after 10 closes in the trade.
    d = -1 mirrored (close < SMA200, RSI(2) > 90; exit close < SMA5). Fills at that close (as the rule is published);
    at_open = the reference variant filled at the next open. No new entry on the close of an exit."""
    n = len(bars)
    c = [b.c for b in bars]
    S200, S5, RS, A20 = sma(c, SMA_LONG), sma(c, SMA_EXIT), rsi(c, RSI_N), atr(bars, ATR_N)
    ev: Events = {}
    trades: List[Dict] = []
    pos = False
    entry = rpx = 0.0
    ei = 0
    pend: Optional[Tuple[str, float, float]] = None      # ('in', atr, close) / ('out', 0, 0)
    for i in range(n):
        b = bars[i]
        if pend is not None:
            if pend[0] == 'out':
                ev.setdefault(i, []).append((b.o, 0.0))
                trades.append(_trade(sym, bars, d, ei, entry, i, b.o, rpx, spread, pend[1]))
                pos = False
            else:
                entry, rpx, ei, pos = b.o, STOP_ATR * pend[1], i, True
                ev.setdefault(i, []).append((b.o, risk_weight(d, pend[2], rpx)))
            pend = None
        if S200[i] is None or RS[i] is None or A20[i] is None or A20[i] <= 0:
            continue
        if pos:
            held = i - ei + (1 if at_open else 0)
            out = (c[i] > S5[i]) if d > 0 else (c[i] < S5[i])
            if out or held >= MAX_HOLD:
                why = 'SMA5 exit' if out else 'time exit'
                if at_open:
                    if i + 1 < n:
                        pend = ('out', why, 0.0)
                else:
                    ev.setdefault(i, []).append((c[i], 0.0))
                    trades.append(_trade(sym, bars, d, ei, entry, i, c[i], rpx, spread, why))
                    pos = False
                continue
        elif pend is None:
            sig = (c[i] > S200[i] and RS[i] < RSI_LO) if d > 0 else (c[i] < S200[i] and RS[i] > RSI_HI)
            if sig:
                if at_open:
                    if i + 1 < n:
                        pend = ('in', A20[i], c[i])
                else:
                    entry, rpx, ei, pos = c[i], STOP_ATR * A20[i], i, True
                    ev.setdefault(i, []).append((c[i], risk_weight(d, c[i], rpx)))
    if pos:
        trades.append(_trade(sym, bars, d, ei, entry, n - 1, c[-1], rpx, spread, 'open at data end', 'open'))
    first = next((i for i in range(n) if S200[i] is not None and A20[i] is not None), None)
    return ev, trades, first


# ---- one instrument ---------------------------------------------------------------------------------------------------
STREAMS = {
    'tsmom12': ('A', lambda b, sp, sym: tsmom(b, 12) + ([],)),
    'tsmom6': ('A', lambda b, sp, sym: tsmom(b, 6) + ([],)),
    'tsmom3': ('A', lambda b, sp, sym: tsmom(b, 3) + ([],)),
    'tsmom12lo': ('A', lambda b, sp, sym: tsmom(b, 12, long_only=True) + ([],)),
    'hold': ('ref', lambda b, sp, sym: tsmom(b, 12, hold=True) + ([],)),
    'donch': ('B', lambda b, sp, sym: _reorder(donchian(b, sp, sym))),
    'donch_long': ('B', lambda b, sp, sym: _reorder(donchian(b, sp, sym, sides=(1,)))),
    'donch_short': ('B', lambda b, sp, sym: _reorder(donchian(b, sp, sym, sides=(-1,)))),
    'rsi_long': ('C', lambda b, sp, sym: _reorder(connors(b, sp, 1, sym))),
    'rsi_short': ('C', lambda b, sp, sym: _reorder(connors(b, sp, -1, sym))),
    'rsi_long_open': ('C', lambda b, sp, sym: _reorder(connors(b, sp, 1, sym, at_open=True))),
    'rsi_short_open': ('C', lambda b, sp, sym: _reorder(connors(b, sp, -1, sym, at_open=True))),
}


def _reorder(x):
    ev, trades, first = x
    return ev, first, trades


def instrument_streams(bars: Sequence[Z.Bar], spread: float, sym: str) -> Dict[str, Dict]:
    """{stream: {'start': first eligible date, 'end': last date, 'ret': {date: (net, gross)}, 'trades': [...]}}."""
    out = {}
    dates = [b.d[:10] for b in bars]
    for key, (_, fn) in STREAMS.items():
        ev, first, trades = fn(bars, spread, sym)
        if first is None:
            continue
        rs = stream(bars, ev, spread)
        out[key] = {'start': dates[first], 'end': dates[-1],
                    'ret': {dates[j]: rs[j] for j in range(max(first, 1), len(bars)) if dates[j] >= START},
                    'trades': [t for t in trades if t['t'] >= START]}
    return out


def study_instrument4(job: Dict) -> Dict:
    t0 = time.time()
    out = {'sym': job['sym'], 'rows': [], 'counts': {}, 'error': None}
    try:
        data = R2.load_job(job)
        D = data.get('D1')
        if D is None or len(D) < 300:
            out['error'] = f"too little D1 history ({0 if D is None else len(D)} bars)"
        else:
            bars = [b for b in D.bars if b.o > 0 and b.h > 0 and b.l > 0 and b.c > 0]
            st = instrument_streams(bars, job.get('spread') or 0.0, job['sym'])
            out['rows'] = [{'sym': job['sym'], 'name': job['name'], 'group': asset_group(job['name']),
                            'spread': job.get('spread') or 0.0, 'first': bars[0].d[:10], 'last': bars[-1].d[:10],
                            'n_d1': len(bars), 'streams': st}]
            out['counts'] = {'D1 bars': len(bars)}
    except Exception as e:  # noqa: BLE001
        import traceback
        out['error'] = f'{type(e).__name__}: {str(e)[:160]} | {traceback.format_exc()[-400:]}'
    out['secs'] = round(time.time() - t0, 1)
    return out


# ---- portfolio --------------------------------------------------------------------------------------------------------
def in_group(row: Dict, group: str) -> bool:
    g = GROUPS[group]
    return g is None or row['group'] in g


def portfolio(rows: Sequence[Dict], key: str, syms: Optional[set] = None, group: str = 'all') -> List[Tuple[str, float, float]]:
    """Equal-weight average of the per-instrument sub-accounts active on each date (from the stream's first eligible
    bar to the instrument's last bar; a sub-account with no bar that day returns 0). [(date, net, gross)]."""
    sts = [r['streams'][key] for r in rows if key in r['streams'] and in_group(r, group) and (syms is None or r['sym'] in syms)]
    days = sorted({d for s in sts for d in s['ret']})
    out = []
    for d in days:
        act = [s for s in sts if s['start'] <= d <= s['end']]
        if not act:
            continue
        net = gross = 0.0
        for s in act:
            x = s['ret'].get(d)
            if x is not None:
                net += x[0]
                gross += x[1]
        out.append((d, net / len(act), gross / len(act)))
    return out


def periods_per_year(days: Sequence[str]) -> float:
    if len(days) < 2:
        return 252.0
    span = (dt.date.fromisoformat(days[-1]) - dt.date.fromisoformat(days[0])).days / 365.25
    return len(days) / span if span > 0 else 252.0


def _sd(xs: Sequence[float]) -> float:
    return statistics.pstdev(xs) if len(xs) > 1 else 0.0


def sharpe(rs: Sequence[float], ppy: float) -> Optional[float]:
    if len(rs) < 2:
        return None
    sd = _sd(rs)
    return statistics.fmean(rs) / sd * math.sqrt(ppy) if sd > 0 else None


def month_blocks(series: Sequence[Tuple[str, float]]) -> List[Tuple[int, float, float, float]]:
    """[(n, sum, sum of squares, compounded month return)] per calendar month, oldest first."""
    by: Dict[str, List[float]] = {}
    for d, r in series:
        by.setdefault(d[:7], []).append(r)
    out = []
    for m in sorted(by):
        xs = by[m]
        out.append((len(xs), sum(xs), sum(x * x for x in xs), math.prod(1 + x for x in xs) - 1))
    return out


def block_boot(blocks: Sequence[Tuple[int, float, float, float]], ppy: float, n: int = N_BOOT, seed: int = 4
               ) -> Optional[Tuple[List[float], List[float]]]:
    """Month-block bootstrap: resample whole calendar months (their daily returns stay together) -> the sorted
    resampled (annualized daily Sharpe, mean monthly return). None with < 12 months."""
    if len(blocks) < 12:
        return None
    rnd = random.Random(seed)
    m = len(blocks)
    shs, mms = [], []
    for _ in range(n):
        N = S = SS = MM = 0.0
        for _ in range(m):
            k, s, ss, mr = blocks[rnd.randrange(m)]
            N += k
            S += s
            SS += ss
            MM += mr
        mu = S / N
        var = SS / N - mu * mu
        shs.append(mu / math.sqrt(var) * math.sqrt(ppy) if var > 1e-18 else 0.0)
        mms.append(MM / m)
    shs.sort()
    mms.sort()
    return shs, mms


def max_drawdown(rs: Sequence[float]) -> float:
    eq = peak = 1.0
    dd = 0.0
    for r in rs:
        eq *= 1 + r
        peak = max(peak, eq)
        dd = max(dd, 1 - eq / peak)
    return dd


def pstats(series: Sequence[Tuple[str, float, float]], ppy: float, scale: float, boot: bool = True) -> Dict:
    """Portfolio statistics of [(date, net, gross)]: Sharpe (net / gross), raw vol / CAGR, and CAGR / max DD / mean
    monthly at `scale` x the raw returns, % profitable calendar years, month-block CIs, one-sided p (mean month > 0)."""
    if len(series) < 20:
        return {'days': len(series)}
    days = [s[0] for s in series]
    net = [s[1] for s in series]
    gross = [s[2] for s in series]
    yrs = ((dt.date.fromisoformat(days[-1]) - dt.date.fromisoformat(days[0])).days + 1) / 365.25
    sc = [scale * r for r in net]

    def cagr(rs):
        eq = math.prod(1 + r for r in rs)
        return eq ** (1 / yrs) - 1 if eq > 0 and yrs > 0 else -1.0
    by_year: Dict[str, float] = {}
    for d, r in zip(days, sc):
        by_year[d[:4]] = (1 + by_year.get(d[:4], 0.0)) * (1 + r) - 1
    blocks = month_blocks(list(zip(days, sc)))
    out = {'days': len(series), 'from': days[0], 'to': days[-1], 'sharpe': sharpe(net, ppy), 'sharpe_gross': sharpe(gross, ppy),
           'vol_raw': _sd(net) * math.sqrt(ppy), 'cagr_raw': cagr(net), 'scale': scale, 'cagr': cagr(sc),
           'max_dd': max_drawdown(sc), 'years': len(by_year), 'years_up': sum(1 for v in by_year.values() if v > 0),
           'pct_years_up': sum(1 for v in by_year.values() if v > 0) / len(by_year),
           'mean_month': statistics.fmean(b[3] for b in blocks), 'cost_drag': scale * (statistics.fmean(gross) - statistics.fmean(net)) * ppy,
           'sharpe_ci': None, 'month_ci': None, 'p': None}
    if boot:
        bb = block_boot(blocks, ppy)
        if bb is not None:
            shs, mms = bb
            lo, hi = int(0.025 * N_BOOT), int(0.975 * N_BOOT) - 1
            out['sharpe_ci'] = [shs[lo], shs[hi]]
            out['month_ci'] = [mms[lo], mms[hi]]
            out['p'] = R3.p_one_sided(out['mean_month'], mms)
    return out


# ---- variants ---------------------------------------------------------------------------------------------------------
def V(key, stream_, group, label, family, counted, has_r=False):
    return {'key': key, 'stream': stream_, 'group': group, 'label': label, 'family': family, 'counted': counted, 'has_r': has_r}


VARIANTS = [
    V('A.tsmom12', 'tsmom12', 'all', 'TSMOM 12-month, long / short', 'A momentum', True),
    V('A.tsmom6', 'tsmom6', 'all', 'TSMOM 6-month, long / short', 'A momentum', True),
    V('A.tsmom3', 'tsmom3', 'all', 'TSMOM 3-month, long / short', 'A momentum', True),
    V('A.tsmom12lo.idxmet', 'tsmom12lo', 'idxmet', 'TSMOM 12-month, long-only, indices + metals', 'A momentum', True),
    V('B.donch', 'donch', 'all', 'Donchian 55 / 20 breakout, long / short', 'B breakout', True, True),
    V('C.long.idxmet', 'rsi_long', 'idxmet', 'RSI(2) buy-the-dip (long), indices + metals', 'C mean reversion', True, True),
    V('C.long.fx', 'rsi_long', 'fx', 'RSI(2) buy-the-dip (long), FX', 'C mean reversion', True, True),
    V('C.short.idxmet', 'rsi_short', 'idxmet', 'RSI(2) sell-the-rip (short), indices + metals', 'C mean reversion', True, True),
    V('C.short.fx', 'rsi_short', 'fx', 'RSI(2) sell-the-rip (short), FX', 'C mean reversion', True, True),
    # breakdowns / references (not counted)
    V('ref.hold.idxmet', 'hold', 'idxmet', 'reference: vol-targeted buy and hold, indices + metals', 'reference', False),
    V('ref.hold.all', 'hold', 'all', 'reference: vol-targeted buy and hold, all instruments', 'reference', False),
    V('A.tsmom12.fx', 'tsmom12', 'fx', 'TSMOM 12-month L/S, FX only', 'A breakdown', False),
    V('A.tsmom12.idxmet', 'tsmom12', 'idxmet', 'TSMOM 12-month L/S, indices + metals only', 'A breakdown', False),
    V('A.tsmom12.commodity', 'tsmom12', 'commodity', 'TSMOM 12-month L/S, commodities only', 'A breakdown', False),
    V('B.donch.fx', 'donch', 'fx', 'Donchian L/S, FX only', 'B breakdown', False, True),
    V('B.donch.idxmet', 'donch', 'idxmet', 'Donchian L/S, indices + metals only', 'B breakdown', False, True),
    V('B.donch.commodity', 'donch', 'commodity', 'Donchian L/S, commodities only', 'B breakdown', False, True),
    V('B.donch_long', 'donch_long', 'all', 'Donchian, long side only', 'B breakdown', False, True),
    V('B.donch_short', 'donch_short', 'all', 'Donchian, short side only', 'B breakdown', False, True),
    V('C.long.commodity', 'rsi_long', 'commodity', 'RSI(2) long, commodities', 'C breakdown', False, True),
    V('C.short.commodity', 'rsi_short', 'commodity', 'RSI(2) short, commodities', 'C breakdown', False, True),
    V('C.long_open.idxmet', 'rsi_long_open', 'idxmet', 'RSI(2) long, indices + metals, filled at the next open', 'C breakdown', False, True),
    V('C.long_open.fx', 'rsi_long_open', 'fx', 'RSI(2) long, FX, filled at the next open', 'C breakdown', False, True),
    V('C.short_open.idxmet', 'rsi_short_open', 'idxmet', 'RSI(2) short, indices + metals, filled at the next open', 'C breakdown', False, True),
    V('C.short_open.fx', 'rsi_short_open', 'fx', 'RSI(2) short, FX, filled at the next open', 'C breakdown', False, True),
]


def trades_of(rows: Sequence[Dict], v: Dict) -> List[Dict]:
    return [t for r in rows if in_group(r, v['group']) and v['stream'] in r['streams'] for t in r['streams'][v['stream']]['trades']]


def evaluate(rows: Sequence[Dict], q: float = FDR_Q) -> Tuple[List[Dict], Dict]:
    half_a, half_b = R3.halves([r['sym'] for r in rows], SEED)
    all_days = sorted({d for r in rows for s in r['streams'].values() for d in s['ret']})
    ppy = periods_per_year(all_days)
    out = []
    for v0 in VARIANTS:
        v = dict(v0)
        ser = portfolio(rows, v['stream'], group=v['group'])
        tr = [s for s in ser if s[0] < SPLIT]
        te = [s for s in ser if s[0] >= SPLIT]
        vol_tr = _sd([s[1] for s in tr]) * math.sqrt(ppy) if len(tr) > 1 else 0.0
        scale = VOL_TARGET / vol_tr if vol_tr > 0 else 1.0
        v['n_inst'] = sum(1 for r in rows if in_group(r, v['group']) and v['stream'] in r['streams'])
        v['train'], v['test'] = pstats(tr, ppy, scale), pstats(te, ppy, scale)
        v['halves'] = []
        for half in (half_a, half_b):
            hs = [s for s in portfolio(rows, v['stream'], half, v['group']) if s[0] >= SPLIT]
            v['halves'].append({'sharpe': sharpe([s[1] for s in hs], ppy), 'days': len(hs)})
        if v['has_r']:
            ts = trades_of(rows, v)
            v['trades_train'] = R3.sstats([t for t in ts if t['t'] < SPLIT])
            v['trades_test'] = R3.sstats([t for t in ts if t['t'] >= SPLIT])
            v['trades_test']['why'] = _whys([t for t in ts if t['t'] >= SPLIT and t['outcome'] in R.CLOSED])
            v['trades_test']['avg_bars'] = (statistics.fmean(t['bars'] for t in ts if t['t'] >= SPLIT) if any(t['t'] >= SPLIT for t in ts) else None)
        out.append(v)
    counted = [v for v in out if v['counted']]
    ps = [v['test'].get('p') for v in counted]
    for v, b_, bf in zip(counted, R3.bh(ps, q), R3.bonferroni(ps, 0.05)):
        v['bh'], v['bonf'] = b_, bf
    for v in out:
        v.setdefault('bh', None)
        v.setdefault('bonf', None)
        tr, te = v['train'], v['test']
        v['both_periods'] = bool((tr.get('cagr_raw') or -1) > 0 and (te.get('cagr_raw') or -1) > 0)
        v['halves_ok'] = all((h['sharpe'] or -1) > 0 for h in v['halves'])
        r_ok = True
        if v['has_r']:
            a, b = v['trades_train'], v['trades_test']
            r_ok = a['n'] >= MIN_N and b['n'] >= MIN_N and (a['exp_r'] or -1) > 0 and (b['exp_r'] or -1) > 0
        v['survives'] = bool(v['counted'] and (tr.get('sharpe') or -1) > 0 and (te.get('sharpe') or -1) > 0 and v['halves_ok']
                             and r_ok and v['bh'])
    meta = {'n_variants': len(counted), 'fdr_q': q, 'bonferroni_alpha': 0.05 / max(1, len(counted)), 'ppy': ppy,
            'half_a': sorted(half_a), 'half_b': sorted(half_b), 'split': SPLIT, 'start': START, 'seed': SEED,
            'groups': {g: sorted(r['sym'] for r in rows if r['group'] == g) for g in ('fx', 'index', 'metal', 'commodity')}}
    return out, meta


def _whys(ts: Sequence[Dict]) -> Dict[str, int]:
    out: Dict[str, int] = {}
    for t in ts:
        out[t['why']] = out.get(t['why'], 0) + 1
    return out


# ---- zone reference (round 3, not recomputed) -------------------------------------------------------------------------
# Fallback = the numbers printed in round 3's Round3.md (run of 2026-11-03), used only when its JSON is not on disk.
ZONE_FALLBACK = {
    'zone:all:2R': {'label': 'every fresh zone (D1 + H4), fixed 2R',
                    'train': {'n': 20783, 'exp_r': -0.084, 'ci': None}, 'test': {'n': 14284, 'exp_r': -0.092, 'ci': [-0.118, -0.066]}},
    'arrival:all:2R': {'label': 'arrivals, fixed 2R',
                       'train': {'n': 2174, 'exp_r': -0.08, 'ci': None}, 'test': {'n': 1488, 'exp_r': -0.11, 'ci': [-0.19, -0.03]}},
}
ZONE_LABELS = {'zone:all:2R': 'every fresh zone (D1 + H4), fixed 2R', 'arrival:all:2R': 'arrivals, fixed 2R'}


def zone_reference(paths: Sequence[str]) -> Dict:
    """Round 3's two baselines from its published JSON (public/learn/round3_summary.json, or round3/summary.json with
    a 'hypotheses' key); the Round3.md numbers when neither is on disk."""
    for p in paths:
        try:
            with open(p) as f:
                js = json.load(f)
        except (OSError, ValueError):
            continue
        H = js.get('hypotheses', js)
        if all(k in H for k in ZONE_LABELS):
            return {'source': os.path.relpath(p, R.ROOT) if os.path.isabs(p) else p,
                    'rows': {k: {'label': ZONE_LABELS[k], 'train': H[k]['train'], 'test': H[k]['test'],
                                 'halves': H[k].get('halves')} for k in ZONE_LABELS}}
    return {'source': 'Round3.md of 2026-11-03 (copied; round-3 JSON not found)', 'rows': ZONE_FALLBACK}


# ---- report -----------------------------------------------------------------------------------------------------------
def f2(x, f='{:+.2f}'):
    return R.fmt(x, f)


def pct(x, f='{:+.1f}%'):
    return '–' if x is None else f.format(100 * x)


def ci2(c, f='{:+.2f}'):
    return f"{f.format(c[0])} … {f.format(c[1])}" if c else '–'


def cipct(c):
    return f"{100 * c[0]:+.2f} … {100 * c[1]:+.2f}%" if c else '–'


def _p(p):
    return R3._p(p)


def yes(v):
    return '–' if v is None else ('yes' if v else 'no')


def comparison_table(V_: Sequence[Dict], zref: Dict) -> List[str]:
    L = ['| strategy | train Sharpe | test Sharpe | test Sharpe 95% CI | test CAGR @10% vol | test max DD @10% vol | '
         'test years up | train avg R | test avg R | money in both periods | survives |',
         '|---|---|---|---|---|---|---|---|---|---|---|']
    for v in V_:
        if not (v['counted'] or v['key'].startswith('ref.hold.idxmet')):
            continue
        tr, te = v['train'], v['test']
        ra = f2(v['trades_train']['exp_r']) if v['has_r'] else 'n/a'
        rb = f2(v['trades_test']['exp_r']) if v['has_r'] else 'n/a'
        L.append(f"| {v['label']} | {f2(tr.get('sharpe'))} | {f2(te.get('sharpe'))} | {ci2(te.get('sharpe_ci'))} | "
                 f"{pct(te.get('cagr'))} | {pct(te.get('max_dd'), '{:.0f}%')} | "
                 f"{te.get('years_up', '–')}/{te.get('years', '–')} | {ra} | {rb} | {'yes' if v['both_periods'] else 'no'} | "
                 f"{'**YES**' if v['survives'] else ('–' if not v['counted'] else 'no')} |")
    for k, z in zref['rows'].items():
        both = (z['train'].get('exp_r') or -1) > 0 and (z['test'].get('exp_r') or -1) > 0
        L.append(f"| zone method (round 3): {z['label']} | n/a | n/a | – | n/a | n/a | – | {f2(z['train'].get('exp_r'))} "
                 f"(n {z['train'].get('n')}) | {f2(z['test'].get('exp_r'))} (n {z['test'].get('n')}, CI {ci2(z['test'].get('ci'))}) | "
                 f"{'yes' if both else 'no'} (per trade) | no (round 3) |")
    return L + ['']


def full_table(V_: Sequence[Dict]) -> List[str]:
    L = ['| family | variant | inst. | period | Sharpe (net) | Sharpe gross | Sharpe 95% CI | raw vol | raw CAGR | CAGR @10% | '
         'max DD @10% | years up | mean month @10% (95% CI) | cost drag / yr @10% | p (one-sided) | half A / B Sharpe | BH | survives |',
         '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    for v in V_:
        for per in ('train', 'test'):
            s = v[per]
            if 'sharpe' not in s:
                L.append(f"| {v['family']} | {v['label']} | {v['n_inst']} | {per} | (no data) |" + ' |' * 13)
                continue
            hv = ' / '.join(f2(h['sharpe']) for h in v['halves']) if per == 'test' else ''
            L.append(f"| {v['family']} | {v['label']} | {v['n_inst']} | {per} {s['from'][:4]}–{s['to'][:4]} | {f2(s['sharpe'])} | "
                     f"{f2(s['sharpe_gross'])} | {ci2(s['sharpe_ci'])} | {pct(s['vol_raw'], '{:.1f}%')} | {pct(s['cagr_raw'])} | "
                     f"{pct(s['cagr'])} | {pct(s['max_dd'], '{:.0f}%')} | {s['years_up']}/{s['years']} | "
                     f"{pct(s['mean_month'], '{:+.2f}%')} ({cipct(s['month_ci'])}) | {pct(s['cost_drag'], '{:.1f}%')} | "
                     f"{_p(s['p']) if per == 'test' else '–'} | {hv} | {yes(v['bh']) if per == 'test' else ''} | "
                     f"{('**YES**' if v['survives'] else ('–' if not v['counted'] else 'no')) if per == 'test' else ''} |")
    return L + ['']


def trade_table(V_: Sequence[Dict]) -> List[str]:
    L = ['| variant | train trades | train win % | train avg R | test trades | test win % | test avg R | test 95% CI (week blocks) | '
         'p (test) | avg bars held (test) | test exits |', '|---|---|---|---|---|---|---|---|---|---|---|']
    for v in V_:
        if not v['has_r']:
            continue
        a, b = v['trades_train'], v['trades_test']
        L.append(f"| {v['label']} | {a['n']} | {R3._w(a)} | {f2(a['exp_r'])} | {b['n']} | {R3._w(b)} | {f2(b['exp_r'])} | "
                 f"{R3._ci(b)} | {_p(b['p'])} | {R.fmt(b.get('avg_bars'), '{:.1f}')} | "
                 f"{', '.join(f'{k} {n}' for k, n in sorted(b.get('why', {}).items()))} |")
    return L + ['']


def plain_answer(V_: Sequence[Dict], meta: Dict, zref: Dict, selftest: bool) -> List[str]:
    counted = [v for v in V_ if v['counted']]
    surv = [v for v in counted if v['survives']]
    both = [v for v in counted if v['both_periods']]
    L = ['## The answer in plain English', '']
    if selftest:
        L += ['> **SELFTEST on synthetic random-walk bars.** These numbers only show that the code runs; they say nothing '
              'about real markets. Run the workflow (round = 4) for the real answer.', '']
    if both:
        L.append(f"**{len(both)} of {len(counted)} strategy variants made money after spread costs in both 2010–2019 and "
                 f"2020–2026** (portfolio CAGR > 0 in each period):")
        L.append('')
        for v in both:
            tr, te = v['train'], v['test']
            r = (f"; per trade {f2(v['trades_train']['exp_r'])}R → {f2(v['trades_test']['exp_r'])}R" if v['has_r'] else '')
            L.append(f"- **{v['label']}**: Sharpe {f2(tr.get('sharpe'))} (train) / {f2(te.get('sharpe'))} (test, CI "
                     f"{ci2(te.get('sharpe_ci'))}); at 10% vol the test years returned {pct(te.get('cagr'))} a year, worst drawdown "
                     f"{pct(te.get('max_dd'), '{:.0f}%')}{r}. Halves {' / '.join(f2(h['sharpe']) for h in v['halves'])}; "
                     f"{'**passes every check**' if v['survives'] else 'does not pass every check (see below)'}.")
        L.append('')
    else:
        L += [f"**None of the {len(counted)} strategy variants made money after costs in both periods.**", '']
    if surv:
        L.append(f"**{len(surv)} passed every check** (positive Sharpe in train and test, positive in both random instrument "
                 f"halves, per-trade R > 0 in both periods where R exists, and a Benjamini-Hochberg discovery at q = "
                 f"{meta['fdr_q']} over {len(counted)} variants): " + ', '.join(v['label'] for v in surv) + '.')
    else:
        L.append(f"**None passed every check** (positive in train and test, both random instrument halves, per-trade R where "
                 f"defined, and significant after the false-discovery check over {len(counted)} variants).")
    L.append('')
    neg = [v for v in counted if (v['test'].get('sharpe') or 0) <= 0]
    if neg:
        L.append('- **Lost money in 2020–2026 (net Sharpe ≤ 0):** ' + '; '.join(
            f"{v['label']} {f2(v['test'].get('sharpe'))}" for v in neg) + '.')
    zs = zref['rows']
    zl = '; '.join(f"{z['label']}: {f2(z['train'].get('exp_r'))}R train / {f2(z['test'].get('exp_r'))}R test "
                   f"(n = {z['test'].get('n')})" for z in zs.values())
    rr = [v for v in counted if v['has_r'] and v['trades_test']['n']]
    L.append(f"- **Versus the zone method** (round 3, not recomputed: {zl}): " + '; '.join(
        f"{v['label']} {f2(v['trades_train']['exp_r'])}R / {f2(v['trades_test']['exp_r'])}R (n = {v['trades_test']['n']})"
        for v in rr) + '. The momentum strategies (A) have no stop, so no R; compare them on Sharpe: round 3 measured the '
        'zone method per trade only (no portfolio Sharpe)' + (', and both of its baselines lost money per trade in both '
        'periods.' if all((z['train'].get('exp_r') or 0) < 0 and (z['test'].get('exp_r') or 0) < 0 for z in zs.values()) else '.'))
    L += ['', f"**How sure:** {len(counted)} variants were counted (A: 4 = three lookbacks + long-only; B: 1; C: 4 = long / short "
          f"× indices+metals / FX); the breakdown and reference rows are not counted. By luck alone about "
          f"{len(counted) * 0.05:.1f} would look 'significant' at p < 0.05; Bonferroni needs p < {meta['bonferroni_alpha']:.4f}. "
          'The month-block bootstrap keeps each calendar month together (instruments that move together in a month '
          'resample together). A test-period Sharpe of 0.3–0.5 over ~7 years has a CI roughly ±0.7 wide, so even a real '
          'edge of that size is hard to tell from zero in one period: read the CIs, not only the signs. Literature '
          'context: TSMOM\'s published edge is weaker since ~2012 (e.g. Huang et al. 2020, Hurst-Ooi-Pedersen updates), '
          'and these CFD / spot FX results ignore swaps (FX carry can add or subtract ~1–3% a year).', '']
    return L


def report(rows: Sequence[Dict], V_: Sequence[Dict], meta: Dict, zref: Dict, run_meta: Dict) -> str:
    g = meta['groups']
    L = ['# Arrival study, round 4: do simple published strategies beat the zone method on the same instruments?', '',
         f"Generated {run_meta['generated']} by `tools/research/arrival_study/round4.py` ({run_meta['how']}). "
         f"{len(rows)} instruments with D1 data (FX {len(g['fx'])}, indices {len(g['index'])}, metals {len(g['metal'])}, "
         f"commodities {len(g['commodity'])}), runtime {run_meta['minutes']:.1f} min"
         + (' (**partial: time budget reached**)' if run_meta.get('partial') else '') + '.', '']
    L += plain_answer(V_, meta, zref, run_meta.get('selftest', False))
    L += ['## Comparison', '',
          'Net of spread costs. Sharpe = annualized daily Sharpe of the equal-weight portfolio (no risk-free rate). '
          '"@10% vol" = the portfolio levered so its 2010–2019 volatility was 10% (the same leverage in 2020–2026; '
          'Sharpe does not depend on it). R: B = move / (2 × ATR20, the stop); C = move / (2 × ATR20) as a nominal R '
          '(C has no stop). Zone rows: round 3 per-trade R (week-block CI), copied from ' + f"`{zref['source']}`.", '']
    L += comparison_table(V_, zref)
    L += ['## Strategies (fixed before any result)', '',
          '- **A. Time-series momentum** (Moskowitz, Ooi & Pedersen 2012, "Time series momentum", JFE): at each month-end '
          'close, the sign of the instrument\'s own 12- (6-, 3-) month return; long when > 0, else short; weight = 10% / '
          'the 60-day realized vol (annualized by the bars of the last 365 days), filled at the next D1 open, held to the '
          'next month-end. Long-only 12-month on indices + metals (equity / metal risk premia are positive on average, '
          'so the short side is the doubtful half there). Three lookbacks are three variants and counted as such.',
          f'- **B. Donchian breakout** (Donchian; the Turtle rules, Faith 2007; Clenow 2013): long on a close above the '
          f'prior {DON_IN}-day high, exit on a close below the prior {DON_OUT}-day low (short mirrored); fills at the next '
          f'open; hard stop {STOP_ATR:g} × ATR{ATR_N} from the entry (a gap through it fills at the open); size = '
          f'{RISK:.0%} of the sub-account at that stop.',
          f'- **C. RSI(2) mean reversion** (Connors & Alvarez 2008, "Short Term Trading Strategies That Work"): close > '
          f'{SMA_LONG}-day SMA and Wilder RSI({RSI_N}) < {RSI_LO:g} → buy at that close; exit at the close when close > '
          f'{SMA_EXIT}-day SMA, or at the {MAX_HOLD}th close. Short mirrored (close < SMA{SMA_LONG}, RSI > {RSI_HI:g}, exit '
          f'close < SMA{SMA_EXIT}). Indices + metals and FX separately (equity indices are where it was published; FX '
          'for completeness). Size = 1% of the sub-account per 2 × ATR20. A next-open-fill version is shown as a '
          'non-counted check (the close fill assumes a market-on-close order).',
          '- **D. Zone method**: round 3\'s baselines (every fresh D1 / H4 zone, limit at the proximal, round-2 stop, '
          'fixed 2R; and verified arrivals, fixed 2R), copied from round 3\'s output.',
          '- **Reference** (not counted): a vol-targeted buy and hold (always long, the same 10% / vol60 sizing, monthly), '
          'to show what simply holding the indices + metals did.', '']
    L += ['## Results: portfolios', '',
          'Inst. = instruments with that stream. Half A / B = the test-period Sharpe in each of round 3\'s seeded random '
          'halves of the instruments. p = one-sided month-block bootstrap p of the test mean monthly return (H0 ≤ 0). '
          f"BH = Benjamini-Hochberg discovery at q = {meta['fdr_q']} over the {meta['n_variants']} counted variants. "
          'Breakdown / reference rows are not counted.', '']
    L += full_table(V_)
    L += ['## Results: per trade (B and C)', '',
          'Trades by entry date. win = R > 0.05. CI / p: calendar-week block bootstrap (as round 3). Trades still open '
          'at the data end are left out here (their P&L is in the portfolio).', '']
    L += trade_table(V_)
    L += ['## Method', '',
          '- **Data:** the round-2 / round-3 universe and cache (`round2.fx_jobs` → `fx_backtest.fetch_history`, '
          '`tools/fx_scanner/.cache/bt`), D1 bid bars (forex day, NY 17:00 close) since 2005; warm-up before 2010 '
          'where the history has it. Instruments: ' + ', '.join(f"{k} = {', '.join(v) or '–'}" for k, v in g.items()) + '.',
          '- **No look-ahead:** every signal uses bars closed by its close; A and B fill at the NEXT open, C at the '
          'signal close (as published) with a next-open check. The month-end is known at the next bar\'s date. '
          '`tests/test_round4.py` checks that changing / cutting the future changes no earlier fill.',
          '- **Costs** as rounds 2 / 3: the instrument\'s median bid / ask spread (the last 3000 H4 candles) is the round '
          'trip; half of it is charged on every unit of notional traded (an entry, an exit, every TSMOM rebalance). In R: '
          'spread / risk once per trade. **Swaps / financing are ignored** (they matter: holding a CFD index long pays '
          'financing, FX positions earn or pay carry; TSMOM in futures earns the excess return, here the spot move). '
          'No slippage, no commission.',
          f'- **Sizing / portfolio:** each instrument is a sub-account; the portfolio is the equal-weight average of the '
          f'sub-accounts active that day (from the first bar a stream can trade). Notional per sub-account is capped at '
          f'{LEV_CAP:g}× (pegged pairs such as USDHKD would need 20× and more for 10% vol); weights are held constant '
          'between fills. Daily returns are counted on every date any instrument has a bar '
          f"({meta['ppy']:.0f} a year: the Sharpe annualization).",
          '- **Walk-forward:** nothing is fitted (every rule and number above is from the literature, fixed before running). '
          'Train = 2010–2019, test = 2020–2026. A variant **survives** when its net Sharpe is > 0 in train and in test, '
          'both random instrument halves have a test Sharpe > 0, per-trade avg R > 0 in both periods (≥ 30 trades) '
          'where R exists, and its test p is a BH discovery. "Money in both periods" = net raw CAGR > 0 in train and in test.',
          f"- **Instrument halves** (round 3's seed {meta['seed']}): A = {', '.join(meta['half_a']) or '–'}; "
          f"B = {', '.join(meta['half_b']) or '–'}.",
          '- **Multiple testing:** the counted variants are listed in the answer; the breakdown rows reuse the same '
          'trades and are descriptive only.', '']
    L += ['## Data / counts', '', f"Instruments run: {run_meta['n_jobs']}; with D1 results: {len(rows)}."]
    if run_meta.get('errors'):
        L += ['', 'Errors:', ''] + [f'- {e}' for e in run_meta['errors'][:30]]
    L += ['', 'Reproduce: Actions → "Arrival study" with round = 4. Outputs: `docs/research/arrival_study/round4/` and '
          '`public/learn/round4_summary.json` on the `data` branch.', '']
    return '\n'.join(L)


def learn_json(V_: Sequence[Dict], meta: Dict, zref: Dict, run_meta: Dict) -> Dict:
    keep = ('sharpe', 'sharpe_gross', 'sharpe_ci', 'cagr_raw', 'vol_raw', 'cagr', 'max_dd', 'pct_years_up', 'mean_month',
            'month_ci', 'p', 'cost_drag', 'days', 'from', 'to')
    tk = ('n', 'win', 'exp_r', 'ci', 'p')
    S = {}
    for v in V_:
        d = {'label': v['label'], 'family': v['family'], 'group': v['group'], 'counted': v['counted'], 'n_instruments': v['n_inst'],
             'train': {k: v['train'].get(k) for k in keep}, 'test': {k: v['test'].get(k) for k in keep},
             'halves_test_sharpe': [h['sharpe'] for h in v['halves']], 'bh': v['bh'], 'bonferroni': v['bonf'],
             'both_periods_profitable': v['both_periods'], 'survives': v['survives']}
        if v['has_r']:
            d['trades_train'] = {k: v['trades_train'].get(k) for k in tk}
            d['trades_test'] = {k: v['trades_test'].get(k) for k in tk}
        S[v['key']] = d
    return {'meta': {'generated': run_meta['generated'], 'selftest': run_meta.get('selftest', False), 'split': meta['split'],
                     'start': meta['start'], 'n_variants': meta['n_variants'], 'fdr_q': meta['fdr_q'],
                     'bonferroni_alpha': meta['bonferroni_alpha'], 'vol_target': VOL_TARGET, 'lev_cap': LEV_CAP,
                     'swaps': 'ignored', 'groups': meta['groups']},
            'strategies': S, 'zone_reference': zref}


# ---- synthetic data (selftest) ----------------------------------------------------------------------------------------
def synthetic_jobs4(n_years: int = 22, seed: int = 4) -> List[Dict]:
    """D1 random walks with trending regimes, weekdays 2005-01-03 .. ~2026, for a few names of every asset group."""
    names = [('EUR_USD', 1.2), ('USD_JPY', 110.0), ('GBP_JPY', 150.0), ('AUD_USD', 0.8), ('XAU_USD', 1200.0),
             ('SPX500_USD', 2000.0), ('DE30_EUR', 9000.0), ('BCO_USD', 70.0)]
    jobs = []
    for k, (name, px) in enumerate(names):
        rnd = random.Random(seed * 100 + k)
        day = dt.date(2005, 1, 3)
        bars, p, drift, left = [], px, 0.0, 0
        while day.year < 2005 + n_years:
            if day.weekday() < 5:
                if left <= 0:
                    drift, left = rnd.gauss(0, 0.0006), rnd.randint(40, 250)
                left -= 1
                o = p * (1 + rnd.gauss(0, 0.001))
                c = o * (1 + drift + rnd.gauss(0, 0.007))
                bars.append(Z.Bar(day.isoformat() + 'T00:00', o, max(o, c) * (1 + abs(rnd.gauss(0, 0.003))),
                                  min(o, c) * (1 - abs(rnd.gauss(0, 0.003))), c))
                p = c
            day += dt.timedelta(days=1)
        sym = name.replace('_', '')
        jobs.append({'name': name, 'sym': sym, 'spread': px * 2e-4, 'data': {'D1': R.TF('D1', bars)}})
    return jobs


# ---- driver -----------------------------------------------------------------------------------------------------------
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--fx', type=int, default=0, help='first N instruments (0 = all)')
    ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
    ap.add_argument('--budget-min', type=float, default=0)
    ap.add_argument('--out', default=os.path.join(R.ROOT, 'docs', 'research', 'arrival_study', 'round4'))
    ap.add_argument('--json', default=None, help='the learner summary (default public/learn/round4_summary.json; '
                    'none with --selftest unless given)')
    ap.add_argument('--zone-ref', action='append', default=None,
                    help='round 3 output to read the zone baselines from (default public/learn/round3_summary.json, '
                    'docs/research/arrival_study/round3/summary.json)')
    a = ap.parse_args(argv)
    if a.json is None and not a.selftest:
        a.json = os.path.join(R.ROOT, 'public', 'learn', 'round4_summary.json')
    zpaths = a.zone_ref or [os.path.join(R.ROOT, 'public', 'learn', 'round3_summary.json'),
                            os.path.join(R.ROOT, 'docs', 'research', 'arrival_study', 'round3', 'summary.json')]
    t0 = time.time()
    errors: List[str] = []
    if a.selftest:
        jobs = synthetic_jobs4()
        how = 'SELFTEST on synthetic random-walk bars: says nothing about real markets'
    else:
        jobs, errors = R2.fx_jobs(a.fx)
        how = 'GitHub Actions, OANDA practice'
    print(f'{len(jobs)} instruments ready in {time.time() - t0:.0f}s', flush=True)
    rows, counts, partial = R2.run(jobs, a.workers, a.budget_min, log=print, fn=study_instrument4)
    errors += [f"{c['sym']}: {c['error'][:160]}" for c in counts if c['error']]
    rows.sort(key=lambda r: r['sym'])
    print(f'{len(rows)} instruments; evaluating ...', flush=True)
    V_, meta = evaluate(rows)
    zref = zone_reference(zpaths)
    run_meta = {'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), 'how': how, 'partial': partial,
                'selftest': a.selftest, 'n_jobs': len(jobs), 'minutes': (time.time() - t0) / 60, 'errors': errors}
    md = report(rows, V_, meta, zref, run_meta)
    js = learn_json(V_, meta, zref, run_meta)
    os.makedirs(a.out, exist_ok=True)
    with open(os.path.join(a.out, 'Round4.md'), 'w') as f:
        f.write(md)
    with open(os.path.join(a.out, 'summary.json'), 'w') as f:
        json.dump({**js, 'meta': {**js['meta'], **meta, **run_meta},
                   'instruments': [{k: r[k] for k in ('sym', 'name', 'group', 'spread', 'first', 'last', 'n_d1')} for r in rows]},
                  f, indent=1, default=str)
    if a.json:
        os.makedirs(os.path.dirname(os.path.abspath(a.json)), exist_ok=True)
        with open(a.json, 'w') as f:
            json.dump(js, f, indent=1, default=str)
    print(md[:6000])
    return 0


if __name__ == '__main__':
    sys.exit(main())
