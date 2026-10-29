// Turns a lesson's study notes into a lively spoken script for the "Listen to this lesson" player.
// Pure text in, text out: no DOM. The script restates the notes only — it adds framing ("Next up", "Quick question"),
// never new trading rules.
import type { VideoLesson } from './videoLessons';
import type { ZoomSession } from './zoomSessions';

export interface NarrationChapter { id: string; title: string; text: string }

/** Inline pause marker understood by the speech engine (never spoken, never shown). */
export const pause = (ms: number) => ` [[pause:${Math.round(ms)}]] `;
export const PAUSE_RE = /\[\[pause:(\d+)\]\]/g;

// ─── Speech normalisation ─────────────────────────────────────────────

const SMALL = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
/** 0..99 in words; larger numbers stay as digits (voices read those well). */
export function numberWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) return String(n);
  if (n <= 20) return SMALL[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + SMALL[n % 10] : '');
}
const ORD = ['zeroth', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const FIRST = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
const norm = (x: string) => x.toLowerCase().replace(/[^a-z]/g, '');
/** "entry time frame (entry timeframe)" / "multiple timeframe analysis (multiple timeframe analysis)" -> say it once. */
function dedupeParens(s: string) {
  return s.replace(/\s*\(([^()]{2,60})\)/g, (m, inner: string, at: number) => {
    const n = norm(inner);
    const before = norm(s.slice(Math.max(0, at - 80), at));
    return n.length > 2 && before.endsWith(n) ? '' : m;
  });
}
const ratioPart = (s: string) => (/^\d+$/.test(s) ? numberWords(+s) : s.replace('.', ' point '));

const CURRENCY: Record<string, string> = { EUR: 'euro', USD: 'dollar', GBP: 'pound', JPY: 'yen', AUD: 'Aussie', CAD: 'Canadian dollar', CHF: 'Swiss franc', NZD: 'Kiwi', XAU: 'gold', BTC: 'bitcoin' };

// Order matters: longer/compound forms first. Each entry is [pattern, replacement].
const ABBR: [RegExp, string][] = [
  [/\bR\s?:\s?R\b|\bRRR?\b/g, 'risk to reward'],
  [/\bS\s?&\s?D\b|\bS\/D\b/g, 'supply and demand'],
  [/\bS\s?\/\s?R\b|\bS&R\b/g, 'support and resistance'],
  [/\bDBRs\b/g, 'drop base rallies'], [/\bRBRs\b/g, 'rally base rallies'], [/\bRBDs\b/g, 'rally base drops'], [/\bDBDs\b/g, 'drop base drops'],
  [/\bDBR\b/g, 'drop base rally'], [/\bRBR\b/g, 'rally base rally'], [/\bRBD\b/g, 'rally base drop'], [/\bDBD\b/g, 'drop base drop'],
  [/\bHTFs\b/g, 'higher time frames'], [/\bITFs\b/g, 'intermediate time frames'], [/\bETFs\b/g, 'entry time frames'], [/\bLTFs\b/g, 'lower time frames'],
  [/\bHTF\b/g, 'higher time frame'], [/\bITF\b/g, 'intermediate time frame'], [/\bETF\b/g, 'entry time frame'], [/\bLTF\b/g, 'lower time frame'],
  [/\bMTF\b/g, 'multiple time frame'], [/\bTFs\b/g, 'time frames'], [/\bTF\b/g, 'time frame'],
  [/\bMTA\b/g, 'multiple timeframe analysis'], [/\bMSA\b/g, 'multiple sequence analysis'],
  [/\bSLs\b/g, 'stop losses'], [/\bSL\b/g, 'stop loss'], [/\bTPs\b/g, 'take profits'], [/\bTP(\d)\b/g, 'take profit $1'], [/\bTP\b/g, 'take profit'],
  [/\b(to|at|at the|into|of)\s+BE\b/g, '$1 break even'], [/\bB\/E\b/g, 'break even'],
  [/\bCPs\b/g, 'continuation patterns'], [/\bCP\b/g, 'continuation pattern'],
  [/\bPVs\b/g, 'peak and valley zones'], [/\bPV\b/g, 'peak and valley'],
  [/\bATH\b/g, 'all time high'], [/\bATL\b/g, 'all time low'], [/\bATHs\b/g, 'all time highs'],
  [/\bHHs?\b/g, 'higher high'], [/\bHLs?\b/g, 'higher low'], [/\bLHs?\b/g, 'lower high'], [/\bLLs?\b/g, 'lower low'],
  [/\bBOS\b/g, 'break of structure'], [/\bFVGs\b/g, 'fair value gaps'], [/\bFVG\b/g, 'fair value gap'], [/\bSMC\b/g, 'smart money concepts'],
  [/\bNFP\b/g, 'non farm payrolls'], [/\bDXY\b/g, 'the dollar index'], [/\bNY\b/g, 'New York'],
  [/\bPDFs\b/g, 'P D Fs'], [/\bRSI\b/g, 'R S I'], [/\bICT\b/g, 'I C T'], [/\bFXCM\b/g, 'F X C M'],
  [/\be\.g\.,?/gi, 'for example,'], [/\bi\.e\.,?/gi, 'that is,'], [/\betc\.?/gi, 'and so on'], [/\bvs\.?\b/gi, 'versus'], [/\bapprox\.?\b/gi, 'about'],
  [/\bw\/o\b/gi, 'without'], [/\bw\//gi, 'with '], [/\bmins?\b/g, 'minutes'], [/\bhrs?\b/g, 'hours'],
  [/\bM(\d{1,2})\b/g, '$1 minute'], [/\bH(\d)\b/g, '$1 hour'], [/\bD1\b/g, 'daily'], [/\bW1\b/g, 'weekly'],
];
// All-caps words that are emphasis, not acronyms: say them as words.
// Short unknown caps (EMA, ADR) stay as letters; long ones and known emphasis words are read as words.
const EMPHASIS = new Set(['NOT', 'AND', 'OR', 'NO', 'YES', 'ONE', 'TWO', 'ALL', 'ONLY', 'MOST', 'IS', 'ITS', 'END', 'NEW', 'THE', 'BUT', 'DO', 'DONT', 'CAN', 'WILL', 'MUST', 'NEVER', 'BE', 'IF', 'TO', 'AT', 'IN', 'ON', 'IT', 'BIG', 'WAY', 'OFF', 'OUT', 'BUY', 'SELL', 'LOW', 'TOP', 'FULL', 'HIGH', 'POOR', 'TIME', 'BOTH', 'ZONE', 'WHEN', 'THEN', 'VERY']);

/** Make one line of notes speakable: strip markdown/symbols and expand trading shorthand. */
export function speakable(input: string): string {
  let s = ` ${input} `;
  // Markdown and markup.
  s = s.replace(/<[^>]+>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`#>]+/g, ' ').replace(/^\s*[-•·]\s+/gm, ' ');
  // Currency pairs: EUR/USD, EURUSD.
  s = s.replace(/\b(EUR|USD|GBP|JPY|AUD|CAD|CHF|NZD|XAU|BTC)\s?\/?\s?(EUR|USD|GBP|JPY|AUD|CAD|CHF|NZD|XAU)\b/g, (_, a: string, b: string) => `${CURRENCY[a]} ${CURRENCY[b]}`);
  // Arrows and math-ish symbols.
  s = s.replace(/\s*(->|=>|→|⇒)\s*/g, ', then ').replace(/\s*(<-|←)\s*/g, ', from ');
  s = s.replace(/≥|>=/g, ' at least ').replace(/≤|<=/g, ' at most ').replace(/\s>\s/g, ' more than ').replace(/\s<\s/g, ' less than ');
  s = s.replace(/\+\/-|±/g, ' plus or minus ').replace(/~\s?(?=\d)/g, 'about ').replace(/\bx(\d)/g, 'times $1');
  s = s.replace(/\((\d)\)\s*/g, (_, d: string) => `${FIRST[+d] ?? d}, `).replace(/(^|\s)(\d)\)\s+/g, (_, a: string, d: string) => `${a}${FIRST[+d] ?? d}, `);
  s = s.replace(/[·•]/g, ', ').replace(/\s=\s/g, ' means ');
  s = s.replace(/\b(\d+)\s?m\b/g, '$1 minute').replace(/\b(\d+)\s?[hH]\b/g, '$1 hour').replace(/\b(\d+)\s?[dD]\b(?!\.)/g, '$1 day').replace(/\bthen (D|W|M)\b/g, (_, x: string) => `then ${x === 'D' ? 'daily' : x === 'W' ? 'weekly' : 'monthly'}`);
  for (const [re, rep] of ABBR) s = s.replace(re, rep);
  s = dedupeParens(s).replace(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth), ([A-Z])(?=[a-z])/g, (_, o: string, c: string) => `${o}, ${c.toLowerCase()}`);
  for (const [code, name] of Object.entries(CURRENCY)) if (code !== 'BTC') s = s.replace(new RegExp(`\\b${code}\\b`, 'g'), name);
  s = s.replace(/\bBTC\b/g, 'bitcoin');
  // Money and numbers.
  s = s.replace(/\$\s?(\d[\d,]*(?:\.\d+)?)\s?(k|K|m|M)?\b/g, (_, n: string, u?: string) => `${n}${u ? (u.toLowerCase() === 'k' ? ' thousand' : ' million') : ''} dollars`);
  s = s.replace(/\b(\d+(?:\.\d+)?)\s?[kK]\b/g, '$1 thousand');
  s = s.replace(/(\d)\s?%/g, '$1 percent');
  // Ratios 1:3, 2.5:1 (not clock times like 10:30 / 05:00).
  s = s.replace(/\b(\d{1,2}(?:\.\d)?)\s?:\s?(\d{1,2}(?:\.\d)?)\b/g, (m, a: string, b: string) => (/^\d{2}$/.test(b) && (b.startsWith('0') || a.length === 2) ? m : `${ratioPart(a)} to ${ratioPart(b)}`));
  // Prices with 3+ decimals read digit by digit after the point ("1.0850" -> "1 point 0 8 5 0").
  s = s.replace(/\b(\d+)\.(\d{3,6})\b/g, (_, a: string, b: string) => `${a} point ${b.split('').join(' ')}`);
  s = s.replace(/(\d)x\b/g, '$1 times').replace(/\b(\d+)\s?pips?\b/g, '$1 pips');
  s = s.replace(/(\d)\s?-\s?(\d)/g, '$1 to $2');
  // Ampersand, slashes between words.
  s = s.replace(/\s?&\s?/g, ' and ').replace(/([a-zA-Z])\/([a-zA-Z])/g, '$1 or $2').replace(/\s\/\s/g, ' or ');
  // Emphasis caps -> words.
  s = s.replace(/\b[A-Z]{2,}\b/g, w => (w.length >= 5 || EMPHASIS.has(w) ? w.toLowerCase() : w));
  // Quotes around phrases: drop them (voices sometimes say "quote").
  s = s.replace(/["“”]/g, '').replace(/(^|[\s(])['‘]((?:[^'’\n]|['’](?=[a-z]))+?)['’](?=[\s.,;:!?)]|$)/g, '$1$2').replace(/([.!?])[.,]/g, '$1');
  // Brackets become soft pauses.
  s = s.replace(/\s*[([]\s*/g, ', ').replace(/\s*[)\]]\s*/g, ', ');
  // Dashes used as pauses.
  s = s.replace(/\s+[-–—]+\s+/g, ', ').replace(/[–—]/g, ', ');
  s = s.replace(/[|{}\\=+^]/g, ' ').replace(/\.{3,}|…/g, '...');
  s = s.replace(/\ban (?=(?:[1-79]|1[02-79]|[2-79]\d) (?:hour|minute|day|times)\b)/g, 'a ');
  // Tidy punctuation.
  s = s.replace(/\s+([,.;:!?])/g, '$1').replace(/,\s*,+/g, ',').replace(/,\s*([.;:!?])/g, '$1').replace(/([.;:!?]),/g, '$1').replace(/:\s*\./g, '.');
  s = s.replace(/\s{2,}/g, ' ').trim().replace(/^[,;:]\s*/, '').replace(/[,;:]$/, '');
  return s;
}

/** End a sentence cleanly. */
const end = (s: string) => (s ? (/[.!?]$/.test(s) ? s : s + '.') : s);
/** Lower-case the first letter when gluing a sentence after a lead-in ("Also, price..."), unless it starts with an acronym or "I". */
const tail = (s: string) => (/^(I\b|[A-Z]{2}|[A-Z][a-z]+\s[A-Z])/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const sentences = (s: string) => s.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).map(x => x.trim()).filter(Boolean);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

function spokenDate(iso: string) {
  const d = new Date(iso + 'T12:00:00');
  return Number.isNaN(+d) ? iso : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Script builder ───────────────────────────────────────────────────

const TRANSITIONS = ['Next up: ', "Let's move on. ", 'Now, on to ', "Here's where it gets interesting. ", 'Next: ', 'Moving on: ', 'Okay, next up: '];
const LEADINS = ['', 'Also, ', '', 'On top of that, ', '', "And here's the thing: ", 'Now, ', '', 'So, ', 'Plus, '];
const QUOTE_LEADS = ['In his words: ', 'As he puts it: ', 'He says: ', 'Or, in his words: ', 'And this one: ', 'He sums it up like this: '];
const NUDGES = ['Still with me? Good.', 'Stay with me here, this part matters.', "Okay, let's keep going.", 'Nice. Keep that in your pocket.'];
/** Roughly every this many spoken words (about three to four minutes at a relaxed pace), drop in an engagement prompt. */
const PROMPT_EVERY = 480;

function pointToSentence(raw: string, i: number): string {
  let p = speakable(raw);
  if (!p) return '';
  const ex = /^(example|e\.g\.|for example)\s*[:,-]\s*/i;
  const op = /^(his|her|their) (opinion|view|take)\s*:\s*/i;
  const note = /^(note|tip|key|important)\s*:\s*/i;
  if (ex.test(p)) return end('For example, ' + tail(p.replace(ex, '')));
  if (op.test(p)) return end('In his opinion, ' + tail(p.replace(op, '')));
  if (note.test(p)) return end("Here's a key point: " + tail(p.replace(note, '')));
  // Turn "X: Y" headline-style points into a flowing sentence.
  const lead = i === 0 ? '' : LEADINS[i % LEADINS.length];
  return end(lead ? lead + tail(p) : cap(p));
}

/** Is this a mistake we can turn into a "what would you do" question? */
const gerund = (m: string) => /^[A-Z][a-z]+ing\b/.test(m);

export function buildNarration(l: VideoLesson, mentorName: string): NarrationChapter[] {
  const zoom = l as Partial<ZoomSession>;
  const isZoom = l.kind === 'zoom' && Array.isArray(zoom.qa);
  const he = mentorName || 'your mentor';
  const chapters: NarrationChapter[] = [];
  const push = (id: string, title: string, parts: string[]) => {
    const text = parts.filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim();
    if (text) chapters.push({ id, title, text });
  };

  // Engagement bookkeeping.
  let sincePrompt = 0, promptN = 0;
  const mistakes = (l.mistakes ?? []).map(m => speakable(m)).filter(Boolean);
  const usedMistakes = new Set<number>();
  const pictures = [...(l.images ?? []).map(i => i.caption), ...(l.figures ?? []).map(f => f.caption), ...(l.diagrams ?? []).map(d => d.caption)].map(speakable).filter(Boolean);
  let pictureN = 0;
  const prompt = (): string => {
    promptN++;
    // Alternate between a quiz from the mistakes list and a "picture this" moment.
    const mi = mistakes.findIndex((_, k) => !usedMistakes.has(k));
    if (promptN % 2 === 1 && mi >= 0) {
      usedMistakes.add(mi);
      const m = mistakes[mi].replace(/\.$/, '');
      const setup = gerund(m) ? `Say you catch yourself ${tail(m)}.` : `Here's a habit: ${tail(m)}.`;
      return `Quick question, before I tell you: what would you do? ${setup} Good idea, or not?${pause(2000)}Here's the answer: not a good idea. That's one of the classic mistakes ${he} warns about, so if you said no, nice work.`;
    }
    if (pictureN < pictures.length) {
      return `Pause and picture this.${pause(900)}${end(cap(pictures[pictureN++]))} Got that image in your head? Good.`;
    }
    if (mi >= 0) { promptN++; return prompt(); }
    return NUDGES[promptN % NUDGES.length];
  };
  const tick = (s: string) => {
    sincePrompt += words(s);
    if (sincePrompt >= PROMPT_EVERY) { sincePrompt = 0; return s + ' ' + prompt(); }
    return s;
  };

  // 1. Intro: hook + summary + roadmap.
  const title = speakable(l.title);
  const summary = sentences(speakable(l.summary));
  const hook = speakable(l.rules?.[0] ?? '') || summary[0] || '';
  const opener = isZoom
    ? `Sunday Zoom session ${numberWords(l.n)}${zoom.date ? `, from ${spokenDate(zoom.date)}` : ''}: ${end(title)}`
    : `Lesson ${numberWords(l.n)}: ${end(title)}`;
  const heads = (l.sections ?? []).map(s => speakable(s.heading.replace(/^more from the (lesson|session)\s*:\s*/i, ''))).filter(Boolean);
  const roadmap = heads.length > 1
    ? `Here's the plan. We'll cover ${heads.slice(0, 3).map(tail).join(', ')}${heads.length > 3 ? `, and ${numberWords(Math.min(heads.length - 3, 99))} more` : ''}, then ${he}'s rules, the mistakes to dodge, and a quick pre-trade countdown.`
    : '';
  push('intro', 'Intro', [
    opener,
    hook ? `Here's the one idea to hold on to: ${end(tail(hook))}` : '',
    pause(700),
    summary.length ? (/^(Explains|Shows|Covers|Walks|Teaches|Introduces|Reviews|Goes|Breaks|Continues|Builds|Answers|Demonstrates|Discusses|Looks|Takes|Uses|Recaps)\b/.test(summary[0])
      ? `In a nutshell, this ${isZoom ? 'session' : 'lesson'} ${end(summary[0].charAt(0).toLowerCase() + summary[0].slice(1))} ${summary.slice(1).map(end).join(' ')}`
      : `In a nutshell: ${summary.map(end).join(' ')}`) : '',
    roadmap,
    "Let's get into it.",
  ]);

  // 2. Sections as chapters.
  (l.sections ?? []).forEach((sec, si) => {
    const more = /^more from the (lesson|session)\s*:\s*/i.test(sec.heading);
    const h = speakable(sec.heading.replace(/^more from the (lesson|session)\s*:\s*/i, ''));
    const intro = si === 0 ? `First up: ${end(h)}` : more ? `A bit more from the ${isZoom ? 'session' : 'lesson'}: ${end(h)}` : (lead => lead + end(lead.endsWith('to ') ? tail(h) : cap(h)))(TRANSITIONS[(si - 1) % TRANSITIONS.length]);
    const body = sec.points.map((p, i) => tick(pointToSentence(p, i))).filter(Boolean);
    push(`s${si}`, h || `Part ${si + 1}`, [intro, ...body]);
  });

  // 3. Zoom: live examples and Q&A.
  if (isZoom && zoom.examples?.length) {
    const ex = zoom.examples.map((e, i) => tick([
      `${i === 0 ? "Here's a live example" : i === zoom.examples!.length - 1 ? 'And the last example' : 'Another one'}: ${speakable(e.market)}${e.timeframe ? `, on the ${speakable(e.timeframe)}` : ''}.`,
      end(cap(speakable(e.setup))),
      e.reasoning ? `His reasoning: ${end(tail(speakable(e.reasoning)))}` : '',
      e.outcome ? `What happened? ${end(cap(speakable(e.outcome)))}` : '',
    ].filter(Boolean).join(' ')));
    push('examples', 'Live examples', ['Time for some real charts from the session.', ...ex]);
  }
  if (isZoom && zoom.qa?.length) {
    const qa = zoom.qa.map((x, i) => {
      const q = end(speakable(x.q).replace(/\.$/, '?'));
      const a = speakable(x.a);
      const ask = i % 3 === 0 ? `${pause(300)}Before I tell you his answer, what would you say?${pause(2000)}` : pause(600);
      return tick(`${i === 0 ? 'A student asked' : i % 2 ? 'Another student asked' : 'Someone else asked'}: ${q}${ask}His answer: ${end(tail(a))}`);
    });
    push('qa', 'Student questions', [`Now some questions from students. Great ones, too.`, ...qa]);
  }

  // 4. Rules.
  if (l.rules?.length) {
    const rules = l.rules.map((r, i) => `Rule number ${ORD[i + 1] ?? numberWords(i + 1)}: ${end(tail(speakable(r)))}`);
    push('rules', 'The rules', [`Now the rules. ${l.rules.length === 1 ? "There's just one" : `There are ${numberWords(l.rules.length)}`}, and they're short, so let's go.`, ...rules]);
  }

  // 5. Mistakes (skip the ones already used as quiz questions).
  const left = mistakes.filter((_, k) => !usedMistakes.has(k));
  if (mistakes.length) {
    const mids = ['Another trap: ', 'And this one catches a lot of people: ', "Here's another: "];
    const lines = left.map((m, i) => end((i === 0 ? 'Watch out for this one: ' : i === left.length - 1 && i > 1 ? 'And finally, a big one: ' : mids[(i - 1) % mids.length]) + cap(m)));
    push('mistakes', 'Mistakes to avoid', [
      usedMistakes.size ? `Now the traps. You already caught ${usedMistakes.size === 1 ? 'one' : numberWords(usedMistakes.size)} earlier.${left.length ? ' Here are the rest.' : " That's all of them, so well done."}` : 'Now the traps. These are the mistakes that cost people money.',
      ...lines,
    ]);
  }

  // 6. In his words.
  const quotes = (l.quotes ?? []).map(speakable).filter(Boolean).slice(0, 8);
  if (quotes.length) push('quotes', 'In his words', [`Let's hear it straight from ${he}.`, ...quotes.map((q, i) => QUOTE_LEADS[i % QUOTE_LEADS.length] + end(cap(q)) + pause(450))]);

  // 7. Charts.
  const charts = [
    ...(l.diagrams ?? []).map(d => d.caption),
    ...(l.figures ?? []).map(f => f.caption),
    ...(l.images ?? []).flatMap(im => [im.caption, ...(im.notes ?? [])]),
  ].map(speakable).filter(Boolean).slice(0, 10);
  if (charts.length) push('charts', 'On the charts', [`If you're looking at the page, the charts are right there. If not, here's what they show.`, ...charts.map((c, i) => (i === 0 ? 'On the chart: ' : i % 2 ? 'Next chart: ' : 'And here: ') + end(cap(c)))]);

  // 8. Checklist as a countdown.
  const list = (l.checklist ?? []).map(speakable).filter(Boolean);
  if (list.length) {
    const n = list.length;
    push('checklist', 'Pre-trade countdown', [
      `Okay, the pre-trade countdown. ${cap(numberWords(n))} quick checks before you click buy or sell. Ready?${pause(500)}`,
      ...list.map((c, i) => `${cap(numberWords(n - i))}: ${end(tail(c))}`),
      'And that\'s the countdown. All clear? Then you\'re good to go.',
    ]);
  }

  // 9. Outro.
  push('outro', 'Wrap-up', [
    `That's ${isZoom ? `session ${numberWords(l.n)}` : `lesson ${numberWords(l.n)}`} wrapped.`,
    hook ? `If you remember just one thing: ${end(tail(hook))}` : '',
    'Nice work. Go mark up a chart while it\'s fresh, and I\'ll see you in the next one.',
  ]);

  return chapters;
}
