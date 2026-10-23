import { describe, expect, it } from 'vitest';
import { segmentChapters } from '../useSpeech';
import { Cancelled, SynthQueue, assessSpeed, encodeWav, trimSilence, type Clip, type SynthJob } from './queue';

/** A fake synthesiser: records requests; tests resolve them by hand. */
function fake() {
  const calls: { text: string; voice: string; urgent: boolean; resolve: (c: Clip) => void; reject: (e: unknown) => void; cancelled: boolean }[] = [];
  const synth = (text: string, voice: string, urgent: boolean): SynthJob => {
    let rec!: (typeof calls)[number];
    const promise = new Promise<Clip>((resolve, reject) => { rec = { text, voice, urgent, resolve, reject, cancelled: false }; });
    promise.catch(() => undefined);
    calls.push(rec);
    return { promise, cancel: () => { rec.cancelled = true; rec.reject(new Cancelled()); } };
  };
  const clip = (ms = 1000): Clip => ({ wav: new ArrayBuffer(8), sampleRate: 24000, durationMs: ms, synthMs: ms / 2 });
  return { calls, synth, clip };
}
const flush = () => new Promise(r => setTimeout(r, 0));
const TEXTS = ['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.'];

describe('SynthQueue', () => {
  it('synthesises the requested sentence first (urgent), then keeps `ahead` sentences going', () => {
    const f = fake();
    const q = new SynthQueue(f.synth, { ahead: 2 });
    q.setScript(TEXTS, 'af_heart');
    void q.get(0);
    expect(f.calls.map(c => [c.text, c.urgent])).toEqual([['One.', true], ['Two.', false], ['Three.', false]]);
    expect(q.held()).toEqual([0, 1, 2]);
  });

  it('serves prefetched clips without re-synthesising, and extends the window as playback moves on', async () => {
    const f = fake();
    const q = new SynthQueue(f.synth, { ahead: 2 });
    q.setScript(TEXTS, 'af_heart');
    const p0 = q.get(0);
    f.calls[0].resolve(f.clip()); f.calls[1].resolve(f.clip(2000));
    await flush();
    expect(await p0).toMatchObject({ durationMs: 1000 });
    expect(q.ready(1)).toBe(true);
    const p1 = q.get(1);
    expect(f.calls.map(c => c.text)).toEqual(['One.', 'Two.', 'Three.', 'Four.']); // only "Four." is new
    expect((await p1).durationMs).toBe(2000);
  });

  it('cancels in-flight work outside the window on a seek, and keeps one sentence behind', async () => {
    const f = fake();
    const q = new SynthQueue(f.synth, { ahead: 2, keepBehind: 1 });
    q.setScript(TEXTS, 'af_heart');
    void q.get(0);
    f.calls[0].resolve(f.clip());
    await flush();
    void q.get(4); // jump ahead
    expect(f.calls.filter(c => c.cancelled).map(c => c.text)).toEqual(['Two.', 'Three.']);
    expect(q.held()).toEqual([4, 5]);
    expect(f.calls.slice(-2).map(c => [c.text, c.urgent])).toEqual([['Five.', true], ['Six.', false]]);
  });

  it('drops everything on a voice or lesson change', async () => {
    const f = fake();
    const q = new SynthQueue(f.synth, { ahead: 1 });
    q.setScript(TEXTS, 'af_heart');
    void q.get(0);
    f.calls[0].resolve(f.clip());
    await flush();
    q.setScript(TEXTS, 'af_heart'); // same script and voice: nothing changes
    expect(q.ready(0)).toBe(true);
    q.setScript(TEXTS, 'bm_george');
    expect(q.held()).toEqual([]);
    expect(f.calls[1].cancelled).toBe(true);
    void q.get(0);
    expect(f.calls[f.calls.length - 2]).toMatchObject({ text: 'One.', voice: 'bm_george' });
    q.setScript(['Other lesson.'], 'bm_george');
    expect(q.held()).toEqual([]);
  });

  it('retries a sentence whose synthesis failed', async () => {
    const f = fake();
    const q = new SynthQueue(f.synth, { ahead: 0 });
    q.setScript(TEXTS, 'af_heart');
    const p = q.get(2);
    f.calls[0].reject(new Error('boom'));
    await expect(p).rejects.toThrow('boom');
    void q.get(2);
    expect(f.calls).toHaveLength(2);
  });

  it('stops at the end of the script and rejects out-of-range requests', async () => {
    const f = fake();
    const q = new SynthQueue(f.synth, { ahead: 3 });
    q.setScript(TEXTS, 'af_heart');
    void q.get(5);
    expect(f.calls).toHaveLength(1);
    await expect(q.get(6)).rejects.toThrow(RangeError);
  });
});

