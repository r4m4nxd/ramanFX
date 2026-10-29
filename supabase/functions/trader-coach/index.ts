// RamanFX trader coach (Supabase edge function, verify_jwt false: it checks its own secret).
// Called by Postgres only (pg_net, header x-coach-secret = rfx_coach_config.cron_secret, never in code):
//   - the trigger on public.rfx_journal (owner row changed: app sync or a bot note)  body {"reason":"journal"}
//   - pg_cron every 10 min (safety net, Sunday 6 PM Calgary weekly report)          body {"reason":"tick"}
//   - by hand, once: the sample report                                              body {"dry":"report"}
// What it does (core.ts has the rules; the maths is the app's own code in app-core.js):
//   1. rule guard: daily loss limit / max trades -> one 'Stop trading today' per day, 70% -> one heads-up,
//      N losses in a row -> the cooldown pause with the next look time;
//   2. a new trade or open position -> one '📝 ... why did you take it? Reply to this message.' (the bot's journal.ts
//      saves the reply as the trade's note);
//   3. Sunday 6 PM Calgary: the weekly report card (R multiples; $ only when rfx_coach_config.show_amounts);
//   4. re-applies a bot journal write (note / plan) that a concurrent app sync overwrote (rfx_coach_writes, 24 h);
//   5. scheduler for the GitHub workflows (scheduler.ts): with the OPTIONAL secret GITHUB_DISPATCH_TOKEN it dispatches
//      fx-scan / stock-scan / briefing / reminders / movers (hourly big moves) as scheduled-equivalent runs, once per slot, skipping a slot a GitHub
//      run already covers. Without the token: nothing (logs 'dispatch token not set' once per day).
// Sending: OPTIONAL function secrets TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (the owner adds them in the dashboard).
// Without them it logs 'telegram secrets not set' and only records the events (so nothing floods in later).
// Logs: event kinds and counts only, never message text, chat ids, journal data or secrets.
import { covered, dispatchRequest, dueDispatches, latestRunMs, latestRunUrl, type Dispatch } from './scheduler.ts';
import { isoDay, askCandidates, askText, COLS, fromRow, guardEvents, reportCard, reportDue, restDb, saveWhyNote, savePlan, utcRuntime, weekOf, writeLost, type Card, type JournalWrite } from './core.ts';

const SB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const TG_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const TG_CHAT = Deno.env.get('TELEGRAM_CHAT_ID') ?? '';
const GH_TOKEN = Deno.env.get('GITHUB_DISPATCH_TOKEN') ?? '';
const MAX_ASKS = 3;

