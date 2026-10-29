#!/usr/bin/env python3
"""Render every lesson narration of every mentor with Kokoro, resumable.

  node tools/narration/dump-narration.mjs            # -> tools/narration/out/narrations.json (re-run when lesson text changes)
  nohup python3 tools/narration/batch.py > tools/narration/out/batch.log 2>&1 &

Output: tools/narration/out/<source>/<NN>/<voice>.m4a (AAC 64k mono, -16 LUFS), <NN>/chapters.json (chapter starts per
voice), <source>/manifest.json [{source, n, title, voice, file, bytes, seconds, sha256, textHash}], and
tools/narration/PROGRESS.md. A file is skipped when the manifest has it with the same textHash (sha256 of the spoken,
normalised text + voice + speed), so only changed lessons re-render. Pauses while free disk < MIN_FREE_GB.
"""
import argparse, hashlib, json, os, shutil, subprocess, sys, tempfile, time
from pathlib import Path

import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from render import SR, fix_text, load_kokoro, synth, encode  # noqa: E402

ROOT = Path(__file__).parent
OUT = ROOT / "out"
PROGRESS = ROOT / "PROGRESS.md"
ORDER = ["course", "raja", "zoom", "baker", "daily", "seiden"]
MIN_FREE_GB = 3.0
WORDS_PER_SEC = 2290 / 859.1  # measured on Kevin lesson 1 (af_heart, speed 1.0)


def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def words(chapters) -> int:
    return sum(len(c["text"].replace("[[", " [[").split()) for c in chapters)


def free_gb() -> float:
    return shutil.disk_usage(OUT).free / 1e9


def du(p: Path) -> int:
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file())


def load_json(p: Path, default):
    try:
        return json.load(open(p))
    except Exception:
        return default


