"""narration_audio/<source>/<NN>/chapters.json -> src/core/narration/recorded.json (what the app can play as recorded audio).
Usage: python3 -I tools/narration/make_index.py   (after upload_drive.py has extracted the audio branches)"""
import glob, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out, seen = {}, {}
for p in sorted(glob.glob(f'{ROOT}/narration_audio/*/*/chapters.json') + glob.glob(f'{ROOT}/tools/narration/out/*/*/chapters.json')):
    try: c = json.load(open(p))
    except ValueError: continue  # being extracted right now
    v = c.get('voices', {}).get('am_michael')
    if not v or not os.path.exists(os.path.join(os.path.dirname(p), v['file'])): continue
    k = f"{c['source']}:{c['n']}"
    if k in seen and seen[k] > os.path.getmtime(p): continue  # keep the newest render
    seen[k] = os.path.getmtime(p)
    out[k] = {'s': round(v['seconds'], 1), 'h': v['textHash'], 'b': os.path.getsize(os.path.join(os.path.dirname(p), v['file'])),
                                      'c': [[round(x['start'], 1), x['title']] for x in v['chapters']]}
# byte size of the copy actually on Drive (the local file can be a different encode of the same text, or mid-extraction)
try: led = json.load(open(os.path.expanduser('~/.config/ramanfx/drive_uploaded.json')))
except Exception: led = {}
for k, v in out.items():
    d = led.get(f'{k}:am_michael')
    if d and d.get('textHash') in (v['h'], None) and d.get('bytes'): v['b'] = d['bytes']
dst = f'{ROOT}/src/core/narration/recorded.json'
os.makedirs(os.path.dirname(dst), exist_ok=True)
json.dump(out, open(dst, 'w'), separators=(',', ':'), ensure_ascii=False)
print(len(out), 'lessons ->', dst, os.path.getsize(dst), 'bytes')
