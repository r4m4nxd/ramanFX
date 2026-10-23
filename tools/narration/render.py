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
    s = re.sub(r"https?:\s*(?:or\s*)*(?://)?(?:www\.)?([\w.-]+)[^\s,;)]*", r"\1", s)   # URLs: say the host only
    # Timeframe stacks "1W/4 hour/1 day/1 hour".
    tf = {"1W": "weekly", "1M": "monthly", "1 day": "daily", "1D": "daily", "4 hour": "four hour", "1 hour": "one hour"}
    def tfs(m):
        parts = [tf.get(p.strip(), p.strip()) for p in m.group(0).split("/")]
        return ", ".join(parts[:-1]) + " and " + parts[-1]
    s = re.sub(r"\b(?:1W|1M|1D|\d+ (?:hour|day|minute))(?:/(?:1W|1M|1D|\d+ (?:hour|day|minute)))+", tfs, s)
    # Video timestamps "00:00, " / "02:18, 02:24, " at the start of a note: drop them.
    s = re.sub(r"(?:(?<=^)|(?<=[\s.:]))\d{1,2}:\d{2}(?:,\s*\d{1,2}:\d{2})?,\s*", "", s)
    s = re.sub(r"\b\d{2}:\d{2}(?:\s*(?:,|to|-)\s*\d{2}:\d{2})?,?\s*", "", s)   # mid-sentence timestamps
    s = re.sub(r"\b(\d+)M\b", lambda m: f"{m.group(1)} month", s)                # 3M/12M monthly charts
    s = re.sub(r"\b(\d+(?:\.\d+)?)R\b", r"\1 R", s)                             # 10R -> "10 R"
    s = re.sub(r"\b(\d+)s\b", lambda m: f"{m.group(1)} second", s)               # 1s, 30s seconds charts
    s = re.sub(r"\b(\d+)(W|L|BE)\b", lambda m: f"{m.group(1)} {dict(W='wins', L='losses', BE='break even')[m.group(2)]}", s)
    s = re.sub(r"\.(?:JPG|jpg|png|PNG)\b", "", s)
    s = re.sub(r"(\d)\s*/\s*(\d)", r"\1 to \2", s)
    s = re.sub(r"\s*/\s*", " or ", s)
    s = re.sub(r"\bSPX500USD\b", "S and P 500", s)
    s = re.sub(r"\bR\s?:\s?R\b", "risk to reward", s)
    s = re.sub(r"\bDZ\b", "demand zone", s)
    s = re.sub(r"(\d) dollars(?=[a-z])", r"\1 dollar ", s)            # "62 dollarsstack" -> "62 dollar stack"
    s = re.sub(r"<\s*(\d)", r"under \1", s)                           # "<50 percent" -> "under 50 percent"
    s = re.sub(r">\s*(\d)", r"over \1", s)
    # Zone ranges "about 62.0, 64.3" / "at about 91.5, 94.5" -> "about 62 to 64.3".
    num = r"\d+(?:\.\d+)?(?: point(?: \d)+)?"
    s = re.sub(rf"\b(about|at|of) ({num}), ({num})\b", r"\1 \2 to \3", s)
    s = re.sub(rf"\b(live,|and|The) ({num}), ({num})\b", r"\1 \2 to \3", s)
    s = re.sub(r"\b(\d+)\.0\b", r"\1", s)                               # 62.0 -> 62
    # Symbols / tickers / brands the voice mangles.
    rep = [
        (r"\bwticousd\b", "W T I, U S D"), (r"\bWTI\b", "W T I"), (r"\boanda\b", "Oanda"),
        (r"\bFXStreet\b", "F X Street"), (r"\bDailyFX\b", "Daily F X"), (r"\bincl\.", "including"),
        (r"\bsam seiden\b", "Sam Seiden"), (r"\bcaptions'", "captions"),
        (r"\b(Drop|Rally)-Base-(Rally|Drop)\b", lambda m: f"{m.group(1)} base {m.group(2).lower()}"),
        (r"\bH(\d)\b", r"\1 hour"), (r"\bHTF\b", "higher time frame"),
    ]
    for a, b in rep:
        s = re.sub(a, b, s)
    s = more_fixes(s)
    s = re.sub(r"\b(Also|On top of that|Now|thing:?), ([A-Z])(?=[a-z])", lambda m: f"{m.group(1)}, {m.group(2).lower()}", s)
    s = re.sub(r"\ba under\b", "an under", s)
    return re.sub(r"\s{2,}", " ", s).strip()


