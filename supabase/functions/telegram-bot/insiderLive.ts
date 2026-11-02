// /insiders SYM fetched from SEC EDGAR at request time (owner 2026-11-02: "fetched right away for that ticker"), for ANY
// US-listed ticker, not only the scanner's: the company's recent filings (data.sec.gov submissions), each recent Form 4
// read (open-market buys P and sales S, the 10b5-1 flag), plus its Form 144 and Schedule 13D / 13G filings.
// The 10-minute job's file (insiders.ts) stays the source of clusters / stars; this is the one-ticker live view.
// Pure apart from the injected getter `sec(url) -> text | null` (index.ts adds the SEC User-Agent: SEC_UA secret).
// Tests: src/core/telegramInsiderLive.test.ts.

export type SecGet = (url: string) => Promise<string | null>;
type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface F4Row { code: string; date: string; shares: number | null; price: number | null; plan: boolean; cover: boolean }
export interface F4 { owner: string; role: string; plan: boolean; rows: F4Row[] }

const dec = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
/** Inner text of the first <tag> in s ('' when missing). */
function tag(s: string, t: string): string {
  const m = new RegExp(`<${t}\\b[^>]*>([\\s\\S]*?)</${t}>`, 'i').exec(s);
  return m ? m[1] : '';
}
/** A Form 4 field: <tag><value>x</value></tag> or <tag>x</tag>. */
function val(s: string, t: string): string {
  const x = tag(s, t);
  const v = tag(x, 'value');
  return dec((v || x).replace(/<[^>]+>/g, ''));
}
const numOf = (s: string): number | null => { const v = parseFloat(s.replace(/[,$]/g, '')); return Number.isFinite(v) ? v : null; };
const TRUE = (s: string) => /^(1|true|yes|y)$/i.test(s.trim());
const PLAN_RE = /10b5[-‐-― ]?1/i, NOT_PLAN_RE = /\b(not|no|nor|outside|other than)\b[^.;]{0,60}10b5[-‐-― ]?1/i;
const COVER_RE = /(tax withholding|withholding (of )?tax|withholding obligation|tax obligation|taxes? (due|owed)|to cover (the )?(tax|withholding)|sell[- ]to[- ]cover)/i;

/** One Form 4 ownershipDocument (XML text) -> owner, short role, the 10b5-1 checkbox, the non-derivative rows. */
export function parseForm4(xml: string): F4 {
  const owner = tag(xml, 'reportingOwner');
  const rel = tag(owner, 'reportingOwnerRelationship');
  const title = val(rel, 'officerTitle');
  const bits: string[] = [];
  if (/\b(ceo|chief executive|principal executive)\b/i.test(title)) bits.push('CEO');
  if (/\b(cfo|chief financial|principal financial)\b/i.test(title)) bits.push('CFO');
  if (!bits.length && (TRUE(val(rel, 'isOfficer')) || title)) bits.push(title ? title.slice(0, 28) : 'Officer');
  if (TRUE(val(rel, 'isDirector'))) bits.push('Director');
  if (TRUE(val(rel, 'isTenPercentOwner'))) bits.push('10% owner');
  const foot = new Map<string, string>();
  for (const m of xml.matchAll(/<footnote\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/footnote>/gi)) foot.set(m[1], dec(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' '));
  const rows: F4Row[] = [];
  const table = tag(xml, 'nonDerivativeTable');
  for (const m of table.matchAll(/<nonDerivativeTransaction\b[^>]*>([\s\S]*?)<\/nonDerivativeTransaction>/gi)) {
    const tx = m[1];
    const notes = [...tx.matchAll(/<footnoteId\b[^>]*id="([^"]+)"/gi)].map(f => foot.get(f[1]) ?? '');
    rows.push({
      code: val(tag(tx, 'transactionCoding'), 'transactionCode').toUpperCase(),
      date: val(tx, 'transactionDate').slice(0, 10),
      shares: numOf(val(tag(tx, 'transactionAmounts'), 'transactionShares')),
      price: numOf(val(tag(tx, 'transactionAmounts'), 'transactionPricePerShare')),
      plan: notes.some(n => PLAN_RE.test(n) && !NOT_PLAN_RE.test(n)),
      cover: notes.some(n => COVER_RE.test(n)),
    });
  }
  return { owner: dec(val(tag(owner, 'reportingOwnerId'), 'rptOwnerName')), role: bits.join(' · ') || 'Other', plan: TRUE(val(xml, 'aff10b5One')), rows };
}

