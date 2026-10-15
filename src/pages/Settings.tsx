import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { journalSnapshot, useStore } from '@/data/store';
import { Badge, Card, CardHead, Field, Page, Segmented, useToast } from '@/ui/kit';
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

  return (
    <Page className="max-w-3xl">
      <Card>
        <CardHead title="Cloud sync" sub="Keeps phone and computer in step. Changes upload a few seconds after you make them." right={user ? <Badge tone={sync.status === 'error' ? 'loss' : 'profit'}>{sync.status === 'error' ? 'ERROR' : 'CONNECTED'}</Badge> : <Badge>LOCAL ONLY</Badge>} />
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="text-sm text-ink2">Signed in as <b className="text-ink">{user.email}</b></div>
            {sync.status === 'error' && <p className="text-sm text-loss">{sync.message}</p>}
            {sync.at && <p className="text-xs text-ink3">Last synced {new Date(sync.at).toLocaleString()}</p>}
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => syncNow()} disabled={sync.status === 'syncing'}><Icon name="refresh" size={14} />{sync.status === 'syncing' ? 'Syncing…' : 'Sync now'}</button>
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

      <Card>
        <CardHead title="Appearance" />
        <Segmented label="Theme" value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
      </Card>

      <Card>
        <CardHead title="Time zone" sub="Applied to new imports. Trades already imported keep the times they were saved with." />
        <ClockFields />
        <div className="mt-4 flex flex-col gap-1">
          <div className="label mb-1">Accounts</div>
          {Object.values(accounts).length ? Object.values(accounts).map(a => (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 text-sm py-2.5 border-t border-line first:border-0">
              <span><b>{a.broker}</b> <span className="text-ink3 num">#{a.id}</span> · {a.currency ?? 'USD'}</span>
              <span className="text-xs text-ink3">{trades.filter(t => t.account === a.id).length} trades · imported {new Date(a.lastImport).toLocaleDateString()}</span>
            </div>
          )) : <p className="text-sm text-ink3">No accounts yet.</p>}
        </div>
      </Card>

      <Card>
        <CardHead title="Backup" sub="A full copy of your journal as one JSON file. Restoring merges — it never deletes." />
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={exportJSON}><Icon name="download" size={14} />Download backup</button>
          <button className="btn" onClick={() => fileRef.current?.click()}><Icon name="upload" size={14} />Restore from file</button>
          <input ref={fileRef} type="file" aria-label="Restore backup file" accept="application/json,.json" className="sr-only" onChange={async e => {
            const f = e.target.files?.[0]; e.target.value = '';
            if (!f) return;
            try { restore(JSON.parse(await f.text())); toast('Backup merged into your journal'); } catch (x) { toast(`Couldn't read that file: ${(x as Error).message}`, 'error'); }
          }} />
        </div>
      </Card>

      <Card>
        <CardHead title="Instrument specs" sub="Contract sizes, pip and tick sizes for 200+ instruments, editable per symbol" right={<Link to="/calculator?tab=library" className="btn h-8">Open library</Link>} />
        <p className="text-sm text-ink3">The classic version of the app is still available at <a className="text-accent" href="/legacy.html">/legacy.html</a> for the AI coach and Edge lab while they're rebuilt. Both read the same data on this device.</p>
      </Card>
      <Card>
        <CardHead title="Design system" sub="Colour, shape and motion tokens, the shared components and the accessibility baseline — generated live from the app." right={<Link to="/design" className="btn">Open<Icon name="chevronRight" size={14} /></Link>} />
      </Card>
    </Page>
  );
}
