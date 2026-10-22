// Interactive teaching layer for every lesson (all mentors). Pure data; rendered by src/ui/teach/*.
// Teaching model: story/analogy first -> animated step-through -> predict-then-reveal practice
// on a candle scene -> retrieval quiz with instant feedback -> flashcards for spaced repetition.

export type MentorId = 'kevin-course' | 'kevin-zoom' | 'seiden' | 'baker' | 'raja';

/** One candle. Prices are abstract units (e.g. 100-200); the renderer scales them. */
export interface Candle { o: number; h: number; l: number; c: number }

/** A small synthetic chart that illustrates one idea. Indices refer to candle positions. */
export interface Scene {
  candles: Candle[];                       // 12-60 candles
  zones?: { from: number; to?: number; top: number; bottom: number; kind: 'demand' | 'supply'; label?: string; faded?: boolean }[];
  lines?: { y: number; label: string; kind: 'entry' | 'sl' | 'tp' | 'level' | 'proximal' | 'distal'; from?: number }[];
  trendlines?: { x1: number; y1: number; x2: number; y2: number; label?: string; broken?: boolean }[];
  notes?: { x: number; y: number; text: string }[];   // callouts anchored at candle index / price
  highlight?: { from: number; to: number; label?: string };  // shaded candle range (e.g. "base", "leg-out")
  reveal?: number;                         // candles shown before the outcome (predict-then-reveal); omit = all
}

export interface Step { title: string; narration: string; scene: Scene }   // each step builds on the previous scene

export type Quiz =
  | { type: 'mcq'; q: string; options: string[]; answer: number; explain: string; scene?: Scene }
  | { type: 'tf'; q: string; answer: boolean; explain: string; scene?: Scene }
  | { type: 'order'; q: string; items: string[]; explain: string }      // items given in the CORRECT order; UI shuffles
  | { type: 'spot'; q: string; scene: Scene; answer: { from: number; to: number }; explain: string }; // click the right candle(s)

export interface Practice {
  prompt: string;
  scene: Scene;                            // scene.reveal = candles visible while deciding
  task: 'buy-sell-none' | 'draw-zone' | 'pick-entry';
  answer: { side?: 'buy' | 'sell' | 'none'; top?: number; bottom?: number; entry?: number; sl?: number; tp?: number };
  explain: string;                         // shown after reveal, in the mentor's reasoning
}

export interface InteractiveLesson {
  mentor: MentorId;
  n: number;                               // same n as the lesson it belongs to
  eli5: { oneLiner: string; story: string; analogy: string };   // explain like I'm 5
  bigIdeas: string[];                      // max 3, plain words
  steps: Step[];                           // 3-7 animated steps
  quiz: Quiz[];                            // 4-8 questions, mixed types
  practice: Practice[];                    // 1-3 predict-then-reveal exercises
  cards: { front: string; back: string }[];  // 4-10 flashcards
  mnemonic?: string;                       // memory hook
}
