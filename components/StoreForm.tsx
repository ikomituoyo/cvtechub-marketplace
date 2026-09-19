'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StoreForm({ initial }: { initial?: { name: string; description: string; location: string } }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/vendor/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, location }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || 'Could not save store.'); return; }
    router.push('/vendor');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="field">
        <label>Store name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="field">
        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Otigba Street, Computer Village" />
      </div>
      <button type="submit" disabled={busy} className="btn-brand w-full justify-center disabled:opacity-50">
        {busy ? 'Saving…' : 'Save store'}
      </button>
      {error && <p className="text-alert text-sm">{error}</p>}
    </form>
  );
}
