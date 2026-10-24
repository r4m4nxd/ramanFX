"""narration_audio/<source>/<NN>/chapters.json -> src/core/narration/recorded.json (what the app can play as recorded audio).
Usage: python3 -I tools/narration/make_index.py   (after upload_drive.py has extracted the audio branches)"""
import glob, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out = {}
for p in sorted(glob.glob(f'{ROOT}/narration_audio/*/*/chapters.json') + glob.glob(f'{ROOT}/tools/narration/out/*/*/chapters.json')):
    c = json.load(open(p)); v = c.get('voices', {}).get('am_michael')
    if not v or not os.path.exists(os.path.join(os.path.dirname(p), v['file'])): continue
    out[f"{c['source']}:{c['n']}"] = {'s': round(v['seconds'], 1), 'h': v['textHash'], 'b': os.path.getsize(os.path.join(os.path.dirname(p), v['file'])),
                                      'c': [[round(x['start'], 1), x['title']] for x in v['chapters']]}
dst = f'{ROOT}/src/core/narration/recorded.json'
os.makedirs(os.path.dirname(dst), exist_ok=True)
json.dump(out, open(dst, 'w'), separators=(',', ':'), ensure_ascii=False)
print(len(out), 'lessons ->', dst, os.path.getsize(dst), 'bytes')
