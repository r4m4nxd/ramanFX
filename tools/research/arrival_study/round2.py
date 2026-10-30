"""Arrival study, round 2: what are we missing vs the mentor? (docs/research/arrival_study/round2/Round2.md)

    python tools/research/arrival_study/round2.py               # GitHub Actions (arrival-study.yml, round = 2): OANDA
    python tools/research/arrival_study/round2.py --selftest    # synthetic bars, no network (code-path check only)

1. Kevin's 880 real calls (kevin_calls.py): every call with a price = a limit at his proximal on M5 bars.
2. Our arrivals, re-run like round 1 (study.py: candidate pass + live re-read at the bar each became true, no
   look-ahead) on MN / W1 (2005+), D1 / H4 (2010+, H4 now full history), but SIMULATED ON FINER BARS (H4 -> M15,
   D1 -> H1, W1 -> H4, MN -> D1; one OANDA window of 5000 candles per setup, cached) and with trade-management
   variants; every setup carries the r2lib.features() of the moment it was placed.
3. LTF confirmation entries (H4 -> M15, D1 -> H1, W1 -> H4): once price reaches the arrival zone, the first LTF arrival
   of the same side inside / at the zone (its leg-out crosses the LTF trend line and removes an opposite LTF zone) =
   a limit at its proximal with the LTF stop rule (tight) -> 2R / 3R / the plan's target / partial / trail. Plus the
   round-1 realignment confirmations, now with LTF data.
4. Control: every fresh D1 / H4 zone (not only arrivals) on the majors / crosses / gold since 2010, limit at the
   proximal with the same stop rule, simulated on H4 bars: does Kevin's kind of setup (with-trend pullback zones)
   have an edge where arrivals do not?
5. Walk-forward: filters / management chosen on 2010-2019, judged on 2020-2026 only.

Outputs (--out): Round2.md, kevin.json, summary.json, PNG charts; --dump: every setup row (artifact only).
"""
from __future__ import annotations

import argparse
import dataclasses
import datetime as dt
import gzip
import json
import os
import statistics
import sys
import time
from typing import Dict, List, Optional, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import r2lib as R  # noqa: E402
import oanda_fine as OF  # noqa: E402

A, Z, ZVT = R.A, R.Z, R.ZVT

EXPIRY, HOLD, WATCH = 20, 100, 30
LTF_EXPIRY = 20
CONF_WATCH = 10                 # TF bars after the first touch of the zone an LTF confirmation may appear in
WIN = 420
SPLIT = '2020-01-01'
FX_TFS = {'MN': ('2005-01-01', '3M'), 'W1': ('2005-01-01', 'MN'), 'D1': ('2010-01-01', 'W1'), 'H4': ('2010-01-01', 'D1')}
FINE = {'H4': 'M15', 'D1': 'H1', 'W1': 'H4', 'MN': 'D1'}
FINE_BACK = {'M15': 8, 'H1': 32}          # calendar days of warm-up before the setup in a fine window
R1_SIM = {'MN': 'D1', 'W1': 'D1', 'D1': 'D1', 'H4': 'H4'}
CTRL_TFS = {'D1': 'W1', 'H4': 'D1'}
CTRL_START = '2010-01-01'
CTRL_SYMS = {'EUR_USD', 'GBP_USD', 'USD_JPY', 'USD_CHF', 'USD_CAD', 'AUD_USD', 'NZD_USD', 'EUR_GBP', 'EUR_JPY', 'GBP_JPY',
             'AUD_JPY', 'CAD_JPY', 'CHF_JPY', 'EUR_CHF', 'EUR_AUD', 'EUR_CAD', 'GBP_CHF', 'GBP_AUD', 'GBP_CAD', 'AUD_CAD',
             'AUD_NZD', 'NZD_JPY', 'EUR_NZD', 'GBP_NZD', 'AUD_CHF', 'CAD_CHF', 'NZD_CAD', 'NZD_CHF', 'XAU_USD'}
MGMT = ('plan', '2R', '3R', 'opp', 'partial', 'trail')
FEATURE_KEYS = ['htf_struct', 'tf_struct', 'htf_tl', 'tf_tl', 'loc_htf', 'loc_tf', 'nested', 'htf_zone_dist', 'opp_rr',
                'opp_rr_htf', 'risk_atr', 'zone_h_atr', 'leg_ratio', 'leg_body_atr', 'leg_candles', 'base_n', 'gap',
                'fresh', 'age', 'prior_run', 'approach', 'dist_now', 'weekday', 'nfp_week', 'session', 'pattern']
NUMERIC = [k for k in FEATURE_KEYS if k not in ('session', 'pattern')]


# ---- data ------------------------------------------------------------------------------------------------------------
def bars_rows(rows) -> List[Z.Bar]:
    return [Z.Bar(r[0], r[1], r[2], r[3], r[4]) for r in rows]


class Fine:
    """Fine-bar windows per setup (OANDA via oanda_fine, or a synthetic source)."""

    def __init__(self, name: str, full: Dict[str, R.TF], synthetic: Optional[Dict[str, R.TF]] = None):
        self.name, self.full, self.syn = name, full, synthetic
        self.fail = 0

    def get(self, gran: str, t0: str) -> Optional[R.TF]:
        if gran in self.full:
            return self.full[gran]
        start = R._p(t0) - dt.timedelta(days=FINE_BACK.get(gran, 10))
        if self.syn is not None:
            T = self.syn[gran]
            i = T.closed(start.strftime('%Y-%m-%dT%H:%M'))
            return R.TF(gran, T.bars[i:i + 5000], T.ends[i:i + 5000])
        try:
            rows = OF.window(self.name, gran, start)
        except Exception:  # noqa: BLE001
            self.fail += 1
            return None
        return R.TF(gran, bars_rows(rows)) if rows else None


def load_job(job: Dict) -> Dict[str, R.TF]:
    if 'data' in job:
        return job['data']
    import fx_backtest as BT
    data = {}
    for tf in ('MN', 'W1', 'D1', 'H4'):
        try:
            with open(BT._cache_path(job['name'], tf)) as f:
                rows = json.load(f)['rows']
        except (OSError, ValueError):
            rows = []
        if rows:
            data[tf] = R.TF(tf, bars_rows(rows))
    if 'MN' in data:
        q = Z.to_quarters(data['MN'].bars)
        data['3M'] = R.TF('3M', q)
    return data


# ---- one setup: management variants -----------------------------------------------------------------------------------
def run_variants(d: int, entry: float, stop: float, distal: float, plan_tp: Optional[float], opp_tp: Optional[float],
                 fine: R.TF, t0: str, expire: str, hold_end: Optional[str], cost: float) -> Dict[str, Dict]:
    risk = (entry - stop) * d
    ca = entry + d * 2 * risk          # one cancel level for every management but the plan's (same fills to compare)
    out = {}
    for m in MGMT:
        if m == 'plan':
            out[m] = (R.simulate(d, entry, stop, fine, t0, expire, hold_end, distal, cost, 'fixed', plan_tp)
                      if plan_tp is not None and (plan_tp - entry) * d > 0 else {'outcome': 'no target', 'R': None})
        elif m in ('2R', '3R'):
            out[m] = R.simulate(d, entry, stop, fine, t0, expire, hold_end, distal, cost, 'fixed', entry + d * float(m[0]) * risk,
                                cancel_at=ca)
        elif m == 'opp':
            out[m] = (R.simulate(d, entry, stop, fine, t0, expire, hold_end, distal, cost, 'fixed', opp_tp,
                                cancel_at=ca)
                      if opp_tp is not None and (opp_tp - entry) * d > 0 else {'outcome': 'no target', 'R': None})
        elif m == 'partial':
            out[m] = R.simulate(d, entry, stop, fine, t0, expire, hold_end, distal, cost, 'partial', entry + d * 3 * risk,
                                cancel_at=ca)
        elif m == 'trail':
            out[m] = R.simulate(d, entry, stop, fine, t0, expire, hold_end, distal, cost, 'trail', None, cancel_at=ca)
    return out


def slim(res: Dict[str, Dict]) -> Dict[str, Dict]:
    return {m: {k: v for k, v in r.items() if k in ('outcome', 'why', 'R', 'fill_t', 'exit_t', 'mfe', 'mae')} for m, r in res.items()}


def opp_target(zs: List[Z.Zone], d: int, entry: float) -> Optional[float]:
    opp = [z for z in zs if z.dir == -d and not z.removed and (z.lo > entry if d > 0 else z.hi < entry)]
    return min((z.prox for z in opp), key=lambda v: abs(v - entry)) if opp else None


