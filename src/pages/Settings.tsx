import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { journalSnapshot, useStore } from '@/data/store';
import { Badge, Card, CardHead, Field, Page, Segmented, useOnline, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ClockFields } from '@/ui/ClockFields';

export default function Settings() {
  const user = useStore(s => s.user);
  const sync = useStore(s => s.sync);
  const login = useStore(s => s.login), logout = useStore(s => s.logout), syncNow = useStore(s => s.syncNow);
  const theme = useStore(s => s.theme), setTheme = useStore(s => s.setTheme);
  const accounts = useStore(s => s.accounts);
  const trades = useStore(s => s.trades);
  const playbook = useStore(s => s.playbook);
  const restore = useStore(s => s.restoreBackup);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ ...journalSnapshot(), playbookState: playbook, exportedAt: new Date().toISOString(), schemaVersion: 6 }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `ramanfx-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(a.href);
    toast('Backup downloaded');
  };

  const online = useOnline();
  const acctList = Object.values(accounts);
  const badge = !user ? <Badge>LOCAL ONLY</Badge>
    : !online ? <Badge tone="warn">OFFLINE</Badge>
    : sync.status === 'error' ? <Badge tone="loss">ERROR</Badge>
    : sync.status === 'syncing' ? <Badge>SYNCING</Badge>
    : <Badge tone="profit">CONNECTED</Badge>;

  const syncCard = (
    <Card>
      <CardHead title="Cloud sync" sub="Keeps phone and computer in step. Changes upload a few seconds after you make them." right={badge} />
      {user ? (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-ink2 min-w-0 truncate">Signed in as <b className="text-ink">{user.email}</b></div>
          {!online && <p className="text-sm text-warn">You're offline. Changes are saved on this device and sync when you reconnect.</p>}
          {sync.status === 'error' && <p className="text-sm text-loss">{sync.message}</p>}
          {sync.at && <p className="text-xs text-ink3">Last synced {new Date(sync.at).toLocaleString()}</p>}
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => syncNow()} disabled={sync.status === 'syncing' || !online}><Icon name="refresh" size={14} />{!online ? 'Waiting for connection' : sync.status === 'syncing' ? 'Syncing…' : 'Sync now'}</button>
            <button className="btn" onClick={() => logout()}><Icon name="logout" size={14} />Sign out</button>
          </div>
          <p className="text-xs text-ink3 leading-relaxed">Sync merges trade by trade and note by note — the newer edit wins — so nothing written offline is overwritten.</p>
        </div>
      ) : (
        <form className="grid sm:grid-cols-2 gap-3" onSubmit={async e => { e.preventDefault(); setBusy(true); setErr(await login(email.trim(), pw)); setBusy(false); }}>
          <Field label="Email"><input type="email" autoComplete="email" className="field" value={email} onChange={e => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><input type="password" autoComplete="current-password" className="field" value={pw} onChange={e => setPw(e.target.value)} required /></Field>
          {err && <p className="text-sm text-loss sm:col-span-2">{err}</p>}
          <button className="btn-primary sm:col-span-2 h-10" disabled={busy}>{busy ? 'Signing in…' : 'Sign in and sync'}</button>
        </form>
      )}
    </Card>
  );

  return (
    // One centred column on phones/tablets; two columns on wide screens so the page doesn't hug the left edge.
    <Page className="max-w-3xl mx-auto w-full xl:max-w-[1180px]">
      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        <div className="flex flex-col gap-4 min-w-0">
          {syncCard}

          <Card>
            <CardHead title="Accounts" sub="From your MT4 / MT5 imports" right={<button className="btn h-8" onClick={() => window.dispatchEvent(new Event('rfx:import'))}><Icon name="upload" size={14} />Import report</button>} />
            <div className="flex flex-col">
              {acctList.length ? acctList.map(a => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 text-sm py-2.5 border-t border-line first:border-0">
                  <span className="min-w-0 truncate"><b>{a.broker}</b> <span className="text-ink3 num">#{a.id}</span> · {a.currency ?? 'USD'}</span>
                  <span className="text-xs text-ink3 num">{trades.filter(t => t.account === a.id).length} trades · imported {new Date(a.lastImport).toLocaleDateString()}</span>
                </div>
              )) : <p className="text-sm text-ink3">No accounts yet. Import an MT5 / MT4 report to add one.</p>}
            </div>
          </Card>

          <Card>
            <CardHead title="Appearance" sub="Also on the sun / moon button in the top bar." />
            <Segmented label="Theme" value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
          </Card>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Card>
            <CardHead title="Time zone" sub="Applied to new imports. Trades already imported keep the times they were saved with." />
            <ClockFields />
          </Card>

          <Card>
            <CardHead title="Data" sub="Backups and the instrument library." />
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-sm font-medium">Backup</div>
                <p className="text-xs text-ink3 mt-0.5 mb-2.5">A full copy of your journal as one JSON file. Restoring merges — it never deletes.</p>
                <div className="flex flex-wrap gap-2">
                  <button className="btn" onClick={exportJSON}><Icon name="download" size={14} />Download backup</button>
                  <button className="btn" onClick={() => fileRef.current?.click()}><Icon name="upload" size={14} />Restore from file</button>
                  <input ref={fileRef} type="file" aria-label="Restore backup file" accept="application/json,.json" className="sr-only" onChange={async e => {
                    const f = e.target.files?.[0]; e.target.value = '';
                    if (!f) return;
                    try { restore(JSON.parse(await f.text())); toast('Backup merged into your journal'); } catch (x) { toast(`Couldn't read that file: ${(x as Error).message}`, 'error'); }
                  }} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">Instrument specs</div>
                  <p className="text-xs text-ink3 mt-0.5">Contract, pip and tick sizes for 200+ instruments, editable per symbol.</p>
                </div>
                <Link to="/calculator?tab=library" className="btn h-8 shrink-0">Open library</Link>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="About" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 py-1">
                <p className="text-sm text-ink3 min-w-0">The classic app keeps the AI coach and Edge lab while they're rebuilt. Both read the same data on this device.</p>
                <a className="btn h-8 shrink-0" href="/legacy.html">Classic app<Icon name="link" size={13} /></a>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line pt-3 mt-3">
                <p className="text-sm text-ink3 min-w-0">Design system: colour, shape and motion tokens, shared components and the accessibility baseline.</p>
                <Link to="/design" className="btn h-8 shrink-0">Open<Icon name="chevronRight" size={14} /></Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Card>
        <CardHead title="Trading tools" sub="ZoneBot, ZoneVision, the Excursions and Charts scripts and every preset, for MT5, MT4 and TradingView, are on one page." />
        <div className="flex flex-wrap gap-2">
          <Link to="/tools" className="btn-primary"><Icon name="download" size={14} />All tools<Icon name="chevronRight" size={14} /></Link>
          <Link to="/bot-guide" className="btn"><Icon name="info" size={14} />Bot guide</Link>
        </div>
      </Card>
    </Page>
  );
}
