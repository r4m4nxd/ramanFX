// Journal writes from Telegram (owned by the trader coach, supabase/functions/trader-coach). index.ts calls
// journalRoute() first for every owner message; null = not a journal message, the normal commands handle it.
//   - a reply to the coach's '📝 EURUSD buy 1.0850 — why did you take it?' prompt (reply_to_message.message_id is in
//     public.rfx_coach_prompts) -> saved as that trade's note in public.rfx_journal (notes[tradeId].note, updatedAt
//     like the app's saveNote, so the app's merge keeps it);
//   - /took EURUSD buy 1.0850 sl 1.0820 tp 1.0910 -> a plan in the journal's plans (the app's Plan shape), shown in the
//     Planner after the app syncs.
// Writes: only the owner's row, one column, read-modify-write with optimistic concurrency on updated_at (retried), and
// logged in public.rfx_coach_writes so the coach re-applies a write a concurrent app sync overwrote.
// Replies go back in the webhook response (no bot token needed here). The prompt itself is sent by the coach.
import { esc, parseTook, planCard, restDb, saveWhyNote, savePlan, tookPlan, type RmwResult } from '../trader-coach/core.ts';
import type { Reply } from './logic.ts';

export interface JournalEnv { sbUrl: string; sbKey: string; fetch?: typeof fetch; now?: () => number }

const TOOK = /^\/took(?:@\w+)?(?:\s+([\s\S]*))?$/i;
const BUSY = '⚠️ The journal was busy and nothing was saved. Send it again in a minute.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function journalRoute(msg: Record<string, any>, env: JournalEnv): Promise<Reply | null> {
  const text = typeof msg?.text === 'string' ? msg.text.trim() : '';
  if (!text) return null;
  const replyTo = msg.reply_to_message?.message_id;
  const took = TOOK.exec(text);
  if (!took && !(Number.isInteger(replyTo) && !text.startsWith('/'))) return null;
  if (!env.sbUrl || !env.sbKey) return null;

  const f = env.fetch ?? fetch;
  const now = env.now ?? Date.now;
  const h = { apikey: env.sbKey, 'Content-Type': 'application/json', ...(env.sbKey.startsWith('eyJ') ? { Authorization: `Bearer ${env.sbKey}` } : {}) };
  const rest = (p: string) => `${env.sbUrl}/rest/v1/${p}`;
  const db = restDb(env.sbUrl, env.sbKey, undefined, f);
  const logWrite = (row: Record<string, unknown>) =>
    f(rest('rfx_coach_writes'), { method: 'POST', headers: { ...h, Prefer: 'return=minimal' }, body: JSON.stringify([row]) }).then(r => r.body?.cancel()).catch(() => undefined);

  if (took) {
    const p = parseTook(took[1] ?? '');
    if (!p.ok) return { cmd: 'took', text: `📝 <b>/took</b>\n${p.error}` };
    const plan = tookPlan(p.v, now());
    const r: RmwResult = await savePlan(db, plan);
    if (r === 'conflict') return { cmd: 'took', text: BUSY };
    if (r === 'missing') return { cmd: 'took', text: '⚠️ No journal found. Sign in to the app once, then try again.' };
    await logWrite({ kind: 'plan', plan, at: plan.updatedAt });
    const card = planCard(plan);
    return { cmd: 'took', text: card.text, buttons: card.buttons };
  }

  const pr = await f(rest(`rfx_coach_prompts?message_id=eq.${replyTo}&select=trade_id,label`), { headers: h });
  if (!pr.ok) { await pr.body?.cancel(); return null; }   // coach tables missing / unavailable: normal handling
  const rows = await pr.json();
  const prompt = Array.isArray(rows) ? rows[0] : null;
  if (!prompt?.trade_id) return null;   // a reply to some other message: normal handling
  const at = now();
  const r = await saveWhyNote(db, String(prompt.trade_id), text, at);
  if (r === 'conflict') return { cmd: 'why', text: BUSY };
  if (r === 'missing') return { cmd: 'why', text: '⚠️ No journal found. Sign in to the app once, then try again.' };
  if (r === 'ok') await logWrite({ kind: 'note', trade_id: String(prompt.trade_id), text: text.slice(0, 2000), at });
  await f(rest(`rfx_coach_prompts?message_id=eq.${replyTo}`), { method: 'PATCH', headers: { ...h, Prefer: 'return=minimal' }, body: JSON.stringify({ answered_at: new Date(at).toISOString() }) }).then(x => x.body?.cancel()).catch(() => undefined);
  return { cmd: 'why', text: r === 'nochange' ? `✅ Already in the note on <b>${esc(prompt.label)}</b>.` : `✅ Saved as the note on <b>${esc(prompt.label)}</b>.\nIt shows on the trade after the app syncs.` };
}