# ---- LTF confirmation entry ------------------------------------------------------------------------------------------
def ltf_confirm(d: int, zone: Z.Zone, L: R.TF, ltf: str, t0: str, watch_end: str, spread: float, p: Dict) -> Optional[Dict]:
    """After price first reaches the TF zone (from t0), the first LTF arrival of side d at the zone, known after the touch
    and by watch_end, before an LTF close removes the TF zone. Returns its levels or None."""
    i = L.closed(t0)
    touch_i = None
    while i < len(L) and L.ends[i] <= watch_end:
        b = L.bars[i]
        if (b.c < zone.dist) if d > 0 else (b.c > zone.dist):
            return None
        if (b.l <= zone.prox) if d > 0 else (b.h >= zone.prox):
            touch_i = i
            break
        i += 1
    if touch_i is None:
        return None
    t_touch = L.ends[touch_i]
    gone = next((j for j in range(touch_i, len(L)) if L.ends[j] <= watch_end and
                 ((L.bars[j].c < zone.dist) if d > 0 else (L.bars[j].c > zone.dist))), None)
    t_gone = L.ends[gone] if gone is not None else watch_end
    lo0 = max(0, touch_i - WIN)
    hi0 = L.closed(min(watch_end, t_gone))
    sub = L.bars[lo0:hi0]
    if len(sub) < 80:
        return None
    S = A.series_of(sub, ltf)
    _, la = A.find_arrivals(S, ltf, {**p, 'lookback': 10 ** 6})
    nl = len(sub)
    h = zone.h
    best = None
    for c in la:
        ci = nl - c.known_bar
        ct = L.ends[lo0 + ci]
        if c.dir != d or not (t_touch < ct <= t_gone):
            continue
        if c.zone.lo > zone.hi + 0.5 * h or c.zone.hi < zone.lo - 0.5 * h:
            continue
        if c.zone.removed and nl - c.zone.removed_bar <= ci:
            continue
        if best is None or ct < best[1]:
            best = (c, ct, ci + 1)
    if best is None:
        return None
    c, ct, ck = best
    Sk = A.series_of(sub[max(0, ck - 300):ck], ltf)
    st = A.stop_of(Sk, d, c.valley, None, spread)
    return {'t': ct, 'entry': c.zone.prox, 'stop': st.stop, 'distal': c.zone.dist, 'k': lo0 + ck, 'removed': len(c.removed)}


