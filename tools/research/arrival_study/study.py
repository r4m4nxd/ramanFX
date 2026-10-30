"""Historical study of the Raja ARRIVAL rules (arrival.py = the bot's arrival.ts, incl. the Oct 2026 stop rule).

    python tools/research/arrival_study/study.py                 # GitHub Actions (arrival-study.yml): OANDA + Alpaca
    python tools/research/arrival_study/study.py --selftest      # synthetic bars, no network (code-path check only)

Universe: every FX scanner instrument (OANDA: D1 since 2010, H4 the last 3 years, W1 / MN since 2005, H1 the last 2
years for the D1 confirmations) + the most liquid scanner stocks (Alpaca daily since 2016 -> W1 / MN).

No look-ahead. Candidate arrival zones come from one pass over the full history (zone formation, the line the leg-out
crossed and the opposite zones it removed only use bars up to the leg-out; Arrival.known_bar = the bar on which the
arrival became true). Each candidate is then RE-READ at that bar with the live code (arrival.arrival_tf on the closed
bars of that moment, the higher TF's bars closed by then, the live price = that close): it counts only when the live
rule names it the CURRENT arrival there, and its plan (target, ceiling / extension, stop rule, R:R) is the one the bot
would have shown at that moment.

Trade: a limit at the proximal, placed when the arrival bar closes, filled on the first touch within EXPIRY (20)
entry-TF bars; cancelled before the fill when a close goes beyond the distal (zone removed) or the target trades
first (missed). Stop = the stop rule, target = the plan's tp (capped / extended / plain). Simulated on finer bars
(FX D1 / W1 / MN and stocks: daily; FX H4: H4; confirmations: the LTF itself). Conservative: a bar that touches both
the stop and the target is a loss; the fill bar can stop out but never reach the target; a gap through the stop exits
at the open. Costs: FX one typical spread per trade, stocks 10 bps round trip (both as R). A trade still open after
HOLD (100 entry-TF bars, confirmations 200 LTF bars) or at the end of the data is 'open' (marked to the last close,
not in the win rate). 1R = the planned risk (entry - stop).

Realignment + LTF confirmation (where the LTF data allows): after a verified arrival with a realignment area, the
first LTF arrival of the other side overlapping the area, leg-out after the TF arrival's, known within 30 TF bars and
not removed by then = the confirmation trade: entry its proximal, stop = the stop rule with the area as the host,
target = the TF's newest real pivot at the arrival (as the alert's area record keeps it).

Loose vs strict: 'loose' = every arrival (the live rule); 'strict (at a valley)' = the arrival zone's valley (demand)
/ peak (supply) is also the extreme of the 20 bars before its base (the zone sits AT the turning valley / peak, not
a continuation base on the way).

Outputs (--out): Arrival_Study.md, trades.json, equity.png, winrate_tf.png, r_by_group.png.
"""
from __future__ import annotations

import argparse
import bisect
import csv
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
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
STOCK = os.path.join(ROOT, 'tools', 'stock_scanner')
FX = os.path.join(ROOT, 'tools', 'fx_scanner')
for _p in (STOCK, FX, os.path.join(FX, 'fixtures')):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import arrival as A  # noqa: E402
import zones as Z  # noqa: E402
import zvtrend as ZVT  # noqa: E402

EXPIRY = 20          # entry-TF bars a limit lives
HOLD = 100           # entry-TF bars a trade lives
WATCH = 30           # TF bars a realignment area waits for its LTF confirmation
LTF_EXPIRY, LTF_HOLD = 20, 200
WIN = 420            # closed bars handed to the live reading (zv lookback 200 + the detect window)
STRICT_N = 20
STOCK_COST_BPS = 10.0
FX_TFS = {'MN': ('2005-01-01', '3M'), 'W1': ('2005-01-01', 'MN'), 'D1': ('2010-01-01', 'W1'), 'H4': (None, 'D1')}
FX_SIM = {'MN': 'D1', 'W1': 'D1', 'D1': 'D1', 'H4': 'H4'}
FX_LTF = {'MN': 'D1', 'W1': 'H4', 'D1': 'H1'}            # confirmations the data allows (H4 -> M15: no history)
STOCK_TFS = {'W1': 'MN', 'MN': '3M'}
STOCK_LTF = {'MN': 'D1'}                                 # W1 -> H4: no intraday history for stocks


# ---- time-indexed bars -------------------------------------------------------------------------------------------------
class TF:
    """Bars of one TF, oldest first, with each bar's close time (comparable strings)."""

    def __init__(self, tf: str, bars: List[Z.Bar], ends: List[str]):
        self.tf, self.bars, self.ends = tf, bars, ends

    def __len__(self): return len(self.bars)

    def closed(self, t: str) -> int:
        """Number of bars closed by time t."""
        return bisect.bisect_right(self.ends, t)


def _p(lbl: str) -> dt.datetime:
    return dt.datetime.strptime(lbl[:16], '%Y-%m-%dT%H:%M')


