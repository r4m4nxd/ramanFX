"""Benchmark models/languages on a 3-minute clip.  python3 -I benchmark.py <audio.flac> [start_s]
Writes bench/<model>_<lang>.{txt,json} next to this file and prints realtime factors."""
import os, subprocess, sys, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import transcribe as T

src = sys.argv[1]; start = float(sys.argv[2]) if len(sys.argv) > 2 else 600
B = os.path.dirname(os.path.abspath(__file__)) + "/bench"; os.makedirs(B, exist_ok=True)
wav = B + "/clip.wav"
if not os.path.exists(wav): subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-ss", str(start), "-t", "180", "-i", src,
                "-ac", "1", "-ar", "16000", wav], stdin=subprocess.DEVNULL, check=True)
runs = [("large-v3", "hi"), ("medium", "hi"), ("large-v3", "ur"), ("large-v3-turbo", "hi")]
if len(sys.argv) > 3: runs = [tuple(r.split(":")) for r in sys.argv[3].split(",")]
res = {}
for name, lang in runs:
    lab = os.path.basename(name.rstrip("/"))
    meta = T.transcribe(wav, f"{B}/{lab}_{lang}", name, lang)
    res[f"{lab}_{lang}"] = meta["rtf"]; print(name, lang, "rtf", meta["rtf"], flush=True)
    T._models.clear()
old = json.load(open(B + "/rtf.json")) if os.path.exists(B + "/rtf.json") else {}
old.update(res); json.dump(old, open(B + "/rtf.json", "w"), indent=1)
