"""The bot's guests (supabase/functions/telegram-bot/guests.ts): the market messages the GitHub jobs send to the owner also
go to each active guest, honouring THEIR markets, mutes and quiet hours. Never the owner's personal messages.

    prefs.fetch()['guests']   (the ?op=prefs answer, key-protected) = [{id: 12-hex key, chat_id, name, markets: ['stocks',
                              'crypto', 'fx', 'indices'], mutes, alerts, quiet, watch}]
    POST ?op=guest-inactive {guest: id}          a guest blocked the bot (Telegram 403): the bot marks them inactive
    POST ?op=guest-alert-fired {guest: id, id}   one of their own alerts fired

Markets: an FX-scanner symbol's class (public/fx/latest.json map cls) decides: major / cross / exotic / metal = 'fx'
(forex & metals), cfd = 'indices' (indices & commodities), crypto = 'crypto'; anything else is a stock. A guest gets a
symbol's messages only when its market is on (default: stocks only).

Usage in a job, AFTER the owner's send (the owner's messages stay exactly as before):
    G.broadcast(lambda g: G.hush(build_for(g), g), prefs)
Only when the owner's Telegram is configured (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) and RFX_NO_GUESTS is not set; test
and sample runs never call it. Logs counts only: never a chat id, a name or the token. Never raises.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import sys
import time
from typing import Callable, Dict, Iterable, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import notify as SN  # noqa: E402
import prefs as P  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(HERE))
MARKETS = ('stocks', 'crypto', 'fx', 'indices')
DEFAULT_MARKETS = ['stocks']
FX_MARKET = {'major': 'fx', 'cross': 'fx', 'exotic': 'fx', 'metal': 'fx', 'cfd': 'indices', 'crypto': 'crypto'}
_MASKED: set = set()


def key(chat) -> str:
    """The guest's non-secret handle (guests.ts guestKey): the first 12 hex of sha256(chat id)."""
    return hashlib.sha256(str(chat).encode()).hexdigest()[:12]


def _mask(v: str) -> None:
    if os.environ.get('GITHUB_ACTIONS') == 'true' and v not in _MASKED:
        print(f'::add-mask::{v}', flush=True)
        _MASKED.add(v)


def of(prefs: Optional[Dict]) -> List[Dict]:
    """The active guests of a prefs answer, each a prefs-shaped dict (P.muted_set / P.in_quiet / P.evaluate work on it)
    plus 'id', 'chat', 'markets'. [] when there are none or prefs is None."""
    out = []
    for g in (prefs or {}).get('guests') or []:
        if not isinstance(g, dict):
            continue
        chat = str(g.get('chat_id') or '').strip()
        if not chat.lstrip('-').isdigit():
            continue
        _mask(chat)
        n = P.normalize({k: g.get(k) for k in ('mutes', 'alerts', 'quiet', 'watch')})
        mk = g.get('markets')
        n['markets'] = [m for m in mk if m in MARKETS] if isinstance(mk, list) else list(DEFAULT_MARKETS)
        n['id'] = str(g.get('id') or key(chat))
        n['chat'] = chat
        out.append(n)
    return out


# ---- markets ---------------------------------------------------------------------------------------------------------
_CLASSES: Dict[str, Dict[str, str]] = {}


def fx_classes(path: Optional[str] = None) -> Dict[str, str]:
    """{FX-scanner symbol: market} from public/fx/latest.json (cached); {} when the file is missing."""
    path = path or os.path.join(ROOT, 'public', 'fx', 'latest.json')
    if path not in _CLASSES:
        try:
            with open(path) as f:
                rows = json.load(f).get('map') or []
            _CLASSES[path] = {str(r.get('sym')): FX_MARKET.get(str(r.get('cls') or r.get('k') or ''), 'fx') for r in rows if r.get('sym')}
        except (OSError, ValueError, AttributeError):
            _CLASSES[path] = {}
    return _CLASSES[path]


def market_of(sym: str, classes: Optional[Dict[str, str]] = None) -> str:
    classes = fx_classes() if classes is None else classes
    return classes.get(str(sym or '').upper(), 'stocks')


def wants(g: Dict, market: str) -> bool:
    return market in (g.get('markets') or [])


def wants_fx_scanner(g: Dict) -> bool:
    """Any market the FX scanner covers (fx / crypto / indices)."""
    return any(m in (g.get('markets') or []) for m in ('fx', 'crypto', 'indices'))


def muted(g: Dict, classes: Optional[Dict[str, str]] = None, now: Optional[dt.datetime] = None) -> set:
    """Their own muted symbols + every FX-scanner symbol of a market they switched off (pass as `muted` to builders)."""
    classes = fx_classes() if classes is None else classes
    off = {s for s, m in classes.items() if not wants(g, m)}
    return P.muted_set(g, now) | off


def hush(msgs: Iterable, g: Dict, loud: bool = False, now: Optional[dt.datetime] = None) -> List:
    """Their quiet hours: silent unless loud (new signals / price alerts stay audible, as for the owner)."""
    q = P.in_quiet(g, now)
    return [SN.silenced(m, q and not loud) for m in msgs]


def fired(g: Dict, per_sym: Dict[str, Dict], fired_before: Optional[Dict] = None) -> List[Dict]:
    """Their own alerts that fire this run (P.evaluate), skipping ids in fired_before under fired_key. Any market: an
    alert they set is wanted whatever /markets says."""
    pre = f"g:{g['id']}:"
    seen = {k[len(pre):]: v for k, v in (fired_before or {}).items() if str(k).startswith(pre)}
    return P.evaluate(g, per_sym, seen)


def fired_key(g: Dict, aid) -> str:
    return f"g:{g['id']}:{aid}"


