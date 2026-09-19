'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONDITION_LABELS } from '@/lib/format';

export interface ProductFormInitial {
  id?: number;
  name: string;
  categorySlug: string;
  description: string;
  priceNaira: number;
  condition: string;
  imageUrl: string;
  stockQty: number;
  status: 'active' | 'draft';
}

export default function ProductForm({
  categories, initial,
}: { categories: { name: string; slug: string }[]; initial?: ProductFormInitial }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<ProductFormInitial>(
    initial || {
      name: '', categorySlug: categories[0]?.slug || '', description: '',
      priceNaira: 0, condition: 'brand_new', imageUrl: '', stockQty: 1, status: 'active',
    }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof ProductFormInitial>(key: K, value: ProductFormInitial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const url = isEdit ? `/api/vendor/products/${initial!.id}` : '/api/vendor/products';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || 'Could not save product.'); return; }
    router.push('/vendor/products');
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id || !confirm('Delete this product?')) return;
    setBusy(true);
    await fetch(`/api/vendor/products/${initial.id}`, { method: 'DELETE' });
    router.push('/vendor/products');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="field">
        <label>Product name</label>
        <input required value={form.name} onChange={(e) => set('name', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label>Category</label>
          <select value={form.categorySlug} onChange={(e) => set('categorySlug', e.target.value)}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Condition</label>
          <select value={form.condition} onChange={(e) => set('condition', e.target.value)}>
            {Object.entries(CONDITION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label>Price (₦)</label>
          <input type="number" min={1} required value={form.priceNaira || ''} onChange={(e) => set('priceNaira', Number(e.target.value))} />
        </div>
        <div className="field">
          <label>Stock quantity</label>
          <input type="number" min={0} required value={form.stockQty} onChange={(e) => set('stockQty', Number(e.target.value))} />
        </div>
      </div>
      <div className="field">
        <label>Image URL</label>
        <input value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://images.unsplash.com/..." />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="field">
        <label>Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value as 'active' | 'draft')}>
          <option value="active">Active (visible in marketplace)</option>
          <option value="draft">Draft (hidden)</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-brand disabled:opacity-50">
          {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} disabled={busy} className="btn-outline-ink border-alert text-alert hover:bg-alert">
            Delete
          </button>
        )}
      </div>
      {error && <p className="text-alert text-sm">{error}</p>}
    </form>
  );
}
