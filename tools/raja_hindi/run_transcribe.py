"""Transcribe every processed recording (FLAC from process.py) in queue order; resumable; updates PROGRESS.md.
python3 -I run_transcribe.py [--model large-v3] [--lang hi] [--translate]"""
import argparse, json, os, subprocess, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import transcribe as T, process as P

ap = argparse.ArgumentParser(); ap.add_argument("--model", default="large-v3"); ap.add_argument("--lang", default="hi")
ap.add_argument("--translate", action="store_true"); a = ap.parse_args()
OUT = P.TOOLS + "/transcripts"

def progress(recs, state, cur=None, rtf=None):
    done = [r for r in recs if os.path.exists(f"{OUT}/{r['group']}/{r['safe']}.json")]
    dur = lambda r: state.get(f"{r['group']}/{r['safe']}", {}).get("duration_s", 0) / 3600
    left = [r for r in recs if r not in done]
    eta = sum(dur(r) for r in left) * (rtf or 1.0)
    with open(P.TOOLS + "/PROGRESS.md", "w") as f:
        f.write(f"# Raja Hindi transcription progress\n\nUpdated {time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())}\n\n")
        f.write(f"Model {a.model} int8, language={a.lang}. Done {len(done)}/{len(recs)} recordings, "
                f"{sum(dur(r) for r in done):.1f} h of {sum(dur(r) for r in recs):.1f} h audio. "
                f"ETA {eta:.1f} h (rtf {rtf}).\n\nCurrently: {cur}\n\n| | recording | hours | frames |\n|---|---|---|---|\n")
        for r in recs:
            s = state.get(f"{r['group']}/{r['safe']}", {})
            f.write(f"| {'done' if r in done else 'todo'} | {r['group']}/{r['safe']} | {dur(r):.2f} | {s.get('frames', '-')} |\n")

recs = P.recordings(json.load(open(P.INV)))
rtf = None
while True:
    state = json.load(open(P.TOOLS + "/process_state.json"))
    todo = [r for r in recs if not os.path.exists(f"{OUT}/{r['group']}/{r['safe']}.json")]
    if not todo: progress(recs, state, "finished", rtf); break
    ready = [r for r in todo if state.get(f"{r['group']}/{r['safe']}", {}).get("duration_s")
             and os.path.exists(state[f"{r['group']}/{r['safe']}"]["flac"])]
    if not ready:
        if all(state.get(f"{r['group']}/{r['safe']}", {}).get("error") for r in todo): break
        time.sleep(30); continue
    r = ready[0]; key = f"{r['group']}/{r['safe']}"
    progress(recs, state, key, rtf)
    wav = P.SCR + f"/wav_{r['safe']}.wav"
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", state[key]["flac"], wav], stdin=subprocess.DEVNULL, check=True)
    print(time.strftime("%H:%M:%S"), "transcribing", key, flush=True)
    meta = T.transcribe(wav, f"{OUT}/{r['group']}/{r['safe']}", a.model, a.lang, a.translate,
                        extra_meta=dict(recording=key, folder=r["folder"], audio_source=state[key].get("audio_source")))
    os.remove(wav); rtf = meta["rtf"]
    print("   done rtf", rtf, "loops rerun", meta["loop_spans_rerun"], flush=True)
progress(recs, json.load(open(P.TOOLS + "/process_state.json")), "finished", rtf)