# ---- sending ---------------------------------------------------------------------------------------------------------
def enabled() -> bool:
    return bool(os.environ.get('TELEGRAM_BOT_TOKEN') and os.environ.get('TELEGRAM_CHAT_ID')) and not os.environ.get('RFX_NO_GUESTS')


def send_to(chat: str, messages: List, pause: float = 1.1, post: Optional[Callable] = None, sleep=time.sleep) -> str:
    """'ok' | 'blocked' (403: they blocked the bot / never started it) | 'fail'. Same fallbacks as notify.send."""
    token = os.environ.get('TELEGRAM_BOT_TOKEN') or ''
    post = post or SN._post
    status = 'ok'
    for k, m in enumerate(messages):
        if k:
            sleep(pause)
        fields = {'chat_id': chat, 'text': str(m), 'parse_mode': 'HTML', 'disable_web_page_preview': 'true'}
        if getattr(m, 'silent', False):
            fields['disable_notification'] = 'true'
        if getattr(m, 'buttons', None):
            fields['reply_markup'] = json.dumps({'inline_keyboard': m.buttons})
        sent = False
        for attempt in range(5):
            try:
                r = post(token, fields)
            except Exception:  # noqa: BLE001
                break
            if r.get('ok'):
                sent = True
                break
            if r.get('code') == 403:
                return 'blocked'
            if r.get('code') == 429 and attempt < 4:
                sleep(min(max(r.get('retry', 0), 1), 30) + 0.5)
                continue
            desc = str(r.get('desc', '')).lower()
            if r.get('code') == 400 and 'chat not found' in desc:
                return 'blocked'
            if r.get('code') == 400 and '<blockquote expandable>' in fields['text'] and ('parse' in desc or 'entit' in desc or 'tag' in desc):
                fields['text'] = fields['text'].replace('<blockquote expandable>', '<blockquote>')
                continue
            if r.get('code') == 400 and 'reply_markup' in fields and ('button' in desc or 'markup' in desc or 'url' in desc):
                fields.pop('reply_markup')
                continue
            break
        if not sent:
            status = 'fail'
    return status


def mark_inactive(gid: str, log=print) -> bool:
    try:
        P._req('guest-inactive', {'guest': gid})
        return True
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'guests: inactive not acknowledged ({type(e).__name__})')
        return False


def alert_fired(gid: str, aid, log=print) -> bool:
    try:
        P._req('guest-alert-fired', {'guest': gid, 'id': aid})
        return True
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'guests: alert-fired not acknowledged ({type(e).__name__})')
        return False


def broadcast(build: Callable[[Dict], List], prefs: Optional[Dict], log=print, post: Optional[Callable] = None,
              sleep=time.sleep, what: str = 'messages') -> Dict[str, int]:
    """build(guest) -> that guest's messages ([] = nothing for them). Sends to each active guest; a 403 marks them
    inactive. Counts {'sent', 'blocked', 'failed', 'skipped'}; never raises."""
    n = {'sent': 0, 'blocked': 0, 'failed': 0, 'skipped': 0}
    try:
        gs = of(prefs)
        if not gs or not enabled():
            return n
        for k, g in enumerate(gs):
            try:
                msgs = list(build(g) or [])
            except Exception as e:  # noqa: BLE001
                if log:
                    log(f'guests: build failed ({type(e).__name__})')
                n['failed'] += 1
                continue
            if not msgs:
                n['skipped'] += 1
                continue
            if k:
                sleep(0.3)
            st = send_to(g['chat'], msgs, post=post, sleep=sleep)
            if st == 'blocked':
                n['blocked'] += 1
                mark_inactive(g['id'], log=log)
            elif st == 'ok':
                n['sent'] += 1
                g['_sent'] = True
            else:
                n['failed'] += 1
        if log:
            log(f"guests: {what} to {n['sent']} of {len(gs)}" + (f", {n['skipped']} not for them" if n['skipped'] else '')
                + (f", {n['blocked']} blocked the bot (marked inactive)" if n['blocked'] else '') + (f", {n['failed']} failed" if n['failed'] else ''))
    except Exception as e:  # noqa: BLE001
        if log:
            log(f'guests: broadcast skipped ({type(e).__name__})')
    return n


def same(msgs: List, market: Optional[str] = None) -> Callable[[Dict], List]:
    """A builder for messages identical for everyone (reminders, a lesson): their quiet hours; only when `market` is on."""
    return lambda g: hush(msgs, g) if market is None or wants(g, market) else []


def target(prefs: Optional[Dict], to: Optional[str] = None) -> Optional[Dict]:
    """The guest an on-demand scan was asked by (workflow input `to`, env RFX_TO), or None (= the owner)."""
    to = (to if to is not None else os.environ.get('RFX_TO') or '').strip().lower()
    if not to:
        return None
    return next((g for g in of(prefs) if g['id'] == to), None)


def ondemand_send(msgs: List, log=print, prefs: Optional[Dict] = None) -> Optional[bool]:
    """When the on-demand scan was asked by a guest: send the cards to them (not the owner); True / False = sent or
    not, None = not a guest's scan (the caller sends to the owner as before). A missing guest -> False (never the owner)."""
    if not (os.environ.get('RFX_TO') or '').strip():
        return None
    g = target(prefs if prefs is not None else P.fetch(log=None))
    if g is None:
        if log:
            log('on-demand: asked by a guest who is no longer on the list: not sent')
        return False
    st = send_to(g['chat'], list(msgs))
    if st == 'blocked':
        mark_inactive(g['id'], log=log)
    if log:
        log(f'on-demand: {len(msgs)} card(s) to the guest ' + ('sent' if st == 'ok' else 'NOT sent'))
    return st == 'ok'