# ---- one instrument --------------------------------------------------------------------------------------------------
def study_tf(job: Dict, data: Dict[str, R.TF], fine: Fine, tf: str, start: str, htf: str, cnt: Dict) -> List[Dict]:
    T = data.get(tf)
    if T is None or len(T) < 80:
        return []
    p = A.FX_P
    S = A.series_of(T.bars, tf)
    _, arrs = A.find_arrivals(S, tf, {**p, 'lookback': 10 ** 6})
    n = len(T)
    H = data.get(htf)
    sp = job['spread']
    out = []
    for a in arrs:
        k = n - a.known_bar + 1
        t0 = T.ends[k - 1]
        if t0 < start:
            continue
        cnt['candidates'] = cnt.get('candidates', 0) + 1
        price = T.bars[k - 1].c
        St = T.series(k, WIN)
        Ht = None
        if H is not None:
            hk = H.closed(t0)
            if hk >= 10:
                Ht = H.series(hk, 300, price)
        r = A.arrival_tf(St, tf, price, p, Ht, None, htf=htf if Ht is not None else None, ltf=None, spread=sp)
        cur = r.current
        if cur is None or cur.dir != a.dir or cur.t_leg != a.t_leg or r.plan is None:
            cnt['not_current'] = cnt.get('not_current', 0) + 1
            continue
        cnt['verified'] = cnt.get('verified', 0) + 1
        pl, d = r.plan, a.dir
        hz = Z.detect(Ht, p) if Ht is not None and Ht.n > 12 else []
        f = R.features(St, Ht, d, pl.entry, pl.stop, cur.zone.dist, price, cur.zone, t0, r.zones, hz)
        f['removed'] = len(cur.removed)
        f['plan_rr'] = pl.rr
        expire = T.ends[min(k - 1 + EXPIRY, n - 1)]
        hold_end = T.ends[k - 1 + HOLD + EXPIRY // 2] if k - 1 + HOLD + EXPIRY // 2 < n else None
        base = {'sym': job['sym'], 'tf': tf, 'dir': d, 't': t0, 'kind': 'arrival', 'entry': pl.entry, 'stop': pl.stop,
                'tp': pl.tp, 'risk': (pl.entry - pl.stop) * d, 'nested_stop': pl.basis == 'htf', 'f': f}
        opp_tp = opp_target(r.zones, d, pl.entry)
        fz = fine.get(FINE[tf], t0)
        res_on = FINE[tf]
        if fz is None or fz.closed(t0) >= len(fz) or (len(fz) and fz.ends[0] > t0):
            fz, res_on = data[R1_SIM[tf]], R1_SIM[tf] + ' (fallback)'
            cnt['fine_missing'] = cnt.get('fine_missing', 0) + 1
        res = run_variants(d, pl.entry, pl.stop, cur.zone.dist, pl.tp, opp_tp, fz, t0, expire, hold_end, sp)
        r1 = (R.simulate(d, pl.entry, pl.stop, data[R1_SIM[tf]], t0, expire, hold_end, cur.zone.dist, sp, 'fixed', pl.tp)
              if pl.tp is not None and (pl.tp - pl.entry) * d > 0 else {'outcome': 'no target', 'R': None})
        res['plan_r1bars'] = r1
        out.append({**base, 'sim': res_on, 'res': slim(res), 'fill_t': res['2R'].get('fill_t')})
        out[-1]['f']['session'] = R.session_of(out[-1]['fill_t']) if tf in ('H4', 'D1') else None
        # LTF confirmation entry inside / at the arrival zone
        ltf = A.CONFIRM_TF.get(tf)
        if ltf in ('M15', 'H1', 'H4') and fz is not None and fz.tf == ltf:
            cnt['ltf_checked'] = cnt.get('ltf_checked', 0) + 1
            watch_end = T.ends[min(k - 1 + EXPIRY + CONF_WATCH, n - 1)]
            c = ltf_confirm(d, cur.zone, fz, ltf, t0, watch_end, sp, p)
            if c is not None:
                cnt['ltf_conf'] = cnt.get('ltf_conf', 0) + 1
                lexp = fz.ends[min(c['k'] - 1 + LTF_EXPIRY, len(fz) - 1)]
                cres = run_variants(d, c['entry'], c['stop'], c['distal'], pl.tp, opp_tp, fz, c['t'], lexp, hold_end, sp)
                wide = R.simulate(d, c['entry'], pl.stop, fz, c['t'], lexp, hold_end, c['distal'], sp, 'fixed',
                                  c['entry'] + d * 2 * (c['entry'] - pl.stop) * d) if (c['entry'] - pl.stop) * d > 0 else {'outcome': 'bad', 'R': None}
                cres['2R_wide'] = wide
                cf = dict(f)
                cf['session'] = R.session_of(cres['2R'].get('fill_t'))
                out.append({**base, 'kind': 'ltfconf', 'tf': f'{tf}->{ltf}', 't': c['t'], 'entry': c['entry'], 'stop': c['stop'],
                            'risk': (c['entry'] - c['stop']) * d, 'tight': (c['entry'] - c['stop']) * d / max(1e-12, base['risk']),
                            'sim': ltf, 'res': slim(cres), 'fill_t': cres['2R'].get('fill_t'), 'f': cf})
        # round-1 realignment confirmation (the other side, inside the realignment area), now with LTF data
        if pl.realign is not None and r.swing is not None and fz is not None and fz.tf == ltf:
            cnt['realign'] = cnt.get('realign', 0) + 1
            ar = pl.realign
            watch_end = T.ends[min(k - 1 + WATCH, n - 1)]
            i0 = fz.closed(t0)
            lo0 = max(0, i0 - WIN)
            hi0 = fz.closed(watch_end)
            sub = fz.bars[lo0:hi0]
            if len(sub) > 80:
                LS = A.series_of(sub, ltf)
                _, la = A.find_arrivals(LS, ltf, {**p, 'lookback': 10 ** 6})
                nl = len(sub)
                best = None
                for c in la:
                    ci = nl - c.known_bar
                    ct = fz.ends[lo0 + ci]
                    if not (t0 < ct <= watch_end) or c.dir != -d:
                        continue
                    if A.t16(c.t_leg) < A.t16(cur.t_leg) or c.zone.lo > ar.hi or c.zone.hi < ar.lo:
                        continue
                    if c.zone.removed and nl - c.zone.removed_bar <= ci:
                        continue
                    if best is None or ct < best[1]:
                        best = (c, ct, ci + 1)
                if best is not None:
                    c, ct, ck = best
                    cnt['realign_conf'] = cnt.get('realign_conf', 0) + 1
                    Sk = A.series_of(sub[max(0, ck - 300):ck], ltf)
                    st = A.stop_of(Sk, c.dir, c.valley, ar.dist, sp)
                    lexp = fz.ends[min(lo0 + ck - 1 + LTF_EXPIRY, len(fz) - 1)]
                    cres = run_variants(c.dir, c.zone.prox, st.stop, c.zone.dist, r.swing, r.swing, fz, ct, lexp, hold_end, sp)
                    out.append({'sym': job['sym'], 'tf': f'{tf}->{ltf}', 'dir': c.dir, 't': ct, 'kind': 'realign',
                                'entry': c.zone.prox, 'stop': st.stop, 'tp': r.swing, 'risk': abs(c.zone.prox - st.stop),
                                'sim': ltf, 'res': slim(cres), 'fill_t': cres['2R'].get('fill_t'), 'f': {}})
    return out


def control_tf(job: Dict, data: Dict[str, R.TF], tf: str, htf: str, cnt: Dict) -> List[Dict]:
    """Every fresh zone of the TF since CTRL_START: limit at the proximal at the close of its stay-away candle."""
    T, H, sim = data.get(tf), data.get(htf), data.get('H4')
    if T is None or len(T) < 300 or sim is None:
        return []
    p = A.FX_P
    S = A.series_of(T.bars, tf)
    zones = Z.detect(S, {**p, 'lookback': 10 ** 6})
    n = len(T)
    sp = job['spread']
    out = []
    hcache: Dict[int, Tuple[Z.Series, List[Z.Zone]]] = {}
    for z in zones:
        k = n - z.sa_bar + 1
        if k < WIN or k >= n:
            continue
        t0 = T.ends[k - 1]
        if t0 < CTRL_START:
            continue
        off = z.sa_bar - 1
        zt = dataclasses.replace(z, leg_bar=z.leg_bar - off, sa_bar=1, tested=False, tested_bar=-1, removed=False, removed_bar=-1)
        St = T.series(k, WIN)
        price = St.C[1]
        d = z.dir
        if (price - z.prox) * d <= 0:
            continue                          # price already back at / in the zone
        Ht, hz = None, []
        if H is not None:
            hk = H.closed(t0)
            if hk >= 30:
                if hk not in hcache:
                    Hs = H.series(hk, 300)
                    hcache[hk] = (Hs, Z.detect(Hs, p) if Hs.n > 12 else [])
                Ht, hz = hcache[hk]
        j1 = min(zt.leg_bar + zt.base_n + ZVT.ZV['swing'], St.n - 1)
        valley = min(St.L[j] for j in range(zt.leg_bar, j1 + 1)) if d > 0 else max(St.H[j] for j in range(zt.leg_bar, j1 + 1))
        hosts = [h for h in hz if h.dir == d and not h.removed and h.lo <= zt.hi and h.hi >= zt.lo]
        host = min(hosts, key=lambda h: h.leg_bar) if hosts else None
        st = A.stop_of(St, d, valley, host.dist if host is not None else None, sp, host)
        zs = Z.detect(St, p)
        cnt['ctrl'] = cnt.get('ctrl', 0) + 1
        f = R.features(St, Ht, d, z.prox, st.stop, z.dist, price, zt, t0, zs, hz)
        expire = T.ends[min(k - 1 + EXPIRY, n - 1)]
        hold_end = T.ends[k - 1 + HOLD + EXPIRY // 2] if k - 1 + HOLD + EXPIRY // 2 < n else None
        opp_tp = opp_target(zs, d, z.prox)
        res = run_variants(d, z.prox, st.stop, z.dist, opp_tp, opp_tp, sim, t0, expire, hold_end, sp)
        res.pop('plan', None)
        if not any(x.get('fill_t') for x in res.values()):
            # never reached: keep only a counter (keeps the dump small)
            cnt['ctrl_unfilled'] = cnt.get('ctrl_unfilled', 0) + 1
            out.append({'sym': job['sym'], 'tf': tf, 'dir': d, 't': t0, 'kind': 'zone', 'unfilled': True, 'f': f})
            continue
        f['session'] = R.session_of(res['2R'].get('fill_t'))
        out.append({'sym': job['sym'], 'tf': tf, 'dir': d, 't': t0, 'kind': 'zone', 'entry': z.prox, 'stop': st.stop,
                    'risk': (z.prox - st.stop) * d, 'sim': 'H4', 'res': slim(res), 'fill_t': res['2R'].get('fill_t'), 'f': f})
    return out


def study_instrument(job: Dict) -> Dict:
    t0 = time.time()
    out = {'sym': job['sym'], 'rows': [], 'counts': {}, 'error': None}
    try:
        data = load_job(job)
        fine = Fine(job['name'], {k: v for k, v in data.items() if k in ('H4', 'D1')}, job.get('fine'))
        for tf, (start, htf) in FX_TFS.items():
            cnt: Dict = {}
            out['rows'] += study_tf(job, data, fine, tf, start, htf, cnt)
            out['counts'][tf] = cnt
        if job.get('ctrl'):
            for tf, htf in CTRL_TFS.items():
                cnt = {}
                out['rows'] += control_tf(job, data, tf, htf, cnt)
                out['counts'][f'ctrl {tf}'] = cnt
        out['fine_fail'] = fine.fail
    except Exception as e:  # noqa: BLE001
        import traceback
        out['error'] = f'{type(e).__name__}: {str(e)[:160]} | {traceback.format_exc()[-400:]}'
    out['secs'] = round(time.time() - t0, 1)
    return out


# ---- jobs ------------------------------------------------------------------------------------------------------------
def fx_jobs(max_n: int, log=print) -> Tuple[List[Dict], List[str]]:
    import data as SD
    import fx_backtest as BT
    import oanda as O
    import watchlist as W
    import fxscan as X
    SD.set_budget(200)
    O.token()
    instruments, src = O.account_instruments(log=log)
    known = {i['name'] for i in instruments} if src != 'fallback' else None
    wl = W.load(known)
    uni = [i for i in X.universe(instruments, wl) if i['name'] != 'USDX' and not i.get('source')]
    if max_n:
        uni = uni[:max_n]
    jobs, errors = [], []
    for i in uni:
        try:
            for tf in ('D1', 'W1', 'MN'):
                BT.fetch_history(i['name'], tf, log=log)
            h4 = BT.fetch_history(i['name'], 'H4', log=log)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{i['name']}: {type(e).__name__}: {str(e)[:100]}")
            log(f"  {i['name']}: fetch failed ({errors[-1]})")
            continue
        sps = [r[8] - r[4] for r in h4[-3000:] if len(r) >= 9 and r[8] > r[4]]
        jobs.append({'name': i['name'], 'sym': i['sym'], 'spread': statistics.median(sps) if sps else 0.0,
                     'ctrl': i['name'] in CTRL_SYMS})
    return jobs, errors


def split_bars(bars: List[Z.Bar], parts: int, minutes: int, seed: int) -> List[Z.Bar]:
    import random
    rnd = random.Random(seed)
    out = []
    for b in bars:
        t = R._p(b.d)
        px = [b.o] + [b.l + rnd.random() * (b.h - b.l) for _ in range(parts - 1)] + [b.c]
        lo_k, hi_k = rnd.randrange(parts), rnd.randrange(parts)
        for k in range(parts):
            o, c = px[k], px[k + 1]
            h = b.h if k == hi_k else max(o, c) + rnd.random() * 0.3 * (b.h - max(o, c))
            low = b.l if k == lo_k else min(o, c) - rnd.random() * 0.3 * (min(o, c) - b.l)
            out.append(Z.Bar((t + dt.timedelta(minutes=k * minutes)).strftime('%Y-%m-%dT%H:%M'), o, max(h, o, c), min(low, o, c), c))
    return out


def synthetic_jobs() -> List[Dict]:
    sys.path.insert(0, os.path.join(R.ROOT, 'tools', 'fx_scanner', 'fixtures'))
    import synth_fx
    jobs = []
    for k, (seed, px) in enumerate(((15, 1.10), (827, 185.0))):
        h4 = synth_fx.h4_walk(seed, n=16000, start=px)
        bars = {tf: synth_fx.aggregate(h4, tf) for tf in ('D1', 'W1', 'MN')}
        bars['H4'] = h4
        bars['3M'] = Z.to_quarters(bars['MN'])
        data = {tf: R.TF(tf, b) for tf, b in bars.items()}
        h1 = split_bars(h4[-9000:], 4, 60, seed)
        m15 = split_bars(h1[-14000:], 4, 15, seed)
        fine = {'H1': R.TF('H1', h1), 'M15': R.TF('M15', m15)}
        jobs.append({'name': f'SYN{k}', 'sym': f'SYN{k}', 'spread': px * 1e-4, 'ctrl': True, 'data': data, 'fine': fine})
    return jobs


def run(jobs: List[Dict], workers: int, budget_min: float, log=print) -> Tuple[List[Dict], List[Dict], bool]:
    t0 = time.time()
    rows, counts, partial = [], [], False
    if workers <= 1:
        it, pool = map(study_instrument, jobs), None
    else:
        import multiprocessing as mp
        pool = mp.get_context('fork').Pool(workers, maxtasksperchild=4)
        it = pool.imap_unordered(study_instrument, jobs)
    try:
        for k, r in enumerate(it):
            rows += r['rows']
            counts.append({'sym': r['sym'], 'counts': r['counts'], 'error': r['error'], 'fine_fail': r.get('fine_fail', 0)})
            log(f"  [{k + 1}/{len(jobs)}] {r['sym']}: {len(r['rows'])} rows, {r['secs']}s" + (f" ERROR {r['error']}" if r['error'] else ''), flush=True)
            if budget_min and time.time() - t0 > budget_min * 60 and k + 1 < len(jobs):
                partial = True
                log(f'time budget reached after {k + 1} instruments')
                break
    finally:
        if pool is not None:
            pool.terminate() if partial else pool.close()
            pool.join()
    return rows, counts, partial


# ---- analysis helpers ------------------------------------------------------------------------------------------------
def flat(rows: List[Dict], m: str) -> List[Dict]:
    """Rows -> trade dicts of management m (outcome / R / fill_t / exit_t at the top)."""
    out = []
    for r in rows:
        x = (r.get('res') or {}).get(m)
        if x is None:
            continue
        out.append({**{k: v for k, v in r.items() if k != 'res'}, **x})
    return out


def filt(name: str):
    """Named entry filters on the features (a priori thresholds, not fitted)."""
    F = {
        'all': lambda f: True,
        'with HTF structure (HH/HL)': lambda f: f.get('htf_struct') == 1,
        'with HTF trend line': lambda f: f.get('htf_tl') == 1,
        'with HTF structure or line': lambda f: f.get('htf_struct') == 1 or f.get('htf_tl') == 1,
        'not against HTF (struct >= 0)': lambda f: (f.get('htf_struct') or 0) >= 0 and (f.get('htf_tl') or 0) >= 0,
        'HTF discount / premium (loc <= 50)': lambda f: f.get('loc_htf') is not None and f['loc_htf'] <= 50,
        'HTF deep (loc <= 25)': lambda f: f.get('loc_htf') is not None and f['loc_htf'] <= 25,
        'nested in HTF zone': lambda f: bool(f.get('nested')),
        'strong leg-out (body >= 1.2 ATR)': lambda f: (f.get('leg_body_atr') or 0) >= 1.2,
        'small base (<= 2 candles)': lambda f: (f.get('base_n') or 9) <= 2,
        'room >= 2R to opposite zone': lambda f: f.get('opp_rr') is None or f['opp_rr'] >= 2,
        'HTF struct + discount': lambda f: f.get('htf_struct') == 1 and f.get('loc_htf') is not None and f['loc_htf'] <= 50,
        'HTF struct or line + discount': lambda f: (f.get('htf_struct') == 1 or f.get('htf_tl') == 1) and f.get('loc_htf') is not None and f['loc_htf'] <= 50,
        'HTF struct + discount + strong leg': lambda f: f.get('htf_struct') == 1 and f.get('loc_htf') is not None and f['loc_htf'] <= 50 and (f.get('leg_body_atr') or 0) >= 1.2,
        'HTF struct + discount + room 2R': lambda f: f.get('htf_struct') == 1 and f.get('loc_htf') is not None and f['loc_htf'] <= 50 and (f.get('opp_rr') is None or f['opp_rr'] >= 2),
    }
    return F[name]


FILTERS = ['all', 'with HTF structure (HH/HL)', 'with HTF trend line', 'with HTF structure or line', 'not against HTF (struct >= 0)',
           'HTF discount / premium (loc <= 50)', 'HTF deep (loc <= 25)', 'nested in HTF zone', 'strong leg-out (body >= 1.2 ATR)',
           'small base (<= 2 candles)', 'room >= 2R to opposite zone', 'HTF struct + discount', 'HTF struct or line + discount',
           'HTF struct + discount + strong leg', 'HTF struct + discount + room 2R']


def ok_s(s: Dict) -> str:
    return f"{s['closed']} tr, {R.fmt(s['win_rate'] and 100 * s['win_rate'], '{:.0f}')}% win, {R.fmt(s['avg_R'], '{:+.2f}')}R"


def univariate(trades: List[Dict], keys: List[str], min_n: int = 10) -> List[str]:
    """Per feature bucket: closed trades, win %, avg R."""
    L = ['| feature | bucket | closed | win % | avg R | 95% CI |', '|---|---|---|---|---|---|']
    for k in keys:
        g: Dict[str, List[Dict]] = {}
        for t in trades:
            b = R.bucket_of(k, (t.get('f') or {}).get(k))
            if b is not None:
                g.setdefault(b, []).append(t)
        for b in sorted(g, key=lambda x: (len(x), x)):
            s = R.stats(g[b])
            if s['closed'] < min_n:
                continue
            ci = f"{s['ci'][0]:+.2f} … {s['ci'][1]:+.2f}" if s['ci'] else 'n<20'
            L.append(f"| {k} | {b} | {s['closed']} | {R.fmt(100 * s['win_rate'], '{:.0f}')} | {R.fmt(s['avg_R'], '{:+.2f}')} | {ci} |")
    return L + ['']


def profile(groups: List[Tuple[str, List[Dict]]]) -> List[str]:
    """Feature profile (share / median) of several setup populations side by side."""
    def share(ts, fn):
        v = [fn(t.get('f') or {}) for t in ts]
        v = [x for x in v if x is not None]
        return f'{100 * sum(v) / len(v):.0f}%' if v else '–'

    def med(ts, k):
        v = [(t.get('f') or {}).get(k) for t in ts]
        v = [float(x) for x in v if x is not None]
        return f'{statistics.median(v):.2f}' if v else '–'
    rowsdef = [
        ('with HTF structure (HH+HL for buys)', lambda ts: share(ts, lambda f: f.get('htf_struct') == 1 if 'htf_struct' in f else None)),
        ('against HTF structure', lambda ts: share(ts, lambda f: f.get('htf_struct') == -1 if 'htf_struct' in f else None)),
        ('with HTF trend line', lambda ts: share(ts, lambda f: f.get('htf_tl') == 1 if 'htf_tl' in f else None)),
        ('against HTF trend line', lambda ts: share(ts, lambda f: f.get('htf_tl') == -1 if 'htf_tl' in f else None)),
        ('with entry-TF structure', lambda ts: share(ts, lambda f: f.get('tf_struct') == 1 if 'tf_struct' in f else None)),
        ('with entry-TF trend line', lambda ts: share(ts, lambda f: f.get('tf_tl') == 1 if 'tf_tl' in f else None)),
        ('against entry-TF trend line', lambda ts: share(ts, lambda f: f.get('tf_tl') == -1 if 'tf_tl' in f else None)),
        ('HTF location (0 = cheap end), median', lambda ts: med(ts, 'loc_htf')),
        ('in HTF discount (buys) / premium (sells)', lambda ts: share(ts, lambda f: (f['loc_htf'] <= 50) if f.get('loc_htf') is not None else None)),
        ('entry-TF location, median', lambda ts: med(ts, 'loc_tf')),
        ('nested in a same-side HTF zone', lambda ts: share(ts, lambda f: bool(f.get('nested')) if 'nested' in f else None)),
        ('room to the opposite TF zone (R), median', lambda ts: med(ts, 'opp_rr')),
        ('stop distance (ATR), median', lambda ts: med(ts, 'risk_atr')),
        ('zone height (ATR), median', lambda ts: med(ts, 'zone_h_atr')),
        ('zone matched by our detector', lambda ts: share(ts, lambda f: bool(f.get('matched')) if 'matched' in f else None)),
        ('leg-out body (ATR), median', lambda ts: med(ts, 'leg_body_atr')),
        ('base candles, median', lambda ts: med(ts, 'base_n')),
        ('zone age at placement (bars), median', lambda ts: med(ts, 'age')),
        ('prior run into the base (ATR), median', lambda ts: med(ts, 'prior_run')),
        ('pullback from the 20-bar extreme (ATR), median', lambda ts: med(ts, 'approach')),
        ('distance price -> entry at placement (ATR), median', lambda ts: med(ts, 'dist_now')),
    ]
    L = ['| feature | ' + ' | '.join(f'{n} (n={len(ts)})' for n, ts in groups) + ' |', '|---' * (len(groups) + 1) + '|']
    for name, fn in rowsdef:
        L.append(f'| {name} | ' + ' | '.join(fn(ts) for _, ts in groups) + ' |')
    return L + ['']


def walk_forward(rows: List[Dict], mg_list: List[str], min_train: int = 30) -> Tuple[List[Dict], List[str]]:
    """Every filter x management: train (< SPLIT) and test stats. Picked = train avg R > 0 with >= min_train closed."""
    res = []
    for fn in FILTERS:
        F = filt(fn)
        sel = [r for r in rows if F(r.get('f') or {})]
        for m in mg_list:
            ts = flat(sel, m)
            tr = [t for t in ts if t['t'] < SPLIT]
            te = [t for t in ts if t['t'] >= SPLIT]
            s_tr, s_te, s_all = R.stats(tr), R.stats(te), R.stats(ts)
            res.append({'filter': fn, 'mgmt': m, 'train': s_tr, 'test': s_te, 'all': s_all,
                        'picked': s_tr['closed'] >= min_train and (s_tr['avg_R'] or -1) > 0})
    L = ['| filter | management | train 2010-19 | test 2020-26 | test 95% CI (week blocks) | test PF | test max DD | picked on train | holds out of sample |',
         '|---|---|---|---|---|---|---|---|---|']
    for x in res:
        s = x['test']
        cw = s['ci_week']
        holds = x['picked'] and s['closed'] >= 20 and (s['avg_R'] or -1) > 0
        x['holds'] = holds
        L.append(f"| {x['filter']} | {x['mgmt']} | {ok_s(x['train'])} | {ok_s(s)} | "
                 f"{(f'{cw[0]:+.2f} … {cw[1]:+.2f}') if cw else '–'} | {R.fmt(s['pf'])} | {s['dd']:.1f} | "
                 f"{'yes' if x['picked'] else 'no'} | {'**yes**' if holds else 'no'} |")
    return res, L + ['']


def model_section(rows: List[Dict], m: str, title: str) -> List[str]:
    """Logistic regression (win yes / no) and a depth-2 tree on R, fit on the train years, scored on the test years."""
    ts = [t for t in flat(rows, m) if t.get('outcome') in R.CLOSED]
    tr = [t for t in ts if t['t'] < SPLIT]
    te = [t for t in ts if t['t'] >= SPLIT]
    L = [f'**{title}** ({m}; fit on {len(tr)} trades before {SPLIT}, scored on {len(te)} after)', '']
    if len(tr) < 40 or len(te) < 20:
        return L + ['Too few trades for a model.', '']
    keys = [k for k in NUMERIC if sum(1 for t in tr if (t.get('f') or {}).get(k) is not None) >= 0.6 * len(tr)]
    med = {k: statistics.median([float(t['f'][k]) for t in tr if t['f'].get(k) is not None]) for k in keys}
    X = [R._vec(t['f'], keys, med) for t in tr]
    y = [1 if t['R'] > 0.05 else 0 for t in tr]
    model = R.logit_fit(X, y, l2=5.0)
    p_tr = [R.logit_prob(model, x) for x in X]
    Xe = [R._vec(t['f'], keys, med) for t in te]
    ye = [1 if t['R'] > 0.05 else 0 for t in te]
    p_te = [R.logit_prob(model, x) for x in Xe]
    a_tr, a_te = R.auc(p_tr, y), R.auc(p_te, ye)
    w = sorted(zip(keys, model[0]), key=lambda kv: -abs(kv[1]))[:8]
    L.append(f"Logistic regression (standardised, L2): AUC train {R.fmt(a_tr)}, **test {R.fmt(a_te)}** (0.5 = no skill). "
             f"Largest weights (+ = more wins): " + ', '.join(f'{k} {v:+.2f}' for k, v in w) + '.')
    # top-third of predicted probability on the test years
    if p_te:
        th = sorted(p_tr)[int(len(p_tr) * 2 / 3)]
        top = [t for t, p in zip(te, p_te) if p >= th]
        rest = [t for t, p in zip(te, p_te) if p < th]
        L.append(f"Test trades the model ranks in its train top third: {ok_s(R.stats(top))}; the rest: {ok_s(R.stats(rest))}.")
    tree = R.stump_tree([{**t['f'], 'R': t['R']} for t in tr], keys, 'R', depth=2, min_leaf=max(15, len(tr) // 10))
    L += ['', 'Depth-2 regression tree on R (train):', '', '```'] + R.tree_text(tree) + ['```']
    good = [t for t in te if R.tree_apply(tree, t['f']) > 0]
    bad = [t for t in te if R.tree_apply(tree, t['f']) <= 0]
    L.append(f"Test years, leaves the tree calls positive: {ok_s(R.stats(good))}; negative: {ok_s(R.stats(bad))}.")
    return L + ['']


# ---- report ----------------------------------------------------------------------------------------------------------
def kevin_section(K: Dict) -> Tuple[List[str], Dict]:
    import kevin_calls as KC
    rows = K['rows']
    traded = [r for r in rows if r.get('status') == 'traded']
    zone_calls = [r for r in rows if r.get('kind') == 'zone']
    st: Dict[str, int] = {}
    for r in zone_calls:
        st[r.get('status', '?')] = st.get(r.get('status', '?'), 0) + 1
    L = ['## 1. Kevin\'s real calls, back-tested', '',
         f"{K['n_calls']} calls in `tools/kevin_daily/calls.json` (63 recorded breakdowns, plan days 2026-07-09 … 2026-10-29). "
         f"{len(zone_calls)} name a price (a zone / limit); the rest are trend-line / context calls (direction only). "
         'Zone calls: ' + ', '.join(f'{k} {v}' for k, v in sorted(st.items(), key=lambda kv: -kv[1])) + '. '
         f"Median zone height used when he gave no distal (ATR of his zone TF): "
         + ', '.join(f'{tf} {v:.2f}' for tf, v in sorted(K['med_h'].items())) + '.', '',
         'Rules: limit at his proximal placed at the recording time (read as US Eastern: never early), valid for the plan '
         f'day + {KC.EXPIRY_DAYS} trading days, stop = his distal + the stop-rule buffer, simulated on OANDA **M5** bars, '
         'spread charged; he states almost no targets, so the target is a variant.', '']
    names = {'1R': 'fixed 1R', '2R': 'fixed 2R', '3R': 'fixed 3R', 'partial': 'half at 1R + break-even, rest 3R',
             'trail': 'break-even at 1R, then 1R trail', 'opp': 'nearest opposite zone (his TF)', '2R_planday': 'fixed 2R, plan day only'}
    L += R.table('Kevin, every zone call, by management', [(names[v], KC.trades(rows, v)) for v in KC.VARIANTS])
    t2 = KC.trades(rows, '2R')
    by = lambda key: sorted({key(t) for t in t2})  # noqa: E731
    L += R.table('Kevin, fixed 2R, by zone TF', [(tf, [t for t in t2 if t['tf'] == tf]) for tf in ('M5', 'M15', 'H1', 'H4', 'D1', 'W1', 'MN') if any(t['tf'] == tf for t in t2)])
    L += R.table('Kevin, fixed 2R, by direction', [('long', [t for t in t2 if t['dir'] > 0]), ('short', [t for t in t2 if t['dir'] < 0])])
    L += R.table('Kevin, fixed 2R, by instrument', [(s, [t for t in t2 if t['sym'] == s]) for s in by(lambda t: t['sym'])])
    L += R.table('Kevin, fixed 2R, by his confidence', [(c, [t for t in t2 if t.get('confidence') == c]) for c in ('high', 'med', 'low')])
    L += R.table('Kevin, fixed 2R, by entry type', [
        ('limit at proximal', [t for t in t2 if t['entry_type'].startswith('limit')]),
        ('confirmation / other (tested as a limit)', [t for t in t2 if not t['entry_type'].startswith('limit')])])
    L += R.table('Kevin, fixed 2R, distal stated vs estimated', [('distal stated', [t for t in t2 if t.get('distal_given')]),
                                                                ('distal estimated', [t for t in t2 if not t.get('distal_given')])])
    L += R.table('Kevin, fixed 2R, by month of the plan day', [(m, [t for t in t2 if t['plan_for'][:7] == m]) for m in by(lambda t: t['plan_for'][:7])])
    # his own reports vs the back-test
    agree = {}
    for r in traded:
        ks = [s for s in r['kevin_status'] if s in ('won', 'lost', 'breakeven')]
        if not ks:
            continue
        o = r['res']['2R']['outcome']
        k = ks[-1]
        agree.setdefault(k, {}).setdefault(o, 0)
        agree[k][o] += 1
    L += ['**His own reports in later sessions vs the back-test (fixed 2R)**', '', '| he said | back-test win | loss | flat | open | cancelled / not filled |', '|---|---|---|---|---|---|']
    for k in ('won', 'lost', 'breakeven'):
        a = agree.get(k, {})
        L.append(f"| {k} | {a.get('win', 0)} | {a.get('loss', 0)} | {a.get('flat', 0)} | {a.get('open', 0)} | {a.get('cancelled', 0)} |")
    reported = sum(1 for r in rows if r.get('kevin_status'))
    L += ['', f'He followed up on {reported} of {len(rows)} calls; wins are mentioned more often than losses (82 won / 38 lost / 7 break-even '
          'reported in the transcripts): a reporting bias on top of the selection bias.', '']
    # direction test
    dt_rows = [r for r in rows if r.get('direction_test') is not None]
    def dline(name, rs):
        n = len(rs)
        w = sum(1 for r in rs if r['direction_test'] == 1)
        l_ = sum(1 for r in rs if r['direction_test'] == -1)
        return f"| {name} | {n} | {w} | {l_} | {n - w - l_} | {R.fmt(100 * w / (w + l_) if w + l_ else None, '{:.0f}')}% |"
    L += ['**Direction test (every call with a direction): from the recording, 1 ATR (his TF) with the call before 1 ATR against it, within 3 trading days**', '',
          '| calls | n | with first | against first | neither | hit rate |', '|---|---|---|---|---|---|',
          dline('all', dt_rows), dline('zone calls (with a price)', [r for r in dt_rows if r['kind'] == 'zone']),
          dline('trend-line / context calls', [r for r in dt_rows if r['kind'] == 'context']),
          dline('his confidence high', [r for r in dt_rows if r.get('confidence') == 'high']), '']
    summ = {'kevin_2R': R.stats(t2), 'kevin_by_var': {v: R.stats(KC.trades(rows, v)) for v in KC.VARIANTS},
            'direction_hit': (sum(1 for r in dt_rows if r['direction_test'] == 1) / max(1, sum(1 for r in dt_rows if r['direction_test'] in (1, -1))))}
    return L, summ


def report(rows: List[Dict], K: Optional[Dict], meta: Dict) -> Tuple[str, Dict]:
    arr = [r for r in rows if r['kind'] == 'arrival']
    conf = [r for r in rows if r['kind'] == 'ltfconf']
    real = [r for r in rows if r['kind'] == 'realign']
    ctrl = [r for r in rows if r['kind'] == 'zone' and not r.get('unfilled')]
    ctrl_all = [r for r in rows if r['kind'] == 'zone']
    summary: Dict = {'meta': meta}
    L = ['# Arrival study, round 2: what is missing vs the mentor?', '',
         f"Generated {meta['generated']} by `tools/research/arrival_study/round2.py` ({meta['how']}). "
         f"{meta['n_fx']} FX / CFD instruments (OANDA), runtime {meta['minutes']:.0f} min."
         + (' **PARTIAL** (time budget).' if meta.get('partial') else ''), '', '<!--ANSWER-->', '']
    ksum = {}
    if K:
        kl, ksum = kevin_section(K)
        L += kl
        summary['kevin'] = ksum
    # arrivals on fine bars
    L += ['## 2. Our arrivals again, on finer bars and with other management', '',
          f'Round-1 rules (live code, re-read at the bar each arrival became true), MN / W1 since 2005, D1 / H4 since 2010 '
          f'(H4 now full history), simulated on finer bars (H4 -> M15, D1 -> H1, W1 -> H4, MN -> D1). Trades that time out '
          f'({HOLD} TF bars) are counted at their exit price (round 1 left them out).', '']
    mg_names = {'plan': "plan's target (round 1)", '2R': 'fixed 2R', '3R': 'fixed 3R', 'opp': 'nearest opposite zone',
                'partial': 'half at 1R + break-even, rest 3R', 'trail': 'break-even at 1R, then 1R trail',
                'plan_r1bars': "plan's target on round-1 bars (check)"}
    L += R.table('All arrivals by management', [(mg_names[m], flat(arr, m)) for m in ('plan_r1bars',) + MGMT])
    L += R.table('Arrivals, fixed 2R, by TF', [(tf, flat([r for r in arr if r['tf'] == tf], '2R')) for tf in ('MN', 'W1', 'D1', 'H4')])
    L += R.table('Arrivals, fixed 2R, demand vs supply', [('demand', flat([r for r in arr if r['dir'] > 0], '2R')), ('supply', flat([r for r in arr if r['dir'] < 0], '2R'))])
    L += R.table('Arrivals, fixed 2R, train vs test years', [(f'before {SPLIT}', [t for t in flat(arr, '2R') if t['t'] < SPLIT]),
                                                            (f'{SPLIT} on', [t for t in flat(arr, '2R') if t['t'] >= SPLIT])])
    summary['arrivals'] = {m: R.stats(flat(arr, m)) for m in ('plan_r1bars',) + MGMT}
    # LTF confirmation
    L += ['## 3. LTF confirmation entries (finally with data)', '',
          f'After price reaches the arrival zone: the first LTF arrival of the same side at the zone (within the TF zone '
          f'+/- half its height, known after the first touch, within {CONF_WATCH} TF bars after the expiry), limit at its '
          f'proximal, LTF stop rule (tight). "2R, TF stop" keeps the TF arrival\'s stop with the LTF entry.', '']
    cn = {**mg_names, '2R_wide': '2R with the TF stop'}
    L += R.table('LTF confirmation entries by management', [(cn[m], flat(conf, m)) for m in MGMT + ('2R_wide',)])
    L += R.table('LTF confirmation, fixed 2R, by TF pair', [(p, flat([r for r in conf if r['tf'] == p], '2R')) for p in sorted({r['tf'] for r in conf})])
    L += R.table('LTF confirmation, fixed 3R, by TF pair', [(p, flat([r for r in conf if r['tf'] == p], '3R')) for p in sorted({r['tf'] for r in conf})])
    L += R.table('Realignment + LTF confirmation (round-1 rule, the other side), target = the TF swing', [(p, flat([r for r in real if r['tf'] == p], 'plan')) for p in sorted({r['tf'] for r in real})] or [('none', [])])
    summary['ltfconf'] = {m: R.stats(flat(conf, m)) for m in MGMT}
    # control: every zone
    if ctrl_all:
        L += ['## 4. Control: every fresh zone (not only arrivals), majors / crosses / gold, D1 + H4 since 2010', '',
              f'{len(ctrl_all)} zones; {len(ctrl)} reached (filled) in {EXPIRY} TF bars. Same stop rule, simulated on H4.', '']
        L += R.table('Every zone, by management', [(mg_names[m], flat(ctrl_all, m)) for m in MGMT if m != 'plan'])
        L += R.table('Every zone, fixed 2R, Kevin-like filters', [(fn, flat([r for r in ctrl_all if filt(fn)(r['f'])], '2R')) for fn in FILTERS])
        summary['control'] = {fn: R.stats(flat([r for r in ctrl_all if filt(fn)(r['f'])], '2R')) for fn in FILTERS}
    # feature comparison
    L += ['## 5. What does a Kevin setup look like vs ours?', '']
    groups = []
    kt = []
    if K:
        import kevin_calls as KC
        kt = KC.trades(K['rows'], '2R')
        groups.append(('Kevin zone calls', kt))
    groups += [('our arrivals', arr), ('LTF confirmations', conf)]
    if ctrl_all:
        groups.append(('every zone (control)', ctrl_all))
    L += profile(groups)
    if kt:
        L += ['**Kevin: which features separate his winners from his losers (fixed 2R, closed trades)**', '']
        L += univariate(kt, ['htf_struct', 'htf_tl', 'tf_struct', 'tf_tl', 'loc_htf', 'loc_tf', 'nested', 'opp_rr', 'risk_atr',
                             'zone_h_atr', 'matched', 'leg_body_atr', 'base_n', 'approach', 'dist_now', 'session', 'weekday'], min_n=8)
        kk = [t for t in kt if t.get('outcome') in R.CLOSED]
        ear = [t for t in kk if t['plan_for'] < '2026-09-01']
        lat = [t for t in kk if t['plan_for'] >= '2026-09-01']
        L += [f"Kevin, time split: Jul-Aug {ok_s(R.stats(ear))}; Sep-Oct {ok_s(R.stats(lat))}.", '']
        for fn in FILTERS[1:8]:
            F = filt(fn)
            a_ = [t for t in ear if F(t['f'])]
            b_ = [t for t in lat if F(t['f'])]
            L.append(f"- filter '{fn}': Jul-Aug {ok_s(R.stats(a_))}; Sep-Oct {ok_s(R.stats(b_))}")
        L.append('')
    L += ['**Our arrivals: winners vs losers by feature (fixed 2R, all years)**', '']
    L += univariate(flat(arr, '2R'), ['htf_struct', 'htf_tl', 'tf_struct', 'loc_htf', 'loc_tf', 'nested', 'opp_rr', 'leg_body_atr',
                                      'base_n', 'risk_atr', 'approach', 'prior_run', 'age', 'session'], min_n=15)
    L += model_section(arr, '2R', 'Arrivals: interpretable models, walk-forward')
    if ctrl_all:
        L += model_section(ctrl_all, '2R', 'Every zone (control): interpretable models, walk-forward')
    # walk-forward filters
    L += ['## 6. Candidate filters and management, walk-forward (choose on 2010-2019, judge on 2020-2026)', '',
          'A variant is "picked" when its train-years expectancy is above 0 with >= 30 closed trades, and "holds" when the '
          'same variant is also above 0 in the test years (>= 20 closed). Thresholds are fixed in advance (not fitted); '
          f'{len(FILTERS)} filters x {len(MGMT)} managements are tried, so a few will look good by luck: trust only the ones whose test CI is clearly above 0.', '']
    wf_a, tab = walk_forward(arr, list(MGMT))
    L += ['### Arrivals (limit at the zone)', ''] + tab
    wf_c, tab = walk_forward(conf, list(MGMT))
    L += ['### LTF confirmation entries', ''] + tab
    wf_z = []
    if ctrl_all:
        wf_z, tab = walk_forward(ctrl_all, [m for m in MGMT if m != 'plan'])
        L += ['### Every zone (control)', ''] + tab
    summary['wf'] = {'arrival': [_wf(x) for x in wf_a], 'ltfconf': [_wf(x) for x in wf_c], 'zone': [_wf(x) for x in wf_z]}
    # counts
    L += ['## Data / counts', '', '| instrument TF | candidates | verified | not current | fine bars missing (fallback) | LTF checked | LTF confirmations | realign areas | realign confirmations | control zones | control unfilled |',
          '|---|---|---|---|---|---|---|---|---|---|---|']
    agg: Dict[str, Dict[str, int]] = {}
    for c in meta['counts']:
        for tf, x in (c.get('counts') or {}).items():
            a = agg.setdefault(tf, {})
            for kk_, v in x.items():
                a[kk_] = a.get(kk_, 0) + v
    for k in sorted(agg):
        a = agg[k]
        L.append(f"| {k} | {a.get('candidates', 0)} | {a.get('verified', 0)} | {a.get('not_current', 0)} | {a.get('fine_missing', 0)} | "
                 f"{a.get('ltf_checked', 0)} | {a.get('ltf_conf', 0)} | {a.get('realign', 0)} | {a.get('realign_conf', 0)} | {a.get('ctrl', 0)} | {a.get('ctrl_unfilled', 0)} |")
    L += ['', f"OANDA fine-bar requests: {meta.get('requests', 0)} (cached {meta.get('cached', 0)}, errors {meta.get('fine_errors', 0)}). "
          f"Errors: {len(meta['errors'])}" + (': ' + '; '.join(meta['errors'][:10]) if meta['errors'] else '') + '.', '']
    L += ['## Caveats', '',
          '- Kevin: ~4 months of calls, one market regime; prices read off his chart frames / speech; he chooses which charts to '
          'show (selection) and mentions wins more than losses (reporting). OANDA prices differ slightly from his feed '
          '(indices / oil / gas most). Targets are ours (he names almost none). Treat his numbers as a sample of ~1 quarter.',
          '- FX instruments are correlated (USD pairs fill the same week): the "week blocks" CI resamples whole weeks and is the '
          'honest one; the trade CI is optimistic.',
          '- Fine bars: one 5000-candle OANDA window per setup; a trade still open at the window end is "open" (not counted). '
          'Inside one fine bar the stop still comes first. Spread = the median of the last ~3000 H4 spreads (constant).',
          '- Walk-forward: one split; the filters were chosen from Raja / Kevin principles before looking, but many were tried.', '']
    return '\n'.join(L), summary


def _wf(x: Dict) -> Dict:
    return {'filter': x['filter'], 'mgmt': x['mgmt'], 'picked': x['picked'], 'holds': x.get('holds'),
            'train': {k: x['train'][k] for k in ('closed', 'win_rate', 'avg_R', 'pf', 'dd')},
            'test': {k: x['test'][k] for k in ('closed', 'win_rate', 'avg_R', 'pf', 'dd', 'ci_week', 'ci')},
            'all': {k: x['all'][k] for k in ('closed', 'win_rate', 'avg_R', 'pf', 'dd')}}


# ---- charts ----------------------------------------------------------------------------------------------------------
def charts(rows: List[Dict], K: Optional[Dict], summary: Dict, out_dir: str) -> List[str]:
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
    except Exception:  # noqa: BLE001
        return []
    made = []
    ink, grid = '#1f2937', '#e5e7eb'
    plt.rcParams.update({'font.size': 10, 'axes.edgecolor': grid, 'axes.labelcolor': ink, 'xtick.color': ink, 'ytick.color': ink})

    def style(ax):
        ax.grid(axis='y', color=grid, lw=0.6)
        for s_ in ('top', 'right'):
            ax.spines[s_].set_visible(False)
    arr = [r for r in rows if r['kind'] == 'arrival']
    conf = [r for r in rows if r['kind'] == 'ltfconf']
    ctrl = [r for r in rows if r['kind'] == 'zone']
    # 1) expectancy by population x management
    pops = []
    if K:
        import kevin_calls as KC
        pops.append(('Kevin calls', '#d97706', lambda m: KC.trades(K['rows'], m if m in KC.VARIANTS else '2R')))
    pops += [('Our arrivals', '#2563eb', lambda m: flat(arr, m)), ('LTF confirmation', '#7c3aed', lambda m: flat(conf, m))]
    if ctrl:
        pops.append(('Every zone', '#6b7280', lambda m: flat(ctrl, m)))
    ms = ['2R', '3R', 'partial', 'trail', 'opp']
    fig, ax = plt.subplots(figsize=(11, 4.8), dpi=120)
    w = 0.8 / len(pops)
    for i, (name, col, fn) in enumerate(pops):
        for j, m in enumerate(ms):
            s = R.stats(fn(m))
            if not s['closed']:
                continue
            x = j + (i - (len(pops) - 1) / 2) * w
            ax.bar(x, s['avg_R'], width=w * 0.9, color=col, label=name if j == 0 else None)
            ci = s['ci_week'] or s['ci']
            if ci:
                ax.plot([x, x], ci, color=ink, lw=1)
    ax.axhline(0, color='#9ca3af', lw=0.8)
    ax.set_xticks(range(len(ms)), ['fixed 2R', 'fixed 3R', 'half 1R + BE, 3R', 'BE + 1R trail', 'opposite zone'])
    ax.set_ylabel('avg R per closed trade (95% CI)')
    ax.set_title('Expectancy: Kevin\'s calls vs our arrivals vs LTF confirmation vs every zone', color=ink)
    ax.legend(frameon=False, ncol=4, loc='lower left')
    style(ax)
    fig.tight_layout()
    p = os.path.join(out_dir, 'r2_expectancy.png')
    fig.savefig(p)
    plt.close(fig)
    made.append(p)
    # 2) feature profile
    feats = [('with HTF\nstructure', lambda f: f.get('htf_struct') == 1), ('with HTF\ntrend line', lambda f: f.get('htf_tl') == 1),
             ('against TF\ntrend line', lambda f: f.get('tf_tl') == -1), ('HTF discount /\npremium', lambda f: f.get('loc_htf') is not None and f['loc_htf'] <= 50),
             ('nested in\nHTF zone', lambda f: bool(f.get('nested'))), ('room >= 2R', lambda f: f.get('opp_rr') is None or f['opp_rr'] >= 2)]
    groups = []
    if K:
        groups.append(('Kevin calls', '#d97706', KC.trades(K['rows'], '2R')))
    groups += [('Our arrivals', '#2563eb', flat(arr, '2R'))]
    if ctrl:
        groups.append(('Every zone', '#6b7280', ctrl))
    fig, ax = plt.subplots(figsize=(11, 4.6), dpi=120)
    w = 0.8 / len(groups)
    for i, (name, col, ts) in enumerate(groups):
        vals = []
        for _, fn in feats:
            v = [fn(t.get('f') or {}) for t in ts if t.get('f')]
            vals.append(100 * sum(v) / len(v) if v else 0)
        xs = [j + (i - (len(groups) - 1) / 2) * w for j in range(len(feats))]
        ax.bar(xs, vals, width=w * 0.9, color=col, label=f'{name} (n={len(ts)})')
    ax.set_xticks(range(len(feats)), [f[0] for f in feats])
    ax.set_ylabel('% of setups')
    ax.set_title('Setup profile at placement', color=ink)
    ax.legend(frameon=False)
    style(ax)
    fig.tight_layout()
    p = os.path.join(out_dir, 'r2_profile.png')
    fig.savefig(p)
    plt.close(fig)
    made.append(p)
    # 3) walk-forward train vs test for the picked variants
    wf = [(k, x) for k in ('arrival', 'ltfconf', 'zone') for x in summary.get('wf', {}).get(k, []) if x['picked']]
    wf = sorted(wf, key=lambda kx: -(kx[1]['train']['avg_R'] or 0))[:16]
    if wf:
        fig, ax = plt.subplots(figsize=(11, 0.42 * len(wf) + 1.6), dpi=120)
        ys = range(len(wf))
        ax.barh([y + 0.2 for y in ys], [x['train']['avg_R'] or 0 for _, x in wf], height=0.38, color='#93c5fd', label='train 2010-19')
        ax.barh([y - 0.2 for y in ys], [x['test']['avg_R'] or 0 for _, x in wf], height=0.38, color='#1d4ed8', label='test 2020-26')
        ax.set_yticks(list(ys), [f"{k}: {x['filter']} / {x['mgmt']} (test n={x['test']['closed']})" for k, x in wf], fontsize=7)
        ax.axvline(0, color='#9ca3af', lw=0.8)
        ax.invert_yaxis()
        ax.set_xlabel('avg R per closed trade')
        ax.set_title('Variants picked on the train years: do they hold out of sample?', color=ink)
        ax.legend(frameon=False, loc='lower right')
        ax.grid(axis='x', color=grid, lw=0.6)
        fig.tight_layout()
        p = os.path.join(out_dir, 'r2_walkforward.png')
        fig.savefig(p)
        plt.close(fig)
        made.append(p)
    # 4) equity curves, test years
    fig, ax = plt.subplots(figsize=(10, 4.6), dpi=120)
    lines = [('Arrivals, all, 2R', flat(arr, '2R'), '#2563eb'), ('LTF confirmation, 3R', flat(conf, '3R'), '#7c3aed')]
    best = summary.get('best')
    if best:
        src = {'arrival': arr, 'ltfconf': conf, 'zone': ctrl}[best['set']]
        lines.append((f"Best holding: {best['set']} / {best['filter']} / {best['mgmt']}",
                      flat([r for r in src if filt(best['filter'])(r.get('f') or {})], best['mgmt']), '#059669'))
    for name, ts, col in lines:
        ts = sorted((t for t in ts if t.get('outcome') in R.CLOSED and t.get('exit_t') and t['t'] >= SPLIT), key=lambda t: t['exit_t'])
        if not ts:
            continue
        xs = [dt.datetime.strptime(t['exit_t'][:10], '%Y-%m-%d') for t in ts]
        ys, s = [], 0.0
        for t in ts:
            s += t['R']
            ys.append(s)
        ax.plot(xs, ys, color=col, lw=1.5, label=f'{name} ({len(ts)} trades, {s:+.0f}R)')
    ax.axhline(0, color='#9ca3af', lw=0.8)
    ax.set_ylabel('cumulative R')
    ax.set_title('Out-of-sample years (2020-2026): equity curves', color=ink)
    ax.legend(frameon=False, loc='upper left', fontsize=8)
    style(ax)
    fig.tight_layout()
    p = os.path.join(out_dir, 'r2_equity_test.png')
    fig.savefig(p)
    plt.close(fig)
    made.append(p)
    return made


def pick_best(summary: Dict) -> Optional[Dict]:
    best = None
    for k in ('arrival', 'ltfconf', 'zone'):
        for x in summary.get('wf', {}).get(k, []):
            if not x.get('holds'):
                continue
            ci = x['test'].get('ci_week')
            score = (ci[0] if ci else -9, x['test']['avg_R'] or 0)
            if best is None or score > best[0]:
                best = (score, {'set': k, **x})
    return best[1] if best else None


# ---- driver ----------------------------------------------------------------------------------------------------------
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--fx', type=int, default=0, help='first N FX instruments (0 = all)')
    ap.add_argument('--no-kevin', action='store_true')
    ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
    ap.add_argument('--budget-min', type=float, default=0)
    ap.add_argument('--out', default=os.path.join(R.ROOT, 'docs', 'research', 'arrival_study', 'round2'))
    ap.add_argument('--dump', default='', help='write every setup row here (.json.gz)')
    a = ap.parse_args(argv)
    t0 = time.time()
    errors: List[str] = []
    K = None
    if a.selftest:
        jobs = synthetic_jobs()
        how = 'SELFTEST on synthetic random-walk bars: says nothing about real markets'
    else:
        jobs, errors = fx_jobs(a.fx)
        how = 'GitHub Actions, OANDA practice'
        if not a.no_kevin:
            import kevin_calls as KC
            print('Kevin calls ...', flush=True)
            K = KC.run()
            errors += K['errors'][:20]
            print(f"  {sum(1 for r in K['rows'] if r.get('status') == 'traded')} traded", flush=True)
    print(f'{len(jobs)} instruments ready in {time.time() - t0:.0f}s', flush=True)
    rows, counts, partial = run(jobs, a.workers, a.budget_min, log=print)
    errors += [f"{c['sym']}: {c['error'][:160]}" for c in counts if c['error']]
    meta = {'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), 'how': how, 'partial': partial,
            'n_fx': len(jobs), 'minutes': (time.time() - t0) / 60, 'errors': errors, 'counts': counts,
            'requests': OF.STATS['requests'], 'cached': OF.STATS['cached'], 'fine_errors': sum(c.get('fine_fail', 0) for c in counts)}
    os.makedirs(a.out, exist_ok=True)
    md, summary = report(rows, K, meta)
    summary['best'] = pick_best(summary)
    pngs = charts(rows, K, summary, a.out)
    if pngs:
        md += '\n## Charts\n\n' + '\n'.join(f'![{os.path.basename(p)}]({os.path.basename(p)})' for p in pngs) + '\n'
    with open(os.path.join(a.out, 'Round2_data.md'), 'w') as f:
        f.write(md)
    with open(os.path.join(a.out, 'summary.json'), 'w') as f:
        json.dump({k: v for k, v in summary.items() if k != 'meta'} | {'meta': {k: v for k, v in meta.items() if k != 'counts'}},
                  f, indent=1, default=str)
    if K:
        with open(os.path.join(a.out, 'kevin.json'), 'w') as f:
            json.dump(K, f, separators=(',', ':'), default=str)
    if a.dump:
        with gzip.open(a.dump, 'wt') as f:
            json.dump(rows, f, separators=(',', ':'), default=str)
    print(md[:5000])
    return 0


if __name__ == '__main__':
    sys.exit(main())