def save_json(p: Path, data):
    tmp = p.with_suffix(p.suffix + ".tmp")
    json.dump(data, open(tmp, "w"), indent=1)
    os.replace(tmp, p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voices", default="af_heart,am_michael")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--threads", type=int, default=2)
    ap.add_argument("--sources", default=",".join(ORDER))
    ap.add_argument("--narrations", default=str(OUT / "narrations.json"))
    ap.add_argument("--ns", default="", help="only lessons with lo <= n <= hi, e.g. 1-30 (parallel machines split a source)")
    args = ap.parse_args()
    voices = args.voices.split(",")
    srcs = args.sources.split(",")
    lessons = [l for l in json.load(open(args.narrations)) if l["source"] in srcs]
    lessons.sort(key=lambda l: (srcs.index(l["source"]), l["n"]))
    if args.ns:
        lo, hi = (int(x) for x in args.ns.split("-"))
        lessons = [l for l in lessons if lo <= l["n"] <= hi]
    jobs = []
    for l in lessons:
        chapters = [{"id": c["id"], "title": c["title"], "text": fix_text(c["text"])} for c in l["chapters"]]
        for v in voices:
            th = hashlib.sha256(json.dumps([chapters, v, args.speed], sort_keys=True).encode()).hexdigest()[:16]
            jobs.append({"l": l, "chapters": chapters, "voice": v, "textHash": th, "words": words(chapters)})
    manifests = {s: load_json(OUT / s / "manifest.json", []) for s in srcs}

    def is_done(j):
        l = j["l"]
        for e in manifests[l["source"]]:
            if e["n"] == l["n"] and e["voice"] == j["voice"] and e["textHash"] == j["textHash"] and (OUT / e["file"]).exists():
                return True
        return False

    t_start = time.time()
    stats = {"render_s": 0.0, "words": 0}

    def progress(current=None, note=""):
        done = [j for j in jobs if is_done(j)]
        rem = [j for j in jobs if not is_done(j)]
        audio_done = sum(e["seconds"] for s in srcs for e in manifests[s])
        rem_words = sum(j["words"] for j in rem)
        rem_audio = rem_words / WORDS_PER_SEC
        rate = (stats["render_s"] / stats["words"]) if stats["words"] else 0.48 / WORDS_PER_SEC  # render s per word
        eta_h = rem_words * rate / 3600
        lines = [
            "# Narration render progress", "",
            f"Updated: {time.strftime('%Y-%m-%d %H:%M:%S %Z')}  {note}", "",
            f"- Files done: **{len(done)} / {len(jobs)}** ({len(rem)} remaining; voices {', '.join(voices)})",
            f"- Audio rendered: **{audio_done / 3600:.1f} h**; remaining about {rem_audio / 3600:.1f} h",
            f"- Render speed this run: {rate * WORDS_PER_SEC:.2f} x realtime (render s / audio s)" if stats["words"] else "- Render speed: (measuring)",
            f"- ETA: about **{eta_h:.1f} h** (finish around {time.strftime('%Y-%m-%d %H:%M', time.localtime(time.time() + eta_h * 3600))})",
            f"- Disk used by tools/narration/out: {du(OUT) / 1e9:.2f} GB; free: {free_gb():.1f} GB (pauses below {MIN_FREE_GB} GB)",
            f"- Now: {current or '-'}", "", "| source | lessons | files done | files total | audio h |", "|---|---|---|---|---|",
        ]
        for s in srcs:
            js = [j for j in jobs if j["l"]["source"] == s]
            lines.append(f"| {s} | {len({j['l']['n'] for j in js})} | {sum(is_done(j) for j in js)} | {len(js)} | "
                         f"{sum(e['seconds'] for e in manifests[s]) / 3600:.2f} |")
        PROGRESS.write_text("\n".join(lines) + "\n")

    progress(note="starting")
    k = load_kokoro(args.threads)
    tmpdir = Path(tempfile.mkdtemp(prefix="narr_"))
    for j in jobs:
        if is_done(j):
            continue
        l, v = j["l"], j["voice"]
        while free_gb() < MIN_FREE_GB:
            progress(note=f"PAUSED: free disk {free_gb():.1f} GB < {MIN_FREE_GB} GB")
            print(f"PAUSED low disk {free_gb():.1f} GB", flush=True)
            time.sleep(300)
        d = OUT / l["source"] / f"{l['n']:02d}"
        d.mkdir(parents=True, exist_ok=True)
        label = f"{l['source']} {l['n']} {v}"
        progress(current=f"{label}: {l['title']}")
        t0 = time.time()
        audio, marks = synth(k, j["chapters"], v, args.speed)
        took = time.time() - t0
        wav = tmpdir / "a.wav"
        sf.write(wav, audio, SR)
        tmp_m4a = d / f".{v}.tmp.m4a"
        encode(wav, tmp_m4a, "m4a")
        dest = d / f"{v}.m4a"
        os.replace(tmp_m4a, dest)
        secs = round(len(audio) / SR, 2)
        stats["render_s"] += took; stats["words"] += j["words"]
        ch = load_json(d / "chapters.json", {"source": l["source"], "n": l["n"], "title": l["title"], "voices": {}})
        ch.update(source=l["source"], n=l["n"], title=l["title"])
        ch["voices"][v] = {"file": dest.name, "seconds": secs, "textHash": j["textHash"], "chapters": marks}
        save_json(d / "chapters.json", ch)
        m = [e for e in manifests[l["source"]] if not (e["n"] == l["n"] and e["voice"] == v)]
        m.append({"source": l["source"], "n": l["n"], "title": l["title"], "voice": v, "file": str(dest.relative_to(OUT)),
                  "bytes": dest.stat().st_size, "seconds": secs, "sha256": sha256_file(dest), "textHash": j["textHash"]})
        m.sort(key=lambda e: (e["n"], e["voice"]))
        manifests[l["source"]] = m
        save_json(OUT / l["source"] / "manifest.json", m)
        print(f"{time.strftime('%H:%M:%S')} done {label}: {secs:.0f} s audio in {took:.0f} s (rtf {took / secs:.2f}), "
              f"{dest.stat().st_size / 1e6:.1f} MB", flush=True)
    progress(note=f"FINISHED in {(time.time() - t_start) / 3600:.1f} h")
    print("FINISHED", flush=True)


if __name__ == "__main__":
    main()
