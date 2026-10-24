#!/usr/bin/env python3
"""Upload rendered narration (am_michael .m4a) to the user's Google Drive, one file per lesson:
<source folder>/NN - Title.m4a. Token: ~/.config/ramanfx/drive_token.json (never in git).
Sources scanned: tools/narration/out/<source>/ and narration_audio/<source>/ (from audio/* branches).
Ledger (no secrets): tools/narration/drive_uploaded.json  {source:n:voice: {id, textHash}}.
--watch: loop every 5 min (fetches origin audio/* branches too)."""
import json, os, re, sys, time, glob, subprocess, urllib.request, urllib.parse, uuid
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOK = os.path.expanduser('~/.config/ramanfx/drive_token.json')
FOLDERS = json.load(open(os.path.join(ROOT, 'tools/narration/drive_folders.json')))
LEDGER = os.path.join(ROOT, 'tools/narration/drive_uploaded.json')
CID, CSEC = '202264815644.apps.googleusercontent.com', 'X4Z3ca8xfWDb1Voo-F9a7ZxJ'  # rclone's public desktop client
VOICE = 'am_michael'
_tok = {'t': None, 'exp': 0}

def token():
    if _tok['t'] and time.time() < _tok['exp'] - 120:
        return _tok['t']
    t = json.load(open(TOK))
    d = urllib.parse.urlencode({'client_id': CID, 'client_secret': CSEC, 'refresh_token': t['refresh_token'], 'grant_type': 'refresh_token'}).encode()
    r = json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token', d, timeout=60))
    _tok.update(t=r['access_token'], exp=time.time() + r.get('expires_in', 3600))
    return _tok['t']

def api(method, url, body=None, headers=None):
    h = {'Authorization': 'Bearer ' + token()}
    h.update(headers or {})
    req = urllib.request.Request(url, data=body, headers=h, method=method)
    for a in range(5):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.loads(r.read() or b'{}')
        except Exception as e:
            if a == 4: raise
            time.sleep(2 ** (a + 1))

def upload(path, name, parent, mime='audio/mp4', file_id=None):
    meta = json.dumps({'name': name, **({} if file_id else {'parents': [parent]})}).encode()
    data = open(path, 'rb').read()
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'.encode() + meta +
            f'\r\n--{b}\r\nContent-Type: {mime}\r\n\r\n'.encode() + data + f'\r\n--{b}--'.encode())
    url = ('https://www.googleapis.com/upload/drive/v3/files' + (f'/{file_id}' if file_id else '') + '?uploadType=multipart&fields=id')
    return api('PATCH' if file_id else 'POST', url, body, {'Content-Type': f'multipart/related; boundary={b}'})['id']

def safe(s):
    return re.sub(r'[\\/:*?"<>|]+', '-', s).strip()[:120]

def scan():
    found = {}
    for base in (os.path.join(ROOT, 'tools/narration/out'), os.path.join(ROOT, 'narration_audio')):
        for man in glob.glob(os.path.join(base, '*', 'manifest*.json')):
            src = os.path.basename(os.path.dirname(man))
            for e in json.load(open(man)):
                if e.get('voice') != VOICE: continue
                f = os.path.join(base, e['file']) if not os.path.isabs(e['file']) else e['file']
                if not os.path.exists(f):
                    f = os.path.join(base, src, '%02d' % e['n'] if e['n'] < 100 else str(e['n']), VOICE + '.m4a')
                if not os.path.exists(f):
                    alt = glob.glob(os.path.join(base, src, '*', VOICE + '.m4a'))
                    f = next((x for x in alt if os.path.basename(os.path.dirname(x)).lstrip('0') == str(e['n'])), None)
                if f and os.path.exists(f):
                    found[(src, e['n'])] = (e, f)
    return found

def run_once():
    led = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
    n_up = 0
    for (src, n), (e, f) in sorted(scan().items()):
        key = f'{src}:{n}:{VOICE}'
        if led.get(key, {}).get('textHash') == e['textHash']:
            continue
        name = f"{int(n):02d} - {safe(e.get('title', ''))}.m4a"
        fid = upload(f, name, FOLDERS[src], file_id=led.get(key, {}).get('id'))
        ch = os.path.join(os.path.dirname(f), 'chapters.json')
        led[key] = {'id': fid, 'textHash': e['textHash'], 'name': name, 'bytes': os.path.getsize(f), 'seconds': e.get('seconds')}
        json.dump(led, open(LEDGER, 'w'), indent=1, sort_keys=True)
        n_up += 1
        print(time.strftime('%H:%M:%S'), 'uploaded', src, name, flush=True)
    return n_up

def fetch_branches():
    subprocess.run('git fetch -q origin "+refs/heads/audio/*:refs/remotes/origin/audio/*"', shell=True, cwd=ROOT)
    out = subprocess.run('git for-each-ref --format="%(refname)" refs/remotes/origin/audio/', shell=True, cwd=ROOT, capture_output=True, text=True).stdout.split()
    for ref in out:
        # every commit on the branch (oldest first): a session may push a later commit with fewer files
        revs = subprocess.run(f'git rev-list --reverse {ref} -- narration_audio', shell=True, cwd=ROOT, capture_output=True, text=True).stdout.split()
        for rev in revs:
            subprocess.run(f'git archive {rev} narration_audio | tar -x -C {ROOT}', shell=True, cwd=ROOT, stderr=subprocess.DEVNULL)
            for man in glob.glob(os.path.join(ROOT, 'narration_audio', '*', 'manifest.json')):
                os.replace(man, man.replace('manifest.json', f'manifest.{rev[:10]}.json'))

if __name__ == '__main__':
    if '--watch' in sys.argv:
        while True:
            try:
                fetch_branches(); run_once()
            except Exception as ex:
                print('error', ex, flush=True)
            time.sleep(300)
    else:
        print('uploaded', run_once())
