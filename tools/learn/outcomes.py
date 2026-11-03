"""Live outcome tracker: every trade idea the scanners publish is recorded once, then followed on the later candles.

The "learning from live results" half of the auto-improve loop (the backtests are the other half). Stdlib only.
Runs as a step after the FX / stock scan (fx-scan.yml, stock-scan.yml), on the files that scan just wrote: no API call.

    python tools/learn/outcomes.py --market fx       after the hourly FX scan
    python tools/learn/outcomes.py --market stock    after the daily stock scan ('stocks' accepted)

Inputs (written by the scan of the same job):
    fx      public/fx/latest.json        signals (BUY / SELL) + watch (WATCH): entry / stop / target / tf / side / zone
            public/fx/arrivals.json      last_items: this run's realignment confirmations (arrival_alerts.learn_items)
            public/fx/d/*.json           candles: the newest 80 closed H1 bars of every instrument (the path)
    stock   public/scanner/latest.json   signals (BUY / WATCH)
            public/scanner/arrivals.json last_items (confirmations + arrivals) and weekly_turns
            tools/stock_scanner/.cache/daily/<SYM>.json  the daily bars the scan loaded (full history); fallback
            public/scanner/t/*.json      (the published 120 daily bars, listed tickers only)
Outputs (data branch only; each job owns its own ledger, two jobs never write the same ledger):
    public/learn/ledger-fx.json, public/learn/ledger-stock.json   the ideas and their resolution state
    public/learn/outcomes.json                                    the summary of both ledgers (rebuilt by either job:
        the other market's ledger is read as pulled from the data branch, at most one run old)
            groups / windows['90d'|'all']  '<market>|<kind>|<tf>|<side>' -> {n, filled, win, exp_r, avg_mfe_r,
                                           avg_mae_r, hit_1r}; market 'fx' | 'stock' (learner.py MARKETS); n = closed
                                           ideas, filled = the filled ones, the rates / averages are over filled
            tags[window]                   '<market>|<kind>|<tf>|<side>|<tag>' breakdowns (ct, zone_type:ARR, ...)
            recent                         the last 20 closed ideas

Outcome rules (every idea is a limit order at `entry`; WATCH ideas are tracked the same way, flagged watch):
    path bars   the candles after the idea was published (bar label > the scan's last closed bar): FX H1 bars,
                stocks D1 bars. Bar limits are counted in ENTRY-TF bars, converted to path bars by PATH_BARS
                (FX D1 = 24 H1, W1 = 120 H1, ...; stocks W1 = 5 D1, MN = 21 D1, ...).
    fill        price trades through the entry (long: low <= entry; short: high >= entry). Fill time = that bar.
    cancelled   before the fill, the target is reached (long: high >= target) or the bar opens beyond the zone's
                distal (a gap through the whole zone). A bar that touches the entry is a fill, even if it also
                reaches the target (conservative).
    expired     not filled within 30 entry-TF bars (filled = false), or filled and still open after 60 entry-TF
                bars from the fill: scored at the close of that bar (r = (close - entry) / risk, signed).
    stop        after the fill the stop is checked first on every bar (also on the fill bar): stop and target in
                the same bar = stop. r = -1.
    target      reached after the fill bar (never on the fill bar itself). r = (target - entry) / risk.
                Ideas without a target (weekly turns) can only end at the stop or expire.
    risk        |entry - stop|. MFE_R / MAE_R = the best / worst excursion from the fill in R (>= 0), the fill bar
                included; a stop exit caps MAE at 1 and does not count that bar's favourable side, a target exit
                caps MFE at the target's R. hit_1r = MFE_R >= 1.
    bars_held   entry-TF bars from the fill to the exit (path bars / PATH_BARS).
Stocks are recomputed from the first bar after publication on every run (the cache has the full history); FX
recomputes while the 80 published H1 bars still reach back to the publication, then continues incrementally from the
last bar it processed (a missing stretch is flagged gap = true).

Ledger bound: closed entries whose close is older than 3 years are folded into an all-time aggregate (archive) and
dropped; at most MAX_ENTRIES entries (oldest closed archived first). Never raises into the workflow: main() logs one
line and returns 0.
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import math
import os
import sys
import time
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SCHEMA = 1
UNFILLED_BARS = 30           # entry-TF bars to get filled
OPEN_BARS = 60               # entry-TF bars from the fill to the forced exit (scored at the close)
KEEP_DAYS = 3 * 365          # closed entries older than this are archived (counted in the all-time aggregate)
MAX_ENTRIES = 20000
RECENT_N = 20
WINDOW_DAYS = 90
# path bars per entry-TF bar
PATH_BARS = {
    'fx': {'M15': 0.25, 'H1': 1, 'H4': 4, 'D1': 24, 'W1': 120, 'MN': 520, '3M': 1560},
    'crypto': {'M15': 0.25, 'H1': 1, 'H4': 4, 'D1': 24, 'W1': 168, 'MN': 720, '3M': 2160},
    'stock': {'H1': 1 / 7, 'H4': 0.5, 'D1': 1, 'W1': 5, 'MN': 21, '3M': 63},
}
OUTCOMES = ('target', 'stop', 'expired', 'cancelled')
STATE_KEYS = ('status', 'n', 'last', 'fill_i', 'fill_t', 'hi', 'lo', 'mfe_r', 'mae_r', 'hit_1r', 'outcome', 'r',
              'exit_t', 'bars_held', 'filled', 'closed_at', 'gap', 'why')

Bar = Tuple[str, float, float, float, float]       # (label, open, high, low, close), oldest first


# ---- helpers -------------------------------------------------------------------------------------------------------
def _num(v) -> Optional[float]:
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return f if math.isfinite(f) else None


def _iso(t: dt.datetime) -> str:
    return t.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def _parse_iso(s: str) -> Optional[dt.datetime]:
    if not s:
        return None
    try:
        t = dt.datetime.fromisoformat(str(s).replace('Z', '+00:00'))
    except ValueError:
        return None
    return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)


def load_json(path: str) -> Dict:
    try:
        with open(path) as f:
            js = json.load(f)
        return js if isinstance(js, dict) else {}
    except (OSError, ValueError):
        return {}


def save_json(path: str, obj: Dict, lines_key: Optional[str] = None) -> None:
    """Atomic write; compact JSON, one entry per line under lines_key (small git deltas on the data branch)."""
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        if lines_key and isinstance(obj.get(lines_key), dict):
            head = {k: v for k, v in obj.items() if k != lines_key}
            f.write(json.dumps(head, separators=(',', ':'), sort_keys=True)[:-1])
            f.write(f',"{lines_key}":{{')
            rows = sorted(obj[lines_key].items())
            f.write(','.join('\n' + json.dumps(k) + ':' + json.dumps(v, separators=(',', ':'), sort_keys=True) for k, v in rows))
            f.write('\n}}\n')
        else:
            json.dump(obj, f, separators=(',', ':'), sort_keys=True)
            f.write('\n')
    os.replace(tmp, path)


def _fmt(v: float, nd: int) -> str:
    return f'{v:.{max(0, min(nd, 10))}f}'


def idea_key(market: str, sym: str, kind: str, tf: str, side: str, entry: float, nd: int, zone: str = '') -> str:
    return '|'.join([market, sym, kind, tf, side, _fmt(entry, nd), zone or ''])


def make_idea(market: str, sym: str, kind: str, tf: str, direction: int, entry, stop, target=None, distal=None,
              nd: int = 5, zone: str = '', asof: str = '', first_seen: str = '', watch: bool = False,
              tags: Optional[Dict] = None, cls: str = '') -> Optional[Dict]:
    """A ledger entry (before resolution) or None when the plan is unusable (no entry / stop, zero risk, stop on the
    wrong side)."""
    e, s, t, d = _num(entry), _num(stop), _num(target), _num(distal)
    if e is None or s is None or not sym or not tf or not asof:
        return None
    risk = abs(e - s)
    if risk <= 0 or (direction > 0 and s >= e) or (direction < 0 and s <= e):
        return None
    if t is not None and ((direction > 0 and t <= e) or (direction < 0 and t >= e)):
        t = None
    side = 'long' if direction > 0 else 'short'
    return {'key': idea_key(market, sym, kind, tf, side, e, nd, zone), 'market': market, 'sym': sym, 'kind': kind,
            'tf': tf, 'side': side, 'dir': 1 if direction > 0 else -1, 'entry': e, 'stop': s, 'target': t,
            'distal': d, 'risk': round(risk, 10), 'target_r': round(abs(t - e) / risk, 3) if t is not None else None,
            'zone': zone or '', 'asof': asof, 'first_seen': first_seen, 'watch': bool(watch), 'cls': cls or market,
            'tags': {k: v for k, v in (tags or {}).items() if v is not None and v != ''}, 'status': 'pending'}


# ---- the published ideas -------------------------------------------------------------------------------------------
def _counter(direction: str) -> Optional[bool]:
    d = (direction or '').upper()
    if not d:
        return None
    return 'REDUCED' in d or 'COUNTER' in d


def fx_ideas(latest: Dict, arrivals: Dict, cls_of: Dict[str, str], now: dt.datetime) -> List[Dict]:
    """FX BUY / SELL / WATCH signals + the realignment confirmations of this run."""
    out: List[Dict] = []
    gen = latest.get('generated') or _iso(now)
    h1, ch1 = latest.get('h1') or '', latest.get('crypto_h1') or latest.get('h1') or ''
    for s in list(latest.get('signals') or []) + list(latest.get('watch') or []):
        kind = (s.get('kind') or '').upper()
        if kind not in ('BUY', 'SELL', 'WATCH'):
            continue
        cls = s.get('cls') or cls_of.get(s.get('sym') or '') or ''
        dirn = 1 if s.get('side') == 'demand' else (-1 if s.get('side') == 'supply' else (1 if kind == 'BUY' else -1))
        tags = {'zone_type': s.get('zone_type'), 'pattern': s.get('pattern'), 'ct': _counter(s.get('direction')),
                'score': s.get('score'), 'loc': s.get('loc'), 'loc_ok': s.get('loc_ok'), 'watch_kind': s.get('watch_kind'),
                'target_kind': s.get('target_kind'), 'touches': s.get('touches'), 'rr': s.get('rr'), 'wl': s.get('wl')}
        it = make_idea('fx', s.get('sym') or '', kind, s.get('tf') or '', dirn, s.get('entry'), s.get('stop'), s.get('target'),
                       s.get('distal'), int(s.get('digits') or 5), s.get('zid') or s.get('base_start') or '',
                       ch1 if cls == 'crypto' else h1, gen, watch=kind == 'WATCH', tags=tags, cls=cls)
        if it:
            out.append(it)
    out += _arrival_items('fx', arrivals, now, lambda sym: ch1 if cls_of.get(sym) == 'crypto' else h1,
                          kinds=('confirm',), cls_of=cls_of)
    return out


def _arrival_items(market: str, arrivals: Dict, now: dt.datetime, asof_of, kinds: Sequence[str],
                   cls_of: Optional[Dict[str, str]] = None, max_age_h: float = 6.0) -> List[Dict]:
    """arrivals.json last_items (arrival_alerts.learn_items): only a fresh list (this run's, not a stale one left by a
    run whose arrival pass failed)."""
    li = arrivals.get('last_items') or {}
    at = _parse_iso(li.get('at') or '')
    if at is None or (now - at).total_seconds() > max_age_h * 3600:
        return []
    out = []
    for c in li.get('items') or []:
        k = c.get('kind')
        if k not in kinds:
            continue
        d = 1 if (c.get('dir') or 0) > 0 else -1
        sym = c.get('sym') or ''
        if k == 'confirm':
            tf, distal = c.get('ltf') or c.get('tf') or '', c.get('lo') if d > 0 else c.get('hi')
            tags = {'area': c.get('tf'), 'removed': _removed(c.get('n_removed')), 'rr': c.get('rr')}
        else:
            tf, distal = c.get('tf') or '', c.get('dist')
            tags = {'removed': _removed(c.get('n_removed')), 'target_kind': c.get('target_kind'), 'rr': c.get('rr')}
        tags['wl'] = c.get('wl')
        it = make_idea(market, sym, k.upper(), tf, d, c.get('entry'), c.get('stop'), c.get('target'), distal,
                       int(c.get('digits') or (2 if market == 'stock' else 5)), c.get('id') or '', asof_of(sym),
                       _iso(at), tags=tags, cls=(cls_of or {}).get(sym) or market)
        if it:
            out.append(it)
    return out


def _removed(n) -> Optional[str]:
    n = _num(n)
    return None if n is None else ('2+' if n >= 2 else str(int(n)))


def _stock_cls(s: Dict) -> str:
    idx = s.get('indexes') or []
    if 'ADR' in idx:
        return 'adr'
    if (s.get('currency') or '').upper() == 'CAD' or any(str(i).startswith('TSX') for i in idx):
        return 'tsx'
    return 'us'


def stock_ideas(latest: Dict, arrivals: Dict, now: dt.datetime) -> List[Dict]:
    """Stock BUY / WATCH signals, realignment confirmations + arrivals, weekly turns."""
    out: List[Dict] = []
    gen = latest.get('generated_at') or _iso(now)
    asof = (latest.get('date') or '')[:10]
    cls_of: Dict[str, str] = {}
    for s in latest.get('signals') or []:
        kind = (s.get('kind') or '').upper()
        sym = s.get('symbol') or s.get('sym') or ''
        if kind not in ('BUY', 'SELL', 'WATCH') or not sym:
            continue
        e, st = _num(s.get('entry')), _num(s.get('stop'))
        if e is None or st is None:
            continue
        side = s.get('side')
        dirn = 1 if side == 'demand' else (-1 if side == 'supply' else (1 if st < e else -1))
        cls_of[sym] = _stock_cls(s)
        tags = {'zone_type': s.get('zone_type'), 'pattern': s.get('pattern'), 'ct': _counter(s.get('direction')),
                'score': s.get('score'), 'loc': s.get('loc'), 'loc_ok': s.get('loc_ok'), 'watch_kind': s.get('watch_kind'),
                'target_kind': s.get('target_kind'), 'touches': s.get('touches'), 'rr': s.get('rr'),
                'index_aligned': s.get('index_aligned'), 'fv_inside': s.get('fv_inside')}
        it = make_idea('stock', sym, kind, s.get('tf') or '', dirn, e, st, s.get('target'), s.get('distal'), 2,
                       s.get('zid') or s.get('base_start') or '', asof, gen, watch=kind == 'WATCH', tags=tags,
                       cls=cls_of[sym])
        if it:
            out.append(it)
    if asof:
        out += _arrival_items('stock', arrivals, now, lambda sym: asof, kinds=('confirm', 'arrival'), cls_of=cls_of,
                              max_age_h=12.0)
        if _fresh(arrivals.get('updated'), now, 12.0):
            for t in arrivals.get('weekly_turns') or []:
                tags = {'turn': t.get('w1_state'), 'removed': _removed(t.get('w1_removed'))}
                it = make_idea('stock', t.get('sym') or '', 'TURN', 'D1', 1, t.get('d1_hi'), t.get('d1_lo'), None,
                               t.get('d1_lo'), 2, f"W1x{t.get('w1_cross') or ''}", asof, gen, tags=tags,
                               cls=cls_of.get(t.get('sym') or '') or 'stock')
                if it:
                    out.append(it)
    return out


def _fresh(iso: Optional[str], now: dt.datetime, hours: float) -> bool:
    t = _parse_iso(iso or '')
    return t is not None and (now - t).total_seconds() <= hours * 3600


def add_ideas(ledger: Dict, ideas: Iterable[Dict]) -> int:
    """New ideas only (the key): an idea already in the ledger is never added twice, whatever its state."""
    ent = ledger.setdefault('entries', {})
    n = 0
    for it in ideas:
        k = it['key']
        if k in ent:
            continue
        rec = dict(it)
        rec.pop('key', None)
        ent[k] = rec
        n += 1
    return n


# ---- the resolver --------------------------------------------------------------------------------------------------
def path_bars(entry: Dict, n_tf_bars: float) -> int:
    table = PATH_BARS['stock' if entry.get('market') == 'stock' else ('crypto' if entry.get('cls') == 'crypto' else 'fx')]
    return max(1, int(math.ceil(n_tf_bars * table.get(entry.get('tf') or '', 1))))


def _per_tf(entry: Dict) -> float:
    table = PATH_BARS['stock' if entry.get('market') == 'stock' else ('crypto' if entry.get('cls') == 'crypto' else 'fx')]
    return float(table.get(entry.get('tf') or '', 1))


def _reset(entry: Dict) -> None:
    for k in STATE_KEYS:
        entry.pop(k, None)
    entry['status'] = 'pending'


def _close(entry: Dict, outcome: str, bar: Bar, r: Optional[float], now_iso: str) -> None:
    entry['status'] = 'closed'
    entry['outcome'] = outcome
    entry['r'] = None if r is None else round(r, 3)
    entry['exit_t'] = bar[0]
    entry['closed_at'] = now_iso
    entry['filled'] = entry.get('fill_t') is not None
    if entry['filled']:
        entry['bars_held'] = round((entry['n'] - entry['fill_i']) / _per_tf(entry), 2)


def step(entry: Dict, bar: Bar, now_iso: str) -> None:
    """Advance one entry by one path bar (the rules in the module docstring)."""
    if entry.get('status') == 'closed':
        return
    label, o, h, l, c = bar[0], float(bar[1]), float(bar[2]), float(bar[3]), float(bar[4])
    d, e, s, t, dist, risk = entry['dir'], entry['entry'], entry['stop'], entry.get('target'), entry.get('distal'), entry['risk']
    entry['n'] = entry.get('n', 0) + 1
    entry['last'] = label
    fav = (lambda x: (x - e) / risk) if d > 0 else (lambda x: (e - x) / risk)
    hi_fav, lo_adv = (h, l) if d > 0 else (l, h)          # favourable / adverse extreme of the bar

    def mark_mfe(px):
        entry['mfe_r'] = round(max(entry.get('mfe_r') or 0.0, fav(px)), 3)

    def mark_mae(px, cap=None):
        v = max(entry.get('mae_r') or 0.0, -fav(px))
        entry['mae_r'] = round(min(v, cap) if cap is not None else v, 3)

    if entry['status'] == 'pending':
        gap_past = dist is not None and (o < dist if d > 0 else o > dist)
        touched = (l <= e) if d > 0 else (h >= e)
        if gap_past:
            entry['why'] = 'distal'
            _close(entry, 'cancelled', bar, None, now_iso)
            return
        if not touched:
            if t is not None and (h >= t if d > 0 else l <= t):
                entry['why'] = 'target'
                _close(entry, 'cancelled', bar, None, now_iso)
            elif entry['n'] >= path_bars(entry, UNFILLED_BARS):
                entry['why'] = 'unfilled'
                _close(entry, 'expired', bar, None, now_iso)
            return
        entry['status'] = 'open'
        entry['fill_i'] = entry['n']                        # the fill bar is bar 0 of the trade
        entry['fill_t'] = label
        entry['mfe_r'], entry['mae_r'] = 0.0, 0.0
        if (l <= s) if d > 0 else (h >= s):                 # stop first, also on the fill bar
            mark_mae(lo_adv, 1.0)
            entry['hit_1r'] = (entry.get('mfe_r') or 0) >= 1
            _close(entry, 'stop', bar, -1.0, now_iso)
            return
        mark_mfe(hi_fav)
        mark_mae(lo_adv)
        entry['hit_1r'] = entry['mfe_r'] >= 1
        return
    # open: stop first, then target, then the time limit
    if (l <= s) if d > 0 else (h >= s):
        mark_mae(lo_adv, 1.0)
        _close(entry, 'stop', bar, -1.0, now_iso)
        return
    mark_mae(lo_adv)
    if t is not None and (h >= t if d > 0 else l <= t):
        entry['mfe_r'] = round(max(entry.get('mfe_r') or 0.0, entry.get('target_r') or fav(t)), 3)
        entry['mfe_r'] = min(entry['mfe_r'], entry.get('target_r') or entry['mfe_r'])
        entry['hit_1r'] = entry['mfe_r'] >= 1
        _close(entry, 'target', bar, fav(t), now_iso)
        return
    mark_mfe(hi_fav)
    entry['hit_1r'] = entry['mfe_r'] >= 1
    if entry['n'] - entry['fill_i'] >= path_bars(entry, OPEN_BARS):
        _close(entry, 'expired', bar, fav(c), now_iso)


def resolve(entry: Dict, bars: Sequence[Bar], now_iso: str) -> int:
    """Feed the entry its path bars. bars: oldest first, closed bars only, labels comparable as strings. Recomputes
    from scratch when the bars reach back to the publication (asof), else continues after the last processed bar
    (gap = true when the bars do not reach back to it either). Returns the bars processed."""
    if entry.get('status') == 'closed' or not bars:
        return 0
    asof = entry['asof']
    last = entry.get('last')
    if bars[0][0] <= asof:
        _reset(entry)
        start = asof
    elif last is not None:
        start = last
        if bars[0][0] > last:
            entry['gap'] = True
    else:
        start = asof
        entry['gap'] = True
    n = 0
    for b in bars:
        if b[0] <= start:
            continue
        step(entry, b, now_iso)
        n += 1
        if entry['status'] == 'closed':
            break
    return n


# ---- candles -------------------------------------------------------------------------------------------------------
def fx_bars(out_dir: str) -> Tuple[Dict[str, List[Bar]], Dict[str, str]]:
    """{sym: H1 bars} + {sym: class} from the published detail shards (public/fx/d/*.json)."""
    bars: Dict[str, List[Bar]] = {}
    cls: Dict[str, str] = {}
    for f in sorted(glob.glob(os.path.join(out_dir, 'd', '*.json'))):
        for sym, det in (load_json(f).get('instruments') or {}).items():
            cls[sym] = det.get('cls') or ''
            rows = ((det.get('bars') or {}).get('H1')) or []
            bs = [(str(r[0]), float(r[1]), float(r[2]), float(r[3]), float(r[4])) for r in rows if len(r) >= 5]
            if bs:
                bars[sym] = sorted(bs)
    return bars, cls


def _unpack(pb: Dict) -> List[Bar]:
    if not pb or not pb.get('t0'):
        return []
    d0 = dt.date.fromisoformat(pb['t0'])
    return [((d0 + dt.timedelta(days=o)).isoformat(), *map(float, b[:4])) for o, b in zip(pb.get('dt') or [], pb.get('b') or [])
            if len(b) >= 4]


def stock_bars(syms: Iterable[str], cache_dir: str, out_dir: str, upto: str = '') -> Dict[str, List[Bar]]:
    """{sym: daily bars}: the scan's own cache (full history), else the published shard (120 days, listed tickers).
    upto: the scan's session date (a bar after it may still be forming)."""
    want = set(syms)
    out: Dict[str, List[Bar]] = {}
    for sym in want:
        js = load_json(os.path.join(cache_dir, 'daily', f'{sym}.json'))
        rows = js.get('bars') or []
        bs = [(str(r[0])[:10], float(r[1]), float(r[2]), float(r[3]), float(r[4])) for r in rows if len(r) >= 5]
        if bs:
            out[sym] = bs
    miss = want - set(out)
    if miss:
        for f in sorted(glob.glob(os.path.join(out_dir, 't', '*.json'))):
            for sym, det in (load_json(f).get('tickers') or {}).items():
                if sym in miss and sym not in out:
                    bs = _unpack(det.get('bars') or {})
                    if bs:
                        out[sym] = bs
    for sym in list(out):
        bs = sorted({b[0]: b for b in out[sym]}.values())
        out[sym] = [b for b in bs if not upto or b[0] <= upto]
    return out


# ---- bound + summary -----------------------------------------------------------------------------------------------
def group_keys(e: Dict) -> List[str]:
    """The entry's base group '<market>|<kind>|<tf>|<side>' first (base groups never overlap: summing them over a
    market counts each idea once, as learner.live_summary does), then its tagged groups '<base>|<tag>'."""
    base = f"{e['market']}|{e['kind']}|{e['tf']}|{e['side']}"
    keys = [base]
    tg = e.get('tags') or {}
    if e.get('watch'):
        keys.append(base + '|watch')
    if tg.get('ct') is True:
        keys.append(base + '|ct')
    elif tg.get('ct') is False:
        keys.append(base + '|with-trend')
    for k in ('zone_type', 'pattern', 'loc', 'watch_kind', 'target_kind', 'area', 'removed', 'turn'):
        if tg.get(k) not in (None, ''):
            keys.append(f'{base}|{k}:{tg[k]}')
    if tg.get('loc_ok') is not None:
        keys.append(f"{base}|loc_ok:{'yes' if tg['loc_ok'] else 'no'}")
    sc = _num(tg.get('score'))
    if sc is not None:
        keys.append(f"{base}|score:{'9+' if sc >= 9 else ('7-8' if sc >= 7 else '<7')}")
    if e.get('cls') and e['cls'] != e['market']:
        keys.append(f"{base}|cls:{e['cls']}")
    return keys


def _zero() -> Dict:
    return {'n': 0, 'filled': 0, 'win': 0, 'sum_r': 0.0, 'sum_mfe': 0.0, 'sum_mae': 0.0, 'hit_1r': 0}


def _add(acc: Dict, e: Dict) -> None:
    acc['n'] += 1
    if e.get('filled'):
        acc['filled'] += 1
        r = e.get('r') or 0.0
        acc['win'] += 1 if r > 0 else 0
        acc['sum_r'] += r
        acc['sum_mfe'] += e.get('mfe_r') or 0.0
        acc['sum_mae'] += e.get('mae_r') or 0.0
        acc['hit_1r'] += 1 if e.get('hit_1r') else 0


def _merge(a: Dict, b: Dict) -> Dict:
    return {k: a.get(k, 0) + b.get(k, 0) for k in _zero()}


def _view(acc: Dict) -> Dict:
    f = acc['filled']
    q = (lambda x: round(x / f, 3)) if f else (lambda x: None)
    return {'n': acc['n'], 'filled': f, 'win': q(acc['win']), 'exp_r': q(acc['sum_r']), 'avg_mfe_r': q(acc['sum_mfe']),
            'avg_mae_r': q(acc['sum_mae']), 'hit_1r': q(acc['hit_1r'])}


def sums_of(entries: Iterable[Dict]) -> Dict[str, Dict]:
    g: Dict[str, Dict] = {}
    for e in entries:
        if e.get('status') != 'closed':
            continue
        for k in group_keys(e):
            _add(g.setdefault(k, _zero()), e)
    return g


def bound(ledger: Dict, now: dt.datetime, keep_days: int = KEEP_DAYS, max_entries: int = MAX_ENTRIES) -> int:
    """Archive (count into ledger['archive'] sums, then drop) the closed entries closed more than keep_days ago, and
    the oldest closed ones beyond max_entries. Returns how many were dropped."""
    ent = ledger.setdefault('entries', {})
    arch = ledger.setdefault('archive', {'groups': {}, 'n': 0})
    cut = _iso(now - dt.timedelta(days=keep_days))
    closed = sorted(((e.get('closed_at') or '', k) for k, e in ent.items() if e.get('status') == 'closed'))
    drop = [k for t, k in closed if t < cut]
    extra = len(ent) - len(drop) - max_entries
    if extra > 0:
        rest = [k for t, k in closed if t >= cut]
        drop += rest[:extra]
    if not drop:
        return 0
    add = sums_of(ent[k] for k in drop)
    for g, acc in add.items():
        arch['groups'][g] = _merge(arch['groups'].get(g) or {}, acc)
    arch['n'] = int(arch.get('n') or 0) + len(drop)
    for k in drop:
        del ent[k]
    return len(drop)


def summary(ledgers: Sequence[Dict], now: dt.datetime) -> Dict:
    entries = [e for lg in ledgers for e in (lg.get('entries') or {}).values()]
    closed = [e for e in entries if e.get('status') == 'closed']
    cut = _iso(now - dt.timedelta(days=WINDOW_DAYS))
    all_sums = sums_of(closed)
    for lg in ledgers:
        for g, acc in ((lg.get('archive') or {}).get('groups') or {}).items():
            all_sums[g] = _merge(all_sums.get(g) or _zero(), acc)
    w90 = sums_of(e for e in closed if (e.get('closed_at') or '') >= cut)

    def views(sums: Dict[str, Dict], tagged: bool) -> Dict[str, Dict]:
        return {g: _view(a) for g, a in sorted(sums.items()) if (g.count('|') > 3) == tagged}
    all_v = views(all_sums, False)
    recent = sorted(closed, key=lambda e: (e.get('closed_at') or '', e.get('exit_t') or ''), reverse=True)[:RECENT_N]
    status = {}
    for e in entries:
        status[e.get('status') or 'pending'] = status.get(e.get('status') or 'pending', 0) + 1
    return {'schema': SCHEMA, 'generated_at': _iso(now), 'groups': all_v,
            'windows': {f'{WINDOW_DAYS}d': views(w90, False), 'all': all_v},
            # context-tag breakdowns '<market>|<kind>|<tf>|<side>|<tag>' (they overlap each other and their base group,
            # so they are kept out of groups / windows, whose base groups sum to the market total)
            'tags': {f'{WINDOW_DAYS}d': views(w90, True), 'all': views(all_sums, True)},
            'counts': {'entries': len(entries), **status,
                       'archived': sum(int((lg.get('archive') or {}).get('n') or 0) for lg in ledgers)},
            'rules': {'unfilled_bars': UNFILLED_BARS, 'open_bars': OPEN_BARS, 'same_bar': 'stop first',
                      'fill': 'limit at entry, traded through', 'cancel': 'target or a gap past the distal before the fill'},
            'recent': [{'market': e['market'], 'sym': e['sym'], 'kind': e['kind'], 'tf': e['tf'], 'side': e['side'],
                        'outcome': e.get('outcome'), 'r': e.get('r'), 'filled': bool(e.get('filled')),
                        'watch': bool(e.get('watch')), 'first_seen': e.get('first_seen'), 'exit_t': e.get('exit_t')}
                       for e in recent]}


# ---- one run -------------------------------------------------------------------------------------------------------
def paths(root: str = ROOT) -> Dict[str, str]:
    learn = os.path.join(root, 'public', 'learn')
    return {'learn': learn, 'fx_ledger': os.path.join(learn, 'ledger-fx.json'),
            'stock_ledger': os.path.join(learn, 'ledger-stock.json'), 'outcomes': os.path.join(learn, 'outcomes.json'),
            'fx': os.path.join(root, 'public', 'fx'), 'scanner': os.path.join(root, 'public', 'scanner'),
            'stock_cache': os.environ.get('SCANNER_CACHE') or os.path.join(root, 'tools', 'stock_scanner', '.cache')}


def run(market: str, root: str = ROOT, now: Optional[dt.datetime] = None, log=print,
        bars: Optional[Dict[str, List[Bar]]] = None) -> Dict:
    """Record the scan's new ideas, resolve the open ones, bound the ledger, rebuild the summary. bars: the path bars
    when the caller already holds them (tests, an in-process hook); default: read from the scan's outputs / cache."""
    t0 = time.time()
    now = now or dt.datetime.now(dt.timezone.utc)
    now_iso = _iso(now)
    P = paths(root)
    lp = P['fx_ledger'] if market == 'fx' else P['stock_ledger']
    ledger = load_json(lp)
    ledger.setdefault('schema', SCHEMA)
    ledger.setdefault('market', market)
    ledger.setdefault('entries', {})
    if market == 'fx':
        fbars, cls_of = fx_bars(P['fx'])
        latest = load_json(os.path.join(P['fx'], 'latest.json'))
        ideas = fx_ideas(latest, load_json(os.path.join(P['fx'], 'arrivals.json')), cls_of, now) if latest else []
        if bars is None:
            bars = fbars
    else:
        latest = load_json(os.path.join(P['scanner'], 'latest.json'))
        ideas = stock_ideas(latest, load_json(os.path.join(P['scanner'], 'arrivals.json')), now) if latest else []
    added = add_ideas(ledger, ideas)
    live = [e for e in ledger['entries'].values() if e.get('status') != 'closed']
    if market == 'stock' and bars is None:
        bars = stock_bars({e['sym'] for e in live}, P['stock_cache'], P['scanner'], upto=(latest.get('date') or '')[:10])
    closed_now = processed = 0
    for e in live:
        processed += resolve(e, (bars or {}).get(e['sym']) or [], now_iso)
        closed_now += e.get('status') == 'closed'
    dropped = bound(ledger, now)
    ledger['updated'] = now_iso
    save_json(lp, ledger, lines_key='entries')
    other = load_json(P['stock_ledger'] if market == 'fx' else P['fx_ledger'])
    summ = summary([ledger, other], now)
    save_json(P['outcomes'], summ)
    st = {'added': added, 'ideas': len(ideas), 'live': len(live) - closed_now, 'closed_now': closed_now,
          'bars': processed, 'dropped': dropped, 'entries': len(ledger['entries']), 'secs': round(time.time() - t0, 2)}
    if log:
        log(f"learn ({market}): {st['ideas']} published idea(s), {added} new; {closed_now} closed this run, "
            f"{st['live']} still open / pending; {dropped} archived; {st['entries']} in the ledger ({st['secs']}s)")
    return st


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description='Live outcome tracker: record the published ideas, resolve them on later candles.')
    ap.add_argument('--market', choices=('fx', 'stock', 'stocks'), required=True)
    ap.add_argument('--root', default=ROOT)
    ap.add_argument('--now', default='', help='ISO time (tests / replays); default: now')
    a = ap.parse_args(argv)
    try:
        run('stock' if a.market == 'stocks' else a.market, a.root, _parse_iso(a.now) if a.now else None)
    except Exception as e:  # noqa: BLE001 - never fails the scan
        print(f'learn ({a.market}): skipped ({type(e).__name__}: {str(e)[:160]})')
    return 0


if __name__ == '__main__':
    sys.exit(main())
