#!/usr/bin/env python3
"""Pre-render a lesson narration (from dump-narration.mjs) to audio with Kokoro-82M (kokoro-onnx, CPU).

  node tools/narration/dump-narration.mjs 1 tools/narration/out/kevin_01/narration.json
  python3 tools/narration/render.py tools/narration/out/kevin_01/narration.json --out tools/narration/out/kevin_01 \
      --name lesson_01 [--voice af_heart] [--threads 2] [--sample-voice am_michael]

Writes <name>.m4a (AAC 64k mono), <name>.webm (Opus 32k), chapters.json (chapter start times, seconds) and
<name>.spoken.json (the normalised text actually spoken). Model files: ~/.cache/kokoro-onnx/{kokoro-v1.0.onnx,voices-v1.0.bin}
from https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
Requires: pip install kokoro-onnx soundfile; ffmpeg on PATH.
"""
import argparse, json, os, re, subprocess, sys, tempfile, time
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 24000
PAUSE_RE = re.compile(r"\[\[pause:(\d+)\]\]")
CHAPTER_GAP_MS = 600
CHUNK_GAP_MS = 180      # between synthesis chunks (each chunk is 1+ whole sentences)
MAX_CHUNK = 380         # characters per Kokoro call (stays well under its 510-phoneme window)


def fix_text(s: str) -> str:
    """Extra speech fixes on top of narration.ts speakable() (which we don't change). Mostly from video-frame notes."""
    # Video timestamps "00:00, " / "02:18, 02:24, " at the start of a note: drop them.
    s = re.sub(r"(?:(?<=^)|(?<=[\s.:]))\d{1,2}:\d{2}(?:,\s*\d{1,2}:\d{2})?,\s*", "", s)
    s = re.sub(r"(\d) dollars(?=[a-z])", r"\1 dollar ", s)            # "62 dollarsstack" -> "62 dollar stack"
    s = re.sub(r"<\s*(\d)", r"under \1", s)                           # "<50 percent" -> "under 50 percent"
    s = re.sub(r">\s*(\d)", r"over \1", s)
    # Timeframe stacks "1W/4 hour/1 day/1 hour".
    tf = {"1W": "weekly", "1M": "monthly", "1 day": "daily", "1D": "daily", "4 hour": "four hour", "1 hour": "one hour"}
    def tfs(m):
        parts = [tf.get(p.strip(), p.strip()) for p in m.group(0).split("/")]
        return ", ".join(parts[:-1]) + " and " + parts[-1]
    s = re.sub(r"\b(?:1W|1M|1D|\d+ (?:hour|day|minute))(?:/(?:1W|1D|\d+ (?:hour|day|minute)))+", tfs, s)
    # Zone ranges "about 62.0, 64.3" / "at about 91.5, 94.5" -> "about 62 to 64.3".
    num = r"\d+(?:\.\d+)?(?: point(?: \d)+)?"
    s = re.sub(rf"\b(about|at|of) ({num}), ({num})\b", r"\1 \2 to \3", s)
    s = re.sub(rf"\blive, ({num}), ({num})", r"live, \1 to \2", s)
    s = re.sub(r"\b(\d+)\.0\b", r"\1", s)                               # 62.0 -> 62
    # Symbols / tickers / brands the voice mangles.
    rep = [
        (r"\bwticousd\b", "W T I, U S D"), (r"\bWTI\b", "W T I"), (r"\boanda\b", "Oanda"),
        (r"\bFXStreet\b", "F X Street"), (r"\bDailyFX\b", "Daily F X"), (r"\bincl\.", "including"),
        (r"\bsam seiden\b", "Sam Seiden"), (r"\bcaptions'", "captions"),
        (r"\b(Drop|Rally)-Base-(Rally|Drop)\b", lambda m: f"{m.group(1)} base {m.group(2).lower()}"),
        (r"\bH(\d)\b", r"\1 hour"), (r"\bHTF\b", "higher time frame"),
        (r"\b(\d+):(\d+)\b", lambda m: f"{m.group(1)} to {m.group(2)}"),  # leftover ratios like 1:3
    ]
    for a, b in rep:
        s = re.sub(a, b, s)
    return re.sub(r"\s{2,}", " ", s).strip()


def split_chunks(text: str):
    """Yield ('pause', ms) and ('say', text) items; speech is grouped by whole sentences up to MAX_CHUNK chars."""
    for i, part in enumerate(PAUSE_RE.split(text)):
        if i % 2 == 1:
            yield ("pause", int(part)); continue
        part = part.strip()
        if not part:
            continue
        sents = re.split(r"(?<=[.!?])\s+", part)
        buf = ""
        for s in sents:
            if buf and len(buf) + len(s) + 1 > MAX_CHUNK:
                yield ("say", buf); buf = s
            else:
                buf = f"{buf} {s}".strip()
        if buf:
            yield ("say", buf)


