"""faster-whisper transcription of Raja Sahil Changaiz's Hindi/Urdu recordings.

transcribe(wav, out_base) -> writes out_base.{json,srt,txt}
Repetition loops (same 1-8 word phrase repeated >3 times in a row, or the same
segment text >3 times in a row) are re-run over that time span with temperature
fallback; anything that still loops is collapsed to a single occurrence.
"""
import json, os, re, sys, time
import numpy as np

SR = 16000
PROMPT = {
    "hi": ("राजा साहिल चंगेज़ की ट्रेडिंग क्लास: सप्लाई और डिमांड ज़ोन, प्रॉक्सिमल, डिस्टल, ट्रेंडलाइन, "
           "हाई कर्व, लो कर्व, रीअलाइनमेंट, WOW, इम्पल्स, करेक्शन, मोमेंटम, लोकेशन, फ्लिप ज़ोन, INHT, SR, "
           "कन्फर्मेशन, स्टॉप लॉस, टारगेट, टाइमफ्रेम, HTF, LTF, डेली, वीकली, H4, H1, M15, केविन, सैम सीडेन. "
           "supply, demand, zone, proximal, distal, trendline, curve, high curve, low curve, realignment, "
           "impulse, correction, momentum, location, flip zone, confirmation, stop loss, target, timeframe, "
           "daily, weekly, Kevin, Sam Seiden. देखो, यहाँ पे demand zone बना है, अब price वापस आएगा।"),
    "ur": ("راجہ ساحل چنگیز کی ٹریڈنگ کلاس: سپلائی اور ڈیمانڈ زون، پراکسیمل، ڈسٹل، ٹرینڈ لائن، "
           "ہائی کرو، لو کرو، ری الائنمنٹ، WOW، امپلس، کریکشن، مومینٹم، لوکیشن، فلپ زون، INHT، SR، "
           "کنفرمیشن، اسٹاپ لاس، ٹارگٹ، ٹائم فریم، HTF، LTF، ڈیلی، ویکلی، H4، H1، M15، کیون، سیم سیڈن۔ "
           "supply, demand, zone, proximal, distal, trendline, curve, high curve, low curve, realignment, "
           "impulse, correction, momentum, location, flip zone, confirmation, stop loss, target, timeframe, "
           "daily, weekly, Kevin, Sam Seiden. دیکھو، یہاں پہ demand zone بنا ہے، اب price واپس آئے گا۔"),
}
_models = {}
BATCH = int(os.environ.get("RAJA_BATCH", "0"))  # >0: BatchedInferencePipeline for full-file passes

def model(name="large-v3", compute="int8", threads=4):
    k = (name, compute)
    if k not in _models:
        from faster_whisper import WhisperModel
        _models[k] = WhisperModel(name, device="cpu", compute_type=compute, cpu_threads=threads, num_workers=1)
    return _models[k]

def load_wav(path):
    import wave
    with wave.open(path) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768.0

def _run(m, audio, offset, lang, task, temperature, **kw):
    # Devanagari/Arabic UTF-8 gzips far better than Latin text, so the default
    # compression_ratio_threshold (2.4) triggers temperature fallback on almost every
    # normal window (6x slower). Use 3.2; real loops still exceed it and are caught below.
    kw.setdefault("compression_ratio_threshold", 3.2)
    if BATCH and offset == 0.0 and len(audio) > 60 * SR:
        from faster_whisper import BatchedInferencePipeline
        segs, info = BatchedInferencePipeline(m).transcribe(audio, batch_size=BATCH, language=lang, task=task, beam_size=5,
                              vad_filter=True, condition_on_previous_text=False, initial_prompt=PROMPT.get(lang),
                              temperature=temperature, **kw)
    else:
      segs, info = m.transcribe(audio, language=lang, task=task, beam_size=5, vad_filter=True,
                              vad_parameters=dict(min_silence_duration_ms=700),
                              condition_on_previous_text=False, initial_prompt=PROMPT.get(lang),
                              temperature=temperature, **kw)
    out = []
    for s in segs:
        out.append(dict(start=round(s.start + offset, 2), end=round(s.end + offset, 2), text=s.text.strip(),
                        avg_logprob=round(s.avg_logprob, 3), no_speech_prob=round(s.no_speech_prob, 3),
                        compression_ratio=round(s.compression_ratio, 2)))
    return out

REP = re.compile(r"((?:\S+\s+){0,7}?\S+)(?:\s+\1){3,}")

def loops_in(text):
    return bool(REP.search(text))