describe('assessSpeed', () => {
  it('skips the warm-up sentence and flags slower-than-real-time devices', () => {
    expect(assessSpeed([])).toEqual({ rtf: null, slow: false, n: 0 });
    const fast = assessSpeed([{ synthMs: 9000, durationMs: 3000 }, { synthMs: 1000, durationMs: 4000 }, { synthMs: 1000, durationMs: 4000 }]);
    expect(fast.rtf).toBeCloseTo(0.25);
    expect(fast.slow).toBe(false);
    const slow = assessSpeed([{ synthMs: 3000, durationMs: 3000 }, { synthMs: 5000, durationMs: 4000 }, { synthMs: 4500, durationMs: 4000 }]);
    expect(slow.slow).toBe(true);
    // Fast enough at 1x, not at 2x playback.
    const mid = [{ synthMs: 1, durationMs: 1 }, { synthMs: 600, durationMs: 1000 }, { synthMs: 600, durationMs: 1000 }];
    expect(assessSpeed(mid, 1).slow).toBe(false);
    expect(assessSpeed(mid, 2).slow).toBe(true);
    // One measured sentence is not enough to call it slow.
    expect(assessSpeed([{ synthMs: 1, durationMs: 1 }, { synthMs: 5000, durationMs: 1000 }]).slow).toBe(false);
  });
});

describe('audio helpers', () => {
  it('encodes 16-bit mono WAV', () => {
    const wav = encodeWav(new Float32Array([0, 1, -1, 0.5]), 24000);
    const v = new DataView(wav);
    expect(wav.byteLength).toBe(44 + 8);
    expect(String.fromCharCode(v.getUint8(0), v.getUint8(1), v.getUint8(2), v.getUint8(3))).toBe('RIFF');
    expect(v.getUint32(24, true)).toBe(24000);
    expect(v.getInt16(46, true)).toBe(32767);
    expect(v.getInt16(48, true)).toBe(-32768);
  });
  it('trims padding silence but keeps a short tail', () => {
    const a = new Float32Array(24000); // 1 s
    a.fill(0.2, 6000, 12000);
    const t = trimSilence(a, 24000);
    expect(t.length).toBeGreaterThan(6000);
    expect(t.length).toBeLessThan(6000 + 0.07 * 24000 + 600);
    expect(trimSilence(new Float32Array(100), 24000).length).toBe(100); // all silent: untouched
  });
});

describe('sentence splitter (chunks fed to the synthesiser)', () => {
  it('splits paragraphs into sentences, honours pause markers and chapter breaths', () => {
    const segs = segmentChapters([
      { id: 'a', title: 'A', text: 'First sentence here. Second one? Third! [[pause:400]] After the pause.' },
      { id: 'b', title: 'B', text: 'Next chapter starts.' },
    ]);
    expect(segs.map(s => s.text)).toEqual(['First sentence here.', 'Second one?', 'Third!', 'After the pause.', 'Next chapter starts.']);
    expect(segs.map(s => s.chapter)).toEqual([0, 0, 0, 0, 1]);
    expect(segs[2].gapAfter).toBe(120 + 400);
    expect(segs[3].gapAfter).toBe(120 + 750);
    expect(segs[0].firstOfChapter && segs[4].firstOfChapter).toBe(true);
  });
  it('breaks long sentences at a clause so every chunk stays short for the model', () => {
    const long = 'When price leaves a base with a strong candle and you mark the proximal and distal lines carefully, ' +
      'you have a zone worth trading, but only if the move away was fast and the curve says it is cheap or expensive enough.';
    const segs = segmentChapters([{ id: 'a', title: 'A', text: long }]);
    expect(segs.length).toBeGreaterThan(1);
    for (const s of segs) expect(s.text.length).toBeLessThanOrEqual(160);
    expect(segs.map(s => s.text).join(' ').replace(/\s+/g, ' ')).toBe(long);
  });
});
