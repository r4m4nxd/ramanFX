"""Send the Telegram messages of the currently published scans (public/fx, public/scanner) once, as a layout test.
Run by .github/workflows/telegram-preview.yml (manual). Nothing is scanned; the bot token comes from the secrets.
--headlines: instead ONE '🧪 Sample headlines' message (tools/news/headlines.py, live Alpaca News + RSS)."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [os.path.join(ROOT, 'tools', 'fx_scanner'), os.path.join(ROOT, 'tools', 'stock_scanner')]

import fxnotify as FN  # noqa: E402
import notify as SN  # noqa: E402


def headlines_sample() -> str:
    """ONE '🧪 Sample headlines' message in the bot's /news style (top 5 + EURUSD and NVDA), live feeds."""
    import datetime as dt
    sys.path.append(os.path.join(ROOT, 'tools'))
    from news import headlines as NH
    now = dt.datetime.now(dt.timezone.utc)
    rss, general = NH.pool(), NH.alpaca([])
    lines = ['🧪 <b>Sample headlines</b>', '', '📰 <b>Top headlines</b>']
    lines += [f'• {NH.line_for(h, now, 120)}' for h in NH.top(general + rss, now)] or ['(no headlines loaded)']
    for sym in ('EURUSD', 'XAUUSD', 'NVDA', 'BTCUSD'):
        items = (NH.alpaca(NH.tags_for([sym])) if NH.tags_for([sym]) else []) + rss
        hs = NH.for_symbol(items, sym, now, 2)
        if hs:
            lines += ['', f'<b>{sym}</b> (/news {sym})'] + [f'• {NH.line_for(h, now, 110)}' for h in hs]
    lines += ['', 'Sources: Benzinga via Alpaca, investingLive, Investing.com, CNBC, CoinDesk · Calgary time · not advice']
    return '\n'.join(lines)[:4000]


if '--headlines' in sys.argv:
    ok = SN.send([headlines_sample()])
    print('sent' if ok else 'not sent', 'headlines sample')
    sys.exit(0 if ok else 1)

with open(os.path.join(ROOT, 'public', 'fx', 'latest.json')) as f:
    fx = json.load(f)
fxm = FN.preview_messages(fx)
stock = SN.build_messages(SN.load_published(os.path.join(ROOT, 'public', 'scanner')))
msgs = ['🧪 <b>Layout test</b>\nThe next messages are today\'s scans in the new format (nothing new was scanned).']
msgs += fxm['instant alert'][:1] + fxm['daily summary'][:1] + stock[:1]
ok = SN.send(msgs)
print('sent' if ok else 'not sent', len(msgs), 'messages')
sys.exit(0 if ok else 1)