const H = (): Record<string, string> => ({ apikey: SB_KEY, 'Content-Type': 'application/json', ...(SB_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SB_KEY}` } : {}) });
const rest = (path: string) => `${SB_URL}/rest/v1/${path}`;
async function q<T = Record<string, unknown>>(path: string, init: RequestInit = {}): Promise<T[]> {
  const r = await fetch(rest(path), { ...init, headers: { ...H(), ...(init.headers ?? {}) } });
  if (!r.ok) { await r.body?.cancel(); throw new Error(`${path.split('?')[0]} ${r.status}`); }
  const t = await r.text();
  return t ? JSON.parse(t) : [];
}
const log = (o: Record<string, unknown>) => console.log(JSON.stringify(o));
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

interface Cfg { cron_secret: string; enabled: boolean; show_amounts: boolean; last_journal_at: string | null; dispatch: Record<string, unknown> | null }
const getCfg = async () => (await q<Cfg>('rfx_coach_config?id=eq.1&select=cron_secret,enabled,show_amounts,last_journal_at,dispatch'))[0] ?? null;

/** Claim an event key; true only for the first caller (the dedupe that keeps every message to once). */
async function claim(key: string, kind: string): Promise<boolean> {
  const rows = await q('rfx_coach_events?on_conflict=key&select=key', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=representation' }, body: JSON.stringify([{ key, kind }]) });
  return rows.length === 1;
}
const markSent = (key: string, messageId: number) =>
  q(`rfx_coach_events?key=eq.${encodeURIComponent(key)}`, { method: 'PATCH', body: JSON.stringify({ sent: true, message_id: messageId }) });

const hasTelegram = () => !!TG_TOKEN && !!TG_CHAT;
/** sendMessage with the bot token from the function secret; the message_id, or null. */
async function send(text: string, markup?: unknown): Promise<number | null> {
  if (!hasTelegram()) return null;
  try {
    const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true, ...(markup ? { reply_markup: markup } : {}) }),
    });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j?.ok) { log({ ev: 'tg_error', status: r.status }); return null; }
    return Number(j.result?.message_id) || null;
  } catch (e) { log({ ev: 'tg_error', err: (e as Error).name }); return null; }
}
const cardMarkup = (c: Card) => ({ inline_keyboard: c.buttons });

// ---- GitHub workflow scheduler ------------------------------------------------------------------------------------
const ghHeaders = () => ({ Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ramanfx-coach' });
async function latestRun(d: Dispatch): Promise<number | null> {
  const r = await fetch(latestRunUrl(d), { headers: ghHeaders(), signal: AbortSignal.timeout(6000) });
  if (!r.ok) { await r.body?.cancel(); throw new Error(`runs ${r.status}`); }
  return latestRunMs(await r.json());
}
async function schedule(cfg: Cfg, now: number): Promise<string[]> {
  const due = dueDispatches(now);
  if (!due.length) return [];
  if (!GH_TOKEN) {
    if (await claim(`nodispatch:${isoDay(now)}`, 'nodispatch')) log({ ev: 'dispatch token not set' });
    return [];
  }
  const done: string[] = [];
  const record: Record<string, unknown> = { ...(cfg.dispatch ?? {}) };
  for (const d of due) {
    const key = `dispatch:${d.slot}`;
    if ((await q(`rfx_coach_events?key=eq.${encodeURIComponent(key)}&select=key`)).length) continue;
    try {
      if (covered(d, await latestRun(d))) { await claim(key, 'dispatch-covered'); log({ ev: 'dispatch_skip', wf: d.wf, why: 'github ran' }); continue; }
      if (!(await claim(key, 'dispatch'))) continue;
      const { url, init } = dispatchRequest(d, GH_TOKEN);
      const r = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
      await r.body?.cancel();
      if (r.ok) { done.push(d.wf); record[d.wf] = { slot: d.slot, at: new Date().toISOString() }; }
      else { await q(`rfx_coach_events?key=eq.${encodeURIComponent(key)}`, { method: 'DELETE' }); }   // retried next tick
      log({ ev: 'dispatch', wf: d.wf, status: r.status });
    } catch (e) { log({ ev: 'dispatch_error', wf: d.wf, err: (e as Error).message.slice(0, 60) }); }
  }
  if (done.length) await q('rfx_coach_config?id=eq.1', { method: 'PATCH', body: JSON.stringify({ dispatch: record }) });
  return done;
}

async function readJournal() {
  const rows = await q(`rfx_journal?user_id=eq.67967f02-d6fb-45f1-9edf-d14c3d3fcf12&select=${COLS.map(c => c[1]).join(',')},updated_at`);
  return rows[0] ? { j: fromRow(rows[0]), updatedAt: String(rows[0].updated_at) } : null;
}

async function run(reason: string, dry: string | null): Promise<Record<string, unknown>> {
  const cfg = await getCfg();
  if (!cfg?.enabled) return { ok: true, off: true };
  const tg = hasTelegram();
  if (!tg) log({ ev: 'telegram secrets not set' });
  const now = Date.now();

  if (dry === 'report') {
    if (!tg) return { ok: true, sent: false, why: 'telegram secrets not set' };
    const jr = await readJournal();
    if (!jr) return { ok: false, why: 'no journal row' };
    const card = reportCard(jr.j, now, { sample: true, showAmounts: cfg.show_amounts });
    const id = await send(card.text, cardMarkup(card));
    log({ ev: 'sample_report', sent: !!id });
    return { ok: true, sent: !!id };
  }

  let dispatched: string[] = [];
  try { dispatched = await schedule(cfg, now); } catch (e) { log({ ev: 'schedule_error', err: (e as Error).message.slice(0, 80) }); }

  const head = await q<{ updated_at: string }>('rfx_journal?user_id=eq.67967f02-d6fb-45f1-9edf-d14c3d3fcf12&select=updated_at');
  if (!head[0]) return { ok: true, idle: 'no journal row' };
  const changed = head[0].updated_at !== cfg.last_journal_at;
  const week = weekOf(now).from;
  const due = reportDue(now) && !(await q(`rfx_coach_events?key=eq.week:${week}&select=key`)).length;
  const since = now - 86400000;
  const writes = await q<JournalWrite & { id: number; healed: number }>(`rfx_coach_writes?at=gt.${since}&healed=lt.3&select=id,kind,trade_id,text,plan,at,healed`);
  if (!changed && !due && !writes.length) return { ok: true, idle: true, dispatched };

  const jr = await readJournal();
  if (!jr) return { ok: true, idle: 'no journal row' };
  const { j } = jr;
  const sent: string[] = [], recorded: string[] = [];
  const emit = async (key: string, kind: string, text: string, markup?: unknown): Promise<number | null> => {
    if (!(await claim(key, kind))) return null;
    const id = await send(text, markup);
    if (id) { await markSent(key, id); sent.push(kind); } else recorded.push(kind);
    return id;
  };

  if (changed) {
    for (const e of guardEvents(j, now)) await emit(e.key, e.kind, e.text);
    let asked = 0;
    for (const a of askCandidates(j, now)) {
      if (asked >= MAX_ASKS) break;
      const key = `ask:${a.id}`;
      if (!(await claim(key, 'ask'))) continue;
      asked++;
      const id = await send(askText(a), { force_reply: true, input_field_placeholder: 'Why I took it…' });
      if (id) {
        await markSent(key, id);
        await q('rfx_coach_prompts', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify([{ message_id: id, trade_id: a.id, label: `${a.sym} ${a.side} ${a.price}` }]) });
        sent.push('ask');
      } else recorded.push('ask');
    }
  }
  if (due) {
    const card = reportCard(j, now, { showAmounts: cfg.show_amounts });
    await emit(`week:${week}`, 'report', card.text, cardMarkup(card));
  }
  let healed = 0;
  if (writes.length) {
    const db = restDb(SB_URL, SB_KEY);
    for (const w of writes) {
      if (!writeLost(j, w)) continue;
      const r = w.kind === 'plan' && w.plan ? await savePlan(db, w.plan) : await saveWhyNote(db, w.trade_id!, w.text!, w.at);
      await q(`rfx_coach_writes?id=eq.${w.id}`, { method: 'PATCH', body: JSON.stringify({ healed: w.healed + 1 }) });
      if (r === 'ok') healed++;
    }
  }
  await q('rfx_coach_config?id=eq.1', { method: 'PATCH', body: JSON.stringify({ last_journal_at: jr.updatedAt, updated_at: new Date().toISOString() }) });
  const out = { ok: true, reason, sent, recorded, healed, dispatched };
  log({ ev: 'run', ...out });
  return out;
}

const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  const secret = req.headers.get('x-coach-secret') ?? '';
  if (!/^[0-9a-f]{64}$/.test(secret)) return new Response(null, { status: 401 });
  let cfg: Cfg | null;
  try { cfg = await getCfg(); } catch (e) { log({ ev: 'cfg_error', err: (e as Error).message }); return new Response(null, { status: 503 }); }
  if (!cfg || !same(cfg.cron_secret, secret)) { log({ ev: 'denied' }); return new Response(null, { status: 401 }); }
  if (!utcRuntime()) { log({ ev: 'runtime_not_utc' }); return json({ ok: false, why: 'runtime zone is not UTC' }, 500); }
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body = tick */ }
  const reason = typeof body.reason === 'string' ? body.reason.slice(0, 20) : 'tick';
  const dry = body.dry === 'report' ? 'report' : null;
  try {
    return json(await run(reason, dry));
  } catch (e) {
    log({ ev: 'error', err: (e as Error).message.slice(0, 120) });
    return json({ ok: false }, 500);
  }
});
