"""Telegram webhook setup for the two-way bot (supabase/functions/telegram-bot). Run by
.github/workflows/telegram-webhook.yml, which holds TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID.

    S = HMAC-SHA256(bot token, 'ramanfx-webhook:<label>')   webhook secret (re-runs with the same label reuse it)
    o = sha256(TELEGRAM_CHAT_ID)                             owner check, in the webhook URL

1. ping the function with S + o (the first ping inside the SQL-opened window claims the row; see index.ts)
2. a synthetic '/help' from the owner's chat: checks auth + owner + command end to end, and gives the list text
3. setWebhook (secret_token=S, allowed_updates=['message', 'callback_query'], drop_pending_updates) + setMyCommands (commands.json)
4. getWebhookInfo (pending count, last error)
5. the command list as one message, pinned (silently); the previous pinned list (id kept in the function's table)
   is unpinned, so re-runs replace the pin. On a push run the list is only re-sent when its text changed. The list
   message carries the persistent quick-reply keyboard ([FX] [Stocks] [Near] / [Signals] [Times] [Next]).
6. SAMPLE_CHART=true: one album with the 4-timeframe chart of EURUSD and of the top stock signal (the function's
   /chart replies; the PNG route is fetched once first to check it renders).
Logs only ok / false, HTTP codes and counts: never the token, chat id, secret, o or the webhook URL.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import sys
import time
import urllib.error
import urllib.request

PNG_MAGIC = b'\x89PNG'
FN = 'https://dqjzufofmblerslcynzr.supabase.co/functions/v1/telegram-bot'
HERE = os.path.dirname(os.path.abspath(__file__))
COMMANDS = os.path.join(HERE, '..', '..', 'supabase', 'functions', 'telegram-bot', 'commands.json')


def post(url: str, body: dict, headers: dict | None = None, timeout: int = 30):
    """(http code, parsed JSON or None); never raises on HTTP errors."""
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read()
            code = r.status
    except urllib.error.HTTPError as e:
        raw, code = e.read(), e.code
    except Exception as e:  # noqa: BLE001
        return 0, {'error': type(e).__name__}
    try:
        return code, json.loads(raw) if raw else None
    except ValueError:
        return code, None


def main() -> int:
    token, chat = os.environ.get('TELEGRAM_BOT_TOKEN', ''), os.environ.get('TELEGRAM_CHAT_ID', '')
    if not token or not chat:
        print('::error::TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set')
        return 1
    label = (os.environ.get('LABEL') or 'v1').strip()
    event = os.environ.get('EVENT', '')
    secret = hmac.new(token.encode(), f'ramanfx-webhook:{label}'.encode(), hashlib.sha256).hexdigest()
    o = hashlib.sha256(chat.encode()).hexdigest()
    print(f'::add-mask::{secret}')
    print(f'::add-mask::{o}')
    fn = f'{FN}?o={o}'
    hdr = {'X-Telegram-Bot-Api-Secret-Token': secret}
    tg = lambda method, body: post(f'https://api.telegram.org/bot{token}/{method}', body)  # noqa: E731

    # 1. claim / check
    code, st = post(fn, {'rfx_setup': {'op': 'state'}}, hdr)
    print(f'function ping: HTTP {code} auth={(st or {}).get("auth")}')
    if code != 200:
        print('::error::the function refused this secret (row not opened for a first claim, or a rotation is needed: '
              "update public.rfx_bot_config set rotate_until = now() + interval '15 minutes' where id = 1)")
        return 1

    # 2. end-to-end /help through the function (as the owner's chat)
    upd = {'update_id': 1, 'message': {'message_id': 1, 'date': int(time.time()), 'text': '/help',
                                      'chat': {'id': int(chat) if chat.lstrip('-').isdigit() else chat, 'type': 'private'}}}
    code, rep = post(fn, upd, hdr)
    ok_help = code == 200 and isinstance(rep, dict) and rep.get('method') == 'sendMessage' and bool(rep.get('text'))
    print(f'function /help: HTTP {code} ok={ok_help}')
    if not ok_help:
        print('::error::the function did not answer /help')
        return 1

    # time-zone rules the function's runtime uses (Calgary is UTC-6 all year from 2026-11-01 in tzdata 2026c)
    code, nx = post(fn, {**upd, 'message': {**upd['message'], 'text': '/next'}}, hdr)
    lines = [x for x in ((nx or {}).get('text') or '').split('\n') if '·' in x and ('AM' in x or 'PM' in x)]
    print('function /next: HTTP %s | %s' % (code, ' | '.join(lines)))

    # 3. webhook + menu
    with open(COMMANDS) as f:
        commands = json.load(f)
    _, r = tg('setWebhook', {'url': fn, 'secret_token': secret, 'allowed_updates': ['message', 'callback_query'], 'drop_pending_updates': True, 'max_connections': 5})
    ok_hook = bool((r or {}).get('ok'))
    print(f'setWebhook ok={ok_hook}')
    _, r = tg('setMyCommands', {'commands': commands})
    ok_cmds = bool((r or {}).get('ok'))
    print(f'setMyCommands ok={ok_cmds} ({len(commands)} commands)')

    # 4. status
    time.sleep(2)
    _, r = tg('getWebhookInfo', {})
    info = (r or {}).get('result') or {}
    print(f"getWebhookInfo ok={bool((r or {}).get('ok'))} url_set={bool(info.get('url'))} url_matches={info.get('url') == fn} "
          f"pending_update_count={info.get('pending_update_count')} last_error_message={info.get('last_error_message') or 'none'}")

    # 5. pinned command list
    text = rep['text']
    h = hashlib.sha256(text.encode()).hexdigest()
    if os.environ.get('RESEND_LIST', 'true') != 'true':
        print('command list: not re-sent (input)')
    elif event == 'push' and (st or {}).get('hash') == h and (st or {}).get('pinned'):
        print('command list unchanged: not re-sent')
    else:
        msg = {'chat_id': chat, 'text': text, 'parse_mode': 'HTML', 'disable_web_page_preview': True, 'disable_notification': False}
        if rep.get('reply_markup'):
            msg['reply_markup'] = rep['reply_markup']
        _, r = tg('sendMessage', msg)
        mid = ((r or {}).get('result') or {}).get('message_id')
        print(f'sendMessage (command list) ok={bool(mid)}')
        if mid:
            _, r = tg('pinChatMessage', {'chat_id': chat, 'message_id': mid, 'disable_notification': True})
            print(f"pinChatMessage ok={bool((r or {}).get('ok'))}")
            prev = (st or {}).get('pinned')
            code, _ = post(fn, {'rfx_setup': {'op': 'swap', 'pinned': mid, 'hash': h}}, hdr)
            print(f'pin id saved: HTTP {code}')
            if prev and prev != mid:
                _, r = tg('unpinChatMessage', {'chat_id': chat, 'message_id': prev})
                print(f"unpin previous list ok={bool((r or {}).get('ok'))}")
    ok_chart = True
    if os.environ.get('SAMPLE_CHART') == 'true':
        ok_chart = sample_charts(fn, hdr, upd, chat, tg)
    return 0 if (ok_hook and ok_cmds and ok_chart) else 1


def top_stock() -> str:
    try:
        with open(os.path.join(HERE, '..', '..', 'public', 'scanner', 'latest.json')) as f:
            sig = json.load(f).get('signals') or []
    except (OSError, ValueError):
        return 'NVDA'
    sig = sorted(sig, key=lambda s: (s.get('kind') != 'BUY', -(s.get('score') or 0), -(s.get('rr') or 0)))
    return sig[0]['symbol'] if sig else 'NVDA'


def sample_charts(fn: str, hdr: dict, upd: dict, chat: str, tg) -> bool:
    media = []
    for sym in ('EURUSD', top_stock()):
        code, rep = post(fn, {**upd, 'message': {**upd['message'], 'text': f'/chart {sym}'}}, hdr)
        photo = (rep or {}).get('photo') if isinstance(rep, dict) else None
        print(f"function /chart ({'FX' if sym == 'EURUSD' else 'top stock'}): HTTP {code} photo={bool(photo)}")
        if not photo:
            continue
        try:
            t0 = time.time()
            with urllib.request.urlopen(photo, timeout=60) as r:
                body = r.read()
                is_png = body[:4] == PNG_MAGIC
                print(f"chart PNG: HTTP {r.status} {r.headers.get('Content-Type')} {len(body)} bytes {time.time() - t0:.1f}s png={is_png}")
        except Exception as e:  # noqa: BLE001
            print(f'chart PNG fetch failed: {type(e).__name__} {getattr(e, "code", "")}')
            continue
        media.append({'type': 'photo', 'media': photo, 'caption': rep.get('caption') or '', 'parse_mode': 'HTML'})
    if not media:
        return False
    if len(media) == 1:
        _, r = tg('sendPhoto', {'chat_id': chat, 'photo': media[0]['media'], 'caption': media[0]['caption'], 'parse_mode': 'HTML'})
    else:
        _, r = tg('sendMediaGroup', {'chat_id': chat, 'media': media})
    ok = bool((r or {}).get('ok'))
    print(f'sample chart album sent ok={ok} ({len(media)} images)' + ('' if ok else f" desc={(r or {}).get('description', '')[:80]}"))
    return ok


if __name__ == '__main__':
    sys.exit(main())
