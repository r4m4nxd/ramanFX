"""Send the Telegram messages of the currently published scans (public/fx, public/scanner) once, as a layout test.
Run by .github/workflows/telegram-preview.yml (manual). Nothing is scanned; the bot token comes from the secrets."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path[:0] = [os.path.join(ROOT, 'tools', 'fx_scanner'), os.path.join(ROOT, 'tools', 'stock_scanner')]

import fxnotify as FN  # noqa: E402
import notify as SN  # noqa: E402

with open(os.path.join(ROOT, 'public', 'fx', 'latest.json')) as f:
    fx = json.load(f)
fxm = FN.preview_messages(fx)
stock = SN.build_messages(SN.load_published(os.path.join(ROOT, 'public', 'scanner')))
msgs = ['🧪 <b>Layout test</b>\nThe next messages are today\'s scans in the new format (nothing new was scanned).']
msgs += fxm['instant alert'][:1] + fxm['daily summary'][:1] + stock[:1]
ok = SN.send(msgs)
print('sent' if ok else 'not sent', len(msgs), 'messages')
sys.exit(0 if ok else 1)