def trim(a: np.ndarray, thr=1e-3, keep=int(0.03 * SR)):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx):
        return a[:0]
    return a[max(0, idx[0] - keep): idx[-1] + keep]


def load_kokoro(threads: int):
    import onnxruntime as ort
    from kokoro_onnx import Kokoro
    cache = Path(os.environ.get("KOKORO_DIR", Path.home() / ".cache/kokoro-onnx"))
    so = ort.SessionOptions()
    so.intra_op_num_threads = threads
    so.inter_op_num_threads = 1
    sess = ort.InferenceSession(str(cache / "kokoro-v1.0.onnx"), so, providers=["CPUExecutionProvider"])
    return Kokoro.from_session(sess, str(cache / "voices-v1.0.bin"))


def synth(k, chapters, voice, speed, max_seconds=None):
    out, marks, t = [], [], 0
    for ci, ch in enumerate(chapters):
        if ci:
            out.append(np.zeros(int(CHAPTER_GAP_MS * SR / 1000), np.float32))
        marks.append({"id": ch["id"], "title": ch["title"], "start": round(sum(map(len, out)) / SR, 2)})
        for kind, val in split_chunks(ch["text"]):
            if kind == "pause":
                out.append(np.zeros(int(val * SR / 1000), np.float32)); continue
            a, sr = k.create(val, voice=voice, speed=speed, lang="en-us")
            assert sr == SR
            out.append(trim(np.asarray(a, np.float32)))
            out.append(np.zeros(int(CHUNK_GAP_MS * SR / 1000), np.float32))
            if max_seconds and sum(map(len, out)) / SR >= max_seconds:
                return np.concatenate(out), marks
        print(f"  [{voice}] chapter {ch['id']} done at {sum(map(len, out)) / SR:.0f} s audio", flush=True)
    return np.concatenate(out), marks


def encode(wav: Path, dest: Path, fmt: str):
    loud = "loudnorm=I=-16:TP=-1.5:LRA=11"
    codec = ["-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart"] if fmt == "m4a" else ["-c:a", "libopus", "-b:a", "32k", "-application", "voip"]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-af", loud, "-ar", "48000" if fmt == "webm" else "44100",
                    "-ac", "1", *codec, str(dest)], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("narration"); ap.add_argument("--out", required=True); ap.add_argument("--name", default="lesson")
    ap.add_argument("--voice", default="af_heart"); ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--threads", type=int, default=2); ap.add_argument("--sample-voice", help="comma-separated voices for short samples"); ap.add_argument("--sample-seconds", type=float, default=30)
    ap.add_argument("--skip-main", action="store_true")
    args = ap.parse_args()
    data = json.load(open(args.narration))
    chapters = [{**c, "text": fix_text(c["text"])} for c in data["chapters"]]
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    json.dump({"n": data.get("n"), "title": data.get("title"), "chapters": chapters}, open(out / f"{args.name}.spoken.json", "w"), indent=2)
    k = load_kokoro(args.threads)
    tmp = Path(tempfile.mkdtemp())
    if not args.skip_main:
        t0 = time.time()
        audio, marks = synth(k, chapters, args.voice, args.speed)
        took = time.time() - t0
        dur = len(audio) / SR
        sf.write(tmp / "main.wav", audio, SR)
        for fmt in ("m4a", "webm"):
            encode(tmp / "main.wav", out / f"{args.name}.{fmt}", fmt)
        json.dump({"lesson": data.get("n"), "title": data.get("title"), "voice": args.voice, "duration": round(dur, 2),
                   "chapters": marks}, open(out / "chapters.json", "w"), indent=2)
        sizes = {fmt: (out / f"{args.name}.{fmt}").stat().st_size for fmt in ("m4a", "webm")}
        print(json.dumps({"duration_s": round(dur, 1), "render_s": round(took, 1), "rtf": round(took / dur, 3), "sizes": sizes}))
    for v in filter(None, (args.sample_voice or "").split(",")):
        t0 = time.time()
        audio, _ = synth(k, chapters, v, args.speed, max_seconds=args.sample_seconds)
        sf.write(tmp / "sample.wav", audio, SR)
        name = f"sample_{v.split('_', 1)[1]}.m4a"
        encode(tmp / "sample.wav", out / name, "m4a")
        print(json.dumps({"sample": name, "duration_s": round(len(audio) / SR, 1), "render_s": round(time.time() - t0, 1),
                          "bytes": (out / name).stat().st_size}), flush=True)


if __name__ == "__main__":
    sys.exit(main())
