// Voice discovery, ranking and the listener's saved preferences (voice, speed, pitch).
// Shared by the lesson player and the one-off speak() helper, outside React so both see the same choice.

export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string | null) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* private mode */ } },
};
export const safeStorage = store;

// ─── Ranking ──────────────────────────────────────────────────────────

const EDGE_NATURAL = /\b(Aria|Jenny|Guy|Andrew|Emma|Brian|Ava|Ana|Christopher|Eric|Michelle|Roger|Steffan|Sonia|Ryan|Libby|Maisie|Thomas|Natasha|William|Clara|Liam|Neerja|Prabhat|Emily|Connor|Molly|Mitchell)\b/;
const APPLE_GOOD = /\b(Samantha|Ava|Daniel|Karen|Moira|Tessa|Serena|Alex|Allison|Susan|Tom|Evan|Nathan|Zoe|Joelle|Noelle|Nicky|Aaron|Arthur|Martha|Catherine|Gordon|Rishi|Fiona|Lee|Oliver|Kate|Stephanie|Jamie)\b/;
/** Robotic engines and macOS novelty voices: never pick these automatically. */
const ROBOTIC = /espeak|e-speak|mbrola|festival|pico|flite|robot|whisper|bad news|good news|bells|boing|bubbles|cellos|zarvox|trinoids|jester|organ|superstar|wobble|albert|fred\b|junior|ralph|kathy|bahh|deranged|hysterical|princess|grandma|grandpa|eddy|flo\b|reed|rocko|sandy|shelley/i;

export function rankVoice(v: SpeechSynthesisVoice): number {
  const lang = (v.lang || '').replace('_', '-').toLowerCase();
  const name = v.name;
  if (!lang.startsWith('en')) return -1000;
  let s = 0;
  if (lang === 'en-us' || lang === 'en-gb') s += 6; else if (/^en-(au|ie|ca|nz|za|in)/.test(lang)) s += 3;
  if (ROBOTIC.test(name)) s -= 500;
  if (/natural/i.test(name)) s += 100;
  if (/neural/i.test(name)) s += 90;
  if (/premium/i.test(name)) s += 85;
  if (/enhanced/i.test(name)) s += 75;
  if (/online/i.test(name)) s += 55;
  if (/microsoft/i.test(name) && EDGE_NATURAL.test(name)) s += 40;
  if (/^Google UK English Female/i.test(name)) s += 58;
  else if (/^Google UK English Male/i.test(name)) s += 52;
  else if (/^Google US English/i.test(name)) s += 55;
  else if (/^Google/i.test(name)) s += 20;
  if (APPLE_GOOD.test(name) && !/microsoft|google/i.test(name)) s += /^(Samantha|Ava)/.test(name) ? 36 : 28;
  if (/microsoft (david|zira|mark|hazel|george|susan|james|linda|richard|catherine|heera|ravi)/i.test(name)) s += 10;
  if (/compact/i.test(name)) s -= 15;
  if (v.default) s += 2;
  return s;
}

export const isRecommended = (v: SpeechSynthesisVoice) => rankVoice(v) >= 60;
export const isEnglish = (v: SpeechSynthesisVoice) => rankVoice(v) > -1000;

/** "Microsoft Aria Online (Natural) - English (United States)" -> "Aria · Natural · US". */
export function voiceLabel(v: SpeechSynthesisVoice): string {
  const region = (v.lang || '').split(/[-_]/)[1]?.toUpperCase() ?? '';
  const quality = /natural/i.test(v.name) ? 'Natural' : /neural/i.test(v.name) ? 'Neural' : /premium/i.test(v.name) ? 'Premium' : /enhanced/i.test(v.name) ? 'Enhanced' : '';
  let base = v.name
    .replace(/\s*[-–]\s*English.*$/i, '')
    .replace(/\((natural|neural|premium|enhanced)\)/gi, '')
    .replace(/\b(Microsoft|Online|Desktop)\b/g, '')
    .replace(/\s{2,}/g, ' ').trim();
  if (!base) base = v.name;
  return [base, quality, region && !base.includes(region) ? region : ''].filter(Boolean).join(' · ');
}

export function sortVoices(list: SpeechSynthesisVoice[]) {
  return list.filter(isEnglish).sort((a, b) => rankVoice(b) - rankVoice(a) || a.name.localeCompare(b.name));
}

// ─── Voices store (they load asynchronously, and Safari sometimes never fires voiceschanged) ───

let voices: SpeechSynthesisVoice[] = [];
let voicesInit = false;
const voiceSubs = new Set<() => void>();
function refreshVoices() {
  if (!speechSupported()) return;
  const next = window.speechSynthesis.getVoices();
  if (next.length !== voices.length || next.some((v, i) => v.voiceURI !== voices[i]?.voiceURI)) {
    voices = next;
    voiceSubs.forEach(f => f());
  }
}
function initVoices() {
  if (voicesInit || !speechSupported()) return;
  voicesInit = true;
  refreshVoices();
  const synth = window.speechSynthesis;
  try { synth.addEventListener('voiceschanged', refreshVoices); } catch { synth.onvoiceschanged = refreshVoices; }
  // Poll briefly as a fallback (older Safari, some Android builds).
  let tries = 0;
  const t = window.setInterval(() => { refreshVoices(); if (voices.length || ++tries > 20) window.clearInterval(t); }, 250);
}
export function subscribeVoices(f: () => void) { initVoices(); voiceSubs.add(f); return () => { voiceSubs.delete(f); }; }
export function getVoices() { initVoices(); return voices; }

// ─── Preferences ──────────────────────────────────────────────────────

export const RATE_MIN = 0.8, RATE_MAX = 2.0, RATE_DEFAULT = 1.05, PITCH_DEFAULT = 1.0;
const K_VOICE = 'rfx_listen_voice', K_RATE = 'rfx_listen_rate', K_PITCH = 'rfx_listen_pitch';
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
export interface SpeechPrefs { voiceURI: string | null; rate: number; pitch: number }
let prefs: SpeechPrefs = {
  voiceURI: store.get(K_VOICE),
  rate: clamp(Number(store.get(K_RATE)) || RATE_DEFAULT, RATE_MIN, RATE_MAX),
  pitch: clamp(Number(store.get(K_PITCH)) || PITCH_DEFAULT, 0.5, 1.5),
};
const prefSubs = new Set<() => void>();
export const getPrefs = () => prefs;
export function setPrefs(p: Partial<SpeechPrefs>) {
  prefs = { ...prefs, ...p, rate: clamp(p.rate ?? prefs.rate, RATE_MIN, RATE_MAX), pitch: clamp(p.pitch ?? prefs.pitch, 0.5, 1.5) };
  store.set(K_VOICE, prefs.voiceURI); store.set(K_RATE, String(prefs.rate)); store.set(K_PITCH, String(prefs.pitch));
  prefSubs.forEach(f => f());
}
export function subscribePrefs(f: () => void) { prefSubs.add(f); return () => { prefSubs.delete(f); }; }

/** The voice to use now: the saved one if it is still installed, else the best-ranked English voice. */
export function currentVoice(): SpeechSynthesisVoice | null {
  const list = getVoices();
  if (!list.length) return null;
  const saved = prefs.voiceURI && list.find(v => v.voiceURI === prefs.voiceURI);
  return saved || sortVoices(list)[0] || list.find(v => v.default) || list[0];
}