MONTHS = dict(Jan="January", Feb="February", Mar="March", Apr="April", May="May", Jun="June", Jul="July", Aug="August",
              Sep="September", Oct="October", Nov="November", Dec="December")
INDEX = dict(SPX="S and P", US="U S", NAS="Nasdaq", UK="U K", FRA="France", SPA="Spain", GER="Germany", JPN="Japan", AUS="Aussie")
LETTERS = ["XLT", "ATR", "PCP", "OCL", "OCO", "OSO", "UTC", "ES", "TY", "ZN", "ZG", "CL", "GC", "NQ", "QM", "EC", "DOM", "CME",
           "CBOT", "FOMC", "ADP", "OTA", "GJ", "SZ", "CFD", "GTO", "IG", "EMA", "SMA", "TVC", "XLF", "SPY", "QQQ", "QQQQ", "DIA",
           "AAPL", "INTC", "RIMM", "BAC", "GS", "JPM", "MS", "MSFT", "AMZN", "GOOG", "CSCO", "IBM", "XOM", "AA", "SLV", "SMH", "NYSE"]
EMPH = ["LONG", "SHORT", "RED", "GREEN", "MUCH", "INTO", "GAP", "PUT", "CALL", "WOW", "OK", "PRO", "DOW"]


def more_fixes(s: str) -> str:
    """Generic fixes found by scanning every source's narration (see PROGRESS.md / report)."""
    s = re.sub(r"\b([a-z0-9-]+)\.(com|net|org|io)\b", lambda m: f"{m.group(1).replace('-', ' ')} dot {m.group(2)}", s)
    s = re.sub(r"\bwww\.", "", s)
    s = re.sub(r"(?<![\w.])[@$](?=[A-Z])", "", s)                                     # @ES, $INX tickers
    s = re.sub(r"~\s*(?=\d)", "about ", s)
    s = re.sub(r"\bUTC\s*-\s*(\d+)", r"U T C minus \1", s)
    s = re.sub(r"\b(\d{1,2}):00\s*(AM|PM)\b", lambda m: f"{m.group(1)} {' '.join(m.group(2))}", s)
    s = re.sub(r"\b(\d{1,2}) to 00 (AM|PM)\b", lambda m: f"{m.group(1)} {' '.join(m.group(2))}", s)   # "8 to 00 AM" from speakable
    s = re.sub(r"\b(AM|PM)\b", lambda m: " ".join(m.group(1)), s)
    s = re.sub(r"\b(\d{1,2}):([0-5]\d)\b", r"\1 \2", s)                               # clock times 7:30 -> "7 30"
    s = re.sub(r"\b(\d{1,2}(?:\.\d)?)\s?:\s?(\d{1,2}(?:\.\d)?)\b", r"\1 to \2", s)   # leftover ratios 1:3
    s = re.sub(r"\b(\d+)\s?hrs?\b", r"\1 hour", s)
    s = re.sub(r"\bp\.?\s?(\d+)\b", r"page \1", s)                                 # p80 / p.386
    s = re.sub(r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\d{2})\b", lambda m: f"{MONTHS[m.group(1)]} 20{m.group(2)}", s)
    s = re.sub(r"\bT(\d)\b", r"target \1", s)
    s = re.sub(r"\bCP(\d)\b", r"continuation pattern \1", s)
    s = re.sub(r"\b(SPX|US|NAS|UK|FRA|SPA|GER|JPN|AUS)(\d{2,4})\b", lambda m: f"{INDEX[m.group(1)]} {m.group(2)}", s)
    s = re.sub(r"\bMAs\b", "moving averages", s); s = re.sub(r"(\d) MA\b", r"\1 moving average", s); s = re.sub(r"\bMA\b", "moving average", s)
    s = re.sub(r"\bTA\b", "technical analysis", s); s = re.sub(r"\bYT\b", "YouTube", s); s = re.sub(r"\bpart II\b", "part two", s)
    s = re.sub(r"\b(\d)(?:st|nd|rd|th)-", lambda m: ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"][int(m.group(1))] + " ", s)
    s = re.sub(r"\b(" + "|".join(EMPH) + r")\b", lambda m: m.group(1).lower(), s)
    s = re.sub(r"\b(" + "|".join(sorted(LETTERS, key=len, reverse=True)) + r")(s?)\b", lambda m: " ".join(m.group(1)) + ("'s" if m.group(2) else ""), s)
    return s


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
