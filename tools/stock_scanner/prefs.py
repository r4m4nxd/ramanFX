"""The owner's bot preferences (set in Telegram, stored by the Supabase telegram-bot function), read once per scan run.

    GET  <bot>?op=prefs         header X-RFX-Key: hex sha256(TELEGRAM_BOT_TOKEN + ':prefs')
         -> {mutes: [{sym, until_utc}], alerts: [{id, sym, kind: 'price'|'zone'|'pct', level?, dir?: 'up'|'down'
             (also 'above'|'below'), pct?}],
             quiet: {from: 'HH:MM', to: 'HH:MM', tz} | null, watch: [sym]}
    POST <bot>?op=alert-fired   {id}, same header (the bot then drops / disarms the alert)

Used by both scanners (FX hourly, stocks daily):
    mutes   a muted symbol gets no instant-alert card (it stays in the lists, the digest detail and the app)
    quiet   during quiet hours the non-urgent messages go out silently (disable_notification), never dropped; new BUY /
            SELL signals and fired price alerts stay audible
    watch   extra symbols merged into the scanner's watchlist
    alerts  price: the latest closed bar's high / low crossed `level` (dir 'up': high >= level, 'down': low <= level,
            none: either; with pct: the bar came within pct% of the level); zone: price inside a located strong zone of
            the symbol (any TF); zone with pct: within pct% of the nearest zone proximal. ONE calm message per fired
            alert, then POST alert-fired (and a local fired-id memory, so a failed POST never repeats the message).
Any failure (no token, timeout 10 s, HTTP error, bad JSON) -> None and the scan runs exactly as without prefs
('prefs unavailable' in the log). Never raises.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import urllib.request
from typing import Dict, List, Optional

BOT_URL = os.environ.get('RFX_BOT_URL') or 'https://dqjzufofmblerslcynzr.supabase.co/functions/v1/telegram-bot'
TIMEOUT = 10.0
_MASKED: list = []


def key(token: str) -> str:
    return hashlib.sha256((token + ':prefs').encode()).hexdigest()


def _req(op: str, body: Optional[Dict] = None, timeout: float = TIMEOUT) -> Dict:
    token = os.environ.get('TELEGRAM_BOT_TOKEN') or ''
    if not token:
        raise RuntimeError('no TELEGRAM_BOT_TOKEN')
    if os.environ.get('GITHUB_ACTIONS') == 'true' and not _MASKED:
        print(f'::add-mask::{key(token)}', flush=True)     # never shown in the Actions log
        _MASKED.append(True)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f'{BOT_URL}?op={op}', data=data, method='POST' if body is not None else 'GET',
                                 headers={'X-RFX-Key': key(token), 'Content-Type': 'application/json',
                                          'User-Agent': 'RamanFX-scanner/1.0'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
    try:
        return json.loads(raw or b'{}')
    except ValueError:
        return {}


def _sym(s) -> str:
    return str(s or '').strip().upper()


def _num(v) -> Optional[float]:
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return f if f == f and abs(f) != float('inf') else None


DIRS = {'up': 'up', 'above': 'up', 'down': 'down', 'below': 'down'}


def normalize(raw) -> Dict:
    """The contract shape with bad entries dropped (unknown kinds, alerts without a symbol / id)."""
    raw = raw if isinstance(raw, dict) else {}
    mutes = [{'sym': _sym(m.get('sym')), 'until_utc': str(m.get('until_utc') or '')}
             for m in raw.get('mutes') or [] if isinstance(m, dict) and _sym(m.get('sym'))]
    alerts = []
    for a in raw.get('alerts') or []:
        if not isinstance(a, dict) or not _sym(a.get('sym')) or a.get('id') in (None, ''):
            continue
        kind = a.get('kind')
        if kind == 'pct':                       # the bot stores 'within pct% of the nearest zone' as its own kind
            kind = 'zone' if _num(a.get('pct')) else None
        if kind not in ('price', 'zone'):
            continue
        d = DIRS.get(str(a.get('dir') or '').lower())
        x = {'id': a['id'], 'sym': _sym(a['sym']), 'kind': kind, 'level': _num(a.get('level')), 'dir': d,
             'pct': _num(a.get('pct'))}
        if kind == 'price' and x['level'] is None:
            continue
        alerts.append(x)
    q = raw.get('quiet')
    quiet = None
    if isinstance(q, dict) and _hm(q.get('from')) is not None and _hm(q.get('to')) is not None:
        quiet = {'from': q['from'], 'to': q['to'], 'tz': q.get('tz') or 'America/Edmonton'}
    watch = sorted({_sym(s) for s in raw.get('watch') or [] if _sym(s)})
    return {'mutes': mutes, 'alerts': alerts, 'quiet': quiet, 'watch': watch}


def fetch(log=print, timeout: float = TIMEOUT) -> Optional[Dict]:
    """The prefs, or None (logged 'prefs unavailable (...)') on any failure."""
    try:
        p = normalize(_req('prefs', timeout=timeout))
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'prefs unavailable ({type(e).__name__}): scanning without mutes / quiet hours / alerts')
        return None
    if log:
        log(f"prefs: {len(p['mutes'])} muted, {len(p['alerts'])} alerts, {len(p['watch'])} extra watch, "
            f"quiet {p['quiet']['from'] + '-' + p['quiet']['to'] if p['quiet'] else 'off'}")
    return p


def alert_fired(aid, log=print) -> bool:
    try:
        _req('alert-fired', {'id': aid})
        return True
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'prefs: alert-fired {aid} not acknowledged ({type(e).__name__})')
        return False


# ---- applying them ------------------------------------------------------------------------------------------------------
def _utc(s: str) -> Optional[dt.datetime]:
    try:
        t = dt.datetime.fromisoformat(str(s).replace('Z', '+00:00'))
    except ValueError:
        return None
    return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)


def _now(now: Optional[dt.datetime]) -> dt.datetime:
    now = now or dt.datetime.now(dt.timezone.utc)
    return now if now.tzinfo else now.replace(tzinfo=dt.timezone.utc)


def muted_set(prefs: Optional[Dict], now: Optional[dt.datetime] = None) -> set:
    """Symbols muted right now (an unparsable / empty until = muted until the bot removes it)."""
    if not prefs:
        return set()
    t = _now(now)
    out = set()
    for m in prefs.get('mutes') or []:
        u = _utc(m.get('until_utc') or '')
        if u is None or u > t:
            out.add(m['sym'])
    return out


def _hm(s) -> Optional[int]:
    try:
        h, m = str(s).split(':')[:2]
        h, m = int(h), int(m)
    except (ValueError, AttributeError):
        return None
    return h * 60 + m if 0 <= h <= 24 and 0 <= m < 60 else None


def in_quiet(prefs: Optional[Dict], now: Optional[dt.datetime] = None) -> bool:
    """Now inside the quiet window (local clock of quiet.tz; from > to wraps past midnight, from == to = never)."""
    q = (prefs or {}).get('quiet')
    if not q:
        return False
    a, b = _hm(q.get('from')), _hm(q.get('to'))
    if a is None or b is None or a == b:
        return False
    try:
        from zoneinfo import ZoneInfo
        loc = _now(now).astimezone(ZoneInfo(q.get('tz') or 'America/Edmonton'))
    except Exception:  # noqa: BLE001
        loc = _now(now)
    m = loc.hour * 60 + loc.minute
    return a <= m < b if a < b else (m >= a or m < b)


def watch_syms(prefs: Optional[Dict]) -> List[str]:
    return list((prefs or {}).get('watch') or [])


TFW = {'H1': '1-hour', 'H4': '4-hour', 'D1': 'daily', 'W1': 'weekly', 'MN': 'monthly', '3M': 'quarterly'}


def _tfw(z: Dict) -> str:
    return TFW.get(z.get('tf') or '', z.get('tf') or '')


def check_alert(a: Dict, bar: Optional[Dict], zones: List[Dict], price: Optional[float]) -> Optional[Dict]:
    """{'alert', 'why', 'zone'?} when the alert fires, else None.
    bar = the latest closed bar {h, l, c}; zones = the symbol's located strong zones [{tf, side, prox, dist, sec, loc_ok}]
    (sec 'in' = price inside, 'near' / 'left' / None otherwise); price = the latest close."""
    if a['kind'] == 'price':
        lv = a.get('level')
        if lv is None or not bar:
            return None
        h, l = bar.get('h'), bar.get('l')
        if h is None or l is None:
            return None
        pct = a.get('pct')
        band = abs(lv) * pct / 100 if pct else 0.0
        d = a.get('dir')
        hit = (h >= lv - band) if d == 'up' else (l <= lv + band) if d == 'down' else (l - band <= lv <= h + band)
        if not hit:
            return None
        what = ('rose to' if d == 'up' else 'fell to' if d == 'down' else 'traded at')
        why = f"the last closed bar {what} your level" + (f" (within {pct:g}%)" if pct else '')
        return {'alert': a, 'why': why}
    zs = [z for z in zones or [] if z.get('loc_ok') is not False]
    if not zs:
        return None
    pct = a.get('pct')
    if pct:
        if not price:
            return None

        def dist(z):
            return 0.0 if z.get('sec') == 'in' else abs(price - z['prox']) / price * 100
        z = min(zs, key=dist)
        if dist(z) > pct:
            return None
        return {'alert': a, 'zone': z, 'why': f"price is within {pct:g}% of the {_tfw(z)} {z['side']} proximal"
                if dist(z) > 0 else f"price is inside the {_tfw(z)} {z['side']}"}
    inside = [z for z in zs if z.get('sec') == 'in']
    if not inside:
        return None
    z = inside[0]
    return {'alert': a, 'zone': z, 'why': f"price entered the {_tfw(z)} {z['side']} (a located strong zone)"}


def evaluate(prefs: Optional[Dict], per_sym: Dict[str, Dict], fired_before: Optional[Dict] = None) -> List[Dict]:
    """Every alert of prefs that fires this run. per_sym[SYM] = {'bar', 'zones', 'price', 'digits'} (symbols this run
    analysed; the others are skipped silently). fired_before = {id: iso} already sent (never twice)."""
    out = []
    seen = fired_before or {}
    for a in (prefs or {}).get('alerts') or []:
        if str(a['id']) in seen:
            continue
        info = per_sym.get(a['sym'])
        if not info:
            continue
        r = check_alert(a, info.get('bar'), info.get('zones') or [], info.get('price'))
        if r:
            out.append({**r, 'sym': a['sym'], 'price': info.get('price'), 'digits': info.get('digits', 2)})
    return out
