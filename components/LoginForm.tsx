'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || 'Could not log in.'); return; }
    window.location.href = next;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="field">
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">
        {busy ? 'Logging in…' : 'Log in'}
      </button>
      {error && <p className="text-alert text-sm">{error}</p>}
      <p className="text-sm text-inktext/70">No account? <Link href="/register" className="font-semibold underline">Sign up</Link></p>
    </form>
  );
}
