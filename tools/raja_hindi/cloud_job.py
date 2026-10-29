"""One Raja recording on one cloud machine: Drive download -> 16 kHz wav -> Whisper large-v3 (ur) ->
tools/raja_hindi/transcripts/<group>/<safe>.{json,srt,txt}. Resumable: skips steps already done.
Usage: python3 -I tools/raja_hindi/cloud_job.py private/2026-02-10
"""
import json, os, subprocess, sys, time

TOOLS = os.path.dirname(os.path.abspath(__file__))
key = sys.argv[1]
st = json.load(open(f"{TOOLS}/process_state.json"))[key]
out = f"{TOOLS}/transcripts/{key}"
if os.path.exists(out + ".json"):
    print("already done", out); sys.exit(0)
work = os.path.expanduser("~/raja_job"); os.makedirs(work, exist_ok=True)
fid = st.get("m4a_id") or st["mp4_id"]
src, wav = f"{work}/src", f"{work}/{st['safe']}.wav"
if not os.path.exists(wav):
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
    for i in range(6):
        subprocess.run(["curl", "-sSL", "--retry", "3", "-C", "-", "-o", src, url], stdin=subprocess.DEVNULL)
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                           capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip(): break
        if os.path.exists(src): os.remove(src)
        time.sleep(5 * 2 ** i)
    else:
        sys.exit("download failed " + fid)
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src, "-vn", "-ac", "1", "-ar", "16000",
                    "-sample_fmt", "s16", wav + ".part.wav"], check=True)
    os.replace(wav + ".part.wav", wav); os.remove(src)
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
sys.path.insert(0, TOOLS)
import transcribe as T
os.makedirs(os.path.dirname(out), exist_ok=True)
meta = T.transcribe(wav, out, "large-v3", "ur", False, threads=os.cpu_count() or 4,
                    extra_meta=dict(recording=key, source_id=fid))
print(json.dumps(meta))