export interface Filing { form: string; date: string; acc: string; doc: string }
/** The submissions JSON's recent filings of the wanted forms since `since` (YYYY-MM-DD), newest first. */
export function recentFilings(sub: J, since: string): Filing[] {
  const r = sub?.filings?.recent ?? {};
  const out: Filing[] = [];
  const n = Array.isArray(r.form) ? r.form.length : 0;
  for (let i = 0; i < n; i++) {
    const form = String(r.form[i] ?? ''), date = String(r.filingDate?.[i] ?? '');
    if (date < since) continue;
    if (!/^(4|4\/A|144|SC 13D|SC 13D\/A|SC 13G|SC 13G\/A|SCHEDULE 13D|SCHEDULE 13D\/A|SCHEDULE 13G|SCHEDULE 13G\/A)$/.test(form)) continue;
    out.push({ form, date, acc: String(r.accessionNumber?.[i] ?? ''), doc: String(r.primaryDocument?.[i] ?? '') });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

let tickers: { at: number; map: Map<string, { cik: number; name: string }> } | null = null;
async function cikOf(sym: string, sec: SecGet): Promise<{ cik: number; name: string } | null> {
  if (!tickers || Date.now() - tickers.at > 86400_000) {
    const t = await sec('https://www.sec.gov/files/company_tickers.json');
    if (!t) return tickers?.map.get(sym) ?? null;
    const js = JSON.parse(t) as J;
    const map = new Map<string, { cik: number; name: string }>();
    for (const k of Object.keys(js)) map.set(String(js[k].ticker).toUpperCase(), { cik: +js[k].cik_str, name: String(js[k].title ?? '') });
    tickers = { at: Date.now(), map };
  }
  return tickers.map.get(sym) ?? tickers.map.get(sym.replace('.', '-')) ?? null;
}

export interface LiveInsiders {
  sym: string; name: string; cik: number; days: number;
  trades: { who: string; role: string; code: string; date: string; value: number | null; shares: number | null; price: number | null; plan: boolean; cover: boolean; url: string }[];
  f144: Filing[]; f13: Filing[]; f4n: number; read: number;
}

/** Live SEC view of one ticker: null = not a SEC-registered ticker or SEC unreachable. Reads at most `maxF4` Form 4s. */
export async function liveInsiders(symIn: string, sec: SecGet, now: Date, days = 90, maxF4 = 16): Promise<LiveInsiders | null> {
  const sym = symIn.toUpperCase().replace(/^[A-Z]+:/, '');
  const co = await cikOf(sym, sec);
  if (!co) return null;
  const cik10 = String(co.cik).padStart(10, '0');
  const subTxt = await sec(`https://data.sec.gov/submissions/CIK${cik10}.json`);
  if (!subTxt) return null;
  const since = new Date(now.getTime() - days * 86400_000).toISOString().slice(0, 10);
  const fl = recentFilings(JSON.parse(subTxt), since);
  const f4 = fl.filter(f => f.form.startsWith('4')).slice(0, maxF4);
  const xmlUrl = (f: Filing) => `https://www.sec.gov/Archives/edgar/data/${co.cik}/${f.acc.replace(/-/g, '')}/${f.doc.replace(/^xslF345X\d+\//, '')}`;
  const idxUrl = (f: Filing) => `https://www.sec.gov/Archives/edgar/data/${co.cik}/${f.acc.replace(/-/g, '')}/${f.acc}-index.htm`;
  const trades: LiveInsiders['trades'] = [];
  let read = 0;
  for (let i = 0; i < f4.length; i += 5) {                  // 5 at a time: SEC allows 10 requests / s
    const got = await Promise.all(f4.slice(i, i + 5).map(f => sec(xmlUrl(f)).then(x => ({ f, x })).catch(() => ({ f, x: null }))));
    for (const { f, x } of got) {
      if (!x) continue;
      read++;
      let d: F4;
      try { d = parseForm4(x); } catch { continue; }
      // open-market buys / sales only (grants, exercises, tax withholding: not shown); a filing's fills summed per side
      for (const code of ['P', 'S']) {
        const rs = d.rows.filter(r => r.code === code);
        if (!rs.length) continue;
        const sh = rs.reduce((a, r) => a + (r.shares ?? 0), 0);
        const val = rs.every(r => r.shares != null && r.price != null) ? rs.reduce((a, r) => a + r.shares! * r.price!, 0) : null;
        trades.push({ who: d.owner, role: d.role, code, date: rs.map(r => r.date).sort().slice(-1)[0], shares: sh || null,
          price: val != null && sh > 0 ? val / sh : null, value: val, plan: d.plan || rs.some(r => r.plan), cover: rs.every(r => r.cover), url: idxUrl(f) });
      }
    }
  }
  trades.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return { sym, name: co.name, cik: co.cik, days, trades, f144: fl.filter(f => f.form === '144'), f13: fl.filter(f => /13[DG]/.test(f.form)), f4n: fl.filter(f => f.form.startsWith('4')).length, read };
}
