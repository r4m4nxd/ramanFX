"""Portfolio simulator for the three variants (daily bars, bid prices, R-based sizing). See docs/research/TREND_VS_SD.md.

    A  supply / demand alone: the scanner's zone orders (collect_zones.py records, a tier of its rules), limit at the proximal,
       stop = distal + buffer, target = nearest opposite zone / 250% projection (the scanner's plan), time stop 150 days.
    B  trend following only: long = close > SMA100 and a new 50-day closing high (mirror short), market entry at the next
       open, initial stop 3 x ATR(20) (Wilder), exit by a trailing stop at the 20-day low / high (ratcheted, stop order),
       no target.
    C  the A orders, filled only when the B trend regime agrees at the previous close; stop = A's stop, exit = B's
       trailing 20-day stop, no target.

Fill rules (daily bars; all prices are BID, a trade pays one full spread + commission = COST[sym] once, charged to R):
  * limit: fills on the first bar whose range touches it (buy: low <= limit, sell: high >= limit) AT the limit price (no price
    improvement on a gap); the fill bar can stop the trade out (stop first) but a target is not credited on the fill bar.
  * stops: a bar that trades through the stop exits at the stop; a bar that OPENS through it exits at the open (gap). When a bar
    touches both stop and target the stop wins. Stops that move (trailing) act from the next bar.
  * B market entries fill at the next open (+ cost). A pending limit is cancelled when it expires (D1 zone 15 days, W1 zone
    45 days), a close goes beyond the distal (zone removed) or the target trades first.
Risk: every trade risks RISK of equity (mark-to-market, at the previous close) to its stop: units = RISK x equity /
(|entry - stop| + cost). P&L = R x that amount (quote-currency conversion drift ignored). Open risk = the sum of every open
trade's risk to its CURRENT stop (never below 0, no netting for correlated pairs); a new trade is skipped when it would take
the total above CAP (5%). One open trade per symbol. Equity is marked to market at every close.
"""
from __future__ import annotations

import bisect
import datetime as dt
import zlib
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np

import tvsdlib as L

SMA_N, BREAK_N, ATR_N, ATR_MULT, TRAIL_N = 100, 50, 20, 3.0, 20
HOLD_MAX = 150                       # A: bars a trade may live
EXPIRY_DAYS = {'D1': 15, 'W1': 45}   # calendar days a limit lives (fx_backtest.EXPIRY_DAYS)
RISK, CAP = 0.005, 0.05

# Variant A rule ladder. The live scanner shows a BUY / SELL only when EVERY rule of fxcore.zone_rules passes; collect_zones.py
# records which rules failed for every fresh zone near price, and a ladder step keeps the zones that fail none of the rules
# listed up to that step. L0 is the headline A (nothing but "fresh zone, price within one zone height of the proximal, a
# target exists, the spread is under 10% of the stop"); every later step adds more of the owner's rules; L6 = the scanner.
LADDER = [
    ('L0', 'every fresh D1 / W1 zone near price', {'fresh', 'spread'}),
    ('L1', '+ zone quality: departure >= 2x, strong type (ARR / WOW / STR), clean, not used, not a 3rd CP',
     {'leg', 'strong', 'clean', 'not used', 'no 3rd CP'}),
    ('L2', '+ room: nearest opposite zone (any TF) at least 2x the stop away', {'room'}),
    ('L3', '+ a limit order is allowed here (arrival zone, WOW, or at the trendline)', {'blind'}),
    ('L4', '+ local structure: no opposite HTF zone on top, not sideways, trendline, host zone',
     {'HTF opposite', 'sideways', 'out of TL', 'trendline', 'host tested', 'market TF', 'gold TF'}),
    ('L5', '+ top-down direction: direction FULL, curve side', {'direction', 'reduced', 'curve'}),
    ('L6', '+ HTF location chain (MN -> W1 -> D1 touched) = every rule of the live scanner', {'location', 'area'}),
]
TIERS: Dict[str, set] = {}
_acc: set = set()
for _n, _t, _g in LADDER:
    _acc = _acc | _g
    TIERS[_n] = set(_acc)
TIER_TEXT = {n: t for n, t, _ in LADDER}


