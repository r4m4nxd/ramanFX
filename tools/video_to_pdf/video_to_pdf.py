"""
Turn lesson videos into small PDFs of the key chart moments, with the transcript under each frame.

For every video in a folder it:
  1. grabs a frame whenever the screen changes (new chart, new drawing), plus one every --every seconds,
  2. drops near-duplicate frames (same chart, cursor moved),
  3. stamps the time on each frame and writes the transcript lines spoken around it (if a .txt/.srt/.vtt
     with the same name sits next to the video),
  4. saves <video name>.pdf (size-capped so it can be uploaded to Claude) + a contact sheet JPG.

Needs: Python 3.9+, ffmpeg on PATH, Pillow  (pip install pillow)
Usage:  python video_to_pdf.py "C:\\Lessons\\Kevin" [--every 20] [--scene 0.12] [--max 60] [--width 1280]
"""
import argparse, glob, os, re, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

VIDEO = ('.mp4', '.mkv', '.mov', '.avi', '.webm', '.m4v')

def ts(sec):
    sec = int(sec); return f"{sec // 3600:02d}:{sec % 3600 // 60:02d}:{sec % 60:02d}"

def parse_time(t):
    p = [float(x) for x in t.replace(',', '.').split(':')]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]

def load_transcript(video):
    base = os.path.splitext(video)[0]
    for ext in ('.srt', '.vtt', '.txt'):
        f = base + ext
        if not os.path.exists(f): continue
        out, cur = [], None
        for line in open(f, encoding='utf-8', errors='ignore'):
            m = re.search(r'([\d:.,]+)\s*-->\s*([\d:.,]+)', line)
            if m: cur = (parse_time(m.group(1)), parse_time(m.group(2))); continue
            s = line.strip()
            if cur and s and not s.isdigit(): out.append((cur[0], cur[1], s))
        # drop transcription loops (same sentence repeated many times)
        seen, clean = {}, []
        for a, b, s in out:
            seen[s] = seen.get(s, 0) + 1
            if seen[s] <= 3: clean.append((a, b, s))
        return clean
    return []

def frames(video, tmp, scene, every, width):
    pat = os.path.join(tmp, 'f_%05d.jpg')
    vf = f"select='gt(scene,{scene})+isnan(prev_selected_t)+gte(t-prev_selected_t,{every})',scale={width}:-2,showinfo"
    cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'info', '-i', video, '-vf', vf, '-vsync', 'vfr', '-q:v', '3', pat]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, text=True, errors='ignore')
    times = [float(x) for x in re.findall(r'pts_time:([\d.]+)', p.stderr)]
    files = sorted(glob.glob(os.path.join(tmp, 'f_*.jpg')))
    return list(zip(files, times + [0.0] * (len(files) - len(times))))

def ahash(img):
    g = img.convert('L').resize((16, 9)); px = list(g.getdata()); m = sum(px) / len(px)
    return [1 if v > m else 0 for v in px]

def dedupe(items, maxn):
    keep, last = [], None
    for f, t in items:
        im = Image.open(f); h = ahash(im)
        if last is None or sum(a != b for a, b in zip(h, last)) > 10: keep.append((f, t)); last = h
    if len(keep) > maxn:                                  # thin evenly
        step = len(keep) / maxn; keep = [keep[int(i * step)] for i in range(maxn)]
    return keep

def font(sz):
    for f in ('arial.ttf', 'DejaVuSans.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
        try: return ImageFont.truetype(f, sz)
        except OSError: pass
    return ImageFont.load_default()

def page(img, t, title, words, width):
    f1, f2 = font(22), font(18)
    lines, cur = [], ''
    for w in words.split():
        if len(cur) + len(w) > width // 11: lines.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    if cur: lines.append(cur)
    lines = lines[:8]
    h = img.height + 50 + 26 * len(lines) + 20
    pg = Image.new('RGB', (img.width, h), 'white'); pg.paste(img, (0, 50))
    d = ImageDraw.Draw(pg)
    d.text((12, 12), f"{title}   [{ts(t)}]", fill='black', font=f1)
    for i, s in enumerate(lines): d.text((12, img.height + 60 + 26 * i), s, fill=(40, 40, 40), font=f2)
    return pg

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('folder'); ap.add_argument('--every', type=float, default=20)
    ap.add_argument('--scene', type=float, default=0.12); ap.add_argument('--max', type=int, default=60)
    ap.add_argument('--width', type=int, default=1280); ap.add_argument('--maxmb', type=float, default=8)
    a = ap.parse_args()
    vids = [v for v in sorted(glob.glob(os.path.join(a.folder, '**', '*'), recursive=True)) if v.lower().endswith(VIDEO)]
    if not vids: sys.exit('No videos found in ' + a.folder)
    for v in vids:
        name = os.path.splitext(os.path.basename(v))[0]; print('->', name)
        tr = load_transcript(v)
        with tempfile.TemporaryDirectory() as tmp:
            items = dedupe(frames(v, tmp, a.scene, a.every, a.width), a.max)
            pages = []
            for i, (f, t) in enumerate(items):
                nxt = items[i + 1][1] if i + 1 < len(items) else t + 60
                words = ' '.join(s for s0, s1, s in tr if s1 >= t - 5 and s0 < nxt)
                pages.append(page(Image.open(f).convert('RGB'), t, name, words, a.width))
            if not pages: print('   no frames'); continue
            out = os.path.join(a.folder, name + '.pdf'); q = 70
            while True:
                small = [p.resize((int(p.width * 0.9), int(p.height * 0.9))) if q < 50 else p for p in pages]
                small[0].save(out, save_all=True, append_images=small[1:], quality=q, resolution=110)
                if os.path.getsize(out) / 1e6 <= a.maxmb or q <= 35: break
                q -= 10
            cols = 4; tw = 320; th = int(tw * pages[0].height / pages[0].width)
            sheet = Image.new('RGB', (cols * tw, ((len(pages) + cols - 1) // cols) * th), 'white')
            for i, p in enumerate(pages): sheet.paste(p.resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
            sheet.save(os.path.join(a.folder, name + '_sheet.jpg'), quality=70)
            print(f'   {len(pages)} frames -> {out} ({os.path.getsize(out) / 1e6:.1f} MB)')

if __name__ == '__main__': main()
