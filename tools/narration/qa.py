#!/usr/bin/env python3
"""Spot-check rendered narration: random 20 s excerpts per file -> peak/clipping, long silences, and a Whisper transcript
(faster-whisper base.en, 1 thread) to eyeball mispronounced terms.
  python3 tools/narration/qa.py tools/narration/out/course/01/af_heart.m4a ... [--n 3] [--seed 1]
"""
import argparse, json, os, random, re, subprocess, sys
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np


def decode(path, start, dur, sr=16000):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", str(start), "-t", str(dur), "-i", path, "-f", "f32le", "-ac", "1",
                          "-ar", str(sr), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True).stdout)


def silences(a, sr=16000, thr_db=-45, min_s=1.2):
    win = int(0.02 * sr)
    rms = np.sqrt(np.convolve(a ** 2, np.ones(win) / win, "same") + 1e-12)
    quiet = 20 * np.log10(rms) < thr_db
    out, start = [], None
    for i, q in enumerate(np.append(quiet, False)):
        if q and start is None:
            start = i
        elif not q and start is not None:
            if (i - start) / sr >= min_s:
                out.append((round(start / sr, 1), round((i - start) / sr, 1)))
            start = None
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+"); ap.add_argument("--n", type=int, default=3); ap.add_argument("--seed", type=int, default=1)
    args = ap.parse_args()
    from faster_whisper import WhisperModel
    model = WhisperModel("base.en", device="cpu", compute_type="int8", cpu_threads=1)
    rnd = random.Random(args.seed)
    for f in args.files:
        full = decode(f, 0, 99999)
        dur = len(full) / 16000
        peak = float(np.max(np.abs(full)))
        clip = int(np.sum(np.abs(full) > 0.995))
        long_sil = [s for s in silences(full) if s[1] > 2.6]  # 2 s quiz pause + gaps is expected; flag longer
        print(f"\n=== {f}: {dur:.0f} s, peak {20 * np.log10(peak):.1f} dBFS, clipped samples {clip}, silences > 2.6 s: {long_sil[:8]}")
        for _ in range(args.n):
            st = rnd.uniform(0, max(0, dur - 20))
            seg = full[int(st * 16000): int((st + 20) * 16000)]
            segs, _ = model.transcribe(seg, language="en", beam_size=1, vad_filter=False)
            text = " ".join(s.text.strip() for s in segs)
            print(f"  [{st:6.0f}s] silences>1.2s {silences(seg)} | {text}")


if __name__ == "__main__":
    main()
