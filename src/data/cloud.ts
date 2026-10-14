import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Journal } from './merge';

// Same project and table as the classic app, so both read and write the same journal.
// The anon key is public by design; row-level security on rfx_journal scopes rows to the user.
const SUPA_URL = 'https://dqjzufofmblerslcynzr.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxanp1Zm9mbWJsZXJzbGN5bnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTc0ODksImV4cCI6MjA5NjA5MzQ4OX0.87JYtH1p04bZgYqGtkCuxU-E_EuH4r3AlCogFEu53Hc';

let client: SupabaseClient | null = null;
export const supa = () => (client ??= createClient(SUPA_URL, SUPA_KEY));

export async function currentUser(): Promise<User | null> {
  try { const { data } = await supa().auth.getSession(); return data.session?.user ?? null; } catch { return null; }
}
export const signIn = (email: string, password: string) => supa().auth.signInWithPassword({ email, password });
export const signOut = () => supa().auth.signOut();

const COLS: [keyof Journal, string][] = [
  ['trades', 'trades'], ['accounts', 'accounts'], ['exitData', 'exit_data'], ['openPositions', 'open_positions'], ['workingOrders', 'working_orders'],
  ['deposits', 'deposits'], ['notes', 'notes'], ['dayNotes', 'day_notes'], ['strategies', 'strategies'], ['notebook', 'notebook'],
  ['notebookFolders', 'notebook_folders'], ['checklist', 'checklist'], ['checklistDays', 'checklist_days'], ['riskRules', 'risk_rules'],
  ['tagCategories', 'tag_categories'], ['tagCategoryMap', 'tag_category_map'], ['attachments', 'attachments'], ['plans', 'plans'], ['zones', 'zones'],
];

export async function pull(userId: string): Promise<Partial<Journal> | null> {
  const { data, error } = await supa().from('rfx_journal').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const out: Partial<Journal> = {};
  for (const [k, col] of COLS) if (data[col] != null) (out as Record<string, unknown>)[k] = data[col];
  return out;
}

export async function push(userId: string, j: Journal): Promise<void> {
  const row: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
  for (const [k, col] of COLS) row[col] = j[k];
  const { error } = await supa().from('rfx_journal').upsert(row, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}

export async function uploadImage(userId: string, tradeKey: string, attId: string, blob: Blob): Promise<string | null> {
  const path = `${userId}/${tradeKey}/${attId}.jpg`;
  const { error } = await supa().storage.from('attachments').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
  if (error) return null;
  return supa().storage.from('attachments').getPublicUrl(path).data.publicUrl ?? null;
}

/** Downscale to 1920px and re-encode as JPEG 85% before upload. */
export function compressImage(file: File): Promise<Blob> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const k = Math.min(1, 1920 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => resolve(b ?? file), 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}