def collapse(text):
    prev = None
    while prev != text:
        prev, text = text, REP.sub(r"\1", text)
    return text

def bad_spans(segs):
    """indices of segments that are loops: internal repetition or same text >3x in a row."""
    bad = set()
    for i, s in enumerate(segs):
        if loops_in(s["text"]) or s.get("compression_ratio", 0) > 3.6:
            bad.add(i)
    i = 0
    while i < len(segs):
        j = i
        while j + 1 < len(segs) and segs[j + 1]["text"] == segs[i]["text"] and segs[i]["text"]:
            j += 1
        if j - i + 1 > 3:
            bad.update(range(i, j + 1))
        i = j + 1
    # merge into contiguous spans
    spans, cur = [], None
    for i in sorted(bad):
        if cur and i == cur[1] + 1: cur[1] = i
        else:
            if cur: spans.append(cur)
            cur = [i, i]
    if cur: spans.append(cur)
    return spans

def fix_loops(m, audio, segs, lang, task):
    spans = bad_spans(segs)
    nfix = 0
    for a, b in reversed(spans):
        t0 = max(0.0, segs[a]["start"] - 1.0); t1 = segs[b]["end"] + 1.0
        clip = audio[int(t0 * SR):int(t1 * SR)]
        new = _run(m, clip, t0, lang, task, temperature=[0.2, 0.4, 0.6, 0.8, 1.0],
                   compression_ratio_threshold=2.8, log_prob_threshold=-1.0, no_repeat_ngram_size=4)
        for s in new:
            if loops_in(s["text"]):
                s["text"] = collapse(s["text"]); s["loop_collapsed"] = True
            s["refixed"] = True
        # dedupe consecutive identical texts
        ded = []
        for s in new:
            if ded and ded[-1]["text"] == s["text"]: ded[-1]["end"] = s["end"]
            else: ded.append(s)
        segs[a:b + 1] = ded
        nfix += 1
    return segs, nfix

def fmt(t, sep=","):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); mi, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{mi:02d}:{s:02d}{sep}{ms:03d}"

def write(out_base, segs, meta):
    os.makedirs(os.path.dirname(out_base), exist_ok=True)
    json.dump(dict(meta=meta, segments=segs), open(out_base + ".json", "w"), ensure_ascii=False, indent=1)
    with open(out_base + ".srt", "w") as f:
        for i, s in enumerate(segs, 1):
            f.write(f"{i}\n{fmt(s['start'])} --> {fmt(s['end'])}\n{s['text']}\n")
            if s.get("en"): f.write(f"{s['en']}\n")
            f.write("\n")
    with open(out_base + ".txt", "w") as f:
        for s in segs:
            f.write(f"[{fmt(s['start'], '.')[:8]}] {s['text']}\n")

def transcribe(wav, out_base, name="large-v3", lang="hi", translate=False, threads=4, extra_meta=None):
    m = model(name, threads=threads)
    audio = load_wav(wav)
    dur = len(audio) / SR
    t = time.time()
    segs = _run(m, audio, 0.0, lang, "transcribe", temperature=[0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
    segs, nfix = fix_loops(m, audio, segs, lang, "transcribe")
    el = time.time() - t
    meta = dict(model=name, compute="int8", language=lang, beam_size=5, vad_filter=True,
                condition_on_previous_text=False, duration_s=round(dur, 1), runtime_s=round(el, 1),
                rtf=round(el / dur, 3) if dur else None, loop_spans_rerun=nfix)
    if translate:
        t2 = time.time()
        en = _run(m, audio, 0.0, lang, "translate", temperature=[0.0, 0.2, 0.4, 0.6, 0.8, 1.0])
        en, _ = fix_loops(m, audio, en, lang, "translate")
        for s in segs:   # attach overlapping English text
            s["en"] = " ".join(e["text"] for e in en if e["end"] > s["start"] and e["start"] < s["end"]
                               and min(e["end"], s["end"]) - max(e["start"], s["start"]) > 0.3 * (e["end"] - e["start"]))
        meta["translate_runtime_s"] = round(time.time() - t2, 1)
    if extra_meta: meta.update(extra_meta)
    write(out_base, segs, meta)
    return meta

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(); ap.add_argument("wav"); ap.add_argument("out_base")
    ap.add_argument("--model", default="large-v3"); ap.add_argument("--lang", default="hi")
    ap.add_argument("--translate", action="store_true")
    a = ap.parse_args()
    print(json.dumps(transcribe(a.wav, a.out_base, a.model, a.lang, a.translate)))
