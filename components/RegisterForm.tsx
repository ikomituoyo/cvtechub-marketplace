'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterForm({ initialRole }: { initialRole?: 'buyer' | 'vendor' }) {
  const [role, setRole] = useState<'buyer' | 'vendor'>(initialRole || 'buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, storeName }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || 'Could not create your account.'); return; }
    window.location.href = role === 'vendor' ? '/vendor' : '/';
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="field">
        <label>I want to&hellip;</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setRole('buyer')}
            className={`flex-1 py-2 border text-sm font-semibold ${role === 'buyer' ? 'bg-verified text-white border-verified' : 'border-line'}`}>
            Shop
          </button>
          <button type="button" onClick={() => setRole('vendor')}
            className={`flex-1 py-2 border text-sm font-semibold ${role === 'vendor' ? 'bg-brand text-white border-brand' : 'border-line'}`}>
            Sell
          </button>
        </div>
      </div>
      <div className="field">
        <label>Full name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {role === 'vendor' && (
        <div className="field">
          <label>Store name</label>
          <input required value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
      )}
      <button type="submit" disabled={busy} className={`w-full justify-center disabled:opacity-50 ${role === 'vendor' ? 'btn-brand' : 'btn-primary'}`}>
        {busy ? 'Creating account…' : 'Create account'}
      </button>
      {error && <p className="text-alert text-sm">{error}</p>}
      <p className="text-sm text-inktext/70">Already have an account? <Link href="/login" className="font-semibold underline">Log in</Link></p>
    </form>
  );
}