def fx_end(lbl: str, tf: str) -> str:
    t = _p(lbl if len(lbl) > 10 else lbl + 'T00:00')
    if tf in ('M15', 'H1', 'H4'):
        t += dt.timedelta(minutes={'M15': 15, 'H1': 60, 'H4': 240}[tf])
    elif tf == 'D1':
        t += dt.timedelta(days=1)
    elif tf == 'W1':
        t += dt.timedelta(days=7)
    elif tf in ('MN', '3M'):
        k = 1 if tf == 'MN' else 3
        m = t.month - 1 + k
        t = t.replace(year=t.year + m // 12, month=m % 12 + 1, day=1)
    return t.strftime('%Y-%m-%dT%H:%M')


def fx_tf(tf: str, bars: List[Z.Bar]) -> TF:
    return TF(tf, bars, [fx_end(b.d, tf) for b in bars])


def stock_tfs(daily: List[Z.Bar]) -> Dict[str, TF]:
    """Daily -> W1 / MN / 3M (complete buckets only); a bucket closes with its last session (end = 'YYYY-MM-DD')."""
    out = {'D1': TF('D1', daily, [b.d[:10] for b in daily])}
    keys = {'W1': lambda d: d.isocalendar()[:2], 'MN': lambda d: (d.year, d.month), '3M': lambda d: (d.year, (d.month - 1) // 3)}
    for tf, key in keys.items():
        agg: List[Z.Bar] = []
        ends: List[str] = []
        cur = None
        for b in daily:
            k = key(dt.date.fromisoformat(b.d[:10]))
            if k != cur:
                agg.append(Z.Bar(b.d[:10], b.o, b.h, b.l, b.c))
                ends.append(b.d[:10])
                cur = k
            else:
                x = agg[-1]
                agg[-1] = Z.Bar(x.d, x.o, max(x.h, b.h), min(x.l, b.l), b.c)
                ends[-1] = b.d[:10]
        if agg:                                            # the newest bucket may still be forming: dropped
            agg, ends = agg[:-1], ends[:-1]
        out[tf] = TF(tf, agg, ends)
    return out


# ---- simulation ------------------------------------------------------------------------------------------------------
def simulate(d: int, entry: float, stop: float, tp: float, distal: float, sim: TF, t0: str, expire: str, hold_bars: int,
             entry_tf: TF, cost: float) -> Dict:
    """One limit order placed at time t0 (see the module doc). Returns outcome / R / timings / MFE / MAE (R)."""
    risk = (entry - stop) * d
    out = {'outcome': 'cancelled', 'why': 'expired', 'R': None, 'fill_t': None, 'exit_t': None, 'bars_to_fill': None,
           'bars_in_trade': None, 'mfe': None, 'mae': None}
    if risk <= 0 or (tp - entry) * d <= 0:
        out['why'] = 'bad levels'
        return out
    i = sim.closed(t0)
    fill_i = None
    while i < len(sim):
        if sim.ends[i] > expire:
            return out
        b = sim.bars[i]
        hit_tp = b.h >= tp if d > 0 else b.l <= tp
        touch = b.l <= entry if d > 0 else b.h >= entry
        if touch:
            fill_i = i
            break
        if hit_tp:
            out['why'] = 'missed (target first)'
            return out
        if (b.c < distal) if d > 0 else (b.c > distal):
            out['why'] = 'zone removed'
            return out
        i += 1
    if fill_i is None:
        out['why'] = 'no data'
        return out
    out['fill_t'] = sim.ends[fill_i]
    ei = entry_tf.closed(t0)
    out['bars_to_fill'] = max(0, entry_tf.closed(sim.ends[fill_i]) - ei) + 1
    ej = entry_tf.closed(sim.ends[fill_i])
    hold_end = entry_tf.ends[ej + hold_bars] if ej + hold_bars < len(entry_tf) else None
    mfe = mae = 0.0
    c = cost / risk
    for j in range(fill_i, len(sim)):
        b = sim.bars[j]
        fav = (b.h - entry) * d if d > 0 else (entry - b.l)
        adv = (entry - b.l) if d > 0 else (b.h - entry)
        if j == fill_i:   # the fill bar: only the part after the touch is unknown -> stop only
            fav = 0.0
        stop_hit = b.l <= stop if d > 0 else b.h >= stop
        tp_hit = (b.h >= tp if d > 0 else b.l <= tp) and j > fill_i
        mae = max(mae, adv / risk)
        if stop_hit:
            px = stop if j == fill_i else ((min(b.o, stop) if d > 0 else max(b.o, stop)))
            out.update(outcome='loss', why='stop', R=(px - entry) * d / risk - c, exit_t=sim.ends[j])
            break
        mfe = max(mfe, fav / risk)
        if tp_hit:
            out.update(outcome='win', why='target', R=(tp - entry) * d / risk - c, exit_t=sim.ends[j])
            break
        if hold_end is not None and sim.ends[j] >= hold_end:
            out.update(outcome='open', why='time', R=(b.c - entry) * d / risk - c, exit_t=sim.ends[j])
            break
    else:
        b = sim.bars[-1]
        out.update(outcome='open', why='end of data', R=(b.c - entry) * d / risk - c, exit_t=sim.ends[-1])
    out['mfe'], out['mae'] = round(mfe, 3), round(min(mae, 99.0), 3)
    out['bars_in_trade'] = entry_tf.closed(out['exit_t']) - ej + 1
    return out


# ---- one instrument --------------------------------------------------------------------------------------------------
def _series(tfd: TF, k: int, price: Optional[float] = None, win: int = WIN) -> Z.Series:
    return A.series_of(tfd.bars[max(0, k - win):k], tfd.tf, price)


def strict_at_valley(S: Z.Series, a: A.Arrival) -> bool:
    z = a.zone
    j0 = z.leg_bar + z.base_n + ZVT.ZV['swing'] + 1
    prior = range(j0, min(j0 + STRICT_N, S.n))
    if len(prior) < STRICT_N // 2:
        return False
    return a.valley <= min(S.L[j] for j in prior) if a.dir > 0 else a.valley >= max(S.H[j] for j in prior)


def study_tf(sym: str, market: str, tf: str, data: Dict[str, TF], htf: Optional[str], ltf: Optional[str], sim_tf: str,
             spread: float, p: Dict, start: Optional[str]) -> Tuple[List[Dict], Dict]:
    """Arrival + confirmation trades of one instrument / TF."""
    T = data[tf]
    cnt = {'candidates': 0, 'verified': 0, 'not_current': 0, 'no_target': 0, 'realign': 0, 'ltf_checked': 0, 'confirmed': 0}
    if len(T) < 60:
        return [], cnt
    S = A.series_of(T.bars, tf)
    pfull = {**p, 'lookback': 10 ** 6}
    _, arrs = A.find_arrivals(S, tf, pfull)
    n = len(T)
    H = data.get(htf) if htf else None
    L = data.get(ltf) if ltf else None
    sim = data[sim_tf]
    lt_arrs = None
    trades = []
    for a in sorted(arrs, key=lambda x: -x.known_bar):
        k = n - a.known_bar + 1             # bars closed when the arrival became true (shift s = index n - s)
        t0 = T.ends[k - 1]
        if start and t0 < start:
            continue
        cnt['candidates'] += 1
        price = T.bars[k - 1].c
        St = _series(T, k)
        Ht = None
        if H is not None:
            hk = H.closed(t0)
            if hk >= 10:
                Ht = _series(H, hk, price, 300)
        sp = spread if market == 'fx' else A.stock_spread(price)
        r = A.arrival_tf(St, tf, price, p, Ht, None, htf=htf if Ht is not None else None, ltf=ltf, spread=sp)
        cur = r.current
        if cur is None or cur.dir != a.dir or cur.t_leg != a.t_leg:
            cnt['not_current'] += 1
            continue
        cnt['verified'] += 1
        pl = r.plan
        base = {'sym': sym, 'market': market, 'tf': tf, 'dir': a.dir, 'side': 'demand' if a.dir > 0 else 'supply',
                't': t0, 'removed': len(cur.removed), 'strict': strict_at_valley(St, cur),
                'target_kind': 'capped' if pl.capped else ('extended' if pl.extended else ('plain' if pl.tp is not None else 'none')),
                'nested': pl.host is not None, 'basis': pl.basis, 'entry': pl.entry, 'stop': pl.stop, 'tp': pl.tp,
                'rr': pl.rr, 'buffer': pl.buffer, 'kind': 'arrival', 'realign': pl.realign is not None}
        if pl.realign is not None:
            cnt['realign'] += 1
        if pl.tp is None:
            cnt['no_target'] += 1
            trades.append({**base, 'outcome': 'no target', 'R': None})
        else:
            cost = sp if market == 'fx' else pl.entry * STOCK_COST_BPS / 1e4
            expire = T.ends[min(k - 1 + EXPIRY, n - 1)]
            res = simulate(a.dir, pl.entry, pl.stop, pl.tp, cur.zone.dist, sim, t0, expire, HOLD, T, cost)
            old = simulate(a.dir, pl.entry, cur.zone.dist, pl.tp, cur.zone.dist, sim, t0, expire, HOLD, T, cost)
            fx2 = simulate(a.dir, pl.entry, pl.stop, pl.entry + 2 * (pl.entry - pl.stop), cur.zone.dist, sim, t0, expire, HOLD, T, cost)
            trades.append({**base, **res, 'old_R': old['R'], 'old_outcome': old['outcome'], 'fix2_R': fx2['R'], 'fix2_outcome': fx2['outcome']})
        # realignment + LTF confirmation
        if pl.realign is None or L is None or len(L) < 60 or r.swing is None:
            continue
        if lt_arrs is None:
            LS = A.series_of(L.bars, ltf)
            _, la = A.find_arrivals(LS, ltf, {**p, 'lookback': 10 ** 6})
            lt_arrs = (LS, la)
        LS, la = lt_arrs
        nl = len(L)
        if nl and L.ends[0] > t0:
            continue                         # no LTF history at that time
        cnt['ltf_checked'] += 1
        ar = pl.realign
        lo_, hi_ = ar.lo, ar.hi
        watch_end = T.ends[min(k - 1 + WATCH, n - 1)]
        best = None
        for c in la:
            ci = nl - c.known_bar           # index of the LTF bar on which it became true
            ct = L.ends[ci]
            if not (t0 < ct <= watch_end) or c.dir != -a.dir:
                continue
            if A.t16(c.t_leg) < A.t16(cur.t_leg) or c.zone.lo > hi_ or c.zone.hi < lo_:
                continue
            if c.zone.removed and nl - c.zone.removed_bar <= ci:
                continue
            if best is None or ct < best[1]:
                best = (c, ct, ci + 1)
        trig = {**base, 'kind': 'confirm', 'tf': f'{tf}->{ltf}', 'dir': -a.dir, 'side': 'demand' if a.dir < 0 else 'supply'}
        if best is None:
            continue
        c, ct, ck = best
        cnt['confirmed'] += 1
        LSt = _series(L, ck, None, 300)
        st = A.stop_of(LSt, c.dir, c.valley, ar.dist, sp)
        tgt = r.swing
        cprice = L.bars[ck - 1].c
        ccost = sp if market == 'fx' else c.zone.prox * STOCK_COST_BPS / 1e4
        rr = A.rr(c.zone.prox, st.stop, tgt)
        row = {**trig, 't': ct, 'removed': len(c.removed), 'strict': False, 'target_kind': 'swing', 'nested': True,
               'basis': st.basis, 'entry': c.zone.prox, 'stop': st.stop, 'tp': tgt, 'rr': rr, 'buffer': st.buffer,
               'in_area': lo_ <= cprice <= hi_}
        if rr is None:
            trades.append({**row, 'outcome': 'no target', 'R': None})
            continue
        res = simulate(c.dir, c.zone.prox, st.stop, tgt, c.zone.dist, L, ct, L.ends[min(ck - 1 + LTF_EXPIRY, nl - 1)],
                       LTF_HOLD, L, ccost)
        old = simulate(c.dir, c.zone.prox, c.zone.dist, tgt, c.zone.dist, L, ct, L.ends[min(ck - 1 + LTF_EXPIRY, nl - 1)],
                       LTF_HOLD, L, ccost)
        trades.append({**row, **res, 'old_R': old['R'], 'old_outcome': old['outcome']})
    return trades, cnt


def study_instrument(job: Dict) -> Dict:
    t0 = time.time()
    out = {'sym': job['sym'], 'trades': [], 'counts': {}, 'error': None}
    try:
        data = job['data']
        for tf, (start, htf) in job['tfs'].items():
            if tf not in data:
                continue
            ltf = job['ltf'].get(tf)
            tr, cnt = study_tf(job['sym'], job['market'], tf, data, htf, ltf if ltf in data else None, job['sim'][tf],
                               job['spread'], job['p'], start)
            out['trades'] += tr
            out['counts'][tf] = cnt
    except Exception as e:  # noqa: BLE001
        import traceback
        out['error'] = f'{type(e).__name__}: {str(e)[:160]} | {traceback.format_exc()[-300:]}'
    out['secs'] = round(time.time() - t0, 1)
    return out


def validate(job: Dict, tf: str = 'D1', last: int = 600) -> Dict:
    """No-look-ahead check: the live reading at EVERY closed bar of the last `last` bars (first time each arrival is
    current) vs the candidate pass (full history + known_bar). Agreement = same arrival, same bar."""
    T = job['data'].get(tf)
    if T is None or len(T) < last + 300:
        return {}
    n, p = len(T), job['p']
    _, arrs = A.find_arrivals(A.series_of(T.bars, tf), tf, {**p, 'lookback': 10 ** 6})
    lo = n - last
    cand = {(a.t_leg, a.dir): n - a.known_bar + 1 for a in arrs if n - a.known_bar + 1 > lo}
    seen: Dict = {}
    for k in range(lo, n + 1):
        r = A.arrival_tf(_series(T, k), tf, T.bars[k - 1].c, p, None, None, htf=None, ltf=None)
        if r.current is not None:
            seen.setdefault((r.current.t_leg, r.current.dir), k)
    walk = {k: v for k, v in seen.items() if v > lo}
    same = sum(1 for k, v in walk.items() if cand.get(k) == v)
    return {'sym': job['sym'], 'tf': tf, 'bars': last, 'walk': len(walk), 'cand': len(cand), 'same': same,
            'walk_only': len([k for k in walk if k not in cand]), 'cand_only': len([k for k in cand if k not in walk])}


# ---- data ------------------------------------------------------------------------------------------------------------
def fx_jobs(max_n: int, log=print) -> Tuple[List[Dict], List[str]]:
    import data as SD
    import fxcfg as C
    import fx_backtest as BT
    import oanda as O
    import watchlist as W
    import fxscan as X
    SD.set_budget(150)
    O.token()
    instruments, src = O.account_instruments(log=log)
    known = {i['name'] for i in instruments} if src != 'fallback' else None
    wl = W.load(known)
    uni = [i for i in X.universe(instruments, wl) if i['name'] != 'USDX' and not i.get('source')]
    if max_n:
        uni = uni[:max_n]
    today = dt.date.today()
    h4_from = (today - dt.timedelta(days=int(3.2 * 365))).isoformat() + 'T00:00:00Z'
    h1_from = (today - dt.timedelta(days=int(2.1 * 365))).isoformat() + 'T00:00:00Z'
    jobs, errors = [], []
    for i in uni:
        try:
            raw = {tf: BT.fetch_history(i['name'], tf, log=log) for tf in ('D1', 'W1', 'MN')}
            h4 = BT.fetch_history(i['name'], 'H4', log=log)
            h1 = BT.fetch_history(i['name'], 'H1', start=h1_from, log=log)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{i['name']}: {type(e).__name__}: {str(e)[:100]}")
            log(f"  {i['name']}: fetch failed ({errors[-1]})")
            continue
        bars = {tf: [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in rows] for tf, rows in raw.items()}
        h4_keep = (today - dt.timedelta(days=int(3.2 * 365) + 150)).isoformat()   # + warm-up before the H4 window
        bars['H4'] = [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in h4 if r[0] >= h4_keep]
        sps = [r[8] - r[4] for r in h4[-3000:] if len(r) >= 9 and r[8] > r[4]]
        spread = statistics.median(sps) if sps else 0.0
        bars['H1'] = [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in h1 if r[0] >= h1_from[:16]]
        if bars['MN']:
            bars['3M'] = Z.to_quarters(bars['MN'])
        data = {tf: fx_tf(tf, b) for tf, b in bars.items() if b}
        tfs = {tf: (s if s else h4_from[:16], h) for tf, (s, h) in FX_TFS.items()}
        jobs.append({'sym': i['sym'], 'market': 'fx', 'cls': i.get('cls'), 'data': data, 'tfs': tfs, 'ltf': FX_LTF,
                     'sim': FX_SIM, 'spread': spread, 'p': A.FX_P})
    return jobs, errors


def stock_jobs(n: int, log=print) -> Tuple[List[Dict], List[str]]:
    import data as SD
    path = os.path.join(STOCK, 'top_liquid.csv')
    with open(path) as f:
        rows = [r for r in csv.DictReader(line for line in f if not line.startswith('#'))]
    syms = [r['symbol'] for r in rows if r.get('symbol') and r['symbol'].replace('.', '').isalpha()][:n]
    end = dt.date.today().isoformat()
    got = SD.alpaca_bars(syms, '2005-01-01', end, log=log)
    jobs, errors = [], []
    for s in syms:
        b = got.get(s) or got.get(SD.alpaca_symbol(s)) or []
        if len(b) < 400:
            errors.append(f'{s}: {len(b)} daily bars')
            continue
        data = stock_tfs(b)
        jobs.append({'sym': s, 'market': 'stock', 'data': data, 'tfs': {tf: (None, h) for tf, h in STOCK_TFS.items()},
                     'ltf': STOCK_LTF, 'sim': {'W1': 'D1', 'MN': 'D1'}, 'spread': 0.0, 'p': Z.RAJA})
    return jobs, errors


def synthetic_jobs() -> List[Dict]:
    import synth_fx
    jobs = []
    for k, (seed, px) in enumerate(((15, 1.10), (827, 185.0), (636, 3900.0))):
        h4 = synth_fx.h4_walk(seed, n=16000, start=px)
        bars = {tf: synth_fx.aggregate(h4, tf) for tf in ('D1', 'W1', 'MN')}
        bars['H4'] = h4
        bars['H1'] = synth_fx.split_h1(h4[-3000:], seed)
        bars['3M'] = Z.to_quarters(bars['MN'])
        data = {tf: fx_tf(tf, b) for tf, b in bars.items()}
        jobs.append({'sym': f'SYN{k}', 'market': 'fx', 'data': data,
                     'tfs': {'MN': (None, '3M'), 'W1': (None, 'MN'), 'D1': (None, 'W1'), 'H4': (h4[-4000].d, 'D1')},
                     'ltf': FX_LTF, 'sim': FX_SIM, 'spread': px * 1e-4, 'p': A.FX_P})
    return jobs


# ---- statistics ------------------------------------------------------------------------------------------------------
def boot_ci(rs: List[float], n: int = 1000, seed: int = 7) -> Optional[Tuple[float, float]]:
    if len(rs) < 20:
        return None
    rnd = random.Random(seed)
    ms = sorted(sum(rnd.choice(rs) for _ in rs) / len(rs) for _ in range(n))
    return ms[int(0.025 * n)], ms[int(0.975 * n) - 1]


def stats(ts: List[Dict], key: str = 'R', okey: str = 'outcome') -> Dict:
    filled = [t for t in ts if t.get(okey) in ('win', 'loss', 'open') and t.get(key) is not None]
    closed = [t for t in filled if t[okey] in ('win', 'loss')]
    wins = [t for t in closed if t[okey] == 'win']
    rs = [t[key] for t in closed]
    allr = [t[key] for t in filled]
    gw, gl = sum(r for r in rs if r > 0), -sum(r for r in rs if r < 0)
    tf_ = [t['bars_to_fill'] for t in filled if t.get('bars_to_fill') is not None]
    ti = [t['bars_in_trade'] for t in closed if t.get('bars_in_trade') is not None]
    return {'n': len(ts), 'filled': len(filled), 'closed': len(closed), 'open': len(filled) - len(closed),
            'fill_rate': len(filled) / len(ts) if ts else None,
            'win_rate': len(wins) / len(closed) if closed else None,
            'avg_R': sum(rs) / len(rs) if rs else None, 'avg_R_all': sum(allr) / len(allr) if allr else None,
            'sum_R': sum(rs), 'pf': gw / gl if gl > 0 else None, 'ci': boot_ci(rs),
            'avg_win_R': sum(t[key] for t in wins) / len(wins) if wins else None,
            'mfe': statistics.median([t['mfe'] for t in filled if t.get('mfe') is not None]) if filled else None,
            'mae': statistics.median([t['mae'] for t in filled if t.get('mae') is not None]) if filled else None,
            'fill_bars': statistics.median(tf_) if tf_ else None, 'trade_bars': statistics.median(ti) if ti else None}


def _f(v, fmt='{:.2f}') -> str:
    return '–' if v is None else fmt.format(v)


def table(title: str, groups: Sequence[Tuple[str, List[Dict]]], key: str = 'R', okey: str = 'outcome') -> List[str]:
    out = [f'**{title}**', '', '| group | arrivals | filled | closed | win % | avg R | 95% CI | PF | sum R | med. bars to fill | med. bars in trade | med. MFE / MAE (R) |',
           '|---|---|---|---|---|---|---|---|---|---|---|---|']
    for name, ts in groups:
        if not ts:
            continue
        s = stats(ts, key, okey)
        ci = f"{s['ci'][0]:+.2f} … {s['ci'][1]:+.2f}" if s['ci'] else 'n < 20'
        out.append(f"| {name} | {s['n']} | {s['filled']} | {s['closed']} | {_f(s['win_rate'] and 100 * s['win_rate'], '{:.0f}')} | "
                   f"{_f(s['avg_R'], '{:+.2f}')} | {ci} | {_f(s['pf'])} | {_f(s['sum_R'], '{:+.1f}')} | {_f(s['fill_bars'], '{:.0f}')} | "
                   f"{_f(s['trade_bars'], '{:.0f}')} | {_f(s['mfe'])} / {_f(s['mae'])} |")
    return out + ['']


def groups_by(ts: List[Dict], key, order=None) -> List[Tuple[str, List[Dict]]]:
    g: Dict[str, List[Dict]] = {}
    for t in ts:
        g.setdefault(str(key(t)), []).append(t)
    ks = [k for k in (order or sorted(g)) if k in g]
    return [(k, g[k]) for k in ks]


TF_ORDER = ['MN', 'W1', 'D1', 'H4']


def report(trades: List[Dict], meta: Dict) -> str:
    arr = [t for t in trades if t['kind'] == 'arrival']
    conf = [t for t in trades if t['kind'] == 'confirm']
    tradable = [t for t in arr if t.get('outcome') != 'no target']
    fx = [t for t in tradable if t['market'] == 'fx']
    st = [t for t in tradable if t['market'] == 'stock']
    L = ['# Arrival study (Raja arrival rules, walk-forward on full history)', '',
         f"Generated {meta['generated']} by `tools/research/arrival_study/study.py` ({meta['how']}). "
         f"{meta['n_fx']} FX instruments (OANDA), {meta['n_stock']} stocks (Alpaca, daily since 2016). "
         f"Runtime {meta['minutes']:.0f} min." + (' **PARTIAL** (time budget).' if meta.get('partial') else ''), '',
         '## Method (short)', '',
         '- Rules = the live code (`tools/stock_scanner/arrival.py`, parity with the bot\'s `arrival.ts`): an arrival = a zone '
         'whose leg-out crosses the TF trend line against it and removes >= 1 opposite zone (LOOSE, the live rule). Each '
         'candidate is re-read at the bar it became true with only the bars closed by then (HTF too) and counts only when '
         'the live rule names it the current arrival; its plan (target / ceiling / extension, the new stop rule, R:R) is '
         'the one the bot showed at that moment.',
         f'- Trade: limit at the proximal, filled within {EXPIRY} entry-TF bars (cancelled when a close removes the zone or '
         f'the target trades first); stop = the stop rule (buffer = max(0.1 ATR14, spread); 2 buffers beyond a same-side HTF '
         f'zone the entry zone sits in, else 1 buffer beyond the base valley / peak); target = the plan\'s TP. Simulated on '
         f'daily bars (FX H4 entries: H4), a bar touching stop and target = loss, the fill bar never reaches the target, '
         f'gaps exit at the open. Costs: FX one typical spread, stocks 10 bps (in R). Open after {HOLD} entry-TF bars or '
         'at the end of the data = open (not in win %; marked in "avg R all").',
         f'- Realignment + LTF confirmation (FX D1->1H for the last ~2 years, W1->4H, MN->D1; stocks MN->D1): the first '
         f'LTF arrival of the other side inside the realignment area within {WATCH} TF bars; stop = the stop rule with the '
         'area as host; target = the TF\'s last real pivot.',
         f'- Strict ("at a valley"): the arrival zone\'s valley / peak is also the extreme of the {STRICT_N} bars before '
         'its base.', '- 1R = entry - stop. Win % over closed trades. CI = bootstrap 95% of avg R (closed trades).', '']
    s_all = stats(tradable)
    s_conf = stats(conf)
    L += ['## Headline', '',
          f"- Verified arrivals: **{len(arr)}** ({len(tradable)} with a target; {len(arr) - len(tradable)} had none). "
          f"Filled: {s_all['filled']} ({_f(s_all['fill_rate'] and 100 * s_all['fill_rate'], '{:.0f}')}%), closed {s_all['closed']}.",
          f"- Arrival trades: win rate **{_f(s_all['win_rate'] and 100 * s_all['win_rate'], '{:.0f}')}%**, avg "
          f"**{_f(s_all['avg_R'], '{:+.2f}')}R** per closed trade (95% CI {_f(s_all['ci'] and s_all['ci'][0], '{:+.2f}')} … "
          f"{_f(s_all['ci'] and s_all['ci'][1], '{:+.2f}')}), profit factor {_f(s_all['pf'])}, total {_f(s_all['sum_R'], '{:+.0f}')}R.",
          f"- Confirmation trades (realignment + LTF arrival): {s_conf['n']} found, {s_conf['closed']} closed, win rate "
          f"{_f(s_conf['win_rate'] and 100 * s_conf['win_rate'], '{:.0f}')}%, avg {_f(s_conf['avg_R'], '{:+.2f}')}R.", '']
    L += ['## Conclusions (plain English)', '', '<!--CONCLUSIONS-->', '']
    L += ['## Arrival trades', '']
    L += table('By timeframe (FX + stocks)', groups_by(tradable, lambda t: f"{t['market']} {t['tf']}",
                                                      [f'{m} {tf}' for m in ('fx', 'stock') for tf in TF_ORDER]))
    L += table('FX vs stocks', groups_by(tradable, lambda t: t['market'], ['fx', 'stock']))
    L += table('Demand vs supply', groups_by(tradable, lambda t: f"{t['market']} {t['side']}"))
    L += table('Opposite zones removed', groups_by(tradable, lambda t: '1 removed' if t['removed'] == 1 else '2+ removed (strong)'))
    L += table('Target type', groups_by(tradable, lambda t: {'capped': 'capped below / above the HTF line', 'extended': 'extended to the HTF zone', 'plain': 'plain (same-TF weak zone)'}[t['target_kind']]))
    L += table('Nested in a same-side HTF zone (stop rule)', groups_by(tradable, lambda t: ('nested: stop beyond the HTF zone' if t['basis'] == 'htf' else 'nested, valley stop further') if t['nested'] else 'not nested: valley stop'))
    L += table('Loose (live rule) vs strict (at a valley)', [('loose: every arrival', tradable), ('strict: at a valley', [t for t in tradable if t['strict']]),
                                                           ('loose but not at a valley', [t for t in tradable if not t['strict']])])
    L += table('Strict vs loose by market', groups_by(tradable, lambda t: f"{t['market']} {'strict' if t['strict'] else 'not strict'}"))
    L += table('Stop rule vs the old stop (zone distal), same entries / targets', [('new stop rule', tradable)])
    L += table('', [('old stop = distal', tradable)], key='old_R', okey='old_outcome')
    L += table('Same entries / stops, fixed 2R target instead of the plan\'s target (is there an entry edge?)', [('plan target', tradable)])
    L += table('', [('fixed 2R target', tradable)], key='fix2_R', okey='fix2_outcome')
    L += table('Fixed 2R target by timeframe', groups_by(tradable, lambda t: f"{t['market']} {t['tf']}", [f'{m} {tf}' for m in ('fx', 'stock') for tf in TF_ORDER]), key='fix2_R', okey='fix2_outcome')
    L += table('Planned R:R bucket', groups_by(tradable, lambda t: '< 1' if (t['rr'] or 0) < 1 else '1-2' if t['rr'] < 2 else '2-4' if t['rr'] < 4 else '4+', ['< 1', '1-2', '2-4', '4+']))
    L += ['## Realignment + lower-TF confirmation trades', '']
    L += table('By TF pair', groups_by(conf, lambda t: f"{t['market']} {t['tf']}"))
    L += table('Stop basis', groups_by(conf, lambda t: t['basis']))
    L += table('Old stop (the LTF zone distal)', [('confirmations', conf)], key='old_R', okey='old_outcome')
    L += ['## Data / counts', '', '| instrument TF | candidates | verified current | not current at that bar | no target | with a realignment area | area with LTF data | LTF confirmation found |', '|---|---|---|---|---|---|---|---|']
    agg: Dict[str, Dict[str, int]] = {}
    for c in meta['counts']:
        for tf, x in c['counts'].items():
            k = f"{c['market']} {tf}"
            a = agg.setdefault(k, {})
            for kk, v in x.items():
                a[kk] = a.get(kk, 0) + v
    for k in sorted(agg):
        a = agg[k]
        L.append(f"| {k} | {a.get('candidates', 0)} | {a.get('verified', 0)} | {a.get('not_current', 0)} | {a.get('no_target', 0)} | "
                 f"{a.get('realign', 0)} | {a.get('ltf_checked', 0)} | {a.get('confirmed', 0)} |")
    L += ['', '**No-look-ahead check** (the live reading at every closed bar vs the candidate pass; same arrival on the '
          'same bar):', '', '| instrument | TF | bars walked | walk-forward arrivals | candidate pass | same arrival, same bar | walk only | candidates only |',
          '|---|---|---|---|---|---|---|---|']
    for v in meta.get('validate') or []:
        if 'error' in v:
            L.append(f"| {v['sym']} | error: {v['error']} | | | | | | |")
        else:
            L.append(f"| {v['sym']} | {v['tf']} | {v['bars']} | {v['walk']} | {v['cand']} | {v['same']} | {v['walk_only']} | {v['cand_only']} |")
    L += ['', '## Caveats', '',
          '- One random-free path per instrument; FX instruments are correlated (USD pairs move together), so the effective '
          'sample is smaller than the trade count. CIs assume independent trades: read them as optimistic.',
          '- Daily-bar simulation is conservative inside a bar (stop first). FX spread = the median of the last ~3000 H4 '
          'spreads (older history had wider spreads). No swap / financing, no slippage beyond the gap rule.',
          '- Stocks: Alpaca split-adjusted daily since 2016 only (~10 years of W1, ~120 MN bars: few MN arrivals); '
          'survivorship bias (today\'s liquid list).',
          '- The live alerts also require the arrival to be the newest closed bar\'s news and cap messages per day; the '
          'study takes every verified arrival.',
          f"- Fetch / run errors: {len(meta['errors'])}" + (': ' + '; '.join(meta['errors'][:12]) if meta['errors'] else '') + '.', '']
    return '\n'.join(L)


def conclusions(trades: List[Dict]) -> List[str]:
    """Plain-English bullets from the numbers (only claims with n >= 30 closed trades)."""
    arr = [t for t in trades if t['kind'] == 'arrival' and t.get('outcome') != 'no target']
    conf = [t for t in trades if t['kind'] == 'confirm']
    out = []

    def line(name, ts, ref=None):
        s = stats(ts)
        if s['closed'] < 30:
            return f"- {name}: too few closed trades ({s['closed']}) to say anything."
        ci = s['ci']
        verdict = ('positive (the 95% CI is above 0)' if ci and ci[0] > 0 else 'negative (the 95% CI is below 0)' if ci and ci[1] < 0
                   else 'not distinguishable from zero')
        return (f"- {name}: {s['closed']} closed, win {100 * s['win_rate']:.0f}%, avg {s['avg_R']:+.2f}R, PF {_f(s['pf'])} -> "
                f"expectancy {verdict}.")
    out.append(line('All arrival trades', arr))
    for m in ('fx', 'stock'):
        for tf in TF_ORDER:
            ts = [t for t in arr if t['market'] == m and t['tf'] == tf]
            if ts:
                out.append(line(f'{m.upper() if m == "fx" else "Stocks"} {tf}', ts))
    out.append(line('Strong (2+ removed)', [t for t in arr if t['removed'] >= 2]))
    out.append(line('Single removal', [t for t in arr if t['removed'] == 1]))
    out.append(line('Strict (at a valley)', [t for t in arr if t['strict']]))
    out.append(line('Not at a valley', [t for t in arr if not t['strict']]))
    out.append(line('Capped targets', [t for t in arr if t['target_kind'] == 'capped']))
    out.append(line('Extended targets', [t for t in arr if t['target_kind'] == 'extended']))
    out.append(line('Nested in an HTF zone', [t for t in arr if t['nested']]))
    out.append(line('Not nested', [t for t in arr if not t['nested']]))
    out.append(line('Confirmation trades', conf))
    f2 = stats(arr, 'fix2_R', 'fix2_outcome')
    if f2['closed'] >= 30:
        out.append(f"- Same entries with a fixed 2R target: {f2['closed']} closed, win {100 * f2['win_rate']:.0f}% (break-even ~34% "
                   f"after costs), avg {f2['avg_R']:+.2f}R.")
    new, old = stats(arr), stats(arr, 'old_R', 'old_outcome')
    if new['closed'] >= 30 and old['closed'] >= 30:
        out.append(f"- Stop rule vs the old distal stop on the same arrivals: win {100 * new['win_rate']:.0f}% vs "
                   f"{100 * old['win_rate']:.0f}%, avg {new['avg_R']:+.2f}R vs {old['avg_R']:+.2f}R (R is smaller per "
                   'point with the wider stop, so compare the win rate and the sum).')
    return out


def charts(trades: List[Dict], out_dir: str) -> List[str]:
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
    except Exception:  # noqa: BLE001
        return []
    made = []
    ink, grid = '#1f2937', '#e5e7eb'
    cols = {'fx': '#2563eb', 'stock': '#059669', 'confirm': '#d97706'}
    plt.rcParams.update({'font.size': 10, 'axes.edgecolor': grid, 'axes.labelcolor': ink, 'xtick.color': ink, 'ytick.color': ink})
    # equity curves (1R per trade, by exit time)
    fig, ax = plt.subplots(figsize=(10, 5), dpi=120)
    for name, ts in (('fx', [t for t in trades if t['kind'] == 'arrival' and t['market'] == 'fx']),
                     ('stock', [t for t in trades if t['kind'] == 'arrival' and t['market'] == 'stock']),
                     ('confirm', [t for t in trades if t['kind'] == 'confirm'])):
        ts = sorted((t for t in ts if t.get('outcome') in ('win', 'loss') and t.get('exit_t')), key=lambda t: t['exit_t'])
        if not ts:
            continue
        xs = [dt.datetime.strptime(t['exit_t'][:10], '%Y-%m-%d') for t in ts]
        ys, s = [], 0.0
        for t in ts:
            s += t['R']
            ys.append(s)
        label = {'fx': 'FX arrivals', 'stock': 'Stock arrivals', 'confirm': 'Realignment + LTF confirmation'}[name]
        ax.plot(xs, ys, color=cols[name], lw=1.6, label=f'{label} ({len(ts)} trades, {s:+.0f}R)')
    ax.axhline(0, color='#9ca3af', lw=0.8)
    ax.grid(color=grid, lw=0.6)
    ax.set_ylabel('cumulative R (1R risk per trade)')
    ax.set_title('Arrival trades: equity curve (closed trades by exit date)', color=ink)
    ax.legend(frameon=False, loc='upper left')
    for s_ in ('top', 'right'):
        ax.spines[s_].set_visible(False)
    fig.tight_layout()
    p = os.path.join(out_dir, 'equity.png')
    fig.savefig(p)
    plt.close(fig)
    made.append(p)
    # win rate + avg R by TF
    rows = []
    for m in ('fx', 'stock'):
        for tf in TF_ORDER:
            ts = [t for t in trades if t['kind'] == 'arrival' and t['market'] == m and t['tf'] == tf]
            s = stats(ts)
            if s['closed']:
                rows.append((f"{'FX' if m == 'fx' else 'Stk'} {tf}", s, cols[m]))
    cs = groups_by([t for t in trades if t['kind'] == 'confirm'], lambda t: t['tf'])
    for name, ts in cs:
        s = stats(ts)
        if s['closed']:
            rows.append((f'Conf {name}', s, cols['confirm']))
    if rows:
        fig, (a1, a2) = plt.subplots(1, 2, figsize=(11, 4.6), dpi=120)
        xs = range(len(rows))
        a1.bar(xs, [100 * r[1]['win_rate'] for r in rows], color=[r[2] for r in rows], width=0.6)
        a1.set_xticks(list(xs), [f"{r[0]}\nn={r[1]['closed']}" for r in rows], fontsize=8)
        a1.set_ylabel('win rate, % of closed trades')
        a1.set_title('Win rate by timeframe', color=ink)
        a2.bar(xs, [r[1]['avg_R'] for r in rows], color=[r[2] for r in rows], width=0.6)
        for i, r in enumerate(rows):
            if r[1]['ci']:
                a2.plot([i, i], r[1]['ci'], color=ink, lw=1.2)
        a2.axhline(0, color='#9ca3af', lw=0.8)
        a2.set_xticks(list(xs), [r[0] for r in rows], fontsize=8)
        a2.set_ylabel('avg R per closed trade (95% CI)')
        a2.set_title('Expectancy by timeframe', color=ink)
        for a in (a1, a2):
            a.grid(axis='y', color=grid, lw=0.6)
            for s_ in ('top', 'right'):
                a.spines[s_].set_visible(False)
        fig.tight_layout()
        p = os.path.join(out_dir, 'winrate_tf.png')
        fig.savefig(p)
        plt.close(fig)
        made.append(p)
    # avg R by group
    arr = [t for t in trades if t['kind'] == 'arrival' and t.get('outcome') != 'no target']
    gs = [('1 removed', [t for t in arr if t['removed'] == 1]), ('2+ removed', [t for t in arr if t['removed'] >= 2]),
          ('strict', [t for t in arr if t['strict']]), ('not strict', [t for t in arr if not t['strict']]),
          ('capped', [t for t in arr if t['target_kind'] == 'capped']), ('extended', [t for t in arr if t['target_kind'] == 'extended']),
          ('plain', [t for t in arr if t['target_kind'] == 'plain']), ('nested', [t for t in arr if t['nested']]),
          ('not nested', [t for t in arr if not t['nested']]), ('demand', [t for t in arr if t['dir'] > 0]),
          ('supply', [t for t in arr if t['dir'] < 0])]
    gs = [(n, stats(ts)) for n, ts in gs if stats(ts)['closed']]
    if gs:
        fig, ax = plt.subplots(figsize=(10, 4.6), dpi=120)
        xs = range(len(gs))
        ax.bar(xs, [g[1]['avg_R'] for g in gs], color='#6366f1', width=0.6)
        for i, g in enumerate(gs):
            if g[1]['ci']:
                ax.plot([i, i], g[1]['ci'], color=ink, lw=1.2)
        ax.axhline(0, color='#9ca3af', lw=0.8)
        ax.set_xticks(list(xs), [f"{g[0]}\nn={g[1]['closed']}" for g in gs], fontsize=8)
        ax.set_ylabel('avg R per closed trade (95% CI)')
        ax.set_title('Arrival trades: expectancy by rule variant', color=ink)
        ax.grid(axis='y', color=grid, lw=0.6)
        for s_ in ('top', 'right'):
            ax.spines[s_].set_visible(False)
        fig.tight_layout()
        p = os.path.join(out_dir, 'r_by_group.png')
        fig.savefig(p)
        plt.close(fig)
        made.append(p)
    return made


# ---- driver ----------------------------------------------------------------------------------------------------------
def run(jobs: List[Dict], workers: int, budget_min: float, log=print) -> Tuple[List[Dict], List[Dict], bool]:
    t0 = time.time()
    trades, counts = [], []
    partial = False
    if workers <= 1:
        it = map(study_instrument, jobs)
        pool = None
    else:
        import multiprocessing as mp
        pool = mp.get_context('fork').Pool(workers)
        it = pool.imap_unordered(study_instrument, jobs)
    try:
        for k, r in enumerate(it):
            trades += r['trades']
            counts.append({'sym': r['sym'], 'market': next(j['market'] for j in jobs if j['sym'] == r['sym']), 'counts': r['counts'],
                           'error': r['error']})
            log(f"  [{k + 1}/{len(jobs)}] {r['sym']}: {len(r['trades'])} rows, {r['secs']}s" + (f" ERROR {r['error']}" if r['error'] else ''))
            if budget_min and time.time() - t0 > budget_min * 60 and k + 1 < len(jobs):
                partial = True
                log(f'time budget reached after {k + 1} instruments')
                break
    finally:
        if pool is not None:
            pool.terminate() if partial else pool.close()
            pool.join()
    return trades, counts, partial


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--fx', type=int, default=0, help='first N FX instruments (0 = all)')
    ap.add_argument('--stocks', type=int, default=100)
    ap.add_argument('--no-fx', action='store_true')
    ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
    ap.add_argument('--budget-min', type=float, default=0)
    ap.add_argument('--out', default=os.path.join(ROOT, 'docs', 'research', 'arrival_study'))
    a = ap.parse_args(argv)
    t0 = time.time()
    errors: List[str] = []
    if a.selftest:
        jobs = synthetic_jobs()
        how = 'SELFTEST on synthetic random-walk bars: says nothing about real markets'
    else:
        jobs = []
        if not a.no_fx:
            j, e = fx_jobs(a.fx)
            jobs += j
            errors += e
        if a.stocks:
            j, e = stock_jobs(a.stocks)
            jobs += j
            errors += e
        how = 'GitHub Actions, OANDA practice + Alpaca'
    print(f'{len(jobs)} instruments, data ready in {time.time() - t0:.0f}s', flush=True)
    vals = []
    fxj = [j for j in jobs if j['market'] == 'fx']
    picks = [(j, 'D1', 1500) for j in fxj[:8]] + [(j, 'H4', 1500) for j in fxj[:2]] + [(j, 'W1', 250) for j in jobs if j['market'] == 'stock'][:4]
    for j, vtf, nb in picks:
        try:
            v = validate(j, vtf, nb)
        except Exception as e:  # noqa: BLE001
            v = {'sym': j['sym'], 'error': str(e)[:80]}
        if v:
            vals.append(v)
            print('validate', v, flush=True)
    trades, counts, partial = run(jobs, a.workers, a.budget_min)
    errors += [f"{c['sym']}: {c['error'][:120]}" for c in counts if c['error']]
    meta = {'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), 'how': how, 'partial': partial,
            'n_fx': sum(1 for j in jobs if j['market'] == 'fx'), 'n_stock': sum(1 for j in jobs if j['market'] == 'stock'),
            'minutes': (time.time() - t0) / 60, 'errors': errors, 'counts': counts, 'validate': vals}
    os.makedirs(a.out, exist_ok=True)
    md = report(trades, meta).replace('<!--CONCLUSIONS-->', '\n'.join(conclusions(trades)))
    pngs = charts(trades, a.out)
    if pngs:
        md += '\n## Charts\n\n' + '\n'.join(f'![{os.path.basename(p)}]({os.path.basename(p)})' for p in pngs) + '\n'
    with open(os.path.join(a.out, 'Arrival_Study.md'), 'w') as f:
        f.write(md)
    with open(os.path.join(a.out, 'trades.json'), 'w') as f:
        json.dump({'meta': {k: v for k, v in meta.items() if k != 'counts'}, 'trades': trades}, f, separators=(',', ':'), default=str)
    print(md[:6000])
    return 0


if __name__ == '__main__':
    sys.exit(main())
