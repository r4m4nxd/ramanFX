"""Download -> 16 kHz mono FLAC audio -> deduped chart frames -> delete mp4, for every recording in inventory.json.
Order: private (by date), course 1..5, then the rest. Resumable (skips finished steps).
Usage: python3 -I process.py
"""
import json, os, re, subprocess, sys, time, glob, datetime
import numpy as np
from PIL import Image

TOOLS = "/home/user/ramanFX/tools/raja_hindi"
SCR = "/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/raja_hi"
DL = SCR + "/dl"
AUDIO = SCR + "/audio"          # <group>/<safe>.flac  (kept; small)
FRAMES = "/home/user/ramanFX/public/lessons/raja_hi"
INV = TOOLS + "/inventory.json"

def slug(s):
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:60].strip("-")

def folder_date(t):
    t = re.sub(r"(\d)(st|nd|rd|th)", r"\1", t.split(" - ")[0])
    for f in ("%B %d, %Y", "%b %d, %Y"):
        try: return datetime.datetime.strptime(t.strip(), f).date()
        except ValueError: pass
    return None

def recordings(inv):
    """group media files into recordings (one folder = one recording; loose files = one each)."""
    recs = {}
    for f in inv:
        ext = f["name"].rsplit(".", 1)[-1].lower()
        if ext not in ("mp4", "m4a"): continue
        folder = "/".join(f["path"])
        key = (f["group"], folder if folder else f["name"])
        r = recs.setdefault(key, dict(group=f["group"], folder=folder, mp4=None, m4a=None))
        r[ext] = f
    out = []
    for (g, k), r in recs.items():
        if g == "private":
            d = folder_date(r["folder"]); r["safe"] = d.isoformat() + ("-analysis" if "analysis" in r["folder"] else "")
            r["order"] = (0, d.isoformat())
        else:
            r["safe"] = slug(r["folder"]) if r["folder"] else slug(k.rsplit(".", 1)[0])
            m = re.match(r"(\d+)\.", r["folder"])
            r["order"] = (1, f"{int(m.group(1)):03d}") if m else (2, ("0" if "Low Tf" in k else "1") + k)
        out.append(r)
    out.sort(key=lambda r: r["order"])
    return out

def download(f, dest):
    url = f"https://drive.usercontent.google.com/download?id={f['id']}&export=download&confirm=t"
    if os.path.exists(dest) and os.path.getsize(dest) == f["size"]: return True
    for i in range(6):
        subprocess.run(["curl", "-sSL", "--retry", "3", "-C", "-", "--max-time", "3600", "-o", dest, url],
                       stdin=subprocess.DEVNULL)
        if os.path.exists(dest) and os.path.getsize(dest) == f["size"]: return True
        if os.path.exists(dest) and os.path.getsize(dest) > f["size"]: os.remove(dest)
        time.sleep(5 * 2 ** i)
    return False

def duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                       stdin=subprocess.DEVNULL, capture_output=True, text=True)
    return float(r.stdout.strip())

def to_flac(src, dst):
    tmp = dst + ".part.flac"
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src, "-vn", "-ac", "1", "-ar", "16000",
                    "-sample_fmt", "s16", tmp], stdin=subprocess.DEVNULL, check=True)
    os.replace(tmp, dst)

def frames(video, outdir, dur):
    """candidates: scene changes (>=6 s apart) + one every `every` s; dedupe on 192x108 grey MAD<1.2; cap 80/h."""
    every = max(6.0, dur / 70)
    tmp = outdir + "/.tmp"; os.makedirs(tmp, exist_ok=True)
    for f in glob.glob(tmp + "/*"): os.remove(f)
    vf = (f"select='isnan(prev_selected_t)+gte(t-prev_selected_t\\,{every})"
          f"+gt(scene\\,0.10)*gte(t-prev_selected_t\\,6)',scale='min(1280,iw)':-2,showinfo")
    p = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", video, "-vf", vf, "-fps_mode", "vfr",
                        "-q:v", "4", tmp + "/c_%05d.jpg"], stdin=subprocess.DEVNULL, capture_output=True,
                       text=True, errors="ignore")
    times = [float(x) for x in re.findall(r"pts_time:([\d.]+)", p.stderr)]
    files = sorted(glob.glob(tmp + "/c_*.jpg"))
    keep, last = [], None
    for f, t in zip(files, times):
        g = np.asarray(Image.open(f).convert("L").resize((192, 108)), np.float32)
        if last is None or np.abs(g - last).mean() >= 1.2:
            keep.append((f, t)); last = g
    cap = max(10, int(80 * dur / 3600))
    if len(keep) > cap:
        step = len(keep) / cap; keep = [keep[int(i * step)] for i in range(cap)]
    for old in glob.glob(outdir + "/f-*.jpg"): os.remove(old)
    for i, (f, t) in enumerate(keep, 1):
        m, s = divmod(int(t), 60)
        os.replace(f, f"{outdir}/f-{i:03d}_t{m:02d}m{s:02d}s.jpg")
    for f in glob.glob(tmp + "/*"): os.remove(f)
    os.rmdir(tmp)
    return len(keep), len(files)

def main():
    inv = json.load(open(INV))
    recs = recordings(inv)
    state_p = TOOLS + "/process_state.json"
    state = json.load(open(state_p)) if os.path.exists(state_p) else {}
    for r in recs:
        key = f"{r['group']}/{r['safe']}"
        st = state.get(key, {})
        if st.get("done"): continue
        d = f"{DL}/{r['group']}/{r['safe']}"; os.makedirs(d, exist_ok=True)
        os.makedirs(f"{AUDIO}/{r['group']}", exist_ok=True)
        flac = f"{AUDIO}/{r['group']}/{r['safe']}.flac"
        print(time.strftime("%H:%M:%S"), "->", key, flush=True)
        try:
            src_audio = None
            if r["m4a"]:
                pa = f"{d}/{r['m4a']['name']}"
                if not download(r["m4a"], pa): raise RuntimeError("m4a download failed")
                src_audio = pa
            pv = None
            if r["mp4"]:
                pv = f"{d}/{r['mp4']['name']}"
                if not st.get("frames"):
                    if not download(r["mp4"], pv): raise RuntimeError("mp4 download failed")
                st["video_duration_s"] = round(duration(pv), 1) if os.path.exists(pv) else st.get("video_duration_s")
            if not os.path.exists(flac):
                to_flac(src_audio or pv, flac)
            st["audio_source"] = "m4a" if src_audio else "mp4"
            st["duration_s"] = round(duration(flac), 1)
            if pv and not st.get("frames"):
                od = f"{FRAMES}/{r['group']}/{r['safe']}"; os.makedirs(od, exist_ok=True)
                n, c = frames(pv, od, st["video_duration_s"] or st["duration_s"])
                st["frames"] = n; st["frame_candidates"] = c
            for f in glob.glob(d + "/*"): os.remove(f)
            st["done"] = True
            print(f"   ok dur={st['duration_s']/60:.1f}min frames={st.get('frames')}", flush=True)
        except Exception as e:
            st["error"] = repr(e); print("   FAIL", e, flush=True)
        st.update(group=r["group"], safe=r["safe"], folder=r["folder"],
                  mp4_id=r["mp4"] and r["mp4"]["id"], m4a_id=r["m4a"] and r["m4a"]["id"], flac=flac)
        state[key] = st
        json.dump(state, open(state_p, "w"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main()