# ---- market data ------------------------------------------------------------------------------------------------------
@dataclass
class Mkt:
    sym: str
    dates: List[str]
    o: np.ndarray
    h: np.ndarray
    l: np.ndarray
    c: np.ndarray
    sma: np.ndarray = None
    hi_prev: np.ndarray = None     # highest close of the 50 bars BEFORE t
    lo_prev: np.ndarray = None
    atr: np.ndarray = None
    don_lo: np.ndarray = None      # lowest low of the 20 bars ending at t
    don_hi: np.ndarray = None
    regime: np.ndarray = None      # +1 / -1 / 0: the last 50-day closing extreme was a high / a low
    idx: Dict[str, int] = field(default_factory=dict)


def build_mkt(sym: str, end: str = '9999') -> Mkt:
    return mkt_from_rows(sym, [r for r in L.clean_d1(L.load_rows(sym, 'D1')) if r[0][:10] < end])


def mkt_from_rows(sym: str, rows: List[list]) -> Mkt:
    """Bars [[label, o, h, l, c]] -> arrays and the indicators of variant B (every value uses bars up to and including t)."""
    import pandas as pd
    dates = [r[0][:10] for r in rows]
    a = np.array([r[1:5] for r in rows], dtype=float)
    o, h, l, c = a[:, 0], a[:, 1], a[:, 2], a[:, 3]
    sc, sh, sl = pd.Series(c), pd.Series(h), pd.Series(l)
    m = Mkt(sym, dates, o, h, l, c)
    m.sma = sc.rolling(SMA_N).mean().to_numpy()
    m.hi_prev = sc.shift(1).rolling(BREAK_N).max().to_numpy()
    m.lo_prev = sc.shift(1).rolling(BREAK_N).min().to_numpy()
    pc = np.r_[np.nan, c[:-1]]
    tr = np.maximum.reduce([h - l, np.abs(h - pc), np.abs(l - pc)])
    tr[0] = h[0] - l[0]
    atr = np.full(len(c), np.nan)
    if len(c) > ATR_N:
        atr[ATR_N - 1] = tr[:ATR_N].mean()
        for i in range(ATR_N, len(c)):
            atr[i] = (atr[i - 1] * (ATR_N - 1) + tr[i]) / ATR_N
    m.atr = atr
    m.don_lo = sl.rolling(TRAIL_N).min().to_numpy()
    m.don_hi = sh.rolling(TRAIL_N).max().to_numpy()
    reg = np.zeros(len(c))
    st = 0
    for i in range(len(c)):
        if not np.isnan(m.hi_prev[i]):
            if c[i] > m.hi_prev[i]:
                st = 1
            elif c[i] < m.lo_prev[i]:
                st = -1
        reg[i] = st
    m.regime = reg
    m.idx = {d: i for i, d in enumerate(dates)}
    return m


def trend_ok(m: Mkt, i: int, d: int) -> bool:
    """The variant-B trend filter at the close of bar i: close vs SMA100 and the 50-day high / low regime."""
    if np.isnan(m.sma[i]):
        return False
    return (m.c[i] > m.sma[i] and m.regime[i] == 1) if d > 0 else (m.c[i] < m.sma[i] and m.regime[i] == -1)


# ---- A orders from the collected zone records --------------------------------------------------------------------------
def orders_from_records(recs: List[Dict], tier: str) -> List[Dict]:
    """One order per zone: the first record (first close the scanner's rules in the tier pass) with a usable plan."""
    G = TIERS[tier]
    seen, out = set(), []
    for r in sorted(recs, key=lambda r: (r['t'], r['sym'], r['zid'])):
        if (r['sym'], r['zid']) in seen:
            continue
        if set(r['fails']) & G:
            continue
        d = r['d']
        if r['target'] is None or d * (r['target'] - r['entry']) <= 0 or d * (r['entry'] - r['stop']) <= 0:
            continue
        seen.add((r['sym'], r['zid']))
        out.append({'sym': r['sym'], 'sig': r['t'], 'tf': r['tf'], 'd': d, 'entry': r['entry'], 'stop': r['stop'],
                    'target': r['target'], 'distal': r['dist'], 'zid': r['zid'], 'code': r['code'], 'rr': r['rr']})
    return out


# ---- the simulator -----------------------------------------------------------------------------------------------------
@dataclass
class Pos:
    sym: str
    d: int
    entry: float
    stop0: float
    stop: float
    target: Optional[float]
    cost: float
    rpx: float
    amt: float                     # account currency at risk to stop0 (RISK x equity at entry)
    i_in: int                      # bar index of the fill
    date_in: str
    kind: str
    tf: str = ''
    trail: Optional[float] = None
    mfe: float = 0.0
    lev: float = 0.0
    lastc: float = 0.0


