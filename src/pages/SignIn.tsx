import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/data/store';
import { Icon } from '@/ui/Icon';
import { Ambient } from '@/ui/Ambient';

/** The only screen a signed-out visitor sees. No sign-up: accounts are made in Supabase. */
export default function SignIn() {
  const login = useStore(s => s.login);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const m = await login(email.trim(), pw);
    setBusy(false);
    if (m) setErr(/invalid/i.test(m) ? 'Email or password is incorrect.' : /fetch|network/i.test(m) ? 'No connection — check your internet and try again.' : m);
  };
  return (
    <main className="min-h-[100dvh] grid place-items-center px-4 py-10">
      <Ambient />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="w-full max-w-[380px]">
        <div className="flex flex-col items-center text-center mb-7">
          <img src="/icon.svg" alt="" className="w-[76px] h-[76px] rounded-[18px] shadow-pop" />
          <h1 className="text-2xl font-semibold tracking-tight mt-5">RamanFX</h1>
          <p className="text-[13.5px] text-ink3 mt-1.5 [text-wrap:balance]"><Icon name="shield" size={14} className="inline-block align-[-2px] mr-1.5" />Private trading journal. Sign in to continue.</p>
        </div>
        <form onSubmit={submit} className="card p-5 flex flex-col gap-3.5" aria-label="Sign in">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink2">Email</span>
            <input type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} required autoFocus className="field h-11" value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink2">Password</span>
            <span className="relative">
              <input type={show ? 'text' : 'password'} autoComplete="current-password" required className="field h-11 pr-11 w-full" value={pw} onChange={e => setPw(e.target.value)} />
              <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-ink3 hover:text-ink2"><Icon name={show ? 'eyeOff' : 'eye'} size={16} /></button>
            </span>
          </label>
          {err && <p role="alert" className="text-[13px] text-loss">{err}</p>}
          <button className="btn-primary h-11 mt-1" disabled={busy || !email || !pw}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="text-[11.5px] text-ink3 text-center mt-5 leading-relaxed">You'll stay signed in on this device until you sign out in Settings.</p>
      </motion.div>
    </main>
  );
}