def _h(date: str, sym: str) -> int:
    return zlib.crc32(f'{date}|{sym}'.encode())


# kind -> (zone orders?, trend filter at the fill?, trailing 20-day exit?, A's target + time stop?)
KINDS = {'A': (True, False, False, True), 'B': (False, False, True, False), 'C': (True, True, True, False),
         'AF': (True, True, False, True),     # decomposition: A's orders + the trend filter, A's own exit
         'AT': (True, False, True, False)}    # decomposition: A's orders, no filter, the trailing exit


def simulate(kind: str, mk: Dict[str, Mkt], orders: Optional[List[Dict]] = None, risk: float = RISK, cap: float = CAP,
             cost_mult: float = 1.0, start: str = '2009-01-01', end: str = '9999', fillbar_target: bool = False) -> Dict:
    """kind 'A' | 'B' | 'C' (KINDS). Returns {'trades': [...], 'equity': {date: equity}, 'open': [...], 'skipped': {...}}."""
    _zone, use_filter, use_trail, use_target = KINDS[kind]
    syms = [s for s in L.SYMS if s in mk]
    cost = {s: L.COST[s] * cost_mult for s in syms}
    alld = sorted({d for s in syms for d in mk[s].dates if start <= d < end})
    by_sig: Dict[str, List[Dict]] = {}
    for o in (orders or []):
        by_sig.setdefault(o['sig'], []).append(o)
    eq_closed = 1.0
    eq_prev = 1.0
    open_: Dict[str, Pos] = {}
    pend: List[Dict] = []                    # A / C limit orders
    queue: List[Tuple[str, int]] = []        # B: (sym, direction) market orders for today's open
    trades: List[Dict] = []
    equity: Dict[str, float] = {}
    skipped = {'cap': 0, 'busy': 0, 'filter': 0, 'cancelled': 0, 'expired': 0}

    def cur_risk_frac(E: float) -> float:
        tot = 0.0
        for p in open_.values():
            tot += max(0.0, p.d * (p.entry - p.stop) + p.cost) / p.rpx * p.amt
        return tot / E

    def close_pos(p: Pos, px: float, date: str, i: int, why: str):
        nonlocal eq_closed
        r = (p.d * (px - p.entry) - p.cost) / p.rpx
        eq_closed += r * p.amt
        trades.append({'sym': p.sym, 'kind': p.kind, 'tf': p.tf, 'd': p.d, 'in': p.date_in, 'out': date, 'entry': p.entry,
                       'stop': p.stop0, 'exit': px, 'R': r, 'why': why, 'bars': i - p.i_in, 'lev': p.lev, 'mfe': p.mfe})
        del open_[p.sym]

    def open_pos(sym: str, d: int, entry: float, stop: float, target: Optional[float], i: int, date: str, tf: str = '') -> Optional[Pos]:
        c = cost[sym]
        rpx = d * (entry - stop) + c
        if rpx <= 0:
            return None
        if sym in open_:
            skipped['busy'] += 1
            return None
        if cur_risk_frac(eq_prev) + risk > cap + 1e-9:
            skipped['cap'] += 1
            return None
        amt = risk * eq_prev
        p = Pos(sym, d, entry, stop, stop, target, c, rpx, amt, i, date, kind, tf)
        p.lev = risk * entry / rpx
        open_[sym] = p
        return p

    for date in alld:
        order = sorted((s for s in syms if date in mk[s].idx), key=lambda s: _h(date, s))
        # 1. B market entries at today's open
        if queue:
            q, queue = queue, []
            for s, d in sorted(q, key=lambda t: _h(date, t[0])):
                m = mk[s]
                if date not in m.idx:
                    continue
                i = m.idx[date]
                sg = i - 1
                a = m.atr[sg]
                if np.isnan(a) or a <= 0:
                    continue
                entry = m.o[i]
                open_pos(s, d, entry, entry - d * ATR_MULT * a, None, i, date)
        # 2. open positions on today's bar (levels known at the previous close)
        for s in order:
            p = open_.get(s)
            if p is None:
                continue
            m = mk[s]
            i = m.idx[date]
            _manage(p, m, i, date, False, close_pos)
        # 3. pending limit orders (processed in a pseudo-random daily order so the cap does not favour a symbol)
        if pend:
            keep = []
            for o in sorted(pend, key=lambda o: (_h(date, o['sym']), o['zid'])):
                s = o['sym']
                m = mk[s]
                if date not in m.idx:
                    keep.append(o)
                    continue
                i = m.idx[date]
                if date > o['exp']:
                    skipped['expired'] += 1
                    continue
                d = o['d']
                hit = (m.l[i] <= o['entry']) if d > 0 else (m.h[i] >= o['entry'])
                if hit and not (use_filter and not trend_ok(m, i - 1, d)):
                    p = open_pos(s, d, o['entry'], o['stop'], o['target'] if use_target else None, i, date, o['tf'])
                    if p is not None:
                        _manage(p, m, i, date, not fillbar_target, close_pos)
                    continue                     # filled (or skipped for cap / busy): the order is done
                if hit:
                    skipped['filter'] += 1       # C: the trend disagrees today; the order stays while the zone lives
                tgt_first = (m.h[i] >= o['target']) if d > 0 else (m.l[i] <= o['target'])
                removed = (m.c[i] < o['distal']) if d > 0 else (m.c[i] > o['distal'])
                if tgt_first or removed:
                    skipped['cancelled'] += 1
                    continue
                keep.append(o)
            pend = keep
        # 4. close of the day: trailing levels, mark to market, new signals
        mtm = 0.0
        for s, p in list(open_.items()):
            m = mk[s]
            if date not in m.idx:
                continue
            i = m.idx[date]
            if use_trail:                                             # the 20-day trailing stop for tomorrow
                lv = m.don_lo[i] if p.d > 0 else m.don_hi[i]
                if not np.isnan(lv):
                    p.trail = lv if p.trail is None else (max(p.trail, lv) if p.d > 0 else min(p.trail, lv))
                    p.stop = max(p.stop0, p.trail) if p.d > 0 else min(p.stop0, p.trail)
            fav = p.d * (m.h[i] - p.entry) if p.d > 0 else p.d * (m.l[i] - p.entry)
            p.mfe = max(p.mfe, fav / p.rpx)
            if use_target and i - p.i_in >= HOLD_MAX:
                close_pos(p, m.c[i], date, i, 'time')
        for s, p in open_.items():
            m = mk[s]
            i = m.idx.get(date)
            if i is not None:
                p.lastc = m.c[i]
            mtm += (p.d * ((p.lastc or p.entry) - p.entry) - p.cost) / p.rpx * p.amt
        eq_prev = eq_closed + mtm
        equity[date] = eq_prev
        if kind == 'B':
            for s in order:
                m = mk[s]
                i = m.idx[date]
                if s in open_ or any(q[0] == s for q in queue) or np.isnan(m.sma[i]) or np.isnan(m.atr[i]) or np.isnan(m.hi_prev[i]):
                    continue
                if m.c[i] > m.sma[i] and m.c[i] > m.hi_prev[i]:
                    queue.append((s, 1))
                elif m.c[i] < m.sma[i] and m.c[i] < m.lo_prev[i]:
                    queue.append((s, -1))
        else:
            for o in by_sig.get(date, []):
                if o['sym'] in open_:
                    skipped['busy'] += 1
                    continue
                exp = (dt.date.fromisoformat(date) + dt.timedelta(days=EXPIRY_DAYS[o['tf']])).isoformat()
                pend.append({**o, 'exp': exp})
    last = alld[-1]
    openl = [{'sym': p.sym, 'd': p.d, 'in': p.date_in, 'R': (p.d * (mk[p.sym].c[mk[p.sym].idx[last]] - p.entry) - p.cost) / p.rpx}
             for p in open_.values() if last in mk[p.sym].idx]
    return {'trades': trades, 'equity': equity, 'open': openl, 'skipped': skipped}


def _manage(p: Pos, m: Mkt, i: int, date: str, fill_bar: bool, close_pos) -> None:
    """Apply one bar to an open position: gap through the stop (exit at the open), the stop (stop first), then the target.
    On the fill bar of a limit order the target is not credited (fill_bar=True) unless the optimistic sensitivity run says so."""
    d = p.d
    o, h, l = m.o[i], m.h[i], m.l[i]
    if (o <= p.stop) if d > 0 else (o >= p.stop):
        close_pos(p, o, date, i, 'gap')
    elif (l <= p.stop) if d > 0 else (h >= p.stop):
        close_pos(p, p.stop, date, i, 'trail' if p.stop != p.stop0 else 'stop')
    elif not fill_bar and p.target is not None and ((h >= p.target) if d > 0 else (l <= p.target)):
        close_pos(p, p.target, date, i, 'target')
